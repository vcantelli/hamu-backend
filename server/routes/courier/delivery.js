const express = require('express')
const routes = express.Router()
const { auth, courier } = require('../../controllers')
const { success, fail } = require('../../helpers/router')

routes.route('/:orderNumber/route')
  .all(auth)
  .get(({params, decoded}, response) => {
    try {
      courier.delivery.getRoute(params.orderNumber, decoded)
      .then(success(response))
      .catch(fail(response))
    } catch(e) {fail(response)(e)}
  })

routes.route('/:orderNumber/success')
  .all(auth)
  .post(({params, body, decoded}, response) => {
    try {
      courier.delivery.success(params.orderNumber, body, decoded)
      .then(success(response))
      .catch(fail(response))
    } catch(e) {fail(response)(e)}
  })

routes.route('/:orderNumber/problem')
  .all(auth)
  .post(({params, body, decoded}, response) => {
    try {
      courier.delivery.problem(params.orderNumber, body, decoded)
      .then(success(response))
      .catch(fail(response))
    } catch(e) {fail(response)(e)}
  })

routes.route('/problem/reasons')
  .all(auth)
  .get((_, response) => {
    try {
      courier.delivery.getProblemReasons()
      .then(success(response))
      .catch(fail(response))
    } catch(e) {fail(response)(e)}
  })

module.exports = routes
