'use strict';
module.exports = function(sequelize, DataTypes) {
  var Costumes = sequelize.define('Costumes', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING
  });
  
  return Costumes;
};