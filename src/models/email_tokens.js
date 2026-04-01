'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class email_tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  email_tokens.init({
    userId: {
      type :DataTypes.INTEGER,
      allowNull:false,
    },
    token:  {
      type :DataTypes.STRING,
      allowNull:false,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    expiresAt: {
      type :DataTypes.DATE,
      allowNull:false,
    },
  }, {
    sequelize,
    modelName: 'email_tokens',
  });
  return email_tokens;
};