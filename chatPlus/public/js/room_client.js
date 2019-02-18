const socket = io.connect('http://localhost:3000/room');

// 登陆的用户基本信息
var userIcon= document.getElementById('userIcon').src;
var userName = document.getElementById('userName').textContent.trim();
var userId = document.getElementById('userId').textContent.trim();
// 常用DOM集合
var messageBoard = document.getElementById('messageBoard');//对话显示框
var userList = document.getElementById('userList');//用户列表
let msgInfo = document.getElementById('msgInfo');//输入框

socket.on('connect', function() {
  console.log(userIcon);
  //加入房间
  socket.emit('join',{
    icon: userIcon,
    userName: userName,
    userId: userId
  });
  console.log('加入房间成功');
});
// 系统消息 -》 新人加入or用户离开
socket.on('sys',function(sysMsg){
  appendSysMessage(sysMsg);
});
// 系统消息 -》 新人加入or用户离开
socket.on('roomUser',function(users){
  updateUserList(users)
});
//有人发言
socket.on('userSay',function(msg,userMessage,flag){
  appendUserMessage(msg,userMessage,flag);
})

//新增用户聊天信息
function appendUserMessage(msg,userMessage,flag){
  var fragment = document.createDocumentFragment();    //创建文档片段
  var div = document.createElement('div');
  var img = document.createElement('img');
  var div2 = document.createElement('div');
  var span = document.createElement('span');
  var node = document.createTextNode(userMessage.userName);
  var article = document.createElement('article');

  div.classList.add("message");
  if(flag){
    div.classList.add("self");
  }
  console.log("userMessage.icon:",userMessage.icon);
  img.src = userMessage.icon;
  div2.classList.add("userMsg");
  article.innerHTML = msg;

  span.appendChild(node);
  div2.appendChild(span);
  div2.appendChild(article);
  div.appendChild(img);
  div.appendChild(div2);


  fragment.appendChild(div);
  messageBoard.appendChild(div);
  messageBoard.scrollTop = messageBoard.scrollHeight;//固定到滚动条底部
}
// 发送消息
function sendRoomMessage() {
  var msg = msgInfo.innerHTML;
  if (msg.length > 0) {
    socket.emit('message',msg); //变相触发message事件
    msgInfo.innerHTML = '';
  } else {
    alert('发送内容不能为空');
  }
}
//图片预览
function getFileToPicture(event){
  let file = event.target.files[0];
  if(!!file.size){
    if (file.size > 1024 * 1024 * 1) {
      alert('上传的图片大小超过1M');
      file.value = '';
      return
    }
    let freader = new FileReader();
    freader.readAsDataURL(file);
    freader.onload = () => {
      //解决change事件只触发一次问题
      event.target.value='';
      //添加在输入框
      let img = document.createElement('img');
          img.src = freader.result;
      msgInfo.appendChild(img);
    };

  }
}
// 添加系统信息
function appendSysMessage(msg){
  var div = document.createElement('div');
  var node = document.createTextNode(msg);
  div.classList.add("sysMessage");
  div.appendChild(node);
  messageBoard.appendChild(div);
  messageBoard.scrollTop = messageBoard.scrollHeight;//固定到滚动条底部
}
//更新成员列表
function updateUserList(users){
  userList.innerHTML = '';
  var fragment = document.createDocumentFragment();    //创建文档片段
  for(let i = 0 ;i<users.length;i++){
    var li = document.createElement('li');
    var div = document.createElement('div');
    var img = document.createElement('img');
    var span = document.createElement('span');
    var node = document.createTextNode(users[i].userName + "("+users[i].userId+")");
        div.classList.add("userListIcon");
        img.src = users[i].icon;
        div.appendChild(img);
        span.appendChild(node);
        li.appendChild(div);
        li.appendChild(span);
        fragment.appendChild(li);
  }
  userList.appendChild(fragment);
}
