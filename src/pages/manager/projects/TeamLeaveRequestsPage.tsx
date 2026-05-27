import { useState } from 'react'
import { CheckCircle, XCircle, CalendarDays, MessageSquare, X, Search, Calendar, ChevronDown } from 'lucide-react'

type LeaveStatus = 'pending' | 'approved' | 'rejected'
type LeaveType   = 'Annual' | 'Sick' | 'Casual' | 'WFH' | 'Comp Off'

interface LeaveRow {
  id: number
  employee: string
  avatar: number
  designation: string
  project: string
  type: LeaveType
  from: string
  to: string
  fromISO: string   // YYYY-MM-DD for date filter
  days: number
  reason: string
  status: LeaveStatus
  appliedOn: string
}

const LEAVE_ROWS: LeaveRow[] = [
  { id: 1, employee: 'Sarah Johnson',  avatar: 47, designation: 'Frontend Dev',   project: 'Pulse.AI v2',  type: 'Annual',   from: 'May 26, 2026', to: 'May 27, 2026', fromISO: '2026-05-26', days: 2, reason: 'Family vacation planned well in advance',              status: 'pending',  appliedOn: 'May 18' },
  { id: 2, employee: 'Mike Chen',      avatar: 33, designation: 'QA Engineer',    project: 'HDFC Portal',  type: 'Sick',     from: 'May 22, 2026', to: 'May 22, 2026', fromISO: '2026-05-22', days: 1, reason: 'Fever and throat infection — doctor consultation',     status: 'pending',  appliedOn: 'May 22' },
  { id: 3, employee: 'Emma Wilson',    avatar: 44, designation: 'UI/UX Designer', project: 'Pulse.AI v2',  type: 'WFH',      from: 'May 23, 2026', to: 'May 24, 2026', fromISO: '2026-05-23', days: 2, reason: 'Home renovation work requires supervision',            status: 'pending',  appliedOn: 'May 21' },
  { id: 4, employee: 'David Brown',    avatar: 38, designation: 'Backend Dev',    project: 'TechCorp ERP', type: 'Casual',   from: 'May 29, 2026', to: 'May 29, 2026', fromISO: '2026-05-29', days: 1, reason: 'Personal errand — bank visit and documentation',       status: 'approved', appliedOn: 'May 19' },
  { id: 5, employee: 'Lisa Garcia',    avatar: 25, designation: 'DevOps Eng',     project: 'Pulse.AI v2',  type: 'Comp Off', from: 'May 25, 2026', to: 'May 25, 2026', fromISO: '2026-05-25', days: 1, reason: 'Compensatory off for weekend deployment support',       status: 'approved', appliedOn: 'May 17' },
  { id: 6, employee: 'Tom Davis',      avatar: 20, designation: 'Full Stack Dev', project: 'HDFC Portal',  type: 'Annual',   from: 'Jun 02, 2026', to: 'Jun 06, 2026', fromISO: '2026-06-02', days: 5, reason: 'Pre-planned annual leave — international travel',       status: 'approved', appliedOn: 'May 10' },
  { id: 7, employee: 'Priya Sharma',   avatar: 10, designation: 'BA Analyst',     project: 'TechCorp ERP', type: 'Casual',   from: 'May 28, 2026', to: 'May 28, 2026', fromISO: '2026-05-28', days: 1, reason: 'Leave balance utilisation',                            status: 'rejected', appliedOn: 'May 20' },
]

const STATUS_CFG: Record<LeaveStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:  { label: 'Pending',  color: '#D97706', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.20)'  },
  approved: { label: 'Approved', color: '#0A8A58', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.20)' },
  rejected: { label: 'Rejected', color: '#E84855', bg: 'rgba(232,72,85,0.09)',  border: 'rgba(232,72,85,0.18)'  },
}

const TYPE_COLORS: Record<LeaveType, { color: string; bg: string }> = {
  'Annual':   { color: '#6366F1', bg: 'rgba(99,102,241,0.10)'   },
  'Sick':     { color: '#E84855', bg: 'rgba(232,72,85,0.09)'    },
  'Casual':   { color: '#F5A623', bg: 'rgba(245,166,35,0.10)'   },
  'WFH':      { color: '#0EA86A', bg: 'rgba(14,168,106,0.10)'   },
  'Comp Off': { color: '#7C3AED', bg: 'rgba(124,58,237,0.10)'   },
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

const TABS: { id: LeaveStatus; label: string }[] = [
  { id: 'pending',  label: 'Pending'  },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
]

interface RemarksModal {
  id: number | null
  action: 'approve' | 'reject' | null
  remarks: string
}

/* ── Minimal native select ── */
function Dropdown({ value, options, onChange, width }: { value: string; options: string[]; onChange: (v: string) => void; width?: number }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          height: 38, padding: '0 30px 0 12px',
          border: `1px solid ${C.border}`, borderRadius: 9,
          fontSize: 13, fontWeight: 500, color: value.startsWith('All') ? C.muted : C.navy,
          background: '#fff', outline: 'none',
          cursor: 'pointer', appearance: 'none',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          width: width ?? 'auto', minWidth: 130,
        }}
        onFocus={e => { e.target.style.borderColor = '#6366F1' }}
        onBlur={e => { e.target.style.borderColor = C.border }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
    </div>
  )
}

export default function TeamLeaveRequestsPage() {
  const [tab, setTab]         = useState<LeaveStatus>('pending')
  const [search, setSearch]   = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [rows, setRows]       = useState(LEAVE_ROWS)
  const [modal, setModal]     = useState<RemarksModal>({ id: null, action: null, remarks: '' })

  function openModal(id: number, action: 'approve' | 'reject') {
    setModal({ id, action, remarks: '' })
  }

  function closeModal() {
    setModal({ id: null, action: null, remarks: '' })
  }

  function confirmAction() {
    if (modal.id === null || !modal.action) return
    setRows(prev => prev.map(r =>
      r.id === modal.id ? { ...r, status: modal.action === 'approve' ? 'approved' : 'rejected' } : r
    ))
    closeModal()
  }

  const filtered = rows.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = !q || r.employee.toLowerCase().includes(q) || r.project.toLowerCase().includes(q)
    const matchStatus = r.status === tab
    const matchDate   = !dateFilter || r.fromISO === dateFilter
    return matchSearch && matchStatus && matchDate
  })

  const pendingCount  = rows.filter(r => r.status === 'pending').length
  const approvedCount = rows.filter(r => r.status === 'approved').length
  const hasActiveFilter = search || dateFilter

  const COLS = '2fr 1fr 1.2fr 1.2fr 0.6fr 2.2fr 1fr 1.1fr'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold" style={{ color: C.navy }}>Team Leave Requests</h1>
            {pendingCount > 0 && (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(245,158,11,0.12)', color: '#D97706', border: '1px solid rgba(245,158,11,0.22)' }}
              >
                <CalendarDays size={11} />
                {pendingCount} pending
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: C.muted }}>
            Review and manage leave requests from your team members across all projects
          </p>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
        <div className="flex items-center gap-3 flex-wrap">

          {/* Search */}
          <div style={{ position: 'relative', flexShrink: 0, width: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employee or project..."
              style={{
                width: '100%', height: 38, paddingLeft: 34, paddingRight: 12,
                border: `1px solid ${C.border}`, borderRadius: 9,
                fontSize: 13, color: C.navy, background: C.surface,
                fontFamily: "'DM Sans', system-ui, sans-serif", outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
            />
          </div>

          {/* Date picker */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Calendar size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none', zIndex: 1 }} />
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              style={{
                height: 38, paddingLeft: 30, paddingRight: 10,
                border: `1px solid ${dateFilter ? '#6366F1' : C.border}`,
                borderRadius: 9, fontSize: 13,
                color: dateFilter ? C.navy : C.muted,
                background: dateFilter ? 'rgba(99,102,241,0.05)' : C.surface,
                fontFamily: "'DM Sans', system-ui, sans-serif",
                outline: 'none', cursor: 'pointer', transition: 'all 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = '#6366F1' }}
              onBlur={e => { if (!dateFilter) e.target.style.borderColor = C.border }}
            />
          </div>

          {/* Clear */}
          {hasActiveFilter && (
            <button
              onClick={() => { setSearch(''); setDateFilter('') }}
              style={{ height: 38, padding: '0 12px', borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', fontSize: 12.5, color: C.muted, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
            >
              Clear
            </button>
          )}

          {/* Status tabs */}
          <div className="flex items-center gap-1.5 ml-auto">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  height: 34, padding: '0 14px', borderRadius: 8, border: 'none',
                  fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  background: tab === t.id ? C.navy : C.hover,
                  color: tab === t.id ? '#fff' : C.muted,
                  transition: 'all 0.15s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { if (tab !== t.id) { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { if (tab !== t.id) { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted } }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        {/* Header */}
        <div
          className="grid"
          style={{ gridTemplateColumns: COLS, padding: '12px 20px', background: C.surface, borderBottom: `1px solid ${C.border}` }}
        >
          {['Employee', 'Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Action'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: 180 }}>
            <p style={{ fontSize: 14, color: C.muted }}>No leave requests match the selected filter</p>
          </div>
        ) : (
          filtered.map((row, idx) => {
            const st = STATUS_CFG[row.status]
            const tc = TYPE_COLORS[row.type]
            const isPending = row.status === 'pending'

            return (
              <div
                key={row.id}
                className="grid items-center"
                style={{
                  gridTemplateColumns: COLS,
                  padding: '16px 20px',
                  borderBottom: idx < filtered.length - 1 ? `1px solid #F0F2F8` : 'none',
                  background: '#fff', transition: 'background 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
              >
                {/* Employee */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={`https://i.pravatar.cc/150?img=${row.avatar}`}
                    alt={row.employee}
                    style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${C.border}` }}
                  />
                  <div className="min-w-0">
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.employee}</div>
                    <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{row.designation}</div>
                  </div>
                </div>

                {/* Type */}
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 9px', borderRadius: 7, background: tc.bg, color: tc.color, width: 'fit-content', whiteSpace: 'nowrap' }}>
                  {row.type}
                </span>

                {/* From */}
                <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{row.from}</span>

                {/* To */}
                <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{row.to}</span>

                {/* Days */}
                <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{row.days}d</span>

                {/* Reason — single line ellipsis */}
                <div style={{ minWidth: 0, overflow: 'hidden', paddingRight: 8 }}>
                  <span style={{ fontSize: 12.5, color: '#5A6080', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                    {row.reason}
                  </span>
                </div>

                {/* Status */}
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 9px', borderRadius: 7, background: st.bg, color: st.color, border: `1px solid ${st.border}`, whiteSpace: 'nowrap', width: 'fit-content' }}>
                  {st.label}
                </span>

                {/* Action */}
                {isPending ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openModal(row.id, 'approve')}
                      title="Approve"
                      style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(14,168,106,0.10)', color: '#0A8A58', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.22)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.10)' }}
                    >
                      <CheckCircle size={15} strokeWidth={1.8} />
                    </button>
                    <button
                      onClick={() => openModal(row.id, 'reject')}
                      title="Reject"
                      style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(232,72,85,0.09)', color: '#E84855', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.09)' }}
                    >
                      <XCircle size={15} strokeWidth={1.8} />
                    </button>
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: '#D0D3E4' }}>—</span>
                )}
              </div>
            )
          })
        )}

        {/* Footer */}
        <div className="flex items-center justify-between" style={{ padding: '13px 20px', borderTop: `1px solid ${C.border}`, background: C.surface }}>
          <span style={{ fontSize: 12, color: C.muted }}>
            Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of {rows.length} requests
          </span>
          <span style={{ fontSize: 12, color: C.muted }}>
            <span style={{ fontWeight: 700, color: '#0A8A58' }}>{approvedCount}</span> Approved ·{' '}
            <span style={{ fontWeight: 700, color: '#D97706' }}>{pendingCount}</span> Pending ·{' '}
            <span style={{ fontWeight: 700, color: '#E84855' }}>{rows.filter(r => r.status === 'rejected').length}</span> Rejected
          </span>
        </div>
      </div>

      {/* ── Remarks modal ── */}
      {modal.id !== null && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px 28px 24px', width: 420, boxShadow: '0 24px 64px rgba(10,12,28,0.20)' }}>

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div style={{ width: 42, height: 42, borderRadius: 13, flexShrink: 0, background: modal.action === 'approve' ? 'rgba(14,168,106,0.12)' : 'rgba(232,72,85,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {modal.action === 'approve'
                    ? <CheckCircle size={20} strokeWidth={1.8} style={{ color: '#0A8A58' }} />
                    : <XCircle    size={20} strokeWidth={1.8} style={{ color: '#E84855' }} />
                  }
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>
                    {modal.action === 'approve' ? 'Approve Leave' : 'Reject Leave'}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    {rows.find(r => r.id === modal.id)?.employee}
                  </div>
                </div>
              </div>
              <button
                onClick={closeModal}
                style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: C.hover, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>

            {/* Remarks */}
            <label style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 7 }}>
              <span className="flex items-center gap-1.5"><MessageSquare size={12} /> Remarks (optional)</span>
            </label>
            <textarea
              value={modal.remarks}
              onChange={e => setModal(p => ({ ...p, remarks: e.target.value }))}
              placeholder={modal.action === 'approve' ? 'Add a note for the employee...' : 'Reason for rejection...'}
              rows={3}
              style={{ width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, color: C.navy, background: C.hover, outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.hover }}
            />

            {/* Buttons */}
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={closeModal}
                style={{ flex: 1, height: 42, borderRadius: 11, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                style={{ flex: 1, height: 42, borderRadius: 11, border: 'none', background: modal.action === 'approve' ? '#0EA86A' : '#E84855', color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = modal.action === 'approve' ? '#0A8A58' : '#D43F4B' }}
                onMouseLeave={e => { e.currentTarget.style.background = modal.action === 'approve' ? '#0EA86A' : '#E84855' }}
              >
                {modal.action === 'approve' ? 'Confirm Approve' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
