const express = require('express')
const routes = express.Router()
const vendors = require('./vendors')

routes.get('/', function (_requisicao, resposta) {
  resposta.send('API v1')
})

routes.use('/vendors', vendors)

module.exports = routes
