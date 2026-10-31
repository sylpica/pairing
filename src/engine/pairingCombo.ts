import type { ChocolateItem, InteractionAnalysis, PairingCharacterAnalysis, TeaItem } from '../types'
import {
  analyzeTeaCombo, analyzeChocoCombo, comboProfileOf,
  type ChocoComboSel, type ComboAnalysis, type TeaComboSel,
} from './combo'
import { analyzePairing, CHOCO_PAIRING_LABEL, TEA_PAIRING_LABEL, type PairingResult, type PairingSideLabel } from './pairing'
import { analyzeInteractionsForSides, type InteractionSide } from './interactions'
import { analyzePairingCharacterForSides, type CharacterSide } from './pairingCharacter'
import { buildPairingWheel, type PairingWheelData, type PairingWheelSideInput } from './pairingWheel'

// ペアリング（第3層）の組み立て（課題C, 2026-10-31）。
// ユーザーの階層モデルでは、第3層は「組み合わせの推測（第2層）同士の統合」。
// そのため産地・品種・系統が指定された側は、アイテム素のプロファイルではなく
// 組み合わせ分析（軸効果適用後）のノート集合を入力プロファイルに使う。
// 組み合わせ分析は選択空間単位（お茶 2,266 通り・チョコ 1,224 通り）でメモ化する。
//
// 第9弾（自家ブレンド対応）で、両側が任意の種別（お茶/チョコ）の組み立て
// assembleBlend へ一般化した。異種ペアではエンジンの入力順を従来どおり
// （お茶，チョコレート）に正規化するため、従来の assemblePairing と
// 結果（共通点・対比・相互作用・性格）が一致する。
// 文面の呼び名は、異種ペアでは「お茶」「チョコレート」、同種ペアでは
// 区別のため各側のアイテム名を使う。

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

export type BlendSideType = 'tea' | 'chocolate'

export interface BlendSideInput {
  type: BlendSideType
  /** 土台アイテム（素のプロファイルの出所） */
  item: TeaItem | ChocolateItem
  /** 軸指定がある場合の組み合わせ選択。null の側は素のプロファイルのまま */
  sel: TeaComboSel | ChocoComboSel | null
}

export interface BlendSideResult {
  type: BlendSideType
  /** 軸指定がある側は profile を組み合わせ分析由来に差し替えた合成アイテム */
  item: TeaItem | ChocolateItem
  analysis: ComboAnalysis | null
  /** 文面での呼び名（異種ペアは種別名、同種ペアはアイテム名） */
  label: string
}

export interface BlendAssembly {
  a: BlendSideResult
  b: BlendSideResult
  /** 両側が同じ種別（お茶同士・チョコ同士の自家ブレンド）か */
  sameType: boolean
  result: PairingResult
  interactions: InteractionAnalysis
  characters: PairingCharacterAnalysis
  /** 第26弾: 結果先頭の3階層ホイール用データ（ノート単位の統合＋相互作用の反映） */
  wheel: PairingWheelData
}

function resolveBlendSide(input: BlendSideInput, sameType: boolean): BlendSideResult {
  const analysis = input.sel
    ? (input.type === 'tea' ? teaComboCached(input.sel as TeaComboSel) : chocoComboCached(input.sel as ChocoComboSel))
    : null
  const item = analysis
    ? { ...input.item, profile: comboProfileOf(analysis, input.item.profile) }
    : input.item
  const label = sameType
    ? input.item.name
    : input.type === 'tea' ? TEA_PAIRING_LABEL.full : CHOCO_PAIRING_LABEL.full
  return { type: input.type, item, analysis, label }
}

const pairingLabelOf = (side: BlendSideResult, sameType: boolean): PairingSideLabel =>
  sameType
    ? { full: side.item.name, short: side.item.name }
    : side.type === 'tea' ? TEA_PAIRING_LABEL : CHOCO_PAIRING_LABEL

const interactionSideOf = (side: BlendSideResult): InteractionSide => ({
  type: side.type,
  label: side.label,
  profile: side.item.profile,
  itemId: side.item.id,
  chocoKind: side.type === 'chocolate' ? (side.item as ChocolateItem).kind : undefined,
})

const characterSideOf = (side: BlendSideResult): CharacterSide => ({
  item: side.item,
  type: side.type,
  label: side.label,
})

/**
 * 第26弾: 軸指定によって土台（同じ分類・種類で軸なし）から変わったノート。
 * ホイールの代表選定で「その組み合わせを特徴づける香り」として優先的に
 * 残すために使う（選定ルールは pairingWheel.ts の冒頭コメント参照）。
 */
function distinctiveNotesOf(input: BlendSideInput, resolved: BlendSideResult): Set<string> {
  if (!input.sel || !resolved.analysis) return new Set()
  const base = input.type === 'tea'
    ? teaComboCached({ ...(input.sel as TeaComboSel), regionId: '', cultivarId: '' })
    : chocoComboCached({ ...(input.sel as ChocoComboSel), originId: '', lineage: null })
  const baseMap = new Map(base.notes.map((n) => [n.noteId, n.intensity]))
  const out = new Set<string>()
  for (const n of resolved.analysis.notes) {
    if (!baseMap.has(n.noteId) || baseMap.get(n.noteId) !== n.intensity) out.add(n.noteId)
  }
  return out
}

/**
 * ペアリング画面と全数検証が共有する組み立て（2側一般版）。
 * sel がある側は、その選択が viable であることが呼び出し側の前提
 * （画面は ComboSelectors が viable な選択だけを保持する）。
 * 同じアイテム同士のペアもそのまま組み立てる（自分自身とのブレンドは
 * そのアイテムのプロファイルとして扱う）。
 */
export function assembleBlend(aIn: BlendSideInput, bIn: BlendSideInput): BlendAssembly {
  const sameType = aIn.type === bIn.type
  const a = resolveBlendSide(aIn, sameType)
  const b = resolveBlendSide(bIn, sameType)
  // 異種ペアではエンジン入力順を（お茶，チョコレート）に正規化し、
  // 従来の assemblePairing と同一の結果にする。同種ペアでは選択した順（a, b）。
  const ordered: [BlendSideResult, BlendSideResult] =
    !sameType && a.type === 'chocolate' ? [b, a] : [a, b]
  const orderedIn: [BlendSideInput, BlendSideInput] =
    !sameType && a.type === 'chocolate' ? [bIn, aIn] : [aIn, bIn]
  const [f, s] = ordered
  const interactions = analyzeInteractionsForSides(interactionSideOf(f), interactionSideOf(s))
  return {
    a,
    b,
    sameType,
    result: analyzePairing(f.item.profile, s.item.profile, {
      a: pairingLabelOf(f, sameType),
      b: pairingLabelOf(s, sameType),
    }),
    interactions,
    characters: analyzePairingCharacterForSides(characterSideOf(f), characterSideOf(s)),
    // ホイールの重み調整は相互作用の発火状況に条件付けるため、interactions を渡す。
    // 側の順序は相互作用エンジンに渡した順（f, s）と揃える。
    wheel: buildPairingWheel(
      ordered.map((side, i) => ({
        type: side.type, label: side.label, item: side.item, analysis: side.analysis,
        distinctiveNoteIds: distinctiveNotesOf(orderedIn[i], side),
      })) as [PairingWheelSideInput, PairingWheelSideInput],
      interactions),
  }
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
  wheel: PairingWheelData
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
  const blend = assembleBlend(
    { type: 'tea', item: tea, sel: teaSel },
    { type: 'chocolate', item: choco, sel: chocoSel },
  )
  return {
    teaItem: blend.a.item as TeaItem,
    chocoItem: blend.b.item as ChocolateItem,
    teaAnalysis: blend.a.analysis,
    chocoAnalysis: blend.b.analysis,
    result: blend.result,
    interactions: blend.interactions,
    characters: blend.characters,
    wheel: blend.wheel,
  }
}
