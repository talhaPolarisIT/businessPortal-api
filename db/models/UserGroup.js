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

  return userGroup;
};
