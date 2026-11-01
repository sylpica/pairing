import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { astringencyStageOf, buildAstringency } from './wheelTiers'
import { assemblePairing } from './pairingCombo'
import { comboTastesFromProfile } from '../components/TasteWheel'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'

// 第39弾の不変条件:
// A. 渋味ゲージの帯の再較正: 標準的な裏付け（support=4、単一文脈の
//    一般範囲の寄与化合物2件）は中心帯に置き、強さの自然な段階
//    （弱い2・普通3・強い4）に一致させる。裏付けが特に大きい場合
//    （support ≥ 11）だけ一段上げ、裏付けがほぼ無い場合（≤3）は
//    弱い・普通を一段下げる（強い の下限は4）。
// B. 強さの順序は段階でも逆転しない（全 support で 弱い≤普通≤強い）。
// C. 土台データの文献再検証: 抹茶の渋味は weak→normal（茶葉ごと摂取と
//    EGCG が被覆で減らないことの裏付け。unno-2026 / naro-2018）。
//    ダークチョコレート（焙煎）とカカオ分100%は strong のまま。
// D. ホーム画面の案内文（産地×品種×分類…）は削除済みで、フッターの
//    リンク一覧（組み合わせで調べる）は残っている。

type Ctx = Parameters<typeof buildAstringency>[1]

const itemStage = (side: 'tea' | 'chocolate', id: string) => {
  const item = side === 'tea'
    ? teaItems.find((t) => t.id === id)!
    : chocolateItems.find((c) => c.id === id)!
  const tastes = comboTastesFromProfile(item.profile)
  const ctx = side === 'tea'
    ? { side: 'tea', kindId: (item as (typeof teaItems)[number]).kindId, itemName: item.name, itemId: item.id } as Ctx
    : { side: 'chocolate', kindId: (item as (typeof chocolateItems)[number]).kind, itemName: item.name, itemId: item.id } as Ctx
  return buildAstringency(tastes, ctx)
}

describe('第39弾A: 帯の再較正（段階表のピン）', () => {
  it('標準的な裏付け（support=4）では強さの自然な段階になる', () => {
    expect(astringencyStageOf('weak', 4)).toBe(2)
    expect(astringencyStageOf('normal', 4)).toBe(3)
    expect(astringencyStageOf('strong', 4)).toBe(4)
  })

  it('帯の境界: 小=3以下 / 標準=4〜10 / 大=11以上', () => {
    expect(astringencyStageOf('weak', 3)).toBe(1)
    expect(astringencyStageOf('weak', 10)).toBe(2)
    expect(astringencyStageOf('weak', 11)).toBe(2)
    expect(astringencyStageOf('normal', 3)).toBe(2)
    expect(astringencyStageOf('normal', 10)).toBe(3)
    expect(astringencyStageOf('normal', 11)).toBe(4)
    expect(astringencyStageOf('strong', 3)).toBe(4)
    expect(astringencyStageOf('strong', 10)).toBe(4)
    expect(astringencyStageOf('strong', 11)).toBe(5)
  })
})

describe('第39弾B: 強さの順序は逆転しない', () => {
  it('全 support で 弱い ≤ 普通 ≤ 強い、かつ固定した強さでは単調', () => {
    for (let support = 0; support <= 30; support++) {
      const w = astringencyStageOf('weak', support)!
      const n = astringencyStageOf('normal', support)!
      const s = astringencyStageOf('strong', support)!
      expect(w).toBeLessThanOrEqual(n)
      expect(n).toBeLessThanOrEqual(s)
    }
    for (const intensity of ['weak', 'normal', 'strong'] as const) {
      let prev = 0
      for (let support = 0; support <= 30; support++) {
        const s = astringencyStageOf(intensity, support)!
        expect(s).toBeGreaterThanOrEqual(prev)
        prev = s
      }
    }
  })
})

describe('第39弾C: アイテム単体の段階（文献再検証と較正の結果）', () => {
  it('抹茶は普通（3）。ダークチョコレート（焙煎）とカカオ分100%は第40弾でとても強い（5）', () => {
    // 第40弾: ダーク文脈の渋味寄与化合物の裏付けを文献で拡充した
    // （フラバン-3-オールの個別分子への分割＋配糖体。support 4→12）ため、
    // 強さ「強い」の2アイテムは段階5（とても強い）に正規に到達した。
    // 閾値・段階表は変更していない。
    const matcha = itemStage('tea', 'matcha')
    expect(matcha?.taste.intensity).toBe('normal')
    expect(matcha?.stage).toBe(3)
    expect(itemStage('chocolate', 'dark-roasted')?.stage).toBe(5)
    expect(itemStage('chocolate', 'dark-100')?.stage).toBe(5)
  })

  it('紅茶は裏付けの大きさで強い（4）。煎茶は普通（3）。玉露・白茶は弱い（2）', () => {
    expect(itemStage('tea', 'black-tea')?.stage).toBe(4)
    expect(itemStage('tea', 'sencha')?.stage).toBe(3)
    expect(itemStage('tea', 'gyokuro')?.stage).toBe(2)
    expect(itemStage('tea', 'white-tea')?.stage).toBe(2)
  })

  it('アイテム単体の分布（第40弾時点）: 段階2が5件・3が8件・4が3件・5が2件、ゲージ無し4件', () => {
    // 第39弾時点は 2:5 / 3:10 / 4:3 / 5:0。第40弾でダーク（焙煎）と
    // カカオ分100%が段階5に上がり、未焙煎・ファインフレーバーが
    // 3→4に上がった（どちらも裏付け support の拡充による較正の帰結）。
    const counts = new Map<string, number>()
    const bump = (k: string) => counts.set(k, (counts.get(k) ?? 0) + 1)
    for (const t of teaItems) bump(String(itemStage('tea', t.id)?.stage ?? 'none'))
    for (const c of chocolateItems) bump(String(itemStage('chocolate', c.id)?.stage ?? 'none'))
    expect(counts.get('2')).toBe(5)
    expect(counts.get('3')).toBe(8)
    expect(counts.get('4')).toBe(3)
    expect(counts.get('5')).toBe(2)
    expect(counts.get('none')).toBe(4)
    expect(counts.get('1')).toBeUndefined()
  })

  it('ペアリング: 抹茶×ダーク（焙煎）は段階4、煎茶×ダーク（焙煎）も段階4、玉露×ダーク（焙煎）は段階5（第40弾）', () => {
    // 第39弾時点: 抹茶×ダーク・煎茶×ダークは段階3、玉露×ダークは段階4。
    // 第40弾でダーク側の裏付けが support 12 に増えたため、合成の裏付けは
    // 16（お茶側4＋ダーク側12）になり、段階がそれぞれ1段上がった。
    // 抹茶・煎茶は相互作用「渋味と脂肪の対向」（お茶側の渋味が普通以上のとき
    // 発火）で合成の強さが強い→普通へ下がるため、普通＋裏付け大で段階4。
    const dark = chocolateItems.find((c) => c.id === 'dark-roasted')!
    const matchaPair = assemblePairing(teaItems.find((t) => t.id === 'matcha')!, dark, null, null)
    expect(buildAstringency(matchaPair.wheel.tastes, matchaPair.wheel.contexts)?.stage).toBe(4)
    const senchaPair = assemblePairing(teaItems.find((t) => t.id === 'sencha')!, dark, null, null)
    expect(buildAstringency(senchaPair.wheel.tastes, senchaPair.wheel.contexts)?.stage).toBe(4)
    // 玉露（弱い）は脂肪の対向が発火しないため、ダーク側の強さが残り、
    // 裏付け16で段階5（とても強い）
    const gyokuroPair = assemblePairing(teaItems.find((t) => t.id === 'gyokuro')!, dark, null, null)
    expect(buildAstringency(gyokuroPair.wheel.tastes, gyokuroPair.wheel.contexts)?.stage).toBe(5)
  })
})

describe('第39弾D: ホーム画面の案内文は削除され、導線（フッターのリンク）は残る', () => {
  it('App.tsx に案内文が無く、組み合わせで調べるリンクが残っている', () => {
    const src = readFileSync('src/App.tsx', 'utf-8')
    expect(src).not.toContain('産地×品種×分類の具体的な組み合わせごとの味わいは')
    expect(src).not.toContain('長崎の紅茶のやぶきた と 長崎の緑茶のやぶきた の違い')
    expect(src).toContain('組み合わせで調べる（お茶）')
    expect(src).toContain('組み合わせで調べる（チョコ）')
  })
})
