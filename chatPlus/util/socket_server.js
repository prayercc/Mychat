var socketio = {};
var socket_io = require('socket.io');
var DB = require('./mongoDB');

var clients = new Map();//存储 {id,username}=>socket.id 键值对
var roomInfo = new Array();//保存房间信息
/**
 * Define the socket event
 */
socketio.getSocketio = function(server) {
  var io = socket_io.listen(server);

  var world = io.of('/world');
  var room  = io.of('/room');

  //世界聊天
  world.on('connection', function(socket) {
    var userMessage = {};
    // console.log('socket.id',socket.id,':connection');
    socket.emit("system", "Welcome ! Now chat with others");
    //获取在线用户
    getUserUp(socket);
    //用户上线，添加映射
    socket.on('signUser', function(userinfo) {
      userMessage = userinfo;
      console.log(userMessage.userName+' ('+userMessage.userId+') has join');
      // clients.set(userMessage,socket.id);
      // 通知其他人有人上线
      socket.broadcast.emit('userIn',"【" + userMessage.userName + "】-- a newer ! Let's welcome him ~");
    });
    //有人在世界发言
    socket.on('message',function(msg){
      console.log(userMessage.userName+' ('+userMessage.userId+') :',msg);
      //可以对发言信息进行存储
      socket.broadcast.emit('userSay', msg ,userMessage,false); //通知别人
      socket.emit('userSay', msg, userMessage,true); //当前用户添加
    });
    //用户离开，注销该账号
    socket.on('disconnect',function(){
      if(userMessage.length > 0){
        console.log(userMessage.userName+' ('+userMessage.userId+') has leave');
      }
    });
  });
  //房间聊天
  room.on('connection',function(socket){
    var url = socket.request.headers.referer;
    var splited = url.split('/');
    var roomID = splited[splited.length - 1];//获取roomID
    var user = new Object();//当前用户

    //有人加入房间
    socket.on('join',function(users){
      user = users;
      if(!roomInfo[roomID]){
        roomInfo[roomID] = [];//初始化房间用户
      }
      var index = JSON.stringify(roomInfo[roomID]).indexOf(JSON.stringify(user));
      if(index == -1){
        roomInfo[roomID].push(user);//加入房间信息
        room.to(roomID).emit('sys', '【群消息：】'+user.userName + '加入了房间');//通知他人
        //更新其他用户列表
        socket.emit('roomUser',roomInfo[roomID]);
        room.to(roomID).emit('roomUser', roomInfo[roomID]);
      } else {
        socket.emit('roomUser',roomInfo[roomID]);
      }
      socket.join(roomID);//加入房间
    });
    socket.emit('sys','【进入房间成功】');
    socket.on('message',function(msg){
      //可存储记录
      socket.broadcast.to(roomID).emit('userSay', msg ,user,false); //通知别人
      socket.emit('userSay', msg, user,true); //当前用户添加

    });
    socket.on('disconnect',function(){
      let len = roomInfo[roomID].length;
      for(let i = 0;i<len;i++){
        if(roomInfo[roomID][i] == user){
          roomInfo[roomID].splice(i,1);
        }
      }
      //离开房间
      socket.leave(roomID);
      //通知其他用户
      room.to(roomID).emit('sys', '【群消息：】'+ user.userName + '退出了房间');
      //更新其他用户列表
      room.to(roomID).emit('roomUser', roomInfo[roomID]);
      console.log('leave:'+socket.id);
    })
  });

}
/*
**   辅助功能
*/
//获取所有用户(在线/不在线)
//2019/1/2 限制查询字段   prayer
function getUserUp(socketIn){
  DB.findLimit('users',{},{'userId':1,"username":1,"icon":1,"status":1},function(err,doc){
    if(err){
      console.log('up user find error',err);
      return false;
    }
    socketIn.broadcast.emit('user_list', doc); //更新其他用户列表
    socketIn.emit('user_list', doc); //更新自己用户列表
  });
}
module.exports = socketio;
