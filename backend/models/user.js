// 用户模型
// 字段说明：
// id：用户ID，主键，自增
// name：用户名，必填
// alias：用户别名，可选
// password：密码，必填
// departmentId：所属部门ID，必填，外键
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '用户ID',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户名',
  },
  alias: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '用户别名',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '密码',
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'department_id',
    comment: '所属部门ID',
  },
}, {
  tableName: 'users',
  timestamps: false,
});

module.exports = User;
