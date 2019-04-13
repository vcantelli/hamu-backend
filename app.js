const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const morgan = require('morgan')
const app = express()

// const url = require('url')
// const fixieUrl = url.parse('http://fixie:ZZksOn1Ml8Qcm8x@velodrome.usefixie.com:80')
// const requestUrl = url.parse('https://hamu.herokuapp.com')

app.use(morgan('dev')) // log every request to the console
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(cookieParser())

// app.get({
//   host: fixieUrl.hostname,
//   port: fixieUrl.port,
//   path: requestUrl.href,
//   headers: {
//     Host: requestUrl.host,
//     'Proxy-Authorization': `Basic ${new Buffer(fixieUrl.auth).toString('base64')}`,
//   }
// }, res => {
// console.log(`Got response: ${res.statusCode}`);
// });

// view engine setup
app.set('view engine', 'ejs')
app.set('views', 'views/')
app.set('models', 'models/')

app.use('/api', require('./server/routes/api'))
app.use(express.static('public'))

module.exports = app
