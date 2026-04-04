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
      allowNull:true,
      validate: {
        len: [6,100]
      }
    },
    role: {
      type: DataTypes.ENUM('ADMIN','MANAGER','USER'),
      allowNull: false,
      defaultValue : 'USER'
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    tokenVersion: {
      type : DataTypes.INTEGER,
      allowNull : false,
      defaultValue: 0
    },
    googleId: {
      type : DataTypes.STRING,
      allowNull : true,
      unique:true
    },
    githubId: {
      type : DataTypes.STRING,
      allowNull : true,
      unique:true
    },
    provider : {
      type : DataTypes.STRING,
      allowNull : false,
      defaultValue  : 'LOCAL'
    }

  }, {
    sequelize,
    modelName: 'User',
  });

  //tiggers
  User.beforeCreate(async (user)=>{
    if(user.password) {
      const encryptedPassword = await bcrypt.hashSync(user.password,SALT);
      user.password  = encryptedPassword;
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const encryptedPassword = await bcrypt.hashSync(user.password, SALT);
        user.password = encryptedPassword;
    }
  });


  return User;
};