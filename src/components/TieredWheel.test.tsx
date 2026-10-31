// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import ComboWheelPanel from './ComboWheelPanel'
import ProfileWheelPanel from './ProfileWheelPanel'
import { comboTastesFromProfile } from './TasteWheel'
import { buildTasteCompounds, buildTasteTiers } from '../engine/wheelTiers'
import { teaItems } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import type { CompoundContext } from '../data/compounds'
import { analyzeTeaCombo, analyzeChocoCombo, type ComboAnalysis } from '../engine/combo'

const segs = (container: HTMLElement) => [...container.querySelectorAll('svg g.wheel-seg')]
const labelTexts = (g: Element) => [...g.querySelectorAll('.wheel-label')].map((t) => t.textContent ?? '')
const labelFontSizes = (g: Element) => [...g.querySelectorAll('.wheel-label')].map((t) => parseFloat((t as HTMLElement).style.fontSize || '12'))
const segPercents = (container: HTMLElement) => segs(container)
  .map((g) => /（(\d+)%）/.exec(g.getAttribute('aria-label') ?? '')?.[1])
  .filter((x): x is string => x !== undefined)
  .map(Number)

function expectNoBlank(container: HTMLElement) {
  const groups = segs(container)
  expect(groups.length).toBeGreaterThan(0)
  for (const g of groups) {
    expect(labelTexts(g).join('').length, `無地セグメント: ${g.getAttribute('aria-label')}`).toBeGreaterThan(0)
    for (const fs of labelFontSizes(g)) expect(fs).toBeGreaterThanOrEqual(7)
  }
}

const renderPanel = (a: ComboAnalysis) =>
  render(<ComboWheelPanel notes={a.notes} tastes={a.tastes} context={a.context} resetKey={a.title} />)

describe('3階層ホイール（第8弾・味は第10弾で3階層化）', () => {
  beforeEach(() => { cleanup() })

  it('長崎 × やぶきた × 緑茶：大分類→中分類→小分類→成分詳細まで辿れる', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const { container } = renderPanel(a)
    // 第1階層：大分類。全セグメントにラベルがあり、花系には中分類（バラ・ジャスミン）が小さく併記される
    expectNoBlank(container)
    const subs = [...container.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '')
    expect(subs.some((s) => s.includes('ジャスミン'))).toBe(true)
    // 第2階層：花系の中分類（具体名）。％の合計は100
    fireEvent.click(screen.getByLabelText(/花系を開く/))
    expectNoBlank(container)
    expect(segPercents(container).reduce((x, y) => x + y, 0)).toBe(100)
    expect(screen.getByText(/割合は裏付けデータから算出した目安で、実測の含有率ではありません/)).toBeTruthy()
    // 第3階層：ジャスミンに寄与する化学物質
    fireEvent.click(screen.getByLabelText(/ジャスミン（\d+%）に寄与する化学物質を見る/))
    expectNoBlank(container)
    expect(segPercents(container).reduce((x, y) => x + y, 0)).toBe(100)
    const labels = segs(container).flatMap((g) => labelTexts(g)).join('')
    expect(labels).toContain('ジャスモン酸メチル')
    // 成分詳細シート：成分の説明と割合の算出根拠が出る
    fireEvent.click(screen.getByLabelText(/ジャスモン酸メチル（\d+%）の詳細を見る/))
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent).toContain('ジャスミン等の花にも含まれる香り成分です')
    expect(dialog.textContent).toContain('実測の含有率ではありません')
    expect(dialog.textContent).toContain('科学的な根拠の詳細')
    fireEvent.click(screen.getByLabelText('成分情報を閉じる'))
    // 階層を戻れる
    fireEvent.click(screen.getByRole('button', { name: '← 中分類に戻る' }))
    expect(screen.getByLabelText(/バラ（\d+%）に寄与する化学物質を見る/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '← 大分類に戻る' }))
    expect(screen.getByLabelText(/花系を開く/)).toBeTruthy()
  })

  it('マダガスカル × クリオロ × ダーク：甘い香り→キャラメル→フラネオールの詳細が出る', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: 'madagascar', lineage: { layer: 'traditional', id: 'trad-criollo' } })
    const { container } = renderPanel(a)
    expectNoBlank(container)
    fireEvent.click(screen.getByLabelText(/甘い香りを開く/))
    expectNoBlank(container)
    expect(segPercents(container).reduce((x, y) => x + y, 0)).toBe(100)
    fireEvent.click(screen.getByLabelText(/キャラメル（\d+%）に寄与する化学物質を見る/))
    expectNoBlank(container)
    const labels = segs(container).flatMap((g) => labelTexts(g)).join('')
    expect(labels).toContain('フラネオール')
    fireEvent.click(screen.getByLabelText(/フラネオール（\d+%）の詳細を見る/))
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent).toContain('キャラメルやいちごのような甘い香り')
  })

  it('中分類の無い大分類は薄く表示され、押すと理由が説明される（緑茶 × 鹿児島の果実系）', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'kagoshima', cultivarId: '' })
    const { container } = renderPanel(a)
    const seg = screen.getByLabelText(/果実系（具体名の中分類はありません）/)
    expect(seg).toBeTruthy()
    fireEvent.click(seg)
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent).toContain('中分類（具体名）は表示しません')
    expect(dialog.textContent).toContain('根拠のない具体名は作りません')
    expect(container.querySelector('.wheel-note-index')).toBeTruthy()
  })

  it('味モード：大分類→中分類→小分類→成分詳細（基本味→苦味→カフェイン）', () => {
    const a = analyzeTeaCombo({ kindId: 'black', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const { container } = renderPanel(a)
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    // 第1階層：大分類は2つだけ（基本味／口当たり・収れん感）。中分類名が小さく併記される
    expectNoBlank(container)
    expect(segs(container)).toHaveLength(2)
    const groupSubs = [...container.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')
    expect(groupSubs).toContain('苦味')
    expect(groupSubs).toContain('渋味')
    expect(screen.getByText(/味の大分類は2つだけです/)).toBeTruthy()
    // 第2階層：基本味の中分類（苦味）。小分類（寄与物質名）が小さく併記される
    fireEvent.click(screen.getByLabelText(/基本味を開く/))
    expectNoBlank(container)
    const bitterSeg = screen.getByRole('button', { name: /^苦味（.+）に寄与する物質を見る$/ })
    const bitterSubs = [...bitterSeg.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')
    expect(bitterSubs).toContain('カフェイン')
    // 第3階層：苦味に寄与する物質（％合計100）→成分詳細シート
    fireEvent.click(bitterSeg)
    expectNoBlank(container)
    expect(segPercents(container).reduce((x, y) => x + y, 0)).toBe(100)
    const labels = segs(container).flatMap((g) => labelTexts(g)).join('')
    expect(labels).toContain('カフェイン')
    fireEvent.click(screen.getByLabelText(/カフェイン（\d+%）の詳細を見る/))
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent).toContain('苦味のもとになる成分')
    // 階層を戻れる（小分類→中分類→大分類）。口当たり・収れん感には渋味が属する
    fireEvent.click(screen.getByRole('button', { name: '← 中分類に戻る' }))
    expect(screen.getByRole('button', { name: /^苦味（.+）に寄与する物質を見る$/ })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '← 大分類に戻る' }))
    fireEvent.click(screen.getByLabelText(/口当たり・収れん感を開く/))
    expect(screen.getByRole('button', { name: /^渋味（収れん感）（.+）に寄与する物質を見る$/ })).toBeTruthy()
  })

  it('味モード：あさつゆは基本味（苦味・うま味）と口当たり・収れん感（渋味）に分かれ、全セグメントに併記がある', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: 'asatsuyu' })
    const { container } = renderPanel(a)
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    expectNoBlank(container)
    const groups = segs(container)
    expect(groups).toHaveLength(2)
    // 全大分類セグメントにラベル＋小さな併記（中分類名）が必ずある（無地・併記なし禁止）
    for (const g of groups) {
      const subs = [...g.querySelectorAll('.wheel-sub')]
      expect(subs.length, `併記なしセグメント: ${g.getAttribute('aria-label')}`).toBeGreaterThan(0)
      expect(subs.map((s) => s.textContent ?? '').join('').length).toBeGreaterThan(0)
    }
    const basic = groups.find((g) => (g.getAttribute('aria-label') ?? '').startsWith('基本味'))!
    const basicSubs = [...basic.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')
    expect(basicSubs).toContain('苦味')
    expect(basicSubs).toContain('うま味')
    const mouth = groups.find((g) => (g.getAttribute('aria-label') ?? '').startsWith('口当たり・収れん感'))!
    expect([...mouth.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')).toContain('渋味')
    // 基本味の中分類は苦味・うま味の2つ。中分類にも小分類（物質名）が併記される
    fireEvent.click(screen.getByLabelText(/基本味を開く/))
    expectNoBlank(container)
    expect(segs(container)).toHaveLength(2)
    const bitterSeg = screen.getByRole('button', { name: /^苦味（.+）に寄与する物質を見る$/ })
    expect([...bitterSeg.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')).toContain('ガレート型カテキン類')
    // 凡例に併記の説明がある（香り側の凡例と作法を揃える）
    expect(screen.getByText(/セグメント内の小さな文字は、その味に寄与する物質です/)).toBeTruthy()
  })

  it('味モード：物質の無い味（ミルクチョコの甘味）はホイールを作らず根拠説明が出る', () => {
    const a = analyzeChocoCombo({ kind: 'milk', originId: '', lineage: null })
    const { container } = renderPanel(a)
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    // 大分類は基本味だけ（データのあるグループのみ。階層構造は維持する）
    expectNoBlank(container)
    expect(segs(container)).toHaveLength(1)
    fireEvent.click(screen.getByLabelText(/基本味を開く/))
    expectNoBlank(container)
    const sweetSeg = screen.getByRole('button', { name: /^甘味（.+）の根拠を見る$/ })
    expect([...sweetSeg.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')).toContain('成分データなし')
    fireEvent.click(sweetSeg)
    // 小分類ホイールは作らず、根拠の説明と味の根拠がその場に出る
    expect(container.querySelectorAll('svg g.wheel-seg')).toHaveLength(0)
    expect(screen.getByText(/この味に直接結びつく成分データは/)).toBeTruthy()
    expect(screen.getByText(/ミルクチョコレートの代表プロファイル/)).toBeTruthy()
    // 中分類へ戻れる
    fireEvent.click(screen.getByRole('button', { name: '← 中分類に戻る' }))
    expect(screen.getByRole('button', { name: /^甘味（.+）の根拠を見る$/ })).toBeTruthy()
  })

  it('味の3階層は全アイテムで仕様どおり（大分類は最大2つ、中分類の併記は小分類と一致・全数）', () => {
    const cases: { name: string; profile: typeof teaItems[number]['profile']; context: CompoundContext }[] = [
      ...teaItems.map((t) => ({
        name: t.name, profile: t.profile,
        context: { side: 'tea' as const, kindId: t.kindId, itemName: t.name, itemId: t.id },
      })),
      ...chocolateItems.map((c) => ({
        name: c.name, profile: c.profile,
        context: { side: 'chocolate' as const, kindId: c.kind, itemName: c.name, itemId: c.id },
      })),
    ]
    const tasteStart = (key: string) => (key === 'astringent' ? '渋味（収れん感）' : key === 'sweet' ? '甘味' : key === 'sour' ? '酸味' : key === 'bitter' ? '苦味' : 'うま味')
    let checked = 0
    let noCompoundDims = 0
    for (const item of cases) {
      const tastes = comboTastesFromProfile(item.profile)
      if (tastes.length === 0) continue
      checked++
      const groupTiers = buildTasteTiers(tastes)
      expect(groupTiers.length, `${item.name}: 大分類は最大2つ`).toBeLessThanOrEqual(2)
      const { container } = render(<ProfileWheelPanel profile={item.profile} context={item.context} />)
      fireEvent.click(screen.getByRole('tab', { name: '味' }))
      // 第1階層：大分類セグメントは buildTasteTiers と一致し、全てに中分類名の併記がある
      const groupSegs = segs(container)
      expect(groupSegs.length, `${item.name}: 大分類セグメント数`).toBe(groupTiers.length)
      for (const g of groupSegs) {
        const subText = [...g.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')
        expect(subText.length, `${item.name}: 併記なし大分類 ${g.getAttribute('aria-label')}`).toBeGreaterThan(0)
      }
      // 各大分類を開き、中分類（個々の味）の併記が小分類（buildTasteCompounds）と一致することを確認する：
      // 物質がある味は最大重みの物質名が併記に含まれ、無い味は「成分データなし」
      for (const gt of groupTiers) {
        fireEvent.click(screen.getByLabelText(new RegExp(`^${gt.name}を開く`)))
        const midSegs = segs(container)
        expect(midSegs.length, `${item.name}/${gt.name}: 中分類セグメント数`).toBe(gt.tastes.length)
        for (const t of gt.tastes) {
          const seg = midSegs.find((g) => (g.getAttribute('aria-label') ?? '').startsWith(tasteStart(t.key)))
          expect(seg, `${item.name}/${t.key}: 中分類セグメント`).toBeTruthy()
          const subText = [...seg!.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')
          expect(subText.length, `${item.name}/${t.key}: 併記なし中分類`).toBeGreaterThan(0)
          const compounds = buildTasteCompounds(t.key, item.context)
          if (compounds.length === 0) {
            noCompoundDims++
            expect(subText, `${item.name}/${t.key}`).toContain('成分データなし')
          } else {
            const top = compounds.slice().sort((x, y) => y.percent - x.percent)[0].compound.name
            expect(subText, `${item.name}/${t.key}: 先頭物質`).toContain(top)
          }
        }
        fireEvent.click(screen.getByRole('button', { name: '← 大分類に戻る' }))
      }
      cleanup()
    }
    expect(checked).toBeGreaterThan(0)
    // 「成分データなし」の経路が実際に存在することも確認する（無ければ検証が空転する）
    expect(noCompoundDims).toBeGreaterThan(0)
  })

  it('自己監査：代表的な組み合わせで全階層に無地セグメントが無い', () => {
    const analyses = [
      analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' }),
      analyzeTeaCombo({ kindId: 'black', regionId: 'nagasaki', cultivarId: 'yabukita' }),
      analyzeChocoCombo({ kind: 'dark', originId: 'madagascar', lineage: { layer: 'traditional', id: 'trad-criollo' } }),
      analyzeChocoCombo({ kind: 'dark', originId: 'ecuador', lineage: { layer: 'genetic', id: 'gen-nacional' } }),
    ]
    for (const a of analyses) {
      const { container } = renderPanel(a)
      expectNoBlank(container)
      // 大分類チップを順に開き、中分類→小分類まで無地が無いことを確認する
      const catChips = [...container.querySelectorAll('.wheel-wrap .chip')]
      for (let i = 0; i < catChips.length; i++) {
        const chipsNow = [...container.querySelectorAll('.wheel-wrap .chip')]
        const chip = chipsNow[i]
        if (!chip || chip.textContent?.includes('中分類なし')) continue
        fireEvent.click(chip)
        expectNoBlank(container)
        const entryChips = [...container.querySelectorAll('.wheel-wrap .chip')]
        for (let j = 0; j < entryChips.length; j++) {
          const ec = [...container.querySelectorAll('.wheel-wrap .chip')][j]
          if (!ec || ec.textContent?.includes('成分データなし')) continue
          fireEvent.click(ec)
          expectNoBlank(container)
          fireEvent.click(screen.getByRole('button', { name: '← 中分類に戻る' }))
        }
        fireEvent.click(screen.getByRole('button', { name: '← 大分類に戻る' }))
      }
      // 味モードも3階層を通す（大分類→中分類→小分類。物質の無い味は根拠説明の表示でよい）
      fireEvent.click(screen.getByRole('tab', { name: '味' }))
      if (container.querySelectorAll('svg g.wheel-seg').length > 0) {
        expectNoBlank(container)
        const tasteGroupCount = container.querySelectorAll('.wheel-wrap .chip').length
        expect(tasteGroupCount).toBeLessThanOrEqual(2)
        for (let i = 0; i < tasteGroupCount; i++) {
          const chip = [...container.querySelectorAll('.wheel-wrap .chip')][i]
          if (!chip) continue
          fireEvent.click(chip)
          expectNoBlank(container)
          const midCount = container.querySelectorAll('.wheel-wrap .chip').length
          for (let j = 0; j < midCount; j++) {
            const mc = [...container.querySelectorAll('.wheel-wrap .chip')][j]
            if (!mc) continue
            fireEvent.click(mc)
            if (container.querySelectorAll('svg g.wheel-seg').length > 0) {
              expectNoBlank(container)
              expect(segPercents(container).reduce((x, y) => x + y, 0)).toBe(100)
            }
            fireEvent.click(screen.getByRole('button', { name: '← 中分類に戻る' }))
          }
          fireEvent.click(screen.getByRole('button', { name: '← 大分類に戻る' }))
        }
      }
      cleanup()
    }
  })
})
