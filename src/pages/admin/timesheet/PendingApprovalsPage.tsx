import { useState } from 'react'
import { Search, Clock, Users, AlertCircle, FolderOpen, X, ChevronDown, ChevronUp, CalendarDays, ClipboardList, BellRing, Bell, Check } from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: C.muted,
  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10,
}

/* ── Types ── */
interface ManagerEmployee { name: string; avatar: number; role: string; pendingCount: number }
interface ProjectBreakdown {
  project: string; projectColor: string
  month: string; pendingCount: number
  employees: ManagerEmployee[]
}
interface ProjectManager {
  id: number; name: string; avatar: number; email: string; role: string
  projects: ProjectBreakdown[]
}

/* ── Static data ── */
const PROJECT_COLORS: Record<string, string> = {
  'Pulse.AI v2':   '#6366F1',
  'HDFC Portal':   '#0EA5E9',
  'TechCorp ERP':  '#10B981',
  'Retail CRM':    '#F59E0B',
  'FinTrack App':  '#EC4899',
  'CloudSync Pro': '#8B5CF6',
  'MediLink HMS':  '#14B8A6',
}

const MANAGERS: ProjectManager[] = [
  {
    id: 1, name: 'Rohan Mehta', avatar: 12, email: 'rohan.mehta@concertidc.com', role: 'Engineering Manager',
    projects: [
      {
        project: 'Pulse.AI v2', projectColor: '#6366F1', month: 'May 2026', pendingCount: 8,
        employees: [
          { name: 'Sarah Johnson', avatar: 47, role: 'Frontend Developer', pendingCount: 3 },
          { name: 'Emma Wilson',   avatar: 44, role: 'UI/UX Designer',      pendingCount: 3 },
          { name: 'Riya Patel',    avatar: 10, role: 'Backend Developer',   pendingCount: 2 },
        ],
      },
      {
        project: 'HDFC Portal', projectColor: '#0EA5E9', month: 'May 2026', pendingCount: 4,
        employees: [
          { name: 'Mike Chen',    avatar: 33, role: 'QA Engineer',       pendingCount: 2 },
          { name: 'Anjali Singh', avatar: 36, role: 'Product Analyst',   pendingCount: 1 },
          { name: 'Nisha Verma',  avatar: 20, role: 'Business Analyst',  pendingCount: 1 },
        ],
      },
    ],
  },
  {
    id: 2, name: 'David Brown', avatar: 8, email: 'david.brown@concertidc.com', role: 'Delivery Manager',
    projects: [
      {
        project: 'TechCorp ERP', projectColor: '#10B981', month: 'May 2026', pendingCount: 9,
        employees: [
          { name: 'Karthik Nair', avatar: 15, role: 'Frontend Developer',   pendingCount: 3 },
          { name: 'Arjun Mehta',  avatar: 8,  role: 'DevOps Engineer',      pendingCount: 5 },
          { name: 'Deepak Kumar', avatar: 25, role: 'Full Stack Developer', pendingCount: 1 },
        ],
      },
      {
        project: 'Retail CRM', projectColor: '#F59E0B', month: 'May 2026', pendingCount: 3,
        employees: [
          { name: 'Kavya Reddy', avatar: 21, role: 'Backend Developer', pendingCount: 2 },
          { name: 'Suresh Iyer', avatar: 52, role: 'QA Engineer',       pendingCount: 1 },
        ],
      },
      {
        project: 'FinTrack App', projectColor: '#EC4899', month: 'May 2026', pendingCount: 4,
        employees: [
          { name: 'Tanvi Desai',  avatar: 46, role: 'Mobile Developer', pendingCount: 2 },
          { name: 'Rahul Khanna', avatar: 3,  role: 'iOS Developer',    pendingCount: 2 },
        ],
      },
    ],
  },
  {
    id: 3, name: 'Priya Sharma', avatar: 31, email: 'priya.sharma@concertidc.com', role: 'Product Manager',
    projects: [
      {
        project: 'MediLink HMS', projectColor: '#14B8A6', month: 'May 2026', pendingCount: 5,
        employees: [
          { name: 'Arjun Patel',     avatar: 52, role: 'QA Engineer',  pendingCount: 2 },
          { name: 'Fatima Al-Zahra', avatar: 41, role: 'Design Lead',  pendingCount: 3 },
        ],
      },
      {
        project: 'CloudSync Pro', projectColor: '#8B5CF6', month: 'May 2026', pendingCount: 4,
        employees: [
          { name: 'Nikhil Verma', avatar: 37, role: 'SRE Engineer',  pendingCount: 2 },
          { name: 'Sneha Iyer',   avatar: 48, role: 'Mobile Lead',   pendingCount: 2 },
        ],
      },
    ],
  },
  {
    id: 4, name: 'Anjali Kapoor', avatar: 36, email: 'anjali.kapoor@concertidc.com', role: 'Project Lead',
    projects: [
      {
        project: 'Pulse.AI v2', projectColor: '#6366F1', month: 'May 2026', pendingCount: 6,
        employees: [
          { name: 'James Wilson', avatar: 12, role: 'DevOps Engineer', pendingCount: 3 },
          { name: 'Priya Rao',    avatar: 54, role: 'Product Analyst', pendingCount: 3 },
        ],
      },
    ],
  },
  {
    id: 5, name: 'Vikram Bose', avatar: 7, email: 'vikram.bose@concertidc.com', role: 'Tech Lead',
    projects: [
      {
        project: 'CloudSync Pro', projectColor: '#8B5CF6', month: 'May 2026', pendingCount: 5,
        employees: [
          { name: 'Arun Pillai',  avatar: 6,  role: 'Cloud Architect',    pendingCount: 3 },
          { name: 'Divya Rajan',  avatar: 48, role: 'Backend Developer',  pendingCount: 2 },
        ],
      },
      {
        project: 'TechCorp ERP', projectColor: '#10B981', month: 'May 2026', pendingCount: 3,
        employees: [
          { name: 'Rohit Malhotra', avatar: 64, role: 'QA Engineer',       pendingCount: 2 },
          { name: 'Lakshmi Iyer',   avatar: 63, role: 'Business Analyst',  pendingCount: 1 },
        ],
      },
    ],
  },
  {
    id: 6, name: 'Meera Pillai', avatar: 54, email: 'meera.pillai@concertidc.com', role: 'Senior PM',
    projects: [],
  },
  {
    id: 7, name: 'Ravi Kumar', avatar: 19, email: 'ravi.kumar@concertidc.com', role: 'Engineering Lead',
    projects: [
      {
        project: 'Retail CRM', projectColor: '#F59E0B', month: 'May 2026', pendingCount: 7,
        employees: [
          { name: 'Nandini Kapoor', avatar: 60, role: 'Frontend Developer', pendingCount: 3 },
          { name: 'Deepak Verma',   avatar: 56, role: 'Backend Developer',  pendingCount: 2 },
          { name: 'Shreya Menon',   avatar: 41, role: 'QA Engineer',        pendingCount: 2 },
        ],
      },
      {
        project: 'FinTrack App', projectColor: '#EC4899', month: 'May 2026', pendingCount: 3,
        employees: [
          { name: 'Kavitha Reddy', avatar: 21, role: 'Mobile Developer',  pendingCount: 2 },
          { name: 'Sanjay Gupta',  avatar: 26, role: 'iOS Developer',     pendingCount: 1 },
        ],
      },
    ],
  },
  {
    id: 8, name: 'Sonal Joshi', avatar: 16, email: 'sonal.joshi@concertidc.com', role: 'Delivery Lead',
    projects: [],
  },
  {
    id: 9, name: 'Arjun Das', avatar: 43, email: 'arjun.das@concertidc.com', role: 'Project Manager',
    projects: [
      {
        project: 'Pulse.AI v2', projectColor: '#6366F1', month: 'May 2026', pendingCount: 4,
        employees: [
          { name: 'Radhika Nair', avatar: 50, role: 'Data Engineer',      pendingCount: 2 },
          { name: 'Mohit Verma',  avatar: 29, role: 'Platform Engineer',  pendingCount: 2 },
        ],
      },
      {
        project: 'CloudSync Pro', projectColor: '#8B5CF6', month: 'May 2026', pendingCount: 2,
        employees: [
          { name: 'Ishaan Roy', avatar: 57, role: 'DevOps Engineer', pendingCount: 2 },
        ],
      },
    ],
  },
  {
    id: 10, name: 'Kavitha Reddy', avatar: 21, email: 'kavitha.reddy@concertidc.com', role: 'Module Lead',
    projects: [],
  },
]

/* ── Project accordion card ── */
function ProjectCard({ pb, defaultOpen = false }: { pb: ProjectBreakdown; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: '#fff', cursor: 'pointer', transition: 'background 0.12s' }}
        onClick={() => setOpen(o => !o)}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = C.surface }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = '#fff' }}
      >
        <div style={{ width: 38, height: 38, borderRadius: 10, background: `${pb.projectColor}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${pb.projectColor}28` }}>
          <FolderOpen size={17} strokeWidth={1.8} style={{ color: pb.projectColor }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{pb.project}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <CalendarDays size={11} style={{ color: C.muted }} strokeWidth={1.8} />
            <span style={{ fontSize: 11.5, color: C.muted }}>{pb.month}</span>
            <span style={{ fontSize: 11, color: C.border }}>·</span>
            <span style={{ fontSize: 11.5, color: C.muted }}>{pb.employees.length} team members</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(232,72,85,0.07)', border: '1px solid rgba(232,72,85,0.18)', borderRadius: 10, padding: '6px 13px', flexShrink: 0 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#E84855', lineHeight: 1 }}>{pb.pendingCount}</span>
          <span style={{ fontSize: 10.5, fontWeight: 700, color: '#E84855', textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}>Pending</span>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {open ? <ChevronUp size={13} strokeWidth={2.2} style={{ color: C.muted }} /> : <ChevronDown size={13} strokeWidth={2.2} style={{ color: C.muted }} />}
        </div>
      </div>

      {open && (
        <div style={{ borderTop: `1px solid ${C.border}`, background: C.surface }}>
          {pb.employees.map((emp, i) => (
            <div key={emp.name}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < pb.employees.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.12s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#ECEEF5' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
            >
              <img src={`https://i.pravatar.cc/150?img=${emp.avatar}`} alt={emp.name}
                style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${C.border}` }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{emp.name}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{emp.role}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, padding: '5px 11px', flexShrink: 0 }}>
                <Clock size={11} strokeWidth={2} style={{ color: '#D97706' }} />
                <span style={{ fontSize: 12.5, fontWeight: 800, color: C.navy }}>{emp.pendingCount}</span>
                <span style={{ fontSize: 10.5, fontWeight: 500, color: C.muted }}>{emp.pendingCount === 1 ? 'entry' : 'entries'}</span>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', borderTop: `1px solid ${C.border}`, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CalendarDays size={12} style={{ color: C.muted }} strokeWidth={1.8} />
              <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>Pending for {pb.month}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#E84855' }}>{pb.pendingCount} total pending entries</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main page ── */
export default function PendingApprovalsPage() {
  const [search,          setSearch]          = useState('')
  const [selectedManager, setSelectedManager] = useState<ProjectManager | null>(null)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [state,           setState]           = useState<'idle' | 'loading' | 'done'>('idle')
  const [resultManager,   setResultManager]   = useState<ProjectManager | null>(null)
  const [reminded,        setReminded]        = useState<Set<number>>(new Set())
  const [toast,           setToast]           = useState<string | null>(null)

  function sendReminder(m: ProjectManager) {
    if (reminded.has(m.id)) return
    setReminded(prev => new Set(prev).add(m.id))
    setToast(m.name)
    setTimeout(() => setToast(null), 3200)
  }

  /* filter PM list by search */
  const filteredManagers = MANAGERS.filter(m =>
    !search.trim() ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  )

  function pickManager(m: ProjectManager) {
    setSelectedManager(m)
    setSearch(m.name)
    setSelectedProject(null)
    setState('idle')
    setResultManager(null)
  }

  function clearManager() {
    setSelectedManager(null)
    setSearch('')
    setSelectedProject(null)
    setState('idle')
    setResultManager(null)
  }

  function handleGenerate() {
    setState('loading')
    setResultManager(null)
    setTimeout(() => {
      setResultManager(selectedManager)
      setState('done')
    }, 1000)
  }

  /* displayed projects in the result (filter by selectedProject if any) */
  const displayedProjects = resultManager
    ? selectedProject
      ? resultManager.projects.filter(p => p.project === selectedProject)
      : resultManager.projects
    : []

  const totalPending = resultManager
    ? resultManager.projects.reduce((s, p) => s + p.pendingCount, 0)
    : 0

  /* global stats */
  const totalManagersPending  = MANAGERS.length
  const totalPendingEntries   = MANAGERS.reduce((s, m) => s + m.projects.reduce((ps, p) => ps + p.pendingCount, 0), 0)
  const totalProjectsAffected = new Set(MANAGERS.flatMap(m => m.projects.map(p => p.project))).size

  const STATS = [
    { label: 'Managers w/ Pending',  value: totalManagersPending,  color: '#6366F1', Icon: Users        },
    { label: 'Total Pending Entries', value: totalPendingEntries,  color: '#D97706', Icon: Clock        },
    { label: 'Projects Affected',    value: totalProjectsAffected,  color: '#0A8A58', Icon: AlertCircle  },
    { label: 'Months Tracked',       value: 1,                      color: '#0891B2', Icon: CalendarDays },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes pa-spin    { to { transform: rotate(360deg) } }
        @keyframes paToastIn  { from { opacity:0; transform:translateX(24px) } to { opacity:1; transform:translateX(0) } }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position:'fixed', top:24, right:28, zIndex:99999, display:'flex', alignItems:'center', gap:12, background:'#6366F1', color:'#fff', padding:'13px 20px 13px 14px', borderRadius:14, boxShadow:'0 8px 32px rgba(99,102,241,0.30)', fontFamily:"'DM Sans', system-ui, sans-serif", animation:'paToastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <BellRing size={17} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize:13.5, fontWeight:800, lineHeight:1.3 }}>Reminder Sent</div>
            <div style={{ fontSize:11.5, fontWeight:500, opacity:0.85, marginTop:1 }}>Notification sent to {toast}</div>
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>Pending Approvals</h1>
        <p style={{ margin: '5px 0 0', fontSize: 13.5, color: C.muted }}>
          View pending timesheet approvals by Project Manager — track project-wise and month-wise breakdowns.
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
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Search */}
          <div>
            <p style={labelStyle}>Search Project Manager</p>
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedManager(null); setState('idle'); setResultManager(null) }}
                placeholder="Type to filter managers…"
                style={{
                  width: '100%', height: 38, paddingLeft: 32, paddingRight: search ? 32 : 10,
                  border: `1px solid ${C.border}`, borderRadius: 8,
                  fontSize: 13, color: C.navy, background: C.surface, outline: 'none',
                  fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box', transition: 'border-color 0.15s',
                }}
                onFocus={e => { e.target.style.borderColor = C.navy }}
                onBlur={e => { e.target.style.borderColor = C.border }}
              />
              {search && (
                <button onMouseDown={e => { e.preventDefault(); clearManager() }}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: C.muted, display: 'flex', alignItems: 'center' }}>
                  <X size={13} />
                </button>
              )}
            </div>
          </div>

          {/* PM list — same pill style as projects in PendingTimesheetsPage */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <p style={{ ...labelStyle, margin: 0 }}>Project Managers</p>
              {selectedManager && (
                <button onClick={clearManager} style={{ fontSize: 11, fontWeight: 600, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                  Clear
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {filteredManagers.length === 0 && (
                <p style={{ fontSize: 12.5, color: C.muted, margin: 0 }}>No managers match your search.</p>
              )}
              {filteredManagers.map(m => {
                const active    = selectedManager?.id === m.id
                const totalPend = m.projects.reduce((s, p) => s + p.pendingCount, 0)
                return (
                  <button key={m.id} onClick={() => pickManager(m)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                      border: `1px solid ${active ? 'rgba(99,102,241,0.35)' : C.border}`,
                      background: active ? 'rgba(99,102,241,0.10)' : C.surface,
                      color: active ? '#4B4ECC' : C.navy,
                      cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; e.currentTarget.style.color = '#4B4ECC' } }}
                    onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.navy } }}
                  >
                    {m.name}
                    <span style={{
                      fontSize: 10.5, fontWeight: 700, padding: '2px 6px', borderRadius: 99,
                      background: active ? 'rgba(99,102,241,0.18)' : totalPend === 0 ? 'rgba(139,144,167,0.12)' : 'rgba(245,158,11,0.12)',
                      color: active ? '#4B4ECC' : totalPend === 0 ? C.muted : '#D97706',
                      border: `1px solid ${active ? 'rgba(99,102,241,0.22)' : totalPend === 0 ? 'rgba(139,144,167,0.20)' : 'rgba(245,158,11,0.22)'}`,
                    }}>
                      {totalPend}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Project filter — only when a manager is selected */}
          {selectedManager && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ ...labelStyle, margin: 0 }}>Projects</p>
                {selectedProject && (
                  <button onClick={() => setSelectedProject(null)} style={{ fontSize: 11, fontWeight: 600, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>
                    Clear
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedManager.projects.map(pb => {
                  const active = selectedProject === pb.project
                  const col    = PROJECT_COLORS[pb.project] ?? '#6366F1'
                  return (
                    <button key={pb.project} onClick={() => setSelectedProject(active ? null : pb.project)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '6px 12px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                        border: `1px solid ${active ? `${col}50` : C.border}`,
                        background: active ? `${col}12` : C.surface,
                        color: active ? col : C.navy,
                        cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
                      }}
                      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = `${col}35`; e.currentTarget.style.color = col } }}
                      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.navy } }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: col, flexShrink: 0 }} />
                      {pb.project}
                      <span style={{ fontSize: 10.5, fontWeight: 700, padding: '1px 6px', borderRadius: 99, background: active ? `${col}20` : 'rgba(232,72,85,0.09)', color: active ? col : '#E84855', border: `1px solid ${active ? `${col}25` : 'rgba(232,72,85,0.18)'}` }}>
                        {pb.pendingCount}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Summary */}
          <div style={{ background: C.surface, borderRadius: 10, padding: '12px 14px', border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Summary</div>
            {(selectedManager ? [
              { label: 'Manager',         value: selectedManager.name },
              { label: 'Projects',        value: `${selectedManager.projects.length} mapped` },
              { label: 'Pending entries', value: selectedManager.projects.reduce((s, p) => s + p.pendingCount, 0) },
              { label: 'Month',           value: 'May 2026' },
            ] : [
              { label: 'Total managers',    value: MANAGERS.length },
              { label: 'Pending entries',   value: totalPendingEntries },
              { label: 'Projects affected', value: totalProjectsAffected },
            ]).map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, fontSize: 12.5 }}>
                <span style={{ color: C.muted }}>{item.label}</span>
                <span style={{ fontWeight: 700, color: C.navy }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={state === 'loading'}
            style={{
              width: '100%', height: 42, borderRadius: 10, border: 'none',
              background: state === 'loading' ? '#A0A3B1' : C.navy,
              color: '#fff',
              fontSize: 13.5, fontWeight: 700, cursor: state === 'loading' ? 'default' : 'pointer',
              fontFamily: 'inherit', transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            onMouseEnter={e => { if (state !== 'loading') e.currentTarget.style.background = '#2A3050' }}
            onMouseLeave={e => { if (state !== 'loading') e.currentTarget.style.background = C.navy }}
          >
            {state === 'loading'
              ? <><div style={{ width: 16, height: 16, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'pa-spin 0.75s linear infinite' }} /> Loading…</>
              : <><ClipboardList size={15} strokeWidth={2} /> View Pending Approvals</>
            }
          </button>
        </div>

        {/* ── Right Panel ── */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 20px', minHeight: 460 }}>

          {/* Idle */}
          {state === 'idle' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 380, gap: 14, textAlign: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={24} strokeWidth={1.4} color="#D0D3E4" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.navy }}>No Report Generated Yet</p>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: C.muted, maxWidth: 300, lineHeight: 1.65 }}>
                  Select a Project Manager on the left, then click <strong>View Pending Approvals</strong> to see the breakdown.
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {state === 'loading' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 380, gap: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', border: `3px solid ${C.border}`, borderTopColor: C.navy, animation: 'pa-spin 0.75s linear infinite' }} />
              <p style={{ margin: 0, fontSize: 13.5, color: C.muted, fontWeight: 500 }}>Loading pending approvals…</p>
            </div>
          )}

          {/* Done */}
          {state === 'done' && resultManager && (
            <div>
              {/* Manager header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 18, borderBottom: `1px solid ${C.border}`, marginBottom: 18 }}>
                <img src={`https://i.pravatar.cc/150?img=${resultManager.avatar}`} alt={resultManager.name}
                  style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${C.border}`, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>{resultManager.name}</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{resultManager.role} · {resultManager.email}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(99,102,241,0.09)', color: '#4B4ECC', border: '1px solid rgba(99,102,241,0.18)' }}>
                      {resultManager.projects.length} project{resultManager.projects.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(232,72,85,0.08)', color: '#E84855', border: '1px solid rgba(232,72,85,0.18)' }}>
                      {totalPending} pending entries
                    </span>
                  </div>
                </div>
                {/* Remind button */}
                {(() => {
                  const hasSent = reminded.has(resultManager.id)
                  return (
                    <button
                      onClick={() => sendReminder(resultManager)}
                      disabled={hasSent}
                      style={{ height: 38, padding: '0 16px', borderRadius: 9, border: 'none', flexShrink: 0, fontFamily: 'inherit', fontSize: 12.5, fontWeight: 700, cursor: hasSent ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.14s', background: hasSent ? 'rgba(14,168,106,0.10)' : 'rgba(99,102,241,0.09)', color: hasSent ? '#0A8A58' : '#4B4ECC' }}
                      onMouseEnter={e => { if (!hasSent) e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                      onMouseLeave={e => { if (!hasSent) e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}
                    >
                      {hasSent
                        ? <><Check size={13} strokeWidth={2.5} /> Reminder Sent</>
                        : <><Bell size={13} strokeWidth={1.8} /> Send Reminder</>
                      }
                    </button>
                  )
                })()}
              </div>

              {/* Project breakdown */}
              {displayedProjects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: C.muted, fontSize: 13 }}>
                  No pending approvals for the selected filter.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {displayedProjects.map((pb, i) => (
                    <ProjectCard key={pb.project} pb={pb} defaultOpen={i === 0} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
