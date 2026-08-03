/* ─────────────────────────────────────────────────────────────────────────────
 * Admin: Probation Cases (list) — MONITOR ONLY
 *
 * The Admin's org-wide view of every employee on probation. The reporting manager
 * makes the final decision; the Admin only monitors status and can open any case
 * to view its full details (read-only). No Confirm / Extend / Terminate actions.
 * ──────────────────────────────────────────────────────────────────────────── */

import { useState, useMemo } from 'react'
import { Search, ChevronDown, Eye } from 'lucide-react'
import {
  PC, StatusPill, Avatar, fmtDate, daysUntil, SELF_ASSESSMENT_WINDOW_DAYS,
  MOCK_ALL_CASES, type ProbationStatus, type ProbationCase,
} from '../../employee/probation/probationShared'

const font = "'DM Sans', system-ui, sans-serif"

// Status filter options (label → matcher). "All" shows everything.
const FILTERS: { id: string; label: string; match: (s: ProbationStatus) => boolean }[] = [
  { id: 'all',      label: 'All Statuses',       match: () => true },
  { id: 'manager',  label: 'With Manager',       match: s => s === 'Pending Manager Review' },
  { id: 'ongoing',  label: 'Ongoing',            match: s => s === 'Ongoing' || s === 'Ongoing (Extended)' },
  { id: 'done',     label: 'Completed',          match: s => s === 'Confirmed' || s === 'Terminated' },
]

// Grid column template shared by header + rows — even, balanced widths.
// Employee · Designation · Reporting Manager · Duration · End Date · Time Left · Status · Action
const COLS = '1.4fr 1.1fr 1.1fr 0.8fr 1fr 0.9fr 1.4fr 0.9fr'

// Days-left as a plain number ("9 days"), tinted when near the end. No extra words.
function DaysLeft({ endDate }: { endDate: string }) {
  const days = daysUntil(endDate)
  const near = days >= 0 && days <= SELF_ASSESSMENT_WINDOW_DAYS
  const color = days < 0 ? PC.red : near ? PC.amber : PC.label
  return <span style={{ fontSize: 13, fontWeight: 700, color }}>{days} days</span>
}

function HeaderCell({ children, alignEnd }: { children: React.ReactNode; alignEnd?: boolean }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: PC.muted, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: alignEnd ? 'right' : 'left' }}>
      {children}
    </div>
  )
}

export default function AdminProbationPage({ onOpenCase }: { onOpenCase?: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchFocus, setSearchFocus] = useState(false)

  const activeFilter = FILTERS.find(f => f.id === filter)!

  // Filter + search.
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MOCK_ALL_CASES
      .filter(c => activeFilter.match(c.status))
      .filter(c => !q
        || c.name.toLowerCase().includes(q)
        || c.empId.toLowerCase().includes(q)
        || c.designation.toLowerCase().includes(q)
        || c.reportingManager.toLowerCase().includes(q))
  }, [query, activeFilter])

  return (
    <div style={{ fontFamily: font, display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: PC.navy, letterSpacing: '-0.4px' }}>Probation Cases</h1>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            Monitor every employee on probation across the organisation. Open any case to view its full details.
          </p>
        </div>
      </div>

      {/* Toolbar: white card (14px padding) with search + filter as separate sections */}
      <div style={{
        background: '#fff', border: `1px solid ${PC.border}`, borderRadius: 12, padding: 14,
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        {/* Search — its own bordered field */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: PC.muted, pointerEvents: 'none' }} />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)}
            placeholder="Search by name, employee ID, role, or manager…"
            style={{
              width: '100%', boxSizing: 'border-box', height: 40, padding: '0 14px 0 38px', borderRadius: 10,
              fontFamily: font, fontSize: 13.5, fontWeight: 500, color: PC.navy, outline: 'none',
              border: `1px solid ${searchFocus ? PC.indigo : PC.border}`, background: '#fff',
              boxShadow: searchFocus ? '0 0 0 3px rgba(99,102,241,0.10)' : 'none', transition: 'all 0.15s',
            }}
          />
        </div>
        {/* Filter — its own bordered field */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <select
            value={filter} onChange={e => setFilter(e.target.value)}
            style={{
              height: 40, padding: '0 34px 0 14px', borderRadius: 10, minWidth: 180,
              fontFamily: font, fontSize: 13.5, fontWeight: 600, color: PC.navy, cursor: 'pointer',
              border: `1px solid ${PC.border}`, background: '#fff', appearance: 'none', outline: 'none',
            }}
          >
            {FILTERS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
          </select>
          <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: PC.muted, pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: `1px solid ${PC.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 980 }}>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 14, alignItems: 'center', padding: '13px 22px', borderBottom: `1px solid ${PC.border}`, background: PC.surface }}>
              <HeaderCell>Employee</HeaderCell>
              <HeaderCell>Designation</HeaderCell>
              <HeaderCell>Reporting Manager</HeaderCell>
              <HeaderCell>Duration</HeaderCell>
              <HeaderCell>End Date</HeaderCell>
              <HeaderCell>Time Left</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell alignEnd>Action</HeaderCell>
            </div>

            {/* Data rows */}
            {rows.length === 0 ? (
              <div style={{ padding: '48px 22px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: PC.navy }}>No matching cases</p>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, color: PC.muted }}>Try a different search or filter.</p>
              </div>
            ) : rows.map((c: ProbationCase, i) => {
              const done = c.status === 'Confirmed' || c.status === 'Terminated'
              return (
                <div
                  key={c.id}
                  onClick={() => onOpenCase?.(c.id)}
                  style={{
                    display: 'grid', gridTemplateColumns: COLS, gap: 14, alignItems: 'center',
                    padding: '15px 22px', cursor: 'pointer',
                    borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${PC.border}`,
                    background: '#fff', transition: 'background 0.14s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = PC.surface }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                >
                  {/* Employee */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                    <Avatar url={c.avatarUrl} initials={c.avatarInitials} size={38} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: PC.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11.5, color: PC.muted, fontWeight: 500 }}>{c.empId}</p>
                    </div>
                  </div>

                  {/* Designation */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: PC.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.designation}</p>
                  </div>

                  {/* Reporting Manager */}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: PC.label, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.reportingManager}</p>
                  </div>

                  {/* Duration */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: PC.label }}>{c.durationMonths} mo</div>

                  {/* End date */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: PC.label }}>{fmtDate(c.endDate)}</div>

                  {/* Time left — days only */}
                  <div>
                    {done
                      ? <span style={{ fontSize: 13, color: PC.muted, fontWeight: 600 }}>—</span>
                      : <DaysLeft endDate={c.endDate} />}
                  </div>

                  {/* Status */}
                  <div><StatusPill status={c.status} size="sm" /></div>

                  {/* Action */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={e => { e.stopPropagation(); onOpenCase?.(c.id) }}
                      title="View details"
                      style={{ height: 34, padding: '0 14px', borderRadius: 9, cursor: 'pointer', fontFamily: font, fontSize: 12.5, fontWeight: 600, color: PC.label, background: '#fff', border: `1px solid ${PC.border}`, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                      onMouseEnter={e => { e.currentTarget.style.background = PC.surface }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                    >
                      <Eye size={14} /> View
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
