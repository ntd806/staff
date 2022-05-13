'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate ({ User }) {
      this.belongsTo(User, { foreignKey: 'employeeId', as: 'users' })
    }

    toJSON () {
      return { ...this.get(), id: undefined, employeeId: undefined }
    }
  }
  Status.init({
    action: DataTypes.STRING,
    total: DataTypes.FLOAT,
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Message must have a employeeId' },
        notEmpty: { msg: 'employeeId must not be empty' }
      }
    }
  }, {
    sequelize,
    tableName: 'statuses',
    modelName: 'Status'
  })
  return Status
}
