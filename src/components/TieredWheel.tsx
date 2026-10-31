import type { ReactNode } from 'react'
import type { ComboLevel } from '../types'
import { fitLabelLines, fitOneLine, packScaledLines, type FittedLine } from './wheelText'

// 3階層ホイール共通の描画（第8弾）。大分類・中分類・小分類のどの階層でも、
// 同じ作法で描く:
// - 全セグメントに必ずラベルを出す（フォント段階縮小・2行割り。無地禁止）。
// - percent があれば名前の下に「○%」を併記する。
// - subLabels は小さく併記する行（中分類名、化合物○種など）。
// - level があれば根拠レベルの視覚区別（measured 不透明／general 半透明／
//   inferred 薄色＋破線）。level が無い階層（大分類・化合物）は、
//   呼び出し側が決めた濃さで描く（化合物は根拠の近さを不透明度に写す）。
// - drillable=false のセグメントは薄く描き、押せる/押せないが視覚的に分かるようにする。

export const TIER_LEVEL_OPACITY: Record<ComboLevel, number> = { measured: 0.95, general: 0.62, inferred: 0.38 }

export interface TierSeg {
  key: string
  label: string
  color: string
  /** 角度の重み（％ホイールでは裏付けの重みそのもの。％表示と比例する） */
  weight: number
  percent?: number
  level?: ComboLevel
  /** level を使わない階層での不透明度（化合物の根拠の近さなど） */
  opacity?: number
  subLabels?: string[]
  drillable?: boolean
  ariaLabel: string
  chip: ReactNode
  selected?: boolean
}

const LABEL_R = 104

function arcPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  const [x0, y0] = p(r1, a0), [x1, y1] = p(r1, a1), [x2, y2] = p(r0, a1), [x3, y3] = p(r0, a0)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M ${x0} ${y0} A ${r1} ${r1} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${r0} ${r0} 0 ${large} 0 ${x3} ${y3} Z`
}

export default function TieredWheel({ segments, centerLabel, ariaLabel, onSelect }: {
  segments: TierSeg[]
  centerLabel: string
  ariaLabel: string
  onSelect: (key: string) => void
}) {
  const size = 300, cx = size / 2, cy = size / 2
  const total = segments.reduce((s, x) => s + x.weight, 0) || 1
  let angle = -Math.PI / 2
  const drawn = segments.map((s) => {
    const a0 = angle; const a1 = angle + (s.weight / total) * Math.PI * 2; angle = a1
    const mid = (a0 + a1) / 2
    const span = a1 - a0
    const chordAvail = span >= Math.PI ? 130 : Math.min(2 * LABEL_R * Math.sin(span / 2) * 0.96, 130)
    const lx = cx + LABEL_R * Math.cos(mid), ly = cy + LABEL_R * Math.sin(mid)
    // 第29弾: ホイールの左右端に近いセグメントでは、ラベル中心から SVG の端
    // までの距離も制約になる。これが無いと端のセグメントで長い成分名
    // （2,5-ジメチルピラジン等）の両端が viewBox の外に切れていた。
    const avail = Math.min(chordAvail, 2 * Math.min(lx, size - lx) - 4)
    const lines: (FittedLine & { cls: string })[] = [
      ...fitLabelLines(s.label, avail).map((l) => ({ ...l, cls: 'wheel-label' })),
    ]
    if (s.percent !== undefined) {
      lines.push({ ...fitOneLine(`${s.percent}%`, avail, 11), cls: 'wheel-label' })
    }
    const subMax = span >= 0.65 ? 2 : 1
    lines.push(...packScaledLines(s.subLabels ?? [], avail, subMax).map((l) => ({ ...l, cls: 'wheel-sub' })))
    const totalH = lines.reduce((a, l) => a + l.fs * 1.35, 0)
    let y = ly - totalH / 2
    const placed = lines.map((l) => { const yy = y + (l.fs * 1.35) / 2; y += l.fs * 1.35; return { ...l, y: yy } })
    const opacity = s.drillable === false ? 0.42
      : s.level ? TIER_LEVEL_OPACITY[s.level]
      : s.opacity ?? 0.85
    return { seg: s, a0, a1, lx, lines: placed, opacity }
  })

  return (
    <div className="wheel-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} className="wheel" role="group" aria-label={ariaLabel}>
        {drawn.map(({ seg, a0, a1, lx, lines, opacity }) => (
          <g key={seg.key} onClick={() => onSelect(seg.key)} className="wheel-seg" tabIndex={0} role="button"
            aria-label={seg.ariaLabel}
            onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onSelect(seg.key) } }}>
            <path d={arcPath(cx, cy, 52, 138, a0 + 0.01, a1 - 0.01)} fill={seg.color}
              opacity={opacity}
              stroke={seg.level === 'inferred' ? '#5b4636' : seg.selected ? '#33302a' : 'none'}
              strokeWidth={seg.level === 'inferred' ? 1.6 : seg.selected ? 2.4 : 0}
              strokeDasharray={seg.level === 'inferred' ? '5 3' : undefined} />
            {lines.map((l, i) => (
              <text key={i} x={lx} y={l.y} textAnchor="middle" dominantBaseline="middle" className={l.cls} style={{ fontSize: l.fs }}>{l.text}</text>
            ))}
          </g>
        ))}
        <circle cx={cx} cy={cy} r={50} fill="#fffaf2" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="wheel-center">{centerLabel}</text>
      </svg>
      <ul className="wheel-list">
        {segments.map((s) => (
          <li key={s.key}>
            <button className="chip" onClick={() => onSelect(s.key)} aria-expanded={s.selected}>
              <span className="dot" style={{ background: s.color }} />
              {s.chip}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
