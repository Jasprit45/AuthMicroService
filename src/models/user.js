'use strict';
const {SALT} = require('../config/serverConfig');
const bcrypt = require('bcrypt');


const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Role , {
        through: 'User_Roles'
      })
    }
  }
  User.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        len: [6,100]
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  //tiggers
  User.beforeCreate((user)=>{
    const encryptedPassword = bcrypt.hashSync(user.password,SALT);
    user.password  = encryptedPassword;
  });


  return User;
};