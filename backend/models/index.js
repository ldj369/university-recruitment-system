const User = require('./user');
const Department = require('./department');
const Position = require('./position');
const Applicant = require('./applicant');
const Attachment = require('./attachment');
const ApplicantPosition = require('./applicantPosition');

// 用户-部门
User.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Department.hasMany(User, { foreignKey: 'departmentId', as: 'users' });

// 岗位-部门
Position.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });
Department.hasMany(Position, { foreignKey: 'departmentId', as: 'positions' });

// 应聘者-岗位 多对多
Applicant.belongsToMany(Position, { through: ApplicantPosition, foreignKey: 'applicantId', otherKey: 'positionId', as: 'positions' });
Position.belongsToMany(Applicant, { through: ApplicantPosition, foreignKey: 'positionId', otherKey: 'applicantId', as: 'applicants' });

// 为了支持直接查询，添加中间表的直接关联
ApplicantPosition.belongsTo(Position, { foreignKey: 'positionId', as: 'position' });
ApplicantPosition.belongsTo(Applicant, { foreignKey: 'applicantId', as: 'applicant' });
Position.hasMany(ApplicantPosition, { foreignKey: 'positionId', as: 'applications' });
Applicant.hasMany(ApplicantPosition, { foreignKey: 'applicantId', as: 'applications' });

// 其他模型关联可在此补充

module.exports = {
  User,
  Department,
  Position,
  Applicant,
  Attachment,
  ApplicantPosition,
};
