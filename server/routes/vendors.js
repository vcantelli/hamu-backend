const express = require('express')
const routes = express.Router()
const { authController, vendorsController } = require('../controllers')

// Proposed new routes // Let's discuss it first
routes.route('/login').post(vendorsController.checkPassword)

routes.route('/')
  .post(vendorsController.create) // Create new vendor
  .put(authController, vendorsController.edit) // Edit the vendor :vendorId

routes.route('/products')
  .all(authController)
  .post(vendorsController.createProduct) // Create new product
  .get(vendorsController.list) // List all products from that vendor

routes.route('/products/:productId')
  .all(authController)
  .get(vendorsController.getProduct) // Get a product from that vendor
  .put(vendorsController.editProduct) // Edit a product from that vendor

routes.route('/products/:productId/image')
  .all(authController)
  .post(vendorsController.addImage) // Add new image to that product

routes.route('/destroy')
  .all(authController)
  .post(vendorsController.destroy) // ???

// Old routes
// routes.get('/list', list)
// routes.post('/create', create)
// routes.post('/edit', edit)
// routes.post('/destroy', destroy)
// routes.get('/checkPassword', checkPassword)
// routes.post('/addImage', addImage)
// routes.post('/createProduct', createProduct)
// routes.get('/getProduct', getProduct)
// routes.post('/editProduct', editProduct)
// routes.get('/checkFacebookId', checkFacebookId)

module.exports = routes
