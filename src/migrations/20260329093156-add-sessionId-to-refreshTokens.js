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
    await queryInterface.addColumn('Refresh_tokens' , 'sessionId' , {
      type : Sequelize.UUID,
      allowNull : false,
      unique:true
    });
    await queryInterface.addIndex('Refresh_tokens', ['sessionId'], {  //explicit adding sessionid as index for faster search in db
      name: 'idx_refresh_tokens_sessionId'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeIndex('Refresh_tokens', 'idx_refresh_tokens_sessionId');
    await queryInterface.removeColumn('Refresh_tokens', 'sessionId');
  }
};
