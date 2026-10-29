import type { ChocolateItem, FlavorProfile } from '../types'
import { emptyTastes, emptyTemporal } from '../types'

const A = 'acpangan-2023-dark-chocolate-aroma'
const P = 'putri-2024-cocoa-sensory'
const prof = (aromas: FlavorProfile['aromas'], tastes?: FlavorProfile['tastes']): FlavorProfile => ({ aromas, tastes: tastes ?? emptyTastes(), temporal: emptyTemporal() })

export const chocolateItems: ChocolateItem[] = [
  {
    id: 'dark-roasted', name: 'ダークチョコレート（焙煎）', kind: 'dark',
    searchNames: ['ダークチョコレート', 'dark chocolate', '焙煎', 'roasted'],
    profile: prof([
      { noteId: 'cacao', intensity: 'strong', basis: 'sensory', sourceIds: [A] },
      { noteId: 'toast', intensity: 'normal', basis: 'sensory', sourceIds: [A] },
      { noteId: 'caramel', intensity: 'normal', basis: 'sensory', sourceIds: [A] },
      { noteId: 'hazelnut', intensity: 'normal', basis: 'sensory', sourceIds: [A] },
    ]),
    evidenceLevel: 'general',
    scopeNote: '同一カカオ豆の焙煎品と未焙煎品を比べた1件の原著研究（GC-O・官能評価）に基づきます。焙煎品では焙煎の香りが増し、酢酸を除く匂い物質の OAV が高い傾向でした。キャラメル様・ヘーゼルナッツ様の成分については研究発表要約の記述にも基づきます。あらゆるダークチョコレートに当てはまる実測ではありません。カカオ含有率は試料条件が未確認のため表示しません。',
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
    ]),
    evidenceLevel: 'general',
    scopeNote: '系統的レビューでファインフレーバーカカオの豆とチョコレートの記述に共通して使われた言葉（キャラメル・果実・花・麦芽・ナッツ・スパイス）を整理したものです。産地ごとに異なり、カカオリカーの特徴が最終製品にそのまま残るとは限らない点が同レビューで指摘されています。',
    sourceIds: [P],
  },
  {
    id: 'milk-chocolate', name: 'ミルクチョコレート', kind: 'milk',
    searchNames: ['ミルクチョコレート', 'milk chocolate'],
    profile: prof([]),
    evidenceLevel: 'insufficient',
    scopeNote: '初期版では検証済みの香味データが不足しているため、香味は「不明」としています。カカオ含有率や乳成分だけから甘味・苦味を推定することはしません。',
    sourceIds: [],
  },
  {
    id: 'white-chocolate', name: 'ホワイトチョコレート', kind: 'white',
    searchNames: ['ホワイトチョコレート', 'white chocolate'],
    profile: prof([]),
    evidenceLevel: 'insufficient',
    scopeNote: '初期版では検証済みの香味データが不足しているため、香味は「不明」としています。',
    sourceIds: [],
  },
]
export const chocolateById = (id: string) => chocolateItems.find((c) => c.id === id)
