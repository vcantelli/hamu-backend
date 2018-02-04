'use strict';
module.exports = function(sequelize, DataTypes) {
  var ced_csmarketplace_vendor_payments_requested = sequelize.define('ced_csmarketplace_vendor_payments_requested', {
    vendor_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER, 
    amount: DataTypes.DOUBLE,
    status: DataTypes.STRING, 
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    timestamps: false, 
    freezeTableName: true
  });
  
  return ced_csmarketplace_vendor_payments_requested;
};