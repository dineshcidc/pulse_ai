import { useState } from 'react'
import {
  ChevronLeft, ChevronRight, FileSpreadsheet,
  ClipboardList, CalendarDays, CheckCircle2, TrendingUp, Download,
  ArrowLeft,
} from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', bg: '#F0F2F8', surface: '#F7F8FC' }

const MONTH_NAMES       = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_SHORT       = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTH_DAYS        = [31,28,28,31,30,31,30,31,31,30,31,30]
const WORKING_PER_MONTH = [22,20,21,22,22,21,23,21,22,23,20,23]

/* ── Current employee ── */
const ME = {
  empId:      'EMP-0047',
  name:       'Sarah Johnson',
  avatar:     47,
  department: 'Engineering',
  role:       'Senior Engineer',
}

/* ── Attendance seed for Sarah (May 2026 baseline: 22 working days) ── */
const ATT_BASE = { present: 18, planned: 2, unplanned: 1 }

/* ── Types ── */
interface MonthOption { label: string; value: string; working: number; range: string }
interface ReportCard {
  workingDays: number; presentDays: number
  plannedLeave: number; unplannedLeave: number
  attendancePct: number; month: string; dateRange: string
}

/* ── Helpers ── */
function pctColor(p: number) {
  if (p >= 90) return '#0EA86A'
  if (p >= 75) return '#F59E0B'
  return '#E84855'
}
function pctBg(p: number) {
  if (p >= 90) return 'rgba(14,168,106,0.09)'
  if (p >= 75) return 'rgba(245,158,11,0.09)'
  return 'rgba(232,72,85,0.09)'
}
function pctBorder(p: number) {
  if (p >= 90) return 'rgba(14,168,106,0.22)'
  if (p >= 75) return 'rgba(245,158,11,0.22)'
  return 'rgba(232,72,85,0.22)'
}
function getMonthOption(month: number, year: number): MonthOption {
  const name = MONTH_NAMES[month], short = MONTH_SHORT[month], days = MONTH_DAYS[month]
  return { label:`${name} ${year}`, value:`${year}-${String(month+1).padStart(2,'0')}`, working:WORKING_PER_MONTH[month], range:`01 ${short} – ${days} ${short} ${year}` }
}
function getYearOption(months: number[], year: number): MonthOption {
  const sorted = [...months].sort((a,b)=>a-b)
  const working = sorted.reduce((s,m)=>s+WORKING_PER_MONTH[m],0)
  const isFull = sorted.length===12
  const f=MONTH_SHORT[sorted[0]], l=MONTH_SHORT[sorted[sorted.length-1]], ld=MONTH_DAYS[sorted[sorted.length-1]]
  return { label:isFull?`Full ${year}`:`${f}–${l} ${year}`, value:`${year}-year`, working, range:isFull?`01 Jan – 31 Dec ${year}`:`01 ${f} – ${ld} ${l} ${year}` }
}

function buildCard(mo: MonthOption): ReportCard {
  const scale     = mo.working / 22
  const present   = Math.round(ATT_BASE.present   * scale)
  const planned   = Math.round(ATT_BASE.planned   * scale)
  const unplanned = Math.max(0, Math.round(ATT_BASE.unplanned * scale))
  const attPct    = Math.round((present / mo.working) * 100)
  return { workingDays:mo.working, presentDays:present, plannedLeave:planned, unplannedLeave:unplanned, attendancePct:attPct, month:mo.label, dateRange:mo.range }
}

function buildYearCard(months: number[], year: number): ReportCard {
  let totalWorking=0, totalPresent=0, totalPlanned=0, totalUnplanned=0
  for (const m of months) {
    const w=WORKING_PER_MONTH[m], sc=w/22
    totalWorking    += w
    totalPresent    += Math.round(ATT_BASE.present   * sc)
    totalPlanned    += Math.round(ATT_BASE.planned   * sc)
    totalUnplanned  += Math.max(0, Math.round(ATT_BASE.unplanned * sc))
  }
  const attPct = Math.round((totalPresent / totalWorking) * 100)
  const mo = getYearOption(months, year)
  return { workingDays:totalWorking, presentDays:totalPresent, plannedLeave:totalPlanned, unplannedLeave:totalUnplanned, attendancePct:attPct, month:mo.label, dateRange:mo.range }
}

/* ── Month picker ── */
function MonthPicker({ month, year, setMonth, setYear, mode, setMode, yearMonths, setYearMonths }: {
  month:number; year:number; setMonth:(m:number)=>void; setYear:(y:number)=>void
  mode:'month'|'year'; setMode:(m:'month'|'year')=>void
  yearMonths:number[]; setYearMonths:(ms:number[])=>void
}) {
  function prevMo() { if(month===0){setMonth(11);setYear(year-1)}else setMonth(month-1) }
  function nextMo() { if(month===11){setMonth(0);setYear(year+1)}else setMonth(month+1) }
  function toggleMonth(m:number) {
    if(yearMonths.includes(m)){ if(yearMonths.length>1) setYearMonths(yearMonths.filter(x=>x!==m)) }
    else setYearMonths([...yearMonths,m].sort((a,b)=>a-b))
  }
  const navBtn = (onClick:()=>void, icon:React.ReactNode, extra?:React.CSSProperties) => (
    <button onClick={onClick} style={{ width:34, border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, padding:0, ...extra }}
      onMouseEnter={e=>{e.currentTarget.style.background=C.bg}} onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}
    >{icon}</button>
  )
  const allYearSelected = yearMonths.length===12
  return (
    <div style={{ border:`1px solid ${C.border}`, borderRadius:12, overflow:'hidden' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:`1px solid ${C.border}` }}>
        {(['month','year'] as const).map(m=>(
          <button key={m} onClick={()=>setMode(m)} style={{ height:34, border:'none', cursor:'pointer', fontFamily:'inherit', fontSize:12, fontWeight:600, transition:'all 0.15s', background:mode===m?'#EEF2FF':C.surface, color:mode===m?'#3730A3':C.muted, borderRight:m==='month'?`1px solid ${C.border}`:'none' }}>
            {m==='month'?'Monthly':'Full Year'}
          </button>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', height:36, background:C.surface, borderBottom:`1px solid ${C.border}` }}>
        {navBtn(()=>setYear(year-1),<ChevronLeft size={12} style={{color:C.muted}}/>,{borderRight:`1px solid ${C.border}`})}
        <span style={{ flex:1, textAlign:'center', fontSize:13, fontWeight:700, color:C.navy, letterSpacing:'0.02em' }}>{year}</span>
        {navBtn(()=>setYear(year+1),<ChevronRight size={12} style={{color:C.muted}}/>,{borderLeft:`1px solid ${C.border}`})}
      </div>
      {mode==='month' && (
        <div style={{ display:'flex', alignItems:'center', height:44 }}>
          {navBtn(prevMo,<ChevronLeft size={15} style={{color:C.navy}}/>,{borderRight:`1px solid ${C.border}`})}
          <span style={{ flex:1, textAlign:'center', fontSize:14, fontWeight:700, color:C.navy }}>{MONTH_NAMES[month]}</span>
          {navBtn(nextMo,<ChevronRight size={15} style={{color:C.navy}}/>,{borderLeft:`1px solid ${C.border}`})}
        </div>
      )}
      {mode==='year' && (
        <div style={{ padding:'14px 14px 16px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ fontSize:11.5, fontWeight:600, color:C.muted }}>
              {allYearSelected ? <span style={{color:'#4338CA',fontWeight:700}}>Full {year} selected</span> : <span>{yearMonths.length} month{yearMonths.length!==1?'s':''} selected</span>}
            </span>
            <button onClick={()=>setYearMonths(allYearSelected?[4]:Array.from({length:12},(_,i)=>i))}
              style={{ fontSize:11.5, fontWeight:600, color:allYearSelected?'#E84855':'#4338CA', background:'none', border:'none', cursor:'pointer', padding:0 }}>
              {allYearSelected?'Clear':'Select All'}
            </button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
            {MONTH_SHORT.map((name,idx)=>{
              const active=yearMonths.includes(idx)
              return (
                <button key={idx} onClick={()=>toggleMonth(idx)} style={{ height:32, border:'none', borderRadius:8, cursor:'pointer', fontFamily:'inherit', fontSize:12, fontWeight:600, transition:'all 0.15s', background:active?'#ECEEF5':C.surface, color:active?C.navy:C.muted }}
                  onMouseEnter={e=>{if(!active){e.currentTarget.style.background=C.surface;e.currentTarget.style.color=C.navy}}}
                  onMouseLeave={e=>{if(!active){e.currentTarget.style.background=C.surface;e.currentTarget.style.color=C.muted}}}>
                  {name}
                </button>
              )
            })}
          </div>
          {!allYearSelected && yearMonths.length>0 && (
            <div style={{ marginTop:10, padding:'6px 10px', background:'#EEF2FF', borderRadius:7, border:'1px solid #C7D2FE' }}>
              <span style={{ fontSize:11, fontWeight:600, color:'#4338CA' }}>{yearMonths.map(m=>MONTH_SHORT[m]).join(', ')} {year}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Skeleton ── */
function sk(w:number|string, h:number, r:number|string): React.CSSProperties {
  return { width:w, height:h, borderRadius:r, background:'linear-gradient(90deg,#F0F2F8 25%,#E4E6EF 50%,#F0F2F8 75%)', backgroundSize:'1000px 100%', animation:'shimmer 1.4s infinite linear', flexShrink:0 }
}
function SkeletonCard() {
  return (
    <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, overflow:'hidden' }}>
      <style>{`@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>
      <div style={{ padding:'18px 20px 16px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:14 }}>
        <div style={sk(44,44,'50%')} />
        <div style={{flex:1}}>
          <div style={{...sk(160,14,6),marginBottom:8}} />
          <div style={sk(220,11,5)} />
        </div>
        <div style={sk(32,32,8)} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', padding:'18px 20px' }}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{ padding:'0 16px 0 0', borderRight:i<3?`1px solid ${C.border}`:'none', paddingLeft:i>0?16:0 }}>
            <div style={{...sk(18,18,'50%'),marginBottom:8}} />
            <div style={{...sk(36,20,5),marginBottom:6}} />
            <div style={sk(70,11,4)} />
          </div>
        ))}
      </div>
      <div style={{ padding:'12px 20px 16px', borderTop:`1px solid ${C.border}` }}>
        <div style={{...sk('100%',8,99),marginBottom:8}} />
      </div>
      <div style={{ padding:'10px 20px', background:C.surface, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between' }}>
        <div style={sk(90,11,5)} /><div style={sk(160,11,5)} />
      </div>
    </div>
  )
}

/* ── Attendance result card ── */
function AttendanceCardView({ card }: { card: ReportCard }) {
  const col    = pctColor(card.attendancePct)
  const bg     = pctBg(card.attendancePct)
  const border = pctBorder(card.attendancePct)

  const STATS = [
    { label:'Working Days', value:card.workingDays,                        color:'#6366F1', bg:'rgba(99,102,241,0.09)',  icon:CalendarDays  },
    { label:'Present Days', value:card.presentDays,                        color:'#0EA86A', bg:'rgba(14,168,106,0.09)', icon:CheckCircle2  },
    { label:'Leave Count',  value:card.plannedLeave+card.unplannedLeave,   color:'#2563EB', bg:'rgba(37,99,235,0.09)',  icon:CalendarDays  },
    { label:'Attendance',   value:`${card.attendancePct}%`,                color:col,       bg,                          icon:TrendingUp    },
  ]

  return (
    <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, overflow:'hidden', animation:'cardIn 0.36s cubic-bezier(0.22,1,0.36,1) both' }}>
      <style>{`@keyframes cardIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', borderBottom:`1px solid ${C.border}` }}>
        <img src={`https://i.pravatar.cc/150?img=${((ME.avatar-1)%70)+1}`} alt={ME.name}
          style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:`2px solid ${C.border}` }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14.5, fontWeight:700, color:C.navy }}>{ME.name}</div>
          <div style={{ fontSize:11.5, color:C.muted, marginTop:2 }}>{ME.empId} · {ME.department} · {ME.role}</div>
        </div>
        {/* Attendance badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 14px', background:bg, border:`1px solid ${border}`, borderRadius:99, flexShrink:0 }}>
          <TrendingUp size={12} style={{color:col}} strokeWidth={2} />
          <span style={{ fontSize:13, fontWeight:800, color:col }}>{card.attendancePct}%</span>
        </div>
        <button
          style={{ width:34, height:34, borderRadius:9, border:`1px solid ${C.border}`, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.15s' }}
          onMouseEnter={e=>{e.currentTarget.style.background='#F0FDF4';e.currentTarget.style.borderColor='#16A34A40'}}
          onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.borderColor=C.border}}
          title="Download report"
        >
          <Download size={14} style={{color:C.muted}} strokeWidth={2} />
        </button>
      </div>

      {/* Stats row */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
        {STATS.map((s,i)=>(
          <div key={s.label} style={{ padding:'16px 20px', borderRight:i<3?`1px solid ${C.border}`:'none', background:i===3?s.bg:'transparent' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
              <s.icon size={13} style={{color:s.color}} strokeWidth={1.8} />
              <span style={{ fontSize:10.5, fontWeight:600, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.05em' }}>{s.label}</span>
            </div>
            <div style={{ fontSize:18, fontWeight:700, color:i===3?s.color:C.navy, letterSpacing:'-0.3px', lineHeight:1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Attendance progress bar */}
      <div style={{ padding:'14px 20px 16px', borderTop:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.05em' }}>Attendance Rate</span>
          <span style={{ fontSize:12, fontWeight:700, color:col }}>{card.presentDays} of {card.workingDays} days present</span>
        </div>
        <div style={{ height:4, borderRadius:99, background:'#F0F2F8', overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${card.attendancePct}%`, borderRadius:99, background:col, transition:'width 0.6s cubic-bezier(0.22,1,0.36,1)' }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6 }}>
          <span style={{ fontSize:10.5, color:C.muted }}>
            {card.plannedLeave} planned · {card.unplannedLeave} unplanned leave
          </span>
          <span style={{ fontSize:10.5, fontWeight:600, color:col }}>
            {card.attendancePct >= 90 ? 'Excellent' : card.attendancePct >= 75 ? 'Good' : 'Needs Improvement'}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 20px', background:C.surface, borderTop:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
          <CalendarDays size={11} style={{color:C.muted}} strokeWidth={1.8} />
          <span style={{ fontSize:12, fontWeight:600, color:C.muted }}>{card.month}</span>
        </div>
        <span style={{ fontSize:11.5, color:'#B0B4C8' }}>{card.dateRange}</span>
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function EmployeeAttendanceReportPage({ onBack }: { onBack: () => void }) {
  const [selMonth,   setSelMonth]   = useState(4)
  const [selYear,    setSelYear]    = useState(2026)
  const [pickerMode, setPickerMode] = useState<'month'|'year'>('month')
  const [yearMonths, setYearMonths] = useState<number[]>(Array.from({length:12},(_,i)=>i))
  const [state,      setState]      = useState<'idle'|'loading'|'done'>('idle')
  const [card,       setCard]       = useState<ReportCard|null>(null)

  const canGenerate = pickerMode==='year' ? yearMonths.length > 0 : true

  function handleGenerate() {
    if (!canGenerate) return
    setState('loading'); setCard(null)
    setTimeout(()=>{
      const result = pickerMode==='month'
        ? buildCard(getMonthOption(selMonth, selYear))
        : buildYearCard(yearMonths, selYear)
      setCard(result)
      setState('done')
    }, 1000)
  }

  const currentMo = pickerMode==='month'
    ? getMonthOption(selMonth, selYear)
    : getYearOption(yearMonths, selYear)

  return (
    <div style={{ fontFamily:"'DM Sans', system-ui, sans-serif" }}>

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
        <span style={{ fontSize:13, fontWeight:700, color:C.navy }}>Attendance Report</span>
      </div>

      {/* 4 / 8 split */}
      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:20, alignItems:'start' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ position:'sticky', top:0 }}>
          <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, overflow:'hidden' }}>

            {/* Profile block */}
            <div style={{ padding:'20px 20px 20px', borderBottom:`1px solid ${C.border}`, background:'linear-gradient(135deg, #EEF2FF 0%, #F0FDF4 100%)' }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:'#6366F1', textTransform:'uppercase' as const, letterSpacing:'0.07em', marginBottom:14 }}>My Profile</div>
              <div style={{ display:'flex', alignItems:'center', gap:13 }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <img src={`https://i.pravatar.cc/150?img=${((ME.avatar-1)%70)+1}`} alt={ME.name}
                    style={{ width:50, height:50, borderRadius:'50%', objectFit:'cover', display:'block', border:'2.5px solid #fff', boxShadow:'0 2px 10px rgba(99,102,241,0.18)' }} />
                  <div style={{ position:'absolute', bottom:0, right:0, width:14, height:14, borderRadius:'50%', background:'#0EA86A', border:'2px solid #fff' }} />
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:14.5, fontWeight:800, color:C.navy, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ME.name}</div>
                  <div style={{ fontSize:11.5, color:C.muted, marginTop:1 }}>{ME.empId}</div>
                  <div style={{ display:'flex', gap:5, marginTop:7, flexWrap:'wrap' as const }}>
                    <span style={{ fontSize:11, fontWeight:600, padding:'2px 9px', borderRadius:99, background:'rgba(99,102,241,0.12)', color:'#4338CA', border:'1px solid rgba(99,102,241,0.20)' }}>{ME.department}</span>
                    <span style={{ fontSize:11, fontWeight:600, padding:'2px 9px', borderRadius:99, background:'rgba(255,255,255,0.70)', color:C.navy, border:`1px solid ${C.border}` }}>{ME.role}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding:'20px 20px 24px', display:'flex', flexDirection:'column' as const, gap:18 }}>

              {/* Month picker */}
              <div>
                <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:'block', textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:8 }}>Select Period</label>
                <MonthPicker
                  month={selMonth} year={selYear}
                  setMonth={m=>{setSelMonth(m);setState('idle');setCard(null)}}
                  setYear={y=>{setSelYear(y);setState('idle');setCard(null)}}
                  mode={pickerMode}
                  setMode={m=>{setPickerMode(m);setState('idle');setCard(null)}}
                  yearMonths={yearMonths}
                  setYearMonths={ms=>{setYearMonths(ms);setState('idle');setCard(null)}}
                />
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                style={{ width:'100%', height:44, borderRadius:12, border:'none', background:canGenerate?C.navy:'#D0D3E4', fontSize:14, fontWeight:700, color:canGenerate?'#fff':'#A0A4BC', cursor:canGenerate?'pointer':'not-allowed', fontFamily:'inherit', transition:'background 0.15s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                onMouseEnter={e=>{if(canGenerate)e.currentTarget.style.background='#2A3050'}}
                onMouseLeave={e=>{if(canGenerate)e.currentTarget.style.background=C.navy}}
              >
                <ClipboardList size={16} strokeWidth={2} /> Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div>

          {/* Idle */}
          {state==='idle' && (
            <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, minHeight:420, display:'flex', flexDirection:'column' as const, alignItems:'center', justifyContent:'center', gap:14, padding:48 }}>
              <div style={{ width:64, height:64, borderRadius:20, background:C.surface, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <ClipboardList size={28} strokeWidth={1.3} style={{color:'#C0C4D8'}} />
              </div>
              <div style={{ textAlign:'center' as const }}>
                <p style={{ fontSize:16, fontWeight:700, color:C.navy, margin:'0 0 6px' }}>No Report Generated Yet</p>
                <p style={{ fontSize:13.5, color:C.muted, margin:0, maxWidth:300, lineHeight:1.6 }}>
                  Select a period on the left and click <strong>Generate Report</strong> to view your attendance data.
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {state==='loading' && (
            <div style={{ display:'flex', flexDirection:'column' as const, gap:16 }}>
              <SkeletonCard />
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:4 }}>
                <div style={{ width:18, height:18, borderRadius:'50%', border:`2.5px solid ${C.border}`, borderTopColor:C.navy, animation:'spin 0.75s linear infinite' }}/>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <span style={{ fontSize:13, color:C.muted, fontWeight:500 }}>Generating your attendance report…</span>
              </div>
            </div>
          )}

          {/* Done */}
          {state==='done' && card && (
            <div>
              {/* Toolbar */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:C.navy }}>My Attendance Report</span>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5, height:26, padding:'0 10px', background:'#ECEEF5', border:`1px solid ${C.border}`, borderRadius:99, fontSize:11.5, fontWeight:600, color:C.muted }}>
                    <CalendarDays size={11} strokeWidth={2} /> {currentMo.label} · {currentMo.range}
                  </span>
                </div>
                <button
                  style={{ display:'flex', alignItems:'center', gap:7, height:36, padding:'0 16px', borderRadius:9, border:'1px solid #16A34A40', background:'#F0FDF4', fontSize:12.5, fontWeight:600, color:'#15803D', cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='#DCFCE7';e.currentTarget.style.borderColor='#16A34A80'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#F0FDF4';e.currentTarget.style.borderColor='#16A34A40'}}
                >
                  <FileSpreadsheet size={14} strokeWidth={2} /> Download Report
                </button>
              </div>

              <AttendanceCardView card={card} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
