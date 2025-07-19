// 附件模型
// 字段说明：
// id：附件ID，主键，自增
// filePath：附件路径，必填
// fileName：附件原始文件名，必填
// mimeType：附件类型
// size：附件大小
// createdAt：上传时间
// uploaderId：上传人ID
// remark：备注
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Attachment = sequelize.define('Attachment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: '附件ID',
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'file_path',
    comment: '附件路径',
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'file_name',
    comment: '附件原始文件名',
  },
  mimeType: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'mime_type',
    comment: '附件类型',
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '附件大小',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
    comment: '上传时间',
  },
  uploaderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'uploader_id',
    comment: '上传人ID',
  },
  remark: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '备注',
  },
}, {
  tableName: 'attachments',
  timestamps: false,
});

module.exports = Attachment;
