'use strict'

module.exports = function (sequelize, DataTypes) {
  var ced_csmarketplace_vendor_decimal = sequelize.define(
    'ced_csmarketplace_vendor_decimal',
    {
      value_id: DataTypes.INTEGER,
      entity_type_id: DataTypes.INTEGER,
      attribute_id: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      entity_id: DataTypes.INTEGER,
      value: DataTypes.DOUBLE
    }, {
      timestamps: false,
      freezeTableName: true
    }
  )

  return ced_csmarketplace_vendor_decimal
}
