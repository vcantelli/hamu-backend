'use strict';
module.exports = function(sequelize, DataTypes) {
  var Orders = sequelize.define('Orders', {
    totalPrice: DataTypes.DOUBLE,    
    transactionId: DataTypes.STRING
  });
  
  Orders.associate = models => {
    Orders.belongsTo(models.Statuses);
    
    Orders.belongsTo(models.DeliveryType);
    
    Orders.belongsTo(models.CustomerAddresses);
    
    Orders.belongsTo(models.Costumes);
    
    Customers.hasMany(models.OrdersHasInventions, {
        as: 'OrdersHasInventions'
    });    
    
  }
  return Orders;
};