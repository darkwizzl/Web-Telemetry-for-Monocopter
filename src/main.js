// monocopter-ui.js
// Replace your existing script with this. Requires Three.js to be included in the page:
// <script src="https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js"></script>

(function () {
  // Clear any previous intervals the page might have created (safe reload)
  if (Array.isArray(window.__monocopterTimers)) {
    window.__monocopterTimers.forEach(id => clearInterval(id));
  }
  window.__monocopterTimers = [];

  document.addEventListener('DOMContentLoaded', () => {
    try {
      // Check Three.js
      if (!window.THREE) {
        console.error('Three.js not found. Add: <script src="https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.min.js"></script>');
        return;
      }

      // Locate container (.panel.orientation) or fall back to body
      const panel = document.querySelector('.panel.orientation') || document.body;

      // Ensure #sensors pre exists
      let sensorsEl = document.getElementById('sensors');
      if (!sensorsEl) {
        sensorsEl = document.createElement('pre');
        sensorsEl.id = 'sensors';
        sensorsEl.style.margin = '6px';
        sensorsEl.style.whiteSpace = 'pre';
        panel.appendChild(sensorsEl);
      }

      // Ensure #motors pre exists
      let motorsEl = document.getElementById('motors');
      if (!motorsEl) {
        motorsEl = document.createElement('pre');
        motorsEl.id = 'motors';
        motorsEl.style.margin = '6px';
        motorsEl.style.whiteSpace = 'pre';
        panel.appendChild(motorsEl);
      }

      // Ensure #cubeContainer exists (do not remove existing layout if present)
let cubeContainer = document.getElementById('cubeContainer');
if (!cubeContainer) {
  cubeContainer = document.createElement('div');
  cubeContainer.id = 'cubeContainer';
  
  // CRITICAL: Remove all fixed sizing and use flex to fill parent
  cubeContainer.style.width = '100%';
  cubeContainer.style.height = '100%';
  cubeContainer.style.display = 'flex';
  cubeContainer.style.justifyContent = 'center';
  cubeContainer.style.alignItems = 'center';
  cubeContainer.style.overflow = 'hidden'; // Prevent scrolling
  
  // Add heading for orientation cube
  const orientationHeading = document.createElement('h3');
  orientationHeading.textContent = 'ORIENTATION';
  orientationHeading.style.margin = '6px';
  orientationHeading.style.fontFamily = 'Courier New, monospace';
  orientationHeading.style.color = '#eee';
  orientationHeading.style.fontSize = '0.9rem';
  orientationHeading.style.fontWeight = 'bold';
  orientationHeading.style.textAlign = 'center'; // Center the text
  orientationHeading.style.width = '100%'; // Make it full width
  
  // Create a container div for proper layout
  const orientationContainer = document.createElement('div');
  orientationContainer.style.display = 'flex';
  orientationContainer.style.flexDirection = 'column';
  orientationContainer.style.width = '100%';
  orientationContainer.style.height = '100%';
  
  // Add heading first, then the cube container
  orientationContainer.appendChild(orientationHeading);
  orientationContainer.appendChild(cubeContainer);
  
  // Replace the cubeContainer in panel with the new container
  panel.appendChild(orientationContainer);
} else {
  // If container already exists, ensure it has the correct styles
  cubeContainer.style.width = '100%';
  cubeContainer.style.height = '100%';
  cubeContainer.style.display = 'flex';
  cubeContainer.style.justifyContent = 'center';
  cubeContainer.style.alignItems = 'center';
  cubeContainer.style.overflow = 'hidden';
  
  // Add heading if it doesn't exist
  if (!document.getElementById('orientationHeading')) {
    const orientationHeading = document.createElement('h3');
    orientationHeading.id = 'orientationHeading';
    orientationHeading.textContent = 'ORIENTATION';
    orientationHeading.style.margin = '6px';
    orientationHeading.style.fontFamily = 'Courier New, monospace';
    orientationHeading.style.color = 'rgba(183, 232, 255, 1)';
    orientationHeading.style.fontSize = '0.9rem';
    orientationHeading.style.fontWeight = 'bold';
    orientationHeading.style.textAlign = 'center'; // Center the text
    orientationHeading.style.width = '100%'; // Make it full width
    
    // Create a container div for proper layout
    const orientationContainer = document.createElement('div');
    orientationContainer.style.display = 'flex';
    orientationContainer.style.flexDirection = 'column';
    orientationContainer.style.width = '100%';
    orientationContainer.style.height = '100%';
    
    // Replace cubeContainer with new container structure
    const parent = cubeContainer.parentNode;
    parent.insertBefore(orientationHeading, cubeContainer);
    
    // Move cubeContainer into the new structure
    orientationContainer.appendChild(orientationHeading);
    orientationContainer.appendChild(cubeContainer);
    parent.appendChild(orientationContainer);
  }
}







// ----- CONTROL SURFICES SETUP -----
// Ensure controlSurfaces container exists
const controlSurfacesContainer = document.querySelector('.panel.control') || document.body;

// Add heading for control surfaces
const controlHeading = document.createElement('h3');
controlHeading.textContent = 'CONTROL SURFACES';
controlHeading.style.margin = '6px';
controlHeading.style.fontFamily = 'Courier New, monospace';
controlHeading.style.color = '#8bd1ffff';
controlHeading.style.fontSize = '0.9rem';
controlHeading.style.fontWeight = 'bold';
controlHeading.style.textAlign = 'center';
controlHeading.style.width = '100%';

// Create a container div for proper layout
const controlContainer = document.createElement('div');
controlContainer.style.display = 'flex';
controlContainer.style.flexDirection = 'column';
controlContainer.style.width = '100%';
controlContainer.style.height = '100%';

// Create canvas for control surfaces
const controlSurfacesCanvas = document.createElement('canvas');
controlSurfacesCanvas.className = 'controlSurfacescanvas';
controlSurfacesCanvas.style.width = '100%';
controlSurfacesCanvas.style.height = '100%';
controlSurfacesCanvas.style.display = 'block';

// Create container div for control surfaces
const containerControlSurface = document.createElement('div');
containerControlSurface.className = 'controlSurfaces';
containerControlSurface.style.width = '100%';
containerControlSurface.style.height = '100%';
containerControlSurface.style.display = 'flex';
containerControlSurface.style.justifyContent = 'center';
containerControlSurface.style.alignItems = 'center';
containerControlSurface.style.overflow = 'hidden';

containerControlSurface.appendChild(controlSurfacesCanvas);

// Add heading first, then the control surface container
controlContainer.appendChild(controlHeading);


//new


// Create label container for values with absolute positioning
// --- Labels --- //

// Position variables (adjust these values as needed)
const topLabelPosition = { top: '60px', left: '55%', translate: '-50% 0' };
const leftLabelPosition = { bottom: '90px', left: '30px' };
const rightLabelPosition = { bottom: '90px', left: '380px' };
const labelZIndex = '10';    // Z-index to place labels above canvas

// Container for all labels with absolute positioning
const labelContainer = document.createElement('div');
labelContainer.style.position = 'absolute';
labelContainer.style.top = '0';
labelContainer.style.left = '0';
labelContainer.style.width = '100%';
labelContainer.style.height = '100%';
labelContainer.style.zIndex = labelZIndex;
labelContainer.style.pointerEvents = 'none'; // Allow clicks to pass through to canvas

// Top label (centered)
const topLabel = document.createElement('div');
topLabel.style.position = 'absolute';
topLabel.style.top = topLabelPosition.top;
topLabel.style.left = topLabelPosition.left;
topLabel.style.transform = topLabelPosition.translate;
topLabel.style.fontFamily = 'Courier New, monospace';
topLabel.style.fontSize = '0.85rem';
topLabel.style.color = '#eee';
topLabel.textContent = 'top: 10';

// Left label
const leftLabel = document.createElement('div');
leftLabel.style.position = 'absolute';
leftLabel.style.bottom = leftLabelPosition.bottom;
leftLabel.style.left = leftLabelPosition.left;
leftLabel.style.fontFamily = 'Courier New, monospace';
leftLabel.style.fontSize = '0.85rem';
leftLabel.style.color = '#eee';
leftLabel.textContent = 'left: 6';

// Right label
const rightLabel = document.createElement('div');
rightLabel.style.position = 'absolute';
rightLabel.style.bottom = rightLabelPosition.bottom;
rightLabel.style.left = rightLabelPosition.left;
rightLabel.style.fontFamily = 'Courier New, monospace';
rightLabel.style.fontSize = '0.85rem';
rightLabel.style.color = '#eee';
rightLabel.textContent = 'right: 7';

// Add labels to container
labelContainer.appendChild(topLabel);
labelContainer.appendChild(leftLabel);
labelContainer.appendChild(rightLabel);

// Append container to controlContainer
controlContainer.style.position = 'relative'; // Ensure positioning context
controlContainer.appendChild(labelContainer);

//new



controlContainer.appendChild(containerControlSurface);

// Replace in controlSurfacesContainer
controlSurfacesContainer.appendChild(controlContainer);





// Utility function for degrees to radians
function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}






// Control surfaces scene
const scene1 = new THREE.Scene();
//scene1.background = new THREE.Color("rgb(69, 70, 92)");

// Materials
const cubeMaterial = new THREE.MeshBasicMaterial({ 
  color: 0x00ffff, 
  transparent: true, 
  opacity: 0.5 
});

const cuboid = new THREE.BoxGeometry(0.3, 3, 1);

// Create control surfaces
const controlsurface1 = new THREE.Mesh(cuboid, cubeMaterial);
const controlsurface2 = new THREE.Mesh(cuboid, cubeMaterial);
const controlsurface3 = new THREE.Mesh(cuboid, cubeMaterial);

// Add outlines
const outline1 = new THREE.LineSegments(
  new THREE.EdgesGeometry(controlsurface1.geometry),
  new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 })
);
controlsurface1.add(outline1);

const outline2 = new THREE.LineSegments(
  new THREE.EdgesGeometry(controlsurface2.geometry),
  new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 })
);
controlsurface2.add(outline2);

const outline3 = new THREE.LineSegments(
  new THREE.EdgesGeometry(controlsurface3.geometry),
  new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 })
);
controlsurface3.add(outline3);

// AxesHelper
const axesHelper1 = new THREE.AxesHelper(5);

// Lights
const color1 = 0xFFFFFF;
const intensity1 = 2.4;
const ambientLight1 = new THREE.AmbientLight(color1, intensity1);
const directionalLight1 = new THREE.DirectionalLight(0xFFFFFF, 2);
const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 2);

directionalLight1.position.set(15, 15, 0);
directionalLight1.target.position.set(0, 0, 0);

directionalLight2.position.set(-15, 15, 0);
directionalLight2.target.position.set(0, 0, 0);

// Position control surfaces in triangular formation
const l = 4;
const height = (Math.sqrt(3) / 2) * l;
const vertexDistance = (2 / 3) * height;
const baseY = -(1 / 3) * height;

controlsurface1.position.set(0, vertexDistance, 0);
controlsurface2.position.set(-l/2, baseY, 0);
controlsurface3.position.set(l/2, baseY, 0);

// Rotation order and initial rotation
controlsurface1.rotation.order = 'ZYX';
controlsurface2.rotation.order = 'ZYX';
controlsurface3.rotation.order = 'ZYX';

controlsurface2.rotation.z = degToRad(-60);
controlsurface3.rotation.z = degToRad(60);

// Add objects to scene
scene1.add(controlsurface1);
scene1.add(controlsurface2);
scene1.add(controlsurface3);
scene1.add(axesHelper1);
scene1.add(ambientLight1);
scene1.add(directionalLight1);
scene1.add(directionalLight2);

// Camera
const camera1 = new THREE.PerspectiveCamera(
  45,
  (containerControlSurface.clientWidth / containerControlSurface.clientHeight),
  0.1,
  2000
);
camera1.position.set(0, 0, 10);
camera1.lookAt(0, 0, 0);

// Renderer
const renderer1 = new THREE.WebGLRenderer({
  canvas: controlSurfacesCanvas,
  antialias: true,
  alpha: true
});

// Handle resize for control surfaces
function handleControlResize() {
  const width = containerControlSurface.clientWidth;
  const height = containerControlSurface.clientHeight;
  
  renderer1.setSize(width, height, false);
  camera1.aspect = width / height;
  camera1.updateProjectionMatrix();
  renderer1.render(scene1, camera1);
}

// Set initial size and add resize listener
handleControlResize();
window.addEventListener('resize', handleControlResize);

// Animation loop for control surfaces
(function animateControl() {
  requestAnimationFrame(animateControl);
  renderer1.render(scene1, camera1);
})();
// -------------------------------END OF CONTROL SURFACES-------------------------------------------------------------------




// ----- THREE.JS SETUP: simple cube + axes ----------------------------------------------------------------------------------
const scene = new THREE.Scene();

// Camera - initialize with default aspect ratio, will be updated
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.set(3, 3, 6);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ 
  antialias: true, 
  alpha: true,
  // Remove the default inline styles that Three.js adds
  canvas: document.createElement('canvas')
});
renderer.setPixelRatio(window.devicePixelRatio || 1);

// Remove any fixed sizing from the canvas element
const canvas = renderer.domElement;
canvas.style.display = 'block';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.maxWidth = '100%';
canvas.style.maxHeight = '100%';

// Add to DOM first
cubeContainer.innerHTML = '';
cubeContainer.appendChild(canvas);

// Handle resize - optimized version
function handleResize() {
  const containerWidth = cubeContainer.clientWidth;
  const containerHeight = cubeContainer.clientHeight;
  
  // Set renderer to fill container (use actual pixels, not CSS pixels)
  renderer.setSize(containerWidth, containerHeight, false);
  
  // Update camera
  camera.aspect = containerWidth / containerHeight;
  camera.updateProjectionMatrix();
  

}

// Set initial size and add resize listener
handleResize();
window.addEventListener('resize', handleResize);

// Simple cube with edges + axes
const cubeGeom = new THREE.BoxGeometry(2, 2, 2);

// Solid cube
const cubeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
const cube = new THREE.Mesh(cubeGeom, cubeMat);
scene.add(cube);

// Edges (border lines)
const edges = new THREE.EdgesGeometry(cubeGeom);
const edgeMat = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 1 });
const cubeEdges = new THREE.LineSegments(edges, edgeMat);
cube.add(cubeEdges);

// Axes helper
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);
// -------------------------------------Orientation ends here ----------------------------------------------------------


// ---------------------------fucntion to setup websocket-----------------------------------------------------
function setupWebSocket() {
  const socket = new WebSocket('ws://127.0.0.1:8080'); // Your RPi Zero address
  
  socket.onopen = function() {
    console.log('WebSocket connected to monocopter');
  };
  
  socket.onmessage = function(event) {
    try {
      const data = JSON.parse(event.data);
      console.log(data);
      updateTelemetry(data); // Pass real data instead of generating random
    } catch (err) {
      console.error('WebSocket data parse error', err);
    }
  };
  
  socket.onerror = function(error) {
    console.error('WebSocket error', error);
  };
  
  socket.onclose = function() {
    console.log('WebSocket disconnected');
  };
  
  return socket;
}

// Call this after your Three.js setup
const monocopterSocket = setupWebSocket();








// Animation loop for three js
(function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
})();

      // ----- utility helpers -----
      function randFloat(min, max, decimals = 2) {
        const val = Math.random() * (max - min) + min;
        return parseFloat(val.toFixed(decimals));
      }
      function randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }
      function makeBar(value, min, max, length = 12) {
        const ratio = Math.max(0, Math.min(1, (value - min) / (max - min)));
        const filled = Math.round(ratio * length);
        return "▓".repeat(filled) + " ".repeat(length - filled);
      }
      function fix(n, d = 2) { return (typeof n === 'number') ? n.toFixed(d) : n; }

 // Function to control each control surface with 0-180 degree servo angles
function updateControlSurfaces(servo1Angle, servo2Angle, servo3Angle) {
  // Convert servo angles (0-180) to rotation radians (-90° to +90°)
  // 90° servo angle = 0° rotation (neutral)
  // 0° servo angle = -90° rotation (full negative)
  // 180° servo angle = +90° rotation (full positive)
  updateAngleDisplay(servo1Angle,servo2Angle,servo3Angle);
  
  const servo1Rad = (servo1Angle - 90) * (Math.PI / 180);
  const servo2Rad = (servo2Angle - 90) * (Math.PI / 180);
  const servo3Rad = (servo3Angle - 90) * (Math.PI / 180);
  
  // Apply rotations to each control surface
  controlsurface1.rotation.y = servo1Rad;  // Top surface
  controlsurface2.rotation.y = servo2Rad;  // Bottom-left surface  
  controlsurface3.rotation.y = servo3Rad;  // Bottom-right surface
}




//update the texts in controlsurface div
function updateAngleDisplay(angle1, angle2, angle3) {
    topLabel.textContent = `TOP: ${angle1.toFixed(1)}°`;
    leftLabel.textContent = `LEFT: ${angle2.toFixed(1)}°`;
    rightLabel.textContent = `RIGHT: ${angle3.toFixed(1)}°`;
}

// fucntion to control the rotation of the orientation cube
function updateOrientationFromQuaternion(w, x, y, z) {
  // Directly set the cube's orientation from quaternion values
  // MPU6050 typically provides quaternion in w, x, y, z order
  cube.quaternion.set(x, y, z, w);
}

      // ----- Telemetry update (demo random data). Update this to use your socket values -----
function updateTelemetry(data) {
  try {
    // --- CONTROL SURFACES (Servos) ---
    // Update control surfaces with actual servo angles
    updateControlSurfaces(data.servo1, data.servo2, data.servo3);

    // --- ORIENTATION (Quaternion) ---
    const length = Math.sqrt(
      data.quatW * data.quatW +
      data.quatX * data.quatX +
      data.quatY * data.quatY +
      data.quatZ * data.quatZ
    );

    // Normalize quaternion
    const normalizedW = data.quatW / length;
    const normalizedX = data.quatX / length;
    const normalizedY = data.quatY / length;
    const normalizedZ = data.quatZ / length;

    updateOrientationFromQuaternion(normalizedW, normalizedX, normalizedY, normalizedZ);

    // --- DISPLAY SENSOR VALUES ---
   sensorsEl.textContent =
`SENSORS
───────
ALT:  ${makeBar(data.altitude, 100, 200)} ${data.altitude.toFixed(3)} m
BARO: ${makeBar(data.barometer, 990, 1030)} ${data.barometer.toFixed(3)} hPa
US:   ${makeBar(data.ultrasonic, 0, 5)} ${data.ultrasonic.toFixed(3)} m


ACCEL: X:${data.accelX.toFixed(3)} Y:${data.accelY.toFixed(3)} Z:${data.accelZ.toFixed(3)}
GYRO : X:${data.gyroX.toFixed(3)} Y:${data.gyroY.toFixed(3)} Z:${data.gyroZ.toFixed(3)}
MAG  : X:${data.magX.toFixed(3)} Y:${data.magY.toFixed(3)} Z:${data.magZ.toFixed(3)}

TEMP: ${data.temp.toFixed(3)} °C




SOCKET: CONNECTED (192.168.1.100:8080)`;

motorsEl.textContent =
`MOTORS & CONTROL
────────────────
[BLDC1]   RPM: ${data.bldc1Rpm}   TEMP: ?°C
[BLDC2]   RPM: ${data.bldc2Rpm}   TEMP: ?°C



JOYSTICK INPUT (norm)
──────────────
PITCH : ${makeBar(data.pitch, -1, 1)} ${data.pitch.toFixed(3)}
ROLL  : ${makeBar(data.roll, -1, 1)} ${data.roll.toFixed(3)}
YAW   : ${makeBar(data.yaw, -1, 1)} ${data.yaw.toFixed(3)}
THRUST: ${makeBar(data.thrust, 0, 1)} ${data.thrust.toFixed(3)}`;

  } catch (err) {
    console.error('updateTelemetry error', err);
  }
}


//------------------------------updateTelemetryFunction ends here-------------------------------------------------------


const telemetryData = {
  servo1: 0,
  servo2: 0,
  servo3: 0,
  altitude: 0,
  barometer: 0,
  ultrasonic: 0,
  accelX: 0,
  accelY: 0,
  accelZ: 0,
  gyroX: 0,
  gyroY: 0,
  gyroZ: 0,
  magX: 0,
  magY: 0,
  magZ: 0,
  temp: 0,
  quatW: 1,
  quatX: 0,
  quatY: 0,
  quatZ: 0,
  bldc1Rpm: 0,
  bldc2Rpm: 0,
  pitch: 0,
  roll: 0,
  yaw: 0,
  thrust: 0
};

      // initial call
      updateTelemetry(telemetryData);

    } catch (err) {
      console.error('monocopter-ui top-level error', err);
    }
  });
})();