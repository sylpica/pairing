import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ComboNote, ComboTaste, TasteKey } from '../types'
import type { CompoundContext } from '../data/compounds'
import { noteById } from '../data/flavors'
import { COMBO_LEVEL_LABEL, COMBO_TASTE_LABEL } from '../engine/combo'
import {
  buildAromaTiers, buildTasteNoteTiers, VAGUE_NOTE_IDS,
  type CategoryTier, type MidEntry, type TierCompound,
} from '../engine/wheelTiers'
import { NOTE_TASTE_BASIS } from '../data/noteTastes'
import TieredWheel, { TIER_LEVEL_OPACITY, type TierSeg } from './TieredWheel'
import { TASTE_COLORS } from './TasteWheel'
import { COMBO_INT_LABEL } from './wheelText'
import CompoundCard from './CompoundCard'
import { tierHeading } from './NoteDetail'
import { CollapsibleSheet } from './Sheet'

// フレーバーホイールの3階層パネル（第8弾）。香り・味の切り替えを持ち、
// パネル内で階層の状態を完結させる。
// 香り: 大分類（香味カテゴリ）→ 中分類（具体名：具体的なノート＋漠然とした
//   ノートへの推測具体名）→ 小分類（寄与する化学物質・％つき）→ 成分詳細シート。
//   具体名が1つも無い大分類はドリルダウン不可（薄く表示）とし、押すと
//   理由と漠然とした香りの根拠をシートで説明する。
// 味: 第34弾で全面改修。第1階層＝味そのもの（甘味・酸味・苦味・うま味・
//   渋味。存在する味だけ）→ 第2階層＝具体名（その味に対応づく香味ノート。
//   対応づけは data/noteTastes.ts の解釈）→ 第3階層＝寄与する化学物質。
//   対応づく具体名が無い味は第2階層に寄与物質を直接出し、物質も無い味は
//   根拠の説明をその場に出す（無理にホイールを作らない、従来の作法）。
//   第27弾で全階層に％を統一表示する: ％は強さ（弱い・普通・強い）や
//   裏付けの重みを正規化した目安（実測の含有率ではない）。
// ％は実測の含有率ではなく裏付けデータからの算出値であり、各階層に明記する。
// ノート・味の「根拠」詳細は呼び出し側（組み合わせ系／アイテム系）から
// renderNoteDetail / renderTasteDetail で差し込む。

const MID_PERCENT_NOTE = '割合は裏付けデータから算出した目安で、実測の含有率ではありません。各割合は、その具体名を裏付ける化合物の数と根拠の近さ（この分類・種類の試料での研究例ほど大きく）から算出しています。化合物の裏付けが無い具体名は、香りの強さ（弱い・普通・強い）で重み付けしています。'
const SMALL_PERCENT_NOTE = '割合は裏付けデータから算出した目安で、実測の含有率ではありません。各割合は、化合物の根拠の近さ（この分類・種類の試料での研究例ほど大きく、お茶・チョコレート全般の研究例は中ほど）から算出しています。'
const CAT_PERCENT_NOTE = '割合は裏付けデータから算出した目安で、実測の含有率ではありません。各割合は、その大分類に属する香りの強さ（弱い・普通・強い）の合計の重みから算出しています。'
const TASTE_PERCENT_NOTE = '割合は裏付けデータから算出した目安で、実測の含有率ではありません。各割合は、味の強さ（弱い・普通・強い）の重みから算出しています。'

type SheetState =
  | { type: 'compound'; tc: TierCompound; percent: number; tasteFocus?: TasteKey }
  | { type: 'note'; note: ComboNote }
  | { type: 'taste'; taste: ComboTaste }
  | { type: 'category'; tier: CategoryTier }

const tasteLabel = (k: TasteKey) => (k === 'astringent' ? '渋味（収れん感）' : COMBO_TASTE_LABEL[k])
const tierOpacity = (tier: 1 | 2 | 3) => (tier === 1 ? 0.95 : tier === 2 ? 0.62 : 0.38)

function LevelBadge({ level }: { level: ComboNote['level'] }) {
  return <span className={level === 'inferred' ? 'badge badge-inferred' : 'badge'}>{COMBO_LEVEL_LABEL[level]}</span>
}

function AromaLegend({ level, extra }: { level: 0 | 1; extra?: ReactNode }) {
  return (
    <div className="combo-legend" role="note" aria-label="ホイールの凡例">
      <p className="note-small"><strong>凡例（濃さと輪郭＝根拠の確かさ）</strong></p>
      <ul className="combo-legend-list">
        <li><span className="legend-swatch" style={{ background: '#8d7b68', opacity: TIER_LEVEL_OPACITY.measured }} />実測・官能評価に基づく</li>
        <li><span className="legend-swatch" style={{ background: '#8d7b68', opacity: TIER_LEVEL_OPACITY.general }} />一般的な知見</li>
        <li><span className="legend-swatch legend-inferred" style={{ background: '#8d7b68', opacity: TIER_LEVEL_OPACITY.inferred }} />推測（未検証）：薄い表示＋破線の輪郭</li>
      </ul>
      {level === 0
        ? <p className="note-small">大分類のセグメントの大きさと割合は、その分類に属する香りの強さの合計の重みから算出した目安です（実測の含有率ではありません）。濃さと輪郭による根拠の区別は、中分類以降で表示します。セグメント内の小さな文字は、その大分類の中分類（具体名）です。</p>
        : <p className="note-small">中分類のセグメントの大きさと割合は、その具体名の裏付けの大きさの目安です（実測の含有率ではありません）。</p>}
      {extra}
    </div>
  )
}

function TasteLegend({ level, extra }: { level: 0 | 1; extra?: ReactNode }) {
  return (
    <div className="combo-legend" role="note" aria-label="ホイールの凡例">
      <p className="note-small"><strong>凡例（濃さと輪郭＝根拠の確かさ）</strong></p>
      <ul className="combo-legend-list">
        <li><span className="legend-swatch" style={{ background: '#8d7b68', opacity: TIER_LEVEL_OPACITY.measured }} />実測・官能評価に基づく</li>
        <li><span className="legend-swatch" style={{ background: '#8d7b68', opacity: TIER_LEVEL_OPACITY.general }} />一般的な知見</li>
        <li><span className="legend-swatch legend-inferred" style={{ background: '#8d7b68', opacity: TIER_LEVEL_OPACITY.inferred }} />推測（未検証）：薄い表示＋破線の輪郭</li>
      </ul>
      {level === 0
        ? <p className="note-small">第1階層は、その対象で確認されている味そのものです（甘味・酸味・苦味・うま味・渋味（収れん感））。セグメントの大きさと割合は、味の強さ（弱い・普通・強い）の重みから算出した目安です（実測の含有率ではありません）。根拠のある味だけを表示しています（データの無い味は作りません）。セグメント内の小さな文字は、その味の具体名（フレーバー）です。味を押すと、その味の具体名が見えます。</p>
        : <p className="note-small">中分類は、その味に対応づく具体名（フレーバー名）です。具体名と味の対応づけは、香りの性質と化合物の知見に基づく解釈です（実測の分類ではありません）。セグメントの大きさと割合は、その具体名の裏付けの大きさの目安です（実測の含有率ではありません）。セグメント内の小さな文字は、その具体名に寄与する化学物質です（裏付けが無い具体名は「成分データなし」と示します）。</p>}
      {extra}
    </div>
  )
}

/**
 * 第22弾（自己監査・ルール3の端ケース解消）：ホイール自体が表示できない状態
 * （香り・味のデータが無い場合と、寄与する物質が無い味の第3階層）では凡例ボックス
 * 自体が出ないため、凡例に集約した画面側の注意書き（legendExtra）まで消えてしまう。
 * その状態でも注意書きが欠落しないよう、凡例ボックスの器だけを出して中身を保つ
 * （品種・系統ページのフォールバックと同じ作法）。
 */
function LegendExtraFallback({ extra }: { extra?: ReactNode }) {
  if (!extra) return null
  return (
    <div className="combo-legend" role="note" aria-label="ホイールの凡例">
      {extra}
    </div>
  )
}

function CompoundLegend({ extra, pair }: { extra?: ReactNode; pair?: boolean }) {
  return (
    <div className="combo-legend" role="note" aria-label="ホイールの凡例">
      <p className="note-small"><strong>凡例（濃さ＝根拠の近さ）</strong></p>
      <ul className="combo-legend-list">
        <li><span className="legend-swatch" style={{ background: '#8d7b68', opacity: 0.95 }} />{pair ? 'どちらか一方の分類・種類の試料での研究例' : 'この分類・種類の試料での研究例'}</li>
        <li><span className="legend-swatch" style={{ background: '#8d7b68', opacity: 0.62 }} />お茶・チョコレート全般の研究例</li>
      </ul>
      {extra}
    </div>
  )
}

/** ペアリング（2側の文脈の和集合）での化合物の根拠の近さの見出し */
const PAIR_TIER_HEADING: Record<1 | 2 | 3, string> = {
  1: 'どちらか一方の分類・種類の試料での研究例',
  2: 'お茶・チョコレート全般の研究例',
  3: '他の食品・茶類での研究例',
}

export default function TieredWheelPanel({ notes, tastes, context, contexts, resetKey, ariaLabel, detailNoun = '根拠情報', legendExtra, renderNoteDetail, renderTasteDetail }: {
  notes: ComboNote[]
  tastes: ComboTaste[]
  context?: CompoundContext
  /** 第26弾: ペアリング用に2側の文脈を和集合で使う場合に渡す（context より優先） */
  contexts?: CompoundContext[]
  resetKey?: string
  /** 第19弾：画面側の根拠・状態系の注意書き（バッジ類）を凡例ボックス内に集約するための差し込み口 */
  legendExtra?: ReactNode
  /** ホイール（svg）の aria-label。大分類表示で使う */
  ariaLabel: string
  /** ノート・味の詳細シートの呼び名（組み合わせ系は「根拠情報」、アイテム系は「成分情報」） */
  detailNoun?: string
  renderNoteDetail: (note: ComboNote) => ReactNode
  renderTasteDetail: (taste: ComboTaste) => ReactNode
}) {
  // 第33弾: 既定モードは「味」（香りより先に味を見せる。ボタン順も 味｜香り）
  const [mode, setMode] = useState<'aroma' | 'taste'>('taste')
  const [catId, setCatId] = useState<string | null>(null)
  const [entryKey, setEntryKey] = useState<string | null>(null)
  // 第34弾: 味の階層状態は「選択した味（第1階層）」と「選択した具体名（第2階層）」
  const [tasteSel, setTasteSel] = useState<TasteKey | null>(null)
  const [tasteNoteId, setTasteNoteId] = useState<string | null>(null)
  const [sheet, setSheet] = useState<SheetState | null>(null)
  useEffect(() => {
    setMode('taste'); setCatId(null); setEntryKey(null); setTasteSel(null); setTasteNoteId(null); setSheet(null)
  }, [resetKey])

  const wheelContext = contexts ?? context
  const isPairContext = (contexts?.length ?? 0) >= 2
  const tiers = useMemo(() => buildAromaTiers(notes, wheelContext), [notes, wheelContext])
  const tier = tiers.find((t) => t.categoryId === catId) ?? null
  const entry: MidEntry | null = tier?.entries.find((e) => e.key === entryKey) ?? null
  const tasteNoteTiers = useMemo(() => buildTasteNoteTiers(notes, tastes, wheelContext), [notes, tastes, wheelContext])
  const tasteTier = tasteNoteTiers.find((g) => g.key === tasteSel) ?? null
  const tasteEntry = tasteTier?.entries.find((e) => e.noteId === tasteNoteId) ?? null
  const drilledTaste = tasteSel ? tastes.find((t) => t.key === tasteSel) ?? null : null

  const nav = (fn: () => void) => { setSheet(null); fn() }

  // ===== 香り・大分類（第1階層） =====
  const catSegments: TierSeg[] = tiers.map((t) => ({
    key: t.categoryId,
    label: t.name,
    color: t.color,
    weight: t.weight,
    percent: t.percent,
    drillable: t.drillable,
    subLabels: t.drillable ? t.entries.map((e) => e.label) : ['具体名の裏付けなし'],
    ariaLabel: t.drillable ? `${t.name}を開く（${t.percent}%・中分類を表示）` : `${t.name}（${t.percent}%・具体名の中分類はありません）`,
    chip: <>{t.name} {t.percent}%{t.drillable ? ' ›' : '（中分類なし）'}</>,
  }))
  const onSelectCategory = (key: string) => {
    const t = tiers.find((x) => x.categoryId === key)
    if (!t) return
    if (t.drillable) nav(() => { setCatId(key); setEntryKey(null) })
    else setSheet({ type: 'category', tier: t })
  }
  const openNoteFromIndex = (t: CategoryTier, note: ComboNote) => {
    if (VAGUE_NOTE_IDS.includes(note.noteId)) {
      const hasSpecifics = t.entries.some((e) => e.kind === 'specific' && e.noteId === note.noteId)
      if (hasSpecifics) nav(() => { setCatId(t.categoryId); setEntryKey(null) })
      else setSheet({ type: 'note', note })
      return
    }
    const e = t.entries.find((x) => x.key === `note:${note.noteId}`)
    if (e && e.compounds.length > 0) nav(() => { setCatId(t.categoryId); setEntryKey(e.key) })
    else setSheet({ type: 'note', note })
  }

  // ===== 香り・中分類（第2階層） =====
  // 第32弾: 「化合物○種」の件数だけでは具体性がないため、味ホイール第2階層と
  // 同じ作法で、寄与する化合物の実際の名前（重みの大きい順）を小さく併記する。
  const entrySegments: TierSeg[] = tier ? tier.entries.map((e) => {
    const names = e.compounds.slice().sort((a, b) => b.percent - a.percent).map((tc) => tc.compound.name)
    const chipNames = names.length === 0 ? '成分データなし'
      : names.length <= 2 ? names.join('、')
      : `${names.slice(0, 2).join('、')} ほか`
    return {
      key: e.key,
      label: e.label,
      color: tier.color,
      weight: e.weight,
      percent: e.percent,
      level: e.level,
      subLabels: names.length > 0 ? names : ['成分データなし'],
      ariaLabel: e.compounds.length > 0
        ? `${e.label}（${e.percent}%）に寄与する化学物質を見る`
        : `${e.label}（${e.percent}%）の根拠を見る`,
      chip: <>{e.label} {e.percent}%（{chipNames}） <LevelBadge level={e.level} /></>,
    }
  }) : []
  const onSelectEntry = (key: string) => {
    const e = tier?.entries.find((x) => x.key === key)
    if (!e) return
    if (e.compounds.length > 0) nav(() => setEntryKey(key))
    else if (e.note) setSheet({ type: 'note', note: e.note })
  }

  // ===== 香り・小分類（第3階層） =====
  const compoundSegments: TierSeg[] = entry ? entry.compounds.map((tc) => ({
    key: tc.compound.id,
    label: tc.compound.name,
    color: tier!.color,
    weight: tc.weight,
    percent: tc.percent,
    opacity: tierOpacity(tc.tier),
    ariaLabel: `${tc.compound.name}（${tc.percent}%）の詳細を見る`,
    chip: <>{tc.compound.name} {tc.percent}%</>,
  })) : []

  // ===== 味・第1階層（味そのもの。第34弾） =====
  const tasteTopSegments: TierSeg[] = tasteNoteTiers.map((g) => {
    const subs = g.entries.length > 0
      ? g.entries.map((e) => e.label)
      : g.fallbackCompounds.length > 0
        ? g.fallbackCompounds.slice().sort((a, b) => b.percent - a.percent).map((tc) => tc.compound.name)
        : ['具体名・成分データなし']
    return {
      key: g.key,
      label: tasteLabel(g.key),
      color: TASTE_COLORS[g.key],
      weight: g.weight,
      percent: g.percent,
      level: g.taste.level,
      subLabels: subs,
      ariaLabel: `${tasteLabel(g.key)}を開く（${g.percent}%・具体名を表示）`,
      chip: <>{tasteLabel(g.key)} {g.percent}%（{COMBO_INT_LABEL[g.taste.intensity]}） <LevelBadge level={g.taste.level} /></>,
    }
  })
  const onSelectTasteTop = (key: string) => {
    nav(() => { setTasteSel(key as TasteKey); setTasteNoteId(null) })
  }

  // ===== 味・第2階層（具体名。第34弾。第32弾の作法で化合物名も小さく併記） =====
  const tasteNoteSegments: TierSeg[] = tasteTier ? tasteTier.entries.map((e) => {
    const names = e.compounds.slice().sort((a, b) => b.percent - a.percent).map((tc) => tc.compound.name)
    const chipNames = names.length === 0 ? '成分データなし'
      : names.length <= 2 ? names.join('、')
      : `${names.slice(0, 2).join('、')} ほか`
    return {
      key: e.noteId,
      label: e.label,
      color: TASTE_COLORS[tasteTier.key],
      weight: e.weight,
      percent: e.percent,
      level: e.level,
      subLabels: names.length > 0 ? names : ['成分データなし'],
      ariaLabel: e.compounds.length > 0
        ? `${e.label}（${e.percent}%）に寄与する化学物質を見る`
        : `${e.label}（${e.percent}%）の根拠を見る`,
      chip: <>{e.label} {e.percent}%（{chipNames}） <LevelBadge level={e.level} /></>,
    }
  }) : []
  const onSelectTasteNote = (key: string) => {
    const e = tasteTier?.entries.find((x) => x.noteId === key)
    if (!e) return
    if (e.compounds.length > 0) nav(() => setTasteNoteId(key))
    else setSheet({ type: 'note', note: e.note })
  }

  // ===== 味・第2階層フォールバック（具体名が無い味は寄与物質を直接出す） =====
  const tasteFallbackSegments: TierSeg[] = tasteTier ? tasteTier.fallbackCompounds.map((tc) => ({
    key: tc.compound.id,
    label: tc.compound.name,
    color: TASTE_COLORS[tasteTier.key],
    weight: tc.weight,
    percent: tc.percent,
    opacity: tierOpacity(tc.tier),
    ariaLabel: `${tc.compound.name}（${tc.percent}%）の詳細を見る`,
    chip: <>{tc.compound.name} {tc.percent}%</>,
  })) : []

  // ===== 味・第3階層（具体名に寄与する化学物質） =====
  const tasteNoteCompoundSegments: TierSeg[] = tasteEntry ? tasteEntry.compounds.map((tc) => ({
    key: tc.compound.id,
    label: tc.compound.name,
    color: TASTE_COLORS[tasteTier!.key],
    weight: tc.weight,
    percent: tc.percent,
    opacity: tierOpacity(tc.tier),
    ariaLabel: `${tc.compound.name}（${tc.percent}%）の詳細を見る`,
    chip: <>{tc.compound.name} {tc.percent}%</>,
  })) : []

  const parentNote = entry ? tier?.notes.find((n) => n.noteId === entry.noteId) ?? null : null

  return (
    <div>
      <div className="wheel-mode-toggle" role="tablist" aria-label="ホイールの表示切り替え（香りと味）">
        <button role="tab" aria-selected={mode === 'taste'} onClick={() => setMode('taste')}>味</button>
        <button role="tab" aria-selected={mode === 'aroma'} onClick={() => setMode('aroma')}>香り</button>
      </div>

      {mode === 'aroma' && tiers.length === 0 && (
        <>
          <p className="unknown-box">この組み合わせでは、根拠のある香りのノートがまだ示せません（分類プロファイル側のデータ不足、または根拠のある推測が成立しないため）。根拠なく香りを並べることはしません。</p>
          <LegendExtraFallback extra={legendExtra} />
        </>
      )}

      {mode === 'aroma' && tiers.length > 0 && !tier && (
        <>
          <p className="note-small wheel-hint">大分類のセグメントを押すと、中分類（具体名）が表示されます。</p>
          <TieredWheel segments={catSegments} centerLabel="香り" ariaLabel={ariaLabel} onSelect={onSelectCategory} />
          <p className="note-small wheel-percent-note">{CAT_PERCENT_NOTE}</p>
          <AromaLegend level={0} extra={legendExtra} />
          <div className="wheel-note-index">
            <p className="note-small"><strong>この組み合わせの香り一覧</strong>（押すと、その香りの成分または根拠へ進みます）</p>
            {tiers.map((t) => (
              <div key={t.categoryId} className="wheel-note-index-group">
                <p className="note-small wheel-note-index-cat"><span className="dot" style={{ background: t.color }} />{t.name}</p>
                <ul className="wheel-list">
                  {t.notes.map((n) => (
                    <li key={n.noteId}>
                      <button className="chip" onClick={() => openNoteFromIndex(t, n)}>
                        {noteById(n.noteId)!.name}（{COMBO_INT_LABEL[n.intensity]}） <LevelBadge level={n.level} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      {mode === 'aroma' && tier && !entry && (
        <>
          <div className="wheel-nav">
            <button className="btn ghost" onClick={() => nav(() => { setCatId(null); setEntryKey(null) })}>← 大分類に戻る</button>
            <span className="wheel-crumb">香り › {tier.name}</span>
          </div>
          <p className="note-small wheel-hint">中分類（具体名）のセグメントを押すと、その具体名に寄与する化学物質が表示されます（化学物質の裏付けが無い具体名は、根拠が表示されます）。</p>
          <TieredWheel segments={entrySegments} centerLabel={tier.name} ariaLabel={`${ariaLabel}（${tier.name}の中分類）`} onSelect={onSelectEntry} />
          <p className="note-small wheel-percent-note">{MID_PERCENT_NOTE}</p>
          <AromaLegend level={1} extra={legendExtra} />
          <div className="wheel-source-notes">
            <p className="note-small"><strong>この大分類のもとになった香り</strong></p>
            <ul className="wheel-list">
              {tier.notes.map((n) => (
                <li key={n.noteId}>
                  <button className="chip" onClick={() => setSheet({ type: 'note', note: n })}>
                    「{noteById(n.noteId)!.name}」の根拠を見る
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {mode === 'aroma' && tier && entry && (
        <>
          <div className="wheel-nav">
            <button className="btn ghost" onClick={() => nav(() => setEntryKey(null))}>← 中分類に戻る</button>
            <span className="wheel-crumb">香り › {tier.name} › {entry.label}</span>
          </div>
          <p className="note-small wheel-hint">化学物質のセグメントを押すと、成分の詳細が表示されます。</p>
          <TieredWheel segments={compoundSegments} centerLabel={entry.label} ariaLabel={`${ariaLabel}（${entry.label}に寄与する化学物質）`}
            onSelect={(key) => {
              const tc = entry.compounds.find((x) => x.compound.id === key)
              if (tc) setSheet({ type: 'compound', tc, percent: tc.percent })
            }} />
          <p className="note-small wheel-percent-note">{SMALL_PERCENT_NOTE}</p>
          <CompoundLegend extra={legendExtra} pair={isPairContext} />
          <div className="wheel-entry-head">
            {entry.kind === 'note' && entry.note && (
              <p><strong>{entry.label}</strong> <span className="badge">{COMBO_INT_LABEL[entry.note.intensity]}・{COMBO_LEVEL_LABEL[entry.note.level]}</span>{' '}
                <button className="linklike" onClick={() => setSheet({ type: 'note', note: entry.note! })}>「{entry.label}」の根拠を見る</button></p>
            )}
            {entry.kind === 'specific' && entry.specific && (
              <div className="inference-item">
                <p><strong>{entry.label}</strong> <span className="badge badge-inferred">推測（未検証）</span></p>
                <p>{entry.specific.rationale}</p>
                <p className="note-small">根拠成分：{entry.compounds.map((tc) => tc.compound.name).join('、')}
                  {entry.specific.basisGrading === 'reference-assisted' && '／具体名の香り記述には参考情報（記事・データベース等）を含みます'}</p>
                {parentNote && (
                  <p><button className="linklike" onClick={() => setSheet({ type: 'note', note: parentNote })}>
                    もとになった香り「{noteById(entry.noteId)!.name}」の根拠を見る</button></p>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {mode === 'taste' && !tasteTier && tasteNoteTiers.length === 0 && (
        <>
          <p className="unknown-box">この組み合わせでは、根拠のある味のデータがまだ示せません（土台の味覚プロファイル、製法ルールや産地・品種・系統の味への作用が未収録のため）。根拠なく味を並べることはしません。</p>
          <LegendExtraFallback extra={legendExtra} />
        </>
      )}

      {mode === 'taste' && !tasteTier && tasteNoteTiers.length > 0 && (
        <>
          <p className="note-small wheel-hint">味のセグメントを押すと、その味の具体名（フレーバー）が表示されます。</p>
          <TieredWheel segments={tasteTopSegments} centerLabel="味" ariaLabel={`${ariaLabel}（味）`} onSelect={onSelectTasteTop} />
          <p className="note-small wheel-percent-note">{TASTE_PERCENT_NOTE}</p>
          <TasteLegend level={0} extra={legendExtra} />
        </>
      )}

      {mode === 'taste' && tasteTier && !tasteEntry && tasteTier.entries.length > 0 && (
        <>
          <div className="wheel-nav">
            <button className="btn ghost" onClick={() => nav(() => { setTasteSel(null); setTasteNoteId(null) })}>← 味に戻る</button>
            <span className="wheel-crumb">味 › {tasteLabel(tasteTier.key)}</span>
          </div>
          <p className="note-small wheel-hint">具体名のセグメントを押すと、その具体名に寄与する化学物質が表示されます（化学物質の裏付けが無い具体名は、根拠が表示されます）。</p>
          <TieredWheel segments={tasteNoteSegments} centerLabel={tasteLabel(tasteTier.key)} ariaLabel={`${ariaLabel}（${tasteLabel(tasteTier.key)}の具体名）`} onSelect={onSelectTasteNote} />
          <p className="note-small wheel-percent-note">{MID_PERCENT_NOTE}</p>
          <TasteLegend level={1} extra={legendExtra} />
          <div className="wheel-source-notes">
            <p className="note-small"><strong>この味そのものの根拠</strong></p>
            <ul className="wheel-list">
              <li>
                <button className="chip" onClick={() => drilledTaste && setSheet({ type: 'taste', taste: drilledTaste })}>
                  「{tasteLabel(tasteTier.key)}」の根拠を見る
                </button>
              </li>
            </ul>
            <p className="note-small">{NOTE_TASTE_BASIS}</p>
          </div>
        </>
      )}

      {mode === 'taste' && tasteTier && !tasteEntry && tasteTier.entries.length === 0 && (
        <>
          <div className="wheel-nav">
            <button className="btn ghost" onClick={() => nav(() => { setTasteSel(null); setTasteNoteId(null) })}>← 味に戻る</button>
            <span className="wheel-crumb">味 › {tasteLabel(tasteTier.key)}</span>
          </div>
          {tasteTier.fallbackCompounds.length === 0 ? (
            <>
              <p className="note-small">この味に直接結びつく成分データは、検証済み文献の範囲では未収録です。架空の成分は表示しません。味そのものの根拠は以下をご覧ください。</p>
              {drilledTaste && renderTasteDetail(drilledTaste)}
              {/* 第22弾：物質が無い味では凡例ボックス自体が出ないため、集約した注意書きが
                  消えないよう凡例ボックスの器で受ける（ルール3の端ケース解消） */}
              <LegendExtraFallback extra={legendExtra} />
            </>
          ) : (
            <>
              <p className="note-small wheel-hint">この味に対応づく具体名（フレーバー）は無いため、寄与する物質を直接示します。成分のセグメントを押すと詳細が表示されます。
                {drilledTaste && <> <button className="linklike" onClick={() => setSheet({ type: 'taste', taste: drilledTaste })}>「{tasteLabel(tasteTier.key)}」の根拠を見る</button></>}</p>
              <TieredWheel segments={tasteFallbackSegments} centerLabel={tasteLabel(tasteTier.key)} ariaLabel={`${ariaLabel}（${tasteLabel(tasteTier.key)}に寄与する成分）`}
                onSelect={(key) => {
                  const tc = tasteTier.fallbackCompounds.find((x) => x.compound.id === key)
                  if (tc) setSheet({ type: 'compound', tc, percent: tc.percent, tasteFocus: tasteTier.key })
                }} />
              <p className="note-small wheel-percent-note">{SMALL_PERCENT_NOTE}</p>
              <CompoundLegend extra={legendExtra} pair={isPairContext} />
            </>
          )}
        </>
      )}

      {mode === 'taste' && tasteTier && tasteEntry && (
        <>
          <div className="wheel-nav">
            <button className="btn ghost" onClick={() => nav(() => setTasteNoteId(null))}>← 中分類に戻る</button>
            <span className="wheel-crumb">味 › {tasteLabel(tasteTier.key)} › {tasteEntry.label}</span>
          </div>
          <p className="note-small wheel-hint">化学物質のセグメントを押すと、成分の詳細が表示されます。</p>
          <TieredWheel segments={tasteNoteCompoundSegments} centerLabel={tasteEntry.label} ariaLabel={`${ariaLabel}（${tasteEntry.label}に寄与する化学物質）`}
            onSelect={(key) => {
              const tc = tasteEntry.compounds.find((x) => x.compound.id === key)
              if (tc) setSheet({ type: 'compound', tc, percent: tc.percent })
            }} />
          <p className="note-small wheel-percent-note">{SMALL_PERCENT_NOTE}</p>
          <CompoundLegend extra={legendExtra} pair={isPairContext} />
          <div className="wheel-entry-head">
            <p><strong>{tasteEntry.label}</strong> <span className="badge">{COMBO_INT_LABEL[tasteEntry.note.intensity]}・{COMBO_LEVEL_LABEL[tasteEntry.note.level]}</span>{' '}
              <button className="linklike" onClick={() => setSheet({ type: 'note', note: tasteEntry.note })}>「{tasteEntry.label}」の根拠を見る</button></p>
          </div>
        </>
      )}

      {sheet?.type === 'compound' && (
        <CollapsibleSheet resetKey={`compound:${sheet.tc.compound.id}:${sheet.tasteFocus ?? ''}`} title={sheet.tc.compound.name}
          onDismiss={() => setSheet(null)}>
          <p className="note-small">この文脈での割合：約{sheet.percent}%（裏付けデータから算出した目安で、実測の含有率ではありません）。根拠の近さ：{isPairContext ? PAIR_TIER_HEADING[sheet.tc.tier] : tierHeading(sheet.tc.tier, Array.isArray(wheelContext) ? wheelContext[0] : wheelContext)}。</p>
          <CompoundCard compound={sheet.tc.compound} tasteFocus={sheet.tasteFocus} />
        </CollapsibleSheet>
      )}
      {sheet?.type === 'note' && (
        <CollapsibleSheet resetKey={`note:${sheet.note.noteId}`} title={noteById(sheet.note.noteId)?.name ?? sheet.note.noteId} noun={detailNoun}
          onDismiss={() => setSheet(null)}>
          {renderNoteDetail(sheet.note)}
        </CollapsibleSheet>
      )}
      {sheet?.type === 'taste' && (
        <CollapsibleSheet resetKey={`taste:${sheet.taste.key}`} title={tasteLabel(sheet.taste.key)} noun={detailNoun}
          onDismiss={() => setSheet(null)}>
          {renderTasteDetail(sheet.taste)}
        </CollapsibleSheet>
      )}
      {sheet?.type === 'category' && (
        <CollapsibleSheet resetKey={`category:${sheet.tier.categoryId}`} title={sheet.tier.name} noun="根拠情報"
          onDismiss={() => setSheet(null)}>
          <section className="note-detail">
            <p>この大分類（{sheet.tier.name}）では、具体名を裏付ける成分データや、具体名への推測の足がかりがまだ無いため、中分類（具体名）は表示しません。根拠のない具体名は作りません。ここに属する漠然とした香りの根拠は、以下をご覧ください。</p>
            {sheet.tier.notes.map((n) => <div key={n.noteId}>{renderNoteDetail(n)}</div>)}
          </section>
        </CollapsibleSheet>
      )}
    </div>
  )
}
