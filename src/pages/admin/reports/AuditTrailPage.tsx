import { useState, useMemo } from 'react'
import { Search, Download, ChevronDown, ChevronUp, X } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
type Severity = 'critical' | 'high' | 'medium' | 'low'
type Module =
  | 'User Management' | 'Leave Policy' | 'Timesheet Policies'
  | 'Department' | 'Designation' | 'System Settings'
  | 'Org Profile' | 'Working Hours' | 'Announcements'
  | 'Role & Access' | 'Reports'
type Action =
  | 'Created' | 'Updated' | 'Deleted' | 'Enabled' | 'Disabled'
  | 'Published' | 'Exported' | 'Changed' | 'Deactivated' | 'Reset'

interface Change     { field: string; before: string; after: string }
interface AuditActor { name: string; role: string; avatar: number }
interface AuditEntry {
  id: string; ts: string; date: string; time: string
  actor: AuditActor; action: Action; module: Module
  target: string; description: string; severity: Severity
  changes?: Change[]
}

// ── Design tokens ──────────────────────────────────────────────────────────────
const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', surface: '#F7F8FC' }

const SEV: Record<Severity, { color: string; bg: string; border: string; label: string; line: string }> = {
  critical: { color: '#DC2626', bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.22)',  label: 'Critical', line: 'rgba(220,38,38,0.30)'  },
  high:     { color: '#D97706', bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.22)',  label: 'High',     line: 'rgba(217,119,6,0.30)'  },
  medium:   { color: '#5B5FDE', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.22)', label: 'Medium',   line: 'rgba(99,102,241,0.30)' },
  low:      { color: '#059669', bg: 'rgba(5,150,105,0.08)',  border: 'rgba(5,150,105,0.22)',  label: 'Low',      line: 'rgba(5,150,105,0.30)'  },
}

const MOD: Record<Module, { color: string; bg: string }> = {
  'User Management':    { color: '#5B5FDE', bg: 'rgba(99,102,241,0.10)'  },
  'Leave Policy':       { color: '#0A8A58', bg: 'rgba(14,168,106,0.10)'  },
  'Timesheet Policies': { color: '#D97706', bg: 'rgba(217,119,6,0.10)'   },
  'Department':         { color: '#2563EB', bg: 'rgba(37,99,235,0.10)'   },
  'Designation':        { color: '#7C3AED', bg: 'rgba(124,58,237,0.10)'  },
  'System Settings':    { color: '#475569', bg: 'rgba(71,85,105,0.10)'   },
  'Org Profile':        { color: '#0D9488', bg: 'rgba(13,148,136,0.10)'  },
  'Working Hours':      { color: '#0891B2', bg: 'rgba(8,145,178,0.10)'   },
  'Announcements':      { color: '#DB2777', bg: 'rgba(219,39,119,0.10)'  },
  'Role & Access':      { color: '#DC2626', bg: 'rgba(220,38,38,0.10)'   },
  'Reports':            { color: '#6B7280', bg: 'rgba(107,114,128,0.10)' },
}

const ACT: Record<Action, { color: string; bg: string }> = {
  Created:     { color: '#059669', bg: 'rgba(5,150,105,0.10)'   },
  Updated:     { color: '#5B5FDE', bg: 'rgba(99,102,241,0.10)'  },
  Deleted:     { color: '#DC2626', bg: 'rgba(220,38,38,0.10)'   },
  Enabled:     { color: '#0D9488', bg: 'rgba(13,148,136,0.10)'  },
  Disabled:    { color: '#D97706', bg: 'rgba(217,119,6,0.10)'   },
  Published:   { color: '#2563EB', bg: 'rgba(37,99,235,0.10)'   },
  Exported:    { color: '#6B7280', bg: 'rgba(107,114,128,0.10)' },
  Changed:     { color: '#7C3AED', bg: 'rgba(124,58,237,0.10)'  },
  Deactivated: { color: '#DC2626', bg: 'rgba(220,38,38,0.10)'   },
  Reset:       { color: '#D97706', bg: 'rgba(217,119,6,0.10)'   },
}

// ── Actors ─────────────────────────────────────────────────────────────────────
const A = {
  priya: { name: 'Priya Mehta',   role: 'Super Admin', avatar: 10 },
  arjun: { name: 'Arjun Kumar',   role: 'Admin',       avatar: 52 },
  kavi:  { name: 'Kavitha Reddy', role: 'HR Admin',    avatar: 21 },
}

// ── Audit data ─────────────────────────────────────────────────────────────────
const DATA: AuditEntry[] = [
  { id:'a01', ts:'2026-06-05T17:42', date:'Jun 5, 2026',  time:'5:42 PM',  actor:A.priya, action:'Updated',     module:'Leave Policy',       target:'Planned Leave',               description:'Updated annual days for Planned Leave type',                          severity:'high',     changes:[{field:'Annual Days',          before:'15 days',           after:'18 days'}] },
  { id:'a02', ts:'2026-06-05T15:18', date:'Jun 5, 2026',  time:'3:18 PM',  actor:A.arjun, action:'Created',     module:'User Management',    target:'Vikram Bose',                  description:'Added new employee Vikram Bose to the system',                        severity:'medium',   changes:[{field:'Role',                 before:'—',                 after:'Employee'},{field:'Department',before:'—',after:'Engineering'}] },
  { id:'a03', ts:'2026-06-05T14:05', date:'Jun 5, 2026',  time:'2:05 PM',  actor:A.priya, action:'Updated',     module:'Timesheet Policies', target:'Submission Schedule',          description:'Changed same-day EOD deadline for daily timesheet submission',         severity:'high',     changes:[{field:'EOD Deadline',         before:'6:00 PM',           after:'11:00 PM'}] },
  { id:'a04', ts:'2026-06-05T11:32', date:'Jun 5, 2026',  time:'11:32 AM', actor:A.kavi,  action:'Published',   module:'Announcements',      target:'Q2 Performance Reviews',       description:'Published announcement: Q2 Performance Reviews starting June 15',     severity:'low' },
  { id:'a05', ts:'2026-06-05T10:14', date:'Jun 5, 2026',  time:'10:14 AM', actor:A.arjun, action:'Changed',     module:'Role & Access',      target:'Dinesh Kumar',                 description:'Changed system role for Dinesh Kumar',                                severity:'critical', changes:[{field:'Role',                 before:'Employee',          after:'Manager'}] },
  { id:'a06', ts:'2026-06-05T09:50', date:'Jun 5, 2026',  time:'9:50 AM',  actor:A.priya, action:'Created',     module:'Designation',        target:'Cloud Architect',              description:'Added new designation Cloud Architect to the system',                 severity:'low' },
  { id:'a07', ts:'2026-06-04T16:48', date:'Jun 4, 2026',  time:'4:48 PM',  actor:A.priya, action:'Updated',     module:'Org Profile',        target:'Concert IDC',                  description:'Updated organisation GST registration number',                        severity:'medium',   changes:[{field:'GST Number',           before:'29AABCC1234D1Z5',   after:'29AABCC1234D2Z6'}] },
  { id:'a08', ts:'2026-06-04T15:22', date:'Jun 4, 2026',  time:'3:22 PM',  actor:A.arjun, action:'Deleted',     module:'Designation',        target:'Junior Associate',             description:'Removed designation Junior Associate from the system',                severity:'critical', changes:[{field:'Status',               before:'Active (3 employees)',after:'Deleted'}] },
  { id:'a09', ts:'2026-06-04T13:05', date:'Jun 4, 2026',  time:'1:05 PM',  actor:A.kavi,  action:'Enabled',     module:'Leave Policy',       target:'Probation Restriction',        description:'Enabled probation restriction — paid leave blocked during probation', severity:'high',     changes:[{field:'Probation Restriction',before:'Disabled',          after:'Enabled'},{field:'Probation Period',before:'—',after:'3 months'}] },
  { id:'a10', ts:'2026-06-04T11:40', date:'Jun 4, 2026',  time:'11:40 AM', actor:A.priya, action:'Updated',     module:'Working Hours',      target:'Office Hours',                 description:'Updated standard office working end time',                            severity:'high',     changes:[{field:'End Time',             before:'6:00 PM',           after:'7:00 PM'},{field:'Hours / Day',before:'9 hrs',after:'10 hrs'}] },
  { id:'a11', ts:'2026-06-04T09:28', date:'Jun 4, 2026',  time:'9:28 AM',  actor:A.arjun, action:'Created',     module:'Department',         target:'Data Science',                 description:'Created new department Data Science with Vikram Bose as head',        severity:'medium' },
  { id:'a12', ts:'2026-06-03T17:15', date:'Jun 3, 2026',  time:'5:15 PM',  actor:A.priya, action:'Enabled',     module:'Leave Policy',       target:'Sandwich Rule',                description:'Enabled sandwich rule — weekends between leave days counted',         severity:'high',     changes:[{field:'Sandwich Rule',        before:'Disabled',          after:'Enabled'}] },
  { id:'a13', ts:'2026-06-03T14:50', date:'Jun 3, 2026',  time:'2:50 PM',  actor:A.kavi,  action:'Updated',     module:'User Management',    target:'Sneha Iyer',                   description:'Updated job designation for Sneha Iyer',                              severity:'medium',   changes:[{field:'Designation',          before:'Senior Engineer',   after:'Mobile Lead'}] },
  { id:'a14', ts:'2026-06-03T12:30', date:'Jun 3, 2026',  time:'12:30 PM', actor:A.arjun, action:'Exported',    module:'Reports',            target:'Attendance Report — May 2026', description:'Exported attendance report for May 2026 as CSV',                      severity:'low' },
  { id:'a15', ts:'2026-06-03T10:18', date:'Jun 3, 2026',  time:'10:18 AM', actor:A.priya, action:'Updated',     module:'Timesheet Policies', target:'Hour Limits',                  description:'Updated maximum weekly hour limit',                                   severity:'high',     changes:[{field:'Max Hours / Week',     before:'50 hrs',            after:'55 hrs'}] },
  { id:'a16', ts:'2026-06-03T09:02', date:'Jun 3, 2026',  time:'9:02 AM',  actor:A.arjun, action:'Deactivated', module:'User Management',    target:'James Wilson',                 description:'Deactivated employee account for James Wilson',                       severity:'critical', changes:[{field:'Account Status',       before:'Active',            after:'Inactive'},{field:'Last Active',before:'—',after:'Jun 3, 2026'}] },
  { id:'a17', ts:'2026-06-02T16:40', date:'Jun 2, 2026',  time:'4:40 PM',  actor:A.kavi,  action:'Created',     module:'Leave Policy',       target:'Maternity Leave',              description:'Added new leave type Maternity Leave — 180 days paid',               severity:'medium',   changes:[{field:'Leave Type',           before:'—',                 after:'Maternity Leave (MAT)'},{field:'Annual Days',before:'—',after:'180 days'},{field:'Category',before:'—',after:'Paid'}] },
  { id:'a18', ts:'2026-06-02T14:10', date:'Jun 2, 2026',  time:'2:10 PM',  actor:A.priya, action:'Updated',     module:'Department',         target:'Engineering',                  description:'Changed department head for Engineering',                             severity:'medium',   changes:[{field:'Department Head',      before:'Sarah Johnson',     after:'Rohan Mehta'}] },
  { id:'a19', ts:'2026-06-02T11:55', date:'Jun 2, 2026',  time:'11:55 AM', actor:A.arjun, action:'Changed',     module:'Role & Access',      target:'Sarah Johnson',                description:'Downgraded system role for Sarah Johnson',                            severity:'critical', changes:[{field:'Role',                 before:'Manager',           after:'Employee'}] },
  { id:'a20', ts:'2026-06-02T09:20', date:'Jun 2, 2026',  time:'9:20 AM',  actor:A.priya, action:'Updated',     module:'Org Profile',        target:'Concert IDC',                  description:'Updated registered office address in org profile',                    severity:'medium',   changes:[{field:'Street Address',       before:'Previous Address',  after:'New Address, Bangalore 560001'}] },
  { id:'a21', ts:'2026-06-01T17:30', date:'Jun 1, 2026',  time:'5:30 PM',  actor:A.kavi,  action:'Reset',       module:'Leave Policy',       target:'Leave Balances FY 2026-27',    description:'Reset leave balances for all 78 employees for FY 2026-27',           severity:'critical', changes:[{field:'Fiscal Year',          before:'2025-26',           after:'2026-27'},{field:'Employees Affected',before:'—',after:'78 employees'}] },
  { id:'a22', ts:'2026-06-01T14:44', date:'Jun 1, 2026',  time:'2:44 PM',  actor:A.priya, action:'Disabled',    module:'Leave Policy',       target:'Birthday Leave',               description:'Disabled Birthday Leave type organisation-wide',                      severity:'high',     changes:[{field:'Birthday Leave',       before:'Active',            after:'Disabled'}] },
  { id:'a23', ts:'2026-06-01T11:15', date:'Jun 1, 2026',  time:'11:15 AM', actor:A.arjun, action:'Updated',     module:'Working Hours',      target:'Work Week',                    description:'Updated standard working days policy',                                severity:'high',     changes:[{field:'Working Days',         before:'Mon – Fri',         after:'Mon – Sat'}] },
  { id:'a24', ts:'2026-06-01T09:38', date:'Jun 1, 2026',  time:'9:38 AM',  actor:A.kavi,  action:'Published',   module:'Announcements',      target:'Holiday Calendar 2026',        description:'Published official company holiday calendar for 2026',               severity:'low' },
  { id:'a25', ts:'2026-05-31T16:22', date:'May 31, 2026', time:'4:22 PM',  actor:A.priya, action:'Created',     module:'Designation',        target:'Principal Engineer',            description:'Added new designation Principal Engineer',                            severity:'low' },
  { id:'a26', ts:'2026-05-31T14:08', date:'May 31, 2026', time:'2:08 PM',  actor:A.arjun, action:'Updated',     module:'Timesheet Policies', target:'Approval Workflow',             description:'Enabled auto-approve rule for pending timesheets',                    severity:'high',     changes:[{field:'Auto-approve After',   before:'Disabled',          after:'3 days'}] },
  { id:'a27', ts:'2026-05-31T11:50', date:'May 31, 2026', time:'11:50 AM', actor:A.kavi,  action:'Exported',    module:'Reports',            target:'Payroll Summary — May 2026',   description:'Exported payroll summary report for May 2026',                       severity:'low' },
  { id:'a28', ts:'2026-05-31T09:15', date:'May 31, 2026', time:'9:15 AM',  actor:A.priya, action:'Updated',     module:'Leave Policy',       target:'Bereavement Holiday',          description:'Updated annual days for Bereavement Holiday',                         severity:'high',     changes:[{field:'Annual Days',          before:'3 days',            after:'5 days'}] },
]

const ALL_MODULES: string[] = [...new Set(DATA.map(e => e.module))]
const SEVERITIES:  Severity[] = ['critical', 'high', 'medium', 'low']

// ── Timeline event card ────────────────────────────────────────────────────────
function TimelineEvent({ entry, expanded, onToggle, isLast }: {
  entry: AuditEntry; expanded: boolean; onToggle: () => void; isLast: boolean
}) {
  const sv  = SEV[entry.severity]
  const act = ACT[entry.action]
  const mod = MOD[entry.module]
  const hasChanges = !!(entry.changes?.length)

  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>

      {/* ── Timeline spine (dot + line) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
        <div style={{ width: 13, height: 13, borderRadius: '50%', background: sv.color, border: '2.5px solid #fff', boxShadow: `0 0 0 3px ${sv.line}`, flexShrink: 0, marginTop: 18, zIndex: 1 }} />
        {!isLast && <div style={{ width: 2, flex: 1, background: C.border, marginTop: 6 }} />}
      </div>

      {/* ── Event card ── */}
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 14, paddingLeft: 16 }}>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border }}>

          {/* Card body */}
          <div style={{ padding: '14px 18px' }}>

            {/* Row 1: actor + time + badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <img src={`https://i.pravatar.cc/150?img=${entry.actor.avatar}`} alt=""
                style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${C.border}` }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{entry.actor.name}</span>
                <span style={{ fontSize: 12, color: C.muted, marginLeft: 5 }}>· {entry.actor.role}</span>
              </div>
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 500, flexShrink: 0 }}>{entry.time}</span>
              <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 6, background: mod.bg, color: mod.color, fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
                {entry.module}
              </span>
              <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 99, background: sv.bg, color: sv.color, border: `1px solid ${sv.border}`, fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
                {sv.label}
              </span>
              {hasChanges && (
                <button onClick={onToggle}
                  style={{ width: 26, height: 26, borderRadius: 7, border: `1px solid ${expanded ? '#A5B4FC' : C.border}`, background: expanded ? '#EEF2FF' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', flexShrink: 0 }}
                  onMouseEnter={e => { if (!expanded) { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' } }}
                  onMouseLeave={e => { if (!expanded) { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border } }}>
                  {expanded
                    ? <ChevronUp   size={11} strokeWidth={2.5} style={{ color: '#6366F1' }} />
                    : <ChevronDown size={11} strokeWidth={2.5} style={{ color: C.muted  }} />
                  }
                </button>
              )}
            </div>

            {/* Row 2: action badge + target */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: 5, background: act.bg, color: act.color, fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
                {entry.action}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{entry.target}</span>
            </div>

            {/* Row 3: description */}
            <p style={{ fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.55 }}>{entry.description}</p>
          </div>

          {/* Expanded: before / after changes */}
          {expanded && hasChanges && (
            <div style={{ borderTop: `1px solid ${C.border}`, background: '#F7F8FF', padding: '14px 18px', animation: 'atFade 0.18s ease-out' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: '#6366F1', textTransform: 'uppercase' as const, letterSpacing: '0.07em', marginBottom: 10 }}>
                Field Changes
              </div>
              <div style={{ borderRadius: 10, border: '1px solid rgba(99,102,241,0.16)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '8px 14px', background: 'rgba(99,102,241,0.07)', borderBottom: '1px solid rgba(99,102,241,0.12)' }}>
                  {['Field', 'Before', 'After'].map(h => (
                    <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: '#5B5FDE', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{h}</span>
                  ))}
                </div>
                {entry.changes!.map((c, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '9px 14px', borderBottom: i < entry.changes!.length - 1 ? '1px solid rgba(99,102,241,0.09)' : 'none', alignItems: 'center' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{c.field}</span>
                    <span style={{ fontSize: 12.5, color: c.before === '—' ? C.muted : '#DC2626', fontWeight: 500, textDecoration: c.before === '—' ? 'none' : 'line-through', opacity: c.before === '—' ? 0.6 : 1 }}>{c.before}</span>
                    <span style={{ fontSize: 12.5, color: '#059669', fontWeight: 700 }}>{c.after}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AuditTrailPage() {
  const [search,     setSearch]     = useState('')
  const [modFilter,  setModFilter]  = useState('All')
  const [sevFilter,  setSevFilter]  = useState('All')
  const [fromDate,   setFromDate]   = useState('')
  const [toDate,     setToDate]     = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => DATA.filter(e => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      e.description.toLowerCase().includes(q) ||
      e.actor.name.toLowerCase().includes(q) ||
      e.target.toLowerCase().includes(q) ||
      e.module.toLowerCase().includes(q) ||
      e.action.toLowerCase().includes(q)
    const matchMod  = modFilter  === 'All' || e.module   === modFilter
    const matchSev  = sevFilter === 'All' || e.severity === sevFilter
    const d = e.ts.slice(0, 10)
    const matchDate = (!fromDate || d >= fromDate) && (!toDate || d <= toDate)
    return matchSearch && matchMod && matchSev && matchDate
  }), [search, modFilter, sevFilter, fromDate, toDate])

  // Group by date
  const groups = useMemo(() => {
    const map: { date: string; events: AuditEntry[] }[] = []
    let cur = ''
    for (const e of filtered) {
      if (e.date !== cur) { cur = e.date; map.push({ date: cur, events: [] }) }
      map[map.length - 1].events.push(e)
    }
    return map
  }, [filtered])

  const activeFilters = [modFilter !== 'All', sevFilter !== 'All', !!fromDate, !!toDate, search.length > 0].filter(Boolean).length

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes atFade { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }`}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px', margin: '0 0 4px' }}>Audit Trail</h1>
          <p style={{ fontSize: 13.5, color: C.muted, margin: 0 }}>
            Tamper-evident log of all admin-level actions — who did what, when, and on which record
          </p>
        </div>
        <button
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 40, padding: '0 18px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
          <Download size={14} strokeWidth={2} /> Export CSV
        </button>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 20px', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Row 1: Search + Module + Date range + Clear + Count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search…"
              style={{ width: '100%', height: 38, paddingLeft: 36, paddingRight: search ? 34 : 12, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              onFocus={e => { e.target.style.borderColor = '#6366F1' }}
              onBlur={e => { e.target.style.borderColor = C.border }} />
            {search && (
              <button onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: C.muted, lineHeight: 0, display: 'flex' }}>
                <X size={13} />
              </button>
            )}
          </div>

          <select value={modFilter} onChange={e => setModFilter(e.target.value)}
            style={{ height: 38, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: modFilter === 'All' ? C.muted : C.navy, background: C.surface, outline: 'none', cursor: 'pointer', fontFamily: 'inherit', minWidth: 160, flexShrink: 0, transition: 'border-color 0.15s' }}
            onFocus={e => { e.target.style.borderColor = '#6366F1' }}
            onBlur={e => { e.target.style.borderColor = C.border }}>
            <option value="All">All Modules</option>
            {ALL_MODULES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          {/* Date range */}
          <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>From</span>
          <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
            style={{ height: 38, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: fromDate ? C.navy : C.muted, background: C.surface, outline: 'none', cursor: 'pointer', fontFamily: 'inherit', width: 142, flexShrink: 0, transition: 'border-color 0.15s' }}
            onFocus={e => { e.target.style.borderColor = '#6366F1' }}
            onBlur={e => { e.target.style.borderColor = C.border }} />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' as const, flexShrink: 0 }}>To</span>
          <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
            style={{ height: 38, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: toDate ? C.navy : C.muted, background: C.surface, outline: 'none', cursor: 'pointer', fontFamily: 'inherit', width: 142, flexShrink: 0, transition: 'border-color 0.15s' }}
            onFocus={e => { e.target.style.borderColor = '#6366F1' }}
            onBlur={e => { e.target.style.borderColor = C.border }} />

          {activeFilters > 0 && (
            <button onClick={() => { setSearch(''); setModFilter('All'); setSevFilter('All'); setFromDate(''); setToDate('') }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 38, padding: '0 12px', borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', flexShrink: 0, whiteSpace: 'nowrap' as const }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#E84855'; e.currentTarget.style.color = '#E84855' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
              <X size={12} strokeWidth={2.5} /> Clear ({activeFilters})
            </button>
          )}

        </div>

        {/* Row 2: Severity chips only */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginRight: 2 }}>Severity</span>
          {(['All', ...SEVERITIES] as const).map(s => {
            const active = sevFilter === s
            const cfg = s !== 'All' ? SEV[s as Severity] : null
            return (
              <button key={s} onClick={() => setSevFilter(s)}
                style={{ height: 28, padding: '0 11px', borderRadius: 6, border: `1px solid ${active ? (cfg?.border ?? 'rgba(99,102,241,0.30)') : C.border}`, background: active ? (cfg?.bg ?? 'rgba(99,102,241,0.08)') : '#fff', color: active ? (cfg?.color ?? '#4F46E5') : C.muted, fontSize: 12, fontWeight: active ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', whiteSpace: 'nowrap' as const, textTransform: 'capitalize' as const }}>
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Timeline ── */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '64px 40px', textAlign: 'center' as const }}>
          <Search size={28} strokeWidth={1.2} style={{ color: '#D0D3E4', margin: '0 auto 12px' }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: '0 0 4px' }}>No audit events found</p>
          <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 28px 24px' }}>
          {groups.map((group, gi) => {
            const isLastGroup = gi === groups.length - 1
            return (
              <div key={group.date}>
                {/* ── Date separator ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18, marginTop: gi > 0 ? 12 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', width: 36, justifyContent: 'center' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#C8CCE0', border: '2px solid #fff', boxShadow: '0 0 0 2px #E8EAF2' }} />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 800, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.08em', background: C.surface, padding: '4px 12px', borderRadius: 6 }}>
                    {group.date}
                  </span>
                  <div style={{ flex: 1, height: 1, background: C.border }} />
                  <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 500, flexShrink: 0 }}>
                    {group.events.length} event{group.events.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* ── Events ── */}
                {group.events.map((entry, ei) => {
                  const isLastEvent = isLastGroup && ei === group.events.length - 1
                  return (
                    <TimelineEvent
                      key={entry.id}
                      entry={entry}
                      expanded={expandedId === entry.id}
                      onToggle={() => setExpandedId(p => p === entry.id ? null : entry.id)}
                      isLast={isLastEvent}
                    />
                  )
                })}

                {/* Connector line between date groups */}
                {!isLastGroup && (
                  <div style={{ display: 'flex', gap: 0, paddingBottom: 4 }}>
                    <div style={{ width: 36, display: 'flex', justifyContent: 'center' }}>
                      <div style={{ width: 2, height: 20, background: C.border }} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Footer */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: C.muted }}>
              Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of <strong style={{ color: C.navy }}>{DATA.length}</strong> audit events
            </span>
            <span style={{ fontSize: 12, color: C.muted }}>Last updated: Jun 5, 2026 at 5:42 PM</span>
          </div>
        </div>
      )}
    </div>
  )
}
