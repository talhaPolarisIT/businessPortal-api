const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const userGroup = sequelize.define(
    'userGroup',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        required: true,
      },
      code: {
        type: Sequelize.INTEGER,
        unique: true,
        required: true,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    },
    { tableName: 'userGroup' }
  );

  userGroup.associate = (models) => {
    userGroup.hasMany(models.user);
  };

  return userGroup;
};
