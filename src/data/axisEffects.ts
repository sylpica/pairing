import type { ComboLevel, TasteKey } from '../types'
import type { CacaoLayer } from '../engine/pairingContext'

// 「軸の所見」から組み合わせの香味への変換ルール（組み合わせページ第2層）。
// 製法ルール（processRules.ts）と同じ流儀で、地域・品種・産地・系統の所見
// （findings）のうち、香味を具体的に述べているものだけを、根拠区分つきで
// ノート・味覚への効果として明示的に定義する。
//
// 原則（processRules と共通）:
// - ここに無い変換は行わない。所見の文章から機械的にノートを推測することはしない。
// - measured / general の効果の根拠は、対象エンティティ自身の試料での寄与・官能の
//   知見に限る。成分が「検出された／含まれていた」（detection / composition）だけの
//   所見は、検出≠寄与の原則により、実測・一般的知見としての反映には使わない。
// - 第5弾（2026-10-31 ユーザー指示）: inferred（推測）の効果に限っては、次の
//   足がかりによる推測を認める。各効果の根拠文に「何を足がかりにした推測か」を
//   必ず明示し、実測・一般的知見への格上げはしない。効果は方向＋1段階まで
//   （add は原則「弱い」）。
//   (a) 所見自体が述べる香味の方向（記述子・官能の傾向・成分含量の方向）
//   (b) そのエンティティで確認されている化合物 → 成分データ（compounds.ts）の
//       既知の香りへの写像
//   (c) 製法・加工の特徴（研究記録に裏付けのある一般傾向）
//   (d) 近接エンティティの知見（同国の他地域・同じ品種の他茶類・同じ遺伝
//       グループの傾向など、方向が文献で示されているものに限る）
//   (e) 遺伝情報（交配親・祖先構成）からの合成: 親・祖先側の効果を一段弱く
//       （上限「弱い」）して inferred に落とす。両親で逆方向の効果がある
//       ノートは合成しない。割合の記録は強度に換算しない。今回使った親子ペア:
//       べにふうき←べにほまれ、ゆたかみどり←あさつゆ、せいめい←さえみどり
//       （もう一方の親ふしゅんには効果が無く競合なし）、めいりょく←やぶきた、
//       トリニタリオ←クリオロ（交雑由来の記録に基づき、香味の知見がある
//       クリオロ側のみから合成）。CCN-51 の祖先構成（Boza 2014）は、本体自身の
//       実測（苦味・渋味・オフフレーバーが強く揮発成分が非常に低い）と競合する
//       ため合成に使わない（記録としてここに残す）。
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
  // お茶：地域の所見からの推測（第5弾・inferred のみ）
  // ============================================================
  {
    id: 'axr-nagasaki-green-inf',
    axis: 'region', entityId: 'nagasaki', kindCategory: 'green',
    noteEffects: [],
    tasteEffects: [
      {
        key: 'umami', direction: 'stronger', level: 'inferred',
        text: '日本茶品評会に出品された長崎県産緑茶では、総合評価（VIPスコア上位）と結びつく成分群としてテアニン・グルタミン（アミノ酸）が挙げられ、官能審査でも「旨味のバランスが良い」とされました。アミノ酸群と結びついた評価からの推測として、うま味の方向を一段だけ示します（成分含量と評価の結びつきであり、うま味の強さそのものの実測ではありません）。',
        sourceIds: ['tsujimura-2024-nagasaki-tea-foodomics'],
      },
    ],
  },
  {
    id: 'axr-yame-green-inf',
    axis: 'region', entityId: 'yame', kindCategory: 'green',
    noteEffects: [],
    tasteEffects: [
      {
        key: 'umami', direction: 'stronger', level: 'inferred',
        text: '八女伝統本玉露では、アミノ酸が煎茶と比べて約4割多いことが実測されています（地理的表示の資料）。うま味の主成分であるアミノ酸の含量の方向からの推測として、うま味を一段強めに示します（玉露での含量の知見を、この分類への読み替えとして示す推測です）。',
        sourceIds: ['fukuoka-2020-yame-hon-gyokuro-indicators', 'maff-gi-yame-dentou-hon-gyokuro'],
      },
      {
        key: 'astringent', direction: 'milder', level: 'inferred',
        text: '同じ資料で、八女伝統本玉露のカテキン類は煎茶より約3割少ないとされています。渋味の主因であるカテキン類の含量の方向からの推測として、渋味を一段穏やかに示します。',
        sourceIds: ['fukuoka-2020-yame-hon-gyokuro-indicators', 'maff-gi-yame-dentou-hon-gyokuro'],
      },
    ],
  },
  {
    id: 'axr-saga-green-inf',
    axis: 'region', entityId: 'saga', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'toast', mode: 'add', level: 'inferred',
        text: '佐賀（嬉野）は釜炒り製法の玉緑茶の産地です。釜で炒る製法の香ばしい方向を、製法の特徴からの推測として弱く示します（地域自体の香りの実測ではありません）。',
        sourceIds: ['yamaguchi-miyazaki-2018-kamairi-taste'],
      },
    ],
    tasteEffects: [
      {
        key: 'astringent', direction: 'milder', level: 'inferred',
        text: '同一のやぶきた葉を3製法に作り分けた比較では、釜炒り茶は煎茶より渋味（味覚センサー推定値）が有意に低く、ガレート型カテキンの溶出も低いことが示されました。佐賀の釜炒り製法についての知見からの推測として、渋味を一段穏やかに示します。',
        sourceIds: ['yamaguchi-miyazaki-2018-kamairi-taste'],
      },
    ],
  },
  {
    id: 'axr-miyazaki-green-inf',
    axis: 'region', entityId: 'miyazaki', kindCategory: 'green',
    noteEffects: [],
    tasteEffects: [
      {
        key: 'bitter', direction: 'milder', level: 'inferred',
        text: '釜炒り茶では、荒茶中のカフェイン含量は煎茶と差がないのに浸出液中の含量は低いことが実測されています（圧搾工程が短く葉の損傷が少ないためと考察）。宮崎の釜炒り茶についての知見からの推測として、苦味を一段穏やかに示します。',
        sourceIds: ['taniguchi-2012-kamairi-tea-elution'],
      },
      {
        key: 'astringent', direction: 'milder', level: 'inferred',
        text: '同じ実測で、浸出液中のカテキン類も釜炒り茶の方が低いことが示されました。渋味についても、推測として一段穏やかな方向を示します。',
        sourceIds: ['taniguchi-2012-kamairi-tea-elution'],
      },
    ],
  },
  {
    id: 'axr-uji-green-inf',
    axis: 'region', entityId: 'uji', kindCategory: 'green',
    noteEffects: [],
    tasteEffects: [
      {
        key: 'umami', direction: 'stronger', level: 'inferred',
        text: '宇治の覆い下茶（てん茶・玉露）は、冷蔵保存で熟成するとうま味やまろやかさが増すことが官能検査で確認されています。これは保存による変化の知見であり、地域自体の香味の実測ではありません。その方向からの推測として、うま味を一段強めに示します。',
        sourceIds: ['kyoto-2014-covered-tea-maturation'],
      },
    ],
  },
  {
    id: 'axr-kochi-black-inf',
    axis: 'region', entityId: 'kochi', kindCategory: 'black',
    noteEffects: [],
    tasteEffects: [
      {
        key: 'bitter', direction: 'milder', level: 'inferred',
        text: '高知県産の和紅茶（やぶきた主体）は、比較した輸入ブレンドのアールグレイ2銘柄よりカフェインが最も低い水準だったことが実測されています。苦味の主成分であるカフェインの含量の方向からの推測として、苦味を一段穏やかに示します（比較対象が付香ブレンドである点で、留保つきの推測です）。',
        sourceIds: ['sawamura-2025-earlgrey-extraction'],
      },
    ],
  },
  {
    id: 'axr-hubei-green-inf',
    axis: 'region', entityId: 'hubei', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', shift: 'stronger', level: 'inferred',
        text: '恩施玉露（蒸青緑茶）では、リナロールが揮発成分の最大成分であり、(Z)-ジャスモン酸メチル等とともに寄与が大きいと推定されました。ただし寄与は含量と文献の閾値からの推定に留まるため、実測ではなく推測として、花様を一段強めに示します。',
        sourceIds: ['gui-2024-enshi-yulu-processing'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axr-yunnan-white-inf',
    axis: 'region', entityId: 'yunnan', kindCategory: 'white',
    noteEffects: [
      {
        noteId: 'rose', mode: 'add', level: 'inferred',
        text: '雲南白茶では、2-フェニルエチルアルコールが高い香気活性（r-OAV）の群に含まれることが実測されています。この成分の既知の香り（バラ様）からの推論として、バラを弱く示す推測です（この地域の白茶での寄与の確定ではありません）。',
        sourceIds: ['raza-2025-yunnan-white-tea'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axr-guangxi-black-inf',
    axis: 'region', entityId: 'guangxi', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', shift: 'stronger', level: 'inferred',
        text: '広西の紅茶では、品種によって甘香型・花果香型と香型が分かれることが示されました。地域自体の単一の方向ではありませんが、広西の紅茶に現れる香型の方向からの推測として、花様を一段強めに示します。',
        sourceIds: ['zhao-2025-guangxi-black-tea-cultivars'],
      },
      {
        noteId: 'honey', mode: 'emphasize', level: 'inferred',
        text: '同じ研究で、烏牛早は甘香型とされ官能評価が最高でした。甘い香りの型が現れる地域であることからの推測として、蜂蜜の根拠を補います（強さは変えません）。',
        sourceIds: ['zhao-2025-guangxi-black-tea-cultivars'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axr-guangxi-dark-inf',
    axis: 'region', entityId: 'guangxi', kindCategory: 'dark',
    noteEffects: [
      {
        noteId: 'earth', mode: 'emphasize', shift: 'stronger', level: 'inferred',
        text: '広西の六堡茶は渥堆（後発酵）の工程で香味が変化することが実測されています。後発酵の方向（土様）という一般傾向からの推測として、土を一段強めに示します（地域自体の香味の実測ではありません）。',
        sourceIds: ['huo-2024-liubao-wothei-process'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axr-fujian-white-inf',
    axis: 'region', entityId: 'fujian', kindCategory: 'white',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'inferred',
        text: '福建・柘栄の白茶は、リナロールとジメチルスルフィドによって他産地の白茶と判別できました。判別に効いた成分の一つリナロールは花様の香りの成分として知られます。その成分が産地を特徴づけることからの推測として、花様の根拠を補います（含量の方向や寄与の確定を示すものではないため、強さは変えません）。',
        sourceIds: ['wang-2026-zherong-white-tea-origin'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axr-guangdong-green-inf',
    axis: 'region', entityId: 'guangdong', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'toast', mode: 'add', level: 'inferred',
        text: '広東の客家炒青緑茶では、品種によって花香・炒米香（炒った米の香り）に分かれることが示されました。その品種自体はアプリ未収録ですが、炒青（釜炒り）という地域の製法と炒米香の類型からの推測として、香ばしい方向を弱く示します。',
        sourceIds: ['qiu-2023-hakka-chaoqing-green-tea'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axr-kagoshima-green-inf',
    axis: 'region', entityId: 'kagoshima', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'inferred',
        text: '鹿児島の奨励品種を煎茶で官能評価した研究では、県内の複数の品種（かなやみどり・はるみどり等）に「花のような」の記述子が有意に結びつきました。地域自体の単一の実測ではなく、地域の品種群の傾向からの推測として、花様の根拠を補います（強さは変えません）。',
        sourceIds: ['kinoshita-2015-kagoshima-cultivar-aroma'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'inferred',
        text: '同じ研究で、かなやみどり・はるみどり・おくみどりには「フルーティー」の記述子も有意に結びつきました。地域の品種群の傾向からの推測として、果実全般を弱く示します。',
        sourceIds: ['kinoshita-2015-kagoshima-cultivar-aroma'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axr-sichuan-cross-inf',
    axis: 'region', entityId: 'sichuan',
    noteEffects: [
      {
        noteId: 'rose', mode: 'add', level: 'inferred',
        text: '四川群体種の葉では、再構成・欠落・添加試験を含む検証でキー成分とされたゲラニオールが確認されています（検証は紅茶でのものです）。葉に由来する成分の香り（バラ様）を、分類を越えた読み替えの推測として弱く示します。',
        sourceIds: ['wang-2025-sichuan-gongfu-black-tea'],
      },
      {
        noteId: 'citrus', mode: 'add', level: 'inferred',
        text: '同じくキー成分とされたゲラニオール・リナロールの香り（柑橘様）です。葉由来の成分からの読み替え推測として、弱く示します。',
        sourceIds: ['wang-2025-sichuan-gongfu-black-tea'],
      },
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'inferred',
        text: '四川群体種が花果香の基盤になることは紅茶で検証されています。葉の特徴としての方向を、この分類への読み替え推測として、花様の根拠に補います（この分類での実測ではありません）。',
        sourceIds: ['wang-2025-sichuan-gongfu-black-tea'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axr-shandong-cross-inf',
    axis: 'region', entityId: 'shandong',
    noteEffects: [
      {
        noteId: 'green-vegetable', mode: 'add', level: 'inferred',
        text: '青島・嶗山の緑茶では、ジメチルスルフィドの OAV が突出して高いことが示されました（緑茶での実測）。この成分は葉に由来するため、分類を越えた読み替えの推測として、その香り（青い野菜）を弱く示します。',
        sourceIds: ['zhu-2021-laoshan-green-tea-odorants'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axr-darjeeling-black-inf',
    axis: 'region', entityId: 'darjeeling', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'rose', mode: 'add', level: 'inferred',
        text: 'セカンドフラッシュ・ダージリンの香りを扱った査読研究では、その特徴香気成分としてゲラニオールや2-フェニルエチルアルコールが選定されました。いずれもバラ様の香りの成分として知られます。その選定からの推論として、バラを弱く示す推測です（同研究の測定対象は香りの生理応答であり、香味への寄与の検証ではありません）。',
        sourceIds: ['ohno-yada-2021-sfdj-aroma'],
      },
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'inferred',
        text: '同じ研究で選定された特徴香気成分には、ホトリエノールなど花様の成分も含まれます。特徴成分の選定からの推測として、花様の根拠を補います（強さは変えません）。',
        sourceIds: ['ohno-yada-2021-sfdj-aroma'],
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
      {
        noteId: 'honey', mode: 'add', level: 'measured',
        text: '同じ AEDA で、β-ダマセノンも そうふう の煎茶の香りに強く影響する成分とされました。β-ダマセノンは蜂蜜様の香りの成分として知られます。強さの格付けはされていないため、弱いとして示します。',
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
      {
        noteId: 'hay', mode: 'add', level: 'inferred',
        text: '同じ香り緑茶の調査で、香駿のクマリン含量は やぶきた・さやまかおり より有意に高いことが示されました。クマリンは干し草様の甘い香りの成分として知られます。含量差が実測された成分の既知の香りからの推測として、干し草を弱く示します（香気発揚処理条件下の比較であり、寄与の直接実測はありません）。',
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
    id: 'axc-kanayamidori-green-inf',
    axis: 'cultivar', entityId: 'kanayamidori', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'milk', mode: 'add', level: 'inferred',
        text: '同じ官能評価で、かなやみどり は「クリーミー」の記述子にも有意な関連が示されました。その記述子を、最も近い収録ノート「ミルク」へ読み替えた推測として、ミルクを弱く示します（記述子とノートの対応づけ自体が解釈であり、成分の寄与を示すものではありません）。',
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
    id: 'axc-harumidori-parent-inf',
    axis: 'cultivar', entityId: 'harumidori', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'honey', mode: 'add', level: 'inferred',
        text: 'はるみどりは やぶきた を交配親に持ちます（育成記録）。親の やぶきた では煎茶の AEDA で β-ダマセノン（蜂蜜様の香りの成分）が主要な香気寄与成分の一つとされました。その交配親の実測に基づく推測として、蜂蜜を一段弱く（弱い）で示します（はるみどり自体の実測ではありません）。',
        sourceIds: ['mizukami-2012-sofu-yabukita-aeda', 'naro-tea-cultivar-list'],
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
    noteEffects: [
      {
        noteId: 'green-vegetable', mode: 'add', level: 'general',
        text: '埼玉県茶業研究所のブレンド設計報告では、ふくみどり の香気は「ややむれ臭や青臭が感じられ、爽快さがない」と記述されました。公的機関の記述に基づく一般的な知見として、その青臭さの方向を最も近い収録ノート「青い野菜」へ読み替え、弱く示します（記述の読み替えであり、成分の寄与を示すものではありません）。',
        sourceIds: ['sasaki-2018-green-tea-cultivar-blending'],
      },
    ],
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

  // ============================================================
  // お茶：品種の所見からの推測（第5弾・inferred のみ）
  // ============================================================
  {
    id: 'axc-tsuyuhikari-green-inf',
    axis: 'cultivar', entityId: 'tsuyuhikari', kindCategory: 'green',
    noteEffects: [],
    tasteEffects: [
      {
        key: 'umami', direction: 'stronger', level: 'inferred',
        text: 'つゆひかりは育成地試験で、やぶきた等に比べて全窒素・総遊離アミノ酸・テアニンが多く、育成時の官能概評も「旨味に富み温和」とされました。アミノ酸含量の方向と官能概評からの推測として、うま味を一段強めに示します（独立した官能検証による実測ではありません）。',
        sourceIds: ['oyanagizu-2003-tsuyuhikari'],
      },
      {
        key: 'astringent', direction: 'milder', level: 'inferred',
        text: '同じ育成地試験で、つゆひかりのタンニンは比較品種より少ないとされました。渋味の主因の含量の方向からの推測として、渋味を一段穏やかに示します。',
        sourceIds: ['oyanagizu-2003-tsuyuhikari'],
      },
    ],
  },
  {
    id: 'axc-seimei-green-inf',
    axis: 'cultivar', entityId: 'seimei', kindCategory: 'green',
    noteEffects: [],
    tasteEffects: [
      {
        key: 'umami', direction: 'stronger', level: 'inferred',
        text: 'せいめいの荒茶は、育成報告で やぶきた より全窒素・遊離アミノ酸が多いとされました。うま味に関わるアミノ酸含量の方向からの推測として、うま味を一段強めに示します（含有の知見であり、官能の実測ではありません）。',
        sourceIds: ['yoshida-2018-seimei'],
      },
      {
        key: 'astringent', direction: 'milder', level: 'inferred',
        text: '同じ育成報告で、せいめいのタンニンは さえみどり 並に少ないとされました。含量の方向からの推測として、渋味を一段穏やかに示します。',
        sourceIds: ['yoshida-2018-seimei'],
      },
    ],
  },
  {
    id: 'axc-seimei-parent-inf',
    axis: 'cultivar', entityId: 'seimei', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'chestnut', mode: 'emphasize', level: 'inferred',
        text: 'せいめいは さえみどり を交配親に持ちます（育成記録）。親の さえみどり の官能記述子「さつま芋（様）」を最も近い収録ノート「栗」へ読み替えた推測を、交配親の記録に基づく推測として、親側の効果より一段弱く（根拠を補うだけに留め）示します。もう一方の親 ふしゅん には香味の効果が無く、逆方向の競合はありません。',
        sourceIds: ['yoshida-2018-seimei', 'kinoshita-2015-kagoshima-cultivar-aroma'],
      },
      {
        noteId: 'honey', mode: 'add', level: 'inferred',
        text: 'せいめいの祖父母にあたる やぶきた（さえみどり の交配親）では、煎茶の AEDA で β-ダマセノン（蜂蜜様の香りの成分）が主要な香気寄与成分の一つとされました。祖先の実測に基づく推測として、蜂蜜を一段弱く（弱い）で示します（せいめい自体の実測ではありません）。',
        sourceIds: ['yoshida-2018-seimei', 'mizukami-2012-sofu-yabukita-aeda'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-saemidori-green-inf',
    axis: 'cultivar', entityId: 'saemidori', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'chestnut', mode: 'emphasize', shift: 'stronger', level: 'inferred',
        text: 'さえみどりは、鹿児島の奨励品種の官能評価で「さつま芋（様）」の記述子に有意な関連が示されました。その記述子を、最も近い収録ノート「栗」（ほっくりした甘い香り）へ読み替えた推測として、栗を一段強めに示します（記述子とノートの対応づけ自体が解釈であり、成分の寄与を示すものではありません）。',
        sourceIds: ['kinoshita-2015-kagoshima-cultivar-aroma'],
      },
    ],
    tasteEffects: [
      {
        key: 'sweet', direction: 'stronger', level: 'inferred',
        text: '同じ官能評価で、さえみどり は「甘さ」「なめらかな」の記述子にも有意な関連が示されました。品種所見自体の味の方向からの推測として、甘味を一段強めに示します（記述子レベルの知見であり、呈味成分の実測ではありません）。',
        sourceIds: ['kinoshita-2015-kagoshima-cultivar-aroma'],
      },
    ],
  },
  {
    id: 'axc-asatsuyu-green-inf',
    axis: 'cultivar', entityId: 'asatsuyu', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'chestnut', mode: 'emphasize', shift: 'stronger', level: 'inferred',
        text: 'あさつゆは、鹿児島の奨励品種の官能評価で「さつま芋（様）」「香りの強い」の記述子に有意な関連が示されました。「さつま芋（様）」を最も近い収録ノート「栗」へ読み替えた推測として、栗を一段強めに示します（対応づけ自体が解釈であり、成分の寄与を示すものではありません）。',
        sourceIds: ['kinoshita-2015-kagoshima-cultivar-aroma'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-yutakamidori-parent-inf',
    axis: 'cultivar', entityId: 'yutakamidori', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'chestnut', mode: 'emphasize', level: 'inferred',
        text: 'ゆたかみどりは あさつゆ の自殖系統です（育成記録）。親の あさつゆ の官能記述子「さつま芋（様）」を最も近い収録ノート「栗」へ読み替えた推測を、交配親（自殖親）の記録に基づく推測として、親側の効果より一段弱く（根拠を補うだけに留め）示します。ゆたかみどり自体の記述子（「独特な」「やさしい」）は方向を示さないため、この推測は親側の知見だけに基づきます。',
        sourceIds: ['kinoshita-2015-kagoshima-cultivar-aroma', 'naro-tea-cultivar-list'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-yutakamidori-green-inf',
    axis: 'cultivar', entityId: 'yutakamidori', kindCategory: 'green',
    noteEffects: [],
    tasteEffects: [
      {
        key: 'umami', direction: 'stronger', level: 'inferred',
        text: '南九州市の公式品種説明では、ゆたかみどり は被覆栽培と深蒸し製法を組み合わせることで「深いこくと旨味」が特徴になるとされます。この品種の代表的な栽培・製造のされ方に基づく推測として、うま味を一段強めに示します（被覆・深蒸し以外の製造では当てはまらない場合があります）。',
        sourceIds: ['minamikyushu-yutakamidori'],
      },
      {
        key: 'astringent', direction: 'stronger', level: 'inferred',
        text: '同じ公式説明では、ゆたかみどり の素性は「味に渋味が強く、やぶきたに比べるとやや旨味が乏しい」ともされます。品種自体の味の方向からの推測として、渋味も一段強めに示します（被覆・深蒸しでは渋味が和らぐ方向に働くため、製造条件によって印象は変わります）。',
        sourceIds: ['minamikyushu-yutakamidori'],
      },
    ],
  },
  {
    id: 'axc-hokumei-green-inf',
    axis: 'cultivar', entityId: 'hokumei', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'wood', mode: 'add', level: 'inferred',
        text: '日本茶業中央会の試飲調査（茶品種ハンドブック第6版に収録）では、ほくめい は「ウッディな中にスパイシーさが広がる香り」と記録されました。公的・業界団体の試飲記録に基づく推測として、その記述を最も近い収録ノート「木」へ読み替え、弱く示します（査読済みの官能実測ではありません）。',
        sourceIds: ['cha-hinshu-handbook-6'],
      },
      {
        noteId: 'warm-spice', mode: 'add', level: 'inferred',
        text: '同じ試飲記録の「スパイシーさ」の部分を、最も近い収録ノート「温かいスパイス」へ読み替えた推測として弱く示します。',
        sourceIds: ['cha-hinshu-handbook-6'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-meiryoku-parent-inf',
    axis: 'cultivar', entityId: 'meiryoku', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'inferred',
        text: 'めいりょくは やぶきた を交配親に持ちます（育成記録）。親の やぶきた では煎茶の AEDA でリナロールが主要な香気寄与成分の一つとされました。その交配親の実測に基づく推測として、花様の根拠を補います（めいりょく自体の実測ではなく、強さは変えません）。',
        sourceIds: ['mizukami-2012-sofu-yabukita-aeda', 'naro-1995-meiryoku'],
      },
      {
        noteId: 'honey', mode: 'add', level: 'inferred',
        text: '同じく交配親 やぶきた の AEDA で主要な香気寄与成分とされた β-ダマセノンの香り（蜂蜜様）です。交配親の記録に基づく推測として、一段弱く（弱い）で示します。',
        sourceIds: ['mizukami-2012-sofu-yabukita-aeda', 'naro-1995-meiryoku'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-fujikaori-green-inf',
    axis: 'cultivar', entityId: 'fujikaori', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'fruit-general', mode: 'add', level: 'inferred',
        text: '藤かおりにはアントラニル酸メチルを含むことが確認されています（検出）。この成分は兄弟品種 そうふう の煎茶の AEDA で果実様の香りに大きく影響することが示されており、成分データにも藤かおりでの検出が記録されています。検出された成分の既知の香りからの推論として、果実全般を弱く示す推測です（藤かおり自体での寄与の確定ではありません）。',
        sourceIds: ['sawai-2004-sofu-methyl-anthranilate'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-benihomare-black-inf',
    axis: 'cultivar', entityId: 'benihomare', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'rose', mode: 'add', level: 'inferred',
        text: 'べにほまれを紅茶に製造した比較（1967年の GC 分析）では、べにほまれは β-フェニルエチルアルコール（2-フェニルエタノール）に富むことが示されました。この成分の既知の香り（バラ様）からの推論として、バラを弱く示す推測です（相対量の比較であり、現代的基準の寄与評価ではありません）。',
        sourceIds: ['saijo-kuwahara-1967-black-tea-aroma'],
      },
      {
        noteId: 'green-leaf', mode: 'add', level: 'inferred',
        text: '同じ1967年の GC 比較では、べにほまれは緑茶用品種 みよし と比べて青葉臭成分も多いとされました。検出された成分群の既知の香りの方向からの推論として、青草・若葉を弱く示す推測です（相対量の比較であり、現代的基準の寄与評価ではありません）。',
        sourceIds: ['saijo-kuwahara-1967-black-tea-aroma'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-benifuuki-parent-inf',
    axis: 'cultivar', entityId: 'benifuuki', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'rose', mode: 'add', level: 'inferred',
        text: 'べにふうきは べにほまれ を交配親に持ちます（育成記録）。親の べにほまれ は紅茶で β-フェニルエチルアルコールに富むことが示されており、その成分の既知の香り（バラ様）を、交配親の記録に基づく推測として一段弱く（弱い）で示します。べにふうき自体の所見（EGCG3″Me の含有）は香味の方向を示すものではないため、この推測は親側の知見だけに基づきます。',
        sourceIds: ['saijo-kuwahara-1967-black-tea-aroma', 'naro-tea-cultivar-list'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-benifuuki-oolong-inf',
    axis: 'cultivar', entityId: 'benifuuki', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'rose', mode: 'add', level: 'inferred',
        text: '農研機構の品種特性では、べにふうき は「軽く萎凋するとダージリン様のフレーバーが発揚する」とされます。半発酵茶は萎凋を含む製法であり、そのダージリン様の方向を、ダージリン茶の特徴香の読み替えとして最も近い収録ノート「バラ」で弱く示す推測です（べにふうきの半発酵茶での官能実測ではありません）。',
        sourceIds: ['naro-tea-cultivar-list'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-qingxin-oolong-inf',
    axis: 'cultivar', entityId: 'qingxin-oolong', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'inferred',
        text: '青心烏龍の市販試料では、GC-O と再構成・除去実験で主要な香気活性成分が検証され、未焙煎〜中焙煎ではリナロール等の花様の成分が主体でした。焙煎度で主体が変わる知見であるため、品種そのものの方向としては実測ではなく推測として、花様の根拠を補います（重焙煎では焙煎香が主体になります。強さは変えません）。',
        sourceIds: ['lan-2022-qingxin-roasting'],
      },
      {
        noteId: 'honey', mode: 'add', level: 'inferred',
        text: '同じ検証で主要な香気活性成分の一つとされたベンゼンアセトアルデヒド（フェニルアセトアルデヒド）は、蜂蜜様の香りの成分として知られます。その成分からの推論として、蜂蜜の根拠を補う推測です。',
        sourceIds: ['lan-2022-qingxin-roasting'],
      },
      {
        noteId: 'citrus', mode: 'add', level: 'inferred',
        text: '同じ検証で主要な香気活性成分の一つとされたリナロールは、成分データでは柑橘様の香りにも結びつけられています。確認された成分の既知の香りからの推論として、柑橘を弱く示す推測です。',
        sourceIds: ['lan-2022-qingxin-roasting'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-jinxuan-oolong-inf',
    axis: 'cultivar', entityId: 'jinxuan', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'milk', mode: 'add', level: 'inferred',
        text: '金萱の烏龍茶については、ミルク様の香りに関連する成分が製程中にどう動くかという形成機構の研究があります。ミルク様の香りがこの品種の烏龍茶の特徴として研究対象になっていることからの推測として、ミルクを弱く示します（成分の動態の知見であり、寄与の確定ではありません）。',
        sourceIds: ['wang-2025-jinxuan-milk-aroma'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-jinxuan-black-inf',
    axis: 'cultivar', entityId: 'jinxuan', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'fruit-general', mode: 'emphasize', shift: 'stronger', level: 'inferred',
        text: '金萱のミルク様の香りは半発酵製法と結びついた特徴として研究されていますが、販売事業者の金萱紅茶の製品説明では、紅茶に仕上げた金萱は「金萱特有の蜜果香（蜂蜜と果実の香り）」を持つとされます。参考情報に基づく読み替えの推測として、紅茶では果実全般を一段強めに示します（査読済みの官能実測ではありません）。',
        sourceIds: ['ttch-jinxuan-black-tea'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-hongyu-black-inf',
    axis: 'cultivar', entityId: 'hongyu', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'inferred',
        text: '紅玉（台茶18号）の紅茶を3季にわたり分析した学位論文では、リナロールとサリチル酸メチルが最も豊富な揮発成分であり、著者は閾値の低さから両者を「最も重要な寄与成分と推測」と述べました。著者自身の推測に基づく知見であるため、実測ではなく推測として、花様の根拠を補います（強さは変えません）。',
        sourceIds: ['peng-2022-ttesh18-thesis'],
      },
      {
        noteId: 'herb', mode: 'add', level: 'inferred',
        text: '同じ学位論文で最も豊富とされたサリチル酸メチルは、成分データでは爽やかでミント様の香りの成分として記録されています。その成分からの推論として、ハーブを弱く示す推測です。',
        sourceIds: ['peng-2022-ttesh18-thesis'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-hongyun-black-inf',
    axis: 'cultivar', entityId: 'hongyun', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'white-flower', mode: 'add', level: 'inferred',
        text: '台湾・茶及飲料作物改良場（TBRS）の公式品種解説では、紅韻（台茶21号）の紅茶は柑橘類の花に似た花香を持ち、濃い花果香の高香品種とされます。公的機関の解説に基づく推測として、その花香の方向を最も近い収録ノート「白い花」へ読み替え、弱く示します（品種単独の査読済み香気実測ではありません）。',
        sourceIds: ['tbrs-tea-breeding-cultivars'],
      },
    ],
    tasteEffects: [],
  },

  // ============================================================
  // お茶：第7弾の追加（文献調査の反映＋分類を越えた読み替え）
  // ============================================================
  {
    id: 'ax-zhejiang-green',
    axis: 'region', entityId: 'zhejiang', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'orchid', mode: 'add', level: 'measured',
        text: '西湖龍井の試料の OAV 評価では、β-イオノンが高い OAV（27.14）を示しました。β-イオノンは蘭・すみれ様の香りの成分として知られます。龍井茶のキー成分を再構成まで含めて特定した研究もあるため、実測として弱く示します。',
        sourceIds: ['hu-2022-tea-aroma-oav-splitting', 'wang-2020-longjing-key-odorants'],
      },
      {
        noteId: 'rose', mode: 'emphasize', level: 'measured',
        text: '龍井茶では SBSE＋GC-O＋OAV＋再構成で14種のキー成分が特定され、ゲラニオールが含まれました。ゲラニオールはバラ様の香りの成分です。分類プロファイルのバラは、この産地の実測でも裏付けられます。',
        sourceIds: ['wang-2020-longjing-key-odorants'],
      },
      {
        noteId: 'toast', mode: 'emphasize', level: 'measured',
        text: '同じキー成分群には、焙煎様の香りのピラジン（2-エチル-3,5-ジメチルピラジン）が含まれ、龍井茶の OAV 研究でも高い OAV が報告されています。分類プロファイルの香ばしさは、この産地の実測でも裏付けられます。',
        sourceIds: ['wang-2020-longjing-key-odorants', 'hu-2022-tea-aroma-oav-splitting'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-assam-black',
    axis: 'region', entityId: 'assam', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'honey', mode: 'emphasize', level: 'measured',
        text: '世界4大紅茶の GC×GC-TOFMS＋GC-O 比較では、フェニルアセトアルデヒド（蜂蜜様の香りの成分）がアッサムを含む全試料で強い香気強度を示しました。分類プロファイルの蜂蜜は、この産地を含む実測でも裏付けられます。',
        sourceIds: ['kang-2019-four-black-teas'],
      },
      {
        noteId: 'malt', mode: 'add', level: 'general',
        text: 'アッサム茶は麦芽様の香りで知られると先行研究で特徴づけられており、アッサムのヘッドスペースでは麦芽様の香りの成分 2-メチルブタナールが高水準で検出されています。特徴づけと検出の組み合わせに基づく一般的な知見として、麦芽を弱く示します（アッサム単独での寄与の確定ではありません）。',
        sourceIds: ['kang-2019-four-black-teas', 'ebisawa-2007-black-tea-origins-headspace'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-uva-black',
    axis: 'region', entityId: 'uva', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'herb', mode: 'add', intensity: 'normal', level: 'measured',
        text: '世界4大紅茶の比較では、セイロン茶でサリチル酸メチルが最も決定的な香気成分とされ、ウバのヘッドスペースでもサリチル酸メチルが高水準で検出されています。サリチル酸メチルは爽やかなハーブ様（ミント様）の香りの成分です。GC-O で最も強い香気強度を示した成分群の一つであるため、弱いではなく普通として示します。',
        sourceIds: ['kang-2019-four-black-teas', 'ebisawa-2007-black-tea-origins-headspace'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-nuwara-eliya-black',
    axis: 'region', entityId: 'nuwara-eliya', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'general',
        text: 'ヌワラエリヤの主要なヘッドスペース成分の筆頭はリナロールでした。リナロールは花様の香りの成分として知られます。検出・含量に基づく一般的な知見として、分類プロファイルの花様の根拠を補います。',
        sourceIds: ['ebisawa-2007-black-tea-origins-headspace'],
      },
      {
        noteId: 'green-leaf', mode: 'emphasize', level: 'general',
        text: '同じ比較で、(Z)-3-ヘキセノール（青葉様の香りの成分）もヌワラエリヤの主要成分の一つでした。一般的な知見として、分類プロファイルの青葉の根拠を補います。',
        sourceIds: ['ebisawa-2007-black-tea-origins-headspace'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-dimbula-black-inf',
    axis: 'region', entityId: 'dimbula', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'herb', mode: 'add', level: 'inferred',
        text: 'セイロン茶全体では、サリチル酸メチルが最も決定的な香気成分とされました（世界4大紅茶の比較）。ディンブラ単独の寄与実測はないため、セイロンという上位カテゴリーの特徴を地域へ読み替えた推測として、ハーブ（爽やかなミント様）を弱く示します。',
        sourceIds: ['kang-2019-four-black-teas'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-jiangsu-green-inf',
    axis: 'region', entityId: 'jiangsu', kindCategory: 'green',
    noteEffects: [
      {
        noteId: 'hay', mode: 'add', level: 'inferred',
        text: '碧螺春では、中国緑茶3銘茶の AEDA 比較で、クマリンが試料間で偏って多い成分として示されました。クマリンは干し草様の甘い香りの成分として知られます。含量差が実測された成分の既知の香りからの推測として、干し草を弱く示します（寄与の直接実測はありません）。',
        sourceIds: ['baba-2014-chinese-green-tea-aeda'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'ax-qingxin-damao-oolong',
    axis: 'cultivar', entityId: 'qingxin-damao', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'rose', mode: 'add', intensity: 'normal', level: 'general',
        text: '東方美人茶の加工中メタボロミクスでは、酵素反応段階でゲラニオール（バラ様の香りの成分）が約103倍に増加しました。台湾の公的機関（茶及飲料作物改良場）の品種解説では、青心大冇は椪風茶（東方美人茶）の品質が最良とされる品種の一つです。製品レベルの実測と公的な品種対応づけに基づく一般的な知見として、増加の大きさを踏まえ、バラを弱いではなく普通として示します。',
        sourceIds: ['fu-2022-oriental-beauty-processing'],
      },
      {
        noteId: 'fruit-general', mode: 'emphasize', level: 'general',
        text: '同じ研究で、東方美人茶は果実様の香りと甘い味で知られることが整理されました。一般的な知見として、分類プロファイルの果実全般の根拠を補います。',
        sourceIds: ['fu-2022-oriental-beauty-processing'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-samidori-green-inf',
    axis: 'cultivar', entityId: 'samidori', kindCategory: 'green',
    noteEffects: [],
    tasteEffects: [
      {
        key: 'umami', direction: 'stronger', level: 'inferred',
        text: 'さみどりを育てた宇治の茶生産者（古川製茶）の品種解説では、さみどりは「上品で穏やかなうまみが特徴」とされます。生産者の記述（参考情報）に基づく仮説として、うま味を一段強めに示す推測です（査読済みの官能実測ではありません）。',
        sourceIds: ['furukawa-seicha-variety-guide'],
      },
    ],
  },
  {
    id: 'axc-av2-black-inf',
    axis: 'cultivar', entityId: 'av2', kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'inferred',
        text: 'ダージリンの茶園 Gopaldhara の品種解説では、AV2 は花様・果実様・蜂蜜様のノートで知られるとされます。生産者の記述（参考情報）に基づく仮説として、分類プロファイルの花様の根拠を補う推測です（査読済みの官能実測ではありません）。',
        sourceIds: ['gopaldhara-cultivar-guide'],
      },
      {
        noteId: 'honey', mode: 'add', level: 'inferred',
        text: '同じ茶園の解説で挙げられた蜂蜜様のノートです。参考情報に基づく仮説として、蜂蜜を弱く示す推測です。',
        sourceIds: ['gopaldhara-cultivar-guide'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'inferred',
        text: '同じ茶園の解説で挙げられた果実様のノート（セカンドフラッシュではムスカテルの特徴）です。参考情報に基づく仮説として、果実全般を弱く示す推測です。',
        sourceIds: ['gopaldhara-cultivar-guide'],
      },
      {
        noteId: 'dried-fruit', mode: 'add', level: 'inferred',
        text: '同じ茶園の解説にある「セカンドフラッシュではムスカテルの特徴」という記述に基づきます。ムスカテルはダージリン茶でブドウ・レーズン様と表現される特徴香であり、最も近い収録ノート「ドライフルーツ」へ読み替えた推測として弱く示します（参考情報に基づく仮説です）。',
        sourceIds: ['gopaldhara-cultivar-guide'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-av2-oolong-inf',
    axis: 'cultivar', entityId: 'av2', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'dried-fruit', mode: 'add', level: 'inferred',
        text: 'ダージリンの茶園 Gopaldhara の品種解説では、AV2 はセカンドフラッシュの紅茶でムスカテルの特徴を示すとされます。ムスカテルはブドウ・レーズン様と表現される特徴香であり、同じ品種の半発酵茶への読み替え推測として、最も近い収録ノート「ドライフルーツ」を弱く示します（参考情報に基づく仮説であり、半発酵茶での実測ではありません）。',
        sourceIds: ['gopaldhara-cultivar-guide'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-sijichun-oolong-inf',
    axis: 'cultivar', entityId: 'sijichun', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'add', level: 'inferred',
        text: '小売事業者の品種解説では、四季春の茶は「強い花様・果実様の香り」を持つとされます。参考情報に基づく仮説として、花様を弱く示す推測です（査読済みの官能実測ではありません）。',
        sourceIds: ['english-tea-store-taiwan-cultivars'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'inferred',
        text: '同じ解説で挙げられた果実様の香りです。参考情報に基づく仮説として、果実全般を弱く示す推測です。',
        sourceIds: ['english-tea-store-taiwan-cultivars'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-tsuiyu-oolong-inf',
    axis: 'cultivar', entityId: 'tsuiyu', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'orchid', mode: 'add', level: 'inferred',
        text: '小売事業者の品種解説では、翠玉の茶は「独特で強い花様・蘭様の香り」を持つとされます。参考情報に基づく仮説として、蘭・すみれ様を弱く示す推測です（査読済みの官能実測ではありません）。',
        sourceIds: ['english-tea-store-taiwan-cultivars'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axc-soufu-oolong-inf',
    axis: 'cultivar', entityId: 'soufu', kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'fruit-general', mode: 'emphasize', shift: 'stronger', level: 'inferred',
        text: 'そうふう の品種特異的な香りの原因成分アントラニル酸メチルは、葉に含まれる揮発成分であり、煎茶の AEDA で果実様の香りに大きく影響するとされました。農研機構の育成時評価でも そうふう は「半発酵茶として高品質で特に香気に優れる」とされています。葉レベルの成分の知見を、半発酵茶（そうふう は緑茶・半発酵茶の兼用品種として登録）へ読み替えた推測として、果実全般を一段強めに示します（烏龍茶での寄与の実測ではありません）。',
        sourceIds: ['sawai-2004-sofu-methyl-anthranilate', 'mizukami-2012-sofu-yabukita-aeda'],
      },
    ],
    tasteEffects: [],
  },
]

// ============================================================
// チョコ：系統・産地の所見からの変換
// （産地の所見は、同じ産地内での条件による変動や組成の知見が中心で、
//  measured / general としての変換ルールは置かない。第5弾で、足がかりのある
//  ものに限って inferred（推測）のルールを産地にも置いた。
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

/** クリオロのリカー官能ホイールの記述子を、足がかり経由で inferred に落として
 * 鏡写しする効果群（第5弾）。lead は「どの足がかりで読み替えるか」の一文。 */
const crioMirrorEffects = (lead: string, sourceIds: string[]): AxisNoteEffect[] => [
  ...CRIO_DESCRIPTORS.map(({ noteId, name }) => ({
    noteId, mode: 'add' as const, level: 'inferred' as const,
    text: `${lead}ベネズエラの在来クリオロ等のリカーの官能ホイールに、典型的な記述子として「${name}」が挙げられました。対象自体の実測ではないため、推測として弱く示します。`,
    sourceIds,
  })),
  {
    noteId: 'caramel', mode: 'emphasize' as const, level: 'inferred' as const,
    text: `${lead}同じ官能ホイールに「キャラメル」も典型的な記述子として挙げられました。推測として根拠を補います（強さは変えません）。`,
    sourceIds,
  },
]

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
    id: 'axl-criollo-taste-inf',
    axis: 'lineage', entityId: 'trad-criollo', lineageLayer: 'traditional', kinds: ['dark', 'milk', 'ruby'],
    noteEffects: [],
    tasteEffects: [
      {
        key: 'bitter', direction: 'milder', level: 'inferred',
        text: '伝統的タイプ区分の種子フェノール組成を比較した研究では、発酵・乾燥中のカテキン類の減少が Criollo 試料で他より強く、著者らはこれが「クリオロチョコレートのマイルドな香味の一因かもしれない」と解釈しました。著者らの解釈に基づく推測として、苦味を一段穏やかに示します（官能の実測ではありません）。',
        sourceIds: ['elwers-2009-cocoa-phenolics'],
      },
      {
        key: 'astringent', direction: 'milder', level: 'inferred',
        text: '同じ解釈に基づく推測として、渋味も一段穏やかに示します。なお同研究では、総ポリフェノール量とエピカテキン量自体には遺伝的に決まる差は見出されなかったため、穏やかさの方向は著者らの解釈の範囲に限ります。',
        sourceIds: ['elwers-2009-cocoa-phenolics'],
      },
    ],
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

  // ============================================================
  // チョコ：産地・系統の所見からの推測（第5弾・inferred のみ）
  // ============================================================
  {
    id: 'axo-venezuela-dark-inf',
    axis: 'origin', entityId: 'venezuela', kinds: ['dark', 'milk', 'ruby'],
    noteEffects: crioMirrorEffects('ベネズエラ産の在来クリオロ等のリカーについての知見に基づく読み替えです。ただし現在のベネズエラの栽培集団は遺伝的にクリオロとフォラステロの混合であることが実測されており、これは産地全体の実測プロファイルではありません。', ['ramos-2013-venezuela-criollo-liquor']),
    tasteEffects: [],
  },
  {
    id: 'axo-madagascar-dark-inf',
    axis: 'origin', entityId: 'madagascar', kinds: ['dark'],
    noteEffects: [
      {
        noteId: 'malt', mode: 'add', level: 'inferred',
        text: 'マダガスカル産と表示された単一産地チョコレート1製品の揮発成分の実測では、ストレッカーアルデヒド類が比較試料の中で最も高い水準でした。その代表成分である3-メチルブタナールは、麦芽様の香りの成分として知られます。単一製品の組成実測からの推論として、麦芽を弱く示す推測です（産地全体の香味を示すものではありません）。',
        sourceIds: ['godocikova-2020-madagascar-volatiles'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axl-trinitario-dark-inf',
    axis: 'lineage', entityId: 'trad-trinitario', lineageLayer: 'traditional', kinds: ['dark', 'milk', 'ruby'],
    noteEffects: crioMirrorEffects('トリニタリオはクリオロとフォラステロの交雑に由来する集団であることが記録されています。香味の方向が文献で示されているのはクリオロ側のみのため、交配親（祖先）の記録に基づく推測として、クリオロ側の記述子だけを合成します（フォラステロ側には香味の知見がありません）。', ['ramos-2013-venezuela-criollo-liquor', 'motamayor-2008-cacao-populations']),
    tasteEffects: [],
  },
  {
    id: 'axl-trinitario-fruit-inf',
    axis: 'lineage', entityId: 'trad-trinitario', lineageLayer: 'traditional', kinds: ['dark', 'milk', 'ruby'],
    noteEffects: [
      {
        noteId: 'fruit-general', mode: 'add', level: 'inferred',
        text: 'トリニタリオを構成する代表的クローン ICS-95 は、コロンビアの農園試料をクローン別に比較した査読研究で、「新鮮な果実」を含む最良の官能属性を示した群に含まれました。構成クローンの知見を集団へ読み替えた推測として、果実全般を弱く示します（トリニタリオ集団自体の官能実測ではありません）。',
        sourceIds: ['ramon-2023-colombia-cacao-clones'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axl-gencriollo-dark-inf',
    axis: 'lineage', entityId: 'gen-criollo', lineageLayer: 'genetic', kinds: ['dark', 'milk', 'ruby'],
    noteEffects: crioMirrorEffects('遺伝集団クリオロは、伝統的分類のクリオロと概ね対応することが両エンティティに記録されています。その対応に基づき、伝統的分類側の記述子を読み替えた推測です（遺伝集団そのものの香味実測ではありません）。', ['ramos-2013-venezuela-criollo-liquor']),
    tasteEffects: [],
  },
  {
    id: 'axl-amelonado-inf',
    axis: 'lineage', entityId: 'gen-amelonado', lineageLayer: 'genetic', kinds: ['dark'],
    noteEffects: [
      {
        noteId: 'cacao', mode: 'emphasize', shift: 'stronger', level: 'inferred',
        text: 'カカオ香味の総説では、西アフリカのフォラステロは「強い基本的なカカオ感」を持つ標準的なカカオ香味の源と特徴づけられました。その西アフリカの植栽は主に Amelonado 型（本集団）であると遺伝集団の研究に記録されています。総説の特徴づけを集団へ読み替えた推測として、カカオを一段強めに示します（集団自体の官能実測ではありません）。',
        sourceIds: ['afoakwa-2008-cocoa-flavour-review', 'motamayor-2008-cacao-populations'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'inferred',
        text: '同じ総説の起源別表で、西アフリカのフォラステロには果実の含み（fruity notes）が特徴として挙げられました。同様の読み替え推測として、果実全般を弱く示します。',
        sourceIds: ['afoakwa-2008-cocoa-flavour-review'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axl-amelonado-xkind-inf',
    axis: 'lineage', entityId: 'gen-amelonado', lineageLayer: 'genetic', kinds: ['milk', 'ruby'],
    noteEffects: [
      {
        noteId: 'cacao', mode: 'add', level: 'inferred',
        text: 'カカオ香味の総説では、西アフリカのフォラステロは「強い基本的なカカオ感」を持つ標準的なカカオ香味の源と特徴づけられ、その西アフリカの植栽は主に Amelonado 型（本集団）であると記録されています。ミルク／ルビーの土台にはカカオのノートが無いため、総説の特徴づけを集団へ読み替えた推測として、カカオを弱く追加します（集団自体の官能実測ではありません）。',
        sourceIds: ['afoakwa-2008-cocoa-flavour-review', 'motamayor-2008-cacao-populations'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'inferred',
        text: '同じ総説の起源別表で、西アフリカのフォラステロには果実の含み（fruity notes）が特徴として挙げられました。同様の読み替え推測として、果実全般を弱く示します。',
        sourceIds: ['afoakwa-2008-cocoa-flavour-review'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axl-contamana-inf',
    axis: 'lineage', entityId: 'gen-contamana', lineageLayer: 'genetic', kinds: ['dark', 'milk', 'ruby', 'blond'],
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'add', level: 'inferred',
        text: 'コンタマナ集団そのものの香味実測は未確認です。同集団に属する個別遺伝子型 SCA6 では、果実パルプと種子の GC-MS 実測でモノテルペン類（β-リナロール等）が特徴的でした。リナロールは花様の香りの成分として知られます。集団に属する1遺伝子型の実測からの読み替え推測として、花様を弱く示します（集団自体の実測ではありません）。',
        sourceIds: ['kadow-2013-fine-flavour-genotypes', 'motamayor-2008-cacao-populations'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axl-ics95-milk-inf',
    axis: 'lineage', entityId: 'ics-95', lineageLayer: 'clone', kinds: ['milk'],
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'add', level: 'inferred',
        text: 'ICS-95 は、コロンビアの農園試料をクローン別に比較した研究で、最良の官能属性（花様・甘味・酸味・新鮮な果実）を示した群に含まれました。その官能はダークチョコレートとしての評価であり、ミルクチョコレートへの読み替えの推測として、花様を弱く示します。',
        sourceIds: ['ramon-2023-colombia-cacao-clones'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'inferred',
        text: '同じ研究で挙げられた「新鮮な果実」の記述子を、ミルクチョコレートへの読み替えの推測として弱く示します。',
        sourceIds: ['ramon-2023-colombia-cacao-clones'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axl-guiana-milk-inf',
    axis: 'lineage', entityId: 'gen-guiana', lineageLayer: 'genetic', kinds: ['milk'],
    noteEffects: [
      {
        noteId: 'cacao', mode: 'add', level: 'inferred',
        text: 'フランス領ギアナ野生集団由来のクローン群では、チョコレート官能でカカオフレーバーが産業リファレンスより優れていたと報告されています（ダークチョコレートでの知見）。ミルクチョコレートの土台にはカカオのノートが無いため、その方向を読み替えの推測として弱く追加します。',
        sourceIds: ['lachenaud-2015-guiana-wild-cacao'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axl-iquitos-inf',
    axis: 'lineage', entityId: 'gen-iquitos', lineageLayer: 'genetic', kinds: ['dark', 'milk', 'ruby', 'blond'],
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'add', level: 'inferred',
        text: 'イキトス集団そのものの香味実測は未確認です。同クラスターの54%を占める IMC 系列のクローン IMC-67 では、発酵豆でリナロール（花様の香りの成分）が供試遺伝子型の中で最も高濃度でした。同じ遺伝グループのクローンの実測からの推測として、花様を弱く示します（集団自体の実測ではありません）。',
        sourceIds: ['collin-2023-cocoa-bean-genotypes-aroma', 'motamayor-2008-cacao-populations'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axl-imc67-inf',
    axis: 'lineage', entityId: 'imc-67', lineageLayer: 'clone', kinds: ['dark', 'milk', 'ruby', 'blond'],
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'add', level: 'inferred',
        text: 'ブラジル産の発酵済み未焙煎豆の判別分析で、IMC-67 のリナロールは供試5遺伝子型の中で最も高濃度でした。リナロールは花様の香りの成分として知られます。確認された成分の既知の香りからの推論として、花様を弱く示す推測です（官能による寄与の実証ではありません）。',
        sourceIds: ['collin-2023-cocoa-bean-genotypes-aroma'],
      },
      {
        noteId: 'citrus', mode: 'add', level: 'inferred',
        text: '同じ実測で最も高濃度だったリナロールは、成分データでは柑橘様の香りにも結びつけられています。確認された成分の既知の香りからの推論として、柑橘を弱く示す推測です。',
        sourceIds: ['collin-2023-cocoa-bean-genotypes-aroma'],
      },
    ],
    tasteEffects: [],
  },

  // ============================================================
  // チョコ：第7弾の追加（産地の特徴づけの推測反映＋種類を越えた読み替え）
  // 産地ルールは既存の作法どおり inferred のみ。
  // ============================================================
  {
    id: 'axo-ghana-inf',
    axis: 'origin', entityId: 'ghana',
    noteEffects: [
      {
        noteId: 'cacao', mode: 'emphasize', shift: 'stronger', level: 'inferred',
        text: 'カカオ香味の総説では、ガーナのフォラステロは「強い基本的なカカオ感」を持つと整理され（起源別表で強さ5）、西アフリカ群は「標準（ベンチマーク）カカオ香味」の源と特徴づけられました。総説による特徴づけを産地へ適用した推測として、カカオを一段強めに示します（ガーナ産単独の官能実測ではありません）。',
        sourceIds: ['afoakwa-2008-cocoa-flavour-review'],
      },
      {
        noteId: 'nut-general', mode: 'emphasize', level: 'inferred',
        text: '同じ総説で、西アフリカ群には控えめ〜中程度のナッツの含みがあるとされました。特徴づけに基づく推測として、ナッツ全般の根拠を補います（強さは変えません）。',
        sourceIds: ['afoakwa-2008-cocoa-flavour-review'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'inferred',
        text: '同じ総説の起源別表で、ガーナのフォラステロには果実の含み（fruity notes）が特徴として挙げられました。特徴づけに基づく推測として、果実全般を弱く示します。',
        sourceIds: ['afoakwa-2008-cocoa-flavour-review'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axo-cotedivoire-inf',
    axis: 'origin', entityId: 'cote-divoire',
    noteEffects: [
      {
        noteId: 'cacao', mode: 'emphasize', level: 'inferred',
        text: 'カカオ香味の総説では、西アフリカ群（ガーナ・コートジボワール・ナイジェリア）は際立つカカオの個性を持つ「標準（ベンチマーク）カカオ香味」の源と特徴づけられました。群としての特徴づけを産地へ適用した推測として、分類プロファイルのカカオの根拠を補います。なお、統一条件で比較した実測では産地による違いは見られておらず、コートジボワール単独の個性として確定したものではありません。',
        sourceIds: ['afoakwa-2008-cocoa-flavour-review'],
      },
      {
        noteId: 'nut-general', mode: 'emphasize', level: 'inferred',
        text: '同じ総説で、西アフリカ群には控えめ〜中程度のナッツの含みがあるとされました。群の特徴づけに基づく推測として、ナッツ全般の根拠を補います（強さは変えません）。',
        sourceIds: ['afoakwa-2008-cocoa-flavour-review'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axo-peru-inf',
    axis: 'origin', entityId: 'peru',
    noteEffects: [],
    tasteEffects: [
      {
        key: 'bitter', direction: 'milder', level: 'inferred',
        text: 'ペルーのクイジャバンバ産（チュンチョ）とバグア産の比較実測では、バグアが苦・渋・酸・果実のノートで区別され、チュンチョは脂肪が高くテオブロミンが低い側でした。チュンチョについては苦味・酸味・渋味が低いファインフレーバー特性も報告されています。地域限定の実測の方向をペルー全体へ広げた推測として、苦味を一段穏やかに示します（ペルー全体の実測ではありません）。',
        sourceIds: ['mejia-2021-peru-native-cocoa', 'eskes-2018-chuncho-fine-flavour'],
      },
      {
        key: 'astringent', direction: 'milder', level: 'inferred',
        text: '同じ比較実測とチュンチョの特性報告に基づく推測として、渋味を一段穏やかに示します。',
        sourceIds: ['mejia-2021-peru-native-cocoa', 'eskes-2018-chuncho-fine-flavour'],
      },
    ],
  },
  {
    id: 'axo-dominican-dark-inf',
    axis: 'origin', entityId: 'dominican-republic', kinds: ['dark', 'milk'],
    noteEffects: [
      {
        noteId: 'dried-fruit', mode: 'add', level: 'inferred',
        text: 'ドミニカ共和国産トリニタリオのダークチョコレート54試料の訓練パネル評価では、ドライフルーツが評価属性の一つとして挙げられました。ただし同研究は、同じ産地でも発酵の進め方で香味が大きく変わることも示しています。属性群からの統合推測として、ドライフルーツを弱く示します（ミルクチョコレートへの適用は読み替えです。単一の方向として未検証です）。',
        sourceIds: ['guzman-penella-2023-dominican-cacao'],
      },
      {
        noteId: 'wood', mode: 'add', level: 'inferred',
        text: '同じパネル評価で挙げられた木質の属性です。同様に、属性群からの統合推測として木を弱く示します。',
        sourceIds: ['guzman-penella-2023-dominican-cacao'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axo-ecuador-inf',
    axis: 'origin', entityId: 'ecuador', kinds: ['dark', 'milk', 'ruby'],
    noteEffects: [
      {
        noteId: 'white-flower', mode: 'add', level: 'inferred',
        text: 'エクアドルの「現代 Nacional」栽培集団では、花ノートに関わる生合成経路が同定されています。これは産地そのものではなく栽培集団レベルの実測であり、伝統的 Nacional の花様の知見とも整合します。産地への読み替えの推測として、白い花を弱く示します。',
        sourceIds: ['colonges-2021-nacional-floral'],
      },
      {
        noteId: 'floral-general', mode: 'emphasize', level: 'inferred',
        text: '同じ栽培集団レベルの知見に基づく推測として、分類プロファイルの花様の根拠を補います（強さは変えません）。',
        sourceIds: ['colonges-2021-nacional-floral'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axl-ics95-xkind-inf',
    axis: 'lineage', entityId: 'ics-95', lineageLayer: 'clone', kinds: ['ruby', 'blond'],
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'add', level: 'inferred',
        text: 'ICS-95 は、コロンビアの農園試料をクローン別に比較した研究で、最良の官能属性（花様・甘味・酸味・新鮮な果実）を示した群に含まれました。その官能はダークチョコレートとしての評価であり、ルビー／ブロンドへの読み替えの推測として、花様を弱く示します。',
        sourceIds: ['ramon-2023-colombia-cacao-clones'],
      },
      {
        noteId: 'fruit-general', mode: 'add', level: 'inferred',
        text: '同じ研究で挙げられた「新鮮な果実」の記述子を、種類を越えた読み替えの推測として弱く示します。',
        sourceIds: ['ramon-2023-colombia-cacao-clones'],
      },
    ],
    tasteEffects: [],
  },
  {
    id: 'axl-criollo-xkind-inf',
    axis: 'lineage', entityId: 'trad-criollo', lineageLayer: 'traditional', kinds: ['milk', 'ruby'],
    noteEffects: crioMirrorEffects('伝統的分類クリオロのリカー官能ホイールの記述子を、ダークチョコレート以外（ミルク／ルビー）へ読み替えた推測です。', ['ramos-2013-venezuela-criollo-liquor']),
    tasteEffects: [],
  },
  {
    id: 'axl-guiana-ruby-inf',
    axis: 'lineage', entityId: 'gen-guiana', lineageLayer: 'genetic', kinds: ['ruby'],
    noteEffects: [
      {
        noteId: 'cacao', mode: 'add', level: 'inferred',
        text: 'フランス領ギアナ野生集団由来のクローン群では、チョコレート官能でカカオフレーバーが産業リファレンスより優れていたと報告されています（ダークチョコレートでの知見）。ルビーの土台にはカカオのノートが無いため、その方向を読み替えの推測として弱く追加します。',
        sourceIds: ['lachenaud-2015-guiana-wild-cacao'],
      },
    ],
    tasteEffects: [],
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
    text: '「長崎」の所見は、品評会出品の緑茶についての総合評価と、評価と結びつく成分群の分析です。緑茶では、成分群（アミノ酸）からの推測としてうま味の方向を反映しています。この分類については、香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'region', entityId: 'murakami', category: 'discrimination-only',
    text: '「村上」の所見は、官能評価で静岡産と産地別に分かれたことと、成分構成の差に関するものです。特定の香りのノートへの寄与を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'yame', category: 'composition-only',
    text: '「八女」の所見は、玉露の品質指標（テアニン含量等）と覆い香成分の含量比較です。緑茶では、アミノ酸・カテキン類の含量の方向（煎茶比）からの推測として、うま味・渋味の方向を反映しています。この分類については、香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'region', entityId: 'saga', category: 'process-variation',
    text: '「佐賀」の所見は、同一の葉を製法で作り分けた比較（味覚センサーによる推定値を含む）です。緑茶では、佐賀の釜炒り製法についての知見からの推測として、渋味の方向と香ばしさを反映しています。この分類については、地域自体の香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'region', entityId: 'miyazaki', category: 'process-variation',
    text: '「宮崎」の所見は、釜炒り茶の成分溶出という製法の特性に関するものです。緑茶では、その溶出特性からの推測として、苦味・渋味の方向を反映しています。この分類については、地域自体の香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'region', entityId: 'kagoshima', category: 'cultivar-variation',
    text: '「鹿児島」の所見は、県内の品種ごとに官能の記述子が異なることを示したもの（煎茶での評価）です。緑茶では、複数の奨励品種に結びついた記述子（花様・フルーティー）を地域の品種群の傾向として推測で反映しています。この分類については、地域自体の香味の方向を示す所見がないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'uji', category: 'storage-temporal',
    text: '「宇治」の所見は、覆い下茶を冷蔵保存すると熟成してうま味やまろやかさが増すという、保存による時間変化の知見です。緑茶では、その方向からの推測としてうま味を反映しています。この分類については、地域自体の香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'region', entityId: 'kochi', category: 'no-direction',
    text: '「高知」の所見は、高知県産の和紅茶と輸入アールグレイ銘柄との成分比較です。紅茶では、カフェインが最少だった実測からの推測として苦味の方向を反映しています。この分類については、地域自体の香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'region', entityId: 'zhejiang', category: 'discrimination-only',
    text: '「浙江」の所見のうち香味の寄与を示すものは緑茶（龍井茶）についてのもので、緑茶ではキー成分の実測に基づき反映しています。その他の分類については、非揮発成分による小産地の判別等の知見のみで、特定のノートへの寄与を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'jiangsu', category: 'composition-only',
    text: '「江蘇」の所見では、碧螺春の個性を生む成分としてクマリンが示されました。緑茶では、含量差が実測されたクマリンの既知の香り（干し草様の甘い香り）からの推測として反映しています（寄与の直接実測はありません）。その他の分類については、香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'region', entityId: 'guizhou', category: 'composition-only',
    text: '「貴州」の所見は、代表緑茶の揮発成分・フェノール類の同定と比較です。成分の組成の知見であり、特定のノートへの寄与を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'yunnan', category: 'condition-variation',
    text: '「雲南」の所見は、晒青緑茶の地域差の要因解析と、白茶で香気活性成分が製法によって大きく変わるという知見です。地域としての単一の香味の方向を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'guangxi', category: 'cultivar-variation',
    text: '「広西」の所見は、紅茶では品種によって香型が分かれることと、六堡茶の工程による香味変化です。地域自体の単一の方向を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'hubei', category: 'composition-only',
    text: '「湖北」の所見は、恩施玉露の加工工程を通じた揮発成分の同定で、寄与は含量と文献の閾値からの推定に留まります。緑茶では、その推定成分（リナロール等）の方向を推測として反映しています。この分類については、香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'region', entityId: 'shaanxi', category: 'discrimination-only',
    text: '「陝西」の所見は、非揮発成分の定量による小産地の判別と、呈味の鍵物質の解析（紫陽毛尖でカテキン・フラボノイドが呈味と色の鍵とされた知見を含む）です。特定の味覚・香りの方向を示すものではないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'darjeeling', category: 'condition-variation',
    text: '「ダージリン」の地域としての所見は、製程や季節・標高による代謝物の組成変化です。紅茶では、セカンドフラッシュの特徴香気成分が選定された研究からの推論として、バラ・花様を推測で反映しています。この分類については、香味の方向を示す所見がないため、ホイールのノートには反映していません。' },
  { axis: 'region', entityId: 'assam', category: 'composition-only',
    text: '「アッサム」の所見は、紅茶の生化学的な品質パラメータの実測に加え、世界4大紅茶の比較でのキー成分の知見があります。紅茶では、フェニルアセトアルデヒドの寄与に基づく蜂蜜の方向と、麦芽様の特徴づけからの推測を反映しています。その他の分類については、香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'region', entityId: 'uva', category: 'discrimination-only',
    text: '「ウバ」の所見は、化学的な品質パラメータによる産地判別に加え、セイロン茶で最も決定的とされたサリチル酸メチルの知見があります。紅茶では、その成分の寄与に基づきハーブ様の方向を反映しています。その他の分類については、香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'region', entityId: 'dimbula', category: 'discrimination-only',
    text: '「ディンブラ」の所見は、化学的な品質パラメータによる産地判別です。紅茶では、セイロン茶全体で最も決定的とされたサリチル酸メチルの特徴を地域へ読み替えた推測を反映しています。その他の分類については、香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'region', entityId: 'nuwara-eliya', category: 'discrimination-only',
    text: '「ヌワラエリヤ」の所見は、色やテアルビジン等の指標による産地判別に加え、主要ヘッドスペース成分（リナロール等）の比較があります。紅茶では、その成分構成に基づく一般的な知見として花様・青葉の方向を反映しています。その他の分類については、香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'region', entityId: 'anhui', kindCategory: 'green', category: 'discrimination-only',
    text: '「安徽」の緑茶（黄山毛峰）についての所見は、キラル揮発成分の分布による産地・品種の判別です。特定のノートへの寄与を示すものではないため、この分類ではホイールのノートに反映していません。' },

  // ---- お茶：品種 ----

  { axis: 'cultivar', entityId: 'benifuuki', category: 'composition-only',
    text: '「べにふうき」の所見は、機能性成分 EGCG3″Me の含有に関するもので、香り・味への寄与を示すものではありません（紅茶に加工すると消失する成分でもあります）。紅茶では交配親（べにほまれ）の知見からの推測を、半発酵茶では農研機構の品種特性（軽く萎凋するとダージリン様のフレーバーが発揚する）からの推測を反映しています。この分類については、香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'qingxin-oolong', category: 'condition-variation',
    text: '「青心烏龍」の所見は、市販試料で焙煎度によって主要な香気活性成分が変わるという知見です。烏龍茶では、未〜中焙煎で主体だった花様成分の方向を推測として反映しています。この分類については、香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'jinxuan', category: 'composition-only',
    text: '「金萱（台茶12号）」の所見は、烏龍茶の製程でミルク様の香りに関連する成分がどう動くかという形成機構の研究です。烏龍茶では、そのミルク様の香りを推測として反映しています。紅茶では、販売事業者の金萱紅茶の製品説明（参考情報）に基づき、果実の方向を推測として反映しています。この分類については、香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'hongyu', category: 'composition-only',
    text: '「紅玉（台茶18号）」の所見は、学位論文による揮発成分の同定と、製法比較での組成の知見です。紅茶では、著者自身が寄与を推測した成分（リナロール・サリチル酸メチル）の方向を推測として反映しています。この分類については、香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'av2', category: 'composition-only',
    text: '「AV2」の所見は、季節によるフェノール類・カテキン類の変動を遺伝子型ごとに比べた代謝成分の研究が中心です。紅茶では、生産者（茶園）の品種解説に挙げられた花様・蜂蜜様・果実様の記述を参考情報として、推測で反映しています。半発酵茶では、同じ解説のムスカテルの記述を読み替えた推測を反映しています。その他の分類については、香味の方向を示す所見がないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'tri-2023', category: 'composition-only',
    text: '「TRI 2023」の所見は、茶カテキンの分析法の研究で供試試料に含まれたという分析化学の実測です。香味のデータではないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'tri-2025', category: 'composition-only',
    text: '「TRI 2025」の所見は、茶カテキンの分析法の研究で供試試料に含まれたという分析化学の実測です。香味のデータではないため、ホイールには反映していません。' },
  { axis: 'cultivar', entityId: 'tri-2043', category: 'composition-only',
    text: '「TRI 2043」の所見は、フェノール類の含有量の実測です。含有の知見であり、香味への寄与を示すものではないため、ホイールには反映していません。' },

  // ---- チョコ：産地 ----
  { axis: 'origin', entityId: 'venezuela', category: 'genetic-only',
    text: '「ベネズエラ」の所見は、栽培集団の遺伝的な混合の実測と、栄養成分等の組成の比較です。ダーク・ミルク・ルビーチョコレートでは、在来クリオロ等のリカーの官能ホイールの記述子を推測として反映しています。この種類については、産地としての香味の方向を示す所見がないため、ホイールのノートには反映していません。' },
  { axis: 'origin', entityId: 'ecuador', category: 'cultivar-variation',
    text: '「エクアドル」の香味に関する実測は、産地そのものではなく「現代 Nacional」という栽培集団のレベルで行われています。ダーク・ミルク・ルビーチョコレートでは、その集団で同定された花ノートの生合成経路の知見を、産地への読み替えの推測として弱く反映しています。産地固有の実測プロファイルではなく、系統（ナシオナル）を選んだ場合の反映が主です。その他の種類については反映していません。' },
  { axis: 'origin', entityId: 'dominican-republic', category: 'condition-variation',
    text: '「ドミニカ共和国」については産地試料の官能・揮発成分の実測がありますが、その結論は「同じ産地でも発酵の進め方で香味が大きく変わる」というものです。ダーク・ミルクチョコレートでは、同国産トリニタリオの訓練パネル評価で挙げられた属性（ドライフルーツ・木質等）の方向を、ばらつきが大きいことを明記した推測として弱く反映しています。その他の種類については、産地として単一の方向を示す所見がないため、ホイールのノートには反映していません。' },
  { axis: 'origin', entityId: 'ghana', category: 'process-variation',
    text: '「ガーナ」の所見は、発酵法や焙煎・コンチングの条件で香味がどう変わるかという加工条件の実測が中心です。総説ではガーナのフォラステロが「強い基本的なカカオ感と果実の含み」を持つ標準的なカカオ香味の源と特徴づけられており、その特徴づけに基づく推測として、カカオ・ナッツ・果実の方向を弱く反映しています。' },
  { axis: 'origin', entityId: 'madagascar', category: 'composition-only',
    text: '「マダガスカル」の所見は、農家試料の遺伝解析と、単一製品の揮発成分の組成実測です。ダークチョコレートでは、その組成実測（ストレッカーアルデヒド類が最高水準）からの推論として麦芽を推測で反映しています。この種類については、香味の方向を示す所見がないため、ホイールのノートには反映していません。' },
  { axis: 'origin', entityId: 'peru', category: 'genetic-only',
    text: '「ペルー」の所見は、ピウラ・ポルセラーナの遺伝的な位置づけと、バグア産・クイジャバンバ産（チュンチョ）の比較実測です。味覚については、チュンチョ側の実測の方向（苦味・渋味が穏やかな側）をペルー全体へ広げた推測として反映しています。香りのノートについては、産地全体の方向を示す所見がないため、ホイールのノートには反映していません。' },
  { axis: 'origin', entityId: 'cote-divoire', category: 'no-direction',
    text: '「コートジボワール」については官能・揮発成分の実測があり、その結論は「発酵・焙煎後のチョコレートでは産地による違いは見られない」というものです。一方で総説では、西アフリカ群（ガーナ・コートジボワール・ナイジェリア）が標準（ベンチマーク）カカオ香味の源と特徴づけられています。その群としての特徴づけに基づく推測として、カカオ・ナッツの方向を弱く反映しています（コートジボワール単独の個性として確定したものではありません）。' },
  { axis: 'origin', entityId: 'tanzania', category: 'no-flavor-findings',
    text: '「タンザニア」については香味の科学的な所見が確認できていないため、産地の情報はホイールの推測に使っていません。' },

  // ---- チョコ：系統 ----
  { axis: 'lineage', entityId: 'trad-forastero', lineageLayer: 'traditional', category: 'no-flavor-findings',
    text: '「フォラステロ（Forastero）」は大きな集団の総称で、総称としての香味の実測は原理的に存在しません。そのため系統の情報はホイールの推測に使っていません。' },
  { axis: 'lineage', entityId: 'trad-trinitario', lineageLayer: 'traditional', category: 'composition-only',
    text: '「トリニタリオ（Trinitario）」の所見は、タイプ別種子のフェノール組成の分析で、総ポリフェノール量等に遺伝的に決まる差は見出されなかったという知見を含みます。ダーク・ミルク・ルビーチョコレートでは、交雑由来の記録に基づき、香味の知見がある祖先（クリオロ）側の記述子を合成した推測を反映しています。この種類については反映していません。' },
  { axis: 'lineage', entityId: 'gen-criollo', lineageLayer: 'genetic', category: 'genetic-only',
    text: '遺伝集団「クリオロ（Criollo）」の所見は、家畜化の過程に関する集団ゲノミクスの知見です。ダーク・ミルク・ルビーチョコレートでは、伝統的分類のクリオロと概ね対応するという記録に基づき、その記述子を読み替えた推測を反映しています。この種類については反映していません（伝統的分類のクリオロとは別エンティティとして扱います）。' },
  { axis: 'lineage', entityId: 'imc-67', lineageLayer: 'clone', category: 'composition-only',
    text: '「IMC-67」の所見は、加工工程を通じた揮発成分の検出・組成の測定と、発酵豆でのリナロール濃度の比較です。ホワイトチョコレートはカカオマスを使わないため、系統の香味の推測は適用していません。' },
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
