#include <Arduino.h>
#include <SPI.h>
#include <Wire.h>
#include <RF24.h>
#include <LiquidCrystal_I2C.h>

// ---------- Radio ----------
RF24 radio(4, 5);                       // CE, CSN
const byte toA[6]   = "NODEA";
const byte fromA[6] = "NODEB";

// ---------- Pins ----------
constexpr uint8_t LED_PIN    = 15;
constexpr uint8_t BUTTON_PIN = 32;
constexpr uint8_t LCD_SDA    = 21;
constexpr uint8_t LCD_SCL    = 22;

// ---------- Sending animation timing ----------
constexpr unsigned long DOT_INTERVAL   = 250;   // ms between . .. ...
constexpr unsigned long RETRY_INTERVAL = 300;   // ms between send attempts
constexpr unsigned long MIN_SEND_SHOW  = 750;   // show the dots at least this long
constexpr unsigned long MAX_SEND_TIME  = 1500;  // give up after this

// ---------- Packet format (must match the hub) ----------
enum : uint8_t { PKT_CARD = 1, PKT_REPLY = 2, PKT_BUTTON = 3 };
struct __attribute__((packed)) Packet {
  uint8_t  type;
  uint32_t value;
};

LiquidCrystal_I2C* lcd = nullptr;

unsigned int rxCount = 0;
unsigned int txCount = 0;
uint32_t buttonPresses = 0;
unsigned long statusUntil = 0;
unsigned long ledOffAt = 0;
bool idleShown = false;

// Button send state
bool sending = false;
bool sendOk = false;
unsigned long sendStart = 0;
unsigned long lastDot = 0;
unsigned long lastTry = 0;
uint8_t dots = 0;

// ---------- LCD helpers ----------
void lcdLine(uint8_t row, const String &text) {
  if (!lcd) return;
  String t = text;
  while (t.length() < 16) t += ' ';
  lcd->setCursor(0, row);
  lcd->print(t.substring(0, 16));
}

// Top line: step name. Bottom line: bar + percent
void progress(const String &label, uint8_t percent) {
  Serial.printf("[%3d%%] %s\n", percent, label.c_str());
  lcdLine(0, label);
  if (!lcd) return;
  char line[17];
  uint8_t filled = (percent * 11) / 100;
  for (uint8_t i = 0; i < 11; i++) line[i] = (i < filled) ? (char)255 : '.';
  snprintf(line + 11, 6, " %3d%%", percent);
  lcd->setCursor(0, 1);
  lcd->print(line);
}

void showStatus(const String &l1, const String &l2, unsigned long ms) {
  lcdLine(0, l1);
  lcdLine(1, l2);
  statusUntil = millis() + ms;
  idleShown = false;
}

void showIdle() {
  char buf[17];
  snprintf(buf, sizeof(buf), "RX:%-4u TX:%-4u", rxCount, txCount);
  lcdLine(0, buf);
  lcdLine(1, "Waiting for hub");
  idleShown = true;
}

uint8_t findLcd() {
  Wire.begin(LCD_SDA, LCD_SCL);
  const uint8_t candidates[] = {0x27, 0x3F};
  for (uint8_t addr : candidates) {
    Wire.beginTransmission(addr);
    if (Wire.endTransmission() == 0) return addr;
  }
  return 0;
}

// ---------- Radio helper ----------
bool sendPacket(uint8_t type, uint32_t value) {
  Packet p{type, value};
  radio.stopListening();
  bool ok = radio.write(&p, sizeof(p));
  radio.startListening();
  return ok;
}

void flashLed(unsigned long ms) {
  digitalWrite(LED_PIN, HIGH);
  ledOffAt = millis() + ms;
}

// ---------- Button send with animated dots ----------
void startButtonSend() {
  buttonPresses++;
  sending = true;
  sendOk = false;
  sendStart = millis();
  lastDot = 0;
  lastTry = 0;
  dots = 0;
  idleShown = false;
  lcdLine(0, "Button #" + String(buttonPresses));
  flashLed(150);
  Serial.printf("Button #%lu: sending\n", (unsigned long)buttonPresses);
}

void updateButtonSend() {
  unsigned long now = millis();

  // Animate: Sending. -> Sending.. -> Sending... -> Sending.
  if (now - lastDot >= DOT_INTERVAL) {
    dots = (dots % 3) + 1;
    String line = "Sending";
    for (uint8_t i = 0; i < dots; i++) line += '.';
    lcdLine(1, line);
    lastDot = now;
  }

  // Keep trying until the hub acknowledges
  if (!sendOk && now - lastTry >= RETRY_INTERVAL) {
    sendOk = sendPacket(PKT_BUTTON, buttonPresses);
    lastTry = now;
  }

  // Finish: success after the minimum show time, or give up at the max
  unsigned long elapsed = now - sendStart;
  if ((sendOk && elapsed >= MIN_SEND_SHOW) || elapsed >= MAX_SEND_TIME) {
    sending = false;
    txCount++;
    showStatus("Button #" + String(buttonPresses),
               sendOk ? "Hub got it" : "No ACK from hub", 2000);
    Serial.printf("Button #%lu: %s\n", (unsigned long)buttonPresses,
                  sendOk ? "hub acked" : "no ack");
  }
}

// ---------- Setup with progress check ----------
void setup() {
  Serial.begin(115200);
  delay(500);
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);

  uint8_t addr = findLcd();
  if (addr) {
    lcd = new LiquidCrystal_I2C(addr, 16, 2);
    lcd->init();
    lcd->backlight();
    Serial.printf("LCD found at 0x%02X\n", addr);
  } else {
    Serial.println("LCD not found: check SDA 21, SCL 22, power");
  }

  progress("Starting up", 10);   delay(300);
  progress("LCD ready", 25);     delay(300);

  progress("Radio check", 50);
  if (!radio.begin()) {
    Serial.println("Radio not found");
    lcdLine(0, "Radio FAIL");
    lcdLine(1, "Check wiring");
    while (1) {
      digitalWrite(LED_PIN, !digitalRead(LED_PIN));
      delay(500);
    }
  }
  delay(300);

  progress("Radio config", 75);
  radio.setPALevel(RF24_PA_LOW);
  radio.setChannel(108);
  radio.openWritingPipe(toA);
  radio.openReadingPipe(1, fromA);
  radio.startListening();
  delay(300);

  progress("Ready", 100);        delay(700);
  Serial.println("Responder ready");
  showIdle();
}

// ---------- Main loop ----------
void loop() {
  // 1. Card IDs coming from the hub
  if (radio.available()) {
    Packet p;
    radio.read(&p, sizeof(p));
    if (p.type == PKT_CARD) {
      rxCount++;
      flashLed(200);
      delay(5);                                   // let the hub switch to listening
      bool ok = sendPacket(PKT_REPLY, p.value);
      txCount++;

      char l1[17];
      snprintf(l1, sizeof(l1), "Card %08lX", (unsigned long)p.value);
      showStatus(l1, ok ? "Reply sent" : "Reply no ACK", 2000);
      Serial.printf("Got card %08lX, reply %s\n",
                    (unsigned long)p.value, ok ? "acked" : "not acked");
    }
  }

  // 2. Button press starts an animated send
  static bool lastBtn = HIGH;
  static unsigned long lastChange = 0;
  bool btn = digitalRead(BUTTON_PIN);
  if (btn != lastBtn && millis() - lastChange > 30) {     // debounce
    lastChange = millis();
    lastBtn = btn;
    if (btn == LOW && !sending) startButtonSend();
  }

  // 3. Keep the send animation and retries running
  if (sending) updateButtonSend();

  // 4. Timers
  if (ledOffAt && millis() > ledOffAt) {
    digitalWrite(LED_PIN, LOW);
    ledOffAt = 0;
  }
  if (!sending && !idleShown && millis() > statusUntil) showIdle();
}