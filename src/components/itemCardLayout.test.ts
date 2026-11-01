import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { itemNameSegments } from './itemName'

// 第42弾の不変条件（一覧カードの名称の文字サイズ統一）:
// A. 名称の文字サイズは全カード共通の単一値（CSS で .item-name に
//    0.92rem=14.72px を単一指定。第41弾までの文字数ラダーは廃止し、
//    CSS にも名称側のソースにも name-len-* は存在しない）。基準値は
//    お茶の品種・系統リストで短い名称（やぶきた等）に当たっていた
//    computed font-size の実測値。
// B. 統一サイズで1行に収まらない名称は折り返してよいが、改行は意味の
//    切れ目でのみ起きる。itemNameSegments が名称を改行不可の単位に分け、
//    切れ目は スペース／「（」の前／「・」の後／「）」の後（と明示ヒント）
//    だけ。セグメントを切れ目どおりに繋げば元の名称文字列と一致する。
// C. 第41弾の配置契約は維持する: 単一行ゾーン（≥375px）ではバッジ
//    ブロックは 47% を上限に縮んで名称に場所を譲り（flex: 0 1 47%）、
//    積み重ねゾーン（≤374px）では全カード一律の2段になる。
// 実測監査（Playwright、194カード×幅375/320/300/280）で全名称の
// computed font-size が基準値と完全一致すること、はみ出し・沈み込み
// ゼロ、全折り返し名称の改行位置を確認済み
// （docs/research/round42-checkpoint.md）。

const joinSegments = (name: string): string =>
  itemNameSegments(name)
    .map((s, i) => (i > 0 && s.breakBefore === 'space' ? ' ' : '') + s.text)
    .join('')

describe('第42弾: 名称の改行位置（意味の切れ目）', () => {
  it('スペースの位置で分かれる（ユーザーの例: ダージリン チャイナ種系統）', () => {
    expect(itemNameSegments('ダージリン チャイナ種系統')).toEqual([
      { text: 'ダージリン', breakBefore: 'start' },
      { text: 'チャイナ種系統', breakBefore: 'space' },
    ])
    expect(itemNameSegments('ダージリン アッサム交雑系統').map((s) => s.text)).toEqual(['ダージリン', 'アッサム交雑系統'])
  })

  it('括弧の前で分かれ、括弧内はひとかたまりになる', () => {
    expect(itemNameSegments('クリオロ（Criollo）')).toEqual([
      { text: 'クリオロ', breakBefore: 'start' },
      { text: '（Criollo）', breakBefore: 'wbr' },
    ])
    expect(itemNameSegments('金萱（台茶12号）').map((s) => s.text)).toEqual(['金萱', '（台茶12号）'])
    expect(itemNameSegments('ブロンドチョコレート（キャラメリゼホワイト）').map((s) => s.text)).toEqual([
      'ブロンドチョコレート',
      '（キャラメリゼホワイト）',
    ])
  })

  it('「・」の直後でも分かれる（「・」は前の単位の末尾に残る）', () => {
    expect(itemNameSegments('ダークチョコレート（未焙煎・ミニマル）')).toEqual([
      { text: 'ダークチョコレート', breakBefore: 'start' },
      { text: '（未焙煎・', breakBefore: 'wbr' },
      { text: 'ミニマル）', breakBefore: 'wbr' },
    ])
  })

  it('切れ目のない長名称は明示ヒントで意味の境目に分かれる', () => {
    expect(itemNameSegments('ファインフレーバーカカオのチョコレート').map((s) => s.text)).toEqual([
      'ファインフレーバー',
      'カカオのチョコレート',
    ])
    expect(itemNameSegments('カカオ分100%チョコレート（無糖）').map((s) => s.text)).toEqual([
      'カカオ分100%',
      'チョコレート',
      '（無糖）',
    ])
  })

  it('短い名称は分割されない', () => {
    expect(itemNameSegments('やぶきた')).toEqual([{ text: 'やぶきた', breakBefore: 'start' }])
    expect(itemNameSegments('Criollo')).toEqual([{ text: 'Criollo', breakBefore: 'start' }])
  })

  it('セグメントを繋げると元の名称文字列と一致する（名称は改変しない）', () => {
    for (const name of [
      'ダージリン チャイナ種系統',
      'クリオロ（Criollo）',
      'ダークチョコレート（未焙煎・ミニマル）',
      'ファインフレーバーカカオのチョコレート',
      'ブロンドチョコレート（キャラメリゼホワイト）',
      'カカオ分100%チョコレート（無糖）',
      'やぶきた',
    ]) {
      expect(joinSegments(name)).toBe(name)
    }
  })
})

describe('第42弾: 名称サイズ統一の CSS 構造', () => {
  const css = readFileSync('src/App.css', 'utf-8')
  const nameSrc = readFileSync('src/components/itemName.ts', 'utf-8')

  it('文字数ラダーは廃止されている（CSS・名称ソースのどこにも無い）', () => {
    expect(css).not.toContain('name-len')
    expect(nameSrc).not.toContain('name-len')
    expect(nameSrc).not.toContain('itemNameClass')
  })

  it('名称サイズは 0.92rem の単一指定で、名称側は折り返し可能に縮む', () => {
    expect(css).toMatch(/\.item-name \{ font-weight: 700; font-size: 0\.92rem; flex: 0 1 auto; min-width: 0; \}/)
    // 名称に当たる font-size 指定はこの1箇所だけ（メディアクエリでの上書きなし）
    expect(css.match(/\.item-name[^{]*\{[^}]*font-size/g)).toHaveLength(1)
  })

  it('セグメントは改行不可の単位（単語の途中で割れない）', () => {
    expect(css).toMatch(/\.item-name \.name-seg \{ white-space: nowrap; \}/)
  })

  it('第41弾の配置契約（バッジブロック 47% 上限・積み重ねゾーン）は維持', () => {
    expect(css).toMatch(/\.card-badges\s*\{[^}]*flex:\s*0 1 47%/)
    expect(css).not.toMatch(/\.card-badges\s*\{[^}]*flex:\s*none/)
    expect(css).toMatch(/@media \(max-width: 374px\) \{\s*\/\*[^*]*\*\/\s*\.item-card \{ flex-wrap: wrap; \}/)
    expect(css).toMatch(/\.card-badges \{ flex: 0 0 100%; width: 100%; margin-left: 0; \}/)
  })

  it('積み重ねゾーンでは名称が必ずアイコンと同じ1行目に残る（名称だけ落ちない）', () => {
    expect(css).toMatch(/\.item-card \{ flex-wrap: wrap; \}\s*\.item-name \{ flex: 1 1 0; \}/)
  })
})
