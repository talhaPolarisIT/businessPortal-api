import { Response } from 'express';
import EntityQueryInterface from '../db/queries/entity-table';

import { Op } from 'sequelize';
import { ILocalUserRequest } from '../interceptors/localUserCheck';

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
        entityQueryInterface.createTable(databaseName, fields);
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
      // const { code: userGroupCode } = req.localUser.userGroup;
      try {
        const entity = await Entity.findOne({ where: { databaseName: entityName } });
        if (!entity) return res.status(404).json({ message: `Entity not fount` });

        const tableData = await entityQueryInterface.getEntityDataByName(entityName, entity.fields, entity.recordLevelPermission, 1);
        res.status(200).json({ message: `Entity ${entityName}`, entity: [...tableData] });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    updateEntity: async (req: ILocalUserRequest, res: Response) => {
      const { entityName } = req.params;
      const { entity } = req.body;
      console.log('entity: ', entity);

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
            await entityQueryInterface.addColumns(databaseName, Object.keys(addedFields));
          }
          res.status(200).json({ message: `Entity ${databaseName} Updated`, update });
        }
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    // addValuesToEntity: async (req: ILocalUserRequest, res: Response) => {
    //   const { entityId: id } = req.params;
    //   const { name, fields, hasSubEntity, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, } = req.body;
    //   try {
    //     const entity = await Entity.findOne({ where: { id } });
    //     if (!entity) res.status(404).json({ message: `Entity Not Found` });
    //     else {
    //       const update = await Entity.update({ name, fields, hasSubEntity, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, }, { where: { id } });
    //       res.status(200).json({ message: `Entity ${id} Updated`, update });
    //     }
    //   } catch (error) {
    //     res.status(500).json({ message: 'Server Error' });
    //   }
    // },
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
          const deleted = await Entity.destroy({ where: { id } });
          res.status(200).json({ message: `Entity ${id} Deleted` });
        }
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    addRecord: async (req: ILocalUserRequest, res: Response) => {
      const { entityName } = req.params;
      const values = req.body;
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
          console.log('update entity.name: ', entity.name);
          const insertData = await entityQueryInterface.insertRecord(entityName, values);
          // const insertData = entity_470732.create({ field_995954, field_502573, field_658322, field_396853 });
          // const tableData = await entityQueryInterface.getEntityDataByName(entityName);
          console.log('insertData: ', insertData);
          res.status(200).json({ message: 'Record Add', insertData });

          // if (insertData) {
          //   res.status(200).json({ message: 'Record Add', insertData });
          // } else {
          //   res.status(500).json({ message: 'Server Error' });
          // }
        }
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    updateRecord: async (req: ILocalUserRequest, res: Response) => {
      const { entityName, recordId } = req.params;
      const values = req.body;
      try {
        const updateData = await entityQueryInterface.updateRecord(entityName, recordId, values);
        res.status(200).json({ message: 'Record updated', updateData });
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
      }
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
