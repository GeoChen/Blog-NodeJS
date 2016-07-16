var setting=require('./setting');
var mongodb=require('mongodb');

module.exports=new mongodb.Db('mydb',new mongodb.Server(setting.host,setting.port));




// var Db=require('mongodb').Db;
// // var Connect=require('mongodb').Connection;
// var Server=require('mongodb').Server;

// module.exports=new Db(setting.db,new Server(setting.host,setting.port));
