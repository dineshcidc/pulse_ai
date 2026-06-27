import { useState } from 'react'
import { ClipboardList, Search, X, AlertTriangle, Eye, Edit } from 'lucide-react'

type Status = 'Draft' | 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'

interface LeaveRecord {
  id: string
  type: string
  code: string
  fromDate: string
  toDate: string
  days: number
  appliedDate: string
  status: Status
  approver: string
  remarks: string
}

const LEAVE_DATA: LeaveRecord[] = [
  { id: 'LVR-1025', type: 'Floating Holiday',     code: 'FH',  fromDate: '2026-06-10', toDate: '2026-06-12', days: 3, appliedDate: '2026-06-01', status: 'Draft',    approver: '—',           remarks: 'Summer break plans'                  },
  { id: 'LVR-1024', type: 'Planned Leave',        code: 'PL',  fromDate: '2026-05-25', toDate: '2026-05-27', days: 3, appliedDate: '2026-05-20', status: 'Pending',   approver: 'Raj Kumar',   remarks: 'Personal reasons'                    },
  { id: 'LVR-1018', type: 'Floating Holiday',     code: 'FH',  fromDate: '2026-06-02', toDate: '2026-06-05', days: 4, appliedDate: '2026-05-18', status: 'Pending',   approver: 'Raj Kumar',   remarks: 'Family function to attend'           },
  { id: 'LVR-1012', type: 'Unplanned Leave',      code: 'UPL', fromDate: '2026-05-10', toDate: '2026-05-11', days: 2, appliedDate: '2026-05-09', status: 'Approved',  approver: 'Priya Mehta', remarks: 'Not feeling well'                    },
  { id: 'LVR-0998', type: 'Planned Leave',        code: 'PL',  fromDate: '2026-04-14', toDate: '2026-04-18', days: 5, appliedDate: '2026-04-10', status: 'Approved',  approver: 'Raj Kumar',   remarks: 'Annual vacation'                     },
  { id: 'LVR-0985', type: 'Birthday Leave',       code: 'BL',  fromDate: '2026-04-05', toDate: '2026-04-05', days: 1, appliedDate: '2026-04-04', status: 'Rejected',  approver: 'Priya Mehta', remarks: 'Team sprint period — cannot approve' },
  { id: 'LVR-0971', type: 'Bereavement Holiday',  code: 'BH',  fromDate: '2026-03-20', toDate: '2026-03-21', days: 2, appliedDate: '2026-03-18', status: 'Approved',  approver: 'Raj Kumar',   remarks: 'Family bereavement'                  },
  { id: 'LVR-0954', type: 'LWP',                  code: 'LWP', fromDate: '2026-03-05', toDate: '2026-03-05', days: 1, appliedDate: '2026-03-04', status: 'Cancelled', approver: '—',           remarks: 'Self cancelled'                      },
  { id: 'LVR-0940', type: 'Unplanned Leave',      code: 'UPL', fromDate: '2026-02-20', toDate: '2026-02-20', days: 1, appliedDate: '2026-02-20', status: 'Approved',  approver: 'Priya Mehta', remarks: 'Medical consultation'                },
]

const STATUS_STYLE: Record<Status, { bg: string; color: string; dot: string }> = {
  Draft:     { bg: 'rgba(168,85,247,0.12)',  color: '#7C3AED', dot: '#A855F7' },
  Pending:   { bg: 'rgba(245,158,11,0.12)',  color: '#B45309', dot: '#F59E0B' },
  Approved:  { bg: 'rgba(14,168,106,0.12)',  color: '#0A7040', dot: '#0EA86A' },
  Rejected:  { bg: 'rgba(232,72,85,0.12)',   color: '#C0202E', dot: '#E84855' },
  Cancelled: { bg: 'rgba(139,144,167,0.14)', color: '#6B7280', dot: '#9CA3AF' },
}

const CODE_STYLE: Record<string, { bg: string; color: string }> = {
  BH:  { bg: 'rgba(109,40,217,0.12)',  color: '#6D28D9' },
  BL:  { bg: 'rgba(219,39,119,0.12)',  color: '#DB2777' },
  EDL: { bg: 'rgba(8,145,178,0.12)',   color: '#0891B2' },
  FH:  { bg: 'rgba(234,88,12,0.12)',   color: '#EA580C' },
  LWP: { bg: 'rgba(220,38,38,0.12)',   color: '#DC2626' },
  PAT: { bg: 'rgba(37,99,235,0.12)',   color: '#2563EB' },
  PL:  { bg: 'rgba(5,150,105,0.12)',   color: '#059669' },
  UPL: { bg: 'rgba(217,119,6,0.12)',   color: '#D97706' },
}

const STAT_TABS = ['All', 'Pending', 'Approved', 'Rejected', 'Draft', 'Cancelled'] as const

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8' }

function fmtDate(d: string) {
  if (!d || d === '—') return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const COL = '1.6fr 1.9fr 0.7fr 1.2fr 1.1fr 1.2fr 0.9fr'

export default function LeaveStatusPage({ onNavigate }: { onNavigate?: (id: string) => void } = {}) {
  void onNavigate
  const [records,       setRecords]       = useState<LeaveRecord[]>(LEAVE_DATA)
  const [search,        setSearch]        = useState('')
  const [activeTab,     setActiveTab]     = useState<typeof STAT_TABS[number]>('All')
  const [fromFilter,    setFromFilter]    = useState('')
  const [toFilter,      setToFilter]      = useState('')
  const [cancelTarget,  setCancelTarget]  = useState<string | null>(null)
  const [viewTarget,    setViewTarget]    = useState<string | null>(null)

  const counts = STAT_TABS.reduce((acc, s) => {
    acc[s] = s === 'All' ? records.length : records.filter(r => r.status === s).length
    return acc
  }, {} as Record<typeof STAT_TABS[number], number>)

  const filtered = records.filter(r => {
    const q = search.toLowerCase()
    const matchSearch  = !q || r.type.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.approver.toLowerCase().includes(q)
    const matchTab     = activeTab === 'All' || r.status === activeTab
    const matchFrom    = !fromFilter || r.fromDate >= fromFilter
    const matchTo      = !toFilter   || r.toDate   <= toFilter
    return matchSearch && matchTab && matchFrom && matchTo
  })

  const hasFilters = search || fromFilter || toFilter

  function clearFilters() {
    setSearch(''); setFromFilter(''); setToFilter('')
  }

  function doCancel() {
    if (!cancelTarget) return
    setRecords(p => p.map(r => r.id === cancelTarget ? { ...r, status: 'Cancelled' } : r))
    setCancelTarget(null)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes iconFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .leave-row:hover { background: #FAFBFE !important; }
      `}</style>

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>
            Leave Approval Status
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            Track and manage all your submitted leave requests
          </p>
        </div>
        <div
          className="flex items-center justify-center rounded-2xl flex-shrink-0"
          style={{
            width: 84, height: 84,
            backgroundColor: 'rgba(14,168,106,0.07)',
            backgroundImage: 'radial-gradient(circle, rgba(14,168,106,0.22) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
            border: '1px solid rgba(14,168,106,0.14)',
          }}
        >
          <div style={{ animation: 'iconFloat 4s ease-in-out infinite' }}>
            <ClipboardList size={34} strokeWidth={1.5} style={{ color: '#0EA86A' }} />
          </div>
        </div>
      </div>

      {/* ── Summary stat tabs ── */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {STAT_TABS.map(tab => {
          const isActive = activeTab === tab
          const ss = tab !== 'All' ? STATUS_STYLE[tab as Status] : null
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 9, border: 'none',
                cursor: 'pointer', transition: 'all 0.15s',
                background: isActive
                  ? (ss ? ss.bg : 'rgba(28,32,53,0.08)')
                  : '#fff',
                borderWidth: 1.5, borderStyle: 'solid',
                borderColor: isActive
                  ? (ss ? ss.dot + '44' : 'rgba(28,32,53,0.15)')
                  : C.border,
              }}
            >
              {ss && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: ss.dot, flexShrink: 0, display: 'inline-block' }} />
              )}
              <span style={{ fontSize: 12, fontWeight: 600, color: isActive ? (ss ? ss.color : C.navy) : C.muted }}>
                {tab}
              </span>
              <span
                style={{
                  fontSize: 10.5, fontWeight: 700,
                  padding: '1px 6px', borderRadius: 99,
                  background: isActive ? (ss ? ss.dot + '22' : 'rgba(28,32,53,0.08)') : '#F0F2F8',
                  color: isActive ? (ss ? ss.color : C.navy) : C.muted,
                }}
              >
                {counts[tab]}
              </span>
            </button>
          )
        })}
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
            placeholder="Search by leave type, ID or approver..."
            style={{
              width: '100%', height: 38, borderRadius: 9,
              border: `1px solid ${C.border}`,
              background: '#fff',
              padding: '0 12px 0 34px',
              fontSize: 13, color: C.navy, outline: 'none',
              fontFamily: "'DM Sans', system-ui, sans-serif",
              boxSizing: 'border-box',
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

        {/* From date */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>From</span>
          <input
            type="date"
            value={fromFilter}
            onChange={e => setFromFilter(e.target.value)}
            style={{
              height: 38, borderRadius: 9, border: `1px solid ${fromFilter ? '#6366F1' : C.border}`,
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
              height: 38, borderRadius: 9, border: `1px solid ${toFilter ? '#6366F1' : C.border}`,
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
              height: 38, padding: '0 14px', borderRadius: 9, border: `1px solid rgba(232,72,85,0.25)`,
              background: 'rgba(232,72,85,0.06)', color: '#E84855', fontSize: 12.5, fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.06)' }}
          >
            <X size={12} strokeWidth={2.5} /> Clear filters
          </button>
        )}
      </div>

      {/* ── Table card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        {/* Table header */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: COL,
            padding: '16px 20px',
            background: '#F7F8FC',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          {['Leave Type', 'Duration', 'Days', 'Applied On', 'Status', 'Approver', 'Action'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ padding: '56px 20px' }}>
            <div
              className="flex items-center justify-center rounded-2xl mb-4"
              style={{ width: 56, height: 56, background: '#F0F2F8' }}
            >
              <ClipboardList size={24} strokeWidth={1.5} style={{ color: '#B0B4C8' }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 5 }}>No leave requests found</p>
            <p style={{ fontSize: 13, color: C.muted }}>Try adjusting your filters or search term</p>
          </div>
        ) : (
          filtered.map((r, idx) => {
            const ss  = STATUS_STYLE[r.status]
            const cs  = CODE_STYLE[r.code] ?? { bg: '#F0F2F8', color: C.muted }
            const isLast = idx === filtered.length - 1
            return (
              <div
                key={r.id}
                className="leave-row grid items-center"
                style={{
                  gridTemplateColumns: COL,
                  padding: '15px 20px',
                  borderBottom: isLast ? 'none' : `1px solid #F0F2F8`,
                  background: '#fff',
                  transition: 'background 0.13s',
                }}
              >
                {/* Leave Type */}
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex items-center justify-center rounded-lg flex-shrink-0 text-xs font-bold"
                      style={{ width: 30, height: 22, background: cs.bg, color: cs.color, fontSize: 10, letterSpacing: '0.03em' }}
                    >
                      {r.code}
                    </span>
                    <span className="truncate" style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{r.type}</span>
                  </div>
                  <span style={{ fontSize: 11, color: C.muted, paddingLeft: 2 }}>{r.id}</span>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="flex flex-col">
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{fmtDate(r.fromDate)}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>to {fmtDate(r.toDate)}</span>
                  </div>
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

                {/* Applied On */}
                <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{fmtDate(r.appliedDate)}</span>

                {/* Status */}
                <div>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full font-semibold"
                    style={{ padding: '5px 11px', background: ss.bg, color: ss.color, fontSize: 12 }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: ss.dot, display: 'inline-block', flexShrink: 0 }} />
                    {r.status}
                  </span>
                </div>

                {/* Approver */}
                <div className="flex items-center gap-2 min-w-0">
                  {r.approver !== '—' ? (
                    <>
                      <div
                        className="flex items-center justify-center rounded-full flex-shrink-0 text-xs font-bold"
                        style={{ width: 26, height: 26, background: 'rgba(99,102,241,0.12)', color: '#5B5FDE', fontSize: 10 }}
                      >
                        {r.approver.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <span className="truncate" style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{r.approver}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 12.5, color: '#C0C4D6' }}>—</span>
                  )}
                </div>

                {/* Action */}
                <div>
                  {r.status === 'Draft' ? (
                    <button
                      title="Edit draft"
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: '1px solid #D0D4E4',
                        background: '#F0F2F8', color: '#8B90A7',
                        cursor: 'default', transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Edit size={14} strokeWidth={1.8} />
                    </button>
                  ) : r.status === 'Pending' ? (
                    <button
                      onClick={() => setCancelTarget(r.id)}
                      style={{
                        height: 32, padding: '0 13px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                        border: '1px solid rgba(232,72,85,0.25)',
                        background: 'rgba(232,72,85,0.06)', color: '#E84855',
                        cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.14)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.4)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.06)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.25)' }}
                    >
                      Cancel
                    </button>
                  ) : r.status === 'Rejected' ? (
                    <button
                      title="View rejection reason"
                      onClick={() => setViewTarget(r.id)}
                      style={{
                        width: 32, height: 32, borderRadius: 8, border: '1px solid #D0D4E4',
                        background: '#F0F2F8', color: '#8B90A7',
                        cursor: 'pointer', transition: 'all 0.15s',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#E8EAF2'; e.currentTarget.style.color = '#1C2035'; e.currentTarget.style.borderColor = '#C0C4D6' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#F0F2F8'; e.currentTarget.style.color = '#8B90A7'; e.currentTarget.style.borderColor = '#D0D4E4' }}
                    >
                      <Eye size={14} strokeWidth={1.8} />
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, color: '#D0D4E4', fontWeight: 500 }}>—</span>
                  )}
                </div>
              </div>
            )
          })
        )}

        {/* Footer */}
      </div>

      {/* ── Cancel confirmation modal ── */}
      {cancelTarget && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,12,28,0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
          onClick={e => { if (e.target === e.currentTarget) setCancelTarget(null) }}
        >
          {(() => {
            const r = records.find(x => x.id === cancelTarget)!
            return (
              <div
                style={{
                  background: '#fff', borderRadius: 22, width: 420,
                  boxShadow: '0 24px 64px rgba(10,12,28,0.18)', overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div style={{ padding: '28px 28px 20px' }}>
                  <div
                    className="flex items-center justify-center mx-auto mb-4 rounded-2xl"
                    style={{ width: 56, height: 56, background: 'rgba(232,72,85,0.10)' }}
                  >
                    <AlertTriangle size={24} strokeWidth={1.8} style={{ color: '#E84855' }} />
                  </div>
                  <p style={{ fontSize: 17, fontWeight: 700, color: C.navy, textAlign: 'center', marginBottom: 6 }}>
                    Cancel Leave Request?
                  </p>
                  <p style={{ fontSize: 13, color: C.muted, textAlign: 'center', lineHeight: 1.65 }}>
                    Are you sure you want to cancel this leave request? This action cannot be undone.
                  </p>
                </div>

                {/* Leave details summary */}
                <div style={{ margin: '0 24px 22px', padding: '14px 16px', background: '#F7F8FC', borderRadius: 12 }}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Request</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{r.id}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{r.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                      {fmtDate(r.fromDate)} → {fmtDate(r.toDate)}
                      <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: 'rgba(99,102,241,0.12)', color: '#5B5FDE' }}>
                        {r.days}d
                      </span>
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3" style={{ padding: '0 24px 26px' }}>
                  <button
                    onClick={() => setCancelTarget(null)}
                    style={{
                      flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 600,
                      border: '1px solid #E8EAF2', background: '#fff', color: C.muted,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EAF2'; e.currentTarget.style.color = C.muted }}
                  >
                    Keep Request
                  </button>
                  <button
                    onClick={doCancel}
                    style={{
                      flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700,
                      border: 'none', background: '#E84855', color: '#fff',
                      cursor: 'pointer', transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                  >
                    Yes, Cancel It
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* ── View rejection modal ── */}
      {viewTarget && (() => {
        const r = records.find(x => x.id === viewTarget)!
        const ss = STATUS_STYLE['Rejected']
        return (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 9999,
              background: 'rgba(10,12,28,0.5)',
              backdropFilter: 'blur(5px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
            onClick={e => { if (e.target === e.currentTarget) setViewTarget(null) }}
          >
            <div
              style={{
                background: '#fff', borderRadius: 22, width: 440,
                boxShadow: '0 24px 64px rgba(10,12,28,0.18)', overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div style={{ padding: '22px 26px 18px', borderBottom: `1px solid ${C.border}` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{ width: 38, height: 38, background: ss.bg }}
                    >
                      <Eye size={17} strokeWidth={1.8} style={{ color: ss.color }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Leave Request Details</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{r.id}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setViewTarget(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, lineHeight: 0, padding: 4 }}
                    onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
                    onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Details grid */}
              <div style={{ padding: '18px 26px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Leave Type',  value: `${r.type} (${r.code})` },
                  { label: 'Duration',    value: `${fmtDate(r.fromDate)} → ${fmtDate(r.toDate)}` },
                  { label: 'Days',        value: `${r.days} working day${r.days !== 1 ? 's' : ''}` },
                  { label: 'Applied On',  value: fmtDate(r.appliedDate) },
                  { label: 'Approver',    value: r.approver },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between"
                    style={{ padding: '10px 14px', background: '#F7F8FC', borderRadius: 10 }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{value}</span>
                  </div>
                ))}

                {/* Status */}
                <div
                  className="flex items-center justify-between"
                  style={{ padding: '10px 14px', background: '#F7F8FC', borderRadius: 10 }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full font-semibold"
                    style={{ padding: '4px 11px', background: ss.bg, color: ss.color, fontSize: 12 }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: ss.dot, display: 'inline-block' }} />
                    Rejected
                  </span>
                </div>

                {/* Rejection reason */}
                <div style={{ padding: '12px 14px', background: 'rgba(232,72,85,0.05)', border: '1px solid rgba(232,72,85,0.15)', borderRadius: 10 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: '#E84855', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                    Rejection Reason
                  </div>
                  <div style={{ fontSize: 13, color: C.navy, lineHeight: 1.65 }}>{r.remarks}</div>
                </div>
              </div>

              {/* Close button */}
              <div style={{ padding: '0 26px 22px' }}>
                <button
                  onClick={() => setViewTarget(null)}
                  style={{
                    width: '100%', height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 600,
                    border: `1px solid ${C.border}`, background: '#fff', color: C.muted,
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0C4D6'; e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.muted }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      })()}

    </div>
  )
}
