// 岗位模型
// 字段说明：
// id：岗位ID，主键，自增
// name：岗位名称，必填
// content：岗位内容
// requirement：岗位要求
// recruitCount：招聘人数
// departmentId：所属部门ID，外键
// isClosed：是否停止招聘
// createdAt：创建时间
const { DataTypes } = require("sequelize");
const sequelize = require("../config/config");

const Position = sequelize.define(
  "Position",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '岗位ID',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '岗位名称',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '岗位内容',
    },
    requirement: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: '岗位要求',
    },
    recruitCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "recruit_count",
      comment: '招聘人数',
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "department_id",
      comment: '所属部门ID',
    },
    isClosed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_closed",
      comment: '是否停止招聘',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
      comment: '创建时间',
    },
  },
  {
    tableName: "positions",
    timestamps: false,
  }
);

module.exports = Position;
