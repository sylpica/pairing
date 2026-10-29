// 端末内保存（localStorage）。形式バージョンを持ち、不正データは安全に捨てる。
export interface SavedData {
  version: 1
  favorites: { teas: string[]; chocolates: string[]; pairings: string[] }
  history: { teas: string[]; chocolates: string[]; pairings: string[] }
}
const KEY = 'pairing-app:v1'
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
  return {
    version: 1,
    favorites: { teas: arr(d.favorites?.teas ?? []), chocolates: arr(d.favorites?.chocolates ?? []), pairings: arr(d.favorites?.pairings ?? []) },
    history: { teas: arr(d.history?.teas ?? []), chocolates: arr(d.history?.chocolates ?? []), pairings: arr(d.history?.pairings ?? []) },
  }
}
export function persistSaved(d: SavedData) { localStorage.setItem(KEY, JSON.stringify(d)) }
export function pushHistory(list: string[], id: string, max = 20) { return [id, ...list.filter((x) => x !== id)].slice(0, max) }
