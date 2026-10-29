import type { FlavorProfile, TasteKey } from '../types'
import { TASTE_LABELS } from '../engine/pairing'
import { INT_LABEL } from './FlavorWheel'

const ORDER: TasteKey[] = ['sweet', 'sour', 'bitter', 'astringent', 'umami']
const rank = (i: string) => (i === 'strong' ? 3 : i === 'normal' ? 2 : i === 'weak' ? 1 : 0)
export default function TasteChart({ profile }: { profile: FlavorProfile }) {
  return (
    <div className="taste-chart" role="img" aria-label="味覚と渋味のグラフ">
      {ORDER.map((k) => {
        const t = profile.tastes[k]; const r = rank(t.intensity)
        return (
          <div className="taste-row" key={k}>
            <span className="taste-name">{TASTE_LABELS[k]}{k === 'astringent' ? '（感覚）' : ''}</span>
            <span className="taste-bars" aria-hidden="true">{[1, 2, 3].map((i) => <span key={i} className={i <= r ? 'bar on' : 'bar'} />)}</span>
            <span className="taste-val">{INT_LABEL[t.intensity]}</span>
          </div>
        )
      })}
      <p className="note-small">渋味は基本味ではなく口の中の感覚です。香りとは分けて表示しています。</p>
    </div>
  )
}
