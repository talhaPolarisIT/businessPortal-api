'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'companyId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      defaultValue: null,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'companyId');
  }
};
