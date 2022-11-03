const { DataTypes } = require('sequelize');

export const DATA_TYPES = {
  Email: DataTypes.STRING,
  Duration: DataTypes.STRING,
  Link: DataTypes.STRING,
  Location: DataTypes.JSON,
  Document: DataTypes.ARRAY(DataTypes.STRING),
  Image: DataTypes.ARRAY(DataTypes.STRING),
  Phone: DataTypes.STRING,
  Section: DataTypes.STRING,
  'Text Single Line': DataTypes.STRING,
  'Text Multi Line': DataTypes.STRING,
  'Auto Number': DataTypes.STRING,
  Currency: DataTypes.INTEGER,
  Progress: DataTypes.INTEGER,
  Number: DataTypes.INTEGER,
  Date: DataTypes.DATE,
  'Yes/No': DataTypes.ENUM('', 'Yes', 'No'),
};
