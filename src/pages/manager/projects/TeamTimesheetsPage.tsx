import { useState } from 'react'
import { CheckCircle, XCircle, Clock, ChevronDown, Check, Search, Calendar, Eye, X, Briefcase, Mail, User } from 'lucide-react'

type TSStatus  = 'pending' | 'approved' | 'rejected'
type TaskType  = 'Coding' | 'Design' | 'Code Review' | 'Testing' | 'Documentation'

interface TimesheetRow {
  id: number
  employee: string
  avatar: number
  designation: string
  project: string
  date: string         // 'YYYY-MM-DD' for filter matching
  dateLabel: string    // display label
  hours: number
  description: string
  taskType: TaskType
  status: TSStatus
}

const ROWS: TimesheetRow[] = [
  { id: 1, employee: 'Sarah Johnson', avatar: 47, designation: 'Frontend Dev',   project: 'Pulse.AI v2',  date: '2026-05-21', dateLabel: 'May 21, 2026', hours: 8, taskType: 'Coding',        description: 'Implemented dashboard stat cards, responsive sidebar layout, and mobile breakpoint fixes for the main app shell.', status: 'pending'  },
  { id: 2, employee: 'Mike Chen',     avatar: 33, designation: 'QA Engineer',    project: 'HDFC Portal',  date: '2026-05-21', dateLabel: 'May 21, 2026', hours: 7, taskType: 'Testing',       description: 'End-to-end test coverage for the payment flow module including edge cases for declined cards and session timeouts.', status: 'pending'  },
  { id: 3, employee: 'Emma Wilson',   avatar: 44, designation: 'UI/UX Designer', project: 'Pulse.AI v2',  date: '2026-05-20', dateLabel: 'May 20, 2026', hours: 9, taskType: 'Design',        description: 'Figma component revisions for the manager dashboard, design token updates, and developer handoff documentation.', status: 'pending'  },
  { id: 4, employee: 'David Brown',   avatar: 38, designation: 'Backend Dev',    project: 'TechCorp ERP', date: '2026-05-20', dateLabel: 'May 20, 2026', hours: 8, taskType: 'Coding',        description: 'Database schema migration scripts, index optimisation, and validation tests for the new employee records table.', status: 'approved' },
  { id: 5, employee: 'Lisa Garcia',   avatar: 25, designation: 'DevOps Eng',     project: 'Pulse.AI v2',  date: '2026-05-20', dateLabel: 'May 20, 2026', hours: 6, taskType: 'Code Review',   description: 'CI/CD pipeline review and configuration updates; reviewed 3 open PRs for deployment scripts and infra changes.', status: 'approved' },
  { id: 6, employee: 'Tom Davis',     avatar: 20, designation: 'Full Stack Dev', project: 'HDFC Portal',  date: '2026-05-19', dateLabel: 'May 19, 2026', hours: 8, taskType: 'Coding',        description: 'REST API integration for the account summary endpoint, error handling improvements, and request retry logic.', status: 'approved' },
  { id: 7, employee: 'Priya Sharma',  avatar: 10, designation: 'BA Analyst',     project: 'TechCorp ERP', date: '2026-05-19', dateLabel: 'May 19, 2026', hours: 7, taskType: 'Documentation', description: 'Requirements gathering session with client stakeholders, meeting notes, and updated BRD document for module 3.', status: 'rejected' },
  { id: 8, employee: 'James Wilson',  avatar: 60, designation: 'Backend Dev',    project: 'Pulse.AI v2',  date: '2026-05-18', dateLabel: 'May 18, 2026', hours: 4, taskType: 'Code Review',   description: 'Partial review of authentication service PR — interrupted by unplanned client call. Will complete tomorrow.', status: 'rejected' },
  { id: 9, employee: 'Anjali Singh',  avatar: 36, designation: 'Product Analyst',project: 'HDFC Portal',  date: '2026-05-18', dateLabel: 'May 18, 2026', hours: 8, taskType: 'Documentation', description: 'Sprint 3 retrospective documentation, acceptance criteria updates, and product backlog grooming for upcoming sprint.', status: 'pending'  },
  { id:10, employee: 'Karthik Nair',  avatar: 56, designation: 'Frontend Dev',   project: 'TechCorp ERP', date: '2026-05-17', dateLabel: 'May 17, 2026', hours: 8, taskType: 'Testing',       description: 'User acceptance testing for the ERP dashboard module, bug reporting, and regression suite updates post-fix.', status: 'approved' },
]

const TASK_CONFIG: Record<TaskType, { color: string; bg: string }> = {
  'Coding':        { color: '#4B4ECC', bg: 'rgba(99,102,241,0.10)'  },
  'Design':        { color: '#C026D3', bg: 'rgba(192,38,211,0.09)'  },
  'Code Review':   { color: '#D97706', bg: 'rgba(245,158,11,0.10)'  },
  'Testing':       { color: '#0891B2', bg: 'rgba(8,145,178,0.10)'   },
  'Documentation': { color: '#0A8A58', bg: 'rgba(14,168,106,0.10)'  },
}

const STATUS_CFG: Record<TSStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:  { label: 'Pending',  color: '#D97706', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.20)'  },
  approved: { label: 'Approved', color: '#0A8A58', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.20)'  },
  rejected: { label: 'Rejected', color: '#E84855', bg: 'rgba(232,72,85,0.09)',  border: 'rgba(232,72,85,0.18)'   },
}

const PROJECT_OPTIONS = ['All Projects', 'Pulse.AI v2', 'HDFC Portal', 'TechCorp ERP']
const MEMBER_OPTIONS  = ['All Members', ...ROWS.map(r => r.employee)]
const STATUS_TABS: { id: TSStatus; label: string }[] = [
  { id: 'pending',  label: 'Pending'  },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
]

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

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

export default function TeamTimesheetsPage() {
  const [statusFilter, setStatusFilter] = useState<TSStatus>('pending')
  const [projectFilter, setProjectFilter] = useState('All Projects')
  const [memberFilter, setMemberFilter]   = useState('All Members')
  const [search, setSearch]               = useState('')
  const [dateFilter, setDateFilter]       = useState('')
  const [rows, setRows]     = useState(ROWS)
  const [selected, setSelected] = useState<number[]>([])
  const [viewRow, setViewRow]     = useState<TimesheetRow | null>(null)
  const [rejectRow, setRejectRow] = useState<TimesheetRow | null>(null)

  function updateStatus(id: number, status: TSStatus) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  function bulkApprove() {
    const pendingSelected = selected.filter(id => rows.find(r => r.id === id)?.status === 'pending')
    setRows(prev => prev.map(r => pendingSelected.includes(r.id) ? { ...r, status: 'approved' } : r))
    setSelected([])
  }

  const filtered = rows.filter(r => {
    const q = search.toLowerCase()
    const matchSearch  = !q || r.employee.toLowerCase().includes(q) || r.project.toLowerCase().includes(q)
    const matchStatus  = r.status === statusFilter
    const matchProject = projectFilter === 'All Projects' || r.project === projectFilter
    const matchMember  = memberFilter  === 'All Members'  || r.employee === memberFilter
    const matchDate    = !dateFilter   || r.date === dateFilter
    return matchSearch && matchStatus && matchProject && matchMember && matchDate
  })

  const pendingCount    = rows.filter(r => r.status === 'pending').length
  const approvedCount   = rows.filter(r => r.status === 'approved').length
  const rejectedCount   = rows.filter(r => r.status === 'rejected').length
  const selectedPending = selected.filter(id => rows.find(r => r.id === id)?.status === 'pending')
  const hasActiveFilter = search || dateFilter || projectFilter !== 'All Projects' || memberFilter !== 'All Members'

  /* ── Grid columns ── */
  const COLS = '36px 1.8fr 1.7fr 1fr 0.65fr 2fr 1fr 1fr'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold" style={{ color: C.navy }}>Team Timesheets</h1>
            {pendingCount > 0 && (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(245,158,11,0.12)', color: '#D97706', border: '1px solid rgba(245,158,11,0.22)' }}
              >
                <Clock size={11} />
                {pendingCount} awaiting approval
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: C.muted }}>
            Review and approve timesheet submissions from your project team members
          </p>
        </div>

        {selectedPending.length > 0 && (
          <button
            onClick={bulkApprove}
            className="flex items-center gap-2 rounded-xl border-none cursor-pointer font-semibold"
            style={{ height: 38, padding: '0 18px', fontSize: 13, background: '#0EA86A', color: '#fff', fontFamily: 'inherit', transition: 'background 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0A8A58' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0EA86A' }}
          >
            <Check size={14} />
            Approve Selected ({selectedPending.length})
          </button>
        )}
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
              placeholder="Search project or member..."
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

          <Dropdown value={projectFilter} options={PROJECT_OPTIONS} onChange={setProjectFilter} />
          <Dropdown value={memberFilter}  options={MEMBER_OPTIONS}  onChange={setMemberFilter} width={160} />

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
              onClick={() => { setSearch(''); setProjectFilter('All Projects'); setMemberFilter('All Members'); setDateFilter('') }}
              style={{ height: 38, padding: '0 12px', borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', fontSize: 12.5, color: C.muted, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
            >
              Clear
            </button>
          )}

          {/* Status tabs */}
          <div className="flex items-center gap-1.5 ml-auto">
            {STATUS_TABS.map(s => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                style={{
                  height: 34, padding: '0 14px', borderRadius: 8, border: 'none',
                  fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  background: statusFilter === s.id ? C.navy : C.hover,
                  color: statusFilter === s.id ? '#fff' : C.muted,
                  transition: 'all 0.15s', fontFamily: 'inherit',
                }}
                onMouseEnter={e => { if (statusFilter !== s.id) { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { if (statusFilter !== s.id) { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted } }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        {/* Column headers */}
        <div
          className="grid items-center"
          style={{ gridTemplateColumns: COLS, padding: '12px 20px', background: C.surface, borderBottom: `1px solid ${C.border}` }}
        >
          <div
            onClick={() => {
              const pendingIds = filtered.filter(r => r.status === 'pending').map(r => r.id)
              const allSel = pendingIds.every(id => selected.includes(id))
              if (allSel) setSelected(prev => prev.filter(id => !pendingIds.includes(id)))
              else setSelected(prev => [...new Set([...prev, ...pendingIds])])
            }}
            style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />
          {['Employee', 'Project', 'Date', 'Hours', 'Description', 'Status', 'Action'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: 200 }}>
            <Search size={28} strokeWidth={1.3} style={{ color: '#D0D3E4', marginBottom: 10 }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>No timesheets found</p>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Try adjusting your filters or search query</p>
          </div>
        ) : (
          filtered.map((row, idx) => {
            const st   = STATUS_CFG[row.status]
            const task = TASK_CONFIG[row.taskType]
            const isPending  = row.status === 'pending'
            const isSelected = selected.includes(row.id)

            return (
              <div
                key={row.id}
                className="grid items-start"
                style={{
                  gridTemplateColumns: COLS,
                  padding: '16px 20px',
                  borderBottom: idx < filtered.length - 1 ? `1px solid #F0F2F8` : 'none',
                  background: isSelected ? 'rgba(99,102,241,0.03)' : '#fff',
                  transition: 'background 0.12s',
                  alignItems: 'center',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = C.surface }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = '#fff' }}
              >
                {/* Checkbox */}
                <div
                  onClick={() => isPending && setSelected(prev => prev.includes(row.id) ? prev.filter(x => x !== row.id) : [...prev, row.id])}
                  style={{
                    width: 18, height: 18, borderRadius: 5,
                    border: `1.5px solid ${isSelected ? '#6366F1' : C.border}`,
                    background: isSelected ? '#6366F1' : '#fff',
                    cursor: isPending ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: isPending ? 1 : 0.35, flexShrink: 0, marginTop: 2,
                  }}
                >
                  {isSelected && <Check size={11} style={{ color: '#fff' }} strokeWidth={2.5} />}
                </div>

                {/* Employee */}
                <div className="flex items-center gap-3 min-w-0">
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

                {/* Project + task type badge */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#3D4266', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 5 }}>
                    {row.project}
                  </div>
                  <span
                    style={{
                      fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: task.bg, color: task.color,
                      letterSpacing: '0.03em', whiteSpace: 'nowrap' as const,
                    }}
                  >
                    {row.taskType}
                  </span>
                </div>

                {/* Date */}
                <div>
                  <div style={{ fontSize: 12.5, color: '#3D4266', fontWeight: 500 }}>{row.dateLabel.split(',')[0]}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{row.dateLabel.split(', ')[1]}</div>
                </div>

                {/* Hours */}
                <div
                  style={{
                    fontSize: 15, fontWeight: 800, color: C.navy,
                    display: 'inline-flex', alignItems: 'baseline', gap: 2,
                  }}
                >
                  {row.hours}
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>h</span>
                </div>

                {/* Description */}
                <div style={{ paddingRight: 12, minWidth: 0, overflow: 'hidden' }}>
                  <p style={{ fontSize: 12.5, color: '#5A6080', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.description}
                  </p>
                </div>

                {/* Status */}
                <span
                  style={{
                    fontSize: 11.5, fontWeight: 700, padding: '5px 10px', borderRadius: 7,
                    background: st.bg, color: st.color, border: `1px solid ${st.border}`,
                    whiteSpace: 'nowrap' as const, width: 'fit-content',
                  }}
                >
                  {st.label}
                </span>

                {/* Action */}
                <div className="flex items-center gap-1.5">
                  {/* View button — always visible */}
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
                        onClick={() => updateStatus(row.id, 'approved')}
                        title="Approve"
                        style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(14,168,106,0.10)', color: '#0A8A58', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.22)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.10)' }}
                      >
                        <CheckCircle size={14} strokeWidth={1.8} />
                      </button>
                      <button
                        onClick={() => setRejectRow(row)}
                        title="Reject"
                        style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: 'rgba(232,72,85,0.09)', color: '#E84855', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.20)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.09)' }}
                      >
                        <XCircle size={14} strokeWidth={1.8} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}

        {/* Table footer */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '13px 20px', borderTop: `1px solid ${C.border}`, background: C.surface }}
        >
          <span style={{ fontSize: 12, color: C.muted }}>
            Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of {rows.length} entries
          </span>
          <div className="flex items-center gap-4">
            {[
              { label: 'Approved', value: approvedCount, color: '#0A8A58' },
              { label: 'Pending',  value: pendingCount,  color: '#D97706' },
              { label: 'Rejected', value: rejectedCount, color: '#E84855' },
            ].map(s => (
              <span key={s.label} style={{ fontSize: 12, color: C.muted }}>
                <span style={{ fontWeight: 700, color: s.color }}>{s.value}</span> {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Timesheet Detail Modal ── */}
      {viewRow && (
        <TimesheetDetailModal
          row={viewRow}
          onClose={() => setViewRow(null)}
          onApprove={id => { updateStatus(id, 'approved'); setViewRow(null) }}
          onReject={id => {
            const r = rows.find(x => x.id === id)
            setViewRow(null)
            if (r) setRejectRow(r)
          }}
        />
      )}

      {/* ── Reject Modal ── */}
      {rejectRow && (
        <RejectModal
          row={rejectRow}
          onClose={() => setRejectRow(null)}
          onConfirm={id => { updateStatus(id, 'rejected'); setRejectRow(null) }}
        />
      )}
    </div>
  )
}

/* ══════════════════════════════════════════
   Timesheet Detail Modal
══════════════════════════════════════════ */
function TimesheetDetailModal({
  row, onClose, onApprove, onReject,
}: {
  row: TimesheetRow
  onClose: () => void
  onApprove: (id: number) => void
  onReject: (id: number) => void
}) {
  const st   = STATUS_CFG[row.status]
  const task = TASK_CONFIG[row.taskType]

  const Field = ({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: React.ElementType }) => (
    <div style={{ padding: '13px 0', borderBottom: '1px solid #F3F4F8', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ width: 140, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
        {Icon && <Icon size={13} style={{ color: C.muted }} strokeWidth={1.8} />}
        <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: '#2D3158', lineHeight: 1.55 }}>{value}</div>
    </div>
  )

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.48)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif", padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: 22, width: '100%', maxWidth: 560, boxShadow: '0 32px 80px rgba(10,12,28,0.20)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>Timesheet Detail</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>Full submission record</div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: '#F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.14s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#F0F2F8' }}
          >
            <X size={14} style={{ color: C.muted }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', padding: '0 24px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0 16px', borderBottom: '1px solid #F0F2F8' }}>
            <img src={`https://i.pravatar.cc/150?img=${row.avatar}`} alt="" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '3px solid #F0F2F8', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.navy }}>{row.employee}</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>{row.designation}</div>
              <div className="flex items-center gap-2" style={{ marginTop: 8 }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: task.bg, color: task.color }}>{row.taskType}</span>
                <span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: C.navy, lineHeight: 1 }}>{row.hours}<span style={{ fontSize: 14, fontWeight: 600, color: C.muted }}>h</span></div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 4 }}>Hours Logged</div>
            </div>
          </div>
          <div>
            <Field label="Project"   value={row.project}   icon={Briefcase} />
            <Field label="Date"      value={row.dateLabel} icon={Calendar}  />
            <Field label="Task Type" value={<span style={{ fontSize: 12, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: task.bg, color: task.color }}>{row.taskType}</span>} icon={User} />
            <Field label="Email"     value={<span style={{ color: '#6366F1' }}>{row.employee.toLowerCase().replace(' ', '.').replace(' ', '')}@concert.io</span>} icon={Mail} />
            <Field label="Status"    value={<span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>} />
            <div style={{ padding: '16px 0 20px' }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 10 }}>Description</div>
              <p style={{ fontSize: 13.5, color: '#3D4266', lineHeight: 1.75, margin: 0, background: '#F7F8FC', borderRadius: 10, padding: '14px 16px' }}>{row.description}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px 20px', borderTop: '1px solid #F0F2F8', display: 'flex', gap: 10, flexShrink: 0 }}>
          {row.status === 'pending' ? (
            <>
              <button onClick={onClose} style={{ flex: 1, height: 44, borderRadius: 12, border: '1px solid #E8EAF2', background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EAF2'; e.currentTarget.style.color = C.muted }}>Close</button>
              <button onClick={() => onReject(row.id)} style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: 'rgba(232,72,85,0.09)', color: '#E84855', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'background 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.09)' }}><XCircle size={15} strokeWidth={1.8} /> Reject</button>
              <button onClick={() => onApprove(row.id)} style={{ flex: 1.5, height: 44, borderRadius: 12, border: 'none', background: '#0EA86A', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'background 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = '#0A8A58' }} onMouseLeave={e => { e.currentTarget.style.background = '#0EA86A' }}><CheckCircle size={15} strokeWidth={1.8} /> Approve</button>
            </>
          ) : (
            <button onClick={onClose} style={{ flex: 1, height: 44, borderRadius: 12, border: '1px solid #E8EAF2', background: '#fff', color: C.navy, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC' }} onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>Close</button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Reject Modal
══════════════════════════════════════════ */
function RejectModal({
  row, onClose, onConfirm,
}: {
  row: TimesheetRow
  onClose: () => void
  onConfirm: (id: number) => void
}) {
  const [reason, setReason] = useState('')
  const st   = STATUS_CFG[row.status]
  const task = TASK_CONFIG[row.taskType]

  const Field = ({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: React.ElementType }) => (
    <div style={{ padding: '11px 0', borderBottom: '1px solid #F3F4F8', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ width: 130, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 7 }}>
        {Icon && <Icon size={13} style={{ color: C.muted }} strokeWidth={1.8} />}
        <span style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: '#2D3158', lineHeight: 1.5 }}>{value}</div>
    </div>
  )

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.52)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif", padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: 22, width: '100%', maxWidth: 560, boxShadow: '0 32px 80px rgba(10,12,28,0.22)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '92vh' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(232,72,85,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={18} strokeWidth={1.8} style={{ color: '#E84855' }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>Reject Timesheet</div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>Review details and enter a reason before returning</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: '#F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.14s' }} onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF' }} onMouseLeave={e => { e.currentTarget.style.background = '#F0F2F8' }}>
            <X size={14} style={{ color: C.muted }} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div style={{ overflowY: 'auto', padding: '0 24px', flex: 1 }}>

          {/* Employee summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 0 14px', borderBottom: '1px solid #F0F2F8' }}>
            <img src={`https://i.pravatar.cc/150?img=${row.avatar}`} alt="" style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: '3px solid #F0F2F8', flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>{row.employee}</div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{row.designation}</div>
              <div className="flex items-center gap-2" style={{ marginTop: 7 }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: task.bg, color: task.color }}>{row.taskType}</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' as const, flexShrink: 0 }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.navy, lineHeight: 1 }}>{row.hours}<span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>h</span></div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>Hours Logged</div>
            </div>
          </div>

          {/* Timesheet fields */}
          <div style={{ marginBottom: 4 }}>
            <Field label="Project"   value={row.project}   icon={Briefcase} />
            <Field label="Date"      value={row.dateLabel} icon={Calendar}  />
            <Field label="Task Type" value={<span style={{ fontSize: 11.5, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: task.bg, color: task.color }}>{row.taskType}</span>} icon={User} />
            <Field label="Email"     value={<span style={{ color: '#6366F1' }}>{row.employee.toLowerCase().replace(' ', '.').replace(' ', '')}@concert.io</span>} icon={Mail} />
          </div>

          {/* Description */}
          <div style={{ padding: '14px 0 16px', borderBottom: '1px solid #F0F2F8' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 8 }}>Description</div>
            <p style={{ fontSize: 13, color: '#3D4266', lineHeight: 1.75, margin: 0, background: '#F7F8FC', borderRadius: 10, padding: '12px 14px' }}>{row.description}</p>
          </div>

          {/* Rejection reason */}
          <div style={{ padding: '16px 0 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
              <XCircle size={13} strokeWidth={1.8} style={{ color: '#E84855' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#E84855', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Rejection Reason</span>
            </div>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Enter the reason for returning this timesheet to the employee…"
              rows={4}
              autoFocus
              style={{
                width: '100%', borderRadius: 12, resize: 'none',
                border: '1.5px solid rgba(232,72,85,0.28)',
                padding: '12px 14px', fontSize: 13.5, color: '#3D4266',
                lineHeight: 1.7, fontFamily: "'DM Sans', system-ui, sans-serif",
                background: 'rgba(232,72,85,0.025)', outline: 'none',
                boxSizing: 'border-box', transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = '#E84855' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(232,72,85,0.28)' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px 20px', borderTop: '1px solid #F0F2F8', display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, height: 44, borderRadius: 12, border: '1px solid #E8EAF2', background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EAF2'; e.currentTarget.style.color = C.muted }}
          >
            Close
          </button>
          <button
            onClick={() => onConfirm(row.id)}
            disabled={!reason.trim()}
            style={{
              flex: 2, height: 44, borderRadius: 12, border: 'none',
              background: reason.trim() ? '#E84855' : 'rgba(232,72,85,0.25)',
              color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: reason.trim() ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { if (reason.trim()) e.currentTarget.style.background = '#D43F4B' }}
            onMouseLeave={e => { if (reason.trim()) e.currentTarget.style.background = '#E84855' }}
          >
            <XCircle size={15} strokeWidth={1.8} /> Return Timesheet
          </button>
        </div>
      </div>
    </div>
  )
}
