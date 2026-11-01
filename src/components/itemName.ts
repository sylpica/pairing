/**
 * 一覧カードの名称の表示制御（第42弾で文字数ラダーを廃止）。
 *
 * 統一契約: 名称は左・全文表示（省略しない）、文字サイズは全カード共通
 * （CSS の .item-name で 0.92rem 単一指定。名称ごとの段階的縮小はしない）。
 * 統一サイズで1行に収まらない名称は折り返してよいが、改行は意味の
 * 切れ目でのみ許可する（単語の途中・不自然な位置で割らない）。
 *
 * そのため名称文字列を「改行不可の単位（セグメント）」に分け、切れ目に
 * だけ改行機会（<wbr> またはスペース）を差し込む形で表示する。名称の
 * 文字列そのものは改変しない（検索名や他画面の表示に波及させない）。
 * 切れ目の規則:
 * - スペース（半角・全角）の位置
 * - 開き括弧「（」の直前（括弧内はひとかたまりで次の行へ）
 * - 「・」の直後（「・」は行末に残す）
 * - 閉じ括弧「）」の直後（後続がある場合）
 * 上記の切れ目を持たない長名称は BREAK_HINTS に明示の分割を持つ。
 */
export interface ItemNameSegment {
  text: string
  /** このセグメントの前にある切れ目の種類（先頭は 'start'） */
  breakBefore: 'start' | 'space' | 'wbr'
}

/**
 * 汎用規則では切れ目が取れない長名称の明示分割（表示層のみの情報で、
 * 名称データ自体は変更しない）。
 * - ファインフレーバーカカオのチョコレート: 修飾部「ファインフレーバー」と
 *   本体「カカオのチョコレート」の境目。
 * - カカオ分100%チョコレート（無糖）: 割合表示「カカオ分100%」と本体
 *   「チョコレート」の境目（括弧の前は汎用規則でも分かれる）。
 */
const BREAK_HINTS: Record<string, string[]> = {
  'ファインフレーバーカカオのチョコレート': ['ファインフレーバー', 'カカオのチョコレート'],
  'カカオ分100%チョコレート（無糖）': ['カカオ分100%', 'チョコレート', '（無糖）'],
}

export const itemNameSegments = (name: string): ItemNameSegment[] => {
  const hint = BREAK_HINTS[name]
  if (hint) {
    return hint.map((text, i) => ({ text, breakBefore: i === 0 ? 'start' : 'wbr' }) as ItemNameSegment)
  }
  const segs: ItemNameSegment[] = []
  const chars = [...name]
  let cur = ''
  let curBreak: ItemNameSegment['breakBefore'] = 'start'
  const push = () => {
    if (cur) segs.push({ text: cur, breakBefore: curBreak })
    cur = ''
  }
  chars.forEach((ch, i) => {
    if (ch === ' ' || ch === '　') {
      push()
      curBreak = 'space'
      return
    }
    if (ch === '（' && cur) {
      push()
      curBreak = 'wbr'
    }
    cur += ch
    const next = chars[i + 1]
    if ((ch === '・' || ch === '）') && next !== undefined && next !== '）') {
      push()
      curBreak = 'wbr'
    }
  })
  push()
  return segs.length > 0 ? segs : [{ text: name, breakBefore: 'start' }]
}
