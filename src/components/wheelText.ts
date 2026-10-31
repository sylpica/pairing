// ホイール内テキストのフィッティング共通処理（ComboWheel / FlavorWheel 共用）。
//
// 方針（ユーザー指示・第6弾）: 全てのセグメントに必ずラベル（ノート名）を出す。
// 入らない場合はフォントサイズを段階的に縮小し（下限 7px）、それでも無理なら
// 2行に割り、省略（…）は最終手段とする（省略する場合も先頭は必ず残す）。
// 化合物名のサブラベルも同じ作法で、少なくとも先頭1件を乗せるよう努める。

export const WHEEL_LABEL_FONT = 12
export const WHEEL_SUB_FONT = 10
export const WHEEL_MIN_FONT = 7

/** 文字列の概算 em 幅（全角=1、半角=0.55、空白=0.3。従来の textWidth と同じ概算） */
export function emWidthOf(s: string): number {
  let em = 0
  for (const ch of s) em += ch === ' ' ? 0.3 : (ch.codePointAt(0) ?? 0) < 128 ? 0.55 : 1
  return em
}
export const textWidthAt = (s: string, fs: number): number => emWidthOf(s) * fs

export interface FittedLine { text: string; fs: number }

const roundFs = (fs: number) => Math.round(fs * 100) / 100

/** 末尾を「…」で省略する。先頭は必ず残す（最低でも先頭1文字＋…） */
function truncateHead(text: string, avail: number, fs: number): string {
  const budget = avail / fs
  const ell = emWidthOf('…')
  let out = ''
  let used = 0
  for (const ch of text) {
    const w = emWidthOf(ch)
    if (used + w + ell > budget) break
    out += ch; used += w
  }
  if (!out) return `${[...text][0] ?? ''}…`
  return `${out}…`
}

/** 指定フォントで収まればその文字列、短くなりすぎる場合は null（従来の fitLine の作法） */
function fitLineOrNull(text: string, avail: number, fs: number): string | null {
  if (textWidthAt(text, fs) <= avail) return text
  let out = ''
  for (const ch of text) {
    if (textWidthAt(`${out}${ch}…`, fs) > avail) break
    out += ch
  }
  return out.length >= 3 ? `${out}…` : null
}

/** 1行に必ず収める：フォント縮小（下限 minFs）→ 最終手段で末尾省略 */
export function fitOneLine(text: string, avail: number, baseFs: number, minFs: number = WHEEL_MIN_FONT): FittedLine {
  const em = emWidthOf(text)
  if (em <= 0) return { text, fs: baseFs }
  const fsFit = avail / em
  if (fsFit >= minFs) return { text, fs: Math.min(baseFs, roundFs(fsFit)) }
  return { text: truncateHead(text, avail, minFs), fs: minFs }
}

/**
 * ラベル行：まず1行で収める。最小フォントでも1行に収まらない場合は2行に割る
 * （「・」の直後での分割を優先しつつ、2行の幅が均等になる位置を選ぶ）。
 * 2行でも収まらない場合のみ、1行＋末尾省略に落とす。
 */
export function fitLabelLines(text: string, avail: number, baseFs: number = WHEEL_LABEL_FONT, minFs: number = WHEEL_MIN_FONT): FittedLine[] {
  const em = emWidthOf(text)
  if (em <= 0) return [{ text, fs: baseFs }]
  if (em * minFs <= avail) return [{ text, fs: Math.min(baseFs, roundFs(avail / em)) }]
  const chars = [...text]
  let best: { i: number; score: number; max: number } | null = null
  for (let i = 1; i < chars.length; i++) {
    const max = Math.max(emWidthOf(chars.slice(0, i).join('')), emWidthOf(chars.slice(i).join('')))
    const score = max - (chars[i - 1] === '・' ? 0.01 : 0)
    if (!best || score < best.score) best = { i, score, max }
  }
  if (best && best.max * minFs <= avail) {
    return [chars.slice(0, best.i).join(''), chars.slice(best.i).join('')]
      .map((t) => ({ text: t, fs: Math.min(baseFs, roundFs(avail / emWidthOf(t))) }))
  }
  return [fitOneLine(text, avail, baseFs, minFs)]
}

/** names を「・」区切りで最大 maxLines 行に詰める（指定フォントでの従来の作法） */
function packAt(names: string[], avail: number, maxLines: number, fs: number): string[] {
  const groups: string[][] = []
  let i = 0
  while (i < names.length && groups.length < maxLines) {
    const g = [names[i]]; i++
    while (i < names.length && textWidthAt([...g, names[i]].join('・'), fs) <= avail) { g.push(names[i]); i++ }
    groups.push(g)
  }
  const hasMore = i < names.length
  return groups.map((g, gi) => {
    const isLast = gi === groups.length - 1
    let gg = g
    let s = gg.join('・') + (isLast && hasMore ? ' ほか' : '')
    while (gg.length > 1 && textWidthAt(s, fs) > avail) { gg = gg.slice(0, -1); s = gg.join('・') + (isLast && hasMore ? ' ほか' : '') }
    return fitLineOrNull(s, avail, fs)
  }).filter((l): l is string => l !== null)
}

/**
 * 化合物名などのサブラベル行：フォントを baseFs から minFs まで段階的に下げて詰め、
 * どうしても入らない場合は先頭1件を最小フォントで（必要なら省略して）必ず1行出す。
 */
export function packScaledLines(names: string[], avail: number, maxLines: number, baseFs: number = WHEEL_SUB_FONT, minFs: number = WHEEL_MIN_FONT): FittedLine[] {
  if (names.length === 0) return []
  // 各フォントサイズで詰めてみて、表示できる文字数が最も多いものを選ぶ
  // （大きいフォントで大きく省略するより、小さいフォントで多く見せる方を優先する。
  //   同点なら大きいフォントを残す）
  let best: { lines: string[]; fs: number; score: number } | null = null
  for (let fs = baseFs; fs >= minFs; fs -= 0.5) {
    const lines = packAt(names, avail, maxLines, fs)
    if (lines.length === 0) continue
    const score = lines.reduce((a, t) => a + [...t.replace(/…| ほか/g, '')].length, 0)
    if (!best || score > best.score) best = { lines, fs, score }
  }
  if (best) return best.lines.map((t) => ({ text: t, fs: best!.fs }))
  return [fitOneLine(names[0], avail, baseFs, minFs)]
}
