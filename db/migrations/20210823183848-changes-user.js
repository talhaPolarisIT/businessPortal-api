'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'mobile', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('users', 'recoveryEmail', {
      type: Sequelize.STRING,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'mobile');
    await queryInterface.removeColumn('users', 'recoveryEmail');
  }
};
