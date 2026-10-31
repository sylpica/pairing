import { describe, it, expect } from 'vitest'
import { sources } from './sources'
import { teaItems } from './teas'
import { chocolateItems } from './chocolates'
import { compounds } from './compounds'
import { teaCultivars, cultivarTeaUses } from './cultivars'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones } from './cacao'
import { cacaoOrigins } from './origins'
import { teaRegions } from './teaRegions'
import { teaAxisRules, chocoAxisRules, axisNoEffects } from './axisEffects'
import { teaProcessRules, chocoProcessRules } from './processRules'
import { analyzeInteractions } from '../engine/interactions'

const registered = new Set(sources.map((s) => s.id))

/** 任意のデータ構造を再帰的に歩き、sourceIds 配列をすべて集める */
function collectSourceIds(value: unknown, out: string[]): void {
  if (Array.isArray(value)) {
    for (const v of value) collectSourceIds(v, out)
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k === 'sourceIds' && Array.isArray(v)) out.push(...(v as string[]))
      else collectSourceIds(v, out)
    }
  }
}

describe('出典の参照整合性（第31弾）', () => {
  it('全データモジュールの sourceIds がすべて出典データに登録されている', () => {
    const collections: [string, unknown][] = [
      ['teaItems', teaItems], ['chocolateItems', chocolateItems], ['compounds', compounds],
      ['teaCultivars', teaCultivars], ['cultivarTeaUses', cultivarTeaUses],
      ['cacaoTraditionalGroups', cacaoTraditionalGroups], ['cacaoGeneticGroups', cacaoGeneticGroups],
      ['cacaoClones', cacaoClones], ['cacaoOrigins', cacaoOrigins], ['teaRegions', teaRegions],
      ['teaAxisRules', teaAxisRules], ['chocoAxisRules', chocoAxisRules],
      ['teaProcessRules', teaProcessRules], ['chocoProcessRules', chocoProcessRules],
      // axisNoEffects は「ルールが無い理由」の説明で、設計上 sourceIds を持たない
      ['axisNoEffects', axisNoEffects],
    ]
    for (const [name, col] of collections) {
      const ids: string[] = []
      collectSourceIds(col, ids)
      if (name !== 'axisNoEffects') expect(ids.length, `${name} に sourceIds が無い`).toBeGreaterThan(0)
      for (const id of ids) expect(registered.has(id), `${name} の未登録出典: ${id}`).toBe(true)
    }
  })

  it('相互作用の発火文の出典がすべて登録されている（全アイテムペア）', () => {
    for (const tea of teaItems) {
      for (const choco of chocolateItems) {
        const a = analyzeInteractions(tea, choco)
        for (const s of [...a.aroma, ...a.taste, ...a.mouthfeel]) {
          for (const id of s.sourceIds) expect(registered.has(id), `未登録出典: ${id}`).toBe(true)
        }
      }
    }
  })

  it('登録出典の書誌情報が揃っている（題名・著者・年・URL必須、ID一意）', () => {
    expect(new Set(sources.map((s) => s.id)).size).toBe(sources.length)
    for (const s of sources) {
      expect(s.title.length, s.id).toBeGreaterThan(0)
      expect(s.authors.length, s.id).toBeGreaterThan(0)
      expect(s.year, s.id).toBeGreaterThan(1900)
      expect(s.url, s.id).toMatch(/^https?:\/\//)
      expect(s.verified, s.id).toBe(true)
    }
    // DOI の重複登録がない
    const dois = sources.flatMap((s) => (s.doi ? [s.doi.toLowerCase()] : []))
    expect(new Set(dois).size).toBe(dois.length)
  })

  it('過去の訂正事項が反映されている（Tuenter 2021 の記事番号 128446）', () => {
    const t = sources.find((s) => s.id === 'tuenter-2021-ruby-composition')
    expect(t?.doi).toBe('10.1016/j.foodchem.2020.128446')
    expect(t?.journal).toContain('128446')
  })

  it('第28弾で新規登録した4出典が出典データにある', () => {
    for (const id of ['minamikyushu-yutakamidori', 'cha-hinshu-handbook-6', 'tbrs-tea-breeding-cultivars', 'ttch-jinxuan-black-tea']) {
      expect(registered.has(id), id).toBe(true)
    }
  })
})
