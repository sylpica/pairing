import { useEffect, useMemo, useState } from 'react'
import { teaItems, teaKinds, teaById } from './data/teas'
import { chocolateItems, chocolateById } from './data/chocolates'
import { sources } from './data/sources'
import ProfileView, { LEVEL_LABEL, SourceLinks } from './components/ProfileView'
import FlavorWheel from './components/FlavorWheel'
import { analyzePairing, recommend } from './engine/pairing'
import { categoryById } from './data/flavors'
import { loadSaved, persistSaved, pushHistory, validateSaved, type SavedData } from './storage'

type Route = { name: string; id?: string }
const KNOWN_ROUTES = ['home', 'tea', 'choco', 'pair', 'compare', 'saved', 'sources']
function parseRoute(): Route {
  const h = location.hash.replace(/^#\/?/, '')
  const [name, id] = h.split('/')
  return { name: KNOWN_ROUTES.includes(name) ? name : 'home', id }
}
const go = (path: string) => { location.hash = `#/${path}` }
export const scrollTop = () => {
  const reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
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
      </main>
      <footer className="app-footer">
        <button className="linklike" onClick={() => go('compare')}>茶類・製法の比較</button>
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

function useSearch<T extends { name: string; searchNames: string[] }>(items: T[]) {
  const [q, setQ] = useState('')
  const list = useMemo(() => items.filter((i) => matches(q, [i.name, ...i.searchNames])), [q, items])
  return { q, setQ, list }
}

function TeaList() {
  const { q, setQ, list } = useSearch(teaItems)
  const [kind, setKind] = useState('all')
  const shown = kind === 'all' ? list : list.filter((t) => t.kindId === kind)
  return (
    <div>
      <h2>お茶を調べる</h2>
      <input className="search" type="search" placeholder="名前・別名・産地で探す（例：烏龍茶、煎茶）" value={q} onChange={(e) => setQ(e.target.value)} aria-label="お茶を検索" />
      <div className="filter-row" role="group" aria-label="茶類で絞り込み">
        <button className={kind === 'all' ? 'chip active' : 'chip'} onClick={() => setKind('all')}>すべて</button>
        {teaKinds.filter((k) => k.category !== 'form').map((k) => (
          <button key={k.id} className={kind === k.id ? 'chip active' : 'chip'} onClick={() => setKind(k.id)}>{k.name}</button>
        ))}
      </div>
      {shown.length === 0 && <p className="unknown-box">見つかりませんでした。収録範囲外のお茶かもしれません。</p>}
      <ul className="item-list">
        {shown.map((t) => (
          <li key={t.id}><button className="item-card" onClick={() => go(`tea/${t.id}`)}>
            <span className="item-name">{t.name}</span>
            <span className="badge">{LEVEL_LABEL[t.evidenceLevel]}</span>
          </button></li>
        ))}
      </ul>
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
  return (
    <div>
      <button className="btn ghost" onClick={() => go('tea')}>← 一覧へ</button>
      <h2>{tea.name} <button className="fav-btn" aria-pressed={fav} onClick={() => toggleFav('teas', tea.id)}>{fav ? '★ お気に入り' : '☆ お気に入り'}</button></h2>
      <p><span className="badge">{LEVEL_LABEL[tea.evidenceLevel]}</span></p>
      <ProfileView profile={tea.profile} scopeNote={tea.scopeNote} sourceIds={tea.sourceIds} />
      <h3>組み合わせの候補を探す</h3>
      <p className="note-small">相性の良し悪しではなく、香味の共通・対比からの探索の手がかりです。</p>
      <h4>調和型の候補（共通する香り）</h4>
      <div className="filter-row">{harmony.map((c) => <button key={c.id} className="chip" onClick={() => go(`pair`)}>{c.name}</button>)}</div>
      <h4>対比型の候補（異なる香り）</h4>
      <div className="filter-row">{contrast.map((c) => <button key={c.id} className="chip" onClick={() => go(`pair`)}>{c.name}</button>)}</div>
    </div>
  )
}

function ChocoList() {
  const { q, setQ, list } = useSearch(chocolateItems)
  const [kind, setKind] = useState('all')
  const [percent, setPercent] = useState('')
  const shown = list.filter((c) => (kind === 'all' || c.kind === kind) && (percent === '' || c.cacaoPercent === Number(percent)))
  return (
    <div>
      <h2>チョコを調べる</h2>
      <input className="search" type="search" placeholder="名前・種類で探す（例：ダーク、未焙煎）" value={q} onChange={(e) => setQ(e.target.value)} aria-label="チョコレートを検索" />
      <div className="filter-row" role="group" aria-label="種類で絞り込み">
        {[['all', 'すべて'], ['dark', 'ダーク'], ['milk', 'ミルク'], ['white', 'ホワイト']].map(([v, l]) => (
          <button key={v} className={kind === v ? 'chip active' : 'chip'} onClick={() => setKind(v)}>{l}</button>
        ))}
        <label className="percent-input">カカオ含有率
          <input type="number" min={0} max={100} value={percent} onChange={(e) => setPercent(e.target.value)} placeholder="数値入力" aria-label="カカオ含有率で絞り込み" />%
        </label>
      </div>
      <p className="note-small">収録データに含有率の記録がある場合のみ絞り込めます。含有率だけで甘味・苦味は決まりません。</p>
      {shown.length === 0 && <p className="unknown-box">見つかりませんでした。収録範囲外のチョコレートかもしれません。</p>}
      <ul className="item-list">
        {shown.map((c) => (
          <li key={c.id}><button className="item-card" onClick={() => go(`choco/${c.id}`)}>
            <span className="item-name">{c.name}</span><span className="badge">{LEVEL_LABEL[c.evidenceLevel]}</span>
          </button></li>
        ))}
      </ul>
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
      <ProfileView profile={choco.profile} scopeNote={choco.scopeNote} sourceIds={choco.sourceIds} />
      {choco.profile.aromas.length > 0 && <>
        <h3>組み合わせの候補（調和型）</h3>
        <div className="filter-row">{harmony.map((t) => <button key={t.id} className="chip" onClick={() => go('pair')}>{t.name}</button>)}</div>
      </>}
    </div>
  )
}

function PairPage({ saved, toggleFav, addHistory }: { saved: SavedData; toggleFav: (k: 'pairings', id: string) => void; addHistory: (k: 'pairings', id: string) => void }) {
  const [teaId, setTeaId] = useState(() => teaItems.find((t) => t.id === 'oolong-tea')?.id ?? teaItems[0].id)
  const [chocoId, setChocoId] = useState(chocolateItems[0].id)
  const [tab, setTab] = useState<'tea' | 'choco' | 'pair'>('pair')
  const tea = teaById(teaId)!; const choco = chocolateById(chocoId)!
  const result = analyzePairing(tea.profile, choco.profile)
  const pairId = `${teaId}+${chocoId}`
  useEffect(() => { addHistory('pairings', pairId) }, [pairId])
  useEffect(() => { scrollTop() }, [tab])
  const fav = saved.favorites.pairings.includes(pairId)
  return (
    <div>
      <h2>組み合わせる</h2>
      <div className="pair-selects">
        <label>お茶 <select value={teaId} onChange={(e) => setTeaId(e.target.value)}>{teaItems.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select></label>
        <label>チョコレート <select value={chocoId} onChange={(e) => setChocoId(e.target.value)}>{chocolateItems.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
        <button className="fav-btn" aria-pressed={fav} onClick={() => toggleFav('pairings', pairId)}>{fav ? '★ 保存済み' : '☆ この組み合わせを保存'}</button>
      </div>
      <div className="tabs" role="tablist" aria-label="ホイールの切り替え">
        <button role="tab" aria-selected={tab === 'tea'} onClick={() => setTab('tea')}>お茶</button>
        <button role="tab" aria-selected={tab === 'choco'} onClick={() => setTab('choco')}>チョコ</button>
        <button role="tab" aria-selected={tab === 'pair'} onClick={() => setTab('pair')}>組み合わせの見方</button>
      </div>
      {tab === 'tea' && <FlavorWheel profile={tea.profile} onSelectNote={() => {}} />}
      {tab === 'choco' && <FlavorWheel profile={choco.profile} onSelectNote={() => {}} />}
      {tab === 'pair' && (
        <section>
          <p><span className="badge">{LEVEL_LABEL[result.level]}</span></p>
          <p>{result.message}</p>
          {result.sharedNotes.length > 0 && <>
            <h3>共通する香り（調和の候補）</h3>
            <ul>{result.sharedNotes.map((s) => <li key={s.noteId}>{s.name}</li>)}</ul>
          </>}
          {result.sharedCategories.length > 0 && <>
            <h3>同じ分類の香り</h3>
            <ul>{result.sharedCategories.map((s) => <li key={s.categoryId}>{categoryById(s.categoryId)?.name ?? s.categoryId}</li>)}</ul>
          </>}
          {result.contrasts.length > 0 && <>
            <h3>対比する特徴（対比の候補）</h3>
            {result.contrasts.map((c, i) => <div className="temporal-card" key={i}><h4>{c.label}</h4><p>{c.detail}</p></div>)}
          </>}
          <p className="note-small">組み合わせ後のホイールは、香りを足し算して作ることはしません。共通点と対比だけを示します。</p>
          <SourceLinks ids={['spence-2020-flavour-pairing']} />
        </section>
      )}
    </div>
  )
}

function ComparePage() {
  const [a, setA] = useState(teaItems[1].id); const [b, setB] = useState(teaItems[7].id)
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
        <div><h3>{ta.name}</h3><FlavorWheel profile={ta.profile} onSelectNote={() => {}} /></div>
        <div><h3>{tb.name}</h3><FlavorWheel profile={tb.profile} onSelectNote={() => {}} /></div>
      </div>
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

function SourcesPage() {
  return (
    <div>
      <h2>出典・論文一覧</h2>
      <p>表示している香味データは、以下の検証済み論文の範囲に基づきます（2026-10-30 確認）。論文の文章や図表は転載していません。</p>
      <article className="temporal-card">
        <h3>香味の時間変化について</h3>
        <p>香りや味が時間とともにどう移ろうかは、TDS（時間的優位性評価）や TI（時間強度）といった方法で研究されています。チョコレートでは時間的に優位な属性が製品で異なること（Jager et al. 2014）、産地の異なるビターチョコレートで甘味の持続に差があること（石川ら 2019）、緑茶では香りを嗅ぐ段階でも優位な香りが移ろうこと（Qiu et al. 2025）が報告され、時間的に優位な属性が甘味の感じ方自体を変えうることも示されています（Khemacheevakul et al. 2021）。</p>
        <p>ただし、個別のアイテムごとの時間プロファイルを示した研究はまだ乏しいため、このアプリでは原則として「情報不足」としています（鳳凰単叢のカップアロマ＝余韻のみ、原著に基づいて表示しています）。</p>
      </article>
      {sources.map((s) => (
        <article className="temporal-card" key={s.id}>
          <h3>{s.title}</h3>
          <p>{s.authors}（{s.year}）{s.journal ?? ''}</p>
          <p>{s.scope}</p>
          <p className="note-small">種別：{s.kind === 'original' ? '原著論文' : s.kind === 'review' ? 'レビュー論文' : s.kind}／ライセンス：{s.license}</p>
          <a href={s.url} target="_blank" rel="noreferrer">DOI: {s.doi}</a>
        </article>
      ))}
    </div>
  )
}
