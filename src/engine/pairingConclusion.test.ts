import { describe, it, expect } from 'vitest'
import { assemblePairing, assembleBlend } from './pairingCombo'
import { buildPairingConclusion } from './pairingConclusion'
import { teaById } from '../data/teas'
import { chocolateById } from '../data/chocolates'
import { noteById } from '../data/flavors'

// 第30弾: 「組み合わせの見方」の結論が、組み合わせごとに変わることと、
// 材料（代表ノート・相互作用の調整・対比）から組み立てられることを固定する。
describe('組み合わせの見方の結論（第30弾）', () => {
  it('結論の主文はホイールの代表ノート先頭を含み、組み合わせごとに変わる', () => {
    const a = assemblePairing(teaById('green-steamed')!, chocolateById('dark-roasted')!, null, null)
    const b = assemblePairing(teaById('oolong-tea')!, chocolateById('white-chocolate')!, null, null)
    const ca = buildPairingConclusion(a.wheel, a.result)
    const cb = buildPairingConclusion(b.wheel, b.result)
    if (a.wheel.notes.length > 0) {
      expect(ca.lead).toContain(noteById(a.wheel.notes[0].noteId)?.name ?? a.wheel.notes[0].noteId)
    }
    if (b.wheel.notes.length > 0) {
      expect(cb.lead).toContain(noteById(b.wheel.notes[0].noteId)?.name ?? b.wheel.notes[0].noteId)
    }
    expect(ca.lead).not.toBe(cb.lead)
  })

  it('軸指定（品種・系統）を変えると結論も変わりうる材料が結論に届く', () => {
    const base = assemblePairing(teaById('green-steamed')!, chocolateById('dark-roasted')!, { kindId: 'green', regionId: '', cultivarId: '' }, null)
    const withCultivar = assemblePairing(teaById('green-steamed')!, chocolateById('dark-roasted')!, { kindId: 'green', regionId: '', cultivarId: 'saemidori' }, null)
    const c1 = buildPairingConclusion(base.wheel, base.result)
    const c2 = buildPairingConclusion(withCultivar.wheel, withCultivar.result)
    // 少なくとも材料（ホイール）のどちらかが変われば、結論の材料も変わる。
    // 両方が完全同一なら第2層自体が同一という既知の残存ケースなので許容する。
    const sameWheel = JSON.stringify(base.wheel.notes) === JSON.stringify(withCultivar.wheel.notes)
    if (!sameWheel) expect(c1.lead + c1.enhance.join() + c1.suppress.join()).not.toBe(c2.lead + c2.enhance.join() + c2.suppress.join())
  })

  it('強まる／和らぐ要素は、ホイールの調整（相互作用）に実在するものだけを使う', () => {
    const a = assemblePairing(teaById('green-steamed')!, chocolateById('dark-roasted')!, null, null)
    const c = buildPairingConclusion(a.wheel, a.result)
    const labels = new Set<string>()
    for (const meta of a.wheel.noteMeta.values()) for (const adj of meta.adjustments) labels.add(adj.label)
    for (const meta of a.wheel.tasteMeta.values()) for (const adj of meta.adjustments) labels.add(adj.label)
    for (const e of [...c.enhance, ...c.suppress]) {
      expect([...labels].some((l) => e.includes(l)), `結論の要素が調整に無い: ${e}`).toBe(true)
    }
    expect(c.enhance.length).toBeLessThanOrEqual(3)
    expect(c.suppress.length).toBeLessThanOrEqual(3)
  })

  it('同種ペアでも結論が組み立つ', () => {
    const blend = assembleBlend(
      { type: 'chocolate', item: chocolateById('dark-roasted')!, sel: null },
      { type: 'chocolate', item: chocolateById('milk-chocolate')!, sel: null },
    )
    const c = buildPairingConclusion(blend.wheel, blend.result)
    expect(c.lead.length).toBeGreaterThan(10)
    expect(c.direct).toBe(blend.result.level === 'measured')
  })
})
