import { describe, it, expect } from 'vitest'
import { cultivarWheels, inferredCultivarWheels, lineageWheels, originWheels } from './entityWheel'
import { teaCultivars, usesForCultivar } from '../data/cultivars'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones } from '../data/cacao'
import { cacaoOrigins } from '../data/origins'
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
          // 推測レベルのノートは、推測の出所を説明する根拠を必ず含む
          // （製法の科学、または品種・産地の所見の読み替え。分類プロファイルだけでは推測にならない）
          if (n.level === 'inferred') {
            expect(n.basis.some((b) => b.from !== 'profile'), `${c.id}/${n.noteId} は推測なのに推測の出所の根拠がない`).toBe(true)
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

  it('【第25弾】ふうしゅんは交配親かなやみどりの緑茶から推測ホイールが組める（全て推測・一段弱い）', () => {
    const wheels = inferredCultivarWheels('fushu')
    expect(wheels).toHaveLength(1)
    const w = wheels[0]
    expect(w.kindId).toBe('green')
    expect(w.inferredFromText).toContain('かなやみどり')
    expect(w.overallLevel).toBe('inferred')
    expect(w.comboPath).toBeNull()
    expect(w.notes.length).toBeGreaterThan(0)
    for (const n of w.notes) {
      expect(n.level).toBe('inferred')
      // 親より一段弱く：強い のままのノートは残らない
      expect(n.intensity).not.toBe('strong')
      // 推測の出所（交配親）を説明する根拠を必ず含む
      expect(n.basis.some((b) => b.from === 'cultivar' && b.text.includes('推測'))).toBe(true)
      expect(n.sourceIds.length).toBeGreaterThan(0)
    }
    for (const t of w.tastes) expect(t.level).toBe('inferred')
  })

  it('【第25弾】展茗は交配親さみどりから緑茶・玉露・抹茶の推測ホイールが組める', () => {
    const kindIds = inferredCultivarWheels('tenmyou').map((w) => w.kindId)
    expect(kindIds).toEqual(expect.arrayContaining(['green', 'gyokuro-form', 'matcha-form']))
  })

  it('【第25弾】交配親が使えない品種は子品種から推測する（さやまみどり・硬枝紅心）', () => {
    const sayama = inferredCultivarWheels('sayamamidori')
    expect(sayama.map((w) => w.kindId)).toEqual(['green'])
    expect(sayama[0].inferredFromText).toContain('子品種')
    const yingzhi = inferredCultivarWheels('yingzhi-hongxin')
    expect(yingzhi.map((w) => w.kindId)).toEqual(expect.arrayContaining(['oolong', 'black']))
    expect(yingzhi[0].inferredFromText).toContain('金萱')
  })

  it('【第25弾】藤かおりは検出成分アントラニル酸メチル由来のノートが最も弱く付く', () => {
    const wheels = inferredCultivarWheels('fujikaori')
    expect(wheels.map((w) => w.kindId)).toEqual(['green'])
    const fruit = wheels[0].notes.find((n) => n.noteId === 'fruit-general')
    expect(fruit).toBeTruthy()
    expect(fruit!.level).toBe('inferred')
    expect(fruit!.intensity).toBe('weak')
    expect(fruit!.basis.some((b) => b.text.includes('アントラニル酸メチル'))).toBe(true)
  })

  it('【第25弾】足がかりの無い品種には推測ホイールを作らない', () => {
    // ダージリン系統は地域試料の転用を品種データ自体が禁じている。B/5/63・RR 4/5 は存在確認のみ。
    for (const id of ['darjeeling-china-jat', 'darjeeling-assam-hybrid', 'b563', 'rr45']) {
      expect(inferredCultivarWheels(id), id).toHaveLength(0)
    }
  })

  it('【第25弾】確認済みホイールがある品種には推測ホイールを重ねない', () => {
    expect(inferredCultivarWheels('yabukita')).toHaveLength(0)
    expect(inferredCultivarWheels('samidori')).toHaveLength(0)
  })

  it('【第25弾】産地ホイールは全産地で4種類そろい、全ノートに出典がありリンク先が実在する', () => {
    for (const o of cacaoOrigins) {
      const wheels = originWheels(o.id)
      expect(wheels, o.id).toHaveLength(4)
      for (const w of wheels) {
        expect(w.notes.length, `${o.id}/${w.kind}`).toBeGreaterThan(0)
        const sub = w.comboPath.replace('combo/choco/', '')
        expect(chocoComboViable(parseChocoComboSub(sub)), `${o.id} のリンク先 ${w.comboPath}`).toBe(true)
        for (const n of w.notes) {
          expect(n.sourceIds.length).toBeGreaterThan(0)
          for (const sid of n.sourceIds) expect(sourceIds.has(sid), `${o.id} note source ${sid}`).toBe(true)
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
