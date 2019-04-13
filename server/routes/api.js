const express = require('express')
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
const routes = express.Router()

routes.get('/', (_requisicao, resposta) => { resposta.send('API v1') })
routes.get('/vendors/list', list)
routes.post('/vendors/create', create)
routes.post('/vendors/edit', edit)
routes.post('/vendors/destroy', destroy)
routes.get('/vendors/checkPassword', checkPassword)
routes.get('/vendors/addImage', addImage)
routes.post('/vendors/createProduct', createProduct)
routes.get('/vendors/getProduct', getProduct)
routes.post('/vendors/editProduct', editProduct)
routes.get('/vendors/checkFacebookId', checkFacebookId)

module.exports = routes
