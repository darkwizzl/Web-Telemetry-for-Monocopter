# Monocopter UI Documentation

## Overview

This JavaScript code creates a 3D visualization dashboard for monitoring and controlling a monocopter drone. It uses Three.js for 3D rendering and WebSockets for real-time data communication with the drone's flight controller.

## Key Components

### 1. DOM Structure Setup
- **Orientation Panel**: Contains 3D orientation cube and sensor readings
- **Control Panel**: Contains 3D control surfaces visualization and motor data
- **Dynamic Element Creation**: Creates necessary DOM elements if they don't exist

### 2. Three.js Visualizations

#### Orientation Cube
- **Purpose**: Visualizes the drone's orientation in 3D space
- **Components**:
  - Transparent cube with blue edges
  - Coordinate axes helper
  - Responsive to container size changes
- **Data Source**: Quaternion data from IMU (w, x, y, z values)

#### Control Surfaces
- **Purpose**: Shows the current positions of the three control servos
- **Components**:
  - Three rectangular surfaces arranged in a triangular formation
  - Each surface rotates based on servo input (0-180°)
  - Labels showing current angle values for each surface
- **Control Logic**: 
  - 90° servo angle = 0° rotation (neutral)
  - 0° servo angle = -90° rotation (full negative)
  - 180° servo angle = +90° rotation (full positive)

### 3. WebSocket Communication
- **Connection**: Establishes WebSocket connection to `ws://127.0.0.1:9002`
- **Data Flow**: Receives JSON data from the drone's flight controller
- **Error Handling**: Includes connection error and data parsing error handling

### 4. Data Structure
The expected telemetry data format:

```javascript
{
  // Control surfaces
  servo1: 0-180,    // Top servo angle
  servo2: 0-180,    // Bottom-left servo angle  
  servo3: 0-180,    // Bottom-right servo angle
  
  // Sensors
  altitude: number,    // Meters
  barometer: number,   // hPa
  ultrasonic: number,  // Meters
  accelX: number,     // Acceleration values
  accelY: number,
  accelZ: number,
  gyroX: number,      // Gyroscope values
  gyroY: number,
  gyroZ: number,
  magX: number,       // Magnetometer values
  magY: number,
  magZ: number,
  temp: number,       // Temperature in °C
  
  // Orientation
  quatW: number,      // Quaternion components
  quatX: number,
  quatY: number,
  quatZ: number,
  
  // Motors
  bldc1Rpm: number,   // RPM of first motor
  bldc2Rpm: number,   // RPM of second motor
  
  // Control inputs
  pitch: number,      // -1 to 1
  roll: number,       // -1 to 1
  yaw: number,        // -1 to 1
  thrust: number      // 0 to 1
}
```

### 5. Utility Functions
- `randFloat()`: Generate random float values
- `randInt()`: Generate random integer values
- `makeBar()`: Create visual bar representations of values
- `fix()`: Format numbers to fixed decimal places
- `degToRad()`: Convert degrees to radians
- `updateControlSurfaces()`: Update control surface positions based on servo angles
- `updateOrientationFromQuaternion()`: Update cube orientation from quaternion data
- `updateTelemetry()`: Main function to process incoming data and update UI

## Setup Requirements

1. Include Three.js in your HTML:
```html
<script src="https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js"></script>
```

2. Ensure your HTML has containers with classes `.panel.orientation` and `.panel.control`

3. The drone's flight controller should send JSON data via WebSocket to port 9002

## Key Concepts for New Team Members

1. **Three.js Basics**: Understand scenes, cameras, renderers, meshes, and materials
2. **Quaternions**: Method for representing 3D rotations without gimbal lock
3. **WebSocket Protocol**: Real-time bidirectional communication
4. **Responsive Design**: UI elements resize based on container dimensions
5. **Data Normalization**: Converting raw sensor data to visual representations

## Troubleshooting

1. **Three.js not loading**: Check console for error and verify CDN link
2. **WebSocket connection issues**: Verify flight controller is running and accessible
3. **Visual glitches**: Check container dimensions and CSS conflicts
4. **Performance issues**: Reduce animation complexity or use simpler geometries

## Extension Points

1. Add control inputs to send commands back to the drone
2. Implement data logging and playback features
3. Add additional visualization modes (e.g., flight path, battery status)
4. Enhance with more sophisticated shaders and lighting effects
