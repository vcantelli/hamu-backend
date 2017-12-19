'use strict';
module.exports = function(sequelize, DataTypes) {
  var Customers = sequelize.define('Customers', {
    name: DataTypes.STRING,
    cpf: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    googleId: DataTypes.STRING,
    facebookId: DataTypes.STRING,
    birthDate: DataTypes.STRING,
    sex: DataTypes.BOOLEAN,
    telephone: DataTypes.STRING,
  });
  
  Customers.associate = models => {
    
    Customers.hasMany(models.CustomerAddresses, {
        as: 'CustomerAddresses'
    });    

    Customers.hasMany(models.Orders, {
        as: 'Orders'
    });    
    
    Customers.hasMany(models.CustomerCarts, {
        as: 'CustomerCarts'
    });    
  }
  return Customers;
};