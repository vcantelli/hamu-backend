function hasNewRequest (userId) {
  return Promise.resolve(searchDatabaseForNewRequest(userId))
    .then(filterData)

  function searchDatabaseForNewRequest (userId) {
    return Promise.resolve('FULL DATA')
  }

  function filterData (data) {
    return Promise.resolve({
      store: 'Arco Íris',
      store_address: 'Av das Nações, 1916, Parque Oratório, Santo André - SP, 09270-400',
      telephone: '1144011755',
      order_number: '853291',
      vehicle_type: 'motorcycle'
    })
  }
}

function getPickupInfo (orderNumber) {
  return getPickupInfoOnMagento(orderNumber)
    .then(filterData)

  function getPickupInfoOnMagento(orderNumber) {
    return Promise.resolve({orderNumber})
  }

  function filterData(data) {
    return Promise.resolve({
      store: 'Arco Íris',
      store_address: 'Av das Nações, 1916, Parque Oratório, Santo André - SP, 09270-400',
      telephone: '1144011755',
      order_number: data.orderNumber,
      vehicle_type: 'motorcycle'
    })
  }
}

function refuse (orderNumber, userId) {
  return saveRefusalOnDatabase(orderNumber, userId)
  .then(() => null)

  function saveRefusalOnDatabase (orderNumber, userId) {
    // Salvar no banco que o fulano de tal recusou o pedido no dia X horário Y
    // Vitão pensou em colocar um vetor no pedido com os caras que recusaram
    return Promise.resolve({
      orderNumber,
      userId,
      refusalTime: new Date()
    })
  }
}

function accept (orderNumber, userId) {
  return checkIfSomeoneElseAccepted(orderNumber)
    .then(() => changeOrderStatus(orderNumber, userId))
    .then(filterRenspose)

  function checkIfSomeoneElseAccepted (orderNumber) {
    const someoneAlreadyOnIt = false
    if (someoneAlreadyOnIt) throw { code: `SOMEONE_ELSE_HAS_ACCEPTED`, message: `Alguém já aceitou esta entrega`, status: 404}
    return Promise.resolve(orderNumber)
  }

  function changeOrderStatus (orderNumber, userId) {
    return Promise.resolve(orderNumber, userId)
  }

  function filterRenspose (data) {
    return Promise.resolve('ACCEPTED')
  }
}

function success () {
  return Promise.resolve('success')
}

function problem () {
  return Promise.resolve('problem')
}

function getProblemReasons () {
  return Promise.resolve('getProblemReasons')
}


module.exports = {
  hasNewRequest,
  getPickupInfo,
  refuse,
  accept,
  success,
  problem,
  getProblemReasons
}
