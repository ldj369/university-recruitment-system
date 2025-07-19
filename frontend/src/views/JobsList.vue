<template>
  <div>
    <el-card>
      <h2>可投岗位</h2>
      <div 
        ref="scrollContainer"
        class="scroll-container"
        @scroll="handleScroll"
      >
        <el-table :data="positions" style="width: 100%" v-loading="loading.positions && positions.length === 0">
          <el-table-column prop="name" label="岗位名称" />
          <el-table-column prop="department.name" label="部门" />
          <el-table-column prop="requirement" label="要求" />
          <el-table-column prop="recruitCount" label="招聘人数" width="100" align="center"/>
          <el-table-column prop="actions" label="操作" width="150" align="center">
            <template #default="{ row }">
              <el-button size="small" @click="showDetail(row.id)">详情</el-button>
              <el-button type="primary" size="small" @click="apply(row.id)" :loading="loading.apply">投递</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 加载更多提示 -->
        <div v-if="loading.loadMore" class="loading-more">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>正在加载更多...</span>
        </div>
        
        <!-- 没有更多数据提示 -->
        <div v-if="!pagination.hasNextPage && positions.length > 0" class="no-more">
          已加载全部岗位
        </div>
      </div>
      
      <div v-if="positions.length === 0 && !loading.positions" style="text-align: center; padding: 20px;">
        暂无可投岗位
      </div>
    </el-card>
    
    <!-- 岗位详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="岗位详情"
      width="600px"
      :before-close="handleDialogClose"
    >
      <div v-if="currentPosition" class="position-detail">
        <h3>{{ currentPosition.name }}</h3>
        <el-divider />
        
        <div class="detail-item">
          <label>所属部门：</label>
          <span>{{ currentPosition.department?.name || '-' }}</span>
        </div>
        
        <div class="detail-item">
          <label>招聘人数：</label>
          <span>{{ currentPosition.recruitCount }}人</span>
        </div>
        
        <div class="detail-item">
          <label>岗位要求：</label>
          <div class="requirement-detail">{{ currentPosition.requirement || '-' }}</div>
        </div>
        
        <div v-if="currentPosition.content" class="detail-item">
          <label>职位描述：</label>
          <div class="content-detail">{{ currentPosition.content }}</div>
        </div>
        
        <div class="detail-item">
          <label>发布时间：</label>
          <span>{{ formatDate(currentPosition.createdAt) }}</span>
        </div>
        
        <div class="detail-item">
          <label>更新时间：</label>
          <span>{{ formatDate(currentPosition.updatedAt) }}</span>
        </div>
      </div>
      
      <div v-else-if="loading.detail" class="loading-detail">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>加载详情中...</span>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button 
            type="primary" 
            @click="applyFromDialog" 
            :loading="loading.apply"
            v-if="currentPosition"
          >
            投递简历
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-card style="margin-top: 20px;">
      <h2>投递历史</h2>
      <el-table :data="applications" style="width: 100%" v-loading="loading.applications">
        <el-table-column prop="position.name" label="岗位名称" />
        <el-table-column prop="position.department.name" label="部门" />
        <el-table-column prop="appliedAt" label="投递时间">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status || 'pending')">
              {{ getStatusText(row.status || 'pending') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="actions" label="操作" width="100" align="center">
          <template #default="{ row }">
            <el-button 
              type="danger" 
              size="small" 
              @click="withdraw(row.id)"
              :loading="loading.withdraw"
              :disabled="row.status && row.status !== 'pending'"
            >撤销</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="applications.length === 0 && !loading.applications" style="text-align: center; padding: 20px;">
        暂无投递记录
      </div>
    </el-card>
  </div>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import { apiService } from '../api'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

export default {
  name: 'JobsList',
  components: {
    Loading
  },
  setup() {
    const positions = ref([])
    const applications = ref([])
    const scrollContainer = ref(null)
    const dialogVisible = ref(false)
    const currentPosition = ref(null)
    const pagination = ref({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPrevPage: false
    })
    const loading = reactive({
      positions: false,
      applications: false,
      apply: false,
      withdraw: false,
      loadMore: false,
      detail: false
    })

    const fetchData = async (page = 1, limit = 10, isLoadMore = false) => {
      try {
        if (isLoadMore) {
          loading.loadMore = true
        } else {
          loading.positions = true
        }
        
        if (!isLoadMore) {
          loading.applications = true
        }
        
        // 获取可投岗位
        const posRes = await apiService.jobs.getPositions({ page, limit })
        console.log('岗位数据:', posRes)
        if (posRes.success) {
          // 根据API文档，数据在data.positions中
          const newPositions = posRes.data.positions || []
          if (isLoadMore) {
            positions.value = [...positions.value, ...newPositions]
          } else {
            positions.value = newPositions
          }
          pagination.value = posRes.data.pagination || {}
        } else {
          ElMessage.error(posRes.message || '获取岗位列表失败')
        }
        
        // 获取投递历史（只在初次加载时获取）
        if (!isLoadMore) {
          const appRes = await apiService.jobs.getApplications()
          console.log('投递历史:', appRes)
          if (appRes.success) {
            // 根据API文档，投递记录结构中Position字段名为大写
            applications.value = (appRes.data || []).map(app => ({
              ...app,
              position: app.Position || app.position // 兼容处理
            }))
          } else {
            ElMessage.error(appRes.message || '获取投递历史失败')
          }
        }
      } catch (error) {
        console.error('获取数据失败:', error)
        ElMessage.error('获取数据失败，请稍后重试')
      } finally {
        if (isLoadMore) {
          loading.loadMore = false
        } else {
          loading.positions = false
        }
        
        if (!isLoadMore) {
          loading.applications = false
        }
      }
    }

    const handleScroll = (e) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target
      // 当滚动到底部附近时加载更多
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        loadMore()
      }
    }

    const loadMore = () => {
      if (loading.loadMore || !pagination.value.hasNextPage) {
        return
      }
      const nextPage = pagination.value.currentPage + 1
      fetchData(nextPage, pagination.value.itemsPerPage, true)
    }

    const showDetail = async (positionId) => {
      try {
        loading.detail = true
        dialogVisible.value = true
        currentPosition.value = null
        
        const res = await apiService.jobs.getPositionDetail(positionId)
        if (res.success) {
          currentPosition.value = res.data
        } else {
          ElMessage.error(res.message || '获取岗位详情失败')
          dialogVisible.value = false
        }
      } catch (error) {
        console.error('获取岗位详情失败:', error)
        ElMessage.error('获取岗位详情失败，请稍后重试')
        dialogVisible.value = false
      } finally {
        loading.detail = false
      }
    }

    const handleDialogClose = () => {
      dialogVisible.value = false
      currentPosition.value = null
    }

    const applyFromDialog = async () => {
      if (!currentPosition.value) return
      await apply(currentPosition.value.id)
      dialogVisible.value = false
    }

    const apply = async (id) => {
      try {
        loading.apply = true
        const res = await apiService.jobs.applyPosition(id)
        if (res.success) {
          ElMessage.success(res.message || '投递成功')
          // 重新获取投递历史
          const appRes = await apiService.jobs.getApplications()
          if (appRes.success) {
            applications.value = (appRes.data || []).map(app => ({
              ...app,
              position: app.Position || app.position
            }))
          }
        } else {
          ElMessage.error(res.message || '投递失败')
        }
      } catch (error) {
        console.error('投递失败:', error)
        ElMessage.error('投递失败，请稍后重试')
      } finally {
        loading.apply = false
      }
    }

    const withdraw = async (id) => {
      try {
        loading.withdraw = true
        const res = await apiService.jobs.withdrawApplication(id)
        if (res.success) {
          ElMessage.success(res.message || '已撤销投递')
          // 重新获取投递历史
          const appRes = await apiService.jobs.getApplications()
          if (appRes.success) {
            applications.value = (appRes.data || []).map(app => ({
              ...app,
              position: app.Position || app.position
            }))
          }
        } else {
          ElMessage.error(res.message || '撤销失败')
        }
      } catch (error) {
        console.error('撤销失败:', error)
        ElMessage.error('撤销失败，请稍后重试')
      } finally {
        loading.withdraw = false
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    const getStatusText = (status) => {
      const statusMap = {
        pending: '待处理',
        reviewing: '审核中',
        accepted: '已通过',
        rejected: '未通过',
        withdrawn: '已撤销'
      }
      return statusMap[status] || status
    }

    const getStatusType = (status) => {
      const typeMap = {
        pending: 'info',
        reviewing: 'warning',
        accepted: 'success',
        rejected: 'danger',
        withdrawn: ''
      }
      return typeMap[status] || ''
    }

    onMounted(() => fetchData())

    return {
      positions,
      applications,
      pagination,
      loading,
      scrollContainer,
      dialogVisible,
      currentPosition,
      apply,
      withdraw,
      formatDate,
      getStatusText,
      getStatusType,
      handleScroll,
      showDetail,
      handleDialogClose,
      applyFromDialog
    }
  }
}
</script>

<style scoped>
.el-card {
  margin-bottom: 20px;
}

.el-card h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 18px;
  color: #303133;
}

.el-table {
  margin-bottom: 15px;
}

.scroll-container {
  max-height: 400px;
  overflow-y: auto;
}

.loading-more {
  text-align: center;
  padding: 20px;
  color: #909399;
}

.loading-more .el-icon {
  margin-right: 5px;
}

.no-more {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 14px;
}

.position-detail {
  padding: 10px 0;
}

.detail-item {
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
}

.detail-item label {
  font-weight: 600;
  color: #303133;
  min-width: 80px;
  margin-right: 10px;
}

.detail-item span {
  color: #606266;
  flex: 1;
}

.requirement-detail,
.content-detail {
  color: #606266;
  line-height: 1.6;
  white-space: pre-wrap;
  flex: 1;
}

.loading-detail {
  text-align: center;
  padding: 40px;
  color: #909399;
}

.loading-detail .el-icon {
  margin-right: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
