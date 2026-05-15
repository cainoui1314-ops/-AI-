<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const features = [
  { icon: '🔥', title: '爆品追踪与归因', desc: '追踪全网爆品，分析成功因素' },
  { icon: '🕵️', title: '竞品深度分析', desc: '全方位竞品监控与策略分析' },
  { icon: '📊', title: '六维象限诊断', desc: '商品健康度多维度分析诊断' },
  { icon: '🤖', title: 'AI智能助手', desc: '7x24小时智能运营问答' },
]
</script>

<template>
  <div class="coming-soon">
    <div class="cs-icon">🌅</div>
    <h2 class="cs-title">Horizon 模式</h2>
    <p class="cs-subtitle">深度分析 · 精准洞察 · 决策支持</p>
    <p class="cs-hint">即将上线，敬请关注</p>

    <div class="cs-features">
      <div v-for="f in features" :key="f.title" class="cs-feature">
        <div class="cs-feature-icon">{{ f.icon }}</div>
        <h4>{{ f.title }}</h4>
        <p>{{ f.desc }}</p>
      </div>
    </div>

    <p class="cs-date">预计上线：2025年Q3</p>
    <el-button size="large" @click="router.push('/nova')">← 返回 Nova 模式</el-button>
  </div>
</template>

<style scoped>
.coming-soon {
  text-align: center;
  padding: 64px 32px;
  max-width: 800px;
  margin: 0 auto;
}
.cs-icon {
  font-size: 80px;
  margin-bottom: 16px;
}
.cs-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 8px;
  color: var(--ink, #111827);
}
.cs-subtitle {
  font-size: 18px;
  color: var(--blue, #246bfe);
  margin: 0 0 8px;
}
.cs-hint {
  color: var(--muted, #667085);
  font-size: 16px;
  margin: 0 0 40px;
}
.cs-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}
.cs-feature {
  background: var(--surface, #fff);
  border: 1px solid var(--line, #d9e0e8);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}
.cs-feature-icon {
  font-size: 36px;
  margin-bottom: 8px;
}
.cs-feature h4 {
  margin: 0 0 4px;
  font-size: 16px;
}
.cs-feature p {
  margin: 0;
  font-size: 13px;
  color: var(--muted, #667085);
}
.cs-date {
  color: var(--soft, #98a2b3);
  margin: 0 0 20px;
}
</style>
