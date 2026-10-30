import { useMemo, useState } from 'react'
import { teaCultivars, teaCultivarById, usesForCultivar, cultivarsForKind } from '../data/cultivars'
import { cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones, traditionalGroupById, geneticGroupById, cacaoCloneById } from '../data/cacao'
import { teaKinds } from '../data/teas'
import { go } from '../nav'
import { FindingsList, ScienceNote, VerificationBadges } from './EntityViews'
import { SourceLinks } from './SourceLinks'
import { kindNameOf } from './CultivarPages'
import type { CacaoLayer } from '../engine/pairingContext'

// 品種・系統の比較。比較は出典つき所見の並置のみとし、研究条件の異なる数値を
// 単純な大小関係として表示しない。科学データが無い項目は「不明」と正直に示す。
type Mode = 'same-kind' | 'same-cultivar' | 'cacao'

function CultivarPanel({ id, kindId }: { id: string; kindId?: string }) {
  const c = teaCultivarById(id)
  if (!c) return null
  const use = kindId ? usesForCultivar(id).find((u) => u.kindId === kindId) : undefined
  return (
    <div>
      <h3><button className="linklike" onClick={() => go(`cultivar/${c.id}`)}>{c.name}</button></h3>
      <VerificationBadges v={c.verification} />
      {kindId && (use
        ? <p>{kindNameOf(kindId)}：{use.status === 'studied' ? '研究で供試された組み合わせです' : '公的資料で利用が確認できる組み合わせです'}<SourceLinks ids={use.sourceIds} /></p>
        : <p className="unknown-box">{kindNameOf(kindId)}との組み合わせは未確認です（実測済みとは扱いません）。</p>)}
      <ScienceNote science={c.verification.science} note={c.scienceNote} />
      <FindingsList findings={c.findings} />
      {c.findings.length === 0 && <p className="unknown-box">科学的な所見：不明（登録された所見はありません）</p>}
    </div>
  )
}

function SameKindCompare() {
  const kindOptions = useMemo(() => teaKinds.filter((k) => cultivarsForKind(k.id).length > 0), [])
  const [kindId, setKindId] = useState('green')
  const ids = useMemo(() => [...new Set(cultivarsForKind(kindId))], [kindId])
  const [a, setA] = useState('yabukita')
  const [b, setB] = useState('okumidori')
  const selA = ids.includes(a) ? a : ids[0]
  const selB = ids.includes(b) ? b : (ids.find((x) => x !== selA) ?? ids[0])
  return (
    <section>
      <div className="pair-selects">
        <label>茶類 <select value={kindId} onChange={(e) => setKindId(e.target.value)}>{kindOptions.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}</select></label>
        <label>品種 1 <select value={selA} onChange={(e) => setA(e.target.value)}>{ids.map((id) => <option key={id} value={id}>{teaCultivarById(id)?.name ?? id}</option>)}</select></label>
        <label>品種 2 <select value={selB} onChange={(e) => setB(e.target.value)}>{ids.map((id) => <option key={id} value={id}>{teaCultivarById(id)?.name ?? id}</option>)}</select></label>
      </div>
      <p className="note-small">所見は研究ごとに試料・条件が異なります。条件の異なる数値を単純な大小関係として比べることはしません。各所見の条件を併せて確認してください。</p>
      <div className="compare-grid">
        <CultivarPanel id={selA} kindId={kindId} />
        <CultivarPanel id={selB} kindId={kindId} />
      </div>
    </section>
  )
}

function SameCultivarCompare() {
  const withUses = useMemo(() => teaCultivars.filter((c) => usesForCultivar(c.id).length > 0), [])
  const [id, setId] = useState('benifuuki')
  const c = teaCultivarById(withUses.some((x) => x.id === id) ? id : withUses[0].id)!
  const uses = usesForCultivar(c.id)
  return (
    <section>
      <div className="pair-selects">
        <label>品種 <select value={c.id} onChange={(e) => setId(e.target.value)}>{withUses.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
      </div>
      <p>同じ品種でも、加工する茶類によって別のお茶になります。{c.name}で確認されている組み合わせは以下のとおりです。</p>
      <ul>
        {uses.map((u) => (
          <li key={u.kindId}><strong>{kindNameOf(u.kindId)}</strong>（{u.status === 'studied' ? '研究で供試された組み合わせ' : '公的資料で確認できる組み合わせ'}）
            <SourceLinks ids={u.sourceIds} /></li>
        ))}
      </ul>
      <p className="note-small">品種固有の香味データは茶類ごとに分かれて登録されているわけではありません。茶類そのものの香味の違いは、茶類レベルの特徴として「茶類・製法の比較」で確認できます。品種の所見は品種の詳細ページにあります。</p>
      <p>
        <button className="linklike" onClick={() => go(`cultivar/${c.id}`)}>{c.name}の詳細を見る</button>{' '}
        <button className="linklike" onClick={() => go('compare')}>茶類・製法の比較へ</button>
      </p>
    </section>
  )
}

interface CacaoOption { layer: CacaoLayer; id: string; label: string }
const CACAO_OPTIONS: CacaoOption[] = [
  ...cacaoTraditionalGroups.map((g) => ({ layer: 'traditional' as CacaoLayer, id: g.id, label: `伝統的分類：${g.nameJa}（${g.name}）` })),
  ...cacaoGeneticGroups.map((g) => ({ layer: 'genetic' as CacaoLayer, id: g.id, label: `遺伝集団：${g.name}` })),
  ...cacaoClones.map((c) => ({ layer: 'clone' as CacaoLayer, id: c.id, label: `個別クローン：${c.name}` })),
]
const cacaoEntity = (o: CacaoOption) =>
  o.layer === 'traditional' ? traditionalGroupById(o.id) : o.layer === 'genetic' ? geneticGroupById(o.id) : cacaoCloneById(o.id)

function CacaoPanel({ opt }: { opt: CacaoOption }) {
  const e = cacaoEntity(opt)
  if (!e) return null
  return (
    <div>
      <h3><button className="linklike" onClick={() => go(`cacao/${opt.layer}/${opt.id}`)}>{opt.label}</button></h3>
      <VerificationBadges v={e.verification} />
      <ScienceNote science={e.verification.science} note={e.scienceNote} />
      <FindingsList findings={e.findings} />
      {e.findings.length === 0 && <p className="unknown-box">科学的な所見：不明（登録された所見はありません）</p>}
    </div>
  )
}

function CacaoCompare() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(3)
  return (
    <section>
      <div className="pair-selects">
        <label>系統 1 <select value={a} onChange={(e) => setA(Number(e.target.value))}>{CACAO_OPTIONS.map((o, i) => <option key={o.layer + o.id} value={i}>{o.label}</option>)}</select></label>
        <label>系統 2 <select value={b} onChange={(e) => setB(Number(e.target.value))}>{CACAO_OPTIONS.map((o, i) => <option key={o.layer + o.id} value={i}>{o.label}</option>)}</select></label>
      </div>
      <p className="note-small">伝統的分類・遺伝集団・個別クローンは階層の異なる概念です。並べて所見を確認できますが、異なる体系の数値を単純な大小関係として比べることはしません。遺伝的分類だけから味の違いを断定することもできません。</p>
      <div className="compare-grid">
        <CacaoPanel opt={CACAO_OPTIONS[a]} />
        <CacaoPanel opt={CACAO_OPTIONS[b]} />
      </div>
    </section>
  )
}

export default function CultivarComparePage() {
  const [mode, setMode] = useState<Mode>('same-kind')
  return (
    <div>
      <h2>品種・系統の比較</h2>
      <div className="filter-row" role="group" aria-label="比較の種類">
        <button className={mode === 'same-kind' ? 'chip active' : 'chip'} onClick={() => setMode('same-kind')}>同じ茶類・異なる品種</button>
        <button className={mode === 'same-cultivar' ? 'chip active' : 'chip'} onClick={() => setMode('same-cultivar')}>同じ品種・異なる茶類</button>
        <button className={mode === 'cacao' ? 'chip active' : 'chip'} onClick={() => setMode('cacao')}>カカオ系統の比較</button>
      </div>
      {mode === 'same-kind' && <SameKindCompare />}
      {mode === 'same-cultivar' && <SameCultivarCompare />}
      {mode === 'cacao' && <CacaoCompare />}
    </div>
  )
}
