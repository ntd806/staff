'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate ({ User }) {
      this.hasMany(User, { foreignKey: 'depId', as: 'users' })
    }

    toJSON () {
      return { ...this.get(), id: undefined }
    }
  }
  Department.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'departments',
    modelName: 'Department'
  })
  return Department
}
