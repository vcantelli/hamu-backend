const PickUpModel = require('../../models/courier/PickUp')
const DeliveryModel = require('../../models/courier/Delivery')
const NOTHING = {}

module.exports = {
  hasNewRequest,
  getPickupInfo,
  refuse,
  accept,
  success,
  problem,
  getProblemReasons
}

function hasNewRequest (userId) {
  return Promise.resolve(checkIfUserAlreadyIsOnADelivery(userId))
    .then(() => searchDatabaseForNewRequest(userId))
    .then(filterData)

  async function checkIfUserAlreadyIsOnADelivery (userId) {
    const userAlreadyIsOnADelivery = await PickUpModel.userAlreadyIsOnADelivery(userId)
    if (userAlreadyIsOnADelivery) throw { status: 400, message: 'Você não pode aceitar pois já está em outra entrega', code: 'USER_ALREADY_ON_DELIVERING' }
    return userId
  }

  function searchDatabaseForNewRequest (userId) {
    return PickUpModel.openRequests(userId)
      .then(data => data && data.length && data[0])
  }

  function filterData (data) {
    return Promise.resolve({
      store: data && data.store, // 'Arco Íris',
      store_address: data && data.store_address, // 'Av das Nações, 1916, Parque Oratório, Santo André - SP, 09270-400',
      telephone: data && data.telephone, // '1144011755',
      order_number: data && data.order_number, // '853291',
      vehicle_type: data && data.vehicle_type, // 'motorcycle'
    })
  }
}

function getPickupInfo (orderNumber) {
  // ?: Não sei se rola buscar no modelo de fornecedor os fornecedores do pedido, na tabela de pedido as infos de entrega e na tabela de delivery as infos do amigo
  return PickUpModel.getPickupInfo(orderNumber)
    .then(filterData)

  function filterData(data) {
    if (!data) throw { status: 404, message: 'Dados para entrega não encontrado para este pedido', code: 'PICKUP_DATA_NOT_FOUND' }
    return Promise.resolve(data)
  }
}

function refuse (orderNumber, userId) {
  return PickUpModel.refusePickUp(orderNumber, userId)
    .then(() => NOTHING)
}

function accept (orderNumber, userId) {
  return checkIfSomeoneElseAccepted(orderNumber, userId)
    .then(() => PickUpModel.acceptRequest(orderNumber, userId))
    .then(filterRenspose)

  async function checkIfSomeoneElseAccepted (orderNumber, userId) {
    const deliveryRequest = await DeliveryModel.getDeliveryInfoByOrderNumber(orderNumber)
    if (!deliveryRequest) throw { code: `PICKUP_DATA_NOT_FOUND`, message: `Não encontramos os dados para entrega deste pedido`, status: 404 }

    const someoneAlreadyOnIt = DeliveryModel.someoneElseAccepted(deliveryRequest, userId)
    if (someoneAlreadyOnIt) throw { code: `SOMEONE_ELSE_HAS_ACCEPTED`, message: `Alguém já aceitou esta entrega`, status: 404}
    return Promise.resolve(orderNumber)
  }

  function filterRenspose () {
    return Promise.resolve('ACCEPTED')
  }
}

function success (orderNumber) {
  return PickUpModel.success(orderNumber)
    .then(() => NOTHING)
}

function problem (orderNumber, orderProblem) {
  return validateData(orderProblem)
    .then(() => PickUpModel.saveProblem(orderProblem.reason, orderProblem.description, orderNumber))
    .then(() => NOTHING)

  function validateData (orderProblem) {
    if (!orderProblem.reason || !orderProblem.description)
      throw {error: 400, message: `Você precisa informar o motivo e uma descrição`, code: `MISSING_DATA`}
    return Promise.resolve(orderProblem)
  }
}

function getProblemReasons () {
  return Promise.resolve([
    { code: 'ADDRESS_NOT_FOUND', description: 'Não encontro o endereço'},
    { code: 'NOT_READY', description: 'Ninguém para receber a entrega'}
  ])
}
