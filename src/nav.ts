// ハッシュルーティングの遷移ヘルパー。
// 「戻る」ボタンのために、アプリ内の画面遷移を戻り先スタックとして記録する。
// App がルート変化のたびに trackRoute(現在パス) を呼び、goBack はスタックを
// さかのぼる。選択状態は各画面が localStorage に保持しているため、戻っても
// 保持と矛盾しない。スタックが空（外部から直接開いた等）の場合はブラウザ履歴、
// それも無ければ呼び出し側が渡したフォールバック先へ進む。
const backStack: string[] = []
let lastPath: string | null = null
let suppressTrack = false

export const go = (path: string) => { location.hash = `#/${path}` }

/** ルート変化のたびに App から呼ぶ。直前のパスを戻り先スタックに積む。 */
export const trackRoute = (path: string) => {
  if (suppressTrack) { suppressTrack = false; lastPath = path; return }
  if (lastPath !== null && lastPath !== path) backStack.push(lastPath)
  lastPath = path
}

export const goBack = (fallback: string) => {
  const prev = backStack.pop()
  if (prev !== undefined) {
    suppressTrack = true
    location.hash = `#/${prev}`
    return
  }
  if (typeof history !== 'undefined' && history.length > 1) {
    history.back()
    return
  }
  lastPath = fallback
  location.hash = `#/${fallback}`
}

export const scrollTop = () => {
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}
