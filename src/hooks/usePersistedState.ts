import { useState } from 'react'

/**
 * localStorage に保存し、画面遷移して戻っても復元される state フック
 * （ユーザーフィードバック 2026-10-31「画面を戻っても選んだプルダウンは保存されること」）。
 * 読める DOM コンポーネント（App.tsx / ComboPages.tsx 共通部品ではない画面）に
 * 適用する。破損した保存値は無視して初期値で開始する。
 */
export function usePersistedState<T>(key: string, initial: T | (() => T)): [T, (next: T) => void] {
  const [value, setValue] = useState<T>(() => readPersisted(key, typeof initial === 'function' ? (initial as () => T)() : initial))
  const set = (next: T) => {
    setValue(next)
    savePersisted(key, next)
  }
  return [value, set]
}

export function readPersisted<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw != null ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function savePersisted(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // 保存できなくても表示は続ける
  }
}
