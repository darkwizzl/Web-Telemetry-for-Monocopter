function randFloat(min, max, decimals = 2) {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeBar(value, min, max, length = 10) {
  const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const filled = Math.round(ratio * length);
  return "▓".repeat(filled) + " ".repeat(length - filled);
}

function updateTelemetry() {
  // SENSORS
  const altitude   = randFloat(100, 200);
  const barometer  = randFloat(990, 1030);
  const ultrasonic = randFloat(0.5, 5.0);

  const accelX = randFloat(-1, 1);
  const accelY = randFloat(-1, 1);
  const accelZ = randFloat(9, 10);

  const gyroX = randFloat(-2, 2);
  const gyroY = randFloat(-2, 2);
  const gyroZ = randFloat(-2, 2);

  const magX = randFloat(-50, 50);
  const magY = randFloat(-50, 50);
  const magZ = randFloat(-50, 50);

  const temp = randFloat(20, 30);

  document.getElementById("sensors").textContent =
`SENSORS
───────
ALT:  ${makeBar(altitude, 100, 200)} ${altitude} m
BARO: ${makeBar(barometer, 990, 1030)} ${barometer} hPa
US:   ${makeBar(ultrasonic, 0, 5)} ${ultrasonic} m

ACCEL: X: ${accelX}   Y: ${accelY}   Z: ${accelZ}
GYRO : X: ${gyroX}   Y: ${gyroY}   Z: ${gyroZ}
MAG  : X: ${magX}   Y: ${magY}   Z: ${magZ}

TEMP: ${temp} °C
SOCKET: CONNECTED (192.168.1.100:8080)`;

  // MOTORS
  const bldc1Rpm = randInt(2000, 3000);
  const bldc2Rpm = randInt(2000, 3000);
  const bldc1Temp = randInt(35, 50);
  const bldc2Temp = randInt(35, 50);

  const pitch  = randFloat(-1, 1);
  const roll   = randFloat(-1, 1);
  const yaw    = randFloat(-1, 1);
  const thrust = randFloat(0, 1);

  document.getElementById("motors").textContent =
`MOTORS & CONTROL
────────────────
[BLDC1]   RPM: ${bldc1Rpm}   TEMP: ${bldc1Temp}°C
[BLDC2]   RPM: ${bldc2Rpm}   TEMP: ${bldc2Temp}°C

JOYSTICK INPUT
──────────────
PITCH : ${makeBar(pitch, -1, 1)} ${pitch}
ROLL  : ${makeBar(roll, -1, 1)} ${roll}
YAW   : ${makeBar(yaw, -1, 1)} ${yaw}
THRUST: ${makeBar(thrust, 0, 1)} ${thrust}`;
}

// refresh every 2 seconds
setInterval(updateTelemetry, 20);

// initial call
updateTelemetry();
