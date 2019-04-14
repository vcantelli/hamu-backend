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
  editProduct,
  checkFacebookId
} = require('../controllers').vendorsController

routes.get('/list', list)
routes.post('/create', create)
routes.post('/edit', edit)
routes.post('/destroy', destroy)
routes.get('/checkPassword', checkPassword)
routes.post('/addImage', addImage)
routes.post('/createProduct', createProduct)
routes.get('/getProduct', getProduct)
routes.post('/editProduct', editProduct)
routes.get('/checkFacebookId', checkFacebookId)

// Proposed new routes // Let's discuss it first
// routes.post('/', create) // Create new vendor
// routes.put('/:vendorId', edit) // Edit the vendor :vendorId
// routes.post('/:vendorId/products', createProduct) // Create new product
// routes.get('/:vendorId/products', list) // List all products from that vendor
// routes.get('/:vendorId/products/:productId', getProduct) // Get a product from that vendor
// routes.put('/:vendorId/products/:productId', editProduct) // Edit a product from that vendor
// routes.post('/:vendorId/products/:productId/image', addImage) // Add new image to that product
// routes.post('/destroy', destroy) // ???
// routes.get('/password/check', checkPassword) // Check username and password
// routes.get('/facebook-id/check', checkFacebookId) // Check FacebookID

module.exports = routes
