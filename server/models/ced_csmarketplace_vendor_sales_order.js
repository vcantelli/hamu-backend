'use strict';
module.exports = function(sequelize, DataTypes) {
  var ced_csmarketplace_vendor_sales_order = sequelize.define('ced_csmarketplace_vendor_sales_order', {
    vendor_id: DataTypes.INTEGER,
    order_id: DataTypes.STRING, 
    currency: DataTypes.STRING,
    base_order_total: DataTypes.DOUBLE, 
    order_total: DataTypes.DOUBLE,
    shop_commission_type_id: DataTypes.STRING,
    shop_commission_rate: DataTypes.DOUBLE,
    shop_commission_base_fee: DataTypes.DOUBLE, 
    shop_commission_fee: DataTypes.DOUBLE,
    product_qty: DataTypes.DOUBLE, 
    order_payment_state: DataTypes.STRING,
    payment_state: DataTypes.STRING,
    billing_country_code: DataTypes.STRING,
    shipping_country_code: DataTypes.STRING, 
    base_currency: DataTypes.STRING,
    base_to_global_rate: DataTypes.DOUBLE, 
    items_commission: DataTypes.STRING,
    shipping_amount: DataTypes.DOUBLE,
    base_shipping_amount: DataTypes.DOUBLE,
    shipping_paid: DataTypes.DOUBLE, 
    shipping_refunded: DataTypes.DOUBLE,
    method: DataTypes.STRING, 
    method_title: DataTypes.STRING,
    carrier: DataTypes.STRING,
    carrier_title: DataTypes.STRING, 
    code: DataTypes.STRING,
    shipping_description: DataTypes.STRING, 
    vorders_mode: DataTypes.INTEGER
  }, {
    timestamps: false, 
    freezeTableName: true
  });
  
  return ced_csmarketplace_vendor_sales_order;
};