import { useState } from 'react'
import type { FlavorProfile } from '../types'
import FlavorWheel from './FlavorWheel'
import TasteChart from './TasteChart'
import NoteDetail from './NoteDetail'
import { SourceLinks } from './SourceLinks'

export { LEVEL_LABEL, BASIS_LABEL, SourceLinks } from './SourceLinks'

export default function ProfileView({ profile, scopeNote, sourceIds }: { profile: FlavorProfile; scopeNote: string; sourceIds: string[] }) {
  const [selected, setSelected] = useState<string | null>(null)
  const temporal = [
    { label: '最初の印象', stage: profile.temporal.first },
    { label: '口の中で広がる', stage: profile.temporal.middle },
    { label: '余韻', stage: profile.temporal.finish },
  ]
  return (
    <div>
      <FlavorWheel profile={profile} onSelectNote={setSelected} />
      {selected && <NoteDetail noteId={selected} profile={profile} />}
      <h3>味覚と渋味</h3>
      <TasteChart profile={profile} />
      <h3>香味の移り変わり</h3>
      <div className="temporal">
        {temporal.map((t) => (
          <div className="temporal-card" key={t.label}>
            <h4>{t.label}</h4>
            {t.stage.text ? <p>{t.stage.estimated && <span className="badge">推測（未検証）</span>}{t.stage.text}</p> : <p className="unknown-box">情報不足（時間変化の検証データは未収録）</p>}
          </div>
        ))}
      </div>
      <h3>このデータについて</h3>
      <p>{scopeNote}</p>
      <SourceLinks ids={sourceIds} />
    </div>
  )
}
