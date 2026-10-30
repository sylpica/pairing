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
}

export type TeaCategory = 'green' | 'white' | 'yellow' | 'oolong' | 'black' | 'dark'
export interface TeaKind { id: string; name: string; category: TeaCategory | 'form'; aliases: string[]; region?: string; note: string }
export interface TeaItem {
  id: string; name: string; kindId: string; cultivarName?: string
  searchNames: string[]; profile: FlavorProfile; evidenceLevel: EvidenceLevel; scopeNote: string; sourceIds: string[]
}
export type ChocolateKind = 'dark' | 'milk' | 'white' | 'other'
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
export type DataLevelUsed = 'cultivar-measured' | 'cultivar-general' | 'group-general' | 'kind-general' | 'insufficient'
