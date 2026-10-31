// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react'
import App from './App'

// 第9弾（自家ブレンド対応）の画面検証。
// 両側の見出しボタンでお茶↔チョコを切り替えられ、お茶同士・チョコ同士でも
// 結果が組み立つこと、同種ペアでは直接研究がない旨の注記が出ること、
// 保存IDに種別が含まれ復元表示できることを確認する。
describe('組み合わせ画面：自家ブレンド（種別切り替え）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  const cols = () => document.querySelectorAll('.pair-col')
  const switchOf = (colIdx: number) => within(cols()[colIdx] as HTMLElement).getByRole('button', { name: /種類を切り替える/ })
  const summaryText = () => screen.getByLabelText('組み合わせの結果（要約）').textContent ?? ''

  it('既定は左チョコ・右お茶で、見出しが切り替えボタンになっている', () => {
    location.hash = '#/pair'; render(<App />)
    expect(cols().length).toBe(2)
    expect(switchOf(0).textContent).toContain('チョコレート')
    expect(switchOf(1).textContent).toContain('お茶')
    // 同種ペアではないため、同種ブレンドの注記は出ない
    expect(summaryText()).not.toContain('同士のブレンドを直接調べた')
  })

  it('左を見出しボタンでお茶に切り替えるとお茶同士になり、注記と区別つきラベル・タブが出る', () => {
    location.hash = '#/pair'; render(<App />)
    fireEvent.click(switchOf(0))
    // 両側ともお茶のプルダウンになり、左右でラベルが区別される
    expect(screen.getByLabelText('左：お茶')).toBeTruthy()
    expect(screen.getByLabelText('右：お茶')).toBeTruthy()
    expect(screen.queryByLabelText('チョコレート')).toBeNull()
    // 同種ブレンドの正直な注記が要約に出る
    expect(summaryText()).toContain('お茶同士のブレンドを直接調べた官能研究は確認できていない')
    expect(summaryText()).toContain('×')
    // タブはアイテム名で区別される（既定は両側とも烏龍茶）
    expect(screen.getAllByRole('tab', { name: '烏龍茶（青茶）' }).length).toBe(2)
    // 左を煎茶に変えるとタブと見出しが追随する
    fireEvent.change(screen.getByLabelText('左：お茶'), { target: { value: 'sencha' } })
    expect(screen.getByRole('tab', { name: '煎茶' })).toBeTruthy()
    expect(summaryText()).toContain('煎茶 × 烏龍茶（青茶）')
    // お茶タブ（煎茶側）を開くとホイールが出る
    fireEvent.click(screen.getByRole('tab', { name: '煎茶' }))
    expect(screen.getByLabelText(/フレーバーホイール/)).toBeTruthy()
  })

  it('右をチョコに切り替えるとチョコ同士になり、チョコ用の注記が出る', () => {
    location.hash = '#/pair'; render(<App />)
    fireEvent.click(switchOf(1))
    expect(screen.getByLabelText('左：チョコレート')).toBeTruthy()
    expect(screen.getByLabelText('右：チョコレート')).toBeTruthy()
    expect(summaryText()).toContain('チョコレート同士のブレンドを直接調べた官能研究は確認できていない')
    expect(summaryText()).toContain('×')
    // チョコ側のプルダウン（産地・系統）も両側に出る
    expect(screen.getByLabelText('左：カカオの産地（任意）')).toBeTruthy()
    expect(screen.getByLabelText('右：カカオの系統（任意）')).toBeTruthy()
    // 右をミルクチョコに変えて、タブ（アイテム名）からホイールが開ける
    fireEvent.change(screen.getByLabelText('右：チョコレート'), { target: { value: 'milk-chocolate' } })
    expect(summaryText()).toContain('ダークチョコレート（焙煎） × ミルクチョコレート')
    fireEvent.click(screen.getByRole('tab', { name: 'ミルクチョコレート' }))
    expect(screen.getByLabelText(/フレーバーホイール/)).toBeTruthy()
  })

  it('切り替えた側の選択は種別ごとに保持され、戻すと復元される', () => {
    location.hash = '#/pair'; render(<App />)
    // 右のお茶を紅茶アイテムに変えてから、右をチョコ→お茶と往復する
    fireEvent.change(screen.getByLabelText('お茶'), { target: { value: 'black-tea' } })
    fireEvent.click(switchOf(1))
    expect(screen.getByLabelText('右：チョコレート')).toBeTruthy()
    fireEvent.click(switchOf(1))
    expect((screen.getByLabelText('お茶') as HTMLSelectElement).value).toBe('black-tea')
  })

  it('お茶同士のペアを保存すると種別つきIDで保存され、お気に入り画面で種別ごと表示される', () => {
    location.hash = '#/pair'; render(<App />)
    fireEvent.click(switchOf(0)) // 左をお茶に
    fireEvent.change(screen.getByLabelText('左：お茶'), { target: { value: 'sencha' } })
    fireEvent.click(screen.getByRole('button', { name: /この組み合わせを保存/ }))
    const raw = localStorage.getItem('pairing-app:v1')
    expect(raw).toBeTruthy()
    const savedData = JSON.parse(raw!) as { favorites: { pairings: string[] } }
    expect(savedData.favorites.pairings).toContain('tea:sencha+tea:oolong-tea')
    // お気に入り・履歴画面では名前と種別つきで表示される（お気に入りと履歴の両方に出る）
    cleanup(); location.hash = '#/saved'; render(<App />)
    expect(screen.getAllByText(/煎茶（お茶） × 烏龍茶（青茶）（お茶）/).length).toBeGreaterThan(0)
  })

  it('旧形式（種別なし）の保存データはお茶×チョコとして読み込まれ表示される', () => {
    localStorage.setItem('pairing-app:v1', JSON.stringify({
      version: 1,
      favorites: { teas: [], chocolates: [], pairings: ['sencha+dark-roasted'] },
      history: { teas: [], chocolates: [], pairings: [] },
    }))
    location.hash = '#/saved'; render(<App />)
    expect(screen.getByText(/煎茶 × ダークチョコレート（焙煎）/)).toBeTruthy()
    // 読み込み時に種別つき形式へ移行して保存し直される
    const raw = JSON.parse(localStorage.getItem('pairing-app:v1')!) as { favorites: { pairings: string[] } }
    expect(raw.favorites.pairings).toContain('tea:sencha+chocolate:dark-roasted')
  })
})

// 実機フィードバック第11弾：組み合わせる画面の側見出しが「お／茶」「チョ／コレ／ート」の
// ように縦に折り返す問題の修正。種別名は専用要素（.col-head-name）に入れ、CSS で
// nowrap＋flex:none を保証し、収まらない場合はヒントを丸ごと次行へ落とす構造にする。
describe('組み合わせ画面：見出しの横書き一列（第11弾）', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })

  const cols = () => document.querySelectorAll('.pair-col')
  const switchOf = (colIdx: number) => within(cols()[colIdx] as HTMLElement).getByRole('button', { name: /種類を切り替える/ })

  it('種別名は .col-head-name の単独要素に入り、ヒントとは別要素になっている（両側・切替後も）', () => {
    location.hash = '#/pair'; render(<App />)
    const nameOf = (i: number) => switchOf(i).querySelector('.col-head-name')
    const hintOf = (i: number) => switchOf(i).querySelector('.col-head-switch-hint')
    expect(nameOf(0)?.textContent).toBe('チョコレート')
    expect(nameOf(1)?.textContent).toBe('お茶')
    expect(hintOf(0)?.textContent).toContain('お茶に切替')
    expect(hintOf(1)?.textContent).toContain('チョコレートに切替')
    // 切り替えた後も同じ構造で、名前とヒントが入れ替わる
    fireEvent.click(switchOf(0))
    expect(nameOf(0)?.textContent).toBe('お茶')
    expect(hintOf(0)?.textContent).toContain('チョコレートに切替')
    fireEvent.click(switchOf(1))
    expect(nameOf(1)?.textContent).toBe('チョコレート')
    expect(hintOf(1)?.textContent).toContain('お茶に切替')
  })

  it('CSS が「名前は折り返さない・ヒントは丸ごと次行へ」の構造を保証している', async () => {
    const { readFileSync } = await import('node:fs')
    const css = readFileSync('src/App.css', 'utf-8')
    const ruleOf = (selector: string) => {
      const i = css.indexOf(selector)
      expect(i).toBeGreaterThanOrEqual(0)
      return css.slice(i, css.indexOf('}', i))
    }
    // 種別名：折り返し禁止＋縮み禁止
    const nameRule = ruleOf('.col-head-name')
    expect(nameRule).toContain('white-space: nowrap')
    expect(nameRule).toContain('flex: none')
    // ボタン：要素単位で次行へ落とせる（名前が文字単位で潰れない）
    expect(ruleOf('.col-head-switch {')).toContain('flex-wrap: wrap')
    // ヒントも丸ごと1行を保つ
    expect(ruleOf('.col-head-switch-hint')).toContain('white-space: nowrap')
    // 極狭幅では組み合わせ列を1列に落とす
    const narrow = css.slice(css.indexOf('@media (max-width: 340px)'))
    expect(narrow.slice(0, 200)).toContain('.pair-layout')
    expect(narrow.slice(0, 200)).toContain('grid-template-columns: 1fr')
  })

  it('視認性の構造ガード（第11弾の全体監査で追加した CSS が残っている）', async () => {
    const { readFileSync } = await import('node:fs')
    const css = readFileSync('src/App.css', 'utf-8')
    // 狭幅でナビが画面外にはみ出さないよう、折り返しを許可する
    const navStart = css.indexOf('.app-nav { width: 100%')
    expect(navStart).toBeGreaterThanOrEqual(0)
    expect(css.slice(navStart, css.indexOf('}', navStart))).toContain('flex-wrap: wrap')
    // 一覧カードのグリッド列が内容に引っ張られて広がらない
    expect(css).toContain('grid-template-columns: minmax(0, 1fr)')
    // 出典の DOI リンクが狭幅ではみ出さない
    expect(css).toContain('.temporal-card a { overflow-wrap: anywhere; }')
    // バッジは狭幅で内部折り返しを許可する
    const badgeMq = css.slice(css.indexOf('@media (max-width: 400px)'))
    expect(badgeMq.slice(0, 160)).toContain('.badge { white-space: normal; }')
    // 性格チップのタップ高さはアプリ標準の44pxに揃える
    expect(css).toContain('.pair-character .chip { min-height: 44px;')
  })
})
