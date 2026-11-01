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
//  C1 野生遺伝集団の香味実測なし: Curaray / Nanay / Purús と
//     総称フォラステロ（実測は原理的に存在しない）、Guiana のダーク
//     （カカオの裏付けのみで土台と同値）。Marañon は第37弾で参考情報
//     （白豆の記述）に基づく推測効果を持ち、主にホワイト等の対象外の
//     種類でのみ残る
//  C2 足がかりが同一・同方向: クリオロ対応の3者（伝統／遺伝／トリニタリオ
//     は穏やかさの方向が同じ）、Marañon と Nacional（穏やかな酸味＋果実）、
//     Marañon とトリニタリオ（ベネズエラ文脈）。産地側の追加が系統差を
//     吸収するケースも含む（ガーナの果実追加で ICS-95 と Contamana が
//     一致、ドミニカの柑橘追加で Contamana と Iquitos が一致）
//  C3 種類の構造: ホワイトはカカオマスを使わず系統差が原理的に出ない。
//     ブロンドはホワイト系で系統ルールの適用が限られる。ルビーは土台
//     プロファイルが薄く系統効果の多くが既存ノートへの裏付けに留まる
//  C4 対応関係そのもの: 遺伝集団クリオロの唯一の足がかりは伝統的分類との
//     対応であり、ミルク／ルビーでは伝統側の味覚効果も土台に現れない。
//     Iquitos と IMC-67 も、集団とその構成クローンで足がかりが同一
//  （第37弾で味ホイール側の監査は tasteIdentityAudit.test.ts に分離・拡張）

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
  // 第43弾で追加: 四季春は「強い果実様」の方向（品種解説・参考情報）を
  // 果実全般の一段強調として反映し、土台（未指定）と完全一致する状態を
  // 脱した。その結果、烏龍茶では そうふう（葉成分の実測からの読み替えで
  // 果実全般が一段強い）と表示が一致する。足がかりの方向が同一である
  // ことによる一致（C2 相当）としてここに記録する。
  'sijichun,soufu',
  // 第43弾差別化ラウンドで追加: TRI 2025 と TRI 2043 は、それぞれ独立した
  // 組成研究（Kumar & Rajapaksha 2005 の分離収量／Kottawa-Arachchi et al.
  // 2013 の低カテキン分類）から「カテキン少なめ→苦味・渋味が穏やか」と
  // いう同方向の推測に帰着し、紅茶では表示が一致する（C2 相当）。
  'tri-2025,tri-2043',
].map((s) => norm(s.split(','))))

const TEA_WHEEL_EXCEPTIONS = new Set([
  'okumidori,tsuyuhikari,benifuuki,samidori',
  'okumidori,yutakamidori,benifuuki,samidori',
  'p312,tri-2023,tri-2025,tri-2043',
  'sijichun,tieguanyin',
  // 第43弾で追加: 四季春×そうふう（TEA_COMBO_EXCEPTIONS の第43弾注記と
  // 同じ C2 相当の一致が、ペアリングホイール側にも現れる）。
  'sijichun,soufu',
  // 第43弾差別化ラウンドで追加: 緑茶で べにふうき（育成機関の特徴づけ
  // 「渋味が強い」からの推測）と ゆたかみどり（既存の強い方向の推測）が
  // 同方向に帰着し、ペアリングホイールで一致する（C2 相当）。
  'benifuuki,yutakamidori',
  // 第43弾差別化ラウンドで追加: さみどり（渋味・苦味が穏やか、参考情報
  // 群の一致）と つゆひかり（渋味・苦味が穏やか、タンニン含量の方向）が
  // 同方向の推測に帰着し、ペアリングホイールで一致する（C2 相当）。
  'samidori,tsuyuhikari',
  // 第43弾差別化ラウンドで追加: 青心大冇の緑茶での花様の強調（茶業文献
  // の方向からの推測）は、ペアリング合成では さやまかおり（渋味の強い
  // 推測を持つ）のホイールと％配分が一致する文脈がある（T3 相当：
  // ペアリング側の段階化による吸収。単体コンボでは区別される）。
  'qingxin-damao,sayamakaori',
  // 第43弾差別化ラウンドで追加: 鉄観音のバラ追加（ゲラニオール候補から
  // の推測）は、ペアリング合成では べにふうき の烏龍茶ホイールと％配分
  // が一致する文脈がある（T3 相当。単体コンボでは区別される）。
  'benifuuki,tieguanyin',
  // 第43弾差別化ラウンドで追加: おくみどり・さみどり・つゆひかり は
  // いずれも渋味（さみどり・つゆひかりは苦味も）を穏やかにする同方向の
  // 推測を持ち、鹿児島・国集約の文脈ではペアリングホイールが一致する
  // （C2/T2 相当）。
  'okumidori,samidori,tsuyuhikari',
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
  // 第45弾で追加: 緑茶×狭山では、地域効果（苦味・渋味を一段強くする
  // 推測）が穏やか方向の品種（つゆひかり・さみどり）を土台水準まで
  // 持ち上げ、強い方向の品種（ゆたかみどり・べにふうき）との残る差も
  // ペアリングホイールの段階化で吸収される（T3/C5 相当）。単体コンボ
  // では4品種とも区別される（実測で確認済み）。
  'yutakamidori,tsuyuhikari,benifuuki,samidori',
].map((s) => norm(s.split(','))))

const CHOCO_COMBO_EXCEPTIONS = new Set([
  'clone:ccn-51,clone:ics-95,clone:imc-67,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ccn-51,clone:ics-95,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ccn-51,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'clone:ics-95,clone:imc-67,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ics-95,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ics-95,genetic:gen-contamana',
  'clone:imc-67,genetic:gen-iquitos',
  'genetic:gen-amelonado,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'genetic:gen-amelonado,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-amelonado,genetic:gen-guiana',
  'genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-iquitos',
  'genetic:gen-criollo,traditional:trad-criollo',
  'genetic:gen-criollo,traditional:trad-criollo,traditional:trad-trinitario',
  'genetic:gen-criollo,traditional:trad-trinitario',
  'genetic:gen-curaray,genetic:gen-guiana,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-curaray,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-maranon,traditional:trad-trinitario',
  // 第43弾差別化ラウンド（カカオ）で追加。理由は以下の通り:
  // ・Nanay は Iquitos からの遺伝的近接合成（(e)）のため、近接先とその
  //   構成クローン IMC-67 とは、合成の帰結として表示が一致する（C4 相当）。
  // ・Purús の花様の弱い追加は、土台・他軸に花様がある文脈では署名に
  //   現れず、野生集団群（Contamana / Curaray 等）と一致する（C1/C2 相当）。
  // ・フォラステロ（Forastero）は中核集団 Amelonado からの読み替え（(d)）
  //   のため、文脈により Amelonado やギアナ等と果実の方向が一致する
  //   （C2 相当）。
  'clone:ccn-51,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-purus',
  'clone:ics-95,genetic:gen-contamana,genetic:gen-purus',
  'clone:ics-95,traditional:trad-forastero',
  'clone:imc-67,genetic:gen-iquitos,genetic:gen-nanay',
  'genetic:gen-amelonado,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-maranon,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'genetic:gen-amelonado,genetic:gen-criollo,genetic:gen-curaray,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'genetic:gen-amelonado,genetic:gen-criollo,genetic:gen-curaray,traditional:trad-criollo,traditional:trad-trinitario',
  'genetic:gen-amelonado,genetic:gen-curaray,genetic:gen-guiana,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-maranon,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-purus',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus',
  'genetic:gen-contamana,genetic:gen-purus',
  'genetic:gen-curaray,genetic:gen-guiana',
  'genetic:gen-curaray,genetic:gen-guiana,traditional:trad-forastero',
  'genetic:gen-curaray,genetic:gen-maranon,traditional:trad-forastero',
  'genetic:gen-curaray,traditional:trad-forastero',
  'genetic:gen-iquitos,genetic:gen-nanay',
  'genetic:gen-maranon,traditional:trad-forastero',
].map((s) => norm(s.split(','))))

const CHOCO_WHEEL_EXCEPTIONS = new Set([
  'clone:ccn-51,clone:ics-95,clone:imc-67,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nacional,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ccn-51,clone:ics-95,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nacional,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ccn-51,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ccn-51,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'clone:ccn-51,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'clone:ics-95,clone:imc-67,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nacional,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ics-95,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-maranon,genetic:gen-nacional,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ics-95,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ics-95,genetic:gen-amelonado,genetic:gen-maranon',
  'clone:ics-95,genetic:gen-amelonado,genetic:gen-maranon,genetic:gen-nacional',
  'clone:ics-95,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-maranon,genetic:gen-nanay,genetic:gen-purus,traditional:trad-forastero',
  'clone:ics-95,genetic:gen-maranon',
  'clone:ics-95,genetic:gen-maranon,genetic:gen-nacional',
  'clone:ics-95,genetic:gen-nacional',
  'clone:imc-67,genetic:gen-iquitos',
  'genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
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
  'genetic:gen-maranon,genetic:gen-nacional',
  'genetic:gen-maranon,traditional:trad-trinitario',
  // 第43弾差別化ラウンド（カカオ）で追加。理由は CHOCO_COMBO 側の注記と
  // 同じ（Nanay の近接合成＝C4 相当、Purús の花様追加の埋没＝C1/C2 相当、
  // フォラステロの読み替え＝C2 相当）。ペアリングホイールでは段階化で
  // さらに潰れる（T3 相当の側面を含む）。
  'clone:ccn-51,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-purus,traditional:trad-criollo,traditional:trad-trinitario',
  'clone:ccn-51,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-purus',
  'clone:ccn-51,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-purus',
  'clone:ics-95,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-maranon,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'clone:ics-95,genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-maranon,genetic:gen-purus,traditional:trad-forastero',
  'clone:ics-95,genetic:gen-amelonado,genetic:gen-maranon,genetic:gen-nacional,traditional:trad-forastero',
  'clone:ics-95,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-maranon,genetic:gen-purus,traditional:trad-forastero',
  'clone:ics-95,genetic:gen-contamana,genetic:gen-nacional,genetic:gen-purus',
  'clone:ics-95,genetic:gen-maranon,genetic:gen-nacional,traditional:trad-forastero',
  'clone:ics-95,genetic:gen-maranon,traditional:trad-forastero',
  'clone:ics-95,traditional:trad-forastero',
  'clone:imc-67,genetic:gen-iquitos,genetic:gen-nanay',
  'genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus,traditional:trad-criollo,traditional:trad-trinitario',
  'genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-purus,traditional:trad-criollo,traditional:trad-trinitario',
  'genetic:gen-amelonado,genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-amelonado,genetic:gen-curaray,genetic:gen-guiana,traditional:trad-forastero',
  'genetic:gen-amelonado,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-criollo,genetic:gen-curaray,genetic:gen-purus,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-guiana,genetic:gen-purus',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-maranon,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-purus',
  'genetic:gen-contamana,genetic:gen-curaray,genetic:gen-purus,traditional:trad-forastero',
  'genetic:gen-contamana,genetic:gen-iquitos,genetic:gen-nanay,genetic:gen-purus',
  'genetic:gen-contamana,genetic:gen-purus',
  'genetic:gen-criollo,genetic:gen-curaray,genetic:gen-maranon,traditional:trad-criollo,traditional:trad-forastero,traditional:trad-trinitario',
  'genetic:gen-criollo,genetic:gen-maranon,traditional:trad-criollo,traditional:trad-trinitario',
  'genetic:gen-curaray,genetic:gen-guiana',
  'genetic:gen-iquitos,genetic:gen-nanay',
  'genetic:gen-maranon,genetic:gen-nacional,traditional:trad-forastero',
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
