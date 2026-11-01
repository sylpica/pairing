import type { ReactNode } from 'react'
import type { ComboLevel } from '../types'
import { fitLabelLines, fitOneLine, packScaledLines, textWidthAt, WHEEL_MIN_FONT, type FittedLine } from './wheelText'

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
  /** チップ（ピル）自体に追加するクラス名（第39弾: 推測の印をピルの破線で表す等） */
  chipClassName?: string
  /**
   * チップの直下に小さく出す付随要素（根拠バッジ等）。
   * 第37弾: 味・香りのチップの作法を統一するため、チップ本体には
   * 「名前＋％（＋ドリル記号／注記）」と化合物の括弧併記だけを改行なしの
   * 単位として入れ、根拠バッジはここへ逃がした。チップ内テキストが
   * 狭幅で1文字ずつ縦に潰れるレイアウトを構造的に防ぐための置き場。
   * 第39弾: 味の第1階層は香りの第1階層と完全に同じ作法（1ピルのみ・
   * 直下に何もぶら下げない）に改めたため below を使わない。強さは
   * ピル内の文言に含め、推測（未検証）の印はピル自体の破線
   * （chipClassName='chip-inferred'）で表す。第2階層は味・香りとも
   * 従来どおり below のバッジで統一されている。
   */
  below?: ReactNode
  selected?: boolean
  /**
   * ラベル自体が化学物質名など「1つの単位」で、途中で割ってはいけない場合に
   * 立てる（第43弾: 第3階層の化合物セグメント名、渋味ゲージ先の化合物名）。
   * 立てると、収まらない場合は割らずに最小フォント＋x 寄せで収める。
   */
  labelAtomic?: boolean
}

const LABEL_R = 104
/** ホイールの円盤の半径（arcPath の外半径と一致させる） */
const DISC_R = 138
/** フィッティング時の安全マージン（実フォントの幅の近似誤差を吸収する） */
const DISC_FIT_R = DISC_R - 1

function arcPath(cx: number, cy: number, r0: number, r1: number, a0: number, a1: number) {
  const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  const [x0, y0] = p(r1, a0), [x1, y1] = p(r1, a1), [x2, y2] = p(r0, a1), [x3, y3] = p(r0, a0)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M ${x0} ${y0} A ${r1} ${r1} 0 ${large} 1 ${x1} ${y1} L ${x2} ${y2} A ${r0} ${r0} 0 ${large} 0 ${x3} ${y3} Z`
}

export default function TieredWheel({ segments, centerLabel, ariaLabel, onSelect, footer }: {
  segments: TierSeg[]
  centerLabel: string
  ariaLabel: string
  onSelect: (key: string) => void
  /** 円形ホイールのすぐ下（チップ一覧より前）に差し込む要素（第36弾：渋味ゲージ用） */
  footer?: ReactNode
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
    const baseAvail = Math.min(chordAvail, 2 * Math.min(lx, size - lx) - 4)
    const subMax = span >= 0.65 ? 2 : 1
    // 第43弾: ラベル行のモデル。行ごとに x を持てるようにし（初期値はラベル中心 lx）、
    // 円盤の弦幅に収まらない行は「割る」のではなく、単位を保ったまま詰め直すか、
    // 行自体を円盤中心側へ寄せて収める。
    type PlacedLine = FittedLine & {
      cls: string
      kind: 'label' | 'pct' | 'sub'
      atomic?: boolean
      x: number
      y: number
      w: number
      h: number
    }
    const mkLine = (l: FittedLine, cls: string, kind: PlacedLine['kind'], atomic?: boolean): PlacedLine => ({
      ...l, cls, kind, atomic, x: lx, y: ly, w: textWidthAt(l.text, l.fs), h: l.fs * 1.35,
    })
    const place = (lines: PlacedLine[]): PlacedLine[] => {
      const totalH = lines.reduce((a, l) => a + l.fs * 1.35, 0)
      let y = ly - totalH / 2
      return lines.map((l) => {
        const yy = y + (l.fs * 1.35) / 2; y += l.fs * 1.35
        return { ...l, y: yy, w: textWidthAt(l.text, l.fs), h: l.fs * 1.35 }
      })
    }
    let placed = place([
      ...fitLabelLines(s.label, baseAvail, 12, WHEEL_MIN_FONT, s.labelAtomic ? 'atomic' : 'boundary')
        .map((l) => mkLine(l, 'wheel-label', 'label', s.labelAtomic)),
      ...(s.percent !== undefined ? [mkLine(fitOneLine(`${s.percent}%`, baseAvail, 11), 'wheel-label', 'pct')] : []),
      ...packScaledLines(s.subLabels ?? [], baseAvail, subMax).map((l) => mkLine(l, 'wheel-sub', 'sub')),
    ])
    // 第36弾: ラベル行が、その行の高さにおけるホイールの円盤の横幅からはみ出す
    // 場合は、その行だけを個別に収め直す。第29弾の制約（viewBox の端まで）
    // だけでは、斜め方向のセグメントで長い併記が円盤の輪郭を大きく横切って
    // いた（烘青緑茶のうま味の併記：行の左端が円盤の輪郭より16px外側まで
    // 達し、末尾が途切れて見えた。ユーザー指摘）。
    // 第43弾: 収め直しの作法を単位ベースに改めた。旧作法は fitLabelLines の
    // バランス分割で化学物質名やフレーズの途中で割っていた（アントラニル酸
    // メチル→「アントラニ／ル酸メチル」等。ユーザー実機FB）。新しい作法は
    // (1) 併記行はその行の単位だけを許容幅で詰め直す（改行は単位の間のみ）、
    // (2) ラベル行は意味の切れ目でのみ割り直す、(3) それでも収まらない行は
    // 割らずに行の x を円盤中心側へ寄せて収める。省略（…）はしない。
    const crossAt = (y: number) => Math.sqrt(Math.max(DISC_FIT_R * DISC_FIT_R - (y - cy) * (y - cy), 0))
    const allowedAt = (l: PlacedLine) => 2 * Math.max(crossAt(l.y) - Math.abs(l.x - cx), 0)
    const violates = (l: PlacedLine) => l.w > allowedAt(l)
    /** 行を円盤中心側へ寄せる。その行の高さで収まる範囲で、最も lx に近い x を選ぶ */
    const shifted = (l: PlacedLine): PlacedLine => {
      const maxOff = crossAt(l.y) - l.w / 2
      if (maxOff < 0) return { ...l, x: cx }
      const off = Math.max(-maxOff, Math.min(maxOff, lx - cx))
      return { ...l, x: cx + off }
    }
    for (let pass = 0; pass < 6 && placed.some(violates); pass++) {
      const next: PlacedLine[] = []
      for (const l of placed) {
        if (!violates(l)) { next.push(l); continue }
        const allowed = Math.max(allowedAt(l), 1)
        if (l.kind === 'sub' && l.units && l.units.length > 0) {
          const repacked = packScaledLines(l.units, allowed, 4, l.fs)
          for (const r of repacked) {
            const nl = mkLine(r, 'wheel-sub', 'sub')
            nl.x = l.x; nl.y = l.y; nl.w = textWidthAt(r.text, r.fs)
            next.push(nl.w > allowed ? shifted(nl) : nl)
          }
          continue
        }
        if (l.kind === 'label' && !l.atomic) {
          const refit = fitLabelLines(l.text, allowed, 12)
          if (refit.every((r) => textWidthAt(r.text, r.fs) <= allowed)) {
            for (const r of refit) { const nl = mkLine(r, 'wheel-label', 'label'); nl.x = l.x; next.push(nl) }
          } else {
            next.push(shifted({ ...l, fs: WHEEL_MIN_FONT, w: textWidthAt(l.text, WHEEL_MIN_FONT) }))
          }
          continue
        }
        // atomic なラベル行・％行・単位情報の無い併記行: 縮小（下限7px）してから x 寄せ
        const fsFit = allowed / Math.max(textWidthAt(l.text, 1), 0.01)
        const fs = Math.max(WHEEL_MIN_FONT, Math.min(l.fs, Math.floor(fsFit * 100) / 100))
        const shrunk: PlacedLine = { ...l, fs, w: textWidthAt(l.text, fs) }
        next.push(shrunk.w > allowed ? shifted(shrunk) : shrunk)
      }
      placed = place(next)
    }
    const opacity = s.drillable === false ? 0.42
      : s.level ? TIER_LEVEL_OPACITY[s.level]
      : s.opacity ?? 0.85
    return { seg: s, a0, a1, lines: placed, opacity }
  })

  return (
    <div className="wheel-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} className="wheel" role="group" aria-label={ariaLabel}>
        {drawn.map(({ seg, a0, a1, lines, opacity }) => (
          <g key={seg.key} onClick={() => onSelect(seg.key)} className="wheel-seg" tabIndex={0} role="button"
            aria-label={seg.ariaLabel}
            onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); onSelect(seg.key) } }}>
            <path d={arcPath(cx, cy, 52, 138, a0 + 0.01, a1 - 0.01)} fill={seg.color}
              opacity={opacity}
              stroke={seg.level === 'inferred' ? '#5b4636' : seg.selected ? '#33302a' : 'none'}
              strokeWidth={seg.level === 'inferred' ? 1.6 : seg.selected ? 2.4 : 0}
              strokeDasharray={seg.level === 'inferred' ? '5 3' : undefined} />
            {lines.map((l, i) => (
              <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" className={l.cls} style={{ fontSize: l.fs }}>{l.text}</text>
            ))}
          </g>
        ))}
        <circle cx={cx} cy={cy} r={50} fill="#fffaf2" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="wheel-center">{centerLabel}</text>
      </svg>
      {footer}
      <ul className="wheel-list">
        {segments.map((s) => (
          <li key={s.key} className="wheel-chip-item">
            <button className={s.chipClassName ? `chip ${s.chipClassName}` : 'chip'} onClick={() => onSelect(s.key)} aria-expanded={s.selected}>
              <span className="dot" style={{ background: s.color }} />
              {s.chip}
            </button>
            {s.below ? <div className="wheel-chip-note">{s.below}</div> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
