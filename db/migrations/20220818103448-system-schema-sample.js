'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createSchema('sys_test')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropSchema('sys_test')
  }
};
