import { describe, expect, it } from 'vitest'
import { buildAstringency } from './wheelTiers'
import { assemblePairing } from './pairingCombo'
import { comboTastesFromProfile } from '../components/TasteWheel'
import { teaItems, teaById } from '../data/teas'
import { chocolateItems, chocolateById } from '../data/chocolates'
import { sources } from '../data/sources'
import {
  CHOCO_COMBO_KINDS, chocoLineageOptions, chocoOriginOptions, analyzeChocoCombo,
  type ChocoComboSel,
} from './combo'

// 第40弾の不変条件:
// A. 渋味ゲージの段階5（とても強い）への正規到達: 閾値・段階表は一切
//    変更せず、データ側の裏付けを文献で厚くした。
//    - ダーク文脈: flavan-3-ols（群）を epicatechin / catechin /
//      procyanidins の個別分子に分割し、cacao-flavonol-glycosides を追加
//      （Stark et al. 2006 の除去実験、Ullrich et al. 2022 の DoT、
//      Kauz et al. 2021 の定量、Hofmann et al. 2006 の機構補強）。
//      support 4 → 12。
//    - 紅茶: coumaroylquinic-acids を追加（Wen et al. 2022、祁門紅茶で
//      閾値超えの含有量）。support 11 → 14。強さは普通のまま段階4。
// B. 味カバレッジの全数点検で文献検証のうえ追加した味:
//    白茶の甘味（Zheng et al. 2025）、紅茶の甘味・酸味（Zhang et al. 2022）、
//    黒茶の甘味（Wang et al. 2025、熟茶の実測）、烏龍茶の甘味
//    （Wang et al. 2022、甘い後味）、ファインフレーバーの酸味と
//    ミルクチョコレートの酸味（Afoakwa et al. 2008 の総説レベルの
//    一般的知見として弱く）。
// C. 波及: 甘味が入ったお茶では相互作用「甘味が渋味を和らげる」が
//    ペアリングで発火するようになり、白茶・黒茶 × ダークの段階は
//    5 → 4 に下がった（エンジンの既定の帰結）。甘味の無い黄茶・玉露・
//    ほうじ茶 × ダークは段階5のまま。

type Ctx = Parameters<typeof buildAstringency>[1]

const itemAstringency = (side: 'tea' | 'chocolate', id: string) => {
  const item = side === 'tea'
    ? teaItems.find((t) => t.id === id)!
    : chocolateItems.find((c) => c.id === id)!
  const tastes = comboTastesFromProfile(item.profile)
  const ctx = side === 'tea'
    ? { side: 'tea', kindId: (item as (typeof teaItems)[number]).kindId, itemName: item.name, itemId: item.id } as Ctx
    : { side: 'chocolate', kindId: (item as (typeof chocolateItems)[number]).kind, itemName: item.name, itemId: item.id } as Ctx
  return buildAstringency(tastes, ctx)
}

const tasteOf = (profile: (typeof teaItems)[number]['profile'], key: string) =>
  profile.tastes[key as keyof typeof profile.tastes]

describe('第40弾A: 段階5への正規到達（裏付けの拡充）', () => {
  it('ダーク（焙煎）とカカオ分100%は support 12 で段階5（とても強い）', () => {
    for (const id of ['dark-roasted', 'dark-100']) {
      const a = itemAstringency('chocolate', id)
      expect(a?.taste.intensity).toBe('strong')
      expect(a?.support).toBe(12)
      expect(a?.stage).toBe(5)
    }
  })

  it('未焙煎・ファインフレーバーは support 12 でも強さ普通のため段階4', () => {
    for (const id of ['dark-unroasted', 'fine-flavor-chocolate']) {
      const a = itemAstringency('chocolate', id)
      expect(a?.taste.intensity).toBe('normal')
      expect(a?.support).toBe(12)
      expect(a?.stage).toBe(4)
    }
  })

  it('紅茶は support 14（クマロイルキナ酸の追加）でも強さ普通のため段階4', () => {
    const a = itemAstringency('tea', 'black-tea')
    expect(a?.taste.intensity).toBe('normal')
    expect(a?.support).toBe(14)
    expect(a?.stage).toBe(4)
  })

  it('チョコの組み合わせではダーク系66件が段階5になる', () => {
    const sels: ChocoComboSel[] = []
    for (const kind of CHOCO_COMBO_KINDS) {
      const originIds = ['', ...chocoOriginOptions({ kind, originId: '', lineage: null }).map((o) => o.id)]
      for (const originId of originIds) {
        for (const l of chocoLineageOptions({ kind, originId, lineage: null })) {
          sels.push({ kind, originId, lineage: { layer: l.layer, id: l.id } })
        }
      }
    }
    let stage5 = 0
    for (const sel of sels) {
      const a = analyzeChocoCombo(sel)
      if (buildAstringency(a.tastes, a.context)?.stage === 5) stage5++
    }
    expect(stage5).toBe(66)
  })

  it('ペアリングの段階5は、甘味の無い弱いお茶 × ダーク（焙煎）・100% の6件', () => {
    // 白茶・黒茶は第40弾で甘味が入ったため「甘味が渋味を和らげる」が発火し
    // 段階4に下がった。残るのは黄茶・玉露・ほうじ茶（甘味の記録なし）× 2件。
    const darks = ['dark-roasted', 'dark-100'].map((id) => chocolateById(id)!)
    let stage5 = 0
    for (const t of teaItems) {
      for (const c of darks) {
        const p = assemblePairing(t, c, null, null)
        if (buildAstringency(p.wheel.tastes, p.wheel.contexts)?.stage === 5) stage5++
      }
    }
    expect(stage5).toBe(6)
    const whitePair = assemblePairing(teaById('white-tea')!, darks[0], null, null)
    expect(buildAstringency(whitePair.wheel.tastes, whitePair.wheel.contexts)?.stage).toBe(4)
    const yellowPair = assemblePairing(teaById('yellow-tea')!, darks[0], null, null)
    expect(buildAstringency(yellowPair.wheel.tastes, yellowPair.wheel.contexts)?.stage).toBe(5)
  })
})

describe('第40弾B: 全数点検で追加した味の記録', () => {
  it('白茶の甘味は通常・官能根拠（Zheng et al. 2025）', () => {
    const s = tasteOf(teaById('white-tea')!.profile, 'sweet')
    expect(s?.intensity).toBe('normal')
    expect(s?.basis).toBe('sensory')
    expect(s?.sourceIds).toContain('zheng-2025-baimudan-white-tea')
  })

  it('紅茶の甘味は通常・酸味は弱い、ともに官能根拠（Zhang et al. 2022）', () => {
    const sweet = tasteOf(teaById('black-tea')!.profile, 'sweet')
    expect(sweet?.intensity).toBe('normal')
    expect(sweet?.basis).toBe('sensory')
    expect(sweet?.sourceIds).toContain('zhang-2022-black-green-tea-sour')
    const sour = tasteOf(teaById('black-tea')!.profile, 'sour')
    expect(sour?.intensity).toBe('weak')
    expect(sour?.basis).toBe('sensory')
    expect(sour?.sourceIds).toContain('zhang-2022-black-green-tea-sour')
  })

  it('黒茶の甘味は通常・官能根拠（Wang et al. 2025、熟茶の実測）', () => {
    const s = tasteOf(teaById('dark-tea')!.profile, 'sweet')
    expect(s?.intensity).toBe('normal')
    expect(s?.basis).toBe('sensory')
    expect(s?.sourceIds).toContain('wang-2025-ancient-ripe-puerh')
  })

  it('烏龍茶と鳳凰単叢の甘味は弱い・官能根拠（Wang et al. 2022、甘い後味）', () => {
    for (const id of ['oolong-tea', 'fenghuang-dancong']) {
      const s = tasteOf(teaById(id)!.profile, 'sweet')
      expect(s?.intensity).toBe('weak')
      expect(s?.basis).toBe('sensory')
      expect(s?.sourceIds).toContain('wang-2022-oolong-qda-wheel')
    }
  })

  it('ファインフレーバーとミルクチョコレートの酸味は弱い・一般的知見（Afoakwa et al. 2008）', () => {
    for (const id of ['fine-flavor-chocolate', 'milk-chocolate']) {
      const s = tasteOf(chocolateById(id)!.profile, 'sour')
      expect(s?.intensity).toBe('weak')
      expect(s?.basis).toBe('general')
      expect(s?.sourceIds).toContain('afoakwa-2008-cocoa-flavour-review')
    }
  })

  it('全数点検の新規出典4件が検証済みで登録されている', () => {
    for (const id of [
      'zheng-2025-baimudan-white-tea',
      'zhang-2022-black-green-tea-sour',
      'wang-2025-ancient-ripe-puerh',
      'wang-2022-oolong-qda-wheel',
    ]) {
      const src = sources.find((s) => s.id === id)
      expect(src, id).toBeDefined()
      expect(src?.verified).toBe(true)
    }
  })

  it('記録なしが妥当と判断した味は不明のまま（緑茶の酸味・ホワイトの苦味など）', () => {
    // 緑茶の酸味: Zhang et al. 2022 で 0.33（ほぼ存在しない）が実測された
    // 証拠のある negative。ホワイトはカカオ固形分を含まず寄与成分が無い。
    // ルビーの渋味は組成検出のみで寄与の実証がないため収録しない。
    expect(tasteOf(teaById('sencha')!.profile, 'sour')?.intensity).toBe('unknown')
    expect(tasteOf(chocolateById('white-chocolate')!.profile, 'bitter')?.intensity).toBe('unknown')
    expect(tasteOf(chocolateById('ruby-chocolate')!.profile, 'astringent')?.intensity).toBe('unknown')
  })
})
