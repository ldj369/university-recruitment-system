import axios from 'axios'

// 创建axios实例
const http = axios.create({
  baseURL: '', // 使用代理
  timeout: 10000
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 添加token到请求头
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => { 
    // console.log('Response:', response)
    return response.data
  },
  (error) => {
    if (error.response) {
      // const { status } = error.response
      if (status === 401 || status === 403) {
        // Token过期，清除本地存储并跳转到登录页
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// API服务
export const apiService = {
  // 认证相关
  auth: {
    // 获取图像验证码（返回图片URL，实际前端直接用src即可，不用请求）
    getCaptchaUrl: () => '/api/auth/captcha',
    // 发送邮箱验证码，增加captcha参数
    sendCode: (email, captcha) => http.post('/api/auth/send-code', { email, captcha }),
    verifyCode: (email, code) => http.post('/api/auth/verify-code', { email, code }),
    verifyToken: () => http.get('/api/auth/verify-token')
  },

  // 简历相关
  resume: {
    getProfile: () => http.get('/api/resume/profile'),
    createOrUpdateProfile: (data) => http.post('/api/resume/profile', data),
    updateField: (field, value) => http.patch(`/api/resume/profile/${field}`, { value })
  },

  // 岗位相关
  jobs: {
    // 获取岗位列表，支持分页和部门筛选
    getPositions: (params = {}) => {
      const { page = 1, limit = 10, departmentId } = params
      let url = `/api/jobs/positions?page=${page}&limit=${limit}`
      if (departmentId) {
        url += `&departmentId=${departmentId}`
      }
      return http.get(url)
    },
    
    // 获取岗位详情
    getPositionDetail: (id) => http.get(`/api/jobs/positions/${id}`),
    
    // 投递简历
    applyPosition: (positionId) => http.post(`/api/jobs/apply/${positionId}`),
    
    // 获取投递记录
    getApplications: () => http.get('/api/jobs/applications'),
    
    // 撤销投递
    withdrawApplication: (applicationId) => http.delete(`/api/jobs/applications/${applicationId}`)
  },

  // 文件上传
  upload: {
    // 头像上传
    uploadAvatar: (file) => {
      const formData = new FormData()
      formData.append('avatar', file)
      return http.post('/api/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },

    // ZIP文档上传
    uploadDocument: (file, remark = '') => {
      const formData = new FormData()
      formData.append('document', file)
      formData.append('remark', remark)
      return http.post('/api/upload/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    },

    // 获取文件列表
    getFiles: () => http.get('/api/upload/files'),

    // 下载文件
    downloadFile: (attachmentId) => {
      return http.get(`/api/upload/download/${attachmentId}`, {
        responseType: 'blob'
      })
    },

    // 删除文件
    deleteFile: (attachmentId) => {
      return http.delete(`/api/upload/file/${attachmentId}`)
    }
  }
}

export default http
