import { useState } from 'react'
import {
  Target, CalendarClock, Eye, CheckCircle2, Clock3, HelpCircle, X,
  Calendar, ChevronDown, Loader2,
} from 'lucide-react'
import KPIReviewDetailsPage from './KPIReviewDetailsPage'

interface MyAppraisalPageProps {
  onNavigate?: (id: string) => void
  assessorName?: string
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

/* ── How-it-works steps ── */
const STEPS = [
  { n: 1, title: 'Self Assessment',   desc: 'Enter your self-score, comments and achievements for each KPI.', done: false, current: true  },
  { n: 2, title: 'Manager Review',    desc: 'Your manager reviews your submission and adds their scores.',    done: false, current: false },
  { n: 3, title: 'Final Appraisal',   desc: 'Admin finalizes the scores and closes the review cycle.',        done: false, current: false },
]

export default function MyAppraisalPage({ onNavigate, assessorName = 'Sara Johnson' }: MyAppraisalPageProps) {
  const [howOpen, setHowOpen]           = useState(false)
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR)
  const [yearMenuOpen, setYearMenuOpen] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [detail, setDetail]             = useState<{ year: number; stage: string; mode: 'self' | 'reviewed' } | null>(null)
  const [cycleStatus, setCycleStatus]   = useState<'Pending' | 'Submitted'>('Pending')

  function selectYear(y: number) {
    setYearMenuOpen(false)
    if (y === selectedYear) return
    setLoading(true)
    setTimeout(() => { setSelectedYear(y); setLoading(false) }, 750)
  }

  if (detail) {
    return (
      <KPIReviewDetailsPage
        onBack={() => setDetail(null)}
        year={detail.year}
        initialStage={detail.stage}
        mode={detail.mode}
        assessorName={assessorName}
        onSubmit={() => { setCycleStatus('Submitted'); setDetail(null) }}
      />
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes maFade  { from { opacity:0 } to { opacity:1 } }
        @keyframes maModal { from { opacity:0; transform:translateY(10px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes maSpin  { to { transform: rotate(360deg) } }
        @keyframes maMenu  { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.navy }}>My Performance</h1>
          <p className="text-sm mt-0.5" style={{ color: C.muted }}>
            Complete your KPI self-assessment for the current review cycle
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
              View your appraisal cycles and past history by year
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
                  animation: 'maMenu 0.16s ease',
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

      {/* ── Loading state ── */}
      {loading ? (
        <div
          className="flex flex-col items-center justify-center"
          style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, minHeight: 220, gap: 14 }}
        >
          <Loader2 size={30} strokeWidth={2.2} style={{ color: C.indigo, animation: 'maSpin 0.8s linear infinite' }} />
          <span style={{ fontSize: 13.5, color: C.muted, fontWeight: 500 }}>
            Loading {selectedYear} appraisal history…
          </span>
        </div>
      ) : (
      /* ── Appraisal cycle table (selected year) ── */
      (() => {
        const isCurrent = selectedYear === CURRENT_YEAR
        const row = isCurrent
          ? { cycle: 'Appraisal Cycle January 2026 to', cycleSub: 'December 2026', period: 'Jan 2026 – Dec 2026', stage: 'Q1', dueDate: 'Jul 31, 2026', score: null as number | null }
          : { cycle: `Appraisal Cycle January ${selectedYear} -`, cycleSub: `December ${selectedYear}`, period: `Jan ${selectedYear} - Dec ${selectedYear}`, stage: '4 Stages', dueDate: `Dec 31, ${selectedYear}`, score: 4.3 as number | null }
        const rowStatus: 'Pending' | 'Submitted' | 'Approved' = isCurrent ? cycleStatus : 'Approved'
        const ss = rowStatus === 'Approved'
          ? { color: '#0A7040', bg: 'rgba(14,168,106,0.12)', border: 'rgba(14,168,106,0.28)', dot: '#0EA86A' }
          : rowStatus === 'Submitted'
          ? { color: '#2563C9', bg: 'rgba(37,99,235,0.10)', border: 'rgba(37,99,235,0.26)', dot: '#2563EB' }
          : { color: '#B45309', bg: 'rgba(245,158,11,0.13)', border: 'rgba(245,158,11,0.28)', dot: '#F59E0B' }
        const grid    = isCurrent ? '2.4fr 1.3fr 0.8fr 1.1fr 1.2fr 0.8fr' : '2.4fr 1.3fr 0.8fr 1.1fr 1fr 0.8fr'
        const headers = isCurrent ? ['Cycle', 'Period', 'Stage', 'Status', 'Due Date', 'Action'] : ['Cycle', 'Period', 'Stage', 'Status', 'Score', 'Action']
        return (
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            {/* Column header */}
            <div
              className="grid items-center"
              style={{ gridTemplateColumns: grid, padding: '13px 22px', background: 'linear-gradient(90deg, rgba(99,102,241,0.06), rgba(99,102,241,0.015))', borderBottom: `1px solid ${C.border}` }}
            >
              {headers.map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#9498B0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>

            {/* Row */}
            <div
              className="grid items-center"
              style={{ gridTemplateColumns: grid, padding: '16px 22px', transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFE' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              {/* Cycle */}
              <div className="flex items-center gap-3 min-w-0" style={{ paddingRight: 12 }}>
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, borderRadius: 8, background: C.hover, border: `1px solid ${C.border}` }}>
                  <Target size={15} strokeWidth={1.8} style={{ color: C.muted }} />
                </div>
                <span className="min-w-0" style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, lineHeight: 1.35 }}>
                  {row.cycle}<br />{row.cycleSub}
                </span>
              </div>

              {/* Period */}
              <span style={{ fontSize: 13, color: '#5A6080', fontWeight: 500 }}>{row.period}</span>

              {/* Stage */}
              <div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: C.indigo, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.24)', borderRadius: 7, padding: '4px 11px', whiteSpace: 'nowrap' }}>
                  {row.stage}
                </span>
              </div>

              {/* Status */}
              <div>
                <span
                  className="inline-flex items-center gap-1.5"
                  style={{ fontSize: 11.5, fontWeight: 700, color: ss.color, background: ss.bg, border: `1px solid ${ss.border}`, borderRadius: 7, padding: '4px 10px', whiteSpace: 'nowrap' }}
                >
                  <span className="rounded-full" style={{ width: 6, height: 6, background: ss.dot }} />
                  {rowStatus}
                </span>
              </div>

              {/* Due Date (current cycle) OR Score (completed cycle) */}
              {isCurrent ? (
                <div className="flex items-center gap-1.5" style={{ color: '#C0202E' }}>
                  <CalendarClock size={14} strokeWidth={1.9} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{row.dueDate}</span>
                </div>
              ) : (
                <div>
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0A7040', background: 'rgba(14,168,106,0.12)', border: '1px solid rgba(14,168,106,0.28)', borderRadius: 7, padding: '4px 11px', whiteSpace: 'nowrap' }}>
                    {(row.score ?? 0).toFixed(1)} / 5
                  </span>
                </div>
              )}

              {/* Action */}
              <div>
                <button
                  title="View"
                  onClick={() => setDetail({ year: selectedYear, stage: 'Q1', mode: isCurrent ? 'self' : 'reviewed' })}
                  className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-all duration-150"
                  style={{ width: 34, height: 34, background: 'rgba(99,102,241,0.10)', color: C.indigo }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.10)' }}
                >
                  <Eye size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        )
      })()
      )}

      {/* ── How Appraisal Works popup ── */}
      {howOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: 'rgba(28,32,53,0.45)', zIndex: 60, padding: 20, animation: 'maFade 0.16s ease' }}
          onClick={() => setHowOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 18, width: '100%', maxWidth: 640,
              maxHeight: '86vh', overflow: 'auto', boxShadow: '0 24px 60px rgba(28,32,53,0.28)',
              animation: 'maModal 0.2s cubic-bezier(0.4,0,0.2,1)',
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
              <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>How Your Appraisal Works</div>
              <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
                Your appraisal moves through three stages. You are on the first stage.
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
                        background: step.current ? C.indigo : C.hover,
                        color: step.current ? '#fff' : C.muted,
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
