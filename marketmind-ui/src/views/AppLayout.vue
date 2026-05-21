<script setup lang="ts">
import ChatSidebar from '@/components/chat/ChatSidebar.vue'
</script>

<template>
  <div class="app-layout">
    <ChatSidebar />
    <div class="layout-main">
      <router-view />
    </div>
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
  overflow-y: auto;
}
</style>
