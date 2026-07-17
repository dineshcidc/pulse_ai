import { useState } from 'react'
import {
  ArrowLeft, ChevronDown, CheckCircle2, MessageSquare, Save, Loader2, Send, X, Info, Clock3,
} from 'lucide-react'

interface KPIReviewDetailsPageProps {
  onBack: () => void
  year: number
  initialStage?: string
  mode: 'self' | 'reviewed' | 'assessor'
  assessorName?: string
  employeeName?: string
  backLabel?: string
  onSubmit?: () => void
  /* reviewed mode only: has the manager finished assessing? false = employee submitted, awaiting review */
  assessorDone?: boolean
  /* show the manager's "Recommended Rating" field — Manager (Team Appraisals) + Admin only; hidden for employee */
  showRecommendedRating?: boolean
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', indigo: '#6366F1' }

const MAX = 5

type Crit = { id: string; name: string; tag: string; weight: number; desc: string }
const CRITERIA: Crit[] = [
  { id: 'ai',   name: 'AI Enabled Design Usage',            tag: 'UI/UX', weight: 10, desc: 'Use AI tools to improve design productivity and exploration.' },
  { id: 'cr',   name: 'Code Review',                        tag: 'UI/UX', weight: 8,  desc: 'Quality and consistency of design-to-code handoff reviews.' },
  { id: 'cmt',  name: 'Complete Mandatory Training',        tag: 'UI/UX', weight: 12, desc: 'Completion of all required compliance and skill training modules.' },
  { id: 'cfc',  name: 'Cross Functional Collaboration',     tag: 'UI/UX', weight: 8,  desc: 'Effectiveness of collaboration with product, engineering and QA teams.' },
]

const SELF_SCORES: Record<string, number[]> = {
  Q1:     [5, 4, 1, 4],
  Q2:     [5, 4, 3, 4],
  Q3:     [4, 5, 3, 5],
  Annual: [5, 5, 4, 5],
}
const ASSESSOR_SCORES: Record<string, number[]> = {
  Q1:     [5, 4, 2, 4],
  Q2:     [5, 4, 3, 4],
  Q3:     [4, 4, 3, 5],
  Annual: [5, 5, 4, 5],
}

const FINAL_COMMENTS: Record<string, string> = {
  Q1:     'Strong quarter overall. Excellent delivery on prototypes and UX design. Focus area: complete mandatory training earlier in the cycle.',
  Q2:     'Consistent improvement across all criteria. Great collaboration with engineering. Keep up the documentation discipline.',
  Q3:     'Very reliable performer. Continue mentoring juniors and driving design-system adoption.',
  Annual: 'Outstanding year with steady growth each quarter. A dependable, high-quality contributor to the design org.',
}

/* Manager's overall recommended rating score (assessor enters this; shown read-only in reviewed mode) */
const RECOMMENDED_RATINGS: Record<string, number> = {
  Q1:     4,
  Q2:     4,
  Q3:     3,
  Annual: 5,
}

const STAGE_TABS = [
  { key: 'Q1',     label: 'Q1' },
  { key: 'Q2',     label: 'Q2' },
  { key: 'Q3',     label: 'Q3' },
  { key: 'Annual', label: 'Annual' },
]

function scoreColor(v: number) {
  const pct = v / MAX
  if (pct >= 0.8) return { color: '#0A7040', bg: 'rgba(14,168,106,0.12)', border: 'rgba(14,168,106,0.30)' }
  if (pct >= 0.6) return { color: '#B45309', bg: 'rgba(245,158,11,0.13)', border: 'rgba(245,158,11,0.30)' }
  return { color: '#C0202E', bg: 'rgba(232,72,85,0.12)', border: 'rgba(232,72,85,0.30)' }
}

function ScoreChip({ value }: { value: number | null }) {
  if (value == null) {
    return (
      <span
        className="inline-flex items-center justify-center"
        style={{ width: 26, height: 26, borderRadius: 7, background: '#FAFBFE', border: '1px solid #EEF0F6' }}
      >
        <span style={{ width: 9, height: 1.5, borderRadius: 2, background: '#CBCFDE' }} />
      </span>
    )
  }
  const s = scoreColor(value)
  return (
    <span
      className="inline-flex items-center justify-center"
      style={{ width: 26, height: 26, borderRadius: 7, background: s.bg, border: `1px solid ${s.border}`, color: s.color, fontSize: 12.5, fontWeight: 800 }}
    >
      {value}
    </span>
  )
}

const DCOL = '2.7fr 1fr 1.1fr 1fr 0.7fr'

const LABEL: React.CSSProperties = {
  display: 'block', fontSize: 11, color: '#8B90A7', fontWeight: 600, marginBottom: 6,
}
const REMARKS_BOX: React.CSSProperties = {
  background: '#fff', border: '1px solid #E8EAF2', borderRadius: 8,
  padding: '10px 12px', minHeight: 70, fontSize: 12.5, lineHeight: 1.55,
}
const SCORE_BOX: React.CSSProperties = {
  background: '#fff', border: '1px solid #E8EAF2', borderRadius: 8,
  height: 40, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
  padding: '0 14px', fontSize: 14, fontWeight: 700, color: '#1C2035',
}
const REMARKS_INPUT: React.CSSProperties = {
  width: '100%', background: '#fff', border: '1px solid #E8EAF2', borderRadius: 8,
  padding: '10px 12px', minHeight: 70, fontSize: 12.5, lineHeight: 1.55,
  color: '#1C2035', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box',
}
const SCORE_INPUT: React.CSSProperties = {
  width: '100%', background: '#fff', border: '1px solid #E8EAF2', borderRadius: 8,
  height: 40, padding: '0 12px', fontSize: 14, fontWeight: 700, color: '#1C2035',
  outline: 'none', textAlign: 'right', fontFamily: 'inherit', boxSizing: 'border-box',
}

export default function KPIReviewDetailsPage({ onBack, year, initialStage, mode, assessorName = 'Sara Johnson', employeeName, backLabel = 'My Performance', onSubmit, assessorDone = true, showRecommendedRating = false }: KPIReviewDetailsPageProps) {
  const [tab, setTab]           = useState(initialStage && STAGE_TABS.some(t => t.key === initialStage) ? initialStage : 'Q1')
  const [expanded, setExpanded] = useState<string | null>(null)

  const reviewed = mode === 'reviewed'
  const assrDone = assessorDone            // in reviewed mode: has the manager completed their assessment?
  const assessor = mode === 'assessor'          // manager filling assessor feedback
  const selfEditable = mode === 'self'          // employee filling self-assessment

  /* ── Editable entries (self OR assessor) ── keyed by `${tab}:${critId}` */
  type Entry = { remarks: string; score: string; saved: boolean }
  const emptyEntry: Entry = { remarks: '', score: '', saved: false }
  const [selfEntries, setSelfEntries] = useState<Record<string, Entry>>({})
  const [assrEntries, setAssrEntries] = useState<Record<string, Entry>>({})

  const entryKey = (critId: string) => `${tab}:${critId}`
  const isValidScore = (s: string) => {
    const n = parseInt(s, 10)
    return s !== '' && !isNaN(n) && n >= 1 && n <= MAX
  }

  // self
  const getEntry = (critId: string): Entry => selfEntries[entryKey(critId)] ?? emptyEntry
  function updateEntry(critId: string, patch: Partial<Entry>) {
    const k = entryKey(critId)
    setSelfEntries(prev => ({ ...prev, [k]: { ...(prev[k] ?? emptyEntry), ...patch } }))
  }
  function saveSelf(critId: string) {
    if (!isValidScore(getEntry(critId).score)) return
    updateEntry(critId, { saved: true })
    setExpanded(null)
  }

  // assessor
  const getAssr = (critId: string): Entry => assrEntries[entryKey(critId)] ?? emptyEntry
  function updateAssr(critId: string, patch: Partial<Entry>) {
    const k = entryKey(critId)
    setAssrEntries(prev => ({ ...prev, [k]: { ...(prev[k] ?? emptyEntry), ...patch } }))
  }
  function saveAssr(critId: string) {
    if (!isValidScore(getAssr(critId).score)) return
    updateAssr(critId, { saved: true })
    setExpanded(null)
  }

  /* ── Final comments (assessor mode editable) ── keyed by tab */
  const [finalComments, setFinalComments] = useState<Record<string, string>>({})
  const [recRatings, setRecRatings]       = useState<Record<string, string>>({})

  /* ── Submit flow ── */
  const [submitting, setSubmitting]   = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirming, setConfirming]   = useState(false)

  const savedCount = reviewed
    ? CRITERIA.length
    : assessor
    ? CRITERIA.filter(c => getAssr(c.id).saved).length
    : CRITERIA.filter(c => getEntry(c.id).saved).length
  const allSaved   = savedCount === CRITERIA.length
  const activeTable = reviewed || tab === 'Q1'   // Q2/Q3/Annual not open yet in the current cycle
  const selfTotal  = reviewed || assessor
    ? SELF_SCORES[tab].slice(0, CRITERIA.length).reduce((a, b) => a + b, 0)
    : CRITERIA.reduce((a, c) => { const e = getEntry(c.id); return a + (e.saved ? (parseInt(e.score, 10) || 0) : 0) }, 0)
  const assessorTotal = CRITERIA.reduce((a, c) => { const e = getAssr(c.id); return a + (e.saved ? (parseInt(e.score, 10) || 0) : 0) }, 0)

  function handleSubmitClick() {
    if (!allSaved || submitting) return
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setConfirmOpen(true) }, 800)
  }
  function handleConfirm() {
    if (confirming) return
    setConfirming(true)
    setTimeout(() => { setConfirming(false); setConfirmOpen(false); onSubmit?.() }, 900)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes kdRow   { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:translateY(0) } }
        @keyframes kdFade  { from { opacity:0 } to { opacity:1 } }
        @keyframes kdModal { from { opacity:0; transform:translateY(10px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes kdSpin  { to { transform: rotate(360deg) } }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2" style={{ marginBottom: 22 }}>
        <button
          onClick={onBack}
          title="Back"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff';    e.currentTarget.style.borderColor = C.border }}
        >
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <button
          onClick={onBack}
          style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
        >
          {backLabel}
        </button>
        {employeeName && (
          <>
            <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>{employeeName}</span>
          </>
        )}
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>
          Appraisal Cycle January {year} to December {year}
        </span>
      </div>

      {/* ── Unified appraisal card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        {/* Header: tabs (left) + assessor (right) */}
        <div
          className="flex items-center justify-between gap-4 flex-wrap"
          style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, background: '#FCFCFE' }}
        >
          {/* light small segmented tabs */}
          <div className="flex items-center gap-1" style={{ background: C.hover, borderRadius: 10, padding: 4 }}>
            {STAGE_TABS.map(t => {
              const active = tab === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => { setTab(t.key); setExpanded(null) }}
                  className="rounded-lg border-none cursor-pointer font-semibold transition-all duration-150 flex-shrink-0"
                  style={{
                    height: 30, padding: '0 16px', fontSize: 12.5,
                    background: active ? 'rgba(99,102,241,0.14)' : 'transparent',
                    color: active ? C.indigo : C.muted,
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = C.muted }}
                >
                  {t.label}
                </button>
              )
            })}
          </div>

          {/* Assessor's Name */}
          <div className="flex items-center gap-2 flex-shrink-0" style={{ paddingRight: 4 }}>
            <span style={{ fontSize: 10.5, color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Assessor's Name
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{assessorName}</span>
          </div>
        </div>

        {activeTable ? (
        <>
        {/* Column header */}
        <div
          className="grid items-center"
          style={{ gridTemplateColumns: DCOL, padding: '11px 20px', background: '#FAFBFE', borderBottom: `1px solid ${C.border}` }}
        >
          {['Criteria', 'Self Score', 'Assessor Score', 'Status', 'Action'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#9498B0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {CRITERIA.map((crit, i) => {
          const entry = getEntry(crit.id)
          const assrEntry = getAssr(crit.id)
          const selfSaved = selfEditable && entry.saved
          const assrSaved = assessor && assrEntry.saved
          const self = (reviewed || assessor) ? SELF_SCORES[tab][i] : (selfSaved ? parseInt(entry.score, 10) : null)
          const assr = reviewed && assrDone ? ASSESSOR_SCORES[tab][i] : assessor ? (assrSaved ? parseInt(assrEntry.score, 10) : null) : null
          const isOpen = expanded === crit.id
          return (
            <div key={crit.id} style={{ borderBottom: '1px solid #F2F3F9' }}>
              <div
                className="grid items-center"
                style={{ gridTemplateColumns: DCOL, padding: '13px 20px', background: isOpen ? '#F9FAFE' : 'transparent', transition: 'background 0.15s' }}
                onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = '#F9FAFE' }}
                onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent' }}
              >
                {/* Criteria */}
                <div className="min-w-0" style={{ paddingRight: 14 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, lineHeight: 1.35 }}>{crit.name}</div>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>{crit.tag}</span>
                </div>
                {/* Self */}
                <div><ScoreChip value={self} /></div>
                {/* Assessor */}
                <div><ScoreChip value={assr} /></div>
                {/* Status */}
                <div>
                  {(reviewed && assrDone) || assrSaved ? (
                    <span className="inline-flex items-center gap-1.5" style={{ fontSize: 11.5, fontWeight: 700, color: '#0A7040', background: 'rgba(14,168,106,0.12)', border: '1px solid rgba(14,168,106,0.28)', borderRadius: 7, padding: '4px 10px' }}>
                      <CheckCircle2 size={13} strokeWidth={2.4} /> Reviewed
                    </span>
                  ) : reviewed ? (
                    <span className="inline-flex items-center gap-1.5" style={{ fontSize: 11.5, fontWeight: 700, color: '#B45309', background: 'rgba(245,158,11,0.13)', border: '1px solid rgba(245,158,11,0.28)', borderRadius: 7, padding: '4px 10px', whiteSpace: 'nowrap' }}>
                      <Clock3 size={13} strokeWidth={2.4} /> Awaiting Review
                    </span>
                  ) : selfSaved ? (
                    <span className="inline-flex items-center gap-1.5" style={{ fontSize: 11.5, fontWeight: 700, color: '#2563C9', background: 'rgba(37,99,235,0.10)', border: '1px solid rgba(37,99,235,0.26)', borderRadius: 7, padding: '4px 10px', whiteSpace: 'nowrap' }}>
                      <CheckCircle2 size={13} strokeWidth={2.4} /> Updated
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#9498B0', background: '#F4F5FA', border: '1px solid #EBEDF4', borderRadius: 6, padding: '4px 10px', whiteSpace: 'nowrap' }}>
                      {assessor ? 'Yet to review' : 'Yet to update'}
                    </span>
                  )}
                </div>
                {/* Action */}
                <div>
                  <button
                    onClick={() => setExpanded(isOpen ? null : crit.id)}
                    className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-all duration-150"
                    style={{ width: 28, height: 28, background: 'rgba(99,102,241,0.10)', color: C.indigo }}
                    title={isOpen ? 'Hide detail' : 'View detail'}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.10)' }}
                  >
                    <ChevronDown size={14} strokeWidth={2.2} style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div style={{ padding: '2px 20px 18px', animation: 'kdRow 0.18s ease' }}>
                  <div className="mt-4" style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>

                    {/* Weightage + Description (only this block keeps the light bg) */}
                    <div style={{ padding: '14px 18px', background: '#F4F6FB', borderBottom: `1px solid ${C.border}` }}>
                      <div className="flex gap-3" style={{ marginBottom: 8 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.navy, width: 84, flexShrink: 0 }}>Weightage</span>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: C.indigo }}>{crit.weight.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-3">
                        <span style={{ fontSize: 12, fontWeight: 700, color: C.navy, width: 84, flexShrink: 0 }}>Description</span>
                        <span style={{ fontSize: 12.5, color: '#5A6080', lineHeight: 1.55 }}>
                          {crit.desc}
                          <span style={{ color: C.muted }}> (Rating: 5 – Strong Contribution, 3 – Basic Contribution, 1 – No Contribution)</span>
                        </span>
                      </div>
                    </div>

                    {/* Self Assessment */}
                    <div style={{ padding: '16px 18px', borderBottom: `1px solid ${C.border}` }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Self Assessment</span>
                        {selfEditable && (
                          <button
                            onClick={() => saveSelf(crit.id)}
                            disabled={!isValidScore(entry.score)}
                            className="inline-flex items-center gap-1.5 border-none bg-transparent"
                            style={{
                              fontSize: 12, fontWeight: 700, padding: 0, fontFamily: 'inherit',
                              color: !isValidScore(entry.score) ? '#C0C4D6' : entry.saved ? '#0A7040' : '#0A8A58',
                              cursor: isValidScore(entry.score) ? 'pointer' : 'not-allowed',
                            }}
                          >
                            {entry.saved
                              ? <><CheckCircle2 size={14} strokeWidth={2.4} /> Saved</>
                              : <><Save size={14} strokeWidth={2.2} /> Save</>}
                          </button>
                        )}
                      </div>
                      <div className="grid" style={{ gridTemplateColumns: '1fr 150px', gap: 16 }}>
                        <div>
                          <label style={LABEL}>Remarks</label>
                          {selfEditable ? (
                            <textarea
                              value={entry.remarks}
                              onChange={e => updateEntry(crit.id, { remarks: e.target.value, saved: false })}
                              placeholder="Enter your remarks / achievements…"
                              style={REMARKS_INPUT}
                              onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                              onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                            />
                          ) : (
                            <div style={{ ...REMARKS_BOX, color: '#5A6080' }}>
                              Consistently applied best practices for this KPI and delivered reliable, high-quality output throughout the cycle.
                            </div>
                          )}
                        </div>
                        <div>
                          <label style={LABEL}>Score</label>
                          {selfEditable ? (
                            <input
                              value={entry.score}
                              onChange={e => {
                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 1)
                                updateEntry(crit.id, { score: v, saved: false })
                              }}
                              placeholder="0"
                              inputMode="numeric"
                              style={SCORE_INPUT}
                              onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                              onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                            />
                          ) : (
                            <div style={SCORE_BOX}>{self}</div>
                          )}
                          {selfEditable && <div style={{ fontSize: 10.5, color: C.muted, marginTop: 5, textAlign: 'right' }}>Out of {MAX}</div>}
                        </div>
                      </div>
                    </div>

                    {/* Assessor Feedback */}
                    <div style={{ padding: '16px 18px' }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Assessor Feedback</span>
                        {assessor && (
                          <button
                            onClick={() => saveAssr(crit.id)}
                            disabled={!isValidScore(assrEntry.score)}
                            className="inline-flex items-center gap-1.5 border-none bg-transparent"
                            style={{
                              fontSize: 12, fontWeight: 700, padding: 0, fontFamily: 'inherit',
                              color: !isValidScore(assrEntry.score) ? '#C0C4D6' : assrEntry.saved ? '#0A7040' : '#0A8A58',
                              cursor: isValidScore(assrEntry.score) ? 'pointer' : 'not-allowed',
                            }}
                          >
                            {assrEntry.saved
                              ? <><CheckCircle2 size={14} strokeWidth={2.4} /> Saved</>
                              : <><Save size={14} strokeWidth={2.2} /> Save</>}
                          </button>
                        )}
                      </div>
                      <div className="grid" style={{ gridTemplateColumns: '1fr 150px', gap: 16 }}>
                        <div>
                          <label style={LABEL}>Remarks</label>
                          {assessor ? (
                            <textarea
                              value={assrEntry.remarks}
                              onChange={e => updateAssr(crit.id, { remarks: e.target.value, saved: false })}
                              placeholder="Enter your review remarks / improvement suggestions…"
                              style={REMARKS_INPUT}
                              onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                              onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                            />
                          ) : (
                            <div style={{ ...REMARKS_BOX, color: (reviewed && assrDone) ? '#5A6080' : C.muted, fontStyle: (reviewed && assrDone) ? 'normal' : 'italic' }}>
                              {reviewed && assrDone
                                ? 'Good, consistent performance on this criterion. Continue maintaining the standard and sharing learnings with the team.'
                                : reviewed
                                ? 'Awaiting manager review.'
                                : ''}
                            </div>
                          )}
                        </div>
                        <div>
                          <label style={LABEL}>Score</label>
                          {assessor ? (
                            <input
                              value={assrEntry.score}
                              onChange={e => {
                                const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 1)
                                updateAssr(crit.id, { score: v, saved: false })
                              }}
                              placeholder="0"
                              inputMode="numeric"
                              style={SCORE_INPUT}
                              onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                              onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                            />
                          ) : (
                            <div style={SCORE_BOX}>{assr != null ? assr : ''}</div>
                          )}
                          {assessor && <div style={{ fontSize: 10.5, color: C.muted, marginTop: 5, textAlign: 'right' }}>Out of {MAX}</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Total footer */}
        <div
          className="grid items-center"
          style={{ gridTemplateColumns: DCOL, padding: '14px 20px', background: '#F7F8FC', borderBottom: `1px solid ${C.border}` }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, textAlign: 'right', paddingRight: 18 }}>Total</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>
            {(() => {
              if (reviewed) {
                return <>{SELF_SCORES[tab].reduce((a, b) => a + b, 0)}<span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}> / {CRITERIA.length * MAX}</span></>
              }
              const saved = CRITERIA.filter(c => getEntry(c.id).saved)
              if (saved.length === 0) return <span style={{ color: '#C0C4D6' }}>—</span>
              const sum = saved.reduce((a, c) => a + (parseInt(getEntry(c.id).score, 10) || 0), 0)
              return <>{sum}<span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}> / {CRITERIA.length * MAX}</span></>
            })()}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>
            {reviewed
              ? (assrDone
                  ? <>{ASSESSOR_SCORES[tab].reduce((a, b) => a + b, 0)}<span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}> / {CRITERIA.length * MAX}</span></>
                  : <span style={{ color: '#C0C4D6' }}>—</span>)
              : assessor
              ? (CRITERIA.some(c => getAssr(c.id).saved)
                  ? <>{assessorTotal}<span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}> / {CRITERIA.length * MAX}</span></>
                  : <span style={{ color: '#C0C4D6' }}>—</span>)
              : <span style={{ color: '#C0C4D6' }}>—</span>}
          </div>
          <div /><div />
        </div>

        {/* Final comments (+ Recommended rating for manager/admin) — even 6/6 split when rating shown */}
        <div
          style={{
            padding: '18px 20px',
            display: 'grid',
            gridTemplateColumns: showRecommendedRating ? '1fr 1fr' : '1fr',
            gap: 20,
            alignItems: 'stretch',
          }}
        >
          {/* ── Final Comments (Assessor) ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={15} strokeWidth={2} style={{ color: C.indigo }} />
              <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Final Comments (Assessor)</span>
            </div>
            {reviewed && assrDone ? (
              <div style={{ background: C.hover, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px', fontSize: 13, color: '#3D4266', lineHeight: 1.6, minHeight: 92 }}>
                {FINAL_COMMENTS[tab]}
              </div>
            ) : reviewed ? (
              <div className="flex items-center justify-center" style={{ border: `1px dashed ${C.border}`, borderRadius: 10, padding: '20px 16px', fontSize: 13, color: C.muted, fontStyle: 'italic', minHeight: 92 }}>
                Pending manager review — final comments not added yet.
              </div>
            ) : assessor ? (
              <textarea
                value={finalComments[tab] ?? ''}
                onChange={e => setFinalComments(prev => ({ ...prev, [tab]: e.target.value }))}
                placeholder="Summarize the overall performance for this cycle…"
                style={{ ...REMARKS_INPUT, minHeight: 92 }}
                onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border }}
              />
            ) : (
              <div
                className="flex items-center justify-center"
                style={{ border: `1px dashed ${C.border}`, borderRadius: 10, padding: '20px 16px', fontSize: 13, color: C.muted, fontStyle: 'italic', minHeight: 92 }}
              >
                Yet to update — pending manager review.
              </div>
            )}
          </div>

          {/* ── Recommended Rating (Assessor) — manager + admin only ── */}
          {showRecommendedRating && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={15} strokeWidth={2} style={{ color: C.indigo }} />
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Recommended Rating</span>
              </div>
              {reviewed && assrDone ? (
                <div className="flex items-center" style={{ background: C.hover, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px', fontSize: 15, fontWeight: 800, color: C.navy, minHeight: 92 }}>
                  {RECOMMENDED_RATINGS[tab]}<span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>&nbsp;/ {MAX}</span>
                </div>
              ) : reviewed ? (
                <div className="flex items-center justify-center" style={{ border: `1px dashed ${C.border}`, borderRadius: 10, padding: '20px 16px', fontSize: 13, color: C.muted, fontStyle: 'italic', minHeight: 92 }}>
                  Pending manager review — rating not added yet.
                </div>
              ) : assessor ? (
                <input
                  type="number"
                  min={0}
                  max={MAX}
                  value={recRatings[tab] ?? ''}
                  onChange={e => setRecRatings(prev => ({ ...prev, [tab]: e.target.value }))}
                  placeholder={`Enter rating (0–${MAX})`}
                  style={{ ...SCORE_INPUT, textAlign: 'left', height: 44 }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                />
              ) : (
                <div
                  className="flex items-center justify-center"
                  style={{ border: `1px dashed ${C.border}`, borderRadius: 10, padding: '20px 16px', fontSize: 13, color: C.muted, fontStyle: 'italic', minHeight: 92 }}
                >
                  Yet to update — pending manager review.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Draft + Submit footer (pending only) */}
        {!reviewed && (
          <div
            className="flex items-center justify-end gap-3 flex-wrap"
            style={{ padding: '14px 20px', borderTop: `1px solid ${C.border}`, background: '#FCFCFE' }}
          >
            {!allSaved && (
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginRight: 'auto' }}>
                Complete all {CRITERIA.length} criteria to submit — {savedCount}/{CRITERIA.length} done
              </span>
            )}
            <button
              onClick={onBack}
              className="rounded-lg font-semibold cursor-pointer transition-all duration-150"
              style={{ height: 40, padding: '0 18px', fontSize: 13, background: '#fff', border: `1px solid ${C.border}`, color: C.navy }}
              onMouseEnter={e => { e.currentTarget.style.background = C.hover }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
            >
              Save as Draft
            </button>
            <button
              onClick={handleSubmitClick}
              disabled={!allSaved || submitting}
              className="inline-flex items-center gap-2 rounded-lg border-none font-semibold transition-all duration-150"
              style={{
                height: 40, padding: '0 22px', fontSize: 13,
                background: allSaved ? C.indigo : '#E4E6EF',
                color: allSaved ? '#fff' : '#B0B4C8',
                cursor: allSaved && !submitting ? 'pointer' : 'not-allowed',
              }}
            >
              {submitting
                ? <><Loader2 size={15} strokeWidth={2.4} style={{ animation: 'kdSpin 0.8s linear infinite' }} /> Submitting…</>
                : <><Send size={15} strokeWidth={2.2} /> {assessor ? 'Submit Final Evaluation' : 'Submit'}</>}
            </button>
          </div>
        )}
        </>
        ) : (
          /* Q2 / Q3 / Annual — not open yet */
          <div className="flex flex-col items-center justify-center text-center" style={{ padding: '52px 24px', gap: 14 }}>
            <div className="flex items-center justify-center" style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <Info size={26} strokeWidth={1.8} style={{ color: C.indigo }} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>
              {tab === 'Annual' ? 'Annual' : tab} review is not open yet
            </div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, maxWidth: 440 }}>
              The {tab === 'Annual' ? 'Annual' : tab} {year} appraisal will open during its review period.
              You'll be able to complete your self-assessment once it becomes active.
            </p>
          </div>
        )}
      </div>

      {/* ── Submit confirmation popup ── */}
      {confirmOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: 'rgba(28,32,53,0.45)', zIndex: 60, padding: 20, animation: 'kdFade 0.16s ease' }}
          onClick={() => { if (!confirming) setConfirmOpen(false) }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 460, overflow: 'hidden', boxShadow: '0 24px 60px rgba(28,32,53,0.28)', animation: 'kdModal 0.2s cubic-bezier(0.4,0,0.2,1)' }}
          >
            {/* header */}
            <div className="flex items-center justify-between" style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.11)', border: '1px solid rgba(99,102,241,0.2)' }}>
                  <Send size={16} strokeWidth={2} style={{ color: C.indigo }} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{assessor ? 'Submit Final Evaluation' : 'Submit Self-Assessment'}</span>
              </div>
              <button
                onClick={() => { if (!confirming) setConfirmOpen(false) }}
                className="flex items-center justify-center rounded-lg border-none cursor-pointer"
                style={{ width: 30, height: 30, background: C.hover, color: C.muted }}
              >
                <X size={16} strokeWidth={2.2} />
              </button>
            </div>

            {/* body */}
            <div style={{ padding: '20px 22px' }}>
              <p style={{ fontSize: 13.5, color: '#3D4266', lineHeight: 1.6, marginBottom: 16 }}>
                {assessor ? (
                  <>You are about to submit your <strong style={{ color: C.navy }}>{tab} {year}</strong> evaluation for <strong style={{ color: C.navy }}>{employeeName ?? 'this employee'}</strong> to the admin.
                  Once submitted, the review will be locked and cannot be edited.</>
                ) : (
                  <>You are about to submit your <strong style={{ color: C.navy }}>{tab} {year}</strong> self-assessment to your reporting manager.
                  Once submitted, your responses will be locked and cannot be edited.</>
                )}
              </p>
              <div style={{ background: C.hover, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
                {(assessor ? [
                  { label: 'Review Cycle',         value: `${tab} · ${year}` },
                  { label: 'Criteria Reviewed',    value: `${savedCount} of ${CRITERIA.length}` },
                  { label: 'Total Assessor Score', value: `${assessorTotal} / ${CRITERIA.length * MAX}` },
                  { label: 'Employee',             value: employeeName ?? '—' },
                ] : [
                  { label: 'Review Cycle',        value: `${tab} · ${year}` },
                  { label: 'Criteria Completed',  value: `${savedCount} of ${CRITERIA.length}` },
                  { label: 'Total Self Score',    value: `${selfTotal} / ${CRITERIA.length * MAX}` },
                  { label: 'Reporting Manager',   value: assessorName },
                ]).map((r, i) => (
                  <div key={r.label} className="flex items-center justify-between" style={{ padding: '7px 0', borderTop: i > 0 ? `1px solid ${C.border}` : 'none' }}>
                    <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>{r.label}</span>
                    <span style={{ fontSize: 13, color: C.navy, fontWeight: 700 }}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-end gap-3" style={{ padding: '14px 22px', borderTop: `1px solid ${C.border}` }}>
              <button
                onClick={() => { if (!confirming) setConfirmOpen(false) }}
                disabled={confirming}
                className="rounded-lg font-semibold cursor-pointer transition-all duration-150"
                style={{ height: 40, padding: '0 18px', fontSize: 13, background: '#fff', border: `1px solid ${C.border}`, color: C.navy }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="inline-flex items-center gap-2 rounded-lg border-none font-semibold transition-all duration-150"
                style={{ height: 40, padding: '0 22px', fontSize: 13, background: C.indigo, color: '#fff', cursor: confirming ? 'wait' : 'pointer' }}
              >
                {confirming
                  ? <><Loader2 size={15} strokeWidth={2.4} style={{ animation: 'kdSpin 0.8s linear infinite' }} /> Submitting…</>
                  : <><CheckCircle2 size={15} strokeWidth={2.2} /> Confirm &amp; Submit</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
