import { goBack } from '../nav'

/**
 * 「前の画面へ戻る」ボタン。組み合わせページと各詳細ページの冒頭に置く。
 * 挙動は履歴を戻ること（nav.ts の goBack：アプリ内遷移スタック→ブラウザ履歴→
 * フォールバック先の順）。fallback は、このページから辿るのが自然な一覧ページ。
 */
export default function BackButton({ fallback }: { fallback: string }) {
  return (
    <button className="btn ghost back-btn" onClick={() => goBack(fallback)}>← 戻る</button>
  )
}
