import { useState } from 'react'
import type { FlavorProfile, EvidenceLevel } from '../types'
import FlavorWheel, { INT_LABEL } from './FlavorWheel'
import TasteChart from './TasteChart'
import { noteById } from '../data/flavors'
import { compounds } from '../data/compounds'
import { sources } from '../data/sources'

export const LEVEL_LABEL: Record<EvidenceLevel, string> = {
  measured: '実測・官能評価あり', general: '一般的な知見', exploratory: '探索的な予想', insufficient: '情報不足',
}
export const BASIS_LABEL: Record<string, string> = { measured: '実測', sensory: '官能評価', review: '総説による整理', general: '一般的知見' }

export function SourceLinks({ ids }: { ids: string[] }) {
  const list = sources.filter((s) => ids.includes(s.id))
  if (list.length === 0) return null
  return (
    <ul className="source-links">
      {list.map((s) => (
        <li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.authors.split(',')[0]} et al. ({s.year}) {s.journal ?? ''} — DOI: {s.doi}</a></li>
      ))}
    </ul>
  )
}

export default function ProfileView({ profile, scopeNote, sourceIds }: { profile: FlavorProfile; scopeNote: string; sourceIds: string[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const note = selected ? noteById(selected) : undefined
  const entry = selected ? profile.aromas.find((a) => a.noteId === selected) : undefined
  const linked = selected ? compounds.filter((c) => c.noteIds.includes(selected)) : []
  const temporal = [
    { label: '最初の印象', stage: profile.temporal.first },
    { label: '口の中で広がる', stage: profile.temporal.middle },
    { label: '余韻', stage: profile.temporal.finish },
  ]
  return (
    <div>
      <FlavorWheel profile={profile} onSelectNote={setSelected} />
      {note && entry && (
        <section className="note-detail" aria-live="polite">
          <h3>{note.name} <span className="badge">{INT_LABEL[entry.intensity]}・{BASIS_LABEL[entry.basis]}</span></h3>
          <p>{note.example}</p>
          {linked.length > 0 ? (
            <div>
              <h4>関連する成分</h4>
              {linked.map((c) => (
                <details key={c.id} className="compound">
                  <summary>{c.name}</summary>
                  <p>{c.plainDescription}</p>
                  <dl>
                    <dt>検出の事実</dt><dd>{c.detectedIn}</dd>
                    <dt>香りの知見</dt><dd>{c.aromaKnowledge}</dd>
                    <dt>寄与の根拠</dt><dd>{c.contributionEvidence}</dd>
                  </dl>
                  <SourceLinks ids={c.sourceIds} />
                </details>
              ))}
            </div>
          ) : <p className="note-small">この香味に関連する成分データは未収録です。</p>}
          <SourceLinks ids={entry.sourceIds} />
        </section>
      )}
      <h3>味覚と渋味</h3>
      <TasteChart profile={profile} />
      <h3>香味の移り変わり</h3>
      <div className="temporal">
        {temporal.map((t) => (
          <div className="temporal-card" key={t.label}>
            <h4>{t.label}</h4>
            {t.stage.text ? <p>{t.stage.text}</p> : <p className="unknown-box">情報不足（時間変化の検証データは未収録）</p>}
          </div>
        ))}
      </div>
      <h3>このデータについて</h3>
      <p>{scopeNote}</p>
      <SourceLinks ids={sourceIds} />
    </div>
  )
}
