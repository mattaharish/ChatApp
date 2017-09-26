var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Chatapp');

var users = require('./app/controllers/users');

// Init App
var app = express();

// socket connection
var http = require('http').Server(app);

require('./app/controllers/chat.js').chat(http);
// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/app/views'));
app.use(express.static(__dirname + '/public'));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Connect Flash
app.use(flash());

//Routes Definition
app.use('/', users);

// catch 404 and forward to error handler
app.get('*', function (req, res, next) {
  req.status = 404;
  next("Page Not Found!!");
});

// error handler
app.use(function (err, req, res, next) {

  if (req.status == 404) {
    res.render('error', {
      message: err
    });
  }
});

// Set Port
app.set('port', (process.env.PORT || 8000));

http.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});