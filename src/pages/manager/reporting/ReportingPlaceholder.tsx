import type { ElementType } from 'react'

const C = {
  navy:   '#1C2035',
  muted:  '#8B90A7',
  border: '#E4E6EF',
  panel:  '#FFFFFF',
  indigo: '#6366F1',
}

/**
 * Basic structure placeholder for the Manager "Project Reporting" pages.
 * Shows only the page title + purpose subtext for now.
 * Detailed page content will be designed in the next phase.
 */
export default function ReportingPlaceholder({
  title,
  description,
  Icon,
}: {
  title: string
  description: string
  Icon: ElementType
}) {
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Page heading */}
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: C.navy }}>{title}</h1>
        <p className="text-sm mt-0.5" style={{ color: C.muted }}>{description}</p>
      </div>

      {/* Empty-state panel */}
      <div
        className="rounded-2xl flex items-center justify-center"
        style={{ background: C.panel, border: `1px solid ${C.border}`, minHeight: 340 }}
      >
        <div className="text-center px-6">
          <div
            className="rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ width: 56, height: 56, background: 'rgba(99,102,241,0.10)' }}
          >
            <Icon size={26} strokeWidth={1.7} style={{ color: C.indigo }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: C.navy }}>{title}</p>
          <p className="text-xs mt-1.5" style={{ color: C.muted }}>
            This page will be designed in the next phase.
          </p>
        </div>
      </div>
    </div>
  )
}
