// 数据库初始化脚本
const sequelize = require('./config/config');
const { Department, Position, User, Applicant, Attachment, ApplicantPosition } = require('./models/index');

async function initDatabase() {
  try {
    console.log('开始初始化数据库...');
    
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('✓ 数据库连接成功');
    
    // 同步所有模型（创建表）
    await sequelize.sync({ force: false }); // force: true 会删除现有表重新创建
    console.log('✓ 数据库表同步成功');
    
    // 检查是否已有数据，避免重复初始化
    const departmentCount = await Department.count();
    if (departmentCount > 0) {
      console.log('✓ 数据库已有数据，跳过初始化');
      return;
    }
    
    console.log('开始添加初始数据...');
    
    // 创建部门
    const departments = await Department.bulkCreate([
      { name: '技术部' },
      { name: '人事部' },
      { name: '市场部' },
      { name: '财务部' },
      { name: '运营部' }
    ]);
    console.log('✓ 部门数据创建成功');
    
    // 创建岗位
    const positions = await Position.bulkCreate([
      {
        name: '前端工程师',
        content: '负责前端页面开发和维护，使用Vue.js、React等现代前端框架开发用户界面',
        requirement: '1. 熟悉Vue.js、React等前端框架\n2. 掌握HTML、CSS、JavaScript基础\n3. 了解ES6+语法\n4. 有移动端开发经验优先',
        recruitCount: 3,
        departmentId: departments[0].id, // 技术部
        isClosed: false
      },
      {
        name: '后端工程师',
        content: '负责后端API开发和数据库设计，构建高性能、可扩展的服务端应用',
        requirement: '1. 熟悉Node.js、Python、Java等后端技术\n2. 掌握MySQL、MongoDB等数据库\n3. 了解RESTful API设计\n4. 有微服务架构经验优先',
        recruitCount: 2,
        departmentId: departments[0].id, // 技术部
        isClosed: false
      },
      {
        name: '全栈工程师',
        content: '负责前后端全栈开发，能够独立完成完整的Web应用开发',
        requirement: '1. 同时掌握前端和后端技术\n2. 有完整项目开发经验\n3. 熟悉DevOps流程\n4. 学习能力强，适应快速迭代',
        recruitCount: 1,
        departmentId: departments[0].id, // 技术部
        isClosed: false
      },
      {
        name: '人事专员',
        content: '负责公司人力资源管理，包括招聘、培训、绩效考核等工作',
        requirement: '1. 人力资源相关专业\n2. 有招聘经验优先\n3. 沟通能力强\n4. 熟悉劳动法规',
        recruitCount: 1,
        departmentId: departments[1].id, // 人事部
        isClosed: false
      },
      {
        name: '市场推广专员',
        content: '负责公司产品市场推广，制定和执行营销策略',
        requirement: '1. 市场营销相关专业\n2. 有数字营销经验\n3. 熟悉社交媒体运营\n4. 数据分析能力强',
        recruitCount: 2,
        departmentId: departments[2].id, // 市场部
        isClosed: false
      },
      {
        name: '财务会计',
        content: '负责公司日常财务核算和报表编制工作',
        requirement: '1. 会计相关专业\n2. 有会计从业资格证\n3. 熟悉财务软件操作\n4. 工作细心负责',
        recruitCount: 1,
        departmentId: departments[3].id, // 财务部
        isClosed: false
      },
      {
        name: '产品运营',
        content: '负责产品运营策划，用户增长和活跃度提升',
        requirement: '1. 有产品运营经验\n2. 数据分析能力强\n3. 用户思维敏锐\n4. 有创新意识',
        recruitCount: 1,
        departmentId: departments[4].id, // 运营部
        isClosed: false
      }
    ]);
    console.log('✓ 岗位数据创建成功');
    
    // 创建管理员用户（可选）
    const adminUsers = await User.bulkCreate([
      {
        name: 'admin',
        alias: '系统管理员',
        password: 'admin123', // 实际使用时应该加密
        departmentId: departments[1].id // 人事部
      },
      {
        name: 'hr_manager',
        alias: '人事经理',
        password: 'hr123',
        departmentId: departments[1].id // 人事部
      }
    ]);
    console.log('✓ 管理员用户创建成功');
    
    console.log('\n=== 初始化完成 ===');
    console.log(`创建部门: ${departments.length} 个`);
    console.log(`创建岗位: ${positions.length} 个`);
    console.log(`创建用户: ${adminUsers.length} 个`);
    console.log('数据库初始化成功！');
    
  } catch (error) {
    console.error('数据库初始化失败:', error);
    throw error;
  }
}

// 如果直接运行此文件，则执行初始化
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('初始化脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('初始化脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;
