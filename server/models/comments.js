'use strict';
module.exports = function(sequelize, DataTypes) {
  var Comments = sequelize.define('Comments', {
    comment: DataTypes.STRING,
    like: DataTypes.BOOLEAN
  });
  
  Comments.associate = models => {
    Comments.belongsTo(models.Customers);
    
    Comments.belongsTo(models.Inventions);    
  }
  return Comments;
};