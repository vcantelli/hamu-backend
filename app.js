var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var flash    = require('connect-flash');
var session      = require('express-session');

const http = require('http').Server(app);
const port = process.env.PORT || 8080;

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// view engine setup
app.set('view engine', 'ejs');
app.set('views', 'views/');
app.set('models', 'models/');

const apiRoutes = express.Router();
require('./server/routes/api')(apiRoutes);
app.use('/api', apiRoutes);
app.use(express.static('public'));

module.exports = app;

/* LAUNCH */
http.listen(port);
console.log('Witchcraft happening at port: ' + port);