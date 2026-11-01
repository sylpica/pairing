// 第43弾追加指示 全数監査（2026-11-01）
// 「品種・産地（系統・地域）を1つだけ変えたのにホイールの表示署名が完全同一」
// になるケースを、サンプルでなく機械的全数で列挙する。
//
// 選択空間（pairingFullSpace.test.ts で固定された数値体系）:
//   お茶側の選択 2,422 通り = アイテム14 ×（品種なし: 産地 未指定+国5+地域31 /
//     品種あり: 産地 未指定+品種の国+その国の地域）
//   チョコ側の選択 1,224 通り = アイテム8 × 系統17（なし+伝統3+遺伝10+クローン3）
//     × 産地9（なし+8）
//   ペアリング 2,964,528 通り = 2,422 × 1,224
// 署名は画面に表示されるホイール内容で定義する:
//   L1 = 第1階層（香り大分類・基本味の％と具体名ラベル）＋渋味ゲージ段階
//        （＝最初に見える姿）
//   L2 = 全階層（第2階層の具体名・％・根拠レベル、第3階層の化合物・％まで）
//   raw = 分析自体（ノート/味の id・強さ・根拠レベル）
// 原因分類: raw が同一なら (i) データレベル（軸効果が無い／土台と同一）、
//   raw は違うが側の L2 が同一なら (ii) 合成（％整数化・代表選定等）で潰れた、
//   ペアリングでのみ同一になるものは (iii) ペアリング合成で埋もれた。
// ペアリングの隣接比較は、側の寄与が等しい選択をクラスに圧縮して正確に数える
// （組み立ては (お茶クラス × チョコクラス) でメモ化し、全 2,964,528 通りの
// 隣接比較をクラス単位で過不足なく数える）。
import { describe, it, expect } from 'vitest'
import { writeFileSync } from 'node:fs'
import { teaById } from '../data/teas'
import { chocolateById } from '../data/chocolates'
import { teaRegions } from '../data/teaRegions'
import { teaOriginCountries } from './pairingContext'
import {
  TEA_COMBO_KINDS, comboProfileOf, teaComboViable,
  type TeaComboSel, type ChocoComboSel, type ComboAnalysis,
} from './combo'
import { assemblePairing } from './pairingCombo'
import { analyzeInteractionsForSides } from './interactions'
import { buildPairingWheel } from './pairingWheel'
import { TEA_PAIRING_LABEL, CHOCO_PAIRING_LABEL } from './pairing'
import type { ChocolateItem, TeaItem } from '../types'

// 共有部品（選択空間の列挙・分析のメモ化・隣接ペア生成・表示署名）は
// auditSpace.ts に分離した（mode43.test.ts と共用するため。テストファイル
// 同士を import すると監査が二重登録されるので避ける）。
import {
  wheelSignatures, enumerateTeaStates, enumerateChocoStates, teaAnalysisOf, chocoAnalysisOf, adjacentPairs,
  type TeaState, type ChocoState, type AdjPair,
} from './auditSpace'

interface SameRec { scope: string; axis: string; group: string; a: string; b: string; cause: string; count: number }
const summary: Record<string, unknown> = {}
const teaSame: SameRec[] = []
const chocoSame: SameRec[] = []
const kindSame: SameRec[] = []

const teaStates = enumerateTeaStates()
const chocoStates = enumerateChocoStates()
const teaSig = new Map<string, { l1: string; l2: string; raw: string }>()
const chocoSig = new Map<string, { l1: string; l2: string; raw: string }>()
for (const s of teaStates) { const a = teaAnalysisOf(s.sel); teaSig.set(s.key, wheelSignatures(a.notes, a.tastes, a.context)) }
for (const s of chocoStates) { const a = chocoAnalysisOf(s.sel); chocoSig.set(s.key, wheelSignatures(a.notes, a.tastes, a.context)) }

const teaAdj = adjacentPairs(teaStates, [
  { axis: '品種', keyOf: (s) => `${s.itemId}|${s.regionId}` },
  { axis: '産地', keyOf: (s) => `${s.itemId}|${s.cultivarId}` },
  { axis: 'アイテム(分類)', keyOf: (s) => `${s.cultivarId}|${s.regionId}` },
])
const chocoAdj = adjacentPairs(chocoStates, [
  { axis: '系統', keyOf: (s) => `${s.itemId}|${s.originId}` },
  { axis: '産地', keyOf: (s) => `${s.itemId}|${s.lineageKey}` },
  { axis: 'アイテム(種類)', keyOf: (s) => `${s.lineageKey}|${s.originId}` },
])

function auditSide<S extends { key: string }>(
  scope: string, pairs: AdjPair<S>[], sigOf: (s: S) => { l1: string; l2: string; raw: string }, sink: SameRec[],
) {
  let l1Same = 0; let l2Same = 0
  const byAxis = new Map<string, { pairs: number; l1: number; l2: number; c1: number; c2: number }>()
  for (const p of pairs) {
    const A = sigOf(p.a); const B = sigOf(p.b)
    const st = byAxis.get(p.axis) ?? { pairs: 0, l1: 0, l2: 0, c1: 0, c2: 0 }
    st.pairs++
    if (A.l1 === B.l1) { l1Same++; st.l1++ }
    if (A.l2 === B.l2) {
      l2Same++; st.l2++
      const cause = A.raw === B.raw ? '(i)分析同一' : '(ii)合成で潰れた'
      if (A.raw === B.raw) st.c1++; else st.c2++
      sink.push({ scope, axis: p.axis, group: p.group, a: p.a.key, b: p.b.key, cause, count: 1 })
    }
    byAxis.set(p.axis, st)
  }
  return { pairs: pairs.length, l1Same, l2Same, byAxis: Object.fromEntries(byAxis) }
}

// ===== ペアリング側の寄与キー（クラス圧縮用） =====
function teaDistinctiveOf(sel: TeaComboSel, analysis: ComboAnalysis): string[] {
  const base = teaAnalysisOf({ kindId: sel.kindId, regionId: '', cultivarId: '' })
  const baseMap = new Map(base.notes.map((n) => [n.noteId, n.intensity]))
  return analysis.notes.filter((n) => !baseMap.has(n.noteId) || baseMap.get(n.noteId) !== n.intensity).map((n) => n.noteId).sort()
}
function chocoDistinctiveOf(sel: ChocoComboSel, analysis: ComboAnalysis): string[] {
  const base = chocoAnalysisOf({ kind: sel.kind, originId: '', lineage: null })
  const baseMap = new Map(base.notes.map((n) => [n.noteId, n.intensity]))
  return analysis.notes.filter((n) => !baseMap.has(n.noteId) || baseMap.get(n.noteId) !== n.intensity).map((n) => n.noteId).sort()
}
function resolvedTeaItem(s: TeaState): TeaItem {
  const item = teaById(s.itemId)!
  return { ...item, profile: comboProfileOf(teaAnalysisOf(s.sel), item.profile) }
}
function resolvedChocoItem(s: ChocoState): ChocolateItem {
  const item = chocolateById(s.itemId)!
  return { ...item, profile: comboProfileOf(chocoAnalysisOf(s.sel), item.profile) }
}
function teaSideKey(s: TeaState): string {
  const a = teaAnalysisOf(s.sel)
  const prof = comboProfileOf(a, teaById(s.itemId)!.profile)
  return JSON.stringify({
    item: s.itemId,
    prof: [prof.aromas.map((x) => [x.noteId, x.intensity, x.basis]), Object.entries(prof.tastes).map(([k, v]) => [k, v.intensity, v.basis])],
    raw: teaSig.get(s.key)!.raw,
    dist: teaDistinctiveOf(s.sel, a),
  })
}
function chocoSideKey(s: ChocoState): string {
  const a = chocoAnalysisOf(s.sel)
  const item = chocolateById(s.itemId)!
  const prof = comboProfileOf(a, item.profile)
  return JSON.stringify({
    item: s.itemId, kind: item.kind,
    prof: [prof.aromas.map((x) => [x.noteId, x.intensity, x.basis]), Object.entries(prof.tastes).map(([k, v]) => [k, v.intensity, v.basis])],
    raw: chocoSig.get(s.key)!.raw,
    dist: chocoDistinctiveOf(s.sel, a),
  })
}
const teaKeyOf = new Map<string, string>()
const chocoKeyOf = new Map<string, string>()
const teaRepByKey = new Map<string, TeaState>()
const chocoRepByKey = new Map<string, ChocoState>()
const teaClassSize = new Map<string, number>()
const chocoClassSize = new Map<string, number>()
for (const s of teaStates) { const k = teaSideKey(s); teaKeyOf.set(s.key, k); if (!teaRepByKey.has(k)) teaRepByKey.set(k, s); teaClassSize.set(k, (teaClassSize.get(k) ?? 0) + 1) }
for (const s of chocoStates) { const k = chocoSideKey(s); chocoKeyOf.set(s.key, k); if (!chocoRepByKey.has(k)) chocoRepByKey.set(k, s); chocoClassSize.set(k, (chocoClassSize.get(k) ?? 0) + 1) }
// クラスを整数インデックス化する（側キーの JSON 文字列は長いため、
// ペアリング側のキャッシュ・照合はインデックスで回してメモリを抑える）
const teaClassKeys = [...teaRepByKey.keys()]
const chocoClassKeys = [...chocoRepByKey.keys()]
const teaClassIdxOf = new Map(teaClassKeys.map((k, i) => [k, i]))
const chocoClassIdxOf = new Map(chocoClassKeys.map((k, i) => [k, i]))
const teaClassSizes = teaClassKeys.map((k) => teaClassSize.get(k)!)
const chocoClassSizes = chocoClassKeys.map((k) => chocoClassSize.get(k)!)
const hashStr = (s: string): string => {
  let h1 = 0x811c9dc5; let h2 = 0x01000193
  for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 0x01000193); h2 = Math.imul(h2 ^ (c + i), 0x811c9dc5) }
  return `${(h1 >>> 0).toString(36)}.${(h2 >>> 0).toString(36)}`
}

// assembleBlend と同じ部品でホイールだけを組み立てる（結果・性格の算出を省いた等価経路）。
// 戻り値は L1/L2 署名のハッシュ（全文字列の保持はメモリを圧迫するため）。
const pairWheelCache = new Map<string, { l1: string; l2: string }>()
function pairWheelSig(tIdx: number, cIdx: number): { l1: string; l2: string } {
  const ck = `${tIdx}:${cIdx}`
  const hit = pairWheelCache.get(ck)
  if (hit) return hit
  const ts = teaRepByKey.get(teaClassKeys[tIdx])!
  const cs = chocoRepByKey.get(chocoClassKeys[cIdx])!
  const tItem = resolvedTeaItem(ts)
  const cItem = resolvedChocoItem(cs)
  const interactions = analyzeInteractionsForSides(
    { type: 'tea', label: TEA_PAIRING_LABEL.full, profile: tItem.profile, itemId: tItem.id },
    { type: 'chocolate', label: CHOCO_PAIRING_LABEL.full, profile: cItem.profile, itemId: cItem.id, chocoKind: cItem.kind },
  )
  const wheel = buildPairingWheel([
    { type: 'tea', label: TEA_PAIRING_LABEL.full, item: tItem, analysis: teaAnalysisOf(ts.sel), distinctiveNoteIds: new Set(teaDistinctiveOf(ts.sel, teaAnalysisOf(ts.sel))) },
    { type: 'chocolate', label: CHOCO_PAIRING_LABEL.full, item: cItem, analysis: chocoAnalysisOf(cs.sel), distinctiveNoteIds: new Set(chocoDistinctiveOf(cs.sel, chocoAnalysisOf(cs.sel))) },
  ], interactions)
  const sig = wheelSignatures(wheel.notes, wheel.tastes, wheel.contexts)
  const out = { l1: hashStr(sig.l1), l2: hashStr(sig.l2) }
  pairWheelCache.set(ck, out)
  return out
}

describe('第43弾追加: 軸変更でホイールが変わらないケースの全数監査', () => {
  it('選択空間の件数が固定値と一致する', () => {
    expect(teaStates.length).toBe(2422)
    expect(chocoStates.length).toBe(1224)
    expect(teaStates.length * chocoStates.length).toBe(2964528)
    for (const s of teaStates) expect(teaComboViable(s.sel), s.key).toBe(true)
    console.log(`teaClasses=${teaRepByKey.size} chocoClasses=${chocoRepByKey.size} teaAdj=${teaAdj.length} chocoAdj=${chocoAdj.length}`)
  })

  it('等価経路の検証: 安価なホイール組み立てが assemblePairing と一致する（抽出50件）', () => {
    let checked = 0
    for (let i = 0; i < teaStates.length && checked < 50; i += 97) {
      const ts = teaStates[i]
      const cs = chocoStates[(i * 37) % chocoStates.length]
      const viaAsm = assemblePairing(teaById(ts.itemId)!, chocolateById(cs.itemId)!, ts.sel, cs.sel)
      const asmSig = wheelSignatures(viaAsm.wheel.notes, viaAsm.wheel.tastes, viaAsm.wheel.contexts)
      const cheap = pairWheelSig(teaClassIdxOf.get(teaKeyOf.get(ts.key)!)!, chocoClassIdxOf.get(chocoKeyOf.get(cs.key)!)!)
      expect(cheap.l2, `${ts.key} x ${cs.key}`).toBe(hashStr(asmSig.l2))
      expect(cheap.l1, `${ts.key} x ${cs.key}`).toBe(hashStr(asmSig.l1))
      checked++
    }
    expect(checked).toBeGreaterThanOrEqual(20)
    console.log(`equivalence checked=${checked}`)
  }, 600000)

  it('(a) お茶の組み合わせ: 全隣接ペアの署名比較', () => {
    const r = auditSide('茶コンボ', teaAdj, (s) => teaSig.get(s.key)!, teaSame)
    summary.tea = r
    console.log('TEA', JSON.stringify(r))
  }, 600000)

  it('(b) チョコの組み合わせ: 全隣接ペアの署名比較', () => {
    const r = auditSide('チョココンボ', chocoAdj, (s) => chocoSig.get(s.key)!, chocoSame)
    summary.choco = r
    console.log('CHOCO', JSON.stringify(r))
  }, 600000)

  it('(a2) 補足: 分類（茶類ID）指定の組み合わせ空間', () => {
    // 組み合わせページの分類プルダウンは茶類IDでも選べる。その sel 空間も全数監査する。
    const regionIds = ['', ...teaOriginCountries().map((c) => `country:${c}`), ...teaRegions.map((r) => r.id)]
    const cultivarIds = ['', ...new Set(teaStates.map((s) => s.cultivarId).filter(Boolean))]
    const kindSels: TeaComboSel[] = []
    for (const kindId of TEA_COMBO_KINDS) for (const regionId of regionIds) for (const cultivarId of cultivarIds) {
      const sel = { kindId, regionId, cultivarId }
      if (teaComboViable(sel)) kindSels.push(sel)
    }
    const sigOf = (sel: TeaComboSel) => { const a = teaAnalysisOf(sel); return wheelSignatures(a.notes, a.tastes, a.context) }
    const asStates = kindSels.map((sel) => ({ key: `K:${sel.kindId}|${sel.regionId}|${sel.cultivarId}`, sel }))
    const pairs = adjacentPairs(asStates, [
      { axis: '品種', keyOf: (s) => `${s.sel.kindId}|${s.sel.regionId}` },
      { axis: '産地', keyOf: (s) => `${s.sel.kindId}|${s.sel.cultivarId}` },
    ])
    let l2Same = 0; let c1 = 0; let c2 = 0
    const sigCache = new Map(asStates.map((s) => [s.key, sigOf(s.sel)]))
    for (const p of pairs) {
      const A = sigCache.get(p.a.key)!; const B = sigCache.get(p.b.key)!
      if (A.l2 === B.l2) { l2Same++; if (A.raw === B.raw) c1++; else c2++; kindSame.push({ scope: '茶コンボ(分類指定)', axis: p.axis, group: p.group, a: p.a.key, b: p.b.key, cause: A.raw === B.raw ? '(i)分析同一' : '(ii)合成で潰れた', count: 1 }) }
    }
    summary.teaKindSpace = { sels: kindSels.length, pairs: pairs.length, l2Same, causeI: c1, causeII: c2 }
    console.log('TEA-KIND', JSON.stringify(summary.teaKindSpace))
  }, 600000)

  it('(c) ペアリング: 両方向の全隣接ペア（クラス圧縮で正確に計数）', () => {
    // 同一レコードは (scope, axis, a, b, cause) で集約してメモリに持ち、最後に書き出す
    const agg = new Map<string, SameRec>()
    const rec = (r: SameRec) => {
      const k = `${r.scope}¦${r.axis}¦${r.a}¦${r.b}¦${r.cause}`
      const ex = agg.get(k)
      if (ex) ex.count += r.count; else agg.set(k, { ...r })
    }
    let comparisons = 0
    let l1Same = 0
    let l2Same = 0
    const causeCount = { i: 0, ii: 0, iii: 0 }
    console.log(`pairing classes: tea=${teaClassKeys.length} choco=${chocoClassKeys.length}`)
    // お茶側を変える方向: 隣接ペア × チョコ選択 1,224 全件
    for (const p of teaAdj) {
      comparisons += chocoStates.length
      const ka = teaClassIdxOf.get(teaKeyOf.get(p.a.key)!)!
      const kb = teaClassIdxOf.get(teaKeyOf.get(p.b.key)!)!
      if (ka === kb) {
        l2Same += chocoStates.length; l1Same += chocoStates.length; causeCount.i += chocoStates.length
        rec({ scope: 'ペアリング(茶側変更)', axis: p.axis, group: p.group, a: p.a.key, b: p.b.key, cause: '(i)分析同一（全チョコ選択で同一）', count: chocoStates.length })
        continue
      }
      const sideSame = teaSig.get(p.a.key)!.l2 === teaSig.get(p.b.key)!.l2
      for (let ci = 0; ci < chocoClassKeys.length; ci++) {
        const size = chocoClassSizes[ci]
        const sa = pairWheelSig(ka, ci); const sb = pairWheelSig(kb, ci)
        if (sa.l1 === sb.l1) l1Same += size
        if (sa.l2 === sb.l2) {
          l2Same += size
          const cause = sideSame ? '(ii)側の合成で潰れた' : '(iii)ペアリング合成で埋もれた'
          if (sideSame) causeCount.ii += size; else causeCount.iii += size
          rec({ scope: 'ペアリング(茶側変更)', axis: p.axis, group: `${p.group} x ${chocoRepByKey.get(chocoClassKeys[ci])!.key}`, a: p.a.key, b: p.b.key, cause, count: size })
        }
      }
    }
    console.log('PAIRING tea-direction done', JSON.stringify({ comparisons, l1Same, l2Same, causeCount, assemblies: pairWheelCache.size }))
    // チョコ側を変える方向: 隣接ペア × お茶選択 2,422 全件
    for (const p of chocoAdj) {
      comparisons += teaStates.length
      const ka = chocoClassIdxOf.get(chocoKeyOf.get(p.a.key)!)!
      const kb = chocoClassIdxOf.get(chocoKeyOf.get(p.b.key)!)!
      if (ka === kb) {
        l2Same += teaStates.length; l1Same += teaStates.length; causeCount.i += teaStates.length
        rec({ scope: 'ペアリング(チョコ側変更)', axis: p.axis, group: p.group, a: p.a.key, b: p.b.key, cause: '(i)分析同一（全お茶選択で同一）', count: teaStates.length })
        continue
      }
      const sideSame = chocoSig.get(p.a.key)!.l2 === chocoSig.get(p.b.key)!.l2
      for (let ti = 0; ti < teaClassKeys.length; ti++) {
        const size = teaClassSizes[ti]
        const sa = pairWheelSig(ti, ka); const sb = pairWheelSig(ti, kb)
        if (sa.l1 === sb.l1) l1Same += size
        if (sa.l2 === sb.l2) {
          l2Same += size
          const cause = sideSame ? '(ii)側の合成で潰れた' : '(iii)ペアリング合成で埋もれた'
          if (sideSame) causeCount.ii += size; else causeCount.iii += size
          rec({ scope: 'ペアリング(チョコ側変更)', axis: p.axis, group: `${p.group} x ${teaRepByKey.get(teaClassKeys[ti])!.key}`, a: p.a.key, b: p.b.key, cause, count: size })
        }
      }
    }
    writeFileSync('docs/research/round43-axis-audit-pairing-agg.json', JSON.stringify({ totalIdentical: l2Same, records: [...agg.values()] }, null, 1))
    summary.pairing = { comparisons, l1Same, l2Same, causeCount, wheelAssemblies: pairWheelCache.size }
    console.log('PAIRING', JSON.stringify(summary.pairing))
  }, 1200000)

  it('結果を JSON に書き出す', () => {
    summary.totals = {
      teaSelections: teaStates.length, chocoSelections: chocoStates.length,
      pairingSelections: teaStates.length * chocoStates.length,
      teaAdjPairs: teaAdj.length, chocoAdjPairs: chocoAdj.length,
      teaClasses: teaRepByKey.size, chocoClasses: chocoRepByKey.size,
    }
    // ペアリングの同一レコードは round43-axis-audit-pairing-agg.json に集約記録済み
    writeFileSync('docs/research/round43-axis-audit.json', JSON.stringify({ summary, teaSame, chocoSame, kindSame }, null, 1))
    console.log('TOTALS', JSON.stringify(summary.totals))
    console.log('SAME counts: tea=', teaSame.length, 'choco=', chocoSame.length, 'kind=', kindSame.length)
  })
})
