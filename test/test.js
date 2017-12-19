var chai = require("chai");
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../app');
chai.use(chaiHttp);

describe('Inventions', function() {  
    it('should receive a list of inventions on GET /invention/list', done => {
        // chai.request(app.server)
        chai.request(server)
          .get('/api/invention/list')
          .end((err, res) => {
            res.should.have.status(200);
            done();
          });
      });
});