<script setup lang="ts">
</script>

<template>
  <div class="my-products-page">
    <div class="placeholder">
      <div class="placeholder-icon">📦</div>
      <h2>商品列表</h2>
      <p class="placeholder-desc">管理你的店铺商品，多维度分析，一键对比竞品</p>
      <div class="placeholder-features">
        <div class="feature-item">📊 多维度商品体检评分</div>
        <div class="feature-item">🔴 红标预警，快速发现短板</div>
        <div class="feature-item">⚡ 多商品对比报告</div>
        <div class="feature-item">🎯 批量优化建议</div>
      </div>
      <div class="coming-soon">即将上线，敬请期待</div>
    </div>
  </div>
</template>

<style scoped>
.my-products-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder {
  text-align: center;
  max-width: 400px;
}

.placeholder-icon { font-size: 56px; margin-bottom: 16px; }
.placeholder h2 { font-size: 20px; font-weight: 700; color: var(--text); margin: 0 0 8px; }
.placeholder-desc { font-size: 14px; color: var(--muted); margin: 0 0 24px; }

.placeholder-features {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}
.feature-item {
  padding: 8px 16px;
  background: var(--surface-2);
  border-radius: var(--radius);
  font-size: 13px;
  color: var(--text);
}

.coming-soon {
  font-size: 14px;
  font-weight: 600;
  color: var(--blue);
  padding: 8px 20px;
  background: var(--blue-soft);
  border-radius: 20px;
  display: inline-block;
}
</style>
