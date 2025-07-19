// 应聘者模型
// 字段说明：
// id：应聘者ID，主键，自增
// name：姓名，必填
// gender：性别，必填
// birthDate：出生日期
// birthPlace：出生地
// maritalStatus：婚姻状况
// idCard：身份证号，必填
// politicalStatus：政治面貌
// professionalTitle：专业技术职务
// highestDegree：最高学位
// highestEducation：最高学历
// phone：联系电话
// email：邮箱
// photo：照片文件名
// familyMembers：家庭成员信息（JSON）
// educationHistory：教育经历（JSON）
// workHistory：工作经历（JSON）
// academicAchievements：学术成果（JSON）
// attachments：附件信息（JSON）
// status：状态（active/inactive）
// createdAt：创建时间
// updatedAt：更新时间
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Applicant = sequelize.define('Applicant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '应聘者ID',
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '姓名',
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '性别',
  },
  birthDate: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'birth_date',
    comment: '出生日期',
  },
  birthPlace: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'birth_place',
    comment: '出生地',
  },
  maritalStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'marital_status',
    comment: '婚姻状况',
  },
  idCard: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'id_card',
    comment: '身份证号',
  },
  politicalStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'political_status',
    comment: '政治面貌',
  },
  professionalTitle: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'professional_title',
    comment: '专业技术职务',
  },
  highestDegree: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'highest_degree',
    comment: '最高学位',
  },
  highestEducation: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'highest_education',
    comment: '最高学历',
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '联系电话',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '邮箱',
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '照片文件名',
  },
  
  // JSON 存储字段
  familyMembers: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'family_members',
    comment: '家庭成员信息（JSON）',
    defaultValue: [],
  },
  educationHistory: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'education_history',
    comment: '教育经历（JSON）',
    defaultValue: {},
  },
  workHistory: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'work_history',
    comment: '工作经历（JSON）',
    defaultValue: [],
  },
  academicAchievements: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'academic_achievements',
    comment: '学术成果（JSON）',
    defaultValue: {},
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: '附件信息（JSON）',
    defaultValue: {},
  },
  
  // 系统字段
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
    comment: '状态（active/inactive）',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
    comment: '创建时间',
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
    comment: '更新时间',
  },
}, {
  tableName: 'applicants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Applicant;
