// 简历管理路由
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const securityFilter = require('../middleware/security');
const Applicant = require('../models/applicant');

// 获取简历信息
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    
    // 根据邮箱查找应聘者信息
    const applicant = await Applicant.findOne({
      where: { email: email },
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    });
    
    if (!applicant) {
      return res.json({
        success: true,
        message: '暂无简历信息',
        data: null
      });
    }
    
    res.json({
      success: true,
      message: '获取简历信息成功',
      data: applicant
    });
    
  } catch (error) {
    console.error('获取简历信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取简历信息失败'
    });
  }
});

// 创建或更新简历
router.post('/profile', authenticateToken, async (req, res) => {
  try {
    // 从JWT Token中获取邮箱（安全，不可伪造）
    const email = req.user.email;
    
    // 使用安全过滤器清理用户输入
    let profileData = securityFilter.filterUserInput(req.body);
    profileData = securityFilter.sanitizeObject(profileData);
    
    // 强制设置邮箱为Token中的邮箱
    profileData.email = email;
    
    // 查找是否已存在该邮箱的应聘者
    let applicant = await Applicant.findOne({
      where: { email: email }
    });
    
    // 安全日志：记录操作
    console.log(`[安全日志] 用户 ${email} 尝试更新简历数据`);
    console.log(`[安全日志] 原始请求IP: ${req.ip || req.connection.remoteAddress}`);
    
    if (applicant) {
      // 更新现有记录
      await applicant.update(profileData);
      applicant = await Applicant.findOne({
        where: { email: email },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });
      
      res.json({
        success: true,
        message: '简历更新成功',
        data: applicant
      });
    } else {
      // 创建新记录
      applicant = await Applicant.create(profileData);
      const newApplicant = await Applicant.findOne({
        where: { email: email },
        attributes: { exclude: ['createdAt', 'updatedAt'] }
      });
      
      res.json({
        success: true,
        message: '简历创建成功',
        data: newApplicant
      });
    }
    
  } catch (error) {
    console.error('保存简历失败:', error);
    res.status(500).json({
      success: false,
      message: '保存简历失败',
      error: error.message
    });
  }
});

module.exports = router;
