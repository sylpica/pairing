# 公開手順（GitHub Pages）

このリポジトリは2つの公開方法に対応する。

## 方法A: gh-pages ブランチ（現在の公開方式）
- `npm run build` の成果物（dist/ の内容）を `gh-pages` ブランチのルートに配置する。
- GitHub の Settings → Pages → Build and deployment → Source で「Deploy from a branch」、Branch に `gh-pages` / `(root)` を選ぶ（リポジトリ管理者による1回だけの設定）。
- 公開URL: https://sylpica.github.io/pairing/（2026-10-30 アカウント名変更 minkohno-hub → sylpica に伴い移転。旧URLはリダイレクトされない）
- アプリは相対 base（`./`）とハッシュルーティングを使うため、サブパスでも直接アクセスでも壊れない。

## 方法B: GitHub Actions（将来）
- `.github/workflows/` への書き込み権限が Muse GitHub App にないため、ワークフローは手動で追加する。
- 追加する場合は、push 時に `npm ci && npm test && npm run build` を実行し、dist/ を Pages へデプロイする標準構成にする。
