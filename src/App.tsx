import { useEffect, useMemo, useState } from 'react'
import { teaItems, teaKinds, teaById } from './data/teas'
import { chocolateItems, chocolateById } from './data/chocolates'
import { sources } from './data/sources'
import ProfileView, { LEVEL_LABEL, SourceLinks } from './components/ProfileView'
import FlavorWheel from './components/FlavorWheel'
import { analyzePairing, recommend } from './engine/pairing'
import { analyzeInteractions, hasAnyInteraction } from './engine/interactions'
import type { InteractionStatement } from './types'
import { categoryById } from './data/flavors'
import { loadSaved, persistSaved, pushHistory, validateSaved, type SavedData } from './storage'
import { go, scrollTop } from './nav'
import NoteDetail from './components/NoteDetail'
import { CollapsibleSheet } from './components/Sheet'
import CompoundCard from './components/CompoundCard'
import { PairNoteCompounds, PairCategoryCompounds } from './components/PairCompounds'
import { compounds } from './data/compounds'
import { noteById } from './data/flavors'
import { CultivarsPage, TeaCultivarDetail, CacaoDetail, OriginDetail, RANK_LABEL } from './components/CultivarPages'
import CultivarComparePage from './components/CultivarCompare'
import { teaCultivarById, cultivarsForKind, teaCultivars, usesForCultivar } from './data/cultivars'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones, traditionalGroupById, geneticGroupById, cacaoCloneById } from './data/cacao'
import { cacaoOrigins, cacaoOriginById, originsForLineage } from './data/origins'
import { teaCultivarPairingNote, cacaoPairingNote, cacaoOriginPairingNote, teaOriginPairingNote, teaOriginCountries, DATA_LEVEL_LABEL, CACAO_LAYER_LABEL, type CacaoLayer } from './engine/pairingContext'
import { FindingsList, SCIENCE_LABEL } from './components/EntityViews'
import { TeaLeafIcon, TeaCupIcon, MapPinIcon, SproutIcon, CacaoPodIcon, ChocoBarIcon, LineageIcon, PercentIcon } from './components/icons'
import type { ChocolateKind } from './types'

type Route = { name: string; id?: string; sub?: string }
const KNOWN_ROUTES = ['home', 'tea', 'choco', 'pair', 'compare', 'saved', 'sources', 'compounds', 'cultivars', 'cultivar', 'cacao', 'compare-cultivars', 'origin']
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
          <button onClick={() => go('saved')}>お気に入り・履歴</button>
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
      </main>
      <footer className="app-footer">
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
const CHOCO_KIND_LABEL: Record<ChocolateKind, string> = {
  dark: 'ダーク', milk: 'ミルク', white: 'ホワイト', ruby: 'ルビー', blond: 'ブロンド', other: 'その他',
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
function TeaList() {
  const [q, setQ] = useState('')
  const [kind, setKind] = useState('all')
  const [region, setRegion] = useState('all')
  const [cultivarId, setCultivarId] = useState('all')
  const regionOptions = useMemo(
    () => [...new Set([...teaCultivars.map((c) => c.country), ...Object.values(TEA_ITEM_REGIONS)])],
    [])
  const profiles = useMemo(() => teaItems.filter((t) =>
    matches(q, [t.name, ...t.searchNames])
    && (kind === 'all' || t.kindId === kind)
    && (region === 'all' || TEA_ITEM_REGIONS[t.id] === region)
    && (cultivarId === 'all' || cultivarsForKind(t.kindId).includes(cultivarId))), [q, kind, region, cultivarId])
  const shownProfiles = [...profiles].sort((a, b) => KIND_ORDER.indexOf(a.kindId) - KIND_ORDER.indexOf(b.kindId))
  const cultivars = useMemo(() => teaCultivars.filter((c) =>
    matches(q, [c.name, c.originalName ?? '', ...c.aliases])
    && (kind === 'all' || usesForCultivar(c.id).some((u) => kindCategoryOf(u.kindId) === kind))
    && (region === 'all' || c.country === region)
    && (cultivarId === 'all' || c.id === cultivarId)), [q, kind, region, cultivarId])
  const empty = shownProfiles.length + cultivars.length === 0
  return (
    <div>
      <h2>お茶を調べる</h2>
      <input className="search" type="search" placeholder="名前・別名・産地で探す（例：烏龍茶、煎茶）" value={q} onChange={(e) => setQ(e.target.value)} aria-label="お茶を検索" />
      <section className="filter-hero" role="group" aria-label="条件で絞り込み">
        <h3 className="filter-hero-title"><TeaLeafIcon className="hero-icon tea" />分類・産地・品種で探す</h3>
        <div className="filter-grid cols-3">
          <label className="filter-field">
            <span className="filter-label"><TeaLeafIcon className="filter-icon tea" />分類（茶類）</span>
            <select className="big-select" value={kind} onChange={(e) => setKind(e.target.value)} aria-label="分類（茶類）で絞り込み">
              <option value="all">すべて</option>
              {teaKinds.filter((k) => k.category !== 'form').map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span className="filter-label"><MapPinIcon className="filter-icon pin" />産地</span>
            <select className="big-select" value={region} onChange={(e) => setRegion(e.target.value)} aria-label="産地で絞り込み">
              <option value="all">すべて</option>
              {regionOptions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span className="filter-label"><SproutIcon className="filter-icon sprout" />品種</span>
            <select className="big-select" value={cultivarId} onChange={(e) => setCultivarId(e.target.value)} aria-label="品種で絞り込み">
              <option value="all">すべて</option>
              {teaCultivars.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>
        <p className="note-small">条件は組み合わせて絞り込めます（すべて満たすものだけを表示）。産地が特定できないプロファイルは、産地を選ぶと結果に出ません。</p>
      </section>
      {empty && <p className="unknown-box">見つかりませんでした。条件に合う項目がありません（収録範囲外のお茶かもしれません）。</p>}
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
      <button className="btn ghost" onClick={() => go('tea')}>← 一覧へ</button>
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
function ChocoList() {
  const [q, setQ] = useState('')
  const [kind, setKind] = useState('all')
  const [percent, setPercent] = useState('')
  const [originId, setOriginId] = useState('all')
  const [lineage, setLineage] = useState<'all' | LineageSel>('all')
  const lineageValue = lineage === 'all' ? 'all' : `${lineage.layer}:${lineage.id}`
  const pickLineage = (v: string) => {
    if (v === 'all') { setLineage('all'); return }
    const [layer, id] = v.split(':') as [CacaoLayer, string]
    setLineage({ layer, id })
  }
  const baseFilters = kind === 'all' && percent === ''
  const profiles = useMemo(() => chocolateItems.filter((c) =>
    matches(q, [c.name, ...c.searchNames])
    && (kind === 'all' || c.kind === kind)
    && (percent === '' || c.cacaoPercent === Number(percent))
    && originId === 'all'
    && lineage === 'all'), [q, kind, percent, originId, lineage])
  const origins = useMemo(() => cacaoOrigins.filter((o) =>
    baseFilters
    && matches(q, [o.name, o.country, ...o.regions.map((r) => r.name), ...o.tradeNames.map((t) => t.name)])
    && (originId === 'all' || o.id === originId)
    && (lineage === 'all' || originsForLineage(lineage.layer, lineage.id).some((x) => x.id === o.id))), [q, baseFilters, originId, lineage])
  const lineageEntities = useMemo<{ traditional: typeof cacaoTraditionalGroups; genetic: typeof cacaoGeneticGroups; clones: typeof cacaoClones }>(() => {
    if (!baseFilters) return { traditional: [], genetic: [], clones: [] }
    const origin = originId === 'all' ? undefined : cacaoOriginById(originId)
    const inOrigin = (layer: CacaoLayer, id: string) => !origin
      || (layer === 'traditional' ? origin.relatedTraditionalIds.includes(id)
        : layer === 'genetic' ? origin.relatedGeneticGroupIds.includes(id) || origin.tradeNames.some((t) => t.linkedGeneticGroupId === id)
        : origin.relatedCloneIds.includes(id))
    const pick = <T extends { id: string }>(list: T[], layer: CacaoLayer) => list.filter((e) =>
      (lineage === 'all' || (lineage.layer === layer && lineage.id === e.id)) && inOrigin(layer, e.id))
    return {
      traditional: pick(cacaoTraditionalGroups, 'traditional').filter((g) => matches(q, [g.name, g.nameJa, ...g.aliases])),
      genetic: pick(cacaoGeneticGroups, 'genetic').filter((g) => matches(q, [g.name, ...g.aliases])),
      clones: pick(cacaoClones, 'clone').filter((c) => matches(q, [c.name, ...c.aliases])),
    }
  }, [q, baseFilters, originId, lineage])
  const lineageCount = lineageEntities.traditional.length + lineageEntities.genetic.length + lineageEntities.clones.length
  const empty = profiles.length + origins.length + lineageCount === 0
  return (
    <div>
      <h2>チョコを調べる</h2>
      <input className="search" type="search" placeholder="名前・種類・産地で探す（例：ダーク、ベネズエラ）" value={q} onChange={(e) => setQ(e.target.value)} aria-label="チョコレートを検索" />
      <section className="filter-hero" role="group" aria-label="条件で絞り込み">
        <h3 className="filter-hero-title"><ChocoBarIcon className="hero-icon choco" />分類・産地・系統で探す</h3>
        <div className="filter-grid cols-4">
          <label className="filter-field">
            <span className="filter-label"><ChocoBarIcon className="filter-icon choco" />分類（種類）</span>
            <select className="big-select" value={kind} onChange={(e) => setKind(e.target.value)} aria-label="分類（種類）で絞り込み">
              <option value="all">すべて</option>
              {(Object.keys(CHOCO_KIND_LABEL) as ChocolateKind[]).filter((k) => chocolateItems.some((c) => c.kind === k)).map((k) => <option key={k} value={k}>{CHOCO_KIND_LABEL[k]}</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span className="filter-label"><CacaoPodIcon className="filter-icon pin" />産地</span>
            <select className="big-select" value={originId} onChange={(e) => setOriginId(e.target.value)} aria-label="産地で絞り込み">
              <option value="all">すべて</option>
              {cacaoOrigins.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span className="filter-label"><LineageIcon className="filter-icon lineage" />系統</span>
            <select className="big-select" value={lineageValue} onChange={(e) => pickLineage(e.target.value)} aria-label="系統で絞り込み">
              <option value="all">すべて</option>
              <optgroup label="伝統的分類">
                {cacaoTraditionalGroups.map((g) => <option key={g.id} value={`traditional:${g.id}`}>{g.nameJa}（{g.name}）</option>)}
              </optgroup>
              <optgroup label="遺伝的分類">
                {cacaoGeneticGroups.map((g) => <option key={g.id} value={`genetic:${g.id}`}>{g.nameJa}（{g.name}）</option>)}
              </optgroup>
              <optgroup label="個別クローン">
                {cacaoClones.map((c) => <option key={c.id} value={`clone:${c.id}`}>{c.name}</option>)}
              </optgroup>
            </select>
          </label>
          <label className="filter-field">
            <span className="filter-label"><PercentIcon className="filter-icon percent" />カカオ含有率</span>
            <span className="percent-wrap"><input className="big-input" type="number" min={0} max={100} value={percent} onChange={(e) => setPercent(e.target.value)} placeholder="数値入力" aria-label="カカオ含有率で絞り込み" />%</span>
          </label>
        </div>
        <p className="note-small">条件は組み合わせて絞り込めます（すべて満たすものだけを表示）。プロファイルは種類レベルの情報で産地・系統を持たないため、産地や系統を選ぶと結果に出ません。含有率は、収録データに記録がある場合のみ絞り込めます。含有率だけで甘味・苦味は決まりません。</p>
      </section>
      {empty && <p className="unknown-box">見つかりませんでした。条件に合う項目がありません（収録範囲外のチョコレートかもしれません）。</p>}
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
      <button className="btn ghost" onClick={() => go('choco')}>← 一覧へ</button>
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

function PairPage({ saved, toggleFav, addHistory }: { saved: SavedData; toggleFav: (k: 'pairings', id: string) => void; addHistory: (k: 'pairings', id: string) => void }) {
  const [teaId, setTeaId] = useState(() => teaItems.find((t) => t.id === 'oolong-tea')?.id ?? teaItems[0].id)
  const [teaKindSel, setTeaKindSel] = useState('')
  const [teaOrigin, setTeaOrigin] = useState('')
  const [chocoId, setChocoId] = useState(chocolateItems[0].id)
  const [cultivarId, setCultivarId] = useState('')
  const [cacaoSel, setCacaoSel] = useState<{ layer: CacaoLayer; id: string } | null>(null)
  const [originId, setOriginId] = useState('')
  const [tab, setTab] = useState<'tea' | 'choco' | 'pair'>('pair')
  const [selNote, setSelNote] = useState<string | null>(null)
  const [pairNote, setPairNote] = useState<string | null>(null)
  const [pairCat, setPairCat] = useState<string | null>(null)
  const tea = teaId ? teaById(teaId) : undefined
  const choco = chocoId ? chocolateById(chocoId) : undefined
  const result = tea && choco ? analyzePairing(tea.profile, choco.profile) : null
  const interactions = tea && choco ? analyzeInteractions(tea, choco) : null
  // 品種の追加指定: 選んだお茶の茶類で確認済みの組み合わせがある品種だけを選べる
  const teaKindId = tea?.kindId
  const cultivarOptions = useMemo(() => (teaKindId ? [...new Set(cultivarsForKind(teaKindId))] : []), [teaKindId])
  const effectiveCultivarId = cultivarOptions.includes(cultivarId) ? cultivarId : ''
  const cultivar = effectiveCultivarId ? teaCultivarById(effectiveCultivarId) : undefined
  const teaNote = cultivar && tea ? teaCultivarPairingNote(cultivar, tea.kindId) : null
  const cacaoEntity = cacaoSel
    ? (cacaoSel.layer === 'traditional' ? traditionalGroupById(cacaoSel.id) : cacaoSel.layer === 'genetic' ? geneticGroupById(cacaoSel.id) : cacaoCloneById(cacaoSel.id))
    : undefined
  // 系統名の表示はカタカナを主表記にする（伝統的分類・遺伝的分類）。クローンは記号名のまま。
  const cacaoDisplayName = cacaoEntity
    ? ('nameJa' in cacaoEntity && cacaoEntity.nameJa ? `${cacaoEntity.nameJa}（${cacaoEntity.name}）` : cacaoEntity.name)
    : ''
  const cacaoNote = cacaoSel && cacaoEntity ? cacaoPairingNote(cacaoSel.layer, { ...cacaoEntity, name: cacaoDisplayName }) : null
  const origin = originId ? cacaoOriginById(originId) : undefined
  const originNote = origin ? cacaoOriginPairingNote(origin) : null
  const teaOriginNote = teaOrigin && tea ? teaOriginPairingNote(teaOrigin, tea.kindId) : null
  const lineageValue = cacaoSel ? `${cacaoSel.layer}:${cacaoSel.id}` : ''
  const pickLineage = (v: string) => {
    if (!v) { setCacaoSel(null); return }
    const [layer, id] = v.split(':') as [CacaoLayer, string]
    setCacaoSel({ layer, id })
  }
  const teaOptions = teaKindSel ? teaItems.filter((t) => t.kindId === teaKindSel) : teaItems
  const pickTeaKind = (v: string) => {
    setTeaKindSel(v)
    if (v && teaId && teaById(teaId)?.kindId !== v) setTeaId('')
  }
  const pairId = tea && choco ? `${teaId}+${chocoId}` : ''
  useEffect(() => { if (pairId) addHistory('pairings', pairId) }, [pairId])
  useEffect(() => { scrollTop() }, [tab])
  const fav = saved.favorites.pairings.includes(pairId)
  return (
    <div>
      <h2>組み合わせる</h2>
      <div className="pair-layout">
        <div className="pair-col">
          <h3 className="col-head"><ChocoBarIcon className="col-icon choco" />チョコレート</h3>
          <label>分類（種類） <select value={chocoId} onChange={(e) => setChocoId(e.target.value)} aria-label="チョコレート">
            <option value="">選んでください</option>
            {chocolateItems.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select></label>
          <label>産地（任意） <select value={originId} onChange={(e) => setOriginId(e.target.value)} aria-label="カカオの産地（任意）">
            <option value="">指定しない</option>
            {cacaoOrigins.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select></label>
          <label>系統（任意） <select value={lineageValue} onChange={(e) => pickLineage(e.target.value)} aria-label="カカオの系統（任意）">
            <option value="">指定しない</option>
            <optgroup label="伝統的分類">
              {cacaoTraditionalGroups.map((g) => <option key={g.id} value={`traditional:${g.id}`}>{g.nameJa}（{g.name}）</option>)}
            </optgroup>
            <optgroup label="遺伝的分類">
              {cacaoGeneticGroups.map((g) => <option key={g.id} value={`genetic:${g.id}`}>{g.nameJa}（{g.name}）</option>)}
            </optgroup>
            <optgroup label="個別クローン">
              {cacaoClones.map((c) => <option key={c.id} value={`clone:${c.id}`}>{c.name}</option>)}
            </optgroup>
          </select></label>
          <p className="note-small">系統・産地は原料が分かっている場合だけ指定を。科学データがない場合は、その旨を示して見方には使いません。</p>
        </div>
        <div className="pair-col">
          <h3 className="col-head"><TeaCupIcon className="col-icon tea" />お茶</h3>
          <label>分類（茶類） <select value={teaKindSel} onChange={(e) => pickTeaKind(e.target.value)} aria-label="お茶の分類（茶類）">
            <option value="">すべて</option>
            {teaKinds.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
          </select></label>
          <label>お茶 <select value={teaId} onChange={(e) => setTeaId(e.target.value)} aria-label="お茶">
            <option value="">選んでください</option>
            {teaOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select></label>
          <label>産地（任意） <select value={teaOrigin} onChange={(e) => setTeaOrigin(e.target.value)} aria-label="お茶の産地（任意）">
            <option value="">指定しない</option>
            {teaOriginCountries().map((c) => <option key={c} value={c}>{c}</option>)}
          </select></label>
          <label>品種（任意） <select value={effectiveCultivarId} onChange={(e) => setCultivarId(e.target.value)} aria-label="お茶の品種（任意）">
            <option value="">指定しない</option>
            {cultivarOptions.map((id) => <option key={id} value={id}>{teaCultivarById(id)?.name ?? id}</option>)}
          </select></label>
          <p className="note-small">産地・品種は分かっている場合だけ指定を。科学データがない場合は、その旨を示して見方には使いません。</p>
        </div>
      </div>
      <section className="pair-summary" aria-live="polite" aria-label="組み合わせの結果（要約）">
        {tea && choco && result ? (
          <>
            <div className="pair-summary-head">
              <h3>{choco.name} × {tea.name}</h3>
              <button className="fav-btn" aria-pressed={fav} onClick={() => toggleFav('pairings', pairId)}>{fav ? '★ 保存済み' : '☆ この組み合わせを保存'}</button>
            </div>
            <p className="pair-summary-line"><span className="badge">{LEVEL_LABEL[result.level]}</span></p>
            {result.sharedNotes.length > 0 && <p className="pair-summary-line">共通する香り：{result.sharedNotes.slice(0, 3).map((s) => s.name).join('、')}{result.sharedNotes.length > 3 ? ' ほか' : ''}</p>}
            {result.sharedCategories.length > 0 && <p className="pair-summary-line">同じ分類の香り：{result.sharedCategories.slice(0, 3).map((s) => categoryById(s.categoryId)?.name ?? s.categoryId).join('、')}{result.sharedCategories.length > 3 ? ' ほか' : ''}</p>}
            {result.contrasts.length > 0 && <p className="pair-summary-line">対比する特徴：{[...new Set(result.contrasts.map((c) => c.label))].slice(0, 2).join('／')}</p>}
            {result.sharedNotes.length === 0 && result.sharedCategories.length === 0 && result.contrasts.length === 0 && <p className="pair-summary-line">{result.message}</p>}
          </>
        ) : (
          <p className="pair-summary-line">{tea || choco ? 'もう一方を選ぶと結果が出ます。' : 'お茶とチョコレートを選ぶと、ここに結果が出ます。'}</p>
        )}
      </section>
      {tea && choco && result && (<>
      <div className="tabs" role="tablist" aria-label="ホイールの切り替え">
        <button role="tab" aria-selected={tab === 'tea'} onClick={() => setTab('tea')}>お茶</button>
        <button role="tab" aria-selected={tab === 'choco'} onClick={() => setTab('choco')}>チョコ</button>
        <button role="tab" aria-selected={tab === 'pair'} onClick={() => setTab('pair')}>組み合わせの見方</button>
      </div>
      {tab === 'tea' && <FlavorWheel profile={tea.profile} onSelectNote={setSelNote} />}
      {tab === 'choco' && <FlavorWheel profile={choco.profile} onSelectNote={setSelNote} />}
      {tab !== 'pair' && selNote && (
        <CollapsibleSheet resetKey={`${tab}:${selNote}`} title={noteById(selNote)?.name ?? selNote} onDismiss={() => setSelNote(null)}>
          <NoteDetail noteId={selNote} profile={tab === 'tea' ? tea.profile : choco.profile}
            context={tab === 'tea'
              ? { side: 'tea', kindId: tea.kindId, itemName: tea.name, itemId: tea.id }
              : { side: 'chocolate', kindId: choco.kind, itemName: choco.name, itemId: choco.id }} />
        </CollapsibleSheet>
      )}
      {tab === 'pair' && (
        <section>
          <p><span className="badge">{LEVEL_LABEL[result.level]}</span></p>
          <p>{result.message}</p>
          {result.sharedNotes.length > 0 && <>
            <h3>共通する香り（調和の候補）</h3>
            <p className="note-small">香りを押すと、その香りに関係する成分を、お茶側・チョコレート側に分けて確認できます。</p>
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
          {pairNote && <PairNoteCompounds noteId={pairNote} teaKindId={tea.kindId} chocoKindId={choco.kind} />}
          {pairCat && <PairCategoryCompounds categoryId={pairCat} tea={tea.profile} choco={choco.profile} onPickNote={(id) => { setPairNote(id); setPairCat(null) }} />}
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
          {(teaNote || cacaoNote || originNote || teaOriginNote) && <>
            <h3>品種・系統・産地の指定について</h3>
            {teaNote && cultivar && (
              <div className="temporal-card">
                <h4>お茶の品種：{cultivar.name}</h4>
                <p><span className="badge">{DATA_LEVEL_LABEL[teaNote.level]}</span></p>
                <p>{teaNote.text}</p>
                <FindingsList findings={teaNote.findings} />
              </div>
            )}
            {teaOriginNote && (
              <div className="temporal-card">
                <h4>お茶の産地：{teaOrigin}</h4>
                <p><span className="badge">{DATA_LEVEL_LABEL[teaOriginNote.level]}</span></p>
                <p>{teaOriginNote.text}</p>
                <FindingsList findings={teaOriginNote.findings} />
              </div>
            )}
            {cacaoNote && cacaoEntity && (
              <div className="temporal-card">
                <h4>カカオの系統：{cacaoDisplayName}</h4>
                <p><span className="badge">{DATA_LEVEL_LABEL[cacaoNote.level]}</span></p>
                <p>{cacaoNote.text}</p>
                <FindingsList findings={cacaoNote.findings} />
              </div>
            )}
            {originNote && origin && (
              <div className="temporal-card">
                <h4>カカオの産地：{origin.name}</h4>
                <p><span className="badge">{DATA_LEVEL_LABEL[originNote.level]}</span></p>
                <p>{originNote.text}</p>
                <FindingsList findings={originNote.findings} />
              </div>
            )}
          </>}
          <p className="note-small">組み合わせ後のホイールは、香りを足し算して作ることはしません。共通点と対比に加え、文献に基づく相互作用の一般原理の範囲で、感じ方の変化の可能性を示します。</p>
          <h3>食べる・飲む順序について（一般的な知見）</h3>
          <p>連続して食べたり飲んだりすると、前のものの影響で後のものの時間的な感じ方が変わることが、チーズとワインの研究で示されています（チーズでワインの渋みの持続が短くなった例など）。お茶とチョコレートの組み合わせでも順序で感じ方が変わる可能性はありますが、特定の組み合わせでどう変わるかを示した研究はないため、ここでは一般的な注意としてのみ記します。</p>
          <SourceLinks ids={['galmarini-2016-cheese-wine-tds', 'galmarini-2017-sequence-temporal']} />
          <SourceLinks ids={['spence-2020-flavour-pairing']} />
        </section>
      )}
      </>)}
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
  const nameOf = (kind: string, id: string) => kind === 'teas' ? teaById(id)?.name ?? id : kind === 'chocolates' ? chocolateById(id)?.name ?? id : id.replace('+', ' × ')
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
