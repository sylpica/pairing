// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import ComboWheelPanel from './ComboWheelPanel'
import ProfileWheelPanel from './ProfileWheelPanel'
import { comboTastesFromProfile } from './TasteWheel'
import { comboNotesFromProfile } from './ProfileWheelPanel'
import { buildTasteNoteTiers } from '../engine/wheelTiers'
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
    fireEvent.click(screen.getByRole('tab', { name: '香り' })) // 第33弾で既定は味になったため明示的に切り替える
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

  it('第17弾：ドリルダウンではホイールが説明文より前に来る（香り第3階層・組み合わせ系とアイテム系）', () => {
    const expectWheelBeforeHead = (container: HTMLElement) => {
      const wheel = container.querySelector('svg.wheel')
      const head = container.querySelector('.wheel-entry-head')
      expect(wheel).toBeTruthy()
      expect(head).toBeTruthy()
      // 説明文（.wheel-entry-head）はホイールの後ろ（下）にある
      expect(wheel!.compareDocumentPosition(head!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      // 説明文自体は残っている（推測の根拠・根拠成分が見られる）
      expect(head!.textContent).toContain('根拠成分')
    }
    // 組み合わせ系：長崎 × やぶきた × 緑茶 → 花系 → ジャスミン（スクリーンショットの状態）
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const c1 = renderPanel(a)
    fireEvent.click(screen.getByRole('tab', { name: '香り' })) // 第33弾: 既定は味
    fireEvent.click(screen.getByLabelText(/花系を開く/))
    fireEvent.click(screen.getByLabelText(/ジャスミン（\d+%）に寄与する化学物質を見る/))
    expectWheelBeforeHead(c1.container)
    cleanup()
    // アイテム系：蒸し緑茶の詳細ホイールでも同じ並び
    const item = teaItems.find((t) => t.id === 'green-steamed')!
    const c2 = render(<ProfileWheelPanel profile={item.profile} context={{ side: 'tea', kindId: item.kindId, itemName: item.name, itemId: item.id }} />)
    fireEvent.click(screen.getByRole('tab', { name: '香り' })) // 第33弾: 既定は味
    fireEvent.click(screen.getByLabelText(/花系を開く/))
    fireEvent.click(screen.getByLabelText(/ジャスミン（\d+%）に寄与する化学物質を見る/))
    expectWheelBeforeHead(c2.container)
  })

  it('第17弾：味の第3階層でもホイールが注記より前に来る', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: '', lineage: null })
    const { container } = renderPanel(a)
    // 第33弾・第34弾: 既定は味モード。第1階層（苦味）→第2階層（具体名カカオ）→第3階層（化合物）
    fireEvent.click(screen.getByLabelText(/苦味を開く/))
    fireEvent.click(screen.getByLabelText(/カカオ（\d+%）に寄与する化学物質を見る/))
    const wheel = container.querySelector('svg.wheel')
    const percentNote = container.querySelector('.wheel-percent-note')
    expect(wheel).toBeTruthy()
    expect(percentNote).toBeTruthy()
    expect(wheel!.compareDocumentPosition(percentNote!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    // 根拠の見出し（.wheel-entry-head）はホイールより後（下）にある
    const head = container.querySelector('.wheel-entry-head')
    expect(head).toBeTruthy()
    expect(wheel!.compareDocumentPosition(head!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('マダガスカル × クリオロ × ダーク：甘い香り→キャラメル→フラネオールの詳細が出る', () => {
    const a = analyzeChocoCombo({ kind: 'dark', originId: 'madagascar', lineage: { layer: 'traditional', id: 'trad-criollo' } })
    const { container } = renderPanel(a)
    fireEvent.click(screen.getByRole('tab', { name: '香り' })) // 第33弾: 既定は味
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
    fireEvent.click(screen.getByRole('tab', { name: '香り' })) // 第33弾: 既定は味
    const seg = screen.getByLabelText(/果実系（\d+%・具体名の中分類はありません）/)
    expect(seg).toBeTruthy()
    fireEvent.click(seg)
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent).toContain('中分類（具体名）は表示しません')
    expect(dialog.textContent).toContain('根拠のない具体名は作りません')
    expect(container.querySelector('.wheel-note-index')).toBeTruthy()
  })

  it('味モード：第1階層（味）→第2階層（具体名）→第3階層（化合物）→成分詳細（第34弾）', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    const { container } = renderPanel(a)
    // 第33弾: 既定は味モード。第1階層は味そのもの（甘味・苦味・渋味・うま味の4つ）
    expectNoBlank(container)
    expect(segs(container)).toHaveLength(4)
    expect(container.textContent).not.toContain('基本味')
    expect(container.textContent).not.toContain('口当たり・収れん感')
    const topSubs = [...container.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')
    expect(topSubs).toContain('蜂蜜') // 甘味の具体名が小さく併記される
    expect(screen.getByText(/第1階層は、その対象で確認されている味そのもの/)).toBeTruthy()
    // 第2階層（甘味）：具体名（蜂蜜・栗）。化合物名が小さく併記される
    fireEvent.click(screen.getByLabelText(/甘味を開く/))
    expectNoBlank(container)
    expect(segPercents(container).reduce((x, y) => x + y, 0)).toBe(100)
    const noteLabels = segs(container).flatMap((g) => labelTexts(g)).join('')
    expect(noteLabels).toContain('蜂蜜')
    expect(noteLabels).toContain('栗')
    // 第2階層（苦味）：対応づく具体名が無いため、寄与物質を直接示す（％合計100）→成分詳細シート
    fireEvent.click(screen.getByRole('button', { name: '← 味に戻る' }))
    fireEvent.click(screen.getByLabelText(/苦味を開く/))
    expectNoBlank(container)
    expect(segPercents(container).reduce((x, y) => x + y, 0)).toBe(100)
    const fbLabels = segs(container).flatMap((g) => labelTexts(g)).join('')
    expect(fbLabels).toContain('ガレート型カテキン類')
    const fbSeg = segs(container).find((g) => (g.getAttribute('aria-label') ?? '').startsWith('ガレート型カテキン類'))!
    fireEvent.click(fbSeg)
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent).toContain('ガレート型カテキン類')
    fireEvent.click(screen.getByRole('button', { name: '← 味に戻る' }))
    expect(screen.getByLabelText(/渋味（収れん感）を開く/)).toBeTruthy()
  })

  it('味モード：あさつゆは第1階層が4つの味（甘味・苦味・渋味・うま味）に分かれ、全セグメントに併記がある', () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: '', cultivarId: 'asatsuyu' })
    const { container } = renderPanel(a)
    expectNoBlank(container)
    const top = segs(container)
    expect(top).toHaveLength(4)
    // 全セグメントにラベル＋小さな併記（具体名または物質名）が必ずある（無地・併記なし禁止）
    for (const g of top) {
      const subs = [...g.querySelectorAll('.wheel-sub')]
      expect(subs.length, `併記なしセグメント: ${g.getAttribute('aria-label')}`).toBeGreaterThan(0)
      expect(subs.map((s) => s.textContent ?? '').join('').length).toBeGreaterThan(0)
    }
    const sweet = top.find((g) => (g.getAttribute('aria-label') ?? '').startsWith('甘味'))!
    expect([...sweet.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')).toContain('栗')
    // 甘味の第2階層は具体名（栗）。凡例に併記の説明がある
    fireEvent.click(screen.getByLabelText(/甘味を開く/))
    expectNoBlank(container)
    expect(segPercents(container).reduce((x, y) => x + y, 0)).toBe(100)
    expect(screen.getByText(/中分類は、その味に対応づく具体名/)).toBeTruthy()
  })

  it('味モード：具体名も物質も無い味（ルビーの甘味）はホイールを無理に作らず根拠説明が出る', () => {
    const a = analyzeChocoCombo({ kind: 'ruby', originId: '', lineage: null })
    const { container } = renderPanel(a)
    // 第1階層は甘味・酸味の2つ（データのある味のみ）
    expectNoBlank(container)
    expect(segs(container)).toHaveLength(2)
    fireEvent.click(screen.getByLabelText(/甘味を開く/))
    // 具体名（ベリーは酸味側）も寄与物質も無いため、ホイールは作らず根拠説明が出る
    expect(container.querySelectorAll('svg g.wheel-seg')).toHaveLength(0)
    expect(screen.getByText(/この味に直接結びつく成分データは/)).toBeTruthy()
    // 味に戻れる。酸味には具体名（ベリー）がある
    fireEvent.click(screen.getByRole('button', { name: '← 味に戻る' }))
    fireEvent.click(screen.getByLabelText(/酸味を開く/))
    expect(segs(container).flatMap((g) => labelTexts(g)).join('')).toContain('ベリー')
  })

  it('味モード：化合物の無い具体名（ミルクチョコの麦芽）は根拠シートを開く', () => {
    const a = analyzeChocoCombo({ kind: 'milk', originId: '', lineage: null })
    const { container } = renderPanel(a)
    fireEvent.click(screen.getByLabelText(/甘味を開く/))
    expectNoBlank(container)
    const maltSeg = screen.getByRole('button', { name: /^麦芽（\d+%）の根拠を見る$/ })
    expect([...maltSeg.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')).toContain('成分データなし')
    fireEvent.click(maltSeg)
    const dialog = screen.getByRole('dialog')
    expect(dialog.textContent).toContain('麦芽')
  })

  it('第22弾：具体名も物質も無い味の表示でも、凡例に集約した注意書きが消えない（ルール3の端ケース）', () => {
    const a = analyzeChocoCombo({ kind: 'ruby', originId: '', lineage: null })
    const { container } = render(
      <ComboWheelPanel notes={a.notes} tastes={a.tastes} context={a.context} resetKey={a.title}
        legendExtra={<p><span className="badge">組み合わせ全体の根拠：一般的な知見</span></p>} />)
    fireEvent.click(screen.getByLabelText(/甘味を開く/))
    // ホイールも通常の凡例も出ないが、集約した注意書きは凡例ボックスの器で残る
    expect(screen.getByText(/この味に直接結びつく成分データは/)).toBeTruthy()
    const legend = container.querySelector('.combo-legend')
    expect(legend).toBeTruthy()
    expect(legend!.textContent).toContain('組み合わせ全体の根拠：一般的な知見')
  })

  it('第22弾：香り・味のデータが無い状態でも、凡例に集約した注意書きが消えない', () => {
    const { container } = render(
      <ComboWheelPanel notes={[]} tastes={[]} legendExtra={<p><span className="badge">全体の根拠テスト</span></p>} />)
    // 香りモード（データなし）でも凡例ボックスの器に注意書きが残る
    expect(container.querySelector('.combo-legend')!.textContent).toContain('全体の根拠テスト')
    // 味モード（データなし）でも同様
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    expect(container.querySelector('.combo-legend')!.textContent).toContain('全体の根拠テスト')
  })

  it('味の3階層は全アイテムで仕様どおり（第1階層は味、第2階層は具体名、併記は化合物と一致・全数）', () => {
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
    const tasteLabelOf = (key: string) => (key === 'astringent' ? '渋味（収れん感）' : key === 'sweet' ? '甘味' : key === 'sour' ? '酸味' : key === 'bitter' ? '苦味' : 'うま味')
    let checked = 0
    let noCompoundDims = 0
    for (const item of cases) {
      const notes = comboNotesFromProfile(item.profile)
      const tastes = comboTastesFromProfile(item.profile)
      if (tastes.length === 0) continue
      checked++
      const tiers = buildTasteNoteTiers(notes, tastes, item.context)
      const { container } = render(<ProfileWheelPanel profile={item.profile} context={item.context} />)
      // 第33弾: 既定は味モード。第1階層セグメントは buildTasteNoteTiers と一致し、全てに併記がある
      const topSegs = segs(container)
      expect(topSegs.length, `${item.name}: 第1階層セグメント数`).toBe(tiers.length)
      for (const g of topSegs) {
        const subText = [...g.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')
        expect(subText.length, `${item.name}: 併記なし第1階層 ${g.getAttribute('aria-label')}`).toBeGreaterThan(0)
      }
      for (const tier of tiers) {
        fireEvent.click(screen.getByLabelText(new RegExp(`^${tasteLabelOf(tier.key)}を開く`)))
        const midSegs = segs(container)
        if (tier.entries.length > 0) {
          // 第2階層は具体名。化合物のある具体名は最大重みの化合物名が併記に含まれ、無いものは「成分データなし」
          expect(midSegs.length, `${item.name}/${tier.key}: 具体名セグメント数`).toBe(tier.entries.length)
          for (const e of tier.entries) {
            const seg = midSegs.find((g) => (g.getAttribute('aria-label') ?? '').startsWith(e.label))
            expect(seg, `${item.name}/${tier.key}/${e.noteId}: 具体名セグメント`).toBeTruthy()
            const subText = [...seg!.querySelectorAll('.wheel-sub')].map((el) => el.textContent ?? '').join('')
            expect(subText.length, `${item.name}/${tier.key}/${e.noteId}: 併記なし具体名`).toBeGreaterThan(0)
            if (e.compounds.length === 0) {
              noCompoundDims++
              expect(subText, `${item.name}/${tier.key}/${e.noteId}`).toContain('成分データなし')
            } else {
              const top = e.compounds.slice().sort((x, y) => y.percent - x.percent)[0].compound.name
              expect(subText, `${item.name}/${tier.key}/${e.noteId}: 先頭化合物`).toContain(top)
            }
          }
        } else if (tier.fallbackCompounds.length > 0) {
          // 具体名が無い味は寄与物質を直接出す
          expect(midSegs.length, `${item.name}/${tier.key}: 物質セグメント数`).toBe(tier.fallbackCompounds.length)
        } else {
          // どちらも無い味はホイールを作らない
          expect(midSegs.length, `${item.name}/${tier.key}: ホイールなし`).toBe(0)
          noCompoundDims++
        }
        fireEvent.click(screen.getByRole('button', { name: '← 味に戻る' }))
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
      fireEvent.click(screen.getByRole('tab', { name: '香り' })) // 第33弾: 既定は味。香り側を先に通す
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
      // 味モードも3階層を通す（味→具体名→化合物。具体名が無い味は物質の直接表示か根拠説明でよい）
      fireEvent.click(screen.getByRole('tab', { name: '味' }))
      if (container.querySelectorAll('svg g.wheel-seg').length > 0) {
        expectNoBlank(container)
        const tasteTopCount = container.querySelectorAll('.wheel-wrap .chip').length
        expect(tasteTopCount).toBeLessThanOrEqual(5)
        for (let i = 0; i < tasteTopCount; i++) {
          const chip = [...container.querySelectorAll('.wheel-wrap .chip')][i]
          if (!chip) continue
          fireEvent.click(chip)
          expectNoBlank(container)
          const midCount = container.querySelectorAll('.wheel-wrap .chip').length
          for (let j = 0; j < midCount; j++) {
            const mc = [...container.querySelectorAll('.wheel-wrap .chip')][j]
            if (!mc || mc.textContent?.includes('成分データなし')) continue
            fireEvent.click(mc)
            if (screen.queryByRole('dialog')) {
              // 具体名が無い味の物質チップは詳細シートを直接開く
              fireEvent.click(container.querySelector('.sheet-close')!)
              continue
            }
            if (container.querySelectorAll('svg g.wheel-seg').length > 0) {
              expectNoBlank(container)
              expect(segPercents(container).reduce((x, y) => x + y, 0)).toBe(100)
              fireEvent.click(screen.getByRole('button', { name: '← 中分類に戻る' }))
            }
          }
          fireEvent.click(screen.getByRole('button', { name: '← 味に戻る' }))
        }
      }
      cleanup()
    }
  })
})
