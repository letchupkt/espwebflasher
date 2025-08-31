ESP32 Firmware Folder
=====================

Place your ESP32 firmware binary file here and rename it to "firmware.bin"

Instructions:
1. Delete the existing firmware.bin file (if it's a placeholder)
2. Copy your compiled ESP32 firmware (.bin file) to this folder
3. Rename your firmware file to exactly "firmware.bin"
4. The web flasher will automatically detect and use this firmware

Example:
- If you have "my_project.bin", rename it to "firmware.bin"
- If you have "esp32_code.bin", rename it to "firmware.bin"

The firmware file must be:
- A compiled ESP32 binary (.bin format)
- Named exactly "firmware.bin" (case sensitive)
- Compatible with your ESP32 device

Note: Only one firmware file is supported at a time.