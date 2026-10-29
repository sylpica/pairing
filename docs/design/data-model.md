# データモデル設計 v1

層分離（指示書§14）に対応する TypeScript 型（src/types.ts）と JSON互換データ（src/data/）。

## エンティティ
- `Source` 論文・資料: id, 種別（original/review/manufacturer/general）, タイトル, 著者, 年, 掲載誌, DOI/PMID, URL, 対象試料, 分析手法, 適用範囲, ライセンス, 確認状況。測定値そのものは転載せず、要約とリンクで保持する。
- `Compound` 化合物: id, 正式名, 別名, 関連する香味（flavorNoteId）, 平易な説明, 根拠区分（検出事実 / 香りの知見 / 寄与根拠）を分けて持つ `evidenceNotes`。同義語・異性体の誤統合を防ぐため CAS 等は確認できた場合のみ任意保持。
- `FlavorCategory` / `FlavorNote` 香味分類辞書（docs/design/flavor-taxonomy.md）。
- `FlavorProfile` 対象の香味: entries[] = { noteId, intensity: weak|normal|strong|unknown, basis: measured|sensory|review|general, sourceIds[], note }。味覚は別: tastes = { sweet, sour, bitter, astringent, umami } 同形式。時間変化 temporal = { first, middle, finish } 各 { text, basis, sourceIds }、根拠がなければ text は空＝「情報不足」表示。
- `TeaCultivar` 品種（品種名・品種群は別概念として level を持つ）, `TeaKind` 茶類・呼称: 六大茶類（category）＋日常呼称（form: 抹茶・ほうじ茶等は category と分離）, `TeaItem` 表示対象 = { cultivarId?, kindId, profile, evidenceLevel, scopeNote }。実測例のない cultivar×kind は TeaItem を作らない。
- `ChocolateItem`: { kind: dark|milk|white|other, cacaoPercent（代表値）, origin?, varietyGroup?, profile, evidenceLevel, productRef? }。実在商品は `Product` として分離し、商品固有情報と一般的分類参考情報を区別する。
- `EvidenceLevel`（推定区分）: measured（実測・官能あり）/ general（一般的知見）/ exploratory（探索的予想）/ insufficient（情報不足）。

## バリデーション
- 全 profile entry は実在する noteId / sourceId を参照すること（テストで検証）。
- intensity=unknown の entry は表示しない代わりに「不明」扱いを明示できるよう、欠損は entry 欠如ではなく unknown でも保持可。ただし根拠のない entry 自体を作らない。
- DOI形式・重複ID・未参照化合物を CI テストで検出する。
