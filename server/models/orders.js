'use strict';
module.exports = function(sequelize, DataTypes) {
  var Orders = sequelize.define('Orders', {
    totalPrice: DataTypes.DOUBLE,    
    transactionId: DataTypes.STRING
  });
  
  Orders.associate = models => {
    Orders.belongsTo(models.Statuses);
    
    Orders.belongsTo(models.DeliveryTypes);
    
    Orders.belongsTo(models.CustomerAddresses);
    
    Orders.belongsTo(models.Costumes);
    
    Orders.hasMany(models.OrdersHasInventions, {
        as: 'OrdersHasInventions'
    });    
    
  }
  return Orders;
};