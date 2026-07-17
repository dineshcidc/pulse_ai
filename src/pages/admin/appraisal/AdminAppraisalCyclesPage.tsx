import { useState } from 'react'
import { Plus, Eye, CalendarClock, Users, CheckCircle2, FileText } from 'lucide-react'
import AdminPublishAppraisalPage from './AdminPublishAppraisalPage'
import AdminAppraisalCycleViewPage from './AdminAppraisalCycleViewPage'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC', indigo: '#6366F1' }

export type Period = 'Q1' | 'Q2' | 'Q3' | 'Annual'
export type CycleStatus = 'Published' | 'Draft'

export type AudienceMode = 'designation' | 'project' | 'manager' | 'individual'

export interface AppraisalCycle {
  id: string
  title: string
  description?: string
  period: Period
  year: number
  audienceMode: AudienceMode
  audienceLabel: string
  people: number
  dueDate: string
  publishedOn: string
  status: CycleStatus
}

const PERIOD_META: Record<Period, { color: string; bg: string; border: string }> = {
  Q1:     { color: '#2563EB', bg: 'rgba(37,99,235,0.10)',  border: 'rgba(37,99,235,0.24)' },
  Q2:     { color: '#6366F1', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.24)' },
  Q3:     { color: '#F59E0B', bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.30)' },
  Annual: { color: '#0EA86A', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.26)' },
}

const STATUS_META: Record<CycleStatus, { color: string; bg: string; border: string }> = {
  Published: { color: '#0A7040', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.24)' },
  Draft:     { color: '#8B90A7', bg: 'rgba(139,144,167,0.10)', border: 'rgba(139,144,167,0.26)' },
}

const SEED: AppraisalCycle[] = [
  { id: 'c1', title: 'Q2 2026 Performance Appraisal', description: 'Quarterly performance review for all designations across the organisation.', period: 'Q2', year: 2026, audienceMode: 'designation', audienceLabel: 'All Designations', people: 48, dueDate: 'Aug 15, 2026', publishedOn: 'Jul 05, 2026', status: 'Published' },
  { id: 'c2', title: 'Q1 2026 Performance Appraisal', description: 'First-quarter appraisal cycle covering every designation.', period: 'Q1', year: 2026, audienceMode: 'designation', audienceLabel: 'All Designations', people: 48, dueDate: 'Apr 15, 2026', publishedOn: 'Jan 08, 2026', status: 'Published' },
  { id: 'c3', title: 'Annual 2025 Appraisal',         description: 'Year-end annual performance evaluation for 2025.', period: 'Annual', year: 2025, audienceMode: 'designation', audienceLabel: 'All Designations', people: 41, dueDate: 'Dec 20, 2025', publishedOn: 'Nov 10, 2025', status: 'Published' },
  { id: 'c4', title: 'Q3 2026 Engineering Review',    description: 'Focused Q3 review for the engineering teams under selected managers.', period: 'Q3', year: 2026, audienceMode: 'manager', audienceLabel: '2 managers', people: 24, dueDate: 'Oct 10, 2026', publishedOn: '—', status: 'Draft' },
]

type Filter = 'All' | 'Published' | 'Draft'

export default function AdminAppraisalCyclesPage() {
  const [cycles, setCycles] = useState(SEED)
  const [filter, setFilter] = useState<Filter>('All')
  const [creating, setCreating] = useState(false)
  const [viewId, setViewId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const viewCycle = cycles.find(c => c.id === viewId) ?? null

  if (viewCycle) {
    return (
      <AdminAppraisalCycleViewPage
        cycle={viewCycle}
        onBack={() => setViewId(null)}
        onPublish={id => {
          const today = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
          setCycles(prev => prev.map(c => c.id === id ? { ...c, status: 'Published', publishedOn: today } : c))
          setViewId(null)
          setToast(`Appraisal published · ${viewCycle.people} people notified`)
          setTimeout(() => setToast(null), 3600)
        }}
      />
    )
  }

  if (creating) {
    return (
      <AdminPublishAppraisalPage
        onBack={() => setCreating(false)}
        onPublished={(cycle, asDraft) => {
          setCycles(prev => [cycle, ...prev])
          setCreating(false)
          setToast(asDraft ? 'Appraisal saved as draft' : `Appraisal published · ${cycle.people} people notified`)
          setTimeout(() => setToast(null), 3600)
        }}
      />
    )
  }

  const counts = {
    All: cycles.length,
    Published: cycles.filter(c => c.status === 'Published').length,
    Draft: cycles.filter(c => c.status === 'Draft').length,
  }
  const filtered = cycles.filter(c => filter === 'All' || c.status === filter)

  const GRID = '2.2fr 0.8fr 1.6fr 1.1fr 1fr 0.6fr'
  const HEADERS = ['Cycle Title', 'Stage', 'Audience', 'Due Date', 'Status', 'Action']

  const CHIPS: { key: Filter; dot: string }[] = [
    { key: 'All', dot: '#8B90A7' },
    { key: 'Published', dot: '#0EA86A' },
    { key: 'Draft', dot: '#B0B4C8' },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes acToast { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }`}</style>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4" style={{ marginBottom: 18 }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: C.navy }}>Appraisal Cycles</h1>
          <p className="text-sm mt-1" style={{ color: '#787878', fontWeight: 500 }}>
            Open performance reviews and send them to employees, teams or projects
          </p>
        </div>
        <button onClick={() => setCreating(true)}
          className="flex items-center gap-2 cursor-pointer transition-all duration-150 flex-shrink-0"
          style={{ height: 40, padding: '0 18px', borderRadius: 11, border: 'none', background: C.navy, color: '#fff', fontSize: 13.5, fontWeight: 700 }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }} onMouseLeave={e => { e.currentTarget.style.background = C.navy }}>
          <Plus size={16} strokeWidth={2.5} /> Publish Appraisal
        </button>
      </div>

      {/* ── Table card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        {/* card header: title + filter chips */}
        <div className="flex items-center justify-between gap-4 flex-wrap" style={{ padding: '13px 22px', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Appraisal Cycles</span>
          <div className="flex items-center gap-2">
            {CHIPS.map(ch => {
              const active = filter === ch.key
              return (
                <button key={ch.key} onClick={() => setFilter(ch.key)}
                  className="inline-flex items-center gap-1.5 cursor-pointer transition-all duration-150"
                  style={{ height: 30, padding: '0 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, fontFamily: 'inherit',
                    border: `1px solid ${active ? 'rgba(99,102,241,0.35)' : C.border}`, background: active ? 'rgba(99,102,241,0.08)' : '#fff', color: active ? C.indigo : C.muted }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: ch.dot }} />
                  {ch.key}
                  <span style={{ fontSize: 11, fontWeight: 700, color: active ? C.indigo : '#B0B4C8', background: active ? 'rgba(99,102,241,0.14)' : C.surface, borderRadius: 999, padding: '0 6px', minWidth: 18, textAlign: 'center' }}>{counts[ch.key]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* column header */}
        <div className="grid items-center" style={{ gridTemplateColumns: GRID, padding: '12px 22px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          {HEADERS.map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#9498B0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ padding: '56px 20px', gap: 8 }}>
            <div className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 13, background: C.hover }}>
              <FileText size={22} strokeWidth={1.6} style={{ color: C.muted }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>No appraisal cycles</span>
            <span style={{ fontSize: 12.5, color: C.muted }}>Publish an appraisal to open a review for your people.</span>
          </div>
        ) : filtered.map((c, idx) => {
          const pm = PERIOD_META[c.period]
          const sm = STATUS_META[c.status]
          return (
            <div key={c.id} className="grid items-center" style={{ gridTemplateColumns: GRID, padding: '15px 22px', borderTop: idx === 0 ? 'none' : `1px solid ${C.border}`, transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFE' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
              {/* Title */}
              <div className="min-w-0" style={{ paddingRight: 12 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                <div className="flex items-center gap-1.5" style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                  <CalendarClock size={12} strokeWidth={2} />
                  {c.publishedOn === '—' ? 'Not published yet' : `Published ${c.publishedOn}`}
                </div>
              </div>
              {/* Stage */}
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: pm.color, background: pm.bg, border: `1px solid ${pm.border}`, borderRadius: 999, padding: '3px 11px' }}>{c.period}</span>
              </div>
              {/* Audience */}
              <div className="flex items-center gap-2 min-w-0" style={{ paddingRight: 12 }}>
                <span className="flex items-center justify-center flex-shrink-0" style={{ width: 26, height: 26, borderRadius: 8, background: C.hover }}>
                  <Users size={13} strokeWidth={2} style={{ color: C.muted }} />
                </span>
                <span className="min-w-0">
                  <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#5A6080', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.audienceLabel}</span>
                  <span style={{ display: 'block', fontSize: 11, color: C.muted }}>{c.people} people</span>
                </span>
              </div>
              {/* Due date */}
              <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{c.dueDate}</span>
              {/* Status */}
              <div>
                <span className="inline-flex items-center gap-1.5" style={{ fontSize: 11.5, fontWeight: 700, color: sm.color, background: sm.bg, border: `1px solid ${sm.border}`, borderRadius: 999, padding: '3px 11px' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: sm.color }} />
                  {c.status}
                </span>
              </div>
              {/* Action */}
              <div className="flex items-center">
                <button title="View" onClick={() => setViewId(c.id)} className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-all duration-150"
                  style={{ width: 32, height: 32, background: C.hover, color: C.muted }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}>
                  <Eye size={15} strokeWidth={2} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed flex items-center gap-2.5" style={{ right: 28, bottom: 28, zIndex: 10000, background: '#fff', border: '1px solid rgba(14,168,106,0.28)', borderRadius: 12, padding: '12px 16px', boxShadow: '0 12px 32px rgba(10,12,28,0.16)', animation: 'acToast 0.22s ease' }}>
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(14,168,106,0.12)' }}>
            <CheckCircle2 size={16} strokeWidth={2.4} style={{ color: '#0A7040' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{toast}</span>
        </div>
      )}
    </div>
  )
}
