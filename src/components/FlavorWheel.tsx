import { useMemo, useState } from 'react'
import type { FlavorProfile } from '../types'
import { flavorCategories, flavorNotes, noteById, categoryById } from '../data/flavors'

const rank = (i: string) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)
const INT_LABEL: Record<string, string> = { strong: '強い', normal: '普通', weak: '弱い', unknown: '不明' }

function arcPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  const [x0, y0] = p(r1, a0), [x1, y1] = p(r1, a1), [x2, y2] = p(r0, a1), [x3, y3] = p(r0, a0)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M ${x0} ${y0} A ${r1} ${r1} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${r0} ${r0} 0 ${large} 0 ${x3} ${y3} Z`
}

export default function FlavorWheel({ profile, onSelectNote }: { profile: FlavorProfile; onSelectNote: (noteId: string) => void }) {
  const known = profile.aromas.filter((a) => rank(a.intensity) > 0 && noteById(a.noteId))
  const [cat, setCat] = useState<string | null>(null)
  const cats = useMemo(() => {
    const m = new Map<string, number>()
    for (const a of known) { const c = noteById(a.noteId)!.categoryId; m.set(c, (m.get(c) ?? 0) + rank(a.intensity)) }
    return flavorCategories.filter((c) => m.has(c.id)).map((c) => ({ ...c, weight: m.get(c.id)! }))
  }, [known])

  if (known.length === 0) return <p className="unknown-box">香味データが不足しているため、ホイールを表示できません（不明）。</p>

  const size = 300, cx = size / 2, cy = size / 2
  const segments: { id: string; label: string; color: string; weight: number; kind: 'cat' | 'note'; sub?: string }[] = []
  if (!cat) {
    for (const c of cats) segments.push({ id: c.id, label: c.name, color: c.color, weight: c.weight, kind: 'cat' })
  } else {
    for (const n of flavorNotes.filter((n) => n.categoryId === cat)) {
      const e = known.find((a) => a.noteId === n.id)
      if (e) segments.push({ id: n.id, label: n.name, color: categoryById(cat)!.color, weight: rank(e.intensity), kind: 'note', sub: INT_LABEL[e.intensity] })
    }
  }
  const total = segments.reduce((s, x) => s + x.weight, 0) || 1
  let angle = -Math.PI / 2
  const drawn = segments.map((s) => {
    const a0 = angle; const a1 = angle + (s.weight / total) * Math.PI * 2; angle = a1
    const mid = (a0 + a1) / 2
    return { ...s, a0, a1, lx: cx + 108 * Math.cos(mid), ly: cy + 108 * Math.sin(mid) }
  })

  return (
    <div className="wheel-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} className="wheel" role="group" aria-label="フレーバーホイール">
        {drawn.map((s) => (
          <g key={s.id} onClick={() => (s.kind === 'cat' ? setCat(s.id) : onSelectNote(s.id))} className="wheel-seg" tabIndex={0} role="button"
            aria-label={s.kind === 'cat' ? `${s.label}を開く` : `${s.label}（${s.sub}）の説明を見る`}
            onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); s.kind === 'cat' ? setCat(s.id) : onSelectNote(s.id) } }}>
            <path d={arcPath(cx, cy, 52, 138, s.a0 + 0.01, s.a1 - 0.01)} fill={s.color} opacity={s.kind === 'note' ? 0.55 + 0.15 * s.weight : 0.85} />
            <text x={s.lx} y={s.ly} textAnchor="middle" dominantBaseline="middle" className="wheel-label">{s.label}</text>
          </g>
        ))}
        <circle cx={cx} cy={cy} r={50} fill="#fffaf2" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="wheel-center">{cat ? categoryById(cat)?.name : '香り'}</text>
      </svg>
      {cat && <button className="btn ghost" onClick={() => setCat(null)}>← 大分類に戻る</button>}
      <ul className="wheel-list">
        {segments.map((s) => (
          <li key={s.id}>
            <button className="chip" onClick={() => (s.kind === 'cat' ? setCat(s.id) : onSelectNote(s.id))}>
              <span className="dot" style={{ background: s.color }} />{s.label}{s.sub ? `（${s.sub}）` : ''}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
export { INT_LABEL }
