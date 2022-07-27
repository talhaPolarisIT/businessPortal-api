import { Request, Response } from 'express';

export default () => {
  //   const { entity: Entity } = models;
  const models = require('../db/models');
  const { entities: Entity, user: User } = models;
  return {
    createEntity: async (req: Request, res: Response) => {
      const { name, fields, hasSubEntity, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, companyId } = req.body;
      try {
        console.log(
          ' name, fields, hasSubEntity, isSubEntity, subEntityId, superEntityId, isLinkedEntity, linkedEntity, createdBy, companyId: ',
          name,
          fields,
          hasSubEntity,
          isSubEntity,
          subEntityId,
          superEntityId,
          isLinkedEntity,
          linkedEntity,
          createdBy,
          companyId
        );

        const createEntity = await Entity.create({
          name,
          fields,
          hasSubEntity,
          isSubEntity,
          subEntityId,
          superEntityId,
          isLinkedEntity,
          linkedEntity,
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
        const entities = await Entity.findOne({where:{id:1}});
        res.status(200).json({ message: 'All Entities', entities });
      } catch (error) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
  };
};
