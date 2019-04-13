const http = require('http').Server(require('./app'))

/* LAUNCH */
http.listen(process.env.PORT || 8080, function () {
  console.log('Witchcraft happening at port', this.address().port)
})

module.exports = http
