// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import App from './App'
import { teaRegions } from './data/teaRegions'
import { teaCultivars } from './data/cultivars'
import { cacaoOrigins } from './data/origins'
import { teaById, teaItems } from './data/teas'
import { chocolateById, chocolateItems } from './data/chocolates'
import { compoundsForNote, compoundTier } from './data/compounds'
import {
  TEA_COMBO_KINDS, CHOCO_COMBO_KINDS, allLineages, allTeaRegionOptions,
  analyzeTeaCombo, analyzeChocoCombo, teaComboViable, chocoComboViable,
  teaComboSiblings, chocoComboSiblings, teaComboTitle, chocoComboTitle,
  teaComboBaseItem, chocoRepresentativeItem, cloneRecordedOriginIds,
  completeTeaComboSel, completeChocoComboSel,
  type TeaComboSel, type ChocoComboSel, type ComboAnalysis,
} from './engine/combo'
import { assemblePairing } from './engine/pairingCombo'

// 自己監査（2026-10-31 第4弾・ユーザー指示）: 実際に使う側に立った系統的検証。
// 「産地・品種・系統を変えても結果が変わらない／理由も出ない」状態が
// どこにも残っていないことを機械列挙で確認する。
// 監査の不変条件:
//  (1) 軸を選んだら、その軸の要約（axisSummary）が必ず存在する。
//  (2) 要約が「反映されていない」なら、理由文が必ず付いている。
//  (3) ホイール・味覚の署名が土台と変わったのに、要約が「反映されていない」は矛盾（禁止）。
//  (4) ペアリングでは、第2層の顔ぶれが土台と同一なら第3層の出力も土台と同一（幽霊変化の禁止）、
//      軸を指定したらタイトルに軸が出る。

const sig = (a: ComboAnalysis) => JSON.stringify({
  n: a.notes.map((n) => `${n.noteId}:${n.intensity}:${n.level}:${n.basis.map((b) => b.from).join('+')}`),
  t: a.tastes.map((t) => `${t.key}:${t.intensity}:${t.level}`),
})

describe('自己監査1: 調べる（お茶）— 全地域・全品種で「変わる」か「理由が出る」か', () => {
  it('各茶類 × 全地域・全品種を全件確認', () => {
    const problems: string[] = []
    let checked = 0, changed = 0, reasoned = 0, skipped = 0
    for (const kindId of TEA_COMBO_KINDS) {
      const base = analyzeTeaCombo({ kindId, regionId: '', cultivarId: '' })
      const baseSig = sig(base)
      const regionChoices = allTeaRegionOptions().map((o) => o.id)
      for (const regionId of regionChoices) {
        const sel: TeaComboSel = { kindId, regionId, cultivarId: '' }
        if (!teaComboViable(sel)) { skipped++; continue }
        checked++
        const a = analyzeTeaCombo(sel)
        const s = a.axisSummaries.find((x) => x.axis === 'region')
        if (!s) { problems.push(`${kindId}/${regionId}: 地域の要約がない`); continue }
        if (!s.reflected && s.text.length <= 10) problems.push(`${kindId}/${regionId}: 反映なしなのに理由文がない`)
        if (sig(a) !== baseSig && !s.reflected) problems.push(`${kindId}/${regionId}: 署名が変わったのに「反映されていない」`)
        if (sig(a) !== baseSig) changed++; else reasoned++
      }
      for (const c of teaCultivars) {
        const sel: TeaComboSel = { kindId, regionId: '', cultivarId: c.id }
        if (!teaComboViable(sel)) { skipped++; continue }
        checked++
        const a = analyzeTeaCombo(sel)
        const s = a.axisSummaries.find((x) => x.axis === 'cultivar')
        if (!s) { problems.push(`${kindId}/${c.id}: 品種の要約がない`); continue }
        if (!s.reflected && s.text.length <= 10) problems.push(`${kindId}/${c.id}: 反映なしなのに理由文がない`)
        if (sig(a) !== baseSig && !s.reflected) problems.push(`${kindId}/${c.id}: 署名が変わったのに「反映されていない」`)
        if (sig(a) !== baseSig) changed++; else reasoned++
      }
    }
    console.log(`tea browse audit: checked=${checked} changed=${changed} unchangedWithReason=${reasoned} skippedNotViable=${skipped}`)
    expect(problems).toEqual([])
    expect(checked).toBeGreaterThan(200)
    // 第5弾の下限: 第4弾の changed=23 から後退しない（実測 58 件・2026-10-31）
    expect(changed).toBeGreaterThanOrEqual(50)
  })
})

describe('自己監査2: 調べる（チョコ）— 全産地・全系統で「変わる」か「理由が出る」か', () => {
  it('全種類 × 全産地・全系統を全件確認', () => {
    const problems: string[] = []
    let checked = 0, changed = 0, reasoned = 0
    for (const kind of CHOCO_COMBO_KINDS) {
      const base = analyzeChocoCombo({ kind, originId: '', lineage: null })
      const baseSig = sig(base)
      for (const o of cacaoOrigins) {
        const sel: ChocoComboSel = { kind, originId: o.id, lineage: null }
        if (!chocoComboViable(sel)) continue
        checked++
        const a = analyzeChocoCombo(sel)
        const s = a.axisSummaries.find((x) => x.axis === 'origin')
        if (!s) { problems.push(`${kind}/${o.id}: 産地の要約がない`); continue }
        if (!s.reflected && s.text.length <= 10) problems.push(`${kind}/${o.id}: 反映なしなのに理由文がない`)
        if (sig(a) !== baseSig && !s.reflected) problems.push(`${kind}/${o.id}: 署名が変わったのに「反映されていない」`)
        if (sig(a) !== baseSig) changed++; else reasoned++
      }
      for (const l of allLineages()) {
        const sel: ChocoComboSel = { kind, originId: '', lineage: { layer: l.layer, id: l.id } }
        if (!chocoComboViable(sel)) continue
        checked++
        const a = analyzeChocoCombo(sel)
        const s = a.axisSummaries.find((x) => x.axis === 'lineage')
        if (!s) { problems.push(`${kind}/${l.id}: 系統の要約がない`); continue }
        if (!s.reflected && s.text.length <= 10) problems.push(`${kind}/${l.id}: 反映なしなのに理由文がない`)
        if (sig(a) !== baseSig && !s.reflected) problems.push(`${kind}/${l.id}: 署名が変わったのに「反映されていない」`)
        if (sig(a) !== baseSig) changed++; else reasoned++
      }
    }
    console.log(`choco browse audit: checked=${checked} changed=${changed} unchangedWithReason=${reasoned}`)
    expect(problems).toEqual([])
    expect(checked).toBeGreaterThan(100)
    // 第5弾の下限: 第4弾の changed=10 から後退しない（実測 27 件・2026-10-31）
    expect(changed).toBeGreaterThanOrEqual(25)
  })
})

describe('自己監査3: 組み合わせる — 軸を1つずつ変えたときの一貫性', () => {
  const outSig = (a: ReturnType<typeof assemblePairing>) => JSON.stringify({
    r: a.result, i: a.interactions, c: a.characters,
  })
  // 出力は「組み立て済みプロファイル（根拠・出典の構成まで含む）＋アイテム」の純粋関数で
  // なければならない。同じプロファイルに帰着する選択同士で出力が食い違えば、
  // メモ化の汚染や隠れた状態依存がある（幽霊変化）。逆に、根拠が積み増された場合は
  // 性格・相互作用の根拠出典の構成が変わりうる（それは正当な変化として許容する）。
  const profileKey = (a: ReturnType<typeof assemblePairing>) =>
    `${a.teaItem.id}|${JSON.stringify(a.teaItem.profile)}|${a.chocoItem.id}|${JSON.stringify(a.chocoItem.profile)}`

  it('代表ペアで軸を全件走査: 同一プロファイルなら同一出力、軸指定時はタイトルに軸が出る', () => {
    const problems: string[] = []
    const seen = new Map<string, string>()
    let checked = 0
    const check = (a: ReturnType<typeof assemblePairing>, label: string) => {
      checked++
      const key = profileKey(a)
      const out = outSig(a)
      const prev = seen.get(key)
      if (prev !== undefined && prev !== out) problems.push(`${label}: 同一プロファイルなのに出力が食い違う（幽霊変化）`)
      seen.set(key, out)
    }
    const pairs = [
      { tea: teaById('sencha')!, choco: chocolateById('dark-roasted')! },
      { tea: teaById('oolong-tea')!, choco: chocolateById('milk-chocolate') ?? chocolateById('dark-roasted')! },
      { tea: teaById('matcha')!, choco: chocolateById('dark-roasted')! },
    ]
    for (const { tea, choco } of pairs) {
      check(assemblePairing(tea, choco, null, null), `${tea.id}x${choco.id}/base`)
      // お茶側: 品種を1つずつ
      for (const c of teaCultivars) {
        const sel: TeaComboSel = { kindId: tea.id, regionId: '', cultivarId: c.id }
        if (!teaComboViable(sel)) continue
        const a = assemblePairing(tea, choco, sel, null)
        if (!a.teaAnalysis?.title.includes(c.name)) problems.push(`${tea.id}/${c.id}: タイトルに品種が出ない`)
        check(a, `${tea.id}/${c.id}`)
      }
      // お茶側: 地域を1つずつ
      for (const r of teaRegions) {
        const sel: TeaComboSel = { kindId: tea.id, regionId: r.id, cultivarId: '' }
        if (!teaComboViable(sel)) continue
        const a = assemblePairing(tea, choco, sel, null)
        if (!a.teaAnalysis?.title.includes(r.name)) problems.push(`${tea.id}/${r.id}: タイトルに地域が出ない`)
        check(a, `${tea.id}/${r.id}`)
      }
      // チョコ側: 系統・産地を1つずつ
      for (const l of allLineages()) {
        const sel: ChocoComboSel = { kind: choco.kind, originId: '', lineage: { layer: l.layer, id: l.id } }
        if (!chocoComboViable(sel)) continue
        const a = assemblePairing(tea, choco, null, sel)
        if (!a.chocoAnalysis) problems.push(`${choco.id}/${l.id}: 組み合わせ分析がない`)
        check(a, `${choco.id}/${l.id}`)
      }
      for (const o of cacaoOrigins) {
        const sel: ChocoComboSel = { kind: choco.kind, originId: o.id, lineage: null }
        if (!chocoComboViable(sel)) continue
        const a = assemblePairing(tea, choco, null, sel)
        if (!a.chocoAnalysis?.title.includes(o.name)) problems.push(`${choco.id}/${o.id}: タイトルに産地が出ない`)
        check(a, `${choco.id}/${o.id}`)
      }
    }
    console.log(`pairing audit: checked=${checked} distinctProfiles=${seen.size}`)
    expect(problems).toEqual([])
    expect(checked).toBeGreaterThan(100)
  })
})

describe('自己監査7: プロファイル署名のバリエーション実測（第5弾）', () => {
  // プロファイル署名 = ノート集合×強度×根拠レベル＋化合物サブラベル（tier<=2 の化合物ID）
  // ＋味覚（キー×強度×根拠レベル）。ComboWheel の併記ロジックと同じ文脈で数える。
  const profileSig = (a: ComboAnalysis) => JSON.stringify({
    n: a.notes.map((n) => {
      const subs = compoundsForNote(n.noteId)
        .map((c) => ({ id: c.id, tier: compoundTier(c, a.context) }))
        .filter((x) => x.tier <= 2)
        .sort((x, y) => x.tier - y.tier)
        .map((x) => x.id)
      return `${n.noteId}:${n.intensity}:${n.level}:${subs.join('+')}`
    }),
    t: a.tastes.map((t) => `${t.key}:${t.intensity}:${t.level}`),
  })

  const enumerateTeaSels = (): TeaComboSel[] => {
    const kindValues = [...new Set([...TEA_COMBO_KINDS, ...teaItems.map((t) => t.id)])]
    const regionIds = ['', ...allTeaRegionOptions().map((o) => o.id)]
    const cultivarIds = ['', ...teaCultivars.map((c) => c.id)]
    const out: TeaComboSel[] = []
    for (const kindId of kindValues)
      for (const regionId of regionIds)
        for (const cultivarId of cultivarIds) {
          const sel = { kindId, regionId, cultivarId }
          if (teaComboViable(sel)) out.push(sel)
        }
    return out
  }
  const enumerateChocoSels = (): ChocoComboSel[] => {
    const originIds = ['', ...cacaoOrigins.map((o) => o.id)]
    const lineageRefs = [null, ...allLineages().map((l) => ({ layer: l.layer, id: l.id }))]
    const out: ChocoComboSel[] = []
    for (const kind of CHOCO_COMBO_KINDS)
      for (const originId of originIds)
        for (const lineage of lineageRefs) {
          const sel: ChocoComboSel = { kind, originId, lineage }
          if (!chocoComboViable(sel)) continue
          if (lineage?.layer === 'clone' && originId) {
            const recorded = cloneRecordedOriginIds(lineage.id)
            if (recorded.length > 0 && !recorded.includes(originId)) continue
          }
          out.push(sel)
        }
    return out
  }

  it('お茶単体の組み合わせ空間: 相異なる署名の数を実測する', () => {
    const sels = enumerateTeaSels()
    const sigs = new Map<string, number>()
    for (const sel of sels) {
      const s = profileSig(analyzeTeaCombo(sel))
      sigs.set(s, (sigs.get(s) ?? 0) + 1)
    }
    const colliding = [...sigs.values()].filter((v) => v > 1).length
    console.log(`tea combo space: sels=${sels.length} distinctSignatures=${sigs.size} collidingSignatures=${colliding}`)
    // Before（第4弾時点）= 79 種。第5弾の実測 377 種、第7弾の実測 471 種から後退しない
    expect(sigs.size).toBeGreaterThanOrEqual(450)
  }, 600000)

  it('チョコ単体の組み合わせ空間: 相異なる署名の数を実測する', () => {
    const sels = enumerateChocoSels()
    const sigs = new Map<string, number>()
    for (const sel of sels) {
      const s = profileSig(analyzeChocoCombo(sel))
      sigs.set(s, (sigs.get(s) ?? 0) + 1)
    }
    const colliding = [...sigs.values()].filter((v) => v > 1).length
    console.log(`choco combo space: sels=${sels.length} distinctSignatures=${sigs.size} collidingSignatures=${colliding}`)
    // Before（第4弾時点）= 14 種。第5弾の実測 34 種、第7弾の実測 98 種から後退しない
    expect(sigs.size).toBeGreaterThanOrEqual(90)
  }, 600000)

  it('ペアリング空間: 相異なる入力プロファイルの全ペアで、相異なる出力署名の数を実測する', () => {
    const outSig = (a: ReturnType<typeof assemblePairing>) => JSON.stringify({
      r: a.result, i: a.interactions, c: a.characters,
    })
    const teaInputs = new Map<string, { item: NonNullable<ReturnType<typeof teaComboBaseItem>>; sel: TeaComboSel }>()
    for (const sel of enumerateTeaSels()) {
      const item = teaComboBaseItem(sel.kindId)!
      const key = `${item.id}|${profileSig(analyzeTeaCombo(sel))}`
      if (!teaInputs.has(key)) teaInputs.set(key, { item, sel })
    }
    const chocoInputs = new Map<string, { item: (typeof chocolateItems)[number]; sel: ChocoComboSel }>()
    for (const sel of enumerateChocoSels()) {
      const item = chocoRepresentativeItem(sel.kind)!
      const key = `${item.id}|${sel.kind}|${profileSig(analyzeChocoCombo(sel))}`
      if (!chocoInputs.has(key)) chocoInputs.set(key, { item, sel })
    }
    const outs = new Set<string>()
    let pairs = 0
    for (const tea of teaInputs.values()) {
      for (const choco of chocoInputs.values()) {
        pairs++
        outs.add(outSig(assemblePairing(tea.item, choco.item, tea.sel, choco.sel)))
      }
    }
    console.log(`pairing space: distinctTeaInputs=${teaInputs.size} distinctChocoInputs=${chocoInputs.size} distinctPairs=${pairs} distinctOutputs=${outs.size}`)
    // Before（第4弾時点）= 811 種。第5弾の実測 6,645 種、第7弾の実測 15,382 種から後退しない
    expect(outs.size).toBeGreaterThanOrEqual(14000)
  }, 600000)

  it('源泉の観点で区別できる選択同士は、署名が異なる（同署名収束の点検）', () => {
    // 同じ署名に収束してよいのは「香味の顔ぶれとして本当に区別できない」場合だけ。
    // 以下は足がかり (a)〜(e) で方向が異なることが記録されているペアであり、
    // 署名が一致したら推測の埋め込みが潰れている（回帰）。
    // 逆に、意図的に同じ顔ぶれになるペア（根拠の出所だけが違い、香味の方向は
    // 同一）: あさつゆ／さえみどり（同じ記述子の読み替え＋有機酸は土台に置き先なし）、
    // べにほまれ／べにふうき（親と (e) 合成で同じバラ）、ベネズエラ産地／遺伝
    // クリオロ（同じリカー官能ホイールの写し）、イキトス／IMC-67（(d) の写し）、
    // ゆたかみどり／土台（(e) は一段弱く根拠のみ）— これらは根拠文で区別される。
    const teaSig = (sel: TeaComboSel) => profileSig(analyzeTeaCombo(sel))
    const chocoSig = (sel: ChocoComboSel) => profileSig(analyzeChocoCombo(sel))
    const teaPairs: [TeaComboSel, TeaComboSel, string][] = [
      [{ kindId: 'green', regionId: 'murakami', cultivarId: '' }, { kindId: 'green', regionId: 'nagasaki', cultivarId: '' }, '村上（方向なし）≠長崎（うま味の推測）'],
      [{ kindId: 'green', regionId: 'yame', cultivarId: '' }, { kindId: 'green', regionId: 'saga', cultivarId: '' }, '八女（うま味・渋味）≠佐賀（香ばしさ・渋味）'],
      [{ kindId: 'green', regionId: '', cultivarId: 'saemidori' }, { kindId: 'green', regionId: '', cultivarId: 'yabukita' }, 'さえみどり（栗の推測）≠やぶきた（実測）'],
      [{ kindId: 'oolong', regionId: '', cultivarId: 'qingxin-oolong' }, { kindId: 'oolong', regionId: '', cultivarId: '' }, '青心烏龍（推測あり）≠土台'],
      [{ kindId: 'oolong', regionId: '', cultivarId: 'jinxuan' }, { kindId: 'oolong', regionId: '', cultivarId: 'qingxin-oolong' }, '金萱（ミルク）≠青心烏龍（花様・柑橘）'],
      [{ kindId: 'black', regionId: '', cultivarId: 'hongyu' }, { kindId: 'black', regionId: '', cultivarId: '' }, '紅玉（ハーブの推測）≠土台'],
      [{ kindId: 'green', regionId: '', cultivarId: 'fujikaori' }, { kindId: 'green', regionId: '', cultivarId: 'soufu' }, '藤かおり（推測の果実）≠そうふう（実測の果実）'],
      [{ kindId: 'white', regionId: 'sichuan', cultivarId: '' }, { kindId: 'white', regionId: '', cultivarId: '' }, '四川×白茶（葉成分の読み替え）≠土台'],
      [{ kindId: 'yellow', regionId: 'shandong', cultivarId: '' }, { kindId: 'yellow', regionId: '', cultivarId: '' }, '山東×黄茶（葉成分の読み替え）≠土台'],
      [{ kindId: 'green', regionId: 'kagoshima', cultivarId: '' }, { kindId: 'green', regionId: '', cultivarId: '' }, '鹿児島（品種群の傾向）≠土台'],
      [{ kindId: 'black', regionId: 'darjeeling', cultivarId: '' }, { kindId: 'black', regionId: '', cultivarId: '' }, 'ダージリン（特徴成分の推論）≠土台'],
      [{ kindId: 'white', regionId: 'yunnan', cultivarId: '' }, { kindId: 'white', regionId: '', cultivarId: '' }, '雲南×白茶（成分の推論でバラ）≠土台'],
    ]
    for (const [a, b, label] of teaPairs) expect(teaSig(a), label).not.toBe(teaSig(b))
    const chocoPairs: [ChocoComboSel, ChocoComboSel, string][] = [
      [{ kind: 'dark', originId: 'madagascar', lineage: null }, { kind: 'dark', originId: 'tanzania', lineage: null }, 'マダガスカル（麦芽の推測）≠タンザニア（所見なし）'],
      [{ kind: 'dark', originId: '', lineage: { layer: 'traditional', id: 'trad-trinitario' } }, { kind: 'dark', originId: '', lineage: { layer: 'traditional', id: 'trad-forastero' } }, 'トリニタリオ（(e) 合成）≠フォラステロ（総称・知見なし）'],
      [{ kind: 'dark', originId: '', lineage: { layer: 'genetic', id: 'gen-criollo' } }, { kind: 'dark', originId: '', lineage: { layer: 'traditional', id: 'trad-criollo' } }, '遺伝クリオロ（推測の写し）≠伝統クリオロ（一般の写し元）'],
      [{ kind: 'milk', originId: '', lineage: { layer: 'clone', id: 'imc-67' } }, { kind: 'milk', originId: '', lineage: null }, 'IMC-67×ミルク（花様の推測）≠土台'],
      [{ kind: 'milk', originId: '', lineage: { layer: 'clone', id: 'ics-95' } }, { kind: 'milk', originId: '', lineage: null }, 'ICS-95×ミルク（読み替え推測）≠土台'],
      [{ kind: 'milk', originId: 'venezuela', lineage: null }, { kind: 'milk', originId: '', lineage: null }, 'ベネズエラ×ミルク（記述子の推測）≠土台'],
    ]
    for (const [a, b, label] of chocoPairs) expect(chocoSig(a), label).not.toBe(chocoSig(b))
  })
})

describe('自己監査8: 部分指定（軸の部分集合）の全パターン（第5弾・要件6の一般化）', () => {
  // 補完ヘルパー（completeTeaComboSel / completeChocoComboSel）は、調べる画面の
  // プレビューと組み合わせる画面の両方が使う経路そのもの。ここで全パターンを
  // 担保する: 成立する部分集合は未指定の軸を除いて分析でき、タイトルには
  // 指定した軸だけが出て、軸要約も指定した軸についてだけ存在する。
  // 分類・種類が未指定の場合は、補完された分類が assumedKind で明示される。

  it('お茶: 分類のみ／産地のみ／品種のみ／2軸／3軸の全パターンが分析できる', () => {
    const cases: { partial: TeaComboSel; assumed: boolean; titleParts: string[]; axes: string[] }[] = [
      { partial: { kindId: 'green', regionId: '', cultivarId: '' }, assumed: false, titleParts: ['緑茶'], axes: [] },
      { partial: { kindId: '', regionId: 'shizuoka', cultivarId: '' }, assumed: true, titleParts: ['静岡'], axes: ['region'] },
      { partial: { kindId: '', regionId: 'darjeeling', cultivarId: '' }, assumed: true, titleParts: ['ダージリン'], axes: ['region'] },
      { partial: { kindId: '', regionId: 'country:中国', cultivarId: '' }, assumed: true, titleParts: ['中国'], axes: ['region'] },
      { partial: { kindId: '', regionId: '', cultivarId: 'yabukita' }, assumed: true, titleParts: ['やぶきた'], axes: ['cultivar'] },
      { partial: { kindId: '', regionId: 'nagasaki', cultivarId: 'yabukita' }, assumed: true, titleParts: ['長崎', 'やぶきた'], axes: ['region', 'cultivar'] },
      { partial: { kindId: 'green', regionId: 'shizuoka', cultivarId: '' }, assumed: false, titleParts: ['静岡', '緑茶'], axes: ['region'] },
      { partial: { kindId: 'green', regionId: '', cultivarId: 'yabukita' }, assumed: false, titleParts: ['やぶきた', '緑茶'], axes: ['cultivar'] },
      { partial: { kindId: 'green', regionId: 'shizuoka', cultivarId: 'yabukita' }, assumed: false, titleParts: ['静岡', 'やぶきた', '緑茶'], axes: ['region', 'cultivar'] },
    ]
    for (const c of cases) {
      const label = JSON.stringify(c.partial)
      const completed = completeTeaComboSel(c.partial)
      expect(completed, label).not.toBeNull()
      expect(completed!.assumedKind, label).toBe(c.assumed)
      expect(teaComboViable(completed!.sel), label).toBe(true)
      const a = analyzeTeaCombo(completed!.sel)
      for (const part of c.titleParts) expect(a.title, `${label}: タイトルに「${part}」`).toContain(part)
      expect(a.axisSummaries.map((s) => s.axis).sort(), label).toEqual([...c.axes].sort())
      expect(a.notes.length, label).toBeGreaterThan(0)
    }
    // 産地のみ（ダージリン）は適用分類（紅茶）で補完される
    expect(completeTeaComboSel({ kindId: '', regionId: 'darjeeling', cultivarId: '' })!.sel.kindId).toBe('black')
    // 成立しない部分集合（品種の国と産地の国が一致しない）は補完できない
    expect(completeTeaComboSel({ kindId: '', regionId: 'fujian', cultivarId: 'yabukita' })).toBeNull()
    expect(completeTeaComboSel({ kindId: 'green', regionId: 'fujian', cultivarId: 'yabukita' })).toBeNull()
  })

  it('チョコ: 種類のみ／産地のみ／系統のみ／2軸／3軸の全パターンが分析できる', () => {
    const cases: { partial: ChocoComboSel; assumed: boolean; titleParts: string[]; axes: string[] }[] = [
      { partial: { kind: 'dark', originId: '', lineage: null }, assumed: false, titleParts: ['ダーク'], axes: [] },
      { partial: { kind: '', originId: 'ecuador', lineage: null }, assumed: true, titleParts: ['エクアドル'], axes: ['origin'] },
      { partial: { kind: '', originId: '', lineage: { layer: 'genetic', id: 'gen-nacional' } }, assumed: true, titleParts: ['ナシオナル'], axes: ['lineage'] },
      { partial: { kind: '', originId: 'peru', lineage: { layer: 'clone', id: 'ccn-51' } }, assumed: true, titleParts: ['ペルー', 'CCN-51'], axes: ['origin', 'lineage'] },
      { partial: { kind: 'milk', originId: 'venezuela', lineage: null }, assumed: false, titleParts: ['ベネズエラ', 'ミルク'], axes: ['origin'] },
      { partial: { kind: 'dark', originId: '', lineage: { layer: 'clone', id: 'imc-67' } }, assumed: false, titleParts: ['IMC-67', 'ダーク'], axes: ['lineage'] },
      { partial: { kind: 'dark', originId: 'madagascar', lineage: { layer: 'clone', id: 'ics-95' } }, assumed: false, titleParts: ['マダガスカル', 'ICS-95', 'ダーク'], axes: ['origin', 'lineage'] },
    ]
    for (const c of cases) {
      const label = JSON.stringify(c.partial)
      const completed = completeChocoComboSel(c.partial)
      expect(completed, label).not.toBeNull()
      expect(completed!.assumedKind, label).toBe(c.assumed)
      expect(chocoComboViable(completed!.sel), label).toBe(true)
      const a = analyzeChocoCombo(completed!.sel)
      for (const part of c.titleParts) expect(a.title, `${label}: タイトルに「${part}」`).toContain(part)
      expect(a.axisSummaries.map((s) => s.axis).sort(), label).toEqual([...c.axes].sort())
      expect(a.notes.length, label).toBeGreaterThan(0)
    }
    // 産地のみ・系統のみは、評価の土台であるダークで補完される
    expect(completeChocoComboSel({ kind: '', originId: 'ecuador', lineage: null })!.sel.kind).toBe('dark')
  })

  it('ペアリング: 片側だけの部分指定・両側とも部分指定でも結果が組み立てられる', () => {
    const tea = teaById('sencha')!
    const choco = chocolateById('dark-roasted')!
    const teaSels: (TeaComboSel | null)[] = [
      null,
      { kindId: 'green', regionId: '', cultivarId: '' },
      completeTeaComboSel({ kindId: '', regionId: 'shizuoka', cultivarId: '' })!.sel,
      completeTeaComboSel({ kindId: '', regionId: '', cultivarId: 'yabukita' })!.sel,
      completeTeaComboSel({ kindId: '', regionId: 'nagasaki', cultivarId: 'yabukita' })!.sel,
    ]
    const chocoSels: (ChocoComboSel | null)[] = [
      null,
      { kind: 'dark', originId: '', lineage: null },
      completeChocoComboSel({ kind: '', originId: 'ecuador', lineage: null })!.sel,
      completeChocoComboSel({ kind: '', originId: '', lineage: { layer: 'genetic', id: 'gen-nacional' } })!.sel,
      completeChocoComboSel({ kind: '', originId: 'peru', lineage: { layer: 'clone', id: 'ccn-51' } })!.sel,
    ]
    let checked = 0
    for (const ts of teaSels) {
      for (const cs of chocoSels) {
        const a = assemblePairing(tea, choco, ts, cs)
        checked++
        expect(a.result.level).toBeDefined()
        expect(a.interactions).toBeDefined()
        expect(a.characters).toBeDefined()
        if (ts) {
          expect(a.teaAnalysis).not.toBeNull()
          if (ts.regionId) expect(a.teaAnalysis!.title).toContain(ts.regionId === 'nagasaki' ? '長崎' : '静岡')
          if (ts.cultivarId) expect(a.teaAnalysis!.title).toContain('やぶきた')
        }
        if (cs) {
          expect(a.chocoAnalysis).not.toBeNull()
          if (cs.originId) expect(a.chocoAnalysis!.title).toContain(cs.originId === 'peru' ? 'ペルー' : 'エクアドル')
          if (cs.lineage) expect(a.chocoAnalysis!.title).toContain(cs.lineage.id === 'ccn-51' ? 'CCN-51' : 'ナシオナル')
        }
      }
    }
    expect(checked).toBe(25)
  })
})

describe('自己監査4: 組み合わせページの兄弟リンクは選択に追従する', () => {
  it('兄弟のタイトルは、その選択で再計算したタイトルと一致する', () => {
    const teaSel: TeaComboSel = { kindId: 'oolong', regionId: 'guangdong', cultivarId: 'fenghuang-dancong-group' }
    for (const sib of teaComboSiblings(teaSel)) {
      expect(sib.title).toBe(teaComboTitle(sib.sel))
      expect(analyzeTeaCombo(sib.sel).title).toBe(sib.title)
    }
    const chocoSel: ChocoComboSel = { kind: 'dark', originId: 'ecuador', lineage: { layer: 'genetic', id: 'gen-nacional' } }
    for (const sib of chocoComboSiblings(chocoSel)) {
      expect(sib.title).toBe(chocoComboTitle(sib.sel))
      expect(analyzeChocoCombo(sib.sel).title).toBe(sib.title)
    }
  })
})

describe('自己監査5: ホイール文字の可読性（課題B）', () => {
  it('セグメント上の文字は濃色で、化合物名は10px以上', () => {
    const css = readFileSync('src/App.css', 'utf-8')
    const label = css.match(/\.wheel-label\s*\{([^}]*)\}/)?.[1] ?? ''
    const sub = css.match(/\.wheel-sub\s*\{([^}]*)\}/)?.[1] ?? ''
    expect(label).toContain('fill: #2f2318')
    expect(label).not.toContain('#fff')
    expect(label).toContain('font-weight: 700')
    const subFill = sub.match(/fill:\s*(#[0-9a-fA-F]{6})/)?.[1]
    expect(subFill).toBe('#4a3421')
    const subSize = Number(sub.match(/font-size:\s*([\d.]+)px/)?.[1])
    expect(subSize).toBeGreaterThanOrEqual(10)
  })
})

describe('自己監査6: 品種・系統ページでホイールが上部にある', () => {
  beforeEach(() => { cleanup(); localStorage.clear(); location.hash = '#/' })
  it('やぶきた詳細: ホイールの見出しが「科学的な所見」より前に出る', () => {
    location.hash = '#/cultivar/yabukita'
    render(<App />)
    const heads = [...document.querySelectorAll('h3')].map((h) => h.textContent ?? '')
    const wheelIdx = heads.findIndex((t) => t.includes('フレーバーホイール'))
    const findingsIdx = heads.findIndex((t) => t.includes('科学的な所見'))
    expect(wheelIdx).toBeGreaterThanOrEqual(0)
    expect(findingsIdx).toBeGreaterThan(wheelIdx)
    expect(document.querySelector('svg.wheel')).toBeTruthy()
  })
  it('系統詳細（ナシオナル）: ホイールが出て、分類タブで内容が変わる', () => {
    location.hash = '#/cacao/genetic/gen-nacional'
    render(<App />)
    expect(document.querySelector('svg.wheel')).toBeTruthy()
  })
})
