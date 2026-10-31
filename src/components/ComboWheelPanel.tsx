import type { ReactNode } from 'react'
import type { ComboNote, ComboTaste } from '../types'
import type { CompoundContext } from '../data/compounds'
import TieredWheelPanel from './TieredWheelPanel'
import ComboNoteDetail from './ComboNoteDetail'
import ComboTasteDetail from './ComboTasteDetail'

/**
 * 組み合わせ系ホイールのパネル（第8弾で3階層化）。
 * 香り／味の切り替えと階層ナビゲーションは TieredWheelPanel が担い、
 * ここでは組み合わせ系の詳細（根拠の内訳＝ComboNoteDetail、
 * 味の根拠＝ComboTasteDetail）を差し込む。
 * 3階層ホイールのある全画面（組み合わせページ／調べるプレビュー／
 * 品種・系統ページ／組み合わせるのタブ）で共通に使う。
 */
export default function ComboWheelPanel({ notes, tastes, context, resetKey, legendExtra }: {
  notes: ComboNote[]
  tastes: ComboTaste[]
  context?: CompoundContext
  /** 組み合わせが変わったら選択とモードを戻すためのキー */
  resetKey?: string
  /** 第19弾：根拠・状態系の注意書きを凡例ボックス内に集約するための差し込み口 */
  legendExtra?: ReactNode
}) {
  return (
    <TieredWheelPanel
      notes={notes}
      tastes={tastes}
      context={context}
      resetKey={resetKey}
      legendExtra={legendExtra}
      ariaLabel="組み合わせのフレーバーホイール（推測を含む）"
      renderNoteDetail={(note) => <ComboNoteDetail note={note} context={context} />}
      renderTasteDetail={(taste) => <ComboTasteDetail taste={taste} />}
    />
  )
}
