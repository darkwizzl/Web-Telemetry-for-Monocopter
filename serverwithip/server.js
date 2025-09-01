const WebSocket = require('ws');
const PORT = 8080;

// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });
console.log(`WebSocket server running on ws://localhost:${PORT}`);

// Utility functions to generate random numbers
function randFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Handle messages from client
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });

  // Send telemetry data every 100ms
  setInterval(() => {
    const telemetryData = {
      servo1: randFloat(0, 180),
      servo2: randFloat(0, 180),
      servo3: randFloat(0, 180),
      altitude: randFloat(100, 200),
      barometer: randFloat(990, 1030),
      ultrasonic: randFloat(0.5, 5.0),
      accelX: randFloat(-1, 1),
      accelY: randFloat(-1, 1),
      accelZ: randFloat(9, 10),
      gyroX: randFloat(-2, 2),
      gyroY: randFloat(-2, 2),
      gyroZ: randFloat(-2, 2),
      magX: randFloat(-50, 50),
      magY: randFloat(-50, 50),
      magZ: randFloat(-50, 50),
      temp: randFloat(20, 30),
      quatW: randFloat(-1, 1),
      quatX: randFloat(-1, 1),
      quatY: randFloat(-1, 1),
      quatZ: randFloat(-1, 1),
      bldc1Rpm: randInt(2000, 3000),
      bldc2Rpm: randInt(2000, 3000),
      pitch: randFloat(-1, 1),
      roll: randFloat(-1, 1),
      yaw: randFloat(-1, 1),
      thrust: randFloat(0, 1)
    };

    // Send telemetry as JSON
    console.log('Sending telemetry:', telemetryData);
    ws.send(JSON.stringify(telemetryData));
  }, 30); // every 100ms
});
