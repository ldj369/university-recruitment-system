// 文件上传路由 - 精简版
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const Attachment = require('../models/attachment');
const Applicant = require('../models/applicant');
const config = require('../config/applicant-config');
//设置绝对目录
const rootDir=config.rootdir
const router = express.Router();

// 确保上传目录存在
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// 头像上传配置
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(rootDir, '/photos');
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const ext = path.extname(file.originalname);
    const filename = `avatar_${timestamp}_${random}${ext}`;
    cb(null, filename);
  }
});

// ZIP文档上传配置
const zipStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(rootDir, '/documents');
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    const filename = `${timestamp}_${random}_${baseName}${ext}`;
    cb(null, filename);
  }
});

// 头像上传中间件
const avatarUpload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件 (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// ZIP文档上传中间件
const zipUpload = multer({
  storage: zipStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /zip/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只允许上传ZIP文件'));
    }
  }
});

// 头像上传接口
router.post('/avatar', authenticateToken, avatarUpload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的头像文件'
      });
    }

    const email = req.user.email;
    const file = req.file;
    const fileUrl = `/photos/${file.filename}`;
    console.log('上传的头像文件:', fileUrl);
    
    // 查找应聘者
    let applicant = await Applicant.findOne({
      where: { email: email }
    });

    // 如果应聘者存在，删除旧头像文件
    if (applicant && applicant.photo) {
      const oldPhotoPath = path.join(rootDir, applicant.photo);
      console.log('旧头像路径:', oldPhotoPath);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // 更新应聘者头像信息
    if (applicant) {
      await applicant.update({
        photo: fileUrl
      });
    } else {
      // 如果应聘者不存在，创建基本记录
      applicant = await Applicant.create({
        email: email,
        photo: file.filename,
        name: '',
        gender: '',
        idCard: ''
      });
    }

    res.json({
      success: true,
      message: '头像上传成功',
      data: {
        fileName: file.originalname,
        fileUrl: fileUrl,
        fileSize: file.size,
        mimeType: file.mimetype
      }
    });

  } catch (error) {
    console.error('头像上传失败:', error);
    
    // 删除已上传的文件
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: error.message || '头像上传失败'
    });
  }
});

// ZIP文档上传接口
router.post('/document', authenticateToken, zipUpload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '请选择要上传的ZIP文件'
      });
    }

    const email = req.user.email;
    const file = req.file;
    const { remark } = req.body;
    const fileUrl = `${rootDir}/documents/${file.filename}`;
    
    // 查找应聘者
    const applicant = await Applicant.findOne({
      where: { email: email }
    });

    // 创建附件记录
    const attachment = await Attachment.create({
      filePath: fileUrl,
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      uploaderId: applicant ? applicant.id : null,
      remark: remark || '个人材料'
    });


    res.json({
      success: true,
      message: 'ZIP文档上传成功',
      data: {
        attachmentId: attachment.id,
        fileName: file.originalname,
        fileUrl: fileUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
        remark: remark || '个人材料'
      }
    });

  } catch (error) {
    console.error('ZIP文档上传失败:', error);
    
    // 删除已上传的文件
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'ZIP文档上传失败'
    });
  }
});


// 下载文件接口
router.get('/download/:attachmentId', authenticateToken, async (req, res) => {
  try {
    const attachmentId = req.params.attachmentId;
    const email = req.user.email;
    
    // 查找附件记录
    const attachment = await Attachment.findByPk(attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    // 查找应聘者，验证文件所有权
    const applicant = await Applicant.findOne({
      where: { email: email }
    });

    if (!applicant || attachment.uploaderId !== applicant.id) {
      return res.status(403).json({
        success: false,
        message: '无权下载此文件'
      });
    }

    // 构建文件路径
    const filePath = attachment.filePath;
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: '文件不存在或已被删除'
      });
    }

    // 设置下载响应头
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.fileName}"`);
    res.setHeader('Content-Type', attachment.mimeType || 'application/octet-stream');
    res.setHeader('Content-Length', attachment.size);

    // 发送文件
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('文件下载失败:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: '文件下载失败'
          });
        }
      }
    });

  } catch (error) {
    console.error('下载文件失败:', error);
    res.status(500).json({
      success: false,
      message: '下载文件失败'
    });
  }
});

// 删除文件接口
router.delete('/file/:attachmentId', authenticateToken, async (req, res) => {
  try {
    const attachmentId = req.params.attachmentId;
    const email = req.user.email;
    
    // 查找附件记录
    const attachment = await Attachment.findByPk(attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: '文件不存在'
      });
    }

    // 查找应聘者，验证文件所有权
    const applicant = await Applicant.findOne({
      where: { email: email }
    });

    if (!applicant || attachment.uploaderId !== applicant.id) {
      return res.status(403).json({
        success: false,
        message: '无权删除此文件'
      });
    }

    // 构建文件路径并删除物理文件
    const filePath = attachment.filePath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 删除数据库记录
    await attachment.destroy();

    res.json({
      success: true,
      message: '文件删除成功'
    });

  } catch (error) {
    console.error('删除文件失败:', error);
    res.status(500).json({
      success: false,
      message: '删除文件失败'
    });
  }
});

module.exports = router;
