import { useEffect, useMemo, type ReactNode } from 'react'
import { teaKinds } from '../data/teas'
import { chocolateItems } from '../data/chocolates'
import { teaCultivars } from '../data/cultivars'
import { cacaoOrigins } from '../data/origins'
import { teaRegionById } from '../data/teaRegions'
import {
  TEA_COMBO_KINDS, CHOCO_KIND_LABEL,
  teaComboViable, teaComboViableAnyKind, teaOriginComboRegionIdOfValue,
  teaKindOptions, teaItemOptions, teaRegionOptionGroups, teaCultivarOptions,
  chocoOriginOptions, chocoLineageOptions, cloneRecordedOriginIds,
  type ChocoComboSel,
} from '../engine/combo'
import type { CacaoLayer } from '../engine/pairingContext'

// 「調べる」と「組み合わせる」で共通の、分類・産地・品種（系統）の3軸プルダウン。
// 選択肢の集合・ラベル・グループ構成・連動の挙動は両画面で完全に同一にする
// （2026-10-31 実機フィードバック第2弾の指示7）。
// 表示/非表示の基準は「その組み合わせが存在するか」（指示8差し替え＋基準明確化）:
// - 存在しない組み合わせ（データ上成立しないもの）になる選択肢は出さない（隠す）。
//   グレーアウト（disabled）は使わない。
// - 存在する組み合わせは必ず出す。お茶側は組み合わせエンジンの成立モデル
//   （teaComboViable：品種×茶類の確認記録、品種の国と産地の国の一致）に一致させる。
// - チョコ側は種類×産地×系統を相互に制限しない（自由化）。唯一の例外はクローン
//   階層で、記録のある産地だけに絞る（cloneRecordedOriginIds、エンジン側で機械的に導出）。
// - 無効になった選択は自動でリセットする（normalize が担保し、復元された古い
//   選択に対してもマウント時に効く）。

export interface TeaSelectsState {
  /** '' = 指定なし / 茶類ID（大分類） / アイテムID（具体的なお茶） */
  kind: string
  /** '' = 指定なし / '<国名>' = 国レベル / 'region:<地域ID>' = 地域レベル */
  origin: string
  /** '' = 指定なし / 品種ID */
  cultivar: string
}
export interface ChocoSelectsState {
  /** '' = 指定なし / 種類ID（大分類） / アイテムID（具体的なチョコ） */
  kind: string
  /** '' = 指定なし / 産地ID */
  origin: string
  /** '' = 指定なし / '<layer>:<系統ID>' */
  lineage: string
}

type Variant = 'hero' | 'pair'
interface AxisLabels { kind: string; origin: string; cultivar: string }
interface AxisHeads { kind: ReactNode; origin: ReactNode; cultivar: ReactNode }

function Field({ variant, head, children }: { variant: Variant; head: ReactNode; children: ReactNode }) {
  if (variant === 'hero') {
    return (
      <label className="filter-field">
        <span className="filter-label">{head}</span>
        {children}
      </label>
    )
  }
  return <label>{head} {children}</label>
}
const selectClass = (variant: Variant) => (variant === 'hero' ? 'big-select' : undefined)

// ===== お茶側 =====

const teaViableWith = (kind: string, regionId: string, cultivarId: string): boolean =>
  kind ? teaComboViable({ kindId: kind, regionId, cultivarId }) : teaComboViableAnyKind({ regionId, cultivarId })

export function normalizeTeaSelects(s: TeaSelectsState): TeaSelectsState {
  let { kind, origin, cultivar } = s
  if (cultivar && !teaViableWith(kind, teaOriginComboRegionIdOfValue(origin), cultivar)) cultivar = ''
  if (origin && !teaViableWith(kind, teaOriginComboRegionIdOfValue(origin), cultivar)) origin = ''
  if (kind && !teaComboViable({ kindId: kind, regionId: teaOriginComboRegionIdOfValue(origin), cultivarId: cultivar })) kind = ''
  return { kind, origin, cultivar }
}

export function TeaComboSelects({ value, onChange, variant, labels, heads, emptyKindLabel = '指定しない' }: {
  value: TeaSelectsState
  onChange: (next: TeaSelectsState) => void
  variant: Variant
  labels: AxisLabels
  heads: AxisHeads
  emptyKindLabel?: string
}) {
  const regionId = teaOriginComboRegionIdOfValue(value.origin)
  const kindOpts = useMemo(
    () => teaKindOptions({ kindId: '', regionId, cultivarId: value.cultivar }),
    [regionId, value.cultivar])
  const itemOpts = useMemo(
    () => teaItemOptions({ kindId: '', regionId, cultivarId: value.cultivar }),
    [regionId, value.cultivar])
  const regionGroups = useMemo(() => {
    // 分類未指定のときは「いずれかの分類で存在する」産地を和集合で出す
    const kinds = value.kind ? [value.kind] : TEA_COMBO_KINDS
    const byCountry = new Map<string, Map<string, { value: string; label: string }>>()
    for (const k of kinds) {
      for (const g of teaRegionOptionGroups({ kindId: k, regionId: '', cultivarId: value.cultivar })) {
        let m = byCountry.get(g.country)
        if (!m) { m = new Map(); byCountry.set(g.country, m) }
        for (const o of g.options) {
          if (o.id.startsWith('country:')) m.set(o.id, { value: g.country, label: '国全体' })
          else m.set(o.id, { value: `region:${o.id}`, label: teaRegionById(o.id)?.name ?? o.label })
        }
      }
    }
    return [...byCountry.entries()].map(([country, m]) => ({ country, options: [...m.values()] }))
  }, [value.kind, value.cultivar])
  const cultivarOpts = useMemo(() => {
    if (value.kind) return teaCultivarOptions({ kindId: value.kind, regionId, cultivarId: '' })
    const ids = new Set<string>()
    for (const k of TEA_COMBO_KINDS) for (const c of teaCultivarOptions({ kindId: k, regionId, cultivarId: '' })) ids.add(c.id)
    return teaCultivars.filter((c) => ids.has(c.id))
  }, [value.kind, regionId])

  // 復元された選択などが現在の基準で無効なら、自動でリセットする
  useEffect(() => {
    const n = normalizeTeaSelects(value)
    if (n.kind !== value.kind || n.origin !== value.origin || n.cultivar !== value.cultivar) onChange(n)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.kind, value.origin, value.cultivar])

  const update = (patch: Partial<TeaSelectsState>) => onChange(normalizeTeaSelects({ ...value, ...patch }))
  return (
    <>
      <Field variant={variant} head={heads.kind}>
        <select className={selectClass(variant)} value={value.kind} onChange={(e) => update({ kind: e.target.value })} aria-label={labels.kind}>
          <option value="">{emptyKindLabel}</option>
          <optgroup label="茶類（大分類）">
            {teaKinds.filter((k) => k.category !== 'form' && kindOpts.includes(k.id)).map((k) => (
              <option key={k.id} value={k.id}>{k.name}</option>
            ))}
          </optgroup>
          <optgroup label="具体的なお茶">
            {itemOpts.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </optgroup>
        </select>
      </Field>
      <Field variant={variant} head={heads.origin}>
        <select className={selectClass(variant)} value={value.origin} onChange={(e) => update({ origin: e.target.value })} aria-label={labels.origin}>
          <option value="">指定しない</option>
          {regionGroups.map((g) => (
            <optgroup key={g.country} label={g.country}>
              {g.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </optgroup>
          ))}
        </select>
      </Field>
      <Field variant={variant} head={heads.cultivar}>
        <select className={selectClass(variant)} value={value.cultivar} onChange={(e) => update({ cultivar: e.target.value })} aria-label={labels.cultivar}>
          <option value="">指定しない</option>
          {cultivarOpts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>
    </>
  )
}

// ===== チョコ側 =====

const parseLineage = (v: string): ChocoComboSel['lineage'] => {
  if (!v) return null
  const [layer, id] = v.split(':') as [CacaoLayer, string]
  return layer && id ? { layer, id } : null
}
/** クローン×産地の記録制約に触れる組み合わせか（記録が無いクローンは常に false） */
const cloneOriginConflict = (lineageValue: string, originId: string): boolean => {
  const lin = parseLineage(lineageValue)
  if (!lin || lin.layer !== 'clone' || !originId) return false
  const recorded = cloneRecordedOriginIds(lin.id)
  return recorded.length > 0 && !recorded.includes(originId)
}

export function ChocoComboSelects({ value, onChange, variant, labels, heads, emptyKindLabel = '指定しない' }: {
  value: ChocoSelectsState
  onChange: (next: ChocoSelectsState) => void
  variant: Variant
  labels: AxisLabels
  heads: AxisHeads
  emptyKindLabel?: string
}) {
  const sel: ChocoComboSel = useMemo(
    () => ({ kind: 'dark', originId: value.origin, lineage: parseLineage(value.lineage) }),
    [value.origin, value.lineage])
  const originOpts = useMemo(() => chocoOriginOptions(sel), [sel])
  const lineageOpts = useMemo(() => chocoLineageOptions(sel), [sel])

  // 復元された選択がクローン×産地の記録制約に触れていたら系統側を自動でリセットする
  useEffect(() => {
    if (cloneOriginConflict(value.lineage, value.origin)) onChange({ ...value, lineage: '' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.lineage, value.origin])

  // 変更した軸を優先し、クローンの記録と両立しなくなった相手側だけを自動で外す
  const update = (patch: Partial<ChocoSelectsState>) => {
    const next = { ...value, ...patch }
    if (patch.origin !== undefined && cloneOriginConflict(next.lineage, next.origin)) next.lineage = ''
    if (patch.lineage !== undefined && cloneOriginConflict(next.lineage, next.origin)) next.origin = ''
    onChange(next)
  }
  const byLayer = (layer: CacaoLayer) => lineageOpts.filter((l) => l.layer === layer)
  return (
    <>
      <Field variant={variant} head={heads.kind}>
        <select className={selectClass(variant)} value={value.kind} onChange={(e) => update({ kind: e.target.value })} aria-label={labels.kind}>
          <option value="">{emptyKindLabel}</option>
          <optgroup label="種類（大分類）">
            {Object.keys(CHOCO_KIND_LABEL).filter((k) => chocolateItems.some((c) => c.kind === k)).map((k) => (
              <option key={k} value={k}>{CHOCO_KIND_LABEL[k]}チョコレート</option>
            ))}
          </optgroup>
          <optgroup label="具体的なチョコレート">
            {chocolateItems.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </optgroup>
        </select>
      </Field>
      <Field variant={variant} head={heads.origin}>
        <select className={selectClass(variant)} value={value.origin} onChange={(e) => update({ origin: e.target.value })} aria-label={labels.origin}>
          <option value="">指定しない</option>
          {cacaoOrigins.filter((o) => originOpts.some((x) => x.id === o.id)).map((o) => (
            <option key={o.id} value={o.id}>{o.name}</option>
          ))}
        </select>
      </Field>
      <Field variant={variant} head={heads.cultivar}>
        <select className={selectClass(variant)} value={value.lineage} onChange={(e) => update({ lineage: e.target.value })} aria-label={labels.cultivar}>
          <option value="">指定しない</option>
          <optgroup label="伝統的分類">{byLayer('traditional').map((l) => <option key={l.id} value={`traditional:${l.id}`}>{l.name}</option>)}</optgroup>
          <optgroup label="遺伝的分類">{byLayer('genetic').map((l) => <option key={l.id} value={`genetic:${l.id}`}>{l.name}</option>)}</optgroup>
          <optgroup label="個別クローン">{byLayer('clone').map((l) => <option key={l.id} value={`clone:${l.id}`}>{l.name}</option>)}</optgroup>
        </select>
      </Field>
    </>
  )
}
