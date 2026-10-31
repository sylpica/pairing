// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import ComboWheelPanel from './ComboWheelPanel'
import ProfileWheelPanel from './ProfileWheelPanel'
import { analyzeTeaCombo } from '../engine/combo'
import { teaById } from '../data/teas'

// 第27弾: 描画されたホイールの全階層で、セグメントラベルと凡例チップに％があり、
// 同一ホイール内の％合計が100になること（表示レベルの検証）。
const segs = (root: HTMLElement) => [...root.querySelectorAll('svg g.wheel-seg')]
// ホイール本体のチップ一覧だけを対象にする（香り一覧インデックスのチップは含めない）
const chips = (root: HTMLElement) => [...root.querySelectorAll('.wheel-wrap .wheel-list .chip')]
const ariaPercents = (root: HTMLElement) => segs(root).map((g) => {
  const m = /(\d+)%/.exec(g.getAttribute('aria-label') ?? '')
  return m ? Number(m[1]) : null
})

function expectTierPercents(root: HTMLElement, label: string) {
  const groups = segs(root)
  expect(groups.length, label).toBeGreaterThan(0)
  const pcts = ariaPercents(root)
  for (const p of pcts) expect(p, `${label}: ％の無いセグメント`).not.toBeNull()
  expect(pcts.reduce((s: number, p) => s + (p ?? 0), 0), `${label}: 合計`).toBe(100)
  // 凡例チップ（ホイール横のボタンの一覧）にも％がある
  for (const c of chips(root)) expect(c.textContent ?? '', `${label}: チップ`).toMatch(/\d+%/)
  // 無地セグメント禁止・フォント下限（既存のラベル収納ルール）
  for (const g of groups) {
    const texts = [...g.querySelectorAll('.wheel-label, .wheel-sub')]
    expect(texts.map((t) => t.textContent ?? '').join('').length, `${label}: 無地`).toBeGreaterThan(0)
    for (const t of texts) expect(parseFloat((t as HTMLElement).style.fontSize || '12')).toBeGreaterThanOrEqual(7)
    // セグメント内テキストにも％行がある
    expect(texts.map((t) => t.textContent ?? '').join(''), `${label}: セグメント内％`).toMatch(/\d+%/)
  }
}

describe('ホイールの％表示（第27弾・表示検証）', () => {
  beforeEach(() => { cleanup() })

  it('組み合わせホイール: 香り3階層＋味3階層の全てに％がある', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const { container } = render(<ComboWheelPanel notes={a.notes} tastes={a.tastes} context={a.context} resetKey={a.title} />)
    const root = container as HTMLElement
    // 香り・第1階層
    expectTierPercents(root, '香り第1階層')
    // 香り・第2階層（花系）
    fireEvent.click(screen.getByLabelText(/花系を開く/))
    expectTierPercents(root, '香り第2階層')
    // 香り・第3階層（ジャスミン→化合物）
    fireEvent.click(screen.getByLabelText(/ジャスミン（\d+%）に寄与する化学物質を見る/))
    expectTierPercents(root, '香り第3階層')
    // 味・第1階層
    fireEvent.click(screen.getByRole('button', { name: '← 中分類に戻る' }))
    fireEvent.click(screen.getByRole('button', { name: '← 大分類に戻る' }))
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    expectTierPercents(root, '味第1階層')
    // 味・第2階層（基本味）
    fireEvent.click(screen.getByLabelText(/基本味を開く/))
    expectTierPercents(root, '味第2階層')
    // 味・第3階層（苦味→物質）
    fireEvent.click(screen.getByRole('button', { name: /^苦味（.+）に寄与する物質を見る$/ }))
    expectTierPercents(root, '味第3階層')
  })

  it('アイテム詳細ホイール（プロファイル）でも第1階層に％がある', () => {
    const item = teaById('sencha')!
    const { container } = render(<ProfileWheelPanel profile={item.profile} context={{ side: 'tea', kindId: item.kindId, itemName: item.name, itemId: item.id }} />)
    const root = container as HTMLElement
    expectTierPercents(root, 'アイテム香り第1階層')
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    expectTierPercents(root, 'アイテム味第1階層')
    fireEvent.click(screen.getByLabelText(/基本味を開く/))
    expectTierPercents(root, 'アイテム味第2階層')
  })
})
