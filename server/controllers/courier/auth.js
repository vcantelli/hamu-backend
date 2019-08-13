function login (authInfo) {
  if (!(authInfo && authInfo.email && authInfo.password)) throw { message: `User and password are required`, status: 400 }
  const { email, password } = authInfo
  const courier = {}
  const token = `897009782540985342`
  return Promise.resolve({ courier, token })

  // magento.login().then(() => {
  //   return customerEntity.find({ where: { email } })
  // }).then(customer => {
  //   if (!customer) throw { message: `There is no user with this email`, status: 403 }
  //   return magento.customer.info({ customerId: customer.dataValues.entity_id })
  // }).then(customerInfo => {
  //   if (!checkPasswordHash(password, customerInfo.password_hash)) throw { message: `Wrong password`, status: 403 }
  //   return recoverMarketplaceCourier(customerInfo.customer_id, email)
  // }).then(courier => {
  //   const token = jwt.sign(courier, secret, config)
  //   return { courier, token }
  // }).catch(error => {
  //   if (error === 403) throw { message: `0`, status: 403 }
  //   throw {message: errorSanitizer(error), status: 400}
  // })
}

function registerToken () {
  return Promise.resolve('registerToken')
}

module.exports = {
  login,
  registerToken
}
