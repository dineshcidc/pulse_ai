import { useState } from 'react'
import { Search, Info, Eye, ArrowLeft, Clock, FileText, AlertCircle, Users } from 'lucide-react'

type Status = 'Approved' | 'Pending' | 'Rejected'

interface Entry {
  id: number
  employee: string; avatar: number; empId: string; department: string
  project: string; manager: string
  date: string; task: string
  hours: number; status: Status
}

interface Member { name: string; avatar: number; empId: string }

interface EmployeeSummary {
  employee: string; avatar: number; empId: string
  department: string; project: string; manager: string
  entries: Entry[]; totalHours: number
  dateFrom: string; dateTo: string
  approvedCount: number; pendingCount: number; rejectedCount: number
}

const STATUS_CFG: Record<Status, { color: string; bg: string; border: string; dot: string }> = {
  Approved: { color: '#0A8A58', bg: 'rgba(14,168,106,0.08)', border: 'rgba(14,168,106,0.20)', dot: '#16A34A' },
  Pending:  { color: '#D97706', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.22)', dot: '#F59E0B' },
  Rejected: { color: '#E84855', bg: 'rgba(232,72,85,0.08)',  border: 'rgba(232,72,85,0.20)',  dot: '#E84855' },
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

const PROJECT_TEAMS: Record<string, Member[]> = {
  'Pulse.AI v2': [
    { name: 'Sarah Johnson', avatar: 47, empId: 'EMP-0047' },
    { name: 'Emma Wilson',   avatar: 44, empId: 'EMP-0044' },
    { name: 'James Wilson',  avatar: 60, empId: 'EMP-0060' },
  ],
  'HDFC Portal': [
    { name: 'Mike Chen',        avatar: 33, empId: 'EMP-0033' },
    { name: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036' },
    { name: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041' },
  ],
  'TechCorp ERP': [
    { name: 'Arjun Patel',  avatar: 52, empId: 'EMP-0052' },
    { name: 'Karthik Nair', avatar: 56, empId: 'EMP-0056' },
  ],
}

const DATA: Entry[] = [
  { id:  1, employee: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',  manager: 'Rohan Mehta',  date: '2026-05-26', task: 'Frontend API Integration',            hours: 8.0, status: 'Approved' },
  { id:  2, employee: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',  manager: 'Rohan Mehta',  date: '2026-05-25', task: 'UI Component Development',             hours: 7.5, status: 'Approved' },
  { id:  3, employee: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',  manager: 'Rohan Mehta',  date: '2026-05-24', task: 'Code Review & Testing',                hours: 6.0, status: 'Pending'  },
  { id:  4, employee: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',  manager: 'Rohan Mehta',  date: '2026-05-23', task: 'Sprint Planning Meeting',              hours: 3.0, status: 'Approved' },
  { id:  5, employee: 'Sarah Johnson',    avatar: 47, empId: 'EMP-0047', department: 'Engineering',  project: 'Pulse.AI v2',  manager: 'Rohan Mehta',  date: '2026-05-22', task: 'Bug Fix — Dashboard Module',           hours: 8.0, status: 'Approved' },
  { id:  6, employee: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',  manager: 'Priya Sharma', date: '2026-05-26', task: 'Backend API Testing',                  hours: 7.0, status: 'Pending'  },
  { id:  7, employee: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',  manager: 'Priya Sharma', date: '2026-05-25', task: 'Database Query Optimization',          hours: 8.0, status: 'Approved' },
  { id:  8, employee: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',  manager: 'Priya Sharma', date: '2026-05-23', task: 'API Documentation',                    hours: 5.5, status: 'Approved' },
  { id:  9, employee: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',  manager: 'Priya Sharma', date: '2026-05-22', task: 'Unit Test Coverage',                   hours: 7.0, status: 'Approved' },
  { id: 10, employee: 'Mike Chen',        avatar: 33, empId: 'EMP-0033', department: 'QA & Testing', project: 'HDFC Portal',  manager: 'Priya Sharma', date: '2026-05-21', task: 'Integration Testing',                  hours: 6.0, status: 'Rejected' },
  { id: 11, employee: 'Emma Wilson',      avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',  manager: 'Rohan Mehta',  date: '2026-05-26', task: 'Design System — Component Library',    hours: 6.0, status: 'Pending'  },
  { id: 12, employee: 'Emma Wilson',      avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',  manager: 'Rohan Mehta',  date: '2026-05-24', task: 'Figma Prototype — Dashboard',          hours: 7.5, status: 'Approved' },
  { id: 13, employee: 'Emma Wilson',      avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',  manager: 'Rohan Mehta',  date: '2026-05-23', task: 'UX Review & Feedback Session',         hours: 4.0, status: 'Approved' },
  { id: 14, employee: 'Emma Wilson',      avatar: 44, empId: 'EMP-0044', department: 'Design',       project: 'Pulse.AI v2',  manager: 'Rohan Mehta',  date: '2026-05-22', task: 'Mobile Responsive Design',             hours: 7.0, status: 'Approved' },
  { id: 15, employee: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP', manager: 'Priya Sharma', date: '2026-05-26', task: 'ERP Module — Payroll Integration',     hours: 8.0, status: 'Approved' },
  { id: 16, employee: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP', manager: 'Priya Sharma', date: '2026-05-25', task: 'Performance Testing Suite',            hours: 6.5, status: 'Approved' },
  { id: 17, employee: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP', manager: 'Priya Sharma', date: '2026-05-24', task: 'Database Schema Migration',            hours: 7.0, status: 'Pending'  },
  { id: 18, employee: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP', manager: 'Priya Sharma', date: '2026-05-23', task: 'Requirements Walkthrough',             hours: 3.5, status: 'Approved' },
  { id: 19, employee: 'Arjun Patel',      avatar: 52, empId: 'EMP-0052', department: 'QA & Testing', project: 'TechCorp ERP', manager: 'Priya Sharma', date: '2026-05-21', task: 'Integration Test Cases',               hours: 6.0, status: 'Approved' },
  { id: 20, employee: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',  manager: 'Priya Sharma', date: '2026-05-26', task: 'Product Roadmap Review',               hours: 4.0, status: 'Approved' },
  { id: 21, employee: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',  manager: 'Priya Sharma', date: '2026-05-25', task: 'Stakeholder Sync Meeting',             hours: 3.0, status: 'Approved' },
  { id: 22, employee: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',  manager: 'Priya Sharma', date: '2026-05-24', task: 'Feature Specification — Loans Module',  hours: 7.0, status: 'Pending'  },
  { id: 23, employee: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',  manager: 'Priya Sharma', date: '2026-05-23', task: 'User Story Grooming',                  hours: 5.5, status: 'Approved' },
  { id: 24, employee: 'Anjali Singh',     avatar: 36, empId: 'EMP-0036', department: 'Product',      project: 'HDFC Portal',  manager: 'Priya Sharma', date: '2026-05-22', task: 'Sprint Review Preparation',            hours: 4.5, status: 'Approved' },
  { id: 25, employee: 'James Wilson',     avatar: 60, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',  manager: 'David Brown',  date: '2026-05-26', task: 'DevOps Pipeline Setup',                hours: 7.0, status: 'Pending'  },
  { id: 26, employee: 'James Wilson',     avatar: 60, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',  manager: 'David Brown',  date: '2026-05-25', task: 'Server Infrastructure Review',         hours: 5.5, status: 'Approved' },
  { id: 27, employee: 'James Wilson',     avatar: 60, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',  manager: 'David Brown',  date: '2026-05-24', task: 'Backend Service Optimization',         hours: 8.0, status: 'Approved' },
  { id: 28, employee: 'James Wilson',     avatar: 60, empId: 'EMP-0060', department: 'Engineering',  project: 'Pulse.AI v2',  manager: 'David Brown',  date: '2026-05-22', task: 'Security Audit Implementation',        hours: 6.0, status: 'Approved' },
  { id: 29, employee: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', department: 'Design',       project: 'HDFC Portal',  manager: 'Rohan Mehta',  date: '2026-05-26', task: 'Portal Redesign — Home Page',          hours: 7.5, status: 'Pending'  },
  { id: 30, employee: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', department: 'Design',       project: 'HDFC Portal',  manager: 'Rohan Mehta',  date: '2026-05-25', task: 'User Research Analysis',               hours: 5.0, status: 'Approved' },
  { id: 31, employee: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', department: 'Design',       project: 'HDFC Portal',  manager: 'Rohan Mehta',  date: '2026-05-23', task: 'Wireframe Review Session',             hours: 4.0, status: 'Approved' },
  { id: 32, employee: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041', department: 'Design',       project: 'HDFC Portal',  manager: 'Rohan Mehta',  date: '2026-05-22', task: 'Design Handoff — Dev Team',            hours: 6.5, status: 'Approved' },
  { id: 33, employee: 'Karthik Nair',    avatar: 56, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP', manager: 'David Brown',  date: '2026-05-26', task: 'API Gateway Configuration',            hours: 8.0, status: 'Approved' },
  { id: 34, employee: 'Karthik Nair',    avatar: 56, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP', manager: 'David Brown',  date: '2026-05-25', task: 'Module Testing & Validation',          hours: 6.5, status: 'Approved' },
  { id: 35, employee: 'Karthik Nair',    avatar: 56, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP', manager: 'David Brown',  date: '2026-05-24', task: 'Code Review Session',                  hours: 4.0, status: 'Approved' },
  { id: 36, employee: 'Karthik Nair',    avatar: 56, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP', manager: 'David Brown',  date: '2026-05-23', task: 'ERP Core Module Development',          hours: 8.0, status: 'Pending'  },
  { id: 37, employee: 'Karthik Nair',    avatar: 56, empId: 'EMP-0056', department: 'Engineering',  project: 'TechCorp ERP', manager: 'David Brown',  date: '2026-05-21', task: 'Sprint Planning — Q2',                 hours: 3.0, status: 'Approved' },
]

const PROJECTS = Object.keys(PROJECT_TEAMS)
const MANAGERS = Array.from(new Set(DATA.map(d => d.manager))).sort()

function fmtShort(d: string) {
  const dt = new Date(d + 'T00:00:00')
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

function fmtFull(d: string) {
  const dt = new Date(d + 'T00:00:00')
  const wd  = dt.toLocaleDateString('en-US', { weekday: 'short' })
  const day = String(dt.getDate()).padStart(2, '0')
  const mon = dt.toLocaleDateString('en-US', { month: 'short' })
  return `${wd}, ${day} ${mon} ${dt.getFullYear()}`
}

/* ─── Detail page ─── */
function TimesheetDetailPage({ summary, onBack }: { summary: EmployeeSummary; onBack: () => void }) {
  const sorted = [...summary.entries].sort((a, b) => b.date.localeCompare(a.date))

  const statBadges = [
    { label: 'Total Hours', value: `${summary.totalHours.toFixed(1)}h`, color: '#4B4ECC', bg: 'rgba(75,78,204,0.08)', border: 'rgba(75,78,204,0.18)' },
    { label: 'Approved',    value: summary.approvedCount,                color: '#0A8A58', bg: 'rgba(14,168,106,0.08)', border: 'rgba(14,168,106,0.20)' },
    { label: 'Pending',     value: summary.pendingCount,                 color: '#D97706', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.22)' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: C.hover, border: `1px solid ${C.border}`,
          borderRadius: 8, cursor: 'pointer', color: C.navy,
          fontSize: 12.5, fontWeight: 600, padding: '6px 14px',
          marginBottom: 20, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.borderColor = '#D1D4E4' }}
        onMouseLeave={e => { e.currentTarget.style.background = C.hover;   e.currentTarget.style.borderColor = C.border }}
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Employee card */}
      <div style={{
        background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16,
        padding: '20px 26px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
          <img
            src={`https://i.pravatar.cc/54?img=${summary.avatar}`}
            alt={summary.employee}
            style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.navy }}>{summary.employee}</p>
            <p style={{ margin: '2px 0 8px', fontSize: 12.5, color: C.muted }}>{summary.empId}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[summary.department, summary.project, `Manager: ${summary.manager}`].map(t => (
                <span key={t} style={{
                  padding: '2px 9px', borderRadius: 5, fontSize: 11.5, fontWeight: 600,
                  color: C.navy, background: C.surface, border: `1px solid ${C.border}`,
                }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {statBadges.map(s => (
            <div key={s.label} style={{
              padding: '10px 18px', borderRadius: 10, textAlign: 'center',
              background: s.bg, border: `1px solid ${s.border}`, minWidth: 76,
            }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ margin: '4px 0 0', fontSize: 10, fontWeight: 700, color: s.color, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 28px' }}>
        <p style={{ margin: '0 0 22px', fontSize: 13, fontWeight: 700, color: C.navy }}>
          Timesheet Entries
          <span style={{ fontWeight: 500, color: C.muted, marginLeft: 6 }}>({sorted.length} {sorted.length === 1 ? 'entry' : 'entries'})</span>
        </p>

        <div>
          {sorted.map((entry, i) => {
            const sc     = STATUS_CFG[entry.status]
            const isLast = i === sorted.length - 1
            return (
              <div key={entry.id} style={{ display: 'flex', gap: 0 }}>
                {/* dot + line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 26, flexShrink: 0, paddingTop: 3 }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: '50%', background: sc.dot,
                    border: '2.5px solid #fff', boxShadow: `0 0 0 2px ${sc.dot}`,
                    flexShrink: 0, zIndex: 1,
                  }} />
                  {!isLast && (
                    <div style={{ width: 2, flex: 1, background: C.border, minHeight: 28, marginTop: 2 }} />
                  )}
                </div>

                {/* entry card */}
                <div style={{ paddingBottom: isLast ? 0 : 18, paddingLeft: 14, flex: 1 }}>
                  <p style={{ margin: '0 0 7px', fontSize: 11.5, fontWeight: 600, color: C.muted }}>
                    {fmtFull(entry.date)}
                  </p>
                  <div style={{
                    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
                    padding: '12px 16px', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', gap: 16,
                  }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.navy, flex: 1 }}>{entry.task}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      <span style={{
                        padding: '3px 11px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                        color: C.navy, background: '#fff', border: `1px solid ${C.border}`,
                      }}>{entry.hours.toFixed(1)}h</span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 5,
                        padding: '4px 11px', borderRadius: 7, fontSize: 11.5, fontWeight: 700,
                        color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`,
                      }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                        {entry.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ─── Main page ─── */
export default function AllTimesheetsPage() {
  const [search,           setSearch]           = useState('')
  const [dateFrom,         setDateFrom]         = useState('')
  const [dateTo,           setDateTo]           = useState('')
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [selectedManagers, setSelectedManagers] = useState<Set<string>>(new Set())
  const [isLoading,        setIsLoading]        = useState(false)
  const [hasGenerated,     setHasGenerated]     = useState(false)
  const [results,          setResults]          = useState<EmployeeSummary[]>([])
  const [viewDetail,       setViewDetail]       = useState<EmployeeSummary | null>(null)
  const [sFocus,           setSFocus]           = useState(false)

  if (viewDetail) {
    return <TimesheetDetailPage summary={viewDetail} onBack={() => setViewDetail(null)} />
  }

  const totalHours   = DATA.reduce((s, e) => s + e.hours, 0)
  const totalPending = DATA.filter(e => e.status === 'Pending').length

  const STATS = [
    { label: 'Total Hours',      value: `${totalHours.toFixed(1)}h`, Icon: Clock,       color: '#4B4ECC' },
    { label: 'Total Entries',    value: DATA.length,                  Icon: FileText,    color: C.navy    },
    { label: 'Pending Approval', value: totalPending,                 Icon: AlertCircle, color: '#D97706' },
    { label: 'Active Employees', value: new Set(DATA.map(e => e.employee)).size, Icon: Users, color: C.navy },
  ]

  function toggleProject(p: string) {
    setSelectedProjects(prev => {
      const next = new Set(prev); next.has(p) ? next.delete(p) : next.add(p); return next
    })
    setHasGenerated(false)
  }

  function toggleManager(m: string) {
    setSelectedManagers(prev => {
      const next = new Set(prev); next.has(m) ? next.delete(m) : next.add(m); return next
    })
    setHasGenerated(false)
  }

  function handleGenerate() {
    setIsLoading(true)
    setHasGenerated(false)
    setTimeout(() => {
      const q = search.trim().toLowerCase()
      const filtered = DATA.filter(e => {
        const ms = !q || e.employee.toLowerCase().includes(q) || e.empId.toLowerCase().includes(q)
        const mp = selectedProjects.size === 0 || selectedProjects.has(e.project)
        const mg = selectedManagers.size === 0 || selectedManagers.has(e.manager)
        const mf = !dateFrom || e.date >= dateFrom
        const mt = !dateTo   || e.date <= dateTo
        return ms && mp && mg && mf && mt
      })

      const empMap = new Map<string, Entry[]>()
      filtered.forEach(e => {
        if (!empMap.has(e.employee)) empMap.set(e.employee, [])
        empMap.get(e.employee)!.push(e)
      })

      const summaries: EmployeeSummary[] = []
      empMap.forEach((entries, employee) => {
        const first = entries[0]
        const dates = entries.map(e => e.date).sort()
        summaries.push({
          employee,
          avatar: first.avatar, empId: first.empId,
          department: first.department, project: first.project, manager: first.manager,
          entries,
          totalHours:    entries.reduce((s, e) => s + e.hours, 0),
          dateFrom:      dates[0],
          dateTo:        dates[dates.length - 1],
          approvedCount: entries.filter(e => e.status === 'Approved').length,
          pendingCount:  entries.filter(e => e.status === 'Pending').length,
          rejectedCount: entries.filter(e => e.status === 'Rejected').length,
        })
      })

      setResults(summaries)
      setIsLoading(false)
      setHasGenerated(true)
    }, 1200)
  }

  const labelStyle: React.CSSProperties = {
    margin: '0 0 8px', fontSize: 11.5, fontWeight: 700,
    color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em',
  }

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @keyframes ts-spin { to { transform: rotate(360deg) } }
        .ts-eye-btn:hover { background: ${C.navy} !important; border-color: ${C.navy} !important; }
        .ts-eye-btn:hover svg { stroke: #fff !important; }
        .ts-result-card:hover { box-shadow: 0 4px 18px rgba(28,32,53,0.09) !important; }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>All Timesheets</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13.5, color: C.muted }}>
          Filter and review timesheet submissions across employees, projects, and date ranges.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        {STATS.map(s => (
          <div key={s.label} style={{
            background: '#fff', border: `1px solid ${C.border}`,
            borderRadius: 16, padding: '18px 20px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <s.Icon size={19} color={s.color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ margin: '4px 0 0', fontSize: 11.5, fontWeight: 500, color: C.muted }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 4 / 8 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '4fr 8fr', gap: 18, alignItems: 'start' }}>

        {/* ── Left panel ── */}
        <div style={{
          background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16,
          padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 22,
        }}>

          {/* Search */}
          <div>
            <p style={labelStyle}>Search</p>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setHasGenerated(false) }}
                onFocus={() => setSFocus(true)}
                onBlur={() => setSFocus(false)}
                placeholder="Employee name or ID…"
                style={{
                  width: '100%', height: 38, paddingLeft: 32, paddingRight: 10,
                  border: `1px solid ${sFocus ? C.navy : C.border}`, borderRadius: 8,
                  fontSize: 13, color: C.navy, background: C.surface, outline: 'none',
                  fontFamily: "'DM Sans',system-ui,sans-serif",
                  boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
              />
            </div>
          </div>

          {/* Date range */}
          <div>
            <p style={labelStyle}>Date Range</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="date" value={dateFrom}
                onChange={e => { setDateFrom(e.target.value); setHasGenerated(false) }}
                style={{
                  flex: 1, height: 38, padding: '0 10px',
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  fontSize: 12.5, color: dateFrom ? C.navy : C.muted,
                  background: C.surface, outline: 'none',
                  fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box',
                }}
              />
              <span style={{ fontSize: 12, color: C.muted, flexShrink: 0 }}>to</span>
              <input
                type="date" value={dateTo}
                onChange={e => { setDateTo(e.target.value); setHasGenerated(false) }}
                style={{
                  flex: 1, height: 38, padding: '0 10px',
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  fontSize: 12.5, color: dateTo ? C.navy : C.muted,
                  background: C.surface, outline: 'none',
                  fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Projects */}
          <div>
            <p style={labelStyle}>Projects</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PROJECTS.map(p => {
                const active = selectedProjects.has(p)
                return (
                  <button key={p} onClick={() => toggleProject(p)}
                    style={{
                      padding: '7px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600,
                      border: `1px solid ${active ? C.navy : C.border}`,
                      background: active ? C.navy : C.surface,
                      color: active ? '#fff' : C.navy,
                      cursor: 'pointer', transition: 'all 0.15s',
                      fontFamily: "'DM Sans',system-ui,sans-serif",
                    }}
                  >{p}</button>
                )
              })}
            </div>
          </div>

          {/* Managers */}
          <div>
            <p style={labelStyle}>Project Managers</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {MANAGERS.map(m => {
                const active = selectedManagers.has(m)
                return (
                  <button key={m} onClick={() => toggleManager(m)}
                    style={{
                      padding: '6px 13px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      border: `1px solid ${active ? '#4B4ECC' : C.border}`,
                      background: active ? 'rgba(75,78,204,0.1)' : C.surface,
                      color: active ? '#4B4ECC' : C.muted,
                      cursor: 'pointer', transition: 'all 0.15s',
                      fontFamily: "'DM Sans',system-ui,sans-serif",
                    }}
                  >{m}</button>
                )
              })}
            </div>
          </div>

          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            style={{
              width: '100%', height: 42, borderRadius: 10, fontSize: 13.5, fontWeight: 700,
              background: isLoading ? '#A0A3B1' : C.navy, color: '#fff', border: 'none',
              cursor: isLoading ? 'default' : 'pointer', transition: 'background 0.2s',
              fontFamily: "'DM Sans',system-ui,sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginTop: 4,
            }}
          >
            {isLoading ? 'Generating…' : 'Generate Report'}
          </button>
        </div>

        {/* ── Right panel ── */}
        <div style={{
          background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16,
          padding: '22px 20px', minHeight: 460,
          display: 'flex', flexDirection: 'column',
        }}>

          {/* Empty state */}
          {!isLoading && !hasGenerated && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 14 }}>
              <div style={{ width: 54, height: 54, borderRadius: 14, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Info size={22} color={C.muted} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.navy }}>No report generated yet</p>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: C.muted, maxWidth: 300, lineHeight: 1.65 }}>
                  Select filters on the left — projects, managers, or a date range — then click Generate Report to view results.
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                border: `3px solid ${C.border}`, borderTopColor: C.navy,
                animation: 'ts-spin 0.75s linear infinite',
              }} />
              <p style={{ margin: 0, fontSize: 13.5, color: C.muted, fontWeight: 500 }}>Loading timesheets…</p>
            </div>
          )}

          {/* Results */}
          {hasGenerated && !isLoading && (
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.navy }}>
                  {results.length} {results.length === 1 ? 'employee' : 'employees'} found
                </p>
                {(selectedProjects.size > 0 || selectedManagers.size > 0) && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {[...selectedProjects].map(p => (
                      <span key={p} style={{ padding: '2px 9px', borderRadius: 5, fontSize: 11.5, fontWeight: 600, color: C.navy, background: C.surface, border: `1px solid ${C.border}` }}>{p}</span>
                    ))}
                    {[...selectedManagers].map(m => (
                      <span key={m} style={{ padding: '2px 9px', borderRadius: 5, fontSize: 11.5, fontWeight: 600, color: '#4B4ECC', background: 'rgba(75,78,204,0.08)', border: '1px solid rgba(75,78,204,0.18)' }}>{m}</span>
                    ))}
                  </div>
                )}
              </div>

              {results.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 0' }}>
                  <p style={{ margin: 0, fontSize: 13.5, color: C.muted }}>No timesheet entries match your selection.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {results.map(r => {
                    const overallStatus: Status = r.pendingCount > 0 ? 'Pending' : r.rejectedCount > 0 ? 'Rejected' : 'Approved'
                    const sc = STATUS_CFG[overallStatus]
                    return (
                      <div
                        key={r.employee}
                        className="ts-result-card"
                        style={{
                          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
                          padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
                          transition: 'box-shadow 0.15s',
                        }}
                      >
                        {/* Avatar */}
                        <img
                          src={`https://i.pravatar.cc/44?img=${r.avatar}`}
                          alt={r.employee}
                          style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.navy }}>{r.employee}</p>
                          <p style={{ margin: '2px 0 0', fontSize: 12, color: C.muted }}>{r.department} · {r.project}</p>
                          <p style={{ margin: '3px 0 0', fontSize: 11.5, color: C.muted }}>
                            {fmtShort(r.dateFrom)} — {fmtShort(r.dateTo)}
                          </p>
                        </div>

                        {/* Hours */}
                        <div style={{ textAlign: 'center', flexShrink: 0 }}>
                          <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#4B4ECC', lineHeight: 1 }}>{r.totalHours.toFixed(1)}h</p>
                          <p style={{ margin: '3px 0 0', fontSize: 10.5, color: C.muted }}>logged</p>
                        </div>

                        {/* Status badge */}
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
                          padding: '5px 12px', borderRadius: 7, fontSize: 12, fontWeight: 700,
                          color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`,
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                          {overallStatus}
                        </span>

                        {/* Eye button */}
                        <button
                          className="ts-eye-btn"
                          onClick={() => setViewDetail(r)}
                          style={{
                            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                            background: C.hover, border: `1px solid ${C.border}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', transition: 'all 0.15s',
                          }}
                        >
                          <Eye size={15} color={C.navy} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
