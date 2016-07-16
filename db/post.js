var mongodb=require('./db');

function Post(username,ptitle,post,time) {
	this.user=username;
	this.post=post;
	this.ptitle=ptitle;
	if (time) {
		this.time=time;
	}else{
		this.time=new Date();
	}
};
module.exports=Post;

Post.prototype.save = function(callback){
	 //存入MongoDB的文档
	 var post={
	 	user:this.user,
	 	post:this.post,
	 	time:this.time,
	 	title:this.ptitle,
	 };
	 mongodb.open(function (err,db) {
	 	if (err) {
	 		return callback(err);
	 	}
	 	//读取posts集合
	 	db.collection('post',function (err,collection) {
	 		if (err) {
	 			mongodb.close();
	 			return callback(err);
	 		}
	 		//为user添加索引
	 		collection.ensureIndex('user');
	 		//写入post文档
	 		collection.insert(post,{safe:true},function (err,post) {
	 			mongodb.close();
	 			callback(err,post);
	 		});
	 	});
	 });
};

Post.get = function get(username,callback){
	 mongodb.open(function (err,db) {
	 	if (err) {
	 		return callback(err);
	 	}
	 	db.collection('post',function (err,collection) {
	 		if (err) {
	 			mongodb.close();
	 			return callback(err);
	 		}
		 	//查找user属性为username的文档，如果username是null则匹配全部
		 	var query={};
		 	if (username) {
		 		query.user=username;
		 	}
		 	collection.find(query).sort({time:-1}).toArray(function (err,docs) {
		 		mongodb.close();
		 		if (err) {
		 			callback(err,null);
		 		}
		 		//封装posts为Post对象
		 		var posts=[];
		 		docs.forEach( function(doc, index) {
		 			var post=new Post(doc.user,doc.title,doc.post,doc.time);
		 			posts.push(post);
		 			//console.log(doc);
		 		});
		 		callback(null,posts);
		 	});
	 	});

	 });
};

