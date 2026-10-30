import { describe, it, expect } from 'vitest'
import { sources } from './sources'
import { compounds } from './compounds'
import { teaKinds } from './teas'
import { teaCultivars, cultivarTeaUses, teaCultivarById, usesForCultivar } from './cultivars'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones } from './cacao'
import { FLAVOR_FINDING_KINDS } from '../types'

const sourceIds = new Set(sources.map((s) => s.id))
const compoundIds = new Set(compounds.map((c) => c.id))
const kindIds = new Set(teaKinds.map((k) => k.id))
const cultivarIds = new Set(teaCultivars.map((c) => c.id))
const geneticIds = new Set(cacaoGeneticGroups.map((g) => g.id))
const allEntities = [...teaCultivars, ...cacaoTraditionalGroups, ...cacaoGeneticGroups, ...cacaoClones]

describe('品種・系統データベースの整合性', () => {
  it('全エンティティのIDが一意で、階層をまたいで重複しない', () => {
    const ids = allEntities.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    // 伝統的 Criollo と遺伝集団 Criollo は別エンティティ
    expect(cacaoTraditionalGroups.some((g) => g.id === 'trad-criollo')).toBe(true)
    expect(cacaoGeneticGroups.some((g) => g.id === 'gen-criollo')).toBe(true)
  })

  it('やぶきた と おくみどり を別品種として扱える', () => {
    const yabukita = teaCultivarById('yabukita')
    const okumidori = teaCultivarById('okumidori')
    expect(yabukita).toBeDefined()
    expect(okumidori).toBeDefined()
    expect(yabukita!.id).not.toBe(okumidori!.id)
    expect(yabukita!.name).not.toBe(okumidori!.name)
    // おくみどり は やぶきた の子（交配親として参照が実在する）
    expect(okumidori!.parentCultivarIds).toContain('yabukita')
  })

  it('親品種・出典・化合物への参照がすべて実在する', () => {
    for (const e of allEntities) {
      for (const sid of e.sourceIds) expect(sourceIds.has(sid)).toBe(true)
      for (const f of e.findings) {
        expect(f.sourceIds.length).toBeGreaterThan(0)
        for (const sid of f.sourceIds) expect(sourceIds.has(sid)).toBe(true)
        if (f.compoundId) expect(compoundIds.has(f.compoundId)).toBe(true)
      }
    }
    for (const c of teaCultivars) {
      for (const pid of c.parentCultivarIds ?? []) {
        expect(cultivarIds.has(pid)).toBe(true)
        expect(pid).not.toBe(c.id)
      }
    }
  })

  it('科学データ未確認の対象は香味系の所見を持たない', () => {
    for (const e of allEntities) {
      if (e.verification.science === 'unconfirmed') {
        const flavorFindings = e.findings.filter((f) => FLAVOR_FINDING_KINDS.includes(f.kind))
        expect(flavorFindings, `${e.id} は science=unconfirmed なのに香味所見を持つ`).toHaveLength(0)
      }
    }
  })

  it('品種・系統エンティティは香味プロファイルを持たない（一般論で埋めない）', () => {
    for (const e of allEntities) {
      expect('profile' in e).toBe(false)
    }
  })

  it('同じ品種で複数の茶類を扱え、未確認の組み合わせを実測済みとしない', () => {
    // べにふうき は紅茶・烏龍茶・緑茶の3茶類にまたがる
    const kinds = usesForCultivar('benifuuki').map((u) => u.kindId)
    expect(kinds).toContain('black')
    expect(kinds).toContain('oolong')
    expect(kinds).toContain('green')
    // そうふう も緑茶・烏龍茶の兼用
    expect(usesForCultivar('soufu').length).toBeGreaterThanOrEqual(2)
    // studied の組み合わせは必ず出典を持つ
    for (const u of cultivarTeaUses) {
      expect(cultivarIds.has(u.cultivarId)).toBe(true)
      expect(kindIds.has(u.kindId)).toBe(true)
      if (u.status === 'studied') expect(u.sourceIds.length).toBeGreaterThan(0)
      for (const sid of u.sourceIds) expect(sourceIds.has(sid)).toBe(true)
    }
    // 実在しない組み合わせ（やぶきた×紅茶）は登録されていない
    expect(cultivarTeaUses.some((u) => u.cultivarId === 'yabukita' && u.kindId === 'black')).toBe(false)
  })

  it('伝統的3分類と遺伝的10集団を混同しない', () => {
    expect(cacaoTraditionalGroups).toHaveLength(3)
    expect(cacaoTraditionalGroups.map((g) => g.name).sort()).toEqual(['Criollo', 'Forastero', 'Trinitario'])
    expect(cacaoGeneticGroups).toHaveLength(10)
    expect(cacaoGeneticGroups.map((g) => g.name).sort()).toEqual(
      ['Amelonado', 'Contamana', 'Criollo', 'Curaray', 'Guiana', 'Iquitos', 'Marañon', 'Nacional', 'Nanay', 'Purús'],
    )
    // 伝統分類エンティティに遺伝集団への一対一対応フィールドは存在しない
    for (const g of cacaoTraditionalGroups) {
      expect('geneticGroupId' in g).toBe(false)
      expect('geneticGroupIds' in g).toBe(false)
    }
    // Forastero は単一集団ではないことが性質説明に明記されている
    const forastero = cacaoTraditionalGroups.find((g) => g.id === 'trad-forastero')!
    expect(forastero.nature).toContain('単一の遺伝集団ではない')
  })

  it('CCN-51等の個別クローンを集団と別エンティティとして区別できる', () => {
    const cloneIds = cacaoClones.map((c) => c.id)
    expect(cloneIds).toEqual(expect.arrayContaining(['ccn-51', 'ics-95', 'imc-67']))
    for (const id of cloneIds) {
      expect(geneticIds.has(id)).toBe(false)
      expect(cultivarIds.has(id)).toBe(false)
    }
    const ccn = cacaoClones.find((c) => c.id === 'ccn-51')!
    // 単一集団への帰属フィールドはなく、祖先構成は複数集団の混合として記録される
    expect('geneticGroupId' in ccn).toBe(false)
    expect(ccn.ancestry!.length).toBeGreaterThanOrEqual(3)
    const total = ccn.ancestry!.reduce((s, a) => s + a.sharePercent, 0)
    expect(total).toBeGreaterThan(0)
    expect(total).toBeLessThanOrEqual(100)
    for (const a of ccn.ancestry!) expect(geneticIds.has(a.groupId)).toBe(true)
    for (const sid of ccn.ancestrySourceIds!) expect(sourceIds.has(sid)).toBe(true)
    // IMC-67 の集団関連は実在する集団を指す
    const imc = cacaoClones.find((c) => c.id === 'imc-67')!
    for (const gid of imc.associatedGroupIds!) expect(geneticIds.has(gid)).toBe(true)
  })

  it('産地・商品名を品種と誤認しない', () => {
    // 「ダージリン」「セイロン」は地域名・茶名であり、品種エンティティとして存在しない
    expect(teaCultivars.some((c) => c.name === 'ダージリン')).toBe(false)
    expect(teaCultivars.some((c) => c.name === 'セイロン')).toBe(false)
    // ダージリンは系統・クローンとして階層化され、単一品種としては登録されていない
    const darjeeling = teaCultivars.filter((c) => c.country === 'インド')
    expect(darjeeling.length).toBeGreaterThan(0)
    for (const c of darjeeling) expect(['population', 'clone']).toContain(c.rank)
    // 鳳凰単叢は単一品種ではなく品種群
    expect(teaCultivarById('fenghuang-dancong-group')!.rank).toBe('cultivar-group')
    // 鉄観音は品種として登録され、茶名との二重性が注記されている
    const tie = teaCultivarById('tieguanyin')!
    expect(tie.rank).toBe('cultivar')
    expect(tie.note).toContain('茶名')
    // うじみどり は地名由来だが実在の育成品種として登録されている
    expect(teaCultivarById('ujimidori')!.note).toContain('実在する育成品種')
  })

  it('同義語・異表記で検索できる（別名が重複なく実在の品種を指す）', () => {
    const find = (q: string) => teaCultivars.find((c) => c.name === q || c.aliases.includes(q))
    expect(find('やぶきた')!.id).toBe('yabukita')
    expect(find('Yabukita')!.id).toBe('yabukita')
    expect(find('金萱')!.id).toBe('jinxuan')
    expect(find('二七仔')!.id).toBe('jinxuan')
    expect(find('台茶12号')!.id).toBe('jinxuan')
    expect(find('紅玉')!.id).toBe('hongyu')
    expect(find('Tieguanyin')!.id).toBe('tieguanyin')
    expect(find('Ambari Vegetative 2')!.id).toBe('av2')
  })

  it('科学データの充足状況が対象ごとに異なる（根拠に応じて変わる）', () => {
    // 査読論文の所見を持つ品種・集団
    expect(teaCultivarById('soufu')!.verification.science).toBe('peer-reviewed')
    expect(teaCultivarById('soufu')!.findings.length).toBeGreaterThan(0)
    expect(teaCultivarById('benifuuki')!.findings.length).toBeGreaterThan(0)
    const nacional = cacaoGeneticGroups.find((g) => g.id === 'gen-nacional')!
    expect(nacional.verification.science).toBe('peer-reviewed')
    expect(nacional.findings.length).toBeGreaterThanOrEqual(3)
    // 実測のない集団は未確認のまま（一般論で埋めない）
    const amelonado = cacaoGeneticGroups.find((g) => g.id === 'gen-amelonado')!
    expect(amelonado.verification.science).toBe('unconfirmed')
    expect(amelonado.findings).toHaveLength(0)
    // べにふうき の所見は機能性・含有の知見であることが条件に明記されている
    const bf = teaCultivarById('benifuuki')!.findings[0]
    expect(bf.kind).toBe('composition')
    expect(bf.conditions).toContain('香味の強さの根拠には用いない')
  })
})
