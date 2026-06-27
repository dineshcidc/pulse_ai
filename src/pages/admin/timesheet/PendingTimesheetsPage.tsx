import { useState, useRef, useEffect } from 'react'
import { Search, Clock, Users, AlertCircle, BellRing, X, ChevronDown, Clipboard } from 'lucide-react'

// ─── Design tokens ──────────────────────────────────────────────────────────────
const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

// ─── Types ──────────────────────────────────────────────────────────────────────
interface ProjectEntry { name: string; color: string; pending: number }

interface PendingEmployee {
  id:          number
  employee:    string
  avatar:      number
  role:        string
  department:  string
  projects:    ProjectEntry[]
  pendingDates: string[]
}

// ─── Data ───────────────────────────────────────────────────────────────────────
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
  { id: 1,  employee: 'Sarah Johnson',  avatar: 47, role: 'Frontend Developer',   department: 'Engineering',       projects: [{ name:'Pulse.AI v2', color:'#6366F1', pending:9 }, { name:'TechCorp ERP', color:'#10B981', pending:6 }], pendingDates: ['2026-05-12','2026-05-13','2026-05-14','2026-05-15','2026-05-18','2026-05-19','2026-05-20','2026-05-21','2026-05-22','2026-05-26','2026-05-27','2026-05-28','2026-05-29','2026-06-01','2026-06-02'] },
  { id: 2,  employee: 'Mike Chen',      avatar: 33, role: 'QA Engineer',          department: 'Quality Assurance', projects: [{ name:'HDFC Portal',  color:'#0EA5E9', pending:2 }],                                                       pendingDates: ['2026-05-28','2026-05-29'] },
  { id: 3,  employee: 'Emma Wilson',    avatar: 44, role: 'UI/UX Designer',       department: 'Design',            projects: [{ name:'Pulse.AI v2', color:'#6366F1', pending:5 }, { name:'Retail CRM',   color:'#F59E0B', pending:5 }], pendingDates: ['2026-05-19','2026-05-20','2026-05-21','2026-05-22','2026-05-26','2026-05-27','2026-05-28','2026-05-29','2026-06-01','2026-06-02'] },
  { id: 4,  employee: 'Anjali Singh',   avatar: 36, role: 'Product Analyst',      department: 'Product',           projects: [{ name:'HDFC Portal',  color:'#0EA5E9', pending:1 }],                                                       pendingDates: ['2026-05-29'] },
  { id: 5,  employee: 'Karthik Nair',   avatar: 15, role: 'Frontend Developer',   department: 'Engineering',       projects: [{ name:'TechCorp ERP', color:'#10B981', pending:3 }],                                                       pendingDates: ['2026-05-27','2026-05-28','2026-05-29'] },
  { id: 6,  employee: 'Riya Patel',     avatar: 10, role: 'Backend Developer',    department: 'Engineering',       projects: [{ name:'Pulse.AI v2', color:'#6366F1', pending:1 }, { name:'CloudSync Pro', color:'#8B5CF6', pending:1 }], pendingDates: ['2026-05-28','2026-05-29'] },
  { id: 7,  employee: 'Arjun Mehta',    avatar: 8,  role: 'DevOps Engineer',      department: 'Infrastructure',    projects: [{ name:'TechCorp ERP', color:'#10B981', pending:4 }, { name:'MediLink HMS',  color:'#14B8A6', pending:4 }], pendingDates: ['2026-05-20','2026-05-21','2026-05-22','2026-05-23','2026-05-26','2026-05-27','2026-05-28','2026-05-29'] },
  { id: 8,  employee: 'Nisha Verma',    avatar: 20, role: 'Business Analyst',     department: 'Consulting',        projects: [{ name:'HDFC Portal',  color:'#0EA5E9', pending:2 }],                                                       pendingDates: ['2026-05-28','2026-05-29'] },
  { id: 9,  employee: 'Deepak Kumar',   avatar: 25, role: 'Full Stack Developer', department: 'Engineering',       projects: [{ name:'TechCorp ERP', color:'#10B981', pending:1 }],                                                       pendingDates: ['2026-05-29'] },
  { id: 10, employee: 'Priya Sharma',   avatar: 38, role: 'Scrum Master',         department: 'Delivery',          projects: [{ name:'Pulse.AI v2', color:'#6366F1', pending:2 }, { name:'FinTrack App',  color:'#EC4899', pending:1 }], pendingDates: ['2026-05-27','2026-05-28','2026-05-29'] },
]

const PROJECTS = Object.keys(PROJECT_COLORS)

// ─── Helpers ────────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function PendingTimesheetsPage() {
  const [searchQuery,      setSearchQuery]      = useState('')
  const [showSuggestions,  setShowSuggestions]  = useState(false)
  const [selectedEmps,    setSelectedEmps]    = useState<PendingEmployee[]>([])
  const [allSelected,     setAllSelected]     = useState(false)
  const [selectedProject, setSelectedProject] = useState('')
  const [reminded,         setReminded]         = useState<Set<number>>(new Set())
  const [toast,            setToast]            = useState<string | null>(null)
  const [state,            setState]            = useState<'idle'|'loading'|'done'>('loading')
  const [popupEmp,         setPopupEmp]         = useState<PendingEmployee | null>(null)
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

  const suggestions = DATA.filter(r =>
    (r.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
     r.department.toLowerCase().includes(searchQuery.toLowerCase())) &&
    !selectedEmps.find(e => e.id === r.id)
  )

  function addEmp(emp: PendingEmployee) {
    setSelectedEmps(prev => [...prev, emp])
    setSearchQuery('')
    setShowSuggestions(false)
    setAllSelected(false)
  }

  function removeEmp(id: number) {
    setSelectedEmps(prev => prev.filter(e => e.id !== id))
    setAllSelected(false)
  }

  function selectAll() {
    setAllSelected(true)
    setSelectedEmps([])
    setSearchQuery('')
    setShowSuggestions(false)
  }

  function clearEmps() {
    setAllSelected(false)
    setSelectedEmps([])
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

  const filtered = DATA.filter(r => {
    const empMatch  = allSelected || selectedEmps.length === 0 || selectedEmps.some(e => e.id === r.id)
    const projMatch = !selectedProject || r.projects.some(p => p.name === selectedProject)
    return empMatch && projMatch
  })

  const projectsAffected = PROJECTS.length

  const STATS = [
    { label: 'Employees Pending',  value: DATA.length,      color: '#6366F1', Icon: Users       },
    { label: 'Projects Affected',  value: projectsAffected, color: '#0A8A58', Icon: AlertCircle },
  ]

  const hasEmpFilter = allSelected || selectedEmps.length > 0

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes toastIn   { from { opacity:0; transform:translateX(24px) } to { opacity:1; transform:translateX(0) } }
        @keyframes pt-spin   { to   { transform: rotate(360deg) } }
        @keyframes ptFadeIn  { from { opacity:0; transform:translateY(5px) } to { opacity:1; transform:translateY(0) } }
        @keyframes ptShimmer { 0%,100% { opacity:1 } 50% { opacity:0.38 } }
        .pt-sugg:hover { background: #F7F8FC !important; }
        .pt-proj:hover { border-color: rgba(99,102,241,0.25) !important; color: #4B4ECC !important; }
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

      {/* ── Page Header + inline stats ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:24, marginBottom:20 }}>
        <div>
          <h1 style={{ margin:0, fontSize:20, fontWeight:700, color:C.navy }}>Pending Timesheets</h1>
          <p style={{ margin:'5px 0 0', fontSize:13.5, color:C.muted }}>
            Monitor outstanding timesheet submissions and send instant reminders to employees.
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
      <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius: hasEmpFilter ? '16px 16px 0 0' : '16px', padding:'14px 20px', marginBottom:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>

          {/* Employee search */}
          <div ref={searchRef} style={{ flex:'1 1 200px', minWidth:160, position:'relative' }}>
            <Search size={14} style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:C.muted, pointerEvents:'none' }} />
            <input
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true); if (allSelected) { setAllSelected(false) } }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={e => { if (e.key === 'Escape') setShowSuggestions(false) }}
              placeholder={allSelected ? 'All employees selected' : selectedEmps.length > 0 ? 'Add another employee…' : 'Search employee…'}
              style={{ width:'100%', height:38, paddingLeft:38, paddingRight: searchQuery ? 34 : 12, border:'1px solid #ECEEF6', borderRadius:11, fontSize:13.5, color:C.navy, background:'#fff', outline:'none', fontFamily:'inherit', boxSizing:'border-box', transition:'border-color 0.15s' }}
              onFocusCapture={e => { e.currentTarget.style.borderColor = '#B0B5CC' }}
              onBlurCapture={e => { e.currentTarget.style.borderColor = '#ECEEF6' }}
            />
            {searchQuery && (
              <button onMouseDown={e => { e.preventDefault(); setSearchQuery('') }}
                style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:2, color:C.muted, display:'flex', alignItems:'center' }}>
                <X size={13} />
              </button>
            )}

            {/* Dropdown */}
            {showSuggestions && (
              <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, zIndex:200, background:'#fff', border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden', boxShadow:'0 8px 24px rgba(28,32,53,0.10)', maxHeight:220, overflowY:'auto' }}>
                {!allSelected && (
                  <button onMouseDown={e => { e.preventDefault(); selectAll() }}
                    style={{ width:'100%', padding:'9px 12px', border:'none', borderBottom:`1px solid ${C.border}`, background:'#F5F7FF', cursor:'pointer', fontFamily:'inherit', fontSize:12.5, fontWeight:600, color:'#4338CA', textAlign:'left', display:'flex', alignItems:'center', gap:6 }}>
                    <Users size={12} strokeWidth={2} /> Select All Employees
                  </button>
                )}
                {suggestions.length === 0 && searchQuery ? (
                  <div style={{ padding:'12px 14px', fontSize:12.5, color:C.muted, textAlign:'center' }}>No employees found</div>
                ) : suggestions.slice(0, 7).map((emp, i) => (
                  <button key={emp.id} onMouseDown={e => { e.preventDefault(); addEmp(emp) }}
                    className="pt-sugg"
                    style={{ width:'100%', padding:'9px 12px', border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:10, fontFamily:'inherit', transition:'background 0.1s', borderBottom: i < Math.min(suggestions.length, 7) - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <img src={`https://i.pravatar.cc/150?img=${((emp.avatar-1)%70)+1}`} style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
                    <div style={{ textAlign:'left', minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:C.navy }}>{emp.employee}</div>
                      <div style={{ fontSize:11, color:C.muted }}>{emp.role}</div>
                    </div>
                    <span style={{ fontSize:10.5, fontWeight:700, color:'#D97706', background:'rgba(245,158,11,0.10)', border:'1px solid rgba(245,158,11,0.20)', borderRadius:5, padding:'2px 7px', flexShrink:0, marginLeft:'auto' }}>
                      {emp.projects.reduce((s, p) => s + p.pending, 0)} pending
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
              style={{ width:'100%', height:38, padding:'0 32px 0 12px', border:'1px solid #ECEEF6', borderRadius:11, fontSize:13.5, color:C.muted, background:'#fff', outline:'none', cursor:'pointer', fontFamily:'inherit', appearance:'none', transition:'border-color 0.15s' }}
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
              style={{ height:38, padding:'0 12px', border:'1px solid #ECEEF6', borderRadius:11, fontSize:13, color: fromDate ? C.navy : C.muted, background:C.surface, outline:'none', cursor:'pointer', fontFamily:'inherit', transition:'border-color 0.15s', width:150 }}
              onFocus={e => { e.target.style.borderColor = '#B0B5CC' }}
              onBlur={e => { e.target.style.borderColor = '#ECEEF6' }} />
            <span style={{ fontSize:12.5, fontWeight:600, color:C.muted, whiteSpace:'nowrap' }}>To</span>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
              style={{ height:38, padding:'0 12px', border:'1px solid #ECEEF6', borderRadius:11, fontSize:13, color: toDate ? C.navy : C.muted, background:C.surface, outline:'none', cursor:'pointer', fontFamily:'inherit', transition:'border-color 0.15s', width:150 }}
              onFocus={e => { e.target.style.borderColor = '#B0B5CC' }}
              onBlur={e => { e.target.style.borderColor = '#ECEEF6' }} />
          </div>

        </div>
      </div>

      {/* ── Selected employee chips row (below filter bar) ── */}
      {hasEmpFilter && (
        <div style={{ background:'#FAFBFF', border:`1px solid ${C.border}`, borderTop:'none', borderRadius:'0 0 16px 16px', padding:'10px 20px 12px', marginBottom:20, display:'flex', alignItems:'center', flexWrap:'wrap', gap:7 }}>
          <span style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', marginRight:2, flexShrink:0 }}>Selected:</span>
          {allSelected ? (
            <div style={{ display:'inline-flex', alignItems:'center', gap:7, height:28, padding:'0 8px 0 10px', background:'#EEF2FF', border:'1px solid #C7D2FE', borderRadius:99 }}>
              <Users size={11} style={{ color:'#4338CA', flexShrink:0 }} strokeWidth={2} />
              <span style={{ fontSize:12, fontWeight:600, color:'#3730A3' }}>All Employees</span>
              <button onClick={clearEmps} style={{ width:15, height:15, borderRadius:'50%', border:'none', background:'#C7D2FE', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, padding:0 }}>
                <X size={8} style={{ color:'#4338CA' }} />
              </button>
            </div>
          ) : selectedEmps.map(emp => (
            <div key={emp.id} style={{ display:'inline-flex', alignItems:'center', gap:6, height:28, padding:'0 8px 0 4px', background:'#EEF2FF', border:'1px solid #C7D2FE', borderRadius:99 }}>
              <img src={`https://i.pravatar.cc/150?img=${((emp.avatar-1)%70)+1}`} style={{ width:20, height:20, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
              <span style={{ fontSize:12, fontWeight:600, color:'#3730A3', maxWidth:110, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{emp.employee}</span>
              <button onClick={() => removeEmp(emp.id)} style={{ width:15, height:15, borderRadius:'50%', border:'none', background:'#C7D2FE', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, padding:0 }}>
                <X size={8} style={{ color:'#4338CA' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* spacer when no chips row */}
      {!hasEmpFilter && <div style={{ marginBottom:20 }} />}

      {/* ── Results ── */}

      {/* Idle */}
      {state === 'idle' && (
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, padding:'60px 48px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, textAlign:'center', animation:'ptFadeIn 0.22s ease-out' }}>
          <div style={{ width:56, height:56, borderRadius:16, background:C.surface, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Clipboard size={24} strokeWidth={1.4} color="#D0D3E4" />
          </div>
          <div>
            <p style={{ margin:0, fontSize:15, fontWeight:700, color:C.navy }}>No Report Generated Yet</p>
            <p style={{ margin:'6px 0 0', fontSize:13, color:C.muted, maxWidth:320, lineHeight:1.65 }}>
              Use the filters above and click <strong>Generate</strong> to view pending timesheet results.
            </p>
          </div>
        </div>
      )}

      {/* Loading — skeleton cards */}
      {state === 'loading' && (
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, padding:'20px', animation:'ptFadeIn 0.22s ease-out' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'16px 18px', display:'flex', alignItems:'center' }}>
                {/* Left skeleton */}
                <div style={{ display:'flex', alignItems:'center', gap:14, flex:1 }}>
                  <div style={{ width:46, height:46, borderRadius:'50%', background:'#E4E6EF', flexShrink:0, animation:`ptShimmer 1.6s ease-in-out ${i*0.18}s infinite` }} />
                  <div style={{ flex:1 }}>
                    <div style={{ height:13, width:'38%', borderRadius:6, background:'#E4E6EF', animation:`ptShimmer 1.6s ease-in-out ${i*0.18}s infinite`, marginBottom:9 }} />
                    <div style={{ height:11, width:'56%', borderRadius:6, background:'#E4E6EF', animation:`ptShimmer 1.6s ease-in-out ${i*0.18+0.1}s infinite`, marginBottom:9 }} />
                    <div style={{ height:22, width:'30%', borderRadius:11, background:'#E4E6EF', animation:`ptShimmer 1.6s ease-in-out ${i*0.18+0.2}s infinite` }} />
                  </div>
                </div>
                {/* Right skeleton */}
                <div style={{ flexShrink:0, minWidth:220, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, paddingLeft:18 }}>
                  <div style={{ height:10, width:78, borderRadius:5, background:'#E4E6EF', animation:`ptShimmer 1.6s ease-in-out ${i*0.18}s infinite` }} />
                  <div style={{ display:'flex', gap:5, flexWrap:'wrap' as const, justifyContent:'flex-end' }}>
                    {[64,56,68,56,64].map((w, j) => (
                      <div key={j} style={{ height:26, width:w, borderRadius:7, background:'#E4E6EF', animation:`ptShimmer 1.6s ease-in-out ${i*0.18+j*0.06}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {state === 'done' && (
        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, padding:'20px', animation:'ptFadeIn 0.22s ease-out' }}>

          {/* Results toolbar */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <span style={{ fontSize:14, fontWeight:700, color:C.navy }}>
                {allSelected
                  ? 'All Employees'
                  : selectedEmps.length > 0
                    ? selectedEmps.map(e => e.employee).join(', ')
                    : selectedProject
                      ? selectedProject
                      : 'All Pending Employees'}
              </span>
              <span style={{ fontSize:13, color:C.muted, marginLeft:10 }}>
                {filtered.length} employee{filtered.length !== 1 ? 's' : ''} · {filtered.reduce((s,r) => s + r.projects.reduce((ss,p) => ss + p.pending, 0), 0)} pending entries
              </span>
            </div>
            {filtered.some(r => !reminded.has(r.id)) && (
              <button
                onClick={() => {
                  const ids = filtered.filter(r => !reminded.has(r.id))
                  ids.forEach(r => sendReminder(r))
                  if (ids.length > 1) { setToast(`${ids.length} employees`); setTimeout(() => setToast(null), 3200) }
                }}
                style={{ height:36, padding:'0 16px', borderRadius:9, border:'none', background:'rgba(99,102,241,0.09)', color:'#4B4ECC', fontSize:12.5, fontWeight:700, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:6, transition:'background 0.14s', flexShrink:0 }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}>
                <BellRing size={13} strokeWidth={2} /> Remind All
              </button>
            )}
          </div>

          {/* Employee cards — full width */}
          {filtered.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 0', gap:12 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:C.surface, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Search size={22} strokeWidth={1.4} color="#D0D3E4" />
              </div>
              <p style={{ margin:0, fontSize:14, fontWeight:600, color:C.navy }}>No employees found</p>
              <p style={{ margin:0, fontSize:13, color:C.muted }}>Try a different search or select another project</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {filtered.map((row) => {
                return (
                  <div key={row.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'16px 18px', display:'flex', alignItems:'center', gap:0 }}>

                      {/* Left: avatar + employee info */}
                      <div style={{ display:'flex', alignItems:'center', gap:14, flex:1, minWidth:0 }}>
                        <img src={`https://i.pravatar.cc/150?img=${row.avatar}`} alt={row.employee}
                          style={{ width:46, height:46, borderRadius:'50%', objectFit:'cover', border:`2px solid ${C.border}`, flexShrink:0 }} />
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:14, fontWeight:700, color:C.navy }}>{row.employee}</div>
                          <div style={{ fontSize:12, color:C.muted, marginTop:1 }}>{row.role} · {row.department}</div>
                          <div style={{ display:'flex', flexWrap:'wrap' as const, gap:5, marginTop:6 }}>
                            {row.projects.map(p => (
                              <div key={p.name} style={{ display:'inline-flex', alignItems:'center', gap:5, background:`${p.color}12`, padding:'2px 8px', borderRadius:12, border:`1px solid ${p.color}28` }}>
                                <span style={{ fontSize:11, fontWeight:700, color:p.color }}>{p.name}</span>
                                <span style={{ fontSize:10, fontWeight:800, color:p.color, background:`${p.color}22`, borderRadius:5, padding:'0 4px', lineHeight:'15px' }}>{p.pending}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: pending dates + remind button */}
                      <div style={{ flexShrink:0, minWidth:220, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:7, paddingLeft:18 }}>
                        <div style={{ fontSize:10.5, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.07em', textAlign:'right' }}>Pending Dates</div>
                        <div style={{ display:'flex', flexWrap:'wrap' as const, gap:5, justifyContent:'flex-end' }}>
                          {row.pendingDates.slice(0, 5).map(d => (
                            <span key={d} style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11.5, fontWeight:600, padding:'3px 9px', borderRadius:7, background:'rgba(28,32,53,0.05)', color:C.muted, border:`1px solid ${C.border}` }}>
                              <Clock size={9} strokeWidth={2.2} />
                              {fmtDate(d)}
                            </span>
                          ))}
                          {row.pendingDates.length > 5 && (
                            <button onClick={() => setPopupEmp(row)}
                              style={{ display:'inline-flex', alignItems:'center', fontSize:11.5, fontWeight:700, padding:'3px 10px', borderRadius:7, background:'rgba(99,102,241,0.10)', color:'#4B4ECC', border:'1px solid rgba(99,102,241,0.20)', cursor:'pointer', fontFamily:'inherit', transition:'background 0.14s' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.20)' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.10)' }}>
                              +{row.pendingDates.length - 5} more
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                )
              })}
            </div>
          )}
        </div>
      )}
      {/* ── Pending dates popup ── */}
      {popupEmp && (
        <div onClick={() => setPopupEmp(null)}
          style={{ position:'fixed', inset:0, background:'rgba(28,32,53,0.18)', zIndex:9000, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background:'#fff', borderRadius:18, width:'100%', maxWidth:540, border:`1px solid ${C.border}`, boxShadow:'0 12px 40px rgba(28,32,53,0.12)', animation:'ptFadeIn 0.2s ease-out', fontFamily:"'DM Sans', system-ui, sans-serif" }}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px 14px', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <img src={`https://i.pravatar.cc/150?img=${popupEmp.avatar}`} alt={popupEmp.employee}
                  style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', border:`2px solid ${C.border}`, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:14.5, fontWeight:700, color:C.navy }}>{popupEmp.employee}</div>
                  <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{popupEmp.role} · {popupEmp.department}</div>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ display:'flex', alignItems:'center', gap:5, background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, padding:'5px 10px' }}>
                  <Clock size={12} color={C.muted} strokeWidth={2} />
                  <span style={{ fontSize:12, fontWeight:700, color:C.navy }}>{popupEmp.pendingDates.length}</span>
                  <span style={{ fontSize:11, color:C.muted, fontWeight:500 }}>pending</span>
                </div>
                <button onClick={() => setPopupEmp(null)}
                  style={{ width:30, height:30, borderRadius:8, border:`1px solid ${C.border}`, background:C.surface, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <X size={13} color={C.muted} />
                </button>
              </div>
            </div>

            {/* Project tags */}
            <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6, padding:'12px 20px', borderBottom:`1px solid ${C.border}` }}>
              {popupEmp.projects.map(p => (
                <div key={p.name} style={{ display:'inline-flex', alignItems:'center', gap:5, background:`${p.color}10`, border:`1px solid ${p.color}28`, padding:'3px 9px', borderRadius:99 }}>
                  <span style={{ fontSize:11.5, fontWeight:700, color:p.color }}>{p.name}</span>
                  <span style={{ fontSize:10, fontWeight:800, color:p.color, background:`${p.color}20`, borderRadius:4, padding:'0 5px', lineHeight:'16px' }}>{p.pending}</span>
                </div>
              ))}
            </div>

            {/* Date grid */}
            <div style={{ padding:'16px 20px 20px' }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.08em', marginBottom:12 }}>All Pending Dates</div>
              <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6 }}>
                {popupEmp.pendingDates.map(d => (
                  <span key={d} style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11.5, fontWeight:600, padding:'3px 9px', borderRadius:7, background:'rgba(28,32,53,0.05)', color:C.muted, border:`1px solid ${C.border}` }}>
                    <Clock size={9} strokeWidth={2.2} />
                    {fmtDate(d)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
