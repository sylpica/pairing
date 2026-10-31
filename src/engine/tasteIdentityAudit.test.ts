import { describe, it, expect } from 'vitest'
import {
  TEA_COMBO_KINDS, CHOCO_COMBO_KINDS, allTeaRegionOptions,
  teaCultivarOptions, teaRegionOptions, chocoLineageOptions, chocoOriginOptions,
  teaComboBaseItem, chocoRepresentativeItem, allLineages, analyzeChocoCombo, analyzeTeaCombo,
  type TeaComboSel, type ChocoComboSel, type ComboAnalysis,
} from './combo'
import { teaComboCached, chocoComboCached, assembleBlend } from './pairingCombo'
import { buildTasteNoteTiers, buildAstringency } from './wheelTiers'
import { cacaoOrigins } from '../data/origins'
import { teaCultivars } from '../data/cultivars'

// 第37弾: 味ホイールの同一性監査（第28弾の品種・系統同一性監査の味版）。
// ユーザー実機FB「産地や系統を変えてもほとんど味ホイールが変わらない」を受け、
// 味ホイールの表示署名（第1階層の基本味の顔ぶれ・％・根拠レベル＋第2階層の
// 具体名・％・レベル＋渋味ゲージの強さ・レベル）が、軸を変えても全く変わらない
// グループを全数列挙し、残存グループを理由カテゴリつき例外リストで固定する。
// 新しい同一グループが生まれたら（＝差別化の後退）テストが落ちる。
//
// 変更前（第36弾時点）→ 第37弾の実測:
//   土台と完全一致する延べ件数: お茶・品種 191→180 / お茶・産地 193→193 /
//     チョコ・系統 476→397 / チョコ・産地 422→326 /
//     ペアリング（チョコ側を変える）457→399 / ペアリング（お茶側）186→182
//   相異なる味署名の数: お茶コンボ 78→82種 / チョココンボ 60→104種
// 第37弾で効いた差別化: エクアドル産地への味覚読み替え（Boza 2014）、
//   ペルー産地の酸味、ドミニカのルビー拡張＋柑橘、マダガスカル組成実測の
//   種類越え読み替え、マラニョンへの近接（白豆）仮説、遺伝クリオロへの
//   対応読み替え、トリニタリオへの遺伝合成（味覚）、イキトスへの柑橘、
//   ICS-95 の酸味、さやまかおりの渋味（公的資料＋参考情報）。
//
// 残存同一グループの理由カテゴリ（第28弾の T1〜T3 / C1〜C4 を味向けに拡張）:
//  T1 足がかり皆無: 所見が組成のみ・香りのみで、土台の味に対応づく方向が無い
//     （TRI クローン、P312、べにふうき／べにほまれ、紅茶・烏龍茶の多くの品種。
//     特に烏龍茶・紅茶は土台に甘味・酸味が無く、品種差が主に甘味側の
//     ノート（蜂蜜・果実）に現れるため味ホイールでは同値になる）
//  T2 集約・吸収: 国レベル集約や産地側の効果が品種・系統差を吸収する
//     （鹿児島、八女、ガーナ×ICS-95/Contamana、ドミニカ×Contamana/Iquitos 等）
//  T3 ペアリング側の段階化: 単体では差があってもペアリング合成（重みの
//     段階化・代表の絞り込み）で同じ表示になる
//  C1 野生遺伝集団の香味実測なし: Curaray / Nanay / Purús と総称フォラステロ
//  C2 足がかりの方向が同一: クリオロ対応の3者、Marañon と Nacional、
//     エクアドルとペルー（どちらも酸味・苦味・渋味が穏やかな方向）、
//     おくみどり と かなやみどり（どちらも果実の甘味側の追加のみ）、
//     長崎 と 宇治（どちらもうま味が強まる方向）など
//  C3 種類の構造: ホワイトはカカオマスを使わず系統・産地差が原理的に出ない
//  C4 対応関係そのもの: Iquitos と IMC-67（集団とその構成クローンで
//     足がかりが同一）、遺伝クリオロと伝統的クリオロ（対応が唯一の足がかり）
//  C5 飽和: 同じ方向の効果が重なっても一段までしか動かず下限・上限で潰れる
//     （例: ルビー×Marañon で産地側の酸味 mild 化が系統側と重なる）

export const tasteSigOf = (notes: ComboAnalysis['notes'], tastes: ComboAnalysis['tastes'], ctx: ComboAnalysis['context'] | ComboAnalysis['context'][]) => {
  const tiers = buildTasteNoteTiers(notes, tastes, ctx as never)
  const wheel = tiers.map((g) => `${g.key}:${g.percent}:${g.taste.level}[${g.entries.map((e) => `${e.kind === 'note' ? e.noteId : `sp:${e.label}`}:${e.percent}:${e.level}`).join(',')}]`).join('|')
  const astr = buildAstringency(tastes, ctx as never)
  const gauge = astr ? `astr:${astr.taste.intensity}:${astr.taste.level}` : 'astr:none'
  return `${wheel}#${gauge}`
}

interface Group { context: string; members: string[] }
interface AuditOut {
  contexts: number
  groups: Group[]
  baseEqual: { context: string; members: string[] }[]
  distinctSignatures: number
}

const groupBy = (entries: { key: string; sig: string }[], baseSig: string, context: string, out: AuditOut) => {
  const by = new Map<string, string[]>()
  const be: string[] = []
  for (const e of entries) {
    by.set(e.sig, [...(by.get(e.sig) ?? []), e.key])
    if (e.sig === baseSig) be.push(e.key)
  }
  for (const members of by.values()) if (members.length >= 2) out.groups.push({ context, members })
  if (be.length > 0) out.baseEqual.push({ context, members: be })
}

const norm = (members: string[]) => [...members].sort().join(',')

function runAudit() {
  const teaVaryCultivar: AuditOut = { contexts: 0, groups: [], baseEqual: [], distinctSignatures: 0 }
  const teaVaryRegion: AuditOut = { contexts: 0, groups: [], baseEqual: [], distinctSignatures: 0 }
  const chocoVaryLineage: AuditOut = { contexts: 0, groups: [], baseEqual: [], distinctSignatures: 0 }
  const chocoVaryOrigin: AuditOut = { contexts: 0, groups: [], baseEqual: [], distinctSignatures: 0 }
  const pairVaryChoco: AuditOut = { contexts: 0, groups: [], baseEqual: [], distinctSignatures: 0 }
  const pairVaryTea: AuditOut = { contexts: 0, groups: [], baseEqual: [], distinctSignatures: 0 }

  const regionIds = ['', ...allTeaRegionOptions().map((o) => o.id)]
  const teaSigCache = new Map<string, string>()
  const teaSig = (sel: TeaComboSel): string | null => {
    const k = `${sel.kindId}|${sel.regionId}|${sel.cultivarId}`
    if (!teaSigCache.has(k)) {
      const a = teaComboCached(sel)
      if (!a) return null
      teaSigCache.set(k, tasteSigOf(a.notes, a.tastes, a.context))
    }
    return teaSigCache.get(k)!
  }
  for (const kindId of TEA_COMBO_KINDS) {
    for (const regionId of regionIds) {
      const options = teaCultivarOptions({ kindId, regionId, cultivarId: '' })
      if (options.length < 2) continue
      const base = teaSig({ kindId, regionId, cultivarId: '' })
      if (base === null) continue
      teaVaryCultivar.contexts++
      groupBy(options.map((c) => ({ key: c.id, sig: teaSig({ kindId, regionId, cultivarId: c.id })! })), base, `tea:${kindId}|${regionId || '-'}`, teaVaryCultivar)
    }
    for (const c of teaCultivars) {
      const cultivarId = c.id
      const options = teaRegionOptions({ kindId, regionId: '', cultivarId })
      if (options.length < 2) continue
      const base = teaSig({ kindId, regionId: '', cultivarId })
      if (base === null) continue
      teaVaryRegion.contexts++
      groupBy(options.map((o) => ({ key: o.id, sig: teaSig({ kindId, regionId: o.id, cultivarId })! })), base, `tea:${kindId}|${cultivarId}`, teaVaryRegion)
    }
  }
  teaVaryCultivar.distinctSignatures = new Set([...teaSigCache.values()]).size

  const originIds = ['', ...cacaoOrigins.map((o) => o.id)]
  const chocoSigCache = new Map<string, string>()
  const chocoKey = (sel: ChocoComboSel) => `${sel.kind}|${sel.originId}|${sel.lineage ? `${sel.lineage.layer}:${sel.lineage.id}` : '-'}`
  const chocoSig = (sel: ChocoComboSel): string | null => {
    const k = chocoKey(sel)
    if (!chocoSigCache.has(k)) {
      const a = chocoComboCached(sel)
      if (!a) return null
      chocoSigCache.set(k, tasteSigOf(a.notes, a.tastes, a.context))
    }
    return chocoSigCache.get(k)!
  }
  for (const kind of CHOCO_COMBO_KINDS) {
    for (const originId of originIds) {
      const options = chocoLineageOptions({ kind, originId, lineage: null })
      if (options.length < 2) continue
      const base = chocoSig({ kind, originId, lineage: null })
      if (base === null) continue
      chocoVaryLineage.contexts++
      groupBy(options.map((l) => ({ key: `${l.layer}:${l.id}`, sig: chocoSig({ kind, originId, lineage: { layer: l.layer, id: l.id } })! })), base, `choco:${kind}|${originId || '-'}`, chocoVaryLineage)
    }
    for (const l of allLineages()) {
      const lineage = { layer: l.layer, id: l.id }
      const options = chocoOriginOptions({ kind, originId: '', lineage })
      if (options.length < 2) continue
      const base = chocoSig({ kind, originId: '', lineage })
      if (base === null) continue
      chocoVaryOrigin.contexts++
      groupBy(options.map((o) => ({ key: o.id, sig: chocoSig({ kind, originId: o.id, lineage })! })), base, `choco:${kind}|${l.layer}:${l.id}`, chocoVaryOrigin)
    }
  }
  chocoVaryLineage.distinctSignatures = new Set([...chocoSigCache.values()]).size

  const teaItem = teaComboBaseItem('green')!
  const pairSigCache = new Map<string, string>()
  const pairSig = (teaSel: TeaComboSel, chocoSel: ChocoComboSel): string => {
    const k = `${teaSel.kindId}|${teaSel.regionId}|${teaSel.cultivarId}#${chocoKey(chocoSel)}`
    if (!pairSigCache.has(k)) {
      const w = assembleBlend(
        { type: 'tea', item: teaSel.kindId ? teaComboBaseItem(teaSel.kindId)! : teaItem, sel: teaSel },
        { type: 'chocolate', item: chocoRepresentativeItem(chocoSel.kind)!, sel: chocoSel }).wheel
      pairSigCache.set(k, tasteSigOf(w.notes, w.tastes, w.contexts))
    }
    return pairSigCache.get(k)!
  }
  for (const kind of CHOCO_COMBO_KINDS) {
    for (const originId of originIds) {
      const options = chocoLineageOptions({ kind, originId, lineage: null })
      if (options.length < 2) continue
      const teaSel: TeaComboSel = { kindId: 'green', regionId: '', cultivarId: '' }
      const base = pairSig(teaSel, { kind, originId, lineage: null })
      pairVaryChoco.contexts++
      groupBy(options.map((l) => ({ key: `${l.layer}:${l.id}`, sig: pairSig(teaSel, { kind, originId, lineage: { layer: l.layer, id: l.id } }) })), base, `pair:choco:${kind}|${originId || '-'}`, pairVaryChoco)
    }
  }
  for (const kindId of TEA_COMBO_KINDS) {
    for (const regionId of regionIds) {
      const options = teaCultivarOptions({ kindId, regionId, cultivarId: '' })
      if (options.length < 2) continue
      const chocoSel: ChocoComboSel = { kind: 'dark', originId: '', lineage: null }
      const base = pairSig({ kindId, regionId, cultivarId: '' }, chocoSel)
      pairVaryTea.contexts++
      groupBy(options.map((c) => ({ key: c.id, sig: pairSig({ kindId, regionId, cultivarId: c.id }, chocoSel) })), base, `pair:tea:${kindId}|${regionId || '-'}`, pairVaryTea)
    }
  }
  return { teaVaryCultivar, teaVaryRegion, chocoVaryLineage, chocoVaryOrigin, pairVaryChoco, pairVaryTea }
}

// ---- 残存同一グループの例外リスト（メンバー集合キー。第37弾時点） ----
const TEA_CULTIVAR_EXCEPTIONS = new Set([
  'av2,benifuuki,benihomare,hongyu,hongyun,jinxuan,p312,tri-2023,tri-2025,tri-2043',
  'av2,benifuuki,fenghuang-dancong-group,jinxuan,qingxin-damao,qingxin-oolong,sijichun,soufu,tieguanyin,tsuiyu',
  'av2,p312',
  'benifuuki,benihomare',
  'benifuuki,hokumei,kanayamidori,koushun,okumidori',
  'benifuuki,hokumei,koushun',
  'benifuuki,hokumei,koushun,qingxin-damao',
  'benifuuki,hokumei,koushun,samidori',
  'benifuuki,hokumei,koushun,samidori,tsuyuhikari',
  'benifuuki,soufu',
  'fenghuang-dancong-group,tieguanyin',
  'harumidori,meiryoku',
  'hongyu,hongyun,jinxuan',
  'jinxuan,qingxin-damao,qingxin-oolong,sijichun,tsuiyu',
  'kanayamidori,okumidori',
  'meiryoku,seimei',
  'samidori,tsuyuhikari',
  'sayamakaori,yutakamidori',
  'soufu,yabukita',
  'tri-2023,tri-2025,tri-2043',
].map((s) => norm(s.split(','))))

const TEA_REGION_EXCEPTIONS = new Set([
  'alishan,country:台湾,nantou,wenshan',
  'anhui,fujian,guangdong,guangxi,guizhou,henan,hubei,jiangsu,shaanxi,sichuan,yunnan,zhejiang',
  'assam,country:インド,darjeeling',
  'country:スリランカ,dimbula,nuwara-eliya,uva',
  'country:中国,shandong',
  'country:日本,kagoshima,kochi,miyazaki,murakami,nagasaki,saga,shizuoka,uji,yame',
  'country:日本,kochi',
  'kagoshima,miyazaki,murakami,nagasaki,saga,shizuoka,uji,yame',
  'kochi,murakami,nagasaki,shizuoka,uji',
  'kochi,murakami,nagasaki,shizuoka,uji,yame',
  'kochi,murakami,shizuoka',
  'nagasaki,uji',
].map((s) => norm(s.split(','))))

const CHOCO_LINEAGE_EXCEPTIONS = new Set([
  'clone:ccn-51,clone:ics-95,clone:imc-67,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nacional,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ccn-51,clone:ics-95,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nacional,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ccn-51,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'clone:ics-95,clone:imc-67,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nacional,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ics-95,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nacional,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ics-95,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ics-95,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'clone:ics-95,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'clone:ics-95,genetic:gen-maranon',
  'clone:imc-67,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:imc-67,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'clone:imc-67,genetic:gen-iquitos',
  'genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-amelonado,genetic:gen-guiana',
  'genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-criollo,genetic:gen-maranon,genetic:gen-nacional,traditional:trad-criollo,traditional:trad-trinitario',
  'genetic:gen-criollo,traditional:trad-criollo',
  'genetic:gen-criollo,traditional:trad-criollo,traditional:trad-trinitario',
  'genetic:gen-criollo,traditional:trad-trinitario',
  'genetic:gen-maranon,traditional:trad-trinitario',
].map((s) => norm(s.split(','))))

const CHOCO_ORIGIN_EXCEPTIONS = new Set([
  'cote-divoire,dominican-republic,ecuador,ghana,peru,tanzania,venezuela',
  'cote-divoire,dominican-republic,ecuador,ghana,tanzania,venezuela',
  'cote-divoire,dominican-republic,ecuador,madagascar,peru,tanzania,venezuela',
  'cote-divoire,dominican-republic,ecuador,tanzania,venezuela',
  'cote-divoire,dominican-republic,madagascar,tanzania,venezuela',
  'cote-divoire,ecuador,ghana,madagascar,peru,tanzania',
  'cote-divoire,ecuador,ghana,madagascar,peru,tanzania,venezuela',
  'cote-divoire,ecuador,ghana,peru,tanzania',
  'cote-divoire,ecuador,madagascar,peru,tanzania,venezuela',
  'cote-divoire,ghana,madagascar,tanzania',
  'cote-divoire,ghana,madagascar,tanzania,venezuela',
  'cote-divoire,ghana,tanzania',
  'cote-divoire,madagascar,tanzania',
  'cote-divoire,madagascar,tanzania,venezuela',
  'cote-divoire,tanzania',
  'cote-divoire,tanzania,venezuela',
  'ecuador,peru',
].map((s) => norm(s.split(','))))

const PAIR_CHOCO_EXCEPTIONS = new Set([
  'clone:ccn-51,clone:ics-95,clone:imc-67,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nacional,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ccn-51,clone:ics-95,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nacional,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ccn-51,clone:imc-67,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ccn-51,clone:imc-67,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'clone:ccn-51,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ccn-51,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'clone:ccn-51,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'clone:ics-95,clone:imc-67,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nacional,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ics-95,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nacional,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ics-95,genetic:gen-amelonado,genetic:gen-maranon,genetic:gen-nacional',
  'clone:ics-95,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'clone:ics-95,genetic:gen-maranon',
  'clone:ics-95,genetic:gen-maranon,genetic:gen-nacional',
  'clone:ics-95,genetic:gen-maranon,genetic:gen-nacional,traditional:trad-trinitario',
  'clone:imc-67,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:imc-67,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'clone:imc-67,genetic:gen-iquitos',
  'genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-amelonado,genetic:gen-guiana',
  'genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-iquitos',
  'genetic:gen-criollo,genetic:gen-curaray,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero',
  'genetic:gen-criollo,traditional:trad-criollo',
  'genetic:gen-criollo,traditional:trad-criollo,traditional:trad-trinitario',
  'genetic:gen-curaray,genetic:gen-guiana,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-iquitos,genetic:gen-nacional',
  'genetic:gen-maranon,genetic:gen-nacional',
  'genetic:gen-maranon,genetic:gen-nacional,traditional:trad-trinitario',
].map((s) => norm(s.split(','))))

const PAIR_TEA_EXCEPTIONS = new Set([
  'av2,benifuuki,benihomare,hongyu,hongyun,jinxuan,p312,tri-2023,tri-2025,tri-2043',
  'av2,benifuuki,fenghuang-dancong-group,jinxuan,qingxin-damao,sijichun,soufu,tieguanyin,tsuiyu',
  'av2,p312',
  'benifuuki,benihomare',
  'benifuuki,hokumei,kanayamidori,koushun,okumidori,samidori,sayamakaori,yutakamidori',
  'benifuuki,hokumei,koushun,samidori,tsuyuhikari',
  'benifuuki,kanayamidori,okumidori,samidori,tsuyuhikari',
  'benifuuki,qingxin-damao,samidori,sayamakaori,yutakamidori',
  'benifuuki,samidori,sayamakaori,yutakamidori',
  'benifuuki,samidori,tsuyuhikari',
  'benifuuki,soufu',
  'fenghuang-dancong-group,tieguanyin',
  'harumidori,meiryoku,seimei,soufu,yabukita',
  'harumidori,meiryoku,soufu,yabukita',
  'harumidori,soufu',
  'hokumei,koushun',
  'hongyu,hongyun,jinxuan',
  'jinxuan,qingxin-damao,sijichun,tsuiyu',
  'kanayamidori,okumidori',
  'meiryoku,seimei,yabukita',
  'meiryoku,yabukita',
  'sayamakaori,yutakamidori',
  'tri-2023,tri-2025,tri-2043',
].map((s) => norm(s.split(','))))

describe('味ホイールの同一性監査（第37弾）', () => {
  it('残る同一グループが例外リスト（理由カテゴリ T1〜T3 / C1〜C5）と一致し、集計が後退していない', async () => {
    const r = runAudit()
    const { writeFileSync } = await import('node:fs')
    writeFileSync('/tmp/taste-identity-audit.json', JSON.stringify(r, null, 1))
    const summary = {
      teaVaryCultivar: { contexts: r.teaVaryCultivar.contexts, groups: r.teaVaryCultivar.groups.length, baseEqualPairs: r.teaVaryCultivar.baseEqual.reduce((s, g) => s + g.members.length, 0), distinct: r.teaVaryCultivar.distinctSignatures },
      teaVaryRegion: { contexts: r.teaVaryRegion.contexts, groups: r.teaVaryRegion.groups.length, baseEqualPairs: r.teaVaryRegion.baseEqual.reduce((s, g) => s + g.members.length, 0) },
      chocoVaryLineage: { contexts: r.chocoVaryLineage.contexts, groups: r.chocoVaryLineage.groups.length, baseEqualPairs: r.chocoVaryLineage.baseEqual.reduce((s, g) => s + g.members.length, 0), distinct: r.chocoVaryLineage.distinctSignatures },
      chocoVaryOrigin: { contexts: r.chocoVaryOrigin.contexts, groups: r.chocoVaryOrigin.groups.length, baseEqualPairs: r.chocoVaryOrigin.baseEqual.reduce((s, g) => s + g.members.length, 0) },
      pairVaryChoco: { contexts: r.pairVaryChoco.contexts, groups: r.pairVaryChoco.groups.length, baseEqualPairs: r.pairVaryChoco.baseEqual.reduce((s, g) => s + g.members.length, 0) },
      pairVaryTea: { contexts: r.pairVaryTea.contexts, groups: r.pairVaryTea.groups.length, baseEqualPairs: r.pairVaryTea.baseEqual.reduce((s, g) => s + g.members.length, 0) },
    }
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(summary))
    // 例外リストに無い同一グループが1件でも生まれたら、その全件を一度に示す
    const missing: string[] = []
    const check = (out: AuditOut, exceptions: Set<string>, label: string) => {
      for (const g of out.groups) {
        if (!exceptions.has(norm(g.members))) missing.push(`${label} ${g.context}: ${norm(g.members)}`)
      }
    }
    check(r.teaVaryCultivar, TEA_CULTIVAR_EXCEPTIONS, 'tea-cultivar')
    check(r.teaVaryRegion, TEA_REGION_EXCEPTIONS, 'tea-region')
    check(r.chocoVaryLineage, CHOCO_LINEAGE_EXCEPTIONS, 'choco-lineage')
    check(r.chocoVaryOrigin, CHOCO_ORIGIN_EXCEPTIONS, 'choco-origin')
    check(r.pairVaryChoco, PAIR_CHOCO_EXCEPTIONS, 'pair-choco')
    check(r.pairVaryTea, PAIR_TEA_EXCEPTIONS, 'pair-tea')
    expect(missing).toEqual([])
    // 集計の後退防止（第37弾の到達点。改善で下回るのはよい）
    expect(summary.teaVaryCultivar.baseEqualPairs).toBeLessThanOrEqual(180)
    expect(summary.teaVaryRegion.baseEqualPairs).toBeLessThanOrEqual(193)
    expect(summary.chocoVaryLineage.baseEqualPairs).toBeLessThanOrEqual(397)
    expect(summary.chocoVaryOrigin.baseEqualPairs).toBeLessThanOrEqual(326)
    expect(summary.pairVaryChoco.baseEqualPairs).toBeLessThanOrEqual(399)
    expect(summary.pairVaryTea.baseEqualPairs).toBeLessThanOrEqual(182)
    expect(summary.teaVaryCultivar.distinct).toBeGreaterThanOrEqual(82)
    expect(summary.chocoVaryLineage.distinct).toBeGreaterThanOrEqual(104)
  }, 1200000)

  it('再現ケース：ルビー × ドミニカ共和国 × マラニョンは、土台とも他の系統・産地とも味表示が異なる', () => {
    const sig = (sel: ChocoComboSel) => {
      const a = analyzeChocoCombo(sel)
      return tasteSigOf(a.notes, a.tastes, a.context)
    }
    const target = sig({ kind: 'ruby', originId: 'dominican-republic', lineage: { layer: 'genetic', id: 'gen-maranon' } })
    expect(target).not.toBe(sig({ kind: 'ruby', originId: '', lineage: null }))
    expect(target).not.toBe(sig({ kind: 'ruby', originId: 'dominican-republic', lineage: { layer: 'traditional', id: 'trad-forastero' } }))
    expect(target).not.toBe(sig({ kind: 'ruby', originId: 'cote-divoire', lineage: { layer: 'genetic', id: 'gen-maranon' } }))
    expect(target).not.toBe(sig({ kind: 'ruby', originId: 'dominican-republic', lineage: { layer: 'genetic', id: 'gen-nacional' } }))
    // 中身: ドミニカのドライフルーツ（甘味の具体名）と柑橘（酸味の具体名）、
    // マラニョンの果実（甘味）と酸味の穏やかさ（推測）が第2階層・％に現れる
    const a = analyzeChocoCombo({ kind: 'ruby', originId: 'dominican-republic', lineage: { layer: 'genetic', id: 'gen-maranon' } })
    const tiers = buildTasteNoteTiers(a.notes, a.tastes, a.context)
    const sweet = tiers.find((g) => g.key === 'sweet')!
    expect(sweet.entries.map((e) => e.label)).toContain('ドライフルーツ')
    expect(sweet.entries.map((e) => e.label)).toContain('果実全般')
    const sour = tiers.find((g) => g.key === 'sour')!
    expect(sour.entries.map((e) => e.label)).toContain('柑橘')
    expect(sour.taste.intensity).toBe('weak')
    expect(sour.taste.level).toBe('inferred')
  })

  it('第37弾の新規・拡張ルールが味表示に現れる', () => {
    // エクアドル産地の読み替え: ルビーの酸味が推測で一段穏やかになる
    const ec = analyzeChocoCombo({ kind: 'ruby', originId: 'ecuador', lineage: null })
    const ecSour = ec.tastes.find((t) => t.key === 'sour')!
    expect(ecSour.intensity).toBe('weak')
    expect(ecSour.level).toBe('inferred')
    // ペルー産地の酸味: 同じくルビーで穏やかになる
    const pe = analyzeChocoCombo({ kind: 'ruby', originId: 'peru', lineage: { layer: 'traditional', id: 'trad-forastero' } })
    const peSour = pe.tastes.find((t) => t.key === 'sour')!
    expect(peSour.intensity).toBe('weak')
    expect(peSour.level).toBe('inferred')
    // ICS-95: ルビーの酸味が推測で一段強くなる
    const ics = analyzeChocoCombo({ kind: 'ruby', originId: '', lineage: { layer: 'clone', id: 'ics-95' } })
    expect(ics.tastes.find((t) => t.key === 'sour')!.intensity).toBe('strong')
    // 遺伝クリオロ・トリニタリオ: ダークの苦味が推測で一段穏やかになる
    for (const lineage of [{ layer: 'genetic', id: 'gen-criollo' }, { layer: 'traditional', id: 'trad-trinitario' }] as const) {
      const a = analyzeChocoCombo({ kind: 'dark', originId: '', lineage })
      const bitter = a.tastes.find((t) => t.key === 'bitter')!
      expect(bitter.intensity, lineage.id).toBe('normal')
      expect(bitter.level, lineage.id).toBe('inferred')
    }
    // マラニョン: ダークの苦味・渋味ゲージが推測で一段穏やかになる
    const ma = analyzeChocoCombo({ kind: 'dark', originId: '', lineage: { layer: 'genetic', id: 'gen-maranon' } })
    expect(ma.tastes.find((t) => t.key === 'bitter')!.intensity).toBe('normal')
    expect(ma.tastes.find((t) => t.key === 'astringent')!.intensity).toBe('normal')
    // イキトス: ダークの酸味の具体名に柑橘が推測で現れる
    const iq = analyzeChocoCombo({ kind: 'dark', originId: '', lineage: { layer: 'genetic', id: 'gen-iquitos' } })
    const iqTiers = buildTasteNoteTiers(iq.notes, iq.tastes, iq.context)
    expect(iqTiers.find((g) => g.key === 'sour')!.entries.map((e) => e.label)).toContain('柑橘')
    // マダガスカル: ルビーでは麦芽が推測で新たに現れ、甘味の具体名になる。
    // ミルクの土台には麦芽が既にあるため、そこでは根拠（basis）の追加として現れる
    const mg = analyzeChocoCombo({ kind: 'ruby', originId: 'madagascar', lineage: null })
    expect(mg.notes.find((n) => n.noteId === 'malt')?.level).toBe('inferred')
    const mgTiers = buildTasteNoteTiers(mg.notes, mg.tastes, mg.context)
    expect(mgTiers.find((g) => g.key === 'sweet')!.entries.map((e) => e.label)).toContain('麦芽')
    const mgMilk = analyzeChocoCombo({ kind: 'milk', originId: 'madagascar', lineage: null })
    const mgMilkMalt = mgMilk.notes.find((n) => n.noteId === 'malt')!
    expect(mgMilkMalt.basis.some((b) => b.sourceIds.includes('godocikova-2020-madagascar-volatiles'))).toBe(true)
    // さやまかおり: 緑茶の渋味ゲージが推測で一段強くなる
    const sy = analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: 'sayamakaori' })
    const syAstr = sy.tastes.find((t) => t.key === 'astringent')!
    expect(syAstr.intensity).toBe('strong')
    expect(syAstr.level).toBe('inferred')
  })
})
