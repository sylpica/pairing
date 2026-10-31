import { describe, it, expect } from 'vitest'
import { validateSaved, emptySaved, pushHistory, loadSaved, HISTORY_LIMIT, comboFavId, parseComboFavId } from './storage'

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
  it('第13弾: combos の無い旧データは combos 空で読み込める（後方互換）', () => {
    const v = validateSaved({ version: 1, favorites: { teas: [], chocolates: [], pairings: ['sencha+dark-roasted'] }, history: { teas: [], chocolates: [], pairings: [] } })
    expect(v.favorites.combos).toEqual([])
    // ペアの旧形式IDは従来どおり種別つきへ読み替えられる（combos 追加で壊れていない）
    expect(v.favorites.pairings).toEqual(['tea:sencha+chocolate:dark-roasted'])
  })
  it('第13弾: combos は重複を除去して読み込める', () => {
    const v = validateSaved({ version: 1, favorites: { teas: [], chocolates: [], pairings: [], combos: ['tea-combo:black-tea|-|-', 'tea-combo:black-tea|-|-'] }, history: { teas: [], chocolates: [], pairings: [] } })
    expect(v.favorites.combos).toEqual(['tea-combo:black-tea|-|-'])
  })
})

describe('単体組み合わせの保存ID（第13弾）', () => {
  it('お茶: 3軸を往復できる（未指定は空に戻る）', () => {
    const id = comboFavId('tea', { kind: 'black-tea', origin: 'region:nagasaki', third: 'yabukita' })
    expect(id).toBe('tea-combo:black-tea|region:nagasaki|yabukita')
    expect(parseComboFavId(id)).toEqual({ side: 'tea', kind: 'black-tea', origin: 'region:nagasaki', third: 'yabukita' })
    const partial = comboFavId('tea', { kind: '', origin: '日本', third: '' })
    expect(partial).toBe('tea-combo:-|日本|-')
    expect(parseComboFavId(partial)).toEqual({ side: 'tea', kind: '', origin: '日本', third: '' })
  })
  it('チョコ: 系統（layer:id）を含む3軸を往復できる', () => {
    const id = comboFavId('chocolate', { kind: 'dark', origin: 'venezuela', third: 'genetic:nacional' })
    expect(id).toBe('choco-combo:dark|venezuela|genetic:nacional')
    expect(parseComboFavId(id)).toEqual({ side: 'chocolate', kind: 'dark', origin: 'venezuela', third: 'genetic:nacional' })
  })
  it('ペアIDや不正な文字列は単体組み合わせとして解釈しない', () => {
    expect(parseComboFavId('tea:sencha+chocolate:dark-roasted')).toBeNull()
    expect(parseComboFavId('tea-combo:only-one')).toBeNull()
    expect(parseComboFavId('tea-combo:a|b')).toBeNull()
    expect(parseComboFavId('')).toBeNull()
  })
})
