'use strict'

module.exports = function (sequelize, DataTypes) {
  var salesFlatOrderItem = sequelize.define(
    'sales_flat_order_item',
    {
      item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      order_id: DataTypes.INTEGER,
      parent_item_id: DataTypes.INTEGER,
      quote_item_id: DataTypes.INTEGER,
      store_id: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      product_id: DataTypes.INTEGER,
      product_type: DataTypes.STRING,
      product_options: DataTypes.STRING,
      weight: DataTypes.STRING,
      is_virtual: DataTypes.INTEGER,
      sku: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      applied_rule_ids: DataTypes.STRING,
      additional_data: DataTypes.STRING,
      free_shipping: DataTypes.INTEGER,
      is_qty_decimal: DataTypes.INTEGER,
      no_discount: DataTypes.INTEGER,
      qty_backordered: DataTypes.DOUBLE,
      qty_canceled: DataTypes.DOUBLE,
      qty_invoiced: DataTypes.DOUBLE,
      qty_ordered: DataTypes.DOUBLE,
      qty_refunded: DataTypes.DOUBLE,
      qty_shipped: DataTypes.DOUBLE,
      base_cost: DataTypes.DOUBLE,
      price: DataTypes.DOUBLE,
      base_price: DataTypes.DOUBLE,
      original_price: DataTypes.DOUBLE,
      base_original_price: DataTypes.DOUBLE,
      tax_percent: DataTypes.DOUBLE,
      tax_amount: DataTypes.DOUBLE,
      base_tax_amount: DataTypes.DOUBLE,
      tax_invoiced: DataTypes.DOUBLE,
      base_tax_invoiced: DataTypes.DOUBLE,
      discount_percent: DataTypes.DOUBLE,
      discount_amount: DataTypes.DOUBLE,
      base_discount_amount: DataTypes.DOUBLE,
      discount_invoiced: DataTypes.DOUBLE,
      base_discount_invoiced: DataTypes.DOUBLE,
      amount_refunded: DataTypes.DOUBLE,
      base_amount_refunded: DataTypes.DOUBLE,
      row_total: DataTypes.DOUBLE,
      base_row_total: DataTypes.DOUBLE,
      row_invoiced: DataTypes.DOUBLE,
      base_row_invoiced: DataTypes.DOUBLE,
      row_weight: DataTypes.DOUBLE,
      base_tax_before_discount: DataTypes.DOUBLE,
      tax_before_discount: DataTypes.DOUBLE,
      ext_order_item_id: DataTypes.STRING,
      locked_do_invoice: DataTypes.INTEGER,
      locked_do_ship: DataTypes.INTEGER,
      price_incl_tax: DataTypes.DOUBLE,
      base_price_incl_tax: DataTypes.DOUBLE,
      row_total_incl_tax: DataTypes.DOUBLE,
      base_row_total_incl_tax: DataTypes.DOUBLE,
      hidden_tax_amount: DataTypes.DOUBLE,
      base_hidden_tax_amount: DataTypes.DOUBLE,
      hidden_tax_invoiced: DataTypes.DOUBLE,
      base_hidden_tax_invoiced: DataTypes.DOUBLE,
      hidden_tax_refunded: DataTypes.DOUBLE,
      base_hidden_tax_refunded: DataTypes.DOUBLE,
      is_nominal: DataTypes.INTEGER,
      tax_canceled: DataTypes.DOUBLE,
      hidden_tax_canceled: DataTypes.DOUBLE,
      tax_refunded: DataTypes.DOUBLE,
      base_tax_refunded: DataTypes.DOUBLE,
      discount_refunded: DataTypes.DOUBLE,
      base_discount_refunded: DataTypes.DOUBLE,
      gift_message_id: DataTypes.INTEGER,
      gift_message_available: DataTypes.INTEGER,
      base_weee_tax_applied_amount: DataTypes.DOUBLE,
      base_weee_tax_applied_row_amnt: DataTypes.DOUBLE,
      weee_tax_applied_amount: DataTypes.DOUBLE,
      weee_tax_applied_row_amount: DataTypes.DOUBLE,
      weee_tax_applied: DataTypes.STRING,
      weee_tax_disposition: DataTypes.DOUBLE,
      weee_tax_row_disposition: DataTypes.DOUBLE,
      base_weee_tax_disposition: DataTypes.DOUBLE,
      base_weee_tax_row_disposition: DataTypes.DOUBLE,
      vendor_id: DataTypes.INTEGER
    }, {
      timestamps: false,
      freezeTableName: true
    }
  )

  return salesFlatOrderItem
}