const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    userGroupCodes: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    isPasswordUpdated: {
      type: Sequelize.BOOLEAN,
    },
    isCheckReq: {
      type: Sequelize.BOOLEAN,
    },
    verificationCode: {
      type: Sequelize.INTEGER,
    },
  });

  return User;
};
