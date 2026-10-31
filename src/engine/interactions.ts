import type { ChocolateItem, ChocolateKind, FlavorProfile, InteractionAnalysis, InteractionStatement, Intensity, TeaItem } from '../types'
import { noteById } from '../data/flavors'
import { inferencesFor } from '../data/inferences'
import { compoundById } from '../data/compounds'
import { TASTE_LABELS } from './pairing'

// 組み合わせの相互作用ルールベース（docs/research/pairing-interactions.md）。
// 成分の合算や相性スコアは出さない。文献で裏付けられた知覚レベルの相互作用だけを、
// 2つのプロファイルの実データ（香味ノート・味覚）に条件付けして文章化する。
// 各文には根拠区分（general=一般的な知見 / exploratory=探索的な予想）と出典を必須とする。
// 言及する香味・味覚は、発火条件として確認した実データの範囲に限る（テストで自動検査）。
//
// 第9弾で2側一般（同種同士のブレンド）へ一般化した。相互作用の適用範囲:
// - 対称的な一般機序ルール（甘い香り×甘味、混合抑制、強い香りの優位など）は両側の
//   プロファイルだけに条件付けされ、種別を問わず発火する。
// - お茶×チョコの直接研究に基づくルール（M14 直接研究の均衡原則）は、
//   お茶×チョコのペアでのみ発火し、同種同士では発火しない。
// - 種別固定の実験条件を持つルール（M7 渋味と脂肪の対向、M8 脂肪の膜、M11 乳タンパク質、
//   M9 温かさ）は、条件を満たす側の組み合わせ（お茶側＋チョコ側）が揃う場合にのみ発火する。
// - お茶固有の現象（M13 クリーミングダウン）は、お茶側が1つでもあれば発火する。
// - お茶のポリフェノール（M12）は、ポリフェノール側がお茶である場合に、
//   香り側がどちらの種別でも発火する。
// 同種同士の文面では、各側の呼び名にアイテム名を使い、「お茶」「チョコレート」の
// 呼び名が他方の種別として誤って現れないようにする。

const rank = (i: Intensity) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)
const intLabel = (i: Intensity) => (i === 'strong' ? '強い' : i === 'normal' ? '普通' : i === 'weak' ? '弱い' : '不明')
const known = (p: FlavorProfile) => p.aromas.filter((a) => rank(a.intensity) >= 2)
const noteName = (id: string) => noteById(id)?.name ?? id
const tasteRank = (p: FlavorProfile, k: keyof typeof TASTE_LABELS) => rank(p.tastes[k].intensity)

const SWEET_AROMA_NOTES = ['caramel', 'honey', 'vanilla', 'brown-sugar']
const VAGUE_NOTES = ['floral-general', 'tropical', 'fruit-general']

/** 相互作用エンジンの1側。type は実験条件の判定に、label は文面の呼び名に使う。
 *  異種ペアでは label = 'お茶'／'チョコレート'、同種ペアではアイテム名。 */
export interface InteractionSide {
  type: 'tea' | 'chocolate'
  label: string
  profile: FlavorProfile
  itemId: string
  chocoKind?: ChocolateKind
}

type Side = InteractionSide

function stmt(ruleId: string, kind: InteractionStatement['kind'], text: string, level: InteractionStatement['level'], sourceIds: string[], usesInference = false): InteractionStatement {
  return { ruleId, kind, text, level, sourceIds, usesInference }
}

/** M1: 甘い香りが、他方の甘味を際立たせる（Stevenson 1999／Labbe 2006） */
function sweetAromaEnhancesSweetness(a: Side, b: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [aromaSide, tasteSide] of [[a, b], [b, a]] as const) {
    const sweetAroma = known(aromaSide.profile).find((x) => SWEET_AROMA_NOTES.includes(x.noteId))
    if (sweetAroma && tasteRank(tasteSide.profile, 'sweet') >= 2) {
      out.push(stmt('sweet-aroma-enhances-sweetness', 'aroma',
        `${aromaSide.label}の「${noteName(sweetAroma.noteId)}」のような甘い香りは、甘味と調和して甘さを際立たせることが知られています。${tasteSide.label}の甘味（${intLabel(tasteSide.profile.tastes.sweet.intensity)}）と一緒に味わうと、全体に甘く感じられる可能性があります。`,
        'general', ['stevenson-1999-odor-taste', 'labbe-2006-cocoa-beverage-olfaction']))
    }
  }
  return out
}

/** M2: カカオの香りが苦味を強める方向（Labbe 2006、ココア飲料での実証を類推） */
function cacaoAromaEnhancesBitterness(a: Side, b: Side): InteractionStatement[] {
  const cacaoSide = [a, b].find((s) => s.type === 'chocolate' && known(s.profile).some((x) => x.noteId === 'cacao'))
  if (!cacaoSide) return []
  const other = cacaoSide === a ? b : a
  const bitterSide = tasteRank(other.profile, 'bitter') >= 2 ? other : tasteRank(cacaoSide.profile, 'bitter') >= 2 ? cacaoSide : null
  if (!bitterSide) return []
  return [stmt('cacao-aroma-enhances-bitterness', 'aroma',
    `${cacaoSide.label}の「カカオ」の香りは、調和する苦味の知覚を強める方向に働くことが、ココア飲料の実験で示されています。この組み合わせでも、${bitterSide.label}の苦味（${intLabel(bitterSide.profile.tastes.bitter.intensity)}）が、単独で味わうときより前面に出て感じられる可能性があります。`,
    'exploratory', ['labbe-2006-cocoa-beverage-olfaction'])]
}

/** M3: 甘味が相手の後鼻腔香を際立たせる（Green et al. 2012） */
function sweetnessEnhancesRetronasalAroma(a: Side, b: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [sweetSide, aromaSide] of [[a, b], [b, a]] as const) {
    const aromas = known(aromaSide.profile)
    if (tasteRank(sweetSide.profile, 'sweet') >= 2 && aromas.length > 0) {
      const top = [...aromas].sort((x, y) => rank(y.intensity) - rank(x.intensity))[0]
      out.push(stmt('sweetness-enhances-retronasal-aroma', 'aroma',
        `${sweetSide.label}の甘味（${intLabel(sweetSide.profile.tastes.sweet.intensity)}）と一緒に味わうと、${aromaSide.label}の香りが口の中で強く感じられることがあります。甘味が後鼻腔の香りを際立たせる作用は、飲料やデザートでも確認されています。特に${aromaSide.label}の「${noteName(top.noteId)}」の香りが際立つ可能性があります。`,
        'general', ['green-2012-retronasal-enhancement']))
    }
  }
  return out
}

/** M4: 強い香りが穏やかな香りを覆う／香りは足し算にならない（Laing & Willcox 1983） */
function strongAromaCoversDelicate(a: Side, b: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [strongSide, otherSide] of [[a, b], [b, a]] as const) {
    const otherKnown = known(otherSide.profile)
    if (otherKnown.length === 0 || Math.max(...otherKnown.map((x) => rank(x.intensity))) > 2) continue
    const otherCats = new Set(otherKnown.map((x) => noteById(x.noteId)?.categoryId))
    const strong = known(strongSide.profile).find((x) => x.intensity === 'strong' && !otherCats.has(noteById(x.noteId)?.categoryId ?? ''))
    if (strong) {
      out.push(stmt('strong-aroma-covers-delicate', 'aroma',
        `${strongSide.label}の「${noteName(strong.noteId)}」の香り（強い）は際立っています。香りの混合では、少しの強さの差でも強い側が優位になり、全体は単純な足し算にはなりません。${otherSide.label}の「${noteName(otherKnown[0].noteId)}」のような穏やかな香りは、意識して味わわないと感じ取りにくくなる可能性があります。`,
        'exploratory', ['laing-1983-binary-odour-mixtures']))
    }
  }
  return out
}

/** M1/M3の調和の側面：共通する香りの重なり＋（あれば）推測の重なり */
function sharedAromaCongruency(a: Side, b: Side): InteractionStatement[] {
  const bIds = new Set(known(b.profile).map((x) => x.noteId))
  const shared = known(a.profile).filter((x) => bIds.has(x.noteId))
  if (shared.length === 0) return []
  const out: InteractionStatement[] = [stmt('shared-aroma-congruency', 'aroma',
    `両方に共通する「${noteName(shared[0].noteId)}」の香りは、別々に味わうときよりも一つのまとまった印象として感じられやすいと考えられます。調和した香りの重なりは、フレーバー全体を統一感のあるものとして知覚させる方向に働くことが知られています。`,
    'exploratory', ['green-2012-retronasal-enhancement', 'stevenson-1999-odor-taste'])]
  // 推測（inferences.ts）を使う場合は、推測であることを本文とフラグの両方で明示する
  for (const s of shared) {
    if (!VAGUE_NOTES.includes(s.noteId)) continue
    const infs = [a, b].map((side) => inferencesFor(side.type, side.itemId, s.noteId))
    if (infs.every((list) => list.length === 0)) continue
    const parts: string[] = []
    for (let i = 0; i < 2; i++) if (infs[i].length > 0) parts.push(`${[a, b][i].label}では${infs[i].map((x) => x.label).join('・')}`)
    const sourceIds = [...new Set(infs.flat().flatMap((x) => x.basisCompoundIds.flatMap((cid) => compoundById(cid)?.sourceIds ?? [])))]
    out.push(stmt('shared-aroma-inference-overlap', 'aroma',
      `共通する「${noteName(s.noteId)}」の香りについては、具体的な花・果物への類似が成分から推測されています（推測・未検証：${parts.join('、')}への類似の可能性）。この推測の範囲では、${noteName(s.noteId)}の印象がより具体的に感じられる可能性があります。ただしこれは推測であり、その花・果物であることが実測で確認されたものではありません。`,
      'exploratory', sourceIds, true))
  }
  return out
}

/** M5: 甘味×苦味の混合抑制（Keast & Breslin 2003） */
function sweetnessSuppressesBitterness(a: Side, b: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [sweetSide, bitterSide] of [[a, b], [b, a]] as const) {
    if (tasteRank(sweetSide.profile, 'sweet') >= 2 && tasteRank(bitterSide.profile, 'bitter') >= 2) {
      out.push(stmt('sweetness-suppresses-bitterness', 'taste',
        `${sweetSide.label}の甘味（${intLabel(sweetSide.profile.tastes.sweet.intensity)}）と${bitterSide.label}の苦味（${intLabel(bitterSide.profile.tastes.bitter.intensity)}）が口の中で出会うと、甘味が苦味を抑える混合抑制が働き、苦味が単独のときより和らいで感じられる可能性があります。`,
        'general', ['keast-2003-binary-taste-interactions']))
    }
  }
  return out
}

/** M5: 甘味×酸味の混合抑制（Keast & Breslin 2003） */
function sweetnessSuppressesSourness(a: Side, b: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [sweetSide, sourSide] of [[a, b], [b, a]] as const) {
    if (tasteRank(sweetSide.profile, 'sweet') >= 2 && tasteRank(sourSide.profile, 'sour') >= 2) {
      out.push(stmt('sweetness-suppresses-sourness', 'taste',
        `${sweetSide.label}の甘味（${intLabel(sweetSide.profile.tastes.sweet.intensity)}）は、${sourSide.label}の酸味（${intLabel(sourSide.profile.tastes.sour.intensity)}）を抑える方向に働くことが知られており、一緒に味わうと酸味が穏やかに感じられる可能性があります。`,
        'general', ['keast-2003-binary-taste-interactions']))
    }
  }
  return out
}

/** M5: 酸味が苦味を強める方向（Keast & Breslin 2003、方向のばらつきを明記） */
function sournessEnhancesBitterness(a: Side, b: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [sourSide, bitterSide] of [[a, b], [b, a]] as const) {
    if (tasteRank(sourSide.profile, 'sour') >= 2 && tasteRank(bitterSide.profile, 'bitter') >= 2) {
      out.push(stmt('sourness-enhances-bitterness', 'taste',
        `${sourSide.label}の酸味（${intLabel(sourSide.profile.tastes.sour.intensity)}）は、${bitterSide.label}の苦味（${intLabel(bitterSide.profile.tastes.bitter.intensity)}）を強める方向に働くことがあり、苦味がより際立って感じられる可能性があります。ただし酸と苦味の相互作用は濃度や成分によって変わり、逆方向の報告もあります。`,
        'exploratory', ['keast-2003-binary-taste-interactions']))
    }
  }
  return out
}

/** M6: 甘味が渋味を和らげる（Lyman & Green 1990） */
function sweetnessSoftensAstringency(a: Side, b: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [sweetSide, astSide] of [[a, b], [b, a]] as const) {
    if (tasteRank(sweetSide.profile, 'sweet') >= 2 && tasteRank(astSide.profile, 'astringent') >= 2) {
      out.push(stmt('sweetness-softens-astringency', 'taste',
        `${sweetSide.label}の甘味（${intLabel(sweetSide.profile.tastes.sweet.intensity)}）は、${astSide.label}の渋味（${intLabel(astSide.profile.tastes.astringent.intensity)}）を和らげることが、タンニン溶液の実験で示されています。一緒に味わうと、渋味の乾いた感じが穏やかになる可能性があります。`,
        'general', ['lyman-1990-astringency-sweeteners']))
    }
  }
  return out
}

/** M10: うま味と香りの相互作用（Niimi et al. 2014、適用は類推） */
function umamiAromaInteraction(a: Side, b: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [umamiSide, aromaSide] of [[a, b], [b, a]] as const) {
    if (tasteRank(umamiSide.profile, 'umami') < 2 || known(aromaSide.profile).length === 0) continue
    out.push(stmt('umami-aroma-interaction', 'taste',
      `${umamiSide.label}のうま味（${intLabel(umamiSide.profile.tastes.umami.intensity)}）は、香りとの組み合わせで感じ方が変わることがモデル系で示されています（チーズの香気がうま味の知覚を強めた例があります）。${aromaSide.label}の香りと一緒に味わうと、うま味が引き立つ可能性がありますが、${a.label}と${b.label}の組み合わせでの直接の検証はありません。`,
      'exploratory', ['niimi-2014-cheese-aroma-tastes']))
  }
  return out
}

/** M7: 渋味と脂肪の対向性・渋味の積み上がりの緩和（Peyrot des Gachons et al. 2012）。
 *  実験は「渋味のある飲み物と脂肪の多い食品の交互摂取」であり、適用には
 *  お茶側（渋味）とチョコレート側（脂肪）の組み合わせが必要。同種同士では発火しない。 */
function fatOpposesAstringency(a: Side, b: Side): InteractionStatement[] {
  const teaSide = [a, b].find((s) => s.type === 'tea')
  const chocoSide = [a, b].find((s) => s.type === 'chocolate')
  if (!teaSide || !chocoSide) return []
  if (tasteRank(teaSide.profile, 'astringent') < 2) return []
  return [stmt('fat-opposes-astringency', 'mouthfeel',
    `お茶の渋味（${intLabel(teaSide.profile.tastes.astringent.intensity)}）とチョコレートの脂肪分は、口の中の潤滑をめぐって互いを和らげ合う関係にあることが実験で示されています（渋味のある飲み物と脂肪の多い食品を交互に摂る実験で、両方の感覚が下がりました）。お茶だけを繰り返し飲むと渋味は積み上がっていきますが、間にチョコレートを挟むと、その積み上がりが抑えられ、チョコレートの脂っぽさも切り替わる可能性があります。`,
    'general', ['peyrot-2012-astringent-fat-opponency', 'lyman-1990-astringency-sweeteners', 'ross-2007-wine-astringency-buildup'])]
}

/** M8: 脂肪のコーティングが後のお茶の香りの広がり・持続を変える（Buettner 2005／Carvalho 2013）。
 *  「チョコレートを食べた後にお茶を飲む」という順序の現象であり、
 *  お茶側とチョコレート側が揃う場合にのみ発火する。 */
function fatCoatingAromaPersistence(a: Side, b: Side): InteractionStatement[] {
  const teaSide = [a, b].find((s) => s.type === 'tea')
  const chocoSide = [a, b].find((s) => s.type === 'chocolate')
  if (!teaSide || !chocoSide) return []
  if (known(teaSide.profile).length === 0) return []
  return [stmt('fat-coating-aroma-persistence', 'mouthfeel',
    `チョコレートを食べた後は、脂肪の膜が口の中に残ります。その後に飲むお茶の香りは、この膜の影響で、広がり方や持続が単独で飲むときと変わる可能性があります（脂肪は香りの放出と、鼻の奥での香りの持続に影響することが知られています）。`,
    'exploratory', ['buettner-2005-retronasal-persistence', 'carvalho-2013-milk-chocolate-coating'])]
}

/** M11: 乳タンパク質がお茶の渋味を和らげる（Piyasena 2025／Qie et al. 2021。ラインA候補 N10）。
 *  出典は牛乳入り紅茶の系であり、適用にはお茶側（渋味）と乳チョコ側が必要。
 *  チョコ同士への読み替え（カカオフラバノールへの結合）は二重の類推になるため、同種同士では発火しない。 */
function milkProteinSoftensAstringency(a: Side, b: Side): InteractionStatement[] {
  const milkSide = [a, b].find((s) => s.type === 'chocolate' && (s.chocoKind === 'milk' || s.chocoKind === 'white'))
  const teaSide = [a, b].find((s) => s.type === 'tea')
  if (!milkSide || !teaSide) return []
  if (tasteRank(teaSide.profile, 'astringent') < 2) return []
  return [stmt('milk-protein-softens-astringency', 'taste',
    `チョコレートに含まれる乳成分のタンパク質（カゼイン）は、お茶のカテキンと結合することが知られています。お茶の渋味（${intLabel(teaSide.profile.tastes.astringent.intensity)}）のもとになる成分が乳タンパク質に結びつくことで、渋味が和らいで感じられる可能性があります。牛乳入り紅茶の系で整理された機構であり、固形のチョコレートでの直接の実測ではありません。`,
    'general', ['piyasena-2025-milk-in-tea', 'qie-2021-milk-tea-catechin-protein'])]
}

/** M12: お茶のポリフェノールが香りの口内放出を増減させる可能性（Esteban-Fernández et al. 2018、ワインからの類推。ラインA候補 N7）。
 *  ポリフェノール側はお茶に限る（出典のフェノール系は飲料側のもの）。
 *  香り側はどちらの種別でもよい。 */
function teaPolyphenolsModulateAromaRelease(a: Side, b: Side): InteractionStatement[] {
  const polySide = [a, b].find((s) => s.type === 'tea' && tasteRank(s.profile, 'astringent') >= 2)
  if (!polySide) return []
  const aromaSide = polySide === a ? b : a
  if (known(aromaSide.profile).length === 0) return []
  return [stmt('tea-polyphenols-modulate-aroma-release', 'aroma',
    `${polySide.label}のポリフェノール類は、口の中での香りの放出の仕方を変える可能性があります。ワインの研究では、フェノール化合物が共存する香りの口内放出を、成分の化学構造によって増やしたり減らしたりすることが示されています。${polySide.label}の渋味（${intLabel(polySide.profile.tastes.astringent.intensity)}）のもとになるポリフェノールが、${aromaSide.label}の香りの広がり方を単独のときと変える可能性がありますが、方向は成分ごとに異なり、お茶での実測はありません。`,
    'exploratory', ['esteban-fernandez-2018-wine-matrix-aroma-release'])]
}

/** M13: お茶が冷めると複合体が析出し、渋味成分が減る方向に働く（Jöbstl et al. 2005／Ishizu et al. 2016。ラインA候補 N8）。
 *  お茶そのものの現象であり、お茶側が1つでもあれば（相手の種別を問わず）発火する。 */
function teaCreamingOnCooling(a: Side, b: Side): InteractionStatement[] {
  const teaSide = [a, b].find((s) => s.type === 'tea' && tasteRank(s.profile, 'astringent') >= 2)
  if (!teaSide) return []
  return [stmt('tea-creaming-on-cooling', 'mouthfeel',
    `お茶が冷めると、テアフラビンやガロイル型カテキンとカフェインの複合体が析出して白く濁る現象（クリーミングダウン）が起き、渋味（${intLabel(teaSide.profile.tastes.astringent.intensity)}）のもとになる成分そのものが液中から減る方向に働くことが示されています。冷まして味わう場合は、温かいときと渋味の感じ方が変わる可能性があります。`,
    'general', ['jobstl-2005-black-tea-creaming', 'ishizu-2016-creaming-down'])]
}

/** M14: 直接研究が示す設計原則（Donadini, Fumi & Lambri 2012／Donadini & Fumi 2014。ラインA候補 N11）。
 *  お茶とチョコレートの組み合わせそのものを評価した研究であり、
 *  お茶×チョコのペアでのみ発火する。同種同士では発火しない。 */
function directStudyBalancePrinciple(a: Side, b: Side): InteractionStatement[] {
  const hasTea = [a, b].some((s) => s.type === 'tea')
  const hasChoco = [a, b].some((s) => s.type === 'chocolate')
  if (!hasTea || !hasChoco) return []
  if (known(a.profile).length === 0 || known(b.profile).length === 0) return []
  return [stmt('direct-study-balance-principle', 'aroma',
    `お茶とチョコレートの組み合わせそのものを評価した研究では、風味の均衡したペアが好まれ、どちらか一方が支配すると受容が下がり、とくにチョコレートが支配した場合の下がり方が大きいことが示されています。どちらの印象も感じ取れる釣り合いで味わうことが、この組み合わせでは大切だと考えられます。ただし対象は市販品レベルのお茶とチョコレートであり、産地や品種別の結論ではありません。`,
    'general', ['donadini-2012-chocolate-beverage-pairing', 'donadini-2014-tea-coffee-chocolate'])]
}

/** M9: 温かさと甘味の感じ方（Talavera et al. 2005、一般原理）。
 *  温かい飲み物（お茶側）が前提であり、甘味側は相手側。お茶×お茶では
 *  温かいお茶同士でも発火する。チョコ同士では温かい飲み物がないため発火しない。 */
function warmthAndSweetness(a: Side, b: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [warmSide, sweetSide] of [[a, b], [b, a]] as const) {
    if (warmSide.type !== 'tea') continue
    if (tasteRank(sweetSide.profile, 'sweet') < 2) continue
    out.push(stmt('warmth-and-sweetness', 'mouthfeel',
      `温かいお茶と一緒に味わうと、温度によって甘味の感じ方が変わる可能性があります。甘味の受容に関わるチャネル（TRPM5）は温度が高いほど応答が増すことが知られており、${sweetSide.label}の甘味（${intLabel(sweetSide.profile.tastes.sweet.intensity)}）がより感じられやすくなる場合があります。これは一般原理からの説明で、この組み合わせの実測ではありません。`,
      'exploratory', ['talavera-2005-trpm5-temperature']))
  }
  return out
}

/** 組み合わせの相互作用を、文献ルールに基づいて文章化する。
 *  ルールが発火しない観点については空配列を返し、画面側で「特記なし」と正直に表示する。 */
export function analyzeInteractionsForSides(a: InteractionSide, b: InteractionSide): InteractionAnalysis {
  return {
    aroma: [
      ...sweetAromaEnhancesSweetness(a, b),
      ...cacaoAromaEnhancesBitterness(a, b),
      ...sweetnessEnhancesRetronasalAroma(a, b),
      ...strongAromaCoversDelicate(a, b),
      ...sharedAromaCongruency(a, b),
      ...teaPolyphenolsModulateAromaRelease(a, b),
      ...directStudyBalancePrinciple(a, b),
    ],
    taste: [
      ...sweetnessSuppressesBitterness(a, b),
      ...sweetnessSuppressesSourness(a, b),
      ...sournessEnhancesBitterness(a, b),
      ...sweetnessSoftensAstringency(a, b),
      ...umamiAromaInteraction(a, b),
      ...milkProteinSoftensAstringency(a, b),
    ],
    mouthfeel: [
      ...fatOpposesAstringency(a, b),
      ...fatCoatingAromaPersistence(a, b),
      ...warmthAndSweetness(a, b),
      ...teaCreamingOnCooling(a, b),
    ],
  }
}

/** 従来の（お茶，チョコレート）呼び出し。異種ペアでは従来と同一の文面になる。 */
export function analyzeInteractions(teaItem: TeaItem, chocoItem: ChocolateItem): InteractionAnalysis {
  return analyzeInteractionsForSides(
    { type: 'tea', label: 'お茶', profile: teaItem.profile, itemId: teaItem.id },
    { type: 'chocolate', label: 'チョコレート', profile: chocoItem.profile, itemId: chocoItem.id, chocoKind: chocoItem.kind },
  )
}

export const hasAnyInteraction = (a: InteractionAnalysis) => a.aroma.length + a.taste.length + a.mouthfeel.length > 0
