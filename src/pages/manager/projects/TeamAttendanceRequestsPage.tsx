import { useState } from 'react'
import { CheckCircle, XCircle, CalendarDays, MessageSquare, X, Search, Calendar, Eye, Clock, LogIn, LogOut } from 'lucide-react'

type AttStatus  = 'pending' | 'approved' | 'rejected'
type RequestType = 'Correction' | 'Update'

interface AttendanceRow {
  id: number
  employee: string
  avatar: number
  designation: string
  project: string
  date: string
  dateISO: string
  requestType: RequestType   // Correction = was Absent, Update = was Present
  markedIn: string
  markedOut: string
  requestedIn: string
  requestedOut: string
  reason: string
  status: AttStatus
  appliedOn: string
  managerRemarks?: string
}

const ATT_ROWS: AttendanceRow[] = [
  { id: 1, employee: 'Sarah Johnson', avatar: 47, designation: 'Frontend Dev',   project: 'Pulse.AI v2',  date: 'Jul 06, 2026', dateISO: '2026-07-06', requestType: 'Correction', markedIn: '--',    markedOut: '--',    requestedIn: '09:30', requestedOut: '18:30', reason: 'Forgot to punch in — was on an early client call from home and missed marking attendance. Worked the full day as usual.', status: 'pending',  appliedOn: 'Jul 07' },
  { id: 2, employee: 'Mike Chen',     avatar: 33, designation: 'QA Engineer',    project: 'HDFC Portal',  date: 'Jul 03, 2026', dateISO: '2026-07-03', requestType: 'Update',     markedIn: '10:15', markedOut: '18:00', requestedIn: '09:15', requestedOut: '18:45', reason: 'Biometric device did not capture my correct login. Actual start time was 9:15 AM and I stayed till 6:45 PM.', status: 'pending',  appliedOn: 'Jul 04' },
  { id: 3, employee: 'Emma Wilson',   avatar: 44, designation: 'UI/UX Designer', project: 'Pulse.AI v2',  date: 'Jul 02, 2026', dateISO: '2026-07-02', requestType: 'Correction', markedIn: '--',    markedOut: '--',    requestedIn: '09:45', requestedOut: '18:15', reason: 'Was on-site at client office the whole day and could not access the office attendance portal.', status: 'approved', appliedOn: 'Jul 03', managerRemarks: 'Verified with client visit log. Approved.' },
  { id: 4, employee: 'David Brown',   avatar: 38, designation: 'Backend Dev',    project: 'TechCorp ERP', date: 'Jun 30, 2026', dateISO: '2026-06-30', requestType: 'Update',     markedIn: '11:00', markedOut: '17:30', requestedIn: '09:00', requestedOut: '18:30', reason: 'Login/logout times are incorrect due to a VPN issue in the morning.', status: 'rejected', appliedOn: 'Jul 01', managerRemarks: 'No supporting record of early login. Please raise with IT and resubmit.' },
  { id: 5, employee: 'Tom Davis',     avatar: 20, designation: 'Full Stack Dev', project: 'HDFC Portal',  date: 'Jun 28, 2026', dateISO: '2026-06-28', requestType: 'Correction', markedIn: '--',    markedOut: '--',    requestedIn: '09:20', requestedOut: '18:20', reason: 'Attendance system was down that morning; missed the check-in window.', status: 'pending',  appliedOn: 'Jun 29' },
  { id: 6, employee: 'Priya Sharma',  avatar: 10, designation: 'BA Analyst',     project: 'TechCorp ERP', date: 'Jun 27, 2026', dateISO: '2026-06-27', requestType: 'Update',     markedIn: '09:50', markedOut: '17:45', requestedIn: '09:10', requestedOut: '18:40', reason: 'Marked-in time is wrong — I badged in at 9:10 but it recorded 9:50.', status: 'approved', appliedOn: 'Jun 28', managerRemarks: 'Confirmed from door-access logs. Updated.' },
]

const STATUS_CFG: Record<AttStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:  { label: 'Pending',  color: '#D97706', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.20)'  },
  approved: { label: 'Approved', color: '#0A8A58', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.20)' },
  rejected: { label: 'Rejected', color: '#E84855', bg: 'rgba(232,72,85,0.09)',  border: 'rgba(232,72,85,0.18)'  },
}

const TYPE_CFG: Record<RequestType, { label: string; color: string; bg: string }> = {
  Correction: { label: 'Absent · Correction', color: '#E84855', bg: 'rgba(232,72,85,0.09)' },
  Update:     { label: 'Present · Update',     color: '#4B4ECC', bg: 'rgba(99,102,241,0.10)' },
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

const PROJECT_OPTIONS = ['All Projects', 'Pulse.AI v2', 'HDFC Portal', 'TechCorp ERP']

function fmt12(t: string) {
  if (!t || t === '--') return '--'
  const [h, m] = t.split(':').map(Number)
  const ap = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`
}

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
      <svg style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none', width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </div>
  )
}

/* ── Attendance Detail Modal ── */
function AttendanceDetailModal({
  row, onClose, onApprove, onReject,
}: {
  row: AttendanceRow
  onClose: () => void
  onApprove: () => void
  onReject: () => void
}) {
  const st = STATUS_CFG[row.status]
  const tc = TYPE_CFG[row.requestType]
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
            <div style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>Attendance Request Details</div>
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
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: tc.bg, color: tc.color }}>{tc.label}</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: C.navy, lineHeight: 1.2 }}>{row.date}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>Attendance Date</div>
            </div>
          </div>

          {/* Marked vs Requested */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, padding: '16px 0', borderBottom: `1px solid ${C.border}` }}>
            {/* Marked */}
            <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, padding: '12px 14px' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 8 }}>Marked Time</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                <LogIn size={12} style={{ color: C.muted }} /><span style={{ fontSize: 12.5, color: C.muted }}>In</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginLeft: 'auto' }}>{fmt12(row.markedIn)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <LogOut size={12} style={{ color: C.muted }} /><span style={{ fontSize: 12.5, color: C.muted }}>Out</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginLeft: 'auto' }}>{fmt12(row.markedOut)}</span>
              </div>
            </div>
            {/* Requested */}
            <div style={{ borderRadius: 12, border: '1px solid rgba(99,102,241,0.22)', background: 'rgba(99,102,241,0.05)', padding: '12px 14px' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#4B4ECC', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 8 }}>Requested Time</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
                <LogIn size={12} style={{ color: '#4B4ECC' }} /><span style={{ fontSize: 12.5, color: C.muted }}>In</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginLeft: 'auto' }}>{fmt12(row.requestedIn)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <LogOut size={12} style={{ color: '#4B4ECC' }} /><span style={{ fontSize: 12.5, color: C.muted }}>Out</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginLeft: 'auto' }}>{fmt12(row.requestedOut)}</span>
              </div>
            </div>
          </div>

          {/* Meta row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0, borderBottom: `1px solid ${C.border}` }}>
            {[
              { icon: Calendar,     label: 'Attendance Date', value: row.date },
              { icon: CalendarDays, label: 'Applied On',      value: row.appliedOn },
            ].map((item, i) => (
              <div key={item.label} style={{ padding: '13px 0', borderRight: i === 0 ? `1px solid ${C.border}` : 'none', paddingLeft: i === 0 ? 0 : 20, paddingRight: i === 0 ? 20 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <item.icon size={12} style={{ color: C.muted }} strokeWidth={1.8} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{item.label}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Reason */}
          <div style={{ padding: '16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <MessageSquare size={13} style={{ color: C.muted }} strokeWidth={1.8} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Employee Remarks</span>
            </div>
            <p style={{ fontSize: 13.5, color: '#3D4266', lineHeight: 1.75, margin: 0, background: C.surface, borderRadius: 10, padding: '12px 14px', border: `1px solid ${C.border}` }}>
              {row.reason}
            </p>
          </div>

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
export default function TeamAttendanceRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<AttStatus | 'all'>('all')
  const [search, setSearch]   = useState('')
  const [projectFilter, setProjectFilter] = useState('All Projects')
  const [dateFilter, setDateFilter] = useState('')
  const [rows, setRows]       = useState(ATT_ROWS)
  const [viewRow, setViewRow] = useState<AttendanceRow | null>(null)
  const [toast, setToast]     = useState<string | null>(null)

  function act(id: number, action: 'approve' | 'reject') {
    const r = rows.find(x => x.id === id)
    setRows(prev => prev.map(x => x.id === id ? { ...x, status: action === 'approve' ? 'approved' : 'rejected' } : x))
    setViewRow(null)
    if (r) {
      setToast(`${r.employee.split(' ')[0]}'s attendance request ${action === 'approve' ? 'approved' : 'rejected'}`)
      setTimeout(() => setToast(null), 3200)
    }
  }

  const filtered = rows.filter(r => {
    const q = search.toLowerCase()
    const matchSearch  = !q || r.employee.toLowerCase().includes(q) || r.project.toLowerCase().includes(q)
    const matchStatus  = statusFilter === 'all' || r.status === statusFilter
    const matchProject = projectFilter === 'All Projects' || r.project === projectFilter
    const matchDate    = !dateFilter || r.dateISO === dateFilter
    return matchSearch && matchStatus && matchProject && matchDate
  })

  const pendingCount    = rows.filter(r => r.status === 'pending').length
  const hasActiveFilter = search || dateFilter || projectFilter !== 'All Projects' || statusFilter !== 'all'

  const COLS = '1.6fr 1.2fr 1fr 1.3fr 1.4fr 1fr 1.1fr'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold" style={{ color: C.navy }}>Team Attendance Requests</h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#D97706', border: '1px solid rgba(245,158,11,0.22)' }}>
                <Clock size={11} />
                {pendingCount} pending
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: C.muted }}>
            Review attendance correction and update requests submitted by your team members
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employee or project..."
              style={{ width: '100%', height: 38, paddingLeft: 34, paddingRight: 12, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif", outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.15s' }}
              onFocus={e => { e.target.style.borderColor = '#6366F1' }}
              onBlur={e => { e.target.style.borderColor = C.border }}
            />
          </div>

          {/* Status Dropdown */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as AttStatus | 'all')}
              style={{
                height: 38, padding: '0 30px 0 12px',
                border: `1px solid ${C.border}`, borderRadius: 9,
                fontSize: 13, fontWeight: 500, color: statusFilter === 'all' ? C.muted : C.navy,
                background: '#fff', outline: 'none',
                cursor: 'pointer', appearance: 'none',
                fontFamily: "'DM Sans', system-ui, sans-serif",
                minWidth: 130,
              }}
              onFocus={e => { e.target.style.borderColor = '#6366F1' }}
              onBlur={e => { e.target.style.borderColor = C.border }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <svg style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none', width: 12, height: 12 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>

          {/* Project Dropdown */}
          <Dropdown value={projectFilter} options={PROJECT_OPTIONS} onChange={setProjectFilter} />

          {/* Date Filter */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Calendar size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none', zIndex: 1 }} />
            <input
              type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
              style={{ height: 38, paddingLeft: 30, paddingRight: 10, border: `1px solid ${dateFilter ? '#6366F1' : C.border}`, borderRadius: 9, fontSize: 13, color: dateFilter ? C.navy : C.muted, background: dateFilter ? 'rgba(99,102,241,0.05)' : C.surface, fontFamily: "'DM Sans', system-ui, sans-serif", outline: 'none', cursor: 'pointer' }}
              onFocus={e => { e.target.style.borderColor = '#6366F1' }}
              onBlur={e => { if (!dateFilter) e.target.style.borderColor = C.border }}
            />
          </div>

          {/* Clear Button */}
          {hasActiveFilter && (
            <button
              onClick={() => { setSearch(''); setProjectFilter('All Projects'); setDateFilter(''); setStatusFilter('all') }}
              style={{ height: 38, padding: '0 12px', borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', fontSize: 12.5, color: C.muted, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
            >Clear</button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        {/* Column headers */}
        <div className="grid" style={{ gridTemplateColumns: COLS, padding: '12px 20px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          {['Employee', 'Project', 'Date', 'Request Type', 'Requested Time', 'Status', 'Action'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center" style={{ minHeight: 180 }}>
            <p style={{ fontSize: 14, color: C.muted }}>No attendance requests match the selected filter</p>
          </div>
        ) : (
          filtered.map((row, idx) => {
            const st = STATUS_CFG[row.status]
            const tc = TYPE_CFG[row.requestType]
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

                {/* Project */}
                <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{row.project}</span>

                {/* Date */}
                <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{row.date}</span>

                {/* Request Type */}
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 9px', borderRadius: 7, background: tc.bg, color: tc.color, width: 'fit-content', whiteSpace: 'nowrap' as const }}>{tc.label}</span>

                {/* Requested Time */}
                <span style={{ fontSize: 12.5, color: C.navy, fontWeight: 600, whiteSpace: 'nowrap' as const }}>
                  {fmt12(row.requestedIn)} <span style={{ color: C.muted, fontWeight: 400 }}>→</span> {fmt12(row.requestedOut)}
                </span>

                {/* Status */}
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 9px', borderRadius: 7, background: st.bg, color: st.color, border: `1px solid ${st.border}`, whiteSpace: 'nowrap' as const, width: 'fit-content' }}>{st.label}</span>

                {/* Action */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewRow(row)}
                    title="View Details"
                    style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(99,102,241,0.09)', color: '#4B4ECC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}
                  >
                    <Eye size={14} strokeWidth={1.8} />
                  </button>

                  {isPending && (
                    <>
                      <button
                        onClick={() => act(row.id, 'approve')}
                        title="Approve"
                        style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(14,168,106,0.10)', color: '#0A8A58', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.22)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.10)' }}
                      >
                        <CheckCircle size={15} strokeWidth={1.8} />
                      </button>
                      <button
                        onClick={() => act(row.id, 'reject')}
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

      {/* ── Detail Popup ── */}
      {viewRow && (
        <AttendanceDetailModal
          row={rows.find(r => r.id === viewRow.id) ?? viewRow}
          onClose={() => setViewRow(null)}
          onApprove={() => act(viewRow.id, 'approve')}
          onReject={() => act(viewRow.id, 'reject')}
        />
      )}

      {/* ── Success Toast ── */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10000, animation: 'taToast 3.2s ease forwards',
          background: C.navy, color: '#fff', borderRadius: 12,
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(10,12,28,0.22)', fontFamily: "'DM Sans', system-ui, sans-serif", whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(74,222,128,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle size={13} strokeWidth={2.4} style={{ color: '#4ADE80' }} />
          </span>
          <span style={{ fontSize: 13.5, fontWeight: 500 }}>{toast}</span>
        </div>
      )}
      <style>{`@keyframes taToast { 0%{opacity:0;transform:translate(-50%,8px)} 10%{opacity:1;transform:translate(-50%,0)} 88%{opacity:1} 100%{opacity:0} }`}</style>
    </div>
  )
}
