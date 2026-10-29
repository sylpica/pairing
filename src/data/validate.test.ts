import { describe, it, expect } from 'vitest'
import { sources } from './sources'
import { flavorNotes, flavorCategories } from './flavors'
import { compounds } from './compounds'
import { teaItems } from './teas'
import { chocolateItems } from './chocolates'

const sourceIds = new Set(sources.map((s) => s.id))
const noteIds = new Set(flavorNotes.map((n) => n.id))

describe('科学データの整合性', () => {
  it('出典はすべて検証済みでDOI形式が正しい', () => {
    for (const s of sources) {
      expect(s.verified).toBe(true)
      if (s.doi) expect(s.doi).toMatch(/^10\.\d{4,}\//)
    }
    expect(new Set(sources.map((s) => s.id)).size).toBe(sources.length)
  })
  it('香味ノートは実在する大分類に属する', () => {
    const catIds = new Set(flavorCategories.map((c) => c.id))
    for (const n of flavorNotes) expect(catIds.has(n.categoryId)).toBe(true)
    expect(noteIds.size).toBe(flavorNotes.length)
  })
  it('プロファイルの参照がすべて実在する', () => {
    for (const item of [...teaItems, ...chocolateItems]) {
      for (const a of item.profile.aromas) {
        expect(noteIds.has(a.noteId)).toBe(true)
        expect(a.sourceIds.length).toBeGreaterThan(0)
        for (const sid of a.sourceIds) expect(sourceIds.has(sid)).toBe(true)
      }
      for (const sid of item.sourceIds) expect(sourceIds.has(sid)).toBe(true)
    }
  })
  it('化合物の参照が実在し、3区分の記録がある', () => {
    for (const c of compounds) {
      for (const n of c.noteIds) expect(noteIds.has(n)).toBe(true)
      for (const sid of c.sourceIds) expect(sourceIds.has(sid)).toBe(true)
      expect(c.detectedIn.length).toBeGreaterThan(0)
      expect(c.aromaKnowledge.length).toBeGreaterThan(0)
      expect(c.contributionEvidence.length).toBeGreaterThan(0)
    }
  })
  it('データ不足のチョコは香味を捏造していない', () => {
    for (const c of chocolateItems.filter((x) => x.evidenceLevel === 'insufficient')) {
      expect(c.profile.aromas).toHaveLength(0)
    }
  })
})
