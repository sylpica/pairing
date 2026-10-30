import type { Basis, ComboLevel, ComboNote } from '../types'
import { usesForCultivar } from '../data/cultivars'
import { teaById, teaKinds } from '../data/teas'
import {
  TEA_COMBO_KINDS, CHOCO_KIND_LABEL,
  analyzeChocoCombo, analyzeTeaCombo, chocoComboPath, teaComboPath, teaComboViable, teaKindName,
} from './combo'
import { teaProcessRules } from '../data/processRules'
import type { CacaoLayer } from './pairingContext'

// 品種・系統の詳細ページに付けるフレーバーホイールの材料を作るエンジン。
// 土台は組み合わせページ（第2層）と同じ analyzeTeaCombo / analyzeChocoCombo で、
// 「その品種・系統が確認済み組み合わせで結びつく分類との組み合わせ」の結果を返す。
// 品種・系統固有のプロファイルではないことは、表示側と basis の文で明示する。
// - お茶の品種: 確認済み組み合わせ（cultivarTeaUses）のうち、組み合わせページが
//   扱える6分類は組み合わせエンジンを使う。玉露・抹茶（form）のみの組み合わせは、
//   対応するアイテムのプロファイルを分類由来として変換する（viaForm）。
// - カカオの系統: 種類（ダーク等）との組み合わせで組み合わせエンジンを使う。
// 根拠のないノートは生やさない（土台は常に実在のプロファイル）。

const basisLevel = (b: Basis): ComboLevel => (b === 'measured' || b === 'sensory' ? 'measured' : 'general')

export interface CultivarWheelEntry {
  /** 茶類ID（form の場合は 'gyokuro-form' 等） */
  kindId: string
  kindName: string
  notes: ComboNote[]
  overallLevel: ComboLevel
  /** 組み合わせページへのパス。form 由来の場合は null */
  comboPath: string | null
  /** form 由来の場合の、対応アイテム詳細へのパス */
  itemPath: string | null
  viaForm: boolean
}

const FORM_ITEM: Record<string, string> = {
  'gyokuro-form': 'gyokuro',
  'matcha-form': 'matcha',
  'sencha-form': 'sencha',
  'hojicha-form': 'hojicha',
}

export function cultivarWheels(cultivarId: string): CultivarWheelEntry[] {
  const uses = usesForCultivar(cultivarId)
  // 候補は「確認済み組み合わせ（uses）」に、「製法ルールが当たる分類」を加えたもの。
  // 組み合わせページの成立条件（uses がある、または製法ルールが当たる）と揃える
  // （例：やぶきた×紅茶は未確認の組み合わせだが、製法の科学からの推測ページが成立する）。
  const candidates: { kindId: string; confirmed: boolean }[] = uses.map((u) => ({ kindId: u.kindId, confirmed: true }))
  for (const r of teaProcessRules) {
    if (r.cultivarId !== cultivarId) continue
    for (const kindId of TEA_COMBO_KINDS) {
      const cat = teaKinds.find((k) => k.id === kindId)?.category
      if (cat === r.kindCategory && !candidates.some((c) => c.kindId === kindId)) {
        candidates.push({ kindId, confirmed: false })
      }
    }
  }
  const out: CultivarWheelEntry[] = []
  const seen = new Set<string>()
  for (const u of candidates) {
    if (seen.has(u.kindId)) continue
    seen.add(u.kindId)
    if (TEA_COMBO_KINDS.includes(u.kindId)) {
      const sel = { kindId: u.kindId, regionId: '', cultivarId }
      if (!teaComboViable(sel)) continue
      const a = analyzeTeaCombo(sel)
      out.push({
        kindId: u.kindId, kindName: teaKindName(u.kindId),
        notes: a.notes, overallLevel: a.overallLevel,
        comboPath: teaComboPath(sel), itemPath: null, viaForm: false,
      })
      continue
    }
    const itemId = FORM_ITEM[u.kindId]
    const item = itemId ? teaById(itemId) : undefined
    if (!item) continue
    const kindName = teaKinds.find((k) => k.id === u.kindId)?.name ?? u.kindId
    const baseDesc = `${kindName}の代表アイテム（${item.name}）のプロファイルに記録された香りです。この品種での実測ではなく、分類由来の表示です。`
    const notes: ComboNote[] = item.profile.aromas.map((a) => ({
      noteId: a.noteId,
      intensity: a.intensity,
      level: basisLevel(a.basis),
      basis: [{ from: 'profile', text: baseDesc, sourceIds: a.sourceIds }],
      sourceIds: [...a.sourceIds],
    }))
    out.push({
      kindId: u.kindId, kindName,
      notes,
      overallLevel: notes.some((n) => n.level === 'measured') ? 'measured' : 'general',
      comboPath: null, itemPath: `tea/${item.id}`, viaForm: true,
    })
  }
  return out
}

export interface LineageWheelEntry {
  kind: string
  kindLabel: string
  notes: ComboNote[]
  overallLevel: ComboLevel
  comboPath: string
}

export const LINEAGE_WHEEL_KINDS = ['dark', 'milk', 'white', 'ruby']

export function lineageWheels(layer: CacaoLayer, id: string): LineageWheelEntry[] {
  return LINEAGE_WHEEL_KINDS.map((kind) => {
    const sel = { kind, originId: '', lineage: { layer, id } }
    const a = analyzeChocoCombo(sel)
    return {
      kind, kindLabel: `${CHOCO_KIND_LABEL[kind] ?? kind}チョコレート`,
      notes: a.notes, overallLevel: a.overallLevel,
      comboPath: chocoComboPath(sel),
    }
  })
}
