import { ArrowLeft, Users, Briefcase, UserCog, User, FileText, Send, CheckCircle2, CalendarClock } from 'lucide-react'
import type { AppraisalCycle, Period, AudienceMode } from './AdminAppraisalCyclesPage'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC', indigo: '#6366F1' }

const PERIOD_META: Record<Period, { color: string; bg: string; border: string }> = {
  Q1:     { color: '#2563EB', bg: 'rgba(37,99,235,0.10)',  border: 'rgba(37,99,235,0.24)' },
  Q2:     { color: '#6366F1', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.24)' },
  Q3:     { color: '#F59E0B', bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.30)' },
  Annual: { color: '#0EA86A', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.26)' },
}
const PERIODS: Period[] = ['Q1', 'Q2', 'Q3', 'Annual']

const MODE_META: Record<AudienceMode, { label: string; Icon: typeof Users }> = {
  designation: { label: 'By Designation', Icon: Users },
  project:     { label: 'By Project',     Icon: Briefcase },
  manager:     { label: 'By Manager',     Icon: UserCog },
  individual:  { label: 'Individual',     Icon: User },
}

interface Props {
  cycle: AppraisalCycle
  onBack: () => void
  onPublish: (id: string) => void
}

export default function AdminAppraisalCycleViewPage({ cycle, onBack, onPublish }: Props) {
  const pm = PERIOD_META[cycle.period]
  const mm = MODE_META[cycle.audienceMode]
  const isDraft = cycle.status === 'Draft'

  const LABEL: React.CSSProperties = { display: 'block', fontSize: 11.5, color: C.muted, fontWeight: 600, marginBottom: 7 }
  const FIELD: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', minHeight: 42, padding: '11px 13px',
    border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13.5, color: C.navy, fontWeight: 600,
    background: C.surface, lineHeight: 1.5,
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@media (max-width: 1000px){ .av-grid{ grid-template-columns: 1fr !important } }`}</style>

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
        <button onClick={onBack} title="Back"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s' }}
          onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}>
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <button onClick={onBack} style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
          Appraisal Cycles
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260 }}>{cycle.title}</span>
      </div>

      {/* ── Title + status ── */}
      <div className="flex items-start justify-between gap-4" style={{ marginBottom: 18 }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: C.navy }}>{cycle.title}</h1>
          <p className="text-sm mt-1" style={{ color: '#787878', fontWeight: 500 }}>
            {isDraft ? 'Draft appraisal — not published yet' : `Published on ${cycle.publishedOn}`}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 flex-shrink-0" style={{
          fontSize: 12, fontWeight: 700, borderRadius: 999, padding: '5px 13px',
          color: isDraft ? '#8B90A7' : '#0A7040',
          background: isDraft ? 'rgba(139,144,167,0.10)' : 'rgba(14,168,106,0.10)',
          border: `1px solid ${isDraft ? 'rgba(139,144,167,0.26)' : 'rgba(14,168,106,0.24)'}`,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: isDraft ? '#8B90A7' : '#0EA86A' }} />
          {cycle.status}
        </span>
      </div>

      {/* ── 8 : 4 layout ── */}
      <div className="av-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: 20, alignItems: 'start' }}>
        {/* LEFT */}
        <div className="flex flex-col" style={{ gap: 20 }}>
          {/* Appraisal Details */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div className="flex items-center gap-2" style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
              <FileText size={16} strokeWidth={2.2} style={{ color: C.indigo }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Appraisal Details</span>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 18 }}>
                <label style={LABEL}>Appraisal Title</label>
                <div style={FIELD}>{cycle.title}</div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={LABEL}>Description</label>
                <div style={{ ...FIELD, minHeight: 66, color: cycle.description ? C.navy : '#B0B4C8', fontWeight: cycle.description ? 600 : 500 }}>
                  {cycle.description || 'No description provided'}
                </div>
              </div>

              {/* Stage (filled, non-interactive) */}
              <div style={{ marginBottom: 18 }}>
                <label style={LABEL}>Stage</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PERIODS.map(p => {
                    const active = cycle.period === p
                    const meta = PERIOD_META[p]
                    return (
                      <div key={p}
                        style={{
                          height: 38, padding: '0 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                          display: 'inline-flex', alignItems: 'center',
                          background: active ? meta.bg : C.surface,
                          color: active ? meta.color : '#C0C4D6',
                          border: `1.5px solid ${active ? meta.border : C.border}`,
                          opacity: active ? 1 : 0.7,
                        }}>
                        {p}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Year + Due date */}
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={LABEL}>Year</label>
                  <div style={FIELD}>{cycle.year}</div>
                </div>
                <div>
                  <label style={LABEL}>Due Date</label>
                  <div style={FIELD}>{cycle.dueDate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Audience */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div className="flex items-center justify-between gap-3 flex-wrap" style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2">
                <Users size={16} strokeWidth={2.2} style={{ color: C.indigo }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Audience</span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.indigo, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 999, padding: '3px 11px' }}>
                {cycle.people} {cycle.people === 1 ? 'person' : 'people'}
              </span>
            </div>
            <div style={{ padding: 20 }}>
              <div className="flex items-center gap-3" style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', background: C.surface }}>
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(99,102,241,0.10)' }}>
                  <mm.Icon size={19} strokeWidth={2.2} style={{ color: C.indigo }} />
                </div>
                <div className="min-w-0">
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{mm.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{cycle.audienceLabel}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — sticky summary */}
        <div style={{ position: 'sticky', top: 0 }}>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Summary</span>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, lineHeight: 1.4, marginBottom: 14 }}>{cycle.title}</div>

              <Row label="Stage">
                <span style={{ fontSize: 12, fontWeight: 700, color: pm.color, background: pm.bg, border: `1px solid ${pm.border}`, borderRadius: 999, padding: '2px 10px' }}>{cycle.period}</span>
              </Row>
              <Row label="Year"><Val>{cycle.year}</Val></Row>
              <Row label="Due Date"><Val>{cycle.dueDate}</Val></Row>
              <Row label="Audience"><Val>{cycle.audienceLabel}</Val></Row>

              <div style={{ borderTop: `1px dashed ${C.border}`, margin: '14px 0', paddingTop: 14 }}>
                <div className="flex items-center gap-2.5" style={{ background: C.surface, borderRadius: 12, padding: '12px 14px' }}>
                  <div className="flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(99,102,241,0.12)' }}>
                    <Users size={17} strokeWidth={2.2} style={{ color: C.indigo }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{cycle.people}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{isDraft ? 'people will be notified' : 'people notified'}</div>
                  </div>
                </div>
              </div>

              {isDraft ? (
                <button onClick={() => onPublish(cycle.id)}
                  className="inline-flex items-center justify-center gap-2 w-full border-none cursor-pointer transition-all duration-150"
                  style={{ height: 44, borderRadius: 12, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', background: C.indigo, color: '#fff' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5' }} onMouseLeave={e => { e.currentTarget.style.background = C.indigo }}>
                  <Send size={16} strokeWidth={2.2} /> Publish Appraisal
                </button>
              ) : (
                <div className="flex items-center gap-2.5" style={{ background: 'rgba(14,168,106,0.07)', border: '1px solid rgba(14,168,106,0.22)', borderRadius: 12, padding: '12px 14px' }}>
                  <CheckCircle2 size={18} strokeWidth={2.2} style={{ color: '#0A7040', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#0A7040' }}>Published</div>
                    <div className="flex items-center gap-1.5" style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>
                      <CalendarClock size={12} strokeWidth={2} /> {cycle.publishedOn}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '7px 0' }}>
      <span style={{ fontSize: 12, color: '#8B90A7', fontWeight: 500 }}>{label}</span>
      {children}
    </div>
  )
}
function Val({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1C2035' }}>{children}</span>
}
