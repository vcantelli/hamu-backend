const express = require('express')
const routes = express.Router()
const { auth, courier } = require('../../controllers')
const { success, fail } = require('../../helpers/router')

routes.route('/:orderNumber/route')
  .all(auth)
  .get((request, response) => {
    courier.delivery.getRoute(request.decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/:orderNumber/success')
  .all(auth)
  .post((request, response) => {
    courier.delivery.success(request.body, request.decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/:orderNumber/problem')
  .all(auth)
  .post((request, response) => {
    courier.delivery.problem(request.body, request.decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/problem/reasons')
  .all(auth)
  .get((_, response) => {
    courier.delivery.getProblemReasons()
      .then(success(response))
      .catch(fail(response))
  })

module.exports = routes
