// @vitest-environment jsdom
// 第43弾 恒常テスト: ホイール内テキストの「単位の途中改行」がゼロであることを、
// 全アイテム・代表組み合わせ・ペアリングを全階層ドリルして担保する。
// 検出方法はテキストベース: セグメント内の同クラス連続行を連結し、化合物名・
// 併記フレーズ・ノート名が「連結すると現れるが単一行には現れない」場合に
// 途中分割とみなす。ラベル（ノート名等）は意味境界（・の後／（の前／）の後／
// 、の後／空白）での分割のみ許容し、それ以外は違反。化合物名とフレーズは
// 原子扱い（内部の切断は全て違反）。併せて円盤の輪郭外へのはみ出しも数える。
// 導入時の実測（修正前）: 途中改行 482件（アイテム169／コンボ180／ペアリング
// 133）・幾何違反 7件 → 修正後はいずれも 0件。
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { createElement } from 'react'
import ProfileWheelPanel from './ProfileWheelPanel'
import ComboWheelPanel from './ComboWheelPanel'
import PairingWheelPanel from './PairingWheelPanel'
import { textWidthAt } from './wheelText'
import { compounds } from '../data/compounds'
import { flavorNotes, flavorCategories } from '../data/flavors'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import { analyzeTeaCombo, analyzeChocoCombo } from '../engine/combo'
import { assemblePairing } from '../engine/pairingCombo'

const ATOMIC_UNITS = [...compounds.map((c) => c.name), '成分データなし', '具体名の裏付けなし']
const LABEL_UNITS = [...flavorNotes.map((n) => n.name), ...flavorCategories.map((c) => c.name),
  '甘味', '酸味', '苦味', 'うま味', '渋味（収れん感）']

const isBoundaryCut = (u: string, pos: number) => {
  // pos = 切断位置（pos 文字の直後で割る）。意味の切れ目だけを許す
  if (pos <= 0 || pos >= u.length) return false
  const before = u[pos - 1]
  const after = u[pos]
  return before === '・' || before === '、' || before === '）' || before === ' ' || after === '（' || after === ' '
}

interface Violation { ctx: string; seg: string; unit: string; lines: string[]; kind: string }
const violations: Violation[] = []
const geomViolations: { ctx: string; text: string; extent: number; cross: number }[] = []

function checkGroup(ctx: string, seg: string, lines: string[], units: string[], atomic: boolean, kind: string) {
  for (let k = 2; k <= 3; k++) {
    for (let i = 0; i + k <= lines.length; i++) {
      const win = lines.slice(i, i + k)
      const joined = win.join('')
      for (const u of units) {
        if (u.length < 3) continue
        if (!joined.includes(u)) continue
        if (win.some((l) => l.includes(u))) continue
        // 切断位置を特定する
        const start = joined.indexOf(u)
        let acc = 0
        let bad = false
        for (let j = 0; j < k - 1; j++) {
          acc += win[j].length
          const cutInU = acc - start
          if (cutInU > 0 && cutInU < u.length && (atomic || !isBoundaryCut(u, cutInU))) bad = true
        }
        if (bad) violations.push({ ctx, seg, unit: u, lines: win, kind })
      }
    }
  }
}

function auditState(container: HTMLElement, ctx: string) {
  const segs = [...container.querySelectorAll('svg.wheel g.wheel-seg')]
  for (const g of segs) {
    const aria = g.getAttribute('aria-label') ?? ''
    const texts = [...g.querySelectorAll('text')].map((t) => ({
      cls: t.getAttribute('class') ?? '',
      text: t.textContent ?? '',
      x: parseFloat(t.getAttribute('x') ?? '150'),
      y: parseFloat(t.getAttribute('y') ?? '150'),
      fs: parseFloat((t as unknown as HTMLElement).style.fontSize || '12'),
    }))
    const byCls = new Map<string, string[]>()
    for (const t of texts) {
      const arr = byCls.get(t.cls) ?? []
      arr.push(t.text)
      byCls.set(t.cls, arr)
      // 幾何: 円盤の輪郭内に収まるか
      const w = textWidthAt(t.text, t.fs)
      const cross = Math.sqrt(Math.max(138 * 138 - (t.y - 150) * (t.y - 150), 0))
      const extent = Math.abs(t.x - 150) + w / 2
      if (extent > cross + 0.5) geomViolations.push({ ctx, text: t.text, extent, cross })
      if (t.text.includes('…')) violations.push({ ctx, seg: aria, unit: t.text, lines: [t.text], kind: 'ellipsis' })
    }
    checkGroup(ctx, aria, byCls.get('wheel-sub') ?? [], ATOMIC_UNITS, true, 'sub-atomic')
    checkGroup(ctx, aria, byCls.get('wheel-label') ?? [], [...ATOMIC_UNITS, ...LABEL_UNITS], false, 'label')
  }
}

const BACK_LABELS = ['← 大分類に戻る', '← 中分類に戻る', '← 味に戻る']
function signature(container: HTMLElement) {
  const crumb = container.querySelector('.wheel-crumb')?.textContent ?? ''
  const arias = [...container.querySelectorAll('svg.wheel g.wheel-seg')].map((g) => g.getAttribute('aria-label') ?? '').join('|')
  return crumb + '::' + arias
}
function findBack(container: HTMLElement) {
  for (const name of BACK_LABELS) {
    const b = [...container.querySelectorAll('button')].find((x) => x.textContent === name)
    if (b) return b as HTMLElement
  }
  return null
}
function visitWheel(container: HTMLElement, ctx: string, depth: number) {
  auditState(container, ctx)
  if (depth >= 2) return
  const arias = [...container.querySelectorAll('svg.wheel g.wheel-seg')].map((g) => g.getAttribute('aria-label') ?? '')
  for (const aria of arias) {
    const g = [...container.querySelectorAll('svg.wheel g.wheel-seg')].find((x) => x.getAttribute('aria-label') === aria)
    if (!g) continue
    const before = signature(container)
    fireEvent.click(g)
    if (signature(container) !== before && container.querySelector('svg.wheel')) {
      visitWheel(container, `${ctx} > ${aria}`, depth + 1)
      const back = findBack(container)
      if (back) fireEvent.click(back)
    }
  }
}
function drillPanel(container: HTMLElement, ctx: string) {
  // 味モード（既定）: ゲージ先 → 各階層
  const gauge = container.querySelector('.astringency-gauge')
  if (gauge) {
    fireEvent.click(gauge)
    if (container.querySelector('svg.wheel')) {
      visitWheel(container, `${ctx} 渋味ゲージ先`, 1)
      const back = findBack(container)
      if (back) fireEvent.click(back)
    }
  }
  if (container.querySelector('svg.wheel')) visitWheel(container, `${ctx} 味`, 0)
  const aromaTab = screen.queryByRole('tab', { name: '香り' })
  if (aromaTab) {
    fireEvent.click(aromaTab)
    if (container.querySelector('svg.wheel')) visitWheel(container, `${ctx} 香り`, 0)
  }
}

describe('第43弾: 単位の途中改行ゼロ（全数ドリル）', () => {
  it('全アイテム', () => {
    const v0 = violations.length
    const g0 = geomViolations.length
    const cases = [
      ...teaItems.map((t) => ({ name: t.name, profile: t.profile, context: { side: 'tea' as const, kindId: t.kindId, itemName: t.name, itemId: t.id } })),
      ...chocolateItems.map((c) => ({ name: c.name, profile: c.profile, context: { side: 'chocolate' as const, kindId: c.kind, itemName: c.name, itemId: c.id } })),
    ]
    for (const item of cases) {
      const { container } = render(createElement(ProfileWheelPanel, { profile: item.profile, context: item.context }))
      drillPanel(container, `アイテム:${item.name}`)
      cleanup()
    }
    expect(violations.slice(v0), JSON.stringify(violations.slice(v0, 5))).toEqual([])
    expect(geomViolations.slice(g0), JSON.stringify(geomViolations.slice(g0, 5))).toEqual([])
  })

  it('代表組み合わせ', () => {
    const v0 = violations.length
    const g0 = geomViolations.length
    const teaSels = [
      { kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' },
      { kindId: 'green', regionId: 'shizuoka', cultivarId: 'kanayamidori' },
      { kindId: 'green', regionId: '', cultivarId: '' },
      { kindId: 'white', regionId: '', cultivarId: '' },
      { kindId: 'yellow', regionId: '', cultivarId: '' },
      { kindId: 'oolong', regionId: 'taiwan', cultivarId: 'jinxuan' },
      { kindId: 'oolong', regionId: '', cultivarId: '' },
      { kindId: 'black', regionId: 'shizuoka', cultivarId: 'benifuuki' },
      { kindId: 'black', regionId: 'india-darjeeling', cultivarId: '' },
      { kindId: 'dark', regionId: '', cultivarId: '' },
    ]
    const chocoSels = [
      { kind: 'dark', originId: 'ghana', lineage: null },
      { kind: 'dark', originId: 'ecuador', lineage: { layer: 'genetic', id: 'gen-criollo' } },
      { kind: 'dark', originId: 'madagascar', lineage: null },
      { kind: 'milk', originId: 'madagascar', lineage: { layer: 'traditional', id: 'trad-criollo' } },
      { kind: 'milk', originId: '', lineage: null },
      { kind: 'white', originId: '', lineage: null },
      { kind: 'ruby', originId: '', lineage: null },
      { kind: 'blond', originId: '', lineage: null },
    ]
    for (const sel of teaSels) {
      try {
        const a = analyzeTeaCombo(sel as never)
        const { container } = render(createElement(ComboWheelPanel, { notes: a.notes, tastes: a.tastes, context: a.context, resetKey: a.title }))
        drillPanel(container, `茶コンボ:${a.title}`)
        cleanup()
      } catch { /* 存在しない組み合わせはスキップ */ }
    }
    for (const sel of chocoSels) {
      try {
        const a = analyzeChocoCombo(sel as never)
        const { container } = render(createElement(ComboWheelPanel, { notes: a.notes, tastes: a.tastes, context: a.context, resetKey: a.title }))
        drillPanel(container, `チョココンボ:${a.title}`)
        cleanup()
      } catch { /* 存在しない組み合わせはスキップ */ }
    }
    expect(violations.slice(v0), JSON.stringify(violations.slice(v0, 5))).toEqual([])
    expect(geomViolations.slice(g0), JSON.stringify(geomViolations.slice(g0, 5))).toEqual([])
  })

  it('ペアリング', () => {
    const v0 = violations.length
    const g0 = geomViolations.length
    const tea = (id: string) => teaItems.find((t) => t.id === id)!
    const choco = (id: string) => chocolateItems.find((c) => c.id === id)!
    const pairs: [ReturnType<typeof assemblePairing>, string][] = []
    const add = (a: ReturnType<typeof assemblePairing>, label: string) => pairs.push([a, label])
    add(assemblePairing(tea('green-steamed'), choco('dark-roasted'), { kindId: 'green', regionId: '', cultivarId: 'kanayamidori' }, { kind: 'dark', originId: 'ecuador', lineage: { layer: 'genetic', id: 'gen-criollo' } }), 'スクショ近似')
    add(assemblePairing(tea('green-steamed'), choco('dark-roasted'), null, null), '煎茶xダーク焙煎')
    add(assemblePairing(tea('matcha'), choco('milk-chocolate'), null, null), '抹茶xミルク')
    add(assemblePairing(tea('black-tea'), choco('dark-100'), null, null), '紅茶x100%')
    add(assemblePairing(tea('oolong-tea'), choco('ruby-chocolate'), null, null), '烏龍xルビー')
    add(assemblePairing(tea('white-tea'), choco('white-chocolate'), null, null), '白茶xホワイト')
    add(assemblePairing(tea('hojicha'), choco('blond-chocolate'), null, null), 'ほうじ茶xブロンド')
    for (const [a, label] of pairs) {
      const { container } = render(createElement(PairingWheelPanel, { data: a.wheel, resetKey: label }))
      drillPanel(container, `ペア:${label}`)
      cleanup()
    }
    expect(violations.slice(v0), JSON.stringify(violations.slice(v0, 5))).toEqual([])
    expect(geomViolations.slice(g0), JSON.stringify(geomViolations.slice(g0, 5))).toEqual([])
  })
})
