import type { ComboNote, ComboTaste, Compound, InferredSpecific, TasteKey } from '../types'
import { flavorCategories, noteById } from '../data/flavors'
import {
  compoundById, compoundsForNote, compoundsForTaste, compoundTier, type CompoundContext,
} from '../data/compounds'
import { inferencesFor, noteInferences } from '../data/inferences'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'

// フレーバーホイールの3階層化（第8弾）のデータ層。
// 香り: 大分類（香味カテゴリ）→ 中分類（具体名）→ 小分類（寄与する化学物質）→ 成分詳細。
// 味: 大分類（基本味／口当たり・収れん感）→ 中分類（個々の味）→ 小分類（寄与する
//   物質）→ 成分詳細（第10弾で香りと同じ3階層に統一。味の大分類は2つだけ）。
//
// 中分類（具体名）の作り方:
// - 漠然としていないノート（柑橘・ベリー・バラ等の具体的な香味ノート）そのもの。
// - 漠然としたノート（花様・果実全般・トロピカル・木の実全般）については、
//   確認済み化合物からの推測（inferences.ts の InferredSpecific）だけを具体名とする。
//   足がかり（確認済み化合物／実測で具体名が直接報告された所見）の無い具体名は作らない。
// 漠然としたノート自体は中分類にしない。具体名が1つも無い大分類はドリルダウン不可とする。
//
// 割合（％）の算出（捏造禁止）:
// - ％は実測の含有率ではない。裏付けデータからの算出値であり、表示側でその旨を明記する。
// - 化合物の重み = 根拠の近さ（compoundTier: 1=この分類・種類の試料での研究例 → 3、
//   2=その食品全般の研究例 → 2、3=他の食品・茶類での研究例 → 1）。
//   化合物データには定量値（OAV・濃度・FD）の構造化フィールドが無く（文章内にのみ存在）、
//   文章からの数値抽出は誤読・捏造のリスクがあるため行わない。全件この重み付けで算出する。
// - 中分類の重み = その具体名を裏付ける化合物の重みの合計。化合物の裏付けが無い
//   ノート由来の具体名は、ノートの強さ（弱い1・普通2・強い3）で重み付ける。
// - ％は最大剰余法で整数化し、合計が必ず100になるようにする（全エントリ最低1%）。

/** 具体名に分解しないと意味が確定しない「漠然とした」ノート。これら自体は中分類にしない。 */
export const VAGUE_NOTE_IDS = ['floral-general', 'fruit-general', 'tropical', 'nut-general']

const rank = (i: string) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)
const tierWeight = (tier: 1 | 2 | 3) => 4 - tier

/** 重み配列 → 合計100の整数％（最大剰余法。全要素が正なら最低1%を保証する） */
export function allocatePercents(weights: number[]): number[] {
  const n = weights.length
  if (n === 0) return []
  const total = weights.reduce((a, b) => a + b, 0)
  if (total <= 0) {
    // 全て重み0の場合は等分（呼び出し側では通常起きない）
    const base = Math.floor(100 / n)
    const out = weights.map(() => base)
    for (let k = 0; k < 100 - base * n; k++) out[k]++
    return out
  }
  const raw = weights.map((w) => (w / total) * 100)
  const out = raw.map((r) => Math.floor(r))
  let rest = 100 - out.reduce((a, b) => a + b, 0)
  const order = raw.map((r, i) => ({ i, frac: r - Math.floor(r) })).sort((a, b) => b.frac - a.frac)
  for (let k = 0; rest > 0; k++, rest--) out[order[k % n].i]++
  // 重みが正なのに0%になった要素には、最大の要素から1%ずつ回す
  for (let i = 0; i < n; i++) {
    if (weights[i] > 0 && out[i] === 0) {
      const maxIdx = out.indexOf(Math.max(...out))
      if (out[maxIdx] > 1) { out[maxIdx]--; out[i] = 1 }
    }
  }
  return out
}

export interface TierCompound {
  compound: Compound
  /** 根拠の近さ（context が無い場合は 2 として扱う） */
  tier: 1 | 2 | 3
  weight: number
  percent: number
}

function tierCompounds(compounds: Compound[], context?: CompoundContext): TierCompound[] {
  const base = compounds.map((c) => {
    const tier = context ? compoundTier(c, context) : (2 as const)
    return { compound: c, tier, weight: tierWeight(tier), percent: 0 }
  })
  const percents = allocatePercents(base.map((b) => b.weight))
  return base.map((b, i) => ({ ...b, percent: percents[i] }))
}

/**
 * 組み合わせ文脈で使える具体名の推測。
 * (a) 土台アイテム自身のレコード（inferencesFor）。
 * (b) 同じ茶類・種類の複数アイテムで同一内容（同じ具体名＋同じ根拠成分）が共有されている
 *     具体名は、その茶類・種類レベルの知見として一般化する。根拠成分の全てが
 *     この文脈で tier 2 以内（この食品の範囲で確認済み）の場合に限る。
 *     1アイテムだけに紐づく具体名（例：鳳凰単叢のクチナシ）は一般化しない。
 */
export function comboSpecificsFor(context: CompoundContext, noteId: string): InferredSpecific[] {
  const exact = context.itemId ? inferencesFor(context.side, context.itemId, noteId) : []
  const seen = new Set(exact.map((s) => s.label))
  const out = [...exact]
  // (b) の判定材料： (side, noteId) の全レコードを具体名の署名ごとに集計する
  const kindOfItem = (side: 'tea' | 'chocolate', itemId: string): string | undefined =>
    side === 'tea'
      ? teaItems.find((t) => t.id === itemId)?.kindId
      : chocolateItems.find((c) => c.id === itemId)?.kind
  const bySignature = new Map<string, { spec: InferredSpecific; itemIds: Set<string> }>()
  for (const r of noteInferences) {
    if (r.itemSide !== context.side || r.noteId !== noteId) continue
    if (kindOfItem(r.itemSide, r.itemId) !== context.kindId) continue
    for (const s of r.specifics) {
      const sig = `${s.label}|${[...s.basisCompoundIds].sort().join(',')}`
      const e = bySignature.get(sig) ?? { spec: s, itemIds: new Set<string>() }
      e.itemIds.add(r.itemId)
      bySignature.set(sig, e)
    }
  }
  for (const { spec, itemIds } of bySignature.values()) {
    if (itemIds.size < 2) continue // 複数アイテムで共有されていないものは一般化しない
    if (seen.has(spec.label)) continue
    const ok = spec.basisCompoundIds.every((id) => {
      const c = compoundById(id)
      return c !== undefined && compoundTier(c, context) <= 2
    })
    if (!ok) continue
    seen.add(spec.label)
    out.push(spec)
  }
  return out
}

export interface MidEntry {
  key: string
  /** 具体名（ノート由来の場合はノート名） */
  label: string
  kind: 'note' | 'specific'
  /** 所属する香味ノート（specific の場合は、その推測のもとになった漠然としたノート） */
  noteId: string
  level: ComboNote['level']
  /** ノート由来の場合の強さ。specific の場合は null */
  intensity: ComboNote['intensity'] | null
  note?: ComboNote
  specific?: InferredSpecific
  /** 小分類（寄与する化学物質）。文脈がある場合は tier 2 以内に限る */
  compounds: TierCompound[]
  weight: number
  /** 大分類の中での割合（％、合計100） */
  percent: number
}

export interface CategoryTier {
  categoryId: string
  name: string
  color: string
  /** この大分類に属する組み合わせノート（全て） */
  notes: ComboNote[]
  /** 中分類（具体名）。空ならドリルダウン不可 */
  entries: MidEntry[]
  /** 大分類セグメントの大きさ（属するノートの強さの合計） */
  weight: number
  drillable: boolean
}

const noteCompounds = (noteId: string, context?: CompoundContext): Compound[] => {
  const linked = compoundsForNote(noteId)
  if (!context) return linked
  return linked.filter((c) => compoundTier(c, context) <= 2)
}

/** 香りの3階層データ（大分類→中分類）を組み合わせノートから構築する */
export function buildAromaTiers(notes: ComboNote[], context?: CompoundContext): CategoryTier[] {
  const known = notes.filter((n) => rank(n.intensity) > 0 && noteById(n.noteId))
  const out: CategoryTier[] = []
  for (const cat of flavorCategories) {
    const catNotes = known.filter((n) => noteById(n.noteId)!.categoryId === cat.id)
    if (catNotes.length === 0) continue
    const entries: MidEntry[] = []
    // 具体的なノート由来の中分類
    for (const n of catNotes) {
      if (VAGUE_NOTE_IDS.includes(n.noteId)) continue
      const compounds = tierCompounds(noteCompounds(n.noteId, context), context)
      entries.push({
        key: `note:${n.noteId}`,
        label: noteById(n.noteId)!.name,
        kind: 'note',
        noteId: n.noteId,
        level: n.level,
        intensity: n.intensity,
        note: n,
        compounds,
        weight: compounds.length > 0 ? compounds.reduce((a, c) => a + c.weight, 0) : rank(n.intensity),
        percent: 0,
      })
    }
    // 漠然としたノートへの推測（具体名）。具体的なノートと名前が重なるものは
    // ノート側を優先して落とす（例：柑橘ノートがある場合の「柑橘類」推測）。
    if (context) {
      for (const n of catNotes) {
        if (!VAGUE_NOTE_IDS.includes(n.noteId)) continue
        for (const spec of comboSpecificsFor(context, n.noteId)) {
          const dup = entries.some((e) => e.kind === 'note'
            && (e.label === spec.label || `${e.label}類` === spec.label || e.label === `${spec.label}類`))
          if (dup) continue
          const compounds = tierCompounds(
            spec.basisCompoundIds.map((id) => compoundById(id)).filter((c): c is Compound => c !== undefined),
            context)
          entries.push({
            key: `specific:${n.noteId}:${spec.label}`,
            label: spec.label,
            kind: 'specific',
            noteId: n.noteId,
            level: 'inferred',
            intensity: null,
            specific: spec,
            compounds,
            weight: compounds.reduce((a, c) => a + c.weight, 0),
            percent: 0,
          })
        }
      }
    }
    const percents = allocatePercents(entries.map((e) => e.weight))
    entries.forEach((e, i) => { e.percent = percents[i] })
    out.push({
      categoryId: cat.id,
      name: cat.name,
      color: cat.color,
      notes: catNotes,
      entries,
      weight: catNotes.reduce((a, n) => a + rank(n.intensity), 0),
      drillable: entries.length > 0,
    })
  }
  return out
}

// ===== 味の3階層（第10弾） =====
// 味の大分類は2つだけ:
// - 基本味: 舌の味蕾にある味覚受容体で感じる基本の味（甘味・酸味・苦味・うま味。
//   塩味のデータが将来出ればこちらに入れる）。
// - 口当たり・収れん感: 味覚ではなく口の中の感覚として感じるもの。渋味は
//   基本味ではなく、タンニン類が唾液タンパク質と結びついて生じる収れん感
//   （触覚に近い感覚）であり、こちらに分類する（アプリ内の味詳細でも
//   「渋味は収れん感」と区別してきた定義と一致させる）。
// データに存在しない味・グループは作らない。

export type TasteGroupId = 'basic' | 'mouthfeel'

export interface TasteGroupDef {
  id: TasteGroupId
  name: string
  color: string
  /** この大分類に属する味キー（中分類の表示順） */
  keys: TasteKey[]
}

export const TASTE_GROUPS: TasteGroupDef[] = [
  { id: 'basic', name: '基本味', color: '#b5654d', keys: ['sweet', 'sour', 'bitter', 'umami'] },
  { id: 'mouthfeel', name: '口当たり・収れん感', color: '#7a6a58', keys: ['astringent'] },
]

/** 味キー → 大分類。味の分類分けの唯一の定義（テストでもここを参照する） */
export const TASTE_GROUP_OF: Record<TasteKey, TasteGroupId> = {
  sweet: 'basic', sour: 'basic', bitter: 'basic', umami: 'basic',
  astringent: 'mouthfeel',
}

export interface TasteGroupTier {
  groupId: TasteGroupId
  name: string
  color: string
  /** 中分類（この文脈でデータのある味。強さの記録があるものだけ、定義順） */
  tastes: ComboTaste[]
  /** 大分類セグメントの大きさ（属する味の強さの合計） */
  weight: number
}

/** 味の3階層データ（大分類→中分類）を組み合わせの味から構築する */
export function buildTasteTiers(tastes: ComboTaste[]): TasteGroupTier[] {
  const known = tastes.filter((t) => rank(t.intensity) > 0)
  const out: TasteGroupTier[] = []
  for (const g of TASTE_GROUPS) {
    const members = g.keys.flatMap((k) => known.filter((t) => t.key === k))
    if (members.length === 0) continue
    out.push({
      groupId: g.id,
      name: g.name,
      color: g.color,
      tastes: members,
      weight: members.reduce((a, t) => a + rank(t.intensity), 0),
    })
  }
  return out
}

/** 味（中分類）に寄与する物質（小分類）。文脈がある場合は tier 2 以内に限る */
export function buildTasteCompounds(taste: TasteKey, context?: CompoundContext): TierCompound[] {
  const linked = compoundsForTaste(taste)
  const filtered = context ? linked.filter((c) => compoundTier(c, context) <= 2) : linked
  return tierCompounds(filtered, context)
}
