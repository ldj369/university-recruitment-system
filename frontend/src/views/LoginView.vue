<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>欢迎登录</h1>
        <p>请输入您的邮箱地址，我们将发送验证码到您的邮箱</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">邮箱地址</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="请输入您的邮箱地址"
            required
            :disabled="loading"
          />
        </div>

        <!-- 图像验证码区域 -->
        <div class="form-group">
          <label for="captcha">图像验证码</label>
          <div class="code-input-group">
            <input
              id="captcha"
              v-model="captcha"
              type="text"
              placeholder="请输入验证码"
              maxlength="6"
              required
              :disabled="loading"
              autocomplete="off"
            />
            <img
              id="captchaImg"
              :src="captchaImgSrc"
              alt="验证码"
              @click="refreshCaptcha"
              style="height: 40px; cursor: pointer; border-radius: 4px; border: 1px solid #e1e8ed;"
            />
          </div>
        </div>

        <div v-if="showCodeInput" class="form-group">
          <label for="code">验证码</label>
          <div class="code-input-group">
            <input
              id="code"
              v-model="code"
              type="text"
              placeholder="请输入6位验证码"
              maxlength="6"
              required
              :disabled="loading"
            />
            <button
              type="button"
              @click="sendCode"
              :disabled="loading || countdown > 0"
              class="resend-btn"
            >
              {{ countdown > 0 ? `${countdown}s后重发` : '重新发送' }}
            </button>
          </div>
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="login-btn"
        >
          {{ loading ? '处理中...' : (showCodeInput ? '验证登录' : '发送验证码') }}
        </button>
      </form>
      
      <div v-if="message" class="message" :class="{ 'error': isError }">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '../api/index.js'

const router = useRouter()


const email = ref('')
const code = ref('')
const captcha = ref('')
const captchaImgSrc = ref(apiService.auth.getCaptchaUrl() + '?' + Date.now())
const showCodeInput = ref(false)
const loading = ref(false)
const message = ref('')
const isError = ref(false)
const countdown = ref(0)
// 刷新验证码图片
const refreshCaptcha = () => {
  captchaImgSrc.value = apiService.auth.getCaptchaUrl() + '?' + Date.now()
}

let countdownTimer = null

const showMessage = (text, error = false) => {
  message.value = text
  isError.value = error
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

const sendCode = async () => {
  if (!email.value) {
    showMessage('请输入邮箱地址', true)
    return
  }
  if (!captcha.value) {
    showMessage('请输入图像验证码', true)
    return
  }

  loading.value = true
  try {
    // 发送邮箱验证码时带上图像验证码
    const response = await apiService.auth.sendCode(email.value, captcha.value)
    if (response.success) {
      showCodeInput.value = true
      showMessage('验证码已发送到您的邮箱，请查收')
      startCountdown()
    } else {
      // 如果后端返回验证码错误，自动刷新验证码图片
      if (response.message && response.message.includes('验证码')) {
        refreshCaptcha()
        captcha.value = ''
      }
      showMessage(response.message || '发送验证码失败', true)
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    let errorMessage = '发送验证码失败'
    if (error.response) {
      // 服务器返回了错误响应
      const status = error.response.status
      const data = error.response.data
      if (status === 500) {
        errorMessage = '服务器内部错误，请稍后重试'
      } else if (data && data.message) {
        errorMessage = data.message
        if (errorMessage.includes('验证码')) {
          refreshCaptcha()
          captcha.value = ''
        }
      } else {
        errorMessage = `请求失败 (${status})`
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      errorMessage = '无法连接到服务器，请检查网络连接'
    } else {
      // 其他错误
      errorMessage = '发送验证码失败，请重试'
    }
    showMessage(errorMessage, true)
  } finally {
    loading.value = false
  }
}

const verifyCode = async () => {
  if (!code.value) {
    showMessage('请输入验证码', true)
    return
  }

  loading.value = true
  
  try {
    const response = await apiService.auth.verifyCode(email.value, code.value)
    
    if (response.success) {
      // 保存token到localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('email', response.data.email)
      showMessage('登录成功！')
      
      // 跳转到主页
      router.push('/main')
      console.log('登录成功，token已保存')
    } else {
      showMessage(response.message || '验证码错误', true)
    }
  } catch (error) {
    console.error('验证码验证失败:', error)
    let errorMessage = '验证失败'
    
    if (error.response) {
      // 服务器返回了错误响应
      const status = error.response.status
      const data = error.response.data
      
      if (status === 500) {
        errorMessage = '服务器内部错误，请稍后重试'
      } else if (data && data.message) {
        errorMessage = data.message
      } else {
        errorMessage = `验证失败 (${status})`
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      errorMessage = '无法连接到服务器，请检查网络连接'
    } else {
      // 其他错误
      errorMessage = '验证失败，请重试'
    }
    
    showMessage(errorMessage, true)
  } finally {
    loading.value = false
  }
}

const handleLogin = async () => {
  if (!showCodeInput.value) {
    await sendCode()
  } else {
    await verifyCode()
  }
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #2c3e50;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 10px;
}

.login-header p {
  color: #7f8c8d;
  font-size: 14px;
  line-height: 1.5;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.code-input-group {
  display: flex;
  gap: 10px;
}

.code-input-group input {
  flex: 1;
}

.resend-btn {
  padding: 12px 16px;
  background: #ecf0f1;
  border: 2px solid #bdc3c7;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #2c3e50;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.resend-btn:hover:not(:disabled) {
  background: #d5dbdb;
  border-color: #95a5a6;
}

.resend-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.login-btn {
  padding: 14px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.login-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
}

.message {
  margin-top: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border-color: #f5c6cb;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
    margin: 0 10px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
  
  .code-input-group {
    flex-direction: column;
  }
  
  .resend-btn {
    white-space: normal;
  }
}
</style>
