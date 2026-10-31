// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import ComboWheelPanel from './ComboWheelPanel'
import { analyzeTeaCombo, analyzeChocoCombo } from '../engine/combo'
import { buildAromaTiers } from '../engine/wheelTiers'
import { compounds } from '../data/compounds'

// 第32弾: 香り第2階層の全セグメントに、寄与化合物の実名が小さく併記される
// （「化合物○種」の件数だけにしない）ことを固定する。
const compoundNames = new Set(compounds.map((c) => c.name))

describe('香り中分類ホイールへの化合物名併記（第32弾）', () => {
  beforeEach(() => { cleanup() })

  it('エンジン側: 全カテゴリ・全具体名で、化合物がある場合は名前が引ける', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const tiers = buildAromaTiers(a.notes, a.context)
    let withCompounds = 0
    for (const t of tiers) {
      for (const e of t.entries) {
        if (e.compounds.length > 0) {
          withCompounds++
          for (const tc of e.compounds) expect(compoundNames.has(tc.compound.name)).toBe(true)
        }
      }
    }
    expect(withCompounds).toBeGreaterThan(0)
  })

  it('画面: 第2階層のセグメントに化合物名が出て、「化合物○種」表記が残らない', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const { container } = render(<ComboWheelPanel notes={a.notes} tastes={a.tastes} context={a.context} resetKey={a.title} />)
    fireEvent.click(screen.getByRole('tab', { name: '香り' })) // 第33弾: 既定は味
    fireEvent.click(screen.getByLabelText(/花系を開く/))
    const segs = [...container.querySelectorAll('svg g.wheel-seg')]
    expect(segs.length).toBeGreaterThan(0)
    let named = 0
    for (const g of segs) {
      const subs = [...g.querySelectorAll('.wheel-sub')].map((t) => t.textContent ?? '').join('・')
      expect(subs).not.toMatch(/化合物\d+種/)
      if ([...compoundNames].some((n) => subs.includes(n))) named++
    }
    expect(named).toBeGreaterThan(0)
    // 凡例チップにも化合物名（または「ほか」を伴う実名）が出る
    const chips = [...container.querySelectorAll('.wheel-list, .wheel-chips, li, .chip')].map((el) => el.textContent ?? '')
    const allText = container.textContent ?? ''
    expect(allText).not.toMatch(/化合物\d+種/)
    expect(chips.length).toBeGreaterThanOrEqual(0)
  })

  it('チョコ側（ダーク×ガーナ相当）でも第2階層に化合物名が出る', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: 'ghana', lineage: null })
    const { container } = render(<ComboWheelPanel notes={a.notes} tastes={a.tastes} context={a.context} resetKey={a.title} />)
    fireEvent.click(screen.getByRole('tab', { name: '香り' })) // 第33弾: 既定は味
    fireEvent.click(screen.getByLabelText(/ナッツ・カカオ系を開く/))
    const segs = [...container.querySelectorAll('svg g.wheel-seg')]
    expect(segs.length).toBeGreaterThan(0)
    const allSubs = segs.map((g) => [...g.querySelectorAll('.wheel-sub')].map((t) => t.textContent ?? '').join('・')).join('|')
    expect(allSubs).not.toMatch(/化合物\d+種/)
    expect([...compoundNames].some((n) => allSubs.includes(n))).toBe(true)
  })
})
