'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('companies', 'licenseNo', 'licenseNumber');
    await queryInterface.renameColumn('companies', 'registrationNo', 'registrationNumber');
    await queryInterface.renameColumn('companies', 'phone', 'mobileNumber');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('companies', 'licenseNumber', 'licenseNo');
    await queryInterface.renameColumn('companies', 'registrationNumber', 'registrationNo');
    await queryInterface.renameColumn('companies', 'mobileNumber', 'phone');
  },
};
