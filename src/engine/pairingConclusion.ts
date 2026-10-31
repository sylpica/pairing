import type { PairingWheelData } from './pairingWheel'
import type { PairingResult } from './pairing'
import { TASTE_LABELS } from './pairing'
import { noteById } from '../data/flavors'

/**
 * 「組み合わせの見方」タブ先頭の結論（第30弾）。
 * ペアリング合成（第26弾の代表ノートと相互作用の調整）と共通点・対比の
 * 分析から、「結局どういう味わいになるか」を組み合わせごとに組み立てる。
 * 新しい推測は足さず、既存の合成結果の集約だけを行う。スコア化はしない。
 */
export interface PairingConclusion {
  /** 前面に出る味わい（結論の主文） */
  lead: string
  /** 相互作用で強まる要素（対象：ルール名） */
  enhance: string[]
  /** 相互作用で和らぐ要素（対象：ルール名） */
  suppress: string[]
  /** 対比の軸（無ければ null） */
  contrast: string | null
  /** お茶×チョコの直接の官能研究に基づく分類ペアか（result.level === 'measured'） */
  direct: boolean
}

const noteName = (id: string) => noteById(id)?.name ?? id

export function buildPairingConclusion(wheel: PairingWheelData | null, result: PairingResult): PairingConclusion {
  const notes = wheel?.notes ?? []
  const tastes = wheel?.tastes ?? []
  const topTaste = tastes.length > 0
    ? [...tastes].sort((a, b) => (wheel?.tasteMeta.get(b.key)?.weight ?? 0) - (wheel?.tasteMeta.get(a.key)?.weight ?? 0))[0]
    : undefined

  let lead: string
  if (notes.length >= 2) {
    lead = `${noteName(notes[0].noteId)}と${noteName(notes[1].noteId)}の香りが前面に出る組み合わせです`
    if (topTaste) lead += `。味の軸は${TASTE_LABELS[topTaste.key]}です`
    lead += '。'
  } else if (notes.length === 1) {
    lead = `${noteName(notes[0].noteId)}の香りが中心になる組み合わせです`
    if (topTaste) lead += `。味の軸は${TASTE_LABELS[topTaste.key]}です`
    lead += '。'
  } else if (result.sharedNotes.length > 0) {
    lead = `${result.sharedNotes[0].name}の香りを共通の軸にした組み合わせです。`
  } else if (result.contrasts.length > 0) {
    lead = `共通する香りよりも、対比の効いた組み合わせです。`
  } else {
    lead = '両側のプロファイルからは、前面に出る味わいを特定できる材料がまだ揃っていません。'
  }

  const enhance: string[] = []
  const suppress: string[] = []
  const seen = new Set<string>()
  const collect = (target: string, meta: { adjustments: { ruleId: string; label: string; direction: 'enhance' | 'suppress' }[] } | undefined) => {
    for (const adj of meta?.adjustments ?? []) {
      const key = `${target}:${adj.ruleId}`
      if (seen.has(key)) continue
      seen.add(key)
      const entry = `${target}（${adj.label}）`
      if (adj.direction === 'enhance') enhance.push(entry); else suppress.push(entry)
    }
  }
  if (wheel) {
    for (const n of wheel.notes) collect(noteName(n.noteId), wheel.noteMeta.get(n.noteId))
    for (const t of wheel.tastes) collect(TASTE_LABELS[t.key], wheel.tasteMeta.get(t.key))
  }

  return {
    lead,
    enhance: enhance.slice(0, 3),
    suppress: suppress.slice(0, 3),
    contrast: result.contrasts.length > 0 ? result.contrasts[0].label : null,
    direct: result.level === 'measured',
  }
}
