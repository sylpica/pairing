import { describe, it, expect } from 'vitest'
import { teaCultivarPairingNote, cacaoPairingNote } from './pairingContext'
import { teaCultivarById } from '../data/cultivars'
import { traditionalGroupById, geneticGroupById, cacaoCloneById } from '../data/cacao'

describe('ペアリングの階層判定（品種・系統指定）', () => {
  it('やぶきた×緑茶は品種×茶類の実測（studied＋所見あり）', () => {
    const note = teaCultivarPairingNote(teaCultivarById('yabukita')!, 'green')
    expect(note.level).toBe('cultivar-measured')
    expect(note.findings.length).toBeGreaterThan(0)
    expect(note.sourceIds.length).toBeGreaterThan(0)
  })
  it('おくみどり×緑茶は組み合わせ確認済みだが香味データなし→茶類レベル', () => {
    const note = teaCultivarPairingNote(teaCultivarById('okumidori')!, 'green')
    expect(note.level).toBe('kind-general')
    expect(note.findings).toHaveLength(0)
    expect(note.text).toContain('未確認')
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
  it('個別クローン IMC-67 は香味データなし→不使用（分類の所見は香味に使わない）', () => {
    const note = cacaoPairingNote('clone', cacaoCloneById('imc-67')!)
    expect(note.level).toBe('insufficient')
    expect(note.findings).toHaveLength(0)
  })
})
