import { describe, it, expect } from 'vitest'
import { teaById } from '../data/teas'
import { chocolateById } from '../data/chocolates'
import { analyzePairing } from './pairing'
import { analyzeInteractions } from './interactions'
import { analyzePairingCharacter } from './pairingCharacter'
import { assemblePairing } from './pairingCombo'

// 課題C（2026-10-31 第4弾）: ペアリング（第3層）は組み合わせの推測（第2層）同士の統合。
// 軸が指定された側は、組み合わせ分析（軸効果適用後）のノート集合が入力になる。
// ここでは「軸だけを変えたときに性格チップ・相互作用が実際に変わる」代表ケースと、
// 「変わらないのが正しいケースで理由表示と矛盾しない」ことを固定する。

const interactionTexts = (a: ReturnType<typeof assemblePairing>) =>
  [...a.interactions.aroma, ...a.interactions.taste, ...a.interactions.mouthfeel].map((s) => s.text)
const characterIds = (a: ReturnType<typeof assemblePairing>) =>
  [...a.characters.aroma, ...a.characters.tasteMouthfeel].map((c) => c.id)

describe('課題C: 軸指定がペアリング結果に効く', () => {
  it('軸なしの組み立ては、従来の素プロファイル呼び出しと一致する', () => {
    const tea = teaById('sencha')!
    const choco = chocolateById('dark-roasted')!
    const a = assemblePairing(tea, choco, null, null)
    expect(a.teaAnalysis).toBeNull()
    expect(a.chocoAnalysis).toBeNull()
    expect(a.result).toEqual(analyzePairing(tea.profile, choco.profile))
    expect(a.interactions).toEqual(analyzeInteractions(tea, choco))
    expect(a.characters).toEqual(analyzePairingCharacter(tea, choco))
  })

  it('お茶の品種を変えると相互作用の文が変わる（煎茶 × ダーク、ふくみどりのうま味）', () => {
    const tea = teaById('sencha')!
    const choco = chocolateById('dark-roasted')!
    const base = assemblePairing(tea, choco, null, null)
    const axed = assemblePairing(tea, choco, { kindId: 'sencha', regionId: '', cultivarId: 'fukumidori' }, null)
    expect(axed.teaAnalysis).not.toBeNull()
    expect(interactionTexts(axed)).not.toEqual(interactionTexts(base))
  })

  it('お茶の品種を変えると性格チップが変わる（紅茶 × ダーク、やぶきたの製法読み替え）', () => {
    const tea = teaById('black-tea')!
    const choco = chocolateById('dark-roasted')!
    const base = assemblePairing(tea, choco, null, null)
    const axed = assemblePairing(tea, choco, { kindId: 'black-tea', regionId: '', cultivarId: 'yabukita' }, null)
    expect(characterIds(axed)).not.toEqual(characterIds(base))
  })

  it('チョコの系統を変えると性格チップと相互作用が変わる（青茶 × ダーク、ナシオナル）', () => {
    const tea = teaById('oolong-tea')!
    const choco = chocolateById('dark-roasted')!
    const base = assemblePairing(tea, choco, null, null)
    const axed = assemblePairing(tea, choco, null, { kind: 'dark', originId: '', lineage: { layer: 'genetic', id: 'gen-nacional' } })
    expect(characterIds(axed)).not.toEqual(characterIds(base))
    expect(interactionTexts(axed)).not.toEqual(interactionTexts(base))
  })

  it('ユーザー実例: 抹茶×村上×はるみどり × ダーク（焙煎）×エクアドル×アメロナド', () => {
    const tea = teaById('matcha')!
    const choco = chocolateById('dark-roasted')!
    const a = assemblePairing(tea, choco,
      { kindId: 'matcha', regionId: 'murakami', cultivarId: 'harumidori' },
      { kind: 'dark', originId: 'ecuador', lineage: { layer: 'genetic', id: 'gen-amelonado' } })
    // タイトルには指定した軸まで出る
    expect(a.teaAnalysis?.title).toBe('村上 × はるみどり × 抹茶')
    expect(a.chocoAnalysis?.title).toContain('エクアドル')
    expect(a.chocoAnalysis?.title).toContain('アメロナド')
    // お茶側: 品種は第2層に反映される／地域（村上）は理由つきで反映されない
    const teaCultivar = a.teaAnalysis?.axisSummaries.find((s) => s.axis === 'cultivar')
    expect(teaCultivar?.reflected).toBe(true)
    const teaRegion = a.teaAnalysis?.axisSummaries.find((s) => s.axis === 'region')
    expect(teaRegion?.reflected).toBe(false)
    expect(teaRegion?.text).toContain('寄与を示すものではない')
    // チョコ側: 産地・系統とも効果がないのが正しいケースで、理由が返る
    const chocoOrigin = a.chocoAnalysis?.axisSummaries.find((s) => s.axis === 'origin')
    expect(chocoOrigin?.reflected).toBe(false)
    expect(chocoOrigin?.text.length).toBeGreaterThan(20)
    const chocoLineage = a.chocoAnalysis?.axisSummaries.find((s) => s.axis === 'lineage')
    expect(chocoLineage?.reflected).toBe(false)
    expect(chocoLineage?.text.length).toBeGreaterThan(20)
    // チョコ側の第2層プロファイルは素と一致する（効果がないことと結果が矛盾しない。
    // basis の表記は level からの再導出で変わりうるため、ノートと強度で比べる）
    const face = (p: typeof choco.profile) => p.aromas.map((n) => `${n.noteId}:${n.intensity}`)
    expect(face(a.chocoItem.profile)).toEqual(face(choco.profile))
    // 結果自体は例外なく生成される
    expect(a.result.level).toBeDefined()
    expect(a.characters).toBeDefined()
  })

  it('軸指定時の入力プロファイルは組み合わせ分析のノート集合そのものになる', () => {
    const tea = teaById('oolong-tea')!
    const choco = chocolateById('dark-roasted')!
    const a = assemblePairing(tea, choco, { kindId: 'oolong', regionId: 'guangdong', cultivarId: 'fenghuang-dancong-group' }, null)
    const analysisNoteIds = a.teaAnalysis!.notes.map((n) => n.noteId).sort()
    const profileNoteIds = a.teaItem.profile.aromas.map((n) => n.noteId).sort()
    expect(profileNoteIds).toEqual(analysisNoteIds)
    // 蘭のノートがペアリング入力に含まれている（素のプロファイルには無い）
    expect(profileNoteIds).toContain('orchid')
    expect(tea.profile.aromas.some((n) => n.noteId === 'orchid')).toBe(false)
  })
})
