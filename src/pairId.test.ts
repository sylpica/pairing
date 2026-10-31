import { describe, it, expect } from 'vitest'
import { pairIdOf, parsePairId, migratePairId, validateSaved } from './storage'

// 第9弾（自家ブレンド対応）: ペアの保存IDに両側の種別を含める。
// 旧形式（種別なし）は「お茶ID+チョコID」として後方互換で読み替える。
describe('ペア保存ID（種別つき形式と後方互換）', () => {
  it('異種ペアは左右どちらの順で渡しても「お茶→チョコ」に正規化される', () => {
    const tea = { type: 'tea' as const, id: 'sencha' }
    const choco = { type: 'chocolate' as const, id: 'dark-roasted' }
    expect(pairIdOf(tea, choco)).toBe('tea:sencha+chocolate:dark-roasted')
    expect(pairIdOf(choco, tea)).toBe('tea:sencha+chocolate:dark-roasted')
  })

  it('同種ペアは選択した順（左，右）を保持する', () => {
    expect(pairIdOf({ type: 'tea', id: 'sencha' }, { type: 'tea', id: 'black-tea' }))
      .toBe('tea:sencha+tea:black-tea')
    expect(pairIdOf({ type: 'chocolate', id: 'dark-roasted' }, { type: 'chocolate', id: 'milk-chocolate' }))
      .toBe('chocolate:dark-roasted+chocolate:milk-chocolate')
  })

  it('parsePairId は種別つき形式を両側の種別ごと復元する', () => {
    expect(parsePairId('tea:sencha+tea:black-tea'))
      .toEqual({ a: { type: 'tea', id: 'sencha' }, b: { type: 'tea', id: 'black-tea' } })
    expect(parsePairId('chocolate:dark-roasted+chocolate:milk-chocolate'))
      .toEqual({ a: { type: 'chocolate', id: 'dark-roasted' }, b: { type: 'chocolate', id: 'milk-chocolate' } })
    // pairIdOf との往復
    const ref = parsePairId(pairIdOf({ type: 'chocolate', id: 'ruby-chocolate' }, { type: 'tea', id: 'matcha' }))!
    expect(ref).toEqual({ a: { type: 'tea', id: 'matcha' }, b: { type: 'chocolate', id: 'ruby-chocolate' } })
  })

  it('旧形式（種別なし）はお茶×チョコとして解釈される（後方互換）', () => {
    expect(parsePairId('sencha+dark-roasted'))
      .toEqual({ a: { type: 'tea', id: 'sencha' }, b: { type: 'chocolate', id: 'dark-roasted' } })
    expect(migratePairId('sencha+dark-roasted')).toBe('tea:sencha+chocolate:dark-roasted')
    // 種別つき形式はそのまま（正規化のみ）
    expect(migratePairId('tea:sencha+chocolate:dark-roasted')).toBe('tea:sencha+chocolate:dark-roasted')
    expect(migratePairId('tea:sencha+tea:black-tea')).toBe('tea:sencha+tea:black-tea')
    // 解釈できない文字列は壊さずそのまま返す
    expect(parsePairId('sencha')).toBeNull()
    expect(migratePairId('sencha')).toBe('sencha')
  })

  it('validateSaved は旧形式のペアIDを種別つきへ移行し、移行後の重複を除く', () => {
    const v = validateSaved({
      version: 1,
      favorites: { teas: [], chocolates: [], pairings: ['sencha+dark-roasted', 'tea:sencha+chocolate:dark-roasted', 'tea:sencha+tea:black-tea'] },
      history: { teas: [], chocolates: [], pairings: ['matcha+milk-chocolate'] },
    })
    expect(v.favorites.pairings).toEqual(['tea:sencha+chocolate:dark-roasted', 'tea:sencha+tea:black-tea'])
    expect(v.history.pairings).toEqual(['tea:matcha+chocolate:milk-chocolate'])
  })
})
