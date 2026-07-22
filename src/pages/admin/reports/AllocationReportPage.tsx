import { useState, useRef, useEffect } from 'react'
import {
  BarChart3, Briefcase, ChevronDown, AlertCircle,
  Download, ClipboardList, Check, Users, ChevronLeft, ChevronRight,
  CalendarDays, FolderKanban,
} from 'lucide-react'
import type { ElementType } from 'react'

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
  surface: '#F7F8FC',
  indigo: '#6366F1',
  indigoDark: '#4F46E5',
  green: '#0EA86A',
  greenDk: '#0A7040',
  amber: '#F59E0B',
  amberDk: '#B45309',
  red: '#EF4444',
  redDk: '#DC2626',
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const YEAR = 2026
const MONTHS = MONTH_NAMES.map((n, i) => ({ label: `${n} ${YEAR}`, year: YEAR, m: i }))
const pad = (n: number) => String(n).padStart(2, '0')

/* ────────────────────────── Reusable dropdown ────────────────────────── */
function Dropdown({
  options, value, onChange,
}: { options: string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', height: 40, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 8, padding: '0 12px',
          background: '#fff', border: `1px solid ${open ? C.indigo : C.border}`,
          borderRadius: 10, cursor: 'pointer', transition: 'border-color 0.15s',
          fontSize: 13, fontWeight: 500, color: C.navy,
          boxShadow: open ? `0 0 0 3px rgba(99,102,241,0.12)` : 'none',
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
        <ChevronDown size={15} style={{ color: C.muted, flexShrink: 0, transition: 'transform 0.18s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 30,
            background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12,
            boxShadow: '0 14px 38px rgba(28,32,53,0.14)', padding: 6,
            maxHeight: 240, overflowY: 'auto',
          }}
        >
          {options.map(opt => {
            const active = opt === value
            return (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false) }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 8, padding: '9px 10px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  background: active ? 'rgba(99,102,241,0.10)' : 'transparent',
                  color: active ? C.indigoDark : C.navy, fontSize: 13, fontWeight: active ? 600 : 500,
                  textAlign: 'left', transition: 'background 0.12s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.surface }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{opt}</span>
                {active && <Check size={14} strokeWidth={2.6} style={{ color: C.indigo, flexShrink: 0 }} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ minWidth: 0 }}>
      <span style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', color: C.muted, textTransform: 'uppercase', marginBottom: 7 }}>
        {label}
      </span>
      {children}
    </div>
  )
}

/* ────────────────────────── KPI cards ────────────────────────── */
interface Kpi {
  label: string; value: string; note: string; Icon: ElementType
  bg: string; hover: string; iconBg: string; iconColor: string
}
const KPIS: Kpi[] = [
  { label: 'Projects Tracked',      value: '5',          note: 'Current report scope',                 Icon: Briefcase,   bg: '#F1F2FE', hover: '#E7E9FD', iconBg: '#E0E3FC', iconColor: '#4F46E5' },
  { label: 'Projects Over SoW',     value: '1',          note: 'Need attention',                       Icon: AlertCircle, bg: '#FEF7EC', hover: '#FCEFD8', iconBg: '#FBE7C6', iconColor: '#B45309' },
  { label: 'Weekly Logged More',    value: '1 user',     note: '+10h (45.5%) above weekly allocation', Icon: AlertCircle, bg: '#FEF0F1', hover: '#FCE3E5', iconBg: '#FBD5D8', iconColor: '#DC2626' },
  { label: 'Employees Logged More', value: '1 user',     note: '+10h (45.5%) above allocated hours',   Icon: AlertCircle, bg: '#F6F0FE', hover: '#EEE2FC', iconBg: '#E8D9FB', iconColor: '#7C3AED' },
  { label: 'Projects Logged More',  value: '2 projects', note: '+10h (22.7%) above allocated hours',   Icon: Briefcase,   bg: '#ECF8F4', hover: '#DDF3EA', iconBg: '#CDEEE0', iconColor: '#0A7040' },
]

function KpiCard({ kpi }: { kpi: Kpi }) {
  const { Icon } = kpi
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', background: kpi.bg, borderRadius: 14, padding: 18, transition: 'background 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.background = kpi.hover }}
      onMouseLeave={e => { e.currentTarget.style.background = kpi.bg }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 14 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: C.navy, lineHeight: 1.3 }}>{kpi.label}</span>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: kpi.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={16} strokeWidth={2} style={{ color: kpi.iconColor }} />
        </div>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: C.navy, letterSpacing: '-0.5px', lineHeight: 1.1 }}>{kpi.value}</div>
      <p style={{ fontSize: 11, fontWeight: 500, color: C.muted, margin: '6px 0 0', lineHeight: 1.4 }}>{kpi.note}</p>
    </div>
  )
}

/* ────────────────────────── Table data ────────────────────────── */
interface Row { project: string; lead: string; sow: number; logged: number; usersAbove: number; usersTotal: number }
const ROWS: Row[] = [
  { project: 'Emard Inc',        lead: 'Cullen Haag',  sow: 100, logged: 19,  usersAbove: 1, usersTotal: 1 },
  { project: 'Kohler Group',     lead: 'Ana Reilly',   sow: 160, logged: 172, usersAbove: 2, usersTotal: 4 },
  { project: 'Stark Industries', lead: 'Bruce Wayne',  sow: 120, logged: 96,  usersAbove: 0, usersTotal: 3 },
  { project: 'Wayne LLC',        lead: 'Diana Prince', sow: 80,  logged: 84,  usersAbove: 1, usersTotal: 2 },
  { project: 'Acme Co',          lead: 'John Doe',     sow: 200, logged: 150, usersAbove: 0, usersTotal: 5 },
]

function statusFor(util: number, over: boolean) {
  if (over) return { label: 'Over SoW', bg: 'rgba(239,68,68,0.10)', color: C.redDk }
  if (util >= 90) return { label: 'At risk', bg: 'rgba(245,158,11,0.12)', color: C.amberDk }
  return { label: 'On track', bg: 'rgba(14,168,106,0.12)', color: C.greenDk }
}

const TH: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left', fontSize: 10.5, fontWeight: 700,
  letterSpacing: '0.05em', color: C.muted, textTransform: 'uppercase', whiteSpace: 'nowrap',
}
const TD: React.CSSProperties = { padding: '15px 18px', verticalAlign: 'middle', whiteSpace: 'nowrap' }

/* ────────────────────────── Employee allocation variance ────────────────────────── */
interface Alloc {
  emp: string; empId: string; project: string; billable: boolean
  skill: string; experience: string; allocation: number
  period: string; effort: string
  peak: number; capacity: number; expected: number; logged: number
}
const ALLOCS: Alloc[] = [
  { emp: 'George Bus',   empId: 'PLS009', project: 'Emard Inc',         billable: true,  skill: 'Java',          experience: '1 yr 5 mos',    allocation: 50,  period: '01 Jul – 03 Jul', effort: '4h/day – 12h', peak: 19, capacity: 12, expected: 12,  logged: 19  },
  { emp: 'Admin User',   empId: 'PLS001', project: 'Littel – Hilll',    billable: true,  skill: 'Not available', experience: 'Not available', allocation: 100, period: 'From 14 Jul',      effort: '8h/day',       peak: 0,  capacity: 40, expected: 48,  logged: 0   },
  { emp: 'George Bus',   empId: 'PLS009', project: 'Littel – Hilll',    billable: true,  skill: 'Java',          experience: '1 yr 5 mos',    allocation: 25,  period: '06 Jul – 10 Jul', effort: '2h/day – 10h', peak: 13, capacity: 10, expected: 10,  logged: 13  },
  { emp: 'Manager User', empId: 'PLS002', project: 'Littel – Hilll',    billable: true,  skill: 'Not available', experience: 'Not available', allocation: 100, period: 'From 14 Jul',      effort: '8h/day',       peak: 0,  capacity: 40, expected: 48,  logged: 0   },
  { emp: 'Admin User',   empId: 'PLS001', project: 'Mitchell and Sons', billable: true,  skill: 'Not available', experience: 'Not available', allocation: 100, period: 'From 14 Jul',      effort: '8h/day',       peak: 0,  capacity: 40, expected: 48,  logged: 0   },
  { emp: 'Sarah Lee',    empId: 'PLS014', project: 'Emard Inc',         billable: true,  skill: 'React',         experience: '3 yr 2 mos',    allocation: 75,  period: '07 Jul – 11 Jul', effort: '6h/day – 30h', peak: 32, capacity: 30, expected: 30,  logged: 32  },
  { emp: 'Tom Ford',     empId: 'PLS021', project: 'Acme Co',           billable: false, skill: 'Python',        experience: '4 yr',          allocation: 100, period: 'From 01 Jul',      effort: '8h/day',       peak: 40, capacity: 40, expected: 160, logged: 150 },
  { emp: 'Priya Nair',   empId: 'PLS033', project: 'Stark Industries',  billable: true,  skill: 'DevOps',        experience: '2 yr 6 mos',    allocation: 60,  period: '01 Jul – 15 Jul', effort: '5h/day – 25h', peak: 25, capacity: 25, expected: 80,  logged: 78  },
  { emp: 'John Doe',     empId: 'PLS007', project: 'Wayne LLC',         billable: true,  skill: 'QA',            experience: '1 yr',          allocation: 50,  period: '10 Jul – 20 Jul', effort: '4h/day – 20h', peak: 22, capacity: 20, expected: 40,  logged: 45  },
  { emp: 'Emma Wilson',  empId: 'PLS045', project: 'Kohler Group',      billable: true,  skill: 'UX',            experience: '5 yr',          allocation: 100, period: 'From 05 Jul',      effort: '8h/day',       peak: 42, capacity: 40, expected: 120, logged: 130 },
  { emp: 'Ravi Kumar',   empId: 'PLS052', project: 'Acme Co',           billable: false, skill: 'Java',          experience: '2 yr',          allocation: 80,  period: '01 Jul – 12 Jul', effort: '6h/day – 30h', peak: 20, capacity: 30, expected: 90,  logged: 60  },
  { emp: 'Lena Meyer',   empId: 'PLS060', project: 'Emard Inc',         billable: true,  skill: 'Design',        experience: '6 yr',          allocation: 100, period: 'From 14 Jul',      effort: '8h/day',       peak: 0,  capacity: 40, expected: 48,  logged: 0   },
]
const ALLOC_PAGE_SIZE = 5

function allocStatus(util: number) {
  if (util > 100)  return { label: 'Above allocation', bg: 'rgba(239,68,68,0.10)', color: C.redDk }
  if (util >= 90)  return { label: 'On track',         bg: 'rgba(14,168,106,0.12)', color: C.greenDk }
  return { label: 'Under target', bg: 'rgba(245,158,11,0.12)', color: C.amberDk }
}
function fmtUtil(u: number) {
  return Number.isInteger(u) ? `${u}%` : `${u.toFixed(1)}%`
}

/* ────────────────────────── Page ────────────────────────── */
const PROJECTS = ['All projects', 'Emard Inc', 'Kohler Group', 'Stark Industries', 'Wayne LLC', 'Acme Co']
const EMPLOYEES = ['All employees', 'Cullen Haag', 'Ana Reilly', 'Bruce Wayne', 'Diana Prince', 'John Doe']
const PROJECT_STATUS = ['All statuses', 'Active', 'On hold', 'Completed']
const BILLING = ['All billing types', 'Billable', 'Non-billable', 'Fixed bid']

/* Each real project has a fixed start/end — powers the "Full Project" report and the duration card */
interface ProjMeta { start: string; end: string; duration: string }
const PROJECT_META: Record<string, ProjMeta> = {
  'Emard Inc':        { start: '2026-04-01', end: '2026-06-30', duration: '3 months' },
  'Kohler Group':     { start: '2026-05-15', end: '2026-08-14', duration: '3 months' },
  'Stark Industries': { start: '2026-02-01', end: '2026-07-31', duration: '6 months' },
  'Wayne LLC':        { start: '2026-06-01', end: '2026-08-31', duration: '3 months' },
  'Acme Co':          { start: '2026-01-01', end: '2026-06-30', duration: '6 months' },
}
function fmtNice(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return `${pad(d)} ${MONTH_SHORT[m - 1]} ${y}`
}

const PERIODS = [
  { key: 'Monthly',      desc: 'Calendar month' },
  { key: 'Weekly',       desc: 'One week' },
  { key: 'Bi-weekly',    desc: 'Two-week block' },
  { key: 'Full Project', desc: 'Entire duration' },
] as const
type QuickType = (typeof PERIODS)[number]['key']

export default function AllocationReportPage() {
  const [quick, setQuick]       = useState<QuickType>('Monthly')
  const [monthIdx, setMonthIdx] = useState(6) // July 2026
  const [weekIdx, setWeekIdx]   = useState(0)
  const [halfIdx, setHalfIdx]   = useState(0)

  const [project, setProject]     = useState(PROJECTS[0])
  const [employee, setEmployee]   = useState(EMPLOYEES[0])
  const [projStatus, setProjStatus] = useState(PROJECT_STATUS[0])
  const [billing, setBilling]     = useState(BILLING[0])

  const [allocPage, setAllocPage] = useState(1)
  const allocPages = Math.ceil(ALLOCS.length / ALLOC_PAGE_SIZE)
  const allocStart = (allocPage - 1) * ALLOC_PAGE_SIZE
  const allocRows  = ALLOCS.slice(allocStart, allocStart + ALLOC_PAGE_SIZE)

  /* ── derive periods from the selected month ── */
  const sel = MONTHS[monthIdx]
  const dim = new Date(sel.year, sel.m + 1, 0).getDate()

  const weeks: { start: number; end: number }[] = []
  for (let s = 1; s <= dim; s += 7) weeks.push({ start: s, end: Math.min(s + 6, dim) })
  const halves = [{ start: 1, end: 15 }, { start: 16, end: dim }]

  const wIdx = Math.min(weekIdx, weeks.length - 1)
  const hIdx = Math.min(halfIdx, halves.length - 1)

  const monthOptions = MONTHS.map(x => x.label)
  const weekOptions  = weeks.map((w, i) => `Week ${i + 1}  ·  ${MONTH_SHORT[sel.m]} ${w.start}–${w.end}`)
  const halfOptions  = halves.map(h => `${MONTH_SHORT[sel.m]} ${h.start}–${h.end}`)

  /* ── resolved date range ── */
  const selProj = PROJECT_META[project]
  let rStart = 1, rEnd = dim
  if (quick === 'Weekly')      { rStart = weeks[wIdx].start;  rEnd = weeks[wIdx].end }
  else if (quick === 'Bi-weekly') { rStart = halves[hIdx].start; rEnd = halves[hIdx].end }
  let isoStart = `${sel.year}-${pad(sel.m + 1)}-${pad(rStart)}`
  let isoEnd   = `${sel.year}-${pad(sel.m + 1)}-${pad(rEnd)}`
  if (quick === 'Full Project' && selProj) { isoStart = selProj.start; isoEnd = selProj.end }

  function pickMonth(label: string) {
    setMonthIdx(monthOptions.indexOf(label))
    setWeekIdx(0); setHalfIdx(0)
  }

  function pickProject(p: string) {
    setProject(p)
    // "Full Project" needs a specific project — fall back to Monthly for "All projects"
    if (!PROJECT_META[p] && quick === 'Full Project') setQuick('Monthly')
  }

  function resetFilters() {
    setQuick('Monthly'); setMonthIdx(6); setWeekIdx(0); setHalfIdx(0)
    setProject(PROJECTS[0]); setEmployee(EMPLOYEES[0])
    setProjStatus(PROJECT_STATUS[0]); setBilling(BILLING[0])
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: C.navy, margin: 0, letterSpacing: '-0.3px' }}>Allocation Report</h1>
          <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, margin: '4px 0 0' }}>
            Review project SoW usage, planned allocation hours, and submitted timesheet variance.
          </p>
        </div>
        <button
          type="button"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, height: 40, padding: '0 16px',
            background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10,
            fontSize: 13, fontWeight: 600, color: C.navy, cursor: 'pointer', flexShrink: 0,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.color = C.indigoDark }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.navy }}
        >
          <Download size={15} strokeWidth={2} />
          Export
        </button>
      </div>

      {/* ── 4 / 8 split ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 4fr) minmax(0, 8fr)', gap: 20, alignItems: 'start' }}>

        {/* ══ LEFT (4): Filters ══ */}
        <aside style={{ position: 'sticky', top: 0, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          {/* rail header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '16px 18px', background: 'linear-gradient(135deg, rgba(99,102,241,0.09), rgba(99,102,241,0.02))', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BarChart3 size={17} strokeWidth={2} style={{ color: C.indigo }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Report Filters</div>
              <div style={{ fontSize: 11.5, fontWeight: 500, color: C.muted, marginTop: 1 }}>{isoStart} to {isoEnd}</div>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              title="Reset filters"
              style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: C.muted, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = C.indigo; e.currentTarget.style.borderColor = C.indigo }}
              onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" />
              </svg>
            </button>
          </div>

          {/* rail body */}
          <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* ── Filters (top) ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Project"><Dropdown options={PROJECTS} value={project} onChange={pickProject} /></Field>
              <Field label="Employee"><Dropdown options={EMPLOYEES} value={employee} onChange={setEmployee} /></Field>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Project Status"><Dropdown options={PROJECT_STATUS} value={projStatus} onChange={setProjStatus} /></Field>
              <Field label="Billing"><Dropdown options={BILLING} value={billing} onChange={setBilling} /></Field>
            </div>

            {/* ── Date Range ── */}
            <span style={{ fontSize: 12, fontWeight: 700, color: C.navy, letterSpacing: '-0.1px', marginTop: 2 }}>Date Range</span>

            {selProj && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '11px 13px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 11 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                  <CalendarDays size={16} strokeWidth={2} style={{ color: C.indigo, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Project Duration</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.navy, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fmtNice(selProj.start)} – {fmtNice(selProj.end)}</div>
                  </div>
                </div>
                <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, color: C.indigoDark, background: '#fff', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 999, padding: '3px 10px' }}>{selProj.duration}</span>
              </div>
            )}

            {/* ── Report Period ── */}
            <div>
              {/* time-based — segmented tabs */}
              <div style={{ display: 'flex', gap: 4, padding: 4, background: C.bg, borderRadius: 10 }}>
                {(['Monthly', 'Weekly', 'Bi-weekly'] as const).map(q => {
                  const active = q === quick
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuick(q)}
                      style={{
                        flex: 1, height: 34, borderRadius: 7, border: 'none', cursor: 'pointer',
                        fontSize: 12, fontWeight: 600, transition: 'all 0.15s',
                        background: active ? '#EEF0FE' : 'transparent',
                        color: active ? C.indigoDark : C.muted,
                        boxShadow: active ? 'inset 0 0 0 1px rgba(99,102,241,0.28)' : 'none',
                      }}
                    >
                      {q}
                    </button>
                  )
                })}
              </div>

              {/* full project — full width */}
              {(() => {
                const active = quick === 'Full Project'
                const disabled = !selProj
                return (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setQuick('Full Project')}
                    style={{
                      width: '100%', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      gap: 10, padding: '10px 12px', borderRadius: 10, textAlign: 'left',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      border: `1px solid ${active ? C.indigo : C.border}`,
                      background: active ? 'rgba(99,102,241,0.08)' : '#fff',
                      opacity: disabled ? 0.5 : 1, transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.borderColor = C.indigo }}
                    onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.borderColor = C.border }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                      <FolderKanban size={15} strokeWidth={2} style={{ color: active ? C.indigo : C.muted, flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: active ? C.indigoDark : C.navy }}>Full Project</div>
                        <div style={{ fontSize: 10.5, fontWeight: 500, color: C.muted, marginTop: 1 }}>{disabled ? 'Select a project' : 'Entire project duration'}</div>
                      </div>
                    </div>
                    {active && <Check size={14} strokeWidth={2.6} style={{ color: C.indigo, flexShrink: 0 }} />}
                  </button>
                )
              })()}
            </div>

            {/* ── Period selectors driven by the active tile ── */}
            {quick === 'Monthly' && (
              <Field label="Month">
                <Dropdown options={monthOptions} value={MONTHS[monthIdx].label} onChange={pickMonth} />
              </Field>
            )}

            {quick === 'Weekly' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Month">
                  <Dropdown options={monthOptions} value={MONTHS[monthIdx].label} onChange={pickMonth} />
                </Field>
                <Field label="Week">
                  <Dropdown options={weekOptions} value={weekOptions[wIdx]} onChange={v => setWeekIdx(weekOptions.indexOf(v))} />
                </Field>
              </div>
            )}

            {quick === 'Bi-weekly' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Month">
                  <Dropdown options={monthOptions} value={MONTHS[monthIdx].label} onChange={pickMonth} />
                </Field>
                <Field label="Fortnight">
                  <Dropdown options={halfOptions} value={halfOptions[hIdx]} onChange={v => setHalfIdx(halfOptions.indexOf(v))} />
                </Field>
              </div>
            )}

            {quick === 'Full Project' && selProj && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '11px 13px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 11 }}>
                <FolderKanban size={14} strokeWidth={2} style={{ color: C.indigo, marginTop: 1, flexShrink: 0 }} />
                <span style={{ fontSize: 11.5, fontWeight: 500, color: C.muted, lineHeight: 1.5 }}>
                  Report covers the full project duration — <strong style={{ color: C.navy }}>{fmtNice(selProj.start)} to {fmtNice(selProj.end)}</strong>.
                </span>
              </div>
            )}

            <button
              type="button"
              style={{
                width: '100%', height: 46, marginTop: 6, borderRadius: 12, border: 'none',
                background: C.navy, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }}
              onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
            >
              <ClipboardList size={16} strokeWidth={2} />
              Generate Report
            </button>
          </div>
        </aside>

        {/* ══ RIGHT (8): results ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minWidth: 0 }}>
          {/* stat cards — common white box, 3 + 2 layout */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
              {KPIS.slice(0, 3).map(k => <KpiCard key={k.label} kpi={k} />)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 14, marginTop: 14 }}>
              {KPIS.slice(3).map(k => <KpiCard key={k.label} kpi={k} />)}
            </div>
          </div>

          {/* Project Utilization table */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={16} strokeWidth={2} style={{ color: C.indigo }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: 0 }}>Project Utilization</h3>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}>{ROWS.length} projects</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 1100, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
                    <th style={{ ...TH, paddingLeft: 20, minWidth: 220 }}>Project</th>
                    <th style={{ ...TH, width: 110 }}>SoW Hrs</th>
                    <th style={{ ...TH, width: 110 }}>Logged</th>
                    <th style={{ ...TH, width: 120 }}>Variance</th>
                    <th style={{ ...TH, width: 210 }}>Utilization</th>
                    <th style={{ ...TH, width: 230 }}>Users Above Allocation</th>
                    <th style={{ ...TH, width: 130, paddingRight: 20 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r, i) => {
                    const variance = r.sow - r.logged
                    const over = variance < 0
                    const util = Math.round((r.logged / r.sow) * 100)
                    const barColor = over ? C.red : util >= 90 ? C.amber : C.green
                    const st = statusFor(util, over)
                    const anyAbove = r.usersAbove > 0
                    return (
                      <tr
                        key={r.project}
                        style={{ borderBottom: i < ROWS.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.12s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <td style={{ ...TD, paddingLeft: 20 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{r.project}</div>
                          <div style={{ fontSize: 12, fontWeight: 500, color: C.muted, marginTop: 1 }}>{r.lead}</div>
                        </td>
                        <td style={{ ...TD, fontSize: 13.5, fontWeight: 600, color: C.navy }}>{r.sow}h</td>
                        <td style={{ ...TD, fontSize: 13.5, fontWeight: 600, color: C.navy }}>{r.logged}h</td>
                        <td style={{ ...TD, fontSize: 13.5, fontWeight: 700, color: over ? C.redDk : C.greenDk }}>
                          {over ? '' : '+'}{variance}h
                        </td>
                        <td style={TD}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div style={{ flex: 1, height: 7, background: '#EEF0F6', borderRadius: 999, overflow: 'hidden', minWidth: 50 }}>
                              <div style={{ width: `${Math.min(util, 100)}%`, height: '100%', background: barColor, borderRadius: 999 }} />
                            </div>
                            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, flexShrink: 0, width: 38, textAlign: 'right' }}>{util}%</span>
                          </div>
                        </td>
                        <td style={TD}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: anyAbove ? C.redDk : C.navy }}>{r.usersAbove}/{r.usersTotal} users</div>
                          <div style={{ fontSize: 11.5, fontWeight: 500, color: C.muted, marginTop: 1 }}>
                            {anyAbove ? `${Math.round((r.usersAbove / r.usersTotal) * 100)}% above allocation` : 'All within allocation'}
                          </div>
                        </td>
                        <td style={{ ...TD, paddingRight: 20 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: 999, background: st.bg, color: st.color, fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Employee Allocation Variance table */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={16} strokeWidth={2} style={{ color: C.amberDk }} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: 0 }}>Employee Allocation Variance</h3>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}>{ALLOCS.length} allocations · {isoStart} to {isoEnd}</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 1780, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
                    <th style={{ ...TH, paddingLeft: 20, minWidth: 150 }}>Employee</th>
                    <th style={{ ...TH, width: 130 }}>Project</th>
                    <th style={{ ...TH, width: 120 }}>Billing</th>
                    <th style={{ ...TH, width: 120 }}>Skill Set</th>
                    <th style={{ ...TH, width: 140 }}>Total Experience</th>
                    <th style={{ ...TH, width: 110 }}>Allocation</th>
                    <th style={{ ...TH, width: 150 }}>Allocation Period</th>
                    <th style={{ ...TH, width: 140 }}>Planned Effort</th>
                    <th style={{ ...TH, width: 180 }}>Peak Week / Weekly Capacity</th>
                    <th style={{ ...TH, width: 160 }}>Expected Hours (Filter)</th>
                    <th style={{ ...TH, width: 90 }}>Logged</th>
                    <th style={{ ...TH, width: 100 }}>Variance</th>
                    <th style={{ ...TH, width: 180 }}>Utilization</th>
                    <th style={{ ...TH, width: 150, paddingRight: 20 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allocRows.map((a, i) => {
                    const weekly = a.peak - a.capacity
                    const variance = a.logged - a.expected
                    const util = a.expected > 0 ? Math.round((a.logged / a.expected) * 1000) / 10 : 0
                    const barColor = util > 100 ? C.red : util >= 90 ? C.green : C.amber
                    const st = allocStatus(util)
                    return (
                      <tr
                        key={`${a.empId}-${a.project}-${allocStart + i}`}
                        style={{ borderBottom: i < allocRows.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.12s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                      >
                        <td style={{ ...TD, paddingLeft: 20 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{a.emp}</div>
                          <div style={{ fontSize: 11.5, fontWeight: 500, color: C.muted, marginTop: 1 }}>{a.empId}</div>
                        </td>
                        <td style={{ ...TD, fontSize: 13, fontWeight: 600, color: C.navy }}>{a.project}</td>
                        <td style={TD}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 11px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: a.billable ? 'rgba(14,168,106,0.12)' : '#EEF0F6', color: a.billable ? C.greenDk : C.muted }}>
                            {a.billable ? 'Billable' : 'Non-billable'}
                          </span>
                        </td>
                        <td style={{ ...TD, fontSize: 13, fontWeight: 500, color: a.skill === 'Not available' ? C.muted : C.navy }}>{a.skill}</td>
                        <td style={{ ...TD, fontSize: 13, fontWeight: 500, color: a.experience === 'Not available' ? C.muted : C.navy }}>{a.experience}</td>
                        <td style={{ ...TD, fontSize: 13.5, fontWeight: 700, color: C.navy }}>{a.allocation}%</td>
                        <td style={{ ...TD, fontSize: 13, fontWeight: 500, color: C.navy }}>{a.period}</td>
                        <td style={{ ...TD, fontSize: 13, fontWeight: 500, color: C.navy }}>{a.effort}</td>
                        <td style={TD}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{a.peak}h / {a.capacity}h</div>
                          <div style={{ fontSize: 11.5, fontWeight: 600, color: weekly >= 0 ? C.redDk : C.amberDk, marginTop: 1 }}>
                            {weekly >= 0 ? '+' : '−'}{Math.abs(weekly)}h weekly
                          </div>
                        </td>
                        <td style={{ ...TD, fontSize: 13.5, fontWeight: 600, color: C.navy }}>{a.expected}h</td>
                        <td style={{ ...TD, fontSize: 13.5, fontWeight: 600, color: C.navy }}>{a.logged}h</td>
                        <td style={{ ...TD, fontSize: 13.5, fontWeight: 700, color: variance > 0 ? C.redDk : variance < 0 ? C.amberDk : C.muted }}>
                          {variance > 0 ? '+' : variance < 0 ? '−' : ''}{Math.abs(variance)}h
                        </td>
                        <td style={TD}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div style={{ flex: 1, height: 7, background: '#EEF0F6', borderRadius: 999, overflow: 'hidden', minWidth: 50 }}>
                              <div style={{ width: `${Math.min(util, 100)}%`, height: '100%', background: barColor, borderRadius: 999 }} />
                            </div>
                            <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, flexShrink: 0, width: 52, textAlign: 'right' }}>{fmtUtil(util)}</span>
                          </div>
                        </td>
                        <td style={{ ...TD, paddingRight: 20 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: 999, background: st.bg, color: st.color, fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}>
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* pagination footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 20px', borderTop: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: C.muted }}>
                Showing {allocStart + 1} to {Math.min(allocStart + ALLOC_PAGE_SIZE, ALLOCS.length)} of {ALLOCS.length} allocations
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <PageBtn disabled={allocPage === 1} onClick={() => setAllocPage(p => Math.max(1, p - 1))}>
                  <ChevronLeft size={15} strokeWidth={2.2} />
                </PageBtn>
                {Array.from({ length: allocPages }, (_, idx) => idx + 1).map(n => (
                  <PageBtn key={n} active={n === allocPage} onClick={() => setAllocPage(n)}>{n}</PageBtn>
                ))}
                <PageBtn disabled={allocPage === allocPages} onClick={() => setAllocPage(p => Math.min(allocPages, p + 1))}>
                  <ChevronRight size={15} strokeWidth={2.2} />
                </PageBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PageBtn({ children, active, disabled, onClick }: { children: React.ReactNode; active?: boolean; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 32, height: 32, padding: '0 8px', borderRadius: 8, cursor: disabled ? 'not-allowed' : 'pointer',
        border: `1px solid ${active ? C.navy : C.border}`,
        background: active ? C.navy : '#fff',
        color: active ? '#fff' : disabled ? '#C4C8D8' : C.navy,
        fontSize: 12.5, fontWeight: 700,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        opacity: disabled ? 0.6 : 1, transition: 'all 0.12s',
      }}
      onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.background = C.surface }}
      onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.background = '#fff' }}
    >
      {children}
    </button>
  )
}
