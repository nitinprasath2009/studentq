#include <Arduino.h>
#include <SPI.h>
#include <MFRC522.h>
#include <RF24.h>

// ---------- RFID + buzzer (default SPI: 18, 19, 23) ----------
constexpr uint8_t SS_PIN     = 5;
constexpr uint8_t RST_PIN    = 22;
constexpr uint8_t BUZZER_PIN = 27;
MFRC522 rfid(SS_PIN, RST_PIN);

// ---------- Radio (second SPI bus: 14, 26, 13) ----------
constexpr uint8_t RADIO_SCK  = 14;
constexpr uint8_t RADIO_MISO = 26;
constexpr uint8_t RADIO_MOSI = 13;
constexpr uint8_t RADIO_CE   = 25;
constexpr uint8_t RADIO_CSN  = 33;
SPIClass hspi(HSPI);
RF24 radio(RADIO_CE, RADIO_CSN);
const byte toB[6]   = "NODEB";
const byte fromB[6] = "NODEA";

// ---------- LEDs ----------
constexpr uint8_t TX_LED_PIN = 2;    // onboard blue LED: flashes when a packet goes out
constexpr uint8_t LED_PIN    = 32;   // external LED: lights when B replies

unsigned long lastTap = 0;
unsigned int tapCount = 0;

void beep(int ms) {
  digitalWrite(BUZZER_PIN, HIGH);
  delay(ms);
  digitalWrite(BUZZER_PIN, LOW);
}

String uidToString(const MFRC522::Uid &uid) {
  String s;
  for (byte i = 0; i < uid.size; i++) {
    if (uid.uidByte[i] < 0x10) s += "0";
    s += String(uid.uidByte[i], HEX);
    if (i < uid.size - 1) s += " ";
  }
  s.toUpperCase();
  return s;
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(TX_LED_PIN, OUTPUT);

  // RFID
  SPI.begin(18, 19, 23, SS_PIN);
  rfid.PCD_Init();
  Serial.println("RFID ready");

  // Radio
  hspi.begin(RADIO_SCK, RADIO_MISO, RADIO_MOSI, RADIO_CSN);
  if (!radio.begin(&hspi)) {
    Serial.println("Radio not found");
    while (1);
  }
  radio.setPALevel(RF24_PA_LOW);
  radio.setChannel(108);
  radio.openWritingPipe(toB);
  radio.openReadingPipe(1, fromB);
  radio.startListening();
  Serial.println("Radio ready, tap a card");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;
  if (millis() - lastTap < 500) { rfid.PICC_HaltA(); return; }  // debounce
  lastTap = millis();

  tapCount++;
  Serial.println("UID: " + uidToString(rfid.uid));
  Serial.println("Tag accepted");
  Serial.println("Tap count: " + String(tapCount));
  beep(120);

  // 1. Create cardId from the first 4 UID bytes
  uint32_t cardId = 0;
  for (byte i = 0; i < 4 && i < rfid.uid.size; i++) {
    cardId = (cardId << 8) | rfid.uid.uidByte[i];
  }
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();

  // 2. Send it, with the onboard LED showing the transmission
  digitalWrite(TX_LED_PIN, HIGH);
  radio.stopListening();
  bool sent = radio.write(&cardId, sizeof(cardId));
  radio.startListening();
  Serial.println(sent ? "Radio: packet sent and received by B's radio"
                      : "Radio: packet sent, no acknowledgement");
  delay(150);
  digitalWrite(TX_LED_PIN, LOW);

  // 3. Wait for B's reply
  unsigned long start = millis();
  bool confirmed = false;
  while (millis() - start < 200) {
    if (radio.available()) {
      uint32_t reply;
      radio.read(&reply, sizeof(reply));
      confirmed = (reply == cardId);
      break;
    }
  }

  // 4. GPIO 32 LED if B replied
  if (confirmed) {
    Serial.println("Radio: reply confirmed");
    digitalWrite(LED_PIN, HIGH);
    delay(300);
    digitalWrite(LED_PIN, LOW);
  } else {
    Serial.println("Radio: no reply from B");
  }
}