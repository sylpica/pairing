import { goBack } from '../nav'

/**
 * 「前の画面へ戻る」ボタン。組み合わせページと各詳細ページの冒頭に置く。
 * 挙動はアプリ内遷移の記録を戻ること（nav.ts の goBack：アプリ内遷移
 * スタック→フォールバック先の順。ブラウザ履歴には委ねない）。fallback は、
 * アプリ内遷移の記録が無い場合に辿るのが自然な親画面。
 */
export default function BackButton({ fallback }: { fallback: string }) {
  return (
    <button className="btn ghost back-btn" onClick={() => goBack(fallback)}>← 戻る</button>
  )
}
