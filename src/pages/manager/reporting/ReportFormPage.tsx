import { useMemo, useState } from 'react'
import {
  ArrowLeft, CalendarDays, Save, Send, Check, CheckCircle2, Loader2,
  LayoutTemplate, BarChart3, GripVertical,
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
  red:    '#E11D48',
}

const FREQ_LABEL: Record<Frequency, string> = { Weekly: 'Weekly', Biweekly: 'Bi-weekly', Monthly: 'Monthly' }

/* The four sections the manager fills, in the order the BA specified.
   (The old "Overview" section is intentionally dropped.) */
const SECTION_ORDER = ['resources', 'tasks', 'risks', 'status'] as const

/* Per-section accent so each notepad is scannable while the sheet stays cohesive. */
const ACCENT: Record<string, { fg: string; bg: string }> = {
  resources: { fg: C.indigo, bg: 'rgba(99,102,241,0.10)' },
  tasks:     { fg: C.blue,   bg: 'rgba(37,99,235,0.10)'  },
  risks:     { fg: C.amber,  bg: 'rgba(217,119,6,0.10)'  },
  status:    { fg: C.green,  bg: 'rgba(22,163,74,0.10)'  },
}

/* Dashed "join" lines that give the four cards a template / blueprint feel. */
const GRID_DASH = 'rgba(99,102,241,0.32)'

/* Health statuses selectable on the Risks & Issues card. */
const HEALTH_STATUSES = [
  { key: 'On Track',            fg: C.green, bg: 'rgba(22,163,74,0.10)' },
  { key: 'At Risk',             fg: C.amber, bg: 'rgba(217,119,6,0.10)' },
  { key: 'Critical / Off Track', fg: C.red,  bg: 'rgba(225,29,72,0.10)' },
] as const

type Tab = 'template' | 'efforts'

export default function ReportFormPage({
  project, period, freq, onBack,
}: { project: ReportProject; period: ReportPeriod; freq: Frequency; onBack: () => void }) {
  // Reduce the shared template to the four notepad sections, in the BA's order.
  const all = sectionsForFrequency(freq)
  const sections = useMemo(
    () => SECTION_ORDER.map(id => all.find(s => s.id === id)).filter(Boolean) as typeof all,
    [all],
  )

  // Card placement is user-reorderable via drag & drop.
  const [order, setOrder] = useState<string[]>(() => sections.map(s => s.id))
  const orderedSections = useMemo(
    () => order.map(id => sections.find(s => s.id === id)).filter(Boolean) as typeof sections,
    [order, sections],
  )
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  function moveCard(targetId: string) {
    if (!dragId || dragId === targetId) return
    setOrder(prev => {
      const arr = [...prev]
      const from = arr.indexOf(dragId)
      const to = arr.indexOf(targetId)
      if (from === -1 || to === -1) return prev
      arr.splice(from, 1)
      arr.splice(to, 0, dragId)
      return arr
    })
  }

  const [tab, setTab] = useState<Tab>('template')
  const [data, setData] = useState<Record<string, string>>(() =>
    Object.fromEntries(sections.map(s => [s.id, ''])))
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [healthStatus, setHealthStatus] = useState<string | null>(null)

  function setVal(id: string, v: string) {
    setData(prev => ({ ...prev, [id]: v }))
    setSavedAt(null)
  }
  function saveDraft() { setSavedAt('just now') }
  function submitReport() {
    if (submitting) return
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setShowConfirm(true) }, 1600)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 60, background: C.wash,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden',
      }}
    >
      {/* ─────────── Custom full-width header (replaces sidebar + app header) ─────────── */}
      <header
        style={{
          flexShrink: 0, background: C.panel, borderBottom: '1px solid #C7CBE6',
          display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
          gap: 16, padding: '12px 22px',
        }}
      >
        {/* Left — back + project identity + period badge */}
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
            <div className="flex items-center gap-2.5 min-w-0">
              <h1 className="truncate" style={{ fontSize: 17, fontWeight: 800, color: C.navy, lineHeight: 1.15 }}>{project.name}</h1>
              <span
                className="inline-flex items-center gap-1.5 rounded-full flex-shrink-0"
                style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.22)', color: C.indigo, padding: '3px 10px', fontSize: 11.5, fontWeight: 700 }}
              >
                <CalendarDays size={12} /> {FREQ_LABEL[freq]}
              </span>
            </div>
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

        {/* Right — draft indicator + actions */}
        <div className="flex items-center justify-end gap-2.5">
          {savedAt && (
            <span className="inline-flex items-center gap-1.5 flex-shrink-0" style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>
              <CheckCircle2 size={14} /> Draft saved {savedAt}
            </span>
          )}
          <button
            onClick={saveDraft}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded-xl cursor-pointer flex-shrink-0"
            style={{ height: 42, background: C.wash, color: C.navy, border: `1px solid ${C.border}`, padding: '0 16px', fontSize: 13, fontWeight: 600 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#EEF0F6' }}
            onMouseLeave={e => { e.currentTarget.style.background = C.wash }}
          >
            <Save size={15} /> Save as Draft
          </button>
          <button
            onClick={submitReport}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl flex-shrink-0"
            style={{ height: 42, background: C.indigo, color: '#fff', border: 'none', padding: '0 18px', fontSize: 13, fontWeight: 700, cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.9 : 1 }}
          >
            {submitting
              ? <><Loader2 size={15} className="rf-spin" /> Submitting…</>
              : <><Send size={15} /> Submit</>}
          </button>
        </div>
      </header>

      {/* ─────────── Body — fixed height, fills the viewport, no page scroll ─────────── */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', padding: '20px 24px 24px', overflowY: tab === 'efforts' ? 'auto' : 'hidden' }}>
        {tab === 'template' ? (
          /* Dashed-frame template sheet — four draggable, reorderable section cards */
          <div
            className="rounded-2xl"
            style={{ flex: 1, minHeight: 0, background: C.panel, border: `1.5px dashed ${GRID_DASH}`, overflow: 'hidden' }}
          >
            {/* 2×2 grid — dashed "join" lines make it read as one template */}
            <div className="rf-grid" style={{ height: '100%' }}>
              {orderedSections.map((s, i) => {
                const a = ACCENT[s.id] ?? { fg: C.indigo, bg: 'rgba(99,102,241,0.10)' }
                const val = data[s.id] || ''
                const filled = val.trim() !== ''
                const words = val.trim() ? val.trim().split(/\s+/).length : 0
                const required = s.fields[0]?.required
                const col = i % 2, row = i < 2 ? 0 : 1
                const isDragging = dragId === s.id
                const isOver = overId === s.id && dragId !== null && dragId !== s.id
                return (
                  <div
                    key={s.id}
                    className="rf-cell"
                    onDragOver={e => { e.preventDefault(); if (overId !== s.id) setOverId(s.id) }}
                    onDragLeave={() => setOverId(prev => (prev === s.id ? null : prev))}
                    onDrop={e => { e.preventDefault(); moveCard(s.id); setDragId(null); setOverId(null) }}
                    style={{
                      position: 'relative', padding: 18, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden',
                      background: isOver ? 'rgba(99,102,241,0.06)' : C.panel,
                      borderRight: col === 0 ? `1.5px dashed ${GRID_DASH}` : 'none',
                      borderBottom: row === 0 ? `1.5px dashed ${GRID_DASH}` : 'none',
                      boxShadow: isOver ? `inset 0 0 0 1.5px ${C.indigo}` : 'none',
                      opacity: isDragging ? 0.5 : 1,
                      transition: 'background 0.15s, opacity 0.15s',
                    }}
                  >
                    {/* cell header — this row is the drag handle */}
                    <div
                      className="flex items-start gap-2.5"
                      draggable
                      onDragStart={() => setDragId(s.id)}
                      onDragEnd={() => { setDragId(null); setOverId(null) }}
                      title="Drag to rearrange"
                      style={{ marginBottom: 12, flexShrink: 0, cursor: 'grab' }}
                    >
                      <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 38, height: 38, background: a.bg }}>
                        <s.Icon size={19} style={{ color: a.fg }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 style={{ fontSize: 14.5, fontWeight: 800, color: C.navy }}>{sectionTitle(s, freq)}</h3>
                          {required && <span title="Required" style={{ color: C.red, fontSize: 15, fontWeight: 800, lineHeight: 1 }}>*</span>}
                        </div>
                        <p className="truncate" style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.description}</p>
                      </div>
                      {filled && (
                        <span
                          className="inline-flex items-center justify-center rounded-full flex-shrink-0"
                          title="Section filled"
                          style={{ width: 24, height: 24, background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.30)', color: C.green }}
                        >
                          <Check size={14} />
                        </span>
                      )}
                      <span className="inline-flex items-center flex-shrink-0" title="Drag to rearrange" style={{ color: C.faint, marginTop: 2 }}>
                        <GripVertical size={16} />
                      </span>
                    </div>

                    {/* Risks & Issues — pick a health status before writing details */}
                    {s.id === 'risks' && (
                      <div style={{ flexShrink: 0, marginBottom: 12 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.ink, marginBottom: 8, lineHeight: 1.4 }}>
                          Select Health Status For Your Projects
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {HEALTH_STATUSES.map(r => {
                            const active = healthStatus === r.key
                            return (
                              <button
                                key={r.key}
                                type="button"
                                onClick={() => setHealthStatus(r.key)}
                                className="inline-flex items-center gap-1.5 rounded-full cursor-pointer"
                                style={{
                                  padding: '5px 12px', fontSize: 12, fontWeight: 700, transition: 'all 0.15s',
                                  border: `1px solid ${active ? r.fg : C.border}`,
                                  background: active ? r.bg : C.panel,
                                  color: active ? r.fg : C.muted,
                                }}
                              >
                                <span className="rounded-full" style={{ width: 7, height: 7, background: r.fg }} />
                                {r.key}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {/* notepad — fills the cell, scrolls internally */}
                    <textarea
                      value={val}
                      onChange={e => setVal(s.id, e.target.value)}
                      placeholder={s.fields[0]?.placeholder}
                      className="rf-textarea"
                      style={{
                        flex: 1, minHeight: 0, width: '100%', resize: 'none', overflowY: 'auto',
                        background: '#FCFCFE', border: `1px solid ${C.border}`, borderRadius: 12,
                        padding: '13px 15px', fontSize: 13.5, color: C.ink, fontFamily: 'inherit',
                        outline: 'none', lineHeight: 1.6,
                      }}
                      onFocus={e => { e.currentTarget.style.borderColor = a.fg; e.currentTarget.style.background = '#fff' }}
                      onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#FCFCFE' }}
                    />

                    {/* cell footer (fixed) */}
                    <div className="flex items-center justify-end" style={{ marginTop: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: C.faint, fontWeight: 600 }}>{words} word{words === 1 ? '' : 's'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* Project Efforts — manager-only, simplified effort/utilization report */
          <EffortsReportPanel freq={freq} />
        )}
      </div>

      {/* submit confirmation popup */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 22, padding: '34px 32px 28px', width: 410, textAlign: 'center', boxShadow: '0 24px 64px rgba(10,12,28,0.22)' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(22,163,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <CheckCircle2 size={38} style={{ color: C.green }} />
            </div>
            <div style={{ fontSize: 19, fontWeight: 800, color: C.navy }}>Report Submitted</div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.55, marginTop: 8 }}>
              Your <b style={{ color: C.ink }}>{FREQ_LABEL[freq]}</b> report for <b style={{ color: C.ink }}>{project.name}</b> ({period.label}) has been submitted successfully and is now available to the Portfolio Dashboard.
            </p>
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl cursor-pointer"
              style={{ marginTop: 22, width: '100%', height: 44, background: C.indigo, color: '#fff', border: 'none', fontSize: 13.5, fontWeight: 700 }}
            >
              Back to My Report Projects
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes rfspin { to { transform: rotate(360deg) } }
        .rf-spin { animation: rfspin 0.7s linear infinite }
        .rf-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 0; }
        .rf-textarea::placeholder { color: #B7BBCB; }
      `}</style>
    </div>
  )
}
