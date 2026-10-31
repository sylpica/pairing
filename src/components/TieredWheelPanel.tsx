import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ComboNote, ComboTaste, TasteKey } from '../types'
import type { CompoundContext } from '../data/compounds'
import { noteById } from '../data/flavors'
import { COMBO_LEVEL_LABEL, COMBO_TASTE_LABEL } from '../engine/combo'
import {
  buildAromaTiers, buildTasteCompounds, buildTasteTiers, VAGUE_NOTE_IDS,
  type CategoryTier, type MidEntry, type TasteGroupId, type TierCompound,
} from '../engine/wheelTiers'
import TieredWheel, { TIER_LEVEL_OPACITY, type TierSeg } from './TieredWheel'
import { TASTE_COLORS } from './TasteWheel'
import { COMBO_INT_LABEL } from './ComboWheel'
import CompoundCard from './CompoundCard'
import { tierHeading } from './NoteDetail'
import { CollapsibleSheet } from './Sheet'

// フレーバーホイールの3階層パネル（第8弾）。香り・味の切り替えを持ち、
// パネル内で階層の状態を完結させる。
// 香り: 大分類（香味カテゴリ）→ 中分類（具体名：具体的なノート＋漠然とした
//   ノートへの推測具体名）→ 小分類（寄与する化学物質・％つき）→ 成分詳細シート。
//   具体名が1つも無い大分類はドリルダウン不可（薄く表示）とし、押すと
//   理由と漠然とした香りの根拠をシートで説明する。
// 味: 大分類（基本味／口当たり・収れん感の2つだけ）→ 中分類（個々の味）→
//   小分類（寄与する物質・％つき）→ 成分詳細シート（第10弾で香りと同じ3階層に）。
//   中分類のセグメントの大きさは強さ（弱い・普通・強い）の重み（％ではない）。
//   物質の無い味（チョコの甘味＝配合糖由来など）は小分類ホイールを作らず、
//   根拠の説明をその場に出す。
// ％は実測の含有率ではなく裏付けデータからの算出値であり、各階層に明記する。
// ノート・味の「根拠」詳細は呼び出し側（組み合わせ系／アイテム系）から
// renderNoteDetail / renderTasteDetail で差し込む。

const MID_PERCENT_NOTE = '割合は裏付けデータから算出した目安で、実測の含有率ではありません。各割合は、その具体名を裏付ける化合物の数と根拠の近さ（この分類・種類の試料での研究例ほど大きく）から算出しています。化合物の裏付けが無い具体名は、香りの強さ（弱い・普通・強い）で重み付けしています。'
const SMALL_PERCENT_NOTE = '割合は裏付けデータから算出した目安で、実測の含有率ではありません。各割合は、化合物の根拠の近さ（この分類・種類の試料での研究例ほど大きく、お茶・チョコレート全般の研究例は中ほど）から算出しています。'

type SheetState =
  | { type: 'compound'; tc: TierCompound; percent: number; tasteFocus?: TasteKey }
  | { type: 'note'; note: ComboNote }
  | { type: 'taste'; taste: ComboTaste }
  | { type: 'category'; tier: CategoryTier }

const tasteLabel = (k: TasteKey) => (k === 'astringent' ? '渋味（収れん感）' : COMBO_TASTE_LABEL[k])
const tierOpacity = (tier: 1 | 2 | 3) => (tier === 1 ? 0.95 : tier === 2 ? 0.62 : 0.38)
const tasteRank = (i: string) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)

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
        ? <p className="note-small">大分類のセグメントの大きさは、その分類に属する香りの強さの合計の目安です。濃さと輪郭による根拠の区別は、中分類以降で表示します。セグメント内の小さな文字は、その大分類の中分類（具体名）です。</p>
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
        ? <p className="note-small">味の大分類は2つだけです。基本味（甘味・酸味・苦味・うま味）は舌で感じる基本の味、口当たり・収れん感は口の中の感覚として感じるものです（渋味は基本味ではなく、収れん感です）。大分類のセグメントの大きさは、その分類に属する味の強さの合計の目安です。濃さと輪郭による根拠の区別は、中分類以降で表示します。セグメント内の小さな文字は、その大分類の中分類（個々の味）です。</p>
        : <p className="note-small">セグメントの大きさは強さの目安（弱い・普通・強い）です。根拠のある味だけを表示しています（データの無い味は作りません）。セグメント内の小さな文字は、その味に寄与する物質です（寄与する物質の裏付けが無い味は「成分データなし」と示します）。味を押すと、その味に寄与する物質が見えます。</p>}
      {extra}
    </div>
  )
}

function CompoundLegend({ extra }: { extra?: ReactNode }) {
  return (
    <div className="combo-legend" role="note" aria-label="ホイールの凡例">
      <p className="note-small"><strong>凡例（濃さ＝根拠の近さ）</strong></p>
      <ul className="combo-legend-list">
        <li><span className="legend-swatch" style={{ background: '#8d7b68', opacity: 0.95 }} />この分類・種類の試料での研究例</li>
        <li><span className="legend-swatch" style={{ background: '#8d7b68', opacity: 0.62 }} />お茶・チョコレート全般の研究例</li>
      </ul>
      {extra}
    </div>
  )
}

export default function TieredWheelPanel({ notes, tastes, context, resetKey, ariaLabel, detailNoun = '根拠情報', legendExtra, renderNoteDetail, renderTasteDetail }: {
  notes: ComboNote[]
  tastes: ComboTaste[]
  context?: CompoundContext
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
  const [mode, setMode] = useState<'aroma' | 'taste'>('aroma')
  const [catId, setCatId] = useState<string | null>(null)
  const [entryKey, setEntryKey] = useState<string | null>(null)
  const [tasteGroupId, setTasteGroupId] = useState<TasteGroupId | null>(null)
  const [tasteKey, setTasteKey] = useState<TasteKey | null>(null)
  const [sheet, setSheet] = useState<SheetState | null>(null)
  useEffect(() => {
    setMode('aroma'); setCatId(null); setEntryKey(null); setTasteGroupId(null); setTasteKey(null); setSheet(null)
  }, [resetKey])

  const tiers = useMemo(() => buildAromaTiers(notes, context), [notes, context])
  const tier = tiers.find((t) => t.categoryId === catId) ?? null
  const entry: MidEntry | null = tier?.entries.find((e) => e.key === entryKey) ?? null
  const tasteTiers = useMemo(() => buildTasteTiers(tastes), [tastes])
  const tasteGroup = tasteTiers.find((g) => g.groupId === tasteGroupId) ?? null
  const tasteCompounds = useMemo(
    () => (tasteKey ? buildTasteCompounds(tasteKey, context) : []),
    [tasteKey, context])
  const drilledTaste = tasteKey ? tastes.find((t) => t.key === tasteKey) ?? null : null

  const nav = (fn: () => void) => { setSheet(null); fn() }

  // ===== 香り・大分類（第1階層） =====
  const catSegments: TierSeg[] = tiers.map((t) => ({
    key: t.categoryId,
    label: t.name,
    color: t.color,
    weight: t.weight,
    drillable: t.drillable,
    subLabels: t.drillable ? t.entries.map((e) => e.label) : ['具体名の裏付けなし'],
    ariaLabel: t.drillable ? `${t.name}を開く（中分類を表示）` : `${t.name}（具体名の中分類はありません）`,
    chip: <>{t.name}{t.drillable ? ' ›' : '（中分類なし）'}</>,
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
  const entrySegments: TierSeg[] = tier ? tier.entries.map((e) => ({
    key: e.key,
    label: e.label,
    color: tier.color,
    weight: e.weight,
    percent: e.percent,
    level: e.level,
    subLabels: [e.compounds.length > 0 ? `化合物${e.compounds.length}種` : '成分データなし'],
    ariaLabel: e.compounds.length > 0
      ? `${e.label}（${e.percent}%）に寄与する化学物質を見る`
      : `${e.label}（${e.percent}%）の根拠を見る`,
    chip: <>{e.label} {e.percent}%（{e.compounds.length > 0 ? `化合物${e.compounds.length}種` : '成分データなし'}） <LevelBadge level={e.level} /></>,
  })) : []
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

  // ===== 味・大分類（第1階層） =====
  const tasteGroupSegments: TierSeg[] = tasteTiers.map((g) => ({
    key: g.groupId,
    label: g.name,
    color: g.color,
    weight: g.weight,
    subLabels: g.tastes.map((t) => tasteLabel(t.key)),
    ariaLabel: `${g.name}を開く（中分類を表示）`,
    chip: <>{g.name} ›</>,
  }))
  const onSelectTasteGroup = (key: string) => {
    nav(() => { setTasteGroupId(key as TasteGroupId); setTasteKey(null) })
  }

  // ===== 味・中分類（第2階層：個々の味） =====
  const tasteMidSegments: TierSeg[] = tasteGroup ? tasteGroup.tastes.map((t) => {
    const compounds = buildTasteCompounds(t.key, context)
    const names = compounds.slice().sort((a, b) => b.percent - a.percent).map((tc) => tc.compound.name)
    return {
      key: t.key,
      label: tasteLabel(t.key),
      color: TASTE_COLORS[t.key],
      weight: tasteRank(t.intensity),
      level: t.level,
      subLabels: names.length > 0 ? names : ['成分データなし'],
      ariaLabel: compounds.length > 0
        ? `${tasteLabel(t.key)}（${COMBO_INT_LABEL[t.intensity]}・${COMBO_LEVEL_LABEL[t.level]}）に寄与する物質を見る`
        : `${tasteLabel(t.key)}（${COMBO_INT_LABEL[t.intensity]}・${COMBO_LEVEL_LABEL[t.level]}）の根拠を見る`,
      chip: <>{tasteLabel(t.key)}（{COMBO_INT_LABEL[t.intensity]}） <LevelBadge level={t.level} /></>,
    }
  }) : []

  // ===== 味・小分類（第3階層：寄与する物質） =====
  const tasteCompoundSegments: TierSeg[] = tasteKey ? tasteCompounds.map((tc) => ({
    key: tc.compound.id,
    label: tc.compound.name,
    color: TASTE_COLORS[tasteKey],
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
        <button role="tab" aria-selected={mode === 'aroma'} onClick={() => setMode('aroma')}>香り</button>
        <button role="tab" aria-selected={mode === 'taste'} onClick={() => setMode('taste')}>味</button>
      </div>

      {mode === 'aroma' && tiers.length === 0 && (
        <p className="unknown-box">この組み合わせでは、根拠のある香りのノートがまだ示せません（分類プロファイル側のデータ不足、または根拠のある推測が成立しないため）。根拠なく香りを並べることはしません。</p>
      )}

      {mode === 'aroma' && tiers.length > 0 && !tier && (
        <>
          <p className="note-small wheel-hint">大分類のセグメントを押すと、中分類（具体名）が表示されます。</p>
          <TieredWheel segments={catSegments} centerLabel="香り" ariaLabel={ariaLabel} onSelect={onSelectCategory} />
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
          <p className="note-small wheel-hint">中分類（具体名）のセグメントを押すと、その具体名に寄与する化学物質が表示されます。</p>
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
          <CompoundLegend extra={legendExtra} />
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

      {mode === 'taste' && !tasteGroup && tasteTiers.length === 0 && (
        <p className="unknown-box">この組み合わせでは、根拠のある味のデータがまだ示せません（土台の味覚プロファイル、製法ルールや産地・品種・系統の味への作用が未収録のため）。根拠なく味を並べることはしません。</p>
      )}

      {mode === 'taste' && !tasteGroup && tasteTiers.length > 0 && (
        <>
          <p className="note-small wheel-hint">味の大分類のセグメントを押すと、その大分類に属する味（中分類）が表示されます。</p>
          <TieredWheel segments={tasteGroupSegments} centerLabel="味" ariaLabel={`${ariaLabel}（味の大分類）`} onSelect={onSelectTasteGroup} />
          <TasteLegend level={0} extra={legendExtra} />
        </>
      )}

      {mode === 'taste' && tasteGroup && !tasteKey && (
        <>
          <div className="wheel-nav">
            <button className="btn ghost" onClick={() => nav(() => { setTasteGroupId(null); setTasteKey(null) })}>← 大分類に戻る</button>
            <span className="wheel-crumb">味 › {tasteGroup.name}</span>
          </div>
          <p className="note-small wheel-hint">味のセグメントを押すと、その味に寄与する物質が表示されます。</p>
          <TieredWheel segments={tasteMidSegments} centerLabel={tasteGroup.name} ariaLabel={`${ariaLabel}（${tasteGroup.name}の味）`}
            onSelect={(key) => nav(() => setTasteKey(key as TasteKey))} />
          <TasteLegend level={1} extra={legendExtra} />
        </>
      )}

      {mode === 'taste' && tasteKey && (
        <>
          <div className="wheel-nav">
            <button className="btn ghost" onClick={() => nav(() => setTasteKey(null))}>← 中分類に戻る</button>
            <span className="wheel-crumb">味 › {tasteGroup?.name} › {tasteLabel(tasteKey)}</span>
          </div>
          {tasteCompounds.length === 0 ? (
            <>
              <p className="note-small">この味に直接結びつく成分データは、検証済み文献の範囲では未収録です。架空の成分は表示しません。味そのものの根拠は以下をご覧ください。</p>
              {drilledTaste && renderTasteDetail(drilledTaste)}
            </>
          ) : (
            <>
              <p className="note-small wheel-hint">成分のセグメントを押すと詳細が表示されます。
                {drilledTaste && <> <button className="linklike" onClick={() => setSheet({ type: 'taste', taste: drilledTaste })}>「{tasteLabel(tasteKey)}」の根拠を見る</button></>}</p>
              <TieredWheel segments={tasteCompoundSegments} centerLabel={tasteLabel(tasteKey)} ariaLabel={`${ariaLabel}（${tasteLabel(tasteKey)}に寄与する成分）`}
                onSelect={(key) => {
                  const tc = tasteCompounds.find((x) => x.compound.id === key)
                  if (tc) setSheet({ type: 'compound', tc, percent: tc.percent, tasteFocus: tasteKey })
                }} />
              <p className="note-small wheel-percent-note">{SMALL_PERCENT_NOTE}</p>
              <CompoundLegend extra={legendExtra} />
            </>
          )}
        </>
      )}

      {sheet?.type === 'compound' && (
        <CollapsibleSheet resetKey={`compound:${sheet.tc.compound.id}:${sheet.tasteFocus ?? ''}`} title={sheet.tc.compound.name}
          onDismiss={() => setSheet(null)}>
          <p className="note-small">この文脈での割合：約{sheet.percent}%（裏付けデータから算出した目安で、実測の含有率ではありません）。根拠の近さ：{tierHeading(sheet.tc.tier, context)}。</p>
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
