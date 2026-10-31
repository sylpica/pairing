import { describe, it, expect } from 'vitest'
import { assembleBlend, assemblePairing, type BlendSideInput } from './pairingCombo'
import { teaItems, teaById } from '../data/teas'
import { chocolateItems, chocolateById } from '../data/chocolates'
import { teaCultivars } from '../data/cultivars'
import { cacaoOrigins } from '../data/origins'
import { sources } from '../data/sources'
import { noteById, categoryById } from '../data/flavors'
import {
  TEA_COMBO_KINDS, CHOCO_COMBO_KINDS, allTeaRegionOptions, allLineages,
  teaComboViable, chocoComboViable, teaComboBaseItem, chocoRepresentativeItem,
  cloneRecordedOriginIds, type TeaComboSel, type ChocoComboSel,
} from './combo'
import type { InteractionAnalysis, PairingCharacterAnalysis } from '../types'
import type { PairingResult } from './pairing'

// 第9弾（自家ブレンド対応）の検証。
// お茶×お茶・チョコ×チョコでも組み立てが成立すること、直接研究ルール（M14）と
// 種別固定の実験条件を持つルールが同種ペアで発火しないこと、文面に相手の種別名が
// 誤って現れないこと、異種ペアでは従来の assemblePairing と結果が一致することを確認する。

const sourceIdSet = new Set(sources.map((s) => s.id))
const SCORE_PATTERN = /\d+\s*点/

/** お茶×チョコの直接研究・種別固定条件に基づくため、同種ペアでは発火しないルール */
const CROSS_ONLY_RULES = [
  'direct-study-balance-principle', // M14: お茶×チョコの直接官能研究
  'fat-opposes-astringency', // M7: 渋味のある飲み物×脂肪の多い食品の交互摂取
  'fat-coating-aroma-persistence', // M8: チョコを食べた後にお茶を飲む順序の現象
  'milk-protein-softens-astringency', // M11: 牛乳入り紅茶の系
]
/** お茶側がいないペアでは発火しないルール */
const TEA_SIDE_RULES = [
  'tea-polyphenols-modulate-aroma-release', // M12: ポリフェノール側はお茶
  'tea-creaming-on-cooling', // M13: お茶のクリーミングダウン
  'warmth-and-sweetness', // M9: 温かい飲み物（お茶）が前提
]

const allTexts = (result: PairingResult, interactions: InteractionAnalysis, characters: PairingCharacterAnalysis): string[] => [
  result.message,
  ...result.contrasts.map((c) => `${c.label} ${c.detail}`),
  ...[...interactions.aroma, ...interactions.taste, ...interactions.mouthfeel].map((s) => s.text),
  ...[...characters.aroma, ...characters.tasteMouthfeel].map((c) => `${c.label} ${c.rationale}`),
]

function checkAssembly(
  a: ReturnType<typeof assembleBlend>,
  where: string,
  opts: { forbiddenRules: string[]; forbiddenWord?: string },
): string[] {
  const violations: string[] = []
  const statements = [...a.interactions.aroma, ...a.interactions.taste, ...a.interactions.mouthfeel]
  for (const s of statements) {
    if (opts.forbiddenRules.includes(s.ruleId)) violations.push(`${where}: 同種ペアで発火してはいけないルール ${s.ruleId} が発火`)
    if (s.sourceIds.length === 0) violations.push(`${where}: 相互作用 ${s.ruleId} に出典がない`)
    for (const id of s.sourceIds) if (!sourceIdSet.has(id)) violations.push(`${where}: 相互作用の出典 ${id} が実在しない`)
    if (SCORE_PATTERN.test(s.text)) violations.push(`${where}: 相互作用文にスコア表現`)
  }
  for (const c of [...a.characters.aroma, ...a.characters.tasteMouthfeel]) {
    if (c.sourceIds.length === 0) violations.push(`${where}: 性格 ${c.id} に根拠出典がない`)
    for (const id of c.sourceIds) if (!sourceIdSet.has(id)) violations.push(`${where}: 性格 ${c.id} の出典 ${id} が実在しない`)
    if (SCORE_PATTERN.test(c.rationale) || SCORE_PATTERN.test(c.label)) violations.push(`${where}: 性格 ${c.id} にスコア表現`)
  }
  for (const s of a.result.sharedNotes) if (!noteById(s.noteId)) violations.push(`${where}: 共有ノート ${s.noteId} が実在しない`)
  for (const s of a.result.sharedCategories) if (!categoryById(s.categoryId)) violations.push(`${where}: 共有分類 ${s.categoryId} が実在しない`)
  if (opts.forbiddenWord) {
    for (const t of allTexts(a.result, a.interactions, a.characters)) {
      if (t.includes(opts.forbiddenWord)) violations.push(`${where}: 文面に「${opts.forbiddenWord}」が混入: ${t.slice(0, 60)}…`)
    }
  }
  return violations
}

const teaSide = (id: string): BlendSideInput => ({ type: 'tea', item: teaById(id)!, sel: null })
const chocoSide = (id: string): BlendSideInput => ({ type: 'chocolate', item: chocolateById(id)!, sel: null })

describe('第9弾: assembleBlend の一般化', () => {
  it('異種ペアでは従来の assemblePairing と結果が一致し、左右を入れ替えても同じ結果になる', () => {
    const cases: [string, string, TeaComboSel | null, ChocoComboSel | null][] = [
      ['sencha', 'dark-roasted', null, null],
      ['black-tea', 'milk-chocolate', { kindId: 'black', regionId: '', cultivarId: 'yabukita' }, null],
      ['oolong-tea', 'dark-unroasted', null, { kind: 'dark', originId: 'ecuador', lineage: { layer: 'genetic', id: 'gen-nacional' } }],
    ]
    for (const [teaId, chocoId, teaSel, chocoSel] of cases) {
      const legacy = assemblePairing(teaById(teaId)!, chocolateById(chocoId)!, teaSel, chocoSel)
      const blend = assembleBlend(
        { type: 'tea', item: teaById(teaId)!, sel: teaSel },
        { type: 'chocolate', item: chocolateById(chocoId)!, sel: chocoSel })
      expect(blend.sameType).toBe(false)
      expect(blend.result).toEqual(legacy.result)
      expect(blend.interactions).toEqual(legacy.interactions)
      expect(blend.characters).toEqual(legacy.characters)
      const swapped = assembleBlend(
        { type: 'chocolate', item: chocolateById(chocoId)!, sel: chocoSel },
        { type: 'tea', item: teaById(teaId)!, sel: teaSel })
      expect(swapped.result).toEqual(legacy.result)
      expect(swapped.interactions).toEqual(legacy.interactions)
      expect(swapped.characters).toEqual(legacy.characters)
    }
  })

  it('お茶×お茶: 全アイテム同士で組み立てが成立し、直接研究ルールは発火せず、文面に「チョコレート」が出ない', () => {
    const violations: string[] = []
    let fired = new Set<string>()
    for (const x of teaItems) {
      for (const y of teaItems) {
        const a = assembleBlend({ type: 'tea', item: x, sel: null }, { type: 'tea', item: y, sel: null })
        expect(a.sameType).toBe(true)
        fired = new Set([...fired, ...[...a.interactions.aroma, ...a.interactions.taste, ...a.interactions.mouthfeel].map((s) => s.ruleId)])
        violations.push(...checkAssembly(a, `${x.id}×${y.id}`, { forbiddenRules: CROSS_ONLY_RULES, forbiddenWord: 'チョコレート' }))
        if (violations.length > 20) break
      }
      if (violations.length > 20) break
    }
    expect(violations).toEqual([])
    // 一般機序のルールはお茶同士でも発火する（代表例）。
    // なお現行データではお茶アイテムに甘味「普通」以上の記録がないため、
    // 甘味を媒介するルール（混合抑制・温かさ等）はお茶同士のアイテムペアでは
    // 発火しない。これはデータの実態であり、エンジンの制限ではない。
    expect(fired.has('umami-aroma-interaction')).toBe(true)
    expect(fired.has('tea-creaming-on-cooling')).toBe(true)
    expect(fired.has('tea-polyphenols-modulate-aroma-release')).toBe(true)
    expect(fired.has('shared-aroma-congruency')).toBe(true)
  }, 300000)

  it('チョコ×チョコ: 全アイテム同士で組み立てが成立し、直接研究ルールとお茶前提ルールは発火せず、文面に「お茶」が出ない', () => {
    const violations: string[] = []
    let fired = new Set<string>()
    for (const x of chocolateItems) {
      for (const y of chocolateItems) {
        const a = assembleBlend({ type: 'chocolate', item: x, sel: null }, { type: 'chocolate', item: y, sel: null })
        expect(a.sameType).toBe(true)
        fired = new Set([...fired, ...[...a.interactions.aroma, ...a.interactions.taste, ...a.interactions.mouthfeel].map((s) => s.ruleId)])
        violations.push(...checkAssembly(a, `${x.id}×${y.id}`, { forbiddenRules: [...CROSS_ONLY_RULES, ...TEA_SIDE_RULES], forbiddenWord: 'お茶' }))
        if (violations.length > 20) break
      }
      if (violations.length > 20) break
    }
    expect(violations).toEqual([])
    // 一般機序のルールはチョコ同士でも発火する（代表例）
    expect(fired.has('sweet-aroma-enhances-sweetness')).toBe(true)
    expect(fired.has('cacao-aroma-enhances-bitterness')).toBe(true)
  }, 300000)

  it('同じアイテム同士（自分自身とのブレンド）もエラーなく、そのアイテムとして組み立つ', () => {
    for (const side of [teaSide('sencha'), teaSide('matcha'), chocoSide('dark-roasted'), chocoSide('milk-chocolate')]) {
      const a = assembleBlend(side, side)
      expect(a.sameType).toBe(true)
      expect(a.result).toBeTruthy()
      expect(a.result.level).toBeDefined()
      // 自分自身との組み合わせでは、共通する香りとして自分自身の香りが返る
      const item = side.item
      const knownNotes = item.profile.aromas.filter((x) => ['strong', 'normal'].includes(x.intensity)).map((x) => x.noteId)
      for (const s of a.result.sharedNotes) expect(knownNotes).toContain(s.noteId)
    }
  })

  it('直接研究ルール（M14）はお茶×チョコでのみ発火する', () => {
    const cross = assembleBlend(teaSide('sencha'), chocoSide('dark-roasted'))
    expect(cross.interactions.aroma.some((s) => s.ruleId === 'direct-study-balance-principle')).toBe(true)
    const teaTea = assembleBlend(teaSide('sencha'), teaSide('black-tea'))
    expect(teaTea.interactions.aroma.some((s) => s.ruleId === 'direct-study-balance-principle')).toBe(false)
    const chocoChoco = assembleBlend(chocoSide('dark-roasted'), chocoSide('milk-chocolate'))
    expect(chocoChoco.interactions.aroma.some((s) => s.ruleId === 'direct-study-balance-principle')).toBe(false)
  })
})

function enumerateTeaSels(): TeaComboSel[] {
  const kindValues = [...new Set([...TEA_COMBO_KINDS, ...teaItems.map((t) => t.id)])]
  const regionIds = ['', ...allTeaRegionOptions().map((o) => o.id)]
  const cultivarIds = ['', ...teaCultivars.map((c) => c.id)]
  const out: TeaComboSel[] = []
  for (const kindId of kindValues)
    for (const regionId of regionIds)
      for (const cultivarId of cultivarIds) {
        const sel = { kindId, regionId, cultivarId }
        if (teaComboViable(sel)) out.push(sel)
      }
  return out
}

function enumerateChocoSels(): ChocoComboSel[] {
  const originIds = ['', ...cacaoOrigins.map((o) => o.id)]
  const lineageRefs = [null, ...allLineages().map((l) => ({ layer: l.layer, id: l.id }))]
  const out: ChocoComboSel[] = []
  for (const kind of CHOCO_COMBO_KINDS)
    for (const originId of originIds)
      for (const lineage of lineageRefs) {
        const sel: ChocoComboSel = { kind, originId, lineage }
        if (!chocoComboViable(sel)) continue
        if (lineage?.layer === 'clone' && originId) {
          const recorded = cloneRecordedOriginIds(lineage.id)
          if (recorded.length > 0 && !recorded.includes(originId)) continue
        }
        out.push(sel)
      }
  return out
}

describe('第9弾: 組み合わせ選択（軸指定）の同種ペア検証', () => {
  it('お茶の全組み合わせ選択 × 固定のお茶アイテムで組み立てが成立する', () => {
    const sels = enumerateTeaSels()
    expect(sels.length).toBeGreaterThan(0)
    const partner = teaById('sencha')!
    const violations: string[] = []
    for (const sel of sels) {
      const item = teaComboBaseItem(sel.kindId)!
      const a = assembleBlend({ type: 'tea', item, sel }, { type: 'tea', item: partner, sel: null })
      if (sel.regionId || sel.cultivarId) expect(a.a.analysis, `${sel.kindId}|${sel.regionId}|${sel.cultivarId}`).toBeTruthy()
      violations.push(...checkAssembly(a, `${item.id}(${sel.kindId}|${sel.regionId}|${sel.cultivarId})×sencha`, { forbiddenRules: CROSS_ONLY_RULES, forbiddenWord: 'チョコレート' }))
      if (violations.length > 20) break
    }
    expect(violations).toEqual([])
  }, 600000)

  it('チョコの全組み合わせ選択 × 固定のチョコアイテムで組み立てが成立する', () => {
    const sels = enumerateChocoSels()
    expect(sels.length).toBeGreaterThan(0)
    const partner = chocolateById('dark-roasted')!
    const violations: string[] = []
    for (const sel of sels) {
      const item = chocoRepresentativeItem(sel.kind)!
      const a = assembleBlend({ type: 'chocolate', item, sel }, { type: 'chocolate', item: partner, sel: null })
      if (sel.originId || sel.lineage) expect(a.a.analysis, `${sel.kind}|${sel.originId}|${sel.lineage?.id ?? ''}`).toBeTruthy()
      violations.push(...checkAssembly(a, `${item.id}(${sel.kind}|${sel.originId}|${sel.lineage?.id ?? ''})×dark-roasted`, { forbiddenRules: [...CROSS_ONLY_RULES, ...TEA_SIDE_RULES], forbiddenWord: 'お茶' }))
      if (violations.length > 20) break
    }
    expect(violations).toEqual([])
  }, 600000)

  it('両側とも軸指定のお茶同士・チョコ同士（系統的サンプリング）でも組み立てが成立する', () => {
    const violations: string[] = []
    const teaSels = enumerateTeaSels()
    const teaSample = teaSels.filter((_, i) => i % 97 === 0)
    for (let i = 0; i < teaSample.length; i++) {
      const x = teaSample[i]
      const y = teaSample[(i * 7 + 3) % teaSample.length]
      const a = assembleBlend(
        { type: 'tea', item: teaComboBaseItem(x.kindId)!, sel: x },
        { type: 'tea', item: teaComboBaseItem(y.kindId)!, sel: y })
      violations.push(...checkAssembly(a, `tea(${x.kindId}|${x.cultivarId})×tea(${y.kindId}|${y.cultivarId})`, { forbiddenRules: CROSS_ONLY_RULES, forbiddenWord: 'チョコレート' }))
    }
    const chocoSels = enumerateChocoSels()
    const chocoSample = chocoSels.filter((_, i) => i % 89 === 0)
    for (let i = 0; i < chocoSample.length; i++) {
      const x = chocoSample[i]
      const y = chocoSample[(i * 5 + 2) % chocoSample.length]
      const a = assembleBlend(
        { type: 'chocolate', item: chocoRepresentativeItem(x.kind)!, sel: x },
        { type: 'chocolate', item: chocoRepresentativeItem(y.kind)!, sel: y })
      violations.push(...checkAssembly(a, `choco(${x.kind}|${x.lineage?.id ?? ''})×choco(${y.kind}|${y.lineage?.id ?? ''})`, { forbiddenRules: [...CROSS_ONLY_RULES, ...TEA_SIDE_RULES], forbiddenWord: 'お茶' }))
    }
    expect(violations).toEqual([])
  }, 600000)
})
