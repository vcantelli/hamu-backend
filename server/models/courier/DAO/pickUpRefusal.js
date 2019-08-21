module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'pick_up_refusal',
    {
      delivery_id: {
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
