const { UPDATE } = require("sequelize/lib/query-types");

// 应聘者服务器配置
const config = {
  // JWT配置
  jwt: {
    secret: 'your-secret-key-for-applicant-server', // 生产环境请使用环境变量
    expiresIn: '7d', // Token有效期
  },
  
  // 邮件配置
  email: {
    service: 'qq', // QQ邮箱服务
    auth: {
      user: '', // QQ邮箱
      pass: '' // QQ邮箱授权码
    }
  },
  
  // 服务器配置
  server: {
    port: 3001, // 应聘者服务器端口
    corsOrigin: ['http://localhost:3000', 'http://localhost:3001'] // 允许的前端域名
  },
  
  // 验证码配置
  verification: {
    codeLength: 6, // 验证码长度
    expireTime: 5 * 60 * 1000, // 5分钟过期
    maxAttempts: 3 // 最大尝试次数
  },
  //上传目录
  rootdir:'E:/data',
};

module.exports = config;
