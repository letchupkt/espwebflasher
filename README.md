# ESP32 Simple Flasher

A simplified ESP32 firmware flasher that provides a "plug and flash" experience.

## How to Use

1. **Prepare Your Firmware**
   - Place your compiled ESP32 firmware binary in `public/firmware/`
   - Rename it to `firmware.bin`

2. **Connect Your ESP32**
   - Connect your ESP32 to your computer via USB
   - Make sure the ESP32 is in download mode (if required)

3. **Flash the Firmware**
   - Open the web application
   - Click "Connect to ESP32"
   - Select your ESP32 port from the browser dialog
   - Click "Flash Firmware" once connected
   - Wait for the process to complete

## Requirements

- Modern web browser with Web Serial API support (Chrome, Edge, Opera)
- ESP32 device
- USB cable
- Compiled firmware binary (.bin file)

## Installation

```bash
npm install
npm start
```

## Building for Production

```bash
npm run build
```

## Browser Compatibility

This application requires a browser that supports the Web Serial API:
- Chrome 89+
- Edge 89+
- Opera 75+

Firefox and Safari are not currently supported due to lack of Web Serial API support.

## Firmware Requirements

- Your firmware must be a compiled ESP32 binary (.bin file)
- Place the firmware file in `public/firmware/firmware.bin`
- The flasher will automatically detect and load this firmware

## Troubleshooting

- **Connection Issues**: Make sure your ESP32 is properly connected and drivers are installed
- **Flash Failures**: Ensure your ESP32 is in download mode and the firmware is compatible
- **Browser Not Supported**: Use Chrome, Edge, or Opera with Web Serial API support
