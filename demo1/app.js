/**
 * Created by mike on 2017/5/15.
 */

var http=require("http");
var express=require("express");//引入express
var socketIo=require("socket.io");//引入socket.io

var app=new express();

var server=http.createServer(app);
var io=new socketIo(server);//将socket.io注入express模块

//namespace1  的访问地址
app.get("/namespace1",function (req,res,next) {
    res.sendFile(__dirname+"/views/namespace1.html");
});
app.get("/namespace2",function (req,res,next) {
    res.sendFile(__dirname+"/views/namespace2.html");
});
server.listen(8080);//express 监听 8080 端口，因为本机80端口已被暂用
console.log("服务已启动");

var namespace1=io.of("/namespace1");// 使用of("命名空间") 声明一个新的空间，不同空间下的socket是隔离的不能互相通信
var namespace2=io.of("/namespace2");


//每个客户端socket连接时都会触发 connection 事件
namespace1.on("connection",function (clientSocket) {
    // socket.io 使用 emit(eventname,data) 发送消息，使用on(eventname,callback)监听消息

    //监听客户端发送的 sendMsg 事件
    clientSocket.on("sendMsg",function (data,fn) {
        // data 为客户端发送的消息，可以是 字符串，json对象或buffer

        // 使用 emit 发送消息，broadcast 表示 除自己以外的所有已连接的socket客户端。
        // to(房间名)表示给除自己以外的同一房间内的socket用户推送消息
        clientSocket.broadcast.emit("receiveMsg",data);
        fn({"code":0,"msg":"消息发生成功","namespace":"命名空间1"});
    })
});

//每个客户端socket连接时都会触发 connection 事件
namespace2.on("connection",function (clientSocket) {
    // socket.io 使用 emit(eventname,data) 发送消息，使用on(eventname,callback)监听消息

    //监听客户端发送的 sendMsg 事件
    clientSocket.on("sendMsg",function (data,fn) {
        // data 为客户端发送的消息，可以是 字符串，json对象或buffer

        // 使用 emit 发送消息，broadcast 表示 除自己以外的所有已连接的socket客户端。
        // to(房间名)表示给除自己以外的同一房间内的socket用户推送消息
        clientSocket.broadcast.emit("receiveMsg",data);
        fn({"code":0,"msg":"消息发生成功","namespace":"命名空间2"});
    })
});
