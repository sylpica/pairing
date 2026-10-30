# 品種・系統データモデル設計（追加指示 2026-10-30 対応）

追加指示（docs/REQUIREMENTS-ADDENDUM-CULTIVARS.md）第7章の論理モデルを、既存の型・データ
（src/types.ts、src/data/）へ対応させる設計。既存の表示データ（お茶14件・チョコ5件・化合物・
出典・香味ノート）は変更せず、品種・系統レイヤーを**加算のみ**で追加する。

## 1. 論理モデル → 実装型の対応

| 論理モデル（追加指示§7） | 実装 | 置き場所 | 備考 |
|---|---|---|---|
| TeaCultivar | `TeaCultivar` | src/data/cultivars.ts | 品種・クローン・在来系統・集団・品種群を `rank` で区別する |
| TeaType | 既存 `TeaKind` を流用 | src/data/teas.ts | 六大茶類（category）と製品形態（form）を分離済み。新規追加しない |
| TeaSample | **エンティティ化しない** | — | 試料条件は `EntityFinding.conditions` と各 Source の `scope` に保持する（下記§4） |
| CocoaTraditionalGroup | `CacaoTraditionalGroup` | src/data/cacao.ts | 伝統的3分類。遺伝集団への対応フィールドは持たない |
| CocoaGeneticGroup | `CacaoGeneticGroup` | src/data/cacao.ts | Motamayor et al. 2008 の10集団。分類体系名を `classificationSystem` に保持 |
| CocoaClone | `CacaoClone` | src/data/cacao.ts | 個別クローン。単一集団への帰属フィールドは持たない（§5） |
| CocoaSample | **エンティティ化しない** | — | TeaSample と同じ扱い（finding の conditions に保持） |
| ChocolateProduct | 既存 `ChocolateItem` を流用 | src/data/chocolates.ts | 今回は変更しない。カカオ系統と製品は将来 `originGroupIds` 等で緩く参照する余地を残すが、遺伝分類のみから製品の味を断定しない原則のため、今回は結線しない |
| Compound | 既存 `Compound` を流用 | src/data/compounds.ts | 今回 +2件（アントラニル酸メチル、EGCG3″Me）。finding 側から `compoundId` で参照 |
| CompoundMeasurement | **エンティティ化しない** | — | 定量値は転載しない既存方針（data-model.md v1）を維持。測定の事実と条件は finding の statement/conditions に要約して保持 |
| SensoryObservation | `EntityFinding`（kind='sensory'） | 型は src/types.ts | 官能の所見は finding として出典つきで保持。成分分析（composition等）と kind で分離 |
| FlavorDescriptor | 既存 `FlavorNote`/`FlavorCategory` を流用 | src/data/flavors.ts | 品種レイヤーから香味ノートへの直接リンクは作らない（品種固有プロファイルの捏造防止。下記§6） |
| Evidence | `EntityFinding` ＋ `EntityVerification` | src/types.ts | 「主張と根拠の対応」は finding（主張＋出典＋条件）で、「確認状況」は verification で表現 |
| Reference | 既存 `Source` を流用 | src/data/sources.ts | 今回 +18件（検証できたもののみ。下記§7） |
| PairingPrediction | 将来の engine 拡張 | src/types.ts に `DataLevelUsed` 型のみ追加 | 「どの階層のデータを使ったか」を予測に記録するための区分。エンジン実装は次フェーズ |

品種×茶類の組み合わせは独立レコード `CultivarTeaUse`（src/data/cultivars.ts）で表現する（§3）。

## 2. ID 設計

- すべて小文字ケバブケース、安定識別子。一度公開した ID は変更しない。
- 茶品種: 品種名のローマ字表記を基本とする（例: `yabukita`, `sayamakaori`, `qingxin-oolong`,
  `tri-2023`, `av2`）。漢字名の品種は読みで命名（`koushun`＝香駿、`hongyu`＝紅玉）。
- カカオ: 階層が ID からも分かるよう接頭辞を付ける。伝統分類 `trad-criollo` 等、
  遺伝集団 `gen-nacional` 等、クローンは名称そのまま（`ccn-51`, `ics-95`, `imc-67`）。
  伝統的 Criollo（`trad-criollo`）と遺伝集団 Criollo（`gen-criollo`）は**別 ID・別エンティティ**
  であり、同一視しない。
- 出典: 既存規則（著者-年-主題）を踏襲。
- 親品種への参照は `parentCultivarIds`（登録済み品種の ID のみ。未登録の親は `breeding`
  テキスト内に記す）。

## 3. 品種×茶類の「確認済み組み合わせ」の表現

- 品種エンティティに茶類を埋め込まず、`CultivarTeaUse { cultivarId, kindId, status, sourceIds }`
  の配列で独立管理する。「やぶきた＝緑茶」のような固定結び付けを構造的に避けるためである。
- `status` の意味:
  - `studied`: 査読研究の試料としてその組み合わせが実際に供試されたことが確認でき、出典を
    登録済みであるもの。**sourceIds は必須（非空）**。
  - `documented`: 公的資料・調査記録で利用・適性が確認できるもの。出典リンクを検証できた
    場合は sourceIds を付ける。
- 組み合わせが存在しないことと、存在するが未確認であることは区別する。未確認の組み合わせは
  レコード自体を作らない（＝「実測済みと扱わない」の構造的担保）。
- 逆に、品種×茶類の研究データがある場合は TeaItem 側ではなく finding（品種側）に優先して
  記録する。既存 TeaItem は茶類・形態レベルの表示対象であり、今回変更しない。

## 4. 出典・確認状況の持ち方

- 各エンティティは `verification: { existence, classification, science }` を持つ
  （追加指示§9の進捗管理：存在確認／分類確認／科学データ確認に対応）。
  - existence / classification: `confirmed | partial | unconfirmed`
  - science: `peer-reviewed`（査読論文のデータあり）/ `partial`（公的調査・育成時評価・
    条件付きデータのみ、または出典リンク未検証のため所見登録を見送った状態）/ `unconfirmed`
- 科学データは `findings: EntityFinding[]` に集約する。各 finding は
  `{ kind, statement, conditions?, compoundId?, sourceIds }` で、**sourceIds は必須・非空**。
  - kind: `detection`（検出・含有の事実）/ `composition`（組成の実測）/ `contribution`
    （AEDA・再構成実験等による寄与の根拠）/ `sensory`（官能評価）/ `genetic`（遺伝・系譜の
    実測）/ `classification`（分類上の位置付けの根拠）。
  - 「検出≠寄与」の原則は kind の分離で担保する。機能性成分の含有（例: べにふうきの
    EGCG3″Me）は `composition` として記録し、statement/conditions に「香味の根拠ではない」
    旨を必ず併記する。
  - 条件付きデータ（香気発揚処理・強遮光・焙煎度など）は `conditions` に条件を保持し、
    条件を落として一般化しない。
- `science === 'unconfirmed'` のエンティティは、香味系 kind（detection / composition /
  contribution / sensory）の finding を持たない（テストで検証）。genetic / classification の
  finding は持ちうる（例: 鉄観音の葉緑体ゲノムは香味データではない）。
- `scienceNote` は「なぜその状態なのか」の説明専用フィールド。特に、調査では査読論文の
  存在が確認できたが本実装で出典リンクを検証できず所見登録を見送った場合、その旨をここに
  明記する（未確認を黙って埋めない・黙って落とさないため）。

## 5. カカオの階層分離（伝統分類・遺伝集団・クローン）

- 3階層は別型・別配列で管理し、**伝統分類 ↔ 遺伝集団の一対一対応フィールドは型に存在しない**
  （追加指示§3.1/§3.2、調査 cacao-genetics.md §2-4）。対応関係を述べる必要がある場合は
  `nature` / `note` の文章に出典と留保つきで記すに留める。
- クローンの遺伝的背景は単一集団への帰属ではなく、混合構成 `ancestry: { groupId,
  sharePercent }[]`（出典つき）で表す（CCN-51 の Boza et al. 2014 による定量）。
  系列の本拠を示す場合は `associatedGroupIds` を使うが、これは帰属の断定ではないことを
  エンティティの note に明記する（IMC-67 → Iquitos 系列）。
- Nacional の4用法（遺伝集団／伝統的栽培品種／商業呼称 Arriba／体系による位置付けの揺れ）は
  `gen-nacional` の note に区別して記録する。Arriba は集団名ではないためエンティティ化しない。

## 6. 香味プロファイルを持たせない原則

- `TeaCultivar` / `Cacao*` の各型は `FlavorProfile` フィールドを**持たない**。品種・系統に
  ついて表示できるのは finding（出典つきの事実）までであり、弱い・普通・強いの強度つき
  プロファイルは、品種×茶類の実測・官能が揃った場合に将来 TeaItem として別途作る。
- これにより「科学データ未確認の対象が一般論で埋められたプロファイルを持つ」事態を型レベル
  で防ぐ（テストでも `profile` プロパティの不在を検証する）。

## 7. 出典の追加方針（今回の登録基準）

- 追加指示§9「未確認情報を埋めない」に従い、Source として登録するのは
  (a) 調査文書で DOI・PMID・PMCID 等の書誌が一次確認済みのもの、
  (b) 追加指示§11でユーザーが提示した公式 URL、
  (c) 本作業で J-STAGE・農研機構系リポジトリ等の一次ページでリンクを実地検証できたもの、
  に限る。
- 上記を満たさない論文（例: Liu et al. 2021、Monobe et al. 2015、茶業研究報告 133/126、
  におい・かおり環境学会誌 2015、Johnson et al. 2009）は、存在が調査で確認されていても
  Source 化せず、関係エンティティの `scienceNote` に「出典リンク未検証のため所見登録を
  見送った」と明記する。次フェーズでリンクを検証できれば finding ごと追加できる。
- 公的機関の品種解説（TBRS、京都府茶業研究所、TRI 等）も同様に、リンクを検証できた範囲でのみ
  Source 化する。検証できなかった対象は sourceIds を空にし、note に確認経路（調査文書）を記す。

## 8. 移行方針（既存データを破壊しない）

- 既存ファイルの変更は**追加のみ**: types.ts へ型の追記、sources.ts / compounds.ts へ要素の
  追記。既存の TeaItem / ChocolateItem / Compound / Source の内容・ID は一切変更しない。
- 新規ファイル: src/data/cultivars.ts（茶品種＋組み合わせ）、src/data/cacao.ts（カカオ3階層）、
  src/data/cultivars.test.ts（検証テスト）。
- UI・engine は今回変更しない。将来の連携（品種選択・系統指定ペアリング）は、
  `CultivarTeaUse` と `DataLevelUsed` を起点に次フェーズで実装する。

## 9. 「どの階層のデータを使ったか」の記録（ペアリング予測向け）

将来 PairingPrediction を実装する際、各予測に以下の区分を必須で記録する（型 `DataLevelUsed`
を types.ts に先行追加した）:

- `cultivar-measured`: 品種×茶類（または個別クローン）の実測・官能データを使用
- `cultivar-general`: 品種固有だが条件付き・一般的傾向のデータを使用
- `group-general`: 伝統分類・遺伝集団・茶類など上位階層の一般的特徴を使用
- `kind-general`: 既存 TeaItem / ChocolateItem の茶類・種類レベルの特徴を使用
- `insufficient`: 使用できるデータがなく、予測を表示しない

化合物の一致数・濃度の単純加算を相性・強度とみなすことは、区分に関わらず禁止（既存原則）。
