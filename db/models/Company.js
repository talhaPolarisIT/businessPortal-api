const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Company = sequelize.define('company', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      required: true,
    },
    address: {
      type: Sequelize.STRING,
    },
    logo: {
      type: Sequelize.STRING,
    },
    registrationNumber: {
      type: Sequelize.STRING,
    },
    licenseNumber: {
      type: Sequelize.STRING,
    },
    mobileNumber: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    website: {
      type: Sequelize.STRING,
    },
  });

  return Company;
};
