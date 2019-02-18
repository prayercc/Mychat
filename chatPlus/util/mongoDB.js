/*
**  操作数据库封装
*/
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
/* mongodb */
const dbURL = "mongodb://127.0.0.1:27017/";
const dbName = "chatSystem";

// 连接数据库
function __connectDb(callback){
  MongoClient.connect(dbURL,{useNewUrlParser: true},function(err,client){
    if(err){
      console.log('数据库连接失败',err);
      return false;
    }
    var db = client.db(dbName);
    // 增删改查操作
    callback(client,db);
  });
}

/* 数据库查找
** Db.find(collectionName,query,callback)      单表简单查询
** 参数介绍：
**          collectionName          集合名
**          whereStr                查询条件
**          colStr                  返回列条件
**          callback                回调函数
*/
// 全部信息查询
exports.find = function(collectionName,whereStr,callback){
  __connectDb(function(client,db){
    db.collection(collectionName).find(whereStr).toArray(function(err,doc){
      client.close();
      callback(err,doc);
    });
  });
}
// 指定字段查询
exports.findLimit = function(collectionName,whereStr,colStr,callback){
  __connectDb(function(client,db){
    db.collection(collectionName).find(whereStr,colStr).toArray(function(err,doc){
      client.close();
      callback(err,doc);
    });
  });
}
// 查询一条
exports.findOne = function(collectionName,whereStr,callback){
  __connectDb(function(client,db){
    db.collection(collectionName).find(whereStr).limit(1).toArray(function(err,doc){
      client.close();
      callback(err,doc);
    });
  });
}
// 多表联合查询
// leftCollectionName 左表
// lookup 连接条件
exports.findUnite = function(leftCollectionName,match,lookup,project,unwind,callback){
  __connectDb(function(client,db){
    db.collection(leftCollectionName).aggregate([
      { $match: match},
      { $lookup: lookup},
      { $project: project },
      { $unwind: unwind }
    ]).toArray(function(err,doc){
      client.close();
      callback(err,doc);
    })
  });
}
/* 数据库增加
** Db.insertOne(collectionName,whereStr,callback)    新增一条
** Db.insertMany(collectionName,whereStr,callback)    新增多条
** 参数介绍：
**          collectionName          集合名
**          data                    插入单条数据
**          arr                     插入多条数据(多为数组集合)
**          callback                回调函数
*/
exports.insertOne = function(collectionName,data,callback){
  __connectDb(function(client,db){
    db.collection(collectionName).insertOne(data,function(err,doc){
      client.close();
      callback(err,doc);
    });
  });
}
exports.insertMany = function(collectionName,arr,callback){
  __connectDb(function(client,db){
    db.collection(collectionName).insertMany(arr,function(err,doc){
      client.close();
      callback(err,doc);
    });
  });
}
/* 数据库修改
** Db.updateOne(collectionName,conditionStr,targetStr,callback)    修改满足条件得第一条数据
** Db.updateMany(collectionName,conditionStr,targetStr,callback)   修改满足条件的所有数据
** 参数介绍：
**          collectionName          集合名
**          conditionStr            修改条件
**          targetStr               修改内容
**          callback                回调函数
*/
exports.updateOne = function(collectionName,conditionStr,targetStr,callback){
  __connectDb(function(client,db){
    db.collection(collectionName).updateOne(conditionStr,{$set:targetStr},function(err,doc){
      client.close();
      callback(err,doc);
    });
  });
}
exports.updateMany = function(collectionName,conditionStr,targetStr,callback){
  __connectDb(function(client,db){
    db.collection(collectionName).updateMany(conditionStr,{$set:targetStr},function(err,doc){
      client.close();
      callback(err,doc);
    });
  });
}


/* 数据库删除
** Db.deleteOne(collectionName,whereStr,callback)         删除满足条件得第一条数据
** Db.deleteMany(collectionName,whereStr,callback)        删除满足条件所有数据
** 参数介绍：
**          collectionName          集合名
**          whereStr                删除条件
**          callback                回调函数
*/
exports.deleteOne = function(collectionName,whereStr,callback){
  __connectDb(function(client,db){
    db.collection(collectionName).deleteOne(whereStr,function(err,doc){
      client.close();
      callback(err,doc);
    });
  });
}
exports.deleteMany = function(collectionName,whereStr,callback){
  __connectDb(function(client,db){
    db.collection(collectionName).deleteMany(whereStr,function(err,doc){
      client.close();
      callback(err,doc);
    });
  });
}

exports.ObjectID = ObjectID;
