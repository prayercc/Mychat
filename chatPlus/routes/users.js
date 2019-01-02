var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var md5 = require('md5-node');
var DB = require('../util/mongoDB.js');
// var dbConfig = require('../util/mongoDB.conf.js');
/* GET users listing. */

//登陆功能
router.post('/', function(req, res) {
  var form = new multiparty.Form();
  form.parse(req, function(parseErr, fields, files) {
    if (parseErr) {
      console.log('form.parse err: ', parseErr);
      return false;
    }
    var whereStr = {
      userId: Number(fields.userId[0]),
      password: md5(fields.password[0])
    };
    DB.find("users", whereStr, function(finderr, doc) {
      if (finderr) {
        console.log('查询失败', finderr);
        return false;
      }
      //登陆正确
      if (doc.length > 0) {
        //重置用户当前状态
        DB.updateOne("users", whereStr, {
          status: 'up'
        }, function(updateOneErr, updoc) {
          if (updateOneErr){
            console.log('updateOneErr: ',updateOneErr);
            return false;
          }
          req.session.userinfo = doc[0];
          res.redirect('/index');
        });
      } else {
        res.send("<script>alert('登陆失败(密码或账号错误)');location.href='/login'</script>");
      }
    });
  });
});
//注册功能
router.post('/register', function(req, res, next) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    //获取一个id号
    DB.findOne('idtable', {"isUse":false}, function(err, finddoc) {
      if (err) {
        console.log('获取一个id号失败', err);
        return false;
      }
      // 把选中id号置为失效
      DB.updateOne("idtable", {
        "userId": finddoc[0].userId
      }, {"isUse":true}, function(err, updoc) {
        if (err) {
          console.log('失效错误', err);
          return false;
        }
        var data = {
          userId: finddoc[0].userId,
          username: fields.signuser[0],
          password: md5(fields.signpass[0]),
          icon: "1.png",//默认头像
          status: 'down' //默认离线
        };
        DB.insertOne("users", data, function(err, insertdoc) {
          if (err) {
            console.log('注册用户失败', err);
            return false;
          }
          res.send("<script>alert('注册成功,账号(" + data.userId + ")');location.href='/login'</script>");
        });
      });
    });
  });
});
module.exports = router;
