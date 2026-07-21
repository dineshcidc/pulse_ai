import { useState } from 'react'
import {
  Target, Eye, CheckCircle2, Clock3, HelpCircle, X,
  Calendar, ChevronDown, Loader2,
} from 'lucide-react'
import KPIReviewDetailsPage from '../../employee/appraisal/KPIReviewDetailsPage'

interface TeamAppraisalsPageProps {
  onNavigate?: (id: string) => void
  managerName?: string
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', indigo: '#6366F1' }

const CURRENT_CYCLE = { year: 2026 }

/* ── Review years ── */
const CURRENT_YEAR = 2026
const REVIEW_YEARS = [2026, 2025]

/* ── Quarterly cycle timeline ── */
const CYCLE_STAGES = [
  { key: 'Q1',     label: 'Q1',     state: 'active'   as const },
  { key: 'Q2',     label: 'Q2',     state: 'upcoming' as const },
  { key: 'Q3',     label: 'Q3',     state: 'upcoming' as const },
  { key: 'Annual', label: 'Annual', state: 'upcoming' as const },
]

/* ── How-it-works steps (manager is on stage 2) ── */
const STEPS = [
  { n: 1, title: 'Self Assessment', desc: 'Your team member enters their self-score, comments and achievements for each KPI.', done: true,  current: false },
  { n: 2, title: 'Manager Review',  desc: 'You review each submission and add your scores, comments and improvement notes.', done: false, current: true  },
  { n: 3, title: 'Final Appraisal', desc: 'Admin finalizes the scores and closes the review cycle.',                        done: false, current: false },
]

/* ── Team appraisal queue (mock) ── */
type QueueStatus = 'Pending' | 'Approved'

type TeamRow = {
  id: string
  name: string
  code: string
  role: string
  face: string
  stage: string
  submittedOn: string
  selfScore: number
  status: QueueStatus
}

const TEAM_ROWS: TeamRow[] = [
  { id: 't1', name: 'Sarah Johnson', code: 'CC002', role: 'UI/UX Designer', face: 'https://i.pravatar.cc/64?img=47', stage: 'Q1', submittedOn: 'Jul 10, 2026', selfScore: 4.2, status: 'Pending' },
  { id: 't2', name: 'Rajesh Kumar',  code: 'CC003', role: 'Developer',      face: 'https://i.pravatar.cc/64?img=15', stage: 'Q1', submittedOn: 'Jul 09, 2026', selfScore: 3.8, status: 'Pending' },
  { id: 't3', name: 'Priya Sharma',  code: 'CC004', role: 'QA Tester',      face: 'https://i.pravatar.cc/64?img=31', stage: 'Q1', submittedOn: 'Jul 08, 2026', selfScore: 4.0, status: 'Pending' },
  { id: 't4', name: 'Arjun Menon',   code: 'CC005', role: 'Developer',      face: 'https://i.pravatar.cc/64?img=12', stage: 'Q1', submittedOn: 'Jul 07, 2026', selfScore: 4.5, status: 'Approved' },
  { id: 't5', name: 'Neha Patel',    code: 'CC006', role: 'HR Executive',   face: 'https://i.pravatar.cc/64?img=44', stage: 'Q1', submittedOn: 'Jul 07, 2026', selfScore: 3.9, status: 'Approved' },
]

const STATUS_STYLE: Record<QueueStatus, { color: string; bg: string; border: string; dot: string }> = {
  'Pending':  { color: '#B45309', bg: 'rgba(245,158,11,0.13)', border: 'rgba(245,158,11,0.28)', dot: '#F59E0B' },
  'Approved': { color: '#0A7040', bg: 'rgba(14,168,106,0.12)', border: 'rgba(14,168,106,0.28)', dot: '#0EA86A' },
}

const FILTERS: ('All' | QueueStatus)[] = ['All', 'Pending', 'Approved']

export default function TeamAppraisalsPage({ managerName = 'James Shower' }: TeamAppraisalsPageProps) {
  const [howOpen, setHowOpen]           = useState(false)
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)
  const [yearMenuOpen, setYearMenuOpen] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [filter, setFilter]             = useState<'All' | QueueStatus>('All')
  const [detail, setDetail]             = useState<{ row: TeamRow; mode: 'assessor' | 'reviewed' } | null>(null)

  function selectYear(y: number) {
    setYearMenuOpen(false)
    if (y === selectedYear) return
    setLoading(true)
    setTimeout(() => { setSelectedYear(y); setLoading(false) }, 750)
  }

  const rows = TEAM_ROWS.filter(r => filter === 'All' || r.status === filter)

  if (detail) {
    return (
      <KPIReviewDetailsPage
        onBack={() => setDetail(null)}
        year={selectedYear}
        initialStage={detail.row.stage}
        mode={detail.mode}
        assessorName={managerName}
        employeeName={detail.row.name}
        backLabel="Team Appraisals"
        showRecommendedRating
        onSubmit={() => setDetail(null)}
      />
    )
  }

  const grid = '2.2fr 1.3fr 0.8fr 1.1fr 1.2fr 0.7fr'
  const headers = ['Employee', 'Role', 'Stage', 'Submitted On', 'Status', 'Action']

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes taFade  { from { opacity:0 } to { opacity:1 } }
        @keyframes taModal { from { opacity:0; transform:translateY(10px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes taSpin  { to { transform: rotate(360deg) } }
        @keyframes taMenu  { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.navy }}>Team Appraisals</h1>
          <p className="text-sm mt-0.5" style={{ color: C.muted }}>
            Review and score KPI self-assessments submitted by your team
          </p>
        </div>

        {/* How Appraisal Works badge */}
        <button
          onClick={() => setHowOpen(true)}
          className="flex items-center gap-2 rounded-full border cursor-pointer font-semibold transition-all duration-150 flex-shrink-0"
          style={{
            height: 34, padding: '0 14px', fontSize: 12.5,
            background: 'rgba(99,102,241,0.08)', color: C.indigo,
            borderColor: 'rgba(99,102,241,0.28)', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.16)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
        >
          <HelpCircle size={15} strokeWidth={2} />
          How Appraisal Works
        </button>
      </div>

      {/* ── Review Year section ── */}
      <div
        className="flex items-center justify-between gap-4 flex-wrap"
        style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '16px 20px', marginBottom: 16 }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <Calendar size={19} strokeWidth={1.8} style={{ color: C.indigo }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Review Year</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>
              View your team's appraisal cycles and past history by year
            </div>
          </div>
        </div>

        {/* Year dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setYearMenuOpen(o => !o)}
            className="flex items-center gap-2.5 cursor-pointer transition-all duration-150"
            style={{
              height: 40, padding: '0 12px 0 14px', borderRadius: 10,
              background: '#fff', border: `1px solid ${yearMenuOpen ? C.indigo : C.border}`,
              boxShadow: yearMenuOpen ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, color: C.navy, letterSpacing: '-0.2px' }}>{selectedYear}</span>
            {selectedYear === CURRENT_YEAR && (
              <span
                style={{
                  fontSize: 10, fontWeight: 700, color: '#0A7040',
                  background: 'rgba(14,168,106,0.12)', border: '1px solid rgba(14,168,106,0.28)',
                  borderRadius: 5, padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.04em',
                }}
              >
                Current
              </span>
            )}
            <ChevronDown size={16} strokeWidth={2} style={{ color: C.muted, transition: 'transform 0.2s', transform: yearMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>

          {yearMenuOpen && (
            <>
              <div className="fixed inset-0" style={{ zIndex: 40 }} onClick={() => setYearMenuOpen(false)} />
              <div
                style={{
                  position: 'absolute', right: 0, top: 46, zIndex: 41, minWidth: 170,
                  background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12,
                  boxShadow: '0 12px 32px rgba(28,32,53,0.16)', padding: 6,
                  animation: 'taMenu 0.16s ease',
                }}
              >
                {REVIEW_YEARS.map(y => {
                  const active = y === selectedYear
                  return (
                    <button
                      key={y}
                      onClick={() => selectYear(y)}
                      className="w-full flex items-center justify-between rounded-lg border-none cursor-pointer transition-colors duration-150"
                      style={{
                        height: 38, padding: '0 12px', background: active ? 'rgba(99,102,241,0.10)' : 'transparent',
                        color: active ? C.indigo : C.navy, fontSize: 14, fontWeight: active ? 700 : 500,
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.hover }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                    >
                      {y}
                      {y === CURRENT_YEAR
                        ? <span style={{ fontSize: 10, fontWeight: 700, color: '#0A7040' }}>Current</span>
                        : active ? <CheckCircle2 size={15} /> : null}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div
          className="flex flex-col items-center justify-center"
          style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, minHeight: 260, gap: 14 }}
        >
          <Loader2 size={30} strokeWidth={2.2} style={{ color: C.indigo, animation: 'taSpin 0.8s linear infinite' }} />
          <span style={{ fontSize: 13.5, color: C.muted, fontWeight: 500 }}>
            Loading {selectedYear} team appraisals…
          </span>
        </div>
      ) : (
        <>
          {/* ── Queue table ── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            {/* Card header: title + filter chips */}
            <div
              className="flex items-center justify-between gap-4 flex-wrap"
              style={{ padding: '14px 22px', borderBottom: `1px solid ${C.border}` }}
            >
              <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Appraisal Cycle January 2026 to December 2026</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {FILTERS.map(f => {
                  const active = filter === f
                  const count  = f === 'All' ? TEAM_ROWS.length : TEAM_ROWS.filter(r => r.status === f).length
                  const dot    = f === 'Pending' ? STATUS_STYLE['Pending'].dot : f === 'Approved' ? STATUS_STYLE['Approved'].dot : null
                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className="flex items-center gap-1.5 cursor-pointer transition-all duration-150"
                      style={{
                        height: 26, padding: '0 7px 0 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                        background: active ? '#EEF0F6' : 'transparent',
                        color: active ? C.navy : '#8B90A7',
                        border: '1px solid transparent',
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.hover }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                    >
                      {dot && <span className="rounded-full" style={{ width: 6, height: 6, background: dot }} />}
                      {f}
                      <span
                        className="flex items-center justify-center"
                        style={{
                          minWidth: 17, height: 17, padding: '0 5px', borderRadius: 999, fontSize: 10.5, fontWeight: 700,
                          background: active ? '#E2E5EE' : '#EDEFF5',
                          color: active ? '#5A6080' : '#8B90A7',
                        }}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Column header */}
            <div
              className="grid items-center"
              style={{ gridTemplateColumns: grid, padding: '13px 22px', background: 'linear-gradient(90deg, rgba(99,102,241,0.06), rgba(99,102,241,0.015))', borderBottom: `1px solid ${C.border}` }}
            >
              {headers.map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#9498B0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            {rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center" style={{ padding: '54px 20px', gap: 8 }}>
                <div className="flex items-center justify-center" style={{ width: 46, height: 46, borderRadius: 12, background: C.hover }}>
                  <Target size={22} strokeWidth={1.8} style={{ color: C.muted }} />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>No appraisals found</span>
                <span style={{ fontSize: 12.5, color: C.muted }}>Try a different filter or search term.</span>
              </div>
            ) : rows.map((r, idx) => {
              const ss = STATUS_STYLE[r.status]
              const canReview = r.status === 'Pending'
              return (
                <div
                  key={r.id}
                  className="grid items-center"
                  style={{ gridTemplateColumns: grid, padding: '14px 22px', borderTop: idx === 0 ? 'none' : `1px solid ${C.border}`, transition: 'background 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFE' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  {/* Employee */}
                  <div className="flex items-center gap-3 min-w-0" style={{ paddingRight: 12 }}>
                    <img
                      src={r.face}
                      alt={r.name}
                      className="flex-shrink-0"
                      style={{ width: 34, height: 34, borderRadius: 999, objectFit: 'cover', border: `1px solid ${C.border}` }}
                    />
                    <div className="min-w-0">
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                      <div style={{ fontSize: 11.5, color: C.muted }}>{r.code}</div>
                    </div>
                  </div>

                  {/* Role */}
                  <span style={{ fontSize: 13, color: '#5A6080', fontWeight: 500 }}>{r.role}</span>

                  {/* Stage */}
                  <div>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: C.indigo, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.24)', borderRadius: 7, padding: '4px 11px', whiteSpace: 'nowrap' }}>
                      {r.stage}
                    </span>
                  </div>

                  {/* Submitted On */}
                  <span style={{ fontSize: 13, color: '#5A6080', fontWeight: 500 }}>{r.submittedOn}</span>

                  {/* Status */}
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5"
                      style={{ fontSize: 11.5, fontWeight: 700, color: ss.color, background: ss.bg, border: `1px solid ${ss.border}`, borderRadius: 7, padding: '4px 10px', whiteSpace: 'nowrap' }}
                    >
                      <span className="rounded-full" style={{ width: 6, height: 6, background: ss.dot }} />
                      {r.status}
                    </span>
                  </div>

                  {/* Action */}
                  <div>
                    {canReview ? (
                      <button
                        onClick={() => setDetail({ row: r, mode: 'assessor' })}
                        className="flex items-center gap-1.5 cursor-pointer transition-all duration-150 border-none"
                        style={{ height: 32, padding: '0 12px', borderRadius: 8, background: C.indigo, color: '#fff', fontSize: 12, fontWeight: 600 }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5' }}
                        onMouseLeave={e => { e.currentTarget.style.background = C.indigo }}
                      >
                        Review
                      </button>
                    ) : (
                      <button
                        title="View"
                        onClick={() => setDetail({ row: r, mode: 'reviewed' })}
                        className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-all duration-150"
                        style={{ width: 34, height: 34, background: 'rgba(99,102,241,0.10)', color: C.indigo }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.10)' }}
                      >
                        <Eye size={16} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* ── How Appraisal Works popup ── */}
      {howOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: 'rgba(28,32,53,0.45)', zIndex: 60, padding: 20, animation: 'taFade 0.16s ease' }}
          onClick={() => setHowOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 18, width: '100%', maxWidth: 640,
              maxHeight: '86vh', overflow: 'auto', boxShadow: '0 24px 60px rgba(28,32,53,0.28)',
              animation: 'taModal 0.2s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {/* Modal header */}
            <div
              className="flex items-center justify-between sticky top-0"
              style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}`, background: '#fff' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.11)', border: '1px solid rgba(99,102,241,0.2)' }}
                >
                  <HelpCircle size={18} strokeWidth={1.9} style={{ color: C.indigo }} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>How Appraisal Works</span>
              </div>
              <button
                onClick={() => setHowOpen(false)}
                className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-colors duration-150"
                style={{ width: 30, height: 30, background: C.hover, color: C.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.background = C.hover;   e.currentTarget.style.color = C.muted }}
              >
                <X size={16} strokeWidth={2.2} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '22px' }}>
              {/* Review Cycle 2026 */}
              <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 16 }}>
                Review Cycle {CURRENT_CYCLE.year}
              </div>
              <div className="flex items-center" style={{ marginBottom: 26 }}>
                {CYCLE_STAGES.map((s, i) => (
                  <div key={s.key} className="flex items-center" style={{ flex: i < CYCLE_STAGES.length - 1 ? 1 : 'none' }}>
                    <div className="flex flex-col items-center gap-2" style={{ minWidth: 56 }}>
                      <div
                        className="flex items-center justify-center"
                        style={{
                          width: 34, height: 34, borderRadius: 999,
                          background: s.state === 'active' ? C.indigo : C.hover,
                          border: s.state === 'active' ? 'none' : `1px solid ${C.border}`,
                          color: s.state === 'active' ? '#fff' : C.muted,
                          fontSize: 12, fontWeight: 700,
                        }}
                      >
                        {s.label === 'Annual' ? 'A' : s.label}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: s.state === 'active' ? C.navy : C.muted, whiteSpace: 'nowrap' }}>
                        {s.label}
                      </span>
                    </div>
                    {i < CYCLE_STAGES.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: C.border, margin: '0 6px', marginBottom: 22 }} />
                    )}
                  </div>
                ))}
              </div>

              {/* How Your Appraisal Works */}
              <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>How Team Appraisal Works</div>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
                Each appraisal moves through three stages. Your team's submissions are waiting on the second stage — your review.
              </p>
              <div className="flex flex-col gap-3">
                {STEPS.map(step => (
                  <div
                    key={step.n}
                    className="flex items-start gap-3"
                    style={{
                      border: `1px solid ${step.current ? 'rgba(99,102,241,0.35)' : C.border}`,
                      background: step.current ? 'rgba(99,102,241,0.04)' : '#fff',
                      borderRadius: 12, padding: '14px 16px',
                    }}
                  >
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: step.current ? C.indigo : step.done ? 'rgba(14,168,106,0.12)' : C.hover,
                        color: step.current ? '#fff' : step.done ? '#0A7040' : C.muted,
                      }}
                    >
                      {step.done
                        ? <CheckCircle2 size={16} />
                        : step.current
                          ? <Clock3 size={15} strokeWidth={2.2} />
                          : <span style={{ fontSize: 12, fontWeight: 700 }}>{step.n}</span>}
                    </div>
                    <div>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{step.title}</span>
                      <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.5, marginTop: 3 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
