import type {
  Basis, ComboBasis, ComboLevel, ComboNote, ComboStatement, ComboTaste, EntityFinding,
  Intensity, TasteKey, TeaRegion,
} from '../types'
import { FLAVOR_FINDING_KINDS } from '../types'
import { teaKinds, teaById } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import { teaCultivars, teaCultivarById, cultivarTeaUses } from '../data/cultivars'
import { teaRegions, teaRegionById } from '../data/teaRegions'
import { cacaoOrigins, cacaoOriginById, originsForLineage } from '../data/origins'
import {
  cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones,
  traditionalGroupById, geneticGroupById, cacaoCloneById,
} from '../data/cacao'
import { teaProcessRules, chocoProcessRules } from '../data/processRules'
import type { CacaoLayer } from './pairingContext'

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
export const teaKindName = (kindId: string) => teaKinds.find((k) => k.id === kindId)?.name ?? kindId
const kindCategoryOf = (kindId: string) => {
  const k = teaKinds.find((x) => x.id === kindId)
  return !k || k.category === 'form' ? 'green' : k.category
}

/** 分類と国の結びつきの根拠（teas.ts の収録アイテムの産地・呼称に基づく）。
 * 国レベルの産地指定がその分類で意味を持つのは、この根拠がある場合に限る。 */
const KIND_COUNTRY_EVIDENCE: Record<string, string[]> = {
  green: ['日本', '中国'],
  white: ['中国'],
  yellow: ['中国'],
  oolong: ['中国', '台湾'],
  black: ['中国', 'インド', 'スリランカ'],
  dark: ['中国'],
}

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

const teaRuleMatches = (cultivarId: string, kindId: string) =>
  teaProcessRules.some((r) => r.kindCategory === kindCategoryOf(kindId) && (r.cultivarId === undefined || r.cultivarId === cultivarId))

/** その組み合わせに「言うべきことの根拠」が存在するか（選択肢に出してよいか）。 */
export function teaComboViable(sel: TeaComboSel): boolean {
  if (!sel.kindId || !teaRepresentativeItem(sel.kindId)) return false
  const cultivar = sel.cultivarId ? teaCultivarById(sel.cultivarId) : undefined
  if (sel.cultivarId && !cultivar) return false
  const regionCountry = teaRegionCountryOf(sel.regionId)
  if (sel.regionId && !regionCountry) return false
  const region = teaRegionEntityOf(sel.regionId)
  if (cultivar) {
    const use = cultivarTeaUses.some((u) => u.cultivarId === cultivar.id && u.kindId === sel.kindId)
    if (!use && !teaRuleMatches(cultivar.id, sel.kindId)) return false
    if (regionCountry && cultivar.country !== regionCountry) return false
    return true
  }
  if (sel.regionId) {
    if (region && region.applicableKindIds.includes(sel.kindId)) return true
    if ((KIND_COUNTRY_EVIDENCE[sel.kindId] ?? []).includes(regionCountry!)) return true
    return teaCultivars.some((c) =>
      c.country === regionCountry
      && (cultivarTeaUses.some((u) => u.cultivarId === c.id && u.kindId === sel.kindId) || teaRuleMatches(c.id, sel.kindId)))
  }
  return true
}

export function teaKindOptions(sel: TeaComboSel): string[] {
  return TEA_COMBO_KINDS.filter((k) => teaComboViable({ ...sel, kindId: k }))
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
  parts.push(teaKindName(sel.kindId))
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

const lineageOriginLinked = (lineage: { layer: CacaoLayer; id: string }, originId: string): boolean => {
  if (originsForLineage(lineage.layer, lineage.id).some((o) => o.id === originId)) return true
  // クローンの作出地が産地名と一致する場合も結びつきとみなす（例：IMC-67 とペルー）
  if (lineage.layer === 'clone') {
    const clone = cacaoCloneById(lineage.id)
    const origin = cacaoOriginById(originId)
    if (clone && origin && clone.origin.includes(origin.name)) return true
  }
  return false
}

export function chocoComboViable(sel: ChocoComboSel): boolean {
  if (!sel.kind || !chocoRepresentativeItem(sel.kind)) return false
  if (sel.originId && !cacaoOriginById(sel.originId)) return false
  if (sel.lineage && !lineageEntityOf(sel.lineage)) return false
  if (sel.originId && sel.lineage && !lineageOriginLinked(sel.lineage, sel.originId)) return false
  return true
}
export function chocoKindOptions(sel: ChocoComboSel): string[] {
  return CHOCO_COMBO_KINDS.filter((k) => chocoComboViable({ ...sel, kind: k }))
}
export function chocoOriginOptions(sel: ChocoComboSel) {
  return cacaoOrigins.filter((o) => chocoComboViable({ ...sel, originId: o.id }))
}
export function chocoLineageOptions(sel: ChocoComboSel): LineageRef[] {
  return allLineages().filter((l) => chocoComboViable({ ...sel, lineage: { layer: l.layer, id: l.id } }))
}
export function chocoComboTitle(sel: ChocoComboSel): string {
  const parts: string[] = []
  if (sel.originId) parts.push(cacaoOriginById(sel.originId)?.name ?? sel.originId)
  if (sel.lineage) parts.push(allLineages().find((l) => l.layer === sel.lineage!.layer && l.id === sel.lineage!.id)?.name ?? sel.lineage.id)
  parts.push(`${CHOCO_KIND_LABEL[sel.kind] ?? sel.kind}チョコレート`)
  return parts.join(' × ')
}

// ===== 統合（第2層の推測） =====

export interface ComboBasisGroup {
  label: string
  /** グループの説明文（プロファイルの範囲注記など） */
  text?: string
  findings: EntityFinding[]
  sourceIds: string[]
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
  sourceIds: string[]
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

interface NoteEffectLike { noteId: string; mode: 'add' | 'emphasize'; intensity?: 'weak' | 'normal'; text: string; sourceIds: string[] }
interface TasteEffectLike { key: TasteKey; direction: 'milder' | 'stronger'; text: string; sourceIds: string[] }

function buildNotes(
  baseAromas: { noteId: string; intensity: Intensity; basis: Basis; sourceIds: string[] }[],
  baseDescription: string,
  effects: NoteEffectLike[],
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
      existing.basis.push({ from: 'process', text: ef.text, sourceIds: ef.sourceIds })
      existing.sourceIds = uniq([...existing.sourceIds, ...ef.sourceIds])
    } else if (ef.mode === 'add') {
      notes.push({
        noteId: ef.noteId,
        intensity: ef.intensity ?? 'weak',
        level: 'inferred',
        basis: [{ from: 'process', text: ef.text, sourceIds: ef.sourceIds }],
        sourceIds: [...ef.sourceIds],
      })
    }
  }
  return notes
}

function buildTastes(
  baseTastes: Record<TasteKey, { intensity: Intensity; basis: Basis; sourceIds: string[] }>,
  baseDescription: string,
  effects: TasteEffectLike[],
  extraStatements: ComboStatement[],
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
      existing.level = 'inferred'
      existing.text = ef.text
      existing.sourceIds = uniq([...existing.sourceIds, ...ef.sourceIds])
    } else {
      extraStatements.push({
        text: `${ef.text}（ただし分類の代表プロファイルに${COMBO_TASTE_LABEL[ef.key]}の記録がないため、強さの目安は示しません）`,
        level: 'inferred', sourceIds: ef.sourceIds,
      })
    }
  }
  return tastes
}

const INTERACTION_CAVEAT_SOURCES = ['jiang-2018-congou-theaflavins', 'yang-2025-huangjinya-altitude-process', 'owuor-2008-region-clonal-black-tea']
const interactionCaveat = (): ComboStatement => ({
  text: '品種×産地×製法の間には交互作用があることが実測で示されています（同一品種でも地域でテアフラビン生成や発酵の進み方が変わり、標高によっては成分変化の方向が逆転することもあります）。そのためこのページの推測は「各層の単純な足し算」ではなく、方向の目安として読んでください。',
  level: 'inferred', sourceIds: INTERACTION_CAVEAT_SOURCES,
})

function finalize(
  title: string, notes: ComboNote[], tastes: ComboTaste[],
  statements: ComboStatement[], groups: ComboBasisGroup[], caveats: ComboStatement[],
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
    notes, tastes, statements, groups, caveats, sourceIds,
  }
}

export function analyzeTeaCombo(sel: TeaComboSel): ComboAnalysis {
  const rep = teaRepresentativeItem(sel.kindId)!
  const kindName = teaKindName(sel.kindId)
  const cultivar = sel.cultivarId ? teaCultivarById(sel.cultivarId) : undefined
  const region = teaRegionEntityOf(sel.regionId)
  const regionCountry = teaRegionCountryOf(sel.regionId)
  const rules = teaProcessRules.filter((r) =>
    r.kindCategory === kindCategoryOf(sel.kindId) && (r.cultivarId === undefined || r.cultivarId === sel.cultivarId))
  const baseDesc = `${kindName}の代表プロファイル（${rep.name}）に記録された香りです。個別の産地・品種での実測ではありません。`
  const notes = buildNotes(rep.profile.aromas, baseDesc, rules.flatMap((r) => r.noteEffects))
  const extraStatements: ComboStatement[] = []
  const tastes = buildTastes(rep.profile.tastes, `${kindName}の代表プロファイル（${rep.name}）に記録された味覚です。`, rules.flatMap((r) => r.tasteEffects), extraStatements)

  const statements: ComboStatement[] = []
  for (const r of rules) statements.push(...r.statements)
  statements.push(...extraStatements)
  if (region && !region.applicableKindIds.includes(sel.kindId)) {
    statements.push({
      text: `${region.name}の地域としての所見は主に${region.applicableKindIds.map(teaKindName).join('・')}についてのもので、この分類（${kindName}）での${region.name}産の実測は確認できていません。${region.name}については、地域の所見を文脈として併記するに留め、味わいの中心は品種と製法の科学からの推測です。`,
      level: 'inferred', sourceIds: region.sourceIds,
    })
  }
  if (region && region.applicableKindIds.includes(sel.kindId)) {
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
  const use = cultivar ? cultivarTeaUses.find((u) => u.cultivarId === cultivar.id && u.kindId === sel.kindId) : undefined
  if (cultivar && !use) {
    caveats.push({
      text: `${cultivar.name}を${kindName}に加工したことは、公的資料・研究では未確認です。このページは、品種の所見と製法の科学から「作ればどうなるか」を推測したもので、実在の製品の実測ではありません。`,
      level: 'inferred', sourceIds: [],
    })
  }
  if ((region && cultivar) || rules.length > 0) caveats.push(interactionCaveat())
  return finalize(teaComboTitle(sel), notes, tastes, statements, groups, caveats)
}

export function analyzeChocoCombo(sel: ChocoComboSel): ComboAnalysis {
  const rep = chocoRepresentativeItem(sel.kind)!
  const origin = sel.originId ? cacaoOriginById(sel.originId) : undefined
  const lineageRef = sel.lineage
  const entity = lineageRef ? lineageEntityOf(lineageRef) : undefined
  const rules = lineageRef ? chocoProcessRules.filter((r) => r.lineageLayer === lineageRef.layer && r.lineageId === lineageRef.id) : []
  const baseDesc = `${CHOCO_KIND_LABEL[sel.kind]}チョコレートの代表プロファイル（${rep.name}）に記録された香りです。個別の産地・系統での実測ではありません。`
  const notes = buildNotes(rep.profile.aromas, baseDesc, rules.flatMap((r) => r.noteEffects))
  const extraStatements: ComboStatement[] = []
  const tastes = buildTastes(rep.profile.tastes, `${CHOCO_KIND_LABEL[sel.kind]}チョコレートの代表プロファイル（${rep.name}）に記録された味覚です。`, rules.flatMap((r) => r.tasteEffects), extraStatements)

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
  return finalize(chocoComboTitle(sel), notes, tastes, statements, groups, caveats)
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
