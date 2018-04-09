
const vendorsController = require('../controllers').vendors
const pagarmeController = require('../controllers').pagarme

module.exports = (apiRoutes) => {
  apiRoutes.get('/', (req, res) => res.send('API v1'))
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

  apiRoutes.get('/pagarme/createTransaction', pagarmeController.createTransaction)
  apiRoutes.get('/pagarme/getTransaction', pagarmeController.getTransaction)
  apiRoutes.get('/pagarme/refundTransaction', pagarmeController.refundTransaction)
  apiRoutes.get('/pagarme/getTransactionEvents', pagarmeController.getTransactionEvents)
  apiRoutes.get('/pagarme/getTransactionGatewayOperations', pagarmeController.getTransactionGatewayOperations)
}
