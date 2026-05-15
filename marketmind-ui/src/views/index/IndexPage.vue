<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToNova() {
  router.push('/nova')
}
</script>

<template>
  <div class="index-page">
    <div class="index-hero">
      <div class="hero-brand">AI</div>
      <h2 class="hero-title">选择适合你的商家类型，获取定制化的AI经营方案</h2>
      <p class="hero-desc">MarketMind AI 为不同类型的电商卖家提供精准的智能解决方案</p>
    </div>

    <el-row :gutter="24" class="merchant-cards">
      <el-col :span="8">
        <div class="merchant-card" @click="goToNova">
          <el-tag type="primary" size="large" effect="dark">模式A</el-tag>
          <div class="card-icon">🏪</div>
          <h3 class="card-title">AI智能铺货管家</h3>
          <p class="card-desc">一人开100家店，追求效率、规模化</p>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-label">核心诉求</span>
              <span class="stat-value">一键铺满</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">付费动机</span>
              <span class="stat-value">增收</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">核心价值</span>
              <span class="stat-value">效率规模</span>
            </div>
          </div>
          <div class="card-features">
            <el-tag v-for="f in ['一键选品', '一键货源', '一键优化', '一键维护']" :key="f" size="small" type="primary" effect="plain" class="feature-tag">{{ f }}</el-tag>
          </div>
          <el-button type="primary" size="large" class="card-btn" @click.stop="goToNova">进入 Nova 模式</el-button>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="merchant-card card-disabled">
          <el-tag type="warning" size="large" effect="dark">模式B</el-tag>
          <div class="card-icon">🧠</div>
          <h3 class="card-title">AI深度运营分析师</h3>
          <p class="card-desc">精品路线，追求利润率、品牌化</p>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-label">核心诉求</span>
              <span class="stat-value">深度洞察</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">付费动机</span>
              <span class="stat-value">提效</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">核心价值</span>
              <span class="stat-value">决策支持</span>
            </div>
          </div>
          <div class="card-features">
            <el-tag v-for="f in ['爆品追踪', '竞品分析', '六维诊断', 'AI助手']" :key="f" size="small" effect="plain" class="feature-tag">{{ f }}</el-tag>
          </div>
          <el-button size="large" disabled class="card-btn">即将上线</el-button>
        </div>
      </el-col>

      <el-col :span="8">
        <div class="merchant-card" @click="goToNova">
          <el-tag type="success" size="large" effect="dark">组合</el-tag>
          <div class="card-icon">🔄</div>
          <h3 class="card-title">组合需求</h3>
          <p class="card-desc">既有铺货需求又有精品需求，灵活组合</p>
          <div class="card-stats">
            <div class="stat-item">
              <span class="stat-label">核心诉求</span>
              <span class="stat-value">灵活组合</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">付费动机</span>
              <span class="stat-value">全链路</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">核心价值</span>
              <span class="stat-value">一站式</span>
            </div>
          </div>
          <div class="card-features">
            <el-tag v-for="f in ['铺货+分析', '自由切换', '数据打通']" :key="f" size="small" type="success" effect="plain" class="feature-tag">{{ f }}</el-tag>
          </div>
          <el-button type="primary" size="large" class="card-btn" @click.stop="goToNova">进入 Nova 模式</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.index-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 48px 32px;
}
.index-hero {
  text-align: center;
  margin-bottom: 48px;
}
.hero-brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: #101820;
  color: #fff;
  font-weight: 800;
  font-size: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
}
.hero-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--ink, #111827);
  margin: 0 0 8px;
}
.hero-desc {
  color: var(--muted, #667085);
  font-size: 16px;
  margin: 0;
}
.merchant-card {
  background: var(--surface, #fff);
  border: 1px solid var(--line, #d9e0e8);
  border-radius: 16px;
  padding: 28px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}
.merchant-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow, 0 16px 40px rgba(15,23,42,0.08));
}
.card-disabled {
  opacity: 0.65;
  cursor: default;
}
.card-disabled:hover {
  transform: none;
  box-shadow: none;
}
.card-icon {
  font-size: 48px;
  margin: 16px 0;
}
.card-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
}
.card-desc {
  color: var(--muted, #667085);
  font-size: 14px;
  margin: 0 0 16px;
}
.card-stats {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stat-label {
  font-size: 12px;
  color: var(--soft, #98a2b3);
}
.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text, #17202a);
}
.card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin-bottom: 20px;
}
.feature-tag {
  border-radius: 20px;
}
.card-btn {
  width: 100%;
}
</style>
