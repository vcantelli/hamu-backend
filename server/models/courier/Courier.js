const { courierUser } = require('../')
const CourierDAO = courierUser
const MagentoAPI = require('magento-api')
const magentoConfig = require('../../config/magento')
const { promisify } = require('util')
const Magento = new MagentoAPI(magentoConfig)
Magento.login = promisify(Magento.login).bind(Magento)
Magento.customer.create = promisify(Magento.customer.create).bind(Magento.customer)

module.exports = {
  create,
  getById,
  getByMagentoId
}

function create (data) {
  return Magento.login().then(() => {
    return Magento.customer.create({
      customerData: {
        email: data.email,
        firstname: data.name.split(' ')[0],
        lastname: data.name.substr(data.name.indexOf(' ')).trim(),
        password: data.password,
        website_id: 1,
        store_id: 1,
        group_id: 1
      }
    })
  }).then(customerId => {
    data.customer_id = Number(customerId)
    data.images_user = '' // data.images_user || ''
    data.images_vehicle = '' // data.images_vehicle || ''
    data.images_driver_license = '' // data.images_driver_license || ''
    return CourierDAO.create(data)
  })
}

function getById (courier_id) {
  return CourierDAO.find({ where: { courier_id: courier_id, status: 'ACTIVE'}})
}

function getByMagentoId (customer_id) {
  return CourierDAO.find({ where: { customer_id: customer_id, status: 'ACTIVE'}})
}
