module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'courier_pick_up_refusal',
    {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      courier_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      created_at: DataTypes.DATE,
    }, {
      timestamps: false,
      freezeTableName: true
    }
  )
}
