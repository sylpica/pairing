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
  { id: 'sencha-form', name: '煎茶', category: 'form', aliases: ['Sencha'], note: '蒸青緑茶の一種（日本）。Tan et al. 2019 に基づく一般的特徴を収録（品種固有の実測ではない）。' },
  { id: 'gyokuro-form', name: '玉露', category: 'form', aliases: ['Gyokuro'], note: '被覆栽培の蒸青緑茶（日本）。Tan et al. 2019 に基づく一般的特徴を収録（品種固有の実測ではない）。' },
  { id: 'matcha-form', name: '抹茶', category: 'form', aliases: ['Matcha'], note: '碾茶を粉末にしたもの。Tan et al. 2019 に基づく一般的特徴を収録（品種固有の実測ではない）。' },
  { id: 'hojicha-form', name: 'ほうじ茶', category: 'form', aliases: ['Hojicha', '焙じ茶'], note: '緑茶を焙煎したもの。Tan et al. 2019 に基づく一般的特徴を収録。' },
]

const Z = 'zeng-2025-tea-vocs'
const prof = (aromas: FlavorProfile['aromas'], tastes?: Partial<FlavorProfile['tastes']>, temporal?: Partial<FlavorProfile['temporal']>): FlavorProfile => ({ aromas, tastes: { ...emptyTastes(), ...(tastes ?? {}) }, temporal: { ...emptyTemporal(), ...(temporal ?? {}) } })
const astringentFinish: Partial<FlavorProfile['temporal']> = {
  finish: { text: '渋みは飲んだ後に残って感じられやすく、繰り返し飲むと積み上がっていく可能性があります。これはワインでの時間強度法の実証と、茶とチョコに共通するフラバノール類の知見からの推測で、お茶での直接測定ではありません。感じ方には個人差も大きいとされています。', basis: 'general', sourceIds: ['ross-2007-wine-astringency-buildup', 'lesschaeve-2005-polyphenols-astringency'], estimated: true },
}
// 時間変化（2026-10-31 文献拡張ラインBの材料で拡充）。
// 緑茶の段：中国高級緑茶の温度別 TDS（Qiu et al. 2025）と日本緑茶の温度別呈示の
// 官能研究（Pramudya & Seo 2018）に基づく「淹れたて」、韓国緑茶の浸出回数研究
// （Lee et al. 2013）と温度で甘味の感じ方が変わる一般原理（TRPM5）からの「中盤」。
const greenFirstStage: FlavorProfile['temporal']['first'] = {
  text: '淹れたての熱い状態では香りが最も立ちます。中国の高級緑茶では、熱いうち（熱嗅）に優位な香りの属性が、冷めていく段階（温嗅・冷嗅）とは異なることが TDS で測られています。日本緑茶の温度別呈示の官能研究でも、高温では香り・甘味・うま味・渋味をより強く知覚しました。',
  basis: 'sensory', sourceIds: ['qiu-2025-green-tea-aroma-tds', 'pramudya-2018-green-tea-temperature-cata'],
}
const greenMiddleStage: FlavorProfile['temporal']['middle'] = {
  text: '煎を重ねると、香りや渋味などの官能属性は回数とともに弱まっていきます（韓国産緑茶を最大5回浸出した記述分析と成分分析）。また茶液が冷めていく過程では、甘味に関わる受容体 TRPM5 の温度応答のため、甘味の感じ方自体が変化していくと考えられます（後半は一般原理からの推測です）。',
  basis: 'general', sourceIds: ['lee-2013-korean-green-tea-infusions', 'talavera-2005-trpm5-temperature'], estimated: true,
}
const greenTemporal: Partial<FlavorProfile['temporal']> = {
  first: greenFirstStage, middle: greenMiddleStage, ...astringentFinish,
}
// 白茶の段：貯蔵年数系列の実測（緊圧白茶1–16年、白牡丹0–11年）に基づく。
const whiteTemporal: FlavorProfile['temporal'] = {
  first: { text: '新しい白茶は、甘い・果実様・花様の香りが中心です（緊圧白茶の年数系列の若い側の記述）。白牡丹の官能でも、新しいものは grassy（草様）・fruity（果実様）と評価されました。', basis: 'sensory', sourceIds: ['wang-2022-compressed-white-tea-storage-aroma', 'li-2026-bai-mudan-aging-multiomics'] },
  middle: { text: '貯蔵が進むと香りは移行します。緊圧白茶（寿眉）では、甘い／果実様／花様から、陳香（熟成した香り）を経て、木様・薬草様へと年数とともに変化しました。アルコール類は1–5年、エステル類は7–13年、アルデヒド類は16年で最多でした。', basis: 'sensory', sourceIds: ['wang-2022-compressed-white-tea-storage-aroma'] },
  finish: { text: '長期貯蔵の側では、白牡丹で cedrol と isophorone が陳年の特徴香気成分とされました（rOAV 等の基準）。成分では、テアニンとフラバン-3-オールから生成する EPSF が貯蔵期間と正相関し、貯蔵年数の化学的指標になります（香気ではなく非揮発成分のマーカーです）。', basis: 'measured', sourceIds: ['li-2026-bai-mudan-aging-multiomics', 'dai-2018-stored-white-tea-epsf'] },
}
// 黄茶・黒茶は、その茶類自体の飲用時の時間変化の実測が未確認のため、
// 緑茶・ワイン等で確認された知見からの推測として明示して埋める。
const yellowTemporal: FlavorProfile['temporal'] = {
  first: { text: '黄茶そのものの時間変化の実測は確認できていません。緑茶での知見からの推測では、淹れたての熱い状態で香りが最も立ち、高温では甘味・うま味・渋味も強く感じられると考えられます（日本緑茶の温度別官能研究からの類推）。', basis: 'general', sourceIds: ['pramudya-2018-green-tea-temperature-cata'], estimated: true },
  middle: { text: '推測：煎を重ねたり冷めていったりする過程では、緑茶と同様に香りや渋味の属性が弱まっていくと考えられます（浸出回数で属性が減少した韓国緑茶の研究と、温度で甘味の感じ方が変わる一般原理からの類推）。', basis: 'general', sourceIds: ['lee-2013-korean-green-tea-infusions', 'talavera-2005-trpm5-temperature'], estimated: true },
  finish: { text: '推測：渋みは飲んだ後に残って感じられやすく、繰り返し飲むと積み上がっていく可能性があります（ワインでの時間強度法の実証とフラバノール類の知見からの類推で、黄茶での直接測定ではありません）。', basis: 'general', sourceIds: ['ross-2007-wine-astringency-buildup', 'lesschaeve-2005-polyphenols-astringency'], estimated: true },
}
const darkTemporal: FlavorProfile['temporal'] = {
  first: { text: '黒茶そのものの飲用時の時間変化の実測は確認できていません。緑茶での知見からの推測では、淹れたての熱い状態で香りが最も立ち、高温では味の要素も強く感じられると考えられます（日本緑茶の温度別官能研究からの類推）。', basis: 'general', sourceIds: ['pramudya-2018-green-tea-temperature-cata'], estimated: true },
  middle: { text: '推測：煎を重ねる過程では、緑茶と同様に抽出される香味の属性が回数とともに変化し弱まっていくと考えられます（浸出回数で属性が減少した韓国緑茶の研究からの類推）。黒茶は貯蔵（陳化）で香味が変わることが製法の前提ですが、個別の貯蔵変化の方向は茶ごとに異なり、ここでは断定しません。', basis: 'general', sourceIds: ['lee-2013-korean-green-tea-infusions'], estimated: true },
  finish: { text: '推測：渋みや苦味は飲んだ後に残って感じられやすく、繰り返し飲むと積み上がっていく可能性があります（ワインでの時間強度法の実証とフラバノール類の知見からの類推で、黒茶での直接測定ではありません）。', basis: 'general', sourceIds: ['ross-2007-wine-astringency-buildup', 'lesschaeve-2005-polyphenols-astringency'], estimated: true },
}
// 烏龍茶の段：武夷岩茶の工夫式・煎ごとの実測（Yang et al. 2025）が土台。
const oolongTemporal: FlavorProfile['temporal'] = {
  first: { text: '工夫式に淹れる烏龍茶では、一煎目の香りが最も豊かです。武夷岩茶（水仙・肉桂）を7煎淹れた実測では、香りは煎ごとに漸減し、4煎目以降に顕著に低下しました。', basis: 'sensory', sourceIds: ['yang-2025-gongfu-infusions'] },
  middle: { text: '煎を重ねる中盤では、香りの総量が下がっていくとともに、残る香りの顔ぶれも変わっていきます。変化の速さは茶と焙煎の程度によって異なります（武夷岩茶での実測の範囲）。', basis: 'sensory', sourceIds: ['yang-2025-gongfu-infusions'] },
  finish: { text: '推測：渋みは飲んだ後に残って感じられやすく、繰り返し飲むと積み上がっていく可能性があります（ワインでの時間強度法の実証とフラバノール類の知見からの類推で、烏龍茶一般での直接測定ではありません）。鳳凰単叢では、余韻としてカップに残る香り（カップアロマ）が別途実測されています。', basis: 'general', sourceIds: ['ross-2007-wine-astringency-buildup', 'lesschaeve-2005-polyphenols-astringency'], estimated: true },
}
const TZ = ['zhang-2020-tea-chemistry-taste', 'ye-2022-bitterness-astringency']
const greenTastes: Partial<FlavorProfile['tastes']> = {
  bitter: { intensity: 'normal', basis: 'review', sourceIds: TZ },
  astringent: { intensity: 'normal', basis: 'review', sourceIds: TZ },
  umami: { intensity: 'normal', basis: 'review', sourceIds: TZ },
}
const e = (noteId: string, intensity: 'weak' | 'normal' | 'strong') => ({ noteId, intensity, basis: 'review' as const, sourceIds: [Z] })

// 香味は Zeng et al. 2025（Foods 14:2574）本文の茶類別記述に基づく総説レベルの一般的特徴。
// 個別品種・商品の実測ではない。強度は総説の記述（支配的/顕著などの表現）を順序尺度へ保守的に読み替えたもの。
export const teaItems: TeaItem[] = [
  {
    id: 'green-pan-fired', name: '釜炒り緑茶（炒青）', kindId: 'green',
    searchNames: ['炒青緑茶', '釜炒り', 'pan-fired green tea', '炒青'],
    profile: prof([e('chestnut', 'strong'), e('toast', 'normal'), e('floral-general', 'normal'), e('green-leaf', 'normal')], greenTastes, greenTemporal),
    evidenceLevel: 'general',
    scopeNote: '総説では炒青緑茶は栗と焙煎の香りが特徴とされ、緑茶全体は花・爽やかさ・栗様の香りが中心と整理されています。個別銘柄の実測ではありません。',
    sourceIds: [Z],
  },
  {
    id: 'green-steamed', name: '蒸し緑茶（蒸青）', kindId: 'green',
    searchNames: ['蒸青緑茶', '蒸し製', 'steamed green tea', '煎茶'],
    profile: prof([e('green-leaf', 'strong'), e('floral-general', 'normal'), e('chestnut', 'normal')], greenTastes, greenTemporal),
    evidenceLevel: 'general',
    scopeNote: '総説では蒸青緑茶は爽やかな香りが際立つとされています。日本の煎茶も蒸青ですが、煎茶固有の実測プロファイルではありません。',
    sourceIds: [Z],
  },
  {
    id: 'green-baked', name: '烘青緑茶', kindId: 'green',
    searchNames: ['烘青', 'baked green tea'],
    profile: prof([e('green-leaf', 'normal'), e('floral-general', 'normal'), e('chestnut', 'normal')], greenTastes, greenTemporal),
    evidenceLevel: 'general',
    scopeNote: '総説では烘青緑茶は爽やかさと花の香りが強調されるとされています。個別銘柄の実測ではありません。',
    sourceIds: [Z],
  },
  {
    id: 'green-sun-dried', name: '晒青緑茶', kindId: 'green',
    searchNames: ['晒青', 'sun-dried green tea'],
    profile: prof([e('hay', 'normal'), e('green-leaf', 'weak')], greenTastes, greenTemporal),
    evidenceLevel: 'general',
    scopeNote: '総説では晒青緑茶は日光による干し草様の香りを持ち、全体に香りは穏やかとされています。個別銘柄の実測ではありません。',
    sourceIds: [Z],
  },
  {
    id: 'white-tea', name: '白茶', kindId: 'white',
    searchNames: ['白茶', 'White tea', '白牡丹', '白毫銀針'],
    profile: prof([e('floral-general', 'normal'), e('green-leaf', 'normal'), e('fruit-general', 'normal'), e('honey', 'normal')], undefined, whiteTemporal),
    evidenceLevel: 'general',
    scopeNote: '総説では白茶は爽やか・花・果実・甘い香りとされ、フェニルアセトアルデヒドが蜂蜜様の香りに関連します。白牡丹・白毫銀針など等級固有の実測ではありません。',
    sourceIds: [Z],
  },
  {
    id: 'yellow-tea', name: '黄茶', kindId: 'yellow',
    searchNames: ['黄茶', 'Yellow tea', '君山銀針', '蒙頂黄芽'],
    profile: prof([e('dried-flower', 'strong'), e('corn', 'normal'), e('floral-general', 'normal'), e('fruit-general', 'normal'), e('honey', 'normal')], undefined, yellowTemporal),
    evidenceLevel: 'general',
    scopeNote: '総説では黄茶はポプリ様・とうもろこし様の香りが中心で、花・果実・甘い香りが伴うとされています。また悶黄により渋味が和らぐ方向の変化が述べられています（味覚の強度としては未収録）。',
    sourceIds: [Z],
  },
  {
    id: 'oolong-tea', name: '烏龍茶（青茶）', kindId: 'oolong',
    searchNames: ['烏龍茶', '青茶', 'Oolong', '铁观音', '大紅袍', '鳳凰単叢'],
    profile: prof([e('floral-general', 'strong'), e('fruit-general', 'normal'), e('green-leaf', 'normal'), e('honey', 'normal')], undefined, oolongTemporal),
    evidenceLevel: 'general',
    scopeNote: '総説では烏龍茶は花・果実・爽やかな香りが特徴とされています。鉄観音・大紅袍など個別銘柄の実測ではありません。煎ごとの変化については、武夷岩茶（水仙・肉桂）を功夫茶式に7煎淹れた実測で、香りは煎ごとに漸減し4煎目以降に顕著に低下しました（Yang et al. 2025）。',
    sourceIds: [Z],
  },
  {
    id: 'black-tea', name: '紅茶', kindId: 'black',
    searchNames: ['紅茶', 'Black tea', '祁門', '滇紅', '正山小種'],
    profile: prof([e('honey', 'normal'), e('floral-general', 'normal'), e('fruit-general', 'normal')], {
      bitter: { intensity: 'normal', basis: 'sensory', sourceIds: ['scharbert-2005-black-tea-taste'] },
      astringent: { intensity: 'normal', basis: 'sensory', sourceIds: ['scharbert-2005-black-tea-taste', 'scharbert-2004-theaflavins'] },
    }, {
      first: { text: '紅茶そのものの飲用時の時間変化の時系列実測は確認できていません。緑茶での知見からの推測では、淹れたての熱い状態で香りが最も立ち、高温では甘味・うま味・渋味も強く感じられると考えられます（日本緑茶の温度別官能研究からの類推）。', basis: 'general', sourceIds: ['pramudya-2018-green-tea-temperature-cata'], estimated: true },
      middle: { text: '推測：冷めていく過程では、甘味に関わる受容体 TRPM5 の温度応答のため甘味の感じ方が変化していくと考えられます。なお貯蔵でも香りは変化し、祁門紅茶では1年の貯蔵でジメチルスルフィドが失われることが実測されています（新茶にのみ検出）。', basis: 'general', sourceIds: ['talavera-2005-trpm5-temperature', 'tao-2022-keemun-black-tea-storage'], estimated: true },
      finish: { text: 'テアフラビン類の渋みは口にまとわりつくように長く持続すると官能評価されています（Scharbert et al. 2004）。また渋みは繰り返し飲むと積み上がっていく性質がワインで実証されており、紅茶でも同様の経過が考えられます（後半は推測です）。', basis: 'sensory', sourceIds: ['scharbert-2004-theaflavins', 'ross-2007-wine-astringency-buildup'], estimated: true },
    }),
    evidenceLevel: 'general',
    scopeNote: '総説では紅茶は甘い・花・果実の香りとされ、発酵の過程で青草様の香りから甘い花・果実の香りへ移ると説明されています。個別銘柄の実測ではありません。味覚（苦味・渋み）は紅茶浸出液の再構成・除去実験（Scharbert & Hofmann 2005）で主要呈味成分が検証されており、渋みには低閾値のテアフラビン類も関わります（Scharbert et al. 2004、位置づけは研究間で異なります）。',
    sourceIds: [Z],
  },
  {
    id: 'dark-tea', name: '黒茶', kindId: 'dark',
    searchNames: ['黒茶', 'Dark tea', 'プーアル茶', '普洱茶', '六堡茶', '茯磚茶'],
    profile: prof([e('wood', 'strong'), e('earth', 'normal'), e('toast', 'weak')], undefined, darkTemporal),
    evidenceLevel: 'general',
    scopeNote: '総説では黒茶の陳香（熟成した香り）は木質・古い・焙煎のニュアンスを含むとされています。プーアル茶・六堡茶など個別茶の実測ではありません。菌花香など種類による違いも知られていますが、ここでは共通範囲のみを示します。',
    sourceIds: [Z],
  },
  {
    id: 'sencha', name: '煎茶', kindId: 'green',
    searchNames: ['煎茶', 'Sencha', 'せんちゃ'],
    profile: prof([
      { noteId: 'green-leaf', intensity: 'strong', basis: 'sensory', sourceIds: ['tan-2019-japanese-green-tea'] },
      { noteId: 'floral-general', intensity: 'normal', basis: 'sensory', sourceIds: ['tan-2019-japanese-green-tea'] },
    ], greenTastes, greenTemporal),
    evidenceLevel: 'general',
    scopeNote: 'Tan et al. 2019 が市販の煎茶・抹茶・玉露・ほうじ茶を同一手法で比べた研究に基づきます。蒸し製の茶は葉様の香りが強く花様のノートも高いと評価されました。主要香気成分としてはインドールとメチオナールが挙げられています。品種・産地固有の実測ではありません。味覚は別途、総説（Zhang et al. 2020／Ye et al. 2022）に基づく緑茶としての一般的傾向（カテキン・カフェインの苦味、ガロイル化カテキンの渋み、テアニン等のうま味）を収録しています。',
    sourceIds: ['tan-2019-japanese-green-tea'],
  },
  {
    id: 'matcha', name: '抹茶', kindId: 'green',
    searchNames: ['抹茶', 'Matcha', 'まっちゃ'],
    profile: prof([
      { noteId: 'green-leaf', intensity: 'strong', basis: 'sensory', sourceIds: ['tan-2019-japanese-green-tea'] },
      { noteId: 'floral-general', intensity: 'normal', basis: 'sensory', sourceIds: ['tan-2019-japanese-green-tea'] },
    ], {
      umami: { intensity: 'normal', basis: 'sensory', sourceIds: ['kaneko-2006-matcha-umami'] },
      bitter: { intensity: 'weak', basis: 'review', sourceIds: ['ye-2022-bitterness-astringency'] },
      astringent: { intensity: 'weak', basis: 'review', sourceIds: ['ye-2022-bitterness-astringency'] },
    }, {
      first: greenFirstStage,
      middle: { text: '抹茶は茶葉ごと飲む懸濁液のため、煎を重ねる変化はありません。冷めていく過程では、甘味に関わる受容体 TRPM5 の温度応答のため、甘味の感じ方が変化していくと考えられます（一般原理からの推測）。また抹茶は貯蔵の間に色調・成分が変化することが韓国産抹茶で測定されています（官能評価はありません）。', basis: 'general', sourceIds: ['talavera-2005-trpm5-temperature', 'kim-2020-matcha-storage-quality'], estimated: true },
      finish: { text: '渋みは飲んだ後に残って感じられやすく、繰り返し飲むと積み上がっていく可能性があります。これはワインでの時間強度法の実証と、茶とチョコに共通するフラバノール類の知見からの推測で、お茶での直接測定ではありません。感じ方には個人差も大きいとされています。なお、碾茶・玉露などの覆い下茶は冷蔵保存でおよそ6箇月かけて熟成し、うま味やまろやかさが増すことが官能検査で確認されています（京都府農林水産技術センター茶業研究所）。', basis: 'general', sourceIds: ['ross-2007-wine-astringency-buildup', 'lesschaeve-2005-polyphenols-astringency', 'kyoto-2014-covered-tea-maturation'], estimated: true },
    }),
    evidenceLevel: 'general',
    scopeNote: 'Tan et al. 2019 に基づきます。蒸し製の茶として葉様の香りが強く花様のノートも高い群に入り、主要香気成分としてはノナナールが最も高い FD値を示しました。中国・山東産抹茶の研究（Luo et al. 2022）は日本産抹茶のデータとしては使っていません。品種・等級固有の実測ではありません。うま味は高級抹茶を対象に官能試験で寄与成分（テアニン等）が同定された研究（Kaneko et al. 2006）に基づき、苦味・渋みは被覆栽培で抑えられる方向を総説（Ye et al. 2022）が支持しています。',
    sourceIds: ['tan-2019-japanese-green-tea'],
  },
  {
    id: 'gyokuro', name: '玉露', kindId: 'green',
    searchNames: ['玉露', 'Gyokuro', 'ぎょくろ'],
    profile: prof([
      { noteId: 'green-leaf', intensity: 'strong', basis: 'sensory', sourceIds: ['tan-2019-japanese-green-tea'] },
      { noteId: 'floral-general', intensity: 'normal', basis: 'sensory', sourceIds: ['tan-2019-japanese-green-tea'] },
    ], {
      umami: { intensity: 'normal', basis: 'review', sourceIds: TZ },
      bitter: { intensity: 'weak', basis: 'review', sourceIds: ['ye-2022-bitterness-astringency'] },
      astringent: { intensity: 'weak', basis: 'review', sourceIds: ['ye-2022-bitterness-astringency'] },
    }, {
      first: greenFirstStage,
      middle: greenMiddleStage,
      finish: { text: '渋みは飲んだ後に残って感じられやすく、繰り返し飲むと積み上がっていく可能性があります。これはワインでの時間強度法の実証と、茶とチョコに共通するフラバノール類の知見からの推測で、お茶での直接測定ではありません。感じ方には個人差も大きいとされています。なお、玉露を含む覆い下茶は冷蔵保存でおよそ6箇月かけて熟成し、うま味やまろやかさが増すことが官能検査で確認されています（京都府農林水産技術センター茶業研究所）。', basis: 'general', sourceIds: ['ross-2007-wine-astringency-buildup', 'lesschaeve-2005-polyphenols-astringency', 'kyoto-2014-covered-tea-maturation'], estimated: true },
    }),
    evidenceLevel: 'general',
    scopeNote: 'Tan et al. 2019 に基づきます。蒸し製の茶として葉様の香りが強く、主要香気成分としてはインドールが挙げられています。被覆栽培の条件や品種固有の実測ではありません。味覚は玉露固有の呈味研究ではなく、被覆栽培の緑茶としての一般的傾向を総説（Zhang et al. 2020／Ye et al. 2022）に基づき収録しています（被覆で苦味・渋みが抑えられ、テアニン等のうま味成分が関わります）。',
    sourceIds: ['tan-2019-japanese-green-tea'],
  },
  {
    id: 'hojicha', name: 'ほうじ茶', kindId: 'green',
    searchNames: ['ほうじ茶', '焙じ茶', 'Hojicha'],
    profile: prof([
      { noteId: 'toast', intensity: 'strong', basis: 'sensory', sourceIds: ['tan-2019-japanese-green-tea'] },
      { noteId: 'wood', intensity: 'strong', basis: 'sensory', sourceIds: ['tan-2019-japanese-green-tea'] },
    ], {
      bitter: { intensity: 'weak', basis: 'review', sourceIds: ['ye-2022-bitterness-astringency'] },
      astringent: { intensity: 'weak', basis: 'review', sourceIds: ['ye-2022-bitterness-astringency'] },
    }, greenTemporal),
    evidenceLevel: 'general',
    scopeNote: 'Tan et al. 2019 に基づきます。ほうじ茶は焙煎様と木様のノートがともに高く、主要香気成分としてピラジン類（2,3-diethyl-5-methylpyrazine 等）が突出していました。個別商品の焙煎条件による違いは反映していません。苦味・渋みは、焙煎で低下する方向を総説（Ye et al. 2022）が支持しています。',
    sourceIds: ['tan-2019-japanese-green-tea'],
  },
  {
    id: 'fenghuang-dancong', name: '鳳凰単叢（烏龍茶）', kindId: 'oolong',
    searchNames: ['鳳凰単叢', '凤凰单丛', 'Fenghuang Dancong', '単叢'],
    profile: {
      aromas: [
        { noteId: 'floral-general', intensity: 'strong', basis: 'sensory', sourceIds: ['kun-2025-dancong-cup-aroma'] },
        { noteId: 'tropical', intensity: 'normal', basis: 'sensory', sourceIds: ['kun-2025-dancong-cup-aroma'] },
      ],
      tastes: emptyTastes(),
      temporal: {
        first: { text: '鳳凰単叢そのものの煎ごとの時系列実測は確認できていません。同じ青茶の武夷岩茶での実測からの推測では、一煎目の香りが最も豊かで、煎ごとに漸減すると考えられます（4煎目以降に顕著に低下）。', basis: 'general', sourceIds: ['yang-2025-gongfu-infusions'], estimated: true },
        middle: { text: '推測：煎を重ねる中盤では、香りの総量が下がっていくとともに残る香りの顔ぶれも変わっていくと考えられます（武夷岩茶の工夫式7煎の実測からの類推）。', basis: 'general', sourceIds: ['yang-2025-gongfu-infusions'], estimated: true },
        finish: { text: '飲み終えたカップに残る香り（カップアロマ）は、茶液の香りとは異なり、花蜜様・生姜様・花様が強いと報告されています（Kun et al. 2025、再構成実験で検証）。', basis: 'sensory', sourceIds: ['kun-2025-dancong-cup-aroma'] },
      },
    },
    evidenceLevel: 'general',
    scopeNote: 'Kun et al. 2025（センソミクス）に基づきます。茶液の香りはトロピカルフルーツ様・甘い・花様、カップアロマは花蜜様・生姜様・花様と特徴が異なりました。単叢は香型によって揮発性組成が大きく異なる（9香型の類似度 46.79–95.94%、Li & Wang 2020）ため、これは単一プロファイルではなく研究試料に基づく代表的な整理です。煎ごとの変化については、武夷岩茶での実測（Yang et al. 2025、煎ごとに漸減）からの類推として、単叢でも煎を重ねると香りが変化していくと考えられますが、単叢での直接測定ではありません。',
    sourceIds: ['kun-2025-dancong-cup-aroma', 'li-wang-2020-dancong-types'],
  },
]
export const teaById = (id: string) => teaItems.find((t) => t.id === id)
