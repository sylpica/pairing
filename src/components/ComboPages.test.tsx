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

  it('大分類には中分類（具体名）が併記され、小分類で化合物名が出る（裏付けのある香りだけ・指示3・第8弾）', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    // 大分類セグメントの小さな文字は中分類（具体名）：緑茶の花様への推測＝バラ・ジャスミン
    const subs = [...document.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '')
    expect(subs.length).toBeGreaterThan(0)
    expect(subs.some((s) => s.includes('ジャスミン'))).toBe(true)
    // 花系 → ジャスミン（中分類）→ 小分類（化学物質）に (Z)-ジャスモン酸メチルが出る
    fireEvent.click(screen.getByLabelText(/花系を開く/))
    fireEvent.click(screen.getByLabelText(/ジャスミン（\d+%）に寄与する化学物質を見る/))
    const labels = [...document.querySelectorAll('.wheel-label')].map((el) => el.textContent ?? '').join('')
    expect(labels).toContain('ジャスモン酸メチル')
  })

  it('階層を辿ると根拠の内訳と成分がシートで開く（指示2・3・第8弾）', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    expect(screen.queryByRole('dialog')).toBeNull()
    fireEvent.click(screen.getByLabelText(/花系を開く/))
    fireEvent.click(screen.getByRole('button', { name: '「花様」の根拠を見る' }))
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

  it('チップからも階層を辿って同じシートが開く（第8弾）', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'
    render(<App />)
    const chip = [...document.querySelectorAll('.wheel-note-index .chip')].find((el) => el.textContent?.includes('花様'))
    expect(chip).toBeTruthy()
    fireEvent.click(chip!)
    // 花様には具体名の推測があるため、まず花系の中分類が開く。そこから根拠シートへ進む
    fireEvent.click(screen.getByRole('button', { name: '「花様」の根拠を見る' }))
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
