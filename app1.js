// library
const path = require('path')
const express = require('express');
const app = express();
const server = require('http').Server(app);//基于事件的服务器
const io = require('socket.io')(server);


// View options
app.use(express.static(path.join(__dirname, 'public')))


// Render and send the main page
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// app.listen(80);
server.listen(8888,function(){
	console.log('listen 8888');
});

// Handle the socket.io connections
var userCount = 0;
io.on('connection', function (socket) {
  userCount ++;//user add
  reloadUsers();//send the count to all the users
	socket.on('disconnect', function(){
    userCount --;//user reduce
    reloadUsers();//send the count to all the users
    console.log('user disconnected');
  });
  socket.on('sendMessage',function(res){
    socket.broadcast.emit('sendMessage', res);
  })
});
// Handle the socket.io disconnect
io.on('disconnect',function(socket){
	console.log('disconnect start');
});

//通知所有用户
function reloadUsers(){
  io.emit('userChange',{'userCount':userCount});
}
