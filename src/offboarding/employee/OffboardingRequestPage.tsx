import { useState } from 'react'
import {
  DoorOpen, ChevronDown, ShieldCheck, CalendarClock, Users, FileCheck2,
  Clock3, CheckCircle2, XCircle, Info, RotateCcw,
} from 'lucide-react'
import { SHOW_REJECT_FLOW } from '../offboardingFlags'

/*
 * Employee › Offboarding Request (E1) — the entry screen of the whole flow.
 *
 * One menu, three states walkable via the compact "Preview" switcher (demo aid,
 * since the module has no shared backend):
 *   • form      → the request form
 *   • pending   → submitted, awaiting CTO approval (with Withdraw)
 *   • rejected  → CTO declined, shows reason + raise-again
 */

const C = {
  navy:   '#1C2035',
  border: '#E8EAF2',
  muted:  '#8B90A7',
  hover:  '#F0F2F8',
  indigo: '#6366F1',
  indigoDeep: '#5B5FDE',
}

const EMPLOYEE = {
  name: 'John Doe',
  code: 'CC001',
  designation: 'Senior Software Engineer',
  department: 'Engineering',
  manager: 'Priya Sharma',
  doj: '12 Mar 2021',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
}

const REASONS = [
  'Better Career Opportunity',
  'Career Growth / Role Change',
  'Higher Studies',
  'Relocation',
  'Work–Life Balance',
  'Compensation & Benefits',
  'Health / Personal Reasons',
  'Other',
]

const NEXT_STEPS = [
  { Icon: ShieldCheck,   title: 'CTO Approval',          desc: 'The Delivery Head reviews your request and sets your notice period.' },
  { Icon: CalendarClock, title: 'Notice Period',         desc: 'Your notice begins and your full offboarding view unlocks.' },
  { Icon: Users,         title: 'Department Clearances', desc: 'Manager, IT & Finance complete their clearances in parallel.' },
  { Icon: FileCheck2,    title: 'HR Closure',            desc: 'Exit interview, relieving & experience letters, then case closed.' },
]

const inputBase: React.CSSProperties = {
  width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
  fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  transition: 'border-color 0.15s', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: 11.5, fontWeight: 700, color: C.muted, display: 'block',
  marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase',
}

type View = 'form' | 'pending' | 'rejected'

function fmtDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function OffboardingRequestPage() {
  const [view, setView] = useState<View>('form')

  // form fields
  const [reason,  setReason]  = useState('')
  const [lwd,     setLwd]     = useState('')
  const [details, setDetails] = useState('')
  const [ack,     setAck]     = useState(false)

  // modals
  const [showConfirm, setShowConfirm]   = useState(false)
  const [submitting,  setSubmitting]    = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)

  const canSubmit = reason && lwd && details.trim() && ack

  async function handleFinalSubmit() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1400))
    setSubmitting(false)
    setShowConfirm(false)
    setView('pending')
  }

  function resetForm() {
    setReason(''); setLwd(''); setDetails(''); setAck(false)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes obFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}@keyframes obSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>
            Offboarding Request
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            Raise a request to begin your exit process
          </p>
        </div>
        <div
          className="flex items-center justify-center rounded-2xl flex-shrink-0"
          style={{
            width: 60, height: 60,
            backgroundColor: 'rgba(99,102,241,0.07)',
            backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.22) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
            border: '1px solid rgba(99,102,241,0.14)',
          }}
        >
          <div style={{ animation: 'obFloat 4s ease-in-out infinite' }}>
            <DoorOpen size={26} strokeWidth={1.5} style={{ color: C.indigoDeep }} />
          </div>
        </div>
      </div>

      {/* ── Preview switcher (demo aid — same design as probation's Demo · Prototype bar) ── */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 12, width: 'fit-content', boxSizing: 'border-box', marginBottom: 20,
        background: 'repeating-linear-gradient(45deg, rgba(99,102,241,0.035), rgba(99,102,241,0.035) 10px, rgba(99,102,241,0.06) 10px, rgba(99,102,241,0.06) 20px)',
        border: '1px dashed rgba(99,102,241,0.40)', borderRadius: 12, padding: '7px 12px',
      }}>
        <div style={{ display: 'flex', gap: 4, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 9, padding: 3 }}>
          {(([['form', 'Form'], ['pending', 'Pending'], ['rejected', 'Rejected']] as [View, string][])
            .filter(([v]) => SHOW_REJECT_FLOW || v !== 'rejected')
          ).map(([v, label]) => {
            const on = view === v
            return (
              <button key={v} onClick={() => setView(v)}
                style={{
                  padding: '8px 18px', borderRadius: 7, border: 'none', cursor: 'pointer',
                  fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 12, fontWeight: on ? 700 : 600, whiteSpace: 'nowrap',
                  background: on ? C.indigo : 'transparent', color: on ? '#fff' : C.muted,
                  boxShadow: on ? '0 1px 4px rgba(99,102,241,0.35)' : 'none', transition: 'all 0.12s',
                }}>
                {label}
              </button>
            )
          })}
        </div>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, fontSize: 10.5, fontWeight: 800, color: C.indigo, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.indigo }} />
          Demo · Prototype
        </span>
      </div>

      {view === 'form'     && <FormView {...{ reason, setReason, lwd, setLwd, details, setDetails, ack, setAck, canSubmit, onSubmit: () => setShowConfirm(true) }} />}
      {view === 'pending'  && <PendingView reason={reason} lwd={lwd} details={details} onWithdraw={() => setShowWithdraw(true)} />}
      {SHOW_REJECT_FLOW && view === 'rejected' && <RejectedView onRaiseNew={() => { resetForm(); setView('form') }} />}

      {/* ── Confirm modal ── */}
      {showConfirm && (
        <Modal onClose={() => setShowConfirm(false)} width={440}>
          <div style={{ padding: '26px 28px 20px', borderBottom: '1px solid #F0F2F8' }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
                <DoorOpen size={19} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>Confirm Offboarding Request</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>Please review before submitting</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SummaryRow label="Employee" value={`${EMPLOYEE.name} (${EMPLOYEE.code})`} />
            <SummaryRow label="Reason" value={reason || '—'} />
            <SummaryRow label="Intended Last Day" value={fmtDate(lwd)} />
            <div style={{ padding: '11px 14px', background: '#F7F8FC', borderRadius: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 7 }}>Details</div>
              <div style={{ fontSize: 13, color: details ? C.navy : '#C0C4D6', lineHeight: 1.6, fontStyle: details ? 'normal' : 'italic' }}>
                {details || 'No details provided'}
              </div>
            </div>
            <div className="flex items-start gap-2.5" style={{ padding: '11px 14px', background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.18)', borderRadius: 10 }}>
              <Info size={15} style={{ color: '#D97706', flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: '#9A6207', lineHeight: 1.55 }}>
                Your notice period will be confirmed by the Delivery Head. You can withdraw this request until it is approved.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3" style={{ padding: '0 28px 24px' }}>
            <button onClick={() => setShowConfirm(false)} style={ghostBtn}>Go Back</button>
            <button onClick={handleFinalSubmit} disabled={submitting} style={{ ...primaryBtn, flex: 1, opacity: submitting ? 0.85 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? <><Spinner /> Submitting…</> : 'Yes, Submit'}
            </button>
          </div>
        </Modal>
      )}

      {/* ── Withdraw modal ── */}
      {showWithdraw && (
        <Modal onClose={() => setShowWithdraw(false)} width={380}>
          <div style={{ padding: '32px 28px 24px', textAlign: 'center' }}>
            <div className="flex items-center justify-center mx-auto mb-4 rounded-2xl" style={{ width: 60, height: 60, background: 'rgba(232,72,85,0.10)' }}>
              <RotateCcw size={26} strokeWidth={1.8} style={{ color: '#E84855' }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 8 }}>Withdraw Request?</div>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65, marginBottom: 26 }}>
              This will cancel your offboarding request. You can always raise a new one later.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowWithdraw(false)} style={{ ...ghostBtn, flex: 1 }}>Keep Request</button>
              <button
                onClick={() => { setShowWithdraw(false); resetForm(); setView('form') }}
                style={{ flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700, border: 'none', background: '#E84855', color: '#fff', cursor: 'pointer' }}
              >
                Yes, Withdraw
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ════════════════════════ FORM VIEW ════════════════════════ */
function FormView({
  reason, setReason, lwd, setLwd, details, setDetails, ack, setAck, canSubmit, onSubmit,
}: {
  reason: string; setReason: (v: string) => void
  lwd: string; setLwd: (v: string) => void
  details: string; setDetails: (v: string) => void
  ack: boolean; setAck: (v: boolean) => void
  canSubmit: boolean | string; onSubmit: () => void
}) {
  const today = new Date().toISOString().split('T')[0]
  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: '8fr 4fr', alignItems: 'start' }}>
      {/* LEFT — form */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div className="flex items-center gap-2.5" style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
            <DoorOpen size={15} strokeWidth={2} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Request Details</span>
        </div>

        <div style={{ padding: '26px 24px' }}>
          {/* Employee (read-only rich) */}
          <div className="mb-6">
            <label style={labelStyle}>Employee</label>
            <div className="flex items-center gap-3" style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: '#F7F8FC', padding: '12px 14px' }}>
              <img src={EMPLOYEE.avatar} alt={EMPLOYEE.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: `2px solid #fff`, boxShadow: '0 1px 4px rgba(28,32,53,0.12)' }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{EMPLOYEE.name}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>({EMPLOYEE.code})</span>
                </div>
                <div style={{ fontSize: 12.5, color: '#5C6080', marginTop: 2 }}>
                  {EMPLOYEE.designation} · {EMPLOYEE.department}
                </div>
              </div>
              <div className="text-right" style={{ paddingLeft: 12, borderLeft: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.muted }}>Reporting Manager</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, marginTop: 2 }}>{EMPLOYEE.manager}</div>
              </div>
            </div>
          </div>

          {/* Reason / LWD */}
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <label style={labelStyle}>Reason for Leaving <span style={{ color: '#E84855' }}>*</span></label>
              <div className="relative">
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  style={{ ...inputBase, paddingRight: 36, border: `1px solid ${C.border}`, background: reason ? '#F5F6FF' : '#fff', appearance: 'none', cursor: 'pointer', color: reason ? C.navy : C.muted }}
                >
                  <option value="">— Select a reason —</option>
                  {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Intended Last Working Day <span style={{ color: '#E84855' }}>*</span></label>
              <input
                type="date"
                value={lwd}
                min={today}
                onChange={e => setLwd(e.target.value)}
                style={{ ...inputBase, border: `1px solid ${C.border}`, background: lwd ? '#F5F6FF' : '#fff', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="mb-5">
            <label style={labelStyle}>Detailed Reason / Notes <span style={{ color: '#E84855' }}>*</span></label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Share a little more about your decision to leave…"
              rows={4}
              style={{ width: '100%', borderRadius: 10, border: `1px solid ${C.border}`, background: details ? '#F5F6FF' : '#fff', padding: '12px 14px', fontSize: 13.5, fontWeight: 400, color: C.navy, resize: 'vertical', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.65, boxSizing: 'border-box' }}
            />
          </div>

          {/* Acknowledgement */}
          <label className="flex items-start gap-3 mb-6" style={{ cursor: 'pointer', padding: '13px 14px', borderRadius: 10, background: ack ? 'rgba(99,102,241,0.05)' : '#FAFBFE', border: `1px solid ${ack ? 'rgba(99,102,241,0.28)' : C.border}`, transition: 'all 0.15s' }}>
            <span
              onClick={() => setAck(!ack)}
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 20, height: 20, borderRadius: 6, marginTop: 1, border: `1.5px solid ${ack ? C.indigo : '#C8CCE0'}`, background: ack ? C.indigo : '#fff', transition: 'all 0.15s' }}
            >
              {ack && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
            </span>
            <input type="checkbox" checked={ack} onChange={e => setAck(e.target.checked)} style={{ display: 'none' }} />
            <span style={{ fontSize: 12.5, color: '#5C6080', lineHeight: 1.55 }}>
              I understand my <strong style={{ color: C.navy }}>notice period (30 / 60 / 90 days)</strong> will be confirmed by the Delivery Head upon approval, and that submitting this request starts my offboarding.
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center gap-3" style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22 }}>
            <button onClick={() => { setReason(''); setLwd(''); setDetails(''); setAck(false) }} style={{ height: 44, padding: '0 22px', borderRadius: 10, fontSize: 13.5, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0C4D6'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
            >
              Clear
            </button>
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              style={{
                height: 44, padding: '0 32px', borderRadius: 10, fontSize: 13.5, fontWeight: 700, border: 'none', marginLeft: 'auto',
                background: canSubmit ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : '#D8DCF0',
                color: canSubmit ? '#fff' : '#fff', cursor: canSubmit ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', gap: 7, transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { if (canSubmit) e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              Submit Request
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT — helper */}
      <div className="flex flex-col gap-4">
        {/* What happens next */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div className="flex items-center gap-2.5" style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 30, height: 30, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
              <CalendarClock size={14} strokeWidth={2.2} />
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>What happens next</span>
          </div>
          <div style={{ padding: '16px 18px' }}>
            {NEXT_STEPS.map((s, i) => {
              const Icon = s.Icon
              const last = i === NEXT_STEPS.length - 1
              return (
                <div key={i} className="flex gap-3" style={{ position: 'relative' }}>
                  <div className="flex flex-col items-center" style={{ width: 30 }}>
                    <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 30, height: 30, background: 'rgba(99,102,241,0.09)', color: C.indigoDeep }}>
                      <Icon size={14} strokeWidth={2} />
                    </div>
                    {!last && <div style={{ width: 1.5, flex: 1, background: 'rgba(99,102,241,0.16)', margin: '6px 0' }} />}
                  </div>
                  <div style={{ paddingBottom: last ? 0 : 28 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>{s.title}</div>
                    <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5, marginTop: 2 }}>{s.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Good to know */}
        <div style={{ background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.18)', borderRadius: 16, padding: '14px 16px' }}>
          <div className="flex items-center gap-2 mb-2.5">
            <Info size={14} style={{ color: '#D97706' }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#9A6207' }}>Good to know</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'Your notice period is confirmed by the Delivery Head (CTO).',
              'You can withdraw this request any time before it is approved.',
              'Keep your laptop & access until your last working day.',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2" style={{ fontSize: 11.5, color: '#8A6516', lineHeight: 1.5 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#D97706', marginTop: 6, flexShrink: 0 }} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════ PENDING VIEW ════════════════════════ */
function PendingView({ reason, lwd, details, onWithdraw }: { reason: string; lwd: string; details: string; onWithdraw: () => void }) {
  const ref = 'OFB-' + (2400 + 42)
  const timeline = [
    { label: 'Request Submitted', done: true,  current: false },
    { label: 'CTO Review',        done: false, current: true  },
    { label: 'Notice Period',     done: false, current: false },
    { label: 'Clearances',        done: false, current: false },
    { label: 'HR Closure',        done: false, current: false },
  ]
  return (
    <div>
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        {/* Amber banner */}
        <div className="flex items-center gap-4" style={{ padding: '22px 26px', background: 'linear-gradient(135deg, rgba(217,119,6,0.08), rgba(217,119,6,0.03))', borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-center rounded-2xl flex-shrink-0" style={{ width: 52, height: 52, background: 'rgba(217,119,6,0.13)' }}>
            <Clock3 size={26} strokeWidth={1.8} style={{ color: '#D97706' }} />
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, letterSpacing: '-0.2px' }}>Awaiting CTO Approval</div>
            <div style={{ fontSize: 13, color: '#5C6080', marginTop: 3 }}>
              Your request has been submitted and is with the Delivery Head for review.
            </div>
          </div>
          <span className="rounded-full" style={{ padding: '6px 12px', background: 'rgba(217,119,6,0.12)', color: '#B26905', fontSize: 11.5, fontWeight: 700 }}>Pending</span>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 26px' }}>
          {/* summary chips */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <MiniStat label="Reference" value={ref} />
            <MiniStat label="Reason" value={reason || 'Better Career Opportunity'} />
            <MiniStat label="Intended Last Day" value={lwd ? fmtDate(lwd) : '—'} />
          </div>

          {/* Detailed reason / notes */}
          <div className="mb-6">
            <div style={labelStyle}>Detailed Reason / Notes <span style={{ color: '#E84855' }}>*</span></div>
            <div style={{ padding: '14px 16px', background: '#F7F8FC', borderRadius: 12, borderLeft: '3px solid #6366F1', fontSize: 13.5, color: '#3D4266', lineHeight: 1.7 }}>
              “{details.trim() || 'I have accepted an offer for a senior role that offers stronger long-term growth and ownership. It was a difficult decision — I have valued my time here and the mentorship on the platform team. I will ensure a clean handover of my modules and complete knowledge transfer before my last day.'}”
            </div>
          </div>

          {/* timeline */}
          <div style={{ marginBottom: 8 }}>
            <div style={labelStyle}>Progress</div>
            <div className="flex items-center" style={{ marginTop: 6 }}>
              {timeline.map((t, i) => (
                <div key={i} className="flex items-center" style={{ flex: i === timeline.length - 1 ? '0 0 auto' : 1 }}>
                  <div className="flex flex-col items-center" style={{ width: 84 }}>
                    <div className="flex items-center justify-center rounded-full" style={{
                      width: 30, height: 30,
                      background: t.done ? '#0EA86A' : t.current ? 'rgba(217,119,6,0.14)' : '#F0F2F8',
                      border: t.current ? '2px solid #D97706' : 'none',
                    }}>
                      {t.done
                        ? <CheckCircle2 size={16} style={{ color: '#fff' }} />
                        : <span style={{ fontSize: 12, fontWeight: 700, color: t.current ? '#D97706' : '#B0B4C8' }}>{i + 1}</span>}
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: t.current ? 700 : 600, color: t.current ? '#B26905' : t.done ? '#0A8A58' : C.muted, textAlign: 'center', marginTop: 6, lineHeight: 1.3 }}>{t.label}</span>
                  </div>
                  {i !== timeline.length - 1 && <div style={{ flex: 1, height: 2, background: t.done ? '#0EA86A' : '#ECEEF5', margin: '0 -6px', marginBottom: 22 }} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between" style={{ padding: '16px 26px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE' }}>
          <span style={{ fontSize: 12, color: C.muted }}>You can withdraw while the request is still pending.</span>
          <button
            onClick={onWithdraw}
            className="flex items-center gap-2"
            style={{ height: 40, padding: '0 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, border: '1px solid rgba(232,72,85,0.3)', background: '#fff', color: '#E84855', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
          >
            <RotateCcw size={14} /> Withdraw Request
          </button>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════ REJECTED VIEW ════════════════════════ */
function RejectedView({ onRaiseNew }: { onRaiseNew: () => void }) {
  return (
    <div>
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div className="flex items-center gap-4" style={{ padding: '22px 26px', background: 'linear-gradient(135deg, rgba(232,72,85,0.08), rgba(232,72,85,0.03))', borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-center rounded-2xl flex-shrink-0" style={{ width: 52, height: 52, background: 'rgba(232,72,85,0.13)' }}>
            <XCircle size={26} strokeWidth={1.8} style={{ color: '#E84855' }} />
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, letterSpacing: '-0.2px' }}>Request Not Approved</div>
            <div style={{ fontSize: 13, color: '#5C6080', marginTop: 3 }}>The Delivery Head has declined your offboarding request.</div>
          </div>
          <span className="rounded-full" style={{ padding: '6px 12px', background: 'rgba(232,72,85,0.12)', color: '#C0334A', fontSize: 11.5, fontWeight: 700 }}>Rejected</span>
        </div>

        <div style={{ padding: '22px 26px' }}>
          <div style={labelStyle}>Reason from Delivery Head</div>
          <div style={{ padding: '14px 16px', background: '#F7F8FC', borderRadius: 10, borderLeft: '3px solid #E84855', fontSize: 13, color: '#3D4266', lineHeight: 1.65 }}>
            “Let's reconnect on your growth plan before proceeding — please set up a discussion with me and HR this week. I'd like to explore options to retain you on the team.”
          </div>
          <div className="flex items-center gap-2.5 mt-5" style={{ padding: '12px 14px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 10 }}>
            <Info size={15} style={{ color: C.indigoDeep, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#4A4F86', lineHeight: 1.55 }}>If you still wish to proceed after your discussion, you can raise a fresh request below.</span>
          </div>
        </div>

        <div className="flex items-center justify-end" style={{ padding: '16px 26px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE' }}>
          <button onClick={onRaiseNew} style={{ ...primaryBtn, height: 42, padding: '0 22px' }}>Raise New Request</button>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════ small shared bits ════════════════════════ */
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '11px 14px', background: '#F7F8FC', borderRadius: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '12px 14px', background: '#F7F8FC', borderRadius: 12, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, marginTop: 4 }}>{value}</div>
    </div>
  )
}

function Modal({ children, onClose, width }: { children: React.ReactNode; onClose: () => void; width: number }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: 22, width, boxShadow: '0 24px 64px rgba(10,12,28,0.18)', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'obSpin 0.8s linear infinite', flexShrink: 0 }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

const primaryBtn: React.CSSProperties = {
  height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700, border: 'none',
  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
}
const ghostBtn: React.CSSProperties = {
  flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 600,
  border: '1px solid #E8EAF2', background: '#fff', color: C.muted, cursor: 'pointer',
}
