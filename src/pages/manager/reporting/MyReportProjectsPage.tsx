import { useState } from 'react'
import {
  FolderKanban, CalendarDays, CalendarRange, ArrowRight, FileEdit, Eye, Download,
  CheckCircle2, AlertTriangle, Circle, Layers, Clock3, Lock,
} from 'lucide-react'
import {
  REPORT_PROJECTS, generateTimeline, formatDate, daysFromToday,
  type ReportProject, type Frequency, type ReportPeriod, type TimelineStatus,
} from './reportingData'
import ReportFormPage from './ReportFormPage'
import ReportViewPage from './ReportViewPage'

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
}

const TABS: Frequency[] = ['Weekly', 'Biweekly', 'Monthly']
const TAB_LABEL: Record<Frequency, string> = { Weekly: 'Weekly', Biweekly: 'Bi-weekly', Monthly: 'Monthly' }

/* ── status node styling for timeline rows ── */
const NODE: Record<TimelineStatus, { fg: string; bg: string; Icon: React.ElementType }> = {
  Submitted: { fg: C.green,   bg: 'rgba(22,163,74,0.10)',   Icon: CheckCircle2 },
  Overdue:   { fg: C.red,     bg: 'rgba(225,29,72,0.10)',   Icon: AlertTriangle },
  Due:       { fg: C.indigo,  bg: 'rgba(99,102,241,0.12)',  Icon: FileEdit },
  Draft:     { fg: C.amber,   bg: 'rgba(217,119,6,0.10)',   Icon: FileEdit },
  Upcoming:  { fg: C.faint,   bg: C.wash,                   Icon: Circle },
}

/* ── main page ── */
// Same 4 projects surfaced on the Reporting Dashboard (the ones needing reports).
const MY_PROJECTS = REPORT_PROJECTS.filter(p => p.status !== 'Submitted')

export default function MyReportProjectsPage() {
  const [selectedId, setSelectedId] = useState<string>(MY_PROJECTS[0].id)
  const project = MY_PROJECTS.find(p => p.id === selectedId)!
  const [activeTab, setActiveTab] = useState<Frequency>(MY_PROJECTS[0].frequencies[0])
  const [openReport, setOpenReport] = useState<{ period: ReportPeriod; mode: 'edit' | 'view' } | null>(null)

  function selectProject(id: string) {
    const p = MY_PROJECTS.find(x => x.id === id)!
    setSelectedId(id)
    setActiveTab(p.frequencies[0])
    setOpenReport(null)
  }

  if (openReport) {
    const common = { project, period: openReport.period, freq: activeTab, onBack: () => setOpenReport(null) }
    return openReport.mode === 'view' ? <ReportViewPage {...common} /> : <ReportFormPage {...common} />
  }

  const tabEnabled = project.frequencies.includes(activeTab)
  const timeline = tabEnabled ? generateTimeline(activeTab, project.reportSeed) : []
  const current = timeline.find(t => t.status === 'Due' || t.status === 'Draft')
  const upcoming = timeline.filter(t => t.status === 'Upcoming')
  const previous = timeline.filter(t => t.status === 'Submitted' || t.status === 'Overdue').reverse()

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Heading */}
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: C.navy }}>My Report Projects</h1>
        <p className="text-sm mt-0.5" style={{ color: C.muted }}>
          Select a project, choose a reporting cadence, and fill the report for the current period.
        </p>
      </div>

      {/* Two-card 3 : 9 layout with gap */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 9fr', gap: 16, alignItems: 'start' }}>
        {/* ── Left card : project list (sticky, fits content) ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: C.panel, border: `1px solid ${C.border}`, position: 'sticky', top: 0, alignSelf: 'start' }}
        >
          <div style={{ padding: '16px 16px 10px' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, letterSpacing: 0.2 }}>My Projects</span>
          </div>
          <div style={{ padding: '0 8px 12px' }}>
            {MY_PROJECTS.map(p => {
              const active = p.id === selectedId
              return (
                <button
                  key={p.id}
                  onClick={() => selectProject(p.id)}
                  className="relative w-full flex items-center gap-2.5 rounded-xl cursor-pointer border-none text-left"
                  style={{
                    height: 46, padding: '0 12px', marginBottom: 2,
                    background: active ? 'rgba(99,102,241,0.10)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.wash }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                >
                  {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full" style={{ width: 3, height: 22, background: C.indigo }} />}
                  <FolderKanban size={16} style={{ color: active ? C.indigo : C.muted, flexShrink: 0 }} />
                  <span className="truncate" style={{ fontSize: 13.5, fontWeight: active ? 700 : 500, color: active ? C.navy : C.ink }}>
                    {p.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Right card : detail ── */}
        <div className="rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}`, padding: 22 }}>
          {/* Title (full width) */}
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.navy }}>{project.name}</h2>

          {/* Description (full width) */}
          <p style={{ fontSize: 13, color: C.muted, marginTop: 4, lineHeight: 1.55 }}>{project.description}</p>

          {/* Tech stack (full width) */}
          <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 12 }}>
            <span className="inline-flex items-center gap-1.5" style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>
              <Layers size={13} /> Tech Stack:
            </span>
            {project.techStack.map(t => (
              <span key={t} className="rounded-md" style={{ background: C.wash, border: `1px solid ${C.border}`, color: C.ink, padding: '4px 9px', fontSize: 11.5, fontWeight: 600 }}>{t}</span>
            ))}
          </div>

          {/* divider between profile and reporting controls */}
          <div style={{ height: 1, background: C.line, margin: '16px 0' }} />

          {/* Tabs (left) + duration calendar (right) */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* cadence tabs */}
            <div className="inline-flex rounded-xl" style={{ height: 38, background: C.wash, border: `1px solid ${C.border}`, padding: 3 }}>
              {TABS.map(t => {
                const enabled = project.frequencies.includes(t)
                const active = t === activeTab
                return (
                  <button
                    key={t}
                    disabled={!enabled}
                    onClick={() => enabled && setActiveTab(t)}
                    title={!enabled ? 'Not configured for this project' : undefined}
                    className="inline-flex items-center gap-1.5 rounded-lg border-none"
                    style={{
                      height: 30, padding: '0 14px', fontSize: 12.5, fontWeight: active ? 700 : 600,
                      cursor: enabled ? 'pointer' : 'not-allowed',
                      background: active ? 'rgba(99,102,241,0.14)' : 'transparent',
                      color: active ? C.indigo : enabled ? C.muted : '#C7CBDA',
                    }}
                  >
                    {!enabled && <Lock size={11} />} {TAB_LABEL[t]}
                  </button>
                )
              })}
            </div>

            {/* project duration + period picker */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg" style={{ height: 38, background: C.wash, border: `1px solid ${C.border}`, padding: '0 11px', fontSize: 12, color: C.ink, fontWeight: 600 }}>
                <CalendarDays size={13} style={{ color: C.indigo }} />
                {formatDate(project.durationStart)} – {formatDate(project.durationEnd)}
              </span>
              <button
                title="Select a previous period"
                className="inline-flex items-center justify-center rounded-lg cursor-pointer"
                style={{ width: 38, height: 38, background: C.wash, border: `1px solid ${C.border}`, color: C.ink }}
                onMouseEnter={e => { e.currentTarget.style.background = '#EEF0F6' }}
                onMouseLeave={e => { e.currentTarget.style.background = C.wash }}
              >
                <CalendarRange size={16} style={{ color: C.indigo }} />
              </button>
            </div>
          </div>

          <div style={{ height: 16 }} />

          {/* Timeline body */}
          {!tabEnabled ? (
            <div className="flex flex-col items-center justify-center text-center" style={{ minHeight: 220 }}>
              <Lock size={26} style={{ color: C.faint }} />
              <p style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, marginTop: 10 }}>{TAB_LABEL[activeTab]} reporting isn't configured for this project</p>
              <p style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>The Admin has enabled: {project.frequencies.map(f => TAB_LABEL[f]).join(', ')}.</p>
            </div>
          ) : (
            <>
              {/* Current reporting period */}
              {current && <CurrentPeriodCard period={current} onFill={() => setOpenReport({ period: current, mode: 'edit' })} />}

              {/* Upcoming */}
              {upcoming.length > 0 && (
                <>
                  <SectionLabel>Upcoming</SectionLabel>
                  {upcoming.map(u => (
                    <TimelineRow key={u.id} period={u} />
                  ))}
                </>
              )}

              {/* Previous */}
              <SectionLabel>Previous Reports</SectionLabel>
              {previous.length === 0 ? (
                <p style={{ fontSize: 12.5, color: C.muted, padding: '4px 2px' }}>No previous reports yet.</p>
              ) : (
                previous.map(pv => (
                  <TimelineRow
                    key={pv.id}
                    period={pv}
                    onView={() => setOpenReport({ period: pv, mode: 'view' })}
                    onFill={() => setOpenReport({ period: pv, mode: 'edit' })}
                    onDownload={() => { /* mock — dev team wires PDF export */ }}
                  />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── sub-components ── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, letterSpacing: 0.5, textTransform: 'uppercase', margin: '18px 0 10px' }}>
      {children}
    </div>
  )
}

function CurrentPeriodCard({ period, onFill }: { period: ReportPeriod; onFill: () => void }) {
  const isDraft = period.status === 'Draft'
  const accent = isDraft ? C.amber : C.indigo
  const tint = isDraft ? 'rgba(217,119,6,0.06)' : 'rgba(99,102,241,0.06)'
  const d = daysFromToday(period.dueDate)
  const dueText = d < 0 ? `${Math.abs(d)} days overdue` : d === 0 ? 'Due today' : d === 1 ? 'Due tomorrow' : `Due in ${d} days`

  return (
    <div className="rounded-xl flex items-center justify-between gap-4 flex-wrap" style={{ background: tint, border: `1px solid ${isDraft ? 'rgba(217,119,6,0.22)' : 'rgba(99,102,241,0.22)'}`, padding: '16px 18px' }}>
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, background: C.panel, border: `1px solid ${isDraft ? 'rgba(217,119,6,0.25)' : 'rgba(99,102,241,0.25)'}` }}>
          <FileEdit size={20} style={{ color: accent }} />
        </div>
        <div className="min-w-0">
          <div style={{ fontSize: 10.5, fontWeight: 700, color: accent, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Current reporting period{isDraft ? ' · Draft saved' : ''}
          </div>
          <div style={{ fontSize: 15.5, fontWeight: 800, color: C.navy, marginTop: 2 }}>{period.label}</div>
          <div style={{ fontSize: 12.5, color: C.muted }}>{period.sub} · <b style={{ color: accent }}>{dueText}</b></div>
        </div>
      </div>
      <button
        onClick={onFill}
        className="inline-flex items-center gap-1.5 rounded-lg cursor-pointer flex-shrink-0"
        style={{ height: 40, background: accent, color: '#fff', border: 'none', padding: '0 18px', fontSize: 13.5, fontWeight: 700 }}
      >
        {isDraft ? 'Continue Draft' : 'Fill Report'} <ArrowRight size={15} />
      </button>
    </div>
  )
}

function TimelineRow({ period, onView, onFill, onDownload }: { period: ReportPeriod; onView?: () => void; onFill?: () => void; onDownload?: () => void }) {
  const n = NODE[period.status]
  const isUpcoming = period.status === 'Upcoming'
  const isOverdue = period.status === 'Overdue'

  const meta = period.status === 'Submitted'
    ? `Submitted on ${formatDate(period.submittedOn!)}`
    : isOverdue
    ? `Missed · was due ${formatDate(period.dueDate)}`
    : `Opens after current period · due ${formatDate(period.dueDate)}`

  return (
    <div
      className="flex items-center gap-3 rounded-xl"
      style={{ padding: '11px 14px', border: `1px solid ${C.line}`, background: isUpcoming ? '#FCFCFE' : C.panel, marginBottom: 8 }}
    >
      <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32, background: n.bg }}>
        <n.Icon size={16} style={{ color: n.fg }} />
      </div>
      <div className="min-w-0 flex-1">
        <div style={{ fontSize: 13, fontWeight: 700, color: isUpcoming ? C.muted : C.navy }}>
          {period.label} <span style={{ fontWeight: 500, color: C.faint }}>· {period.sub}</span>
        </div>
        <div style={{ fontSize: 11.5, color: isOverdue ? C.red : C.muted, marginTop: 1, fontWeight: isOverdue ? 600 : 400 }}>{meta}</div>
      </div>
      {period.status === 'Submitted' && (
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={onView} title="View report" className="inline-flex items-center gap-1.5 rounded-lg cursor-pointer"
            style={{ height: 32, background: C.wash, color: C.navy, border: `1px solid ${C.border}`, padding: '0 12px', fontSize: 12, fontWeight: 600 }}>
            <Eye size={13} /> View
          </button>
          <button onClick={onDownload} title="Download PDF" className="rounded-lg flex items-center justify-center cursor-pointer"
            style={{ width: 32, height: 32, background: C.wash, color: C.muted, border: `1px solid ${C.border}` }}
            onMouseEnter={e => { e.currentTarget.style.color = C.indigo }}
            onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
            <Download size={14} />
          </button>
        </div>
      )}
      {isOverdue && (
        <button onClick={onFill} className="inline-flex items-center gap-1.5 rounded-lg cursor-pointer flex-shrink-0"
          style={{ height: 32, background: C.red, color: '#fff', border: 'none', padding: '0 12px', fontSize: 12, fontWeight: 600 }}>
          <ArrowRight size={13} /> Fill now
        </button>
      )}
      {isUpcoming && (
        <span className="inline-flex items-center gap-1.5 flex-shrink-0" style={{ color: C.faint, fontSize: 11.5, fontWeight: 600, paddingRight: 4 }}>
          <Clock3 size={13} /> Upcoming
        </span>
      )}
    </div>
  )
}
