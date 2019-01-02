var express = require('express');
var router = express.Router();
var DB = require('../util/mongoDB.js');
/* GET home page. */
router.get('/login', function(req, res) {
  res.render('login');
});
router.get('/', function(req, res) {
  res.render('index');
});
router.get('/index', function(req, res) {
  res.render('index');
});
//  大厅
router.get('/hall', function(req, res) {
  DB.find('room',{},function(findErr,room){
    if(findErr){
      console.log('find room error:',findErr);
      return false;
    }
    res.render('hall',{room:room});
  });
});
// 房间
router.get('/rooms/:roomID',function(req,res){
  // console.log(req.params.roomID);
  // res.render('room');
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
module.exports = router;
