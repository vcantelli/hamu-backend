'use strict';
module.exports = function(sequelize, DataTypes) {
  var Ratings = sequelize.define('Ratings', {
    rate: DataTypes.INTEGER,
  });
  
  Ratings.associate = models => {
    Ratings.belongsTo(models.Customers);
    
    Ratings.belongsTo(models.Inventions);    
  }
  return Ratings;
};