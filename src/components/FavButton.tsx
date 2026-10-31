// お気に入りボタンの共通部品（第15弾・2026-10-31 実機FB）。
// 「お気に入り」と「この組み合わせを保存」で文言が2つに分かれていた問題への対応として、
// 全画面の保存／お気に入りボタンはこの部品に統一する。文言と状態表示はここでのみ決める：
//   未保存：☆ お気に入り／保存済み：★ お気に入り済み（aria-pressed で状態も伝える）
interface FavButtonProps {
  fav: boolean
  onToggle: () => void
  /** 見出し行など、大きめに置く場所向けの追加クラス（例：'pair-save-btn'） */
  className?: string
}

export default function FavButton({ fav, onToggle, className }: FavButtonProps) {
  return (
    <button type="button" className={className ? `fav-btn ${className}` : 'fav-btn'} aria-pressed={fav} onClick={onToggle}>
      {fav ? '★ お気に入り済み' : '☆ お気に入り'}
    </button>
  )
}
