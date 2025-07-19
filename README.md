# 高校招聘系统使用说明

## 项目概述

这是一个基于 Vue 3 + Express.js 的在线招聘系统，主要面向应聘者使用。系统提供简历管理、岗位浏览、在线投递等功能。
（特别提醒。这是供应聘者使用的，管理员后端以及管理员界面共用一个数据库，有需要联系开发人员 QQ：2899520289）

## 技术架构

### 前端技术栈
- **Vue 3** - 前端框架
- **Element Plus** - UI 组件库
- **Vue Router** - 路由管理
- **Axios** - HTTP 请求库
- **Vite** - 构建工具

### 后端技术栈
- **Node.js** - 运行环境
- **Express.js** - Web 框架
- **Sequelize** - ORM 数据库操作
- **SQLite** - 数据库
- **JWT** - 身份认证
- **Nodemailer** - 邮件服务

## 系统功能

### 1. 用户认证
- 邮箱验证码登录
- 图形验证码防护
- JWT Token 身份验证
- 自动登录状态保持

### 2. 简历管理
- 个人信息填写
- 教育经历管理
- 工作经历管理
- 附件上传（照片、文档等）
- 简历信息实时保存

### 3. 岗位管理
- 岗位列表浏览
- 岗位详情查看
- 在线投递简历
- 投递状态跟踪

## 环境要求

### 开发环境
- Node.js >= 16.0.0
- npm >= 8.0.0

### 生产环境
- 支持 Node.js 的服务器
- SQLite 数据库支持
- SMTP 邮件服务

## 安装部署

### 1. 克隆项目
```bash
git clone [项目地址]
cd 招聘系统
```

### 2. 安装依赖

#### 后端依赖安装
```bash
cd backend
npm install
```

#### 前端依赖安装
```bash
cd frontend
npm install
```

### 3. 配置文件

#### 后端配置 (backend/config/applicant-config.js)
```javascript
const config = {
  // JWT配置
  jwt: {
    secret: 'your-secret-key-for-applicant-server', // 生产环境请修改
    expiresIn: '7d', // Token有效期
  },
  
  // 邮件配置
  email: {
    service: 'qq', // 邮箱服务商
    auth: {
      user: 'your-email@qq.com', // 发送邮箱
      pass: 'your-auth-code' // 邮箱授权码
    }
  },
  
  // 服务器配置
  server: {
    port: 3001, // 后端服务端口
    corsOrigin: ['http://localhost:3000', 'http://localhost:3001']
  },
  
  // 文件上传目录
  rootdir: 'E:/data', // 请修改为实际路径
};
```

**重要配置说明：**
- `email.auth.user`: 配置用于发送验证码的邮箱
- `email.auth.pass`: 邮箱的授权码（不是密码）
- `rootdir`: 文件上传存储目录，需要确保目录存在且有写权限

### 4. 数据库初始化

系统使用 SQLite 数据库，首次启动时会自动创建数据库文件和表结构。

#### 数据库文件位置
- 数据库文件：`backend/data/database.sqlite`
- 系统会自动创建 `backend/data` 目录（如果不存在）

#### 自动初始化
当首次启动后端服务时，Sequelize ORM 会自动：
1. 创建数据库文件（如果不存在）
2. 根据模型定义创建所有数据表
3. 建立表之间的关联关系

#### 使用初始化脚本
项目提供了专门的数据库初始化脚本 `backend/init-database.js`，可以自动创建表结构并添加基础数据：

```bash
# 方法1：使用npm脚本（推荐）
cd backend
npm run init-db

# 方法2：直接运行初始化脚本
cd backend
node init-database.js

# 方法3：重置数据库（删除现有数据库文件并重新初始化）
cd backend
npm run reset-db
```

**初始化脚本功能：**
- 自动创建数据库文件和表结构
- 添加5个基础部门（技术部、人事部、市场部、财务部、运营部）
- 添加7个示例岗位（前端工程师、后端工程师等）
- 创建2个管理员用户账号
- 智能检测，避免重复初始化

**初始化后的数据：**
- 部门：技术部、人事部、市场部、财务部、运营部
- 岗位：前端工程师、后端工程师、全栈工程师、人事专员、市场推广专员、财务会计、产品运营
- 管理员：admin（密码：admin123）、hr_manager（密码：hr123）

### 5. 启动服务

#### 启动后端服务
```bash
cd backend
npm start
# 或开发模式
npm run dev
```
后端服务将在 http://localhost:3001 启动

**首次启动注意事项：**
- 系统会自动创建 `backend/data` 目录
- 自动生成 `database.sqlite` 数据库文件
- 自动创建所有必要的数据表
- 控制台会显示数据库连接和表创建的日志信息

#### 启动前端服务
```bash
cd frontend
npm run dev
```
前端服务将在 http://localhost:3000 启动

## 使用指南

### 1. 用户登录
1. 访问系统首页，自动跳转到登录页面
2. 输入邮箱地址
3. 输入图形验证码
4. 点击"发送验证码"，系统会向邮箱发送6位数字验证码
5. 输入收到的邮箱验证码
6. 点击"登录"完成身份验证

### 2. 简历管理
登录成功后，系统默认进入"我的简历"页面：

#### 基本信息
- 姓名、性别、出生日期等个人基础信息
- 联系方式（电话、邮箱）
- 身份证号、政治面貌等

#### 教育经历
- 添加/编辑教育背景
- 学校、专业、学历、学位信息
- 支持多条教育经历

#### 工作经历
- 添加/编辑工作经验
- 公司、职位、工作时间、工作描述
- 支持多条工作经历

#### 附件上传
- 个人照片上传
- 简历文档、证书等附件上传
- 支持常见图片和文档格式

### 3. 岗位浏览与投递
1. 点击左侧菜单"岗位列表"
2. 浏览可投递的岗位信息
3. 查看岗位详情（职位描述、要求等）
4. 点击"投递简历"完成在线投递


### 表关系说明
- **部门 ↔ 岗位**: 一对多关系（一个部门可以有多个岗位）
- **部门 ↔ 用户**: 一对多关系（一个部门可以有多个管理员用户）
- **应聘者 ↔ 岗位**: 多对多关系（通过 applicant_positions 中间表）
- **应聘者 ↔ 附件**: 一对多关系（一个应聘者可以上传多个附件）

## API 接口

### 认证相关
- `GET /api/auth/captcha` - 获取图形验证码
- `POST /api/auth/send-code` - 发送邮箱验证码
- `POST /api/auth/verify-code` - 验证登录
- `GET /api/auth/verify-token` - 验证Token状态

### 简历相关
- `GET /api/resume/profile` - 获取简历信息
- `POST /api/resume/profile` - 创建/更新简历
- `PATCH /api/resume/profile/:field` - 更新特定字段

### 岗位相关
- `GET /api/jobs/positions` - 获取岗位列表
- `GET /api/jobs/positions/:id` - 获取岗位详情
- `POST /api/jobs/apply` - 投递简历

### 文件上传
- `POST /api/upload/photo` - 上传照片
- `POST /api/upload/attachment` - 上传附件

## 常见问题

### 1. 邮件发送失败
- 检查邮箱配置是否正确
- 确认邮箱授权码（不是登录密码）
- 检查网络连接和邮箱服务商设置

### 2. 文件上传失败
- 检查上传目录权限
- 确认文件大小不超过限制（10MB）
- 检查文件格式是否支持

### 3. 登录状态丢失
- 检查Token是否过期（默认7天）
- 清除浏览器缓存重新登录
- 检查后端服务是否正常运行

### 4. 数据库相关问题
- **数据库文件无法创建**: 检查 `backend/data` 目录权限
- **表结构错误**: 删除 `database.sqlite` 文件重新启动服务
- **数据丢失**: 检查数据库文件是否存在于 `backend/data/database.sqlite`
- **连接失败**: 确认 SQLite 依赖已正确安装

### 5. 数据库初始化详细说明

#### 初始化脚本位置
- 文件路径：`backend/init-database.js`
- 这是一个完整的数据库初始化脚本，包含表创建和基础数据添加

#### 可用的初始化命令
```bash
# 初始化数据库（保留现有数据）
npm run init-db

# 重置数据库（删除现有数据库文件，重新创建）
npm run reset-db
```

```

## 开发说明

### 项目结构
```
├── backend/                 # 后端代码
│   ├── config/             # 配置文件
│   ├── models/             # 数据模型
│   ├── routes/             # 路由定义
│   ├── services/           # 业务服务
│   ├── middleware/         # 中间件
│   └── applicant-server.js # 服务入口
├── frontend/               # 前端代码
│   ├── src/
│   │   ├── views/          # 页面组件
│   │   ├── router/         # 路由配置
│   │   ├── api/            # API 接口
│   │   └── assets/         # 静态资源
│   └── public/             # 公共文件
└── 使用说明.md             # 本文档
```

### 开发调试
- 后端日志：控制台输出详细的请求日志
- 前端调试：使用浏览器开发者工具
- 数据库：SQLite 文件位于 backend/data/ 目录

## 联系支持

如有技术问题或使用疑问，请联系开发者。qq：2899520289
