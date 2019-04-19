const express = require('express')
const routes = express.Router()
const {
  list,
  create,
  edit,
  destroy,
  checkPassword,
  addImage,
  createProduct,
  getProduct,
  editProduct
} = require('../controllers').vendorsController
const authenticator = require('../controllers').authController

// Proposed new routes // Let's discuss it first
routes.route('/login').post(checkPassword)

routes.route('/')
  .post(create) // Create new vendor
  .put(authenticator, edit) // Edit the vendor :vendorId

routes.route('/products')
  .all(authenticator)
  .post(createProduct) // Create new product
  .get(list) // List all products from that vendor

routes.route('/products/:productId')
  .all(authenticator)
  .get(getProduct) // Get a product from that vendor
  .put(editProduct) // Edit a product from that vendor

routes.route('/products/:productId/image')
  .all(authenticator)
  .post(addImage) // Add new image to that product

routes.route('/destroy')
  .all(authenticator)
  .post(destroy) // ???

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
