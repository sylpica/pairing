import type { Compound, TasteKey } from '../types'
import { noteById } from '../data/flavors'
import { TASTE_LABELS } from '../engine/pairing'
import { SourceLinks } from './SourceLinks'

/**
 * 化合物1件の表示。通常表示は成分名と短い説明に絞り、
 * 検出の事実・寄与の根拠・出典は追加タップ（details）で開く。
 * 化合物単体の香り・味の知見と、食品中での寄与の実証は分けて示す。
 */
export default function CompoundCard({ compound: c, tasteFocus }: { compound: Compound; tasteFocus?: TasteKey }) {
  const focusLink = tasteFocus ? c.tasteLinks?.find((l) => l.taste === tasteFocus) : undefined
  const otherTasteLinks = (c.tasteLinks ?? []).filter((l) => l.taste !== tasteFocus)
  return (
    <article className="compound-card">
      <h5>{c.name}（{c.aliases[0] ?? ''}）</h5>
      <p>{c.plainDescription}</p>
      {focusLink && <p><strong>{TASTE_LABELS[focusLink.taste]}との関連：</strong>{focusLink.evidence}</p>}
      {c.noteIds.length > 0 && (
        <p className="note-small">関係する香味：{c.noteIds.map((n) => noteById(n)?.name ?? n).join('、')}</p>
      )}
      <details className="compound">
        <summary>科学的な根拠の詳細</summary>
        {c.noteIds.length > 0 && <p><strong>寄与する香り：</strong>{c.aromaKnowledge}</p>}
        {otherTasteLinks.map((l) => (
          <p key={l.taste}><strong>{TASTE_LABELS[l.taste]}との関連：</strong>{l.evidence}</p>
        ))}
        <dl>
          <dt>検出・確認の事実</dt><dd>{c.detectedIn}</dd>
          <dt>寄与の根拠</dt><dd>{c.contributionEvidence}</dd>
        </dl>
        <SourceLinks ids={c.sourceIds} />
      </details>
    </article>
  )
}
