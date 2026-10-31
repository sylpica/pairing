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
