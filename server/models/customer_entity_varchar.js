'use strict'

module.exports = function (sequelize, DataTypes) {
  var customerEntityVarchar = sequelize.define(
    'customer_entity_varchar',
    {
      value_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      entity_type_id: DataTypes.INTEGER,
      attribute_id: DataTypes.INTEGER,
      entity_id: DataTypes.INTEGER,
      value: DataTypes.STRING
    }, {
      timestamps: false,
      freezeTableName: true
    }
  )

  return customerEntityVarchar
}
