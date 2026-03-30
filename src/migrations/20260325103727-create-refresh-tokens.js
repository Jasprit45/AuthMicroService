'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Refresh_tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model: 'users',   // users table
          key: 'id'
        },
        onDelete: 'CASCADE'

      },
      token: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull:false
      },
      sessionId: {
        type : DataTypes.UUID,
        allowNull : false,
        unique:true
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Refresh_tokens');
  }
};