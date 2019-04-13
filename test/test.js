const chai = require("chai")
const chaiHttp = require('chai-http')
const server = require('../app')
chai.should()
chai.use(chaiHttp)

describe('Vendors', function () {
  this.timeout(4000)
  it('should receive a list of vendors on GET /vendors/list', done => {
    // chai.request(app.server)
    chai.request(server).get(
      '/api/vendors/list'
    ).end((_erro, resposta) => {
      resposta.should.have.status(200)
      done()
    })
  })
})
