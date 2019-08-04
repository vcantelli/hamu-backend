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
  .get(({params, decoded}, response) => {
    courier.pickUp.getPickupInfo(params.orderNumber, decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/:orderNumber/refuse')
  .all(auth)
  .post(({params, body, decoded}, response) => {
    courier.pickUp.refuse(params.orderNumber, body, decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/:orderNumber/accept')
  .all(auth)
  .post(({params, body, decoded}, response) => {
    courier.pickUp.accept(params.orderNumber, body, decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/:orderNumber/success')
  .all(auth)
  .post(({params, body, decoded}, response) => {
    courier.pickUp.success(params.orderNumber, body, decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/:orderNumber/problem')
  .all(auth)
  .post(({params, body, decoded}, response) => {
    courier.pickUp.problem(params.orderNumber, body, decoded)
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/problem/reasons')
  .all(auth)
  .get((_, response) => {
    courier.pickUp.getProblemReasons()
      .then(success(response))
      .catch(fail(response))
  })

module.exports = routes
