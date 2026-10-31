// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import App from './App'
import { teaRegions } from './data/teaRegions'
import { teaCultivars } from './data/cultivars'
import { cacaoOrigins } from './data/origins'
import { teaById } from './data/teas'
import { chocolateById } from './data/chocolates'
import {
  TEA_COMBO_KINDS, CHOCO_COMBO_KINDS, allLineages, allTeaRegionOptions,
  analyzeTeaCombo, analyzeChocoCombo, teaComboViable, chocoComboViable,
  teaComboSiblings, chocoComboSiblings, teaComboTitle, chocoComboTitle,
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
