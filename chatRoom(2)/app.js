/*
**                                    _oo0oo_
**                                   o8888888o
**                                   88" . "88
**                                   (| -_- |)
**                                   0\  =  /0
**                                 ___/`---'\___
**                               .' \\|     |// '.
**                              / \\|||  :  |||// \
**                             / _||||| -:- |||||- \
**                            |   | \\\  -  /// |   |
**                            | \_|  ''\---/''  |_/ |
**                            \  .-\__  '-'  ___/-. /
**                          ___'. .'  /--.--\  `. .'___
**                       ."" '<  `.___\_<|>_/___.' >' "".
**                      | | :  `- \`.;`\ _ /`;.`/ - ` : | |
**                      \  \ `_.   \_ __\ /__ _/   .-` /  /
**                  =====`-.____`.___ \_____/___.-`___.-'=====
**                                    `=---='
**
**
**                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**
**                             佛祖保佑         永无BUG
*/


/*
**  Library
*/
const express = require('express');
const app = new express();
const router = express.Router();
const server = require('http').Server(app);
const socketIO = require('socket.io')(server);

const path = require('path');
// config tools
app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
// config public
var roomInfo = new Array();//保存房间信息
var hashName = new Array();//保存 用户名=》socket.io 映射表

socketIO.on('connection',function(socket){

  var url = socket.request.headers.referer;
  var splited = url.split('/');
  var roomID = splited[splited.length - 1];//获取roomID
  var user = '';//当前用户

  socket.on('join',function(userName){
    user = userName;
    if(!roomInfo[roomID]){
      roomInfo[roomID] = [];
    }
    roomInfo[roomID].push(user);
    hashName[user] = socket.id;
    socket.join(roomID);//加入房间
    // socket.broadcast.to(roomID).emit('sys', user + '加入了房间', roomInfo[roomID]);//通知房间其他用户
    socketIO.to(roomID).emit('sys', user + '加入了房间',roomInfo[roomID]);//通知房间所有用户，包括自己
    console.log(hashName);
  });
  socket.on('leave',function(){
    socket.emit('disconnect');
  });
  socket.on('message',function(msg){
    // 验证如果用户不在房间内则不给发送
    if (roomInfo[roomID].indexOf(user) === -1) {
      return false;
    }
    socketIO.to(roomID).emit('msg',user,msg);
  });
  socket.on('sayTo',function(name,msg){
    var toId = null;
    if(toId = hashName[name]){
      var toSocket = socketIO.sockets.sockets[toId];
      toSocket.emit('secret',msg);
    }
  });
  socket.on('sendImg',function(data){
    console.log(user,'图片：',data);
    socketIO.to(roomID).emit('receiveImg',user,data);
  });
  socket.on('disconnect',function(){
    var index = roomInfo[roomID].indexOf(user);
    if(index !== -1){
      roomInfo[roomID].splice(index,1);
    }
    socket.leave(roomID);
    socketIO.to(roomID).emit('sys', user + '退出了房间',roomInfo[roomID]);//通知房间所有用户
    console.log(user + '退出了' + roomID);
  });
});
router.get('/room/:roomID',function(req,res){
  let roomID = req.params.roomID;
  if(!roomInfo[roomID]){
    roomInfo[roomID] = [];
  }
  res.render('room',{
    roomID: roomID,
    users: roomInfo[roomID]
  });
});
//router
app.use('/',router);
server.listen(7000,function(){
  console.log('run at localhost:7000');
});
