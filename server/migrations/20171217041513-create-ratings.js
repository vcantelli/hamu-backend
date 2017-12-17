'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Ratings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rate: {
        type: Sequelize.INTEGER
      },
      InventionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // onDelete: 'CASCADE',
        references: {
          model: 'Inventions',
          key: 'id',
          as: 'InventionId'
        }
      },
      CustomerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // onDelete: 'CASCADE',
        references: {
          model: 'Customers',
          key: 'id',
          as: 'CustomerId'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Ratings');
  }
};