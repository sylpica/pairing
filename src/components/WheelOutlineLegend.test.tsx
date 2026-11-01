// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import TieredWheel, { type TierSeg } from './TieredWheel'
import ComboWheelPanel from './ComboWheelPanel'
import { analyzeTeaCombo } from '../engine/combo'

// 第48弾: 根拠レベルの見分け改善の不変条件（ユーザーFB: 凡例の
// 「一般的な知見」がどこにあるか分からない。濃か薄かしか見えない）。
// A. セグメントの輪郭で質的に区別する: measured＝輪郭なし／general＝
//    細い実線（#5b4636・1.6px・dasharray なし）／inferred＝破線
//    （薄色＋破線は従来どおり一切変えない）。不透明度も従来値のまま。
// B. 優先順位は現行挙動を維持する: 選択中の輪郭（#33302a・2.4px）は
//    general の実線より優先される。inferred の破線は選択中でも維持。
//    ドリル不可の薄表示（0.42）には level があっても輪郭を付けない。
// C. 凡例の見本は実物と一致する（general 見本＝実線クラス、inferred
//    見本＝破線クラス）。薄表示が出現する第1階層の凡例には第4見本
//    「具体名なし（薄表示）」（0.42）があり、第2階層の凡例には無い。
// D. 化合物の凡例（濃さ＝根拠の近さ）には tier 3（0.38）の見本
//    「他の食品・茶類での研究例」がある。

const seg = (over: Partial<TierSeg> & { key: string }): TierSeg => ({
  label: 'テスト', color: '#9a7b4f', weight: 1, ariaLabel: 'テスト', chip: <span>テスト</span>, ...over,
})

const pathsOf = (container: HTMLElement) => [...container.querySelectorAll('svg g.wheel-seg path')]
const swatchesOf = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>('.combo-legend .legend-swatch')]

describe('第48弾: 根拠レベルの輪郭（TieredWheel の描画）', () => {
  beforeEach(() => { cleanup() })

  it('measured＝輪郭なし／general＝細い実線／inferred＝破線で、不透明度は従来値のまま', () => {
    const { container } = render(
      <TieredWheel centerLabel="中心" ariaLabel="テスト用ホイール" onSelect={() => {}}
        segments={[
          seg({ key: 'm', level: 'measured' }),
          seg({ key: 'g', level: 'general' }),
          seg({ key: 'i', level: 'inferred' }),
          seg({ key: 'p' }),
        ]} />)
    const [m, g, i, p] = pathsOf(container)
    expect(m.getAttribute('opacity')).toBe('0.95')
    expect(m.getAttribute('stroke')).toBe('none')
    expect(g.getAttribute('opacity')).toBe('0.62')
    expect(g.getAttribute('stroke')).toBe('#5b4636')
    expect(g.getAttribute('stroke-width')).toBe('1.6')
    expect(g.getAttribute('stroke-dasharray')).toBeNull()
    // 推測の表現（0.38＋破線）は従来どおり
    expect(i.getAttribute('opacity')).toBe('0.38')
    expect(i.getAttribute('stroke')).toBe('#5b4636')
    expect(i.getAttribute('stroke-width')).toBe('1.6')
    expect(i.getAttribute('stroke-dasharray')).toBe('5 3')
    // level を持たないセグメント（大分類・化合物の作法）には輪郭を付けない
    expect(p.getAttribute('stroke')).toBe('none')
    expect(p.getAttribute('opacity')).toBe('0.85')
  })

  it('選択中の輪郭は general の実線より優先され、inferred の破線とドリル不可の無輪郭は現行どおり', () => {
    const { container } = render(
      <TieredWheel centerLabel="中心" ariaLabel="テスト用ホイール" onSelect={() => {}}
        segments={[
          seg({ key: 'gs', level: 'general', selected: true }),
          seg({ key: 'is', level: 'inferred', selected: true }),
          seg({ key: 'gd', level: 'general', drillable: false }),
          seg({ key: 'id', level: 'inferred', drillable: false }),
        ]} />)
    const [gs, is, gd, id] = pathsOf(container)
    expect(gs.getAttribute('stroke')).toBe('#33302a')
    expect(gs.getAttribute('stroke-width')).toBe('2.4')
    expect(gs.getAttribute('stroke-dasharray')).toBeNull()
    // inferred の破線は選択中でも維持する（第48弾以前の挙動）
    expect(is.getAttribute('stroke')).toBe('#5b4636')
    expect(is.getAttribute('stroke-dasharray')).toBe('5 3')
    // ドリル不可の薄表示（0.42）には、level があっても輪郭を付けない
    expect(gd.getAttribute('opacity')).toBe('0.42')
    expect(gd.getAttribute('stroke')).toBe('none')
    expect(id.getAttribute('opacity')).toBe('0.42')
    expect(id.getAttribute('stroke')).toBe('none')
    expect(id.getAttribute('stroke-dasharray')).toBeNull()
  })
})

describe('第48弾: 凡例の見本（実物との一致・第4見本・化合物の第3見本）', () => {
  beforeEach(() => { cleanup() })

  const renderPanel = () => {
    const a = analyzeTeaCombo({ kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' })
    return render(<ComboWheelPanel notes={a.notes} tastes={a.tastes} context={a.context} resetKey={a.title} />)
  }

  it('香り・味の第1階層の凡例は4見本で、general 見本に実線クラスが付く', () => {
    const { container } = renderPanel()
    // 既定は香り（第46弾）。香りの第1階層の凡例
    let sw = swatchesOf(container)
    expect(sw).toHaveLength(4)
    expect(sw.map((s) => s.style.opacity)).toEqual(['0.95', '0.62', '0.38', '0.42'])
    expect(sw[0].classList.contains('legend-general')).toBe(false)
    expect(sw[1].classList.contains('legend-general')).toBe(true)
    expect(sw[1].classList.contains('legend-inferred')).toBe(false)
    expect(sw[2].classList.contains('legend-inferred')).toBe(true)
    expect(sw[3].classList.contains('legend-general')).toBe(false)
    expect(sw[3].classList.contains('legend-inferred')).toBe(false)
    expect(container.querySelector('.combo-legend')!.textContent).toContain('具体名なし（薄表示）')
    // 味の第1階層の凡例も同じ4見本（薄表示の味が出現するため）
    fireEvent.click(screen.getByRole('tab', { name: '味' }))
    sw = swatchesOf(container)
    expect(sw).toHaveLength(4)
    expect(sw.map((s) => s.style.opacity)).toEqual(['0.95', '0.62', '0.38', '0.42'])
    expect(sw[1].classList.contains('legend-general')).toBe(true)
    expect(container.querySelector('.combo-legend')!.textContent).toContain('具体名なし（薄表示）')
  })

  it('第2階層の凡例に薄表示の見本は無く、化合物の凡例には tier 3（0.38）の見本がある', () => {
    const { container } = renderPanel()
    fireEvent.click(screen.getByLabelText(/花系を開く/))
    let sw = swatchesOf(container)
    expect(sw).toHaveLength(3)
    expect(container.querySelector('.combo-legend')!.textContent).not.toContain('具体名なし（薄表示）')
    fireEvent.click(screen.getByLabelText(/ジャスミン（\d+%）に寄与する化学物質を見る/))
    const legend = container.querySelector('.combo-legend')!
    expect(legend.textContent).toContain('凡例（濃さ＝根拠の近さ）')
    sw = swatchesOf(container)
    expect(sw).toHaveLength(3)
    expect(sw.map((s) => s.style.opacity)).toEqual(['0.95', '0.62', '0.38'])
    expect(legend.textContent).toContain('他の食品・茶類での研究例')
  })

  it('CSS: general の見本は実線、inferred の見本は破線（実物の輪郭と同値）', () => {
    const css = readFileSync('src/App.css', 'utf-8')
    expect(css).toContain('.legend-general { border: 1.6px solid #5b4636; }')
    expect(css).toContain('.legend-inferred { border: 1.6px dashed #5b4636; }')
  })
})
