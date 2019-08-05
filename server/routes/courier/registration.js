const express = require('express')
const routes = express.Router()
const { auth, courier } = require('../../controllers')
const { success, fail } = require('../../helpers/router')

routes.route('/terms')
  .get((_, response) => {
    try {
      courier.registration.getTermsHtml()
        .then(success(response))
        .catch(fail(response))
    } catch (e) {fail(response)(e)}
  })

routes.route('/')
  .post((request, response) => {
    try {
      courier.registration.create(request.body)
        .then(success(response))
        .catch(fail(response))
    } catch (e) {fail(response)(e)}
  })
  .all(auth)
  .put((request, response) => {
    try {
      courier.registration.update(request.body, request.decoded)
        .then(success(response))
        .catch(fail(response))
    } catch (e) {fail(response)(e)}
  })
  .get((_, response) => {
    try {
      courier.registration.get()
        .then(success(response))
        .catch(fail(response))
    } catch (e) {fail(response)(e)}
  })

routes.route('/bank/codes')
  .get((_, response) => {
    try {
      courier.registration.getBankCodes()
        .then(success(response))
        .catch(fail(response))
    } catch (e) {fail(response)(e)}
  })

routes.route('/register-options')
  .get((_, response) => {
    try {
      courier.registration.getRegisterOptions()
        .then(success(response))
        .catch(fail(response))
    } catch (e) {fail(response)(e)}
  })

//? Precisa desta rota aqui?
// routes.route('/destroy').all(auth)
//   .post(courier.registration.destroy)

module.exports = routes
