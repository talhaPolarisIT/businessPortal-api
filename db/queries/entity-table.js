import { DATA_TYPES } from '../../constants';

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
      Object.entries(fields).map((field) => {
        const [fieldName, fieldData] = field;
        tableFields = { [fieldName]: {type: DATA_TYPES[fieldData.dataType]}, ...tableFields };
      });
      console.log("...tableFields: ", tableFields);
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
      const fieldsArr = [];
      Object.entries(entity.fields).forEach((f) => {
        if (
          userGroupCodes.some((ug) => {
            return f[1].fieldsPermissionsFull.includes(ug) || f[1].fieldsPermissionsEdit.includes(ug);
          })
        ){
          fieldsArr.push(f[0]);
        }

      });

      // Object.entries(fields).forEach((f, index) => {
      //   const [fieldName, field] = f;
      //   if (field.fieldsPermissionsFull || field.fieldsPermissionsView) {
      //     if (field.fieldsPermissionsFull.includes(userGroupCode) || field.fieldsPermissionsView.includes(userGroupCode)) fieldsArr.push(fieldName);
      //   }
      // });
      // const recordViewPermissions= recordLevelPermission[userGroupCode].view
      // const filterArr = ''
      // if (recordViewPermissions){
      //   recordViewPermissions.forEach((filter)=>{
      //     filterArr = filterArr + `where ${filter.field} ${filter.condition} ${filter.value}`
      //   })
      // const userGroupsCode = [1,2]
      // const obj = Object.entries(entity.fields).map((f)=>{
      //   console.log( f[1].fieldsPermissionsFull)

      //   if(userGroupsCode.some((ug)=>{

      //     return f[1].fieldsPermissionsFull.includes(ug) || f[1].fieldsPermissionsEdit.includes(ug)
      //     }))
      //   return f[0]
      // });
      //  } field_54242 field_96372 entity_18328
      try {
        // return await queryInterface.sequelize.query(`Select ${fieldsArr.length > 0 ? fieldsArr.join(', ') : '*'} from ${tableName} ${filterArr} ORDER BY id ASC;`, { type: QueryTypes.SELECT });
        return await queryInterface.sequelize.query(`Select ${fieldsArr.join(' ,')}  from ${entity.databaseName} ORDER BY id ASC;`, { type: QueryTypes.SELECT });
      } catch (error) {
        console.log('ERROR IS getTable() -> tableName ', entity.name, error);
      }
    },
    insertRecord: async (tableName, values) => {
      try {
        let res;
        queryInterface
          .insert(null, tableName, values)
          .then((res) => {
            console.log('res ', res);
            return res;
          })
          .catch((error) => {
            console.log('error: ', error);
            return error;
          });
        // return res;
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
