import type { Compound, FlavorProfile } from '../types'
import { INT_LABEL } from './FlavorWheel'
import { BASIS_LABEL, SourceLinks } from './SourceLinks'
import CompoundCard from './CompoundCard'
import { noteById } from '../data/flavors'
import { compoundsForNote, compoundTier, type CompoundContext } from '../data/compounds'
import { teaItems, teaKinds } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import { go } from '../nav'

const CHOCO_KIND_LABEL: Record<string, string> = { dark: 'ダークチョコレート', milk: 'ミルクチョコレート', white: 'ホワイトチョコレート' }

export function kindLabel(ctx: CompoundContext): string {
  return ctx.side === 'tea' ? (teaKinds.find((k) => k.id === ctx.kindId)?.name ?? ctx.kindId) : (CHOCO_KIND_LABEL[ctx.kindId] ?? ctx.kindId)
}

/** 階層見出し: 1=この茶類・種類での研究例 / 2=食品全般の研究例 / 3=他の食品・茶類での研究例 */
export function tierHeading(tier: 1 | 2 | 3, ctx?: CompoundContext): string {
  if (!ctx) return tier === 1 ? '研究例' : tier === 2 ? '研究例' : '研究例'
  const kn = kindLabel(ctx)
  if (tier === 1) return ctx.side === 'tea' ? `${kn}の試料での研究例` : `${kn}の試料での研究例`
  if (tier === 2) return ctx.side === 'tea' ? 'お茶全般の研究例' : 'チョコレート・原料カカオでの研究例'
  return '他のお茶・チョコレートでの研究例'
}

export default function NoteDetail({ noteId, profile, context }: { noteId: string; profile: FlavorProfile; context?: CompoundContext }) {
  const note = noteById(noteId)
  const entry = profile.aromas.find((a) => a.noteId === noteId)
  if (!note || !entry) return null
  const linked = compoundsForNote(noteId)
  const tiers: { tier: 1 | 2 | 3; items: Compound[] }[] = [1, 2, 3].map((tier) => ({
    tier: tier as 1 | 2 | 3,
    items: context ? linked.filter((c) => compoundTier(c, context) === tier) : tier === 2 ? linked : [],
  }))
  const hasTier1 = tiers[0].items.length > 0
  const others = [
    ...teaItems.filter((t) => t.profile !== profile && t.profile.aromas.some((a) => a.noteId === noteId)).map((t) => ({ name: t.name, path: `tea/${t.id}`, intensity: t.profile.aromas.find((a) => a.noteId === noteId)!.intensity })),
    ...chocolateItems.filter((c) => c.profile !== profile && c.profile.aromas.some((a) => a.noteId === noteId)).map((c) => ({ name: c.name, path: `choco/${c.id}`, intensity: c.profile.aromas.find((a) => a.noteId === noteId)!.intensity })),
  ]
  return (
    <section className="note-detail" aria-live="polite">
      <h3>{note.name} <span className="badge">{INT_LABEL[entry.intensity]}・{BASIS_LABEL[entry.basis]}</span></h3>
      <p>{note.example}</p>
      <h4>この香りに関係する成分</h4>
      {linked.length === 0 && (
        <p className="note-small">この香味に直接結びつく成分データは、検証済み文献の範囲では未収録です（香りの存在自体は下記の出典に基づきます）。架空の成分は表示しません。</p>
      )}
      {linked.length > 0 && context && !hasTier1 && (
        <p className="note-small">「{context.itemName}」そのもの（個別の試料）での成分情報は未確認です。以下は、{kindLabel(context)}など、より広い範囲の研究例です。一般的な知見を、このアイテムでの実測のように表示することはしません。</p>
      )}
      {tiers.map(({ tier, items }) => items.length > 0 && (
        <div key={tier}>
          {context && <h5 className="tier-head">{tierHeading(tier, context)}</h5>}
          {items.map((c) => <CompoundCard key={c.id} compound={c} />)}
        </div>
      ))}
      <SourceLinks ids={entry.sourceIds} />
      {others.length > 0 && (
        <div>
          <h4>この香りがある他のアイテム</h4>
          <div className="filter-row">
            {others.slice(0, 8).map((o) => <button key={o.path} className="chip" onClick={() => go(o.path)}>{o.name}（{INT_LABEL[o.intensity]}）</button>)}
          </div>
        </div>
      )}
    </section>
  )
}
