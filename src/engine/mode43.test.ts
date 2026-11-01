// 第43弾追加: モード別（味のみ／香りのみ）署名の補助集計。
// 既定表示は「味」モードのため、合算署名（axisSignatureAudit）とは別に、
// モード単独で見た場合の同一数も測っておく（報告の透明性のため）。
import { describe, it, expect } from 'vitest'
import { buildAromaTiers, buildTasteNoteTiers, buildAstringency } from './wheelTiers'
import { assemblePairing } from './pairingCombo'
import {
  enumerateTeaStates, enumerateChocoStates, teaAnalysisOf, chocoAnalysisOf, adjacentPairs,
  type TeaState, type ChocoState,
} from './auditSpace'
import { teaById } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones } from '../data/cacao'
import { cacaoOrigins } from '../data/origins'
import type { ChocoComboSel, TeaComboSel } from './combo'

function modeSigs(notes: Parameters<typeof buildAromaTiers>[0], tastes: Parameters<typeof buildTasteNoteTiers>[1], ctx: Parameters<typeof buildAromaTiers>[1]) {
  const aroma = buildAromaTiers(notes, ctx)
  const taste = buildTasteNoteTiers(notes, tastes, ctx)
  const astr = buildAstringency(tastes, ctx)
  return {
    aroma: JSON.stringify(aroma.map((t) => [t.categoryId, t.percent, t.entries.map((e) => [e.label, e.percent, e.level, e.compounds.map((c) => [c.compound.id, c.percent])])])),
    taste: JSON.stringify([taste.map((g) => [g.key, g.percent, g.entries.map((e) => [e.label, e.percent, e.level, e.compounds.map((c) => [c.compound.id, c.percent])])]), astr ? astr.stage : null]),
  }
}

describe('第43弾追加: モード別署名の補助集計', () => {
  it('側監査のモード別同一数', () => {
    const teaStates = enumerateTeaStates()
    const chocoStates = enumerateChocoStates()
    const teaMode = new Map<string, { aroma: string; taste: string }>()
    const chocoMode = new Map<string, { aroma: string; taste: string }>()
    for (const s of teaStates) { const a = teaAnalysisOf(s.sel); teaMode.set(s.key, modeSigs(a.notes, a.tastes, a.context)) }
    for (const s of chocoStates) { const a = chocoAnalysisOf(s.sel); chocoMode.set(s.key, modeSigs(a.notes, a.tastes, a.context)) }
    const teaAdj = adjacentPairs(teaStates, [
      { axis: '品種', keyOf: (s: TeaState) => `${s.itemId}|${s.regionId}` },
      { axis: '産地', keyOf: (s: TeaState) => `${s.itemId}|${s.cultivarId}` },
      { axis: 'アイテム(分類)', keyOf: (s: TeaState) => `${s.cultivarId}|${s.regionId}` },
    ])
    const chocoAdj = adjacentPairs(chocoStates, [
      { axis: '系統', keyOf: (s: ChocoState) => `${s.itemId}|${s.originId}` },
      { axis: '産地', keyOf: (s: ChocoState) => `${s.itemId}|${s.lineageKey}` },
      { axis: 'アイテム(種類)', keyOf: (s: ChocoState) => `${s.lineageKey}|${s.originId}` },
    ])
    const count = (pairs: { a: { key: string }; b: { key: string } }[], m: Map<string, { aroma: string; taste: string }>) => {
      let aroma = 0; let taste = 0
      for (const p of pairs) {
        if (m.get(p.a.key)!.aroma === m.get(p.b.key)!.aroma) aroma++
        if (m.get(p.a.key)!.taste === m.get(p.b.key)!.taste) taste++
      }
      return { pairs: pairs.length, aromaSame: aroma, tasteSame: taste }
    }
    console.log('TEA mode:', JSON.stringify(count(teaAdj, teaMode)))
    console.log('CHOCO mode:', JSON.stringify(count(chocoAdj, chocoMode)))
    expect(teaStates.length).toBe(2422)
  }, 600000)

  it('重点文脈のモード別マトリクス（烏龍×南投×全チョコ選択）', () => {
    const tea = teaById('oolong-tea')!
    const cultivars = ['', 'qingxin-oolong', 'qingxin-damao', 'jinxuan', 'tsuiyu', 'sijichun']
    const sels: TeaComboSel[] = cultivars.map((c) => ({ kindId: 'oolong-tea', regionId: 'nantou', cultivarId: c }))
    const entities = [
      ...cacaoTraditionalGroups.map((g) => ({ layer: 'traditional' as const, id: g.id })),
      ...cacaoGeneticGroups.map((g) => ({ layer: 'genetic' as const, id: g.id })),
      ...cacaoClones.map((c) => ({ layer: 'clone' as const, id: c.id })),
    ]
    const counts = { aroma: new Map<string, number>(), taste: new Map<string, number>() }
    for (const item of chocolateItems) {
      for (const e of [null, ...entities]) {
        for (const o of [null, ...cacaoOrigins]) {
          const csel: ChocoComboSel = { kind: item.kind, originId: o?.id ?? '', lineage: (e ? { layer: e.layer, id: e.id } : null) as ChocoComboSel['lineage'] }
          const sigs = sels.map((sel) => {
            const a = assemblePairing(tea, item, sel, csel)
            return modeSigs(a.wheel.notes, a.wheel.tastes, a.wheel.contexts)
          })
          for (let i = 0; i < cultivars.length; i++) for (let j = i + 1; j < cultivars.length; j++) {
            const k = `${cultivars[i] || '土台'} vs ${cultivars[j] || '土台'}`
            if (sigs[i].aroma === sigs[j].aroma) counts.aroma.set(k, (counts.aroma.get(k) ?? 0) + 1)
            if (sigs[i].taste === sigs[j].taste) counts.taste.set(k, (counts.taste.get(k) ?? 0) + 1)
          }
        }
      }
    }
    for (const [k, v] of [...counts.aroma.entries()].sort((a, b) => b[1] - a[1])) console.log(`AROMA-SAME ${k}: ${v}/1224`)
    for (const [k, v] of [...counts.taste.entries()].sort((a, b) => b[1] - a[1])) console.log(`TASTE-SAME ${k}: ${v}/1224`)
  }, 600000)
})
