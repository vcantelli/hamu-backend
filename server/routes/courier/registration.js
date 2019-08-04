const express = require('express')
const routes = express.Router()
const { auth, courier } = require('../../controllers')
const { success, fail } = require('../../helpers/router')

routes.route('/terms')
  .get((request, response) => {
    courier.registration.getTermsHtml()
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/')
  .post((request, response) => {
    courier.registration.create(request.body, request.decoded)
      .then(success(response))
      .catch(fail(response))
  })
  .all(auth)
  .put((request, response) => {
    courier.registration.update(request.body, request.decoded)
      .then(success(response))
      .catch(fail(response))
  })
  .get((request, response) => {
    courier.registration.get()
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/bank/codes')
  .get((request, response) => {
    courier.registration.getBankCodes()
      .then(success(response))
      .catch(fail(response))
  })

routes.route('/register-options')
  .get((request, response) => {
    courier.registration.getRegisterOptions()
      .then(success(response))
      .catch(fail(response))
  })

//? Precisa desta rota aqui?
// routes.route('/destroy').all(auth)
//   .post(courier.registration.destroy)

module.exports = routes
