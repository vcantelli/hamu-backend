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
    Inventions.belongsTo(models.InventionImages);
    
    Inventions.belongsTo(models.Categories);
  }

  return Inventions;
};