const express = require('express')
const routes = express.Router()
const { auth, vendors } = require('../controllers')

// Proposed new routes // Let's discuss it first
routes.route('/login').post(vendors.checkPassword)

routes.route('/')
  .post(vendors.create) // Create new vendor
  .put(auth, vendors.edit) // Edit the vendor :vendorId

routes.route('/products')
  .all(auth)
  .post(vendors.createProduct) // Create new product
  .get(vendors.list) // List all products from that vendor

routes.route('/products/:productId')
  .all(auth)
  .get(vendors.getProduct) // Get a product from that vendor
  .put(vendors.editProduct) // Edit a product from that vendor

routes.route('/products/:productId/image')
  .all(auth)
  .post(vendors.addImage) // Add new image to that product

routes.route('/destroy')
  .all(auth)
  .post(vendors.destroy) // ???

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
