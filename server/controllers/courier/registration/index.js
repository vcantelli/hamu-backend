const AuthController = require('../auth')
const codigoBancos = require('../../../models/codigo_bancos')
const CourierModel = require('../../../models/courier/Courier')

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
  return Promise.resolve({ terms: require('../../../config/terms') })
}

function create (creationData) {
  return validateData(creationData)
    .then(createAndSaveOnMagento)
    .then(() => AuthController.login({ email: creationData.email, password: creationData.password }))

  async function createAndSaveOnMagento (creationData) {
    return CourierModel.create(creationData)
  }

  function validateData (creationData) {
    if (!creationData) throw { message: `Invalid data`, status: 400 }
    return Promise.resolve(creationData)
  }
}

function update (magentoId, updateData) {
  return validateData(updateData)
    .then(() => CourierModel.update(magentoId, updateData))
    .then(() => AuthController.login({email: updateData.email, password: updateData.password}))
  function validateData (updateData) {
    if (!updateData) throw { message: `Invalid data`, status: 400 }
    return Promise.resolve(updateData)
  }
}

function get (id) {
  return CourierModel.getById(id)
    .then(filterForResponse)
  function filterForResponse (data) {
    if (!data) throw {status: 404, message: `User not found`}
    return data
  }
}

function getBankCodes () {
  return Promise.resolve(codigoBancos)
}

function getRegisterOptions () {
  return Promise.resolve({
    cities: ['São Paulo',
      'Guarulhos',
      'Campinas',
      'São Bernardo do Campo',
      'Santo André',
      'São José dos Campos',
      'Osasco',
      'Ribeirão Preto',
      'Sorocaba',
      '200 001 a 500 000',
      'Mauá',
      'São José do Rio Preto',
      'Mogi das Cruzes',
      'Santos',
      'Diadema',
      'Jundiaí',
      'Piracicaba',
      'Carapicuíba',
      'Bauru',
      'Itaquaquecetuba',
      'São Vicente',
      'Franca',
      'Praia Grande',
      'Guarujá',
      'Taubaté',
      'Limeira',
      'Suzano',
      'Taboão da Serra',
      'Sumaré',
      'Barueri'],
    brands: ['Honda',
      'Yamaha',
      'Suzuki',
      'Dafra',
      'Shineray',
      'Kawasaki',
      'Kasinski'],
    models: ['Honda Shadow 750',
      'Suzuki Gladius 650',
      'Yamaha R1M',
      'Big Bear Sled Chooper',
      'Honda PCX 150',
      'BMW R1200',
      'Motard 250 cc da Sundown',
      'Husqvarna TE 449'],
    banks: codigoBancos
  })
}

function destroy (id) {
  return deleteOnMagento(id)
  function deleteOnMagento(id) {
    return Promise.resolve('DELETED')
  }
}
