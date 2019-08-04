function getTermsHtml () {
  return Promise.resolve('getTermsHtml')
}

function create () {
  return Promise.resolve('create')
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


module.exports = {
  getTermsHtml,
  create,
  update,
  get,
  getBankCodes,
  getRegisterOptions,
  destroy
}
