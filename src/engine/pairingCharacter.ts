import type { ChocolateItem, Compound, InteractionStatement, PairingCharacter, PairingCharacterAnalysis, TasteKey, TeaItem } from '../types'
import { compounds, compoundTier } from '../data/compounds'
import { noteById } from '../data/flavors'
import { analyzeInteractionsForSides, type InteractionSide } from './interactions'
import { TASTE_LABELS } from './pairing'

// 組み合わせの味わいの性格の推測（docs/research/pairing-character-inference.md）。
// 相互作用エンジン（interactions.ts）の上に置く推測の層で、両アイテムで確認されている
// 化合物・香味ノート・味覚の顔ぶれと、発火した相互作用ルールから、組み合わせ全体の
// 「味わいの性格」（アーシー、スパイシー、まろやか、コクがある等）を推測する。
// 原則:
// - 性格は根拠（basis〜）のあるものだけ出す。根拠のない性格は生成しない。
// - 根拠の化合物は、そのアイテムの記録された香味・味覚（普通以上）に結びつき、
//   その茶類・種類または食品全般で確認済み（compoundTier で tier 2 以内）のものだけ。
//   品種特異的な成分（例: そうふうのアントラニル酸メチル）を一般のアイテムの根拠にしない。
// - スコア・数値評価は出さない。表示順は根拠の厚み（根拠の種類と数の多さ）で決めるが、数値は表示しない。
// - すべて推測（estimation: 'inferred'）であり、組み合わせ自体の実測ではない。

const rank = (i: string) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)
const noteName = (id: string) => noteById(id)?.name ?? id
const TASTE_KEYS = Object.keys(TASTE_LABELS) as TasteKey[]

/** 相互作用ルールIDの表示名（根拠表示用） */
export const CHARACTER_RULE_LABELS: Record<string, string> = {
  'sweet-aroma-enhances-sweetness': '甘い香りによる甘味の際立ち',
  'cacao-aroma-enhances-bitterness': 'カカオの香りによる苦味の際立ち',
  'sweetness-enhances-retronasal-aroma': '甘味による香りの際立ち',
  'strong-aroma-covers-delicate': '強い香りが穏やかな香りを覆う',
  'shared-aroma-congruency': '共通する香りの調和',
  'shared-aroma-inference-overlap': '共通する香りの推測の重なり',
  'sweetness-suppresses-bitterness': '甘味が苦味を抑える',
  'sweetness-suppresses-sourness': '甘味が酸味を抑える',
  'sourness-enhances-bitterness': '酸味が苦味を強める',
  'sweetness-softens-astringency': '甘味が渋味を和らげる',
  'umami-aroma-interaction': 'うま味と香りの相互作用',
  'fat-opposes-astringency': '渋味と脂肪の対向',
  'fat-coating-aroma-persistence': '脂肪の膜と香りの持続',
  'warmth-and-sweetness': '温かさと甘味の感じ方',
}

/** 性格推測の1側（第9弾で同種同士のブレンドにも対応するため一般化）。
 *  label は根拠文の呼び名（異種ペアでは 'お茶'／'チョコレート'、同種ペアではアイテム名）。 */
export interface CharacterSide {
  item: TeaItem | ChocolateItem
  type: 'tea' | 'chocolate'
  label: string
}

interface SideData {
  label: string
  type: 'tea' | 'chocolate'
  kindId: string
  /** 「普通」以上で記録された香味ノート → ランク */
  knownNotes: Map<string, number>
  /** 「普通」以上で記録された味覚 → ランク */
  knownTastes: Map<TasteKey, number>
  /** 記録された香味・味覚に結びつく確認済み化合物（tier 2 以内） */
  pool: Compound[]
}

function sideData(side: CharacterSide): SideData {
  const { item, type } = side
  const kindId = type === 'tea' ? (item as TeaItem).kindId : (item as ChocolateItem).kind
  const knownNotes = new Map(item.profile.aromas.filter((a) => rank(a.intensity) >= 2).map((a) => [a.noteId, rank(a.intensity)]))
  const knownTastes = new Map(TASTE_KEYS.filter((k) => rank(item.profile.tastes[k].intensity) >= 2).map((k) => [k, rank(item.profile.tastes[k].intensity)]))
  const pool = compounds.filter((c) =>
    compoundTier(c, { side: type, kindId }) <= 2
    && (c.noteIds.some((n) => knownNotes.has(n)) || (c.tasteLinks ?? []).some((l) => knownTastes.has(l.taste))))
  return { label: side.label, type, kindId, knownNotes, knownTastes, pool }
}

interface Ctx {
  a: SideData
  b: SideData
  aItem: TeaItem | ChocolateItem
  bItem: TeaItem | ChocolateItem
  poolAll: Compound[]
  fired: InteractionStatement[]
  firedRuleIds: Set<string>
}

const noteRank = (ctx: Ctx, id: string) => Math.max(ctx.a.knownNotes.get(id) ?? 0, ctx.b.knownNotes.get(id) ?? 0)
const tasteRankEither = (ctx: Ctx, k: TasteKey) => Math.max(ctx.a.knownTastes.get(k) ?? 0, ctx.b.knownTastes.get(k) ?? 0)
const hasNote = (ctx: Ctx, id: string) => noteRank(ctx, id) >= 2
const hasTaste = (ctx: Ctx, k: TasteKey) => tasteRankEither(ctx, k) >= 2

type Basis = { compounds: Compound[]; notes: string[]; tastes: TasteKey[]; rules: string[] }
const emptyBasis = (): Basis => ({ compounds: [], notes: [], tastes: [], rules: [] })

function buildCharacter(ctx: Ctx, id: string, kind: PairingCharacter['kind'], label: string, rationale: string, basis: Basis, extraSources: string[] = []): PairingCharacter {
  const sourceIds: string[] = []
  const push = (sid: string) => { if (!sourceIds.includes(sid)) sourceIds.push(sid) }
  basis.compounds.forEach((c) => c.sourceIds.forEach(push))
  for (const item of [ctx.aItem, ctx.bItem]) {
    for (const e of item.profile.aromas) if (basis.notes.includes(e.noteId)) e.sourceIds.forEach(push)
    for (const k of basis.tastes) item.profile.tastes[k].sourceIds.forEach(push)
  }
  ctx.fired.filter((s) => basis.rules.includes(s.ruleId)).forEach((s) => s.sourceIds.forEach(push))
  extraSources.forEach(push)
  return {
    id, kind, label, rationale,
    basisCompoundIds: basis.compounds.map((c) => c.id),
    basisNoteIds: basis.notes,
    basisTasteKeys: basis.tastes,
    basisRuleIds: basis.rules,
    sourceIds,
    estimation: 'inferred',
  }
}

// ===== 香りの性格（化合物と香味ノートの顔ぶれから） =====

interface AromaCharDef { id: string; label: string; noteSet: string[]; elementPhrase: string; conclusion: string }

const AROMA_DEFS: AromaCharDef[] = [
  { id: 'earthy', label: 'アーシー（土っぽい）', noteSet: ['earth', 'mushroom'], elementPhrase: '土やきのこを思わせる要素', conclusion: '土っぽく、落ち着いた方向の味わいになる可能性があります' },
  { id: 'spicy', label: 'スパイシー', noteSet: ['warm-spice', 'cinnamon', 'ginger', 'peppery'], elementPhrase: '香辛料を思わせる要素', conclusion: 'スパイスを思わせる、温かみのある味わいになる可能性があります' },
  { id: 'woody', label: 'ウッディ（木質）', noteSet: ['wood'], elementPhrase: '木や樹皮を思わせる要素', conclusion: '木質で落ち着いた味わいになる可能性があります' },
  { id: 'smoky', label: 'スモーキー', noteSet: ['smoky'], elementPhrase: '煙を思わせる要素', conclusion: '燻したようなスモーキーな味わいになる可能性があります' },
  { id: 'herbal', label: 'ハーバル', noteSet: ['herb', 'green-leaf', 'green-vegetable', 'hay'], elementPhrase: '草やハーブを思わせる要素', conclusion: 'ハーブのような清々しい味わいになる可能性があります' },
  { id: 'floral', label: 'フローラル', noteSet: ['floral-general', 'rose', 'orchid', 'white-flower', 'dried-flower'], elementPhrase: '花を思わせる要素', conclusion: '花のような華やかな味わいになる可能性があります' },
  { id: 'fruity', label: 'フルーティ', noteSet: ['citrus', 'berry', 'stone-fruit', 'tropical', 'dried-fruit', 'fruit-general'], elementPhrase: '果物を思わせる要素', conclusion: '果物のような明るい味わいになる可能性があります' },
  { id: 'nutty', label: 'ナッティ', noteSet: ['almond', 'hazelnut', 'walnut', 'nut-general', 'chestnut'], elementPhrase: '木の実を思わせる要素', conclusion: 'ナッツのような香ばしさのある味わいになる可能性があります' },
  { id: 'roasty', label: 'ロースティ（香ばしい）', noteSet: ['toast', 'coffee', 'caramelized', 'malt'], elementPhrase: '焙煎や麦芽を思わせる要素', conclusion: '焙煎したような香ばしい味わいになる可能性があります' },
  { id: 'sweet-aroma', label: '甘い香り', noteSet: ['caramel', 'honey', 'vanilla', 'brown-sugar'], elementPhrase: '甘さを連想させる香りの要素', conclusion: '甘い香りの印象が前に出る味わいになる可能性があります' },
]

function aromaCharacter(ctx: Ctx, def: AromaCharDef): PairingCharacter | null {
  const hitNotes = def.noteSet.filter((n) => hasNote(ctx, n))
  const hitCompounds = ctx.poolAll.filter((c) => c.noteIds.some((n) => def.noteSet.includes(n)))
  if (hitNotes.length === 0 && hitCompounds.length === 0) return null
  const bits: string[] = []
  if (hitNotes.length > 0) bits.push(`香りの記録にある「${hitNotes.map(noteName).join('」「')}」`)
  if (hitCompounds.length > 0) {
    const names = hitCompounds.slice(0, 3).map((c) => c.name).join('、')
    bits.push(`${def.elementPhrase}に関係する成分として確認されている${names}${hitCompounds.length > 3 ? 'など' : ''}`)
  }
  const rationale = `${bits.join('、')}の顔ぶれから、組み合わせ全体では${def.conclusion}。`
  return buildCharacter(ctx, def.id, 'aroma', def.label, rationale, { compounds: hitCompounds, notes: hitNotes, tastes: [], rules: [] })
}

// ===== 味・口当たりの性格（味覚と相互作用の発火状況から） =====

const DAIRY_NOTES = ['cream', 'milk', 'butter']

/** まろやか：渋味×脂肪の対向／甘味による渋味の緩和／乳系の香り */
function mellow(ctx: Ctx): PairingCharacter | null {
  const rules = ['fat-opposes-astringency', 'sweetness-softens-astringency'].filter((r) => ctx.firedRuleIds.has(r))
  const dairy = DAIRY_NOTES.filter((n) => hasNote(ctx, n))
  if (rules.length === 0 && dairy.length === 0) return null
  const basis = emptyBasis()
  basis.rules = rules
  basis.notes = dairy
  if (rules.length > 0 && hasTaste(ctx, 'astringent')) basis.tastes.push('astringent')
  if (rules.includes('sweetness-softens-astringency') && hasTaste(ctx, 'sweet')) basis.tastes.push('sweet')
  const sentences: string[] = []
  if (rules.includes('fat-opposes-astringency')) sentences.push('渋味のある飲み物と脂肪の多い食品を交互に味わうと、渋味と脂肪感が互いに和らぐことが実験で示されています')
  if (rules.includes('sweetness-softens-astringency')) sentences.push('甘味が渋味を和らげることも知られています')
  if (dairy.length > 0) sentences.push(`乳・クリーム系の香り（「${dairy.map(noteName).join('」「')}」）の記録も、口当たりを丸くする方向に働くと考えられます`)
  const rationale = `${sentences.join('。')}。この組み合わせでは、口当たりがまろやかになる可能性があります。`
  return buildCharacter(ctx, 'mellow', 'taste-mouthfeel', 'まろやか', rationale, basis)
}

/** コクがある：うま味×（甘味または乳の要素）。知覚概念の根拠は Ohsu et al. 2010（CaSR とコク味物質） */
function rich(ctx: Ctx): PairingCharacter | null {
  if (!hasTaste(ctx, 'umami')) return null
  const sweet = hasTaste(ctx, 'sweet')
  const dairy = DAIRY_NOTES.filter((n) => hasNote(ctx, n))
  if (!sweet && dairy.length === 0) return null
  const basis = emptyBasis()
  basis.tastes.push('umami')
  if (sweet) basis.tastes.push('sweet')
  if (!sweet) basis.notes = dairy
  basis.compounds = ctx.poolAll.filter((c) => (c.tasteLinks ?? []).some((l) => l.taste === 'umami'))
  if (ctx.firedRuleIds.has('umami-aroma-interaction')) basis.rules.push('umami-aroma-interaction')
  const umamiWhere = [ctx.a.knownTastes.has('umami') ? ctx.a.label : null, ctx.b.knownTastes.has('umami') ? ctx.b.label : null].filter(Boolean).join('と')
  const coFactor = sweet ? '甘味の記録' : `乳・クリーム系の香り（「${dairy.map(noteName).join('」「')}」）`
  const rationale = `「コク」は味そのものではなく、うま味や甘味に厚みや持続を感じさせる知覚として研究されています（コク味物質とカルシウム感知受容体の研究など）。この組み合わせでは${umamiWhere}にうま味の記録があり、${coFactor}も揃っているため、全体にコクのある味わいになる可能性があります。`
  return buildCharacter(ctx, 'rich', 'taste-mouthfeel', 'コクがある', rationale, basis, ['ohsu-2010-kokumi-casr'])
}

/** クリーミー：乳系の香りの記録 */
function creamy(ctx: Ctx): PairingCharacter | null {
  const dairy = DAIRY_NOTES.filter((n) => hasNote(ctx, n))
  if (dairy.length === 0) return null
  const basis = emptyBasis()
  basis.notes = dairy
  basis.compounds = ctx.poolAll.filter((c) => c.noteIds.some((n) => DAIRY_NOTES.includes(n)))
  const rationale = `乳・クリーム系の香り（「${dairy.map(noteName).join('」「')}」）が記録されているアイテムがあり、脂肪分と合わさって、クリーミーでなめらかな口当たりになる可能性があります。`
  return buildCharacter(ctx, 'creamy', 'taste-mouthfeel', 'クリーミー', rationale, basis)
}

/** すっきり：お茶の爽やかな香り＋締まった味、相手の甘味が際立ちすぎない。
 *  「爽やかさ」の担い手はお茶側の青葉・ハーブ系の香りと締まった味であるため、
 *  フレッシュ側はお茶の側に限る（お茶同士では両側とも候補になりうる）。 */
function clean(ctx: Ctx): PairingCharacter | null {
  for (const [fresh, other] of [[ctx.a, ctx.b], [ctx.b, ctx.a]] as const) {
    if (fresh.type !== 'tea') continue
    const greenNotes = ['green-leaf', 'herb'].filter((n) => fresh.knownNotes.has(n))
    const freshTastes = (['sour', 'bitter', 'astringent'] as TasteKey[]).filter((k) => fresh.knownTastes.has(k))
    if (greenNotes.length === 0 || freshTastes.length === 0) continue
    if ((other.knownTastes.get('sweet') ?? 0) >= 3) continue
    const basis = emptyBasis()
    basis.notes = greenNotes
    basis.tastes = freshTastes
    const rationale = `${fresh.label}には「${greenNotes.map(noteName).join('」「')}」のような爽やかな香りがあり、${freshTastes.map((k) => TASTE_LABELS[k]).join('・')}の締まった味の要素も記録されています。${other.label}の甘味が際立つ組み合わせではないため、後味のすっきりした味わいになる可能性があります。`
    return buildCharacter(ctx, 'clean', 'taste-mouthfeel', 'すっきり', rationale, basis)
  }
  return null
}

/** シャープ：酸味が苦味を強める相互作用、または強い酸味 */
function sharp(ctx: Ctx): PairingCharacter | null {
  const ruleFired = ctx.firedRuleIds.has('sourness-enhances-bitterness')
  const sourStrong = tasteRankEither(ctx, 'sour') >= 3
  if (!ruleFired && !sourStrong) return null
  const basis = emptyBasis()
  if (ruleFired) basis.rules.push('sourness-enhances-bitterness')
  if (hasTaste(ctx, 'sour')) basis.tastes.push('sour')
  if (hasTaste(ctx, 'bitter')) basis.tastes.push('bitter')
  const rationale = ruleFired
    ? '酸味と苦味が出会うと、苦味が強まる方向に働くことがあると知られています。この組み合わせでは酸味と苦味の記録が揃っているため、味わいがシャープに引き締まる可能性があります。'
    : '酸味の強い記録があるため、味わいはシャープな方向になる可能性があります。'
  return buildCharacter(ctx, 'sharp', 'taste-mouthfeel', 'シャープ', rationale, basis)
}

/** 重厚：強い苦味×渋味、または際立ったカカオ・焙煎の香り×苦味 */
function heavy(ctx: Ctx): PairingCharacter | null {
  const bitterStrong = tasteRankEither(ctx, 'bitter') >= 3
  const astringentKnown = hasTaste(ctx, 'astringent')
  const strongNotes = ['cacao', 'toast', 'wood'].filter((n) => noteRank(ctx, n) >= 3)
  const condA = bitterStrong && astringentKnown
  const condB = hasNote(ctx, 'cacao') && noteRank(ctx, 'cacao') >= 3 && hasTaste(ctx, 'bitter') && strongNotes.some((n) => n !== 'cacao')
  if (!condA && !condB) return null
  const basis = emptyBasis()
  if (hasTaste(ctx, 'bitter')) basis.tastes.push('bitter')
  if (astringentKnown) basis.tastes.push('astringent')
  basis.notes = [...new Set([...(noteRank(ctx, 'cacao') >= 3 ? ['cacao'] : []), ...strongNotes.filter((n) => n !== 'cacao')])]
  basis.compounds = ctx.poolAll.filter((c) => (c.tasteLinks ?? []).some((l) => (l.taste === 'bitter' || l.taste === 'astringent') && basis.tastes.includes(l.taste)))
  const tastePart = basis.tastes.length > 0 ? `${basis.tastes.map((k) => TASTE_LABELS[k]).join('と')}の記録` : ''
  const notePart = basis.notes.length > 0 ? `際立った「${basis.notes.map(noteName).join('」「')}」の香り` : ''
  const rationale = `${[tastePart, notePart].filter(Boolean).join('と、')}の顔ぶれから、骨格のある重厚な味わいになる可能性があります。`
  return buildCharacter(ctx, 'heavy', 'taste-mouthfeel', '重厚', rationale, basis)
}

/** 軽やか：強い味・重い香りがなく、軽い香りが中心 */
const HEAVY_NOTES = ['wood', 'earth', 'toast', 'cacao', 'smoky', 'caramelized']
const LIGHT_NOTES = ['floral-general', 'rose', 'orchid', 'white-flower', 'dried-flower', 'citrus', 'berry', 'stone-fruit', 'tropical', 'dried-fruit', 'fruit-general', 'green-leaf', 'herb']
function light(ctx: Ctx): PairingCharacter | null {
  const maxTaste = Math.max(0, ...TASTE_KEYS.map((k) => tasteRankEither(ctx, k)))
  if (maxTaste > 2) return null
  if (HEAVY_NOTES.some((n) => noteRank(ctx, n) >= 3)) return null
  const lightNotes = LIGHT_NOTES.filter((n) => hasNote(ctx, n))
  const recordedTastes = TASTE_KEYS.filter((k) => hasTaste(ctx, k))
  if (lightNotes.length === 0 || recordedTastes.length === 0) return null
  const basis = emptyBasis()
  basis.notes = lightNotes
  basis.tastes = recordedTastes
  const rationale = `どちらのアイテムにも際立って強い味や重い香りの記録がなく、「${lightNotes.slice(0, 3).map(noteName).join('」「')}」のような軽やかな香りが中心のため、軽やかな味わいになる可能性があります。`
  return buildCharacter(ctx, 'light', 'taste-mouthfeel', '軽やか', rationale, basis)
}

/** 根拠の厚み（根拠の種類の数→総数）で並べる。数値そのものは表示しない。 */
function byRichness(chars: (PairingCharacter | null)[]): PairingCharacter[] {
  return chars
    .map((c, i) => ({ c, i }))
    .filter((x): x is { c: PairingCharacter; i: number } => x.c !== null)
    .sort((a, b) => {
      const rich = (c: PairingCharacter) => ({
        kinds: [c.basisCompoundIds, c.basisNoteIds, c.basisTasteKeys, c.basisRuleIds].filter((a2) => a2.length > 0).length,
        total: c.basisCompoundIds.length + c.basisNoteIds.length + c.basisTasteKeys.length + c.basisRuleIds.length,
      })
      const ra = rich(a.c), rb = rich(b.c)
      return rb.kinds - ra.kinds || rb.total - ra.total || a.i - b.i
    })
    .map((x) => x.c)
}

const interactionSideOf = (s: CharacterSide): InteractionSide => ({
  type: s.type,
  label: s.label,
  profile: s.item.profile,
  itemId: s.item.id,
  chocoKind: s.type === 'chocolate' ? (s.item as ChocolateItem).kind : undefined,
})

/** 組み合わせの味わいの性格を推測する（2側一般版）。
 *  どちらか一方でも記録データ（香味・味覚の「普通」以上の記録）が無い組み合わせでは、
 *  組み合わせとしての推測の根拠が揃わないため、性格を出さない。 */
export function analyzePairingCharacterForSides(aSide: CharacterSide, bSide: CharacterSide): PairingCharacterAnalysis {
  const a = sideData(aSide)
  const b = sideData(bSide)
  const sideHasData = (s: SideData) => s.knownNotes.size + s.knownTastes.size > 0
  if (!sideHasData(a) || !sideHasData(b)) return { aroma: [], tasteMouthfeel: [] }
  const poolAll = [...new Map([...a.pool, ...b.pool].map((c) => [c.id, c])).values()]
  const interactions = analyzeInteractionsForSides(interactionSideOf(aSide), interactionSideOf(bSide))
  const fired = [...interactions.aroma, ...interactions.taste, ...interactions.mouthfeel]
  const ctx: Ctx = { a, b, aItem: aSide.item, bItem: bSide.item, poolAll, fired, firedRuleIds: new Set(fired.map((s) => s.ruleId)) }
  return {
    aroma: byRichness(AROMA_DEFS.map((def) => aromaCharacter(ctx, def))),
    tasteMouthfeel: byRichness([mellow(ctx), rich(ctx), creamy(ctx), clean(ctx), sharp(ctx), heavy(ctx), light(ctx)]),
  }
}

/** 従来の（お茶，チョコレート）呼び出し。異種ペアでは従来と同一の結果になる。 */
export function analyzePairingCharacter(teaItem: TeaItem, chocoItem: ChocolateItem): PairingCharacterAnalysis {
  return analyzePairingCharacterForSides(
    { item: teaItem, type: 'tea', label: 'お茶' },
    { item: chocoItem, type: 'chocolate', label: 'チョコレート' },
  )
}

export const hasAnyCharacter = (a: PairingCharacterAnalysis) => a.aroma.length + a.tasteMouthfeel.length > 0
