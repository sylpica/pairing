/**
 * 一覧カードの名称の段階クラス（第37弾 F監査。第41弾で拡張）。
 * 名称は1行・全文表示（省略しない）が統一契約。狭幅では長い名称ほど
 * フォントを段階的に縮小して、右のバッジブロックと常に同じ1行に
 * 収めるため、実文字数に応じた修飾クラスを返す（CSS 側の
 * メディアクエリと対で使う）。
 * 第41弾: 第37弾の2段階（xl/2xl）では中間の長さ（8〜16字）の名称が
 * バッジブロックを2行目へ押し出して沈ませていたため、s/m/l を追加し、
 * 全名称×最長バッジピルの実測からクラスごとに較正した。
 */
export const itemNameClass = (name: string): string => {
  const len = [...name].length
  if (len >= 20) return 'item-name name-len-2xl'
  if (len >= 17) return 'item-name name-len-xl'
  if (len >= 14) return 'item-name name-len-l'
  if (len >= 11) return 'item-name name-len-m'
  if (len >= 8) return 'item-name name-len-s'
  return 'item-name'
}
