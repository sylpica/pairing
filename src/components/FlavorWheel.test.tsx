// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import FlavorWheel from './FlavorWheel'
import { emptyTastes, emptyTemporal, type FlavorProfile, type ProfileEntry } from '../types'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import type { CompoundContext } from '../data/compounds'

/** SVG内の <text> の内容だけを対象にする（下部チップと区別するため） */
const svgTexts = (container: HTMLElement) => [...container.querySelectorAll('svg text')].map((t) => t.textContent)
const e = (noteId: string, intensity: ProfileEntry['intensity']): ProfileEntry => ({ noteId, intensity, basis: 'general', sourceIds: [] })
const prof = (aromas: ProfileEntry[]): FlavorProfile => ({ aromas, tastes: emptyTastes(), temporal: emptyTemporal() })
const GREEN_CTX: CompoundContext = { side: 'tea', kindId: 'green', itemName: 'テスト緑茶' }

describe('FlavorWheel セグメント内テキスト表示', () => {
  beforeEach(() => { cleanup() })

  it('大分類セグメント内に細分類名が併記され、シェブロンが付く（釜炒り緑茶）', () => {
    const kamairi = teaItems.find((t) => t.id === 'green-pan-fired')!
    const { container } = render(<FlavorWheel profile={kamairi.profile} context={{ side: 'tea', kindId: kamairi.kindId, itemName: kamairi.name }} onSelectNote={() => {}} />)
    // 焙煎系セグメントのラベル（ドリルダウンを示す › つき）と、収録細分類「トースト」の併記
    expect(svgTexts(container)).toContain('焙煎系 ›')
    expect(svgTexts(container)).toContain('トースト')
  })

  it('細分類セグメント内に、そのアイテムに適用可能な関連化合物名が描画される（トースト→ピラジン類）', () => {
    const kamairi = teaItems.find((t) => t.id === 'green-pan-fired')!
    render(<FlavorWheel profile={kamairi.profile} context={{ side: 'tea', kindId: kamairi.kindId, itemName: kamairi.name }} onSelectNote={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: '焙煎系を開く' }))
    // 緑茶試料での研究例がある 2,3-ジエチル-5-メチルピラジン がセグメント内に出る
    expect(screen.getByText('2,3-ジエチル-5-メチルピラジン')).toBeTruthy()
    // チョコレート試料でのみ確認された化合物（tier 3）は、お茶のセグメント内には出ない
    expect(screen.queryByText('2,5-ジメチルピラジン')).toBeNull()
    expect(screen.queryByText('2-エチル-3,5-ジメチルピラジン')).toBeNull()
  })

  it('関連化合物がないノートでは、セグメント内に化合物名が描画されない', () => {
    const { container } = render(<FlavorWheel profile={prof([e('coffee', 'normal')])} context={GREEN_CTX} onSelectNote={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: '焙煎系を開く' }))
    expect(screen.getByText('コーヒー')).toBeTruthy()
    expect(screen.queryByText(/ピラジン|フラネオール|ヘキサナール/)).toBeNull()
    // SVG内のテキストはセグメントラベルと中心ラベルのみ（化合物の併記行なし）
    const texts = [...container.querySelectorAll('svg text')].map((t) => t.textContent)
    expect(texts).toEqual(['コーヒー', '焙煎系'])
  })

  it('小さいセグメントでも、関連化合物名をフォント縮小して描画する（第6弾：全表示優先。旧「閾値で出さない」仕様を変更）', () => {
    // 焙煎系の中でトーストだけ弱く、他を強くするとトーストのセグメント角度が小さくなる
    const p = prof([e('toast', 'weak'), e('coffee', 'strong'), e('caramelized', 'strong'), e('smoky', 'strong'), e('malt', 'strong')])
    const { container } = render(<FlavorWheel profile={p} context={GREEN_CTX} onSelectNote={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: '焙煎系を開く' }))
    expect(screen.getByText('トースト')).toBeTruthy()
    // 化合物名（2,3-ジエチル-5-メチルピラジン）は省略されても先頭がサブラベルとして出る
    const toastSeg = [...container.querySelectorAll('svg g.wheel-seg')]
      .find((g) => (g.getAttribute('aria-label') ?? '').startsWith('トースト'))!
    const subs = [...toastSeg.querySelectorAll('.wheel-sub')] as unknown as HTMLElement[]
    expect(subs.length).toBeGreaterThan(0)
    expect(subs[0].textContent).toContain('ジエチ')
    // 標準の10pxより小さいフォントに縮小されている
    expect(parseFloat(subs[0].style.fontSize)).toBeLessThan(10)
    expect(parseFloat(subs[0].style.fontSize)).toBeGreaterThanOrEqual(7)
  })

  it('長い大分類ラベルは「・」で2行に改行される（ナッツ・カカオ系）', () => {
    const kamairi = teaItems.find((t) => t.id === 'green-pan-fired')!
    const { container } = render(<FlavorWheel profile={kamairi.profile} context={{ side: 'tea', kindId: kamairi.kindId, itemName: kamairi.name }} onSelectNote={() => {}} />)
    // セグメント内ラベルが2行に分かれ、1行のままの要素は SVG 内に存在しない（チップ側は現行どおり1行表示）
    expect(svgTexts(container)).toContain('ナッツ・')
    expect(svgTexts(container)).toContain('カカオ系 ›')
    expect(svgTexts(container)).not.toContain('ナッツ・カカオ系 ›')
    // ラベルが2行に割れた場合も、細分類の併記は1行だけ残る
    expect(svgTexts(container)).toContain('栗')
  })

  it('細分類名が入りきらない大分類セグメントでは「ほか」が付く', () => {
    const vegetal: ProfileEntry[] = ['green-leaf', 'herb', 'seaweed', 'green-vegetable', 'hay', 'corn'].map((id) => e(id, 'weak'))
    const fruit: ProfileEntry[] = ['citrus', 'berry', 'stone-fruit', 'tropical', 'dried-fruit', 'fruit-general'].map((id) => e(id, 'strong'))
    const roasted: ProfileEntry[] = ['toast', 'coffee', 'caramelized', 'smoky', 'malt'].map((id) => e(id, 'strong'))
    const floral: ProfileEntry[] = ['white-flower', 'rose', 'orchid', 'dried-flower', 'floral-general'].map((id) => e(id, 'strong'))
    const { container } = render(<FlavorWheel profile={prof([...vegetal, ...fruit, ...roasted, ...floral])} onSelectNote={() => {}} />)
    // 植物系セグメントは角度が小さい。第6弾の全表示方針でフォントが縮小され、
    // 以前（「ハーブ ほか」）より多くの細分類名が乗り、入りきらない分は「ほか」になる
    const plantSeg = [...container.querySelectorAll('svg g.wheel-seg')]
      .find((g) => (g.getAttribute('aria-label') ?? '').startsWith('植物系'))!
    const subs = [...plantSeg.querySelectorAll('.wheel-sub')].map((t) => t.textContent ?? '')
    expect(subs.join(' ')).toContain('青草・若葉')
    expect(subs.join(' ')).toContain('ハーブ')
    expect(subs.some((s) => s.includes('ほか'))).toBe(true)
  })
})

describe('自己監査（第6弾）: 全アイテムのホイールに無地セグメントが残らない', () => {
  beforeEach(() => { cleanup() })

  const items: { name: string; profile: FlavorProfile }[] = [
    ...teaItems.map((t) => ({ name: t.name, profile: t.profile })),
    ...chocolateItems.map((c) => ({ name: c.name, profile: c.profile })),
  ]

  it('全アイテム：大分類セグメントにも細分類セグメントにも必ずラベルがある', { timeout: 120000 }, () => {
    for (const item of items) {
      // 大分類ビュー
      const first = render(<FlavorWheel profile={item.profile} onSelectNote={() => {}} />)
      const catSegs = [...first.container.querySelectorAll('svg g.wheel-seg')]
      expect(catSegs.length, `${item.name}: 大分類セグメントがあるはず`).toBeGreaterThan(0)
      const catLabels: string[] = []
      for (const g of catSegs) {
        const labels = [...g.querySelectorAll('.wheel-label')].map((t) => t.textContent ?? '')
        expect(labels.length, `${item.name}: 無地の大分類セグメント`).toBeGreaterThan(0)
        expect(labels.join('').length).toBeGreaterThan(0)
        catLabels.push((g.getAttribute('aria-label') ?? '').replace(/を開く$/, ''))
      }
      cleanup()
      // 各大分類をドリルダウンして細分類ビューを確認
      for (const catName of catLabels) {
        const { container } = render(<FlavorWheel profile={item.profile} onSelectNote={() => {}} />)
        fireEvent.click(screen.getByRole('button', { name: `${catName}を開く` }))
        const noteSegs = [...container.querySelectorAll('svg g.wheel-seg')]
        expect(noteSegs.length, `${item.name} / ${catName}: 細分類セグメントがあるはず`).toBeGreaterThan(0)
        for (const g of noteSegs) {
          const labels = [...g.querySelectorAll('.wheel-label')]
          expect(labels.length, `${item.name} / ${catName}: 無地の細分類セグメント`).toBeGreaterThan(0)
          for (const l of labels) {
            expect((l.textContent ?? '').length).toBeGreaterThan(0)
            expect(parseFloat((l as unknown as HTMLElement).style.fontSize || '12')).toBeGreaterThanOrEqual(7)
          }
        }
        cleanup()
      }
    }
  })
})
