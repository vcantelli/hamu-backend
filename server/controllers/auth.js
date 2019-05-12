const jwt = require('jsonwebtoken')
const { secret } = require('../config/jwt')

module.exports = authenticator

function authenticator (request, response, next) {
  const token = request.headers['x-access-token']
  if (!token) return response.status(403).send({ success: false, message: 'No token provided.' })

  jwt.verify(token, secret, (error, decoded) => {
    if (error) return response.status(403).json({ success: false, message: 'Token is not valid' })

    request.decoded = decoded
    next()
  })
}
