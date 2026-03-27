'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Users' , 'googleId' , {
      type : Sequelize.STRING,
      allowNull : true,
      unique:true
    });
    await queryInterface.addColumn('Users' , 'provider' , {
      type : Sequelize.ENUM('GOOGLE','LOCAL'),
      allowNull : false,
      defaultValue  : 'LOCAL'
    });
    await queryInterface.changeColumn('Users', 'password', {
      type : Sequelize.STRING,
      allowNull : true,
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Users', 'googleId');

    await queryInterface.removeColumn('Users', 'provider');
    await queryInterface.changeColumn('Users', 'password', {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
