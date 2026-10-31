// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import ComboWheelPanel from './ComboWheelPanel'
import PairingWheelPanel from './PairingWheelPanel'
import { analyzeChocoCombo, type ComboAnalysis } from '../engine/combo'
import { assemblePairing } from '../engine/pairingCombo'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'

// 第37弾: 凡例チップの作法を味・香りで統一したことの構造テスト。
// ユーザー実機FB: 味ホイールの凡例チップが横幅いっぱいの行になり、
// 「（具体名なし）」が1文字ずつ縦に折れて表示が崩れた。
// 第39弾: 味の第1階層を香りの第1階層と構造的に完全に同一にした
// （1セグメント＝1ピル、ピルの下に要素をぶら下げない。ユーザー実機FB）。
// 強さはピル内の括弧文言、推測（未検証）の印はピル自体の破線
// （.chip-inferred）で表す。
// 不変条件（テスト可能な形）:
//  1. ホイール本体の全チップは、ラベル（名前＋％）を .chip-label という
//     改行しない（white-space: nowrap）単位としてちょうど1つ持つ。
//  2. 根拠バッジ（.badge）はチップ本体の中には決して入らない。第2階層では
//     チップ直下の .wheel-chip-note に置かれる（味・香り共通）。
//     第1階層は味・香りとも直下の要素自体を持たない。
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

describe('凡例チップの統一構造（第37弾・第39弾）', () => {
  beforeEach(() => { cleanup() })

  it('味・第1階層: 香りの第1階層と完全に同じ作法（1ピルのみ・直下に何も無い）。強さはピル内の括弧文言（再現ケース: ルビー）', () => {
    const a = analyzeChocoCombo({ kind: 'ruby', originId: 'dominican-republic', lineage: { layer: 'genetic', id: 'gen-maranon' } })
    const { container } = renderPanel(a)
    const chips = expectChipStructure(container, { badgeBelow: false })
    const texts = chips.map((c) => c.querySelector('.chip-label')!.textContent ?? '')
    // 強さはピル内の括弧に入り、具体名がある味は › が付く（香りの括弧の置き場と同じ）
    expect(texts.some((t) => /^甘味 \d+%（(弱い|普通|強い)） ›$/.test(t))).toBe(true)
    expect(texts.some((t) => /^酸味 \d+%（(弱い|普通|強い)） ›$/.test(t))).toBe(true)
    // 直下の付随要素（.wheel-chip-note）は第1階層には存在しない
    for (const chip of chips) {
      expect(chip.closest('li')?.querySelector('.wheel-chip-note')).toBeNull()
      // 根拠レベルの文言はチップにも直下にも出ない（凡例とセグメントの濃さ・破線で保持）
      expect(chip.textContent ?? '').not.toContain('実測・官能評価に基づく')
      expect(chip.textContent ?? '').not.toContain('推測（未検証）')
    }
  })

  it('味・第1階層: 具体名が無い味は「（強さ・具体名なし）」までがラベルの1単位になる', () => {
    const a = analyzeChocoCombo({ kind: 'ruby', originId: '', lineage: null })
    const { container } = renderPanel(a)
    const chips = expectChipStructure(container, { badgeBelow: false })
    const texts = chips.map((c) => c.querySelector('.chip-label')!.textContent ?? '')
    expect(texts.some((t) => /^甘味 \d+%（(弱い|普通|強い)・具体名なし）$/.test(t))).toBe(true)
  })

  it('味・第1階層: 推測（未検証）の味はピル自体が破線になる（ペアリングは全味が推測）', () => {
    const teaItem = teaItems.find((t) => t.id === 'matcha')!
    const chocoItem = chocolateItems.find((c) => c.id === 'dark-roasted')!
    const pair = assemblePairing(teaItem, chocoItem, null, null)
    const { container } = render(<PairingWheelPanel data={pair.wheel} resetKey="matcha-dark" />)
    const chips = expectChipStructure(container, { badgeBelow: false })
    expect(chips.length).toBeGreaterThan(0)
    for (const chip of chips) {
      expect(chip.closest('li')?.querySelector('.wheel-chip-note')).toBeNull()
      expect(chip.classList.contains('chip-inferred'), `推測のピルが破線になっていない: ${chip.textContent}`).toBe(true)
    }
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
    // 第39弾: 推測の印はピル自体の破線で表す
    expect(css).toMatch(/\.wheel-list \.chip-inferred\s*\{[^}]*dashed/)
  })
})
