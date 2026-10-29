import type { FlavorProfile, EvidenceLevel, TasteKey } from '../types'
import { noteById } from '../data/flavors'

export interface PairingResult {
  level: EvidenceLevel
  sharedNotes: { noteId: string; name: string }[]
  sharedCategories: { categoryId: string }[]
  contrasts: { label: string; detail: string }[]
  message: string
}

const rank = (i: string) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)
export const TASTE_LABELS: Record<TasteKey, string> = { sweet: '甘味', sour: '酸味', bitter: '苦味', astringent: '渋味', umami: 'うま味' }

/**
 * ルールベースのペアリング探索（docs/design/pairing-engine.md）。
 * 香味成分の合算や相性スコアは出さない。共通点と対比の「候補」を、
 * 根拠区分（探索的予想／情報不足）とともに返すだけである。
 * 根拠: Spence 2020 の批判的総説（共有香味分子による予測は支持されていない）。
 */
export function analyzePairing(tea: FlavorProfile, choco: FlavorProfile): PairingResult {
  const teaKnown = tea.aromas.filter((a) => rank(a.intensity) >= 2)
  const chocoKnown = choco.aromas.filter((a) => rank(a.intensity) >= 2)
  if (teaKnown.length === 0 || chocoKnown.length === 0) {
    return {
      level: 'insufficient', sharedNotes: [], sharedCategories: [], contrasts: [],
      message: 'どちらかの香味データが不足しているため、組み合わせの特徴を示せません。これは相性が悪いのではなく、根拠が足りないという意味です。',
    }
  }
  const chocoNoteIds = new Set(chocoKnown.map((a) => a.noteId))
  const sharedNotes = teaKnown
    .filter((a) => chocoNoteIds.has(a.noteId))
    .map((a) => ({ noteId: a.noteId, name: noteById(a.noteId)?.name ?? a.noteId }))

  const teaCats = new Map(teaKnown.map((a) => [noteById(a.noteId)?.categoryId ?? '', a]))
  const chocoCats = new Map(chocoKnown.map((a) => [noteById(a.noteId)?.categoryId ?? '', a]))
  const sharedCategories = [...teaCats.keys()].filter((c) => c && chocoCats.has(c) && !sharedNotes.some((s) => noteById(s.noteId)?.categoryId === c)).map((categoryId) => ({ categoryId }))

  const contrasts: PairingResult['contrasts'] = []
  for (const [cat, entry] of teaCats) {
    if (cat && !chocoCats.has(cat) && rank(entry.intensity) === 3) {
      contrasts.push({ label: 'お茶だけの特徴', detail: `お茶には「${noteById(entry.noteId)?.name}」を含む分類の香りが際立ち、チョコレートには見られません。並べて味わうと違いが感じられる可能性があります（未検証の探索的な見方です）。` })
    }
  }
  for (const [cat, entry] of chocoCats) {
    if (cat && !teaCats.has(cat) && rank(entry.intensity) === 3) {
      contrasts.push({ label: 'チョコだけの特徴', detail: `チョコレートには「${noteById(entry.noteId)?.name}」を含む分類の香りが際立ち、お茶には見られません。並べて味わうと違いが感じられる可能性があります（未検証の探索的な見方です）。` })
    }
  }
  // 味覚の対比は「合成」せず、両方にデータがある場合だけ並置として示す
  ;(Object.keys(TASTE_LABELS) as TasteKey[]).forEach((k) => {
    const t = tea.tastes[k], c = choco.tastes[k]
    if (rank(t.intensity) >= 2 && rank(c.intensity) >= 2 && t.intensity !== c.intensity) {
      contrasts.push({ label: `味覚の違い：${TASTE_LABELS[k]}`, detail: `お茶は${label(t.intensity)}、チョコレートは${label(c.intensity)}と記録されています。組み合わせたときの変化は検証されていません。` })
    }
  })

  return {
    level: 'exploratory',
    sharedNotes, sharedCategories, contrasts,
    message: '以下は香味プロファイルの共通点・対比からの探索的な整理です。実際に組み合わせた官能評価ではないため、味の変化を断定するものではありません。',
  }
}
const label = (i: string) => (i === 'strong' ? '強い' : i === 'normal' ? '普通' : i === 'weak' ? '弱い' : '不明')

/** おすすめ候補: 対象プロファイルと共通ノートが多い順（調和型）／大分類が重ならない順（対比型）。
 *  順位は「探索の手がかり」であって相性の良し悪しではない。 */
export function recommend<T extends { id: string; profile: FlavorProfile }>(base: FlavorProfile, candidates: T[], mode: 'harmony' | 'contrast'): T[] {
  const baseNotes = new Set(base.aromas.filter((a) => rank(a.intensity) >= 2).map((a) => a.noteId))
  const baseCats = new Set([...baseNotes].map((n) => noteById(n)?.categoryId))
  const scored = candidates.map((c) => {
    const notes = c.profile.aromas.filter((a) => rank(a.intensity) >= 2).map((a) => a.noteId)
    const shared = notes.filter((n) => baseNotes.has(n)).length
    const cats = new Set(notes.map((n) => noteById(n)?.categoryId))
    const catOverlap = [...cats].filter((x) => baseCats.has(x)).length
    return { c, key: mode === 'harmony' ? shared * 10 + catOverlap : -catOverlap * 10 + notes.length }
  })
  return scored.sort((a, b) => b.key - a.key).map((s) => s.c)
}
