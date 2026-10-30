import type { ChocolateItem, FlavorProfile, InteractionAnalysis, InteractionStatement, Intensity, TeaItem } from '../types'
import { noteById } from '../data/flavors'
import { inferencesFor } from '../data/inferences'
import { compoundById } from '../data/compounds'
import { TASTE_LABELS } from './pairing'

// 組み合わせの相互作用ルールベース（docs/research/pairing-interactions.md）。
// 成分の合算や相性スコアは出さない。文献で裏付けられた知覚レベルの相互作用だけを、
// 2つのプロファイルの実データ（香味ノート・味覚）に条件付けして文章化する。
// 各文には根拠区分（general=一般的な知見 / exploratory=探索的な予想）と出典を必須とする。
// 言及する香味・味覚は、発火条件として確認した実データの範囲に限る（テストで自動検査）。

const rank = (i: Intensity) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)
const intLabel = (i: Intensity) => (i === 'strong' ? '強い' : i === 'normal' ? '普通' : i === 'weak' ? '弱い' : '不明')
const known = (p: FlavorProfile) => p.aromas.filter((a) => rank(a.intensity) >= 2)
const noteName = (id: string) => noteById(id)?.name ?? id
const tasteRank = (p: FlavorProfile, k: keyof typeof TASTE_LABELS) => rank(p.tastes[k].intensity)

const SWEET_AROMA_NOTES = ['caramel', 'honey', 'vanilla', 'brown-sugar']
const VAGUE_NOTES = ['floral-general', 'tropical', 'fruit-general']

interface Side {
  label: string
  profile: FlavorProfile
}

function stmt(ruleId: string, kind: InteractionStatement['kind'], text: string, level: InteractionStatement['level'], sourceIds: string[], usesInference = false): InteractionStatement {
  return { ruleId, kind, text, level, sourceIds, usesInference }
}

/** M1: 甘い香りが、他方の甘味を際立たせる（Stevenson 1999／Labbe 2006） */
function sweetAromaEnhancesSweetness(tea: Side, choco: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [aromaSide, tasteSide] of [[tea, choco], [choco, tea]] as const) {
    const sweetAroma = known(aromaSide.profile).find((a) => SWEET_AROMA_NOTES.includes(a.noteId))
    if (sweetAroma && tasteRank(tasteSide.profile, 'sweet') >= 2) {
      out.push(stmt('sweet-aroma-enhances-sweetness', 'aroma',
        `${aromaSide.label}の「${noteName(sweetAroma.noteId)}」のような甘い香りは、甘味と調和して甘さを際立たせることが知られています。${tasteSide.label}の甘味（${intLabel(tasteSide.profile.tastes.sweet.intensity)}）と一緒に味わうと、全体に甘く感じられる可能性があります。`,
        'general', ['stevenson-1999-odor-taste', 'labbe-2006-cocoa-beverage-olfaction']))
    }
  }
  return out
}

/** M2: カカオの香りが苦味を強める方向（Labbe 2006、ココア飲料での実証を類推） */
function cacaoAromaEnhancesBitterness(tea: Side, choco: Side): InteractionStatement[] {
  const hasCacao = known(choco.profile).some((a) => a.noteId === 'cacao')
  const bitterSide = tasteRank(tea.profile, 'bitter') >= 2 ? tea : tasteRank(choco.profile, 'bitter') >= 2 ? choco : null
  if (!hasCacao || !bitterSide) return []
  return [stmt('cacao-aroma-enhances-bitterness', 'aroma',
    `チョコレートの「カカオ」の香りは、調和する苦味の知覚を強める方向に働くことが、ココア飲料の実験で示されています。この組み合わせでも、${bitterSide.label}の苦味（${intLabel(bitterSide.profile.tastes.bitter.intensity)}）が、単独で味わうときより前面に出て感じられる可能性があります。`,
    'exploratory', ['labbe-2006-cocoa-beverage-olfaction'])]
}

/** M3: 甘味が相手の後鼻腔香を際立たせる（Green et al. 2012） */
function sweetnessEnhancesRetronasalAroma(tea: Side, choco: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [sweetSide, aromaSide] of [[tea, choco], [choco, tea]] as const) {
    const aromas = known(aromaSide.profile)
    if (tasteRank(sweetSide.profile, 'sweet') >= 2 && aromas.length > 0) {
      const top = [...aromas].sort((a, b) => rank(b.intensity) - rank(a.intensity))[0]
      out.push(stmt('sweetness-enhances-retronasal-aroma', 'aroma',
        `${sweetSide.label}の甘味（${intLabel(sweetSide.profile.tastes.sweet.intensity)}）と一緒に味わうと、${aromaSide.label}の香りが口の中で強く感じられることがあります。甘味が後鼻腔の香りを際立たせる作用は、飲料やデザートでも確認されています。特に${aromaSide.label}の「${noteName(top.noteId)}」の香りが際立つ可能性があります。`,
        'general', ['green-2012-retronasal-enhancement']))
    }
  }
  return out
}

/** M4: 強い香りが穏やかな香りを覆う／香りは足し算にならない（Laing & Willcox 1983） */
function strongAromaCoversDelicate(tea: Side, choco: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [strongSide, otherSide] of [[tea, choco], [choco, tea]] as const) {
    const otherKnown = known(otherSide.profile)
    if (otherKnown.length === 0 || Math.max(...otherKnown.map((a) => rank(a.intensity))) > 2) continue
    const otherCats = new Set(otherKnown.map((a) => noteById(a.noteId)?.categoryId))
    const strong = known(strongSide.profile).find((a) => a.intensity === 'strong' && !otherCats.has(noteById(a.noteId)?.categoryId ?? ''))
    if (strong) {
      out.push(stmt('strong-aroma-covers-delicate', 'aroma',
        `${strongSide.label}の「${noteName(strong.noteId)}」の香り（強い）は際立っています。香りの混合では、少しの強さの差でも強い側が優位になり、全体は単純な足し算にはなりません。${otherSide.label}の「${noteName(otherKnown[0].noteId)}」のような穏やかな香りは、意識して味わわないと感じ取りにくくなる可能性があります。`,
        'exploratory', ['laing-1983-binary-odour-mixtures']))
    }
  }
  return out
}

/** M1/M3の調和の側面：共通する香りの重なり＋（あれば）推測の重なり */
function sharedAromaCongruency(teaItem: TeaItem, chocoItem: ChocolateItem): InteractionStatement[] {
  const tea = { label: 'お茶', profile: teaItem.profile }
  const choco = { label: 'チョコレート', profile: chocoItem.profile }
  const chocoIds = new Set(known(choco.profile).map((a) => a.noteId))
  const shared = known(tea.profile).filter((a) => chocoIds.has(a.noteId))
  if (shared.length === 0) return []
  const out: InteractionStatement[] = [stmt('shared-aroma-congruency', 'aroma',
    `両方に共通する「${noteName(shared[0].noteId)}」の香りは、別々に味わうときよりも一つのまとまった印象として感じられやすいと考えられます。調和した香りの重なりは、フレーバー全体を統一感のあるものとして知覚させる方向に働くことが知られています。`,
    'exploratory', ['green-2012-retronasal-enhancement', 'stevenson-1999-odor-taste'])]
  // 推測（inferences.ts）を使う場合は、推測であることを本文とフラグの両方で明示する
  for (const s of shared) {
    if (!VAGUE_NOTES.includes(s.noteId)) continue
    const teaInf = inferencesFor('tea', teaItem.id, s.noteId)
    const chocoInf = inferencesFor('chocolate', chocoItem.id, s.noteId)
    if (teaInf.length === 0 && chocoInf.length === 0) continue
    const parts: string[] = []
    if (teaInf.length > 0) parts.push(`お茶では${teaInf.map((i) => i.label).join('・')}`)
    if (chocoInf.length > 0) parts.push(`チョコレートでは${chocoInf.map((i) => i.label).join('・')}`)
    const sourceIds = [...new Set([...teaInf, ...chocoInf].flatMap((i) => i.basisCompoundIds.flatMap((cid) => compoundById(cid)?.sourceIds ?? [])))]
    out.push(stmt('shared-aroma-inference-overlap', 'aroma',
      `共通する「${noteName(s.noteId)}」の香りについては、具体的な花・果物への類似が成分から推測されています（推測・未検証：${parts.join('、')}への類似の可能性）。この推測の範囲では、${noteName(s.noteId)}の印象がより具体的に感じられる可能性があります。ただしこれは推測であり、その花・果物であることが実測で確認されたものではありません。`,
      'exploratory', sourceIds, true))
  }
  return out
}

/** M5: 甘味×苦味の混合抑制（Keast & Breslin 2003） */
function sweetnessSuppressesBitterness(tea: Side, choco: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [sweetSide, bitterSide] of [[tea, choco], [choco, tea]] as const) {
    if (tasteRank(sweetSide.profile, 'sweet') >= 2 && tasteRank(bitterSide.profile, 'bitter') >= 2) {
      out.push(stmt('sweetness-suppresses-bitterness', 'taste',
        `${sweetSide.label}の甘味（${intLabel(sweetSide.profile.tastes.sweet.intensity)}）と${bitterSide.label}の苦味（${intLabel(bitterSide.profile.tastes.bitter.intensity)}）が口の中で出会うと、甘味が苦味を抑える混合抑制が働き、苦味が単独のときより和らいで感じられる可能性があります。`,
        'general', ['keast-2003-binary-taste-interactions']))
    }
  }
  return out
}

/** M5: 甘味×酸味の混合抑制（Keast & Breslin 2003） */
function sweetnessSuppressesSourness(tea: Side, choco: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [sweetSide, sourSide] of [[tea, choco], [choco, tea]] as const) {
    if (tasteRank(sweetSide.profile, 'sweet') >= 2 && tasteRank(sourSide.profile, 'sour') >= 2) {
      out.push(stmt('sweetness-suppresses-sourness', 'taste',
        `${sweetSide.label}の甘味（${intLabel(sweetSide.profile.tastes.sweet.intensity)}）は、${sourSide.label}の酸味（${intLabel(sourSide.profile.tastes.sour.intensity)}）を抑える方向に働くことが知られており、一緒に味わうと酸味が穏やかに感じられる可能性があります。`,
        'general', ['keast-2003-binary-taste-interactions']))
    }
  }
  return out
}

/** M5: 酸味が苦味を強める方向（Keast & Breslin 2003、方向のばらつきを明記） */
function sournessEnhancesBitterness(tea: Side, choco: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [sourSide, bitterSide] of [[tea, choco], [choco, tea]] as const) {
    if (tasteRank(sourSide.profile, 'sour') >= 2 && tasteRank(bitterSide.profile, 'bitter') >= 2) {
      out.push(stmt('sourness-enhances-bitterness', 'taste',
        `${sourSide.label}の酸味（${intLabel(sourSide.profile.tastes.sour.intensity)}）は、${bitterSide.label}の苦味（${intLabel(bitterSide.profile.tastes.bitter.intensity)}）を強める方向に働くことがあり、苦味がより際立って感じられる可能性があります。ただし酸と苦味の相互作用は濃度や成分によって変わり、逆方向の報告もあります。`,
        'exploratory', ['keast-2003-binary-taste-interactions']))
    }
  }
  return out
}

/** M6: 甘味が渋味を和らげる（Lyman & Green 1990） */
function sweetnessSoftensAstringency(tea: Side, choco: Side): InteractionStatement[] {
  const out: InteractionStatement[] = []
  for (const [sweetSide, astSide] of [[tea, choco], [choco, tea]] as const) {
    if (tasteRank(sweetSide.profile, 'sweet') >= 2 && tasteRank(astSide.profile, 'astringent') >= 2) {
      out.push(stmt('sweetness-softens-astringency', 'taste',
        `${sweetSide.label}の甘味（${intLabel(sweetSide.profile.tastes.sweet.intensity)}）は、${astSide.label}の渋味（${intLabel(astSide.profile.tastes.astringent.intensity)}）を和らげることが、タンニン溶液の実験で示されています。一緒に味わうと、渋味の乾いた感じが穏やかになる可能性があります。`,
        'general', ['lyman-1990-astringency-sweeteners']))
    }
  }
  return out
}

/** M10: うま味と香りの相互作用（Niimi et al. 2014、適用は類推） */
function umamiAromaInteraction(tea: Side, choco: Side): InteractionStatement[] {
  if (tasteRank(tea.profile, 'umami') < 2 || known(choco.profile).length === 0) return []
  return [stmt('umami-aroma-interaction', 'taste',
    `お茶のうま味（${intLabel(tea.profile.tastes.umami.intensity)}）は、香りとの組み合わせで感じ方が変わることがモデル系で示されています（チーズの香気がうま味の知覚を強めた例があります）。チョコレートの香りと一緒に味わうと、うま味が引き立つ可能性がありますが、お茶とチョコレートの組み合わせでの直接の検証はありません。`,
    'exploratory', ['niimi-2014-cheese-aroma-tastes'])]
}

/** M7: 渋味と脂肪の対向性・渋味の積み上がりの緩和（Peyrot des Gachons et al. 2012） */
function fatOpposesAstringency(tea: Side, choco: Side): InteractionStatement[] {
  void choco
  if (tasteRank(tea.profile, 'astringent') < 2) return []
  return [stmt('fat-opposes-astringency', 'mouthfeel',
    `お茶の渋味（${intLabel(tea.profile.tastes.astringent.intensity)}）とチョコレートの脂肪分は、口の中の潤滑をめぐって互いを和らげ合う関係にあることが実験で示されています（渋味のある飲み物と脂肪の多い食品を交互に摂る実験で、両方の感覚が下がりました）。お茶だけを繰り返し飲むと渋味は積み上がっていきますが、間にチョコレートを挟むと、その積み上がりが抑えられ、チョコレートの脂っぽさも切り替わる可能性があります。`,
    'general', ['peyrot-2012-astringent-fat-opponency', 'lyman-1990-astringency-sweeteners', 'ross-2007-wine-astringency-buildup'])]
}

/** M8: 脂肪のコーティングが後のお茶の香りの広がり・持続を変える（Buettner 2005／Carvalho 2013） */
function fatCoatingAromaPersistence(tea: Side, choco: Side): InteractionStatement[] {
  void choco
  if (known(tea.profile).length === 0) return []
  return [stmt('fat-coating-aroma-persistence', 'mouthfeel',
    `チョコレートを食べた後は、脂肪の膜が口の中に残ります。その後に飲むお茶の香りは、この膜の影響で、広がり方や持続が単独で飲むときと変わる可能性があります（脂肪は香りの放出と、鼻の奥での香りの持続に影響することが知られています）。`,
    'exploratory', ['buettner-2005-retronasal-persistence', 'carvalho-2013-milk-chocolate-coating'])]
}

/** M9: 温かさと甘味の感じ方（Talavera et al. 2005、一般原理） */
function warmthAndSweetness(tea: Side, choco: Side): InteractionStatement[] {
  void tea
  if (tasteRank(choco.profile, 'sweet') < 2) return []
  return [stmt('warmth-and-sweetness', 'mouthfeel',
    `温かいお茶と一緒に味わうと、温度によって甘味の感じ方が変わる可能性があります。甘味の受容に関わるチャネル（TRPM5）は温度が高いほど応答が増すことが知られており、チョコレートの甘味（${intLabel(choco.profile.tastes.sweet.intensity)}）がより感じられやすくなる場合があります。これは一般原理からの説明で、この組み合わせの実測ではありません。`,
    'exploratory', ['talavera-2005-trpm5-temperature'])]
}

/** 組み合わせの相互作用を、文献ルールに基づいて文章化する。
 *  ルールが発火しない観点については空配列を返し、画面側で「特記なし」と正直に表示する。 */
export function analyzeInteractions(teaItem: TeaItem, chocoItem: ChocolateItem): InteractionAnalysis {
  const tea: Side = { label: 'お茶', profile: teaItem.profile }
  const choco: Side = { label: 'チョコレート', profile: chocoItem.profile }
  return {
    aroma: [
      ...sweetAromaEnhancesSweetness(tea, choco),
      ...cacaoAromaEnhancesBitterness(tea, choco),
      ...sweetnessEnhancesRetronasalAroma(tea, choco),
      ...strongAromaCoversDelicate(tea, choco),
      ...sharedAromaCongruency(teaItem, chocoItem),
    ],
    taste: [
      ...sweetnessSuppressesBitterness(tea, choco),
      ...sweetnessSuppressesSourness(tea, choco),
      ...sournessEnhancesBitterness(tea, choco),
      ...sweetnessSoftensAstringency(tea, choco),
      ...umamiAromaInteraction(tea, choco),
    ],
    mouthfeel: [
      ...fatOpposesAstringency(tea, choco),
      ...fatCoatingAromaPersistence(tea, choco),
      ...warmthAndSweetness(tea, choco),
    ],
  }
}

export const hasAnyInteraction = (a: InteractionAnalysis) => a.aroma.length + a.taste.length + a.mouthfeel.length > 0
