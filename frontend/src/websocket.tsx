import io from 'socket.io-client';

const websocket: SocketIOClient.Socket = io('http://localhost:5000', {
  jsonp: false,
  transports: ['websocket']
});

const friendWebSocket: SocketIOClient.Socket = io('http://localhost:5000/friends', {
  jsonp: false,
  transports: ['websocket']
});

export {websocket, friendWebSocket};
