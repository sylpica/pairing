import { describe, expect, it } from 'vitest'
import { analyzeChocoCombo, analyzeTeaCombo } from './combo'
import { assemblePairing } from './pairingCombo'
import {
  ASTRINGENCY_STAGE_LABELS,
  astringencyStageOf,
  buildAstringency,
  buildTasteNoteTiers,
} from './wheelTiers'
import { comboNotesFromProfile } from '../components/ProfileWheelPanel'
import { comboTastesFromProfile } from '../components/TasteWheel'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import type { ComboTaste } from '../types'
import type { WheelContexts } from './wheelTiers'

// 第38弾の不変条件:
// A. 渋味ゲージの5段階は決定的で、段階は 1〜5 の範囲に収まり、
//    渋味の記録がない対象ではゲージ自体が出ない。
// B1. 味ホイール第1階層の％は合計100で、強さの順序を裏付けが逆転させない。

type Ctx = Parameters<typeof buildAstringency>[1]

const itemCases = [
  ...teaItems.map((t) => ({
    name: t.name,
    notes: comboNotesFromProfile(t.profile),
    tastes: comboTastesFromProfile(t.profile),
    ctx: { side: 'tea', kindId: t.kindId, itemName: t.name, itemId: t.id } as Ctx,
  })),
  ...chocolateItems.map((c) => ({
    name: c.name,
    notes: comboNotesFromProfile(c.profile),
    tastes: comboTastesFromProfile(c.profile),
    ctx: { side: 'chocolate', kindId: c.kind, itemName: c.name, itemId: c.id } as Ctx,
  })),
]

const INTENSITIES = ['weak', 'normal', 'strong'] as const

describe('第38弾A: 渋味5段階の算出', () => {
  it('同じ入力には同じ段階が返る（決定的）', () => {
    for (const intensity of INTENSITIES) {
      for (const w of [0, 4, 8, 11, 15, 23]) {
        expect(astringencyStageOf(intensity, w)).toBe(astringencyStageOf(intensity, w))
      }
    }
  })

  it('段階は1〜5の範囲で、強さの記録がなければ null', () => {
    for (const intensity of INTENSITIES) {
      for (const w of [0, 1, 4, 7, 8, 11, 14, 15, 30, 100]) {
        const s = astringencyStageOf(intensity, w)
        expect(s).not.toBeNull()
        expect(s!).toBeGreaterThanOrEqual(1)
        expect(s!).toBeLessThanOrEqual(5)
      }
    }
    expect(astringencyStageOf('unknown', 15)).toBeNull()
  })

  it('固定した強さでは、裏付けが大きいほど段階は下がらない（単調）', () => {
    for (const intensity of INTENSITIES) {
      let prev = 0
      for (const w of [0, 4, 8, 11, 15, 23, 40]) {
        const s = astringencyStageOf(intensity, w)!
        expect(s).toBeGreaterThanOrEqual(prev)
        prev = s
      }
    }
  })

  it('段階表の要点：normal は裏付けで 2〜4 に分かれ、strong は 4〜5、weak は 1〜2', () => {
    expect(astringencyStageOf('normal', 4)).toBe(2)
    expect(astringencyStageOf('normal', 8)).toBe(3)
    expect(astringencyStageOf('normal', 15)).toBe(4)
    expect(astringencyStageOf('strong', 4)).toBe(4)
    expect(astringencyStageOf('strong', 11)).toBe(5)
    expect(astringencyStageOf('weak', 4)).toBe(1)
    expect(astringencyStageOf('weak', 15)).toBe(2)
  })

  it('実データ: 渋味のある対象では stage とラベルが付き、無い対象ではゲージが出ない', () => {
    for (const c of itemCases) {
      const astr = buildAstringency(c.tastes, c.ctx)
      const hasAstr = c.tastes.some((t) => t.key === 'astringent')
      if (!hasAstr) {
        expect(astr, c.name).toBeNull()
      } else {
        expect(astr, c.name).not.toBeNull()
        expect(astr!.stage).not.toBeNull()
        expect(astr!.stage!).toBeGreaterThanOrEqual(1)
        expect(astr!.stage!).toBeLessThanOrEqual(5)
        expect(astr!.stageLabel).toBe(ASTRINGENCY_STAGE_LABELS[astr!.stage!])
        expect(astr!.support).toBeGreaterThan(0)
      }
    }
  })

  it('組み合わせ・ペアリングでも段階が算出される', () => {
    const tea = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const teaAstr = buildAstringency(tea.tastes, tea.context)
    expect(teaAstr).not.toBeNull()
    expect(teaAstr!.stage).not.toBeNull()
    expect(teaAstr!.stageLabel).toBe(ASTRINGENCY_STAGE_LABELS[teaAstr!.stage!])
    const teaItem = teaItems.find((t) => t.id === 'green-steamed')!
    const chocoItem = chocolateItems.find((c) => c.id === 'dark-roasted')!
    const pair = assemblePairing(teaItem, chocoItem, null, null)
    const pairAstr = buildAstringency(pair.wheel.tastes as ComboTaste[], pair.wheel.contexts as WheelContexts)
    if (pair.wheel.tastes.some((t) => t.key === 'astringent')) {
      expect(pairAstr).not.toBeNull()
      expect(pairAstr!.stage).toBeGreaterThanOrEqual(1)
      expect(pairAstr!.stage).toBeLessThanOrEqual(5)
    } else {
      expect(pairAstr).toBeNull()
    }
  })
})

describe('第38弾B1: 味ホイール第1階層％の解像度', () => {
  it('％の合計は100（アイテム全件）', () => {
    for (const c of itemCases) {
      const tiers = buildTasteNoteTiers(c.notes, c.tastes, c.ctx)
      if (tiers.length === 0) continue
      const sum = tiers.reduce((s, g) => s + g.percent, 0)
      expect(sum, c.name).toBe(100)
    }
  })

  it('強さの順序は裏付けで逆転しない（アイテム全件）', () => {
    const rank: Record<string, number> = { weak: 1, normal: 2, strong: 3 }
    for (const c of itemCases) {
      const tiers = buildTasteNoteTiers(c.notes, c.tastes, c.ctx)
      for (const g1 of tiers) {
        for (const g2 of tiers) {
          if (rank[g1.taste.intensity] > rank[g2.taste.intensity]) {
            expect(g1.percent, `${c.name}: ${g1.key} vs ${g2.key}`).toBeGreaterThanOrEqual(g2.percent)
          }
        }
      }
    }
  })

  it('裏付けの違いが第1階層％に現れる（緑茶の土台 vs 長崎×やぶきた）', () => {
    const pctVec = (a: ReturnType<typeof analyzeTeaCombo>) =>
      Object.fromEntries(buildTasteNoteTiers(a.notes, a.tastes, a.context).map((g) => [g.key, g.percent]))
    const base = analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: '' })
    const combo = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    expect(pctVec(combo)).not.toEqual(pctVec(base))
  })

  it('裏付けの違いが第1階層％に現れる（ルビーの土台 vs ドミニカ×マラニョン）', () => {
    const pctVec = (a: ReturnType<typeof analyzeChocoCombo>) =>
      Object.fromEntries(buildTasteNoteTiers(a.notes, a.tastes, a.context).map((g) => [g.key, g.percent]))
    const base = analyzeChocoCombo({ kind: 'ruby', originId: '', lineage: null })
    const combo = analyzeChocoCombo({ kind: 'ruby', originId: 'dominican-republic', lineage: { layer: 'genetic', id: 'gen-maranon' } })
    expect(pctVec(combo)).not.toEqual(pctVec(base))
  })
})
