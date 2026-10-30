import type { ChocolateItem, FlavorProfile } from '../types'
import { emptyTastes, emptyTemporal } from '../types'

const A = 'acpangan-2023-dark-chocolate-aroma'
const P = 'putri-2024-cocoa-sensory'
const prof = (aromas: FlavorProfile['aromas'], tastes?: FlavorProfile['tastes'], temporal?: Partial<FlavorProfile['temporal']>): FlavorProfile => ({ aromas, tastes: tastes ?? emptyTastes(), temporal: { ...emptyTemporal(), ...(temporal ?? {}) } })
const chocoTemporal: Partial<FlavorProfile['temporal']> = {
  first: { text: '口に入れた直後はまだ固形で、香りの立ち上がりは穏やかと考えられます。', basis: 'general', sourceIds: ['lenfant-2013-dark-chocolate-shape-ti'], estimated: true },
  middle: { text: '体温で融けていくにつれて、香りが口の中に広がっていくと考えられます。ただし、融解の知覚とフレーバーの強さは単純には結びつかないことも示されています。', basis: 'general', sourceIds: ['lenfant-2013-dark-chocolate-shape-ti'], estimated: true },
  finish: { text: '脂肪分が口の中に残るため、香りの余韻は続きやすいと考えられます（脂肪系の食品で鼻後香の持続が変わる研究からの推測です）。', basis: 'general', sourceIds: ['buettner-2005-retronasal-persistence'], estimated: true },
}
const milkTemporal: Partial<FlavorProfile['temporal']> = {
  first: chocoTemporal.first, middle: chocoTemporal.middle,
  finish: { text: '乳脂肪の膜（マウスコーティング）が口に残りやすく、余韻が長く続きやすいと考えられます。ミルクチョコレート2種の比較研究では、コーティングの量とその消え方に差がありました（個別製品では異なります）。', basis: 'general', sourceIds: ['carvalho-2013-milk-chocolate-coating'], estimated: true },
}

export const chocolateItems: ChocolateItem[] = [
  {
    id: 'dark-roasted', name: 'ダークチョコレート（焙煎）', kind: 'dark',
    searchNames: ['ダークチョコレート', 'dark chocolate', '焙煎', 'roasted'],
    profile: prof([
      { noteId: 'cacao', intensity: 'strong', basis: 'sensory', sourceIds: [A] },
      { noteId: 'toast', intensity: 'normal', basis: 'sensory', sourceIds: [A] },
      { noteId: 'caramel', intensity: 'normal', basis: 'sensory', sourceIds: [A] },
      { noteId: 'hazelnut', intensity: 'normal', basis: 'sensory', sourceIds: [A] },
    ], {
      ...emptyTastes(),
      bitter: { intensity: 'strong', basis: 'sensory', sourceIds: ['luchian-2023-chocolate-profiles', 'stark-2006-cocoa-nibs-taste'] },
      astringent: { intensity: 'strong', basis: 'sensory', sourceIds: ['luchian-2023-chocolate-profiles', 'stark-2006-cocoa-nibs-taste'] },
      sour: { intensity: 'weak', basis: 'general', sourceIds: ['stark-2006-cocoa-nibs-taste'] },
    }, chocoTemporal),
    evidenceLevel: 'general',
    scopeNote: '同一カカオ豆の焙煎品と未焙煎品を比べた1件の原著研究（GC-O・官能評価）に基づきます。焙煎品では焙煎の香りが増し、酢酸を除く匂い物質の OAV が高い傾向でした。キャラメル様・ヘーゼルナッツ様の成分については研究発表要約の記述にも基づきます。あらゆるダークチョコレートに当てはまる実測ではありません。カカオ含有率は試料条件が未確認のため表示しません。味覚は、カカオニブの呈味成分研究（Stark et al. 2006）と市販ダーク（70%・95%）のパネル評価（Luchian et al. 2023）に基づく一般レベルの整理で、苦味・渋みが中心です。最終製品の味は配合で変わります。',
    sourceIds: [A],
  },
  {
    id: 'dark-unroasted', name: 'ダークチョコレート（未焙煎・ミニマル）', kind: 'dark',
    searchNames: ['未焙煎', 'ローチョコレート', 'raw chocolate', 'unroasted', 'ミニマル'],
    profile: prof(
      [
        { noteId: 'fruit-general', intensity: 'normal', basis: 'sensory', sourceIds: [A] },
        { noteId: 'floral-general', intensity: 'normal', basis: 'sensory', sourceIds: [A] },
        { noteId: 'green-vegetable', intensity: 'normal', basis: 'sensory', sourceIds: [A] },
        { noteId: 'cacao', intensity: 'normal', basis: 'sensory', sourceIds: [A] },
      ],
      {
        ...emptyTastes(),
        sour: { intensity: 'normal', basis: 'sensory', sourceIds: [A] },
        sweet: { intensity: 'normal', basis: 'sensory', sourceIds: [A] },
      },
      chocoTemporal,
    ),
    evidenceLevel: 'general',
    scopeNote: '上記原著研究で、未焙煎品は果実・花の香りやピーマン様の成分が目立ち、訓練パネルでは焙煎品より酸味と甘味が強いと評価されました（同一研究内の比較）。個別商品の実測ではありません。',
    sourceIds: [A],
  },
  {
    id: 'fine-flavor-chocolate', name: 'ファインフレーバーカカオのチョコレート', kind: 'dark',
    searchNames: ['ファインフレーバー', 'fine flavor', 'FFC', 'スペシャルティカカオ'],
    profile: prof([
      { noteId: 'caramel', intensity: 'normal', basis: 'review', sourceIds: [P] },
      { noteId: 'fruit-general', intensity: 'normal', basis: 'review', sourceIds: [P] },
      { noteId: 'floral-general', intensity: 'normal', basis: 'review', sourceIds: [P] },
      { noteId: 'malt', intensity: 'normal', basis: 'review', sourceIds: [P] },
      { noteId: 'nut-general', intensity: 'normal', basis: 'review', sourceIds: [P] },
      { noteId: 'warm-spice', intensity: 'normal', basis: 'review', sourceIds: [P] },
    ], undefined, chocoTemporal),
    evidenceLevel: 'general',
    scopeNote: '系統的レビューでファインフレーバーカカオの豆とチョコレートの記述に共通して使われた言葉（キャラメル・果実・花・麦芽・ナッツ・スパイス）を整理したものです。産地ごとに異なり、カカオリカーの特徴が最終製品にそのまま残るとは限らない点が同レビューで指摘されています。',
    sourceIds: [P],
  },
  {
    id: 'milk-chocolate', name: 'ミルクチョコレート', kind: 'milk',
    searchNames: ['ミルクチョコレート', 'milk chocolate'],
    profile: prof([
      { noteId: 'malt', intensity: 'normal', basis: 'measured', sourceIds: ['schnermann-1997-milk-chocolate'] },
      { noteId: 'nut-general', intensity: 'normal', basis: 'measured', sourceIds: ['schnermann-1997-milk-chocolate'] },
      { noteId: 'hazelnut', intensity: 'normal', basis: 'measured', sourceIds: ['schnermann-1997-milk-chocolate'] },
      { noteId: 'cream', intensity: 'normal', basis: 'measured', sourceIds: ['samfass-2021-crumb-chocolate-lactones'] },
      { noteId: 'stone-fruit', intensity: 'weak', basis: 'measured', sourceIds: ['schnermann-1997-milk-chocolate'] },
    ], {
      ...emptyTastes(),
      sweet: { intensity: 'strong', basis: 'sensory', sourceIds: ['luchian-2023-chocolate-profiles', 'guinard-1999-milk-chocolate-sugar-fat'] },
    }, milkTemporal),
    evidenceLevel: 'general',
    scopeNote: '市販ミルクチョコレート1種の AEDA 研究（Schnermann & Schieberle 1997）と、クラムチョコレートのクリーミーさ研究（Samfaß et al. 2021）に基づく一般レベルの整理です。モルト様・ナッツ様の成分が高 FD値で、ラクトン類が甘い香りとクリーミーさに関わります。試料数が限られるため、全てのミルクチョコレートの実測ではありません。甘味は市販品パネル研究（Luchian et al. 2023）で最も甘い群とされた記録と、配合実験（Guinard & Mazzucchelli 1999）に基づきますが、糖分量で大きく変わる配合依存の値です。',
    sourceIds: ['schnermann-1997-milk-chocolate', 'samfass-2021-crumb-chocolate-lactones'],
  },
  {
    id: 'white-chocolate', name: 'ホワイトチョコレート', kind: 'white',
    searchNames: ['ホワイトチョコレート', 'white chocolate'],
    profile: prof([
      { noteId: 'caramel', intensity: 'normal', basis: 'sensory', sourceIds: ['stewart-2017-model-white-chocolate'] },
      { noteId: 'milk', intensity: 'normal', basis: 'sensory', sourceIds: ['stewart-2017-model-white-chocolate'] },
    ], {
      ...emptyTastes(),
      sweet: { intensity: 'normal', basis: 'sensory', sourceIds: ['luchian-2023-chocolate-profiles'] },
    }),
    evidenceLevel: 'general',
    scopeNote: '注意：香りは市販品の実測ではなく、実験室で調製した「モデル」ホワイトチョコレートの研究（Stewart et al. 2017/2018）に基づく説明です。高加熱のスキムミルクパウダーを使った試料ではファッジ／キャラメル様の香りが強く、コンデンスミルク様の香味が増えました。乳原料の加熱履歴で香りが変わるため、個別商品の香味とは限りません。甘味は別途、市販品1種のパネル研究（Luchian et al. 2023）で「はっきりした甘味」とされた記録に基づきます（単一試料の根拠です）。',
    sourceIds: ['stewart-2017-model-white-chocolate', 'stewart-2018-smp-volatile-carryover'],
  },
  {
    id: 'ruby-chocolate', name: 'ルビーチョコレート', kind: 'ruby',
    searchNames: ['ルビーチョコレート', 'ruby chocolate', 'ルビー', 'ピンクチョコレート'],
    profile: prof([
      { noteId: 'berry', intensity: 'weak', basis: 'general', sourceIds: ['barry-callebaut-ruby', 'seremet-2019-ruby-sensory'] },
    ], {
      ...emptyTastes(),
      sour: { intensity: 'normal', basis: 'sensory', sourceIds: ['seremet-2019-ruby-sensory'] },
    }, chocoTemporal),
    evidenceLevel: 'general',
    scopeNote: 'ルビーは遺伝的な系統ではなく、色素の前駆体を多く含むカカオ豆の選抜と、発酵を抑えた特殊な製法で生まれる「種類」です（開発元バリーカレボーが2017年に発表。着色料・ベリー香料は無添加と公表されています）。酸味は、ダーク・ミルク・ホワイトと比較した官能評価（Šeremet et al. 2019）で供試試料の中で最も強い酸味とされた記録に基づきます。ベリー様の香りは開発メーカーの説明（参考情報）が中心で、査読済みの官能研究がベリー様の香りそのものを確かめたわけではないため、一般的な知見として弱く表示しています。組成についてはフラバン-3-オールやプロアントシアニジン（A型が特徴的）の定量研究（Tuenter et al. 2021）がありますが、組成の検出は香りの寄与とは別の記録です。カカオ分は製品により異なるため表示しません。',
    sourceIds: ['seremet-2019-ruby-sensory', 'tuenter-2021-ruby-composition', 'barry-callebaut-ruby'],
  },
  {
    id: 'blond-chocolate', name: 'ブロンドチョコレート（キャラメリゼホワイト）', kind: 'blond',
    searchNames: ['ブロンドチョコレート', 'ブロンド', 'blond chocolate', 'blonde chocolate', 'デュルセイ', 'Dulcey', 'キャラメリゼホワイト', 'キャラメルホワイト'],
    profile: prof([]),
    evidenceLevel: 'insufficient',
    scopeNote: 'ホワイトチョコレートを長時間加熱してキャラメリゼさせた種類で、ヴァローナのデュルセイ（Dulcey、2012年）が始まりとされます。メーカーはビスケット（ショートブレッド）様の味やキャラメリゼしたミルクの香り、わずかな塩味を説明していますが、これはメーカーの説明（参考情報）です。ブロンドチョコレートを対象にした査読済みの香気・官能研究は本調査で確認できなかったため、香味プロファイルは登録していません（情報不足）。メーカーの説明文を科学データのように表示することはしません。',
    sourceIds: ['valrhona-blond-dulcey'],
  },
]
export const chocolateById = (id: string) => chocolateItems.find((c) => c.id === id)
