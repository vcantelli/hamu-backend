'use strict';
module.exports = function(sequelize, DataTypes) {
  var CustomerCartsHasInventions = sequelize.define('CustomerCartsHasInventions', {
    quantity: DataTypes.INTEGER
  });
  
  CustomerCartsHasInventions.associate = models => {

    CustomerCartsHasInventions.belongsTo(models.Inventions);   
  }
  return CustomerCartsHasInventions;
};