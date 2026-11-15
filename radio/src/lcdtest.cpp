#include <Arduino.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

LiquidCrystal_I2C lcd(0x27, 16, 2);   // your LCD was found at 0x27

void setup() {
  Serial.begin(115200);
  delay(500);
  Wire.begin(21, 22);                 // SDA, SCL
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("StudentQ Remote");
  lcd.setCursor(0, 1);
  lcd.print("Hello Nitin!");
  Serial.println("Wrote to LCD");
}

void loop() {
  // Count seconds on the bottom right so you can see it's alive
  lcd.setCursor(13, 1);
  lcd.print(millis() / 1000 % 1000);
  delay(1000);
}