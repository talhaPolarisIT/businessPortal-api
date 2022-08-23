const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const entity_470732 = sequelize.define(
    'entity_470732',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      field_995954: {
        type: Sequelize.STRING,
      },
      field_502573: {
        type: Sequelize.STRING,
      },
      field_658322: {
        type: Sequelize.STRING,
      },
      field_396853: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: 'entity_470732',
    }
  );

  return entity_470732;
};
