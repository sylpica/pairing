import { describe, it, expect } from 'vitest'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import { teaCultivars } from '../data/cultivars'
import { cacaoOrigins } from '../data/origins'
import {
  TEA_COMBO_KINDS, CHOCO_COMBO_KINDS, allTeaRegionOptions, allLineages,
  teaComboViable, chocoComboViable,
  analyzeTeaCombo, analyzeChocoCombo,
  type TeaComboSel, type ChocoComboSel, type ComboAnalysis,
} from './combo'
import { buildAromaTiers, buildTasteTiers } from './wheelTiers'
import { comboNotesFromProfile } from '../components/ProfileWheelPanel'
import { comboTastesFromProfile } from '../components/TasteWheel'

// 第27弾: 全ホイールの全階層に％が付き、各ホイール内で合計100になることの全数検証。
// 対象データ: 全アイテムのプロファイル／全 viable な組み合わせ分析（お茶・チョコ）。
function checkPercents(a: { notes: ComboAnalysis['notes']; tastes: ComboAnalysis['tastes']; context?: ComboAnalysis['context'] }, label: string) {
  const tiers = buildAromaTiers(a.notes, a.context)
  if (tiers.length > 0) {
    expect(tiers.reduce((s, t) => s + t.percent, 0), `${label} 大分類`).toBe(100)
    for (const t of tiers) {
      expect(t.percent, label).toBeGreaterThanOrEqual(1)
      if (t.entries.length > 0) {
        expect(t.entries.reduce((s, e) => s + e.percent, 0), `${label} ${t.categoryId}`).toBe(100)
        for (const e of t.entries) {
          if (e.compounds.length > 0) {
            expect(e.compounds.reduce((s, c) => s + c.percent, 0), `${label} ${e.label}`).toBe(100)
          }
        }
      }
    }
  }
  const groups = buildTasteTiers(a.tastes)
  if (groups.length > 0) {
    expect(groups.reduce((s, g) => s + g.percent, 0), `${label} 味大分類`).toBe(100)
    for (const g of groups) {
      expect(g.percent, label).toBeGreaterThanOrEqual(1)
      const tp = Object.values(g.tastePercents)
      expect(tp.length, label).toBe(g.tastes.length)
      expect(tp.reduce((s, x) => s + (x ?? 0), 0), `${label} ${g.groupId} 中分類`).toBe(100)
      for (const x of tp) expect(x, label).toBeGreaterThanOrEqual(1)
    }
  }
}

describe('全ホイールの％統一（第27弾・エンジン全数）', () => {
  it('全アイテムのプロファイルで全階層の％が合計100になる', () => {
    for (const t of teaItems) {
      checkPercents({ notes: comboNotesFromProfile(t.profile), tastes: comboTastesFromProfile(t.profile) }, `tea:${t.id}`)
    }
    for (const c of chocolateItems) {
      checkPercents({ notes: comboNotesFromProfile(c.profile), tastes: comboTastesFromProfile(c.profile) }, `choco:${c.id}`)
    }
  })

  it('お茶の全 viable 組み合わせで全階層の％が合計100になる', () => {
    let n = 0
    const regionIds = ['', ...allTeaRegionOptions().map((o) => o.id)]
    for (const kindId of TEA_COMBO_KINDS) for (const regionId of regionIds) {
      for (const cultivarId of ['', ...teaCultivars.map((c) => c.id)]) {
        const sel: TeaComboSel = { kindId, regionId, cultivarId }
        if (!teaComboViable(sel)) continue
        checkPercents(analyzeTeaCombo(sel), `tea:${kindId}|${regionId}|${cultivarId}`)
        n++
      }
    }
    expect(n).toBeGreaterThan(500)
  }, 900000)

  it('チョコの全 viable 組み合わせで全階層の％が合計100になる', () => {
    let n = 0
    const lineages = [null, ...allLineages()]
    for (const kind of CHOCO_COMBO_KINDS) for (const originId of ['', ...cacaoOrigins.map((o) => o.id)]) {
      for (const lineage of lineages) {
        const sel: ChocoComboSel = { kind, originId, lineage }
        if (!chocoComboViable(sel)) continue
        checkPercents(analyzeChocoCombo(sel), `choco:${kind}|${originId}|${lineage?.id ?? ''}`)
        n++
      }
    }
    expect(n).toBeGreaterThan(100)
  }, 900000)

  it('単一セグメントのホイールは100%になる', () => {
    // 味が1つだけのプロファイルでは大分類・中分類とも100%
    const single = buildTasteTiers(comboTastesFromProfile({
      aromas: [],
      tastes: {
        sweet: { intensity: 'normal', basis: 'general', sourceIds: [], note: '' },
        sour: { intensity: 'unknown', basis: 'general', sourceIds: [], note: '' },
        bitter: { intensity: 'unknown', basis: 'general', sourceIds: [], note: '' },
        umami: { intensity: 'unknown', basis: 'general', sourceIds: [], note: '' },
        astringent: { intensity: 'unknown', basis: 'general', sourceIds: [], note: '' },
      },
      temporal: { attack: '', peak: '', finish: '', sourceIds: [] },
    } as never))
    expect(single.length).toBe(1)
    expect(single[0].percent).toBe(100)
    expect(single[0].tastePercents.sweet).toBe(100)
  })
})
