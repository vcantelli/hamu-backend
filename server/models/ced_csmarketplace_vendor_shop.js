'use strict'

module.exports = function (sequelize, DataTypes) {
  var ced_csmarketplace_vendor_shop = sequelize.define(
    'ced_csmarketplace_vendor_shop',
    {
      vendor_id: DataTypes.INTEGER,
      shop_disable: DataTypes.INTEGER
    }, {
      timestamps: false,
      freezeTableName: true
    }
  )

  return ced_csmarketplace_vendor_shop
}
