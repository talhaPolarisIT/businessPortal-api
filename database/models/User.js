const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    auth0Id: {
      type: Sequelize.STRING,
      required: true,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      required: true,
    },
    name: {
      type: Sequelize.STRING,
      required: true,
    },
    inDarkMode: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    verificationCode: {
      type: Sequelize.INTEGER,
    },
    mobile: {
      type: Sequelize.STRING,
    },
    recoveryEmail: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
  });

  User.associate = (models) => {
    User.belongsTo(models.company, { foreignKey: 'companyId' });
    User.belongsTo(models.role, { foreignKey: 'roleId' });
  };

  return User;
};
