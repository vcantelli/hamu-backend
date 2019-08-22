const MagentoAPI = require('magento-api')
const magentoConfiguration = require('../../../config/magento')
const Magento = new MagentoAPI(magentoConfiguration)
const MagentoAttributes = require('./attributes')
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
    .then(filterForResponse)

  async function createAndSaveOnMagento (creationData) {
    return CourierModel.create(creationData)
  }

  function validateData (creationData) {
    if (!creationData) throw { message: `Invalid data`, status: 400 }
    return Promise.resolve(creationData)
  }

  function filterForResponse (creationData) {
    return Promise.resolve({
      courier: {
        id: 68,
        customerId: `137`,
        name: `Nelson Antunes`,
        email: `eu@neryuuk.com`,
        phone: `+5511976535350`,
        cnpj: `37215080000102`,
        companyName: `Batatais - EIRELI`,
        fantasyName: `Batatais`,
        companyAddress: `Rua Heitor Penteado 1739, Apto 23 - Sumarezinho`,
        companyCategory: `2`
      },
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjgsImN1c3RvbWVySWQiOiIxMzciLCJuYW1lIjoiTmVsc29uIEFudHVuZXMiLCJlbWFpbCI6ImV1QG5lcnl1dWsuY29tIiwicGhvbmUiOiIrNTUxMTk3NjUzNTM1MCIsImNucGoiOiIzNzIxNTA4MDAwMDEwMiIsImNvbXBhbnlOYW1lIjoiQmF0YXRhaXMgLSBFSVJFTEkiLCJmYW50YXN5TmFtZSI6IkJhdGF0YWlzIiwiY29tcGFueUFkZHJlc3MiOiJSdWEgSGVpdG9yIFBlbnRlYWRvIDE3MzksIEFwdG8gMjMgLSBTdW1hcmV6aW5obyIsImNvbXBhbnlDYXRlZ29yeSI6IjIiLCJpYXQiOjE1NTc4MDUzMzksImV4cCI6MTU4OTM2MjkzOX0._uU-vnXsYIDgThz5Gzb_7TP_dj3Aa57Ko7R4UHOd0Lk`
    })
  }
}

function update (id, updateData) {
  return validateData(updateData)
    .then(updateOnMagento)
    .then(() => get(id))
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
