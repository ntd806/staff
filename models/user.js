'use strict';
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
     static associate({ Message, Dayoff }) {
      // define association here
      this.hasMany(Message, { foreignKey: 'employeeId', as: 'messages' })
      this.hasMany(Dayoff, { foreignKey: 'employeeId', as: 'dayoffs' })
    }

    toJSON() {
      return { ...this.get(), id: undefined }
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};