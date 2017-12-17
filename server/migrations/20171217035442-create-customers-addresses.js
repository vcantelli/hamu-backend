'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('CustomerAddresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      streetAddress: {
        type: Sequelize.STRING
      },
      addressNumber: {
        type: Sequelize.STRING
      },
      neighbourhood: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      zipCode: {
        type: Sequelize.STRING
      },
      complement: {
        type: Sequelize.STRING
      },
      reference: {
        type: Sequelize.STRING
      },
      paymentDefault: {
        type: Sequelize.BOOLEAN
      },
      addressDefault: {
        type: Sequelize.BOOLEAN
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
    return queryInterface.dropTable('CustomerAddresses');
  }
};