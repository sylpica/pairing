// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from './App'

const clickButton = (name: RegExp) => {
  const btns = screen.getAllByRole('button', { name })
  fireEvent.click(btns[0])
}
/** 名前など複数箇所に出る文字列は「どこかに表示されていること」で検証する */
const expectShown = (re: RegExp) => expect(screen.getAllByText(re).length).toBeGreaterThan(0)
/** ホイールのセグメントラベル（SVGテキスト。2行に割れた名前も連結して読む） */
const wheelText = () => [...document.querySelectorAll('.wheel-label')].map((el) => el.textContent ?? '').join('')

describe('フレーバーホイール×科学成分の画面連携（追加指示11章）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  it('1. 白茶の「青草・若葉」をタップすると関連成分が確認できる', () => {
    location.hash = '#/tea/white-tea'; render(<App />)
    clickButton(/植物系/)
    clickButton(/青草・若葉/)
    // 第8弾: 中分類（青草・若葉）を押すと小分類（化学物質）のホイールが出る
    expect(wheelText()).toContain('ヘキサナール')
    expect(wheelText()).toContain('(Z)-3-ヘキセン-1-オール')
    // 根拠の詳細はシート（ダイアログ）として画面遷移せずに開く
    fireEvent.click(screen.getByRole('button', { name: '「青草・若葉」の根拠を見る' }))
    expect(screen.getByRole('dialog')).toBeTruthy()
    expectShown(/ヘキサナール/)
    // 階層表示: 白茶の試料での研究例として区別される
    expectShown(/白茶の試料での研究例/)
  })

  it('シートを閉じても選択は保持され、もう一度開ける', () => {
    location.hash = '#/tea/white-tea'; render(<App />)
    clickButton(/植物系/)
    clickButton(/青草・若葉/)
    fireEvent.click(screen.getByRole('button', { name: '「青草・若葉」の根拠を見る' }))
    fireEvent.click(screen.getByRole('button', { name: '成分情報を閉じる' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    // 選択中の香味は保持され、再表示ボタンが出る
    fireEvent.click(screen.getByRole('button', { name: /もう一度開く/ }))
    expect(screen.getByRole('dialog')).toBeTruthy()
    expectShown(/ヘキサナール/)
  })

  it('6/10. 固有データがない場合は、未確認である旨を示してから全般の研究例を出す', () => {
    // 蒸し緑茶の「青草・若葉」: 白茶試料の成分（ヘキサナール）は「他のお茶・チョコレートでの研究例」に回る
    location.hash = '#/tea/green-steamed'; render(<App />)
    clickButton(/植物系/)
    clickButton(/青草・若葉/)
    fireEvent.click(screen.getByRole('button', { name: '「青草・若葉」の根拠を見る' }))
    expectShown(/そのもの（個別の試料）での成分情報は未確認です/)
    expectShown(/他のお茶・チョコレートでの研究例/)
    expectShown(/ヘキサナール/)
  })

  it('5. 紅茶の苦味からカフェイン、渋味から渋味の科学的区別と成分を確認できる', () => {
    location.hash = '#/tea/black-tea'; render(<App />)
    // 第7弾・課題B: 味覚は「味」タブでホイール表示になる。第10弾: 味も大分類（基本味／口当たり・収れん感）→中分類（個々の味）→小分類（寄与成分）の3階層になり、成分から詳細シートを開く
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    fireEvent.click(screen.getByLabelText(/基本味を開く/))
    fireEvent.click(screen.getByRole('button', { name: /^苦味（.+）に寄与する物質を見る$/ }))
    expect(wheelText()).toContain('カフェイン')
    fireEvent.click(screen.getByLabelText(/カフェイン（\d+%）の詳細を見る/))
    expectShown(/再構成・除去（オミッション）実験で、苦味の主要呈味化合物/)
    cleanup()
    location.hash = '#/tea/black-tea'; render(<App />)
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    fireEvent.click(screen.getByLabelText(/口当たり・収れん感を開く/))
    fireEvent.click(screen.getByRole('button', { name: /^渋味（収れん感）（.+）に寄与する物質を見る$/ }))
    expect(wheelText()).toContain('ガレート型カテキン類')
    expect(wheelText()).toContain('フラボノール配糖体')
    // 渋味は基本味ではなく収れん感であることが、味の根拠シートで出典つきで示される
    fireEvent.click(screen.getByRole('button', { name: '「渋味（収れん感）」の根拠を見る' }))
    expectShown(/渋味は基本味ではありません/)
    expectShown(/Bajec/)
    expectShown(/ガレート型カテキン類/)
    expectShown(/フラボノール配糖体/)
  })

  it('5. 抹茶のうま味ではテアニン等の実証成分と、グルタミン酸の未確認の限定が併記される', () => {
    location.hash = '#/tea/matcha'; render(<App />)
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    fireEvent.click(screen.getByLabelText(/基本味を開く/))
    fireEvent.click(screen.getByRole('button', { name: /^うま味（.+）に寄与する物質を見る$/ }))
    expect(wheelText()).toContain('L-テアニン')
    expect(wheelText()).toContain('コハク酸・没食子酸・テオガリン')
    expect(wheelText()).toContain('グルタミン酸')
    // グルタミン酸の詳細では、寄与が未確認である限定が併記される
    fireEvent.click(screen.getByLabelText(/グルタミン酸（\d+%）の詳細を見る/))
    expectShown(/未確認/)
  })

  it('7. チョコレート側でも味覚から成分を確認でき、甘味は配合糖由来と区別される', () => {
    location.hash = '#/choco/dark-roasted'; render(<App />)
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    fireEvent.click(screen.getByLabelText(/基本味を開く/))
    fireEvent.click(screen.getByRole('button', { name: /^苦味（.+）に寄与する物質を見る$/ }))
    expectShown(/テオブロミン/)
    expectShown(/ジケトピペラジン類/)
    cleanup()
    location.hash = '#/choco/milk-chocolate'; render(<App />)
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    fireEvent.click(screen.getByLabelText(/基本味を開く/))
    fireEvent.click(screen.getByRole('button', { name: /^甘味（.+）の根拠を見る$/ }))
    expectShown(/配合された糖によるもの/)
  })

  it('4. 成分一覧は検索窓なしで全成分がそのまま表示される（第19弾で逆引き検索を廃止）', () => {
    location.hash = '#/compounds'; render(<App />)
    expect(screen.queryByLabelText('成分を検索')).toBeNull()
    // 検索しなくても、香味つきの成分も苦味成分も同時に一覧に出ている
    expectShown(/関係する香味：柑橘、花様/)
    expectShown(/カフェイン/)
    expectShown(/テオブロミン/)
    expectShown(/リナロール/)
  })

  it('8. ペアリング結果の分類（甘い香り）から成分を調べられる', () => {
    location.hash = '#/pair'; render(<App />)
    // 既定の組み合わせ（烏龍茶×ダーク焙煎）では「甘い香り」が共通分類になる。
    // 要約には味わいの性格のチップにも同名の「甘い香り」があるため、性格ブロック（.pair-character）の外にある分類チップを押す
    const catBtn = screen.getAllByRole('button', { name: /甘い香り/ }).find((b) => !b.closest('.pair-character'))
    expect(catBtn).toBeTruthy()
    fireEvent.click(catBtn!)
    clickButton(/キャラメル（成分/)
    // チョコレート側の研究例としてフラネオールが出る。共通成分=相性の根拠にしない注意も出る
    expectShown(/チョコレートでの研究例/)
    expectShown(/フラネオール/)
    expectShown(/相性が良いことの根拠にはなりません/)
  })

  it('品種図鑑の所見から成分一覧の該当成分へ辿れる', async () => {
    location.hash = '#/cultivar/soufu'; render(<App />)
    // そうふうにはアントラニル酸メチルへの所見リンクが2件あるため最初のものを押す
    fireEvent.click(screen.getAllByRole('button', { name: /アントラニル酸メチルの詳細を見る/ })[0])
    expect(await screen.findByText(/品種・系統の図鑑から参照された成分です/)).toBeTruthy()
    expect(location.hash).toContain('compounds/methyl-anthranilate')
  })

  it('11. 成分データのない香味は、ホイールに存在しない香味として捏造表示されない', () => {
    location.hash = '#/tea/gyokuro'; render(<App />)
    // 玉露のプロファイルに海藻・磯ノートは収録されていないため、画面にも現れない
    expect(screen.queryByText(/海藻・磯/)).toBeNull()
  })
})
