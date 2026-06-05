import { useState, useEffect, useRef } from 'react'
import { Search, Clock, Users, AlertCircle, FolderOpen, X, ChevronDown, ChevronUp, CalendarDays, BellRing } from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', surface: '#F7F8FC' }

// ─── Types ───────────────────────────────────────────────────────────────────
interface ManagerEmployee { name: string; avatar: number; role: string; pendingCount: number }
interface ProjectBreakdown { project: string; projectColor: string; month: string; pendingCount: number; employees: ManagerEmployee[] }
interface ProjectManager   { id: number; name: string; avatar: number; email: string; role: string; projects: ProjectBreakdown[] }

// ─── Data ────────────────────────────────────────────────────────────────────
const PROJECT_COLORS: Record<string, string> = {
  'Pulse.AI v2':   '#6366F1',
  'HDFC Portal':   '#0EA5E9',
  'TechCorp ERP':  '#10B981',
  'Retail CRM':    '#F59E0B',
  'FinTrack App':  '#EC4899',
  'CloudSync Pro': '#8B5CF6',
  'MediLink HMS':  '#14B8A6',
}
const PROJECTS = Object.keys(PROJECT_COLORS)

const MANAGERS: ProjectManager[] = [
  { id: 1, name: 'Rohan Mehta',    avatar: 12, email: 'rohan.mehta@concertidc.com',    role: 'Engineering Manager',
    projects: [
      { project: 'Pulse.AI v2',  projectColor: '#6366F1', month: 'May 2026', pendingCount: 8, employees: [
        { name: 'Sarah Johnson', avatar: 47, role: 'Frontend Developer', pendingCount: 3 },
        { name: 'Emma Wilson',   avatar: 44, role: 'UI/UX Designer',     pendingCount: 3 },
        { name: 'Riya Patel',    avatar: 10, role: 'Backend Developer',  pendingCount: 2 },
      ]},
      { project: 'HDFC Portal',  projectColor: '#0EA5E9', month: 'May 2026', pendingCount: 4, employees: [
        { name: 'Mike Chen',    avatar: 33, role: 'QA Engineer',      pendingCount: 2 },
        { name: 'Anjali Singh', avatar: 36, role: 'Product Analyst',  pendingCount: 1 },
        { name: 'Nisha Verma',  avatar: 20, role: 'Business Analyst', pendingCount: 1 },
      ]},
    ],
  },
  { id: 2, name: 'David Brown',    avatar: 8,  email: 'david.brown@concertidc.com',    role: 'Delivery Manager',
    projects: [
      { project: 'TechCorp ERP', projectColor: '#10B981', month: 'May 2026', pendingCount: 9, employees: [
        { name: 'Karthik Nair', avatar: 15, role: 'Frontend Developer',   pendingCount: 3 },
        { name: 'Arjun Mehta',  avatar: 8,  role: 'DevOps Engineer',      pendingCount: 5 },
        { name: 'Deepak Kumar', avatar: 25, role: 'Full Stack Developer',  pendingCount: 1 },
      ]},
      { project: 'Retail CRM',   projectColor: '#F59E0B', month: 'May 2026', pendingCount: 3, employees: [
        { name: 'Kavya Reddy', avatar: 21, role: 'Backend Developer', pendingCount: 2 },
        { name: 'Suresh Iyer', avatar: 52, role: 'QA Engineer',       pendingCount: 1 },
      ]},
      { project: 'FinTrack App', projectColor: '#EC4899', month: 'May 2026', pendingCount: 4, employees: [
        { name: 'Tanvi Desai',  avatar: 46, role: 'Mobile Developer', pendingCount: 2 },
        { name: 'Rahul Khanna', avatar: 3,  role: 'iOS Developer',    pendingCount: 2 },
      ]},
    ],
  },
  { id: 3, name: 'Priya Sharma',   avatar: 31, email: 'priya.sharma@concertidc.com',   role: 'Product Manager',
    projects: [
      { project: 'MediLink HMS',  projectColor: '#14B8A6', month: 'May 2026', pendingCount: 5, employees: [
        { name: 'Arjun Patel',     avatar: 52, role: 'QA Engineer',  pendingCount: 2 },
        { name: 'Fatima Al-Zahra', avatar: 41, role: 'Design Lead',  pendingCount: 3 },
      ]},
      { project: 'CloudSync Pro', projectColor: '#8B5CF6', month: 'May 2026', pendingCount: 4, employees: [
        { name: 'Nikhil Verma', avatar: 37, role: 'SRE Engineer', pendingCount: 2 },
        { name: 'Sneha Iyer',   avatar: 48, role: 'Mobile Lead',  pendingCount: 2 },
      ]},
    ],
  },
  { id: 4, name: 'Anjali Kapoor',  avatar: 36, email: 'anjali.kapoor@concertidc.com',  role: 'Project Lead',
    projects: [
      { project: 'Pulse.AI v2',  projectColor: '#6366F1', month: 'May 2026', pendingCount: 6, employees: [
        { name: 'James Wilson', avatar: 12, role: 'DevOps Engineer', pendingCount: 3 },
        { name: 'Priya Rao',    avatar: 54, role: 'Product Analyst', pendingCount: 3 },
      ]},
    ],
  },
  { id: 5, name: 'Vikram Bose',    avatar: 7,  email: 'vikram.bose@concertidc.com',    role: 'Tech Lead',
    projects: [
      { project: 'CloudSync Pro', projectColor: '#8B5CF6', month: 'May 2026', pendingCount: 5, employees: [
        { name: 'Arun Pillai', avatar: 6,  role: 'Cloud Architect',   pendingCount: 3 },
        { name: 'Divya Rajan', avatar: 48, role: 'Backend Developer', pendingCount: 2 },
      ]},
      { project: 'TechCorp ERP', projectColor: '#10B981', month: 'May 2026', pendingCount: 3, employees: [
        { name: 'Rohit Malhotra', avatar: 64, role: 'QA Engineer',      pendingCount: 2 },
        { name: 'Lakshmi Iyer',   avatar: 63, role: 'Business Analyst', pendingCount: 1 },
      ]},
    ],
  },
  { id: 7, name: 'Ravi Kumar',     avatar: 19, email: 'ravi.kumar@concertidc.com',     role: 'Engineering Lead',
    projects: [
      { project: 'Retail CRM',   projectColor: '#F59E0B', month: 'May 2026', pendingCount: 7, employees: [
        { name: 'Nandini Kapoor', avatar: 60, role: 'Frontend Developer', pendingCount: 3 },
        { name: 'Deepak Verma',   avatar: 56, role: 'Backend Developer',  pendingCount: 2 },
        { name: 'Shreya Menon',   avatar: 41, role: 'QA Engineer',        pendingCount: 2 },
      ]},
      { project: 'FinTrack App', projectColor: '#EC4899', month: 'May 2026', pendingCount: 3, employees: [
        { name: 'Kavitha Reddy', avatar: 21, role: 'Mobile Developer', pendingCount: 2 },
        { name: 'Sanjay Gupta',  avatar: 26, role: 'iOS Developer',    pendingCount: 1 },
      ]},
    ],
  },
  { id: 9, name: 'Arjun Das',      avatar: 43, email: 'arjun.das@concertidc.com',      role: 'Project Manager',
    projects: [
      { project: 'Pulse.AI v2',  projectColor: '#6366F1', month: 'May 2026', pendingCount: 4, employees: [
        { name: 'Radhika Nair', avatar: 50, role: 'Data Engineer',     pendingCount: 2 },
        { name: 'Mohit Verma',  avatar: 29, role: 'Platform Engineer', pendingCount: 2 },
      ]},
      { project: 'CloudSync Pro', projectColor: '#8B5CF6', month: 'May 2026', pendingCount: 2, employees: [
        { name: 'Ishaan Roy', avatar: 57, role: 'DevOps Engineer', pendingCount: 2 },
      ]},
    ],
  },
]

// ─── Project accordion card ──────────────────────────────────────────────────
function ProjectCard({ pb }: { pb: ProjectBreakdown }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden' }}>
      <div
        style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#fff', cursor:'pointer', transition:'background 0.12s' }}
        onClick={() => setOpen(o => !o)}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = C.surface }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = '#fff' }}
      >
        <div style={{ width:34, height:34, borderRadius:9, background:C.surface, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:`1px solid ${C.border}` }}>
          <FolderOpen size={15} strokeWidth={1.8} style={{ color: C.muted }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.navy }}>{pb.project}</div>
          <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:2 }}>
            <CalendarDays size={10} style={{ color:C.muted }} strokeWidth={1.8} />
            <span style={{ fontSize:11, color:C.muted }}>{pb.month}</span>
            <span style={{ fontSize:10, color:C.border }}>·</span>
            <span style={{ fontSize:11, color:C.muted }}>{pb.employees.length} members</span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(232,72,85,0.07)', border:'1px solid rgba(232,72,85,0.18)', borderRadius:9, padding:'5px 11px', flexShrink:0 }}>
          <span style={{ fontSize:17, fontWeight:900, color:'#E84855', lineHeight:1 }}>{pb.pendingCount}</span>
          <span style={{ fontSize:10, fontWeight:700, color:'#E84855', textTransform:'uppercase' as const, letterSpacing:'0.04em' }}>Pending</span>
        </div>
        <div style={{ width:26, height:26, borderRadius:7, background:C.surface, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          {open
            ? <ChevronUp   size={12} strokeWidth={2.2} style={{ color:C.muted }} />
            : <ChevronDown size={12} strokeWidth={2.2} style={{ color:C.muted }} />}
        </div>
      </div>

      {open && (
        <div style={{ borderTop:`1px solid ${C.border}`, background:C.surface }}>
          {pb.employees.map((emp, i) => (
            <div key={emp.name}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 16px', borderBottom: i < pb.employees.length - 1 ? `1px solid ${C.border}` : 'none', transition:'background 0.12s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#ECEEF5' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
            >
              <img src={`https://i.pravatar.cc/150?img=${emp.avatar}`} alt={emp.name}
                style={{ width:34, height:34, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:`1.5px solid ${C.border}` }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:700, color:C.navy }}>{emp.name}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:1 }}>{emp.role}</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:4, background:'#fff', border:`1px solid ${C.border}`, borderRadius:9, padding:'4px 10px', flexShrink:0 }}>
                <Clock size={10} strokeWidth={2} style={{ color:'#D97706' }} />
                <span style={{ fontSize:12, fontWeight:800, color:C.navy }}>{emp.pendingCount}</span>
                <span style={{ fontSize:10, fontWeight:500, color:C.muted }}>{emp.pendingCount === 1 ? 'entry' : 'entries'}</span>
              </div>
            </div>
          ))}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 16px', borderTop:`1px solid ${C.border}`, background:'#fff' }}>
            <div style={{ display:'flex', alignItems:'center', gap:5 }}>
              <CalendarDays size={11} style={{ color:C.muted }} strokeWidth={1.8} />
              <span style={{ fontSize:11.5, fontWeight:600, color:C.muted }}>Pending for {pb.month}</span>
            </div>
            <span style={{ fontSize:11.5, fontWeight:700, color:'#E84855' }}>{pb.pendingCount} total pending</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function PendingApprovalsPage() {
  const [searchQuery,      setSearchQuery]      = useState('')
  const [showSuggestions,  setShowSuggestions]  = useState(false)
  const [selectedManagers, setSelectedManagers] = useState<ProjectManager[]>([])
  const [allSelected,      setAllSelected]      = useState(false)
  const [selectedProject,  setSelectedProject]  = useState('')
  const [state,            setState]            = useState<'loading'|'done'>('loading')
  const [reminded,         setReminded]         = useState<Set<number>>(new Set())
  const [toast,            setToast]            = useState<string|null>(null)
  const [fromDate,         setFromDate]         = useState('')
  const [toDate,           setToDate]           = useState('')
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setState('done'), 1500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const suggestions = MANAGERS.filter(m =>
    (m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     m.role.toLowerCase().includes(searchQuery.toLowerCase())) &&
    !selectedManagers.find(s => s.id === m.id)
  )

  function addManager(m: ProjectManager) {
    setSelectedManagers(prev => [...prev, m])
    setSearchQuery('')
    setShowSuggestions(false)
    setAllSelected(false)
  }
  function removeManager(id: number) {
    setSelectedManagers(prev => prev.filter(m => m.id !== id))
    setAllSelected(false)
  }
  function selectAll() {
    setAllSelected(true)
    setSelectedManagers([])
    setSearchQuery('')
    setShowSuggestions(false)
  }
  function clearManagers() {
    setAllSelected(false)
    setSelectedManagers([])
    setSearchQuery('')
  }
  function sendReminder(m: ProjectManager) {
    if (reminded.has(m.id)) return
    setReminded(prev => new Set(prev).add(m.id))
    setToast(m.name)
    setTimeout(() => setToast(null), 3200)
    setTimeout(() => setReminded(prev => { const s = new Set(prev); s.delete(m.id); return s }), 5000)
  }

  const filtered = MANAGERS.filter(m => {
    const mgrMatch  = allSelected || selectedManagers.length === 0 || selectedManagers.some(s => s.id === m.id)
    const projMatch = !selectedProject || m.projects.some(p => p.project === selectedProject)
    return mgrMatch && projMatch && m.projects.length > 0
  })

  const hasFilter = allSelected || selectedManagers.length > 0

  const managersWithPending = MANAGERS.filter(m => m.projects.length > 0).length
  const projectsAffected    = new Set(MANAGERS.flatMap(m => m.projects.map(p => p.project))).size

  const STATS = [
    { label: 'Managers w/ Pending', value: managersWithPending, color: '#6366F1', Icon: Users       },
    { label: 'Projects Affected',   value: projectsAffected,   color: '#0A8A58', Icon: AlertCircle  },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes toastIn   { from { opacity:0; transform:translateX(24px) } to { opacity:1; transform:translateX(0) } }
        @keyframes pa-spin   { to   { transform: rotate(360deg) } }
        @keyframes paFadeIn  { from { opacity:0; transform:translateY(5px) } to { opacity:1; transform:translateY(0) } }
        @keyframes paShimmer { 0%,100% { opacity:1 } 50% { opacity:0.38 } }
        .pa-sugg:hover { background: #F7F8FC !important; }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position:'fixed', top:24, right:28, zIndex:99999, display:'flex', alignItems:'center', gap:12, background:'#6366F1', color:'#fff', padding:'13px 20px 13px 14px', borderRadius:14, boxShadow:'0 8px 32px rgba(99,102,241,0.30)', fontFamily:"'DM Sans', system-ui, sans-serif", animation:'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <div style={{ width:32, height:32, borderRadius:9, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <BellRing size={17} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontSize:13.5, fontWeight:800, lineHeight:1.3 }}>Reminder Sent</div>
            <div style={{ fontSize:11.5, fontWeight:500, opacity:0.85, marginTop:1 }}>Notification sent to {toast}</div>
          </div>
        </div>
      )}

      {/* ── Page header + stats ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, marginBottom:20 }}>
        <div>
          <h1 style={{ margin:0, fontSize:20, fontWeight:700, color:C.navy }}>Pending Approvals</h1>
          <p style={{ margin:'5px 0 0', fontSize:13.5, color:C.muted }}>
            Monitor timesheet approvals pending from Project Managers across all projects.
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 14px', background:'#fff', border:`1px solid ${C.border}`, borderRadius:12 }}>
              <s.Icon size={14} color={s.color} strokeWidth={2} />
              <span style={{ fontSize:15, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</span>
              <span style={{ fontSize:11.5, fontWeight:500, color:C.muted, whiteSpace:'nowrap' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius: hasFilter ? '16px 16px 0 0' : '16px', padding:'14px 20px', marginBottom:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>

          {/* Manager search */}
          <div ref={searchRef} style={{ flex:'1 1 200px', minWidth:160, position:'relative' }}>
            <Search size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:C.muted, pointerEvents:'none' }} />
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); if (allSelected) setAllSelected(false) }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={e => { if (e.key === 'Escape') setShowSuggestions(false) }}
              placeholder={allSelected ? 'All managers selected' : selectedManagers.length > 0 ? 'Add another manager…' : 'Search manager…'}
              style={{ width:'100%', height:44, paddingLeft:38, paddingRight: searchQuery ? 34 : 12, border:'1px solid #ECEEF6', borderRadius:11, fontSize:13.5, color:C.navy, background:C.surface, outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.15s' }}
              onFocusCapture={e => { e.currentTarget.style.borderColor = '#B0B5CC' }}
              onBlurCapture={e => { e.currentTarget.style.borderColor = '#ECEEF6' }}
            />
            {searchQuery && (
              <button onMouseDown={e => { e.preventDefault(); setSearchQuery('') }}
                style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:2, color:C.muted, display:'flex', alignItems:'center' }}>
                <X size={13} />
              </button>
            )}
            {showSuggestions && (
              <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, zIndex:200, background:'#fff', border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden', boxShadow:'0 8px 24px rgba(28,32,53,0.10)', maxHeight:220, overflowY:'auto' }}>
                {!allSelected && (
                  <button onMouseDown={e => { e.preventDefault(); selectAll() }}
                    style={{ width:'100%', padding:'9px 12px', border:'none', borderBottom:`1px solid ${C.border}`, background:'#F5F7FF', cursor:'pointer', fontFamily:'inherit', fontSize:12.5, fontWeight:600, color:'#4338CA', textAlign:'left', display:'flex', alignItems:'center', gap:6 }}>
                    <Users size={12} strokeWidth={2} /> Select All Managers
                  </button>
                )}
                {suggestions.length === 0 && searchQuery ? (
                  <div style={{ padding:'12px 14px', fontSize:12.5, color:C.muted, textAlign:'center' }}>No managers found</div>
                ) : suggestions.slice(0, 7).map((m, i) => (
                  <button key={m.id} onMouseDown={e => { e.preventDefault(); addManager(m) }}
                    className="pa-sugg"
                    style={{ width:'100%', padding:'9px 12px', border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:10, fontFamily:'inherit', transition:'background 0.1s', borderBottom: i < Math.min(suggestions.length, 7) - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <img src={`https://i.pravatar.cc/150?img=${m.avatar}`} style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
                    <div style={{ textAlign:'left', minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:C.navy }}>{m.name}</div>
                      <div style={{ fontSize:11, color:C.muted }}>{m.role}</div>
                    </div>
                    <span style={{ fontSize:10.5, fontWeight:700, color:'#D97706', background:'rgba(245,158,11,0.10)', border:'1px solid rgba(245,158,11,0.20)', borderRadius:5, padding:'2px 7px', flexShrink:0, marginLeft:'auto' }}>
                      {m.projects.reduce((s, p) => s + p.pendingCount, 0)} pending
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project filter */}
          <div style={{ width:240, flexShrink:0, position:'relative' }}>
            <select
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
              style={{ width:'100%', height:44, padding:'0 32px 0 12px', border:'1px solid #ECEEF6', borderRadius:11, fontSize:13.5, color:C.muted, background:C.surface, outline:'none', cursor:'pointer', fontFamily:'inherit', appearance:'none', transition:'border-color 0.15s' }}
              onFocus={e => { e.currentTarget.style.borderColor = '#B0B5CC' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#ECEEF6' }}
            >
              <option value="">All Projects</option>
              {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown size={13} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', color:C.muted, pointerEvents:'none' }} />
          </div>

          {/* From / To date range */}
          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
            <span style={{ fontSize:12.5, fontWeight:600, color:C.muted, whiteSpace:'nowrap' }}>From</span>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
              style={{ height:44, padding:'0 12px', border:'1px solid #ECEEF6', borderRadius:11, fontSize:13, color: fromDate ? C.navy : C.muted, background:C.surface, outline:'none', cursor:'pointer', fontFamily:'inherit', transition:'border-color 0.15s', width:150 }}
              onFocus={e => { e.target.style.borderColor = '#B0B5CC' }}
              onBlur={e => { e.target.style.borderColor = '#ECEEF6' }} />
            <span style={{ fontSize:12.5, fontWeight:600, color:C.muted, whiteSpace:'nowrap' }}>To</span>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
              style={{ height:44, padding:'0 12px', border:'1px solid #ECEEF6', borderRadius:11, fontSize:13, color: toDate ? C.navy : C.muted, background:C.surface, outline:'none', cursor:'pointer', fontFamily:'inherit', transition:'border-color 0.15s', width:150 }}
              onFocus={e => { e.target.style.borderColor = '#B0B5CC' }}
              onBlur={e => { e.target.style.borderColor = '#ECEEF6' }} />
          </div>

        </div>
      </div>

      {/* ── Selected manager chips ── */}
      {hasFilter && (
        <div style={{ background:'#FAFBFF', border:`1px solid ${C.border}`, borderTop:'none', borderRadius:'0 0 16px 16px', padding:'10px 20px 12px', marginBottom:20, display:'flex', alignItems:'center', flexWrap:'wrap' as const, gap:7 }}>
          <span style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', marginRight:2, flexShrink:0 }}>Selected:</span>
          {allSelected ? (
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, height:28, padding:'0 8px 0 10px', background:'#EEF2FF', border:'1px solid #C7D2FE', borderRadius:99 }}>
              <Users size={11} style={{ color:'#4338CA', flexShrink:0 }} strokeWidth={2} />
              <span style={{ fontSize:12, fontWeight:600, color:'#3730A3' }}>All Managers</span>
              <button onClick={clearManagers} style={{ width:15, height:15, borderRadius:'50%', border:'none', background:'#C7D2FE', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, padding:0 }}>
                <X size={8} style={{ color:'#4338CA' }} />
              </button>
            </div>
          ) : selectedManagers.map(m => (
            <div key={m.id} style={{ display:'inline-flex', alignItems:'center', gap:6, height:28, padding:'0 8px 0 4px', background:'#EEF2FF', border:'1px solid #C7D2FE', borderRadius:99 }}>
              <img src={`https://i.pravatar.cc/150?img=${m.avatar}`} style={{ width:20, height:20, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
              <span style={{ fontSize:12, fontWeight:600, color:'#3730A3', maxWidth:110, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{m.name}</span>
              <button onClick={() => removeManager(m.id)} style={{ width:15, height:15, borderRadius:'50%', border:'none', background:'#C7D2FE', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, padding:0 }}>
                <X size={8} style={{ color:'#4338CA' }} />
              </button>
            </div>
          ))}
        </div>
      )}
      {!hasFilter && <div style={{ marginBottom:20 }} />}

      {/* ── Skeleton loading ── */}
      {state === 'loading' && (
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, padding:'20px', animation:'paFadeIn 0.22s ease-out' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'16px 18px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:46, height:46, borderRadius:'50%', background:'#E4E6EF', flexShrink:0, animation:`paShimmer 1.6s ease-in-out ${i*0.18}s infinite` }} />
                  <div style={{ flex:1 }}>
                    <div style={{ height:13, width:'32%', borderRadius:6, background:'#E4E6EF', animation:`paShimmer 1.6s ease-in-out ${i*0.18}s infinite`, marginBottom:9 }} />
                    <div style={{ height:11, width:'50%', borderRadius:6, background:'#E4E6EF', animation:`paShimmer 1.6s ease-in-out ${i*0.18+0.1}s infinite`, marginBottom:9 }} />
                    <div style={{ display:'flex', gap:6 }}>
                      <div style={{ height:22, width:90, borderRadius:11, background:'#E4E6EF', animation:`paShimmer 1.6s ease-in-out ${i*0.18+0.2}s infinite` }} />
                      <div style={{ height:22, width:80, borderRadius:11, background:'#E4E6EF', animation:`paShimmer 1.6s ease-in-out ${i*0.18+0.25}s infinite` }} />
                    </div>
                  </div>
                  <div style={{ height:36, width:100, borderRadius:9, background:'#E4E6EF', flexShrink:0, animation:`paShimmer 1.6s ease-in-out ${i*0.18}s infinite` }} />
                </div>
                <div style={{ marginTop:14, display:'flex', flexDirection:'column' as const, gap:8 }}>
                  {[0,1].slice(0, i % 2 === 0 ? 2 : 1).map(j => (
                    <div key={j} style={{ height:58, borderRadius:12, background:'#E4E6EF', animation:`paShimmer 1.6s ease-in-out ${i*0.18+j*0.1}s infinite` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Manager cards ── */}
      {state === 'done' && (
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, padding:'20px', animation:'paFadeIn 0.22s ease-out' }}>

          {/* Toolbar */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <span style={{ fontSize:14, fontWeight:700, color:C.navy }}>
                {allSelected ? 'All Managers' : selectedManagers.length > 0 ? selectedManagers.map(m => m.name).join(', ') : selectedProject ? selectedProject : 'All Pending Managers'}
              </span>
              <span style={{ fontSize:13, color:C.muted, marginLeft:10 }}>
                {filtered.length} manager{filtered.length !== 1 ? 's' : ''} · {filtered.reduce((s, m) => s + m.projects.reduce((ps, p) => ps + p.pendingCount, 0), 0)} pending entries
              </span>
            </div>
            {filtered.some(m => !reminded.has(m.id)) && (
              <button
                onClick={() => { filtered.filter(m => !reminded.has(m.id)).forEach(m => sendReminder(m)) }}
                style={{ height:36, padding:'0 16px', borderRadius:9, border:'none', background:'rgba(99,102,241,0.09)', color:'#4B4ECC', fontSize:12.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:6, transition:'background 0.14s', flexShrink:0 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}>
                <BellRing size={13} strokeWidth={2} /> Remind All
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 0', gap:12 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:C.surface, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Search size={22} strokeWidth={1.4} color="#D0D3E4" />
              </div>
              <p style={{ margin:0, fontSize:14, fontWeight:600, color:C.navy }}>No managers found</p>
              <p style={{ margin:0, fontSize:13, color:C.muted }}>Try a different search or project filter</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {filtered.map(m => {
                const totalPend  = m.projects.reduce((s, p) => s + p.pendingCount, 0)
                return (
                  <div key={m.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'16px 18px' }}>

                    {/* Manager info row */}
                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                      <img src={`https://i.pravatar.cc/150?img=${m.avatar}`} alt={m.name}
                        style={{ width:46, height:46, borderRadius:'50%', objectFit:'cover', border:`2px solid ${C.border}`, flexShrink:0 }} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:C.navy }}>{m.name}</div>
                        <div style={{ fontSize:12, color:C.muted, marginTop:1 }}>{m.role}</div>
                        <div style={{ display:'flex', flexWrap:'wrap' as const, gap:5, marginTop:6 }}>
                          {m.projects.map(p => (
                            <div key={p.project} style={{ display:'inline-flex', alignItems:'center', gap:4, background:`${p.projectColor}10`, border:`1px solid ${p.projectColor}28`, padding:'2px 8px', borderRadius:12 }}>
                              <span style={{ fontSize:11, fontWeight:700, color:p.projectColor }}>{p.project}</span>
                              <span style={{ fontSize:10, fontWeight:800, color:p.projectColor, background:`${p.projectColor}22`, borderRadius:4, padding:'0 4px', lineHeight:'15px' }}>{p.pendingCount}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ flexShrink:0, display:'flex', alignItems:'center', gap:5, background:'rgba(28,32,53,0.05)', border:`1px solid ${C.border}`, borderRadius:9, padding:'5px 11px' }}>
                        <span style={{ fontSize:15, fontWeight:800, color:C.navy, lineHeight:1 }}>{totalPend}</span>
                        <span style={{ fontSize:10.5, fontWeight:600, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.04em' }}>Total</span>
                      </div>
                    </div>

                    {/* Project accordions */}
                    <div style={{ marginTop:14, display:'flex', flexDirection:'column', gap:8 }}>
                      {(selectedProject
                        ? m.projects.filter(p => p.project === selectedProject)
                        : m.projects
                      ).map(pb => <ProjectCard key={pb.project} pb={pb} />)}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
