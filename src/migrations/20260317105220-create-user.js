'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull:false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull:false,
        validate: {
          isEmail: true,
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull:true,
        validate: {
          len: [6,100]
        }
      },
      role: {
        type: Sequelize.ENUM('ADMIN','MANAGER','USER'),
        allowNull: false,
        defaultValue : 'USER'
      },
      googleId: {
        type : Sequelize.STRING,
        allowNull : true,
        unique:true
      },
      provider : {
        type : Sequelize.ENUM('GOOGLE','LOCAL'),
        allowNull : false,
        defaultValue  : 'LOCAL'
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
    await queryInterface.dropTable('Users');
  }
};