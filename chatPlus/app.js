var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var logger = require('morgan');

var session = require('express-session');

var { URL } = require('url');
var session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// Use express-session middleware for express
app.use(session({
  secret: 'happy fat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false,maxAge: 1000*60*30 },
  rolling: true
}));


app.use(function(req,res,next){
  var referer = "";
  if(req.headers.referer){
    referer = new URL(req.headers.referer).pathname;
  }
  if(req.url == '/login' || (req.url == '/users' && referer == '/login')|| (req.url == '/users/register' && referer == '/login')){
    next();
  } else if(req.session.userinfo && req.session.userinfo.username != ''){
    app.locals['userinfo'] = req.session.userinfo;//配置ejs全局参数
    next();
  }else {
    res.redirect('/login');//重定向
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
