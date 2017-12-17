'use strict';
module.exports = function(sequelize, DataTypes) {
  var InventionsImages = sequelize.define('InventionsImages', {
    image: DataTypes.STRING
  });
  
  return InventionsImages;
};