import { describe, it, expect } from 'vitest'
import { cacaoOrigins, cacaoOriginById, originsForLineage } from './origins'
import { sources } from './sources'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones } from './cacao'

const sourceIds = new Set(sources.map((s) => s.id))
const allText = (o: (typeof cacaoOrigins)[number]) =>
  [o.scienceNote, o.note, ...o.findings.map((f) => f.statement + (f.conditions ?? ''))].join('\n')

describe('カカオ産地エンティティ（2026-10-30 追加）', () => {
  it('産地が8件登録され、IDが一意', () => {
    expect(cacaoOrigins).toHaveLength(8)
    expect(new Set(cacaoOrigins.map((o) => o.id)).size).toBe(8)
    for (const id of ['venezuela', 'ecuador', 'dominican-republic', 'ghana', 'madagascar', 'peru', 'cote-divoire', 'tanzania']) {
      expect(cacaoOriginById(id)).toBeTruthy()
    }
  })
  it('産地は FlavorProfile を持たない（香味プロファイルを自動生成しない）', () => {
    for (const o of cacaoOrigins) expect('profile' in o).toBe(false)
  })
  it('参照する出典がすべて実在し、所見には出典がある', () => {
    for (const o of cacaoOrigins) {
      for (const sid of o.sourceIds) expect(sourceIds.has(sid)).toBe(true)
      for (const f of o.findings) {
        expect(f.sourceIds.length).toBeGreaterThan(0)
        for (const sid of f.sourceIds) expect(sourceIds.has(sid)).toBe(true)
      }
    }
  })
  it('関連付けた系統IDがすべて実在する', () => {
    const trad = new Set(cacaoTraditionalGroups.map((g) => g.id))
    const gen = new Set(cacaoGeneticGroups.map((g) => g.id))
    const clones = new Set(cacaoClones.map((c) => c.id))
    for (const o of cacaoOrigins) {
      for (const id of o.relatedTraditionalIds) expect(trad.has(id)).toBe(true)
      for (const id of o.relatedGeneticGroupIds) expect(gen.has(id)).toBe(true)
      for (const id of o.relatedCloneIds) expect(clones.has(id)).toBe(true)
      for (const t of o.tradeNames) if (t.linkedGeneticGroupId) expect(gen.has(t.linkedGeneticGroupId)).toBe(true)
    }
  })
  it('ベネズエラに「純粋クリオロ」の断定がなく、混合の実測が明記されている', () => {
    const v = cacaoOriginById('venezuela')!
    const text = allText(v)
    expect(text).toContain('混合')
    expect(text).toContain('一致しません')
    // 肯定形の俗説が紛れ込んでいないこと（否定文中の「」引用は対象外）
    expect(text).not.toMatch(/ベネズエラ産は純粋なクリオロ|ベネズエラ産＝純粋なクリオロです/)
    expect(text).toContain('「ベネズエラ産＝純粋なクリオロ」という説明は、この実測と一致しません')
    expect(v.findings.some((f) => f.kind === 'genetic' && f.sourceIds.includes('marcano-2009-venezuela-admixture'))).toBe(true)
    expect(v.flavorEvidence).toBe('general')
  })
  it('マダガスカルに「＝クリオロ」の断定がなく、3群混在の実測が明記されている', () => {
    const m = cacaoOriginById('madagascar')!
    const text = allText(m)
    expect(text).toContain('混在')
    expect(text).not.toMatch(/マダガスカル産はクリオロ|マダガスカル産＝クリオロです/)
    expect(text).toContain('「マダガスカル産＝クリオロ」という説明は、この実測と一致しません')
  })
  it('アリバは遺伝集団ではなくエクアドルの商業呼称として Nacional に紐づく', () => {
    const e = cacaoOriginById('ecuador')!
    const arriba = e.tradeNames.find((t) => t.name.includes('アリバ'))
    expect(arriba).toBeTruthy()
    expect(arriba!.kind).toBe('commercial')
    expect(arriba!.linkedGeneticGroupId).toBe('gen-nacional')
    expect(arriba!.note).toContain('遺伝集団の名前ではありません')
    // 遺伝集団エンティティとして Arriba は存在しない
    expect(cacaoGeneticGroups.some((g) => g.id.includes('arriba') || g.name === 'Arriba')).toBe(false)
    expect(e.flavorEvidence).toBe('general')
  })
  it('サンチェス／ヒスパニオラは品種名ではなくグレード名として分離されている', () => {
    const d = cacaoOriginById('dominican-republic')!
    const grades = d.tradeNames.filter((t) => t.kind === 'grade')
    expect(grades.map((g) => g.name)).toEqual(expect.arrayContaining([expect.stringContaining('サンチェス'), expect.stringContaining('ヒスパニオラ')]))
    for (const g of grades) expect(g.note).toContain('品種名ではなく')
    expect(d.flavorEvidence).toBe('measured')
    expect(d.findings.some((f) => f.kind === 'sensory')).toBe(true)
  })
  it('ガーナは加工条件の実測として measured（産地固有の味とは区別を明記）', () => {
    const g = cacaoOriginById('ghana')!
    expect(g.flavorEvidence).toBe('measured')
    expect(allText(g)).toContain('加工条件')
  })
  it('コートジボワールは実測ありへ更新された（ただし地域差は小さいという結論の明記つき）', () => {
    const o = cacaoOriginById('cote-divoire')!
    expect(o.flavorEvidence).toBe('measured')
    expect(o.verification.science).toBe('peer-reviewed')
    expect(o.findings.some((f) => f.kind === 'sensory' && f.sourceIds.includes('amien-2025-cote-divoire-cocoa-origins'))).toBe(true)
    expect(o.findings.some((f) => f.sourceIds.includes('kouassi-2022-cote-divoire-fermentation-places'))).toBe(true)
    expect(allText(o)).toContain('発酵場所')
  })
  it('香味データ未確認の産地（タンザニア）は所見なし・evidence none のまま', () => {
    const o = cacaoOriginById('tanzania')!
    expect(o.flavorEvidence).toBe('none')
    expect(o.findings).toHaveLength(0)
    expect(o.verification.science).toBe('unconfirmed')
  })
  it('系統から産地を逆引きできる（Nacional→エクアドル／ペルー、Trinitario→ドミニカ）', () => {
    expect(originsForLineage('genetic', 'gen-nacional').map((o) => o.id)).toEqual(expect.arrayContaining(['ecuador', 'peru']))
    expect(originsForLineage('traditional', 'trad-trinitario').map((o) => o.id)).toEqual(expect.arrayContaining(['dominican-republic', 'venezuela', 'madagascar']))
    expect(originsForLineage('clone', 'ccn-51').map((o) => o.id)).toContain('ecuador')
  })
})
