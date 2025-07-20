let message = null;

import * as THREE from 'three';

const degToRad = THREE.MathUtils.degToRad;


//canvas
const canvasOrientatin = document.querySelector("canvas.threejsCanvas");
const containerOrientation = document.querySelector('div.orientation');

//scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("rgba(69, 70, 92)");

//cube
const cubeGeometry = new THREE.BoxGeometry(1,1,1);
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0x3498db,
  roughness: 0.2,  // Smoother surface (0 = mirror-like)
  metalness: 0.5,  // Semi-metallic for sharper highlights
});
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);


//wireframe for outline
const outline = new THREE.LineSegments(
  new THREE.EdgesGeometry(cubeMesh.geometry),
  new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
);
cubeMesh.add(outline);




//AxesHelper
const axesHelper = new THREE.AxesHelper(5);

//ambient light
const color = 0xFFFFFF;
const intensity = 2;
const ambientLight = new THREE.AmbientLight(color, intensity);
const directionalLight = new THREE.DirectionalLight(color, 20);
directionalLight.position.set(10,10,-10);
directionalLight.target.position.set(0, 0, 0);

// add cube&&axis to scene 
scene.add(cubeMesh);
scene.add(axesHelper);
scene.add(ambientLight);
scene.add(directionalLight);

//camera obj
const camera = new THREE.PerspectiveCamera(
  75,
  (containerOrientation.clientWidth / containerOrientation.clientHeight),
  0.1,
  2000);

camera.position.set(2,2,2);
camera.lookAt(0, 0, 0);


//render obj
const renderer = new THREE.WebGLRenderer({
  canvas : canvasOrientatin,
  antialias : true
});

//set render size &&  render
renderer.setSize(containerOrientation.clientWidth,containerOrientation.clientHeight,false);
renderer.render(scene, camera);





//canvas control surface
const controlSurfacescanvas = document.querySelector('canvas.controlSurfacescanvas');
const containerControlSurface = document.querySelector('div.controlSurfaces');

//scene
const scene1 = new THREE.Scene();
scene1.background = new THREE.Color("rgb(69, 70, 92)");
const cuboid = new THREE.BoxGeometry(0.3,3,1,);


//cube1
const controlsurface1 = new THREE.Mesh(cuboid, cubeMaterial);
//cube2
const controlsurface2 = new THREE.Mesh(cuboid, cubeMaterial);
//cube3
const controlsurface3 = new THREE.Mesh(cuboid, cubeMaterial);



const outline1 = new THREE.LineSegments(
  new THREE.EdgesGeometry(controlsurface1.geometry),
  new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
);
controlsurface1.add(outline1);


const outline2 = new THREE.LineSegments(
  new THREE.EdgesGeometry(controlsurface2.geometry),
  new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
);
controlsurface2.add(outline2);


const outline3 = new THREE.LineSegments(
  new THREE.EdgesGeometry(controlsurface3.geometry),
  new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
);
controlsurface3.add(outline3);


//AxesHelper
const axesHelper1 = new THREE.AxesHelper(5);


//ambient light
const color1 = 0xFFFFFF;
const intensity1 = 2.4;
const ambientLight1 = new THREE.AmbientLight(color1, intensity1);
const directionalLight1 = new THREE.DirectionalLight(color, 2);
const directionalLight2 = new THREE.DirectionalLight(color, 2);


directionalLight1.position.set(15, 15, 0); // Grazing angle from side
directionalLight1.target.position.set(0,0,0); // Focus on center


directionalLight2.position.set(-15, 15, 0)
directionalLight2.target.position.set(0, 0, 0); // Focus on center


const l = 4;
const height = (Math.sqrt(3) / 2) * l; // height = 2√3
const vertexDistance = (2 / 3) * height; // 4√3 / 3
const baseY = -(1 / 3) * height; // -2√3 / 3

// Positions:
controlsurface1.position.set(0, vertexDistance, 0); // Top vertex (A)
controlsurface2.position.set(-l/2, baseY, 0); // Bottom-left (B)
controlsurface3.position.set(l/2, baseY, 0); // Bottom-right (C)


//rotation order
controlsurface1.rotation.order = 'ZYX';
controlsurface2.rotation.order = 'ZYX';
controlsurface3.rotation.order = 'ZYX';

//initial rotation 
controlsurface2.rotation.z = degToRad(-60);
controlsurface3.rotation.z = degToRad(60);


// add cube&&lights to scene 
scene1.add(controlsurface1);
scene1.add(controlsurface2);
scene1.add(controlsurface3);

scene1.add(axesHelper1);
scene1.add(ambientLight1);
scene1.add(directionalLight1);
scene1.add(directionalLight2);

//camera obj
const camera1 = new THREE.PerspectiveCamera(
  45,
  (containerControlSurface.clientWidth / containerControlSurface.clientHeight),
  0.1,
  2000);

camera1.position.set(0,0,10);
camera1.lookAt(0, 0, 0);


//render obj
const renderer1 = new THREE.WebGLRenderer({
  canvas : controlSurfacescanvas,
  antialias : true
});

//set render size &&  render
renderer1.setSize(containerControlSurface.clientWidth,containerControlSurface.clientHeight,false);
renderer1.render(scene1, camera1);






const connectionStatusDiv = document.querySelector('button');
const divInsideConnection = document.querySelector('div.insideConnection')
const armedStatusDiv = document.querySelector('div.insideArmed');


const batteryVolts = document.querySelector('div.voltage');
const batteryAmps = document.querySelector('div.current');

const topcs =document.querySelector('div.top');
const leftcs =document.querySelector('div.left');
const rightcs =document.querySelector('div.right');


let ws = null;
let telemetryData = '';
setConnectionStatus(false)
setArmedStatus(false)

function connectSocket() {
  //close  previous connection
  if (ws && [WebSocket.OPEN , WebSocket.CONNECTING].includes(ws.readyState)) {
    ws.close()
  }

  ws = new WebSocket("ws://localhost:8080");

  ws.onclose =(closeEvent) =>{
    setConnectionStatus(false);
    connectionStatusDiv.disabled = false;
    //alert message
    alert(`error code:${closeEvent.code}\nerror mess: ${closeEvent.reason}\n
      1000 -normal
      1006 -abnormal(server down)
      4000-4999 -Application-specific errors`);

  }

  ws.onopen=()=>{
    setConnectionStatus(true);
    connectionStatusDiv.disabled = true;

  }

  ws.onmessage=(mess)=>{
    console.log(mess);
    message = JSON.parse(mess.data);
    setArmedStatus(message.armed);
    drawplotly(message.position);
    changeBatterystats(message.battery);
    updateControlSurfaceDiv(message)
  }

  
}
//start connection on button click
connectionStatusDiv.addEventListener('click',()=>{
  connectSocket();
})



const data = [{    
    x: [1],    
    y: [1],
    z: [1],    
    type: 'scatter3d',
    mode:'lines',
    line:{width:2, color:'rgb(18, 34, 20)',} 
   }];

const layout = {  
        margin: { l: 0, r: 0, b: 0, t: 0 },               // Small margins for axes      
        paper_bgcolor:'rgb(124, 155, 152)',     // Transparent outer background    
        responsive: true,
        scene: {
            aspectratio: {
                x: 10,  // Longest dimension
                y: 3,   // Medium dimension
                z: 3   // Shortest dimension
              },
            xaxis: { range: [-5, 5] },
            yaxis: { range: [-5, 5] },
            zaxis: { range: [-5, 5] },
            camera: {eye: { x: 1, y: 8, z:3} }
          }
};

//widow resize event
window.addEventListener('resize', ()=> {

  //resize plotly3d
  Plotly.Plots.resize('Plotter');
  

  //resize orientation threejs
  renderer.setSize(containerOrientation.clientWidth, containerOrientation.clientHeight,);
  camera.aspect = containerOrientation.clientWidth / containerOrientation.clientHeight;
  camera.updateProjectionMatrix();


  //resize controlSurface threejs
  renderer1.setSize(containerControlSurface.clientWidth, containerControlSurface.clientHeight,);
  camera1.aspect = containerControlSurface.clientWidth / containerControlSurface.clientHeight;
  camera1.updateProjectionMatrix();
});


window.addEventListener('beforeunload',()=>{
  if(ws && [WebSocket.OPEN, WebSocket.CONNECTING].includes(ws.readyState)){
    ws.close();
    setConnectionStatus(false);

  }
})




//plot the empty scatter3d 
Plotly.newPlot('Plotter', data, layout);


function setConnectionStatus(value){
  divInsideConnection.style.backgroundColor = value ? '#61ff61' : "#fa3737";
}

function setArmedStatus(value){
  armedStatusDiv.style.backgroundColor = value ? '#61ff61' : "#fa3737";
}  

function changeBatterystats(battery){
  batteryVolts.innerHTML = `${battery.volts}v`;
  batteryAmps.innerHTML = `${battery.amps}amps`;
}

function updateControlSurfaceDiv(message){
  topcs.innerHTML   = `${message.controlSurface.top.toFixed(2)}\u00B0`;
  leftcs.innerHTML  = `${message.controlSurface.left.toFixed(2)}\u00B0`;
  rightcs.innerHTML = `${message.controlSurface.right.toFixed(2)}\u00B0`;
}


function drawplotly(position){
  Plotly.extendTraces('Plotter',{
    x: [[position.x]],
    y: [[position.y]],
    z: [[position.z]],
  },[0])
}



// Initialize ONCE at startup for quartenions


const _qYaw = new THREE.Quaternion();
const _qPitch = new THREE.Quaternion();
const _qRoll = new THREE.Quaternion();
const _finalQ = new THREE.Quaternion();
const _zAxis = new THREE.Vector3(0, 0, 1);
const _yAxis = new THREE.Vector3(0, 1, 0);
const _xAxis = new THREE.Vector3(1, 0, 0);


const renderloop = () =>{

  if(message != null){
    _qYaw.setFromAxisAngle(_zAxis, degToRad(message.rotation.z));
    _qPitch.setFromAxisAngle(_yAxis, degToRad(message.rotation.y));
    _qRoll.setFromAxisAngle(_xAxis, degToRad(message.rotation.x));


    console.log(message.controlSurface)
    controlsurface1.rotation.y = degToRad(message.controlSurface.top);
    controlsurface2.rotation.y = degToRad(message.controlSurface.left);
    controlsurface3.rotation.y = degToRad(message.controlSurface.right);
    
    _finalQ.copy(_qYaw)
      .multiply(_qPitch)
      .multiply(_qRoll);

    cubeMesh.quaternion.copy(_finalQ);
  }
  message = null;
  renderer.render(scene, camera);
  renderer1.render(scene1, camera1);
  window.requestAnimationFrame(renderloop)
};

renderloop();
