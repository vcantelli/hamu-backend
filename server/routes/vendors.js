const express = require('express')
const routes = express.Router()
const { auth, vendors } = require('../controllers')

routes.route('/login')
  .post(vendors.checkPassword)

routes.route('/')
  .post(vendors.create)
  .put(auth, vendors.edit)

routes.route('/products').all(auth)
  .post(vendors.createProduct)
  .get(vendors.listProducts)

routes.route('/products/:productId').all(auth)
  .get(vendors.getProduct)
  .put(vendors.editProduct)

routes.route('/products/:productId/image').all(auth)
  .put(vendors.addImage)

routes.route('/destroy').all(auth)
  .post(vendors.destroy)

module.exports = routes
