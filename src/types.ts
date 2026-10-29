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
