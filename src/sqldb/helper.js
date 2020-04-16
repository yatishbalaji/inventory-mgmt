const Sequelize = require('sequelize');

const r = require;
const { DataTypes } = Sequelize;

module.exports = {
  engine: {
    engine: 'InnoDB',
    charset: 'utf8mb4',
  },

  id: {
    type: DataTypes.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },

  properties(model) {
    return r(`../api/${model}/${model}.property`)(DataTypes);
  },

  keys(model) {
    return {
      type: DataTypes.INTEGER,
      references: {
        model,
        key: 'id',
      },
      onUpdate: 'restrict',
      onDelete: 'restrict',
    };
  },

  timestamps(type, sequelize) {
    const options = {
      created_on: {
        type: Sequelize.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    };

    if (type >= 2) {
      options.updated_on = {
        type: Sequelize.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      };
    }

    if (type >= 3) {
      options.deleted_on = {
        type: Sequelize.DATE,
        defaultValue: null,
      };
    }
    return options;
  },
};
