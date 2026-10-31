import { describe, it, expect } from 'vitest'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import {
  TEA_COMBO_KINDS, CHOCO_COMBO_KINDS, allTeaRegionOptions,
  teaCultivarOptions, chocoLineageOptions, chocoOriginOptions,
  analyzeTeaCombo, analyzeChocoCombo, teaComboBaseItem, chocoRepresentativeItem,
  type TeaComboSel, type ChocoComboSel, type ComboAnalysis,
} from './combo'
import { assemblePairing, assembleBlend } from './pairingCombo'

// 第37弾（ユーザー質問「渋みゲージの『強い』ってない？」への全数監査の恒常化）。
// 結論: 「強い」は存在する。アイテム単体では2件（ダークチョコレート（焙煎）と
// カカオ分100%チョコレート（無糖））が土台から strong。組み合わせでは軸効果の
// stronger で strong になる文脈がある（緑茶×ゆたかみどり／さやまかおり等）。
// ペアリング（お茶×チョコ）では、チョコレートの脂肪による相互作用
// 「渋味と脂肪の対向」が常に発火して一段下がるため、両側 strong でも
// 合成渋味は normal になる（表示バグではなく相互作用ルールの帰結）。
// ブレンド（同種同士）では strong に到達する。
const astr = (a: ComboAnalysis) => a.tastes.find((t) => t.key === 'astringent')

describe('渋味ゲージの「強い」の存在（第37弾監査）', () => {
  it('アイテム単体: 土台が strong のアイテムが存在する', () => {
    const strong = [...teaItems, ...chocolateItems].filter((i) => i.profile.tastes.astringent?.intensity === 'strong')
    expect(strong.map((i) => i.name)).toEqual(expect.arrayContaining(['ダークチョコレート（焙煎）', 'カカオ分100%チョコレート（無糖）']))
    expect(strong.length).toBeGreaterThanOrEqual(2)
  })

  it('組み合わせ全数: お茶・チョコとも strong になる文脈が存在する', () => {
    let teaStrong = 0
    let teaTotal = 0
    const regionIds = ['', ...allTeaRegionOptions().map((o) => o.id)]
    for (const kindId of TEA_COMBO_KINDS) {
      for (const regionId of regionIds) {
        for (const c of teaCultivarOptions({ kindId, regionId, cultivarId: '' })) {
          teaTotal++
          if (astr(analyzeTeaCombo({ kindId, regionId, cultivarId: c.id }))?.intensity === 'strong') teaStrong++
        }
      }
    }
    let chocoStrong = 0
    let chocoTotal = 0
    for (const kind of CHOCO_COMBO_KINDS) {
      const originIds = ['', ...chocoOriginOptions({ kind, originId: '', lineage: null }).map((o) => o.id)]
      for (const originId of originIds) {
        for (const l of chocoLineageOptions({ kind, originId, lineage: null })) {
          chocoTotal++
          if (astr(analyzeChocoCombo({ kind, originId, lineage: { layer: l.layer, id: l.id } }))?.intensity === 'strong') chocoStrong++
        }
      }
    }
    expect(teaTotal).toBeGreaterThan(300)
    expect(chocoTotal).toBeGreaterThan(600)
    expect(teaStrong).toBeGreaterThanOrEqual(14)
    expect(chocoStrong).toBeGreaterThanOrEqual(66)
    // 代表例: 緑茶×さやまかおり／ゆたかみどりは軸効果の stronger で strong になる
    expect(astr(analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: 'sayamakaori' }))?.intensity).toBe('strong')
    expect(astr(analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: 'yutakamidori' }))?.intensity).toBe('strong')
  }, 120000)

  it('ペアリング（お茶×チョコ）: 脂肪の相互作用で一段下がり normal になる（仕様）', () => {
    const strongTeaSel: TeaComboSel = { kindId: 'green', regionId: '', cultivarId: 'sayamakaori' }
    const strongChocoSel: ChocoComboSel = { kind: 'dark', originId: '', lineage: { layer: 'genetic', id: 'gen-amelonado' } }
    const asm = assemblePairing(teaComboBaseItem('green')!, chocoRepresentativeItem('dark')!, strongTeaSel, strongChocoSel)
    const t = asm.wheel.tastes.find((x) => x.key === 'astringent')
    expect(t?.intensity).toBe('normal')
    const meta = asm.wheel.tasteMeta.get('astringent')
    expect(meta?.adjustments.map((a) => a.label)).toContain('渋味と脂肪の対向')
  })

  it('ブレンド（同種同士）: strong に到達する', () => {
    const strongTeaSel: TeaComboSel = { kindId: 'green', regionId: '', cultivarId: 'sayamakaori' }
    const baseTeaSel: TeaComboSel = { kindId: 'green', regionId: '', cultivarId: '' }
    const b1 = assembleBlend(
      { type: 'tea', item: teaComboBaseItem('green')!, sel: strongTeaSel },
      { type: 'tea', item: teaComboBaseItem('green')!, sel: baseTeaSel },
    )
    expect(b1.wheel.tastes.find((x) => x.key === 'astringent')?.intensity).toBe('strong')
    const strongChocoSel: ChocoComboSel = { kind: 'dark', originId: '', lineage: { layer: 'genetic', id: 'gen-amelonado' } }
    const baseChocoSel: ChocoComboSel = { kind: 'dark', originId: '', lineage: null }
    const b2 = assembleBlend(
      { type: 'chocolate', item: chocoRepresentativeItem('dark')!, sel: strongChocoSel },
      { type: 'chocolate', item: chocoRepresentativeItem('dark')!, sel: baseChocoSel },
    )
    expect(b2.wheel.tastes.find((x) => x.key === 'astringent')?.intensity).toBe('strong')
  })
})
