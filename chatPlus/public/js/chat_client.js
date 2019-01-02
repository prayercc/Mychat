const socket = io.connect('http://localhost:3000/world');

/*
** Common nodes
*/
// 登陆的用户基本信息
var userIcon= document.getElementById('userIcon').style.backgroundImage.match(/(\d.png)/g)[0];
var userName = document.getElementById('userName').textContent.trim();
var userId = document.getElementById('userId').textContent.trim();
// 常用DOM集合
var messageBoard = document.getElementById('messageBoard');//对话显示框
var userList = document.getElementById('userList');//用户列表
let msgInfo = document.getElementById('msgInfo');//输入框

/*
** socket on/emit event
*/
socket.on('connect', function() {
  //关联socket.id到当前用户
  socket.emit('signUser',{
    userName: userName,
    userId: userId,
    icon: userIcon
  });
  console.log('signUser-》连接成功');
});
//系统消息
socket.on('system',function(msg){
  appendSysMessage(msg);
});
//有用户上线
socket.on('userIn',function(msg){
  appendSysMessage(msg);
})
socket.on('user_list',function(users){
  updateUserList(users);
});
socket.on('userSay',function(msg,userMessage,flag){
  appendUserMessage(msg,userMessage,flag);
});
/*
**  操作
*/

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
  img.src = "/images/userInit/"+userMessage.icon;
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
// 新增系统消息
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
    var node = document.createTextNode(users[i].username + "("+users[i].userId+")");
        div.classList.add("userListIcon");
        img.src = "/images/userInit/"+users[i].icon;
        div.appendChild(img);
        span.appendChild(node);
        li.appendChild(div);
        li.appendChild(span);
        if(users[i].status == 'down'){
          img.classList.add("gray");
          fragment.appendChild(li);
        } else {
          fragment.insertBefore(li,fragment.childNodes[0]);
        }
  }
  userList.appendChild(fragment);
}
// 发送消息
function sendMessage() {
  // console.log(msgInfo)
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
// // 首页-》右侧边栏自动隐藏
// window.onresize = debounce(displayDOM, 500);
// function displayDOM() {
//   if (document.documentElement.clientWidth < 1100) {
//     userBox.style.display = 'none';
//     messageBox.style.width = '100%';
//   } else {
//     userBox.style.display = 'inline-block';
//     messageBox.style.width = '80%';
//   }
// }
// function debounce(method, delay) {
//   let timer = null;
//   return function() {
//     let context = this,
//       args = arguments;
//     clearTimeout(timer);
//     timer = setTimeout(function() {
//       method.apply(context, args);
//     }, delay);
//   }
// }
