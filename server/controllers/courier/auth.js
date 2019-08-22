
const MagentoAPI = require('magento-api')
const magentoConfig = require('../../config/magento')
const { promisify } = require('util')
const md5 = require('md5')
const Magento = new MagentoAPI(magentoConfig)
const CourierModel = require('../../models/courier/Courier')
const { secret, config } = require('../../config/jwt')
const {
  customerEntity
} = require('../../models')
const jwt = require('jsonwebtoken')


Magento.login = promisify(Magento.login).bind(Magento)
Magento.customer.info = promisify(Magento.customer.info).bind(Magento.customer)

module.exports = {
  login,
  registerToken
}

function login (authInfo) {
  if (!(authInfo && authInfo.email && authInfo.password)) throw { message: `User and password are required`, status: 400 }
  const { email, password } = authInfo

  return Magento.login().then(() => {
    return customerEntity.find({ where: { email } })
  }).then(customer => {
    if (!customer) throw { message: `There is no user with this email`, status: 403 }
    return Magento.customer.info({ customerId: customer.dataValues.entity_id })
  }).then(customerInfo => {
    if (!checkPasswordHash(password, customerInfo.password_hash)) throw { message: `Wrong password`, status: 403 }
    return CourierModel.getByMagentoId(customerInfo.customer_id)
  }).then(courier => {
    const token = jwt.sign(courier, secret, config)
    return { name: courier.name, token }
  }).catch(error => {
    if (error === 403) throw { message: `0`, status: 403 }
    throw {message: errorSanitizer(error), status: 400}
  })
}

function registerToken () {
  return Promise.resolve('registerToken')
}

function checkPasswordHash (password, stored) {
  const [hash, salt] = stored.split(':')
  return (hash === md5(salt + password))
}

function errorSanitizer (error) {
  return {
    name: error.name || error,
    message: error.message || error
  }
}
