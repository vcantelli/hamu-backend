module.exports = {
  getTermsHtml,
  create,
  update,
  get,
  getBankCodes,
  getRegisterOptions,
  destroy
}

function getTermsHtml () {
  return Promise.resolve({terms: require('../../config/terms')})
}

function create (creationData) {
  validateData(creationData)
  return Promise.resolve('create')

  function validateData (creationData) {
    if (!creationData) throw {message: `Invalid data`}
  }
}

function update () {
  return Promise.resolve('update')
}

function get () {
  return Promise.resolve('get')
}

function getBankCodes () {
  return Promise.resolve('getBankCodes')
}

function getRegisterOptions () {
  return Promise.resolve('getRegisterOptions')
}

function destroy () {
  return Promise.resolve('destroy')
}
