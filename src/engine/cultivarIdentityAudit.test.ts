import { describe, it, expect } from 'vitest'
import {
  TEA_COMBO_KINDS, CHOCO_COMBO_KINDS, allTeaRegionOptions,
  teaCultivarOptions, chocoLineageOptions, teaComboBaseItem, chocoRepresentativeItem,
  type TeaComboSel, type ChocoComboSel,
} from './combo'
import { teaComboCached, chocoComboCached, assembleBlend } from './pairingCombo'
import { cacaoOrigins } from '../data/origins'

// 第28弾: 品種・系統の同一性監査。
// 選択可能な全ての文脈（分類×産地）で、品種（系統）を切り替えたときに
// (i) 単体組み合わせプロファイル（第2層）と (ii) ペアリングホイールの
// 表示署名が「全く変わらない」グループを全数列挙する。
// 監査の詳細は /tmp/cultivar-identity-audit.json に書き出す（報告の基礎）。
//
// 第28弾の差別化の結果、残る同一グループは以下の理由カテゴリに限られる
// （例外リストと完全一致することをここで固定する。新しい同一グループが
// 生まれたらテストが落ちる）:
//  T1 足がかり皆無: TRI 2023/2025/2043（組成のみ）、P312、べにふうき緑茶、
//     青心大冇の緑茶（適性記述のみ）
//  T2 地域・国レベルの集約が品種差を吸収: 地域ルール自体が県内品種群の
//     記述子から作られる鹿児島、味覚を極端まで押し上げる国レベル集約・
//     八女等では、品種側の味覚効果が上限・下限で潰れる
//  T3 ホイール代表選択の段階化: 第2層では差があっても、ペアリングホイール
//     （両側の重み合計を段階化し代表を最大7件に絞る）では同じ表示になる
//  C1 野生遺伝集団の香味実測なし: Curaray / Marañon / Nanay / Purús と
//     総称フォラステロ（実測は原理的に存在しない）、Guiana のダーク
//     （カカオの裏付けのみで土台と同値）
//  C2 足がかりが同一: Contamana と Iquitos はどちらもリナロール→花様のみ
//  C3 種類の構造: ホワイトはカカオマスを使わず系統差が原理的に出ない。
//     ブロンドはホワイト系で系統ルールの適用が限られる。ルビーは土台
//     プロファイルが薄く系統効果の多くが既存ノートへの裏付けに留まる
//  C4 対応関係そのもの: 遺伝集団クリオロの唯一の足がかりは伝統的分類との
//     対応であり、ミルク／ルビーでは伝統側の味覚効果も土台に現れない

const norm = (members: string[]) => [...members].sort().join(',')

const TEA_COMBO_EXCEPTIONS = new Set([
  'benifuuki,qingxin-damao',
  'benifuuki,samidori',
  'okumidori,benifuuki',
  'p312,tri-2023,tri-2025,tri-2043',
  'seimei,meiryoku',
  'tri-2023,tri-2025,tri-2043',
  'tsuyuhikari,benifuuki,samidori',
  'tsuyuhikari,samidori',
  'yabukita,soufu',
].map((s) => norm(s.split(','))))

const TEA_WHEEL_EXCEPTIONS = new Set([
  'okumidori,tsuyuhikari,benifuuki,samidori',
  'okumidori,yutakamidori,benifuuki,samidori',
  'p312,tri-2023,tri-2025,tri-2043',
  'sijichun,tieguanyin',
  'soufu,harumidori',
  'tieguanyin,fenghuang-dancong-group',
  'tri-2023,tri-2025,tri-2043',
  'tsuiyu,fenghuang-dancong-group',
  'tsuyuhikari,benifuuki,samidori',
  'yabukita,meiryoku',
  'yabukita,seimei,meiryoku',
  'yabukita,soufu,harumidori,meiryoku',
  'yabukita,soufu,seimei,harumidori,meiryoku',
  'yutakamidori,benifuuki,samidori',
  'yutakamidori,benifuuki,samidori,qingxin-damao',
].map((s) => norm(s.split(','))))

const CHOCO_COMBO_EXCEPTIONS = new Set([
  'genetic:gen-amelonado,genetic:gen-guiana',
  'genetic:gen-contamana,genetic:gen-iquitos',
  'genetic:gen-contamana,genetic:gen-iquitos,clone:ics-95',
  'traditional:trad-criollo,genetic:gen-criollo',
  'traditional:trad-criollo,traditional:trad-forastero,genetic:gen-criollo,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario,genetic:gen-criollo,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ccn-51,clone:ics-95',
  'traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario,genetic:gen-criollo,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ccn-51,clone:ics-95,clone:imc-67',
  'traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario,genetic:gen-criollo,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ics-95',
  'traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario,genetic:gen-criollo,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ics-95,clone:imc-67',
  'traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario,genetic:gen-criollo,genetic:gen-amelonado,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-criollo,traditional:trad-trinitario,genetic:gen-criollo',
  'traditional:trad-forastero,genetic:gen-amelonado,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-forastero,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-forastero,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ccn-51',
  'traditional:trad-forastero,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ics-95',
  'traditional:trad-forastero,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-forastero,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-forastero,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-forastero,genetic:gen-curaray,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-trinitario,clone:ics-95',
  'traditional:trad-trinitario,genetic:gen-criollo',
].map((s) => norm(s.split(','))))

const CHOCO_WHEEL_EXCEPTIONS = new Set([
  'genetic:gen-amelonado,clone:ics-95',
  'genetic:gen-amelonado,genetic:gen-guiana',
  'genetic:gen-contamana,genetic:gen-iquitos',
  'genetic:gen-nacional,clone:ics-95',
  'traditional:trad-criollo,genetic:gen-criollo',
  'traditional:trad-criollo,traditional:trad-forastero,genetic:gen-criollo,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-criollo,traditional:trad-forastero,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario,genetic:gen-criollo,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario,genetic:gen-criollo,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ccn-51',
  'traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario,genetic:gen-criollo,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ics-95',
  'traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario,genetic:gen-criollo,genetic:gen-amelonado,genetic:gen-nacional,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ccn-51,clone:ics-95',
  'traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario,genetic:gen-criollo,genetic:gen-amelonado,genetic:gen-nacional,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ccn-51,clone:ics-95,clone:imc-67',
  'traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario,genetic:gen-criollo,genetic:gen-amelonado,genetic:gen-nacional,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ics-95',
  'traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario,genetic:gen-criollo,genetic:gen-amelonado,genetic:gen-nacional,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ics-95,clone:imc-67',
  'traditional:trad-criollo,traditional:trad-trinitario,genetic:gen-criollo',
  'traditional:trad-forastero,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ics-95',
  'traditional:trad-forastero,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-forastero,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ccn-51',
  'traditional:trad-forastero,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-forastero,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ccn-51',
  'traditional:trad-forastero,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,clone:ics-95',
  'traditional:trad-forastero,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus',
  'traditional:trad-trinitario,clone:ics-95',
  'traditional:trad-trinitario,genetic:gen-amelonado',
  'traditional:trad-trinitario,genetic:gen-criollo',
].map((s) => norm(s.split(','))))

const comboSigTea = (sel: TeaComboSel) => {
  const a = teaComboCached(sel)
  return a.notes.map((n) => `${n.noteId}:${n.intensity}:${n.level}`).sort().join(',')
    + '|' + a.tastes.map((t) => `${t.key}:${t.intensity}:${t.level}`).sort().join(',')
}
const comboSigChoco = (sel: ChocoComboSel) => {
  const a = chocoComboCached(sel)
  return a.notes.map((n) => `${n.noteId}:${n.intensity}:${n.level}`).sort().join(',')
    + '|' + a.tastes.map((t) => `${t.key}:${t.intensity}:${t.level}`).sort().join(',')
}
const wheelSig = (w: ReturnType<typeof assembleBlend>['wheel']) =>
  w.notes.map((n) => `${n.noteId}:${n.intensity}`).sort().join(',')
  + '|' + w.tastes.map((t) => `${t.key}:${t.intensity}`).sort().join(',')

interface Group { context: string; members: string[] }
interface SideAudit {
  contextsWithChoice: number
  comboGroups: Group[]
  wheelGroups: Group[]
  baseEqualCombo: { context: string; members: string[] }[]
  baseEqualWheel: { context: string; members: string[] }[]
}

function auditTea(): SideAudit {
  const regionIds = ['', ...allTeaRegionOptions().map((o) => o.id)]
  const out: SideAudit = { contextsWithChoice: 0, comboGroups: [], wheelGroups: [], baseEqualCombo: [], baseEqualWheel: [] }
  const chocoItem = chocoRepresentativeItem('dark')!
  const chocoSel: ChocoComboSel = { kind: 'dark', originId: '', lineage: null }
  for (const kindId of TEA_COMBO_KINDS) {
    const item = teaComboBaseItem(kindId)!
    for (const regionId of regionIds) {
      const options = teaCultivarOptions({ kindId, regionId, cultivarId: '' })
      if (options.length < 2) continue
      out.contextsWithChoice++
      const ctx = `tea:${kindId}|${regionId || '-'}`
      const baseCombo = comboSigTea({ kindId, regionId, cultivarId: '' })
      const baseWheel = wheelSig(assembleBlend(
        { type: 'tea', item, sel: { kindId, regionId, cultivarId: '' } },
        { type: 'chocolate', item: chocoItem, sel: chocoSel }).wheel)
      const byCombo = new Map<string, string[]>()
      const byWheel = new Map<string, string[]>()
      const beC: string[] = []
      const beW: string[] = []
      for (const c of options) {
        const sel: TeaComboSel = { kindId, regionId, cultivarId: c.id }
        const cs = comboSigTea(sel)
        const ws = wheelSig(assembleBlend(
          { type: 'tea', item, sel },
          { type: 'chocolate', item: chocoItem, sel: chocoSel }).wheel)
        byCombo.set(cs, [...(byCombo.get(cs) ?? []), c.id])
        byWheel.set(ws, [...(byWheel.get(ws) ?? []), c.id])
        if (cs === baseCombo) beC.push(c.id)
        if (ws === baseWheel) beW.push(c.id)
      }
      for (const members of byCombo.values()) if (members.length >= 2) out.comboGroups.push({ context: ctx, members })
      for (const members of byWheel.values()) if (members.length >= 2) out.wheelGroups.push({ context: ctx, members })
      if (beC.length > 0) out.baseEqualCombo.push({ context: ctx, members: beC })
      if (beW.length > 0) out.baseEqualWheel.push({ context: ctx, members: beW })
    }
  }
  return out
}

function auditChoco(): SideAudit {
  const originIds = ['', ...cacaoOrigins.map((o) => o.id)]
  const out: SideAudit = { contextsWithChoice: 0, comboGroups: [], wheelGroups: [], baseEqualCombo: [], baseEqualWheel: [] }
  const teaItem = teaComboBaseItem('green')!
  const teaSel: TeaComboSel = { kindId: 'green', regionId: '', cultivarId: '' }
  for (const kind of CHOCO_COMBO_KINDS) {
    const item = chocoRepresentativeItem(kind)!
    for (const originId of originIds) {
      const options = chocoLineageOptions({ kind, originId, lineage: null })
      if (options.length < 2) continue
      out.contextsWithChoice++
      const ctx = `choco:${kind}|${originId || '-'}`
      const baseCombo = comboSigChoco({ kind, originId, lineage: null })
      const baseWheel = wheelSig(assembleBlend(
        { type: 'tea', item: teaItem, sel: teaSel },
        { type: 'chocolate', item, sel: { kind, originId, lineage: null } }).wheel)
      const byCombo = new Map<string, string[]>()
      const byWheel = new Map<string, string[]>()
      const beC: string[] = []
      const beW: string[] = []
      for (const l of options) {
        const sel: ChocoComboSel = { kind, originId, lineage: { layer: l.layer, id: l.id } }
        const key = `${l.layer}:${l.id}`
        const cs = comboSigChoco(sel)
        const ws = wheelSig(assembleBlend(
          { type: 'tea', item: teaItem, sel: teaSel },
          { type: 'chocolate', item, sel }).wheel)
        byCombo.set(cs, [...(byCombo.get(cs) ?? []), key])
        byWheel.set(ws, [...(byWheel.get(ws) ?? []), key])
        if (cs === baseCombo) beC.push(key)
        if (ws === baseWheel) beW.push(key)
      }
      for (const members of byCombo.values()) if (members.length >= 2) out.comboGroups.push({ context: ctx, members })
      for (const members of byWheel.values()) if (members.length >= 2) out.wheelGroups.push({ context: ctx, members })
      if (beC.length > 0) out.baseEqualCombo.push({ context: ctx, members: beC })
      if (beW.length > 0) out.baseEqualWheel.push({ context: ctx, members: beW })
    }
  }
  return out
}

describe('品種・系統の同一性監査（第28弾）', () => {
  it('残る同一グループが例外リスト（理由カテゴリ T1〜T3 / C1〜C4）と一致する', async () => {
    const tea = auditTea()
    const choco = auditChoco()
    const detail = { tea, choco }
    const { writeFileSync } = await import('node:fs')
    writeFileSync('/tmp/cultivar-identity-audit.json', JSON.stringify(detail, null, 1))
    // eslint-disable-next-line no-console
    console.log(JSON.stringify({
      tea: {
        contexts: tea.contextsWithChoice,
        comboGroups: tea.comboGroups.length,
        wheelGroups: tea.wheelGroups.length,
        baseEqualComboPairs: tea.baseEqualCombo.reduce((s, g) => s + g.members.length, 0),
        baseEqualWheelPairs: tea.baseEqualWheel.reduce((s, g) => s + g.members.length, 0),
      },
      choco: {
        contexts: choco.contextsWithChoice,
        comboGroups: choco.comboGroups.length,
        wheelGroups: choco.wheelGroups.length,
        baseEqualComboPairs: choco.baseEqualCombo.reduce((s, g) => s + g.members.length, 0),
        baseEqualWheelPairs: choco.baseEqualWheel.reduce((s, g) => s + g.members.length, 0),
      },
    }))
    expect(tea.contextsWithChoice).toBeGreaterThan(0)
    expect(choco.contextsWithChoice).toBeGreaterThan(0)
    for (const g of tea.comboGroups) expect(TEA_COMBO_EXCEPTIONS.has(norm(g.members)), `tea combo ${g.context}: ${g.members}`).toBe(true)
    for (const g of tea.wheelGroups) expect(TEA_WHEEL_EXCEPTIONS.has(norm(g.members)), `tea wheel ${g.context}: ${g.members}`).toBe(true)
    for (const g of choco.comboGroups) expect(CHOCO_COMBO_EXCEPTIONS.has(norm(g.members)), `choco combo ${g.context}: ${g.members}`).toBe(true)
    for (const g of choco.wheelGroups) expect(CHOCO_WHEEL_EXCEPTIONS.has(norm(g.members)), `choco wheel ${g.context}: ${g.members}`).toBe(true)
  }, 900000)
})
