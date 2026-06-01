import { useState } from 'react'
import { Search, Bell, Check, Clock, Users, AlertCircle, BellRing, X } from 'lucide-react'

// ─── Design tokens ─────────────────────────────────────────────────────────────

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: C.muted,
  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10,
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PendingEmployee {
  id:           number
  employee:     string
  avatar:       number
  role:         string
  department:   string
  project:      string
  projectColor: string
  pendingCount: number
  pendingDates: string[]
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const PROJECT_COLORS: Record<string, string> = {
  'Pulse.AI v2':   '#6366F1',
  'HDFC Portal':   '#0EA5E9',
  'TechCorp ERP':  '#10B981',
  'Retail CRM':    '#F59E0B',
  'FinTrack App':  '#EC4899',
  'CloudSync Pro': '#8B5CF6',
  'MediLink HMS':  '#14B8A6',
}

const DATA: PendingEmployee[] = [
  { id: 1,  employee: 'Sarah Johnson',  avatar: 47, role: 'Frontend Developer',  department: 'Engineering',      project: 'Pulse.AI v2',  projectColor: '#6366F1', pendingCount: 3, pendingDates: ['2026-05-27','2026-05-28','2026-05-29'] },
  { id: 2,  employee: 'Mike Chen',      avatar: 33, role: 'QA Engineer',         department: 'Quality Assurance', project: 'HDFC Portal',  projectColor: '#0EA5E9', pendingCount: 2, pendingDates: ['2026-05-28','2026-05-29'] },
  { id: 3,  employee: 'Emma Wilson',    avatar: 44, role: 'UI/UX Designer',       department: 'Design',           project: 'Pulse.AI v2',  projectColor: '#6366F1', pendingCount: 4, pendingDates: ['2026-05-26','2026-05-27','2026-05-28','2026-05-29'] },
  { id: 4,  employee: 'Anjali Singh',   avatar: 36, role: 'Product Analyst',      department: 'Product',          project: 'HDFC Portal',  projectColor: '#0EA5E9', pendingCount: 1, pendingDates: ['2026-05-29'] },
  { id: 5,  employee: 'Karthik Nair',   avatar: 15, role: 'Frontend Developer',  department: 'Engineering',      project: 'TechCorp ERP', projectColor: '#10B981', pendingCount: 3, pendingDates: ['2026-05-27','2026-05-28','2026-05-29'] },
  { id: 6,  employee: 'Riya Patel',     avatar: 10, role: 'Backend Developer',   department: 'Engineering',      project: 'Pulse.AI v2',  projectColor: '#6366F1', pendingCount: 2, pendingDates: ['2026-05-28','2026-05-29'] },
  { id: 7,  employee: 'Arjun Mehta',    avatar: 8,  role: 'DevOps Engineer',     department: 'Infrastructure',   project: 'TechCorp ERP', projectColor: '#10B981', pendingCount: 5, pendingDates: ['2026-05-23','2026-05-26','2026-05-27','2026-05-28','2026-05-29'] },
  { id: 8,  employee: 'Nisha Verma',    avatar: 20, role: 'Business Analyst',    department: 'Consulting',       project: 'HDFC Portal',  projectColor: '#0EA5E9', pendingCount: 2, pendingDates: ['2026-05-28','2026-05-29'] },
  { id: 9,  employee: 'Deepak Kumar',   avatar: 25, role: 'Full Stack Developer', department: 'Engineering',     project: 'TechCorp ERP', projectColor: '#10B981', pendingCount: 1, pendingDates: ['2026-05-29'] },
  { id: 10, employee: 'Priya Sharma',   avatar: 38, role: 'Scrum Master',         department: 'Delivery',        project: 'Pulse.AI v2',  projectColor: '#6366F1', pendingCount: 3, pendingDates: ['2026-05-27','2026-05-28','2026-05-29'] },
]

const PROJECTS = Object.keys(PROJECT_COLORS)

// ─── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function urgency(count: number) {
  if (count >= 4) return { color: '#E84855', bg: 'rgba(232,72,85,0.08)',  border: 'rgba(232,72,85,0.18)'  }
  if (count >= 2) return { color: '#D97706', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.18)' }
  return               { color: '#6366F1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.18)' }
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function PendingTimesheetsPage() {
  const [searchQuery,      setSearchQuery]      = useState('')
  const [showSuggestions,  setShowSuggestions]  = useState(false)
  const [sFocus,           setSFocus]           = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<PendingEmployee | null>(null)
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [reminded,         setReminded]         = useState<Set<number>>(new Set())
  const [toast,            setToast]            = useState<string | null>(null)

  // Suggestions from search input
  const suggestions = searchQuery.trim().length > 0
    ? DATA.filter(r =>
        r.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  function selectEmployee(row: PendingEmployee) {
    setSelectedEmployee(row)
    setSearchQuery(row.employee)
    setShowSuggestions(false)
    setSelectedProjects(new Set())
  }

  function clearEmployee() {
    setSelectedEmployee(null)
    setSearchQuery('')
    setSelectedProjects(new Set())
  }

  function toggleProject(p: string) {
    setSelectedProjects(prev => {
      const next = new Set(prev)
      next.has(p) ? next.delete(p) : next.add(p)
      return next
    })
    setSelectedEmployee(null)
    setSearchQuery('')
  }

  function sendReminder(row: PendingEmployee) {
    if (reminded.has(row.id)) return
    setReminded(prev => new Set(prev).add(row.id))
    setToast(row.employee)
    setTimeout(() => setToast(null), 3200)
    setTimeout(() => {
      setReminded(prev => { const s = new Set(prev); s.delete(row.id); return s })
    }, 5000)
  }

  // Filtered list
  const filtered = DATA.filter(r => {
    if (selectedEmployee) return r.id === selectedEmployee.id
    if (selectedProjects.size > 0) return selectedProjects.has(r.project)
    return true
  })

  // Stats
  const totalEntries     = DATA.reduce((s, r) => s + r.pendingCount, 0)
  const projectsAffected = PROJECTS.length
  const remindedCount    = reminded.size

  const STATS = [
    { label: 'Employees Pending',    value: DATA.length,      color: '#6366F1', Icon: Users       },
    { label: 'Total Pending Entries', value: totalEntries,    color: '#D97706', Icon: Clock       },
    { label: 'Projects Affected',    value: projectsAffected, color: '#0A8A58', Icon: AlertCircle },
    { label: 'Reminders Sent',       value: remindedCount,    color: '#0891B2', Icon: Bell        },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes toastIn { from { opacity:0; transform:translateX(24px) } to { opacity:1; transform:translateX(0) } }
        .pt-sugg:hover { background: #F7F8FC !important; }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 28, zIndex: 99999, display: 'flex', alignItems: 'center', gap: 12, background: '#6366F1', color: '#fff', padding: '13px 20px 13px 14px', borderRadius: 14, boxShadow: '0 8px 32px rgba(99,102,241,0.30)', fontFamily: "'DM Sans', system-ui, sans-serif", animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <BellRing size={17} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, lineHeight: 1.3 }}>Reminder Sent</div>
            <div style={{ fontSize: 11.5, fontWeight: 500, opacity: 0.85, marginTop: 1 }}>Notification sent to {toast}</div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>Pending Timesheets</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13.5, color: C.muted }}>
          Monitor outstanding timesheet submissions and send instant reminders to employees.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 22 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.Icon size={19} color={s.color} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ margin: '4px 0 0', fontSize: 11.5, fontWeight: 500, color: C.muted }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 4 / 8 Split ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '4fr 8fr', gap: 18, alignItems: 'start' }}>

        {/* ── Left Panel ── */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Search Employee */}
          <div>
            <p style={labelStyle}>Search Employee</p>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
              <input
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setSelectedEmployee(null); setShowSuggestions(true) }}
                onFocus={() => { setSFocus(true); setShowSuggestions(true) }}
                onBlur={() => { setSFocus(false); setTimeout(() => setShowSuggestions(false), 160) }}
                placeholder="Employee name…"
                style={{
                  width: '100%', height: 38, paddingLeft: 32, paddingRight: searchQuery ? 32 : 10,
                  border: `1px solid ${sFocus ? C.navy : C.border}`, borderRadius: 8,
                  fontSize: 13, color: C.navy, background: C.surface, outline: 'none',
                  fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
              />
              {searchQuery && (
                <button
                  onMouseDown={e => { e.preventDefault(); clearEmployee() }}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: C.muted, display: 'flex', alignItems: 'center' }}
                >
                  <X size={13} />
                </button>
              )}

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, marginTop: 4, overflow: 'hidden', boxShadow: '0 8px 24px rgba(28,32,53,0.10)' }}>
                  {suggestions.map((emp, i) => (
                    <div
                      key={emp.id}
                      className="pt-sugg"
                      onMouseDown={e => { e.preventDefault(); selectEmployee(emp) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderBottom: i < suggestions.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', background: '#fff' }}
                    >
                      <img src={`https://i.pravatar.cc/40?img=${emp.avatar}`} alt={emp.employee} style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: `1px solid ${C.border}` }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.employee}</div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{emp.role}</div>
                      </div>
                      <div style={{ fontSize: 10.5, fontWeight: 600, color: '#4B4ECC', background: 'rgba(75,78,204,0.08)', border: '1px solid rgba(75,78,204,0.16)', borderRadius: 5, padding: '2px 7px', flexShrink: 0 }}>
                        {emp.pendingCount} pending
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected employee chip */}
            {selectedEmployee && (
              <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(75,78,204,0.05)', border: '1px solid rgba(75,78,204,0.18)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={`https://i.pravatar.cc/40?img=${selectedEmployee.avatar}`} alt={selectedEmployee.employee} style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '1px solid rgba(75,78,204,0.20)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{selectedEmployee.employee}</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{selectedEmployee.role}</div>
                </div>
                <button onClick={clearEmployee} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }} onMouseEnter={e => { e.currentTarget.style.color = '#E84855' }} onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Projects */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ ...labelStyle, margin: 0 }}>Projects</p>
              {selectedProjects.size > 0 && (
                <button onClick={() => setSelectedProjects(new Set())} style={{ fontSize: 11, fontWeight: 600, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                  Clear
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PROJECTS.map(p => {
                const active       = selectedProjects.has(p)
                const pendingCount = DATA.filter(r => r.project === p).length
                const hasPending   = pendingCount > 0
                return (
                  <button
                    key={p}
                    onClick={() => toggleProject(p)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                      border: `1px solid ${active ? 'rgba(99,102,241,0.35)' : C.border}`,
                      background: active ? 'rgba(99,102,241,0.10)' : C.surface,
                      color: active ? '#4B4ECC' : C.navy,
                      cursor: 'pointer', transition: 'all 0.15s',
                      fontFamily: "'DM Sans',system-ui,sans-serif",
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.color = '#4B4ECC' } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.navy } }}
                  >
                    {p}
                    {hasPending && (
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, lineHeight: 1,
                        padding: '2px 6px', borderRadius: 999,
                        background: active ? 'rgba(99,102,241,0.18)' : 'rgba(245,158,11,0.12)',
                        color: active ? '#4B4ECC' : '#D97706',
                        border: `1px solid ${active ? 'rgba(99,102,241,0.22)' : 'rgba(245,158,11,0.22)'}`,
                      }}>
                        {pendingCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Summary */}
          <div style={{ background: C.surface, borderRadius: 10, padding: '12px 14px', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Summary</div>
            {[
              { label: 'Showing', value: `${filtered.length} employees` },
              { label: 'Pending entries', value: filtered.reduce((s,r) => s + r.pendingCount, 0) },
              { label: 'Reminders sent', value: reminded.size },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: 12.5 }}>
                <span style={{ color: C.muted }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: C.navy }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 20px', minHeight: 460 }}>

          {/* Panel header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.navy }}>
                {selectedEmployee
                  ? selectedEmployee.employee
                  : selectedProjects.size > 0
                    ? [...selectedProjects].join(', ')
                    : 'All Pending Employees'}
              </p>
              <p style={{ margin: '3px 0 0', fontSize: 12, color: C.muted }}>
                {filtered.length} employee{filtered.length !== 1 ? 's' : ''} · {filtered.reduce((s,r) => s + r.pendingCount, 0)} pending entries
              </p>
            </div>
            {/* Remind All */}
            {filtered.some(r => !reminded.has(r.id)) && (
              <button
                onClick={() => {
                  const ids = filtered.filter(r => !reminded.has(r.id))
                  ids.forEach(r => sendReminder(r))
                  if (ids.length > 1) { setToast(`${ids.length} employees`); setTimeout(() => setToast(null), 3200) }
                }}
                style={{ height: 36, padding: '0 16px', borderRadius: 9, border: 'none', background: 'rgba(99,102,241,0.09)', color: '#4B4ECC', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.14s', flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}
              >
                <BellRing size={13} strokeWidth={2} /> Remind All
              </button>
            )}
          </div>

          {/* Cards list */}
          {filtered.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: C.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Search size={22} strokeWidth={1.4} color="#D0D3E4" />
              </div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.navy }}>No employees found</p>
              <p style={{ margin: 0, fontSize: 13, color: C.muted }}>Try a different search or select another project</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(row => {
                const urg     = urgency(row.pendingCount)
                const hasSent = reminded.has(row.id)

                return (
                  <div
                    key={row.id}
                    style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 18px' }}
                  >
                    {/* Top row: avatar + info + count + button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>

                      {/* Avatar */}
                      <img
                        src={`https://i.pravatar.cc/150?img=${row.avatar}`}
                        alt={row.employee}
                        style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.border}`, flexShrink: 0 }}
                      />

                      {/* Name / role / project */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{row.employee}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{row.role} · {row.department}</div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6, background: `${row.projectColor}12`, padding: '2px 9px', borderRadius: 12, border: `1px solid ${row.projectColor}28` }}>
                          <div style={{ width: 5, height: 5, borderRadius: '50%', background: row.projectColor, flexShrink: 0 }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: row.projectColor }}>{row.project}</span>
                        </div>
                      </div>

                      {/* Pending count */}
                      <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(28,32,53,0.05)', border: `1px solid ${C.border}`, borderRadius: 12, padding: '7px 13px' }}>
                        <span style={{ fontSize: 20, fontWeight: 900, color: C.navy, lineHeight: 1 }}>{row.pendingCount}</span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}>
                          {row.pendingCount === 1 ? 'Entry' : 'Entries'}
                        </span>
                      </div>

                      {/* Remind button */}
                      <button
                        onClick={() => sendReminder(row)}
                        disabled={hasSent}
                        style={{
                          flexShrink: 0, height: 40, padding: '0 18px', borderRadius: 10, border: 'none',
                          background: hasSent ? 'rgba(14,168,106,0.10)' : 'rgba(99,102,241,0.09)',
                          color: hasSent ? '#0A8A58' : '#4B4ECC',
                          fontSize: 13, fontWeight: 700, cursor: hasSent ? 'default' : 'pointer',
                          fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.16s',
                        }}
                        onMouseEnter={e => { if (!hasSent) e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                        onMouseLeave={e => { if (!hasSent) e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}
                      >
                        {hasSent
                          ? <><Check size={13} strokeWidth={2.5} /> Sent</>
                          : <><Bell size={13} strokeWidth={1.8} /> Remind</>}
                      </button>
                    </div>

                    {/* Pending dates */}
                    <div style={{ marginTop: 13, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', flexShrink: 0 }}>Pending Dates</span>
                      {row.pendingDates.map(d => (
                        <span
                          key={d}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, padding: '3px 9px', borderRadius: 7, background: 'rgba(28,32,53,0.05)', color: C.muted, border: `1px solid ${C.border}` }}
                        >
                          <Clock size={9} strokeWidth={2.2} />
                          {fmtDate(d)}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
