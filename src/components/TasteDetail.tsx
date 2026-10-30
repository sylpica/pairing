import type { Compound, FlavorProfile, TasteKey } from '../types'
import { INT_LABEL } from './FlavorWheel'
import { BASIS_LABEL, SourceLinks } from './SourceLinks'
import CompoundCard from './CompoundCard'
import { kindLabel, tierHeading } from './NoteDetail'
import { TASTE_LABELS } from '../engine/pairing'
import { compoundsForTaste, compoundTier, type CompoundContext } from '../data/compounds'

/**
 * 味覚項目（甘味・酸味・苦味・渋味・うま味）から関連する呈味成分を表示する。
 * 渋味は基本味ではなく収れん感（触覚）であることを、科学的な注記と出典で区別する。
 * チョコレートの甘味は配合された糖によるもので、カカオ固有の成分としては登録しない。
 */
export default function TasteDetail({ taste, profile, context }: { taste: TasteKey; profile: FlavorProfile; context?: CompoundContext }) {
  const entry = profile.tastes[taste]
  const linked = compoundsForTaste(taste)
  const tiers: { tier: 1 | 2 | 3; items: Compound[] }[] = [1, 2, 3].map((tier) => ({
    tier: tier as 1 | 2 | 3,
    items: context ? linked.filter((c) => compoundTier(c, context) === tier) : tier === 2 ? linked : [],
  }))
  const hasTier1 = tiers[0].items.length > 0
  const isChocoSweet = context?.side === 'chocolate' && taste === 'sweet'
  return (
    <section className="note-detail" aria-live="polite">
      <h3>{TASTE_LABELS[taste]}{taste === 'astringent' ? '（感覚）' : ''}
        {entry.intensity !== 'unknown' && <span className="badge">{INT_LABEL[entry.intensity]}・{BASIS_LABEL[entry.basis]}</span>}
      </h3>
      {taste === 'astringent' && (
        <div className="unknown-box">
          <p><strong>渋味は基本味ではありません。</strong>甘味・苦味などの基本味が味蕾の受容体による化学感覚なのに対し、渋味は、ポリフェノールが唾液のタンパク質と結合して口の潤滑膜が失われ、摩擦が増えることで生じる「収れん感」（触覚）として整理されています。そのため渋味の成分は「味物質」ではなく、タンパク質と結合するポリフェノール等として示します。</p>
          <SourceLinks ids={['bajec-2008-astringency']} />
        </div>
      )}
      {isChocoSweet && (
        <div className="unknown-box">
          <p>チョコレートの甘味は、主として配合された糖によるもので、カカオ固有の成分の寄与ではありません。そのため「チョコレートの甘味成分」として登録している成分はありません（糖の量で甘味が変わり、苦味が抑えられることは配合実験で示されています）。</p>
          <SourceLinks ids={['guinard-1999-milk-chocolate-sugar-fat', 'luchian-2023-chocolate-profiles']} />
        </div>
      )}
      <h4>この味に関係する成分</h4>
      {linked.length === 0 && (
        <p className="note-small">この味に直接結びつく成分データは、検証済み文献の範囲では未収録です。架空の成分は表示しません。</p>
      )}
      {linked.length > 0 && context && !hasTier1 && !isChocoSweet && (
        <p className="note-small">「{context.itemName}」そのもの（個別の試料）での成分情報は未確認です。以下は、{kindLabel(context)}など、より広い範囲の研究例です。</p>
      )}
      {tiers.map(({ tier, items }) => items.length > 0 && (
        <div key={tier}>
          {context && <h5 className="tier-head">{tierHeading(tier, context)}</h5>}
          {items.map((c) => <CompoundCard key={c.id} compound={c} tasteFocus={taste} />)}
        </div>
      ))}
      {entry.sourceIds.length > 0 && (
        <div>
          <h4>このアイテムの{TASTE_LABELS[taste]}データの出典</h4>
          <SourceLinks ids={entry.sourceIds} />
        </div>
      )}
    </section>
  )
}
