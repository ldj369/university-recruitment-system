// 应聘者服务器主入口
const express = require('express');
const cors = require('cors');
const config = require('./config/applicant-config');
//引入cors
const path = require('path');
// 引入路由
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
const jobsRoutes = require('./routes/jobs');
const uploadRoutes = require('./routes/upload');
const session = require('express-session');
const PORT = config.server.port || 3001;
const app = express();
// 初始化数据库模型关联
require('./models/index');
// session 配置（用于验证码校验）
app.use(session({
  secret: 'captcha_secret_key', // 建议生产环境用更安全的 key
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 5 * 60 * 1000 } // 5分钟
}));
//搞一个公开的目录
app.use('/photos', express.static(`${config.rootdir}/photos`));
app.use(express.static(path.join(__dirname, 'dist')));
// 中间件
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// 路由配置
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/upload', uploadRoutes);
// 请求日志中间件
app.use((req, res, next) => {
  const startTime = Date.now();
  
  console.log('\n=== 请求拦截 ===');
  console.log(`时间: ${new Date().toLocaleString()}`);
  console.log(`方法: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(`IP: ${req.ip || req.connection.remoteAddress}`);
  console.log(`User-Agent: ${req.get('User-Agent')}`);
  
  // 记录请求头
  console.log('请求头:', JSON.stringify(req.headers, null, 2));
  
  // 记录请求体（排除敏感信息）
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyToLog = { ...req.body };
    // 隐藏敏感信息
    if (bodyToLog.password) bodyToLog.password = '***';
    if (bodyToLog.token) bodyToLog.token = '***';
    console.log('请求体:', JSON.stringify(bodyToLog, null, 2));
  }
  
  // 拦截响应
  const originalSend = res.send;
  res.send = function(data) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('\n=== 响应拦截 ===');
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应时间: ${duration}ms`);
    console.log(`响应头:`, JSON.stringify(res.getHeaders(), null, 2));
    
    // 记录响应体
    try {
      const responseData = typeof data === 'string' ? JSON.parse(data) : data;
      console.log('响应体:', JSON.stringify(responseData, null, 2));
    } catch (e) {
      console.log('响应体 (原始):', data);
    }
    
    console.log('================\n');
    
    // 调用原始的 send 方法
    originalSend.call(this, data);
  };
  
  next();
});
// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? error.message : '请联系管理员'
  });
});


// 根路径
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// 404 处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

app.listen(PORT, () => {
  console.log(`应聘者服务器运行在端口 ${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}`);
});
