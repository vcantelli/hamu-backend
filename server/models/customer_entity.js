'use strict'
module.exports = function (sequelize, DataTypes) {
  var customerEntity = sequelize.define('customer_entity', {
    entity_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    entity_type_id: DataTypes.INTEGER,
    attribute_set_id: DataTypes.INTEGER,
    website_id: DataTypes.INTEGER,
    email: DataTypes.STRING,
    group_id: DataTypes.INTEGER,
    increment_id: DataTypes.STRING,
    store_id: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    is_active: DataTypes.INTEGER,
    disable_auto_group_change: DataTypes.INTEGER
  }, {
    timestamps: false,
    freezeTableName: true
  })

  return customerEntity
}
