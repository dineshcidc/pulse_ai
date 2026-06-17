import { useState } from 'react'
import { CheckCircle, XCircle, CalendarDays, MessageSquare, X, Search, Calendar, Eye, User, Clock } from 'lucide-react'

type LeaveStatus = 'pending' | 'approved' | 'rejected'
type LeaveType   = 'Bereavement Holiday' | 'Birthday Leave' | 'Election Day Leave' | 'Floating Holiday' | 'LWP' | 'Paternity Leave' | 'Planned Leave' | 'Unplanned Leave'

interface LeaveRow {
  id: number
  employee: string
  avatar: number
  designation: string
  project: string
  type: LeaveType
  from: string
  to: string
  fromISO: string
  days: number
  reason: string
  status: LeaveStatus
  appliedOn: string
  managerRemarks?: string
}

const LEAVE_ROWS: LeaveRow[] = [
  { id: 1, employee: 'Sarah Johnson',  avatar: 47, designation: 'Frontend Dev',   project: 'Pulse.AI v2',  type: 'Planned Leave',      from: 'May 26, 2026', to: 'May 27, 2026', fromISO: '2026-05-26', days: 2, reason: 'Family vacation planned well in advance — annual family reunion that happens once a year. Travel tickets and accommodation are already booked.', status: 'pending',  appliedOn: 'May 18' },
  { id: 2, employee: 'Mike Chen',      avatar: 33, designation: 'QA Engineer',    project: 'HDFC Portal',  type: 'Unplanned Leave',    from: 'May 22, 2026', to: 'May 22, 2026', fromISO: '2026-05-22', days: 1, reason: 'Fever and throat infection — visited doctor in the morning, prescribed rest for the day and antibiotics for 5 days.', status: 'pending',  appliedOn: 'May 22' },
  { id: 3, employee: 'Emma Wilson',    avatar: 44, designation: 'UI/UX Designer', project: 'Pulse.AI v2',  type: 'Floating Holiday',   from: 'May 23, 2026', to: 'May 24, 2026', fromISO: '2026-05-23', days: 2, reason: 'Home renovation work requires on-site supervision for two days. Internet and laptop setup will be available for full productivity.', status: 'pending',  appliedOn: 'May 21' },
  { id: 4, employee: 'David Brown',    avatar: 38, designation: 'Backend Dev',    project: 'TechCorp ERP', type: 'Floating Holiday',   from: 'May 29, 2026', to: 'May 29, 2026', fromISO: '2026-05-29', days: 1, reason: 'Personal errand — bank visit and documentation work that requires physical presence during banking hours.', status: 'approved', appliedOn: 'May 19', managerRemarks: 'Approved. Please ensure sprint tasks are completed before this date.' },
  { id: 5, employee: 'Lisa Garcia',    avatar: 25, designation: 'DevOps Eng',     project: 'Pulse.AI v2',  type: 'Bereavement Holiday',from: 'May 25, 2026', to: 'May 25, 2026', fromISO: '2026-05-25', days: 1, reason: 'Bereavement leave due to family loss. Required to attend last rites and family obligations.', status: 'approved', appliedOn: 'May 17', managerRemarks: 'Approved. Our condolences. Take the time you need.' },
  { id: 6, employee: 'Tom Davis',      avatar: 20, designation: 'Full Stack Dev', project: 'HDFC Portal',  type: 'Planned Leave',      from: 'Jun 02, 2026', to: 'Jun 06, 2026', fromISO: '2026-06-02', days: 5, reason: 'Pre-planned leave for international travel. Tickets and hotel booked 3 months in advance. All pending work and handover notes will be completed before the leave begins.', status: 'approved', appliedOn: 'May 10', managerRemarks: 'Approved. Please complete handover docs and assign sprint tasks before departure.' },
  { id: 7, employee: 'Priya Sharma',   avatar: 10, designation: 'BA Analyst',     project: 'TechCorp ERP', type: 'Birthday Leave',     from: 'May 28, 2026', to: 'May 28, 2026', fromISO: '2026-05-28', days: 1, reason: 'Birthday leave as per company policy.', status: 'rejected', appliedOn: 'May 20', managerRemarks: 'Cannot approve — critical client demo scheduled for May 28. Please reschedule for a non-critical day.' },
]

const STATUS_CFG: Record<LeaveStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:  { label: 'Pending',  color: '#D97706', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.20)'  },
  approved: { label: 'Approved', color: '#0A8A58', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.20)' },
  rejected: { label: 'Rejected', color: '#E84855', bg: 'rgba(232,72,85,0.09)',  border: 'rgba(232,72,85,0.18)'  },
}

const TYPE_COLORS: Record<LeaveType, { color: string; bg: string }> = {
  'Bereavement Holiday': { color: '#6D28D9', bg: 'rgba(109,40,217,0.10)' },
  'Birthday Leave':      { color: '#DB2777', bg: 'rgba(219,39,119,0.10)' },
  'Election Day Leave':  { color: '#0891B2', bg: 'rgba(8,145,178,0.10)'  },
  'Floating Holiday':    { color: '#EA580C', bg: 'rgba(234,88,12,0.10)'  },
  'LWP':                 { color: '#DC2626', bg: 'rgba(220,38,38,0.10)'  },
  'Paternity Leave':     { color: '#2563EB', bg: 'rgba(37,99,235,0.10)'  },
  'Planned Leave':       { color: '#059669', bg: 'rgba(5,150,105,0.10)'  },
  'Unplanned Leave':     { color: '#D97706', bg: 'rgba(217,119,6,0.10)'  },
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


/* ── Leave Detail Modal ── */
function LeaveDetailModal({
  row, onClose, onApprove, onReject,
}: {
  row: LeaveRow
  onClose: () => void
  onApprove: () => void
  onReject: () => void
}) {
  const st = STATUS_CFG[row.status]
  const tc = TYPE_COLORS[row.type]
  const isPending = row.status === 'pending'

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif", padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: 22, width: '100%', maxWidth: 520, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 32px 80px rgba(10,12,28,0.22)' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>Leave Request Details</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>Full submission record</div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: C.hover, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, transition: 'background 0.14s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 24px' }}>

          {/* Employee block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0 16px', borderBottom: `1px solid ${C.border}` }}>
            <img
              src={`https://i.pravatar.cc/150?img=${row.avatar}`}
              alt={row.employee}
              style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '3px solid #F0F2F8', boxShadow: '0 2px 8px rgba(28,32,53,0.10)' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 3 }}>{row.employee}</div>
              <div style={{ fontSize: 12.5, color: C.muted }}>{row.designation} &nbsp;·&nbsp; {row.project}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 9 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: tc.bg, color: tc.color }}>{row.type} Leave</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: C.navy, lineHeight: 1 }}>{row.days}<span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>d</span></div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>Days</div>
            </div>
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, borderBottom: `1px solid ${C.border}` }}>
            {[
              { icon: Calendar,  label: 'From',       value: row.from       },
              { icon: Calendar,  label: 'To',         value: row.to         },
              { icon: Clock,     label: 'Days',        value: `${row.days} day${row.days > 1 ? 's' : ''}` },
              { icon: CalendarDays, label: 'Applied On', value: row.appliedOn  },
            ].map((item, i) => (
              <div
                key={item.label}
                style={{
                  padding: '13px 0',
                  borderRight: i % 2 === 0 ? `1px solid ${C.border}` : 'none',
                  borderBottom: i < 2 ? `1px solid ${C.border}` : 'none',
                  paddingLeft: i % 2 === 0 ? 0 : 20,
                  paddingRight: i % 2 === 0 ? 20 : 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <item.icon size={12} style={{ color: C.muted }} strokeWidth={1.8} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{item.label}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Reason — full text */}
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <MessageSquare size={13} style={{ color: C.muted }} strokeWidth={1.8} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Leave Reason</span>
            </div>
            <p style={{ fontSize: 13.5, color: '#3D4266', lineHeight: 1.75, margin: 0, background: C.surface, borderRadius: 10, padding: '12px 14px', border: `1px solid ${C.border}` }}>
              {row.reason}
            </p>
          </div>

          {/* Manager remarks — only for approved/rejected */}
          {!isPending && row.managerRemarks && (
            <div style={{ padding: '16px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <User size={13} style={{ color: row.status === 'approved' ? '#0A8A58' : '#E84855' }} strokeWidth={1.8} />
                <span style={{ fontSize: 11.5, fontWeight: 700, color: row.status === 'approved' ? '#0A8A58' : '#E84855', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
                  Manager Remarks
                </span>
              </div>
              <p style={{
                fontSize: 13.5, lineHeight: 1.75, margin: 0, borderRadius: 10, padding: '12px 14px',
                color: row.status === 'approved' ? '#064E3B' : '#7A1515',
                background: row.status === 'approved' ? 'rgba(14,168,106,0.06)' : 'rgba(232,72,85,0.05)',
                border: `1px solid ${row.status === 'approved' ? 'rgba(14,168,106,0.18)' : 'rgba(232,72,85,0.15)'}`,
                fontStyle: 'italic',
              }}>
                "{row.managerRemarks}"
              </p>
            </div>
          )}

          {/* Padding bottom */}
          <div style={{ height: 8 }} />
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px 20px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10, flexShrink: 0 }}>
          {isPending ? (
            <>
              <button
                onClick={onClose}
                style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
              >Close</button>
              <button
                onClick={onReject}
                style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: 'rgba(232,72,85,0.09)', color: '#E84855', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.09)' }}
              ><XCircle size={15} strokeWidth={1.8} /> Reject</button>
              <button
                onClick={onApprove}
                style={{ flex: 1.4, height: 44, borderRadius: 12, border: 'none', background: '#0EA86A', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0A8A58' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0EA86A' }}
              ><CheckCircle size={15} strokeWidth={1.8} /> Approve</button>
            </>
          ) : (
            <button
              onClick={onClose}
              style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
            >Close</button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function TeamLeaveRequestsPage() {
  const [tab, setTab]         = useState<LeaveStatus>('pending')
  const [search, setSearch]   = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [rows, setRows]       = useState(LEAVE_ROWS)
  const [modal, setModal]     = useState<RemarksModal>({ id: null, action: null, remarks: '' })
  const [viewRow, setViewRow] = useState<LeaveRow | null>(null)

  function openModal(id: number, action: 'approve' | 'reject') {
    setViewRow(null)
    setModal({ id, action, remarks: '' })
  }

  function closeModal() {
    setModal({ id: null, action: null, remarks: '' })
  }

  function confirmAction() {
    if (modal.id === null || !modal.action) return
    setRows(prev => prev.map(r =>
      r.id === modal.id
        ? { ...r, status: modal.action === 'approve' ? 'approved' : 'rejected', managerRemarks: modal.remarks.trim() || undefined }
        : r
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
  const hasActiveFilter = search || dateFilter

  const COLS = '2fr 1fr 1.2fr 1.2fr 0.6fr 2fr 1fr 1.1fr'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold" style={{ color: C.navy }}>Team Leave Requests</h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#D97706', border: '1px solid rgba(245,158,11,0.22)' }}>
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

      {/* Filter bar */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div style={{ position: 'relative', flexShrink: 0, width: 340 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employee or project..."
              style={{ width: '100%', height: 38, paddingLeft: 34, paddingRight: 12, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, fontFamily: "'DM Sans', system-ui, sans-serif", outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.15s, background 0.15s' }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
            />
          </div>

          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Calendar size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none', zIndex: 1 }} />
            <input
              type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
              style={{ height: 38, paddingLeft: 30, paddingRight: 10, border: `1px solid ${dateFilter ? '#6366F1' : C.border}`, borderRadius: 9, fontSize: 13, color: dateFilter ? C.navy : C.muted, background: dateFilter ? 'rgba(99,102,241,0.05)' : C.surface, fontFamily: "'DM Sans', system-ui, sans-serif", outline: 'none', cursor: 'pointer' }}
              onFocus={e => { e.target.style.borderColor = '#6366F1' }}
              onBlur={e => { if (!dateFilter) e.target.style.borderColor = C.border }}
            />
          </div>

          {hasActiveFilter && (
            <button
              onClick={() => { setSearch(''); setDateFilter('') }}
              style={{ height: 38, padding: '0 12px', borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', fontSize: 12.5, color: C.muted, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
            >Clear</button>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{ height: 34, padding: '0 14px', borderRadius: 8, border: 'none', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', background: tab === t.id ? C.navy : C.hover, color: tab === t.id ? '#fff' : C.muted, transition: 'all 0.15s', fontFamily: 'inherit' }}
                onMouseEnter={e => { if (tab !== t.id) { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { if (tab !== t.id) { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted } }}
              >{t.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        {/* Column headers */}
        <div className="grid" style={{ gridTemplateColumns: COLS, padding: '12px 20px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          {['Employee', 'Type', 'From', 'To', 'Days', 'Reason', 'Status', 'Action'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</span>
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
                style={{ gridTemplateColumns: COLS, padding: '16px 20px', borderBottom: idx < filtered.length - 1 ? `1px solid #F0F2F8` : 'none', background: '#fff', transition: 'background 0.12s' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
              >
                {/* Employee */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={`https://i.pravatar.cc/150?img=${row.avatar}`} alt={row.employee} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${C.border}` }} />
                  <div className="min-w-0">
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.employee}</div>
                    <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{row.designation}</div>
                  </div>
                </div>

                {/* Type */}
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 9px', borderRadius: 7, background: tc.bg, color: tc.color, width: 'fit-content', whiteSpace: 'nowrap' as const }}>{row.type}</span>

                {/* From */}
                <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{row.from}</span>

                {/* To */}
                <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{row.to}</span>

                {/* Days */}
                <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{row.days}d</span>

                {/* Reason — truncated, full text in popup */}
                <div style={{ minWidth: 0, overflow: 'hidden', paddingRight: 8 }}>
                  <span style={{ fontSize: 12.5, color: '#5A6080', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                    {row.reason}
                  </span>
                </div>

                {/* Status */}
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 9px', borderRadius: 7, background: st.bg, color: st.color, border: `1px solid ${st.border}`, whiteSpace: 'nowrap' as const, width: 'fit-content' }}>{st.label}</span>

                {/* Action */}
                <div className="flex items-center gap-1.5">
                  {/* Eye — always visible */}
                  <button
                    onClick={() => setViewRow(row)}
                    title="View Details"
                    style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(99,102,241,0.09)', color: '#4B4ECC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}
                  >
                    <Eye size={14} strokeWidth={1.8} />
                  </button>

                  {/* Approve / Reject — pending only */}
                  {isPending && (
                    <>
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
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}

        {/* Footer */}
        <div style={{ padding: '13px 20px', borderTop: `1px solid ${C.border}`, background: C.surface }}>
          <span style={{ fontSize: 12, color: C.muted }}>
            Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of {rows.length} requests
          </span>
        </div>
      </div>

      {/* ── Leave Detail Popup ── */}
      {viewRow && (
        <LeaveDetailModal
          row={rows.find(r => r.id === viewRow.id) ?? viewRow}
          onClose={() => setViewRow(null)}
          onApprove={() => openModal(viewRow.id, 'approve')}
          onReject={() => openModal(viewRow.id, 'reject')}
        />
      )}

      {/* ── Remarks Modal ── */}
      {modal.id !== null && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          onClick={e => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div style={{ background: '#fff', borderRadius: 20, padding: '32px 28px 24px', width: 420, boxShadow: '0 24px 64px rgba(10,12,28,0.20)' }}>

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
              <button onClick={closeModal} style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: C.hover, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}>
                <X size={14} strokeWidth={2} />
              </button>
            </div>

            <label style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, display: 'block', marginBottom: 7 }}>
              <span className="flex items-center gap-1.5"><MessageSquare size={12} /> Remarks (optional)</span>
            </label>
            <textarea
              value={modal.remarks}
              onChange={e => setModal(p => ({ ...p, remarks: e.target.value }))}
              placeholder={modal.action === 'approve' ? 'Add a note for the employee...' : 'Reason for rejection...'}
              rows={3}
              style={{ width: '100%', padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13, color: C.navy, background: C.hover, outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' as const }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.hover }}
            />

            <div className="flex gap-2.5 mt-5">
              <button onClick={closeModal} style={{ flex: 1, height: 42, borderRadius: 11, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>Cancel</button>
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
