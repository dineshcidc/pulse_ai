import { useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, Plus, Clock, CalendarDays, Coffee, CheckCircle2 } from 'lucide-react'
import AddHolidayPage, { type NewHoliday } from './AddHolidayPage'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', bg: '#F0F2F8', surface: '#F7F8FC' }

/* ── Types ── */
type HolidayType = 'national' | 'company' | 'optional'
type FilterType  = 'all' | HolidayType

interface Holiday {
  date: string; name: string; type: HolidayType; day: string; month: number
}

/* ── Config ── */
const TYPE_CFG: Record<HolidayType, { label: string; color: string; bg: string; border: string }> = {
  national: { label: 'National',  color: '#DC2626', bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.2)'   },
  company:  { label: 'Company',   color: '#2563EB', bg: 'rgba(37,99,235,0.08)',   border: 'rgba(37,99,235,0.2)'   },
  optional: { label: 'Optional',  color: '#7C3AED', bg: 'rgba(124,58,237,0.08)',  border: 'rgba(124,58,237,0.2)'  },
}

const WORK_DAYS = [
  { day: 'Monday',    active: true  },
  { day: 'Tuesday',   active: true  },
  { day: 'Wednesday', active: true  },
  { day: 'Thursday',  active: true  },
  { day: 'Friday',    active: true  },
  { day: 'Saturday',  active: false },
  { day: 'Sunday',    active: false },
]

const HOLIDAYS_BY_YEAR: Record<number, Holiday[]> = {
  2026: [
    { date:'01 Jan', name:"New Year's Day",         type:'company',  day:'Thursday',  month:0  },
    { date:'14 Jan', name:'Makar Sankranti',         type:'optional', day:'Wednesday', month:0  },
    { date:'26 Jan', name:'Republic Day',            type:'national', day:'Monday',    month:0  },
    { date:'17 Mar', name:'Holi',                    type:'company',  day:'Tuesday',   month:2  },
    { date:'03 Apr', name:'Good Friday',             type:'company',  day:'Friday',    month:3  },
    { date:'14 Apr', name:'Dr. Ambedkar Jayanti',    type:'national', day:'Tuesday',   month:3  },
    { date:'01 May', name:'International Labour Day',type:'company',  day:'Friday',    month:4  },
    { date:'15 Aug', name:'Independence Day',        type:'national', day:'Saturday',  month:7  },
    { date:'04 Sep', name:'Ganesh Chaturthi',        type:'optional', day:'Friday',    month:8  },
    { date:'02 Oct', name:'Gandhi Jayanti',          type:'national', day:'Friday',    month:9  },
    { date:'20 Oct', name:'Dussehra',                type:'company',  day:'Tuesday',   month:9  },
    { date:'24 Oct', name:'Diwali (Lakshmi Puja)',   type:'company',  day:'Saturday',  month:9  },
    { date:'04 Nov', name:'Govardhan Puja',          type:'optional', day:'Wednesday', month:10 },
    { date:'25 Dec', name:'Christmas Day',           type:'company',  day:'Friday',    month:11 },
  ],
  2025: [
    { date:'01 Jan', name:"New Year's Day",         type:'company',  day:'Wednesday', month:0  },
    { date:'26 Jan', name:'Republic Day',            type:'national', day:'Sunday',    month:0  },
    { date:'14 Mar', name:'Holi',                    type:'company',  day:'Friday',    month:2  },
    { date:'18 Apr', name:'Good Friday',             type:'company',  day:'Friday',    month:3  },
    { date:'14 Apr', name:'Dr. Ambedkar Jayanti',    type:'national', day:'Monday',    month:3  },
    { date:'01 May', name:'International Labour Day',type:'company',  day:'Thursday',  month:4  },
    { date:'15 Aug', name:'Independence Day',        type:'national', day:'Friday',    month:7  },
    { date:'02 Oct', name:'Gandhi Jayanti',          type:'national', day:'Thursday',  month:9  },
    { date:'02 Oct', name:'Dussehra',                type:'company',  day:'Thursday',  month:9  },
    { date:'20 Oct', name:'Diwali (Lakshmi Puja)',   type:'company',  day:'Monday',    month:9  },
    { date:'25 Dec', name:'Christmas Day',           type:'company',  day:'Thursday',  month:11 },
  ],
  2027: [
    { date:'01 Jan', name:"New Year's Day",         type:'company',  day:'Friday',    month:0  },
    { date:'26 Jan', name:'Republic Day',            type:'national', day:'Tuesday',   month:0  },
    { date:'07 Mar', name:'Holi',                    type:'company',  day:'Sunday',    month:2  },
    { date:'26 Mar', name:'Good Friday',             type:'company',  day:'Friday',    month:2  },
    { date:'14 Apr', name:'Dr. Ambedkar Jayanti',    type:'national', day:'Wednesday', month:3  },
    { date:'01 May', name:'International Labour Day',type:'company',  day:'Saturday',  month:4  },
    { date:'15 Aug', name:'Independence Day',        type:'national', day:'Sunday',    month:7  },
    { date:'02 Oct', name:'Gandhi Jayanti',          type:'national', day:'Saturday',  month:9  },
    { date:'09 Nov', name:'Diwali (Lakshmi Puja)',   type:'company',  day:'Tuesday',   month:10 },
    { date:'25 Dec', name:'Christmas Day',           type:'company',  day:'Saturday',  month:11 },
  ],
}

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']

/* ── Small components ── */
function TypeBadge({ type }: { type: HolidayType }) {
  const cfg = TYPE_CFG[type]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 9px',
      borderRadius: 99, fontSize: 11, fontWeight: 700,
      color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`,
      flexShrink: 0,
    }}>
      {cfg.label}
    </span>
  )
}

/* ── Main page ── */
export default function WorkingHoursPage() {
  const [year, setYear]       = useState(2026)
  const [filter, setFilter]   = useState<FilterType>('all')
  const [openMonths, setOpenMonths] = useState<Set<number>>(new Set(Array.from({ length: 12 }, (_, i) => i)))
  const [showAdd, setShowAdd] = useState(false)

  if (showAdd) {
    return (
      <AddHolidayPage
        onBack={() => setShowAdd(false)}
        onSave={(h: NewHoliday) => {
          HOLIDAYS_BY_YEAR[h.year] = [
            ...(HOLIDAYS_BY_YEAR[h.year] ?? []),
            { date: h.date, name: h.name, type: h.type, day: h.day, month: h.month },
          ].sort((a, b) => a.month - b.month || parseInt(a.date) - parseInt(b.date))
          setYear(h.year)
          setShowAdd(false)
        }}
      />
    )
  }

  function toggleMonth(idx: number) {
    setOpenMonths(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const allHolidays = HOLIDAYS_BY_YEAR[year] ?? []
  const filtered    = filter === 'all' ? allHolidays : allHolidays.filter(h => h.type === filter)

  /* Group by month */
  const byMonth: { monthIdx: number; label: string; holidays: Holiday[] }[] = []
  filtered.forEach(h => {
    const existing = byMonth.find(m => m.monthIdx === h.month)
    if (existing) existing.holidays.push(h)
    else byMonth.push({ monthIdx: h.month, label: MONTH_NAMES[h.month], holidays: [h] })
  })
  byMonth.sort((a, b) => a.monthIdx - b.monthIdx)

  const workingDaysCount = WORK_DAYS.filter(d => d.active).length
  const totalWeeklyHrs   = workingDaysCount * 8

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Page header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.navy, margin: '0 0 4px' }}>Working Hours & Holidays</h1>
        <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500, margin: 0 }}>Configure the organisation's work week schedule and manage the annual holiday calendar</p>
      </div>

      {/* 4 / 8 split */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>

        {/* ── LEFT: Working Hours ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 0 }}>

          {/* Work Week card */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(99,102,241,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={15} style={{ color: '#6366F1' }} strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Work Week</span>
            </div>

            <div style={{ padding: '6px 0 4px' }}>
              {WORK_DAYS.map(({ day, active }, idx) => (
                <div key={day} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 20px',
                  borderBottom: idx < WORK_DAYS.length - 1 ? '1px solid #F0F1F7' : 'none',
                  background: active ? 'transparent' : 'transparent',
                }}>
                  {/* Active indicator */}
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                    background: active ? '#0EA86A' : '#D8DBE8',
                  }} />

                  {/* Day name */}
                  <span style={{ fontSize: 13, fontWeight: 600, color: active ? C.navy : C.muted, width: 90, flexShrink: 0 }}>
                    {day}
                  </span>

                  {/* Time or Off */}
                  {active ? (
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 12.5, color: '#3D4266', fontWeight: 500 }}>9:00 AM – 6:00 PM</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: 12, color: '#C0C4D8', fontWeight: 500, flex: 1 }}>Day Off</span>
                  )}

                  {/* Hours badge */}
                  <span style={{
                    fontSize: 11.5, fontWeight: 700, flexShrink: 0,
                    color: active ? '#0EA86A' : '#D8DBE8',
                  }}>
                    {active ? '8h' : '—'}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary footer */}
            <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.border}`, background: C.surface }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={13} style={{ color: '#0EA86A' }} strokeWidth={2} />
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{workingDaysCount} days / week</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#6366F1' }}>{totalWeeklyHrs} hrs / week</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Coffee size={12} style={{ color: C.muted }} strokeWidth={1.8} />
                <span style={{ fontSize: 12, color: C.muted }}>Break: 1:00 PM – 2:00 PM (1 hr)</span>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT: Holiday Calendar ── */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

          {/* Card header */}
          <div style={{ padding: '16px 22px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(245,158,11,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarDays size={15} style={{ color: '#F59E0B' }} strokeWidth={1.8} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Holiday Calendar</span>

                {/* Count badge */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', height: 22, padding: '0 9px',
                  background: '#ECEEF5', borderRadius: 99, fontSize: 11.5, fontWeight: 600, color: C.muted,
                }}>
                  {filtered.length} holiday{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Year navigator */}
                <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${C.border}`, borderRadius: 9, overflow: 'hidden' }}>
                  <button onClick={() => setYear(y => y - 1)} style={{ width: 32, height: 34, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: `1px solid ${C.border}` }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.bg }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                    <ChevronLeft size={13} style={{ color: C.muted }} />
                  </button>
                  <span style={{ padding: '0 14px', fontSize: 13, fontWeight: 700, color: C.navy }}>{year}</span>
                  <button onClick={() => setYear(y => y + 1)} style={{ width: 32, height: 34, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: `1px solid ${C.border}` }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.bg }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                    <ChevronRight size={13} style={{ color: C.muted }} />
                  </button>
                </div>

                {/* Add Holiday */}
                <button onClick={() => setShowAdd(true)} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  height: 34, padding: '0 14px', borderRadius: 9, border: 'none',
                  background: C.navy, fontSize: 12.5, fontWeight: 600, color: '#fff',
                  cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.navy }}>
                  <Plus size={13} strokeWidth={2.2} /> Add Holiday
                </button>
              </div>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: 6 }}>
              {(['all', 'national', 'company', 'optional'] as FilterType[]).map(f => {
                const active = filter === f
                const cfg    = f === 'all' ? null : TYPE_CFG[f]
                return (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    height: 28, padding: '0 12px', borderRadius: 99,
                    border: active
                      ? `1.5px solid ${cfg ? cfg.color : C.navy}`
                      : `1px solid ${C.border}`,
                    background: active
                      ? cfg ? cfg.bg : 'rgba(28,32,53,0.06)'
                      : '#fff',
                    fontSize: 12, fontWeight: 600,
                    color: active ? (cfg ? cfg.color : C.navy) : C.muted,
                    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                  }}>
                    {f === 'all' ? 'All Types' : TYPE_CFG[f].label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Holiday list — accordion by month */}
          <div style={{ maxHeight: 600, overflowY: 'auto' }}>
            {byMonth.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <CalendarDays size={28} strokeWidth={1.2} style={{ color: '#D0D3E4', margin: '0 auto 10px' }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: '0 0 4px' }}>No holidays found</p>
                <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Try changing the filter or year</p>
              </div>
            ) : byMonth.map(({ label, holidays, monthIdx }, mi) => {
              const isOpen = openMonths.has(monthIdx)
              return (
                <div key={monthIdx} style={{ borderTop: mi > 0 ? `1px solid ${C.border}` : 'none' }}>

                  {/* Accordion header — clickable */}
                  <button
                    onClick={() => toggleMonth(monthIdx)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '13px 22px', border: 'none', cursor: 'pointer',
                      background: isOpen ? C.surface : '#fff',
                      borderBottom: isOpen ? `1px solid ${C.border}` : 'none',
                      fontFamily: 'inherit', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = C.surface }}
                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = '#fff' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{label}</span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 8px',
                        background: '#ECEEF5', borderRadius: 99, fontSize: 11, fontWeight: 600, color: C.muted,
                      }}>
                        {holidays.length} holiday{holidays.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <ChevronDown
                      size={15}
                      style={{
                        color: C.muted, flexShrink: 0,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.22s',
                      }}
                    />
                  </button>

                  {/* Holiday rows — shown when open */}
                  {isOpen && holidays.map((h, hi) => (
                    <div key={`${h.date}-${h.name}`} style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '13px 22px',
                      borderBottom: hi < holidays.length - 1 ? '1px solid #F0F1F7' : 'none',
                      transition: 'background 0.1s',
                    }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.surface }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                    >
                      {/* Date chip */}
                      <div style={{
                        flexShrink: 0, width: 52, height: 44, borderRadius: 10, background: '#ECEEF5',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                      }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{h.date.split(' ')[0]}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.04em' }}>{h.date.split(' ')[1]}</span>
                      </div>

                      {/* Name + day */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{h.name}</div>
                        <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{h.day}</div>
                      </div>

                      {/* Type badge */}
                      <TypeBadge type={h.type} />
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Footer summary */}
          <div style={{ padding: '12px 22px', borderTop: `1px solid ${C.border}`, background: C.surface, display: 'flex', alignItems: 'center', gap: 20 }}>
            {(Object.entries(TYPE_CFG) as [HolidayType, typeof TYPE_CFG[HolidayType]][]).map(([key, cfg]) => {
              const count = allHolidays.filter(h => h.type === key).length
              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: C.muted }}><strong style={{ color: C.navy }}>{count}</strong> {cfg.label}</span>
                </div>
              )
            })}
            <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: C.muted }}>
              {allHolidays.length} total · {year}
            </span>
          </div>
        </div>

      </div>
    </div>
  )
}
