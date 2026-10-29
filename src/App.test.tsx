// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from './App'

describe('画面の基本動作（§16相当のローカル検証）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })
  it('ホームに3機能のカードが出る', () => {
    render(<App />)
    expect(screen.getByText('お茶を調べる')).toBeTruthy()
    expect(screen.getByText('チョコを調べる')).toBeTruthy()
    expect(screen.getAllByText('組み合わせる').length).toBeGreaterThan(0)
  })
  it('お茶一覧で空の検索結果を適切に表示する', () => {
    location.hash = '#/tea'; render(<App />)
    fireEvent.change(screen.getByLabelText('お茶を検索'), { target: { value: '存在しないお茶xyz' } })
    expect(screen.getByText(/見つかりませんでした/)).toBeTruthy()
  })
  it('存在しないお茶の詳細は未収録と表示する', () => {
    location.hash = '#/tea/no-such-tea'; render(<App />)
    expect(screen.getByText(/収録されていません/)).toBeTruthy()
  })
  it('ミルクチョコ詳細ではホイールと出典が表示される', () => {
    location.hash = '#/choco/milk-chocolate'; render(<App />)
    expect(screen.getByLabelText('フレーバーホイール')).toBeTruthy()
    expect(screen.getAllByText(/Schnermann/).length).toBeGreaterThan(0)
  })
  it('ホワイトチョコ詳細ではモデル系の注意書きが表示される', () => {
    location.hash = '#/choco/white-chocolate'; render(<App />)
    expect(screen.getByLabelText('フレーバーホイール')).toBeTruthy()
    expect(screen.getAllByText(/モデル/).length).toBeGreaterThan(0)
  })
  it('煎茶の詳細が出典つきで表示される', () => {
    location.hash = '#/tea/sencha'; render(<App />)
    expect(screen.getByLabelText('フレーバーホイール')).toBeTruthy()
    expect(screen.getAllByText(/Tan/).length).toBeGreaterThan(0)
  })
  it('鳳凰単叢では余韻（カップアロマ）が表示される', () => {
    location.hash = '#/tea/fenghuang-dancong'; render(<App />)
    expect(screen.getAllByText(/カップアロマ/).length).toBeGreaterThan(0)
  })
  it('お茶詳細でホイールと出典リンクが出る', () => {
    location.hash = '#/tea/black-tea'; render(<App />)
    expect(screen.getByLabelText('フレーバーホイール')).toBeTruthy()
    expect(screen.getAllByText(/Zeng/).length).toBeGreaterThan(0)
  })
})
