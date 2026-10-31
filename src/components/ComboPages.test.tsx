// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
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

  it('結果表示専用：このページ自体にプルダウンは無い（指示1）', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    expect(document.querySelectorAll('select')).toHaveLength(0)
    expect(screen.queryByLabelText('組み合わせの品種')).toBeNull()
    expect(screen.queryByLabelText('組み合わせの産地')).toBeNull()
    expect(screen.queryByLabelText('組み合わせの分類（茶類）')).toBeNull()
  })

  it('ホイールはタイトル直下にある（味わいの見出しより前）', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    const wheel = screen.getByLabelText(/組み合わせのフレーバーホイール/)
    const tastes = screen.getByText('味わい（味覚と渋味）')
    expect(wheel.compareDocumentPosition(tastes) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('セグメントに化合物名が併記される（裏付けのある香りだけ・指示3）', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    const subs = [...document.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '')
    expect(subs.length).toBeGreaterThan(0)
    // 緑茶の花様には (Z)-ジャスモン酸メチル等の裏付けがある
    expect(subs.some((s) => s.includes('ジャスモン酸メチル'))).toBe(true)
  })

  it('セグメントを押すと根拠の内訳と成分がシートで開く（指示2・3）', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.click(screen.getByLabelText(/花様（.+）の根拠を見る/))
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-label')).toContain('花様')
    expect(dialog.textContent).toContain('この香りの根拠')
    // 由来層（分類のプロファイル）の表示と出典が出る
    expect(dialog.textContent).toContain('分類のプロファイル')
    // 化合物とその根拠（検出／寄与の区別つき）が出る
    expect(dialog.textContent).toContain('ジャスモン酸メチル')
    expect(dialog.textContent).toContain('この香りに関係する成分')
    // 閉じても選択は保持され、根拠情報をもう一度開ける
    fireEvent.click(screen.getByLabelText('根拠情報を閉じる'))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByText(/「花様」の根拠情報をもう一度開く/)).toBeTruthy()
  })

  it('チップからも同じシートが開く', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    const chip = [...document.querySelectorAll('.wheel-list .chip')].find((el) => el.textContent?.includes('花様'))
    expect(chip).toBeTruthy()
    fireEvent.click(chip!)
    expect(screen.getByRole('dialog').textContent).toContain('この香りの根拠')
  })

  it('戻るボタンがある（指示4）', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    expect(screen.getByRole('button', { name: '← 戻る' })).toBeTruthy()
    cleanup()
    location.hash = '#/combo/choco'
    render(<App />)
    expect(screen.getByRole('button', { name: '← 戻る' })).toBeTruthy()
  })

  it('チョコ：既定でエクアドル × ナシオナル × ダークが出て、花様の推測が見える', () => {
    location.hash = '#/combo/choco'
    render(<App />)
    expect(screen.getByText('エクアドル × ナシオナル（Nacional） × ダークチョコレート')).toBeTruthy()
    expect(screen.getAllByText(/花様/).length).toBeGreaterThan(0)
    expect(document.querySelectorAll('select')).toHaveLength(0)
  })

  it('兄弟の組み合わせへのリンクが出る（同じ品種・分類違い）', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    expect(screen.getByText('同じ品種・分類違い')).toBeTruthy()
    expect(screen.getByText('長崎 × やぶきた × 紅茶')).toBeTruthy()
  })
})
