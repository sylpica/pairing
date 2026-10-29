import { describe, it, expect } from 'vitest'
import { validateSaved, emptySaved, pushHistory } from './storage'

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
})
