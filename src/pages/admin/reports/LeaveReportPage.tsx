import { useState, useRef, useEffect } from 'react'
import {
  Search, X, ChevronLeft, ChevronRight, ChevronDown, FileSpreadsheet,
  ClipboardList, Users, Briefcase,
  CalendarDays, AlertCircle, Download, MoreHorizontal,
} from 'lucide-react'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', bg: '#F0F2F8', surface: '#F7F8FC' }

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const MONTH_DAYS  = [31,28,28,31,30,31,30,31,31,30,31,30]
const WORKING_PER_MONTH = [22,20,21,22,22,21,23,21,22,23,20,23]

/* ── Types ── */
interface Employee { empId: string; name: string; avatar: number; department: string; role: string }
interface Project  { id: string; name: string; empIds: string[] }
interface MonthOption { label: string; value: string; working: number; range: string }
interface LeaveCard {
  employee: Employee; projectName: string
  totalLeave: number; plannedLeave: number; unplannedLeave: number; otherLeave: number
  leaveDates: string[]
  leaveByMonth?: { label: string; short: string; dates: string[] }[]
  isYearMode?: boolean
  month: string; dateRange: string
}

/* ── Static data ── */
const ALL_EMPLOYEES: Employee[] = [
  { empId:'EMP-0047', name:'Sarah Johnson',   avatar:47, department:'Engineering',   role:'Senior Engineer'      },
  { empId:'EMP-0020', name:'Tom Davis',        avatar:20, department:'Engineering',   role:'Backend Engineer'     },
  { empId:'EMP-0056', name:'Karthik Nair',     avatar:56, department:'Engineering',   role:'Full Stack Developer' },
  { empId:'EMP-0063', name:'Chris Thompson',   avatar:63, department:'Engineering',   role:'Platform Engineer'    },
  { empId:'EMP-0010', name:'Priya Sharma',     avatar:10, department:'Product',       role:'Head of Product'      },
  { empId:'EMP-0036', name:'Anjali Singh',     avatar:36, department:'Product',       role:'Product Analyst'      },
  { empId:'EMP-0054', name:'Meera Pillai',     avatar:54, department:'Product',       role:'Senior PM'            },
  { empId:'EMP-0041', name:'Fatima Al-Zahra', avatar:41, department:'Design',        role:'Design Lead'          },
  { empId:'EMP-0044', name:'Emma Wilson',      avatar:44, department:'Design',        role:'UI/UX Designer'       },
  { empId:'EMP-0016', name:'Riya Kapoor',      avatar:16, department:'Design',        role:'Visual Designer'      },
  { empId:'EMP-0033', name:'Mike Chen',        avatar:33, department:'QA & Testing',  role:'QA Manager'           },
  { empId:'EMP-0052', name:'Arjun Patel',      avatar:52, department:'QA & Testing',  role:'QA Engineer'          },
  { empId:'EMP-0019', name:'Shweta Rao',       avatar:19, department:'QA & Testing',  role:'Automation Engineer'  },
  { empId:'EMP-0025', name:'Lisa Garcia',      avatar:25, department:'DevOps',        role:'DevOps Lead'          },
  { empId:'EMP-0037', name:'Nikhil Verma',     avatar:37, department:'DevOps',        role:'SRE Engineer'         },
  { empId:'EMP-0046', name:'Tanvi Desai',      avatar:46, department:'DevOps',        role:'Cloud Architect'      },
  { empId:'EMP-0048', name:'Sneha Iyer',       avatar:48, department:'Mobile',        role:'Mobile Lead'          },
  { empId:'EMP-0003', name:'Rahul Khanna',     avatar:3,  department:'Mobile',        role:'iOS Developer'        },
  { empId:'EMP-0021', name:'Kavitha Reddy',    avatar:21, department:'HR',            role:'HR Manager'           },
  { empId:'EMP-0018', name:'Nina Volkov',      avatar:18, department:'Finance',       role:'Finance Head'         },
]

const ALL_PROJECTS: Project[] = [
  { id:'p1', name:'Pulse.AI Platform v2',   empIds:['EMP-0047','EMP-0020','EMP-0010','EMP-0036','EMP-0041','EMP-0044','EMP-0033','EMP-0052','EMP-0025'] },
  { id:'p2', name:'HDFC Digital Portal',    empIds:['EMP-0047','EMP-0056','EMP-0033','EMP-0019','EMP-0037'] },
  { id:'p3', name:'CloudSync Pro',          empIds:['EMP-0020','EMP-0056','EMP-0025','EMP-0037','EMP-0046'] },
  { id:'p4', name:'Retail CRM System',      empIds:['EMP-0044','EMP-0016','EMP-0041','EMP-0052'] },
  { id:'p5', name:'InfraMesh Dashboard',    empIds:['EMP-0016','EMP-0041','EMP-0046','EMP-0025'] },
  { id:'p6', name:'TechCorp ERP Migration', empIds:['EMP-0033','EMP-0019','EMP-0063','EMP-0054'] },
  { id:'p7', name:'FinTrack App',           empIds:['EMP-0048','EMP-0003','EMP-0036','EMP-0018'] },
  { id:'p8', name:'EduPortal LMS',          empIds:['EMP-0010','EMP-0054','EMP-0036','EMP-0021'] },
]

/* Leave seed data (based on May 2026 / 22 working days) */
const LEAVE_DATA: Record<string, { planned: number; unplanned: number; other: number; dates: string[] }> = {
  'EMP-0047': { planned:2, unplanned:1, other:0, dates:['05 May','06 May','19 May']         },
  'EMP-0020': { planned:1, unplanned:0, other:0, dates:['14 May']                            },
  'EMP-0056': { planned:1, unplanned:2, other:0, dates:['07 May','20 May','21 May']          },
  'EMP-0063': { planned:1, unplanned:1, other:0, dates:['09 May','26 May']                   },
  'EMP-0010': { planned:1, unplanned:1, other:0, dates:['12 May','22 May']                   },
  'EMP-0036': { planned:0, unplanned:2, other:0, dates:['08 May','15 May']                   },
  'EMP-0054': { planned:1, unplanned:0, other:0, dates:['21 May']                            },
  'EMP-0041': { planned:3, unplanned:1, other:0, dates:['01 May','02 May','05 May','19 May'] },
  'EMP-0044': { planned:2, unplanned:2, other:0, dates:['13 May','14 May','20 May','21 May'] },
  'EMP-0016': { planned:0, unplanned:1, other:0, dates:['27 May']                            },
  'EMP-0033': { planned:2, unplanned:0, other:0, dates:['19 May','20 May']                   },
  'EMP-0052': { planned:1, unplanned:1, other:0, dates:['08 May','22 May']                   },
  'EMP-0019': { planned:1, unplanned:1, other:0, dates:['06 May','28 May']                   },
  'EMP-0025': { planned:1, unplanned:0, other:0, dates:['15 May']                            },
  'EMP-0037': { planned:2, unplanned:0, other:0, dates:['12 May','13 May']                   },
  'EMP-0046': { planned:0, unplanned:0, other:0, dates:[]                                    },
  'EMP-0048': { planned:2, unplanned:0, other:0, dates:['07 May','08 May']                   },
  'EMP-0003': { planned:2, unplanned:1, other:0, dates:['14 May','15 May','26 May']          },
  'EMP-0021': { planned:0, unplanned:0, other:0, dates:[]                                    },
  'EMP-0018': { planned:0, unplanned:0, other:0, dates:[]                                    },
}

const EMP_PRIMARY_PROJECT: Record<string, string> = {
  'EMP-0047':'Pulse.AI Platform v2', 'EMP-0020':'Pulse.AI Platform v2',
  'EMP-0056':'HDFC Digital Portal',  'EMP-0063':'TechCorp ERP Migration',
  'EMP-0010':'Pulse.AI Platform v2', 'EMP-0036':'Pulse.AI Platform v2',
  'EMP-0054':'EduPortal LMS',        'EMP-0041':'Pulse.AI Platform v2',
  'EMP-0044':'Retail CRM System',    'EMP-0016':'Retail CRM System',
  'EMP-0033':'Pulse.AI Platform v2', 'EMP-0052':'Pulse.AI Platform v2',
  'EMP-0019':'HDFC Digital Portal',  'EMP-0025':'CloudSync Pro',
  'EMP-0037':'HDFC Digital Portal',  'EMP-0046':'CloudSync Pro',
  'EMP-0048':'FinTrack App',         'EMP-0003':'FinTrack App',
  'EMP-0021':'EduPortal LMS',        'EMP-0018':'FinTrack App',
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

function buildLeaveCard(emp: Employee, mo: MonthOption, projectName: string): LeaveCard {
  const base = LEAVE_DATA[emp.empId] ?? { planned:0, unplanned:0, other:0, dates:[] }
  const sc   = mo.working / 22
  const planned   = Math.round(base.planned   * sc)
  const unplanned = Math.round(base.unplanned * sc)
  const other     = Math.round(base.other     * sc)
  const monIdx    = parseInt(mo.value.split('-')[1]) - 1
  const short     = MONTH_SHORT[monIdx]
  const dates     = mo.value === '2026-05' ? base.dates : base.dates.map(d => d.replace('May', short))
  return { employee:emp, projectName, totalLeave:planned+unplanned+other, plannedLeave:planned, unplannedLeave:unplanned, otherLeave:other, leaveDates:dates, month:mo.label, dateRange:mo.range }
}

function buildLeaveYearCard(emp: Employee, months: number[], year: number, projectName: string): LeaveCard {
  const base = LEAVE_DATA[emp.empId] ?? { planned:0, unplanned:0, other:0, dates:[] }
  let totalPlanned=0, totalUnplanned=0, totalOther=0
  const leaveByMonth: { label: string; short: string; dates: string[] }[] = []

  for (const m of months) {
    const sc = WORKING_PER_MONTH[m]/22
    const p = Math.round(base.planned   * sc)
    const u = Math.round(base.unplanned * sc)
    const o = Math.round(base.other     * sc)
    totalPlanned += p; totalUnplanned += u; totalOther += o
    if (p + u + o > 0) {
      const short = MONTH_SHORT[m]
      const dates = base.dates.map(d => d.replace('May', short))
      leaveByMonth.push({ label:`${MONTH_NAMES[m]} ${year}`, short, dates })
    }
  }

  const mo = getYearOption(months, year)
  return {
    employee:emp, projectName,
    totalLeave: totalPlanned+totalUnplanned+totalOther,
    plannedLeave:totalPlanned, unplannedLeave:totalUnplanned, otherLeave:totalOther,
    leaveDates: leaveByMonth.map(m => m.short),
    leaveByMonth,
    isYearMode:true, month:mo.label, dateRange:mo.range,
  }
}

/* ── Employee chip ── */
function EmpChip({ emp, onRemove }: { emp: Employee; onRemove: () => void }) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:6, height:30, padding:'0 8px 0 4px', background:'#EEF2FF', border:'1px solid #C7D2FE', borderRadius:99 }}>
      <img src={`https://i.pravatar.cc/150?img=${((emp.avatar-1)%70)+1}`} style={{ width:22, height:22, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
      <span style={{ fontSize:12, fontWeight:600, color:'#3730A3', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:120 }}>{emp.name}</span>
      <button onClick={onRemove} style={{ width:16, height:16, borderRadius:'50%', border:'none', background:'#C7D2FE', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, padding:0 }}>
        <X size={9} style={{ color:'#4338CA' }} />
      </button>
    </div>
  )
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
function sk(w:number|string,h:number,r:number|string):React.CSSProperties {
  return { width:w, height:h, borderRadius:r, background:'linear-gradient(90deg,#F0F2F8 25%,#E4E6EF 50%,#F0F2F8 75%)', backgroundSize:'1000px 100%', animation:'shimmer 1.4s infinite linear', flexShrink:0 }
}

/* ── Leave card ── */
function LeaveCardView({ card, delay=0 }: { card:LeaveCard; delay?:number }) {
  const [expandedMonth, setExpandedMonth] = useState<string|null>(null)

  const STATS = [
    { label:'Total Leave',   value:card.totalLeave,    color:'#F59E0B', bg:'rgba(245,158,11,0.09)',  icon:CalendarDays  },
    { label:'Planned',       value:card.plannedLeave,  color:'#2563EB', bg:'rgba(37,99,235,0.09)',   icon:CalendarDays  },
    { label:'Unplanned',     value:card.unplannedLeave,color:'#E84855', bg:'rgba(232,72,85,0.09)',   icon:AlertCircle   },
    { label:'Other',         value:card.otherLeave,    color:'#7C3AED', bg:'rgba(124,58,237,0.09)',  icon:MoreHorizontal},
  ]

  const hasLeave = card.totalLeave > 0

  return (
    <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, overflow:'hidden', animation:'cardIn 0.36s cubic-bezier(0.22,1,0.36,1) both', animationDelay:`${delay}ms` }}>
      <style>{`@keyframes cardIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}} @keyframes fadeSlide{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', borderBottom:`1px solid ${C.border}` }}>
        <img src={`https://i.pravatar.cc/150?img=${((card.employee.avatar-1)%70)+1}`} alt={card.employee.name}
          style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', flexShrink:0, border:`2px solid ${C.border}` }} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:14.5, fontWeight:700, color:C.navy }}>{card.employee.name}</div>
          <div style={{ fontSize:11.5, color:C.muted, marginTop:2 }}>{card.employee.empId} · {card.employee.department} · {card.employee.role}</div>
        </div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', background:C.surface, border:`1px solid ${C.border}`, borderRadius:99, flexShrink:0 }}>
          <Briefcase size={11} style={{color:C.muted}} strokeWidth={1.8} />
          <span style={{ fontSize:12, fontWeight:600, color:'#3D4266' }}>{card.projectName}</span>
        </div>
        <button style={{ width:34, height:34, borderRadius:9, border:`1px solid ${C.border}`, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.15s' }}
          onMouseEnter={e=>{e.currentTarget.style.background='#F0FDF4';e.currentTarget.style.borderColor='#16A34A40'}}
          onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.borderColor=C.border}}
          title="Download this report">
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

      {/* Leave dates / months section */}
      {hasLeave && (
        <div style={{ padding:'12px 20px 14px', borderTop:`1px solid ${C.border}` }}>
          <div style={{ fontSize:10.5, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:10 }}>
            {card.isYearMode ? 'Months with Leave' : 'Leave Dates'}
          </div>

          {/* ── Monthly mode: plain date chips (light grey) ── */}
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

          {/* ── Year mode: expandable month chips ── */}
          {card.isYearMode && card.leaveByMonth && (
            <div>
              {/* Month chips row */}
              <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6, marginBottom: expandedMonth ? 10 : 0 }}>
                {card.leaveByMonth.map(({ label, short })=>{
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

              {/* Accordion panel for expanded month */}
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
export default function LeaveReportPage() {
  const [tab, setTab]                         = useState<'employee'|'project'>('employee')
  const [empSearch, setEmpSearch]             = useState('')
  const [showSuggest, setShowSuggest]         = useState(false)
  const [selectedEmps, setSelectedEmps]       = useState<Employee[]>([])
  const [allSelected, setAllSelected]         = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project|null>(null)
  const [projectEmps, setProjectEmps]         = useState<Employee[]>([])
  const [selMonth, setSelMonth]               = useState(4)
  const [selYear,  setSelYear]                = useState(2026)
  const [pickerMode, setPickerMode]           = useState<'month'|'year'>('month')
  const [yearMonths, setYearMonths]           = useState<number[]>(Array.from({length:12},(_,i)=>i))
  const [state, setState]                     = useState<'idle'|'loading'|'done'>('idle')
  const [cards, setCards]                     = useState<LeaveCard[]>([])
  const searchRef                             = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    function handle(e:MouseEvent) { if(searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggest(false) }
    document.addEventListener('mousedown',handle)
    return ()=>document.removeEventListener('mousedown',handle)
  },[])

  const suggestions = ALL_EMPLOYEES.filter(e =>
    (e.name.toLowerCase().includes(empSearch.toLowerCase()) || e.empId.toLowerCase().includes(empSearch.toLowerCase())) &&
    !selectedEmps.find(s=>s.empId===e.empId)
  )

  function addEmp(emp:Employee) { setSelectedEmps(p=>[...p,emp]); setEmpSearch(''); setShowSuggest(false) }
  function removeEmp(empId:string) { setAllSelected(false); setSelectedEmps(p=>p.filter(e=>e.empId!==empId)) }
  function addAll() { setAllSelected(true); setSelectedEmps(ALL_EMPLOYEES); setEmpSearch(''); setShowSuggest(false) }
  function clearAll() { setAllSelected(false); setSelectedEmps([]) }
  function selectProject(proj:Project) { setSelectedProject(proj); setProjectEmps(proj.empIds.map(id=>ALL_EMPLOYEES.find(e=>e.empId===id)!).filter(Boolean)) }
  function removeProjectEmp(empId:string) { setProjectEmps(p=>p.filter(e=>e.empId!==empId)) }

  function handleGenerate() {
    const emps = tab==='employee' ? (allSelected?ALL_EMPLOYEES:selectedEmps) : projectEmps
    if(emps.length===0) return
    if(pickerMode==='year' && yearMonths.length===0) return
    setState('loading'); setCards([])
    setTimeout(()=>{
      setCards(emps.map(emp=>{
        const projName = tab==='project' && selectedProject ? selectedProject.name : (EMP_PRIMARY_PROJECT[emp.empId]??'No Project')
        return pickerMode==='month'
          ? buildLeaveCard(emp, getMonthOption(selMonth,selYear), projName)
          : buildLeaveYearCard(emp, yearMonths, selYear, projName)
      }))
      setState('done')
    }, 1300)
  }

  const canGenerate = (pickerMode==='year'?yearMonths.length>0:true) &&
    (tab==='employee'?(allSelected||selectedEmps.length>0):projectEmps.length>0)

  const currentMo = pickerMode==='month' ? getMonthOption(selMonth,selYear) : getYearOption(yearMonths,selYear)

  return (
    <div style={{ fontFamily:"'DM Sans', system-ui, sans-serif" }}>

      {/* Page header */}
      <div style={{ marginBottom:22 }}>
        <h1 style={{ fontSize:20, fontWeight:700, color:C.navy, margin:'0 0 4px' }}>Leave Report</h1>
        <p style={{ fontSize:13.5, color:C.muted, margin:0 }}>Generate leave reports for employees, teams, or project groups</p>
      </div>

      {/* 4 / 8 split */}
      <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:20, alignItems:'start' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ position:'sticky', top:0 }}>
          <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, overflow:'hidden' }}>

            {/* Tabs */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderBottom:`1px solid ${C.border}` }}>
              {(['employee','project'] as const).map(t=>(
                <button key={t} onClick={()=>{ setTab(t); setState('idle'); setCards([]); setAllSelected(false); setSelectedEmps([]) }}
                  style={{ height:46, border:'none', background:'transparent', fontSize:13.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s', color:tab===t?C.navy:C.muted, borderBottom:tab===t?`2px solid ${C.navy}`:'2px solid transparent', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
                  {t==='employee'?<Users size={14} strokeWidth={1.8}/>:<Briefcase size={14} strokeWidth={1.8}/>}
                  {t==='employee'?'Employee':'Project'}
                </button>
              ))}
            </div>

            <div style={{ padding:'20px 20px 24px' }}>

              {/* Employee tab */}
              {tab==='employee' && (
                <div style={{ display:'flex', flexDirection:'column' as const, gap:16 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:'block', textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:8 }}>Search Employees</label>
                    <div ref={searchRef} style={{ position:'relative' }}>
                      <Search size={13} style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:C.muted, pointerEvents:'none' }} />
                      <input value={empSearch} onChange={e=>{setEmpSearch(e.target.value);setShowSuggest(true)}} onFocus={()=>setShowSuggest(true)} onKeyDown={e=>{if(e.key==='Escape')setShowSuggest(false)}} placeholder="Search by name or ID…"
                        style={{ width:'100%', height:40, paddingLeft:32, paddingRight:12, border:`1px solid ${C.border}`, borderRadius:10, fontSize:13, color:C.navy, background:'#fff', outline:'none', fontFamily:'inherit', boxSizing:'border-box' as const, transition:'border-color 0.15s' }} />
                      {showSuggest && (empSearch.length>0||suggestions.length>0) && (
                        <div style={{ position:'absolute', top:'100%', left:0, right:0, zIndex:50, background:'#fff', border:`1px solid ${C.border}`, borderRadius:12, marginTop:4, overflow:'hidden', boxShadow:'0 8px 24px rgba(28,32,53,0.10)', maxHeight:220, overflowY:'auto' }}>
                          {suggestions.length===0 ? (
                            <div style={{ padding:'12px 14px', fontSize:12.5, color:C.muted, textAlign:'center' as const }}>No employees found</div>
                          ) : (
                            <>
                              {empSearch==='' && !allSelected && (
                                <button onMouseDown={e=>{e.preventDefault();addAll()}} style={{ width:'100%', padding:'10px 14px', border:'none', borderBottom:`1px solid ${C.border}`, background:'#F5F7FF', cursor:'pointer', fontFamily:'inherit', fontSize:12.5, fontWeight:600, color:'#4338CA', textAlign:'left' as const, display:'flex', alignItems:'center', gap:6 }}>
                                  <Users size={12} strokeWidth={2}/> Add all {suggestions.length} employees
                                </button>
                              )}
                              {suggestions.slice(0,8).map(emp=>(
                                <button key={emp.empId} onMouseDown={e=>{e.preventDefault();addEmp(emp)}} style={{ width:'100%', padding:'9px 14px', border:'none', background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:10, fontFamily:'inherit', transition:'background 0.1s', borderBottom:`1px solid ${C.border}` }}
                                  onMouseEnter={e=>{e.currentTarget.style.background=C.surface}} onMouseLeave={e=>{e.currentTarget.style.background='transparent'}}>
                                  <img src={`https://i.pravatar.cc/150?img=${((emp.avatar-1)%70)+1}`} style={{ width:28, height:28, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
                                  <div style={{ textAlign:'left' as const, minWidth:0 }}>
                                    <div style={{ fontSize:13, fontWeight:600, color:C.navy }}>{emp.name}</div>
                                    <div style={{ fontSize:11, color:C.muted }}>{emp.empId} · {emp.department}</div>
                                  </div>
                                </button>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {(allSelected||selectedEmps.length>0) && (
                    <div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                        <label style={{ fontSize:12, fontWeight:600, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>Selected ({allSelected?ALL_EMPLOYEES.length:selectedEmps.length})</label>
                        <button onClick={clearAll} style={{ fontSize:11.5, fontWeight:600, color:'#E84855', background:'none', border:'none', cursor:'pointer', padding:0 }}>Clear all</button>
                      </div>
                      <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6, padding:'2px 0' }}>
                        {allSelected ? (
                          <div style={{ display:'inline-flex', alignItems:'center', gap:7, height:30, padding:'0 8px 0 10px', background:'#EEF2FF', border:'1px solid #C7D2FE', borderRadius:99 }}>
                            <Users size={12} style={{color:'#4338CA',flexShrink:0}} strokeWidth={2}/>
                            <span style={{ fontSize:12, fontWeight:600, color:'#3730A3' }}>All {ALL_EMPLOYEES.length} Employees</span>
                            <button onClick={clearAll} style={{ width:16, height:16, borderRadius:'50%', border:'none', background:'#C7D2FE', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, padding:0 }}>
                              <X size={9} style={{color:'#4338CA'}}/>
                            </button>
                          </div>
                        ) : (
                          <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6, maxHeight:130, overflowY:'auto', width:'100%' }}>
                            {selectedEmps.map(e=><EmpChip key={e.empId} emp={e} onRemove={()=>removeEmp(e.empId)}/>)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:'block', textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:8 }}>Month</label>
                    <MonthPicker month={selMonth} year={selYear} setMonth={setSelMonth} setYear={setSelYear} mode={pickerMode} setMode={setPickerMode} yearMonths={yearMonths} setYearMonths={setYearMonths}/>
                  </div>
                </div>
              )}

              {/* Project tab */}
              {tab==='project' && (
                <div style={{ display:'flex', flexDirection:'column' as const, gap:16 }}>
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:'block', textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:8 }}>Select Project</label>
                    <div style={{ position:'relative' }}>
                      <select value={selectedProject?.id??''} onChange={e=>{const p=ALL_PROJECTS.find(x=>x.id===e.target.value)??null;if(p)selectProject(p);else{setSelectedProject(null);setProjectEmps([])}}}
                        style={{ width:'100%', height:40, padding:'0 36px 0 12px', border:`1px solid ${C.border}`, borderRadius:10, fontSize:13, color:selectedProject?C.navy:C.muted, background:selectedProject?'#F0F4FF':'#fff', outline:'none', cursor:'pointer', fontFamily:'inherit', appearance:'none' as const }}
                        onFocus={e=>{e.currentTarget.style.borderColor='#6366F1'}} onBlur={e=>{e.currentTarget.style.borderColor=C.border}}>
                        <option value="">Choose a project…</option>
                        {ALL_PROJECTS.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <ChevronRight size={13} style={{ position:'absolute', right:11, top:'50%', transform:'translateY(-50%) rotate(90deg)', color:C.muted, pointerEvents:'none' }}/>
                    </div>
                  </div>
                  {projectEmps.length>0 && (
                    <div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                        <label style={{ fontSize:12, fontWeight:600, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>Employees ({projectEmps.length})</label>
                        <button onClick={()=>setProjectEmps([])} style={{ fontSize:11.5, fontWeight:600, color:'#E84855', background:'none', border:'none', cursor:'pointer', padding:0 }}>Clear all</button>
                      </div>
                      <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6, maxHeight:130, overflowY:'auto', padding:'2px 0' }}>
                        {projectEmps.map(emp=><EmpChip key={emp.empId} emp={emp} onRemove={()=>removeProjectEmp(emp.empId)}/>)}
                      </div>
                    </div>
                  )}
                  <div>
                    <label style={{ fontSize:12, fontWeight:600, color:C.muted, display:'block', textTransform:'uppercase' as const, letterSpacing:'0.06em', marginBottom:8 }}>Month</label>
                    <MonthPicker month={selMonth} year={selYear} setMonth={setSelMonth} setYear={setSelYear} mode={pickerMode} setMode={setPickerMode} yearMonths={yearMonths} setYearMonths={setYearMonths}/>
                  </div>
                </div>
              )}

              {/* Generate */}
              <button onClick={handleGenerate} disabled={!canGenerate}
                style={{ width:'100%', height:44, borderRadius:12, border:'none', background:canGenerate?C.navy:'#D0D3E4', fontSize:14, fontWeight:700, color:canGenerate?'#fff':'#A0A4BC', cursor:canGenerate?'pointer':'not-allowed', fontFamily:'inherit', marginTop:20, transition:'background 0.15s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
                onMouseEnter={e=>{if(canGenerate)e.currentTarget.style.background='#2A3050'}}
                onMouseLeave={e=>{if(canGenerate)e.currentTarget.style.background=C.navy}}>
                <ClipboardList size={16} strokeWidth={2}/> Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div>

          {/* Idle */}
          {state==='idle' && (
            <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:18, minHeight:480, display:'flex', flexDirection:'column' as const, alignItems:'center', justifyContent:'center', gap:14, padding:48 }}>
              <div style={{ width:64, height:64, borderRadius:20, background:C.surface, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <ClipboardList size={28} strokeWidth={1.3} style={{color:'#C0C4D8'}}/>
              </div>
              <div style={{ textAlign:'center' as const }}>
                <p style={{ fontSize:16, fontWeight:700, color:C.navy, margin:'0 0 6px' }}>No Report Generated Yet</p>
                <p style={{ fontSize:13.5, color:C.muted, margin:0, maxWidth:320, lineHeight:1.6 }}>
                  Select employees or a project on the left, choose a month, and click <strong>Generate Report</strong> to view leave data.
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {state==='loading' && (
            <div style={{ display:'flex', flexDirection:'column' as const, gap:16 }}>
              {[0,1,2].map(i=><SkeletonCard key={i}/>)}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:4 }}>
                <div style={{ width:18, height:18, borderRadius:'50%', border:`2.5px solid ${C.border}`, borderTopColor:C.navy, animation:'spin 0.75s linear infinite' }}/>
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                <span style={{ fontSize:13, color:C.muted, fontWeight:500 }}>Generating leave report…</span>
              </div>
            </div>
          )}

          {/* Done */}
          {state==='done' && cards.length>0 && (
            <div>
              {/* Toolbar */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:15, fontWeight:700, color:C.navy }}>{cards.length} Report{cards.length!==1?'s':''}</span>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5, height:26, padding:'0 10px', background:'#ECEEF5', border:`1px solid ${C.border}`, borderRadius:99, fontSize:11.5, fontWeight:600, color:C.muted }}>
                    <CalendarDays size={11} strokeWidth={2}/> {currentMo.label} · {currentMo.range}
                  </span>
                </div>
                <button style={{ display:'flex', alignItems:'center', gap:7, height:36, padding:'0 16px', borderRadius:9, border:'1px solid #16A34A40', background:'#F0FDF4', fontSize:12.5, fontWeight:600, color:'#15803D', cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='#DCFCE7';e.currentTarget.style.borderColor='#16A34A80'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#F0FDF4';e.currentTarget.style.borderColor='#16A34A40'}}>
                  <FileSpreadsheet size={14} strokeWidth={2}/> Download All Reports
                </button>
              </div>

              {/* Project summary card */}
              {tab==='project' && selectedProject && (()=>{
                const totalLeave = cards.reduce((s,c)=>s+c.totalLeave,0)
                const avgLeave   = +(totalLeave/cards.length).toFixed(1)
                const totPlan    = cards.reduce((s,c)=>s+c.plannedLeave,0)
                const totUnplan  = cards.reduce((s,c)=>s+c.unplannedLeave,0)
                const totOther   = cards.reduce((s,c)=>s+c.otherLeave,0)
                return (
                  <div style={{ background:'#fff', border:`1px solid ${C.border}`, borderRadius:16, overflow:'hidden', marginBottom:14, animation:'cardIn 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
                    <div style={{ height:3, background:'linear-gradient(90deg,#F59E0B,#FCD34D)' }}/>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px 16px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                        <div style={{ width:44, height:44, borderRadius:12, background:'#FFF7ED', border:'1px solid #FED7AA', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <Briefcase size={20} style={{color:'#EA580C'}} strokeWidth={1.7}/>
                        </div>
                        <div>
                          <div style={{ fontSize:15.5, fontWeight:800, color:C.navy, letterSpacing:'-0.2px' }}>{selectedProject.name}</div>
                          <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>{cards.length} employee{cards.length!==1?'s':''} · {currentMo.label} · {currentMo.range}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:'center', background:'rgba(245,158,11,0.09)', borderRadius:14, padding:'12px 22px', flexShrink:0 }}>
                        <div style={{ fontSize:22, fontWeight:800, color:'#D97706', letterSpacing:'-0.5px', lineHeight:1 }}>{avgLeave}</div>
                        <div style={{ fontSize:10.5, fontWeight:700, color:'#D97706', marginTop:4, textTransform:'uppercase' as const, letterSpacing:'0.06em' }}>Avg Leave Days</div>
                      </div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', borderTop:`1px solid ${C.border}`, background:C.surface }}>
                      {[
                        { label:'Total Leave Days',  val:totalLeave, color:'#F59E0B' },
                        { label:'Total Planned',     val:totPlan,    color:'#2563EB' },
                        { label:'Total Unplanned',   val:totUnplan,  color:'#E84855' },
                        { label:'Total Employees',   val:cards.length,color:'#7C3AED'},
                      ].map((s,i,arr)=>(
                        <div key={s.label} style={{ padding:'13px 18px', borderRight:i<arr.length-1?`1px solid ${C.border}`:'none' }}>
                          <div style={{ fontSize:14, fontWeight:700, color:s.color, letterSpacing:'-0.2px', lineHeight:1 }}>{s.val}</div>
                          <div style={{ fontSize:11, color:C.muted, marginTop:5, fontWeight:500 }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Cards list */}
              <div style={{ display:'flex', flexDirection:'column' as const, gap:14 }}>
                {cards.map((card,i)=><LeaveCardView key={card.employee.empId} card={card} delay={i*55}/>)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
