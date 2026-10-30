import { describe, it, expect } from 'vitest'
import { analyzePairingCharacter } from './pairingCharacter'
import { analyzeInteractions } from './interactions'
import { teaItems, teaById } from '../data/teas'
import { chocolateItems, chocolateById } from '../data/chocolates'
import { compounds, compoundTier } from '../data/compounds'
import { sources } from '../data/sources'
import { emptyTastes, emptyTemporal } from '../types'
import type { ChocolateItem, PairingCharacter, TasteKey, TeaItem } from '../types'

const sourceIds = new Set(sources.map((s) => s.id))
const rank = (i: string) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)
const TASTE_KEYS: TasteKey[] = ['sweet', 'sour', 'bitter', 'astringent', 'umami']
const allChars = (a: ReturnType<typeof analyzePairingCharacter>): PairingCharacter[] => [...a.aroma, ...a.tasteMouthfeel]
const charIds = (list: PairingCharacter[]) => list.map((c) => c.id)

/** 仕様上の「確認済み化合物プール」を、エンジンとは独立にデータから再導出する。
 *  そのアイテムの記録された香味・味覚（普通以上）に結びつき、その茶類・種類または
 *  食品全般で確認済み（compoundTier で tier 2 以内）の化合物だけが入る。 */
function poolFor(item: TeaItem | ChocolateItem, side: 'tea' | 'chocolate'): Set<string> {
  const kindId = side === 'tea' ? (item as TeaItem).kindId : (item as ChocolateItem).kind
  const knownNotes = new Set(item.profile.aromas.filter((a) => rank(a.intensity) >= 2).map((a) => a.noteId))
  const knownTastes = new Set(TASTE_KEYS.filter((k) => rank(item.profile.tastes[k].intensity) >= 2))
  return new Set(
    compounds
      .filter((c) => compoundTier(c, { side, kindId }) <= 2
        && (c.noteIds.some((n) => knownNotes.has(n)) || (c.tasteLinks ?? []).some((l) => knownTastes.has(l.taste))))
      .map((c) => c.id),
  )
}

describe('組み合わせの味わいの性格の推測エンジン', () => {
  it('すべての実データの組み合わせで、各性格に推測フラグと根拠と実在する出典があり、スコア的数値が出ない', () => {
    for (const tea of teaItems) {
      for (const choco of chocolateItems) {
        const a = analyzePairingCharacter(tea, choco)
        for (const c of allChars(a)) {
          expect(c.estimation, `${tea.id}×${choco.id}/${c.id}`).toBe('inferred')
          expect(c.label.length, `${tea.id}×${choco.id}/${c.id}`).toBeGreaterThan(0)
          expect(c.rationale, `${tea.id}×${choco.id}/${c.id}`).toContain('可能性')
          const basisTotal = c.basisCompoundIds.length + c.basisNoteIds.length + c.basisTasteKeys.length + c.basisRuleIds.length
          expect(basisTotal, `${tea.id}×${choco.id}/${c.id}: 根拠のない性格は出さない`).toBeGreaterThan(0)
          expect(c.sourceIds.length, `${tea.id}×${choco.id}/${c.id}`).toBeGreaterThan(0)
          for (const sid of c.sourceIds) expect(sourceIds.has(sid), `${c.id}: ${sid}`).toBe(true)
          expect(c).not.toHaveProperty('score')
          expect(c.rationale).not.toMatch(/\d+\s*点/)
          expect(c.rationale).not.toMatch(/\d+\s*%/)
          expect(c.label).not.toMatch(/\d+\s*点/)
        }
        // kind の振り分けが正しい
        for (const c of a.aroma) expect(c.kind).toBe('aroma')
        for (const c of a.tasteMouthfeel) expect(c.kind).toBe('taste-mouthfeel')
        // 同じ性格が重複して出ない
        const ids = charIds(allChars(a))
        expect(new Set(ids).size).toBe(ids.length)
      }
    }
  })

  it('根拠は両プロファイルの実データに基づく（存在しない成分・ノート・味覚・未発火ルールを根拠にしない）', () => {
    for (const tea of teaItems) {
      for (const choco of chocolateItems) {
        const pool = new Set([...poolFor(tea, 'tea'), ...poolFor(choco, 'chocolate')])
        const firedRuleIds = new Set(
          [...analyzeInteractions(tea, choco).aroma, ...analyzeInteractions(tea, choco).taste, ...analyzeInteractions(tea, choco).mouthfeel].map((s) => s.ruleId),
        )
        for (const c of allChars(analyzePairingCharacter(tea, choco))) {
          for (const cid of c.basisCompoundIds) {
            expect(pool.has(cid), `${tea.id}×${choco.id}/${c.id}: 成分 ${cid} は確認済みプールの外`).toBe(true)
          }
          for (const nid of c.basisNoteIds) {
            const recorded = [tea, choco].some((item) => item.profile.aromas.some((a) => a.noteId === nid && rank(a.intensity) >= 2))
            expect(recorded, `${tea.id}×${choco.id}/${c.id}: ノート ${nid} はどちらのプロファイルにも普通以上で記録されていない`).toBe(true)
          }
          for (const k of c.basisTasteKeys) {
            const recorded = rank(tea.profile.tastes[k].intensity) >= 2 || rank(choco.profile.tastes[k].intensity) >= 2
            expect(recorded, `${tea.id}×${choco.id}/${c.id}: 味覚 ${k} はどちらのプロファイルにも普通以上で記録されていない`).toBe(true)
          }
          for (const r of c.basisRuleIds) {
            expect(firedRuleIds.has(r), `${tea.id}×${choco.id}/${c.id}: ルール ${r} は発火していない`).toBe(true)
          }
        }
      }
    }
  })

  it('発火例：ほうじ茶×焙煎ダークではロースティ・ウッディ・重厚が出る', () => {
    const a = analyzePairingCharacter(teaById('hojicha')!, chocolateById('dark-roasted')!)
    expect(charIds(a.aroma)).toContain('roasty')
    expect(charIds(a.aroma)).toContain('woody')
    expect(charIds(a.tasteMouthfeel)).toContain('heavy')
    const roasty = a.aroma.find((c) => c.id === 'roasty')!
    expect(roasty.basisNoteIds).toContain('toast')
    expect(roasty.basisCompoundIds.length).toBeGreaterThan(0)
  })

  it('発火例：紅茶×ミルクチョコでは、まろやか（渋味と脂肪の対向が根拠）とクリーミーとアーシーが出る', () => {
    const a = analyzePairingCharacter(teaById('black-tea')!, chocolateById('milk-chocolate')!)
    const mellow = a.tasteMouthfeel.find((c) => c.id === 'mellow')
    expect(mellow).toBeTruthy()
    expect(mellow!.basisRuleIds).toContain('fat-opposes-astringency')
    expect(charIds(a.tasteMouthfeel)).toContain('creamy')
    // アーシーは、ミルクチョコで「ナッツ様・土様」と記述された成分（ピラジン類）が根拠
    const earthy = a.aroma.find((c) => c.id === 'earthy')
    expect(earthy).toBeTruthy()
    expect(earthy!.basisCompoundIds).toContain('ethyl-3-6-dimethylpyrazine')
  })

  it('発火例：抹茶×ミルクチョコではコクがある（うま味が根拠）が出る', () => {
    const a = analyzePairingCharacter(teaById('matcha')!, chocolateById('milk-chocolate')!)
    const rich = a.tasteMouthfeel.find((c) => c.id === 'rich')
    expect(rich).toBeTruthy()
    expect(rich!.basisTasteKeys).toContain('umami')
    expect(rich!.basisCompoundIds).toContain('l-theanine')
    expect(rich!.sourceIds).toContain('ohsu-2010-kokumi-casr')
  })

  it('発火例：煎茶×ファインフレーバーではスパイシー（温かいスパイスのノートが根拠）が出る', () => {
    const a = analyzePairingCharacter(teaById('sencha')!, chocolateById('fine-flavor-chocolate')!)
    const spicy = a.aroma.find((c) => c.id === 'spicy')
    expect(spicy).toBeTruthy()
    expect(spicy!.basisNoteIds).toContain('warm-spice')
  })

  it('発火例：黒茶×焙煎ダークではアーシー（土のノートが根拠）が出る', () => {
    const a = analyzePairingCharacter(teaById('dark-tea')!, chocolateById('dark-roasted')!)
    const earthy = a.aroma.find((c) => c.id === 'earthy')
    expect(earthy).toBeTruthy()
    expect(earthy!.basisNoteIds).toContain('earth')
  })

  it('根拠のない性格は出ない：現在のデータではスモーキーはどの組み合わせでも出ない', () => {
    for (const tea of teaItems) {
      for (const choco of chocolateItems) {
        expect(charIds(allChars(analyzePairingCharacter(tea, choco))), `${tea.id}×${choco.id}`).not.toContain('smoky')
      }
    }
  })

  it('ブロンドチョコレートは一般的知見レベルのプロファイルを持ち、性格推測の対象になる', () => {
    const blond = chocolateById('blond-chocolate')!
    expect(blond.evidenceLevel).toBe('general')
    expect(blond.profile.aromas.length).toBeGreaterThan(0)
  })

  it('片側のデータが無い組み合わせでは性格を出さない（空プロファイルで検査）', () => {
    const emptyProfile = { aromas: [], tastes: emptyTastes(), temporal: emptyTemporal() }
    const emptyChoco = { ...chocolateById('blond-chocolate')!, profile: emptyProfile }
    for (const tea of teaItems) {
      const a = analyzePairingCharacter(tea, emptyChoco)
      expect(a.aroma, `${tea.id}×empty`).toHaveLength(0)
      expect(a.tasteMouthfeel, `${tea.id}×empty`).toHaveLength(0)
    }
    const a = analyzePairingCharacter(
      { ...teaById('sencha')!, profile: emptyProfile },
      { ...chocolateById('dark-roasted')!, profile: emptyProfile },
    )
    expect(a.aroma).toHaveLength(0)
    expect(a.tasteMouthfeel).toHaveLength(0)
  })

  it('同じ入力では同じ結果を返す（決定的）', () => {
    const tea = teaById('oolong-tea')!
    const choco = chocolateById('dark-roasted')!
    expect(analyzePairingCharacter(tea, choco)).toEqual(analyzePairingCharacter(tea, choco))
  })
})
