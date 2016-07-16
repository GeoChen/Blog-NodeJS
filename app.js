var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);
var settings=require('./db/setting');
var flash=require('connect-flash');


var routes =require('./routes/index')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(methodOverride());
app.use(session({
	secret:settings.cookieSecret,
	store:new MongoStore({
		url: 'mongodb://localhost/mydb'
	})
}));

app.use(flash());


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// // uncomment after placing your favicon in /public
// //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

//这个中间件的作用是创建一个可以应用于所有View模板的全局变量，由于最新版的NodeJS不再支持flash()，
//所以需要'connect-flash'模块，并且需要做如下的转换,创建local的error和sucess并作为全局量应用于所有视图模板。
//在后面的应用中只需要req.flash('error',"两次密码不一致"),避免每次都要用res.render()的麻烦;具体见Chorme浏览器的书签
app.use(function(req,res,next){
  res.locals.user=req.session.user;//为模板传递user参数

  var err = req.flash('error');
  var success = req.flash('success');

  res.locals.error = err.length ? err : null;//为模板传递error
  res.locals.success = success.length ? success : null;//为模板传递sucess
   
  next();
});


app.get('/',routes.index);
// app.get('/u/:user',routes.user);
// app.post('/post',routes.post);checkNotLogin
app.get('/reg',routes.checkNotLogin);
app.get('/reg',routes.reg);
app.post('/reg',routes.checkNotLogin);
app.post('/reg',routes.doReg);
app.get('/login',routes.checkNotLogin);
app.get('/login',routes.login);
app.post('/login',routes.checkNotLogin);
app.post('/login',routes.doLogin);
app.get('/logout',routes.checkLogin);
app.get('/logout',routes.logout);
app.post('/post',routes.checkLogin);
app.post('/post',routes.post);
app.get('/u/:user',routes.getInfo);
app.get('/back',routes.backUserPage);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
app.listen(8888);

module.exports = app;
