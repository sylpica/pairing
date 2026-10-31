import { useMemo, useState, type ReactNode } from 'react'
import type { ComboNote, TeaCultivar, TeaCultivarRank } from '../types'
import { FLAVOR_FINDING_KINDS } from '../types'
import ComboWheel from './ComboWheel'
import ComboNoteDetail from './ComboNoteDetail'
import BackButton from './BackButton'
import { CollapsibleSheet } from './Sheet'
import { noteById } from '../data/flavors'
import type { CompoundContext } from '../data/compounds'
import { COMBO_LEVEL_LABEL } from '../engine/combo'
import { cultivarWheels, lineageWheels } from '../engine/entityWheel'
import { teaCultivars, teaCultivarById, usesForCultivar } from '../data/cultivars'
import {
  cacaoTraditionalGroups, cacaoGeneticGroups, cacaoClones,
  traditionalGroupById, geneticGroupById, cacaoCloneById,
} from '../data/cacao'
import { teaKinds } from '../data/teas'
import { cacaoOrigins, cacaoOriginById } from '../data/origins'
import { go } from '../nav'
import { FindingsList, ScienceNote, VerificationBadges, SCIENCE_LABEL } from './EntityViews'
import { SourceLinks } from './SourceLinks'
import type { CacaoLayer } from '../engine/pairingContext'
import { CACAO_LAYER_LABEL } from '../engine/pairingContext'

const norm = (s: string) => s.toLowerCase().replace(/[\s　]/g, '').replace(/ヶ/g, 'ケ')

// 品種・系統ページの組み合わせホイール。土台は組み合わせページ（第2層）と同じ
// エンジンの結果で、対象固有の実測プロファイルではないことを冒頭で明示する。
interface WheelTab {
  key: string
  label: string
  notes: ComboNote[]
  overallLevel: ComboNote['level']
  context: CompoundContext
  footer: ReactNode
}
function EntityWheelTabs({ tabs }: { tabs: WheelTab[] }) {
  const [idx, setIdx] = useState(0)
  const [selNote, setSelNote] = useState<string | null>(null)
  const tab = tabs[Math.min(idx, tabs.length - 1)]
  if (!tab) return null
  const note = tab.notes.find((n) => n.noteId === selNote) ?? null
  return (
    <div>
      {tabs.length > 1 && (
        <label className="filter-field">
          <span className="filter-label">分類を選ぶ</span>
          <select className="big-select" value={tab.key} aria-label="ホイールを表示する分類"
            onChange={(e) => { const i = tabs.findIndex((t) => t.key === e.target.value); setIdx(i < 0 ? 0 : i); setSelNote(null) }}>
            {tabs.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </label>
      )}
      <p><span className="badge">この組み合わせ全体の根拠：{COMBO_LEVEL_LABEL[tab.overallLevel]}</span></p>
      <ComboWheel notes={tab.notes} context={tab.context} onSelectNote={(id) => setSelNote(selNote === id ? null : id)} selectedNoteId={selNote} />
      {note && (
        <CollapsibleSheet resetKey={`${tab.key}:${note.noteId}`} title={noteById(note.noteId)?.name ?? note.noteId} noun="根拠情報"
          onDismiss={() => setSelNote(null)}>
          <ComboNoteDetail note={note} context={tab.context} />
        </CollapsibleSheet>
      )}
      {tab.footer}
    </div>
  )
}
function matchesAny(query: string, names: string[]) {
  if (!query.trim()) return true
  const q = norm(query)
  return names.some((n) => norm(n).includes(q) || (q.includes(norm(n)) && norm(n).length >= 2))
}

export const RANK_LABEL: Record<TeaCultivarRank, string> = {
  cultivar: '品種',
  clone: 'クローン',
  landrace: '在来系統',
  population: '集団（系統群）',
  'cultivar-group': '品種群・系統群',
}
const USE_STATUS_LABEL: Record<string, string> = {
  studied: '研究で供試された組み合わせ',
  documented: '公的資料で確認できる組み合わせ',
}
export const kindNameOf = (kindId: string) => teaKinds.find((k) => k.id === kindId)?.name ?? kindId

const COUNTRIES = ['日本', '台湾', '中国', 'インド', 'スリランカ']

export function CultivarsPage() {
  const [q, setQ] = useState('')
  const teas = useMemo(() => teaCultivars.filter((c) => matchesAny(q, [c.name, c.originalName ?? '', ...c.aliases])), [q])
  const trad = useMemo(() => cacaoTraditionalGroups.filter((g) => matchesAny(q, [g.name, g.nameJa, ...g.aliases])), [q])
  const gen = useMemo(() => cacaoGeneticGroups.filter((g) => matchesAny(q, [g.name, ...g.aliases])), [q])
  const clones = useMemo(() => cacaoClones.filter((c) => matchesAny(q, [c.name, ...c.aliases])), [q])
  const origins = useMemo(() => cacaoOrigins.filter((o) => matchesAny(q, [o.name, o.country, ...o.regions.map((r) => r.name), ...o.tradeNames.map((t) => t.name)])), [q])
  const empty = teas.length + trad.length + gen.length + clones.length + origins.length === 0
  return (
    <div>
      <h2>品種・系統を調べる</h2>
      <p>お茶の品種とカカオの分類・系統の図鑑です。表示できるのは、出典のある分類・系譜と科学的な所見までです。科学データが確認できていない対象には、香味の特徴を表示しません。</p>
      <input className="search" type="search" placeholder="名前・原語・別名で探す（例：やぶきた、Yabukita、CCN-51）" value={q} onChange={(e) => setQ(e.target.value)} aria-label="品種・系統を検索" />
      {empty && <p className="unknown-box">見つかりませんでした。収録範囲外の品種・系統かもしれません。産地名や商品名は品種名ではないため、収録していない場合があります。</p>}

      {teas.length > 0 && <h3>お茶の品種・系統</h3>}
      {COUNTRIES.map((country) => {
        const list = teas.filter((c) => c.country === country)
        if (list.length === 0) return null
        return (
          <section key={country}>
            <h4>{country}</h4>
            <ul className="item-list">
              {list.map((c) => (
                <li key={c.id}><button className="item-card" onClick={() => go(`cultivar/${c.id}`)}>
                  <span className="item-name">{c.name}</span>
                  <span><span className="badge">{RANK_LABEL[c.rank]}</span> <span className="badge">{SCIENCE_LABEL[c.verification.science]}</span></span>
                </button></li>
              ))}
            </ul>
          </section>
        )
      })}

      {(trad.length > 0 || gen.length > 0 || clones.length > 0) && <h3>カカオの分類・系統</h3>}
      <p className="note-small">カカオには階層の異なる分類があります。伝統的分類（歴史的・商業的な呼称）と、遺伝学に基づく遺伝集団（Motamayor et al. 2008）は別の体系で、一対一には対応しません。個別クローンは、さらに下の階層の実体です。</p>
      {trad.length > 0 && <>
        <h4>伝統的分類</h4>
        <ul className="item-list">
          {trad.map((g) => (
            <li key={g.id}><button className="item-card" onClick={() => go('cacao/traditional/' + g.id)}>
              <span className="item-name">{g.nameJa}（{g.name}）</span>
              <span className="badge">{SCIENCE_LABEL[g.verification.science]}</span>
            </button></li>
          ))}
        </ul>
      </>}
      {gen.length > 0 && <>
        <h4>遺伝集団（Motamayor et al. 2008 の10集団）</h4>
        <ul className="item-list">
          {gen.map((g) => (
            <li key={g.id}><button className="item-card" onClick={() => go('cacao/genetic/' + g.id)}>
              <span className="item-name">{g.name}</span>
              <span className="badge">{SCIENCE_LABEL[g.verification.science]}</span>
            </button></li>
          ))}
        </ul>
      </>}
      {clones.length > 0 && <>
        <h4>個別クローン・系統</h4>
        <ul className="item-list">
          {clones.map((c) => (
            <li key={c.id}><button className="item-card" onClick={() => go('cacao/clone/' + c.id)}>
              <span className="item-name">{c.name}</span>
              <span className="badge">{SCIENCE_LABEL[c.verification.science]}</span>
            </button></li>
          ))}
        </ul>
      </>}
      {origins.length > 0 && <>
        <h3>カカオの産地</h3>
        <p className="note-small">産地は品種ではありません。産地と遺伝（系統）は多対多の関係にあり、産地ごとに確認できている科学データの範囲が異なります。香味の実測がない産地には、香味の特徴を表示しません。</p>
        <ul className="item-list">
          {origins.map((o) => (
            <li key={o.id}><button className="item-card" onClick={() => go('origin/' + o.id)}>
              <span className="item-name">{o.name}</span>
              <span><span className="badge">産地</span> <span className="badge">{SCIENCE_LABEL[o.verification.science]}</span></span>
            </button></li>
          ))}
        </ul>
      </>}
      <p><button className="linklike" onClick={() => go('compare-cultivars')}>品種・系統を比べる</button></p>
    </div>
  )
}

function CultivarWheelSection({ cultivarId, cultivarName }: { cultivarId: string; cultivarName: string }) {
  const wheels = useMemo(() => cultivarWheels(cultivarId), [cultivarId])
  if (wheels.length === 0) return null
  const tabs: WheelTab[] = wheels.map((w) => ({
    key: w.kindId,
    label: w.kindName,
    notes: w.notes,
    overallLevel: w.overallLevel,
    context: w.context,
    footer: w.comboPath
      ? <p><button className="linklike" onClick={() => go(w.comboPath!)}>「{cultivarName} × {w.kindName}」の組み合わせページで、産地違いや根拠の内訳を見る</button></p>
      : <p className="note-small">{w.kindName}は組み合わせページの対象外の形態のため、土台にしたアイテムのページへ案内します。<button className="linklike" onClick={() => go(w.itemPath!)}>{w.kindName}のページを見る</button></p>,
  }))
  return (
    <>
      <h3>分類との組み合わせで見る味わい（フレーバーホイール）</h3>
      <p className="note-small">ホイールは、分類のプロファイルを土台に、品種の所見と製法の科学を重ねた<strong>組み合わせの推測</strong>です。{cultivarName}固有の実測プロファイルではありません。品種固有の実測がある部分は、下の「科学的な所見」に分けて示します。</p>
      <EntityWheelTabs tabs={tabs} />
    </>
  )
}

export function TeaCultivarDetail({ id }: { id: string }) {
  const c = teaCultivarById(id)
  if (!c) return <p className="unknown-box">その品種・系統は収録されていません。</p>
  const uses = usesForCultivar(c.id)
  const parents = (c.parentCultivarIds ?? []).map((pid) => teaCultivarById(pid)).filter((p): p is TeaCultivar => !!p)
  return (
    <div>
      <BackButton fallback="cultivars" />
      <h2>{c.name}{c.originalName && c.originalName !== c.name ? `（${c.originalName}）` : ''}</h2>
      <p>
        <span className="badge">{RANK_LABEL[c.rank]}</span> <span className="badge">{c.country}</span>
        {c.aliases.length > 0 && <span className="note-small"> 別名：{c.aliases.join('、')}</span>}
      </p>
      <VerificationBadges v={c.verification} />
      {c.registration && <p><strong>登録情報：</strong>{c.registration}</p>}
      {c.breeding && <><h3>由来・育成</h3><p>{c.breeding}</p></>}
      {parents.length > 0 && (
        <p>親品種：
          {parents.map((p, i) => <span key={p.id}>{i > 0 && '、'}<button className="linklike" onClick={() => go(`cultivar/${p.id}`)}>{p.name}</button></span>)}
        </p>
      )}
      {c.regions.length > 0 && <p><strong>主な栽培地域：</strong>{c.regions.join('、')}</p>}
      <h3>利用できる茶類（確認済みの組み合わせのみ）</h3>
      {uses.length === 0
        ? <p className="unknown-box">この品種と茶類の組み合わせは、公的資料・研究で未確認です。品種と茶類は固定の組み合わせではありません。</p>
        : <ul>{uses.map((u) => (
          <li key={u.kindId}><strong>{kindNameOf(u.kindId)}</strong>（{USE_STATUS_LABEL[u.status]}）
            <SourceLinks ids={u.sourceIds} /></li>
        ))}</ul>}
      <p className="note-small">ここに無い組み合わせは「存在しない」ではなく「未確認」です。実測済みとは扱いません。</p>
      <CultivarWheelSection cultivarId={c.id} cultivarName={c.name} />
      <h3>科学的な所見</h3>
      <ScienceNote science={c.verification.science} note={c.scienceNote} />
      <FindingsList findings={c.findings} />
      {c.note && <><h3>注記</h3><p>{c.note}</p></>}
      <SourceLinks ids={c.sourceIds} />
      <p><button className="linklike" onClick={() => go('compare-cultivars')}>他の品種と比べる／同じ品種の茶類を比べる</button></p>
    </div>
  )
}

export function CacaoDetail({ layer, id }: { layer: CacaoLayer; id: string }) {
  const trad = layer === 'traditional' ? traditionalGroupById(id) : undefined
  const gen = layer === 'genetic' ? geneticGroupById(id) : undefined
  const clone = layer === 'clone' ? cacaoCloneById(id) : undefined
  const entity = trad ?? gen ?? clone
  if (!entity) return <p className="unknown-box">その分類・系統は収録されていません。</p>
  const title = trad ? `${trad.nameJa}（${trad.name}）` : entity.name
  return (
    <div>
      <BackButton fallback="cultivars" />
      <h2>{title}</h2>
      <p>
        <span className="badge">{CACAO_LAYER_LABEL[layer]}</span>
        {entity.aliases.length > 0 && <span className="note-small"> 別名：{entity.aliases.join('、')}</span>}
      </p>
      <VerificationBadges v={entity.verification} />
      {trad && <><h3>この分類について</h3><p>{trad.nature}</p></>}
      {gen && <>
        <p><strong>命名の由来：</strong>{gen.namingBasis}</p>
        {gen.distribution && <p><strong>分布：</strong>{gen.distribution}</p>}
        <p><strong>分類体系：</strong>{gen.classificationSystem}</p>
        <p className="note-small">遺伝集団は伝統的分類とは別の体系です。無条件に一対一対応させることはしません。また、遺伝的分類だけから個別のチョコレートの味を断定することはできません（発酵・乾燥・焙煎・配合の影響が別にあります）。</p>
      </>}
      {clone && <>
        <p><strong>原産・由来：</strong>{clone.origin}</p>
        {clone.breeding && <><h3>育成・系譜</h3><p>{clone.breeding}</p></>}
        {clone.ancestry && clone.ancestry.length > 0 && <>
          <h3>遺伝的背景（祖先構成）</h3>
          <ul>{clone.ancestry.map((a) => {
            const g = geneticGroupById(a.groupId)
            return <li key={a.groupId}>{g ? <button className="linklike" onClick={() => go('cacao/genetic/' + g.id)}>{g.name}</button> : a.groupId}：{a.sharePercent}%</li>
          })}</ul>
          <p className="note-small">単一の遺伝集団に帰属するのではなく、複数の集団の混合として実測された構成です。</p>
          <SourceLinks ids={clone.ancestrySourceIds ?? []} />
        </>}
        {clone.associatedGroupIds && clone.associatedGroupIds.length > 0 && (
          <p>関連する系列：
            {clone.associatedGroupIds.map((gid, i) => {
              const g = geneticGroupById(gid)
              return <span key={gid}>{i > 0 && '、'}{g ? <button className="linklike" onClick={() => go('cacao/genetic/' + g.id)}>{g.name}</button> : gid}</span>
            })}
            <span className="note-small">（系列の本拠を示す関連であり、単一集団への帰属の断定ではありません）</span>
          </p>
        )}
      </>}
      <LineageWheelSection layer={layer} id={id} entityName={title} hasFlavorFindings={entity.findings.some((f) => FLAVOR_FINDING_KINDS.includes(f.kind))} />
      <h3>科学的な所見</h3>
      <ScienceNote science={entity.verification.science} note={entity.scienceNote} />
      <FindingsList findings={entity.findings} />
      {entity.note && <><h3>注記</h3><p>{entity.note}</p></>}
      <SourceLinks ids={entity.sourceIds} />
      <p><button className="linklike" onClick={() => go('compare-cultivars')}>他の系統と比べる</button></p>
    </div>
  )
}

function LineageWheelSection({ layer, id, entityName, hasFlavorFindings }: {
  layer: CacaoLayer; id: string; entityName: string; hasFlavorFindings: boolean
}) {
  const wheels = useMemo(() => lineageWheels(layer, id), [layer, id])
  const tabs: WheelTab[] = wheels.map((w) => ({
    key: w.kind,
    label: w.kindLabel,
    notes: w.notes,
    overallLevel: w.overallLevel,
    context: w.context,
    footer: <p><button className="linklike" onClick={() => go(w.comboPath)}>「{entityName} × {w.kindLabel}」の組み合わせページで、産地違いや根拠の内訳を見る</button></p>,
  }))
  return (
    <>
      <h3>種類との組み合わせで見る味わい（フレーバーホイール）</h3>
      <p className="note-small">ホイールは、種類のプロファイルを土台に、系統の所見を重ねた<strong>組み合わせの推測</strong>です。{entityName}固有の実測プロファイルではありません。系統固有の実測がある部分は、下の「科学的な所見」に分けて示します。</p>
      {!hasFlavorFindings && <p className="unknown-box">この系統については、香味の科学的な所見が確認できていません。そのためホイールは種類一般のプロファイルの表示であり、系統の情報は味わいの推測に使っていません。遺伝的分類だけから味を断定することはしません。</p>}
      <EntityWheelTabs tabs={tabs} />
    </>
  )
}

const EVIDENCE_LABEL: Record<string, string> = {
  measured: '産地の香味実測あり',
  general: '組成・集団レベルの知見のみ',
  none: '香味データ未確認',
}

export function OriginDetail({ id }: { id: string }) {
  const o = cacaoOriginById(id)
  if (!o) return <p className="unknown-box">その産地は収録されていません。</p>
  const trads = o.relatedTraditionalIds.map((x) => traditionalGroupById(x)).filter((g) => !!g)
  const gens = o.relatedGeneticGroupIds.map((x) => geneticGroupById(x)).filter((g) => !!g)
  const clones = o.relatedCloneIds.map((x) => cacaoCloneById(x)).filter((g) => !!g)
  return (
    <div>
      <BackButton fallback="cultivars" />
      <h2>{o.name}</h2>
      <p>
        <span className="badge">産地</span> <span className="badge">{EVIDENCE_LABEL[o.flavorEvidence]}</span>
      </p>
      <VerificationBadges v={o.verification} />
      <p className="note-small">産地は品種ではありません。産地と遺伝（伝統的分類・遺伝集団・クローン）は多対多の関係にあり、この産地の名前から原料の系統や味を決めることはできません。</p>
      {o.regions.length > 0 && <>
        <h3>下位地域</h3>
        <ul>{o.regions.map((r) => <li key={r.name}><strong>{r.name}</strong>：{r.note}</li>)}</ul>
      </>}
      {o.tradeNames.length > 0 && <>
        <h3>産地に付随する呼称（品種名ではありません）</h3>
        <ul>{o.tradeNames.map((t) => {
          const linked = t.linkedGeneticGroupId ? geneticGroupById(t.linkedGeneticGroupId) : undefined
          return (
            <li key={t.name}><strong>{t.name}</strong>（{t.kind === 'grade' ? 'グレード名' : '商業・香味の呼称'}）：{t.note}
              {linked && <> 関連する遺伝集団：<button className="linklike" onClick={() => go('cacao/genetic/' + linked.id)}>{linked.name}</button></>}
            </li>
          )
        })}</ul>
      </>}
      {(trads.length > 0 || gens.length > 0 || clones.length > 0) && <>
        <h3>関連する系統</h3>
        <p className="note-small">この産地で確認されている関連です。産地全体が単一の系統からなるという意味ではありません。</p>
        <div className="filter-row">
          {trads.map((g) => <button key={g!.id} className="chip" onClick={() => go('cacao/traditional/' + g!.id)}>{g!.nameJa}（{g!.name}）</button>)}
          {gens.map((g) => <button key={g!.id} className="chip" onClick={() => go('cacao/genetic/' + g!.id)}>{g!.name}</button>)}
          {clones.map((c) => <button key={c!.id} className="chip" onClick={() => go('cacao/clone/' + c!.id)}>{c!.name}</button>)}
        </div>
      </>}
      <h3>科学的な所見</h3>
      <ScienceNote science={o.verification.science} note={o.scienceNote} />
      <FindingsList findings={o.findings} />
      {o.referenceNotes && o.referenceNotes.length > 0 && <>
        <h3>参考情報（査読された実測ではありません）</h3>
        <p className="note-small">メーカー・事業者・団体の発信です。上の科学的な所見とは区別して表示し、推測やペアリングの根拠には使いません。</p>
        {o.referenceNotes.map((r, i) => (
          <article className="temporal-card" key={i}>
            <p><span className="badge">参考情報</span></p>
            <p>{r.text}</p>
            <SourceLinks ids={r.sourceIds} />
          </article>
        ))}
      </>}
      {o.note && <><h3>注記</h3><p>{o.note}</p></>}
      <SourceLinks ids={o.sourceIds} />
    </div>
  )
}
