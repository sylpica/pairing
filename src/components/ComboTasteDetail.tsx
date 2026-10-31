import type { ComboTaste } from '../types'
import { COMBO_LEVEL_LABEL, COMBO_TASTE_LABEL } from '../engine/combo'
import { COMBO_INT_LABEL } from './ComboWheel'
import { SourceLinks } from './SourceLinks'

/**
 * 味モードのホイールで味の次元を選んだときの詳細（シートの中身）。
 * ComboAnalysis.tastes の各項目が持つ説明文（土台プロファイルの根拠、
 * または製法ルール・軸効果による変換の説明）と出典を示す。
 * 説明文が無い項目（アイテムの実測プロファイル由来）では、強さと
 * 根拠レベルと出典だけを示し、根拠のない説明は作らない。
 */
export default function ComboTasteDetail({ taste }: { taste: ComboTaste }) {
  const label = taste.key === 'astringent' ? '渋味（収れん感）' : COMBO_TASTE_LABEL[taste.key]
  return (
    <section className="note-detail" aria-live="polite">
      <h3>{label} <span className="badge">{COMBO_INT_LABEL[taste.intensity]}・{COMBO_LEVEL_LABEL[taste.level]}</span></h3>
      {taste.key === 'astringent' && <p className="note-small">渋味は基本味ではなく、タンニン等による口の中の収れん感です。</p>}
      {taste.text
        ? <p>{taste.text}</p>
        : <p className="note-small">この味は土台アイテムの味覚プロファイルに記録されたものです。強さと根拠はプロファイルの記録に基づきます。</p>}
      <SourceLinks ids={taste.sourceIds} />
    </section>
  )
}
