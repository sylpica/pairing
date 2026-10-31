// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from './App'

// 実機フィードバック第3弾（2026-10-31）の画面側回帰テスト。
// - 調べる画面のプレビュー（ComboPreview）が、産地・品種の変更に追随して描き直されること
// - 組み合わせる画面で、品種の変更が文脈ノートに伝わること
// - 系統・品種ページでホイールが説明文より上にあること（追加指示5・6）

describe('調べる（お茶）：産地・品種を変えると直下のホイールが変わる', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  it('村上 × 香駿 × 緑茶で花様が強く出て、品種をやぶきたに変えると顔ぶれが変わる', () => {
    location.hash = '#/tea'
    render(<App />)
    fireEvent.change(screen.getByLabelText('分類（茶類）で絞り込み'), { target: { value: 'green' } })
    fireEvent.change(screen.getByLabelText('産地で絞り込み'), { target: { value: 'region:murakami' } })
    fireEvent.change(screen.getByLabelText('品種で絞り込み'), { target: { value: 'koushun' } })
    const preview = document.querySelector('.combo-preview')
    expect(preview).toBeTruthy()
    expect(preview!.textContent).toContain('村上 × 香駿 × 緑茶')
    // 香駿の所見（読み替え推測）で花様が一段強まる
    expect(preview!.textContent).toContain('花様（強い）')
    // 産地（村上）は反映されない理由がプレビューにも出る
    expect(preview!.textContent).toContain('反映していません')
    // 品種だけを変えると、プレビューがその場で描き直される
    fireEvent.change(screen.getByLabelText('品種で絞り込み'), { target: { value: 'yabukita' } })
    const preview2 = document.querySelector('.combo-preview')
    expect(preview2!.textContent).toContain('村上 × やぶきた × 緑茶')
    expect(preview2!.textContent).toContain('花様（普通）')
    expect(preview2!.textContent).toContain('蜂蜜（弱い）') // やぶきたの AEDA 由来で増える
    expect(preview2!.textContent).not.toContain('花様（強い）')
  })
})

describe('調べる（チョコ）：系統を変えると直下のホイールが変わる', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  it('マダガスカル × ICS-95 × ダークで花様・果実全般が出る', () => {
    location.hash = '#/choco'
    render(<App />)
    fireEvent.change(screen.getByLabelText('分類（種類）で絞り込み'), { target: { value: 'dark' } })
    fireEvent.change(screen.getByLabelText('産地で絞り込み'), { target: { value: 'madagascar' } })
    fireEvent.change(screen.getByLabelText('系統で絞り込み'), { target: { value: 'clone:ics-95' } })
    const preview = document.querySelector('.combo-preview')
    expect(preview).toBeTruthy()
    expect(preview!.textContent).toContain('マダガスカル × ICS-95 × ダークチョコレート')
    expect(preview!.textContent).toContain('花様（弱い）')
    expect(preview!.textContent).toContain('果実全般（弱い）')
  })
})

describe('調べる：部分指定（1〜2軸）でもホイール（プレビュー）が出る（第5弾・要件6）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  it('お茶：分類のみの指定でプレビューが出る', () => {
    location.hash = '#/tea'
    render(<App />)
    fireEvent.change(screen.getByLabelText('分類（茶類）で絞り込み'), { target: { value: 'green' } })
    const preview = document.querySelector('.combo-preview')
    expect(preview).toBeTruthy()
    expect(preview!.textContent).toContain('緑茶')
    expect(preview!.querySelector('svg.wheel')).toBeTruthy()
  })

  it('お茶：産地のみの指定で、補完した分類の注記つきでプレビューが出る', () => {
    location.hash = '#/tea'
    render(<App />)
    fireEvent.change(screen.getByLabelText('産地で絞り込み'), { target: { value: 'region:shizuoka' } })
    const preview = document.querySelector('.combo-preview')
    expect(preview).toBeTruthy()
    expect(preview!.textContent).toContain('静岡')
    // 分類は未指定のため、補完したことを明示する（暗黙の仮定にしない）
    expect(preview!.textContent).toContain('分類は未指定のため')
    expect(preview!.textContent).toContain('緑茶として表示しています')
    // 詳細ページへの導線も、補完した選択で開ける
    expect(preview!.textContent).toContain('この組み合わせの詳細ページへ')
  })

  it('お茶：品種のみの指定でプレビューが出る', () => {
    location.hash = '#/tea'
    render(<App />)
    fireEvent.change(screen.getByLabelText('品種で絞り込み'), { target: { value: 'yabukita' } })
    const preview = document.querySelector('.combo-preview')
    expect(preview).toBeTruthy()
    expect(preview!.textContent).toContain('やぶきた')
  })

  it('チョコ：系統のみの指定で、補完した種類の注記つきでプレビューが出る', () => {
    location.hash = '#/choco'
    render(<App />)
    fireEvent.change(screen.getByLabelText('系統で絞り込み'), { target: { value: 'genetic:gen-nacional' } })
    const preview = document.querySelector('.combo-preview')
    expect(preview).toBeTruthy()
    expect(preview!.textContent).toContain('ナシオナル')
    expect(preview!.textContent).toContain('種類は未指定のため')
    expect(preview!.textContent).toContain('ダークチョコレートとして表示しています')
  })

  it('チョコ：分類のみの指定でプレビューが出る', () => {
    location.hash = '#/choco'
    render(<App />)
    fireEvent.change(screen.getByLabelText('分類（種類）で絞り込み'), { target: { value: 'dark' } })
    const preview = document.querySelector('.combo-preview')
    expect(preview).toBeTruthy()
    expect(preview!.textContent).toContain('ダークチョコレート')
  })
})

describe('組み合わせる：分類未指定＋産地のみでも結果が組み立てられる（第5弾・要件6の一般化）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  it('お茶側：分類を外して産地（静岡）だけ指定しても、見出しに静岡が出て結果が出る', () => {
    location.hash = '#/pair'
    render(<App />)
    fireEvent.change(screen.getByLabelText('お茶'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('お茶の産地（任意）'), { target: { value: 'region:shizuoka' } })
    const summary = document.querySelector('.pair-summary')
    expect(summary).toBeTruthy()
    expect(summary!.textContent).toContain('静岡')
    expect(summary!.textContent).not.toContain('もう一方を選ぶと結果が出ます')
  })

  it('チョコ側：分類を外して産地（エクアドル）だけ指定しても、見出しにエクアドルが出て結果が出る', () => {
    location.hash = '#/pair'
    render(<App />)
    fireEvent.change(screen.getByLabelText('チョコレート'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('カカオの産地（任意）'), { target: { value: 'ecuador' } })
    const summary = document.querySelector('.pair-summary')
    expect(summary).toBeTruthy()
    expect(summary!.textContent).toContain('エクアドル')
    expect(summary!.textContent).not.toContain('もう一方を選ぶと結果が出ます')
  })
})

describe('組み合わせる：品種の変更が文脈ノートに伝わる', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  it('品種を選ぶと「組み合わせの見方」に品種の文脈ノートが出て、外すと消える', () => {
    location.hash = '#/pair'
    render(<App />)
    fireEvent.change(screen.getByLabelText('お茶'), { target: { value: 'green' } })
    fireEvent.change(screen.getByLabelText('お茶の品種（任意）'), { target: { value: 'yabukita' } })
    fireEvent.click(screen.getByRole('tab', { name: '組み合わせの見方' }))
    expect(screen.getByText('お茶の品種：やぶきた')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('お茶の品種（任意）'), { target: { value: '' } })
    expect(screen.queryByText('お茶の品種：やぶきた')).toBeNull()
  })
})

describe('ホイールの配置（系統・品種ページは上部、アイテム詳細は従来どおり上部）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  const isBefore = (a: Element, b: Element) =>
    (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0

  it('系統ページ（クリオロ）：ホイールと分類タブが「この分類について」より上にある', () => {
    location.hash = '#/cacao/traditional/trad-criollo'
    render(<App />)
    const wheel = screen.getByLabelText(/組み合わせのフレーバーホイール/)
    const about = screen.getByText('この分類について')
    expect(isBefore(wheel, about)).toBe(true)
    // 分類を選ぶタブ（セレクト）もホイールと一緒に上部にある
    const tabSelect = screen.getByLabelText('ホイールを表示する分類')
    expect(isBefore(tabSelect, about)).toBe(true)
    // 「組み合わせの推測であり固有の実測ではない」旨の注記がホイールの近く（上部領域）に残る
    const note = screen.getByText(/組み合わせの推測/)
    expect(isBefore(note, about)).toBe(true)
  })

  it('品種ページ（やぶきた）：ホイールが「由来・育成」より上にある', () => {
    location.hash = '#/cultivar/yabukita'
    render(<App />)
    const wheel = screen.getByLabelText(/組み合わせのフレーバーホイール/)
    const breeding = screen.getByText('由来・育成')
    expect(isBefore(wheel, breeding)).toBe(true)
  })

  it('お茶のアイテム詳細（煎茶）：ホイールは従来どおり最上部にある', () => {
    location.hash = '#/tea/sencha'
    render(<App />)
    const wheel = screen.getByLabelText('フレーバーホイール')
    const taste = screen.getByText('味覚と渋味')
    expect(isBefore(wheel, taste)).toBe(true)
  })
})
