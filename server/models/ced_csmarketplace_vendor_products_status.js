'use strict'

module.exports = function (sequelize, DataTypes) {
  var ced_csmarketplace_vendor_products_status = sequelize.define(
    'ced_csmarketplace_vendor_products_status',
    {
      vendor_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      status: DataTypes.STRING
    }, {
      timestamps: false,
      freezeTableName: true
    }
  )

  return ced_csmarketplace_vendor_products_status
}
