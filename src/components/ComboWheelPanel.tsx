import { useEffect, useState } from 'react'
import type { ComboNote, ComboTaste, TasteKey } from '../types'
import type { CompoundContext } from '../data/compounds'
import { noteById } from '../data/flavors'
import { COMBO_TASTE_LABEL } from '../engine/combo'
import ComboWheel from './ComboWheel'
import TasteWheel from './TasteWheel'
import ComboNoteDetail from './ComboNoteDetail'
import ComboTasteDetail from './ComboTasteDetail'
import { CollapsibleSheet } from './Sheet'

/**
 * 組み合わせ系ホイールの「香り／味」切り替えパネル（第7弾・課題B）。
 * ホイールの少し上に切り替えボタンを置き、香りモードは ComboWheel、
 * 味モードは TasteWheel（土台の味覚プロファイル＋製法ルール・軸効果の
 * 味への作用＝ComboAnalysis.tastes）を表示する。表示の作法（濃さ＝
 * 根拠レベル、全セグメントにラベル、タップで詳細シート）は両モードで揃える。
 * ComboWheel のある全画面（組み合わせページ／調べるプレビュー／
 * 品種・系統ページ／組み合わせるのタブ）で共通に使う。
 */
export default function ComboWheelPanel({ notes, tastes, context, resetKey }: {
  notes: ComboNote[]
  tastes: ComboTaste[]
  context?: CompoundContext
  /** 組み合わせが変わったら選択とモードを戻すためのキー */
  resetKey?: string
}) {
  const [mode, setMode] = useState<'aroma' | 'taste'>('aroma')
  const [selNote, setSelNote] = useState<string | null>(null)
  const [selTaste, setSelTaste] = useState<TasteKey | null>(null)
  useEffect(() => { setSelNote(null); setSelTaste(null); setMode('aroma') }, [resetKey])
  const note = notes.find((n) => n.noteId === selNote) ?? null
  const taste = tastes.find((t) => t.key === selTaste) ?? null
  return (
    <div>
      <div className="wheel-mode-toggle" role="tablist" aria-label="ホイールの表示切り替え（香りと味）">
        <button role="tab" aria-selected={mode === 'aroma'} onClick={() => setMode('aroma')}>香り</button>
        <button role="tab" aria-selected={mode === 'taste'} onClick={() => setMode('taste')}>味</button>
      </div>
      {mode === 'aroma' ? (
        <>
          <ComboWheel notes={notes} context={context}
            onSelectNote={(id) => setSelNote(selNote === id ? null : id)} selectedNoteId={selNote} />
          {note && (
            <CollapsibleSheet resetKey={note.noteId} title={noteById(note.noteId)?.name ?? note.noteId} noun="根拠情報"
              onDismiss={() => setSelNote(null)}>
              <ComboNoteDetail note={note} context={context} />
            </CollapsibleSheet>
          )}
        </>
      ) : (
        <>
          <TasteWheel tastes={tastes}
            onSelectTaste={(k) => setSelTaste(selTaste === k ? null : k)} selectedTasteKey={selTaste} />
          {taste && (
            <CollapsibleSheet resetKey={taste.key} title={COMBO_TASTE_LABEL[taste.key]} noun="根拠情報"
              onDismiss={() => setSelTaste(null)}>
              <ComboTasteDetail taste={taste} />
            </CollapsibleSheet>
          )}
        </>
      )}
    </div>
  )
}
