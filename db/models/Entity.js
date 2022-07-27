const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Entity = sequelize.define('entities', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    fields: {
      type: Sequelize.RANGE(Sequelize.JSONB),
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
    }
  },
  {
    tableName: 'entities',
  });

  Entity.associate = (models) => {
    Entity.belongsTo(models.company, { foreignKey: 'companyId' });
    Entity.belongsTo(models.user, { foreignKey: 'createdBy' });
  };

  return Entity;
};
