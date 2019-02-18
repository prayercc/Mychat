let displayDom = document.getElementById('friendDetail');
/*
**  获取好友点击
*/
function showFriendDetail(event) {
  let e = event || window.event;
  let targetObj = e.target || e.srcElement;
  // 确定点击得dom是li
  if (targetObj.nodeName.toLowerCase() === "li") {
    let userId = targetObj.getAttribute('title');
    findDetailById(userId);
  }
}
/*
** 通过id找到该好友所有信息
*/
function findDetailById(userId){
  ajax({
      method: 'get',
      url: '/friendinfo',
      data:{
        userId: userId
      },
      success: function(response){
        response = JSON.parse(response)
          if(response.status == 1){
            console.log(response["data"]);
            displayFriends(response["data"]);
          } else {
            console.log('错误处理');
          }
      }
    });
}
// 创建dom展示好友详细信息
function displayFriends(data){
  var detailDisplay = document.createElement('div');
      detailDisplay.classList.add("detailDisplay");
  var displayTop = document.createElement('div');
      displayTop.classList.add("displayTop");
  var icon = document.createElement('img');
      icon.src = data.icon;
      displayTop.appendChild(icon);
  var displayContent = document.createElement('div');
      displayContent.classList.add("displayContent");
      // 用户名
  var h4 =  document.createElement('h4');
  var node1 = document.createTextNode(data.username);
      h4.appendChild(node1);
      // 简介
  var h5 =  document.createElement('h5');
      h5.innerHTML = data.introduce;
      //账号
  var p1 =  document.createElement('p');
      p1.innerHTML = '账号:<span>'+data.userId+'</span>'
      // 昵称
  var p2 =  document.createElement('p');
      p2.innerHTML = '昵称:<span>'+data.username+'</span>'
      // 手机
  var p3 =  document.createElement('p');
      p3.innerHTML = '手机:<span>'+data.telNumber+'</span>'
      // 邮箱
  var p4 =  document.createElement('p');
      p4.innerHTML = '邮箱:<span>'+data.email+'</span>'
      // 职位
  var p5 =  document.createElement('p');
      p5.innerHTML = '职位:<span>'+data.partment+' '+data.position+'</span>'
      // 个人
  var p6 =  document.createElement('p');
  var age = jsGetAge(data.birthday)
  var gender = (data.gender== 'man'?'男':'女');
  var maritalStatus = "单身";
  if(data.maritalStatus == 'married'){
    maritalStatus = '已婚'
  } else if(data.maritalStatus == 'unmarried'){
    maritalStatus = '未婚'
  }
      p6.innerHTML = '个人:<span>'+ age +' '+ gender +' '+ maritalStatus +'</span>';

  displayContent.appendChild(h4);
  displayContent.appendChild(h5);
  displayContent.appendChild(p1);
  displayContent.appendChild(p2);
  displayContent.appendChild(p3);
  displayContent.appendChild(p4);
  displayContent.appendChild(p5);
  displayContent.appendChild(p6);

  detailDisplay.appendChild(displayTop);
  detailDisplay.appendChild(displayContent);

  displayDom.innerHTML = '';
  displayDom.appendChild(detailDisplay);
}
//根据出生日期算出年龄
function jsGetAge(strBirthday){
    var returnAge;
    var strBirthdayArr=strBirthday.split("-");
    var birthYear = strBirthdayArr[0];
    var birthMonth = strBirthdayArr[1];
    var birthDay = strBirthdayArr[2];

    d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if(nowYear == birthYear){
        returnAge = 0;//同年 则为0岁
    }
    else{
        var ageDiff = nowYear - birthYear ; //年之差
        if(ageDiff > 0){
            if(nowMonth == birthMonth) {
                var dayDiff = nowDay - birthDay;//日之差
                if(dayDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
            else
            {
                var monthDiff = nowMonth - birthMonth;//月之差
                if(monthDiff < 0)
                {
                    returnAge = ageDiff - 1;
                }
                else
                {
                    returnAge = ageDiff ;
                }
            }
        }
        else
        {
            returnAge = -1;//返回-1 表示出生日期输入错误 晚于今天
        }
    }

    return returnAge;//返回周岁年龄

}

/*
** ajax 简单封装
** 详细参考：https://blog.csdn.net/Zhonghuachun/article/details/81156491
*/
function ajax(opt) {
  opt = opt || {};
  opt.method = opt.method.toUpperCase() || 'POST';
  opt.url = opt.url || '';
  opt.async = opt.async || true;
  opt.data = opt.data || null;
  opt.success = opt.success || function() {};

  var xmlHttp = null;
  if (XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
  }
  var params = [];

  for (var key in opt.data) {
    params.push(key + "=" + opt.data[key]);
  }

  var postData = params.join("&");

  if (opt.method === 'POST') {
    xmlHttp.open(opt.method, opt.url, opt.async);
    xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
    xmlHttp.send(postData);
  } else {
    xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
    xmlHttp.send(null);
  }
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status === 200) {
      opt.success(xmlHttp.responseText);
    }
  }
}
