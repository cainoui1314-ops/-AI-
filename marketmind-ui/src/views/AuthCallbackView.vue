<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth'
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMsg = ref('')

onMounted(async () => {
  const code = route.query.code as string
  const mock = route.query.mock as string

  const bindCode = mock ? 'mock-code' : code

  if (!bindCode) {
    status.value = 'error'
    errorMsg.value = '授权码缺失，请重试'
    return
  }

  try {
    await authStore.bindDouyin(bindCode)
    status.value = 'success'
    setTimeout(() => {
      window.close()
      router.push('/settings')
    }, 2000)
  } catch {
    status.value = 'error'
    errorMsg.value = '绑定失败，请重试'
  }
})
</script>

<template>
  <div class="callback-page">
    <div class="callback-card">
      <template v-if="status === 'loading'">
        <div class="spinner"></div>
        <p class="status-text">正在绑定抖音账号...</p>
      </template>
      <template v-else-if="status === 'success'">
        <div class="check-icon">✓</div>
        <p class="status-text success">绑定成功！</p>
        <p class="hint">正在跳转...</p>
      </template>
      <template v-else>
        <div class="error-icon">✕</div>
        <p class="status-text error">{{ errorMsg }}</p>
        <button class="retry-btn" @click="router.push('/settings')">返回设置</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.callback-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-black);
}

.callback-card {
  text-align: center;
  padding: 48px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid var(--brand-charcoal);
  border-top-color: var(--blue);
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.check-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #22c55e;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.error-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--red);
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.status-text {
  font-size: 16px;
  color: var(--muted);
}

.status-text.success {
  color: #22c55e;
}

.status-text.error {
  color: var(--red);
}

.hint {
  font-size: 13px;
  color: var(--soft);
  margin-top: 8px;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 24px;
  border-radius: var(--radius);
  background: var(--brand-black);
  color: #fff;
  font-size: 14px;
  transition: opacity 0.15s;
}

.retry-btn:hover {
  opacity: 0.85;
}
</style>
