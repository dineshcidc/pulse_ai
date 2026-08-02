/* ─────────────────────────────────────────────────────────────────────────────
 * Admin: Probation Settings (org-level policy)
 *
 * Configures how many days before the probation end date the employee's
 * self-assessment form unlocks — replacing the previously hardcoded 15.
 *
 * Prototype: the value lives in local state seeded from the current default.
 * ──────────────────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import { CalendarClock, Info } from 'lucide-react'
import { PC, SectionCard, SELF_ASSESSMENT_WINDOW_DAYS } from '../../employee/probation/probationShared'

const font = "'DM Sans', system-ui, sans-serif"

export default function ProbationSettingsPage() {
  const [windowDays, setWindowDays] = useState<number>(SELF_ASSESSMENT_WINDOW_DAYS)

  function setWindow(v: number) {
    setWindowDays(Math.max(1, Math.min(90, Math.round(v || 0))))
  }

  return (
    <div style={{ fontFamily: font, display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Title */}
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: PC.navy, letterSpacing: '-0.4px' }}>Probation Settings</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
          Org-wide policy for when the probation self-assessment opens.
        </p>
      </div>

      {/* Unlock window */}
      <SectionCard icon={<CalendarClock size={17} color={PC.indigo} />} title="Unlock Timing" subtitle="How early the form opens before each employee’s probation end date.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: PC.label }}>Unlock the self-assessment</span>
          <div style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${PC.border}`, borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
            <button onClick={() => setWindow(windowDays - 1)} style={{ width: 38, height: 40, border: 'none', background: PC.surface, cursor: 'pointer', fontSize: 18, fontWeight: 700, color: PC.label }}>−</button>
            <input
              type="number" value={windowDays} min={1} max={90}
              onChange={e => setWindow(Number(e.target.value))}
              style={{ width: 58, height: 40, border: 'none', borderLeft: `1px solid ${PC.border}`, borderRight: `1px solid ${PC.border}`, textAlign: 'center', fontFamily: font, fontSize: 15, fontWeight: 800, color: PC.navy, outline: 'none' }}
            />
            <button onClick={() => setWindow(windowDays + 1)} style={{ width: 38, height: 40, border: 'none', background: PC.surface, cursor: 'pointer', fontSize: 18, fontWeight: 700, color: PC.label }}>+</button>
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: PC.label }}>days before the end date.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, padding: '11px 14px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 10 }}>
          <Info size={15} color={PC.indigo} />
          <p style={{ margin: 0, fontSize: 12.5, color: PC.label, fontWeight: 500 }}>
            For a probation ending <strong style={{ color: PC.navy }}>10 Aug 2026</strong>, the form would open around <strong style={{ color: PC.navy }}>{fmtOffset(windowDays)}</strong>.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}

// Rough preview date = 10 Aug 2026 minus N days, formatted.
function fmtOffset(days: number): string {
  const base = new Date('2026-08-10T00:00:00')
  base.setDate(base.getDate() - days)
  return base.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
