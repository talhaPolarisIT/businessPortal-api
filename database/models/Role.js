const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('role', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: Sequelize.STRING,
      required: true,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      required: true,
      unique: true,
    },
  });

  return Role;
};
