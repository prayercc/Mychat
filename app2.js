/**
 * Created by mike on 2017/5/15.
 */

var http=require("http");
var express=require("express");//引入express
var socketIo=require("socket.io");//引入socket.io

var app=new express();

var server=http.createServer(app);
var io=new socketIo(server);//将socket.io注入express模块

//客户端 1 的访问地址
app.get("/client1",function (req,res,next) {
    res.sendFile(__dirname+"/views/client1.html");
});
app.get("/client2",function (req,res,next) {
    res.sendFile(__dirname+"/views/client2.html");
});
app.get("/client3",function (req,res,next) {
    res.sendFile(__dirname+"/views/client3.html");
});
server.listen(8080);//express 监听 8080 端口，因为本机80端口已被暂用
console.log("服务已启动");

//每个客户端socket连接时都会触发 connection 事件
io.on("connection",function (clientSocket) {
    // socket.io 使用 emit(eventname,data) 发送消息，使用on(eventname,callback)监听消息

    //加入房间
    clientSocket.on("joinRoom",function (data,fn) {
        clientSocket.join(data.roomName); // join(房间名)加入房间
        fn({"code":0,"msg":"加入房间成功","roomName":data.roomName});
    });
    //退出 离开房间
    clientSocket.on("leaveRoom",function (data,fn) {
        clientSocket.leave(data.roomName);//leave(房间名) 离开房间
        fn({"code":0,"msg":"已退出房间","roomName":data.roomName});
    });
    //监听客户端发送的 sendMsg 事件
    clientSocket.on("sendMsg",function (data,fn) {
        // data 为客户端发送的消息，可以是 字符串，json对象或buffer

        // 使用 emit 发送消息，broadcast 表示 除自己以外的所有已连接的socket客户端。
        // to(房间名)表示给除自己以外的同一房间内的socket用户推送消息
        clientSocket.broadcast.to(data.roomName).emit("receiveMsg",data);
        fn({"code":0,"msg":"消息发生成功"});
    })
});
