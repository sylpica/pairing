import { describe, it, expect } from 'vitest'
import { teaItems } from '../data/teas'
import { teaCultivars } from '../data/cultivars'
import { cacaoOrigins } from '../data/origins'
import { sources } from '../data/sources'
import { noteById, categoryById } from '../data/flavors'
import {
  TEA_COMBO_KINDS, CHOCO_COMBO_KINDS, allTeaRegionOptions, allLineages,
  teaComboViable, chocoComboViable, teaComboBaseItem, chocoRepresentativeItem,
  cloneRecordedOriginIds, type TeaComboSel, type ChocoComboSel,
} from './combo'
import { assemblePairing } from './pairingCombo'

// 課題C（2026-10-31 第4弾）の全数検証。
// 組み合わせ選択空間（お茶側・チョコ側の成立する全選択）を列挙し、
// 組み合わせ分析（第2層）を経た入力プロファイルの「相異なる顔ぶれ」全ペアについて、
// ペアリング（第3層）の組み立て（PairPage と同じ assemblePairing）が例外なく成立し、
// 不変条件（根拠の実在・スコア表現なし・参照の実在）を満たすことを確認する。
// 選択の総数は列挙カウンタで担保する（pairingFullSpace.test.ts の 2,773,584 通りは
// UI 選択モデルでの全数。本ファイルは組み合わせエンジンの選択空間での全数）。

const sourceIdSet = new Set(sources.map((s) => s.id))
const SCORE_PATTERN = /\d+\s*点/

function enumerateTeaSels(): TeaComboSel[] {
  const kindValues = [...new Set([...TEA_COMBO_KINDS, ...teaItems.map((t) => t.id)])]
  const regionIds = ['', ...allTeaRegionOptions().map((o) => o.id)]
  const cultivarIds = ['', ...teaCultivars.map((c) => c.id)]
  const out: TeaComboSel[] = []
  for (const kindId of kindValues)
    for (const regionId of regionIds)
      for (const cultivarId of cultivarIds) {
        const sel = { kindId, regionId, cultivarId }
        if (teaComboViable(sel)) out.push(sel)
      }
  return out
}

function enumerateChocoSels(): ChocoComboSel[] {
  const originIds = ['', ...cacaoOrigins.map((o) => o.id)]
  const lineageRefs = [null, ...allLineages().map((l) => ({ layer: l.layer, id: l.id }))]
  const out: ChocoComboSel[] = []
  for (const kind of CHOCO_COMBO_KINDS)
    for (const originId of originIds)
      for (const lineage of lineageRefs) {
        const sel: ChocoComboSel = { kind, originId, lineage }
        if (!chocoComboViable(sel)) continue
        // UI 到達可能性: クローンが選ばれている場合、産地は記録のあるものだけ
        if (lineage?.layer === 'clone' && originId) {
          const recorded = cloneRecordedOriginIds(lineage.id)
          if (recorded.length > 0 && !recorded.includes(originId)) continue
        }
        out.push(sel)
      }
  return out
}

const profileFace = (aromas: { noteId: string; intensity: string }[], tastes: Record<string, { intensity: string }>) =>
  JSON.stringify({
    a: aromas.map((n) => `${n.noteId}:${n.intensity}`),
    t: Object.entries(tastes).filter(([, v]) => v.intensity !== 'unknown').map(([k, v]) => `${k}:${v.intensity}`),
  })

describe('課題C: 組み合わせ選択空間 → ペアリング組み立ての全数検証', () => {
  it('相異なる入力プロファイルの全ペアで組み立てが例外なく成立し、不変条件を満たす', () => {
    const teaSels = enumerateTeaSels()
    const chocoSels = enumerateChocoSels()
    expect(teaSels.length).toBeGreaterThan(0)
    expect(chocoSels.length).toBeGreaterThan(0)

    // お茶側: 選択 → 組み合わせ分析 → 入力プロファイルの顔ぶれで重複排除
    const teaInputs = new Map<string, { item: NonNullable<ReturnType<typeof teaComboBaseItem>>; sel: TeaComboSel }>()
    for (const sel of teaSels) {
      const item = teaComboBaseItem(sel.kindId)!
      const a = assemblePairing(item, chocoRepresentativeItem('dark')!, sel, null)
      const key = `${item.id}|${profileFace(a.teaItem.profile.aromas, a.teaItem.profile.tastes)}`
      if (!teaInputs.has(key)) teaInputs.set(key, { item, sel })
    }
    const chocoInputs = new Map<string, { item: NonNullable<ReturnType<typeof chocoRepresentativeItem>>; sel: ChocoComboSel }>()
    for (const sel of chocoSels) {
      const item = chocoRepresentativeItem(sel.kind)!
      const a = assemblePairing(teaComboBaseItem('green')!, item, null, sel)
      const key = `${item.id}|${sel.kind}|${profileFace(a.chocoItem.profile.aromas, a.chocoItem.profile.tastes)}`
      if (!chocoInputs.has(key)) chocoInputs.set(key, { item, sel })
    }

    const violations: string[] = []
    let pairCount = 0
    for (const tea of teaInputs.values()) {
      for (const choco of chocoInputs.values()) {
        pairCount++
        const a = assemblePairing(tea.item, choco.item, tea.sel, choco.sel)
        const where = `${tea.item.id}(${tea.sel.kindId}|${tea.sel.regionId}|${tea.sel.cultivarId}) × ${choco.item.id}(${choco.sel.kind}|${choco.sel.originId}|${choco.sel.lineage?.id ?? ''})`
        for (const s of a.result.sharedNotes) if (!noteById(s.noteId)) violations.push(`${where}: 共有ノート ${s.noteId} が実在しない`)
        for (const s of a.result.sharedCategories) if (!categoryById(s.categoryId)) violations.push(`${where}: 共有分類 ${s.categoryId} が実在しない`)
        if (SCORE_PATTERN.test(a.result.message)) violations.push(`${where}: 結果文にスコア表現`)
        const statements = [...a.interactions.aroma, ...a.interactions.taste, ...a.interactions.mouthfeel]
        for (const s of statements) {
          for (const id of s.sourceIds) if (!sourceIdSet.has(id)) violations.push(`${where}: 相互作用の出典 ${id} が実在しない`)
          if (SCORE_PATTERN.test(s.text)) violations.push(`${where}: 相互作用文にスコア表現`)
        }
        for (const c of [...a.characters.aroma, ...a.characters.tasteMouthfeel]) {
          if (c.sourceIds.length === 0) violations.push(`${where}: 性格 ${c.id} に根拠出典がない`)
          for (const id of c.sourceIds) if (!sourceIdSet.has(id)) violations.push(`${where}: 性格 ${c.id} の出典 ${id} が実在しない`)
          if (SCORE_PATTERN.test(c.rationale) || SCORE_PATTERN.test(c.label)) violations.push(`${where}: 性格 ${c.id} にスコア表現`)
        }
        // 階層の正直さ: 軸指定側は組み合わせ分析（第2層）の overallLevel を必ず伴う
        if (tea.sel.regionId || tea.sel.cultivarId) {
          if (!a.teaAnalysis) violations.push(`${where}: お茶の軸指定があるのに組み合わせ分析がない`)
          else if (!['measured', 'general', 'inferred'].includes(a.teaAnalysis.overallLevel)) violations.push(`${where}: お茶の組み合わせレベルが不正`)
        }
        if (choco.sel.originId || choco.sel.lineage) {
          if (!a.chocoAnalysis) violations.push(`${where}: チョコの軸指定があるのに組み合わせ分析がない`)
        }
        if (violations.length > 30) break
      }
      if (violations.length > 30) break
    }
    console.log(`teaSels=${teaSels.length} chocoSels=${chocoSels.length} distinctTeaInputs=${teaInputs.size} distinctChocoInputs=${chocoInputs.size} distinctPairs=${pairCount} totalSelections=${teaSels.length * chocoSels.length}`)
    expect(violations).toEqual([])
    expect(pairCount).toBe(teaInputs.size * chocoInputs.size)
  }, 600000)
})
