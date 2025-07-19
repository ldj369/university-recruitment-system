// 数据安全过滤器
const securityFilter = {
  // 过滤用户提交的数据，移除敏感字段
  filterUserInput: (data) => {
    const filteredData = { ...data };
    
    // 移除不允许用户直接修改的字段
    const restrictedFields = [
      'id',
      'email', 
      'createdAt',
      'updatedAt',
      'status'
    ];
    
    restrictedFields.forEach(field => {
      delete filteredData[field];
    });
    
    return filteredData;
  },
  
  // 验证邮箱格式
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // 清理HTML标签，防止XSS
  sanitizeString: (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<[^>]*>/g, '').trim();
  },
  
  // 递归清理对象中的字符串字段
  sanitizeObject: (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = securityFilter.sanitizeString(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = securityFilter.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
};

module.exports = securityFilter;
