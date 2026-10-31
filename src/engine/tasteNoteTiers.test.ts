import { describe, it, expect } from 'vitest'
import { buildTasteNoteTiers, buildTasteTiers } from './wheelTiers'
import { analyzeTeaCombo, analyzeChocoCombo, CHOCO_COMBO_KINDS, TEA_COMBO_KINDS } from './combo'
import { teaComboCached, chocoComboCached } from './pairingCombo'
import { assemblePairing } from './pairingCombo'
import { NOTE_TASTE } from '../data/noteTastes'
import { teaRegions } from '../data/teaRegions'
import { cacaoOrigins } from '../data/origins'
import { teaCultivars } from '../data/cultivars'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones } from '../data/cacao'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import type { TasteKey } from '../types'

// 第34弾: 味ホイールの新構造（第1階層＝味、第2階層＝具体名、第3階層＝化合物）の
// 不変条件と、表示のバラエティ（相異なる署名数）の定量担保。
const TASTE_KEYS: TasteKey[] = ['sweet', 'sour', 'bitter', 'umami', 'astringent']

const newSignature = (notes: Parameters<typeof buildTasteNoteTiers>[0], tastes: Parameters<typeof buildTasteNoteTiers>[1], ctx: Parameters<typeof buildTasteNoteTiers>[2]) => {
  const tiers = buildTasteNoteTiers(notes, tastes, ctx)
  return tiers.map((g) => `${g.key}:${g.percent}[${g.entries.map((e) => `${e.noteId}:${e.percent}`).join(',')}]`).join('|')
}
const oldSignature = (tastes: { key: TasteKey; intensity: string }[]) => {
  const tiers = buildTasteTiers(tastes as unknown as Parameters<typeof buildTasteTiers>[0])
  return tiers.map((g) => `${g.groupId}:${g.percent}[${g.tastes.map((t) => `${t.key}:${g.tastePercents[t.key]}`).join(',')}]`).join('|')
}

describe('味ホイールの新構造（第34弾）', () => {
  it('不変条件: 第1階層は味のみ、第2階層は対応づいた具体名のみ、％は合計100', () => {
    const samples = [
      analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' }),
      analyzeTeaCombo({ kindId: 'black', regionId: '', cultivarId: 'benifuuki' }),
      analyzeChocoCombo({ kind: 'dark', originId: 'ghana', lineage: null }),
      analyzeChocoCombo({ kind: 'ruby', originId: '', lineage: null }),
      analyzeChocoCombo({ kind: 'milk', originId: '', lineage: { layer: 'traditional', id: 'trad-criollo' } }),
    ]
    for (const a of samples) {
      const tiers = buildTasteNoteTiers(a.notes, a.tastes, a.context)
      if (tiers.length > 0) expect(tiers.reduce((s, g) => s + g.percent, 0)).toBe(100)
      for (const g of tiers) {
        expect(TASTE_KEYS).toContain(g.key)
        if (g.entries.length > 0) expect(g.entries.reduce((s, e) => s + e.percent, 0)).toBe(100)
        for (const e of g.entries) {
          expect(NOTE_TASTE[e.noteId]).toBe(g.key)
          expect(a.notes.map((n) => n.noteId)).toContain(e.noteId)
        }
      }
    }
  })

  it('バラエティ定量: 全グリッドで新構造の相異なる署名数が旧構造を上回る', () => {
    const oldSet = new Set<string>()
    const newSet = new Set<string>()
    const regions = ['', ...teaRegions.map((r) => r.id)]
    for (const kindId of TEA_COMBO_KINDS) {
      for (const regionId of regions) {
        for (const c of teaCultivars) {
          const a = teaComboCached({ kindId, regionId, cultivarId: c.id })
          if (!a) continue
          oldSet.add(oldSignature(a.tastes))
          newSet.add(newSignature(a.notes, a.tastes, a.context))
        }
        const base = teaComboCached({ kindId, regionId, cultivarId: '' })
        if (base) { oldSet.add(oldSignature(base.tastes)); newSet.add(newSignature(base.notes, base.tastes, base.context)) }
      }
    }
    const origins = ['', ...cacaoOrigins.map((o) => o.id)]
    const lineages: ({ layer: 'traditional' | 'genetic' | 'clone'; id: string } | null)[] = [
      null,
      ...cacaoTraditionalGroups.map((g) => ({ layer: 'traditional' as const, id: g.id })),
      ...cacaoGeneticGroups.map((g) => ({ layer: 'genetic' as const, id: g.id })),
      ...cacaoClones.map((g) => ({ layer: 'clone' as const, id: g.id })),
    ]
    for (const kind of CHOCO_COMBO_KINDS) {
      for (const originId of origins) {
        for (const lineage of lineages) {
          const a = chocoComboCached({ kind, originId, lineage })
          if (!a) continue
          oldSet.add(oldSignature(a.tastes))
          newSet.add(newSignature(a.notes, a.tastes, a.context))
        }
      }
    }
    console.log(`[第34弾バラエティ] 単体グリッド 旧=${oldSet.size} 新=${newSet.size}`)
    expect(newSet.size).toBeGreaterThan(oldSet.size)
  })

  it('バラエティ定量（ペアリング側）: 全アイテムペアで署名が取れ、旧構造より多い', () => {
    const oldSet = new Set<string>()
    const newSet = new Set<string>()
    for (const tea of teaItems) {
      for (const choco of chocolateItems) {
        const a = assemblePairing(tea, choco, null, null)
        oldSet.add(oldSignature(a.wheel.tastes))
        newSet.add(newSignature(a.wheel.notes, a.wheel.tastes, a.wheel.contexts))
      }
    }
    console.log(`[第34弾バラエティ] ペアリング 旧=${oldSet.size} 新=${newSet.size}`)
    expect(newSet.size).toBeGreaterThan(oldSet.size)
  })
})
