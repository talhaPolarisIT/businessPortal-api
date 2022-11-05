const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    entityName: {
      type: Sequelize.STRING,
    },
    fields: {
      type: Sequelize.INTEGER,
    },
  });

  return User;
};
