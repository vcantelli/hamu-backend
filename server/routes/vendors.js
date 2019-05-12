const express = require('express')
const routes = express.Router()
const { auth, vendors } = require('../controllers')

routes.route('/login')
  .post(vendors.login)

routes.route('/')
  .post(vendors.create)
  .put(auth, vendors.update)
  .get(auth, vendors.get)

routes.route('/bank/codes')
  .get(vendors.getBankCodes)

routes.route('/token').all(auth)
  .post(vendors.registerToken)

routes.route('/products').all(auth)
  .post(vendors.createProduct)
  .get(vendors.listProducts)

routes.route('/products/categories')
  .get(vendors.getCategoriesList)

routes.route('/products/sales').all(auth)
  .get(vendors.listSales)

routes.route('/terms')
.get(vendors.getTermsHtml)

routes.route('/products/sizes/:id').all(auth)
  .get(vendors.getSizes)

routes.route('/products/:productId').all(auth)
  .get(vendors.getProduct)
  .put(vendors.editProduct)
  .delete(vendors.deleteProduct)

routes.route('/products/:productId/image').all(auth)
  .put(vendors.addImage)

routes.route('/destroy').all(auth)
  .post(vendors.destroy)

module.exports = routes
