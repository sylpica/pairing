// 画面を親しみやすくするためのオリジナルSVGアイコン（外部画像は使わない）。
// すべて線画（stroke=currentColor）で描き、色はCSS側の color で制御する。
interface IconProps { className?: string }

export function TeaLeafIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M38 8C24 10 12 20 10 38c18-2 28-14 30-28-1-1-1-2-2-2z" />
      <path d="M12 36C18 26 26 18 36 12" />
    </svg>
  )
}

export function TeaCupIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 20h26v7a11 11 0 0 1-11 11h-4A11 11 0 0 1 8 27z" />
      <path d="M34 23h2a5.5 5.5 0 0 1 0 11h-3" />
      <path d="M15 14c0-3 3-3 3-6M24 14c0-3 3-3 3-6" />
      <path d="M10 44h24" />
    </svg>
  )
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 44S10 30.5 10 19a14 14 0 0 1 28 0c0 11.5-14 25-14 25z" />
      <circle cx="24" cy="19" r="5" />
    </svg>
  )
}

export function SproutIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 44V28" />
      <path d="M24 28c0-8-6-13-15-13 0 9 6 13 15 13z" />
      <path d="M24 24c0-8 6-13 15-13 0 9-6 13-15 13z" />
    </svg>
  )
}

export function CacaoPodIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 6c3 2 4 5 4 8 5 3 8 8 8 14 0 8-5 13-12 14C17 41 12 36 12 28c0-6 3-11 8-14 0-3 1-6 4-8z" />
      <path d="M20 18c-1 6-1 12 0 18M28 18c1 6 1 12 0 18" />
    </svg>
  )
}

export function ChocoBarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="6" width="28" height="36" rx="5" />
      <path d="M10 18h28M10 30h28M24 6v36" />
    </svg>
  )
}

export function LineageIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="9" r="4" />
      <circle cx="11" cy="39" r="4" />
      <circle cx="37" cy="39" r="4" />
      <path d="M24 13v7M24 20l-11 13M24 20l11 13" />
      <circle cx="24" cy="24" r="3.5" />
    </svg>
  )
}

export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 6l5.3 11.6L42 19.2l-9.4 8.6 2.5 12.5L24 34l-11.1 6.3 2.5-12.5L6 19.2l12.7-1.6z" />
    </svg>
  )
}

export function HistoryIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 24a14 14 0 1 1 4.1 9.9" />
      <path d="M10 38v-9h9" />
      <path d="M24 16v8l6 4" />
    </svg>
  )
}
