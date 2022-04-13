'use strict'

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({ Message, Department, Status}) {
      // define association here
      this.hasMany(Message, { foreignKey: 'employeeId', as: 'messages'})
      this.belongsTo(Department, { foreignKey: 'depId', as: 'department'})
      this.hasMany(Status, { foreignKey: 'employeeId', as: 'statuses'})
    }

    toJSON() {
      return { ...this.get(), id: undefined, depId: undefined }
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'User must have a email' },
        notEmpty: { msg: 'email must not be empty' },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'User must have a password' },
        notEmpty: { msg: 'password must not be empty' },
      },
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'User must have a employeeId' },
        notEmpty: { msg: 'employeeId must not be empty' },
      },
    },
    depId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'User must have a depId' },
        notEmpty: { msg: 'depId must not be empty' },
      },
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:0
    },
    is_block: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:0
    },
    is_delete: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:0
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        notEmpty: { msg: 'role must not be empty' },
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    langue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    onboard: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    quit: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  })
  return User
}