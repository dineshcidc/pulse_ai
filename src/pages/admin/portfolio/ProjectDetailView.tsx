import { useState, useRef, useEffect } from 'react'
import {
  ArrowLeft, FolderKanban, Users, Gauge, ShieldAlert, Activity,
  ListChecks, AlertTriangle, CalendarClock, FileSpreadsheet, Eye, Download,
  TrendingUp, SlidersHorizontal, Sparkles, Loader2,
} from 'lucide-react'
import {
  getProjectDetail, getProjectEfforts,
  type PortfolioProject, type Health, type RiskLevel,
  type EffortRow, type TaskItem,
} from './portfolioData'

const C = {
  navy: '#1C2035', ink: '#2A2F45', muted: '#8B90A7', faint: '#AEB2C4',
  border: '#E8EAF2', line: '#EEF0F6', panel: '#FFFFFF', wash: '#F6F7FB',
  indigo: '#6366F1', green: '#16A34A', amber: '#D97706', red: '#E11D48',
  blue: '#2563EB', orange: '#EA580C',
}

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const fmtDate = (iso: string) => { const [, m, d] = iso.split('-').map(Number); return `${MONTH_SHORT[m - 1]} ${String(d).padStart(2, '0')}` }

/* Project Efforts month selector — July 2026 is the current month. */
const BASE_YEAR = 2026, BASE_MONTH = 6 // July (0-indexed)
const MAX_MONTHS_BACK = 11
const monthLabel = (offset: number) => {
  let m = BASE_MONTH - offset, y = BASE_YEAR
  while (m < 0) { m += 12; y -= 1 }
  return `${MONTH_SHORT[m]} ${y}`
}

/* Reporting-period filter options. */
const FREQS = ['All', 'Weekly', 'Bi-weekly', 'Monthly'] as const
const MONTH_OPTIONS = Array.from({ length: MAX_MONTHS_BACK + 1 }, (_, offset) => ({ offset, label: monthLabel(offset) }))
const FILTER_SELECT: React.CSSProperties = {
  width: '100%', height: 34, border: `1px solid ${C.border}`, borderRadius: 9, padding: '0 30px 0 11px',
  fontSize: 12, fontWeight: 600, color: C.muted, background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
  outline: 'none', appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238B90A7' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
}

const RISK_STYLE: Record<RiskLevel, { fg: string; bg: string }> = {
  Low:      { fg: C.green,  bg: 'rgba(22,163,74,0.10)' },
  Medium:   { fg: C.amber,  bg: 'rgba(217,119,6,0.10)' },
  High:     { fg: C.orange, bg: 'rgba(234,88,12,0.10)' },
  Critical: { fg: C.red,    bg: 'rgba(225,29,72,0.10)' },
}
const HEALTH_STYLE: Record<Health, { fg: string; bg: string; label: string }> = {
  Healthy:  { fg: C.green, bg: 'rgba(22,163,74,0.10)', label: 'On Track' },
  'At Risk':{ fg: C.amber, bg: 'rgba(217,119,6,0.10)', label: 'At Risk'  },
  Delayed:  { fg: C.red,   bg: 'rgba(225,29,72,0.10)', label: 'Delayed'  },
}
const TASK_STYLE: Record<TaskItem['status'], { fg: string; bg: string }> = {
  Completed:     { fg: C.green,  bg: 'rgba(22,163,74,0.10)' },
  'In Progress': { fg: C.blue,   bg: 'rgba(37,99,235,0.10)' },
  Blocked:       { fg: C.red,    bg: 'rgba(225,29,72,0.10)' },
}
/* Risk severity → the 3-status badge used across the module. */
function riskStatus(sev: RiskLevel): { label: string; fg: string; bg: string } {
  if (sev === 'Critical') return { label: 'Critical', fg: C.red,   bg: 'rgba(225,29,72,0.10)' }
  if (sev === 'Low')      return { label: 'On Track', fg: C.green, bg: 'rgba(22,163,74,0.10)' }
  return { label: 'At Risk', fg: C.amber, bg: 'rgba(217,119,6,0.10)' }
}

function Badge({ text, fg, bg, dot }: { text: string; fg: string; bg: string; dot?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full" style={{ background: bg, color: fg, padding: '4px 11px', fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}>
      {dot && <span className="rounded-full" style={{ width: 6, height: 6, background: fg }} />}{text}
    </span>
  )
}

function Panel({ Icon, title, right, children, style }: { Icon: React.ElementType; title: string; right?: React.ReactNode; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}`, overflow: 'hidden', ...style }}>
      <div className="flex items-center justify-between gap-3" style={{ padding: '15px 18px', borderBottom: `1px solid ${C.line}` }}>
        <div className="flex items-center gap-2">
          <Icon size={17} style={{ color: C.indigo }} />
          <span style={{ fontSize: 14.5, fontWeight: 700, color: C.navy }}>{title}</span>
        </div>
        {right}
      </div>
      {children}
    </div>
  )
}

/* Reads each task as a short project-update paragraph. The status keyword is
   kept as plain colored text (no badge) and the due date as normal text. */
function renderTaskNote(t: TaskItem): React.ReactNode {
  const ts = TASK_STYLE[t.status]
  const status = <span style={{ color: ts.fg, fontWeight: 700 }}>{t.status}</span>
  const due = <>Due Date · {fmtDate(t.due)}</>
  if (t.status === 'Completed')
    return <>The team wrapped up and signed off this workstream — all acceptance checks passed. Marked {status} ahead of the {due}, with no open follow-ups remaining.</>
  if (t.status === 'Blocked')
    return <>Progress is on hold pending an external dependency. Flagged as {status} and escalated to the owner — the {due} is at risk until the blocker clears.</>
  return <>Actively being worked on and tracking to plan. Currently {status}, with the team targeting the {due} for handoff and review.</>
}

/* ── skeleton loaders (shimmer while a new report period is generated) ── */
function Sk({ w = '100%', h = 12, r = 7, style }: { w?: number | string; h?: number; r?: number; style?: React.CSSProperties }) {
  return <div className="pv-skel" style={{ width: w, height: h, borderRadius: r, flexShrink: 0, ...style }} />
}
function SkPanel({ children, flex = 1, headerRight = true }: { children: React.ReactNode; flex?: number; headerRight?: boolean }) {
  return (
    <div style={{ flex: `${flex} 1 0`, minWidth: 0, display: 'flex' }}>
      <div className="rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}`, overflow: 'hidden', flex: 1 }}>
        <div className="flex items-center justify-between" style={{ padding: '15px 18px', borderBottom: `1px solid ${C.line}` }}>
          <div className="flex items-center gap-2"><Sk w={17} h={17} r={5} /><Sk w={130} h={13} /></div>
          {headerRight && <Sk w={70} h={12} />}
        </div>
        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>{children}</div>
      </div>
    </div>
  )
}
function SkCard({ lines = 2 }: { lines?: number }) {
  return (
    <div className="rounded-xl" style={{ border: `1px solid ${C.border}`, padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 9 }}>
      <div className="flex items-center justify-between"><Sk w={150} h={13} /><Sk w={60} h={10} /></div>
      {Array.from({ length: lines }).map((_, i) => <Sk key={i} w={i === lines - 1 ? '68%' : '100%'} h={9} />)}
    </div>
  )
}
function LoadingSections() {
  const ECOLS = '1.5fr 1fr 1fr 1fr 1fr 1.4fr 1fr'
  return (
    <>
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', marginBottom: 16 }}>
        <SkPanel flex={8}>{[0, 1].map(i => <SkCard key={i} lines={2} />)}</SkPanel>
        <SkPanel flex={4}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between" style={{ padding: '6px 2px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><Sk w={120} h={12} /><Sk w={60} h={9} /></div>
              <div className="flex gap-1.5"><Sk w={30} h={30} r={8} /><Sk w={30} h={30} r={8} /></div>
            </div>
          ))}
        </SkPanel>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', marginBottom: 16 }}>
        <SkPanel headerRight={false}>{[0, 1, 2].map(i => <SkCard key={i} lines={1} />)}</SkPanel>
        <SkPanel headerRight={false}>{[0, 1, 2].map(i => <SkCard key={i} lines={1} />)}</SkPanel>
      </div>
      <SkPanel>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: ECOLS, gap: 12, alignItems: 'center', padding: '4px 6px' }}>
            <Sk w="80%" h={12} /><Sk w={44} h={12} /><Sk w={44} h={12} /><Sk w={44} h={12} /><Sk w={44} h={12} /><Sk h={8} /><Sk w={58} h={18} r={9} />
          </div>
        ))}
      </SkPanel>
    </>
  )
}

/* ── main ── */
export default function ProjectDetailView({ project, onBack }: { project: PortfolioProject; onBack: () => void }) {
  const d = getProjectDetail(project)
  const rs = RISK_STYLE[project.risk], hs = HEALTH_STYLE[project.health]

  // Reporting-period filter (frequency + month). Defaults to All · current month.
  const [freq, setFreq] = useState<string>('All')
  const [monthSel, setMonthSel] = useState(0)
  const [applied, setApplied] = useState({ freq: 'All', month: 0 })
  const [loading, setLoading] = useState(false)
  const dirty = freq !== applied.freq || monthSel !== applied.month
  const efforts = getProjectEfforts(project, applied.month)

  const timerRef = useRef<number | null>(null)
  useEffect(() => () => { if (timerRef.current) window.clearTimeout(timerRef.current) }, [])
  const onGenerate = () => {
    if (!dirty || loading) return
    setApplied({ freq, month: monthSel })   // apply the selected period
    setLoading(true)                         // skeleton the sections below…
    timerRef.current = window.setTimeout(() => setLoading(false), 1300) // …then reveal the data
  }

  const totalExpected = efforts.reduce((s, e) => s + e.expected, 0)
  const totalLogged = efforts.reduce((s, e) => s + e.logged, 0)
  const billableCount = efforts.filter(e => e.billable).length
  const reports = d.reports.slice(0, 5)

  const KPIS = [
    { Icon: Users,       label: 'Team Size',   value: String(project.teamCount), fg: C.indigo },
    { Icon: Gauge,       label: 'Utilization', value: `${project.utilization}%`, fg: C.blue },
    { Icon: ShieldAlert, label: 'Risk Level',  value: project.risk,              fg: rs.fg },
    { Icon: Activity,    label: 'Health',      value: hs.label,                  fg: hs.fg },
  ]

  const ECOLS = '1.5fr 1fr 1fr 1fr 1fr 1.4fr 1fr'
  const EHEAD: { h: string; align: 'left' | 'center' }[] = [
    { h: 'Employee', align: 'left' }, { h: 'Allocation', align: 'center' }, { h: 'Expected', align: 'center' },
    { h: 'Logged', align: 'center' }, { h: 'Variance', align: 'center' }, { h: 'Utilization', align: 'left' }, { h: 'Billing', align: 'center' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes pvShimmer { 0% { background-position: -200% 0 } 100% { background-position: 200% 0 } }
        @keyframes pvSpin { to { transform: rotate(360deg) } }
        .pv-skel { background: linear-gradient(90deg, ${C.line} 25%, ${C.wash} 37%, ${C.line} 63%); background-size: 200% 100%; animation: pvShimmer 1.4s ease-in-out infinite; }
        .pv-spin { animation: pvSpin 0.7s linear infinite; }
      `}</style>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2" style={{ marginBottom: 18 }}>
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s' }}
          onMouseEnter={e => { e.currentTarget.style.background = C.wash; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}>
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <button onClick={onBack} style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>Projects Dashboard</button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{project.name}</span>
      </div>

      {/* Top section — project card + stats occupy 8 of 12 cols; right 4 reserved */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0,1fr))', gap: 16, marginBottom: 16, alignItems: 'stretch' }}>
        {/* Left 8 — project card + quick stats */}
        <div style={{ gridColumn: 'span 8', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Hero */}
          <div className="rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
            <div style={{ height: 3, background: `linear-gradient(90deg, ${hs.fg}, ${hs.fg}55)` }} />
            <div className="flex items-center justify-between gap-4 flex-wrap" style={{ padding: '18px 22px' }}>
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="rounded-2xl flex items-center justify-center flex-shrink-0" style={{ width: 48, height: 48, background: 'rgba(99,102,241,0.10)' }}>
                  <FolderKanban size={24} style={{ color: C.indigo }} />
                </div>
                <div className="min-w-0">
                  <h1 style={{ fontSize: 19, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px' }}>{project.name}</h1>
                  <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 5, fontSize: 12.5, color: C.muted, fontWeight: 500 }}>
                    <span className="inline-flex items-center gap-1.5"><Users size={12} style={{ color: C.faint }} /> {project.pm}</span>
                    <span style={{ color: C.faint }}>·</span>
                    <span style={{ color: project.status === 'Active' ? C.green : C.muted, fontWeight: 700 }}>{project.status}</span>
                  </div>
                </div>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-xl cursor-pointer flex-shrink-0" style={{ height: 40, background: '#fff', color: C.navy, border: `1px solid ${C.border}`, padding: '0 18px', fontSize: 13, fontWeight: 700 }}
                onMouseEnter={e => { e.currentTarget.style.background = C.wash; e.currentTarget.style.borderColor = '#C8CCE0' }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}>
                <Download size={15} style={{ color: C.indigo }} /> Generate Report
              </button>
            </div>
          </div>

          {/* Quick stats — 4 cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 14 }}>
            {KPIS.map(k => (
              <div key={k.label} className="rounded-2xl flex items-center gap-3" style={{ background: C.panel, border: `1px solid ${C.border}`, padding: '13px 15px' }}>
                <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 38, height: 38, background: `${k.fg}14` }}>
                  <k.Icon size={18} strokeWidth={2} style={{ color: k.fg }} />
                </div>
                <div className="min-w-0">
                  <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, lineHeight: 1.1 }}>{k.value}</div>
                  <div className="truncate" style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, marginTop: 2 }}>{k.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 — reporting-period filter */}
        <div style={{ gridColumn: 'span 4', minWidth: 0 }}>
          <div className="rounded-2xl" style={{ height: '100%', border: '1px solid rgba(99,102,241,0.22)', background: 'linear-gradient(135deg, rgba(99,102,241,0.11), rgba(99,102,241,0.02))', padding: 15, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* header */}
            <div className="flex items-center gap-2">
              <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, background: '#fff', border: `1px solid ${C.border}` }}>
                <SlidersHorizontal size={15} style={{ color: C.indigo }} />
              </div>
              <div className="min-w-0">
                <div style={{ fontSize: 13.5, fontWeight: 800, color: C.navy, lineHeight: 1.2 }}>Report Filter</div>
                <div className="truncate" style={{ fontSize: 10.5, color: C.muted, fontWeight: 500 }}>View a specific reporting period</div>
              </div>
            </div>

            {/* Reporting Frequency + Month — same row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="min-w-0">
                <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 5 }}>Reporting Frequency</div>
                <select value={freq} onChange={e => setFreq(e.target.value)} style={FILTER_SELECT}>
                  {FREQS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="min-w-0">
                <div style={{ fontSize: 10, fontWeight: 700, color: C.muted, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 5 }}>Month</div>
                <select value={monthSel} onChange={e => setMonthSel(Number(e.target.value))} style={FILTER_SELECT}>
                  {MONTH_OPTIONS.map(m => <option key={m.offset} value={m.offset}>{m.label}{m.offset === 0 ? ' — Current' : ''}</option>)}
                </select>
              </div>
            </div>

            {/* Generate — disabled until a new selection is made; shows a loader while generating */}
            <button onClick={onGenerate} disabled={!dirty || loading} className="inline-flex items-center justify-center gap-1.5"
              style={{ marginTop: 'auto', height: 37, borderRadius: 9, border: (dirty || loading) ? 'none' : `1px solid ${C.border}`, background: (dirty || loading) ? C.navy : 'rgba(255,255,255,0.6)', color: (dirty || loading) ? '#fff' : C.faint, fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit', cursor: loading ? 'progress' : dirty ? 'pointer' : 'not-allowed', transition: 'background 0.14s' }}
              onMouseEnter={e => { if (dirty && !loading) e.currentTarget.style.background = '#2A3050' }}
              onMouseLeave={e => { if (dirty && !loading) e.currentTarget.style.background = C.navy }}>
              {loading ? <><Loader2 size={14} className="pv-spin" /> Generating…</> : <><Sparkles size={14} /> Generate</>}
            </button>
          </div>
        </div>
      </div>

      {loading ? <LoadingSections /> : (
      <>
      {/* Current Tasks (8) + Report History (4) — equal height */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', marginBottom: 16 }}>
        <div style={{ flex: '8 1 0', minWidth: 0, display: 'flex' }}>
          <Panel Icon={ListChecks} title="Current Tasks" right={<span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{d.tasks.length} tasks</span>} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ maxHeight: 292, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {d.tasks.map((t, i) => {
                return (
                  <div key={i} className="rounded-xl" style={{ border: `1px solid ${C.border}`, background: 'transparent', padding: '13px 15px', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.wash; e.currentTarget.style.borderColor = '#D5D9EA' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.border }}>
                    <div className="flex items-center justify-between gap-2" style={{ marginBottom: 6 }}>
                      <div className="min-w-0">
                        <span className="truncate" style={{ fontSize: 13.5, fontWeight: 800, color: C.navy }}>{t.title}</span>
                      </div>
                      <span className="flex-shrink-0" style={{ fontSize: 11, color: C.faint }}>Added {fmtDate(t.date)}</span>
                    </div>
                    <p style={{ fontSize: 12, color: C.ink, lineHeight: 2.0 }}>{renderTaskNote(t)}</p>
                  </div>
                )
              })}
            </div>
          </Panel>
        </div>

        <div style={{ flex: '4 1 0', minWidth: 0, display: 'flex' }}>
          <Panel Icon={CalendarClock} title="Report History" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              {reports.map((r, i) => {
                return (
                  <div key={r.period} className="flex items-center gap-3" style={{ padding: '19px 18px', borderBottom: i < reports.length - 1 ? `1px solid ${C.line}` : 'none', transition: 'background 0.14s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                    <div className="min-w-0 flex-1">
                      <div className="truncate" style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>{r.period}</div>
                      <div style={{ marginTop: 4, fontSize: 11, fontWeight: 600, color: C.green }}>{r.status}</div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button title="View report" className="inline-flex items-center justify-center rounded-lg cursor-pointer" style={{ width: 30, height: 30, background: C.wash, border: `1px solid ${C.border}`, color: C.muted }}
                        onMouseEnter={e => { e.currentTarget.style.color = C.indigo }} onMouseLeave={e => { e.currentTarget.style.color = C.muted }}><Eye size={14} /></button>
                      <button title="Download" className="inline-flex items-center justify-center rounded-lg cursor-pointer" style={{ width: 30, height: 30, background: C.wash, border: `1px solid ${C.border}`, color: C.muted }}
                        onMouseEnter={e => { e.currentTarget.style.color = C.green }} onMouseLeave={e => { e.currentTarget.style.color = C.muted }}><FileSpreadsheet size={14} /></button>
                    </div>
                  </div>
                )
              })}
            </div>
          </Panel>
        </div>
      </div>

      {/* Risks & Issues + Milestones & Critical Updates — equal height (flex-1) */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', marginBottom: 16 }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>
          <Panel Icon={AlertTriangle} title="Risks & Issues" style={{ flex: 1, display: 'flex', flexDirection: 'column', maxHeight: 344 }}>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {d.risks.map((r, i) => {
                const st = riskStatus(r.severity)
                return (
                  <div key={i} className="rounded-xl" style={{ background: 'transparent', border: `1px solid ${C.border}`, padding: '12px 14px', transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.wash; e.currentTarget.style.borderColor = '#D5D9EA' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.border }}>
                    <div className="flex items-center justify-between gap-2" style={{ marginBottom: 7 }}>
                      <span className="truncate" style={{ fontSize: 12.5, fontWeight: 800, color: C.navy }}>{r.title}</span>
                      <Badge text={st.label} fg={st.fg} bg={st.bg} />
                    </div>
                    <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.65 }}>{r.note}</p>
                  </div>
                )
              })}
            </div>
          </Panel>
        </div>

        <div style={{ flex: 1, minWidth: 0, display: 'flex' }}>
          <Panel Icon={CalendarClock} title="Milestones & Critical Updates" style={{ flex: 1, display: 'flex', flexDirection: 'column', maxHeight: 344 }}>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {d.milestones.map((m, i) => (
                <div key={i} className="rounded-xl" style={{ background: 'transparent', border: `1px solid ${C.border}`, padding: '12px 14px', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.wash; e.currentTarget.style.borderColor = '#D5D9EA' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = C.border }}>
                  <div className="truncate" style={{ fontSize: 12.5, fontWeight: 800, color: C.navy, marginBottom: 5 }}>{m.name}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>{m.kind} · {fmtDate(m.date)}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Project Efforts */}
      <Panel Icon={TrendingUp} title="Project Efforts" right={
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{billableCount}/{efforts.length} billable · {totalLogged}h / {totalExpected}h</span>
          <span className="inline-flex items-center gap-1.5 rounded-lg flex-shrink-0" style={{ background: C.wash, border: `1px solid ${C.border}`, padding: '5px 11px', fontSize: 12, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap' }}>
            <CalendarClock size={13} style={{ color: C.indigo }} /> {applied.freq} · {monthLabel(applied.month)}
          </span>
        </div>
      }>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ minWidth: 780 }}>
            <div style={{ display: 'grid', gridTemplateColumns: ECOLS, gap: 12, padding: '11px 20px', borderBottom: `1px solid ${C.line}`, background: C.wash }}>
              {EHEAD.map(c => (
                <div key={c.h} style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, letterSpacing: 0.4, textTransform: 'uppercase', textAlign: c.align }}>{c.h}</div>
              ))}
            </div>
            {efforts.map((e: EffortRow, i) => {
              const variance = e.logged - e.expected
              const util = e.expected > 0 ? Math.round((e.logged / e.expected) * 100) : 0
              const barColor = util > 100 ? C.red : util >= 90 ? C.green : C.amber
              return (
                <div key={`${e.name}-${i}`} style={{ display: 'grid', gridTemplateColumns: ECOLS, gap: 12, alignItems: 'center', padding: '12px 20px', borderBottom: i < efforts.length - 1 ? `1px solid ${C.line}` : 'none', transition: 'background 0.14s' }}
                  onMouseEnter={ev => { ev.currentTarget.style.background = C.wash }} onMouseLeave={ev => { ev.currentTarget.style.background = 'transparent' }}>
                  <div className="min-w-0">
                    <div className="truncate" style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{e.name}</div>
                    <div className="truncate" style={{ fontSize: 11, color: C.faint }}>{e.role}</div>
                  </div>
                  <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: C.navy }}>{e.allocation}%</div>
                  <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: C.ink }}>{e.expected}h</div>
                  <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: C.ink }}>{e.logged}h</div>
                  <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: variance > 0 ? C.red : variance < 0 ? C.amber : C.muted }}>{variance > 0 ? '+' : ''}{variance}h</div>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="flex-1" style={{ height: 7, background: C.line, borderRadius: 999, overflow: 'hidden', minWidth: 48 }}>
                      <div style={{ width: `${Math.min(util, 100)}%`, height: '100%', background: barColor, borderRadius: 999 }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.navy, width: 40, textAlign: 'right', flexShrink: 0 }}>{util}%</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Badge text={e.billable ? 'Billable' : 'Non-bill.'} fg={e.billable ? C.green : C.muted} bg={e.billable ? 'rgba(22,163,74,0.10)' : C.wash} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Panel>
      </>
      )}
    </div>
  )
}
