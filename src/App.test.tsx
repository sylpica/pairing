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

describe('組み合わせ画面のレイアウト（左チョコ・右お茶＋直下に結果要約）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })
  it('選択エリアは左がチョコレート、右がお茶の順に並ぶ', () => {
    location.hash = '#/pair'; render(<App />)
    const cols = document.querySelectorAll('.pair-col')
    expect(cols.length).toBe(2)
    expect(cols[0].textContent).toContain('チョコレート')
    expect(cols[1].textContent).toContain('お茶')
    expect(screen.getByLabelText('チョコレート')).toBeTruthy()
    expect(screen.getByLabelText('お茶')).toBeTruthy()
  })
  it('両方を選んだ状態では選択エリア直下に結果要約が出る', () => {
    location.hash = '#/pair'; render(<App />)
    const summary = screen.getByLabelText('組み合わせの結果（要約）')
    expect(summary.textContent).toContain('×')
    // 要約はタブ（詳細）より前に配置されている
    const tabs = document.querySelector('.tabs')
    expect(tabs).toBeTruthy()
    expect(summary.compareDocumentPosition(tabs as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
  it('片方を未選択に戻すと結果位置に最小限のプレースホルダが出る', () => {
    location.hash = '#/pair'; render(<App />)
    fireEvent.change(screen.getByLabelText('お茶'), { target: { value: '' } })
    expect(screen.getByText(/もう一方を選ぶと結果が出ます/)).toBeTruthy()
    expect(document.querySelector('.tabs')).toBeNull()
  })
})

describe('産地データと調べる画面の再設計（2026-10-30）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })
  const cardTexts = () => [...document.querySelectorAll('.item-card')].map((el) => el.textContent ?? '')
  const chipTexts = () => [...document.querySelectorAll('button.chip')].map((el) => el.textContent ?? '')

  it('ホームに「品種・系統を調べる」カードはない（調べる画面に吸収）', () => {
    render(<App />)
    expect(screen.queryByText('品種・系統を調べる')).toBeNull()
    expect(document.querySelectorAll('.big-card').length).toBe(3)
  })
  it('お茶一覧：品種プルダウンで品種カードと対応プロファイルが出る', () => {
    location.hash = '#/tea'; render(<App />)
    fireEvent.change(screen.getByLabelText('品種で絞り込み'), { target: { value: 'yabukita' } })
    const texts = cardTexts()
    expect(texts.some((t) => t.includes('やぶきた'))).toBe(true)
    expect(texts.some((t) => t.includes('煎茶'))).toBe(true)
    expect(texts.some((t) => t.includes('紅茶'))).toBe(false)
    expect(texts.some((t) => t.includes('べにふうき'))).toBe(false)
  })
  it('お茶一覧：分類×品種の組み合わせで合わない条件は空になる', () => {
    location.hash = '#/tea'; render(<App />)
    fireEvent.change(screen.getByLabelText('分類（茶類）で絞り込み'), { target: { value: 'black' } })
    fireEvent.change(screen.getByLabelText('品種で絞り込み'), { target: { value: 'yabukita' } })
    expect(screen.getByText(/見つかりませんでした/)).toBeTruthy()
    expect(cardTexts().length).toBe(0)
  })
  it('お茶一覧：産地プルダウンで日本のお茶と品種だけが出る', () => {
    location.hash = '#/tea'; render(<App />)
    fireEvent.change(screen.getByLabelText('産地で絞り込み'), { target: { value: '日本' } })
    const texts = cardTexts()
    expect(texts.some((t) => t.includes('煎茶'))).toBe(true)
    expect(texts.some((t) => t.includes('やぶきた'))).toBe(true)
    expect(texts.some((t) => t.includes('鳳凰単叢'))).toBe(false)
    expect(texts.some((t) => t.includes('ダージリン'))).toBe(false)
  })
  it('チョコ一覧：産地プルダウンで産地カードと関連系統が出て、プロファイルは出ない', () => {
    location.hash = '#/choco'; render(<App />)
    fireEvent.change(screen.getByLabelText('産地で絞り込み'), { target: { value: 'venezuela' } })
    const texts = cardTexts()
    expect(texts.some((t) => t.includes('ベネズエラ'))).toBe(true)
    expect(texts.some((t) => t.includes('クリオロ'))).toBe(true)
    expect(texts.some((t) => t.includes('ミルクチョコレート'))).toBe(false)
    expect(texts.some((t) => t.includes('プロファイル'))).toBe(false)
  })
  it('チョコ一覧：系統プルダウン（遺伝集団 Nacional）で系統カードと関連産地が出る', () => {
    location.hash = '#/choco'; render(<App />)
    fireEvent.change(screen.getByLabelText('系統で絞り込み'), { target: { value: 'genetic:gen-nacional' } })
    const texts = cardTexts()
    expect(texts.some((t) => t.includes('Nacional'))).toBe(true)
    expect(texts.some((t) => t.includes('エクアドル'))).toBe(true)
    expect(texts.some((t) => t.includes('ペルー'))).toBe(true)
    expect(texts.some((t) => t.includes('ガーナ'))).toBe(false)
  })
  it('お茶詳細から、その茶類で確認済みの品種へ飛べる', () => {
    location.hash = '#/tea/sencha'; render(<App />)
    expect(screen.getByText('この茶類で確認済みの品種・系統')).toBeTruthy()
    expect(chipTexts().some((t) => t.includes('やぶきた'))).toBe(true)
  })
  it('チョコ詳細から、産地・系統へ飛べる', () => {
    location.hash = '#/choco/milk-chocolate'; render(<App />)
    expect(screen.getByText('産地・系統から調べる')).toBeTruthy()
    expect(chipTexts().some((t) => t.includes('ベネズエラ'))).toBe(true)
    expect(chipTexts().some((t) => t.includes('Nacional'))).toBe(true)
  })
  it('産地詳細（エクアドル）でアリバが商業呼称として説明される', () => {
    location.hash = '#/origin/ecuador'; render(<App />)
    expect(screen.getAllByText(/アリバ/).length).toBeGreaterThan(0)
    expect(screen.getByText(/遺伝集団の名前ではありません/)).toBeTruthy()
  })
  it('組み合わせ画面で産地を指定すると階層バッジつきの産地カードが出る', () => {
    location.hash = '#/pair'; render(<App />)
    fireEvent.change(screen.getByLabelText('カカオの産地（任意）'), { target: { value: 'dominican-republic' } })
    expect(screen.getByText('カカオの産地：ドミニカ共和国')).toBeTruthy()
    expect(screen.getByText('産地の実測に基づく参考情報')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('カカオの産地（任意）'), { target: { value: 'tanzania' } })
    expect(screen.getByText('カカオの産地：タンザニア')).toBeTruthy()
    expect(screen.getByText('使えるデータがないため不使用')).toBeTruthy()
  })
})
