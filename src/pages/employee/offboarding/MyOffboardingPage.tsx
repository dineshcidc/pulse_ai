import {
  CalendarClock, UserCheck, Package, ShieldCheck,
  ClipboardList, Wallet, Users, CheckCircle2, LoaderCircle,
  Circle, Lock, XCircle, ArrowRight,
} from 'lucide-react'
import type { ElementType } from 'react'
import { PreviewSwitcher, type OffboardingTabProps } from './offboardingShared'

const C = {
  navy: '#1C2035',
  muted: '#8B90A7',
  border: '#E4E6EF',
  bg: '#F0F2F8',
  surface: '#F7F8FC',
  indigo: '#6366F1',
}

type ClearStatus = 'Completed' | 'In Progress' | 'Pending' | 'Locked'

interface ClearItem {
  Icon: ElementType
  name: string
  owner: string
  status: ClearStatus
  note?: string
}

/* ── Mock offboarding case (matches the Resignation Request mock) ── */
const CASE = {
  requestId: 'RES-2026-482',
  submittedISO: '2026-07-14',
  acceptedISO: '2026-07-17',
  requestedLwdISO: '2026-10-20',
  confirmedLwdISO: '2026-10-15',   // manager adjusted the LWD on approval
  noticePeriodDays: 90,
}

/*
 * Clearance checklist. The reporting manager gives a team-side Manager Clearance
 * near the last working day; Admin/HR owns the rest (Finance, HR, Asset Return,
 * IT Access). Knowledge Transfer / Handover is handled over email, outside the
 * portal. Asset Return + IT Access are last-working-day steps.
 */
const CHECKLIST: ClearItem[] = [
  { Icon: UserCheck,     name: 'Manager Clearance', owner: 'Priya Sharma (Manager)', status: 'Pending' },
  { Icon: ClipboardList, name: 'Exit Interview',    owner: 'You / HR',               status: 'Pending' },
  { Icon: Wallet,        name: 'Finance Clearance', owner: 'Finance',                status: 'Pending' },
  { Icon: Users,         name: 'HR Clearance',      owner: 'HR',                     status: 'Pending' },
  { Icon: Package,       name: 'Asset Return',      owner: 'You / IT',               status: 'Pending', note: `On your last working day (${fmtDate(CASE.confirmedLwdISO)})` },
  { Icon: ShieldCheck,   name: 'IT Access Revoked', owner: 'IT',                     status: 'Pending', note: 'End of your last working day' },
]

const STATUS_STYLE: Record<ClearStatus, { bg: string; color: string; Icon: ElementType }> = {
  'Completed':   { bg: 'rgba(14,168,106,0.12)', color: '#0A7040', Icon: CheckCircle2 },
  'In Progress': { bg: 'rgba(99,102,241,0.12)', color: '#4F46E5', Icon: LoaderCircle },
  'Pending':     { bg: '#EEF0F6',               color: '#8B90A7', Icon: Circle },
  'Locked':      { bg: 'rgba(245,158,11,0.10)', color: '#B45309', Icon: Lock },
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export default function MyOffboardingPage({ reviewState, onReviewChange }: OffboardingTabProps) {
  const today = new Date()
  const lwdChanged = CASE.confirmedLwdISO !== CASE.requestedLwdISO
  const daysLeft = Math.max(0, daysBetween(today, new Date(CASE.confirmedLwdISO)))

  const subtitle =
    reviewState === 'approved'
      ? 'Track your clearances and last working day — all in one place.'
      : reviewState === 'rejected'
      ? 'Your resignation was not accepted, so your offboarding has not started.'
      : 'Your resignation is submitted and awaiting your manager’s approval.'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes offbSpin { to { transform: rotate(360deg) } }`}</style>

      {/* ── Section header + preview switcher (same placement as Resignation Request) ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0 }}>My Offboarding</h2>
          <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, margin: '3px 0 0' }}>{subtitle}</p>
        </div>
        <PreviewSwitcher value={reviewState} onChange={onReviewChange} />
      </div>

      {/* ══════════════════ REJECTED ══════════════════ */}
      {reviewState === 'rejected' ? (
        <>
          <div style={{ background: 'rgba(232,72,85,0.06)', border: '1px solid rgba(232,72,85,0.28)', borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(232,72,85,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <XCircle size={22} strokeWidth={2} style={{ color: '#C0202E' }} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#C0202E', margin: 0 }}>Resignation Not Accepted — Offboarding Not Started</h3>
              <p style={{ fontSize: 12.5, color: '#C0202E', opacity: 0.85, margin: '2px 0 0', fontWeight: 500 }}>Request ID {CASE.requestId}</p>
            </div>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 22px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <ArrowRight size={16} strokeWidth={2} style={{ color: '#5B5FDE', marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 13, color: '#5A6080', fontWeight: 500, lineHeight: 1.65, margin: 0 }}>
              Your manager did not accept your resignation, so no offboarding case or clearance checklist has been created.
              You can review your manager’s reason and submit a new request from the <strong style={{ color: C.navy }}>Resignation Request</strong> tab.
            </p>
          </div>
        </>
      ) : (
        <>
          {/* ══════════════════ PENDING / APPROVED ══════════════════ */}

          {/* Last Working Day (full-width) */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarClock size={17} strokeWidth={1.9} style={{ color: C.indigo }} />
              </div>
              <h3 style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, margin: 0 }}>
                {reviewState === 'approved' ? 'Last Working Day' : 'Requested Last Working Day'}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
              {/* left: date + pill */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 26, fontWeight: 800, color: C.navy, letterSpacing: '-0.5px' }}>
                    {fmtDate(reviewState === 'approved' ? CASE.confirmedLwdISO : CASE.requestedLwdISO)}
                  </span>
                  {reviewState === 'approved' ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.28)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#B45309' }}>{daysLeft} days remaining</span>
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.28)' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#B45309' }}>Awaiting manager approval</span>
                    </span>
                  )}
                </div>
                {reviewState === 'approved' && lwdChanged && (
                  <p style={{ fontSize: 11.5, color: C.muted, fontWeight: 500, margin: '10px 0 0' }}>
                    You requested {fmtDate(CASE.requestedLwdISO)} · confirmed by your manager.
                  </p>
                )}
              </div>

              {/* right: mini stats */}
              <div style={{ display: 'flex', gap: 32 }}>
                <MiniStat label="Notice Period" value={`${CASE.noticePeriodDays} days`} />
                <MiniStat
                  label={reviewState === 'approved' ? 'Accepted On' : 'Submitted On'}
                  value={fmtDate(reviewState === 'approved' ? CASE.acceptedISO : CASE.submittedISO)}
                />
                <MiniStat label="Request ID" value={CASE.requestId} />
              </div>
            </div>
          </div>

          {/* Clearance checklist (approved) OR not-yet-created note (pending) */}
          {reviewState === 'approved' ? (
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0 }}>Clearance Checklist</h3>
                <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, margin: '2px 0 0' }}>All items must be cleared before your offboarding can be completed.</p>
              </div>

              <div>
                {CHECKLIST.map((item, i) => {
                  const st = STATUS_STYLE[item.status]
                  const { Icon } = item
                  const StatusIcon = st.Icon
                  return (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 20px', borderBottom: i < CHECKLIST.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} strokeWidth={1.8} style={{ color: C.muted }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginTop: 1 }}>
                          {item.owner}{item.note ? ` · ${item.note}` : ''}
                        </div>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: st.bg, color: st.color, fontSize: 11.5, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>
                        <StatusIcon size={13} strokeWidth={2.2} style={{ color: st.color, animation: item.status === 'In Progress' ? 'offbSpin 0.9s linear infinite' : undefined }} />
                        {item.status}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <Lock size={13} strokeWidth={2} style={{ color: C.muted, marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 500, lineHeight: 1.55 }}>
                  You keep your laptop and system access throughout your notice period.
                  <strong style={{ color: C.navy }}> Asset Return and IT Access Revocation happen on your last working day</strong> — so they stay locked until then.
                </span>
              </div>
            </div>
          ) : (
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '40px 24px', textAlign: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <ClipboardList size={22} strokeWidth={1.6} style={{ color: C.muted }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, margin: 0 }}>Your clearance checklist isn’t ready yet</p>
              <p style={{ fontSize: 12.5, color: C.muted, fontWeight: 500, margin: '5px auto 0', maxWidth: 440, lineHeight: 1.6 }}>
                Once your manager approves your resignation, HR opens your offboarding case and your clearance checklist appears here.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginTop: 3 }}>{value}</div>
    </div>
  )
}
