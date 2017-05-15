var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var expressHbs = require('express-handlebars');
var session = require('express-session');

var MongoStore = require('connect-mongo')(session);

var mongoose =require('mongoose');

//routes
var index = require('./routes/index');
var users = require('./routes/users');
var shop = require('./routes/shop/shop')

var app = express();

//set up mongoDB
// mongoose.connect('mongodb://yuxinzhang:**OctEngi0606@cluster0-shard-00-00-czv9t.mongodb.net:27017,cluster0-shard-00-01-czv9t.mongodb.net:27017,cluster0-shard-00-02-czv9t.mongodb.net:27017/yuxinzhangpw?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
mongoose.connect('localhost:27017/yuxinzhangpw');
mongoose.Promise = global.Promise;

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//session
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 120 * 60 * 1000 }
}));

//flash
app.use(flash());

//route static file to public
app.use(express.static(path.join(__dirname, 'public')));

//route different account
app.use('/users', users);
app.use('/shop', shop);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
