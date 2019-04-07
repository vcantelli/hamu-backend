const vendorsController = require('../controllers').vendors

module.exports = (apiRoutes) => {
  apiRoutes.get('/', (_requisicao, resposta) => resposta.send('API v1'))
  apiRoutes.get('/vendors/list', vendorsController.list)
  apiRoutes.post('/vendors/create', vendorsController.create)
  apiRoutes.post('/vendors/edit', vendorsController.edit)
  apiRoutes.post('/vendors/destroy', vendorsController.destroy)
  apiRoutes.get('/vendors/checkPassword', vendorsController.checkPassword)
  apiRoutes.get('/vendors/addImage', vendorsController.addImage)
  apiRoutes.post('/vendors/createProduct', vendorsController.createProduct)
  apiRoutes.get('/vendors/getProduct', vendorsController.getProduct)
  apiRoutes.post('/vendors/editProduct', vendorsController.editProduct)
  apiRoutes.get('/vendors/checkFacebookId', vendorsController.checkFacebookId)
}
