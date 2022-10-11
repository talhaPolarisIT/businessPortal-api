const { DataTypes } = require('sequelize');

export const DATA_TYPES = {
  Email: DataTypes.STRING,
  Duration: DataTypes.STRING,
  Link: DataTypes.STRING,
  Location: DataTypes.STRING,
  Document: DataTypes.STRING,
  Image: DataTypes.STRING,
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

export const DATA_TYPESX = [
  { value: 'Auto Number', label: 'Auto Number' },
  { value: 'Email', label: 'Email' },
  { value: 'Currency', label: 'Currency' },
  { value: 'Phone', label: 'Phone' },
  { value: 'Progress', label: 'Progress' },
  { value: 'Duration', label: 'Duration' },
  { value: 'Link', label: 'Link' },
  { value: 'Date', label: 'Date' },
  { value: 'Location', label: 'Location' },
  { value: 'Document', label: 'Document' },
  { value: 'Image', label: 'Image' },
  { value: 'Section', label: 'Section' },
  { value: 'Number', label: 'Number' },
  { value: 'Text Single Line', label: 'Text Single Line' },
  { value: 'Text Multi Line', label: 'Text Multi Line' },
  { value: 'Yes/No', label: 'Yes/No' },
];
