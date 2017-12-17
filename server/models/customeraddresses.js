'use strict';
module.exports = function(sequelize, DataTypes) {
  var CustomerAddresses = sequelize.define('CustomerAddresses', {
    streetAddress: DataTypes.STRING,
    addressNumber: DataTypes.STRING,
    neighbourhood: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zipCode: DataTypes.STRING,
    complement: DataTypes.STRING,
    reference: DataTypes.STRING,
    paymentDefault: DataTypes.BOOLEAN,
    addressDefault: DataTypes.BOOLEAN,
  });
  
  return CustomerAddresses;
};