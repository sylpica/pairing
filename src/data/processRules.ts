import type { ComboStatement, TasteKey } from '../types'
import type { CacaoLayer } from '../engine/pairingContext'

// 製法の科学に基づく「変換ルール」（組み合わせページ第2層の推測の材料）。
// 品種・系統の所見や分類プロファイルを、製法（茶類・種類への加工）の科学で
// どう読み替えるかを、文献に裏付けられた範囲だけで定義する。
// - ここに無い変換は行わない（根拠なくノートや味を生やさない）。
// - 効果はすべて「推測」レベルで表示される。方向（穏やか／強い）だけを示し、
//   数値化はしない。
// 根拠の調査記録: docs/research/literature-expansion-d-combinations.md

export interface NoteEffect {
  noteId: string
  /** add = そのノートを推測として追加／emphasize = 既にあるノートの根拠を補う（強度は変えない） */
  mode: 'add' | 'emphasize'
  /** mode: 'add' のときの強度（未指定は 'weak'） */
  intensity?: 'weak' | 'normal'
  text: string
  sourceIds: string[]
}

export interface TasteEffect {
  key: TasteKey
  direction: 'milder' | 'stronger'
  text: string
  sourceIds: string[]
}

export interface TeaProcessRule {
  id: string
  /** 対象の品種（未指定なら品種不問） */
  cultivarId?: string
  /** 対象の茶類カテゴリ（TeaKind.category。'form' は使わない） */
  kindCategory: string
  noteEffects: NoteEffect[]
  tasteEffects: TasteEffect[]
  statements: ComboStatement[]
}

export interface ChocoProcessRule {
  id: string
  lineageLayer: CacaoLayer
  lineageId: string
  noteEffects: NoteEffect[]
  tasteEffects: TasteEffect[]
  statements: ComboStatement[]
}

export const teaProcessRules: TeaProcessRule[] = [
  {
    id: 'pr-yabukita-black',
    cultivarId: 'yabukita',
    kindCategory: 'black',
    noteEffects: [
      {
        noteId: 'green-leaf', mode: 'add', intensity: 'weak',
        text: '山口県産やぶきた二番茶の和紅茶試作では、他県産やぶきた市販和紅茶やダージリンに比べ、青草様の香り成分 Hexanal と (E)-2-hexenal の検出強度が高いという実測があります。やぶきたを紅茶にしても、青さが残りやすい方向が推測されます。',
        sourceIds: ['taneba-2018-yamaguchi-wakocha'],
      },
      {
        noteId: 'herb', mode: 'add', intensity: 'weak',
        text: '同じ山口県の試作では、青草・ハーブ様の成分が特徴として残りました。萎凋率65%では花様成分のリナロールの検出強度も最も高くなっており、工程条件で出方は動きます。',
        sourceIds: ['taneba-2018-yamaguchi-wakocha'],
      },
    ],
    tasteEffects: [
      {
        key: 'astringent', direction: 'milder',
        text: 'やぶきたの酸化酵素活性は紅茶用品種より大幅に低く（茨城県の44品種評価で a* 値 1.82、べにふうき 6.25・べにひかり 6.31）、紅茶にしても発酵（酸化）とテアフラビン生成が穏やかに進むと考えられます。実際に、やぶきた主体の和紅茶は輸入ブレンドよりテアフラビンが最も低く、渋味が穏やかで水色が淡い方向だったことが実測されています。そのため渋味は紅茶一般より穏やかな可能性があります。',
        sourceIds: ['ibaraki-2022-oxidase-wakocha', 'sawamura-2025-earlgrey-extraction'],
      },
      {
        key: 'bitter', direction: 'milder',
        text: 'やぶきた主体の和紅茶の実測では、カフェインも比較銘柄の中で最も低い水準でした。苦味も紅茶一般より穏やかな方向の可能性があります。',
        sourceIds: ['sawamura-2025-earlgrey-extraction'],
      },
    ],
    statements: [
      {
        text: 'やぶきたは緑茶用品種で、紅茶加工に必要な酸化酵素の活性が低いことが定量的に示されています（茨城県農業総合センターの44品種・系統の評価）。紅茶用品種（べにふうき等）と同じ進み方にはならない、というのがこの組み合わせの出発点です。',
        level: 'inferred', sourceIds: ['ibaraki-2022-oxidase-wakocha'],
      },
      {
        text: 'やぶきた主体の市販和紅茶（高知県産）の実測では、テアフラビンとカフェインが輸入ブレンド紅茶より最も低く、「紅茶水色が淡い傾向」は原料がやぶきた等の緑茶用品種であることと関連づけて論じられています。',
        level: 'inferred', sourceIds: ['sawamura-2025-earlgrey-extraction'],
      },
    ],
  },
  {
    id: 'pr-benifuuki-black',
    cultivarId: 'benifuuki',
    kindCategory: 'black',
    noteEffects: [],
    tasteEffects: [],
    statements: [
      {
        text: 'べにふうきは、紅茶加工に必要な酸化酵素の活性が高いことが定量的に示されています（茨城県農業総合センターの44品種・系統の評価で a* 値 6.25。やぶきた 1.82 とは対照的に、べにひかり 6.31 と並ぶ上位群）。やぶきたとは逆に、紅茶にすると発酵（酸化）とテアフラビン生成が進みやすい方向と推測されます。ただし、べにふうき単独の紅茶の官能実測は確認できていないため、渋味・苦味の強さそのものは紅茶一般のプロファイルの範囲で読んでください。',
        level: 'inferred', sourceIds: ['ibaraki-2022-oxidase-wakocha'],
      },
    ],
  },
  {
    id: 'pr-hongyu-black',
    cultivarId: 'hongyu',
    kindCategory: 'black',
    noteEffects: [],
    tasteEffects: [],
    statements: [
      {
        text: '台茶18号（紅玉）と青心烏龍を烏龍茶製法と紅茶製法で作り分けた査読研究では、台茶18号はカテキンが高く、紅茶製法にしても液色が濃い方向でした。紅茶一般のプロファイルより、色と味の濃さが残りやすい方向と推測されます（台湾の2品種での比較に基づく推測であり、強さの数値化はしません）。',
        level: 'inferred', sourceIds: ['chen-2025-ttesh18-qingxin-process'],
      },
    ],
  },
  {
    id: 'pr-soufu-oolong',
    cultivarId: 'soufu',
    kindCategory: 'oolong',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'emphasize',
        text: 'そうふう の品種特異的な香りの原因成分アントラニル酸メチルは、煎茶の AEDA で果実様の香りへの影響が大きいとされた成分です。半発酵茶（烏龍茶）に加工した場合も、この成分が花様・果実様のニュアンスの核になる可能性があります。農研機構の育成時評価でも、そうふう は「半発酵茶として高品質で特に香気に優れる」とされています。烏龍茶での直接の寄与実証ではないため、推測として示します。',
        sourceIds: ['sawai-2004-sofu-methyl-anthranilate', 'mizukami-2012-sofu-yabukita-aeda'],
      },
    ],
    tasteEffects: [],
    statements: [],
  },
  {
    id: 'pr-yabukita-green-process',
    cultivarId: 'yabukita',
    kindCategory: 'green',
    noteEffects: [],
    tasteEffects: [],
    statements: [
      {
        text: '同じやぶきたの葉でも製法で味の出方は変わります。佐賀県での同一葉の作り分けでは、蒸製玉緑茶のうま味・渋味は煎茶と同等で、釜炒り製法では渋味が煎茶より有意に低くなりました。長崎の玉緑茶（ぐり茶）は蒸製玉緑茶と同系統の製法のため、「煎茶と大きくは変わらない」という位置づけは、産地の同一性ではなく製法の近さに基づく推測です。',
        level: 'inferred', sourceIds: ['yamaguchi-miyazaki-2018-kamairi-taste'],
      },
    ],
  },
]

export const chocoProcessRules: ChocoProcessRule[] = [
  {
    id: 'pr-ccn51-strong-bitter',
    lineageLayer: 'clone',
    lineageId: 'ccn-51',
    noteEffects: [],
    tasteEffects: [
      {
        key: 'bitter', direction: 'stronger',
        text: 'エクアドル産 CCN-51 と Nacional 系 EET クローンを発酵乾燥豆からリカーまで同一条件で比べた研究では、CCN-51 は官能で苦味・渋味・オフフレーバーが強い側でした。この組み合わせでも苦味は種類一般より強い方向の可能性があります（当該試料・発酵条件での結果であり、無条件の一般化ではありません）。',
        sourceIds: ['rottiers-2019-ccn51-nacional-flavor'],
      },
      {
        key: 'astringent', direction: 'stronger',
        text: '同じ比較研究で、CCN-51 は渋味も強い側と評価されました。渋味も種類一般より強い方向の可能性があります。',
        sourceIds: ['rottiers-2019-ccn51-nacional-flavor'],
      },
    ],
    statements: [
      {
        text: 'CCN-51 は単一の遺伝集団ではなく混合構成のクローンです。系統の所見は原料段階のもので、最終製品の味は発酵・焙煎・配合でも変わります。',
        level: 'inferred', sourceIds: ['boza-2014-ccn51'],
      },
    ],
  },
  {
    id: 'pr-nacional-floral',
    lineageLayer: 'genetic',
    lineageId: 'gen-nacional',
    noteEffects: [
      {
        noteId: 'floral-general', mode: 'add', intensity: 'weak',
        text: '現代 Nacional の集団では、花のノートに関連する生合成経路（モノテルペン生合成経路と L-フェニルアラニン分解経路）が同定され、伝統的 Nacional の発酵豆は花様の味を示すと先行研究を引いて整理されています。花様のニュアンスが出る可能性があります。ただしこれは集団内の遺伝子型間変異の知見であり、「Nacional は常に花香が強い」という意味ではありません。',
        sourceIds: ['colonges-2021-nacional-floral', 'boza-2014-ccn51'],
      },
    ],
    tasteEffects: [],
    statements: [
      {
        text: '「アリバ（Arriba）」はエクアドル産カカオの商業・香味の呼称で、遺伝集団の名前ではありません。Nacional のファインフレーバーの潜在力は、発酵工程と製造の実践に大きく影響されると原著も明記しています。',
        level: 'inferred', sourceIds: ['boza-2014-ccn51'],
      },
    ],
  },
]
