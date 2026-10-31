import type { Basis, ComboBasis, ComboLevel, ComboNote, ComboTaste, Intensity, TeaCultivar } from '../types'
import { comboTastesFromProfile } from '../components/TasteWheel'
import { compoundById, type CompoundContext } from '../data/compounds'
import { teaCultivars, teaCultivarById, usesForCultivar } from '../data/cultivars'
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
  /** 味モード用（第7弾・課題B）：組み合わせ分析の味プロファイル。
   *  form 由来の場合は対応アイテムの味覚プロファイルを変換したもの */
  tastes: ComboTaste[]
  overallLevel: ComboLevel
  /** 組み合わせページへのパス。form 由来の場合は null */
  comboPath: string | null
  /** form 由来の場合の、対応アイテム詳細へのパス */
  itemPath: string | null
  viaForm: boolean
  /** ホイールの化合物併記とノート詳細の階層判定に使う文脈＝土台アイテム */
  context: CompoundContext
  /** 第25弾：近縁品種からの推測ホイールの場合のみ、足がかりの説明（例「交配親：かなやみどり」） */
  inferredFromText?: string
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
        notes: a.notes, tastes: a.tastes, overallLevel: a.overallLevel,
        comboPath: teaComboPath(sel), itemPath: null, viaForm: false,
        context: a.context,
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
    const tastes: ComboTaste[] = comboTastesFromProfile(item.profile).map((t) => ({ ...t, text: baseDesc.replace('香りです', '味です') }))
    out.push({
      kindId: u.kindId, kindName,
      notes,
      tastes,
      overallLevel: notes.some((n) => n.level === 'measured') ? 'measured' : 'general',
      comboPath: null, itemPath: `tea/${item.id}`, viaForm: true,
      context: { side: 'tea', kindId: item.kindId, itemName: item.name, itemId: item.id },
    })
  }
  return out
}

export interface LineageWheelEntry {
  kind: string
  kindLabel: string
  notes: ComboNote[]
  /** 味モード用（第7弾・課題B）：組み合わせ分析の味プロファイル */
  tastes: ComboTaste[]
  overallLevel: ComboLevel
  comboPath: string
  /** ホイールの化合物併記とノート詳細の階層判定に使う文脈＝土台アイテム */
  context: CompoundContext
}

export const LINEAGE_WHEEL_KINDS = ['dark', 'milk', 'white', 'ruby']

export function lineageWheels(layer: CacaoLayer, id: string): LineageWheelEntry[] {
  return LINEAGE_WHEEL_KINDS.map((kind) => {
    const sel = { kind, originId: '', lineage: { layer, id } }
    const a = analyzeChocoCombo(sel)
    return {
      kind, kindLabel: `${CHOCO_KIND_LABEL[kind] ?? kind}チョコレート`,
      notes: a.notes, tastes: a.tastes, overallLevel: a.overallLevel,
      comboPath: chocoComboPath(sel),
      context: a.context,
    }
  })
}

/** 産地ページのホイール（第25弾で新設。系統ページと同型）：種類×産地の組み合わせ分析。 */
export function originWheels(originId: string): LineageWheelEntry[] {
  return LINEAGE_WHEEL_KINDS.map((kind) => {
    const sel = { kind, originId, lineage: null }
    const a = analyzeChocoCombo(sel)
    return {
      kind, kindLabel: `${CHOCO_KIND_LABEL[kind] ?? kind}チョコレート`,
      notes: a.notes, tastes: a.tastes, overallLevel: a.overallLevel,
      comboPath: chocoComboPath(sel),
      context: a.context,
    }
  })
}

// ===== 第25弾：確認済み組み合わせが無い品種への「推測ホイール」 =====
// 軸推測ルールの足がかり優先順のうち、品種ページで使える記録済みの足がかりだけを使う：
//   (e) 遺伝情報＝交配親の確認済み組み合わせの合成（親より一段弱く・全て inferred）
//   (d) 近接エンティティ＝子品種の確認済み組み合わせ（交配親が使えない場合のみ）
//   (b) その品種で検出・組成が確認された化合物 → 対応ノートを最も弱く追加
// 足がかりが記録に無い品種（親・子とも確認済み組み合わせが無く、化合物の所見も無い）
// には作らない。地域試料の転用もしない（品種データ自体が転用を禁じているため）。
const INT_RANK: Record<Intensity, number> = { unknown: -1, weak: 0, normal: 1, strong: 2 }
const weaken = (i: Intensity): Intensity => (i === 'strong' ? 'normal' : i === 'normal' ? 'weak' : i)

export function inferredCultivarWheels(cultivarId: string): CultivarWheelEntry[] {
  // 確認済みホイールがある品種には推測ホイールを重ねない
  if (cultivarWheels(cultivarId).length > 0) return []
  const c = teaCultivarById(cultivarId)
  if (!c) return []
  type Rel = { entity: TeaCultivar; relation: '交配親' | '子品種' }
  const parents: Rel[] = (c.parentCultivarIds ?? [])
    .map((pid) => teaCultivarById(pid))
    .filter((p): p is TeaCultivar => !!p)
    .map((entity) => ({ entity, relation: '交配親' as const }))
  const children: Rel[] = teaCultivars
    .filter((x) => (x.parentCultivarIds ?? []).includes(cultivarId))
    .map((entity) => ({ entity, relation: '子品種' as const }))
  const rels = parents.some((r) => usesForCultivar(r.entity.id).length > 0) ? parents : children
  // 茶類ごとに、近縁の「確認済み組み合わせ」のホイールを集める
  const kindOrder: string[] = []
  const byKind = new Map<string, { rel: Rel; entry: CultivarWheelEntry }[]>()
  for (const rel of rels) {
    const relWheels = cultivarWheels(rel.entity.id)
    for (const u of usesForCultivar(rel.entity.id)) {
      const entry = relWheels.find((w) => w.kindId === u.kindId)
      if (!entry) continue
      if (!byKind.has(u.kindId)) { byKind.set(u.kindId, []); kindOrder.push(u.kindId) }
      byKind.get(u.kindId)!.push({ rel, entry })
    }
  }
  const out: CultivarWheelEntry[] = []
  for (const kindId of kindOrder) {
    const srcs = byKind.get(kindId)!
    const kindName = srcs[0].entry.kindName
    const relNames = [...new Set(srcs.map((s) => s.rel.entity.name))]
    const relation = srcs[0].rel.relation
    const inferText = relation === '交配親'
      ? `交配親『${relNames.join('』『')}』の${kindName}での確認済み組み合わせからの推測です。${c.name}自体の実測ではなく、親より一段弱く表示しています（推測（未検証））。`
      : `子品種『${relNames.join('』『')}』の${kindName}での確認済み組み合わせからの推測です。${c.name}自体の実測ではありません（推測（未検証））。`
    const inferBasis: ComboBasis = { from: 'cultivar', text: inferText, sourceIds: [] }
    const noteMap = new Map<string, ComboNote>()
    const mergeNote = (n: ComboNote) => {
      const ex = noteMap.get(n.noteId)
      if (!ex) { noteMap.set(n.noteId, n); return }
      if (INT_RANK[n.intensity] < INT_RANK[ex.intensity]) ex.intensity = n.intensity
      for (const b of n.basis) if (!ex.basis.some((x) => x.text === b.text)) ex.basis.push(b)
      for (const sid of n.sourceIds) if (!ex.sourceIds.includes(sid)) ex.sourceIds.push(sid)
    }
    for (const { entry } of srcs) {
      for (const n of entry.notes) {
        mergeNote({
          noteId: n.noteId, intensity: weaken(n.intensity), level: 'inferred',
          basis: [inferBasis, ...n.basis], sourceIds: [...n.sourceIds],
        })
      }
    }
    // (b) その品種で検出・組成が確認された化合物 → 対応するノートを最も弱く示す
    for (const f of c.findings) {
      if (!f.compoundId) continue
      const comp = compoundById(f.compoundId)
      if (!comp || comp.noteIds.length === 0) continue
      if (!(comp.scopes ?? []).some((s) => s.side === 'tea' && s.kindId === kindId)) continue
      const b: ComboBasis = {
        from: 'cultivar',
        text: `${c.name}から検出が確認された成分「${comp.name}」の知られた香りに基づく推論です。この品種での寄与は未確認のため、香りの方向のみを最も弱く示します（推測（未検証））。`,
        sourceIds: [...comp.sourceIds],
      }
      for (const noteId of comp.noteIds) {
        const ex = noteMap.get(noteId)
        if (ex) { if (!ex.basis.some((x) => x.text === b.text)) ex.basis.push(b) }
        else mergeNote({ noteId, intensity: 'weak', level: 'inferred', basis: [b], sourceIds: [...comp.sourceIds] })
      }
    }
    const tasteMap = new Map<string, ComboTaste>()
    for (const { entry } of srcs) {
      for (const t of entry.tastes) {
        const w = weaken(t.intensity)
        const ex = tasteMap.get(t.key)
        if (!ex) tasteMap.set(t.key, { ...t, intensity: w, level: 'inferred' })
        else if (INT_RANK[w] < INT_RANK[ex.intensity]) ex.intensity = w
      }
    }
    out.push({
      kindId, kindName,
      notes: [...noteMap.values()], tastes: [...tasteMap.values()],
      overallLevel: 'inferred',
      comboPath: null, itemPath: null,
      viaForm: srcs[0].entry.viaForm,
      context: srcs[0].entry.context,
      inferredFromText: `${relation}：${relNames.join('・')}`,
    })
  }
  return out
}
