import { describe, it, expect } from 'vitest'
import { allocatePercents, buildAromaTiers, buildTasteCompounds, comboSpecificsFor, VAGUE_NOTE_IDS } from './wheelTiers'
import { analyzeTeaCombo, analyzeChocoCombo, TEA_COMBO_KINDS, CHOCO_COMBO_KINDS, type ComboAnalysis } from './combo'
import { teaRegions } from '../data/teaRegions'
import { cacaoOrigins } from '../data/origins'
import { compoundById, compoundTier } from '../data/compounds'
import { noteById } from '../data/flavors'
import type { TasteKey } from '../types'

describe('allocatePercents（％の整数化）', () => {
  it('合計は必ず100になる', () => {
    for (const w of [[3, 2], [1], [2, 3, 5], [1, 1, 1], [7, 7, 7, 7], [3, 3, 3, 3, 3, 3, 3]]) {
      const p = allocatePercents(w)
      expect(p.reduce((a, b) => a + b, 0)).toBe(100)
      expect(p).toHaveLength(w.length)
    }
    expect(allocatePercents([3, 2])).toEqual([60, 40])
    expect(allocatePercents([1])).toEqual([100])
  })

  it('重みが正の要素は最低1%になる', () => {
    const p = allocatePercents([100, 1, 1])
    expect(p.reduce((a, b) => a + b, 0)).toBe(100)
    expect(Math.min(...p)).toBeGreaterThanOrEqual(1)
  })
})

describe('組み合わせ文脈の具体名（comboSpecificsFor）', () => {
  it('土台アイテム自身のレコードが使える（蒸し緑茶の花様＝バラ・ジャスミン）', () => {
    const specs = comboSpecificsFor({ side: 'tea', kindId: 'green', itemName: '蒸し緑茶（蒸青）', itemId: 'green-steamed' }, 'floral-general')
    expect(specs.map((s) => s.label)).toEqual(['バラ', 'ジャスミン'])
  })

  it('同茶類の複数アイテムで共有される具体名は、レコードの無いアイテムにも一般化される（晒青緑茶）', () => {
    // green-sun-dried 自身には推測レコードが無いが、緑茶の複数アイテムが同じ
    // 具体名（バラ・ジャスミン）を同じ根拠成分で共有しているため、茶類レベルの知見として使える
    const specs = comboSpecificsFor({ side: 'tea', kindId: 'green', itemName: '晒青緑茶', itemId: 'green-sun-dried' }, 'floral-general')
    expect(specs.map((s) => s.label)).toEqual(['バラ', 'ジャスミン'])
  })

  it('1アイテムだけに紐づく具体名は一般化しない（単叢のクチナシ・ココナッツは烏龍茶全般に出ない）', () => {
    const ctx = { side: 'tea' as const, kindId: 'oolong', itemName: '烏龍茶（青茶）', itemId: 'oolong-tea' }
    expect(comboSpecificsFor(ctx, 'floral-general').map((s) => s.label)).toEqual(['バラ'])
    expect(comboSpecificsFor(ctx, 'tropical')).toEqual([])
    // 単叢自身では当然出る
    const dancong = { side: 'tea' as const, kindId: 'oolong', itemName: '鳳凰単叢（烏龍茶）', itemId: 'fenghuang-dancong' }
    expect(comboSpecificsFor(dancong, 'floral-general').map((s) => s.label)).toEqual(['クチナシ', 'ジャスミン', 'バラ'])
    expect(comboSpecificsFor(dancong, 'tropical').map((s) => s.label)).toEqual(['ココナッツ'])
  })

  it('具体名の根拠成分はすべて実在し、この文脈で tier 2 以内にある', () => {
    for (const itemId of ['green-steamed', 'sencha', 'white-tea', 'black-tea', 'oolong-tea', 'fenghuang-dancong']) {
      const item = itemId === 'white-tea' || itemId === 'black-tea' || itemId === 'oolong-tea' || itemId === 'fenghuang-dancong'
        ? { side: 'tea' as const, kindId: itemId === 'white-tea' ? 'white' : itemId === 'black-tea' ? 'black' : 'oolong', itemName: itemId, itemId }
        : { side: 'tea' as const, kindId: 'green', itemName: itemId, itemId }
      for (const noteId of VAGUE_NOTE_IDS) {
        for (const s of comboSpecificsFor(item, noteId)) {
          expect(s.estimation).toBe('inferred')
          for (const cid of s.basisCompoundIds) {
            const c = compoundById(cid)
            expect(c, `${itemId}/${noteId}/${s.label}: ${cid}`).toBeTruthy()
            expect(compoundTier(c!, item)).toBeLessThanOrEqual(2)
          }
        }
      }
    }
  })
})

function auditAnalysis(a: ComboAnalysis) {
  for (const t of buildAromaTiers(a.notes, a.context)) {
    expect(t.drillable).toBe(t.entries.length > 0)
    if (t.entries.length > 0) {
      expect(t.entries.reduce((s, e) => s + e.percent, 0), `${a.title}/${t.name} の中分類％`).toBe(100)
    }
    const noteLabels = new Set<string>()
    for (const e of t.entries) {
      // 中分類は漠然としたノートそのものではない
      if (e.kind === 'note') {
        expect(VAGUE_NOTE_IDS).not.toContain(e.noteId)
        noteLabels.add(e.label)
      } else {
        // 推測の具体名は、具体的なノートと名前が重ならない（柑橘 vs 柑橘類の重複防止）
        expect(noteLabels.has(e.label)).toBe(false)
        expect([...noteLabels].some((l) => `${l}類` === e.label || l === `${e.label}類`)).toBe(false)
        // 根拠成分は全て実在し tier 2 以内（足がかり必須）
        expect(e.specific).toBeTruthy()
        expect(e.compounds.map((c) => c.compound.id).sort()).toEqual([...e.specific!.basisCompoundIds].sort())
        for (const tc of e.compounds) expect(tc.tier).toBeLessThanOrEqual(2)
        expect(e.level).toBe('inferred')
      }
      if (e.compounds.length > 0) {
        expect(e.compounds.reduce((s, c) => s + c.percent, 0), `${a.title}/${e.label} の小分類％`).toBe(100)
      }
      expect(e.percent).toBeGreaterThanOrEqual(1)
      expect(noteById(e.noteId)).toBeTruthy()
    }
  }
}

describe('3階層データの全数監査（％合計・足がかり・重複なし）', () => {
  it('お茶 全分類 × 全地域', { timeout: 120000 }, () => {
    for (const kindId of TEA_COMBO_KINDS) {
      for (const regionId of ['', ...teaRegions.map((r) => r.id)]) {
        auditAnalysis(analyzeTeaCombo({ kindId, regionId, cultivarId: '' }))
      }
    }
  })

  it('チョコ 全種類 × 全産地', { timeout: 120000 }, () => {
    for (const kind of CHOCO_COMBO_KINDS) {
      for (const originId of ['', ...cacaoOrigins.map((o) => o.id)]) {
        auditAnalysis(analyzeChocoCombo({ kind, originId, lineage: null }))
      }
    }
  })

  it('味の物質：％合計100、文脈外の成分は混ざらない', () => {
    const tastes: TasteKey[] = ['sweet', 'sour', 'bitter', 'astringent', 'umami']
    const analyses = [
      analyzeTeaCombo({ kindId: 'black', regionId: 'nagasaki', cultivarId: 'yabukita' }),
      analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: '' }),
      analyzeChocoCombo({ kind: 'dark', originId: 'madagascar', lineage: { layer: 'traditional', id: 'trad-criollo' } }),
      analyzeChocoCombo({ kind: 'milk', originId: '', lineage: null }),
    ]
    for (const a of analyses) {
      for (const t of tastes) {
        const cs = buildTasteCompounds(t, a.context)
        if (cs.length > 0) expect(cs.reduce((s, c) => s + c.percent, 0), `${a.title}/${t}`).toBe(100)
        for (const tc of cs) expect(tc.tier).toBeLessThanOrEqual(2)
      }
    }
    // 紅茶文脈の苦味にはカフェイン（この分類での寄与実証あり）が含まれる
    const black = analyses[0]
    expect(buildTasteCompounds('bitter', black.context).map((c) => c.compound.id)).toContain('caffeine')
    // チョコレートの甘味にカカオ固有の成分は無い（配合糖由来のため空）
    const choco = analyses[2]
    expect(buildTasteCompounds('sweet', choco.context)).toEqual([])
  })
})

describe('代表例の階層データ', () => {
  it('長崎 × やぶきた × 緑茶：花系の中分類は推測の具体名（バラ40%・ジャスミン60%）', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const tiers = buildAromaTiers(a.notes, a.context)
    const floral = tiers.find((t) => t.categoryId === 'floral')!
    expect(floral.drillable).toBe(true)
    expect(floral.entries.map((e) => [e.label, e.kind, e.percent])).toEqual([
      ['バラ', 'specific', 40],
      ['ジャスミン', 'specific', 60],
    ])
    expect(floral.entries[1].compounds.map((c) => c.compound.id)).toEqual(['methyl-jasmonate'])
  })

  it('マダガスカル × クリオロ × ダーク：キャラメルの小分類はフラネオール100%', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: 'madagascar', lineage: { layer: 'traditional', id: 'trad-criollo' } })
    const tiers = buildAromaTiers(a.notes, a.context)
    const sweet = tiers.find((t) => t.categoryId === 'sweet-aroma')!
    const caramel = sweet.entries.find((e) => e.label === 'キャラメル')!
    expect(caramel.compounds.map((c) => [c.compound.id, c.percent])).toEqual([['furaneol', 100]])
    const malt = tiers.find((t) => t.categoryId === 'roasted')!.entries.find((e) => e.label === '麦芽')!
    expect(malt.compounds.map((c) => c.compound.id)).toContain('3-methylbutanal')
  })

  it('緑茶 × 鹿児島：果実系は漠然としたノートだけのため中分類なし（ドリルダウン不可）', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'kagoshima', cultivarId: '' })
    const tiers = buildAromaTiers(a.notes, a.context)
    const fruit = tiers.find((t) => t.categoryId === 'fruit')!
    expect(fruit.notes.map((n) => n.noteId)).toEqual(['fruit-general'])
    expect(fruit.entries).toEqual([])
    expect(fruit.drillable).toBe(false)
  })
})
