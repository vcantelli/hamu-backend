function hasNewRequest () {
  return Promise.resolve('hasNewRequest')
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
