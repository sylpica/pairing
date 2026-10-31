// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'
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
    // 分類の代表（紅茶）がペア対象になったことは、履歴の種別つきIDで確認する
    expect(summary.textContent).not.toContain('×')
    const raw = JSON.parse(localStorage.getItem('pairing-app:v1')!) as { history: { pairings: string[] } }
    expect(raw.history.pairings.some((id) => id.includes('tea:black-tea'))).toBe(true)
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

  it('「この組み合わせを保存」は結果の下側にある（タイトル直下ではない・指示6）', () => {
    location.hash = '#/pair'; render(<App />)
    const saveBtn = screen.getByRole('button', { name: /この組み合わせを保存/ })
    const summary = screen.getByLabelText('組み合わせの結果（要約）')
    expect(summary.contains(saveBtn)).toBe(false) // 要約（タイトル直下）の中には無い
    const tabs = document.querySelector('.tabs')
    expect(tabs).toBeTruthy()
    // タブ・詳細より後（結果ブロックの末尾側）に配置されている
    expect((tabs as Node).compareDocumentPosition(saveBtn) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    // 押すと保存済みになる
    fireEvent.click(saveBtn)
    expect(screen.getByRole('button', { name: /保存済み/ })).toBeTruthy()
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

  it('上部ナビは1行構成で、お気に入り・履歴はアイコンボタン（指示10）', async () => {
    const { readFileSync } = await import('node:fs')
    const cssText = readFileSync('src/App.css', 'utf-8')
    render(<App />)
    const nav = screen.getByLabelText('主なメニュー')
    // テキスト項目は従来どおり
    for (const t of ['お茶', 'チョコ', '品種・系統', '組み合わせる']) {
      expect([...nav.querySelectorAll('button')].some((b) => b.textContent === t)).toBe(true)
    }
    // 「お気に入り・履歴」のテキストボタンは無い
    expect([...nav.querySelectorAll('button')].some((b) => b.textContent?.includes('お気に入り・履歴'))).toBe(false)
    // 星と履歴のアイコンボタン（アクセシブルな名前つき・テキストなし・SVG入り）
    for (const label of ['お気に入り', '履歴']) {
      const btn = screen.getByLabelText(label)
      expect(btn.tagName).toBe('BUTTON')
      expect(btn.textContent).toBe('')
      expect(btn.querySelector('svg')).toBeTruthy()
      expect(btn.classList.contains('nav-icon')).toBe(true)
    }
    // CSS で1行（nowrap）が指定されている
    expect(cssText).toMatch(/\.app-nav\s*\{[^}]*flex-wrap:\s*nowrap/)
    expect(cssText).toMatch(/\.nav-icon/)
    // アイコンから保存ページへ遷移できる
    fireEvent.click(screen.getByLabelText('お気に入り'))
    expect(await screen.findByText('お気に入り・履歴')).toBeTruthy()
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
