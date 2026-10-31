import { describe, it, expect } from 'vitest'
import { buildAstringency, buildTasteCompounds, buildTasteNoteTiers, buildTasteTiers } from './wheelTiers'
import { analyzeTeaCombo, analyzeChocoCombo, CHOCO_COMBO_KINDS, TEA_COMBO_KINDS } from './combo'
import { teaComboCached, chocoComboCached } from './pairingCombo'
import { assemblePairing } from './pairingCombo'
import { NOTE_TASTE, TASTE_SPECIFICS } from '../data/noteTastes'
import { compounds } from '../data/compounds'
import { teaRegions } from '../data/teaRegions'
import { cacaoOrigins } from '../data/origins'
import { teaCultivars } from '../data/cultivars'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones } from '../data/cacao'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import type { TasteKey } from '../types'

// 第34弾: 味ホイールの新構造（第1階層＝味、第2階層＝具体名、第3階層＝化合物）の
// 不変条件と、表示のバラエティ（相異なる署名数）の定量担保。
// 第36弾: 第1階層は基本味のみ（渋味は含まない。渋味はゲージ側）、第2階層は
// 具体名のみ（化合物名のセグメントは無い）という不変条件に更新した。
const BASIC_TASTE_KEYS: TasteKey[] = ['sweet', 'sour', 'bitter', 'umami']

const newSignature = (notes: Parameters<typeof buildTasteNoteTiers>[0], tastes: Parameters<typeof buildTasteNoteTiers>[1], ctx: Parameters<typeof buildTasteNoteTiers>[2]) => {
  const tiers = buildTasteNoteTiers(notes, tastes, ctx)
  const wheel = tiers.map((g) => `${g.key}:${g.percent}[${g.entries.map((e) => `${e.kind === 'note' ? e.noteId : `sp:${e.label}`}:${e.percent}`).join(',')}]`).join('|')
  // 第36弾: 渋味はホイールからゲージへ移ったため、表示署名にはゲージ分も含める
  const astr = buildAstringency(tastes, ctx)
  const gauge = astr ? `astr:${astr.taste.intensity}[${astr.compounds.map((tc) => `${tc.compound.id}:${tc.percent}`).join(',')}]` : 'astr:none'
  return `${wheel}#${gauge}`
}
const oldSignature = (tastes: { key: TasteKey; intensity: string }[]) => {
  const tiers = buildTasteTiers(tastes as unknown as Parameters<typeof buildTasteTiers>[0])
  return tiers.map((g) => `${g.groupId}:${g.percent}[${g.tastes.map((t) => `${t.key}:${g.tastePercents[t.key]}`).join(',')}]`).join('|')
}

describe('味ホイールの新構造（第34弾・第36弾）', () => {
  it('不変条件: 第1階層は基本味のみ（渋味を含まない）、第2階層は具体名のみ、％は合計100', () => {
    const samples = [
      analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' }),
      analyzeTeaCombo({ kindId: 'black', regionId: '', cultivarId: 'benifuuki' }),
      analyzeChocoCombo({ kind: 'dark', originId: 'ghana', lineage: null }),
      analyzeChocoCombo({ kind: 'ruby', originId: '', lineage: null }),
      analyzeChocoCombo({ kind: 'milk', originId: '', lineage: { layer: 'traditional', id: 'trad-criollo' } }),
    ]
    const compoundNames = new Set(compounds.map((c) => c.name))
    for (const a of samples) {
      const tiers = buildTasteNoteTiers(a.notes, a.tastes, a.context)
      if (tiers.length > 0) expect(tiers.reduce((s, g) => s + g.percent, 0)).toBe(100)
      for (const g of tiers) {
        expect(BASIC_TASTE_KEYS).toContain(g.key)
        expect(g.key).not.toBe('astringent')
        if (g.entries.length > 0) expect(g.entries.reduce((s, e) => s + e.percent, 0)).toBe(100)
        for (const e of g.entries) {
          // 第2階層のセグメントは具体名のみ（登録化合物の名前は絶対に出ない）
          expect(compoundNames.has(e.label), `${g.key}/${e.label} が化合物名と一致`).toBe(false)
          if (e.kind === 'note') {
            expect(NOTE_TASTE[e.noteId]).toContain(g.key)
            expect(a.notes.map((n) => n.noteId)).toContain(e.noteId)
          } else {
            // 呈味成分からの代表例は、根拠成分がその文脈の味成分に全て含まれるものだけ
            const spec = TASTE_SPECIFICS.find((s) => s.label === e.label && s.taste === g.key)
            expect(spec, `${g.key}/${e.label} の代表例定義`).toBeTruthy()
            const ids = new Set(buildTasteCompounds(g.key, a.context).map((tc) => tc.compound.id))
            for (const id of spec!.basisCompoundIds) expect(ids.has(id), `${e.label} の根拠成分 ${id}`).toBe(true)
            expect(e.level).toBe('inferred')
          }
        }
      }
      // 渋味はゲージ側: 記録がある対象では buildAstringency がデータを返す
      const astr = buildAstringency(a.tastes, a.context)
      if (a.tastes.some((t) => t.key === 'astringent')) {
        expect(astr, '渋味ゲージのデータ').toBeTruthy()
        for (const tc of astr!.compounds) {
          expect(tc.compound.tasteLinks?.some((l) => l.taste === 'astringent')).toBe(true)
        }
      } else {
        expect(astr).toBeNull()
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
    console.log(`[第36弾バラエティ] 単体グリッド 旧構造=${oldSet.size} 新構造=${newSet.size}`)
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
    console.log(`[第36弾バラエティ] ペアリング 旧構造=${oldSet.size} 新構造=${newSet.size}`)
    expect(newSet.size).toBeGreaterThan(oldSet.size)
  })
})
