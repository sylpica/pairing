import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { itemNameClass } from './itemName'

// 第41弾の不変条件（一覧カードのレイアウト統一）:
// A. 名称の文字数ラダーは s(≥8) / m(≥11) / l(≥14) / xl(≥17) / 2xl(≥20) で、
//    全名称がバッジブロックと同じ1行に収まるよう CSS と対で較正されている。
// B. 単一行ゾーン（≥375px）ではカードは折り返さず、バッジブロックは
//    47%を上限に縮んで名称に場所を譲る（flex: 0 1 47%）。第37弾の
//    「ブロックごと次の行へ回る」指定（沈み込みの原因）は残っていない。
// C. 積み重ねゾーン（≤374px）では全カード一律に、バッジブロックが
//    行全体（flex: 0 0 100%）へ回る設計済みの2段になる。名称の行高は
//    23px 固定で、フォントサイズ差でバッジの縦位置がずれない。
// 実測監査（Playwright、194カード×幅375/393/374/340/320/300/280）で
// 沈み込み・はみ出し・縦折れゼロを確認済み（docs/research/round41-checkpoint.md）。

describe('第41弾: 一覧カードの名称ラダー', () => {
  it('文字数クラスの境界が仕様どおり', () => {
    expect(itemNameClass('あ'.repeat(7))).toBe('item-name')
    expect(itemNameClass('あ'.repeat(8))).toBe('item-name name-len-s')
    expect(itemNameClass('あ'.repeat(10))).toBe('item-name name-len-s')
    expect(itemNameClass('あ'.repeat(11))).toBe('item-name name-len-m')
    expect(itemNameClass('あ'.repeat(13))).toBe('item-name name-len-m')
    expect(itemNameClass('あ'.repeat(14))).toBe('item-name name-len-l')
    expect(itemNameClass('あ'.repeat(16))).toBe('item-name name-len-l')
    expect(itemNameClass('あ'.repeat(17))).toBe('item-name name-len-xl')
    expect(itemNameClass('あ'.repeat(19))).toBe('item-name name-len-xl')
    expect(itemNameClass('あ'.repeat(20))).toBe('item-name name-len-2xl')
    expect(itemNameClass('あ'.repeat(22))).toBe('item-name name-len-2xl')
  })

  it('実在の最長・境界名称が想定クラスになる', () => {
    expect(itemNameClass('ブロンドチョコレート（キャラメリゼホワイト）')).toBe('item-name name-len-2xl')
    expect(itemNameClass('金萱（台茶12号）')).toBe('item-name name-len-s')
    expect(itemNameClass('鳳凰単叢（烏龍茶）')).toBe('item-name name-len-s')
    expect(itemNameClass('ダージリン アッサム交雑系統')).toBe('item-name name-len-l')
  })
})

describe('第41弾: 一覧カードの CSS 構造', () => {
  const css = readFileSync('src/App.css', 'utf-8')

  it('バッジブロックは 47% を上限に縮む（沈み込みの回り込み指定は無い）', () => {
    expect(css).toMatch(/\.card-badges\s*\{[^}]*flex:\s*0 1 47%/)
    expect(css).not.toContain('.item-card { justify-content: flex-start; flex-wrap: wrap; }')
    expect(css).not.toMatch(/\.card-badges\s*\{[^}]*flex:\s*none/)
  })

  it('積み重ねゾーン（≤374px）で全カード一律の2段になる', () => {
    expect(css).toMatch(/@media \(max-width: 374px\) \{\s*\/\*[^*]*\*\/\s*\.item-card \{ flex-wrap: wrap; \}/)
    expect(css).toMatch(/\.card-badges \{ flex: 0 0 100%; width: 100%; margin-left: 0; \}/)
  })

  it('名称ラダーの全クラスが CSS に存在し、積み重ねゾーンの行高は固定', () => {
    for (const cls of ['name-len-s', 'name-len-m', 'name-len-l', 'name-len-xl', 'name-len-2xl']) {
      expect(css).toContain(`.item-name.${cls}`)
    }
    expect(css).toMatch(/@media \(max-width: 374px\) \{ \.item-name \{ font-size: 0\.88rem; line-height: 23px; \}/)
  })
})
