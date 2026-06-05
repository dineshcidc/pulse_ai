import { useState } from 'react'
import {
  Search, ChevronDown, BarChart2, ArrowLeft,
  Users, CalendarDays, TrendingDown, CheckCircle2,
} from 'lucide-react'

type LeaveType = 'Bereavement Holiday' | 'Birthday Leave' | 'Election Day Leave' | 'Floating Holiday' | 'LWP' | 'Paternity Leave' | 'Planned Leave' | 'Unplanned Leave'

interface LeaveBalance  { allocated: number; consumed: number }
interface EmployeeBalance {
  id: number
  employee: string; avatar: number; empId: string
  department: string; project: string
  balances: Record<LeaveType, LeaveBalance>
}

const LEAVE_TYPES: LeaveType[] = ['Bereavement Holiday', 'Birthday Leave', 'Election Day Leave', 'Floating Holiday', 'LWP', 'Paternity Leave', 'Planned Leave', 'Unplanned Leave']

const TYPE_CFG: Record<LeaveType, { color: string; bg: string; border: string; short: string }> = {
  'Bereavement Holiday': { color: '#6D28D9', bg: 'rgba(109,40,217,0.08)', border: 'rgba(109,40,217,0.18)', short: 'BH'  },
  'Birthday Leave':      { color: '#DB2777', bg: 'rgba(219,39,119,0.08)', border: 'rgba(219,39,119,0.18)', short: 'BL'  },
  'Election Day Leave':  { color: '#0891B2', bg: 'rgba(8,145,178,0.08)',  border: 'rgba(8,145,178,0.18)',  short: 'EDL' },
  'Floating Holiday':    { color: '#EA580C', bg: 'rgba(234,88,12,0.08)',  border: 'rgba(234,88,12,0.18)',  short: 'FH'  },
  'LWP':                 { color: '#DC2626', bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.18)',  short: 'LWP' },
  'Paternity Leave':     { color: '#2563EB', bg: 'rgba(37,99,235,0.08)',  border: 'rgba(37,99,235,0.18)',  short: 'PAT' },
  'Planned Leave':       { color: '#059669', bg: 'rgba(5,150,105,0.08)',  border: 'rgba(5,150,105,0.18)',  short: 'PL'  },
  'Unplanned Leave':     { color: '#D97706', bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.18)',  short: 'UPL' },
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

const DATA: EmployeeBalance[] = [
  {
    id: 1, employee: 'Sarah Johnson', avatar: 47, empId: 'EMP-0047',
    department: 'Engineering', project: 'Pulse.AI v2',
    balances: {
      'Bereavement Holiday': { allocated: 3,  consumed: 0 },
      'Birthday Leave':      { allocated: 1,  consumed: 1 },
      'Election Day Leave':  { allocated: 1,  consumed: 0 },
      'Floating Holiday':    { allocated: 3,  consumed: 1 },
      'LWP':                 { allocated: 0,  consumed: 0 },
      'Paternity Leave':     { allocated: 15, consumed: 0 },
      'Planned Leave':       { allocated: 15, consumed: 5 },
      'Unplanned Leave':     { allocated: 8,  consumed: 2 },
    },
  },
  {
    id: 2, employee: 'Mike Chen', avatar: 33, empId: 'EMP-0033',
    department: 'QA & Testing', project: 'HDFC Portal',
    balances: {
      'Bereavement Holiday': { allocated: 3,  consumed: 0 },
      'Birthday Leave':      { allocated: 1,  consumed: 0 },
      'Election Day Leave':  { allocated: 1,  consumed: 1 },
      'Floating Holiday':    { allocated: 3,  consumed: 2 },
      'LWP':                 { allocated: 0,  consumed: 1 },
      'Paternity Leave':     { allocated: 15, consumed: 0 },
      'Planned Leave':       { allocated: 15, consumed: 8 },
      'Unplanned Leave':     { allocated: 8,  consumed: 4 },
    },
  },
  {
    id: 3, employee: 'Emma Wilson', avatar: 44, empId: 'EMP-0044',
    department: 'Design', project: 'Pulse.AI v2',
    balances: {
      'Bereavement Holiday': { allocated: 3,  consumed: 0 },
      'Birthday Leave':      { allocated: 1,  consumed: 1 },
      'Election Day Leave':  { allocated: 1,  consumed: 0 },
      'Floating Holiday':    { allocated: 3,  consumed: 1 },
      'LWP':                 { allocated: 0,  consumed: 0 },
      'Paternity Leave':     { allocated: 15, consumed: 0 },
      'Planned Leave':       { allocated: 15, consumed: 3 },
      'Unplanned Leave':     { allocated: 8,  consumed: 1 },
    },
  },
  {
    id: 4, employee: 'Arjun Patel', avatar: 52, empId: 'EMP-0052',
    department: 'QA & Testing', project: 'TechCorp ERP',
    balances: {
      'Bereavement Holiday': { allocated: 3,  consumed: 1 },
      'Birthday Leave':      { allocated: 1,  consumed: 1 },
      'Election Day Leave':  { allocated: 1,  consumed: 1 },
      'Floating Holiday':    { allocated: 3,  consumed: 3 },
      'LWP':                 { allocated: 0,  consumed: 2 },
      'Paternity Leave':     { allocated: 15, consumed: 0 },
      'Planned Leave':       { allocated: 15, consumed: 12 },
      'Unplanned Leave':     { allocated: 8,  consumed: 6 },
    },
  },
  {
    id: 5, employee: 'Anjali Singh', avatar: 36, empId: 'EMP-0036',
    department: 'Product', project: 'HDFC Portal',
    balances: {
      'Bereavement Holiday': { allocated: 3,  consumed: 0 },
      'Birthday Leave':      { allocated: 1,  consumed: 1 },
      'Election Day Leave':  { allocated: 1,  consumed: 0 },
      'Floating Holiday':    { allocated: 3,  consumed: 2 },
      'LWP':                 { allocated: 0,  consumed: 0 },
      'Paternity Leave':     { allocated: 15, consumed: 0 },
      'Planned Leave':       { allocated: 15, consumed: 7 },
      'Unplanned Leave':     { allocated: 8,  consumed: 3 },
    },
  },
  {
    id: 6, employee: 'James Wilson', avatar: 60, empId: 'EMP-0060',
    department: 'Engineering', project: 'Pulse.AI v2',
    balances: {
      'Bereavement Holiday': { allocated: 3,  consumed: 1 },
      'Birthday Leave':      { allocated: 1,  consumed: 1 },
      'Election Day Leave':  { allocated: 1,  consumed: 1 },
      'Floating Holiday':    { allocated: 3,  consumed: 3 },
      'LWP':                 { allocated: 0,  consumed: 3 },
      'Paternity Leave':     { allocated: 15, consumed: 5 },
      'Planned Leave':       { allocated: 15, consumed: 13 },
      'Unplanned Leave':     { allocated: 8,  consumed: 7 },
    },
  },
  {
    id: 7, employee: 'Fatima Al-Zahra', avatar: 41, empId: 'EMP-0041',
    department: 'Design', project: 'HDFC Portal',
    balances: {
      'Bereavement Holiday': { allocated: 3,  consumed: 0 },
      'Birthday Leave':      { allocated: 1,  consumed: 0 },
      'Election Day Leave':  { allocated: 1,  consumed: 0 },
      'Floating Holiday':    { allocated: 3,  consumed: 1 },
      'LWP':                 { allocated: 0,  consumed: 0 },
      'Paternity Leave':     { allocated: 15, consumed: 0 },
      'Planned Leave':       { allocated: 15, consumed: 2 },
      'Unplanned Leave':     { allocated: 8,  consumed: 1 },
    },
  },
  {
    id: 8, employee: 'Karthik Nair', avatar: 56, empId: 'EMP-0056',
    department: 'Engineering', project: 'TechCorp ERP',
    balances: {
      'Bereavement Holiday': { allocated: 3,  consumed: 0 },
      'Birthday Leave':      { allocated: 1,  consumed: 1 },
      'Election Day Leave':  { allocated: 1,  consumed: 1 },
      'Floating Holiday':    { allocated: 3,  consumed: 2 },
      'LWP':                 { allocated: 0,  consumed: 0 },
      'Paternity Leave':     { allocated: 15, consumed: 0 },
      'Planned Leave':       { allocated: 15, consumed: 8 },
      'Unplanned Leave':     { allocated: 8,  consumed: 3 },
    },
  },
  {
    id: 9, employee: 'Lisa Garcia', avatar: 25, empId: 'EMP-0025',
    department: 'DevOps', project: 'Pulse.AI v2',
    balances: {
      'Bereavement Holiday': { allocated: 3,  consumed: 0 },
      'Birthday Leave':      { allocated: 1,  consumed: 1 },
      'Election Day Leave':  { allocated: 1,  consumed: 0 },
      'Floating Holiday':    { allocated: 3,  consumed: 1 },
      'LWP':                 { allocated: 0,  consumed: 0 },
      'Paternity Leave':     { allocated: 15, consumed: 0 },
      'Planned Leave':       { allocated: 15, consumed: 4 },
      'Unplanned Leave':     { allocated: 8,  consumed: 1 },
    },
  },
  {
    id: 10, employee: 'Tom Davis', avatar: 20, empId: 'EMP-0020',
    department: 'Engineering', project: 'HDFC Portal',
    balances: {
      'Bereavement Holiday': { allocated: 3,  consumed: 0 },
      'Birthday Leave':      { allocated: 1,  consumed: 1 },
      'Election Day Leave':  { allocated: 1,  consumed: 1 },
      'Floating Holiday':    { allocated: 3,  consumed: 2 },
      'LWP':                 { allocated: 0,  consumed: 1 },
      'Paternity Leave':     { allocated: 15, consumed: 0 },
      'Planned Leave':       { allocated: 15, consumed: 10 },
      'Unplanned Leave':     { allocated: 8,  consumed: 5 },
    },
  },
]

const DEPARTMENTS = ['All Departments', ...Array.from(new Set(DATA.map(d => d.department))).sort()]
const PROJECTS    = ['All Projects',    ...Array.from(new Set(DATA.map(d => d.project))).sort()]

function totals(balances: Record<LeaveType, LeaveBalance>) {
  let allocated = 0, consumed = 0
  LEAVE_TYPES.forEach(t => { allocated += balances[t].allocated; consumed += balances[t].consumed })
  return { allocated, consumed, remaining: allocated - consumed }
}

function healthOf(pct: number) {
  if (pct < 50) return { bar: '#16A34A' }
  if (pct < 80) return { bar: '#F59E0B' }
  return          { bar: '#E84855' }
}

function statusOf(allocated: number, consumed: number) {
  if (consumed === 0)   return { label: 'Not Used',   color: '#4B4ECC', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.15)'  }
  const rem = allocated - consumed
  if (rem === 0)        return { label: 'Exhausted',  color: '#E84855', bg: 'rgba(232,72,85,0.08)',   border: 'rgba(232,72,85,0.15)'   }
  const pct = (rem / allocated) * 100
  if (pct < 20)         return { label: 'Critical',   color: '#E84855', bg: 'rgba(232,72,85,0.08)',   border: 'rgba(232,72,85,0.15)'   }
  if (pct < 50)         return { label: 'Low',        color: '#D97706', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.15)'  }
  return                       { label: 'Sufficient', color: '#0A8A58', bg: 'rgba(14,168,106,0.08)', border: 'rgba(14,168,106,0.15)' }
}

function Dropdown({ value, options, onChange, minW = 140 }: {
  value: string; options: string[]; onChange: (v: string) => void; minW?: number
}) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          height: 36, padding: '0 28px 0 11px',
          border: `1px solid ${C.border}`, borderRadius: 8,
          fontSize: 12.5, fontWeight: 500,
          color: value.startsWith('All') ? C.muted : C.navy,
          background: '#fff', outline: 'none', cursor: 'pointer',
          appearance: 'none', fontFamily: "'DM Sans',system-ui,sans-serif", minWidth: minW,
        }}
        onFocus={e  => { e.target.style.borderColor = '#7C3AED' }}
        onBlur={e   => { e.target.style.borderColor = C.border  }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
    </div>
  )
}

/* ── Detail Page ── */
function LeaveBalanceDetailPage({ emp, onBack }: { emp: EmployeeBalance; onBack: () => void }) {
  const tot = totals(emp.balances)
  const COL = '2fr 1fr 1fr 1fr 1.2fr'


  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>

      {/* Back button — badge style */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: C.hover, border: `1px solid ${C.border}`,
          borderRadius: 8, cursor: 'pointer',
          color: C.navy, fontSize: 12.5, fontWeight: 600,
          padding: '6px 14px', marginBottom: 20, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.borderColor = '#D1D4E4' }}
        onMouseLeave={e => { e.currentTarget.style.background = C.hover;   e.currentTarget.style.borderColor = C.border  }}
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {/* Employee profile card */}
      <div style={{
        background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16,
        padding: '22px 26px', marginBottom: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
      }}>

        {/* Left: identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
          <img
            src={`https://i.pravatar.cc/56?img=${emp.avatar}`} alt={emp.employee}
            style={{ width: 56, height: 56, borderRadius: '50%', flexShrink: 0, objectFit: 'cover', border: `3px solid ${C.border}` }}
          />
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: C.navy }}>{emp.employee}</p>
            <p style={{ margin: '3px 0 0', fontSize: 12.5, color: C.muted }}>{emp.empId}</p>
            <div style={{ display: 'flex', gap: 7, marginTop: 9, flexWrap: 'wrap' }}>
              {[emp.department, emp.project].map(tag => (
                <span key={tag} style={{
                  padding: '2px 10px', borderRadius: 6, fontSize: 11.5, fontWeight: 600,
                  color: C.navy, background: C.surface, border: `1px solid ${C.border}`,
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: stat badges */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          {[
            { label: 'Allocated', value: tot.allocated, color: '#4B4ECC', bg: 'rgba(99,102,241,0.07)',  border: 'rgba(99,102,241,0.18)'  },
            { label: 'Consumed',  value: tot.consumed,  color: '#D97706', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.20)' },
            { label: 'Remaining', value: tot.remaining,
              color:  tot.remaining > 5 ? '#0A8A58' : '#E84855',
              bg:     tot.remaining > 5 ? 'rgba(14,168,106,0.07)'  : 'rgba(232,72,85,0.07)',
              border: tot.remaining > 5 ? 'rgba(14,168,106,0.18)' : 'rgba(232,72,85,0.18)',
            },
          ].map(s => (
            <div key={s.label} style={{
              padding: '10px 18px', borderRadius: 10, textAlign: 'center',
              background: s.bg, border: `1px solid ${s.border}`, minWidth: 80,
            }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</p>
              <p style={{ margin: '5px 0 0', fontSize: 10, fontWeight: 700, color: s.color, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Leave breakdown table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        {/* Card header */}
        <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.navy }}>Leave Type Breakdown</p>
          <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>
            {LEAVE_TYPES.length} categories &nbsp;·&nbsp; {tot.allocated} days allocated
          </span>
        </div>

        {/* Column headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: COL,
          padding: '11px 24px',
          background: C.surface, borderBottom: `1px solid ${C.border}`,
        }}>
          {['Leave Type', 'Allocated', 'Consumed', 'Remaining', 'Status'].map((h, i) => (
            <p key={h} style={{
              margin: 0, fontSize: 10.5, fontWeight: 700, color: C.muted,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              textAlign: i === 0 ? 'left' : 'center',
            }}>{h}</p>
          ))}
        </div>

        {/* Data rows */}
        {LEAVE_TYPES.map((type, idx) => {
          const tc  = TYPE_CFG[type]
          const bal = emp.balances[type]
          const rem = bal.allocated - bal.consumed
          const st  = statusOf(bal.allocated, bal.consumed)
          const isLast = idx === LEAVE_TYPES.length - 1

          return (
            <div
              key={type}
              style={{
                display: 'grid', gridTemplateColumns: COL,
                padding: '18px 24px',
                borderBottom: isLast ? 'none' : `1px solid ${C.border}`,
                alignItems: 'center',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              {/* Leave Type */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 38, height: 25, borderRadius: 6, fontSize: 11, fontWeight: 800,
                  color: tc.color, background: tc.bg, border: `1px solid ${tc.border}`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>{tc.short}</span>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{type}</span>
              </div>

              {/* Allocated */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{bal.allocated}</p>
                <p style={{ margin: '3px 0 0', fontSize: 10.5, color: C.muted }}>days</p>
              </div>

              {/* Consumed */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: bal.consumed > 0 ? tc.color : C.muted, lineHeight: 1 }}>{bal.consumed}</p>
                <p style={{ margin: '3px 0 0', fontSize: 10.5, color: C.muted }}>days</p>
              </div>

              {/* Remaining */}
              <div style={{ textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: rem > 0 ? '#0A8A58' : '#E84855', lineHeight: 1 }}>{rem}</p>
                <p style={{ margin: '3px 0 0', fontSize: 10.5, color: C.muted }}>days</p>
              </div>

              {/* Status */}
              <div style={{ textAlign: 'center' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '4px 13px', borderRadius: 7,
                  fontSize: 12, fontWeight: 700,
                  color: st.color, background: st.bg, border: `1px solid ${st.border}`,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: st.color, flexShrink: 0 }} />
                  {st.label}
                </span>
              </div>
            </div>
          )
        })}

        {/* Footer totals row */}
        <div style={{
          display: 'grid', gridTemplateColumns: COL,
          padding: '14px 24px',
          background: C.surface, borderTop: `2px solid ${C.border}`,
          alignItems: 'center',
        }}>
          <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: C.navy }}>Grand Total</p>
          <p style={{ margin: 0, textAlign: 'center', fontSize: 18, fontWeight: 800, color: '#4B4ECC' }}>{tot.allocated}</p>
          <p style={{ margin: 0, textAlign: 'center', fontSize: 18, fontWeight: 800, color: '#D97706' }}>{tot.consumed}</p>
          <p style={{ margin: 0, textAlign: 'center', fontSize: 18, fontWeight: 800, color: tot.remaining > 0 ? '#0A8A58' : '#E84855' }}>{tot.remaining}</p>
          <div />
        </div>

      </div>
    </div>
  )
}

/* ─────── Main List Page ─────── */
export default function LeaveBalancePage() {
  const [search,      setSearch]      = useState('')
  const [department,  setDepartment]  = useState('All Departments')
  const [project,     setProject]     = useState('All Projects')
  const [sFocus,      setSFocus]      = useState(false)
  const [selectedEmp, setSelectedEmp] = useState<EmployeeBalance | null>(null)

  if (selectedEmp) {
    return <LeaveBalanceDetailPage emp={selectedEmp} onBack={() => setSelectedEmp(null)} />
  }

  const filtered = DATA.filter(e => {
    const q  = search.toLowerCase()
    const ms = !q || e.employee.toLowerCase().includes(q) || e.empId.toLowerCase().includes(q)
    const md = department === 'All Departments' || e.department === department
    const mp = project    === 'All Projects'    || e.project    === project
    return ms && md && mp
  })

  const globalAllocated = DATA.reduce((s, e) => s + totals(e.balances).allocated, 0)
  const globalConsumed  = DATA.reduce((s, e) => s + totals(e.balances).consumed,  0)
  const globalRemaining = globalAllocated - globalConsumed

  const anyFilter = !!(search || department !== 'All Departments' || project !== 'All Projects')

  function clearFilters() {
    setSearch(''); setDepartment('All Departments'); setProject('All Projects')
  }

  const STAT_ICONS = [
    { Icon: Users,        color: '#4B4ECC', iconBg: 'rgba(99,102,241,0.10)'  },
    { Icon: CalendarDays, color: '#1C2035', iconBg: 'rgba(28,32,53,0.07)'   },
    { Icon: TrendingDown, color: '#D97706', iconBg: 'rgba(245,158,11,0.10)' },
    { Icon: CheckCircle2, color: '#0A8A58', iconBg: 'rgba(14,168,106,0.10)' },
  ]
  const STAT_DATA = [
    { label: 'Total Employees',  value: DATA.length     },
    { label: 'Total Allocated',  value: globalAllocated },
    { label: 'Total Consumed',   value: globalConsumed  },
    { label: 'Total Remaining',  value: globalRemaining },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <style>{`
        .lb-row { cursor: pointer; transition: box-shadow 0.15s, border-color 0.15s; }
        .lb-row:hover { box-shadow: 0 4px 18px rgba(28,32,53,0.08) !important; border-color: #D1D4E4 !important; }
      `}</style>

      {/* Page header */}
      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>Leave Balance Overview</h1>
          <p style={{ margin: '5px 0 0', fontSize: 13.5, color: C.muted, lineHeight: 1.65 }}>
            Monitor allocated, consumed, and remaining leave days for every employee. Click any row to view the full per-type breakdown.
          </p>
        </div>
        <span style={{
          padding: '6px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 700,
          color: '#4B4ECC', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)',
          flexShrink: 0, alignSelf: 'flex-start',
        }}>FY 2025-26</span>
      </div>

      {/* Summary stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {STAT_DATA.map((s, i) => {
          const { Icon, color, iconBg } = STAT_ICONS[i]
          return (
            <div key={s.label} style={{
              background: '#fff', border: `1px solid ${C.border}`,
              borderRadius: 16, padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={20} color={color} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ margin: '4px 0 0', fontSize: 11.5, fontWeight: 500, color: C.muted }}>{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '13px 16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 180px', minWidth: 180 }}>
            <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setSFocus(true)} onBlur={() => setSFocus(false)}
              placeholder="Search employee or ID…"
              style={{
                width: '100%', height: 36, paddingLeft: 30, paddingRight: 10,
                border: `1px solid ${sFocus ? '#7C3AED' : C.border}`, borderRadius: 8,
                fontSize: 13, color: C.navy, background: '#fff', outline: 'none',
                fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box',
              }}
            />
          </div>
          <Dropdown value={department} options={DEPARTMENTS} onChange={setDepartment} minW={160} />
          <Dropdown value={project}    options={PROJECTS}    onChange={setProject}    minW={145} />
          {anyFilter && (
            <button onClick={clearFilters}
              style={{ height: 36, padding: '0 13px', borderRadius: 8, fontSize: 12.5, fontWeight: 500, border: `1px solid ${C.border}`, background: C.hover, color: C.muted, cursor: 'pointer', flexShrink: 0 }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Employee rows */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', border: `1px dashed ${C.border}`, borderRadius: 16, padding: '52px 20px', textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: 14, color: C.muted }}>No employees match your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(emp => {
            const tot_ = totals(emp.balances)
            return (
              <div key={emp.id} className="lb-row"
                style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', display: 'flex' }}
                onClick={() => setSelectedEmp(emp)}
              >

                <div style={{ flex: 1, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>

                  {/* Employee info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, flex: '0 0 200px', minWidth: 0 }}>
                    <img src={`https://i.pravatar.cc/38?img=${emp.avatar}`} alt={emp.employee}
                      style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{emp.employee}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 11.5, color: C.muted, whiteSpace: 'nowrap' }}>{emp.empId} · {emp.department}</p>
                    </div>
                  </div>

                  {/* Project */}
                  <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
                    <p style={{ margin: '0 0 3px', fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Project</p>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.navy }}>{emp.project}</p>
                  </div>

                  {/* Allocated */}
                  <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{tot_.allocated}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Allocated</p>
                  </div>

                  {/* Consumed */}
                  <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#D97706', lineHeight: 1 }}>{tot_.consumed}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Consumed</p>
                  </div>

                  {/* Remaining */}
                  <div style={{ textAlign: 'center', flex: '0 0 auto' }}>
                    <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: tot_.remaining > 5 ? '#0A8A58' : '#E84855', lineHeight: 1 }}>{tot_.remaining}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 10, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Remaining</p>
                  </div>

                  {/* Details button */}
                  <button
                    onClick={e => { e.stopPropagation(); setSelectedEmp(emp) }}
                    style={{
                      flexShrink: 0,
                      height: 34, padding: '0 14px', borderRadius: 9,
                      fontSize: 12.5, fontWeight: 600,
                      border: `1px solid ${C.border}`, background: C.surface,
                      color: C.navy, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 6,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.color = '#7C3AED' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.navy  }}
                  >
                    <BarChart2 size={13} /> Details
                  </button>

                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
