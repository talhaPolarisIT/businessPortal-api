'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('entities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      fields: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
      },
      hasSubEntity: {
        type: Sequelize.BOOLEAN,
      },
      isDisplayonMenu: {
        type: Sequelize.BOOLEAN,
      },
      isPublish: {
        type: Sequelize.BOOLEAN,
      },
      subEntityId: {
        type: Sequelize.INTEGER,
      },
      superEntityId: {
        type: Sequelize.INTEGER,
      },
      isSubEntity: {
        type: Sequelize.BOOLEAN,
      },
      isLinkedEntity: {
        type: Sequelize.BOOLEAN,
      },
      linkedEntity: {
        type: Sequelize.JSONB,
      },
      createdBy: {
        type: Sequelize.INTEGER,
      },
      companyId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('entities');
  },
};
