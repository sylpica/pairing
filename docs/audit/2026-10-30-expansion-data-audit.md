# 監査レポート：データ拡充（2026-10-30 取り込み分）の出典範囲逸脱チェック

- 監査日: 2026-10-30
- 監査種別: 読み取り専用監査（アプリのデータファイルは編集していない）
- 基準文書:
  - `docs/research/expansion-candidates.md`（各候補の「支持できる主張／支持できない主張」、アブストラクト範囲）
  - `docs/research/literature-verification.md`（初期6件の検証記録。Zeng et al. 2025 は総説として位置づけられ、個別成分の記述レベルの記録は含まれない）
- 監査対象:
  - `src/data/teas.ts`: sencha / matcha / gyokuro / hojicha / fenghuang-dancong
  - `src/data/chocolates.ts`: milk-chocolate / white-chocolate
  - `src/data/compounds.ts`: indole / methional / nonanal / diethyl-methylpyrazine / delta-decalactone / methyl-heptenone / nerolidol / alpha-ionone
  - `src/data/sources.ts`: 新規11件
- 重大度の定義:
  - **要修正**: アブストラクト範囲を逸脱した断定、または基準文書と食い違う記述があり、修正すべきもの
  - **要検討**: 逸脱とは言い切れないが、換算の非対称・根拠の所在不明・表記の不統一等、判断や補足が望ましいもの
  - **問題なし**: 基準文書の範囲内で正確に反映されていることを確認したもの

## 総括

書誌情報・DOI・PMID に捏造や基準文書との不一致は見つからなかった。強度（weak/normal/strong）はいずれも基準文書の記述以下に抑えられており、過大な読み替えは確認されなかった。**要修正は1件**（δ-デカラクトンの寄与根拠に別化合物の知見を混在させている点）、残りは要検討5件と、範囲内であることを確認した項目群である。

---

## 要修正

### A-1. delta-decalactone の contributionEvidence に δ-tetradecalactone の知見を混在させている

- データ側（`src/data/compounds.ts`、id: `delta-decalactone`）:
  - contributionEvidence: 「ミルクチョコレートの AEDA で高 FD値で同定（Schnermann & Schieberle 1997）。**長鎖 δ-ラクトンは鼻後香のクリーミーさを高めることがクラムチョコレートで示されています（Samfaß et al. 2021）**。」
  - noteIds に `cream` を含む。
- 基準文書（expansion-candidates.md、候補1-2 Samfaß et al. 2021）:
  - クリーミーさを有意に増強したのは **δ-tetradecalactone** であり、「長鎖 δ-ラクトンの認識閾値は 29–40 µmol/kg」は長鎖ラクトン群の閾値の記述。δ-decalactone 自体のクリーミーさ寄与はアブストラクト範囲では示されていない。
- 判定理由: δ-decalactone（炭素数10）と δ-tetradecalactone（同14）は別化合物であり、後者の寄与証拠を前者の contributionEvidence に含め、`cream` ノートへ紐づけるのは「検出／寄与の分離」の観点で化合物の取り違えにあたる。前半（AEDA で高FD・甘い／桃様）は候補1-1の範囲内で正しい。
- 推奨対応: contributionEvidence 後半を削除するか、「同族の長鎖 δ-ラクトン（δ-tetradecalactone）ではクリーミーさ増強が示されている（別化合物の知見）」と別化合物である旨を明示する。`cream` ノートとの紐づけも同根拠に依存する点に留意。

---

## 要検討

### B-1. Tan 2019 の強度換算に非対称がある（ほうじ茶 toast=strong / wood=normal）

- 基準文書（候補4-2 Tan et al. 2019）: 官能面では「ほうじ茶は焙煎様（roasty）と木様（woody）のノートが**高かった**」と、両属性が同じ表現で並記されている。また限界として「フレーバーホイール用の絶対的な強度グレード（弱い／普通／強い）の直接の証明ではない。FD値は相対値であり、全文からの慎重な読み取りと換算方針の設計が別途必要」と明記されている。
- データ側（`src/data/teas.ts`、id: `hojicha`）: toast=strong、wood=normal と、同一表現の2属性に異なるグレードを割り当てている。過大化ではなく、むしろ wood 側は保守的だが、非対称の理由がデータ内・scopeNote 内に記録されていない。
- 参考: 蒸し製3種については「葉様が強い」→ green-leaf=strong、「花様ノートも高い」→ floral-general=normal と、表現の強弱に応じた換算になっており一貫している（問題なし）。
- 推奨対応: 換算方針（官能記述の表現強度に基づく保守的換算である旨）を scopeNote または設計文書に1行残す。wood を normal とした理由がある場合はその記録も。

### B-2. 鳳凰単叢の aroma プロファイルにカップアロマ由来の属性（ginger・honey）が混在している

- 基準文書（候補5-2 Kun et al. 2025）: 「カップアロマはネクター様、ジンジャー様、花様が強く、茶液（infusion）の香りはトロピカルフルーツ様、甘い、花様と特徴が異なった」——ジンジャー様とネクター様は**カップアロマ側**の属性である。
- データ側（`src/data/teas.ts`、id: `fenghuang-dancong`）: aromas に floral-general=strong、tropical=normal、honey=normal、ginger=normal を同列に収録している。tropical は茶液側、ginger と honey（ネクター様の読み替え）はカップ側の属性で、フェーズの区別がプロファイル上は判別できない。scopeNote には両フェーズの違いが正確に書かれているため誤認の危険は低いが、ホイール表示だけを見る利用者には混在が伝わらない。
- なお強度自体は過大ではない（カップ側で「強い」とされた属性を normal に抑えている）。
- 推奨対応: ginger・honey は temporal.finish（カップアロマ）側の記述に寄せるか、ノートの根拠フェーズを区別できる表示・記録を検討する。

### B-3. indole / nerolidol の aromaKnowledge の Zeng 2025 根拠が基準文書内で確認できない（未確認）

- データ側（`src/data/compounds.ts`）:
  - indole: aromaKnowledge「総説（Zeng et al. 2025）では緑茶の栗様香りの寄与成分の一つに挙げられています」、noteIds に `chestnut` を含む。
  - nerolidol: aromaKnowledge「総説（Zeng et al. 2025）は烏龍茶の花様・果実様の香りの寄与成分に挙げています」。
- 基準文書側の状況:
  - `literature-verification.md` の Zeng 2025 記録は総説としての位置づけと茶類別の傾向の一般論までで、indole・nerolidol 個別成分の記述は記録されていない（本監査で全文を検索し、該当記述なしを確認）。
  - `expansion-candidates.md` でも indole の香り記述は候補4-1（Kumazawa & Masuda 1999）で「indole（**動物様**）」とされており、栗様とは異なる記述が基準文書内に存在する。
- 判定: Zeng 2025 本文に該当記述が存在する可能性自体は否定できないが、**本監査の基準文書の範囲では未確認**。特に indole と `chestnut` ノートの紐づけは、基準文書内の別の記述（動物様）と緊張関係にあるため、根拠の所在（Zeng 本文の該当箇所）を記録してから維持するのが望ましい。
- なお indole の contributionEvidence（Tan 2019、FD 27）は候補4-2と一致しており問題なし。nerolidol の contributionEvidence（Li & Wang 2020 の香型識別成分）は候補5-1の OPLS-DA 識別成分リストと一致しており問題なし。

### B-4. ishikawa-2019 の URL が基準文書で「未確認」のままデータに掲載されている（未確認）

- 基準文書（候補3-2）: 「完全なURLは本検証では未確認のため、J-STAGEサイト内でタイトル検索により到達可能」とされている。
- データ側（`src/data/sources.ts`、id: `ishikawa-2019-bitter-chocolate-ti-tds`）: url として `https://www.jstage.jst.go.jp/browse/jjse/23/1/_contents` が設定されている。
- 本監査で当該URLの取得を試みたが、取得手段側のエラー（HTTP 500、リトライ上限到達）のため実在確認はできなかった。捏造と断定はできないが、基準文書の「未確認」状態が解消されないまま出典リンクとして提示されている点は要検討とする。

### B-5. sources.ts 冒頭コメントが旧状態のまま

- データ側（`src/data/sources.ts` 3行目）: 「2026-10-29 に一次ソースで検証済みの6件のみ」とあるが、現在は17件（初期6件＋新規11件）が収録されている。データ内容の問題ではないが、保守時の誤認を避けるため文言の更新が望ましい。

### B-6. 化合物の plainDescription にアブストラクト外の一般化学知識が含まれる（軽微）

- 例: methional「茶葉に由来する含硫黄化合物です」、nonanal「茶葉の脂質酸化等に由来するアルデヒドです」、alpha-ionone「カロテノイド由来の化合物群の一つです」。
- これらはいずれも基準文書のアブストラクト要約には含まれない一般的な化学知識であり、誤りと断定できるものではないが、「アブストラクト範囲」を厳密に運用するなら出典区分（一般知識）の明示が望ましい。香りの断定には踏み込んでいないため重大度は低い。

---

## 問題なし（基準文書の範囲内であることを確認）

### お茶（Tan et al. 2019、候補4-2）

- sencha / matcha / gyokuro の green-leaf=strong は「葉様（leafy）が強く」、floral-general=normal は「花様ノートも高い」の保守的換算であり、過大化なし。
- sencha の scopeNote（インドールとメチオナール）、gyokuro の scopeNote（インドール）は候補4-2の FD 記載（煎茶: indole・methional FD 27／玉露: indole FD 27）と一致。
- matcha の scopeNote（ノナナールが最も高い FD値）は候補4-2（抹茶: nonanal FD 243）と一致。中国・山東産抹茶（候補4-3、Luo et al. 2022）を日本産抹茶のデータとして使っていない旨が明記されており、基準文書の警告どおり。
- hojicha の scopeNote（ピラジン類が突出）は候補4-2（2,3-diethylpyrazine FD 729、2,3-diethyl-5-methylpyrazine FD 243）と一致。
- 4種とも「品種・産地固有の実測ではない」「味（うま味）は対象外」の限界が scopeNote または teaKinds の form ノートに反映されている。basis='sensory'（SAFE抽出物の官能評価に基づく）も方法と整合する。
- sources.ts の tan-2019 エントリの scope に「FD値は抽出条件に依存する相対値で、絶対的な強度の証明ではない。味（うま味等）は対象外」と限界が明記されている。

### 鳳凰単叢（候補5-1 / 5-2）

- temporal.finish の文面「飲み終えたカップに残る香り（カップアロマ）は、茶液の香りとは異なり、花蜜様・生姜様・花様が強い」は候補5-2の記述そのものの範囲内であり、「再構成実験で検証」の付記も候補5-2（17種の主要香気成分の再構成により花蜜様カップアロマの再現に成功）と一致する。カップアロマであることが文面で明示され、口中の余韻と混同させていない。
- scopeNote の「9香型の類似度 46.79–95.94%（Li & Wang 2020）」は候補5-1の類似度記載と一致。香型で組成が異なる限界が明記されている。

### ミルクチョコレート（候補1-1 / 1-2）

- malt=normal（候補1-1: 3-methylbutanal はモルト様で最高FD群）、nut-general=normal（2-ethyl-3,6-dimethylpyrazine ナッツ様／土様）、hazelnut=normal（5-methyl-(E)-2-hepten-4-one ヘーゼルナッツ様）、stone-fruit=weak（R-δ-decalactone 甘い／桃様を弱に抑制）はいずれも候補1-1の最高FDリストに基づき、強度は保守的。
- cream=normal（候補1-2、クラムチョコレートのラクトンとクリーミーさ）は scopeNote でクラム方式の研究であることが明示され、sources.ts の samfass-2021 scope にも「クラム方式でないミルクチョコレートへの適用は未検証」とある。
- scopeNote の「試料数が限られるため、全てのミルクチョコレートの実測ではありません」は候補1-1の限界（試料は市販品1種）と一致。味覚の数値を出していない点も基準文書どおり。

### ホワイトチョコレート（候補2-1 / 2-2）

- scopeNote 冒頭で「市販品の実測ではなく、実験室で調製した『モデル』ホワイトチョコレートの研究」と明示されており、基準文書・全体メモの要求（モデル系である旨の注記なしに製品プロファイルとして表示しない）を満たす。
- caramel=normal / milk=normal は候補2-1の高加熱SMP試料の結果（キャラメル／ファッジ様が強く、コンデンスミルク香味が増加）の範囲内。scopeNote に「高加熱のスキムミルクパウダーを使った試料では」と条件が明記されている。
- stewart-2018 の scope でタイトルの effect/impact 表記ゆれに言及しており、基準文書の注記と一致。

### 化合物

- methional / nonanal: contributionEvidence の FD値（煎茶 FD 27／抹茶 FD 243）は候補4-2と一致。aromaKnowledge は「未確認」と正直に記載され、アブストラクトにない香り記述を断定していない。
- diethyl-methylpyrazine: contributionEvidence（本化合物 FD 243、2,3-diethylpyrazine FD 729）は候補4-2と正確に対応。aromaKnowledge は「ピラジン類は一般に焙煎様の香りと結びつきます」と類レベルの一般形で書かれており、個別化合物の香りを断定していない。
- methyl-heptenone: ヘーゼルナッツ様・高FDの同定は候補1-1と一致。
- alpha-ionone: contributionEvidence（カップアロマで GC-O 強度3以上、再構成実験で検証）は候補5-2と一致。aromaKnowledge は未確認と明記。
- delta-decalactone の前半（AEDA で高FD、R体の甘い／桃様の記述）は候補1-1と一致（後半については要修正 A-1 を参照）。

### sources.ts 新規11件の書誌照合

以下の全件で、タイトル・著者・年・誌名・巻号・DOI・PMID の有無が基準文書と一致することを確認した。不一致・捏造はなし。

| id | 照合結果 |
|---|---|
| tan-2019-japanese-green-tea | 一致。PMID は基準文書で未確認のためデータ側も未掲載（正しい扱い）。ライセンス「未確認（Elsevier）」も一致 |
| schnermann-1997-milk-chocolate | 一致。PMID 未掲載（基準文書で未確認）。ライセンス未確認（ACS）一致 |
| samfass-2021-crumb-chocolate-lactones | 一致。PMID 34202281、CC BY 4.0 ともに一致（PMCID はデータ側未掲載だが欠落は誤りではない） |
| stewart-2017-model-white-chocolate | 一致。PMID 28064480、「オープンアクセスではない（© 2017 ACS）」も一致 |
| stewart-2018-smp-volatile-carryover | 一致。タイトルは基準文書の主表記（effect）採用、著者（Fagan C を含む6名）・PMID 30122413 一致。ライセンスは雑誌掲載版の © ADSA のみ記載（基準文書には受理稿の CC BY-NC-ND の言及もあるが、誤りではない） |
| li-wang-2020-dancong-types | 一致。PMID 33347483、CC BY 一致 |
| kun-2025-dancong-cup-aroma | 一致。著者10名・PMID 40486064・ライセンス未確認（CC種別未確認）いずれも一致 |
| jager-2014-chocolate-tds-emotions | 一致。PMID 未掲載（基準文書で未確認）、ライセンス未確認（Elsevier）一致 |
| ishikawa-2019-bitter-chocolate-ti-tds | 書誌（著者4名・誌名・巻号ページ）は一致。DOI 未掲載（基準文書で未確認）も正しい。URL のみ未確認（要検討 B-4） |
| qiu-2025-green-tea-aroma-tds | 一致。著者は「et al.」省略形（基準文書は12名中一部未確認のため許容範囲）。DOI・PMID 41419502・CC BY-NC-ND 4.0 一致 |
| khemacheevakul-2021-temporal-sweetness | 一致。著者4名・PMID 34574192・CC BY 4.0 一致 |

また、新規11件はいずれも時間変化（テーマ3）・品種（テーマ5）等の方法論的限界が scope に反映されている（例: jager-2014「個別アイテムの時間プロファイルそのものではない」、qiu-2025「日本茶への適用もできない」、khemacheevakul-2021「通常製品の時間プロファイルではない」）。

---

## 監査の限界

- 本監査は基準文書2件（いずれもアブストラクト範囲の検証記録）との照合であり、論文全文との照合は行っていない。Zeng et al. 2025 本文の個別成分記述（B-3）は、基準文書内に記録がないため「未確認」としたもので、本文に記述が存在しないと断定するものではない。
- ishikawa-2019 の URL（B-4）は取得手段側のエラーのため実在確認ができなかった。
- アプリの表示層（App.tsx 等）やペアリングエンジンの出力は本監査の対象外。
