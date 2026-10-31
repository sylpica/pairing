import type {
  Basis, ComboBasis, ComboLevel, ComboNote, ComboStatement, ComboTaste, EntityFinding,
  FlavorProfile, Intensity, TasteKey, TeaRegion,
} from '../types'
import { FLAVOR_FINDING_KINDS } from '../types'
import { teaKinds, teaById, teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import { teaCultivars, teaCultivarById, cultivarTeaUses } from '../data/cultivars'
import { teaRegions, teaRegionById } from '../data/teaRegions'
import { cacaoOrigins, cacaoOriginById, originsForLineage } from '../data/origins'
import {
  cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones,
  traditionalGroupById, geneticGroupById, cacaoCloneById,
} from '../data/cacao'
import { teaProcessRules, chocoProcessRules } from '../data/processRules'
import { teaAxisRules, chocoAxisRules, axisNoEffectFor } from '../data/axisEffects'
import { noteById } from '../data/flavors'
import type { CacaoLayer } from './pairingContext'
import type { CompoundContext } from '../data/compounds'

// 組み合わせページ（第2層）の推測エンジン。設計: docs/design/combination-pages.md
// 第1層（分類プロファイル／品種・系統の所見／産地の所見／製法の科学）を統合して、
// 産地×品種×分類（チョコは産地×系統×種類）の具体的な組み合わせの味わいを推測する。
// 原則:
// - 根拠のないノート・味は生やさない。全ての要素に根拠（basis）と出典を持つ。
// - 推測は推測として型で区別する（level: 'inferred'）。
// - スコア化しない。強度は 弱い・普通・強い の順序尺度のみ。
// - 「存在しない組み合わせ」は選択肢の段階で作らない（viable 判定）。

export const COMBO_LEVEL_LABEL: Record<ComboLevel, string> = {
  measured: '実測・官能評価に基づく',
  general: '一般的な知見',
  inferred: '推測（未検証）',
}
export const COMBO_BASIS_FROM_LABEL: Record<ComboBasis['from'], string> = {
  profile: '分類のプロファイル',
  cultivar: '品種の所見',
  region: '産地の所見',
  origin: '産地の所見',
  lineage: '系統の所見',
  process: '製法の科学',
}

const basisLevel = (b: Basis): ComboLevel => (b === 'measured' || b === 'sensory' ? 'measured' : 'general')
const flavorFindings = (findings: EntityFinding[]) => findings.filter((f) => FLAVOR_FINDING_KINDS.includes(f.kind))
const uniq = (xs: string[]) => [...new Set(xs)]

// ===== お茶側の選択空間 =====

export interface TeaComboSel {
  /** 茶類ID（teaKinds のうち category が 'form' でないもの） */
  kindId: string
  /** '' = 指定なし / 'country:<国名>' = 国レベル / TeaRegion.id = 地域レベル */
  regionId: string
  /** '' = 指定なし */
  cultivarId: string
}

export const TEA_COMBO_KINDS = ['green', 'white', 'yellow', 'oolong', 'black', 'dark']

/** 分類の代表プロファイル（ホイールと味覚の土台）。選定理由は設計ドキュメントに記録。 */
const TEA_REPRESENTATIVE: Record<string, string> = {
  green: 'green-steamed', white: 'white-tea', yellow: 'yellow-tea',
  oolong: 'oolong-tea', black: 'black-tea', dark: 'dark-tea',
}
export const teaRepresentativeItem = (kindId: string) => {
  const id = TEA_REPRESENTATIVE[kindId]
  return id ? teaById(id) : undefined
}
/**
 * 組み合わせの土台になるアイテム。kindId は茶類（大分類）のIDのほか、
 * 具体的なお茶のアイテムID（煎茶・抹茶など）も受け付ける（2026-10-31 追加要望）。
 * アイテムを直接選んだ場合は、そのアイテムのプロファイルを土台にする。
 */
export const teaComboBaseItem = (kindId: string) => teaRepresentativeItem(kindId) ?? teaById(kindId)
/** kindId（茶類IDでもアイテムIDでもよい）から大分類を引く。 */
export const teaComboCategoryOf = (kindId: string): string =>
  TEA_COMBO_KINDS.includes(kindId) ? kindId : kindCategoryOf(teaById(kindId)?.kindId ?? kindId)
export const teaKindName = (kindId: string) => teaKinds.find((k) => k.id === kindId)?.name ?? kindId
const kindCategoryOf = (kindId: string) => {
  const k = teaKinds.find((x) => x.id === kindId)
  return !k || k.category === 'form' ? 'green' : k.category
}

// （旧 KIND_COUNTRY_EVIDENCE による国レベルの成立ゲートは、2026-10-31 の
// 成立条件修正で廃止した。分類×産地は常時成立とし、根拠の有無は
// analyzeTeaCombo の注記・根拠の内訳で正直に示す。）

export interface TeaRegionOption { id: string; label: string; country: string }
export function allTeaRegionOptions(): TeaRegionOption[] {
  const countries = [...new Set(teaCultivars.map((c) => c.country))]
  const order = ['日本', '中国', '台湾', 'インド', 'スリランカ']
  const sorted = [...countries].sort((a, b) => order.indexOf(a) - order.indexOf(b))
  return [
    ...sorted.map((c) => ({ id: `country:${c}`, label: c, country: c })),
    ...teaRegions.map((r) => ({ id: r.id, label: `${r.name}（${r.country}）`, country: r.country })),
  ]
}
export const teaRegionEntityOf = (regionId: string): TeaRegion | undefined =>
  regionId.startsWith('country:') ? undefined : teaRegionById(regionId)
export const teaRegionCountryOf = (regionId: string): string | undefined => {
  if (!regionId) return undefined
  if (regionId.startsWith('country:')) return regionId.slice('country:'.length)
  return teaRegionById(regionId)?.country
}
export const teaRegionLabelOf = (regionId: string): string => {
  if (!regionId) return ''
  const opt = allTeaRegionOptions().find((o) => o.id === regionId)
  return opt ? opt.label : regionId
}

/** 国でグループ化した産地の選択肢（国全体→その国の地域、の順）。階層式プルダウン用。 */
export interface TeaRegionGroup { country: string; options: TeaRegionOption[] }
export function teaRegionOptionGroups(sel: TeaComboSel): TeaRegionGroup[] {
  const viable = teaRegionOptions(sel)
  const order: string[] = []
  for (const o of allTeaRegionOptions()) if (!order.includes(o.country)) order.push(o.country)
  return order
    .map((country) => ({
      country,
      options: [
        ...viable.filter((o) => o.id === `country:${country}`),
        ...viable.filter((o) => o.country === country && !o.id.startsWith('country:')),
      ],
    }))
    .filter((g) => g.options.length > 0)
}

// ===== 他画面（組み合わせる／調べる）の産地セレクトの値の約束 =====
// 値: '' = 指定なし / '<国名>' = 国レベル / 'region:<TeaRegion.id>' = 地域レベル。
export const teaOriginValueOfRegion = (regionId: string) => `region:${regionId}`
export const teaOriginCountryOfValue = (value: string): string | undefined => {
  if (!value) return undefined
  if (value.startsWith('region:')) return teaRegionById(value.slice('region:'.length))?.country
  return value
}
export const teaOriginLabelOfValue = (value: string): string => {
  if (!value) return ''
  if (value.startsWith('region:')) {
    const r = teaRegionById(value.slice('region:'.length))
    return r ? r.name : value
  }
  return value
}
/** 画面の産地の値を、組み合わせエンジンの regionId（'' / 'country:<国>' / 地域id）に変換する。 */
export const teaOriginComboRegionIdOfValue = (value: string): string => {
  if (!value) return ''
  if (value.startsWith('region:')) return value.slice('region:'.length)
  return `country:${value}`
}

const teaRuleMatches = (cultivarId: string, kindId: string) =>
  teaProcessRules.some((r) => r.kindCategory === kindCategoryOf(kindId) && (r.cultivarId === undefined || r.cultivarId === cultivarId))

/**
 * その組み合わせが成立するか（ページとして開けるか／選択肢に出してよいか）。
 * 2026-10-31 実機フィードバックで修正：分類×産地（国・地域）は常時成立とする。
 * 中国×緑茶のような当然存在する組み合わせを「成立しない」扱いにするのは誤りで、
 * ページの土台は分類プロファイルであり、産地に所見があるかどうかで内容が
 * 変わる（所見の有無はページ内の正直な注記で明示する）。
 * 品種を指定する場合のみ確認を要求する：その分類で確認済み（uses）か、
 * 製法ルールで推測ページが成立すること。品種の国と、選んだ国・地域の国が
 * 一致すること。選べない品種は選択肢に出さない（「存在しない」とは言わない）。
 */
export function teaComboViable(sel: TeaComboSel): boolean {
  const base = sel.kindId ? teaComboBaseItem(sel.kindId) : undefined
  if (!sel.kindId || !base) return false
  const cultivar = sel.cultivarId ? teaCultivarById(sel.cultivarId) : undefined
  if (sel.cultivarId && !cultivar) return false
  const regionCountry = teaRegionCountryOf(sel.regionId)
  if (sel.regionId && !regionCountry) return false
  if (!cultivar) return true
  // 品種の確認は、選んだ分類そのもの・その大分類・アイテムの茶類IDの
  // いずれかで利用が確認されていればよい（アイテム直接選択に対応）。
  const category = teaComboCategoryOf(sel.kindId)
  const use = cultivarTeaUses.some((u) => u.cultivarId === cultivar.id
    && (u.kindId === sel.kindId || u.kindId === category || u.kindId === base.kindId))
  if (!use && !teaRuleMatches(cultivar.id, category)) return false
  if (regionCountry && cultivar.country !== regionCountry) return false
  return true
}

/**
 * 分類が未指定（kindId: ''）のときの成立判定：いずれかの分類で成立すればよい。
 * 調べる／組み合わせる画面で分類未指定のまま産地・品種の選択肢を出すために使う
 * （両画面で「存在するか」の基準を揃えるための部品）。
 */
export function teaComboViableAnyKind(sel: { regionId: string; cultivarId: string }): boolean {
  return TEA_COMBO_KINDS.some((k) => teaComboViable({ kindId: k, regionId: sel.regionId, cultivarId: sel.cultivarId }))
}

export function teaKindOptions(sel: TeaComboSel): string[] {
  return TEA_COMBO_KINDS.filter((k) => teaComboViable({ ...sel, kindId: k }))
}
/** 分類プルダウンの「具体的なお茶」の選択肢（アイテムを直接選べる画面用）。 */
export function teaItemOptions(sel: TeaComboSel) {
  return teaItems.filter((t) => teaComboViable({ ...sel, kindId: t.id }))
}
export function teaRegionOptions(sel: TeaComboSel): TeaRegionOption[] {
  return allTeaRegionOptions().filter((o) => teaComboViable({ ...sel, regionId: o.id }))
}
export function teaCultivarOptions(sel: TeaComboSel) {
  return teaCultivars.filter((c) => teaComboViable({ ...sel, cultivarId: c.id }))
}

export function teaComboTitle(sel: TeaComboSel): string {
  const parts: string[] = []
  if (sel.regionId) parts.push(teaRegionLabelOf(sel.regionId).replace(/（.+）$/, ''))
  if (sel.cultivarId) parts.push(teaCultivarById(sel.cultivarId)?.name ?? sel.cultivarId)
  parts.push(TEA_COMBO_KINDS.includes(sel.kindId) ? teaKindName(sel.kindId) : (teaById(sel.kindId)?.name ?? sel.kindId))
  return parts.join(' × ')
}

// ===== チョコ側の選択空間 =====

export interface ChocoComboSel {
  /** ChocolateKind */
  kind: string
  /** '' = 指定なし */
  originId: string
  lineage: { layer: CacaoLayer; id: string } | null
}

export const CHOCO_COMBO_KINDS = ['dark', 'milk', 'white', 'ruby', 'blond']
export const CHOCO_KIND_LABEL: Record<string, string> = {
  dark: 'ダーク', milk: 'ミルク', white: 'ホワイト', ruby: 'ルビー', blond: 'ブロンド', other: 'その他',
}
export const chocoRepresentativeItem = (kind: string) => chocolateItems.find((c) => c.kind === kind)

export type LineageRef = { layer: CacaoLayer; id: string; name: string }
export function allLineages(): LineageRef[] {
  return [
    ...cacaoTraditionalGroups.map((g) => ({ layer: 'traditional' as CacaoLayer, id: g.id, name: `${g.nameJa}（${g.name}）` })),
    ...cacaoGeneticGroups.map((g) => ({ layer: 'genetic' as CacaoLayer, id: g.id, name: `${g.nameJa}（${g.name}）` })),
    ...cacaoClones.map((c) => ({ layer: 'clone' as CacaoLayer, id: c.id, name: c.name })),
  ]
}
export const lineageEntityOf = (ref: { layer: CacaoLayer; id: string }) =>
  ref.layer === 'traditional' ? traditionalGroupById(ref.id) : ref.layer === 'genetic' ? geneticGroupById(ref.id) : cacaoCloneById(ref.id)

/** 系統と産地が文献・データ上で結びつくか（データ上の関連の述語。選択肢の制限には使わない）。 */
export const lineageOriginLinked = (lineage: { layer: CacaoLayer; id: string }, originId: string): boolean => {
  if (originsForLineage(lineage.layer, lineage.id).some((o) => o.id === originId)) return true
  // クローンの作出地が産地名と一致する場合も結びつきとみなす（例：IMC-67 とペルー）
  if (lineage.layer === 'clone') {
    const clone = cacaoCloneById(lineage.id)
    const origin = cacaoOriginById(originId)
    if (clone && origin && clone.origin.includes(origin.name)) return true
  }
  return false
}

/**
 * クローンについて「記録のある産地」のID一覧を、データから機械的に導く。
 * 記録の置き場所は2つだけに限定する（推測で産地を足さない）:
 * 1. 産地エンティティ側の関連付け（originsForLineage('clone', id) = relatedCloneIds）
 * 2. クローン自身の origin 欄（作出・選抜地として記録された産地名の一致）
 * 所見文中の研究実施地（例：他国での供試記録）は「そのクローンの産地」の記録とは
 * みなさない。記録が1件も無いクローンは空配列を返し、呼び出し側は絞り込みをしない。
 * 2026-10-31 時点: ccn-51 → [ecuador]、imc-67 → [peru]、ics-95 → []（作出地の
 * トリニダードは産地エンティティとして未収録のため、記録のある産地は無い）。
 */
export const cloneRecordedOriginIds = (cloneId: string): string[] => {
  const ids = new Set(originsForLineage('clone', cloneId).map((o) => o.id))
  const clone = cacaoCloneById(cloneId)
  if (clone) for (const o of cacaoOrigins) if (clone.origin.includes(o.name)) ids.add(o.id)
  return [...ids]
}

/**
 * チョコ側の成立条件（2026-10-31 実機フィードバック第2弾で自由化）。
 * 種類×産地×系統はブレンドの実態として全て「存在する」扱いとし、相互に制限しない
 * （かつての lineageOriginLinked による絞り込みは廃止）。実在するエンティティの
 * 組み合わせであれば常に成立する。唯一の例外は UI 到達可能性としてのクローンの
 * 産地制限で、そちらは chocoOriginOptions / chocoLineageOptions 側で扱い、
 * この成立空間（種類5×産地9×系統18=810通り）自体は変えない。
 */
export function chocoComboViable(sel: ChocoComboSel): boolean {
  if (!sel.kind || !chocoRepresentativeItem(sel.kind)) return false
  if (sel.originId && !cacaoOriginById(sel.originId)) return false
  if (sel.lineage && !lineageEntityOf(sel.lineage)) return false
  return true
}
export function chocoKindOptions(sel: ChocoComboSel): string[] {
  return CHOCO_COMBO_KINDS.filter((k) => chocoComboViable({ ...sel, kind: k }))
}
/**
 * 産地の選択肢（UI到達可能性）。原則は全産地を常時出す（自由化）。
 * 例外はクローン階層のみ：クローンが選ばれている場合、そのクローンについて
 * 記録のある産地だけに絞る（記録のない産地は「存在しない組み合わせ」として隠す）。
 * 記録が無いクローン（ICS-95 等）では絞らない。
 */
export function chocoOriginOptions(sel: ChocoComboSel) {
  if (sel.lineage?.layer === 'clone') {
    const recorded = cloneRecordedOriginIds(sel.lineage.id)
    if (recorded.length > 0) return cacaoOrigins.filter((o) => recorded.includes(o.id))
  }
  return [...cacaoOrigins]
}
/**
 * 系統の選択肢（UI到達可能性）。伝統分類・遺伝グループは常時全て出す（自由化）。
 * クローンは、産地が選ばれていて、そのクローンの記録産地に含まれない場合だけ隠す
 * （chocoOriginOptions の例外と対称）。記録が無いクローンは隠さない。
 */
export function chocoLineageOptions(sel: ChocoComboSel): LineageRef[] {
  return allLineages().filter((l) => {
    if (l.layer !== 'clone' || !sel.originId) return true
    const recorded = cloneRecordedOriginIds(l.id)
    return recorded.length === 0 || recorded.includes(sel.originId)
  })
}
export function chocoComboTitle(sel: ChocoComboSel): string {
  const parts: string[] = []
  if (sel.originId) parts.push(cacaoOriginById(sel.originId)?.name ?? sel.originId)
  if (sel.lineage) parts.push(allLineages().find((l) => l.layer === sel.lineage!.layer && l.id === sel.lineage!.id)?.name ?? sel.lineage.id)
  parts.push(`${CHOCO_KIND_LABEL[sel.kind] ?? sel.kind}チョコレート`)
  return parts.join(' × ')
}

// ===== 部分指定の補完（2026-10-31 第5弾・要件6） =====
// 調べる／組み合わせる画面では、3軸のうち一部だけの指定でもホイールを表示する。
// 分類（お茶）／種類（チョコ）が未指定の場合、土台になる分類を「成立する範囲で
// 最も素直な候補」から補完する。補完した場合は assumedKind で呼び出し側に知らせ、
// 画面では「○○として表示しています」と明示する（暗黙の仮定にしない）。
// 補完候補の優先順（お茶）: 品種の確認済み利用がある分類 → 地域の適用分類 →
// TEA_COMBO_KINDS の順。チョコは系統・産地の評価の土台であるダークを先頭とする
// CHOCO_COMBO_KINDS の順（全て成立するため、実質ダークで補完される）。

export interface CompletedTeaSel { sel: TeaComboSel; assumedKind: boolean }
export function completeTeaComboSel(partial: TeaComboSel): CompletedTeaSel | null {
  if (partial.kindId) {
    return teaComboViable(partial) ? { sel: partial, assumedKind: false } : null
  }
  const candidates: string[] = []
  const push = (k: string) => { if (k && !candidates.includes(k)) candidates.push(k) }
  if (partial.cultivarId) {
    for (const u of cultivarTeaUses) {
      if (u.cultivarId === partial.cultivarId) push(kindCategoryOf(u.kindId))
    }
  }
  const region = teaRegionEntityOf(partial.regionId)
  if (region) for (const k of region.applicableKindIds) push(k)
  for (const k of TEA_COMBO_KINDS) push(k)
  for (const k of candidates) {
    const sel: TeaComboSel = { ...partial, kindId: k }
    if (teaComboViable(sel)) return { sel, assumedKind: true }
  }
  return null
}

export interface CompletedChocoSel { sel: ChocoComboSel; assumedKind: boolean }
export function completeChocoComboSel(partial: ChocoComboSel): CompletedChocoSel | null {
  if (partial.kind) {
    return chocoComboViable(partial) ? { sel: partial, assumedKind: false } : null
  }
  for (const k of CHOCO_COMBO_KINDS) {
    const sel: ChocoComboSel = { ...partial, kind: k }
    if (chocoComboViable(sel)) return { sel, assumedKind: true }
  }
  return null
}

// ===== 統合（第2層の推測） =====

export interface ComboBasisGroup {
  label: string
  /** グループの説明文（プロファイルの範囲注記など） */
  text?: string
  findings: EntityFinding[]
  sourceIds: string[]
}

/** 選択した軸（産地・品種・産地・系統）がホイールにどう反映されたかの要約。
 * 反映されなかった軸についても、理由（所見が無い／所見はあるがノートへの
 * 寄与を示すものではない）を画面で分かるようにするために持つ。 */
export interface ComboAxisSummary {
  axis: 'region' | 'cultivar' | 'origin' | 'lineage'
  entityName: string
  reflected: boolean
  text: string
}

export interface ComboAnalysis {
  title: string
  /** 表示全体の格付け：推測を含む要素があれば 'inferred' */
  overallLevel: ComboLevel
  notes: ComboNote[]
  tastes: ComboTaste[]
  statements: ComboStatement[]
  groups: ComboBasisGroup[]
  caveats: ComboStatement[]
  axisSummaries: ComboAxisSummary[]
  sourceIds: string[]
  /** ホイールの化合物併記とノート詳細の階層（tier）判定に使う文脈＝土台アイテム */
  context: CompoundContext
}

const TASTE_ORDER: TasteKey[] = ['sweet', 'sour', 'bitter', 'astringent', 'umami']
export const COMBO_TASTE_LABEL: Record<TasteKey, string> = {
  sweet: '甘味', sour: '酸味', bitter: '苦味', astringent: '渋味', umami: 'うま味',
}
const INTENSITY_STEP: Intensity[] = ['weak', 'normal', 'strong']
const shiftIntensity = (i: Intensity, dir: 'milder' | 'stronger'): Intensity => {
  const idx = INTENSITY_STEP.indexOf(i)
  if (idx < 0) return i
  const next = dir === 'milder' ? idx - 1 : idx + 1
  return INTENSITY_STEP[Math.max(0, Math.min(INTENSITY_STEP.length - 1, next))]
}

// ノート・味覚への効果の統一形。材料は2系統ある:
// - 軸の所見からの変換（axisEffects.ts）: from は軸（region/cultivar/origin/lineage）、
//   level は知見の性質どおり（measured/general/inferred）。
// - 製法の科学からの変換（processRules.ts）: from は 'process'、level は常に
//   'inferred'（読み替えは推測として扱う、という従来の原則）。
// 適用順は「軸の所見 → 製法の科学」（対象固有の知見を土台に、読み替えを重ねる）。
interface NoteEffectU {
  trackId: string
  noteId: string
  mode: 'add' | 'emphasize'
  intensity?: 'weak' | 'normal'
  shift?: 'stronger' | 'milder'
  level: ComboLevel
  from: ComboBasis['from']
  text: string
  sourceIds: string[]
}
interface TasteEffectU {
  trackId: string
  key: TasteKey
  direction: 'milder' | 'stronger'
  level: ComboLevel
  text: string
  sourceIds: string[]
}

function buildNotes(
  baseAromas: { noteId: string; intensity: Intensity; basis: Basis; sourceIds: string[] }[],
  baseDescription: string,
  effects: NoteEffectU[],
  applied: Set<string>,
): ComboNote[] {
  const notes: ComboNote[] = baseAromas.map((a) => ({
    noteId: a.noteId,
    intensity: a.intensity,
    level: basisLevel(a.basis),
    basis: [{ from: 'profile', text: baseDescription, sourceIds: a.sourceIds }],
    sourceIds: [...a.sourceIds],
  }))
  for (const ef of effects) {
    const existing = notes.find((n) => n.noteId === ef.noteId)
    if (existing) {
      existing.basis.push({ from: ef.from, text: ef.text, sourceIds: ef.sourceIds })
      existing.sourceIds = uniq([...existing.sourceIds, ...ef.sourceIds])
      if (ef.shift) {
        existing.intensity = shiftIntensity(existing.intensity, ef.shift)
        existing.level = ef.level
      } else if (ef.level === 'measured' && existing.level === 'general') {
        // 対象自身の試料での寄与・官能の実測が裏付ける場合は、根拠を実測に格上げする
        existing.level = 'measured'
      }
      applied.add(ef.trackId)
    } else if (ef.mode === 'add') {
      notes.push({
        noteId: ef.noteId,
        intensity: ef.intensity ?? 'weak',
        level: ef.level,
        basis: [{ from: ef.from, text: ef.text, sourceIds: ef.sourceIds }],
        sourceIds: [...ef.sourceIds],
      })
      applied.add(ef.trackId)
    }
  }
  return notes
}

function buildTastes(
  baseTastes: Record<TasteKey, { intensity: Intensity; basis: Basis; sourceIds: string[] }>,
  baseDescription: string,
  effects: TasteEffectU[],
  extraStatements: ComboStatement[],
  applied: Set<string>,
): ComboTaste[] {
  const tastes: ComboTaste[] = []
  for (const key of TASTE_ORDER) {
    const t = baseTastes[key]
    if (!t || t.intensity === 'unknown') continue
    tastes.push({ key, intensity: t.intensity, level: basisLevel(t.basis), text: baseDescription, sourceIds: [...t.sourceIds] })
  }
  for (const ef of effects) {
    const existing = tastes.find((t) => t.key === ef.key)
    if (existing) {
      existing.intensity = shiftIntensity(existing.intensity, ef.direction)
      existing.level = ef.level
      existing.text = ef.text
      existing.sourceIds = uniq([...existing.sourceIds, ...ef.sourceIds])
      applied.add(ef.trackId)
    } else {
      extraStatements.push({
        text: `${ef.text}（ただし分類の代表プロファイルに${COMBO_TASTE_LABEL[ef.key]}の記録がないため、強さの目安は示しません）`,
        level: ef.level, sourceIds: ef.sourceIds,
      })
    }
  }
  return tastes
}

// ===== 軸ごとの反映要約 =====

interface EffectMeta { axis: string; kind: 'note' | 'taste'; label: string }

function summarizeAxis(
  axis: ComboAxisSummary['axis'],
  entityName: string,
  flavorFindingCount: number,
  applied: Set<string>,
  meta: Map<string, EffectMeta>,
  statementsOnly: boolean,
  noEffectText?: string,
): ComboAxisSummary {
  const noteNames: string[] = []
  const tasteLabels: string[] = []
  for (const id of applied) {
    const m = meta.get(id)
    if (!m || m.axis !== axis) continue
    const list = m.kind === 'note' ? noteNames : tasteLabels
    if (!list.includes(m.label)) list.push(m.label)
  }
  if (noteNames.length + tasteLabels.length > 0) {
    return {
      axis, entityName, reflected: true,
      text: `「${entityName}」の所見は、ホイール・味覚に反映されています（${[...noteNames, ...tasteLabels].join('、')}）。根拠は各ノート・味覚の内訳をご覧ください。`,
    }
  }
  if (statementsOnly) {
    return {
      axis, entityName, reflected: true,
      text: `「${entityName}」については、製法の科学からの読み替えが「味わいの要約」に反映されています。ホイールのノートそのものは、分類プロファイルのままです。`,
    }
  }
  if (noEffectText) {
    return { axis, entityName, reflected: false, text: noEffectText }
  }
  if (flavorFindingCount > 0) {
    return {
      axis, entityName, reflected: false,
      text: `「${entityName}」の香味の所見はありますが、特定の香りのノートへの寄与を示すものではないため、ホイールのノートには反映していません。所見そのものは詳細ページの「根拠の内訳」にあります。`,
    }
  }
  return {
    axis, entityName, reflected: false,
    text: `「${entityName}」については香味の科学的な所見が確認できていないため、この軸はホイールの推測に使っていません。`,
  }
}

const INTERACTION_CAVEAT_SOURCES = ['jiang-2018-congou-theaflavins', 'yang-2025-huangjinya-altitude-process', 'owuor-2008-region-clonal-black-tea']
const interactionCaveat = (): ComboStatement => ({
  text: '品種×産地×製法の間には交互作用があることが実測で示されています（同一品種でも地域でテアフラビン生成や発酵の進み方が変わり、標高によっては成分変化の方向が逆転することもあります）。そのためこのページの推測は「各層の単純な足し算」ではなく、方向の目安として読んでください。',
  level: 'inferred', sourceIds: INTERACTION_CAVEAT_SOURCES,
})

function finalize(
  title: string, notes: ComboNote[], tastes: ComboTaste[],
  statements: ComboStatement[], groups: ComboBasisGroup[], caveats: ComboStatement[],
  axisSummaries: ComboAxisSummary[],
  context: CompoundContext,
): ComboAnalysis {
  const sourceIds = uniq([
    ...notes.flatMap((n) => n.sourceIds),
    ...tastes.flatMap((t) => t.sourceIds),
    ...statements.flatMap((s) => s.sourceIds),
    ...groups.flatMap((g) => g.sourceIds),
    ...caveats.flatMap((c) => c.sourceIds),
  ])
  const hasInferred = notes.some((n) => n.level === 'inferred') || tastes.some((t) => t.level === 'inferred') || statements.some((s) => s.level === 'inferred')
  const hasMeasured = notes.some((n) => n.level === 'measured') || tastes.some((t) => t.level === 'measured')
    || statements.some((s) => s.level === 'measured') || groups.some((g) => g.findings.length > 0)
  return {
    title,
    overallLevel: hasInferred ? 'inferred' : hasMeasured ? 'measured' : 'general',
    notes, tastes, statements, groups, caveats, axisSummaries, sourceIds, context,
  }
}

/**
 * 組み合わせ分析（第2層）を FlavorProfile の形に戻す（第3層＝ペアリングの入力用）。
 * 香りは分析のノート集合そのもの、味覚は土台を分析の味覚で上書きする。
 * level → basis の写像: measured→measured、それ以外→general。
 * inferred（推測）かどうかは basis では表せないため、呼び出し側は組み合わせ分析
 * 自体の overallLevel / axisSummaries を併せて表示し、階層の正直さを保つこと。
 */
const COMBO_LEVEL_TO_BASIS: Record<ComboLevel, Basis> = {
  measured: 'measured',
  general: 'general',
  inferred: 'general',
}

export function comboProfileOf(analysis: ComboAnalysis, base: FlavorProfile): FlavorProfile {
  const tastes: FlavorProfile['tastes'] = { ...base.tastes }
  for (const t of analysis.tastes) {
    tastes[t.key] = { intensity: t.intensity, basis: COMBO_LEVEL_TO_BASIS[t.level], sourceIds: [...t.sourceIds] }
  }
  return {
    aromas: analysis.notes.map((n) => ({
      noteId: n.noteId, intensity: n.intensity, basis: COMBO_LEVEL_TO_BASIS[n.level], sourceIds: [...n.sourceIds],
    })),
    tastes,
    temporal: base.temporal,
  }
}

export function analyzeTeaCombo(sel: TeaComboSel): ComboAnalysis {
  const rep = teaComboBaseItem(sel.kindId)!
  const itemSelected = !TEA_COMBO_KINDS.includes(sel.kindId)
  const category = teaComboCategoryOf(sel.kindId)
  const kindName = itemSelected ? rep.name : teaKindName(sel.kindId)
  const cultivar = sel.cultivarId ? teaCultivarById(sel.cultivarId) : undefined
  const region = teaRegionEntityOf(sel.regionId)
  const regionCountry = teaRegionCountryOf(sel.regionId)
  const rules = teaProcessRules.filter((r) =>
    r.kindCategory === category && (r.cultivarId === undefined || r.cultivarId === sel.cultivarId))
  const axisRules = teaAxisRules.filter((r) =>
    (r.kindCategory === undefined || r.kindCategory === category)
    && ((r.axis === 'region' && region && r.entityId === region.id)
      || (r.axis === 'cultivar' && cultivar && r.entityId === cultivar.id)))
  const baseDesc = itemSelected
    ? `${rep.name}のプロファイル（茶類・製法レベル）に記録された香りです。個別の産地・品種での実測ではありません。`
    : `${kindName}の代表プロファイル（${rep.name}）に記録された香りです。個別の産地・品種での実測ではありません。`
  // 効果の適用追跡（軸ごとの反映要約のため）
  const applied = new Set<string>()
  const effectMeta = new Map<string, EffectMeta>()
  const noteEffectsU: NoteEffectU[] = []
  const tasteEffectsU: TasteEffectU[] = []
  for (const r of axisRules) {
    for (const e of r.noteEffects) {
      const trackId = `${r.id}:${e.noteId}`
      noteEffectsU.push({ trackId, noteId: e.noteId, mode: e.mode, intensity: e.intensity, shift: e.shift, level: e.level, from: r.axis, text: e.text, sourceIds: e.sourceIds })
      effectMeta.set(trackId, { axis: r.axis, kind: 'note', label: noteById(e.noteId)?.name ?? e.noteId })
    }
    for (const e of r.tasteEffects) {
      const trackId = `${r.id}:taste:${e.key}`
      tasteEffectsU.push({ trackId, key: e.key, direction: e.direction, level: e.level, text: e.text, sourceIds: e.sourceIds })
      effectMeta.set(trackId, { axis: r.axis, kind: 'taste', label: COMBO_TASTE_LABEL[e.key] })
    }
  }
  for (const r of rules) {
    for (const e of r.noteEffects) {
      const trackId = `process:${r.id}:${e.noteId}`
      noteEffectsU.push({ trackId, noteId: e.noteId, mode: e.mode, intensity: e.intensity, level: 'inferred', from: 'process', text: e.text, sourceIds: e.sourceIds })
      effectMeta.set(trackId, { axis: r.cultivarId ? 'cultivar' : 'none', kind: 'note', label: noteById(e.noteId)?.name ?? e.noteId })
    }
    for (const e of r.tasteEffects) {
      const trackId = `process:${r.id}:taste:${e.key}`
      tasteEffectsU.push({ trackId, key: e.key, direction: e.direction, level: 'inferred', text: e.text, sourceIds: e.sourceIds })
      effectMeta.set(trackId, { axis: r.cultivarId ? 'cultivar' : 'none', kind: 'taste', label: COMBO_TASTE_LABEL[e.key] })
    }
  }
  const notes = buildNotes(rep.profile.aromas, baseDesc, noteEffectsU, applied)
  const extraStatements: ComboStatement[] = []
  const tastes = buildTastes(rep.profile.tastes, itemSelected ? `${rep.name}のプロファイル（茶類・製法レベル）に記録された味覚です。` : `${kindName}の代表プロファイル（${rep.name}）に記録された味覚です。`, tasteEffectsU, extraStatements, applied)

  const statements: ComboStatement[] = []
  for (const r of rules) statements.push(...r.statements)
  statements.push(...extraStatements)
  if (region && !region.applicableKindIds.includes(category)) {
    statements.push({
      text: `${region.name}の地域としての所見は主に${region.applicableKindIds.map(teaKindName).join('・')}についてのもので、この分類（${kindName}）での${region.name}産の実測は確認できていません。${region.name}については、地域の所見を文脈として併記するに留め、味わいの中心は品種と製法の科学からの推測です。`,
      level: 'inferred', sourceIds: region.sourceIds,
    })
  }
  if (region && region.applicableKindIds.includes(category)) {
    statements.push({
      text: `${region.name}の${kindName}については、地域の実試料に基づく成分データがあります（詳細は下の「根拠の内訳：産地の所見」）。地域の実測の足場がある点で、他の多くの組み合わせより根拠が強い組み合わせです。`,
      level: 'measured', sourceIds: region.sourceIds,
    })
  }

  const groups: ComboBasisGroup[] = [
    { label: '分類のプロファイル', text: rep.scopeNote, findings: [], sourceIds: rep.sourceIds },
  ]
  if (cultivar) {
    groups.push({
      label: '品種の所見', text: cultivar.scienceNote,
      findings: flavorFindings(cultivar.findings), sourceIds: cultivar.sourceIds,
    })
  }
  if (region) {
    groups.push({
      label: '産地の所見', text: region.scienceNote,
      findings: region.findings, sourceIds: region.sourceIds,
    })
  } else if (regionCountry) {
    groups.push({
      label: '産地の所見',
      text: `${regionCountry}については国レベルの指定です。この分類・品種との組み合わせで使える産地固有の香味データは収録していないため、産地の情報は味わいの推測には使っていません。`,
      findings: [], sourceIds: [],
    })
  }
  if (rules.length > 0) {
    groups.push({
      label: '製法の科学',
      text: `適用した変換ルール：${rules.map((r) => r.id).join('、')}。品種の性質をこの分類への加工でどう読み替えるかは、調査記録（docs/research/literature-expansion-d-combinations.md）に根拠があります。`,
      findings: [], sourceIds: uniq(rules.flatMap((r) => [...r.noteEffects.flatMap((e) => e.sourceIds), ...r.tasteEffects.flatMap((e) => e.sourceIds), ...r.statements.flatMap((s) => s.sourceIds)])),
    })
  }

  const caveats: ComboStatement[] = []
  const use = cultivar ? cultivarTeaUses.find((u) => u.cultivarId === cultivar.id && (u.kindId === sel.kindId || u.kindId === category || u.kindId === rep.kindId)) : undefined
  if (cultivar && !use) {
    caveats.push({
      text: `${cultivar.name}を${kindName}に加工したことは、公的資料・研究では未確認です。このページは、品種の所見と製法の科学から「作ればどうなるか」を推測したもので、実在の製品の実測ではありません。`,
      level: 'inferred', sourceIds: [],
    })
  }
  if ((region && cultivar) || rules.length > 0) caveats.push(interactionCaveat())

  const axisSummaries: ComboAxisSummary[] = []
  if (region) {
    axisSummaries.push(summarizeAxis('region', region.name, flavorFindings(region.findings).length, applied, effectMeta, false,
      axisNoEffectFor('region', region.id, { kindCategory: category })?.text))
  } else if (regionCountry) {
    axisSummaries.push({
      axis: 'region', entityName: regionCountry, reflected: false,
      text: `産地は国レベル（${regionCountry}）の指定です。国レベルの香味データは収録していないため、産地の情報はホイールに反映していません。`,
    })
  }
  if (cultivar) {
    const cultivarOutcome = [...applied].some((id) => effectMeta.get(id)?.axis === 'cultivar')
    axisSummaries.push(summarizeAxis('cultivar', cultivar.name, flavorFindings(cultivar.findings).length, applied, effectMeta,
      !cultivarOutcome && rules.some((r) => r.cultivarId === cultivar.id),
      axisNoEffectFor('cultivar', cultivar.id)?.text))
  }
  return finalize(teaComboTitle(sel), notes, tastes, statements, groups, caveats, axisSummaries,
    { side: 'tea', kindId: rep.kindId, itemName: rep.name, itemId: rep.id })
}

export function analyzeChocoCombo(sel: ChocoComboSel): ComboAnalysis {
  const rep = chocoRepresentativeItem(sel.kind)!
  const origin = sel.originId ? cacaoOriginById(sel.originId) : undefined
  const lineageRef = sel.lineage
  const entity = lineageRef ? lineageEntityOf(lineageRef) : undefined
  const rules = lineageRef ? chocoProcessRules.filter((r) => r.lineageLayer === lineageRef.layer && r.lineageId === lineageRef.id) : []
  const axisRules = chocoAxisRules.filter((r) =>
    (r.kinds === undefined || r.kinds.includes(sel.kind))
    && ((r.axis === 'origin' && origin && r.entityId === origin.id)
      || (r.axis === 'lineage' && lineageRef && r.lineageLayer === lineageRef.layer && r.entityId === lineageRef.id)))
  const baseDesc = `${CHOCO_KIND_LABEL[sel.kind]}チョコレートの代表プロファイル（${rep.name}）に記録された香りです。個別の産地・系統での実測ではありません。`
  // 効果の適用追跡（軸ごとの反映要約のため）
  const applied = new Set<string>()
  const effectMeta = new Map<string, EffectMeta>()
  const noteEffectsU: NoteEffectU[] = []
  const tasteEffectsU: TasteEffectU[] = []
  for (const r of axisRules) {
    for (const e of r.noteEffects) {
      const trackId = `${r.id}:${e.noteId}`
      noteEffectsU.push({ trackId, noteId: e.noteId, mode: e.mode, intensity: e.intensity, shift: e.shift, level: e.level, from: r.axis, text: e.text, sourceIds: e.sourceIds })
      effectMeta.set(trackId, { axis: r.axis, kind: 'note', label: noteById(e.noteId)?.name ?? e.noteId })
    }
    for (const e of r.tasteEffects) {
      const trackId = `${r.id}:taste:${e.key}`
      tasteEffectsU.push({ trackId, key: e.key, direction: e.direction, level: e.level, text: e.text, sourceIds: e.sourceIds })
      effectMeta.set(trackId, { axis: r.axis, kind: 'taste', label: COMBO_TASTE_LABEL[e.key] })
    }
  }
  for (const r of rules) {
    for (const e of r.noteEffects) {
      const trackId = `process:${r.id}:${e.noteId}`
      noteEffectsU.push({ trackId, noteId: e.noteId, mode: e.mode, intensity: e.intensity, level: 'inferred', from: 'process', text: e.text, sourceIds: e.sourceIds })
      effectMeta.set(trackId, { axis: 'lineage', kind: 'note', label: noteById(e.noteId)?.name ?? e.noteId })
    }
    for (const e of r.tasteEffects) {
      const trackId = `process:${r.id}:taste:${e.key}`
      tasteEffectsU.push({ trackId, key: e.key, direction: e.direction, level: 'inferred', text: e.text, sourceIds: e.sourceIds })
      effectMeta.set(trackId, { axis: 'lineage', kind: 'taste', label: COMBO_TASTE_LABEL[e.key] })
    }
  }
  const notes = buildNotes(rep.profile.aromas, baseDesc, noteEffectsU, applied)
  const extraStatements: ComboStatement[] = []
  const tastes = buildTastes(rep.profile.tastes, `${CHOCO_KIND_LABEL[sel.kind]}チョコレートの代表プロファイル（${rep.name}）に記録された味覚です。`, tasteEffectsU, extraStatements, applied)

  const statements: ComboStatement[] = []
  for (const r of rules) statements.push(...r.statements)
  statements.push(...extraStatements)
  if (lineageRef && origin) {
    statements.push({
      text: '同一産地内でも系統によって官能が分かれることが統制研究で示されていますが、その系統差は未発酵では現れず、発酵を経て現れます。また、産地差の一部は遺伝ではなく発酵環境（微生物叢・pH・温度）で説明できます。このページの産地と系統の重ね合わせは、その相互作用を踏まえた推測です。',
      level: 'inferred', sourceIds: ['trognitz-2013-waslala-cacao-genotype', 'gopaulchan-2025-colombia-cacao-fermentation'],
    })
  }

  const groups: ComboBasisGroup[] = [
    { label: '分類（種類）のプロファイル', text: rep.scopeNote, findings: [], sourceIds: rep.sourceIds },
  ]
  if (entity) {
    groups.push({
      label: '系統の所見', text: entity.scienceNote,
      findings: flavorFindings(entity.findings), sourceIds: entity.sourceIds,
    })
  }
  if (origin) {
    groups.push({
      label: '産地の所見', text: origin.scienceNote,
      findings: flavorFindings(origin.findings), sourceIds: origin.sourceIds,
    })
  }
  if (rules.length > 0) {
    groups.push({
      label: '製法の科学',
      text: `適用した変換ルール：${rules.map((r) => r.id).join('、')}。`,
      findings: [], sourceIds: uniq(rules.flatMap((r) => [...r.noteEffects.flatMap((e) => e.sourceIds), ...r.tasteEffects.flatMap((e) => e.sourceIds), ...r.statements.flatMap((s) => s.sourceIds)])),
    })
  }

  const caveats: ComboStatement[] = []
  if (origin && origin.flavorEvidence === 'none') {
    caveats.push({
      text: `${origin.name}については香味の科学データが未確認のため、産地の情報は味わいの推測に使っていません。産地名だけで香味を語ることはしません。`,
      level: 'general', sourceIds: [],
    })
  }
  if (entity && flavorFindings(entity.findings).length === 0) {
    caveats.push({
      text: `この系統については香味の科学データが未確認のため、系統の情報は味わいの推測に使っていません。遺伝的分類だけから味を断定することはしません。`,
      level: 'general', sourceIds: [],
    })
  }
  if (lineageRef && origin) caveats.push(interactionCaveat())

  const axisSummaries: ComboAxisSummary[] = []
  if (origin) {
    axisSummaries.push(summarizeAxis('origin', origin.name, flavorFindings(origin.findings).length, applied, effectMeta, false,
      axisNoEffectFor('origin', origin.id)?.text))
  }
  if (entity && lineageRef) {
    const lineageName = allLineages().find((l) => l.layer === lineageRef.layer && l.id === lineageRef.id)?.name ?? lineageRef.id
    const lineageOutcome = [...applied].some((id) => effectMeta.get(id)?.axis === 'lineage')
    axisSummaries.push(summarizeAxis('lineage', lineageName, flavorFindings(entity.findings).length, applied, effectMeta,
      !lineageOutcome && rules.length > 0,
      axisNoEffectFor('lineage', entity.id, { lineageLayer: lineageRef.layer })?.text))
  }
  return finalize(chocoComboTitle(sel), notes, tastes, statements, groups, caveats, axisSummaries,
    { side: 'chocolate', kindId: rep.kind, itemName: rep.name, itemId: rep.id })
}

// ===== 兄弟組み合わせ =====

export interface ComboSibling<T> { relation: string; title: string; sel: T }

export function teaComboSiblings(sel: TeaComboSel): ComboSibling<TeaComboSel>[] {
  const out: ComboSibling<TeaComboSel>[] = []
  if (sel.cultivarId) {
    for (const k of teaKindOptions({ ...sel, kindId: '' })) {
      if (k === sel.kindId) continue
      const s = { ...sel, kindId: k }
      out.push({ relation: '同じ品種・分類違い', title: teaComboTitle(s), sel: s })
    }
  }
  if (sel.regionId) {
    for (const o of teaRegionOptions({ ...sel, regionId: '' })) {
      if (o.id === sel.regionId) continue
      const s = { ...sel, regionId: o.id }
      out.push({ relation: '同じ分類・産地違い', title: teaComboTitle(s), sel: s })
    }
    if (sel.regionId) out.push({ relation: '産地を指定しない場合', title: teaComboTitle({ ...sel, regionId: '' }), sel: { ...sel, regionId: '' } })
  }
  if (sel.kindId) {
    for (const c of teaCultivarOptions({ ...sel, cultivarId: '' })) {
      if (c.id === sel.cultivarId) continue
      const s = { ...sel, cultivarId: c.id }
      out.push({ relation: '同じ分類・品種違い', title: teaComboTitle(s), sel: s })
    }
  }
  return out.slice(0, 12)
}

export function chocoComboSiblings(sel: ChocoComboSel): ComboSibling<ChocoComboSel>[] {
  const out: ComboSibling<ChocoComboSel>[] = []
  for (const k of chocoKindOptions({ ...sel, kind: '' })) {
    if (k === sel.kind) continue
    const s = { ...sel, kind: k }
    out.push({ relation: '同じ系統・産地で種類違い', title: chocoComboTitle(s), sel: s })
  }
  if (sel.originId) {
    for (const o of chocoOriginOptions({ ...sel, originId: '' })) {
      if (o.id === sel.originId) continue
      const s = { ...sel, originId: o.id }
      out.push({ relation: '同じ系統・種類で産地違い', title: chocoComboTitle(s), sel: s })
    }
  }
  if (sel.lineage) {
    for (const l of chocoLineageOptions({ ...sel, lineage: null })) {
      if (sel.lineage && l.layer === sel.lineage.layer && l.id === sel.lineage.id) continue
      const s = { ...sel, lineage: { layer: l.layer, id: l.id } }
      out.push({ relation: '同じ産地・種類で系統違い', title: chocoComboTitle(s), sel: s })
    }
  }
  return out.slice(0, 12)
}

/** 組み合わせ選択を URL ハッシュ用の文字列にする（'-' は未指定） */
export const teaComboPath = (sel: TeaComboSel) =>
  `combo/tea/${sel.kindId}.${sel.regionId || '-'}.${sel.cultivarId || '-'}`
export const chocoComboPath = (sel: ChocoComboSel) =>
  `combo/choco/${sel.kind}.${sel.originId || '-'}.${sel.lineage ? `${sel.lineage.layer}:${sel.lineage.id}` : '-'}`
export function parseTeaComboSub(sub?: string): TeaComboSel {
  const [kindId = '', regionId = '-', cultivarId = '-'] = (sub ?? '').split('.')
  return { kindId, regionId: regionId === '-' ? '' : regionId, cultivarId: cultivarId === '-' ? '' : cultivarId }
}
export function parseChocoComboSub(sub?: string): ChocoComboSel {
  const [kind = '', originId = '-', lineagePart = '-'] = (sub ?? '').split('.')
  let lineage: ChocoComboSel['lineage'] = null
  if (lineagePart !== '-') {
    const [layer, id] = lineagePart.split(':') as [CacaoLayer, string]
    if (layer && id) lineage = { layer, id }
  }
  return { kind, originId: originId === '-' ? '' : originId, lineage }
}
