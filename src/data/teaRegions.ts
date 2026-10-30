import type { TeaRegion } from '../types'

// お茶の地域レベルの産地エンティティ（2026-10-31 追加。調査: docs/research/literature-expansion-d-combinations.md）。
// 原則はカカオの CacaoOrigin と同じ：
// - 産地は品種ではない。地域名から香味プロファイルを自動生成しない（本エンティティは
//   FlavorProfile を持たず、出典つきの所見 findings までしか表示しない）。
// - 文献で所見のある地域だけを登録する。データが無い地域は作らない。
// - flavorEvidence で根拠レベルを明示する（'measured' = その地域の試料で成分・官能まで
//   実測がある / 'general' = 組成の実測のみ等 / 'none' = 所見なし）。

export const teaRegions: TeaRegion[] = [
  {
    id: 'nagasaki',
    name: '長崎',
    country: '日本',
    parentName: '九州',
    note: '彼杵茶（そのぎ茶、玉緑茶）で知られる県。県の研究機関が県産緑茶の成分分析を行っています。',
    flavorEvidence: 'measured',
    verification: { existence: 'confirmed', classification: 'confirmed', science: 'partial' },
    scienceNote: '県産「緑茶」については、県の公的研究機関による実試料の成分プロファイリングがあります（下記所見）。ただし対象は緑茶（荒茶）のみで、産地条件（農家・標高）と品種は分離されておらず、「長崎という産地そのものの効果」を測ったものではありません。長崎県産を紅茶にした成分・官能の研究は、調査範囲では見つかっていません。',
    findings: [
      {
        kind: 'composition',
        statement: '令和4年度長崎県茶品評会・一般茶部門の緑茶17試料（さえみどり9点、やぶきた4点、あさつゆ・つゆひかり・おくゆたか・きらり31 各1点）を GC-MS/MS と LC-QTOF/MS で分析したところ、主成分分析で品種によるグルーピングが確認され、やぶきた は交配種の さえみどり・あさつゆ とも異なるグループを形成しました。報告は やぶきた を「甘み、旨味、苦みのバランスの良い」品種と記述しています。',
        conditions: '長崎県内の緑茶（荒茶）のみのデータです。試料は農家・標高などの産地条件と分離できておらず、「長崎という産地そのものの効果」は測っていません。紅茶への適用はできません。',
        sourceIds: ['tsujimura-2024-nagasaki-tea-foodomics'],
      },
      {
        kind: 'composition',
        statement: '同じ分析で、品評会順位への寄与が大きい成分群（VIPスコア≧1）として、テアニン・グルタミン等のアミノ酸類、スクロース等の糖類、キナ酸等の有機酸類、カテキン類（エピカテキン、没食子酸等）が抽出されました。',
        conditions: '品評会順位と成分の統計的な関連であり、個別成分の香味への寄与を証明するものではありません。',
        sourceIds: ['tsujimura-2024-nagasaki-tea-foodomics'],
      },
    ],
    sourceIds: ['tsujimura-2024-nagasaki-tea-foodomics'],
    applicableKindIds: ['green'],
  },
]

export const teaRegionById = (id: string) => teaRegions.find((r) => r.id === id)

/** 指定した国に属する地域エンティティ */
export const teaRegionsForCountry = (country: string) => teaRegions.filter((r) => r.country === country)
