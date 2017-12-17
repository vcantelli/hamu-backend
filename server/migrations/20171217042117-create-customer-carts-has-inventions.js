'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('CustomerCartsHasInventions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      CustomerCartId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // onDelete: 'CASCADE',
        references: {
          model: 'CustomerCarts',
          key: 'id',
          as: 'CustomerCartId'
        }
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
    return queryInterface.dropTable('CustomerCartsHasInventions');
  }
};