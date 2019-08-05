const express = require('express')
const routes = express.Router()
const { courier } = require('../../controllers')
const { success, fail } = require('../../helpers/router')

routes.route('/login')
  .post((request, response) => {
    try {
      courier.auth.login(request.body)
        .then(success(response))
        .catch(fail(response))
    } catch (e) {fail(response)(e)}
  })

  // ? Que isso aqui?
// routes.route('/token')
//   .all(auth)
//   .post(courier.auth.registerToken)

module.exports = routes
