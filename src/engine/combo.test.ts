import { describe, it, expect } from 'vitest'
import {
  TEA_COMBO_KINDS, CHOCO_COMBO_KINDS,
  allTeaRegionOptions, allLineages,
  teaComboViable, chocoComboViable,
  teaKindOptions, teaRegionOptions, teaCultivarOptions,
  chocoOriginOptions, chocoLineageOptions, cloneRecordedOriginIds,
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
// お茶 564 の内訳：品種なし＝分類6 × 産地36（指定なし＋国5＋地域30）＝216、
// 品種あり＝348（品種×分類の確認があるもの×その国の産地選択肢）。
// 2026-10-31 の成立条件修正（分類×産地は常時成立）と地域30件への拡充で
// 127 から増えた。
const TEA_VIABLE_COUNT = 564
// チョコ 765 の内訳：種類5 × 産地9（指定なし＋8）× 系統17（指定なし＋16）。
// 2026-10-31 実機フィードバック第2弾の自由化で、種類×産地×系統は全て成立する
// （旧：系統×産地の結びつきがあるものだけ 190 通り）。クローンの産地制限は
// UI 到達可能性（選択肢）だけの話で、この成立空間は変えない。
const CHOCO_VIABLE_COUNT = 765

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

describe('成立条件（2026-10-31 修正：分類×産地は常時成立）', () => {
  it('品種を指定しなければ、分類×産地（国・地域）は全通り成立する', () => {
    const regions = ['', ...allTeaRegionOptions().map((o) => o.id)]
    expect(regions.length).toBe(36) // 指定なし＋国5＋地域30
    for (const kindId of TEA_COMBO_KINDS) {
      for (const regionId of regions) {
        expect(teaComboViable({ kindId, regionId, cultivarId: '' }), `${kindId}×${regionId}`).toBe(true)
      }
    }
  })
  it('中国 × 緑茶（品種指定なし）が通常の組み合わせとして開ける', () => {
    const sel: TeaComboSel = { kindId: 'green', regionId: 'country:中国', cultivarId: '' }
    expect(teaComboViable(sel)).toBe(true)
    const a = analyzeTeaCombo(sel)
    expect(a.title).toBe('中国 × 緑茶')
    checkAnalysis(a)
  })
  it('浙江 × 緑茶（品種指定なし）では、地域の実測の足場が measured として出る', () => {
    const sel: TeaComboSel = { kindId: 'green', regionId: 'zhejiang', cultivarId: '' }
    expect(teaComboViable(sel)).toBe(true)
    const a = analyzeTeaCombo(sel)
    expect(a.title).toBe('浙江 × 緑茶')
    expect(a.statements.some((s) => s.level === 'measured')).toBe(true)
    const regionGroup = a.groups.find((g) => g.label === '産地の所見')
    expect(regionGroup?.findings.length).toBe(3)
  })
  it('地域の全所見に出典があり、出典は全て実在する', async () => {
    const { teaRegions } = await import('../data/teaRegions')
    expect(teaRegions.length).toBe(30)
    for (const r of teaRegions) {
      expect(r.findings.length, r.id).toBeGreaterThan(0)
      for (const f of r.findings) {
        expect(f.sourceIds.length, `${r.id}: ${f.statement.slice(0, 20)}`).toBeGreaterThan(0)
        for (const sid of f.sourceIds) expect(sourceIds.has(sid), `${r.id}: ${sid}`).toBe(true)
      }
      for (const sid of r.sourceIds) expect(sourceIds.has(sid), `${r.id}: ${sid}`).toBe(true)
      for (const k of r.applicableKindIds) expect(TEA_COMBO_KINDS, `${r.id}: ${k}`).toContain(k)
    }
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
})

describe('チョコ側の自由化とクローン例外（2026-10-31 実機フィードバック第2弾）', () => {
  it('種類×産地×系統は全て成立する（タンザニア×クリオロも成立）', () => {
    expect(chocoComboViable({ kind: 'dark', originId: 'tanzania', lineage: { layer: 'genetic', id: 'gen-criollo' } })).toBe(true)
    expect(chocoComboViable({ kind: 'milk', originId: 'ghana', lineage: { layer: 'clone', id: 'ccn-51' } })).toBe(true)
    expect(chocoComboViable({ kind: 'white', originId: 'peru', lineage: { layer: 'traditional', id: 'trad-forastero' } })).toBe(true)
  })
  it('タンザニアを選んでも伝統分類・遺伝グループは全て出る（クローンは記録で判定）', () => {
    const opts = chocoLineageOptions({ kind: 'dark', originId: 'tanzania', lineage: null })
    expect(opts.filter((l) => l.layer !== 'clone').length).toBe(13) // 伝統3＋遺伝10
    expect(opts.some((l) => l.id === 'gen-criollo')).toBe(true)
    // クローン：記録産地にタンザニアを含まない CCN-51・IMC-67 は出ない。
    // 記録自体が無い ICS-95 は隠さない（絞らない決まり）。
    expect(opts.filter((l) => l.layer === 'clone').map((l) => l.id)).toEqual(['ics-95'])
  })
  it('クリオロ（遺伝）を選んでも産地は全て出る（自由化：実在の産地を隠さない）', () => {
    const ids = chocoOriginOptions({ kind: 'dark', originId: '', lineage: { layer: 'genetic', id: 'gen-criollo' } }).map((o) => o.id)
    expect(ids).toContain('venezuela')
    expect(ids).toContain('madagascar')
    expect(ids).toContain('ghana')
    expect(ids).toContain('cote-divoire')
    expect(ids.length).toBe(8)
  })
  it('エクアドルでは、記録と両立しないクローン以外の全ての系統が選べる', () => {
    const ids = chocoLineageOptions({ kind: 'dark', originId: 'ecuador', lineage: null }).map((l) => l.id)
    expect(ids).toContain('ccn-51') // 記録産地がエクアドル
    expect(ids).toContain('gen-nacional')
    expect(ids).toContain('gen-amelonado') // 以前は「無関係」として選べなかった
    expect(ids).not.toContain('imc-67') // 記録産地がペルーだけのクローンは出ない
    expect(ids.length).toBe(15) // 全16系統 − IMC-67
  })
  it('クローンの記録産地はデータから機械的に導かれる（CCN-51=エクアドル、IMC-67=ペルー、ICS-95=記録なし）', () => {
    expect(cloneRecordedOriginIds('ccn-51')).toEqual(['ecuador'])
    expect(cloneRecordedOriginIds('imc-67')).toEqual(['peru'])
    // ICS-95 の作出地トリニダードは産地エンティティとして未収録 → 記録のある産地は無い
    expect(cloneRecordedOriginIds('ics-95')).toEqual([])
  })
  it('クローンを選んだときだけ、産地は記録のある産地に絞られる', () => {
    const ccn = chocoOriginOptions({ kind: 'dark', originId: '', lineage: { layer: 'clone', id: 'ccn-51' } }).map((o) => o.id)
    expect(ccn).toEqual(['ecuador'])
    const imc = chocoOriginOptions({ kind: 'dark', originId: '', lineage: { layer: 'clone', id: 'imc-67' } }).map((o) => o.id)
    expect(imc).toEqual(['peru'])
    // 記録の無いクローン（ICS-95）は絞らない（自由のまま）
    const ics = chocoOriginOptions({ kind: 'dark', originId: '', lineage: { layer: 'clone', id: 'ics-95' } }).map((o) => o.id)
    expect(ics.length).toBe(8)
    // 逆向き：記録と合わない産地を選ぶと、そのクローンは系統の選択肢に出ない
    const ghanaLineages = chocoLineageOptions({ kind: 'dark', originId: 'ghana', lineage: null })
    expect(ghanaLineages.some((l) => l.id === 'ccn-51')).toBe(false)
    expect(ghanaLineages.some((l) => l.id === 'ics-95')).toBe(true) // 記録なし→隠さない
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
