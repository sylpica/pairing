import type { ChocolateItem, InteractionAnalysis, PairingCharacterAnalysis, TeaItem } from '../types'
import {
  analyzeTeaCombo, analyzeChocoCombo, comboProfileOf,
  type ChocoComboSel, type ComboAnalysis, type TeaComboSel,
} from './combo'
import { analyzePairing, type PairingResult } from './pairing'
import { analyzeInteractions } from './interactions'
import { analyzePairingCharacter } from './pairingCharacter'

// ペアリング（第3層）の組み立て（課題C, 2026-10-31）。
// ユーザーの階層モデルでは、第3層は「組み合わせの推測（第2層）同士の統合」。
// そのため産地・品種・系統が指定された側は、アイテム素のプロファイルではなく
// 組み合わせ分析（軸効果適用後）のノート集合を入力プロファイルに使う。
// 組み合わせ分析は選択空間単位（お茶 2,266 通り・チョコ 1,224 通り）でメモ化する。

const teaComboCache = new Map<string, ComboAnalysis>()
const chocoComboCache = new Map<string, ComboAnalysis>()

export function teaComboCached(sel: TeaComboSel): ComboAnalysis {
  const key = `${sel.kindId}|${sel.regionId}|${sel.cultivarId}`
  const hit = teaComboCache.get(key)
  if (hit) return hit
  const analysis = analyzeTeaCombo(sel)
  teaComboCache.set(key, analysis)
  return analysis
}

export function chocoComboCached(sel: ChocoComboSel): ComboAnalysis {
  const key = `${sel.kind}|${sel.originId ?? ''}|${sel.lineage ? `${sel.lineage.layer}:${sel.lineage.id}` : ''}`
  const hit = chocoComboCache.get(key)
  if (hit) return hit
  const analysis = analyzeChocoCombo(sel)
  chocoComboCache.set(key, analysis)
  return analysis
}

export interface PairingAssembly {
  /** 軸指定がある側は profile を組み合わせ分析由来に差し替えた合成アイテム */
  teaItem: TeaItem
  chocoItem: ChocolateItem
  teaAnalysis: ComboAnalysis | null
  chocoAnalysis: ComboAnalysis | null
  result: PairingResult
  interactions: InteractionAnalysis
  characters: PairingCharacterAnalysis
}

/**
 * ペアリング画面と全数検証が共有する組み立て。
 * teaSel / chocoSel が null の側は素のプロファイルのまま（第2層を経ない）。
 * sel がある側は、その選択が viable であることが呼び出し側の前提
 * （画面は ComboSelectors が viable な選択だけを保持する）。
 */
export function assemblePairing(
  tea: TeaItem,
  choco: ChocolateItem,
  teaSel: TeaComboSel | null,
  chocoSel: ChocoComboSel | null,
): PairingAssembly {
  const teaAnalysis = teaSel ? teaComboCached(teaSel) : null
  const chocoAnalysis = chocoSel ? chocoComboCached(chocoSel) : null
  const teaItem: TeaItem = teaAnalysis
    ? { ...tea, profile: comboProfileOf(teaAnalysis, tea.profile) }
    : tea
  const chocoItem: ChocolateItem = chocoAnalysis
    ? { ...choco, profile: comboProfileOf(chocoAnalysis, choco.profile) }
    : choco
  return {
    teaItem,
    chocoItem,
    teaAnalysis,
    chocoAnalysis,
    result: analyzePairing(teaItem.profile, chocoItem.profile),
    interactions: analyzeInteractions(teaItem, chocoItem),
    characters: analyzePairingCharacter(teaItem, chocoItem),
  }
}
