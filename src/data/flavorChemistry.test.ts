import { describe, it, expect } from 'vitest'
import { compounds, compoundById, compoundsForNote, compoundsForTaste, compoundTier, noteCompoundCoverage } from './compounds'
import { sources } from './sources'
import { flavorCategories, flavorNotes } from './flavors'
import { teaKinds } from './teas'

const sourceIds = new Set(sources.map((s) => s.id))

describe('フレーバーホイール×科学成分の自動検査', () => {
  it('化合物は55件（既存23＋香気17＋呈味15）でIDが一意', () => {
    expect(compounds).toHaveLength(55)
    expect(new Set(compounds.map((c) => c.id)).size).toBe(compounds.length)
  })

  it('新規出典4件が検証済みで登録されている', () => {
    for (const id of ['chen-2020-white-tea-odorants', 'raza-2025-yunnan-white-tea', 'deuscher-2020-dark-chocolate-gco', 'bajec-2008-astringency']) {
      const s = sources.find((x) => x.id === id)
      expect(s, id).toBeTruthy()
      expect(s!.verified).toBe(true)
      expect(s!.doi).toMatch(/^10\.\d{4,}\//)
    }
  })

  it('全香味ノートの充足状況を自動検査できる（カテゴリ単位の期待値）', () => {
    const coverage = noteCompoundCoverage()
    // 全ノート分が返り、参照する出典がすべて実在する
    expect(coverage).toHaveLength(flavorNotes.length)
    for (const cov of coverage) {
      for (const sid of cov.sourceIds) expect(sourceIds.has(sid)).toBe(true)
    }
    const byNote = new Map(coverage.map((c) => [c.noteId, c.compoundIds]))
    // 充足している代表ノート
    expect(byNote.get('green-leaf')).toContain('hexanal')
    expect(byNote.get('green-leaf')).toContain('cis-3-hexen-1-ol')
    expect(byNote.get('green-leaf')).toContain('cis-3-hexenal')
    expect(byNote.get('rose')).toContain('2-phenylethanol')
    expect(byNote.get('cream')).toContain('gamma-nonalactone')
    expect(byNote.get('cacao')).toContain('2-methylbutanal')
    expect(byNote.get('caramel')).toContain('furaneol')
    expect(byNote.get('mushroom')).toContain('1-octen-3-ol')
    // 根拠不足のまま未確認として残すノート（ダミーで埋めない）
    expect(byNote.get('seaweed')).toEqual([])
    expect(byNote.get('cinnamon')).toEqual([])
    expect(byNote.get('ginger')).toEqual([])
    expect(byNote.get('peppery')).toEqual([])
    expect(byNote.get('vanilla')).toEqual([])
    expect(byNote.get('coffee')).toEqual([])
    // カテゴリ単位でも充足表が作れる
    for (const cat of flavorCategories) {
      const inCat = coverage.filter((c) => c.categoryId === cat.id)
      expect(inCat.length).toBeGreaterThan(0)
    }
  })

  it('白茶「青草・若葉」の成分は白茶試料の出典（Chen 2020 / Raza 2025）に基づく', () => {
    const linked = compoundsForNote('green-leaf')
    const whiteTeaBased = linked.filter((c) => c.sourceIds.includes('chen-2020-white-tea-odorants') || c.sourceIds.includes('raza-2025-yunnan-white-tea'))
    expect(whiteTeaBased.map((c) => c.id)).toEqual(expect.arrayContaining(['hexanal', 'cis-3-hexenal', 'trans-2-hexenal', 'cis-3-hexenyl-butyrate']))
    for (const c of whiteTeaBased) {
      expect(compoundTier(c, { side: 'tea', kindId: 'white' })).toBe(1)
    }
  })

  it('β-イオノンは orchid にのみ紐づけ、wood には紐づけない（白茶で木質は示されなかった）', () => {
    const b = compoundById('beta-ionone')!
    expect(b.noteIds).toContain('orchid')
    expect(b.noteIds).not.toContain('wood')
    expect(compoundsForNote('wood').map((c) => c.id)).not.toContain('beta-ionone')
  })

  it('採用見送りの候補（バニリン・マルトール・ホモフラネオール）は登録されていない', () => {
    const names = compounds.flatMap((c) => [c.id, c.name, ...c.aliases]).join(' ')
    expect(names).not.toMatch(/vanillin/i)
    expect(names).not.toMatch(/バニリン/)
    expect(names).not.toMatch(/maltol/i)
    expect(names).not.toMatch(/マルトール/)
    expect(names).not.toMatch(/homofuraneol/i)
    expect(names).not.toMatch(/ホモフラネオール/)
  })

  it('ピラジン類・オクテン類は異性体・別化合物を混同せず別IDで登録されている', () => {
    for (const id of ['2-5-dimethylpyrazine', '2-ethyl-3-5-dimethylpyrazine', 'diethyl-methylpyrazine', 'ethyl-3-6-dimethylpyrazine']) {
      expect(compoundById(id), id).toBeTruthy()
    }
    expect(compoundById('1-octen-3-ol')).toBeTruthy()
    expect(compoundById('octenone')).toBeTruthy()
    expect(compoundById('1-octen-3-ol')!.name).not.toBe(compoundById('octenone')!.name)
  })

  it('味覚5項目すべてにお茶側の呈味成分が対応する', () => {
    for (const taste of ['sweet', 'sour', 'bitter', 'astringent', 'umami'] as const) {
      const teaSide = compoundsForTaste(taste).filter((c) => (c.scopes ?? []).some((s) => s.side === 'tea'))
      expect(teaSide.length, taste).toBeGreaterThan(0)
    }
    expect(compoundsForTaste('bitter').map((c) => c.id)).toEqual(expect.arrayContaining(['caffeine', 'theobromine', 'diketopiperazines', 'flavan-3-ols']))
    expect(compoundsForTaste('astringent').map((c) => c.id)).toEqual(expect.arrayContaining(['gallate-catechins', 'flavonol-glycosides', 'theaflavins', 'n-phenylpropenoyl-amino-acids']))
    expect(compoundsForTaste('umami').map((c) => c.id)).toEqual(expect.arrayContaining(['l-theanine', 'glutamic-acid', 'matcha-umami-enhancers']))
  })

  it('チョコレートの甘味にはカカオ固有の成分を登録しない（配合糖由来の方針）', () => {
    const chocoSweet = compoundsForTaste('sweet').filter((c) =>
      (c.scopes ?? []).some((s) => s.side === 'chocolate' || s.side === 'cacao'))
    expect(chocoSweet).toEqual([])
  })

  it('存在・含有と寄与を混同していない（限定表現の保持）', () => {
    // グルタミン酸のお茶での主要寄与は未確認と明記される
    const glu = compoundById('glutamic-acid')!
    expect(glu.tasteLinks?.[0].evidence).toContain('未確認')
    expect(glu.contributionEvidence).toContain('未確認')
    // 非ガレート型カテキンは一般推定（区分4）にとどまる
    expect(compoundById('non-gallate-catechins')!.contributionEvidence).toContain('一般的な知見')
    // EGCG3″Me は含有の事実のみで、味覚リンクを持たない
    expect(compoundById('egcg3me')!.tasteLinks).toBeUndefined()
    // テアフラビンは閾値と寄与の留保を併記する
    expect(compoundById('theaflavins')!.contributionEvidence).toContain('とは限りません')
    // ソトロンの寄与の強さは総説経由であることが明記される
    expect(compoundById('sotolon')!.contributionEvidence).toContain('総説')
  })

  it('階層（compoundTier）が試料範囲を正しく区別する', () => {
    const hex = compoundById('hexanal')!
    expect(compoundTier(hex, { side: 'tea', kindId: 'white' })).toBe(1)
    expect(compoundTier(hex, { side: 'tea', kindId: 'green' })).toBe(3)
    expect(compoundTier(hex, { side: 'chocolate', kindId: 'dark' })).toBe(3)
    const caf = compoundById('caffeine')!
    expect(compoundTier(caf, { side: 'tea', kindId: 'black' })).toBe(1)
    // カカオニブの根拠はチョコレート側では「原料での研究例」（階層2）
    expect(compoundTier(caf, { side: 'chocolate', kindId: 'dark' })).toBe(2)
    expect(compoundTier(compoundById('theobromine')!, { side: 'chocolate', kindId: 'milk' })).toBe(2)
    // お茶全般の成分はどの茶類でも階層2
    expect(compoundTier(compoundById('linalool')!, { side: 'tea', kindId: 'white' })).toBe(2)
  })

  it('tasteLinks / scopes の参照整合性が保たれている', () => {
    const tasteKeys = ['sweet', 'sour', 'bitter', 'astringent', 'umami']
    const teaKindIds = new Set(teaKinds.map((k) => k.id))
    for (const c of compounds) {
      for (const l of c.tasteLinks ?? []) {
        expect(tasteKeys).toContain(l.taste)
        expect(l.evidence.length).toBeGreaterThan(0)
      }
      for (const s of c.scopes ?? []) {
        if (s.side === 'tea' && s.kindId) expect(teaKindIds.has(s.kindId)).toBe(true)
        if (s.side === 'chocolate' && s.kindId) expect(['dark', 'milk', 'white']).toContain(s.kindId)
        for (const sid of c.sourceIds) expect(sourceIds.has(sid)).toBe(true)
      }
      // 呈味成分は香気ノートと混在させない（香気・呈味の両方を持つ酢酸のような例外は味リンク側で区別を明記）
      if ((c.tasteLinks?.length ?? 0) > 0 && c.noteIds.length > 0) {
        expect(c.id).toBe('acetic-acid')
      }
    }
  })
})
