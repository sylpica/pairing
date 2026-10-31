// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'

// nav.ts はモジュール内の戻り先スタックを持つため、各テストで状態を分けるには
// テストごとに再 import する（vi.resetModules + dynamic import）。
async function freshNav() {
  vi.resetModules()
  return import('./nav')
}

describe('戻るボタンの遷移（nav.goBack）', () => {
  beforeEach(() => { location.hash = '#/' })

  it('画面遷移（trackRoute）の履歴をたどって前の画面に戻る', async () => {
    const { go, trackRoute, goBack } = await freshNav()
    trackRoute('tea')
    go('tea/sencha')
    trackRoute('tea/sencha')
    goBack('home')
    expect(location.hash).toBe('#/tea')
    // App 側の追跡が戻り先を再び積まないこと（suppressTrack）
    trackRoute('tea')
    const spy = vi.spyOn(history, 'back').mockImplementation(() => {})
    goBack('home')
    expect(spy).toHaveBeenCalled() // スタックが空なのでブラウザ履歴に委ねる
    spy.mockRestore()
  })

  it('スタックが空ならブラウザ履歴を戻す', async () => {
    const { goBack } = await freshNav()
    const spy = vi.spyOn(history, 'back').mockImplementation(() => {})
    goBack('tea')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('スタックもブラウザ履歴も無ければフォールバック先へ進む', async () => {
    const { goBack } = await freshNav()
    const original = Object.getOwnPropertyDescriptor(History.prototype, 'length')
    Object.defineProperty(History.prototype, 'length', { configurable: true, get: () => 1 })
    try {
      goBack('cultivars')
      expect(location.hash).toBe('#/cultivars')
    } finally {
      if (original) Object.defineProperty(History.prototype, 'length', original)
    }
  })
})
