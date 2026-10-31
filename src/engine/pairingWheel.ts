import type {
  ChocolateItem, ComboNote, ComboTaste, FlavorProfile, Intensity, InteractionAnalysis,
  TasteKey, TeaItem,
} from '../types'
import type { CompoundContext } from '../data/compounds'
import { noteById } from '../data/flavors'
import type { ComboAnalysis } from './combo'
import { CHARACTER_RULE_LABELS } from './pairingCharacter'
import { TASTE_LABELS } from './pairing'

// ペアリング結果の3階層ホイール用データ（第26弾、2026-10-31 実機FB）。
// 従来は組み合わせの味わいを「味わいの性格」のチップ（約10種の粗い分類）で
// 示していたため、産地・品種を変えても顔ぶれがほぼ変わらなかった。
// 本モジュールは第3層の推測をノート単位で組み立てる:
//   1. 両側の組み合わせプロファイル（第2層適用後）の香味ノート・味覚を、
//      性格のような粗い分類に潰さず、ノート単位の重みとして統合する。
//      ノートの基礎重みは各側の強さのランク（弱い1・普通2・強い3）の合計
//      （既存ホイールの重み付けと同じ単位）。
//   2. 発火した相互作用ルール（interactions.ts の M1〜M14）で重みを調整する。
//      調整係数は全ルール共通で「強さ1段分」の1組だけを使う（強める方向 =
//      普通→強いの比 1.5、抑える方向 = 普通→弱いの比 0.5）。ルールごとの
//      恣意的な係数は作らない。方向の定まらないルール（M8 持続の変化、
//      M12 放出の増減、M14 均衡原則）は重みを変えない。
//   3. 重みの大きい順に代表ノートを最大7件まで選ぶ（2〜7件の規則。
//      候補自体が2件未満の組み合わせでは無理に作らず、そのまま出す）。
//      ただし軸指定（産地・品種・系統）によって土台から変わったノート
//      （distinctiveNoteIds）は、その組み合わせを特徴づける香りとして
//      代表から漏れないようにする。重み順の選定で漏れた distinctive な
//      ノートがある場合、選定済みの非 distinctive ノートのうち最も重みの
//      小さいものと入れ替える。産地・品種を変えたときの差が「弱い」
//      ノートにだけ現れる組み合わせでも、ホイールの顔ぶれが変わるように
//      するための編集原則であり、データ自体は作っていない。
// 全て第3層の推測（level: 'inferred'）であり、実測とは混同させない。
// スコア・順位の数値は表示しない（重みは選定と割合の算出にだけ使う）。

const rank = (i: Intensity) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)
const INTENSITY_BY_RANK: Intensity[] = ['weak', 'normal', 'strong']
const ENHANCE_FACTOR = 1.5
const SUPPRESS_FACTOR = 0.5
export const PAIRING_WHEEL_MAX_NOTES = 7

/** 相互作用ルール → 重み調整の説明（方法の透明性のため詳細表示に使う） */
const RULE_PHRASE: Record<string, string> = {
  'shared-aroma-congruency': '共通する香りは一つのまとまった印象として感じられやすいため、重みを強めています',
  'sweetness-enhances-retronasal-aroma': '甘味が相手の香りを際立たせるため、その側の香りの重みを強めています',
  'strong-aroma-covers-delicate': '強い香りが穏やかな香りを覆うため、その側の香りの重みを抑えています',
  'sweet-aroma-enhances-sweetness': '甘い香りが甘味を際立たせるため、甘味の重みを強めています',
  'warmth-and-sweetness': '温かさで甘味が感じられやすくなるため、甘味の重みを強めています',
  'cacao-aroma-enhances-bitterness': 'カカオの香りが苦味を強める方向のため、苦味の重みを強めています',
  'sourness-enhances-bitterness': '酸味が苦味を強める方向のため、苦味の重みを強めています',
  'sweetness-suppresses-bitterness': '甘味が苦味を抑える（混合抑制）ため、苦味の重みを抑えています',
  'sweetness-suppresses-sourness': '甘味が酸味を抑える（混合抑制）ため、酸味の重みを抑えています',
  'sweetness-softens-astringency': '甘味が渋味を和らげるため、渋味の重みを抑えています',
  'fat-opposes-astringency': '脂肪が渋味を和らげるため、渋味の重みを抑えています',
  'milk-protein-softens-astringency': '乳タンパク質が渋味を和らげるため、渋味の重みを抑えています',
  'umami-aroma-interaction': 'うま味と香りの相互作用でうま味が引き立つ方向のため、うま味の重みを強めています',
}

export interface PairingAdjustment {
  ruleId: string
  /** ルールの表示名（CHARACTER_RULE_LABELS と同じ） */
  label: string
  direction: 'enhance' | 'suppress'
  phrase: string
}

const adjustmentOf = (ruleId: string, direction: 'enhance' | 'suppress'): PairingAdjustment => ({
  ruleId,
  label: CHARACTER_RULE_LABELS[ruleId] ?? ruleId,
  direction,
  phrase: RULE_PHRASE[ruleId] ?? '',
})

export interface PairingWheelSideInput {
  type: 'tea' | 'chocolate'
  /** 文面での呼び名（異種ペアは種別名、同種ペアはアイテム名） */
  label: string
  /** 第2層適用後のアイテム（profile は組み合わせ分析で差し替え済み） */
  item: TeaItem | ChocolateItem
  analysis: ComboAnalysis | null
  /** 軸指定によって土台（軸なし）から変わったノート（追加された／強さが
   *  変わった）。代表選定で優先的に残す。算出は pairingCombo.ts が担う。 */
  distinctiveNoteIds?: Set<string>
}

export interface PairingNoteContribution {
  sideLabel: string
  /** その側でのノート（無い側は null） */
  note: ComboNote | null
  /** その側の寄与に掛かった相互作用の係数（1 = 調整なし） */
  factor: number
  ruleIds: string[]
}

export interface PairingNoteMeta {
  noteId: string
  /** 統合後の重み（選定に使った値そのもの） */
  weight: number
  contributions: PairingNoteContribution[]
  adjustments: PairingAdjustment[]
}

export interface PairingTasteMeta {
  key: TasteKey
  weight: number
  adjustments: PairingAdjustment[]
  sideIntensities: { sideLabel: string; intensity: Intensity }[]
}

export interface PairingWheelData {
  /** 代表ノート（最大7件、重みの大きい順）。全て level: 'inferred' */
  notes: ComboNote[]
  /** 統合した味覚（最大で5種）。全て level: 'inferred' */
  tastes: ComboTaste[]
  /** 両側の文脈（化合物の tier 判定・具体名の推測を和集合で使う） */
  contexts: CompoundContext[]
  /** 選定前の候補ノート数 */
  candidateCount: number
  /** 候補が2件未満で、代表ノートが2件に満たない組み合わせか */
  underMinimum: boolean
  noteMeta: Map<string, PairingNoteMeta>
  tasteMeta: Map<TasteKey, PairingTasteMeta>
}

// アイテムの実測プロファイル → 組み合わせ系の形への変換。
// ProfileWheelPanel.comboNotesFromProfile / TasteWheel.comboTastesFromProfile と
// 同じ写像（basis: measured/sensory → measured、それ以外 → general）。
const profileToComboNotes = (profile: FlavorProfile): ComboNote[] =>
  profile.aromas.map((a) => ({
    noteId: a.noteId,
    intensity: a.intensity,
    level: a.basis === 'measured' || a.basis === 'sensory' ? 'measured' : 'general',
    basis: [{ from: 'profile' as const, text: '', sourceIds: [...a.sourceIds] }],
    sourceIds: [...a.sourceIds],
  }))

const TASTE_KEYS = Object.keys(TASTE_LABELS) as TasteKey[]
const profileToComboTastes = (profile: FlavorProfile): ComboTaste[] =>
  TASTE_KEYS.flatMap((key) => {
    const t = profile.tastes[key]
    if (!t || t.intensity === 'unknown') return []
    return [{
      key, intensity: t.intensity,
      level: (t.basis === 'measured' || t.basis === 'sensory' ? 'measured' : 'general') as ComboTaste['level'],
      text: '', sourceIds: [...t.sourceIds],
    }]
  })

interface SideWork {
  input: PairingWheelSideInput
  profile: FlavorProfile
  comboNotes: Map<string, ComboNote>
  comboTastes: Map<TasteKey, ComboTaste>
  /** 「普通」以上で記録された香味ノート → ランク（interactions.ts の known と同じ） */
  knownNotes: Map<string, number>
  /** ノートごとの係数と、その根拠ルール */
  factors: Map<string, { factor: number; ruleIds: string[] }>
}

function sideWork(input: PairingWheelSideInput): SideWork {
  const profile = input.item.profile
  const notes = input.analysis ? input.analysis.notes : profileToComboNotes(profile)
  const tastes = input.analysis ? input.analysis.tastes : profileToComboTastes(profile)
  return {
    input,
    profile,
    comboNotes: new Map(notes.map((n) => [n.noteId, n])),
    comboTastes: new Map(tastes.map((t) => [t.key, t])),
    knownNotes: new Map(profile.aromas.filter((a) => rank(a.intensity) >= 2).map((a) => [a.noteId, rank(a.intensity)])),
    factors: new Map(),
  }
}

function applyFactor(side: SideWork, noteId: string, factor: number, ruleId: string) {
  const cur = side.factors.get(noteId) ?? { factor: 1, ruleIds: [] }
  cur.factor *= factor
  if (!cur.ruleIds.includes(ruleId)) cur.ruleIds.push(ruleId)
  side.factors.set(noteId, cur)
}

/** 味覚への相互作用の対応表（発火したルール → 対象の味・方向）。
 *  interactions.ts の各ルールの知覚的な帰結を、そのまま重みの方向に写したもの。 */
const TASTE_RULE_MAP: { key: TasteKey; ruleId: string; direction: 'enhance' | 'suppress' }[] = [
  { key: 'sweet', ruleId: 'sweet-aroma-enhances-sweetness', direction: 'enhance' },
  { key: 'sweet', ruleId: 'warmth-and-sweetness', direction: 'enhance' },
  { key: 'bitter', ruleId: 'cacao-aroma-enhances-bitterness', direction: 'enhance' },
  { key: 'bitter', ruleId: 'sourness-enhances-bitterness', direction: 'enhance' },
  { key: 'bitter', ruleId: 'sweetness-suppresses-bitterness', direction: 'suppress' },
  { key: 'sour', ruleId: 'sweetness-suppresses-sourness', direction: 'suppress' },
  { key: 'astringent', ruleId: 'sweetness-softens-astringency', direction: 'suppress' },
  { key: 'astringent', ruleId: 'fat-opposes-astringency', direction: 'suppress' },
  { key: 'astringent', ruleId: 'milk-protein-softens-astringency', direction: 'suppress' },
  { key: 'umami', ruleId: 'umami-aroma-interaction', direction: 'enhance' },
]

const uniq = <T,>(xs: T[]): T[] => [...new Set(xs)]

/**
 * ペアリング（第3層）のホイール用データを組み立てる。
 * sides は表示順ではなく、相互作用エンジンに渡した順（異種ペアでは
 * お茶→チョコに正規化済み）で渡すこと（assembleBlend が担保する）。
 */
export function buildPairingWheel(
  sides: [PairingWheelSideInput, PairingWheelSideInput],
  interactions: InteractionAnalysis,
): PairingWheelData {
  const [wa, wb] = sides.map(sideWork) as [SideWork, SideWork]
  const works = [wa, wb]
  const statements = [...interactions.aroma, ...interactions.taste, ...interactions.mouthfeel]
  const fired = new Set(statements.map((s) => s.ruleId))
  const sourcesOfRules = (ruleIds: string[]) =>
    uniq(statements.filter((s) => ruleIds.includes(s.ruleId)).flatMap((s) => s.sourceIds))

  // ===== 香り: 相互作用による側ごとの係数 =====
  // M1/M3系: 共通する香りの調和。両側で「普通」以上に記録された共通ノートを強める。
  if (fired.has('shared-aroma-congruency')) {
    for (const noteId of wa.knownNotes.keys()) {
      if (!wb.knownNotes.has(noteId)) continue
      applyFactor(wa, noteId, ENHANCE_FACTOR, 'shared-aroma-congruency')
      applyFactor(wb, noteId, ENHANCE_FACTOR, 'shared-aroma-congruency')
    }
  }
  // M3: 甘味のある側と組む相手側の香りが際立つ。発火条件は interactions.ts と同じ。
  if (fired.has('sweetness-enhances-retronasal-aroma')) {
    for (const [aromaSide, sweetSide] of [[wa, wb], [wb, wa]] as const) {
      if (rank(sweetSide.profile.tastes.sweet.intensity) >= 2 && aromaSide.knownNotes.size > 0) {
        for (const noteId of aromaSide.knownNotes.keys()) {
          applyFactor(aromaSide, noteId, ENHANCE_FACTOR, 'sweetness-enhances-retronasal-aroma')
        }
      }
    }
  }
  // M4: 強い香りが相手の穏やかな香りを覆う。発火条件は interactions.ts と同じ。
  if (fired.has('strong-aroma-covers-delicate')) {
    for (const [strongSide, otherSide] of [[wa, wb], [wb, wa]] as const) {
      const otherKnown = [...otherSide.knownNotes.entries()]
      if (otherKnown.length === 0 || Math.max(...otherKnown.map(([, r]) => r)) > 2) continue
      const otherCats = new Set(otherKnown.map(([id]) => noteById(id)?.categoryId))
      const strong = [...strongSide.profile.aromas].find((x) =>
        rank(x.intensity) >= 2 && x.intensity === 'strong' && !otherCats.has(noteById(x.noteId)?.categoryId ?? ''))
      if (strong) {
        for (const noteId of otherSide.knownNotes.keys()) {
          applyFactor(otherSide, noteId, SUPPRESS_FACTOR, 'strong-aroma-covers-delicate')
        }
      }
    }
  }

  // ===== 香り: ノート単位の統合と代表選定 =====
  interface Candidate {
    noteId: string
    weight: number
    maxRank: number
    rankSum: number
    perSide: { note: ComboNote | null; rank: number; factor: number; ruleIds: string[] }[]
    adjustments: PairingAdjustment[]
  }
  const candidateIds = uniq([...wa.comboNotes.keys(), ...wb.comboNotes.keys()])
    .filter((id) => noteById(id) && Math.max(rank(wa.comboNotes.get(id)?.intensity ?? 'unknown'), rank(wb.comboNotes.get(id)?.intensity ?? 'unknown')) > 0)
  const candidates: Candidate[] = candidateIds.map((noteId) => {
    const perSide = works.map((w) => {
      const note = w.comboNotes.get(noteId) ?? null
      const f = w.factors.get(noteId)
      return { note, rank: note ? rank(note.intensity) : 0, factor: f?.factor ?? 1, ruleIds: f?.ruleIds ?? [] }
    })
    const appliedRules = uniq(perSide.flatMap((p) => p.ruleIds))
    return {
      noteId,
      weight: perSide.reduce((a, p) => a + p.rank * p.factor, 0),
      maxRank: Math.max(...perSide.map((p) => p.rank)),
      rankSum: perSide.reduce((a, p) => a + p.rank, 0),
      perSide,
      adjustments: appliedRules.map((ruleId) => adjustmentOf(ruleId,
        ruleId === 'strong-aroma-covers-delicate' ? 'suppress' : 'enhance')),
    }
  })
  // 決定的な選定順: 重み → 強い側のランク → ランク合計 → ノートID（辞書順）
  candidates.sort((x, y) =>
    y.weight - x.weight || y.maxRank - x.maxRank || y.rankSum - x.rankSum
    || (x.noteId < y.noteId ? -1 : x.noteId > y.noteId ? 1 : 0))
  const selected = candidates.slice(0, PAIRING_WHEEL_MAX_NOTES)
  // 軸指定で変わったノート（distinctive）が重み順で漏れた場合は、選定済みの
  // 非 distinctive ノートのうち最も重みの小さいものと入れ替えて代表に残す。
  const distinctiveIds = new Set([
    ...(sides[0].distinctiveNoteIds ?? []),
    ...(sides[1].distinctiveNoteIds ?? []),
  ])
  if (selected.length === PAIRING_WHEEL_MAX_NOTES && distinctiveIds.size > 0) {
    const cutDistinctive = candidates
      .filter((c) => !selected.includes(c) && distinctiveIds.has(c.noteId))
      .sort((x, y) => y.weight - x.weight)
    for (const d of cutDistinctive) {
      let lowestIdx = -1
      for (let i = selected.length - 1; i >= 0; i--) {
        if (!distinctiveIds.has(selected[i].noteId)) { lowestIdx = i; break }
      }
      if (lowestIdx < 0) break
      selected[lowestIdx] = d
    }
    selected.sort((x, y) =>
      y.weight - x.weight || y.maxRank - x.maxRank || y.rankSum - x.rankSum
      || (x.noteId < y.noteId ? -1 : x.noteId > y.noteId ? 1 : 0))
  }

  const noteMeta = new Map<string, PairingNoteMeta>()
  const notes: ComboNote[] = selected.map((c) => {
    noteMeta.set(c.noteId, {
      noteId: c.noteId,
      weight: c.weight,
      contributions: works.map((w, i) => ({
        sideLabel: w.input.label,
        note: c.perSide[i].note,
        factor: c.perSide[i].factor,
        ruleIds: c.perSide[i].ruleIds,
      })),
      adjustments: c.adjustments,
    })
    // 表示上の強さ: 強い側のランクを土台に、強める調整があれば1段上げ、
    // 全ての寄与側で抑える調整だけなら1段下げる（組み合わせ分析の
    // 効果シフトと同じ「1段」の作法）。
    const contribFactors = c.perSide.filter((p) => p.rank > 0).map((p) => p.factor)
    let step = 0
    if (contribFactors.some((f) => f > 1)) step += 1
    if (contribFactors.length > 0 && contribFactors.every((f) => f < 1)) step -= 1
    const intensity = INTENSITY_BY_RANK[Math.max(0, Math.min(2, c.maxRank - 1 + step))]
    const ruleIds = uniq(c.perSide.flatMap((p) => p.ruleIds))
    return {
      noteId: c.noteId,
      intensity,
      level: 'inferred' as const,
      basis: c.perSide.flatMap((p) => p.note?.basis ?? []),
      sourceIds: uniq([
        ...c.perSide.flatMap((p) => p.note?.sourceIds ?? []),
        ...sourcesOfRules(ruleIds),
      ]),
    }
  })

  // ===== 味覚: 統合と相互作用の反映 =====
  const tasteMeta = new Map<TasteKey, PairingTasteMeta>()
  const tastes: ComboTaste[] = []
  for (const key of TASTE_KEYS) {
    const perSide = works.map((w) => w.comboTastes.get(key) ?? null)
    const ranks = perSide.map((t) => (t ? rank(t.intensity) : 0))
    const maxRank = Math.max(...ranks)
    if (maxRank === 0) continue
    const applied = TASTE_RULE_MAP.filter((m) => m.key === key && fired.has(m.ruleId))
    const factor = applied.reduce((a, m) => a * (m.direction === 'enhance' ? ENHANCE_FACTOR : SUPPRESS_FACTOR), 1)
    const weight = (ranks[0] + ranks[1]) * factor
    let step = 0
    if (applied.some((m) => m.direction === 'enhance')) step += 1
    if (applied.some((m) => m.direction === 'suppress')) step -= 1
    const intensity = INTENSITY_BY_RANK[Math.max(0, Math.min(2, maxRank - 1 + step))]
    const adjustments = applied.map((m) => adjustmentOf(m.ruleId, m.direction))
    tasteMeta.set(key, {
      key, weight, adjustments,
      sideIntensities: works.map((w, i) => ({ sideLabel: w.input.label, intensity: perSide[i]?.intensity ?? 'unknown' })),
    })
    const sentences = ['両側の味覚の記録を統合した推測です。']
    for (const adj of adjustments) sentences.push(`「${adj.label}」の相互作用が発火しているため、${adj.phrase}。`)
    tastes.push({
      key,
      intensity,
      level: 'inferred' as const,
      text: sentences.join(''),
      sourceIds: uniq([
        ...perSide.flatMap((t) => t?.sourceIds ?? []),
        ...sourcesOfRules(applied.map((m) => m.ruleId)),
      ]),
    })
  }

  // ===== 文脈（重複排除して和集合にする） =====
  const contexts: CompoundContext[] = []
  for (const w of works) {
    const ctx = w.input.analysis?.context ?? {
      side: w.input.type,
      kindId: w.input.type === 'tea' ? (w.input.item as TeaItem).kindId : (w.input.item as ChocolateItem).kind,
      itemName: w.input.item.name,
      itemId: w.input.item.id,
    }
    if (!contexts.some((c) => c.side === ctx.side && c.kindId === ctx.kindId && c.itemId === ctx.itemId)) {
      contexts.push(ctx)
    }
  }

  return {
    notes,
    tastes,
    contexts,
    candidateCount: candidates.length,
    underMinimum: candidates.length < 2,
    noteMeta,
    tasteMeta,
  }
}
