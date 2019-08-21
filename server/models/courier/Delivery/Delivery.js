module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'delivery',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      store_id: DataTypes.INTEGER,
      order_number: DataTypes.INTEGER, // "853291",
      status: DataTypes.STATUS, // "OPEN", "PICKING_UP", "PICK_UP_PROBLEM", "DELIVERING", "DELIVERING_PROBLEM", "DELIVERED", "CANCELED"
      courier_id: DataTypes.INTEGER, // id do usuário entregador
      created_at: DataTypes.DATE, // data de criação da entrega
      accepted_at: DataTypes.DATE, // data que a delivery foi aceita
      picked_up_at: DataTypes.DATE, // data que o produto foi pego
      delived_at: DataTypes.DATE, // data que o produto foi entregue

      //? Será que é demais ter essas merdas aqui ?
      pick_up_problem: DataTypes.STRING,
      pick_up_problem_description: DataTypes.STRING,
      pick_up_problem_at: DataTypes.DATE,
      delivery_problem_description: DataTypes.STRING,
      delivery_problem: DataTypes.STRING,
      delivery_problem_at: DataTypes.DATE,

      //? Acho que não vou precisar destes amiguinhos aqui caso eu não use nada
      store: DataTypes.STRING, // "Arco Íris",
      store_address: DataTypes.STRING, // "Av das Nações, 1916, Parque Oratório, Santo André - SP, 09270-400",
      telephone: DataTypes.STRING, // "1144011755",
      vehicle_type: DataTypes.STRING, // "motorcycle",
      client_id: DataTypes.STRING,
      destination: DataTypes.STRING,
    }, {
      timestamps: false,
      freezeTableName: true
    }
  )
}
