// 邮件服务
const nodemailer = require('nodemailer');
const config = require('../config/applicant-config');

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  service: 'qq', // 使用QQ邮箱服务
  auth: {
    user: config.email.auth.user, // QQ邮箱地址
    pass: config.email.auth.pass // QQ邮箱授权码
  }
});

// 存储验证码的临时对象（生产环境建议使用Redis）
const verificationCodes = new Map();

// 生成6位数验证码
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 发送验证码邮件
const sendVerificationCode = async (email) => {
  try {
    // 生成验证码
    const code = generateVerificationCode();
    
    // 存储验证码，5分钟后过期
    verificationCodes.set(email, {
      code: code,
      expireTime: Date.now() + 5 * 60 * 1000, // 5分钟
      attempts: 0
    });
    
    // 邮件内容
    const mailOptions = {
      from: config.email.auth.user,
      to: email,
      subject: '应聘者登录验证码',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">应聘者登录验证码</h2>
          <p>您好，</p>
          <p>您的登录验证码是：</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; padding: 20px; border: 2px solid #007bff; border-radius: 8px; background-color: #f8f9fa;">${code}</span>
          </div>
          <p style="color: #666; font-size: 14px;">验证码有效期为5分钟，请及时输入。</p>
          <p style="color: #666; font-size: 14px;">为保护您的账户安全，请勿向他人透露此验证码。</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
          <p style="color: #999; font-size: 12px;">如果您没有申请登录，请忽略此邮件。</p>
        </div>
      `
    };
    
    // 发送邮件
    const info = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: info.messageId
    };
    
  } catch (error) {
    console.error('发送验证码邮件失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 验证验证码
const verifyCode = (email, inputCode) => {
  const storedData = verificationCodes.get(email);
  
  if (!storedData) {
    return {
      success: false,
      message: '验证码不存在或已过期'
    };
  }
  
  // 检查是否过期
  if (Date.now() > storedData.expireTime) {
    verificationCodes.delete(email);
    return {
      success: false,
      message: '验证码已过期'
    };
  }
  
  // 检查尝试次数
  if (storedData.attempts >= 3) {
    verificationCodes.delete(email);
    return {
      success: false,
      message: '验证码错误次数过多，请重新获取'
    };
  }
  
  // 验证验证码
  if (storedData.code !== inputCode) {
    storedData.attempts++;
    return {
      success: false,
      message: '验证码错误'
    };
  }
  
  // 验证成功，删除验证码
  verificationCodes.delete(email);
  return {
    success: true,
    message: '验证码验证成功'
  };
};

module.exports = {
  sendVerificationCode,
  verifyCode
};
