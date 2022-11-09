import e from 'express';
import { DATA_TYPES } from '../../constants';
import { validateEmail } from '../../utils/validate';
import moment from 'moment';

const dateFormat = 'DD.MM.YYYY';
const _default = () => {
  const db = require('../models/index');
  // console.log("db: ",db)
  const { Sequelize, DataTypes } = require('sequelize');
  const { QueryTypes } = require('sequelize');

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
      return await queryInterface.createTable(tableName, {
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
        let error = { isError: false, message: '' };

        for (const field of Object.entries(entity.fields)) {
          const [fieldName, fieldData] = field;
          console.log('fieldName: ', fieldName);
          const { settings } = fieldData;

          if (!!settings && settings.isUnique) {
            const fieldValue = values[fieldName];
            const query = `SELECT * FROM  ${entity.databaseName} where ${fieldName} like '${fieldValue}'`;
            console.log('query: ', query);
            const result = await queryInterface.sequelize.query(query, { type: QueryTypes.SELECT });
            console.log('result: ', result);

            if (!!result && result.length > 0) {
              console.log('exits: ');
              error.message = `Record already exits`;
              error.isError = true;
              return error;
            }
          }

          switch (fieldData.dataType) {
            case 'Auto Number':
              const { prefix, prefixCol, subStringDigits: sub, digits } = settings;
              const prefixArr = [];
              let lastRow = '';
              if (prefix) {
                prefixArr.push(prefix);
              }
              if (prefixCol && prefixCol !== '') {
                const prefixColCurrentValue = values[prefixCol];
                if (sub) {
                  let subStringDigits = parseInt(sub);
                  subStringDigits = subStringDigits <= 0 ? 1 : subStringDigits;
                  const updatedPrefixColCurrentValue = prefixColCurrentValue.substring(0, subStringDigits);
                  prefixArr.push(updatedPrefixColCurrentValue);
                } else {
                  prefixArr.push(prefixColCurrentValue);
                }
              }

              let currentValue = 0;

              if (prefixArr.length > 0) {
                const pre = `${prefixArr.join('-')}-%`;
                const query = `SELECT * FROM  ${entity.databaseName} where ${fieldName} like '${pre}' ORDER BY ID DESC LIMIT 1`;
                console.log('query: ', query);
                lastRow = await queryInterface.sequelize.query(query, { type: QueryTypes.SELECT });
                console.log('lastRow: ', lastRow);
                if (lastRow && lastRow.length > 0 && lastRow[0][fieldName]) {
                  const dataRow = lastRow[0][fieldName].split('-');
                  currentValue = dataRow[dataRow.length - 1];
                }
              } else {
                const query = `SELECT * FROM  ${entity.databaseName} ORDER BY ID DESC LIMIT 1`;
                console.log('query no prefix: ', query);
                lastRow = await queryInterface.sequelize.query(query, { type: QueryTypes.SELECT });
                console.log('lastRow with prefix : ', lastRow);
                if (lastRow && lastRow.length > 0 && lastRow[0][fieldName]) {
                  currentValue = lastRow[0][fieldName];
                }
              }
              let currentValNum = parseInt(currentValue) ? parseInt(currentValue) + 1 : 1;
              const currentValStr = currentValNum.toString();

              if (digits && currentValStr.length > parseInt(digits)) {
                error.message = 'Max Number exceeded';
                error.isError = true;
                return;
              }
              currentValue = String(currentValNum).padStart(digits, '0');
              prefixArr.push(currentValue.toString());
              console.log('prefixArr: ', prefixArr);

              values[fieldName] = prefixArr.join('-').toString();

              break;

            case 'Email':
              if (!validateEmail(values[fieldName])) {
                error.message = `Not A valid Email ${values[fieldName]}`;
                error.isError = true;
              }
              break;
            case 'Date':
              if (!moment(values[fieldName], dateFormat).isValid()) {
                error.message = `Not A valid Date ${values[fieldName]}`;
                error.isError = true;
                console.log('invalid date');
              } else {
                console.log('valid date. ,', moment(values[fieldName]).format(dateFormat));

                values[fieldName] = moment(values[fieldName], dateFormat);
              }
            default:
              break;
          }
        }
        if (!error.isError) {
          values.createdAt = new Date();
          values.updatedAt = new Date();
          console.log('entering values: ', values);
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
        for (const col of deleteColArr) {
          await queryInterface.removeColumn(tableName, col);
        }
      } catch (error) {
        console.log('ERROR: ', error);
      }
    },

    addColumns: async (tableName, addedFields) => {
      try {
        for (const field of Object.entries(addedFields)) {
          const [fieldName, fieldData] = field;
          console.log('fieldData;:', fieldData);
          await queryInterface.addColumn(tableName, fieldName, { type: DATA_TYPES[fieldData.dataType] });
        }
      } catch (error) {
        console.log('ERROR: ', error);
      }
    },
    updateRecord: async (entity, tableName, id, values) => {
      // const { id, ...remainingValues } = values;
      console.log("tableName, id, values: ",  tableName, id, values);
      try {
        let error = { isError: false, message: '' };

        for (const field of Object.entries(entity.fields)) {
          const [fieldName, fieldData] = field;
          console.log('fieldName: ', fieldName);
          const { settings } = fieldData;

          if (!!settings && settings.isUnique) {
            const fieldValue = values[fieldName];
            const query = `SELECT * FROM  ${entity.databaseName} where ${fieldName} like '${fieldValue}'`;
            console.log('query: ', query);
            const result = await queryInterface.sequelize.query(query, { type: QueryTypes.SELECT });
            console.log('result: ', result);

            if (!!result && result.length > 0) {
              console.log('exits: ');
              error.message = `Record already exits`;
              error.isError = true;
              return error;
            }
          }

          switch (fieldData.dataType) {
            case 'Auto Number':
              const { prefix, prefixCol, subStringDigits: sub, digits } = settings;
              const prefixArr = [];
              let lastRow = '';
              if (prefix) {
                prefixArr.push(prefix);
              }
              if (prefixCol && prefixCol !== '') {
                const prefixColCurrentValue = values[prefixCol];
                if (sub) {
                  let subStringDigits = parseInt(sub);
                  subStringDigits = subStringDigits <= 0 ? 1 : subStringDigits;
                  const updatedPrefixColCurrentValue = prefixColCurrentValue.substring(0, subStringDigits);
                  prefixArr.push(updatedPrefixColCurrentValue);
                } else {
                  prefixArr.push(prefixColCurrentValue);
                }
              }

              let currentValue = 0;

              if (prefixArr.length > 0) {
                const pre = `${prefixArr.join('-')}-%`;
                const query = `SELECT * FROM  ${entity.databaseName} where ${fieldName} like '${pre}' ORDER BY ID DESC LIMIT 1`;
                console.log('query: ', query);
                lastRow = await queryInterface.sequelize.query(query, { type: QueryTypes.SELECT });
                console.log('lastRow: ', lastRow);
                if (lastRow && lastRow.length > 0 && lastRow[0][fieldName]) {
                  const dataRow = lastRow[0][fieldName].split('-');
                  currentValue = dataRow[dataRow.length - 1];
                }
              } else {
                const query = `SELECT * FROM  ${entity.databaseName} ORDER BY ID DESC LIMIT 1`;
                console.log('query no prefix: ', query);
                lastRow = await queryInterface.sequelize.query(query, { type: QueryTypes.SELECT });
                console.log('lastRow with prefix : ', lastRow);
                if (lastRow && lastRow.length > 0 && lastRow[0][fieldName]) {
                  currentValue = lastRow[0][fieldName];
                }
              }
              let currentValNum = parseInt(currentValue) ? parseInt(currentValue) + 1 : 1;
              const currentValStr = currentValNum.toString();

              if (digits && currentValStr.length > parseInt(digits)) {
                error.message = 'Max Number exceeded';
                error.isError = true;
                return;
              }
              currentValue = String(currentValNum).padStart(digits, '0');
              prefixArr.push(currentValue.toString());
              console.log('prefixArr: ', prefixArr);

              values[fieldName] = prefixArr.join('-').toString();

              break;

            case 'Email':
              if (!validateEmail(values[fieldName])) {
                error.message = `Not A valid Email ${values[fieldName]}`;
                error.isError = true;
              }
              break;
            case 'Date':
              if (!moment(values[fieldName], dateFormat).isValid()) {
                error.message = `Not A valid Date ${values[fieldName]}`;
                error.isError = true;
                console.log('invalid date');
              } else {
                console.log('valid date. ,', moment(values[fieldName]).format(dateFormat));

                values[fieldName] = moment(values[fieldName], dateFormat);
              }
            default:
              break;
          }
        }
        if (!error.isError) {
          values.updatedAt = new Date();
          console.log('entering values: ', values);
          return await queryInterface.bulkUpdate(tableName, values, { id });
        } else {
          return new Error(error.message);
        }
      } catch (e) {
        console.log('Error ', e);
        console.log('ERROR IS updatetable() -> tableName ', tableName, values);
      }
      // try {
      //  return await queryInterface.bulkUpdate(tableName, values, {  id });

      // } catch (error) {
      //   console.log('ERROR: ', error);
      // }
    },
    deleteRecord: async (tableName, recordId) => {
      try {
        const values = { isDeleted: true };
        await queryInterface.bulkUpdate(tableName, values, { id: recordId });

        // await queryInterface.bulkDelete(tableName, { id: recordId });
        return;
      } catch (error) {
        console.log('ERROR: ', error);
      }
    },

    updateColumns: async (tableName, currentEntity, updatedField) => {
      try {
        for (const field of Object.entries(updatedField)) {
          const [fieldName, fieldData] = field;
          const { settings, dataType } = fieldData;
          if (dataType === DATA_TYPES['Auto Number'] && !!settings.isRegenerate && settings.isRegenerate) {
          }

          await queryInterface.changeColumn(tableName, fieldName, { type: DATA_TYPES[fieldData.dataType] });
        }
      } catch (error) {
        console.log('ERROR: ', error);
      }
    },
  };
};
export { _default as default };
