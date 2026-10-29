// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('画面の基本動作（§16相当のローカル検証）', () => {
  beforeEach(() => { localStorage.clear(); location.hash = '#/' })
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
  it('データ不足のチョコ詳細では不明が明示される', () => {
    location.hash = '#/choco/milk-chocolate'; render(<App />)
    expect(screen.getAllByText(/情報不足/).length).toBeGreaterThan(0)
    expect(screen.getByText(/香味データが不足しているため、ホイールを表示できません/)).toBeTruthy()
  })
  it('お茶詳細でホイールと出典リンクが出る', () => {
    location.hash = '#/tea/black-tea'; render(<App />)
    expect(screen.getByLabelText('フレーバーホイール')).toBeTruthy()
    expect(screen.getAllByText(/Zeng/).length).toBeGreaterThan(0)
  })
})
