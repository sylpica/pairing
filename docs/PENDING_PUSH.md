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
