import { ArrowLeft } from 'lucide-react'

/* The breadcrumb used across the Employee / Manager pages
   (matches KPIReviewDetailsPage, the asset detail pages, etc.) —
   30px boxed back-arrow, "/" separators, 13px crumbs. */

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7' }

interface Props {
  /** The clickable parent crumb, e.g. "Dashboard". */
  backLabel: string
  /** The current page — bold, not clickable. */
  current: string
  onBack: () => void
}

export default function SpotlightBreadcrumb({ backLabel, current, onBack }: Props) {
  return (
    <div className="flex items-center gap-2" style={{ marginBottom: 22 }}>
      <button
        onClick={onBack}
        title="Back"
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#fff';    e.currentTarget.style.borderColor = C.border }}
      >
        <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
      </button>

      <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>

      <button
        onClick={onBack}
        style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
        onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
        onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
      >
        {backLabel}
      </button>

      <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>

      <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{current}</span>
    </div>
  )
}
