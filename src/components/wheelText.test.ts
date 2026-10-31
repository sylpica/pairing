// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { createElement } from 'react'
import TieredWheel from './TieredWheel'
import { fitLabelLines, packScaledLines, textWidthAt, emWidthOf } from './wheelText'
import { compounds } from '../data/compounds'

// 第29弾: ホイール内ラベルの途切れ（左右端でのクリップと「…」省略）を
// 恒常的に防ぐためのテスト。端のセグメントでの最小 avail は、ラベル中心
// lx=46（r=104・左端）に対する 2*46-4 = 88 を基準にする。
const EDGE_AVAIL = 88

describe('ホイールラベルの途切れ防止（第29弾）', () => {
  it('全化合物名が、端のセグメントでも省略なしに収まる（fitLabelLines）', () => {
    for (const c of compounds) {
      const lines = fitLabelLines(c.name, EDGE_AVAIL)
      const joined = lines.map((l) => l.text).join('')
      expect(joined, `${c.name} が欠けた: ${joined}`).toBe(c.name)
      for (const l of lines) {
        expect(l.text.includes('…'), `${c.name} に省略記号`).toBe(false)
        expect(textWidthAt(l.text, l.fs), `${c.name} の行が avail 超過`).toBeLessThanOrEqual(EDGE_AVAIL)
        expect(l.fs).toBeGreaterThanOrEqual(7)
      }
    }
  })

  it('全化合物名が、狭いセグメント（avail=40）でも4行割りまでで省略なしに収まる', () => {
    for (const c of compounds) {
      const lines = fitLabelLines(c.name, 40)
      expect(lines.map((l) => l.text).join(''), `${c.name} が欠けた`).toBe(c.name)
      expect(lines.length).toBeLessThanOrEqual(4)
    }
  })

  it('サブラベルの詰め込みでも化学物質名を「…」で隠さない（packScaledLines）', () => {
    const names = compounds.map((c) => c.name).sort((a, b) => emWidthOf(b) - emWidthOf(a)).slice(0, 8)
    for (const avail of [EDGE_AVAIL, 60, 40]) {
      for (const maxLines of [1, 2]) {
        const lines = packScaledLines(names, avail, maxLines)
        expect(lines.length).toBeGreaterThan(0)
        for (const l of lines) {
          expect(l.text.includes('…'), `avail=${avail} で省略: ${l.text}`).toBe(false)
          expect(textWidthAt(l.text, l.fs), `avail=${avail} で幅超過: ${l.text}`).toBeLessThanOrEqual(avail)
        }
        // 先頭（最重要）の名前は全文がどこかに現れる
        const joined = lines.map((l) => l.text).join('')
        expect(joined.replace(/ ほか/g, '')).toContain(names[0])
      }
    }
  })

  it('ガーナのカカオ成分ホイール（左右端の長い成分名）が全文表示される', () => {
    const { container } = render(createElement(TieredWheel, {
      segments: [
        { key: 'a', label: '2,5-ジメチルピラジン', percent: 50, weight: 1, color: '#a87f4f', ariaLabel: '2,5-ジメチルピラジン（50%）', chip: '2,5-ジメチルピラジン 50%' },
        { key: 'b', label: '2-メチルブタナール', percent: 50, weight: 1, color: '#a87f4f', ariaLabel: '2-メチルブタナール（50%）', chip: '2-メチルブタナール 50%' },
      ],
      centerLabel: 'カカオ',
      ariaLabel: '成分ホイール',
      onSelect: () => {},
    }))
    const texts = [...container.querySelectorAll('svg text')].map((t) => t.textContent ?? '')
    expect(texts.join('')).toContain('2,5-ジメチルピラジン')
    expect(texts.join('')).toContain('2-メチルブタナール')
    expect(texts.some((t) => t.includes('…'))).toBe(false)
    cleanup()
  })
})
