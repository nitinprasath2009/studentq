# StudentQ

A classroom student-response system, built as two separate parts that do not depend on each other.

| Folder | What it is |
| --- | --- |
| [`radio/`](radio) | ESP32 firmware (PlatformIO) for the classroom radio hardware |
| [`admin/`](admin) | School admin console (React + Vite + TypeScript) |

Both parts are early prototypes.

## radio

A PlatformIO project for an ESP32 (`nodemcu-32s`). `platformio.ini` defines two environments:

- `hub` (`src/main.cpp`): RC522 RFID reader, buzzer and nRF24 radio. It reads a card and sends the card ID.
- `responder` (`src/reciever.cpp`): nRF24 radio, I2C LCD and a button. This is the default environment.

`src/btntest.cpp` and `src/lcdtest.cpp` are bring-up sketches. `StudentQ_Radio_Test_Circuit_Diagram.pdf` is the circuit overview.

Open the `radio/` folder in PlatformIO, and change `upload_port` and `monitor_port` in `platformio.ini` to match your serial device.

## admin

A school admin console that runs on fixture data, with no backend. It bundles the two small libraries it depends on, so it installs and builds on its own.

```
cd admin
npm install
npm run dev
```

See [`admin/README.md`](admin/README.md) for the full layout and scripts.
