import { Fragment } from 'react'
import { itemNameSegments } from './itemName'

/**
 * 一覧カードの名称（第42弾）。全カード共通の文字サイズ（CSS で統一）で
 * 表示し、折り返しが必要な場合は意味の切れ目でのみ改行する。
 * セグメント（.name-seg）は改行不可の単位で、切れ目には <wbr> または
 * スペースだけが入り、単語の途中で割れることはない。1行に収まる場合は
 * 従来どおり1行で表示される（<wbr> は幅ゼロ）。
 */
export default function ItemName({ name }: { name: string }) {
  const segs = itemNameSegments(name)
  return (
    <span className="item-name">
      {segs.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && (s.breakBefore === 'space' ? ' ' : <wbr />)}
          <span className="name-seg">{s.text}</span>
        </Fragment>
      ))}
    </span>
  )
}
