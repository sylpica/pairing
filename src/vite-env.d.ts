/// <reference types="vite/client" />

// テスト（vitest は Node 上で動く）から CSS ファイル等を読むための最小宣言。
// アプリ本体のバンドルには含まれない（テストファイルだけが使う）。
declare module 'node:fs' {
  export function readFileSync(path: string, encoding: 'utf-8'): string
  export function writeFileSync(path: string, data: string): void
}
