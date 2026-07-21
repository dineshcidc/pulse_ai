import { useState } from 'react'
import {
  FileText, CalendarDays, Clock, AlertTriangle, Send, ShieldCheck,
  User, Briefcase, Building2, CheckCircle2, Undo2, CalendarX,
} from 'lucide-react'

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
  surface: '#F7F8FC',
  indigo: '#6366F1',
}

/* ── Mock employee (auto-filled from profile) ── */
const EMPLOYEE = {
  name: 'John Doe',
  code: 'CC001',
  designation: 'Senior Software Engineer',
  department: 'Engineering',
  manager: 'Priya Sharma',
  doj: '2021-03-15',
  email: 'john.doe@concertidc.com',
  noticePeriodDays: 90,
}

const REASONS = [
  'Better Career Opportunity',
  'Higher Studies',
  'Relocation',
  'Personal Reasons',
  'Health Reasons',
  'Work Environment',
  'Compensation & Benefits',
  'Career Change',
  'Other',
]

function fmtDate(d: string | Date) {
  const parsed = typeof d === 'string' ? new Date(d) : d
  if (isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function addDays(base: Date, days: number) {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

function toInputValue(d: Date) {
  return d.toISOString().split('T')[0]
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

/* ── Small building blocks ── */
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 7 }}>
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

function ReadOnlyRow({ Icon, label, value }: { Icon: React.ElementType; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 34, height: 34, borderRadius: 9, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} strokeWidth={1.8} style={{ color: C.muted }} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  )
}

function FormSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 22, paddingTop: 22, borderTop: `1px solid ${C.border}` }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, margin: '2px 0 0' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, margin: '2px 0 0' }}>{subtitle}</p>}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  )
}

export default function ResignationRequestPage() {
  const today = new Date()
  const suggestedLWD = addDays(today, EMPLOYEE.noticePeriodDays)

  const [status, setStatus] = useState<'draft' | 'submitted'>('draft')
  const [reason, setReason] = useState('')
  const [lwd, setLwd] = useState(toInputValue(suggestedLWD))
  const [details, setDetails] = useState('')
  const [comments, setComments] = useState('')
  const [ack, setAck] = useState(false)
  const [showErrors, setShowErrors] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [confirmSubmit, setConfirmSubmit] = useState(false)
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)
  const [requestId] = useState(`RES-${today.getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`)

  const chosenLWD = new Date(lwd)
  const noticeServed = daysBetween(today, chosenLWD)
  const shortfall = EMPLOYEE.noticePeriodDays - noticeServed
  const isEarly = !isNaN(chosenLWD.getTime()) && shortfall > 0

  const errReason = showErrors && !reason
  const errLwd = showErrors && !lwd
  const errDetails = showErrors && !details.trim()
  const errAck = showErrors && !ack

  function handleSubmitClick() {
    if (!reason || !lwd || !details.trim() || !ack) {
      setShowErrors(true)
      return
    }
    setSubmitLoading(true)
    setTimeout(() => {
      setSubmitLoading(false)
      setConfirmSubmit(true)
    }, 900)
  }

  function confirmSubmitFinal() {
    setConfirmSubmit(false)
    setStatus('submitted')
  }

  function confirmWithdrawFinal() {
    setConfirmWithdraw(false)
    setStatus('draft')
  }

  /* ══════════════════════════ SUBMITTED STATE ══════════════════════════ */
  if (status === 'submitted') {
    return (
      <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        {/* Section header */}
        <div style={{ marginBottom: 18 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0 }}>Resignation / Exit Request</h2>
          <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, margin: '3px 0 0' }}>Your resignation has been submitted and is under review.</p>
        </div>

        {/* Status banner */}
        <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.28)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={22} strokeWidth={2} style={{ color: '#B45309' }} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#B45309', margin: 0 }}>Submitted — Pending Manager Approval</h3>
            <p style={{ fontSize: 12.5, color: '#B45309', opacity: 0.85, margin: '2px 0 0', fontWeight: 500 }}>
              Request ID <strong>{requestId}</strong> · Submitted on {fmtDate(today)}
            </p>
          </div>
        </div>

        {/* Progress steps */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 22px', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[
              { label: 'Submitted', done: true },
              { label: 'Manager Review', done: false, active: true },
              { label: 'Accepted', done: false },
            ].map((s, i, arr) => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'unset' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: s.done ? '#0EA86A' : s.active ? 'rgba(245,158,11,0.15)' : C.bg,
                    border: s.active ? '2px solid #F59E0B' : 'none',
                  }}>
                    {s.done
                      ? <CheckCircle2 size={17} strokeWidth={2.4} style={{ color: '#fff' }} />
                      : <span style={{ fontSize: 12, fontWeight: 700, color: s.active ? '#B45309' : C.muted }}>{i + 1}</span>}
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: s.done || s.active ? C.navy : C.muted, whiteSpace: 'nowrap' }}>{s.label}</span>
                </div>
                {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: C.border, margin: '0 10px', marginBottom: 22 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Submitted details */}
        <SectionCard title="Submitted Details">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px 24px' }}>
            <ReadOnlyRow Icon={FileText} label="Reason for Leaving" value={reason} />
            <ReadOnlyRow Icon={CalendarDays} label="Resignation Date" value={fmtDate(today)} />
            <ReadOnlyRow Icon={Clock} label="Notice Period" value={`${EMPLOYEE.noticePeriodDays} days`} />
            <ReadOnlyRow Icon={CalendarX} label="Requested Last Working Day" value={fmtDate(lwd)} />
          </div>
          <div style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${C.border}` }}>
            <FieldLabel>Detailed Reason</FieldLabel>
            <p style={{ fontSize: 13, color: C.navy, fontWeight: 500, lineHeight: 1.6, margin: 0, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>{details}</p>
          </div>
        </SectionCard>

        {/* Withdraw */}
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 20px' }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Changed your mind?</div>
            <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 500, marginTop: 2 }}>You can withdraw this request while it is still pending manager approval.</div>
          </div>
          <button
            onClick={() => setConfirmWithdraw(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, padding: '10px 16px', borderRadius: 9, border: '1px solid rgba(232,72,85,0.35)', background: '#fff', color: '#E84855', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
          >
            <Undo2 size={15} strokeWidth={2} />
            Withdraw Request
          </button>
        </div>

        {confirmWithdraw && (
          <ConfirmModal
            tone="danger"
            Icon={Undo2}
            title="Withdraw Resignation?"
            body="Your resignation request will be cancelled and removed from your manager's queue. You can submit a new request later if needed."
            confirmLabel="Yes, Withdraw"
            onCancel={() => setConfirmWithdraw(false)}
            onConfirm={confirmWithdrawFinal}
          />
        )}
      </div>
    )
  }

  /* ══════════════════════════ FORM STATE ══════════════════════════ */
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes resSpin { to { transform: rotate(360deg) } }`}</style>
      {/* Section header */}
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0 }}>Resignation / Exit Request</h2>
        <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, margin: '3px 0 0' }}>Submit your resignation for manager review. Please fill in the details below.</p>
      </div>

      {/* ── One common white card holding everything ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>

        {/* Context strip */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={19} strokeWidth={1.9} style={{ color: C.indigo }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Applicable Notice Period</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginTop: 2 }}>{EMPLOYEE.noticePeriodDays} days</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(14,168,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CalendarDays size={19} strokeWidth={1.9} style={{ color: '#0A7040' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Suggested Last Working Day</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginTop: 2 }}>{fmtDate(suggestedLWD)}</div>
            </div>
          </div>
        </div>

        {/* Employee details */}
        <FormSection title="Employee Details" subtitle="Auto-filled from your profile">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px 24px' }}>
            <ReadOnlyRow Icon={User} label="Employee Name" value={EMPLOYEE.name} />
            <ReadOnlyRow Icon={FileText} label="Employee ID" value={EMPLOYEE.code} />
            <ReadOnlyRow Icon={Briefcase} label="Designation" value={EMPLOYEE.designation} />
            <ReadOnlyRow Icon={Building2} label="Department" value={EMPLOYEE.department} />
            <ReadOnlyRow Icon={ShieldCheck} label="Reporting Manager" value={EMPLOYEE.manager} />
            <ReadOnlyRow Icon={CalendarDays} label="Date of Joining" value={fmtDate(EMPLOYEE.doj)} />
          </div>
        </FormSection>

        {/* Resignation details */}
        <FormSection title="Resignation Details" subtitle="Tell us why you're leaving and your intended last working day">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 24px' }}>
            {/* Reason */}
            <div>
              <FieldLabel required>Reason for Leaving</FieldLabel>
              <div style={{ position: 'relative' }}>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  onFocus={focusOn} onBlur={focusOff}
                  style={{ ...inputBase, appearance: 'none', cursor: 'pointer', borderColor: errReason ? '#E84855' : C.border, color: reason ? C.navy : C.muted }}
                >
                  <option value="" disabled>Select a reason</option>
                  {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: C.muted, fontSize: 11 }}>▼</span>
              </div>
              {errReason && <ErrText>Please select a reason.</ErrText>}
            </div>

            {/* Resignation date (read-only) */}
            <div>
              <FieldLabel>Resignation Date</FieldLabel>
              <div style={{ ...inputBase, background: C.surface, color: C.muted, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CalendarDays size={15} style={{ color: C.muted }} />
                {fmtDate(today)}
              </div>
            </div>

            {/* Requested LWD */}
            <div>
              <FieldLabel required>Requested Last Working Day</FieldLabel>
              <input
                type="date"
                value={lwd}
                min={toInputValue(today)}
                onChange={e => setLwd(e.target.value)}
                onFocus={focusOn} onBlur={focusOff}
                style={{ ...inputBase, borderColor: errLwd ? '#E84855' : C.border, cursor: 'pointer' }}
              />
              {errLwd && <ErrText>Please choose your last working day.</ErrText>}
            </div>

            {/* Notice period (read-only) */}
            <div>
              <FieldLabel>Applicable Notice Period</FieldLabel>
              <div style={{ ...inputBase, background: C.surface, color: C.muted, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={15} style={{ color: C.muted }} />
                {EMPLOYEE.noticePeriodDays} days
              </div>
            </div>
          </div>

          {/* Early release warning */}
          {isEarly && (
            <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.28)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <AlertTriangle size={16} strokeWidth={2} style={{ color: '#B45309', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 12.5, color: '#B45309', fontWeight: 500, margin: 0, lineHeight: 1.55 }}>
                Your chosen date is <strong>{shortfall} day{shortfall !== 1 ? 's' : ''}</strong> before your notice period ends. This is an <strong>early-release request</strong> — it is subject to management approval, and any notice shortfall may be recovered in your Full &amp; Final settlement.
              </p>
            </div>
          )}

          {/* Detailed reason */}
          <div style={{ marginTop: 18 }}>
            <FieldLabel required>Detailed Reason / Comments</FieldLabel>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              onFocus={focusOn} onBlur={focusOff}
              placeholder="Briefly explain your reason for resigning…"
              style={{ ...inputBase, minHeight: 96, resize: 'vertical', borderColor: errDetails ? '#E84855' : C.border }}
            />
            {errDetails && <ErrText>Please provide a brief reason.</ErrText>}
          </div>

          {/* Additional comments */}
          <div style={{ marginTop: 18 }}>
            <FieldLabel>Additional Comments <span style={{ textTransform: 'none', fontWeight: 500, color: C.muted }}>(optional)</span></FieldLabel>
            <textarea
              value={comments}
              onChange={e => setComments(e.target.value)}
              onFocus={focusOn} onBlur={focusOff}
              placeholder="Anything else you'd like your manager / HR to know (handover notes, transition suggestions)…"
              style={{ ...inputBase, minHeight: 72, resize: 'vertical' }}
            />
          </div>
        </FormSection>

        {/* Acknowledgement */}
        <FormSection title="Acknowledgement">
          <label style={{ display: 'flex', gap: 11, alignItems: 'flex-start', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={ack}
              onChange={e => setAck(e.target.checked)}
              style={{ width: 17, height: 17, marginTop: 1, accentColor: C.indigo, cursor: 'pointer', flexShrink: 0 }}
            />
            <span style={{ fontSize: 12.8, color: C.navy, fontWeight: 500, lineHeight: 1.6 }}>
              I understand that this resignation is subject to <strong>manager approval</strong> and completion of the <strong>offboarding &amp; clearance process</strong>, including knowledge transfer, asset return, and final settlement. I confirm the information provided is accurate.
            </span>
          </label>
          {errAck && <ErrText>Please acknowledge to continue.</ErrText>}
        </FormSection>

        {/* Actions */}
        <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            onClick={() => setStatus('draft')}
            style={{ padding: '11px 20px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
          >
            Save as Draft
          </button>
          <button
            onClick={handleSubmitClick}
            disabled={submitLoading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minWidth: 190, padding: '11px 22px', borderRadius: 10, border: 'none', background: C.indigo, color: '#fff', fontSize: 13, fontWeight: 600, cursor: submitLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s', opacity: submitLoading ? 0.85 : 1 }}
            onMouseEnter={e => { if (!submitLoading) e.currentTarget.style.background = '#4F46E5' }}
            onMouseLeave={e => { if (!submitLoading) e.currentTarget.style.background = C.indigo }}
          >
            {submitLoading ? (
              <><Spinner /> Submitting…</>
            ) : (
              <><Send size={15} strokeWidth={2} /> Submit Resignation</>
            )}
          </button>
        </div>
      </div>

      {confirmSubmit && (
        <ConfirmModal
          tone="primary"
          Icon={Send}
          title="Submit Resignation?"
          body={`Your resignation will be sent to ${EMPLOYEE.manager} for review, with a requested last working day of ${fmtDate(lwd)}. You can withdraw it while it is still pending.`}
          confirmLabel="Yes, Submit"
          onCancel={() => setConfirmSubmit(false)}
          onConfirm={confirmSubmitFinal}
        />
      )}
    </div>
  )
}

/* ── Helpers ── */
function ErrText({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 11.5, color: '#E84855', fontWeight: 600, margin: '6px 0 0' }}>{children}</p>
}

function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"
      style={{ animation: 'resSpin 0.7s linear infinite', flexShrink: 0 }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

function ConfirmModal({
  tone, Icon, title, body, confirmLabel, onCancel, onConfirm,
}: {
  tone: 'primary' | 'danger'
  Icon: React.ElementType
  title: string
  body: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}) {
  const [loading, setLoading] = useState(false)
  const accent = tone === 'danger' ? '#E84855' : C.indigo
  const accentBg = tone === 'danger' ? 'rgba(232,72,85,0.10)' : 'rgba(99,102,241,0.10)'

  function handleConfirm() {
    setLoading(true)
    setTimeout(() => { onConfirm() }, 1400)
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget && !loading) onCancel() }}
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <style>{`@keyframes resSpin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ background: '#fff', borderRadius: 20, padding: '34px 30px 26px', width: 400, boxShadow: '0 24px 64px rgba(10,12,28,0.22)', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <Icon size={26} strokeWidth={1.9} style={{ color: accent }} />
        </div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: C.navy, margin: '0 0 8px' }}>{title}</h3>
        <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, lineHeight: 1.65, margin: '0 auto 24px', maxWidth: 320 }}>{body}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{ flex: 1, height: 44, borderRadius: 11, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.6 : 1 }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            style={{ flex: 1, height: 44, borderRadius: 11, border: 'none', background: accent, color: '#fff', fontSize: 13.5, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.9 : 1 }}
          >
            {loading ? (<><Spinner /> Please wait…</>) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
