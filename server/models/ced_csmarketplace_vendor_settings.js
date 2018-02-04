'use strict';
module.exports = function(sequelize, DataTypes) {
  var ced_csmarketplace_vendor_settings = sequelize.define('ced_csmarketplace_vendor_settings', {
    setting_id: DataTypes.INTEGER,
    vendor_id: DataTypes.INTEGER, 
    group: DataTypes.STRING,
    key: DataTypes.STRING, 
    value: DataTypes.STRING,
    serialized: DataTypes.INTEGER
  }, {
    timestamps: false, 
    freezeTableName: true
  });
  
  return ced_csmarketplace_vendor_settings;
};