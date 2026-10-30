import { useState } from 'react'
import type { FlavorProfile, TasteKey } from '../types'
import FlavorWheel from './FlavorWheel'
import TasteChart from './TasteChart'
import NoteDetail from './NoteDetail'
import TasteDetail from './TasteDetail'
import { CollapsibleSheet } from './Sheet'
import { SourceLinks } from './SourceLinks'
import { noteById } from '../data/flavors'
import { TASTE_LABELS } from '../engine/pairing'
import type { CompoundContext } from '../data/compounds'

export { LEVEL_LABEL, BASIS_LABEL, SourceLinks } from './SourceLinks'

export default function ProfileView({ profile, scopeNote, sourceIds, context }: {
  profile: FlavorProfile
  scopeNote: string
  sourceIds: string[]
  /** 成分の階層表示（この茶類・種類での研究例／全般の研究例の区別）に使う表示中アイテムの情報 */
  context?: CompoundContext
}) {
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedTaste, setSelectedTaste] = useState<TasteKey | null>(null)
  const temporal = [
    { label: '最初の印象', stage: profile.temporal.first },
    { label: '口の中で広がる', stage: profile.temporal.middle },
    { label: '余韻', stage: profile.temporal.finish },
  ]
  return (
    <div>
      <FlavorWheel profile={profile} context={context} onSelectNote={(id) => { setSelected(id); setSelectedTaste(null) }} />
      {selected && (
        <CollapsibleSheet resetKey={selected} title={noteById(selected)?.name ?? selected} onDismiss={() => setSelected(null)}>
          <NoteDetail noteId={selected} profile={profile} context={context} />
        </CollapsibleSheet>
      )}
      <h3>味覚と渋味</h3>
      <TasteChart profile={profile} onSelectTaste={(k) => { setSelectedTaste(k); setSelected(null) }} />
      {selectedTaste && (
        <CollapsibleSheet resetKey={selectedTaste} title={TASTE_LABELS[selectedTaste]} onDismiss={() => setSelectedTaste(null)}>
          <TasteDetail taste={selectedTaste} profile={profile} context={context} />
        </CollapsibleSheet>
      )}
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
      <SourceLinks ids={[...new Set([...sourceIds, ...Object.values(profile.tastes).flatMap((t) => t.sourceIds), ...Object.values(profile.temporal).flatMap((t) => t.sourceIds)])]} />
    </div>
  )
}
