/*
 * ESP32 Simple Flasher
 * Developer: letchupkt
 * Instagram: @letchu_pkt
 * GitHub: letchupkt
 * LinkedIn: lakshmikanthank
 * 
 * A simplified ESP32 firmware flasher for plug-and-flash experience
 */

import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'

import { connectESP, formatMacAddr, supported } from './lib/esp'

const App = () => {
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [flashing, setFlashing] = useState(false)
  const [espStub, setEspStub] = useState(undefined)
  const [firmwareReady, setFirmwareReady] = useState(false)
  const [logs, setLogs] = useState([])
  const [connectionAttempts, setConnectionAttempts] = useState(0)

  useEffect(() => {
    // Check if firmware file exists
    checkFirmware()
  }, [])

  const checkFirmware = async () => {
    try {
      const response = await fetch('/firmware/firmware.bin')
      setFirmwareReady(response.ok)
    } catch (error) {
      setFirmwareReady(false)
    }
  }

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `${timestamp} - ${message}`])
  }

  const connectToESP32 = async () => {
    if (!supported()) {
      toast.error('Web Serial API not supported. Please use Chrome, Edge, or Opera.')
      return
    }

    if (espStub) {
      await espStub.disconnect()
      await espStub.port.close()
      setEspStub(undefined)
      setConnected(false)
      addLog('Disconnected')
      return
    }

    try {
      setConnecting(true)
      setConnectionAttempts(prev => prev + 1)
      addLog('Connecting to ESP32...')

      const esploader = await connectESP({
        log: (msg) => addLog(msg),
        debug: (...args) => console.debug(...args),
        error: (...args) => console.error(...args),
        baudRate: 115200,
      })

      await esploader.initialize()
      addLog(`Connected to ${esploader.chipName}`)
      addLog(`MAC Address: ${formatMacAddr(esploader.macAddr())}`)

      const newEspStub = await esploader.runStub()

      newEspStub.port.addEventListener('disconnect', () => {
        setConnected(false)
        setEspStub(undefined)
        addLog('Connection lost')
      })

      setEspStub(newEspStub)
      setConnected(true)
      setConnectionAttempts(0) // Reset attempts on successful connection
      addLog('Ready to flash')

    } catch (error) {
      const errorMsg = error.message || error.toString()
      addLog(`Connection failed: ${errorMsg}`)

      if (errorMsg.includes("sync to ESP") || errorMsg.includes("Couldn't sync")) {
        toast.error('Put ESP32 in download mode: Hold BOOT → Press RESET → Release RESET → Release BOOT', {
          autoClose: 8000
        })
        addLog('TIP: Put ESP32 in download mode before connecting')
        addLog('1. Hold BOOT button')
        addLog('2. Press and release RESET button')
        addLog('3. Release BOOT button')
        addLog('4. Try connecting again')
      } else if (errorMsg.includes("No port selected")) {
        toast.error('No port selected. Make sure ESP32 is connected via USB')
      } else {
        toast.error('Connection failed. Check USB connection and try again')
      }
    } finally {
      setConnecting(false)
    }
  }

  const flashFirmware = async () => {
    if (!connected || !firmwareReady) return

    setFlashing(true)
    addLog('Starting firmware flash...')

    try {
      const response = await fetch('/firmware/firmware.bin')
      const firmwareData = await response.arrayBuffer()

      await espStub.flashData(
        firmwareData,
        (bytesWritten, totalBytes) => {
          const progress = Math.floor((bytesWritten / totalBytes) * 100)
          addLog(`Flashing... ${progress}%`)
        },
        0x10000 // Default offset for ESP32
      )

      addLog('Firmware flashed successfully!')
      addLog('Please reset your ESP32 to run the new firmware')
      toast.success('Firmware flashed successfully!')

    } catch (error) {
      addLog(`Flash failed: ${error.message}`)
      toast.error('Flash failed')
    } finally {
      setFlashing(false)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>ESP32 Flasher</h1>
          <p>Make Your Project Easy</p>
        </div>

        <div className="instructions">
          <h3>Before Flashing:</h3>
          <ol>
            <li>Make sure you Connect The ESP32 Properly</li>
            <li>Put ESP32 in Download Mode (Hold BOOT button, press RESET, release RESET, release BOOT)</li>
            <li>Click Connect to establish connection with ESP32</li>
            <li>Click Flash firmware to upload the firmware</li>
          </ol>
          <div className="troubleshoot">
            <strong>Connection Issues?</strong>
            <ul>
              <li>Try putting ESP32 in download mode before connecting</li>
              <li>Hold BOOT button while clicking Connect</li>
              <li>Check if correct COM port is selected</li>
              <li>Try different USB cable or port</li>
            </ul>
          </div>
        </div>

        <div className="connection-section">
          <h3>🔧 Connection Settings</h3>
          <button
            className={`connect-btn ${connected ? 'connected' : 'disconnected'}`}
            onClick={connectToESP32}
            disabled={connecting}
          >
            📱 {connecting ? 'Connecting...' : connected ? 'Disconnect' : 'Connect to ESP32'}
          </button>
          {connectionAttempts > 0 && !connected && (
            <div className="retry-info">
              Attempts: {connectionAttempts} | Try download mode: Hold BOOT → Press RESET → Release RESET → Release BOOT
            </div>
          )}
          <div className="status">
            <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></span>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <div className="firmware-section">
          <h3>ℹ️ Firmware Information</h3>
          <div className="firmware-info">
            <div>Ready to Flash: {firmwareReady ? 'Yes' : 'No'}</div>
            <div>Firmware: firmware.bin</div>
            <div>Location: /firmware/firmware.bin</div>
            <div>Status: {firmwareReady ? 'Ready' : 'Not Found'}</div>
          </div>
        </div>

        <button
          className="flash-btn"
          onClick={flashFirmware}
          disabled={!connected || !firmwareReady || flashing}
        >
          ⚡ {flashing ? 'Flashing...' : 'Flash Firmware'}
        </button>

        <div className="logs-section">
          <div className="logs">
            {logs.map((log, index) => (
              <div key={index} className="log-entry">{log}</div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  )
}

export default App