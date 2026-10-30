import { useMemo } from 'react'
import type { ComboLevel, ComboNote } from '../types'
import { flavorCategories, noteById, categoryById } from '../data/flavors'
import { COMBO_LEVEL_LABEL } from '../engine/combo'

// 組み合わせページ専用のフレーバーホイール。
// 通常の FlavorWheel（実測プロファイル用）とは別にし、ノートごとに根拠レベルを
// 視覚的に区別する：
// - measured（実測・官能評価）: カテゴリ色を濃く表示（不透明度 0.95）
// - general（一般的な知見）: 中間の濃さ（0.62）
// - inferred（推測）: 薄く表示（0.38）＋破線の輪郭
// 強度はセグメントの角度（弱い1・普通2・強い3 の重み）で表す。数値スコアは出さない。

const rank = (i: string) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)
export const COMBO_INT_LABEL: Record<string, string> = { strong: '強い', normal: '普通', weak: '弱い', unknown: '不明' }
const LEVEL_OPACITY: Record<ComboLevel, number> = { measured: 0.95, general: 0.62, inferred: 0.38 }

function arcPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  const [x0, y0] = p(r1, a0), [x1, y1] = p(r1, a1), [x2, y2] = p(r0, a1), [x3, y3] = p(r0, a0)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M ${x0} ${y0} A ${r1} ${r1} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${r0} ${r0} 0 ${large} 0 ${x3} ${y3} Z`
}

export default function ComboWheel({ notes, onSelectNote, selectedNoteId }: {
  notes: ComboNote[]
  onSelectNote: (noteId: string) => void
  selectedNoteId?: string | null
}) {
  const known = useMemo(
    () => notes.filter((n) => rank(n.intensity) > 0 && noteById(n.noteId)),
    [notes])
  const ordered = useMemo(() => {
    const catOrder = new Map(flavorCategories.map((c, i) => [c.id, i]))
    return [...known].sort((a, b) =>
      (catOrder.get(noteById(a.noteId)!.categoryId) ?? 99) - (catOrder.get(noteById(b.noteId)!.categoryId) ?? 99))
  }, [known])

  if (ordered.length === 0) {
    return <p className="unknown-box">この組み合わせでは、根拠のある香りのノートがまだ示せません（分類プロファイル側のデータ不足、または根拠のある推測が成立しないため）。根拠なく香りを並べることはしません。</p>
  }

  const size = 300, cx = size / 2, cy = size / 2
  const total = ordered.reduce((s, n) => s + rank(n.intensity), 0) || 1
  let angle = -Math.PI / 2
  const drawn = ordered.map((n) => {
    const a0 = angle; const a1 = angle + (rank(n.intensity) / total) * Math.PI * 2; angle = a1
    const mid = (a0 + a1) / 2
    const note = noteById(n.noteId)!
    return {
      note: n, a0, a1,
      lx: cx + 104 * Math.cos(mid), ly: cy + 104 * Math.sin(mid),
      color: categoryById(note.categoryId)?.color ?? '#999083',
      label: note.name,
    }
  })

  return (
    <div className="wheel-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} className="wheel" role="group" aria-label="組み合わせのフレーバーホイール（推測を含む）">
        {drawn.map(({ note, a0, a1, lx, ly, color, label }) => (
          <g key={note.noteId} onClick={() => onSelectNote(note.noteId)} className="wheel-seg" tabIndex={0} role="button"
            aria-label={`${label}（${COMBO_INT_LABEL[note.intensity]}・${COMBO_LEVEL_LABEL[note.level]}）の根拠を見る`}
            onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onSelectNote(note.noteId) } }}>
            <path d={arcPath(cx, cy, 52, 138, a0 + 0.01, a1 - 0.01)} fill={color}
              opacity={LEVEL_OPACITY[note.level]}
              stroke={note.level === 'inferred' ? '#5b4636' : 'none'}
              strokeWidth={note.level === 'inferred' ? 1.6 : 0}
              strokeDasharray={note.level === 'inferred' ? '5 3' : undefined}
              style={selectedNoteId === note.noteId ? { stroke: '#33302a', strokeWidth: 2.4, strokeDasharray: 'none' } : undefined} />
            {(a1 - a0) >= 0.42 && (
              <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="wheel-label">{label}</text>
            )}
          </g>
        ))}
        <circle cx={cx} cy={cy} r={50} fill="#fffaf2" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="wheel-center">香り（推測含む）</text>
      </svg>
      <div className="combo-legend" role="note" aria-label="ホイールの凡例">
        <p className="note-small"><strong>凡例（濃さと輪郭＝根拠の確かさ）</strong></p>
        <ul className="combo-legend-list">
          <li><span className="legend-swatch" style={{ background: '#8d7b68', opacity: LEVEL_OPACITY.measured }} />実測・官能評価に基づく</li>
          <li><span className="legend-swatch" style={{ background: '#8d7b68', opacity: LEVEL_OPACITY.general }} />一般的な知見</li>
          <li><span className="legend-swatch legend-inferred" style={{ background: '#8d7b68', opacity: LEVEL_OPACITY.inferred }} />推測（未検証）：薄い表示＋破線の輪郭</li>
        </ul>
        <p className="note-small">セグメントの大きさは強さの目安（弱い・普通・強い）です。香りを押すと根拠の内訳が見えます。</p>
      </div>
      <ul className="wheel-list">
        {ordered.map((n) => (
          <li key={n.noteId}>
            <button className="chip" onClick={() => onSelectNote(n.noteId)} aria-expanded={selectedNoteId === n.noteId}>
              <span className="dot" style={{ background: categoryById(noteById(n.noteId)!.categoryId)?.color }} />
              {noteById(n.noteId)!.name}（{COMBO_INT_LABEL[n.intensity]}） <span className={n.level === 'inferred' ? 'badge badge-inferred' : 'badge'}>{COMBO_LEVEL_LABEL[n.level]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
