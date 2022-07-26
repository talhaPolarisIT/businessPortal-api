'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'roleId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'roles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      defaultValue: null,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'roleId');
  }
};
