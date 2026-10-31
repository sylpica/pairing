import { describe, it, expect } from 'vitest'
import { sources } from './sources'
import { teaItems } from './teas'
import { chocolateItems } from './chocolates'
import type { TasteKey } from '../types'

// 第16弾（2026-10-31）: 全アイテムの「香り」と「味」の両面が揃っていることを
// 恒常的に担保する。不足を推測で埋める際も、アイテムプロファイルには根拠区分
// （実測／官能評価／総説／一般的知見）と出典つきの記録だけを置く決まりは維持する
// （推測は組み合わせ層の inferred の置き場に分離されているため、ここでは
// プロファイルに推測ラベルの記録が混ざらないこともあわせて確認する）。
const sourceIds = new Set(sources.map((s) => s.id))
const TASTE_KEYS: TasteKey[] = ['sweet', 'sour', 'bitter', 'astringent', 'umami']
const known = (item: { profile: { tastes: Record<TasteKey, { intensity: string }> } }, key: TasteKey) =>
  item.profile.tastes[key].intensity !== 'unknown'

describe('フレーバーの味・香りカバレッジ（第16弾）', () => {
  it('全アイテムに香りノートがある（薄い2件は文献上の理由つきで例外）', () => {
    // dark-100 は単一研究の官能記述がカカオ感中心、ブロンドは唯一の査読研究に
    // 寄与評価のある香り記述がキャラメル様のみのため、捏造を避けて1件に留める。
    const thin = new Set(['dark-100', 'blond-chocolate'])
    for (const item of [...teaItems, ...chocolateItems]) {
      expect(item.profile.aromas.length, item.id).toBeGreaterThanOrEqual(thin.has(item.id) ? 1 : 2)
    }
  })
  it('お茶は全アイテムで苦味・渋味・うま味（茶の呈味の三本柱）が記録されている', () => {
    for (const item of teaItems) {
      for (const key of ['bitter', 'astringent', 'umami'] as TasteKey[]) {
        expect(known(item, key), `${item.id}:${key}`).toBe(true)
      }
    }
  })
  it('ダーク系チョコは苦味・渋味、甘味系チョコは甘味が記録されている', () => {
    for (const item of chocolateItems) {
      if (item.kind === 'dark') {
        expect(known(item, 'bitter'), `${item.id}:bitter`).toBe(true)
        expect(known(item, 'astringent'), `${item.id}:astringent`).toBe(true)
      } else {
        expect(known(item, 'sweet'), `${item.id}:sweet`).toBe(true)
      }
    }
  })
  it('味が全て不明のアイテムは無い', () => {
    for (const item of [...teaItems, ...chocolateItems]) {
      expect(TASTE_KEYS.some((k) => known(item, k)), item.id).toBe(true)
    }
  })
  it('記録された味には実在する出典がついている', () => {
    for (const item of [...teaItems, ...chocolateItems]) {
      for (const key of TASTE_KEYS) {
        const t = item.profile.tastes[key]
        if (t.intensity === 'unknown') continue
        expect(t.sourceIds.length, `${item.id}:${key}`).toBeGreaterThan(0)
        for (const sid of t.sourceIds) expect(sourceIds.has(sid), `${item.id}:${key}:${sid}`).toBe(true)
      }
    }
  })
  it('プロファイルの根拠区分は実測・官能・総説・一般的知見の範囲内（推測は混ぜない）', () => {
    const allowed = new Set(['measured', 'sensory', 'review', 'general'])
    for (const item of [...teaItems, ...chocolateItems]) {
      for (const a of item.profile.aromas) expect(allowed.has(a.basis), `${item.id}:${a.noteId}`).toBe(true)
      for (const key of TASTE_KEYS) expect(allowed.has(item.profile.tastes[key].basis), `${item.id}:${key}`).toBe(true)
    }
  })
})
