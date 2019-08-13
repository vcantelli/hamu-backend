const express = require('express')
const routes = express.Router()
const registrationRoutes = require('./registration')
const authRoutes = require('./auth')
const pickUpRoutes = require('./pickUp')
const deliveryRoutes = require('./delivery')
const reportRoutes = require('./report')


routes.use('/', registrationRoutes)
routes.use('/', authRoutes)
routes.use('/pick-up', pickUpRoutes)
routes.use('/delivery', deliveryRoutes)
routes.use('/report', reportRoutes)

module.exports = routes