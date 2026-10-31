import { describe, it, expect } from 'vitest'
import { analyzePairing } from './pairing'
import { analyzeInteractions } from './interactions'
import {
  teaCultivarPairingNote, cacaoPairingNote, cacaoOriginPairingNote, teaOriginPairingNote,
  teaRegionPairingNote, teaOriginCountries, type PairingContextNote,
} from './pairingContext'
import { teaItems, teaKinds } from '../data/teas'
import { teaRegions } from '../data/teaRegions'
import { chocolateItems } from '../data/chocolates'
import { teaCultivars, teaCultivarById, cultivarTeaUses, cultivarsForKind } from '../data/cultivars'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones } from '../data/cacao'
import { cacaoOrigins } from '../data/origins'
import { sources } from '../data/sources'
import { flavorNotes, noteById, categoryById } from '../data/flavors'
import { FLAVOR_FINDING_KINDS } from '../types'
import type { DataLevelUsed, EntityFinding } from '../types'

// ============================================================
// 指定ありを含む全組み合わせの検証（2026-10-30 追加、2026-10-31 地域対応で拡張）
//
// PairPage（src/App.tsx）の生成経路は次の関数群で構成される:
//   analyzePairing(tea.profile, choco.profile)        … お茶×チョコのペアのみに依存
//   analyzeInteractions(teaItem, chocoItem)           … お茶×チョコのペアのみに依存
//   teaCultivarPairingNote(cultivar, tea.kindId)      … 品種×茶類に依存
//   teaOriginPairingNote(country, tea.kindId)         … お茶の産地（国）×茶類に依存
//   teaRegionPairingNote(region, tea.kindId)          … お茶の産地（地域）×茶類に依存
//   cacaoPairingNote(layer, entity)                   … カカオ系統エンティティに依存
//   cacaoOriginPairingNote(origin)                    … カカオ産地に依存
// お茶の産地は国→地域の階層で選べる（国5＋地域30）。品種を指定した場合は、
// その品種の国の産地（国全体＋その国の地域）だけが選択肢になる（PairPage の連動）。
// 選択空間は、相異なる引数の組み合わせ
// （ペア112 + 品種39 + お茶産地（国）30 + お茶産地（地域）180 + 系統16 + 産地8 = 385通り）
// への実呼び出しで過不足なく覆われる。本ファイルでは:
//   (1) 相異なる引数の全385通りを実際に関数へ通し、不変条件を深掘り検査する
//       （あわせて同じ引数で2回呼んでも結果が一致すること＝決定性も確認する）。
//   (2) 選択空間を全件列挙し、PairPage と同じ組み立てで、
//       階層バッジ（DataLevelUsed）が指定内容と矛盾しないことを、
//       エンジン出力ではなくデータの原始情報から独立に再導出した期待値と突き合わせる。
// 香味ノート名・味覚名への言及の裏付け検査は interactions.test.ts が同じ112ペアで
// 実施しているため、ここではペアリング結果（analyzePairing）と文脈ノート側を担う。
// ============================================================

const sourceIdSet = new Set(sources.map((s) => s.id))
const rank = (i: string) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)
const flavorFindingsOf = (findings: EntityFinding[]) => findings.filter((f) => FLAVOR_FINDING_KINDS.includes(f.kind))
const kindName = (kindId: string) => teaKinds.find((k) => k.id === kindId)?.name ?? kindId
const SCORE_PATTERN = /\d+\s*点/

const DATA_LEVELS: DataLevelUsed[] = ['cultivar-measured', 'cultivar-general', 'origin-measured', 'group-general', 'kind-general', 'insufficient']

// ---- 原始情報（エンジンを介さずデータから直接引く、期待値の独立再導出用） ----
const useStatusOf = (cultivarId: string, kindId: string) =>
  cultivarTeaUses.find((u) => u.cultivarId === cultivarId && u.kindId === kindId)?.status
const cultivarFlavorCount = new Map(teaCultivars.map((c) => [c.id, flavorFindingsOf(c.findings).length]))
type CacaoLayerName = 'traditional' | 'genetic' | 'clone'
const cacaoEntities: { layer: CacaoLayerName; id: string; name: string; displayName: string; findings: EntityFinding[] }[] = [
  ...cacaoTraditionalGroups.map((g) => ({ layer: 'traditional' as const, id: g.id, name: g.name, displayName: g.nameJa ? `${g.nameJa}（${g.name}）` : g.name, findings: g.findings })),
  ...cacaoGeneticGroups.map((g) => ({ layer: 'genetic' as const, id: g.id, name: g.name, displayName: g.nameJa ? `${g.nameJa}（${g.name}）` : g.name, findings: g.findings })),
  ...cacaoClones.map((c) => ({ layer: 'clone' as const, id: c.id, name: c.name, displayName: c.name, findings: c.findings })),
]
const teaCountries = teaOriginCountries()

function expectedTeaCultivarLevel(cultivarId: string, kindId: string): DataLevelUsed {
  const status = useStatusOf(cultivarId, kindId)
  const hasFindings = (cultivarFlavorCount.get(cultivarId) ?? 0) > 0
  if (status === 'studied' && hasFindings) return 'cultivar-measured'
  if (status && hasFindings) return 'cultivar-general'
  return 'kind-general'
}
function expectedCacaoEntityLevel(layer: CacaoLayerName, findings: EntityFinding[]): DataLevelUsed {
  if (flavorFindingsOf(findings).length === 0) return 'insufficient'
  return layer === 'clone' ? 'cultivar-measured' : 'group-general'
}
function expectedCacaoOriginLevel(origin: (typeof cacaoOrigins)[number]): DataLevelUsed {
  const hasFindings = flavorFindingsOf(origin.findings).length > 0
  if (origin.flavorEvidence === 'measured' && hasFindings) return 'origin-measured'
  if (origin.flavorEvidence === 'general' && hasFindings) return 'group-general'
  return 'insufficient'
}
function teaOriginHasFindings(country: string, kindId: string): boolean {
  return teaCultivars.some((c) =>
    c.country === country
    && cultivarTeaUses.some((u) => u.cultivarId === c.id && u.kindId === kindId)
    && flavorFindingsOf(c.findings).length > 0)
}
function expectedTeaOriginLevel(country: string, kindId: string): DataLevelUsed {
  return teaOriginHasFindings(country, kindId) ? 'group-general' : 'insufficient'
}
const categoryOfKind = (kindId: string): string => {
  const k = teaKinds.find((x) => x.id === kindId)
  return !k || k.category === 'form' ? 'green' : k.category
}
function expectedTeaRegionLevel(region: (typeof teaRegions)[number], kindId: string): DataLevelUsed {
  const hasFindings = flavorFindingsOf(region.findings).length > 0
  if (region.applicableKindIds.includes(categoryOfKind(kindId)) && hasFindings) {
    return region.flavorEvidence === 'measured' ? 'origin-measured' : 'group-general'
  }
  return 'insufficient'
}
const regionsByCountry = new Map<string, (typeof teaRegions)[number][]>()
for (const r of teaRegions) regionsByCountry.set(r.country, [...(regionsByCountry.get(r.country) ?? []), r])

/** 文脈ノート共通の不変条件。問題があれば文字列で返す（呼び出し側で集約）。 */
function checkContextNote(note: PairingContextNote, pool: EntityFinding[], ctx: string): string[] {
  const problems: string[] = []
  if (!DATA_LEVELS.includes(note.level)) problems.push(`${ctx}: 未知の階層 ${note.level}`)
  // 所見は、指定したエンティティ自身の香味所見だけが載る（他エンティティからの転用がない）
  for (const f of note.findings) {
    if (!pool.includes(f)) problems.push(`${ctx}: エンティティ自身の所見でない所見が混入`)
    if (!FLAVOR_FINDING_KINDS.includes(f.kind)) problems.push(`${ctx}: 香味以外の所見（${f.kind}）が混入`)
    if (SCORE_PATTERN.test(f.statement)) problems.push(`${ctx}: 所見にスコア的数値`)
  }
  // 出典は所見の出典の和集合と一致し、全て実在する
  const expectedSources = [...new Set(note.findings.flatMap((f) => f.sourceIds))].sort()
  if (JSON.stringify([...note.sourceIds].sort()) !== JSON.stringify(expectedSources)) {
    problems.push(`${ctx}: sourceIds が所見の出典と一致しない`)
  }
  for (const sid of note.sourceIds) if (!sourceIdSet.has(sid)) problems.push(`${ctx}: 実在しない出典 ${sid}`)
  if ((note.findings.length === 0) !== (note.sourceIds.length === 0)) problems.push(`${ctx}: 所見と出典の有無が食い違う`)
  if (SCORE_PATTERN.test(note.text)) problems.push(`${ctx}: 案内文にスコア的数値`)
  return problems
}

describe('全組み合わせ検証：相異なる引数空間（実呼び出し）', () => {
  it('お茶×チョコ全112ペアで analyzePairing / analyzeInteractions の不変条件と決定性が成り立つ', () => {
    expect(teaItems.length * chocolateItems.length).toBe(112)
    for (const tea of teaItems) {
      for (const choco of chocolateItems) {
        const ctx = `${tea.id}×${choco.id}`
        const result = analyzePairing(tea.profile, choco.profile)
        const interactions = analyzeInteractions(tea, choco)
        // 決定性（同じ引数→同じ結果）: 全件組み立て側で結果を再利用できる前提の確認
        expect(JSON.stringify(analyzePairing(tea.profile, choco.profile)), ctx).toBe(JSON.stringify(result))
        expect(JSON.stringify(analyzeInteractions(tea, choco)), ctx).toBe(JSON.stringify(interactions))
        // ペアリング結果: 区分が妥当で、共通ノート・分類は実在し、両側の「普通」以上の実データだけを指す
        expect(['measured', 'general', 'exploratory', 'insufficient'], ctx).toContain(result.level)
        const knownIds = (p: typeof tea.profile) => new Set(p.aromas.filter((a) => rank(a.intensity) >= 2).map((a) => a.noteId))
        const teaKnown = knownIds(tea.profile)
        const chocoKnown = knownIds(choco.profile)
        for (const s of result.sharedNotes) {
          expect(noteById(s.noteId), `${ctx}/${s.noteId}`).toBeTruthy()
          expect(teaKnown.has(s.noteId) && chocoKnown.has(s.noteId), `${ctx}/${s.noteId}`).toBe(true)
          expect(s.name).toBe(noteById(s.noteId)!.name)
        }
        for (const c of result.sharedCategories) expect(categoryById(c.categoryId), `${ctx}/${c.categoryId}`).toBeTruthy()
        // 対比文が言及する香味ノート名は、どちらかの「普通」以上の実データの範囲だけ
        const allowedNoteNames = new Set([...teaKnown, ...chocoKnown].map((id) => noteById(id)?.name ?? id))
        for (const contrast of result.contrasts) {
          for (const n of flavorNotes) {
            if (contrast.detail.includes(n.name)) {
              expect(allowedNoteNames.has(n.name), `${ctx}: 対比文の「${n.name}」に実データの裏付けがない`).toBe(true)
            }
          }
          expect(contrast.detail, ctx).not.toMatch(SCORE_PATTERN)
        }
        expect(result.message, ctx).not.toMatch(SCORE_PATTERN)
        // 相互作用文: 区分・出典・推測の双方向明示（言及の裏付けは interactions.test.ts と同範囲で実施）
        for (const s of [...interactions.aroma, ...interactions.taste, ...interactions.mouthfeel]) {
          expect(['general', 'exploratory'], `${ctx}/${s.ruleId}`).toContain(s.level)
          expect(s.sourceIds.length, `${ctx}/${s.ruleId}`).toBeGreaterThan(0)
          for (const sid of s.sourceIds) expect(sourceIdSet.has(sid), `${ctx}/${s.ruleId}: ${sid}`).toBe(true)
          expect(s, `${ctx}/${s.ruleId}`).not.toHaveProperty('score')
          expect(s.text, `${ctx}/${s.ruleId}`).not.toMatch(SCORE_PATTERN)
          expect(s.text, `${ctx}/${s.ruleId}`).not.toMatch(/\d+\s*%/)
          if (s.usesInference) expect(s.text, `${ctx}/${s.ruleId}`).toContain('推測')
          if (s.text.includes('推測')) expect(s.usesInference, `${ctx}/${s.ruleId}`).toBe(true)
        }
      }
    }
  })

  it('品種×茶類の相異なる39通りで、階層がデータの原始情報と一致する', () => {
    const pairs = new Map<string, { cultivarId: string; kindId: string }>()
    for (const t of teaItems) {
      for (const cid of new Set(cultivarsForKind(t.kindId))) pairs.set(`${cid}@${t.kindId}`, { cultivarId: cid, kindId: t.kindId })
    }
    expect(pairs.size).toBe(39)
    for (const { cultivarId, kindId } of pairs.values()) {
      const cultivar = teaCultivarById(cultivarId)!
      const ctx = `${cultivarId}@${kindId}`
      const note = teaCultivarPairingNote(cultivar, kindId)
      expect(JSON.stringify(teaCultivarPairingNote(cultivar, kindId)), ctx).toBe(JSON.stringify(note))
      expect(note.level, ctx).toBe(expectedTeaCultivarLevel(cultivarId, kindId))
      expect(checkContextNote(note, flavorFindingsOf(cultivar.findings), ctx)).toEqual([])
      // 所見がある場合は品種の全香味所見が載り、ない場合は空であること
      expect(note.findings.length, ctx).toBe(flavorFindingsOf(cultivar.findings).length > 0 && useStatusOf(cultivarId, kindId) ? flavorFindingsOf(cultivar.findings).length : 0)
      expect(note.text, ctx).toContain(cultivar.name)
      expect(note.text, ctx).toContain(kindName(kindId))
    }
  })

  it('お茶の産地×茶類の全30通りで、階層は group-general / insufficient の範囲に収まる', () => {
    const kindIds = [...new Set(teaItems.map((t) => t.kindId))]
    expect(teaCountries.length * kindIds.length).toBe(30)
    for (const country of teaCountries) {
      for (const kindId of kindIds) {
        const ctx = `${country}@${kindId}`
        const note = teaOriginPairingNote(country, kindId)
        expect(JSON.stringify(teaOriginPairingNote(country, kindId)), ctx).toBe(JSON.stringify(note))
        expect(note.level, ctx).toBe(expectedTeaOriginLevel(country, kindId))
        expect(['group-general', 'insufficient'], ctx).toContain(note.level)
        // 載る所見は、その国×茶類で利用確認のある品種の所見だけ
        const pool = teaCultivars
          .filter((c) => c.country === country && cultivarTeaUses.some((u) => u.cultivarId === c.id && u.kindId === kindId))
          .flatMap((c) => flavorFindingsOf(c.findings))
        expect(checkContextNote(note, pool, ctx)).toEqual([])
        if (note.level === 'group-general') {
          // 一般的傾向として併記する品種名が本文に列挙されている
          for (const f of note.findings) expect(pool.includes(f), ctx).toBe(true)
          const named = teaCultivars.filter((c) => c.country === country
            && cultivarTeaUses.some((u) => u.cultivarId === c.id && u.kindId === kindId)
            && flavorFindingsOf(c.findings).length > 0)
          for (const c of named) expect(note.text, ctx).toContain(c.name)
        }
      }
    }
  })

  it('お茶の地域×茶類の全180通りで、階層が適用分類・実測区分・所見の有無と一致する', () => {
    const kindIds = [...new Set(teaItems.map((t) => t.kindId))]
    expect(teaRegions.length).toBe(30)
    expect(teaRegions.length * kindIds.length).toBe(180)
    for (const region of teaRegions) {
      for (const kindId of kindIds) {
        const ctx = `region:${region.id}@${kindId}`
        const note = teaRegionPairingNote(region, kindId)
        expect(JSON.stringify(teaRegionPairingNote(region, kindId)), ctx).toBe(JSON.stringify(note))
        expect(note.level, ctx).toBe(expectedTeaRegionLevel(region, kindId))
        expect(checkContextNote(note, flavorFindingsOf(region.findings), ctx)).toEqual([])
        // 適用分類では地域の全香味所見が載り、適用外では一切載らない
        const applicable = region.applicableKindIds.includes(categoryOfKind(kindId))
        expect(note.findings.length, ctx).toBe(applicable ? flavorFindingsOf(region.findings).length : 0)
        expect(note.text, ctx).toContain(region.name)
      }
    }
  })

  it('カカオ系統の全16エンティティで、階層が所見の有無と層と一致する', () => {
    expect(cacaoEntities.length).toBe(16)
    for (const e of cacaoEntities) {
      const ctx = `${e.layer}:${e.id}`
      const note = cacaoPairingNote(e.layer, { name: e.displayName, findings: e.findings })
      expect(JSON.stringify(cacaoPairingNote(e.layer, { name: e.displayName, findings: e.findings })), ctx).toBe(JSON.stringify(note))
      expect(note.level, ctx).toBe(expectedCacaoEntityLevel(e.layer, e.findings))
      expect(checkContextNote(note, flavorFindingsOf(e.findings), ctx)).toEqual([])
      expect(note.text, ctx).toContain(e.displayName)
    }
  })

  it('カカオ産地の全8件で、階層が flavorEvidence と所見の有無と一致する', () => {
    expect(cacaoOrigins.length).toBe(8)
    for (const origin of cacaoOrigins) {
      const ctx = `origin:${origin.id}`
      const note = cacaoOriginPairingNote(origin)
      expect(JSON.stringify(cacaoOriginPairingNote(origin)), ctx).toBe(JSON.stringify(note))
      expect(note.level, ctx).toBe(expectedCacaoOriginLevel(origin))
      expect(checkContextNote(note, flavorFindingsOf(origin.findings), ctx)).toEqual([])
      expect(note.text, ctx).toContain(origin.name)
    }
  })
})

describe('全組み合わせ検証：選択空間の全件組み立て', () => {
  it('お茶側 × チョコ側1,224通りの全件で、階層バッジが指定内容と矛盾しない', () => {
    // データ形状のアンカー（収録データが増えたら、この数字も更新すること）
    expect(teaItems.length).toBe(14)
    expect(chocolateItems.length).toBe(8)
    expect(teaCountries.length).toBe(5)
    expect(teaRegions.length).toBe(30)
    expect(cacaoOrigins.length).toBe(8)
    expect(cacaoEntities.length).toBe(16)

    // 相異なる引数ごとの生成結果（上の深掘り検査で不変条件を確認済みのもの）を組み立てる
    const pairOk = new Map<string, boolean>()
    for (const tea of teaItems) {
      for (const choco of chocolateItems) {
        const r = analyzePairing(tea.profile, choco.profile)
        const a = analyzeInteractions(tea, choco)
        const stmts = [...a.aroma, ...a.taste, ...a.mouthfeel]
        pairOk.set(`${tea.id}|${choco.id}`,
          stmts.every((s) => s.sourceIds.length > 0 && s.sourceIds.every((sid) => sourceIdSet.has(sid)) && !SCORE_PATTERN.test(s.text))
          && !SCORE_PATTERN.test(r.message) && r.contrasts.every((c) => !SCORE_PATTERN.test(c.detail)))
      }
    }
    const teaCultivarLevel = new Map<string, DataLevelUsed>()
    for (const t of teaItems) {
      for (const cid of new Set(cultivarsForKind(t.kindId))) {
        teaCultivarLevel.set(`${cid}@${t.kindId}`, teaCultivarPairingNote(teaCultivarById(cid)!, t.kindId).level)
      }
    }
    const teaOriginLevel = new Map<string, DataLevelUsed>()
    for (const country of teaCountries) {
      for (const kindId of new Set(teaItems.map((t) => t.kindId))) {
        teaOriginLevel.set(`${country}@${kindId}`, teaOriginPairingNote(country, kindId).level)
      }
    }
    const teaRegionLevel = new Map<string, DataLevelUsed>()
    for (const region of teaRegions) {
      for (const kindId of new Set(teaItems.map((t) => t.kindId))) {
        teaRegionLevel.set(`${region.id}@${kindId}`, teaRegionPairingNote(region, kindId).level)
      }
    }
    const cacaoEntityLevel = new Map(cacaoEntities.map((e) => [`${e.layer}:${e.id}`, cacaoPairingNote(e.layer, { name: e.displayName, findings: e.findings }).level]))
    const cacaoOriginLevel = new Map(cacaoOrigins.map((o) => [o.id, cacaoOriginPairingNote(o).level]))
    // 期待値も原始情報から事前に引いておく（組み合わせごとに再導出すると全件走査が重いため）
    const expectedTeaCultivar = new Map([...teaCultivarLevel.keys()].map((k) => {
      const [cid, kindId] = k.split('@')
      return [k, expectedTeaCultivarLevel(cid, kindId)] as const
    }))
    const expectedTeaOrigin = new Map([...teaOriginLevel.keys()].map((k) => {
      const [country, kindId] = k.split('@')
      return [k, expectedTeaOriginLevel(country, kindId)] as const
    }))
    const expectedTeaRegion = new Map([...teaRegionLevel.keys()].map((k) => {
      const [regionId, kindId] = k.split('@')
      return [k, expectedTeaRegionLevel(teaRegions.find((r) => r.id === regionId)!, kindId)] as const
    }))
    const expectedCacaoEntity: Map<string, DataLevelUsed> = new Map(cacaoEntities.map((e) => [`${e.layer}:${e.id}`, expectedCacaoEntityLevel(e.layer, e.findings)] as const))
    const entityHasFindings: Map<string, boolean> = new Map(cacaoEntities.map((e) => [`${e.layer}:${e.id}`, flavorFindingsOf(e.findings).length > 0] as const))
    const expectedCacaoOrigin = new Map(cacaoOrigins.map((o) => [o.id, expectedCacaoOriginLevel(o)] as const))

    const violations: string[] = []
    let violationCount = 0
    let count = 0

    // PairPage の産地選択肢: 品種なしでは国5＋地域30の全て、品種ありではその品種の国（国全体＋その国の地域）のみ
    type TeaOriginChoice = { type: 'country'; country: string } | { type: 'region'; region: (typeof teaRegions)[number] } | null
    const allOriginChoices: TeaOriginChoice[] = [null,
      ...teaCountries.map((country): TeaOriginChoice => ({ type: 'country', country })),
      ...teaRegions.map((region): TeaOriginChoice => ({ type: 'region', region }))]
    const originChoicesFor = (cultivarId: string | null): TeaOriginChoice[] => {
      if (!cultivarId) return allOriginChoices
      const country = teaCultivarById(cultivarId)!.country
      return [null, { type: 'country', country }, ...(regionsByCountry.get(country) ?? []).map((region): TeaOriginChoice => ({ type: 'region', region }))]
    }

    for (const tea of teaItems) {
      const cultivarChoices: (string | null)[] = [null, ...new Set(cultivarsForKind(tea.kindId))]
      for (const choco of chocolateItems) {
        const pairKey = `${tea.id}|${choco.id}`
        const thisPairOk = pairOk.get(pairKey)
        for (const cultivarId of cultivarChoices) {
          const cultivarKey = cultivarId ? `${cultivarId}@${tea.kindId}` : null
          for (const teaOriginChoice of originChoicesFor(cultivarId)) {
            const teaOriginKey = teaOriginChoice?.type === 'country' ? `${teaOriginChoice.country}@${tea.kindId}` : null
            const teaRegionKey = teaOriginChoice?.type === 'region' ? `${teaOriginChoice.region.id}@${tea.kindId}` : null
            const teaOriginDesc = teaOriginChoice == null ? '' : teaOriginChoice.type === 'country' ? `+${teaOriginChoice.country}` : `+region:${teaOriginChoice.region.id}`
            for (const entity of [null, ...cacaoEntities] as (typeof cacaoEntities[number] | null)[]) {
              const entityKey = entity ? `${entity.layer}:${entity.id}` : null
              for (const origin of [null, ...cacaoOrigins] as (typeof cacaoOrigins[number] | null)[]) {
                count++
                // 問題があった場合だけ文脈文字列を組み立てる（全件走査を軽く保つ）
                const bad = (msg: string) => {
                  violationCount++
                  if (violations.length < 30) {
                    violations.push(`${tea.id}${cultivarId ? `+${cultivarId}` : ''}${teaOriginDesc} × ${choco.id}${entity ? `+${entity.layer}:${entity.id}` : ''}${origin ? `+${origin.id}` : ''}: ${msg}`)
                  }
                }
                // 組み立て（PairPage と同じ対応関係）自体が例外なく成立すること
                if (!thisPairOk) bad('ペア生成の不変条件が崩れている')
                // 品種指定: 階層が原始情報からの期待値と一致する（所見のない指定が実測扱いにならない等）
                if (cultivarKey) {
                  const lvl = teaCultivarLevel.get(cultivarKey)
                  if (lvl !== expectedTeaCultivar.get(cultivarKey)) bad(`品種の階層 ${lvl} が期待 ${expectedTeaCultivar.get(cultivarKey)} と不一致`)
                  if ((cultivarFlavorCount.get(cultivarId!) ?? 0) === 0 && lvl === 'cultivar-measured') bad('所見のない品種が実測扱い')
                }
                // お茶の産地（国）指定: 実測・品種レベルの階層には絶対にならない
                if (teaOriginKey) {
                  const lvl = teaOriginLevel.get(teaOriginKey)
                  if (lvl !== expectedTeaOrigin.get(teaOriginKey)) bad(`お茶産地の階層 ${lvl} が期待と不一致`)
                  if (lvl !== 'group-general' && lvl !== 'insufficient') bad(`お茶産地が ${lvl} 扱いになっている`)
                }
                // お茶の産地（地域）指定: origin-measured は適用分類かつ実測区分のときだけ
                if (teaRegionKey && teaOriginChoice?.type === 'region') {
                  const lvl = teaRegionLevel.get(teaRegionKey)
                  if (lvl !== expectedTeaRegion.get(teaRegionKey)) bad(`お茶地域の階層 ${lvl} が期待と不一致`)
                  const region = teaOriginChoice.region
                  if (lvl === 'origin-measured' && !(region.applicableKindIds.includes(categoryOfKind(tea.kindId)) && region.flavorEvidence === 'measured')) {
                    bad('適用外または実測でない地域が origin-measured 扱い')
                  }
                }
                // 系統指定: 所見のない系統が measured / general 扱いにならない
                if (entityKey) {
                  const lvl = cacaoEntityLevel.get(entityKey)
                  if (lvl !== expectedCacaoEntity.get(entityKey)) bad(`系統の階層 ${lvl} が期待と不一致`)
                  if (!entityHasFindings.get(entityKey) && lvl !== 'insufficient') bad(`所見のない系統が ${lvl} 扱い`)
                }
                // カカオ産地指定: 実測でない産地が origin-measured にならない
                if (origin) {
                  const lvl = cacaoOriginLevel.get(origin.id)
                  if (lvl !== expectedCacaoOrigin.get(origin.id)) bad(`産地の階層 ${lvl} が期待と不一致`)
                  if (origin.flavorEvidence !== 'measured' && lvl === 'origin-measured') bad('実測でない産地が origin-measured 扱い')
                }
              }
            }
          }
        }
      }
    }

    const teaSide = teaItems.reduce((sum, t) => {
      const cids = [...new Set(cultivarsForKind(t.kindId))]
      const noCultivar = 1 + teaCountries.length + teaRegions.length
      const withCultivar = cids.reduce((s, cid) => s + 2 + (regionsByCountry.get(teaCultivarById(cid)!.country)?.length ?? 0), 0)
      return sum + noCultivar + withCultivar
    }, 0)
    const chocoSide = chocolateItems.length * (1 + cacaoEntities.length) * (1 + cacaoOrigins.length)
    expect(teaSide).toBe(2266)
    expect(chocoSide).toBe(1224)
    expect(count).toBe(teaSide * chocoSide)
    expect(count).toBe(2773584)
    expect(violationCount, violations.join('\n')).toBe(0)
  }, 600000)
})
