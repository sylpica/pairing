import type { FlavorProfile } from '../types'
import { INT_LABEL } from './FlavorWheel'
import { BASIS_LABEL, SourceLinks } from './SourceLinks'
import { noteById } from '../data/flavors'
import { compounds } from '../data/compounds'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import { go } from '../nav'

export default function NoteDetail({ noteId, profile }: { noteId: string; profile: FlavorProfile }) {
  const note = noteById(noteId)
  const entry = profile.aromas.find((a) => a.noteId === noteId)
  if (!note || !entry) return null
  const linked = compounds.filter((c) => c.noteIds.includes(noteId))
  const others = [
    ...teaItems.filter((t) => t.profile.aromas.some((a) => a.noteId === noteId)).map((t) => ({ name: t.name, path: `tea/${t.id}`, intensity: t.profile.aromas.find((a) => a.noteId === noteId)!.intensity })),
    ...chocolateItems.filter((c) => c.profile.aromas.some((a) => a.noteId === noteId)).map((c) => ({ name: c.name, path: `choco/${c.id}`, intensity: c.profile.aromas.find((a) => a.noteId === noteId)!.intensity })),
  ]
  return (
    <section className="note-detail" aria-live="polite">
      <h3>{note.name} <span className="badge">{INT_LABEL[entry.intensity]}・{BASIS_LABEL[entry.basis]}</span></h3>
      <p>{note.example}</p>
      <h4>この香りに寄与する成分</h4>
      {linked.length > 0 ? linked.map((c) => (
        <details key={c.id} className="compound" open>
          <summary>{c.name}（{c.aliases[0] ?? ''}）</summary>
          <p><strong>寄与する香り：</strong>{c.aromaKnowledge}</p>
          <p>{c.plainDescription}</p>
          <dl>
            <dt>検出の事実</dt><dd>{c.detectedIn}</dd>
            <dt>寄与の根拠</dt><dd>{c.contributionEvidence}</dd>
          </dl>
          <SourceLinks ids={c.sourceIds} />
        </details>
      )) : <p className="note-small">この香味に直接結びつく成分データは、検証済み文献の範囲では未収録です（香りの存在自体は右の出典に基づきます）。</p>}
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
