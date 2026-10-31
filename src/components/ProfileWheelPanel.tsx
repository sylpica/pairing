import { useMemo, useState } from 'react'
import type { FlavorProfile, TasteKey } from '../types'
import type { CompoundContext } from '../data/compounds'
import { noteById } from '../data/flavors'
import { TASTE_LABELS } from '../engine/pairing'
import FlavorWheel from './FlavorWheel'
import TasteWheel, { comboTastesFromProfile } from './TasteWheel'
import NoteDetail from './NoteDetail'
import TasteDetail from './TasteDetail'
import { CollapsibleSheet } from './Sheet'

/**
 * アイテム詳細（実測プロファイル）の「香り／味」切り替えパネル（第7弾・課題B）。
 * 香りモードは従来の FlavorWheel、味モードはアイテムの味覚プロファイルを
 * ホイール化した TasteWheel を表示する。味の詳細シートは従来の TasteDetail
 * （味に関係する成分表示）をそのまま使う。
 * 判断（課題B-4）: アイテム詳細ページにも切り替えを付け、従来の味覚チャート
 * （TasteChart の棒グラフ）はホイールの下のチップ一覧と詳細シートで代替する。
 */
export default function ProfileWheelPanel({ profile, context }: {
  profile: FlavorProfile
  context?: CompoundContext
}) {
  const [mode, setMode] = useState<'aroma' | 'taste'>('aroma')
  const [selNote, setSelNote] = useState<string | null>(null)
  const [selTaste, setSelTaste] = useState<TasteKey | null>(null)
  const tastes = useMemo(() => comboTastesFromProfile(profile), [profile])
  return (
    <div>
      <div className="wheel-mode-toggle" role="tablist" aria-label="ホイールの表示切り替え（香りと味）">
        <button role="tab" aria-selected={mode === 'aroma'} onClick={() => setMode('aroma')}>香り</button>
        <button role="tab" aria-selected={mode === 'taste'} onClick={() => setMode('taste')}>味</button>
      </div>
      {mode === 'aroma' ? (
        <>
          <FlavorWheel profile={profile} context={context} onSelectNote={setSelNote} />
          {selNote && (
            <CollapsibleSheet resetKey={selNote} title={noteById(selNote)?.name ?? selNote} onDismiss={() => setSelNote(null)}>
              <NoteDetail noteId={selNote} profile={profile} context={context} />
            </CollapsibleSheet>
          )}
        </>
      ) : (
        <>
          <TasteWheel tastes={tastes}
            onSelectTaste={(k) => setSelTaste(selTaste === k ? null : k)} selectedTasteKey={selTaste} />
          {selTaste && (
            <CollapsibleSheet resetKey={selTaste} title={TASTE_LABELS[selTaste]} onDismiss={() => setSelTaste(null)}>
              <TasteDetail taste={selTaste} profile={profile} context={context} />
            </CollapsibleSheet>
          )}
        </>
      )}
    </div>
  )
}
