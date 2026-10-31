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

  it('おくみどり詳細では組み合わせのホイールが出て、品種固有の実測ではないことが明示される', () => {
    location.hash = '#/cultivar/okumidori'; render(<App />)
    // 組み合わせページと同じ凡例つきホイールが出る（品種固有のホイールではない）
    expect(screen.getByLabelText(/組み合わせのフレーバーホイール/)).toBeTruthy()
    expect(screen.getAllByText(/組み合わせの推測/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/固有の実測プロファイルではありません/).length).toBeGreaterThan(0)
    // 2026-10-31 に追加された官能の所見（木下 2015）が出る
    expect(screen.getByText(/上品な/)).toBeTruthy()
  })

  it('ごこう詳細では玉露（形態）のプロファイルを土台にしたホイールが出る', () => {
    location.hash = '#/cultivar/gokou'; render(<App />)
    expect(screen.getByLabelText(/組み合わせのフレーバーホイール/)).toBeTruthy()
    // 形態は組み合わせページの対象外であることが明示され、アイテム側へ案内される
    expect(screen.getAllByText(/組み合わせページの対象外の形態/).length).toBeGreaterThan(0)
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
    // 所見のない品種（ほくめい）に切り替えると「不明」が正直に表示される
    fireEvent.change(screen.getByLabelText('品種 2'), { target: { value: 'hokumei' } })
    expect(screen.getByText(/所見：不明/)).toBeTruthy()
  })

  it('ICS-95 詳細では追加された官能の所見が出る', () => {
    location.hash = '#/cacao/clone/ics-95'; render(<App />)
    expect(screen.getByText(/最良の官能属性/)).toBeTruthy()
    expect(screen.getByLabelText(/組み合わせのフレーバーホイール/)).toBeTruthy()
  })

  it('香味所見のない遺伝集団（Purús）では、その旨の注意つきで種類由来のホイールが出る', () => {
    location.hash = '#/cacao/genetic/gen-purus'; render(<App />)
    expect(screen.getByText(/香味の科学的な所見が確認できていません/)).toBeTruthy()
    expect(screen.getByLabelText(/組み合わせのフレーバーホイール/)).toBeTruthy()
    expect(screen.getAllByText(/種類一般のプロファイルの表示/).length).toBeGreaterThan(0)
  })

  it('タンザニアの産地ページでは参考情報が科学的な所見と区別して出る', () => {
    location.hash = '#/origin/tanzania'; render(<App />)
    expect(screen.getByText(/参考情報（査読された実測ではありません）/)).toBeTruthy()
    expect(screen.getAllByText(/Kokoa Kamili/).length).toBeGreaterThan(0)
    // 科学的な所見（findings）としては出ていないこと
    expect(screen.getAllByText(/科学データ未確認/).length).toBeGreaterThan(0)
  })

  it('品種ページのホイールでも、階層を辿ると根拠と成分のシートが開く（指示2・3・第8弾）', () => {
    location.hash = '#/cultivar/okumidori'; render(<App />)
    expect(screen.queryByRole('dialog')).toBeNull()
    // 大分類セグメントには中分類（具体名）の併記がある
    const subs = [...document.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '')
    expect(subs.length).toBeGreaterThan(0)
    const chip = [...document.querySelectorAll('.wheel-note-index .chip')].find((el) => el.textContent?.includes('花様'))
    expect(chip).toBeTruthy()
    fireEvent.click(chip!)
    // 花様には具体名の推測があるため、まず花系の中分類が開く。そこから根拠シートへ進む
    fireEvent.click(screen.getByRole('button', { name: '「花様」の根拠を見る' }))
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent).toContain('この香りの根拠')
    expect(dialog.textContent).toContain('この香りに関係する成分')
    fireEvent.click(screen.getByLabelText('根拠情報を閉じる'))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByText(/の根拠情報をもう一度開く/)).toBeTruthy()
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

describe('第18弾：品種・系統ページではホイールが説明文より上に来る', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })
  // a の後に b が続く（b が a より後ろ）かどうか
  const isAfter = (a: Node, b: Node) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0

  it('品種ページ（おくみどり）：ホイールと根拠チップが説明文より前にある', () => {
    location.hash = '#/cultivar/okumidori'; render(<App />)
    const wheel = screen.getByLabelText(/組み合わせのフレーバーホイール/)
    const badge = screen.getByText(/この組み合わせ全体の根拠/)
    const desc = screen.getAllByText(/固有の実測プロファイルではありません/)[0]
    expect(isAfter(wheel, desc)).toBe(true)
    expect(isAfter(badge, desc)).toBe(true)
    // 説明文自体は削除されず、ホイールの下に残っている
    expect(desc.textContent).toContain('組み合わせの推測')
  })

  it('系統ページ（所見なし・Nanay）：プルダウン・ホイールが説明文と注意の箱より前にある', () => {
    location.hash = '#/cacao/genetic/gen-nanay'; render(<App />)
    const select = screen.getByLabelText('ホイールを表示する分類')
    const wheel = screen.getByLabelText(/組み合わせのフレーバーホイール/)
    const desc = screen.getAllByText(/固有の実測プロファイルではありません/)[0]
    const box = screen.getByText(/香味の科学的な所見が確認できていません/)
    expect(isAfter(select, wheel)).toBe(true)
    expect(isAfter(wheel, desc)).toBe(true)
    expect(isAfter(wheel, box)).toBe(true)
    // 説明文と注意の箱は削除されず、ホイールの下に残っている
    expect(desc.textContent).toContain('組み合わせの推測')
    expect(box.textContent).toContain('種類一般のプロファイルの表示')
  })

  it('系統ページ（所見あり・Nacional）：ホイールが説明文より前にある', () => {
    location.hash = '#/cacao/genetic/gen-nacional'; render(<App />)
    const wheel = screen.getByLabelText(/組み合わせのフレーバーホイール/)
    const desc = screen.getAllByText(/固有の実測プロファイルではありません/)[0]
    expect(isAfter(wheel, desc)).toBe(true)
    // 所見がある系統では注意の箱は出ない（従来どおり）
    expect(screen.queryByText(/香味の科学的な所見が確認できていません/)).toBeNull()
  })

  it('品種・系統を調べる：説明段落3つが検索窓・一覧より下（画面最下部）にある', () => {
    location.hash = '#/cultivars'; render(<App />)
    const input = screen.getByLabelText('品種・系統を検索')
    const compareBtn = screen.getByRole('button', { name: '品種・系統を比べる' })
    const p1 = screen.getByText(/出典のある分類・系譜と科学的な所見までです/)
    const p2 = screen.getByText(/一対一には対応しません/)
    const p3 = screen.getByText(/香味の実測がない産地には、香味の特徴を表示しません/)
    expect(isAfter(input, compareBtn)).toBe(true)
    expect(isAfter(compareBtn, p1)).toBe(true)
    expect(isAfter(p1, p2)).toBe(true)
    expect(isAfter(p2, p3)).toBe(true)
  })
})
