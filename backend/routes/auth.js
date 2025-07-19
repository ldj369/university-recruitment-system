// 应聘者认证路由
const express = require('express');
const router = express.Router();
const { sendVerificationCode, verifyCode } = require('../services/email');
const { authenticateToken, generateToken } = require('../middleware/auth');
const svgCaptcha = require('svg-captcha');

// 生成图片验证码接口
router.get('/captcha', (req, res) => {
  const captcha = svgCaptcha.create({
    size: 4, // 验证码长度
    noise: 2, // 干扰线条数
    color: true,
    background: '#cc9966'
  });
  // 存入 session，后续校验
  req.session.captcha = captcha.text.toLowerCase();
  res.type('svg');
  res.status(200).send(captcha.data);
});

// 发送邮箱验证码前先校验图片验证码
router.post('/send-code', async (req, res) => {
  try {
    const { email, captcha } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱地址是必填项'
      });
    }
    if (!captcha) {
      return res.status(400).json({
        success: false,
        message: '图片验证码是必填项'
      });
    }
    // 校验图片验证码
    if (!req.session.captcha || captcha.toLowerCase() !== req.session.captcha) {
      return res.status(400).json({
        success: false,
        message: '图片验证码错误或已过期'
      });
    }
    // 简单的邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确'
      });
    }
    // 发送验证码
    const result = await sendVerificationCode(email);
    if (result.success) {
      res.json({
        success: true,
        message: '验证码已发送到您的邮箱，请查收',
        data: {
          messageId: result.messageId
        }
      });
    } else {
      res.status(500).json({
        success: false,
        message: '发送验证码失败，请稍后重试',
        error: result.error
      });
    }
  } catch (error) {
    console.error('发送验证码失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 验证验证码并登录
router.post('/verify-code', (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: '邮箱和验证码都是必填项'
      });
    }
    
    // 验证验证码
    const result = verifyCode(email, code);
    
    if (result.success) {
      // 生成JWT Token
      const token = generateToken(email);
      
      res.json({
        success: true,
        message: '登录成功',
        data: {
          token: token,
          email: email
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }
    
  } catch (error) {
    console.error('验证失败:', error);
    res.status(500).json({
      success: false,
      message: '验证失败'
    });
  }
});

// 验证Token状态
router.get('/verify-token', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: '令牌有效',
    data: {
      email: req.user.email
    }
  });
});

module.exports = router;
