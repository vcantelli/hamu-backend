const express = require('express')
const routes = express.Router()
const { auth, courier } = require('../../controllers')
const { success, fail } = require('../../helpers/router')

routes.route('/:orderNumber/route')
  .all(auth)
  .get(({params, decoded}, response) => {
    courier.delivery.getRoute(params.orderNumber, decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/:orderNumber/success')
  .all(auth)
  .post(({params, body, decoded}, response) => {
    courier.delivery.success(params.orderNumber, body, decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/:orderNumber/problem')
  .all(auth)
  .post(({params, body, decoded}, response) => {
    courier.delivery.problem(params.orderNumber, body, decoded)
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
