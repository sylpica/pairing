import { describe, it, expect } from 'vitest'
import { teaRegions } from '../data/teaRegions'
import { teaCultivars } from '../data/cultivars'
import { cacaoOrigins } from '../data/origins'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones } from '../data/cacao'
import { teaAxisRules, chocoAxisRules, axisNoEffects } from '../data/axisEffects'
import { teaProcessRules, chocoProcessRules } from '../data/processRules'
import { sources } from '../data/sources'
import { analyzeTeaCombo, analyzeChocoCombo } from './combo'

// 課題A（2026-10-31 第4弾）: 軸効果の網羅化の固定。
// - 所見を持つ全ての軸エンティティについて、「変換ルールがある」か
//   「理由つきで効果なし（axisNoEffects）」のどちらかが必ず定義されていること。
//   新規エンティティ追加時にどちらも無いまま漏れることを防ぐ。
// - 新規変換（静岡・安徽・広東・鳳凰単叢・ふくみどり・ナシオナル拡張）の回帰。

const sourceIds = new Set(sources.map((s) => s.id))

const lineages = [
  ...cacaoTraditionalGroups.map((g) => ({ layer: 'traditional' as const, id: g.id, name: g.name, findings: g.findings })),
  ...cacaoGeneticGroups.map((g) => ({ layer: 'genetic' as const, id: g.id, name: g.name, findings: g.findings })),
  ...cacaoClones.map((c) => ({ layer: 'clone' as const, id: c.id, name: c.name, findings: c.findings })),
]

describe('課題A: 軸エンティティのカバレッジ（所見ありは変換か理由つき効果なしのどちらか必須）', () => {
  it('地域: 所見を持つ全地域がカバーされている', () => {
    const missing: string[] = []
    for (const r of teaRegions) {
      if (r.findings.length === 0) continue
      const hasRule = teaAxisRules.some((x) => x.axis === 'region' && x.entityId === r.id)
      const hasNoEffect = axisNoEffects.some((x) => x.axis === 'region' && x.entityId === r.id)
      if (!hasRule && !hasNoEffect) missing.push(r.id)
    }
    expect(missing).toEqual([])
  })

  it('品種: 所見を持つ全品種がカバーされている', () => {
    const missing: string[] = []
    for (const c of teaCultivars) {
      if (c.findings.length === 0) continue
      const hasRule = teaAxisRules.some((x) => x.axis === 'cultivar' && x.entityId === c.id)
      const hasProcess = teaProcessRules.some((x) => x.cultivarId === c.id)
      const hasNoEffect = axisNoEffects.some((x) => x.axis === 'cultivar' && x.entityId === c.id)
      if (!hasRule && !hasProcess && !hasNoEffect) missing.push(c.id)
    }
    expect(missing).toEqual([])
  })

  it('産地: 所見を持つ全産地がカバーされている', () => {
    const missing: string[] = []
    for (const o of cacaoOrigins) {
      if (o.findings.length === 0) continue
      const hasRule = chocoAxisRules.some((x) => x.axis === 'origin' && x.entityId === o.id)
      const hasNoEffect = axisNoEffects.some((x) => x.axis === 'origin' && x.entityId === o.id)
      if (!hasRule && !hasNoEffect) missing.push(o.id)
    }
    expect(missing).toEqual([])
  })

  it('系統: 所見を持つ全系統がカバーされている（CCN-51 は製法ルール経由）', () => {
    const missing: string[] = []
    for (const l of lineages) {
      if (l.findings.length === 0) continue
      const hasRule = chocoAxisRules.some((x) => x.axis === 'lineage' && x.entityId === l.id && x.lineageLayer === l.layer)
      const hasProcess = chocoProcessRules.some((x) => x.lineageId === l.id && x.lineageLayer === l.layer)
      const hasNoEffect = axisNoEffects.some((x) => x.axis === 'lineage' && x.entityId === l.id && x.lineageLayer === l.layer)
      if (!hasRule && !hasProcess && !hasNoEffect) missing.push(`${l.layer}:${l.id}`)
    }
    expect(missing).toEqual([])
  })

  it('axisNoEffects の整合性: 実在するエンティティ・理由文あり・重複なし・出典は実在', () => {
    const regionIds = new Set(teaRegions.map((r) => r.id))
    const cultivarIds = new Set(teaCultivars.map((c) => c.id))
    const originIds = new Set(cacaoOrigins.map((o) => o.id))
    const lineageKeys = new Set(lineages.map((l) => `${l.layer}:${l.id}`))
    const seen = new Set<string>()
    for (const e of axisNoEffects) {
      if (e.axis === 'region') expect(regionIds.has(e.entityId), `地域 ${e.entityId}`).toBe(true)
      if (e.axis === 'cultivar') expect(cultivarIds.has(e.entityId), `品種 ${e.entityId}`).toBe(true)
      if (e.axis === 'origin') expect(originIds.has(e.entityId), `産地 ${e.entityId}`).toBe(true)
      if (e.axis === 'lineage') expect(lineageKeys.has(`${e.lineageLayer}:${e.entityId}`), `系統 ${e.entityId}`).toBe(true)
      expect(e.text.length).toBeGreaterThan(20)
      const key = `${e.axis}|${e.entityId}|${e.kindCategory ?? ''}|${e.lineageLayer ?? ''}`
      expect(seen.has(key), `重複 ${key}`).toBe(false)
      seen.add(key)
    }
  })

  it('変換ルールの整合性: 効果の出典は全て実在する', () => {
    for (const r of [...teaAxisRules, ...chocoAxisRules]) {
      for (const e of [...r.noteEffects, ...r.tasteEffects]) {
        for (const id of e.sourceIds) expect(sourceIds.has(id), `${r.id} の出典 ${id}`).toBe(true)
      }
    }
  })
})

const wheelSig = (a: ReturnType<typeof analyzeTeaCombo>) =>
  JSON.stringify({
    notes: a.notes.map((n) => `${n.noteId}:${n.intensity}:${n.level}`),
    tastes: a.tastes.map((t) => `${t.key}:${t.intensity}:${t.level}`),
  })

describe('課題A: 新規変換の回帰', () => {
  it('広東 × 鳳凰単叢 × 青茶 は、中国全体 × 鳳凰単叢 × 青茶 と分析が変わる（再現例）', () => {
    const guangdong = analyzeTeaCombo({ kindId: 'oolong', regionId: 'guangdong', cultivarId: 'fenghuang-dancong-group' })
    const country = analyzeTeaCombo({ kindId: 'oolong', regionId: 'country:中国', cultivarId: 'fenghuang-dancong-group' })
    // 鳳凰単叢の証拠は広東・潮州の実試料そのものなので、ホイールの面
    // （ノート・強度・根拠レベル）は同一で正しい。変わるのは根拠の内訳と軸要約:
    // 広東を指定すると、蘭のノートの根拠に「産地の所見」が積まれ、
    // 地域の軸要約が「反映されています」になる（国レベルでは産地は不使用）。
    const orchidG = guangdong.notes.find((n) => n.noteId === 'orchid')
    const orchidC = country.notes.find((n) => n.noteId === 'orchid')
    expect(orchidG?.level).toBe('general')
    expect(guangdong.notes.some((n) => n.noteId === 'honey')).toBe(true)
    expect(orchidG?.basis.some((b) => b.from === 'region')).toBe(true)
    expect(orchidC?.basis.some((b) => b.from === 'region')).toBe(false)
    const regionSummary = guangdong.axisSummaries.find((s) => s.axis === 'region')
    expect(regionSummary?.reflected).toBe(true)
    const countrySummary = country.axisSummaries.find((s) => s.axis === 'region')
    expect(countrySummary?.reflected).toBe(false)
    // 分析全体（ノートの根拠構成を含む）は異なる
    const fullSig = (a: typeof guangdong) => JSON.stringify(a.notes.map((n) => `${n.noteId}:${n.basis.map((b) => b.from).join('+')}`))
    expect(fullSig(guangdong)).not.toBe(fullSig(country))
  })

  it('広東（地域のみ）× 青茶 は、国レベル指定とホイールが変わる', () => {
    const guangdong = analyzeTeaCombo({ kindId: 'oolong', regionId: 'guangdong', cultivarId: '' })
    const country = analyzeTeaCombo({ kindId: 'oolong', regionId: 'country:中国', cultivarId: '' })
    expect(wheelSig(guangdong)).not.toBe(wheelSig(country))
    const regionSummary = guangdong.axisSummaries.find((s) => s.axis === 'region')
    expect(regionSummary?.reflected).toBe(true)
  })

  it('鳳凰単叢（品種のみ）× 青茶 は、軸なしとホイールが変わる', () => {
    const dancong = analyzeTeaCombo({ kindId: 'oolong', regionId: '', cultivarId: 'fenghuang-dancong-group' })
    const base = analyzeTeaCombo({ kindId: 'oolong', regionId: '', cultivarId: '' })
    expect(wheelSig(dancong)).not.toBe(wheelSig(base))
  })

  it('静岡 × 緑茶: 花様が地域の実測で裏付けられる（measured）', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'shizuoka', cultivarId: '' })
    const floral = a.notes.find((n) => n.noteId === 'floral-general')
    expect(floral?.level).toBe('measured')
    expect(a.axisSummaries.find((s) => s.axis === 'region')?.reflected).toBe(true)
  })

  it('安徽 × 紅茶: 蜂蜜・花様が産地の実測で裏付けられる（measured）', () => {
    const a = analyzeTeaCombo({ kindId: 'black', regionId: 'anhui', cultivarId: '' })
    expect(a.notes.find((n) => n.noteId === 'honey')?.level).toBe('measured')
    expect(a.notes.find((n) => n.noteId === 'floral-general')?.level).toBe('measured')
  })

  it('安徽 × 緑茶: 判別のみの所見なので理由つきで反映されない', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'anhui', cultivarId: '' })
    const s = a.axisSummaries.find((x) => x.axis === 'region')
    expect(s?.reflected).toBe(false)
    expect(s?.text).toContain('キラル')
  })

  it('ふくみどり × 緑茶: うま味が一段強くなる（公的報告の記述に基づく一般）', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: 'fukumidori' })
    const base = analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: '' })
    const umami = a.tastes.find((t) => t.key === 'umami')
    const baseUmami = base.tastes.find((t) => t.key === 'umami')
    expect(umami?.intensity).toBe('strong')
    expect(baseUmami?.intensity).toBe('normal')
    expect(umami?.level).toBe('general')
  })

  it('ナシオナル × ダーク: 白い花・果実様が一般的な知見として加わる', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: '', lineage: { layer: 'genetic', id: 'gen-nacional' } })
    expect(a.notes.find((n) => n.noteId === 'white-flower')?.level).toBe('general')
    expect(a.notes.find((n) => n.noteId === 'fruit-general')?.level).toBe('general')
  })

  it('理由表示: 村上は「寄与を示すものではない」、タンザニアは「確認できていない」を含む', () => {
    const tea = analyzeTeaCombo({ kindId: 'green', regionId: 'murakami', cultivarId: '' })
    const regionSummary = tea.axisSummaries.find((s) => s.axis === 'region')
    expect(regionSummary?.reflected).toBe(false)
    expect(regionSummary?.text).toContain('寄与を示すものではない')
    const choco = analyzeChocoCombo({ kind: 'dark', originId: 'tanzania', lineage: null })
    const originSummary = choco.axisSummaries.find((s) => s.axis === 'origin')
    expect(originSummary?.reflected).toBe(false)
    expect(originSummary?.text).toContain('確認できていない')
  })
})
