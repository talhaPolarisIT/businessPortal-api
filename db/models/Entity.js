const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Entity = sequelize.define(
    'entities',
    {
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
      entityPermissionsView: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      entityPermissionsNone: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      entityPermissionsAdd: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
      },
      entityPermissionsEdit: {
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
      hasSubEntity: {
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
    },
    {
      tableName: 'entities',
    }
  );

  Entity.associate = (models) => {
    Entity.belongsTo(models.user, { foreignKey: 'createdBy' });
  };

  return Entity;
};
