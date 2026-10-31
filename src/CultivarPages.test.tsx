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

  it('品種・系統の比較のリセットで、モードと各プルダウンが開いた直後の既定に戻る（第20弾）', () => {
    location.hash = '#/compare-cultivars'; render(<App />)
    const kindSel = () => screen.getByLabelText('茶類') as HTMLSelectElement
    // 開いた直後の既定：茶類＝緑茶、品種 1＝やぶきた、品種 2＝おくみどり
    expect(kindSel().value).toBe('green')
    expect((screen.getByLabelText('品種 1') as HTMLSelectElement).value).toBe('yabukita')
    expect((screen.getByLabelText('品種 2') as HTMLSelectElement).value).toBe('okumidori')
    // 茶類を別のものに変え、カカオ系統モードでも系統を変える
    fireEvent.change(kindSel(), { target: { value: kindSel().options[1].value } })
    expect(kindSel().value).not.toBe('green')
    fireEvent.click(screen.getByRole('button', { name: 'カカオ系統の比較' }))
    const cacaoSel = screen.getByLabelText('系統 1') as HTMLSelectElement
    fireEvent.change(cacaoSel, { target: { value: cacaoSel.options[5].value } })
    expect(cacaoSel.value).toBe('5')

    fireEvent.click(screen.getByRole('button', { name: 'リセット' }))

    // モードは既定のタブに戻り、プルダウンも既定値に戻る（比較結果の表示も初期状態）
    expect(screen.getByRole('button', { name: '同じ茶類・異なる品種' }).className).toContain('active')
    expect(kindSel().value).toBe('green')
    expect((screen.getByLabelText('品種 1') as HTMLSelectElement).value).toBe('yabukita')
    expect((screen.getByLabelText('品種 2') as HTMLSelectElement).value).toBe('okumidori')
    // カカオモード側の選択も初期値（系統 1＝0、系統 2＝3）に戻っている
    fireEvent.click(screen.getByRole('button', { name: 'カカオ系統の比較' }))
    expect((screen.getByLabelText('系統 1') as HTMLSelectElement).value).toBe('0')
    expect((screen.getByLabelText('系統 2') as HTMLSelectElement).value).toBe('3')
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

  it('品種ページ（おくみどり）：ホイールが説明文より前にあり、根拠チップと確認バッジは凡例ボックス内にある（第19弾）', () => {
    location.hash = '#/cultivar/okumidori'; render(<App />)
    const wheel = screen.getByLabelText(/組み合わせのフレーバーホイール/)
    const badge = screen.getByText(/この組み合わせ全体の根拠/)
    const desc = screen.getAllByText(/固有の実測プロファイルではありません/)[0]
    expect(isAfter(wheel, desc)).toBe(true)
    // 根拠チップは単独で置かれず、凡例ボックス（ホイールの下）の中に集約されている
    expect(badge.closest('.combo-legend')).toBeTruthy()
    expect(isAfter(wheel, badge)).toBe(true)
    expect(isAfter(badge, desc)).toBe(true)
    // 確認バッジ（存在／分類／科学データ）も凡例ボックスの中にある
    const legend = document.querySelector('.combo-legend')
    expect(legend).toBeTruthy()
    expect(legend!.textContent).toContain('存在：')
    expect(legend!.textContent).toContain('分類：')
    expect(legend!.textContent).toMatch(/科学データ/)
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

describe('第21弾：品種・系統の比較にもフレーバーホイールを出す', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })
  const isAfter = (a: Node, b: Node) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0

  it('同じ茶類・異なる品種：プルダウンの下に2品種のホイールが出て、バッジと全体の根拠は各凡例の中にある', () => {
    location.hash = '#/compare-cultivars'; render(<App />)
    const wheels = screen.getAllByLabelText(/組み合わせのフレーバーホイール/)
    expect(wheels.length).toBe(2)
    // ホイールはプルダウン類の下（品種 2 のプルダウンより後）にある
    expect(isAfter(screen.getByLabelText('品種 2'), wheels[0])).toBe(true)
    // 解釈注記はホイールより前に塊で置かず、パネル群の下（所見の近く）に残る
    const note = screen.getByText(/所見は研究ごとに試料・条件が異なります/)
    expect(isAfter(wheels[0], note)).toBe(true)
    // 各パネルの凡例ボックスに確認バッジと組み合わせ全体の根拠が入っている
    const legends = document.querySelectorAll('.compare-grid .combo-legend')
    expect(legends.length).toBe(2)
    legends.forEach((l) => {
      expect(l.textContent).toContain('存在：')
      expect(l.textContent).toMatch(/この組み合わせ全体の根拠/)
    })
    // 所見リストは削除されていない（供試情報と出典つき所見が出る）
    expect(screen.getAllByText(/研究で供試された組み合わせです/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/ジャスミンラクトン/).length).toBeGreaterThan(0)
  })

  it('同じ品種・異なる茶類：茶類プルダウンの下に2つの組み合わせホイールが出て、茶類の変更に追随する', () => {
    location.hash = '#/compare-cultivars'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '同じ品種・異なる茶類' }))
    // 品種を やぶきた に切り替える（複数の茶類でホイールが組み立てられる品種）
    fireEvent.change(screen.getByLabelText('品種'), { target: { value: 'yabukita' } })
    const kindSelA = screen.getByLabelText('茶類 1') as HTMLSelectElement
    const kindSelB = screen.getByLabelText('茶類 2') as HTMLSelectElement
    expect(kindSelA.options.length).toBeGreaterThanOrEqual(2)
    expect(kindSelA.value).not.toBe(kindSelB.value)
    expect(screen.getAllByLabelText(/組み合わせのフレーバーホイール/).length).toBe(2)
    // パネル見出しは「品種 × 茶類」で、ホイールはプルダウンの下にある
    const headings = screen.getAllByText(/やぶきた × /)
    expect(headings.length).toBe(2)
    expect(isAfter(kindSelB, screen.getAllByLabelText(/組み合わせのフレーバーホイール/)[0])).toBe(true)
    // 茶類 1 を変えると、1つ目のパネルの見出しとホイールが追随する
    const before = headings[0].textContent
    const other = [...kindSelA.options].map((o) => o.value).find((v) => v !== kindSelA.value && v !== kindSelB.value) ?? kindSelB.value
    fireEvent.change(kindSelA, { target: { value: other } })
    expect(screen.getAllByLabelText(/組み合わせのフレーバーホイール/).length).toBe(2)
    expect(screen.getAllByText(/やぶきた × /)[0].textContent).not.toBe(before)
    // 確認済み組み合わせの一覧（所見側の情報）は削除されていない
    expect(screen.getByText(/確認されている組み合わせは以下のとおりです/)).toBeTruthy()
  })

  it('カカオ系統の比較：分類を選ぶプルダウンで2系統のホイールが出て、分類の変更に追随する', () => {
    location.hash = '#/compare-cultivars'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'カカオ系統の比較' }))
    // 分類プルダウンの既定は系統ページと同じダーク
    const kindSel = screen.getByLabelText('分類を選ぶ') as HTMLSelectElement
    expect(kindSel.value).toBe('dark')
    expect(screen.getAllByLabelText(/組み合わせのフレーバーホイール/).length).toBe(2)
    // ホイールはプルダウン類の下にある
    expect(isAfter(screen.getByLabelText('系統 2'), screen.getAllByLabelText(/組み合わせのフレーバーホイール/)[0])).toBe(true)
    // 各パネルの凡例ボックスに確認バッジと組み合わせ全体の根拠が入っている
    const legends = document.querySelectorAll('.compare-grid .combo-legend')
    expect(legends.length).toBe(2)
    legends.forEach((l) => {
      expect(l.textContent).toContain('存在：')
      expect(l.textContent).toMatch(/この組み合わせ全体の根拠/)
    })
    // 解釈注記はパネル群の下に残る
    const note = screen.getByText(/伝統的分類・遺伝集団・個別クローンは階層の異なる概念です/)
    expect(isAfter(screen.getAllByLabelText(/組み合わせのフレーバーホイール/)[0], note)).toBe(true)
    // 分類をミルクに変えると、ホイールが追随して2つのまま表示される
    fireEvent.change(kindSel, { target: { value: 'milk' } })
    expect(kindSel.value).toBe('milk')
    expect(screen.getAllByLabelText(/組み合わせのフレーバーホイール/).length).toBe(2)
    expect(document.querySelectorAll('.compare-grid .combo-legend').length).toBe(2)
    // 系統を変えてもホイールは出続ける
    fireEvent.change(screen.getByLabelText('系統 1'), { target: { value: '5' } })
    expect(screen.getAllByLabelText(/組み合わせのフレーバーホイール/).length).toBe(2)
  })
})
