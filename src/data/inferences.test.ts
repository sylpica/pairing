import { describe, it, expect } from 'vitest'
import { noteInferences, inferencesFor } from './inferences'
import { compoundById, compoundTier } from './compounds'
import { teaItems } from './teas'
import { chocolateItems } from './chocolates'

// 推測の対象としてよい漠然としたノート（具体名が根拠で確定しているノートには推測を付けない）
const VAGUE_NOTES = ['floral-general', 'tropical', 'fruit-general']

function itemOf(side: 'tea' | 'chocolate', itemId: string) {
  return side === 'tea' ? teaItems.find((t) => t.id === itemId) : chocolateItems.find((c) => c.id === itemId)
}
function kindOf(side: 'tea' | 'chocolate', itemId: string): string {
  const item = itemOf(side, itemId)!
  return side === 'tea' ? (item as (typeof teaItems)[number]).kindId : (item as (typeof chocolateItems)[number]).kind
}

describe('花・果物の科学的推測データの自動検査', () => {
  it('レコードは (side, itemId, noteId) で一意で、対象アイテムとノートが実在する', () => {
    const keys = noteInferences.map((r) => `${r.itemSide}:${r.itemId}:${r.noteId}`)
    expect(new Set(keys).size).toBe(keys.length)
    for (const r of noteInferences) {
      const item = itemOf(r.itemSide, r.itemId)
      expect(item, `${r.itemSide}:${r.itemId}`).toBeTruthy()
      expect(item!.profile.aromas.some((a) => a.noteId === r.noteId), `${r.itemId}/${r.noteId}`).toBe(true)
      expect(r.specifics.length).toBeGreaterThan(0)
    }
  })

  it('推測の対象は漠然としたノート（花様・トロピカル・果実全般）だけ', () => {
    for (const r of noteInferences) expect(VAGUE_NOTES).toContain(r.noteId)
  })

  it('すべての推測に推測フラグと格付けがあり、表現は「可能性」に留まる', () => {
    for (const r of noteInferences) {
      for (const s of r.specifics) {
        expect(s.estimation).toBe('inferred')
        expect(['peer-reviewed', 'reference-assisted']).toContain(s.basisGrading)
        expect(s.label.length).toBeGreaterThan(0)
        expect(s.rationale).toContain('可能性')
        expect(s.basisCompoundIds.length).toBeGreaterThan(0)
      }
    }
  })

  it('根拠成分はすべて実在し、そのアイテムの茶類・種類で確認済みの範囲（tier 2以内）にある', () => {
    for (const r of noteInferences) {
      const kindId = kindOf(r.itemSide, r.itemId)
      for (const s of r.specifics) {
        for (const cid of s.basisCompoundIds) {
          const c = compoundById(cid)
          expect(c, `${r.itemId}/${r.noteId}: ${cid}`).toBeTruthy()
          // tier 3（他の食品・茶類での研究例）を根拠にした推測は禁止
          expect(compoundTier(c!, { side: r.itemSide, kindId }), `${r.itemId}/${r.noteId}: ${cid}`).toBeLessThanOrEqual(2)
        }
      }
    }
  })

  it('主要な推測が登録されている（緑茶=バラ・ジャスミン、白茶=りんご、単叢=クチナシ等）', () => {
    expect(inferencesFor('tea', 'sencha', 'floral-general').map((s) => s.label)).toEqual(['バラ', 'ジャスミン'])
    expect(inferencesFor('tea', 'white-tea', 'floral-general').map((s) => s.label)).toEqual(['バラ', 'すみれ'])
    expect(inferencesFor('tea', 'white-tea', 'fruit-general').map((s) => s.label)).toEqual(['りんご', '柑橘類'])
    expect(inferencesFor('tea', 'fenghuang-dancong', 'floral-general').map((s) => s.label)).toEqual(['クチナシ', 'ジャスミン', 'バラ'])
    expect(inferencesFor('chocolate', 'fine-flavor-chocolate', 'fruit-general').map((s) => s.label)).toEqual(['いちご'])
  })

  it('単叢トロピカルの推測は、具体名の記述が参考情報格付けであることを明示する', () => {
    const specs = inferencesFor('tea', 'fenghuang-dancong', 'tropical')
    expect(specs.map((s) => s.label)).toEqual(['ココナッツ'])
    expect(specs[0].basisGrading).toBe('reference-assisted')
    expect(specs[0].basisCompoundIds).toEqual(['jasmine-lactone'])
    // マンゴー・パイナップル等の名指しは、確認済み成分の記述に無いため作らない
    expect(specs.map((s) => s.label)).not.toContain('マンゴー')
    expect(specs.map((s) => s.label)).not.toContain('パイナップル')
  })

  it('根拠の薄いものには推測を付けない（未焙煎ダーク、ファインフレーバーの花様、ミルク等）', () => {
    expect(noteInferences.filter((r) => r.itemId === 'dark-unroasted')).toEqual([])
    expect(inferencesFor('chocolate', 'fine-flavor-chocolate', 'floral-general')).toEqual([])
    expect(noteInferences.filter((r) => r.itemId === 'milk-chocolate')).toEqual([])
    expect(noteInferences.filter((r) => r.itemId === 'dark-roasted')).toEqual([])
    expect(noteInferences.filter((r) => r.itemId === 'hojicha')).toEqual([])
    expect(noteInferences.filter((r) => r.itemId === 'dark-tea')).toEqual([])
  })
})
