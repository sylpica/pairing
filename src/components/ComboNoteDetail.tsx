import type { ComboNote, Compound } from '../types'
import { COMBO_BASIS_FROM_LABEL, COMBO_LEVEL_LABEL } from '../engine/combo'
import { COMBO_INT_LABEL } from './wheelText'
import { SourceLinks } from './SourceLinks'
import CompoundCard from './CompoundCard'
import { noteById } from '../data/flavors'
import { compoundsForNote, compoundTier, compoundById, type CompoundContext } from '../data/compounds'
import { inferencesFor } from '../data/inferences'
import { tierHeading } from './NoteDetail'

/**
 * 組み合わせ系ホイール（組み合わせページ／品種・系統ページ／調べる画面のプレビュー）で
 * 香味ノートを選んだときの詳細。シート（CollapsibleSheet）の中身として使う。
 * 内容は3層に分ける:
 * 1. 根拠の内訳：由来層（分類プロファイル／品種・産地・系統の所見／製法の科学）ごとの
 *    文と出典、根拠レベル。
 * 2. 関係する成分：ノートに紐づく化合物を tier（この分類・種類での研究例／食品全般／
 *    その他）別に CompoundCard で表示（検出と寄与は CompoundCard 内で分離表示）。
 *    裏付けのないノートには成分を付けない（捏造しない）。
 * 3. 推測：土台アイテムに紐づく花・果物の具体名の推測（推測（未検証）を明示）。
 */
export default function ComboNoteDetail({ note, context }: { note: ComboNote; context?: CompoundContext }) {
  const def = noteById(note.noteId)
  const linked = compoundsForNote(note.noteId)
  const tiers: { tier: 1 | 2 | 3; items: Compound[] }[] = [1, 2, 3].map((tier) => ({
    tier: tier as 1 | 2 | 3,
    items: context ? linked.filter((c) => compoundTier(c, context) === tier) : tier === 2 ? linked : [],
  }))
  const hasTier1 = tiers[0].items.length > 0
  const inferences = context?.itemId ? inferencesFor(context.side, context.itemId, note.noteId) : []
  return (
    <section className="note-detail" aria-live="polite">
      <h3>{def?.name ?? note.noteId} <span className="badge">{COMBO_INT_LABEL[note.intensity]}・{COMBO_LEVEL_LABEL[note.level]}</span></h3>
      {def && <p>{def.example}</p>}
      <h4>この香りの根拠</h4>
      {note.basis.map((b, i) => (
        <div key={i}>
          <p><span className="badge">{COMBO_BASIS_FROM_LABEL[b.from]}</span></p>
          <p>{b.text}</p>
          <SourceLinks ids={b.sourceIds} />
        </div>
      ))}
      <h4>この香りに関係する成分</h4>
      {linked.length === 0 && (
        <p className="note-small">この香味に直接結びつく成分データは、検証済み文献の範囲では未収録です（香りの根拠は上の内訳のとおりです）。架空の成分は表示しません。</p>
      )}
      {linked.length > 0 && context && !hasTier1 && (
        <p className="note-small">「{context.itemName}」そのもの（個別の試料）での成分情報は未確認です。以下は、より広い範囲の研究例です。一般的な知見を、この組み合わせでの実測のように表示することはしません。</p>
      )}
      {tiers.map(({ tier, items }) => items.length > 0 && (
        <div key={tier}>
          {context && <h5 className="tier-head">{tierHeading(tier, context)}</h5>}
          {items.map((c) => <CompoundCard key={c.id} compound={c} />)}
        </div>
      ))}
      {inferences.length > 0 && (
        <div className="inference-box">
          <h4>科学的な推測 <span className="badge badge-inferred">推測（未検証）</span></h4>
          <p className="note-small">「{def?.name ?? note.noteId}」という漠然とした香りについて、土台のアイテム（またはその茶類・種類）で確認されている成分の顔ぶれから、具体的な花・果物への類似を推測したものです。実測でその花・果物と確認されたものではありません。</p>
          {inferences.map((inf) => (
            <div key={inf.label} className="inference-item">
              <p><strong>{inf.label}</strong> <span className="badge badge-inferred">推測（未検証）</span></p>
              <p>{inf.rationale}</p>
              <p className="note-small">根拠成分：{inf.basisCompoundIds.map((id) => compoundById(id)?.name ?? id).join('、')}{inf.basisGrading === 'reference-assisted' && '／具体名の香り記述には参考情報（記事・データベース等）を含みます'}</p>
            </div>
          ))}
        </div>
      )}
      <SourceLinks ids={note.sourceIds} />
    </section>
  )
}
