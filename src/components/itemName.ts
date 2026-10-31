/**
 * 一覧カードの名称の段階クラス（第37弾 F監査）。
 * 名称は1行・全文表示（省略しない）が統一契約。狭幅では長い名称ほど
 * フォントを段階的に縮小して1行に収めるため、実文字数に応じた
 * 修飾クラスを返す（CSS 側のメディアクエリと対で使う）。
 */
export const itemNameClass = (name: string): string => {
  const len = [...name].length
  if (len >= 20) return 'item-name name-len-2xl'
  if (len >= 17) return 'item-name name-len-xl'
  return 'item-name'
}
