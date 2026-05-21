# UI Audit + Global Beautify Plan

## TL;DR

> **Quick Summary**: Fix all broken/dead navigation elements across the app, then upgrade the entire UI using design patterns from Linear/Raycast/Notion design systems found in `awesome-design-md/`.
> 
> **Deliverables**:
> - All interactive elements functional with correct navigation
> - Unified app layout with persistent sidebar across all pages
> - Upgraded global.css design tokens (surface ladder, hairlines, refined typography)
> - All components upgraded to match new design system
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Wave 1 (global.css + AppLayout) → Wave 2 (sidebar + ChatView) → Wave 3 (all pages + components) → Wave 4 (build verify)

---

## Context

### Original Request
User wants: 1) Audit all features and buttons for broken navigation/jumping issues, 2) Use the awesome-design-md design systems to beautify the global UI.

### Audit Findings (CRITICAL)

| Issue | File | Severity | Fix |
|-------|------|----------|-----|
| New pages (/skills, /favorites, /store) don't share sidebar — standalone layout | 3 views + router | **CRITICAL** | Create AppLayout wrapper with persistent sidebar |
| `quota-badge` in ChatInput not clickable — dead element | ChatInput.vue:169 | **MEDIUM** | Make it clickable → router.push('/settings') |
| Guided options "前往设置" / "查看额度详情" when quota exceeded are just text strings | ChatInput.vue:70 | **MEDIUM** | Add router navigation when these specific options are clicked |
| `add-tab` (+) button in SkillTabs editing mode has no action | SkillTabs.vue:54 | **LOW** | Wire to router.push('/store') |
| `top-model` badge in ChatView top bar duplicates ChatInput model selector | ChatView.vue:28 | **LOW** | Remove the redundant element |
| All new pages lack sidebar navigation context — user gets lost | SkillsView/FavoritesView/StoreView | **CRITICAL** | Share AppLayout with ChatView |

### Design System Research

Studied 4 design systems from awesome-design-md:

**Linear** (most relevant for our dark sidebar):
- Canvas: #010102 (near-black) → 4-step surface ladder
- Accent: #5e6ad2 lavender-blue, used scarcely
- Hairline borders only, NO drop shadows
- Inter font with negative letter-spacing on display
- 8px buttons, 12px cards, 4px base spacing unit

**Raycast** (dark canvas developer tools):
- Canvas: #07080a, surface ladder for elevation
- White CTA pill, hairline borders
- Inter with ss03 feature set
- Radius: 6-16px range, most at 8-10px

**Cursor** (warm cream editorial):
- Canvas: #f7f7f4 (warm cream, not pure white)
- Single orange accent, display at weight 400
- JetBrains Mono for code, hairline-only depth

**Notion** (light workspace, relevant for content area):
- Canvas: #ffffff, surface: #f6f5f4
- Purple primary (#5645d4), pastel card tints
- 8px buttons (NOT pills), 12px cards
- Generous spacing, sober geometry

**Our hybrid approach**: Raycast-dark sidebar + Notion-light content + Linear surface ladder

---

## Work Objectives

### Core Objective
Fix all navigation issues and upgrade the entire UI to production-quality using industry-standard design patterns.

### Concrete Deliverables
- `global.css` — Upgraded design tokens
- `AppLayout.vue` — Shared layout wrapper with persistent sidebar
- `router/index.ts` — Restructured routes to use AppLayout
- `ChatSidebar.vue` — Raycast-style dark sidebar upgrade
- `ChatView.vue` — Remove ChatSidebar (moved to AppLayout), remove redundant top-model
- `ChatInput.vue` — Fix quota-badge click, fix guided option navigation
- `SkillTabs.vue` — Fix add-tab button, upgrade styling
- `SkillsView.vue` — Remove standalone header, works inside AppLayout
- `FavoritesView.vue` — Same
- `StoreView.vue` — Same
- `SettingsView.vue` — Works inside AppLayout
- All component styles upgraded to new design system

### Definition of Done
- [ ] `vite build` passes with 0 errors
- [ ] All buttons/links navigate to valid targets
- [ ] Sidebar visible on ALL pages (persistent)
- [ ] Visual consistency across all pages (same surface ladder, borders, typography)
- [ ] No dead/clickless interactive elements remain

### Must Have
- All navigation links work correctly
- Sidebar persists across all pages
- global.css has refined design tokens (surface ladder, hairlines, radius scale, shadow scale)
- All existing functionality preserved (no regressions)

### Must NOT Have (Guardrails)
- No code comments (code should be self-explanatory)
- No functionality changes — only navigation fixes and visual upgrades
- No new npm dependencies
- No breaking the existing chat flow (conversation creation, message sending, product panel)
- No removing any existing features or data

---

## Verification Strategy

- **Build verification**: `./node_modules/.bin/vite build` → 0 errors
- **Navigation verification**: Manual check of every button/link across all pages
- **Visual consistency**: Same CSS variables used across all components

---

## Execution Strategy

### Wave 1 (Foundation — MUST complete first)

```
Wave 1 (Foundation):
├── Task 1: Upgrade global.css design tokens [quick]
└── Task 2: Create AppLayout.vue + restructure router [quick]
```

### Wave 2 (Core navigation + sidebar)

```
Wave 2 (After Wave 1):
├── Task 3: Upgrade ChatSidebar.vue (Raycast dark style) [visual-engineering]
├── Task 4: Fix ChatView.vue (remove sidebar, remove top-model, integrate AppLayout) [quick]
└── Task 5: Fix ChatInput.vue navigation issues [quick]
```

### Wave 3 (Pages + components)

```
Wave 3 (After Wave 2):
├── Task 6: Upgrade SkillTabs.vue (fix add-tab, new styling) [quick]
├── Task 7: Upgrade SkillsView.vue (remove standalone header, new styling) [visual-engineering]
├── Task 8: Upgrade FavoritesView.vue (same treatment) [visual-engineering]
├── Task 9: Upgrade StoreView.vue (same treatment) [visual-engineering]
└── Task 10: Upgrade SettingsView.vue (integrate AppLayout, new styling) [visual-engineering]
```

### Wave 4 (Verification)

```
Wave 4:
└── Task 11: Build verification + final check [quick]
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1 | - | 2,3,4,5,6,7,8,9,10 |
| 2 | 1 | 4,7,8,9,10 |
| 3 | 1 | - |
| 4 | 1,2 | - |
| 5 | 1 | - |
| 6 | 1 | - |
| 7 | 1,2 | - |
| 8 | 1,2 | - |
| 9 | 1,2 | - |
| 10 | 1,2 | - |
| 11 | ALL | - |

---

## TODOs

- [ ] 1. Upgrade global.css Design Tokens

  **What to do**:
  Replace the entire `global.css` with an upgraded design token system inspired by Linear + Raycast + Notion. The new tokens MUST include:

  **Surface ladder** (4 steps above bg):
  - `--surface`: #ffffff (cards, inputs)
  - `--surface-2`: #f0f0f2 (hover states, secondary cards)
  - `--surface-3`: #e8e8eb (active states, chips)
  - `--surface-4`: #dddde1 (disabled, deepest surface)

  **Lines** (3 levels):
  - `--line`: #e5e5e7 (default borders)
  - `--line-strong`: #d1d1d5 (input borders, stronger dividers)

  **Text hierarchy** (5 levels):
  - `--ink`: #0d0d0f (primary, headlines)
  - `--text`: #1d1d1f (body)
  - `--muted`: #86868b (secondary)
  - `--soft`: #aeaeb2 (tertiary, placeholders)

  **Accent colors** (refined):
  - `--blue`: #4f6ef7, `--blue-hover`: #6b84f9, `--blue-soft`: #eef1fe, `--blue-deep`: #3d5ce0
  - Keep green/amber/red but with refined hex values
  - Add `--purple`: #7c6df0

  **Sidebar tokens** (Raycast-inspired dark):
  - `--sidebar-bg`: #1a1a2e
  - `--sidebar-surface`: #20203a (one step up)
  - `--sidebar-surface-2`: #26264a (two steps up)
  - `--sidebar-hover`: rgba(255,255,255,0.07)
  - `--sidebar-active`: rgba(255,255,255,0.12)
  - `--sidebar-line`: rgba(255,255,255,0.06)

  **Radius scale**:
  - `--radius-xs`: 4px, `--radius-sm`: 6px, `--radius`: 8px, `--radius-md`: 10px, `--radius-lg`: 12px, `--radius-xl`: 16px

  **Shadow scale**:
  - `--shadow-sm`: 0 1px 2px rgba(0,0,0,0.04)
  - `--shadow-md`: 0 2px 8px rgba(0,0,0,0.06)
  - `--shadow-lg`: 0 8px 24px rgba(0,0,0,0.08)
  - `--shadow-xl`: 0 12px 40px rgba(0,0,0,0.12)

  **Typography**:
  - `--font-sans`: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "PingFang SC", "Microsoft YaHei", sans-serif
  - `--font-mono`: "SF Mono", "JetBrains Mono", "Fira Code", monospace

  **IMPORTANT**: Remove old tokens that conflict (--radius-sm was 8px, now 6px). All components using old values must be updated in later tasks.

  **Must NOT do**: Do not add any comments to the CSS. Keep it clean.

  **References**:
  - Current file: `marketmind-ui/src/assets/styles/global.css` (45 lines)
  - Linear design tokens: `awesome-design-md/design-md/linear.app/DESIGN.md` (surface ladder, radius scale)
  - Raycast design tokens: `awesome-design-md/design-md/raycast/DESIGN.md` (sidebar dark surfaces)

  **Acceptance Criteria**:
  - [ ] All new tokens defined as above
  - [ ] No old conflicting tokens remain
  - [ ] Base styles (body, scrollbar, selection) use new tokens

  **Commit**: YES (groups with Task 2)
  - Message: `feat(design): upgrade global design tokens and create AppLayout`

---

- [ ] 2. Create AppLayout.vue + Restructure Router

  **What to do**:

  **A) Create `marketmind-ui/src/views/AppLayout.vue`**:
  A wrapper component that provides the persistent sidebar + main content area. Import ChatSidebar, render it on the left, and `<router-view />` on the right. The layout should be `display: flex; height: 100vh;`.

  ```vue
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
  .app-layout { display: flex; height: 100vh; overflow: hidden; }
  .layout-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow-y: auto; }
  </style>
  ```

  **B) Update `marketmind-ui/src/router/index.ts`**:
  Wrap ALL routes inside AppLayout as children. Remove standalone route definitions.

  ```ts
  routes: [
    {
      path: '/',
      component: () => import('@/views/AppLayout.vue'),
      children: [
        { path: '', name: 'Chat', component: () => import('@/views/ChatView.vue') },
        { path: 'settings', name: 'Settings', component: () => import('@/views/SettingsView.vue') },
        { path: 'skills', name: 'Skills', component: () => import('@/views/SkillsView.vue') },
        { path: 'favorites', name: 'Favorites', component: () => import('@/views/FavoritesView.vue') },
        { path: 'store', name: 'Store', component: () => import('@/views/StoreView.vue') },
      ],
    },
  ]
  ```

  **Must NOT do**: Do NOT change route paths or names.

  **References**:
  - Current router: `marketmind-ui/src/router/index.ts` (19 lines)
  - Current ChatView: `marketmind-ui/src/views/ChatView.vue` (has its own ChatSidebar import — will be removed in Task 4)

  **Acceptance Criteria**:
  - [ ] AppLayout.vue created with ChatSidebar + router-view
  - [ ] Router restructured with nested children
  - [ ] All 5 routes still accessible at same paths

  **Commit**: YES (groups with Task 1)

---

- [ ] 3. Upgrade ChatSidebar.vue (Raycast Dark Style)

  **What to do**:
  Upgrade the sidebar visual style using the new CSS variables. Key changes:

  1. Replace all hardcoded `rgba(255,255,255,...)` colors with `var(--sidebar-*)` tokens
  2. Use `var(--sidebar-surface)` for the quota-bar background
  3. Use `var(--sidebar-line)` for borders
  4. Upgrade `.nav-item` styling: use `var(--sidebar-surface)` for hover, `var(--sidebar-active)` for active
  5. Make `.new-chat-btn` use `var(--sidebar-surface)` background
  6. Round all items with `var(--radius-sm)` or `var(--radius)` (not hardcoded 8px)
  7. Add subtle transitions (0.15s) on all interactive elements

  Also upgrade the quota-bar: add a gradient to `.quota-fill` using `linear-gradient(90deg, var(--blue), var(--purple))`.

  **Must NOT do**: Do not change any functionality, navigation, or data logic. Only CSS changes.

  **References**:
  - Current file: `marketmind-ui/src/components/chat/ChatSidebar.vue` (183 lines)
  - New tokens: `var(--sidebar-bg)`, `var(--sidebar-surface)`, `var(--sidebar-surface-2)`, `var(--sidebar-hover)`, `var(--sidebar-active)`, `var(--sidebar-line)`
  - Raycast sidebar: `awesome-design-md/design-md/raycast/DESIGN.md` (dark surface ladder)

  **Acceptance Criteria**:
  - [ ] All hardcoded rgba colors replaced with CSS variables
  - [ ] Quota bar has gradient fill
  - [ ] Nav items use surface-2 for active state
  - [ ] All border-radius uses var(--radius-*) tokens

  **Commit**: YES
  - Message: `feat(ui): upgrade sidebar to refined dark surface style`

---

- [ ] 4. Fix ChatView.vue (Remove Sidebar + Remove Top-Model)

  **What to do**:

  1. **Remove `ChatSidebar` import and usage** — it's now in AppLayout. Remove the import line and `<ChatSidebar />` from the template.

  2. **Remove the `.chat-top-bar` div entirely** (including the redundant `.top-model` badge). The model info is already shown in ChatInput's model button.

  3. **Update the shell structure**: The ChatView should now be a pure chat area without layout concerns:
  ```vue
  <template>
    <div class="chat-main" :class="{ 'panel-open': showPanel }">
      <ChatMessages />
      <GuidedOptions />
      <SkillTabs />
      <ChatInput />
    </div>
    <ProductPanel />
  </template>
  ```

  4. **Update styles**: `.chat-main` should use `flex: 1` and `height: 100%` (it's now inside AppLayout's layout-main). Remove `.chat-shell` (the flex container was handling sidebar + main, now AppLayout does that).

  5. **Remove `activeModel` import** from settingsStore since it's no longer displayed here.

  **Must NOT do**: Do not change any chat functionality, message flow, or data logic.

  **References**:
  - Current file: `marketmind-ui/src/views/ChatView.vue` (78 lines)
  - AppLayout: `marketmind-ui/src/views/AppLayout.vue` (created in Task 2)

  **Acceptance Criteria**:
  - [ ] No ChatSidebar import/usage in ChatView
  - [ ] No chat-top-bar div
  - [ ] Chat still works (messages, guided options, skills, input)
  - [ ] Product panel still slides in correctly

  **Commit**: YES (groups with Task 3)

---

- [ ] 5. Fix ChatInput.vue Navigation Issues

  **What to do**:

  **A) Make quota-badge clickable**:
  Add `@click="router.push('/settings')"` and `cursor: pointer` style to the quota-badge span. Convert it from a `<span>` to a `<button>` or add `role="button"` + click handler.

  ```vue
  <button class="quota-badge" @click="router.push('/settings')">{{ remaining }}</button>
  ```
  Add `useRouter()` import if not already there.

  **B) Fix guided options for quota exceeded**:
  In the `sendMessage()` function, when quota is exceeded, the guided options ['前往设置', '查看额度详情'] are just strings. Modify the `selectOption()` handler in `GuidedOptions.vue` to detect these specific strings and navigate:

  ```ts
  // In GuidedOptions.vue selectOption():
  if (option === '前往设置' || option === '查看额度详情') {
    router.push('/settings')
    return
  }
  ```

  This requires adding `useRouter()` to GuidedOptions.vue.

  **Must NOT do**: Do not change the quota logic or message flow.

  **References**:
  - ChatInput.vue: lines 169 (quota-badge), lines 67-73 (quota exceeded message)
  - GuidedOptions.vue: line 22 (selectOption function)

  **Acceptance Criteria**:
  - [ ] Clicking quota-badge navigates to /settings
  - [ ] Clicking "前往设置" or "查看额度详情" guided options navigates to /settings
  - [ ] Other guided options still work as before

  **Commit**: YES
  - Message: `fix(nav): make quota badge and guided settings options clickable`

---

- [ ] 6. Upgrade SkillTabs.vue (Fix Add-Tab + New Styling)

  **What to do**:

  **A) Wire the add-tab button**:
  Change `<button v-if="editing" class="skill-tab add-tab">` to navigate to the store:
  ```vue
  <button v-if="editing" class="skill-tab add-tab" @click="router.push('/store')">
  ```
  Add `useRouter()` import.

  **B) Upgrade styling with new tokens**:
  - Replace `var(--surface-2)` → keep (matches new token)
  - Replace `var(--surface-3)` → keep (matches new token)
  - Replace `var(--blue-soft)` → keep
  - Use `var(--radius)` instead of hardcoded `16px` for skill-tab border-radius (use `var(--radius-xl)` for pill shape)
  - Use `var(--radius-sm)` for edit-icon-btn and edit-panel items
  - Add `transition: all 0.15s ease` to interactive elements

  **Must NOT do**: Do not change skill selection/toggle logic.

  **References**:
  - Current file: `marketmind-ui/src/components/chat/SkillTabs.vue` (uses old radius values)

  **Acceptance Criteria**:
  - [ ] Add-tab (+) button navigates to /store
  - [ ] All border-radius uses CSS variable tokens
  - [ ] Skill selection still works

  **Commit**: YES (groups with Task 7-10)

---

- [ ] 7. Upgrade SkillsView.vue (Remove Standalone Header, New Styling)

  **What to do**:

  **A) Simplify page header**: Since the sidebar is now persistent, the "← 返回" button and standalone page header feel redundant. Keep the header but make it lighter — remove the sticky positioning and border-bottom (the layout-main already handles scrolling). Keep the h2 and count badge.

  **B) Upgrade all component styles** to use new tokens:
  - `.skill-card`: Use `var(--surface)`, `var(--line)`, `var(--radius-lg)`
  - `.skill-card:hover`: Use `var(--shadow-md)` instead of custom box-shadow
  - `.skill-status.active`: Use `var(--green-soft)`, `var(--green)`
  - `.cat-btn`: Use `var(--radius)` (was 16px, use `var(--radius-xl)`)
  - `.usage-fill`: Use gradient `linear-gradient(90deg, var(--blue), var(--purple))`
  - `.use-btn`: Use `var(--blue)`, hover `var(--blue-hover)`

  **Must NOT do**: Do not change skill data, categories, or filtering logic.

  **References**:
  - Current file: `marketmind-ui/src/views/SkillsView.vue`
  - New tokens: `var(--surface)`, `var(--line)`, `var(--radius-lg)`, `var(--shadow-md)`

  **Acceptance Criteria**:
  - [ ] All hardcoded colors/sizes replaced with CSS variables
  - [ ] Usage fill bar has blue→purple gradient
  - [ ] Card hover uses var(--shadow-md)

  **Commit**: YES (groups with Tasks 6, 8, 9, 10)

---

- [ ] 8. Upgrade FavoritesView.vue (Same Treatment)

  **What to do**: Same pattern as Task 7 — simplify header, upgrade all styles to use new tokens.

  Key style changes:
  - `.fav-card`: `var(--surface)`, `var(--line)`, `var(--radius-lg)`
  - `.fav-card:hover`: `var(--line-strong)` border, `var(--shadow-md)`
  - `.fav-type-badge.*`: Use `var(--blue-soft)`, `var(--green-soft)`, `var(--amber-soft)`
  - `.fav-tag`: `var(--surface-2)`, `var(--muted)`
  - `.type-btn`: `var(--radius)` for pill shape
  - `.search-box`: `var(--radius)` (was 20px, use pill with `var(--radius-xl)`)

  **References**:
  - Current file: `marketmind-ui/src/views/FavoritesView.vue`

  **Acceptance Criteria**:
  - [ ] All hardcoded colors/sizes replaced with CSS variables
  - [ ] Consistent card styling with SkillsView

  **Commit**: YES (groups with Tasks 6, 7, 9, 10)

---

- [ ] 9. Upgrade StoreView.vue (Same Treatment)

  **What to do**: Same pattern — simplify header, upgrade all styles.

  Key style changes:
  - `.store-hero`: Keep gradient but use `linear-gradient(135deg, var(--blue), var(--purple))`
  - `.store-card`: `var(--surface)`, `var(--line)`, `var(--radius-lg)`
  - `.store-card:hover`: `var(--line-strong)`, `var(--shadow-lg)`
  - `.store-card.installed`: `var(--blue)` border
  - `.cat-btn`: `var(--radius)` for pill
  - `.sort-btn`: use `var(--surface-2)` background
  - `.action-btn`: `var(--blue)`, hover `var(--blue-hover)`
  - `.action-btn.installed`: `var(--surface-2)`, `var(--muted)`

  **References**:
  - Current file: `marketmind-ui/src/views/StoreView.vue`

  **Acceptance Criteria**:
  - [ ] All hardcoded colors/sizes replaced with CSS variables
  - [ ] Hero gradient uses var(--blue) → var(--purple)
  - [ ] Consistent card styling

  **Commit**: YES (groups with Tasks 6, 7, 8, 10)

---

- [ ] 10. Upgrade SettingsView.vue + ChatMessages + ProductPanel + GuidedOptions

  **What to do**: Upgrade remaining components that use old tokens:

  **SettingsView.vue**:
  - `.settings-page`: remove `min-height: 100vh` (AppLayout handles this)
  - All hardcoded colors → CSS variables
  - `.stab`: use `var(--radius-sm)`
  - `.provider-card`: use `var(--surface)`, `var(--line)`, `var(--radius-lg)`
  - `.model-option`: use `var(--radius)`
  - `.plan-card`: use `var(--surface)`, `var(--line)`, `var(--radius-lg)`
  - `.plan-card.featured`: use `var(--blue-soft)`, `var(--blue)` border

  **ChatMessages.vue**:
  - `.bubble-content.ai`: use `var(--surface)`, `var(--line)`
  - `.product-card`: use `var(--surface)`, `var(--line)`, `var(--radius-lg)`
  - `.product-card:hover`: use `var(--shadow-md)` instead of custom shadow

  **ProductPanel.vue**:
  - `.product-panel`: use `var(--shadow-xl)` instead of custom shadow
  - `.action-btn`: use `var(--blue-soft)`, `var(--blue)`

  **GuidedOptions.vue**:
  - `.option-btn`: use `var(--surface)`, `var(--line)`, `var(--radius-xl)` for pill shape

  **References**:
  - SettingsView.vue, ChatMessages.vue, ProductPanel.vue, GuidedOptions.vue

  **Acceptance Criteria**:
  - [ ] All components use new CSS variable tokens
  - [ ] No hardcoded hex colors or pixel sizes remain (except for specific SVG/complex values)
  - [ ] Consistent border-radius across all components

  **Commit**: YES (groups with Tasks 6-9)
  - Message: `feat(ui): upgrade all pages and components to refined design system`

---

- [ ] 11. Build Verification + Final Check

  **What to do**:
  1. Run `./node_modules/.bin/vite build` — must pass with 0 errors
  2. Check all routes are accessible:
     - `/` → ChatView with sidebar
     - `/settings` → SettingsView with sidebar
     - `/skills` → SkillsView with sidebar
     - `/favorites` → FavoritesView with sidebar
     - `/store` → StoreView with sidebar
  3. Verify no hardcoded CSS values remain in component files (grep for `#[0-9a-fA-F]{3,6}` and specific pixel values like `border-radius: 12px`)

  **Acceptance Criteria**:
  - [ ] `vite build` passes with 0 errors
  - [ ] All 5 routes render correctly
  - [ ] Sidebar visible on all pages
  - [ ] No dead navigation elements

  **Commit**: YES
  - Message: `chore: verify build and navigation after UI overhaul`

---

## Commit Strategy

- **Commit 1** (Tasks 1-2): `feat(design): upgrade global design tokens and create AppLayout`
- **Commit 2** (Tasks 3-4): `feat(ui): upgrade sidebar and simplify ChatView layout`
- **Commit 3** (Task 5): `fix(nav): make quota badge and guided settings options clickable`
- **Commit 4** (Tasks 6-10): `feat(ui): upgrade all pages and components to refined design system`
- **Commit 5** (Task 11): `chore: verify build and navigation after UI overhaul`

---

## Success Criteria

### Verification Commands
```bash
./node_modules/.bin/vite build  # Expected: 0 errors, ~2s build time
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] All navigation links functional
- [ ] Sidebar persistent across all pages
- [ ] Visual consistency with new design tokens
