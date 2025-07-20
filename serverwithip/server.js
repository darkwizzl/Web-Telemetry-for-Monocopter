const WebSocket = require('ws');
const PORT = 8080;

function rand(){
  return Math.random() * 5
}



data = {armed:'offline',
        position : { x:rand(), y:rand(), z:rand()},
        rotation : { x:0, y:0.1, z:0.2},
        battery : { volts:24, amps:1.2},
        controlSurface : {top:rand()*5, left:rand()*5, right:rand()*5},
        motorTop : {rpm:12, pwm:66432},
        motorBottom : {rpm:122, pwm:23234}
}



// Create WebSocket server
const wss = new WebSocket.Server({ port: PORT });
_x = 0;

console.log(`WebSocket server running on ws://localhost:${PORT}`);

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

  setInterval(()=>{

    data = {armed:true,
      position : { x:rand(), y:rand(), z:rand()},
      rotation : { x:_x, y:10, z:30},
      battery : { volts:24, amps:1.2},
      controlSurface : {top:rand()*5, left:rand()*5, right:rand()*5},
      motorTop : {rpm:12, pwm:66432},
      motorBottom : {rpm:122, pwm:23234}
    }
    console.log('sending data');

    ws.send(JSON.stringify(data));
    _x +=5;
  },100)
});