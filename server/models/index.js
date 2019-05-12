'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(module.filename)
const env = process.env.NODE_ENV || 'development'
const config = require('../config/db')[env]
var db = {}

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable])
  : new Sequelize(config.database, config.username, config.password, config)

fs.readdirSync(__dirname).filter(function (file) {
  return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
}).forEach(function (file) {
  const model = sequelize['import'](path.join(__dirname, file))
  const key = model.name.replace(/_(.{1})/g, match => match[1].toUpperCase())
  db[key] = model
})

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) db[modelName].associate(db)
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
