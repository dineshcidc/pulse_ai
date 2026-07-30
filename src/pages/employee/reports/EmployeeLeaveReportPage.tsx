import { useState } from 'react'
import {
  ChevronLeft, ChevronRight, ChevronDown, FileSpreadsheet,
  ClipboardList, CalendarDays, AlertCircle, Download, MoreHorizontal,
  ArrowLeft,
} from 'lucide-react'
import DateRangePicker from '../../../components/reports/DateRangePicker'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', bg: '#F0F2F8', surface: '#F7F8FC' }

const MONTH_NAMES  = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_SHORT  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTH_DAYS   = [31,28,28,31,30,31,30,31,31,30,31,30]
const WORKING_PER_MONTH = [22,20,21,22,22,21,23,21,22,23,20,23]

/* ── Current employee (logged-in user) ── */
const ME = {
  empId:      'EMP-2024-0042',
  name:       'John Doe',
  avatar:     32,
  department: 'Engineering',
  role:       'Senior Engineer',
  project:    'Pulse.AI Platform v2',
  manager:    'Rohan Mehta',
  email:      'john.doe@concertidc.com',
}

/* ── Leave seed data for Sarah ── */
const LEAVE_BASE = { planned: 2, unplanned: 1, other: 0, dates: ['05 May','06 May','19 May'] }

/* ── Types ── */
interface MonthOption { label: string; value: string; working: number; range: string }
interface LeaveCard {
  totalLeave: number; plannedLeave: number; unplannedLeave: number; otherLeave: number
  leaveDates: string[]
  leaveByMonth?: { label: string; short: string; dates: string[] }[]
  isYearMode?: boolean
  month: string; dateRange: string
}

/* ── Helpers ── */
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

function buildCard(mo: MonthOption): LeaveCard {
  const sc = mo.working / 22
  const planned   = Math.round(LEAVE_BASE.planned   * sc)
  const unplanned = Math.round(LEAVE_BASE.unplanned * sc)
  const other     = Math.round(LEAVE_BASE.other     * sc)
  const monIdx    = parseInt(mo.value.split('-')[1]) - 1
  const short     = MONTH_SHORT[monIdx]
  const dates     = mo.value === '2026-05' ? LEAVE_BASE.dates : LEAVE_BASE.dates.map(d => d.replace('May', short))
  return { totalLeave:planned+unplanned+other, plannedLeave:planned, unplannedLeave:unplanned, otherLeave:other, leaveDates:dates, month:mo.label, dateRange:mo.range }
}

function buildYearCard(months: number[], year: number): LeaveCard {
  let totalPlanned=0, totalUnplanned=0, totalOther=0
  const leaveByMonth: { label: string; short: string; dates: string[] }[] = []
  for (const m of months) {
    const sc = WORKING_PER_MONTH[m]/22
    const p = Math.round(LEAVE_BASE.planned   * sc)
    const u = Math.round(LEAVE_BASE.unplanned * sc)
    const o = Math.round(LEAVE_BASE.other     * sc)
    totalPlanned += p; totalUnplanned += u; totalOther += o
    if (p + u + o > 0) {
      const short = MONTH_SHORT[m]
      const dates = LEAVE_BASE.dates.map(d => d.replace('May', short))
      leaveByMonth.push({ label:`${MONTH_NAMES[m]} ${year}`, short, dates })
    }
  }
  const mo = getYearOption(months, year)
  return { totalLeave:totalPlanned+totalUnplanned+totalOther, plannedLeave:totalPlanned, unplannedLeave:totalUnplanned, otherLeave:totalOther, leaveDates:leaveByMonth.map(m=>m.short), leaveByMonth, isYearMode:true, month:mo.label, dateRange:mo.range }
}

/* ── Month picker ── */
function weekdaysBetween(fromIso: string, toIso: string): number {
  const a = new Date(fromIso + 'T00:00:00'), b = new Date(toIso + 'T00:00:00')
  if (isNaN(a.getTime()) || isNaN(b.getTime()) || b < a) return 0
  let n = 0; const d = new Date(a)
  while (d <= b) { const wd = d.getDay(); if (wd !== 0 && wd !== 6) n++; d.setDate(d.getDate() + 1) }
  return n
}
function fmtNice(iso: string) { const dt = new Date(iso + 'T00:00:00'); return `${String(dt.getDate()).padStart(2, '0')} ${MONTH_SHORT[dt.getMonth()]} ${dt.getFullYear()}` }
function buildRangeCard(fromIso: string, toIso: string): LeaveCard {
  const a = new Date(fromIso + 'T00:00:00'), b = new Date(toIso + 'T00:00:00')
  // Seed leave dates are in May 2026 ('05 May' …); match those falling inside the range.
  const datesInRange = LEAVE_BASE.dates.filter(s => { const dt = new Date(2026, 4, parseInt(s)); return dt >= a && dt <= b })
  const total = datesInRange.length
  const planned = Math.min(LEAVE_BASE.planned, total)
  const unplanned = total - planned
  return {
    totalLeave: total, plannedLeave: planned, unplannedLeave: unplanned, otherLeave: 0,
    leaveDates: datesInRange, month: `${fmtNice(fromIso)} – ${fmtNice(toIso)}`, dateRange: `${weekdaysBetween(fromIso, toIso)} working days`,
  }
}

function MonthPicker({ month, year, setMonth, setYear, mode, setMode, yearMonths, setYearMonths, from, to, setFrom, setTo }: {
  month:number; year:number; setMonth:(m:number)=>void; setYear:(y:number)=>void
  mode:'month'|'year'; setMode:(m:'month'|'year')=>void
  yearMonths:number[]; setYearMonths:(ms:number[])=>void
  from:string; to:string; setFrom:(v:string)=>void; setTo:(v:string)=>void
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
      {mode==='month' && <DateRangePicker from={from} to={to} setFrom={setFrom} setTo={setTo} />}
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
        <div style={sk(140,28,99)} />
        <div style={sk(32,32,8)} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', padding:'18px 20px', gap:0 }}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{ padding:'0 16px 0 0', borderRight:i<3?`1px solid ${C.border}`:'none', paddingLeft:i>0?16:0 }}>
            <div style={{...sk(18,18,'50%'),marginBottom:8}} />
            <div style={{...sk(36,16,5),marginBottom:6}} />
            <div style={sk(70,11,4)} />
          </div>
        ))}
      </div>
      <div style={{ padding:'12px 20px', display:'flex', gap:6 }}>
        {[0,1,2].map(i=><div key={i} style={sk(62,22,99)} />)}
      </div>
      <div style={{ padding:'10px 20px', background:C.surface, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between' }}>
        <div style={sk(90,11,5)} /> <div style={sk(160,11,5)} />
      </div>
    </div>
  )
}

/* ── Leave result card ── */
function LeaveCardView({ card }: { card: LeaveCard }) {
  const [expandedMonth, setExpandedMonth] = useState<string|null>(null)

  const STATS = [
    { label:'Total Leave',  value:card.totalLeave,     color:'#F59E0B', bg:'rgba(245,158,11,0.09)',  icon:CalendarDays   },
    { label:'Planned',      value:card.plannedLeave,   color:'#2563EB', bg:'rgba(37,99,235,0.09)',   icon:CalendarDays   },
    { label:'Unplanned',    value:card.unplannedLeave, color:'#E84855', bg:'rgba(232,72,85,0.09)',   icon:AlertCircle    },
    { label:'Other',        value:card.otherLeave,     color:'#7C3AED', bg:'rgba(124,58,237,0.09)',  icon:MoreHorizontal },
  ]

  const hasLeave = card.totalLeave > 0

  return (
    <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, overflow:'hidden', animation:'cardIn 0.36s cubic-bezier(0.22,1,0.36,1) both' }}>
      <style>{`@keyframes cardIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes fadeSlide{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', borderBottom:`1px solid ${C.border}` }}>
        <img src={`https://randomuser.me/api/portraits/men/32.jpg`} alt={ME.name}
          style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:`2px solid ${C.border}` }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14.5, fontWeight:700, color:C.navy }}>{ME.name}</div>
          <div style={{ fontSize:11.5, color:C.muted, marginTop:2 }}>{ME.empId} · {ME.role}</div>
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
          <div key={s.label} style={{ padding:'16px 20px', borderRight:i<3?`1px solid ${C.border}`:'none', background:i===0?s.bg:'transparent' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
              <s.icon size={13} style={{color:s.color}} strokeWidth={1.8} />
              <span style={{ fontSize:10.5, fontWeight:600, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.05em' }}>{s.label}</span>
            </div>
            <div style={{ fontSize:18, fontWeight:700, color:i===0?s.color:C.navy, letterSpacing:'-0.3px', lineHeight:1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Leave dates */}
      {hasLeave && (
        <div style={{ padding:'12px 20px 14px', borderTop:`1px solid ${C.border}` }}>
          <div style={{ fontSize:10.5, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:10 }}>
            {card.isYearMode ? 'Months with Leave' : 'Leave Dates'}
          </div>

          {!card.isYearMode && (
            <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6 }}>
              {card.leaveDates.slice(0,10).map(d=>(
                <span key={d} style={{ fontSize:11.5, fontWeight:600, padding:'4px 10px', borderRadius:99, background:'#ECEEF5', color:C.navy, border:'none' }}>{d}</span>
              ))}
              {card.leaveDates.length>10 && (
                <span style={{ fontSize:11.5, fontWeight:600, padding:'4px 10px', borderRadius:99, background:C.surface, color:C.muted }}>+{card.leaveDates.length-10} more</span>
              )}
              {card.leaveDates.length===0 && <span style={{ fontSize:11.5, color:C.muted }}>No leave dates recorded</span>}
            </div>
          )}

          {card.isYearMode && card.leaveByMonth && (
            <div>
              <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6, marginBottom: expandedMonth ? 10 : 0 }}>
                {card.leaveByMonth.map(({ short })=>{
                  const isOpen = expandedMonth === short
                  return (
                    <button key={short} onClick={()=>setExpandedMonth(isOpen?null:short)} style={{
                      display:'inline-flex', alignItems:'center', gap:5,
                      height:28, padding:'0 10px', borderRadius:99,
                      border:'none', cursor:'pointer', fontFamily:'inherit',
                      background: isOpen ? '#D8DBE8' : '#ECEEF5',
                      transition:'background 0.15s',
                    }}
                      onMouseEnter={e=>{if(!isOpen)e.currentTarget.style.background='#D8DBE8'}}
                      onMouseLeave={e=>{if(!isOpen)e.currentTarget.style.background='#ECEEF5'}}
                    >
                      <span style={{ fontSize:12, fontWeight:600, color:C.navy }}>{short}</span>
                      <ChevronDown size={11} style={{ color:C.muted, transform:isOpen?'rotate(180deg)':'rotate(0deg)', transition:'transform 0.2s' }} />
                    </button>
                  )
                })}
              </div>
              {expandedMonth && (()=>{
                const detail = card.leaveByMonth!.find(m=>m.short===expandedMonth)
                if (!detail) return null
                return (
                  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'12px 14px', animation:'fadeSlide 0.18s ease both' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
                      <CalendarDays size={11} style={{color:C.muted}} strokeWidth={1.8} />
                      <span style={{ fontSize:11.5, fontWeight:700, color:C.navy }}>{detail.label}</span>
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6 }}>
                      {detail.dates.length > 0
                        ? detail.dates.map(d=>(
                            <span key={d} style={{ fontSize:11.5, fontWeight:600, padding:'4px 10px', borderRadius:99, background:'#fff', color:C.navy, border:`1px solid ${C.border}` }}>{d}</span>
                          ))
                        : <span style={{ fontSize:11.5, color:C.muted }}>No dates recorded for this month</span>
                      }
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      )}

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
export default function EmployeeLeaveReportPage({ onBack }: { onBack: () => void }) {
  const [selMonth,    setSelMonth]    = useState(4)
  const [selYear,     setSelYear]     = useState(2026)
  const [fromDate,    setFromDate]    = useState('')
  const [toDate,      setToDate]      = useState('')
  const [pickerMode,  setPickerMode]  = useState<'month'|'year'>('month')
  const [yearMonths,  setYearMonths]  = useState<number[]>(Array.from({length:12},(_,i)=>i))
  const [state,       setState]       = useState<'idle'|'loading'|'done'>('idle')
  const [card,        setCard]        = useState<LeaveCard|null>(null)

  const rangeActive = pickerMode==='month' && fromDate!=='' && toDate!==''
  const canGenerate = pickerMode==='year' ? yearMonths.length > 0 : true

  function handleGenerate() {
    if (!canGenerate) return
    setState('loading'); setCard(null)
    setTimeout(()=>{
      const result = pickerMode==='year'
        ? buildYearCard(yearMonths, selYear)
        : rangeActive
          ? buildRangeCard(fromDate, toDate)
          : buildCard(getMonthOption(selMonth, selYear))
      setCard(result)
      setState('done')
    }, 1000)
  }

  const currentMo = pickerMode==='month'
    ? getMonthOption(selMonth, selYear)
    : getYearOption(yearMonths, selYear)
  const ctxLabel = rangeActive ? `${fmtNice(fromDate)} – ${fmtNice(toDate)}` : currentMo.label
  const ctxRange = rangeActive ? `${weekdaysBetween(fromDate, toDate)} working days` : currentMo.range

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
        <span style={{ fontSize:13, color:'#C8CCE0', fontWeight:400 }}>/</span>
        <button
          onClick={onBack}
          style={{ fontSize:13, fontWeight:500, color:C.muted, background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:'inherit', transition:'color 0.14s' }}
          onMouseEnter={e=>{e.currentTarget.style.color=C.navy}}
          onMouseLeave={e=>{e.currentTarget.style.color=C.muted}}
        >
          Reports
        </button>
        <span style={{ fontSize:13, color:'#C8CCE0', fontWeight:400 }}>/</span>
        <span style={{ fontSize:13, fontWeight:700, color:C.navy }}>Leave Report</span>
      </div>

      {/* 4 / 8 split */}
      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:20, alignItems:'start' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ position:'sticky', top:0 }}>
          <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, overflow:'hidden' }}>

            {/* Employee profile block */}
            <div style={{ padding:'20px 20px 20px', borderBottom:`1px solid ${C.border}`, background:'linear-gradient(135deg, #EEF2FF 0%, #F0FDF4 100%)' }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:'#6366F1', textTransform:'uppercase' as const, letterSpacing:'0.07em', marginBottom:14 }}>My Profile</div>
              <div style={{ display:'flex', alignItems:'center', gap:13 }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <img src={`https://randomuser.me/api/portraits/men/32.jpg`} alt={ME.name}
                    style={{ width:50, height:50, borderRadius:'50%', objectFit:'cover', display:'block', border:'2.5px solid #fff', boxShadow:'0 2px 10px rgba(99,102,241,0.18)' }} />
                  <div style={{ position:'absolute', bottom:0, right:0, width:14, height:14, borderRadius:'50%', background:'#0EA86A', border:'2px solid #fff' }} />
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:14.5, fontWeight:800, color:C.navy, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ME.name}</div>
                  <div style={{ fontSize:11.5, color:C.muted, marginTop:1 }}>{ME.empId}</div>
                  <div style={{ marginTop:7 }}>
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
                  setMonth={m=>{setSelMonth(m);setFromDate('');setToDate('');setState('idle');setCard(null)}}
                  setYear={y=>{setSelYear(y);setFromDate('');setToDate('');setState('idle');setCard(null)}}
                  mode={pickerMode}
                  setMode={m=>{setPickerMode(m);setFromDate('');setToDate('');setState('idle');setCard(null)}}
                  yearMonths={yearMonths}
                  setYearMonths={ms=>{setYearMonths(ms);setState('idle');setCard(null)}}
                  from={fromDate}
                  to={toDate}
                  setFrom={v=>{setFromDate(v);setState('idle');setCard(null)}}
                  setTo={v=>{setToDate(v);setState('idle');setCard(null)}}
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
                  Select a period on the left and click <strong>Generate Report</strong> to view your leave data.
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
                <span style={{ fontSize:13, color:C.muted, fontWeight:500 }}>Generating your leave report…</span>
              </div>
            </div>
          )}

          {/* Done */}
          {state==='done' && card && (
            <div>
              {/* Toolbar */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:C.navy }}>My Leave Report</span>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5, height:26, padding:'0 10px', background:'#ECEEF5', border:`1px solid ${C.border}`, borderRadius:99, fontSize:11.5, fontWeight:600, color:C.muted }}>
                    <CalendarDays size={11} strokeWidth={2} /> {ctxLabel} · {ctxRange}
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

              <LeaveCardView card={card} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
