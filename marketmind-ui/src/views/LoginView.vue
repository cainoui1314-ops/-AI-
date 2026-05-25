<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

const tab = ref<'login' | 'register'>('login')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const businessMode = ref<'有货源' | '无货源'>('有货源')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  if (!phone.value || phone.value.length !== 11) {
    error.value = '请输入11位手机号'
    return
  }
  if (!password.value || password.value.length < 6) {
    error.value = '密码至少6位'
    return
  }
  loading.value = true
  error.value = ''
  const ok = await authStore.login(phone.value, password.value)
  loading.value = false
  if (ok) {
    router.push('/')
  } else {
    error.value = '登录失败，请重试'
  }
}

async function handleRegister() {
  if (!phone.value || phone.value.length !== 11) {
    error.value = '请输入11位手机号'
    return
  }
  if (!password.value || password.value.length < 6) {
    error.value = '密码至少6位'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = '两次密码不一致'
    return
  }
  loading.value = true
  error.value = ''
  const ok = await authStore.register(phone.value, password.value, businessMode.value)
  loading.value = false
  if (ok) {
    router.push('/settings')
  } else {
    error.value = '注册失败，请重试'
  }
}

function handleDouyinLogin() {
  window.open('#/auth/callback?mock=true', '_blank', 'width=600,height=500')
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="logo">悦己 <span class="logo-ai">AI</span></div>
        <div class="slogan">AI 驱动的电商运营平台</div>
      </div>

      <div class="tabs">
        <button class="tab-btn" :class="{ active: tab === 'login' }" @click="tab = 'login'">登录</button>
        <button class="tab-btn" :class="{ active: tab === 'register' }" @click="tab = 'register'">注册</button>
      </div>

      <div v-if="error" class="error-msg">{{ error }}</div>

      <form @submit.prevent="tab === 'login' ? handleLogin() : handleRegister()">
        <div class="field">
          <input v-model="phone" type="tel" placeholder="手机号" maxlength="11" />
        </div>
        <div class="field">
          <input v-model="password" type="password" placeholder="密码（至少6位）" />
        </div>
        <template v-if="tab === 'register'">
          <div class="field">
            <input v-model="confirmPassword" type="password" placeholder="确认密码" />
          </div>
          <div class="mode-select">
            <label class="mode-label">经营模式</label>
            <div class="mode-options">
              <button type="button" class="mode-btn" :class="{ active: businessMode === '有货源' }" @click="businessMode = '有货源'">有货源</button>
              <button type="button" class="mode-btn" :class="{ active: businessMode === '无货源' }" @click="businessMode = '无货源'">无货源</button>
            </div>
          </div>
        </template>
        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? '处理中...' : (tab === 'login' ? '登 录' : '注 册') }}
        </button>
      </form>

      <div class="divider">
        <span>或</span>
      </div>

      <button class="douyin-btn" @click="handleDouyinLogin">
        <span class="douyin-icon">🎵</span>
        抖音账号快捷登录
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-black);
}

.login-card {
  width: 380px;
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 40px 32px;
  box-shadow: var(--shadow-xl);
}

.brand {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  font-size: 28px;
  font-weight: 700;
  color: var(--brand-black);
  letter-spacing: 1px;
}

.logo-ai {
  font-size: 16px;
  font-weight: 600;
  color: var(--blue);
  vertical-align: super;
  margin-left: 2px;
}

.slogan {
  font-size: 13px;
  color: var(--muted);
  margin-top: 6px;
}

.tabs {
  display: flex;
  gap: 4px;
  background: var(--surface-2);
  border-radius: var(--radius);
  padding: 3px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
  text-align: center;
  transition: all 0.15s;
}

.tab-btn.active {
  background: var(--surface);
  color: var(--text);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.tab-btn:hover:not(.active) {
  color: var(--text);
}

.error-msg {
  background: var(--red-soft);
  color: var(--red);
  font-size: 13px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  margin-bottom: 16px;
}

.field {
  margin-bottom: 12px;
}

.field input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s;
  background: var(--surface);
  color: var(--text);
}

.field input:focus {
  border-color: var(--blue);
}

.mode-select {
  margin-bottom: 16px;
}

.mode-label {
  display: block;
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 8px;
}

.mode-options {
  display: flex;
  gap: 8px;
}

.mode-btn {
  flex: 1;
  padding: 8px;
  border-radius: var(--radius);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid var(--line);
  color: var(--muted);
  transition: all 0.15s;
}

.mode-btn.active {
  border-color: var(--blue);
  background: var(--blue-soft);
  color: var(--blue);
}

.submit-btn {
  width: 100%;
  padding: 12px;
  border-radius: var(--radius);
  background: var(--brand-black);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 4px;
  transition: opacity 0.15s;
  margin-top: 4px;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: var(--line);
}

.divider::before { left: 0; }
.divider::after { right: 0; }

.divider span {
  font-size: 12px;
  color: var(--soft);
  padding: 0 12px;
}

.douyin-btn {
  width: 100%;
  padding: 10px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  font-size: 14px;
  font-weight: 500;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.15s;
}

.douyin-btn:hover {
  border-color: var(--blue);
  color: var(--blue);
}

.douyin-icon {
  font-size: 18px;
}
</style>
