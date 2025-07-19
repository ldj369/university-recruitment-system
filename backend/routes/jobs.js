// 岗位投递路由
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Applicant = require('../models/applicant');
const Position = require('../models/position');
const ApplicantPosition = require('../models/applicantPosition');
const Department = require('../models/department');

// 获取所有开放岗位（支持分页）
router.get('/positions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, departmentId } = req.query;
    
    // 转换为数字并设置默认值
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const offset = (pageNumber - 1) * limitNumber;
    
    // 构建查询条件
    const whereClause = { isClosed: false };
    if (departmentId) {
      whereClause.departmentId = departmentId;
    }
    
    // 查询岗位数据和总数
    const { count, rows: positions } = await Position.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: limitNumber,
      offset: offset
    });
    
    // 计算分页信息
    const totalPages = Math.ceil(count / limitNumber);
    const hasNextPage = pageNumber < totalPages;
    const hasPrevPage = pageNumber > 1;
    
    res.json({
      success: true,
      message: '获取岗位列表成功',
      data: {
        positions,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalItems: count,
          itemsPerPage: limitNumber,
          hasNextPage,
          hasPrevPage
        }
      }
    });
    
  } catch (error) {
    console.error('获取岗位列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取岗位列表失败'
    });
  }
});

// 获取岗位详情
router.get('/positions/:id', authenticateToken, async (req, res) => {
  try {
    const positionId = req.params.id;
    
    const position = await Position.findOne({
      where: { id: positionId },
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        }
      ]
    });
    
    if (!position) {
      return res.status(404).json({
        success: false,
        message: '岗位不存在'
      });
    }
    
    res.json({
      success: true,
      message: '获取岗位详情成功',
      data: position
    });
    
  } catch (error) {
    console.error('获取岗位详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取岗位详情失败'
    });
  }
});

// 投递简历
router.post('/apply/:positionId', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const positionId = req.params.positionId;
    
    // 验证应聘者是否存在
    const applicant = await Applicant.findOne({
      where: { email: email }
    });
    
    if (!applicant) {
      return res.status(400).json({
        success: false,
        message: '请先完善个人简历信息'
      });
    }
    
    // 验证岗位是否存在且开放
    const position = await Position.findOne({
      where: { id: positionId, isClosed: false }
    });
    
    if (!position) {
      return res.status(400).json({
        success: false,
        message: '岗位不存在或已停止招聘'
      });
    }
    
    // 检查是否已经投递过
    const existingApplication = await ApplicantPosition.findOne({
      where: {
        applicantId: applicant.id,
        positionId: positionId
      }
    });
    
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: '您已经投递过此岗位'
      });
    }
    
    // 创建投递记录
    const application = await ApplicantPosition.create({
      applicantId: applicant.id,
      positionId: positionId
    });
    
    res.json({
      success: true,
      message: '简历投递成功',
      data: {
        applicationId: application.id,
        positionName: position.name
      }
    });
    
  } catch (error) {
    console.error('投递简历失败:', error);
    res.status(500).json({
      success: false,
      message: '投递简历失败'
    });
  }
});

// 获取已投递的岗位
router.get('/applications', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    console.log('获取投递记录，用户邮箱:', email);
    // 查找应聘者
    const applicant = await Applicant.findOne({
      where: { email: email }
    });
    
    if (!applicant) {
      return res.json({
        success: true,
        message: '暂无投递记录',
        data: []
      });
    }
    console.log('应聘者ID:', applicant.id);
    // 查找投递记录（使用新的关联）
    const applications = await ApplicantPosition.findAll({
      where: { applicantId: applicant.id },
      include: [
        {
          model: Position,
          as: 'position',
          attributes: ['id', 'name', 'content', 'requirement', 'recruitCount', 'departmentId'],
          include: [
            {
              model: Department,
              as: 'department',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      order: [['id', 'DESC']]
    });
    
    res.json({
      success: true,
      message: '获取投递记录成功',
      data: applications
    });
    
  } catch (error) {
    console.error('获取投递记录失败:', error);
    res.status(500).json({
      success: false,
      message: '获取投递记录失败'
    });
  }
});

// 撤销投递
router.delete('/applications/:applicationId', authenticateToken, async (req, res) => {
  try {
    const email = req.user.email;
    const applicationId = req.params.applicationId;
    
    // 查找应聘者
    const applicant = await Applicant.findOne({
      where: { email: email }
    });
    
    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: '应聘者信息不存在'
      });
    }
    
    // 查找投递记录
    const application = await ApplicantPosition.findOne({
      where: {
        id: applicationId,
        applicantId: applicant.id
      }
    });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: '投递记录不存在'
      });
    }
    
    // 删除投递记录
    await application.destroy();
    
    res.json({
      success: true,
      message: '投递撤销成功'
    });
    
  } catch (error) {
    console.error('撤销投递失败:', error);
    res.status(500).json({
      success: false,
      message: '撤销投递失败'
    });
  }
});

module.exports = router;
