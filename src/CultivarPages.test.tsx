// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from './App'

describe('品種・系統データベースの画面連携', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  it('図鑑に茶品種とカカオ3階層が出る', () => {
    location.hash = '#/cultivars'; render(<App />)
    expect(screen.getByText('やぶきた')).toBeTruthy()
    expect(screen.getByText(/フォラステロ/)).toBeTruthy()
    expect(screen.getByText('Nacional')).toBeTruthy()
    expect(screen.getByText('CCN-51')).toBeTruthy()
  })

  it('別名（ローマ字）で検索できる', () => {
    location.hash = '#/cultivars'; render(<App />)
    fireEvent.change(screen.getByLabelText('品種・系統を検索'), { target: { value: 'Yabukita' } })
    expect(screen.getByText('やぶきた')).toBeTruthy()
    expect(screen.queryByText('おくみどり')).toBeNull()
  })

  it('やぶきた詳細では確認済みの茶類と出典つき所見が出る', () => {
    location.hash = '#/cultivar/yabukita'; render(<App />)
    expect(screen.getByText(/ジャスミンラクトン/)).toBeTruthy()
    expect(screen.getAllByText(/緑茶/).length).toBeGreaterThan(0)
    expect(screen.getByText(/研究で供試された組み合わせ/)).toBeTruthy()
  })

  it('おくみどり詳細では科学データ未確認を明示し、ホイールを出さない', () => {
    location.hash = '#/cultivar/okumidori'; render(<App />)
    expect(screen.getAllByText(/科学データ未確認/).length).toBeGreaterThan(0)
    expect(screen.queryByLabelText('フレーバーホイール')).toBeNull()
  })

  it('伝統的分類のクリオロと遺伝集団の Criollo は別ページとして扱う', () => {
    location.hash = '#/cacao/traditional/trad-criollo'; render(<App />)
    expect(screen.getByText(/伝統的分類/)).toBeTruthy()
    cleanup()
    location.hash = '#/cacao/genetic/gen-criollo'; render(<App />)
    expect(screen.getAllByText(/遺伝集団/).length).toBeGreaterThan(0)
    expect(screen.getByText(/分類体系/)).toBeTruthy()
  })

  it('遺伝集団 Nacional では官能の所見が出典つきで出る', () => {
    location.hash = '#/cacao/genetic/gen-nacional'; render(<App />)
    expect(screen.getByText(/花のノート/)).toBeTruthy()
  })

  it('品種比較（同じ茶類）で やぶきた と おくみどり を別品種として並べられる', () => {
    location.hash = '#/compare-cultivars'; render(<App />)
    expect(screen.getAllByText('やぶきた').length).toBeGreaterThan(0)
    expect(screen.getAllByText('おくみどり').length).toBeGreaterThan(0)
    expect(screen.getByText(/所見：不明/)).toBeTruthy()
  })

  it('組み合わせ画面で品種を指定すると階層（実測）が表示される', () => {
    location.hash = '#/pair'; render(<App />)
    fireEvent.change(screen.getByLabelText('お茶の品種（任意）'), { target: { value: 'qingxin-oolong' } })
    expect(screen.getByText(/品種・系統の実測に基づく参考情報/)).toBeTruthy()
  })

  it('組み合わせ画面で香味データのない系統を指定すると「不使用」と表示される', () => {
    location.hash = '#/pair'; render(<App />)
    fireEvent.change(screen.getByLabelText('カカオの系統（任意）'), { target: { value: 'traditional:trad-forastero' } })
    expect(screen.getByText(/使えるデータがないため不使用/)).toBeTruthy()
    expect(screen.getAllByText(/未確認/).length).toBeGreaterThan(0)
  })
})
