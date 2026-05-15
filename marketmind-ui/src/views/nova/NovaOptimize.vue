<script setup lang="ts">
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { useOptimizeStore } from '@/store/modules/nova/optimize'
import { storeToRefs } from 'pinia'

const store = useOptimizeStore()
const { products, optimizationResults, generatedImages, selectedImages, applyProgress } = storeToRefs(store)

const hasGenerated = ref(false)
const showProgress = ref(false)
const activeProduct = ref('')

function handleGenerate() {
  store.generateOptimization()
  hasGenerated.value = true
}

function handleGenerateImages(productId: string) {
  activeProduct.value = productId
  store.generateImages(productId)
}

async function handleApply() {
  showProgress.value = true
  await store.applyOptimization()
  showProgress.value = false
  ElNotification({ title: '优化完成', message: '所有商品优化方案已应用', type: 'success' })
}
</script>

<template>
  <div class="nova-optimize">
    <div class="page-header">
      <h2>一键优化</h2>
      <p>AI智能生成标题、主图、详情优化方案</p>
    </div>

    <el-button v-if="!hasGenerated" type="primary" size="large" @click="handleGenerate">生成优化方案</el-button>

    <template v-if="hasGenerated">
      <div v-for="product in products" :key="product.id" class="optimize-group">
        <h4 class="group-title">{{ product.name }}</h4>
        <div v-if="optimizationResults[product.id]" class="compare-section">
          <el-row :gutter="24">
            <el-col :span="11">
              <div class="compare-box original">
                <div class="box-label">原始</div>
                <div class="box-item">
                  <span class="item-label">标题:</span>
                  <span>{{ optimizationResults[product.id].title.original }}</span>
                </div>
                <div class="box-item">
                  <span class="item-label">主图:</span>
                  <div class="img-placeholder">原始主图</div>
                </div>
                <div class="box-item">
                  <span class="item-label">详情:</span>
                  <span>{{ optimizationResults[product.id].detail.original }}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="2" class="compare-arrow">
              <span>→</span>
            </el-col>
            <el-col :span="11">
              <div class="compare-box optimized">
                <div class="box-label optimized-label">优化后</div>
                <div class="box-item">
                  <span class="item-label">标题:</span>
                  <span class="highlight">{{ optimizationResults[product.id].title.optimized }}</span>
                </div>
                <div class="box-item">
                  <span class="item-label">主图:</span>
                  <div class="img-placeholder optimized-img">AI优化主图</div>
                </div>
                <div class="box-item">
                  <span class="item-label">详情:</span>
                  <span class="highlight">{{ optimizationResults[product.id].detail.optimized }}</span>
                </div>
              </div>
            </el-col>
          </el-row>

          <div class="image-gen-section">
            <el-button @click="handleGenerateImages(product.id)">生成新主图</el-button>
            <el-row v-if="generatedImages[product.id]" :gutter="12" style="margin-top: 12px">
              <el-col :span="6" v-for="(img, idx) in generatedImages[product.id]" :key="idx">
                <div class="gen-image" :class="{ selected: selectedImages[product.id] === idx }" @click="store.selectImage(product.id, idx)">
                  <img :src="img" :alt="`AI生成方案${idx + 1}`" style="width: 100%; border-radius: 8px" />
                  <div v-if="selectedImages[product.id] === idx" class="image-check">✓</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>

      <div style="margin-top: 24px; text-align: center">
        <el-button type="primary" size="large" @click="handleApply">一键应用优化</el-button>
      </div>

      <el-dialog v-model="showProgress" title="正在应用优化..." width="400px" :close-on-click-modal="false" :show-close="false">
        <el-progress :percentage="applyProgress" :stroke-width="12" />
        <p style="text-align: center; margin-top: 12px; color: var(--muted)">正在批量应用优化方案...</p>
      </el-dialog>
    </template>
  </div>
</template>

<style scoped>
.nova-optimize { padding: 24px; }
.page-header { margin-bottom: 24px; }
.page-header h2 { font-size: 24px; font-weight: 700; margin: 0 0 4px; }
.page-header p { color: var(--muted); margin: 0; }
.optimize-group { margin-bottom: 32px; }
.group-title { font-size: 16px; margin: 0 0 16px; padding-bottom: 8px; border-bottom: 1px solid var(--line); }
.compare-section { margin-top: 8px; }
.compare-box {
  background: var(--surface); border: 1px solid var(--line); border-radius: 12px; padding: 16px;
}
.compare-box.optimized { border-color: #138a5b; background: #f0faf5; }
.box-label { font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 12px; text-transform: uppercase; }
.optimized-label { color: #138a5b; }
.box-item { margin-bottom: 12px; font-size: 14px; }
.item-label { font-weight: 600; margin-right: 8px; color: var(--muted); }
.highlight { color: #138a5b; font-weight: 500; }
.img-placeholder {
  width: 100%; height: 100px; background: var(--surface-2); border-radius: 8px;
  display: flex; align-items: center; justify-content: center; color: var(--soft);
}
.optimized-img { background: #e7f6ee; color: #138a5b; }
.compare-arrow {
  display: flex; align-items: center; justify-content: center; font-size: 24px; color: var(--blue);
}
.image-gen-section { margin-top: 16px; }
.gen-image {
  position: relative; cursor: pointer; border: 2px solid transparent; border-radius: 8px; overflow: hidden;
  transition: border-color 0.15s;
}
.gen-image.selected { border-color: var(--blue); }
.image-check {
  position: absolute; top: 4px; right: 4px; background: var(--blue); color: white;
  width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-size: 14px;
}
</style>
