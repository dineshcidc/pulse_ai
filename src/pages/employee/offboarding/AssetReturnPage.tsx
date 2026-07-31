import {
  Package, Laptop, Monitor, Smartphone, Keyboard, CreditCard,
  CalendarClock, PackageCheck, CircleDot, CheckCircle2, Lock, ShieldCheck, XCircle,
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

/* ── Shared offboarding case (same as My Offboarding) ── */
const CASE = {
  lwd: '2026-10-15',
  noticePeriodDays: 90,
}

type AssetStatus = 'With You' | 'Returned'

interface AssetRow {
  code: string
  name: string
  category: string
  Icon: ElementType
  since: string
  status: AssetStatus
}

/* Everything the employee currently holds. During the notice period all assets
 * stay "With You" — they are handed back and verified by IT on the last day. */
const ASSETS: AssetRow[] = [
  { code: 'LT-2024-0042', name: 'MacBook Pro 14" M2',       category: 'Laptop',      Icon: Laptop,     since: '2024-01-15', status: 'With You' },
  { code: 'MN-2024-0089', name: 'Dell 27" 4K Ultra HD',     category: 'Monitor',     Icon: Monitor,    since: '2024-01-15', status: 'With You' },
  { code: 'AC-2024-0156', name: 'Wireless Mouse & Keyboard', category: 'Accessory',   Icon: Keyboard,   since: '2026-06-01', status: 'With You' },
  { code: 'PH-2024-0033', name: 'iPhone 13 (Company)',       category: 'Phone',       Icon: Smartphone, since: '2024-03-20', status: 'With You' },
  { code: 'ID-2024-1180', name: 'Office Access Card',        category: 'Access Card', Icon: CreditCard, since: '2024-01-15', status: 'With You' },
]

const STATUS_STYLE: Record<AssetStatus, { bg: string; color: string; dot: string; Icon: ElementType }> = {
  'With You':  { bg: 'rgba(99,102,241,0.10)', color: '#4F46E5', dot: '#6366F1', Icon: CircleDot },
  'Returned':  { bg: 'rgba(14,168,106,0.12)', color: '#0A7040', dot: '#0EA86A', Icon: CheckCircle2 },
}

const RETURN_STEPS = [
  'Back up any personal files and sign out of all your accounts on every device.',
  'Pack each device with its charger, cables, and original accessories.',
  'Hand everything to IT / Office Admin at the front desk on your last working day.',
  'IT inspects each item and marks your Asset Return clearance as complete.',
]

const COL = '2.4fr 1.2fr 1.2fr 1fr'

function fmtDate(d: string) {
  const parsed = new Date(d)
  if (isNaN(parsed.getTime())) return '—'
  return parsed.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24))
}

export default function AssetReturnPage({ reviewState, onReviewChange }: OffboardingTabProps) {
  const today = new Date()
  const daysLeft = Math.max(0, daysBetween(today, new Date(CASE.lwd)))
  const total = ASSETS.length
  const returned = ASSETS.filter(a => a.status === 'Returned').length

  const subtitle =
    reviewState === 'rejected'
      ? 'Your resignation was not accepted, so there’s nothing to return.'
      : reviewState === 'pending'
      ? 'Your asset return will be scheduled once your offboarding begins.'
      : 'These are the company assets assigned to you. You’ll return them all on your last working day.'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`.ar-row:hover { background:#FAFBFE !important; }`}</style>

      {/* Header + preview switcher */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.navy, margin: 0 }}>Asset Return</h2>
          <p style={{ fontSize: 13, color: C.muted, fontWeight: 500, margin: '3px 0 0' }}>{subtitle}</p>
        </div>
        <PreviewSwitcher value={reviewState} onChange={onReviewChange} />
      </div>

      {reviewState !== 'approved' ? (
        <LockedNote state={reviewState} />
      ) : (
        <>
          {/* Information section */}
          <div style={{ display: 'flex', gap: 13, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.20)', borderRadius: 12, padding: '14px 16px', marginBottom: 18 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Package size={18} strokeWidth={1.9} style={{ color: C.indigo }} />
            </div>
            <div>
              <h4 style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, margin: 0 }}>Keep your assets until your last working day</h4>
              <p style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500, margin: '3px 0 0', lineHeight: 1.6 }}>
                You need your laptop and devices to finish your work, so keep them through your notice period.
                On <strong>{fmtDate(CASE.lwd)}</strong>, hand everything back to IT / Office Admin — they'll verify each item and
                complete your <strong>Asset Return</strong> clearance. Nothing to submit here; this list is managed by IT.
              </p>
            </div>
          </div>

          {/* Top: Return due + Assets summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarClock size={17} strokeWidth={1.9} style={{ color: C.indigo }} />
                </div>
                <h3 style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, margin: 0 }}>Return Due On</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: C.navy, letterSpacing: '-0.5px' }}>{fmtDate(CASE.lwd)}</span>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '5px 11px', borderRadius: 999, background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.28)' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#B45309' }}>{daysLeft} days remaining</span>
              </div>
            </div>

            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(14,168,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PackageCheck size={17} strokeWidth={1.9} style={{ color: '#0A7040' }} />
                </div>
                <h3 style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, margin: 0 }}>Assets to Return</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{ fontSize: 30, fontWeight: 800, color: C.navy, letterSpacing: '-1px' }}>{total}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}>company assets assigned to you</span>
              </div>
              <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, margin: '14px 0 0', lineHeight: 1.55 }}>
                <strong style={{ color: '#0A7040' }}>{returned} returned</strong> · <strong style={{ color: C.navy }}>{total - returned} still with you</strong> — all due back on your last working day.
              </p>
            </div>
          </div>

          {/* Assets list */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: C.surface }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0 }}>Assets Assigned to You ({total})</h3>
              <p style={{ fontSize: 12, color: C.muted, fontWeight: 500, margin: '2px 0 0' }}>IT updates each item's status when you hand it back on your last day.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: COL, gap: 16, padding: '12px 20px', borderBottom: `1px solid ${C.border}` }}>
              {['Asset', 'Asset Code', 'Assigned Since', 'Status'].map((h, i) => (
                <span key={i} style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>

            {ASSETS.map((a, idx) => {
              const st = STATUS_STYLE[a.status]
              const StatusIcon = st.Icon
              const { Icon } = a
              return (
                <div key={a.code} className="ar-row" style={{ display: 'grid', gridTemplateColumns: COL, gap: 16, padding: '15px 20px', alignItems: 'center', borderBottom: idx < ASSETS.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.12s' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={17} strokeWidth={1.9} style={{ color: C.muted }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</div>
                      <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 500, marginTop: 2 }}>{a.category}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, fontFamily: 'monospace' }}>{a.code}</span>
                  <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{fmtDate(a.since)}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, background: st.bg, color: st.color, fontSize: 11.5, fontWeight: 600, width: 'fit-content', whiteSpace: 'nowrap' }}>
                    <StatusIcon size={13} strokeWidth={2.2} style={{ color: st.color }} />
                    {a.status}
                  </span>
                </div>
              )
            })}

            <div style={{ padding: '12px 20px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
              <Lock size={13} strokeWidth={2} style={{ color: C.muted, marginTop: 2, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: C.muted, fontWeight: 500, lineHeight: 1.55 }}>
                <strong style={{ color: C.navy }}>Asset Return is a last-working-day step.</strong> Your assets stay with you through the notice period and are marked returned only after IT verifies them on {fmtDate(CASE.lwd)}.
              </span>
            </div>
          </div>

          {/* How to return */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 22px', marginTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={16} strokeWidth={1.9} style={{ color: C.indigo }} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0 }}>How to return your assets</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {RETURN_STEPS.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#4F46E5' }}>{i + 1}</span>
                  </div>
                  <span style={{ fontSize: 13, color: '#4A4F6A', fontWeight: 500, lineHeight: 1.6 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ── Locked / not-applicable state shown before approval ── */
function LockedNote({ state }: { state: 'pending' | 'rejected' }) {
  const pending = state === 'pending'
  const Icon: ElementType = pending ? Lock : XCircle
  const iconColor = pending ? '#B45309' : '#C0202E'
  const iconBg = pending ? 'rgba(245,158,11,0.12)' : 'rgba(232,72,85,0.10)'
  const title = pending ? 'Asset return isn’t scheduled yet' : 'Nothing to return'
  const body = pending
    ? 'Once your resignation is approved, the company assets you need to return will appear here — along with your return date (your last working day).'
    : 'Your resignation wasn’t accepted, so no asset return is required.'
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
