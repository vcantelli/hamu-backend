'use strict'

module.exports = function (sequelize, DataTypes) {
  var cedCsmarketplaceVendorDatetime = sequelize.define(
    'ced_csmarketplace_vendor_datetime',
    {
      value_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      entity_type_id: DataTypes.INTEGER,
      attribute_id: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      entity_id: DataTypes.INTEGER,
      value: DataTypes.DATE
    }, {
      timestamps: false,
      freezeTableName: true
    }
  )

  return cedCsmarketplaceVendorDatetime
}
