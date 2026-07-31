import { useState } from 'react'
import { Star, ShieldCheck, Send, Sparkles, Lock, XCircle } from 'lucide-react'
import type { ElementType } from 'react'
import { PreviewSwitcher, type OffboardingTabProps } from './offboardingShared'

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
  surface: '#F7F8FC',
  indigo: '#6366F1',
  gold: '#F59E0B',
}

const ASPECTS = [
  { key: 'overall',   label: 'Overall Experience', required: true },
  { key: 'culture',   label: 'Work Environment & Culture' },
  { key: 'manager',   label: 'Relationship with Manager' },
  { key: 'pay',       label: 'Compensation & Benefits' },
  { key: 'growth',    label: 'Career Growth & Learning' },
  { key: 'balance',   label: 'Work–Life Balance' },
] as const

type AspectKey = typeof ASPECTS[number]['key']
type Choice = 'Yes' | 'Maybe' | 'No'

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 8 }}>
      {children}{required && <span style={{ color: '#E84855', marginLeft: 3 }}>*</span>}
    </label>
  )
}

const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 12px', fontSize: 13, color: C.navy,
  border: `1px solid ${C.border}`, borderRadius: 9, fontFamily: 'inherit',
  background: '#fff', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s',
}
function focusOn(e: React.FocusEvent<HTMLElement>) { e.currentTarget.style.borderColor = C.indigo }
function focusOff(e: React.FocusEvent<HTMLElement>) { e.currentTarget.style.borderColor = C.border }

function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"
      style={{ animation: 'eiSpin 0.7s linear infinite', flexShrink: 0 }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

const RATING_TEXT = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

function StarRating({ value, onChange, readOnly }: { value: number; onChange?: (v: number) => void; readOnly?: boolean }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 2, 3, 4, 5].map(n => {
          const active = n <= shown
          return (
            <button
              key={n}
              type="button"
              disabled={readOnly}
              onClick={() => onChange?.(n)}
              onMouseEnter={() => !readOnly && setHover(n)}
              onMouseLeave={() => !readOnly && setHover(0)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: readOnly ? 'default' : 'pointer', lineHeight: 0 }}
            >
              <Star size={22} strokeWidth={1.8}
                style={{ color: active ? C.gold : '#D4D7E3', fill: active ? C.gold : 'transparent', transition: 'all 0.12s' }} />
            </button>
          )
        })}
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: shown ? C.navy : C.muted, minWidth: 62 }}>
        {shown ? RATING_TEXT[shown] : 'Not rated'}
      </span>
    </div>
  )
}

function Segmented({ value, onChange, err }: { value: Choice | ''; onChange: (v: Choice) => void; err?: boolean }) {
  const opts: Choice[] = ['Yes', 'Maybe', 'No']
  const color: Record<Choice, string> = { Yes: '#0EA86A', Maybe: '#F59E0B', No: '#E84855' }
  return (
    <div style={{ display: 'inline-flex', gap: 8 }}>
      {opts.map(o => {
        const sel = value === o
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            style={{
              padding: '8px 18px', borderRadius: 9, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
              background: sel ? `${color[o]}14` : '#fff',
              border: `1px solid ${sel ? color[o] : (err ? '#E84855' : C.border)}`,
              color: sel ? color[o] : C.muted, transition: 'all 0.15s',
            }}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

function SectionTitle({ n, title, subtitle }: { n: number; title: string; subtitle?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, marginBottom: 16 }}>
      <div style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(99,102,241,0.10)', color: C.indigo, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{n}</div>
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, margin: '2px 0 0' }}>{subtitle}</p>}
      </div>
    </div>
  )
}

export default function ExitInterviewPage({ reviewState, onReviewChange }: OffboardingTabProps) {
  const [submitted, setSubmitted] = useState(false)
  const [ratings, setRatings] = useState<Record<AspectKey, number>>({ overall: 0, culture: 0, manager: 0, pay: 0, growth: 0, balance: 0 })
  const [enjoyed, setEnjoyed] = useState('')
  const [improve, setImprove] = useState('')
  const [recommend, setRecommend] = useState<Choice | ''>('')
  const [rejoin, setRejoin] = useState<Choice | ''>('')
  const [comments, setComments] = useState('')
  const [showErr, setShowErr] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const errOverall = showErr && !ratings.overall
  const errImprove = showErr && !improve.trim()
  const errRecommend = showErr && !recommend

  function setRating(k: AspectKey, v: number) { setRatings(r => ({ ...r, [k]: v })) }

  function handleSubmit() {
    if (!ratings.overall || !improve.trim() || !recommend) { setShowErr(true); return }
    setSubmitLoading(true)
    setTimeout(() => { setSubmitLoading(false); setConfirm(true) }, 900)
  }

  const subtitle =
    reviewState === 'rejected'
      ? 'Your resignation was not accepted, so there’s no exit interview to complete.'
      : reviewState === 'pending'
      ? 'Your exit interview will open once your offboarding begins.'
      : submitted
      ? 'Thank you for sharing your feedback.'
      : 'Help us improve by sharing your honest feedback about your time with us.'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes eiSpin { to { transform: rotate(360deg) } }`}</style>

      {/* Header + preview switcher */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0 }}>Exit Interview</h2>
          <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, margin: '3px 0 0' }}>{subtitle}</p>
        </div>
        <PreviewSwitcher value={reviewState} onChange={onReviewChange} />
      </div>

      {/* ── Gated (pending / rejected) ── */}
      {reviewState !== 'approved' ? (
        <LockedNote state={reviewState} />
      ) : submitted ? (
        /* ── Submitted / thank-you ── */
        <>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '32px 28px', textAlign: 'center', marginBottom: 18 }}>
            <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(14,168,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Sparkles size={28} strokeWidth={1.8} style={{ color: '#0A7040' }} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 6px' }}>Your feedback has been submitted</h3>
            <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, margin: '0 auto', maxWidth: 420, lineHeight: 1.6 }}>
              Thank you for taking the time to complete your exit interview. Your responses are confidential and help us build a better workplace. We wish you all the best!
            </p>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: '0 0 18px' }}>Your Responses</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {ASPECTS.map(a => (
                <div key={a.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: C.navy, fontWeight: 500 }}>{a.label}</span>
                  <StarRating value={ratings[a.key]} readOnly />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 20, paddingTop: 18, borderTop: `1px solid ${C.border}` }}>
              <Summary label="Would recommend us" value={recommend || '—'} />
              <Summary label="Would return in future" value={rejoin || '—'} />
            </div>
          </div>
        </>
      ) : (
        /* ── Form ── */
        <>
          <div style={{ display: 'flex', gap: 12, background: 'rgba(14,168,106,0.06)', border: '1px solid rgba(14,168,106,0.22)', borderRadius: 12, padding: '13px 16px', marginBottom: 18 }}>
            <ShieldCheck size={18} strokeWidth={1.9} style={{ color: '#0A7040', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12.5, color: '#0A7040', fontWeight: 500, margin: 0, lineHeight: 1.55 }}>
              Your responses are <strong>confidential</strong> and are used only to improve our workplace. Please be candid.
            </p>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
            {/* 1. Ratings */}
            <SectionTitle n={1} title="Rate your experience" subtitle="Tap the stars to rate each area." />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {ASPECTS.map((a, i) => (
                <div key={a.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '16px 0', borderBottom: i < ASPECTS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <span style={{ fontSize: 13.5, color: C.navy, fontWeight: 500 }}>
                    {a.label}{'required' in a && a.required && <span style={{ color: '#E84855', marginLeft: 3 }}>*</span>}
                  </span>
                  <StarRating value={ratings[a.key]} onChange={v => setRating(a.key, v)} />
                </div>
              ))}
            </div>
            {errOverall && <p style={{ fontSize: 11.5, color: '#E84855', fontWeight: 600, margin: '8px 0 0' }}>Please rate your overall experience.</p>}

            {/* 2. Feedback */}
            <div style={{ marginTop: 26, paddingTop: 22, borderTop: `1px solid ${C.border}` }}>
              <SectionTitle n={2} title="Your feedback" />
              <div style={{ marginBottom: 16 }}>
                <FieldLabel>What did you enjoy most?</FieldLabel>
                <textarea value={enjoyed} onChange={e => setEnjoyed(e.target.value)} onFocus={focusOn} onBlur={focusOff}
                  placeholder="The people, projects, culture, learning…" style={{ ...inputBase, minHeight: 84, resize: 'vertical' }} />
              </div>
              <div>
                <FieldLabel required>What could we improve?</FieldLabel>
                <textarea value={improve} onChange={e => setImprove(e.target.value)} onFocus={focusOn} onBlur={focusOff}
                  placeholder="Be candid — what would have made you stay or made your experience better?"
                  style={{ ...inputBase, minHeight: 84, resize: 'vertical', borderColor: errImprove ? '#E84855' : C.border }} />
                {errImprove && <p style={{ fontSize: 11.5, color: '#E84855', fontWeight: 600, margin: '6px 0 0' }}>Please share what we could improve.</p>}
              </div>
            </div>

            {/* 3. Recommendation */}
            <div style={{ marginTop: 26, paddingTop: 22, borderTop: `1px solid ${C.border}` }}>
              <SectionTitle n={3} title="Recommendation" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
                <div>
                  <FieldLabel required>Would you recommend us as a place to work?</FieldLabel>
                  <Segmented value={recommend} onChange={setRecommend} err={errRecommend} />
                  {errRecommend && <p style={{ fontSize: 11.5, color: '#E84855', fontWeight: 600, margin: '8px 0 0' }}>Please select an option.</p>}
                </div>
                <div>
                  <FieldLabel>Would you consider returning in future?</FieldLabel>
                  <Segmented value={rejoin} onChange={setRejoin} />
                </div>
              </div>
            </div>

            {/* 4. Additional comments */}
            <div style={{ marginTop: 26, paddingTop: 22, borderTop: `1px solid ${C.border}` }}>
              <SectionTitle n={4} title="Additional comments" subtitle="Anything else you'd like to share (optional)." />
              <textarea value={comments} onChange={e => setComments(e.target.value)} onFocus={focusOn} onBlur={focusOff}
                placeholder="Optional — any final thoughts for the team or HR…" style={{ ...inputBase, minHeight: 72, resize: 'vertical' }} />
            </div>

            {/* Actions */}
            <div style={{ marginTop: 24, paddingTop: 18, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minWidth: 200, padding: '11px 22px', borderRadius: 10, border: 'none', background: C.indigo, color: '#fff', fontSize: 13, fontWeight: 600, cursor: submitLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', opacity: submitLoading ? 0.85 : 1 }}
                onMouseEnter={e => { if (!submitLoading) e.currentTarget.style.background = '#4F46E5' }}
                onMouseLeave={e => { if (!submitLoading) e.currentTarget.style.background = C.indigo }}
              >
                {submitLoading ? (<><Spinner /> Submitting…</>) : (<><Send size={15} strokeWidth={2} /> Submit Exit Interview</>)}
              </button>
            </div>
          </div>
        </>
      )}

      {confirm && (
        <ConfirmModal
          Icon={Send}
          title="Submit your exit interview?"
          body="Your responses will be submitted to HR and cannot be edited afterwards. Please review before submitting."
          confirmLabel="Yes, Submit"
          onCancel={() => setConfirm(false)}
          onConfirm={() => { setConfirm(false); setSubmitted(true) }}
        />
      )}
    </div>
  )
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{value}</div>
    </div>
  )
}

/* ── Locked / not-applicable state shown before approval ── */
function LockedNote({ state }: { state: 'pending' | 'rejected' }) {
  const pending = state === 'pending'
  const Icon: ElementType = pending ? Lock : XCircle
  const iconColor = pending ? '#B45309' : '#C0202E'
  const iconBg = pending ? 'rgba(245,158,11,0.12)' : 'rgba(232,72,85,0.10)'
  const title = pending ? 'Exit Interview isn’t available yet' : 'Exit Interview not applicable'
  const body = pending
    ? 'You’ll be able to share your exit feedback once your resignation is approved and your offboarding begins. We’ll open it closer to your last working day.'
    : 'Your resignation wasn’t accepted, so there’s no exit interview to complete.'
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '48px 24px', textAlign: 'center' }}>
      <div style={{ width: 56, height: 56, borderRadius: 15, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Icon size={26} strokeWidth={1.8} style={{ color: iconColor }} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 700, color: C.navy, margin: 0 }}>{title}</p>
      <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, margin: '6px auto 0', maxWidth: 440, lineHeight: 1.65 }}>{body}</p>
    </div>
  )
}

function ConfirmModal({ Icon, title, body, confirmLabel, onCancel, onConfirm }: {
  Icon: ElementType; title: string; body: string; confirmLabel: string; onCancel: () => void; onConfirm: () => void
}) {
  const [loading, setLoading] = useState(false)
  function handleConfirm() { setLoading(true); setTimeout(onConfirm, 1300) }
  return (
    <div onClick={e => { if (e.target === e.currentTarget && !loading) onCancel() }}
      style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(10,12,28,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes eiSpin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ background: '#fff', borderRadius: 20, padding: '34px 30px 26px', width: 400, boxShadow: '0 24px 64px rgba(10,12,28,0.22)', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <Icon size={26} strokeWidth={1.9} style={{ color: C.indigo }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 8px' }}>{title}</h3>
        <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, lineHeight: 1.65, margin: '0 auto 24px', maxWidth: 320 }}>{body}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={loading}
            style={{ flex: 1, height: 44, borderRadius: 11, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.6 : 1 }}>
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading}
            style={{ flex: 1, height: 44, borderRadius: 11, border: 'none', background: C.indigo, color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.9 : 1 }}>
            {loading ? (<><Spinner /> Submitting…</>) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
