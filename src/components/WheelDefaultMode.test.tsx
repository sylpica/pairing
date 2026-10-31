// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import ComboWheelPanel from './ComboWheelPanel'
import { analyzeTeaCombo } from '../engine/combo'

// 第33弾: ホイールの既定モードは「味」、切替ボタンは左＝味・右＝香り。
describe('ホイールの既定モードとボタン順（第33弾）', () => {
  beforeEach(() => { cleanup() })

  it('初期表示は味ホイールで、ボタンは 味｜香り の順に並ぶ', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const { container } = render(<ComboWheelPanel notes={a.notes} tastes={a.tastes} context={a.context} resetKey={a.title} />)
    const tasteTab = screen.getByRole('tab', { name: '味' })
    const aromaTab = screen.getByRole('tab', { name: '香り' })
    expect(tasteTab.getAttribute('aria-selected')).toBe('true')
    expect(aromaTab.getAttribute('aria-selected')).toBe('false')
    // 味が左（DOM順で先）
    expect(tasteTab.compareDocumentPosition(aromaTab) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    // 初期表示は味の第1階層（味そのもの）
    expect(container.querySelector('svg.wheel')).toBeTruthy()
    expect(screen.getAllByLabelText(/甘味を開く|苦味を開く|渋味（収れん感）を開く/).length).toBeGreaterThan(0)
    // 香りに切り替えると香りの第1階層が出る
    fireEvent.click(aromaTab)
    expect(aromaTab.getAttribute('aria-selected')).toBe('true')
    expect(screen.getByLabelText(/花系を開く/)).toBeTruthy()
    // 味に戻れる
    fireEvent.click(tasteTab)
    expect(tasteTab.getAttribute('aria-selected')).toBe('true')
  })

  it('対象を切り替える（resetKey 変更）と既定の味に戻る', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const b = analyzeTeaCombo({ kindId: 'black', regionId: '', cultivarId: '' })
    const { rerender } = render(<ComboWheelPanel notes={a.notes} tastes={a.tastes} context={a.context} resetKey={a.title} />)
    fireEvent.click(screen.getByRole('tab', { name: '香り' }))
    expect(screen.getByRole('tab', { name: '香り' }).getAttribute('aria-selected')).toBe('true')
    rerender(<ComboWheelPanel notes={b.notes} tastes={b.tastes} context={b.context} resetKey={b.title} />)
    expect(screen.getByRole('tab', { name: '味' }).getAttribute('aria-selected')).toBe('true')
  })
})
