const { courierUser } = require('../')
const CourierDAO = courierUser
const MagentoAPI = require('magento-api')
const moment = require('moment')
const magentoConfig = require('../../config/magento')
const { promisify } = require('util')
const Magento = new MagentoAPI(magentoConfig)
Magento.login = promisify(Magento.login).bind(Magento)
Magento.customer.create = promisify(Magento.customer.create).bind(Magento.customer)
Magento.customer.update = promisify(Magento.customer.update).bind(Magento.customer)

module.exports = {
  create,
  update,
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
    data = convertDatesToDatabase(data)
    return CourierDAO.create(data)
  })
}

function update (customer_id, data) {
  return Magento.login().then(() => {
    const customerData = {
      email: data.email,
      firstname: data.name.split(' ')[0],
      lastname: data.name.substr(data.name.indexOf(' ')).trim(),
      website_id: 1,
      store_id: 1,
      group_id: 1
    }
    if (data.password) customerData.password = data.password

    return Magento.customer.update({
      customerId: customer_id,
      customerData
    })
    .then(() => {
      data.images_user = '' // data.images_user || ''
      data.images_vehicle = '' // data.images_vehicle || ''
      data.images_driver_license = '' // data.images_driver_license || ''
      data = convertDatesToDatabase(data)
      return CourierDAO.update(data, {where: {customer_id}})
    })
  })
}

function getById (courier_id) {
  return CourierDAO.find({ where: { courier_id, status: 'ACTIVE'}})
    .then(data => data && data.dataValues && convertDatesToSystem(data.dataValues) )
}

function getByMagentoId (customer_id) {
  return CourierDAO.find({ where: { customer_id, status: 'ACTIVE'}})
    .then(data => data && data.dataValues && convertDatesToSystem(data.dataValues) )
}


function convertDatesToDatabase (data) {
  data.date_of_birth = moment(data.date_of_birth, 'DD/MM/YYYY').format('YYYY-MM-DD')
  data.driver_license_expiry_date = moment(data.driver_license_expiry_date, 'DD/MM/YYYY').format('YYYY-MM-DD')
  return data
}

function convertDatesToSystem (data) {
  data.date_of_birth = moment(data.date_of_birth).format('DD/MM/YYYY')
  data.driver_license_expiry_date = moment(data.driver_license_expiry_date).format('DD/MM/YYYY')
  return data
}
