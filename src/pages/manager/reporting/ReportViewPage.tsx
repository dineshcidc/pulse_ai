import { useMemo, useState } from 'react'
import {
  ArrowLeft, Check, FileSpreadsheet,
  LayoutTemplate, BarChart3,
} from 'lucide-react'
import { sectionsForFrequency, sectionTitle } from './reportTemplate'
import { type ReportProject, type ReportPeriod, type Frequency } from './reportingData'
import EffortsReportPanel from './EffortsReportPanel'

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
  blue:   '#2563EB',
}

const FREQ_LABEL: Record<Frequency, string> = { Weekly: 'Weekly', Biweekly: 'Bi-weekly', Monthly: 'Monthly' }

/* The four sections shown (matches the Fill Report template order). */
const SECTION_ORDER = ['resources', 'tasks', 'risks', 'status'] as const

const ACCENT: Record<string, { fg: string; bg: string }> = {
  resources: { fg: C.indigo, bg: 'rgba(99,102,241,0.10)' },
  tasks:     { fg: C.blue,   bg: 'rgba(37,99,235,0.10)'  },
  risks:     { fg: C.amber,  bg: 'rgba(217,119,6,0.10)'  },
  status:    { fg: C.green,  bg: 'rgba(22,163,74,0.10)'  },
}

/* Dashed "join" lines that give the four cards a template / blueprint feel. */
const GRID_DASH = 'rgba(99,102,241,0.32)'

type Tab = 'template' | 'efforts'

/* ── dummy notepad content for the read-only view (dev team wires real data) ── */
function buildDummyReport(project: ReportProject, freq: Frequency): Record<string, string> {
  const health = project.health
  return {
    resources:
      `Team of ${project.team.length}, running at ~82% utilization this period.\n` +
      `Priya onboarded as QA lead; one contractor rolled off on 18 Jul. No critical resourcing gaps, though QA bandwidth is tight ahead of UAT.`,
    tasks:
      `Completed OAuth login integration and migrated the customer table to the new schema.\n` +
      `Shipped dashboard analytics v1 to staging.\n` +
      `In progress: checkout flow refinements and the reporting export module.`,
    risks:
      `Third-party API instability — vendor latency spikes during peak load. Added retry + caching and escalated to the vendor.\n` +
      `Delayed client sign-off — UAT feedback still pending; daily follow-ups scheduled with the client POC.`,
    status:
      `Overall ${FREQ_LABEL[freq]} status: ${health === 'Healthy' ? 'Healthy' : health}. ` +
      `Progress is around ${project.progress}%. Next period we will complete UAT and finalize the production-release checklist. No blockers requiring leadership action at this time.`,
  }
}

export default function ReportViewPage({
  project, freq, onBack,
}: { project: ReportProject; period: ReportPeriod; freq: Frequency; onBack: () => void }) {
  const all = sectionsForFrequency(freq)
  const sections = useMemo(
    () => SECTION_ORDER.map(id => all.find(s => s.id === id)).filter(Boolean) as typeof all,
    [all],
  )
  const data = useMemo(() => buildDummyReport(project, freq), [project, freq])
  const [tab, setTab] = useState<Tab>('template')

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 60, background: C.wash,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden',
      }}
    >
      {/* ─────────── Custom full-width header ─────────── */}
      <header
        style={{
          flexShrink: 0, background: C.panel, borderBottom: '1px solid #C7CBE6',
          display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
          gap: 16, padding: '12px 22px',
        }}
      >
        {/* Left — back + project identity + badges */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            title="Back to My Report Projects"
            className="rounded-xl flex items-center justify-center cursor-pointer flex-shrink-0"
            style={{ width: 40, height: 40, background: C.wash, border: `1px solid ${C.border}`, color: C.ink }}
            onMouseEnter={e => { e.currentTarget.style.background = '#EEF0F6' }}
            onMouseLeave={e => { e.currentTarget.style.background = C.wash }}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="truncate" style={{ fontSize: 17, fontWeight: 800, color: C.navy, lineHeight: 1.15 }}>{project.name}</h1>
            <p className="truncate" style={{ fontSize: 12, color: C.muted, marginTop: 6, maxWidth: 320 }}>{project.description}</p>
          </div>
        </div>

        {/* Center — tabs */}
        <div className="inline-flex rounded-xl" style={{ background: C.wash, border: `1px solid ${C.border}`, padding: 3, height: 42 }}>
          {([
            { id: 'template' as const, label: 'Report Template', Icon: LayoutTemplate },
            { id: 'efforts'  as const, label: 'Project Efforts', Icon: BarChart3 },
          ]).map(t => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="inline-flex items-center gap-2 rounded-lg border-none cursor-pointer"
                style={{
                  padding: '0 18px', fontSize: 13, fontWeight: active ? 700 : 600,
                  background: active ? C.panel : 'transparent',
                  color: active ? C.indigo : C.muted,
                  boxShadow: active ? '0 1px 3px rgba(28,32,53,0.10)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                <t.Icon size={15} /> {t.label}
              </button>
            )
          })}
        </div>

        {/* Right — download excel (icon only) */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => { /* mock — dev team wires Excel export */ }}
            title="Download Excel"
            aria-label="Download Excel"
            className="inline-flex items-center justify-center cursor-pointer flex-shrink-0 rounded-xl"
            style={{ width: 42, height: 42, background: 'rgba(22,163,74,0.10)', border: '1px solid rgba(22,163,74,0.25)', color: C.green }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(22,163,74,0.18)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(22,163,74,0.10)' }}
          >
            <FileSpreadsheet size={20} />
          </button>
        </div>
      </header>

      {/* ─────────── Body ─────────── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '20px 24px 24px', overflowY: tab === 'efforts' ? 'auto' : 'hidden' }}>
        {tab === 'template' ? (
          /* Dashed-frame template sheet — four read-only section cards */
          <div
            className="rounded-2xl"
            style={{ flex: 1, minHeight: 0, background: C.panel, border: `1.5px dashed ${GRID_DASH}`, overflow: 'hidden' }}
          >
            <div className="rv-grid" style={{ height: '100%' }}>
              {sections.map((s, i) => {
                const a = ACCENT[s.id] ?? { fg: C.indigo, bg: 'rgba(99,102,241,0.10)' }
                const val = data[s.id] || ''
                const words = val.trim() ? val.trim().split(/\s+/).length : 0
                const col = i % 2, row = i < 2 ? 0 : 1
                return (
                  <div
                    key={s.id}
                    className="rv-cell"
                    style={{
                      position: 'relative', padding: 18, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden',
                      background: C.panel,
                      borderRight: col === 0 ? `1.5px dashed ${GRID_DASH}` : 'none',
                      borderBottom: row === 0 ? `1.5px dashed ${GRID_DASH}` : 'none',
                    }}
                  >
                    {/* cell header */}
                    <div className="flex items-start gap-2.5" style={{ marginBottom: 12, flexShrink: 0 }}>
                      <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 38, height: 38, background: a.bg }}>
                        <s.Icon size={19} style={{ color: a.fg }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 style={{ fontSize: 14.5, fontWeight: 800, color: C.navy }}>{sectionTitle(s, freq)}</h3>
                        <p className="truncate" style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.description}</p>
                      </div>
                      <span
                        className="inline-flex items-center justify-center rounded-full flex-shrink-0"
                        title="Section completed"
                        style={{ width: 24, height: 24, background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.30)', color: C.green }}
                      >
                        <Check size={14} />
                      </span>
                    </div>

                    {/* read-only content — fills the cell, scrolls internally */}
                    <div
                      style={{
                        flex: 1, minHeight: 0, overflowY: 'auto',
                        background: '#FCFCFE', border: `1px solid ${C.border}`, borderRadius: 12,
                        padding: '13px 15px',
                      }}
                    >
                      {val
                        ? <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{val}</div>
                        : <span style={{ color: C.faint, fontSize: 13.5 }}>—</span>}
                    </div>

                    {/* footer */}
                    <div className="flex items-center justify-end" style={{ marginTop: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: C.faint, fontWeight: 600 }}>{words} word{words === 1 ? '' : 's'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* Project Efforts — same manager panel, read-only context */
          <EffortsReportPanel freq={freq} />
        )}
      </div>

      <style>{`
        .rv-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 0; }
      `}</style>
    </div>
  )
}
