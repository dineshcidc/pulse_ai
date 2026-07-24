import { useState, useEffect, useRef } from 'react'
import {
  ArrowLeft, ChevronRight, Check,
  FileText, Users, DollarSign,
  Plus, X, Calendar, Building2,
  Briefcase, ChevronDown, ChevronLeft, Search,
  Upload, Download, Copy, RotateCcw, Trash2,
  CalendarDays, Clock, Layers, Sigma,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type ProjectStatus = 'yet-to-start' | 'started' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled'
type BillingType   = 'hourly' | 'fixed' | 'retainer'

interface RoleMember {
  name: string
  allocation: number
  billing: 'Billable' | 'Non-Billable'
}

interface RoleGroup {
  id: number
  role: string
  members: RoleMember[]
}

interface RateRow {
  id: number
  role: string
  rate: string
  currency: string
}

interface MonthAlloc {
  key:   string                    // 'YYYY-MM'
  hours: Record<string, number>    // roleId -> planned hours
}

interface FormData {
  // Step 1
  projectName:    string
  description:    string
  clientName:     string
  startDate:      string
  endDate:        string
  plannedStart:   string
  plannedEnd:     string
  actualStart:    string
  actualEnd:      string
  sowSigned:      string
  allocationHours: string
  status:         ProjectStatus
  // Step 2 — team
  manager:    string
  roleGroups: RoleGroup[]
  // Step 2 — allocation
  allocations: MonthAlloc[]
  customRoles: { id: string; label: string }[]
  removedRoles: string[]   // ids of default ALLOC_ROLES the user removed
  // Step 3
  billingType:  BillingType
  poNumber:     string
  paymentTerms: string
  rates:        RateRow[]
}

// ── Constants ─────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Project Details',    sub: 'Name, client & full timeline', Icon: FileText   },
  { id: 2, label: 'Project Allocation', sub: 'Allocation & effort',          Icon: Briefcase  },
  { id: 3, label: 'Team Details',       sub: 'Manager & members',            Icon: Users      },
  // Rate Card hidden for now — keep for later re-enable
  // { id: 4, label: 'Rate Card',       sub: 'Billing & rates',                Icon: DollarSign },
]

const STATUSES: { id: ProjectStatus; label: string; color: string; bg: string; border: string }[] = [
  { id: 'yet-to-start', label: 'Yet to Start', color: '#6B7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.25)' },
  { id: 'started',      label: 'Started',      color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)'  },
  { id: 'in-progress',  label: 'In Progress',  color: '#0891B2', bg: 'rgba(8,145,178,0.08)',   border: 'rgba(8,145,178,0.25)'   },
  { id: 'on-hold',      label: 'On Hold',      color: '#B45309', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)'  },
  { id: 'completed',    label: 'Completed',    color: '#0A8A58', bg: 'rgba(14,168,106,0.08)',  border: 'rgba(14,168,106,0.25)'  },
  { id: 'cancelled',    label: 'Cancelled',    color: '#E84855', bg: 'rgba(232,72,85,0.08)',   border: 'rgba(232,72,85,0.25)'   },
]

// Map any legacy/card status coming in from the project list onto the new 6-status set
const VALID_STATUSES: ProjectStatus[] = ['yet-to-start', 'started', 'in-progress', 'on-hold', 'completed', 'cancelled']
function normalizeStatus(s: string): ProjectStatus {
  if (VALID_STATUSES.includes(s as ProjectStatus)) return s as ProjectStatus
  const legacy: Record<string, ProjectStatus> = {
    planning: 'yet-to-start', draft: 'yet-to-start', active: 'in-progress',
  }
  return legacy[s] ?? 'yet-to-start'
}

const BILLING_TYPES: { id: BillingType; label: string; desc: string }[] = [
  { id: 'hourly',   label: 'Hourly',   desc: 'Billed per hour logged'      },
  { id: 'fixed',    label: 'Fixed',    desc: 'One-time fixed project fee'  },
  { id: 'retainer', label: 'Retainer', desc: 'Monthly recurring engagement'},
]

const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'AED']
const PAYMENT_TERMS_OPTIONS = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Immediate']

const MANAGER_LIST = ['Priya Mehta', 'Arjun Menon', 'Raj Kumar', 'Sunita Rao', 'Dev Team Lead']

// Deterministic display code for a manager (no code stored in the list)
function managerCode(name: string) {
  const initials = name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 3)
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return `MGR-${initials}-${(h % 900) + 100}`
}
const MEMBER_LIST  = ['Sarah Johnson', 'Ravi Kumar', 'Meera Pillai', 'Deepak Nair', 'Ananya Singh', 'Vikram Sharma', 'Kiran Babu', 'Pooja Iyer']
const ROLE_LIST    = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer', 'QA Engineer', 'DevOps Engineer', 'Business Analyst', 'Scrum Master']


const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', surface: '#F7F8FC' }

// ── Allocation constants & date helpers ───────────────────────────────────────
const ALLOC_ROLES: { id: string; label: string }[] = [
  { id: 'cpm',      label: 'CPM' },
  { id: 'pm',       label: 'PM'  },
  { id: 'ba',       label: 'BA'  },
  { id: 'sr_swe',   label: 'SR Software Engineer' },
  { id: 'sr_fe',    label: 'Sr Frontend Developer' },
  { id: 'qa',       label: 'QA Engineer' },
  { id: 'uiux',     label: 'UIUX' },
  { id: 'devops',   label: 'Devops' },
]

const MONTH_FULL  = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function monthsBetween(startISO: string, endISO: string): string[] {
  if (!startISO || !endISO) return []
  const s = new Date(startISO + 'T00:00:00Z'), e = new Date(endISO + 'T00:00:00Z')
  if (isNaN(+s) || isNaN(+e) || e < s) return []
  const out: string[] = []
  let y = s.getUTCFullYear(), m = s.getUTCMonth()
  const ey = e.getUTCFullYear(), em = e.getUTCMonth()
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m + 1).padStart(2, '0')}`)
    m++; if (m > 11) { m = 0; y++ }
  }
  return out
}

function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number)
  return `${MONTH_FULL[m - 1]} ${y}`
}

function workingDaysInMonth(key: string, startISO: string, endISO: string): number {
  const [y, m] = key.split('-').map(Number)
  const first = new Date(Date.UTC(y, m - 1, 1))
  const last  = new Date(Date.UTC(y, m, 0))
  const rs = startISO ? new Date(startISO + 'T00:00:00Z') : first
  const re = endISO   ? new Date(endISO   + 'T00:00:00Z') : last
  let count = 0
  for (const d = new Date(first); d <= last; d.setUTCDate(d.getUTCDate() + 1)) {
    if (d < rs || d > re) continue
    const dow = d.getUTCDay()
    if (dow !== 0 && dow !== 6) count++
  }
  return count
}

function monthTotal(a: MonthAlloc): number {
  return Object.values(a.hours).reduce((sum, v) => sum + (Number(v) || 0), 0)
}

function fmtDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso + 'T00:00:00Z')
  if (isNaN(+d)) return '—'
  return `${String(d.getUTCDate()).padStart(2, '0')} ${MONTH_SHORT[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

// Coerce whatever date shape the project carries (ISO or display strings like
// 'May 2026' / 'Jul 1, 2026') into ISO 'YYYY-MM-DD'; returns '' when unparseable.
function toISO(v?: string): string {
  if (!v) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v
  const d = new Date(v)
  if (isNaN(+d)) return ''
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
  fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none',
  border: `1px solid ${C.border}`, background: '#fff',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s',
}

const LABEL: React.CSSProperties = {
  fontSize: 11.5, fontWeight: 700, color: '#8B90A7',
  letterSpacing: '0.06em', textTransform: 'uppercase',
  display: 'block', marginBottom: 7,
}

let _id = 100
const uid = () => ++_id


// ── Simple select ─────────────────────────────────────────────────────────────
function Select({ value, options, onChange, placeholder }: { value: string; options: string[]; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ ...inputStyle, appearance: 'none', paddingRight: 36, cursor: 'pointer', color: value ? C.navy : C.muted }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
    </div>
  )
}

// ── Date picker (custom calendar popover) ─────────────────────────────────────
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function DateField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false)
  const ref  = useRef<HTMLDivElement>(null)
  // Only ISO 'YYYY-MM-DD' values drive the calendar; anything else falls back to today
  // so a stray display-format string can never produce NaN (which would throw Array(NaN)).
  function baseDate(v: string) {
    const d = v ? new Date(v + 'T00:00:00') : new Date()
    return isNaN(+d) ? new Date() : d
  }
  const base = baseDate(value)
  const [viewY, setViewY] = useState(base.getFullYear())
  const [viewM, setViewM] = useState(base.getMonth())

  useEffect(() => {
    function onDoc(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    if (open) document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  function toggle() {
    if (!open) { const d = baseDate(value); setViewY(d.getFullYear()); setViewM(d.getMonth()) }
    setOpen(o => !o)
  }
  function prevMonth() { setViewM(m => m === 0 ? (setViewY(y => y - 1), 11) : m - 1) }
  function nextMonth() { setViewM(m => m === 11 ? (setViewY(y => y + 1), 0) : m + 1) }
  function pick(day: number) {
    onChange(`${viewY}-${String(viewM + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
    setOpen(false)
  }
  function selectToday() {
    const t = new Date()
    onChange(`${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`)
    setOpen(false)
  }

  const firstDow     = new Date(viewY, viewM, 1).getDay()
  const daysInMonth  = new Date(viewY, viewM + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  const selKey       = value || ''
  const today        = new Date()
  const todayKey     = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#999999', pointerEvents: 'none', zIndex: 1 }} />
      <button type="button" onClick={toggle}
        style={{ ...inputStyle, paddingLeft: 38, paddingRight: 34, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', color: value ? C.navy : C.muted, borderColor: open ? '#6366F1' : C.border, boxShadow: open ? '0 0 0 3px rgba(99,102,241,0.10)' : 'none' }}>
        {value ? fmtDate(value) : (placeholder || 'Select date')}
      </button>
      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, color: C.muted, pointerEvents: 'none', transition: 'transform 0.15s' }} />

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 40, width: 258, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 13, boxShadow: '0 12px 32px rgba(28,32,53,0.14)', padding: 12 }}>
          {/* month nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <button type="button" onClick={prevMonth} style={NAV_BTN}
              onMouseEnter={e => { e.currentTarget.style.background = C.surface }} onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
              <ChevronLeft size={15} strokeWidth={2.2} style={{ color: C.navy }} />
            </button>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{MONTH_FULL[viewM]} {viewY}</div>
            <button type="button" onClick={nextMonth} style={NAV_BTN}
              onMouseEnter={e => { e.currentTarget.style.background = C.surface }} onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
              <ChevronRight size={15} strokeWidth={2.2} style={{ color: C.navy }} />
            </button>
          </div>
          {/* weekday labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
            {WEEKDAYS.map(w => <div key={w} style={{ textAlign: 'center', fontSize: 10.5, fontWeight: 700, color: C.muted, padding: '3px 0' }}>{w}</div>)}
          </div>
          {/* day grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {cells.map((day, idx) => {
              if (day === null) return <div key={`e${idx}`} />
              const key      = `${viewY}-${String(viewM + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const selected = key === selKey
              const isToday  = key === todayKey
              return (
                <button key={key} type="button" onClick={() => pick(day)}
                  style={{ height: 30, borderRadius: 8, border: selected ? 'none' : `1px solid ${isToday ? 'rgba(99,102,241,0.35)' : 'transparent'}`, background: selected ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : 'transparent', color: selected ? '#fff' : C.navy, fontSize: 12.5, fontWeight: selected ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', outline: 'none', transition: 'background 0.12s' }}
                  onMouseEnter={e => { if (!selected) e.currentTarget.style.background = C.surface }}
                  onMouseLeave={e => { if (!selected) e.currentTarget.style.background = 'transparent' }}>
                  {day}
                </button>
              )
            })}
          </div>
          {/* footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
            <button type="button" onClick={selectToday} style={{ fontSize: 12, fontWeight: 700, color: '#5B5FDE', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Today</button>
            {value && <button type="button" onClick={() => { onChange(''); setOpen(false) }} style={{ fontSize: 12, fontWeight: 600, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0 }}>Clear</button>}
          </div>
        </div>
      )}
    </div>
  )
}

const NAV_BTN: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none', transition: 'background 0.13s',
}

// ── Step 1: Project Details ───────────────────────────────────────────────────
function Step1({ data, set }: { data: FormData; set: (p: Partial<FormData>) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label style={LABEL}>Project Name <Req /></label>
          <div style={{ position: 'relative' }}>
            <Briefcase size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input value={data.projectName} onChange={e => set({ projectName: e.target.value })}
              placeholder="e.g. Pulse.AI Platform v3"
              style={{ ...inputStyle, paddingLeft: 38 }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
          </div>
        </div>

        <div>
          <label style={LABEL}>Client Name <Req /></label>
          <div style={{ position: 'relative' }}>
            <Building2 size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input value={data.clientName} onChange={e => set({ clientName: e.target.value })}
              placeholder="e.g. HDFC Bank"
              style={{ ...inputStyle, paddingLeft: 38 }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={LABEL}>Description</label>
          <textarea value={data.description} onChange={e => set({ description: e.target.value })}
            placeholder="Brief overview of the project scope, objectives, and deliverables…"
            rows={4}
            style={{ width: '100%', borderRadius: 10, padding: '12px 14px', fontSize: 13.5, fontWeight: 400, color: C.navy, outline: 'none', border: `1px solid ${C.border}`, background: '#fff', resize: 'vertical', lineHeight: 1.7, fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' }}
            onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={LABEL}>Project Status</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {STATUSES.map(s => (
              <button key={s.id} onClick={() => set({ status: s.id })}
                style={{ height: 40, borderRadius: 9, border: `1px solid ${data.status === s.id ? s.border : C.border}`, background: data.status === s.id ? s.bg : '#fff', color: data.status === s.id ? s.color : C.muted, fontSize: 12.5, fontWeight: data.status === s.id ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', transition: 'all 0.13s', outline: 'none', padding: '0 14px' }}
                onMouseEnter={e => { if (data.status !== s.id) e.currentTarget.style.background = C.surface }}
                onMouseLeave={e => { if (data.status !== s.id) e.currentTarget.style.background = '#fff' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: data.status === s.id ? s.color : '#D0D4E4', display: 'inline-block', flexShrink: 0, transition: 'background 0.13s' }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Details Section */}
      <div style={{ marginTop: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 20 }}>Timeline Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div>
            <label style={LABEL}>Start Date <Req /></label>
            <DateField value={data.startDate} onChange={v => set({ startDate: v })} placeholder="Select start date" />
          </div>
          <div>
            <label style={LABEL}>End Date <Req /></label>
            <DateField value={data.endDate} onChange={v => set({ endDate: v })} placeholder="Select end date" />
          </div>
          <div>
            <label style={LABEL}>Planned Start</label>
            <DateField value={data.plannedStart} onChange={v => set({ plannedStart: v })} placeholder="Select planned start" />
          </div>
          <div>
            <label style={LABEL}>Planned End</label>
            <DateField value={data.plannedEnd} onChange={v => set({ plannedEnd: v })} placeholder="Select planned end" />
          </div>
          <div>
            <label style={LABEL}>Actual Start</label>
            <DateField value={data.actualStart} onChange={v => set({ actualStart: v })} placeholder="Select actual start" />
          </div>
          <div>
            <label style={LABEL}>Actual End</label>
            <DateField value={data.actualEnd} onChange={v => set({ actualEnd: v })} placeholder="Select actual end" />
          </div>
        </div>

        <div>
          <label style={LABEL}>SoW Signed</label>
          <DateField value={data.sowSigned} onChange={v => set({ sowSigned: v })} placeholder="Select SoW signed date" />
        </div>
      </div>

      {/* Project Allocation Efforts Section */}
      <div style={{ marginTop: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 6 }}>Project Allocation Efforts</h3>
        <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, margin: '0 0 16px', lineHeight: 1.5 }}>
          Total planned effort for the entire project. This carries into the Project Allocation tab.
        </p>
        <div style={{ maxWidth: 320 }}>
          <label style={LABEL}>Allocation Hours <Req /></label>
          <div style={{ position: 'relative' }}>
            <Clock size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input
              type="number" min={0} inputMode="numeric"
              value={data.allocationHours}
              onChange={e => set({ allocationHours: e.target.value })}
              placeholder="e.g. 400"
              style={{ ...inputStyle, paddingLeft: 38, paddingRight: 44 }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 12, fontWeight: 700, color: C.muted, pointerEvents: 'none' }}>hrs</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Step 2: Project Allocation ────────────────────────────────────────────────
function StepAllocation({ data, set }: { data: FormData; set: (p: Partial<FormData>) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)

  const months      = monthsBetween(data.startDate, data.endDate)
  const hasTimeline = months.length > 0
  const rows        = [...data.allocations].sort((a, b) => a.key.localeCompare(b.key))
  const allRoles    = [...ALLOC_ROLES.filter(r => !data.removedRoles.includes(r.id)), ...data.customRoles]

  // Accordion — first month expanded, the rest collapsed initially.
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const inited = useRef(false)
  useEffect(() => {
    if (!inited.current && rows.length > 0) { inited.current = true; setOpenKeys([rows[0].key]) }
  }, [rows.length])

  // Inline add-role editor (which card triggered it + typed name).
  const [addKey, setAddKey]     = useState<string | null>(null)
  const [roleName, setRoleName] = useState('')

  // Upload Excel modal.
  const [uploadOpen, setUploadOpen]   = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  // Keep an allocation row for every in-range month; preserve existing edits.
  useEffect(() => {
    if (months.length === 0) return
    const existing = new Set(data.allocations.map(a => a.key))
    const missing  = months.filter(m => !existing.has(m))
    if (missing.length === 0) return
    const merged = [...data.allocations, ...missing.map(key => ({ key, hours: {} as Record<string, number> }))]
      .sort((a, b) => a.key.localeCompare(b.key))
    set({ allocations: merged })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.startDate, data.endDate])

  function setHours(key: string, roleId: string, raw: string) {
    const val = raw === '' ? 0 : Math.max(0, Number(raw) || 0)
    set({ allocations: data.allocations.map(a => a.key === key ? { ...a, hours: { ...a.hours, [roleId]: val } } : a) })
  }
  function duplicate(key: string) {
    const idx = rows.findIndex(a => a.key === key)
    if (idx === -1) return
    if (idx === 0) {
      // First month has no previous — copy its effort forward into the next month.
      const next = rows[idx + 1]
      if (!next) return
      set({ allocations: data.allocations.map(a => a.key === next.key ? { ...a, hours: { ...rows[idx].hours } } : a) })
      return
    }
    const prev = rows[idx - 1]
    set({ allocations: data.allocations.map(a => a.key === key ? { ...a, hours: { ...prev.hours } } : a) })
  }
  function resetMonth(key: string) {
    set({ allocations: data.allocations.map(a => a.key === key ? { ...a, hours: {} } : a) })
  }
  function deleteMonth(key: string) {
    set({ allocations: data.allocations.filter(a => a.key !== key) })
  }
  function regenerate() {
    const merged = months.map(key => data.allocations.find(a => a.key === key) ?? { key, hours: {} as Record<string, number> })
    set({ allocations: merged })
  }
  function toggleMonth(key: string) {
    setOpenKeys(ks => ks.includes(key) ? ks.filter(k => k !== key) : [...ks, key])
  }
  function addCustomRole(name: string) {
    const label = name.trim()
    if (!label) { setAddKey(null); setRoleName(''); return }
    if (!allRoles.some(r => r.label.toLowerCase() === label.toLowerCase())) {
      set({ customRoles: [...data.customRoles, { id: `custom_${uid()}`, label }] })
    }
    setAddKey(null); setRoleName('')
  }
  function removeRole(id: string) {
    const isCustom = data.customRoles.some(r => r.id === id)
    set({
      customRoles: isCustom ? data.customRoles.filter(r => r.id !== id) : data.customRoles,
      removedRoles: isCustom ? data.removedRoles : [...data.removedRoles, id],
      allocations: data.allocations.map(a => { const h = { ...a.hours }; delete h[id]; return { ...a, hours: h } }),
    })
  }

  function downloadTemplate() {
    const header = ['Month', ...allRoles.map(r => r.label)].join(',')
    const src    = hasTimeline ? months.map(monthLabel) : ['July 2026', 'August 2026', 'September 2026']
    const body   = src.map(m => [m, ...allRoles.map(() => 0)].join(','))
    const csv    = [header, ...body].join('\n')
    const url    = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a      = document.createElement('a')
    a.href = url; a.download = 'allocation-template.csv'; a.click()
    URL.revokeObjectURL(url)
  }
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) setPendingFile(file)
    e.target.value = ''
  }
  function parseFile(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      const lines = String(reader.result || '').split(/\r?\n/).filter(l => l.trim())
      if (lines.length < 2) return
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
      const colRole = headers.map(h => allRoles.find(r => r.label.toLowerCase() === h || r.id === h)?.id ?? null)
      const next = data.allocations.map(a => ({ ...a, hours: { ...a.hours } }))
      for (let i = 1; i < lines.length; i++) {
        const cells  = lines[i].split(',')
        const month  = (cells[0] || '').trim().toLowerCase()
        const target = next.find(a => monthLabel(a.key).toLowerCase() === month)
        if (!target) continue
        cells.forEach((c, ci) => { const rid = colRole[ci]; if (rid) target.hours[rid] = Math.max(0, Number(c) || 0) })
      }
      set({ allocations: next })
    }
    reader.readAsText(file)
  }
  function closeUpload() { setUploadOpen(false); setPendingFile(null) }
  function saveUpload()  { if (pendingFile) parseFile(pendingFile); closeUpload() }

  const grandTotal = rows.reduce((s, a) => s + monthTotal(a), 0)
  const byRole     = allRoles.map(r => ({ ...r, total: rows.reduce((s, a) => s + (Number(a.hours[r.id]) || 0), 0) }))
  const activeRoles = byRole.filter(r => r.total > 0)

  const ACT_BTN: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 13px', borderRadius: 9,
    border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 12.5, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.14s', outline: 'none',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Header + toolbar ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>Resource Allocation Planning</div>
          <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 500, marginTop: 3, maxWidth: 460, lineHeight: 1.5 }}>
            Plan the estimated monthly effort per role across the full project duration before execution begins.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button style={{ ...ACT_BTN, opacity: hasTimeline ? 1 : 0.5, cursor: hasTimeline ? 'pointer' : 'not-allowed' }}
            disabled={!hasTimeline}
            title={hasTimeline ? '' : 'Set the project dates first'}
            onClick={downloadTemplate}
            onMouseEnter={e => { if (hasTimeline) { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.background = C.surface } }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' }}>
            <Download size={14} strokeWidth={2} /> Sample Template
          </button>
          <button style={{ ...ACT_BTN, borderColor: 'rgba(99,102,241,0.30)', color: '#5B5FDE', background: 'rgba(99,102,241,0.06)', opacity: hasTimeline ? 1 : 0.5, cursor: hasTimeline ? 'pointer' : 'not-allowed' }}
            disabled={!hasTimeline}
            title={hasTimeline ? '' : 'Set the project dates first'}
            onClick={() => setUploadOpen(true)}
            onMouseEnter={e => { if (hasTimeline) e.currentTarget.style.background = 'rgba(99,102,241,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)' }}>
            <Upload size={14} strokeWidth={2} /> Upload Excel
          </button>
        </div>
      </div>

      {!hasTimeline ? (
        /* ── Empty state — no timeline yet ── */
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, textAlign: 'center', border: `1px dashed ${C.border}`, borderRadius: 16, background: C.surface }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fff', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <CalendarDays size={24} strokeWidth={1.7} style={{ color: C.muted }} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Set the project timeline first</div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: C.muted, marginTop: 5, maxWidth: 380, lineHeight: 1.55 }}>
            Add a valid <b style={{ color: C.navy }}>Start Date</b>, <b style={{ color: C.navy }}>End Date</b> and <b style={{ color: C.navy }}>Project Allocation Efforts</b> in the Project Details step. Monthly allocation cards are generated automatically from that range.
          </div>
        </div>
      ) : (
        <>
          {/* ── Project summary card ── */}
          <div style={{ borderRadius: 16, padding: '18px 20px', background: 'linear-gradient(135deg, #F5F6FF 0%, #EEF0FB 100%)', border: '1px solid rgba(99,102,241,0.16)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
              <SummaryStat Icon={Briefcase}    label="Project"        value={data.projectName || 'Untitled Project'} />
              <SummaryStat Icon={Clock}        label="Duration"       value={months.length === 1 ? '1 month' : `${months.length} months`} />
              <SummaryStat Icon={CalendarDays} label="Date"           value={`${fmtDate(data.startDate)} – ${fmtDate(data.endDate)}`} small />
              <SummaryStat Icon={Sigma}        label="Planned Effort" value={data.allocationHours ? `${data.allocationHours} hrs` : '—'} />
            </div>
          </div>

          {/* ── Monthly allocation cards (accordion) ── */}
          {rows.map((a, i) => {
            const wd     = workingDaysInMonth(a.key, data.startDate, data.endDate)
            const total  = monthTotal(a)
            const isOpen = openKeys.includes(a.key)
            return (
              <div key={a.key} style={{ borderRadius: 16, border: `1px solid ${isOpen ? 'rgba(99,102,241,0.30)' : C.border}`, background: '#fff', overflow: 'hidden', transition: 'border-color 0.15s' }}>
                {/* card header — click to expand/collapse */}
                <div onClick={() => toggleMonth(a.key)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '13px 18px', background: isOpen ? 'rgba(99,102,241,0.04)' : '#FAFBFE', borderBottom: isOpen ? `1px solid ${C.border}` : 'none', cursor: 'pointer', flexWrap: 'wrap', userSelect: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: '#F0F2F8', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#5A6080' }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{monthLabel(a.key)}</div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 2, fontSize: 11, fontWeight: 600, color: C.muted }}>
                        <CalendarDays size={11} strokeWidth={2} /> {wd} working days
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 9, padding: '6px 12px' }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>Monthly Effort</span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: total > 0 ? '#5B5FDE' : C.muted }}>{total}<span style={{ fontSize: 11, fontWeight: 700 }}> h</span></span>
                    </div>
                    <ChevronDown size={17} strokeWidth={2.2} style={{ color: C.muted, transform: `rotate(${isOpen ? 180 : 0}deg)`, transition: 'transform 0.18s' }} />
                  </div>
                </div>

                {isOpen && (
                  <>
                    {/* role inputs */}
                    <div style={{ padding: '16px 18px 14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
                      {allRoles.map(r => {
                        return (
                          <div key={r.id}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: C.navy, marginBottom: 5 }}>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.label}</span>
                              <button type="button" title="Remove role" onClick={() => removeRole(r.id)}
                                style={{ width: 15, height: 15, borderRadius: 4, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8CCE0', padding: 0, flexShrink: 0 }}
                                onMouseEnter={e => { e.currentTarget.style.color = '#E84855'; e.currentTarget.style.background = 'rgba(232,72,85,0.08)' }}
                                onMouseLeave={e => { e.currentTarget.style.color = '#C8CCE0'; e.currentTarget.style.background = 'transparent' }}>
                                <X size={10} strokeWidth={2.6} />
                              </button>
                            </label>
                            <div style={{ position: 'relative' }}>
                              <input
                                type="number" min={0} inputMode="numeric"
                                value={a.hours[r.id] || ''}
                                placeholder="0"
                                onChange={e => setHours(a.key, r.id, e.target.value)}
                                style={{ width: '100%', height: 40, borderRadius: 9, padding: '0 30px 0 12px', fontSize: 13, fontWeight: 600, color: C.navy, boxSizing: 'border-box', border: `1px solid ${C.border}`, background: '#fff', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.14s, box-shadow 0.14s' }}
                                onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
                              <span style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', fontSize: 11, fontWeight: 600, color: C.muted, pointerEvents: 'none' }}>h</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* add custom role */}
                    <div style={{ padding: '0 18px 14px' }}>
                      {addKey === a.key ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input autoFocus value={roleName} onChange={e => setRoleName(e.target.value)}
                            placeholder="New role name (e.g. Data Engineer)"
                            onKeyDown={e => { if (e.key === 'Enter') addCustomRole(roleName); if (e.key === 'Escape') { setAddKey(null); setRoleName('') } }}
                            style={{ flex: 1, maxWidth: 280, height: 36, borderRadius: 9, padding: '0 12px', fontSize: 12.5, fontWeight: 500, color: C.navy, boxSizing: 'border-box', border: `1px solid #6366F1`, background: '#fff', outline: 'none', fontFamily: 'inherit' }} />
                          <button type="button" onMouseDown={() => addCustomRole(roleName)}
                            style={{ ...ACT_BTN, height: 36, borderColor: 'rgba(99,102,241,0.30)', color: '#5B5FDE', background: 'rgba(99,102,241,0.06)' }}>
                            <Check size={13} strokeWidth={2.4} /> Add
                          </button>
                          <button type="button" onClick={() => { setAddKey(null); setRoleName('') }}
                            style={{ ...ACT_BTN, height: 36 }}>Cancel</button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => { setAddKey(a.key); setRoleName('') }}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 36, padding: '0 14px', borderRadius: 9, border: `1.5px dashed rgba(99,102,241,0.35)`, background: 'rgba(99,102,241,0.04)', color: '#6366F1', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s', outline: 'none' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.04)' }}>
                          <Plus size={13} strokeWidth={2.5} /> Add Role
                        </button>
                      )}
                    </div>

                    {/* card footer — actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, padding: '12px 18px', borderTop: `1px solid ${C.border}`, background: '#FCFCFE', flexWrap: 'wrap' }}>
                      <button style={{ ...ACT_BTN, height: 32, color: C.muted }}
                        onClick={() => duplicate(a.key)}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.background = C.surface }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' }}>
                        <Copy size={13} strokeWidth={2} /> Duplicate
                      </button>
                      <button style={{ ...ACT_BTN, height: 32, color: C.muted }}
                        onClick={() => resetMonth(a.key)}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.background = C.surface }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' }}>
                        <RotateCcw size={13} strokeWidth={2} /> Reset
                      </button>
                      <button style={{ ...ACT_BTN, height: 32, color: '#E84855', borderColor: 'rgba(232,72,85,0.22)' }}
                        onClick={() => deleteMonth(a.key)}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.35)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.22)' }}>
                        <Trash2 size={13} strokeWidth={2} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            )
          })}

          {rows.length === 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 18px', borderRadius: 14, border: `1px dashed ${C.border}`, background: C.surface }}>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: C.muted }}>All month allocations were removed.</span>
              <button style={ACT_BTN} onClick={regenerate}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.background = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' }}>
                <RotateCcw size={13} strokeWidth={2} /> Regenerate from timeline
              </button>
            </div>
          )}

          {/* ── Project total effort summary ── */}
          <div style={{ borderRadius: 16, border: '1px solid #F0EADC', background: 'linear-gradient(135deg, #FDFBF7 0%, #FAF6EC 100%)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 18px', borderBottom: '1px solid #F0EADC' }}>
              <Sigma size={16} strokeWidth={2.2} style={{ color: '#5B5FDE' }} />
              <span style={{ fontSize: 13.5, fontWeight: 800, color: C.navy }}>Project Total Effort Summary</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, padding: '16px 18px' }}>
              <SummaryStat Icon={Sigma}       label="Total Planned Hours" value={`${grandTotal} h`} big />
              <SummaryStat Icon={Briefcase}   label="Overall Effort"      value={`${grandTotal} h`} big />
              <SummaryStat Icon={Layers}      label="Allocation Months"   value={String(rows.length)} big />
              <SummaryStat Icon={Users}       label="Roles Engaged"       value={String(activeRoles.length)} big />
            </div>
            <div style={{ padding: '0 18px 18px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 9 }}>Total Effort by Role</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {activeRoles.length === 0 && <span style={{ fontSize: 12.5, fontWeight: 500, color: C.muted }}>No hours planned yet.</span>}
                {activeRoles.map(r => (
                  <div key={r.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 9, padding: '6px 11px' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{r.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#5B5FDE' }}>{r.total} h</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Upload Excel modal ── */}
      {uploadOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          onClick={closeUpload}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 20, width: 540, maxWidth: '94vw', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(10,12,28,0.22)', animation: 'apFadeIn 0.22s ease-out' }}>

            {/* header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '20px 22px 16px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Upload size={18} strokeWidth={2} style={{ color: '#5B5FDE' }} />
                </div>
                <div>
                  <div style={{ fontSize: 15.5, fontWeight: 800, color: C.navy }}>Upload Allocation Excel</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.muted, marginTop: 2 }}>Import monthly role hours from a spreadsheet</div>
                </div>
              </div>
              <button type="button" onClick={closeUpload}
                style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, flexShrink: 0, outline: 'none', transition: 'all 0.13s' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = C.muted }}>
                <X size={14} strokeWidth={2.4} />
              </button>
            </div>

            <div style={{ padding: '18px 22px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* how-to steps */}
              <div style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: C.surface, padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>How to prepare the sheet</div>
                <ol style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    <>The <b style={{ color: C.navy }}>first column</b> must be <b style={{ color: C.navy }}>Month</b>, written as <code style={CODE}>Month YYYY</code> — e.g. <code style={CODE}>July 2026</code>.</>,
                    <>Add one column per role in this exact order (matching the sample template).</>,
                    <>Enter planned <b style={{ color: C.navy }}>hours</b> (numbers) for each role. Leave blank or <code style={CODE}>0</code> if not applicable.</>,
                    <>Save as <code style={CODE}>.csv</code>, then drop it in the box below and click Save.</>,
                  ].map((step, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ width: 19, height: 19, borderRadius: 6, background: '#F0F2F8', border: `1px solid ${C.border}`, color: '#5A6080', fontSize: 10.5, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{idx + 1}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: '#4A4F6B', lineHeight: 1.5 }}>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* upload box */}
              <div onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault() }}
                onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) setPendingFile(f) }}
                style={{ borderRadius: 12, border: `1.6px dashed ${pendingFile ? 'rgba(99,102,241,0.45)' : '#C8CCE0'}`, background: pendingFile ? 'rgba(99,102,241,0.05)' : C.surface, padding: '26px 20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}>
                {pendingFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 11 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: '#fff', border: '1px solid rgba(99,102,241,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <FileText size={18} strokeWidth={2} style={{ color: '#5B5FDE' }} />
                    </div>
                    <div style={{ textAlign: 'left', minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 320 }}>{pendingFile.name}</div>
                      <div style={{ fontSize: 11.5, fontWeight: 500, color: C.muted, marginTop: 1 }}>{(pendingFile.size / 1024).toFixed(1)} KB · click to replace</div>
                    </div>
                    <button type="button" onClick={e => { e.stopPropagation(); setPendingFile(null) }}
                      style={{ width: 26, height: 26, borderRadius: 7, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, flexShrink: 0, outline: 'none' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#E84855'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.30)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}>
                      <X size={12} strokeWidth={2.4} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div style={{ width: 46, height: 46, borderRadius: 13, background: '#fff', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 11px' }}>
                      <Upload size={20} strokeWidth={1.9} style={{ color: '#5B5FDE' }} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Click to browse or drop your file</div>
                    <div style={{ fontSize: 11.5, fontWeight: 500, color: C.muted, marginTop: 3 }}>Accepts .csv, .xlsx, .xls</div>
                  </>
                )}
              </div>
              <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" onChange={onFile} style={{ display: 'none' }} />
            </div>

            {/* footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, padding: '14px 22px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE' }}>
              <button type="button" onClick={closeUpload}
                style={{ height: 40, padding: '0 18px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', outline: 'none', transition: 'all 0.14s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                Cancel
              </button>
              <button type="button" onClick={saveUpload} disabled={!pendingFile}
                style={{ height: 40, padding: '0 22px', borderRadius: 10, border: 'none', background: pendingFile ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : '#C8CCE0', color: '#fff', fontSize: 13, fontWeight: 700, cursor: pendingFile ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, outline: 'none', transition: 'opacity 0.14s' }}
                onMouseEnter={e => { if (pendingFile) e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                <Check size={15} strokeWidth={2.4} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const CODE: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: '#5B5FDE', background: 'rgba(99,102,241,0.08)',
  border: '1px solid rgba(99,102,241,0.16)', borderRadius: 5, padding: '1px 5px', fontFamily: 'ui-monospace, monospace',
}

function SummaryStat({ Icon, label, value, big, wide, small }: { Icon: React.ElementType; label: string; value: string; big?: boolean; wide?: boolean; small?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, minWidth: small ? 190 : 0, gridColumn: wide ? 'span 2' : undefined }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fff', border: '1px solid rgba(99,102,241,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={15} strokeWidth={2} style={{ color: '#5B5FDE' }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</div>
        <div style={{ fontSize: big ? 17 : small ? 12 : 13.5, fontWeight: 800, color: C.navy, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
      </div>
    </div>
  )
}

// ── Step 3: Team Details ──────────────────────────────────────────────────────
function Step2({ data, set }: { data: FormData; set: (p: Partial<FormData>) => void }) {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(data.roleGroups[0]?.id ?? null)
  const [memberSearch,   setMemberSearch]   = useState('')
  const [addingRole,     setAddingRole]     = useState(false)
  const [roleSearch,     setRoleSearch]     = useState('')

  const currentGroup = data.roleGroups.find(rg => rg.id === selectedRoleId) ?? null

  // Employees available to add to current role (not yet in it, matches search)
  const available = MEMBER_LIST.filter(m =>
    !currentGroup?.members.some(rm => rm.name === m) &&
    m.toLowerCase().includes(memberSearch.toLowerCase())
  )

  // Roles not yet added (same role names as tab 2 / Project Allocation)
  const TEAM_ROLE_LIST = ALLOC_ROLES.map(r => r.label)
  const unusedRoles = TEAM_ROLE_LIST.filter(r =>
    !data.roleGroups.some(rg => rg.role === r) &&
    r.toLowerCase().includes(roleSearch.toLowerCase())
  )

  function addRoleGroup(role: string) {
    const newGroup: RoleGroup = { id: uid(), role, members: [] }
    set({ roleGroups: [...data.roleGroups, newGroup] })
    setSelectedRoleId(newGroup.id)
    setAddingRole(false)
    setRoleSearch('')
  }

  function removeRoleGroup(id: number) {
    set({ roleGroups: data.roleGroups.filter(rg => rg.id !== id) })
    if (selectedRoleId === id) setSelectedRoleId(null)
  }

  function addMemberToRole(name: string) {
    if (!currentGroup) return
    set({ roleGroups: data.roleGroups.map(rg =>
      rg.id === selectedRoleId ? { ...rg, members: [...rg.members, { name, allocation: 100, billing: 'Billable' }] } : rg
    )})
    setMemberSearch('')
  }

  function removeMemberFromRole(roleId: number, name: string) {
    set({ roleGroups: data.roleGroups.map(rg =>
      rg.id === roleId ? { ...rg, members: rg.members.filter(m => m.name !== name) } : rg
    )})
  }

  function updateAllocation(roleId: number, name: string, allocation: number) {
    set({ roleGroups: data.roleGroups.map(rg =>
      rg.id === roleId ? { ...rg, members: rg.members.map(m => m.name === name ? { ...m, allocation } : m) } : rg
    )})
  }

  function updateBilling(roleId: number, name: string, billing: RoleMember['billing']) {
    set({ roleGroups: data.roleGroups.map(rg =>
      rg.id === roleId ? { ...rg, members: rg.members.map(m => m.name === name ? { ...m, billing } : m) } : rg
    )})
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Project Manager — select ── */}
      <div>
        <label style={LABEL}>Project Manager</label>
        <div style={{ position: 'relative' }}>
          <select
            value={data.manager}
            onChange={e => set({ manager: e.target.value })}
            style={{ ...inputStyle, paddingRight: 34, appearance: 'none', cursor: 'pointer', color: data.manager ? C.navy : C.muted }}>
            <option value="">Select project manager…</option>
            {MANAGER_LIST.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <ChevronDown size={16} style={{ position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
        </div>

        {/* Selected manager details */}
        {data.manager && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: C.surface, border: `1px solid ${C.border}` }}>
            <img src={`https://i.pravatar.cc/48?u=${data.manager}`} alt={data.manager}
              style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${C.border}` }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{data.manager}</span>
              <span style={{ fontSize: 11.5, fontWeight: 500, color: C.muted, letterSpacing: '0.02em' }}>{managerCode(data.manager)}</span>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 600, color: '#5B5FDE', background: 'rgba(99,102,241,0.10)', padding: '4px 10px', borderRadius: 999 }}>Manager</span>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: C.border }} />

      {/* ── Role-based Team Assignment ── */}
      <div>
        <label style={LABEL}>Team Assignment by Role</label>
        <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: 0, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', minHeight: 380 }}>

          {/* Left: Roles panel */}
          <div style={{ borderRight: `1px solid ${C.border}`, background: C.surface, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 12px 8px', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Roles</span>
            </div>

            <div style={{ flex: 1, padding: '8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {data.roleGroups.length === 0 && !addingRole && (
                <div style={{ padding: '20px 10px', textAlign: 'center' }}>
                  <Briefcase size={18} strokeWidth={1.4} style={{ color: '#C8CCE0', margin: '0 auto 6px' }} />
                  <p style={{ fontSize: 11.5, color: '#B0B4C8', margin: 0 }}>No roles added yet</p>
                </div>
              )}

              {data.roleGroups.map(rg => {
                const isActive = selectedRoleId === rg.id
                return (
                  <div key={rg.id}
                    onClick={() => { setSelectedRoleId(rg.id); setMemberSearch('') }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 9, background: isActive ? '#fff' : 'transparent', border: `1px solid ${isActive ? 'rgba(99,102,241,0.25)' : 'transparent'}`, cursor: 'pointer', transition: 'all 0.12s', position: 'relative' }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#ECEEF5' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: isActive ? 700 : 500, color: isActive ? '#5B5FDE' : '#3D4266', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rg.role}</div>
                      <div style={{ fontSize: 10.5, color: C.muted, marginTop: 1 }}>{rg.members.length} member{rg.members.length !== 1 ? 's' : ''} assigned</div>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'rgba(99,102,241,0.12)' : '#E8EAF2', color: isActive ? '#5B5FDE' : C.muted, flexShrink: 0, padding: '0 5px' }}>
                      {rg.members.length}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); removeRoleGroup(rg.id) }}
                      style={{ width: 20, height: 20, borderRadius: 5, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8CCE0', padding: 0, flexShrink: 0, transition: 'all 0.12s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#E84855'; e.currentTarget.style.background = 'rgba(232,72,85,0.08)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#C8CCE0'; e.currentTarget.style.background = 'transparent' }}>
                      <X size={10} strokeWidth={2.5} />
                    </button>
                  </div>
                )
              })}

              {/* Add role inline */}
              {addingRole && (
                <div style={{ padding: '8px', background: '#fff', borderRadius: 9, border: `1px solid rgba(99,102,241,0.25)` }}>
                  <div style={{ position: 'relative', marginBottom: 6 }}>
                    <Search size={11} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                    <input autoFocus value={roleSearch} onChange={e => setRoleSearch(e.target.value)}
                      placeholder="Search role…"
                      style={{ width: '100%', height: 32, paddingLeft: 26, paddingRight: 8, fontSize: 12, border: `1px solid ${C.border}`, borderRadius: 7, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: C.navy }}
                      onFocus={e => { e.target.style.borderColor = '#6366F1' }}
                      onBlur={e => { e.target.style.borderColor = C.border }}
                      onKeyDown={e => { if (e.key === 'Escape') { setAddingRole(false); setRoleSearch('') } if (e.key === 'Enter' && roleSearch.trim()) addRoleGroup(roleSearch.trim()) }} />
                  </div>
                  <div style={{ maxHeight: 130, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {unusedRoles.slice(0, 6).map(r => (
                      <button key={r} onMouseDown={() => addRoleGroup(r)}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: 'none', background: 'transparent', textAlign: 'left', fontSize: 11.5, color: C.navy, cursor: 'pointer', fontFamily: 'inherit' }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                        {r}
                      </button>
                    ))}
                    {roleSearch.trim() && !TEAM_ROLE_LIST.includes(roleSearch.trim()) && (
                      <button onMouseDown={() => addRoleGroup(roleSearch.trim())}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: 'none', background: 'rgba(99,102,241,0.07)', textAlign: 'left', fontSize: 11.5, color: '#5B5FDE', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                        + Add "{roleSearch.trim()}"
                      </button>
                    )}
                  </div>
                  <button onClick={() => { setAddingRole(false); setRoleSearch('') }}
                    style={{ width: '100%', marginTop: 4, fontSize: 11, color: C.muted, border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 0' }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Add role button */}
            {!addingRole && (
              <div style={{ padding: '10px 12px', borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => setAddingRole(true)}
                  style={{ width: '100%', height: 34, borderRadius: 9, border: `1.5px dashed rgba(99,102,241,0.35)`, background: 'rgba(99,102,241,0.04)', color: '#6366F1', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'inherit', transition: 'all 0.13s', outline: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.04)' }}>
                  <Plus size={12} strokeWidth={2.5} /> Add Role
                </button>
              </div>
            )}
          </div>

          {/* Right: Member assignment panel */}
          {!currentGroup ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#fff' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Users size={22} strokeWidth={1.3} style={{ color: '#C8CCE0' }} />
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, margin: '0 0 5px' }}>Select a role</p>
              <p style={{ fontSize: 12.5, color: C.muted, margin: 0, textAlign: 'center', lineHeight: 1.55 }}>Choose a role from the left panel<br />to assign team members</p>
            </div>
          ) : (
            <div style={{ background: '#fff', display: 'flex', flexDirection: 'column' }}>
              {/* Role header */}
              <div style={{ height: 44.8, padding: '0 18px', boxSizing: 'border-box', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentGroup.role}</div>
                <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 600, color: C.muted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 99, padding: '4px 12px' }}>
                  {currentGroup.members.length === 0 ? 'No members assigned yet' : `${currentGroup.members.length} member${currentGroup.members.length !== 1 ? 's' : ''} assigned`}
                </span>
              </div>

              <div style={{ padding: '14px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Search employees */}
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                  <input
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    placeholder="Search employees to assign…"
                    style={{ ...inputStyle, height: 40, paddingLeft: 36, fontSize: 13 }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)' }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                  />
                </div>

                {/* Search results dropdown — hidden once search is empty */}
                {memberSearch && (
                  available.length > 0 ? (
                    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', maxHeight: 180, overflowY: 'auto' }}>
                      {available.map((emp, idx) => (
                        <button key={emp}
                          onMouseDown={() => addMemberToRole(emp)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 14px', border: 'none', borderBottom: idx < available.length - 1 ? `1px solid #F0F2F8` : 'none', background: '#fff', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.04)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
                          <img src={`https://i.pravatar.cc/32?u=${emp}`} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1px solid ${C.border}` }} />
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: C.navy }}>{emp}</span>
                          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#5B5FDE', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Plus size={11} strokeWidth={2.5} /> Add
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '12px 14px', borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, textAlign: 'center' }}>
                      <p style={{ fontSize: 12.5, color: C.muted, margin: 0 }}>No employees match "{memberSearch}"</p>
                    </div>
                  )
                )}

                {/* Assigned members — rows with allocation + billing status */}
                {currentGroup.members.length > 0 && (
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Assigned</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {currentGroup.members.map(m => (
                        <div key={m.name} style={{ padding: '10px 12px', borderRadius: 10, background: '#FAFBFE', border: `1px solid ${C.border}` }}>
                          {/* Row 1 — identity + remove */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <img src={`https://i.pravatar.cc/32?u=${m.name}`} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1px solid ${C.border}` }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                              <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{currentGroup.role}</div>
                            </div>
                            <button onClick={() => removeMemberFromRole(currentGroup.id, m.name)}
                              style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, flexShrink: 0, transition: 'all 0.13s', outline: 'none' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.30)'; e.currentTarget.style.color = '#E84855' }}
                              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                              <X size={11} strokeWidth={2.5} />
                            </button>
                          </div>

                          {/* Row 2 — allocation + billing status */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${C.border}`, flexWrap: 'wrap' }}>
                            {/* Allocation */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                              <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Allocation</span>
                              <div style={{ position: 'relative', width: 62 }}>
                                <input
                                  type="number" min={10} max={100} step={5}
                                  value={m.allocation}
                                  onChange={e => updateAllocation(currentGroup.id, m.name, Math.min(100, Math.max(10, Number(e.target.value))))}
                                  style={{ width: '100%', height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 12.5, fontWeight: 700, color: C.navy, textAlign: 'center', outline: 'none', fontFamily: 'inherit', paddingRight: 14, boxSizing: 'border-box' }}
                                  onFocus={e => { e.target.style.borderColor = '#6366F1' }}
                                  onBlur={e => { e.target.style.borderColor = C.border }}
                                />
                                <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: C.muted, fontWeight: 700, pointerEvents: 'none' }}>%</span>
                              </div>
                            </div>

                            {/* Billing status — segmented toggle */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto', flexShrink: 0 }}>
                              <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Billing Status :</span>
                              <div style={{ display: 'inline-flex', padding: 2, borderRadius: 9, background: '#EEF0F6', border: `1px solid ${C.border}` }}>
                                {(['Billable', 'Non-Billable'] as const).map(opt => {
                                  const active = m.billing === opt
                                  const activeColor = opt === 'Billable' ? '#0EA86A' : '#8B90A7'
                                  return (
                                    <button
                                      key={opt}
                                      type="button"
                                      onClick={() => updateBilling(currentGroup.id, m.name, opt)}
                                      style={{
                                        height: 28, padding: '0 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
                                        fontSize: 11.5, fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.13s',
                                        background: active ? '#fff' : 'transparent',
                                        color: active ? activeColor : C.muted,
                                        boxShadow: active ? '0 1px 2px rgba(28,32,53,0.10)' : 'none',
                                      }}
                                    >
                                      {opt}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Step 3: Rate Card ─────────────────────────────────────────────────────────
function Step3({ data, set }: { data: FormData; set: (p: Partial<FormData>) => void }) {
  function addRate() {
    set({ rates: [...data.rates, { id: uid(), role: '', rate: '', currency: 'USD' }] })
  }
  function updateRate(id: number, patch: Partial<RateRow>) {
    set({ rates: data.rates.map(r => r.id === id ? { ...r, ...patch } : r) })
  }
  function removeRate(id: number) {
    set({ rates: data.rates.filter(r => r.id !== id) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Billing Type */}
      <div>
        <label style={LABEL}>Billing Type</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {BILLING_TYPES.map(b => (
            <button key={b.id} onClick={() => set({ billingType: b.id })}
              style={{ padding: '14px 16px', borderRadius: 11, border: `1px solid ${data.billingType === b.id ? 'rgba(99,102,241,0.45)' : C.border}`, background: data.billingType === b.id ? 'rgba(99,102,241,0.06)' : '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.13s', outline: 'none' }}
              onMouseEnter={e => { if (data.billingType !== b.id) e.currentTarget.style.background = C.surface }}
              onMouseLeave={e => { if (data.billingType !== b.id) e.currentTarget.style.background = '#fff' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: data.billingType === b.id ? '#5B5FDE' : C.navy, marginBottom: 3 }}>{b.label}</div>
              <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>{b.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Billing Info */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label style={LABEL}>PO / Contract Number</label>
          <input value={data.poNumber} onChange={e => set({ poNumber: e.target.value })}
            placeholder="e.g. PO-2026-0089"
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
        </div>
        <div>
          <label style={LABEL}>Payment Terms</label>
          <Select value={data.paymentTerms} options={PAYMENT_TERMS_OPTIONS} onChange={v => set({ paymentTerms: v })} placeholder="Select payment terms" />
        </div>
      </div>

      {/* Rate rows */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <label style={{ ...LABEL, margin: 0 }}>Resource-wise Rate Details</label>
          <button onClick={addRate}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 32, padding: '0 12px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.30)', background: 'rgba(99,102,241,0.06)', color: '#5B5FDE', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s', outline: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)' }}>
            <Plus size={12} strokeWidth={2.5} /> Add Row
          </button>
        </div>

        {data.rates.length === 0 ? (
          <div style={{ padding: '28px 20px', textAlign: 'center', borderRadius: 12, border: `1.5px dashed ${C.border}`, background: C.surface }}>
            <DollarSign size={22} strokeWidth={1.4} style={{ color: '#C8CCE0', margin: '0 auto 8px' }} />
            <p style={{ fontSize: 13, color: C.muted, margin: 0, fontWeight: 500 }}>No rate rows yet</p>
            <p style={{ fontSize: 12, color: '#B0B4C8', margin: '4px 0 0' }}>Add resource roles with their billing rates</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 100px 36px', gap: 8, padding: '0 4px', marginBottom: 2 }}>
              {['Role / Resource', 'Rate', 'Currency', ''].map(h => (
                <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>
            {data.rates.map(r => (
              <div key={r.id} className="grid items-center" style={{ gridTemplateColumns: '2fr 1fr 100px 36px', gap: 8, padding: '12px 14px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 11 }}>
                <select value={r.role} onChange={e => updateRate(r.id, { role: e.target.value })}
                  style={{ ...inputStyle, height: 38, fontSize: 13, paddingRight: 28, appearance: 'none', cursor: 'pointer', color: r.role ? C.navy : C.muted }}>
                  <option value="">Select role</option>
                  {ROLE_LIST.map(rl => <option key={rl} value={rl}>{rl}</option>)}
                </select>
                <input value={r.rate} onChange={e => updateRate(r.id, { rate: e.target.value })}
                  placeholder="0.00" type="number" min={0}
                  style={{ ...inputStyle, height: 38, fontSize: 13 }}
                  onFocus={e => { e.target.style.borderColor = '#6366F1' }}
                  onBlur={e => { e.target.style.borderColor = C.border }} />
                <select value={r.currency} onChange={e => updateRate(r.id, { currency: e.target.value })}
                  style={{ ...inputStyle, height: 38, fontSize: 13, paddingRight: 28, appearance: 'none', cursor: 'pointer' }}>
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={() => removeRate(r.id)}
                  style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, transition: 'all 0.13s', outline: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.30)'; e.currentTarget.style.color = '#E84855' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


// ── Required asterisk ─────────────────────────────────────────────────────────
function Req() {
  return <span style={{ color: '#E84855', marginLeft: 2 }}>*</span>
}

// ── Edit prefill defaults ─────────────────────────────────────────────────────
const DEFAULT_MANAGER = 'Priya Mehta'
const DEFAULT_ROLE_GROUPS: RoleGroup[] = [
  { id: 1, role: 'Sr Frontend Developer', members: [
    { name: 'Sarah Johnson', allocation: 100, billing: 'Billable' },
    { name: 'Ravi Kumar',    allocation: 80,  billing: 'Billable' },
  ]},
  { id: 2, role: 'SR Software Engineer', members: [
    { name: 'Deepak Nair',   allocation: 100, billing: 'Billable' },
    { name: 'Vikram Sharma', allocation: 60,  billing: 'Non-Billable' },
  ]},
  { id: 3, role: 'QA Engineer', members: [
    { name: 'Pooja Iyer', allocation: 50, billing: 'Billable' },
  ]},
]

// Filled monthly allocation hours per default role (used when the project has none saved yet)
const DEFAULT_MONTH_HOURS: Record<string, number> = {
  cpm: 16, pm: 40, ba: 32, sr_swe: 80, sr_fe: 64, qa: 40, uiux: 24, devops: 16,
}
function seedAllocations(startISO: string, endISO: string): MonthAlloc[] {
  return monthsBetween(startISO, endISO).map(key => ({ key, hours: { ...DEFAULT_MONTH_HOURS } }))
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function EditProjectPage({
  project,
  onBack,
  onSave,
}: {
  project: any
  onBack: () => void
  onSave: () => void
}) {
  const [step, setStep] = useState(1)
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setFormRaw] = useState<FormData>(() => {
    const startDate = toISO(project.startDate) || '2026-07-01'
    const endDate   = toISO(project.endDate)   || '2026-09-30'
    return {
      projectName:  project.name || '',
      description:  project.description || '',
      clientName:   project.client || '',
      startDate,
      endDate,
      plannedStart: toISO(project.plannedStart) || startDate,
      plannedEnd:   toISO(project.plannedEnd)   || endDate,
      actualStart:  toISO(project.actualStart),
      actualEnd:    toISO(project.actualEnd),
      sowSigned:    toISO(project.sowSigned),
      allocationHours: project.allocationHours || '480',
      status:       normalizeStatus(project.status || ''),
      manager:      project.manager || DEFAULT_MANAGER,
      roleGroups:   project.roleGroups?.length ? project.roleGroups : DEFAULT_ROLE_GROUPS,
      allocations:  project.allocations?.length ? project.allocations : seedAllocations(startDate, endDate),
      customRoles:  project.customRoles || [],
      removedRoles: project.removedRoles || [],
      billingType:  project.billingType || 'hourly',
      poNumber:     project.poNumber || '',
      paymentTerms: project.paymentTerms || '',
      rates:        project.rates || [],
    }
  })

  function set(patch: Partial<FormData>) { setFormRaw(f => ({ ...f, ...patch })) }

  async function handleSubmit() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setSaved(true)
    setTimeout(onSave, 1400)
  }

  const pct = Math.round(((step - 1) / (STEPS.length - 1)) * 100)

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes apFadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes apSpin    { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        @keyframes apPop     { 0%{transform:scale(0.7);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        input[type="date"]::-webkit-calendar-picker-indicator { display: none; }
        input[type="date"]::-webkit-outer-spin-button,
        input[type="date"]::-webkit-inner-spin-button { display: none; }
      `}</style>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2" style={{ marginBottom: 22 }}>
        <button onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s', outline: 'none' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}>
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <button onClick={onBack} style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
          All Projects
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Edit Project</span>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '260px 1fr', alignItems: 'start' }}>

        {/* ── Left: Step navigator ── */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', position: 'sticky', top: 24 }}>
          <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}`, background: 'linear-gradient(135deg, #F5F6FF 0%, #ECEEF8 100%)' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 3 }}>Edit Project</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Step {step} of {STEPS.length}</div>
            <div style={{ marginTop: 14, height: 4, borderRadius: 99, background: '#DDE0F0', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: 'linear-gradient(90deg, #818CF8, #6366F1)', transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
            </div>
          </div>
          <div style={{ padding: '12px 10px' }}>
            {STEPS.map((s, idx) => {
              const done    = step > s.id
              const current = step === s.id
              const Icon    = s.Icon
              return (
                <button key={s.id}
                  onClick={() => setStep(s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 10px', borderRadius: 11, border: 'none', background: current ? 'rgba(99,102,241,0.08)' : 'transparent', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.13s', textAlign: 'left', outline: 'none' }}
                  onMouseEnter={e => { if (!current) e.currentTarget.style.background = C.surface }}
                  onMouseLeave={e => { if (!current) e.currentTarget.style.background = 'transparent' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? 'rgba(14,168,106,0.10)' : current ? 'rgba(99,102,241,0.12)' : '#F0F2F8', border: `1px solid ${done ? 'rgba(14,168,106,0.25)' : current ? 'rgba(99,102,241,0.25)' : C.border}`, transition: 'all 0.2s' }}>
                    {done
                      ? <Check size={15} strokeWidth={2.5} style={{ color: '#0EA86A' }} />
                      : <Icon size={15} strokeWidth={1.8} style={{ color: current ? '#6366F1' : C.muted }} />
                    }
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: done || current ? 700 : 500, color: current ? '#5B5FDE' : done ? '#0A8A58' : '#5A6080', lineHeight: 1.3, transition: 'color 0.15s' }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#B0B4C8', fontWeight: 400, marginTop: 1 }}>{s.sub}</div>
                  </div>
                  {current && (
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', flexShrink: 0 }}>
                      <ChevronRight size={9} strokeWidth={2.5} style={{ color: '#5B5FDE' }} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Optional fields note */}
          <div style={{ margin: '0 12px 12px', padding: '12px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#B45309', marginBottom: 3 }}>Flexible editing</div>
            <div style={{ fontSize: 11, color: '#92400E', lineHeight: 1.55 }}>Update any section independently. Only Project Name &amp; Client are required.</div>
          </div>
        </div>

        {/* ── Right: Form card ── */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>

          {/* Step header */}
          <div style={{ padding: '22px 28px 18px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
            <div className="flex items-center gap-3">
              {(() => {
                const s = STEPS[step - 1]
                const Icon = s.Icon
                return (
                  <>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} strokeWidth={1.8} style={{ color: '#5B5FDE' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, letterSpacing: '-0.2px' }}>{s.label}</div>
                      <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>{s.sub}</div>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>

          {/* Form body */}
          <div style={{ padding: '28px 28px', minHeight: 400, animation: 'apFadeIn 0.22s ease-out' }} key={step}>
            {step === 1 && <Step1 data={form} set={set} />}
            {step === 2 && <StepAllocation data={form} set={set} />}
            {step === 3 && <Step2 data={form} set={set} />}
            {/* Rate Card hidden for now — unreachable step, keep for later re-enable */}
            {step === 4 && <Step3 data={form} set={set} />}
          </div>

          {/* Footer navigation */}
          <div className="flex items-center justify-between" style={{ padding: '18px 28px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE' }}>
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : onBack()}
              style={{ height: 42, padding: '0 20px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', outline: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
              {step === 1 ? 'Cancel' : '← Previous'}
            </button>

            <div className="flex items-center gap-3">
              {step < STEPS.length ? (
                <button onClick={() => setStep(s => s + 1)}
                  style={{ height: 42, padding: '0 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, transition: 'opacity 0.15s', outline: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                  Next <ChevronRight size={15} strokeWidth={2.3} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting}
                  style={{ height: 42, padding: '0 24px', borderRadius: 10, border: 'none', background: submitting ? '#818CF8' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, transition: 'opacity 0.15s', outline: 'none' }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = '0.88' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                  {submitting ? (
                    <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'apSpin 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Saving…</>
                  ) : (
                    <><Check size={15} strokeWidth={2.5} />Save Changes</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success overlay */}
      {saved && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          <div style={{ background: '#fff', borderRadius: 24, width: 400, padding: '44px 36px 36px', boxShadow: '0 24px 64px rgba(10,12,28,0.18)', textAlign: 'center', animation: 'apFadeIn 0.25s ease-out' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(14,168,106,0.10)', border: '2px solid rgba(14,168,106,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'apPop 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
              <Check size={32} strokeWidth={2.5} style={{ color: '#0EA86A' }} />
            </div>
            <div style={{ fontSize: 21, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px', marginBottom: 8 }}>Project Updated!</div>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, margin: '0 0 6px' }}>
              <strong style={{ color: C.navy }}>{form.projectName || 'Project'}</strong> has been updated successfully.
            </p>
            <p style={{ fontSize: 12.5, color: '#B0B4C8', margin: 0 }}>Redirecting you back…</p>
          </div>
        </div>
      )}
    </div>
  )
}
