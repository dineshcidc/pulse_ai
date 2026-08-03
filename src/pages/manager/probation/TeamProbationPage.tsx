/* ─────────────────────────────────────────────────────────────────────────────
 * Stage 3 — Manager: Team Probation (list)
 *
 * The reporting manager's queue of team members on probation. Read-only until it's
 * the manager's turn: rows with status "Pending Manager Review" are the ones that
 * need action and are surfaced first. Opening a row → the assessment detail (next).
 * ──────────────────────────────────────────────────────────────────────────── */

import { useState, useMemo } from 'react'
import { Search, ChevronDown, ClipboardCheck, Eye } from 'lucide-react'
import {
  PC, StatusPill, Avatar, fmtDate, daysUntil, SELF_ASSESSMENT_WINDOW_DAYS,
  MOCK_TEAM_CASES, type ProbationStatus, type ProbationCase,
} from '../../employee/probation/probationShared'

const font = "'DM Sans', system-ui, sans-serif"

// Status filter options (label → matcher). "All" shows everything.
const FILTERS: { id: string; label: string; match: (s: ProbationStatus) => boolean }[] = [
  { id: 'all',      label: 'All Statuses',           match: () => true },
  { id: 'review',   label: 'Awaiting My Review',     match: s => s === 'Pending Manager Review' },
  { id: 'ongoing',  label: 'Ongoing',                match: s => s === 'Ongoing' || s === 'Ongoing (Extended)' },
  { id: 'done',     label: 'Completed',              match: s => s === 'Confirmed' || s === 'Terminated' },
]

// Manager only acts while the case is "Pending Manager Review".
const needsReview = (s: ProbationStatus) => s === 'Pending Manager Review'
const awaitingEmployee = (s: ProbationStatus) => s === 'Ongoing' || s === 'Ongoing (Extended)'

// Grid column template shared by header + rows — even, balanced widths.
const COLS = '1.4fr 1.2fr 1fr 1.1fr 1fr 1.4fr 1fr'

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

export default function TeamProbationPage({ onOpenCase }: { onOpenCase?: (id: string) => void }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [searchFocus, setSearchFocus] = useState(false)

  const activeFilter = FILTERS.find(f => f.id === filter)!

  // Filter + search, then float "needs my review" to the top.
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MOCK_TEAM_CASES
      .filter(c => activeFilter.match(c.status))
      .filter(c => !q || c.name.toLowerCase().includes(q) || c.empId.toLowerCase().includes(q) || c.designation.toLowerCase().includes(q))
      .sort((a, b) => Number(needsReview(b.status)) - Number(needsReview(a.status)))
  }, [query, activeFilter])

  return (
    <div style={{ fontFamily: font, display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* Title */}
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: PC.navy, letterSpacing: '-0.4px' }}>Team Probation</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
          Review your team members on probation and submit your assessment when it's your turn.
        </p>
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
            placeholder="Search by name, employee ID, or role…"
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
          <div style={{ minWidth: 880 }}>
            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 14, alignItems: 'center', padding: '13px 22px', borderBottom: `1px solid ${PC.border}`, background: PC.surface }}>
              <HeaderCell>Employee</HeaderCell>
              <HeaderCell>Designation</HeaderCell>
              <HeaderCell>Duration</HeaderCell>
              <HeaderCell>End Date</HeaderCell>
              <HeaderCell>Time Left</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell alignEnd>Action</HeaderCell>
            </div>

            {/* Data rows */}
            {rows.length === 0 ? (
              <div style={{ padding: '48px 22px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: PC.navy }}>No matching team members</p>
                <p style={{ margin: '4px 0 0', fontSize: 12.5, color: PC.muted }}>Try a different search or filter.</p>
              </div>
            ) : rows.map((c: ProbationCase, i) => {
              const review = needsReview(c.status)
              const waiting = awaitingEmployee(c.status)
              return (
                <div
                  key={c.id}
                  onClick={() => onOpenCase?.(c.id)}
                  style={{
                    display: 'grid', gridTemplateColumns: COLS, gap: 14, alignItems: 'center',
                    padding: '15px 22px', cursor: 'pointer',
                    borderBottom: i === rows.length - 1 ? 'none' : `1px solid ${PC.border}`,
                    background: review ? 'rgba(245,158,11,0.045)' : '#fff', transition: 'background 0.14s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = review ? 'rgba(245,158,11,0.09)' : PC.surface }}
                  onMouseLeave={e => { e.currentTarget.style.background = review ? 'rgba(245,158,11,0.045)' : '#fff' }}
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

                  {/* Duration */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: PC.label }}>{c.durationMonths} mo</div>

                  {/* End date */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: PC.label }}>{fmtDate(c.endDate)}</div>

                  {/* Time left — days only */}
                  <div>
                    {(c.status === 'Confirmed' || c.status === 'Terminated')
                      ? <span style={{ fontSize: 13, color: PC.muted, fontWeight: 600 }}>—</span>
                      : <DaysLeft endDate={c.endDate} />}
                  </div>

                  {/* Status */}
                  <div><StatusPill status={c.status} size="sm" /></div>

                  {/* Action */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {review ? (
                      <button
                        onClick={e => { e.stopPropagation(); onOpenCase?.(c.id) }}
                        style={{ height: 34, padding: '0 15px', borderRadius: 9, cursor: 'pointer', fontFamily: font, fontSize: 12.5, fontWeight: 700, color: '#B45309', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.32)', display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.20)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(245,158,11,0.12)' }}
                      >
                        <ClipboardCheck size={14} /> Decision
                      </button>
                    ) : (
                      <button
                        onClick={e => { e.stopPropagation(); onOpenCase?.(c.id) }}
                        title={waiting ? 'Awaiting employee self-assessment' : 'View details'}
                        style={{ height: 34, padding: '0 14px', borderRadius: 9, cursor: 'pointer', fontFamily: font, fontSize: 12.5, fontWeight: 600, color: PC.label, background: '#fff', border: `1px solid ${PC.border}`, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                      >
                        <Eye size={14} /> View
                      </button>
                    )}
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
