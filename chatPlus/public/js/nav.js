let body  = document.getElementsByTagName("body")[0];//获取body
let userBox = document.getElementById('userBox'); //右边栏
let messageBox = document.getElementById('messageBox'); //主要内容 box


//全屏进入和退出
function toggleFullScreen(e) {
  let el = e.srcElement || e.target; //target兼容Firefox
  FullScreen(body);
}
function FullScreen(el) {
  let isFullscreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
  if (!isFullscreen) { //进入全屏,多重短路表达式
    (el.requestFullscreen && el.requestFullscreen()) ||
    (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
    (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) ||
    (el.msRequestFullscreen && el.msRequestFullscreen());
  } else { //退出全屏,三目运算符
    document.exitFullscreen ? document.exitFullscreen() :
      document.mozCancelFullScreen ? document.mozCancelFullScreen() :
      document.webkitExitFullscreen ? document.webkitExitFullscreen() : '';
  }
}
// 首页-》右侧边栏自动隐藏
window.onresize = debounce(displayDOM, 500);
function displayDOM() {
  if (document.documentElement.clientWidth < 1100) {
    userBox.style.display = 'none';
    messageBox.style.width = '100%';
  } else {
    userBox.style.display = 'inline-block';
    messageBox.style.width = '80%';
  }
}
// 函数防抖
function debounce(method, delay) {
  let timer = null;
  return function() {
    let context = this,
      args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      method.apply(context, args);
    }, delay);
  }
}
