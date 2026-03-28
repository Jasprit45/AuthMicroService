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
    await queryInterface.changeColumn('Users' , 'provider' , {
      type : Sequelize.STRING,
      allowNull : false,
      defaultValue  : 'LOCAL'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('Users' , 'provider' , {
      type : Sequelize.ENUM('GOOGLE','LOCAL'),
      allowNull : false,
      defaultValue  : 'LOCAL'
    });

  }
};
