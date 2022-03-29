'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Dayoff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: 'employeeId', as: 'user' })
    }

    toJSON() {
      return { ...this.get(), id: undefined, employeeId: undefined }
    }
  }
  Dayoff.init({
    note: DataTypes.STRING,
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start: {
      allowNull: false,
      type: DataTypes.DATE
    },
    end: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    tableName: 'dayoffs',
    modelName: 'Dayoff',
  });
  return Dayoff;
};