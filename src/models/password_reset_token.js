'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class password_reset_token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  password_reset_token.init({
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false,
        references:{
          model: 'Users',
          key: 'id'
        },
      onDelete: 'CASCADE'
    },
    token: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'password_reset_token',
  });
  return password_reset_token;
};