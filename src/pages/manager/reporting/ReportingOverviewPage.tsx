import { useState } from 'react'
import {
  FolderKanban, Clock3, CheckCircle2, AlertTriangle,
  CalendarClock, ArrowRight, CalendarDays, ChevronDown,
} from 'lucide-react'
import {
  REPORT_PROJECTS, CURRENT_PM, CURRENT_PERIOD,
  getReportingKpis, daysFromToday, formatDate,
  type ReportProject, type ReportStatus, type Frequency,
} from './reportingData'

const C = {
  navy:   '#1C2035',
  ink:    '#2A2F45',
  muted:  '#8B90A7',
  faint:  '#AEB2C4',
  border: '#E8EAF2',
  line:   '#EEF0F6',
  panel:  '#FFFFFF',
  wash:   '#F6F7FB',
  indigo: '#6366F1',
  green:  '#16A34A',
  amber:  '#D97706',
  red:    '#E11D48',
  blue:   '#2563EB',
}

const STATUS_STYLE: Record<ReportStatus, { fg: string; bg: string; label: string }> = {
  'Submitted':   { fg: C.green,   bg: 'rgba(22,163,74,0.10)',    label: 'Submitted'   },
  'Draft':       { fg: C.amber,   bg: 'rgba(217,119,6,0.10)',    label: 'Draft'       },
  'Not Started': { fg: '#64748B', bg: 'rgba(100,116,139,0.10)',  label: 'Not Started' },
  'Overdue':     { fg: C.red,     bg: 'rgba(225,29,72,0.10)',    label: 'Overdue'     },
}

/* ── small building blocks ── */

function StatusPill({ status }: { status: ReportStatus }) {
  const s = STATUS_STYLE[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full"
      style={{ background: s.bg, color: s.fg, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}
    >
      <span className="rounded-full" style={{ width: 6, height: 6, background: s.fg }} />
      {s.label}
    </span>
  )
}

function FreqBadge({ freq }: { freq: string }) {
  return (
    <span
      className="inline-flex items-center rounded-md"
      style={{ background: C.wash, color: C.muted, padding: '3px 9px', fontSize: 11.5, fontWeight: 600, border: `1px solid ${C.border}` }}
    >
      {freq}
    </span>
  )
}

function DueChip({ iso }: { iso: string }) {
  const d = daysFromToday(iso)
  let fg = C.muted, bg = C.wash, text = `in ${d} days`
  if (d < 0)        { fg = C.red;   bg = 'rgba(225,29,72,0.10)'; text = `${Math.abs(d)}d overdue` }
  else if (d === 0) { fg = C.amber; bg = 'rgba(217,119,6,0.10)'; text = 'Due today' }
  else if (d === 1) { fg = C.amber; bg = 'rgba(217,119,6,0.10)'; text = 'Due tomorrow' }
  else if (d <= 3)  { fg = C.amber; bg = 'rgba(217,119,6,0.10)'; text = `in ${d} days` }
  return (
    <span className="inline-flex items-center rounded-md" style={{ background: bg, color: fg, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>
      {text}
    </span>
  )
}

/* Compact KPI — small height, value-forward */
function Kpi({
  Icon, label, value, fg, bg,
}: { Icon: React.ElementType; label: string; value: number | string; fg: string; bg: string }) {
  return (
    <div
      className="rounded-2xl flex items-center gap-3"
      style={{ background: C.panel, border: `1px solid ${C.border}`, padding: '14px 16px' }}
    >
      <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 38, height: 38, background: bg }}>
        <Icon size={19} strokeWidth={2} style={{ color: fg }} />
      </div>
      <div className="min-w-0">
        <div style={{ fontSize: 24, fontWeight: 800, color: C.navy, lineHeight: 1.05 }}>{value}</div>
        <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}>{label}</div>
      </div>
    </div>
  )
}

/* ── main page ── */

export default function ReportingOverviewPage({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const kpi = getReportingKpis(REPORT_PROJECTS)
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [freqFilter, setFreqFilter] = useState<string>('all')

  const freqOptions: Frequency[] = ['Weekly', 'Biweekly', 'Monthly']

  // Deadlines = everything not yet submitted, soonest first
  const pending: ReportProject[] = REPORT_PROJECTS
    .filter(p => p.status !== 'Submitted')
    .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())

  const deadlines = pending
    .filter(p => projectFilter === 'all' || p.id === projectFilter)
    .filter(p => freqFilter === 'all' || p.frequency === freqFilter)

  const overdueProjects = REPORT_PROJECTS.filter(p => p.status === 'Overdue')

  const COLS = '2.5fr 1fr 1.5fr 1fr 130px'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Heading */}
      <div className="mb-5 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.navy }}>Reporting Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: C.muted }}>
            Welcome back, {CURRENT_PM.name}. Here's your reporting status at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Current reporting period anchor (light blue) */}
          <div
            className="inline-flex items-center gap-2 rounded-xl"
            style={{ height: 38, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.22)', padding: '0 13px' }}
          >
            <CalendarDays size={15} style={{ color: C.indigo }} />
            <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Current period</span>
            <span style={{ fontSize: 12.5, color: C.navy, fontWeight: 700 }}>{CURRENT_PERIOD.label} · {CURRENT_PERIOD.range}</span>
          </div>
        </div>
      </div>

      {/* Compact KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 14 }}>
        <Kpi Icon={FolderKanban}  label="My Projects"     value={kpi.total}     fg={C.indigo} bg="rgba(99,102,241,0.10)" />
        <Kpi Icon={Clock3}        label="Pending Reports" value={kpi.pending}   fg={C.amber}  bg="rgba(217,119,6,0.10)" />
        <Kpi Icon={CheckCircle2}  label="Submitted"       value={kpi.submitted} fg={C.green}  bg="rgba(22,163,74,0.10)" />
        <Kpi Icon={AlertTriangle} label="Overdue"         value={kpi.overdue}   fg={C.red}    bg="rgba(225,29,72,0.10)" />
      </div>

      {/* Overdue alert strip — only when something is overdue */}
      {overdueProjects.length > 0 && (
        <div
          className="rounded-xl mt-4 flex items-center gap-3 flex-wrap"
          style={{ background: 'rgba(225,29,72,0.07)', border: '1px solid rgba(225,29,72,0.22)', padding: '12px 16px' }}
        >
          <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(225,29,72,0.12)' }}>
            <AlertTriangle size={17} style={{ color: C.red }} />
          </div>
          <div className="flex-1 min-w-0">
            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.red }}>
              {overdueProjects.length} report{overdueProjects.length > 1 ? 's' : ''} overdue
            </span>
            <span style={{ fontSize: 13, color: C.ink }}> — {overdueProjects.map(p => p.name).join(', ')} need{overdueProjects.length > 1 ? '' : 's'} immediate attention.</span>
          </div>
          <button
            onClick={() => setProjectFilter(overdueProjects[0].id)}
            className="inline-flex items-center gap-1 rounded-lg cursor-pointer flex-shrink-0"
            style={{ background: C.red, color: '#fff', border: 'none', padding: '8px 13px', fontSize: 12.5, fontWeight: 600 }}
          >
            Fill now <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* Full-width Upcoming Reporting Deadlines */}
      <div className="rounded-2xl mt-5" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        {/* Panel header */}
        <div className="flex items-center justify-between flex-wrap gap-3" style={{ padding: '16px 18px', borderBottom: `1px solid ${C.line}` }}>
          <div className="flex items-center gap-2">
            <CalendarClock size={18} style={{ color: C.indigo }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Upcoming Reporting Deadlines</span>
            <span
              className="rounded-full"
              style={{ background: C.wash, color: C.muted, fontSize: 12, fontWeight: 700, padding: '2px 9px', border: `1px solid ${C.border}` }}
            >
              {deadlines.length}
            </span>
          </div>

          {/* Filters — by project & by frequency */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <select
                value={projectFilter}
                onChange={e => setProjectFilter(e.target.value)}
                className="cursor-pointer appearance-none"
                style={{
                  background: C.wash, color: C.ink, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '8px 34px 8px 12px', fontSize: 13, fontWeight: 600,
                  fontFamily: 'inherit', outline: 'none', minWidth: 200,
                }}
              >
                <option value="all">All Projects</option>
                {pending.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <ChevronDown size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            </div>
            <div className="relative">
              <select
                value={freqFilter}
                onChange={e => setFreqFilter(e.target.value)}
                className="cursor-pointer appearance-none"
                style={{
                  background: C.wash, color: C.ink, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '8px 34px 8px 12px', fontSize: 13, fontWeight: 600,
                  fontFamily: 'inherit', outline: 'none', minWidth: 150,
                }}
              >
                <option value="all">All Frequencies</option>
                {freqOptions.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              <ChevronDown size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* Column header */}
        <div
          style={{
            display: 'grid', gridTemplateColumns: COLS, gap: 12, alignItems: 'center',
            padding: '10px 18px', borderBottom: `1px solid ${C.line}`, background: C.wash,
          }}
        >
          {[
            { h: 'Project',   align: 'left'  as const, padLeft: 44 },
            { h: 'Frequency', align: 'left'  as const, padLeft: 0  },
            { h: 'Next Due',  align: 'left'  as const, padLeft: 0  },
            { h: 'Status',    align: 'left'  as const, padLeft: 0  },
            { h: 'Action',    align: 'right' as const, padLeft: 0  },
          ].map(c => (
            <div key={c.h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: 0.4, textTransform: 'uppercase', textAlign: c.align, paddingLeft: c.padLeft, whiteSpace: 'nowrap' }}>
              {c.h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {deadlines.length === 0 ? (
          <div style={{ padding: '40px 18px', textAlign: 'center', color: C.muted, fontSize: 13 }}>
            No pending reports for this project. 🎉
          </div>
        ) : (
          deadlines.map((p, i) => (
            <div
              key={p.id}
              style={{
                display: 'grid', gridTemplateColumns: COLS, gap: 12, alignItems: 'center',
                padding: '13px 18px', borderBottom: i < deadlines.length - 1 ? `1px solid ${C.line}` : 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.wash }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              {/* Project */}
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, background: C.wash }}>
                  <FolderKanban size={16} style={{ color: C.muted }} />
                </div>
                <div className="min-w-0">
                  <div className="truncate" style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{p.name}</div>
                  <div className="truncate" style={{ fontSize: 11.5, color: C.faint }}>{p.period}</div>
                </div>
              </div>

              {/* Frequency */}
              <div><FreqBadge freq={i === 1 ? 'Bi-weekly' : (p.frequency === 'Biweekly' ? 'Bi-weekly' : p.frequency)} /></div>

              {/* Next Due */}
              <div className="min-w-0">
                <div style={{ fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{formatDate(p.nextDue)}</div>
                <div style={{ marginTop: 5 }}><DueChip iso={p.nextDue} /></div>
              </div>

              {/* Status */}
              <div><StatusPill status={p.status} /></div>

              {/* Action */}
              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={() => onNavigate?.('my-report-projects')}
                  className="inline-flex items-center gap-1 rounded-lg cursor-pointer"
                  style={{
                    background: C.wash, color: C.navy, border: `1px solid ${C.border}`,
                    padding: '7px 12px', fontSize: 12.5, fontWeight: 600, transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#EEF0F6'; e.currentTarget.style.borderColor = '#D5D9EA' }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.wash; e.currentTarget.style.borderColor = C.border }}
                >
                  {p.status === 'Draft' ? 'Continue' : 'Fill Report'} <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
