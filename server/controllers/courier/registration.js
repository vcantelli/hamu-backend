const codigoBancos = require('../../models/codigo_bancos')

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
  return validateData(creationData)
    .then(createAndSaveOnMagento)
    .then(filterForResponse)

  function createAndSaveOnMagento(creationData) {
    return Promise.resolve(creationData)
  }

  function validateData (creationData) {
    if (!creationData) throw {message: `Invalid data`, status: 400}
    return Promise.resolve(creationData)
  }

  function filterForResponse(creationData) {
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
  return getOnMagento(id)
    .then(filterForResponse)
  function filterForResponse (data) {
    return {
      email: 'eu@neryuuk.com',
      name: 'Nelson Antunes',
      date_of_birth: '1989-04-04',
      personal_document: '19189940059',
      personal_email: 'eu@neryuuk.com',
      telephone: '+5511976535350',
      driver_license_number: '20145027507',
      driver_license_expiry_date: '2020-05-05',
      preference_city: 'São Paulo',
      vehicle_type: 'motorcycle; car; van',
      vehicle_brand: 'Chevrolet',
      vehicle_model: 'Celta',
      vehicle_plate: 'LOL-1234',
      vehicle_model_year: '1990',
      vehicle_fabrication_year: '1990',
      vehicle_identification_number: '9BWZZZ377VT004251',
      vehicle_national_registration_number: '77956074780',
      vehicle_document: '7188170879',
      vehicle_last_licence_year: '2019',
      vehicle_ownership: 'OWNER',
      bank_holder_name: 'Nelson Antunes',
      bank_holder_document: 'meu cpfzin',
      bank_company_document: 'Nelson Antunes',
      bank_number: '341',
      bank_agency_number: '8884',
      bank_type_of_account: 'Corrente; Poupança',
      company_name: 'Batatais - EIRELI',
      company_cnpj: '37215080000102',
      images_user: [],
      images_vehicle: [],
      images_driver_license: []
    }
  }
}

function getBankCodes () {
  return Promise.resolve(codigoBancos)
}

function getRegisterOptions () {
  return Promise.resolve('getRegisterOptions')
}

function destroy (id) {
  return deleteOnMagento(id)
  function deleteOnMagento(id) {
    return Promise.resolve('DELETED')
  }
}
