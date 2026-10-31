// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from './App'
import { compounds } from './data/compounds'

describe('画面の基本動作（§16相当のローカル検証）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })
  it('ホームに3機能のカードが出る', () => {
    render(<App />)
    expect(screen.getByText('お茶を調べる')).toBeTruthy()
    expect(screen.getByText('チョコを調べる')).toBeTruthy()
    expect(screen.getAllByText('組み合わせる').length).toBeGreaterThan(0)
  })
  it('お茶を調べるには検索窓が無く、プルダウンだけで一覧とプレビューに辿り着ける（第18弾）', () => {
    location.hash = '#/tea'; render(<App />)
    expect(screen.queryByLabelText('お茶を検索')).toBeNull()
    // 検索なしでもプロファイル一覧が出る
    expect(screen.getAllByText('プロファイル').length).toBeGreaterThan(0)
    // プルダウンだけで組み合わせプレビューが出る
    fireEvent.change(screen.getByLabelText('分類（茶類）で絞り込み'), { target: { value: 'green' } })
    expect(document.querySelector('.combo-preview')).toBeTruthy()
  })
  it('チョコを調べるには検索窓が無く、プルダウンだけで一覧とプレビューに辿り着ける（第18弾）', () => {
    location.hash = '#/choco'; render(<App />)
    expect(screen.queryByLabelText('チョコレートを検索')).toBeNull()
    expect(screen.getAllByText('プロファイル').length).toBeGreaterThan(0)
    fireEvent.change(screen.getByLabelText('分類（種類）で絞り込み'), { target: { value: 'dark' } })
    expect(document.querySelector('.combo-preview')).toBeTruthy()
  })
  it('お茶を調べるのリセットで全プルダウンが「指定しない」に戻りプレビューが消える（第19弾）', () => {
    location.hash = '#/tea'; render(<App />)
    fireEvent.change(screen.getByLabelText('分類（茶類）で絞り込み'), { target: { value: 'green' } })
    expect(document.querySelector('.combo-preview')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'リセット' }))
    expect((screen.getByLabelText('分類（茶類）で絞り込み') as HTMLSelectElement).value).toBe('')
    expect((screen.getByLabelText('産地で絞り込み') as HTMLSelectElement).value).toBe('')
    expect((screen.getByLabelText('品種で絞り込み') as HTMLSelectElement).value).toBe('')
    expect(document.querySelector('.combo-preview')).toBeNull()
  })
  it('チョコを調べるのリセットで全プルダウンが「指定しない」に戻りプレビューが消える（第19弾）', () => {
    location.hash = '#/choco'; render(<App />)
    fireEvent.change(screen.getByLabelText('分類（種類）で絞り込み'), { target: { value: 'dark' } })
    expect(document.querySelector('.combo-preview')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'リセット' }))
    expect((screen.getByLabelText('分類（種類）で絞り込み') as HTMLSelectElement).value).toBe('')
    expect((screen.getByLabelText('産地で絞り込み') as HTMLSelectElement).value).toBe('')
    expect((screen.getByLabelText('系統で絞り込み') as HTMLSelectElement).value).toBe('')
    expect(document.querySelector('.combo-preview')).toBeNull()
  })
  it('調べるプレビューの根拠チップは凡例ボックスの中にある（第19弾）', () => {
    location.hash = '#/tea'; render(<App />)
    fireEvent.change(screen.getByLabelText('分類（茶類）で絞り込み'), { target: { value: 'green' } })
    const badge = screen.getByText(/組み合わせ全体の根拠/)
    expect(badge.closest('.combo-legend')).toBeTruthy()
    expect(badge.closest('.combo-preview')).toBeTruthy()
  })
  it('お茶詳細では根拠レベルのバッジが凡例ボックスの中にある（第19弾）', () => {
    location.hash = '#/tea/sencha'; render(<App />)
    const legend = document.querySelector('.combo-legend')
    expect(legend).toBeTruthy()
    const badge = legend!.querySelector('.badge')
    expect(badge).toBeTruthy()
    expect(['実測・官能評価あり', '一般的な知見', '探索的な予想', '情報不足']).toContain(badge!.textContent)
  })
  it('品種・系統を調べるの検索窓は残る（第18弾の訂正：検索が主要な導線）', () => {
    location.hash = '#/cultivars'; render(<App />)
    expect(screen.getByLabelText('品種・系統を検索')).toBeTruthy()
  })
  it('成分一覧には検索窓が無く、全件表示で説明段落が画面最下部にある（第19弾）', () => {
    location.hash = '#/compounds'; render(<App />)
    // 検索窓（入力欄）は無い
    expect(screen.queryByLabelText('成分を検索')).toBeNull()
    expect(document.querySelector('input.search')).toBeNull()
    // 一覧は全件表示（カード数が収録成分数と一致する）
    const cards = document.querySelectorAll('article.temporal-card')
    expect(cards.length).toBe(compounds.length)
    // 説明段落は最後のカードより下（画面最下部）にあり、検索の使い方には触れていない
    const desc = screen.getByText(/香味や味に寄与することが研究で示された化学成分です/)
    const lastCard = cards[cards.length - 1]
    expect(lastCard.compareDocumentPosition(desc) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(desc.textContent).not.toMatch(/探せます|検索/)
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
    // 第12弾: 要約の先頭は「組み合わせの味わい」で、選択内容を繰り返す見出し（○○ × ○○）は出ない
    expect(summary.querySelector('.pair-character-head')?.textContent).toContain('組み合わせの味わい（推測）')
    expect(summary.querySelector('h3')).toBeNull()
    expect(summary.textContent).not.toContain('×')
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

// 実機フィードバック第12弾（2026-10-31）: 結果エリアの並びの再構成。
// 先頭は「組み合わせの味わい」（プルダウン／タブのすぐ下）、選択内容を繰り返す
// 見出し（○○ × ○○）は出さず、根拠区分チップ・同種ペア注記・第2層の土台注記は
// メタ情報として結果エリア下部の注記群（.pair-summary-notes）に置く。
describe('実機フィードバック第12弾：結果エリアの並び（味わいが先頭・見出しなし・注記は下部）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })
  const isBefore = (a: Element, b: Element) =>
    (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0

  it('異種ペア：先頭が組み合わせの味わいで、注記群はその後ろにある', () => {
    location.hash = '#/pair'; render(<App />)
    // 軸を指定して第2層の土台注記を出す（第4弾の実績シナリオ）
    fireEvent.change(screen.getByLabelText('お茶'), { target: { value: 'matcha' } })
    fireEvent.change(screen.getByLabelText('お茶の品種（任意）'), { target: { value: 'harumidori' } })
    fireEvent.change(screen.getByLabelText('お茶の産地（任意）'), { target: { value: 'region:murakami' } })
    fireEvent.change(screen.getByLabelText('カカオの産地（任意）'), { target: { value: 'ecuador' } })
    fireEvent.change(screen.getByLabelText('カカオの系統（任意）'), { target: { value: 'genetic:gen-amelonado' } })
    const summary = screen.getByLabelText('組み合わせの結果（要約）')
    const character = summary.querySelector('.pair-character')
    expect(character).toBeTruthy()
    // 結果エリアの先頭要素が味わいセクション（間に見出し・チップ・注記を挟まない）
    expect(summary.firstElementChild).toBe(character)
    expect(character!.querySelector('.pair-character-head')?.textContent).toContain('組み合わせの味わい（推測）')
    // 選択内容を繰り返す見出しは無い
    expect(summary.querySelector('h3')).toBeNull()
    expect(summary.textContent).not.toContain('×')
    // 下部の注記群：味わいより後ろにあり、根拠区分チップと第2層注記を含む
    const notes = summary.querySelector('.pair-summary-notes')
    expect(notes).toBeTruthy()
    expect(isBefore(character!, notes!)).toBe(true)
    expect(notes!.querySelector('.badge')).toBeTruthy()
    expect(notes!.textContent).toContain('組み合わせの推測（第2層）としてこの結果の土台になっています')
  })

  it('同種ペア：味わいが先頭で、同種ペア注記も下部の注記群にある', () => {
    location.hash = '#/pair'; render(<App />)
    // 左をお茶に切り替えてお茶同士にする
    fireEvent.click(screen.getByRole('button', { name: /左の種類を切り替える/ }))
    const summary = screen.getByLabelText('組み合わせの結果（要約）')
    const character = summary.querySelector('.pair-character')
    expect(character).toBeTruthy()
    expect(summary.firstElementChild).toBe(character)
    expect(summary.querySelector('h3')).toBeNull()
    const notes = summary.querySelector('.pair-summary-notes')
    expect(notes).toBeTruthy()
    expect(isBefore(character!, notes!)).toBe(true)
    expect(notes!.textContent).toContain('お茶同士のブレンドを直接調べた官能研究は確認できていない')
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
  it('お茶一覧：プルダウン連動で、両立しない選択肢は出ない（隠す方式・2026-10-31 第2弾）', () => {
    location.hash = '#/tea'; render(<App />)
    // 品種を先に選ぶと、分類側で両立しない茶類は選択肢自体に出ない（グレーアウトではない）
    fireEvent.change(screen.getByLabelText('品種で絞り込み'), { target: { value: 'yabukita' } })
    const kindSel = screen.getByLabelText('分類（茶類）で絞り込み') as HTMLSelectElement
    const kindValues = [...kindSel.options].map((o) => o.value)
    expect(kindValues).toContain('black') // やぶきたは紅茶（製法ルール）でも両立する
    expect(kindValues).not.toContain('dark') // 黒茶とは両立しないので出ない
    expect([...kindSel.options].every((o) => !o.disabled)).toBe(true) // disabled は使わない
    // 分類を先に選ぶと、両立しない品種はプルダウンから消える
    cleanup(); localStorage.clear(); location.hash = '#/tea'; render(<App />)
    fireEvent.change(screen.getByLabelText('分類（茶類）で絞り込み'), { target: { value: 'dark' } })
    const cultivarSel = screen.getByLabelText('品種で絞り込み') as HTMLSelectElement
    const cultivarValues = [...cultivarSel.options].map((o) => o.value)
    expect(cultivarValues).not.toContain('yabukita')
    // 結果は空にならず、行き止まりが無い
    expect(screen.queryByText(/見つかりませんでした/)).toBeNull()
    expect(cardTexts().length).toBeGreaterThan(0)
  })
  it('お茶一覧：産地プルダウンで長崎（地域）まで選べる', () => {
    location.hash = '#/tea'; render(<App />)
    const regionSel = screen.getByLabelText('産地で絞り込み') as HTMLSelectElement
    const values = [...regionSel.options].map((o) => o.value)
    expect(values).toContain('region:nagasaki')
    expect(values).toContain('日本')
    fireEvent.change(regionSel, { target: { value: 'region:nagasaki' } })
    const texts = cardTexts()
    expect(texts.some((t) => t.includes('長崎'))).toBe(true)
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

describe('UI改善：絞り込みのメイン化・チョコ種類追加・系統統合・お茶産地（2026-10-30）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })
  const cardTexts = () => [...document.querySelectorAll('.item-card')].map((el) => el.textContent ?? '')

  it('調べる画面の絞り込みは大きなコントロール（filter-hero）で表示される', () => {
    location.hash = '#/tea'; render(<App />)
    expect(document.querySelector('.filter-hero')).toBeTruthy()
    expect(document.querySelectorAll('.filter-hero .big-select').length).toBe(3)
    cleanup()
    location.hash = '#/choco'; render(<App />)
    expect(document.querySelector('.filter-hero')).toBeTruthy()
    expect(document.querySelectorAll('.filter-hero .big-select').length).toBe(3)
  })
  it('チョコ一覧：分類プルダウンにルビーがあり、選ぶとルビーのカードが出る', () => {
    location.hash = '#/choco'; render(<App />)
    fireEvent.change(screen.getByLabelText('分類（種類）で絞り込み'), { target: { value: 'ruby' } })
    const texts = cardTexts()
    expect(texts.some((t) => t.includes('ルビーチョコレート'))).toBe(true)
    expect(texts.some((t) => t.includes('ミルクチョコレート'))).toBe(false)
  })
  it('ルビー詳細ではホイールと官能研究の出典が出て、系統ではなく種類として説明される', () => {
    location.hash = '#/choco/ruby-chocolate'; render(<App />)
    expect(screen.getByLabelText('フレーバーホイール')).toBeTruthy()
    expect(screen.getAllByText(/Šeremet/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/遺伝的な系統ではなく/).length).toBeGreaterThan(0)
  })
  it('ブロンド詳細では一般的知見レベルのプロファイルと査読研究の出典が出る', () => {
    location.hash = '#/choco/blond-chocolate'; render(<App />)
    expect(screen.getAllByText(/Aydın/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/実験室で調製/).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Valrhona/).length).toBeGreaterThan(0)
  })
  it('組み合わせ画面：系統は1つのプルダウンに統合され、カタカナ主表記で選べる', () => {
    location.hash = '#/pair'; render(<App />)
    const sel = screen.getByLabelText('カカオの系統（任意）') as HTMLSelectElement
    const optionTexts = [...sel.querySelectorAll('option')].map((o) => o.textContent ?? '')
    expect(optionTexts.some((t) => t.includes('クリオロ（Criollo）'))).toBe(true)
    expect(optionTexts.some((t) => t.includes('ナシオナル（Nacional）'))).toBe(true)
    expect(optionTexts.some((t) => t.includes('フォラステロ（Forastero）'))).toBe(true)
    // 折りたたみ（details）には隠れていない
    expect(sel.closest('details')).toBeNull()
    fireEvent.change(sel, { target: { value: 'genetic:gen-nacional' } })
    expect(screen.getByText('カカオの系統：ナシオナル（Nacional）')).toBeTruthy()
    expect(screen.getByText('分類・集団レベルの特徴に基づく参考情報')).toBeTruthy()
  })
  it('組み合わせ画面：チョコは自由化され、系統を選んでも実在の産地が隠れない（指示5）', () => {
    location.hash = '#/pair'; render(<App />)
    fireEvent.change(screen.getByLabelText('カカオの系統（任意）'), { target: { value: 'genetic:gen-criollo' } })
    const originSel = screen.getByLabelText('カカオの産地（任意）') as HTMLSelectElement
    const values = [...originSel.options].map((o) => o.value)
    expect(values).toContain('venezuela')
    expect(values).toContain('ghana') // 以前は連動で隠れていた実在の産地
    expect(values).toContain('tanzania')
    expect(values.length).toBe(9) // 指定しない＋全8産地
    // 逆向き：産地を選んでも系統は隠れない
    fireEvent.change(originSel, { target: { value: 'ghana' } })
    const lineageSel = screen.getByLabelText('カカオの系統（任意）') as HTMLSelectElement
    const lineageValues = [...lineageSel.options].map((o) => o.value)
    expect(lineageValues).toContain('genetic:gen-criollo')
    expect(lineageValues).toContain('traditional:trad-forastero')
    // 階層バッジつきの産地カードも自由化した組み合わせで出る
    expect(screen.getByText('カカオの産地：ガーナ')).toBeTruthy()
  })
  it('組み合わせ画面：クローンを選んだときだけ産地が記録のある産地に絞られる（指示5の例外）', () => {
    location.hash = '#/pair'; render(<App />)
    fireEvent.change(screen.getByLabelText('カカオの系統（任意）'), { target: { value: 'clone:ccn-51' } })
    const originSel = screen.getByLabelText('カカオの産地（任意）') as HTMLSelectElement
    const values = [...originSel.options].map((o) => o.value)
    expect(values).toEqual(['', 'ecuador']) // CCN-51 の記録産地はエクアドルだけ
    // 記録の無いクローン（ICS-95）は絞られない
    fireEvent.change(screen.getByLabelText('カカオの系統（任意）'), { target: { value: 'clone:ics-95' } })
    const after = [...(screen.getByLabelText('カカオの産地（任意）') as HTMLSelectElement).options].map((o) => o.value)
    expect(after.length).toBe(9)
  })
  it('組み合わせ画面：チョコの産地も折りたたみに隠れていない', () => {
    location.hash = '#/pair'; render(<App />)
    const sel = screen.getByLabelText('カカオの産地（任意）')
    expect(sel.closest('details')).toBeNull()
  })
  it('組み合わせ画面：お茶に分類と産地の指定がある（産地は階層判定つき）', () => {
    location.hash = '#/pair'; render(<App />)
    expect(screen.getByLabelText('お茶')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('お茶の産地（任意）'), { target: { value: 'スリランカ' } })
    expect(screen.getByText('お茶の産地：スリランカ')).toBeTruthy()
    expect(screen.getByText('使えるデータがないため不使用')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('お茶の産地（任意）'), { target: { value: '日本' } })
    expect(screen.getByText('お茶の産地：日本')).toBeTruthy()
  })
  it('組み合わせ画面：お茶の産地で長崎（地域）まで選べて、地域の注記カードが出る', () => {
    location.hash = '#/pair'; render(<App />)
    const originSel = screen.getByLabelText('お茶の産地（任意）') as HTMLSelectElement
    const values = [...originSel.options].map((o) => o.value)
    expect(values).toContain('region:nagasaki')
    expect(values).toContain('region:zhejiang')
    expect(values).toContain('日本')
    fireEvent.change(originSel, { target: { value: 'region:nagasaki' } })
    expect(screen.getByText('お茶の産地：長崎')).toBeTruthy()
  })
  it('組み合わせ画面：産地と品種が連動する（日本を選ぶと他国の品種は出ない）', () => {
    location.hash = '#/pair'; render(<App />)
    const cultivarSel = screen.getByLabelText('お茶の品種（任意）') as HTMLSelectElement
    expect([...cultivarSel.options].map((o) => o.value)).toContain('qingxin-oolong')
    fireEvent.change(screen.getByLabelText('お茶の産地（任意）'), { target: { value: '日本' } })
    const after = [...(screen.getByLabelText('お茶の品種（任意）') as HTMLSelectElement).options].map((o) => o.value)
    expect(after).not.toContain('qingxin-oolong')
  })
  it('組み合わせ画面：お茶の分類（大分類）を選ぶと、その分類の代表がペア対象になる', () => {
    location.hash = '#/pair'; render(<App />)
    const sel = screen.getByLabelText('お茶') as HTMLSelectElement
    const values = [...sel.querySelectorAll('option')].map((o) => o.value)
    // 大分類と具体的なお茶が1つのプルダウンに入っている（調べる画面と共通）
    expect(values).toContain('black')
    expect(values).toContain('black-tea')
    expect(values).toContain('oolong-tea')
    fireEvent.change(sel, { target: { value: 'black' } })
    const summary = screen.getByLabelText('組み合わせの結果（要約）')
    // 第12弾: 結果エリアに選択内容の見出し（○○ × ○○）は出ない。
    // 分類の代表（紅茶）がペア対象になったことは、お気に入りに保存される種別つきIDで確認する
    // （第15弾でペアリングの履歴記録は廃止したため、履歴では確認しない）
    expect(summary.textContent).not.toContain('×')
    fireEvent.click(screen.getByRole('button', { name: '☆ お気に入り' }))
    const raw = JSON.parse(localStorage.getItem('pairing-app:v1')!) as { favorites: { pairings: string[] }; history: Record<string, unknown> }
    expect(raw.favorites.pairings.some((id) => id.includes('tea:black-tea'))).toBe(true)
    expect('history' in raw).toBe(false)
  })
  it('調べると組み合わせるでプルダウンの選択肢が同じ（指示7）', () => {
    location.hash = '#/tea'; render(<App />)
    const optValues = (label: string) => [...(screen.getByLabelText(label) as HTMLSelectElement).options].map((o) => o.value)
    const teaKindValues = optValues('分類（茶類）で絞り込み')
    const teaOriginValues = optValues('産地で絞り込み')
    cleanup(); localStorage.clear(); location.hash = '#/pair'; render(<App />)
    expect(optValues('お茶')).toEqual(teaKindValues)
    expect(optValues('お茶の産地（任意）')).toEqual(teaOriginValues)
    // チョコ側も同じ：分類・産地・系統の値集合が一致する
    cleanup(); localStorage.clear(); location.hash = '#/choco'; render(<App />)
    const chocoKindValues = optValues('分類（種類）で絞り込み')
    const chocoOriginValues = optValues('産地で絞り込み')
    const chocoLineageValues = optValues('系統で絞り込み')
    cleanup(); localStorage.clear(); location.hash = '#/pair'; render(<App />)
    expect(optValues('チョコレート')).toEqual(chocoKindValues)
    expect(optValues('カカオの産地（任意）')).toEqual(chocoOriginValues)
    expect(optValues('カカオの系統（任意）')).toEqual(chocoLineageValues)
  })
})

describe('実機フィードバック第2弾：保存ボタン位置・タブ・ナビ・戻るボタン', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  it('お気に入りボタンは見出し「組み合わせる」の行の右側にある（第13弾・第15弾で文言統一）', () => {
    location.hash = '#/pair'; render(<App />)
    // 第15弾: 文言は「お気に入り」に統一され、旧文言のボタンは無い
    expect(screen.queryByRole('button', { name: /この組み合わせを保存/ })).toBeNull()
    // 重複していない（ページ内に1つだけ）
    const saveBtns = screen.getAllByRole('button', { name: '☆ お気に入り' })
    expect(saveBtns).toHaveLength(1)
    const saveBtn = saveBtns[0]
    // 見出し行（.page-head-row）の中にあり、見出し「組み合わせる」と同じ行で、その後（右側）
    const headRow = document.querySelector('.page-head-row')
    expect(headRow).toBeTruthy()
    expect(headRow!.contains(saveBtn)).toBe(true)
    const h2 = headRow!.querySelector('h2')
    expect(h2?.textContent).toBe('組み合わせる')
    expect((h2 as Node).compareDocumentPosition(saveBtn) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    // 結果エリアの中には無く、旧来の下部の行（.pair-save-row）は廃止されている
    expect(screen.getByLabelText('組み合わせの結果（要約）').contains(saveBtn)).toBe(false)
    expect(document.querySelector('.pair-save-row')).toBeNull()
    // タブより前（画面の上部）に来ている
    const tabs = document.querySelector('.tabs')
    expect(tabs).toBeTruthy()
    expect((tabs as Node).compareDocumentPosition(saveBtn) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy()
    // 押すと従来どおり保存済みになり、お気に入りに種別つきIDで記録される
    fireEvent.click(saveBtn)
    expect(screen.getByRole('button', { name: '★ お気に入り済み' })).toBeTruthy()
    const savedData = JSON.parse(localStorage.getItem('pairing-app:v1')!) as { favorites: { pairings: string[] } }
    expect(savedData.favorites.pairings).toHaveLength(1)
    expect(savedData.favorites.pairings[0]).toMatch(/^(tea|chocolate):[^+]+\+(tea|chocolate):/)
    // もう一度押すと保存が取り消される（従来どおりのトグル動作）
    fireEvent.click(screen.getByRole('button', { name: '★ お気に入り済み' }))
    const after = JSON.parse(localStorage.getItem('pairing-app:v1')!) as { favorites: { pairings: string[] } }
    expect(after.favorites.pairings).toHaveLength(0)
  })

  it('見出し行の CSS が「見出し・ボタンとも横書き一列」を保証している（第13弾）', async () => {
    const { readFileSync } = await import('node:fs')
    const css = readFileSync('src/App.css', 'utf-8')
    const ruleOf = (selector: string) => {
      const i = css.indexOf(selector)
      expect(i).toBeGreaterThanOrEqual(0)
      return css.slice(i, css.indexOf('}', i))
    }
    // 見出し行は flex で、ボタンは右端へ（3画面共通の .page-head-row）
    expect(ruleOf('.page-head-row {')).toContain('display: flex')
    expect(ruleOf('.page-head-row .pair-save-btn')).toContain('margin-left: auto')
    // 見出し・ボタンとも折り返さない（第11弾の折り返し問題を再発させない）
    expect(ruleOf('.page-head-row h2')).toContain('white-space: nowrap')
    // 単独ルール（行頭から始まる .pair-save-btn）を対象にする
    expect(ruleOf('\n.pair-save-btn {')).toContain('white-space: nowrap')
    // タップ高さ44pxを保つ
    expect(ruleOf('\n.pair-save-btn {')).toContain('min-height: 44px')
    // 旧来の下部行は廃止
    expect(css).not.toContain('.pair-save-row')
  })

  it('タブ切り替えでページ先頭へスクロールしない（指示9）', () => {
    const spy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    location.hash = '#/pair'; render(<App />)
    spy.mockClear() // 初期表示時のルートスクロールは対象外
    fireEvent.click(screen.getByRole('tab', { name: 'お茶' }))
    expect(screen.getByLabelText('フレーバーホイール')).toBeTruthy()
    fireEvent.click(screen.getByRole('tab', { name: 'チョコ' }))
    fireEvent.click(screen.getByRole('tab', { name: '組み合わせの見方' }))
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('上部ナビは1行構成で、お気に入りは文字ボタン・履歴ボタンは無い（第15弾）', async () => {
    const { readFileSync } = await import('node:fs')
    const cssText = readFileSync('src/App.css', 'utf-8')
    render(<App />)
    const nav = screen.getByLabelText('主なメニュー')
    // テキスト項目（お気に入りは⭐︎アイコンでなく文字のボタン）
    for (const t of ['お茶', 'チョコ', '品種・系統', '組み合わせる', 'お気に入り']) {
      expect([...nav.querySelectorAll('button')].some((b) => b.textContent === t)).toBe(true)
    }
    // 「お気に入り・履歴」という複合テキストのボタンは無い
    expect([...nav.querySelectorAll('button')].some((b) => b.textContent?.includes('お気に入り・履歴'))).toBe(false)
    // 履歴ボタンは廃止（お気に入りと同じページに行くため）。アイコンボタン様式も残っていない
    expect([...nav.querySelectorAll('button')].some((b) => b.textContent === '履歴')).toBe(false)
    expect(screen.queryByLabelText('履歴')).toBeNull()
    expect(nav.querySelector('.nav-icon')).toBeNull()
    expect(nav.querySelector('svg')).toBeNull()
    // CSS で1行（nowrap）が指定され、アイコンボタンの規則は残っていない
    expect(cssText).toMatch(/\.app-nav\s*\{[^}]*flex-wrap:\s*nowrap/)
    expect(cssText).not.toContain('.nav-icon')
    // 「お気に入り」ボタンから保存ページへ遷移できる（ページ見出しも「お気に入り」）
    fireEvent.click(screen.getByRole('button', { name: 'お気に入り' }))
    expect(await screen.findByRole('heading', { name: 'お気に入り' })).toBeTruthy()
  })

  it('詳細ページの戻るボタンで前の画面に戻れる（指示4）', async () => {
    location.hash = '#/tea'; render(<App />)
    const card = [...document.querySelectorAll('.item-card')].find((el) => el.textContent?.includes('煎茶'))
    expect(card).toBeTruthy()
    fireEvent.click(card!)
    expect(await screen.findByText('この茶類で確認済みの品種・系統')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '← 戻る' }))
    expect(await screen.findByText('お茶を調べる')).toBeTruthy()
  })

  it('品種・産地の詳細にも戻るボタンがある（指示4）', () => {
    location.hash = '#/cultivar/yabukita'; render(<App />)
    expect(screen.getByRole('button', { name: '← 戻る' })).toBeTruthy()
    cleanup()
    location.hash = '#/origin/ecuador'; render(<App />)
    expect(screen.getByRole('button', { name: '← 戻る' })).toBeTruthy()
    cleanup()
    location.hash = '#/cacao/genetic/gen-nacional'; render(<App />)
    expect(screen.getByRole('button', { name: '← 戻る' })).toBeTruthy()
    cleanup()
    location.hash = '#/tea/sencha'; render(<App />)
    expect(screen.getByRole('button', { name: '← 戻る' })).toBeTruthy()
    cleanup()
    location.hash = '#/choco/milk-chocolate'; render(<App />)
    expect(screen.getByRole('button', { name: '← 戻る' })).toBeTruthy()
  })
})

describe('実機フィードバック第4弾：組み合わせる画面で軸が結果に効く（課題C）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  it('指定した産地・品種・系統が軸の反映セクションに出て、第2層の土台注記は要約下部に出る', () => {
    location.hash = '#/pair'; render(<App />)
    // お茶: 抹茶 × 村上 × はるみどり
    fireEvent.change(screen.getByLabelText('お茶'), { target: { value: 'matcha' } })
    fireEvent.change(screen.getByLabelText('お茶の品種（任意）'), { target: { value: 'harumidori' } })
    fireEvent.change(screen.getByLabelText('お茶の産地（任意）'), { target: { value: 'region:murakami' } })
    // チョコ: ダーク（既定）× エクアドル × アメロナド
    fireEvent.change(screen.getByLabelText('カカオの産地（任意）'), { target: { value: 'ecuador' } })
    fireEvent.change(screen.getByLabelText('カカオの系統（任意）'), { target: { value: 'genetic:gen-amelonado' } })
    const summary = document.querySelector('.pair-summary')
    // 第12弾: 選択内容を繰り返す見出しは結果エリアに出ない（指定内容はプルダウンと軸の反映で確認できる）
    expect(summary?.textContent).not.toContain('村上 × はるみどり × 抹茶')
    // 第2層の土台注記は要約下部の注記群に出る
    expect(summary?.querySelector('.pair-summary-notes')?.textContent).toContain('組み合わせの推測（第2層）としてこの結果の土台になっています')
    // 軸の反映セクション（変わらない理由を含む）に指定内容が出る
    expect(screen.getByText('指定した軸の反映（組み合わせの推測）')).toBeTruthy()
    expect(document.body.textContent).toContain('村上 × はるみどり × 抹茶')
    expect(document.body.textContent).toContain('エクアドル')
    expect(document.body.textContent).toContain('アメロナド')
    expect(document.body.textContent).toContain('寄与を示すものではない')
  })

  it('軸指定時はお茶タブのホイールが組み合わせ側（軸効果込み）と一致する', () => {
    location.hash = '#/pair'; render(<App />)
    fireEvent.change(screen.getByLabelText('お茶'), { target: { value: 'oolong-tea' } })
    fireEvent.change(screen.getByLabelText('お茶の品種（任意）'), { target: { value: 'fenghuang-dancong-group' } })
    fireEvent.change(screen.getByLabelText('お茶の産地（任意）'), { target: { value: 'region:guangdong' } })
    fireEvent.click(screen.getByRole('tab', { name: 'お茶' }))
    // 組み合わせホイールには蘭のノートが出る（素のプロファイルには無い）
    expect(document.body.textContent).toContain('蘭')
  })
})

describe('実機フィードバック第9弾・追加指示A：カカオ含有率フィルターの削除（2026-10-31）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })
  const cardTexts = () => [...document.querySelectorAll('.item-card')].map((el) => el.textContent ?? '')

  it('チョコ一覧に含有率の入力欄が無く、絞り込みは3つのプルダウンだけ', () => {
    location.hash = '#/choco'; render(<App />)
    expect(screen.queryByLabelText('カカオ含有率で絞り込み')).toBeNull()
    expect(document.querySelector('.filter-hero input[type="number"]')).toBeNull()
    expect(document.querySelectorAll('.filter-hero .big-select').length).toBe(3)
    // 下部の説明文にも含有率への言及が無い
    expect(document.body.textContent).not.toContain('含有率')
  })

  it('含有率を削除しても、分類・産地・系統の絞り込みは従来どおり働く', () => {
    location.hash = '#/choco'; render(<App />)
    // 分類で絞る（従来の不変条件：ルビーを選ぶとルビーだけ）
    fireEvent.change(screen.getByLabelText('分類（種類）で絞り込み'), { target: { value: 'ruby' } })
    let texts = cardTexts()
    expect(texts.some((t) => t.includes('ルビーチョコレート'))).toBe(true)
    expect(texts.some((t) => t.includes('ミルクチョコレート'))).toBe(false)
    cleanup(); localStorage.clear()
    location.hash = '#/choco'; render(<App />)
    // 産地で絞る（プロファイルは出ない・産地と関連系統が出る）
    fireEvent.change(screen.getByLabelText('産地で絞り込み'), { target: { value: 'venezuela' } })
    texts = cardTexts()
    expect(texts.some((t) => t.includes('ベネズエラ'))).toBe(true)
    expect(texts.some((t) => t.includes('ミルクチョコレート'))).toBe(false)
  })

  it('旧仕様の保存値（pairing.chocoList.percent）が残っていても一覧は通常表示される', () => {
    localStorage.setItem('pairing.chocoList.percent', JSON.stringify('100'))
    location.hash = '#/choco'; render(<App />)
    // 含有率100%の記録があるアイテムだけに絞られたりしない（全プロファイルが出る）
    const texts = cardTexts()
    expect(texts.some((t) => t.includes('ミルクチョコレート'))).toBe(true)
    expect(texts.some((t) => t.includes('ルビーチョコレート'))).toBe(true)
  })
})

// 実機フィードバック第13弾（追加指示）: お茶を調べる／チョコを調べる画面でも、
// 見出しの横のお気に入りボタン（第15弾で文言統一）で選択中の単体組み合わせを保存でき、
// お気に入りから開くとその画面で同じ選択とプレビューが復元される。
describe('実機フィードバック第13弾（追加）：調べる画面の単体組み合わせ保存と復元', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  it('お茶: 未選択では保存ボタンが無く、軸を選ぶと見出し行に出て保存できる', () => {
    location.hash = '#/tea'; render(<App />)
    // プレビューが組み立たない状態（全軸未指定）ではボタンは出ない
    expect(screen.queryByRole('button', { name: '☆ お気に入り' })).toBeNull()
    fireEvent.change(screen.getByLabelText('分類（茶類）で絞り込み'), { target: { value: 'black-tea' } })
    const btn = screen.getByRole('button', { name: '☆ お気に入り' })
    // 見出し「お茶を調べる」の行（.page-head-row）の中にある
    const headRow = document.querySelector('.page-head-row')
    expect(headRow).toBeTruthy()
    expect(headRow!.contains(btn)).toBe(true)
    expect(headRow!.querySelector('h2')?.textContent).toBe('お茶を調べる')
    expect(screen.getByLabelText('選択中の組み合わせのフレーバー')).toBeTruthy()
    fireEvent.click(btn)
    expect(screen.getByRole('button', { name: '★ お気に入り済み' })).toBeTruthy()
    const savedData = JSON.parse(localStorage.getItem('pairing-app:v1')!) as { favorites: { combos: string[] } }
    expect(savedData.favorites.combos).toEqual(['tea-combo:black-tea|-|-'])
  })

  it('お茶: お気に入りから開くと、同じ選択とプレビューが復元される（往復）', () => {
    localStorage.setItem('pairing-app:v1', JSON.stringify({
      version: 1,
      favorites: { teas: [], chocolates: [], pairings: [], combos: ['tea-combo:black-tea|-|-'] },
      history: { teas: [], chocolates: [], pairings: [] },
    }))
    location.hash = '#/saved'; render(<App />)
    expect(screen.getByText('お気に入りの単体組み合わせ')).toBeTruthy()
    expect(screen.getAllByText(/紅茶/).length).toBeGreaterThan(0) // 組み合わせ名が表示される
    // 第15弾（追加指示）: 「お茶を調べるで開く」ボタンは名称タップと重複するため廃止
    expect(screen.queryByRole('button', { name: /を調べるで開く/ })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '紅茶' }))
    // 遷移し、調べる画面のプルダウン保存値へ選択が書き戻されている
    expect(location.hash).toBe('#/tea')
    expect(JSON.parse(localStorage.getItem('pairing.teaList.kind')!)).toBe('black-tea')
    cleanup(); location.hash = '#/tea'; render(<App />)
    expect((screen.getByLabelText('分類（茶類）で絞り込み') as HTMLSelectElement).value).toBe('black-tea')
    expect(screen.getByLabelText('選択中の組み合わせのフレーバー')).toBeTruthy()
    // 復元された組み合わせは保存済みとして表示される
    expect(screen.getByRole('button', { name: '★ お気に入り済み' })).toBeTruthy()
  })

  it('チョコ: 産地を選んで保存し、お気に入りから開くと復元される（往復）', () => {
    location.hash = '#/choco'; render(<App />)
    expect(screen.queryByRole('button', { name: '☆ お気に入り' })).toBeNull()
    const originSel = screen.getByLabelText('産地で絞り込み') as HTMLSelectElement
    const originValue = [...originSel.options].map((o) => o.value).find((v) => v !== '')!
    expect(originValue).toBeTruthy()
    fireEvent.change(originSel, { target: { value: originValue } })
    const btn = screen.getByRole('button', { name: '☆ お気に入り' })
    const headRow = document.querySelector('.page-head-row')
    expect(headRow).toBeTruthy()
    expect(headRow!.contains(btn)).toBe(true)
    expect(headRow!.querySelector('h2')?.textContent).toBe('チョコを調べる')
    fireEvent.click(btn)
    const savedData = JSON.parse(localStorage.getItem('pairing-app:v1')!) as { favorites: { combos: string[] } }
    expect(savedData.favorites.combos).toEqual([`choco-combo:-|${originValue}|-`])
    cleanup(); location.hash = '#/saved'; render(<App />)
    // 第15弾（追加指示）: 「チョコを調べるで開く」ボタンは無く、名称タップで開く
    expect(screen.queryByRole('button', { name: /を調べるで開く/ })).toBeNull()
    const combosSection = [...document.querySelectorAll('section')].find((s) => s.querySelector('h3')?.textContent === 'お気に入りの単体組み合わせ')
    const nameLink = combosSection?.querySelector('button.saved-entry-link')
    expect(nameLink).toBeTruthy()
    fireEvent.click(nameLink!)
    expect(location.hash).toBe('#/choco')
    expect(JSON.parse(localStorage.getItem('pairing.chocoList.originId')!)).toBe(originValue)
    cleanup(); location.hash = '#/choco'; render(<App />)
    expect((screen.getByLabelText('産地で絞り込み') as HTMLSelectElement).value).toBe(originValue)
    expect(screen.getByLabelText('選択中の組み合わせのフレーバー')).toBeTruthy()
    expect(screen.getByRole('button', { name: '★ お気に入り済み' })).toBeTruthy()
  })

  it('旧データ（combos 無し・ペア保存あり）でもお気に入り画面が開ける（後方互換）', () => {
    localStorage.setItem('pairing-app:v1', JSON.stringify({
      version: 1,
      favorites: { teas: [], chocolates: [], pairings: ['sencha+dark-roasted'] },
      history: { teas: [], chocolates: [], pairings: [] },
    }))
    location.hash = '#/saved'; render(<App />)
    expect(screen.getByText(/煎茶 × ダークチョコレート（焙煎）/)).toBeTruthy()
    expect(screen.getByText('お気に入りの単体組み合わせ')).toBeTruthy()
  })
})

// 実機フィードバック第14弾（2026-10-31）: お気に入り・履歴のエントリは、文字を
// タップしても対応する画面へ飛べるようにする。ペアは組み合わせる画面で復元され、
// 単体アイテムは詳細ページ、単体組み合わせは調べる画面で復元される。
describe('実機フィードバック第14弾：お気に入り・履歴エントリのタップ遷移', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })
  const emptyFav = { teas: [] as string[], chocolates: [] as string[], pairings: [] as string[], combos: [] as string[] }
  const emptyHist = { teas: [] as string[], chocolates: [] as string[], pairings: [] as string[] }
  const seed = (favorites: typeof emptyFav, history: typeof emptyHist) =>
    localStorage.setItem('pairing-app:v1', JSON.stringify({ version: 1, favorites, history }))
  const persisted = (key: string) => JSON.parse(localStorage.getItem(key)!)

  it('旧データに履歴が残っていても壊れず、履歴セクションは一切出ない（第15弾で履歴全廃）', () => {
    // 第14弾時点のデータ（history あり）を読み込んでも画面が壊れない
    seed(emptyFav, { teas: ['sencha'], chocolates: ['milk-chocolate'], pairings: ['tea:oolong-tea+chocolate:dark-roasted'] })
    location.hash = '#/saved'; render(<App />)
    expect(screen.getByRole('heading', { name: 'お気に入り' })).toBeTruthy()
    expect(screen.queryByText('最近試した組み合わせ')).toBeNull()
    expect(screen.queryByText('最近調べたお茶')).toBeNull()
    expect(screen.queryByText('最近調べたチョコ')).toBeNull()
    // 読み込み後の保存データから履歴は落ちている（無視される）
    const raw = JSON.parse(localStorage.getItem('pairing-app:v1')!) as Record<string, unknown>
    expect('history' in raw).toBe(false)
  })

  it('お気に入りの組み合わせ（同種・お茶同士）: 種別つきIDから両側ともお茶で復元される', () => {
    seed({ ...emptyFav, pairings: ['tea:oolong-tea+tea:sencha'] }, emptyHist)
    location.hash = '#/saved'; render(<App />)
    const entry = screen.getByRole('button', { name: '烏龍茶（青茶）（お茶） × 煎茶（お茶）' })
    // タップできることが分かるリンク様式になっている
    expect(entry.classList.contains('linklike')).toBe(true)
    expect(entry.classList.contains('saved-entry-link')).toBe(true)
    fireEvent.click(entry)
    expect(location.hash).toBe('#/pair')
    expect(persisted('pairing.pair.leftType')).toBe('tea')
    expect(persisted('pairing.pair.rightType')).toBe('tea')
    expect(persisted('pairing.pair.left.teaKind')).toBe('oolong-tea')
    expect(persisted('pairing.pair.right.teaKind')).toBe('sencha')
    cleanup(); location.hash = '#/pair'; render(<App />)
    // 同種ペアとして結果が組み立ち、同種ペアの注記が要約に出る。
    // このペアは保存済みなので、お気に入りボタンは「★ お気に入り済み」表示。
    expect(screen.getByRole('button', { name: '★ お気に入り済み' })).toBeTruthy()
    expect(screen.getByText(/お茶同士のブレンドを直接調べた官能研究は確認できていない/)).toBeTruthy()
  })

  it('お気に入りの組み合わせ: 文字タップでも組み合わせる画面に復元される', () => {
    seed({ ...emptyFav, pairings: ['tea:sencha+chocolate:milk-chocolate'] }, emptyHist)
    location.hash = '#/saved'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '煎茶 × ミルクチョコレート' }))
    expect(location.hash).toBe('#/pair')
    expect(persisted('pairing.pair.left.teaKind')).toBe('sencha')
    expect(persisted('pairing.pair.right.chocoKind')).toBe('milk-chocolate')
    cleanup(); location.hash = '#/pair'; render(<App />)
    expect((screen.getByLabelText('お茶') as HTMLSelectElement).value).toBe('sencha')
    expect((screen.getByLabelText('チョコレート') as HTMLSelectElement).value).toBe('milk-chocolate')
    // お気に入り登録済みのペアなので、ボタンは「お気に入り済み」表示になる
    expect(screen.getByRole('button', { name: '★ お気に入り済み' })).toBeTruthy()
  })

  it('お気に入りのお茶・チョコ: 文字タップで各アイテムの詳細ページへ飛ぶ', () => {
    seed({ ...emptyFav, teas: ['sencha'], chocolates: ['ruby-chocolate'] }, emptyHist)
    location.hash = '#/saved'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '煎茶' }))
    expect(location.hash).toBe('#/tea/sencha')
    cleanup(); location.hash = '#/saved'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'ルビーチョコレート' }))
    expect(location.hash).toBe('#/choco/ruby-chocolate')
  })

  it('お気に入りの単体組み合わせ: 名称タップで開ける（「開く」ボタンは第15弾で廃止し一本化）', () => {
    seed({ ...emptyFav, combos: ['tea-combo:black-tea|-|-'] }, emptyHist)
    location.hash = '#/saved'; render(<App />)
    // 名称タップと同じ遷移をする「開く」ボタンは重複のため無い（第15弾・追加指示）
    expect(screen.queryByRole('button', { name: /を調べるで開く/ })).toBeNull()
    // 名称そのものをタップで開ける
    fireEvent.click(screen.getByRole('button', { name: '紅茶' }))
    expect(location.hash).toBe('#/tea')
    expect(persisted('pairing.teaList.kind')).toBe('black-tea')
    cleanup(); location.hash = '#/tea'; render(<App />)
    expect((screen.getByLabelText('分類（茶類）で絞り込み') as HTMLSelectElement).value).toBe('black-tea')
    expect(screen.getByLabelText('選択中の組み合わせのフレーバー')).toBeTruthy()
  })

  it('解決できないエントリはテキストのままでボタンにならない', () => {
    seed({ ...emptyFav, teas: ['no-such-tea'], pairings: ['tea:no-such-item+chocolate:dark-roasted'] }, emptyHist)
    location.hash = '#/saved'; render(<App />)
    expect(screen.getByText(/no-such-item × ダークチョコレート（焙煎）/)).toBeTruthy()
    // 遷移用のエントリボタンにはならない（「外す」ボタンは付くが、それは遷移ではない）
    const entryLinks = [...document.querySelectorAll('button.saved-entry-link')]
    expect(entryLinks.some((b) => b.textContent?.includes('no-such-item'))).toBe(false)
    expect(screen.getByText('no-such-tea')).toBeTruthy()
    expect(entryLinks.some((b) => b.textContent === 'no-such-tea')).toBe(false)
  })
})

// 実機フィードバック第15弾（2026-10-31）: お気に入り機能の使い勝手一新。
// - ボタンが無いページにも全部入れる（品種・系統・産地・組み合わせページ・比較ページ）
// - 文言は「お気に入り」に統一（「この組み合わせを保存」は廃止）
// - お気に入り画面で直接外せる
// - 履歴機能は全廃（最近試した組み合わせ／最近調べたお茶・チョコとも削除し、記録も停止）
// - JSON書き出し・復元は削除
describe('実機フィードバック第15弾：お気に入り機能の一新', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })
  const savedData = () => JSON.parse(localStorage.getItem('pairing-app:v1')!) as { favorites: Record<string, string[]>; history: Record<string, string[]> }
  const seedFav = (favorites: Record<string, string[]>, history: Record<string, string[]> = {}) =>
    localStorage.setItem('pairing-app:v1', JSON.stringify({
      version: 1,
      favorites: { teas: [], chocolates: [], pairings: [], combos: [], cultivars: [], lineages: [], origins: [], ...favorites },
      history: { teas: [], chocolates: [], ...history },
    }))

  it('品種ページ（おくみどり）: 名前の横のボタンで品種そのものを保存できる', () => {
    location.hash = '#/cultivar/okumidori'; render(<App />)
    const btn = screen.getByRole('button', { name: '☆ お気に入り' })
    // 見出し（品種名）の中にボタンがある
    expect(screen.getByRole('heading', { name: /おくみどり/ }).contains(btn)).toBe(true)
    fireEvent.click(btn)
    expect(screen.getByRole('button', { name: '★ お気に入り済み' })).toBeTruthy()
    expect(savedData().favorites.cultivars).toEqual(['okumidori'])
  })

  it('系統ページ（遺伝集団 Nacional）と産地ページ（マダガスカル）にもボタンがある', () => {
    location.hash = '#/cacao/genetic/gen-nacional'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '☆ お気に入り' }))
    expect(savedData().favorites.lineages).toEqual(['genetic:gen-nacional'])
    cleanup(); location.hash = '#/origin/madagascar'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '☆ お気に入り' }))
    expect(savedData().favorites.origins).toEqual(['madagascar'])
    cleanup(); location.hash = '#/cacao/traditional/trad-criollo'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '☆ お気に入り' }))
    expect(savedData().favorites.lineages).toContain('traditional:trad-criollo')
    cleanup(); location.hash = '#/cacao/clone/ccn-51'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '☆ お気に入り' }))
    expect(savedData().favorites.lineages).toContain('clone:ccn-51')
  })

  it('お気に入り画面に品種・系統・産地のセクションがあり、名称タップで各ページへ戻れる', () => {
    seedFav({ cultivars: ['okumidori'], lineages: ['genetic:gen-nacional'], origins: ['madagascar'] })
    location.hash = '#/saved'; render(<App />)
    expect(screen.getByText('お気に入りの品種')).toBeTruthy()
    expect(screen.getByText('お気に入りの系統')).toBeTruthy()
    expect(screen.getByText('お気に入りの産地')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'おくみどり' }))
    expect(location.hash).toBe('#/cultivar/okumidori')
    cleanup(); location.hash = '#/saved'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'Nacional' }))
    expect(location.hash).toBe('#/cacao/genetic/gen-nacional')
    cleanup(); location.hash = '#/saved'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: 'マダガスカル' }))
    expect(location.hash).toBe('#/origin/madagascar')
  })

  it('お気に入り画面の「外す」ボタンで、その場で解除できる（各ページへ行かなくてよい）', () => {
    seedFav({ teas: ['sencha'], cultivars: ['okumidori'] })
    location.hash = '#/saved'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '煎茶をお気に入りから外す' }))
    expect(savedData().favorites.teas).toEqual([])
    expect(screen.queryByRole('button', { name: '煎茶' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'おくみどりをお気に入りから外す' }))
    expect(savedData().favorites.cultivars).toEqual([])
  })

  it('組み合わせページ（お茶）: その組み合わせを単体組み合わせとして保存でき、調べる画面で復元される', () => {
    location.hash = '#/combo/tea/green.nagasaki.yabukita'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '☆ お気に入り' }))
    expect(savedData().favorites.combos).toEqual(['tea-combo:green|region:nagasaki|yabukita'])
    cleanup(); location.hash = '#/saved'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '長崎 × やぶきた × 緑茶' }))
    expect(location.hash).toBe('#/tea')
    expect(JSON.parse(localStorage.getItem('pairing.teaList.kind')!)).toBe('green')
    expect(JSON.parse(localStorage.getItem('pairing.teaList.region')!)).toBe('region:nagasaki')
    expect(JSON.parse(localStorage.getItem('pairing.teaList.cultivarId')!)).toBe('yabukita')
  })

  it('組み合わせページ（チョコ）からも保存できる', () => {
    location.hash = '#/combo/choco/dark.ecuador.genetic:gen-nacional'; render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '☆ お気に入り' }))
    expect(savedData().favorites.combos).toEqual(['choco-combo:dark|ecuador|genetic:gen-nacional'])
  })

  it('品種の比較ページのパネルからも保存できる', () => {
    location.hash = '#/compare-cultivars'; render(<App />)
    const btns = screen.getAllByRole('button', { name: '☆ お気に入り' })
    expect(btns.length).toBe(2) // 品種1・品種2のパネルに1つずつ
    fireEvent.click(btns[0])
    expect(savedData().favorites.cultivars).toEqual(['yabukita'])
  })

  it('文言統一: アイテム詳細でも「お気に入り」で、旧文言のボタンは無い', () => {
    location.hash = '#/tea/sencha'; render(<App />)
    expect(screen.queryByRole('button', { name: /この組み合わせを保存/ })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '☆ お気に入り' }))
    expect(screen.getByRole('button', { name: '★ お気に入り済み' })).toBeTruthy()
    expect(savedData().favorites.teas).toEqual(['sencha'])
  })

  it('履歴セクションと書き出し・復元は無く、ページ見出しは「お気に入り」だけ', () => {
    // 旧データに履歴が入っていても、履歴は表示されない
    seedFav({}, { teas: ['sencha'], chocolates: ['milk-chocolate'] })
    location.hash = '#/saved'; render(<App />)
    expect(screen.getByRole('heading', { name: 'お気に入り' })).toBeTruthy()
    expect(screen.queryByText('最近試した組み合わせ')).toBeNull()
    expect(screen.queryByText('最近調べたお茶')).toBeNull()
    expect(screen.queryByText('最近調べたチョコ')).toBeNull()
    expect(screen.queryByRole('button', { name: 'この履歴を消す' })).toBeNull()
    expect(screen.queryByText('データの書き出し・復元')).toBeNull()
    expect(screen.queryByText('JSONで書き出す')).toBeNull()
    expect(screen.queryByText('JSONを読み込む')).toBeNull()
    // 履歴にあったアイテムがお気に入りとして復活したりもしない
    expect(screen.queryByRole('button', { name: '煎茶' })).toBeNull()
  })

  it('組み合わせる画面や詳細ページを使っても、履歴は記録されない', () => {
    location.hash = '#/pair'; render(<App />)
    expect(screen.getByText('組み合わせの味わい（推測）')).toBeTruthy()
    cleanup(); location.hash = '#/tea/sencha'; render(<App />)
    expect(screen.getByRole('heading', { name: /煎茶/ })).toBeTruthy()
    const raw = JSON.parse(localStorage.getItem('pairing-app:v1')!) as Record<string, unknown>
    expect('history' in raw).toBe(false)
  })
})
