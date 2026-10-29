import type { TeaItem, TeaKind, FlavorProfile } from '../types'
import { emptyTastes, emptyTemporal } from '../types'

// 茶類・呼称の辞書。六大茶類（category）と製品形態・呼称（form）を混同しない。
export const teaKinds: TeaKind[] = [
  { id: 'green', name: '緑茶', category: 'green', aliases: ['Green tea', '绿茶'], note: '不発酵茶。殺青で酵素酸化を止める。' },
  { id: 'white', name: '白茶', category: 'white', aliases: ['White tea', '白茶'], note: '萎凋と乾燥を主体とする軽微な加工の茶。' },
  { id: 'yellow', name: '黄茶', category: 'yellow', aliases: ['Yellow tea', '黄茶'], note: '悶黄という独特の工程を持つ中国の茶。' },
  { id: 'oolong', name: '青茶（烏龍茶）', category: 'oolong', aliases: ['Oolong tea', '乌龙茶', '烏龍茶'], note: '半発酵茶。緑茶と紅茶の中間的な製法。' },
  { id: 'black', name: '紅茶', category: 'black', aliases: ['Black tea', '红茶'], note: '発酵（酵素酸化）を進めた茶。' },
  { id: 'dark', name: '黒茶', category: 'dark', aliases: ['Dark tea', '黑茶', 'プーアル茶', '普洱茶'], note: '後発酵（微生物発酵）を経る茶。プーアル茶を含む。' },
  { id: 'sencha-form', name: '煎茶', category: 'form', aliases: ['Sencha'], note: '蒸青緑茶の一種（日本）。固有の実測プロファイルは未収録で、蒸青緑茶の一般的特徴を参照する。' },
  { id: 'gyokuro-form', name: '玉露', category: 'form', aliases: ['Gyokuro'], note: '被覆栽培の蒸青緑茶（日本）。固有データは未収録。' },
  { id: 'matcha-form', name: '抹茶', category: 'form', aliases: ['Matcha'], note: '碾茶を粉末にしたもの。固有データは未収録。' },
  { id: 'hojicha-form', name: 'ほうじ茶', category: 'form', aliases: ['Hojicha', '焙じ茶'], note: '緑茶を焙煎したもの。固有データは未収録。' },
]

const Z = 'zeng-2025-tea-vocs'
const prof = (aromas: FlavorProfile['aromas']): FlavorProfile => ({ aromas, tastes: emptyTastes(), temporal: emptyTemporal() })
const e = (noteId: string, intensity: 'weak' | 'normal' | 'strong') => ({ noteId, intensity, basis: 'review' as const, sourceIds: [Z] })

// 香味は Zeng et al. 2025（Foods 14:2574）本文の茶類別記述に基づく総説レベルの一般的特徴。
// 個別品種・商品の実測ではない。強度は総説の記述（支配的/顕著などの表現）を順序尺度へ保守的に読み替えたもの。
export const teaItems: TeaItem[] = [
  {
    id: 'green-pan-fired', name: '釜炒り緑茶（炒青）', kindId: 'green',
    searchNames: ['炒青緑茶', '釜炒り', 'pan-fired green tea', '炒青'],
    profile: prof([e('chestnut', 'strong'), e('toast', 'normal'), e('floral-general', 'normal'), e('green-leaf', 'normal')]),
    evidenceLevel: 'general',
    scopeNote: '総説では炒青緑茶は栗と焙煎の香りが特徴とされ、緑茶全体は花・爽やかさ・栗様の香りが中心と整理されています。個別銘柄の実測ではありません。',
    sourceIds: [Z],
  },
  {
    id: 'green-steamed', name: '蒸し緑茶（蒸青）', kindId: 'green',
    searchNames: ['蒸青緑茶', '蒸し製', 'steamed green tea', '煎茶'],
    profile: prof([e('green-leaf', 'strong'), e('floral-general', 'normal'), e('chestnut', 'normal')]),
    evidenceLevel: 'general',
    scopeNote: '総説では蒸青緑茶は爽やかな香りが際立つとされています。日本の煎茶も蒸青ですが、煎茶固有の実測プロファイルではありません。',
    sourceIds: [Z],
  },
  {
    id: 'green-baked', name: '烘青緑茶', kindId: 'green',
    searchNames: ['烘青', 'baked green tea'],
    profile: prof([e('green-leaf', 'normal'), e('floral-general', 'normal'), e('chestnut', 'normal')]),
    evidenceLevel: 'general',
    scopeNote: '総説では烘青緑茶は爽やかさと花の香りが強調されるとされています。個別銘柄の実測ではありません。',
    sourceIds: [Z],
  },
  {
    id: 'green-sun-dried', name: '晒青緑茶', kindId: 'green',
    searchNames: ['晒青', 'sun-dried green tea'],
    profile: prof([e('hay', 'normal'), e('green-leaf', 'weak')]),
    evidenceLevel: 'general',
    scopeNote: '総説では晒青緑茶は日光による干し草様の香りを持ち、全体に香りは穏やかとされています。個別銘柄の実測ではありません。',
    sourceIds: [Z],
  },
  {
    id: 'white-tea', name: '白茶', kindId: 'white',
    searchNames: ['白茶', 'White tea', '白牡丹', '白毫銀針'],
    profile: prof([e('floral-general', 'normal'), e('green-leaf', 'normal'), e('fruit-general', 'normal'), e('honey', 'normal')]),
    evidenceLevel: 'general',
    scopeNote: '総説では白茶は爽やか・花・果実・甘い香りとされ、フェニルアセトアルデヒドが蜂蜜様の香りに関連します。白牡丹・白毫銀針など等級固有の実測ではありません。',
    sourceIds: [Z],
  },
  {
    id: 'yellow-tea', name: '黄茶', kindId: 'yellow',
    searchNames: ['黄茶', 'Yellow tea', '君山銀針', '蒙頂黄芽'],
    profile: prof([e('dried-flower', 'strong'), e('corn', 'normal'), e('floral-general', 'normal'), e('fruit-general', 'normal'), e('honey', 'normal')]),
    evidenceLevel: 'general',
    scopeNote: '総説では黄茶はポプリ様・とうもろこし様の香りが中心で、花・果実・甘い香りが伴うとされています。また悶黄により渋味が和らぐ方向の変化が述べられています（味覚の強度としては未収録）。',
    sourceIds: [Z],
  },
  {
    id: 'oolong-tea', name: '烏龍茶（青茶）', kindId: 'oolong',
    searchNames: ['烏龍茶', '青茶', 'Oolong', '铁观音', '大紅袍', '鳳凰単叢'],
    profile: prof([e('floral-general', 'strong'), e('fruit-general', 'normal'), e('green-leaf', 'normal'), e('honey', 'normal')]),
    evidenceLevel: 'general',
    scopeNote: '総説では烏龍茶は花・果実・爽やかな香りが特徴とされています。鉄観音・大紅袍など個別銘柄の実測ではありません。',
    sourceIds: [Z],
  },
  {
    id: 'black-tea', name: '紅茶', kindId: 'black',
    searchNames: ['紅茶', 'Black tea', '祁門', '滇紅', '正山小種'],
    profile: prof([e('honey', 'normal'), e('floral-general', 'normal'), e('fruit-general', 'normal')]),
    evidenceLevel: 'general',
    scopeNote: '総説では紅茶は甘い・花・果実の香りとされ、発酵の過程で青草様の香りから甘い花・果実の香りへ移ると説明されています。個別銘柄の実測ではありません。',
    sourceIds: [Z],
  },
  {
    id: 'dark-tea', name: '黒茶', kindId: 'dark',
    searchNames: ['黒茶', 'Dark tea', 'プーアル茶', '普洱茶', '六堡茶', '茯磚茶'],
    profile: prof([e('wood', 'strong'), e('earth', 'normal'), e('toast', 'weak')]),
    evidenceLevel: 'general',
    scopeNote: '総説では黒茶の陳香（熟成した香り）は木質・古い・焙煎のニュアンスを含むとされています。プーアル茶・六堡茶など個別茶の実測ではありません。菌花香など種類による違いも知られていますが、ここでは共通範囲のみを示します。',
    sourceIds: [Z],
  },
]
export const teaById = (id: string) => teaItems.find((t) => t.id === id)
