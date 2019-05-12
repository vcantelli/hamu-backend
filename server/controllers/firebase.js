const admin = require('firebase-admin')
const serviceAccountBuffer = Buffer.from(
  process.env.SERVICE_ACCOUNT,
  'base64'
).toString('ascii')

var serviceAccountJSON
try {
  serviceAccountJSON = JSON.parse(serviceAccountBuffer)
} catch (error) {
  console.error(error.message)
  return {}
}

const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountJSON)
})

module.exports = firebase
