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
  controlSurfacesContainer.appendChild(containerControlSurface);

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



// ----- THREE.JS SETUP: simple cube + axes -----
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
  
  console.log('Canvas size:', containerWidth, 'x', containerHeight);
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

// Animation loop
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
  
  const servo1Rad = (servo1Angle - 90) * (Math.PI / 180);
  const servo2Rad = (servo2Angle - 90) * (Math.PI / 180);
  const servo3Rad = (servo3Angle - 90) * (Math.PI / 180);
  
  // Apply rotations to each control surface
  controlsurface1.rotation.y = servo1Rad;  // Top surface
  controlsurface2.rotation.y = servo2Rad;  // Bottom-left surface  
  controlsurface3.rotation.y = servo3Rad;  // Bottom-right surface
}

// fucntion to control the rotation of the orientation cube
function updateOrientationFromQuaternion(w, x, y, z) {
  // Directly set the cube's orientation from quaternion values
  // MPU6050 typically provides quaternion in w, x, y, z order
  cube.quaternion.set(x, y, z, w);
}

      // ----- Telemetry update (demo random data). Update this to use your socket values -----
      function updateTelemetry() {
        try {
          // SENSORS
           // Generate random servo angles FIRST
    const servo1Angle = randFloat(0, 180);
    const servo2Angle = randFloat(0, 180);
    const servo3Angle = randFloat(0, 180);
    
    // THEN update control surfaces with the actual values
    updateControlSurfaces(servo1Angle, servo2Angle, servo3Angle);

          const altitude = randFloat(100, 200);
          const barometer = randFloat(990, 1030);
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



          const quatW = randFloat(-1, 1, 3);
    const quatX = randFloat(-1, 1, 3);
    const quatY = randFloat(-1, 1, 3);
    const quatZ = randFloat(-1, 1, 3);
    
    // Normalize the quaternion (important!)
    const length = Math.sqrt(quatW*quatW + quatX*quatX + quatY*quatY + quatZ*quatZ);
    const normalizedW = quatW / length;
    const normalizedX = quatX / length;
    const normalizedY = quatY / length;
    const normalizedZ = quatZ / length;
    
    // UPDATE ORIENTATION WITH QUATERNION
    updateOrientationFromQuaternion(normalizedW, normalizedX, normalizedY, normalizedZ);

          sensorsEl.textContent =
`SENSORS
───────
ALT:  ${makeBar(altitude, 100, 200)} ${fix(altitude,2)} m
BARO: ${makeBar(barometer, 990, 1030)} ${fix(barometer,2)} hPa
US:   ${makeBar(ultrasonic, 0, 5)} ${fix(ultrasonic,2)} m

ACCEL: X:${fix(accelX,2)} Y:${fix(accelY,2)} Z:${fix(accelZ,2)}
GYRO : X:${fix(gyroX,2)} Y:${fix(gyroY,2)} Z:${fix(gyroZ,2)}
MAG  : X:${fix(magX,1)} Y:${fix(magY,1)} Z:${fix(magZ,1)}

TEMP: ${fix(temp,1)} °C
SOCKET: CONNECTED (192.168.1.100:8080)`;

          // MOTORS & CONTROL
          const bldc1Rpm = randInt(2000, 3000);
          const bldc2Rpm = randInt(2000, 3000);
          const bldc1Temp = randInt(35, 50);
          const bldc2Temp = randInt(35, 50);

          // Normalised control values in [-1,1] for demo — map to cube tilt
          const pitch = randFloat(-1, 1, 3);
          const roll = randFloat(-1, 1, 3);
          const yaw = randFloat(-1, 1, 3);
          const thrust = randFloat(0, 1, 3);

          motorsEl.textContent =
`MOTORS & CONTROL
────────────────
[BLDC1]   RPM: ${bldc1Rpm}   TEMP: ${bldc1Temp}°C
[BLDC2]   RPM: ${bldc2Rpm}   TEMP: ${bldc2Temp}°C

JOYSTICK INPUT (norm)
──────────────
PITCH : ${makeBar(pitch, -1, 1)} ${fix(pitch,3)}
ROLL  : ${makeBar(roll, -1, 1)} ${fix(roll,3)}
YAW   : ${makeBar(yaw, -1, 1)} ${fix(yaw,3)}
THRUST: ${makeBar(thrust, 0, 1)} ${fix(thrust,3)}`; 

          // Update cube orientation from these normalised control values
        

        } catch (err) {
          console.error('updateTelemetry error', err);
        }
      }

      // Start telemetry updates every 2 seconds (2000 ms)
      const telemetryTimer = setInterval(updateTelemetry, 200);
      window.__monocopterTimers.push(telemetryTimer);

      // initial call
      updateTelemetry();

    } catch (err) {
      console.error('monocopter-ui top-level error', err);
    }
  });
})();