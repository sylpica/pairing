// 第43弾追加監査の共有部品（テスト専用ユーティリティ）:
// 選択空間の列挙・分析のメモ化・隣接ペア生成・ホイール表示署名。
// axisSignatureAudit.test.ts（全数監査）と mode43.test.ts（モード別集計）が使う。
import { teaItems, teaById } from '../data/teas'
import { chocolateItems, chocolateById } from '../data/chocolates'
import { teaRegions } from '../data/teaRegions'
import { cultivarsForKind, teaCultivarById } from '../data/cultivars'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones } from '../data/cacao'
import { cacaoOrigins } from '../data/origins'
import { teaOriginCountries } from './pairingContext'
import {
  analyzeTeaCombo, analyzeChocoCombo, type TeaComboSel, type ChocoComboSel, type ComboAnalysis,
} from './combo'
import { buildAromaTiers, buildTasteNoteTiers, buildAstringency } from './wheelTiers'

type Ctx = Parameters<typeof buildAromaTiers>[1]

/** ホイールの表示署名。L1 = 第1階層＋ゲージ段階、L2 = 全階層、raw = 分析自体。 */
export function wheelSignatures(notes: ComboAnalysis['notes'], tastes: ComboAnalysis['tastes'], ctx: Ctx) {
  const aroma = buildAromaTiers(notes, ctx)
  const taste = buildTasteNoteTiers(notes, tastes, ctx)
  const astr = buildAstringency(tastes, ctx)
  const l1 = JSON.stringify({
    a: aroma.map((t) => [t.categoryId, t.percent, t.drillable, t.entries.map((e) => e.label)]),
    t: taste.map((g) => [g.key, g.percent, g.entries.map((e) => e.label)]),
    g: astr ? astr.stage : null,
  })
  const l2 = JSON.stringify({
    a: aroma.map((t) => [t.categoryId, t.percent, t.entries.map((e) => [e.label, e.percent, e.level, e.compounds.map((c) => [c.compound.id, c.percent])])]),
    t: taste.map((g) => [g.key, g.percent, g.entries.map((e) => [e.label, e.percent, e.level, e.compounds.map((c) => [c.compound.id, c.percent])])]),
    g: astr ? astr.stage : null,
  })
  const raw = JSON.stringify({
    n: notes.map((n) => [n.noteId, n.intensity, n.level]),
    t: tastes.map((t) => [t.key, t.intensity, t.level]),
  })
  return { l1, l2, raw }
}

// ===== 選択空間の列挙（pairingFullSpace.test.ts と同じモデル） =====
const regionsByCountry = new Map<string, (typeof teaRegions)[number][]>()
for (const r of teaRegions) regionsByCountry.set(r.country, [...(regionsByCountry.get(r.country) ?? []), r])

export interface TeaState { key: string; itemId: string; cultivarId: string; regionId: string; sel: TeaComboSel }
export interface ChocoState { key: string; itemId: string; kind: string; originId: string; lineageKey: string; sel: ChocoComboSel }

export function enumerateTeaStates(): TeaState[] {
  const countries = teaOriginCountries()
  const out: TeaState[] = []
  for (const t of teaItems) {
    const cids: (string | null)[] = [null, ...new Set(cultivarsForKind(t.kindId))]
    for (const cid of cids) {
      const origins: (string | null)[] = !cid
        ? [null, ...countries.map((c) => `country:${c}`), ...teaRegions.map((r) => r.id)]
        : [null, `country:${teaCultivarById(cid)!.country}`, ...(regionsByCountry.get(teaCultivarById(cid)!.country) ?? []).map((r) => r.id)]
      for (const o of origins) {
        const sel: TeaComboSel = { kindId: t.id, regionId: o ?? '', cultivarId: cid ?? '' }
        out.push({ key: `${t.id}|${o ?? ''}|${cid ?? ''}`, itemId: t.id, cultivarId: cid ?? '', regionId: o ?? '', sel })
      }
    }
  }
  return out
}

const cacaoEntities = [
  ...cacaoTraditionalGroups.map((g) => ({ layer: 'traditional' as const, id: g.id })),
  ...cacaoGeneticGroups.map((g) => ({ layer: 'genetic' as const, id: g.id })),
  ...cacaoClones.map((c) => ({ layer: 'clone' as const, id: c.id })),
]

export function enumerateChocoStates(): ChocoState[] {
  const out: ChocoState[] = []
  for (const c of chocolateItems) {
    for (const e of [null, ...cacaoEntities]) {
      for (const o of [null, ...cacaoOrigins]) {
        const lineage = e ? { layer: e.layer, id: e.id } : null
        const sel: ChocoComboSel = { kind: c.kind, originId: o?.id ?? '', lineage: lineage as ChocoComboSel['lineage'] }
        out.push({
          key: `${c.id}|${o?.id ?? ''}|${e ? `${e.layer}:${e.id}` : ''}`,
          itemId: c.id, kind: c.kind, originId: o?.id ?? '', lineageKey: e ? `${e.layer}:${e.id}` : '', sel,
        })
      }
    }
  }
  return out
}

// ===== 分析（メモ化） =====
const teaAnalysisCache = new Map<string, ComboAnalysis>()
export function teaAnalysisOf(sel: TeaComboSel): ComboAnalysis {
  const k = `${sel.kindId}|${sel.regionId}|${sel.cultivarId}`
  let a = teaAnalysisCache.get(k)
  if (!a) { a = analyzeTeaCombo(sel); teaAnalysisCache.set(k, a) }
  return a
}
const chocoAnalysisCache = new Map<string, ComboAnalysis>()
export function chocoAnalysisOf(sel: ChocoComboSel): ComboAnalysis {
  const k = `${sel.kind}|${sel.originId}|${sel.lineage ? `${sel.lineage.layer}:${sel.lineage.id}` : ''}`
  let a = chocoAnalysisCache.get(k)
  if (!a) { a = analyzeChocoCombo(sel); chocoAnalysisCache.set(k, a) }
  return a
}

// ===== 隣接ペア生成（1軸だけが異なる状態ペアを全件） =====
export interface AdjPair<S> { axis: string; group: string; a: S; b: S }
export function adjacentPairs<S extends { key: string }>(states: S[], groupings: { axis: string; keyOf: (s: S) => string }[]): AdjPair<S>[] {
  const out: AdjPair<S>[] = []
  for (const g of groupings) {
    const groups = new Map<string, S[]>()
    for (const s of states) {
      const k = g.keyOf(s)
      const arr = groups.get(k)
      if (arr) arr.push(s); else groups.set(k, [s])
    }
    for (const [gk, arr] of groups) {
      for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) {
        out.push({ axis: g.axis, group: gk, a: arr[i], b: arr[j] })
      }
    }
  }
  return out
}

export { teaById, chocolateById }
