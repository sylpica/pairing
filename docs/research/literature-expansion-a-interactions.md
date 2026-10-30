# 文献拡張ラインA：相互作用・ペアリング科学の徹底探索（2026-10-30）

## 目的と位置づけ

- ユーザー指示（2026-10-30）：「まだまだ文献探索が足りない。要件から外れず徹底的に網羅すること。文献はどれだけ増えてもよい」「件数が少ない。もっと探索してもいい」に応え、お茶×チョコレートの組み合わせ表示（相互作用・味わいの性格の推測）の根拠を厚くするために実施した徹底探索の記録。
- 既存調査 `docs/research/pairing-interactions.md`（メカニズム M1〜M10）の出典は探索対象から除外し、隣接領域の総説・ハンドブック章・学位論文レベルまで広げた。
- **将来の「研究用のより高度なアプリ」からも再利用できる粒度**で、各文献を統一形式（書誌情報／主要な知見／適用範囲と限界／何に使えるか）で記録する。
- 本書は探索記録であり、**`src/data/sources.ts` への登録は行っていない**（登録時点の出典総数は91件、2026-10-30確認）。統合（登録・ルール化）は後工程。
- 記事・メーカー資料は「参考情報」として格付けし、実測・寄与の単独根拠にしない。論文と食い違う場合は論文優先。

## 探索体制と確認区分

7ライン並行で探索した（1：クロスモーダル知覚、2：ペアリング科学、3：渋味・味混合、4：脂肪放出・温度・順序、5：直接研究の精査、6：個人差・期待・方法論、7：総説・ハンドブック・学位論文）。

確認区分の定義（全ライン共通）：

- **一次確認済み**：原著論文・出版社ページ・PubMed/PMC・大学リポジトリ等の一次情報で、書誌とアブストラクト（主張範囲）を実際に確認したもの。「相当」は、出版社系転載・機関リポジトリ等でアブストラクト全文を確認したが出版社一次ページ自体には到達しなかったもの。
- **書誌のみ確認**：書誌（著者・年・誌名・巻頁・DOI）は一次寄りの記録で確認できたが、アブストラクトを一次ページで読めていないもの。要旨の記述は二次的に伝わった範囲に限定する。
- **未確認**：書誌要素の確定に至らなかったもの。根拠として使わない。

件数の目安：§1〜§7 の一次確認済み（相当含む）はユニークで約125件、書誌のみ確認が約20件、未確認が約10件。これに加えて §8（未査読・専門家言説・機関情報の参考情報）がユニーク約53件。

## ★ 重要な訂正（既存ドキュメントへの申し送り）

`docs/research/pairing-interactions.md` の大前提にある「お茶×チョコレートという特定の組み合わせ自体を官能評価した査読研究は、今回の調査範囲では確認できなかった」は**誤り**である。お茶（飲料）×チョコレートを別々に供して官能評価した査読研究が2件存在する（§5 A-1、A-2）：

- Donadini, Fumi & Lambri 2012, *Food Research International* 48(2):703–711, DOI: 10.1016/j.foodres.2012.06.009
- Donadini & Fumi 2014, *Food Research International* 63:464–476, DOI: 10.1016/j.foodres.2014.05.038

系統的レビュー Rune et al. 2021（§2-7）と Romeo-Arroyo et al. 2023（§5 B-1）の序文も、この2件のみであるという希少性を裏付ける。ただし両研究とも茶は市販汎用品のみで、産地・品種・製法別の茶は対象外である。したがって「組み合わせレベルの相性表示は隣接証拠からの推論であり、証拠レベルの明示が必要」という既存方針自体は維持されるが、「直接研究なし」の記述は「直接研究は2件のみ（同一グループ、汎用茶のみ）」に訂正すべきである。

なお編纂者による DOI 解決ページの直接再確認はネットワークエラーで失敗した（2026-10-30）。各文献の確認手段は各ラインの一次情報確認に基づき、項目ごとに明記する。

---

## §1 クロスモーダル知覚（香り×味、色、音・食感）

### 1-1Frank & Byram 1988
- **書誌情報**：Frank, R. A., & Byram, J. (1988). Taste-smell interactions are tastant and odorant dependent. *Chemical Senses*, 13(3), 445–455. DOI: 10.1093/chemse/13.3.445
- **主要な知見**：4実験（計73名）。イチゴ香はショ糖の甘味を増強したが塩味は増強せず、ピーナッツバター香は甘味を増強しなかった。鼻をつまむと効果の85%が消失し、効果が嗅覚由来であることを示した。
- **適用範囲と限界**：増強は「香りと味の組み合わせ依存」で、無差別には起きない。モデル溶液系の知見。
- **何に使えるか**：甘味増強表示の最も基本的な根拠（M1の補強）。「カカオ香／バニラ香が甘味を強める」式の表示は、適合する香り×味ペアに限定すべきことの根拠。
- **確認手段**：APA PsycNet（アブストラクト全文）。

### 1-2Frank, Ducheny & Mize 1989
- **書誌情報**：Frank, R. A., Ducheny, K., & Mize, S. J. S. (1989). Strawberry odor, but not red color, enhances the sweetness of sucrose solutions. *Chemical Senses*, 14(3), 371–377. DOI: 10.1093/chemse/14.3.371
- **主要な知見**：大学生40名。イチゴ香は小さいが有意な甘味増強を示した（特に嚥下条件で安定）。一方、赤色着色は甘味に効果がなかった。
- **適用範囲と限界**：「色が常に味を変える」わけではないという重要な対照結果。
- **何に使えるか**：色の期待効果を表示する際の留保の根拠。「香りは甘味を増強しうるが、色単独では増強しない場合がある」と両論併記できる。
- **確認手段**：APA PsycNet＋大学研究者ページ。

### 1-3Dalton et al. 2000
- **書誌情報**：Dalton, P., Doolittle, N., Nagata, H., & Breslin, P. A. S. (2000). The merging of the senses: integration of subthreshold taste and smell. *Nature Neuroscience*, 3(5), 431–432. DOI: 10.1038/74797
- **主要な知見**：閾値下濃度の味刺激（サッカリン等）と香り刺激（ベンズアルデヒド＝チェリー／アーモンド香）を同時提示すると、単独では検出できない組み合わせが検出可能になるクロスモーダル加算を示した。
- **適用範囲と限界**：中枢での味・香り統合の心理物理学的証拠。統合は刺激ペア選択的であり、全ペアで起きるわけではない。
- **何に使えるか**：「香りと味は別々ではなく一つのフレーバーとして統合される」というペアリング表示全体の理論的土台。
- **確認手段**：Nature出版社ページ。

### 1-4de Araujo et al. 2003
- **書誌情報**：de Araujo, I. E. T., Rolls, E. T., Kringelbach, M. L., McGlone, F., & Phillips, N. (2003). Taste-olfactory convergence, and the representation of the pleasantness of flavour, in the human brain. *European Journal of Neuroscience*, 18(7), 2059–2068. DOI: 10.1046/j.1460-9568.2003.02915.x
- **主要な知見**：鼻後嗅覚で味・香りを提示したfMRI研究。味と香りの双方に応答する領域（尾側眼窩前頭皮質、扁桃体、島皮質、前帯状皮質）を確認し、単独ではほぼ賦活しないのに併合で賦活する部位を同定。組み合わせの「調和度（consonance）」と快さの相関は内側前方眼窩前頭皮質に見られた。
- **適用範囲と限界**：神経相関の知見であり、個別ペアの効果量を示すものではない。
- **何に使えるか**：「調和するペアは快さとして脳で表象される」ことの神経科学的根拠。
- **確認手段**：PubMed（PMID: 14622239）。

### 1-5Small et al. 2004
- **書誌情報**：Small, D. M., Voss, J., Mak, Y. E., Simmons, K. B., Parrish, T., & Gitelman, D. (2004). Experience-dependent neural integration of taste and smell in the human brain. *Journal of Neurophysiology*, 92(3), 1892–1903. DOI: 10.1152/jn.00050.2004
- **主要な知見**：event-related fMRI。一致するフレーバー（バニラ＋甘味）では構成要素の単純和を超える超加算応答が前帯状皮質、島、眼窩前頭皮質、前頭弁蓋等に生じたが、不一致ペア（バニラ＋塩味）では生じなかった。統合は①鼻後経路と②過去の経験に依存する。
- **適用範囲と限界**：統合は経験依存であり、文化的・個人的食経験で変わりうる。
- **何に使えるか**：「経験したことのある組み合わせほど統合が強い＝文化・食経験依存」という留保付き表示、および一致ペアの甘味増強表示の神経基盤（M1・M3の補強）。
- **確認手段**：PubMed（PMID: 15102894）。

### 1-6Small & Prescott 2005（総説）
- **書誌情報**：Small, D. M., & Prescott, J. (2005). Odor/taste integration and the perception of flavor. *Experimental Brain Research*, 166(3–4), 345–357. DOI: 10.1007/s00221-005-2376-9
- **主要な知見**：香り×味統合研究の総説。フレーバー知覚は過去経験、時間的・空間的同時性、注意配分に依存するというモデルを提示し、前部島、前頭弁蓋、眼窩前頭皮質、前帯状皮質からなる「フレーバー・ネットワーク」を提案。
- **適用範囲と限界**：総説であり個別効果の保証ではない。
- **何に使えるか**：ペアリング根拠の総論的引用先。「なぜそのペアが合うか」の説明文（経験・同時性・注意）の枠組み。
- **確認手段**：PubMed（PMID: 16028032）。

### 1-7Delwiche 2004（総説）
- **書誌情報**：Delwiche, J. (2004). The impact of perceptual interactions on perceived flavor. *Food Quality and Preference*, 15(2), 137–146. DOI: 10.1016/S0950-3293(03)00041-7
- **主要な知見**：味・香りだけでなく色、食感、音、刺激感、温度まで含めた知覚的相互作用と物理的相互作用を整理した総説。
- **適用範囲と限界**：個別効果の大きさを保証するものではない。
- **何に使えるか**：色・食感・温度を含む総合表示（「温度で香りの感じ方が変わる」等）の総説的根拠。
- **確認手段**：出版社PDF全文。

### 1-8Stevenson, Prescott & Boakes 1995
- **書誌情報**：Stevenson, R. J., Prescott, J., & Boakes, R. A. (1995). The acquisition of taste properties by odors. *Learning and Motivation*, 26(4), 433–455. DOI: 10.1016/S0023-9690(05)80006-2
- **主要な知見**：マスクド条件付けで、香りをショ糖と対提示するとその香りが「甘く」感じられるようになり、クエン酸と対提示すると「酸っぱく」感じられるようになった。随伴性の自覚の有無は効果に影響せず、味なし曝露のみの対照では変化なし。連合学習（無自覚でも成立）が香りの味性質獲得の機序であることを示した。
- **適用範囲と限界**：実験室条件付けの知見。実食品での持続性は別途検証が必要（1-11の否定的結果参照）。
- **何に使えるか**：「この香りが甘く感じられるのは、甘味と共に経験されてきたから」という、香りの性格推測表示の学習理論的根拠。
- **確認手段**：大学研究者ページ（Macquarie）／APA PsycNet。

### 1-9Stevenson, Boakes & Prescott 1998
- **書誌情報**：Stevenson, R. J., Boakes, R. A., & Prescott, J. (1998). Changes in odor sweetness resulting from implicit learning of a simultaneous odor-sweetness association: An example of learned synesthesia. *Learning and Motivation*, 29(2), 113–132. DOI: 10.1006/lmot.1998.0996
- **主要な知見**：2実験（計67名）。香りをショ糖溶液のフレーバラントとして経験すると、香り単独の「嗅いだ甘さ」が増加した。実験者盲検化でも、カップ／ストロー条件でも成立し、随伴性への明示的知識は効果を左右しなかった。
- **適用範囲と限界**：「学習された共感覚（learned synesthesia）」と位置づけられる現象。効果条件は1-11と併せて読むこと。
- **何に使えるか**：甘味増強が一時的な錯覚ではなく学習で形成・持続しうることの根拠。ユーザーの嗜好学習（飲み慣れ）に関する表示にも転用可。
- **確認手段**：ScienceDirect／APA PsycNet。

### 1-10Prescott 2015（オピニオン／総説）
- **書誌情報**：Prescott, J. (2015). Flavours: the pleasure principle. *Flavour*, 4, 15. DOI: 10.1186/2044-7248-4-15
- **主要な知見**：フレーバー知覚は主に連合学習を通じた香りと味の統合であり、その主目的は食品同定よりも香り・フレーバーへの快価値の付与にある、という立場論文。
- **適用範囲と限界**：実証データそのものではなく解釈枠組みである。
- **何に使えるか**：「相性が良い＝快い」という快楽面を前面に出す表示文の理論的根拠。
- **確認手段**：Flavour誌出版社PDF。

### 1-11Fondberg, Lundström & Seubert 2021（否定的結果・重要）
- **書誌情報**：Fondberg, R., Lundström, J. N., & Seubert, J. (2021). Odor-taste interactions in food perception: Exposure protocol shows no effects of associative learning. *Chemical Senses*, 46, bjab003. DOI: 10.1093/chemse/bjab003
- **主要な知見**：60名、5日間・1日3回のチューインガム曝露（バジル／オレンジフラワー香±ショ糖）で、香りの快さはショ糖併用の有無にかかわらず上昇したが、連合学習の証拠はいずれの課題でも得られず、同等性検定でも効果は「なし、または無視できる大きさ」だった。著者らは学習効果は従来考えられたより小さいか、実験設定に強く依存すると結論。
- **適用範囲と限界**：1-8、1-9への直接の反証的知見。学習効果の一般化はできない。
- **何に使えるか**：学習効果を過大表示しないための歯止め。「繰り返し飲むと合うようになる」式の表示には条件依存性の注記が必要である根拠。
- **確認手段**：PubMed（PMID: 33474567）。

### 1-12Morrot, Brochet & Dubourdieu 2001
- **書誌情報**：Morrot, G., Brochet, F., & Dubourdieu, D. (2001). The color of odors. *Brain and Language*, 79(2), 309–320. DOI: 10.1006/brln.2001.2493（PMID: 11712849）
- **主要な知見**：ワイン専門家のテイスティング・コメントの語彙分析では、香りはワインの色を持つ対象の語で表されることが大半だった。無臭の色素で赤く染めた白ワインを醸造学の学生54名が「赤ワインの香り」として記述した。
- **適用範囲と限界**：この錯覚は香りの言語化段階で生じると示唆される。知覚そのものが変わったか、記述が引っ張られたかは分離されていない。
- **何に使えるか**：お茶の水色・チョコレートの外観色が香りの言語化・期待を方向づけることの古典的根拠。「知覚変容と断定しない」注記とセットで使うべき。
- **確認手段**：原論文PDF＋PubMed書誌照合。

### 1-13Spence 2015（色の総説）
- **書誌情報**：Spence, C. (2015). On the psychological impact of food colour. *Flavour*, 4, 21. DOI: 10.1186/s13411-015-0031-3
- **主要な知見**：色は食品固有の感覚手がかりの中で、味・フレーバーの期待設定に最も重要な単一手がかりであるとする総説。色の色相・濃さの変更は期待と後続の体験に時に劇的な影響を与えるが、色と味が不一致の場合は期待の否定的不確認（がっかり）を招く。色の意味は年齢層・文化で異なり、テイスター状態などの遺伝的差異も調整要因になる。
- **適用範囲と限界**：文化差の留保を含む。日本向け表示への直接転用には注意。
- **何に使えるか**：水色×味の期待表示の総説的根拠。「日本／欧米で色の連合が同じとは限らない」「不一致ペアでは逆効果がありうる」という留保の出典。
- **確認手段**：Flavour誌出版社PDF／Oxford大学ページ。

### 1-14Piqueras-Fiszman et al. 2012（容器色）
- **書誌情報**：Piqueras-Fiszman, B., Alcaide, J., Roura, E., & Spence, C. (2012). Is it the plate or is it the food? Assessing the influence of the color (black or white) and shape of the plate on the perception of the food placed on it. *Food Quality and Preference*, 24(1), 205–208. DOI: 10.1016/j.foodqual.2011.08.011
- **主要な知見**：同一のイチゴムースを白皿／黒皿（および形状違い）で提示。白皿の方がフレーバー強度・甘味が高く評価され、好まれもした。皿の形状には有意な影響なし。
- **適用範囲と限界**：単一食品・白黒2色のみの知見であり一般化には限界がある。
- **何に使えるか**：茶器・器の色に関する表示（「白磁では甘味・香りが引き立つ」等）の実証根拠。器の形状効果は主張できないことの根拠にもなる。
- **確認手段**：APA PsycNet。

### 1-15Zampini & Spence 2004
- **書誌情報**：Zampini, M., & Spence, C. (2004). The role of auditory cues in modulating the perceived crispness and staleness of potato chips. *Journal of Sensory Studies*, 19(5), 347–363. DOI: 10.1111/j.1745-459x.2004.080403.x
- **主要な知見**：ポテトチップスを噛む音の聴覚フィードバックをリアルタイムに操作すると、クリスプネスと鮮度評価が系統的に変化した。全体音量を上げる、または高周波成分（2–20 kHz）を増幅すると、よりカリッと新鮮に感じられた。消費者はこの影響に通常気づかない。
- **適用範囲と限界**：飲料（お茶）自体への直接適用ではない。
- **何に使えるか**：チョコレートのスナップ音や菓子の咀嚼音が鮮度・食感評価を左右することの根拠。
- **確認手段**：Wiley出版社ページ。

### 1-16Spence 2015（音の総説）
- **書誌情報**：Spence, C. (2015). Eating with our ears: assessing the importance of the sounds of consumption on our perception and enjoyment of multisensory flavour experiences. *Flavour*, 4, 3. DOI: 10.1186/2044-7248-4-3
- **主要な知見**：音を「忘れられたフレーバーの感覚」と位置づける総説。咀嚼音からクリスピー／クランチー等の食感が読み取れること、消費音を摂食行為と同期させて操作すると体験自体が変わることを示す研究群を整理。炭酸感などへの応用にも言及。
- **適用範囲と限界**：総説。対象は咀嚼音のある食品が中心。
- **何に使えるか**：音×食感表示の総説的根拠。
- **確認手段**：Flavour誌出版社PDF。

### 1-17Crisinel & Spence 2010（音程×味の対応）
- **書誌情報**：Crisinel, A.-S., & Spence, C. (2010). As bitter as a trombone: Synesthetic correspondences in nonsynesthetes between tastes/flavors and musical notes. *Attention, Perception, & Psychophysics*, 72(7), 1994–2002. DOI: 10.3758/APP.72.7.1994
- **主要な知見**：非共感覚者でも、甘味・酸味は高音に、うま味・苦味は低音に一貫してマッチングされた。フレーバー単体では音高連合は弱かった。
- **適用範囲と限界**：これは「対応（correspondence）」の知見であり、実際の味覚変容を示したものではない。
- **何に使えるか**：カカオの苦味を「低音・重厚」のような比喩表現で示す場合の根拠。知覚変容ではなく連合であることを表示上区別すべき。
- **確認手段**：PubMed（PMID: 20952795）。

### 1-18Crisinel et al. 2012（サウンドトラックによる味の変調）
- **書誌情報**：Crisinel, A.-S., Cosser, S., King, S., Jones, R., Petrie, J., & Spence, C. (2012). A bittersweet symphony: Systematically modulating the taste of food by changing the sonic properties of the soundtrack playing in the background. *Food Quality and Preference*, 24(1), 201–204. DOI: 10.1016/j.foodqual.2011.08.009
- **主要な知見**：同一のシンダートフィー（苦甘い菓子）を、「苦味に合う」低音中心のサウンドトラックと「甘味に合う」高音中心のサウンドトラックで評価させると、前者で有意に苦く感じられた。
- **適用範囲と限界**：対象は1食品のみ。
- **何に使えるか**：茶席のBGM・環境音に関する表示の根拠。水色や香りの表示とは別レイヤーとして扱うべき。
- **確認手段**：APA PsycNet。

### 1-19Seo & Hummel 2011（音×香りの快さ）
- **書誌情報**：Seo, H.-S., & Hummel, T. (2011). Auditory-olfactory integration: Congruent or pleasant sounds amplify odor pleasantness. *Chemical Senses*, 36(3), 301–309. DOI: 10.1093/chemse/bjq129（PMID: 21163913）
- **主要な知見**：香りは congruency の高い音と共に提示された方が快く評価された。音自体の快さが香りの快さに転移する halo/horns 効果も見られた。一方、香りの強度評価は音の congruency／快さにほとんど影響されなかった。
- **適用範囲と限界**：音が変えるのは「強さ」ではなく「快さ」が中心。
- **何に使えるか**：環境音がお茶の香りの「心地よさ」評価に影響しうることの根拠。香りの強さ表示への転用はできない。
- **確認手段**：PubMed経由ページ／APA PsycNet。

### 1-20Auvray & Spence 2008（総説）
- **書誌情報**：Auvray, M., & Spence, C. (2008). The multisensory perception of flavor. *Consciousness and Cognition*, 17(3), 1016–1031. DOI: 10.1016/j.concog.2007.06.005
- **主要な知見**：フレーバー知覚の多感覚相互作用を総覧し、フレーバーは味・香り・三叉神経感覚・触覚に視覚・聴覚手がかりを加えた統一知覚として定義すべきだと提案する理論的総説。
- **適用範囲と限界**：個別効果量の根拠ではない。
- **何に使えるか**：アプリの「フレーバーとは何か」という概念説明・用語定義の出典。
- **確認手段**：PubMed（PMID: 17689100）。

### 1-21Spence 2015（Cell Perspective）
- **書誌情報**：Spence, C. (2015). Multisensory flavor perception. *Cell*, 161(1), 24–35. DOI: 10.1016/j.cell.2015.03.007
- **主要な知見**：フレーバー知覚は日常経験の中で最も多感覚的であり、聴覚・視覚・触覚で確立した多感覚統合の規則が化学感覚にも適用できる可能性を論じる Perspective。
- **適用範囲と限界**：枠組み提示であり個別効果の根拠ではない。
- **何に使えるか**：ペアリング表示全体の包括的総説引用。「味は舌だけではない」という導入文の根拠。
- **確認手段**：PubMed（PMID: 25815982）。

### 1-22Schifferstein & Verlegh 1996
- **書誌情報**：Schifferstein, H. N. J., & Verlegh, P. W. J. (1996). The role of congruency and pleasantness in odor-induced taste enhancement. *Acta Psychologica*, 94, 87–105. DOI: 10.1016/0001-6918(95)00040-2
- **主要な知見**：※二次情報の範囲：congruency／快さの評定は類似性評定の代わりにならず、増強の程度は知覚的類似性が予測するとされる。
- **適用範囲と限界**：本論文のアブストラクトは一次ページで未読。既存 M1 の根拠としても本書では参考文献扱いに留める（pairing-interactions.md の扱いと同一）。重要な古典なので次回優先確認を推奨。
- **何に使えるか**：M1 の congruency 概念の原典候補（採用前に一次確認が必要）。

### 1-23Spence, Levitan, Shankar & Zampini 2010
- **書誌情報**：Spence, C., Levitan, C. A., Shankar, M. U., & Zampini, M. (2010). Does food color influence taste and flavor perception in humans? *Chemosensory Perception*, 3, 68–84. DOI: 10.1007/s12078-010-9067-z
- **主要な知見**：※二次サイトでのみ確認：「色はフレーバーの同一性（identity）判断には明確に影響するが、強度判断への効果は証拠が混在」という結論とされる。
- **適用範囲と限界**：出版社ページでの一次確認が未了のため未確認扱い。根拠として使わない。

### §1 の空白（探索したが確立した知見が乏しい点）
- お茶×チョコレートそのものを対象としたクロスモーダル実験は見当たらなかった。既存証拠はほぼ水溶液（ショ糖＋単一香料）、ワイン、ムース、ポテトチップス、トフィー等のモデル系であり、「茶の鼻後香×カカオの苦味・脂肪感」への外挿は未検証の推論。表示では「モデル研究からの類推」と明示すべき領域。
- 苦味・渋味に対する香りの増強／抑制の証拠は、甘味に比べてはるかに薄い。香り誘発性の増強研究は圧倒的に甘味中心で、チョコレートで重要な苦味・渋味、お茶のうま味・渋味への系統的研究は乏しい。
- 色→「強度」への効果は一貫しない（1-2 の赤色無効果など）。「水色が濃い＝味が濃い」式の単純表示を支える確立した証拠はない。
- 連合学習効果の再現性は不安定（1-11）。「飲み慣れで相性が上がる」表示は断定できない。
- 音・食感の知見は固体食品中心で、飲料への転用証拠が乏しい。「注ぐ音」「すする音」等の対応研究は確認できなかった。
- 文化差（日本人被験者）の検証が乏しい。欧米の連合表をそのまま日本向け表示に流用する根拠は弱い。

---

## §2 食品ペアリング科学・隣接ペアリング官能研究

総括：隣接領域で繰り返し支持されるのは、化合物の共有ではなく、(a) 強度のバランス／どちらかが支配しすぎないこと、(b) 単品での好き嫌いがペアの好き嫌いを強く規定すること、(c) 先に食べた食品が飲料の酸味・渋味・フレーバー強度を下げる（抑制）方向の相互作用、(d) 芳香の類似性は調和感を上げるが好き嫌いへの効果は条件依存、である。

### 2-1Ahn, Ahnert, Bagrow & Barabási 2011
- **書誌情報**：Ahn Y-Y, Ahnert SE, Bagrow JP, Barabási A-L. Flavor network and the principles of food pairing. *Scientific Reports* 1:196 (2011). DOI: 10.1038/srep00196
- **主要な知見**：56,498レシピ、381食材、1,021フレーバー化合物の二部ネットワークを構築。北米・西欧料理は共有化合物の多い食材対を使う傾向（仮説支持）だが、東アジア・南欧料理は逆に共有を避ける傾向を示した。効果の大半は少数頻出食材（北米では乳製品・卵・カカオ等13食材が全レシピの74.4%に出現）に由来する。
- **適用範囲と限界**：レシピ共起の統計であり、「共有が多いほど美味しい」という官能的主張は本研究自体は示していない。
- **何に使えるか**：ペアリング表示の方法論的原点として引用可能だが、「共有化合物数＝相性の良さ」の根拠には使えない。「文化圏で逆転する」留保の根拠。
- **確認手段**：PMC全文。

### 2-2Jain, Rakhi N K & Bagler 2015
- **書誌情報**：Jain A, N K R, Bagler G. Analysis of Food Pairing in Regional Cuisines of India. *PLoS ONE* 10(10):e0139539 (2015). DOI: 10.1371/journal.pone.0139539
- **主要な知見**：インド8地域料理すべてで negative pairing（共有が多い食材対ほど共起が少ない）。使用頻度がパターンを決める中心的要因で、スパイス類が負方向、乳製品が正方向に寄与した。
- **適用範囲と限界**：レシピ統計のみで官能評価はなし。
- **何に使えるか**：「類似＝好相性」が普遍則でないことの反証。お茶（東アジア起源の飲料）とチョコレートの組み合わせで共有化合物論を素朴に適用できない根拠。
- **確認手段**：PLOS ONE出版社ページ。

### 2-3Makinei & Hazarika 2022
- **書誌情報**：Makinei LV, Hazarika MK. Flavour network-based analysis of food pairing: Application to the recipes of the sub-cuisines from Northeast India. *Current Research in Food Science* 5:1038–1046 (2022). DOI: 10.1016/j.crfs.2022.05.015
- **主要な知見**：北東インド8地域料理に同手法を適用し、大半で negative pairing を再現。スパイスの多用と乳製品使用の少なさが理由とされた。
- **適用範囲と限界**：2-2 の追試的位置づけ。レシピ統計の範囲。
- **何に使えるか**：ネットワーク的ペアリング傾向が地域料理の「指紋」として安定することの根拠。産地・地域で傾向が変わるという、産地軸表示の間接的裏付け。
- **確認手段**：PMC全文（PMID: 35789802）。

### 2-4Kort, Nijssen, van Ingen-Visscher & Donders 2010
- **書誌情報**：Kort M, Nijssen B, van Ingen-Visscher K, Donders J. Food pairing from the perspective of the 'Volatile Compounds in Food' database. In: *Expression of Multidisciplinary Flavour Science: Proceedings of the 12th Weurman Flavour Research Symposium* (2010), pp.589–592. DOIなし。
- **主要な知見**：7食材（洋梨・トマト・じゃがいも・カカオ／チョコレート・牛肉・カリフラワー・アニス）をピューレ状にして全組合せを50名が評価。共有揮発成分の割合が高い組合せほど好まれたわけではなく、著者らはこの実験条件では food pairing theory は棄却されるとした。
- **適用範囲と限界**：査読ジャーナル論文ではなく会議録。冷たいピューレという通常と異なる提供形態が著者自身の挙げる限界。
- **何に使えるか**：「化合物共有→美味しい」を官能面から否定した初期の実証。表示の留保（推測ラベルの必要性）の根拠。
- **確認手段**：会議録本文の転載＋2-6 の総括記述で照合。

### 2-5Spence 2020（批判的総説）
- **書誌情報**：Spence C. Food and beverage flavour pairing: A critical review of the literature. *Food Research International* 133:109124 (2020). DOI: 10.1016/j.foodres.2020.109124
- **主要な知見**：フレーバーペアリング熱の高まりは「今や信用を失った（now-discredited）food-pairing hypothesis」に一部駆動されたと明言し、食品×飲料のペアリング原理を認知的／知覚的の二分法で整理し直すことを提案。知覚的戦略（similarity, contrast, harmony, emergence, modulation）は類似性による予測としては最終的に不成功だと結論する（§7-4 の確認記録も参照）。
- **適用範囲と限界**：批判的レビューであり、ペアリング自体の否定ではない。認知的／知的戦略（文化・地理的一致）は従来型ペアリングとして認める立場。
- **何に使えるか**：アプリの「rule-based、スコアなし、探索的／根拠不足ラベル」という表示方針の最も直接的な学術的裏付け。「共有化合物が多い＝合う」と断定する表示を避け、「知的／文化的根拠」と「知覚的相互作用」を分けて表示する方針を直接支持する。
- **確認手段**：PubMed（PMID: 32466920）。

### 2-6Galmarini 2020（方法論レビュー）
- **書誌情報**：Galmarini MV. The role of sensory science in the evaluation of food pairing. *Current Opinion in Food Science* 33:149–155 (2020). DOI: 10.1016/j.cofs.2020.05.003
- **主要な知見**：ペアリングを「レシピ内の食材配置／食品同士・食品×飲料の組合せ／食事全体」の3層に分け、各層で使われてきた官能手法（記述分析、TDS、消費者嗜好等）を整理。定義自体が文献間で揺れていることを問題として示す。de Klepper (2011) の定義と Food Pairing Theory（2002, Blumenthal & Benzi）の出典関係もここで確認できる。
- **適用範囲と限界**：方法論の整理であり、特定ペアの効果を示すものではない。
- **何に使えるか**：お茶×チョコレートを「食品×飲料の組合せ」層の現象として位置づけ、評価語彙（調和・支配・複雑さ等）を借りる際の方法論的根拠。アプリの「ペアリング」概念の定義域を明示する際の典拠。
- **確認手段**：著者所属機関（UCA）リポジトリの受理原稿＋ScienceDirect誌目次。

### 2-7Rune, Münchow & Perez-Cueto 2021（系統的レビュー）
- **書誌情報**：Rune CJB, Münchow M, Perez-Cueto FJA. Systematic Review of Methods Used for Food Pairing with Coffee, Tea, Wine, and Beer. *Beverages* 7(2):40 (2021). DOI: 10.3390/beverages7020040
- **主要な知見**：Web of Science／ScienceDirect／Scopus を系統検索（PRISMA準拠）し、実験デザイン＋記述分析／消費者嗜好分析を持つ研究は計24件のみ。コーヒーを対象にした研究は2件のみで、茶×食品は Donadini & Fumi 2014（チョコレート）と Sato & Kinugasa 2019（かつおだし）の2件のみ。組合せ選定の根拠が示されない研究が多く、評価法の「gold standard」は存在しない。科学的要因（芳香類似性・基本味・コク）を操作した研究は3件だけだった。
- **適用範囲と限界**：2021年時点の系統検索の範囲。
- **何に使えるか**：**「茶×チョコレートの直接研究は極めて少ない」という空白の明示**に使える一次傍証。評価尺度を統一できない以上、アプリ内スコア化は避けるべきという根拠にもなる。
- **確認手段**：MDPI出版社ページ（抄録・方法・収録研究表）。

### 2-8Harrington & Hammond 2005
- **書誌情報**：Harrington RJ, Hammond R. The Direct Effects of Wine and Cheese Characteristics on Perceived Match. *Journal of Foodservice Business Research* 8(4):37–（終了頁は未確認）(2005). DOI: 10.1300/J369v08n04_04
- **主要な知見**：訓練パネルが6種ワイン×4種チーズの「マッチ度」を評価。ワインの甘味水準が全チーズに共通してマッチ度に影響し、その他の関係はチーズ種ごとに異なった。チーズ側要素の効果は全体検定では有意でなくワイン種依存だった。
- **適用範囲と限界**：「マッチ」は一方の属性だけで決まらないことの実証。
- **何に使えるか**：表示を「甘味・ボディ等の要素別」に分解する要素階層モデルの根拠。お茶の甘味感・渋味とチョコレートの甘味・脂肪の要素対応表の類推元。
- **確認手段**：EBSCOの出版社メタデータ＋アブストラクト。

### 2-9Harrington & Seo 2015
- **書誌情報**：Harrington RJ, Seo H-S. The Impact of Liking of Wine and Food Items on Perceptions of Wine–Food Pairing. *Journal of Foodservice Business Research* 18(5):489–501 (2015). DOI: 10.1080/15378020.2015.1093455
- **主要な知見**：2×2デザイン（Ruby Port／Sauvignon Blanc × ヤギチーズ／ダークチョコレート）。4組合せ中3つで、単品のワイン嗜好・食品嗜好の少なくとも一方がペア嗜好と正の関係を示した。強く好まれる食品（チョコレート）は、組み合わせたワインの嗜好評点を下げる場合があることも他レビューで要約されている。
- **適用範囲と限界**：チョコレートを含む数少ないワイン×食品の実証だが、組合せ数は4のみ。
- **何に使えるか**：「単品で人気のチョコレートだからペアも良いとは限らない」という表示上の注意の根拠。
- **確認手段**：AGRISのアブストラクト＋2-7 の収録表で照合。

### 2-10Bastian, Collins & Johnson 2010
- **書誌情報**：Bastian SEP, Collins C, Johnson TE. Understanding consumer preferences for Shiraz wine and Cheddar cheese pairings. *Food Quality and Preference* 21(7):668–678 (2010). DOI: 10.1016/j.foodqual.2010.02.002
- **主要な知見**：市販シラーズ10種×チェダー1種、消費者54名＋専門家22名、記述分析パネル7名。チーズ先行摂取は全ワインでフレーバー持続と渋味を下げ、タンニンの質感を「絹のように」変えた。全ワインがチーズを支配したが、支配が最強のワインが最低評価、2番目が最高評価であり、結論としてペア嗜好は支配関係より**ワイン単品嗜好に駆動される**とされた。
- **適用範囲と限界**：単一チーズ種での知見。支配度の解釈は2-11 と対照的であり、単純化できない。
- **何に使えるか**：「支配（dominance）」を丸ごと悪とする単純表示への反証と、単品嗜好の交絡を明示すべきことの根拠（§5 E-1 にも参照あり）。
- **確認手段**：ScienceDirectアブストラクト（検索経由）＋PMC収録論文の参考文献表記でDOI照合。§5 では論文PDF転載でアブストラクト全文も確認。

### 2-11Kustos, Heymann, Jeffery, Goodman & Bastian 2020
- **書誌情報**：Kustos M, Heymann H, Jeffery DW, Goodman S, Bastian SEP. Intertwined: What makes food and wine pairings appropriate? *Food Research International* 136:109463 (2020). DOI: 10.1016/j.foodres.2020.109463
- **主要な知見**：シラーズ4種×複合食品4種＝16組合せを記述分析し、6ペアを米国消費者108名で検証。「適切な」ペアではフレーバー強度が単品より上がり、嗜好・知覚的複雑さ・支払意向価格と正相関したが、バランスとは負相関——すなわち**完全な均衡よりワインのわずかな支配が好まれた**。ペアによる嗜好上昇はワイン側にのみ見られ食品側には見られなかった。
- **適用範囲と限界**：2-17（Paulsen の JAB）と緊張関係にある。バランスの是非は条件依存。
- **何に使えるか**：「バランスが良い＝好まれる」という素朴な前提への修正。「バランス」表示を使うなら、わずかな非対称が好まれる場合がある旨の注記根拠。
- **確認手段**：ScienceDirectアブストラクト（検索経由）。

### 2-12Nygren, Gustafsson, Haglund, Johansson & Noble 2001
- **書誌情報**：Nygren IT, Gustafsson I-B, Haglund Å, Johansson L, Noble AC. Flavor changes produced by wine and food interactions: Chardonnay wine and Hollandaise sauce. *Journal of Sensory Studies* 16(5):461–470 (2001). DOI: 10.1111/j.1745-459X.2001.tb00313.x
- **主要な知見**：シャルドネ3種（無樽／酸添加／樽熟成）×バター量2水準のオランデーズソース。ソース→ワイン方向の影響が逆方向より大きく、高脂肪ソースでやや増強された。ワインの酸味・苦味はソース後に低下、バター様フレーバーは上昇、樽のトースト感は低下した。後年のレビューで「食品×ワイン相互作用を実験的に扱った最初期の査読研究」と位置づけられる。
- **適用範囲と限界**：対象はワイン×ソースであり、お茶への適用は類推。
- **何に使えるか**：脂肪（チョコレートのカカオバター）が飲料の酸味・苦味・渋味を弱めるという**作用方向の類推の原点**。お茶の渋味・苦味がチョコレートの脂肪で和らぐという表示仮説の隣接根拠（M7 の補強）。
- **確認手段**：Wiley出版社ページ。

### 2-13Nygren, Gustafsson & Johansson 2002
- **書誌情報**：Nygren IT, Gustafsson I-B, Johansson L. Perceived flavour changes in white wine after tasting blue mould cheese. *Food Service Technology* 2(4):163–171 (2002). DOI: 10.1046/j.1471-5740.2002.00048.x
- **主要な知見**：訓練評価者が辛口白ワイン5種をブルーチーズ2種の前後で記述分析。全ワインで、チーズ後に大半のフレーバー強度と酸味が低下した。
- **適用範囲と限界**：書誌の一部は二次照合を含む。食品→飲料の抑制方向の相互作用を定量化した初期例。
- **何に使えるか**：「先に食べるものが後の飲料の知覚を変える」という順序効果（sequential tasting）の根拠。
- **確認手段**：著者ページ経由のアブストラクト＋後年の総説・2-7 の参考文献表記で書誌照合。

### 2-14Madrigal-Galan & Heymann 2006
- **書誌情報**：Madrigal-Galan B, Heymann H. Sensory effects of consuming cheese prior to evaluating red wine flavor. *American Journal of Enology and Viticulture* 57(1):12–22 (2006). DOIは当時付与されておらず未確認。
- **主要な知見**：赤ワイン8種×チーズ8種の順次試飲で、チーズ先行はワインの渋味・オーク・ベリー様香等の強度を下げたが、バター様香は下がらなかった。チーズ種によらない全般的抑制が示唆され、「魔法のペアリング」ではなく混合物の一般的抑制として解釈される（§5 E-2 では訓練パネル11名の記述分析としてアブストラクト転載を複数経路で照合）。
- **適用範囲と限界**：アブストラクト原文の直接表示ではないため要約は照合ベース。
- **何に使えるか**：脂肪＋タンパク質食品が飲料の渋味を抑える現象がワインでも再現することの根拠。お茶のタンニン様渋味×カカオバターの相互作用仮説の補強（類推、M7）。
- **確認手段**：2-7 の収録表＋Nygren et al. 2017 本文中の要約＋ワイン多感覚レビューの要約で照合。

### 2-15Donadini, Spigno, Fumi & Pastori 2008
- **書誌情報**：Donadini G, Spigno G, Fumi MD, Pastori R. Evaluation of ideal everyday Italian food and beer pairings with regular consumers and food and beverage experts. *Journal of the Institute of Brewing* 114(4):329–342 (2008). DOI: 10.1002/j.2050-0416.2008.tb00777.x
- **主要な知見**：ビール18種×イタリア日常料理9種を消費者51名と専門家7名が9点尺度で評価。大半の料理は大半のビールと合わず、消費者と専門家で「理想」の選択が系統的に異なった。消費者のマッチ判断はビール単品嗜好と正相関し、性別・年齢の影響は弱〜中程度。
- **適用範囲と限界**：専門家推奨と消費者嗜好の乖離の実証。
- **何に使えるか**：表示を「専門家型（要素分析）」と「消費者嗜好型」に区別して出す根拠。
- **確認手段**：アブストラクト全文の転載＋Mendeleyの出版社メタデータ。

### 2-16Harrington, Miszczak & Ottenbacher 2008
- **書誌情報**：Harrington RJ, Miszczak DC, Ottenbacher MC. The impact of beer type, pizza spiciness and gender on match perceptions. *PASOS. Revista de Turismo y Patrimonio Cultural* 6(2):173–188 (2008). DOI: 10.25145/j.pasos.2008.06.014
- **主要な知見**：ラガー／エール／スタウト×辛くないピザ／辛いピザの探索的研究。非辛ピザでは元々のビール嗜好が選択を支配したが、辛いピザではフルフレーバー・フルボディのスタイルが選択を規定した。食品側の刺激強度（辛さ）が飲料選択の決定要因を切り替える。
- **適用範囲と限界**：探索的研究であり効果量の一般化はできない。
- **何に使えるか**：お茶側の渋味・苦味強度やチョコレート側のカカオ強度が強い条件では、単品嗜好ではなく「強度への対抗」が支配的になる可能性の類推根拠。
- **確認手段**：学会誌公式ページ。

### 2-17Paulsen, Rognså & Hersleth 2015
- **書誌情報**：Paulsen MT, Rognså GH, Hersleth M. Consumer perception of food–beverage pairings: The influence of unity in variety and balance. *International Journal of Gastronomy and Food Science* 2(2):83–92 (2015). DOI: 10.1016/j.ijgfs.2014.12.003
- **主要な知見**：基本味を因子化したスープ×クラフトビールをモデル系に消費者評価。どちらか一方の支配は嗜好と調和感を有意に下げ、スープの支配は複雑さも下げた。複雑さは調和感が高いときに限り嗜好と強く相関した。相対バランスを測る "just about balanced (JAB)" 尺度を導入した研究。
- **適用範囲と限界**：モデル系（スープ×ビール）。2-11 との緊張関係を併記すべき。
- **何に使えるか**：**「バランス」表示の最も操作的な根拠**。お茶×チョコレートでも「どちらが支配しているか」を JAB 的に表示する設計の出典。
- **確認手段**：アブストラクト（ResearchGate の出版社原稿転載）。

### 2-18Donadini, Fumi & Lambri 2013（チーズ×ビール）
- **書誌情報**：Donadini G, Fumi MD, Lambri M. A preliminary study investigating consumer preference for cheese and beer pairings. *Food Quality and Preference* 30(2):217–228 (2013). DOI: 10.1016/j.foodqual.2013.05.012
- **主要な知見**：ビール4スタイル×チーズ4種＝16ペアを消費者80名が自然な消費環境で評価。ペア嗜好への影響は大きい順にビール嗜好＞チーズ種＞フレーバーの支配関係＞ビール種＞相互作用。パルミジャーノ先行摂取はビールの酸味・果実香・フェノール香・アルコール感・炭酸・甘味の知覚強度を変調させ、ビール嗜好を上げた。
- **適用範囲と限界**：脂肪・塩味を持つ固形食品が飲料の知覚プロファイルを変えることの、ワイン以外での再現例。
- **何に使えるか**：チョコレート先行／お茶先行の非対称性を表示する際の類推根拠（§5 E-5 にも参照あり）。
- **確認手段**：著者所属大学（Università Cattolica）公式出版物ページ。

### 2-19Eschevins, Giboreau, Allard & Dacremont 2018
- **書誌情報**：Eschevins A, Giboreau A, Allard T, Dacremont C. The role of aromatic similarity in food and beverage pairing. *Food Quality and Preference* 65:18–27 (2018). DOI: 10.1016/j.foodqual.2017.12.005
- **主要な知見**：レモン清涼飲料×風味付け乳製品（実験1）と、レモン／スモーク風味ビール×塩味ヴェリーヌ（実験2）、各約50名。実験1では香りを共有するペアが好まれ、調和・均質性が上がり複雑さが下がった。実験2では効果は部分的で、レモンビールでは調和・均質性のみ、スモークビールでは複雑さ低下のみで、嗜好への効果は無いか限界的だった。**芳香類似性の効果は「調和感を介して条件付きで」嗜好に効く**というモデルが提案された。
- **適用範囲と限界**：効果は条件依存であり、「類似＝必ず好まれる」ではない。学位論文版は §7-9。
- **何に使えるか**：お茶とチョコレートの共通香（花香・果実香の共有等）を表示する際の最も近い実験的根拠。正確な主張範囲は「調和感が上がる」まで。
- **確認手段**：APA PsycNet。

### 2-20Eschevins, Giboreau, Julien & Dacremont 2019
- **書誌情報**：Eschevins A, Giboreau A, Julien P, Dacremont C. From expert knowledge and sensory science to a general model of food and beverage pairing with wine and beer. *International Journal of Gastronomy and Food Science* 17:100144 (2019). DOI: 10.1016/j.ijgfs.2019.100144
- **主要な知見**：ワイン専門家10名・ビール専門家10名へのインタビューから15の共通ペアリング原理を抽出し、知覚的（perceptual）／概念的（conceptual）／感情的（affective）／その他の4カテゴリに整理し、ワイン・ビール共通の一般モデルを提示。ワインは概念的原理、ビールは個人的嗜好に寄る傾向も示された。
- **適用範囲と限界**：内容の骨格は 2-7 の抽出表で照合したもので、アブストラクト原文の直接表示ではない。
- **何に使えるか**：ペアリング表示を「知覚的根拠（官能）／概念的根拠（産地・伝統）／嗜好的根拠」にタグ分けする分類枠組みの出典。根拠種別ラベルの設計に直接使える。
- **確認手段**：著者所属機関の出版物リストで書誌・DOI を確認、内容は 2-7 で照合。

### §2 の参照項目（主掲載は §5）
- Donadini, Fumi & Lambri 2012（チョコ×飲料18種、紅茶を含む）→ §5 A-1
- Donadini & Fumi 2014（お茶×チョコレート直接研究）→ §5 A-2
- Luchian et al. 2023（スパークリングワイン×チョコ）→ §5 D-1
- Sato & Kinugasa 2019（緑茶×鰹だし）→ §5 B-2
- Romeo-Arroyo et al. 2023（茶×バタークッキー）→ §5 B-1

### 2-21Bastian et al. 2009
- **書誌情報**：Bastian SEP et al. Comparisons between Australian consumers' and industry experts' perceptions of ideal wine and cheese combinations. *Australian Journal of Grape and Wine Research* 15(2):175–184 (2009). DOI: 10.1111/j.1755-0238.2008.00043.x
- **主要な知見**：※要旨断片の範囲：消費者46名は専門家の8組合せ中6つに同意した。
- **適用範囲と限界**：アブストラクトの主張範囲まで精査していない。採用前に精査が必要。

### 2-22Nygren, Nilsen & Öström 2017
- **書誌情報**：Nygren T, Nilsen AN, Öström Å. Dynamic changes of taste experiences in wine and cheese combinations. *Journal of Wine Research* 28(2):105–122 (2017). DOI: 10.1080/09571264.2017.1284655
- **主要な知見**：※要旨断片の範囲：甘い白ワイン×塩味ブルーチーズが高評価・無支配だった。
- **適用範囲と限界**：アブストラクト精査未了。動的（TDS系）評価の候補として次回精査可能。

### 2-23Harrington, McCarthy & Gozzi 2010
- **書誌情報**：Harrington RJ, McCarthy M, Gozzi M. Perceived match of wine and cheese and the impact of additional food elements: A preliminary study. *Journal of Foodservice Business Research* 13:311–330 (2010).
- **主要な知見**：書誌のみ。内容の精査は未実施。
- **適用範囲と限界**：採用前にアブストラクト一次確認が必要。

### 2-24Jain, Rakhi & Bagler 2015（arXiv版）
- **書誌情報**：Spices form the basis of food pairing in Indian cuisine. arXiv:1502.03815 (2015).
- **主要な知見**：arXiv ページでタイトル・著者・要旨は確認できたが、査読誌掲載版としての書誌は確認できなかった。
- **適用範囲と限界**：査読済みの PLoS ONE 版（2-2）のみを採用し、本件は未確認（プレプリント）として扱う。

### 2-25科研費報告書「ティーペアリングの科学的解明による茶と和食との相性の検討」
- **書誌情報**：味覚センサーによる WASH／SUPPLEMENT／SHARE 分類を報告したとされる日本の研究報告書（shigaku.go.jp 収載のPDF。§7 でも独立に言及あり）。
- **主要な知見**：報告書PDFの内容の一部は確認できたが、著者・正式な報告書名・年を一次レコードで確定できず、査読論文としての書誌も確認できない。
- **適用範囲と限界**：WASH／SUPPLEMENT／SHARE の3分類は表示設計の参考概念として有望だが、原典確認まではアプリ表示の根拠に使わない。

---

## §3 渋味・収れん感の科学／味の混合相互作用

適用上の注意（§3 全体）：渋味緩和の根拠は大部分がワイン／モデル系であり、お茶×チョコへの適用は「推測」レベルの表示が適切。多糖効果は構造依存で逆転しうる（3-9）ため一方向の断定は避けること。塩による苦味抑制（3-13、3-14）と甘味×脂肪の嗜好増強（3-22）はヒト官能の直接証拠があり、比較的強い根拠として使える。

### A. 渋味・収れん感

#### 3-1Charlton et al. 2002
- **書誌情報**：Charlton AJ, Baxter NJ, Khan ML, Moir AJG, Haslam E, Davies AP, Williamson MP. Polyphenol/peptide binding and precipitation. *J Agric Food Chem* 2002;50(6):1593–1601. DOI: 10.1021/jf010897z
- **主要な知見**：ポリフェノールは塩基性唾液プロリンリッチタンパク質（PRP）との相互作用で茶・ワインの渋味と口当たりを担う。結合はポリフェノール環の疎水性平面へのスタッキングが主体で、多点協同結合で強まる。ペプチドがポリフェノールで十分に被覆されると架橋・二量化して沈殿する。結合は高温で弱まり、pH 3.8–6.0では影響を受けない。
- **適用範囲と限界**：モデル系の物理化学的知見。高温で結合が弱まる点は実飲料への外挿に留保がいる。
- **何に使えるか**：「渋味＝唾液タンパク質との結合・沈殿」というペアリング表示の中核根拠。「温かいお茶では渋味の出方が変わる」説明の候補。
- **確認手段**：PubMed（PMID 11879042）。

#### 3-2de Freitas & Mateus 2001
- **書誌情報**：de Freitas V, Mateus N. Structural features of procyanidin interactions with salivary proteins. *J Agric Food Chem* 2001;49(2):940–945. DOI: 10.1021/jf000981z
- **主要な知見**：ヒト唾液をα-アミラーゼ画分とPRP画分に分け、ネフェロメトリーで相互作用を測定。フラバン-3-オールの立体化学が相互作用を左右し（(+)-カテキン＞(−)-エピカテキン）、C(4)–C(8)結合型二量体はC(4)–C(6)型より活性が高く、重合度・ガロイル化が大きいほどタンパク質との相互作用が強い傾向を示した。
- **適用範囲と限界**：in vitro の相互作用測定であり、知覚強度への換算ではない。
- **何に使えるか**：「重合度／ガロイル化が高いポリフェノールほど渋味が強い」という構造→渋味の推測根拠。カカオのプロシアニジンにも直接つながる系統。
- **確認手段**：ACS出版社ページ。

#### 3-3Soares, Mateus & de Freitas 2007
- **書誌情報**：Soares S, Mateus N, de Freitas V. Interaction of different polyphenols with bovine serum albumin (BSA) and human salivary alpha-amylase (HSA) by fluorescence quenching. *J Agric Food Chem* 2007;55(16):6726–6735. DOI: 10.1021/jf070905x
- **主要な知見**：カテキン、エピカテキンガレート、プロシアニジンB4、B2ガレート、オリゴマー、タンニン酸等の結合を比較し、一般に分子量が大きくガロイル基があるほど結合親和性が高かった。同じポリフェノールでもタンパク質の三次元構造によって消光効果が異なった。
- **適用範囲と限界**：モデルタンパク質（BSA、唾液α-アミラーゼ）での蛍光消光測定。
- **何に使えるか**：3-2 と合わせ、「ガロイル化カテキン（EGCG等）が唾液タンパク質と強く結びつく」表示の裏付け。お茶側の成分差を渋味差に翻訳する根拠。
- **確認手段**：PubMed（PMID 17636939）。

#### 3-4Dinnella et al. 2009（唾液と渋味感受性）
- **書誌情報**：Dinnella C, Recchia A, Fia G, Bertuccioli M, Monteleone E. Saliva characteristics and individual sensitivity to phenolic astringent stimuli. *Chem Senses* 2009;34(4):295–304. DOI: 10.1093/chemse/bjp003
- **主要な知見**：被験者65名で、タンニン酸摂取前後の唾液タンパク質濃度・プロファイル・ヘイズ形成能の回復速度に個人差があった。基礎唾液状態を速やかに維持できる群は渋味刺激への感受性が低かった。著者らは、多くの人が唾液タンパク質濃度を保ちながら食事性タンニンを捕捉・不活化できると示唆する（§6 では「53名は鈍感、12名は敏感」と群構成も確認）。
- **適用範囲と限界**：タンニン酸モデルでの知見。個人差の存在の根拠であり、個人の感受性を予測するものではない。
- **何に使えるか**：「渋味の感じ方には唾液側の個人差がある」ため、ペアリングの渋味表示を絶対値でなく幅・個人差前提で書く根拠（§6 B-1 にも参照あり）。
- **確認手段**：PubMed（PMID 19193699）。

#### 3-5Dinnella et al. 2010（反復刺激とキャリーオーバー）
- **書誌情報**：Dinnella C, Recchia A, Vincenzi S, Tuorila H, Monteleone E. Temporary modification of salivary protein profile and individual responses to repeated phenolic astringent stimuli. *Chem Senses* 2010;35(1):75–85. DOI: 10.1093/chemse/bjp084
- **主要な知見**：被験者77名を唾液応答で低／中／高応答群に分類。高応答群では反復刺激後に唾液タンパク質が強く減少し、タンニン酸（1.4 g/L）4回連続曝露で渋味評定が積み上がるキャリーオーバー効果が中・高応答群で見られた（低応答群では見られず）。
- **適用範囲と限界**：キャリーオーバーは応答群依存であり、全員に起きるわけではない（§6 B-2 は書誌のみ確認として同論文を別途記録）。
- **何に使えるか**：「一口目より二口目・三口目で渋味が積み上がる」表示の直接根拠（M7 の積み上がり部分の補強）。チョコ→お茶→チョコの反復試食設計への注意喚起にも使える。
- **確認手段**：フィレンツェ大学リポジトリ（Flore）掲載の出版社版面・アブストラクト。

#### 3-6Ployon et al. 2018（粘膜ペリクルとbPRP）
- **書誌情報**：Ployon S, Morzel M, Belloir C, Bonnotte A, Bourillot E, Briand L, Lesniewska E, Lherminier J, Aybeke E, Canon F. Mechanisms of astringency: Structural alteration of the oral mucosal pellicle by dietary tannins and protective effect of bPRPs. *Food Chem* 2018;253:79–87. DOI: 10.1016/j.foodchem.2018.01.141（PMID 29502847）
- **主要な知見**：細胞モデルで、タンニン（EGC、EGCG）が口腔粘膜ペリクルのムチンMUC5Bを凝集させ、その程度は濃度とガロイル化で増大し、EGCG 3 mMでは摩擦力も上昇した。塩基性PRP（bPRP）存在下では凝集がほぼ無添加条件に近づき、bPRPがタンニンを捕捉して粘膜ペリクルを保護することが示された。低濃度（0.05 mM、検出閾値以下）では変化なし。
- **適用範囲と限界**：細胞モデル。濃度依存であり、実飲料濃度での再現は別問題。
- **何に使えるか**：沈殿説だけでなく「粘膜表面の潤滑層が乱れて摩擦が上がる」機構を併記する根拠（M7・M8 の機構補強）。唾液タンパク質が先にタンニンを受け止める＝食品側タンパク質による緩和推測の橋渡し。
- **確認手段**：PubMed書誌・DOI・PMID＋出版社版PDF抜粋でアブストラクト確認。

#### 3-7Prinz & Lucas 2000
- **書誌情報**：Prinz JF, Lucas PW. Saliva tannin interactions. *J Oral Rehabil* 2000;27(11):991–994. DOI: 10.1046/j.1365-2842.2000.00578.x
- **主要な知見**：in vitroでタンニン酸がヒト唾液の潤滑性を有意に低下させた（粘度を下げ、摩擦を上げる）。著者らは渋味が触覚的現象であることを支持し、この効果は唾液PRPの存在に依存すると述べる。
- **適用範囲と限界**：in vitro の潤滑性測定。
- **何に使えるか**：「渋味＝乾燥・ざらつき感」という触感表現の根拠。チョコの脂肪による潤滑回復（§4 の脂肪系根拠）と対にして説明できる。
- **確認手段**：PubMed（PMID 11106991）。

#### 3-8Carvalho et al. 2006（ペクチン系多糖）
- **書誌情報**：Carvalho E, Mateus N, Plet B, Pianet I, Dufourc EJ, de Freitas V. Influence of wine pectic polysaccharides on the interactions between condensed tannins and salivary proteins. *J Agric Food Chem* 2006;54(23):8936–8944. DOI: 10.1021/jf061835h
- **主要な知見**：ブドウ種子タンニンと唾液タンパク質の凝集に対し、ワイン由来ペクチン系多糖を添加。最も酸性の強いアラビノガラクタンタンパク質画分は両タンパク質との凝集形成を阻害し、ラムノガラクツロナンIIはα-アミラーゼに対してのみ同効果を示した。効果はワイン中濃度で現れた。
- **適用範囲と限界**：ワイン系モデルである旨の留保付き。3-9 の逆転知見と必ず対で使うこと。
- **何に使えるか**：「多糖類がタンニン–唾液タンパク質の凝集を邪魔して渋味を和らげうる」の直接根拠。お茶・果実由来ペクチンを含む組み合わせの緩和推測に使える。
- **確認手段**：PubMedアブストラクト（複製経由）＋欧州特許調査報告に引用されたDOI・頁で書誌確認。

#### 3-9Weilack, Mehren, Schieber & Weber 2023（多糖効果の逆転）
- **書誌情報**：Weilack I, Mehren L, Schieber A, Weber F. Grape-derived pectic polysaccharides alter the tannin and pigment composition of Cabernet Sauvignon red wines. *Curr Res Food Sci* 2023;6:100506. DOI: 10.1016/j.crfs.2023.100506
- **主要な知見**：市販赤ワインから多糖を除いた対照と比較。低分子でエステル化度の低いペクチン（RG-II、低エステル化ポリガラクツロン酸）はアントシアニンと可溶性複合体を作り、タンニンのタンパク質沈殿を6–13%減らした。逆に高分子・高エステル化ペクチンは色素とタンニンの沈殿性を1.1–1.9倍に高めた。
- **適用範囲と限界**：多糖の構造次第で効果が逆転する。ワインでの化学的測定であり官能の直接証拠ではない。
- **何に使えるか**：3-8 の単純化を避けるための重要論文。「多糖＝常に渋味緩和」ではなく構造依存と明記する根拠。
- **確認手段**：PMC全文（PMID 37188318）。

#### 3-10Jöbstl et al. 2005（茶クリーム）
- **書誌情報**：Jöbstl E, Fairclough JPA, Davies AP, Williamson MP. Creaming in black tea. *J Agric Food Chem* 2005;53(20):7997–8002. DOI: 10.1021/jf0506479
- **主要な知見**：茶クリームは茶が冷めると生じる沈殿で、X線散乱とNMRで解析した結果、濃度が高いほど生成が早く粒子が大きく、テアフラビンとカルシウムが生成を促進した。テアフラビンが約3 nmのナノクラスター形成を開始し、カフェインはその隙間を埋めてクリームの量を増やす。
- **適用範囲と限界**：紅茶の物理化学的現象。味への影響の定量化ではない。
- **何に使えるか**：「冷めたお茶でポリフェノール複合体が析出し、味わいが変わる」表示の根拠。冷たいペアリング／アイスティー×チョコの注意点として使える。
- **確認手段**：PubMed（PMID 16190662）。

#### 3-11Charlton et al. 2000（テアフラビン×カフェイン複合体）
- **書誌情報**：Charlton AJ, Davis AL, Jones DP, Lewis JR, Davies AP, Haslam E, Williamson MP. The self-association of the black tea polyphenol theaflavin and its complexation with caffeine. *J Chem Soc, Perkin Trans 2* 2000:317–322. DOI: 10.1039/A906380C
- **主要な知見**：NMRにより、カフェインはスタックを形成し（Ks=7.9 L/mol, 300 K）、テアフラビンは安定な二量体を形成した（Ks=230 L/mol）。テアフラビン1分子にカフェイン2分子が逐次的に結合し、この複合化が茶クリーム形成の主因と考えられると述べる。
- **適用範囲と限界**：溶液系の定量的結合研究。
- **何に使えるか**：3-10 と対で、紅茶ポリフェノール×カフェイン複合体の定量的根拠。お茶単独でもポリフェノール同士・カフェインとの複合体形成が起きることの説明に使える。
- **確認手段**：RSC出版社ページ。

#### 3-12Ishizu, Tsutsumi & Sato 2016（クリームダウン機構）
- **書誌情報**：Ishizu T, Tsutsumi H, Sato T. Mechanism of creaming down based on chemical characterization of a complex of caffeine and tea catechins. *Chem Pharm Bull* 2016;64(7):676–686. DOI: 10.1248/cpb.c16-00131
- **主要な知見**：定量¹H-NMRでクリームダウン沈殿を分析すると、ガロイル型カテキンが非ガロイル型より優先的に沈殿した。X線結晶解析ではEGCGはカフェインと2:2、ECGは2:4複合体を作り、芳香環が作る疎水性空間にカフェインが取り込まれるため疎水性が高まり沈殿しやすいと解釈された。EC（非ガロイル型）は1:1複合体でそのような空間を作らなかった。
- **適用範囲と限界**：緑茶でも起こる現象の機構研究。沈殿＝渋味成分の減少だが、官能変化の直接測定ではない。
- **何に使えるか**：「ガロイル型カテキンが多いお茶ほど冷やすと濁り・沈殿しやすい」という、渋味成分そのものが複合体化する話の裏付け。
- **確認手段**：PubMed（PMID 27373623）＋J-STAGE全文。

### B. 味の混合相互作用

#### 3-13Breslin & Beauchamp 1995（塩による苦味抑制）
- **書誌情報**：Breslin PAS, Beauchamp GK. Suppression of bitterness by sodium: variation among bitter taste stimuli. *Chem Senses* 1995;20(6):609–623. DOI: 10.1093/chemse/20.6.609
- **主要な知見**：各種塩と苦味物質（尿素、キニーネ、MgSO₄、カフェイン等）の二成分混合を評定。多くの場合、塩は苦味を抑制したが程度は化合物により異なり、塩味側は同等には抑制されなかった。尿素の苦味抑制の鍵はナトリウム／リチウムイオンであり、塩味の強さとは独立だったため、末梢レベルの成分が大きいと示唆する。
- **適用範囲と限界**：モデル混合系。カカオ苦味への外挿は推測扱いが必須。
- **何に使えるか**：「塩味が苦味を抑える」は一律でなく苦味化合物依存、という正確な留保付きで使える基礎論文。新規ルール候補「塩×苦味抑制」の主根拠。
- **確認手段**：PubMed（PMID 8788095）。

#### 3-14Breslin & Beauchamp 1997（Nature、風味増強の説明）
- **書誌情報**：Breslin PAS, Beauchamp GK. Salt enhances flavour by suppressing bitterness. *Nature* 1997;387(6633):563. DOI: 10.1038/42388（PMID 9177340）
- **主要な知見**：NaClは他の味を抑制するか無効であるのに風味を高めるという矛盾に対し、「塩は不快な味（苦味）を好ましい味（甘味）より選択的に抑制し、後者を際立たせる」という仮説を提示し、酢酸ナトリウム＋尿素＋スクロース混合系の実験で支持した。
- **適用範囲と限界**：仮説＋モデル系実験。実食品での一般化には留保。
- **何に使えるか**：塩キャラメル系チョコ×お茶など、「微量の塩味が苦味・渋味の角を取り、甘味を引き立てる」説明の原典として最適。
- **確認手段**：NCBI Bookshelf収載の書誌＋出版社引用情報で巻・頁・DOI を確認し、アブストラクト全文を確認。

#### 3-15Keast & Breslin 2003
- **書誌情報**：Keast RSJ, Breslin PAS. An overview of binary taste–taste interactions. *Food Qual Prefer* 2003;14(2):111–124. DOI: 10.1016/S0950-3293(02)00110-6
- **主要な知見**：二成分混合の心理物理学文献を総覧し、相互作用は各刺激の濃度–強度曲線上の位置（拡大／線形／圧縮相）で予測できると提案。一般化として、苦味は塩で抑制されるが塩味は苦味に影響されにくく、中〜高強度では甘味・苦味・酸味は互いに抑制し合う。ただし化合物特異的であることを強調する。
- **適用範囲と限界**：既存 M5 の根拠であり、本ラインでは再確認のみ。総説の一般化であり個別化合物への適用は濃度依存。
- **何に使えるか**：ペアリングの相互作用表示全般の「濃度依存・非対称」という設計原則の根拠。
- **確認手段**：Rutgers大学リポジトリの書誌＋原論文PDF。

#### 3-16Yamaguchi 1967（うま味相乗の原典）
- **書誌情報**：Yamaguchi S. The synergistic taste effect of monosodium glutamate and disodium 5′-inosinate. *J Food Sci* 1967;32(4):473–478. DOI: 10.1111/j.1365-2621.1967.tb09715.x
- **主要な知見**：MSGと5′-イノシン酸二ナトリウムの相乗現象を官能実験で定量化し、混合物の味強度に等しいMSG濃度を表す数理モデル（y = u + γuv、IMPのγ=1.218×10³）を提案した。
- **適用範囲と限界**：うま味相乗の定量化はグルタミン酸×核酸系に固有。お茶のテアニン等への直接換算はできない。
- **何に使えるか**：「グルタミン酸×核酸でうま味が単なる足し算を超える」の原典（M10・§5 B-2 の相乗表示の基準点）。
- **確認手段**：CiNii Research（書誌＋アブストラクト）。

#### 3-17Rifkin & Bartoshuk 1980（「真の相乗」の判定基準）
- **書誌情報**：Rifkin B, Bartoshuk LM. Taste synergism between monosodium glutamate and disodium 5′-guanylate. *Physiol Behav* 1980;24(6):1169–1172. DOI: 10.1016/0031-9384(80)90066-9
- **主要な知見**：従来の「相乗」報告は知覚強度の単純加算を超えるだけで、刺激加算（心理物理関数の非線形）を考慮すると見かけの可能性があると指摘。厳密な両基準で検証した結果、MSG×グアニル酸混合物は全被験者で真の相乗を示し、これは味覚では極めて稀な現象だと述べる。
- **適用範囲と限界**：3-16 の後の検証論文。「相乗」の語の使用基準。
- **何に使えるか**：「相乗」と表示する際の判定基準（単なる加算超えでは不十分）として、アプリの表現の厳密さの担保に使える。
- **確認手段**：PubMed（PMID 6251490）。

#### 3-18Ueda et al. 1990（コク味の起点）
- **書誌情報**：Ueda Y, Sakaguchi M, Hirayama K, Miyajima R, Kimizuka A. Characteristic flavor constituents in water extract of garlic. *Agric Biol Chem* 1990;54(1):163–169. DOI: 10.1271/bbb1961.54.163
- **主要な知見**：ニンニク水抽出物をスープに少量（0.1または0.4%）加えると、持続性・口当たりの広がり（mouthfulness）・厚みという特徴的なコク味が現れ、MSG＋IMP各0.05%のうま味溶液でも明確に認められた。鍵成分としてアリイン、(+)-S-メチル-L-システインスルホキシド、γ-L-グルタミル-S-アリル-L-システイン等の含硫化合物を同定した。
- **適用範囲と限界**：ニンニク抽出物・スープ系の知見。
- **何に使えるか**：「コク＝基本味の強さではなく、持続性・広がり・厚み」という定義の原点。まろやかさ／コク表示の用語定義の根拠（味わいの性格推測の語彙基盤）。
- **確認手段**：J-STAGE。

#### 3-19Ueda et al. 1997（グルタチオンのコク味）
- **書誌情報**：Ueda Y, Yonemitsu M, Tsubuku T, Sakaguchi M, Miyajima R. Flavor characteristics of glutathione in raw and cooked foodstuffs. *Biosci Biotechnol Biochem* 1997;61(12):1977–1980. DOI: 10.1271/bbb.61.1977
- **主要な知見**：グルタチオン（GSH）は基本味（甘・塩・酸・うま）の強度自体は変えずに風味特性を高め、その閾値はMSG＋IMPうま味溶液中で有意に低下した。うま味溶液とモデルビーフエキス（0.02% w/v）で持続性・mouthfulness・厚みのコク味を示した。
- **適用範囲と限界**：「コク味物質は単独では基本味を変えず、うま味のある文脈で効く」という条件付きの知見。
- **何に使えるか**：お茶×チョコ双方にうま味文脈がある場合のみコク推測を立てる設計に使える。
- **確認手段**：PubMed（PMID 9438977）＋J-STAGE。

#### 3-20Dunkel, Köster & Hofmann 2007（γ-グルタミルペプチド）
- **書誌情報**：Dunkel A, Köster J, Hofmann T. Molecular and sensory characterization of γ-glutamyl peptides as key contributors to the kokumi taste of edible beans (*Phaseolus vulgaris* L.). *J Agric Food Chem* 2007;55(16):6712–6719. DOI: 10.1021/jf071276u（PMID 17616213）
- **主要な知見**：ほぼ無味の豆抽出物をチキンブロスに加えるとmouthfulnessと複雑さが増し、うま味が長く持続した。鍵分子としてγ-L-グルタミル-L-ロイシン、γ-L-グルタミル-L-バリン、γ-L-グルタミル-L-システイニル-β-アラニンを同定。これらは水単独では閾値3.3–9.4 mmol/Lの漠然とした弱い渋味様感覚だが、NaCl＋MSG溶液やブロス中では検出閾値が大きく下がり（γ-グルタミル-システイニル-β-アラニンはグルタミン酸＋NaCl二成分系で1/32）、mouthfulness・複雑さ・持続性を顕著に高めた。
- **適用範囲と限界**：コク味が「呈味文脈依存」であることの分子レベルの根拠。
- **何に使えるか**：カカオにもペプチドが生じうる発酵食品である点と合わせ、コク推測は「推測（未検証）」ラベル付きで使う想定。
- **確認手段**：ACS出版社ページ。

#### 3-21Maruyama et al. 2012（CaSR）
- **書誌情報**：Maruyama Y, Yasuda R, Kuroda M, Eto Y. Kokumi substances, enhancers of basic tastes, induce responses in calcium-sensing receptor expressing taste cells. *PLoS ONE* 2012;7(4):e34489. DOI: 10.1371/journal.pone.0034489
- **主要な知見**：マウス舌組織標本で、コク味物質は味細胞の一部に細胞内Ca²⁺上昇を起こし、この応答はCaSR阻害剤NPS2143前処理で抑えられた。CaSR発現細胞はT1R3発現のうま味／甘味細胞とは別の集団だった。
- **適用範囲と限界**：動物組織の結果であり、ヒトのペアリング表示では「機構の示唆」レベルに留めるべきもの。
- **何に使えるか**：3-18〜3-20 の官能的知見に受容体レベルの裏付けを与える。
- **確認手段**：PMC。

#### 3-22Drewnowski & Greenwood 1983（甘味×脂肪の嗜好）
- **書誌情報**：Drewnowski A, Greenwood MRC. Cream and sugar: Human preferences for high-fat foods. *Physiol Behav* 1983;30(4):629–633. DOI: 10.1016/0031-9384(83)90232-9
- **主要な知見**：標準体重の被験者16名が乳・クリーム・砂糖の混合物20種を評定。甘味・脂肪感・クリーミーさの強度評定には混合抑制が見られなかった一方、快さは砂糖と脂肪の比率に強く依存し、脂肪含量が上がるほど快さが増し続け、砂糖添加が高脂肪刺激の快さを大きく高めた。一晩の絶食は知覚・快さに影響しなかった。
- **適用範囲と限界**：強度ではなく嗜好（hedonic）の相互作用である点が重要。
- **何に使えるか**：ミルクチョコレートの「甘味×脂肪で快さが上がる」説明の原典級根拠。ペアリングの「美味しさ」側表示に適合する。
- **確認手段**：ScienceDirectアブストラクト＋APA PsycNet書誌。

#### 3-23Cowart 1998（炭酸と味の質）
- **書誌情報**：Cowart BJ. The addition of CO2 to traditional taste solutions alters taste quality. *Chem Senses* 1998;23(4):397–402. DOI: 10.1093/chemse/23.4.397
- **主要な知見**：基本味とその二成分混合に炭酸を加えると、総味強度の増加は小さい一方、味の質の内訳（甘・塩・酸・苦・その他への配分）が特に甘味と塩味で大きく変化した。
- **適用範囲と限界**：モデル溶液系。機構としてCO₂の味覚系への直接作用と三叉神経–味覚相互作用の両方が残る。
- **何に使えるか**：発泡系（スパークリングティー等）×チョコの組み合わせで「強さより味のバランスが変わる」と表現する根拠。新規ルール候補「炭酸×味質変化」の主根拠。
- **確認手段**：PubMed（PMID 9759525）。

#### 3-24Chandrashekar et al. 2009（炭酸の味の分子基盤）
- **書誌情報**：Chandrashekar J, Yarmolinsky D, von Buchholtz L, Oka Y, Sly W, Ryba NJP, Zuker CS. The taste of carbonation. *Science* 2009;326(5951):443–445. DOI: 10.1126/science.1174601
- **主要な知見**：マウスで、酸味感受細胞が炭酸の味センサーとして働き、その表面の炭酸脱水酵素4（CA4）が主要なCO₂センサーであることを、細胞種特異的な遺伝子操作で示した。
- **適用範囲と限界**：動物データである旨の留保付き。3-23 の知覚現象の機構側の裏付け。
- **何に使えるか**：「炭酸＝酸味系の経路で感じられる」ため酸味・渋味との干渉を推測する際の根拠。
- **確認手段**：PubMed（PMID 19833970）。

#### 3-25Prescott & Stevenson 1995（カプサイシンによる抑制）
- **書誌情報**：Prescott J, Stevenson RJ. Effects of oral chemical irritation on tastes and flavors in frequent and infrequent users of chili. *Physiol Behav* 1995;58(6):1117–1127. DOI: 10.1016/0031-9384(95)02052-7
- **主要な知見**：唐辛子常用者・非常用者とも、カプサイシン存在下で甘味とフレーバー強度が抑制されたが、酸味は影響を受けなかった。灼熱感は非常用者の方が強く評定した。
- **適用範囲と限界**：甘味とフレーバーの評定相関が高く、フレーバー抑制は知覚的混同による可能性が示唆される。
- **何に使えるか**：スパイス系チョコ（チリチョコ等）×お茶で「辛味が甘味の感じ方を弱める」可能性を示す根拠。新規ルール候補「辛味×甘味抑制」。酸味は保たれるという非対称性も表示設計に使える。
- **確認手段**：APA PsycNet書誌＋出版社アブストラクト。

#### 3-26Cruz & Green 2000（thermal taste）
- **書誌情報**：Cruz A, Green BG. Thermal stimulation of taste. *Nature* 2000;403(6772):889–892. DOI: 10.1038/35002581
- **主要な知見**：舌の小領域を加温・冷却するだけで味感覚が生じた：舌前端を冷状態から温めると甘味、冷却すると酸味／塩味が誘発された。舌後部では温度と味の対応が異なった。
- **適用範囲と限界**：温度刺激単独の現象であり、実飲料の温度効果への換算ではない。
- **何に使えるか**：「お茶の温度で甘味の出方が変わる」表示の生理学的根拠。既存 M9（Talavera 2005）とは別系統の、温度×味の追加論文。
- **確認手段**：PubMed（PMID 10706285）。

#### 3-27Running, Craig & Mattes 2015（oleogustus）
- **書誌情報**：Running CA, Craig BA, Mattes RD. Oleogustus: The unique taste of fat. *Chem Senses* 2015;40(7):507–516. DOI: 10.1093/chemse/bjv036
- **主要な知見**：知覚マッピングにより、中〜長鎖の非エステル化脂肪酸（NEFA）の味は甘・酸・塩・苦と質的に異なることが示され、うま味との重なりは不慣れによるものと解釈された。短鎖脂肪酸は酸味に近い感覚を起こし、鎖長で感覚が変化した。
- **適用範囲と限界**：NEFAそのものの味は一般に不快とされる濃度域の話であり、チョコの脂肪感への直接外挿は推測扱いが必要。
- **何に使えるか**：カカオバターの口どけを「食感」だけでなく「脂肪酸の味覚シグナル」としても記述する際の根拠。
- **確認手段**：PubMed（PMID 26142421）。

### C. 書誌・要約のみ確認（一次ページ未到達）

#### 3-28Smith, June & Noble 1996
- **書誌情報**：Smith AK, June H, Noble AC. Effects of viscosity on the bitterness and astringency of grape seed tannin. *Food Qual Prefer* 1996;7:161–166. DOI: 10.1016/S0950-3293(96)00028-6
- **主要な知見**：※データベース要約の範囲：CMCで粘度を2→45 cPに上げると渋味の最大強度と持続時間が有意に低下し、最大到達時間は不変。苦味の最大強度は不変だが発現が遅延。アスパルテームの甘味追加は渋味に影響せず苦味最大強度を下げた。
- **適用範囲と限界**：PubMed／出版社ページでの直接確認は未了。登録前に出版社ページでの再確認を推奨。
- **何に使えるか**：「とろみ・粘度が渋味を和らげる」の数少ない直接の官能研究で、抹茶や濃いチョコレートドリンク系の説明に有用。新規ルール候補「粘度×渋味緩和」の候補根拠。

#### 3-29Fischer, Boulton & Noble 1994
- **書誌情報**：Fischer U, Boulton RB, Noble AC. Physiological factors contributing to the variability of sensory assessments: Relationship between salivary flow rate and temporal perception of gustatory stimuli. *Food Qual Prefer* 1994;5:55–64. DOI: 10.1016/0950-3293(94)90008-6（DOIは二次データベース経由の確認。§6 B-4 では DOI 未確認として記録）
- **主要な知見**：※データベース要約の範囲：低流量群は苦味・渋味とも最大到達時間が長く持続時間が長く、タンニン酸添加ワインでは最大強度も高かった。減衰は一次過程で、脱着が支配的と解釈される。
- **適用範囲と限界**：一次ページ未到達。採用時は一次確認を要する。
- **何に使えるか**：3-4、3-5（個人差）と合わせ、「唾液が少ないと渋味が長引く」時間知覚側の根拠。

#### 3-30Vidal et al. 2004
- **書誌情報**：Vidal S, Francis L, Williams P, Kwiatkowski M, Gawel R, Cheynier V, Waters E. The mouth-feel properties of polysaccharides and anthocyanins in a wine like medium. *Food Chem* 2004;85(4):519–525. DOI: 10.1016/S0308-8146(03)00084-0
- **主要な知見**：※二次経由の要約の範囲：両多糖画分ともモデルワインの「fullness」を有意に高め、RG-II画分は渋味関連属性の評定を有意に下げたが、中性多糖画分の効果は小さかった。アントシアニン画分はfullnessを高める傾向と渋味を高める傾向を示したが、後者は由来タンニンの混入の可能性あり。
- **適用範囲と限界**：一次ページ未到達。登録時は出版社ページでの再確認が前提。
- **何に使えるか**：3-8、3-9 と合わせた多糖系の官能側の裏付け候補。

#### 3-31Guinard, Pangborn & Lewis 1986
- **書誌情報**：Guinard J-X, Pangborn RM, Lewis MJ. The time-course of astringency in wine upon repeated ingestion. *Am J Enol Vitic* 1986;37(3):184–189.（DOIは確認できず）
- **主要な知見**：※二次資料が一致して伝える範囲：反復摂取で渋味の最大強度と持続時間が増すとされる。アブストラクトを一次情報で読めていない。
- **適用範囲と限界**：登録するなら原誌確認が必須。
- **何に使えるか**：3-5 と並ぶ「渋味の積み上がり」の古典候補。

### D. 未確認（登録不可）
- **Breslin 1996**（Interactions among salty, sour and bitter compounds. *Trends Food Sci Technol* 1996;7:390–399）：書誌は複数の二次資料で一致するが、DOIとアブストラクトを一次情報で確認できなかったため未確認扱い。総説としては 3-15（一次確認済み）で代替可能。
- **Roberts 1963 系統の「creaming down」古典論文**：抄録の写しは読めたが、掲載誌名・巻頁を一次情報で確定できなかったため未確認扱い。茶クリームについては一次確認済みの 3-10〜3-12 で代替可能。

---

## §4 脂肪と香りの放出・保持、温度、摂取順序

§4 の総括（含意）：
1. **余韻の持続**：脂肪は脂溶性香気を保持し即時放出を下げる代わりに、口内残留・粘膜保持・嚥下後放出を通じて持続を伸ばす（4-1、4-4、4-11、4-14、4-18）。「高脂肪チョコレート＝余韻が長い」は一般則として表示可能だが、化合物の疎水性で方向が変わる点（親水性化合物は嚥下前が中心、4-14）を併記すべき。
2. **温度**：製品温度が高いほどフレーバー強度と fat afterfeel が増す（4-20）。冷めていく過程でも属性は変化する（4-21）。お茶の温度帯表示はこの2件を根拠に「一般知見」レベルが妥当。
3. **順序・連続摂取**：高脂肪食品の繰り返しで口内脂肪膜が蓄積し後続の知覚が変わる（4-22）、先行試料の残留が次を同化させる（4-23）、順序自体がペアリングの美味しさを変えうる（§6 D-6）。「チョコレート先行で余韻が伸びる／お茶先行で切れが良い」等の順序表示は、実験根拠があるのはエマルション・ジュース系までであり、お茶×チョコレートでの直接実測ではない旨のレベル表示が必須。
4. **食べ方**：咀嚼時間・唾液・嚥下回数・溶ける速さが放出を決める（4-9、4-10、4-12、4-13）。「ゆっくり溶かす」「嚥下を挟む」等のガイドは根拠付きで提示可能。

### A. 脂肪含量・マトリクスと in-nose / in-mouth 放出

#### 4-1Brauss et al. 1999
- **書誌情報**：Brauss, M.S., Linforth, R.S.T., Cayeux, I., Harvey, B., Taylor, A.J. Altering the fat content affects flavor release in a model yogurt system. *Journal of Agricultural and Food Chemistry* 47:2055–2059. DOI: 10.1021/jf9810719
- **主要な知見**：※二次源で一致した範囲：低脂肪ヨーグルト（0.2%）は、全脂肪（3.5%、10%）より揮発成分を速く・高強度に放出するが、持続は短い。高脂肪では放出は抑えられる代わりに持続する。
- **適用範囲と限界**：アブストラクト本文自体は出版社ページで読めなかった。ヨーグルト系モデルであり、チョコレート実測ではない旨のレベル表示が必要。
- **何に使えるか**：「脂肪が多いチョコレートほど香りの立ち上がりは穏やかだが余韻が長い／低脂肪・水系のお茶は立ち上がりが速く切れが良い」という余韻の持続表示の古典的根拠。
- **確認手段**：書誌・DOIは一次引用元の参考文献表記で確認。

#### 4-2Linforth, Blissett & Taylor 2005
- **書誌情報**：Linforth, R.S.T., Blissett, A., Taylor, A.J. Differences in the effect of bolus weight on flavor release into the breath between low-fat and high-fat products. *Journal of Agricultural and Food Chemistry* 53(18):7217–7221. DOI：未確認（ACSページで巻・頁・要旨は確認したが表示範囲にDOIなし）
- **主要な知見**：口に入れる量（bolus weight）を増やすとフレーバー放出の最大強度は冪関数的に増えるが、その増え方は低脂肪食品（≤1 g/100g）と高脂肪食品（≥5 g/100g）で異なる。低脂肪の方が量増加に対する放出増加が大きく、著者らは脂肪が口腔表面に選択的に付着し、脂溶性フレーバーの放出に有効な表面積を変える可能性を挙げている。
- **適用範囲と限界**：モデル食品系。DOI は採用前に解決確認を推奨。
- **何に使えるか**：「一口量が多い／チョコレートの量が多いほど香りが強まるが、脂肪が多いと増え方は鈍る」「口内に残る脂肪膜が次のお茶の香りの出方を変える」という口内コーティング経由の相互作用表示の根拠（M8 の補強）。
- **確認手段**：ACS出版社ページ。

#### 4-3Linforth et al. 2010
- **書誌情報**：Linforth, R.S.T. et al. Effect of fat content on flavor delivery during consumption: an in vivo model. *Journal of Agricultural and Food Chemistry* 58(11):6905–6911. DOI: 10.1021/jf100643d
- **主要な知見**：脂肪が in vivo フレーバー放出に与える影響の既往データと新規200点、計345点をモデル化し、予測モデル（R²=0.71）を構築した。フレーバー化合物の疎水性は log P で表現され、脂肪含量が異なる2試料間のフレーバー送達差を推定できる。高脂肪食品のオレンジフレーバーを低脂肪用に再処方すると、無調整より類似した体験が得られたことを官能で示している。
- **適用範囲と限界**：送達（放出）のモデルであり、知覚の相性予測ではない。化合物ベースの推定は「共有＝合う」の予測とは別物として扱うこと。
- **何に使えるか**：「脂肪差による香りの出方の差は、化合物の疎水性（log P）で系統的に説明できる」という、化合物ベースで余韻・強さを推定する表示の方法論的根拠。
- **確認手段**：ACS出版社ページ。

#### 4-4Frank et al. 2011
- **書誌情報**：Frank, D., Appelqvist, I., Piyasiri, U., Wooster, T.J., Delahunty, C. Proton transfer reaction mass spectrometry and time intensity perceptual measurement of flavor release from lipid emulsions using trained human subjects. *Journal of Agricultural and Food Chemistry* 59(9):4891–4903. DOI：未確認（ACSページで巻・頁・要旨確認、DOIは表示範囲になし）
- **主要な知見**：訓練パネル6名の in-nose 放出を PTR-MS で、知覚強度を time-intensity で同時測定し、嚥下前／嚥下後を分けて解析した。水（脂肪0%）〜脂肪20%のエマルションで、Ko/w（オクタノール／水分配）が1〜1380の化合物を比較すると、脂肪増加で in-nose 放出と知覚強度が有意に低下した単一化合物例がある。脂肪の影響は Ko/w が低い化合物では小さく、脂溶性が高いほど大きく、脂肪がない場合は総放出量の半分超が嚥下前に出るのに対し、脂肪増加で嚥下後の比率が増えた。
- **適用範囲と限界**：エマルション系・訓練パネル6名。DOI は採用前に再確認を推奨。
- **何に使えるか**：**「脂肪は脂溶性の香りを嚥下後（＝余韻側）へ移す」**という時間配分表示の中心根拠（M8 の補強）。お茶（水系）→チョコレート（脂肪系）の順で余韻が伸びる説明にも使える。
- **確認手段**：ACS出版社ページ。

#### 4-5Frank et al. 2012
- **書誌情報**：Frank, D., Appelqvist, I., Piyasiri, U., Delahunty, C. In vitro measurement of volatile release in model lipid emulsions using proton transfer reaction mass spectrometry. *Journal of Agricultural and Food Chemistry* 60(9):2264–2273. DOI: 10.1021/jf204120h（PMID: 22304692）
- **主要な知見**：鼻咽頭系を模した開放型 in vitro セル＋PTR-MS で、脂肪0〜20%、油滴径0.25／0.5／5.0 μm、脂溶性 Ko/w 1〜1380の放出曲線を測定した。脂肪含量、化合物の蒸気圧、Ko/w によって Imax、Tmax、AUC が系統的に変化し、曲線は理論および in vivo の嚥下前相と一致した。
- **適用範囲と限界**：in vitro モデル。チョコレートの口どけへの類推には「モデルエマルションでの知見」とレベル明記が必要。
- **何に使えるか**：油滴径（乳化状態）まで含めた「脂肪の量だけでなく分散状態が放出速度を変える」表示の根拠。
- **確認手段**：PMID・DOI・巻頁・アブストラクト要旨を文献配信／索引ページで確認。

#### 4-6Giroux, Perreault & Britten 2007
- **書誌情報**：Giroux, H.J., Perreault, V., Britten, M. Characterization of hydrophobic flavor release profile in oil-in-water emulsions. *Journal of Food Science* 72(2):S125. DOI: 10.1111/j.1750-3841.2007.00271.x
- **主要な知見**：※報道要約＋引用範囲に限る：疎水性香料 ethyl hexanoate の水中油型エマルションからの放出は時間とともに漸減し、油濃度が高いほど強度が低下したことから、油相がエステルのリザーバーとして働き、油相から水相への遅い移行が放出プロファイルを決めると報告されている。
- **適用範囲と限界**：アブストラクト本文は出版社ページで読めず。採用前に PubMed／Wiley で要旨の再確認を推奨。
- **何に使えるか**：「油相＝香りの貯蔵庫（リザーバー）」という説明文の出典候補。
- **確認手段**：PMC掲載論文の参考文献表記で書誌・DOI を確認。

#### 4-7Ayed et al. 2018（オンライン2017）
- **書誌情報**：Ayed, C., Martins, S.I.F.S., Williamson, A.-M., Guichard, E. Understanding fat, proteins and saliva impact on aroma release from flavoured ice creams. *Food Chemistry*. DOI: 10.1016/j.foodchem.2017.10.127（巻・頁は確認範囲になし）
- **主要な知見**：脂肪・タンパク質の量と種類を変えたアイスクリーム14種の香気放出を、温度制御下で咀嚼を模す唾液リアクター＋SPME-GC で測定した。脂肪の「種類」より「量」の効果が大きく、低脂肪の方が疎水性香気を多く放出した。低脂肪ではタンパク質量が低い方が放出が多く、高脂肪では唾液添加で塩析（salting-out）によるとみられる放出の小幅増加があった。
- **適用範囲と限界**：アイスクリーム系・機器測定中心。
- **何に使えるか**：冷たいデザート系でも脂肪量が疎水性香気の放出を抑えること、および唾液が放出をわずかに押し上げる場合があることの根拠。冷茶×チョコレートアイス等の温度帯が低い組み合わせへの注意書きにも使える。
- **確認手段**：出版社系PDF／大学リポジトリ。

### B. 咀嚼・唾液・嚥下・口内コーティング

#### 4-8Doyennette et al. 2011a
- **書誌情報**：Doyennette, M., de Loubens, C., Déléris, I., Souchon, I., Trelea, I.C. Mechanisms explaining the role of viscosity and post-deglutitive pharyngeal residue on in vivo aroma release: a combined experimental and modeling study. *Food Chemistry* 128(2):380–390. DOI: 10.1016/j.foodchem.2011.03.039
- **主要な知見**：粘度0.7〜405 mPa·s のグルコースシロップからの diacetyl の in vivo 放出を PTR-MS（5名）で測り、機構モデルと比較した。製品そのままの物性ではモデルが実測と合わず、**嚥下後に咽頭に残る残渣が唾液で大きく希釈されている**と仮定すると予測が一致した。すなわち in vivo 放出を決めるのは製品単体ではなく製品＋唾液混合物の性質である。
- **適用範囲と限界**：シロップ系・小標本の機構研究。
- **何に使えるか**：「嚥下後に口・喉に残った薄い膜（お茶やチョコレートの残渣）が唾液で薄まりながら余韻を出す」という嚥下後残渣＝余韻の場の表示根拠。
- **確認手段**：ScienceDirect。

#### 4-9Doyennette et al. 2011b
- **書誌情報**：Doyennette, M., Déléris, I., Saint-Eve, A., Gasiglia, A., Souchon, I., Trelea, I.C. The dynamics of aroma compound transfer properties in cheeses during simulated eating conditions. *Food Research International* 44(10):3174–3181. DOI: 10.1016/j.foodres.2011.07.034
- **主要な知見**：脂肪量と硬さの異なるチーズ4種に ethyl propanoate と 2-nonanone を添加し、人工唾液量を変えてボーラス形成を模擬し、空気／ボーラス分配係数と物質移動係数を測った。唾液による希釈は分配係数を上げ（放出側に働く）、ethyl propanoate の物質移動係数には希釈と製品の硬さの両方が効いた。
- **適用範囲と限界**：模擬摂食条件での物理化学的測定。
- **何に使えるか**：「唾液が増えるほど香りは出やすくなる一方、硬さ（＝チョコレートの硬さ・溶けにくさ）が移動速度を律速する」という、咀嚼・唾液希釈の二重効果表示の根拠。
- **確認手段**：出版社系PDF／HAL系記録。

#### 4-10Doyennette et al. 2014
- **書誌情報**：Doyennette, M., Déléris, I., Feron, G., Guichard, E., Souchon, I., Trelea, I.C. Main individual and product characteristics influencing in-mouth flavour release during eating masticated food products with different textures: mechanistic modelling and experimental validation. *Journal of Theoretical Biology* 340:209–221. DOI: 10.1016/j.jtbi.2013.09.005（PMID: 24045155）
- **主要な知見**：硬さの異なるチーズ4種を10名が食べた際の APCI-MS 実測を、咀嚼・嚥下・物質移動・溶解を含む機構モデルで再現した。放出強度に最も効いたのは製品の口内溶解速度、ボーラスの物質移動係数、空気‐ボーラス接触面積、呼吸頻度であり、動態には咀嚼時間、咽頭（velopharynx）開放、唾液取り込み速度が効いた。疎水性の 2-nonanone については、潤滑した粘膜への保持を仮定することで動態が説明できた。
- **適用範囲と限界**：チーズ系の機構モデル。
- **何に使えるか**：「溶ける速さ・噛む時間・唾液量・呼吸が余韻の強さと長さを決める」「疎水性香気は粘膜に留まる」という、食べ方（ゆっくり溶かす等）のガイド表示の理論的根拠。
- **確認手段**：出版社系PDF／HAL記録。

#### 4-11Repoux et al. 2012
- **書誌情報**：Repoux, M., Labouré, H., Courcoux, P., Andriot, I., Sémon, E., Yven, C., Feron, G., Guichard, E. Combined effect of cheese characteristics and food oral processing on in vivo aroma release. *Flavour and Fragrance Journal* 27(6):414–423. DOI: 10.1002/ffj.3110
- **主要な知見**：44名が脂肪量・硬さの異なるモデルチーズ6種を自由摂取し、in vivo 放出を測定した。硬いほど咀嚼時間・唾液取り込み・総放出量・放出速度が増えた。親水性の ethyl propanoate は咀嚼中に多く出た一方、疎水性の nonan-2-one は嚥下後に多く出て持続した。**脂肪が多いチーズでは嚥下後に口内に残る製品量が多く、nonan-2-one の放出量は減るが呼気中の持続は長くなった。**
- **適用範囲と限界**：モデルチーズでの知見。チョコレート実測ではない。
- **何に使えるか**：本領域で最もアプリに近い一篇。「脂肪↑→即時の香り↓だが口内残留↑・余韻↑」を44名規模で示しており、**余韻の持続表示の主根拠**として使える（M8 の補強）。
- **確認手段**：HAL（Wiley論文の機関記録）。

#### 4-12Boisard et al. 2014
- **書誌情報**：Boisard, L., Tournier, C., Sémon, E., Noirot, E., Guichard, E., Salles, C. Salt and fat contents influence the microstructure of model cheeses, chewing/swallowing and in vivo aroma release. *Flavour and Fragrance Journal* 29:95–106. DOI: 10.1002/ffj.3184
- **主要な知見**：脂質／タンパク比（L/P）が低いチーズは脂肪滴が小さくタンパク網が強く、咀嚼活動と嚥下までの時間が増え、香りの最大強度と口内放出速度は L/P 低下とともに下がった。塩添加はタンパク相から口腔・鼻腔への放出を速め、脂肪滴が大きい条件では移行が遅くなる代わりに嚥下後の放出レベルが高くなった。嚥下回数が増えると総放出量も増えた。
- **適用範囲と限界**：モデルチーズ系。
- **何に使えるか**：「脂肪滴の大きさ（乳化状態）が移行速度と嚥下後レベルを変える」根拠。チョコレートが口中で分散・乳化していく過程の説明、および嚥下を挟むことで香りが段階的に出るという順序表示に使える。
- **確認手段**：OpenAIRE／Wiley系記録。

#### 4-13Feron et al. 2014
- **書誌情報**：Feron, G., Ayed, C., Qannari, E.M., Courcoux, P., Laboure, H., Guichard, E., Feron, G. Understanding aroma release from model cheeses by a statistical multiblock approach on oral processing. *PLoS ONE* 9(4):e93113. DOI: 10.1371/journal.pone.0093113
- **主要な知見**：48名・脂肪量と硬さの異なるモデルチーズ4種で、咀嚼挙動、ボーラスレオロジー、唾液組成・流量、mouth coating、ボーラス含水を統合解析した。香り放出はチーズ・化合物によらず主に咀嚼挙動で説明され、特に嚥下後の放出には平均咀嚼振幅が効いた。硬いチーズではボーラスレオロジーが主因となり、疎水性化合物の呼気中持続はボーラスの広がりやすさ（spreadability）と含水と密接に関係した。
- **適用範囲と限界**：モデルチーズ・統計的統合解析。
- **何に使えるか**：「よく噛む／口中で広げるほど嚥下後の香りが伸びる」「mouth coating と含水が疎水性香気の持続を決める」という食べ方＋余韻表示の根拠。
- **確認手段**：PMC。

#### 4-14Guichard et al. 2017
- **書誌情報**：Guichard, E., Repoux, M., Qannari, E.M., Laboure, H., Feron, G. Model cheese aroma perception is explained not only by in vivo aroma release but also by salivary composition and oral processing parameters. *Food & Function* 8:615–628. DOI: 10.1039/C6FO01472K
- **主要な知見**：14名・チーズ4種で、in vivo 放出、ボーラス、咀嚼、mouth coating、唾液組成と動的知覚を MB-PLS で統合した。親水性 ethyl propanoate のフルーティ知覚は嚥下前の放出と結びついたのに対し、疎水性 nonan-2-one のブルーチーズ様知覚は**嚥下後の放出と結びつき、mouth coating の影響を強く受けた**。唾液のナトリウム量や脂質分解活性の個人差が、塩味・脂肪と調和する／しない香りの知覚を変えることも示された。
- **適用範囲と限界**：放出量だけでは知覚は決まらないことの実証。モデルチーズ系。
- **何に使えるか**：「口内に coating として残る疎水性香気が余韻の知覚を担う」という、余韻表示に知覚側の裏付けを与える一篇（M8 の補強）。唾液の個人差への留保表示にも使える。
- **確認手段**：RSC出版社ページ。

### C. 嚥下・呼吸・粘膜保持と後鼻腔香

#### 4-15Buettner et al. 2001
- **書誌情報**：Buettner, A., Beer, A., Hannig, C., Settles, M. Observation of the swallowing process by application of videofluoroscopy and real-time magnetic resonance imaging — consequences for retronasal aroma stimulation. *Chemical Senses* 26(9):1211–1219. DOI: 10.1093/chemse/26.9.1211（PMID: 11705807）
- **主要な知見**：ビデオ透視とリアルタイムMRIで咀嚼・嚥下中の舌・咽頭・軟口蓋を観察し、揮発成分を口腔内に留める生理的バリアが実在することを初めて示した。香りが鼻腔へ届くのは摂食過程の特定のタイミングに限られ、その有効性は食品のテクスチャと口内の食品量に左右される。
- **適用範囲と限界**：生理機構の観察研究（既存出典 Buettner 2005 とは別論文）。
- **何に使えるか**：「香りは常時ではなく、嚥下の瞬間を中心に鼻へ届く」という後鼻腔のタイミング表示の基礎根拠。
- **確認手段**：PubMed。

#### 4-16Büttner et al. 2008（方法論的概念論文）
- **書誌情報**：Büttner, A., Otto, S., Beer, A., Mestres, M., Schieberle, P., Hummel, T. Dynamics of retronasal aroma perception during consumption: Cross-linking on-line breath analysis with medico-analytical tools to elucidate a complex process. *Food Chemistry* 108(4):1234–1246. DOI: 10.1016/j.foodchem.2007.03.042
- **主要な知見**：定義した匂い刺激を PTR-MS でオンライン測定しながら、電気生理・心理物理応答、ビデオ透視／リアルタイムMRI による咀嚼・嚥下の可視化を組み合わせ、摂取中・摂取後の ortho-/retronasal 知覚の時間・空間動態を解く枠組みを提示。パネリスト自身の咀嚼・嚥下パターンが知覚を調節する点が強調されている。
- **適用範囲と限界**：**主張範囲は枠組み提示までで、特定食品の効果量の根拠には使わないこと。**
- **何に使えるか**：「余韻は機器測定（呼気）と知覚を対応させて語るべき」という方法論的裏付け。
- **確認手段**：大学（FAU）研究情報ページ。

#### 4-17Mishellany-Dutour et al. 2012
- **書誌情報**：Mishellany-Dutour, A., Woda, A., Labouré, H., Bourdiol, P., Lachaze, P., Guichard, E., Feron, G. Retro-nasal aroma release is correlated with variations in the in-mouth air cavity volume after empty deglutition. *PLoS ONE* 7(7):e41276. DOI: 10.1371/journal.pone.0041276（PMID: 22815986）
- **主要な知見**：空嚥下後の口腔内気腔（IMAC）体積の変化で被験者は2型に分かれた。舌位が高く IMAC が小さく一定の群はミント錠の menthone 放出が高く、摂取中から連続的に放出していたとみられる。IMAC が漸増する群は香りを口腔に溜めて嚥下時に鼻腔へ送っていたとみられ、放出は低かった。
- **適用範囲と限界**：in vivo 放出プロファイルは嚥下時の運動パターンに強く依存する。個人差が大きい。
- **何に使えるか**：「飲み込むタイミング・舌の動きで香りの届き方が人により変わる」という個人差と飲み方の留保表示の根拠。絶対的な余韻の長さを断定しない理由にもなる。
- **確認手段**：PubMed。

#### 4-18Esteban-Fernández et al. 2016（粘膜吸着と残り香）
- **書誌情報**：Esteban-Fernández, A., Rocha-Alcubilla, N., Muñoz-González, C., Moreno-Arribas, M.V., Pozo-Bayón, M.Á. Intra-oral adsorption and release of aroma compounds following in-mouth wine exposure. *Food Chemistry* 205:280–288. DOI: 10.1016/j.foodchem.2016.03.030（PMID: 27006241）
- **主要な知見**：ワインの「afterodour（飲んだ後の残り香）」に関し、口腔粘膜への吸着を in vivo で測り、その後の放出を intraoral SPME/GC-MS で追った（3名）。添加した香気の口腔吸着は化合物の物理化学的性質により6〜43%と幅があり、その後の口内濃度は化合物ごとに異なる減衰を示した。吸着量そのものより香り‐粘膜相互作用の強さが減衰挙動を説明するとしている。
- **適用範囲と限界**：被験者3名の小規模研究である旨をレベル表示すべき。
- **何に使えるか**：飲料（ワイン）でも粘膜への吸着量と相互作用が残り香＝余韻を決めることを示す、お茶（飲料）側に最も近い余韻根拠の一つ。新規ルール候補「粘膜吸着による余韻」の根拠。
- **確認手段**：出版社系PDF＋他論文の参考文献表記で DOI 確認。

#### 4-19Esteban-Fernández et al. 2018（フェノール類と香気放出）
- **書誌情報**：Esteban-Fernández, A., Muñoz-González, C., Jiménez-Girón, A., Pérez-Jiménez, M., Pozo-Bayón, M.Á. Aroma release in the oral cavity after wine intake is influenced by wine matrix composition. *Food Chemistry* 243:125–133. DOI: 10.1016/j.foodchem.2017.09.101（PMID: 29146318）
- **主要な知見**：12種のワインに6種の香気を添加し、3名の口腔曝露後の口内放出を in vivo intraoral SPME で追った。マトリクス組成は特定の香気の口内放出に有意に効き、最も影響が大きかったのはフェノール化合物で、その化学構造により方向が逆転した。一部のフェノール酸は linalool や β-ionone の放出を増やし、フラボノイドは ethyl hexanoate 等の脂肪族エステルの放出を減らした。
- **適用範囲と限界**：対象はワインであり、お茶での実測ではないと明記すべき。小標本。
- **何に使えるか**：**お茶のポリフェノール（カテキン類等）が、後から／先に口に入るチョコレート香気の口内放出を増減しうる**という相互作用表示に最も近い構造の根拠。新規ルール候補「ポリフェノール×香気放出の増減」の根拠。
- **確認手段**：HAL（機関記録）。

### D. 温度

#### 4-20Engelen et al. 2003
- **書誌情報**：Engelen, L., de Wijk, R.A., Prinz, J.F., Janssen, A.M., Weenen, H., Bosman, F. The effect of oral and product temperature on the perception of flavor and texture attributes of semi-solids. *Appetite* 41:273–281. DOI: 10.1016/S0195-6663(03)00105-3（PMID: 14637326）
- **主要な知見**：カスタードとマヨネーズ（各高脂肪・低脂肪）を製品温度10／22／35°C、口腔温度27／35／43°Cの組合せで評価した。製品温度が上がるとフレーバー強度、melting mouthfeel、fat afterfeel が増し、主観的な厚みは減った。全体の creaminess には温度効果はなかった。口腔温度の効果は小さいが存在し、製品温度の影響の方がはるかに大きかった。
- **適用範囲と限界**：対象は半固形食品であり飲料そのものではない。
- **何に使えるか**：「温かいほどフレーバーと脂肪の後味が強く感じられる」という温度表示の直接根拠。新規ルール候補「温度×脂肪感」の主根拠。温茶×チョコレートで脂肪感・香りが立つ説明に使える。
- **確認手段**：PubMed。

#### 4-21Pramudya & Seo 2018
- **書誌情報**：Pramudya, R.C., Seo, H.-S. Using Check-All-That-Apply (CATA) method for determining product temperature-dependent sensory-attribute variations: A case study of cooked rice. *Food Research International* 105:724–732. DOI: 10.1016/j.foodres.2017.11.075
- **主要な知見**：※結論部で確認できた範囲：炊飯米の官能属性は食べる温度によって変わり、消費中に温度が下がるにつれて知覚される属性自体が変化しうることが CATA 法で示された。その温度依存パターンは米のブランドによって異なった。
- **適用範囲と限界**：アブストラクト全文は表示範囲で読めず、主張範囲は結論部で確認できた範囲に限る。対象は米飯。
- **何に使えるか**：「提供直後だけでなく、冷めていく過程で感じられる香り・属性が変わる」という時間×温度表示の根拠。熱いお茶が冷めるにつれてペアリングの印象が移る説明に使える。
- **確認手段**：ScienceDirect（書誌＋結論部）。

### E. 摂取順序・連続摂取・キャリーオーバー

#### 4-22Appelqvist et al. 2016（脂肪膜の蓄積）
- **書誌情報**：Appelqvist, I.A.M., Poelman, A.A.M., Cochet-Broch, M., Delahunty, C.M. Impact of model fat emulsions on sensory perception using repeated spoon to spoon ingestion. *Physiology & Behavior* 160:80–86. DOI: 10.1016/j.physbeh.2016.03.035
- **主要な知見**：油2〜50%のエマルションをスプーンで繰り返し摂取すると、50%脂肪ではスプーンを重ねるごとに fatty mouthfeel と嚥下後の afterfeel が増えた。これは口腔表面への油滴層の蓄積（build-up）によるとみられる。より脂溶性の ethyl hexanoate を含む高脂肪条件では fatty afterfeel がさらに強まり（クロスモーダル相互作用）、低脂肪では蓄積は起きなかった。甘味知覚は繰り返しでは変化しなかった。
- **適用範囲と限界**：モデルエマルション系。
- **何に使えるか**：**連続摂取・順序効果の最重要根拠の一つ。**「チョコレートを先に／繰り返し食べると口内に脂肪膜が積み重なり、後のお茶の脂肪感・余韻の感じ方が変わる」という表示に直接使える。新規ルール候補「順序・脂肪膜蓄積」の主根拠。
- **確認手段**：PubMed要旨＋ScienceDirect。

#### 4-23Torrico et al. 2018（キャリーオーバーの定量化）
- **書誌情報**：Torrico, D.D., Jirangrat, W., Wang, J., Chompreeda, P., Sriwattana, S., Prinyawiwatkul, W. Novel modelling approaches to characterize and quantify carryover effects on sensory acceptability. *Foods* 7(11):186. DOI: 10.3390/foods7110186
- **主要な知見**：先行試料の残留感覚が次試料の評価を歪める carryover effect（COE）を、540名のブドウジュース受容性データでモデル化・定量化した。COEは色で相対的に強く、味・総合では小さく、主として convergence（前試料に引き寄せられる同化）の形を取った。
- **適用範囲と限界**：効果は試料・属性により小さい場合もあるという留保を含む。ジュース系の受容性データ。
- **何に使えるか**：「先に食べたものの残り香・残留感覚が、次の組み合わせの評価を引き寄せる」という順序・キャリーオーバーの一般根拠。ペアリング評価手順（順序固定、口直し等）の注意書きの出典になる。
- **確認手段**：MDPI出版社ページ。

#### 4-24Spence, Wang & Youssef 2017（試食順序）
- **書誌情報**：Spence, C., Wang, Q.J., Youssef, J. Pairing flavours and the temporal order of tasting. *Flavour* 6:4. DOI: 10.1186/s13411-017-0053-0
- **主要な知見**：同時に、あるいは特定の順序で味わう方が、別の順序より美味しく感じられる組み合わせがあることを整理し、料理設計と食品×飲料のマッチングにおける順序とペアリングの重要性を論じた。フレーバーマッチングの一般原理として類似性（similarity）、対比（contrast）、相乗／創発（synergy/emergence）の3つを評価し、短期的順応（adaptation）や文脈・逐次効果がテイスティング判断に及ぼす役割にも触れている。主掲載は §6 D-6（チーズ×ワイン多回摂取TDSの引用・非対称性を含む詳報）と §7-6。
- **適用範囲と限界**：レビュー論文であり実験論文ではない。個別の順序効果の断定には 4-22、4-23 等の実験論文と併用すること。
- **何に使えるか**：「お茶→チョコレート／チョコレート→お茶で印象が変わりうる」という順序表示の総論的根拠。
- **確認手段**：出版社系PDF／論文テキスト、Springer出版社ページ。

### F. 脂肪の融解・乳化状態と口当たり／味覚放出（チョコレート）

#### 4-25Burkard et al. 2024
- **書誌情報**：Burkard, J., Kohler, L., Caciagli, S., Herren, N., Kozamernik, M., Mantovani, S., Windhab, E.J., Denkel, C. Exploring the effects of structure and melting on sweetness in additively manufactured chocolate. *Scientific Reports* 14:8261. DOI: 10.1038/s41598-024-58838-6（PMID: 38589622）
- **主要な知見**：ココアバターの一部をヘーゼルナッツオイルに置換した3D造形チョコレートで、糖量が同じでもヘーゼルナッツオイルが多いほど融解挙動と消費時間が変わり、甘味知覚が最大24%高まった。著者らは、唾液へのスクロース放出が速まったためとみており、in vivo の吐出試験でも味覚物質放出の増加が裏付けられた。オイルを多く含む外層を持つ構造でも、糖勾配なしで甘味が11%高まった。
- **適用範囲と限界**：本論文自体はお茶との組合せではない。造形チョコレートという特殊な試料。
- **何に使えるか**：「チョコレートの脂肪相の融点・融け方が、口中での味覚物質の放出速度と甘さの感じ方を変える」という口どけ表示のチョコレート実物での根拠。温かいお茶が口内のチョコレートの融解を助け、甘味・香りの立ち上がりを変える説明の土台になる。
- **確認手段**：Nature出版社ページ／PMC。

### §4 の未確認／保留
- **de Roos 系の原典**（例："Modes of aroma release" 1997年頃とされる総説／章）：二次引用では多数確認できたが、PubMed／出版社ページでタイトル・巻頁・DOI を確認できなかったため**未確認**。採用する場合は書籍章の書誌を別途一次確認すること。
- **Drake, M.A. et al. 2005**（チェダーチーズ提供温度）：書誌は *Journal of Sensory Studies* 20:147–155、DOI: 10.1111/j.1745-459X.2005.00013.x と他論文の引用で確認できたが、アブストラクトを出版社／PubMed で読めなかったため一次確認済みには含めない（次点候補）。
- **Ross, C.F. & Weller, K. 2008**（ワイン提供温度）：書誌 *Journal of Sensory Studies* 23:398–416、DOI: 10.1111/j.1745-459X.2008.00162.x は引用で確認。ただし主張要約（温かいほど香り強度が高い等）は二次ブログ要約に基づくため、一次確認済みには含めない（次点候補）。

---

## §5 お茶×チョコレート直接研究の精査と隣接直接組み合わせ研究

結論（先に）：
- お茶（飲料）×チョコレートを別々に供して官能評価した査読研究は、7ラインの探索範囲では **Donadini グループの2件のみ**（A-1、A-2）。表記ゆれ（green tea / black tea / matcha / white chocolate / tea pairing 等）を含めて探しても、他の査読ペアリング研究は出てこなかった。
- ただし「直接研究なし」は正確ではない。「配合（incorporation）研究」は別に存在する（黄茶抽出物をチョコに入れる等、A-3、A-4）。ペアリングと配合は分けて扱う必要がある。
- 茶×チーズの査読ペアリング研究は見つからなかった（専門家インタビュー・業界記事のみ、G節参照）。茶×乳製品は、官能ペアリングではなくタンパク質―ポリフェノール相互作用／ミルクティー官能として研究が厚い領域である（C節）。

### A. 直接研究（最優先精査）

#### A-1Donadini, Fumi & Lambri 2012
- **書誌情報**：Donadini, G., Fumi, M.D., Lambri, M. (2012). The hedonic response to chocolate and beverage pairing: A preliminary study. *Food Research International*, 48(2), 703–711. DOI: 10.1016/j.foodres.2012.06.009
- **主要な知見**：試料はカカオ分30%・70%・99%のチョコレート3種（市販品、報道では Lindt Excellence）×飲料18種（フォーカスグループで選定；紅茶・コーヒー・ポートワイン・リキュールワイン・スパークリングワイン・ラムブルスコ・バルサミコ酢・グラッパ・ビール・ウイスキー・水等）。チョコレート常食者80名が単体とペアを9点快楽尺度で評価し、ペアでは「チョコ支配／飲料支配」も回答。試食法は「チョコを舌で5秒溶かし口中に広げてから飲料を一口含む」混合試食（mixed tasting）。ペア好みは有意に変動（p<0.001）。30%・70%のペアが99%より好まれた。バルサミコ酢・リキュールワイン・コーヒー・ポートワインが「適切で汎用性の高いパートナー」とされた。因子分析ではペアの好みはチョコ単体の好みより**飲料単体の好みに強く依存**（ω²：飲料＝中効果、チョコと適合度＝小効果）。チョコが支配すると受容は下がり、飲料支配では上下どちらもあり得た。
- **適用範囲と限界**：茶は18飲料中の1〜2枠に過ぎず、茶種別の結論には使えない。茶に関する具体的順位（30%チョコ×紅茶は好まれた組合せ群、70%チョコ×紅茶は低評価群、99%×緑茶は低評価の99%ペア群）は**アブストラクトには無く、業界誌 BeverageDaily の本文要約による二次報道で確認**した範囲。アプリで引用する場合は「本文由来・二次報道経由」と注記すべき。DOI解決ページの直接取得は失敗した（失敗を一次確認の根拠にはしていない）。
- **何に使えるか**：中核文献。カカオ分軸（30/70で天井、99は苦味・渋味で拒否）という「カカオ%が高ければ良いペアではない」原則、飲料側の好みがペア評価を引っ張る原則、支配バランス概念の出典。
- **確認手段**：ScienceDirect誌面一覧（48巻2号703–711頁）＋FAO AGRISレコードに転載されたアブストラクト全文＋複数PMC論文の参考文献欄でDOI一致を確認。

#### A-2Donadini & Fumi 2014
- **書誌情報**：Donadini, G., Fumi, M.D. (2014). An investigation on the appropriateness of chocolate to match tea and coffee. *Food Research International*, 63, 464–476. DOI: 10.1016/j.foodres.2014.05.038
- **主要な知見**：お茶4種＝**ブラックティー、グリーンティー、バニラ風味茶、シトラス風味茶**／コーヒー3種＝チョコ風味、バニラ風味、無風味／チョコレート3種＝カカオ30%・70%・99%。消費者80名が単体・ペア（21ペア）を快楽評価＋風味支配を回答。別途、熟練パネル（レビュー表ではn=8）がチョコ摂取前後で茶・コーヒーの記述的分析（DA）を行い、DAと消費者好みをPLS回帰で結び付けた。著者所属は Università Cattolica del Sacro Cuore（Piacenza）。結果：茶ペア・コーヒーペアとも好みは試料間で有意に変動（p<0.001）。30%・70%ペアが99%ペアより好まれ、**全体としてコーヒーが茶より有意に好まれるチョコのパートナー**（p<0.001）。ペア評価は、単体の好み（飲料・チョコ双方）、飲料種、チョコ種、**風味の適合度（flavor match）**に偏らされる。チョコと飲料の風味が均衡したペアが有意に好まれ、どちらかが支配すると受容が下がり、特に**チョコ支配での低下が大きい**。結論は「好きなチョコ×好きな茶の単純な組合せではだめで、風味同士の調和が別途効く」こと。
- **適用範囲と限界**：茶は市販大衆品ベースで産地・品種・淹出条件の軸は無い。フレーバーティー2種を含むため「茶分類×チョコ」の細分化には転用できない。茶種別の細かい順位はこの要約範囲からは出ない。
- **何に使えるか**：**お茶×チョコ直接証拠の最重要出典**。アプリの「相互作用で見る」設計（化合物足し算ではない）、「均衡（どちらも支配しない）が好まれる」「コーヒーに比べ茶はパートナーとして弱いという対照結果」を、測定ベースの主張として引ける唯一級の根拠。
- **確認手段**：論文PDFプレビュー（誌面464–476頁、受付／受理／オンライン履歴とアブストラクト全文）＋後継論文（B-1）の序文・引用＋ §2-7 系統的レビューの対象表。

#### A-3Gramza-Michałowska et al. 2021（配合研究）
- **書誌情報**：Gramza-Michałowska, A., Kulczyński, B., Skopiec, M., Kobus-Cisowska, J., Brzozowska, A. (2021). The Effect of Yellow Tea Leaves *Camellia sinensis* on the Quality of Stored Chocolate Confectionery. *Applied Sciences*, 11(9), 4123. DOI: 10.3390/app11094123
- **主要な知見**：黄茶（China Kekecha）水抽出物の凍乾粉末をホワイトチョコで濃度最適化（0–2.0%、訓練パネル）し、0.2%添加でホワイト／ミルク／ダークを6か月貯蔵評価。2.0%添加は色の受容を上げ「leafy」な香りを強めた。抗酸化活性は黄茶入りダークが最高で、3か月で上がり6か月で低下した。
- **適用範囲と限界**：ペアリングではなく配合（incorporation）の研究。ペアページの根拠にはしない。
- **何に使えるか**：「茶×チョコの成分相互作用・貯蔵で変わる」側の根拠。抹茶チョコ等の「一体型製品」ページでは正当な直接文献になる。
- **確認手段**：MDPI出版社ページ（アブストラクト＋方法節まで閲読）。

#### A-4緑茶入りホワイトチョコ（学位系リポジトリ）
- **書誌情報**：Development of a Green-Tea-Incorporated White Chocolate. Uva Wellassa University リポジトリ（erepo.lib.uwu.ac.lk）収録。**著者・年は取得ページで確認できず。**
- **主要な知見**：※リポジトリのアブストラクト要約の範囲：緑茶粉0–5%の6処理、未訓練30名・5点尺度、2%が全属性で有意に好まれポリフェノール増、常温6週の保存性。
- **適用範囲と限界**：査読誌論文と確認できないため、アプリの根拠には使わず「配合研究が他にもある」程度の参考。
- **何に使えるか**：配合研究の存在の傍証のみ。
- **確認手段**：リポジトリのアブストラクト要約のみ閲読。

### B. 茶のペアリング一般（チョコ以外）

#### B-1Romeo-Arroyo, Mora, Noguera-Artiaga & Vázquez-Araújo 2023
- **書誌情報**：Romeo-Arroyo, E., Mora, M., Noguera-Artiaga, L., Vázquez-Araújo, L. (2023). Tea pairings: Impact of aromatic congruence on acceptance and sweetness perception. *Current Research in Food Science*, 6, 100432. DOI: 10.1016/j.crfs.2022.100432（PMID: 36636724）。§7-13 では掲載誌を *International Journal of Gastronomy and Food Science* とする記録があるが、PMC全文（PMC9829690）で確認した *Current Research in Food Science* を本書の正とする。
- **主要な知見**：茶・インフュージョン20種を projective mapping（半訓練30名）で herbal／fruity-sweet／brown-sweet の3群に分類し SPME-GC-MS で裏付け、消費者89名で茶×バタークッキーの一致／不一致ペアを評価。**Harmony は嗜好と正の相関を示し、Balance と Similarity は芳香的一致と関連したが、全ペアリングの嗜好自体はほぼ同等だった**。甘味知覚は香りに影響され、スペアミント系が最も甘く感じられにくく、甘い香りの茶×スペアミントクッキーでは甘さ知覚がやや上がる傾向（有意差なし）。同論文序文は「茶ペアリングの査読研究は Rune et al. 2021 時点で Donadini & Fumi 2014 と Sato & Kinugasa 2019 の2件のみ」と明記しており、A-2 の希少性の傍証になる。
- **適用範囲と限界**：「一致させれば必ず嗜好が上がる」とは言えない、という限定が同時に得られる。相手はバタークッキーでありチョコレートではない。
- **何に使えるか**：アプリの「香りの一致＝必ず好み上昇ではない」「甘味知覚は香りでずれる」という注意書きと、類似／均衡／調和の3原理の出典に最適。
- **確認手段**：PMC全文（抄録・方法・結果・序文）。

#### B-2Sato & Kinugasa 2019
- **書誌情報**：Sato, K., Kinugasa, H. (2019). Influence of Japanese green tea on the Koku attributes of bonito stock: Proposed basic rules of pairing Japanese green tea with Washoku. *Journal of Sensory Studies*, 34, e12539. DOIは今回開いた引用表示では確認できず、論文番号 e12539 で特定可能。
- **主要な知見**：緑茶2種×鰹だしで、うま味の相乗、記述的分析、time-intensity、TDS を用い、緑茶がだしの「コク（厚み・持続性・口中広がり・うま味強度）」を増強した。ただし**渋味が強すぎる茶では増強が抑制された**（§2 ラインの照合による）。著者らはこれを基に緑茶×和食ペアリングの基本ルールを提案している。
- **適用範囲と限界**：出版社ページでのアブストラクト直接取得は未実施のため「書誌のみ」に準じる扱い。対象は和食でありチョコではない。
- **何に使えるか**：日本茶×料理の数少ない実験研究。「うま味相乗で相手を持ち上げる」型の相互作用の出典。高渋味のお茶×高カカオチョコレートで苦味・渋味が累積する可能性への注意表示の類推根拠にもなる。
- **確認手段**：§2-7 の収録表＋著者らの研究要旨転載。

### C. 茶×乳製品（ミルクティー）

#### C-1Piyasena 2025（総説）
- **書誌情報**：Piyasena, N.P. (2025). Milk in tea: exploring the chemistry and biological activities. *Food Science and Biotechnology*, 34(12), 2707–2723. DOI: 10.1007/s10068-025-01841-y（PMID: 40655290）
- **主要な知見**：乳タンパク質と茶ポリフェノールは強く相互作用しポリフェノールの利用可能性を下げ得る一方、乳タンパク質はカテキンの消化管輸送・吸収の担体にもなり得る。総説内では、プロリンリッチなカゼイン（α/β-casein）がカテキン水酸基と結合すること、渋味はポリフェノールと唾液プロリンリッチタンパク質の複合体形成が主因であること、β-casein–カテキン結合が渋味を和らげミルクティーの味をまろやかにすることが整理されている。
- **適用範囲と限界**：総説であり、生物学的活性の主張をアプリの味表示に流用しないこと。
- **何に使えるか**：「乳が茶の渋味・苦味をマスクする」機構説明の総説出典（M6・M7 系の補強）。ホワイトチョコ／ミルクチョコ（乳固形分を含む）×茶の説明にも橋渡しできる。
- **確認手段**：PubMedレコード＋PMCページ（検索結果経由で閲読）。

#### C-2Qie et al. 2021
- **書誌情報**：Qie, X., Wu, Y., Chen, Y., Liu, C., Zeng, M., Qin, F., Wang, Z., Chen, J., He, Z. (2021). Competitive interactions among tea catechins, proteins, and digestive enzymes modulate in vitro protein digestibility, catechin bioaccessibility, and antioxidant activity of milk tea beverage model systems. *Food Research International*, 140, 110050. DOI: 10.1016/j.foodres.2020.110050（PMID: 33648275）
- **主要な知見**：in vitro 消化モデルで、カテキン―乳タンパク質／消化酵素の競合結合がタンパク質消化率、カテキン・バイオアクセシビリティ、抗酸化活性をどう変えるかを測定。タンパク質―カテキン相互作用はカテキンのバイオアクセシビリティを下げるが、消化段階での競合で回復し、β-ラクトグロブリン添加では EGCG のバイオアクセシビリティが増、β-casein では EGCG/EGC 低下・EC 上昇と、タンパク質種で方向が分かれた（数値の詳細は原典参照）。
- **適用範囲と限界**：in vitro 消化モデル。健康主張には使わない。
- **何に使えるか**：「乳タンパク質の種類で相互作用が違う」ことの実験根拠。味・マスキング機構の補助線に留めるのが安全。
- **確認手段**：PubMedページのアブストラクト全文。

#### C-3Choi & Lee（ミルクティーの外在的手がかり）
- **書誌情報**：Choi, Y., Lee, J. The effect of extrinsic cues on consumer perception: A study using milk tea products. *Food Quality and Preference*. DOI: 10.1016/j.foodqual.2018.08.004（**巻号頁は今回未確定**）
- **主要な知見**：消費者240名が市販ミルクティー8品を素の状態とパッケージ情報付きで評価（好み、甘味・ミルク風味・紅茶風味の強さ、93語CATA）。外在的情報は好まれた品の受容を押し上げたが選好順位は変えず、効果は既飲経験の有無で異なった。
- **適用範囲と限界**：巻号頁が未確定のため、登録前に書誌補完が必要。
- **何に使えるか**：ミルクティー官能の方法論（CATAで茶／乳を分けて測る）として参考。チョコ×茶で「情報ラベルが評価をずらす」注意（§6 C節）にも使える。
- **確認手段**：ScienceDirectページのアブストラクト転載＋DOI照合。

### D. チョコレート×他の飲料

#### D-1Luchian et al. 2023
- **書誌情報**：Luchian, C.E., Scutarașu, E.C., Colibaba, L.C., Grosaru, D., Cotea, V.V. (2023). Studies on the Enhancement of Sparkling Wine and Chocolate Pairing through Compositional Profile Analysis. *Foods*, 12(18), 3516. DOI: 10.3390/foods12183516
- **主要な知見**：ルーマニア産スパークリングワイン14種×チョコ5種（ホワイト、ルビー、ミルク32%、ダーク70%、ダーク95%）。ホワイト×シャルドネ demi-dry、ルビー×Fetească neagră demi-dry、ミルク×Tămâioasă românească sweet、ダーク70/95%×Fetească neagră sweet が好適合（適合度は熟練テイスター50名、0–10）。ワインの甘味・酸度・アルコールとチョコ組成が適合度を有意に左右した。高カカオの不人気は Donadini と整合すると著者ら自身が議論。
- **適用範囲と限界**：組成プロファイル分析中心で、消費者パネルの規模等の方法詳細は弱く、根拠の強さは Donadini 系より一段低く扱うべきである。
- **何に使えるか**：チョコ側の分類（ホワイト／ルビー／ミルク／ダーク×カカオ%）を相手飲料の甘味・酸で切る設計の直接先例。茶版を作る際の表設計の雛形になる。
- **確認手段**：MDPI出版社ページ＋PMCレコード。

#### D-2Isac-Torrente et al. 2023
- **書誌情報**：Isac-Torrente, L., Martí, J., Isidro, B., Lázaro, A., Chaya, C. (2023). Use of multi-intake Temporal Dominance of Sensations (TDS) and Temporal Dominance of Emotions (TDE) protocols to evaluate the influence of different beverage pairings on chocolate. *International Journal of Gastronomy and Food Science*, 32, 100681. DOI: 10.1016/j.ijgfs.2023.100681
- **主要な知見**：ダークチョコ×コーヒー／赤ベルモット／赤ワインを multi-intake TDS/TDE で評価し、一口ごと・時間経過で支配感覚と感情が変わることを示した。静的な好み1点ではペアリングを捉えきれず、動的手法が必要という方法論的結論が中心（§6 D-5 でも機関リポジトリ＋雑誌PDFで確認）。
- **適用範囲と限界**：方法論的知見が中心で、特定ペアの相性順位の根拠ではない。
- **何に使えるか**：本探索で最も対象に近い文献の一つ（チョコレート×飲料）。茶×チョコでも「最初は茶が支配→後半チョコが支配」のような時間軸表示をする際の方法論出典。
- **確認手段**：Universidad Politécnica de Madrid 機関リポジトリ＋論文PDF転載。

#### D-3Koone, Harrington, Gozzi & McCarthy 2014
- **書誌情報**：Koone, R., Harrington, R.J., Gozzi, M., McCarthy, M. (2014). The role of acidity, sweetness, tannin and consumer knowledge on wine and food match perceptions. *Journal of Wine Research*, 25(3), 158–174. DOI: 10.1080/09571264.2014.899491
- **主要な知見**：食品4種（シェーブル、ブリー、辛口サラミ、ミルクチョコ）×ワイン4種で適合知覚を測定（参加者248名）。最高適合は Sauvignon Blanc×シェーブル（5.69）、Chardonnay×ブリー（4.08）、Cabernet Sauvignon×サラミ（5.09）、**Port×ミルクチョコ（5.46）**。ワインの甘味・酸度・タンニンが適合を有意に左右し、専門性でも差が出た。
- **適用範囲と限界**：茶への転用は仮説と明示すべき（茶は甘味なし・渋味＝タンニン様・酸低め、という構造の違いがある）。
- **何に使えるか**：「甘味・酸・タンニンの3軸で適合が決まる」は茶への転用仮説の出典になる。
- **確認手段**：論文PDF転載でアブストラクトと結果表（平均値）まで閲読。

#### D-4Portワイン×チョコのTDS研究
- **書誌情報（部分）**：Temporal dominance of sensations (TDS) applied to assessing the sensory characteristics of port wines when tasted with different kinds of chocolates. *International Journal of Gastronomy and Food Science*, 44, 101484. 著者として Pinto、Correia、Vilela らの関与が研究者プロフィールから示唆されるが、**著者確定リスト・年は一次ページで確定できず**。
- **主要な知見**：※アブストラクト断片の範囲：QDA＋TDS、熟練12名、Port 3種（White Reserve、20年Tawny、LBV）。White Reserve Port はチョコの種類によらず基本属性が安定したが、Tawny 20年と LBV はチョコ選択に敏感だった。ワインの甘味・酸とチョコ組成が適合と最終知覚を左右した。
- **適用範囲と限界**：未確認要素が残るため現時点では引用せず、書誌確定後の候補。
- **何に使えるか**：「同じ飲料でもスタイルでチョコ耐性が違う」例としての候補。
- **確認手段**：ScienceDirectのアブストラクト断片＋引用データベースでの巻・論文番号照合のみ。

#### D-5Ineson, Smith & Barsby 2022
- **書誌情報**：Ineson, E.M., Smith, R.H., Barsby, A.T. (2022). Food and Beer Matching to Promote Destinations: A Central and Eastern European Perspective. *Deturope*, 14(2), 23–44. DOI: 10.32725/det.2022.012
- **主要な知見**：中東欧6か国214名、食品7種×ビール7種。最も選ばれたマッチは**ダークチョコレート×ベルギーフルーツビール（67.3%）**で、次いでソーセージ×ピルスナー／ヘーフェヴァイツェン。逆にピルスナー×チョコは7.9%と最低群だった。
- **適用範囲と限界**：観光・目的地プロモーション文脈の選択データであり、統制された官能評価ではない。
- **何に使えるか**：「チョコ×ビールでも相手の甘味・果実味の有無で適合が逆転する」傍証。茶×チョコの「甘味のある相手がチョコと合いやすい」傾向（A-1、A-2 の低カカオ選好）と並べて提示できる。
- **確認手段**：誌面PDFのアブストラクト。

### E. ワイン×チーズ／ビール×チーズ（方法論の母型）
- E-1 Bastian et al. 2010（Shiraz×チェダー）→ 主掲載 §2-10
- E-2 Madrigal-Galan & Heymann 2006 → 主掲載 §2-14

#### E-3Galmarini et al. 2017（ワイン→チーズ方向）
- **書誌情報**：Galmarini, M.V. et al. (2017). Use of Multi-Intake Temporal Dominance of Sensations (TDS) to Evaluate the Influence of Wine on Cheese Perception. *Journal of Food Science*（2017年11月）. DOI: 10.1111/1750-3841.13932（PMID: 29023703）
- **主要な知見**：常食者31名、チーズ4種（Époisses、Chaource、Comté 2種）を3口連続で評価し、間にワイン（ロゼ、白ブルゴーニュ、赤ブルゴーニュ、ボージョレ）を挟む条件と比較。ワインはチーズ属性の支配持続（特に塩味と一部香り）に影響したが（P<0.1）、**チーズの好み自体は変わらなかった**。
- **適用範囲と限界**：ワイン×チーズでの知見。方向性（飲料→固形物）の方法論モデルとして使う。
- **何に使えるか**：E-2 と対になる「飲料→固形物方向」の動的評価。茶（飲料）→チョコ（固形物）方向の知覚変化を論じる際の最も近い方法論モデル。
- **確認手段**：PubMedレコード。

#### E-4Galmarini, Dufau, Loiseau, Visalli & Schlich 2018（方法論）
- **書誌情報**：Galmarini, M.V., Dufau, L., Loiseau, A.-L., Visalli, M., Schlich, P. (2018). Wine and cheese: Two products or one association? A new method for assessing wine-cheese pairing. *Beverages*, 4(1), 13. DOI: 10.3390/beverages4010013（先行版：AAWE Working Paper No. 216, 2017。§7-18 でも UCA リポジトリで抄録全文を確認）
- **主要な知見**：ワイン3種×チーズ3種＝9組合せを、multi-bite／multi-sip TDS と同時 hedonic 評価（Temporal Drivers of Liking, TDL）で評価する方法を提示（消費者60名）。組合せでの否定的ドライバーは酸味（9組中7）・苦味（6）・渋味（5）とほぼワイン側由来で、肯定的ドライバーは多様だった。動的知覚変化は単品時より組合せ時の嗜好により強く影響した。
- **適用範囲と限界**：方法論研究。「苦味・酸味・渋味がペアのマイナスドライバ」という知見は、高カカオ×緑茶（苦＋渋の重なり）が A-2 で低評価だったことと整合する補助説明に使える。
- **何に使えるか**：茶×チョコレートを「単品プロファイルの並置」ではなく「組合せ自体を1つの対象として時間評価する」方法論の雛形。
- **確認手段**：アブストラクト転載を複数経路で照合＋UCA リポジトリ。

- E-5 Donadini, Fumi & Lambri 2013（チーズ×ビール）→ 主掲載 §2-18

#### E-6Donadini, Fumi & Newby-Clark 2015
- **書誌情報**：Donadini, G., Fumi, M.D., Newby-Clark, I.R. (2015). An investigation of matches of bottom fermented red beers with cheeses. *Food Research International*, 67, 376–389. DOI: 10.1016/j.foodres.2014.11.004
- **主要な知見**：消費者96名、下面発酵赤ビール8種×チーズ7種＝56ペア。選好は有意に変動し、消費者セグメントで構造が分かれた（約半数は全ペアを好む層、Parmigiano 中心に好む層、Fontina に中立で Mozzarella ペアを強く嫌う層等）。チーズ種（Parmigiano 最上位、Mozzarella 最下位）、ビール種、ビール／チーズ単体の官能好みがペア好みを偏らせたが、やはり「最も好きな同士の組合せ」にはならなかった。
- **適用範囲と限界**：ビール×チーズの知見。セグメント構造は消費者集団依存。
- **何に使えるか**：「ペア評価には消費者セグメントがある」根拠。アプリの平均表示だけでなく層別表示を考える際の出典。
- **確認手段**：論文PDFプレビューのアブストラクト。

### F. コーヒー×食品
#### F-1Rune, Münchow, Perez-Cueto & Giacalone 2022
- **書誌情報**：Rune, C.J.B., Münchow, M., Perez-Cueto, F.J.A., Giacalone, D. (2022). Pairing coffee with basic tastes and real foods changes perceived sensory characteristics and consumer liking. *International Journal of Gastronomy and Food Science*, 30, 100591. DOI: 10.1016/j.ijgfs.2022.100591
- **主要な知見**：コーヒー4種を基本味溶液の前後で DA し、甘い／塩味の食品とのペアで消費者好みを測定。基本味への曝露は後続のコーヒー属性強度を概ね下げた（苦味曝露のみ増加方向も）。好みの分散の56%はコーヒー自体の差（fruity/floral/berry系 vs chocolate/nutty/sweet系）、ペア相手が追加で20%を説明。酸味（sour）知覚は共通のマイナスドライバー。**chocolate・nutty・sweet なコーヒーが食品ペア向き**と結論。
- **適用範囲と限界**：コーヒー×チョコの直接研究は実質 A-2 に含まれる形のみで、独立した査読研究はこの探索でも見つからなかったことの傍証でもある。
- **何に使えるか**：逆方向（コーヒー側の chocolate ノートがペア向き）という示唆は、茶×チョコの香り軸設計に転用可能な仮説。
- **確認手段**：University of Southern Denmark 研究者ポータル。

- F-2 Rune et al. 2021（系統的レビュー）→ 主掲載 §2-7

### G. 未確認・非査読（アプリ根拠に使わないもの）
- **茶×チーズ**：Carine Baudry（ティー専門家）による Comté×ダージリン、Hojicha×Camembert 等の提案は Gault&Millau 誌インタビュー（2023）等の専門家言説のみ。査読官能研究は今回の探索では**確認できず**。アプリに載せるなら「専門家の提案（未検証）」ラベル必須。
- **台湾茶×ベーカリーの快楽反応**（Huang, 2017, 國立高雄餐旅大學修士論文とされる書誌が書誌データベースに出現）：論文本文・アブストラクトに到達できず**未確認**。緑茶／烏龍茶等の発酵度別にベーカリーと合わせた旨の断片のみ。

### §5 の残ギャップ
(1) A-2 本文の茶4種×チョコ3種の個別平均値表、(2) D-4（Port×チョコTDS論文）の著者・年の確定、(3) C-3（Choi & Lee）の巻号頁。これらは出版社ページへの直接アクセスが可能な環境で補完可能。

---

## §6 個人差・期待・方法論

§6 の総括（表示に直結する3点）：
1. **個人差は二重**——TAS2R38/PROP 系（A節）だけでは説明できず（6-4 が明言）、唾液の維持能力（B節、Dinnella系）が渋味・余韻の個人差を別途作る。
2. **表示は中立な情報ではない**——ラベル・価格・事前説明が経験自体を変え（C節）、効果は「試食前」に出した情報でのみ強く出る（6-13、6-14）。
3. **ペアリングは時間現象**——多回摂取 TDS の実証（6-16、チョコレートで §5 D-2）により、静的スコアより「支配感覚の遷移＋摂取順序」で示す方が方法論的に正当化できる。

### A. 味覚感受性の個人差：PROP/PTC・TAS2R38

#### 6-1Bartoshuk, Duffy & Miller 1994
- **書誌情報**：Bartoshuk, L.M., Duffy, V.B. & Miller, I.J. (1994). PTC/PROP tasting: Anatomy, psychophysics, and sex effects. *Physiology & Behavior*, 56(6), 1165–1171. DOI: 10.1016/0031-9384(94)90361-1
- **主要な知見**：PROP を強く苦く感じる一群を supertaster と定義した古典的総説。Supertaster は他の苦味・甘味物質やアルコール・カプサイシンの灼熱感も強く知覚し、舌前方茸状乳頭・味蕾密度と PROP 苦味が相関する。女性に supertaster が多いという性差も報告する。
- **適用範囲と限界**：総説。個人の感受性をアプリで判定するものではない。
- **何に使えるか**：「同じチョコレートでも苦味の感じ方には生得的な幅がある」という個人差の注意書きの第一根拠。強度表示を絶対値でなく幅で示す設計の根拠。
- **確認手段**：PubMed（PMID: 7878086）。

#### 6-2Duffy et al. 2004
- **書誌情報**：Duffy, V.B. et al. (2004). Bitter receptor gene (TAS2R38), 6-n-propylthiouracil (PROP) bitterness and alcohol intake. *Alcoholism: Clinical and Experimental Research*, 28(11), 1629–1637. DOI: 10.1097/01.alc.0000145789.55183.d4
- **主要な知見**：TAS2R38 の一般的ハプロタイプ AVI/PAV で PROP 苦味が有意に異なり、AVI/AVI は PAV 保有者より苦味が弱かった。ただし遺伝子型で分けた苦味差は心理物理学的基準で分けた差より小さく、高濃度 PROP 苦味の方がエタノール強度・飲酒量を遺伝子型よりよく予測した。遺伝子型＝知覚ではないことを示す実証。
- **適用範囲と限界**：対象はアルコール摂取との関連が中心。
- **何に使えるか**：「遺伝子型で決まる」と断定しない表現の根拠。原産地・品種の苦味説明に「感じ方には個人差がある」と添える際の留保。
- **確認手段**：PubMed（PMID: 15547448）。

#### 6-3Tepper 2008（総説）
- **書誌情報**：Tepper, B.J. (2008). Nutritional implications of genetic taste variation: The role of PROP sensitivity and other taste phenotypes. *Annual Review of Nutrition*, 28, 367–388. DOI: 10.1146/annurev.nutr.28.061807.155458
- **主要な知見**：PROP 表現型が食品嗜好・食行動・体重へつながる経路を評価した総説。TAS2R38 の関与は着実に示されてきた一方、栄養・健康上の意義全体は未確定とし、PROP スクリーニング法の違いによる論争や他の苦味・非苦味受容体の寄与も論じる。過大な一般化への歯止めを含む総説。
- **適用範囲と限界**：意義未確定の部分を含む総説である点自体が留保になる。
- **何に使えるか**：個人差セクションの総説的支柱。「苦手＝体質のせい」と決めつけず、嗜好は複数の要因で決まるという注意書きの根拠。
- **確認手段**：PubMed（PMID: 18407743）。

#### 6-4Hayes, Bartoshuk, Kidd & Duffy 2008
- **書誌情報**：Hayes, J.E., Bartoshuk, L.M., Kidd, J.R. & Duffy, V.B. (2008). Supertasting and PROP bitterness depends on more than the TAS2R38 gene. *Chemical Senses*, 33(3), 255–265. DOI: 10.1093/chemse/bjm084
- **主要な知見**：198名で遺伝子型・PROP表現型・茸状乳頭数を測定。閾値>0.15 mM はほぼ AVI/AVI だったが、閾値が低い者はどの遺伝子型でもあり得た。濃い PROP を苦く感じる者はショ糖・クエン酸・食塩・キニーネも強く感じ、それは遺伝子型と乳頭数を統制しても残った。結論は「supertasting は TAS2R38 多型によるものではない」。
- **適用範囲と限界**：6-2 と対で使う最重要の留保文献。
- **何に使えるか**：「TAS2R38 だけで苦味感受性は説明できない」ため、ペアリングの合う／合わないを単一遺伝子で説明する表示を避ける根拠になる。
- **確認手段**：PubMed（PMID: 18209019）。

#### 6-5Tepper et al. 2009
- **書誌情報**：Tepper, B.J. et al. (2009). Genetic variation in taste sensitivity to 6-n-propylthiouracil and its relationship to taste perception and food selection. *Annals of the New York Academy of Sciences*, 1170, 126–139. DOI: 10.1111/j.1749-6632.2009.03916.x
- **主要な知見**：人口の約30%が PROP/PTC に taste blind であること、テイスターは他の苦味・甘味・唐辛子の辛さ・アルコールの渋味・脂肪のテクスチャにも敏感と仮説化されてきたことを整理するモデル「PROP感受性→知覚→嗜好→選択」を提示する。知覚との関連は頑健だが、嗜好・食品選択への連鎖は実証が難しいと明言する。
- **適用範囲と限界**：モデル提示＋総説。連鎖の後段は未実証。
- **何に使えるか**：「知覚の差はあるが、好き嫌いまで自動的には決まらない」という段階分け表示の根拠。ペアリング推奨を「感じ方の傾向」止まりにする文言設計に使える。
- **確認手段**：PubMed（PMID: 19686122）。

#### 6-6Tepper et al. 2014
- **書誌情報**：Tepper, B.J. et al. (2014). Genetic sensitivity to the bitter taste of 6-n-propylthiouracil (PROP) and its association with physiological mechanisms controlling body mass index (BMI). *Nutrients*, 6(9), 3363–3381. DOI: 10.3390/nu6093363
- **主要な知見**：PROP 感受性は味覚個人差のマーカーで食品嗜好・食行動に影響し得るとする総説。寄与因子として(1) TAS2R38 変異、(2) 茸状乳頭の栄養因子 gustin を制御する遺伝子、(3) PROP 分子と受容体の結合を助け得る唾液タンパク質を挙げ、遺伝と唾液が接続する視点を示す。
- **適用範囲と限界**：BMI との関連が主題の一つであり、味表示への転用は A節の文脈に限る。
- **何に使えるか**：A節と B節（唾液）をつなぐ橋渡し文献。個人差の注意書きを「遺伝子」と「唾液」の2層で書く構成の根拠。
- **確認手段**：出版社 MDPI ページ（検索結果表示で書誌・アブストラクト確認）。

### B. 唾液の個人差
- B-1 Dinnella et al. 2009 → 主掲載 §3-4
- B-2 Dinnella et al. 2010 → 主掲載 §3-5（§6 ラインでは書誌のみ確認［PMC収載の後続論文の参考文献リストで確認］、§3 ラインでは出版社版面・アブストラクトで一次確認済み）

#### 6-7Dinnella et al. 2011
- **書誌情報**：Dinnella, C., Recchia, A., Tuorila, H. & Monteleone, E. (2011). Individual astringency responsiveness affects the acceptance of phenol-rich foods. *Appetite*, 56(3), 633–642. DOI: 10.1016/j.appet.2011.02.017
- **主要な知見**：唾液特性の維持/変動で77名を低応答（LR）・中応答（MR）・高応答（HR）に分け、タンニン酸を加えたジュースで検証。HR ではタンニン増加に伴う渋味上昇が大きく、好みも低下した。LR は最も渋い製品を HR より高く評価し、渋い製品への親熟度も高かった。唾液の生理的個人差がフェノール豊富食品の受容に影響すると結論する。
- **適用範囲と限界**：タンニン酸添加ジュースでの検証。
- **何に使えるか**：「渋味に強い人/弱い人で同じペアリングの好みが逆転し得る」ことの直接根拠。評価を一つのスコアに潰さず、渋味耐性別の見方を示す根拠になる。
- **確認手段**：著者所属機関（フィレンツェ大学）リポジトリ。

- B-4 Fischer, Boulton & Noble 1994 → 主掲載 §3-29（§6 ラインでは DOI 未確認として記録。低流量群は高流量群より苦味・渋味の最大到達が遅く持続が長く、タンニン酸添加ワインでは最大強度も高かったという要旨断片の範囲）

### C. 期待と情報の効果

#### 6-8Deliza & MacFie 1996
- **書誌情報**：Deliza, R. & MacFie, H.J.H. (1996). The generation of sensory expectation by external cues and its effect on sensory perception and hedonic ratings: A review. *Journal of Sensory Studies*, 11(2), 103–128. DOI: 10.1111/j.1745-459X.1996.tb00036.x
- **主要な知見**：※二次範囲：包装・ラベル等の外的手がかりが感覚的期待を生成し、実際の知覚と快評価を同化（assimilation：期待方向へずれる）または対比（contrast：逆方向へずれる）させる枠組みを整理した基礎総説。不一致が小さいと同化、大きいと対比が起きやすいという後続総説への引継ぎで知られる。
- **適用範囲と限界**：Wiley 一次ページのアブストラクトは未開封のため書誌のみ。一次確認後に格上げすべき最優先候補。
- **何に使えるか**：本領域の理論的起点。アプリの説明文自体が期待を作り体験を変える、という自己言及的な注意書き（「説明を読んでから味わうと感じ方が変わり得る」）の根拠。
- **確認手段**：PMC収載の複数総説・論文の参考文献リストで書誌・DOI を相互確認。

#### 6-9Piqueras-Fiszman & Spence 2015（総説）
- **書誌情報**：Piqueras-Fiszman, B. & Spence, C. (2015). Sensory expectations based on product-extrinsic food cues: An interdisciplinary review of the empirical evidence and theoretical accounts. *Food Quality and Preference*, 40(Pt A), 165–179. DOI: 10.1016/j.foodqual.2014.09.013
- **主要な知見**：外的手がかりによる期待が食品・飲料の感覚知覚・快評価・摂取量に与える影響の総説。実験室研究だけでなくレストラン・食堂・バーの実地研究も批判的に評価し、認知神経科学と予測符号化・ベイズ意思決定の観点まで接続する。6-8 の現代版アップデートに当たる。
- **適用範囲と限界**：総説。効果は手がかりと文脈に依存する。
- **何に使えるか**：原産地・品種・価格・物語といった表示要素すべてが「情報」として味を変え得ることの包括的根拠。ブラインド評価と情報あり評価を分けて表示する設計の正当化に使える。
- **確認手段**：APA PsycNet。

#### 6-10Yeomans, Chambers, Blumenthal & Blake 2008
- **書誌情報**：Yeomans, M.R., Chambers, L., Blumenthal, H. & Blake, A. (2008). The role of expectancy in sensory and hedonic evaluation: The case of smoked salmon ice-cream. *Food Quality and Preference*, 19(6), 565–573. DOI: 10.1016/j.foodqual.2008.02.009
- **主要な知見**：同一のスモークサーモン・アイスクリームでも「アイスクリーム」とラベルすると強く嫌われ塩味・セイボリーさも強く評定され、「冷製セイボリー・ムース」とラベルすると受容された（3実験）。期待と実際の乖離が大きい場合の対比効果と、予期せぬ感覚特性の増強を実演した古典的実験。
- **適用範囲と限界**：極端な事例（サーモンアイス）での実演であり、通常のペアリングへの効果量は別問題。
- **何に使えるか**：意外なペアリングの命名・見せ方で受容が変わることの実証。「まずい」のではなく「期待とのズレ」が嫌悪を生む場合があるという説明に使える。
- **確認手段**：APA PsycNet。

#### 6-11Plassmann, O'Doherty, Shiv & Rangel 2008
- **書誌情報**：Plassmann, H., O'Doherty, J., Shiv, B. & Rangel, A. (2008). Marketing actions can modulate neural representations of experienced pleasantness. *Proceedings of the National Academy of Sciences USA*, 105(3), 1050–1054. DOI: 10.1073/pnas.0706929105
- **主要な知見**：fMRI 下で、実際は同一のワインを異なる価格と信じて飲むと、価格が高いほどフレーバーの快の主観報告が高まり、経験的快を符号化するとされる内側眼窩前頭皮質の活動も増えた。
- **適用範囲と限界**：小標本の fMRI 研究である点は過大解釈しないこと。
- **何に使えるか**：価格・格付け表示が味の快を変え得ることの神経科学的根拠。高級・希少といった訴求を表示する際の効果と倫理的留保の両方に使える。
- **確認手段**：PubMed（PMID: 18195362）。

#### 6-12Lee, Frederick & Ariely 2006
- **書誌情報**：Lee, L., Frederick, S. & Ariely, D. (2006). Try it, you'll like it: The influence of expectation, consumption, and revelation on preferences for beer. *Psychological Science*, 17(12), 1054–1058. DOI: 10.1111/j.1467-9280.2006.01829.x
- **主要な知見**：バルサミコ酢入りビールで、ブラインドでは好まれたのに、成分を試飲「前」に知らされると好みが下がり、試飲「後」に知らされても下がらなかった。情報のタイミングが決定的で、開示が経験そのものに影響したのであって、事後の解釈の書き換えではないことを示した。
- **適用範囲と限界**：単一製品での実験。
- **何に使えるか**：「説明は味わう前に出すか、後に回すかで効果が違う」という表示順序設計の直接根拠。ネタバレ的情報（意外な素材・製法）を後出しにする UI の根拠になる。
- **確認手段**：出版社 SAGE ページ。

#### 6-13Siegrist & Cousin 2009
- **書誌情報**：Siegrist, M. & Cousin, M.-E. (2009). Expectations influence sensory experience in a wine tasting. *Appetite*, 52(3), 762–765. DOI: 10.1016/j.appet.2009.02.002
- **主要な知見**：※書誌データベース記録の範囲：ワインについて肯定的/否定的情報を試飲前/後に与えると、前出しの否定的情報でのみ評定が下がり、後出しでは効果がなかった。6-12 と同型の結果で、情報が全体評価ではなく感覚経験自体を形作ることを支持する。
- **適用範囲と限界**：出版社一次ページ未開封のため書誌のみ。
- **何に使えるか**：6-12 の食品領域での再現として、批評家スコア・受賞歴などの外部評価情報を出すタイミング設計の補強根拠。
- **確認手段**：書誌データベース記録（BibBase）。

### D. 時間的官能評価の方法論：TDS / TI

#### 6-14Pineau et al. 2009（TDS原典）
- **書誌情報**：Pineau, N. et al. (2009). Temporal Dominance of Sensations: Construction of the TDS curves and comparison with time-intensity. *Food Quality and Preference*, 20(6), 450–455. DOI未確認（出典に明示なし、推測で付けない）
- **主要な知見**：※記録範囲：TDS は1回の評価で最大10属性について「その時点で最も支配的な感覚」を選び続け、支配の推移を TDS 曲線として描く手法。5種の乳製品で TI と比較し、感覚の全体的パターンは近いが、TDS の方が感覚の「継起（順序）」を際立たせた。
- **適用範囲と限界**：出版社一次ページのアブストラクト未開封のため書誌のみ。一次確認後に格上げすべき候補。
- **何に使えるか**：ペアリングを静的な相性点数ではなく「先に何が立ち、次に何が来るか」の時間系列で表示する手法論的根拠の中核。
- **確認手段**：FAO AGRIS 書誌記録と学術PDFの書誌で確認。

#### 6-15Labbe, Schlich, Pineau, Gilbert & Martin 2009
- **書誌情報**：Labbe, D., Schlich, P., Pineau, N., Gilbert, F. & Martin, N. (2009). Temporal dominance of sensations and sensory profiling: A comparative study. *Food Quality and Preference*, 20(3), 216–221. DOI: 10.1016/j.foodqual.2008.10.001
- **主要な知見**：※論文PDF冒頭の範囲：TDS は TI と違い、知覚空間の多次元性を時間軸で扱う。ゲル製品で通常の官能プロファイリングと比較し、TDS はプロファイリングに近い信頼できる情報を与えたうえ、摂取後の知覚ダイナミクスという従来法にない情報を追加した。
- **適用範囲と限界**：出版社ページ未到達のため書誌のみ。
- **何に使えるか**：「TDS 表示は通常の風味プロファイルの代替ではなく、時間情報を足すもの」という位置づけ表示の根拠。
- **確認手段**：論文PDF冒頭（雑誌体裁）で書誌・要旨断片を確認。

#### 6-16Cliff & Heymann 1993（TI総説）
- **書誌情報**：Cliff, M. & Heymann, H. (1993). Development and use of time-intensity methodology for sensory evaluation: A review. *Food Research International*, 26(5), 375–385. DOI未確認
- **主要な知見**：※総説要旨の範囲：TI 法の約40年の発展、平均曲線の算出と解釈の洗練、別名の対応表と応用研究の集成をまとめた TI 方法論の基礎総説。TI は単一属性の強度の立ち上がり・最大・持続・減衰を追う方法として位置づけられる。
- **適用範囲と限界**：一次アブストラクト未開封のため書誌のみ。
- **何に使えるか**：渋味・苦味など単一属性の「余韻カーブ」を描く場合の方法論的出典。TDS（多属性の支配交代）と TI（単属性の強度推移）を使い分ける表示設計の根拠。
- **確認手段**：ScienceDirect 著者ページの総説要旨と複数後続論文の引用で書誌を確認。

#### 6-17Galmarini, Loiseau, Visalli & Schlich 2016（チーズ→ワイン TDS）
- **書誌情報**：Galmarini, M.V., Loiseau, A.-L., Visalli, M. & Schlich, P. (2016). Use of multi-intake Temporal Dominance of Sensations (TDS) to evaluate the influence of cheese on wine perception. *Journal of Food Science*, 81(10), S2566–S2577. DOI: 10.1111/1750-3841.13500
- **主要な知見**：消費者31名が4種のワインを3口連続で評価し、別セッションでは一口ごとにチーズを挟んだ多回摂取 TDS を実施。チーズは全ワインの記述と多くのワインの好みに影響し、例えば Madiran では全チーズが渋味と酸味の支配持続時間を減らし赤い果実香の持続を増やした。食品→飲料方向の影響を動的に捉えたペアリング TDS の代表例。
- **適用範囲と限界**：ワイン×チーズでの知見。お茶×チョコへの適用は方法論の類推。
- **何に使えるか**：お茶×チョコレートへの最も近い類推元の一つ。「一口ごとに相手が次の印象を変える」ため単回評価では不十分、という多回摂取表示・順序表示の直接根拠になる。
- **確認手段**：大学リポジトリ（HAL / Université de Bourgogne、PMID: 27669492 併記）。

- D-5 Isac-Torrente et al. 2023 → 主掲載 §5 D-2

#### 6-18Spence, Wang & Youssef 2017（順序の総説）
- **書誌情報**：Spence, C., Wang, Q.J. & Youssef, J. (2017). Pairing flavours and the temporal order of tasting. *Flavour*, 6, 4. DOI: 10.1186/s13411-017-0053-0
- **主要な知見**：同じ組み合わせでも同時か、どの順序で味わうかで体験が変わることを論じた総説。フレーバー・マッチングの3原理（類似・対比・相乗/創発）を化学的・心理学的・計算論的戦略から評価し、文化的差異を踏まえた心理学的説明が実用的示唆に最も富むと論じる。ワイン×チーズの多回摂取 TDS 研究も引用し、チーズがワインを変える方向の影響の非対称性に触れる（§4-24、§7-6 にも記録あり）。
- **適用範囲と限界**：総説。個別ペアの順序効果の断定には実験論文（§4-22、§4-23）との併用が必要。
- **何に使えるか**：「お茶→チョコレート／チョコレート→お茶」で推奨順序を分けて表示する根拠の総説的支柱。類似・対比・相乗というペアリング説明の3分類の出典にもなる。
- **確認手段**：出版社 Springer 誌誌ページ。

### E. 順応・感覚疲労

#### 6-19Dalton 2000（嗅覚順応の総説）
- **書誌情報**：Dalton, P. (2000). Psychophysical and behavioral characteristics of olfactory adaptation. *Chemical Senses*, 25(4), 487–492. DOI: 10.1093/chemse/25.4.487
- **主要な知見**：嗅覚順応を測る心理物理学的・行動学的指標を総説し、順応のパラメトリック特徴（特異性、濃度依存性、持続時間依存性）を整理する。受容体レベル以外の過程（匂い物質の沈着/クリアランス、認知による調節）も順応の程度に影響すると結論する。
- **適用範囲と限界**：総説。個別食品での順応量を示すものではない。
- **何に使えるか**：香りの強いお茶・チョコレートを連続で比べると香りが鈍る「嗅覚順応」の基礎根拠。試飲順（淡いもの→強いもの）、休憩・リセットを挟む推奨表示の根拠になる。
- **確認手段**：APA PsycNet。

### F. 温度

#### 6-20Talavera et al. 2005
- **書誌情報**：Talavera, K. et al. (2005). Heat activation of TRPM5 underlies thermal sensitivity of sweet taste. *Nature*, 438(7070), 1022–1025. DOI: 10.1038/nature04248
- **主要な知見**：※記録範囲：甘味・苦味・うま味の伝達に関わるイオンチャネル TRPM5 は熱で活性化され、電流は15–35°Cで急峻に増える。野生型マウスでは同温度域で甘味への味覚神経応答が増強され、ノックアウトでは見られなかった。温めると甘味（と苦味）が強まる分子機構の候補を示した。
- **適用範囲と限界**：**既存 M9 の根拠として登録済み**であり、本書では再掲に留める。マウス＋細胞系の研究であり、ヒトのペアリング温度差への直接適用は推論である旨の留保が必須。
- **何に使えるか**：温かいお茶と合わせるとチョコレートの甘味・苦味が立ちやすく、冷たい飲料では鈍る可能性の機構的根拠。
- **確認手段**：Nature 誌ページへのリンクを含む学術データベース記録で書誌・DOI・アブストラクト要旨を確認（Nature 一次ページ本文は未開封のため書誌のみ）。

#### 6-21Green & Nachtigal 2012
- **書誌情報**：Green, B.G. & Nachtigal, D. (2012). Somatosensory factors in taste perception: Effects of active tasting and solution temperature. *Physiology & Behavior*, 107(4), 488–495. DOI: 10.1016/j.physbeh.2012.05.010
- **主要な知見**：ヒト心理物理実験で、(1) 舌と口蓋の能動的運動が MSG のうま味だけを増強すること、(2) 舌尖でのショ糖甘味への順応速度が温度に強く影響され、加温は順応を遅らせる（キニーネ苦味では見られない）ことを示した。温度と触覚はフレーバーの成分であると同時に味覚の調節因子でもあると論じる（既存出典 Green et al. 2012 とは別論文）。
- **適用範囲と限界**：溶液系の心理物理実験。味質によって温度効果が異なる点も表示の留保になる。
- **何に使えるか**：温度×順応の交差根拠。「温かいお茶の後は甘味が残りやすく、次のチョコレートの甘味の感じ方が変わり得る」という順序・温度の注意書きに使える（M9 の補強）。
- **確認手段**：PubMed（PMID: 22609629）。

### §6 の未確認
- **Bartoshuk, L.M., McBurney, D.H. & Pfaffmann, C. (1964). Taste of sodium chloride solutions after adaptation to sodium chloride: Implications for the "water taste." *Science*, 143, 967–968.**：教科書的二次資料と後続論文の引用（DOI: 10.1126/science.143.3609.967 と転載あり）でのみ存在を確認。Science 一次ページでアブストラクトを目視できていないため**未確認**。味覚順応と「water taste」の古典であり、到達できれば E節の古典として格上げ候補。
- **「飲料と食品の温度差そのもの（温度マッチング）」を直接検証したペアリング研究**：本探索では一次情報に到達した該当研究は**見つからなかった**。6-20、6-21 は温度が単独の味覚知覚を変える研究であり、「熱いお茶×常温チョコレート」のような温度差条件の優劣を直接示すものではない。この空白自体が、アプリで温度マッチングを断定的に表示しない根拠になる。

---

## §7 総説集・ハンドブック章・学位論文レベル

冒頭の訂正（§7 ラインの確認結果）：
- 「de Klepper のワーヘニンゲン学位論文」は確認できなかった。確認できた de Klepper 文献は学位論文ではなく、7-19 の論説（*Gastronomica* 2011）である。「食品ペアリング理論の学位論文」として引用してはならない。
- Galmarini についても、単独の学位論文レコードは確認できなかった。確認できたのは §2-6・§5 E-3/E-4・6-17 等の総説とワイン×チーズ論文であり、「Galmarini 学位論文」とは表記しないこと。
- 書店サイト掲載の *Multisensory Flavor Perception* の目次要約（「Taste-aroma-trigeminal-texture interactions」等の章題）は、ScienceDirect／Elsevier Shop の実際の章構成と一致しない。章題・頁は出版社側（7-1a〜1c）を優先すること。

### A. ハンドブック／書籍章

#### 7-1aPiqueras-Fiszman & Spence（編）2016
- **書誌情報**：Piqueras-Fiszman, Betina & Spence, Charles（編）(2016). *Multisensory Flavor Perception: From Fundamental Neuroscience Through to the Marketplace*. Woodhead Publishing（Elsevier）, 376 pp. ISBN 978-0-08-100350-3（eBook 9780081003510）
- **主要な知見**：味・香り・口腔体性感覚・色・音・容器・期待・記憶・個人差がフレーバー知覚と嗜好に与える跨感覚相互作用を、神経科学から市場応用まで総説する編著。第14章は飲用容器（drinking receptacle）が内容物の知覚に与える影響を扱い、茶器の形状が茶の知覚に影響するという表示の理論的裏付けになる。
- **適用範囲と限界**：書籍（編著、章は総説。査読の有無は出版社ページに明記なし）。
- **何に使えるか**：ペアリング説明の「多感覚統合」「期待・容器・文脈効果」の章立て根拠。特に「味は単独成分の足し算ではない」というアプリ方針の典拠。
- **確認手段**：出版社ページ（Elsevier Shop）を直接開覧し、説明・全目次・編者略歴・刊行日（2016-04-14）を確認。ScienceDirect の書籍ページでも目次を確認。

#### 7-1bStevenson 2016
- **書誌情報**：Stevenson, Richard J. (2016). Attention and Flavor Binding. In: *Multisensory Flavor Perception*, Chapter 2, pp. 15–35. DOI: 10.1016/B978-0-08-100350-3.00002-X
- **主要な知見**：味・嗅覚・口腔体性感覚が単一の「フレーバー」体験に結合（binding）される5つの特徴と、preattentive な局在化と注意捕捉による説明を総説する。フレーバーが分析的成分知覚ではなく統合知覚であることを示す。
- **適用範囲と限界**：書籍章（総説）。
- **何に使えるか**：「化合物の共有＝足し算」モデルへの留保と、統合知覚としてペアリングを説明する際の根拠。
- **確認手段**：ScienceDirect の章ページ（章抄録・頁・DOI を確認）。

#### 7-1cDijksterhuis 2016
- **書誌情報**：Dijksterhuis, Garmt (2016). Multisensory Flavor Priming. In: *Multisensory Flavor Perception*, Chapter 7, pp. 133–153. DOI: 10.1016/B978-0-08-100350-3.00007-9
- **主要な知見**：フレーバー・プライミングの分類を提示し、感覚的な bottom-up 過程と期待等の top-down 過程が無意識に相互作用して知覚・嗜好・選択を形作るモデルを提案する。
- **適用範囲と限界**：書籍章（総説）。
- **何に使えるか**：同じ茶でも「先にチョコレートの香りを提示する順序」で知覚が変わる、という順序表示や、商品説明文が知覚を変える効果の根拠（§6 C節と接続）。
- **確認手段**：ScienceDirect の章ページ。

#### 7-2aEtiévant, Guichard, Salles & Voilley（編）2016
- **書誌情報**：Etiévant, Patrick; Guichard, Elisabeth; Salles, Christian; Voilley, Andrée（編）(2016). *Flavor: From Food to Behaviors, Wellbeing and Health*. Woodhead Publishing（Elsevier）, Woodhead Series No. 299. ISBN 978-0-08-100295-7
- **主要な知見**：食品マトリクスからの味・香り化合物の保持と放出、嗅覚・味覚知覚と統合、フレーバー知覚と摂食行動・満腹・嗜好学習、生理状態による変調までを扱う編著。ペアリング関連では第1章（マトリクスとの相互作用と口腔内放出）と 7-2b・7-2c が中核。
- **適用範囲と限界**：書籍（編著）。
- **何に使えるか**：カカオバター等の脂質マトリクスが茶の香り放出・渋み知覚を変える、という「マトリクス効果」表示の枠組み（§4 と接続）。
- **確認手段**：ScienceDirect 書籍ページを直接開覧し、説明・全目次（5部18章）・編者・2016年刊を確認。

#### 7-2bThomas-Danguin, Sinding, Tournier & Saint-Eve 2016
- **書誌情報**：Thomas-Danguin, Thierry; Sinding, Charlotte C.; Tournier, Carole; Saint-Eve, Anne (2016). Multimodal interactions. In: *Flavor: From Food to Behaviors, Wellbeing and Health*, Chapter 5, pp. 121–141. DOI: 10.1016/B978-0-08-100295-7.00006-2（HAL: hal-01583753）
- **主要な知見**：物理化学的機序（組成・構造・口腔処理による刺激放出）と知覚的機序（受容体から脳への統合）の2層で多感覚相互作用を総説する。閾値下・閾値上での嗅覚–味覚統合、香り–味相互作用の神経生理、三叉神経・テクスチャとの相互作用を含む。
- **適用範囲と限界**：書籍章（総説）。本領域で最も直接使える章。
- **何に使えるか**：「香りが甘さを増す」「テクスチャが香り・味を変える」等の相互作用表示の一次典拠として優先度が高い。
- **確認手段**：HAL（INRAE系リポジトリ）のレコードと ScienceDirect 章抄録の双方で確認。

#### 7-2cBriand & Salles 2016
- **書誌情報**：Briand, Loïc & Salles, Christian (2016). Taste perception and integration. In: *Flavor: From Food to Behaviors, Wellbeing and Health*, Chapter 4, pp. 101–119. DOI: 10.1016/B978-0-08-100295-7.00004-9
- **主要な知見**：甘・うま・苦・塩・酸の5基本味と三叉神経化合物、その生理、味覚知覚の統合と脳レベルでの味–味相互作用を総説する。
- **適用範囲と限界**：書籍章（総説）。
- **何に使えるか**：茶の苦み・渋みとチョコレートの甘さ・脂肪による苦み抑制など「味–味相互作用」の基礎表示の根拠（§3 B節と接続）。
- **確認手段**：ScienceDirect 章ページ。

#### 7-3Guichard, Salles, Morzel & Le Bon（編）2016
- **書誌情報**：Guichard, Elisabeth; Salles, Christian; Morzel, Martine; Le Bon, Anne-Marie（編）(2016). *Flavour: From Food to Perception*. Wiley-Blackwell, 432 pp. ISBN 9781118929414
- **主要な知見**：目次に第14章 Thomas-Danguin, Barba, Salles & Guichard「Perception of mixtures of odorants and tastants: sensory and analytical points of view」p. 319– を含むことを確認。出版社（Wiley）の商品ページ自体は開覧していないため、章の内容要約はしない。
- **適用範囲と限界**：書誌のみ確認。
- **何に使えるか**：7-2b と同系統（混合物の知覚）の別ハンドブックとして、入手時に 7-2b と突き合わせて使う候補。
- **確認手段**：Google Books レコードと書籍目次転載。

### B. ペアリング理論の総説
- 7-4 Spence 2020（批判的総説）→ 主掲載 §2-5
- 7-5 Spence, Wang & Youssef 2017（順序の総説）→ 主掲載 §6 6-18（§4-24 にも記録）
- 7-6 Galmarini 2020（方法論レビュー）→ 主掲載 §2-6
- 7-7 Rune, Münchow & Perez-Cueto 2021（系統的レビュー）→ 主掲載 §2-7

#### 7-8Spence 2020（多感覚フレーバーの総説）
- **書誌情報**：Spence, Charles (2020). Multisensory flavour perception: Blending, mixing, fusion, and pairing within and between the senses. *Foods* 9(4), 407. DOI: 10.3390/foods9040407
- **主要な知見**：2要素以上を組み合わせた際の blending / mixing / fusion / pairing の帰結を総説し、後半では音楽・サウンドスケープとのペアリング（sonic seasoning）へ同じ知覚原理を拡張する。本文中で tea/coffee と cheese/chocolate のペアリングへの言及箇所も確認した。
- **適用範囲と限界**：査読論文（Review、オープンアクセス）。
- **何に使えるか**：ペアリングを「融合させるのか、対比を味わわせるのか」という提示設計の分類に使える。
- **確認手段**：出版社（MDPI）ページの抄録・書誌。

### C. 学位論文

#### 7-9Eschevins 2018
- **書誌情報**：Eschevins, Anastasia (2018). *Matching beer with food: pairing principles, underlying mechanisms and a focus on aromatic similarity*. Doctoral thesis, Université Bourgogne Franche-Comté（Centre des Sciences du Goût et de l'Alimentation）. NNT: 2018UBFCK057. HAL: tel-02084896
- **主要な知見**：専門家（ソムリエ／ビール専門家）の言説分析から、ペアリングは知覚的・概念的・情緒的特徴に支配され、物理化学的・知覚的・認知的過程に対応することを示す。専門家が主要原理として挙げた「aromatic similarity（香りの類似性）」の知覚機序を実験的に検証し、類似性は組合せの harmony と homogeneity を上げ complexity を下げ、その効果は共有香りへ注意を向けると強まることを示した（論文版は §2-19、§2-20）。
- **適用範囲と限界**：学位論文（査読誌論文とは格付けを分ける）。対象はビール×食品。
- **何に使えるか**：本領域で最も体系的なペアリング学位論文。「香りの類似性＝無条件に良い」ではなく「調和は上がるが複雑さは下がる」というトレードオフ表示の根拠として、§2-5（Spence の批判）と対で使うのが適切。
- **確認手段**：HAL（theses.hal.science）の全文PDFを直接開覧し、表紙・英語 Summary・仏語 Résumé を確認。

#### 7-10Hofmann 2018
- **書誌情報**：Hofmann, Saskia Iris (2018). *The mouthfeel of black tea beverages*. PhD thesis, University of Nottingham.
- **主要な知見**：紅茶飲料の mouthfeel を QDA による語彙開発と訓練パネル（n=10）で検討した博士研究。渋み以外に脂肪由来の thickness／slipperiness／mouth coating が重要であり、脂肪と糖は渋み・苦み強度を同様に下げること、渋みと苦みは複数口で蓄積し時間プロファイルが異なること、糖の渋み低減は粘度ではなく甘さによることを示した。
- **適用範囲と限界**：学位論文。訓練パネル n=10 の知見。
- **何に使えるか**：チョコレートの脂肪・甘さが茶の渋み・苦みをどう変えるか（modulation）の機序説明に直接使える茶側の学位論文（M6・M7 の補強）。時間評価（複数口での蓄積）表示の根拠にもなる。
- **確認手段**：大学リポジトリ Nottingham ePrints（Item ID 52182）の抄録全文・指導教員（Wolf, Ford）を確認。

#### 7-11Sisopha 2014
- **書誌情報**：Sisopha, Anita (2014). *Flavour Analysis of Green Tea Enriched Cookies using Sensory and Instrumental Techniques*. MSc thesis, University of Guelph（指導 Duizer, Lisa）. hdl.handle.net/10214/8331
- **主要な知見**：緑茶強化クッキーについて、SIFT-MS による揮発成分と官能特性の関係、および咀嚼中の動的評価（TDS と in-mouth volatiles）を組み合わせてフレーバーを解析した修士研究。カテキン由来の負の官能特性が消費者嗜好に影響する問題意識から出発する。
- **適用範囲と限界**：学位論文（修士）。対象は配合（緑茶入りクッキー）でありペアリングではない。
- **何に使えるか**：茶×焼菓子（チョコレート菓子の近傍領域）の「動的フレーバー評価」の方法論参照。茶を食品側に組み込む場合の評価設計に使える。
- **確認手段**：大学リポジトリ（Atrium, University of Guelph）のレコード。

#### 7-12Zahidah 2021
- **書誌情報**：Zahidah, Inas (2021). *Evaluasi Sensori Food Pairing Makanan Pendamping dalam Menikmati Teh*（英題：Food Pairing Sensory Evaluation of Complimentary Food for Consuming Tea）. Undergraduate Thesis, IPB University（指導 Hunaefi, Dase）. 同内容は *Canrea Journal* の論文「Consumer preference of food pairing tea: Sensory approach」としても公刊されている。
- **主要な知見**：オンライン調査・FGD・CATA 法（home use test）で茶の伴食を検討した研究。甘い温かい紅茶×ビスケットが好まれ、理想的組合せの属性は buttery, creamy, gurih kelapa（ココナッツの旨み）, sandy, manis（甘い）であり、最も理想に近い組合せは甘さを上げ buttery／creamy な mouthfeel を高め sandy な食感を下げた。
- **適用範囲と限界**：学位論文（学部、インドネシア語）。中国語圏ではない点は明示が必要。
- **何に使えるか**：東南アジア圏の「茶×甘い焼菓子」の消費者データとして、欧州中心の文献の地域的偏りを補う材料。
- **確認手段**：大学リポジトリ（repository.ipb.ac.id, handle/123456789/106043）を直接開覧し、抄録（尼英両言語）・学位種別を確認。

### D. 茶の官能科学総説
- 7-13 Romeo-Arroyo et al. 2023 → 主掲載 §5 B-1（§7 ラインでは掲載誌を *International Journal of Gastronomy and Food Science*［PMC: PMC9829690, PMID: 36636724］として記録していたが、PMC全文で確認した *Current Research in Food Science* 6:100432 を正とする）

#### 7-14Zhang, Cao, Granato, Xu & Ho 2020
- **書誌情報**：Zhang, Liang; Cao, Qing-Qing; Granato, Daniel; Xu, Yong-Quan; Ho, Chi-Tang (2020). Association between chemistry and taste of tea: A review. *Trends in Food Science & Technology* 101, 139–149. DOI: 10.1016/j.tifs.2020.05.015
- **主要な知見**：*Camellia* 茶の化学組成と苦み・渋み・甘い後味・うま味の関係を総説する。主な渋み化合物は flavonol-O-glycosides、タンニン、ガロイル化カテキンであり、カフェインと非ガロイル化カテキンが苦みを強める。うま味には L-theanine、コハク酸、没食子酸、theogallin が寄与し、甘い後味はガロイル化カテキンの加水分解に帰せられる。加工がポリフェノールを変え茶種ごとの味を生む。
- **適用範囲と限界**：査読論文（Review）。茶単独の味化学の総説であり、ペアリング効果そのものではない。
- **何に使えるか**：中国系著者群による茶の味化学の基準総説。チョコレート側の苦み・渋み成分と「重なる／打ち消す」関係を化合物レベルで書く際の茶側典拠。
- **確認手段**：出版社（ScienceDirect）の抄録と、巻号・頁・DOI を図書館レコード複数で突合。

#### 7-15Yu et al. 2025
- **書誌情報**：Yu, Yashu; Feng, Xiaoxiao; Blank, Imre; Wang, Haoli; Zhu, Yiwen; Liu, Zhibin; Ni, Li; Lin, Chih-Cheng; Wang, Kequn; Liu, Yuan (2025). A review of umami taste of Tea: Substances, perception mechanism, and physiological measurement prospects. *Trends in Food Science & Technology* 162, 105082. DOI: 10.1016/j.tifs.2025.105082
- **主要な知見**：茶のうま味物質（L-theanine、L-グルタミン酸、L-アスパラギン酸、コハク酸、メチル化カテキン等）と増強因子、T1R1/T1R3 受容体との相互作用、正鼻・逆鼻・味覚の3経路からなる知覚機序、神経イメージング・電気生理による生理計測の展望を総説し、多感覚的相乗（multi-sensory synergy）によるうま味増強の可能性を論じる。
- **適用範囲と限界**：査読論文（Review）。相乗の可能性は展望段階の議論を含む。
- **何に使えるか**：茶のうま味を「薄さ」ではなく積極的なペアリング軸（チョコレートの塩味・うま味・コクとの相乗）として表示する際の根拠（M10 の補強）。
- **確認手段**：ScienceDirect の当該巻（Vol. 162, August 2025）目次レコードで著者・論文番号を確認し、抄録転載で内容範囲を確認（DOI は引用レコードで確認）。

### E. チョコレート／カカオ官能科学の追加総説

#### 7-16Augusto & Bolini 2022
- **書誌情報**：Augusto, Pedro Pio C. & Bolini, Helena M. A. (2022). The role of conching in chocolate flavor development: A review. *Comprehensive Reviews in Food Science and Food Safety* 21(4), 3274–3296. DOI: 10.1111/1541-4337.12975. PMID: 35638351
- **主要な知見**：チョコレート製造の最終工程コンチングがフレーバーをどう仕上げるかを総説する。フレーバーは主に逆鼻香と odor-active compounds に依存する複合知覚であり、時間・温度（ほか換気・エネルギー投入・機械構成）が鍵化合物の濃度とマトリクス内分布・結合を変え、摂取時の放出速度を変えることで風味を変える。
- **適用範囲と限界**：査読論文（Review）。製法の総説でありペアリング研究ではない。
- **何に使えるか**：同じカカオ含有率でも製法でフレーバー放出が違う、というチョコレート側の「製法表示」の根拠。茶との組合せで放出タイミングがずれる説明にも使える（§4 と接続）。
- **確認手段**：PubMed レコード。

#### 7-17Kongor et al. 2016
- **書誌情報**：Kongor, John Edem; Hinneh, Michael; Van de Walle, Davy; Afoakwa, Emmanuel Ohene; Boeckx, Pascal; Dewettinck, Koen (2016). Factors influencing quality variation in cocoa (*Theobroma cacao*) bean flavour profile — A review. *Food Research International* 82, 44–52. DOI: 10.1016/j.foodres.2016.01.012
- **主要な知見**：カカオ豆フレーバーの変動要因（遺伝型、パルプ前処理・発酵・乾燥等の収穫後処理、焙煎等の工業工程、土壌・樹齢）を総説する。遺伝型が貯蔵タンパク質・多糖・ポリフェノール含量を決め、発酵・乾燥で形成されるフレーバー前駆体の量と種類を規定する。土壌化学組成と樹齢の影響は未解明の研究空白として明示される。共著者に Afoakwa が含まれるが、除外対象の Afoakwa et al. (2008) とは別論文である点に注意。
- **適用範囲と限界**：査読論文（Review）。豆フレーバーの変動要因の総説であり、ペアリング効果ではない。
- **何に使えるか**：チョコレートの「産地・品種」軸の科学的裏付けと、「産地だけで風味は決まらない（発酵・焙煎が介在）」という留保表示の根拠。
- **確認手段**：著者所属機関リポジトリ（GCTU Repository）のレコードと全文転載。

- 7-18 Galmarini et al. 2018（ワイン×チーズ方法論）→ 主掲載 §5 E-4

#### 7-19de Klepper 2011
- **書誌情報**：de Klepper, Maurits (2011). Food Pairing Theory: A European Fad. *Gastronomica: The Journal of Food and Culture* 11(4), 55–58. DOI: 10.1525/gfc.2012.11.4.55
- **主要な知見**：Food Pairing Theory の中核仮説を「2つの食品が共有する特徴的香り化合物が多いほど、一緒に食べたとき美味しい」と定式化し、その根拠が「フレーバーの80%は鼻が捉える揮発性香り化合物で決まる」という前提に依ることを示す欧州の流行紹介。
- **適用範囲と限界**：**査読研究論文ではなく、理論の命名・普及に関わるエッセイとして格付け（参考情報に近い論説）**。学位論文ではない（冒頭訂正参照）。
- **何に使えるか**：仮説の「原典的定式化」としての引用専用。§2-5（Spence 2020 がこの仮説を "now-discredited" と評する）および 7-9（Eschevins）と必ず対で用い、単独で根拠として表示しないこと。
- **確認手段**：University of California Press の当該号目次（誌面PDF）と Nature 系論文の引用情報で書誌・DOI・仮説の文言を確認。

### F. 書誌のみ確認（台湾の学位論文）
#### 7-20柯彥良（Ko, Yen-Liang）2021
- **書誌情報**：柯彥良（2021）『不同茶葉沖泡方式之茶湯功效性分析與感官品評之研究』（Studies on the Analysis of Functionality and Sensory Evaluation of Tea Soups Prepared by Different Tea Brewing Methods）中華科技大學 健康科技研究所 碩士論文、103 pp.
- **主要な知見**：※NDLTD 検索レコードの範囲：中国語抄録の冒頭（8種の台湾茶×3温度×泡茶機／伝統的淹法で総ポリフェノール・抗酸化・感官品評を比較）まで確認。レコード本文ページは CAPTCHA 画面に阻まれ未到達のため「書誌のみ確認」に格下げする。
- **適用範囲と限界**：採用前に NDLTD で抄録全文の再確認が必要。
- **何に使えるか**：淹法・温度が茶の官能特性を変える台湾側の学位論文として、ペアリング条件（抽出温度）表示の候補。
- **確認手段**：臺灣博碩士論文知識加值系統（NDLTD）の検索レコード。

#### 7-21林憲政（Lin, Hsien-Chong）2024
- **書誌情報**：林憲政（2024）『不同焙火溫度處理臺茶22號烏龍茶之消費者接受度探討』（Study on Consumer Acceptance of TTES No. 22 Oolong Tea Roasted at Various Temperatures）大葉大學 碩士論文、99 pp.
- **主要な知見**：※NDLTD 検索レコードの抄録抜粋の範囲：9点嗜好法と CATA による消費者評価、焙火120℃の冬茶で95%超が肯定的評価、floral／fruity／roasted 等の CATA 属性。レコードページの取得はタイムアウトしたため「書誌のみ確認」。
- **適用範囲と限界**：一次確認の完了が採用条件。
- **何に使えるか**：焙火温度という単一変数で消費者受容が変わる事例として、茶側の「焙火」軸表示の候補。
- **確認手段**：NDLTD 検索レコード。

#### 7-22台湾・中臺科技大學食品科技系の茶官能系修士論文2件
- **書誌情報**：許雅卉（2022）『以選擇適合項目法評估台灣紅烏龍茶感官特性之研究』／莊振鈺（2018）『靜態與動態消費者型感官品評技術於臺灣特色茶感官特性之評估』
- **主要な知見**：同系の歴届論文一覧ページの検索結果で題名・著者・年のみ確認。当該ページの直接開覧は取得失敗したため、大学・抄録は確認していない。
- **適用範囲と限界**：引用には使わず、NDLTD での再検索用メモとしてのみ残す。

### G. 未確認・参考情報（§7 ライン分）
- **中国大陸の「茶食／茶点×茶」学術研究**：今回の探索では、大学リポジトリまたは査読誌の一次レコードに到達できた中国大陸発の茶×食ペアリング学術研究は**確認できなかった（未確認）**。CNKI 等の中国語データベースには今回アクセスしていないため、「存在しない」ではなく「未探索・未確認」と記録する。中国語圏で一次確認できたのは台湾の学位論文レコード（7-20、7-21）と、7-14・7-15 の中国系著者による英語総説のみである。
- **『料理・台灣』（Ryori.Taiwan）の「茶食の前世今生」「茶與菜餚的入世對話」等の記事**：発酵度による茶×料理の組合せ（緑茶×海鮮、烏龍×肉類、紅茶×奶油系菓子等）や茶食文化を扱うが、文化・料理メディアの記事であり**参考情報**。学術的裏付けとして表示せず、仮説生成の材料に限る。
- **日本のティーペアリング研究報告書**（味覚センサー TS-5000Z で茶15種×食品9種を WASH／SUPPLEMENT／SHARE の3パターンに分類したとされる報告書PDF、shigaku.go.jp 収載）：→ §2-25 として記録。著者・正式な報告書名・年を一次レコードで確定できなかったため**未確認**。

### §7 のまとめ（アプリ反映への含意）
1. 根拠の厚みは「相互作用の原理」側にあり、「茶×チョコレートの直接実証」は §2-7・§5 B-1 が示すとおり依然薄い。表示では、原理典拠（7-2b、§2-5、7-9）に基づく説明と、直接研究のある組合せを視覚的に区別すべきである。
2. 共有化合物仮説は 7-19 が原典的定式化、§2-5 が「信用を失った」と明言する。化合物の重なりは「推測の出発点」と位置づけ、確定表現にしないこと（既存の「推測（未検証）」運用と整合）。
3. 学位論文レベルで使えるのは 7-9（ペアリング原理、仏）、7-10（茶の mouthfeel と脂肪・糖による渋み低減）、7-11・7-12（茶×菓子の評価法と消費者データ）。中国語圏の学位論文は 7-20・7-21 が候補だが、一次確認の完了が採用条件。

---

## §8 未査読・サイト情報（参考情報）：プレプリント・学会要旨・専門家の発信・公的機関

ユーザー追加指示（2026-10-30）：「論文に限らずサイトでもいい。未査読でもいい。世界中を探してほしい。」を受け、プレプリント・学会要旨・専門家の発信・公的機関サイトまで範囲を広げた追加探索（3ライン並行）の記録。

**格付け（厳守）**：本節の全項目は「参考情報」であり、査読論文（§1〜§7）の根拠と同列に扱わない。実測・寄与の単独根拠にせず、推測（未検証）の出発点・仮説生成・表示文案の参考としてのみ使う。数値・分類名・著者名は実際に開いたページ／PDFに表示されていたもののみを転記し、確認できなかった要素は「未確認」と明記した。

**§2-25・§7 G への訂正**：両箇所で「未確認」とした味覚センサー TS-5000Z による WASH／SUPPLEMENT／SHARE 分類の報告書は、本節 C-1 のとおり原典（2019年度助成金レポート）が確定した。本書全体としては C-1 の記録を正とする（ただし格付けは参考情報のままであり、査読根拠にはならない）。

### A. プレプリント・学会要旨・プロシーディングス（17件：プレプリント11＋学会要旨等6）

#### 8-1【参考情報（未査読）】Ahn, Ahnert, Bagrow & Barabási 2011（arXiv版）
- **書誌情報**：Ahn, Yong-Yeol; Ahnert, Sebastian E.; Bagrow, James P.; Barabási, Albert-László (2011). Flavor network and the principles of food pairing. arXiv:1111.6074 [physics.soc-ph]、投稿 25 Nov 2011. https://arxiv.org/abs/1111.6074
- **主要な知見**：共有する香味化合物を結ぶ「flavor network」を導入。西洋料理は化合物を共有する材料ペアを使う傾向があり food pairing 仮説を支持する一方、東アジア料理は化合物共有を避ける傾向がある（査読版は §2-1）。
- **適用範囲と限界**：プレプリント版としての記録。内容の正は §2-1（査読版）による。
- **何に使えるか**：「共有化合物＝同調」への反証条件（東アジア＝茶文化圏では共有回避が起こりうる）の参考。

#### 8-2【参考情報（未査読）】Jain, Rakhi N K & Bagler 2015（arXiv版）
- **書誌情報**：Jain, Anupam; Rakhi N K; Bagler, Ganesh (2015). Spices form the basis of food pairing in Indian cuisine. arXiv:1502.03815、投稿 12 Feb 2015. https://arxiv.org/abs/1502.03815
- **主要な知見**：インド料理では「香味共有が多い材料ほど共起が少ない」という強い負のペアリングの署名がある。材料頻度が支配的因子で、スパイスが材料構成の基盤（査読版は §2-2。本項目は §2-24 の未確認扱いを、プレプリントとして実在確認できたため本節で参考情報として確定記録する）。
- **適用範囲と限界**：内容の正は §2-2 による。
- **何に使えるか**：スパイス系チョコやスパイス茶との組み合わせで「対照・補完」型を考える際の参考。

#### 8-3【参考情報（未査読）】Palermo, Caprioli & Albora 2024
- **書誌情報**：Palermo, Giovanni; Caprioli, Claudio; Albora, Giambattista (2024). Food Pairing Unveiled: Exploring Recipe Creation Dynamics through Recommender Systems. arXiv:2406.15533、投稿 21 Jun 2024. https://arxiv.org/abs/2406.15533
- **主要な知見**：協調フィルタリングでレシピベース推薦と香味化合物ベース推薦を比較。food pairing の存在は確認するがレシピベースが有意に優れ、「food pairing はレシピ創造の原理の一つに過ぎない」。データ中の food pairing は「非常に似た材料同士の自明な結合」に主に由来すると指摘。
- **適用範囲と限界**：プレプリント。レシピ推薦の文脈の知見。
- **何に使えるか**：化合物共有スコアを過大評価しないための歯止め（§2-5 の批判と同方向）。類似材料同士の自明な高スコアを割り引く設計の参考。

#### 8-4【参考情報（未査読）】Caprioli et al. 2024（改訂2025）
- **書誌情報**：Caprioli, Claudio; Kulkarni, Saumitra; Battiston, Federico; Iacopini, Iacopo; Santoro, Andrea; Latora, Vito (2024, v1; 改訂 23 Sep 2025, v2). The networks of ingredient combinations as culinary fingerprints of world cuisines. arXiv:2408.15162. https://arxiv.org/abs/2408.15162
- **主要な知見**：材料を広いタイプに grouping し、料理ごとに共起ネットワーク化。欧州料理はタイプを分散させる一方、一部のアジア・南米伝統は単一の支配的タイプを強調する等の「culinary fingerprints」が得られ、機械学習で料理を高精度に識別できた。
- **適用範囲と限界**：プレプリント。レシピ統計の範囲。
- **何に使えるか**：個別化合物ではなく「分類／タイプ軸」で組み合わせを表現するアプリの3軸設計と整合するネットワーク的裏付けの参考。

#### 8-5【参考情報（未査読）】Ruan, Chen, Chauhan & Howell 2024
- **書誌情報**：Ruan, Xinwei; Chen, Yipeng; Chauhan, Aafreen; Howell, Kate S. (2024). Stimulation of saliva affects the release of aroma in wine; a study of microbiota, biochemistry and participant origin. bioRxiv. DOI: 10.1101/2024.02.25.581677. https://www.biorxiv.org/content/10.1101/2024.02.25.581677v3.full
- **主要な知見**：健康成人30名（オーストラリア15名、中国15名）で刺激前・中・後の唾液を採取し、流量、総タンパク、エステラーゼ活性、微生物叢とワイン香気放出（HS-SPME-GC-MS）を測定。参加者の地理的起源と刺激段階で唾液組成と特定のワイン揮発成分に差があり、3種の細菌の相対量と10種のワイン揮発成分に有意な相関があった。本文ではムチン、α-アミラーゼが疎水性相互作用で香気放出を修飾することにも言及。
- **適用範囲と限界**：プレプリント。対象はワインであり、数値の茶／チョコへの直接転用は不可。
- **何に使えるか**：「唾液タンパク／酵素／微生物が後鼻腔香気放出を変える」機序の枠組みの参考（§3・§4 の査読知見と同方向）。個人差・文化差をペアリング推測に混ぜない注意点としても有用。

#### 8-6【参考情報（未査読）】Amien et al. 2025
- **書誌情報**：Amien, Guy Florent Kouamé; Kone, Koumba Maï; Kadjo, Christian Adobi; Yao, Alfred Koffi; Maraval, Isabelle; Boulanger, Renaud; Guehi, Simplice Tagro (2025). Effect of Agroforestry and Cocoa Producing Geographical Origin on the Flavor Profile of Beans and End-Chocolates in the Climate Change Context in Côte d’Ivoire. Preprints.org. DOI: 10.20944/preprints202511.0184.v1. https://www.preprints.org/manuscript/202511.0184（プレプリントページには査読版 Foods 2025, 14(24), 4321 の存在が表示されているが、本書ではプレプリント版として扱う）
- **主要な知見**：5産地のアグロフォレストリー（AF）と全日照（FS）のカカオを発酵・乾燥してチョコ化し、SPME-GC-MS と専門家の官能で比較。要旨では、AFは一部産地で豆の香味に影響したが派生チョコには影響せず、発酵と焙煎のため産地によらず官能知覚に有意な影響はなかった、とされる（要旨と本文で記述子数が異なる点は未整理）。
- **適用範囲と限界**：プレプリント。単一国の事例。
- **何に使えるか**：「産地差は豆段階では出ても、発酵・焙煎を経たチョコでは薄まる」可能性——産地だけでペアリング性格を断定しないための反証材料（§7-17 の査読総説と同方向）。

#### 8-7【参考情報（未査読）】Liu et al. 2025
- **書誌情報**：Liu, Xiaohui; Huang, Mingzheng; Tang, Weiyuan; Li, Yucai; Li, Lun; Xie, Jinyi; Li, Xiangdong; Dong, Fabao; Wang, Maosheng (2025). Characterize and Explore the Flavor Profiles of Green Teas from Different Tenderness Levels of Camellia sinensis cv. Fudingdabai by E-Nose, E-Tongue and HS-GC-IMS Combined with Machine Learning [v1]. Preprints.org. https://www.preprints.org/manuscript/202507.2190（査読版 Foods 2025, 14(16), 2861 の表示あり）
- **主要な知見**：単芽／一芽一葉／一芽二葉の3嫩度を E-nose、E-tongue、HS-GC-IMS、rOAV、機械学習で比較。単芽は fresh, grassy, herbal 系、一芽一葉は floral 系（linalool の rOAV > 7400 と要旨記載）の増加、一芽二葉は Maillard とフェニルアラニン代謝による roasted and cocoa-like aromas が特徴。ランダムフォレスト–SHAP で鍵マーカー20件を同定。
- **適用範囲と限界**：プレプリント。茶単独の分析であり、ペアリング実験ではない。
- **何に使えるか**：一芽二葉の緑茶に「cocoa-like」香が出るという記述は、緑茶×ダークチョコの焙煎香ブリッジ仮説の間接的参考。

#### 8-8【参考情報（未査読）】Dou, Wang, Zou & Liu 2026（総説プレプリント）
- **書誌情報**：Dou, Cunli; Wang, Ying; Zou, Minghui; Liu, Bo (2026、Preprints.org 掲載日 2026-03-02). Advances in Research on the Interactions Between Sweet Taste and Other Sensory Systems [v1]. Preprints.org. https://www.preprints.org/manuscript/202603.0082
- **主要な知見**：甘味と塩味・酸味・苦味・うま味、嗅覚、三叉神経（温度・テクスチャ・化学刺激）との相互作用を総説。基本味同士の相互作用は濃度依存的に増強・抑制・マスキングを示すこと、香気化合物が甘味知覚に相乗／拮抗的に働くこと（バニラ香による甘味増強への言及）、チョコミルクにスクロース＋バニリン＋ココア混合物を用いた甘味相乗・苦味拮抗の研究紹介（本文2.1節）を確認。
- **適用範囲と限界**：プレプリント総説。個別のお茶・チョコへの数値適用は不可。
- **何に使えるか**：「香り→味」クロスモーダル推測の一般枠組みと、濃度依存性を明示する根拠の参考（§3 B節の査読知見の補助）。

#### 8-9【参考情報（未査読）】Santana et al. 2024
- **書誌情報**：Santana, Joelaine de Jesus; Nascimento, Manuela B.; Ferreira, Tamires Ramos; de Carvalho, Janaína Alves; dos Santos, Lorena Castão; Santana, Ligia R. R.; Ferreira, Adriana C. R.; Mesquita, Paulo; Soares, Sergio Eduardo (2024). Quantitative Descriptive Sensory Profile and Volatile Analysis of Chocolates Produced from Cocoa from Bahia with Potential for Fine Cocoa. SSRN. DOI: 10.2139/ssrn.4995155. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4995155
- **主要な知見**：バイーア州各地のカカオから作ったチョコを QDA と揮発成分・消費者受容で評価。QDA では16記述子のうち sweet aroma を除く15で試料差があり、Ilhéus 産チョコが全属性で最高の受容平均。揮発プロファイルは Acids, Alcohols, Alkaloids, Aldehyde, Ketones, Esters, Monoterpenes, Pyrazines の8群で特徴づけられた。
- **適用範囲と限界**：プレプリント。茶とのペアリング実験ではない。
- **何に使えるか**：チョコ側の産地別官能プロファイルを記述子ベースで持つ際の参考様式。

#### 8-10【参考情報（未査読）】Ojimelukwe 2025
- **書誌情報**：Ojimelukwe, Philippa C.（ページに明記される著者はこの1名のみ。他著者の有無は未確認）(2025). Microbial Succession During Box and Heap Fermentation of Cocoa Beans (Theobroma Cocoa) — impacts on Nutrients and Chocolate Quality. Research Square. DOI: 10.21203/rs.3.rs-5939366/v1. https://www.researchsquare.com/article/rs-5939366/latest.pdf
- **主要な知見**：箱発酵と堆積（heap）発酵の微生物遷移、栄養・フェノール・官能を比較。発酵で総フェノールが減少し、発酵豆チョコは無発酵より消費者受容が高く、**heap 発酵のチョコは box 発酵より渋味（astringent）が強かった**。官能は semi-trained 20名、9点嗜好尺度。
- **適用範囲と限界**：プレプリント。単一研究の官能結果。
- **何に使えるか**：チョコ側の渋味強度が発酵法で変わるという変数。渋味の強い茶と合わせる際の「渋味の積み重なり」リスク推測の参考。

#### 8-11【参考情報（未査読）】Haghighat Asiabar et al.（SSRNプレプリント）
- **書誌情報**：Haghighat Asiabar, Azar; Ghanbarzadeh, Babak; Roufegarinejad, Leila; Gharekhani, Mehdi; Falcone, Pasquale M. The CBS-Based W/O Emulsion for Development of Heat-Resistant Compound Chocolate: Study on Thermal, Rheological and Physical Properties. SSRN abstract=5147923、Università Politecnica delle Marche 機関リポジトリ IRIS 収載（SSRN 投稿年は開いたPDFでは未確認。リポジトリでは Applied Food Research 掲載版の preprint version として 2025 と表示）。PDFに "This preprint research paper has not been peer reviewed" と明記。
- **主要な知見**：カカオバター代替（CBS）ベース W/O 乳化物をコンパウンドチョコに 0–4% 添加し、1%添加で物理・官能特性が改善したと要旨に明記。本文冒頭では、実チョコはカカオバターが香味の担体（carrier）として働くこと等を確認。
- **適用範囲と限界**：プレプリント。一般論でありペアリング実験ではない。
- **何に使えるか**：「脂肪が香味を担い、口溶けと後味を支配する」という脂肪—香味相互作用の基礎資料（§4 の査読知見の補助）。

#### 8-12【参考情報（未査読・学会要旨）】Donadini & Fumi（COCOTEA 2013 発表要旨）
- **書誌情報**：Donadini, G.; Fumi, M.D.（Institute of Oenology and Food Engineering, Università Cattolica del Sacro Cuore, Piacenza）. IS CHOCOLATE AN ENJOYABLE PARTNER OF TEA AND COFFEE? CONSUMERS SPEAK OUT. COCOTEA（第2回、Naples、2013年10月9–11日）発表要旨。Comunicaffe International 転載：https://www.comunicaffe.com/cocotea-6-chocolate-enjoyable-partner-tea-coffee-consumers-speak/（転載ページ自体に年・開催地の明記はなく、年は COCOTEA2013 開催案内ページで確認した文脈による）
- **主要な知見**：消費者パネル n=80 に、カカオ固形分の異なるチョコとコーヒー／茶のペアを自然な消費環境で嗜好評価させ、どちらの風味が支配的かも回答させた。専門家パネルはチョコ摂取前後のコーヒー／茶について Descriptive Analysis を実施し、DA データと消費者嗜好を PLS-Regression で、チョコ嗜好・飲料嗜好・チョコ種・飲料種・風味支配と交互作用を Factorial ANOVA で検討（効果量は omega squared）。**具体的な数値結果・どの組合せが最良かはこの転載ページでは確認できない（未確認）**。著者らは当時、統制条件下でチョコ×飲料ペアリングを扱った科学的研究は乏しく、知る限り先行研究は1件のみと述べている。
- **適用範囲と限界**：学会要旨。査読論文版（§5 A-2）とは別物として扱い、数値は査読論文による。
- **何に使えるか**：本テーマで唯一の直接の学会要旨。評価設計（嗜好＋「どちらが支配的か」＋チョコ前後での飲料 DA 変化）の原型として最重要。「n=80、支配関係と DA を見た」という設計情報としてのみ使うべきもの。

#### 8-13【参考情報（未査読・プロシーディングス）】Wang, Septier, Brignot, Martin, Canon & Feron 2021
- **書誌情報**：Wang, Mei; Septier, Chantal; Brignot, Hélène; Martin, Christophe; Canon, Francis; Feron, Gilles (2021). Oral astringency: effect of ageing and role of saliva. Proceedings of the 16th Weurman Flavour Research Symposium, 2021（Guichard & Le Quéré 編）、Zenodo. DOI: 10.5281/zenodo.5129047. https://zenodo.org/records/5129047/files/proceedings_Wang_pdf.pdf（後に Molecules 特集号の査読論文版も出ている旨が同特集の紹介文で確認できるが、本書ではプロシーディングス版として格付け。C節の INRAE 項目と同一文献）
- **主要な知見**：パネル54名（高齢30名・若年24名）でタンニン酸溶液の2-AFCにより渋味閾値を測定。高齢群の閾値 0.41 g/L に対し若年群 0.29 g/L で有意差（p=0.011）。唾液流量との負の相関は若年群でのみ有意（r=-0.44, p=0.029）。機序として、タンニンと口腔粘膜ペリクル（MUC1 を介して付着する唾液タンパク層）の相互作用による凝集・潤滑性低下、唾液 PRP がタンニンを捕捉して粘膜を保護する仮説が整理されている。
- **適用範囲と限界**：学会プロシーディングス短報。
- **何に使えるか**：茶×チョコ双方の渋味が唾液タンパクを介してどう知覚されるか、年齢・唾液流量という個人差変数の扱いの直接の参考（§3・§6 の査読知見と同方向）。

#### 8-14【参考情報（未査読・学会発表資料）】Wind, Januszewska, Stöphasius & Majchrzak 2020
- **書誌情報**：Wind, A.; Januszewska, R.; Stöphasius, N.; Majchrzak, D.（Univ. Vienna／Barry Callebaut）(2020). Exploring dynamics of sensory attributes and emotions during consumption of chocolate containing maltitol applying TDS and TDE methods. EuroSense 2020 発表資料（PDF、snoe.at 収載）。https://www.snoe.at/wp-content/uploads/2020/12/Eurosense2020.End_.A.Wind_.pdf（EuroSense の回次・正式プロシーディングス収載の有無は未確認）
- **主要な知見**：未訓練44名が TDS／TDE で90秒評価。ダークチョコの時間プロファイルは苦味とカカオ風味が支配的、ミルクチョコは甘味とミルキー風味が支配的で甘味料の種類によらない。マルチトール版ダークでは苦味とカカオ風味の支配率がスクロース版より高かった等の数値が資料に明記。
- **適用範囲と限界**：学会発表スライド。ペアリングそのものではない。
- **何に使えるか**：「チョコ単独でも時間軸で支配的感覚が移る」という TDS の考え方は、お茶を合わせた際の支配関係の時間変化を表現する際の方法論的参考（§6 D節の査読知見の補助）。

#### 8-15【参考情報（未査読・学会発表要旨）】松尾栞奈、平井智美、飯田文子 2024
- **書誌情報**：松尾栞奈、平井智美、飯田文子（日本女子大学）(2024). 3種の味覚溶液の混合作用に関する官能評価について. 日本官能評価学会2024年大会（2024年11月9日）、学会優秀発表賞受賞。同学会誌 29巻2号 pp.149-150 に抄録として収載される旨が J-STAGE 一覧の検索結果で確認できる（DOI: 10.9763/jjsse.29.149 と表示。抄録本文は未開示のため内容は大学公式紹介ページによる）。https://www.jwu.ac.jp/unv/jwu_times/2025_0602_02.html
- **主要な知見**：チョコの甘味（スクロース）・苦味（カフェイン）・渋味（テオブロミン）に相当する溶液をカカオ分70%チョコ相当濃度で調製し、単体を基準に混合時の強度変化を評価（研究室学生17名、各2回・計34回）。結果：甘味×苦味、甘味×渋味の混合ではそれぞれの強度が弱まる、渋味には苦味を強める作用が示唆される、カカオ分濃度（60/70/80%相当）でも強度差が生じる。実チョコでは油分のコーティングで苦味・渋味が緩和されるため、溶液系で「味だけ」を切り分けたという設計意図も明記されている（※数値は大学広報記事経由である点に注意）。
- **適用範囲と限界**：学会発表要旨（未査読）。「渋味＝テオブロミン溶液」という操作定義は本研究独自のものであり、渋味一般への換算はできない。
- **何に使えるか**：お茶×チョコへの示唆が大きい仮説源——(1) お茶の渋味がチョコの苦味を強めうる、(2) 甘味は苦味・渋味と互相抑制、(3) 脂肪コーティングが渋味／苦味を緩和する。いずれも査読ライン（§3 B節）で裏付けが取れる範囲でのみ使うこと。

#### 8-16【参考情報（未査読・学会発表要旨、題名のみ確認）】瀧本拓央、田手早苗 2024
- **書誌情報**：瀧本拓央、田手早苗（アサヒ飲料株式会社）(2024). 茶飲料と食品の食べ合わせ評価の検討. 日本官能評価学会2024年度大会、学会優秀発表賞。同学会誌 29巻2号 pp.151-154 収載の旨が J-STAGE 一覧の検索結果で確認できる（DOI表示: 10.9763/jjsse.29.151）。https://www.jsse.net/presentation_award/award_list/
- **主要な知見**：**要旨本文は開けなかったため内容は未確認**。題名と著者・所属、受賞事実のみ確認。チョコレートが対象食品に含まれるかどうかも未確認。
- **適用範囲と限界**：題名レベルのみの確認。
- **何に使えるか**：茶×食品の食べ合わせ評価法が分かれば評価設計に直結する可能性。抄録本文の入手が次の課題。

- 8-17 テクニカルレポート（築舘 2019、WASH／SUPPLEMENT／SHARE）→ 主掲載 C-1

#### A節で見つからなかったもの
- **お茶×チョコレート直接のプレプリント：0件**。arXiv、bioRxiv、ChemRxiv、medRxiv、OSF Preprints／PsyArXiv、SSRN、Research Square、Preprints.org を英語・日本語・中国語で検索したが、茶とチョコのペアリング自体を実験したプレプリントは1件も確認できなかった。直接証拠は 8-12 の COCOTEA 学会要旨のみ。
- ChemRxiv は該当なし（マテ茶の総ポリフェノール推定等、本テーマと無関係のもののみ）。medRxiv も該当なし。
- Pangborn Sensory Science Symposium では、公開検索範囲でお茶×チョコの個別要旨は確認できなかった（開催案内・トピック一覧のみ）。
- 日本語プレプリント（Jxiv 等）／中国語圏プレプリントでは、茶×チョコの学術プレプリントは確認できず（商業ブログ／店舗記事のみで、学術資料としては除外）。

### B. 専門家の発信・業界の実践知（20件、全件 参考情報（専門家言説・未検証））

査読研究ではないため、アプリでは「推測表示の仮説生成材料／表示文案の参考」としてのみ使用可能で、測定値・科学的根拠としては扱わない。各項目は実際にページを開いて全文確認したもの。

#### 8-18 Carine Baudry — お茶×チーズ
- **発信者／媒体・日付／URL**：Carine Baudry（ティー専門家）／Gault&Millau インタビュー（記者 Sylvie Berkowicz）、2023-10-25／http://fr.gaultmillau.com/en/news/l-art-d-accorder-le-the-et-le-fromage-selon-carine-baudry
- **提案内容**：若い Comté × 春摘み Darjeeling またはネパール白茶（花・植物系の香りが共通し、チーズのミルキー／バター／ナッツ感が茶の花香を増幅し、脂肪が茶の渋みを丸くする）。熟成 Comté × 夏・秋摘み Darjeeling。Camembert × Hojicha（焙煎香が動物性臭を和らげナッツ感を引き出す）。一般原則：温かいお茶がチーズの脂肪を溶かし香りを引き出す。山羊チーズには低酸化烏龍茶系、青カビにはマイルドでモルティ・バニラ様の紅茶（§5 G の言及の原典）。
- **用途見込み**：温かい飲料×脂肪、焙煎茶×脂肪質食品、花香茶×ミルキー食品という「相互作用型」表現の原型。チョコ（カカオバター脂肪）への転用仮説の出発点。

#### 8-19 Sujin Lee（Tea Repertoire）— 具体ペアリング5選
- **発信者／媒体・日付／URL**：Sujin Lee（qualified tea sommelier、Tea Repertoire London 創業者）／Love Cocoa Blog（Made Uncommon 転載）、2018-07-16／https://madeuncommon.co/blogs/journal/tea-and-chocolate-pairing-tantalize-your-taste-buds
- **提案内容**：原則：紅茶は中〜フルボディと渋みがありチョコの濃厚さ・甘さと合いやすく最も合わせやすい、緑・白・烏龍は繊細。個別：①Laoshan 産紅茶 Black Forest × Peruvian Dark Bar＝同香調和。②台湾 Sun Moon Lake Red Jade（ミント／ユーカリ／クローブ）× English Mint 71% Dark。③Malawi 産 Earl Grey × Earl Grey 37% Milk Bar。④ベトナム産 Wild Jasmine Green × Sparkling Rose 35% White（ジャスミンの甘い香りがホワイトの甘さと調和し、緑茶の苦渋が対比で口をリフレッシュ）。⑤鳳凰単欉 Phoenix Honey Orchid × Raspberry Champagne Truffle（ホワイト系）。飲み方：先に茶を一口含んで口を温めてからチョコを味わう。
- **用途見込み**：産地・品種レベルの組み合わせページの文案モデル。同調和型と対比型の両立例。

#### 8-20 Piotr Miga（Tea Forté）— Kindred / Opposite の二原則
- **発信者／媒体・日付／URL**：Piotr Miga（Tea Forté award-winning tea sommelier & master blender）／Tea Forté 公式ブログ、2022-10-24／https://teaforte.com/blogs/tea-notes/an-expert-guide-to-pairing-tea-and-chocolate
- **提案内容**：原則：似た風味同士（kindred）は層を深め、対照的な風味同士（opposites）は驚きとバランスを生む。同調型：ベリー系トリュフ×Raspberry Nectar、スパイスオレンジトリュフ×Sweet Orange Spice、ミント茶×ミントチョコ、抹茶まぶしチョコ×抹茶／煎茶、アマレット茶×ヘーゼルナッツ入りチョコ、ミルクチョコ×ミルクを加えた紅茶ブレンド、ダークチョコ×力強いブレックファストブレンド／ベリー茶。対比型：ドライフルーツ入りスパイスチョコ×Wildflower Honey Citrus 緑茶、ホワイトチョコ×Chamomile Citron、ローズティー×塩味ダーク、ホワイトチョコ×スモーキー烏龍／酸味のあるハイビスカス、ジンジャーティー×プレーンなトリュフ。
- **用途見込み**：「同調／対比」の2軸ラベルの文案源として最も汎用的。

#### 8-21 Piotr Miga ＋ Amy Sherman — Fox News 専門家コメント（転載で確認）
- **発信者／媒体・日付／URL**：Piotr Miga、Amy Sherman（The Chocolate Professor 編集長）、William Mullan（Raaka Chocolate）／Fox News Digital 発言を History of Ceylon Tea が転載（転載ページ自体に日付明示なし）／https://www.historyofceylontea.com/ceylon-publications/ceylon-tea-articles/chocolate-paired-with-tea-has-health-benefits-that-outweigh-wine-experts.html
- **提案内容**：Miga：ダークチョコ×紅茶／プーアール／ベリー・ローズ・柑橘風味のハーブティー、ミルクチョコ×ファーストフラッシュ紅茶／烏龍茶。Sherman：ワインと同じく contrast か complement か。Earl Grey×チョコ、キャラメルチョコ（極甘）×Lapsang Souchong のような強い茶、ミルクチョコの甘さを切る×緑茶、ルイボス×ビタースイート／ナッツ・トフィー・ベリー被覆チョコ、海塩チョコ／チョコポップコーン×抹茶、ホワイトチョコ菓子×ハーブティー／カモミール。健康効果への言及部分は専門家コメントの転載であり、根拠として使わない。
- **用途見込み**：塩味チョコ×抹茶、キャラメル×燻製茶など対比型の追加候補。二次転載である点に注意（Fox News 原記事自体は未開示）。

#### 8-22 Anna Pegola ＋ Moksha Chocolate — シングルオリジン実践テイスティング
- **発信者／媒体・日付／URL**：Anna Pegola（tea sommelier）、Moksha Chocolate 主催／Moksha 公式ブログ、公開 2026-03-08／https://www.mokshachocolate.com/blogs/news/moksha-chocolate-craft-pairings
- **提案内容**：Boulder でのガイド付き実践の記録。①Kablon Farms 70%（フィリピン）× 10年熟成 Lao Cha 烏龍（熟成烏龍の温かみと軽い焙煎がトロピカルな明るさを和らげ、チョコが茶の甘み・キャラメル・ドライフルーツを引き出す）。Bejofo 65%（マダガスカル）×同烏龍（土っぽい焙煎が対比となり蜂蜜感が浮かぶ）。Iténez 70%（ボリビア）×同烏龍（柔らかな焙煎が花・ナッツに共鳴）。②Kokoa Kamili 65% Dark Mylk（タンザニア）× Assam（モルト感がクリーミーなボディを強め構造を与える）。③Zorzal 80%（ドミニカ）× Lapsang Souchong（燻煙の深さが土・ローストコーヒー感を増幅）。一般則：熟成烏龍は果実感のある繊細な産地チョコを圧倒せず合う、Lapsang は高カカオの力強いダークに、Assam は低カカオのクリーミーなバーに。
- **用途見込み**：カカオ産地別ページに「熟成烏龍／アッサム／正山小種」の強度対応表を作る際の実践例として最有力級。

#### 8-23 Lindt — Master Chocolatier と Tea Taster の9ペアリング
- **発信者／媒体・日付／URL**：Stefan Bruderer（Lindt Master Chocolatier）＋ Tim Clifton（tea taster）／FemaleFirst、2014-03-19／https://www.femalefirst.co.uk/foodanddrink/how-to-get-the-perfect-tea-and-chocolate-pairing-439175.html
- **提案内容**：Dark Sea Salt × Assam、Dark Cherry Intense × Darjeeling、Dark Mint × Moroccan Mint、Caramel Sea Salt × English Breakfast、70% Cocoa × Green Tea（草香が濃いカカオを包み口を清める）、Dark Chilli × Chai、Orange Intense × Ceylon、White Vanilla × Jasmine Pearls（ジャスミンの花香がバニラの強い甘さを切る）、Extra Creamy × Earl Grey。
- **用途見込み**：フレーバー付きチョコ（塩・チェリー・チリ・オレンジ・ミント）側から茶を引く逆引き文案のモデル。

#### 8-24 Lindt Japan 公式 — エクセレンス×茶
- **発信者／媒体・日付／URL**：Lindt Japan 公式／日付はページで確認できず／https://www.lindt.jp/contents/tea-pairings/
- **提案内容**：85%×Assam、90%×Jasmine Tea、Orange Intense×Earl Grey、Sea Salt×Assam、Extra Creamy×Earl Grey、Dark Caramel & Sea Salt×English Breakfast、78%×English Breakfast、Chilli×Chai、70%×Green Tea、Mint Intense×モロッコ産ミントティー、70%×Vanilla Tea。8-23 と系統は同じだが日本公式として独立に掲載。
- **用途見込み**：商品名レベルの具体ペアリング表記例。

#### 8-25 Palais des Thés 公式 — ダーク／ミルク／ホワイト別
- **発信者／媒体・日付／URL**：Palais des Thés 公式／公開 2018-03-23（更新 2026-08-12 表示）／https://us.palaisdesthes.com/en_us/blog/tea-pairings/chocolate/
- **提案内容**：ダークチョコ×Grand Yunnan Imperial（蜂蜜感）、Thé des Gourmets（アーモンド）、Montagne Bleue、Jukro（ココア・バニラ感で単色調和）。ミルクチョコ×La Poire（Mao Feng 緑茶＋洋梨のキャラメル感）、Thé des Moines（キャンディ柑橘）、Bancha Hojicha（木質の焙煎香）、Genmaicha Yama（柔らかな焙煎）。ホワイトチョコ×Thé du Hammam（花・果実）、Milky Oolong（花・植物・バター香がクリーミーさと均衡）、Blue of London（ベルガモット雲南紅茶）。
- **用途見込み**：チョコ3分類（ダーク／ミルク／ホワイト）で入口を作る構成の直接の手本。

#### 8-26 Discovering Tea（Palais des Thés 創業者系ブログ）— チョコ＆チーズ横断
- **発信者／媒体・日付／URL**：Discovering Tea ブログ（一人称のテイスティング記録、ページ本文に著者名の明示なし）／日付はページで確認できず／https://www.discoveringtea.com/-cat-/tea-and-food/tea-and-food-pairings/
- **提案内容**：ホワイトチョコ×緑茶（Gyokuro Hikari、Genmaicha）、ミルクチョコ／プラリネ×日本の焙煎茶（Shiraore Kuki Hojicha、Bancha Hojicha が理想）、上質ダーク×Qimen Mao Feng、Jukro、Premium Yunnan Buds、Imperial Pu Erh。チーズ側：Shiraore Kuki Hojicha×Pont-l'Évêque、Bancha Hojicha×Brie。一般論：チョコに添える茶は沸騰直後でなく少し休ませ温度差を小さくする。
- **用途見込み**：焙じ茶×プラリネ、玄米茶×ホワイトという日本茶特化の補強。温度の実践知も文案化可能。

#### 8-27 Bruce Richardson — TeaTime Magazine 入門ガイド
- **発信者／媒体・日付／URL**：Bruce Richardson（Elmwood Inn Fine Teas 共同経営者、Contributing Editor）／TeaTime Magazine 2017年1・2月号（ウェブ版）／https://teatimemagazine.com/pairing-tea-chocolate/
- **提案内容**：Milk Chocolate × Indian Chai、Dark Chocolate × Yunnan Black Tea、Dark Truffle × Earl Grey、Chocolate-Covered Caramels with Sea Salt × Lapsang Souchong（塩と煙のセイボリー感が甘いキャラメルと合う）。手順：チョコを口で溶かして舌を覆い、茶をすすって口当たりを比べる。
- **用途見込み**：初心者向け4点セットの構成例。

#### 8-28 Teapro ガイド — 日本茶を含む9ペアリング
- **発信者／媒体・日付／URL**：Teapro（英国の茶葉サブスクリプション事業者、個別著者名なし）／ページ本文に日付明示なし／https://teapro.co.uk/the-ultimate-guide-to-pairing-tea-and-chocolate-for-a-richer-experience/
- **提案内容**：Masala Chai×ミルク、Milky Oolong（Jin Xuan）×ミルク、Earl Grey×ミルク、Mint Tea×ミントミルク、Gyokuro Asahi×ダーク（ミネラル感×深い質感）、Genmaicha×ダーク（ナッツ・煎り米香が苦味を相殺）、Matcha×ホワイト（苦味が極甘を切る対比）、Jasmine Phoenix Pearl 白茶×ホワイト、Chamomile×ホワイト。原則は「類似か対照か＋強度を合わせる」。
- **用途見込み**：玉露×ダーク、玄米茶×ダークの裏付け候補（複数源の1つとして）。

#### 8-29 宮原利衣（+Chocolat）— 日本茶5ペアリング【日本事例の中核】
- **発信者／媒体・日付／URL**：宮原利衣（京都・板チョコ専門店 +Chocolat）への取材／宇治田原製茶場ネットショップ特集、2022-12-01／https://shop.chanoma.co.jp/special/detail/025
- **提案内容**：原則：「似たものを探す」＋「反作用を狙う」。油分の多いチョコに油分ゼロの茶を合わせると後口がさっぱりする。①ハイカカオ×深蒸し茶（旨味・渋みバランス、苦×苦で甘みが残る）②アーモンドチョコ×茎茶 ③ミルクチョコ×ほうじ茶（焙煎の芳ばしさが濃い甘さをマイルドにし油分を流す）④ホワイト×玉露・抹茶（「強×強」に振り切る：濃い甘み・旨味同士が負けない）⑤パフ入りチョコ×玄米茶（穀物の芳ばしさが共通）。
- **用途見込み**：日本茶軸の組み合わせページの骨格として最も直接使える日本語一次発信。

#### 8-30 須田彩歌（明治）× 坂上克人（1899）— 緑茶×ダークの実食
- **発信者／媒体・日付／URL**：須田彩歌（明治 カカオマーケティング部、ショコラアドバイザー）、坂上克人（1899 日本茶インストラクター）／RESTAURANT 1899 公式ブログ（2021年2月バレンタイン期の記事、ページ内に西暦日付の明示なし）／https://1899.jp/blog/1997
- **提案内容**：須田：緑茶は柔らかな香り・旨味でチョコの各香りを引き上げるため相性が良い。コーヒーは似すぎて香ばしさが焦げ・苦味に転ぶことがあり、特徴の際立つ紅茶やほうじ茶はコツが要る。緑茶と合わせるならミルクより香料なしのダーク推奨。ピエール・マルコリーニ氏が「チョコに合う飲み物は水か緑茶」と述べたとのコメントに言及（**本記事内の引用であり、マルコリーニ一次発信は未確認**）。実食：1899「六煎茶」×明治ザ・チョコレート ダーク4産地（ドミニカ／ペルー／ベネズエラ／ブラジル）、一煎目70℃・二煎目90℃で評価が変わり二煎目では両者ともベネズエラを最良とした記録。
- **用途見込み**：煎茶（ブレンド）×シングルオリジンダーク、温度で評価が変わる点は「条件付き推測」表示の好例。

#### 8-31 長崎（丸八製茶場 焙煎士）— 焙じ茶屋の提案
- **発信者／媒体・日付／URL**：長崎（丸八製茶場 焙煎士）／加賀棒茶 丸八製茶場「焙煎こぼれ話」、2024-11-22／https://kagaboucha.com/cat3/153
- **提案内容**：ビターチョコ×プーアール熟茶（土様の香りとふくよかな深い甘み同士）、スモーキーな焙じ茶「くらさわ」も熟茶に似てビターに合いそう。パフ入りチョコ×玄米茶。アールグレイはどんなチョコにも（柑橘が爽やかな後味）、花香のある印雑種焙じ茶も万能。ナッツ入りチョコ×焙じ茶：理由付けは「ナッツも焙じ茶も焙煎工程に由来するロースト香が共通するから」（本記事自体は成分測定ではない）。
- **用途見込み**：「焙煎という共通工程」を理由に据える文案は、化合物レベルの推測表示と接続しやすい。

#### 8-32 大山拓朗（茶師十段）× 大石茂之（メリーチョコレート）対談
- **発信者／媒体・日付／URL**：大山拓朗（しもきた茶苑大山、茶師十段）、大石茂之（メリーチョコレート トップショコラティエ）／メリーチョコレート公式 note、公開 2026-01-23／https://note.com/marychocolate/n/nd39f408b5ea2
- **提案内容**：①ビターチョコ×ぐり茶（釜炒り玉緑茶）：すっきりした渋みと香ばしさが「口をぬぐう／リセット」役で油分を流しビターの個性を際立たせる。②スイートチョコ×芽茶：渋みで締めた後に柔らかな旨味・ほのかな甘みが残る。③ミルクチョコ×ほうじ茶：香ばしさ×まろやかさ。変わり種：玄米茶×クランチ系、旨味重視の抹茶を溶けたミルク／ビターの後に、昆布茶×チョコ（塩気・酸味のアクセント）。フルーツ系チョコは難しいが柑橘系（柚子・レモン）は合いやすい。溶けるタイミング・順番で味が変わる。
- **用途見込み**：ぐり茶×ビター、芽茶×スイートという他源にほぼ無い独自候補。「リセット型」役割ラベルの文案源。

#### 8-33 福寿園 — 茶師が選ぶティーペアリングセット（メーカー公式）
- **発信者／媒体・日付／URL**：株式会社福寿園／PR TIMES プレスリリース、2024-01-19／https://prtimes.jp/main/html/rd/p/000000077.000026565.html
- **提案内容**：お茶入りチョコと飲む茶の同系統ペアリングを商品セットとして提案：和紅茶チョコ（ホワイト＋ほうじ茶葉）×和紅茶ティーバッグ、抹茶チョコ（ホワイト＋煎茶葉）×抹茶入り煎茶「緑扇」、ほうじ茶チョコ（ミルク）×ほうじ茶「平安」、宇治抹茶濃茶トリュフ×かぶせ茶「朝露」（苦味×旨味）、抹茶みつボンボン×煎茶「銀閣」、抹茶ボンボンアソート×玉露「金閣」、碾茶入り抹茶クランチ×深蒸し煎茶「緑風」、ほうじ茶クランチ×かりがね玄米茶「白雲」。
- **用途見込み**：同系統（ほうじ茶×ほうじ茶等）の「増幅型」セット構成の実例。単体ペアリングではなく商品設計の知見として。

#### 8-34 KiKi × Tribal Cacao — 日本茶3種×カカオ産地3種
- **発信者／媒体・日付／URL**：KiKi北千住（日本茶専門）× Tribal Cacao（千葉・柏、Bean to Bar、店主 橋本氏）／KiKi 公式 note、公開 2022-01-20／https://note.com/kiki_co/n/ndf298020d77b
- **提案内容**：玉露煎茶FUU × トリニダード・トバゴ 70%（オレンジ皮様の渋み、赤ワイン様タンニン×渋みのあるFUU）。ハーブ煎茶SUISUI（ミント／レモングラス／ホワイトウィロー）× インド 66%（レモン・桃様のフルーツ酸×爽やか同士）。焙煎紅茶GEKKO × ガーナ 65%（ココナッツ・焼き菓子様の甘さ、ミルク感）。一般論：お茶の渋味・キレとチョコの甘み・油分が合う。
- **用途見込み**：茶のブレンド設計×カカオ産地の1対1対応表の日本実例。8-22 と並ぶ産地対応型。

#### 8-35 田中克典（Conche）— ショコラティエのペアリング専門店
- **発信者／媒体・日付／URL**：田中克典（Conche 代表・ショコラティエ）インタビュー／OCHATIMES、記事の日付は開いたページで確認できず／https://ochatimes.com/1010/
- **提案内容**：茶菓子屋 Conche の「オチャノトモセット」：手作りカカオスイーツ×日本茶（煎茶／和紅茶／ほうじ茶／品種茶から選択）のペアリング体験を提供。効果として「香りが引き立つ／旨味に重厚さが加わる／印象が一変する」を挙げる。具体的な1対1の固定ペアは本記事では明示されず、ショーケースの菓子は「どれを選んでもペアリングが成立しやすい」設計と説明。
- **用途見込み**：固定ペアではなく「成立しやすさで菓子側を設計する」という逆方向の設計思想の参考。

#### 8-36 サロンドロワイヤル公式ブログ — 定番組み合わせ集
- **発信者／媒体・日付／URL**：サロンドロワイヤル（チョコレート専門店）公式ブログ／日付はページで確認できず／https://www.s-royal.com/chocolate/blog/（お茶とチョコレートの組み合わせ記事）
- **提案内容**：ミルクチョコ×緑茶（強い甘みを茶が洗い流す）、ホワイト×玉露・抹茶（甘み同士が引き立て合う）＋ルイボス、ビター／ハイカカオ×黒茶・深蒸し茶（苦×苦だが甘みが苦味を抑制し後味すっきり）、ナッツ入り×ほうじ茶、アールグレイは万能。**記事は「科学的にも証明」「抑制作用」と述べるが出典提示はなく、科学的根拠として扱わない（言説としてのみ記録）**。
- **用途見込み**：黒茶×ビターなど、8-29・8-31 と重なる組み合わせの補強源の1つとしてのみ。

#### 8-37 その他の確認済み事業者ガイド（2件）
- (a) Dandelion Chocolate Japan／公式商品ページ、日付なし／https://www.dandelionchocolate.com/products/japanese-tea-bonbon-collection ：飲むペアリングではなく茶入りボンボンの設計知見：Hojicha（中森製茶）×アーモンドプラリネのトースト香に共鳴、Genmaicha × Kpalimé 70% の蜂蜜・パン様の香りを増幅、Matcha（静岡）×同70%。
- (b) Mariko（東京の茶販売者、note）／2026-09-13／https://note.com/mariko_tokyotea/n/n0ced1f1639c0 ：ほうじ茶×ミルクチョコ（焙煎香ピラジン類＝ナッツ／キャラメル様、と著者は説明するが測定根拠の提示はない）、深蒸し煎茶×ホワイト、和紅茶×70%以上ビター、抹茶×ナッツ・ベリー系チョコ。8-29・8-32 と重なる王道4型の補強。

#### B節：繰り返し現れる提案パターン（傾向）
1. **ほうじ茶 × ミルクチョコレート — 最多頻出**（8-29、8-32、8-25、8-26、8-36、8-37b、8-31）。理由付けはほぼ共通：焙煎香（ロースト／ナッツ／キャラメル様）がミルクの甘さ・脂肪と同調し、渋みが少ないため甘さを邪魔せず油分を流す。
2. **ほうじ茶・玄米茶など焙煎系 × ナッツ／パフ／クランチ**：「双方が焙煎工程由来の香ばしさを持つ」という工程共通型の理由付け（8-31 が最も明快、8-29⑤、8-32、8-37a）。
3. **ホワイトチョコ × 抹茶／玉露／煎茶（旨味の強い緑茶）**：8-29④「強×強」、8-36、8-28（Matcha×ホワイトは苦味が極甘を切る対比型）。**同じ組み合わせでも「同調（甘×旨）」と「対比（苦×甘）」の両方の説明が併存する**点に注意——表示ではどちらの理屈を採るか明示すべき。
4. **ダーク／ハイカカオ × 力強い紅茶・黒茶**：Yunnan（8-27、8-25）、Assam（8-23、8-24、8-22）、English Breakfast（8-23、8-20）、深蒸し茶・黒茶（8-36、8-29①）、プーアール（8-31、8-26）。理由：渋み・ボディがカカオの強さに負けない、油分・甘さをリセットする。
5. **アールグレイ × ミルク／柑橘系チョコ — 万能枠**（8-19③、8-23、8-24、8-31、8-36、8-21）。ベルガモット柑橘×チョコの相性を根拠とする。
6. **ジャスミン系 × ホワイト（または高カカオ）**：8-19④、8-23、8-28 に対し、8-24 は90%×ジャスミンと逆方向もある。
7. **Lapsang Souchong × キャラメル／高カカオの力強いチョコ**（8-27、8-22、8-21）。燻香×甘さ・土っぽさの対比／増幅。
8. **方法論の共通項**：「類似（kindred/complement）か対照（contrast）か」の二原則（8-20、8-28、8-29、8-21）、「順番と温度で溶け方が変わる」（8-19、8-30、8-32、8-26）、「茶の渋みが脂肪と甘さをリセットする」（8-29、8-30、8-32、8-34）。

#### B節：見つからなかった／弱かった領域
- ピエール・マルコリーニの「水か緑茶」発言の一次ソース：8-30 で二次引用を確認したのみ。本人サイト・一次インタビューは未確認。
- フランスのパティシエ／ショコラティエ本人による「飲むお茶×チョコ」の体系的ガイド：Baudry はチーズが中心でチョコ専論は見つからず。仏系では Palais des Thés 系が主体。
- 中国茶・台湾茶の専門家本人による体系ガイド：8-19 と 8-22 の熟成烏龍事例が主で、武夷岩茶・単欉・プーアールを横断する専門家の単独ガイドは見つからなかった。
- 日本の紅茶専門ティーソムリエによる日本語ガイド：日本語源は日本茶側（茶師・茶舗）とチョコ側（ショコラティエ・メーカー）に偏り、紅茶専門家単独の日本語ペアリング体系は薄い。
- 書籍紹介ページで中身のペアリング表まで確認できたものはなし。

#### B節：未確認
- **Conche 公式「［茶×チョコ］ペアリング for『茶の間』プロジェクト」**（https://www.conche.net/posts/11766865?categoryIds=202452）：取得時に 503 で開けず**未確認**。検索スニペット上の「富士の茶の間 高温焙煎丸火×インド」「黄金みどりほうじ×ガーナ」「焙煎烏龍茶×グレナダ」等の記述は、ページ未開示のため確認済み提案には含めていない。再取得できれば有望な産地対応型の一次候補。
- **Minimal（Bean to Bar）のペアリングガイド**（https://mini-mal.tokyo/blogs/journal/10772）：ページは開けたが、飲み物別ガイドの概要ページであり「焙じ茶や焙煎紅茶までカバー」との総論のみで、個別の組み合わせ・理由付けの本文はこのページでは確認できなかったため、確認済み提案としては計上していない。

### C. 公的機関・大学・学協会・業界団体（原典確定1件＋後続記事1件＋確認16件）

#### C-1【参考情報（原典確定）】築舘香澄 2019 — WASH／SUPPLEMENT／SHARE の原典
- **発行機関・題名・日付**：収載機関：日本私立学校振興・共済事業団（shigaku.go.jp、同事業団の「若手・女性研究者奨励金」研究レポートとして収載）。正式な研究課題名：「ティーペアリングの科学的解明による茶と和食との相性の検討」。著者：築舘香澄（ツキダテ カスミ）、所属（当時）：川村学園女子大学生活創造学部 講師、博士（生活科学）・管理栄養士。文書種別・年度：「2019年度 若手・女性研究者奨励金 レポート」（PDF冒頭に明記。同事業団の2019年度（第2回）女性研究者奨励金レポート一覧ページでも同一課題名・同一著者で掲載されていることを別途確認）。https://www.shigaku.go.jp/files/s_josei2019report014.pdf
- **主要な知見**：(1) 国内外4ウェブサイトのティーペアリング計323件を茶種別に集計。食品を肉類・魚介類・野菜類・卵・チーズ・きのこ類・デザート類の7群に分け、例として「紅茶は肉類」「煎茶は野菜類」「ウーロン茶は肉類・魚介類・チーズ・デザート類」との相性がよいとされていた。(2) **茶15種類と食品9種類を味覚センサー（TS-5000Z）で分析**し、組み合わせの味わいを **WASH（洗い流す）、SUPPLEMENT（補完）、SHARE（同調）** の3パターンに分類。計135件の分類結果：**WASH 13件、SUPPLEMENT 9件、SHARE 18件**（残りは3パターンに分類されなかったもの）。「SHARE により相性がよいと感じることが最も多い」「特徴的な味わいを持つ茶ほど分類されやすく、標準的な味わいの茶はどの食品とも比較的合うため分類されにくいことが示唆された」と結論。著者自身、官能評価のみに現れるものは「味覚センサーでは評価できない茶の香り」を主とした評価と考えられ、「ペアリングには香りの分析も重要」と述べている。
- **適用範囲と限界**：助成金研究レポートであり、**査読論文ではない**。対象は茶×和食系食品であり、**チョコレートとの組み合わせを扱った研究ではない**。数値・件数は茶×食品9種の結果であり、チョコレートでも同じ分布になる根拠にはならない。
- **何に使えるか**：ペアリングの「相互作用タイプ」分類軸（WASH＝洗い流す／SUPPLEMENT＝補完／SHARE＝同調）の出典として直接使える唯一の一次資料。チョコレートへの転用は「分類枠組みの借用」と明示すべき。
- **確認手段**：PDF 原典を全文確認＋同事業団の2019年度レポート一覧ページで照合（A節の探索でも独立に同一原典を確認：8-17 参照項目）。

#### C-2【参考情報（学会誌シリーズ記事）】築舘香澄 2025 — WASH分類の発展形
- **発行機関・題名・日付**：日本家政学会／「国産紅茶と和菓子をペアリングする」築舘香澄（川村学園女子大学、当時准教授）／日本家政学会誌 Vol.76 No.1, 41–46（2025）。https://www.jstage.jst.go.jp/article/jhej/76/1/76_41/_pdf/-char/en
- **主要な知見**：国産紅茶（市販ペットボトル）とスリランカ紅茶を味覚認識装置 TS-5000Z で分析し、和菓子5種・洋菓子5種との相性を女性27名の嗜好型官能評価（2点試験法）で比較。和菓子では小豆あんのどら焼き・ようかん、黒糖蜜のわらび餅で国産紅茶との相性が有意に良い（p<0.05／0.01）と示され、洋菓子ではシュークリーム・みかんゼリーでスリランカ紅茶が有意に好まれた。国産紅茶は先味・後味とも渋味がスリランカ紅茶より低いことが味覚センサー値として示されている。今後の課題として、相性の要素を「Wash（食べ物の味わいを茶が洗い流す）」「SHARE（同じ香りの成分を持つ）」「DOMINANT（どちらかの強度が強すぎる）」等で提示・分類する方針が明記されている（C-1 の3分類の発展形）。
- **適用範囲と限界**：学会誌掲載だが「シリーズ」記事と表示されており、査読論文であることはページ上で確認できなかったため「根拠」には格上げしない。チョコレート菓子そのものは対象外（洋菓子はシュークリーム等）。
- **何に使えるか**：「渋味の弱い茶×甘い和菓子」という具体ペアの官能データとして引用可能。
- **確認手段**：J-STAGE の PDF 原典を全文確認。

#### C-3【参考情報】農林水産省「茶の技術情報のページ」No.31（農研機構担当）
- **発行・題名・日付**：農林水産省（問合せ先：農研機構 果樹茶業研究部門茶業研究領域・金谷茶業研究拠点）／「茶品種『そうふう』のアロマプロファイルと香気を活かす生産技術」／ページ上の公表日は未確認。https://www.maff.go.jp/j/seisan/gijutsuhasshin/techinfo/cha.html
- **主要な知見**：「そうふう」の香気寄与成分のアロマプロファイルを作成すると花様・果実様の匂いが強い。香気を活かすには硬葉は適さず、摘採前の被覆は行わず、蒸熱時間は短くする。同ページには静岡県茶業研究センター担当の「豊かな香りと健康効果を併せ持つ『静岡型発酵茶』の開発」（甘い花様の香り）や「『香り緑茶』の香気発揚方法及び大量生産技術の開発」も収載。
- **何に使えるか**：茶側の「花様／果実様」香気プロファイルの公的出典。ペアリング自体の検証ではない。

#### C-4【参考情報】農研機構 食品研究部門「官能評価グループ」
- **発行・題名・日付**：農研機構 食品研究部門／「官能評価グループ」紹介ページ／日付は未確認。https://www.naro.go.jp/laboratory/nfri/introduction/chart/0202/index.html
- **主要な知見**：訓練パネルによる分析型官能評価と消費者パネルによる嗜好型官能評価の高度化・高速化、個人差を加味した嗜好評価に取り組む。「官能評価を適切に代替できるよう、味覚センサ装置を用いた味の定量化技術の開発と食品の品質解析」にも取り組むと明記。
- **何に使えるか**：味覚センサーによる定量化＋官能評価という方法論の公的裏付け。茶×チョコレート個別の成果はこのページにはない。

#### C-5【参考情報】静岡県茶業研究センター「『香り緑茶』の香りを視覚化する技術」
- **発行・題名・日付**：静岡県農林技術研究所 茶業研究センター（商品開発科）／新技術パンフレット「『香り緑茶』の香りを視覚化する技術」／静岡県公式サイトの2016年度（平成28年度）新技術パンフレット一覧に収載（個別PDF内の発行年表記は未確認）。https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/044/307/h28-53.pdf.pdf
- **主要な知見**：（独）農研機構果樹茶業研究部門作成のフレーバー・ホイールの項目を用いた官能評価からフレーバー・プロファイル・マップを作成し、GC-MS 香気成分と官能評価を PLS 解析で関連付ける手法を開発。「香り緑茶」は「甘い花のような香り」を有すると確認。「甘い香り」はミルク香・バニラ香と関係しクマリン、Z-ジャスモンが、「花のような香り」はインドール、ジャスミンラクトン、ジャスモン酸メチルと関係が深いと解析。
- **何に使えるか**：茶のフレーバーホイール項目⇔香気成分の対応（ミルク香／バニラ香⇔クマリン等）は、チョコレートのミルク・バニラ系ノートとの「共有香気」説明に化合物レベルで接続できる。ただしペアリング検証ではなく単品の香味解析である点は明示が必要。

#### C-6【参考情報】鹿児島県茶業部「仕上げ茶における品質（香味）の数値化と見える化」
- **発行・題名・日付**：鹿児島県農業開発総合センター茶業部加工研究室／PDF内に「（R04）」表記＝令和4年度（2022年度）普及成果。https://www.pref.kagoshima.jp/ag11/pop-tech/nenndo/documents/documents/104090_20230417115632-1.pdf
- **主要な知見**：うま味は HPLC による浸出液アミノ酸総量と近赤外分析の NDF を変数とするモデル式で、渋味はエステル型カテキンとカフェインを変数とするモデル式で数値化可能（官能実測値との相関図が掲載）。
- **何に使えるか**：茶の「うま味／渋味」を成分から推定する公的モデルとして、ペアリング画面の茶側指標の設計参考になる。食品との組み合わせ研究ではない。

#### C-7【参考情報】埼玉県茶業研究所 成果報告（『おくはるか』の桜葉様香味）
- **発行・題名・日付**：埼玉県茶業研究所／成果報告ページ（掲載日 2026年4月27日とページに表示）。令和4年度「『おくはるか』の桜葉様香味発揚条件について」、令和3年度「『おくはるか』の桜葉様香味の発揚条件」が収載。https://www.pref.saitama.lg.jp/b0914/seika.html
- **主要な知見**：索引の範囲のみ確認。個別PDFの内容（発揚条件の具体値）は未確認（開いていない）。
- **何に使えるか**：桜葉様香気を持つ品種茶の存在確認レベル。ペアリング情報ではない。

#### C-8【参考情報】静岡県立大学「風味言語化・解析AIを応用した緑茶のペアリング予測」
- **発行・題名・日付**：静岡県立大学 食品栄養科学部（代表者：伊藤圭祐 准教授、寺田祐子 助教ほか）／教員特別研究推進 研究テーマ「緑茶の立体的おいしさ表現を可能とするフレーバーホイール生成AIの開発」、講演題目「風味言語化・解析AIを応用した緑茶のペアリング予測」／資料名 US_forum2025（2025年フォーラム資料と推定されるが、資料内の日付表記は未確認）。https://www.u-shizuoka-ken.ac.jp/media/US_forum2025_tokubetsu130.pdf
- **主要な知見**：成分情報から風味の言語表現（フレーバーホイール）を生成するAI「F-index Comp」を応用し、2食品のホイールを比較して相性をスコア化する「F-index Pairing」を開発。従来のフードペアリング理論（香気成分の一致）に対し、風味の類似度に基づく点が優位性とされる。検証：41名パネル、市販緑茶A・B・C＋紅茶Dの混合茶ではスコア順位とヒト評価（おいしさ・統一感）が完全一致、緑茶A×ナッツ類E–Iでもほとんどの順位が一致し、ヒトの感覚とある程度合致することが示唆された。
- **適用範囲と限界**：大学の研究紹介資料。査読論文かどうかは未確認。検証対象は茶×茶と茶×ナッツであり、茶×チョコレートでの検証はされていない。また本アプリは「スコア化しない」方針であり、方法論の採用ではなく対照事例としての記録である。
- **何に使えるか**：ペアリングを「フレーバーホイール同士の類似度スコア」として定量化する公的大学発の方法論として最も直接的な対照例。

#### C-9【参考情報】INRAE／CSGA Weurman プロシーディングス → 主掲載 8-13

#### C-10【参考情報】University of Reading「Flavour Centre」
- **発行・題名・日付**：University of Reading, Department of Food and Nutritional Sciences／「Flavour Centre」公式ページ／日付は未確認。https://www.reading.ac.uk/food/our-facilities/flavour-centre
- **主要な知見**：flavour の化学の理解が新製品開発に不可欠とし、抽出技術群による aroma and taste compounds、precursors・offnotes・taints 等の分析サービスと共同研究を提供するセンターであることを公式に確認。茶×チョコレートのペアリング個別研究の掲載はこのページにはない。
- **何に使えるか**：香味分析の実施機関としての参照のみ。ペアリングの中身の根拠にはならない。

#### C-11【参考情報】Wageningen University & Research コース「Advanced Molecular Gastronomy」
- **発行・題名・日付**：Wageningen University & Research／専門家向けコース一覧ページ収載の「Advanced Molecular Gastronomy: Physical and Chemical Aspects of Flavour Pairing」／ページ自体の発行日は未確認。https://www.wur.nl/en/education/for-professionals/programmes-and-courses-professionals-food-technology
- **主要な知見**：公式説明文に「**wine–chocolate interactions** を通じて分子ガストロノミーを学び、その物性が官能知覚と successful flavour pairing をどう形作るかを学ぶ」と明記されていることを確認。同大学が「フレーバーペアリングの物理化学」をワイン×チョコレートの相互作用で教える公的カリキュラムを持つ、という事実の確認にとどまる（研究報告書ではない）。
- **何に使えるか**：「ペアリングは香気成分の共有だけでなく物性・相互作用で決まる」という学術的枠組みの所在確認。茶×チョコレートへの直接の知見は含まれない。

#### C-12 UC Davis について（未確認の明記）
- UC Davis の官能科学やコーヒー×食品ペアリングについては、検索で得られたのはセミナー告知・人物紹介ページと、出所不明の二次サイト（Alibaba 系の解説記事が「UC Davis Sensory Science Center の研究」と称するもの）のみで、茶またはチョコレートのペアリングに関する UC Davis 公式の研究紹介・報告書ページは開いて確認できなかったため**未確認**とする。二次サイトの数値（例：甘味知覚が最大20%増強等）は一次情報で裏付けが取れていないため採用しない。

#### C-13【参考情報】日本チョコレート・ココア協会「栽培地域と品種」
- **発行・題名・日付**：日本チョコレート・ココア協会／「栽培地域と品種」（チョコレート・ココア辞典内）／日付は未確認。http://www.chocolate-cocoa.com/dictionary/cacao/characteristic.html
- **主要な知見**：カカオ豆の味は産地・樹の種類・土壌・気候で異なる。クリオロ種は「豆の品質は良く、独特の香りを有しており、フレーバービーンズとして珍重される」「苦味が少ない」、フォラステロ種は「豆は偏平型で苦味が強いのが特色」、派生種に「花の香りに特色を持つエクアドル（アリバ）」、トリニタリオ種はクリオロ×フォラステロのハイブリッドで「良質な豆」と明記。同ページで ICCO が国連ココア会議に基づくココア協定の実施機関であり、同協会が協力会員として参加していることも確認。
- **何に使えるか**：チョコレート側の系統（クリオロ／フォラステロ／トリニタリオ）×香味傾向の日本語の公的整理として使える。ペアリング情報は同協会サイトでは見つからなかった。

#### C-14【参考情報】ICCO プロジェクト「fine and bulk cocoa の区別基準」
- **発行・題名・日付**：International Cocoa Organization（ICCO、監督機関）／実行機関 INIAP（エクアドル）／"Study of the chemical, physical and organoleptic parameters to establish the difference between fine and bulk cocoa"、プロジェクト期間 January 2001 – March 2006（公式プロジェクトページに明記。完了報告書は2007年8月付けと検索結果の報告書PDFに表示されたが、報告書PDF自体は未開封のため日付は未確認扱い）。https://www.icco.org/study-of-the-chemical-physical-and-organoleptic-parameters-to-establish-the-difference-between-fine-and-bulk-cocoa/
- **主要な知見**：fine/flavour カカオと bulk カカオを区別する普遍的基準の確立が目的。結果：発酵・乾燥の各パラメータは品質判定には有用だが fine と bulk の区別はできなかった。テオブロミン／カフェイン比に区別の可能性、ピラジン類等の揮発性化合物は fine カカオの産地間の区別に使える可能性。官能評価では産地ごとに異なるフレーバープロファイルが確認され、同一遺伝子型でも環境がフレーバーに影響することが示された。
- **何に使えるか**：チョコレート側の「産地でフレーバープロファイルが異なる／遺伝子型×環境」という公的根拠（§7-17 と同方向）。茶とのペアリング自体は対象外。

#### C-15【参考情報】世界緑茶協会（O-CHA NET）「水によって違うお茶の味」
- **発行・題名・日付**：公益財団法人 世界緑茶協会／「水によって違うお茶の味」（著者名として小泊重洋とページ末尾に表示）／日付は未確認。https://www.o-cha.net/teacha/nomikata/mizu.html
- **主要な知見**：軟水では茶成分がよく抽出され旨味・渋味・苦味がバランスよく出る。日本茶には硬度50～80程度が適するとされる一方、硬度300程度の欧州産ミネラルウォーターでは茶のシュウ酸がカルシウムと結合して渋味がなくなりまろやかになる場合がある、等。水という「組み合わせ相手」で渋味が変わるという、ペアリングに隣接する知見。同協会サイト内で茶×食品／チョコレートのペアリング解説は見つからなかった。
- **何に使えるか**：「渋味は相手側の成分（カルシウム等）でマスキングされ得る」という相互作用の日本語出典として補助的に使える。

#### C-16 World Cocoa Foundation（WCF）について（未確認の明記）
- WCF と TCHO によるガーナ Cocoa Research Institute of Ghana への「Flavor Lab」設置（官能パネルによる客観的フレーバー評価の訓練、発酵・乾燥と品質の結び付け）は、WCF 発とされるプレスリリースを転載した二次媒体（Perishable News、Confectionery Production、いずれも2013年）でのみ確認でき、**WCF 公式サイト上の当該ページは開けなかったため未確認**とする。

#### C-17 日本茶業中央会について
- 本探索の検索範囲では、香味・ペアリングに関する同会の研究紹介／報告書ページは**見つからなかった**（未確認ではなく「本探索では未発見」と記録する）。

#### C-18【参考情報】台湾・茶改場「臺灣特色茶風味輪」
- **発行・題名・日付**：農業部茶及飲料作物改良場（茶改場）／「臺灣特色茶風味輪簡介」（農業知識入口網・茶葉主題館。發布日期 2023年2月20日、更新日期 2024年11月13日と表示）。https://kmweb.moa.gov.tw/subject/subject.php?id=50828
- **主要な知見**：茶改場の製茶・感官品評専門研究人員25名の工作小組が、全臺の優良茶競賽から代表性のある**495サンプル**を記述的分析で品評し合意形成して風味輪を作成。2020年1月20日・7月21日に六大茶系（臺灣緑茶、清香型條形包種茶、清香型球形烏龍茶、焙香型球形烏龍茶、東方美人茶、臺灣紅茶）の風味輪を正式発布し、英・日文版も展開すると明記。
- **何に使えるか**：公的機関が風味輪を標準化した実例として、アプリの茶分類・風味輪設計の参照になる。チョコレートとのペアリング情報は含まれない。

#### C-19【参考情報】中国農業科学院茶葉研究所「海南五指山大葉種紅茶の特徴品質の掘り起こし」
- **発行・題名・日付**：中国農業科学院（来源：中国農業科学院茶葉研究所）／「海南五指山大叶种红茶特征品质被挖掘」／発布 2026年8月24日（ページに明記）。https://caas.cn/xwzx/kyhd/94b1b04f259b4199bbf22855a7507f71.htm
- **主要な知見**：茶葉精準加工創新團隊が海南大葉種紅茶・英徳紅茶・雲南紅茶の風味特徴と化学組成を体系的に比較し、感官表征から特徴化学標志物までの研究体系を構築。海南五指山大葉種紅茶は「滋味は甜醇で爽口、花果香を伴い、香気は甜香・果香・杏仁香・奶油香が鮮明」とされ、メチル化カテキン等の特徴的二次代謝物の富集が報告された。**成果は査読誌 Food Chemistry に掲載されたと本ページに明記**されている（原論文自体は未開封のため、本項目自体は「根拠」に格上げしない）。
- **何に使えるか**：紅茶の「杏仁香・奶油香」などナッツ／クリーム系ノートの公的表征例として、ミルクチョコレート等との同調型説明の茶側の語彙参照になる。ペアリング検証ではない。中国茶葉研究所のサイトで茶×チョコレート／ペアリング自体の公表情報は見つからなかった。

#### C節：見つからなかった領域
1. **茶×チョコレートそのものを対象にした公的機関・大学・業界団体の研究／報告書は、今回の探索範囲では1件も確認できなかった。** 確認できたのは「茶×和食・和菓子・ナッツ」（C-1、C-2、C-8）、「茶単品の香味解析」（C-3、C-5、C-6、C-18、C-19）、「カカオ単品のフレーバー区分」（C-13、C-14）、「渋味一般の機序」（8-13）、「ワイン×チョコレートのペアリング教育」（C-11）までである。アプリで茶×チョコレートを述べる際は、これらの隣接知見からの外挿であることを明示する必要がある。
2. 農研機構・食品総合研究所系で「茶×食品の組み合わせ」に特化したプレスリリース／成果情報は見つからなかった（方法論ページのみ、C-4）。
3. 静岡県・鹿児島県・埼玉県の各茶業研究機関では、ペアリング研究は見つからず、いずれも品種・製法による香味発揚と香味の数値化が中心だった。
4. 世界緑茶協会もペアリング解説は未発見（水と味の解説のみ確認、C-15）。
5. INRAE 公式サイト（inrae.fr）上の渋味解説ページ自体は未確認（Zenodo 収載の原典で代替確認：8-13）。

### D. §8 の総括（査読証拠との関係）
- §8 全体の収録は A節17件・B節20件・C節19件（うち未確認の明記3件を含む）。重複（築舘レポートは A・C 両ラインで独立確認、Wang et al. は A・C で同一文献）を除くユニーク件数は約53件。
- **専門家言説（B節）と査読証拠（§5）の緊張関係**：専門家は高カカオ×力強い茶（Assam、雲南、プーアール等）や「強×強」（ホワイト×玉露・抹茶）を積極的に提案するが、直接研究（§5 A-1、A-2）では99%ペアは概ね拒否され、均衡が好まれた。専門家の「強×強」は嗜好の実測ではなく実践知の表明であり、表示では実測知見と混同しないこと。逆に、最多頻出の「ほうじ茶×ミルクチョコ」には査読側の直接対応研究がなく、仮説としての格付けを維持する。
- **分類枠組みの借用候補**：C-1 の WASH／SUPPLEMENT／SHARE（＋C-2 の発展形 DOMINANT）は、相互作用タイプの表示ラベルとして借用可能だが、出自（味覚センサーによる茶×和食の分類、未査読レポート）を併記し、分布数値をチョコに転用しないこと。
- **方法論の対照例**：C-8（F-index Pairing）は「ホイール類似度スコア」型の定量化であり、本アプリの「スコア化しない」方針とは逆の設計である。将来の研究用アプリで方法論を比較検討する際の対照として保持する。

---

## §9 統合：既存ルールの補強・新規ルール候補・空白

### 9.1 既存ルール M1〜M10 への補強

- **M1（香りによる甘味の増強と調和）**：1-1（Frank & Byram 1988：増強は香り×味ペア依存、鼻をつまむと85%消失）が「適合するペアに限る」という適用条件を精密化。1-3（Dalton 2000：閾値下統合）、1-5（Small 2004：一致ペアでの超加算と経験依存）が神経・心理物理の両面から補強。1-8・1-9（Stevenson 1995/1998）が学習機序を、**1-11（Fondberg 2021）が学習効果の否定的結果として過大表示への歯止め**を与える。実食品側では §5 B-1（Romeo-Arroyo 2023：茶×クッキーで甘味知覚が香りに左右される）が茶文脈の実例。7-2b（Thomas-Danguin et al. 2016 章）が総説典拠。
- **M2（カカオの香りによる苦味の増強）**：直接の追加補強は薄い。§5 E-4（Galmarini 2018：苦味がペアの否定的ドライバー）が間接補強。§1 の空白のとおり、苦味への香りの効果は甘味に比べ証拠が薄いことを、ルール文の根拠区分（探索的な予想）の維持理由として明記すべき。
- **M3（甘味による後鼻腔香の増強）**：1-5（Small 2004）、1-7（Delwiche 2004）、7-2c（Briand & Salles 2016 章）が補強。
- **M4（香り混合物の抑制）**：7-1b（Stevenson 2016 章：フレーバーの結合＝統合知覚）が「合算にならない」ことの理論的枠組みとして補強。Laing & Willcox 1983 への直接の追試的補強は今回得られなかった。
- **M5（味同士の混合抑制）**：3-15（Keast & Breslin 2003 の再確認：濃度依存・非対称の設計原則）、3-13・3-14（Breslin & Beauchamp 1995/1997：塩による苦味抑制の化合物依存性と非対称性）が補強。
- **M6（甘味による渋味の緩和）**：7-10（Hofmann 2018 学位論文：紅茶で糖の渋み低減は粘度ではなく甘さによる；脂肪も渋み・苦みを同様に下げる）が実飲料側の強い補強。§5 C-1（Piyasena 2025：β-カゼインが渋味を和らげる）が乳成分経路を追加。ただし 3-28（Smith 1996：アスパルテームの甘味追加は渋味に影響せず苦味を下げた）は Lyman & Green 1990 と方向が一致しない点があり、甘味料の種類依存性として緊張関係を併記すべき。
- **M7（渋味と脂肪の対向性と渋味の積み上がり）**：対向性は 2-12（Nygren 2001）、2-13（Nygren 2002）、2-14（Madrigal-Galan & Heymann 2006）、2-10（Bastian 2010：チーズ先行で全ワインの渋味低下）がワイン×食品で反復補強。積み上がりは 3-5（Dinnella 2010：反復曝露で渋味評定が積み上がる、応答群依存）、7-10（Hofmann 2018：複数口で蓄積し時間プロファイルが異なる）、3-31（Guinard 1986、書誌のみ）が補強。機構側は 3-1（Charlton 2002）、3-2（de Freitas & Mateus 2001）、3-3（Soares 2007）、3-6（Ployon 2018：粘膜ペリクルの凝集・摩擦上昇と bPRP の保護）、3-7（Prinz & Lucas 2000：潤滑性低下）が厚くなった。
- **M8（脂肪の口内コーティングと香りの持続）**：4-4・4-5（Frank 2011/2012：Ko/w 依存、脂肪増加で嚥下後比率が増える）、4-3（Linforth 2010：log P で送達差を推定するモデル）、4-11（Repoux 2012：脂肪↑→即時放出↓だが口内残留↑・呼気中持続↑）、4-14（Guichard 2017：mouth coating が疎水性香気の余韻知覚を担う）、4-8（Doyennette 2011a：嚥下後残渣＋唾液が余韻の場）、4-18（Esteban-Fernández 2016：粘膜吸着）、4-22（Appelqvist 2016：脂肪膜の蓄積）が補強。既存の「方向は一方向に断定できない」という留保は、親水性化合物は嚥下前中心・疎水性化合物は嚥下後中心という化合物依存の形に精密化できる。
- **M9（温度と甘味の感じ方）**：3-26（Cruz & Green 2000：thermal taste、TRPM5 とは別系統）、6-21（Green & Nachtigal 2012：加温は甘味への順応を遅らせる）、4-20（Engelen 2003：製品温度↑でフレーバー強度と fat afterfeel↑）、4-21（Pramudya & Seo 2018：冷めていく過程で属性が変化）が補強。ただし「温度差そのもの」を検証したペアリング研究は無く（§6 の未確認項）、温度マッチングの断定表示はできない。
- **M10（うま味と香りの相互作用）**：3-16（Yamaguchi 1967：相乗の原典）、3-17（Rifkin & Bartoshuk 1980：「真の相乗」の判定基準）が「相乗」という語の使用基準を与える。§5 B-2（Sato & Kinugasa 2019：緑茶が鰹だしのコクを増強、ただし渋味過剰で抑制）が茶主体の実証として補強。コク味系 3-18（Ueda 1990）、3-19（Ueda 1997）、3-20（Dunkel 2007）、3-21（Maruyama 2012）が「コク＝持続性・広がり・厚み、呈味文脈依存」という性格推測の語彙基盤を与える。7-15（Yu 2025：茶のうま味総説、多感覚的相乗の展望）が茶側典拠。

### 9.2 新規ルール候補

- **N1 塩×苦味抑制**（根拠：3-13、3-14）：塩味のあるチョコ（塩キャラメル等）と苦味の強い相手では、苦味が選択的に抑えられ甘味が際立つ可能性。苦味化合物依存の留保付き。一般的な知見レベル候補。
- **N2 炭酸×味質変化**（根拠：3-23、3-24）：発泡性の茶（スパークリングティー等）では、総強度よりも味の質の配分（甘・塩の比率感）が変わる。探索的な予想。
- **N3 辛味×甘味・フレーバー抑制**（根拠：3-25）：カプサイシン（チリチョコ等）は甘味とフレーバーを抑制するが酸味は保つ。探索的な予想。
- **N4 温度×脂肪感**（根拠：4-20）：温かい相手ほどフレーバー強度と脂肪の後味（fat afterfeel）が増す。半固形食品での実証であり、温茶への適用は一般的な知見〜探索的な予想の境界。
- **N5 順序・脂肪膜蓄積**（根拠：4-22、4-23、6-18）：高脂肪側を先に・繰り返し摂ると口内に脂肪膜が蓄積し、後の飲料の感じ方が変わる。キャリーオーバーは同化（前の試料へ引き寄せ）が主。順序表示（お茶先行／チョコ先行）の根拠。
- **N6 粘膜吸着による余韻**（根拠：4-18）：飲料の香り成分が口腔粘膜に吸着し、吸着量と相互作用の強さが残り香の減衰を決める。被験者3名のため探索的な予想。
- **N7 ポリフェノール×香気放出の増減**（根拠：4-19）：フェノール類が共存香気の口内放出を化学構造依存に増減させる（ワインでの実証）。お茶のカテキン類がチョコレート香気の出方を変えるという類推の、構造的に最も近い根拠。探索的な予想。
- **N8 茶クリーム／複合体形成**（根拠：3-10、3-11、3-12）：お茶が冷めるとテアフラビン×カフェイン等の複合体が析出し（ガロイル型カテキンが優先的に沈殿）、渋味成分そのものが減る方向に働く。お茶自体の現象としては一般的な知見。冷たいペアリングの注意表示に使える。
- **N9 多糖×渋味（構造依存）**（根拠：3-8、3-9、3-30）：多糖はタンニン–唾液タンパク質凝集を抑えて渋味を和らげうるが、高分子・高エステル化では逆に沈殿性を高める。一方向ルールにはせず「構造依存で逆転しうる」注意書き型が適切。探索的な予想。
- **N10 乳タンパク質×渋味マスキング**（根拠：§5 C-1、C-2）：乳成分（β-カゼイン等）がカテキンと結合して渋味を和らげる。ミルクチョコ／ホワイトチョコ×お茶の説明に橋渡し可能。一般的な知見候補（総説＋in vitro 競合相互作用）。
- **N11 支配・バランス（表示設計原則）**（根拠：§5 A-1、A-2、2-17、2-11）：直接研究では「均衡したペアが好まれ、チョコ支配で受容低下が最大」。一方 2-11（Kustos 2020）は「完全な均衡よりわずかな支配が好まれる場合がある」ことを示す。ルール化する場合は両論併記し、支配の有無を断定スコア化しない。
- **N12 期待・情報効果（UI 原則）**（根拠：6-8、6-9、6-12、6-13、6-11）：表示文・価格・事前説明は経験自体を変え、効果は試食前の情報で強く出る。相互作用ルールではなく、表示順序・注意書きの設計原則として扱う。
- **N13 個人差（注意書き原則）**（根拠：6-1〜6-7、3-4）：苦味感受性（PROP/TAS2R38 だけでは説明できない）と渋味応答（唾液の維持能力）には大きな個人差があり、同じペアの好みが逆転しうる。強度表示を幅で示す根拠。

### 9.3 直接研究2件から得られる設計原則（§5 A-1、A-2）
- カカオ分が高いほどペア嗜好は上がらない：30%・70%が好まれ、99%は概ね拒否された（苦味・渋味の累積が背景として整合的：§5 E-4 の「苦味・酸味・渋味＝否定的ドライバー」）。
- ペアの好みは、チョコ単体の好みより**飲料単体の好み**に強く依存する（単品嗜好の交絡を常に併記する）。
- 全体としてコーヒーが茶より有意に好まれるパートナーだった、という対照結果も正直に記録する（茶のペアリングが万能であるかのような表示はしない）。
- 混合試食（チョコを溶かして広げてから飲料を含む）という摂取形式自体が結果の前提条件である。

### 9.4 探索しても見つからなかった領域（空白の確定）
- **産地×品種×製法レベルの茶×チョコレート研究**：確認できなかった。組み合わせレベルの表示は引き続き隣接証拠からの推論であり、証拠レベル明示が必須。
- **茶×チーズの査読ペアリング研究**：確認できなかった（専門家言説のみ＝参考情報、§5 G、§8）。
- **コーヒー×チョコレートの独立した査読研究**：§5 A-2 に内包される形のみ。
- **2014年以降の茶×チョコ直接研究の追試・独立再現**：見つからなかった（探索範囲内の報告であり、不存在証明ではない）。
- **日本人被験者でのクロスモーダル検証**（色×味、香り×甘味）：見当たらなかった。
- **温度差（温度マッチング）そのものを検証したペアリング研究**：見つからなかった（§6 未確認項）。
- **苦味・渋味への香りの効果の系統的研究**：甘味中心の研究群に比べ著しく薄い（§1 の空白）。
- **中国大陸発の茶×食ペアリング学術研究**：CNKI 等に未アクセスのため「未探索・未確認」（§7 G）。
- **お茶×チョコレートの実験的プレプリント**：隣接テーマ（フレーバーネットワーク、唾液×香気放出、カカオ香味等）では11件確認できたが、お茶×チョコレートのペアリング自体を実験したプレプリントは0件だった（§8 A）。直接の学会要旨は COCOTEA 2013 発表要旨のみ（§8 8-12、結果数値は転載要旨に含まれず未確認）。

### 9.5 統合（後工程）時の注意リスト
- §5 A-1 の茶種別順位（30%×紅茶は好まれた群、70%×紅茶は低評価群等）はアブストラクト範囲外・二次報道経由。使うなら A-2 本文の個別平均値表の確認が前提。
- 格上げ作業（一次確認で格上げすべき書誌のみ確認）：6-8（Deliza & MacFie 1996）、6-14（Pineau et al. 2009）、1-22（Schifferstein & Verlegh 1996）、§5 D-4（Port×チョコTDS の著者・年確定）、§5 C-3（Choi & Lee の巻号頁）、7-20・7-21（台湾学位論文の抄録全文）。
- DOI 未確認のままの項目：4-2（Linforth 2005）、4-4（Frank 2011）。要旨未読の項目：4-1（Brauss 1999）、4-6（Giroux 2007）。登録前に再確認すること。
- §8 は全て参考情報（未査読・専門家言説・機関サイト・メディア）。推測（未検証）の出発点としてのみ使い、実測・寄与の単独根拠にしない。WASH／SUPPLEMENT／SHARE 分類は原典（2019年度助成金レポート、§8 C-1）が確定したが未査読の参考情報であり、分類枠組みの借用は出自（味覚センサーによる茶×和食系食品の分類）の併記を条件とし、分布数値（WASH 13／SUPPLEMENT 9／SHARE 18）をチョコレートに転用しない。
- 誤った帰属の禁止：「de Klepper の学位論文」「Galmarini の学位論文」は存在を確認できなかった（§7 冒頭訂正）。de Klepper 2011 は論説として 7-19 に格付け済み。
- 本書の文献を sources.ts に登録する際は、確認区分（一次確認済み／書誌のみ確認／未確認／参考情報）を落とさずに引き継ぐこと。未確認のものは登録しない。

（以上で文献拡張ラインAの記録を完了とする。統合・登録・ルール化は後工程。）
