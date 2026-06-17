import { useState } from 'react'
import {
  Search, ChevronDown, Eye, Calendar,
  User, X, MessageSquare,
} from 'lucide-react'

type LeaveStatus = 'Pending' | 'Approved' | 'Rejected'
type LeaveType   = 'Bereavement Holiday' | 'Birthday Leave' | 'Election Day Leave' | 'Floating Holiday' | 'LWP' | 'Paternity Leave' | 'Planned Leave' | 'Unplanned Leave'

interface LeaveRequest {
  id: number
  employee: string; avatar: number; empId: string; department: string
  reportingManager: string; managerAvatar: number
  project: string
  leaveType: LeaveType
  fromDate: string; toDate: string; days: number
  appliedDate: string
  status: LeaveStatus
  reason: string
  managerRemark: string
  reviewedDate: string
}

const DATA: LeaveRequest[] = [
  {
    id: 1, employee: 'Sarah Johnson', avatar: 47, empId: 'EMP-0047', department: 'Engineering',
    reportingManager: 'Rohan Mehta', managerAvatar: 29, project: 'Pulse.AI v2',
    leaveType: 'Planned Leave', fromDate: '2026-05-26', toDate: '2026-05-28', days: 3,
    appliedDate: 'May 20, 2026', status: 'Pending',
    reason: 'Family function — attending my sister\'s wedding ceremony in Chennai.',
    managerRemark: '', reviewedDate: '',
  },
  {
    id: 2, employee: 'Mike Chen', avatar: 33, empId: 'EMP-0033', department: 'QA & Testing',
    reportingManager: 'Priya Sharma', managerAvatar: 10, project: 'HDFC Portal',
    leaveType: 'Unplanned Leave', fromDate: '2026-05-20', toDate: '2026-05-21', days: 2,
    appliedDate: 'May 19, 2026', status: 'Approved',
    reason: 'Fever and mild flu symptoms, doctor advised rest for 2 days.',
    managerRemark: 'Approved. Please share the medical certificate when you return.', reviewedDate: 'May 19, 2026',
  },
  {
    id: 3, employee: 'Emma Wilson', avatar: 44, empId: 'EMP-0044', department: 'Design',
    reportingManager: 'Rohan Mehta', managerAvatar: 29, project: 'Pulse.AI v2',
    leaveType: 'Floating Holiday', fromDate: '2026-05-22', toDate: '2026-05-23', days: 2,
    appliedDate: 'May 18, 2026', status: 'Approved',
    reason: 'Personal errands and home relocation assistance.',
    managerRemark: 'Approved. Ensure the Figma deliverables are handed off before you leave.', reviewedDate: 'May 18, 2026',
  },
  {
    id: 4, employee: 'Arjun Patel', avatar: 52, empId: 'EMP-0052', department: 'QA & Testing',
    reportingManager: 'Priya Sharma', managerAvatar: 10, project: 'TechCorp ERP',
    leaveType: 'Planned Leave', fromDate: '2026-06-02', toDate: '2026-06-05', days: 4,
    appliedDate: 'May 22, 2026', status: 'Pending',
    reason: 'Pre-planned vacation with family. Flight tickets already booked.',
    managerRemark: '', reviewedDate: '',
  },
  {
    id: 5, employee: 'Anjali Singh', avatar: 36, empId: 'EMP-0036', department: 'Product',
    reportingManager: 'Priya Sharma', managerAvatar: 10, project: 'HDFC Portal',
    leaveType: 'Paternity Leave', fromDate: '2026-06-09', toDate: '2026-06-13', days: 5,
    appliedDate: 'May 15, 2026', status: 'Approved',
    reason: 'Paternity leave for newborn care.',
    managerRemark: 'Approved. Transition your sprint tasks to Tom before leaving.', reviewedDate: 'May 16, 2026',
  },
  {
    id: 6, employee: 'James Wilson', avatar: 60, empId: 'EMP-0060', department: 'Engineering',
    reportingManager: 'David Brown', managerAvatar: 38, project: 'Pulse.AI v2',
    leaveType: 'Unplanned Leave', fromDate: '2026-05-18', toDate: '2026-05-18', days: 1,
    appliedDate: 'May 18, 2026', status: 'Rejected',
    reason: 'Feeling unwell in the morning.',
    managerRemark: 'Rejected — no prior notice and critical deployment was scheduled for today. Please plan ahead.', reviewedDate: 'May 18, 2026',
  },
  {
    id: 7, employee: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', department: 'Design',
    reportingManager: 'Rohan Mehta', managerAvatar: 29, project: 'HDFC Portal',
    leaveType: 'Birthday Leave', fromDate: '2026-06-10', toDate: '2026-06-10', days: 1,
    appliedDate: 'May 23, 2026', status: 'Pending',
    reason: 'Birthday leave as per company policy.',
    managerRemark: '', reviewedDate: '',
  },
  {
    id: 8, employee: 'Karthik Nair', avatar: 56, empId: 'EMP-0056', department: 'Engineering',
    reportingManager: 'David Brown', managerAvatar: 38, project: 'TechCorp ERP',
    leaveType: 'Planned Leave', fromDate: '2026-06-16', toDate: '2026-06-20', days: 5,
    appliedDate: 'May 10, 2026', status: 'Approved',
    reason: 'Pre-planned leave — visiting parents in Kerala.',
    managerRemark: 'Approved. Early notice appreciated. Ensure sprint tasks are completed.', reviewedDate: 'May 11, 2026',
  },
  {
    id: 9, employee: 'Lisa Garcia', avatar: 25, empId: 'EMP-0025', department: 'DevOps',
    reportingManager: 'David Brown', managerAvatar: 38, project: 'Pulse.AI v2',
    leaveType: 'Bereavement Holiday', fromDate: '2026-05-28', toDate: '2026-05-29', days: 2,
    appliedDate: 'May 24, 2026', status: 'Pending',
    reason: 'Bereavement leave due to family loss.',
    managerRemark: '', reviewedDate: '',
  },
  {
    id: 10, employee: 'Tom Davis', avatar: 20, empId: 'EMP-0020', department: 'Engineering',
    reportingManager: 'David Brown', managerAvatar: 38, project: 'HDFC Portal',
    leaveType: 'Unplanned Leave', fromDate: '2026-05-15', toDate: '2026-05-15', days: 1,
    appliedDate: 'May 15, 2026', status: 'Approved',
    reason: 'Sudden migraine — unable to work.',
    managerRemark: 'Approved. Rest well and recover.', reviewedDate: 'May 15, 2026',
  },
]

/* ── configs ── */
const STATUS_CFG: Record<LeaveStatus, { color: string; bg: string; border: string; bar: string; dot: string }> = {
  Pending:  { color: '#D97706', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.22)',  bar: '#F59E0B', dot: '#F59E0B' },
  Approved: { color: '#0A8A58', bg: 'rgba(14,168,106,0.08)', border: 'rgba(14,168,106,0.22)', bar: '#16A34A', dot: '#16A34A' },
  Rejected: { color: '#E84855', bg: 'rgba(232,72,85,0.08)',  border: 'rgba(232,72,85,0.22)',  bar: '#E84855', dot: '#E84855' },
}

const TYPE_CFG: Record<LeaveType, { color: string; bg: string; border: string; short: string }> = {
  'Bereavement Holiday': { color: '#6D28D9', bg: 'rgba(109,40,217,0.08)', border: 'rgba(109,40,217,0.18)', short: 'BH'  },
  'Birthday Leave':      { color: '#DB2777', bg: 'rgba(219,39,119,0.08)', border: 'rgba(219,39,119,0.18)', short: 'BL'  },
  'Election Day Leave':  { color: '#0891B2', bg: 'rgba(8,145,178,0.08)',  border: 'rgba(8,145,178,0.18)',  short: 'EDL' },
  'Floating Holiday':    { color: '#EA580C', bg: 'rgba(234,88,12,0.08)',  border: 'rgba(234,88,12,0.18)',  short: 'FH'  },
  'LWP':                 { color: '#DC2626', bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.18)',  short: 'LWP' },
  'Paternity Leave':     { color: '#2563EB', bg: 'rgba(37,99,235,0.08)',  border: 'rgba(37,99,235,0.18)',  short: 'PAT' },
  'Planned Leave':       { color: '#059669', bg: 'rgba(5,150,105,0.08)',  border: 'rgba(5,150,105,0.18)',  short: 'PL'  },
  'Unplanned Leave':     { color: '#D97706', bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.18)',  short: 'UPL' },
}

const TABS: { id: LeaveStatus; label: string }[] = [
  { id: 'Pending',  label: 'Pending'  },
  { id: 'Approved', label: 'Approved' },
  { id: 'Rejected', label: 'Rejected' },
]

const PROJECTS = ['All Projects',  'Pulse.AI v2', 'HDFC Portal', 'TechCorp ERP']
const MANAGERS = ['All Managers',  ...Array.from(new Set(DATA.map(d => d.reportingManager)))]

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

function fmt(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function Dropdown({ value, options, onChange, minW = 140 }: { value: string; options: string[]; onChange: (v: string) => void; minW?: number }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          height: 36, padding: '0 28px 0 11px',
          border: `1px solid ${C.border}`, borderRadius: 8,
          fontSize: 12.5, fontWeight: 500,
          color: value.startsWith('All') ? C.muted : C.navy,
          background: '#fff', outline: 'none', cursor: 'pointer',
          appearance: 'none', fontFamily: "'DM Sans',system-ui,sans-serif", minWidth: minW,
        }}
        onFocus={e => { e.target.style.borderColor = '#7C3AED' }}
        onBlur={e  => { e.target.style.borderColor = C.border  }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
    </div>
  )
}

function DateInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <Calendar size={12} style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
      <input type="date" value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          height: 36, paddingLeft: 28, paddingRight: 10,
          border: `1px solid ${focus ? '#7C3AED' : C.border}`, borderRadius: 8,
          fontSize: 12.5, color: value ? C.navy : C.muted,
          background: '#fff', outline: 'none', cursor: 'pointer',
          fontFamily: "'DM Sans',system-ui,sans-serif", width: 138,
        }}
        placeholder={placeholder}
      />
    </div>
  )
}

/* ── View Detail Modal ── */
function ViewModal({ item, onClose }: { item: LeaveRequest; onClose: () => void }) {
  const sc = STATUS_CFG[item.status]
  const tc = TYPE_CFG[item.leaveType]
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(10,12,28,0.52)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'DM Sans',system-ui,sans-serif",
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 20, width: 560,
        boxShadow: '0 28px 72px rgba(10,12,28,0.20)',
        overflow: 'hidden', animation: 'lrModal 0.18s ease',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, background: C.surface, display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={`https://i.pravatar.cc/44?img=${item.avatar}`} alt={item.employee}
            style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.navy }}>{item.employee}</p>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: C.muted }}>{item.empId} · {item.department} · {item.project}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              padding: '4px 12px', borderRadius: 7, fontSize: 12.5, fontWeight: 700,
              color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
              {item.status}
            </span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', padding: 4 }}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Leave Details */}
          <div style={{ background: C.surface, borderRadius: 12, padding: '16px 18px' }}>
            <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Leave Details</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>
              {[
                { label: 'Leave Type',  value: <span style={{ padding: '2px 9px', borderRadius: 5, fontSize: 12.5, fontWeight: 600, color: tc.color, background: tc.bg, border: `1px solid ${tc.border}` }}>{item.leaveType}</span> },
                { label: 'Duration',    value: `${item.days} day${item.days !== 1 ? 's' : ''}` },
                { label: 'From',        value: fmt(item.fromDate) },
                { label: 'To',          value: fmt(item.toDate)   },
                { label: 'Applied On',  value: item.appliedDate   },
                { label: 'Project',     value: item.project       },
              ].map(r => (
                <div key={r.label}>
                  <p style={{ margin: '0 0 3px', fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{r.label}</p>
                  {typeof r.value === 'string'
                    ? <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.navy }}>{r.value}</p>
                    : r.value}
                </div>
              ))}
            </div>
          </div>

          {/* Employee Reason */}
          <div style={{ background: C.surface, borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <MessageSquare size={13} color={C.muted} />
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employee Reason</p>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: '#3D4266', lineHeight: 1.6 }}>"{item.reason}"</p>
          </div>

          {/* Reporting Manager */}
          <div style={{ background: C.surface, borderRadius: 12, padding: '14px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
              <User size={13} color={C.muted} />
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reporting Manager</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <img src={`https://i.pravatar.cc/32?img=${item.managerAvatar}`} alt={item.reportingManager}
                style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.navy }}>{item.reportingManager}</p>
                <p style={{ margin: '1px 0 0', fontSize: 11.5, color: C.muted }}>
                  {item.reviewedDate ? `Reviewed on ${item.reviewedDate}` : 'Awaiting review'}
                </p>
              </div>
            </div>
            {item.managerRemark ? (
              <div style={{ padding: '10px 13px', background: '#fff', borderRadius: 9, border: `1px solid ${C.border}` }}>
                <p style={{ margin: 0, fontSize: 13, color: '#3D4266', lineHeight: 1.6, fontStyle: 'italic' }}>"{item.managerRemark}"</p>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 13, color: C.muted, fontStyle: 'italic' }}>No remarks yet — awaiting manager review.</p>
            )}
          </div>
        </div>

        <div style={{ padding: '0 24px 22px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            height: 40, padding: '0 24px', borderRadius: 10, fontSize: 13.5, fontWeight: 600,
            border: `1px solid ${C.border}`, background: '#fff', color: C.navy, cursor: 'pointer',
          }}>Close</button>
        </div>
      </div>
    </div>
  )
}

/* ─────── Main Page ─────── */
export default function AllLeaveRequestsPage() {
  const [tab,       setTab]       = useState<LeaveStatus>('Pending')
  const [search,    setSearch]    = useState('')
  const [project,   setProject]   = useState('All Projects')
  const [manager,   setManager]   = useState('All Managers')
  const [fromDate,  setFromDate]  = useState('')
  const [sFocus,    setSFocus]    = useState(false)
  const [viewItem,  setViewItem]  = useState<LeaveRequest | null>(null)

  const filtered = DATA.filter(r => {
    const q  = search.toLowerCase()
    const ms = !q || r.employee.toLowerCase().includes(q) || r.project.toLowerCase().includes(q) || r.empId.toLowerCase().includes(q)
    const mt = r.status === tab
    const mp = project   === 'All Projects' || r.project          === project
    const mg = manager   === 'All Managers' || r.reportingManager === manager
    const mf = !fromDate || r.fromDate >= fromDate
    return ms && mt && mp && mg && mf
  })

  const counts: Record<LeaveStatus, number> = {
    Pending:  DATA.filter(r => r.status === 'Pending').length,
    Approved: DATA.filter(r => r.status === 'Approved').length,
    Rejected: DATA.filter(r => r.status === 'Rejected').length,
  }

  const anyFilter = !!(search || project !== 'All Projects' || manager !== 'All Managers' || fromDate)

  function clearAll() {
    setSearch(''); setProject('All Projects')
    setManager('All Managers'); setFromDate('')
  }

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <style>{`
        .lr-card { transition: box-shadow 0.15s, border-color 0.15s; }
        .lr-card:hover { box-shadow: 0 4px 18px rgba(28,32,53,0.08) !important; border-color: #D1D4E4 !important; }
        @keyframes lrModal { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>All Leave Requests</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13.5, color: '#787878', fontWeight: 500, lineHeight: 1.65 }}>
          View and monitor all employee leave requests across the organisation. Filter by project, leave type, or date. Click any request to review the full details and manager remarks.
        </p>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {TABS.map(t => {
          const isActive = tab === t.id
          const sc = STATUS_CFG[t.id]
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{
                height: 36, padding: '0 16px', borderRadius: 9, cursor: 'pointer',
                fontSize: 13, fontWeight: 600,
                border: `1px solid ${isActive ? sc.border : C.border}`,
                background: isActive ? sc.bg : '#fff',
                color: isActive ? sc.color : C.muted,
                display: 'flex', alignItems: 'center', gap: 7,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? sc.dot : C.muted, flexShrink: 0 }} />
              {t.label}
              <span style={{
                minWidth: 20, height: 18, borderRadius: 5, padding: '0 5px',
                fontSize: 11, fontWeight: 700,
                background: isActive ? 'rgba(255,255,255,0.22)' : C.hover,
                color: isActive ? sc.color : C.muted,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>{counts[t.id]}</span>
            </button>
          )
        })}
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '13px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSFocus(true)} onBlur={() => setSFocus(false)}
              placeholder="Search employee, project, ID…"
              style={{
                width: '100%', height: 36, paddingLeft: 30, paddingRight: 10,
                border: `1px solid ${sFocus ? '#7C3AED' : C.border}`, borderRadius: 8,
                fontSize: 13, color: C.navy, background: '#fff', outline: 'none',
                fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box',
              }}
            />
          </div>

          <Dropdown value={project}   options={PROJECTS} onChange={setProject}   minW={138} />
          <Dropdown value={manager}   options={MANAGERS} onChange={setManager}   minW={152} />
          <DateInput value={fromDate} onChange={setFromDate} placeholder="Leave date" />

          {anyFilter && (
            <button onClick={clearAll}
              style={{ height: 36, padding: '0 13px', borderRadius: 8, fontSize: 12.5, fontWeight: 500, border: `1px solid ${C.border}`, background: C.hover, color: C.muted, cursor: 'pointer', flexShrink: 0 }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Result count */}
      <p style={{ margin: '0 0 12px', fontSize: 12.5, color: C.muted }}>
        Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of <strong style={{ color: C.navy }}>{counts[tab]}</strong> {tab.toLowerCase()} requests
      </p>

      {/* Leave request cards */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: `1px dashed ${C.border}`, borderRadius: 16, padding: '52px 20px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 14, color: C.muted }}>No leave requests match your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(r => {
            const sc = STATUS_CFG[r.status]
            const tc = TYPE_CFG[r.leaveType]
            return (
              <div key={r.id} className="lr-card" style={{
                background: '#fff', border: `1px solid ${C.border}`,
                borderRadius: 16, overflow: 'hidden',
                display: 'flex',
              }}>

                <div style={{ flex: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', minWidth: 0 }}>

                  {/* Employee */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '0 0 210px' }}>
                    <img src={`https://i.pravatar.cc/38?img=${r.avatar}`} alt={r.employee}
                      style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.employee}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11.5, color: C.muted }}>{r.department}</p>
                    </div>
                  </div>

                  <div style={{ width: 1, height: 36, background: C.border, flexShrink: 0, margin: '0 24px' }} />

                  {/* Leave type + dates */}
                  <div style={{ flex: '0 0 180px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '2px 9px', borderRadius: 5, marginBottom: 5,
                      fontSize: 11.5, fontWeight: 700,
                      color: tc.color, background: tc.bg, border: `1px solid ${tc.border}`,
                    }}>
                      <span style={{ fontSize: 10, fontWeight: 800 }}>{tc.short}</span>
                      {r.leaveType}
                    </span>
                    <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: C.navy }}>
                      {fmt(r.fromDate)}{r.days > 1 ? ` → ${fmt(r.toDate)}` : ''}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: 11.5, color: C.muted }}>{r.days} day{r.days !== 1 ? 's' : ''}</p>
                  </div>

                  <div style={{ width: 1, height: 36, background: C.border, flexShrink: 0, margin: '0 24px' }} />

                  {/* Project */}
                  <div style={{ flex: '0 0 140px' }}>
                    <p style={{ margin: '0 0 3px', fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Project</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.navy }}>{r.project}</p>
                  </div>

                  <div style={{ width: 1, height: 36, background: C.border, flexShrink: 0, margin: '0 24px' }} />

                  {/* Reporting Manager */}
                  <div style={{ flex: '0 0 150px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Manager</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <img src={`https://i.pravatar.cc/22?img=${r.managerAvatar}`} alt={r.reportingManager}
                        style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0 }} />
                      <p style={{ margin: 0, fontSize: 12.5, fontWeight: 500, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.reportingManager}</p>
                    </div>
                  </div>

                  <div style={{ width: 1, height: 36, background: C.border, flexShrink: 0, margin: '0 24px' }} />

                  {/* Applied date */}
                  <div style={{ flex: '0 0 110px' }}>
                    <p style={{ margin: '0 0 3px', fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Applied</p>
                    <p style={{ margin: 0, fontSize: 12.5, color: C.navy }}>{r.appliedDate}</p>
                  </div>

                  {/* Right: status + action */}
                  <div style={{ marginLeft: 'auto', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '4px 11px', borderRadius: 7,
                      fontSize: 12.5, fontWeight: 700,
                      color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
                      {r.status}
                    </span>

                    <button onClick={() => setViewItem(r)}
                      style={{
                        height: 34, padding: '0 14px', borderRadius: 9,
                        fontSize: 12.5, fontWeight: 600,
                        border: `1px solid ${C.border}`, background: C.surface,
                        color: C.navy, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6,
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.color = '#7C3AED' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.navy  }}
                    >
                      <Eye size={13} /> View
                    </button>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}

      {viewItem && <ViewModal item={viewItem} onClose={() => setViewItem(null)} />}
    </div>
  )
}
