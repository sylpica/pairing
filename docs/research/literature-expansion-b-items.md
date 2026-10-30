# 文献拡張調査B：データが薄いアイテムの香味・呈味・成分研究（2026-10-30）

## 0. 位置づけと記録形式

- 目的：ユーザーの指示「まだまだ文献探索が足りない。要件から外れず徹底的に網羅すること。文献はどれだけ増えてもよい」を受け、データが薄いアイテム（情報不足・一般的記述のみ・産地実測なし）を対象に再探索した記録。**本書は候補の収集と一次確認のみで、データファイルへの登録はしていない**（統合は後工程）。
- 将来の研究用アプリでも再利用できるよう、全文献を統一レコード形式で残す：
**書誌情報／確認経路・確認度／主要な知見／適用範囲と限界／何に使えるか（対象アイテム×側面×推奨根拠レベル）**。
- 確認度の格付け：
- **確認済み**：書誌とアブストラクト（または全文）を出版社ページ・PubMed・PMC・大学機関リポジトリ等の一次情報で照合した。
- **確認済み（一部未確認）**：論文の実在と主要書誌は確認したが、一部要素（号数・著者リスト完全性・アブストラクト等）に未確認が残る。未確認要素は各レコードに明記した。
- **リード（未確認）**：存在の手がかりはあるが一次確認未完。採用判断の前に再確認が必須で、件数には含めない。
- 検出と寄与の区別：GC-MS等の「検出のみ」と、GC-O／AEDA／OAV／再構成／omission／添加試験で裏付けた「寄与」を各レコードで区別した。検出を寄与の根拠にしない。
- 記事・メーカー資料は「参考情報」として §9 に分離し、実測・寄与の根拠には使わない。
- 既存調査（chocolate-types.md、cacao-origins.md、temporal-candidates.md、flavor-compounds.md、expansion-candidates.md）の結論と食い違う場合は、本書の新しい一次確認を優先し、食い違いを明記した（コートジボワール、ブロンド、100%、黄茶の呈味で発生）。

## 1. 総括（対象×結果）

| 対象 | 結果 | 要点 |
|---|---|---|
| ブロンド／キャラメリゼホワイト | **見つかった**（既存調査の「確認できず」を更新） | Aydın et al. 2021 がキャラメリゼホワイトの香気成分・官能を直接扱う査読研究。ただし実験室調製試料で市販品そのものではない |
| カカオ分100%・無糖 | **見つかった**（既存調査の見送りを更新） | McClure グループの一連の研究：官能（2022）・苦味成分定量（2021）・含硫黄揮発（2023、検出のみ） |
| ダークミルク | **見つからなかった** | 専用研究なし。定義自体が取引上の帯域。近接研究のみ |
| ルビー（追加） | **追加あり（官能・物性のみ）** | 実製品官能 Luchian 2023（既存出典だが未活用の試料データ）。GC-MS／GC-O による揮発研究は**見つからなかった** |
| ホワイト（追加） | **官能＋検出レベルの香気分析が追加**（第2ラウンドで更新） | De Pelsmaeker 2019（レキシコン）＋ Luchian 2023（単一製品）。第2ラウンドで Godočiková et al. 2019 により実製品の GC-MS 揮発プロファイル（検出レベル）が確認された。GC-O 級は Stewart のモデル系が依然唯一の水準 |
| コートジボワール | **見つかった**（既存調査の flavorEvidence 'none' を更新） | 官能＋揮発の査読実測が複数（Amien 2025、Kouassi 2022 等）。多くは発酵・栽培条件の効果研究 |
| タンザニア | **部分的に見つかった** | 産地単独の官能・揮発研究は**見つからなかった**。Marseglia 2020（22産地横断、タンザニア5試料）と André 2022（製品の苦味成分）が部分的な実測 |
| その他産地 | **新規に実測あり** | インドネシア、ベトナム、フィリピン、カメルーン、ブラジルに産地・地域・系統レベルの実測。サントメ・ウガンダは Marseglia 2020 の試料のみ |
| 黄茶 | **見つかった** | GC-O 2件、再構成・omission 付き sensomics 1件（Wei 2024）、呈味 3件。既存調査の「呈味一次ソース未確認」は解消 |
| 黒茶 | **見つかった** | 熟プーアルは AEDA／GC-O で寄与レベルが厚い。茯磚茶は再構成・omission あり。六堡茶は相関レベル |
| 白茶の貯蔵変化 | **見つかった** | 香気の年数系列（緊圧寿眉1–16年、白牡丹0–11年）＋非揮発マーカー（EPSF）。寄与実証（GC-O/再構成）はこの領域にはまだない |
| ほうじ茶 | **見つかった** | 棒ほうじ茶の AEDA が中核（Sasaki 2017）。第2ラウンドで葉ほうじ茶の AEDA 原典（水上ら 2008『茶業研究報告』105、続編 2012 の2件）が一次確認でき、寄与成分を日本語一次文献で裏付け可能になった。英語原典 Mizukami 2008 は書誌確定・抄録は間接確認のみ |
| 玄米茶 | **見つからなかった** | 玄米茶そのものの査読研究は英日韓いずれでも確認できず。メーカー記事・成分表のみ（参考情報） |
| 鉄観音 | **見つかった** | Zhu 2015（GC-O＋OAV。ただし OAV は3茶共通の範囲値） |
| 東方美人 | **GC-O級は見つからなかった** | 検出・動態レベルの2件（Cho 2007、Zeng 2022）に加え、第2ラウンドで加工段階の香気変化を追った国際会議プロシーディング（Ogura 2004、グレー文献）が確認された。寄与実証級は依然なし |
| 武夷岩茶 | **見つかった** | 大紅袍 sensomics（Wang 2022）が最強格。品種別 GC-O、空カップ香もあり |
| 凍頂烏龍・祁門・龍井 | **見つかった** | 凍頂は sensomics（Wang 2023）、祁門は萎凋法 sensomics＋1年貯蔵（Huang 2022、Tao 2022）、龍井は Flaig 2020（確認経路に留保） |
| 文山包種 | **GC-O級は見つからなかった** | GC-MS＋電子鼻の等級研究のみだったが、第2ラウンドで萎凋・攪拌と香気形成の古典的査読研究（Kobayashi et al. 1985、TRES系共著、検出・組成レベル）が確認された |
| 時間変化（冷める過程） | **部分的に見つかった** | 温度条件間の官能比較のみ（Pramudya & Seo 2018）。同一茶液の冷却時系列の実測は**見つからなかった** |
| 時間変化（煎数） | **緑茶は見つかった／紅茶は見つからなかった** | Lee et al. 2013（緑茶5煎、官能＋GC-MS） |
| 時間変化（チョコ貯蔵） | **見つかった** | Nightingale 2011、Hřivna 2021、Ali 2001 |
| 時間変化（お茶の長期保存） | **見つかった** | 緑茶12か月（Zhao 2024）、祁門1年（Tao 2022）、抹茶2か月（Kim 2020、成分・色のみ） |

第1ラウンドで新規に一次確認できた候補は **67件**（うち書誌の一部に未確認要素を含むもの 10件）。ほかに未確認リード 11件を §10 に分離した。
第2ラウンド（§11、非英語圏・試験場報告・学位論文まで拡大）で新規に一次確認できた候補は **80件**（産地25、チョコレート／中南米16、時間変化24、日中韓の茶研究15）。**累計147件**。第2ラウンド分の未確認リード17件と再確認課題は §12 に分離した。学位論文・試験場報告・会議論文は各レコードで格付けを明記し、査読論文とは区別している。

---

## 2. チョコレート：薄い種類

### CH-1. Aydın, Kian-Pour & Toker 2021 ― キャラメリゼホワイトの香気・官能
- **書誌情報**：Nurcanan Aydın（機関記録では "Aydin N."、第一著者の名の表記ゆれあり）、Nadide Kian-Pour、Ömer Said Toker. "Caramelized white chocolate: effects of production process on quality parameters." *Journal of Food Measurement and Characterization* 15(4): 3182–3194, 2021. DOI: 10.1007/s11694-021-00890-1.
- **確認経路・確認度**：Yıldız Technical University の機関研究者記録（AVESİS）で書誌を確認。Springer 出版社ページ自体は未開示のため「一部未確認」。
- **主要な知見**：ホワイトチョコレートを110–120℃×30–120分加熱キャラメリゼし、レオロジー・香気成分・色・褐変指数・官能を測定。115℃・120℃で90分を超えると生地状になり望ましい官能特性を失う。フルフラールとリナロールの生成は時間・温度とともに増加（生成・検出レベルであり寄与の証明ではない）。120℃・90分超では苦味・焦げ・不快な味が知覚。最適条件は110℃（60–90分）と115℃・60分。
- **適用範囲と限界**：実験室で調製したキャラメリゼホワイトであり、Dulcey 等の市販品そのものの分析ではない。香気成分に OAV 等の寄与度評価なし。
- **何に使えるか**：ブロンドチョコレート ― 香味（加熱条件と苦味・焦げの関係）／成分（フルフラール、リナロール＝検出・生成レベル）。ブロンドの「情報不足」を「一般的知見」へ引き上げる際の中核候補。出典URL：https://avesis.yildiz.edu.tr/publication/details/efd47a1e-f90d-447b-8143-ed78534f4e31/oai

### CH-2. Rodier & Hartel 2021 ― ホワイトチョコ長時間加熱のメイラード速度論
- **書誌情報**：Liana C. Rodier, Richard W. Hartel. "Characterizing Maillard reaction kinetics and rheological changes in white chocolate over extended heating." *Journal of Food Science* 86(6): 2553–2568, 2021. PMID: 34056726. DOI: 10.1111/1750-3841.15772.
- **確認経路・確認度**：PubMed 由来の書誌を転記した二次記録で PMID・DOI を確認。PubMed ページ自体は未開示のため「一部未確認」。
- **主要な知見**：組成の異なるホワイトチョコレート5種を長時間加熱。非晶質乳糖系で複合粘度が上昇し、褐変は無脂肪乾燥乳（NFDM）系が最大。増粘は一次反応、褐変は擬ゼロ次反応。アブストラクトの Practical Application に「いわゆる "golden chocolate" はメイラード褐変のために温かい温度で保持されたホワイトチョコレート」と明記。
- **適用範囲と限界**：揮発成分・官能記述子は一切なし。香味の根拠には使えない。
- **何に使えるか**：ブロンドチョコレート ― 生成機構・色・物性の背景根拠のみ。

### CH-3. Kouřilová et al. 2022 ― 非定型チョコレートマスの流動挙動
- **書誌情報**：Veronika Kouřilová, Renáta Dufková, Luděk Hřivna, Vojtěch Kumbár. "Use of rheological plastic models to describe the flow behaviour of unconventional chocolate masses." *Czech Journal of Food Sciences* 40(4): 305–312, 2022. DOI: 10.17221/57/2022-CJFS.
- **確認経路・確認度**：出版社ページ（cjfs.agriculturejournals.cz）で確認。
- **主要な知見**：ホワイト、ルビー、キャラメリゼした Amber chocolate のマスを40℃で流動測定。Herschel-Bulkley モデルが最適で、全試料が非ニュートン塑性挙動と降伏応力を示した。
- **適用範囲と限界**：香気・官能なし。Amber chocolate は Dulcey ブランドとは別物である点に注意。
- **何に使えるか**：ブロンド／ルビー ― 物性（口どけに隣接）のみ。出典URL：https://cjfs.agriculturejournals.cz/artkey/cjf-202204-0006_use-of-rheological-plastic-models-to-describe-the-flow-behaviour-of-unconventional-chocolate-masses.php

### CH-4. McClure, Hopfer & Grün 2022 ― 100%チョコレートの官能と焙煎最適化
- **書誌情報**：Alan P. McClure, Helene Hopfer, Ingolf U. Grün. "Optimizing consumer acceptability of 100% chocolate through roasting treatments and effects on bitterness and other important sensory characteristics." *Current Research in Food Science* 5: 167–174, 2022. DOI: 10.1016/j.crfs.2022.01.005. PMID: 35072104. PMCID: PMC8761865.
- **確認経路・確認度**：PMC 全文で確認（CC BY）。
- **主要な知見**：3産地（マダガスカル、ガーナ、ペルー）の未焙煎カカオから27処理（24–171℃、0–80分）で100%チョコレートを製造し、消費者145名が嗜好と苦味・渋味・酸味・甘味・ココア感の強度を評価。焙煎最適化で苦味・酸味・渋味は低減可能で嗜好と負相関、ココア強度は嗜好と強い正相関。最も受容されたのは171℃・20分、135℃・80分、151℃・54分。生・浅煎りは支持されなかった。
- **適用範囲と限界**：訓練パネルによる記述分析ではなく消費者評価。単一研究グループのプログラム内の結果。
- **何に使えるか**：カカオ分100% ― **味覚（苦味・渋味・酸味と焙煎・嗜好の関係）の直接の根拠**。新アイテム新設の第一候補。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC8761865/

### CH-5. McClure, Spinka & Grün 2021 ― 無糖チョコレートの苦味成分定量
- **書誌情報**：Alan P. McClure, Christine M. Spinka, Ingolf U. Grün. "Quantitative analysis and response surface modeling of important bitter compounds in chocolate made from cocoa beans with eight roast profiles across three origins." *Journal of Food Science* 86(11): 4901–4913, 2021. DOI: 10.1111/1750-3841.15924. PMID: 34636050.
- **確認経路・確認度**：PubMed で確認。
- **主要な知見**：無糖チョコレートの苦味成分6種（テオブロミン、カフェイン、エピカテキン、カテキン、プロシアニジンB2、cyclo(Proline-Valine)）を HPLC-DAD で定量。エピカテキンとプロシアニジンB2は焙煎で大きく減少、カテキンと cyclo(Pro-Val) は増加、テオブロミン・カフェインは小幅増。
- **適用範囲と限界**：本論文自体に官能測定はない。味との結び付けは各成分が苦味・渋味物質として知られていることに依拠する間接引用になる。
- **何に使えるか**：カカオ分100% ― 成分（苦味・渋味関連成分と焙煎の関係）。出典URL：https://pubmed.ncbi.nlm.nih.gov/34636050/

### CH-6. Wiedemer et al. 2023 ― 100%チョコレートの含硫黄揮発成分
- **書誌情報**：Aaron M. Wiedemer, Alan P. McClure, Erich Leitner, Helene Hopfer. "Roasting and Cacao Origin Affect the Formation of Volatile Organic Sulfur Compounds in 100% Chocolate." *Molecules* 28(7): 3038, 2023. DOI: 10.3390/molecules28073038. PMID: 37049800. PMCID: PMC10095636.
- **確認経路・確認度**：PubMed で確認。
- **主要な知見**：CH-4 と同一の27試料・3産地を GC×GC-SCD で分析し、含硫黄揮発成分28種を検出。焙煎時間とくに温度で濃度が上昇し、産地効果はジメチルジスルフィドのみ。
- **適用範囲と限界**：**アブストラクト自体が「大半の成分の同定は暫定的であり、香味知覚への影響は不明」と明記。検出のみであり、寄与成分としての引用は不可。**
- **何に使えるか**：カカオ分100% ― 成分の存在記録（寄与には使わない）。出典URL：https://pubmed.ncbi.nlm.nih.gov/37049800/

### CH-7. De Pelsmaeker et al. 2019 ― チョコレートの官能ホイールとレキシコン
- **書誌情報**：Sara De Pelsmaeker, Gil De Clercq, Xavier Gellynck, Joachim J. Schouteten. "Development of a sensory wheel and lexicon for chocolate." *Food Research International* 116: 1183–1191, 2019. DOI: 10.1016/j.foodres.2018.09.063. PMID: 30716904.
- **確認経路・確認度**：PubMed で確認。
- **主要な知見**：フォーカスグループ5回（消費者48名）が市販品（ホワイト5試料、ミルク8、ダーク9）で記述子104語を生成し、3層のセンサリーホイール（モダリティ4、カテゴリ21、記述子61）を構築。市販9試料（ホワイト／ミルク／ダーク）を訓練パネルの記述分析で特徴付け、レキシコンの属性で試料を識別可能だった。
- **適用範囲と限界**：アブストラクトにはホワイト固有の強度・記述子は示されていない。「ホワイトの香味プロファイル」そのものの根拠にはならない。
- **何に使えるか**：ホワイトチョコレート ― 記述子語彙と、市販ホワイトが官能的に識別可能であることの根拠（用語参考寄り）。出典URL：https://pubmed.ncbi.nlm.nih.gov/30716904/

### CH-8. Luchian et al. 2023 ― 実製品5種の官能プロファイル（ルビー・ホワイト試料を含む）
- **書誌情報**：Camelia Elena Luchian, Elena Cristina Scutarașu, Lucia Cintia Colibaba, Dragoș Grosaru, Valeriu V. Cotea. "Studies on the Enhancement of Sparkling Wine and Chocolate Pairing through Compositional Profile Analysis." *Foods* 12(18): 3516, 2023. DOI: 10.3390/foods12183516. PMID: 37761224. PMCID: PMC10529128.
- **確認経路・確認度**：PMC 全文で試料対応（本文§3.2・Table 4・Figure 3）まで確認。**本論文は sources.ts に `luchian-2023-chocolate-profiles` として登録済み**だが、ルビー・ホワイト試料の官能データはアプリデータに未活用のはず（統合時に要確認）。
- **主要な知見**：市販チョコレート5種（Rausch 製造：ホワイト、ルビー、ミルク32%、ダーク70%、ダーク95%）を熟練テイスター50名が記述子0–5で評価。C1＝ホワイトは「最もクリーミーで、ミルクの香りが強く、明確な甘味」。C2＝ルビーは「フローラルなノートが最も知覚され、粘着性があり酸性」で、本文では「強いフルーティーなニュアンス、わずかに酸性の味、unctuous な食感」と記述。
- **適用範囲と限界**：単一メーカー・単一製品の各1試料のみ。研究の主目的はペアリングで記述子は限定的。香気成分分析はない。
- **何に使えるか**：ルビーチョコレート ― 香味・味覚（フローラル、フルーティー、酸味）の実製品官能。ホワイトチョコレート ― 香味（クリーミー、ミルク香、甘味）の実製品官能。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC10529128/

### CH-9. Zarić et al. 2024 ― 4種チョコレートの物性比較
- **書誌情報**：Danica B. Zarić, Marica B. Rakin, Maja Lj. Bulatović, Ivan D. Dimitrijević, Vanja D. Ostojin, Ivana S. Lončarević, Milica V. Stožinić. "Rheological, Thermal, and Textural Characteristics of White, Milk, Dark, and Ruby Chocolate." *Processes* 12: 2810, 2024. DOI: 10.3390/pr12122810（号数(12)は MDPI 記事ページでの最終確認が未実施＝未確認）。
- **確認経路・確認度**：MDPI の論文PDFで確認。
- **主要な知見**：同一メーカー（Premier、セルビア）の4種を比較。脂肪36%（ホワイト／ミルク／ルビー）、39%（ダーク）。カカオ分はホワイト28%、ミルク33%、ルビー47%、ダーク70%。DSCエンタルピーはカカオ分とともに増加、Casson降伏応力はミルクが最大（17.61 Pa）等。
- **適用範囲と限界**：香気・味覚・官能パネルは一切なし。
- **何に使えるか**：ルビー／ホワイト ― 食感・熱・口どけの物性のみ。

### CH-10. Montoya et al. 2021 ― 未発酵カカオ粉末のピンク色保持機構
- **書誌情報**：Cristian Camilo Montoya, Wilmar Giovanni Valencia, Jelver Alexander Sierra, Lucas Penagos. "Enhanced pink-red hues in processed powders from unfermented cacao beans." *LWT* 138: 110671, 2021. DOI: 10.1016/j.lwt.2020.110671.
- **確認経路・確認度**：ScienceDirect 出版社ページで確認（利益相反の明示も確認：資金提供・著者は Compañía Nacional de Chocolates）。
- **主要な知見**：未発酵カカオ**パウダー**をブランチング＋クエン酸浸漬＋乾燥・粉砕することで、フラバン-3-オール＋プロシアニジン約150 mg/g を保持しつつ安定なピンク〜赤色を得た。
- **適用範囲と限界**：市販ルビーチョコレートの官能・揮発研究ではない。
- **何に使えるか**：ルビーチョコレート ― 色・フラバノール保持の機構に関する背景のみ。出典URL：https://www.sciencedirect.com/science/article/abs/pii/S0023643820316595

### CH-11. Vercet 2003 ― ホワイトチョコレート保存中の褐変
- **書誌情報**：Antonio Vercet. "Browning of white chocolate during storage." *Food Chemistry* 81(3): 371–377, 2003. DOI: 10.1016/S0308-8146(02)00452-1.
- **確認経路・確認度**：ScienceDirect の当該号目次で書誌を確認。出版社アブストラクトページ自体は未開示。
- **主要な知見**：ホワイトチョコレート代替品とホワイトチョコで被覆したアーモンドで、保存中の褐変は表面関連であり非酵素的褐変指標が上昇した。
- **適用範囲と限界**：色・化学のみで香味・官能なし。
- **何に使えるか**：ホワイトチョコレート ― 時間変化（保存・色）のみ。TM-6（チョコ貯蔵）と併せて参照。

### CH-12. Rossini, Noreña & Brandelli 2011 ― ホワイトチョコレート保存中の色変化
- **書誌情報**：Rossini, Noreña, Brandelli（名のフル表記は未確認）. "Changes in the color of white chocolate during storage: potential roles of lipid oxidation and non-enzymatic browning reactions." *Journal of Food Science and Technology* 48(3): 305–311, 2011. DOI: 10.1007/s13197-010-0207-x. PMCID: PMC3551150.
- **確認経路・確認度**：書誌は検索結果の PMC レコード由来。PMC ページ自体は未開示＝一部未確認。
- **主要な知見**：実験室調製ホワイトを20/28℃で10か月保存し、酸度・TBARS・過酸化物価が上昇、28℃では5か月目から a*（赤色度）が上昇。
- **適用範囲と限界**：色・酸化のみで香気・官能なし。
- **何に使えるか**：ホワイトチョコレート ― 時間変化（保存・色・酸化）のみ。

### ダークミルクについて（陰性結果の記録）
- "dark milk" を対象として定義し官能プロファイルを与えた査読済み研究は、複数検索語の範囲で**見つからなかった**。「ダークミルク」は標準的定義のない取引・マーケティング上の帯域である。
- 近接情報（いずれもダークミルク専用ではない）：Samfaß et al. 2021（既存収載。カカオ固形分28–50%のミルクチョコレート6試料を含むが主題はクラムチョコレートのラクトン）、Liu et al.（ダーク対ミルクの香気活性成分比較、*J Sci Food Agric*、DOI: 10.1002/jsfa.6831。ミルク試料のカカオ分は抄録に記載なし）。

---

## 3. カカオ産地：実測が無かった産地と新規産地

### OR-1. Amien et al. 2025 ― コートジボワール5産地×栽培体系の官能・揮発性
- **書誌情報**：Florent G. Kouamé Amien, Maï Koumba Koné, Christian Adobi Kadjo, Alfred Koffi Yao, Isabelle Maraval, Renaud Boulanger, Simplice Tagro Guéhi. "Effect of Agroforestry and Cocoa-Producing Geographical Origin on the Sensory Profile of Beans and Chocolates in the Climate Change Context in Côte d'Ivoire." *Foods* 14(24): 4321, 2025. DOI: 10.3390/foods14244321. PMID: 41465027. PMCID: PMC12733373.
- **確認経路・確認度**：MDPI 出版社ページ、PMC、PubMed で照合。
- **主要な知見**：コートジボワール5産地（Agnibilékrou, Adzopé, Divo, Guibéroua, Méagui）のアグロフォレストリー／フルサン農園から現地ハイブリッド品種 "Mercedes"（Amelonado × West African Trinitario）を収穫し、統一条件（ポッド開封3日遅延、木箱6日発酵、天日乾燥）で加工。SPME-GC-MS と専門審査員12名・10記述子の官能評価。豆ではエステル・アルデヒド・ケトンが栽培体系によらず検出され、アグロフォレストリーは一部産地の豆の揮発プロファイルに影響したが、発酵・焙煎後のチョコレートでは産地によらず影響せず、官能知覚にも有意な影響はなかった。
- **適用範囲と限界**：単一栽培品種（Mercedes）のみ、2023・2024年収穫、発酵条件統一の実験系。他品種・農家発酵の一般像ではない。論文自体が「コートジボワール産はファインアロマで知られていない」と明記。結論は「栽培体系の効果は豆段階で消える」側であり、「コートジボワール＝特定の香味」という単純なプロファイル抽出には使えない。
- **何に使えるか**：コートジボワール ― **香味／揮発成分の産地内実測として初の本格候補**。既存調査の「香味の官能・揮発性の産地実測は未確認」は本論文により覆る。flavorEvidence 'none' → 'measured' への引き上げ候補（ただし「地域差は小さい」という結論自体が知見）。出典URL：https://www.mdpi.com/2304-8158/14/24/4321 ／ https://pmc.ncbi.nlm.nih.gov/articles/PMC12733373/

### OR-2. Kouassi et al. 2022 ― 発酵場所が揮発性前駆体と官能に与える影響（コートジボワール）
- **書誌情報**：Ange Didier Dominique Kouassi, Koumba Maï Koné, Brice Judicaël Assi-Clair, Marc Lebrun, Isabelle Maraval, Renaud Boulanger, Tagro Simplice Guehi. "Effect of spontaneous fermentation location on the fingerprint of volatile compound precursors of cocoa and the sensory perceptions of the end-chocolate." *Journal of Food Science and Technology* 59(11): 4466–4478, 2022. DOI: 10.1007/s13197-022-05526-w.
- **確認経路・確認度**：HAL（フランス公的アーカイブ）で書誌・抄録・DOI を照合。
- **主要な知見**：同一伝統農園で収穫したコートジボワール産カカオを5地点（Akoupé, San Pedro, Soubré, Djekanou, Daloa）で同時に自然発酵。HS-SPME-GC/MS と専門パネルの官能評価。Daloa／Soubré 発酵豆は 2,3-butanediol で特徴づけられ、San Pedro での発酵が望ましい香気化合物と官能属性の両方を最も促進した。豆の香気前駆体プロファイルとチョコレート官能は直接連動しなかった。
- **適用範囲と限界**：原料は単一農園由来で、変動要因は発酵地の微生物・環境。栽培地のテロワール効果とは分離して読む必要がある。
- **何に使えるか**：コートジボワール ― 「産地」ではなく「発酵場所」効果の実測。産地エントリの香味ではなく生産条件フィールドの根拠に最適。出典URL：https://hal.science/hal-05179249/

### OR-3. Koné et al. 2021 ― ポッド貯蔵と香味前駆体（コートジボワール）
- **書誌情報**：Koumba Maï Koné, Brice Judicaël Assi-Clair, Ange Didier Dominique Kouassi, Alfred Koffi Yao, Louis Ban-Koffi, Noël Durand, Marc Lebrun, Isabelle Maraval, Renaud Boulanger（原典引用では "Bonlanger" の表記ゆれあり）, Tagro Simplice Guehi. "Pod storage time and spontaneous fermentation treatments and their impact on the generation of cocoa flavour precursor compounds." *International Journal of Food Science & Technology* 56(5): 2516–2529, 2021. DOI: 10.1111/ijfs.14890.
- **確認経路・確認度**：FAO AGRIS レコード＋EBSCO レコード＋後続論文の引用表記で照合。Wiley 出版社ページでの直接照合は未実施。
- **主要な知見**：ポッド貯蔵期間と3種の自然発酵処理を比較。*Pichia kudriavzevii* が共通酵母。香味前駆体30化合物（アルコール、ピラジン等6化学族）を同定。短いポッド貯蔵＋発酵が前駆体生成を促進。
- **適用範囲と限界**：前駆体段階の測定であり、焙煎後の香り・官能への外挿不可。完成チョコの官能ではない。
- **何に使えるか**：コートジボワール ― 香味**前駆体**の実測。既存調査の発酵酵母研究（Fermentation 2024）とは別系統。出典URL：https://agris.fao.org/search/en/providers/122535/records/65dfc0374c5aef494fe501d5

### OR-4. Mohamadi Alasti et al. 2019 ― コートジボワール豆のココアパウダー加工と揮発成分
- **書誌情報**：Fariba Mohamadi Alasti, Narmela Asefi, Ramin Maleki, Seiied Sadegh SeiiedlouHeris. "Investigating the flavor compounds in the cocoa powder production process." *Food Science & Nutrition* 7(12): 3892–3901, 2019. DOI: 10.1002/fsn3.1244. PMCID: PMC6924302. PMID: 31890167.
- **確認経路・確認度**：PMC で確認。
- **主要な知見**：コートジボワールから輸入した発酵・乾燥豆（論文内表記 Forastero cultivar）を工場の各工程（アルカリ処理、焙煎等）でサンプリングし SDE＋GC-MS で揮発成分を追跡。アルカリ処理と焙煎が香味を左右する主要工程で、ピラジンとエステルが焙煎時のメイラード反応で生成する主要群。基礎化学組成（水分3.46%、タンパク14.37%、脂肪55.79%等）も記載。
- **適用範囲と限界**：単一輸入ロット、採取地・発酵詳細は「現地慣行で詳細データなし」と論文が明記。産地代表値ではない。官能評価なし（機器分析のみ）。
- **何に使えるか**：コートジボワール ― 基礎組成と加工前揮発プロファイルの実測。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC6924302/

### OR-5. Marseglia et al. 2020 ― 22産地59試料の揮発性フィンガープリント
- **書誌情報**：Angela Marseglia, Marilena Musci, Massimiliano Rinaldi, Gerardo Palla, Augusta Caligiani. "Volatile fingerprint of unroasted and roasted cocoa beans (*Theobroma cacao* L.) from different geographical origins." *Food Research International* 132: 109101, 2020. DOI: 10.1016/j.foodres.2020.109101.
- **確認経路・確認度**：パルマ大学機関リポジトリ（受理原稿全文PDF）で確認。試料総数は受理原稿要旨59試料／リポジトリ抄録58試料と表記ゆれがあり、揮発成分数（未焙煎57–62種、焙煎71–76種）にも版間差異がある＝**原著での再確認が必要な未確認要素**。
- **主要な知見**：22産地の発酵・乾燥豆を HS-SPME/GC-MS で未焙煎・焙煎（140℃30分、統一条件）の両状態で分析し PCA で産地判別。試料内訳：ペルー6、サントメ6、ドミニカ共和国5、**タンザニア5**、ベネズエラ4、**コートジボワール4**、ガーナ4、ナイジェリア4、パプアニューギニア4、ウガンダ2、エクアドル2、シエラレオネ2、他各1（インドネシアはスラウェシ／ジャワ／フローレスとして各1）。未焙煎豆の時点でアフリカ産とアメリカ（カリブ）産が分離し、アジア・オセアニア産は判別されなかった。統一焙煎後も発酵豆段階の差が維持された。タンザニア試料への個別言及（受理原稿本文）：あるタンザニア試料で 2-methylbutanal 0.17 mg/kg、3-methylbutanal 0.46 mg/kg。2-phenylethanol の最高水準群にタンザニア試料が含まれる（値の単位・段階詳細は補足資料依存で**要原表確認**）。tetramethylpyrazine はキューバ 16.16、ジャワ 14.08 に次ぎタンザニア 11.84 mg/kg。
- **適用範囲と限界**：全試料2012年収穫・Barry Callebaut 経由の商業試料で国内地域は不明。官能評価なし（機器分析＋ケモメトリクスのみ）。「産地の味」を直接示すものではなく「揮発プロファイルで大陸レベルまで判別できる」ことが成果。数値は半定量（内部標準比）。
- **何に使えるか**：**タンザニア（5試料）・サントメ（6試料）・ウガンダ（2試料）については現在確認できる数少ない揮発性実測**。コートジボワール（4試料）の補強にもなる。新規産地エントリ（サントメ、ウガンダ、インドネシア）の 'measured' 判定材料。出典URL：https://air.unipr.it/handle/11381/2885560

### OR-6. André et al. 2022 ― タンザニア産製品を含むジケトピペラジン分析
- **書誌情報**：Amandine André, Bettina Casty, Lisa Ullrich, Irene Chetschik. "Use of molecular networking to identify 2,5-diketopiperazines in chocolates as potential markers of bean variety." *Heliyon* 8(9): e10770, 2022. DOI: 10.1016/j.heliyon.2022.e10770. PMCID: PMC9525904.
- **確認経路・確認度**：PMC／Cell 出版社ページで確認（試料表まで照合）。
- **主要な知見**：市販・小規模生産ダークチョコレート33製品を HPLC-MS/MS で分析し、苦味に寄与する環状ジペプチド（2,5-diketopiperazines）18種を同定・定量。試料表にタンザニア産 Trinitario 表示のビーントゥバー製品が5点（SB17–SB21、カカオ70–75%）含まれる。小規模製品は豆品種ごとにクラスター化し、ジケトピペラジン量は焙煎・製法より遺伝子型の影響が強い。
- **適用範囲と限界**：製品レベルの分析でメーカー・製法の影響を分離できない。品種表示はメーカー表示依存。産地固有の値の抽出は本探索では行っていない。香味ノートの根拠には使えない。
- **何に使えるか**：タンザニア ― **苦味関連成分（非揮発性）の組成実測が存在する**ことの根拠。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC9525904/

### OR-7. Tran et al. 2015 ― ベトナム、インドネシア、ペルー、ガーナの香気品質
- **書誌情報**：Phuong Diem Tran, Davy Van de Walle, Nathalie De Clercq, Ann De Winne, Daniel Kadow, Reinhard Lieberei, Kathy Messens, Dung Nhan Tran, Koen Dewettinck, Jim Van Durme. "Assessing cocoa aroma quality by multiple analytical approaches." *Food Research International* 77(Part 3): 657–669, 2015. DOI: 10.1016/j.foodres.2015.09.019.
- **確認経路・確認度**：FAO AGRIS レコード＋ゲント大学学術書誌で照合。
- **主要な知見**：4カ国の発酵豆26試料を高温焙煎後に組成分析（アミノ酸、還元糖、ポリフェノール、乳酸）と揮発性プロファイリング（MSフィンガープリンティング＋HS-SPME-GC-MS）で評価。ファインフレーバー（Criollo）、良好発酵・焙煎、低品質のグループ分離が可能で、産地／品質のマーカー候補を同定。
- **適用範囲と限界**：26試料を4カ国＋クローン群で分けるため国別試料数は小さい。官能評価ではなく機器分類が主眼。
- **何に使えるか**：ベトナム／インドネシア ― 産地レベル揮発性＋前駆体組成の実測（新規産地エントリ候補）。出典URL：https://biblio.ugent.be/person/097FDF34-F0EE-11E1-A9DE-61C894A0A6B4

### OR-8. Tran et al. 2016 ― ベトナム産リカーのチョコレート香味
- **書誌情報**：Diem Phuong Tran, Jim Van Durme, Davy Van de Walle, Ann de Winne, Claudia Delbaere, Nathalie de Clercq, Thi Thanh Que Phan, Cat-Hanh Nguyen Phuc, Dung Nhan Tran, Koen Dewettinck. "Quality attributes of dark chocolate produced from Vietnamese cocoa liquors." *Journal of Food Quality* 39(4): 311–322, 2016. DOI: 10.1111/jfq.12200.
- **確認経路・確認度**：ゲント大学学術書誌で確認。
- **主要な知見**：酸度の異なるベトナム産カカオリカーからダークチョコレートを作りガーナ産参照試料と比較。ベトナム産チョコレートは**より顕著な酸味・果実様・花様の香り**を示した。プレコンチングは揮発性酸を減らす一方、望ましい香気の一部も除去した。
- **適用範囲と限界**：リカーの酸度差に焦点を当てた研究で、ベトナム国内の地域差は扱わない。比較対象はガーナ1参照のみ。
- **何に使えるか**：ベトナム ― 香味（酸・果実・花）の産地実測。東南アジア産カカオの高酸度という一般的傾向の実証例でもある。出典URL：https://biblio.ugent.be/publication/7241092

### OR-9. Bickel Haase et al. 2021 ― 4産地のカカオ果肉パルプの香気
- **書誌情報**：Thomas Bickel Haase, Ute Schweiggert-Weisz, Eva Ortner, Holger Zorn, Susanne Naumann. "Aroma Properties of Cocoa Fruit Pulp from Different Origins." *Molecules* 26(24): 7618, 2021. DOI: 10.3390/molecules26247618. PMCID: PMC8704363.
- **確認経路・確認度**：PMC／MDPI で確認。
- **主要な知見**：インドネシア（SUL2）、ベトナム、カメルーン、ニカラグアの**新鮮果肉パルプ**を AEDA＋GC-MS/O で分析し香気活性化合物65種を同定。ベトナム産パルプが香気活性領域数最多（57）、カメルーン産が最少（43）。最高FD因子の化合物は trans-4,5-epoxy-(E)-decenal、2-/3-methylbutanoic acid、linalool 等。
- **適用範囲と限界**：**決定的に重要 ― これは発酵豆・チョコレートの香味データではない。**「ベトナム産カカオは香り豊か」の根拠として豆の香味に転用してはならない。各産地1試料のみ。
- **何に使えるか**：インドネシア／ベトナム／カメルーン ― パルプ香気の産地間実測（発酵の基質＝香味前駆環境の参考のみ）。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC8704363/

### OR-10. Anita-Sari et al. 2023 ― インドネシア3クローン×4環境の香味
- **書誌情報**：Indah Anita-Sari, Rudi Hari Murti, Misnawi, Eka Tarwaca Susila Putra, Bayu Setyawan, Agung Wahyu Susilo. "Flavor Characteristics of Three Indonesian Cocoa Clones in Four Environments." *Agronomy* 13(10): 2658, 2023. DOI: 10.3390/agronomy13102658.
- **確認経路・確認度**：MDPI 出版社ページで確認。
- **主要な知見**：インドネシア優良クローン3種（芳香性 MCC 02、非芳香性 Sulawesi 1／Sulawesi 2）を4地点（東ジャワ Jember、ランプン Pringsewu／Pesawaran、南スラウェシ Soppeng）で栽培し、訓練パネル3名の官能と揮発特性を比較。遺伝と環境の双方が香味に有意に影響し、非芳香性系統でも Pesawaran／Soppeng では芳香性豆を生産。芳香グループはアルカロイド、ピラジン、アルコールが優占、非芳香グループはテルペノイドが優占。
- **適用範囲と限界**：供試は3クローンのみで「インドネシア産一般」ではない。官能パネルは3名と小規模。
- **何に使えるか**：インドネシア ― **地域・クローン別の官能＋揮発の実測**（産地×系統の組み合わせレベルの知見として特に有用）。出典URL：https://www.mdpi.com/2073-4395/13/10/2658/xml

### OR-11. Putri et al. 2025 ― インドネシア単一産地の官能受容
- **書誌情報**：Desiana Nuriza Putri, Ariza Budi Tunjung Sari, Hendy Firmanto, Jolien Devaere, Ann De Winne, Joachim Schouteten. "Volatile compounds and flavor perception of cocoa mass and dark chocolates from Indonesian cocoa beans: insights into sensory acceptability." *LWT – Food Science and Technology* 238: 118790, 2025. DOI: 10.1016/j.lwt.2025.118790.
- **確認経路・確認度**：ゲント大学学術書誌レコードで書誌・抄録を確認（ScienceDirect 直接照合ではない）。地域名の明細は抄録範囲では**未確認**（原著表の確認が必要）。
- **主要な知見**：インドネシアの異なる産地由来のカカオマスとダークチョコレート（50%／70%）の揮発プロファイルと記述的官能、消費者300名の受容を評価。加工後も産地固有の香味は保持され、産地ごとの官能プロファイルは明確に異なった。受容を駆動したのはカカオ感・甘いノート・褐色果実様で、ピラジン類、2-acetylfuran、2-nonanol 等と関連。
- **適用範囲と限界**：地域別値の抽出には原著が必要。
- **何に使えるか**：インドネシア ― 国内の産地間官能差の実測。出典URL：https://biblio.ugent.be/publication/01KCRYW5C6PZ6M7RDGQ83Y7GWQ

### OR-12. Juvinal et al. 2024 ― フィリピン単一産地のファインフレーバー
- **書誌情報**：Joel Juvinal, Joachim Schouteten, Dimas Rahadian Aji Muhammad, Geraldine G. Tayag, Alma A. de Leon, Hans De Steur, Koen Dewettinck, Xavier Gellynck. "Discovering fine flavour in Asian single-origin cocoa: fast GC electronic-nose aroma fingerprinting of cocoa liquors and consumer acceptability of Tablea in the Philippines." *International Journal of Food Science and Technology* 59(10): 7852–7864, 2024. DOI: 10.1111/ijfs.17059.
- **確認経路・確認度**：ゲント大学学術書誌で確認。
- **主要な知見**：フィリピン産クローン（UF18, BR25, W10）の豆品質とリカーの揮発性化合物を fast GC 電子鼻でフィンガープリントし、在来飲料 Tablea の消費者受容を評価。クローンごとに異なる香気プロファイル。W10 で methyl decanoate（果実様）、phenylacetaldehyde（蜂蜜・花様）等の望ましい揮発成分が高かった。
- **適用範囲と限界**：電子鼻によるフィンガープリントが中心で、個別化合物の定量精度は GC-MS 研究より限定的。3クローンのみ。
- **何に使えるか**：フィリピン ― クローンレベルの揮発性実測（新規産地エントリ候補）。出典URL：https://biblio.ugent.be/publication/01JG3G6XDF6WEZGKNXAQ065WVE

### OR-13. Akoa et al. 2023 ― カメルーン交配6系統の糖・揮発性
- **書誌情報**：Simon Perrez Akoa, Renaud Boulanger, Pierre Effa Onomo, Marc Lebrun, Martine Louise Ondobo, et al.（6名目以降の著者は HAL 引用表記が "et al." のため**未確認**）. "Sugar profile and volatile aroma composition in fermented dried beans and roasted nibs from six controlled pollinated Cameroonian fine-flavor cocoa (*Theobroma cacao* L.) hybrids." *Food Bioscience* 53: 102603, 2023. DOI: 10.1016/j.fbio.2023.102603.
- **確認経路・確認度**：HAL で確認。
- **主要な知見**：カメルーンの人工授粉ハイブリッド6系統の発酵乾燥豆と焙煎ニブの糖プロファイルと揮発性香気を分析。揮発成分48種を6つの香りグループに分類。花様はテルペン、チョコレート／ナッツ様はピラジン、バター様はラクトンに特異的。焙煎で総揮発量と果実様揮発が減少。
- **適用範囲と限界**：実験交配系統であり商業流通豆の代表ではない。官能評価は本論文には含まれない（続編 OR-14 が担当）。
- **何に使えるか**：カメルーン ― 系統レベルの揮発性実測。出典URL：https://hal.science/hal-05180461v1

### OR-14. Akoa et al. 2024 ― カメルーン系統チョコレートの官能
- **書誌情報**：Simon Perrez Akoa, Renaud Boulanger, Jude Manga Ndjaga, Pierre Effa Onomo, Marc Lebrun, Eliane Flore Eyenga, Gilles Morel, Raymond Ndip Nkongho, Pierre François Djocgoue. "Discriminating three lab scale dark chocolate bars from fine Cameroon cocoa hybrids using sensorial evaluation and organic acid content." *Journal of Food Science and Technology* 61(12): 2318–2331, 2024. DOI: 10.1007/s13197-024-05998-y. PMCID: PMC11486886.
- **確認経路・確認度**：PMC で確認。
- **主要な知見**：カメルーン産ハイブリッド3系統から実験室規模ダークチョコレート（リカー67%）を作り、パネル12名の官能、揮発（41種）、有機酸を測定。官能は系統で明確に異なり、SCA12×ICS40 はバニラ／甘い・スパイシー・花様、逆交配は果実様・苦い・ドライ、地元 Trinitario 系はチョコレート・蜂蜜様・木様・甘い。
- **適用範囲と限界**：3系統の実験室製品のみ。「カメルーン産の味」への一般化不可。
- **何に使えるか**：カメルーン ― 官能実測（系統レベル）。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC11486886/

### OR-15. Collin et al. 2023 ― ブラジル2州5系統の香気判別
- **書誌情報**：Sonia Collin, Toine Fisette, Anne Pinto, Jesus Souza, Hervé Rogez. "Discriminating Aroma Compounds in Five Cocoa Bean Genotypes from Two Brazilian States: White Kerosene-like Catongo, Red Whisky-like FL89 (Bahia), Forasteros IMC67, PA121 and P7 (Pará)." *Molecules* 28(4): 1548, 2023. DOI: 10.3390/molecules28041548. PMCID: PMC9961520.
- **確認経路・確認度**：MDPI／PMC で確認。
- **主要な知見**：バイーア州のファイン系統 Catongo（灯油様）と FL89（ウイスキー様）、パラ州の耐病性系統 IMC67, PA121, P7 の発酵豆を SAFE 抽出＋GC-EIMS で定量比較。Catongo の灯油様香気は ethyl acetate と isobutyl acetate の高濃度と関連。FL89 のウイスキー様ノートには ethyl benzoate、heptanoate、octanoate、trans-2-nonenal、1-octen-3-ol、3-methylbutanol が候補。パラ州3系統は類似クラスターを形成。
- **適用範囲と限界**：5系統のみの判別研究。ブラジル産一般のプロファイルではない。官能は既知の系統特性としての前提であり、本論文の主測定は機器分析。
- **何に使えるか**：ブラジル ― 州＋系統レベルの揮発性実測。特異的な香り記述（灯油／ウイスキー）が化合物レベルで裏付けられた稀な例。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC9961520/

### 産地の陰性結果の記録
- タンザニア産豆**単独**を対象とする官能評価論文・揮発成分論文・ポリフェノール／組成論文は、PubMed／PMC／Web の探索範囲で**見つからなかった**。キエラ（Kyela）に関する文献はバリューチェーン・経営系のみで香味・成分データなし。Kokoa Kamili に関する査読論文は見つからず（事業者・メーカー・メディア資料のみ、§9 参照）。タンザニア産カカオの遺伝構成を査読原著で実測した研究も**未確認**のまま（「Trinitario に Neo-Nacional が少量」は豆販売事業者ページの記述で、一次論文の裏付けは確認できなかった）。
- サントメ単独の官能研究は**見つからなかった**（OR-5 の6試料と既存調査の Cartas 2024 が上限）。ウガンダ産を単独対象とする官能・揮発研究も**見つからなかった**（OR-5 の2試料のみ）。
- コートジボワール豆の遊離脂肪酸形成に関する研究は品質劣化指標の研究で香味・官能ではないため候補から除外した。

---

## 4. 黄茶・黒茶

### YT-1. Shi et al. 2021 ― 中国黄茶の揮発成分と主要香気成分
- **書誌情報**：Y. Shi, M. Wang, Z. Dong, Y. Zhu, J. Shi, W. Ma, Z. Lin, H. Lv. "Volatile components and key odorants of Chinese yellow tea (Camellia sinensis L.)." *LWT* 146: 111512, 2021. DOI: 10.1016/j.lwt.2021.111512.
- **確認経路・確認度**：DOI・著者リストは PMC 収載論文の引用リストで確認。アブストラクトは ResearchGate 記録＋引用論文経由で確認し、ScienceDirect の当該記事ページ自体は未開示のため「一部未確認」。
- **主要な知見**：黄茶15試料を SBSE-GC-MS＋**GC-O** で分析。揮発成分74種、最多は geraniol（3.89 μg/g）。GC-O で**主要香気成分25種**（(E,E)- および (E,Z)-3,5-octadien-2-one、linalool oxides、geraniol、linalool、α-ionone、trans-β-ionone、1-octen-3-ol 等）。試料型は蒙頂黄芽、潙山黄茶、平陽黄湯。
- **適用範囲と限界**：君山銀針は試料型に含まれない。再構成・omission は報告なし。
- **何に使えるか**：黄茶 ― 香気（寄与レベル＝GC-O）。特に蒙頂黄芽の香気記述の裏付け。

### YT-2. Hong et al. 2023 ― 黄茶の香型別主要香気化合物
- **書誌情報**：X. Hong, C. Wang, R. Jiang, T. Hu, X. Zheng, J. Huang, Z. Liu, Q. Li. "Characterization of the Key Aroma Compounds in Different Aroma Types of Chinese Yellow Tea." *Foods* 12(1): 27, 2023. DOI: 10.3390/foods12010027. PMID: 36613243. PMCID: PMC9818532.
- **確認経路・確認度**：PubMed で直接確認。
- **主要な知見**：QDA で黄茶を4香型（floral、high-fired、fresh、corn-like）に分類。HS-SPME/GC-MS で揮発成分103種、多変量解析＋OAV で主要化合物47種を型別に同定。PLS で12化合物→花様・果実様＋甘さ、5→焙煎香、4→fresh/grassy と対応。
- **適用範囲と限界**：**GC-O なし、再構成なし**。寄与は OAV＋統計レベルにとどまる。
- **何に使えるか**：黄茶 ― 香型別プロファイル（香気の一般的知見レベル）。出典URL：https://pubmed.ncbi.nlm.nih.gov/36613243/

### YT-3. Wei et al. 2024 ― 悶黄最適化と黄茶の主要香気成分（sensomics）
- **書誌情報**：Y. Wei, J. Zhang, T. Li, M. Zhao, Z. Song, Y. Wang, J. Ning. "GC-MS, GC-O, and sensomics analysis reveals the key odorants underlying the improvement of yellow tea aroma after optimized yellowing." *Food Chemistry* 431: 137139, 2024. DOI: 10.1016/j.foodchem.2023.137139. PMID: 37604002.
- **確認経路・確認度**：PubMed で直接確認。
- **主要な知見**：最適化した悶黄（yellowing）で甘い香り+31.3%、花香+24.0%。GC-MS/GC-O で香気活性化合物21種。**再構成＋omission で主要香気成分7種を確認**：dimethyl sulfide、3-methylbutanal、β-ionone、β-damascenone、geraniol、phenylacetaldehyde、linalool。添加試験で β-damascenone（OAV 590.4）が甘さの主因、β-ionone（OAV 884.6）が花香の主因。
- **適用範囲と限界**：工程最適化研究であり、アブストラクト範囲では茶の品種・産地の詳細は不明。
- **何に使えるか**：黄茶 ― 香気（寄与レベル＝再構成・omission・添加で実証）。悶黄工程と香りの関係。出典URL：https://pubmed.ncbi.nlm.nih.gov/37604002/

### YT-4. Wang, Yue & Tong 2021 ― 中国黄茶15試料の呈味特性
- **書誌情報**：Z.-H. Wang, C.-N. Yue, H.-R. Tong. "Analysis of taste characteristics and identification of key chemical components of fifteen Chinese yellow tea samples." *Journal of Food Science and Technology* 58(4): 1378–1388, 2021. DOI: 10.1007/s13197-020-04649-2. PMID: 33746266. PMCID: PMC7925712.
- **確認経路・確認度**：PubMed で直接確認。
- **主要な知見**：中国黄茶15試料の QDA（11記述子：甘味、旨味、苦味、酸味、渋味、甘い後味、まろやかさ等）＋PLSR で、呈味に重要な化学成分22種を同定。
- **適用範囲と限界**：味覚のみで香気なし。寄与は統計的関連レベル。
- **何に使えるか**：黄茶 ― **味覚（呈味成分レベル）**。既存調査の「黄茶の呈味一次ソース未確認」を解消する候補。出典URL：https://pubmed.ncbi.nlm.nih.gov/33746266/

### YT-5. Fan et al. 2022 ― 悶黄時間と化学プロファイル・官能
- **書誌情報**：F.-Y. Fan, S.-J. Zhou, H. Qian, B.-Z. Zong, C.-S. Huang, R.-L. Zhu, H.-W. Guo, S.-Y. Gong. "Effect of Yellowing Duration on the Chemical Profile of Yellow Tea and the Associations with Sensory Traits." *Molecules* 27(3): 940, 2022. DOI: 10.3390/molecules27030940. PMID: 35164205. PMCID: PMC8839223.
- **確認経路・確認度**：PMC 全文で直接確認。
- **主要な知見**：悶黄0–13時間で旨味と緑茶様香気が低下し、甘い味・まろやかな味・甘い香りが上昇。成分230種を測定し、非揮発25種＋揮発42種が主要な寄与候補（相関レベル）。カテキン・フラボノール配糖体・カフェイン低下と一部アミノ酸上昇が甘さ・まろやかさと関連。
- **適用範囲と限界**：GC-O なし。寄与は相関レベル。
- **何に使えるか**：黄茶 ― 成分と味覚・香気の工程内時間変化。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC8839223/

### YT-6. Xu et al. 2026 ― 蒙頂黄芽のマルチオミクス呈味形成
- **書誌情報**：J. Xu, P. Luo, M. Xie, C. Liu, X. Li, J. Zhao, C. Chen, B. Sun, C. He, X. Du, M. Zheng, J. Bian（著者リストは二次プロフィール由来で、著者順・完全性は要再確認）. "Comprehensive multi-omics analysis of Mengding bud yellow tea in the intangible cultural heritage: insights into taste formation." *npj Science of Food*, 2026（Nature ページ記録では 2026-06-13 公開）。DOI: 10.1038/s41538-026-00930-4。巻・記事番号は**未確認**。
- **確認経路・確認度**：Nature ページを開いて確認（見出し部の未取得部分あり）。
- **主要な知見**：伝統製法「三黄三炒」の蒙頂黄芽を flavoromics＋metabolomics＋QDA で解析。悶黄が旨味・甘味形成に決定的。差異化合物156種。theanine glucoside が呈味寄与候補（著者自身が単独寄与は未証明と明記）。緑茶との比較でバイオマーカー19種、EPSF 類が最も顕著。
- **適用範囲と限界**：theanine glucoside の寄与は候補段階。書誌の一部（巻・記事番号、著者リスト完全性）は未確認。
- **何に使えるか**：黄茶（蒙頂黄芽）― 味覚形成・成分。出典URL：https://www.nature.com/articles/s41538-026-00930-4

### DT-1. Pang et al. 2019 ― 生・熟プーアル茶の強力香気成分（AEDA）
- **書誌情報**：X. Pang, W. Yu, C. Cao, X. Yuan, J. Qiu, F. Kong, J. Wu. "Comparison of Potent Odorants in Raw and Ripened Pu-Erh Tea Infusions Based on Odor Activity Value Calculation and Multivariate Analysis: Understanding the Role of Pile Fermentation." *Journal of Agricultural and Food Chemistry* 67(47): 13139–13149, 2019. DOI: 10.1021/acs.jafc.9b05321. PMID: 31631665.
- **確認経路・確認度**：PubMed で直接確認。
- **主要な知見**：浸出液を GC-O＋**AEDA**＋OAV＋多変量解析。熟茶は OAV>1 が35種（生茶19種）。**陳香・カビ様の methoxybenzene 類が熟茶への寄与最大**。判別マーカー：linalool、α-ionone、1,2,4-trimethoxybenzene、1,2,3-trimethoxy-5-methylbenzene、1,2,3,4-tetramethoxybenzene、1,2,3-trimethoxybenzene。
- **適用範囲と限界**：アブストラクト範囲では再構成なし。
- **何に使えるか**：黒茶（熟プーアル）― 香気（寄与レベル＝AEDA＋OAV）、生茶との差異、渥堆発酵の役割。出典URL：https://pubmed.ncbi.nlm.nih.gov/31631665/

### DT-2. Wang B et al. 2022 ― 熟プーアル茶の香気化合物（SAFE＋GC-O）
- **書誌情報**：B. Wang, Q. Meng, L. Xiao, R. Li, C. Peng, X. Liao, J. Yan, H. Liu, G. Xie, C.-T. Ho, H. Tong（著者文字列は二次記録で一部乱れあり。筆頭著者群・誌名・巻・ページは ScienceDirect 目次で堅固）. "Characterization of aroma compounds of Pu-erh ripen tea using solvent assisted flavor evaporation coupled with gas chromatography-mass spectrometry and gas chromatography-olfactometry." *Food Science and Human Wellness* 11(3): 618–626, 2022. DOI: 10.1016/j.fshw.2021.12.018.
- **確認経路・確認度**：ScienceDirect でアブストラクト直接確認。
- **主要な知見**：SAFE＋GC-MS＋GC-O＋OAV。揮発成分58種、香気活性24種。methoxyphenyl 化合物が支配的。methoxybenzene 6種→陳香；α-ionone、3,4-dimethoxytoluene、1,3-dimethoxybenzene→木様；linalool、α-terpineol、α-/β-ionone、benzeneacetaldehyde→花様。methoxyphenyl 化合物8種の水中閾値を実測。
- **適用範囲と限界**：再構成・omission はアブストラクトに記載なし。
- **何に使えるか**：黒茶（熟プーアル）― 香気（寄与レベル＝GC-O＋OAV＋閾値実測）。出典URL：https://www.sciencedirect.com/science/article/pii/S2213453021001464

### DT-3. Li Q et al. 2022 ― 六堡茶の香型別主要香気化合物とコア微生物
- **書誌情報**：Q. Li, X. Hong, X. Zheng, Y. Xu, X. Lai, C. Teng, W. Wu, J. Huang, Z. Liu. "Characterization of key aroma compounds and core functional microorganisms in different aroma types of Liupao tea." *Food Research International* 152: 110925, 2022. DOI: 10.1016/j.foodres.2021.110925.
- **確認経路・確認度**：PMC 収載論文の引用リスト、OpenAIRE、CoLab 記録で確認。**出版社／PubMed ページは直接未開示**。
- **主要な知見**：HS-SPME/GC-MS＋Illumina MiSeq。揮発成分102種。3香型（stale、betelnut、fungal）ごとに判別化合物6/5/9種。優占菌は Aspergillus、Wallemia、Xeromyces。
- **適用範囲と限界**：GC-O/OAV による寄与主張はアブストラクトにない（GC-MS＋多変量の判別レベル）。
- **何に使えるか**：黒茶（六堡茶）― 香型・香気成分・微生物。出典URL：https://explore.openaire.eu/search/publication?articleId=doi_dedup___::76a215b7efff994069ea43e9ded5d221

### DT-4. Huo et al. 2024 ― 六堡茶の渥堆工程中の香味変化
- **書誌情報**：H. Huo, A. Cai, Y. Xie, C. Guo. "Changes in flavor quality of raw Liupao tea during the piling process." *Heliyon* 10(22): e40175, 2024. DOI: 10.1016/j.heliyon.2024.e40175. PMID: 39641055. PMCID: PMC11617929.
- **確認経路・確認度**：PubMed で直接確認。
- **主要な知見**：生六堡茶の渥堆11時点で官能評価＋HPLC＋HS-SPME-GC-MS。品質は上昇後に低下し4段階に区分。呈味変化の主要因：EGCG、ECG、EGC、catechin gallate、theobromine の減少と、gallic acid、gallocatechin、theaflavin の増加。香気には cedrol、methyl salicylate、trans-nerolidol、decanal、(E,E)-2,4-heptadienal 等19種の特徴化合物の変化が影響。
- **適用範囲と限界**：完成茶ではなく製造工程中の生茶が対象。寄与は多変量相関レベル（GC-O なし）。
- **何に使えるか**：黒茶（六堡茶）― 味覚・香気の工程内時間変化。出典URL：https://pubmed.ncbi.nlm.nih.gov/39641055/

### DT-5. Li Y et al. 2024 ― 茯磚茶の sensomics（7地域）
- **書誌情報**：Y. Li, R. Wang, T. Xiao, L. Song, Y. Xiao, Z. Liu, K. Wang, J. Huang, M. Zhu. "Unveiling key odor-active compounds and bacterial communities in Fu Brick tea from seven Chinese regions: A comprehensive sensomics analysis using GC–MS, GC-O, aroma recombination, omission, and high-throughput sequencing." *Food Research International* 196: 114978, 2024. DOI: 10.1016/j.foodres.2024.114978.
- **確認経路・確認度**：PlumX の Elsevier 引用データ＋Mendeley 記録で確認。**ScienceDirect ページは直接未開示**。
- **主要な知見**：7地域41試料。揮発成分63種、GC-O で香気活性32種。**再構成（recombination）＋omission 実施**。高品質茯磚茶の主要香気活性成分：1-octen-3-ol、phenylethyl alcohol、β-ionone、dihydroactinidiolide、1,2,3-trimethoxybenzene。優占細菌は Bacillus、Pseudomonas、Streptococcus。
- **適用範囲と限界**：出版社ページ未開示のため書誌は二次裏取り段階。
- **何に使えるか**：黒茶（茯磚茶）― 香気（寄与レベル＝再構成・omission で実証、黒茶候補中最強クラス）。

### DT-6. Li Q et al. 2020 ― 茯磚茶の製造工程中の主要香気化合物
- **書誌情報**：Q. Li, Y. Li, Y. Luo, L. Xiao, K. Wang, J. Huang, Z. Liu. "Characterization of the key aroma compounds and microorganisms during the manufacturing process of Fu brick tea." *LWT* 127: 109355, 2020. DOI: 10.1016/j.lwt.2020.109355.
- **確認経路・確認度**：複数の引用論文・PMC 経由で書誌確認。**アブストラクト未読**のため内容の要約は未確認。
- **主要な知見**：未確認（書誌のみ）。
- **適用範囲と限界**：登録判断前に出版社ページでの確認が必須。
- **何に使えるか**：黒茶（茯磚茶）― 製造工程中の香気・微生物（見込み）。

### DT-7. Nie et al. 2019 ― 四川黒磚茶と四川茯磚茶の香気比較
- **書誌情報**：C.-N. Nie, X.-X. Zhong, L. He, Y. Gao, X. Zhang, C.-M. Wang, X. Du. "Comparison of different aroma-active compounds of Sichuan Dark brick tea (Camellia sinensis) and Sichuan Fuzhuan brick tea using gas chromatography-mass spectrometry (GC-MS) and aroma descriptive profile tests." *European Food Research and Technology* 245(9): 1963–1979, 2019. DOI: 10.1007/s00217-019-03304-1（巻・ページは引用誌の引用リスト由来、DOI は論文PDFヘッダ由来）。
- **確認経路・確認度**：Springer ページ未開示のため「一部未確認」。
- **主要な知見**：HS-SPME-GC-MS＋**OAV**＋記述プロファイル（GC-O なし）。共通揮発成分37種、香気活性は茯磚20種・黒磚21種。β-ionone が両者で最大 OAV。茯磚は "fungi flower aroma"、黒磚は "aged fragrance" と特徴付け。
- **適用範囲と限界**：寄与は OAV レベル。
- **何に使えるか**：黒茶（茯磚茶・黒磚茶）― 香気比較。

### DT-8. Shi et al. 2019 ― 茯磚茶・プーアル茶の揮発成分インベントリ
- **書誌情報**：J. Shi, Y. Zhu, Y. Zhang, Z. Lin, H. Lv. "Volatile composition of Fu-brick tea and Pu-erh tea analyzed by comprehensive two-dimensional gas chromatography-time-of-flight mass spectrometry." *LWT* 103: 27–33, 2019. **DOI 未確認**。
- **確認経路・確認度**：FAO AGRIS レコードで確認。
- **主要な知見**：SDE＋GC×GC-TOFMS で茯磚茶373種・プーアル茶408種の成分を暫定同定。
- **適用範囲と限界**：**GC-O/OAV なし＝検出のみ**。寄与・香味記述の根拠には使用不可。
- **何に使えるか**：黒茶 ― 成分インベントリ（検出リスト）のみ。出典URL：https://agris.fao.org/search/en/providers/122535/records/65df7e900f3e94b9e5d92c3e

---

## 5. 白茶の貯蔵変化・ほうじ茶・玄米茶

### WT-1. Dai et al. 2018 ― 貯蔵白茶のマーカー化合物 EPSF
- **書誌情報**：W. Dai, J. Tan, M. Lu, Y. Zhu, P. Li, Q. Peng, L. Guo, Y. Zhang, D. Xie, Z. Hu, Z. Lin. "Metabolomics Investigation Reveals That 8-C N-Ethyl-2-pyrrolidinone-Substituted Flavan-3-ols Are Potential Marker Compounds of Stored White Teas." *Journal of Agricultural and Food Chemistry* 66(27): 7209–7218, 2018. DOI: 10.1021/acs.jafc.8b02038. PMID: 29921123.
- **確認経路・確認度**：PubMed で直接確認。
- **主要な知見**：白毫銀針・白牡丹を各種貯蔵期間で LC-MS メタボロミクス。4年超でフラバン-3-オール、プロシアニジン、テアシネンシン、テアフラビン、フラボノール配糖体、大半のアミノ酸が減少。テアニン＋フラバン-3-オールから生成する EPSF（新規7種）は貯蔵期間と正相関し、貯蔵年数の化学的指標になる。
- **適用範囲と限界**：**非揮発成分のみ——香気・官能データなし**。
- **何に使えるか**：白茶 ― 成分の時間変化（非揮発マーカー）、貯蔵年数の指標。出典URL：https://pubmed.ncbi.nlm.nih.gov/29921123/

### WT-2. Wang Z et al. 2022 ― 緊圧白茶の長期貯蔵における香気の推移
- **書誌情報**：Z. Wang, Z. Wang, H. Dai, S. Wu, B. Song, F. Lin, Y. Huang, X. Lin, W. Sun. "Identification of characteristic aroma and bacteria related to aroma evolution during long-term storage of compressed white tea." *Frontiers in Nutrition* 9: 1092048, 2022. DOI: 10.3389/fnut.2022.1092048. PMID: 36601074. PMCID: PMC9806140.
- **確認経路・確認度**：PMC 全文で直接確認。
- **主要な知見**：寿眉の緊圧茶ケーキ（同一メーカー・同一品種・同一茶園・同一製法、同一倉庫で乾燥・換気）を1・3・5・7・9・10・13・16年で比較。香りは甘い／果実様／花様 → 陳香 → 木様 → 薬草様へ移行。VOC 56種（54種に有意差）。アルコール類は1–5年、エステル類は7–13年、アルデヒド類は16年で最多。VOC 29種が6つの香気下位属性と有意相関し、特徴的差異VOC 23種で貯蔵年を識別可能。
- **適用範囲と限界**：**GC-O/OAV なし**——「重要な香気成分」は相関ベース。単一メーカー・寿眉・緊圧形態に限る。
- **何に使えるか**：白茶 ― **香気の時間変化（年数系列つき）**。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC9806140/

### WT-3. Zhao et al. 2022 ― 陳年白茶のマクロ組成の動態
- **書誌情報**：F. Zhao, M. Chen, S. Jin, S. Wang, W. Yue, L. Zhang, N. Ye. "Macro-composition quantification combined with metabolomics analysis uncovered key dynamic chemical changes of aging white tea." *Food Chemistry* 366: 130593, 2022. DOI: 10.1016/j.foodchem.2021.130593.
- **確認経路・確認度**：書誌は PlumX/Mendeley、アブストラクトは ScienceDirect 検索記録経由。出版社ページの直接確認は検索記録レベル。
- **主要な知見**：1・2・3・4・5・6・7・10・11・13年貯蔵の10サブセット。総フラボノイド、テアルビジン、テアブラウニンは増加、総ポリフェノールは減少。1/7/13年のメタボロミクスでは差異代謝物は主にフラボノール／フラボン配糖体。
- **適用範囲と限界**：非揮発のみ、香気なし。
- **何に使えるか**：白茶 ― 成分の時間変化（非揮発）。

### WT-4. Li W et al. 2026 ― 白牡丹の貯蔵0–11年マルチオミクス
- **書誌情報**：W. Li, J. Chen, J. Zhang, Z. Peng. "Multi-omics insights into the formation mechanism of aging quality in white tea (Bai Mudan) during storage: Integrating sensory evaluation, volatilomics, metabolomics, and metagenomics." *Food Research International* 224: 117996, 2026（Epub 2025-12-04）。DOI: 10.1016/j.foodres.2025.117996. PMID: 41412669.
- **確認経路・確認度**：PubMed で直接確認。
- **主要な知見**：官能は fresh（grassy、fruity）→ aged（woody、stale）へ。揮発成分72種、**cedrol と isophorone が陳年特徴香気成分（rOAV ≥1、VIP ≥1、p ≤0.05）**。非揮発1146種（脂肪アシル類とフラボノイドが蓄積、アミノ酸は減少）。メタゲノムでは前半7年は細菌優占、後半は細菌–真菌協働。
- **適用範囲と限界**：寄与は rOAV＋多変量基準レベル（GC-O・再構成なし）。
- **何に使えるか**：白茶（白牡丹）― 香気・成分・微生物の時間変化。出典URL：https://pubmed.ncbi.nlm.nih.gov/41412669/

### WT-5. Wang Z et al. 2024 ― 陳年金華白茶の香味
- **書誌情報**：Z. Wang, Y. Liang, C. Gao, W. Wu, J. Kong, Z. Zhou, Z. Wang, Y. Huang, W. Sun. "The flavor characteristics and antioxidant capability of aged Jinhua white tea and the mechanisms of its dynamic evolution during long-term aging." *Food Chemistry* 436: 137705, 2024. DOI: 10.1016/j.foodchem.2023.137705.
- **確認経路・確認度**：書誌は PMC 引用論文・OUCI で堅固。アブストラクトは ScienceDirect 著者ページの断片のみで、詳細は**未確認**。
- **主要な知見**（断片範囲）：フレーバーホイール構築、菌花香と陳味が特徴、味覚属性に有意寄与18成分、香気属性に有意寄与39 VOC。
- **適用範囲と限界**：**「金華」白茶は Eurotium で発花させた白茶であり、通常の自然陳化とは別物**。通常の陳年白茶への適用は不可に近い。
- **何に使えるか**：発花白茶 ― 香味（限定用途）。

### HJ-1. Sasaki et al. 2017 ― 焙煎茎茶（棒ほうじ茶）の香気成分（GC-O/AEDA）
- **書誌情報**：T. Sasaki, E. Koshi, H. Take, T. Michihata, M. Maruya, T. Enomoto. "Characterisation of odorants in roasted stem tea using gas chromatography-mass spectrometry and gas chromatography-olfactometry analysis." *Food Chemistry* 220: 177–183, 2017. DOI: 10.1016/j.foodchem.2016.09.208. PMID: 27855886.
- **確認経路・確認度**：PubMed で直接確認。
- **主要な知見**：市販の焙煎茎茶（棒ほうじ茶）の強力な香気成分を GC-MS＋GC-O＋**AEDA** で解明し、同一茶樹由来の焙煎葉茶と比較。ピラジン類が焙煎香と高い FD ファクターを示し茎茶の方が豊富。geraniol と linalool も高い FD で花香を示し茎茶の方が豊富。
- **適用範囲と限界**：主対象は茎茶。葉ほうじ茶への外挿は同一研究内の比較範囲に限る。
- **何に使えるか**：ほうじ茶（棒ほうじ茶）― 香気（寄与レベル＝AEDA）。葉茶との比較データも含む。出典URL：https://pubmed.ncbi.nlm.nih.gov/27855886/

### HJ-2. Sasaki et al. 2020 ― 焙煎条件と茎茶の香気・呈味成分
- **書誌情報**：T. Sasaki, N. Yuikawa, N. Tanihiro, T. Michihata, T. Enomoto. "The Effects of Roasting Conditions on the Physical Appearance Traits and Aroma and Taste Components of Roasted Stem Tea." *Food Science and Technology Research* 26(5): 643–654, 2020. DOI: 10.3136/fstr.26.643.
- **確認経路・確認度**：J-STAGE 全文で直接確認。
- **主要な知見**：鹿児島産やぶきた一番茶の茎をドラム焙煎（180/200/220℃）。Sasaki 2017 の GC-O 強力香気成分から事前選択した22香気成分を SBSE-GC-MS でプロファイリングし、アミノ酸・カテキン・色も測定。高温ほどピラジン（焦点化合物 2-ethyl-3,5-dimethylpyrazine）と geraniol が増加、カテキンとアミノ酸は急減。
- **適用範囲と限界**：**茎茶であり葉ほうじ茶ではない**（葉への移転は推論）。22成分は事前選択バイアスあり。
- **何に使えるか**：ほうじ茶（棒ほうじ茶）― 焙煎温度と香気・呈味成分の関係。出典URL：https://www.jstage.jst.go.jp/article/fstr/26/5/26_643/_html/-char/ja

### HJ-3. Gotti, Leoni & Fiori 2021 ― 焙煎が緑茶揮発成分とピラジンに与える効果の定量
- **書誌情報**：R. Gotti, A. Leoni, J. Fiori. "Evaluation of Roasting Effect on Selected Green Tea Volatile Flavor Compound and Pyrazine Content by HS-SPME GC-MS." *Applied Sciences* 11(17): 8217, 2021. **DOI 未確認**（MDPI ページ本文から取得できず。推測で作らない）。
- **確認経路・確認度**：MDPI ページを開いて確認。
- **主要な知見**：同位体標識内標準による検証済み HS-SPME GC-MS 定量法で10香気成分（ピラジン4種、β-damascenone、β-ionone、linalool、indole 等）を測定。緑茶を160/180/200℃×30分焙煎し160℃が最適と判断。市販番茶ほうじ茶を精度検証に使用。
- **適用範囲と限界**：本研究自体は**検出・定量のみ**。対象10成分の「主要寄与」という位置づけは、同論文が引用する先行 AEDA/GC-O 文献に依拠する——この区別を明記すべき。
- **何に使えるか**：ほうじ茶 ― ピラジン類の**定量**データ、焙煎温度の影響。出典URL：https://www.mdpi.com/2076-3417/11/17/8217

### HJ-4. Mizukami, Sawai & Yamaguchi 2008 ― 緑茶焙煎による香気成分等の変化
- **書誌情報**：Yuzo Mizukami, Yusuke Sawai, Yuichi Yamaguchi. "Changes in the Concentrations of Acrylamide, Selected Odorants, and Catechins Caused by Roasting of Green Tea." *Journal of Agricultural and Food Chemistry* 56(6): 2154–2159, 2008. DOI: 10.1021/jf0731806. 所属は野菜茶業研究所。PMID は未確認。
- **確認経路・確認度**：書誌は ACS 誌の巻目次で確定（第2ラウンド）。ただし**アブストラクトを原典で直接読めていない**（DOI 解決先が 403）。内容は引用側の一次論文（Gotti 2021、Sasaki 2020）経由でのみ把握。
- **主要な知見**（引用経由）：160℃ vs 180℃焙煎で、含窒素の強力香気成分3種（2-ethyl-3,5-dimethylpyrazine、2-ethyl-3,6-dimethylpyrazine、pyrrole-2-carboxaldehyde）が180℃で大幅に増加。アクリルアミドとカテキンの変化も追跡。
- **適用範囲と限界**：登録判断前に原典の直接確認が必須。
- **何に使えるか**：ほうじ茶（葉）― 焙煎香気生成の原典候補。

### HJ-5. Sugimoto, Tatsumi & Ichitani 2025 ― 焙煎緑茶香気の吸入研究
- **書誌情報**：Sugimoto, Tatsumi, Ichitani（名の綴りは出版社PDF記録に基づく）. "Sedative effects of roasted green tea aroma on autonomic nervous activity, central nervous activity, and subjective mood state in healthy adults." *Functional Foods in Health and Disease* 15(1): 68–87, 2025. DOI: 10.31989/ffhd.v15i1.1467。著者は伊藤園中央研究所所属（企業所属を明記）。
- **確認経路・確認度**：出版社PDFで直接確認。
- **主要な知見**：静岡産一番茶を釜焙煎180℃/10分した焙煎緑茶の香気を健常成人20名が2分間**吸入のみ（飲用なし）**。先行 AEDA 文献で FD の高いピラジン3種を定量し試験。2,3,5-trimethylpyrazine が鎮静効果に最も重要と判断。
- **適用範囲と限界**：**カップの香味・味覚の証拠にはならない**（生理・心理効果の研究）。ペアリング用途は周辺情報どまり。
- **何に使えるか**：ほうじ茶 ― ピラジン同定の文脈情報のみ。出典URL：https://www.ffhdj.com/index.php/ffhd/article/download/1467/4230

### 玄米茶について（陰性結果の記録）
- 英日韓の語（genmaicha／玄米茶／hyeonmi-nokcha）で探索したが、**緑茶＋炒り米のブレンドである玄米茶そのものを対象に香気・呈味を測った査読論文は見つからなかった**（第2ラウンドで国内文献を再確認中）。
- 参考情報格付け（実測・寄与の根拠には使えない）：小売・メーカー記事（玄米茶の香気成分としてピラジンを挙げるコラム等）、文部科学省 食品成分データベース（玄米茶／浸出液、食品番号16041。成分表であって香気研究ではない。https://fooddb.mext.go.jp/ ）、伊藤園 PR TIMES リリース（味覚センサーによるフードペアリングの主張。メーカー資料）、香料用語集ページ（ポップコーン様ノートを 2-acetyl-1-pyrroline に帰属させる記述。一次ソースなし）。
- 隣接する別製品の研究（玄米茶ではない）：Zhou et al. 2023. "Effects of degree of milling on nutritional quality, functional characteristics and volatile compounds of brown rice tea." *Frontiers in Nutrition* 10: 1232251. DOI: 10.3389/fnut.2023.1232251（Frontiers／PMC で確認：https://pmc.ncbi.nlm.nih.gov/articles/PMC10483151/）。対象は**茶葉を含まない玄米茶（brown rice tea）**で、精米度と揮発成分の関係を GC-MS で測定。玄米茶の「炒り米側」の手がかりにはなり得るが、製品が異なるため玄米茶のデータとしては使用不可と明記すべき。

---

## 6. 個別茶の GC-O/AEDA 研究（鉄観音・岩茶・東方美人・祁門・龍井ほか）

### TC-1. Zhu et al. 2015 ― 鉄観音＋大紅袍＋凍頂の GC-O 比較研究
- **書誌情報**：J. Zhu, F. Chen, Y. Wang, Y. Niu, D. Shu, K. Chen, Y. Luo, X. Xiao, M. Yuan, D. Fang, S. He, J. Han, K. Zhu. "Comparison of Aroma-Active Volatiles in Oolong Tea Infusions Using GC-Olfactometry, GC-FPD, and GC-MS." *Journal of Agricultural and Food Chemistry* 63(34): 7499–7510, 2015. DOI: 10.1021/acs.jafc.5b02358. PMID: 26257073.
- **確認経路・確認度**：PubMed アブストラクトを直接確認。
- **主要な知見**：安渓鉄観音・大紅袍・台湾凍頂（各2種）を GC-O＋GC-FPD＋GC-MS＋OAV で比較。3茶共通の重要香気27化合物を同定。OAV>1 は3茶に共通して16化合物（β-damascenone、hexanal、methyl salicylate、geraniol、(E)-2-hexenal、furfural、(E,E)-2,4-heptadienal、(Z)-jasmone、indole、linalool、(Z)-3-hexen-1-ol、(E,E)-2,4-nonadienal、methyl jasmonate、phenylethyl alcohol、benzaldehyde、nonanal）。nerolidol は凍頂のみで重要。3-methylnonane-2,4-dione は鉄観音と凍頂の成分であり大紅袍には含まれなかった。
- **適用範囲と限界**：**OAV は3茶共通の範囲値として示されており、鉄観音単独の値は抽出できない**。試料は各2種のみ。中国茶ブランド認定研究所と永豊余（台湾）共著。
- **何に使えるか**：鉄観音・大紅袍・凍頂烏龍 ― 香気（GC-O＋OAV レベル）の横断比較出典。出典URL：https://pubmed.ncbi.nlm.nih.gov/26257073/

### TC-2. Wang J et al. 2022 ― 大紅袍（水仙）のセンソミクス
- **書誌情報**：J. Wang, R. Zhang, Y. Jiang, X. Du, X. Li, Y. Jiang, L. Zhu, G. Zhu, D. Ni. "Reconstitution and Omission Tests in Characterization of the Aroma in a Water Extract of Da Hong Pao Tea." *Journal of Agricultural and Food Chemistry* 70(34): 10571–10583, 2022. DOI: 10.1021/acs.jafc.2c01873. PMID: 35973132.
- **確認経路・確認度**：PubMed アブストラクトを直接確認。
- **主要な知見**：GC-O で香気活性51化合物。水中で閾値を実測（0.08–600 µg/kg）して濃度/閾値から OAV 算出。OAV ≥1 は12種（(E)-β-ionone、methyl 2-methylbutanoate、phenylacetaldehyde、linalool、hexanal、octanal、(E)-nerolidol、(E,E)-2,4-heptadienal、(E,E)-2,4-decadienal、safranal、(E)-2-nonenal、coumarin）。再構成モデルで茶葉原香再現に成功し、**omission テストで (E)-β-ionone と (E)-nerolidol が主要2香気物質**と証明。
- **適用範囲と限界**：原料は水仙であり、大紅袍という混合物の代表として用いられている点は限界として残る。閾値は水中実測で再現性は高い。
- **何に使えるか**：岩茶（大紅袍）― 香気の寄与実証（再構成＋omission）。出典URL：https://pubmed.ncbi.nlm.nih.gov/35973132/

### TC-3. Zhang et al. 2022 ― 武夷岩茶4品種の GC-O
- **書誌情報**：Y. Zhang, C. Kang, H. Wang, M. Zhang, L. Yu, W. Zhang, C. Ma, X. Wen. "Characterization of major aroma-active compounds in Wu-yi rock tea." *Food Science and Technology Research* 28(6): 473–482, 2022. DOI: 10.3136/fstr.FSTR-D-22-00051. PMID: 36553850.
- **確認経路・確認度**：PubMed アブストラクトを直接確認。
- **主要な知見**：大紅袍・肉桂・水仙・奇蘭の4品種。各100gを1Lの水で80℃×10分浸出し、P&T＋GC-O-MS。揮発成分166種以上を検出し、GC-O 活性は56種。hexanal、(Z)-jasmone、linalool、geraniol、2,4-decadienal、benzaldehyde 等が最も高い香気強度を示した。
- **適用範囲と限界**：**「揮発166種以上検出」と「GC-O 活性56種」は別の数字**であり、166種全体を香気寄与と読んではならない。品種構成の命名（大紅袍は本来ブレンド名だが本論文では品種として扱われている）。
- **何に使えるか**：岩茶 ― 4品種横断の香気活性比較。出典URL：https://pubmed.ncbi.nlm.nih.gov/36553850/

### TC-4. Ding et al. 2025 ― 大紅袍の空カップ香
- **書誌情報**：J. Ding, S. Xu, G. Su, Z. Tang, A. J. Wijaya, X. Zhang, J. Zhou, Q. Zheng, D. Hou, P. Li, Y. Wang, Q. Ni, H. Yu, X. Ying, Y. Fu. "Deciphering the key volatile compounds contributing to the empty-cup aroma of Dahongpao oolong tea using a sensomics approach." *Beverage Plant Research* 5: e025, 2025. DOI: 10.48130/bpr-0025-0022.
- **確認経路・確認度**：PMC 全文で直接確認（PMCID: PMC12349039）。
- **主要な知見**：大紅袍の空カップ残香を SAFE＋GC-MS/O＋AEDA で分析（揮発66種、GC-O 活性32種）。linalool・3-octen-2-one・1-octen-3-ol・benzaldehyde・hexanal の FD が最大342倍。酪酸2種は30℃→100℃で濃度が8倍超増加し、高温焙煎により St-STP（street retention）に寄与。再構成＋omission でも (E)-nerolidol と benzaldehyde が最も寄与。
- **適用範囲と限界**：対象は「カップ残香」という飲用後の知覚であり、液自体の香味プロファイルそのものではない。
- **何に使えるか**：岩茶（大紅袍）― 飲用後の残香・カップ香の時間変化。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC12349039/

### TC-5. Wang D et al. 2023 ― 凍頂烏龍のセンソミクス
- **書誌情報**：D. Wang, Y. Luo, X. Wang, F. Ortegón, J. Zhang, S. Yang, W. Lee, et al. "Odorants in a Freeze-Dried Dong Ding Oolong Tea Extract: A Sensomics Approach." *Foods* 12(17): 3158, 2023. DOI: 10.3390/foods12173158. PMID: 37685090.
- **確認経路・確認度**：PMC 全文で直接確認（PMCID: PMC10486957）。
- **主要な知見**：凍結乾燥した凍頂茶葉を SDE＋GC-O で分析。53の嗅覚活性領域のうち34臭気物質を同定。OAV スクリーニングで9種が強力。**omission テストで 3-hydroxy-4,5-dimethylfuran-2(5H)-one（sotolon）が凍頂の焙煎様カラメル香に最も寄与**することを証明。「烏龍茶でソトロンが香気的に重要」と示した初の論文。
- **適用範囲と限界**：凍結乾燥茶葉の熱水抽出物が対象であり、市販形態（生葉・焙煎葉）そのものではない。
- **何に使えるか**：凍頂烏龍 ― 香気の寄与実証（omission）。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC10486957/

### TC-6. 東方美人 ― GC-O/AEDA 級の研究は見つからず（陰性結果）
- 対象探索（GC-O、AEDA、sensomics、气味活性、GC-嗅觉 等の語で多重検索）では、東方美人そのものの **GC-O/AEDA 研究は見つからなかった**。
- 近接文献（レベルが異なるため格付け明示）：
- (a) Cho et al. 2007. "Quantitative Analysis of Volatile Compounds in Oriental Beauty Oolong Tea"（SPME-GC/MS 系）. *Canadian Journal of Analytical Sciences and Spectroscopy* 52(4): 231–236, 2007. SPME-GC-MS で63揮発成分を検出（検出のみ）。DOI 解決先が 403 のため**アブストラクトの一次確認は未完**であり、書誌の細部は再確認課題（第2ラウンド）とする。
- (b) Zeng et al. 2022. *Plants* 11(24): 3486, 2022（PMC 全文確認、PMCID: PMC9785473）。東方美人「製法」を金萱・鉄観音の葉に適用したもので、東方美人そのものの試料ではない。linalool の上昇と蜜様の甘さは「東方美人製法」の効果として記録されたもの。
- **結論**：東方美人の GC-O 級データは現時点で確保できず、「寄与実証あり」とは記せない。

### TC-7. 祁門紅茶
#### TC-7a. Huang et al. 2022 ― 萎凋法の違いによる感覚と香気（sensomics アプローチ）
- **書誌情報**：Q. Huang, S. Yang, G. Tang, L. Dou, J. Ning, J. Miao, Zhang, L. Zhang. "Comparative evaluation of the sensory and aroma quality of Keemun black tea produced by two different withering methods." *Food Chemistry* 395: 133549, 2022. DOI: 10.1016/j.foodchem.2022.133549. PMID: 35777211.
- **確認経路・確認度**：PubMed アブストラクトを直接確認。
- **主要な知見**：対流加熱萎凋（HAW）vs 自然換気萎凋（NVW）。HAW は「甘い・バラ様」が強く、揮発成分濃度が高い。sensomics で20化合物を同定し、**12種が再構成によりバラ様の甘香と確認**、omission テストでも検証（(2E,6Z)-nona-2,6-dienal と (E)-β-damascenone が最大の影響）。linalool は花香・甘い香の中心物質。
- **適用範囲と限界**：対象は萎凋法の比較であり、祁門一般の香味プロファイルではない。
- **何に使えるか**：祁門紅茶 ― 香気の寄与実証（製法条件つき）。出典URL：https://pubmed.ncbi.nlm.nih.gov/35777211/

#### TC-7b. Tao et al. 2022 ― 祁門紅茶の貯蔵1年での変化（§7 とも重複）
- **書誌情報**：M. Tao, W. Guo, W. Zhang, Z. Liu. "Characterization of volatile components and odor activity values in the infusion of Keemun black tea stored for 1 year." *Foods* 11(5): 628, 2022. DOI: 10.3390/foods11050628. PMID: 35267262.
- **確認経路・確認度**：出版社（MDPI）ページの直接取得は 429 のため、出版社の検索結果表示で書誌・オッズ比・主要結果を確認。PMCID: PMC8871249。
- **主要な知見**：新茶 vs 1年貯蔵。祁門独特の floral/fresh/sweet は経年で減衰。指標化合物として 2-methylpropyl acetate と salicylic acid が熱データセットで OAV 増加を伴走（組成変化）。

### TC-8. Flaig et al. 2020 ― 西湖龍井のセンソミクス
- **書誌情報**：M. Flaig, S. Qi, G. Wei, X. Yang, P. Schieberle. "Characterization of the key aroma compounds in a longjing tea infusion using a sensomics approach." *European Food Research and Technology* 246(12): 2411–2425, 2020. DOI: 10.1007/s00217-020-03584-6. PMID: 32958917 相当の記録あり（要照合）。
- **確認経路・確認度**：PubMed 抄録で主要方法と結果の概要を確認。**Springer 本ページの直接確認は未実施**——被引用頻度は高いが、個別数値の転記には再確認が望ましい。
- **主要な知見**：西湖龍井の水抽出物を SAFE＋GC-O＋AEDA で分析（芳香活性55成分）、高活性12化合物。(+)-δ-cadinene の FD 1024、dimethyl sulfide FD 1024、3-methylnonane-2,4-dione FD 2048。(Z)-1,5-octadien-3-one の FD 32768 が最大。その他 geraniol、phenylacetaldehyde、methional、(E,E,Z)-2,4,6-nonatrienal、β-ionone、(Z)-jasmone、β-damascenone を同定。
- **適用範囲と限界**：試料は単一の西湖龍井であり品種・産年の一般化には限界。
- **何に使えるか**：龍井（緑茶）― 香気の寄与実証（AEDA＋再構成系）。

### TC-9. 文山包種 ― GC-O 級の研究は見つからず（陰性結果）
- GC-O/AEDA/寄与実証級の文山包種の香気分析は**見つからなかった**。
- 近接文献：Chen et al. 2023. "Classification of Wenshan Baozhong tea by SPME-GC-MS and chemometrics." *Foods* 12(21): 3975, 2023. DOI: 10.3390/foods12213975. SPME＋電子鼻＋ケモメトリクスによる等級判別であり、香気化合物の寄与同定ではない。

---

## 7. 時間変化（冷却・煎数・貯蔵）

### TM-1. Pramudya & Seo 2018 ― お茶の呈示温度による風味知覚の違い
- **書誌情報**：R. C. Pramudya, H.-S. Seo. "Using Check-All-That-Apply (CATA) Method for Determining Product Temperature-Dependent Sensory-Attribute Variations: A Case Study on Freshly Brewed Japanese Green Tea." *Frontiers in Psychology* 8: 2264, 2018（オンライン2018年1月）。DOI: 10.3389/fpsyg.2017.02264. PMID: 29375418. PMCID: PMC5776345.
- **確認経路・確認度**：PMC 全文で直接確認。
- **主要な知見**：日本緑茶を 5℃・25℃・65℃ で呈示し CATA＋ヘドニックで知覚を比較。高温では香り・緑感・甘味・うま味・渋味をより強く知覚。**「冷却の時系列測定」ではなく、3つの固定温度での呈示比較**である点に注意。同一茶液が時間とともに冷めていく過程を追った時系列実測は、探索範囲では見つからなかった（陰性結果として §8 にも記録）。
- **何に使えるか**：お茶 ― 温度による知覚の違い（温度依存）の出典。冷却プロファイルの代替にはならない。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC5776345/

### TM-2. Lee, Chambers & Chambers 2013 ― 緑茶の煎数による変化
- **書誌情報**：J. Lee, E. Chambers IV, D. H. Chambers, et al. "Sensory and Instrumental Analysis of Different Types of Green Teas Produced and Consumed in Korea." *Foods* 2(4): 554–571, 2013. DOI: 10.3390/foods2040554. PMCID: PMC5302280.
- **確認経路・確認度**：PMC 全文で直接確認。
- **主要な知見**：韓国産緑茶6種を最大5回浸出し、記述分析＋GC-MS。浸出回数とともに官能属性（green、astringent 等）は減少し、化学プロファイルも変化。試料は韓国産緑茶のみ。
- **適用範囲と限界**：紅茶の煎数研究は探索範囲で見つからなかった（陰性）。工夫茶式の多煎データは中国語文献側に残余の可能性（第2ラウンドで探索中）。
- **何に使えるか**：緑茶 ― 煎数（浸出回数）による香味の時間変化。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC5302280/

### TM-3. チョコレートの貯蔵変化
#### TM-3a. Nightingale, Lee & Engeseth 2011
- **書誌情報**：L. M. Nightingale, S.-Y. Lee, N. J. Engeseth. "Impact of Storage on Dark Chocolate: Texture and Polymorphic Changes." *Journal of Food Science* 76(1): C142–C153, 2011. DOI: 10.1111/j.1750-3841.2010.01970.x. PMID: 21535643.
- **確認経路・確認度**：PubMed で直接確認。
- **主要な知見**：ダークチョコレートの貯蔵中のテクスチャ変化と脂肪結晶（Form V→VI 移行）の関係。ブルームの機構研究。
- **何に使えるか**：ダークチョコレート ― 貯蔵による食感の時間変化（香味ではなく物性）。出典URL：https://pubmed.ncbi.nlm.nih.gov/21535643/

#### TM-3b. Hřivna et al. 2021
- **書誌情報**：L. Hřivna, et al. "The Quality Changes of Chocolate Candies with Filling（フィリング入りチョコレート菓子）during Storage." *Foods* 10(8): 1945, 2021. DOI: 10.3390/foods10081945. PMCID: PMC8441319.
- **確認経路・確認度**：PMC 全文で直接確認。
- **主要な知見**：フィリング入りバーの貯蔵中の品質変化（フィリングからの水分・脂肪移行を含む）。
- **適用範囲と限界**：**対象はフィリング入り製品**であり、ソリッドな板チョコレートへの転用は不可。
- **何に使えるか**：チョコレート（フィリング入り）― 貯蔵による品質変化。

#### TM-3c. Ali et al. 2001
- **書誌情報**：A. Ali, J. Selamat, Y. B. Che Man, A. Suria. "Effect of storage temperature on texture, polymorphic structure, and bloom formation in dark chocolate（フィリング入りダークを含む）." *Food Chemistry* 72(4): 491–497, 2001. DOI: 10.1016/S0308-8146(00)00271-0.
- **確認経路・確認度**：ScienceDirect 記録で確認。
- **主要な知見**：貯蔵温度とブルーム形成・結晶多形の関係。
- **何に使えるか**：ダークチョコレート ― 貯蔵温度とブルームの時間変化（物性）。

### TM-4. お茶の長期保存（緑茶・抹茶・岩茶）
#### TM-4a. Zhao et al. 2024 ― 緑茶の12か月貯蔵
- **書誌情報**：Zhao, et al. "Changes in Quality of Green Tea during 12 Months of Storage." *Beverages* 10(2): 35, 2024. DOI: 10.3390/beverages10020035.
- **確認経路・確認度**：MDPI ページで確認。
- **主要な知見**：緑茶の貯蔵中の品質指標の変化を12か月追跡。鮮度低下の指標として使える。
- **何に使えるか**：緑茶 ― 貯蔵による時間変化。

#### TM-4b. Kim et al. 2020 ― 抹茶の貯蔵
- **書誌情報**：Kim, et al. "Quality changes of matcha during storage（韓国産抹茶、2か月）." *Food Science and Biotechnology* 系, 2020. PMID: 32802565.
- **確認経路・確認度**：PubMed で確認。
- **主要な知見**：抹茶の貯蔵中の成分・色の変化を測定。**官能評価はなし**。試料は韓国産。
- **何に使えるか**：抹茶 ― 貯蔵による成分・色の時間変化（官能への転用不可）。出典URL：https://pubmed.ncbi.nlm.nih.gov/32802565/

#### TM-4c. Cui et al. 2024 ― 武夷岩茶の16週貯蔵
- **書誌情報**：Cui, et al. 武夷岩茶の16週間貯蔵における揮発成分の変化（2024）。書誌の細部（誌名・巻号・DOI）は**二次情報経由でのみ確認**しており、一次確認は未完。
- **何に使えるか**：岩茶 ― 貯蔵による香気の時間変化（登録判断には一次確認が必要）。

#### TM-4d. 祁門紅茶の1年貯蔵
- TC-7b（Tao et al. 2022）を参照。紅茶の貯蔵変化として利用可能。

---

## 8. 情報不足が解消できそうなアイテムのまとめ（第1ラウンド時点）

| アイテム | 現状 | 解消の根拠 | 見込み |
|---|---|---|---|
| ブロンドチョコレート | 情報不足 | CH-1（キャラメリゼホワイトの香気同定＋官能方向性、大学の機関研究者記録で確認） | 「一般的な知見」水準まで引き上げ可能。実製品の科学的データではない点の明記は必要 |
| カカオ分100%・無糖（新アイテム） | 未収録 | CH-4（官能＋好み）、CH-5（苦味成分の定量）、CH-6（含硫黄揮発＝検出のみ） | 新アイテムとして新設可能（実測・官能評価あり） |
| コートジボワール（産地） | 情報不足（none） | OR-1（5産地×栽培体系の官能＋揮発実測）ほか OR-2〜4 | 「実測・官能評価あり」への引き上げが可能。ただし OR-1 の結論は「地域差・体系差は小さい」側であり、強い産地個性を主張する根拠にはならない |
| 黄茶 | 薄い | YT-1/YT-2/YT-3（GC-O/OAV/sensomics）、YT-4（呈味の定量） | 香気・味覚ともに拡充可能。特に YT-3 は再構成・omission つき |
| 黒茶（熟プーアル・茯磚・六堡） | 薄い | DT-1（AEDA）、DT-2（GC-O＋閾値実測）、DT-5（茯磚 sensomics＋omission）、DT-4/DT-7（工程・OAV） | 熟プーアルと茯磚は寄与レベルまで到達可能。六堡は相関レベル |
| 白茶の時間変化 | 薄い | WT-2（1–16年の香気推移）、WT-4（白牡丹0–11年、rOAV で特徴香同定）、WT-1/WT-3（非揮発マーカー） | 貯蔵年数による香気・成分の変化を格上げ可能 |
| ほうじ茶 | 薄い | HJ-1（棒ほうじ茶 GC-O/AEDA）、HJ-2（焙煎条件） | 棒ほうじ茶は寄与レベルで拡充可能。葉ほうじ茶は HJ-4 の一次確認が前提 |
| 新規産地の候補 | 未収録 | ベトナム（OR-7/8 実測）、インドネシア（OR-10/11）、フィリピン（OR-12 電子鼻）、カメルーン（OR-13/14）、ブラジル（OR-15）、サントメ・ウガンダ（OR-5 の複合試料としてのみ） | エントリ新設の候補。サントメ・ウガンダは複合研究内の試料実績のみで単独の官能データはなし |
| 新規の個別茶の候補 | 未収録/薄い | 鉄観音・大紅袍・凍頂烏龍（TC-1）、大紅袍（TC-2 寄与実証）、凍頂（TC-5 寄与実証）、祁門（TC-7a/b）、龍井（TC-8） | 個別茶エントリの新設・拡充が可能 |

**解消できないもの（探索しても無かった領域）**：
- ダークミルクの専用研究（定義自体が流通上の帯域で、研究対象として成立していない。第2ラウンドで非英語・学位論文を再探索中）
- 玄米茶そのものの査読研究（第2ラウンドで国内文献を再探索中）
- 東方美人・文山包種の GC-O/AEDA 級の寄与実証研究
- ルビーチョコレート実製品の揮発成分分析、ホワイトチョコレート実製品（非キャラメリゼ）の香気分析
- タンザニア単独の官能・揮発・遺伝構成の査読研究
- 「淹れたお茶が冷める過程」の時系列実測（呈示温度の比較研究のみ存在）

## 9. 参考情報（科学データではないもの）

以下はメーカー・小売・商業メディア・公的プロジェクト由来の資料であり、実測・寄与の単独根拠には使えない（ユーザー方針：参考情報として格付けし、論文と食い違う場合は論文優先）。

- タンザニアの香味描写（「赤い果実・ラズベリー」等）：Domori、Raaka、Barry Callebaut（Bensdorp）等のメーカー・販売店資料由来。Kokoa Kamili の香味説明も事業者資料。
- コートジボワールの香味描写（「タバコ、レザー」等）：商業メディアの産地チャート由来。
- ブロンドチョコレート：Valrhona の Dulcey 公式製品説明（キャラメル・ビスケット様の描写はメーカー表現）。
- ホワイトチョコレートのキャラメル化品：Callebaut の Gold 製品ページ（メーカー資料）。Carletti 等の特許文献は学術データではない。
- 玄米茶：小売・メーカー記事、文部科学省 食品成分データベース（成分表）、伊藤園のプレスリリース（味覚センサーによるフードペアリング主張）。
- 抹茶の熟成：KAKENHI 研究課題 09680031「碾茶の熟成に伴う抹茶の味覚変化」（1997–1999、公的プロジェクト記録。成果論文の一次確認は別途必要）。

## 10. 未確認リードと再確認課題（第1ラウンド時点）

### 未確認リード（書誌・内容の確定前に使用しない）
1. Sunarharum et al. 2025（インドネシア単一産地、Canrea Journal）——機関記録レベル。
2. インドネシア7地域の官能研究（DOI: 10.3390/applbiosci5020043、著者・年次未確認）。
3. B.CEPPA 2019 のブレンド研究（ブラジル）——二次記録のみ。
4. Kumbár et al. 2021（ダークミルク近接の物性研究の可能性）——書誌未確定。
5. 高カカオ（90/99%）ダークのセンソミクス研究（Deuscher らとされる）——書誌未確定。
6. 龍井 Wang et al. 2020（*Food Research International* 130: 108908）——書誌のみ。
7. Kang et al. 2019（四大紅茶の比較、DOI: 10.1016/j.foodres.2019.03.009）——書誌のみ。
8. 青心烏龍の焙煎度別 GC-O 研究——書誌未確定。
9. 黒茶横断レビュー（*Molecules* 2026、DOI: 10.3390/molecules31152562）——書誌のみ。
10. 蒙頂黄芽の sensomics 研究（JoVE 経由のリード）。
11. Cui et al. 2024（岩茶16週貯蔵、TM-4c）——二次経由確認のみ。

### 再確認課題（一次確認の補完が必要なもの）
- OR-5（Marseglia 2020）：試料総数59 vs 58 の版間表記ゆれの解消、補足資料 S1 のタンザニア個別値の照合。
- OR-11（Putri 2025）：インドネシアの地域名明細。
- OR-13（Akoa 2023）：全著者リスト。
- OR-3（Koné 2021）：Wiley ページでの直接照合。
- YT-6（Xu 2026）：巻・記事番号と著者リストの完全性。
- DT-3（Li Q 2022）・DT-5（Li Y 2024）：出版社ページでの直接確認。
- DT-6（Li Q 2020）：アブストラクトの閲読。
- HJ-3（Gotti 2021）：DOI の確定。
- HJ-4（Mizukami 2008）：アブストラクトの直接確認（第2ラウンドで試行中）。
- TC-6(a)（Cho 2007）：アブストラクトの一次確認。
- TC-8（Flaig 2020）：Springer 本ページでの直接確認、PMID の照合。
- TC-5（Wang D 2023）：共著者リストの確定。

---

## 11. 第2ラウンド追加：非英語圏・試験場報告・学位論文

第1ラウンドの67件に重複する文献は再掲しない。第2ラウンドでは、現地研究機関の報告、学位論文、非英語誌を対象にしたため、査読論文と公的・学術グレー文献を明示して区別する。グレー文献は、一次資料であっても査読論文と同格の香味証拠としては扱わない。

### 11.1 カカオ：フランス語圏・現地試験場・アフリカ産地

#### R2-OR-1. CNRA 2025 ― コートジボワールの乾燥・保存技術資料
- **書誌情報**：Guiraud Boguinard Sahin Honorine Brigitte、Tahi Gnion Mathias、N'goran-Haddad Evelyne、Assi Attiapo Pepin、Coulibaly Klotioloma、N'guessan Kouamé François. *Bien sécher et conserver les fèves de cacaoyer pour une meilleure qualité du cacao marchand de niche*. CNRA、2025。発行は CNRA Abidjan の Direction de la Recherche et de l'Innovation – Service Publications et Informations Scientifiques。
- **確認経路・確認度**：CNRA 公式ドメインの PDF 原文で著者・所属・内容を確認。公的・学術グレー文献。
- **主要な知見**：発酵豆を高架乾燥台で6日間乾燥し、毎日20粒の cut test で亀裂と色を評価する等の公式プロトコルを示す。良質な商品カカオはよく亀裂が入り淡褐色であること、乾燥が物理化学的・生化学的・官能的品質を左右することが、現地機関の公式基準として確認できる。
- **適用範囲と限界**：普及用処方箋であり、香味の実測データではない。香気ノートや官能強度の根拠には使えない。
- **何に使えるか**：コートジボワール ― 生産条件（乾燥・保存・品質判定基準）。出典URL：https://cnra.ci/wp-content/uploads/2025/07/ftec_caco_bien_secher_et_conserver_feves_de_cacaoyer.pdf

#### R2-OR-2. N'Goran et al. 2026 ― コートジボワール Guémon 地域の豆品質
- **書誌情報**：N'Goran Haddad Patricia、Assi Attiapo Pépin、Guiraud Brigitte S.、Yapi Eric、Assemien Aimé Fabrice、Adiko Cho Evelyne、Deffan Prudence Diomandé、Tahi Gnion Mathias（出版社ページの表記。一部氏名の分かち書きに乱れがある点は未確認要素）. "Paramètres de qualité des fèves de cacao (*Theobroma cacao* L.) dans la région du Guemon (Duékoué) en Côte d'Ivoire." *Journal of Applied Biosciences* 217: 24122–24133, 2026. DOI: 10.35759/JABs.217.7. 所属は CNRA Station de Recherche de Divo。
- **確認経路・確認度**：出版社 Elewa の記事ページで書誌・仏英抄録・方法を確認。
- **主要な知見**：Duékoué の農家区画5件について形態・技術指標と、テオブロミン、カフェイン、繊維、タンパク質、総ポリフェノール、総フラボノイドを測定。DG4 でテオブロミンとカフェインが高く、DG2 でポリフェノールとフラボノイドが高かった。
- **適用範囲と限界**：官能・揮発成分は測定していない。香味ノートの根拠にはならず、5区画・単一地域の結果でもある。
- **何に使えるか**：コートジボワール西部 Guémon ― 苦味・渋味に関連する組成の地域内実測。出典URL：https://www.m.elewa.org/journals/article/parametres-de-qualite-des-feves-de-cacao-theobroma-cacao-l-dans-la-region-du-guemon-duekoue-en-cote-divoire/

#### R2-OR-3. Assi-Clair et al. 2024 ― ワイン酵母スターターと香気化合物
- **書誌情報**：Brice J. Assi-Clair、Mathurin K. Yao、Kra Brou D. Kédjébo、Tagro S. Guéhi. "Influence de souches sélectionnées de *Saccharomyces cerevisiae* inoculées et des conditions de fermentation sur la qualité aromatique du cacao marchand." *Journal of Applied Biosciences* 200, 2024. DOI: 10.35759/JABs.200.7. 頁範囲は未確認。
- **確認経路・確認度**：Elewa の巻目次で著者・題名・DOI を確認し、出版社抄録 PDF で内容を確認。
- **主要な知見**：ブドウ発酵由来の芳香性 *S. cerevisiae* 2株をコートジボワール産豆へ接種し、香気化合物36種・6化学族を検出。株によりエステル、アルデヒド、ケトン、アルコールの形成傾向が異なった。論文はコートジボワール産カカオが優れた香味品質を欠くという現地研究者の認識も明記する。
- **適用範囲と限界**：ワイン由来株の接種実験であり、農家自然発酵の一般像ではない。香気は検出レベルで、官能寄与の実証ではない。
- **何に使えるか**：コートジボワール ― 生産条件（スターター発酵による香気形成の可能性）。出典URL：https://www.m.elewa.org/Journals/jabs-volume-200-september-2024/

#### R2-OR-4. Konan et al. 2024 ― 発酵支持体が Mercedes 豆の物理化学品質へ与える影響
- **書誌情報**：Kouakou Ahossi Konan、Ibourahema Coulibaly、Anauma Casimir Koko、Kra Athanase Kouassi、Ibrahim Konate. "Impact of new fermentation supports on the physico-chemical quality of Mercedes cocoa beans (*Theobroma cacao* L.) grown at Soubré in the NAWA region." *Journal of Applied Biosciences* 200: 21125–21137, 2024. DOI: 10.35759/JABs.200.2.
- **確認経路・確認度**：Elewa の抄録 PDF で書誌・抄録を確認。関連する拡張版（*Journal of Food Quality* 2025、DOI: 10.1155/jfq/2118517）は出版社ページ未開示のため一部未確認として併記するに留める。
- **主要な知見**：Soubré の Mercedes をバナナ葉、ヤシ葉、カカオポッド、タープ、ポリプロピレン袋、ジュート袋で6日間発酵。ポッド内発酵は pH が高くカビ・発芽豆が多く不良で、ヤシ葉とジュート袋はバナナ葉に組成が類似し代替候補とされた。
- **適用範囲と限界**：単一生産者圃場の物理化学測定であり、官能評価はない。
- **何に使えるか**：コートジボワール（Soubré／Mercedes）― 生産条件（発酵支持体）。出典URL：https://www.m.elewa.org/journals/wp-content/uploads/2024/09/2.Konan-Abstract-Vol.200-1.pdf

#### R2-OR-5. Affou et al. 2025 ― CNRA 選抜6ハイブリッド家系の生化学・官能
- **書誌情報**：Laurie-Ange Affou ほか（共著者全員の完全リストは未確認）. "Biochemical and sensory characterizations of cocoa beans from six families of hybrids under selection in Côte d'Ivoire." *International Journal of Advanced Research* 13(12): 104–114, 2025. DOI: 10.21474/IJAR01/22332. 所属に CNRA Station de Recherche Technologique（Abidjan）と Station de Recherche de Divo を含む。
- **確認経路・確認度**：出版社系 PDF 全文で書誌・抄録・所属を確認。同誌は査読体制への評価が分かれるため、採用時にはその留保を付す。
- **主要な知見**：CNRA 種子圃場由来6家系（F3、F8、F15、F23、F26、F27）の pH、脂質、タンパク質、フェノール等とカカオマスの官能を測定。官能は概して中程度のカカオ強度、低酸味、中程度の苦味・渋味で、F8 は花様・果実様が比較的強く、F15／F23 はナッツ様・木様とされた。
- **適用範囲と限界**：Divo 試験場の選抜材料のみであり、「コートジボワール産一般」へ一般化できない。
- **何に使えるか**：コートジボワール ― 系統／家系レベルの官能。一次ソースは出版社 PDF のミラー経由で確認したため、統合前に公式記事ページで再確認する。

#### R2-OR-6. 著者未確認 2026 ― CNRA 育種材料48樹の技術・理化学・官能変異
- **書誌情報**：著者名は未確認. "Technological, physicochemical and sensory variability of beans of cacao trees (*Theobroma cacao* L.) of breeding program in Côte d'Ivoire." *African Journal of Biotechnology* 25(9): 156–168, 2026. DOI: 10.5897/AJB2026.17824. 所属は National Agronomic Research Center, Divo Research Station, Cocoa Program。
- **確認経路・確認度**：出版社 Academic Journals の全文 PDF で、著者名以外を確認。
- **主要な知見**：選抜中48樹について豆の技術指標、pH・滴定酸度、官能（カカオ香、酸味、苦味、渋味、果実様、花様、総合スコア）を評価し、全形質でクローン間差が高度に有意だった。
- **適用範囲と限界**：育種材料の変異研究であり、現行の商品豆や産地一般のプロファイルではない。著者名の確認と原表抽出が統合前に必要。
- **何に使えるか**：コートジボワール ― 系統レベルの官能変異。出典URL：https://academicjournals.org/journal/AJB/article-full-text-pdf/2528BB574971

#### R2-OR-7. Kouakou et al. 2024 ― コートジボワール3主要産地のチョコレート官能
- **書誌情報**：Kouakou Brou Julien、Kobenan Koffi Christophe、Ouattara Tièba Victor、N'goran Kouadio Emmanuel. "Evaluation of the organoleptic characteristics of chocolate made with cocoa beans from three main production areas in Côte d'Ivoire." *International Journal of Agricultural Research, Innovation and Technology* 14(2): 53–61, 2024. DOI として AGRIS／RePEc 記録の 10.22004/ag.econ.349420 を確認。
- **確認経路・確認度**：FAO AGRIS レコードで書誌・抄録を確認。
- **主要な知見**：東部・中西部・南西部の農家豆から作ったチョコレートを官能評価し、発酵日数も調査。平均発酵日数は東部5.30日、中西部5.0日、南西部5.04日で、いずれも推奨6日未満。苦味は低く、酸味・渋味は非常に低く、香りは中程度。発酵日数と有意に相関したのは苦味と香りだった。
- **適用範囲と限界**：地域固有の香味差を示す研究ではなく、共通する発酵不足の影響を強く含む。記述子は基本属性のみ。
- **何に使えるか**：コートジボワール ― 3大地域レベルの官能と生産条件。出典URL：https://agris.fao.org/search/en/providers/122436/records/67bc9f63e27dfa125189571f

#### R2-OR-8. Kouakou et al. 2018 ― コートジボワールの発酵技術実態
- **書誌情報**：Brou Julien Kouakou、Bi Zahouli Irie、Emmanuel Dick、Kouadio Emmanuel N'Goran、Brou Kouame. "Caractérisation des techniques de fermentation du cacao (*Theobroma cacao* L.) dans les principales zones de production en Côte d'Ivoire." *International Journal of Innovation and Applied Studies* 24(2): 728–735, 2018. 出版社記事ページでの直接照合は未実施。
- **確認経路・確認度**：目次記録と抄録で確認。
- **主要な知見**：バナナ葉使用が平均67.33%、黒色カバーが32.67%、発酵箱は使われていなかった。発酵は2–8日で、6日未満の割合は中西部72%、南西部64%、東部46%。攪拌は稀だった。
- **適用範囲と限界**：生産実態のアンケートであり、香味実測ではない。
- **何に使えるか**：コートジボワール ― 発酵管理の地域差と、R2-OR-7 の官能結果を解釈する生産背景。

#### R2-OR-9. Kibona 2011 ― タンザニア Kyela のカカオ・バリューチェーン
- **書誌情報**：K. J. Kibona. "Analysis of cocoa beans value chain: a case study of Kyela district in Mbeya region." Thesis, Sokoine University of Agriculture, 2011. Handle: 20.500.14820/6008。学位の種別・課程名はレコードで未確認。
- **確認経路・確認度**：Sokoine University of Agriculture の機関リポジトリ SUAIRÉ で題名・抄録・Thesis 区分を確認。
- **主要な知見**：Kyela の販売チャネルと粗利を比較し、発酵が農家の粗利へ有意に寄与することを示した。
- **適用範囲と限界**：香味・成分データは一切ない。
- **何に使えるか**：タンザニア／Kyela ― 発酵の経済的価値と生産体制の背景のみ。

#### R2-OR-10. 著者未確認 ― Kyela の集団的マーケティング学位論文
- **書誌情報**：著者名は未確認. "Determinants and effectiveness of collective action in Cocoa marketing among small scale producers in Kyela District, Tanzania." Master of Science in Agricultural and Applied Economics dissertation, Sokoine University of Agriculture。AGRIS 収録は2025年。
- **確認経路・確認度**：FAO AGRIS レコードの断片で確認。
- **主要な知見**：農家組織への参加要因と所得を扱い、課題として病害虫、価格不安定、市場条件が挙げられた。
- **適用範囲と限界**：品質・発酵・香味の実測はない。
- **何に使えるか**：タンザニア／Kyela ― 生産体制の背景のみ。

#### R2-OR-11. Aculey et al. 2010 ― ガーナ全域の発酵豆を分光・GC-MS で比較
- **書誌情報**：Patrick C. Aculey、Pia Snitkjaer、Margaret Owusu、Marc Bassompiere、Jemmy Takrama、Lars Nørgaard、Mikael A. Petersen、Dennis S. Nielsen. "Ghanaian cocoa bean fermentation characterized by spectroscopic and chromatographic methods and chemometrics." *Journal of Food Science* 75(6): S300–S307, 2010. DOI: 10.1111/j.1750-3841.2010.01710.x. Takrama は Cocoa Research Institute of Ghana（CRIG）所属。
- **確認経路・確認度**：CSIR 機関リポジトリ CSIRSpace で書誌・抄録を確認。
- **主要な知見**：ガーナ全栽培地域の発酵・乾燥豆を cut test、測色、蛍光／近赤外分光、GC-MS とケモメトリクスで分析。Volta 地域と Western 地域の豆が複数手法のスコアプロットで別クラスターを形成した。
- **適用範囲と限界**：官能評価ではないため、地域固有の香味ノートの直接根拠にはしない。
- **何に使えるか**：ガーナ ― 国内地域差と発酵度の組成・機器分析。出典URL：https://cspace.csirgh.com/items/show/559

#### R2-OR-12. Crafack et al. 2013 ― 芳香酵母スターターがガーナ産カカオの官能へ与える影響
- **書誌情報**：Michael Crafack、Morten B. Mikkelsen、Sofie Saerens、Morten Knudsen、Andreas Blennow、Samuel Lowor、Jemmy Takrama、Jan H. Swiegers、Gert B. Petersen、Hanne Heimdal、Dennis S. Nielsen. "Influencing cocoa flavour using *Pichia kluyveri* and *Kluyveromyces marxianus* in a defined mixed starter culture for cocoa fermentation." *International Journal of Food Microbiology* 167: 103–116, 2013. DOI は本確認では未取得。
- **確認経路・確認度**：ScienceDirect 出版社ページで抄録と CRIG／Ghana Cocoa Board の協力を確認し、書誌は PubMed 由来の引用記録で補完。
- **主要な知見**：CRIG で小規模トレイ発酵を行い、接種酵母が優占種にならなかったにもかかわらず、未コンチングチョコレートの官能プロファイルが自然発酵対照と異なった。
- **適用範囲と限界**：産地固有の香味ではなく、スターター発酵という生産条件の効果。接種株の生態学的定着も限定的だった。
- **何に使えるか**：ガーナ ― 生産条件（スターター発酵と官能）。出典URL：https://www.sciencedirect.com/science/article/pii/S0168160513003152

#### R2-OR-13. Afoakwa／Kongor 系 2012–2013 ― ガーナ産豆のパルプ前処理と発酵・乾燥
- **書誌情報**：
1. Afoakwa, Kongor, Takrama & Budu. "Changes in total polyphenols, o-diphenols and anthocyanin concentrations during fermentation of pulp preconditioned cocoa." *International Food Research Journal* 19(3): 1071–1077, 2012。
2. Afoakwa, Kongor, Takrama & Budu. "Changes in nib acidification and biochemical composition during fermentation of pulp preconditioned cocoa beans." *International Food Research Journal* 20(4): 1843–1853, 2013。
3. Kongor et al. "Changes in some biochemical qualities during drying of pulp pre-conditioned and fermented cocoa beans." *African Journal of Food, Agriculture, Nutrition and Development*（AJOL 収録）。
- **確認経路・確認度**：出版社 PDF／AJOL で抄録を確認。原料はいずれも CRIG（New Tafo-Akim）産 mixed hybrids。
- **主要な知見**：ポッド貯蔵0／3／7／10日と発酵0／3／6日を組み合わせ、ポリフェノール、アントシアニン、nib pH、脂肪酸度等を追跡。ポリフェノール減少はポッド貯蔵より発酵時間へ強く依存し、乾燥後 pH と遊離脂肪酸も前処理条件で変化した。
- **適用範囲と限界**：香味前駆体・酸度・脂肪酸度の実測であり、完成チョコレートの官能ではない。
- **何に使えるか**：ガーナ ― 生産条件（ポッド貯蔵、発酵、乾燥）と香味前駆体。

#### R2-OR-14. Hinneh et al. 2018 ― ポッド貯蔵とメイラード関連揮発成分（ガーナ）
- **書誌情報**：Michael Hinneh、Evangeline Semanhyia、Davy Van de Walle、Ann De Winne、Daylan A. Tzompa-Sosa、Gustavo L. Scalone、Bruno De Meulenaer、Kathy Messens、Jim Van Durme、Emmanuel O. Afoakwa、Luc De Cooman、Koen Dewettinck. "Assessing the influence of pod storage on sugar and free amino acid profiles and the implications on some Maillard reaction related flavor volatiles in Forastero cocoa beans." *Food Research International* 111: 607–620, 2018. DOI: 10.1016/j.foodres.2018.05.064.
- **確認経路・確認度**：ゲント大学学術書誌とガーナ大学リポジトリで確認。
- **主要な知見**：ガーナ産 Forastero のポッド貯蔵0／3／7日で、遊離アミノ酸と還元糖が変化し、同一条件で発酵・乾燥・焙煎した後の揮発成分生成は7日貯蔵が最多だった。
- **適用範囲と限界**：産地固有の香味を断定する研究ではなく、ポッド貯蔵という処理条件の効果である。
- **何に使えるか**：ガーナ ― 生産条件（ポッド貯蔵）から前駆体、焙煎揮発成分への連鎖。出典URL：https://biblio.ugent.be/publication/8573685

#### R2-OR-15. Haruna et al. 2024 ― 予備乾燥と発酵によるガーナ産豆の香味属性
- **書誌情報**：Lukeman Haruna、Ernest E. Abano、Ernest Teye、Isaac Tukwarlba、Wilson Yeboah、Kesse J. Agyei、Mary Lukeman. "Effects of Predrying and Spontaneous Fermentation Treatments on Nib Acidification, Fermentation Quality, and Flavour Attributes of Ghanaian Cocoa (*Theobroma cacao*) Beans." *International Journal of Food Science* 2024: 5198607, 2024. DOI: 10.1155/2024/5198607. PMID: 39145148. Agyei は CRIG 所属。
- **確認経路・確認度**：DOAJ レコードで書誌・抄録を確認。
- **主要な知見**：予備乾燥2–8時間と6日発酵で nib pH、酸度、cut test、官能の Global Quality が変化し、応答曲面法では予備乾燥6時間＋発酵6日が最適とされた。リカーの嗜好は予備乾燥4–6時間の条件で高かった。
- **適用範囲と限界**：ガーナ産固有の香味ではなく、前処理条件の効果である。
- **何に使えるか**：ガーナ ― 生産条件（予備乾燥）の官能を含む実測。出典URL：https://doaj.org/article/5d493dd38e23451c8642ab3340c74c4b

#### R2-OR-16. Caprioli et al. 2016 ― カメルーン5地域の組成・揮発プロファイル
- **書誌情報**：Giovanni Caprioli、Dennis Fiorini、Filippo Maggi、Marcello Nicoletti、Massimo Ricciutelli、Chiara Toniolo、Biapa Prosper、Sauro Vittori、Gianni Sagratini. "Nutritional composition, bioactive compounds and volatile profile of cocoa beans from different regions of Cameroon." *International Journal of Food Sciences and Nutrition* 67(4): 422–430, 2016. DOI: 10.3109/09637486.2016.1170769. PMID: 27055484.
- **確認経路・確認度**：PubMed で書誌・抄録を確認。カメルーン側所属は University of Dschang で、IRAD ではない。
- **主要な知見**：5地域の豆でポリフェノール、揮発成分、脂肪酸を比較し、地域ごとにテオブロミン、カフェ酸、エピカテキン、オレイン酸等の高値が異なった。
- **適用範囲と限界**：官能評価はなく、検出・組成レベルにとどまる。
- **何に使えるか**：カメルーン ― 国内地域レベルの組成・揮発実測。第1ラウンドの系統レベル研究を補う地域軸。出典URL：https://pubmed.ncbi.nlm.nih.gov/27055484/

#### R2-OR-17. Mvoto Meyong 2023–2024 ― beans spreading と発酵品質（カメルーン）
- **書誌情報**：Mvoto Meyong Jean Jacques. *Dynamique microbienne et qualité de la fève associées au beans spreading lors de la fermentation du cacao (Theobroma cacao L.)*. Mémoire de Master en Microbiologie, Université de Yaoundé I, 2023–2024。
- **確認経路・確認度**：DICAMES（カメルーン学術アーカイブ）の学位論文 PDF 原文で表紙・要旨・方法を確認。公的・学術グレー文献。
- **主要な知見**：Centre 地域2サイトで、発酵前の豆の広げ置き期間が微生物動態、cut test、発酵指数、総ポリフェノール、アントシアニン、フラボノイドへ与える影響を測定。良質豆は微生物量が高くポリフェノール／アントシアニンが低く、発酵不良豆は逆の傾向だった。
- **適用範囲と限界**：官能・揮発成分の測定はない。修士論文であり査読論文ではない。
- **何に使えるか**：カメルーン ― 生産条件（前処理と発酵日数）と品質指標。出典URL：https://dicames.online/jspui/bitstream/20.500.12177/13835/1/FS_MEM_BC_26_%200233.PDF

#### R2-OR-18. Vincent 1971 ― カメルーンの発酵処理とチョコレート官能
- **書誌情報**：J.-C. Vincent. "Influence de différents traitements technologiques sur la fermentation du cacao et sur la qualité du chocolat au Cameroun." *Proceedings, 3rd International Cocoa Research Conference, Accra (Ghana), 23–29 Nov 1969*, Cocoa Research Institute, Tafo, 1971, pp. 663–673.
- **確認経路・確認度**：IICA/CATIE 書誌カタログで確認。原典自体は未開示。
- **主要な知見**：発酵日数、攪拌頻度、鮮豆洗浄、ポッド殻／胎座混入を変え、物理化学とチョコレート官能を評価。カタログ抄録では7日発酵が最良で、攪拌条件が苦味、鋭い味、酸度へ影響した。
- **適用範囲と限界**：50年以上前の会議録であり、現在の品種・生産体制へは適用しない。歴史的原点としてのみ記録する。
- **何に使えるか**：カメルーン ― 発酵研究の歴史的背景。出典URL：https://opac.biblioteca.iica.int/cgi-bin/koha/opac-detail.pl?biblionumber=67224

#### R2-OR-19. Balogu & Onyeagba 2017 ― 微生物コンソーシア発酵とポリフェノール（ナイジェリア）
- **書誌情報**：Tochukwu Vincent Balogu、Azuonye R. Onyeagba. "Polyphenol and Microbial Profile of On-farm Cocoa Beans Fermented with Selected Microbial Consortia." 2017. 掲載誌名・巻頁は未確認。
- **確認経路・確認度**：FAO AGRIS レコードで題名・著者・抄録を確認。所属は Abia State University 系で、CRIN ではない。
- **主要な知見**：3種の微生物コンソーシアと3種の発酵容器を用いた7日間発酵で、微生物頻度とフェノール／タンニンが処理×容器で有意に変化した。
- **適用範囲と限界**：官能・揮発成分はなく、苦味・渋味の前駆側の組成実測にとどまる。
- **何に使えるか**：ナイジェリア ― 発酵条件とフェノール組成。出典URL：https://agris.fao.org/search/en/providers/122436/records/675ab5ea0ce2cede71ce4e06

#### R2-OR-20. Aroyeun, Ogunbayo & Olaiya 2006 ― ポッド包装貯蔵と商品品質（ナイジェリア CRIN）
- **書誌情報**：S. O. Aroyeun、J. O. Ogunbayo、A. O. Olaiya. "Effect of modified packaging and storage time of cocoa pods on the commercial quality of cocoa beans." *British Food Journal* 108(2): 141–151, 2006. DOI: 10.1108/00070700610644951. 著者は Cocoa Research Institute of Nigeria（CRIN）所属で、試料は CRIN 試験場のポッド。
- **確認経路・確認度**：書誌と DOI は論文の citation で確認。抄録詳細は二次転載経由の要素を含む。
- **主要な知見**：ポッドの包装と貯蔵期間により、ココアバター脂肪、豆重、腐敗・カビの程度が変化し、透明フィルム包装が商品品質を最も保持した。
- **適用範囲と限界**：商品品質の研究であり、香味の実測ではない。
- **何に使えるか**：ナイジェリア／CRIN ― 生産条件（ポッド貯蔵）と商品品質。DOI：10.1108/00070700610644951

#### R2-OR-21. Rahaingosambatra 2014 ― マダガスカル Sambirano の栽培方式と製品品質
- **書誌情報**：Dina Harisoa Rahaingosambatra. *Étude des dispositifs de cultures de cacaoyers dans le Sambirano par l'évaluation de leur potentiel de productivité et l'appréciation de la qualité des produits*. Mémoire de Diplôme d'Études Approfondies, Université d'Antananarivo, 2014. CIRAD Qualireg と FOFIFA の共同研究枠組み。
- **確認経路・確認度**：大学機関リポジトリの学位論文 PDF で表紙・目次・研究枠組みを確認。ポリフェノール、テオブロミン／カフェイン等の数値抽出は未実施。
- **主要な知見**：Sambirano の栽培装置、生産性、製品品質を評価する学位論文で、発酵中のポリフェノールやメチルキサンチンを扱う章を含む。
- **適用範囲と限界**：現時点では「品質実測が学位論文レベルで存在する」ことの確認に留まる。香味データとして使うには原表の再読が必要。
- **何に使えるか**：マダガスカル／Sambirano ― 品質実測の存在確認と、後工程での原表抽出候補。出典URL：https://biblio.univ-antananarivo.mg/theses/these/15925/pdf/rahaingosambatraDinaH_SN_M2_14.pdf

#### R2-OR-22. Rakotomalala et al. 年次未確認 ― Sambirano 発酵の現地適応
- **書誌情報**：Jean-Jacques Rakotomalala、Fabrice Davrieux、Sophie Assemat、Noro Lantosoa Raherinandrasana、Ivan Staub、Frédéric Descroix. *Adaptation du processus de fermentation aux contraintes locales: application au cacao du Sambirano de Madagascar*. Qualireg 発表資料。年次は資料内で未確認であり、ファイル名からの推定は採用しない。
- **確認経路・確認度**：Qualireg（CIRAD）公式サイトの発表 PDF で著者・内容を確認。公的・学術グレー文献。
- **主要な知見**：大規模農園は木箱カスケードで6日発酵する一方、北部 Sambirano の小農では小ロットのため無発酵・発酵不良が多い。小容量発酵装置を比較し、化学組成で評価した。マダガスカル産発酵豆のアンモニア平均は約300 ppm、本試験平均は260 ppmとされた。
- **適用範囲と限界**：発表資料であり査読論文ではない。産地固有の香味ノートの根拠にはならない。
- **何に使えるか**：マダガスカル ― 生産条件（発酵規模と発酵不良）への一次的裏付け。「Sambirano は常に高品質発酵」という単純化への反証材料。出典URL：https://www.qualireg.org/en/content/download/16362/224629/version/1/file/Qualireg+Davrieux+2016+Nirs_cacao.pdf

#### R2-OR-23. FOFIFA 2018 ― マダガスカル産カカオ品質と発酵期間
- **書誌情報**：Rakotoarisoa Jacqueline（FOFIFA 科学ディレクター）. *La Recherche: quelles actions, quelles recommandations pour la préservation de la qualité cacao fin de Madagascar…* Séminaire international « Pour une filière cacao durable à Madagascar »、Antananarivo、2018年1月30日–2月1日。
- **確認経路・確認度**：CIRAD のセミナー資料で確認。公的・学術グレー文献。
- **主要な知見**：2014/15年の実態調査では品質は主に発酵期間へ依存し、standard 品質は3日発酵で生産され、6日発酵の品質が価格で十分に報われないため推奨法が守られにくい、という制度的背景が示された。
- **適用範囲と限界**：機関セミナー資料であり、豆の香味実測ではない。
- **何に使えるか**：マダガスカル ― 生産条件（発酵期間と価格制度）。出典URL：http://www.cirad.mg/cacao-madagascar/docs/presentations/Introduction/A5VFpresentationJacqueline_Ateliercacao.pdf

#### 第2ラウンド産地ラインの陰性結果と補強
- **タンザニアは依然として最薄**：SUA の学位論文は Kyela の流通・経営系が中心で、発酵は経済効果の記述に留まる。TARI の香味・発酵・品質に関する研究成果報告は確認できなかった。Kilombero／Kokoa Kamili の「赤い果実」等の香味は事業者・販売店・メディアの参考情報であり、科学データに基づく香味プロファイルは付けられない。
- **マダガスカルも査読された豆レベルの官能研究は見つからなかった**。ただし FOFIFA／CIRAD／大学のグレー文献により、品質が発酵期間と小農のロット規模に強く左右される実態は一次資料で確認できた。香味ではなく生産条件として記録するのが適切である。
- *Cahiers Agricultures*、*Fruits*、*Oléagineux* 系では、コートジボワール産カカオの香味・発酵実験論文は見つからなかった。フランス語の実測は JABs 等の地域誌と CNRA 資料に集中している。
- Akoa et al. 2024（第1ラウンド OR-14）については、著者所属とチョコレート製造場所から IRAD Yaoundé の試験場研究であることを追加確認した。これは新規文献ではなく、既存レコードの位置づけ補強である。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC11486886/
- 第2ラウンド産地ラインの未確認リードは、Koné 2017 博士論文、Luhwago 2016 学士プロジェクト、CRIN ハイブリッドのチョコレート官能2022の3件であり、§12 で一括管理する。

---

### 11.2 チョコレート追加調査と中南米産地（学位論文・非英語圏を含む）

第2ラウンドで新規に確認した独立した文献・資料は16件（査読論文・会議論文9件、学位論文・技術報告7件）である。既存調査に収載済みの Tuenter 2021、Šeremet 2019、Stewart 2017、Samfaß 2021 は、訂正・位置づけのために再掲するが新規件数には含めない。Godočiková の学位論文と Fricke の学位論文は、それぞれ対応する論文と同一系統の背景資料であり、独立した実測として二重計上しない。

#### R2-CH-1. Tuenter et al. 2021 ― ルビーの植物化学組成
- **書誌情報**：Emmy Tuenter、Maria E. Sakavitsi、Andrés Rivera-Mondragón、Nina Hermans、Kenn Foubert、Maria Halabalaki、Luc Pieters. "Ruby chocolate: A study of its phytochemical composition and quantitative comparison with dark, milk and white chocolate." *Food Chemistry* 343: 128446, 2021. DOI: 10.1016/j.foodchem.2020.128446. PMID: 33160766.
- **確認経路・確認度**：PubMed で書誌・抄録を直接確認。一部の二次引用にある記事番号「128464」は誤記であり、正しくは **128446**。
- **主要な知見**：ルビー、ダーク、ミルク、ホワイトを UPLC-HRMS と定量で比較し、ルビーでは A型プロアントシアニジンが特徴的だった。フラバン-3-オール等の水準はダークより低かった。
- **適用範囲と限界**：**本論文はアントシアニンそのものを定量していない**。したがって「ルビーの色はアントシアニン量の実測で説明された」と引用してはならない。色保持の機構情報は CH-10（未発酵カカオ粉末）の範囲に留まる。
- **何に使えるか**：ルビーチョコレート ― 成分（A型プロアントシアニジンとフラバノールの相対位置）。出典URL：https://pubmed.ncbi.nlm.nih.gov/33160766/

#### R2-CH-2. Šeremet et al. 2019 ― ルビーの官能・生物活性
- **書誌情報**：Danijela Šeremet、Ana Mandura、Aleksandra Vojvodić Cebin、Marina Oskomić、Elodie Champion、Arijana Martinić、Draženka Komes. "Ruby chocolate – Bioactive potential and sensory quality characteristics compared with dark, milk and white chocolate." *Food in Health and Disease* 8(2): 89–96, 2019. Hrčak ID: 230158. DOI は未確認。
- **確認経路・確認度**：クロアチア公式ポータル Hrčak で書誌・抄録・所属を確認。
- **主要な知見**：ルビー、ダーク、ミルク、セミスイート、ホワイト等を比較し、ルビーは酸味強度が最高で主特徴とされた。総フェノールはミルクとホワイトの間で、抗酸化能はミルクより高かった。
- **適用範囲と限界**：試料メーカーの明細は抄録範囲で未確認。揮発成分分析はない。
- **何に使えるか**：ルビーチョコレート ― 味覚（酸味の官能実測）と成分の相対位置。出典URL：https://hrcak.srce.hr/en/230158

#### R2-CH-3. Ostrowska-Ligęza et al. 2023 ― ルビーの熱物性と酸化安定性
- **書誌情報**：Ewa Ostrowska-Ligęza、Karolina Dolatowska-Żebrowska、Rita Brzezińska、Magdalena Wirkowska-Wojdyła、Joanna Bryś、Iga Piasecka、Agata Górska. "Characterization of Thermal Properties of Ruby Chocolate Using DSC, PDSC and TGA Methods." *Applied Sciences* 13: 5221, 2023. DOI: 10.3390/app13095221.
- **確認経路・確認度**：MDPI 出版社ページ／PDFで確認。
- **主要な知見**：ルビー単独について脂肪酸組成、DSC 融解・多形、PDSC 酸化誘導時間、TGA を測定。融解挙動はダークよりミルクに近かった。
- **適用範囲と限界**：**色の安定性研究ではない**。色素の経時変化、退色速度、pH・光・保存による色定量は測定されていない。
- **何に使えるか**：ルビーチョコレート ― 食感・口どけ・酸化安定性の物性のみ。出典URL：https://www.mdpi.com/2076-3417/13/9/5221

#### R2-CH-4. Ostojin et al. 2025 ― ダーク・ミルク・ルビーの抗酸化と酸化安定性
- **書誌情報**：Vanja Ostojin、Danica Zarić、Maja Bulatović、Aleksandra Pavlović、Jelena Mrmošanin、Milica Stožinić、Marica Rakin. "The antioxidative potential and oxidation stability of dark, milk and ruby chocolate." *3rd International Symposium on Biotechnology*, University of Kragujevac, 2025. DOI: 10.46793/SBT30.50VO.
- **確認経路・確認度**：セルビア政府研究ポータル eNauka と University of Kragujevac の DOI サーバで確認。査読ジャーナル論文ではなく会議論文。
- **主要な知見**：同一メーカー Premier の試料で、DPPH 活性はダーク70%＞ルビー47%＞ミルク33%の順だった。
- **適用範囲と限界**：CH-9（Zarić et al. 2024）と同一メーカー・同一試料系統であり、独立した裏付けとして二重に数えない。
- **何に使えるか**：ルビーチョコレート ― 成分・酸化の参考値のみ。出典URL：https://doi.ub.kg.ac.rs/doi/zbornici/10-467932-sbt30-50vo/?pismo=lat

#### R2-CH-5. 著者未確認 2025 ― ルビープラリネ保存中の亀裂とブルーム
- **書誌情報**：著者名は未確認. "Pralinele din ciocolata Ruby – efectele de fisurare și de brumare / Ruby chocolate pralines – cracking and fat bloom effects." *12th International Scientific-Practical Conference*, UPSC, Moldova, 2025, pp. 415–422. DOI: 10.46727/c.v1.01-02-03-2025.p415-422.
- **確認経路・確認度**：UPSC 機関リポジトリ PDF のルーマニア語・英語抄録で確認。
- **主要な知見**：液体フルーツ充填と脂肪系充填のルビープラリネを保存し、脂肪移行、ブルーム、殻の亀裂を観察。充填種が構造・外観安定性を左右した。
- **適用範囲と限界**：製品形態レベルの保存知見であり、色素退色の定量ではない。
- **何に使えるか**：ルビーチョコレート ― 時間変化（保存・ブルーム、プラリネ形態のみ）。出典URL：https://dir.upsc.md/handle/123456789/7654/Conf-UPSC-01-02-03-2025-V1-p415-422.pdf

#### R2-CH-6. Godočiková et al. 2019 ― 実製品ホワイトを含む揮発プロファイル
- **書誌情報**：Lucia Godočiková et al. "Biological activity, antioxidant capacity and volatile profile of enriched Slovak chocolates." *Journal of Food and Nutrition Research* 58(3): 283–293, 2019. 共著者完全リストと DOI は未確認。
- **確認経路・確認度**：掲載誌 PDF で書誌・方法・ホワイト試料データを確認し、後続論文の引用でも再確認。掲載誌 PDF への到達経路は ResearchGate であり、統合前に出版社・誌公式記録で再照合する。
- **主要な知見**：スロバキア製チョコレート群を GC-MS で測定し、全試料で揮発成分124種・11化学族を同定。無添加ホワイト試料ではフェネチルアルコール含量が全試料中最高（124.98 mg/kg）で、アルコール類がホワイトの揮発成分の22.0%を占めた。酢酸はホワイト試料でのみ検出されなかった。
- **適用範囲と限界**：**GC-O／AEDA／OAV はなく、検出レベルのみ**。寄与成分の証明ではない。単一国・少数製品の結果を一般化しない。
- **何に使えるか**：ホワイトチョコレート ― 実製品の香気成分（検出）。第1ラウンドの「実製品の香気分析は見つからなかった」は、本件により「検出レベルの GC-MS は存在する」へ更新される。出典URL：https://www.researchgate.net/publication/335789846_Biological_activity_antioxidant_capacity_and_volatile_profile_of_enriched_Slovak_chocolates
- **関連学位論文**：Lucia Godočiková. "Bioactive components as functional food ingredients: characterization and microbiological evaluation of chocolates." Dissertation thesis, Slovak University of Agriculture in Nitra。大学公式記録で題名・著者・要旨を確認したが、発行年・ページ数は未確認であり、本論文と同一系統のため独立実測として数えない。

#### R2-CH-7. Stewart et al. 2017 ― モデルホワイトの GC-MS／GC-O
- **書誌情報**：Ashleigh Stewart、Alistair S. Grandison、Angela Ryan、Daniel Festring、Lisa Methven、Jane K. Parker. "Impact of the Skim Milk Powder Manufacturing Process on the Flavor of Model White Chocolate." *Journal of Agricultural and Food Chemistry* 65(6): 1186–1195, 2017. DOI: 10.1021/acs.jafc.6b04489. PMID: 28064480.
- **確認経路・確認度**：PubMed で直接確認。
- **主要な知見**：低／高加熱の脱脂粉乳からモデルホワイトチョコレートを調製し、官能、GC-MS、GC-O を実施。高加熱粉乳のモデル品はキャラメル／ファッジ感が有意に強く、メイラード由来揮発の増加と対応した。
- **適用範囲と限界**：実製品ではなくモデル系。ホワイトで寄与レベル（GC-O）に達する研究は、現時点では本件が上限である。
- **何に使えるか**：ホワイトチョコレート ― 粉乳加熱条件と香味（モデル系の寄与根拠）。出典URL：https://pubmed.ncbi.nlm.nih.gov/28064480/

#### R2-CH-8. Fricke & Schieberle 2020／Fricke 2017 ― 市販ミルクチョコレートの sensomics
- **書誌情報**：Kristina Fricke、Peter Schieberle. "Characterization of the Key Aroma Compounds in a Commercial Milk Chocolate by Application of the Sensomics Approach." *Journal of Agricultural and Food Chemistry* 68(43): 12086–12095, 2020. DOI: 10.1021/acs.jafc.0c05787. PMID: 33063998.
- **確認経路・確認度**：PubMed で論文を直接確認。関連学位論文 Kristina Fricke, *Differences in the key flavor compounds of crumb-type milk chocolate and continental milk chocolate with special emphasis on drivers of creaminess*（Verlag Dr. Hut, 2017, ISBN 9783843933681）は ISBN／DNB 経由記録で確認し、大学リポジトリでの直接照合は未実施。
- **主要な知見**：市販ミルクチョコレートで AEDA により香気活性48種、安定同位体希釈法で40種を定量し、39種の再構成で全体香を再現。メチオナール等の含硫黄化合物に加え、methanethiol と一連のラクトンがミルキー／クリーミーなノートの候補とされた。学位論文ではクラム製法でメイラード生成物が高く、クリーミーさと関連づけた。
- **適用範囲と限界**：対象は通常のミルクチョコレートであり、ダークミルク帯域でもホワイトでもない。ホワイトへの転用は乳由来香気の隣接知見にとどめ、実測根拠にしない。Schieberle 系によるホワイト自体の sensomics／学位論文は見つからなかった。
- **何に使えるか**：ミルクチョコレート ― 香気の寄与実証。ダークミルクの代替根拠にはしない。出典URL：https://pubmed.ncbi.nlm.nih.gov/33063998/

#### ダークミルクとブロンドの第2ラウンド陰性結果
- **ダークミルク**：ドイツ語用語、学位論文データベース、業界寄り会議まで広げても、「dark milk／高カカオ分ミルク」を定義して官能プロファイルを与えた査読研究・学位論文は確認できなかった。Samfaß et al. 2021（*Foods* 10(7): 1483, DOI: 10.3390/foods10071483）はカカオ固形分28–50%のミルクチョコレート6試料を含み、長鎖δ-ラクトンのクリーミーさへの寄与を示すが、50%試料単独のプロファイルはなく、ダークミルク専用研究ではない。
- **ブロンド**：英語・ドイツ語・フランス語・トルコ語と学位論文まで再探索しても、CH-1（Aydın et al. 2021）以外の直接研究は見つからなかった。2025年のメイラード反応生成物定量研究は JoVE Visualize 経由のリードに留まり、掲載誌・著者・DOI が未確認で、ブロンド専用でもないため §12 に分離する。
- **ルビー**：色の安定性を直接扱う査読研究とアントシアニン定量は見つからなかった。揮発成分の専用研究も、Godočiková 学位論文要旨にルビー試料を含む可能性が示されるだけで、ルビー単独の揮発内訳は未確認であり、寄与研究とは言えない。

#### R2-OR-24. Oliveira 2022 ― 南バイーア産ニブの揮発成分
- **書誌情報**：Fernanda Antonia de Souza Oliveira. "Determinação de compostos voláteis presentes nos nibs de cacau oriundos do sul da Bahia: foco na produção de chocolates finos e selo de denominação de origem." Dissertação (Mestrado em Ciência de Alimentos), Universidade Federal da Bahia, 2022. 氏名表記は審査記録側で揺れがあり、同一人物性の最終照合は未確認。
- **確認経路・確認度**：UFBA 食品科学プログラム公式ページの学位論文 PDF と UFBA SIGAA の審査記録で確認。公的・学術グレー文献。
- **主要な知見**：南バイーア各自治体の焙煎ニブを収穫時期別に採取し、GC-MS で揮発画分を測定する原産地呼称向け研究。具体的な化合物別数値は本確認範囲では未抽出。
- **適用範囲と限界**：ニブ段階の検出研究であり、完成チョコレートの官能・寄与評価は未確認。
- **何に使えるか**：ブラジル／バイーア ― 産地・収穫時期とニブ揮発成分（検出）。出典URL：http://pgalimentos.far.ufba.br/sites/pgalimentos.far.ufba.br/files/fernanda_antonia_de_souza_oliveira.pdf

#### R2-OR-25. Moreira 2017 ― CEPEC 系クローンの発酵揮発成分とチョコレート官能
- **書誌情報**：Igor Magalhães da Veiga Moreira. "Analytical study of cocoa beans and characterization of chocolates of different cocoa hybrids during the spontaneous and inoculated fermentation processes." Universidade Federal de Lavras, 2017。
- **確認経路・確認度**：CAPES 公式ポータル eduCAPES の UFLA リポジトリメタデータで著者・抄録を確認。公的・学術グレー文献。
- **主要な知見**：南バイーア栽培の4クローン（CEPEC2004、PH15、PS1319、SJ02）の自然発酵中の揮発成分とタンパク質、製造チョコレートの官能を測定し、揮発成分80種を同定。CEPEC2004 のチョコレートが最も受容され、PS1319 は望ましくない酸が多く低受容と相関した。
- **適用範囲と限界**：検出と官能相関であり、OAV 等による寄与実証ではない。学位論文である点も明示する。
- **何に使えるか**：ブラジル／バイーア ― クローンレベルの揮発成分（検出）＋官能。第1ラウンド OR-15 とは別系統の CEPEC 系実測。出典URL：https://educapes.capes.gov.br/handle/capes/1152734?mode=full

#### R2-OR-26. Lima 2019 ― バイーア発酵のメタゲノミクス
- **書誌情報**：Carolina Oliveira de Cerqueira Lima. "Estudo da diversidade microbiana estrutural e funcional do processo fermentativo das amêndoas de cacau para a produção de chocolate." Tese (Doutorado em Biotecnologia), Universidade Estadual de Feira de Santana, 2019。
- **確認経路・確認度**：CAPES Sucupira 公式記録で確認。公的・学術グレー文献。
- **主要な知見**：バイーア州 Uruçuca の Forastero とハイブリッド混合の自然発酵を、ショットガンメタゲノミクスと理化学で時空間追跡した。
- **適用範囲と限界**：香味化合物の直接測定ではないため、香味根拠には使わない。
- **何に使えるか**：ブラジル／バイーア ― 発酵微生物叢の背景。出典URL：https://sucupira-legado.capes.gov.br/sucupira/public/consultas/coleta/trabalhoConclusao/viewTrabalhoConclusao.jsf?popup=true&id_trabalho=7839460

#### R2-OR-27. Colonges et al. 2021 ― Nacional の花香に関与する生合成経路
- **書誌情報**：Kelly Colonges et al. "Two Main Biosynthesis Pathways Involved in the Synthesis of the Floral Aroma of the Nacional Cocoa Variety." *Frontiers in Plant Science* 12: 681979, 2021. DOI: 10.3389/fpls.2021.681979. PMCID: PMC8498224. 著者リストの完全性は PMC ページ範囲で一部未確認。
- **確認経路・確認度**：PMC で確認。
- **主要な知見**：現代 Nacional 集団152遺伝子型について GWAS、未焙煎／焙煎豆の生化学化合物、複数回の官能評価を統合。花香にはモノテルペン生合成経路と L-フェニルアラニン分解経路が関与し、関連化合物として 2-phenylacetaldehyde、2-phenylethyl acetate、2-phenylethanol、acetophenone、linalool 等が挙げられた。
- **適用範囲と限界**：関連研究であり、個別化合物の OAV／再構成による寄与実証ではない。「Nacional の花香＝linalool 単独」という単純化は避ける。
- **何に使えるか**：エクアドル／Nacional ― 花様香気の化合物（検出）＋官能＋遺伝の統合根拠。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC8498224/

#### R2-OR-28. Solórzano et al. 2015 ― エクアドル国内の Nacional 官能比較
- **書誌情報**：Eddyn Solórzano Chavez、Claire Nicklin、Freddy Amores Puyutaxi、Juan Jiménez Barragan、S. Barzola Miranda. "Comparación sensorial del cacao (Theobroma cacao L.) Nacional fino de aroma cultivado en diferentes zonas del Ecuador." *Ciencia y Tecnología* 8(1): 37–47, 2015. DOI は誌公式ページでは 10.18779/cyt.v8i1.142、別記録では末尾が異なるため不一致を未確認事項として残す。
- **確認経路・確認度**：誌公式ページで書誌・抄録を確認。INIAP Pichilingue 試験場の品質ラボによる研究。
- **主要な知見**：11生産者協会のリカーを経験パネル5名で評価し、協会間で統計的に有意だったのは「カカオ味」のみだった。
- **適用範囲と限界**：小規模パネルで、地域差が大きいという結論は支持しない。
- **何に使えるか**：エクアドル／Nacional ― 国内産地間の官能差は小さいという実測。過度な産地差別化への反証材料。出典URL：https://revistas.uteq.edu.ec/index.php/cyt/article/view/142

#### R2-OR-29. Jiménez, Amores & Solórzano 2014 ― INIAP 技術報告 Boletín Técnico 164
- **書誌情報**：Juan Jiménez、Fredy Amores、Eddyn Solórzano. "Componentes de identidad para reconocer las diferencias del cacao que se produce en varias regiones del Ecuador." INIAP, Estación Experimental Tropical Pichilingue, Boletín Técnico 164, 2014。
- **確認経路・確認度**：INIAP 公式リポジトリの全文 PDF で確認。査読論文ではない技術報告。
- **主要な知見**：7県11協会について物理指標、リカーとバーの官能、脂肪、総ポリフェノール、テオブロミン／カフェイン比を測定し、地域間プロファイルを提示した。
- **適用範囲と限界**：技術報告として格付けし、査読論文と同格に扱わない。同系列 Boletín Técnico 140（2011）は存在を確認したが詳細数値は未精読。
- **何に使えるか**：エクアドル ― 産地アイデンティティの一次資料。出典URL：https://repositorio.iniap.gob.ec/server/api/core/bitstreams/778767a1-183a-4afc-a9eb-b8eda603e1d5/content

#### R2-OR-30. Morillo, Buitron & Quiroz-Vera 2023 ― Nacional の linalool 合成遺伝子発現
- **書誌情報**：Eduardo Morillo、Johana Buitron、James Quiroz-Vera. "Evaluación de la expresión genética de Linalool en genotipos de cacao nacional altamente homocigóticos proveniente de las principales zonas…" *Revista Bionatura* 8(2): 20, 2023. DOI: 10.21931/RB/2023.08.02.20. 完全題名は未確認。
- **確認経路・確認度**：誌 PDF で著者・所属・DOI を確認。著者は INIAP 所属。
- **主要な知見**：百年 Nacional コレクション7系統と対照系統で LIS 遺伝子発現を qPCR で比較し、系統間差を確認した。
- **適用範囲と限界**：linalool 濃度そのものの新規定量ではない。
- **何に使えるか**：エクアドル／Nacional ― 花香の遺伝的背景。出典URL：https://revistabionatura.com/files/2023.08.02.20.pdf

#### R2-OR-31. Cruz Barrera 2020 ― Nacional クローンの香気関連遺伝子発現
- **書誌情報**：Thalia Alexandra Cruz Barrera. "Evaluación de la expresión de un gen asociado a la calidad aromática en clones comerciales de cacao nacional mediante PCR cuantitativa." Tesis de pregrado, Universidad de las Américas, Quito, 2020。
- **確認経路・確認度**：UDLA 公式リポジトリで書誌・抄録を確認。公的・学術グレー文献。
- **主要な知見**：EET19、EET96、EET103、CCN51 の LIS 発現を比較し、Nacional 系が CCN51 より高発現で、花香が強い EET103 が最高、花香が軽い EET19 が最低となり、官能評と整合した。
- **適用範囲と限界**：遺伝子発現と官能の対応であり、化合物の寄与実証ではない。
- **何に使えるか**：エクアドル／Nacional ― 系統レベルの花香背景。出典URL：https://dspace.udla.edu.ec/jspui/handle/33000/12711?mode=simple

#### R2-OR-32. López Martínez 2020 ― ニカラグアのカカオ品質マッピング
- **書誌情報**：Regina L. López Martínez. "Mapeo de la calidad del cacao en las diferentes regiones agroecológicas de Nicaragua." Tesis (Mag. Sc.), CATIE, Turrialba, Costa Rica, 2020. 73 pages. URI: https://repositorio.catie.ac.cr/handle/11554/9821
- **確認経路・確認度**：CATIE 公式リポジトリのメタデータと IICA/CATIE OPAC で書誌・抄録を確認。リポジトリ直接取得が 403 のため、本文数値は未確認。
- **主要な知見**：ニカラグア9地域28地点36試料の発酵乾燥豆について物理・化学・官能と栽培・精製管理・気候を多変量解析し、官能属性が最良だったのは Caribe Sur、Triángulo Minero、Río San Juan とされた。
- **適用範囲と限界**：学位論文であり、豆段階の評価であってチョコレート製品の官能ではない。
- **何に使えるか**：ニカラグア ― 地域レベルの官能マッピング。出典URL：https://repositorio.catie.ac.cr/handle/11554/9821

#### R2-OR-33. Trognitz et al. 2013 ― ニカラグア Waslala の遺伝子型×官能・呈味成分
- **書誌情報**：Bodo Trognitz、Emile Cros、Sophie Assemat、Fabrice Davrieux、Nelly Forestier-Chiron、Eusebio Ayestas、Aldo Kuant、Xavier Scheldeman、Michael Hermann. "Diversity of Cacao Trees in Waslala, Nicaragua: Associations between Genotype Spectra, Product Quality and Yield Potential." *PLoS ONE* 8(1): e54079, 2013. DOI: 10.1371/journal.pone.0054079. PMCID: PMC3548827.
- **確認経路・確認度**：PLOS 出版社ページ／PMC で確認。
- **主要な知見**：Waslala の小農園100樹を2収穫期に標準発酵し、官能と NIRS による呈味関連7化合物を評価。遺伝子型群間にメチルキサンチン、テオブロミン／カフェイン比、総脂肪、プロシアニジンB5、エピカテキン、官能の総合点・渋味・ドライフルーツ香の有意差があった。
- **適用範囲と限界**：単一自治体・遺伝子型群レベルの結果であり、「ニカラグア産一般」ではない。呈味成分は NIRS 推定で、揮発分析ではない。
- **何に使えるか**：ニカラグア ― 官能＋呈味成分の査読実測。出典URL：https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0054079

#### R2-OR-34. Rojas Rojas 2020 ― CATIE 遺伝グループの制御発酵と生化学変化
- **書誌情報**：Katherine Vanessa Rojas Rojas. "Transformaciones bioquímicas asociadas a la calidad de algunos grupos genéticos de cacao (Theobroma cacao L.) mediante un proceso de fermentación controlada." Trabajo final de graduación, Universidad Nacional, Heredia, Costa Rica, 2020。
- **確認経路・確認度**：Universidad Nacional 公式リポジトリ全文で題名・著者・要旨・試験地を確認。試験地は CATIE Turrialba のクローン園。公的・学術グレー文献。
- **主要な知見**：発酵でメチルキサンチンとエピカテキンが拡散・酸化により減少し、エピカテキン平均含量が CATIE 遺伝グループ間の識別成分、カフェインが商業カカオ側の識別成分となった。
- **適用範囲と限界**：官能・揮発成分の実測ではなく、香味前駆体・呈味成分の発酵変化にとどまる。
- **何に使えるか**：コスタリカ／CATIE クローン ― 発酵による呈味成分の変化。出典URL：https://repositorio.una.ac.cr/server/api/core/bitstreams/1b32d9fd-d95f-4b48-b48f-68b3296afe96/content

#### 第2ラウンド中南米ラインの陰性結果
- CEPEC／CEPLAC 直属機関が発行した香味学位論文そのものは特定できなかった。追加できたのは CEPEC 系クローンを対象とする UFLA 学位論文と、原産地呼称を目的とする UFBA 学位論文である。
- UESC の学位論文では発酵酵母の分離・分子タイピング等はあったが、香味測定を主対象とするものは見つからなかった。
- CATIE 学位論文で香味を直接扱う中核は R2-OR-32 であり、コスタリカ産そのものの官能・揮発の査読実測は見つからなかった。
- IICA 1949 年の学位論文（コスタリカ大西洋側の品質要因）は歴史的グレー文献のリードとして §12 に分離し、現代の香味データには使わない。
- INIAP リポジトリの linalool 含量実測とされる記録は著者・年次が未確認のため §12 に分離する。

---

### 11.3 お茶・チョコレートの時間変化と試験場報告（第2ラウンド）

第2ラウンドで新規に一次確認した候補は24件である。Qiu et al. の正式誌面版と Pramudya の学位論文は既存研究の書誌確定・原典確認であり、新規の独立証拠として数えない。同一茶液が冷める過程を連続測定した飲用時の時系列研究は、英語・中国語・日本語・学位論文まで広げても見つからなかった。

#### R2-TM-1. Chen et al. 2024 ― 急冷と自然冷却で緑茶飲料の品質がどう変わるか
- **書誌情報**：Yuan-Ke Chen、Tuzz-Ying Song、Chi-Yu Chang、Shiann-Cherng Sheu、Chih-Wei Chen. "Analyzing the Effects of Rapid and Natural Cooling Techniques on the Quality of Hand-Shaken Green Tea Beverages." *Foods* 13(15): 2322, 2024. DOI: 10.3390/foods13152322. PMID: 39123516. 試料は台湾の台茶12号（金萱）。
- **確認経路・確認度**：MDPI 出版社ページと PMC で確認。
- **主要な知見**：95℃で浸出後、急冷（18℃まで25分）と自然冷却（30℃まで4–5時間）を比較。急冷は色が鮮やかで清澄、味・香りが refreshing／invigorating と評価された。自然冷却はカテキン、カフェイン、総ポリフェノール、可溶性固形分、還元糖、タンニン、必須アミノ酸の保持が高かった。
- **適用範囲と限界**：冷却過程の時系列ではなく、終点2条件の比較。大量調製の手搖飲料条件であり、通常の淹茶条件ではない。成分は検出・定量レベル。
- **何に使えるか**：緑茶 ― 時間変化（冷却速度と香味・成分保持のトレードオフ）。出典URL：https://www.mdpi.com/2304-8158/13/15/2322

#### R2-TM-2. Qiu et al. 2025 ― 中国高級緑茶の熱嗅・温嗅・冷嗅
- **書誌情報**：Tong Qiu、Wentao Ji、Lei Zhao、Junxian Li、Ziqi Zhang、Shuo Wang、Xiaoyi Zhao、Qi An、Ying Zhang、Qing Jiang、Xiaoting Zhai、Qianying Dai. "Dynamics of aroma profiling and emotional response for premium green tea." *npj Science of Food*, 2025. DOI: 10.1038/s41538-025-00670-x. PMID: 41419502. PMCID: PMC12827470.
- **確認経路・確認度**：PMC 全文と PubMed で確認。第1ラウンドで Qiu 2025 として扱った研究の正式な書誌確定であり、新規件数には含めない。
- **主要な知見**：黄山毛峰、太平猴魁、六安瓜片、信陽毛尖について、国家標準の熱嗅（約75℃）、温嗅（約45℃）、冷嗅（室温近傍）の3段階で TDS／TDE を測定。優位属性とその遷移は茶ごとに異なり、温度低下で "fresh" が増す茶と減る茶があった。
- **適用範囲と限界**：嗅覚フェーズのみで飲用時の口中知覚ではない。温度は離散3段階で、連続冷却曲線ではない。
- **何に使えるか**：緑茶 ― 香味の時間変化（冷却軸）への最も近い直接根拠。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC12827470/

#### R2-TM-3. Pramudya 2018 ― 呈示温度研究の修士論文原典
- **書誌情報**：Ragita Cantika Pramudya. "Influences of Intrinsic and Extrinsic Hand-feel Touch Cues on Sensory Perception and Emotional Responses toward Beverage Products." Master of Science (Food Science) Thesis, University of Arkansas, 2018. Graduate Theses and Dissertations 2945.
- **確認経路・確認度**：University of Arkansas ScholarWorks で学位種別まで確認。
- **主要な知見**：コーヒーと緑茶について製品温度等の内在的手がかりとカップスリーブ等の外在的手がかりが、感情・官能へ与える影響を検討した。
- **適用範囲と限界**：TM-1（Pramudya & Seo 2018 論文版）と同一データ系統であり、独立した裏付けとして二重計上しない。離散温度の呈示比較であって冷却時系列ではない。
- **何に使えるか**：緑茶 ― 呈示温度と感情・官能の原典記録。出典URL：https://scholarworks.uark.edu/etd/2945/

#### R2-TM-4. Zheng et al. 2026 ― 熟プーアル2年〜40年超の香気陳化（GC-O）
- **書誌情報**：Xuexue Zheng、Hengbin Yao、Shaohong Zheng、Huimin An、Jinwen Gao、Peng Yin、He Xie、Yang Liu、Jing Zhang、Yajie Xue、Lianqing Wang、Jinhua Chen、Jianan Huang、Zhonghua Liu. "Mechanistic insights into aroma aging of ripened Pu-erh tea during long-term storage." *Food Chemistry* 520: 149873, 2026. DOI: 10.1016/j.foodchem.2026.149873. PMID: 42225041.
- **確認経路・確認度**：PubMed で書誌・抄録を確認。
- **主要な知見**：熟プーアル23試料（2年〜40年超）を QDA、電子鼻、HS-SPME／GC×GC-QTOFMS、GC-O で分析。若い茶の果実様・甘い・堆味から、古い茶の薬草様・木様・陳香様へ移行し、約15–20年に統合段階の可能性が示された。GC-O で19種の主要寄与香気成分を同定した。
- **適用範囲と限界**：異なる年代の横断試料であり、同一ロットの縦断追跡ではない。微生物メチル化経路は相関証拠に基づく仮説として提示された。
- **何に使えるか**：熟プーアル茶 ― 香味・成分・時間変化（陳化）の直接根拠として最優先候補。出典URL：https://pubmed.ncbi.nlm.nih.gov/42225041/

#### R2-TM-5. Li et al. 2025 ― 熟プーアル0／5／10／15年の品質と微生物叢
- **書誌情報**：Liuyu Li、Yiqiao Zhao、Yilong Li、Lisha Ran、Jinhua Chen、Kunbo Wang、Zhonghua Liu、Shi Li、Jianan Huang、Mingzhi Zhu. "Effects of storage time on the quality and microbial community of ripe Pu-erh tea." *Food Chemistry X* 33: 103389, 2025. DOI: 10.1016/j.fochx.2025.103389. PMID: 41532080.
- **確認経路・確認度**：PubMed で確認。
- **主要な知見**：貯蔵でカテキンとカフェインが減少し、アルデヒド・アルコールが減り炭化水素が増えた。1,2,3-trimethoxybenzene と (+)-cedrol が長期貯蔵茶の木様香気の主要寄与成分と同定された。優勢菌属は Aspergillus と Bacillus。
- **適用範囲と限界**：電子官能を用いており、ヒト官能ではない。横断試料である。
- **何に使えるか**：熟プーアル茶 ― 味覚関連成分と香味の時間変化。出典URL：https://pubmed.ncbi.nlm.nih.gov/41532080/

#### R2-TM-6. 杨洪焱 et al. 2025 ― 熟プーアル4産地×3／8／13年
- **書誌情報**：杨洪焱、何雨淇、牛淼、李雄宇、徐亚文、张方坤、李家华. 「不同产地不同贮藏时间普洱熟茶香气成分分析」『食品工业科技』46(5): 218–229, 2025. DOI: 10.13386/j.issn1002-0306.2024030016.
- **確認経路・確認度**：出版社（食品工業科技）公式ページで書誌・抄録を確認。
- **主要な知見**：雲南4産地×貯蔵3・8・13年の12試料を HS-SPME-GC-MS、官能、OAV で比較。1,2,3-trimethoxybenzene と 1,2,4-trimethoxybenzene は全産地で貯蔵延長とともに増加した。一方、アルコール類と花果香の動向は産地により逆転した。
- **適用範囲と限界**：OAV は寄与推定であり再構成・omission ではない。産地と年数が交絡する設計である。
- **何に使えるか**：熟プーアル茶 ― 陳化の共通軸と産地差の双方。出典URL：https://www.spgykj.com/article/doi/10.13386/j.issn1002-0306.2024030016?viewType=citedby-info

#### R2-TM-7. Ma et al. 2025 ― 生プーアルの陳香形成（再構成あり）
- **書誌情報**：Bingsong Ma、Cunqiang Ma、Binxing Zhou、Shujing Liu、Jing Zhuang、Zhihui Feng、Junfeng Yin、Xinghui Li. "Revealing the formation of aged aroma in raw Pu-erh tea during the storage through comprehensive two-dimensional gas chromatography coupled to time-of-flight mass spectrometry and molecular docking." *Current Research in Food Science*, 2025. PMID: 40213028. PMCID: PMC11984597. 巻号・記事番号は未確認。
- **確認経路・確認度**：PMC 全文で試料設計まで確認。
- **主要な知見**：生プーアル18試料（新茶、陳化中、陳年。昆明倉と広州倉）を QDA と HS-SPME／GC×GC-TOFMS で分析し、香気再構成も実施。新鮮・花・果実様から木様を主とする陳香へ移行し、再構成により陳香の主要 VOC 18種を確認した。
- **適用範囲と限界**：年代区分は横断的分類。分子ドッキングは官能寄与そのものではない。
- **何に使えるか**：生プーアル茶 ― 香味・成分・時間変化（陳化と倉儲差）。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC11984597/

#### R2-TM-8. Xu et al. 2025 ― 生プーアル1–10年と転換点3年・8年
- **書誌情報**：Jiayi Xu、Xiujuan Deng、Yamin Wu、Miao Zhou、Cen Du、Qiaomei Wang、Yuxin Xia、Junjie He、Wenxia Yuan、Wendou Wu、Hongxu Li、Yankun Wang、Tong Li、Baijuan Wang. "Characteristic Changes and Potential Markers of Flavour in Raw Pu-Erh Tea with Different Ageing Cycles Analysed by HPLC, HS-SPME-GC-MS, and OAV." *Foods* 14(5): 829, 2025. DOI: 10.3390/foods14050829. PMID: 40077531.
- **確認経路・確認度**：PubMed で確認。
- **主要な知見**：同一原料産地・同一製造者・同一貯蔵場所の生プーアル1–10年を比較。非揮発・揮発の双方で3つの陳化周期に分類され、転換点は3年目と8年目だった。色は緑から橙・褐へ、香りは淡い香りから木様・陳香へ変化し、渋味が減って甘味・醇厚さが増した。
- **適用範囲と限界**：OAV レベルの寄与推定で再構成はない。単一貯蔵地の結果である。
- **何に使えるか**：生プーアル茶 ― 味覚と香味の年数系列。出典URL：https://pubmed.ncbi.nlm.nih.gov/40077531/

#### R2-TM-9. 著者未確認 2026 ― 生プーアル1–22年の品質進化
- **書誌情報**：著者名は未確認. "Quality Evolution of Pu-Erh Raw Tea over 1–22 Years of Aging." *Foods* 15(19): 3448, 2026.
- **確認経路・確認度**：MDPI 出版社ページの抄録で確認。著者リストを一次ページから抽出できなかった。
- **主要な知見**：同一産地（易武）・一貫した貯蔵条件の1–22年試料で、官能は新鮮・強く渋い状態から、まろやかで陳香を持つ状態へ変化した。呈味成分は約14年で安定に近づく一方、香りはその後も再編成され続ける非同期進化が示された。
- **適用範囲と限界**：著者未確認のため、統合前に再確認が必須。
- **何に使えるか**：生プーアル茶 ― 最長系列の段階モデル。出典URL：https://www.mdpi.com/2304-8158/15/19/3448

#### R2-TM-10. Chen et al. 2013 ― 陳年鉄観音における焙煎と貯蔵の分離
- **書誌情報**：Ying-Jie Chen、Ping-Chung Kuo、Mei-Lin Yang、Feng-Yin Li、Jason T. C. Tzen. "Effects of baking and aging on the changes of phenolic and volatile compounds in the preparation of old Tieguanyin oolong teas." *Food Research International* 53: 732–743, 2013. DOI: 10.1016/j.foodres.2012.07.007（DOI は二次引用記録で照合し、出版社ページでの直接確認は未実施）。
- **確認経路・確認度**：論文全文 PDF で抄録・書誌を確認。
- **主要な知見**：新鮮な鉄観音を焙煎後5・10・20年貯蔵した系列を比較。フェノール類は主に焙煎で変化し、その後の陳化では比較的安定だった。一方、新鮮茶に豊富な直鎖・分岐炭化水素は長期貯蔵でほぼ消失し、置換ベンズアルデヒド類とピロール誘導体が焙煎＋陳化後に生成した。
- **適用範囲と限界**：長時間の人工的焙煎を含む実験系で、官能評価はない。生成化合物の老烏龍風味への関与は著者らの示唆であり寄与実証ではない。
- **何に使えるか**：鉄観音／陳年烏龍 ― 焙煎で変わる成分と陳化で変わる成分の分離。

#### R2-TM-11. Kuo et al. 2011 ― 老烏龍の揮発成分と定期乾燥
- **書誌情報**：Ping-Chung Kuo、Yan-Yu Lai、Ying-Jie Chen、Wei-Hung Yang、Jason T. C. Tzen. "Changes in volatile compounds upon aging and drying in oolong tea production." *Journal of the Science of Food and Agriculture* 91(2): 293–301, 2011. DOI: 10.1002/jsfa.4184.
- **確認経路・確認度**：成功大学機関リポジトリで書誌・抄録を確認。
- **主要な知見**：新鮮烏龍と長期貯蔵＋定期乾燥で作る老烏龍を比較。老烏龍に共通する含窒素化合物として N-ethylsuccinimide、2-acetylpyrrole、2-formylpyrrole、3-pyridinol が一貫して検出された。10年以上乾燥なしで貯蔵した茶等は共通パターンと異なった。
- **適用範囲と限界**：GC-MS 検出に基づく生成推定であり、GC-O 等の寄与実証はない。
- **何に使えるか**：烏龍茶（老茶）― 香味・成分・時間変化と、定期乾燥という管理条件。出典URL：https://researchoutput.ncku.edu.tw/en/publications/changes-in-volatile-compounds-upon-aging-and-drying-in-oolong-tea/

#### R2-TM-12. Hong et al. 2021 ― 水仙烏龍1／3／7／14／25年の非揮発変化
- **書誌情報**：Cuiyun Hong、Wenjie Yue、Qingyu Shen、Wenhua Wang、Hongyan Meng、Ying Guo、Wenjiang Xu、Yaling Guo. "Widely Targeted Metabolomics Analysis Reveals Great Changes in Nonvolatile Metabolites of Oolong Teas during Long-Term Storage." *Molecules* 26(23): 7278, 2021. DOI: 10.3390/molecules26237278. PMCID: PMC8658923.
- **確認経路・確認度**：PMC／MDPI で確認。
- **主要な知見**：品種「水仙」の貯蔵1・3・7・14・25年を広域標的メタボロミクスで比較。非ガロイル型カテキン、タンニン類、フラボノール類、アミノ酸等が減少し、脂肪酸・有機酸が増加した。ガロイル型カテキン、没食子酸、カフェインは概ね安定だった。
- **適用範囲と限界**：メタノール抽出物の分析であり、浸出液の官能測定ではない。「約7年が優れた味をもたらす期間」という解釈は成分パターンに基づく著者らの示唆である。
- **何に使えるか**：烏龍茶（水仙／岩茶系）― 成分・味覚背景・時間変化。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC8658923/

#### R2-TM-13. Zhang et al. 2023 ― 紅茶（英紅九号）の貯蔵年数別香気
- **書誌情報**：Suwan Zhang、Lingli Sun、Shuai Wen、Ruohong Chen、Shili Sun、Xingfei Lai、Qiuhua Li、Zhenbiao Zhang、Zhaoxiang Lai、Zhigang Li、Qian Li、Zhongzheng Chen、Junxi Cao. "Analysis of aroma quality changes of large-leaf black tea in different storage years based on HS-SPME and GC–MS." 2023. PMCID: PMC10739856. PMID: 38144858. 掲載誌名は未確認。
- **確認経路・確認度**：PMC 全文で試料設計まで確認。著者所属に広東省農業科学院茶葉研究所を含む。
- **主要な知見**：英紅九号の新茶と2・4・6年貯蔵茶を、同一茶園・同一季節・同一製法・同一倉庫条件で比較。貯蔵で花・果実様の36成分が有意に減り、スパイシー・酸・木様の18成分が増えた。新茶の甘い花香は linalool、貯蔵茶の花香は β-ionone が主に担うとされ、isovaleric acid と hexanoic acid が貯蔵茶の酸臭の主因とされた。
- **適用範囲と限界**：単一品種・単一倉庫。rOAV に基づく寄与推定であり再構成はない。
- **何に使えるか**：紅茶 ― 香味の長期貯蔵変化。出典URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC10739856/

#### R2-TM-14. 原・久保田 1979 ― 新茶の香気と保全
- **書誌情報**：原利男、久保田悦郎（農林水産省茶業試験場）. 「新茶の香気特性とその保全について」『日本食品工業学会誌』26(9): 391–395, 1979. DOI: 10.3136/nskkk1962.26.9_391.
- **確認経路・確認度**：J-STAGE で書誌・抄録を確認。
- **主要な知見**：一番茶期の上級煎茶について貯蔵中の香気成分変化を GC、GC-MS、官能検査で追跡。新茶に多く貯蔵中に減少する成分と、貯蔵中に生成するオフフレーバー候補を同定し、香気保全には −70℃の超低温貯蔵が著効とした。
- **適用範囲と限界**：1979年の分析水準であり、同定・寄与は推定レベル。貯蔵条件の詳細は抄録範囲で未確認。
- **何に使えるか**：煎茶／新茶 ― 香味・成分の貯蔵劣化に関する日本語一次原典。出典URL：https://www.jstage.jst.go.jp/article/nskkk1962/26/9/26_9_391/_article/-char/ja/

#### R2-TM-15. 原・久保田 1982 ― 緑茶貯蔵中の香気成分変化
- **書誌情報**：原利男、久保田悦郎. 「緑茶貯蔵中の香気成分の変化」『日本農芸化学会誌』56(8): 625–630, 1982. DOI: 10.1271/nogeikagaku1924.56.625.
- **確認経路・確認度**：J-STAGE で書誌・抄録を確認。
- **主要な知見**：各種緑茶を25℃で貯蔵し、1-penten-3-ol、cis-2-penten-1-ol、2,4-heptadienal 類が生成した。番茶・下級煎茶で生成量が非常に多く、中・上級煎茶でも同成分群が他より多く生成し、においの性質から貯蔵臭の原因物質と推定された。
- **適用範囲と限界**：寄与はにおいの性質からの推定であり GC-O 実証ではない。1982年の定量水準である。
- **何に使えるか**：緑茶（煎茶・番茶）― 貯蔵臭の成分根拠と等級差。出典URL：https://www.jstage.jst.go.jp/article/nogeikagaku1924/56/8/56_8_625/_article/-char/ja/

#### R2-TM-16. Horita 1987 ― 緑茶保存中のオフフレーバー総説
- **書誌情報**：Hiroshi Horita (Department of Tea Processing Technology, National Research Institute of Vegetables, Ornamental Plants and Tea). "Off-flavor Components of Green Tea during Preservation." *JARQ (Japan Agricultural Research Quarterly)* 21(3): 192–197, 1987.
- **確認経路・確認度**：JIRCAS 公式サイトの JARQ 全文 PDF で確認。原著論文ではなく国立試験研究機関の英文総説。
- **主要な知見**：脂肪酸の酸化分解物が貯蔵で増え、低温では増加が小さい。窒素置換防湿包装では4か月後も香味・水分とも変化がなく、通常袋では2か月で変質臭が生じた。光照射で増える bovolide 自体は sunlight flavor のにおいを持たず、指標成分と官能寄与を区別する例も示された。
- **適用範囲と限界**：総説であり新規データではない。数値は原研究の引用として扱う。
- **何に使えるか**：緑茶 ― 貯蔵劣化を英語で読める機関総説。R2-TM-14／15 の橋渡し資料。出典URL：https://www.jircas.go.jp/sites/default/files/publication/jarq/21-3-192-197_0.pdf

#### R2-TM-17. 水上・山口 2013 ― 保存条件が煎茶品質へ及ぼす影響
- **書誌情報**：水上裕造、山口優一（農研機構 野菜茶業研究所）. 「保存条件が煎茶の品質に及ぼす影響」『茶業研究報告』116: 23–32, 2013. 機関誌の「資料」に相当する試験場報告。
- **確認経路・確認度**：農研機構 AgriKnowledge の全文 PDF で試験設計・結果表まで確認。
- **主要な知見**：‘やぶきた’煎茶を包装資材、ガス置換、温度を変えて保存し、半年・1年・1年半後に官能と成分を測定。ガスバリア性が低く温度が高いほどアスコルビン酸が低下し品質が落ちた。カテキン、カフェイン、アミノ酸は比較的安定で、劣化は主に香気・色・外観側で先行した。
- **適用範囲と限界**：著者ら自身が、保存条件を揃えた結果であり流通現場へ直ちに普遍化できないと明記。単一年度・単一品種。
- **何に使えるか**：煎茶 ― 貯蔵で「何が劣化し、何が比較的安定か」の切り分け。出典URL：https://agriknowledge.affrc.go.jp/RN/2030870625.pdf

#### R2-TM-18. 服部 2006 ― 緑茶香気分析と保存知見の整理
- **書誌情報**：服部祥治. 「新規評価方法OASISを活用した緑茶香気分析に関する研究」『北海道大学大学院農学研究科邦文紀要』28(1): 85–120, 2006.
- **確認経路・確認度**：北海道大学 HUSCAP の全文 PDF で確認。学位論文としての収録は確認できなかったため、学位論文とは格付けしない。
- **主要な知見**：新茶では (Z)-3-hexenyl hexanoate が多く、長期貯蔵で 1-penten-3-ol、(Z)-2-penten-1-ol、(E,E)-2,4-heptadienal 等が増加するという既往知見を整理し、R2-TM-14／15 と方向が一致した。
- **適用範囲と限界**：保存部分は二次整理を含むため、単独の実測根拠にはせず R2-TM-14／15／17 と併用する。
- **何に使えるか**：緑茶 ― 貯蔵変化の日本語研究系譜の補強。出典URL：https://eprints.lib.hokudai.ac.jp/repo/huscap/all/8282/28(1)_2.pdf

#### R2-TM-19. 山口・宮崎 2018 ― 釜炒り茶・玉緑茶・煎茶の1〜3煎目
- **書誌情報**：山口幸蔵、宮崎秀雄（佐賀県茶業試験場）. 「味覚センサーによる釜炒り茶、蒸製玉緑茶および煎茶のうま味・渋味の解析」『茶業研究報告』125: 45–52, 2018. 機関誌の「資料」に相当する県茶業試験場報告。
- **確認経路・確認度**：J-STAGE 全文 PDF で方法・結果表まで確認。
- **主要な知見**：同一原料生葉から作り分けた釜炒り茶、蒸製玉緑茶、煎茶の1〜3煎目を比較。いずれも旨味・渋味は1煎目が最も高く2・3煎目で低下し、低下度は渋味より旨味の方が大きかった。釜炒り茶は煎茶より渋味推定値が有意に低く、浸出液カテキン濃度の低さと対応した。
- **適用範囲と限界**：味覚センサー推定値でありヒト官能ではない。煎茶の3煎目は測定数制限で味覚センサー測定から除外された。
- **何に使えるか**：煎茶・釜炒り茶・玉緑茶 ― 呈味と煎数変化。出典URL：https://www.jstage.jst.go.jp/article/cha/2018/125/2018_45/_pdf

#### R2-TM-20. 著者・年次未確認 ― スリランカ低地茶の淹出条件
- **書誌情報**：著者名・年・学位種別は未確認. "Effect of Brewing Parameters on Tea Tasting to Improve the Liquor Characters of Low Grown Tea in Sri Lanka." Uva Wellassa University eRepo 収録。
- **確認経路・確認度**：大学公式リポジトリの抄録で確認。**Tea Research Institute of Sri Lanka 本体の報告書ではない**。
- **主要な知見**：低地茶3グレードを温度75／85／95℃、時間2／3／5分で淹出し、経験あるテイスター7名が評価。95℃が色・香味・強さの抽出に有効で、85℃未満は不十分とされた。最適時間はグレードで異なった。
- **適用範囲と限界**：著者・年次が未確認のままでは正式な出典表記ができない。格付けの弱さを明示し、再確認後にのみ使う。
- **何に使えるか**：紅茶（セイロン低地茶）― 淹出条件と香味の補強候補。出典URL：https://erepo.lib.uwu.ac.lk/items/f589b439-13f2-4e51-9bd6-682aee3be90d/full

#### R2-TM-21. 坂本ら 2002 ― 煎茶1・2・3煎液の溶出特性
- **書誌情報**：坂本彬、中川致之、杉山弘成、堀江秀樹. 「煎茶の1煎,2煎,3煎液の成分組成に基づく溶出特性」『茶業研究報告』94: 45–55, 2002. 英題："The Compositions of the Respective Infusions of Sencha Brewed Three Times."
- **確認経路・確認度**：CiNii Research の書誌・抄録で確認。
- **主要な知見**：アミノ酸は溶出しやすく3煎目までにほぼ100%溶出した一方、エステル型カテキンは遅く、90℃でも3煎目で50%台にとどまった。著者らは、1煎液の濃厚な甘味・旨味には高濃度のアミノ酸とペクチンが、3煎液の強い苦味にはエステル型カテキン濃度の高さが寄与すると推察した。
- **適用範囲と限界**：成分溶出の実測であり、味への寄与は著者らの推察で、官能との対応付けは間接的である。
- **何に使えるか**：煎茶 ― 味覚・成分・時間変化（煎数）の日本語での直接根拠。出典URL：https://cir.nii.ac.jp/crid/1390001204276370304

#### R2-TM-22. 山澤ら 2021 ― 緑茶の種類と煎出回数
- **書誌情報**：山澤和子、堀野恵美、三輪紗瑛、水谷友香、山河真里奈. 「緑茶葉の種類や煎出回数の違いが煎出液成分および呈味嗜好性におよぼす影響」『日本調理科学会大会研究発表要旨集』32: 106, 2021. DOI: 10.11402/ajscs.32.0_106.
- **確認経路・確認度**：J-STAGE で書誌・抄録を確認。査読論文ではなく学会発表要旨。
- **主要な知見**：煎茶葉4種を3煎まで比較し、2煎目の成分動向は茶葉により正反対になり得た。2煎目は嗜好度が多くの項目で高く、著者らは成分の絶対量より苦渋味成分と旨味成分の比率が嗜好を左右すると推察した。
- **適用範囲と限界**：要旨集であり方法・統計の詳細と被験者数は抄録範囲で未確認。
- **何に使えるか**：緑茶（煎茶）― 煎数と呈味嗜好。出典URL：https://www.jstage.jst.go.jp/article/ajscs/32/0/32_106/_article/-char/ja/

#### R2-TM-23. Machálková et al. 2015 ― 貯蔵温度とブルーム（官能付き）
- **書誌情報**：Lenka Machálková、Luděk Hřivna、Šárka Nedomová、Miroslav Jůzl. "The effect of storage temperature on the quality and formation of blooming defects in chocolate confectionery." *Potravinarstvo* 9(1): 39–47, 2015. DOI: 10.5219/425.
- **確認経路・確認度**：出版社ページで書誌・抄録を確認。
- **主要な知見**：チョコレート製品7種を6／12／20／30℃で18週間貯蔵し、官能、色差、硬度、ブルームを追跡。官能は6℃・12℃がほとんどの記述子で最良で、20℃でファットブルームによる目に見える差が出始め、30℃は全製品で極めて不適だった。
- **適用範囲と限界**：フィリング等を含む菓子製品であり、ビーントゥバーの板チョコレート一般へ直接適用できない。TM-3b とは研究系統が近く、独立性の扱いに注意する。
- **何に使えるか**：チョコレート全般 ― 貯蔵温度とブルーム・官能劣化。出典URL：https://potravinarstvo.com/journal1/index.php/potravinarstvo/article/view/425?articlesBySameAuthorPage=2

#### R2-TM-24. Bui & Coad 2014 ― 熱帯貯蔵とミルクチョコレートの官能劣化
- **書誌情報**：Lan T. T. Bui、Ross Coad. "Military ration chocolate: the effect of simulated tropical storage on sensory quality, structure and bloom formation." *Food Chemistry* 160: 365–370, 2014. DOI: 10.1016/j.foodchem.2014.03.084. PMID: 24799250.
- **確認経路・確認度**：PubMed で書誌・抄録を確認。
- **主要な知見**：軍用レーション用ミルクチョコレートを熱帯気候の温度サイクルで貯蔵し、官能品質、色、顕微鏡観察、DSC を追跡。官能品質は貯蔵で低下し、7日後には外観が受容できなくなった。官能劣化はブルーム程度の増加と強く相関した。
- **適用範囲と限界**：特殊配合と熱帯サイクル条件の極端なケースであり、一般の板チョコレートの賞味期間の根拠には使えない。
- **何に使えるか**：ミルクチョコレート ― 貯蔵劣化とブルームの相関。出典URL：https://pubmed.ncbi.nlm.nih.gov/24799250/

#### R2-TM-25. Tisoncik 2010 ― 乳化剤・ブルーム・長期貯蔵の官能
- **書誌情報**：Melissa A. Tisoncik. "Impact of emulsifiers on physical, sensory, and microstructural properties in formulated dark chocolate with an innovative educational approach." M.S. Thesis, University of Illinois at Urbana-Champaign, 2010。
- **確認経路・確認度**：大学機関リポジトリ IDEALS で学位種別・抄録まで確認。公的・学術グレー文献。
- **主要な知見**：ダークチョコレートの乳化剤、温度サイクル貯蔵、長期貯蔵を検討。34℃貯蔵品は多形 VI へ移行し、官能では硬い、ざらつく、崩れる、融解が遅い、乾いた口当たり、平板で chalky な風味と評価された。室温貯蔵品は劣化せず、クリーミーでチョコレート様・焙煎様・苦い・甘い風味を保持した。
- **適用範囲と限界**：実験室調製のモデル配合であり、TM-3a（Nightingale et al. 2011）と同一研究室系統のため独立した裏付けとして二重計上しない。
- **何に使えるか**：ダークチョコレート ― 貯蔵による食感・風味変化の官能記述。出典URL：https://www.ideals.illinois.edu/items/16049

#### R2-TM-26. Mony et al. 2013 ― 先行する水の温度がチョコレート知覚を変える
- **書誌情報**：Pauline Mony、Tonya Tokar、Peggy Pang、Alexandra Fiegel、Jean-François Meullenet、Han-Seok Seo. "Temperature of served water can modulate sensory perception and acceptance of food." *Food Quality and Preference* 28(2): 449–455, 2013. DOI: 10.1016/j.foodqual.2012.12.002. 著者名の綴りの一部は二次記録経由。
- **確認経路・確認度**：出版社系記録と抄録で確認。
- **主要な知見**：4℃／20℃／50℃の水で口をすすいだ直後にダークチョコレートを評価すると、4℃の水の後では甘味、チョコレート風味、クリーミーさ、全体の嗜好が有意に低かった。
- **適用範囲と限界**：**チョコレート自体の呈示温度を変えた研究ではない**。変えたのは先行する水と口腔内温度であり、「冷蔵したチョコは甘くない」の根拠として引用してはならない。
- **何に使えるか**：ダークチョコレート ― 飲み物温度による文脈効果。お茶とチョコレートの温度相互作用を考える際の一般注記。

#### 第2ラウンド時間変化ラインの陰性結果
- 同一茶液の冷却を連続追跡した飲用時 TDS／TI 実測は見つからなかった。最も近いのは R2-TM-2 の嗅覚3段階と、R2-TM-1 の冷却速度の終点比較である。
- プーアル陳化を扱う中国語学位論文は、検索上の手がかりはあったが、一次リポジトリで書誌を検証できたものはなかった。未検証の学位論文を候補に作らない。
- スリランカ TRI、インド Tocklai、UPASI、台湾 TRES 本体の、淹出条件や個別茶香味に関する引用可能な正式報告は見つからなかった。機関の解説ページや二次記事を研究報告として扱わない。
- 功夫茶式の浸出回数については、既存の Yang 2025 以外の査読研究は新たに見つからなかった。
- チョコレート自体の呈示温度を変えて香味を測った査読研究・学位論文は見つからなかった。温度研究は貯蔵温度と、先行飲料による口腔内温度の文脈効果に限られる。

---

### 11.4 日・中・韓の茶研究（国内文献・中国誌・試験場系）

第2ラウンドで新規に一次確認した候補は15件である。熟プーアル貯蔵の3件は §11.3 の R2-TM-4／5／6 と同一文献であり、本節では重複計上せず、中国語圏でも独立に確認できたことだけを注記する。Mizukami et al. 2008（HJ-4）は書誌がより固まったが、抄録の原典直接確認は本ラウンドでも未達である。

#### R2-TE-1. 著者・誌名未確認 ― 韓国市販玄米緑茶の不揮発成分
- **書誌情報**：韓国語論文「시판 차류의 Catechins, Theaflavins 및 Methylxanthins 함량에 관한 연구」。KCI 記事ID ART001120468。著者名・誌名・年・巻頁は未確認。
- **確認経路・確認度**：KCI 公式ページで抄録を直接確認。
- **主要な知見**：韓国市販ティーバッグ（緑茶、玄米緑茶、紅茶、烏龍茶、ジャスミン茶）の抽出液を HPLC で分析。玄米緑茶の総カテキンは比較対象より低位で、エピカテキン、ECG、カフェイン、テオブロミンの報告範囲下限はいずれも玄米緑茶だった。
- **適用範囲と限界**：不揮発性成分のみで、香気・官能はない。日本の玄米茶と配合・原料が同一とは限らない。
- **何に使えるか**：玄米茶 ― 茶と焙煎米のブレンドによるカテキン・カフェイン希釈の呈味側の下支え。数値は範囲下限としてのみ扱う。一次ソース：KCI 記事ID ART001120468。

#### R2-TE-2. 著者・誌名未確認 ― 玄米緑茶飲料の製造工程
- **書誌情報**：韓国語論文「현미녹차음료 제조공정」("Process for Production of Brown Rice/Green Tea Beverage")。KCI 記事ID ART001056357。著者所属は慶園大学校。著者名・誌名・年・巻頁は未確認。
- **確認経路・確認度**：KCI 公式ページで韓国語・英語抄録を直接確認。原稿 PDF は *Food Engineering Progress* 誌サイトで存在を確認。
- **主要な知見**：焙煎玄米抽出液と緑茶抽出液を混合する飲料形態を対象に、焙煎・粉砕・抽出条件と混合比の官能を検討。玄米の最適焙煎は220℃・15分とされ、官能最適配合は緑茶抽出液：玄米抽出液：水＝17:33:50だった。
- **適用範囲と限界**：**茶葉と炒り米を乾物でブレンドする日本の玄米茶とは製品形態が異なる**。香気成分の同定はない。
- **何に使えるか**：玄米茶 ― 抽出液混合飲料という別形態の配合・官能と、焙煎米側の条件例。出典URL：https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART001056357

#### R2-TE-3. 日本食品標準成分表（八訂）増補2023 ― 玄米茶（浸出液）
- **書誌情報**：文部科学省 日本食品標準成分表（八訂）増補2023年、食品番号16041「玄米茶 浸出液」。
- **確認経路・確認度**：文部科学省 食品成分データベース公式ページで直接確認。
- **主要な知見**：定義は、せん茶50%へ煎ったもち米10%、蒸して乾燥後焙煎したうるち精白米40%を混合したもの（配合のばらつきは大きい）。標準浸出条件と、カフェイン・タンニン等の成分値が示される。
- **適用範囲と限界**：栄養成分表であり、フレーバー研究ではない。
- **何に使えるか**：玄米茶 ― 定義・標準配合・浸出条件の公的根拠。出典URL：https://fooddb.mext.go.jp/details/details.pl?ITEM_NO=16_16041_7

#### R2-TE-4. 水上・澤井・山口 2008 ― ほうじ茶の香気に関与する成分（AEDA）
- **書誌情報**：水上裕造、澤井祐典、山口優一. 「ほうじ茶の香気に関与する成分の分析」『茶業研究報告』105: 43–46, 2008. DOI: 10.5979/cha.2008.105_43.
- **確認経路・確認度**：農研機構 AgriKnowledge の全文 PDF を直接確認。
- **主要な知見**：市販の高価格・強焙煎ほうじ茶3点の浸出液を減圧蒸留し、GC-MS と AEDA で分析。GC-MS で121成分を検出し、FD≥16 の香気活性ピーク25のうち21を同定。2-ethyl-3,5-dimethylpyrazine が全試料で FD 4096 と最重要寄与成分だった。2,3-diethyl-5-methylpyrazine、tetramethylpyrazine、2-acetyl-1-ethylpyrrole、guaiacol、2-ethyl-3,6-dimethylpyrazine も高い FD を示した。
- **適用範囲と限界**：試料は高価格・強焙煎の3点のみ。一般的なほうじ茶全体への一般化には注意する。
- **何に使えるか**：ほうじ茶（葉茶）― 香気の寄与成分（AEDA）。HJ-1（棒ほうじ茶）と並ぶ中核根拠。出典URL：https://agriknowledge.affrc.go.jp/RN/2010761249.pdf

#### R2-TE-5. 水上 2012 ― ほうじ茶のヘッドスペースと浸出液の香気寄与成分
- **書誌情報**：水上裕造. 「ほうじ茶のヘッドスペースと浸出液に含まれる香気寄与成分」『茶業研究報告』114: 65–72, 2012. DOI: 10.5979/cha.2012.114_65.
- **確認経路・確認度**：J-STAGE 公式ページの抄録で直接確認。
- **主要な知見**：ヘッドスペースの香りは 2-ethyl-3,5-dimethylpyrazine の影響を強く受けた。浸出液の香りには同成分に加え、2-acetyl-2-thiazoline、β-damascenone、4-hydroxy-2,5-dimethyl-3(2H)-furanone（フラネオール）の計4成分が強く影響した。アロマプロファイルでは、ヘッドスペース・浸出液とも「香ばしい・甘い・グリーン」が強かった。
- **適用範囲と限界**：FD と香りの性質に基づく寄与評価であり、再構成・omission ではない。
- **何に使えるか**：ほうじ茶 ― 嗅ぐ場面と飲む場面で効く成分が異なることの根拠。出典URL：https://www.jstage.jst.go.jp/article/cha/2012/114/2012_114_65/_article/-char/ja/

#### R2-TE-6. 水上 2012 ― SAFE法によるほうじ茶葉の香気寄与成分
- **書誌情報**：水上裕造. 「Solvent-assisted flavor evaporation装置を用いた高真空蒸留と香気エキス希釈分析法によるほうじ茶葉香気寄与成分の特定」『茶業研究報告』113: 55–62, 2012。
- **確認経路・確認度**：CiNii Research 公式レコードで抄録まで確認。
- **主要な知見**：FD 10–10000 を示す寄与成分50成分を検出し、茶の新規香気成分として furfuryl mercaptane と 2-vinyl-3,5-dimethylpyrazine を同定。最も強く影響するのは 2-ethyl-3,5-dimethylpyrazine とフラネオールで、次いで 2-acetyl-1-pyrroline、(Z)-1,5-octadien-3-one、furfuryl mercaptane、2,3-diethyl-5-methylpyrazine、(E,E)-2,4-nonadienal、β-damascone、β-damascenone が挙げられた。
- **適用範囲と限界**：茶葉自体を対象とする AEDA 系の評価であり、浸出液の官能そのものではない。
- **何に使えるか**：ほうじ茶（葉）― 香気寄与成分。出典URL：https://cir.nii.ac.jp/crid/1390282680313409152

#### R2-TE-7. 川上・山西 1999 ― 焙焼・釜炒りによる茶香気の形成
- **書誌情報**：川上美智子、山西貞. 「焙焼，釜炒り操作による茶香気の形成」『日本農芸化学会誌』73(9): 893–906, 1999. DOI: 10.1271/nogeikagaku1924.73.893.
- **確認経路・確認度**：J-STAGE で抄録・PDF を確認。
- **主要な知見**：荒茶と2段階焙煎のほうじ茶・釜炒り茶を比較し、両者ともメイラード生成物（ピラジン、ピロール、フラン、ピラノン）が焙煎香の主体だった。テアニンと糖由来の 1-ethyl-3,4-dehydropyrrolidone が大量生成し、ほうじ茶で86成分、釜炒り茶で44成分を新規同定した。
- **適用範囲と限界**：GC-O 以前の時代の検出・組成研究であり、寄与実証とは表現しない。
- **何に使えるか**：ほうじ茶／釜炒り茶 ― 焙煎香の生成機構と焙煎条件の古典的根拠。DOI：10.1271/nogeikagaku1924.73.893

#### R2-TE-8. 水上 2015 ― 煎茶の火入れによる香気寄与成分の変動
- **書誌情報**：水上裕造. 「煎茶の火入れによる香気寄与成分の変動」『茶業研究報告』119: 13–20, 2015. 書誌は国立国会図書館サーチで確認。内容は農研機構の成果情報ページ「焙煎された茶に含まれる香気寄与成分」で確認した。
- **確認経路・確認度**：基盤論文は査読誌論文。農研機構成果ページ自体は公的グレー文献として区別する。
- **主要な知見**：火入れで20成分の FD 因子が上昇し、4-mercapto-4-methyl-2-pentanone、2-ethyl-3,5-dimethylpyrazine、フラネオールが最高 FD で「茶の焙煎を代表する寄与成分」とされた。一方、(Z)-3-hexenal と (E,E)-2,4-heptadienal は低下した。
- **適用範囲と限界**：成果ページ経由の要約であり、数値の転記には基盤論文の直接確認が望ましい。
- **何に使えるか**：煎茶の火入れ／焙煎茶 ― 香気寄与成分の変動。出典URL：https://www.naro.go.jp/project/results/laboratory/vegetea/2015/vegetea15_s25.html

#### R2-TE-9. 鍾妮 et al. 2026 ― 君山銀針の QDA と風味輪
- **書誌情報**：鍾妮、禹双双、余鵬輝、趙熙、黄浩、易琼輝、黎娜、鄭紅発. 「君山銀針感官定量描述分析及風味輪構建」『茶葉通訊』53(2): 228–233, 2026. DOI: 10.20178/j.cnki.ISSN1009-525X.2026.02.011.
- **確認経路・確認度**：CNKI 誌ポータルの検索レコードで書誌・抄録を確認。記事ページ自体はタイムアウトのため本文未確認。
- **主要な知見**：岳陽産君山銀針20試料に QDA を実施し風味輪を構築。記述子103から有効42（香気31・呈味11）を得て、鍵記述子として嫩香、鮮香、冰糖甜香、熟栗香、醇香、鮮、甜、醇厚、甘爽を挙げた。典型的風味マーカーは「酵蜜香」と「冰糖甜」とされた。
- **適用範囲と限界**：官能のみで GC-MS／GC-O はない。「酵蜜香」等を特定化合物へ結びつける根拠にはならない。
- **何に使えるか**：君山銀針 ― 官能記述語彙・風味輪の一次根拠。DOI：10.20178/j.cnki.ISSN1009-525X.2026.02.011

#### R2-TE-10. 張庁 et al. 2021 ― 悶黄新工程が蒙頂黄芽の品質・香気へ及ぼす影響
- **書誌情報**：張庁、劉暁、王小萍、龔雪蛟、唐暁波、王雲、李春華（四川省農業科学院茶葉研究所）. 「悶黄新工藝対蒙頂黄芽品質及香気的影響」『食品工業科技』42(22): 276–282, 2021. DOI: 10.13386/j.issn1002-0306.2021030026.
- **確認経路・確認度**：出版社 PDF を直接確認。
- **主要な知見**：快速悶黄の時間条件を比較し、悶黄総時間が延びると茶ポリフェノール、カテキン、カフェインが低下し、可溶性糖と水浸出物が増加した。呈味は醇厚から甜醇へ、香気は清香から甜香へ変化し、揮発成分の増減も測定された。
- **適用範囲と限界**：検出・組成レベルで、GC-O／OAV の記載はない。
- **何に使えるか**：蒙頂黄芽 ― 悶黄時間と甘さ方向への変化の工程・品質根拠。DOI：10.13386/j.issn1002-0306.2021030026

#### R2-TE-11. 金陽 et al. 2025 ― 貯蔵年数の異なる福鼎白茶の GC-IMS
- **書誌情報**：金陽、劉亜峰、刁春華、蘇小琴（杭州茶葉研究院）. 「基于GC-IMS技術分析不同貯藏時間白茶揮発性風味物質」『中国茶葉加工』2025(2): 73–79. DOI: 10.15905/j.zgcyjg.2095-0306.2025.02.08.
- **確認経路・確認度**：SciOpen の出版社ページと PDF を直接確認。
- **主要な知見**：福鼎産・特級白牡丹を1・2・4・6・8年貯蔵し GC-IMS で揮発性成分45種を同定。新鮮な毫香・清香が退いて陳香が現れ、linalool、linalool oxides、methyl salicylate、benzaldehyde、6-methyl-5-hepten-2-one は減少・消失した。8年では酢酸や分岐アルデヒド類が豊富だった。
- **適用範囲と限界**：検出・フィンガープリントレベルで、GC-O・OAV・官能パネルはない。単一産地・単一等級で、貯蔵は杭州の自然条件である。
- **何に使えるか**：白茶（福鼎白牡丹）― 貯蔵年数による香りの方向転換。DOI：10.15905/j.zgcyjg.2095-0306.2025.02.08

#### R2-TE-12. Xia et al. 2026 ― 安化千両茶の貯蔵年数による香気進化
- **書誌情報**：Xia M. et al. "Aroma evolution of Anhua Qianliang tea across different storage years: Machine learning-assisted discrimination of storage stages and screening of marker volatile compounds." *Food Chemistry: X* 37: 104151, 2026. DOI: 10.1016/j.fochx.2026.104151. PMCID: PMC13330534. 完全な PMID は未確認。
- **確認経路・確認度**：PMC 全文で確認。
- **主要な知見**：安化の同一メーカーの千両茶柱（製造年2000–2023、貯蔵2・4・6・9・12・14・18・20・25年）を QDA と HS-SPME／GC×GC-QTOFMS で分析。香気は青い・新鮮から木質・陳・薬草様へ移行し、初期（2・4年）、中期（6–14年）、後期（18–25年）の段階が示された。
- **適用範囲と限界**：単一メーカーで各年1柱のみ。マーカーは相関・機械学習による統計的選別であり、再構成・omission による寄与実証ではない。
- **何に使えるか**：安化黒茶（千両茶）― 貯蔵段階とマーカー候補。DOI：10.1016/j.fochx.2026.104151

#### R2-TE-13. 鄧見田燁 et al. 2023 ― 5種の黒茶の香気成分（蔵茶を含む）
- **書誌情報**：鄧見田燁、晏美紅、尚鉑昊、李亦龍、肖田、朱洛志、王坤波（湖南農業大学）. 「基于HS-SPME-GC-MS技術分析不同種類黒茶香気成分」『食品工業科技』44(18): 378–386, 2023. DOI: 10.13386/j.issn1002-0306.2022110337.
- **確認経路・確認度**：出版社 PDF を直接確認。
- **主要な知見**：茯磚、黒磚、蔵茶、六堡、天尖を官能と HS-SPME-GC-MS で比較。蔵茶は持続する陳香が特徴とされ、茯磚は菌花香＋陳香、六堡は檳榔香＋陳香、天尖は松煙香と位置づけられた。
- **適用範囲と限界**：検出＋官能レベル。**康磚を名指しで分離したデータではない**ため、蔵茶カテゴリとしての結果に留める。
- **何に使えるか**：蔵茶（康磚・金尖を含むカテゴリ）― 香気の位置づけ。DOI：10.13386/j.issn1002-0306.2022110337

#### R2-TE-14. Kobayashi et al. 1985 ― 包種茶の香気形成と萎凋・攪拌
- **書誌情報**：Akio Kobayashi、Keiko Tachiyama、Michiko Kawakami、Tei Yamanishi、I.-M. Juan、W. T.-F. Chiu. "Effects of Solar-withering and Turn Over Treatment during Indoor-withering on the Formation of Pouchong Tea Aroma." *Agricultural and Biological Chemistry* 49(6): 1655–1660, 1985. DOI: 10.1271/bbb1961.49.1655. 共著者 Juan・Chiu は当時の台湾茶業試験場（TRES 前身）所属。
- **確認経路・確認度**：CiNii Research、J-STAGE 号リスト、国立台湾大学 Scholars Hub で三方確認。
- **主要な知見**：日干し萎凋と攪拌回数を変えた包種茶9試料で香気70成分を同定し33成分を比較。攪拌の正の効果は、linalool と geraniol を除き日干し萎凋より大きかった。ヘキセニルエステル、linalool oxides、芳香族アルコール、phenylacetaldehyde、セスキテルペン、cis-jasmone、jasmin lactone、benzyl cyanide、indole が攪拌で顕著に増加し、日干し17分＋攪拌4回が優雅な花香に最適とされた。
- **適用範囲と限界**：1985年の検出・組成研究であり GC-O ではない。TC-9 の「GC-O級なし」という結論は維持されるが、「包種の香気研究自体がない」という理解は本件で更新される。
- **何に使えるか**：文山包種 ― 攪拌工程が花香を形成する古典的一次根拠。DOI：10.1271/bbb1961.49.1655

#### R2-TE-15. Ogura 2004 ― 東方美人の加工中香気変化
- **書誌情報**：Miharu Ogura（高砂香料工業 中央研究所。姓の綴りは PDF の OCR 上一部未確認）. "Tracing Aroma Characteristics Changes during Processing of the Famous Formosa Oolong Tea 'Oriental Beauty'." *Proceedings of the 2004 International Conference on O-CHA (Tea) Culture and Science*, Pr-P-16, 2004.
- **確認経路・確認度**：o-cha.net 公開 PDF で確認。学会プロシーディングであり、学術グレー文献として格付けする。
- **主要な知見**：ウンカ加害葉の加工段階を溶媒抽出と GC／GC-MS で追跡。発酵進行とともに linalool、linalool oxides、hotrienol、2-phenylethanol、geraniol が増加し、主要香気として 2-phenylethanol、benzyl alcohol、linalool oxides、2,6-dimethyl-3,7-octadien-2,6-diol、hotrienol が列挙された。
- **適用範囲と限界**：検出レベルであり GC-O／AEDA ではない。TC-6 の「GC-O級なし」という結論は維持される。
- **何に使えるか**：東方美人 ― 加工段階別香気変化の直接資料（グレー格付け明記）。一次ソース：o-cha.net 公開プロシーディング PDF（Pr-P-16）。

#### 第2ラウンド茶ラインの重要な警告と陰性結果
- **「康磚茶」名義の原料違い**：易宇文 et al.（DOI: 10.13386/j.issn1002-0306.2022100266）の「康磚茶」は、バラ科の俄色葉（*Malus toringoides*）を康磚式に加工したもので、*Camellia sinensis* 製の雅安蔵茶・康磚ではない。出版社 PDF で内容を確認したが、康磚のデータとして流用厳禁のため候補件数には含めない。
- **玄米茶**：日本国内の J-STAGE／CiNii／茶業研究報告系でも、緑茶＋炒り米ブレンドそのものの香気・官能を対象とした査読研究は見つからなかった。韓国の2件は不揮発成分と抽出液混合飲料であり、香気寄与の証拠にはならない。玄米茶の GC-MS／GC-O 研究は日・英・韓いずれでも未発見という結論が固まった。
- **君山銀針**：中国語でも揮発成分を GC-MS 等で測定した香気化学論文は見つからなかった。アイテム固有の一次文献は R2-TE-9 の官能のみである。
- **黒茶の倉儲**：干倉／湿倉を同一ロットで対照した管理実験の一次論文は確認できなかった。広州とウルムチで同一ロット生プーアルを保管したとする二次情報は、ブログ・知乎系まとめにのみ現れる未確認リードとして扱う。
- **康磚単独**：*Camellia sinensis* 製康磚単独の貯蔵研究は未発見のままである。
- HJ-4（Mizukami et al. 2008）は、ACS 誌の巻目次で *Journal of Agricultural and Food Chemistry* 56(6): 2154–2159、著者 Yuzo Mizukami、Yusuke Sawai、Yuichi Yamaguchi、所属は野菜茶業研究所と確定した。ただし DOI 解決先が 403 で抄録の原典直接確認は未達であり、内容面は引用論文経由の間接確認に留まる。PMID は未確認のままである（推測した ID は引用しない）。
- 台湾農業部の公式要約が紹介する Kobayashi 1990・1996（東方美人の蜜香・DOD）は、原論文の完全書誌を一次確認できていないため §12 のリードに分離する。TRES 後継機関の公式ページ自体は香気化学の証拠にはならない。

---

## 12. 最終総括（第1・第2ラウンド統合）

### 12.1 件数の集計
- 第1ラウンド（§2〜§7）：新規に一次確認できた候補 **67件**（うち一部未確認要素を含むもの10件）。
- 第2ラウンド（§11）：新規に一次確認できた候補 **80件**。内訳は、産地25件（§11.1。レコード23件のうちガーナのグループレコードが3論文を含む）、チョコレート追加＋中南米産地16件（§11.2）、時間変化・試験場報告24件（§11.3）、日・中・韓の茶研究15件（§11.4）。
- **累計147件**。この中には査読論文のほか、格付けを明記した学位論文・試験場報告・機関技術報告・会議論文等の公的・学術グレー文献を含む。グレー文献は査読論文と同格の証拠として扱わない。
- 既存研究の再確認・訂正（Tuenter 2021、Šeremet 2019、Stewart 2017、Qiu 2025 正式誌面版、Pramudya 2018 学位論文、Akoa 2024 の IRAD 所属確認）は新規件数に含めていない。
- 未確認リードは第1ラウンド11件（§10）＋第2ラウンド17件（§12.5）の計28件で、件数には含めていない。

### 12.2 情報不足が解消できそうなアイテム（更新版）
§8 の一覧に、第2ラウンドで次の更新が加わる。
- **ほうじ茶（葉）**：R2-TE-4〜6（水上の一連の AEDA 研究）により、葉ほうじ茶でも寄与成分を日本語一次文献で裏付け可能になった。2-ethyl-3,5-dimethylpyrazine とフラネオールが中核。
- **ホワイトチョコレート**：R2-CH-6（Godočiková 2019）により実製品の揮発プロファイル（検出レベル）が存在する。寄与レベルは依然としてモデル系（Stewart 2017）のみ。
- **プーアル茶の貯蔵・陳化**：R2-TM-4〜9 により、熟茶（2年〜40年超、GC-O あり）と生茶（再構成あり、転換点3年・8年）の年数系列が組める。黒茶の時間変化は本調査で最も厚くなった領域の一つ。
- **安化黒茶（千両茶）・蔵茶**：R2-TE-12／13 により、安化の年数系列と蔵茶カテゴリの香気位置づけが追加された。ただし康磚単独の分離データではない。
- **君山銀針**：R2-TE-9 により官能記述と風味輪の一次根拠が得られた。香気化学は依然なし。
- **文山包種**：R2-TE-14（Kobayashi 1985）により、攪拌工程と花香形成の古典的根拠が得られた（検出・組成レベル）。
- **エクアドル／Nacional**：R2-OR-27〜31 により、花香を linalool 単独ではなく2つの生合成経路と複数化合物で扱う根拠が揃った。INIAP の官能・技術報告も追加された。
- **新規産地の追加候補**：ニカラグア（R2-OR-32／33）、コスタリカ／CATIE クローン（R2-OR-34、前駆体レベル）、ナイジェリア（R2-OR-19／20、組成・商品品質レベル）。
- **ガーナ**：R2-OR-11〜15 により、国内地域差の機器分析と発酵・前処理条件の実測が厚くなった。いずれも産地固有の香味ではなく条件効果として使う。
- **マダガスカル**：査読された香味研究は無いが、R2-OR-21〜23 のグレー文献により「品質は発酵期間とロット規模に左右される」という生産条件の一次資料が得られた。香味ではなく生産条件として記録するのが適切。
- **日本茶の貯蔵・煎数**：R2-TM-14／15／17（茶業試験場系の日本語原典と近年の試験場報告）と R2-TM-19／21 により、貯蔵劣化の非対称性（呈味成分は比較的安定し、香気・色が先行して劣化）と煎数変化の成分的裏付けが揃った。
- **チョコレートの貯蔵**：R2-TM-23／24 により、ブルームと官能劣化の温度依存・相関が補強された。

### 12.3 探索しても無かった領域（最終版）
第1・第2ラウンド（非英語圏・試験場報告・学位論文まで拡大）を通じて確認できなかったもの：
- ダークミルクを定義した専用研究（査読論文・学位論文とも）。
- 玄米茶（緑茶＋炒り米の乾物ブレンド）そのものの香気・官能の査読研究。韓国の不揮発成分研究と抽出液混合飲料の研究のみ。
- ルビーチョコレートの揮発成分の寄与研究（GC-O／AEDA／OAV）、色の安定性を直接定量した研究、アントシアニン定量。
- ホワイトチョコレート実製品の GC-O／AEDA／OAV 級の香気研究（検出レベルの GC-MS のみ）。
- ブロンド／キャラメリゼホワイトの、Aydın 2021 以外の直接研究（学位論文・他言語含む）。
- タンザニア単独の官能・揮発・遺伝構成の査読研究、および TARI の香味・発酵・品質に関する研究成果報告。
- マダガスカル産豆レベルの査読された官能研究。
- 君山銀針の香気化学（GC-MS 等による揮発成分測定）。
- 東方美人の GC-O／AEDA 級の寄与実証（会議プロシーディングの検出レベルが上限）。
- 同一茶液が冷める過程を連続測定した飲用時系列研究（嗅覚3段階と冷却速度の終点比較が最接近）。
- チョコレート自体の呈示温度を変えて香味を測った研究。
- 干倉／湿倉を同一ロットで対照した管理実験の一次論文。
- *Camellia sinensis* 製康磚単独の貯蔵研究。
- プーアル陳化を扱う中国語学位論文のうち、一次リポジトリで書誌を検証できたもの。
- スリランカ TRI、インド Tocklai／UPASI、台湾 TRES 本体の引用可能な正式研究報告（個別茶の香味・淹出条件）。

### 12.4 記録上の重要な訂正・警告
- Tuenter et al. 2021 の記事番号は **128446**（「128464」は二次引用の誤記）。同論文はアントシアニンを定量しておらず、ルビーの色の根拠に使えない。
- 「康磚茶」名義でも原料が *Camellia sinensis* でない研究が存在する（俄色葉の加工品）。産地・品名だけで採用しない。
- Marseglia 2020（OR-5）の試料総数の版間表記ゆれ、Luchian 2023（CH-8）の試料対応など、統合時に原典で再照合すべき点は各レコードと §10・§12.6 に残した。
- 同一メーカー・同一研究室系統の研究（Zarić／Ostojin、Nightingale／Tisoncik、Godočiková 論文／学位論文、Fricke 論文／学位論文）は独立した裏付けとして二重に数えない。

### 12.5 未確認リード（第2ラウンド分。書誌・内容の確定前に使用しない）
1. Koné 2017 博士論文（コートジボワール、ポストハーベストと香気形成）——大学リポジトリ原典未確認。
2. Luhwago 2016 学士プロジェクト（タンザニア、地元加工カカオ飲料）——SUA リポジトリ原典未確認。
3. CRIN ハイブリッドのチョコレート官能 2022（ナイジェリア）——出版社ページ未確認。
4. INIAP リポジトリの linalool 含量実測記録——著者・年次未確認。
5. IICA 1949 年学位論文（コスタリカ大西洋側の品質要因）——著者未確認。歴史資料としてのみ。
6. チョコレート中メイラード反応生成物の定量研究 2025——掲載誌・著者・DOI 未確認（JoVE Visualize 経由）。
7. KREI 報告書（韓国、玄米添加緑茶の配合と香味）——報告書名・年・著者未確認。
8. Sasaki et al. 2015「棒茶の香り」総説（*におい・かおり環境学会誌* 46(2): 133–140、DOI: 10.2171/jao.46.133）——書誌は確認、内容は総説。
9. 長谷川香料の企業研究（ほうじ茶の新規キー成分と添加試験）——掲載誌・学会等の書誌未確認。
10. 陳韻揚 2023 浙江大学学位論文（貯蔵5年の福鼎白茶）——引用リストでのみ存在確認。
11. Kobayashi 1990（東方美人の蜜香成分）——台湾農業部の公式要約経由。原論文の完全書誌未確認。
12. Kobayashi et al. 1996（東方美人とダージリンの DOD）——同上。
13. Tokitomo et al. 1984（包種型半発酵茶の萎凋・揉捻）——引用レベル確認のみ。
14. I.-M. Juan の凍頂型烏龍の焙煎温度に関する文書——文書種別・年次未確認。
15. 干倉／湿倉の同一ロット対照とされる二次情報（生プーアル 7542 の広州／ウルムチ保管）——一次論文未確認。
16. 李丹・杜暁らの蒙頂山黄茶「酶促悶黄」研究——年・巻・頁未確認。
17. Godočiková 学位論文におけるルビー試料の揮発内訳——要旨範囲ではルビー単独データの抽出可否が未確認。

### 12.6 再確認課題（第2ラウンド分）
- §11.1：R2-OR-3 の頁範囲、R2-OR-5 の共著者完全リスト、R2-OR-6 の著者名、R2-OR-8 の出版社記事ページ、R2-OR-19 の掲載誌名・巻頁、R2-OR-21 学位論文の数値原表の抽出。
- §11.2：R2-CH-6（Godočiková 2019）の共著者完全リスト・DOI と誌公式記録、R2-OR-24（Oliveira 学位論文）の氏名表記、R2-OR-28（Solórzano 2015）の DOI 末尾の不一致、R2-OR-30（Morillo 2023）の完全題名、R2-CH-5（モルドバ会議論文）の著者名。
- §11.3：R2-TM-9（生プーアル1–22年）の著者名、R2-TM-13（英紅九号貯蔵）の掲載誌名、R2-TM-20（スリランカ低地茶）の著者・年次、R2-TM-10（Chen 2013）の DOI の出版社ページ照合。
- §11.4：R2-TE-1／2（韓国玄米緑茶2件）の著者・誌名・巻頁、R2-TE-9（君山銀針 QDA）の本文、R2-TE-12（千両茶）の完全な PMID、HJ-4（Mizukami 2008）の抄録の原典直接確認、HJ-3（Gotti 2021）の DOI。
- 第1ラウンド分の再確認課題は §10 に残したものが引き続き有効である。

---
