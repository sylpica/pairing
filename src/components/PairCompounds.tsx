import type { FlavorProfile } from '../types'
import CompoundCard from './CompoundCard'
import { SourceLinks } from './SourceLinks'
import { noteById, categoryById, flavorNotes } from '../data/flavors'
import { compoundsForNote, compoundTier } from '../data/compounds'

interface Ctx { teaKindId: string; chocoKindId: string }

/**
 * ペアリング結果の香味から関連成分を調べるパネル。
 * 「お茶側の研究例」「チョコ側の研究例」「両方で確認されている成分」を分けて示す。
 * 共通成分があること自体は相性の根拠ではない（Spence 2020）旨を明記する。
 */
export function PairNoteCompounds({ noteId, teaKindId, chocoKindId }: { noteId: string } & Ctx) {
  const note = noteById(noteId)
  const linked = compoundsForNote(noteId)
  const groups = { both: [] as typeof linked, tea: [] as typeof linked, choco: [] as typeof linked, other: [] as typeof linked }
  for (const c of linked) {
    const tt = compoundTier(c, { side: 'tea', kindId: teaKindId })
    const ct = compoundTier(c, { side: 'chocolate', kindId: chocoKindId })
    if (tt <= 2 && ct <= 2) groups.both.push(c)
    else if (tt <= 2) groups.tea.push(c)
    else if (ct <= 2) groups.choco.push(c)
    else groups.other.push(c)
  }
  return (
    <section className="note-detail" aria-live="polite">
      <h3>{note?.name ?? noteId}に関係する成分</h3>
      <p className="note-small">お茶側・チョコレート側それぞれの研究例を分けて示します。共通する成分があること自体は、相性が良いことの根拠にはなりません（共有香味分子によるペアリング予測は支持されていないとする批判的総説があります）。</p>
      <SourceLinks ids={['spence-2020-flavour-pairing']} />
      {linked.length === 0 && <p className="note-small">この香味に直接結びつく成分データは、検証済み文献の範囲では未収録です。架空の成分は表示しません。</p>}
      {groups.both.length > 0 && <>
        <h5 className="tier-head">お茶とチョコレートの両方で確認されている成分</h5>
        {groups.both.map((c) => <CompoundCard key={c.id} compound={c} />)}
      </>}
      {groups.tea.length > 0 && <>
        <h5 className="tier-head">お茶での研究例</h5>
        {groups.tea.map((c) => <CompoundCard key={c.id} compound={c} />)}
      </>}
      {groups.choco.length > 0 && <>
        <h5 className="tier-head">チョコレートでの研究例</h5>
        {groups.choco.map((c) => <CompoundCard key={c.id} compound={c} />)}
      </>}
      {groups.other.length > 0 && <>
        <h5 className="tier-head">その他の研究例（この組み合わせとは別の試料での知見）</h5>
        {groups.other.map((c) => <CompoundCard key={c.id} compound={c} />)}
      </>}
    </section>
  )
}

/**
 * 「同じ分類の香り」は、個別の香味ではなく分類レベルの類似にすぎない。
 * 分類に属し、どちらかのプロファイルに現れる香味を並べ、成分への導線だけを提供する。
 */
export function PairCategoryCompounds({ categoryId, tea, choco, onPickNote }: {
  categoryId: string
  tea: FlavorProfile
  choco: FlavorProfile
  onPickNote: (noteId: string) => void
}) {
  const cat = categoryById(categoryId)
  const inEither = flavorNotes.filter((n) => n.categoryId === categoryId &&
    (tea.aromas.some((a) => a.noteId === n.id) || choco.aromas.some((a) => a.noteId === n.id)))
  return (
    <section className="note-detail" aria-live="polite">
      <h3>{cat?.name ?? categoryId}（分類の類似）</h3>
      <p className="note-small">これは香味の「分類」が似ているだけの共通点で、同じ成分が両方で確認されているという意味ではありません。分類に属する個別の香味から、成分を確認できます。</p>
      {inEither.length === 0 && <p className="note-small">この分類で両方に現れる香味はありません。</p>}
      <div className="filter-row">
        {inEither.map((n) => (
          <button key={n.id} className="chip" onClick={() => onPickNote(n.id)}>
            {n.name}（成分{compoundsForNote(n.id).length}件）
          </button>
        ))}
      </div>
    </section>
  )
}
