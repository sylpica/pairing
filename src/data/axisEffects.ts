import type { ComboLevel, TasteKey } from '../types'
import type { CacaoLayer } from '../engine/pairingContext'

// 「軸の所見」から組み合わせの香味への変換ルール（組み合わせページ第2層）。
// 製法ルール（processRules.ts）と同じ流儀で、地域・品種・産地・系統の所見
// （findings）のうち、香味を具体的に述べているものだけを、根拠区分つきで
// ノート・味覚への効果として明示的に定義する。
//
// 原則（processRules と共通）:
// - ここに無い変換は行わない。所見の文章から機械的にノートを推測することはしない。
// - 効果の根拠は、対象エンティティ自身の試料での寄与・官能の知見に限る。
//   成分が「検出された／含まれていた」（detection / composition）だけの所見は、
//   検出≠寄与の原則により、ノートへの反映には使わない。
// - level は知見の性質で決める:
//   measured = 対象自身の試料で寄与（AEDA・再構成等）または官能が実測された知見に基づく
//   general  = 総説・二次整理など、一般的知見としての性格づけに基づく
//   inferred = 条件の異なる試料での知見を、この組み合わせへ読み替える推測
// - add の強度は原則 'weak'（寄与は示されても強さの格付けは無いため）。
//   所見が「主体香」「突出」と明示する場合のみ 'normal' とする。
// 根拠の調査記録: docs/research/（地域は teaRegions.ts、品種は cultivars.ts、
// 系統は cacao.ts の各 findings が一次記録）

export interface AxisNoteEffect {
  noteId: string
  /** add = そのノートを追加／emphasize = 既にあるノートの根拠を補う */
  mode: 'add' | 'emphasize'
  /** mode: 'add' のときの強度（未指定は 'weak'） */
  intensity?: 'weak' | 'normal'
  /** emphasize のときに強度を一段動かす場合の方向（条件違いの読み替え等） */
  shift?: 'stronger' | 'milder'
  level: ComboLevel
  text: string
  sourceIds: string[]
}

export interface AxisTasteEffect {
  key: TasteKey
  direction: 'milder' | 'stronger'
  level: ComboLevel
  text: string
  sourceIds: string[]
}

export interface TeaAxisRule {
  id: string
  axis: 'region' | 'cultivar'
  entityId: string
  /** 対象の茶類カテゴリ（TeaKind.category）。省略時は全分類 */
  kindCategory?: string
  noteEffects: AxisNoteEffect[]
  tasteEffects: AxisTasteEffect[]
}

export interface ChocoAxisRule {
  id: string
  axis: 'origin' | 'lineage'
  entityId: string
  /** axis: 'lineage' のときの階層 */
  lineageLayer?: CacaoLayer
  /** 対象のチョコ種類。省略時は全種類 */
  kinds?: string[]
  noteEffects: AxisNoteEffect[]
  tasteEffects: AxisTasteEffect[]
}

// ============================================================
// お茶：地域の所見からの変換
// ============================================================

export const teaAxisRules: TeaAxisRule[] = [
  {
    id: 'ax-sichuan-black',
    axis: 'region', entityId: 'sichuan', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: '四川工夫紅茶では、在来の四川群体種が花果香の基盤になることが、再構成・欠落・添加試験を含む検証で示されました（キー成分としてゲラニオール、リナロール等）。分類プロファイルの花様は、この産地の実測でも裏付けられます。',
        sourceIds: ['wang-2025-sichuan-gongfu-black-tea'],
      },
      {
        noteId: 'rose', mode: 'add', level: 'measured',
        text: '同じ検証でキー成分とされたゲラニオールの香り（バラ様）です。寄与は検証されていますが、強さの格付けはされていないため、弱いとして示します。',
        sourceIds: ['wang-2025-sichuan-gongfu-black-tea'],
      },
      {
        noteId: 'citrus', mode: 'add', level: 'measured',
        text: '同じ検証でキー成分とされたゲラニオール・リナロールの香り（柑橘様）です。同様に弱いとして示します。',
        sourceIds: ['wang-2025-sichuan-gongfu-black-tea'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-henan-green',
    axis: 'region', entityId: 'henan', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: '清香型の信陽毛尖では AEDA で香気活性成分が同定され、主体香は花香・果実香と結論されました。分類プロファイルの花様は、この産地の実測でも裏付けられます。',
        sourceIds: ['yin-2024-xinyang-maojian-qingxiang'],
      },
      {
        noteId: 'fruit-general', mode: 'add', intensity: 'normal', level: 'measured',
        text: '同じ研究で、果実香は花香と並んで清香型の主体香の一角とされました。そのため弱いではなく普通として示します。',
        sourceIds: ['yin-2024-xinyang-maojian-qingxiang'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-henan-black',
    axis: 'region', entityId: 'henan', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'honey', mode: 'emphasize', level: 'measured',
        text: '信陽の紅茶では、蜜糖様の香りのキー成分としてフェニルアセトアルデヒドが示されました。分類プロファイルの蜂蜜は、この産地の実測でも裏付けられます。',
        sourceIds: ['yao-2023-xinyang-black-tea-honey-aroma'],
      },
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: '同じキー成分フェニルアセトアルデヒドは、花様の香りにも関係する成分として知られます。',
        sourceIds: ['yao-2023-xinyang-black-tea-honey-aroma'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-shandong-green',
    axis: 'region', entityId: 'shandong', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'green-vegetable', mode: 'add', intensity: 'normal', level: 'measured',
        text: '青島・嶗山の緑茶では香気活性成分24種が同定され、ジメチルスルフィドの OAV が突出して高いことが示されました。この成分の香りは、成分データでは「青い野菜」に分類されます。同じ嶗山でも茶園ごとに香りが異なることも示されています。',
        sourceIds: ['zhu-2021-laoshan-green-tea-odorants'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-wenshan-oolong',
    axis: 'region', entityId: 'wenshan', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: '文山包種茶の AEDA では、ジャスミンラクトンと (Z)-ジャスモン酸メチルが最高レベルの香気寄与を示しました（総説の要約経由で確認した知見）。分類プロファイルの花様は、この産地の実測でも裏付けられます。',
        sourceIds: ['mizukami-2017-taiwan-tea-aeda'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-alishan-oolong',
    axis: 'region', entityId: 'alishan', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: '阿里山の高山烏龍茶の AEDA でも、ジャスミンラクトンと (Z)-ジャスモン酸メチルが最高レベルの香気寄与を示しました（総説の要約経由で確認した知見）。分類プロファイルの花様は、この産地の実測でも裏付けられます。',
        sourceIds: ['mizukami-2017-taiwan-tea-aeda'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-nantou-oolong',
    axis: 'region', entityId: 'nantou', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: '鹿谷・凍頂烏龍茶のセンソミクス研究では、スルカトン（6-メチル-5-ヘプテン-2-オン）が花様・果実様の主要香気成分の一つとされました。分類プロファイルの花様は、この産地の実測でも裏付けられます。',
        sourceIds: ['wang-2023-dongding-oolong-sensomics'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'measured',
        text: '同じ研究で、花様と並んで主要な香気として挙げられた果実様の香りです。強さの格付けはされていないため、弱いとして示します。',
        sourceIds: ['wang-2023-dongding-oolong-sensomics'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-fujian-oolong',
    axis: 'region', entityId: 'fujian', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: '安渓鉄観音の烏龍茶は、品種特定の試料の官能評価で甘い花様・果実様と評価されました。分類プロファイルの花様は、この産地の実測でも裏付けられます。',
        sourceIds: ['zheng-2022-tieguanyin-aroma'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'measured',
        text: '同じ官能評価で、花様と並んで挙げられた果実様の香りです。強さの格付けはされていないため、弱いとして示します。',
        sourceIds: ['zheng-2022-tieguanyin-aroma'],
      },
    ],
    tasteEffects: [],
  },

  // ============================================================
  // お茶：品種の所見からの変換
  // ============================================================
  {
    id: 'ax-yabukita-green',
    axis: 'cultivar', entityId: 'yabukita', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: 'やぶきたの煎茶の AEDA（香気エキス希釈分析）では、リナロールが主要な香気寄与成分の一つとされました。分類プロファイルの花様は、品種自身の実測でも裏付けられます。',
        sourceIds: ['mizukami-2012-sofu-yabukita-aeda'],
      },
      {
        noteId: 'honey', mode: 'add', level: 'measured',
        text: '同じ AEDA で、β-ダマセノンも主要な香気寄与成分とされました。この成分の香り（蜂蜜様）です。寄与は示されていますが、強さの格付けはされていないため、弱いとして示します。',
        sourceIds: ['mizukami-2012-sofu-yabukita-aeda'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-soufu-green',
    axis: 'cultivar', entityId: 'soufu', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'fruit-general', mode: 'add', level: 'measured',
        text: 'そうふう の品種特異的な香りの原因成分アントラニル酸メチルは、煎茶の AEDA で果実様の香りに大きく影響するとされました。この成分の香り（果実全般）です。強さの格付けはされていないため、弱いとして示します。',
        sourceIds: ['sawai-2004-sofu-methyl-anthranilate', 'mizukami-2012-sofu-yabukita-aeda'],
      },
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: '同じ AEDA で、(Z)-ジャスモン酸メチルが花様の香りに大きく影響するとされ、アロマプロファイルでは やぶきた に比べて花様が強かったとされました。分類プロファイルの花様は、品種自身の実測でも裏付けられます。',
        sourceIds: ['mizukami-2012-sofu-yabukita-aeda'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-koushun-green',
    axis: 'cultivar', entityId: 'koushun', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', shift: 'stronger', level: 'inferred',
        text: '香駿は、香気発揚処理を施した「香り緑茶」の調査で、花様・甘い香りを強く感じるとする回答が やぶきた より有意に多い品種でした。ただし通常の煎茶での比較ではないため、通常の緑茶でも花様が一段強まる方向を、推測として示します。',
        sourceIds: ['shiratori-2022-kaori-ryokucha'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-sayamakaori-green',
    axis: 'cultivar', entityId: 'sayamakaori', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', shift: 'stronger', level: 'inferred',
        text: 'さやまかおりは、香気発揚処理を施した「香り緑茶」の調査で、花様の香りと甘い香りを強く感じるとする回答が やぶきた より有意に多い品種でした。ただし通常の煎茶での比較ではないため、通常の緑茶でも花様が一段強まる方向を、推測として示します。',
        sourceIds: ['shiratori-2022-kaori-ryokucha'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-kanayamidori-green',
    axis: 'cultivar', entityId: 'kanayamidori', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: '鹿児島の奨励品種を煎茶の標準製法・一番茶で官能評価した研究では、かなやみどり は「花のような」の記述子に有意な関連が示されました。分類プロファイルの花様は、品種自身の官能実測でも裏付けられます。',
        sourceIds: ['kinoshita-2015-kagoshima-cultivar-aroma'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'measured',
        text: '同じ研究で、かなやみどり は「フルーティー」の記述子にも有意な関連が示されました。記述子レベルの知見であり、強さの格付けはされていないため、弱いとして示します。',
        sourceIds: ['kinoshita-2015-kagoshima-cultivar-aroma'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-haramidori-green',
    axis: 'cultivar', entityId: 'harumidori', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: '鹿児島の奨励品種を煎茶の標準製法・一番茶で官能評価した研究では、はるみどり は「花のような」の記述子に有意な関連が示されました。分類プロファイルの花様は、品種自身の官能実測でも裏付けられます。',
        sourceIds: ['kinoshita-2015-kagoshima-cultivar-aroma'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'measured',
        text: '同じ研究で、はるみどり は「フルーティー」の記述子にも有意な関連が示されました。記述子レベルの知見であり、強さの格付けはされていないため、弱いとして示します。',
        sourceIds: ['kinoshita-2015-kagoshima-cultivar-aroma'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-okumidori-green',
    axis: 'cultivar', entityId: 'okumidori', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'fruit-general', mode: 'add', level: 'measured',
        text: '鹿児島の奨励品種を煎茶の標準製法・一番茶で官能評価した研究では、おくみどり は「フルーティー」の記述子に有意な関連が示されました。記述子レベルの知見であり、強さの格付けはされていないため、弱いとして示します。',
        sourceIds: ['kinoshita-2015-kagoshima-cultivar-aroma'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-tieguanyin-oolong',
    axis: 'cultivar', entityId: 'tieguanyin', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: '品種特定の試料で鉄観音と金観音の烏龍茶を比べた研究では、鉄観音は甘い花様・果実様と官能評価され、リナロールとゲラニオールが特徴香に寄与しうるとされました。分類プロファイルの花様は、品種自身の実測でも裏付けられます。',
        sourceIds: ['zheng-2022-tieguanyin-aroma'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'measured',
        text: '同じ官能評価で、花様と並んで挙げられた果実様の香りです。強さの格付けはされていないため、弱いとして示します。',
        sourceIds: ['zheng-2022-tieguanyin-aroma'],
      },
    ],
    tasteEffects: [],
  },
]

// ============================================================
// チョコ：系統の所見からの変換
// （産地の所見は、同じ産地内での条件による変動や組成の知見が中心で、
//  特定のノートへの寄与を示すものが無いため、変換ルールは置かない。
//  反映されない理由は、エンジンが軸ごとの要約として画面に示す。）
// ============================================================

const CRIO_DESCRIPTORS: { noteId: string; name: string }[] = [
  { noteId: 'nut-general', name: 'ナッツ' },
  { noteId: 'almond', name: 'アーモンド' },
  { noteId: 'wood', name: '木' },
  { noteId: 'brown-sugar', name: 'パネラ（黒糖）' },
  { noteId: 'malt', name: '麦芽' },
  { noteId: 'white-flower', name: 'オレンジの花' },
  { noteId: 'cinnamon', name: 'シナモン' },
]
const crioText = (name: string) =>
  `ベネズエラの在来クリオロ等（Guasare、Mérida、Porcelana 等）のリカーを訓練パネルが官能評価した研究で構築された香味ホイールに、典型的な記述子として「${name}」が挙げられました。在来品種群と商業試料を含む統合ホイールであり、個別の品種・製品の実測プロファイルではないため、一般的な知見として弱く示します。`

export const chocoAxisRules: ChocoAxisRule[] = [
  {
    id: 'ax-criollo-liquor-wheel',
    axis: 'lineage', entityId: 'trad-criollo', lineageLayer: 'traditional', kinds: ['dark'],
    noteEffects: [
      ...CRIO_DESCRIPTORS.map(({ noteId, name }) => ({
        noteId, mode: 'add' as const, level: 'general' as const,
        text: crioText(name), sourceIds: ['ramos-2013-venezuela-criollo-liquor'],
      })),
      {
        noteId: 'caramel', mode: 'emphasize', level: 'general',
        text: '同じ香味ホイールに、典型的な記述子として「キャラメル」も挙げられました。分類プロファイルのキャラメルは、この系統の官能知見でも裏付けられます（統合ホイールに基づく一般的な知見）。',
        sourceIds: ['ramos-2013-venezuela-criollo-liquor'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-guiana-dark',
    axis: 'lineage', entityId: 'gen-guiana', lineageLayer: 'genetic', kinds: ['dark'],
    noteEffects: [
      {
        noteId: 'cacao', mode: 'emphasize', level: 'measured',
        text: 'フランス領ギアナ野生集団由来のクローン群では、訓練パネルによるチョコレート官能で、カカオフレーバーが産業リファレンス（West African Amelonado）より統計的に優れていたと報告されています（総説経由の報告であり、個別の香調の集団特性としてではなく、カカオ感の裏付けとして扱います）。',
        sourceIds: ['lachenaud-2015-guiana-wild-cacao'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-ics95-dark',
    axis: 'lineage', entityId: 'ics-95', lineageLayer: 'clone', kinds: ['dark'],
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'add', level: 'measured',
        text: 'コロンビア南部 Meta 県の農園試料をクローン別に比較した査読研究では、ICS-95 は最良の官能属性（花様・甘味・酸味・新鮮な果実）を示した群に含まれました。農園レベルの試料であり環境効果と分離できていないため、当該試料での結果として弱く示します。',
        sourceIds: ['ramon-2023-colombia-cacao-clones'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'measured',
        text: '同じ研究で挙げられた「新鮮な果実」の記述子に基づきます。同様に弱く示します。',
        sourceIds: ['ramon-2023-colombia-cacao-clones'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-nacional-tastes',
    axis: 'lineage', entityId: 'gen-nacional', lineageLayer: 'genetic', kinds: ['dark', 'milk', 'ruby', 'blond'],
    noteEffects: [],
    tasteEffects: [
      {
        key: 'sour', direction: 'milder', level: 'general',
        text: '伝統的 Nacional 遺伝子型の発酵豆は、低酸味・低苦味・低渋味で、果実様・花様の味を示すと整理されています（Boza et al. 2014 が先行研究を引いた整理）。ファインフレーバーの潜在力は発酵工程と製造の実践に大きく影響されるため、一般的な知見として方向だけを示します。',
        sourceIds: ['boza-2014-ccn51'],
      },
      {
        key: 'bitter', direction: 'milder', level: 'general',
        text: '同じ整理で、伝統的 Nacional の発酵豆は苦味も低い側とされています。方向だけを一般的な知見として示します。',
        sourceIds: ['boza-2014-ccn51'],
      },
      {
        key: 'astringent', direction: 'milder', level: 'general',
        text: '同じ整理で、伝統的 Nacional の発酵豆は渋味も低い側とされています。方向だけを一般的な知見として示します。',
        sourceIds: ['boza-2014-ccn51'],
      },
    ],
  },
]
