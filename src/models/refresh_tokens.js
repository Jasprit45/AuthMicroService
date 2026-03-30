'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Refresh_tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Refresh_tokens.init({
    userId:{
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
          model: 'users',   // users table
          key: 'id'
      },
      onDelete: 'CASCADE'
    },
    token: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    expiresAt:{
      type: DataTypes.DATE,
      allowNull:false
    },
    sessionId: {
      type : DataTypes.UUID,
      allowNull : false,
      unique:true
    }
  }, {
    sequelize,
    modelName: 'Refresh_tokens',
  });
  return Refresh_tokens;
};