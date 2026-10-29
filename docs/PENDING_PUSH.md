# GitHub反映 保留リスト

最終更新: 2026-10-30 朝

## 保留中
- なし（2026-10-30 朝、夜間保留分を push-files 1回の操作で main へ反映済み）

## 完了済みの反映
- 2026-10-29 夜: 初期版31ファイル（main）、本番ビルド（gh-pages）
- 2026-10-30 朝: 画面レンダリングテスト追加分、データ拡充候補の調査結果（17件+参考1件）、本ファイル

## ユーザー対応待ち（フェイリス側の書き込みではない）
- GitHub Pages の有効化: Settings → Pages → Deploy from a branch → gh-pages。有効化後に公開URLの動作確認を行う。

## 2026-10-30 拡充取り込み（優先順①〜⑤）— 反映待ち
- 出典 +11件（計17件）、化合物 +8件（計17件）、香味ノート +1件（生姜）
- お茶 +5件：煎茶・抹茶・玉露・ほうじ茶（Tan 2019）、鳳凰単叢（Kun 2025＋Li & Wang 2020、余韻にカップアロマ）
- ミルクチョコ：情報不足→一般レベル（Schnermann 1997＋Samfaß 2021）
- ホワイトチョコ：情報不足→一般レベル（モデル系注記つき、Stewart 2017/2018）
- 出典ページに「香味の時間変化について」セクション追加（Jager 2014／石川ら 2019／Qiu 2025／Khemacheevakul 2021）
- テスト 21件全合格（画面テストに cleanup 追加、ミルク/ホワイト/煎茶/単叢の表示テスト追加）
- 変更ファイル: src/data/{sources,teas,chocolates,compounds,flavors}.ts, src/App.tsx, src/App.test.tsx, src/engine/pairing.test.ts, README.md, docs/PENDING_PUSH.md ＋ dist 再配置

## 2026-10-30 監査対応（反映待ち：ローカルgit/ビルドが環境の書き込み制限で断続的にEPERM）
- A-1修正: δ-デカラクトンの寄与根拠から δ-テトラデカラクトン（別化合物）の知見を分離、creamノート紐づけ解除
- B-1: ほうじ茶 wood を normal→strong（原著で焙煎様・木様は並記で「高い」。換算の非対称を解消）
- B-2: 鳳凰単叢の aromas からカップアロマ側属性（蜂蜜・生姜）を分離（茶液側=花様・トロピカルのみ。カップアロマは余韻の記述に一本化）
- B-3: indole の chestnut 紐づけを解除し、Kumazawa 1999（動物様）との緊張関係を aromaKnowledge に開示
- B-4: 石川ら2019のURLを実在確認済みの J-STAGE 記事URL（jjsse/23/1/23_230106）に差し替え
- B-5: sources.ts 冒頭コメントを17件に更新
- 品質監査対応: storage の例外処理・重複除去・履歴上限50、import の読み取り失敗処理、未知ハッシュ→ホーム、組み合わせ初期選択をID指定に変更、ホイールSVGの role を group に変更、storageテスト+2件
- 監査報告書: docs/audit/2026-10-30-expansion-data-audit.md, docs/audit/2026-10-30-app-quality-audit.md
- 注意: 監査サブエージェントの書き込みプローブで src/storage.ts が一時0バイト化 → GitHub上の内容から復旧＋上記改善を適用済み
- テスト再実行と本番ビルドは環境制限（JS書き込みEPERM）が解け次第実施し、未実施の間は「合格」と報告しない
- 追加要望対応（2026-10-30 07:49）: タブ切り替え（組み合わせページの お茶/チョコ/組み合わせの見方）とページ遷移で先頭へスクロール（scrollTop、prefers-reduced-motion 配慮）。src/App.tsx のみ変更、main へ push 済み。gh-pages 反映はリトライジョブのビルドに含める
