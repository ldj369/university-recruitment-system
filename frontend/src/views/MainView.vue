<template>
  <el-container style="height: 100vh;">
    <el-aside width="200px">
      <div class="logo-container">
        <h3>应聘系统</h3>
      </div>
      <el-menu :default-active="activeMenu" @select="handleSelect" router>
        <el-menu-item index="/main/resume">
          <el-icon><i class="el-icon-document"></i></el-icon>
          <span>我的简历</span>
        </el-menu-item>
        <el-menu-item index="/main/jobs">
          <el-icon><i class="el-icon-list"></i></el-icon>
          <span>岗位列表</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="display: flex; justify-content: flex-end; align-items: center;">
        <span style="margin-right: 15px;">{{ userEmail }}</span>
        <el-button type="danger" size="small" @click="logout">退出登录</el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'MainView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userEmail = ref('')
    
    onMounted(() => {
      userEmail.value = localStorage.getItem('email') || '用户'
    })
    
    const activeMenu = computed(() => route.path)
    
    const handleSelect = (index) => {
      router.push(index)
    }
    
    const logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      router.push('/login')
    }
    
    return {
      activeMenu,
      handleSelect,
      userEmail,
      logout
    }
  }
}
</script>

<style scoped>
.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409EFF;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}

.el-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  box-shadow: 0 1px 4px rgba(0,0,0,.1);
}

.el-aside {
  background-color: #fff;
  color: #333;
  border-right: 1px solid #eee;
}

.el-main {
  background-color: #F5F7FA;
  color: #333;
  padding: 20px;
}
</style>
