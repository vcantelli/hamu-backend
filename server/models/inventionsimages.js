'use strict';
module.exports = function(sequelize, DataTypes) {
  var InventionImages = sequelize.define('InventionImages', {
    image: DataTypes.STRING
  });
  
  return InventionImages;
};