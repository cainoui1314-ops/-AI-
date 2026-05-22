<script setup lang="ts">
import SkillTabs from '@/components/chat/SkillTabs.vue'
import ChatMessages from '@/components/chat/ChatMessages.vue'
import GuidedOptions from '@/components/chat/GuidedOptions.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import { useChatStore } from '@/store/modules/chat'

const chatStore = useChatStore()

chatStore.ensureConversation()
</script>

<template>
  <div class="chat-main">
    <ChatMessages />
    <GuidedOptions />
    <SkillTabs />
    <ChatInput />
  </div>
</template>

<style scoped>
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  background: var(--bg);
}
</style>
