import { describe, it, expect } from 'vitest'
import { teaCultivarPairingNote, cacaoPairingNote, cacaoOriginPairingNote, teaOriginPairingNote, teaOriginCountries } from './pairingContext'
import { teaCultivarById } from '../data/cultivars'
import { traditionalGroupById, geneticGroupById, cacaoCloneById } from '../data/cacao'
import { cacaoOriginById } from '../data/origins'

describe('ペアリングの階層判定（品種・系統指定）', () => {
  it('やぶきた×緑茶は品種×茶類の実測（studied＋所見あり）', () => {
    const note = teaCultivarPairingNote(teaCultivarById('yabukita')!, 'green')
    expect(note.level).toBe('cultivar-measured')
    expect(note.findings.length).toBeGreaterThan(0)
    expect(note.sourceIds.length).toBeGreaterThan(0)
  })
  it('おくみどり×緑茶は documented＋官能記述等の所見あり→品種固有の一般的傾向', () => {
    // 2026-10-31 の推測拡充で、おくみどり に官能記述（木下 2015）と被覆条件の
    // 成分実測の所見が付いたため、茶類レベルから品種レベルに上がった
    const note = teaCultivarPairingNote(teaCultivarById('okumidori')!, 'green')
    expect(note.level).toBe('cultivar-general')
    expect(note.findings.length).toBeGreaterThan(0)
    expect(note.sourceIds.length).toBeGreaterThan(0)
  })
  it('べにふうき×紅茶は documented＋条件付き所見→品種固有の一般的傾向', () => {
    const note = teaCultivarPairingNote(teaCultivarById('benifuuki')!, 'black')
    expect(note.level).toBe('cultivar-general')
    expect(note.findings.length).toBeGreaterThan(0)
  })
  it('確認されていない組み合わせ（やぶきた×紅茶）は実測済みと扱わない', () => {
    const note = teaCultivarPairingNote(teaCultivarById('yabukita')!, 'black')
    expect(note.level).toBe('kind-general')
    expect(note.findings).toHaveLength(0)
    expect(note.text).toContain('未確認')
  })
  it('伝統的分類 Criollo は集団レベルの参考（所見あり）', () => {
    const note = cacaoPairingNote('traditional', traditionalGroupById('trad-criollo')!)
    expect(note.level).toBe('group-general')
    expect(note.findings.length).toBeGreaterThan(0)
  })
  it('伝統的分類 Forastero は香味データなし→不使用（insufficient）', () => {
    const note = cacaoPairingNote('traditional', traditionalGroupById('trad-forastero')!)
    expect(note.level).toBe('insufficient')
    expect(note.findings).toHaveLength(0)
  })
  it('遺伝集団 Nacional は集団レベルの参考（官能の所見あり）', () => {
    const note = cacaoPairingNote('genetic', geneticGroupById('gen-nacional')!)
    expect(note.level).toBe('group-general')
    expect(note.findings.some((f) => f.kind === 'sensory')).toBe(true)
  })
  it('遺伝集団 Amelonado は香味データなし→不使用', () => {
    const note = cacaoPairingNote('genetic', geneticGroupById('gen-amelonado')!)
    expect(note.level).toBe('insufficient')
  })
  it('個別クローン CCN-51 はクローンの実測', () => {
    const note = cacaoPairingNote('clone', cacaoCloneById('ccn-51')!)
    expect(note.level).toBe('cultivar-measured')
    expect(note.findings.length).toBeGreaterThan(0)
  })
  it('個別クローン IMC-67 は検出・成分の実測が加わり使用される（分類の所見は香味に使わない）', () => {
    const note = cacaoPairingNote('clone', cacaoCloneById('imc-67')!)
    expect(note.level).toBe('cultivar-measured')
    expect(note.findings.length).toBeGreaterThan(0)
    expect(note.findings.every((f) => f.kind !== 'classification')).toBe(true)
    expect(note.findings.some((f) => f.sourceIds.includes('collin-2023-cocoa-bean-genotypes-aroma'))).toBe(true)
  })
})

describe('ペアリングの階層判定（産地指定）', () => {
  it('ドミニカ共和国は産地の官能実測あり→origin-measured', () => {
    const note = cacaoOriginPairingNote(cacaoOriginById('dominican-republic')!)
    expect(note.level).toBe('origin-measured')
    expect(note.findings.some((f) => f.kind === 'sensory')).toBe(true)
    expect(note.sourceIds.length).toBeGreaterThan(0)
  })
  it('ガーナは産地試料の実測あり→origin-measured（加工条件の実測である旨を明記）', () => {
    const note = cacaoOriginPairingNote(cacaoOriginById('ghana')!)
    expect(note.level).toBe('origin-measured')
    expect(note.findings.length).toBeGreaterThan(0)
  })
  it('エクアドルは集団レベルの知見のみ→group-general', () => {
    const note = cacaoOriginPairingNote(cacaoOriginById('ecuador')!)
    expect(note.level).toBe('group-general')
    expect(note.findings.length).toBeGreaterThan(0)
    expect(note.text).toContain('断定')
  })
  it('ベネズエラは組成の実測のみ→group-general（産地の味として断定しない）', () => {
    const note = cacaoOriginPairingNote(cacaoOriginById('venezuela')!)
    expect(note.level).toBe('group-general')
  })
  it('タンザニアは香味データ未確認→insufficient（産地情報は見方に使わない）', () => {
    const note = cacaoOriginPairingNote(cacaoOriginById('tanzania')!)
    expect(note.level).toBe('insufficient')
    expect(note.findings).toHaveLength(0)
    expect(note.text).toContain('未確認')
  })
  it('コートジボワールは産地の官能実測が加わり→origin-measured（地域差は小さいという結論側）', () => {
    const note = cacaoOriginPairingNote(cacaoOriginById('cote-divoire')!)
    expect(note.level).toBe('origin-measured')
    expect(note.findings.some((f) => f.kind === 'sensory')).toBe(true)
    expect(note.sourceIds).toContain('amien-2025-cote-divoire-cocoa-origins')
  })
})

describe('ペアリングの階層判定（お茶の産地指定）', () => {
  it('産地の選択肢は品種データに実在する国だけ', () => {
    const countries = teaOriginCountries()
    expect(countries).toContain('日本')
    expect(countries).toContain('中国')
    expect(countries).toContain('台湾')
    expect(countries).toContain('インド')
    expect(countries).toContain('スリランカ')
  })
  it('日本×緑茶は品種レベルの所見がある→group-general（産地の実測とは言わない）', () => {
    const note = teaOriginPairingNote('日本', 'green')
    expect(note.level).toBe('group-general')
    expect(note.findings.length).toBeGreaterThan(0)
    expect(note.sourceIds.length).toBeGreaterThan(0)
    expect(note.text).toContain('産地そのものの香味実測ではなく')
    expect(note.text).toContain('断定')
  })
  it('スリランカ×紅茶は TRI クローンの組成実測により group-general（産地の実測とは言わない）', () => {
    // 2026-10-31 の推測拡充で TRI 2023/2025/2043 に組成（含有）の実測所見が付いた。
    // 産地そのものの香味実測ではないことは文言で担保する
    const note = teaOriginPairingNote('スリランカ', 'black')
    expect(note.level).toBe('group-general')
    expect(note.findings.length).toBeGreaterThan(0)
    expect(note.text).toContain('産地そのものの香味実測ではなく')
    expect(note.text).toContain('断定')
    // 併記される所見は組成の実測であり、官能の所見は含まれない
    expect(note.findings.every((f) => f.kind === 'composition')).toBe(true)
  })
  it('スリランカ×青茶は組み合わせ自体が未確認→insufficient', () => {
    const note = teaOriginPairingNote('スリランカ', 'oolong')
    expect(note.level).toBe('insufficient')
    expect(note.findings).toHaveLength(0)
    expect(note.text).toContain('未確認')
  })
})
