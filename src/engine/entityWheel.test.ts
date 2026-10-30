import { describe, it, expect } from 'vitest'
import { cultivarWheels, lineageWheels } from './entityWheel'
import { teaCultivars, usesForCultivar } from '../data/cultivars'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones } from '../data/cacao'
import { sources } from '../data/sources'
import { noteById } from '../data/flavors'
import { parseTeaComboSub, parseChocoComboSub, teaComboViable, chocoComboViable } from './combo'
import type { CacaoLayer } from './pairingContext'

// 品種・系統ページのフレーバーホイール（2026-10-31 追加）の不変条件。
// 土台は組み合わせページ（第2層）と同じエンジンで、ここでは全品種・全系統を
// 走査して「全ノートに根拠レベルと実在する出典がある」「推測は製法由来として
// 明示される」「リンク先の組み合わせが実在する」ことを担保する。
const sourceIds = new Set(sources.map((s) => s.id))

describe('品種・系統ホイールの根拠（全数検査）', () => {
  it('全茶品種：ホイールの全ノートに根拠レベル・根拠文・実在する出典がある', () => {
    for (const c of teaCultivars) {
      for (const w of cultivarWheels(c.id)) {
        for (const n of w.notes) {
          expect(noteById(n.noteId), `${c.id}/${w.kindId}/${n.noteId}`).toBeTruthy()
          expect(['measured', 'general', 'inferred']).toContain(n.level)
          expect(n.basis.length).toBeGreaterThan(0)
          expect(n.sourceIds.length).toBeGreaterThan(0)
          for (const sid of n.sourceIds) expect(sourceIds.has(sid), `${c.id} note source ${sid}`).toBe(true)
          for (const b of n.basis) {
            expect(b.text.length).toBeGreaterThan(0)
            for (const sid of b.sourceIds) expect(sourceIds.has(sid)).toBe(true)
          }
          // スコア的な数値プロパティを持たない
          expect('score' in n).toBe(false)
          // 推測レベルのノートは、製法の科学由来の根拠を必ず含む（推測の出所の明示）
          if (n.level === 'inferred') {
            expect(n.basis.some((b) => b.from === 'process'), `${c.id}/${n.noteId} は推測なのに製法由来の根拠がない`).toBe(true)
          }
        }
        // 組み合わせページへのリンクがある場合、その組み合わせは実在する
        if (w.comboPath) {
          const sub = w.comboPath.replace('combo/tea/', '')
          expect(teaComboViable(parseTeaComboSub(sub)), `${c.id} のリンク先 ${w.comboPath}`).toBe(true)
        }
      }
    }
  })

  it('確認済みの組み合わせがある品種は、必ずホイールが1件以上ある', () => {
    for (const c of teaCultivars) {
      if (usesForCultivar(c.id).length > 0) {
        expect(cultivarWheels(c.id).length, `${c.id} は組み合わせがあるのにホイールがない`).toBeGreaterThan(0)
      }
    }
  })

  it('確認済みの組み合わせがない品種はホイールを出さない（推測の足がかりなし）', () => {
    for (const id of ['fushu', 'sayamamidori', 'tenmyou', 'yingzhi-hongxin', 'fujikaori', 'darjeeling-china-jat', 'b563', 'rr45']) {
      expect(cultivarWheels(id), id).toHaveLength(0)
    }
  })

  it('やぶきたは緑茶と紅茶でホイールの顔ぶれが違い、紅茶側に推測ノートがある', () => {
    const wheels = cultivarWheels('yabukita')
    expect(wheels.map((w) => w.kindId)).toEqual(expect.arrayContaining(['green', 'black']))
    const black = wheels.find((w) => w.kindId === 'black')!
    expect(black.notes.some((n) => n.level === 'inferred')).toBe(true)
    const green = wheels.find((w) => w.kindId === 'green')!
    const blackIds = new Set(black.notes.map((n) => n.noteId))
    const greenIds = new Set(green.notes.map((n) => n.noteId))
    expect([...blackIds].some((id) => !greenIds.has(id)) || [...greenIds].some((id) => !blackIds.has(id))).toBe(true)
  })

  it('玉露・抹茶のみの品種（ごこう）は形態のプロファイル由来のホイールになる', () => {
    const wheels = cultivarWheels('gokou')
    expect(wheels.length).toBeGreaterThan(0)
    expect(wheels.every((w) => w.viaForm)).toBe(true)
    expect(wheels.every((w) => w.comboPath === null && w.itemPath !== null)).toBe(true)
    for (const w of wheels) {
      for (const n of w.notes) {
        // 形態由来のノートは分類プロファイル由来と明記される
        expect(n.basis.every((b) => b.from === 'profile')).toBe(true)
        expect(n.basis[0].text).toContain('分類由来')
      }
    }
  })

  it('全カカオ系統：ホイールの全ノートに根拠レベル・実在する出典があり、リンク先が実在する', () => {
    const entities: { layer: CacaoLayer; id: string }[] = [
      ...cacaoTraditionalGroups.map((g) => ({ layer: 'traditional' as CacaoLayer, id: g.id })),
      ...cacaoGeneticGroups.map((g) => ({ layer: 'genetic' as CacaoLayer, id: g.id })),
      ...cacaoClones.map((c) => ({ layer: 'clone' as CacaoLayer, id: c.id })),
    ]
    for (const e of entities) {
      const wheels = lineageWheels(e.layer, e.id)
      expect(wheels.length, e.id).toBeGreaterThan(0)
      for (const w of wheels) {
        const sub = w.comboPath.replace('combo/choco/', '')
        expect(chocoComboViable(parseChocoComboSub(sub)), `${e.id} のリンク先 ${w.comboPath}`).toBe(true)
        for (const n of w.notes) {
          expect(['measured', 'general', 'inferred']).toContain(n.level)
          expect(n.sourceIds.length).toBeGreaterThan(0)
          for (const sid of n.sourceIds) expect(sourceIds.has(sid), `${e.id} note source ${sid}`).toBe(true)
          expect('score' in n).toBe(false)
        }
      }
    }
  })

  it('CCN-51 と Nacional は、系統の所見・製法ルールがホイール側の根拠に現れる', () => {
    const ccn = lineageWheels('clone', 'ccn-51')
    expect(ccn.length).toBeGreaterThan(0)
    const nacional = lineageWheels('genetic', 'gen-nacional')
    const dark = nacional.find((w) => w.kind === 'dark')!
    // Nacional の製法ルールで花様が推測として追加される
    const floral = dark.notes.find((n) => n.noteId === 'floral-general')
    expect(floral?.level).toBe('inferred')
  })
})
