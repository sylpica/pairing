import { useMemo } from 'react'
import type { Basis, ComboLevel, ComboNote, FlavorProfile } from '../types'
import type { CompoundContext } from '../data/compounds'
import TieredWheelPanel from './TieredWheelPanel'
import { comboTastesFromProfile } from './TasteWheel'
import NoteDetail from './NoteDetail'
import TasteDetail from './TasteDetail'

/**
 * アイテム詳細（実測プロファイル）のホイールパネル（第8弾で3階層化）。
 * 組み合わせ系と同じ TieredWheelPanel を使い、香りは
 * 大分類→中分類（具体名）→小分類（化学物質）、味は次元→物質の階層にする。
 * 詳細シートはアイテム系の従来表示（NoteDetail／TasteDetail）を差し込む。
 * アイテムのプロファイルを組み合わせ系の形（ComboNote）へ変換する際、
 * basis（measured/sensory → measured、それ以外 → general）を根拠レベルに写す。
 */
const basisLevel = (b: Basis): ComboLevel => (b === 'measured' || b === 'sensory' ? 'measured' : 'general')

export function comboNotesFromProfile(profile: FlavorProfile): ComboNote[] {
  return profile.aromas.map((a) => ({
    noteId: a.noteId,
    intensity: a.intensity,
    level: basisLevel(a.basis),
    basis: [{ from: 'profile' as const, text: '', sourceIds: [...a.sourceIds] }],
    sourceIds: [...a.sourceIds],
  }))
}

export default function ProfileWheelPanel({ profile, context }: {
  profile: FlavorProfile
  context?: CompoundContext
}) {
  const notes = useMemo(() => comboNotesFromProfile(profile), [profile])
  const tastes = useMemo(() => comboTastesFromProfile(profile), [profile])
  return (
    <TieredWheelPanel
      notes={notes}
      tastes={tastes}
      context={context}
      ariaLabel="フレーバーホイール"
      detailNoun="成分情報"
      renderNoteDetail={(note) => <NoteDetail noteId={note.noteId} profile={profile} context={context} />}
      renderTasteDetail={(taste) => <TasteDetail taste={taste.key} profile={profile} context={context} />}
    />
  )
}
