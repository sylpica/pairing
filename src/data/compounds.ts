import type { Compound } from '../types'

// すべて Zeng et al. 2025 の本文・Table 1（OAV>1 の Key Aroma Compounds）または
// Ac-Pangan et al. 2023 のアブストラクトで確認できる範囲のみ収録する。
// 「検出事実」「香りの知見」「寄与の根拠」を分けて記録する（指示書§7）。
const Z = 'zeng-2025-tea-vocs'
const A = 'acpangan-2023-dark-chocolate-aroma'
export const compounds: Compound[] = [
  {
    id: 'linalool', name: 'リナロール', aliases: ['Linalool'],
    noteIds: ['citrus', 'floral-general'],
    plainDescription: '柑橘と花を思わせる香りの成分です。',
    detectedIn: 'お茶（六大茶類すべてで報告）',
    aromaKnowledge: '総説の成分表で「柑橘様・花様」と記載されています。',
    contributionEvidence: '総説 Table 1 で六大茶類すべてについて OAV>1 の重要香気成分として掲載されています。',
    sourceIds: [Z],
  },
  {
    id: 'geraniol', name: 'ゲラニオール', aliases: ['Geraniol'],
    noteIds: ['rose', 'citrus'],
    plainDescription: 'バラと柑橘を思わせる香りの成分です。',
    detectedIn: 'お茶（六大茶類すべてで報告）',
    aromaKnowledge: '総説の成分表で「バラ様・柑橘様」と記載されています。',
    contributionEvidence: '総説 Table 1 で六大茶類すべてについて OAV>1 の重要香気成分として掲載されています。',
    sourceIds: [Z],
  },
  {
    id: 'benzaldehyde', name: 'ベンズアルデヒド', aliases: ['Benzaldehyde'],
    noteIds: ['almond'],
    plainDescription: '苦いアーモンドのような香りの成分です。',
    detectedIn: 'お茶（緑茶・黄茶・紅茶・黒茶で報告）',
    aromaKnowledge: '総説の成分表で「苦いアーモンド様」と記載されています。',
    contributionEvidence: '総説 Table 1 で緑茶・黄茶・紅茶・黒茶について OAV>1 の重要香気成分として掲載されています。',
    sourceIds: [Z],
  },
  {
    id: 'phenylacetaldehyde', name: 'フェニルアセトアルデヒド', aliases: ['Phenylacetaldehyde', 'Benzeneacetaldehyde'],
    noteIds: ['honey', 'floral-general'],
    plainDescription: '蜂蜜のような甘い香りに関連する成分です。',
    detectedIn: 'お茶（緑茶・白茶・烏龍茶・紅茶・黒茶で報告）',
    aromaKnowledge: '白茶では蜂蜜様の香りをもたらすと総説に記載されています。',
    contributionEvidence: '総説 Table 1 で緑茶・白茶・烏龍茶・紅茶・黒茶について OAV>1 の重要香気成分として掲載されています。',
    sourceIds: [Z],
  },
  {
    id: 'cis-3-hexen-1-ol', name: '(Z)-3-ヘキセン-1-オール', aliases: ['(Z)-3-Hexen-1-ol'],
    noteIds: ['green-leaf'],
    plainDescription: '青葉のような爽やかな香りに関連する成分です。',
    detectedIn: 'お茶（白茶の主要な揮発性成分の一つとして報告）',
    aromaKnowledge: '総説では白茶・黄茶の「フレッシュ」な香りの代表成分として図に示されています。',
    contributionEvidence: '白茶の主要揮発性成分の一つとして総説本文に列挙されています。主要寄与の程度は個別研究の確認が必要です。',
    sourceIds: [Z],
  },
  {
    id: 'methyl-salicylate', name: 'サリチル酸メチル', aliases: ['Methyl salicylate'],
    noteIds: ['fruit-general', 'herb'],
    plainDescription: '爽やかでミントのような香りに関連する成分です。',
    detectedIn: 'お茶（白茶・紅茶などで報告）',
    aromaKnowledge: '白茶では「爽やかでミント様」と総説に記載されています。紅茶では果実様のニュアンスとの相関が総説に記載されています。',
    contributionEvidence: '紅茶の重要香気成分の一つとして総説本文に列挙されています。',
    sourceIds: [Z],
  },
  {
    id: '3-methylbutanal', name: '3-メチルブタナール', aliases: ['3-Methylbutanal'],
    noteIds: ['chestnut', 'malt'],
    plainDescription: '緑茶では栗のような香りに関連付けられる成分です。',
    detectedIn: 'お茶（緑茶）、ダークチョコレート（焙煎）',
    aromaKnowledge: '緑茶の栗様の香りをもたらす成分の一つとして総説に記載されています。',
    contributionEvidence: '焙煎ダークチョコレートでは、未焙煎品と比べて香りへの影響が大きい成分の一つとして原著アブストラクトに記載されています。',
    sourceIds: [Z, A],
  },
  {
    id: '2-ethyl-3-5-dimethylpyrazine', name: '2-エチル-3,5-ジメチルピラジン', aliases: ['2-Ethyl-3,5-dimethylpyrazine'],
    noteIds: ['toast'],
    plainDescription: '焙煎したチョコレートの香ばしさに関わる成分の一つです。',
    detectedIn: 'ダークチョコレート（焙煎）',
    aromaKnowledge: 'この成分自体の香りの言葉は、確認した原著アブストラクトには記載がありません（未確認）。',
    contributionEvidence: '焙煎ダークチョコレートでは、未焙煎品と比べて香りへの影響が大きい成分の一つとして原著アブストラクトに記載されています。',
    sourceIds: [A],
  },
  {
    id: 'acetic-acid', name: '酢酸', aliases: ['Acetic acid'],
    noteIds: [],
    plainDescription: 'お酢のような酸っぱい香りの成分です。カカオの発酵・乾燥の過程で生じます。',
    detectedIn: 'ダークチョコレート（未焙煎・焙煎の両方）',
    aromaKnowledge: '官能評価では「ビネガー（酢）」の香りとして評価項目に含まれていました。',
    contributionEvidence: '未焙煎・焙煎の両方で最も高い OAV を示し、未焙煎品でよりよく保持されていたと原著アブストラクトに記載されています。',
    sourceIds: [A],
  },
]
export const compoundById = (id: string) => compounds.find((c) => c.id === id)
