import { describe, it, expect } from 'vitest'
import { validateSaved, emptySaved, pushHistory, loadSaved, HISTORY_LIMIT } from './storage'

describe('保存データの検証（§12・§16）', () => {
  it('正常なデータを読み込める', () => {
    const d = emptySaved(); d.favorites.teas = ['black-tea']
    expect(validateSaved(JSON.parse(JSON.stringify(d))).favorites.teas).toEqual(['black-tea'])
  })
  it('形式の誤りは安全にエラーになる', () => {
    expect(() => validateSaved(null)).toThrow()
    expect(() => validateSaved({ version: 99 })).toThrow()
    expect(() => validateSaved({ version: 1, favorites: { teas: [123] } })).toThrow()
  })
  it('履歴は重複なく新しい順で上限を守る', () => {
    expect(pushHistory(['a', 'b'], 'b')).toEqual(['b', 'a'])
    expect(pushHistory(Array.from({ length: 25 }, (_, i) => `x${i}`), 'new')).toHaveLength(20)
  })
  it('loadSaved は保存がなければ空データを返す', () => {
    const store = new Map<string, string>()
    ;(globalThis as { localStorage?: unknown }).localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, v) }, removeItem: (k: string) => { store.delete(k) }, clear: () => store.clear() }
    expect(loadSaved()).toEqual(emptySaved())
  })
  it('validateSaved は重複を除去し履歴を上限で切る', () => {
    const v = validateSaved({ version: 1, favorites: { teas: ['a', 'a', 'b'], chocolates: [], pairings: [] }, history: { teas: Array.from({ length: 60 }, (_, i) => `t${i}`), chocolates: [], pairings: [] } })
    expect(v.favorites.teas).toEqual(['a', 'b'])
    expect(v.history.teas.length).toBe(HISTORY_LIMIT)
  })
})
