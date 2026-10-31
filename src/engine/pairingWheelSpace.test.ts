import { describe, it, expect } from 'vitest'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import { teaCultivars } from '../data/cultivars'
import { cacaoOrigins } from '../data/origins'
import {
  TEA_COMBO_KINDS, CHOCO_COMBO_KINDS, allTeaRegionOptions, allLineages,
  teaComboViable, chocoComboViable, teaComboBaseItem, chocoRepresentativeItem,
  type TeaComboSel, type ChocoComboSel,
} from './combo'
import { assembleBlend, teaComboCached, chocoComboCached, type BlendSideInput } from './pairingCombo'
import { buildAromaTiers, buildTasteCompounds } from './wheelTiers'
import { noteById } from '../data/flavors'

// 第26弾・全数検証: 選択可能な全組み合わせでペアリングホイールが成立すること。
// - 代表ノートは候補が2件以上なら必ず2〜7件（候補が1件だけの場合はそのまま）
// - ホイールの全階層でラベル欠けなし・％の合計は100
// - 側の列挙は UI の選択空間そのもの（分類×産地×品種／系統の全 viable 選択＋
//   アイテム単体）。入力プロファイルの顔ぶれで重複排除した相異なる入力同士を
//   組み合わせる（comboSpace / pairingComboSpace と同じ作法）。
// - 同種ペアは対角（同一側同士）の全数＋ストライドサンプルで担保する。

interface SideVariant { key: string; input: BlendSideInput }

function sideProfileSig(input: BlendSideInput): string {
  const a = input.sel
    ? (input.type === 'tea' ? teaComboCached(input.sel as TeaComboSel) : chocoComboCached(input.sel as ChocoComboSel))
    : null
  const notes = a ? a.notes : input.item.profile.aromas
  const tasteSig = a
    ? a.tastes.map((t) => `${t.key}:${t.intensity}`).sort().join(',')
    : Object.entries(input.item.profile.tastes).map(([k, v]) => `${k}:${v.intensity}`).sort().join(',')
  return `${input.type}:${input.item.id}|`
    + notes.map((n) => `${n.noteId}:${n.intensity}`).sort().join(',')
    + '|' + tasteSig
}

function teaVariants(): SideVariant[] {
  const out: SideVariant[] = []
  const seen = new Set<string>()
  const push = (key: string, input: BlendSideInput) => {
    const sig = sideProfileSig(input)
    if (seen.has(sig)) return
    seen.add(sig)
    out.push({ key, input })
  }
  for (const t of teaItems) push(`item:${t.id}`, { type: 'tea', item: t, sel: null })
  const regionIds = ['', ...allTeaRegionOptions().map((o) => o.id)]
  for (const kindId of TEA_COMBO_KINDS) {
    const item = teaComboBaseItem(kindId)!
    for (const regionId of regionIds) for (const cultivarId of ['', ...teaCultivars.map((c) => c.id)]) {
      const sel: TeaComboSel = { kindId, regionId, cultivarId }
      if (teaComboViable(sel)) push(`tea:${kindId}|${regionId}|${cultivarId}`, { type: 'tea', item, sel })
    }
  }
  return out
}

function chocoVariants(): SideVariant[] {
  const out: SideVariant[] = []
  const seen = new Set<string>()
  const push = (key: string, input: BlendSideInput) => {
    const sig = sideProfileSig(input)
    if (seen.has(sig)) return
    seen.add(sig)
    out.push({ key, input })
  }
  for (const c of chocolateItems) push(`item:${c.id}`, { type: 'chocolate', item: c, sel: null })
  for (const kind of CHOCO_COMBO_KINDS) {
    const item = chocoRepresentativeItem(kind)!
    const lineages = [null, ...allLineages()]
    for (const originId of ['', ...cacaoOrigins.map((o) => o.id)]) for (const lineage of lineages) {
      const sel: ChocoComboSel = { kind, originId, lineage }
      if (chocoComboViable(sel)) {
        push(`choco:${kind}|${originId}|${lineage ? `${lineage.layer}:${lineage.id}` : ''}`, { type: 'chocolate', item, sel })
      }
    }
  }
  return out
}

const SCORE_PATTERN = /\d+\s*点/

function checkWheel(a: ReturnType<typeof assembleBlend>, label: string) {
  const w = a.wheel
  expect(w.notes.length, label).toBeLessThanOrEqual(7)
  if (w.candidateCount >= 2) expect(w.notes.length, label).toBeGreaterThanOrEqual(2)
  expect(w.notes.length, label).toBeLessThanOrEqual(w.candidateCount)
  expect(w.underMinimum, label).toBe(w.candidateCount < 2)
  for (const n of w.notes) {
    expect(noteById(n.noteId), label).toBeTruthy()
    expect(n.level, label).toBe('inferred')
    expect(n.sourceIds.length, label).toBeGreaterThan(0)
    expect(SCORE_PATTERN.test(JSON.stringify(n.basis)), label).toBe(false)
  }
  expect(w.tastes.length, label).toBeLessThanOrEqual(5)
  // 香りの階層: 大分類→代表ノート（％合計100）→化合物（％合計100）
  const tiers = buildAromaTiers(w.notes, w.contexts)
  for (const t of tiers) {
    if (t.entries.length === 0) continue
    expect(t.entries.reduce((s, e) => s + e.percent, 0), `${label} / ${t.categoryId}`).toBe(100)
    for (const e of t.entries) {
      expect(e.label.length, label).toBeGreaterThan(0)
      if (e.compounds.length > 0) {
        expect(e.compounds.reduce((s, c) => s + c.percent, 0), `${label} / ${e.label}`).toBe(100)
      }
    }
  }
  // 味の階層: 味→化合物（％合計100）
  for (const t of w.tastes) {
    const comps = buildTasteCompounds(t.key, w.contexts)
    if (comps.length > 0) expect(comps.reduce((s, c) => s + c.percent, 0), `${label} / ${t.key}`).toBe(100)
  }
}

describe('ペアリングホイールの全数検証（第26弾）', () => {
  const teas = teaVariants()
  const chocos = chocoVariants()

  it('異種ペア全数: ホイールが成立し、代表ノートが2件未満の組み合わせは無い', () => {
    let pairs = 0
    let underMinimum = 0
    for (const t of teas) for (const c of chocos) {
      const a = assembleBlend(t.input, c.input)
      checkWheel(a, `tea ${t.key} x choco ${c.key}`)
      if (a.wheel.underMinimum) underMinimum++
      pairs++
    }
    expect(pairs).toBeGreaterThan(5000)
    // 実測（2026-10-31）: 異種ペア全数で候補2件未満は0件
    expect(underMinimum).toBe(0)
  }, 900000)

  it('同種ペア: 対角（同一側同士）の全数とストライドサンプルでホイールが成立する', () => {
    let pairs = 0
    const lists: SideVariant[][] = [teas, chocos]
    for (const list of lists) {
      for (let i = 0; i < list.length; i++) {
        checkWheel(assembleBlend(list[i].input, list[i].input), `diag ${list[i].key}`)
        pairs++
        for (let j = 0; j < list.length; j++) {
          if ((i * 31 + j) % 7 !== 0) continue
          checkWheel(assembleBlend(list[i].input, list[j].input), `${list[i].key} x ${list[j].key}`)
          pairs++
        }
      }
    }
    expect(pairs).toBeGreaterThan(1000)
  }, 900000)
})
