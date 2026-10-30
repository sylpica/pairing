// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import NoteDetail from './NoteDetail'
import { teaById } from '../data/teas'
import type { CompoundContext } from '../data/compounds'

describe('NoteDetail の科学的推測セクション', () => {
  beforeEach(() => { cleanup() })

  it('推測があるノートでは「推測（未検証）」バッジつきで具体名と根拠成分が表示される（煎茶・花様）', () => {
    const sencha = teaById('sencha')!
    const ctx: CompoundContext = { side: 'tea', kindId: sencha.kindId, itemName: sencha.name, itemId: sencha.id }
    const { container } = render(<NoteDetail noteId="floral-general" profile={sencha.profile} context={ctx} />)
    const box = container.querySelector('.inference-box')
    expect(box).toBeTruthy()
    expect(box!.textContent).toContain('科学的な推測')
    expect(box!.textContent).toContain('推測（未検証）')
    expect(box!.textContent).toContain('バラ')
    expect(box!.textContent).toContain('ジャスミン')
    expect(box!.textContent).toContain('根拠成分')
    expect(box!.textContent).toContain('ゲラニオール')
    // 実測の見出しとは別セクション（推測ボックス内）に置かれる
    expect(box!.textContent).toContain('実測でその花・果物と確認されたものではありません')
  })

  it('単叢トロピカルではココナッツの推測と、参考情報に基づく旨が表示される', () => {
    const dc = teaById('fenghuang-dancong')!
    const ctx: CompoundContext = { side: 'tea', kindId: dc.kindId, itemName: dc.name, itemId: dc.id }
    const { container } = render(<NoteDetail noteId="tropical" profile={dc.profile} context={ctx} />)
    const box = container.querySelector('.inference-box')
    expect(box).toBeTruthy()
    expect(box!.textContent).toContain('ココナッツ')
    expect(box!.textContent).toContain('参考情報')
    expect(box!.textContent).not.toContain('マンゴー')
  })

  it('推測のないノートでは推測セクション自体が出ない（ほうじ茶・トースト）', () => {
    const hojicha = teaById('hojicha')!
    const ctx: CompoundContext = { side: 'tea', kindId: hojicha.kindId, itemName: hojicha.name, itemId: hojicha.id }
    const { container } = render(<NoteDetail noteId="toast" profile={hojicha.profile} context={ctx} />)
    expect(container.querySelector('.inference-box')).toBeNull()
    expect(container.textContent).not.toContain('科学的な推測')
  })

  it('アイテム特定（itemId）がない表示では推測を出さない', () => {
    const sencha = teaById('sencha')!
    const ctx: CompoundContext = { side: 'tea', kindId: sencha.kindId, itemName: sencha.name }
    const { container } = render(<NoteDetail noteId="floral-general" profile={sencha.profile} context={ctx} />)
    expect(container.querySelector('.inference-box')).toBeNull()
  })
})
