import type { CacaoOrigin, DataLevelUsed, EntityFinding, TeaCultivar, TeaRegion } from '../types'
import { FLAVOR_FINDING_KINDS } from '../types'
import { cultivarTeaUses, teaCultivars } from '../data/cultivars'
import { teaKinds } from '../data/teas'

// ペアリングで品種・系統が指定されたとき、「どの階層のデータに基づく参考情報か」を
// 判定する（設計: docs/design/cultivar-data-model.md §9）。
// ここでは相性や強度を一切計算しない。品種・系統の所見は「参考として併記」するだけで、
// 組み合わせの見方そのものは従来どおり茶類・種類レベルのプロファイルで作る。
export const DATA_LEVEL_LABEL: Record<DataLevelUsed, string> = {
  'cultivar-measured': '品種・系統の実測に基づく参考情報',
  'cultivar-general': '品種固有の一般的傾向に基づく参考情報',
  'origin-measured': '産地の実測に基づく参考情報',
  'group-general': '分類・集団レベルの特徴に基づく参考情報',
  'kind-general': '茶類・種類レベルの特徴による参考情報',
  'insufficient': '使えるデータがないため不使用',
}

export interface PairingContextNote {
  level: DataLevelUsed
  text: string
  findings: EntityFinding[]
  sourceIds: string[]
}

const kindName = (kindId: string) => teaKinds.find((k) => k.id === kindId)?.name ?? kindId
const flavorFindings = (findings: EntityFinding[]) => findings.filter((f) => FLAVOR_FINDING_KINDS.includes(f.kind))

/** お茶側: 品種が指定された場合の階層判定。未指定なら null（従来表示のまま）。 */
export function teaCultivarPairingNote(cultivar: TeaCultivar, kindId: string): PairingContextNote {
  const use = cultivarTeaUses.find((u) => u.cultivarId === cultivar.id && u.kindId === kindId)
  const findings = flavorFindings(cultivar.findings)
  const kn = kindName(kindId)
  if (use?.status === 'studied' && findings.length > 0) {
    return {
      level: 'cultivar-measured',
      text: `${cultivar.name}を${kn}に加工した研究で確認された所見があります。組み合わせの見方そのものは${kn}レベルの特徴で作り、品種の所見は下記の範囲で参考として併記します。条件付きの所見は条件を落とさずに示します。`,
      findings,
      sourceIds: [...new Set(findings.flatMap((f) => f.sourceIds))],
    }
  }
  if (use && findings.length > 0) {
    return {
      level: 'cultivar-general',
      text: `${cultivar.name}には品種固有の科学データがありますが、${kn}での実測として確認できる範囲は限られます（条件付きの知見を含みます）。組み合わせの見方は${kn}レベルの特徴で作り、品種の所見は一般的な傾向として参考に併記します。`,
      findings,
      sourceIds: [...new Set(findings.flatMap((f) => f.sourceIds))],
    }
  }
  if (use) {
    return {
      level: 'kind-general',
      text: `${cultivar.name}を${kn}に加工することは確認されていますが、品種固有の香味データは未確認です。そのため組み合わせの見方は${kn}レベルの特徴だけで作っています。品種固有の相性があるかのような表示はしません。`,
      findings: [],
      sourceIds: [],
    }
  }
  return {
    level: 'kind-general',
    text: `${cultivar.name}を${kn}に加工したことは、公的資料・研究では未確認です（実在しない組み合わせを実測済みとは扱いません）。組み合わせの見方は${kn}レベルの特徴だけで作っています。`,
    findings: [],
    sourceIds: [],
  }
}

export type CacaoLayer = 'traditional' | 'genetic' | 'clone'
export const CACAO_LAYER_LABEL: Record<CacaoLayer, string> = {
  traditional: '伝統的分類',
  genetic: '遺伝集団（Motamayor et al. 2008）',
  clone: '個別クローン',
}

interface CacaoEntityLike {
  name: string
  findings: EntityFinding[]
}

/** カカオ側: 系統が指定された場合の階層判定。未指定なら呼び出し側で表示しない。 */
export function cacaoPairingNote(layer: CacaoLayer, entity: CacaoEntityLike): PairingContextNote {
  const findings = flavorFindings(entity.findings)
  if (findings.length > 0) {
    return {
      level: layer === 'clone' ? 'cultivar-measured' : 'group-general',
      text: layer === 'clone'
        ? `${entity.name}（個別クローン）については実測の所見があります。ただし個別のチョコレートの味は発酵・焙煎・配合でも変わるため、組み合わせの見方はチョコレートの種類レベルの特徴で作り、クローンの所見は参考として併記します。`
        : `${entity.name}（${CACAO_LAYER_LABEL[layer]}）としての実測・整理があります。ただしこれは分類・集団レベルの知見で、個別のチョコレートの味を決めるものではありません。組み合わせの見方はチョコレートの種類レベルの特徴で作り、所見は参考として併記します。`,
      findings,
      sourceIds: [...new Set(findings.flatMap((f) => f.sourceIds))],
    }
  }
  return {
    level: 'insufficient',
    text: `${entity.name}（${CACAO_LAYER_LABEL[layer]}）については、香味の科学データが未確認です。そのため系統の情報は組み合わせの見方に使っていません（チョコレートの種類レベルの特徴のみで見ています）。遺伝的分類だけから味を断定することはしません。`,
    findings: [],
    sourceIds: [],
  }
}

/** カカオ側: 産地が指定された場合の階層判定。産地は品種ではないため、
 * 産地レベルの香味実測がある場合に限り origin-measured とし、組成の実測のみ・
 * 集団レベルの知見しかない場合は group-general（一般的傾向）、所見がなければ
 * insufficient として、産地の情報は組み合わせの見方に使わない。 */
export function cacaoOriginPairingNote(origin: CacaoOrigin): PairingContextNote {
  const findings = flavorFindings(origin.findings)
  if (origin.flavorEvidence === 'measured' && findings.length > 0) {
    return {
      level: 'origin-measured',
      text: `${origin.name}産の試料については、香味の実測（官能・揮発性成分）があります。ただし実測が示すのは産地で一通りの味ではなく、発酵などの条件による変動を含む範囲です。組み合わせの見方はチョコレートの種類レベルの特徴で作り、産地の所見は参考として併記します。`,
      findings,
      sourceIds: [...new Set(findings.flatMap((f) => f.sourceIds))],
    }
  }
  if (origin.flavorEvidence === 'general' && findings.length > 0) {
    return {
      level: 'group-general',
      text: `${origin.name}については、組成の実測や、関連する遺伝集団レベルの知見はありますが、産地としての香味の官能実測は確認できていません。そのため所見は一般的な傾向として参考に併記するだけで、組み合わせの見方はチョコレートの種類レベルの特徴で作っています。産地名から味を断定することはしません。`,
      findings,
      sourceIds: [...new Set(findings.flatMap((f) => f.sourceIds))],
    }
  }
  return {
    level: 'insufficient',
    text: `${origin.name}については、香味の科学データが未確認です。そのため産地の情報は組み合わせの見方に使っていません（チョコレートの種類レベルの特徴のみで見ています）。産地名から味を推定する表示はしません。`,
    findings: [],
    sourceIds: [],
  }
}

/** お茶の産地（国）の選択肢。品種データに実在する国だけを、表示順つきで返す。 */
const TEA_ORIGIN_ORDER = ['日本', '中国', '台湾', 'インド', 'スリランカ']
export function teaOriginCountries(): string[] {
  const present = new Set(teaCultivars.map((c) => c.country))
  return TEA_ORIGIN_ORDER.filter((c) => present.has(c))
}

/** お茶側: 産地（国）が指定された場合の階層判定。カカオ産地と同型に扱う。
 * 産地そのものの香味実測は収録データに存在しないため、最上位でも品種レベルの
 * 知見を集めた「一般的な傾向（group-general）」までとし、所見がなければ
 * insufficient として、産地の情報は組み合わせの見方に使わない。 */
export function teaOriginPairingNote(country: string, kindId: string): PairingContextNote {
  const kn = kindName(kindId)
  const relevant = teaCultivars.filter((c) =>
    c.country === country && cultivarTeaUses.some((u) => u.cultivarId === c.id && u.kindId === kindId))
  const withFindings = relevant.filter((c) => flavorFindings(c.findings).length > 0)
  const findings = withFindings.flatMap((c) => flavorFindings(c.findings))
  if (findings.length > 0) {
    return {
      level: 'group-general',
      text: `${country}の品種のうち、${kn}への利用が確認されている品種（${withFindings.map((c) => c.name).join('、')}）には品種レベルの科学データがあります。ただしこれは産地そのものの香味実測ではなく品種レベルの知見です。そのため所見は一般的な傾向として参考に併記するだけで、組み合わせの見方は${kn}レベルの特徴で作っています。産地名から味を断定することはしません。`,
      findings,
      sourceIds: [...new Set(findings.flatMap((f) => f.sourceIds))],
    }
  }
  if (relevant.length > 0) {
    return {
      level: 'insufficient',
      text: `${country}の品種を${kn}に加工することは確認されていますが、香味の科学データは未確認です。そのため産地の情報は組み合わせの見方に使っていません（${kn}レベルの特徴のみで見ています）。産地名から味を推定する表示はしません。`,
      findings: [],
      sourceIds: [],
    }
  }
  return {
    level: 'insufficient',
    text: `${country}の品種を${kn}に加工したことは、公的資料・研究では未確認で、産地としての香味データもありません。そのため産地の情報は組み合わせの見方に使っていません（${kn}レベルの特徴のみで見ています）。産地名から味を推定する表示はしません。`,
    findings: [],
    sourceIds: [],
  }
}

/** お茶側: 産地（地域）が指定された場合の階層判定（2026-10-31 追加）。
 * 地域エンティティに、その分類に適用できる地域の実試料データがあれば
 * origin-measured（地域の所見を併記）。分類が適用範囲外なら、地域の所見は
 * その分類には使わず insufficient と正直に示す。 */
export function teaRegionPairingNote(region: TeaRegion, kindId: string): PairingContextNote {
  const kn = kindName(kindId)
  const k = teaKinds.find((x) => x.id === kindId)
  const category = !k || k.category === 'form' ? 'green' : k.category
  const findings = flavorFindings(region.findings)
  if (region.applicableKindIds.includes(category) && region.flavorEvidence === 'measured' && findings.length > 0) {
    return {
      level: 'origin-measured',
      text: `${region.name}（${region.country}）については、この茶類（${kn}）に関係する地域の実試料に基づくデータがあります。そのため地域の所見を参考として併記します。ただし実測が示すのは地域で一通りの味ではなく、組み合わせの見方自体は${kn}レベルの特徴で作っています。産地名から味を断定することはしません。`,
      findings,
      sourceIds: [...new Set(findings.flatMap((f) => f.sourceIds))],
    }
  }
  if (region.applicableKindIds.includes(category) && findings.length > 0) {
    return {
      level: 'group-general',
      text: `${region.name}（${region.country}）については、この茶類（${kn}）に関係する地域の所見がありますが、香味の実測とまでは言えないため、一般的な傾向として参考に併記するだけにし、組み合わせの見方は${kn}レベルの特徴で作っています。`,
      findings,
      sourceIds: [...new Set(findings.flatMap((f) => f.sourceIds))],
    }
  }
  return {
    level: 'insufficient',
    text: `${region.name}（${region.country}）の地域としての所見は主に${region.applicableKindIds.map((id) => kindName(id)).join('・')}についてのもので、${kn}での地域の実測は確認できていません。そのため産地（地域）の情報は組み合わせの見方に使っていません（${kn}レベルの特徴のみで見ています）。産地名から味を推定する表示はしません。`,
    findings: [],
    sourceIds: [],
  }
}
