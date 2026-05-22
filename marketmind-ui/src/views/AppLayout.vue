<script setup lang="ts">
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
import ProductPanel from '@/components/chat/ProductPanel.vue'
import { useProductStore } from '@/store/modules/product'
import { storeToRefs } from 'pinia'

const productStore = useProductStore()
const { showPanel } = storeToRefs(productStore)
</script>

<template>
  <div class="app-layout">
    <ChatSidebar />
    <div class="layout-main" :class="{ 'panel-open': showPanel }">
      <router-view />
    </div>
    <ProductPanel />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.layout-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
  transition: margin-right 0.3s ease;
}

.layout-main.panel-open {
  margin-right: 380px;
}
</style>
