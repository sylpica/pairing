import { useEffect, useMemo, type ReactNode } from 'react'
import { readPersisted, savePersisted } from '../hooks/usePersistedState'
import { comboFavId, type SavedData } from '../storage'
import FavButton from './FavButton'
import type { ComboNote } from '../types'
import { COMBO_INT_LABEL } from './ComboWheel'
import ComboWheelPanel from './ComboWheelPanel'
import BackButton from './BackButton'
import { FindingsList } from './EntityViews'
import { SourceLinks } from './SourceLinks'
import { go } from '../nav'
import {
  COMBO_LEVEL_LABEL, COMBO_TASTE_LABEL,
  analyzeChocoCombo, analyzeTeaCombo,
  chocoComboPath, chocoComboSiblings, chocoComboViable,
  parseChocoComboSub, parseTeaComboSub,
  teaComboPath, teaComboSiblings, teaComboViable,
  type ChocoComboSel, type ComboAnalysis, type TeaComboSel,
} from '../engine/combo'

// 組み合わせページ（第2層）。分類・産地・品種（チョコは種類・産地・系統）の
// 具体的な組み合わせの味わい（推測つき）を表示する「結果表示専用」ページ。
// 選択は「調べる」「組み合わせる」画面で行い、このページ自体にプルダウンは置かない
// （2026-10-31 実機フィードバック第2弾の指示1）。ホイールはタイトル直下に置く。
// 表示する組み合わせの決め方：URL の指定（成立するもの）→ 前回の選択 → 既定の順。
// ホイールの香味を押すと、根拠の内訳と関係する成分がシートで開く（指示2・3）。
// 設計: docs/design/combination-pages.md

function LevelBadge({ level }: { level: ComboNote['level'] }) {
  return <span className={level === 'inferred' ? 'badge badge-inferred' : 'badge'}>{COMBO_LEVEL_LABEL[level]}</span>
}

const AXIS_SUMMARY_LABEL: Record<string, string> = { region: '産地の反映', cultivar: '品種の反映', origin: '産地の反映', lineage: '系統の反映' }

function AnalysisView({ analysis, children }: { analysis: ComboAnalysis; children?: ReactNode }) {
  return (
    <div>
      <p><span className="badge">組み合わせ全体の根拠：{COMBO_LEVEL_LABEL[analysis.overallLevel]}</span></p>
      <ComboWheelPanel notes={analysis.notes} tastes={analysis.tastes} context={analysis.context} resetKey={analysis.title} />
      {analysis.axisSummaries.length > 0 && <>
        <h3>ホイールへの反映</h3>
        <p className="note-small">選んだ産地・品種（系統）の所見が、上のホイールにどう反映されたか／されなかったかを示します。</p>
        {analysis.axisSummaries.map((s) => (
          <p key={s.axis} className="note-small"><strong>{AXIS_SUMMARY_LABEL[s.axis]}</strong>：{s.text}</p>
        ))}
      </>}
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

const TEA_DEFAULT_SEL: TeaComboSel = { kindId: 'green', regionId: 'nagasaki', cultivarId: 'yabukita' }
const CHOCO_DEFAULT_SEL: ChocoComboSel = { kind: 'dark', originId: 'ecuador', lineage: { layer: 'genetic', id: 'gen-nacional' } }

/** 組み合わせページの選択を、調べる画面と同じ単体組み合わせのお気に入りIDへ変換する。
 * お茶の産地は、組み合わせエンジンの regionId（'' / 'country:<国>' / 地域id）を
 * プルダウンの値（'' / 国名 / 'region:<地域id>'）に戻してから格納する（往復可能）。 */
const teaOriginValueOf = (regionId: string) =>
  regionId === '' ? '' : regionId.startsWith('country:') ? regionId.slice('country:'.length) : `region:${regionId}`

export function TeaComboPage({ sub, saved, toggleFav }: { sub?: string; saved?: SavedData; toggleFav?: (k: 'combos', id: string) => void }) {
  // 表示する組み合わせ：URL の指定が成立すればそれを、無指定・不成立なら
  // 前回の選択、それも無ければ既定を使う（このページは結果表示専用で、
  // 選択し直す導線は「調べる」「組み合わせる」画面と兄弟リンクが担う）。
  const sel = useMemo<TeaComboSel>(() => {
    const parsed = parseTeaComboSub(sub)
    if (parsed.kindId && teaComboViable(parsed)) return parsed
    const saved = readPersisted<TeaComboSel | null>('pairing.teaCombo.sel', null)
    if (saved?.kindId && teaComboViable(saved)) return saved
    return TEA_DEFAULT_SEL
  }, [sub])
  useEffect(() => {
    savePersisted('pairing.teaCombo.sel', sel)
    if (parseTeaComboSub(sub).kindId !== sel.kindId || sub === undefined) replaceHash(teaComboPath(sel))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel])
  const analysis = useMemo(() => analyzeTeaCombo(sel), [sel])
  const siblings = useMemo(() => teaComboSiblings(sel), [sel])
  const favId = comboFavId('tea', { kind: sel.kindId, origin: teaOriginValueOf(sel.regionId), third: sel.cultivarId })

  return (
    <div>
      <BackButton fallback="tea" />
      <h2>{analysis.title} {saved && toggleFav && <FavButton fav={saved.favorites.combos.includes(favId)} onToggle={() => toggleFav('combos', favId)} />}</h2>
      <p className="note-small">産地×品種×分類の具体的な組み合わせの味わいを見るページです。分類のプロファイル、品種の所見、産地の所見、製法の科学を重ねて推測し、実測のある部分と推測の部分を区別して表示します。組み合わせを変えるときは「調べる」「組み合わせる」画面で選び直してください（このページは結果の表示専用です）。</p>
      <AnalysisView analysis={analysis}>
        <Siblings title="違いを見る（兄弟の組み合わせ）" siblings={siblings} pathOf={teaComboPath} />
      </AnalysisView>
      <p className="note-small">分類×産地の組み合わせは常に開けますが、その産地・品種での実測があるかどうかは、ページ内の注記と「根拠の内訳」で正直に示します。品種は、その分類で確認済みのものと、製法の科学から推測が成立するものだけが組み合わせとして成立します。</p>
      <p className="note-small">チョコレートの組み合わせは <button className="linklike" onClick={() => go('combo/choco')}>組み合わせで調べる（チョコ）</button> から。お茶とチョコのペアリングは「組み合わせる」画面です。</p>
    </div>
  )
}

export function ChocoComboPage({ sub, saved, toggleFav }: { sub?: string; saved?: SavedData; toggleFav?: (k: 'combos', id: string) => void }) {
  const sel = useMemo<ChocoComboSel>(() => {
    const parsed = parseChocoComboSub(sub)
    if (parsed.kind && chocoComboViable(parsed)) return parsed
    const saved = readPersisted<ChocoComboSel | null>('pairing.chocoCombo.sel', null)
    if (saved?.kind && chocoComboViable(saved)) return saved
    return CHOCO_DEFAULT_SEL
  }, [sub])
  useEffect(() => {
    savePersisted('pairing.chocoCombo.sel', sel)
    if (parseChocoComboSub(sub).kind !== sel.kind || sub === undefined) replaceHash(chocoComboPath(sel))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sel])
  const analysis = useMemo(() => analyzeChocoCombo(sel), [sel])
  const siblings = useMemo(() => chocoComboSiblings(sel), [sel])
  const favId = comboFavId('chocolate', { kind: sel.kind, origin: sel.originId, third: sel.lineage ? `${sel.lineage.layer}:${sel.lineage.id}` : '' })

  return (
    <div>
      <BackButton fallback="choco" />
      <h2>{analysis.title} {saved && toggleFav && <FavButton fav={saved.favorites.combos.includes(favId)} onToggle={() => toggleFav('combos', favId)} />}</h2>
      <p className="note-small">産地×系統×種類の具体的な組み合わせの味わいを見るページです。種類のプロファイル、系統の所見、産地の所見を重ねて推測し、実測のある部分と推測の部分を区別して表示します。組み合わせを変えるときは「調べる」「組み合わせる」画面で選び直してください（このページは結果の表示専用です）。</p>
      <AnalysisView analysis={analysis}>
        <Siblings title="違いを見る（兄弟の組み合わせ）" siblings={siblings} pathOf={chocoComboPath} />
      </AnalysisView>
      <p className="note-small">チョコレートは、種類・産地・系統を相互に制限しません（いろんなチョコにいろんな産地と品種が合わさるため）。産地と系統は多対多の関係で、重ね合わせは相互作用を踏まえた推測として表示します。系統名はカタカナを主表記にしています。ルビーは種類の軸にのみあり、系統には入りません。</p>
      <p className="note-small">お茶の組み合わせは <button className="linklike" onClick={() => go('combo/tea')}>組み合わせで調べる（お茶）</button> から。</p>
    </div>
  )
}
