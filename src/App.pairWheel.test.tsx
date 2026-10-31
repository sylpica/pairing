// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from './App'

// 第26弾: 組み合わせる画面の結果先頭が、性格チップから3階層ホイールになったことの表示検証。
const segs = (root: HTMLElement) => [...root.querySelectorAll('svg g.wheel-seg')]
const segPercents = (root: HTMLElement) => segs(root)
  .map((g) => /（(\d+)%）/.exec(g.getAttribute('aria-label') ?? '')?.[1])
  .filter((x): x is string => x !== undefined)
  .map(Number)

describe('組み合わせ結果のホイール（第26弾）', () => {
  beforeEach(() => { localStorage.clear(); sessionStorage.clear(); location.hash = '#/pair' })
  afterEach(() => { cleanup() })

  it('要約の先頭に3階層ホイールがあり、旧・性格チップの並びは無い', () => {
    render(<App />)
    const summary = screen.getByLabelText('組み合わせの結果（要約）')
    const wheelBox = summary.querySelector('.pair-wheel')
    expect(wheelBox).toBeTruthy()
    expect(summary.firstElementChild).toBe(wheelBox)
    // ホイール本体（aria-label 付き）があり、大分類セグメントが描かれている
    expect(summary.querySelector('svg.wheel')).toBeTruthy()
    expect(segs(summary as unknown as HTMLElement).length).toBeGreaterThan(0)
    // 凡例ボックス内に「推測（未検証）」が集約されている（第19弾の原則）
    expect(summary.querySelector('.combo-legend')?.textContent ?? '').toContain('推測（未検証）')
    // 旧チップ表示（性格名のボタン列）は要約内に残っていない
    expect(summary.querySelector('.pair-character')).toBeNull()
    // ドリルダウン: 大分類を開くと中分類（具体名＋％、合計100）が出る
    const openBtn = screen.getAllByLabelText(/を開く（/)[0]
    fireEvent.click(openBtn)
    const pcts = segPercents(summary as unknown as HTMLElement)
    expect(pcts.length).toBeGreaterThan(0)
    expect(pcts.reduce((x, y) => x + y, 0)).toBe(100)
  })

  it('味タブに切り替えると味のホイールが出て、選択を変えると第1階層に戻る', () => {
    render(<App />)
    const summary = screen.getByLabelText('組み合わせの結果（要約）')
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    expect(summary.querySelector('svg.wheel')).toBeTruthy()
    expect(segs(summary as unknown as HTMLElement).length).toBeGreaterThan(0)
    // 香りに戻してドリルダウンした状態で選択を変えると、ホイールは第1階層にリセットされる
    fireEvent.click(screen.getByRole('tab', { name: '香り' }))
    fireEvent.click(screen.getAllByLabelText(/を開く（/)[0])
    expect(screen.getByRole('button', { name: '← 大分類に戻る' })).toBeTruthy()
    const teaSel = screen.getByLabelText('お茶') as HTMLSelectElement
    fireEvent.change(teaSel, { target: { value: 'black' } })
    expect(screen.queryByRole('button', { name: '← 大分類に戻る' })).toBeNull()
    expect(screen.getAllByLabelText(/を開く（/).length).toBeGreaterThan(0)
  })
})
