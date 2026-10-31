// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import ComboWheelPanel from './ComboWheelPanel'
import { analyzeChocoCombo, type ComboAnalysis } from '../engine/combo'

// 第37弾: 凡例チップの作法を味・香りで完全統一したことの構造テスト。
// ユーザー実機FB: 味ホイールの凡例チップが横幅いっぱいの行になり、
// 「（具体名なし）」が1文字ずつ縦に折れて表示が崩れた。
// 不変条件（テスト可能な形）:
//  1. ホイール本体の全チップは、ラベル（名前＋％）を .chip-label という
//     改行しない（white-space: nowrap）単位としてちょうど1つ持つ。
//  2. 根拠バッジ（.badge）はチップ本体の中には決して入らない。味の第1階層と
//     両モードの第2階層では、チップ直下の .wheel-chip-note に置かれる。
//  3. 第2階層の化合物の括弧併記は .chip-aux という別単位に入る。
//  4. CSS 側: .wheel-list .chip は flex-wrap: wrap（単位ごとに行を分ける）、
//     .wheel-list .badge は狭幅でも nowrap（バッジ自体を潰さない）。
const renderPanel = (a: ComboAnalysis) =>
  render(<ComboWheelPanel notes={a.notes} tastes={a.tastes} context={a.context} resetKey={a.title} />)

const wheelChips = (container: HTMLElement) =>
  [...container.querySelectorAll<HTMLElement>('.wheel-wrap .wheel-list .chip')]

function expectChipStructure(container: HTMLElement, { badgeBelow }: { badgeBelow: boolean }) {
  const chips = wheelChips(container)
  expect(chips.length).toBeGreaterThan(0)
  for (const chip of chips) {
    const labels = chip.querySelectorAll('.chip-label')
    expect(labels.length, `chip-label が1つでない: ${chip.textContent}`).toBe(1)
    expect(labels[0].textContent ?? '').toMatch(/\d+%/)
    // バッジはチップ本体に入らない
    expect(chip.querySelector('.badge'), `バッジがチップ内にある: ${chip.textContent}`).toBeNull()
    // ラベルの中にブロック要素やバッジ等の付随要素が混ざらない
    expect(labels[0].querySelector('.badge')).toBeNull()
    if (badgeBelow) {
      const note = chip.closest('li')?.querySelector('.wheel-chip-note')
      expect(note, `チップ直下の付随要素が無い: ${chip.textContent}`).toBeTruthy()
      expect(note!.querySelector('.badge')).toBeTruthy()
    }
  }
  return chips
}

describe('凡例チップの統一構造（第37弾）', () => {
  beforeEach(() => { cleanup() })

  it('味・第1階層: チップは「味の名前＋％」だけ。強さと根拠バッジはチップ直下に出る（再現ケース: ルビー）', () => {
    const a = analyzeChocoCombo({ kind: 'ruby', originId: 'dominican-republic', lineage: { layer: 'genetic', id: 'gen-maranon' } })
    const { container } = renderPanel(a)
    const chips = expectChipStructure(container, { badgeBelow: true })
    const texts = chips.map((c) => c.querySelector('.chip-label')!.textContent ?? '')
    // 甘味は具体名がある（›）、という形まで含めて香りと同じ作法
    expect(texts.some((t) => /^甘味 \d+% ›$/.test(t))).toBe(true)
    expect(texts.some((t) => /^酸味 \d+% ›$/.test(t))).toBe(true)
    // チップ本体に「（具体名なし）」以外の長い注記や強さ・バッジ文言が入らない
    for (const chip of chips) {
      expect(chip.textContent ?? '').not.toContain('実測・官能評価に基づく')
      expect(chip.textContent ?? '').not.toContain('推測（未検証）')
    }
  })

  it('味・第1階層: 具体名が無い味は「（具体名なし）」までがラベルの1単位になる', () => {
    const a = analyzeChocoCombo({ kind: 'ruby', originId: '', lineage: null })
    const { container } = renderPanel(a)
    const chips = expectChipStructure(container, { badgeBelow: true })
    const texts = chips.map((c) => c.querySelector('.chip-label')!.textContent ?? '')
    expect(texts.some((t) => /^甘味 \d+%（具体名なし）$/.test(t))).toBe(true)
  })

  it('味・第2階層: 化合物の括弧併記は .chip-aux、バッジはチップ直下（香り第2階層と同じ作法）', () => {
    const a = analyzeChocoCombo({ kind: 'ruby', originId: 'dominican-republic', lineage: { layer: 'genetic', id: 'gen-maranon' } })
    const { container } = renderPanel(a)
    fireEvent.click(screen.getByLabelText(/酸味を開く/))
    const chips = expectChipStructure(container, { badgeBelow: true })
    expect(chips.some((c) => c.querySelector('.chip-aux'))).toBe(true)
    for (const chip of chips) {
      const aux = chip.querySelector('.chip-aux')
      if (aux) expect(aux.textContent ?? '').toMatch(/^（.+）$/)
    }
  })

  it('香り・第1階層: チップは「分類名＋％＋記号」だけのピルで、付随要素を持たない（味と同じ作法）', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: '', lineage: null })
    const { container } = renderPanel(a)
    fireEvent.click(screen.getByRole('tab', { name: '香り' }))
    const chips = expectChipStructure(container, { badgeBelow: false })
    for (const chip of chips) {
      expect(chip.closest('li')?.querySelector('.wheel-chip-note')).toBeNull()
      const t = chip.querySelector('.chip-label')!.textContent ?? ''
      expect(/^\S+ \d+% ›$/.test(t) || /^\S+ \d+%（中分類なし）$/.test(t), t).toBe(true)
    }
  })

  it('香り・第2階層: 味・第2階層と完全に同じ構造（ラベル＋括弧併記＋直下バッジ）', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: '', lineage: null })
    const { container } = renderPanel(a)
    fireEvent.click(screen.getByRole('tab', { name: '香り' }))
    const catChip = wheelChips(container).find((c) => (c.querySelector('.chip-label')!.textContent ?? '').includes('›'))
    expect(catChip).toBeTruthy()
    fireEvent.click(catChip!)
    const chips = expectChipStructure(container, { badgeBelow: true })
    expect(chips.length).toBeGreaterThan(0)
  })

  it('第3階層（化学物質）: チップは「成分名＋％」のラベルだけ', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: '', lineage: null })
    const { container } = renderPanel(a)
    fireEvent.click(screen.getByLabelText(/苦味を開く/))
    const entryChip = wheelChips(container)[0]
    fireEvent.click(entryChip)
    const chips = expectChipStructure(container, { badgeBelow: false })
    for (const chip of chips) {
      expect(chip.querySelector('.chip-label')!.textContent ?? '').toMatch(/ \d+%$/)
    }
  })

  it('CSS の不変条件: ラベルは nowrap、チップは単位ごとに折り返し、バッジは狭幅でも潰れない', () => {
    const css = readFileSync('src/App.css', 'utf-8')
    expect(css).toMatch(/\.chip-label\s*\{[^}]*white-space:\s*nowrap/)
    expect(css).toMatch(/\.wheel-list \.chip\s*\{[^}]*flex-wrap:\s*wrap/)
    expect(css).toMatch(/@media \(max-width: 400px\) \{ \.wheel-list \.badge \{ white-space: nowrap; \} \}/)
    expect(css).toMatch(/\.wheel-chip-note\s*\{/)
  })
})
