// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import ComboWheel from './ComboWheel'
import { analyzeTeaCombo, analyzeChocoCombo, TEA_COMBO_KINDS, CHOCO_COMBO_KINDS, type ComboAnalysis } from '../engine/combo'
import { noteById } from '../data/flavors'
import { compoundsForNote, compoundTier } from '../data/compounds'
import { teaRegions } from '../data/teaRegions'
import { cacaoOrigins } from '../data/origins'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones } from '../data/cacao'
import type { ComboNote } from '../types'

/** セグメント（g.wheel-seg）の一覧 */
const segs = (container: HTMLElement) => [...container.querySelectorAll('svg g.wheel-seg')]
const labelTexts = (g: Element) => [...g.querySelectorAll('.wheel-label')].map((t) => t.textContent ?? '')
const labelFontSizes = (g: Element) => [...g.querySelectorAll('.wheel-label')].map((t) => parseFloat((t as HTMLElement).style.fontSize || '12'))

/**
 * ラベルがノート名を表示していることの判定：分割された場合は連結して一致、
 * 省略された場合は「先頭＋…」の形で名前の接頭辞になっていること。
 */
function labelShowsName(g: Element, name: string): boolean {
  const joined = labelTexts(g).join('')
  if (joined === name) return true
  return joined.endsWith('…') && name.startsWith(joined.slice(0, -1)) && joined.length >= 2
}

function expectNoBlankSegments(container: HTMLElement, analysis: ComboAnalysis) {
  const expected = analysis.notes.filter((n) => n.intensity !== 'unknown' && noteById(n.noteId))
  const groups = segs(container)
  expect(groups.length).toBe(expected.length)
  for (const g of groups) {
    const aria = g.getAttribute('aria-label') ?? ''
    const note = expected.find((n) => aria.startsWith(`${noteById(n.noteId)!.name}（`))
    expect(note, `aria-label に対応するノートが見つからない: ${aria}`).toBeTruthy()
    // 全セグメントにラベル（ノート名）があること
    expect(labelTexts(g).length).toBeGreaterThan(0)
    expect(labelShowsName(g, noteById(note!.noteId)!.name)).toBe(true)
    // フォントは下限 7px 以上であること
    for (const fs of labelFontSizes(g)) expect(fs).toBeGreaterThanOrEqual(7)
  }
}

describe('ComboWheel 全セグメントへのラベル表示（第6弾）', () => {
  beforeEach(() => { cleanup() })

  it('ユーザー実例：マダガスカル × クリオロ × ダークで、細い推測セグメントにも全てラベルが付く', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: 'madagascar', lineage: { layer: 'traditional', id: 'trad-criollo' } })
    const { container } = render(<ComboWheel notes={a.notes} onSelectNote={() => {}} context={a.context} />)
    expectNoBlankSegments(container, a)
    // 11ノート全ての名前が（この実例では省略なしに）表示される
    const allLabelText = segs(container).flatMap((g) => labelTexts(g)).join('|')
    for (const n of a.notes) expect(allLabelText).toContain(noteById(n.noteId)!.name)
    // フォント縮小が効いている（弱いノートのラベルに 12px 未満がある）
    const sizes = segs(container).flatMap((g) => labelFontSizes(g))
    expect(Math.min(...sizes)).toBeLessThan(12)
    // 化合物の裏付けがあるノートには、細いセグメントでもサブラベルが付く（麦芽＝3-メチルブタナール系）
    const maltSeg = segs(container).find((g) => (g.getAttribute('aria-label') ?? '').startsWith('麦芽（'))
    expect(maltSeg).toBeTruthy()
    const maltSubs = [...maltSeg!.querySelectorAll('.wheel-sub')].map((t) => t.textContent ?? '')
    expect(maltSubs.length).toBeGreaterThan(0)
    expect(maltSubs.join('')).toContain('3-メチル')
  })

  it('裏付けのある化合物は細いセグメントでも先頭1件が乗り、裏付けのないノートには付かない', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: 'madagascar', lineage: { layer: 'traditional', id: 'trad-criollo' } })
    const { container } = render(<ComboWheel notes={a.notes} onSelectNote={() => {}} context={a.context} />)
    for (const g of segs(container)) {
      const aria = g.getAttribute('aria-label') ?? ''
      const note = a.notes.find((n) => aria.startsWith(`${noteById(n.noteId)!.name}（`))!
      const backed = compoundsForNote(note.noteId)
        .map((c) => ({ c, tier: compoundTier(c, a.context) })).filter((x) => x.tier <= 2)
      const subs = [...g.querySelectorAll('.wheel-sub')].map((t) => t.textContent ?? '')
      if (backed.length > 0) {
        expect(subs.length, `${noteById(note.noteId)!.name} には化合物の併記があるはず`).toBeGreaterThan(0)
        // 表示されている化合物名は裏付けのある化合物の接頭辞である（省略されていても先頭は出る）
        const token = subs.flatMap((s) => s.replace(/ ほか$/, '').split('・'))[0].replace(/…$/, '')
        expect(token.length).toBeGreaterThan(0)
        expect(backed.some((b) => b.c.name.startsWith(token))).toBe(true)
      } else {
        expect(subs.length).toBe(0)
      }
    }
  })

  it('合成フィクスチャ：弱い推測ノートが14個並んでも、無地セグメントが残らない', () => {
    const ids = ['cacao', 'toast', 'caramel', 'hazelnut', 'nut-general', 'almond', 'wood', 'brown-sugar', 'malt', 'white-flower', 'cinnamon', 'green-leaf', 'citrus', 'rose']
    const notes: ComboNote[] = ids.map((noteId) => ({ noteId, intensity: 'weak', level: 'inferred', basis: [], sourceIds: [] }))
    const { container } = render(<ComboWheel notes={notes} onSelectNote={() => {}} />)
    const groups = segs(container)
    expect(groups.length).toBe(ids.length)
    for (const g of groups) {
      expect(labelTexts(g).length).toBeGreaterThan(0)
      const aria = g.getAttribute('aria-label') ?? ''
      const name = ids.map((id) => noteById(id)!.name).find((nm) => aria.startsWith(`${nm}（`))!
      expect(labelShowsName(g, name)).toBe(true)
      for (const fs of labelFontSizes(g)) expect(fs).toBeGreaterThanOrEqual(7)
    }
    // 長い名前は2行に割れている（例：ヘーゼルナッツ）
    const hazel = groups.find((g) => (g.getAttribute('aria-label') ?? '').startsWith('ヘーゼルナッツ（'))!
    expect(labelTexts(hazel).length).toBe(2)
    expect(labelTexts(hazel).join('')).toBe('ヘーゼルナッツ')
  })
})

describe('自己監査（第6弾）: 組み合わせホイールに無地セグメントが残らない', () => {
  beforeEach(() => { cleanup() })

  for (const kindId of TEA_COMBO_KINDS) {
    it(`お茶 ${kindId} × 全地域（＋指定なし）`, { timeout: 60000 }, () => {
      for (const regionId of ['', ...teaRegions.map((r) => r.id)]) {
        const a = analyzeTeaCombo({ kindId, regionId, cultivarId: '' })
        const { container } = render(<ComboWheel notes={a.notes} onSelectNote={() => {}} context={a.context} />)
        expectNoBlankSegments(container, a)
        cleanup()
      }
    })
  }

  it('チョコ 全種類 × 全産地', { timeout: 60000 }, () => {
    for (const kind of CHOCO_COMBO_KINDS) {
      for (const originId of ['', ...cacaoOrigins.map((o) => o.id)]) {
        const a = analyzeChocoCombo({ kind, originId, lineage: null })
        const { container } = render(<ComboWheel notes={a.notes} onSelectNote={() => {}} context={a.context} />)
        expectNoBlankSegments(container, a)
        cleanup()
      }
    }
  })

  it('チョコ ダーク × 全系統（伝統・遺伝・クローン）', { timeout: 60000 }, () => {
    const refs = [
      ...cacaoTraditionalGroups.map((g) => ({ layer: 'traditional' as const, id: g.id })),
      ...cacaoGeneticGroups.map((g) => ({ layer: 'genetic' as const, id: g.id })),
      ...cacaoClones.map((g) => ({ layer: 'clone' as const, id: g.id })),
    ]
    for (const lineage of refs) {
      const a = analyzeChocoCombo({ kind: 'dark', originId: '', lineage })
      const { container } = render(<ComboWheel notes={a.notes} onSelectNote={() => {}} context={a.context} />)
      expectNoBlankSegments(container, a)
      cleanup()
    }
  })
})
