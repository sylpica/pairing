// 端末内保存（localStorage）。形式バージョンを持ち、不正データは安全に捨てる。
export interface SavedData {
  version: 1
  favorites: { teas: string[]; chocolates: string[]; pairings: string[] }
  history: { teas: string[]; chocolates: string[]; pairings: string[] }
}
const KEY = 'pairing-app:v1'
export const HISTORY_LIMIT = 50
export const emptySaved = (): SavedData => ({ version: 1, favorites: { teas: [], chocolates: [], pairings: [] }, history: { teas: [], chocolates: [], pairings: [] } })

export function loadSaved(): SavedData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptySaved()
    return validateSaved(JSON.parse(raw))
  } catch { return emptySaved() }
}
export function validateSaved(v: unknown): SavedData {
  if (typeof v !== 'object' || v === null) throw new Error('形式が正しくありません')
  const d = v as Partial<SavedData>
  if (d.version !== 1) throw new Error('対応していないバージョンです')
  const arr = (x: unknown) => (Array.isArray(x) && x.every((i) => typeof i === 'string') ? (x as string[]) : (() => { throw new Error('形式が正しくありません') })())
  const uniq = (xs: string[]) => [...new Set(xs)]
  // ペアの保存IDは旧形式（種別なし）から種別つき形式へ読み替え、移行後に重複を除く
  const pairings = (xs: string[]) => uniq(xs.map(migratePairId))
  return {
    version: 1,
    favorites: { teas: uniq(arr(d.favorites?.teas ?? [])), chocolates: uniq(arr(d.favorites?.chocolates ?? [])), pairings: pairings(arr(d.favorites?.pairings ?? [])) },
    history: { teas: uniq(arr(d.history?.teas ?? [])).slice(0, HISTORY_LIMIT), chocolates: uniq(arr(d.history?.chocolates ?? [])).slice(0, HISTORY_LIMIT), pairings: pairings(arr(d.history?.pairings ?? [])).slice(0, HISTORY_LIMIT) },
  }
}

// ===== ペアの保存ID（第9弾：自家ブレンド対応で種別を含める） =====
// 形式: '<種別>:<アイテムID>+<種別>:<アイテムID>'（種別は tea / chocolate）。
// 異種ペアは従来の並び（お茶→チョコレート）に正規化する。同種ペアは選択した順。
// 旧形式 '<お茶ID>+<チョコID>'（種別なし）はお茶×チョコとして読み替える（後方互換）。
export type PairSideType = 'tea' | 'chocolate'
export interface PairRefSide { type: PairSideType; id: string }
export interface PairRef { a: PairRefSide; b: PairRefSide }

export function pairIdOf(a: PairRefSide, b: PairRefSide): string {
  const [x, y] = a.type !== b.type && a.type === 'chocolate' ? [b, a] : [a, b]
  return `${x.type}:${x.id}+${y.type}:${y.id}`
}

export function parsePairId(id: string): PairRef | null {
  const parts = id.split('+')
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null
  const typed = parts.map((p) => {
    const i = p.indexOf(':')
    if (i < 0) return null
    const t = p.slice(0, i)
    if (t !== 'tea' && t !== 'chocolate') return null
    const rest = p.slice(i + 1)
    return rest ? { type: t as PairSideType, id: rest } : null
  })
  if (typed[0] && typed[1]) return { a: typed[0], b: typed[1] }
  // 旧形式（種別なし）は「お茶ID+チョコID」
  if (!parts[0].includes(':') && !parts[1].includes(':')) {
    return { a: { type: 'tea', id: parts[0] }, b: { type: 'chocolate', id: parts[1] } }
  }
  return null
}

/** 旧形式のIDを種別つき形式へ読み替える。解釈できない文字列はそのまま返す。 */
export function migratePairId(id: string): string {
  const ref = parsePairId(id)
  return ref ? pairIdOf(ref.a, ref.b) : id
}
export function persistSaved(d: SavedData) { try { localStorage.setItem(KEY, JSON.stringify(d)) } catch { /* 保存領域の不足等では黙って失敗し、画面操作は継続する */ } }
export function pushHistory(list: string[], id: string, max = 20) { return [id, ...list.filter((x) => x !== id)].slice(0, max) }
