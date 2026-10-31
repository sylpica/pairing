// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import ComboWheelPanel from './ComboWheelPanel'
import TasteWheel, { comboTastesFromProfile } from './TasteWheel'
import { buildTasteCompounds } from '../engine/wheelTiers'
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

describe('3階層ホイール（第8弾）', () => {
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

  it('味モード：次元→寄与する物質（％合計100）→成分詳細', () => {
    const a = analyzeTeaCombo({ kindId: 'black', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const { container } = renderPanel(a)
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    fireEvent.click(screen.getByRole('button', { name: /^苦味（.+）の根拠を見る$/ }))
    expectNoBlank(container)
    expect(segPercents(container).reduce((x, y) => x + y, 0)).toBe(100)
    const labels = segs(container).flatMap((g) => labelTexts(g)).join('')
    expect(labels).toContain('カフェイン')
    fireEvent.click(screen.getByLabelText(/カフェイン（\d+%）の詳細を見る/))
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent).toContain('苦味のもとになる成分')
    // 味の一覧に戻れる
    fireEvent.click(screen.getByRole('button', { name: '← 味の一覧に戻る' }))
    expect(screen.getByRole('button', { name: /^渋味（.+）の根拠を見る$/ })).toBeTruthy()
  })

  it('味モード第1階層：各次元に寄与物質名が小さく併記される（追加指示B）', () => {
    const a = analyzeTeaCombo({ kindId: 'black', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const { container } = renderPanel(a)
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    // 全セグメントにラベル＋小さな併記（寄与物質名）が必ずある（無地・併記なし禁止）
    const groups = segs(container)
    expect(groups.length).toBeGreaterThan(0)
    for (const g of groups) {
      const subs = [...g.querySelectorAll('.wheel-sub')]
      expect(subs.length, `併記なしセグメント: ${g.getAttribute('aria-label')}`).toBeGreaterThan(0)
      expect(subs.map((s) => s.textContent ?? '').join('').length).toBeGreaterThan(0)
    }
    // 苦味には、第2階層で出る寄与物質カフェインが併記される
    const bitter = screen.getByRole('button', { name: /^苦味（.+）の根拠を見る$/ })
    const bitterSubs = [...bitter.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')
    expect(bitterSubs).toContain('カフェイン')
    // 凡例に併記の説明がある（香り側の凡例と作法を揃える）
    expect(screen.getByText(/セグメント内の小さな文字は、その味に寄与する物質です/)).toBeTruthy()
  })

  it('味ホイール第1階層の併記は、全アイテムで第2階層の物質と一致する（追加指示B・全数）', () => {
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
    let checked = 0
    let noCompoundDims = 0
    for (const item of cases) {
      const tastes = comboTastesFromProfile(item.profile)
      if (tastes.length === 0) continue
      checked++
      const { container } = render(<TasteWheel tastes={tastes} onSelectTaste={() => {}} context={item.context} />)
      const groups = segs(container)
      expect(groups.length, `${item.name}: セグメント数`).toBe(tastes.length)
      for (const g of groups) {
        const subText = [...g.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')
        expect(subText.length, `${item.name}: 併記なしセグメント ${g.getAttribute('aria-label')}`).toBeGreaterThan(0)
      }
      // 各次元について、併記の内容が第2階層（buildTasteCompounds）と一致する：
      // 物質がある次元は最大重みの物質名が併記に含まれ、無い次元は「成分データなし」
      for (const t of tastes) {
        const compounds = buildTasteCompounds(t.key, item.context)
        const seg = groups.find((g) => (g.getAttribute('aria-label') ?? '').startsWith(
          t.key === 'astringent' ? '渋味（収れん感）' : t.key === 'sweet' ? '甘味' : t.key === 'sour' ? '酸味' : t.key === 'bitter' ? '苦味' : 'うま味'))
        expect(seg, `${item.name}/${t.key}: セグメント`).toBeTruthy()
        const subText = [...seg!.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')
        if (compounds.length === 0) {
          noCompoundDims++
          expect(subText, `${item.name}/${t.key}`).toContain('成分データなし')
        } else {
          const top = compounds.slice().sort((x, y) => y.percent - x.percent)[0].compound.name
          expect(subText, `${item.name}/${t.key}: 先頭物質`).toContain(top)
        }
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
      cleanup()
    }
  })
})
