import type { EntityFinding, EntityVerification, FindingKind, ScienceStatus, VerificationStatus } from '../types'
import { compounds } from '../data/compounds'
import { SourceLinks } from './SourceLinks'
import { go } from '../nav'

// 品種・系統エンティティ（TeaCultivar / Cacao*）の共通表示部品。
// 品種・系統は香味プロファイル（ホイール・味覚グラフ）を持たないため、
// ここでは出典つきの所見（findings）と確認状況だけを表示する。
export const FINDING_LABEL: Record<FindingKind, string> = {
  detection: '検出の事実',
  composition: '組成の実測',
  contribution: '香りへの寄与の根拠',
  sensory: '官能評価',
  genetic: '遺伝・系譜の実測',
  classification: '分類上の位置付け',
}

export const SCIENCE_LABEL: Record<ScienceStatus, string> = {
  'peer-reviewed': '査読論文のデータあり',
  partial: '科学データは一部のみ',
  unconfirmed: '科学データ未確認',
}
const VERIF_LABEL: Record<VerificationStatus, string> = {
  confirmed: '確認済み',
  partial: '一部確認',
  unconfirmed: '未確認',
}

export function VerificationBadges({ v }: { v: EntityVerification }) {
  return (
    <p>
      <span className="badge">存在：{VERIF_LABEL[v.existence]}</span>{' '}
      <span className="badge">分類：{VERIF_LABEL[v.classification]}</span>{' '}
      <span className="badge">{SCIENCE_LABEL[v.science]}</span>
    </p>
  )
}

/** 出典つき所見の一覧。検出・組成と寄与・官能を種別バッジで区別して示す。 */
export function FindingsList({ findings }: { findings: EntityFinding[] }) {
  if (findings.length === 0) return null
  return (
    <div>
      {findings.map((f, i) => {
        const compound = f.compoundId ? compounds.find((c) => c.id === f.compoundId) : undefined
        return (
          <article className="temporal-card" key={i}>
            <p><span className="badge">{FINDING_LABEL[f.kind]}</span>{compound && <> 関連成分：<button className="linklike" onClick={() => go(`compounds/${compound.id}`)}>{compound.name}の詳細を見る</button></>}</p>
            <p>{f.statement}</p>
            {f.conditions && <p className="note-small">条件・注意：{f.conditions}</p>}
            <SourceLinks ids={f.sourceIds} />
          </article>
        )
      })}
    </div>
  )
}

/** 科学データが無い／一部のみの対象に、未確認である旨を正直に示す。 */
export function ScienceNote({ science, note }: { science: ScienceStatus; note?: string }) {
  if (science === 'peer-reviewed' && !note) return null
  return (
    <div className="unknown-box">
      <p><strong>{SCIENCE_LABEL[science]}</strong></p>
      {note && <p>{note}</p>}
      {science === 'unconfirmed' && <p>科学データが確認できていないため、香味の特徴（フレーバーホイールや味覚）は表示しません。一般的な傾向で埋めることはしません。</p>}
    </div>
  )
}
