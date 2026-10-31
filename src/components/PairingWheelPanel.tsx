import type { ReactNode } from 'react'
import type { ComboNote, Compound } from '../types'
import { COMBO_BASIS_FROM_LABEL, COMBO_LEVEL_LABEL } from '../engine/combo'
import type { PairingWheelData } from '../engine/pairingWheel'
import { tierInContexts } from '../engine/wheelTiers'
import TieredWheelPanel from './TieredWheelPanel'
import ComboTasteDetail from './ComboTasteDetail'
import CompoundCard from './CompoundCard'
import { SourceLinks } from './SourceLinks'
import { COMBO_INT_LABEL } from './wheelText'
import { noteById } from '../data/flavors'
import { compoundsForNote, compoundById } from '../data/compounds'
import { inferencesFor } from '../data/inferences'

// ペアリング結果（第3層）の3階層ホイール（第26弾）。
// 両側の組み合わせプロファイルをノート単位で統合し、相互作用で重みを
// 調整して代表ノート最大7件に絞った結果（engine/pairingWheel.ts）を、
// 他の画面と同じ TieredWheelPanel で表示する。文脈は2側の和集合。
// ホイール全体が推測であることは、凡例ボックス内（legendExtra）に集約して
// 明示する（第19弾の原則: 根拠・状態系チップは凡例ボックス内へ）。

const PAIR_TIER_HEADING: Record<1 | 2 | 3, string> = {
  1: 'どちらか一方の分類・種類の試料での研究例',
  2: 'お茶・チョコレート全般の研究例',
  3: '他の食品・茶類での研究例',
}

function PairingNoteDetail({ note, data }: { note: ComboNote; data: PairingWheelData }) {
  const def = noteById(note.noteId)
  const meta = data.noteMeta.get(note.noteId)
  const linked = compoundsForNote(note.noteId)
  const tiers: { tier: 1 | 2 | 3; items: Compound[] }[] = [1, 2, 3].map((tier) => ({
    tier: tier as 1 | 2 | 3,
    items: linked.filter((c) => tierInContexts(c, data.contexts) === tier),
  }))
  const hasTier1 = tiers[0].items.length > 0
  const inferences = data.contexts.flatMap((ctx) =>
    ctx.itemId
      ? inferencesFor(ctx.side, ctx.itemId, note.noteId).map((inf) => ({ inf, itemName: ctx.itemName }))
      : [])
  return (
    <section className="note-detail" aria-live="polite">
      <h3>{def?.name ?? note.noteId} <span className="badge">{COMBO_INT_LABEL[note.intensity]}・{COMBO_LEVEL_LABEL[note.level]}</span></h3>
      {def && <p>{def.example}</p>}
      {meta && (
        <>
          <h4>組み合わせでの扱い（推測）</h4>
          <p className="note-small">この香りは、両側の組み合わせプロファイル（第2層）を統合した第3層の推測として、代表的な味わいに選ばれています。各側の記録と、発火した相互作用による重みの調整は以下のとおりです。</p>
          <ul className="wheel-list">
            {meta.contributions.map((c, i) => (
              <li key={i} className="note-small">
                {c.sideLabel}：{c.note
                  ? `「${def?.name ?? note.noteId}」の記録あり（${COMBO_INT_LABEL[c.note.intensity]}）`
                  : '記録なし'}
                {c.factor > 1 && '／相互作用で重みを強める方向に調整'}
                {c.factor < 1 && '／相互作用で重みを抑える方向に調整'}
              </li>
            ))}
          </ul>
          {meta.adjustments.map((adj) => (
            <p key={adj.ruleId} className="note-small">相互作用「{adj.label}」：{adj.phrase}。</p>
          ))}
        </>
      )}
      <h4>各側の根拠</h4>
      {meta?.contributions.map((c, i) => {
        if (!c.note) return null
        const texts = c.note.basis.filter((b) => b.text)
        return (
          <div key={i}>
            <p><strong>{c.sideLabel}</strong> <span className="badge">{COMBO_INT_LABEL[c.note.intensity]}・{COMBO_LEVEL_LABEL[c.note.level]}</span></p>
            {texts.length > 0
              ? texts.map((b, j) => (
                <div key={j}>
                  <p><span className="badge">{COMBO_BASIS_FROM_LABEL[b.from]}</span></p>
                  <p>{b.text}</p>
                  <SourceLinks ids={b.sourceIds} />
                </div>
              ))
              : <p className="note-small">土台アイテムのプロファイルに記録された香りです。強さと根拠はプロファイルの記録に基づきます。</p>}
          </div>
        )
      })}
      <h4>この香りに関係する成分</h4>
      {linked.length === 0 && (
        <p className="note-small">この香味に直接結びつく成分データは、検証済み文献の範囲では未収録です（香りの根拠は上の内訳のとおりです）。架空の成分は表示しません。</p>
      )}
      {linked.length > 0 && !hasTier1 && (
        <p className="note-small">両側のアイテムそのもの（個別の試料）での成分情報は未確認です。以下は、より広い範囲の研究例です。一般的な知見を、この組み合わせでの実測のように表示することはしません。</p>
      )}
      {tiers.map(({ tier, items }) => items.length > 0 && (
        <div key={tier}>
          <h5 className="tier-head">{PAIR_TIER_HEADING[tier]}</h5>
          {items.map((c) => <CompoundCard key={c.id} compound={c} />)}
        </div>
      ))}
      {inferences.length > 0 && (
        <div className="inference-box">
          <h4>科学的な推測 <span className="badge badge-inferred">推測（未検証）</span></h4>
          <p className="note-small">「{def?.name ?? note.noteId}」という漠然とした香りについて、土台のアイテム（またはその茶類・種類）で確認されている成分の顔ぶれから、具体的な花・果物への類似を推測したものです。実測でその花・果物と確認されたものではありません。</p>
          {inferences.map(({ inf, itemName }) => (
            <div key={`${itemName}:${inf.label}`} className="inference-item">
              <p><strong>{inf.label}</strong> <span className="badge badge-inferred">推測（未検証）</span> <span className="note-small">（{itemName}の成分から）</span></p>
              <p>{inf.rationale}</p>
              <p className="note-small">根拠成分：{inf.basisCompoundIds.map((id) => compoundById(id)?.name ?? id).join('、')}{inf.basisGrading === 'reference-assisted' && '／具体名の香り記述には参考情報（記事・データベース等）を含みます'}</p>
            </div>
          ))}
        </div>
      )}
      <SourceLinks ids={note.sourceIds} />
    </section>
  )
}

export default function PairingWheelPanel({ data, resetKey }: {
  data: PairingWheelData
  /** 組み合わせが変わったら選択とモードを戻すためのキー */
  resetKey?: string
}) {
  const legendExtra: ReactNode = (
    <>
      <p className="note-small"><span className="badge badge-inferred">推測（未検証）</span></p>
      <p className="note-small">このホイールは、組み合わせ全体の味わいの推測（第3層）です。両側の組み合わせプロファイル（第2層）の香味ノートをノート単位の重みで統合し、文献に基づく相互作用（強まる・弱まる）で調整したうえで、代表的な味わいを最大7種類に絞って示しています。割合は裏付けデータから算出した目安で、実測の含有率ではありません。</p>
      {data.candidateCount > data.notes.length && (
        <p className="note-small">候補になった香りは{data.candidateCount}種類あり、重みの大きい順に{data.notes.length}種類を示しています。</p>
      )}
      {data.underMinimum && (
        <p className="note-small">両側の記録から候補になる香りが{data.candidateCount}種類しかないため、代表的な味わいは{data.notes.length}種類だけになっています。根拠のない香りは作りません。</p>
      )}
    </>
  )
  return (
    <TieredWheelPanel
      notes={data.notes}
      tastes={data.tastes}
      contexts={data.contexts}
      resetKey={resetKey}
      legendExtra={legendExtra}
      ariaLabel="組み合わせの味わいのフレーバーホイール（推測）"
      renderNoteDetail={(note) => <PairingNoteDetail note={note} data={data} />}
      renderTasteDetail={(taste) => <ComboTasteDetail taste={taste} />}
    />
  )
}
