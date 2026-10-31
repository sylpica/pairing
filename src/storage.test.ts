import { describe, it, expect } from 'vitest'
import { validateSaved, emptySaved, loadSaved, comboFavId, parseComboFavId, lineageFavId, parseLineageFavId } from './storage'

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
  it('loadSaved は保存がなければ空データを返す', () => {
    const store = new Map<string, string>()
    ;(globalThis as { localStorage?: unknown }).localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, v) }, removeItem: (k: string) => { store.delete(k) }, clear: () => store.clear() }
    expect(loadSaved()).toEqual(emptySaved())
  })
  it('validateSaved はお気に入りの重複を除去する', () => {
    const v = validateSaved({ version: 1, favorites: { teas: ['a', 'a', 'b'], chocolates: [], pairings: [] }, history: { teas: ['x'], chocolates: [], pairings: [] } })
    expect(v.favorites.teas).toEqual(['a', 'b'])
    // 旧データの history は結果に含まれない（第15弾で履歴全廃）
    expect('history' in v).toBe(false)
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
  it('第15弾: 新カテゴリ（品種・系統・産地）の無い旧データは空で補われる（後方互換）', () => {
    const v = validateSaved({ version: 1, favorites: { teas: ['sencha'], chocolates: [], pairings: [], combos: [] }, history: { teas: [], chocolates: [] } })
    expect(v.favorites.cultivars).toEqual([])
    expect(v.favorites.lineages).toEqual([])
    expect(v.favorites.origins).toEqual([])
    expect(v.favorites.teas).toEqual(['sencha'])
  })
  it('第15弾: 新カテゴリは重複を除去して読み込める', () => {
    const v = validateSaved({ version: 1, favorites: { teas: [], chocolates: [], pairings: [], combos: [], cultivars: ['yabukita', 'yabukita'], lineages: ['genetic:gen-nacional'], origins: ['madagascar', 'madagascar'] }, history: { teas: [], chocolates: [] } })
    expect(v.favorites.cultivars).toEqual(['yabukita'])
    expect(v.favorites.lineages).toEqual(['genetic:gen-nacional'])
    expect(v.favorites.origins).toEqual(['madagascar'])
  })
  it('第15弾: 旧データの history は丸ごと無視され、形が壊れていても例外にならない（後方互換）', () => {
    const v = validateSaved({ version: 1, favorites: { teas: ['sencha'], chocolates: [], pairings: [] }, history: { teas: ['sencha'], chocolates: [], pairings: ['tea:sencha+chocolate:dark-roasted'] } })
    expect(v.favorites.teas).toEqual(['sencha'])
    expect('history' in v).toBe(false)
    const v2 = validateSaved({ version: 1, favorites: { teas: [], chocolates: [], pairings: [] }, history: { teas: [123], pairings: 'broken' } })
    expect('history' in v2).toBe(false)
    expect(v2.favorites).toEqual(emptySaved().favorites)
  })
})

describe('カカオ系統の保存ID（第15弾）', () => {
  it('<layer>:<id> を往復できる', () => {
    expect(lineageFavId('genetic', 'gen-nacional')).toBe('genetic:gen-nacional')
    expect(parseLineageFavId('genetic:gen-nacional')).toEqual({ layer: 'genetic', id: 'gen-nacional' })
    expect(parseLineageFavId('traditional:trad-criollo')).toEqual({ layer: 'traditional', id: 'trad-criollo' })
    expect(parseLineageFavId('clone:ccn-51')).toEqual({ layer: 'clone', id: 'ccn-51' })
  })
  it('不正な文字列は解釈しない', () => {
    expect(parseLineageFavId('yabukita')).toBeNull()
    expect(parseLineageFavId('bogus:x')).toBeNull()
    expect(parseLineageFavId('genetic:')).toBeNull()
    expect(parseLineageFavId('')).toBeNull()
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
