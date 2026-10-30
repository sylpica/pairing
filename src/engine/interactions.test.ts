import { describe, it, expect } from 'vitest'
import { analyzeInteractions, hasAnyInteraction } from './interactions'
import { teaItems, teaById } from '../data/teas'
import { chocolateItems, chocolateById } from '../data/chocolates'
import { flavorNotes, noteById } from '../data/flavors'
import { sources } from '../data/sources'
import { inferencesFor } from '../data/inferences'
import { emptyTastes, emptyTemporal } from '../types'
import type { InteractionStatement, TasteKey } from '../types'

const sourceIds = new Set(sources.map((s) => s.id))
const rank = (i: string) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)
const allStatements = (a: ReturnType<typeof analyzeInteractions>): InteractionStatement[] => [...a.aroma, ...a.taste, ...a.mouthfeel]
const ruleIds = (list: InteractionStatement[]) => list.map((s) => s.ruleId)
const TASTE_KEYS: TasteKey[] = ['sweet', 'sour', 'bitter', 'astringent', 'umami']
const TASTE_LABEL_OF: Record<TasteKey, string> = { sweet: '甘味', sour: '酸味', bitter: '苦味', astringent: '渋味', umami: 'うま味' }

describe('組み合わせの相互作用エンジン', () => {
  it('すべての実データの組み合わせで、各文に根拠区分と実在する出典があり、スコア的数値が出ない', () => {
    for (const tea of teaItems) {
      for (const choco of chocolateItems) {
        const a = analyzeInteractions(tea, choco)
        for (const s of allStatements(a)) {
          expect(['general', 'exploratory'], `${tea.id}×${choco.id}/${s.ruleId}`).toContain(s.level)
          expect(s.sourceIds.length, `${tea.id}×${choco.id}/${s.ruleId}`).toBeGreaterThan(0)
          for (const sid of s.sourceIds) expect(sourceIds.has(sid), `${s.ruleId}: ${sid}`).toBe(true)
          expect(s).not.toHaveProperty('score')
          expect(s.text).not.toMatch(/\d+\s*点/)
          expect(s.text).not.toMatch(/\d+\s*%/)
        }
      }
    }
  })

  it('文に現れる香味ノート名・味覚名は、両プロファイルの実データ（普通以上）か、使用した推測のラベルだけである', () => {
    for (const tea of teaItems) {
      for (const choco of chocolateItems) {
        const allowedNotes = new Set<string>()
        for (const item of [tea, choco]) {
          for (const a of item.profile.aromas) {
            if (rank(a.intensity) >= 2) allowedNotes.add(noteById(a.noteId)?.name ?? a.noteId)
          }
        }
        const inferenceLabels = new Set<string>()
        for (const inf of [...inferencesFor('tea', tea.id, 'floral-general'), ...inferencesFor('tea', tea.id, 'tropical'), ...inferencesFor('tea', tea.id, 'fruit-general'),
          ...inferencesFor('chocolate', choco.id, 'floral-general'), ...inferencesFor('chocolate', choco.id, 'tropical'), ...inferencesFor('chocolate', choco.id, 'fruit-general')]) {
          inferenceLabels.add(inf.label)
        }
        const a = analyzeInteractions(tea, choco)
        for (const s of allStatements(a)) {
          for (const n of flavorNotes) {
            if (!s.text.includes(n.name)) continue
            const grounded = allowedNotes.has(n.name)
              || [...inferenceLabels].some((l) => l.includes(n.name) || n.name.includes(l))
            expect(grounded, `${tea.id}×${choco.id}/${s.ruleId}: ノート「${n.name}」への言及に実データの裏付けがない`).toBe(true)
          }
          for (const k of TASTE_KEYS) {
            if (!s.text.includes(TASTE_LABEL_OF[k])) continue
            const grounded = rank(tea.profile.tastes[k].intensity) >= 2 || rank(choco.profile.tastes[k].intensity) >= 2
            expect(grounded, `${tea.id}×${choco.id}/${s.ruleId}: 味覚「${TASTE_LABEL_OF[k]}」への言及に実データの裏付けがない`).toBe(true)
          }
        }
      }
    }
  })

  it('推測を使う文には推測フラグと本文中の推測明示があり、推測を含む文はすべてフラグ付きである', () => {
    for (const tea of teaItems) {
      for (const choco of chocolateItems) {
        for (const s of allStatements(analyzeInteractions(tea, choco))) {
          if (s.usesInference) expect(s.text, `${tea.id}×${choco.id}/${s.ruleId}`).toContain('推測')
          if (s.text.includes('推測')) expect(s.usesInference, `${tea.id}×${choco.id}/${s.ruleId}`).toBe(true)
        }
      }
    }
    const a = analyzeInteractions(teaById('sencha')!, chocolateById('fine-flavor-chocolate')!)
    const inf = a.aroma.find((s) => s.ruleId === 'shared-aroma-inference-overlap')
    expect(inf).toBeTruthy()
    expect(inf!.usesInference).toBe(true)
    expect(inf!.text).toContain('バラ')
    expect(inf!.text).toContain('ジャスミン')
    expect(inf!.text).toContain('推測・未検証')
  })

  it('発火例：ミルクチョコ×紅茶では甘味による苦味・渋味の緩和と、脂肪と渋味の対向が出る', () => {
    const a = analyzeInteractions(teaById('black-tea')!, chocolateById('milk-chocolate')!)
    expect(ruleIds(a.taste)).toContain('sweetness-suppresses-bitterness')
    expect(ruleIds(a.taste)).toContain('sweetness-softens-astringency')
    expect(ruleIds(a.mouthfeel)).toContain('fat-opposes-astringency')
    expect(a.taste.find((s) => s.ruleId === 'sweetness-suppresses-bitterness')!.level).toBe('general')
    expect(a.mouthfeel.find((s) => s.ruleId === 'fat-opposes-astringency')!.level).toBe('general')
  })

  it('発火例：焙煎ダーク×煎茶ではカカオの香りによる苦味の方向が出る', () => {
    const a = analyzeInteractions(teaById('sencha')!, chocolateById('dark-roasted')!)
    const s = a.aroma.find((x) => x.ruleId === 'cacao-aroma-enhances-bitterness')
    expect(s).toBeTruthy()
    expect(s!.level).toBe('exploratory')
    expect(s!.text).toContain('カカオ')
  })

  it('発火例：ほうじ茶×ホワイトチョコでは強い香りが穏やかな香りを覆う方向が出る', () => {
    // ほうじ茶は「トースト」「木・樹皮」が強い。ホワイトチョコの香りは全て普通で分類も重ならない。
    const a = analyzeInteractions(teaById('hojicha')!, chocolateById('white-chocolate')!)
    const s = a.aroma.find((x) => x.ruleId === 'strong-aroma-covers-delicate')
    expect(s).toBeTruthy()
    expect(s!.level).toBe('exploratory')
    expect(s!.text).toContain('トースト')
  })

  it('発火例：未焙煎ダーク×蒸し緑茶では酸味と苦味・甘味の相互作用が出る', () => {
    const a = analyzeInteractions(teaById('green-steamed')!, chocolateById('dark-unroasted')!)
    expect(ruleIds(a.taste)).toContain('sourness-enhances-bitterness')
    expect(ruleIds(a.taste)).toContain('sweetness-suppresses-bitterness')
    expect(a.taste.find((s) => s.ruleId === 'sourness-enhances-bitterness')!.level).toBe('exploratory')
  })

  it('発火例：抹茶×ミルクチョコではうま味と香りの相互作用が探索的予想として出る', () => {
    const a = analyzeInteractions(teaById('matcha')!, chocolateById('milk-chocolate')!)
    const s = a.taste.find((x) => x.ruleId === 'umami-aroma-interaction')
    expect(s).toBeTruthy()
    expect(s!.level).toBe('exploratory')
    expect(s!.text).toContain('直接の検証はありません')
  })

  it('データが最小の組み合わせでは、どの観点でも文を作らない（特記なし）', () => {
    const emptyProfile = { aromas: [], tastes: emptyTastes(), temporal: emptyTemporal() }
    const tea = { ...teaById('dark-tea')!, profile: emptyProfile }
    const choco = { ...chocolateById('white-chocolate')!, profile: emptyProfile }
    const a = analyzeInteractions(tea, choco)
    expect(a.aroma).toHaveLength(0)
    expect(a.taste).toHaveLength(0)
    expect(a.mouthfeel).toHaveLength(0)
    expect(hasAnyInteraction(a)).toBe(false)
  })
})
