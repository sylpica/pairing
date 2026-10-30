import { describe, it, expect } from 'vitest'
import {
  TEA_COMBO_KINDS, CHOCO_COMBO_KINDS,
  allTeaRegionOptions, allLineages,
  teaComboViable, chocoComboViable,
  teaKindOptions, teaRegionOptions, teaCultivarOptions,
  chocoOriginOptions, chocoLineageOptions,
  analyzeTeaCombo, analyzeChocoCombo,
  teaComboPath, chocoComboPath, parseTeaComboSub, parseChocoComboSub,
  teaComboTitle, type TeaComboSel, type ChocoComboSel, type ComboAnalysis,
} from './combo'
import { teaCultivars } from '../data/cultivars'
import { cacaoOrigins } from '../data/origins'
import { sources } from '../data/sources'
import { noteById } from '../data/flavors'

const sourceIds = new Set(sources.map((s) => s.id))
const LEVELS = ['measured', 'general', 'inferred']

// 選択空間のアンカー（2026-10-31 時点）。収録データが増えたら、
// 件数の内訳を確認した上でこの数字を更新すること（pairingFullSpace.test.ts と同じ運用）。
const TEA_VIABLE_COUNT = 127
const CHOCO_VIABLE_COUNT = 190

function* teaSpace(): Generator<TeaComboSel> {
  const regions = ['', ...allTeaRegionOptions().map((o) => o.id)]
  const cultivars = ['', ...teaCultivars.map((c) => c.id)]
  for (const kindId of TEA_COMBO_KINDS) for (const regionId of regions) for (const cultivarId of cultivars) {
    yield { kindId, regionId, cultivarId }
  }
}
function* chocoSpace(): Generator<ChocoComboSel> {
  const origins = ['', ...cacaoOrigins.map((o) => o.id)]
  const lineages: ChocoComboSel['lineage'][] = [null, ...allLineages().map((l) => ({ layer: l.layer, id: l.id }))]
  for (const kind of CHOCO_COMBO_KINDS) for (const originId of origins) for (const lineage of lineages) {
    yield { kind, originId, lineage }
  }
}

function checkAnalysis(a: ComboAnalysis) {
  expect(a.title.length).toBeGreaterThan(0)
  expect(LEVELS).toContain(a.overallLevel)
  const allSources: string[] = []
  for (const n of a.notes) {
    expect(noteById(n.noteId)).toBeTruthy()
    expect(LEVELS).toContain(n.level)
    expect(n.basis.length).toBeGreaterThan(0)
    for (const b of n.basis) {
      expect(b.text.length).toBeGreaterThan(0)
      for (const sid of b.sourceIds) { expect(sourceIds.has(sid)).toBe(true); allSources.push(sid) }
    }
    for (const sid of n.sourceIds) expect(sourceIds.has(sid)).toBe(true)
  }
  for (const t of a.tastes) {
    expect(LEVELS).toContain(t.level)
    expect(t.text.length).toBeGreaterThan(0)
    for (const sid of t.sourceIds) expect(sourceIds.has(sid)).toBe(true)
  }
  for (const s of [...a.statements, ...a.caveats]) {
    expect(LEVELS).toContain(s.level)
    for (const sid of s.sourceIds) expect(sourceIds.has(sid)).toBe(true)
  }
  for (const g of a.groups) {
    for (const f of g.findings) for (const sid of f.sourceIds) expect(sourceIds.has(sid)).toBe(true)
    for (const sid of g.sourceIds) expect(sourceIds.has(sid)).toBe(true)
  }
  // 分析結果は数値スコアを持たない（score プロパティが構造上存在しないこと）
  // ※ 所見文中の「VIPスコア≧1」「試料9点」は出典の統計用語・個数であり、味のスコアではない
  const json = JSON.stringify(a)
  expect(json).not.toContain('"score"')
  return allSources
}

describe('組み合わせページ：選択空間の全数検査（お茶）', () => {
  const viable = [...teaSpace()].filter(teaComboViable)
  it(`成立する組み合わせは ${TEA_VIABLE_COUNT} 通り`, () => {
    expect(viable.length).toBe(TEA_VIABLE_COUNT)
  })
  it('全ての成立組み合わせで例外なく分析でき、全ノート・味覚に根拠と実在する出典がある', () => {
    for (const sel of viable) {
      const a = analyzeTeaCombo(sel)
      expect(a.title).toBe(teaComboTitle(sel))
      checkAnalysis(a)
    }
  })
  it('決定性：同じ選択では同じ結果', () => {
    const sel: TeaComboSel = { kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' }
    expect(analyzeTeaCombo(sel)).toEqual(analyzeTeaCombo(sel))
  })
})

describe('組み合わせページ：選択空間の全数検査（チョコ）', () => {
  const viable = [...chocoSpace()].filter(chocoComboViable)
  it(`成立する組み合わせは ${CHOCO_VIABLE_COUNT} 通り`, () => {
    expect(viable.length).toBe(CHOCO_VIABLE_COUNT)
  })
  it('全ての成立組み合わせで例外なく分析でき、全ノート・味覚に根拠と実在する出典がある', () => {
    for (const sel of viable) checkAnalysis(analyzeChocoCombo(sel))
  })
})

describe('プルダウン連動（存在しない組み合わせは選択できない）', () => {
  it('やぶきたで選べる分類は、確認済みの緑茶と、製法科学のルールがある紅茶だけ', () => {
    expect(teaKindOptions({ kindId: '', regionId: '', cultivarId: 'yabukita' })).toEqual(['green', 'black'])
  })
  it('黒茶では、根拠のある品種が無いため品種の選択肢は空', () => {
    expect(teaCultivarOptions({ kindId: 'dark', regionId: '', cultivarId: '' })).toEqual([])
  })
  it('長崎（地域）を選ぶと、品種は日本のものだけになる', () => {
    const opts = teaCultivarOptions({ kindId: 'green', regionId: 'nagasaki', cultivarId: '' })
    expect(opts.length).toBeGreaterThan(0)
    expect(opts.every((c) => c.country === '日本')).toBe(true)
    expect(opts.some((c) => c.id === 'qingxin-oolong')).toBe(false)
  })
  it('やぶきたを選ぶと、産地は日本と長崎だけになる', () => {
    const labels = teaRegionOptions({ kindId: 'green', regionId: '', cultivarId: 'yabukita' }).map((o) => o.id)
    expect(labels).toContain('country:日本')
    expect(labels).toContain('nagasaki')
    expect(labels).not.toContain('country:中国')
  })
  it('タンザニアは、どの系統とも結びつかない（系統の選択肢が空）', () => {
    expect(chocoLineageOptions({ kind: 'dark', originId: 'tanzania', lineage: null })).toEqual([])
    expect(chocoComboViable({ kind: 'dark', originId: 'tanzania', lineage: { layer: 'genetic', id: 'gen-criollo' } })).toBe(false)
  })
  it('クリオロ（遺伝）で選べる産地は、結びつきのある産地だけ', () => {
    const ids = chocoOriginOptions({ kind: 'dark', originId: '', lineage: { layer: 'genetic', id: 'gen-criollo' } }).map((o) => o.id)
    expect(ids).toContain('venezuela')
    expect(ids).toContain('madagascar')
    expect(ids).not.toContain('ghana')
    expect(ids).not.toContain('cote-divoire')
  })
  it('エクアドルでは CCN-51 と Nacional が選べ、無関係な系統は選べない', () => {
    const ids = chocoLineageOptions({ kind: 'dark', originId: 'ecuador', lineage: null }).map((l) => l.id)
    expect(ids).toContain('ccn-51')
    expect(ids).toContain('gen-nacional')
    expect(ids).not.toContain('gen-amelonado')
  })
})

describe('代表例：長崎 × やぶきた（緑茶と紅茶の違い）', () => {
  const green = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
  const black = analyzeTeaCombo({ kindId: 'black', regionId: 'nagasaki', cultivarId: 'yabukita' })

  it('タイトルが組み合わせそのものを指す', () => {
    expect(green.title).toBe('長崎 × やぶきた × 緑茶')
    expect(black.title).toBe('長崎 × やぶきた × 紅茶')
  })
  it('緑茶側には長崎の実測の足場（measured の文と産地の所見）がある', () => {
    const measured = green.statements.filter((s) => s.level === 'measured')
    expect(measured.length).toBeGreaterThan(0)
    expect(measured.flatMap((s) => s.sourceIds)).toContain('tsujimura-2024-nagasaki-tea-foodomics')
    const regionGroup = green.groups.find((g) => g.label === '産地の所見')
    expect(regionGroup?.findings.length).toBe(2)
  })
  it('紅茶側は、酵素活性の低さから渋味・苦味が穏やかな方向へ推測される', () => {
    const astringent = black.tastes.find((t) => t.key === 'astringent')
    expect(astringent?.level).toBe('inferred')
    expect(astringent?.intensity).toBe('weak') // 紅茶一般の「普通」から一段穏やか
    expect(astringent?.text).toContain('酸化酵素活性')
    const bitter = black.tastes.find((t) => t.key === 'bitter')
    expect(bitter?.level).toBe('inferred')
    expect(bitter?.intensity).toBe('weak')
  })
  it('紅茶側では、青さ・ハーブ様が推測ノートとして追加される', () => {
    for (const id of ['green-leaf', 'herb']) {
      const n = black.notes.find((x) => x.noteId === id)
      expect(n?.level).toBe('inferred')
      expect(n?.basis[0].sourceIds).toContain('taneba-2018-yamaguchi-wakocha')
    }
  })
  it('紅茶側は「長崎産の実測はない」ことと「未確認の組み合わせ」であることを明示する', () => {
    expect(black.statements.some((s) => s.text.includes('長崎産の実測は確認できていません'))).toBe(true)
    expect(black.caveats.some((c) => c.text.includes('未確認'))).toBe(true)
    expect(black.statements.some((s) => s.text.includes('酸化酵素'))).toBe(true)
  })
  it('緑茶と紅茶で、ノートと味覚の顔ぶれが実際に異なる（違いが読める）', () => {
    const gNotes = green.notes.map((n) => `${n.noteId}:${n.intensity}:${n.level}`).sort()
    const bNotes = black.notes.map((n) => `${n.noteId}:${n.intensity}:${n.level}`).sort()
    expect(gNotes).not.toEqual(bNotes)
    const gTastes = green.tastes.map((t) => `${t.key}:${t.intensity}:${t.level}`).sort()
    const bTastes = black.tastes.map((t) => `${t.key}:${t.intensity}:${t.level}`).sort()
    expect(gTastes).not.toEqual(bTastes)
    // 緑茶側の渋味は分類プロファイルのまま（普通・一般的知見）で、紅茶側だけが推測で弱まる
    expect(green.tastes.find((t) => t.key === 'astringent')?.intensity).toBe('normal')
  })
})

describe('チョコの推測ルール', () => {
  it('エクアドル × ナシオナル では、花様が推測ノートとして弱く出る', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: 'ecuador', lineage: { layer: 'genetic', id: 'gen-nacional' } })
    const n = a.notes.find((x) => x.noteId === 'floral-general')
    expect(n?.level).toBe('inferred')
    expect(n?.intensity).toBe('weak')
    expect(n?.basis[0].sourceIds).toContain('colonges-2021-nacional-floral')
  })
  it('CCN-51 では苦味・渋味が強い方向へ推測される', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: 'ecuador', lineage: { layer: 'clone', id: 'ccn-51' } })
    for (const key of ['bitter', 'astringent'] as const) {
      const t = a.tastes.find((x) => x.key === key)
      expect(t?.level).toBe('inferred')
      expect(t?.sourceIds).toContain('rottiers-2019-ccn51-nacional-flavor')
    }
  })
  it('系統と産地を重ねると、発酵を介した相互作用の注意が出る', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: 'ecuador', lineage: { layer: 'genetic', id: 'gen-nacional' } })
    expect(a.statements.some((s) => s.sourceIds.includes('trognitz-2013-waslala-cacao-genotype'))).toBe(true)
    expect(a.statements.some((s) => s.sourceIds.includes('gopaulchan-2025-colombia-cacao-fermentation'))).toBe(true)
  })
})

describe('URL ハッシュの往復', () => {
  it('お茶の選択がパスに往復できる', () => {
    const sel: TeaComboSel = { kindId: 'black', regionId: 'nagasaki', cultivarId: 'yabukita' }
    const path = teaComboPath(sel)
    expect(path).toBe('combo/tea/black.nagasaki.yabukita')
    expect(parseTeaComboSub(path.split('/')[2])).toEqual(sel)
  })
  it('チョコの選択がパスに往復できる', () => {
    const sel: ChocoComboSel = { kind: 'dark', originId: 'ecuador', lineage: { layer: 'genetic', id: 'gen-nacional' } }
    const path = chocoComboPath(sel)
    expect(path).toBe('combo/choco/dark.ecuador.genetic:gen-nacional')
    expect(parseChocoComboSub(path.split('/')[2])).toEqual(sel)
  })
})
