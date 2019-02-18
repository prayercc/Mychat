var express = require('express');
var router = express.Router();
var fs = require('fs');
var multiparty = require('multiparty');
var md5 = require('md5-node');
var DB = require('../util/mongoDB.js');
/* GET users listing. */

//登陆功能
//2019/1/2 限制查询字段   prayer
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
    DB.findLimit("users", whereStr, {
      'userId': 1,
      "username": 1,
      "icon": 1
    }, function(finderr, doc) {
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
          if (updateOneErr) {
            console.log('updateOneErr: ', updateOneErr);
            return false;
          }
          req.session.userinfo = {
            "_id":doc[0]._id,
            "icon":doc[0].icon,
            "username":doc[0].username,
            "userId":doc[0].userId
          };
          res.redirect('/index');
        });
      } else {
        res.send("<script>alert('登陆失败(密码或账号错误)');location.href='/login'</script>");
      }
    });
  });
});
router.get('/login', function(req, res) {
  res.render('login');
});
//注册功能
router.post('/register', function(req, res, next) {
  var form = new multiparty.Form();
  form.parse(req, function(err, fields, files) {
    //获取一个id号
    DB.findOne('idtable', {
      "isUse": false
    }, function(err, finddoc) {
      if (err) {
        console.log('获取一个id号失败', err);
        return false;
      }
      // 把选中id号置为失效
      DB.updateOne("idtable", {
        "userId": finddoc[0].userId
      }, {
        "isUse": true
      }, function(err, updoc) {
        if (err) {
          console.log('失效错误', err);
          return false;
        }
        var data = {
          userId: finddoc[0].userId,
          username: fields.signuser[0],
          password: md5(fields.signpass[0]),
          signTime: new Date().getTime(),
          gender: "man",
          birthday: "",
          partment: "",
          position: "",
          maritalStatus: "married",
          telNumber: "",
          email: "",
          introduce: "这个人很懒，什么都没有留下~",
          icon: "/images/sysIcon/"+Math.ceil(Math.random()*23)+".png", //默认头像
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
// 用户详细信息
router.get('/userinfo/:userId', function(req, res) {
  console.log('查询当前用户信息');
  let userId = new DB.ObjectID(req.params.userId);
  //查询详细信息
  DB.findLimit('users', {
    "_id": userId
  }, {
    "password": 0,
    "userId": 0
  }, function(err, doc) {
    if (err) {
      console.log('users info err:', err);
      return false;
    }
    if (doc.length > 0) {
      console.log(doc[0]);

      res.render('userinfo', {
        userinfo: doc[0]
      });
    } else {
      res.send('这操作很危险呀');
    }
  });
});
// 用户修改基本信息
router.post('/resetinfo', function(req, res) {
  var isSet = false;
  var form = new multiparty.Form({ uploadDir: 'public/upload'});
  form.parse(req, function(err, fields, files) {
    var whereStr = {
      "username" : fields.username[0],
      "gender" : fields.userSex[0],
      "birthday" : fields.userBirthday[0],
      "maritalStatus" : fields.maritalStatus[0],
      "partment" : fields.department[0],
      "position" : fields.position[0],
      "telNumber" : fields.telphone[0],
      "introduce" : fields.introduce[0]
    };
    var ID = new DB.ObjectID(fields.id[0]);

    //判断图片修改
    if (files.icon[0].originalFilename) {
      isSet = true;
      whereStr["icon"] = files.icon[0].path.replace("public","");
      //删除之前的图片
      fs.unlink(fields.oldIcon[0], function(err) {
        if (err) {
          console.log('删除之前图片失败',err);
        }
      });
    } else {
      //删除零时文件
      fs.unlink(files.icon[0].path, function(err) {
        if (err) {
          console.log('删除零时文件失败',err);
        }
      });
    }
    console.log('提交信息：',ID,whereStr);
    DB.updateOne('users', {
      "_id": ID
    }, whereStr, function(err, doc) {
      if (err) {
        console.log('用户信息修改报错', err);
        return false;
      }
      if(isSet){
        req.session.userinfo.icon = whereStr.icon;// 修改session icon 同步更新
      }
      res.redirect('/users/userinfo/'+ID);
    });
  });
});
module.exports = router;
