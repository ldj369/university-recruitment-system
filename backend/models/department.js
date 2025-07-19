// 部门模型
// 字段说明：
// id：部门ID，主键，自增
// name：部门名称，必填
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '部门ID',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '部门名称',
  },
}, {
  tableName: 'departments',
  timestamps: false,
});

module.exports = Department;
