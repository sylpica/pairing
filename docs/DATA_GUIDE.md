# データ追加・更新手順

1. 論文を一次ソース（出版社ページ・PubMed・PMC等）で確認し、`docs/research/` に検証メモを残す。DOI・書誌が確認できないものは追加しない。
2. `src/data/sources.ts` に出典を追加する（verified は実在確認が済んだものだけ true）。
3. 香味プロファイルは `src/data/teas.ts` / `chocolates.ts` に追加する。各エントリに basis（measured/sensory/review/general）と sourceIds を必ず付ける。根拠のない香味は追加せず「不明」のままにする。
4. 化合物は `src/data/compounds.ts` に、検出事実／香りの知見／寄与の根拠を分けて記録する。
5. `npm test` でデータ整合性テスト（参照の実在・DOI形式・捏造チェック）が通ることを確認する。
6. 品種×茶類の組み合わせは、実測例がある場合だけ TeaItem を作る。一般的特徴で代用する場合は scopeNote にその旨を明記する。
