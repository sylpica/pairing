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
  {
    id: 'ax-shizuoka-green',
    axis: 'region', entityId: 'shizuoka', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: '静岡県内でも山間部（川根など）の煎茶では、(Z)-ジャスモン酸メチルが特徴香に寄与し、その添加で新鮮な香りが強まることが官能で確認されました（総説の要約経由で確認した知見）。分類プロファイルの花様は、この地域の山間部の実測でも裏付けられます。なお平坦部では香りの組成が異なるとされており、地域全体に一様に当てはまるものではありません。',
        sourceIds: ['mizukami-2018-mountain-sencha-aroma'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-anhui-black',
    axis: 'region', entityId: 'anhui', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'honey', mode: 'emphasize', level: 'measured',
        text: '祁門紅茶では、蜜様・花様の強さで等級が分かれることが、揮発成分の分析と官能評価の研究で示されました。分類プロファイルの蜂蜜は、この産地の紅茶の実測でも裏付けられます。',
        sourceIds: ['su-2022-keemun-grade-key-volatiles'],
      },
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'measured',
        text: '同じ研究で、花様も祁門紅茶の等級を分ける軸とされました。分類プロファイルの花様は、この産地の紅茶の実測でも裏付けられます。',
        sourceIds: ['su-2022-keemun-grade-key-volatiles'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-guangdong-oolong',
    axis: 'region', entityId: 'guangdong', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'general',
        text: '広東・潮州の鳳凰単叢では、主要な香型（香りの類型）が揮発成分で比較され、インドール・ホトリエノール・ジャスミンラクトンなどが単叢で豊富な成分群とされました。香型の多くが花や果実の名を持つ類型であることを、一般的な知見として示します（香型は官能的な類型であり、産地全体の単一プロファイルではありません）。',
        sourceIds: ['qin-2023-dancong-fragrance-types'],
      },
      {
        noteId: 'orchid', mode: 'add', level: 'general',
        text: '香型には芝蘭香・蜜蘭香など、蘭の香りを名前に持つ類型が含まれます。類型として知られる香りの方向を、一般的な知見として弱く示します。',
        sourceIds: ['qin-2023-dancong-fragrance-types'],
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
  {
    id: 'ax-fukumidori-green',
    axis: 'cultivar', entityId: 'fukumidori', kindCategory: 'green',
    noteEffects: [],
    tasteEffects: [
      {
        key: 'umami', direction: 'stronger', level: 'general',
        text: '埼玉県茶業研究所のブレンド設計報告では、ふくみどり は「こくのあるうま味が強い」と記述されました。公的機関の記述に基づく一般的な知見として、うま味の方向を一段だけ示します。',
        sourceIds: ['sasaki-2018-green-tea-cultivar-blending'],
      },
    ],
  },
  {
    id: 'ax-komakage-green',
    axis: 'cultivar', entityId: 'komakage', kindCategory: 'green',
    noteEffects: [],
    tasteEffects: [
      {
        key: 'umami', direction: 'milder', level: 'general',
        text: '埼玉県茶業研究所のブレンド設計報告では、こまかげ は「こくのあるうま味は少ない」と記述されました。公的機関の記述に基づく一般的な知見として、うま味が穏やかな方向を一段だけ示します。',
        sourceIds: ['sasaki-2018-green-tea-cultivar-blending'],
      },
    ],
  },
  {
    id: 'ax-dancong-oolong',
    axis: 'cultivar', entityId: 'fenghuang-dancong-group', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'general',
        text: '鳳凰単叢は、香りの特徴によって香型（蜜蘭香・芝蘭香・夜来香など）に分類される系統群で、香型ごとにマーカー化合物が整理されています（例：蜜蘭香＝サリチル酸メチル・3-カレン）。香型は官能的な香りの類型であり、系統群全体の単一プロファイルではないため、花様の方向を一般的な知見として示します。',
        sourceIds: ['dancong-aroma-2025-jfq', 'li-wang-2020-dancong-types'],
      },
      {
        noteId: 'orchid', mode: 'add', level: 'general',
        text: '香型には芝蘭香・蜜蘭香など蘭の香りを名前に持つ類型があり、trans-β-イオノンなどがマーカーとして整理されています。類型として知られる香りの方向を、一般的な知見として弱く示します。',
        sourceIds: ['dancong-aroma-2025-jfq'],
      },
      {
        noteId: 'honey', mode: 'add', level: 'general',
        text: '香型の一つ「蜜蘭香」は、蜜と蘭の香りを名前に持つ類型です。類型として知られる香りの方向を、一般的な知見として弱く示します。',
        sourceIds: ['dancong-aroma-2025-jfq'],
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
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'general',
        text: '伝統的 Nacional 遺伝子型の発酵豆は、スミレ・ジャスミン・ライラック・オレンジの花に似た花様の味を示すと整理されています（Boza et al. 2014 が先行研究を引いた整理）。プロファイルに花様がある場合、その根拠を一般的な知見として補います。',
        sourceIds: ['boza-2014-ccn51'],
      },
      {
        noteId: 'white-flower', mode: 'add', level: 'general',
        text: '同じ整理で、オレンジの花など白い花に似た味が挙げられています。一般的な知見として弱く示します。',
        sourceIds: ['boza-2014-ccn51'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'general',
        text: '同じ整理で、果実様の味も挙げられています。一般的な知見として弱く示します。',
        sourceIds: ['boza-2014-ccn51'],
      },
    ],
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

// ============================================================
// 変換しない所見の理由（軸ごとに「変わらない理由」を画面に出すためのデータ）
//
// 変換ルールが無いエンティティでも、画面で選んだときに理由が表示されるよう、
// 所見を持つ全エンティティについて「なぜホイールに反映しないか」を1件ずつ
// データとして保持する。カバレッジはテスト（comboAxis.test.ts）で固定する:
// 所見を持つ全エンティティは「変換ルールあり」か「理由つき効果なし」の
// どちらかが必ず定義されていなければならない。
// ============================================================

export type AxisNoEffectCategory =
  /** 香味の所見自体が確認できていない */
  | 'no-flavor-findings'
  /** 検出・含有・組成のみで、香味への寄与を示さない */
  | 'composition-only'
  /** 産地・品種の判別が主眼の知見 */
  | 'discrimination-only'
  /** 製法・加工・発酵条件による変動の知見（軸自体の方向ではない） */
  | 'process-variation'
  /** 等級・季節・条件による変動の知見 */
  | 'condition-variation'
  /** 地域内の品種差など、軸自体ではなく別の軸の知見 */
  | 'cultivar-variation'
  /** 保存・熟成など時間変化の知見 */
  | 'storage-temporal'
  /** 官能評価はあるが、特定の香味の方向（ノート・強弱）を示さない */
  | 'no-direction'
  /** 遺伝・分類の知見のみ */
  | 'genetic-only'
  /** 記述子はあるが、対応するノート・味覚が収録データになく方向づけの置き先がない */
  | 'unmapped-descriptor'
  /** 寄与成分は示されるが、香りの対応・方向が示されておらず写像できない */
  | 'contribution-unmapped'

export interface AxisNoEffect {
  axis: 'region' | 'cultivar' | 'origin' | 'lineage'
  entityId: string
  /** お茶側: その分類での理由が異なる場合に指定 */
  kindCategory?: string
  /** チョコ系統側: 階層 */
  lineageLayer?: CacaoLayer
  category: AxisNoEffectCategory
  /** 画面表示用の完全な理由文 */
  text: string
}

export const axisNoEffects: AxisNoEffect[] = [
  // ---- お茶：地域 ----
  { axis: 'region', entityId: 'nagasaki', category: 'no-direction',
    text: '「長崎」の所見は、品評会出品の緑茶が「甘み、旨味、苦みのバランスが良い」とされた総合評価と、評価と結びつく成分群の分析です。特定の香りのノートや味覚の方向（強弱）を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'murakami', category: 'discrimination-only',
    text: '「村上」の所見は、官能評価で静岡産と産地別に分かれたことと、成分構成の差に関するものです。特定の香りのノートへの寄与を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'yame', category: 'composition-only',
    text: '「八女」の所見は、玉露の品質指標（テアニン含量等）と覆い香成分の含量比較です。含量の知見であり、香味への寄与の検証ではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'saga', category: 'process-variation',
    text: '「佐賀」の所見は、同一の葉を製法で作り分けた比較（味覚センサーによる推定値を含む）です。製法の違いの知見であり、地域自体の香味の方向ではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'miyazaki', category: 'process-variation',
    text: '「宮崎」の所見は、釜炒り茶の成分溶出という製法の特性に関するものです。地域自体の香味の方向を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'kagoshima', category: 'cultivar-variation',
    text: '「鹿児島」の所見は、県内の品種ごとに官能の記述子が異なることを示したものです。地域自体の香味の方向ではなく品種差の知見であり、品種側の反映で扱うため、地域としてはホイールのノートに反映していません。' },
  { axis: 'region', entityId: 'uji', category: 'storage-temporal',
    text: '「宇治」の所見は、覆い下茶を冷蔵保存すると熟成してうま味やまろやかさが増すという、保存による時間変化の知見です。地域自体の香味の方向ではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'kochi', category: 'no-direction',
    text: '「高知」の所見は、付香したアールグレイ銘柄同士の成分比較です。地域自体の香味の方向を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'zhejiang', category: 'discrimination-only',
    text: '「浙江」の所見は、非揮発成分による小産地の判別までです。香りの成分の寄与を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'jiangsu', category: 'contribution-unmapped',
    text: '「江蘇」の所見では、碧螺春の個性を生む成分としてクマリンが示されましたが、所見は含量差の指摘までで、その香りの方向は示されておらず、アプリの成分データにもクマリンの香りの対応が未収録のため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'guizhou', category: 'composition-only',
    text: '「貴州」の所見は、代表緑茶の揮発成分・フェノール類の同定と比較です。成分の組成の知見であり、特定のノートへの寄与を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'yunnan', category: 'condition-variation',
    text: '「雲南」の所見は、晒青緑茶の地域差の要因解析と、白茶で香気活性成分が製法によって大きく変わるという知見です。地域としての単一の香味の方向を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'guangxi', category: 'cultivar-variation',
    text: '「広西」の所見は、紅茶では品種によって香型が分かれることと、六堡茶の工程による香味変化です。地域自体の単一の方向を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'hubei', category: 'composition-only',
    text: '「湖北」の所見は、加工工程を通じた揮発成分の同定で、寄与は含量と文献の閾値からの推定に留まります。寄与の実測ではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'shaanxi', category: 'discrimination-only',
    text: '「陝西」の所見は、非揮発成分の定量による小産地の判別と、呈味に寄与する成分の解析です。特定の味覚の方向を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'darjeeling', category: 'condition-variation',
    text: '「ダージリン」の所見は、製程や季節・標高による代謝物の組成変化です。特定の香りのノートへの寄与を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'assam', category: 'composition-only',
    text: '「アッサム」の所見は、紅茶の生化学的な品質パラメータの実測です。官能の知見ではなく、特定のノートへの寄与を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'uva', category: 'discrimination-only',
    text: '「ウバ」の所見は、化学的な品質パラメータによる産地判別で、揮発成分が判別に効くのはフレーバーシーズンの時期に限られます。特定のノートへの寄与を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'dimbula', category: 'discrimination-only',
    text: '「ディンブラ」の所見は、化学的な品質パラメータによる産地判別です。特定のノートへの寄与を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'nuwara-eliya', category: 'discrimination-only',
    text: '「ヌワラエリヤ」の所見は、色やテアルビジン等の指標による産地判別です。香りのノートへの寄与を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'fujian', kindCategory: 'white', category: 'discrimination-only',
    text: '「福建」の白茶についての所見は、揮発成分の組成による産地判別です。特定のノートへの寄与を示すものではないため、この分類ではホイールのノートに反映していません。' },
  { axis: 'region', entityId: 'anhui', kindCategory: 'green', category: 'discrimination-only',
    text: '「安徽」の緑茶（黄山毛峰）についての所見は、キラル揮発成分の分布による産地・品種の判別です。特定のノートへの寄与を示すものではないため、この分類ではホイールのノートに反映していません。' },
  { axis: 'region', entityId: 'guangdong', kindCategory: 'green', category: 'cultivar-variation',
    text: '「広東」の緑茶（客家炒青緑茶）についての所見では、香りは品種によって分かれました（黄旦は花香、梅占は炒米香）。その品種はアプリに未収録で、地域自体の単一の方向ではないため、この分類ではホイールのノートに反映していません。' },

  // ---- お茶：品種 ----
  { axis: 'cultivar', entityId: 'saemidori', category: 'unmapped-descriptor',
    text: '「さえみどり」の官能の所見は「甘さ」「なめらかな」「さつま芋（様）」という記述子です。ただし土台プロファイルには甘味の記録がなく（不明）、「さつま芋（様）」に対応する香味ノートも収録データにないため、方向づけを置く先がありません。そのためホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'yutakamidori', category: 'no-direction',
    text: '「ゆたかみどり」の官能の所見は「独特な」「やさしい」という記述子で、特定の香りや味の方向を示すものではありません。そのためホイールのノートには反映していません。' },
  { axis: 'cultivar', entityId: 'asatsuyu', category: 'unmapped-descriptor',
    text: '「あさつゆ」の官能の所見は「さつま芋（様）」「香りの強い」等の記述子で、アプリの香味ノートに対応づけられる形では示されていません。有機酸の所見も葉の含量の測定であり、味の強弱を断定できるものではないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'tsuyuhikari', category: 'composition-only',
    text: '「つゆひかり」の所見は、育成地試験での成分の含有と、育成機関による官能の概評です。独立した官能・成分の検証で特定のノートへの寄与が示されたものではないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'benifuuki', category: 'composition-only',
    text: '「べにふうき」の所見は、機能性成分 EGCG3″Me の含有に関するもので、香り・味への寄与を示すものではありません（紅茶に加工すると消失する成分でもあります）。そのためホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'benihomare', category: 'composition-only',
    text: '「べにほまれ」の所見は、1967年の GC による香気成分の検出・相対量の比較です。現代的基準の寄与評価ではないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'seimei', category: 'composition-only',
    text: '「せいめい」の所見は、育成報告による荒茶の化学成分の含有です。含有の事実であり、香味への寄与を示すものではないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'meiryoku', category: 'composition-only',
    text: '「めいりょく」の所見は、育成機関の評価と、被覆条件での成分実測です。独立した検証で特定のノートへの寄与が示されたものではないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'qingxin-oolong', category: 'condition-variation',
    text: '「青心烏龍」の所見は、市販試料で焙煎度によって主要な香気活性成分が変わるという、製法要因の知見です。品種そのものの香味の方向を示すものではないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'jinxuan', category: 'composition-only',
    text: '「金萱（台茶12号）」の所見は、烏龍茶の製程でミルク様の香りに関連する成分がどう動くかという形成機構の研究です。成分の組成・動態の知見であり、寄与の確定ではないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'hongyu', category: 'composition-only',
    text: '「紅玉（台茶18号）」の所見は、学位論文による揮発成分の同定と、製法比較での組成の知見です。寄与は存在量と閾値に基づく著者の推定に留まるため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'fujikaori', category: 'composition-only',
    text: '「藤かおり」の所見は、アントラニル酸メチルを含むことの確認（検出）です。検出だけでは香りへの寄与は分からないため、ホイールには反映していません（寄与が AEDA で示された そうふう とは扱いが異なります）。' },
  { axis: 'cultivar', entityId: 'av2', category: 'composition-only',
    text: '「AV2」の所見は、季節によるフェノール類・カテキン類の変動を遺伝子型ごとに比べた代謝成分の研究です。官能の知見ではなく、特定のノートへの寄与を示すものではないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'tri-2023', category: 'composition-only',
    text: '「TRI 2023」の所見は、茶カテキンの分析法の研究で供試試料に含まれたという分析化学の実測です。香味のデータではないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'tri-2025', category: 'composition-only',
    text: '「TRI 2025」の所見は、茶カテキンの分析法の研究で供試試料に含まれたという分析化学の実測です。香味のデータではないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'tri-2043', category: 'composition-only',
    text: '「TRI 2043」の所見は、フェノール類の含有量の実測です。含有の知見であり、香味への寄与を示すものではないため、ホイールには反映していません。' },

  // ---- チョコ：産地 ----
  { axis: 'origin', entityId: 'venezuela', category: 'genetic-only',
    text: '「ベネズエラ」の所見は、栽培集団の遺伝的な混合の実測と、栄養成分等の組成の比較です。産地としての香味の方向を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'origin', entityId: 'ecuador', category: 'cultivar-variation',
    text: '「エクアドル」の香味に関する実測は、産地そのものではなく「現代 Nacional」という栽培集団のレベルで行われています。産地固有の香味としては扱わず、系統（ナシオナル）を選んだ場合の反映に委ねるため、産地としてはホイールに反映していません。' },
  { axis: 'origin', entityId: 'dominican-republic', category: 'condition-variation',
    text: '「ドミニカ共和国」については産地試料の官能・揮発成分の実測がありますが、その結論は「同じ産地でも発酵の進め方で香味が大きく変わる」というもので、産地として単一の香味の方向を示すものではありません。そのためホイールのノートには反映していません。' },
  { axis: 'origin', entityId: 'ghana', category: 'process-variation',
    text: '「ガーナ」の所見は、発酵法や焙煎・コンチングの条件で香味がどう変わるかという加工条件の実測です。産地固有の香味の方向を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'origin', entityId: 'madagascar', category: 'composition-only',
    text: '「マダガスカル」の所見は、農家試料の遺伝解析と、単一製品の揮発成分の組成実測です。産地全体の香味を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'origin', entityId: 'peru', category: 'genetic-only',
    text: '「ペルー」の所見は、ピウラ・ポルセラーナの遺伝的な位置づけと、個別製品の組成実測です。産地全体の香味の方向を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'origin', entityId: 'cote-divoire', category: 'no-direction',
    text: '「コートジボワール」については官能・揮発成分の実測がありますが、その結論は「発酵・焙煎後のチョコレートでは産地による違いは見られない」というもので、産地の香味の方向を示すものではありません（発酵場所の違いの実測は、産地の香味とは別に扱います）。そのためホイールのノートには反映していません。' },
  { axis: 'origin', entityId: 'tanzania', category: 'no-flavor-findings',
    text: '「タンザニア」については香味の科学的な所見が確認できていないため、産地の情報はホイールの推測に使っていません。' },

  // ---- チョコ：系統 ----
  { axis: 'lineage', entityId: 'trad-forastero', lineageLayer: 'traditional', category: 'no-flavor-findings',
    text: '「フォラステロ（Forastero）」は大きな集団の総称で、総称としての香味の実測は原理的に存在しません。そのため系統の情報はホイールの推測に使っていません。' },
  { axis: 'lineage', entityId: 'trad-trinitario', lineageLayer: 'traditional', category: 'composition-only',
    text: '「トリニタリオ（Trinitario）」の所見は、タイプ別種子のフェノール組成の分析で、総ポリフェノール量等に遺伝的に決まる差は見出されなかったという知見を含みます。特定のノートへの寄与を示すものではないため、ホイールには反映していません。' },
  { axis: 'lineage', entityId: 'gen-criollo', lineageLayer: 'genetic', category: 'genetic-only',
    text: '遺伝集団「クリオロ（Criollo）」の所見は、家畜化の過程に関する集団ゲノミクスの知見です。香味の実測ではないため、ホイールには反映していません（伝統的分類のクリオロとは別エンティティとして扱います）。' },
  { axis: 'lineage', entityId: 'imc-67', lineageLayer: 'clone', category: 'composition-only',
    text: '「IMC-67」の所見は、加工工程を通じた揮発成分の検出・組成の測定です。官能による寄与の実証は確認できていないため、ホイールには反映していません。' },
]

/**
 * 軸エンティティの「反映しない理由」を引く。
 * kindCategory / lineageLayer が一致する専用エントリを優先し、無ければ汎用エントリ。
 */
export function axisNoEffectFor(
  axis: 'region' | 'cultivar' | 'origin' | 'lineage',
  entityId: string,
  opts?: { kindCategory?: string; lineageLayer?: CacaoLayer },
): AxisNoEffect | undefined {
  const candidates = axisNoEffects.filter((e) => e.axis === axis && e.entityId === entityId)
  if (candidates.length === 0) return undefined
  const exact = candidates.find(
    (e) =>
      (e.kindCategory === undefined || e.kindCategory === opts?.kindCategory) &&
      (e.lineageLayer === undefined || e.lineageLayer === opts?.lineageLayer) &&
      (e.kindCategory !== undefined || e.lineageLayer !== undefined),
  )
  if (exact) return exact
  return candidates.find((e) => e.kindCategory === undefined && e.lineageLayer === undefined)
}
