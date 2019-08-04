const express = require('express')
const routes = express.Router()
const vendors = require('./vendors')
const courier = require('./courier')

routes.get('/', function (_requisicao, resposta) {
  resposta.send('API v1')
})

routes.use('/vendors', vendors)
routes.use('/courier', courier)

module.exports = routes
