const registrarionController = require('./registration')
const authController = require('./auth')
const pickUpController = require('./pickUp')
const deliveryController = require('./delivery')
const reportController = require('./report')

module.exports = {
  registration: registrarionController,
  auth: authController,
  pickUp: pickUpController,
  delivery: deliveryController,
  report: reportController,
}
