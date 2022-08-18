const _default = () => {
  const { Sequelize, DataTypes } = require('sequelize');
  const { QueryTypes } = require('sequelize');

  const { DB_NAME, DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

  const sequelize = new Sequelize({
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'postgres',
  });
  const queryInterface = sequelize.getQueryInterface();

  return {
    createTable: async (tableName, fields) => {
      const tableFields = {};
      Object.keys(fields).map((fieldName) => {
        tableFields = { [fieldName]: DataTypes.STRING, ...tableFields };
      });
      await queryInterface.createTable(tableName, {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        ...tableFields,
      });
    },
    getEntityDataByName: async (tableName) => {
      try {
        return await queryInterface.sequelize.query(`Select * from ${tableName} ORDER BY id ASC;`, { type: QueryTypes.SELECT });
      } catch (error) {
        console.log('ERROR IS getTable() -> tableName ', tableName);
      }
    },
    insertRecord: async (tableName, values) => {
      try {
        const res = await queryInterface.insert(null, tableName, values);
        return res;
      } catch (error) {
        console.log('ERROR IS insertTable() -> tableName ', tableName, values);
      }
    },
    deleteColumns: async (tableName, deleteColArr) => {
      try {
        deleteColArr.forEach(async (col) => {
          await queryInterface.removeColumn(tableName, col);
        });
        return;
      } catch (error) {
        console.log('ERROR: ', error);
      }
    },

    addColumns: async (tableName, newCols) => {
      try {
        newCols.forEach(async (col) => {
          await queryInterface.addColumn(tableName, col, { type: DataTypes.STRING });
        });
        return;
      } catch (error) {
        console.log('ERROR: ', error);
      }
    },
    updateRecord: async (tableName, recordId, values) => {
      const { id, ...remainingValues } = values;
      try {
        await queryInterface.bulkUpdate(tableName, remainingValues, { id: recordId });
        return;
      } catch (error) {
        console.log('ERROR: ', error);
      }
    },
  };
};
export { _default as default };
