const { DataTypes } = require('sequelize');

export const DATA_TYPES = {
  Email: DataTypes.STRING,
  Duration: DataTypes.STRING,
  Link: DataTypes.STRING,
  Location: DataTypes.STRING,
  Document: DataTypes.STRING,
  Image: DataTypes.STRING,
  Section: DataTypes.STRING,
  'Text Single Line': DataTypes.STRING,
  'Text Multi Line': DataTypes.STRING,
  'Auto Number': DataTypes.INTEGER,
  Currency: DataTypes.INTEGER,
  Progress: DataTypes.INTEGER,
  Number: DataTypes.INTEGER,
  Date: DataTypes.DATE,
};
