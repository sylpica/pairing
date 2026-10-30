import type { EvidenceLevel } from '../types'
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
        <li key={s.id}><a href={s.url} target="_blank" rel="noreferrer">{s.authors.split(',')[0]} et al. ({s.year}) {s.journal ?? ''}{s.doi ? ` — DOI: ${s.doi}` : ''}</a></li>
      ))}
    </ul>
  )
}
