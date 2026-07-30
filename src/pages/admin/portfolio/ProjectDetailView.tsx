import { useState } from 'react'
import {
  ArrowLeft, FolderKanban, Users, Gauge, ShieldAlert, Activity,
  ListChecks, AlertTriangle, CalendarClock, FileSpreadsheet, Eye, Download,
  Briefcase, TrendingUp, ChevronLeft, ChevronRight,
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

/* ── main ── */
export default function ProjectDetailView({ project, onBack }: { project: PortfolioProject; onBack: () => void }) {
  const d = getProjectDetail(project)
  const rs = RISK_STYLE[project.risk], hs = HEALTH_STYLE[project.health]

  // Project Efforts are viewable per month; default to the current month.
  const [monthOffset, setMonthOffset] = useState(0)
  const efforts = getProjectEfforts(project, monthOffset)

  const totalExpected = efforts.reduce((s, e) => s + e.expected, 0)
  const totalLogged = efforts.reduce((s, e) => s + e.logged, 0)
  const billableCount = efforts.filter(e => e.billable).length
  const reports = d.reports.slice(0, 5)

  const KPIS = [
    { Icon: Users,       label: 'Team Size',      value: String(project.teamCount), fg: C.indigo },
    { Icon: Gauge,       label: 'Utilization',    value: `${project.utilization}%`, fg: C.blue },
    { Icon: Briefcase,   label: 'Billable Util.', value: `${project.billable}%`,    fg: C.green },
    { Icon: ShieldAlert, label: 'Risk Level',     value: project.risk,              fg: rs.fg },
    { Icon: Activity,    label: 'Health',         value: hs.label,                  fg: hs.fg },
  ]

  const ECOLS = '1.5fr 1fr 1fr 1fr 1fr 1.4fr 1fr'
  const EHEAD: { h: string; align: 'left' | 'center' }[] = [
    { h: 'Employee', align: 'left' }, { h: 'Allocation', align: 'center' }, { h: 'Expected', align: 'center' },
    { h: 'Logged', align: 'center' }, { h: 'Variance', align: 'center' }, { h: 'Utilization', align: 'left' }, { h: 'Billing', align: 'center' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
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

      {/* Hero */}
      <div className="rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}`, overflow: 'hidden', marginBottom: 16 }}>
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

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 14, marginBottom: 16 }}>
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

      {/* Current Tasks (8) + Report History (4) — equal height */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'stretch', marginBottom: 16 }}>
        <div style={{ flex: '8 1 0', minWidth: 0, display: 'flex' }}>
          <Panel Icon={ListChecks} title="Current Tasks" right={<span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{d.tasks.length} tasks</span>} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              {d.tasks.map((t, i) => {
                const ts = TASK_STYLE[t.status]
                return (
                  <div key={i} className="flex items-center gap-3" style={{ padding: '13px 18px', borderBottom: i < d.tasks.length - 1 ? `1px solid ${C.line}` : 'none', transition: 'background 0.14s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                    <div className="min-w-0 flex-1">
                      <div className="truncate" style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{t.title}</div>
                      <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>Added {fmtDate(t.date)}</div>
                    </div>
                    <Badge text={t.status} fg={ts.fg} bg={ts.bg} dot />
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
                  <div key={r.period} className="flex items-center gap-3" style={{ padding: '13px 18px', borderBottom: i < reports.length - 1 ? `1px solid ${C.line}` : 'none', transition: 'background 0.14s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                    <div className="min-w-0 flex-1">
                      <div className="truncate" style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>{r.period}</div>
                      <div style={{ marginTop: 3, fontSize: 11, fontWeight: 600, color: C.green }}>{r.status}</div>
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
          <div className="flex items-center flex-shrink-0" style={{ border: `1px solid ${C.border}`, borderRadius: 9, overflow: 'hidden', height: 32, background: '#fff' }}>
            <button title="Previous month" onClick={() => setMonthOffset(o => Math.min(MAX_MONTHS_BACK, o + 1))} disabled={monthOffset >= MAX_MONTHS_BACK}
              className="inline-flex items-center justify-center" style={{ width: 30, height: '100%', border: 'none', borderRight: `1px solid ${C.line}`, background: 'transparent', color: monthOffset >= MAX_MONTHS_BACK ? '#C8CCE0' : C.muted, cursor: monthOffset >= MAX_MONTHS_BACK ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (monthOffset < MAX_MONTHS_BACK) { e.currentTarget.style.background = C.wash; e.currentTarget.style.color = C.indigo } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = monthOffset >= MAX_MONTHS_BACK ? '#C8CCE0' : C.muted }}>
              <ChevronLeft size={15} />
            </button>
            <span className="inline-flex items-center gap-1.5" style={{ padding: '0 12px', fontSize: 12.5, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap' }}>
              {monthLabel(monthOffset)}
              {monthOffset === 0 && <span className="rounded-full" style={{ fontSize: 10, fontWeight: 700, color: C.green, background: 'rgba(22,163,74,0.10)', padding: '2px 7px' }}>Current</span>}
            </span>
            <button title="Next month" onClick={() => setMonthOffset(o => Math.max(0, o - 1))} disabled={monthOffset === 0}
              className="inline-flex items-center justify-center" style={{ width: 30, height: '100%', border: 'none', borderLeft: `1px solid ${C.line}`, background: 'transparent', color: monthOffset === 0 ? '#C8CCE0' : C.muted, cursor: monthOffset === 0 ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (monthOffset > 0) { e.currentTarget.style.background = C.wash; e.currentTarget.style.color = C.indigo } }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = monthOffset === 0 ? '#C8CCE0' : C.muted }}>
              <ChevronRight size={15} />
            </button>
          </div>
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
    </div>
  )
}
