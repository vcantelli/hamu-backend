const chai = require("chai")
const chaiHttp = require('chai-http')
const server = require('../server')
chai.should()
chai.use(chaiHttp)

describe('Vendors', function () {
  this.timeout(15000)

  it('should receive a list of products from a vendor GET /vendors/list', done => {
    chai.request(server).get('/api/vendors/list?vendorId=47').end((_error, response) => {
      response.should.have.status(200)
      done()
    })
  })

  it('should receive a specific product GET /vendors/getProduct', done => {
    chai.request(server).get('/api/vendors/getProduct?productId=400').end((_error, response) => {
      response.should.have.status(200)
      done()
    })
  })

  it('should check if the password is valid GET /vendors/checkPassword', done => {
    chai.request(server).get('/api/vendors/checkPassword?email=neryuuk@neryuuk.com&password=batata').end((_error, response) => {
      response.should.have.status(200)
      done()
    })
  })
})
