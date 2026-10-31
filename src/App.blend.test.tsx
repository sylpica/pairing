// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react'
import App from './App'

// 第9弾（自家ブレンド対応）の画面検証。
// 両側の見出しボタンでお茶↔チョコを切り替えられ、お茶同士・チョコ同士でも
// 結果が組み立つこと、同種ペアでは直接研究がない旨の注記が出ること、
// 保存IDに種別が含まれ復元表示できることを確認する。
describe('組み合わせ画面：自家ブレンド（種別切り替え）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  const cols = () => document.querySelectorAll('.pair-col')
  const switchOf = (colIdx: number) => within(cols()[colIdx] as HTMLElement).getByRole('button', { name: /種類を切り替える/ })
  const summaryText = () => screen.getByLabelText('組み合わせの結果（要約）').textContent ?? ''

  it('既定は左チョコ・右お茶で、見出しが切り替えボタンになっている', () => {
    location.hash = '#/pair'; render(<App />)
    expect(cols().length).toBe(2)
    expect(switchOf(0).textContent).toContain('チョコレート')
    expect(switchOf(1).textContent).toContain('お茶')
    // 同種ペアではないため、同種ブレンドの注記は出ない
    expect(summaryText()).not.toContain('同士のブレンドを直接調べた')
  })

  it('左を見出しボタンでお茶に切り替えるとお茶同士になり、注記と区別つきラベル・タブが出る', () => {
    location.hash = '#/pair'; render(<App />)
    fireEvent.click(switchOf(0))
    // 両側ともお茶のプルダウンになり、左右でラベルが区別される
    expect(screen.getByLabelText('左：お茶')).toBeTruthy()
    expect(screen.getByLabelText('右：お茶')).toBeTruthy()
    expect(screen.queryByLabelText('チョコレート')).toBeNull()
    // 同種ブレンドの正直な注記が要約に出る
    expect(summaryText()).toContain('お茶同士のブレンドを直接調べた官能研究は確認できていない')
    expect(summaryText()).toContain('×')
    // タブはアイテム名で区別される（既定は両側とも烏龍茶）
    expect(screen.getAllByRole('tab', { name: '烏龍茶（青茶）' }).length).toBe(2)
    // 左を煎茶に変えるとタブと見出しが追随する
    fireEvent.change(screen.getByLabelText('左：お茶'), { target: { value: 'sencha' } })
    expect(screen.getByRole('tab', { name: '煎茶' })).toBeTruthy()
    expect(summaryText()).toContain('煎茶 × 烏龍茶（青茶）')
    // お茶タブ（煎茶側）を開くとホイールが出る
    fireEvent.click(screen.getByRole('tab', { name: '煎茶' }))
    expect(screen.getByLabelText(/フレーバーホイール/)).toBeTruthy()
  })

  it('右をチョコに切り替えるとチョコ同士になり、チョコ用の注記が出る', () => {
    location.hash = '#/pair'; render(<App />)
    fireEvent.click(switchOf(1))
    expect(screen.getByLabelText('左：チョコレート')).toBeTruthy()
    expect(screen.getByLabelText('右：チョコレート')).toBeTruthy()
    expect(summaryText()).toContain('チョコレート同士のブレンドを直接調べた官能研究は確認できていない')
    expect(summaryText()).toContain('×')
    // チョコ側のプルダウン（産地・系統）も両側に出る
    expect(screen.getByLabelText('左：カカオの産地（任意）')).toBeTruthy()
    expect(screen.getByLabelText('右：カカオの系統（任意）')).toBeTruthy()
    // 右をミルクチョコに変えて、タブ（アイテム名）からホイールが開ける
    fireEvent.change(screen.getByLabelText('右：チョコレート'), { target: { value: 'milk-chocolate' } })
    expect(summaryText()).toContain('ダークチョコレート（焙煎） × ミルクチョコレート')
    fireEvent.click(screen.getByRole('tab', { name: 'ミルクチョコレート' }))
    expect(screen.getByLabelText(/フレーバーホイール/)).toBeTruthy()
  })

  it('切り替えた側の選択は種別ごとに保持され、戻すと復元される', () => {
    location.hash = '#/pair'; render(<App />)
    // 右のお茶を紅茶アイテムに変えてから、右をチョコ→お茶と往復する
    fireEvent.change(screen.getByLabelText('お茶'), { target: { value: 'black-tea' } })
    fireEvent.click(switchOf(1))
    expect(screen.getByLabelText('右：チョコレート')).toBeTruthy()
    fireEvent.click(switchOf(1))
    expect((screen.getByLabelText('お茶') as HTMLSelectElement).value).toBe('black-tea')
  })

  it('お茶同士のペアを保存すると種別つきIDで保存され、お気に入り画面で種別ごと表示される', () => {
    location.hash = '#/pair'; render(<App />)
    fireEvent.click(switchOf(0)) // 左をお茶に
    fireEvent.change(screen.getByLabelText('左：お茶'), { target: { value: 'sencha' } })
    fireEvent.click(screen.getByRole('button', { name: /この組み合わせを保存/ }))
    const raw = localStorage.getItem('pairing-app:v1')
    expect(raw).toBeTruthy()
    const savedData = JSON.parse(raw!) as { favorites: { pairings: string[] } }
    expect(savedData.favorites.pairings).toContain('tea:sencha+tea:oolong-tea')
    // お気に入り・履歴画面では名前と種別つきで表示される（お気に入りと履歴の両方に出る）
    cleanup(); location.hash = '#/saved'; render(<App />)
    expect(screen.getAllByText(/煎茶（お茶） × 烏龍茶（青茶）（お茶）/).length).toBeGreaterThan(0)
  })

  it('旧形式（種別なし）の保存データはお茶×チョコとして読み込まれ表示される', () => {
    localStorage.setItem('pairing-app:v1', JSON.stringify({
      version: 1,
      favorites: { teas: [], chocolates: [], pairings: ['sencha+dark-roasted'] },
      history: { teas: [], chocolates: [], pairings: [] },
    }))
    location.hash = '#/saved'; render(<App />)
    expect(screen.getByText(/煎茶 × ダークチョコレート（焙煎）/)).toBeTruthy()
    // 読み込み時に種別つき形式へ移行して保存し直される
    const raw = JSON.parse(localStorage.getItem('pairing-app:v1')!) as { favorites: { pairings: string[] } }
    expect(raw.favorites.pairings).toContain('tea:sencha+chocolate:dark-roasted')
  })
})
