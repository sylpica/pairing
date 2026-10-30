import type { CacaoOrigin } from '../types'

// カカオの産地エンティティ（2026-10-30 追加。調査: docs/research/cacao-origins.md）。
// 原則:
// - 産地は品種ではない。産地名を品種・系統として扱わない。
// - 産地と遺伝は多対多。産地名から香味プロファイルを自動生成しない（本エンティティは
//   FlavorProfile を持たず、出典つきの所見 findings までしか表示しない）。
// - 香味の根拠レベルは flavorEvidence で明示する:
//   'measured' = その産地の試料で官能・揮発性まで実測がある（層A）/
//   'general' = 組成の実測のみ、または遺伝集団レベルの知見（層A組成・層B）/
//   'none' = 香味の実測所見が未確認（層Cの業界説明は表示に使わない）。
// - 「ベネズエラ＝純粋クリオロ」「マダガスカル＝クリオロ」のような俗説は、反証を
//   所見として明示し、肯定形では登録しない。

export const cacaoOrigins: CacaoOrigin[] = [
  {
    id: 'venezuela',
    name: 'ベネズエラ',
    country: 'ベネズエラ',
    regions: [
      { name: 'チュアオ', note: '有名産地。ただしチュアオ由来とされるクローンは、遺伝的判定ではトリニタリオに分類されています（Lachenaud & Motamayor 2017）。' },
      { name: 'オクマレ', note: 'オクマレの OC 株は、遺伝的判定ではトリニタリオに分類されています。' },
      { name: 'ポルセラーナ', note: 'ポルセラーナの PV 株は、遺伝的判定ではトリニタリオに分類されています。ペルーのピウラ・ポルセラーナとは別の対象です。' },
    ],
    tradeNames: [],
    relatedTraditionalIds: ['trad-criollo', 'trad-trinitario'],
    relatedGeneticGroupIds: ['gen-criollo'],
    relatedCloneIds: [],
    flavorEvidence: 'general',
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'partial' },
    scienceNote: '遺伝と組成については実測がありますが、産地としての香味の官能実測は確認できていません。そのため香味の特徴（プロファイル）は表示せず、組成の所見を「一般的知見」としてのみ示します。',
    findings: [
      {
        kind: 'genetic',
        statement: 'ベネズエラの「モダンクリオロ」栽培集団は、クリオロとフォラステロという2つの祖先の混合（アドミクスチャー）であることが遺伝子解析で示されています。「ベネズエラ産＝純粋なクリオロ」という説明は、この実測と一致しません。',
        conditions: '栽培集団257個体を SSR 92マーカーで解析した原著（Marcano et al. 2009）。',
        sourceIds: ['marcano-2009-venezuela-admixture'],
      },
      {
        kind: 'classification',
        statement: 'チュアオ由来とされるクローン（Chuao 120、オクマレの OC 株、ポルセラーナの PV 株）は、遺伝的判定ではトリニタリオに分類されています。産地の名声と遺伝的分類は一致しない例です。',
        sourceIds: ['lachenaud-2017-criollo-review'],
      },
      {
        kind: 'composition',
        statement: '単一産地チョコレートの横断比較で、ベネズエラ産試料はナイアシン・鉄・カフェインが供試試料の中で最も高い水準でした。',
        conditions: '組成の実測であり、香味の特徴や優劣を示すものではありません（Parada et al. 2024、Panda et al. 2022）。',
        sourceIds: ['parada-2024-cacao-origins', 'panda-2022-cacao-composition'],
      },
    ],
    sourceIds: ['marcano-2009-venezuela-admixture', 'lachenaud-2017-criollo-review', 'parada-2024-cacao-origins', 'panda-2022-cacao-composition'],
    note: '産地名は品種名ではありません。ベネズエラ産のカカオは単一の遺伝的集団ではなく、地域と栽培集団によって構成が異なります。',
  },
  {
    id: 'ecuador',
    name: 'エクアドル',
    country: 'エクアドル',
    regions: [],
    tradeNames: [
      {
        name: 'アリバ（Arriba）',
        kind: 'commercial',
        note: 'エクアドル産カカオの商業・香味の呼称であり、遺伝集団の名前ではありません。歴史的に Nacional 系のカカオと結びつけて使われてきました。',
        linkedGeneticGroupId: 'gen-nacional',
      },
    ],
    relatedTraditionalIds: [],
    relatedGeneticGroupIds: ['gen-nacional'],
    relatedCloneIds: ['ccn-51'],
    flavorEvidence: 'general',
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'partial' },
    scienceNote: '香味に関する実測は、エクアドル産そのものではなく「現代 Nacional」という栽培集団のレベルで行われています。そのため産地固有の香味としては表示せず、集団レベルの一般的知見として示します。',
    findings: [
      {
        kind: 'sensory',
        statement: '現代 Nacional の集団品種に属する152遺伝子型を対象とした GWAS で、花のノートに関連する生合成経路が2つ同定されています（モノテルペン生合成経路と、L-フェニルアラニン分解経路）。',
        conditions: '特定の栽培集団内での変異の研究であり、「エクアドル産は常に花香が強い」という産地レベルの断定ではありません（Colonges et al. 2021）。',
        sourceIds: ['colonges-2021-nacional-floral'],
      },
      {
        kind: 'sensory',
        statement: '現代 Nacional 集団とエクアドル南部アマゾンのアクセッション集団を対象とした研究で、苦味と渋味の官能データについて20の関連領域が検出されています。',
        conditions: '集団内の遺伝子型間変異として検出されたもので、産地レベルの苦味・渋味の換算を支持するものではありません（Colonges et al. 2022）。',
        sourceIds: ['colonges-2022-nacional-bitterness'],
      },
    ],
    sourceIds: ['colonges-2021-nacional-floral', 'colonges-2022-nacional-bitterness'],
    note: '「アリバ」は産地の商業呼称です。エクアドルでは CCN-51 のような交雑クローンも広く栽培されており、産地名だけから原料の系統は決まりません。',
  },
  {
    id: 'dominican-republic',
    name: 'ドミニカ共和国',
    country: 'ドミニカ共和国',
    regions: [],
    tradeNames: [
      {
        name: 'サンチェス（Sanchez）',
        kind: 'grade',
        note: '品種名ではなく、未発酵（自然乾燥）の豆に対するグレード名です。',
      },
      {
        name: 'ヒスパニオラ（Hispaniola）',
        kind: 'grade',
        note: '品種名ではなく、発酵させた豆に対するグレード名です。',
      },
    ],
    relatedTraditionalIds: ['trad-trinitario'],
    relatedGeneticGroupIds: [],
    relatedCloneIds: [],
    flavorEvidence: 'measured',
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'peer-reviewed' },
    scienceNote: '産地の試料について官能特性と揮発性成分の実測があり、産地レベルの所見として表示できる数少ない例です。ただし実測が示すのは「産地で一通りの味」ではなく、発酵条件による大きな変動です。',
    findings: [
      {
        kind: 'sensory',
        statement: 'ドミニカ共和国産のトリニタリオ54試料について、官能特性と揮発性成分（GC-MS）の実測が行われています。同じ産地でも発酵の進め方によって香味の評価が大きく変わるため、「ドミニカ産の味」を単一の香味で表すことはできません。',
        conditions: '54試料の実測（Guzmán Penella et al. 2023）。発酵条件の違いが評価を左右する点が重要な留保です。',
        sourceIds: ['guzman-penella-2023-dominican-cacao'],
      },
    ],
    sourceIds: ['guzman-penella-2023-dominican-cacao'],
    note: 'サンチェスとヒスパニオラは品種名ではなく発酵の有無によるグレード名です。産地の表示だけでは発酵条件までは分かりません。',
  },
  {
    id: 'ghana',
    name: 'ガーナ',
    country: 'ガーナ',
    regions: [],
    tradeNames: [],
    relatedTraditionalIds: [],
    relatedGeneticGroupIds: ['gen-amelonado'],
    relatedCloneIds: [],
    flavorEvidence: 'measured',
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'partial' },
    scienceNote: 'ガーナ産豆そのものを試料にした実測はありますが、その内容は「発酵法や加工条件で香味がどう変わるか」であり、「ガーナ固有の味」を他産地と比較した実測ではありません。その区別を明記して表示します。',
    findings: [
      {
        kind: 'sensory',
        statement: 'ガーナ産豆では、発酵法（ヒープ法とトレイ法の違い）と、その後の焙煎・コンチングの条件によって香味が変わることが実測されています。',
        conditions: '産地固有の味の実測ではなく、加工条件の影響の実測です（Owusu et al. 2012）。',
        sourceIds: ['owusu-2012-ghana-fermentation'],
      },
      {
        kind: 'composition',
        statement: '発酵法の違いがガーナ産豆の品質属性に影響することが実測されています。',
        sourceIds: ['owusu-2013-ghana-quality'],
      },
    ],
    sourceIds: ['owusu-2012-ghana-fermentation', 'owusu-2013-ghana-quality'],
    note: '遺伝的な基盤はアメロナードとその交雑系統が中心とされますが、産地名から個別の製品の系統や味を決めることはできません。',
  },
  {
    id: 'madagascar',
    name: 'マダガスカル',
    country: 'マダガスカル',
    regions: [
      { name: 'サンビラーノ渓谷', note: '主要産地の一つ。農家試料の遺伝解析（SNP）が行われた地域です。' },
    ],
    tradeNames: [],
    relatedTraditionalIds: ['trad-criollo', 'trad-trinitario'],
    relatedGeneticGroupIds: ['gen-criollo', 'gen-amelonado'],
    relatedCloneIds: [],
    flavorEvidence: 'general',
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'partial' },
    scienceNote: '遺伝については実測がありますが、香味については単一製品の揮発性成分の実測までです。産地全体の香味プロファイルは表示しません。',
    findings: [
      {
        kind: 'genetic',
        statement: 'サンビラーノ地域の農家試料を SNP で解析すると、クリオロ、アメロナード、トリニタリオの3群が混在していました。「マダガスカル産＝クリオロ」という説明は、この実測と一致しません。',
        sourceIds: ['li-2021-madagascar-cacao-snp'],
      },
      {
        kind: 'composition',
        statement: 'マダガスカル産と表示された単一産地チョコレート1製品の揮発性成分が実測され、ストレッカーアルデヒド類が比較試料の中で最も高い水準でした。',
        conditions: '1製品の組成実測であり、産地全体の香味を示すものではありません（Godočíková et al. 2020）。',
        sourceIds: ['godocikova-2020-madagascar-volatiles'],
      },
    ],
    sourceIds: ['li-2021-madagascar-cacao-snp', 'godocikova-2020-madagascar-volatiles'],
    note: '産地名は品種名ではありません。同じマダガスカル産でも、栽培される木の遺伝的背景は一様ではありません。',
  },
  {
    id: 'peru',
    name: 'ペルー',
    country: 'ペルー',
    regions: [
      { name: 'ピウラ', note: 'ピウラ・ポルセラーナ／ピウラ・ブランコで知られる北部産地。' },
      { name: 'クスコ', note: '在来系統チュンチョの産地として知られる南部産地。' },
      { name: 'マラニョン', note: '「ピュア・ナシオナルの再発見」の産地として紹介されることがありますが、その表現の査読論文での裏付けは確認できていません。また Marañon は遺伝集団の名前でもあり、同じ綴りでも指す対象が異なる場合があります。' },
    ],
    tradeNames: [],
    relatedTraditionalIds: [],
    relatedGeneticGroupIds: ['gen-nacional'],
    relatedCloneIds: [],
    flavorEvidence: 'general',
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'partial' },
    scienceNote: 'ピウラ・ポルセラーナの遺伝については原著の実測がありますが、香味については製品の組成実測までです。産地全体の香味プロファイルは表示しません。',
    findings: [
      {
        kind: 'genetic',
        statement: 'ピウラ・ポルセラーナは、エクアドルの Nacional と大まかな集団所属を共有する一方、有意に分化した独自の集団です（Fst = 0.185, P < 0.001）。Nacional そのものとして表示することはできません。',
        sourceIds: ['arevalo-gardini-2019-piura-porcelana'],
      },
      {
        kind: 'composition',
        statement: 'ピウラ・ブランコとチュンチョを名乗る各1製品について、組成の実測があります。',
        conditions: '論文中の品種ラベルは表示上の呼称であり、遺伝的同一性の証明ではありません（Cartas et al. 2024）。',
        sourceIds: ['cartas-2024-peru-chocolate'],
      },
    ],
    sourceIds: ['arevalo-gardini-2019-piura-porcelana', 'cartas-2024-peru-chocolate'],
    note: '「ピュア・ナシオナル再発見」のような宣伝文句は、査読論文で確認できていないため本アプリでは採用していません。',
  },
  {
    id: 'cote-divoire',
    name: 'コートジボワール',
    country: 'コートジボワール',
    regions: [],
    tradeNames: [],
    relatedTraditionalIds: [],
    relatedGeneticGroupIds: [],
    relatedCloneIds: [],
    flavorEvidence: 'none',
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'unconfirmed' },
    scienceNote: '世界最大級のカカオ生産国ですが、本アプリで確認できた査読研究は発酵に関わる酵母など微生物に関するものが中心で、産地としての香味を実測した研究は確認できていません。そのため香味については何も表示しません。',
    findings: [],
    sourceIds: ['cote-divoire-yeast-2024'],
    note: '産地名のみを登録しています。生産量の大きさと、香味の科学データの有無は別の問題です。',
  },
  {
    id: 'tanzania',
    name: 'タンザニア',
    country: 'タンザニア',
    regions: [],
    tradeNames: [],
    relatedTraditionalIds: [],
    relatedGeneticGroupIds: [],
    relatedCloneIds: [],
    flavorEvidence: 'none',
    verification: { existence: 'confirmed', classification: 'unconfirmed', science: 'unconfirmed' },
    scienceNote: '遺伝・香味のどちらの査読データも、本アプリでは確認できていません。そのため産地名以外の情報は表示しません。',
    findings: [],
    sourceIds: [],
    note: '産地名のみを登録しています。業界の紹介文にある香味の説明は、査読された実測ではないため採用していません。',
  },
]

export const cacaoOriginById = (id: string) => cacaoOrigins.find((o) => o.id === id)

/** 指定した系統（伝統的分類・遺伝集団・クローン）に関連付けられた産地 */
export const originsForLineage = (layer: 'traditional' | 'genetic' | 'clone', id: string) =>
  cacaoOrigins.filter((o) =>
    layer === 'traditional'
      ? o.relatedTraditionalIds.includes(id)
      : layer === 'genetic'
        ? o.relatedGeneticGroupIds.includes(id) || o.tradeNames.some((t) => t.linkedGeneticGroupId === id)
        : o.relatedCloneIds.includes(id))
