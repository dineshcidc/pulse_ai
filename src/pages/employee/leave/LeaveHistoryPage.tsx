import { useState } from 'react'
import { History, Search, X, ChevronDown } from 'lucide-react'

interface LeaveRecord {
  id: string
  type: string
  code: string
  fromDate: string
  toDate: string
  days: number
  approvedDate: string
  approvedBy: string
  remarks: string
}

const HISTORY_DATA: LeaveRecord[] = [
  { id: 'LVR-1012', type: 'Sick Leave',       code: 'SL', fromDate: '2026-05-10', toDate: '2026-05-11', days: 2, approvedDate: '2026-05-09', approvedBy: 'Priya Mehta', remarks: 'Not feeling well'              },
  { id: 'LVR-0998', type: 'Earned Leave',      code: 'EL', fromDate: '2026-04-14', toDate: '2026-04-18', days: 5, approvedDate: '2026-04-11', approvedBy: 'Raj Kumar',   remarks: 'Annual vacation'             },
  { id: 'LVR-0971', type: 'Compensatory Off',  code: 'CO', fromDate: '2026-03-20', toDate: '2026-03-21', days: 2, approvedDate: '2026-03-19', approvedBy: 'Raj Kumar',   remarks: 'Weekend overtime compensated' },
  { id: 'LVR-0940', type: 'Sick Leave',        code: 'SL', fromDate: '2026-02-20', toDate: '2026-02-20', days: 1, approvedDate: '2026-02-20', approvedBy: 'Priya Mehta', remarks: 'Medical consultation'         },
  { id: 'LVR-0912', type: 'Casual Leave',      code: 'CL', fromDate: '2026-02-05', toDate: '2026-02-06', days: 2, approvedDate: '2026-02-04', approvedBy: 'Raj Kumar',   remarks: 'Personal work'               },
  { id: 'LVR-0888', type: 'Earned Leave',      code: 'EL', fromDate: '2026-01-20', toDate: '2026-01-24', days: 5, approvedDate: '2026-01-17', approvedBy: 'Priya Mehta', remarks: 'Family trip'                 },
  { id: 'LVR-0860', type: 'Casual Leave',      code: 'CL', fromDate: '2026-01-09', toDate: '2026-01-09', days: 1, approvedDate: '2026-01-08', approvedBy: 'Raj Kumar',   remarks: 'Personal reasons'            },
  { id: 'LVR-0835', type: 'Sick Leave',        code: 'SL', fromDate: '2025-12-18', toDate: '2025-12-19', days: 2, approvedDate: '2025-12-18', approvedBy: 'Priya Mehta', remarks: 'Fever and rest'              },
  { id: 'LVR-0810', type: 'Casual Leave',      code: 'CL', fromDate: '2025-11-24', toDate: '2025-11-24', days: 1, approvedDate: '2025-11-23', approvedBy: 'Raj Kumar',   remarks: 'Personal commitment'        },
  { id: 'LVR-0784', type: 'Earned Leave',      code: 'EL', fromDate: '2025-10-13', toDate: '2025-10-17', days: 5, approvedDate: '2025-10-10', approvedBy: 'Raj Kumar',   remarks: 'Dussehra holiday extension'  },
]

const CODE_STYLE: Record<string, { bg: string; color: string }> = {
  CL: { bg: 'rgba(99,102,241,0.12)',  color: '#5B5FDE' },
  SL: { bg: 'rgba(232,72,85,0.12)',   color: '#E84855' },
  EL: { bg: 'rgba(14,168,106,0.12)',  color: '#0EA86A' },
  CO: { bg: 'rgba(245,158,11,0.12)',  color: '#D97706' },
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8' }

const COL = '1.7fr 1.8fr 0.7fr 1.3fr 1.3fr 2fr'

function fmtDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function LeaveHistoryPage() {
  const [search,      setSearch]      = useState('')
  const [monthFilter, setMonthFilter] = useState('')
  const [fromFilter,  setFromFilter]  = useState('')
  const [toFilter,    setToFilter]    = useState('')

  const totalDays  = HISTORY_DATA.reduce((s, r) => s + r.days, 0)
  const byCode     = HISTORY_DATA.reduce<Record<string, number>>((acc, r) => {
    acc[r.code] = (acc[r.code] ?? 0) + r.days
    return acc
  }, {})

  const filtered = HISTORY_DATA.filter(r => {
    const q         = search.toLowerCase()
    const matchQ    = !q || r.type.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.remarks.toLowerCase().includes(q)
    const rMonth    = new Date(r.fromDate).getMonth()
    const matchMon  = !monthFilter || rMonth === parseInt(monthFilter)
    const matchFrom = !fromFilter  || r.fromDate >= fromFilter
    const matchTo   = !toFilter    || r.toDate   <= toFilter
    return matchQ && matchMon && matchFrom && matchTo
  })

  const filteredDays = filtered.reduce((s, r) => s + r.days, 0)
  const hasFilters   = search || monthFilter || fromFilter || toFilter

  function clearFilters() {
    setSearch(''); setMonthFilter(''); setFromFilter(''); setToFilter('')
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes iconFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .hist-row:hover { background: #FAFBFE !important; }
      `}</style>

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>
            Leave History
          </h1>
          <p style={{ fontSize: 13.5, color: C.muted }}>
            View all your past approved leave records
          </p>
        </div>
        <div
          className="flex items-center justify-center rounded-2xl flex-shrink-0"
          style={{
            width: 84, height: 84,
            backgroundColor: 'rgba(245,158,11,0.07)',
            backgroundImage: 'radial-gradient(circle, rgba(245,158,11,0.22) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
            border: '1px solid rgba(245,158,11,0.15)',
          }}
        >
          <div style={{ animation: 'iconFloat 4s ease-in-out infinite' }}>
            <History size={34} strokeWidth={1.5} style={{ color: '#D97706' }} />
          </div>
        </div>
      </div>

      {/* ── Summary strip ── */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {/* Total Leaves */}
        <div
          style={{
            background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14,
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ width: 42, height: 42, background: 'rgba(99,102,241,0.10)', color: '#5B5FDE' }}
          >
            <History size={18} strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, lineHeight: 1, letterSpacing: '-0.5px' }}>{HISTORY_DATA.length}</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginTop: 3 }}>Total Leaves</div>
          </div>
        </div>

        {/* Total Days */}
        <div
          style={{
            background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14,
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{ width: 42, height: 42, background: 'rgba(245,158,11,0.10)', color: '#D97706' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.navy, lineHeight: 1, letterSpacing: '-0.5px' }}>{totalDays}</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginTop: 3 }}>Total Days Used</div>
          </div>
        </div>

        {/* CL + SL */}
        <div
          style={{
            background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14,
            padding: '16px 20px',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Casual / Sick
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="rounded text-xs font-bold px-1.5 py-0.5" style={{ background: CODE_STYLE.CL.bg, color: CODE_STYLE.CL.color }}>CL</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>{byCode.CL ?? 0}d</span>
            </div>
            <div style={{ width: 1, height: 20, background: C.border }} />
            <div className="flex items-center gap-1.5">
              <span className="rounded text-xs font-bold px-1.5 py-0.5" style={{ background: CODE_STYLE.SL.bg, color: CODE_STYLE.SL.color }}>SL</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>{byCode.SL ?? 0}d</span>
            </div>
          </div>
        </div>

        {/* EL + CO */}
        <div
          style={{
            background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14,
            padding: '16px 20px',
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
            Earned / Comp Off
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="rounded text-xs font-bold px-1.5 py-0.5" style={{ background: CODE_STYLE.EL.bg, color: CODE_STYLE.EL.color }}>EL</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>{byCode.EL ?? 0}d</span>
            </div>
            <div style={{ width: 1, height: 20, background: C.border }} />
            <div className="flex items-center gap-1.5">
              <span className="rounded text-xs font-bold px-1.5 py-0.5" style={{ background: CODE_STYLE.CO.bg, color: CODE_STYLE.CO.color }}>CO</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>{byCode.CO ?? 0}d</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter toolbar ── */}
      <div
        className="flex items-center gap-3 mb-4 flex-wrap"
        style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 18px' }}
      >
        {/* Search */}
        <div className="relative flex-1" style={{ minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by leave type, ID or remarks..."
            style={{
              width: '100%', height: 38, borderRadius: 9,
              border: `1px solid ${search ? '#6366F1' : C.border}`,
              background: search ? '#F5F6FF' : '#F7F8FC',
              padding: '0 12px 0 34px',
              fontSize: 13, color: C.navy, outline: 'none',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              boxSizing: 'border-box' as const,
            }}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, lineHeight: 0 }}>
              <X size={12} />
            </button>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: C.border, flexShrink: 0 }} />

        {/* Month selector */}
        <div className="relative flex items-center gap-2">
          <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>Month</span>
          <div className="relative">
            <select
              value={monthFilter}
              onChange={e => setMonthFilter(e.target.value)}
              style={{
                height: 38, borderRadius: 9,
                border: `1px solid ${monthFilter ? '#6366F1' : C.border}`,
                background: monthFilter ? '#F5F6FF' : '#F7F8FC',
                padding: '0 30px 0 11px', fontSize: 13, fontWeight: 500,
                color: monthFilter ? C.navy : C.muted,
                appearance: 'none', cursor: 'pointer', outline: 'none',
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
            >
              <option value="">All Months</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>
            <ChevronDown size={13} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: C.border, flexShrink: 0 }} />

        {/* From date */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>From</span>
          <input
            type="date"
            value={fromFilter}
            onChange={e => setFromFilter(e.target.value)}
            style={{
              height: 38, borderRadius: 9,
              border: `1px solid ${fromFilter ? '#6366F1' : C.border}`,
              background: fromFilter ? '#F5F6FF' : '#F7F8FC',
              padding: '0 10px', fontSize: 13, color: C.navy, outline: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          />
        </div>

        {/* To date */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>To</span>
          <input
            type="date"
            value={toFilter}
            min={fromFilter}
            onChange={e => setToFilter(e.target.value)}
            style={{
              height: 38, borderRadius: 9,
              border: `1px solid ${toFilter ? '#6366F1' : C.border}`,
              background: toFilter ? '#F5F6FF' : '#F7F8FC',
              padding: '0 10px', fontSize: 13, color: C.navy, outline: 'none', cursor: 'pointer',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
          />
        </div>

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5"
            style={{
              height: 38, padding: '0 14px', borderRadius: 9,
              border: '1px solid rgba(232,72,85,0.25)',
              background: 'rgba(232,72,85,0.06)', color: '#E84855',
              fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.06)' }}
          >
            <X size={12} strokeWidth={2.5} /> Clear
          </button>
        )}
      </div>

      {/* ── Table card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        {/* Table header */}
        <div
          className="grid"
          style={{ gridTemplateColumns: COL, padding: '16px 20px', background: '#F7F8FC', borderBottom: `1px solid ${C.border}` }}
        >
          {['Leave Type', 'Duration', 'Days', 'Approved On', 'Approved By', 'Remarks'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ padding: '60px 20px' }}>
            <div
              className="flex items-center justify-center rounded-2xl mb-4"
              style={{ width: 56, height: 56, background: '#F0F2F8' }}
            >
              <History size={24} strokeWidth={1.5} style={{ color: '#B0B4C8' }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 5 }}>No leave history found</p>
            <p style={{ fontSize: 13, color: C.muted }}>Try adjusting your filters</p>
          </div>
        ) : (
          filtered.map((r, idx) => {
            const cs     = CODE_STYLE[r.code] ?? { bg: '#F0F2F8', color: C.muted }
            const isLast = idx === filtered.length - 1
            return (
              <div
                key={r.id}
                className="hist-row grid items-center"
                style={{
                  gridTemplateColumns: COL,
                  padding: '15px 20px',
                  borderBottom: isLast ? 'none' : '1px solid #F0F2F8',
                  background: '#fff',
                  transition: 'background 0.13s',
                }}
              >
                {/* Leave Type */}
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex items-center justify-center rounded-lg flex-shrink-0 font-bold"
                      style={{ width: 30, height: 22, background: cs.bg, color: cs.color, fontSize: 10, letterSpacing: '0.03em' }}
                    >
                      {r.code}
                    </span>
                    <span className="truncate" style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{r.type}</span>
                  </div>
                  <span style={{ fontSize: 11, color: C.muted, paddingLeft: 2 }}>{r.id}</span>
                </div>

                {/* Duration */}
                <div className="flex flex-col">
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{fmtDate(r.fromDate)}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>to {fmtDate(r.toDate)}</span>
                </div>

                {/* Days */}
                <div>
                  <span
                    className="inline-flex items-center justify-center rounded-lg font-bold"
                    style={{ minWidth: 32, height: 26, padding: '0 8px', background: '#F0F2F8', color: C.navy, fontSize: 13 }}
                  >
                    {r.days}d
                  </span>
                </div>

                {/* Approved On */}
                <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{fmtDate(r.approvedDate)}</span>

                {/* Approved By */}
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0 font-bold"
                    style={{ width: 26, height: 26, background: 'rgba(14,168,106,0.12)', color: '#0EA86A', fontSize: 10 }}
                  >
                    {r.approvedBy.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <span className="truncate" style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{r.approvedBy}</span>
                </div>

                {/* Remarks */}
                <div className="min-w-0 pr-2">
                  <span
                    className="inline-block truncate rounded-lg px-3 py-1"
                    style={{
                      maxWidth: '100%',
                      fontSize: 12, color: '#5A6080', fontWeight: 400,
                      background: '#F7F8FC', border: '1px solid #ECEEF5',
                    }}
                    title={r.remarks}
                  >
                    {r.remarks}
                  </span>
                </div>
              </div>
            )
          })
        )}

        {/* Footer */}
        {filtered.length > 0 && (
          <div
            className="flex items-center justify-between"
            style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE' }}
          >
            <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>
              Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of{' '}
              <strong style={{ color: C.navy }}>{HISTORY_DATA.length}</strong> records
              {filteredDays > 0 && (
                <> &nbsp;·&nbsp; <strong style={{ color: C.navy }}>{filteredDays}</strong> days in selected range</>
              )}
            </span>

            {/* Leave type breakdown for filtered set */}
            <div className="flex items-center gap-2 flex-wrap">
              {Object.entries(
                filtered.reduce<Record<string, number>>((acc, r) => { acc[r.code] = (acc[r.code] ?? 0) + r.days; return acc }, {})
              ).map(([code, days]) => {
                const cs = CODE_STYLE[code] ?? { bg: '#F0F2F8', color: C.muted }
                return (
                  <span
                    key={code}
                    className="inline-flex items-center gap-1.5 rounded-full font-semibold"
                    style={{ padding: '3px 10px', background: cs.bg, color: cs.color, fontSize: 11 }}
                  >
                    {code}: {days}d
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
