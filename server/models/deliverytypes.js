'use strict';
module.exports = function(sequelize, DataTypes) {
  var DeliveryTypes = sequelize.define('DeliveryTypes', {
    name: DataTypes.STRING
  });
  
  return DeliveryTypes;
};