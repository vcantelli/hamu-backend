'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('OrdersHasInventions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantity: {
        type: Sequelize.INTEGER
      },
      totalPrice: {
        type: Sequelize.DOUBLE
      },
      OrderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // onDelete: 'CASCADE',
        references: {
          model: 'Orders',
          key: 'id',
          as: 'OrderId'
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
    return queryInterface.dropTable('OrdersHasInventions');
  }
};