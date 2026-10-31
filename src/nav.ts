// ハッシュルーティングの遷移ヘルパー。
// 「戻る」ボタンのために、アプリ内の画面遷移を戻り先スタックとして記録する。
// App がルート変化のたびに trackRoute(現在パス) を呼び、goBack はスタックを
// さかのぼる。選択状態は各画面が localStorage に保持しているため、戻っても
// 保持と矛盾しない。
// 第24弾：スタックは sessionStorage にも保存し、ページの再読み込み（実機の
// アプリ内ブラウザがページを再読込した場合など）でも直前のアプリ内画面に
// 戻れるようにした。スタックが空の場合にブラウザ履歴（history.back）へ
// 委ねることはしない。ブラウザ履歴にはアプリ外のエントリが混ざっており、
// アプリ外へ出てしまう事故になるためで、その場合は呼び出し側が渡した
// フォールバック先（そのページの自然な親画面）へ進む。
const STACK_KEY = 'pairing.nav.backStack.v1'
const MAX_STACK = 50

type NavState = { stack: string[]; last: string | null }

function loadState(): NavState {
  try {
    const raw = sessionStorage.getItem(STACK_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<NavState>
      if (Array.isArray(parsed.stack)) {
        return {
          stack: parsed.stack.filter((x): x is string => typeof x === 'string'),
          last: typeof parsed.last === 'string' ? parsed.last : null,
        }
      }
    }
  } catch { /* sessionStorage が使えない環境ではメモリ内のみで動く */ }
  return { stack: [], last: null }
}

const initial = loadState()
const backStack: string[] = initial.stack
let lastPath: string | null = initial.last
let suppressTrack = false
// モジュール初期化直後の最初の追跡かどうか。再読み込み時は、復元した
// lastPath と実際の現在パスが「同じ画面の詳細化」だけ異なる場合がある
// （組み合わせページが replaceState で URL を詳細パスに書き換えるため）。
// その場合に別画面として積んでしまうと、戻るが同じページに留まってしまう。
let firstTrack = true

function persist() {
  try {
    sessionStorage.setItem(STACK_KEY, JSON.stringify({ stack: backStack, last: lastPath }))
  } catch { /* sessionStorage が使えない環境では何もしない */ }
}

export const go = (path: string) => { location.hash = `#/${path}` }

/** ルート変化のたびに App から呼ぶ。直前のパスを戻り先スタックに積む。 */
export const trackRoute = (path: string) => {
  const isFirst = firstTrack
  firstTrack = false
  if (suppressTrack) { suppressTrack = false; lastPath = path; persist(); return }
  // 再読み込み直後：復元した lastPath の詳細化（配下パス）で再追跡された場合は
  // 同じ画面とみなし、戻り先に積まない（現在パスだけを更新する）。
  const refinesLast = isFirst && lastPath !== null && path.startsWith(`${lastPath}/`)
  if (!refinesLast && lastPath !== null && lastPath !== path) {
    backStack.push(lastPath)
    if (backStack.length > MAX_STACK) backStack.splice(0, backStack.length - MAX_STACK)
  }
  lastPath = path
  persist()
}

export const goBack = (fallback: string) => {
  // 現在の画面自身が戻り先に積まれている異常ケースは読み捨てる
  while (backStack.length > 0 && backStack[backStack.length - 1] === lastPath) backStack.pop()
  const prev = backStack.pop()
  if (prev !== undefined) {
    suppressTrack = true
    lastPath = prev
    persist()
    location.hash = `#/${prev}`
    return
  }
  // アプリ内遷移の記録が無い（URL直開き等）場合は、ブラウザ履歴ではなく
  // そのページの自然な親画面（フォールバック先）へ進む。
  lastPath = fallback
  persist()
  location.hash = `#/${fallback}`
}

export const scrollTop = () => {
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
}
