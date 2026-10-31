import type { FlavorProfile } from '../types'
import ProfileWheelPanel from './ProfileWheelPanel'
import { SourceLinks } from './SourceLinks'
import type { CompoundContext } from '../data/compounds'

export { LEVEL_LABEL, BASIS_LABEL, SourceLinks } from './SourceLinks'

export default function ProfileView({ profile, scopeNote, sourceIds, context }: {
  profile: FlavorProfile
  scopeNote: string
  sourceIds: string[]
  /** 成分の階層表示（この茶類・種類での研究例／全般の研究例の区別）に使う表示中アイテムの情報 */
  context?: CompoundContext
}) {
  const temporal = [
    { label: '最初の印象', stage: profile.temporal.first },
    { label: '口の中で広がる', stage: profile.temporal.middle },
    { label: '余韻', stage: profile.temporal.finish },
  ]
  return (
    <div>
      {/* 第7弾・課題B-4: アイテム詳細にも「香り／味」切り替えを付ける。
          味モードは味覚プロファイルをホイール表示し、従来の味覚チャート
          （棒グラフ）はホイール下のチップ一覧＋詳細シート（関係成分つき）で代替する。 */}
      <ProfileWheelPanel profile={profile} context={context} />
      <h3>香味の移り変わり</h3>
      <div className="temporal">
        {temporal.map((t) => (
          <div className="temporal-card" key={t.label}>
            <h4>{t.label}</h4>
            {t.stage.text ? <p>{t.stage.estimated && <span className="badge">推測（未検証）</span>}{t.stage.text}</p> : <p className="unknown-box">情報不足（時間変化の検証データは未収録）</p>}
          </div>
        ))}
      </div>
      <h3>このデータについて</h3>
      <p>{scopeNote}</p>
      <SourceLinks ids={[...new Set([...sourceIds, ...Object.values(profile.tastes).flatMap((t) => t.sourceIds), ...Object.values(profile.temporal).flatMap((t) => t.sourceIds)])]} />
    </div>
  )
}
