var mongodb=require('./db');
function User(user) {
	this.name=user.name;
	this.password=user.password;
};
module.exports=User;

User.prototype.save = function save(callback){
	//存入Mongodb
	var user={
		name:this.name,
		password:this.password,
	};
	mongodb.open(function (err,db) {
		if (err) {
			mongodb.close();
			return callback(err);
		}
		db.collection('users',function (err,collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//为name添加索引
			collection.ensureIndex('name',{unique:true});
			//写入user文档
			collection.insert(user,{safe:true},function (err,user) {
				if (err) {
					mongodb.close();
					return callback(err);
				}
				return callback("sucess");
			});
		});
	});
};
User.get = function get(username,callback){
	 mongodb.open(function (err,db) {
	 	if (err) {
			return callback(err);
		}
		//读取users集合
		db.collection('users',function (err,collection) {
			if (err) {
				console.log(err);
				mongodb.close();
				return callback(err);
			}
			//查找name属性为username的文档
			//findOne:之查询第一个匹配结果，返回一个JSON对象
			//find:查询所有结果，需要用find().toArray()，返回一个对象数组;
			collection.findOne({name:username},function (err,doc) {
				mongodb.close();
				if(doc){
					//封装文档为User对象
					var user=new User(doc);
					callback(err,user);
				}else{
					callback(err,null);
				}
			});
		});
	 });
};
