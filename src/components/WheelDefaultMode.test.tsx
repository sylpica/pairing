// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import ComboWheelPanel from './ComboWheelPanel'
import { analyzeTeaCombo } from '../engine/combo'

// 第46弾（ユーザー明示指示で第33弾の決定を覆す）: ホイールの既定モードは
// 「香り」、切替ボタンは左＝香り・右＝味。
describe('ホイールの既定モードとボタン順（第46弾）', () => {
  beforeEach(() => { cleanup() })

  it('初期表示は香りホイールで、ボタンは 香り｜味 の順に並ぶ', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const { container } = render(<ComboWheelPanel notes={a.notes} tastes={a.tastes} context={a.context} resetKey={a.title} />)
    const aromaTab = screen.getByRole('tab', { name: '香り' })
    const tasteTab = screen.getByRole('tab', { name: '味' })
    expect(aromaTab.getAttribute('aria-selected')).toBe('true')
    expect(tasteTab.getAttribute('aria-selected')).toBe('false')
    // 香りが左（DOM順で先）
    expect(aromaTab.compareDocumentPosition(tasteTab) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    // 初期表示は香りの第1階層（大分類）。渋味ゲージは味モード側にだけ出る
    expect(container.querySelector('svg.wheel')).toBeTruthy()
    expect(screen.getByLabelText(/花系を開く/)).toBeTruthy()
    expect(container.querySelector('.astringency-gauge')).toBeNull()
    // 味に切り替えると味の第1階層（基本味）と渋味ゲージが出る
    fireEvent.click(tasteTab)
    expect(tasteTab.getAttribute('aria-selected')).toBe('true')
    expect(screen.getAllByLabelText(/甘味を開く|苦味を開く/).length).toBeGreaterThan(0)
    expect(container.querySelector('.astringency-gauge')).toBeTruthy()
    // 香りに戻れる
    fireEvent.click(aromaTab)
    expect(aromaTab.getAttribute('aria-selected')).toBe('true')
  })

  // 第37弾（実機FB）: 対象を切り替えても（resetKey 変更）、ユーザーが選んだ
  // モードは保持される。既定の香りに戻るのは、パネルが作り直される時
  // （画面側のリセットボタン等）だけ。この保持仕様は第46弾でも不変。
  it('対象を切り替える（resetKey 変更）でも、選んだモード（味）は保持される', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const b = analyzeTeaCombo({ kindId: 'black', regionId: '', cultivarId: '' })
    const { rerender } = render(<ComboWheelPanel notes={a.notes} tastes={a.tastes} context={a.context} resetKey={a.title} />)
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    expect(screen.getByRole('tab', { name: '味' }).getAttribute('aria-selected')).toBe('true')
    rerender(<ComboWheelPanel notes={b.notes} tastes={b.tastes} context={b.context} resetKey={b.title} />)
    expect(screen.getByRole('tab', { name: '味' }).getAttribute('aria-selected')).toBe('true')
    expect(screen.getByRole('tab', { name: '香り' }).getAttribute('aria-selected')).toBe('false')
  })
})
