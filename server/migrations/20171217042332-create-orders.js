'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      totalPrice: {
        type: Sequelize.DOUBLE
      },
      transactionId: {
        type: Sequelize.STRING
      },
      isLootBox: {
        type: Sequelize.BOOLEAN
      },
      StatusId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // onDelete: 'CASCADE',
        references: {
          model: 'Statuses',
          key: 'id',
          as: 'StatusId'
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
      DeliveryTypeId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // onDelete: 'CASCADE',
        references: {
          model: 'DeliveryTypes',
          key: 'id',
          as: 'DeliveryTypeId'
        }
      },
      CostumeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // onDelete: 'CASCADE',
        references: {
          model: 'Costumes',
          key: 'id',
          as: 'CostumeId'
        }
      },
      CustomerAddressId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        // onDelete: 'CASCADE',
        references: {
          model: 'CustomerAddresses',
          key: 'id',
          as: 'CustomerAddressId'
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
    return queryInterface.dropTable('Orders');
  }
};