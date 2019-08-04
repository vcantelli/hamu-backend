function login () {
  return Promise.resolve('login')
}

function registerToken () {
  return Promise.resolve('registerToken')
}

module.exports = {
  login,
  registerToken
}
