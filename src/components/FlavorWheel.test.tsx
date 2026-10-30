// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import FlavorWheel from './FlavorWheel'
import { emptyTastes, emptyTemporal, type FlavorProfile, type ProfileEntry } from '../types'
import { teaItems } from '../data/teas'
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

  it('小さいセグメントでは、関連化合物があっても化合物名を描画しない（閾値）', () => {
    // 焙煎系の中でトーストだけ弱く、他を強くするとトーストのセグメント角度が閾値未満になる
    const p = prof([e('toast', 'weak'), e('coffee', 'strong'), e('caramelized', 'strong'), e('smoky', 'strong'), e('malt', 'strong')])
    render(<FlavorWheel profile={p} context={GREEN_CTX} onSelectNote={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: '焙煎系を開く' }))
    expect(screen.getByText('トースト')).toBeTruthy()
    expect(screen.queryByText(/ジエチル/)).toBeNull()
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
    render(<FlavorWheel profile={prof([...vegetal, ...fruit, ...roasted, ...floral])} onSelectNote={() => {}} />)
    // 植物系セグメントは角度が小さく、細分類名が2行に入りきらず「ほか」になる
    expect(screen.getByText('ハーブ ほか')).toBeTruthy()
  })
})
