// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import App from '../App'

describe('組み合わせページ（産地×品種×分類）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  it('長崎 × やぶきた × 緑茶：タイトル・凡例つきホイール・実測の産地所見が出る', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    expect(screen.getByText('長崎 × やぶきた × 緑茶')).toBeTruthy()
    expect(screen.getByLabelText(/組み合わせのフレーバーホイール/)).toBeTruthy()
    expect(screen.getByText(/凡例（濃さと輪郭＝根拠の確かさ）/)).toBeTruthy()
    // 産地の所見（辻村ら 2024 の品評会試料の分析）が根拠の内訳に出る
    expect(screen.getAllByText(/品評会/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/辻村/).length).toBeGreaterThan(0)
  })

  it('長崎 × やぶきた × 紅茶：推測として、酵素活性と渋味の穏やかさが出る', () => {
    location.hash = '#/combo/tea/black.nagasaki.yabukita'
    render(<App />)
    expect(screen.getByText('長崎 × やぶきた × 紅茶')).toBeTruthy()
    expect(screen.getAllByText(/酸化酵素活性/).length).toBeGreaterThan(0)
    expect(screen.getAllByText('推測（未検証）').length).toBeGreaterThan(0)
    // 長崎産そのものの実測が無いことの明示
    expect(screen.getAllByText(/長崎産の実測は確認できていません/).length).toBeGreaterThan(0)
  })

  it('プルダウン連動：長崎×やぶきたでは、品種に他国の品種が出ず、産地に中国が出ない', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    const cultivarSelect = screen.getByLabelText('組み合わせの品種') as HTMLSelectElement
    const cultivarTexts = [...cultivarSelect.options].map((o) => o.textContent ?? '')
    expect(cultivarTexts).toContain('やぶきた')
    expect(cultivarTexts).not.toContain('青心烏龍')
    const regionSelect = screen.getByLabelText('組み合わせの産地') as HTMLSelectElement
    const regionTexts = [...regionSelect.options].map((o) => o.textContent ?? '')
    expect(regionTexts).toContain('長崎（日本）')
    expect(regionTexts).not.toContain('中国')
  })

  it('分類プルダウンでは、やぶきたと両立しない茶類は選択できない（disabled）', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    const kindSelect = screen.getByLabelText('組み合わせの分類（茶類）') as HTMLSelectElement
    const byText = (t: string) => [...kindSelect.options].find((o) => o.textContent === t)
    expect(byText('緑茶')?.disabled).toBe(false)
    expect(byText('紅茶')?.disabled).toBe(false)
    expect(byText('黒茶')?.disabled).toBe(true)
    expect(byText('黄茶')?.disabled).toBe(true)
  })

  it('チョコ：既定でエクアドル × ナシオナル × ダークが出て、花様の推測が見える', () => {
    location.hash = '#/combo/choco'
    render(<App />)
    expect(screen.getByText('エクアドル × ナシオナル（Nacional） × ダークチョコレート')).toBeTruthy()
    expect(screen.getAllByText(/花様/).length).toBeGreaterThan(0)
  })

  it('兄弟の組み合わせへのリンクが出る（同じ品種・分類違い）', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    expect(screen.getByText('同じ品種・分類違い')).toBeTruthy()
    expect(screen.getByText('長崎 × やぶきた × 紅茶')).toBeTruthy()
  })
})
