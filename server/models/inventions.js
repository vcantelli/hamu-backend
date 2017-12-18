'use strict';
module.exports = function(sequelize, DataTypes) {
  var Inventions = sequelize.define('Inventions', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DOUBLE,
    discountPrice: DataTypes.DOUBLE
  });
  
  Inventions.associate = models => {
    Inventions.hasMany(models.InventionImages, {
        as: 'InventionImages'
    });    
    
    Inventions.belongsTo(models.Categories, {
      foreignKey: 'CategoryId',
      as: 'Categories'
  });
  }

  return Inventions;
};