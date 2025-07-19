// 应聘者-岗位中间表模型
// 字段说明：
// id：主键，自增
// applicantId：应聘者ID，外键
// positionId：岗位ID，外键
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const ApplicantPosition = sequelize.define('ApplicantPosition', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '主键',
  },
  applicantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'applicant_id',
    comment: '应聘者ID',
  },
  positionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'position_id',
    comment: '岗位ID',
  },
}, {
  tableName: 'applicant_positions',
  timestamps: false,
});

module.exports = ApplicantPosition;
