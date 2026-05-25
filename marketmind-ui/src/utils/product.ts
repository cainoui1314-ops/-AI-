export const gradients: [string, string][] = [
  ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#a18cd1', '#fbc2eb'],
  ['#fccb90', '#d57eeb'], ['#e0c3fc', '#8ec5fc'], ['#f5576c', '#ff6a88'],
  ['#667eea', '#48c6ef'],
]

export function productGradient(name: string): [string, string] {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const idx = Math.abs(hash) % gradients.length
  return gradients[idx]
}

export function scoreColor(score: number, max: number = 100): string {
  const pct = (score / max) * 100
  if (pct >= 90) return '#22c55e'
  if (pct >= 70) return '#4f6ef7'
  if (pct >= 50) return '#f97316'
  return '#ef4444'
}
