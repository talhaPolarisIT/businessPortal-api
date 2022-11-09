import { Response } from 'express';
import DeepEqual from 'deep-equal';
import EntityQueryInterface from '../db/queries/entity-table';

import { Op } from 'sequelize';
import { ILocalUserRequest } from '../interceptors/localUserCheck';
import { upload as uploadToBucket } from '../utils/cloudStorage';
import { DATA_TYPES } from '../constants';
export interface IValues {
  recordId: string;
  value: string;
}

export interface ISettings {
  [key: string]: any;
}

export interface IFeild {
  fieldRecord?: number;
  name: string;
  dataType: string;
  defaultValue: string;
  settings: ISettings;
  values: IValues[];
  isEditable?: boolean;
  fieldsPermissionsFull: [];
  fieldsPermissionsEdit: [];
  fieldsPermissionsView: [];
  fieldsPermissionsNone: [];
}

export interface IFeilds {
  [key: string]: IFeild;
}

export interface IEntity {
  name: string;
  databaseName: string;
  description: string;
  fields: IFeilds;
  isDisplayonMenu: boolean;
  isPublish: boolean;
  entityPermissionsCreate: [];
  entityPermissionsNone: [];
  entityPermissionsRead: [];
  entityPermissionsDelete: [];
  hasSubEntity: boolean;
  isSubEntity;
  subEntityId;
  superEntityId;
  isLinkedEntity;
  linkedEntity;
  createdBy;

  recordLevelPermission: IRecordLevelPermission;
}

export interface IRecordLevelPermission {
  [key: string]: {
    edit: IFilterValues[];
    view: IFilterValues[];
    delete: IFilterValues[];
  };
}
export interface IFilterValues {
  field: string;
  operator: string;
  value: string;
  condition: string;
}

export interface IEntityCreateRequest extends ILocalUserRequest {
  body: IEntity;
}

interface MulterRequest extends ILocalUserRequest {
  files: any;
}

export default () => {
  const models = require('../db/models');
  const { entities: Entity, user: User } = models;
  const entityQueryInterface = EntityQueryInterface();
  return {
    createEntity: async (req: IEntityCreateRequest, res: Response) => {
      const {
        name,
        databaseName,
        description,
        isDisplayonMenu,
        isPublish,
        fields,
        hasSubEntity,
        isSubEntity,
        subEntityId,
        superEntityId,
        isLinkedEntity,
        linkedEntity,
        createdBy,
        entityPermissionsNone,
        entityPermissionsRead,
        entityPermissionsCreate,
        entityPermissionsDelete,
        recordLevelPermission,
      } = req.body;
      try {
        const createEntity = await Entity.create({
          name,
          fields,
          databaseName,
          hasSubEntity,
          isSubEntity,
          subEntityId,
          superEntityId,
          isLinkedEntity,
          entityPermissionsNone,
          entityPermissionsRead,
          entityPermissionsCreate,
          entityPermissionsDelete,
          linkedEntity,
          description,
          isDisplayonMenu,
          isPublish,
          createdBy,

          recordLevelPermission,
        });
        await entityQueryInterface.createTable(databaseName, fields);
        res.status(201).json({ message: 'Entity Created', entity: createEntity });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    getEntities: async (req: ILocalUserRequest, res: Response) => {
      try {
        const entities = await Entity.findAll({
          where: {
            [Op.or]: {
              entityPermissionsRead: {
                [Op.overlap]: req.localUser.userGroupCodes,
              },
              entityPermissionsCreate: {
                [Op.overlap]: req.localUser.userGroupCodes,
              },
              entityPermissionsDelete: {
                [Op.overlap]: req.localUser.userGroupCodes,
              },
            },
            [Op.and]: {
              isDeleted: false,
            },
          },
          order: [['id', 'ASC']],
        });
        res.status(200).json({ message: 'All Entities', entities });
      } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
      }
    },
    getEntityById: async (req: ILocalUserRequest, res: Response) => {
      const { entityId: id } = req.params;
      try {
        const entity: IEntity = await Entity.findOne({ where: { id } });
        console.log('getEntityById: ', entity);
        res.status(200).json({ message: `Entity ${id}`, entity });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    getEntityByName: async (req: ILocalUserRequest, res: Response) => {
      const { entityName } = req.params;
      const userGroupCodse = req.localUser.userGroupCodes;
      try {
        const entity = await Entity.findOne({ where: { databaseName: entityName } });
        if (!entity) return res.status(404).json({ message: `Entity not fount` });
        const tableData = await entityQueryInterface.getEntityDataByName(entity, userGroupCodse);
        console.log('tableData: ', tableData);

        res.status(200).json({ message: `Entity ${entityName}`, entity: [...tableData] });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    updateEntity: async (req: ILocalUserRequest, res: Response) => {
      const { entityName } = req.params;
      const { entity } = req.body;
      const userGroupCodse = req.localUser.userGroupCodes;

      console.log('entity.id: ', entity.id);

      const {
        id,
        name,
        fields,
        databaseName,
        isDisplayonMenu,
        isPublish,
        hasSubEntity,
        isSubEntity,
        subEntityId,
        superEntityId,
        isLinkedEntity,
        linkedEntity,
        createdBy,
        entityPermissionsNone,
        entityPermissionsRead,
        entityPermissionsCreate,
        entityPermissionsDelete,
      } = entity;
      try {
        const entity = await Entity.findOne({
          where: {
            id,
            [Op.or]: {
              entityPermissionsCreate: {
                [Op.overlap]: req.localUser.userGroupCodes,
              },
              entityPermissionsDelete: {
                [Op.overlap]: req.localUser.userGroupCodes,
              },
            },
          },
        });

        if (!entity) res.status(404).json({ message: `Entity Not Found` });
        else {
          console.log('update entity.name: ', entity.name);
          if (fields) {
            const fieldsEntry: [string, any][] = Object.entries(fields);
            for (const newField of fieldsEntry) {
              const [newFieldName, newFieldData] = newField;
              console.log('newFieldName, newFieldData: ', newFieldName, newFieldData);

              const { settings: newFieldSettings, dataType: newFieldDataType } = newFieldData;
              console.log('entity.fields[newFieldName]: ', entity.fields[newFieldName]);

              const { settings: previousFieldSettings } = entity.fields[newFieldName] || {};

              console.log(' previousFieldSettings: ', previousFieldSettings, newFieldName);

              if (newFieldDataType === 'Auto Number' && !!newFieldSettings.isRegenerate && newFieldSettings.isRegenerate) {
                // compare previous settings with new settings
                console.log('newFieldDataType: ', newFieldDataType);

                if (!DeepEqual(previousFieldSettings, newFieldSettings)) {
                  // Implement newFieldSettings
                  //get all the data from entity data table

                  const tableData = await entityQueryInterface.getEntityDataByName(entity, userGroupCodse);
                  console.log('tableData as auto number fieldSettings are changed: ', tableData);

                  // update each row.

                  const { prefix, prefixCol, subStringDigits: sub, digits } = newFieldSettings;
                  const outputArr = [];
                  const prefixCount = {};
                  let error = { isError: false, message: '' };
                  let indexPlusOne = 0;
                  for (const row of tableData) {
                    const prefixArr = [];
                    indexPlusOne = indexPlusOne + 1;
                    console.log(indexPlusOne, 'row: ', row);

                    // let lastRow = '';
                    if (prefix) {
                      prefixArr.push(prefix);
                    }
                    if (prefixCol && prefixCol !== '') {
                      const prefixColCurrentValue = row[prefixCol];
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
                    console.log('prefixCount: pre', prefixCount);

                    if (prefixArr.length > 0) {
                      const pre = `${prefixArr.join('-')}-%`;
                      const last = prefixCount[pre];
                      if (last) {
                        currentValue = parseInt(last[last.length - 1]) + 1;
                        prefixCount[pre].push(currentValue);
                      } else {
                        prefixCount[pre] = [1];
                        currentValue = 1;
                      }
                    } else {
                      currentValue = indexPlusOne;
                    }
                    console.log('prefixCount: post', prefixCount);

                    const currentValStr = currentValue.toString();

                    if (digits && currentValStr.length > parseInt(digits)) {
                      error.message = 'Max Number exceeded';
                      error.isError = true;
                      return;
                    }
                    const currentValueStr = String(currentValue).padStart(digits, '0');
                    prefixArr.push(currentValueStr.toString());
                    console.log('prefixArr: ', prefixArr);

                    row[newFieldName] = prefixArr.join('-').toString();
                    console.log('row: ', row);

                    outputArr.push(row);
                    const { id, ...remainingValues } = row;

                    const updateData = await entityQueryInterface.updateRecord(entityName, row.id, remainingValues);
                    console.log('updateData: ', updateData);
                  }
                  console.log('output', outputArr);
                }
              }
            }
          }
          const update = await Entity.update(
            {
              name,
              fields,
              databaseName,
              hasSubEntity,
              isDisplayonMenu,
              isPublish,
              isSubEntity,
              subEntityId,
              superEntityId,
              isLinkedEntity,
              linkedEntity,
              createdBy,
              entityPermissionsNone,
              entityPermissionsRead,
              entityPermissionsCreate,
              entityPermissionsDelete,
            },
            {
              where: {
                id,
              },
            }
          );
          if (req.body.deletedFields) {
            const { deletedFields } = req.body;
            await entityQueryInterface.deleteColumns(databaseName, deletedFields);
          }
          if (req.body.addedFields) {
            const { addedFields } = req.body;
            await entityQueryInterface.addColumns(databaseName, addedFields);
          }

          res.status(200).json({ message: `Entity ${databaseName} Updated`, update });
        }
      } catch (error) {
        console.log('error: ', error);

        res.status(500).json({ message: 'Server Error', error });
      }
    },
    deleteEntity: async (req: ILocalUserRequest, res: Response) => {
      const { entityId: id } = req.params;
      try {
        const entity = await Entity.findOne({
          where: {
            id,
            entityPermissionsDelete: {
              [Op.overlap]: req.localUser.userGroupCodes,
            },
          },
        });
        if (!entity) res.status(404).json({ message: `Entity Not Found` });
        else {
          const deleted = await Entity.update({ isDeleted: true }, { where: { id } });
          res.status(200).json({ message: `Entity ${id} Deleted` });
        }
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    addRecord: async (req: MulterRequest, res: Response) => {
      const { entityName } = req.params;
      const values = req.body;

      console.log('----------------------------------------req.files: ', req.files);
      console.log('values: ', values);
      if (req.files) {
        for await (const element of req.files) {
          console.log('element: ', element);

          try {
            const url = await uploadToBucket(element.buffer, element.originalname);
            if (values[element.fieldname] && values[element.fieldname].length > 0) {
              values[element.fieldname].push({ fileName: element.originalname, url });
            } else {
              values[element.fieldname] = [{ fileName: element.originalname, url }];
            }
          } catch (err) {
            console.log('error, ', err);
          }
        }
      }
      console.log('post values: ', values);

      try {
        const entity = await Entity.findOne({
          where: {
            databaseName: entityName,
            [Op.or]: {
              entityPermissionsCreate: {
                [Op.overlap]: req.localUser.userGroupCodes,
              },
              entityPermissionsDelete: {
                [Op.overlap]: req.localUser.userGroupCodes,
              },
            },
          },
        });

        if (!entity) res.status(404).json({ message: `Entity Not Found` });
        else {
          console.log('insert data entity.name: ', entity.name);
          const insertData = await entityQueryInterface.insertRecord(entity, values);
          console.log('insertData: ', insertData);
          if (!!insertData && insertData.isError) {
            return res.status(500).json({ message: 'Server Error', insertData });
          }
          res.status(200).json({ message: 'Record Add' });
        }
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error });
      }
    },
    updateRecord: async (req: MulterRequest, res: Response) => {
      const { entityName, recordId } = req.params;
      const values = req.body;
      console.log('update, ', entityName, recordId);
      console.log('----------------------------------------req.files: ', req.files);
      console.log('values: ', values);
      if (req.files) {
        for await (const element of req.files) {
          try {
            const url = await uploadToBucket(element.buffer, element.originalname);
            if (values[element.fieldname] && values[element.fieldname].length > 0) {
              values[element.fieldname].push({ fileName: element.originalname, url });
            } else {
              values[element.fieldname] = [{ fileName: element.originalname, url }];
            }
          } catch (err) {
            console.log('error, ', err);
          }
        }
      }
      console.log('post values: ', values);

      try {
        const entity = await Entity.findOne({
          where: {
            databaseName: entityName,
            [Op.or]: {
              entityPermissionsCreate: {
                [Op.overlap]: req.localUser.userGroupCodes,
              },
              entityPermissionsDelete: {
                [Op.overlap]: req.localUser.userGroupCodes,
              },
            },
          },
        });

        if (!entity) res.status(404).json({ message: `Entity Not Found` });
        else {
          console.log('update data entity.name: ', entity.name);
          const updateData = await entityQueryInterface.updateRecord(entity, entityName, recordId, values);
          console.log('updateData: ', updateData);
          if (!!updateData && updateData.isError) {
            return res.status(500).json({ message: 'Server Error', updateData });
          }
          res.status(200).json({ message: 'Record updated', updateData });
        }
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error });
      }

      // try {
      // const updateData = await entityQueryInterface.updateRecord(entityName, recordId, values);
      // res.status(200).json({ message: 'Record updated', updateData });
      // } catch (error: any) {
      //   res.status(500).json({ message: 'Server Error' });
      // }
    },
    deleteRecord: async (req: ILocalUserRequest, res: Response) => {
      const { entityName, recordId } = req.params;
      try {
        await entityQueryInterface.deleteRecord(entityName, recordId);
        res.status(200).json({ message: 'Record delete' });
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
  };
};
