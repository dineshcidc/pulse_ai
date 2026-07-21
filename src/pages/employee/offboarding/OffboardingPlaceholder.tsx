import type { ElementType } from 'react'

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
}

interface Props {
  title: string
  subtitle: string
  Icon: ElementType
}

/**
 * Temporary placeholder for a single Offboarding tab panel.
 * Shows the section Title + subtext only — each tab will be designed step by step.
 */
export default function OffboardingPlaceholder({ title, subtitle, Icon }: Props) {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* ── Section header ── */}
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0 }}>{title}</h2>
        <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, margin: '3px 0 0' }}>{subtitle}</p>
      </div>

      {/* ── Placeholder body ── */}
      <div
        className="rounded-2xl flex items-center justify-center"
        style={{ background: '#fff', border: `1px solid ${C.border}`, minHeight: 300 }}
      >
        <div className="text-center" style={{ maxWidth: 360, padding: '0 24px' }}>
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: C.bg }}
          >
            <Icon size={22} strokeWidth={1.6} style={{ color: C.muted }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: C.navy }}>{title}</p>
          <p className="text-xs mt-1" style={{ color: C.muted, lineHeight: 1.6 }}>
            This section will be designed in the next step.
          </p>
        </div>
      </div>
    </div>
  )
}
