// JWT认证中间件
const jwt = require('jsonwebtoken');
const config = require('../config/applicant-config');

// 生成Token
const generateToken = (email) => {
  return jwt.sign(
    { email: email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

// 验证Token中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未提供访问令牌'
    });
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: '令牌无效或已过期'
      });
    }
    
    req.user = user; // 将用户信息添加到请求对象
    next();
  });
};

module.exports = {
  generateToken,
  authenticateToken
};
