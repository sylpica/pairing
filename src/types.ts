export type Intensity = 'weak' | 'normal' | 'strong' | 'unknown'
export type Basis = 'measured' | 'sensory' | 'review' | 'general'
export type EvidenceLevel = 'measured' | 'general' | 'exploratory' | 'insufficient'

export interface Source {
  id: string
  kind: 'original' | 'review' | 'manufacturer' | 'general'
  title: string
  authors: string
  year: number
  journal?: string
  doi?: string
  pmid?: string
  url: string
  scope: string
  license: string
  verified: boolean
}

export interface FlavorCategory { id: string; name: string; color: string; description: string }
export interface FlavorNote { id: string; categoryId: string; name: string; example: string }

export interface ProfileEntry {
  noteId: string
  intensity: Intensity
  basis: Basis
  sourceIds: string[]
}
export type TasteKey = 'sweet' | 'sour' | 'bitter' | 'astringent' | 'umami'
export interface TasteEntry { intensity: Intensity; basis: Basis; sourceIds: string[] }
export type TasteProfile = Record<TasteKey, TasteEntry>
export interface TemporalStage { text: string; basis: Basis; sourceIds: string[]; estimated?: boolean }
export interface FlavorProfile {
  aromas: ProfileEntry[]
  tastes: TasteProfile
  temporal: { first: TemporalStage; middle: TemporalStage; finish: TemporalStage }
}

/** 呈味成分と味覚項目の対応。香気成分の noteIds とは分けて持ち、
 *  evidence には根拠区分（単体の味の知見／試料での寄与実証／一般的推定）を文章で保持する。 */
export interface CompoundTasteLink {
  taste: TasteKey
  evidence: string
}

/** 成分の根拠がどの範囲の試料に基づくか（階層表示用）。
 *  kindId はお茶なら TeaKind.id（'white' 等）、チョコなら ChocolateKind（'dark' 等）。
 *  kindId 省略は「その食品全般」。side 'cacao' は原料（ニブ等）の試料を指す。 */
export interface CompoundScope {
  side: 'tea' | 'chocolate' | 'cacao'
  kindId?: string
}

export interface Compound {
  id: string
  name: string
  aliases: string[]
  noteIds: string[]
  plainDescription: string
  detectedIn: string
  aromaKnowledge: string
  contributionEvidence: string
  sourceIds: string[]
  tasteLinks?: CompoundTasteLink[]
  scopes?: CompoundScope[]
}

/** 花・果物の具体名への「科学的な推測」。実測（ProfileEntry）とは型レベルで分離し、
 *  必ず estimation: 'inferred' を持つ。根拠は、そのアイテム（またはその茶類・種類の試料）で
 *  確認済みの化合物に限定される（docs/research/floral-fruit-inference.md）。 */
export interface InferredSpecific {
  /** 具体名の候補（例: バラ、ジャスミン、ココナッツ） */
  label: string
  /** 根拠となる化合物ID（すべて実在し、そのアイテムで tier 2 以内＝茶類・種類レベルまでに確認済みのもの） */
  basisCompoundIds: string[]
  /** 推論の説明。「〜の可能性」レベルの表現に留め、断定しない */
  rationale: string
  /** 裏付けの格付け: peer-reviewed = 化合物の確認も具体名の香り記述も査読済み出典に基づく /
   *  reference-assisted = 化合物の確認は査読済みだが、具体名の香り記述の一部に記事・データベース等の参考情報を含む */
  basisGrading: 'peer-reviewed' | 'reference-assisted'
  /** 推測であることを型で固定する区分（リテラル必須） */
  estimation: 'inferred'
}

/** 1アイテム×1ノートに対する具体名の推測。推測の対象は漠然としたノート
 *  （花様・トロピカル・果実全般）のみ。具体名が根拠で確定しているノートには付けない。 */
export interface NoteInference {
  itemSide: 'tea' | 'chocolate'
  itemId: string
  noteId: string
  specifics: InferredSpecific[]
}

export type TeaCategory = 'green' | 'white' | 'yellow' | 'oolong' | 'black' | 'dark'
export interface TeaKind { id: string; name: string; category: TeaCategory | 'form'; aliases: string[]; region?: string; note: string }
export interface TeaItem {
  id: string; name: string; kindId: string; cultivarName?: string
  searchNames: string[]; profile: FlavorProfile; evidenceLevel: EvidenceLevel; scopeNote: string; sourceIds: string[]
}
export type ChocolateKind = 'dark' | 'milk' | 'white' | 'ruby' | 'blond' | 'other'
export interface ChocolateItem {
  id: string; name: string; kind: ChocolateKind; cacaoPercent?: number
  searchNames: string[]; profile: FlavorProfile; evidenceLevel: EvidenceLevel; scopeNote: string; sourceIds: string[]
}
export const emptyTastes = (): TasteProfile => ({
  sweet: { intensity: 'unknown', basis: 'general', sourceIds: [] },
  sour: { intensity: 'unknown', basis: 'general', sourceIds: [] },
  bitter: { intensity: 'unknown', basis: 'general', sourceIds: [] },
  astringent: { intensity: 'unknown', basis: 'general', sourceIds: [] },
  umami: { intensity: 'unknown', basis: 'general', sourceIds: [] },
})
export const emptyTemporal = () => ({
  first: { text: '', basis: 'general' as Basis, sourceIds: [] as string[] },
  middle: { text: '', basis: 'general' as Basis, sourceIds: [] as string[] },
  finish: { text: '', basis: 'general' as Basis, sourceIds: [] as string[] },
})

// ===== 品種・系統データベース（追加指示 2026-10-30）=====
// 設計: docs/design/cultivar-data-model.md
// 品種・系統エンティティは FlavorProfile を持たない。表示できるのは出典つきの
// 所見（findings）までとし、科学データ未確認の対象を一般論で埋めない。

export type VerificationStatus = 'confirmed' | 'partial' | 'unconfirmed'
export type ScienceStatus = 'peer-reviewed' | 'partial' | 'unconfirmed'
export interface EntityVerification {
  existence: VerificationStatus
  classification: VerificationStatus
  science: ScienceStatus
}

// 所見の種別。検出（detection）・組成（composition）と寄与（contribution）・
// 官能（sensory）を分離し、「検出≠寄与」の原則を型で担保する。
export type FindingKind = 'detection' | 'composition' | 'contribution' | 'sensory' | 'genetic' | 'classification'
export interface EntityFinding {
  kind: FindingKind
  statement: string
  conditions?: string
  compoundId?: string
  sourceIds: string[]
}
export const FLAVOR_FINDING_KINDS: FindingKind[] = ['detection', 'composition', 'contribution', 'sensory']

export type TeaCultivarRank = 'cultivar' | 'clone' | 'landrace' | 'population' | 'cultivar-group'
export type CultivarOriginType = 'official-breeding' | 'prefectural-selection' | 'private-selection' | 'landrace' | 'introduced-population'
export interface TeaCultivar {
  id: string
  name: string
  originalName?: string
  aliases: string[]
  country: string
  rank: TeaCultivarRank
  originType: CultivarOriginType
  registration?: string
  breeding?: string
  parentCultivarIds?: string[]
  regions: string[]
  verification: EntityVerification
  scienceNote?: string
  findings: EntityFinding[]
  sourceIds: string[]
  note?: string
}

// 品種×茶類の確認済み組み合わせ。品種エンティティには埋め込まない。
// studied = 査読研究の試料として供試が確認でき出典登録済み（sourceIds 必須）
// documented = 公的資料・調査記録で利用・適性が確認できる
export interface CultivarTeaUse {
  cultivarId: string
  kindId: string
  status: 'studied' | 'documented'
  sourceIds: string[]
}

export interface CacaoTraditionalGroup {
  id: string
  name: string
  nameJa: string
  aliases: string[]
  nature: string
  verification: EntityVerification
  scienceNote?: string
  findings: EntityFinding[]
  sourceIds: string[]
  note?: string
}

export interface CacaoGeneticGroup {
  id: string
  name: string
  /** カタカナ表記（選択UIではこちらを主表記にする） */
  nameJa: string
  aliases: string[]
  namingBasis: string
  distribution?: string
  classificationSystem: string
  verification: EntityVerification
  scienceNote?: string
  findings: EntityFinding[]
  sourceIds: string[]
  note?: string
}

export interface CacaoAncestryShare { groupId: string; sharePercent: number }
export interface CacaoClone {
  id: string
  name: string
  aliases: string[]
  origin: string
  breeding?: string
  // 遺伝的背景は単一集団への帰属ではなく混合構成で表す（CCN-51 等）
  ancestry?: CacaoAncestryShare[]
  ancestrySourceIds?: string[]
  // 系列の本拠を示す関連（帰属の断定ではない。根拠は note に記す）
  associatedGroupIds?: string[]
  verification: EntityVerification
  scienceNote?: string
  findings: EntityFinding[]
  sourceIds: string[]
  note?: string
}

// ペアリング予測が「どの階層のデータを使ったか」の記録区分（将来の engine 拡張用）
export type DataLevelUsed = 'cultivar-measured' | 'cultivar-general' | 'origin-measured' | 'group-general' | 'kind-general' | 'insufficient'

// ===== 組み合わせの相互作用（2026-10-30 追加） =====
// 成分の合算予測ではなく、知覚レベルの相互作用（混合抑制、香りによる味の増強、
// 渋味と脂肪の対向など）を、文献で裏付けられたルールで文章化する。
// 根拠・適用条件・限界は docs/research/pairing-interactions.md、エンジンは src/engine/interactions.ts。
export type InteractionKind = 'aroma' | 'taste' | 'mouthfeel'
/** 相互作用文の根拠区分: general = 一般的な知見（メカニズムは実際の飲料・食品でも実証）/
 *  exploratory = 探索的な予想（モデル系・他の食品ペアからの類推） */
export type InteractionLevel = 'general' | 'exploratory'
export interface InteractionStatement {
  /** ルールID（docs/research/pairing-interactions.md の対応表と一致） */
  ruleId: string
  kind: InteractionKind
  /** 本文。言及する香味・味覚は、必ず両プロファイルの実データに基づく */
  text: string
  level: InteractionLevel
  sourceIds: string[]
  /** 花・果物の推測（inferences.ts）を使った文かどうか。true の文は本文に「推測」を含み、画面でも推測バッジを付ける */
  usesInference: boolean
}
export interface InteractionAnalysis {
  aroma: InteractionStatement[]
  taste: InteractionStatement[]
  mouthfeel: InteractionStatement[]
}

// ===== 組み合わせの味わいの性格の推測（2026-10-30 追加） =====
// 相互作用（interactions.ts）の上に置く推測の層。両アイテムで確認されている
// 化合物・香味ノート・味覚の顔ぶれと、発火した相互作用ルールから、組み合わせ全体の
// 「味わいの性格」（アーシー、スパイシー、まろやか、コクがある等）を推測する。
// 実測のプロファイルとも相互作用の文章とも型レベルで分離し、必ず estimation: 'inferred' を持つ。
// 根拠（basis〜）のない性格は生成しない。スコア・順位の数値は持たない。
// 方法と各ルールの根拠は docs/research/pairing-character-inference.md、エンジンは src/engine/pairingCharacter.ts。
export type PairingCharacterKind = 'aroma' | 'taste-mouthfeel'
export interface PairingCharacter {
  /** 性格ID（例: 'earthy', 'mellow'） */
  id: string
  kind: PairingCharacterKind
  /** 表示名（例: アーシー（土っぽい）、まろやか、コクがある） */
  label: string
  /** 推測の説明。「〜の可能性」レベルの表現に留め、断定しない */
  rationale: string
  /** 根拠となる化合物ID（両アイテムのどちらかで、記録された香味・味覚に結びつき確認済みのものだけ） */
  basisCompoundIds: string[]
  /** 根拠となる香味ノートID（どちらかのプロファイルに「普通」以上で記録されたものだけ） */
  basisNoteIds: string[]
  /** 根拠となる味覚キー（どちらかのプロファイルに「普通」以上で記録されたものだけ） */
  basisTasteKeys: TasteKey[]
  /** 根拠となる相互作用ルールID（interactions.ts で実際に発火したものだけ） */
  basisRuleIds: string[]
  /** 根拠の出典（根拠化合物・ノート・味覚・相互作用ルールの出典の和集合。すべて実在する） */
  sourceIds: string[]
  /** 推測であることを型で固定する区分（リテラル必須） */
  estimation: 'inferred'
}
export interface PairingCharacterAnalysis {
  aroma: PairingCharacter[]
  tasteMouthfeel: PairingCharacter[]
}

// ===== 組み合わせページ（第2層：産地×品種×分類の統合推測、2026-10-31 追加） =====
// 設計: docs/design/combination-pages.md
// 第1層（分類プロファイル／品種・系統の所見／産地の所見／製法の科学）を統合して、
// 具体的な組み合わせ（例：長崎×やぶきた×紅茶）の味わいを推測する層。
// ここでのノート・味覚は実測プロファイル（FlavorProfile）とは型レベルで分離し、
// 各要素に根拠レベル（measured / general / inferred）を必須で持たせる。
// スコア・順位の数値は持たない。
export type ComboLevel = 'measured' | 'general' | 'inferred'

/** 組み合わせノート・味覚の根拠の出所区分 */
export type ComboBasisFrom = 'profile' | 'cultivar' | 'region' | 'origin' | 'lineage' | 'process'
export interface ComboBasis {
  from: ComboBasisFrom
  /** 根拠の説明（どの所見・知見から来たか） */
  text: string
  sourceIds: string[]
}

export interface ComboNote {
  noteId: string
  intensity: Intensity
  level: ComboLevel
  basis: ComboBasis[]
  sourceIds: string[]
}

export interface ComboTaste {
  key: TasteKey
  intensity: Intensity
  level: ComboLevel
  /** 味についての説明（分類プロファイルの根拠、または製法科学からの変換の説明） */
  text: string
  sourceIds: string[]
}

export interface ComboStatement {
  text: string
  level: ComboLevel
  sourceIds: string[]
}

/** お茶の地域レベルの産地エンティティ（県・茶区など）。
 * カカオの CacaoOrigin と同型の原則：香味プロファイルは持たず、出典つきの所見まで。
 * 文献で所見のある地域だけを登録する（データが無い地域は作らない）。 */
export interface TeaRegion {
  id: string
  /** 表示名（例：長崎） */
  name: string
  country: string
  /** 上位の区分（例：九州） */
  parentName?: string
  note: string
  /** その地域の試料で香味・成分まで実測があるか（CacaoOrigin と同じ区分） */
  flavorEvidence: OriginFlavorEvidence
  verification: EntityVerification
  scienceNote: string
  findings: EntityFinding[]
  sourceIds: string[]
  /** この地域の所見が直接関係する茶類（組み合わせの成立判定に使う） */
  applicableKindIds: string[]
}

// ===== カカオの産地（2026-10-30 追加） =====
// 産地は品種ではない。産地と遺伝（伝統的分類・遺伝集団・クローン）は多対多の関係にあり、
// 産地名から香味を自動生成しない。香味の根拠レベルは flavorEvidence で明示する:
// 'measured' = その産地の試料で香味（官能・寄与）まで実測がある /
// 'general' = 組成の実測のみ、または集団レベルの知見しかない（一般的傾向として表示） /
// 'none' = 香味の実測所見が確認できていない（表示しない）。
export type OriginFlavorEvidence = 'measured' | 'general' | 'none'

export interface OriginTradeName {
  name: string
  // commercial: 商業・香味の呼称（例: アリバ）／ grade: 発酵等のグレード名（例: サンチェス）
  kind: 'commercial' | 'grade'
  note: string
  /** 商業呼称が歴史的に結び付けられてきた遺伝集団（呼称そのものは遺伝集団名ではない） */
  linkedGeneticGroupId?: string
}

export interface CacaoOrigin {
  id: string
  /** 表示名（国名） */
  name: string
  country: string
  /** 下位地域（実測・資料で確認できるものだけ） */
  regions: { name: string; note: string }[]
  /** 産地に付随する呼称（品種名ではないことを明示して保持する） */
  tradeNames: OriginTradeName[]
  relatedTraditionalIds: string[]
  relatedGeneticGroupIds: string[]
  relatedCloneIds: string[]
  flavorEvidence: OriginFlavorEvidence
  verification: EntityVerification
  scienceNote: string
  findings: EntityFinding[]
  /** 参考情報（メーカー・事業者・団体の発信。査読された実測ではない）。
   * findings（科学的な所見）とは分離して保持し、表示でも区別する。
   * 推測・ペアリングの根拠には使わない。 */
  referenceNotes?: { text: string; sourceIds: string[] }[]
  sourceIds: string[]
  note: string
}
