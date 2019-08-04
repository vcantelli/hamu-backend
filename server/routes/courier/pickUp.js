const express = require('express')
const routes = express.Router()
const { auth, courier } = require('../../controllers')
const { success, fail } = require('../../helpers/router')

routes.route('/new-request')
  .all(auth)
  .get((request, response) => {
    courier.pickUp.hasNewRequest(request.decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/:orderNumber')
  .all(auth)
  .get((request, response) => {
    courier.pickUp.getPickupInfo(request.params.orderNumber, request.decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/:orderNumber/refuse')
  .all(auth)
  .post((request, response) => {
    courier.pickUp.refuse(request.params.orderNumber, request.body, request.decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/:orderNumber/accept')
  .all(auth)
  .post((request, response) => {
    courier.pickUp.accept(request.params.orderNumber, request.body, request.decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/:orderNumber/success')
  .all(auth)
  .post((request, response) => {
    courier.pickUp.success(request.params.orderNumber, request.body, request.decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/:orderNumber/problem')
  .all(auth)
  .post((request, response) => {
    courier.pickUp.problem(request.params.orderNumber, request.body, request.decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/problem/reasons')
  .all(auth)
  .post((request, response) => {
    courier.pickUp.getProblemReasons(request.body, request.decoded)
      .then(success(response))
      .catch(fail(response))
  })

module.exports = routes
