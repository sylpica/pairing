// @vitest-environment jsdom
// 第44弾 恒常テスト: ホイール内テキストが全て「塗り層より手前」の最前面
// レイヤーに描かれることを固定する。
// 背景（ユーザー実機FB）: セグメントごとに path→text の順で描いていたため、
// 後から描かれる隣接セグメントの半透明の塗りが、先に描かれたテキストの
// はみ出し部分を上塗りし、「具体名の裏付けなし」の両端が隣のセグメントの
// 色に染まって薄く見えた。SVG は文書順に塗るため、「全ての path と中央の円
// より後に全てのラベルテキストが来る」ことが、上塗りされないことと等価。
// あわせて、テキストに opacity が付いていないこと（文字の濃さで根拠区分を
// 表さない）も固定する。
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { createElement } from 'react'
import ProfileWheelPanel from './ProfileWheelPanel'
import ComboWheelPanel from './ComboWheelPanel'
import PairingWheelPanel from './PairingWheelPanel'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import { analyzeTeaCombo, analyzeChocoCombo } from '../engine/combo'
import { assemblePairing } from '../engine/pairingCombo'

function expectTextsOnTop(container: HTMLElement, where: string) {
  const svgs = [...container.querySelectorAll('svg.wheel')]
  expect(svgs.length, `${where}: ホイールなし`).toBeGreaterThan(0)
  for (const svg of svgs) {
    const els = [...svg.querySelectorAll('path, circle, text')]
    const fillIdx = els.map((el, i) => (el.tagName === 'text' ? -1 : i))
    const lastFillIdx = Math.max(...fillIdx)
    const texts = els.filter((el) => el.tagName === 'text')
    expect(texts.length, `${where}: テキストなし`).toBeGreaterThan(0)
    for (const t of texts) {
      expect(els.indexOf(t), `${where}: 「${t.textContent}」が塗り層より後ろにある`).toBeGreaterThan(lastFillIdx)
      expect(t.getAttribute('opacity'), `${where}: 「${t.textContent}」に opacity が付いている`).toBeNull()
      expect(t.closest('g.wheel-texts'), `${where}: 「${t.textContent}」が最前面レイヤー外`).not.toBeNull()
    }
    // 塗りグループとラベルグループが data-seg で 1:1 に対応する
    const segKeys = [...svg.querySelectorAll('g.wheel-seg')].map((g) => g.getAttribute('data-seg'))
    const labelKeys = [...svg.querySelectorAll('g.wheel-seg-labels')].map((g) => g.getAttribute('data-seg'))
    expect(labelKeys, `${where}: ラベルグループの対応`).toEqual(segKeys)
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
  expectTextsOnTop(container, ctx)
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

describe('ホイール内テキストの最前面レイヤー（第44弾）', () => {
  beforeEach(() => { cleanup() })

  it('アイテムプロファイル: 全階層でテキストが塗りより手前', () => {
    const cases = [
      ...teaItems.map((t) => ({ id: t.id, profile: t.profile, context: { side: 'tea' as const, kindId: t.kindId, itemName: t.name, itemId: t.id } })),
      ...chocolateItems.map((c) => ({ id: c.id, profile: c.profile, context: { side: 'chocolate' as const, kindId: c.kind, itemName: c.name, itemId: c.id } })),
    ]
    for (const id of ['dark-unroasted', 'white-tea', 'ruby-chocolate']) {
      const item = cases.find((x) => x.id === id)!
      const { container } = render(createElement(ProfileWheelPanel, { profile: item.profile, context: item.context }))
      drillPanel(container, `アイテム:${id}`)
      cleanup()
    }
  })

  it('組み合わせ: 全階層でテキストが塗りより手前', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const { container } = render(createElement(ComboWheelPanel, { notes: a.notes, tastes: a.tastes, context: a.context, resetKey: a.title }))
    drillPanel(container, `コンボ:${a.title}`)
    cleanup()
    const b = analyzeChocoCombo({ kind: 'ruby', originId: '', lineage: null })
    const r2 = render(createElement(ComboWheelPanel, { notes: b.notes, tastes: b.tastes, context: b.context, resetKey: b.title }))
    drillPanel(r2.container, `コンボ:${b.title}`)
    cleanup()
  })

  it('ペアリング（ユーザー指摘の文脈）: 果実系7%＋裏付けなしでもテキストが塗りより手前', () => {
    const tea = teaItems.find((t) => t.id === 'green-pan-fired')!
    const choco = chocolateItems.find((c) => c.id === 'dark-roasted')!
    const asm = assemblePairing(tea, choco, { kindId: 'green', regionId: 'kagoshima', cultivarId: 'kanayamidori' }, null)
    const { container } = render(createElement(PairingWheelPanel, { data: asm.wheel, resetKey: 'r44-user-context' }))
    // 前提の固定: 香りモードで果実系（7%・中分類なし）セグメントと
    // 「具体名の裏付けなし」の併記が存在する（ユーザーのスクリーンショットの文脈）
    fireEvent.click(screen.getByRole('tab', { name: '香り' }))
    const arias2 = [...container.querySelectorAll('svg.wheel g.wheel-seg')].map((g) => g.getAttribute('aria-label') ?? '')
    expect(arias2.some((a) => a.startsWith('果実系（7%'))).toBe(true)
    const allText = [...container.querySelectorAll('svg.wheel text')].map((t) => t.textContent ?? '')
    expect(allText).toContain('具体名の裏付けなし')
    drillPanel(container, 'ペア:ユーザー文脈')
    cleanup()
  })

  it('ペアリング（その他）: 全階層でテキストが塗りより手前', () => {
    const tea = (id: string) => teaItems.find((t) => t.id === id)!
    const choco = (id: string) => chocolateItems.find((c) => c.id === id)!
    const pairs: [ReturnType<typeof assemblePairing>, string][] = [
      [assemblePairing(tea('matcha'), choco('milk-chocolate'), null, null), '抹茶xミルク'],
      [assemblePairing(tea('black-tea'), choco('dark-100'), null, null), '紅茶x100%'],
      [assemblePairing(tea('oolong-tea'), choco('ruby-chocolate'), null, null), '烏龍xルビー'],
    ]
    for (const [a, label] of pairs) {
      const { container } = render(createElement(PairingWheelPanel, { data: a.wheel, resetKey: label }))
      drillPanel(container, `ペア:${label}`)
      cleanup()
    }
  })
})
