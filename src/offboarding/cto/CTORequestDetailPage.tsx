import { useState } from 'react'
import {
  ArrowLeft, ShieldCheck, CheckCircle2, XCircle, Clock3, RotateCcw,
  CalendarClock, Mail, Phone, Briefcase, UserCircle2, CalendarDays,
  FileText, Info, Users, MonitorCheck, Wallet, FileCheck2,
} from 'lucide-react'
import type { OffboardRequest } from './CTOApprovalsPage'
import { TODAY } from './CTOApprovalsPage'
import { SHOW_REJECT_FLOW } from '../offboardingFlags'

/*
 * CTO (Delivery Head) › Offboarding Approvals — Screen C2 (Request Detail + Decision).
 *
 * The decision page. The CTO reads the request, then either:
 *   • Approves → picks a notice period (30 / 60 / 90) or an early-release date.
 *   • Rejects  → gives a reason.
 * Pending requests show the decision panel; decided ones show a read-only outcome.
 */

const C = {
  navy:   '#1C2035',
  border: '#E8EAF2',
  muted:  '#8B90A7',
  hover:  '#F0F2F8',
  indigo: '#6366F1',
  indigoDeep: '#5B5FDE',
  green:  '#0EA86A',
  amber:  '#D97706',
  red:    '#E84855',
}

function fmtDate(d: string | Date) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
function daysAgo(d: string) {
  const diff = Math.round((TODAY.getTime() - new Date(d).getTime()) / 86400000)
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return `${diff} days ago`
}
function addDays(base: Date, n: number) {
  const d = new Date(base); d.setDate(d.getDate() + n); return d
}
function tenure(doj: string) {
  const s = new Date(doj)
  let months = (TODAY.getFullYear() - s.getFullYear()) * 12 + (TODAY.getMonth() - s.getMonth())
  if (TODAY.getDate() < s.getDate()) months--
  const y = Math.floor(months / 12), m = months % 12
  return `${y}y ${m}m`
}

const NOTICE_OPTIONS = [30, 60, 90]

const AFTER_APPROVAL = [
  { Icon: CalendarClock, title: 'Notice period begins', desc: 'The countdown to the last working day starts.' },
  { Icon: Users,         title: 'Manager clearance',    desc: 'Project handover & knowledge transfer.' },
  { Icon: MonitorCheck,  title: 'IT clearance',         desc: 'Assets, access & accounts revoked near LWD.' },
  { Icon: Wallet,        title: 'Finance settlement',   desc: 'Dues and full & final settlement.' },
  { Icon: FileCheck2,    title: 'HR closure',           desc: 'Exit interview, letters & case closed.' },
]

type LiveOutcome =
  | { type: 'approved'; noticeDays: number; lwd: string }
  | { type: 'rejected'; reason: string }

export default function CTORequestDetailPage({ request, onBack }: { request: OffboardRequest; onBack: () => void }) {
  const [mode, setMode]         = useState<'approve' | 'reject'>('approve')
  const [noticeDays, setNotice] = useState(60)
  const [earlyDate, setEarly]   = useState('')
  const [rejectReason, setReject] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting]   = useState(false)
  const [live, setLive] = useState<LiveOutcome | null>(null)

  const historicallyDecided = request.status !== 'pending'
  const decided = historicallyDecided || !!live

  // computed last working day for the approve preview
  const computedLwd = earlyDate ? new Date(earlyDate) : addDays(TODAY, noticeDays)

  const canApprove = true
  const canReject  = rejectReason.trim().length > 0

  async function confirmDecision() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setShowConfirm(false)
    if (mode === 'approve') {
      setLive({ type: 'approved', noticeDays, lwd: computedLwd.toISOString().split('T')[0] })
    } else {
      setLive({ type: 'rejected', reason: rejectReason.trim() })
    }
  }

  // What outcome (if any) to render read-only on the right
  const outcome: {
    type: ReqOutcome; noticeDays?: number; lwd?: string; reason?: string; decidedOn?: string; decidedBy?: string; justNow?: boolean
  } | null =
    live
      ? live.type === 'approved'
        ? { type: 'approved', noticeDays: live.noticeDays, lwd: live.lwd, decidedOn: TODAY.toISOString().split('T')[0], decidedBy: 'You (Delivery Head)', justNow: true }
        : { type: 'rejected', reason: live.reason, decidedOn: TODAY.toISOString().split('T')[0], decidedBy: 'You (Delivery Head)', justNow: true }
      : request.status === 'approved'
        ? { type: 'approved', noticeDays: request.noticeDays, lwd: request.requestedLwd, decidedOn: request.decidedOn, decidedBy: request.decidedBy }
      : request.status === 'rejected'
        ? { type: 'rejected', reason: request.rejectReason, decidedOn: request.decidedOn, decidedBy: request.decidedBy }
      : request.status === 'withdrawn'
        ? { type: 'withdrawn' }
      : null

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes obSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes obPop{0%{transform:scale(.9);opacity:0}100%{transform:scale(1);opacity:1}}`}</style>

      {/* ── Breadcrumb (matches the other detail pages) ── */}
      <div className="flex items-center gap-2.5 mb-4">
        <button onClick={onBack} className="flex items-center justify-center flex-shrink-0"
          style={{ width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.background = C.hover }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
          <ArrowLeft size={15} style={{ color: C.muted }} />
        </button>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: C.muted }}>Offboarding Approvals</button>
        <span style={{ color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{request.name}</span>
      </div>

      {/* just-decided success flash */}
      {live && (
        <div className="flex items-center gap-3 mb-4" style={{ animation: 'obPop 0.25s ease', background: live.type === 'approved' ? 'rgba(14,168,106,0.09)' : 'rgba(232,72,85,0.08)', border: `1px solid ${live.type === 'approved' ? 'rgba(14,168,106,0.28)' : 'rgba(232,72,85,0.25)'}`, borderRadius: 12, padding: '13px 16px' }}>
          {live.type === 'approved'
            ? <CheckCircle2 size={19} style={{ color: C.green, flexShrink: 0 }} />
            : <XCircle size={19} style={{ color: C.red, flexShrink: 0 }} />}
          <span style={{ fontSize: 13.5, fontWeight: 700, color: live.type === 'approved' ? '#0A8A58' : '#C0334A' }}>
            {live.type === 'approved' ? 'Request approved — the notice period has started.' : 'Request rejected — the employee has been notified with your reason.'}
          </span>
        </div>
      )}

      {/* ── Employee identity header ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 24px', marginBottom: 20 }}>
        <div className="flex items-start gap-4">
          <img src={request.avatar} alt={request.name} style={{ width: 62, height: 62, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(28,32,53,0.14)', flexShrink: 0 }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span style={{ fontSize: 19, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px' }}>{request.name}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted, background: C.hover, padding: '2px 9px', borderRadius: 7 }}>{request.code}</span>
            </div>
            <div style={{ fontSize: 13.5, color: '#5C6080', fontWeight: 600, marginTop: 4 }}>{request.designation} · {request.department}</div>
            <div className="flex items-center gap-x-5 gap-y-1.5 flex-wrap" style={{ marginTop: 12 }}>
              <Meta Icon={UserCircle2} label="Reporting Manager" value={request.manager} />
              <Meta Icon={CalendarDays} label="Date of Joining" value={fmtDate(request.doj)} />
              <Meta Icon={Briefcase} label="Tenure" value={tenure(request.doj)} />
              <Meta Icon={Mail} label="Email" value={request.email} />
              <Meta Icon={Phone} label="Phone" value={request.phone} />
            </div>
          </div>
          <div className="flex-shrink-0">
            <StatusPill status={decided && outcome ? outcome.type : 'pending'} />
          </div>
        </div>
      </div>

      {/* ── 8 / 4 layout ── */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '8fr 4fr', alignItems: 'start' }}>

        {/* LEFT — request details */}
        <div className="flex flex-col gap-5">
          {/* Request summary */}
          <Card title="Request Details" Icon={FileText}>
            <div style={{ padding: '18px 22px' }}>
              <div className="grid grid-cols-3 gap-3 mb-5">
                <Field label="Reason for Leaving" value={request.reason} />
                <Field label="Intended Last Day" value={fmtDate(request.requestedLwd)} />
                <Field label="Submitted" value={daysAgo(request.submittedOn)} sub={fmtDate(request.submittedOn)} />
              </div>
              <div>
                <div style={fieldLabel}>Detailed Reason / Notes</div>
                <div style={{ padding: '14px 16px', background: '#F7F8FC', borderRadius: 12, borderLeft: `3px solid ${C.indigo}`, fontSize: 13.5, color: '#3D4266', lineHeight: 1.7 }}>
                  “{request.notes}”
                </div>
              </div>
            </div>
          </Card>

          {/* What happens after approval */}
          <Card title="What happens after approval" Icon={CalendarClock}>
            <div style={{ padding: '16px 22px' }}>
              {AFTER_APPROVAL.map((s, i) => {
                const Icon = s.Icon
                const last = i === AFTER_APPROVAL.length - 1
                return (
                  <div key={i} className="flex gap-3" style={{ position: 'relative' }}>
                    <div className="flex flex-col items-center" style={{ width: 30 }}>
                      <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 30, height: 30, background: 'rgba(99,102,241,0.09)', color: C.indigoDeep }}>
                        <Icon size={14} strokeWidth={2} />
                      </div>
                      {!last && <div style={{ width: 1.5, flex: 1, background: 'rgba(99,102,241,0.16)', margin: '6px 0' }} />}
                    </div>
                    <div style={{ paddingBottom: last ? 0 : 30 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{s.title}</div>
                      <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, marginTop: 2 }}>{s.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT — decision / outcome */}
        <div>
          {!decided
            ? <DecisionPanel
                mode={mode} setMode={setMode}
                noticeDays={noticeDays} setNotice={setNotice}
                earlyDate={earlyDate} setEarly={setEarly}
                rejectReason={rejectReason} setReject={setReject}
                computedLwd={computedLwd}
                canApprove={canApprove} canReject={canReject}
                onSubmit={() => setShowConfirm(true)}
              />
            : <OutcomePanel outcome={outcome!} />}
        </div>
      </div>

      {/* ── Confirm modal ── */}
      {showConfirm && (
        <Modal onClose={() => !submitting && setShowConfirm(false)} width={440}>
          <div style={{ padding: '26px 28px 20px', borderBottom: '1px solid #F0F2F8' }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: mode === 'approve' ? 'rgba(14,168,106,0.12)' : 'rgba(232,72,85,0.12)', color: mode === 'approve' ? C.green : C.red }}>
                {mode === 'approve' ? <CheckCircle2 size={20} strokeWidth={1.9} /> : <XCircle size={20} strokeWidth={1.9} />}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{mode === 'approve' ? 'Approve Offboarding?' : 'Reject Request?'}</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>Please confirm your decision</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SummaryRow label="Employee" value={`${request.name} (${request.code})`} />
            {mode === 'approve' ? (
              <>
                <SummaryRow label="Notice Period" value={earlyDate ? 'Early release' : `${noticeDays} days`} />
                <SummaryRow label="Last Working Day" value={fmtDate(computedLwd)} />
                <div className="flex items-start gap-2.5" style={{ padding: '11px 14px', background: 'rgba(14,168,106,0.06)', border: '1px solid rgba(14,168,106,0.2)', borderRadius: 10 }}>
                  <Info size={15} style={{ color: C.green, flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: '#0A7A50', lineHeight: 1.55 }}>The notice period will begin immediately and the employee's full offboarding view will unlock.</span>
                </div>
              </>
            ) : (
              <div style={{ padding: '11px 14px', background: '#F7F8FC', borderRadius: 10 }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 7 }}>Reason</div>
                <div style={{ fontSize: 13, color: C.navy, lineHeight: 1.6 }}>{rejectReason.trim()}</div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3" style={{ padding: '0 28px 24px' }}>
            <button onClick={() => setShowConfirm(false)} disabled={submitting} style={ghostBtn}>Go Back</button>
            <button onClick={confirmDecision} disabled={submitting}
              style={{ flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700, border: 'none', color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: submitting ? 0.85 : 1, background: mode === 'approve' ? 'linear-gradient(135deg, #12b877 0%, #0A8A58 100%)' : 'linear-gradient(135deg, #F0576A 0%, #D42F45 100%)' }}>
              {submitting ? <><Spinner /> Submitting…</> : mode === 'approve' ? 'Yes, Approve' : 'Yes, Reject'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ════════════════ DECISION PANEL (pending) ════════════════ */
function DecisionPanel({
  mode, setMode, noticeDays, setNotice, earlyDate, setEarly, rejectReason, setReject, computedLwd, canApprove, canReject, onSubmit,
}: {
  mode: 'approve' | 'reject'; setMode: (m: 'approve' | 'reject') => void
  noticeDays: number; setNotice: (n: number) => void
  earlyDate: string; setEarly: (v: string) => void
  rejectReason: string; setReject: (v: string) => void
  computedLwd: Date
  canApprove: boolean; canReject: boolean
  onSubmit: () => void
}) {
  const today = new Date().toISOString().split('T')[0]
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 8 }}>
      {/* header */}
      <div className="flex items-center gap-2.5" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
          <ShieldCheck size={16} strokeWidth={2} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Your Decision</span>
      </div>

      <div style={{ padding: 20 }}>
        {/* approve / reject toggle — reject hidden for now (BA); Approve only */}
        {SHOW_REJECT_FLOW && (
          <div className="grid grid-cols-2 gap-2 mb-5">
            {(['approve', 'reject'] as const).map(m => {
              const on = mode === m
              const isApprove = m === 'approve'
              const col = isApprove ? C.green : C.red
              return (
                <button key={m} onClick={() => setMode(m)}
                  className="flex items-center justify-center gap-2"
                  style={{ height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                    border: `1.5px solid ${on ? col : C.border}`,
                    background: on ? (isApprove ? 'rgba(14,168,106,0.09)' : 'rgba(232,72,85,0.08)') : '#fff',
                    color: on ? (isApprove ? '#0A8A58' : '#C0334A') : C.muted }}>
                  {isApprove ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {isApprove ? 'Approve' : 'Reject'}
                </button>
              )
            })}
          </div>
        )}

        {mode === 'approve' ? (
          <>
            <div style={fieldLabel}>Notice Period</div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {NOTICE_OPTIONS.map(n => {
                const on = !earlyDate && noticeDays === n
                return (
                  <button key={n} onClick={() => { setNotice(n); setEarly('') }}
                    className="flex items-center justify-center gap-1"
                    style={{ padding: '11px 0', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
                      border: `1.5px solid ${on ? C.indigo : C.border}`, background: on ? 'rgba(99,102,241,0.07)' : '#fff' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: on ? C.indigoDeep : C.navy, lineHeight: 1 }}>{n}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: on ? C.indigoDeep : C.muted }}>days</span>
                  </button>
                )
              })}
            </div>

            {/* early release */}
            <div className="mb-4">
              <label style={fieldLabel}>Early Release Date <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 500, color: '#B0B4C8' }}>(optional)</span></label>
              <input type="date" value={earlyDate} min={today} onChange={e => setEarly(e.target.value)}
                style={{ width: '100%', height: 42, borderRadius: 10, border: `1px solid ${earlyDate ? C.indigo : C.border}`, background: earlyDate ? '#F5F6FF' : '#fff', padding: '0 14px', fontSize: 13.5, color: C.navy, outline: 'none', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box' }} />
            </div>

            {/* computed LWD preview */}
            <div className="flex items-center gap-2.5 mb-5" style={{ padding: '12px 14px', background: 'rgba(14,168,106,0.06)', border: '1px solid rgba(14,168,106,0.2)', borderRadius: 11 }}>
              <CalendarClock size={17} style={{ color: C.green, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0A7A50', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Working Day</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0A8A58', marginTop: 1 }}>{fmtDate(computedLwd)}</div>
              </div>
            </div>

            <button onClick={onSubmit} disabled={!canApprove}
              className="flex items-center justify-center gap-2 w-full"
              style={{ height: 46, borderRadius: 11, fontSize: 14, fontWeight: 700, border: 'none', color: '#fff', cursor: 'pointer', background: 'linear-gradient(135deg, #12b877 0%, #0A8A58 100%)', boxShadow: '0 2px 8px rgba(14,168,106,0.3)' }}>
              <CheckCircle2 size={17} /> Approve Request
            </button>
          </>
        ) : (
          <>
            <label style={fieldLabel}>Reason for Rejection <span style={{ color: C.red }}>*</span></label>
            <textarea value={rejectReason} onChange={e => setReject(e.target.value)} rows={5}
              placeholder="Explain why the request is being declined. This is shared with the employee…"
              style={{ width: '100%', borderRadius: 10, border: `1px solid ${rejectReason ? C.red : C.border}`, background: rejectReason ? 'rgba(232,72,85,0.03)' : '#fff', padding: '12px 14px', fontSize: 13.5, color: C.navy, resize: 'vertical', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.6, boxSizing: 'border-box', marginBottom: 16 }} />

            <button onClick={onSubmit} disabled={!canReject}
              className="flex items-center justify-center gap-2 w-full"
              style={{ height: 46, borderRadius: 11, fontSize: 14, fontWeight: 700, border: 'none', color: '#fff', cursor: canReject ? 'pointer' : 'not-allowed', background: canReject ? 'linear-gradient(135deg, #F0576A 0%, #D42F45 100%)' : '#E7A9B1', boxShadow: canReject ? '0 2px 8px rgba(232,72,85,0.3)' : 'none' }}>
              <XCircle size={17} /> Reject Request
            </button>
          </>
        )}

        <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', marginTop: 14, lineHeight: 1.5 }}>
          You are the first and only approver. Departments act only after your approval.
        </p>
      </div>
    </div>
  )
}

/* ════════════════ OUTCOME PANEL (decided) ════════════════ */
type ReqOutcome = 'approved' | 'rejected' | 'withdrawn'
function OutcomePanel({ outcome }: { outcome: { type: ReqOutcome; noticeDays?: number; lwd?: string; reason?: string; decidedOn?: string; decidedBy?: string } }) {
  const meta: Record<ReqOutcome, { label: string; color: string; bg: string; Icon: React.ElementType; title: string }> = {
    approved:  { label: 'Approved',  color: C.green, bg: 'rgba(14,168,106,0.10)', Icon: CheckCircle2, title: 'Request Approved' },
    rejected:  { label: 'Rejected',  color: C.red,   bg: 'rgba(232,72,85,0.10)',  Icon: XCircle,      title: 'Request Rejected' },
    withdrawn: { label: 'Withdrawn', color: '#5A5F82', bg: 'rgba(91,95,130,0.15)', Icon: RotateCcw,    title: 'Request Withdrawn' },
  }
  const m = meta[outcome.type]
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 8 }}>
      <div className="flex flex-col items-center text-center" style={{ padding: '26px 22px 20px', background: m.bg }}>
        <div className="flex items-center justify-center rounded-2xl mb-3" style={{ width: 56, height: 56, background: '#fff' }}>
          <m.Icon size={28} strokeWidth={1.9} style={{ color: m.color }} />
        </div>
        <div style={{ fontSize: 16.5, fontWeight: 800, color: C.navy }}>{m.title}</div>
        {outcome.decidedOn && <div style={{ fontSize: 12, color: '#5C6080', marginTop: 3 }}>on {fmtDate(outcome.decidedOn)}{outcome.decidedBy ? ` · ${outcome.decidedBy}` : ''}</div>}
      </div>

      <div style={{ padding: 20 }}>
        {outcome.type === 'approved' && (
          <div className="flex flex-col gap-3">
            <OutRow Icon={Clock3} label="Notice Period" value={outcome.noticeDays ? `${outcome.noticeDays} days` : '—'} />
            <OutRow Icon={CalendarClock} label="Last Working Day" value={outcome.lwd ? fmtDate(outcome.lwd) : '—'} accent />
            <div className="flex items-center gap-2.5" style={{ padding: '12px 14px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 11 }}>
              <Info size={15} style={{ color: C.indigoDeep, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#4A4F86', lineHeight: 1.55 }}>Notice period is running. Manager, IT and Finance clearances are in progress.</span>
            </div>
          </div>
        )}

        {outcome.type === 'rejected' && (
          <div>
            <div style={fieldLabel}>Reason from Delivery Head</div>
            <div style={{ padding: '13px 15px', background: '#F7F8FC', borderRadius: 11, borderLeft: `3px solid ${C.red}`, fontSize: 13, color: '#3D4266', lineHeight: 1.65 }}>
              “{outcome.reason || '—'}”
            </div>
          </div>
        )}

        {outcome.type === 'withdrawn' && (
          <div className="flex items-center gap-2.5" style={{ padding: '13px 15px', background: '#F7F8FC', border: `1px solid ${C.border}`, borderRadius: 11 }}>
            <Info size={15} style={{ color: C.muted, flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: '#5C6080', lineHeight: 1.55 }}>The employee withdrew this request before a decision was made. No action is required.</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ════════════════ small shared bits ════════════════ */
function StatusPill({ status }: { status: ReqOutcome | 'pending' }) {
  const meta: Record<string, { label: string; color: string; bg: string }> = {
    pending:   { label: 'Pending Review', color: '#B26905', bg: 'rgba(217,119,6,0.12)' },
    approved:  { label: 'Approved',       color: '#0A8A58', bg: 'rgba(14,168,106,0.12)' },
    rejected:  { label: 'Rejected',       color: '#C0334A', bg: 'rgba(232,72,85,0.12)' },
    withdrawn: { label: 'Withdrawn',      color: '#5A5F82', bg: 'rgba(91,95,130,0.15)' },
  }
  const m = meta[status]
  return <span className="rounded-full" style={{ padding: '4px 11px', background: m.bg, color: m.color, fontSize: 11, fontWeight: 700 }}>{m.label}</span>
}

function Meta({ Icon, label, value }: { Icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={15} style={{ color: C.muted, flexShrink: 0 }} />
      <div>
        <span style={{ fontSize: 11, color: C.muted }}>{label}: </span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{value}</span>
      </div>
    </div>
  )
}

function Card({ title, Icon, children }: { title: string; Icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
      <div className="flex items-center gap-2.5" style={{ padding: '15px 22px', borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
          <Icon size={15} strokeWidth={2} />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

function Field({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ padding: '12px 14px', background: '#F7F8FC', borderRadius: 12, border: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{sub}</div>}
    </div>
  )
}

function OutRow({ Icon, label, value, accent }: { Icon: React.ElementType; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3" style={{ padding: '12px 14px', background: accent ? 'rgba(14,168,106,0.06)' : '#F7F8FC', border: `1px solid ${accent ? 'rgba(14,168,106,0.2)' : C.border}`, borderRadius: 11 }}>
      <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: '#fff', color: accent ? C.green : C.indigoDeep }}>
        <Icon size={15} strokeWidth={2} />
      </div>
      <div className="flex-1">
        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: accent ? '#0A8A58' : C.navy, marginTop: 1 }}>{value}</div>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '11px 14px', background: '#F7F8FC', borderRadius: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, textAlign: 'right' }}>{value}</span>
    </div>
  )
}

function Modal({ children, onClose, width }: { children: React.ReactNode; onClose: () => void; width: number }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#fff', borderRadius: 22, width, boxShadow: '0 24px 64px rgba(10,12,28,0.18)', overflow: 'hidden' }}>{children}</div>
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

const fieldLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: C.muted, display: 'block', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }
const ghostBtn: React.CSSProperties = { flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 600, border: '1px solid #E8EAF2', background: '#fff', color: C.muted, cursor: 'pointer' }
