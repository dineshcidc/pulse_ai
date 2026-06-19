import { useState } from 'react'
import {
  ArrowLeft, Clock, FileText, AlertCircle, CheckCircle,
  Eye, FileSpreadsheet, ClipboardList, Download, X,
} from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

/* ── Current employee ── */
const ME = {
  empId:      'EMP-2024-0042',
  name:       'John Doe',
  avatar:     32,
  department: 'Engineering',
  role:       'Senior Engineer',
}

/* ── Types ── */
type Status = 'Approved' | 'Pending' | 'Rejected'

interface Entry {
  id: number; date: string; task: string; taskType: string
  project: string; hours: number; status: Status
}

/* ── Sarah's timesheet data ── */
const MY_DATA: Entry[] = [
  { id:  1, date:'2026-05-29', taskType:'Meeting',     task:'Sprint Review Preparation',          project:'Pulse.AI v2',  hours:4.0, status:'Pending'  },
  { id:  2, date:'2026-05-29', taskType:'Development', task:'API Error Handling Fix',              project:'Pulse.AI v2',  hours:2.5, status:'Pending'  },
  { id:  3, date:'2026-05-29', taskType:'Meeting',     task:'Daily Standup & Sprint Sync',         project:'Pulse.AI v2',  hours:0.5, status:'Approved' },
  { id:  4, date:'2026-05-28', taskType:'Development', task:'Performance Optimization — React Query',project:'Pulse.AI v2', hours:6.0, status:'Approved' },
  { id:  5, date:'2026-05-28', taskType:'Review',      task:'Peer Code Review Session',            project:'Pulse.AI v2',  hours:1.5, status:'Approved' },
  { id:  6, date:'2026-05-28', taskType:'Meeting',     task:'Daily Standup',                       project:'Pulse.AI v2',  hours:0.5, status:'Approved' },
  { id:  7, date:'2026-05-27', taskType:'Design',      task:'Dashboard Redesign — New Components', project:'Pulse.AI v2',  hours:7.5, status:'Approved' },
  { id:  8, date:'2026-05-27', taskType:'Review',      task:'PR Review — Feature Branch',          project:'Pulse.AI v2',  hours:2.0, status:'Approved' },
  { id:  9, date:'2026-05-27', taskType:'Meeting',     task:'Daily Standup',                       project:'Pulse.AI v2',  hours:0.5, status:'Approved' },
  { id: 10, date:'2026-05-26', taskType:'Development', task:'Frontend API Integration',            project:'Pulse.AI v2',  hours:8.0, status:'Approved' },
  { id: 11, date:'2026-05-26', taskType:'Meeting',     task:'Daily Standup',                       project:'Pulse.AI v2',  hours:0.5, status:'Approved' },
  { id: 12, date:'2026-05-25', taskType:'Development', task:'UI Component Development',            project:'Pulse.AI v2',  hours:7.5, status:'Approved' },
  { id: 13, date:'2026-05-25', taskType:'Review',      task:'Architecture Review Session',         project:'Pulse.AI v2',  hours:1.5, status:'Approved' },
  { id: 14, date:'2026-05-25', taskType:'Meeting',     task:'Daily Standup',                       project:'Pulse.AI v2',  hours:0.5, status:'Approved' },
  { id: 15, date:'2026-05-24', taskType:'Review',      task:'Code Review & Testing',               project:'Pulse.AI v2',  hours:6.0, status:'Approved' },
  { id: 16, date:'2026-05-24', taskType:'Development', task:'Hotfix — Login Session Timeout',      project:'Pulse.AI v2',  hours:2.5, status:'Approved' },
  { id: 17, date:'2026-05-24', taskType:'Meeting',     task:'Daily Standup',                       project:'Pulse.AI v2',  hours:0.5, status:'Approved' },
  { id: 18, date:'2026-05-23', taskType:'Meeting',     task:'Sprint Planning Meeting',             project:'Pulse.AI v2',  hours:3.0, status:'Approved' },
  { id: 19, date:'2026-05-22', taskType:'Development', task:'Bug Fix — Dashboard Module',          project:'Pulse.AI v2',  hours:8.0, status:'Approved' },
  { id: 20, date:'2026-05-21', taskType:'Development', task:'API Integration — Payment Gateway',   project:'FinTrack App',  hours:8.0, status:'Approved' },
]

const MY_PROJECTS = ['Pulse.AI v2', 'FinTrack App']

const STATUS_CFG: Record<Status, { color: string; bg: string; border: string; dot: string }> = {
  Approved: { color:'#0A8A58', bg:'rgba(14,168,106,0.08)', border:'rgba(14,168,106,0.20)', dot:'#16A34A' },
  Pending:  { color:'#D97706', bg:'rgba(245,158,11,0.08)',  border:'rgba(245,158,11,0.22)',  dot:'#F59E0B' },
  Rejected: { color:'#E84855', bg:'rgba(232,72,85,0.08)',   border:'rgba(232,72,85,0.20)',   dot:'#E84855' },
}

const TASK_TYPE_CFG: Record<string, { color: string; bg: string }> = {
  'Development':   { color:'#4B4ECC', bg:'rgba(75,78,204,0.09)'   },
  'Design':        { color:'#7C3AED', bg:'rgba(124,58,237,0.09)'  },
  'Testing':       { color:'#D97706', bg:'rgba(245,158,11,0.09)'  },
  'Meeting':       { color:'#0EA86A', bg:'rgba(14,168,106,0.09)'  },
  'Review':        { color:'#0891B2', bg:'rgba(8,145,178,0.09)'   },
  'Documentation': { color:'#64748B', bg:'rgba(100,116,139,0.09)' },
  'DevOps':        { color:'#059669', bg:'rgba(5,150,105,0.09)'   },
  'Analysis':      { color:'#DB2777', bg:'rgba(219,39,119,0.09)'  },
}

/* ── Helpers ── */
function fmtShort(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day:'2-digit', month:'short' })
}
function fmtFull(d: string) {
  const dt = new Date(d + 'T00:00:00')
  const wd = dt.toLocaleDateString('en-US', { weekday:'short' })
  const day = String(dt.getDate()).padStart(2,'0')
  const mon = dt.toLocaleDateString('en-US', { month:'short' })
  return `${wd}, ${day} ${mon} ${dt.getFullYear()}`
}

/* ── Skeleton ── */
function sk(w: number|string, h: number, r: number|string): React.CSSProperties {
  return { width:w, height:h, borderRadius:r, background:'linear-gradient(90deg,#F0F2F8 25%,#E4E6EF 50%,#F0F2F8 75%)', backgroundSize:'1000px 100%', animation:'shimmer 1.4s infinite linear', flexShrink:0 }
}
function SkeletonResults() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      <style>{`@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>
      {[0,1,2,3].map(i=>(
        <div key={i} style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:14, padding:'14px 18px', display:'flex', alignItems:'center', gap:14 }}>
          <div style={sk(42,42,'50%')} />
          <div style={{ flex:1 }}>
            <div style={{...sk(180,13,6), marginBottom:8}} />
            <div style={sk(120,11,5)} />
          </div>
          <div style={sk(56,26,99)} />
          <div style={sk(34,34,'50%')} />
        </div>
      ))}
    </div>
  )
}

/* ── Date accordion results ── */
function DateAccordion({ entries }: { entries: Entry[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggle(date: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(date) ? next.delete(date) : next.add(date)
      return next
    })
  }

  const dateMap = new Map<string, Entry[]>()
  entries.forEach(e => {
    if (!dateMap.has(e.date)) dateMap.set(e.date, [])
    dateMap.get(e.date)!.push(e)
  })
  const sortedDates = [...dateMap.keys()].sort((a,b) => b.localeCompare(a))

  return (
    <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, overflow:'hidden' }}>
      {/* Card header */}
      <div style={{ padding:'13px 20px', borderBottom:`1px solid ${C.border}`, background:C.surface, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:13, fontWeight:700, color:C.navy }}>Timesheet by Date</span>
        <span style={{ fontSize:12, color:C.muted }}>
          {sortedDates.length > 0 && (
            sortedDates.length === 1
              ? fmtShort(sortedDates[0])
              : `${fmtShort(sortedDates[sortedDates.length-1])} – ${fmtShort(sortedDates[0])}`
          )}
        </span>
      </div>

      {sortedDates.map((date, di) => {
        const dayEntries  = dateMap.get(date)!
        const dayHours    = dayEntries.reduce((s,e)=>s+e.hours,0)
        const hasPending  = dayEntries.some(e=>e.status==='Pending')
        const hasRejected = dayEntries.some(e=>e.status==='Rejected')
        const dayStatus: Status = hasPending ? 'Pending' : hasRejected ? 'Rejected' : 'Approved'
        const dsc    = STATUS_CFG[dayStatus]
        const isOpen = expanded.has(date)
        const isLast = di === sortedDates.length - 1

        return (
          <div key={date}>
            {/* Date row */}
            <div
              style={{ display:'flex', alignItems:'center', padding:'13px 20px', gap:14, background:isOpen?'rgba(99,102,241,0.03)':'#fff', borderBottom:`1px solid ${C.border}`, transition:'background 0.15s', cursor:'default' }}
              onMouseEnter={e=>{ if(!isOpen) e.currentTarget.style.background=C.surface }}
              onMouseLeave={e=>{ if(!isOpen) e.currentTarget.style.background='#fff' }}
            >
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ margin:0, fontSize:13.5, fontWeight:600, color:C.navy }}>{fmtFull(date)}</p>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
                  <Clock size={11} style={{color:C.muted}} />
                  <span style={{ fontSize:12, color:C.muted, fontWeight:600 }}>{dayHours.toFixed(1)}h logged</span>
                  <span style={{ fontSize:11, color:C.border }}>·</span>
                  <span style={{ fontSize:11.5, color:C.muted }}>{dayEntries.length} {dayEntries.length===1?'entry':'entries'}</span>
                </div>
              </div>
              <span style={{ display:'inline-flex', alignItems:'center', gap:5, flexShrink:0, padding:'4px 10px', borderRadius:6, fontSize:11.5, fontWeight:700, color:dsc.color, background:dsc.bg, border:`1px solid ${dsc.border}` }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:dsc.dot, flexShrink:0 }} />
                {dayStatus}
              </span>
              <button
                onClick={()=>toggle(date)}
                style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:isOpen?C.navy:C.hover, border:`1px solid ${isOpen?C.navy:C.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.15s' }}
                onMouseEnter={e=>{ if(!isOpen){e.currentTarget.style.background='#E4E6EF';e.currentTarget.style.borderColor='#D1D4E4'} }}
                onMouseLeave={e=>{ if(!isOpen){e.currentTarget.style.background=C.hover;e.currentTarget.style.borderColor=C.border} }}
              >
                <Eye size={14} color={isOpen?'#fff':C.navy} />
              </button>
            </div>

            {/* Expanded entries */}
            {isOpen && (
              <div style={{ padding:'14px 20px 16px', background:'rgba(247,248,252,0.7)', borderBottom:isLast?'none':`1px solid ${C.border}` }}>
                {dayEntries.map((entry, ei) => {
                  const esc = STATUS_CFG[entry.status]
                  const ttc = TASK_TYPE_CFG[entry.taskType] ?? { color:C.muted, bg:C.surface }
                  const isLastEntry = ei === dayEntries.length - 1
                  return (
                    <div key={entry.id} style={{ display:'flex', gap:0 }}>
                      {/* Tree connector */}
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:22, flexShrink:0, paddingTop:5 }}>
                        <div style={{ width:10, height:10, borderRadius:'50%', background:esc.dot, border:'2px solid #fff', boxShadow:`0 0 0 2px ${esc.dot}`, flexShrink:0, zIndex:1 }} />
                        {!isLastEntry && <div style={{ width:2, flex:1, background:C.border, minHeight:20, marginTop:2 }} />}
                      </div>
                      {/* Entry card */}
                      <div style={{ flex:1, paddingBottom:isLastEntry?0:12, paddingLeft:12 }}>
                        <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:10, padding:'11px 14px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:7 }}>
                            <span style={{ fontSize:11.5, fontWeight:700, color:'#3D4266' }}>{entry.project}</span>
                            <div style={{ width:1, height:12, background:C.border, flexShrink:0 }} />
                            <span style={{ fontSize:11, fontWeight:700, padding:'2px 7px', borderRadius:5, color:ttc.color, background:ttc.bg }}>{entry.taskType}</span>
                            <div style={{ width:1, height:12, background:C.border, flexShrink:0 }} />
                            <span style={{ fontSize:11.5, fontWeight:700, color:C.navy, background:C.surface, border:`1px solid ${C.border}`, borderRadius:6, padding:'1px 8px' }}>{entry.hours.toFixed(1)}h</span>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                            <p style={{ margin:0, fontSize:13, fontWeight:600, color:C.navy, flex:1 }}>{entry.task}</p>
                            <span style={{ display:'inline-flex', alignItems:'center', gap:4, flexShrink:0, padding:'3px 9px', borderRadius:6, fontSize:11, fontWeight:700, color:esc.color, background:esc.bg, border:`1px solid ${esc.border}` }}>
                              <span style={{ width:4, height:4, borderRadius:'50%', background:esc.dot }} />
                              {entry.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ── Main page ── */
export default function EmployeeTimesheetReportPage({ onBack }: { onBack: () => void }) {
  const [dateMode,         setDateMode]         = useState<'single'|'range'>('range')
  const [singleDate,       setSingleDate]       = useState('')
  const [dateFrom,         setDateFrom]         = useState('')
  const [dateTo,           setDateTo]           = useState('')
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [state,            setState]            = useState<'idle'|'loading'|'done'>('idle')
  const [results,          setResults]          = useState<Entry[]>([])

  const labelStyle: React.CSSProperties = {
    fontSize:11.5, fontWeight:700, color:C.muted,
    textTransform:'uppercase', letterSpacing:'0.05em',
    margin:'0 0 8px', display:'block',
  }

  function toggleProject(p: string) {
    setSelectedProjects(prev => {
      const next = new Set(prev); next.has(p) ? next.delete(p) : next.add(p); return next
    })
    setState('idle')
  }

  function clearDate() {
    setSingleDate(''); setDateFrom(''); setDateTo(''); setState('idle')
  }

  function handleGenerate() {
    setState('loading'); setResults([])
    setTimeout(()=>{
      const filtered = MY_DATA.filter(e => {
        const mp = selectedProjects.size === 0 || selectedProjects.has(e.project)
        let dateOk = true
        if (dateMode==='single')  dateOk = !singleDate || e.date === singleDate
        else                      dateOk = (!dateFrom || e.date >= dateFrom) && (!dateTo || e.date <= dateTo)
        return mp && dateOk
      })
      setResults(filtered)
      setState('done')
    }, 1000)
  }

  /* summary stats */
  const totalHours    = results.reduce((s,e)=>s+e.hours,0)
  const approvedCount = results.filter(e=>e.status==='Approved').length
  const pendingCount  = results.filter(e=>e.status==='Pending').length
  const rejectedCount = results.filter(e=>e.status==='Rejected').length

  const SUMMARY_STATS = [
    { label:'Total Hours',  value:`${totalHours.toFixed(1)}h`, color:'#4B4ECC', bg:'rgba(75,78,204,0.09)',  icon:Clock       },
    { label:'Entries',      value:results.length,              color:C.navy,    bg:'rgba(28,32,53,0.07)',   icon:FileText    },
    { label:'Approved',     value:approvedCount,               color:'#0A8A58', bg:'rgba(14,168,106,0.09)', icon:CheckCircle },
    { label:'Pending',      value:pendingCount,                color:'#D97706', bg:'rgba(245,158,11,0.09)', icon:AlertCircle },
  ]

  const dateInputStyle: React.CSSProperties = {
    height:38, padding:'0 12px', border:`1px solid ${C.border}`, borderRadius:8,
    fontSize:13, color:C.navy, background:C.surface, outline:'none',
    fontFamily:"'DM Sans',system-ui,sans-serif", boxSizing:'border-box',
    transition:'border-color 0.15s, background 0.15s',
  }

  return (
    <div style={{ fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes cardIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:22 }}>
        <button
          onClick={onBack}
          style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:30, height:30, borderRadius:8, border:`1px solid ${C.border}`, background:'#fff', cursor:'pointer', flexShrink:0, transition:'all 0.14s' }}
          onMouseEnter={e=>{e.currentTarget.style.background=C.surface;e.currentTarget.style.borderColor='#C8CCE0'}}
          onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.borderColor=C.border}}
        >
          <ArrowLeft size={14} strokeWidth={2} style={{color:C.muted}} />
        </button>
        <span style={{ fontSize:13, color:'#C8CCE0' }}>/</span>
        <button
          onClick={onBack}
          style={{ fontSize:13, fontWeight:500, color:C.muted, background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:'inherit', transition:'color 0.14s' }}
          onMouseEnter={e=>{e.currentTarget.style.color=C.navy}}
          onMouseLeave={e=>{e.currentTarget.style.color=C.muted}}
        >
          Reports
        </button>
        <span style={{ fontSize:13, color:'#C8CCE0' }}>/</span>
        <span style={{ fontSize:13, fontWeight:700, color:C.navy }}>Timesheet Report</span>
      </div>

      {/* 3 / 9 split */}
      <div style={{ display:'grid', gridTemplateColumns:'3fr 9fr', gap:18, alignItems:'start' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ position:'sticky', top:0 }}>
          <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, overflow:'hidden' }}>

            {/* Profile block */}
            <div style={{ padding:'20px 20px', borderBottom:`1px solid ${C.border}`, background:'linear-gradient(135deg, #EEF2FF 0%, #F0FDF4 100%)' }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:'#6366F1', textTransform:'uppercase', letterSpacing:'0.07em', marginBottom:14 }}>My Profile</div>
              <div style={{ display:'flex', alignItems:'center', gap:13 }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <img src={`https://randomuser.me/api/portraits/men/32.jpg`} alt={ME.name}
                    style={{ width:50, height:50, borderRadius:'50%', objectFit:'cover', display:'block', border:'2.5px solid #fff', boxShadow:'0 2px 10px rgba(99,102,241,0.18)' }} />
                  <div style={{ position:'absolute', bottom:0, right:0, width:14, height:14, borderRadius:'50%', background:'#0EA86A', border:'2px solid #fff' }} />
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:14.5, fontWeight:800, color:C.navy, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ME.name}</div>
                  <div style={{ fontSize:11.5, color:C.muted, marginTop:1 }}>{ME.empId}</div>
                  <div style={{ display:'flex', gap:5, marginTop:7, flexWrap:'wrap' }}>
                    <span style={{ fontSize:11, fontWeight:600, padding:'2px 9px', borderRadius:99, background:'rgba(99,102,241,0.12)', color:'#4338CA', border:'1px solid rgba(99,102,241,0.20)' }}>{ME.department}</span>
                    <span style={{ fontSize:11, fontWeight:600, padding:'2px 9px', borderRadius:99, background:'rgba(255,255,255,0.70)', color:C.navy, border:`1px solid ${C.border}` }}>{ME.role}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding:'20px 20px 24px', display:'flex', flexDirection:'column', gap:20 }}>

              {/* Date filter */}
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <label style={labelStyle}>Date Filter</label>
                  <div style={{ display:'flex', background:C.surface, border:`1px solid ${C.border}`, borderRadius:99, padding:3, gap:2 }}>
                    {(['single','range'] as const).map(mode=>(
                      <button key={mode} onClick={()=>{setDateMode(mode);clearDate()}}
                        style={{ padding:'3px 11px', borderRadius:99, fontSize:11, fontWeight:600, border:'none', cursor:'pointer', transition:'all 0.15s', background:dateMode===mode?'rgba(99,102,241,0.12)':'transparent', color:dateMode===mode?'#4B4ECC':C.muted, fontFamily:'inherit' }}>
                        {mode==='single'?'Single':'Range'}
                      </button>
                    ))}
                  </div>
                </div>

                {dateMode==='single' && (
                  <input type="date" value={singleDate}
                    onChange={e=>{setSingleDate(e.target.value);setState('idle')}}
                    style={{ ...dateInputStyle, width:'100%' }}
                    onFocus={e=>{e.target.style.borderColor='#6366F1';e.target.style.background='#fff'}}
                    onBlur={e=>{e.target.style.borderColor=C.border;e.target.style.background=C.surface}}
                  />
                )}

                {dateMode==='range' && (
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <input type="date" value={dateFrom}
                      onChange={e=>{setDateFrom(e.target.value);setState('idle')}}
                      style={{ ...dateInputStyle, flex:1 }}
                      onFocus={e=>{e.target.style.borderColor='#6366F1';e.target.style.background='#fff'}}
                      onBlur={e=>{e.target.style.borderColor=C.border;e.target.style.background=C.surface}}
                    />
                    <span style={{ fontSize:12, color:C.muted, flexShrink:0 }}>to</span>
                    <input type="date" value={dateTo}
                      onChange={e=>{setDateTo(e.target.value);setState('idle')}}
                      style={{ ...dateInputStyle, flex:1 }}
                      onFocus={e=>{e.target.style.borderColor='#6366F1';e.target.style.background='#fff'}}
                      onBlur={e=>{e.target.style.borderColor=C.border;e.target.style.background=C.surface}}
                    />
                  </div>
                )}
              </div>

              {/* Project filter */}
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <label style={labelStyle}>My Projects</label>
                  {selectedProjects.size > 0 && (
                    <button onClick={()=>{setSelectedProjects(new Set());setState('idle')}}
                      style={{ fontSize:11.5, fontWeight:600, color:'#E84855', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                      Clear
                    </button>
                  )}
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {MY_PROJECTS.map(p=>{
                    const active = selectedProjects.has(p)
                    return (
                      <button key={p} onClick={()=>toggleProject(p)}
                        style={{ padding:'6px 14px', borderRadius:99, fontSize:12.5, fontWeight:600, border:`1px solid ${active?'rgba(99,102,241,0.35)':C.border}`, background:active?'rgba(99,102,241,0.10)':C.surface, color:active?'#4B4ECC':C.navy, cursor:'pointer', transition:'all 0.15s', fontFamily:'inherit' }}
                        onMouseEnter={e=>{if(!active){e.currentTarget.style.borderColor='rgba(99,102,241,0.25)';e.currentTarget.style.color='#4B4ECC'}}}
                        onMouseLeave={e=>{if(!active){e.currentTarget.style.borderColor=C.border;e.currentTarget.style.color=C.navy}}}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Generate */}
              <button
                onClick={handleGenerate}
                disabled={state==='loading'}
                style={{ width:'100%', height:44, borderRadius:12, border:'none', background:state==='loading'?'#A0A3B1':C.navy, color:'#fff', fontSize:14, fontWeight:700, cursor:state==='loading'?'default':'pointer', fontFamily:'inherit', transition:'background 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                onMouseEnter={e=>{if(state!=='loading')e.currentTarget.style.background='#2A3050'}}
                onMouseLeave={e=>{if(state!=='loading')e.currentTarget.style.background=C.navy}}
              >
                {state==='loading'
                  ? <><div style={{ width:16, height:16, borderRadius:'50%', border:'2.5px solid rgba(255,255,255,0.30)', borderTopColor:'#fff', animation:'spin 0.75s linear infinite' }}/> Generating…</>
                  : <><ClipboardList size={16} strokeWidth={2}/> Generate Report</>
                }
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div>

          {/* Idle */}
          {state==='idle' && (
            <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, minHeight:420, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:48 }}>
              <div style={{ width:64, height:64, borderRadius:20, background:C.surface, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <ClipboardList size={28} strokeWidth={1.3} style={{color:'#C0C4D8'}} />
              </div>
              <div style={{ textAlign:'center' }}>
                <p style={{ fontSize:16, fontWeight:700, color:C.navy, margin:'0 0 6px' }}>No Report Generated Yet</p>
                <p style={{ fontSize:13.5, color:C.muted, margin:0, maxWidth:300, lineHeight:1.6 }}>
                  Filter by date or project on the left, then click <strong>Generate Report</strong> to view your timesheets.
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {state==='loading' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, padding:'18px 20px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
                  {[0,1,2,3].map(i=>(
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={sk(40,40,11)} />
                      <div><div style={{...sk(40,18,5),marginBottom:6}}/><div style={sk(60,11,4)}/></div>
                    </div>
                  ))}
                </div>
              </div>
              <SkeletonResults />
            </div>
          )}

          {/* Done */}
          {state==='done' && (
            <div style={{ animation:'cardIn 0.3s ease both' }}>
              {/* Toolbar */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <span style={{ fontSize:15, fontWeight:700, color:C.navy }}>
                  My Timesheet Report
                  {results.length > 0 && (
                    <span style={{ fontSize:12, fontWeight:500, color:C.muted, marginLeft:8 }}>
                      ({results.length} {results.length===1?'entry':'entries'})
                    </span>
                  )}
                </span>
                {results.length > 0 && (
                  <button
                    style={{ display:'flex', alignItems:'center', gap:7, height:36, padding:'0 16px', borderRadius:9, border:'1px solid #16A34A40', background:'#F0FDF4', fontSize:12.5, fontWeight:600, color:'#15803D', cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}
                    onMouseEnter={e=>{e.currentTarget.style.background='#DCFCE7';e.currentTarget.style.borderColor='#16A34A80'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='#F0FDF4';e.currentTarget.style.borderColor='#16A34A40'}}
                  >
                    <FileSpreadsheet size={14} strokeWidth={2}/> Download Excel
                  </button>
                )}
              </div>

              {results.length === 0 ? (
                <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:240, gap:10 }}>
                  <X size={28} strokeWidth={1.3} style={{color:'#D0D3E4'}} />
                  <p style={{ fontSize:14, fontWeight:600, color:C.navy, margin:0 }}>No entries found</p>
                  <p style={{ fontSize:13, color:C.muted, margin:0 }}>Try adjusting your date or project filter.</p>
                </div>
              ) : (
                <>
                  {/* Summary stat row */}
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:14 }}>
                    {SUMMARY_STATS.map(s=>(
                      <div key={s.label} style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:14, padding:'16px 18px', display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:40, height:40, borderRadius:11, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <s.icon size={17} strokeWidth={1.8} style={{color:s.color}} />
                        </div>
                        <div>
                          <div style={{ fontSize:20, fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
                          <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>{s.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Rejected notice */}
                  {rejectedCount > 0 && (
                    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'rgba(232,72,85,0.06)', border:'1px solid rgba(232,72,85,0.18)', borderRadius:10, marginBottom:14 }}>
                      <AlertCircle size={14} style={{color:'#E84855',flexShrink:0}} strokeWidth={1.8} />
                      <span style={{ fontSize:12.5, color:'#E84855', fontWeight:600 }}>{rejectedCount} {rejectedCount===1?'entry was':'entries were'} rejected — please review with your manager.</span>
                    </div>
                  )}

                  {/* Date accordion */}
                  <DateAccordion entries={results} />

                  {/* Individual download */}
                  <div style={{ marginTop:12, display:'flex', justifyContent:'flex-end' }}>
                    <button style={{ display:'flex', alignItems:'center', gap:6, fontSize:12.5, fontWeight:600, color:C.muted, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit', transition:'color 0.14s' }}
                      onMouseEnter={e=>{e.currentTarget.style.color='#15803D'}}
                      onMouseLeave={e=>{e.currentTarget.style.color=C.muted}}
                    >
                      <Download size={13} strokeWidth={2} /> Download individual entries
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
