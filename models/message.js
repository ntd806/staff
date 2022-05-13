'use strict'
const { OPTIONS } = require('../const/const')

const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate ({ User }) {
      // define association here
      // userId
      this.belongsTo(User, { foreignKey: 'employeeId', as: 'user' })
    }

    toJSON () {
      return { ...this.get(), id: undefined, employeeId: undefined }
    }
  }
  Message.init({
    note: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Message must have a note' },
        notEmpty: { msg: 'note must not be empty' }
      }
    },
    preAction: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Message must have a preAction' },
        notEmpty: { msg: 'preAction must not be empty' }
      }
    },

    action: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Message must have a action' },
        notEmpty: { msg: 'action must not be empty' }
      }
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Message must have a employeeId' },
        notEmpty: { msg: 'employeeId must not be empty' }
      }
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: OPTIONS.WAIT,
      validate: {
        notNull: { msg: 'Message must have a status' },
        notEmpty: { msg: 'status must not be empty' }
      }
    }
  }, {
    sequelize,
    tableName: 'messages',
    modelName: 'Message'
  })
  return Message
}
