<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSkillsStore } from '@/store/modules/skills'
import { useSettingsStore } from '@/store/modules/settings'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const router = useRouter()
const skillsStore = useSkillsStore()
const settingsStore = useSettingsStore()
const { skills } = storeToRefs(skillsStore)

const selectedCategory = ref<string>('all')
const expandedSkillId = ref<string | null>(null)

const categories = [
  { id: 'all', label: '全部' },
  { id: 'selection', label: '选品' },
  { id: 'material', label: '素材' },
  { id: 'seo', label: 'SEO' },
  { id: 'traffic', label: '运营' },
  { id: 'data', label: '数据' },
]

function allInstalled() {
  const result: { skill: any; parentId?: string; parentName?: string }[] = []
  for (const s of skills.value) {
    if (s.children && s.children.length > 0) {
      for (const child of s.children) {
        result.push({ skill: child, parentId: s.id, parentName: s.name })
      }
    } else {
      result.push({ skill: s })
    }
  }
  return result
}

function filtered() {
  const items = allInstalled()
  if (selectedCategory.value === 'all') return items
  if (selectedCategory.value === 'selection') {
    return items.filter(i => i.parentId === 'selection')
  }
  return items.filter(i => i.skill.id === selectedCategory.value)
}

function toggleExpand(skillId: string) {
  expandedSkillId.value = expandedSkillId.value === skillId ? null : skillId
}

function selectPersona(skillId: string, personaId: string) {
  skillsStore.setPersona(skillId, personaId)
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="skills-page">
    <div class="page-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>我的技能</h2>
      <span class="header-count">{{ allInstalled().length }} 个已安装</span>
    </div>

    <div class="page-body">
      <div class="category-bar">
        <button
          v-for="cat in categories"
          :key="cat.id"
          class="cat-btn"
          :class="{ active: selectedCategory === cat.id }"
          @click="selectedCategory = cat.id"
        >{{ cat.label }}</button>
      </div>

      <div class="skills-grid">
        <div
          v-for="item in filtered()"
          :key="item.skill.id"
          class="skill-card"
        >
          <div class="skill-header">
            <span class="skill-icon">{{ item.skill.icon }}</span>
            <div class="skill-info">
              <div class="skill-name">{{ item.skill.name }}</div>
              <div v-if="item.parentName" class="skill-parent">{{ item.parentName }}</div>
            </div>
            <span class="skill-status" :class="{ active: item.skill.enabled }">
              {{ item.skill.enabled ? '已启用' : '已停用' }}
            </span>
          </div>
          <div class="skill-desc">{{ item.skill.description }}</div>

          <div class="persona-section" v-if="item.skill.personas && item.skill.personas.length">
            <button class="persona-toggle" @click="toggleExpand(item.skill.id)">
              <span class="persona-label">
                {{ skillsStore.getActivePersona(item.skill.id)?.icon }} 
                {{ skillsStore.getActivePersona(item.skill.id)?.name || '选择人设' }}
              </span>
              <span class="persona-arrow" :class="{ open: expandedSkillId === item.skill.id }">▼</span>
            </button>

            <div v-if="expandedSkillId === item.skill.id" class="persona-list">
              <div
                v-for="persona in item.skill.personas"
                :key="persona.id"
                class="persona-item"
                :class="{ active: item.skill.activePersonaId === persona.id }"
                @click="selectPersona(item.skill.id, persona.id)"
              >
                <span class="persona-icon">{{ persona.icon }}</span>
                <div class="persona-info">
                  <div class="persona-name">
                    {{ persona.name }}
                    <span v-if="persona.isDefault" class="default-badge">默认</span>
                  </div>
                  <div class="persona-desc">{{ persona.description }}</div>
                </div>
                <span v-if="item.skill.activePersonaId === persona.id" class="persona-check">✓</span>
              </div>
            </div>
          </div>

          <div class="skill-actions">
            <span class="slash-cmd">{{ item.skill.slashCommand }}</span>
            <button class="use-btn" @click="router.push('/')">使用</button>
          </div>
        </div>
      </div>

      <div v-if="filtered().length === 0" class="empty-state">
        <div class="empty-icon">🎯</div>
        <div class="empty-text">该分类下暂无已安装的技能</div>
        <button class="empty-btn" @click="router.push('/store')">去广场发现更多</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skills-page { min-height: 100vh; background: var(--bg); }

.page-header {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 24px; background: var(--surface);
  border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 10;
}
.page-header h2 { font-size: 18px; font-weight: 700; margin: 0; }
.header-count { font-size: 13px; color: var(--muted); margin-left: auto; }
.back-btn { padding: 6px 12px; border-radius: 6px; font-size: 14px; color: var(--muted); }
.back-btn:hover { background: var(--surface-2); color: var(--text); }

.page-body { max-width: 900px; margin: 0 auto; padding: 24px; }

.category-bar {
  display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap;
}
.cat-btn {
  padding: 6px 16px; border-radius: 16px; font-size: 13px; font-weight: 500;
  color: var(--muted); background: var(--surface); border: 1px solid var(--line);
  transition: all 0.15s;
}
.cat-btn:hover { color: var(--text); border-color: var(--soft); }
.cat-btn.active {
  background: var(--blue); color: #fff; border-color: var(--blue);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.skill-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 20px;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.skill-card:hover {
  border-color: var(--soft);
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.skill-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.skill-icon { font-size: 24px; }
.skill-info { flex: 1; }
.skill-name { font-size: 14px; font-weight: 600; color: var(--ink); }
.skill-parent { font-size: 11px; color: var(--muted); margin-top: 1px; }
.skill-status {
  font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 500;
  background: var(--surface-2); color: var(--muted);
}
.skill-status.active { background: var(--green-soft); color: var(--green); }

.skill-desc {
  font-size: 13px; color: var(--muted); line-height: 1.5; margin-bottom: 14px;
}

.persona-section { margin-bottom: 14px; }
.persona-toggle {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; background: var(--surface-2); border-radius: var(--radius-sm);
  font-size: 13px; color: var(--text); width: 100%; transition: background 0.15s;
}
.persona-toggle:hover { background: var(--surface-3); }
.persona-label { display: flex; align-items: center; gap: 6px; font-weight: 500; }
.persona-arrow { font-size: 10px; color: var(--muted); transition: transform 0.2s; }
.persona-arrow.open { transform: rotate(180deg); }

.persona-list {
  margin-top: 6px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.persona-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; cursor: pointer; transition: background 0.1s;
  border-bottom: 1px solid var(--line);
}
.persona-item:last-child { border-bottom: none; }
.persona-item:hover { background: var(--surface-2); }
.persona-item.active { background: var(--blue-soft); }
.persona-icon { font-size: 18px; flex-shrink: 0; }
.persona-info { flex: 1; }
.persona-name { font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px; }
.default-badge {
  font-size: 10px; padding: 1px 5px; border-radius: 3px;
  background: var(--green-soft); color: var(--green); font-weight: 600;
}
.persona-desc { font-size: 11px; color: var(--muted); margin-top: 1px; }
.persona-check { color: var(--blue); font-weight: 700; font-size: 14px; }

.skill-actions {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 12px; border-top: 1px solid var(--line);
}
.slash-cmd {
  font-size: 12px; color: var(--muted); background: var(--surface-2);
  padding: 3px 8px; border-radius: 4px; font-family: monospace;
}
.use-btn {
  padding: 5px 16px; border-radius: 6px; font-size: 13px; font-weight: 500;
  background: var(--blue); color: #fff; transition: opacity 0.15s;
}
.use-btn:hover { opacity: 0.85; }

.empty-state { text-align: center; padding: 60px 16px; }
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-text { font-size: 14px; color: var(--muted); margin-bottom: 16px; }
.empty-btn {
  padding: 8px 20px; border-radius: 8px; font-size: 14px;
  background: var(--blue); color: #fff; font-weight: 500;
}
.empty-btn:hover { opacity: 0.85; }
</style>
