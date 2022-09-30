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
      databaseName: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      fields: {
        type: Sequelize.JSON,
      },
      entityPermissionsRead: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      entityPermissionsNone: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      entityPermissionsCreate: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      entityPermissionsDelete: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      recordLevelPermission: {
        type: Sequelize.JSONB,
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
      isDeleted: {
        type: Sequelize.BOOLEAN,
        default: false,
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
