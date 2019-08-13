module.exports = {
  getRoute,
  success,
  problem,
  getProblemReasons
}

function getRoute () {
  return Promise.resolve('getRoute')
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
