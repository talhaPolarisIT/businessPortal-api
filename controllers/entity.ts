import { Request, Response } from 'express';

export default () => {
  const models = require('../db/models');
  const { entities: Entity, user: User } = models;
  return {
    createEntity: async (req: Request, res: Response) => {
      const { name, description, isDisplayonMenu, isPublish, fields, hasSubEntity, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, companyId } = req.body;
      try {
        const createEntity = await Entity.create({
          name,
          fields,
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
        res.status(201).json({ message: 'Entity Created', entity: createEntity });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    getEntities: async (req: Request, res: Response) => {
      try {
        const entities = await Entity.findAll();
        res.status(200).json({ message: 'All Entities', entities });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    getEntityById: async (req: Request, res: Response) => {
      console.log(req.params);

      const { entityId: id } = req.params;
      try {
        const entity = await Entity.findOne({ where: { id } });
        res.status(200).json({ message: `Entity ${id}`, entity });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    updateEntity: async (req: Request, res: Response) => {
      const { entityId: id } = req.params;
      const { name, fields, hasSubEntity, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, companyId } = req.body;

      try {
        const entity = await Entity.findOne({ where: { id } });
        if (!entity) res.status(404).json({ message: `Entity Not Found` });
        else {
          const update = Entity.update({ name, fields, hasSubEntity, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, companyId }, { where: { id } });
          res.status(200).json({ message: `Entity ${id} Updated`, update });
        }
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
    addValuesToEntity: async (req: Request, res: Response) => {
      const { entityId: id } = req.params;
      const { name, fields, hasSubEntity, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, companyId } = req.body;
      try {
        const entity = await Entity.findOne({ where: { id } });
        if (!entity) res.status(404).json({ message: `Entity Not Found` });
        else {
          const update = await Entity.update({ name, fields, hasSubEntity, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, companyId }, { where: { id } });
          res.status(200).json({ message: `Entity ${id} Updated`, update });
        }
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
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
  };
};
