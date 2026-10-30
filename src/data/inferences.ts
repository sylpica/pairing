import type { InferredSpecific, NoteInference } from '../types'

// 花・果物の具体名への「科学的な推測」データ。実測プロファイル（teas.ts / chocolates.ts）とは
// 別ファイル・別型で保持し、表示でも「推測（未検証）」と明示して分離する。
// 推論の方法と根拠・不採用の判断は docs/research/floral-fruit-inference.md に記録。
// 制約（テストで自動検査）:
// - 対象は漠然としたノート（floral-general / tropical / fruit-general）のみ
// - 根拠成分は、そのアイテムの茶類・種類で確認済み（compoundTier で tier 2 以内）のものだけ
// - 具体名の香り記述が参考情報（記事・データベース等）を含む場合は basisGrading で明示する

const ROSE_GERANIOL_TEA: InferredSpecific = {
  label: 'バラ',
  basisCompoundIds: ['geraniol'],
  rationale: 'ゲラニオールは総説（Zeng et al. 2025）の成分表で「バラ様・柑橘様」と記述され、六大茶類すべてで OAV>1 の重要香気成分とされています。この茶類で確認されている成分の顔ぶれから、花様の香りの一部にバラに似たニュアンスが含まれる可能性があります。',
  basisGrading: 'peer-reviewed',
  estimation: 'inferred',
}
const JASMINE_MJ_GREEN: InferredSpecific = {
  label: 'ジャスミン',
  basisCompoundIds: ['methyl-jasmonate'],
  rationale: '(Z)-ジャスモン酸メチルはジャスミンの花の香りを特徴づける成分として知られ、煎茶の AEDA で最も高い FD値を示した成分群の一つとして、花様の香りをもつ成分と同定されています（Kumazawa & Masuda 1999）。緑茶の花様の香りには、ジャスミンに似たニュアンスが含まれる可能性があります。',
  basisGrading: 'peer-reviewed',
  estimation: 'inferred',
}
const CITRUS_LINALOOL_TEA: InferredSpecific = {
  label: '柑橘類',
  basisCompoundIds: ['linalool'],
  rationale: 'リナロールは総説（Zeng et al. 2025）の成分表で「柑橘様・花様」と記述され、六大茶類すべてで OAV>1 の重要香気成分とされています。この茶類で確認されているリナロールの存在から、果実様の香りの一部に柑橘の皮のようなニュアンスが含まれる可能性があります。',
  basisGrading: 'peer-reviewed',
  estimation: 'inferred',
}
const greenFloral: InferredSpecific[] = [ROSE_GERANIOL_TEA, JASMINE_MJ_GREEN]

export const noteInferences: NoteInference[] = [
  // ===== 緑茶（花様）: ゲラニオール→バラ、(Z)-ジャスモン酸メチル→ジャスミン =====
  { itemSide: 'tea', itemId: 'green-pan-fired', noteId: 'floral-general', specifics: greenFloral },
  { itemSide: 'tea', itemId: 'green-steamed', noteId: 'floral-general', specifics: greenFloral },
  { itemSide: 'tea', itemId: 'green-baked', noteId: 'floral-general', specifics: greenFloral },
  { itemSide: 'tea', itemId: 'sencha', noteId: 'floral-general', specifics: greenFloral },
  { itemSide: 'tea', itemId: 'matcha', noteId: 'floral-general', specifics: greenFloral },
  { itemSide: 'tea', itemId: 'gyokuro', noteId: 'floral-general', specifics: greenFloral },
  // ===== 白茶 =====
  {
    itemSide: 'tea', itemId: 'white-tea', noteId: 'floral-general',
    specifics: [
      {
        label: 'バラ',
        basisCompoundIds: ['2-phenylethanol', 'geraniol'],
        rationale: 'フェニルエチルアルコールは白茶で GC-O の最高水準の香気強度を示し、「花様で甘い香り」「ワックス様でバラ様」と記述されています（Chen et al. 2020／Raza et al. 2025）。ゲラニオールも総説でバラ様とされる、お茶全般で確認されている成分です。白茶の花様の香りには、バラに似たニュアンスが含まれる可能性があります。',
        basisGrading: 'peer-reviewed',
        estimation: 'inferred',
      },
      {
        label: 'すみれ',
        basisCompoundIds: ['beta-ionone'],
        rationale: 'β-イオノンは単体ではすみれ様の花香が代表的な記述で、白茶の香気特性を分ける主要オドラントの一つです（Chen et al. 2020）。花様の香りにはすみれに似たニュアンスが含まれる可能性があります。ただし寄与は試料で大きく変わり、r-OAV が1未満の試料もあります（Raza et al. 2025）。',
        basisGrading: 'peer-reviewed',
        estimation: 'inferred',
      },
    ],
  },
  {
    itemSide: 'tea', itemId: 'white-tea', noteId: 'fruit-general',
    specifics: [
      {
        label: 'りんご',
        basisCompoundIds: ['trans-2-hexenal'],
        rationale: '(E)-2-ヘキセナールは雲南白茶の GC-O で「りんご様・緑」と記述され、香気活性が確認されています（Raza et al. 2025）。白茶の果実様の香りには、青りんごに似たニュアンスが含まれる可能性があります。',
        basisGrading: 'peer-reviewed',
        estimation: 'inferred',
      },
      CITRUS_LINALOOL_TEA,
    ],
  },
  // ===== 黄茶・烏龍茶・紅茶 =====
  { itemSide: 'tea', itemId: 'yellow-tea', noteId: 'floral-general', specifics: [ROSE_GERANIOL_TEA] },
  { itemSide: 'tea', itemId: 'yellow-tea', noteId: 'fruit-general', specifics: [CITRUS_LINALOOL_TEA] },
  { itemSide: 'tea', itemId: 'oolong-tea', noteId: 'floral-general', specifics: [ROSE_GERANIOL_TEA] },
  { itemSide: 'tea', itemId: 'oolong-tea', noteId: 'fruit-general', specifics: [CITRUS_LINALOOL_TEA] },
  { itemSide: 'tea', itemId: 'black-tea', noteId: 'floral-general', specifics: [ROSE_GERANIOL_TEA] },
  { itemSide: 'tea', itemId: 'black-tea', noteId: 'fruit-general', specifics: [CITRUS_LINALOOL_TEA] },
  // ===== 鳳凰単叢 =====
  {
    itemSide: 'tea', itemId: 'fenghuang-dancong', noteId: 'floral-general',
    specifics: [
      {
        label: 'クチナシ',
        basisCompoundIds: ['hotrienol'],
        rationale: 'ホトリエノールは鳳凰単叢の茶液の GC-O で「クチナシ様・ミント」と記述され、香気強度4を示しました（Kun et al. 2025）。単叢の花様の香りには、クチナシに似たニュアンスが含まれる可能性があります。ただし同研究では OAV は1未満とされており、寄与の大きさには留保があります。',
        basisGrading: 'peer-reviewed',
        estimation: 'inferred',
      },
      {
        label: 'ジャスミン',
        basisCompoundIds: ['jasmine-lactone'],
        rationale: 'ジャスミンラクトンは鳳凰単叢で最も豊富な成分の一つで、香型を分けるマーカー候補に挙げられています（Qin et al. 2023）。お茶の揮発成分の記述表では「ジャスミン様・花様」とされており（Shi et al. 2019）、花様の香りにはジャスミンに似たニュアンスが含まれる可能性があります。',
        basisGrading: 'peer-reviewed',
        estimation: 'inferred',
      },
      {
        label: 'バラ',
        basisCompoundIds: ['geraniol'],
        rationale: 'ゲラニオールは鳳凰単叢のカップアロマの GC-O でも強い香気強度を示した成分で（Kun et al. 2025）、総説の成分表では「バラ様・柑橘様」と記述されます（Zeng et al. 2025）。花様の香りの一部にバラに似たニュアンスが含まれる可能性があります。',
        basisGrading: 'peer-reviewed',
        estimation: 'inferred',
      },
    ],
  },
  {
    itemSide: 'tea', itemId: 'fenghuang-dancong', noteId: 'tropical',
    specifics: [
      {
        label: 'ココナッツ',
        basisCompoundIds: ['jasmine-lactone'],
        rationale: 'ジャスミンラクトンの単叢での存在は査読論文で確認されています（Qin et al. 2023）。ただし「ココナッツ様」という香りの記述は査読論文の記述表（ジャスミン様・花様）にはなく、香料データベース等の参考情報に基づきます。トロピカルとされる香りの一部に、ココナッツに似たニュアンスが含まれる可能性があります。具体名の裏付けは参考情報の格付けである点に注意してください。',
        basisGrading: 'reference-assisted',
        estimation: 'inferred',
      },
    ],
  },
  // ===== チョコレート =====
  {
    itemSide: 'chocolate', itemId: 'fine-flavor-chocolate', noteId: 'fruit-general',
    specifics: [
      {
        label: 'いちご',
        basisCompoundIds: ['furaneol'],
        rationale: 'フラネオールはダークチョコレートの GC-O で「キャラメル・いちご様」と記述された主要香気成分です（Deuscher et al. 2020）。ファインフレーバーカカオで果実様とされる香りには、いちごに似たニュアンスが含まれる可能性があります。',
        basisGrading: 'peer-reviewed',
        estimation: 'inferred',
      },
    ],
  },
]

/** 指定アイテム×ノートの推測（なければ空配列）。実測データとは常に別経路で取得する。 */
export function inferencesFor(itemSide: 'tea' | 'chocolate', itemId: string, noteId: string): InferredSpecific[] {
  return noteInferences.find((r) => r.itemSide === itemSide && r.itemId === itemId && r.noteId === noteId)?.specifics ?? []
}
