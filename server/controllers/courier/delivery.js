
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


module.exports = {
  getRoute,
  success,
  problem,
  getProblemReasons
}
