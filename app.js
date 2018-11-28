var express = require('express')
var app = express()
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var morgan = require('morgan')

const http = require('http').Server(app)
const port = process.env.PORT || 8080
const url = require('url');
const fixieUrl = url.parse('http://fixie:ZZksOn1Ml8Qcm8x@velodrome.usefixie.com:80');
const requestUrl = url.parse('https://hamu.herokuapp.com');

http.get({
    host: fixieUrl.hostname,
    port: fixieUrl.port,
    path: requestUrl.href,
    headers: {
      Host: requestUrl.host,
      'Proxy-Authorization': `Basic ${new Buffer(fixieUrl.auth).toString('base64')}`,
    }
}, res => {
  console.log(`Got response: ${res.statusCode}`);
});

app.use(bodyParser.json({limit: '50mb'}))
app.use(morgan('dev')) // log every request to the console
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// view engine setup
app.set('view engine', 'ejs')
app.set('views', 'views/')
app.set('models', 'models/')

const apiRoutes = express.Router()
require('./server/routes/api')(apiRoutes)
app.use('/api', apiRoutes)
app.use(express.static('public'))

module.exports = app

/* LAUNCH */
http.listen(port)
console.log('Witchcraft happening at port: ' + port)
