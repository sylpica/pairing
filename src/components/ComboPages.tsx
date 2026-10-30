import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ComboNote } from '../types'
import ComboWheel, { COMBO_INT_LABEL } from './ComboWheel'
import { FindingsList } from './EntityViews'
import { SourceLinks } from './SourceLinks'
import { go } from '../nav'
import {
  CHOCO_KIND_LABEL, COMBO_BASIS_FROM_LABEL, COMBO_LEVEL_LABEL, COMBO_TASTE_LABEL,
  analyzeChocoCombo, analyzeTeaCombo,
  chocoComboPath, chocoComboSiblings, chocoComboViable,
  chocoKindOptions, chocoLineageOptions, chocoOriginOptions,
  parseChocoComboSub, parseTeaComboSub,
  teaComboPath, teaComboSiblings, teaComboViable,
  teaCultivarOptions, teaKindOptions, teaRegionOptions,
  type ChocoComboSel, type ComboAnalysis, type TeaComboSel,
} from '../engine/combo'
import { teaKinds } from '../data/teas'
import { cacaoOrigins } from '../data/origins'
import type { CacaoLayer } from '../engine/pairingContext'

// 組み合わせページ（第2層）。分類・産地・品種（チョコは種類・産地・系統）の
// 3軸で具体的な組み合わせを選び、その組み合わせ専用の味わい（推測つき）を表示する。
// プルダウンは連動し、根拠の無い組み合わせは選択肢に出ない。
// 設計: docs/design/combination-pages.md

function LevelBadge({ level }: { level: ComboNote['level'] }) {
  return <span className={level === 'inferred' ? 'badge badge-inferred' : 'badge'}>{COMBO_LEVEL_LABEL[level]}</span>
}

function AnalysisView({ analysis, children }: { analysis: ComboAnalysis; children?: ReactNode }) {
  const [selNote, setSelNote] = useState<string | null>(null)
  useEffect(() => { setSelNote(null) }, [analysis.title])
  const note = analysis.notes.find((n) => n.noteId === selNote) ?? null
  return (
    <div>
      <h3>{analysis.title}</h3>
      <p><span className="badge">組み合わせ全体の根拠：{COMBO_LEVEL_LABEL[analysis.overallLevel]}</span></p>
      <ComboWheel notes={analysis.notes} onSelectNote={(id) => setSelNote(selNote === id ? null : id)} selectedNoteId={selNote} />
      {note && (
        <div className="temporal-card">
          <h4>この香りの根拠</h4>
          {note.basis.map((b, i) => (
            <div key={i}>
              <p><span className="badge">{COMBO_BASIS_FROM_LABEL[b.from]}</span></p>
              <p>{b.text}</p>
              <SourceLinks ids={b.sourceIds} />
            </div>
          ))}
        </div>
      )}
      {analysis.tastes.length > 0 && <>
        <h3>味わい（味覚と渋味）</h3>
        {analysis.tastes.map((t) => (
          <div className="temporal-card" key={t.key}>
            <p><strong>{COMBO_TASTE_LABEL[t.key]}</strong>（{COMBO_INT_LABEL[t.intensity]}） <LevelBadge level={t.level} /></p>
            <p>{t.text}</p>
            <SourceLinks ids={t.sourceIds} />
          </div>
        ))}
      </>}
      {analysis.statements.length > 0 && <>
        <h3>味わいの要約</h3>
        {analysis.statements.map((s, i) => (
          <div className="temporal-card" key={i}>
            <p><LevelBadge level={s.level} /></p>
            <p>{s.text}</p>
            <SourceLinks ids={s.sourceIds} />
          </div>
        ))}
      </>}
      {children}
      <h3>根拠の内訳</h3>
      <p className="note-small">この組み合わせの表示が、第1層のどの知見に基づくかを分けて示します。</p>
      {analysis.groups.map((g) => (
        <div key={g.label}>
          <h4>{g.label}</h4>
          {g.text && <p>{g.text}</p>}
          <FindingsList findings={g.findings} />
          <SourceLinks ids={g.sourceIds} />
        </div>
      ))}
      {analysis.caveats.length > 0 && <>
        <h3>注意・限界</h3>
        {analysis.caveats.map((c, i) => (
          <div className="unknown-box" key={i}>
            <p>{c.text}</p>
            <SourceLinks ids={c.sourceIds} />
          </div>
        ))}
      </>}
    </div>
  )
}

function Siblings<T>({ title, siblings, pathOf }: {
  title: string
  siblings: { relation: string; title: string; sel: T }[]
  pathOf: (sel: T) => string
}) {
  if (siblings.length === 0) return null
  const relations = [...new Set(siblings.map((s) => s.relation))]
  return (
    <>
      <h3>{title}</h3>
      <p className="note-small">一部を変えた組み合わせと並べると、違いが読み取りやすくなります。</p>
      {relations.map((rel) => (
        <div key={rel}>
          <h4>{rel}</h4>
          <div className="filter-row">
            {siblings.filter((s) => s.relation === rel).map((s) => (
              <button key={s.title} className="chip" onClick={() => go(pathOf(s.sel))}>{s.title}</button>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

const replaceHash = (path: string) => { history.replaceState(null, '', `#/${path}`) }

export function TeaComboPage({ sub }: { sub?: string }) {
  const initial = useMemo<TeaComboSel>(() => {
    const parsed = parseTeaComboSub(sub)
    if (!parsed.kindId) return { kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' }
    return parsed
  }, [sub])
  const [sel, setSel] = useState<TeaComboSel>(initial)
  useEffect(() => { setSel(initial) }, [initial])

  const kindOptions = teaKindOptions(sel)
  const regionOptions = teaRegionOptions(sel)
  const cultivarOptions = teaCultivarOptions(sel)
  // 選択が無効になったら自動で「指定なし」に戻す（存在しない組み合わせを選ばせない）
  useEffect(() => {
    if (sel.cultivarId && !cultivarOptions.some((c) => c.id === sel.cultivarId)) {
      const next = { ...sel, cultivarId: '' }
      setSel(next); replaceHash(teaComboPath(next))
    } else if (sel.regionId && !regionOptions.some((o) => o.id === sel.regionId)) {
      const next = { ...sel, regionId: '' }
      setSel(next); replaceHash(teaComboPath(next))
    } else if (sel.kindId && !kindOptions.includes(sel.kindId)) {
      const next = { ...sel, kindId: kindOptions[0] ?? 'green' }
      setSel(next); replaceHash(teaComboPath(next))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel])

  const viable = teaComboViable(sel)
  const analysis = useMemo(() => (viable ? analyzeTeaCombo(sel) : null), [sel, viable])
  const siblings = useMemo(() => (viable ? teaComboSiblings(sel) : []), [sel, viable])
  const update = (next: TeaComboSel) => { setSel(next); replaceHash(teaComboPath(next)) }

  return (
    <div>
      <h2>組み合わせで調べる（お茶）</h2>
      <p>「長崎の紅茶のやぶきた」と「長崎の緑茶のやぶきた」のように、<strong>産地×品種×分類の具体的な組み合わせ</strong>ごとに味わいがどう違うかを見るページです。分類のプロファイル、品種の所見、産地の所見、製法の科学を重ねて推測し、実測のある部分と推測の部分を区別して表示します。根拠の無い組み合わせは選択肢に出ません。</p>
      <section className="filter-hero" role="group" aria-label="組み合わせの選択">
        <h3 className="filter-hero-title">組み合わせを選ぶ</h3>
        <div className="filter-grid cols-3">
          <label className="filter-field">
            <span className="filter-label">分類（茶類）</span>
            <select className="big-select" value={sel.kindId} onChange={(e) => update({ ...sel, kindId: e.target.value })} aria-label="組み合わせの分類（茶類）">
              {teaKinds.filter((k) => k.category !== 'form').map((k) => (
                <option key={k.id} value={k.id} disabled={!kindOptions.includes(k.id)}>{k.name}</option>
              ))}
            </select>
          </label>
          <label className="filter-field">
            <span className="filter-label">産地</span>
            <select className="big-select" value={sel.regionId} onChange={(e) => update({ ...sel, regionId: e.target.value })} aria-label="組み合わせの産地">
              <option value="">指定しない</option>
              {regionOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span className="filter-label">品種</span>
            <select className="big-select" value={sel.cultivarId} onChange={(e) => update({ ...sel, cultivarId: e.target.value })} aria-label="組み合わせの品種">
              <option value="">指定しない</option>
              {cultivarOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>
        <p className="note-small">選択肢は連動します：他の軸と両立しない選択肢は出ません。産地は、文献で所見のある地域（例：長崎）は地域レベルで、国レベルでも選べます。</p>
      </section>
      {analysis ? (
        <AnalysisView analysis={analysis}>
          <Siblings title="違いを見る（兄弟の組み合わせ）" siblings={siblings} pathOf={teaComboPath} />
        </AnalysisView>
      ) : (
        <p className="unknown-box">その組み合わせには、表示できる根拠がありません。選択肢の中から選んでください。</p>
      )}
      <p className="note-small">チョコレートの組み合わせは <button className="linklike" onClick={() => go('combo/choco')}>組み合わせで調べる（チョコ）</button> から。お茶とチョコのペアリングは「組み合わせる」画面です。</p>
    </div>
  )
}

export function ChocoComboPage({ sub }: { sub?: string }) {
  const initial = useMemo<ChocoComboSel>(() => {
    const parsed = parseChocoComboSub(sub)
    if (!parsed.kind) return { kind: 'dark', originId: 'ecuador', lineage: { layer: 'genetic', id: 'gen-nacional' } }
    return parsed
  }, [sub])
  const [sel, setSel] = useState<ChocoComboSel>(initial)
  useEffect(() => { setSel(initial) }, [initial])

  const kindOptions = chocoKindOptions(sel)
  const originOptions = chocoOriginOptions(sel)
  const lineageOptions = chocoLineageOptions(sel)
  useEffect(() => {
    if (sel.lineage && !lineageOptions.some((l) => l.layer === sel.lineage!.layer && l.id === sel.lineage!.id)) {
      const next = { ...sel, lineage: null }
      setSel(next); replaceHash(chocoComboPath(next))
    } else if (sel.originId && !originOptions.some((o) => o.id === sel.originId)) {
      const next = { ...sel, originId: '' }
      setSel(next); replaceHash(chocoComboPath(next))
    } else if (sel.kind && !kindOptions.includes(sel.kind)) {
      const next = { ...sel, kind: kindOptions[0] ?? 'dark' }
      setSel(next); replaceHash(chocoComboPath(next))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel])

  const viable = chocoComboViable(sel)
  const analysis = useMemo(() => (viable ? analyzeChocoCombo(sel) : null), [sel, viable])
  const siblings = useMemo(() => (viable ? chocoComboSiblings(sel) : []), [sel, viable])
  const update = (next: ChocoComboSel) => { setSel(next); replaceHash(chocoComboPath(next)) }
  const lineageValue = sel.lineage ? `${sel.lineage.layer}:${sel.lineage.id}` : ''
  const pickLineage = (v: string) => {
    if (!v) { update({ ...sel, lineage: null }); return }
    const [layer, id] = v.split(':') as [CacaoLayer, string]
    update({ ...sel, lineage: { layer, id } })
  }
  const byLayer = (layer: CacaoLayer) => lineageOptions.filter((l) => l.layer === layer)

  return (
    <div>
      <h2>組み合わせで調べる（チョコレート）</h2>
      <p><strong>産地×系統×種類の具体的な組み合わせ</strong>ごとに味わいがどう違うかを見るページです。種類のプロファイル、系統の所見、産地の所見を重ねて推測し、実測のある部分と推測の部分を区別して表示します。産地と系統は多対多の関係で、結びつきの無い組み合わせは選択肢に出ません。</p>
      <section className="filter-hero" role="group" aria-label="組み合わせの選択">
        <h3 className="filter-hero-title">組み合わせを選ぶ</h3>
        <div className="filter-grid cols-3">
          <label className="filter-field">
            <span className="filter-label">分類（種類）</span>
            <select className="big-select" value={sel.kind} onChange={(e) => update({ ...sel, kind: e.target.value })} aria-label="組み合わせの分類（種類）">
              {kindOptions.map((k) => <option key={k} value={k}>{CHOCO_KIND_LABEL[k] ?? k}チョコレート</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span className="filter-label">産地</span>
            <select className="big-select" value={sel.originId} onChange={(e) => update({ ...sel, originId: e.target.value })} aria-label="組み合わせの産地（カカオ）">
              <option value="">指定しない</option>
              {cacaoOrigins.filter((o) => originOptions.some((x) => x.id === o.id)).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </label>
          <label className="filter-field">
            <span className="filter-label">系統</span>
            <select className="big-select" value={lineageValue} onChange={(e) => pickLineage(e.target.value)} aria-label="組み合わせの系統">
              <option value="">指定しない</option>
              <optgroup label="伝統的分類">{byLayer('traditional').map((l) => <option key={l.id} value={`traditional:${l.id}`}>{l.name}</option>)}</optgroup>
              <optgroup label="遺伝的分類">{byLayer('genetic').map((l) => <option key={l.id} value={`genetic:${l.id}`}>{l.name}</option>)}</optgroup>
              <optgroup label="個別クローン">{byLayer('clone').map((l) => <option key={l.id} value={`clone:${l.id}`}>{l.name}</option>)}</optgroup>
            </select>
          </label>
        </div>
        <p className="note-small">選択肢は連動します：産地と結びつきの無い系統は出ません。系統名はカタカナを主表記にしています。ルビーは種類の軸にのみあり、系統には入りません。</p>
      </section>
      {analysis ? (
        <AnalysisView analysis={analysis}>
          <Siblings title="違いを見る（兄弟の組み合わせ）" siblings={siblings} pathOf={chocoComboPath} />
        </AnalysisView>
      ) : (
        <p className="unknown-box">その組み合わせには、表示できる根拠がありません。選択肢の中から選んでください。</p>
      )}
      <p className="note-small">お茶の組み合わせは <button className="linklike" onClick={() => go('combo/tea')}>組み合わせで調べる（お茶）</button> から。</p>
    </div>
  )
}
