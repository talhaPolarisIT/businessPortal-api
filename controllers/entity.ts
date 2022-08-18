import { Request, Response } from 'express';
import EntityQueryInterface from '../db/queries/entity-table';
export default () => {
  const models = require('../db/models');
  const { entities: Entity, user: User } = models;
  const entityQueryInterface = EntityQueryInterface();
  
  return {
    createEntity: async (req: Request, res: Response) => {
      const { name, databaseName, description, isDisplayonMenu, isPublish, fields, hasSubEntity, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, companyId } =
        req.body;
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
          linkedEntity,
          description,
          isDisplayonMenu,
          isPublish,
          createdBy,
          companyId,
        });
        entityQueryInterface.createTable(databaseName, fields);
        res.status(201).json({ message: 'Entity Created', entity: createEntity });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    getEntities: async (req: Request, res: Response) => {
      try {
        const entities = await Entity.findAll({
          order: [['id', 'ASC']],
        });
        res.status(200).json({ message: 'All Entities', entities });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    getEntityById: async (req: Request, res: Response) => {
      const { entityId: id } = req.params;
      try {
        const entity = await Entity.findOne({ where: { id } });
        res.status(200).json({ message: `Entity ${id}`, entity });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    getEntityByName: async (req: Request, res: Response) => {
      const { entityName } = req.params;
      try {
        const tableData = await entityQueryInterface.getEntityDataByName(entityName);
        res.status(200).json({ message: `Entity ${entityName}`, entity: [...tableData] });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    updateEntity: async (req: Request, res: Response) => {
      const { entityName } = req.params;
      const { entity } = req.body;
      const { id, name, fields, databaseName,isDisplayonMenu, isPublish, hasSubEntity, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, companyId } = entity;
      try {
        const entity = await Entity.findOne({ where: { id } });
        if (!entity) res.status(404).json({ message: `Entity Not Found` });
        else {
          const update = await Entity.update(
            { name, fields, databaseName, hasSubEntity,isDisplayonMenu, isPublish, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, companyId },
            { where: { id } }
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
    // addValuesToEntity: async (req: Request, res: Response) => {
    //   const { entityId: id } = req.params;
    //   const { name, fields, hasSubEntity, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, companyId } = req.body;
    //   try {
    //     const entity = await Entity.findOne({ where: { id } });
    //     if (!entity) res.status(404).json({ message: `Entity Not Found` });
    //     else {
    //       const update = await Entity.update({ name, fields, hasSubEntity, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, companyId }, { where: { id } });
    //       res.status(200).json({ message: `Entity ${id} Updated`, update });
    //     }
    //   } catch (error) {
    //     res.status(500).json({ message: 'Server Error' });
    //   }
    // },
    deleteEntity: async (req: Request, res: Response) => {
      const { entityId: id } = req.params;
      try {
        const entity = await Entity.findOne({ where: { id } });
        if (!entity) res.status(404).json({ message: `Entity Not Found` });
        else {
          const update = await Entity.destroy({ where: { id } });
          res.status(200).json({ message: `Entity ${id} Deleted` });
        }
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    addRecord: async (req: Request, res: Response) => {
      const { entityName } = req.params;
      const values = req.body;
      try {
        const insertData = await entityQueryInterface.insertRecord(entityName, values);
        res.status(200).json({ message: 'Record Add', insertData });
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    updateRecord: async (req: Request, res: Response) => {
      const { entityName, recordId } = req.params;
      const values = req.body;
      try {
        const updateData = await entityQueryInterface.updateRecord(entityName, recordId, values);
        res.status(200).json({ message: 'Record updated', updateData });
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
  };
};
