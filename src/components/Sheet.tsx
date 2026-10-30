import { useEffect, useState, type ReactNode } from 'react'

/**
 * 成分情報の表示形態。スマホ（狭幅）では画面下部から開くシート（position: fixed）、
 * 広幅では通常のカードとしてその場に表示する（App.css の .bottom-sheet を参照）。
 * 画面遷移はしない。
 */
export default function Sheet({ label, onClose, children }: { label: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="bottom-sheet" role="dialog" aria-label={label}>
      <div className="sheet-bar">
        <span className="sheet-grip" aria-hidden="true" />
        <button className="sheet-close" aria-label="成分情報を閉じる" onClick={onClose}>× 閉じる</button>
      </div>
      <div className="sheet-body">{children}</div>
    </div>
  )
}

/**
 * 選択（香味・味覚）を保持したままシートだけ開閉できるラッパー。
 * 閉じても選択は残り、「もう一度開く」ボタンで再表示できる。
 * 選択対象（resetKey）が変われば自動で開く。選択解除は onDismiss。
 */
export function CollapsibleSheet({ resetKey, title, onDismiss, children }: {
  resetKey: string
  title: string
  onDismiss: () => void
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)
  useEffect(() => { setOpen(true) }, [resetKey])
  if (!open) {
    return (
      <div className="sheet-reopen-row">
        <button className="chip" onClick={() => setOpen(true)}>「{title}」の成分情報をもう一度開く</button>
        <button className="linklike" onClick={onDismiss}>選択を解除する</button>
      </div>
    )
  }
  return <Sheet label={`${title}の成分情報`} onClose={() => setOpen(false)}>{children}</Sheet>
}
