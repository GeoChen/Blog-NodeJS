var crypto=require('crypto'); //MD5加密
var User=require('../db/user');
var Post=require('../db/post');

/* GET home page. */
exports.index=function(req, res, next) {
  // if (!req.session.user) {
    // res.render('index',{"title":"首页"});
      Post.get(null,function (err,posts) {
        if (err) {
          req.flash('error',err);
          return res.redirect('/');
        }
        res.render('index',{
          title:"首页",
          posts:posts,//文章标题，用户名，文章内容
        });
      });
  // }
  // if (req.session.user) {
  //   var user=req.session.user;
  //     Post.get(user.name,function (err,posts) {
  //       if (err) {
  //         req.flash('error',err);
  //         return res.redirect('/');
  //       }
  //       res.render('index',{
  //         title:user.name,
  //         posts:posts,//文章标题，用户名，文章内容
  //       });
  //     });
  // }
};
exports.user=function(req, res) {
  
};
exports.post=function(req, res) {
  
};
exports.reg=function(req, res) {
  res.render('reg',{"title":"注册"})
};
exports.doReg=function(req, res) {
  //检查两次密码是否一致
  if(req.body['password-repeat']!=req.body['password']){
  	req.flash('error',"两次密码不一致");//作用是：创建error这个全局量，其内容是“次密码不一致”，这个全局量可以自动应用于所有的视图模板
  	return res.redirect('/reg');
  }
  //生成密码的散列值
  var md5=crypto.createHash('md5');
  var password=md5.update(req.body.password).digest('base64');
  var newUser=new User({
  	name:req.body.username,
  	password:password,
  });
  //检查用户名是否已存在
  User.get(newUser.name,function (err,user) {
  	if (user) 
  		err='用户已存在！请重新输入用户名:)'
  	if(err){
  		req.flash('error',err);
  		return res.redirect('/reg');
  	}
  	//如果是新用户
  	newUser.save(function (err) {
		if (err!="sucess") {
	  		req.flash('error',err);
	  		return res.redirect('/reg');	
	  	}
	  	req.session.user=newUser;//将当前会话存在req的session中，下次登录的时候自动获取
	  	req.flash('sucess','注册成功');
	  	return res.redirect('/');
  	})
 
  });
};
exports.login=function(req, res) {
  res.render('login',{
  	title:"登录",
  });
};
exports.doLogin=function(req, res) {
  var md5=crypto.createHash('md5');
  var password=md5.update(req.body.password).digest('base64');
  // var oldUser=new User({
  // 	name:req.body.username,
  // 	password:password,
  // });
  User.get(req.body.username,function (err,user) {
  	if(!user){
  		req.flash('error',"用户不存在");
      return res.redirect('/login');
  	}
  	if(user.password!=password){
  		req.flash('error',"密码错误");
  		return res.redirect('/login');
  	}
  	req.session.user=user;
  	req.flash('sucess',"登陆成功");
  	res.redirect('/u/'+req.body.username);
  });
};

exports.logout=function(req, res) {
  req.session.user=null;
  req.flash('sucess',"登出成功");
  res.redirect('/');
};
exports.post=function (req,res) {
	var currentUser=req.session.user;
	var post=new Post(currentUser.name,req.body.ptitle,req.body.passage);
  //console.log("**************"+req.body.ptitle);
	post.save(function (err) {
		if (err) {
			req.flash('error',err);
			return res.redirect('/');
		}
		req.flash('sucess','发表成功');
		res.redirect('/u/'+currentUser.name);
	});
};
exports.getInfo=function (req,res) {
	User.get(req.params.user,function (err,user) {//req.params.user获取'/u/:user'中的user
		if (!user) {
			req.flash('error','用户不存在');
			return res.redirect('/');
		}
		Post.get(user.name,function (err,posts) {
			if (err) {
				req.flash('error',err);
				return res.redirect('/');
			}
			res.render('index',{
				title:user.name,
				posts:posts,//文章标题，用户名，文章内容
			});
		});
	});
};
exports.backUserPage=function (req,res) {
  if (req.session.user) {
    res.redirect('/u/'+req.session.user.name);
  }else{
    req.flash('error',"请登录！");
    return res.redirect('/');
  }
};




//写一个中间件，用于判断当前页面是否是非登录非法打开
exports.checkNotLogin=function (req,res,next) {
	if (req.session.user) {
		req.flash('error',"已登录！");
		return res.redirect('/');
	}
	next();
};
exports.checkLogin=function (req,res,next) {
	if (!req.session.user) {
		req.flash('error',"未登录！");
		return res.redirect('/login');
	}
	next();
};



