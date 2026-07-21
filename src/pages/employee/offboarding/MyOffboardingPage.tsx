import {
  CalendarClock, TrendingUp, MessageSquareText, UserCheck, Package,
  ShieldCheck, ClipboardList, Wallet, Users, CheckCircle2, LoaderCircle,
  Circle, Lock,
} from 'lucide-react'
import type { ElementType } from 'react'

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

/* ── Mock offboarding case (early stage — notice period just started) ── */
const CASE = {
  requestId: 'RES-2026-482',
  stage: 'Notice Period Started',
  resignationDate: '2026-07-14',
  acceptedDate: '2026-07-17',
  lwd: '2026-10-15',
  noticePeriodDays: 90,
}

/*
 * Order = real-world timeline. The employee keeps their laptop & access
 * through the whole notice period, so Asset Return and IT Access Revoked
 * are the FINAL steps — they happen on the last working day.
 *
 * Early-stage snapshot: the employee has just started their notice period.
 * Only Knowledge Transfer has begun & completed; everything else is pending.
 */
const CHECKLIST: ClearItem[] = [
  { Icon: MessageSquareText, name: 'Knowledge Transfer', owner: 'You',                    status: 'Completed' },
  { Icon: UserCheck,         name: 'Manager Clearance',  owner: 'Priya Sharma (Manager)', status: 'Pending' },
  { Icon: ClipboardList,     name: 'Exit Interview',     owner: 'You / HR',               status: 'Pending' },
  { Icon: Wallet,            name: 'Finance Clearance',  owner: 'Finance',                status: 'Pending' },
  { Icon: Users,             name: 'HR Clearance',       owner: 'HR',                     status: 'Pending' },
  { Icon: Package,           name: 'Asset Return',       owner: 'You / IT',               status: 'Pending', note: `On your last working day (${fmtDate(CASE.lwd)})` },
  { Icon: ShieldCheck,       name: 'IT Access Revoked',  owner: 'IT',                     status: 'Pending', note: 'End of your last working day' },
]

const STAGES = ['Submitted', 'Accepted', 'Notice Period', 'Clearance', 'F&F', 'Documents', 'Offboarded']
// Only Submitted + Accepted are done. Clearance work (Manager Clearance, etc.)
// is still pending, so no later step is highlighted as active yet.
const COMPLETED_STAGES = 2

const STATUS_STYLE: Record<ClearStatus, { bg: string; color: string; dot: string; Icon: ElementType }> = {
  'Completed':   { bg: 'rgba(14,168,106,0.12)', color: '#0A7040', dot: '#0EA86A', Icon: CheckCircle2 },
  'In Progress': { bg: 'rgba(99,102,241,0.12)', color: '#4F46E5', dot: '#6366F1', Icon: LoaderCircle },
  'Pending':     { bg: '#EEF0F6',               color: '#8B90A7', dot: '#B0B4C8', Icon: Circle },
  'Locked':      { bg: 'rgba(245,158,11,0.10)', color: '#B45309', dot: '#F59E0B', Icon: Lock },
}

function fmtDate(d: string) {
  const parsed = new Date(d)
  if (isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export default function MyOffboardingPage() {
  const today = new Date()
  const daysLeft = Math.max(0, daysBetween(today, new Date(CASE.lwd)))
  const completed = CHECKLIST.filter(c => c.status === 'Completed').length
  const total = CHECKLIST.length
  const pct = Math.round((completed / total) * 100)

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes offbSpin { to { transform: rotate(360deg) } }`}</style>

      {/* Section header */}
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0 }}>My Offboarding</h2>
        <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, margin: '3px 0 0' }}>
          Track your exit progress, clearances, and last working day — all in one place.
        </p>
      </div>

      {/* ── Top: Last Working Day + Overall Progress ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        {/* LWD countdown */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarClock size={17} strokeWidth={1.9} style={{ color: C.indigo }} />
            </div>
            <h3 style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, margin: 0 }}>Last Working Day</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: C.navy, letterSpacing: '-0.5px' }}>{fmtDate(CASE.lwd)}</span>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '5px 11px', borderRadius: 999, background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.28)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#B45309' }}>{daysLeft} days remaining</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <MiniStat label="Notice Period" value={`${CASE.noticePeriodDays} days`} />
            <MiniStat label="Accepted On" value={fmtDate(CASE.acceptedDate)} />
          </div>
        </div>

        {/* Overall progress */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(14,168,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={17} strokeWidth={1.9} style={{ color: '#0A7040' }} />
            </div>
            <h3 style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, margin: 0 }}>Overall Progress</h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: C.navy, letterSpacing: '-1px' }}>{pct}%</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}>{completed} of {total} clearances completed</span>
          </div>

          <div style={{ height: 10, background: '#EEF0F6', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #6366F1, #4F46E5)', transition: 'width 0.4s ease' }} />
          </div>

          <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, margin: '14px 0 0', lineHeight: 1.55 }}>
            Current stage: <strong style={{ color: C.navy }}>{CASE.stage}</strong> · Request ID <strong style={{ color: C.navy }}>{CASE.requestId}</strong>
          </p>
        </div>
      </div>

      {/* ── Stage stepper ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 22px', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {STAGES.map((s, i, arr) => {
            const done = i < COMPLETED_STAGES
            const active = false
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'flex-start', flex: i < arr.length - 1 ? 1 : 'unset' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 60 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    background: done ? '#0EA86A' : active ? 'rgba(99,102,241,0.14)' : C.bg,
                    border: active ? `2px solid ${C.indigo}` : 'none',
                  }}>
                    {done
                      ? <CheckCircle2 size={16} strokeWidth={2.4} style={{ color: '#fff' }} />
                      : <span style={{ fontSize: 11.5, fontWeight: 700, color: active ? C.indigo : C.muted }}>{i + 1}</span>}
                  </div>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: done || active ? C.navy : C.muted, textAlign: 'center', lineHeight: 1.3 }}>{s}</span>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ flex: 1, height: 2, borderRadius: 2, background: done ? '#0EA86A' : C.border, marginTop: 13 }} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Clearance checklist ── */}
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
              <div
                key={item.name}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '15px 20px',
                  borderBottom: i < CHECKLIST.length - 1 ? `1px solid ${C.border}` : 'none',
                }}
              >
                {/* item icon */}
                <div style={{ width: 38, height: 38, borderRadius: 10, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} strokeWidth={1.8} style={{ color: C.muted }} />
                </div>

                {/* name + owner */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginTop: 1 }}>
                    {item.owner}{item.note ? ` · ${item.note}` : ''}
                  </div>
                </div>

                {/* status badge */}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: st.bg, color: st.color, fontSize: 11.5, fontWeight: 600, flexShrink: 0, whiteSpace: 'nowrap' }}>
                  <StatusIcon
                    size={13}
                    strokeWidth={2.2}
                    style={{ color: st.color, animation: item.status === 'In Progress' ? 'offbSpin 0.9s linear infinite' : undefined }}
                  />
                  {item.status}
                </span>
              </div>
            )
          })}
        </div>

        {/* dependency note */}
        <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
          <Lock size={13} strokeWidth={2} style={{ color: C.muted, marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: C.muted, fontWeight: 500, lineHeight: 1.55 }}>
            You keep your laptop and system access throughout your notice period to complete your work and handover.
            <strong style={{ color: C.navy }}> Asset Return and IT Access Revocation happen on your last working day</strong> — so they stay locked until then.
          </span>
        </div>
      </div>
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
