module.exports = {
  vendors: { ...(require('./vendors')) },
  courier: { ...(require('./courier')) },
  firebase: require('./firebase'),
  auth: require('./auth')
}
