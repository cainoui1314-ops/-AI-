<script setup lang="ts">
import { ref } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import { useMaintainStore } from '@/store/modules/nova/maintain'
import { storeToRefs } from 'pinia'

const store = useMaintainStore()
const { maintenanceItems, executeProgress, schedule, selectedCount, totalExpectedRevenue } = storeToRefs(store)

const hasDiagnosed = ref(false)
const showProgress = ref(false)

function priorityType(p: string) {
  const map: Record<string, string> = { high: 'danger', medium: 'warning', low: 'info' }
  return map[p] || 'info'
}

function priorityLabel(p: string) {
  const map: Record<string, string> = { high: '高', medium: '中', low: '低' }
  return map[p] || p
}

function handleDiagnose() {
  store.diagnose()
  hasDiagnosed.value = true
}

async function handleExecute() {
  try {
    await ElMessageBox.confirm(`确定执行 ${selectedCount.value} 项维护任务？预计增收 ¥${totalExpectedRevenue.value}`, '确认执行')
    showProgress.value = true
    await store.executeMaintenance()
    showProgress.value = false
    ElNotification({ title: '维护完成', message: '所有维护任务已执行', type: 'success' })
  } catch { /* cancelled */ }
}
</script>

<template>
  <div class="nova-maintain">
    <div class="page-header">
      <h2>一键全店维护</h2>
      <p>自动巡检全店商品，一键批量优化</p>
    </div>

    <div v-if="!hasDiagnosed" class="diagnose-section">
      <div class="diagnose-card">
        <div class="diagnose-icon">🔍</div>
        <h3>全店智能诊断</h3>
        <p>AI将自动扫描全店商品，识别标题、价格、投流等优化机会</p>
        <el-button type="primary" size="large" @click="handleDiagnose">开始诊断</el-button>
      </div>
    </div>

    <template v-else>
      <div class="expected-banner">
        <div class="banner-left">
          <span class="banner-label">预计增收</span>
          <span class="banner-value">¥{{ totalExpectedRevenue.toLocaleString() }}</span>
        </div>
        <el-tag type="success" effect="dark" size="large">+15%</el-tag>
      </div>

      <div class="batch-bar">
        <span class="batch-info">已选 {{ selectedCount }}/{{ maintenanceItems.length }} 项</span>
        <el-button @click="store.selectAll()">全选</el-button>
        <el-dropdown @command="store.selectByPriority">
          <el-button>按优先级全选</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="high">全选高优先级</el-dropdown-item>
              <el-dropdown-item command="medium">全选中优先级</el-dropdown-item>
              <el-dropdown-item command="low">全选低优先级</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button type="primary" :disabled="selectedCount === 0" @click="handleExecute">一键执行</el-button>
      </div>

      <el-table :data="maintenanceItems" style="width: 100%" stripe>
        <el-table-column type="selection" width="50">
          <template #default="{ row }">
            <el-checkbox :model-value="row.selected" @change="store.toggleItem(row.id)" />
          </template>
        </el-table-column>
        <el-table-column label="优先级" width="80">
          <template #default="{ row }">
            <el-tag :type="priorityType(row.priority)" size="small">{{ priorityLabel(row.priority) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="商品" min-width="140" />
        <el-table-column prop="typeName" label="类型" width="100" />
        <el-table-column label="预计增收" width="100">
          <template #default="{ row }">
            <span style="color: #138a5b; font-weight: 600">+¥{{ row.expectedRevenue }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="200" />
      </el-table>

      <div class="schedule-section">
        <h3 class="section-title">定期维护计划</h3>
        <div class="schedule-form">
          <el-switch v-model="schedule.enabled" active-text="开启定期维护" />
          <template v-if="schedule.enabled">
            <el-select v-model="schedule.frequency" style="width: 120px">
              <el-option label="每日" value="daily" />
              <el-option label="每周" value="weekly" />
              <el-option label="每月" value="monthly" />
            </el-select>
            <el-time-picker v-model="schedule.time" format="HH:mm" placeholder="执行时间" style="width: 150px" />
            <el-checkbox-group v-model="schedule.contents">
              <el-checkbox label="title">标题优化</el-checkbox>
              <el-checkbox label="price">价格调整</el-checkbox>
              <el-checkbox label="ad">投流优化</el-checkbox>
            </el-checkbox-group>
          </template>
          <el-button type="primary" v-if="schedule.enabled">保存计划</el-button>
        </div>
      </div>

      <el-dialog v-model="showProgress" title="正在执行维护..." width="400px" :close-on-click-modal="false" :show-close="false">
        <el-progress :percentage="executeProgress" :stroke-width="12" />
        <p style="text-align: center; margin-top: 12px; color: var(--muted)">正在批量执行维护任务...</p>
      </el-dialog>
    </template>
  </div>
</template>

<style scoped>
.nova-maintain { padding: 24px; }
.page-header { margin-bottom: 24px; }
.page-header h2 { font-size: 24px; font-weight: 700; margin: 0 0 4px; }
.page-header p { color: var(--muted); margin: 0; }
.diagnose-section { display: flex; justify-content: center; padding: 64px 0; }
.diagnose-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: 16px;
  padding: 48px; text-align: center; max-width: 400px;
}
.diagnose-icon { font-size: 56px; margin-bottom: 16px; }
.diagnose-card h3 { margin: 0 0 8px; }
.diagnose-card p { color: var(--muted); margin: 0 0 24px; }
.expected-banner {
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(135deg, #e7f6ee, #e8f0ff); border-radius: 12px;
  padding: 20px 24px; margin-bottom: 20px;
}
.banner-label { font-size: 14px; color: var(--muted); }
.banner-value { font-size: 32px; font-weight: 700; color: #138a5b; }
.batch-bar {
  display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
  padding: 12px 16px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px;
}
.batch-info { font-weight: 600; margin-right: auto; }
.section-title { font-size: 18px; font-weight: 600; margin: 32px 0 16px; }
.schedule-section { margin-top: 32px; }
.schedule-form { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
</style>
