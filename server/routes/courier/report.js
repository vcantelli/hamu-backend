const express = require('express')
const routes = express.Router()
const { auth, courier } = require('../../controllers')
const { success, fail } = require('../../helpers/router')

routes.route('/orders')
  .all(auth)
  .get((request, response) => {
    courier.report.orders(request.body, request.decoded)
      .then(success(response))
      .catch(fail(response))
  })

  module.exports = routes
