
const inventionsController = require('../controllers').inventions;

module.exports = (apiRoutes) => {
  
  apiRoutes.get('/', (req, res) => res.send('API v1'));   
  
  apiRoutes.post('/invention/create', inventionsController.create);  
  apiRoutes.get('/invention/list', inventionsController.list); 
  apiRoutes.get('/categories/list', inventionsController.categories); 

}