'use strict';
module.exports = function(sequelize, DataTypes) {
  var ced_csmarketplace_vendor_payments = sequelize.define('ced_csmarketplace_vendor_payments', {
    vendor_id: DataTypes.INTEGER,
    transaction_id: DataTypes.STRING, 
    amount_desc: DataTypes.STRING,
    amount: DataTypes.DOUBLE, 
    base_amount: DataTypes.DOUBLE,
    currency: DataTypes.STRING,
    fee: DataTypes.DOUBLE,
    base_fee: DataTypes.DOUBLE, 
    net_amount: DataTypes.DOUBLE,
    base_net_amount: DataTypes.DOUBLE, 
    balance: DataTypes.DOUBLE,
    base_balance: DataTypes.DOUBLE,
    tax: DataTypes.DOUBLE,
    base_tax: DataTypes.DOUBLE, 
    notes: DataTypes.STRING,
    transaction_type: DataTypes.INTEGER, 
    payment_method: DataTypes.STRING,
    payment_code: DataTypes.STRING,
    payment_detail: DataTypes.STRING,
    status: DataTypes.STRING, 
    payment_date: DataTypes.DATE,
    created_at: DataTypes.DATE, 
    base_currency: DataTypes.STRING,
    base_to_global_rate: DataTypes.DOUBLE
  }, {
    timestamps: false, 
    freezeTableName: true
  });
  
  return ced_csmarketplace_vendor_payments;
};