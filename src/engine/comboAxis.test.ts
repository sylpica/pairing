import { describe, it, expect } from 'vitest'
import { analyzeTeaCombo, analyzeChocoCombo, type TeaComboSel, type ChocoComboSel } from './combo'

// 実機フィードバック第3弾（2026-10-31）の回帰テスト。
// 不具合：「調べる」画面で緑茶の産地・品種を変えてもホイールが全く変わらない。
// 原因は、組み合わせエンジンが地域・品種・産地・系統の所見（findings）を
// 文章グループに載せるだけで、ノートへ写像する経路が無かったこと。
// 修正後は、所見のうち香味の寄与・官能を示すものが axisEffects の変換を通して
// 根拠区分つきでノート・味覚に反映され、反映されない軸は理由が要約に出る。

const noteSig = (a: ReturnType<typeof analyzeTeaCombo>) =>
  a.notes.map((n) => `${n.noteId}:${n.intensity}:${n.level}`).sort()

describe('症状の再現ケース：緑茶の産地・品種を変えるとホイールが変わる', () => {
  const base = analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: '' })
  const murakamiKoushun = analyzeTeaCombo({ kindId: 'green', regionId: 'murakami', cultivarId: 'koushun' })

  it('緑茶のみと 村上×香駿×緑茶 で、ノートの顔ぶれ・強さ・根拠が実際に異なる', () => {
    expect(noteSig(murakamiKoushun)).not.toEqual(noteSig(base))
  })
  it('香駿では花様が一段強まり、根拠は品種の所見由来の推測として示される', () => {
    const floral = murakamiKoushun.notes.find((n) => n.noteId === 'floral-general')
    expect(floral?.intensity).toBe('strong') // 土台（蒸し緑茶）は normal
    expect(floral?.level).toBe('inferred') // 香気発揚処理下の知見の読み替えなので推測
    expect(floral?.basis.some((b) => b.from === 'cultivar' && b.sourceIds.includes('shiratori-2022-kaori-ryokucha'))).toBe(true)
    const baseFloral = base.notes.find((n) => n.noteId === 'floral-general')
    expect(baseFloral?.intensity).toBe('normal')
  })
  it('軸ごとの反映要約：品種は反映あり、村上は「反映していません」と理由が出る', () => {
    const cultivar = murakamiKoushun.axisSummaries.find((s) => s.axis === 'cultivar')
    expect(cultivar?.reflected).toBe(true)
    const region = murakamiKoushun.axisSummaries.find((s) => s.axis === 'region')
    expect(region?.reflected).toBe(false)
    expect(region?.text).toContain('反映していません')
    // 村上の所見（官能で産地が分かれる・成分構成の差）は、特定ノートへの寄与を示さない
    expect(region?.text).toContain('寄与を示すものではない')
  })
})

describe('地域の所見が寄与を示す場合は、実測としてノートに反映される', () => {
  it('四川 × 紅茶：再構成・欠落試験で示された花果香（バラ・柑橘）が実測で出る', () => {
    const a = analyzeTeaCombo({ kindId: 'black', regionId: 'sichuan', cultivarId: '' })
    for (const id of ['rose', 'citrus']) {
      const n = a.notes.find((x) => x.noteId === id)
      expect(n?.level, id).toBe('measured')
      expect(n?.basis[0].from).toBe('region')
      expect(n?.basis[0].sourceIds).toContain('wang-2025-sichuan-gongfu-black-tea')
    }
    const floral = a.notes.find((x) => x.noteId === 'floral-general')
    expect(floral?.level).toBe('measured') // 土台は general → 実測の裏付けで格上げ
    const region = a.axisSummaries.find((s) => s.axis === 'region')
    expect(region?.reflected).toBe(true)
  })
  it('河南 × 緑茶：主体香とされた果実香が実測で出る', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'henan', cultivarId: '' })
    const fruit = a.notes.find((x) => x.noteId === 'fruit-general')
    expect(fruit?.level).toBe('measured')
    expect(fruit?.intensity).toBe('normal') // 「主体香」の明示があるため weak ではない
    expect(fruit?.basis[0].sourceIds).toContain('yin-2024-xinyang-maojian-qingxiang')
  })
  it('山東 × 緑茶：OAV が突出したジメチルスルフィドの香り（青い野菜）が実測で出る', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'shandong', cultivarId: '' })
    const n = a.notes.find((x) => x.noteId === 'green-vegetable')
    expect(n?.level).toBe('measured')
    expect(n?.basis[0].sourceIds).toContain('zhu-2021-laoshan-green-tea-odorants')
  })
  it('文山 × 烏龍茶：AEDA で最高寄与の成分が裏付ける花様が実測になる', () => {
    const a = analyzeTeaCombo({ kindId: 'oolong', regionId: 'wenshan', cultivarId: '' })
    const floral = a.notes.find((x) => x.noteId === 'floral-general')
    expect(floral?.basis.some((b) => b.from === 'region' && b.sourceIds.includes('mizukami-2017-taiwan-tea-aeda'))).toBe(true)
  })
})

describe('反映されないのが正しいケースは、変わらない代わりに理由が出る', () => {
  it('浙江 × 緑茶：龍井茶のキー成分の実測（第7弾で追加）により、蘭が実測で加わりノートが変わる', () => {
    // 第7弾の追加文献調査で、龍井茶のキー成分（再構成まで含む特定）と西湖龍井試料の
    // OAV 評価が所見として登録されたため、旧仕様（判別のみ・同一・理由が出る）は変更された。
    const base = analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: '' })
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'zhejiang', cultivarId: '' })
    expect(noteSig(a)).not.toEqual(noteSig(base))
    const region = a.axisSummaries.find((s) => s.axis === 'region')
    expect(region?.reflected).toBe(true)
    const orchid = a.notes.find((n) => n.noteId === 'orchid')
    expect(orchid?.level).toBe('measured')
    expect(orchid?.basis.some((b) => b.sourceIds.includes('hu-2022-tea-aroma-oav-splitting'))).toBe(true)
    expect(a.statements.some((s) => s.level === 'measured')).toBe(true)
  })
  it('国レベルの指定（中国 × 緑茶）では、地域の所見を束ねた集約推測が反映される（第7弾・課題A5）', () => {
    // 第7弾で仕様変更: 旧仕様は「国レベルの香味データが無いため反映しない」だったが、
    // 国の地域の軸ルールを束ね、全て推測（inferred）に落とした集約推測を適用する。
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'country:中国', cultivarId: '' })
    const region = a.axisSummaries.find((s) => s.axis === 'region')
    expect(region?.reflected).toBe(true)
    expect(a.statements.some((s) => s.text.includes('集約推測'))).toBe(true)
    const aggNotes = a.notes.filter((n) => n.basis.some((b) => b.text.includes('集約推測')))
    expect(aggNotes.length).toBeGreaterThan(0)
  })
  it('青心烏龍 × 烏龍茶：GC-O・再構成で検証された花様成分の方向が、推測として反映される（第5弾で方針変更）', () => {
    // 第3弾では「組成のみ」として反映しない扱いだったが、原所見（Lan 2022）は
    // GC-O と再構成・除去実験で主要香気活性成分を検証し、未〜中焙煎では花様成分が
    // 主体という方向を示している。第5弾の足がかり (a) により、実測ではなく
    // 推測（inferred）として反映する（検出のみの所見を実測扱いにする変更ではない）。
    const a = analyzeTeaCombo({ kindId: 'oolong', regionId: '', cultivarId: 'qingxin-oolong' })
    const cultivar = a.axisSummaries.find((s) => s.axis === 'cultivar')
    expect(cultivar?.reflected).toBe(true)
    const citrus = a.notes.find((n) => n.noteId === 'citrus')
    expect(citrus?.level).toBe('inferred')
    expect(citrus?.basis[0].sourceIds).toContain('lan-2022-qingxin-roasting')
    const honey = a.notes.find((n) => n.noteId === 'honey')
    expect(honey?.basis.some((b) => b.from === 'cultivar' && b.sourceIds.includes('lan-2022-qingxin-roasting'))).toBe(true)
    const floral = a.notes.find((n) => n.noteId === 'floral-general')
    expect(floral?.basis.some((b) => b.from === 'cultivar' && b.sourceIds.includes('lan-2022-qingxin-roasting'))).toBe(true)
    expect(floral?.level).not.toBe('measured') // 実測への格上げはしない
  })
})

describe('品種の所見の反映（お茶）', () => {
  it('そうふう × 緑茶：アントラニル酸メチルの寄与から果実全般が実測で出る', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: 'soufu' })
    const fruit = a.notes.find((x) => x.noteId === 'fruit-general')
    expect(fruit?.level).toBe('measured')
    expect(fruit?.intensity).toBe('weak') // 寄与は示されても強さの格付けは無い
    expect(fruit?.basis[0].from).toBe('cultivar')
    expect(fruit?.basis[0].sourceIds).toContain('sawai-2004-sofu-methyl-anthranilate')
  })
  it('やぶきた × 緑茶：AEDA の寄与成分（β-ダマセノン）から蜂蜜が実測で出る', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: 'yabukita' })
    const honey = a.notes.find((x) => x.noteId === 'honey')
    expect(honey?.level).toBe('measured')
    expect(honey?.basis[0].sourceIds).toContain('mizukami-2012-sofu-yabukita-aeda')
    const cultivar = a.axisSummaries.find((s) => s.axis === 'cultivar')
    expect(cultivar?.reflected).toBe(true)
  })
  it('かなやみどり × 緑茶：官能記述子（花のような・フルーティー）が実測で反映される', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: 'kanayamidori' })
    expect(a.notes.find((x) => x.noteId === 'fruit-general')?.level).toBe('measured')
    const floral = a.notes.find((x) => x.noteId === 'floral-general')
    expect(floral?.basis.some((b) => b.from === 'cultivar')).toBe(true)
  })
})

describe('チョコ側：産地・系統を変えるとホイールが変わる', () => {
  const darkOnly = analyzeChocoCombo({ kind: 'dark', originId: '', lineage: null })

  it('ダーク × ICS-95：農園試料の官能（花様・新鮮な果実）が実測で出る', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: '', lineage: { layer: 'clone', id: 'ics-95' } })
    for (const id of ['floral-general', 'fruit-general']) {
      const n = a.notes.find((x) => x.noteId === id)
      expect(n?.level, id).toBe('measured')
      expect(n?.basis[0].from).toBe('lineage')
      expect(n?.basis[0].sourceIds).toContain('ramon-2023-colombia-cacao-clones')
    }
    const lineage = a.axisSummaries.find((s) => s.axis === 'lineage')
    expect(lineage?.reflected).toBe(true)
  })
  it('ダーク × クリオロ（伝統的分類）：ベネズエラ産リカーの官能ホイールの記述子が出る', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: '', lineage: { layer: 'traditional', id: 'trad-criollo' } })
    for (const id of ['almond', 'wood', 'brown-sugar', 'malt', 'cinnamon', 'nut-general', 'white-flower']) {
      const n = a.notes.find((x) => x.noteId === id)
      expect(n?.level, id).toBe('general') // 統合ホイールに基づく一般的な知見
      expect(n?.basis[0].sourceIds).toContain('ramos-2013-venezuela-criollo-liquor')
    }
    expect(noteSig(a)).not.toEqual(noteSig(darkOnly))
  })
  it('ダーク × ナシオナル：苦味・渋味が一般的な知見として穏やかな方向に変わる', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: '', lineage: { layer: 'genetic', id: 'gen-nacional' } })
    for (const key of ['bitter', 'astringent'] as const) {
      const t = a.tastes.find((x) => x.key === key)
      const baseT = darkOnly.tastes.find((x) => x.key === key)
      expect(t?.intensity, key).not.toBe(baseT?.intensity) // 土台は strong → normal
      expect(t?.level, key).toBe('general')
      expect(t?.sourceIds).toContain('boza-2014-ccn51')
    }
    // 既存の製法ルール（花様の推測追加）は従来どおり
    expect(a.notes.find((x) => x.noteId === 'floral-general')?.level).toBe('inferred')
  })
  it('ダーク × マダガスカル（産地のみ）：組成実測の成分からの推論で麦芽が推測として出る（第5弾で方針変更）', () => {
    // 第4弾までは「単一製品の組成実測」として反映しない扱いだった。第5弾の
    // 足がかり (b)（確認された化合物→既知の香り）により、ストレッカー
    // アルデヒド類が最高水準だった実測と代表成分 3-メチルブタナールの
    // 既知の香りから、推測（inferred）として麦芽を反映する。
    const a = analyzeChocoCombo({ kind: 'dark', originId: 'madagascar', lineage: null })
    expect(noteSig(a)).not.toEqual(noteSig(darkOnly))
    const malt = a.notes.find((n) => n.noteId === 'malt')
    expect(malt?.level).toBe('inferred')
    expect(malt?.intensity).toBe('weak')
    expect(malt?.basis[0].sourceIds).toContain('godocikova-2020-madagascar-volatiles')
    const origin = a.axisSummaries.find((s) => s.axis === 'origin')
    expect(origin?.reflected).toBe(true)
    // 対象はダークのみ：ミルクでは従来どおり変わらず、理由が出る
    const milkOnly = analyzeChocoCombo({ kind: 'milk', originId: '', lineage: null })
    const milk = analyzeChocoCombo({ kind: 'milk', originId: 'madagascar', lineage: null })
    expect(noteSig(milk)).toEqual(noteSig(milkOnly))
    const milkOrigin = milk.axisSummaries.find((s) => s.axis === 'origin')
    expect(milkOrigin?.reflected).toBe(false)
    expect(milkOrigin?.text).toContain('反映していません')
  })
  it('ダーク × タンザニア：香味所見が無い産地は、その旨が理由として出る', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: 'tanzania', lineage: null })
    const origin = a.axisSummaries.find((s) => s.axis === 'origin')
    expect(origin?.reflected).toBe(false)
    expect(origin?.text).toContain('確認できていない')
  })
})

describe('既存の代表例の回帰（長崎 × やぶきた × 紅茶の弱方向シフトは不変）', () => {
  it('渋味・苦味は推測のまま一段穏やかで、軸要約では品種が反映ありになる', () => {
    const a = analyzeTeaCombo({ kindId: 'black', regionId: 'nagasaki', cultivarId: 'yabukita' } satisfies TeaComboSel)
    expect(a.tastes.find((t) => t.key === 'astringent')?.intensity).toBe('weak')
    expect(a.tastes.find((t) => t.key === 'astringent')?.level).toBe('inferred')
    // 紅茶では軸ルール（緑茶の AEDA）は当たらないが、製法ルールが品種軸に反映される
    const cultivar = a.axisSummaries.find((s) => s.axis === 'cultivar')
    expect(cultivar?.reflected).toBe(true)
    const region = a.axisSummaries.find((s) => s.axis === 'region')
    expect(region?.reflected).toBe(false) // 長崎の所見は緑茶のもので、紅茶のノートには反映しない
  })
  it('チョコの選択空間アンカーは不変（成立条件に触れない）。エクアドル産地は第7弾で読み替え推測が反映される', () => {
    const sel: ChocoComboSel = { kind: 'dark', originId: 'ecuador', lineage: { layer: 'genetic', id: 'gen-nacional' } }
    const a = analyzeChocoCombo(sel)
    expect(a.axisSummaries.find((s) => s.axis === 'lineage')?.reflected).toBe(true)
    // 第7弾: 現代 Nacional 集団の花ノート経路の知見を産地へ読み替えた推測ルールを追加したため、
    // 旧仕様（産地は反映されない）から変更された。
    expect(a.axisSummaries.find((s) => s.axis === 'origin')?.reflected).toBe(true)
  })
})
