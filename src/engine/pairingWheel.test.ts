import { describe, it, expect } from 'vitest'
import { teaItems, teaById } from '../data/teas'
import { chocolateItems, chocolateById } from '../data/chocolates'
import { noteById } from '../data/flavors'
import { sources } from '../data/sources'
import { assembleBlend, assemblePairing } from './pairingCombo'
import { PAIRING_WHEEL_MAX_NOTES } from './pairingWheel'
import type { TeaComboSel, ChocoComboSel } from './combo'

// 第26弾: ペアリング結果ホイール（ノート単位の統合＋相互作用の反映＋代表選定）の単体検証。
const sourceIdSet = new Set(sources.map((s) => s.id))
const SCORE_PATTERN = /\d+\s*点/
const rank = (i: string) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)

const dark = chocolateById('dark-roasted') ?? chocolateItems.find((c) => c.kind === 'dark')!
const greenTea = teaById('sencha') ?? teaItems[0]

describe('ペアリングホイール（第26弾）', () => {
  it('代表ノートは2〜7件で、全て推測（inferred）として扱われる', () => {
    const a = assemblePairing(greenTea, dark, null, null)
    expect(a.wheel.notes.length).toBeGreaterThanOrEqual(2)
    expect(a.wheel.notes.length).toBeLessThanOrEqual(PAIRING_WHEEL_MAX_NOTES)
    for (const n of a.wheel.notes) {
      expect(noteById(n.noteId)).toBeTruthy()
      expect(n.level).toBe('inferred')
      expect(n.sourceIds.length).toBeGreaterThan(0)
      for (const id of n.sourceIds) expect(sourceIdSet.has(id)).toBe(true)
      expect(SCORE_PATTERN.test(noteById(n.noteId)!.name)).toBe(false)
    }
    for (const t of a.wheel.tastes) {
      expect(t.level).toBe('inferred')
      for (const id of t.sourceIds) expect(sourceIdSet.has(id)).toBe(true)
    }
    expect(a.wheel.contexts.length).toBe(2)
    expect(a.wheel.candidateCount).toBeGreaterThanOrEqual(a.wheel.notes.length)
    expect(a.wheel.underMinimum).toBe(false)
  })

  it('決定性: 同じ入力では同じ選定になる', () => {
    const a1 = assemblePairing(greenTea, dark, null, null)
    const a2 = assemblePairing(greenTea, dark, null, null)
    expect(a1.wheel.notes.map((n) => n.noteId)).toEqual(a2.wheel.notes.map((n) => n.noteId))
    expect(a1.wheel.tastes.map((t) => `${t.key}:${t.intensity}`)).toEqual(a2.wheel.tastes.map((t) => `${t.key}:${t.intensity}`))
  })

  it('共通する香りは調和の相互作用で重みが強まる（足し算より大きくなる）', () => {
    // 全アイテムペアを走査し、調和の調整が付いたノートが「素のランク合計より重い」ことを確認する
    let checked = 0
    for (const t of teaItems) for (const c of chocolateItems) {
      const a = assemblePairing(t, c, null, null)
      for (const [noteId, meta] of a.wheel.noteMeta) {
        if (!meta.adjustments.some((adj) => adj.ruleId === 'shared-aroma-congruency')) continue
        const rankSum = meta.contributions.reduce((s, c) => s + (c.note ? rank(c.note.intensity) : 0), 0)
        expect(meta.weight, `${t.id} x ${c.id} / ${noteId}`).toBeGreaterThan(rankSum)
        checked++
      }
    }
    expect(checked).toBeGreaterThan(0)
  })

  it('甘味が苦味を抑える相互作用が発火すると、苦味に抑制の調整が付く', () => {
    // ミルクチョコ（甘味）× お茶（苦味）で混合抑制が発火する組み合わせを探す
    const milk = chocolateItems.find((c) => c.kind === 'milk')!
    const tea = teaItems.find((t) => rank(t.profile.tastes.bitter.intensity) >= 2 && rank(milk.profile.tastes.sweet.intensity) >= 2)!
    const a = assemblePairing(tea, milk, null, null)
    const fired = [...a.interactions.aroma, ...a.interactions.taste, ...a.interactions.mouthfeel]
    expect(fired.some((s) => s.ruleId === 'sweetness-suppresses-bitterness')).toBe(true)
    const bitterMeta = a.wheel.tasteMeta.get('bitter')
    expect(bitterMeta).toBeTruthy()
    expect(bitterMeta!.adjustments.some((adj) => adj.ruleId === 'sweetness-suppresses-bitterness' && adj.direction === 'suppress')).toBe(true)
    const bitter = a.wheel.tastes.find((t) => t.key === 'bitter')!
    expect(bitter.text).toContain('甘味が苦味を抑える')
  })

  it('軸指定で変わったノートは、重みが小さくても代表に残る（品種の特徴）', () => {
    const sel: TeaComboSel = { kindId: 'green', regionId: 'shizuoka', cultivarId: 'yabukita' }
    const a = assemblePairing(teaById('sencha')!, dark, sel, null)
    // やぶきた×静岡×緑茶では「はちみつ（弱い）」が品種由来の差分として入る
    expect(a.teaAnalysis?.notes.some((n) => n.noteId === 'honey')).toBe(true)
    expect(a.wheel.notes.some((n) => n.noteId === 'honey')).toBe(true)
  })

  it('産地を変えると代表ノートの顔ぶれが変わる（緑茶: 日本 vs 中国）', () => {
    const jp: TeaComboSel = { kindId: 'green', regionId: 'country:日本', cultivarId: '' }
    const cn: TeaComboSel = { kindId: 'green', regionId: 'country:中国', cultivarId: '' }
    const aJp = assemblePairing(teaById('sencha')!, dark, jp, null)
    const aCn = assemblePairing(teaById('sencha')!, dark, cn, null)
    const ids = (a: typeof aJp) => a.wheel.notes.map((n) => `${n.noteId}:${n.intensity}`).sort().join(',')
    expect(ids(aJp)).not.toBe(ids(aCn))
  })

  it('同種ペア・同一アイテム同士でもホイールが成立する', () => {
    const same = assembleBlend(
      { type: 'tea', item: greenTea, sel: null },
      { type: 'tea', item: greenTea, sel: null })
    expect(same.wheel.notes.length).toBeGreaterThanOrEqual(2)
    expect(same.wheel.notes.length).toBeLessThanOrEqual(PAIRING_WHEEL_MAX_NOTES)
    expect(same.wheel.contexts.length).toBe(1) // 同一アイテムの文脈は重複排除される
    const chocoSame = assembleBlend(
      { type: 'chocolate', item: dark, sel: null },
      { type: 'chocolate', item: dark, sel: null })
    expect(chocoSame.wheel.notes.length).toBeGreaterThanOrEqual(2)
  })

  it('軸の部分指定（分類のみ／分類＋産地／全指定）でもホイールが成立する', () => {
    const teaSels: (TeaComboSel | null)[] = [
      null,
      { kindId: 'green', regionId: '', cultivarId: '' },
      { kindId: 'green', regionId: 'nagasaki', cultivarId: '' },
      { kindId: 'green', regionId: '', cultivarId: 'yabukita' },
      { kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' },
    ]
    const chocoSels: (ChocoComboSel | null)[] = [
      null,
      { kind: 'dark', originId: '', lineage: null },
      { kind: 'dark', originId: 'ecuador', lineage: null },
      { kind: 'dark', originId: '', lineage: { layer: 'genetic', id: 'gen-amelonado' } },
      { kind: 'dark', originId: 'ecuador', lineage: { layer: 'genetic', id: 'gen-amelonado' } },
    ]
    for (const ts of teaSels) for (const cs of chocoSels) {
      const a = assemblePairing(teaById('sencha')!, dark, ts, cs)
      expect(a.wheel.notes.length).toBeGreaterThanOrEqual(2)
      expect(a.wheel.notes.length).toBeLessThanOrEqual(PAIRING_WHEEL_MAX_NOTES)
      expect(a.wheel.tastes.length).toBeLessThanOrEqual(5)
    }
  })
})
