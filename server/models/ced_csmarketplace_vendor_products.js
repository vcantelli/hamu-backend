'use strict';
module.exports = function(sequelize, DataTypes) {
  var ced_csmarketplace_vendor_products = sequelize.define('ced_csmarketplace_vendor_products', {
    vendor_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER, 
    type: DataTypes.STRING,
    price: DataTypes.DOUBLE, 
    special_price: DataTypes.DOUBLE,
    name: DataTypes.STRING, 
    description: DataTypes.STRING,
    short_description: DataTypes.STRING, 
    sku: DataTypes.STRING,
    weight: DataTypes.DOUBLE, 
    check_status: DataTypes.BOOLEAN,    
    qty: DataTypes.INTEGER, 
    is_in_stock: DataTypes.BOOLEAN, 
    website_ids: DataTypes.STRING, 
    is_multiseller: DataTypes.INTEGER, 
    parent_id: DataTypes.INTEGER
  }, {
    timestamps: false, 
    freezeTableName: true
  });
  
  return ced_csmarketplace_vendor_products;
};