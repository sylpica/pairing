import { useEffect, useState } from 'react'
import { usePersistedState, readPersisted } from './hooks/usePersistedState'
import { teaItems, teaKinds, teaById } from './data/teas'
import { chocolateItems, chocolateById } from './data/chocolates'
import { sources } from './data/sources'
import ProfileView, { LEVEL_LABEL, SourceLinks } from './components/ProfileView'
import FlavorWheel from './components/FlavorWheel'
import { recommend, TASTE_LABELS } from './engine/pairing'
import { hasAnyInteraction } from './engine/interactions'
import { CHARACTER_RULE_LABELS } from './engine/pairingCharacter'
import { assembleBlend, type BlendSideResult } from './engine/pairingCombo'
import type { ChocolateItem, InteractionStatement, PairingCharacter, TeaItem } from './types'
import { categoryById } from './data/flavors'
import { loadSaved, persistSaved, pushHistory, validateSaved, pairIdOf, parsePairId, type SavedData } from './storage'
import { go, scrollTop, trackRoute } from './nav'
import NoteDetail from './components/NoteDetail'
import { CollapsibleSheet } from './components/Sheet'
import CompoundCard from './components/CompoundCard'
import { PairNoteCompounds, PairCategoryCompounds, type PairCompoundSide } from './components/PairCompounds'
import { compounds, compoundById } from './data/compounds'
import { noteById } from './data/flavors'
import { CultivarsPage, TeaCultivarDetail, CacaoDetail, OriginDetail, RANK_LABEL } from './components/CultivarPages'
import { TeaComboPage, ChocoComboPage } from './components/ComboPages'
import CultivarComparePage from './components/CultivarCompare'
import { teaCultivarById, cultivarsForKind, teaCultivars, usesForCultivar } from './data/cultivars'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones, traditionalGroupById, geneticGroupById, cacaoCloneById } from './data/cacao'
import { cacaoOrigins, cacaoOriginById, originsForLineage } from './data/origins'
import { teaCultivarPairingNote, cacaoPairingNote, cacaoOriginPairingNote, teaOriginPairingNote, teaRegionPairingNote, DATA_LEVEL_LABEL, CACAO_LAYER_LABEL, type CacaoLayer, type PairingContextNote } from './engine/pairingContext'
import { teaRegions, teaRegionById } from './data/teaRegions'
import {
  teaComboPath, teaComboBaseItem, teaComboCategoryOf, chocoRepresentativeItem,
  teaOriginComboRegionIdOfValue, teaOriginCountryOfValue, teaOriginLabelOfValue,
  analyzeTeaCombo, analyzeChocoCombo, chocoComboPath,
  completeTeaComboSel, completeChocoComboSel, teaKindName, CHOCO_KIND_LABEL, TEA_COMBO_KINDS, CHOCO_COMBO_KINDS,
  COMBO_LEVEL_LABEL, COMBO_TASTE_LABEL, type ComboAnalysis, type ChocoComboSel, type TeaComboSel,
} from './engine/combo'
import { COMBO_INT_LABEL } from './components/ComboWheel'
import ComboWheelPanel from './components/ComboWheelPanel'
import ProfileWheelPanel from './components/ProfileWheelPanel'
import { FindingsList, SCIENCE_LABEL } from './components/EntityViews'
import { TeaLeafIcon, TeaCupIcon, MapPinIcon, SproutIcon, CacaoPodIcon, ChocoBarIcon, LineageIcon, StarIcon, HistoryIcon } from './components/icons'
import BackButton from './components/BackButton'
import { TeaComboSelects, ChocoComboSelects, type TeaSelectsState, type ChocoSelectsState } from './components/ComboSelectors'
import type { ChocolateKind } from './types'

type Route = { name: string; id?: string; sub?: string }
const KNOWN_ROUTES = ['home', 'tea', 'choco', 'pair', 'compare', 'saved', 'sources', 'compounds', 'cultivars', 'cultivar', 'cacao', 'compare-cultivars', 'origin', 'combo']
function parseRoute(): Route {
  const h = location.hash.replace(/^#\/?/, '')
  const [name, id, sub] = h.split('/')
  return { name: KNOWN_ROUTES.includes(name) ? name : 'home', id, sub }
}

const norm = (s: string) => s.toLowerCase().replace(/[\s　]/g, '').replace(/ヶ/g, 'ケ')
function matches(query: string, names: string[]) {
  if (!query.trim()) return true
  const q = norm(query)
  return names.some((n) => norm(n).includes(q) || q.includes(norm(n)) && norm(n).length >= 2)
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute())
  const [saved, setSaved] = useState<SavedData>(loadSaved())
  useEffect(() => { const f = () => setRoute(parseRoute()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  useEffect(() => { scrollTop() }, [route.name, route.id])
  // 「戻る」ボタン用に、画面遷移のたびに戻り先を記録する
  const routePath = [route.name, route.id, route.sub].filter((x) => x !== undefined && x !== '').join('/')
  useEffect(() => { trackRoute(routePath) }, [routePath])
  useEffect(() => { persistSaved(saved) }, [saved])

  const toggleFav = (kind: 'teas' | 'chocolates' | 'pairings', id: string) =>
    setSaved((s) => ({ ...s, favorites: { ...s.favorites, [kind]: s.favorites[kind].includes(id) ? s.favorites[kind].filter((x) => x !== id) : [...s.favorites[kind], id] } }))
  const addHistory = (kind: 'teas' | 'chocolates' | 'pairings', id: string) =>
    setSaved((s) => ({ ...s, history: { ...s.history, [kind]: pushHistory(s.history[kind], id) } }))

  return (
    <div className="app">
      <header className="app-header">
        <button className="brand" onClick={() => go('home')} aria-label="ホームへ">
          <svg viewBox="0 0 48 48" className="brand-icon" aria-hidden="true"><path d="M8 20h26v8a10 10 0 0 1-10 10h-6A10 10 0 0 1 8 28z" fill="#7fb069" /><path d="M34 23h3a5 5 0 0 1 0 10h-4" fill="none" stroke="#7fb069" strokeWidth="3" /><path d="M14 14c0-3 3-3 3-6M23 14c0-3 3-3 3-6" stroke="#b5654d" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
          <span>お茶×チョコ フレーバー図鑑</span>
        </button>
        <nav className="app-nav" aria-label="主なメニュー">
          <button onClick={() => go('tea')}>お茶</button>
          <button onClick={() => go('choco')}>チョコ</button>
          <button onClick={() => go('cultivars')}>品種・系統</button>
          <button onClick={() => go('pair')}>組み合わせる</button>
          <button className="nav-icon" onClick={() => go('saved')} aria-label="お気に入り"><StarIcon /></button>
          <button className="nav-icon" onClick={() => go('saved')} aria-label="履歴"><HistoryIcon /></button>
        </nav>
      </header>
      <main>
        {route.name === 'home' && <Home />}
        {route.name === 'tea' && !route.id && <TeaList />}
        {route.name === 'tea' && route.id && <TeaDetail id={route.id} saved={saved} toggleFav={toggleFav} addHistory={addHistory} />}
        {route.name === 'choco' && !route.id && <ChocoList />}
        {route.name === 'choco' && route.id && <ChocoDetail id={route.id} saved={saved} toggleFav={toggleFav} addHistory={addHistory} />}
        {route.name === 'pair' && <PairPage saved={saved} toggleFav={toggleFav} addHistory={addHistory} />}
        {route.name === 'compare' && <ComparePage />}
        {route.name === 'saved' && <SavedPage saved={saved} setSaved={setSaved} />}
        {route.name === 'sources' && <SourcesPage />}
        {route.name === 'compounds' && <CompoundsPage highlightId={route.id} />}
        {route.name === 'cultivars' && <CultivarsPage />}
        {route.name === 'cultivar' && route.id && <TeaCultivarDetail id={route.id} />}
        {route.name === 'origin' && route.id && <OriginDetail id={route.id} />}
        {route.name === 'cacao' && route.id && route.sub && <CacaoDetail layer={route.id as CacaoLayer} id={route.sub} />}
        {route.name === 'compare-cultivars' && <CultivarComparePage />}
        {route.name === 'combo' && route.id === 'choco' && <ChocoComboPage sub={route.sub} />}
        {route.name === 'combo' && route.id !== 'choco' && <TeaComboPage sub={route.sub} />}
      </main>
      <footer className="app-footer">
        <button className="linklike" onClick={() => go('combo/tea')}>組み合わせで調べる（お茶）</button>
        <button className="linklike" onClick={() => go('combo/choco')}>組み合わせで調べる（チョコ）</button>
        <button className="linklike" onClick={() => go('compare')}>茶類・製法の比較</button>
        <button className="linklike" onClick={() => go('compare-cultivars')}>品種・系統の比較</button>
        <button className="linklike" onClick={() => go('compounds')}>成分一覧</button>
        <button className="linklike" onClick={() => go('sources')}>出典・論文一覧</button>
        <p>香味の表示は科学論文に基づく範囲のみ。根拠のない推定や相性スコアは出しません。</p>
      </footer>
    </div>
  )
}

function Home() {
  return (
    <div>
      <section className="hero">
        <h1>お茶とチョコレートの<br />フレーバー図鑑</h1>
        <p>科学論文をもとに、香りの世界をのぞいてみましょう。</p>
      </section>
      <div className="card-grid">
        <button className="big-card tea" onClick={() => go('tea')}>
          <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 26h38v10a14 14 0 0 1-14 14h-10A14 14 0 0 1 10 36z" fill="#7fb069" /><path d="M48 30h2a7 7 0 0 1 0 14h-4" fill="none" stroke="#7fb069" strokeWidth="4" /><path d="M20 20c0-4 4-4 4-8M32 20c0-4 4-4 4-8" stroke="#b5654d" strokeWidth="3" fill="none" strokeLinecap="round" /></svg>
          <span className="big-card-title">お茶を調べる</span><span>茶類や製法から香りを探す</span>
        </button>
        <button className="big-card choco" onClick={() => go('choco')}>
          <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="10" width="40" height="44" rx="6" fill="#a67c52" /><path d="M12 25h40M12 40h40M32 10v44" stroke="#7c5a3a" strokeWidth="3" /></svg>
          <span className="big-card-title">チョコを調べる</span><span>種類や焙煎から香りを探す</span>
        </button>
        <button className="big-card pair" onClick={() => go('pair')}>
          <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="24" cy="32" r="15" fill="#7fb069" opacity="0.75" /><circle cx="42" cy="32" r="15" fill="#a67c52" opacity="0.75" /></svg>
          <span className="big-card-title">組み合わせる</span><span>共通の香りと対比を探す</span>
        </button>
      </div>
      <p className="note-small">産地×品種×分類の具体的な組み合わせごとの味わいは、
        <button className="linklike" onClick={() => go('combo/tea')}>組み合わせで調べる（お茶）</button>／
        <button className="linklike" onClick={() => go('combo/choco')}>組み合わせで調べる（チョコ）</button>
        から（例：長崎の紅茶のやぶきた と 長崎の緑茶のやぶきた の違い）。
      </p>
    </div>
  )
}

const KIND_ORDER = ['green', 'white', 'yellow', 'oolong', 'black', 'dark']
/** 茶類（大分類）ごとのカードアイコンの色。図鑑らしさを出すための色分けで、香味の根拠とは無関係。 */
const KIND_COLOR: Record<string, string> = {
  green: '#7fb069', white: '#a9bd93', yellow: '#dfb84e', oolong: '#5f9e8f', black: '#b5654d', dark: '#6b4f3a',
}
/** チョコの種類ごとのカードアイコンの色（同上）。 */
const CHOCO_KIND_COLOR: Record<ChocolateKind, string> = {
  dark: '#6b4f3a', milk: '#a67c52', white: '#dfc07a', ruby: '#d96b8a', blond: '#dfa94e', other: '#999083',
}

/** 茶類IDから大分類（六大茶類）を引く。形態の茶類（煎茶・玉露など）は緑茶に含める。 */
const kindCategoryOf = (kindId: string) => {
  const k = teaKinds.find((x) => x.id === kindId)
  if (!k) return kindId
  return k.category === 'form' ? 'green' : k.category
}
/** プロファイル（アイテム）側に産地が特定できるものだけを対応付ける。それ以外は産地未特定として、産地で絞り込むと結果に出ない。 */
const TEA_ITEM_REGIONS: Record<string, string> = {
  sencha: '日本', matcha: '日本', gyokuro: '日本', hojicha: '日本',
  'fenghuang-dancong': '中国',
}
const AXIS_SUMMARY_LABEL: Record<string, string> = { region: '産地の反映', cultivar: '品種の反映', origin: '産地の反映', lineage: '系統の反映' }

/** 調べる画面のプルダウン直下に出す、その場の組み合わせ表示（ホイール＋要約）。
 * 分類・産地・品種（チョコは種類・産地・系統）が揃ったときにだけ表示する。 */
function ComboPreview({ analysis, path, note: assumedNote }: { analysis: ComboAnalysis; path: string; note?: string }) {
  return (
    <section className="combo-preview" aria-label="選択中の組み合わせのフレーバー">
      <h3>{analysis.title}</h3>
      {assumedNote && <p className="note-small">{assumedNote}</p>}
      <p><span className="badge">組み合わせ全体の根拠：{COMBO_LEVEL_LABEL[analysis.overallLevel]}</span></p>
      <ComboWheelPanel notes={analysis.notes} tastes={analysis.tastes} context={analysis.context} resetKey={analysis.title} />
      {analysis.tastes.length > 0 && <p>味わい：{analysis.tastes.map((t) => `${COMBO_TASTE_LABEL[t.key]}（${COMBO_INT_LABEL[t.intensity]}）`).join('、')}</p>}
      {analysis.axisSummaries.map((s) => (
        <p key={s.axis} className="note-small"><strong>{AXIS_SUMMARY_LABEL[s.axis]}</strong>：{s.text}</p>
      ))}
      {analysis.statements.map((s, i) => (
        <p key={i}>{s.level === 'inferred' && <><span className="badge badge-inferred">推測（未検証）</span> </>}{s.text}</p>
      ))}
      <button className="btn" onClick={() => go(path)}>この組み合わせの詳細ページへ</button>
    </section>
  )
}

type TeaListFilters = { q: string; kind: string; region: string; cultivarId: string }
function TeaList() {
  const [q, setQ] = useState('')
  const [kindRaw, setKindRaw] = usePersistedState('pairing.teaList.kind', 'all')
  const [regionRaw, setRegionRaw] = usePersistedState('pairing.teaList.region', 'all')
  const [cultivarRaw, setCultivarRaw] = usePersistedState('pairing.teaList.cultivarId', 'all')
  // プルダウンの値の約束は「組み合わせる」画面と共通（ComboSelectors）：
  // '' = 指定なし、分類は茶類IDかアイテムID、産地は国名か 'region:<地域ID>'。
  // 旧形式（'all' / 'item:<id>'）で保存された値は読み替える。
  const kind = kindRaw === 'all' ? '' : kindRaw.startsWith('item:') ? kindRaw.slice('item:'.length) : kindRaw
  const region = regionRaw === 'all' ? '' : regionRaw
  const cultivarId = cultivarRaw === 'all' ? '' : cultivarRaw
  const selects: TeaSelectsState = { kind, origin: region, cultivar: cultivarId }
  const applySelects = (next: TeaSelectsState) => { setKindRaw(next.kind); setRegionRaw(next.origin); setCultivarRaw(next.cultivar) }
  // 分類の値（茶類IDでもアイテムIDでもよい）から大分類を引く
  const filterKindCategory = (kindValue: string): string => (kindValue ? teaComboCategoryOf(kindValue) : '')
  const isItemValue = (v: string) => v !== '' && !!teaById(v) && v !== filterKindCategory(v)
  const profilesFor = (f: TeaListFilters) => teaItems.filter((t) =>
    matches(f.q, [t.name, ...t.searchNames])
    && (f.kind === '' || (isItemValue(f.kind) ? t.id === f.kind : t.kindId === f.kind))
    && (f.region === '' || TEA_ITEM_REGIONS[t.id] === teaOriginCountryOfValue(f.region))
    && (f.cultivarId === '' || cultivarsForKind(t.kindId).includes(f.cultivarId)))
  const cultivarsFor = (f: TeaListFilters) => teaCultivars.filter((c) =>
    matches(f.q, [c.name, c.originalName ?? '', ...c.aliases])
    && (f.kind === '' || usesForCultivar(c.id).some((u) => kindCategoryOf(u.kindId) === filterKindCategory(f.kind)))
    && (f.region === '' || c.country === teaOriginCountryOfValue(f.region))
    && (f.cultivarId === '' || c.id === f.cultivarId))
  const regionsFor = (f: TeaListFilters) => teaRegions.filter((r) =>
    matches(f.q, [r.name, r.country, r.parentName ?? ''])
    && (f.kind === '' || r.applicableKindIds.includes(filterKindCategory(f.kind)))
    && (f.region === '' || (f.region.startsWith('region:') ? r.id === f.region.slice('region:'.length) : r.country === f.region))
    && (f.cultivarId === '' || teaCultivarById(f.cultivarId)?.country === r.country))
  // 3軸のうち1つでも指定があれば、プルダウンの直下にその組み合わせのフレーバーを出す
  // （第5弾・要件6：部分指定対応。分類が未指定の場合は completeTeaComboSel が
  //  成立する分類を補完し、補完したことをプレビューに明示する）
  const previewCompleted = (kind !== '' || region !== '' || cultivarId !== '')
    ? completeTeaComboSel({ kindId: kind, regionId: teaOriginComboRegionIdOfValue(region), cultivarId })
    : null
  const previewSel: TeaComboSel | null = previewCompleted?.sel ?? null
  const previewAnalysis = previewSel ? analyzeTeaCombo(previewSel) : null
  const previewNote = previewCompleted?.assumedKind && previewSel
    ? `分類は未指定のため、${teaKindName(previewSel.kindId)}として表示しています`
    : undefined
  const current: TeaListFilters = { q, kind, region, cultivarId }
  const shownProfiles = [...profilesFor(current)].sort((a, b) => KIND_ORDER.indexOf(a.kindId) - KIND_ORDER.indexOf(b.kindId))
  const cultivars = cultivarsFor(current)
  const regions = regionsFor(current)
  const empty = shownProfiles.length + cultivars.length + regions.length === 0
  return (
    <div>
      <h2>お茶を調べる</h2>
      <input className="search" type="search" placeholder="名前・別名・産地で探す（例：烏龍茶、煎茶）" value={q} onChange={(e) => setQ(e.target.value)} aria-label="お茶を検索" />
      <section className="filter-hero" role="group" aria-label="条件で絞り込み">
        <h3 className="filter-hero-title"><TeaLeafIcon className="hero-icon tea" />分類・産地・品種で探す</h3>
        <div className="filter-grid cols-3">
          <TeaComboSelects value={selects} onChange={applySelects} variant="hero"
            labels={{ kind: '分類（茶類）で絞り込み', origin: '産地で絞り込み', cultivar: '品種で絞り込み' }}
            heads={{
              kind: <><TeaLeafIcon className="filter-icon tea" />分類（茶類）</>,
              origin: <><MapPinIcon className="filter-icon pin" />産地</>,
              cultivar: <><SproutIcon className="filter-icon sprout" />品種</>,
            }} />
        </div>
      </section>
      {previewAnalysis && previewSel && <ComboPreview analysis={previewAnalysis} path={teaComboPath(previewSel)} note={previewNote} />}
      {empty && !previewAnalysis && <p className="unknown-box">見つかりませんでした。条件に合う項目がありません（収録範囲外のお茶かもしれません）。</p>}
      {shownProfiles.length > 0 && <>
        <h3>プロファイル（茶類・製法）</h3>
        <ul className="item-list">
          {shownProfiles.map((t) => (
            <li key={t.id}><button className="item-card" onClick={() => go(`tea/${t.id}`)}>
              <span className="card-icon" style={{ background: KIND_COLOR[kindCategoryOf(t.kindId)] ?? '#7fb069' }}><TeaLeafIcon /></span>
              <span className="item-name">{t.name}</span>
              <span className="card-badges"><span className="badge">プロファイル</span> <span className="badge">{LEVEL_LABEL[t.evidenceLevel]}</span></span>
            </button></li>
          ))}
        </ul>
      </>}
      {regions.length > 0 && <>
        <h3>産地（地域）</h3>
        <ul className="item-list">
          {regions.map((r) => (
            <li key={r.id}><button className="item-card" onClick={() => go(teaComboPath({ kindId: r.applicableKindIds[0], regionId: r.id, cultivarId: '' }))}>
              <span className="card-icon" style={{ background: '#c98a5e' }}><MapPinIcon /></span>
              <span className="item-name">{r.name}</span>
              <span className="card-badges"><span className="badge">産地（地域）</span> <span className="badge">{r.country}</span> <span className="badge">{SCIENCE_LABEL[r.verification.science]}</span></span>
            </button></li>
          ))}
        </ul>
      </>}
      {cultivars.length > 0 && <>
        <h3>品種・系統</h3>
        <ul className="item-list">
          {cultivars.map((c) => (
            <li key={c.id}><button className="item-card" onClick={() => go(`cultivar/${c.id}`)}>
              <span className="card-icon" style={{ background: '#8aa864' }}><SproutIcon /></span>
              <span className="item-name">{c.name}</span>
              <span className="card-badges"><span className="badge">{RANK_LABEL[c.rank]}</span> <span className="badge">{c.country}</span> <span className="badge">{SCIENCE_LABEL[c.verification.science]}</span></span>
            </button></li>
          ))}
        </ul>
      </>}
      <p className="note-small">条件は組み合わせて絞り込めます（すべて満たすものだけを表示）。プルダウンは「組み合わせる」画面と共通で、存在しない組み合わせになる選択肢は出ません（品種×茶類の確認記録と、品種の国と産地の国の一致で判定します）。産地は国全体か、文献で所見のある地域まで選べます。産地が特定できないプロファイルは、産地を選ぶと結果に出ません。産地（地域）のカードからは、その地域の組み合わせページへ進めます。</p>
      <details className="kinds-note"><summary>収録していない呼称について</summary>
        {teaKinds.filter((k) => k.category === 'form').map((k) => <p key={k.id}><strong>{k.name}</strong>：{k.note}</p>)}
      </details>
    </div>
  )
}

function TeaDetail({ id, saved, toggleFav, addHistory }: { id: string; saved: SavedData; toggleFav: (k: 'teas', id: string) => void; addHistory: (k: 'teas', id: string) => void }) {
  const tea = teaById(id)
  useEffect(() => { if (tea) addHistory('teas', tea.id) }, [id])
  if (!tea) return <p className="unknown-box">そのお茶は収録されていません。</p>
  const fav = saved.favorites.teas.includes(tea.id)
  const harmony = recommend(tea.profile, chocolateItems, 'harmony')
  const contrast = recommend(tea.profile, chocolateItems, 'contrast')
  const teaCategory = kindCategoryOf(tea.kindId)
  const kindCultivars = teaCultivars.filter((c) => usesForCultivar(c.id).some((u) => kindCategoryOf(u.kindId) === teaCategory))
  return (
    <div>
      <BackButton fallback="tea" />
      <h2>{tea.name} <button className="fav-btn" aria-pressed={fav} onClick={() => toggleFav('teas', tea.id)}>{fav ? '★ お気に入り' : '☆ お気に入り'}</button></h2>
      <p><span className="badge">{LEVEL_LABEL[tea.evidenceLevel]}</span></p>
      <ProfileView profile={tea.profile} scopeNote={tea.scopeNote} sourceIds={tea.sourceIds} context={{ side: 'tea', kindId: tea.kindId, itemName: tea.name, itemId: tea.id }} />
      {kindCultivars.length > 0 && <>
        <h3>この茶類で確認済みの品種・系統</h3>
        <p className="note-small">公的資料・研究で組み合わせが確認できている品種だけを示します。品種ごとに確認済みの茶類は品種ページで確認できます。</p>
        <div className="filter-row">{kindCultivars.map((c) => <button key={c.id} className="chip" onClick={() => go(`cultivar/${c.id}`)}>{c.name}</button>)}</div>
      </>}
      <h3>組み合わせの候補を探す</h3>
      <p className="note-small">相性の良し悪しではなく、香味の共通・対比からの探索の手がかりです。</p>
      <h4>調和型の候補（共通する香り）</h4>
      <div className="filter-row">{harmony.map((c) => <button key={c.id} className="chip" onClick={() => go(`pair`)}>{c.name}</button>)}</div>
      <h4>対比型の候補（異なる香り）</h4>
      <div className="filter-row">{contrast.map((c) => <button key={c.id} className="chip" onClick={() => go(`pair`)}>{c.name}</button>)}</div>
    </div>
  )
}

type LineageSel = { layer: CacaoLayer; id: string }
type ChocoListFilters = { q: string; kind: string; originId: string; lineage: LineageSel | null }
function ChocoList() {
  const [q, setQ] = useState('')
  const [kindRaw, setKindRaw] = usePersistedState('pairing.chocoList.kind', 'all')
  const [originRaw, setOriginRaw] = usePersistedState('pairing.chocoList.originId', 'all')
  const [lineageRaw, setLineageRaw] = usePersistedState<unknown>('pairing.chocoList.lineage', 'all')
  // プルダウンの値の約束は「組み合わせる」画面と共通（ComboSelectors）：
  // '' = 指定なし、分類は種類IDかアイテムID、系統は '<layer>:<id>'。
  // 旧形式（'all' / {layer, id} オブジェクト）で保存された値は読み替える。
  const kind = kindRaw === 'all' ? '' : kindRaw
  const originId = originRaw === 'all' ? '' : originRaw
  const lineageValue = lineageRaw === 'all' || lineageRaw == null ? ''
    : typeof lineageRaw === 'string' ? lineageRaw
    : `${(lineageRaw as LineageSel).layer}:${(lineageRaw as LineageSel).id}`
  const lineage: LineageSel | null = lineageValue
    ? (() => { const [layer, id] = lineageValue.split(':') as [CacaoLayer, string]; return { layer, id } })()
    : null
  const selects: ChocoSelectsState = { kind, origin: originId, lineage: lineageValue }
  const applySelects = (next: ChocoSelectsState) => { setKindRaw(next.kind); setOriginRaw(next.origin); setLineageRaw(next.lineage) }
  const isItemValue = (v: string) => v !== '' && !!chocolateById(v)
  const profilesFor = (f: ChocoListFilters) => chocolateItems.filter((c) =>
    matches(f.q, [c.name, ...c.searchNames])
    && (f.kind === '' || (isItemValue(f.kind) ? c.id === f.kind : c.kind === f.kind))
    && f.originId === ''
    && f.lineage === null)
  const originsFor = (f: ChocoListFilters) => cacaoOrigins.filter((o) =>
    f.kind === ''
    && matches(f.q, [o.name, o.country, ...o.regions.map((r) => r.name), ...o.tradeNames.map((t) => t.name)])
    && (f.originId === '' || o.id === f.originId)
    // 選んだ産地そのものは、系統との記録上の結びつきが無くても結果から消さない
    && (f.lineage === null || o.id === f.originId || originsForLineage(f.lineage.layer, f.lineage.id).some((x) => x.id === o.id)))
  const lineagesFor = (f: ChocoListFilters): { traditional: typeof cacaoTraditionalGroups; genetic: typeof cacaoGeneticGroups; clones: typeof cacaoClones } => {
    if (f.kind !== '') return { traditional: [], genetic: [], clones: [] }
    const origin = f.originId === '' ? undefined : cacaoOriginById(f.originId)
    const inOrigin = (layer: CacaoLayer, id: string) => !origin
      || (layer === 'traditional' ? origin.relatedTraditionalIds.includes(id)
        : layer === 'genetic' ? origin.relatedGeneticGroupIds.includes(id) || origin.tradeNames.some((t) => t.linkedGeneticGroupId === id)
        : origin.relatedCloneIds.includes(id))
    const pick = <T extends { id: string }>(list: T[], layer: CacaoLayer) => list.filter((e) =>
      (f.lineage === null || (f.lineage.layer === layer && f.lineage.id === e.id))
      // 選んだ系統そのものは、産地との記録上の結びつきが無くても結果から消さない
      && (inOrigin(layer, e.id) || (f.lineage !== null && f.lineage.layer === layer && f.lineage.id === e.id)))
    return {
      traditional: pick(cacaoTraditionalGroups, 'traditional').filter((g) => matches(f.q, [g.name, g.nameJa, ...g.aliases])),
      genetic: pick(cacaoGeneticGroups, 'genetic').filter((g) => matches(f.q, [g.name, ...g.aliases])),
      clones: pick(cacaoClones, 'clone').filter((c) => matches(f.q, [c.name, ...c.aliases])),
    }
  }
  const lineageCountOf = (f: ChocoListFilters) => { const l = lineagesFor(f); return l.traditional.length + l.genetic.length + l.clones.length }
  const current: ChocoListFilters = { q, kind, originId, lineage }
  const profiles = profilesFor(current)
  const origins = originsFor(current)
  const lineageEntities = lineagesFor(current)
  const lineageCount = lineageCountOf(current)
  const empty = profiles.length + origins.length + lineageCount === 0
  // 3軸のうち1つでも指定があれば、プルダウンの直下にその組み合わせのフレーバーを出す
  // （第5弾・要件6：部分指定対応。種類が未指定の場合は completeChocoComboSel が補完する）
  const chocoPreviewCompleted = (kind !== '' || originId !== '' || lineage !== null)
    ? completeChocoComboSel({ kind: kind === '' ? '' : (isItemValue(kind) ? chocolateById(kind)!.kind : kind), originId, lineage })
    : null
  const chocoPreviewSel: ChocoComboSel | null = chocoPreviewCompleted?.sel ?? null
  const chocoPreviewAnalysis = chocoPreviewSel ? analyzeChocoCombo(chocoPreviewSel) : null
  const chocoPreviewNote = chocoPreviewCompleted?.assumedKind && chocoPreviewSel
    ? `種類は未指定のため、${CHOCO_KIND_LABEL[chocoPreviewSel.kind] ?? chocoPreviewSel.kind}チョコレートとして表示しています`
    : undefined
  return (
    <div>
      <h2>チョコを調べる</h2>
      <input className="search" type="search" placeholder="名前・種類・産地で探す（例：ダーク、ベネズエラ）" value={q} onChange={(e) => setQ(e.target.value)} aria-label="チョコレートを検索" />
      <section className="filter-hero" role="group" aria-label="条件で絞り込み">
        <h3 className="filter-hero-title"><ChocoBarIcon className="hero-icon choco" />分類・産地・系統で探す</h3>
        <div className="filter-grid cols-3">
          <ChocoComboSelects value={selects} onChange={applySelects} variant="hero"
            labels={{ kind: '分類（種類）で絞り込み', origin: '産地で絞り込み', cultivar: '系統で絞り込み' }}
            heads={{
              kind: <><ChocoBarIcon className="filter-icon choco" />分類（種類）</>,
              origin: <><CacaoPodIcon className="filter-icon pin" />産地</>,
              cultivar: <><LineageIcon className="filter-icon lineage" />系統</>,
            }} />
        </div>
      </section>
      {chocoPreviewAnalysis && chocoPreviewSel && <ComboPreview analysis={chocoPreviewAnalysis} path={chocoComboPath(chocoPreviewSel)} note={chocoPreviewNote} />}
      {empty && !chocoPreviewAnalysis && <p className="unknown-box">見つかりませんでした。条件に合う項目がありません（収録範囲外のチョコレートかもしれません）。</p>}
      {profiles.length > 0 && <>
        <h3>プロファイル（種類・製法）</h3>
        <ul className="item-list">
          {profiles.map((c) => (
            <li key={c.id}><button className="item-card" onClick={() => go(`choco/${c.id}`)}>
              <span className="card-icon" style={{ background: CHOCO_KIND_COLOR[c.kind] }}><ChocoBarIcon /></span>
              <span className="item-name">{c.name}</span>
              <span className="card-badges"><span className="badge">プロファイル</span> <span className="badge">{LEVEL_LABEL[c.evidenceLevel]}</span></span>
            </button></li>
          ))}
        </ul>
      </>}
      {origins.length > 0 && <>
        <h3>産地</h3>
        <ul className="item-list">
          {origins.map((o) => (
            <li key={o.id}><button className="item-card" onClick={() => go(`origin/${o.id}`)}>
              <span className="card-icon" style={{ background: '#b08968' }}><CacaoPodIcon /></span>
              <span className="item-name">{o.name}</span>
              <span className="card-badges"><span className="badge">産地</span> <span className="badge">{SCIENCE_LABEL[o.verification.science]}</span></span>
            </button></li>
          ))}
        </ul>
      </>}
      {lineageCount > 0 && <>
        <h3>系統</h3>
        <ul className="item-list">
          {lineageEntities.traditional.map((g) => (
            <li key={g.id}><button className="item-card" onClick={() => go('cacao/traditional/' + g.id)}>
              <span className="card-icon" style={{ background: '#8d7b68' }}><LineageIcon /></span>
              <span className="item-name">{g.nameJa}（{g.name}）</span>
              <span className="card-badges"><span className="badge">{CACAO_LAYER_LABEL.traditional}</span> <span className="badge">{SCIENCE_LABEL[g.verification.science]}</span></span>
            </button></li>
          ))}
          {lineageEntities.genetic.map((g) => (
            <li key={g.id}><button className="item-card" onClick={() => go('cacao/genetic/' + g.id)}>
              <span className="card-icon" style={{ background: '#8d7b68' }}><LineageIcon /></span>
              <span className="item-name">{g.nameJa}（{g.name}）</span>
              <span className="card-badges"><span className="badge">遺伝的分類</span> <span className="badge">{SCIENCE_LABEL[g.verification.science]}</span></span>
            </button></li>
          ))}
          {lineageEntities.clones.map((c) => (
            <li key={c.id}><button className="item-card" onClick={() => go('cacao/clone/' + c.id)}>
              <span className="card-icon" style={{ background: '#8d7b68' }}><LineageIcon /></span>
              <span className="item-name">{c.name}</span>
              <span className="card-badges"><span className="badge">{CACAO_LAYER_LABEL.clone}</span> <span className="badge">{SCIENCE_LABEL[c.verification.science]}</span></span>
            </button></li>
          ))}
        </ul>
      </>}
      <p className="note-small">条件は組み合わせて絞り込めます（すべて満たすものだけを表示）。プルダウンは「組み合わせる」画面と共通です。チョコレートは種類・産地・系統を相互に制限しないため、存在する組み合わせは必ず選べます（例外はクローンで、記録のある産地だけが選択肢に出ます）。プロファイルは種類レベルの情報で産地・系統を持たないため、産地や系統を選ぶと結果に出ません。</p>
    </div>
  )
}

function ChocoDetail({ id, saved, toggleFav, addHistory }: { id: string; saved: SavedData; toggleFav: (k: 'chocolates', id: string) => void; addHistory: (k: 'chocolates', id: string) => void }) {
  const choco = chocolateById(id)
  useEffect(() => { if (choco) addHistory('chocolates', choco.id) }, [id])
  if (!choco) return <p className="unknown-box">そのチョコレートは収録されていません。</p>
  const fav = saved.favorites.chocolates.includes(choco.id)
  const harmony = recommend(choco.profile, teaItems, 'harmony')
  return (
    <div>
      <BackButton fallback="choco" />
      <h2>{choco.name} <button className="fav-btn" aria-pressed={fav} onClick={() => toggleFav('chocolates', choco.id)}>{fav ? '★ お気に入り' : '☆ お気に入り'}</button></h2>
      <p><span className="badge">{LEVEL_LABEL[choco.evidenceLevel]}</span></p>
      <ProfileView profile={choco.profile} scopeNote={choco.scopeNote} sourceIds={choco.sourceIds} context={{ side: 'chocolate', kindId: choco.kind, itemName: choco.name, itemId: choco.id }} />
      <h3>産地・系統から調べる</h3>
      <p className="note-small">このプロファイルは種類・製法レベルの情報で、特定の産地や系統の味を示すものではありません。原料の産地や系統が表示されている製品については、各ページで確認できている科学データの範囲を確認できます。産地は品種ではなく、産地と系統は多対多の関係にあります。</p>
      <h4>産地</h4>
      <div className="filter-row">{cacaoOrigins.map((o) => <button key={o.id} className="chip" onClick={() => go(`origin/${o.id}`)}>{o.name}</button>)}</div>
      <h4>系統</h4>
      <div className="filter-row">
        {cacaoTraditionalGroups.map((g) => <button key={g.id} className="chip" onClick={() => go('cacao/traditional/' + g.id)}>{g.nameJa}（{g.name}）</button>)}
        {cacaoGeneticGroups.map((g) => <button key={g.id} className="chip" onClick={() => go('cacao/genetic/' + g.id)}>{g.nameJa}（{g.name}）</button>)}
        {cacaoClones.map((c) => <button key={c.id} className="chip" onClick={() => go('cacao/clone/' + c.id)}>{c.name}</button>)}
      </div>
      {choco.profile.aromas.length > 0 && <>
        <h3>組み合わせの候補（調和型）</h3>
        <div className="filter-row">{harmony.map((t) => <button key={t.id} className="chip" onClick={() => go('pair')}>{t.name}</button>)}</div>
      </>}
    </div>
  )
}

function CharacterBasis({ c }: { c: PairingCharacter }) {
  return (
    <>
      {c.basisCompoundIds.length > 0 && <p className="note-small">根拠の成分：{c.basisCompoundIds.map((id) => compoundById(id)?.name ?? id).join('、')}</p>}
      {c.basisNoteIds.length > 0 && <p className="note-small">根拠の香り：{c.basisNoteIds.map((id) => noteById(id)?.name ?? id).join('、')}</p>}
      {c.basisTasteKeys.length > 0 && <p className="note-small">根拠の味覚：{c.basisTasteKeys.map((k) => TASTE_LABELS[k]).join('、')}</p>}
      {c.basisRuleIds.length > 0 && <p className="note-small">根拠の相互作用：{c.basisRuleIds.map((r) => CHARACTER_RULE_LABELS[r] ?? r).join('、')}</p>}
    </>
  )
}

function InteractionGroup({ title, items }: { title: string; items: InteractionStatement[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <h4>{title}</h4>
      {items.map((s, i) => (
        <div className="temporal-card" key={`${s.ruleId}-${i}`}>
          <p><span className="badge">{LEVEL_LABEL[s.level]}</span>{s.usesInference && <> <span className="badge badge-inferred">推測を含む</span></>}</p>
          <p>{s.text}</p>
          <SourceLinks ids={s.sourceIds} />
        </div>
      ))}
    </div>
  )
}

// ===== 組み合わせる画面（第9弾：自家ブレンド対応） =====
// 両側それぞれが種別（お茶／チョコ）を持ち、見出しのボタンで切り替えられる。
// 各側の選択は種別ごとに保持し、切り替えて戻しても選択が残る。
type PairSideType = 'tea' | 'chocolate'
type CacaoSel = { layer: CacaoLayer; id: string }
const PAIR_TYPE_NAME: Record<PairSideType, string> = { tea: 'お茶', chocolate: 'チョコレート' }

interface ResolvedPairSide {
  item?: TeaItem | ChocolateItem
  sel: TeaComboSel | ChocoComboSel | null
}

/** お茶側の選択（分類・産地・品種）から土台アイテムと組み合わせ選択を決める。
 *  分類が未指定でも産地・品種の指定があれば、成立する分類を補完する（第5弾・要件6）。 */
function resolveTeaPairSide(kindValue: string, origin: string, cultivarId: string): ResolvedPairSide {
  const originComboId = teaOriginComboRegionIdOfValue(origin)
  const completed = !kindValue && (origin || cultivarId)
    ? completeTeaComboSel({ kindId: '', regionId: originComboId, cultivarId })
    : null
  const item = kindValue ? teaComboBaseItem(kindValue)
    : completed ? teaComboBaseItem(completed.sel.kindId) : undefined
  const sel: TeaComboSel | null = completed ? completed.sel
    : item && (origin || cultivarId || TEA_COMBO_KINDS.includes(kindValue))
      ? { kindId: kindValue, regionId: originComboId, cultivarId }
      : null
  return { item, sel }
}

/** チョコ側の選択（種類・産地・系統）から土台アイテムと組み合わせ選択を決める（同上）。 */
function resolveChocoPairSide(kindValue: string, originId: string, cacaoSel: CacaoSel | null): ResolvedPairSide {
  const completed = !kindValue && (originId || cacaoSel)
    ? completeChocoComboSel({ kind: '', originId, lineage: cacaoSel })
    : null
  const item = kindValue ? (chocolateById(kindValue) ?? chocoRepresentativeItem(kindValue))
    : completed ? chocoRepresentativeItem(completed.sel.kind) : undefined
  const sel: ChocoComboSel | null = completed ? completed.sel
    : item && (originId || cacaoSel || CHOCO_COMBO_KINDS.includes(kindValue))
      ? { kind: (item as ChocolateItem).kind, originId, lineage: cacaoSel }
      : null
  return { item, sel }
}

/** 画面の1側分の表示モデル */
interface PairSideView {
  pos: 'left' | 'right'
  posJa: '左' | '右'
  type: PairSideType
  item?: TeaItem | ChocolateItem
  /** 組み合わせ分析を適用したアイテム（ホイールの土台） */
  appliedItem?: TeaItem | ChocolateItem
  analysis: ComboAnalysis | null
  title: string
}

function PairPage({ saved, toggleFav, addHistory }: { saved: SavedData; toggleFav: (k: 'pairings', id: string) => void; addHistory: (k: 'pairings', id: string) => void }) {
  // 選択は「調べる」画面と共通の3軸プルダウン（ComboSelectors）で持つ。
  // 分類の値は茶類・種類ID（大分類）かアイテムID（具体的なお茶・チョコ）で、
  // 大分類を選んだ場合は組み合わせエンジンと同じ代表アイテムをペア対象にする。
  // 第9弾: 両側が種別を持ち、各側の選択は種別ごとに保持する。
  // 既定の並び（左チョコ・右お茶）と従来の選択は、旧キーからの読み替えで引き継ぐ。
  const defaultTeaKindValue = () => teaItems.find((t) => t.id === 'oolong-tea')?.id ?? teaItems[0].id
  const [leftType, setLeftType] = usePersistedState<PairSideType>('pairing.pair.leftType', 'chocolate')
  const [rightType, setRightType] = usePersistedState<PairSideType>('pairing.pair.rightType', 'tea')
  const [leftTeaKind, setLeftTeaKind] = usePersistedState('pairing.pair.left.teaKind', defaultTeaKindValue)
  const [leftTeaOrigin, setLeftTeaOrigin] = usePersistedState('pairing.pair.left.teaOrigin', '')
  const [leftTeaCultivar, setLeftTeaCultivar] = usePersistedState('pairing.pair.left.cultivarId', '')
  const [leftChocoKind, setLeftChocoKind] = usePersistedState('pairing.pair.left.chocoKind', () => readPersisted('pairing.pair.chocoSel', chocolateItems[0].id))
  const [leftChocoOrigin, setLeftChocoOrigin] = usePersistedState('pairing.pair.left.originId', () => readPersisted('pairing.pair.originId', ''))
  const [leftCacaoSel, setLeftCacaoSel] = usePersistedState<CacaoSel | null>('pairing.pair.left.cacaoSel', () => readPersisted<CacaoSel | null>('pairing.pair.cacaoSel', null))
  const [rightTeaKind, setRightTeaKind] = usePersistedState('pairing.pair.right.teaKind', () => readPersisted('pairing.pair.teaSel', defaultTeaKindValue()))
  const [rightTeaOrigin, setRightTeaOrigin] = usePersistedState('pairing.pair.right.teaOrigin', () => readPersisted('pairing.pair.teaOrigin', ''))
  const [rightTeaCultivar, setRightTeaCultivar] = usePersistedState('pairing.pair.right.cultivarId', () => readPersisted('pairing.pair.cultivarId', ''))
  const [rightChocoKind, setRightChocoKind] = usePersistedState('pairing.pair.right.chocoKind', chocolateItems[0].id)
  const [rightChocoOrigin, setRightChocoOrigin] = usePersistedState('pairing.pair.right.originId', '')
  const [rightCacaoSel, setRightCacaoSel] = usePersistedState<CacaoSel | null>('pairing.pair.right.cacaoSel', null)
  const [tab, setTab] = useState<'a' | 'b' | 'pair'>('pair')
  const [pairNote, setPairNote] = useState<string | null>(null)
  const [pairCat, setPairCat] = useState<string | null>(null)

  interface SideCfg {
    pos: 'left' | 'right'
    posJa: '左' | '右'
    type: PairSideType
    setType: (t: PairSideType) => void
    tea: { kind: string; origin: string; cultivar: string }
    choco: { kind: string; origin: string; cacaoSel: CacaoSel | null }
    applyTea: (next: TeaSelectsState) => void
    applyChoco: (next: ChocoSelectsState) => void
    resolved: ResolvedPairSide
  }
  const applyChocoOf = (
    setKind: (v: string) => void, setOrigin: (v: string) => void, setSel: (v: CacaoSel | null) => void,
  ) => (next: ChocoSelectsState) => {
    setKind(next.kind)
    setOrigin(next.origin)
    if (!next.lineage) setSel(null)
    else { const [layer, id] = next.lineage.split(':') as [CacaoLayer, string]; setSel({ layer, id }) }
  }
  const sideCfgs: SideCfg[] = [
    {
      pos: 'left', posJa: '左', type: leftType, setType: setLeftType,
      tea: { kind: leftTeaKind, origin: leftTeaOrigin, cultivar: leftTeaCultivar },
      choco: { kind: leftChocoKind, origin: leftChocoOrigin, cacaoSel: leftCacaoSel },
      applyTea: (next) => { setLeftTeaKind(next.kind); setLeftTeaOrigin(next.origin); setLeftTeaCultivar(next.cultivar) },
      applyChoco: applyChocoOf(setLeftChocoKind, setLeftChocoOrigin, setLeftCacaoSel),
      resolved: leftType === 'tea'
        ? resolveTeaPairSide(leftTeaKind, leftTeaOrigin, leftTeaCultivar)
        : resolveChocoPairSide(leftChocoKind, leftChocoOrigin, leftCacaoSel),
    },
    {
      pos: 'right', posJa: '右', type: rightType, setType: setRightType,
      tea: { kind: rightTeaKind, origin: rightTeaOrigin, cultivar: rightTeaCultivar },
      choco: { kind: rightChocoKind, origin: rightChocoOrigin, cacaoSel: rightCacaoSel },
      applyTea: (next) => { setRightTeaKind(next.kind); setRightTeaOrigin(next.origin); setRightTeaCultivar(next.cultivar) },
      applyChoco: applyChocoOf(setRightChocoKind, setRightChocoOrigin, setRightCacaoSel),
      resolved: rightType === 'tea'
        ? resolveTeaPairSide(rightTeaKind, rightTeaOrigin, rightTeaCultivar)
        : resolveChocoPairSide(rightChocoKind, rightChocoOrigin, rightCacaoSel),
    },
  ]
  const [leftCfg, rightCfg] = sideCfgs
  const sameType = leftType === rightType
  // 課題C（2026-10-31）: 産地・品種・系統が指定された側は、素のプロファイルではなく
  // 組み合わせ分析（第2層・軸効果適用後）のノート集合をペアリング（第3層）の入力にする。
  const assembly = leftCfg.resolved.item && rightCfg.resolved.item
    ? assembleBlend(
      { type: leftType, item: leftCfg.resolved.item, sel: leftCfg.resolved.sel },
      { type: rightType, item: rightCfg.resolved.item, sel: rightCfg.resolved.sel })
    : null
  const sideViewOf = (cfg: SideCfg, blendSide: BlendSideResult | undefined): PairSideView => ({
    pos: cfg.pos,
    posJa: cfg.posJa,
    type: cfg.type,
    item: cfg.resolved.item,
    appliedItem: blendSide?.item ?? cfg.resolved.item,
    analysis: blendSide?.analysis ?? null,
    title: blendSide?.analysis ? blendSide.analysis.title : (cfg.resolved.item?.name ?? ''),
  })
  const leftView = sideViewOf(leftCfg, assembly?.a)
  const rightView = sideViewOf(rightCfg, assembly?.b)
  const bothSelected = !!(leftView.item && rightView.item)
  const result = assembly?.result ?? null
  const interactions = assembly?.interactions ?? null
  const characters = assembly?.characters ?? null
  const allCharacters = characters ? [...characters.aroma, ...characters.tasteMouthfeel] : []
  const [charSel, setCharSel] = useState<string | null>(null)
  const selCharacter = allCharacters.find((c) => c.id === charSel) ?? null
  // 品種・系統・産地の指定についての文脈ノート（側ごと・種別ごとに組み立てる）。
  // 品種の追加指定は、組み合わせとして存在するものだけが選択肢に出る（ComboSelectors が担保）。
  interface SideNote { heading: string; note: PairingContextNote }
  const sideNotesOf = (cfg: SideCfg): SideNote[] => {
    const item = cfg.resolved.item
    if (!item) return []
    const out: SideNote[] = []
    if (cfg.type === 'tea') {
      const kindId = (item as TeaItem).kindId
      const cultivar = cfg.tea.cultivar ? teaCultivarById(cfg.tea.cultivar) : undefined
      if (cultivar) out.push({ heading: `お茶の品種：${cultivar.name}`, note: teaCultivarPairingNote(cultivar, kindId) })
      if (cfg.tea.origin) {
        const regionEntity = cfg.tea.origin.startsWith('region:') ? teaRegionById(cfg.tea.origin.slice('region:'.length)) : undefined
        const note = regionEntity ? teaRegionPairingNote(regionEntity, kindId) : teaOriginPairingNote(cfg.tea.origin, kindId)
        out.push({ heading: `お茶の産地：${teaOriginLabelOfValue(cfg.tea.origin)}`, note })
      }
    } else {
      const sel = cfg.choco.cacaoSel
      const entity = sel
        ? (sel.layer === 'traditional' ? traditionalGroupById(sel.id) : sel.layer === 'genetic' ? geneticGroupById(sel.id) : cacaoCloneById(sel.id))
        : undefined
      if (sel && entity) {
        // 系統名の表示はカタカナを主表記にする（伝統的分類・遺伝的分類）。クローンは記号名のまま。
        const displayName = 'nameJa' in entity && entity.nameJa ? `${entity.nameJa}（${entity.name}）` : entity.name
        out.push({ heading: `カカオの系統：${displayName}`, note: cacaoPairingNote(sel.layer, { ...entity, name: displayName }) })
      }
      const origin = cfg.choco.origin ? cacaoOriginById(cfg.choco.origin) : undefined
      if (origin) out.push({ heading: `カカオの産地：${origin.name}`, note: cacaoOriginPairingNote(origin) })
    }
    return out
  }
  const sideNotes = [...sideNotesOf(leftCfg), ...sideNotesOf(rightCfg)]
  const pairId = bothSelected
    ? pairIdOf({ type: leftType, id: leftView.item!.id }, { type: rightType, id: rightView.item!.id })
    : ''
  useEffect(() => { if (pairId) addHistory('pairings', pairId) }, [pairId])
  useEffect(() => { setCharSel(null) }, [pairId])
  // ※タブ切り替えではスクロールしない（その場で内容だけが切り替わる）。
  //   以前はタブ変更のたびに先頭へスクロールする不具合があった（2026-10-31 指示9）。
  const fav = saved.favorites.pairings.includes(pairId)
  // タブ: 異種ペアでは従来どおり「お茶」「チョコ」の順。同種ペアでは側ごとのアイテム名で区別する。
  const teaView = leftType === 'tea' ? leftView : rightView
  const chocoView = leftType === 'chocolate' ? leftView : rightView
  const tabSides: { key: 'a' | 'b'; label: string; view: PairSideView }[] = sameType
    ? [
      { key: 'a', label: leftView.item?.name ?? '左', view: leftView },
      { key: 'b', label: rightView.item?.name ?? '右', view: rightView },
    ]
    : [
      { key: teaView.pos === 'left' ? 'a' : 'b', label: 'お茶', view: teaView },
      { key: chocoView.pos === 'left' ? 'a' : 'b', label: 'チョコ', view: chocoView },
    ]
  const activeView = tab === 'a' ? leftView : tab === 'b' ? rightView : null
  const axisLabelOf = (v: PairSideView) => (sameType ? `${PAIR_TYPE_NAME[v.type]}（${v.posJa}）` : v.type === 'tea' ? 'お茶' : 'チョコ')
  // 成分パネルの側の順序は、異種ペアでは従来どおり（お茶，チョコレート）
  const compoundSideOf = (v: PairSideView): PairCompoundSide => ({
    label: PAIR_TYPE_NAME[v.type],
    side: v.type,
    // 未選択の側では使われない（パネルは両側選択時のみ開く）が、算出自体は安全にする
    kindId: !v.item ? '' : v.type === 'tea' ? (v.item as TeaItem).kindId : (v.item as ChocolateItem).kind,
  })
  const pairCompoundSides = (sameType ? [leftView, rightView] : [teaView, chocoView]).map(compoundSideOf) as [PairCompoundSide, PairCompoundSide]
  return (
    <div>
      <h2>組み合わせる</h2>
      <div className="pair-layout">
        {sideCfgs.map((cfg) => {
          const typeName = PAIR_TYPE_NAME[cfg.type]
          const otherName = PAIR_TYPE_NAME[cfg.type === 'tea' ? 'chocolate' : 'tea']
          // 同種同士では、両側のプルダウンのラベルを左右で区別する
          const suffix = sameType ? `${cfg.posJa}：` : ''
          return (
            <div className="pair-col" key={cfg.pos}>
              <h3 className="col-head">
                <button type="button" className="col-head-switch" onClick={() => cfg.setType(cfg.type === 'tea' ? 'chocolate' : 'tea')}
                  aria-label={`${cfg.posJa}の種類を切り替える（現在：${typeName}）`} title="タップでお茶とチョコレートを切り替え">
                  {cfg.type === 'tea' ? <TeaCupIcon className="col-icon tea" /> : <ChocoBarIcon className="col-icon choco" />}
                  <span className="col-head-name">{typeName}</span>
                  <span className="col-head-switch-hint">⇄ {otherName}に切替</span>
                </button>
              </h3>
              {cfg.type === 'chocolate' ? (
                <ChocoComboSelects value={{ kind: cfg.choco.kind, origin: cfg.choco.origin, lineage: cfg.choco.cacaoSel ? `${cfg.choco.cacaoSel.layer}:${cfg.choco.cacaoSel.id}` : '' }} onChange={cfg.applyChoco} variant="pair" emptyKindLabel="選んでください"
                  labels={{ kind: `${suffix}チョコレート`, origin: `${suffix}カカオの産地（任意）`, cultivar: `${suffix}カカオの系統（任意）` }}
                  heads={{ kind: '分類（種類）', origin: '産地（任意）', cultivar: '系統（任意）' }} />
              ) : (
                <TeaComboSelects value={{ kind: cfg.tea.kind, origin: cfg.tea.origin, cultivar: cfg.tea.cultivar }} onChange={cfg.applyTea} variant="pair" emptyKindLabel="選んでください"
                  labels={{ kind: `${suffix}お茶`, origin: `${suffix}お茶の産地（任意）`, cultivar: `${suffix}お茶の品種（任意）` }}
                  heads={{ kind: '分類（茶類）', origin: '産地（任意）', cultivar: '品種（任意）' }} />
              )}
            </div>
          )
        })}
      </div>
      <section className="pair-summary" aria-live="polite" aria-label="組み合わせの結果（要約）">
        {bothSelected && result ? (
          <>
            <div className="pair-summary-head">
              <h3>{leftView.title} × {rightView.title}</h3>
            </div>
            <p className="pair-summary-line"><span className="badge">{LEVEL_LABEL[result.level]}</span></p>
            {sameType && (
              <p className="pair-summary-line note-small">{PAIR_TYPE_NAME[leftType]}同士のブレンドを直接調べた官能研究は確認できていないため、この結果は両者のプロファイルと一般的な味覚・嗅覚の機序からの推測です。</p>
            )}
            {(leftView.analysis || rightView.analysis) && (
              <p className="pair-summary-line note-small">指定した産地・品種・系統は、組み合わせの推測（第2層）としてこの結果の土台になっています{[leftView, rightView].map((v) => v.analysis ? <span key={v.pos}>／{axisLabelOf(v)}：<span className="badge">{COMBO_LEVEL_LABEL[v.analysis.overallLevel]}</span></span> : null)}</p>
            )}
            {characters && (allCharacters.length > 0 ? (
              <div className="pair-character">
                <p className="pair-character-head"><strong>組み合わせの味わい（推測）</strong> <span className="badge badge-inferred">推測（未検証）</span></p>
                <div className="filter-row">
                  {allCharacters.map((c) => (
                    <button key={c.id} className="chip" aria-expanded={charSel === c.id} onClick={() => setCharSel(charSel === c.id ? null : c.id)}>{c.label}</button>
                  ))}
                </div>
                {selCharacter && (
                  <div className="pair-character-detail">
                    <p><strong>{selCharacter.label}</strong> <span className="badge badge-inferred">推測（未検証）</span></p>
                    <p>{selCharacter.rationale}</p>
                    <CharacterBasis c={selCharacter} />
                    <SourceLinks ids={selCharacter.sourceIds} />
                  </div>
                )}
              </div>
            ) : (
              <p className="pair-summary-line note-small">組み合わせの味わいの推測は、根拠のある条件が揃わないため表示できません。</p>
            ))}
            {result.sharedNotes.length > 0 && <p className="pair-summary-line">共通する香り：{result.sharedNotes.slice(0, 3).map((s) => s.name).join('、')}{result.sharedNotes.length > 3 ? ' ほか' : ''}</p>}
            {result.sharedCategories.length > 0 && <p className="pair-summary-line">同じ分類の香り：{result.sharedCategories.slice(0, 3).map((s) => categoryById(s.categoryId)?.name ?? s.categoryId).join('、')}{result.sharedCategories.length > 3 ? ' ほか' : ''}</p>}
            {result.contrasts.length > 0 && <p className="pair-summary-line">対比する特徴：{[...new Set(result.contrasts.map((c) => c.label))].slice(0, 2).join('／')}</p>}
            {result.sharedNotes.length === 0 && result.sharedCategories.length === 0 && result.contrasts.length === 0 && <p className="pair-summary-line">{result.message}</p>}
          </>
        ) : (
          <p className="pair-summary-line">{leftView.item || rightView.item ? 'もう一方を選ぶと結果が出ます。' : '両方を選ぶと、ここに結果が出ます。'}</p>
        )}
      </section>
      {bothSelected && result && (<>
      <div className="tabs" role="tablist" aria-label="ホイールの切り替え">
        {tabSides.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
        <button role="tab" aria-selected={tab === 'pair'} onClick={() => setTab('pair')}>組み合わせの見方</button>
      </div>
      {activeView && (activeView.analysis
        ? <ComboWheelPanel notes={activeView.analysis.notes} tastes={activeView.analysis.tastes} context={activeView.analysis.context} resetKey={`${activeView.pos}:${activeView.analysis.title}`} />
        : activeView.item && <ProfileWheelPanel profile={activeView.item.profile} context={{ side: activeView.type, kindId: activeView.type === 'tea' ? (activeView.item as TeaItem).kindId : (activeView.item as ChocolateItem).kind, itemName: activeView.item.name, itemId: activeView.item.id }} />)}
      {tab === 'pair' && (
        <section>
          <p><span className="badge">{LEVEL_LABEL[result.level]}</span></p>
          <p>{result.message}</p>
          {result.sharedNotes.length > 0 && <>
            <h3>共通する香り（調和の候補）</h3>
            <p className="note-small">香りを押すと、その香りに関係する成分を、両側に分けて確認できます。</p>
            <div className="filter-row">{result.sharedNotes.map((s) => <button key={s.noteId} className="chip" onClick={() => { setPairNote(s.noteId); setPairCat(null) }}>{s.name}の成分を見る</button>)}</div>
          </>}
          {result.sharedCategories.length > 0 && <>
            <h3>同じ分類の香り</h3>
            <p className="note-small">分類が似ているだけの共通点です。同じ成分が確認されているわけではありません。</p>
            <div className="filter-row">{result.sharedCategories.map((s) => <button key={s.categoryId} className="chip" onClick={() => { setPairCat(s.categoryId); setPairNote(null) }}>{categoryById(s.categoryId)?.name ?? s.categoryId}</button>)}</div>
          </>}
          {result.contrasts.length > 0 && <>
            <h3>対比する特徴（対比の候補）</h3>
            {result.contrasts.map((c, i) => <div className="temporal-card" key={i}><h4>{c.label}</h4><p>{c.detail}</p>
              {c.noteId && <button className="chip" onClick={() => { setPairNote(c.noteId as string); setPairCat(null) }}>{noteById(c.noteId)?.name ?? c.noteId}の成分を見る</button>}
            </div>)}
          </>}
          {pairNote && <PairNoteCompounds noteId={pairNote} sides={pairCompoundSides} />}
          {pairCat && <PairCategoryCompounds categoryId={pairCat} profiles={[leftView.appliedItem!.profile, rightView.appliedItem!.profile]} onPickNote={(id) => { setPairNote(id); setPairCat(null) }} />}
          {characters && allCharacters.length > 0 && <>
            <h3>組み合わせの味わいの性格（推測）</h3>
            <p className="note-small">両アイテムで確認されている成分・香味・味覚の顔ぶれと、下記の相互作用の発火状況から、組み合わせ全体がどのような味わいになるかを推測したものです。根拠のある性格だけを示し、根拠のない性格は出しません。推測の方法と限界は調査記録（docs/research/pairing-character-inference.md）にあります。</p>
            {allCharacters.map((c) => (
              <div className="temporal-card" key={c.id}>
                <p><strong>{c.label}</strong> <span className="badge badge-inferred">推測（未検証）</span></p>
                <p>{c.rationale}</p>
                <CharacterBasis c={c} />
                <SourceLinks ids={c.sourceIds} />
              </div>
            ))}
          </>}
          {interactions && <>
            <h3>相互作用の観点から</h3>
            <p className="note-small">香りと味は、口の中で出会うと互いの感じ方を変えることが知られています（香りが甘味を際立たせる、甘味が苦味や渋味を抑える、脂肪が渋味を和らげる等）。以下は、文献で裏付けられた相互作用の一般原理を、この組み合わせの収録データに当てはめたものです。この組み合わせ自体を官能評価した研究ではないため、各文に根拠の区分を付けています。根拠と限界の詳細は調査記録（docs/research/pairing-interactions.md）にあります。</p>
            {hasAnyInteraction(interactions) ? <>
              <InteractionGroup title="香りの相互作用" items={interactions.aroma} />
              <InteractionGroup title="味の感じ方の変化" items={interactions.taste} />
              <InteractionGroup title="口当たり・余韻の変化" items={interactions.mouthfeel} />
            </> : (
              <p className="unknown-box">相互作用の観点では、現在の収録データで示せる特記事項はありません。これは相性が悪いという意味ではなく、根拠のある相互作用の条件がデータ上で揃っていないという意味です。</p>
            )}
          </>}
          {(leftView.analysis || rightView.analysis) && <>
            <h3>指定した軸の反映（組み合わせの推測）</h3>
            <p className="note-small">産地・品種・系統の指定は、組み合わせページと同じ組み合わせ分析（第2層）を通じてこの結果の土台になっています。各軸がホイール・味覚にどう反映されたか（または反映されなかった理由）は以下のとおりです。両側のタブのホイールも、この組み合わせの推測と一致しています。</p>
            {[leftView, rightView].map((v) => v.analysis && (
              <div className="temporal-card" key={v.pos}>
                <h4>{axisLabelOf(v)}：{v.analysis.title}</h4>
                <p><span className="badge">{COMBO_LEVEL_LABEL[v.analysis.overallLevel]}</span></p>
                {v.analysis.axisSummaries.map((s, i) => <p key={i}>{s.text}</p>)}
              </div>
            ))}
          </>}
          {sideNotes.length > 0 && <>
            <h3>品種・系統・産地の指定について</h3>
            {sideNotes.map((sn, i) => (
              <div className="temporal-card" key={`${sn.heading}-${i}`}>
                <h4>{sn.heading}</h4>
                <p><span className="badge">{DATA_LEVEL_LABEL[sn.note.level]}</span></p>
                <p>{sn.note.text}</p>
                <FindingsList findings={sn.note.findings} />
              </div>
            ))}
          </>}
          <h3>食べる・飲む順序について（一般的な知見）</h3>
          {sameType ? (
            <p>連続して食べたり飲んだりすると、前のものの影響で後のものの時間的な感じ方が変わることが、チーズとワインの研究で示されています（チーズでワインの渋みの持続が短くなった例など）。{PAIR_TYPE_NAME[leftType]}同士のブレンドでも、味わう順序や交互に味わうことで感じ方が変わる可能性はありますが、特定の組み合わせでどう変わるかを示した研究はないため、ここでは一般的な注意としてのみ記します。</p>
          ) : (
            <p>連続して食べたり飲んだりすると、前のものの影響で後のものの時間的な感じ方が変わることが、チーズとワインの研究で示されています（チーズでワインの渋みの持続が短くなった例など）。お茶とチョコレートの組み合わせでも順序で感じ方が変わる可能性はありますが、特定の組み合わせでどう変わるかを示した研究はないため、ここでは一般的な注意としてのみ記します。</p>
          )}
          <SourceLinks ids={['galmarini-2016-cheese-wine-tds', 'galmarini-2017-sequence-temporal']} />
          <SourceLinks ids={['spence-2020-flavour-pairing']} />
        </section>
      )}
      <div className="pair-save-row">
        <button className="fav-btn pair-save-btn" aria-pressed={fav} onClick={() => toggleFav('pairings', pairId)}>{fav ? '★ 保存済み' : '☆ この組み合わせを保存'}</button>
      </div>
      </>)}
      <details className="pair-notes">
        <summary>指定と見方についての注記</summary>
        <p className="note-small">系統・産地は、原料が分かっている場合だけ指定してください。科学データがない場合は、その旨を示して見方には使いません。お茶の産地・品種も同じです。</p>
        <p className="note-small">各側の見出しを押すと、その側をお茶とチョコレートの間で切り替えられます。お茶同士・チョコ同士の組み合わせ（自家ブレンド）も選べますが、同種同士のブレンドを直接調べた官能研究は確認できていないため、結果は両者のプロファイルと一般的な味覚・嗅覚の機序からの推測として表示します。切り替えた側の選択は種別ごとに保持され、元に戻すと復元されます。</p>
        <p className="note-small">プルダウンは「調べる」画面と共通で、存在しない組み合わせになる選択肢は出ません。お茶は品種×茶類の確認記録と品種・産地の国の一致で判定し、チョコレートは種類・産地・系統を相互に制限しません（例外はクローンで、記録のある産地だけが選択肢に出ます）。お茶の産地は、国全体か、文献で所見のある地域（県・省などの単位）まで選べます。選択を変えて両立しなくなった指定は、自動で「指定しない」に戻ります。</p>
        <p className="note-small">要約の「組み合わせの味わい（推測）」は、両アイテムで確認されている成分・味覚の顔ぶれと、文献に基づく相互作用から推測した「味わいの性格」です。組み合わせ自体を実測したものではありません。性格の名前を押すと根拠が見えます。</p>
        <p className="note-small">組み合わせ後のホイールは、香りを足し算して作ることはしません。共通点と対比に加え、文献に基づく相互作用の一般原理の範囲で、感じ方の変化の可能性を示します。</p>
      </details>
    </div>
  )
}

function ComparePage() {
  const [a, setA] = useState(teaItems[1].id); const [b, setB] = useState(teaItems[7].id)
  const [sel, setSel] = useState<{ noteId: string; side: 'a' | 'b' } | null>(null)
  const ta = teaById(a)!; const tb = teaById(b)!
  return (
    <div>
      <h2>茶類・製法の比較</h2>
      <section className="temporal-card">
        <h3>同じ生葉から作った6つの茶（原著研究）</h3>
        <p>同一品種・同一地域の生葉を6茶類にモデル製造した研究では、揮発性成分の総濃度は 紅茶が最も高く（710 µg/g）、緑茶が最も低い（20 µg/g）結果で、順序は 紅茶 ＞ 白茶 ＞ 烏龍茶 ＞ 黒茶 ＞ 黄茶 ＞ 緑茶 でした。これは総量の比較で、香りの良し悪しではありません。</p>
        <SourceLinks ids={['feng-2019-six-processes']} />
      </section>
      <div className="pair-selects">
        <label>比べるお茶 1 <select value={a} onChange={(e) => setA(e.target.value)}>{teaItems.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
        <label>比べるお茶 2 <select value={b} onChange={(e) => setB(e.target.value)}>{teaItems.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
      </div>
      <div className="compare-grid">
        <div><h3>{ta.name}</h3><FlavorWheel profile={ta.profile} onSelectNote={(id) => setSel({ noteId: id, side: 'a' })} /></div>
        <div><h3>{tb.name}</h3><FlavorWheel profile={tb.profile} onSelectNote={(id) => setSel({ noteId: id, side: 'b' })} /></div>
      </div>
      {sel && (
        <CollapsibleSheet resetKey={`${sel.side}:${sel.noteId}`} title={noteById(sel.noteId)?.name ?? sel.noteId} onDismiss={() => setSel(null)}>
          <NoteDetail noteId={sel.noteId} profile={sel.side === 'a' ? ta.profile : tb.profile}
            context={{ side: 'tea', kindId: (sel.side === 'a' ? ta : tb).kindId, itemName: (sel.side === 'a' ? ta : tb).name, itemId: (sel.side === 'a' ? ta : tb).id }} />
        </CollapsibleSheet>
      )}
      <p className="note-small">各ホイールは総説に基づく茶類・製法レベルの一般的特徴です。異なる品種・条件の試料では、違いが製法だけによるものとは限りません。</p>
    </div>
  )
}

function SavedPage({ saved, setSaved }: { saved: SavedData; setSaved: (d: SavedData) => void }) {
  const [error, setError] = useState('')
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(saved, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'pairing-saved.json'; a.click(); URL.revokeObjectURL(a.href)
  }
  const importJson = (f: File) => {
    f.text().then((t) => { try { setSaved(validateSaved(JSON.parse(t))); setError('') } catch (e) { setError(`読み込めませんでした：${e instanceof Error ? e.message : '不明なエラー'}`) } }).catch(() => setError('ファイルを読み取れませんでした'))
  }
  const nameOf = (kind: string, id: string) => {
    if (kind === 'teas') return teaById(id)?.name ?? id
    if (kind === 'chocolates') return chocolateById(id)?.name ?? id
    // 組み合わせは種別つきID（旧形式はお茶×チョコとして解釈）から名前を引く
    const ref = parsePairId(id)
    if (!ref) return id.replace('+', ' × ')
    const nm = (s: { type: 'tea' | 'chocolate'; id: string }) => (s.type === 'tea' ? teaById(s.id)?.name : chocolateById(s.id)?.name) ?? s.id
    return ref.a.type === ref.b.type
      ? `${nm(ref.a)}（${PAIR_TYPE_NAME[ref.a.type]}） × ${nm(ref.b)}（${PAIR_TYPE_NAME[ref.b.type]}）`
      : `${nm(ref.a)} × ${nm(ref.b)}`
  }
  const Section = ({ title, kind, ids }: { title: string; kind: string; ids: string[] }) => (
    <section><h3>{title}</h3>{ids.length === 0 ? <p className="note-small">まだありません。</p> : <ul>{ids.map((id) => <li key={id}>{nameOf(kind, id)}</li>)}</ul>}</section>
  )
  return (
    <div>
      <h2>お気に入り・履歴</h2>
      <Section title="お気に入りのお茶" kind="teas" ids={saved.favorites.teas} />
      <Section title="お気に入りのチョコ" kind="chocolates" ids={saved.favorites.chocolates} />
      <Section title="お気に入りの組み合わせ" kind="pairings" ids={saved.favorites.pairings} />
      <Section title="最近調べたお茶" kind="teas" ids={saved.history.teas} />
      <Section title="最近調べたチョコ" kind="chocolates" ids={saved.history.chocolates} />
      <Section title="最近試した組み合わせ" kind="pairings" ids={saved.history.pairings} />
      <h3>データの書き出し・復元</h3>
      <button className="btn" onClick={exportJson}>JSONで書き出す</button>
      <label className="btn file-btn">JSONを読み込む<input type="file" accept="application/json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) importJson(f) }} /></label>
      {error && <p className="unknown-box" role="alert">{error}</p>}
      <p className="note-small">保存はこの端末の中だけです。アカウント登録はありません。</p>
    </div>
  )
}

function CompoundsPage({ highlightId }: { highlightId?: string }) {
  const [q, setQ] = useState('')
  const shown = compounds.filter((c) => {
    if (!q.trim()) return true
    const hay = [c.name, ...c.aliases, c.detectedIn, ...c.noteIds.map((n) => noteById(n)?.name ?? n),
      ...(c.tasteLinks ?? []).map((l) => (l.taste === 'sweet' ? '甘味' : l.taste === 'sour' ? '酸味' : l.taste === 'bitter' ? '苦味' : l.taste === 'astringent' ? '渋味' : 'うま味'))]
    return matches(q, hay)
  })
  useEffect(() => {
    if (highlightId) document.getElementById(`compound-${highlightId}`)?.scrollIntoView?.()
  }, [highlightId])
  return (
    <div>
      <h2>成分一覧</h2>
      <p>香味や味に寄与することが研究で示された化学成分です。「検出された」ことと「香り・味に寄与する」ことは分けて記録しています。香り・味の記述がない成分は、その旨を明記しています。成分名・別名・香味名・味の名前で探せます（成分→香味・食品の逆引き）。</p>
      <input className="search" type="search" placeholder="成分・香味・味で探す（例：リナロール、青草・若葉、苦味）" value={q} onChange={(e) => setQ(e.target.value)} aria-label="成分を検索" />
      {shown.length === 0 && <p className="unknown-box">見つかりませんでした。根拠が確認できない成分は登録していないため、収録範囲外かもしれません。</p>}
      {shown.map((c) => (
        <article className={highlightId === c.id ? 'temporal-card compound-highlight' : 'temporal-card'} key={c.id} id={`compound-${c.id}`}>
          <CompoundCard compound={c} />
          {highlightId === c.id && <p className="note-small">品種・系統の図鑑から参照された成分です。</p>}
        </article>
      ))}
    </div>
  )
}

function SourcesPage() {
  return (
    <div>
      <h2>出典・論文一覧</h2>
      <p>表示している香味データは、以下の検証済み論文の範囲に基づきます（2026-10-30 確認）。論文の文章や図表は転載していません。</p>
      <article className="temporal-card">
        <h3>香味の時間変化について</h3>
        <p>香りや味が時間とともにどう移ろうかは、TDS（時間的優位性評価）や TI（時間強度）といった方法で研究されています。チョコレートでは時間的に優位な属性が製品で異なること（Jager et al. 2014）、産地の異なるビターチョコレートで甘味の持続に差があること（石川ら 2019）、緑茶では香りを嗅ぐ段階でも優位な香りが移ろうこと（Qiu et al. 2025）が報告され、時間的に優位な属性が甘味の感じ方自体を変えうることも示されています（Khemacheevakul et al. 2021）。</p>
        <p>ただし、個別のアイテムごとの時間プロファイルを示した研究はまだ乏しいため、このアプリでは原則として「情報不足」としています（鳳凰単叢のカップアロマ＝余韻のみ、原著に基づいて表示しています）。</p>
        <p>一部のアイテムでは、検証済みの一般原理（チョコレートの融解、渋みの積み上がり、脂肪と香りの持続など）から考えられる経過を「推測（未検証）」と明示して併記しています。実測データとは分けて表示しています。</p>
        <p>温度も感じ方を変えます。甘味に関わる味覚チャネル TRPM5 は温度が高いほど応答が強まるため（Talavera et al. 2005）、お茶が冷めていく過程では甘味の感じ方が変わっていく可能性があります（一般原理からの説明で、特定のお茶の実測ではありません）。また烏龍茶では、煎を重ねるごとに香りが漸減することが実測されています（Yang et al. 2025、武夷岩茶）。</p>
        <SourceLinks ids={['talavera-2005-trpm5-temperature', 'yang-2025-gongfu-infusions']} />
      </article>
      <article className="temporal-card">
        <h3>花・果物の具体名の「推測」について</h3>
        <p>「花様」「トロピカル」「果実全般」のように具体名のない香りについては、そのアイテム（またはその茶類・種類の試料）で実際に確認されている香気成分の顔ぶれと、各成分について出典で確認済みの香りの記述から、具体的な花・果物への類似を「推測（未検証）」と明示して併記している場合があります。実測でその花・果物と確認されたものではなく、根拠に使った成分と推論の過程は各ノートの詳細に示しています。具体名の香り記述の一部に記事・データベース等の参考情報を含む場合は、その旨を明記しています。推測の方法と、推測を付けなかった項目の理由は調査記録（docs/research/floral-fruit-inference.md）にまとめています。</p>
      </article>
      <article className="temporal-card">
        <h3>組み合わせの「味わいの性格」の推測について</h3>
        <p>組み合わせ画面の「組み合わせの味わい（推測）」は、両アイテムで確認されている成分・香味・味覚の顔ぶれと、文献に基づく相互作用（甘味が渋味を和らげる、渋味と脂肪が互いを和らげる等）の発火状況から、組み合わせ全体がどのような味わい（アーシー、スパイシー、まろやか、コクがある等）になるかを推測したものです。根拠（成分・香り・味覚・相互作用）を必ず併記し、根拠のない性格は表示しません。成分の量を足し算して予測するものではなく、組み合わせ自体を官能評価した実測でもありません。「コク」の知覚については、コク味物質とカルシウム感知受容体の研究（Ohsu et al. 2010）を概念の根拠にしています。推測の方法と限界は調査記録（docs/research/pairing-character-inference.md）にまとめています。</p>
      </article>
      {sources.map((s) => (
        <article className="temporal-card" key={s.id}>
          <h3>{s.title}</h3>
          <p>{s.authors}（{s.year}）{s.journal ?? ''}</p>
          <p>{s.scope}</p>
          <p className="note-small">種別：{s.kind === 'original' ? '原著論文' : s.kind === 'review' ? 'レビュー論文' : s.kind === 'manufacturer' ? 'メーカー資料（参考情報）' : '公的・一般資料'}／ライセンス：{s.license}</p>
          <a href={s.url} target="_blank" rel="noreferrer">{s.doi ? `DOI: ${s.doi}` : '出典ページを開く'}</a>
        </article>
      ))}
    </div>
  )
}
