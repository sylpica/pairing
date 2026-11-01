// ホイール内テキストのフィッティング共通処理（TieredWheel 用）。
// 旧 FlavorWheel.tsx の INT_LABEL は COMBO_INT_LABEL と同一内容だったため、
// 第23弾で NoteDetail／TasteDetail の参照を COMBO_INT_LABEL へ一本化し、
// 旧コンポーネントは参照ゼロとなって削除した。
//
// 方針（ユーザー指示・第6弾）: 全てのセグメントに必ずラベル（ノート名）を出す。
// 入らない場合はフォントサイズを段階的に縮小し（下限 7px）、それでも無理なら
// 行数を増やし、省略（…）はしない。
//
// 第43弾（ユーザー実機FB）: 改行の作法を「単位」ベースに改めた。
// - 化学物質名と併記フレーズ（「成分データなし」等）は1つの単位として扱い、
//   途中で絶対に割らない。改行は単位と単位の間でのみ入れる（1単位＝1行が基本形）。
// - セグメント名（具体名ラベル等）は、意味の切れ目（・の後／、の後／）の後／
//   空白／（の前）でのみ割ってよい。単語の途中では割らない。
// - 1単位が最小フォントでも許容幅に収まらない場合は、割らずにそのまま返し、
//   TieredWheel 側がラベル行の x 位置を円盤中心側へ寄せて収める（配置の工夫）。
//   そのため、この層の関数は「幅以下」を保証しないことがある（保証するのは
//   全文・無省略・単位の完全性）。最終的な円盤内収納は TieredWheel が担保する。

/** 香味・味の強さの表示ラベル（第22弾で旧 ComboWheel.tsx から移設。旧コンポーネントは
 * 第8弾の3階層化以降、本番では描画されておらず、参照が自テストのみだったため削除した） */
export const COMBO_INT_LABEL: Record<string, string> = { strong: '強い', normal: '普通', weak: '弱い', unknown: '不明' }

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

export interface FittedLine {
  text: string
  fs: number
  /** 併記行を構成する単位（化学物質名など）。改行はこの単位の間でのみ許される */
  units?: string[]
}

// 収まるサイズとして使うため、丸めは必ず切り捨て（切り上げると幅が avail を超える）
const roundFs = (fs: number) => Math.floor(fs * 100) / 100

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

/** 1行に必ず収める：フォント縮小（下限 minFs）→ 最終手段で末尾省略。
 * 現在の利用は「38%」のような短い％行のみ（単位の改行とは無関係）。 */
export function fitOneLine(text: string, avail: number, baseFs: number, minFs: number = WHEEL_MIN_FONT): FittedLine {
  const em = emWidthOf(text)
  if (em <= 0) return { text, fs: baseFs }
  const fsFit = avail / em
  if (fsFit >= minFs) return { text, fs: Math.min(baseFs, roundFs(fsFit)) }
  return { text: truncateHead(text, avail, minFs), fs: minFs }
}

/**
 * 意味の切れ目として改行してよい位置（先頭から数えた文字数＝その位置の直後で割る）。
 * ・の後／、の後／）の後／空白の後／（の前。
 */
export function boundaryCutsOf(text: string): number[] {
  const chars = [...text]
  const cuts: number[] = []
  for (let i = 1; i < chars.length; i++) {
    const before = chars[i - 1]
    const after = chars[i]
    if (before === '・' || before === '、' || before === '）' || before === ' ' || after === '（') cuts.push(i)
  }
  return cuts
}

/** cuts から k-1 個を選んで text を k 部分に割り、各部分の em 幅の最大値が最小になる分割を返す */
function splitAtBoundaries(text: string, cuts: number[], k: number): string[] | null {
  if (cuts.length < k - 1) return null
  const chars = [...text]
  // 組合せ爆発の防止: カット候補が多すぎる場合は等間隔に間引く
  let pool = cuts
  if (pool.length > 12) {
    const step = pool.length / 12
    pool = Array.from({ length: 12 }, (_, i) => cuts[Math.floor(i * step)])
  }
  const search = (start: number, chosen: number[]): { parts: string[]; max: number } | null => {
    if (chosen.length === k - 1) {
      const bounds = [0, ...chosen, chars.length]
      const parts = bounds.slice(0, -1).map((b, i) => chars.slice(b, bounds[i + 1]).join(''))
      return { parts, max: Math.max(...parts.map(emWidthOf)) }
    }
    let local: { parts: string[]; max: number } | null = null
    for (let i = start; i < pool.length; i++) {
      const r = search(i + 1, [...chosen, pool[i]])
      if (r && (!local || r.max < local.max)) local = r
    }
    return local
  }
  const found = search(0, [])
  return found ? found.parts : null
}

export type LabelFitMode = 'boundary' | 'atomic'

/**
 * ラベル行のフィッティング（第43弾で単位ベースに改訂）。
 * - まず1行で収める（フォント段階縮小、下限 minFs）。
 * - 'atomic'（化学物質名など）: 絶対に割らない。最小フォントでも収まらなければ
 *   最小フォントの1行のまま返す（配置側の x 寄せで収める）。
 * - 'boundary'（具体名などのラベル）: 意味の切れ目でのみ 2〜4 行に割る。
 *   切れ目だけで収まらなければ割らずに最小フォントの1行で返す。
 * どちらのモードでも省略（…）はしない。
 */
export function fitLabelLines(text: string, avail: number, baseFs: number = WHEEL_LABEL_FONT, minFs: number = WHEEL_MIN_FONT, mode: LabelFitMode = 'boundary'): FittedLine[] {
  const em = emWidthOf(text)
  if (em <= 0) return [{ text, fs: baseFs }]
  if (em * minFs <= avail) return [{ text, fs: Math.min(baseFs, roundFs(avail / em)) }]
  if (mode === 'atomic') return [{ text, fs: minFs }]
  const cuts = boundaryCutsOf(text)
  for (const k of [2, 3, 4]) {
    const parts = splitAtBoundaries(text, cuts, k)
    if (parts && Math.max(...parts.map(emWidthOf)) * minFs <= avail) {
      return parts.map((t) => ({ text: t, fs: Math.min(baseFs, roundFs(avail / emWidthOf(t))) }))
    }
  }
  return [{ text, fs: minFs }]
}

/**
 * 化学物質名などのサブラベル行（第43弾で単位ベースに改訂）。
 * 各 name は不可分の単位として扱い、改行は単位の間（「・」でつないだ行の切れ目）
 * でのみ入れる。フォントを baseFs から minFs まで段階的に下げて、
 * 最大 maxLines 行に詰める。入り切らない単位は落とし、末尾に「 ほか」を付けて
 * 省略の存在を示す（単位自体を「…」や途中分割で隠すことはしない）。
 * 単位が単独でも最小フォントで avail を超える場合は、その単位だけの行として
 * そのまま返す（配置側の x 寄せで収める）。
 */
export function packScaledLines(names: string[], avail: number, maxLines: number, baseFs: number = WHEEL_SUB_FONT, minFs: number = WHEEL_MIN_FONT): FittedLine[] {
  if (names.length === 0) return []
  const packAt = (fs: number): { lines: FittedLine[]; shown: number } => {
    const groups: string[][] = []
    let i = 0
    while (i < names.length && groups.length < maxLines) {
      const g = [names[i]]; i++
      while (i < names.length && textWidthAt([...g, names[i]].join('・'), fs) <= avail) { g.push(names[i]); i++ }
      groups.push(g)
    }
    return { lines: groups.map((units) => ({ text: units.join('・'), fs, units })), shown: i }
  }
  const overflowCount = (lines: FittedLine[]) => lines.filter((l) => textWidthAt(l.text, l.fs) > avail).length
  // 選定: (1) 幅超過の行が無い (2) 表示できる単位が多い (3) フォントが大きい
  // (4) 行数が少ない、の順で優先する。
  let best: { lines: FittedLine[]; shown: number; fs: number } | null = null
  for (let fs = baseFs; fs >= minFs; fs -= 0.5) {
    const { lines, shown } = packAt(fs)
    if (lines.length === 0 || overflowCount(lines) > 0) continue
    if (!best || shown > best.shown || (shown === best.shown && lines.length < best.lines.length)) {
      best = { lines, shown, fs }
    }
  }
  if (!best) {
    // どのフォントでも単独で幅を超える単位がある詰め込みしかできない場合:
    // 最小フォントで詰め、超過行はそのまま返す（TieredWheel が x 寄せで収める）
    const { lines, shown } = packAt(minFs)
    best = { lines, shown, fs: minFs }
  }
  const out = best.lines.map((l) => ({ ...l }))
  if (best.shown < names.length && out.length > 0) {
    // 落とした単位がある場合は末尾に「 ほか」を付ける（従来の作法）。
    // 付けて幅を超える場合は、最終行の末尾の単位を1つ落として付け直す
    // （単位の途中は割らない）。text だけが変わり、units は実単位のまま。
    const last = out[out.length - 1]
    const withHoka = (units: string[]) => `${units.join('・')} ほか`
    let units = [...(last.units ?? [last.text])]
    if (textWidthAt(withHoka(units), last.fs) > avail && units.length > 1) units = units.slice(0, -1)
    if (textWidthAt(withHoka(units), last.fs) <= avail) {
      out[out.length - 1] = { text: withHoka(units), fs: last.fs, units }
    } else if (out.length < maxLines) {
      out.push({ text: 'ほか', fs: minFs, units: [] })
    }
    // それでも付かない場合は付けない（ドリル先の第3階層で全単位が見える）
  }
  return out
}
