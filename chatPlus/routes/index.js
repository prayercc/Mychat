var express = require('express');
var router = express.Router();
var DB = require('../util/mongoDB.js');
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/index', function(req, res) {
  res.render('index');
});
// 大厅
router.get('/hall', function(req, res) {
  DB.find('room',{},function(findErr,room){
    if(findErr){
      console.log('find room error:',findErr);
      return false;
    }
    res.render('hall',{room:room});
  });
});
// 消息通知
router.get('/message',function(req,res){
  res.render('message');
})
// 创建房间
router.post('/addRoom',function(req,res){

})
// 房间
router.get('/rooms/:roomID',function(req,res){
  let roomID = new DB.ObjectID(req.params.roomID);//获取房间号
  //验证该房间是否存在
  DB.findOne('room',{"_id":roomID},function(err,doc){
    if(err){
      console.log('find room error: ',err);
      return false;
    }
    if(doc.length > 0){
      res.render('room',{'roomInfo':doc[0]});
    }
  });
  //渲染房间页面

});
// 联系人 朋友的另外一种称呼
router.get('/friends',function(req,res){
  // 查询当前用户的好友分组列表,目前不涉及分组
  let userId = req.session.userinfo.userId;
  // 查询该当前用户的好友集合
  DB.findUnite('friendRelate',
  {"userA": userId},
  { from: "users",localField: "userB",foreignField: "userId",as: "friends"},
  { _id: 0, friends: 1},'$friends',
  function(err,doc){
    if(err){
      console.log('查询好友失败',err);
      return false;
    }
    // 返回好友集合
    res.render('friends',{"friendsList": doc});
  });
});
// 好友详细信息
router.get('/friendinfo',function(req,res){
  let desId = Number(req.query.userId);

  DB.findOne('friendRelate',{"userA":req.session.userinfo.userId,"userB":desId},function(err,doc){
    if(err){
      console.log('查询好友存在失败');
      return false;
    }
    if(doc.length > 0){
      DB.findOne('users',{"userId":desId},function(errr,docc){
        if(errr){
          console.log('查询用户信息失败');
          return false;
        }
        if(docc.length > 0){
          res.send({
            status: 1,
            data: docc[0]
          });
        } else {
          res.send({
            status: 0,
            data: '该账号不存在！'
          });
        }
      });
    } else {
      res.send({
        status: 0,
        data: '对方不是您的好友,请先添加好友！'
      });
    }
  });

});



module.exports = router;
