import e from 'express';
import { DATA_TYPES } from '../../constants';
import { validateEmail } from '../../utils/validate';

const _default = () => {
  const db = require('../models/index');
  // console.log("db: ",db)
  const { Sequelize, DataTypes } = require('sequelize');
  const { QueryTypes } = require('sequelize');

  // const { DB_NAME, DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;

  // const sequelize = new Sequelize({
  //   username: DB_USERNAME,
  //   password: DB_PASSWORD,
  //   database: DB_NAME,
  //   host: DB_HOST,
  //   dialect: 'postgres',
  // });
  const queryInterface = db.sequelize.getQueryInterface();

  return {
    createTable: async (tableName, fields) => {
      const tableFields = {};
      console.log('...tableName: ', tableName);

      Object.entries(fields).map((field) => {
        const [fieldName, fieldData] = field;
        let feildSetting = {
          type: DATA_TYPES[fieldData.dataType],
        };
        switch (fieldData.dataType) {
          case 'Yes/No':
            break;

          default:
            break;
        }
        tableFields = { [fieldName]: { ...feildSetting }, ...tableFields };
      });
      console.log('...tableFields: ', tableFields);
      await queryInterface.createTable(tableName, {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        ...tableFields,
        createdAt: {
          type: DataTypes.DATE,
        },
        updatedAt: {
          type: DataTypes.DATE,
        },
      });
    },
    getEntityDataByName: async (entity, userGroupCodes) => {
      console.log('entity: ', entity.databaseName);
      // const fieldsArr = [];
      // Object.entries(entity.fields).forEach((f) => {
      //   if (
      //     userGroupCodes.some((ug) => {
      //       return f[1].fieldsPermissionsFull.includes(ug) || f[1].fieldsPermissionsEdit.includes(ug);
      //     })
      //   ) {
      //     fieldsArr.push(f[0]);
      //   }
      // });
      try {
        // return await queryInterface.sequelize.query(`Select ${fieldsArr.join(' ,')}  from ${entity.databaseName} ORDER BY id ASC;`, { type: QueryTypes.SELECT });
        const test = await queryInterface.sequelize.query(`Select *  from ${entity.databaseName} ORDER BY id ASC;`, { type: QueryTypes.SELECT });
        return test;
      } catch (error) {
        console.log('ERROR IS getTable() -> tableName ', entity.name, error);
      }
    },
    insertRecord: async (entity, values) => {
      try {
        // values.createdAt = new Date();
        // values.updatedAt = new Date();
        // return await queryInterface.insert(null, entity.databaseName, values);

        let error = { isError: false, message: '' };

        let lastRow = await queryInterface.sequelize.query(`SELECT * FROM  ${entity.databaseName} ORDER BY ID DESC LIMIT 1`, { type: QueryTypes.SELECT });

        Object.entries(entity.fields).map((field) => {
          const [fieldName, fieldData] = field;
          console.log('fieldName: ', fieldName);
          switch (fieldData.dataType) {
            case 'Auto Number':
              let currentValue = 0;
              if (lastRow && lastRow.length > 0) {
                if (lastRow[0][fieldName]) {
                  const dataRow = lastRow[0][fieldName].split('-');
                  currentValue = dataRow[dataRow.length - 1];
                } else {
                  error.message = 'Not found';
                  error.isError = true;
                  return;
                }
              }
              let finalValue = [];
              if (fieldData.settings.prefix) {
                finalValue.push(fieldData.settings.prefix);
              }
              if (fieldData.settings.prefixCol && fieldData.settings.prefixCol !== '') {
                console.log('fieldData.settings.prefixCol: ', fieldData.settings.prefixCol);
                finalValue.push(values[fieldData.settings.prefixCol]);
              }
              if (fieldData.settings.digits) {
                const currentValNum = parseInt(currentValue) + 1;
                const currentValStr = currentValNum.toString();
                if (currentValStr.length <= parseInt(fieldData.settings.digits)) {
                  currentValue = String(currentValNum).padStart(fieldData.settings.digits, '0');
                } else {
                  error.message = 'Max Number exceeded';
                  error.isError = true;
                  return;
                }
              } else {
                currentValue = currentValue + 1;
              }
              finalValue.push(currentValue.toString());
              console.log('finalValue: ', finalValue);

              values[fieldName] = finalValue.join('-');
              break;

            case 'Email':
              if (!validateEmail(values[fieldName])) {
                error.message = `Not A valid Email ${values[fieldName]}`;
                error.isError = true;
              }
              break;
            default:
              break;
          }
        });

        if (!error.isError) {
          values.createdAt = new Date();
          values.updatedAt = new Date();
          return await queryInterface.insert(null, entity.databaseName, values);
        } else {
          return new Error(error.message);
        }
      } catch (e) {
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
    deleteRecord: async (tableName, recordId) => {
      try {
        await queryInterface.bulkDelete(tableName, { id: recordId });
        return;
      } catch (error) {
        console.log('ERROR: ', error);
      }
    },
  };
};
export { _default as default };
