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

function getPickupInfo () {
  return Promise.resolve('getPickupInfo')
}

function refuse () {
  return Promise.resolve('refuse')
}

function accept () {
  return Promise.resolve('accept')
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
