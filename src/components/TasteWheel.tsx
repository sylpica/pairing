import { useMemo } from 'react'
import type { ComboLevel, ComboTaste, FlavorProfile, TasteKey } from '../types'
import { COMBO_LEVEL_LABEL, COMBO_TASTE_LABEL } from '../engine/combo'
import { COMBO_INT_LABEL } from './ComboWheel'
import { fitLabelLines } from './wheelText'

// 味モードのホイール（第7弾・課題B）。組み合わせの味プロファイル
// （ComboAnalysis.tastes＝土台アイテムの味覚プロファイルに、製法ルールと
// 軸効果の味への作用を根拠レベルつきで重ねたもの）を、香りモードの
// ComboWheel と同じ作法で円グラフ表示する：
// - measured（実測・官能評価）: 濃く表示（不透明度 0.95）
// - general（一般的な知見）: 中間の濃さ（0.62）
// - inferred（推測）: 薄く表示（0.38）＋破線の輪郭
// - セグメントの大きさ＝強さ（弱い1・普通2・強い3 の重み）。数値スコアは出さない。
// - 全セグメントに必ずラベルを出す（細い場合はフォント縮小・2行割り）。
// 味のデータが無い次元は無理に作らず、ある次元だけで構成する。

const rank = (i: string) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)
const LEVEL_OPACITY: Record<ComboLevel, number> = { measured: 0.95, general: 0.62, inferred: 0.38 }
const LABEL_R = 104

/** 味の次元ごとの表示順と色（香味カテゴリ色とは別に、味覚専用の色を使う） */
export const TASTE_ORDER: TasteKey[] = ['sweet', 'sour', 'bitter', 'astringent', 'umami']
export const TASTE_COLORS: Record<TasteKey, string> = {
  sweet: '#eda83a',
  sour: '#7fb069',
  bitter: '#6b4f3a',
  astringent: '#b08968',
  umami: '#c1663e',
}

const tasteLabel = (k: TasteKey) => (k === 'astringent' ? '渋味（収れん感）' : COMBO_TASTE_LABEL[k])

/** アイテムの実測プロファイル（FlavorProfile）の味覚を、ホイール表示用の形に変換する */
export function comboTastesFromProfile(profile: FlavorProfile): ComboTaste[] {
  return TASTE_ORDER.flatMap((key) => {
    const t = profile.tastes[key]
    if (!t || t.intensity === 'unknown') return []
    const level: ComboLevel = t.basis === 'measured' || t.basis === 'sensory' ? 'measured' : 'general'
    return [{ key, intensity: t.intensity, level, text: '', sourceIds: [...t.sourceIds] }]
  })
}

function arcPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  const [x0, y0] = p(r1, a0), [x1, y1] = p(r1, a1), [x2, y2] = p(r0, a1), [x3, y3] = p(r0, a0)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M ${x0} ${y0} A ${r1} ${r1} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${r0} ${r0} 0 ${large} 0 ${x3} ${y3} Z`
}

export default function TasteWheel({ tastes, onSelectTaste, selectedTasteKey }: {
  tastes: ComboTaste[]
  onSelectTaste: (key: TasteKey) => void
  selectedTasteKey?: TasteKey | null
}) {
  const ordered = useMemo(
    () => TASTE_ORDER.flatMap((k) => tastes.filter((t) => t.key === k && rank(t.intensity) > 0)),
    [tastes])

  if (ordered.length === 0) {
    return <p className="unknown-box">この組み合わせでは、根拠のある味のデータがまだ示せません（土台の味覚プロファイル、製法ルールや産地・品種・系統の味への作用が未収録のため）。根拠なく味を並べることはしません。</p>
  }

  const size = 300, cx = size / 2, cy = size / 2
  const total = ordered.reduce((s, t) => s + rank(t.intensity), 0) || 1
  let angle = -Math.PI / 2
  const drawn = ordered.map((t) => {
    const a0 = angle; const a1 = angle + (rank(t.intensity) / total) * Math.PI * 2; angle = a1
    const mid = (a0 + a1) / 2
    const span = a1 - a0
    const avail = span >= Math.PI ? 130 : Math.min(2 * LABEL_R * Math.sin(span / 2) * 0.96, 130)
    const lx = cx + LABEL_R * Math.cos(mid), ly = cy + LABEL_R * Math.sin(mid)
    const lines = fitLabelLines(COMBO_TASTE_LABEL[t.key], avail).map((l) => ({ ...l, cls: 'wheel-label' }))
    const totalH = lines.reduce((a, l) => a + l.fs * 1.35, 0)
    let y = ly - totalH / 2
    const placed = lines.map((l) => { const yy = y + (l.fs * 1.35) / 2; y += l.fs * 1.35; return { ...l, y: yy } })
    return { taste: t, a0, a1, lx, color: TASTE_COLORS[t.key], lines: placed }
  })

  return (
    <div className="wheel-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} className="wheel" role="group" aria-label="組み合わせの味のホイール（推測を含む）">
        {drawn.map(({ taste, a0, a1, lx, color, lines }) => (
          <g key={taste.key} onClick={() => onSelectTaste(taste.key)} className="wheel-seg" tabIndex={0} role="button"
            aria-label={`${tasteLabel(taste.key)}（${COMBO_INT_LABEL[taste.intensity]}・${COMBO_LEVEL_LABEL[taste.level]}）の根拠を見る`}
            onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onSelectTaste(taste.key) } }}>
            <path d={arcPath(cx, cy, 52, 138, a0 + 0.01, a1 - 0.01)} fill={color}
              opacity={LEVEL_OPACITY[taste.level]}
              stroke={taste.level === 'inferred' ? '#5b4636' : 'none'}
              strokeWidth={taste.level === 'inferred' ? 1.6 : 0}
              strokeDasharray={taste.level === 'inferred' ? '5 3' : undefined}
              style={selectedTasteKey === taste.key ? { stroke: '#33302a', strokeWidth: 2.4, strokeDasharray: 'none' } : undefined} />
            {lines.map((l, i) => (
              <text key={i} x={lx} y={l.y} textAnchor="middle" dominantBaseline="middle" className={l.cls} style={{ fontSize: l.fs }}>{l.text}</text>
            ))}
          </g>
        ))}
        <circle cx={cx} cy={cy} r={50} fill="#fffaf2" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="wheel-center">味（推測含む）</text>
      </svg>
      <div className="combo-legend" role="note" aria-label="ホイールの凡例">
        <p className="note-small"><strong>凡例（濃さと輪郭＝根拠の確かさ）</strong></p>
        <ul className="combo-legend-list">
          <li><span className="legend-swatch" style={{ background: '#8d7b68', opacity: LEVEL_OPACITY.measured }} />実測・官能評価に基づく</li>
          <li><span className="legend-swatch" style={{ background: '#8d7b68', opacity: LEVEL_OPACITY.general }} />一般的な知見</li>
          <li><span className="legend-swatch legend-inferred" style={{ background: '#8d7b68', opacity: LEVEL_OPACITY.inferred }} />推測（未検証）：薄い表示＋破線の輪郭</li>
        </ul>
        <p className="note-small">セグメントの大きさは強さの目安（弱い・普通・強い）です。根拠のある味の次元だけを表示しています（データの無い次元は作りません）。味を押すと根拠の内訳が見えます。渋味は基本味ではなく、口の中の収れん感です。</p>
      </div>
      <ul className="wheel-list">
        {ordered.map((t) => (
          <li key={t.key}>
            <button className="chip" onClick={() => onSelectTaste(t.key)} aria-expanded={selectedTasteKey === t.key}>
              <span className="dot" style={{ background: TASTE_COLORS[t.key] }} />
              {tasteLabel(t.key)}（{COMBO_INT_LABEL[t.intensity]}） <span className={t.level === 'inferred' ? 'badge badge-inferred' : 'badge'}>{COMBO_LEVEL_LABEL[t.level]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
