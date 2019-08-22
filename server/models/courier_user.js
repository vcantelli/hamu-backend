module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'courier_user',
    {
      courier_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      customer_id: DataTypes.INTEGER,
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      date_of_birth: DataTypes.STRING,
      personal_document: DataTypes.STRING,
      personal_email: DataTypes.STRING,
      telephone: DataTypes.STRING,
      driver_license_number: DataTypes.STRING,
      driver_license_expiry_date: DataTypes.DATE,
      preference_city: DataTypes.STRING,
      vehicle_type: DataTypes.STRING,
      vehicle_brand: DataTypes.STRING,
      vehicle_model: DataTypes.STRING,
      vehicle_plate: DataTypes.STRING,
      vehicle_model_year: DataTypes.STRING,
      vehicle_fabrication_year: DataTypes.STRING,
      vehicle_identification_number: DataTypes.STRING,
      vehicle_national_registration_number: DataTypes.STRING,
      vehicle_document: DataTypes.STRING,
      vehicle_last_licence_year: DataTypes.STRING,
      vehicle_ownership: DataTypes.STRING,
      bank_holder_name: DataTypes.STRING,
      bank_holder_document: DataTypes.STRING,
      bank_company_document: DataTypes.STRING,
      bank_number: DataTypes.STRING,
      bank_agency_number: DataTypes.STRING,
      bank_type_of_account: DataTypes.STRING,
      company_name: DataTypes.STRING,
      company_cnpj: DataTypes.STRING,
      images_user: DataTypes.STRING,
      images_vehicle: DataTypes.STRING,
      images_driver_license: DataTypes.STRING,
      status: DataTypes.STRING
    }, {
      timestamps: false,
      freezeTableName: true
    }
  )
}
