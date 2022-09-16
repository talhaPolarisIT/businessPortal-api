'use strict';

const USER_GROUPS = require('../../constants/userGroups');

module.exports = {
  async up(queryInterface, Sequelize) {
    const group = await queryInterface.rawSelect(
      'userGroup',
      {
        where: {
          [Sequelize.Op.or]: [{ id: 1 }, { id: 2 }, { id: 3 }],
        },
      },
      ['id']
    );
    if (!group || group.length === 0) {
      await queryInterface.bulkInsert('userGroup', USER_GROUPS, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('userGroup', {
      [Sequelize.Op.or]: USER_GROUPS.map((group) => {
        id: group.id;
      }),
    });
  },
};
