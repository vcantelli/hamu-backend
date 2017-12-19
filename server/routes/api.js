
const inventionsController = require('../controllers').inventions;
const crawlerController = require('../controllers').crawler;

module.exports = (apiRoutes) => {
  
  apiRoutes.get('/', (req, res) => res.send('API v1'));   
  
  apiRoutes.post('/invention/create', inventionsController.create);  
  apiRoutes.get('/invention/list', inventionsController.list); 
  apiRoutes.get('/categories/list', inventionsController.categories); 
  apiRoutes.get('/crawler', crawlerController.crawler); 

}