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

module.exports = routes
