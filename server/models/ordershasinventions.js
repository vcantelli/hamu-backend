'use strict';
module.exports = function(sequelize, DataTypes) {
  var OrdersHasInventions = sequelize.define('OrdersHasInventions', {
    quantity: DataTypes.INTEGER,
    totalPrice: DataTypes.DOUBLE
  });
  
  OrdersHasInventions.associate = models => {

    OrdersHasInventions.belongsTo(models.Inventions);   
  }
  return OrdersHasInventions;
};