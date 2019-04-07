'use strict'

module.exports = function (sequelize, DataTypes) {
  var ced_csmarketplace_vendor_form_attribute = sequelize.define(
    'ced_csmarketplace_vendor_form_attribute',
    {
      attribute_id: DataTypes.INTEGER,
      attribute_code: DataTypes.STRING,
      is_visible: DataTypes.BOOLEAN,
      sort_order: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      use_in_registration: DataTypes.INTEGER,
      position_in_registration: DataTypes.INTEGER,
      use_in_left_profile: DataTypes.INTEGER,
      position_in_left_profile: DataTypes.INTEGER,
      fontawesome_class_for_left_profile: DataTypes.STRING
    }, {
      timestamps: false,
      freezeTableName: true
    }
  )

  return ced_csmarketplace_vendor_form_attribute
}
