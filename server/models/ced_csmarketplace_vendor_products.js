'use strict'

module.exports = function (sequelize, DataTypes) {
  var cedCsmarketplaceVendorProducts = sequelize.define(
    'ced_csmarketplace_vendor_products',
    {
      vendor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
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
    }
  )

  return cedCsmarketplaceVendorProducts
}
