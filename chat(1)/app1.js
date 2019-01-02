/**
 *                                       江城子 . 程序员之歌
 *                                  十年生死两茫茫，写程序，到天亮。
 *                                         千行代码，Bug何处苍。
 *                                  纵使上线又怎样，朝令改，夕断肠。
 *
 *                                  领导每天新想法，天天改，日日忙。
 *                                         相顾无言，惟有泪千行。
 *                                  每晚灯火阑珊处，夜难寐，加班狂。
 *
 * Enjoy coding
 * Created by prayer on 2018.12.13 16:37:12
 */
 
const path = require('path')
const express = require('express');
const app = express();
const server = require('http').Server(app);//基于事件的服务器
const io = require('socket.io')(server);


// View options
app.use(express.static(path.join(__dirname, 'public')))


// Render and send the main page
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/one.html');
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
