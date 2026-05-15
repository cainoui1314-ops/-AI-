<script setup lang="ts">
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import TopBar from '@/components/TopBar/TopBar.vue'
import AIAssistant from '@/components/AIAssistant/AIAssistant.vue'
</script>

<template>
  <div class="app-shell">
    <Sidebar />
    <main class="workspace">
      <TopBar />
      <div class="page-content">
        <router-view />
      </div>
    </main>
    <AIAssistant />
  </div>
</template>
