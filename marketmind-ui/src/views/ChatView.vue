<script setup lang="ts">
import SkillTabs from '@/components/chat/SkillTabs.vue'
import ChatMessages from '@/components/chat/ChatMessages.vue'
import GuidedOptions from '@/components/chat/GuidedOptions.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import ProductPanel from '@/components/chat/ProductPanel.vue'
import { useChatStore } from '@/store/modules/chat'
import { useProductStore } from '@/store/modules/product'
import { storeToRefs } from 'pinia'

const chatStore = useChatStore()
const productStore = useProductStore()
const { showPanel } = storeToRefs(productStore)

chatStore.ensureConversation()
</script>

<template>
  <div class="chat-main" :class="{ 'panel-open': showPanel }">
    <ChatMessages />
    <GuidedOptions />
    <SkillTabs />
    <ChatInput />
  </div>
  <ProductPanel />
</template>

<style scoped>
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--bg);
  transition: margin-right 0.3s ease;
}

.chat-main.panel-open {
  margin-right: 380px;
}
</style>
