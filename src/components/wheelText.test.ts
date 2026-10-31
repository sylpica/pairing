// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { createElement } from 'react'
import TieredWheel from './TieredWheel'
import ProfileWheelPanel from './ProfileWheelPanel'
import ComboWheelPanel from './ComboWheelPanel'
import { fitLabelLines, packScaledLines, textWidthAt, emWidthOf } from './wheelText'
import { compounds } from '../data/compounds'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import { analyzeTeaCombo, analyzeChocoCombo } from '../engine/combo'

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

// 第36弾: 第29弾の監査漏れの再発防止。旧監査は (a) 幅モデルの単体関数テストと
// (b) テキストの全文が存在するかの確認だけで、ラベル行が「その行の高さに
// おけるホイールの円盤の横幅」からはみ出すケースを測っていなかった。
// そのため烘青緑茶のうま味セグメントの併記（viewBox 内には収まるが、
// 円盤の輪郭を16px横切って末尾が途切れて見えた）が漏れた。
// ここでは実際のパネルを描画し、全ての SVG テキストについて「…」省略が
// 無いこと、viewBox 内に収まること、および行の中心の高さでの円盤の横幅に
// 収まることを、x/y 属性とフォントサイズから幾何学的に検証する（恒常テスト）。
describe('ホイールラベルの収納（第36弾・実パネル全数）', () => {
  const DISC_R = 138
  const expectWheelTextsFit = (container: HTMLElement, where: string) => {
    const texts = [...container.querySelectorAll('svg.wheel text')]
    expect(texts.length, `${where}: テキストなし`).toBeGreaterThan(0)
    for (const t of texts) {
      const text = t.textContent ?? ''
      expect(text.includes('…'), `${where}: 省略されたラベル「${text}」`).toBe(false)
      const x = parseFloat(t.getAttribute('x') ?? '150')
      const y = parseFloat(t.getAttribute('y') ?? '150')
      const fs = parseFloat((t as HTMLElement).style.fontSize || (t.getAttribute('class') === 'wheel-center' ? '15' : '12'))
      const w = textWidthAt(text, fs)
      const h = fs * 1.35
      // 全行: viewBox（300×300）の内側に収まること
      expect(x - w / 2, `${where}: 「${text}」が左端外`).toBeGreaterThanOrEqual(-0.5)
      expect(x + w / 2, `${where}: 「${text}」が右端外`).toBeLessThanOrEqual(300.5)
      expect(y - h / 2, `${where}: 「${text}」が上端外`).toBeGreaterThanOrEqual(-0.5)
      expect(y + h / 2, `${where}: 「${text}」が下端外`).toBeLessThanOrEqual(300.5)
      // 全行: その行の高さにおける円盤の横幅に収まること（ユーザー指摘の再発防止）
      const cross = Math.sqrt(Math.max(DISC_R * DISC_R - (y - 150) * (y - 150), 0))
      const extent = Math.abs(x - 150) + w / 2
      expect(extent, `${where}: 「${text}」が円盤の輪郭外 (extent=${extent.toFixed(1)} > ${cross.toFixed(1)})`).toBeLessThanOrEqual(cross + 0.5)
    }
  }

  it('再現ケース：烘青緑茶の味ホイール（修正前はうま味の併記が円盤外にはみ出していた）', () => {
    const item = teaItems.find((t) => t.id === 'green-baked')!
    const { container } = render(createElement(ProfileWheelPanel, {
      profile: item.profile,
      context: { side: 'tea', kindId: item.kindId, itemName: item.name, itemId: item.id },
    }))
    expectWheelTextsFit(container, '烘青緑茶・味第1階層')
    // うま味セグメントの併記に化合物名は無く、具体名（だし）だけが出る
    const subs = [...container.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')
    expect(subs).not.toContain('コハク酸')
    expect(subs).not.toContain('カテキン')
    expect(subs).toContain('だし')
    // 各味の第2階層と、渋味ゲージの先の化合物ホイールも円盤内に収まる
    for (const name of [/甘味を開く/, /苦味（/, /うま味を開く/]) {
      fireEvent.click(screen.getByLabelText(name))
      if (container.querySelectorAll('svg g.wheel-seg').length > 0) expectWheelTextsFit(container, `烘青緑茶・${name}`)
      fireEvent.click(screen.getByRole('button', { name: '← 味に戻る' }))
    }
    fireEvent.click(container.querySelector('.astringency-gauge')!)
    expectWheelTextsFit(container, '烘青緑茶・渋味ゲージ先')
    cleanup()
  })

  it('全アイテムの味ホイール（第1階層＋渋味ゲージ先）が円盤内に収まる', () => {
    const cases = [
      ...teaItems.map((t) => ({ name: t.name, profile: t.profile, context: { side: 'tea' as const, kindId: t.kindId, itemName: t.name, itemId: t.id } })),
      ...chocolateItems.map((c) => ({ name: c.name, profile: c.profile, context: { side: 'chocolate' as const, kindId: c.kind, itemName: c.name, itemId: c.id } })),
    ]
    for (const item of cases) {
      const { container } = render(createElement(ProfileWheelPanel, { profile: item.profile, context: item.context }))
      if (container.querySelector('svg.wheel')) expectWheelTextsFit(container, `${item.name}・味第1階層`)
      const gauge = container.querySelector('.astringency-gauge')
      if (gauge) {
        fireEvent.click(gauge)
        if (container.querySelector('svg.wheel')) expectWheelTextsFit(container, `${item.name}・渋味ゲージ先`)
      }
      cleanup()
    }
  })

  it('代表的な組み合わせの味・香りホイールが円盤内に収まる', () => {
    const analyses = [
      analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' }),
      analyzeTeaCombo({ kindId: 'black', regionId: 'shizuoka', cultivarId: 'benifuuki' }),
      analyzeChocoCombo({ kind: 'dark', originId: 'ghana', lineage: null }),
      analyzeChocoCombo({ kind: 'milk', originId: 'madagascar', lineage: { layer: 'traditional', id: 'trad-criollo' } }),
    ]
    for (const a of analyses) {
      const { container } = render(createElement(ComboWheelPanel, { notes: a.notes, tastes: a.tastes, context: a.context, resetKey: a.title }))
      expectWheelTextsFit(container, `${a.title}・味第1階層`)
      fireEvent.click(screen.getByRole('tab', { name: '香り' }))
      expectWheelTextsFit(container, `${a.title}・香り第1階層`)
      cleanup()
    }
  })
})
