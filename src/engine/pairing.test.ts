import { describe, it, expect } from 'vitest'
import { analyzePairing, recommend } from './pairing'
import { teaById } from '../data/teas'
import { chocolateById, chocolateItems } from '../data/chocolates'
import type { FlavorProfile } from '../types'
import { emptyTastes, emptyTemporal } from '../types'

const prof = (aromas: FlavorProfile['aromas']): FlavorProfile => ({ aromas, tastes: emptyTastes(), temporal: emptyTemporal() })

describe('ペアリングエンジン（§15.2検証ケース）', () => {
  it('一般的なデータ同士では探索的予想として返し、スコアを出さない', () => {
    const r = analyzePairing(teaById('oolong-tea')!.profile, chocolateById('fine-flavor-chocolate')!.profile)
    expect(r.level).toBe('exploratory')
    expect(r).not.toHaveProperty('score'); expect(JSON.stringify(r)).not.toMatch(/\d+\s*点/)
    expect(r.sharedNotes.map((s) => s.noteId)).toContain('floral-general')
  })
  it('データ不足の組み合わせは情報不足を返す（相性不良と誤表示しない）', () => {
    const r = analyzePairing(teaById('black-tea')!.profile, chocolateById('milk-chocolate')!.profile)
    expect(r.level).toBe('insufficient')
    expect(r.message).toContain('根拠が足りない')
  })
  it('同じ香味が多い組み合わせで共通点が複数出る', () => {
    const r = analyzePairing(teaById('white-tea')!.profile, chocolateById('fine-flavor-chocolate')!.profile)
    expect(r.sharedNotes.length + r.sharedCategories.length).toBeGreaterThan(0)
  })
  it('香味が大きく異なる組み合わせでは対比候補が出る', () => {
    const a = prof([{ noteId: 'green-leaf', intensity: 'strong', basis: 'review', sourceIds: ['zeng-2025-tea-vocs'] }])
    const b = prof([{ noteId: 'cacao', intensity: 'strong', basis: 'sensory', sourceIds: ['acpangan-2023-dark-chocolate-aroma'] }])
    const r = analyzePairing(a, b)
    expect(r.contrasts.length).toBeGreaterThan(0)
    expect(r.sharedNotes).toHaveLength(0)
  })
  it('おすすめは候補を返し、空データの候補も落とさない', () => {
    const list = recommend(teaById('black-tea')!.profile, chocolateItems, 'harmony')
    expect(list).toHaveLength(chocolateItems.length)
  })
})
