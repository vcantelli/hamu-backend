
const vendorsController = require('../controllers').vendors
const url = require('url')
const fixieUrl = url.parse('http://fixie:ZZksOn1Ml8Qcm8x@velodrome.usefixie.com:80')
const requestUrl = url.parse('/vendors/checkPassword')

module.exports = (apiRoutes) => {
  apiRoutes.get({
      host: fixieUrl.hostname,
      port: fixieUrl.port,
      path: requestUrl.href,
      headers: {
        Host: requestUrl.host,
        'Proxy-Authorization': `Basic ${new Buffer(fixieUrl.auth).toString('base64')}`,
      }
  }, vendorsController.checkPassword)
  apiRoutes.get('/', (req, res) => res.send('API v1'))
  apiRoutes.get('/vendors/list', vendorsController.list)
  apiRoutes.post('/vendors/create', vendorsController.create)
  apiRoutes.post('/vendors/edit', vendorsController.edit)
  apiRoutes.post('/vendors/destroy', vendorsController.destroy)
  // apiRoutes.get('/vendors/checkPassword', vendorsController.checkPassword)
  apiRoutes.get('/vendors/addImage', vendorsController.addImage)
  apiRoutes.post('/vendors/createProduct', vendorsController.createProduct)
  apiRoutes.get('/vendors/getProduct', vendorsController.getProduct)
  apiRoutes.post('/vendors/editProduct', vendorsController.editProduct)
  apiRoutes.get('/vendors/checkFacebookId', vendorsController.checkFacebookId)
}
