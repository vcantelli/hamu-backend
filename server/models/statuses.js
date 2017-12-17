'use strict';
module.exports = function(sequelize, DataTypes) {
  var Statuses = sequelize.define('Statuses', {
    name: DataTypes.STRING
  });
  
  return Statuses;
};