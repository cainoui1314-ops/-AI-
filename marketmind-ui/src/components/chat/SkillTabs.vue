<script setup lang="ts">
import { useSkillsStore } from '@/store/modules/skills'
import { useChatStore } from '@/store/modules/chat'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const skillsStore = useSkillsStore()
const chatStore = useChatStore()
const router = useRouter()
const { skills, activeSkillId } = storeToRefs(skillsStore)
const editing = ref(false)

function selectSkill(skillId: string) {
  if (activeSkillId.value === skillId) {
    skillsStore.setActiveSkill(null)
    return
  }
  skillsStore.setActiveSkill(skillId)
  chatStore.setActiveSkill(skillId)
  chatStore.ensureConversation()

  const skill = skillsStore.getActiveSkill()
  if (skill) {
    chatStore.addAiMessage(
      skill.greeting,
      undefined,
      skill.initialOptions
    )
  }
}

function toggleEdit() {
  editing.value = !editing.value
}

function toggleSkillEnabled(skillId: string) {
  skillsStore.toggleSkill(skillId)
}
</script>

<template>
  <div class="skill-tabs">
    <div class="tabs-row">
      <div class="tabs-scroll">
        <button
          v-for="skill in skills.filter(s => s.enabled)"
          :key="skill.id"
          class="skill-tab"
          :class="{ active: activeSkillId === skill.id }"
          @click="selectSkill(skill.id)"
        >
          <span class="tab-icon">{{ skill.icon }}</span>
          <span class="tab-name">{{ skill.name }}</span>
        </button>

        <button v-if="editing" class="skill-tab add-tab" @click="router.push('/store')">
          <span class="tab-icon">+</span>
        </button>
      </div>

      <button class="edit-icon-btn" :class="{ active: editing }" @click="toggleEdit">
        <svg v-if="!editing" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </button>
    </div>

    <div v-if="editing" class="edit-panel">
      <div
        v-for="skill in skills"
        :key="skill.id"
        class="edit-item"
      >
        <span class="edit-icon">{{ skill.icon }}</span>
        <span class="edit-name">{{ skill.name }}</span>
        <label class="toggle">
          <input type="checkbox" :checked="skill.enabled" @change="toggleSkillEnabled(skill.id)" />
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skill-tabs {
  padding: 8px 24px 12px;
  background: var(--surface);
  border-top: 1px solid var(--line);
  position: relative;
}

.tabs-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tabs-scroll {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  align-items: center;
  flex: 1;
}

.skill-tab {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 16px;
  background: var(--surface-2);
  color: var(--muted);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.15s;
  border: 1px solid transparent;
}
.skill-tab:hover { color: var(--text); background: var(--surface-3); }
.skill-tab.active {
  background: var(--blue-soft);
  color: var(--blue);
  border-color: var(--blue);
}

.tab-icon { font-size: 13px; }
.tab-name { font-size: 12px; }

.add-tab {
  background: transparent;
  border: 1px dashed var(--soft);
  color: var(--soft);
}
.add-tab:hover { border-color: var(--blue); color: var(--blue); }

.edit-icon-btn {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  transition: all 0.15s;
  background: transparent;
}
.edit-icon-btn:hover {
  color: var(--text);
  background: var(--surface-2);
}
.edit-icon-btn.active {
  color: var(--blue);
  background: var(--blue-soft);
}

.edit-panel {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.edit-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
}
.edit-item:hover { background: var(--surface-2); }
.edit-icon { font-size: 14px; }
.edit-name { flex: 1; font-size: 12px; color: var(--text); }

.toggle { position: relative; width: 34px; height: 18px; display: inline-block; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider {
  position: absolute; top: 0; left: 0; right: 0; bottom: 0;
  background: var(--surface-3); border-radius: 9px; transition: 0.2s; cursor: pointer;
}
.toggle-slider::before {
  content: ''; position: absolute; width: 14px; height: 14px;
  border-radius: 50%; background: #fff; left: 2px; top: 2px; transition: 0.2s;
}
.toggle input:checked + .toggle-slider { background: var(--blue); }
.toggle input:checked + .toggle-slider::before { transform: translateX(16px); }
</style>
