import { Request, Response } from 'express';
import { Op } from 'sequelize';

export default () => {
  const models = require('../db/models');
  const {  userGroup, user: User } = models;

  return {
    getUserGroups: async (req: Request, res: Response) => {
      try {
        const userGroups = await userGroup.findAll({ include: User });
        res.status(200).json({ message: 'getUserGroups', userGroups });
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
      }
    },

    createUserGroups: async (req: Request, res: Response) => {
      try {
        const { name, code, isAdmin, isPublic, isActive } = req.body;
        const userGroups = await userGroup.findAll({ where: { [Op.or]: [{ isAdmin: true }, { code }, { isPublic: true }] } });
        for (let index = 0; index < userGroups.length; index++) {
          const { dataValues } = userGroups[index];
          if (dataValues.isAdmin && isAdmin) {
            res.status(403).json({ message: 'Administration group already exists.' });
            return;
          } else if (dataValues.isAdmin && isAdmin) {
            res.status(403).json({ message: 'Public group already exists.' });
            return;
          } else if (dataValues.code === parseInt(code)) {
            res.status(403).json({ message: 'User group code already exists.' });
            return;
          }
        }
        const created = await userGroup.create({
          name,
          code,
          isAdmin,
          isPublic,
          isActive,
        });
        res.status(201).json({ message: 'user group created.', created });
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error', error: error.message });
      }
    },

    updateUserGroups: async (req: Request, res: Response) => {
      const { userGroupId: id } = req.params;
      try {
        const { name, isActive } = req.body;
        const userGroups = await userGroup.findOne({ where: { id } });
        if (!userGroups) res.status(404).json({ message: 'User group does not exist.' });
        else {
          const updated = await userGroup.update(
            {
              name,
              isActive,
            },
            { where: { id } }
          );
          res.status(200).json({ message: 'user group updated.', updated });
        }
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
      }
    },

    deleteUserGroups: async (req: Request, res: Response) => {
      const { userGroupId: id } = req.params;
      try {
        const userGroups = await userGroup.findOne({ where: { id } });

        if (!userGroups) res.status(404).json({ message: 'User group does not exist.' });
        else {
          const deleted = await userGroup.destroy({ where: { id } });
          res.status(200).json({ message: `User group ${id} Deleted` });
        }
      } catch (error: any) {
        res.status(500).json({ message: 'Server Error' });
      }
    },
  };
};
