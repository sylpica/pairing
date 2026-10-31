// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'

// nav.ts はモジュール内の戻り先スタックを持つため、各テストで状態を分けるには
// テストごとに再 import する（vi.resetModules + dynamic import）。
// スタックは sessionStorage にも保存されるため、そちらもテストごとに消す。
async function freshNav() {
  vi.resetModules()
  return import('./nav')
}

describe('戻るボタンの遷移（nav.goBack）', () => {
  beforeEach(() => { location.hash = '#/'; sessionStorage.clear() })

  it('画面遷移（trackRoute）の履歴をたどって前の画面に戻る', async () => {
    const { go, trackRoute, goBack } = await freshNav()
    trackRoute('tea')
    go('tea/sencha')
    trackRoute('tea/sencha')
    goBack('home')
    expect(location.hash).toBe('#/tea')
    // App 側の追跡が戻り先を再び積まないこと（suppressTrack）
    trackRoute('tea')
    // スタックが空になったら、ブラウザ履歴ではなくフォールバック先へ進む
    const spy = vi.spyOn(history, 'back').mockImplementation(() => {})
    goBack('home')
    expect(spy).not.toHaveBeenCalled()
    expect(location.hash).toBe('#/home')
    spy.mockRestore()
  })

  it('スタックが空ならブラウザ履歴に委ねずフォールバック先へ進む（第24弾）', async () => {
    const { goBack } = await freshNav()
    const spy = vi.spyOn(history, 'back').mockImplementation(() => {})
    goBack('tea')
    expect(spy).not.toHaveBeenCalled()
    expect(location.hash).toBe('#/tea')
    spy.mockRestore()
  })

  it('連続遷移では直前の画面へ一段ずつ戻る', async () => {
    const { go, trackRoute, goBack } = await freshNav()
    trackRoute('home')
    go('choco'); trackRoute('choco')
    go('combo/tea'); trackRoute('combo/tea')
    goBack('tea')
    expect(location.hash).toBe('#/choco')
    trackRoute('choco')
    goBack('home')
    expect(location.hash).toBe('#/home')
    trackRoute('home')
    // ここでスタックは空。以降はフォールバック先へ
    goBack('tea')
    expect(location.hash).toBe('#/tea')
  })

  it('再読み込み（モジュール再初期化）後も sessionStorage の記録から直前の画面に戻れる（第24弾）', async () => {
    const first = await freshNav()
    first.trackRoute('home')
    first.go('choco'); first.trackRoute('choco')
    first.go('combo/tea'); first.trackRoute('combo/tea')
    // ページ再読み込み相当：モジュールを作り直し、App の初回 trackRoute は
    // 再読み込みされた現在パスで呼ばれる
    const second = await freshNav()
    second.trackRoute('combo/tea')
    second.goBack('tea')
    expect(location.hash).toBe('#/choco')
  })

  it('再読み込み時に組み合わせページの詳細パスで再追跡されても、直前の画面に戻れる（第24弾）', async () => {
    const first = await freshNav()
    first.trackRoute('home')
    first.go('choco'); first.trackRoute('choco')
    first.go('combo/tea'); first.trackRoute('combo/tea')
    // 組み合わせページは表示後に replaceState で URL を詳細パスへ書き換える。
    // その状態で再読み込みすると、App は詳細パスで trackRoute を呼ぶ。
    const second = await freshNav()
    second.trackRoute('combo/tea/green.nagasaki.yabukita')
    second.goBack('tea')
    expect(location.hash).toBe('#/choco')
  })

  it('直開き（記録なし）ではフォールバック先へ進み、アプリ外へ出ない（第24弾）', async () => {
    const { trackRoute, goBack } = await freshNav()
    trackRoute('combo/tea/green.nagasaki.yabukita')
    const spy = vi.spyOn(history, 'back').mockImplementation(() => {})
    goBack('tea')
    expect(spy).not.toHaveBeenCalled()
    expect(location.hash).toBe('#/tea')
    spy.mockRestore()
  })
})
