import { Lock, Trophy, CircleCheck, Calendar, Clock } from 'lucide-react'
import { C, AWARD_THEME } from '../admin/spotlight/nominationTemplatesData'
import { formatDate } from '../admin/spotlight/responseFormsData'
import type { NominationRecord } from './nominationInboxData'
import SpotlightBreadcrumb from './SpotlightBreadcrumb'

/* ══════════════════════════════════════════
   Spotlight — one nomination, read-only
   Reached from the Reward Nominations list.
   Works for any month, open or long closed —
   `MyNominationPage` is the current-month
   recap and stays separate.
══════════════════════════════════════════ */

interface Props {
  record: NominationRecord
  onBack: () => void
}

export default function NominationRecordViewPage({ record, onBack }: Props) {
  const theme = AWARD_THEME[record.award]
  const sub   = record.submission

  /* The list only ever opens a submitted row, but the route is addressable by key. */
  if (!sub) {
    return (
      <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <SpotlightBreadcrumb backLabel="Reward Nominations" current={record.monthLabel} onBack={onBack} />
        <div
          className="rounded-2xl flex items-center justify-center"
          style={{ background: '#fff', border: `1px solid ${C.border}`, minHeight: 300 }}
        >
          <div className="text-center" style={{ maxWidth: 340, padding: 24 }}>
            <div
              className="flex items-center justify-center mx-auto"
              style={{ width: 46, height: 46, borderRadius: 13, background: theme.bg, border: `1px solid ${theme.border}`, marginBottom: 13 }}
            >
              <theme.Icon size={21} strokeWidth={1.7} style={{ color: theme.color }} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: 0 }}>
              No nomination was submitted
            </p>
            <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6, margin: '8px 0 0' }}>
              {theme.label} for {record.monthLabel} closed without an entry from you.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <SpotlightBreadcrumb
        backLabel="Reward Nominations"
        current={`${record.monthLabel} · ${theme.label}`}
        onBack={onBack}
      />

      {/* ── Header ── */}
      <div style={{ marginBottom: 20 }}>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold" style={{ color: C.navy }}>{theme.label}</h1>
          <span
            className="inline-flex items-center gap-1.5"
            style={{ padding: '4px 10px', borderRadius: 999, background: 'rgba(14,168,106,0.12)', fontSize: 11.5, fontWeight: 700, color: C.green }}
          >
            <CircleCheck size={13} strokeWidth={2.4} />
            Submitted
          </span>
        </div>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>
          Rewards &amp; Recognition · {record.monthLabel} · Submitted {formatDate(sub.submittedOn)} at {sub.submittedAt}
        </p>
      </div>

      {/* ── 8 / 4 with a sticky right rail ── */}
      <div className="grid gap-5" style={{ gridTemplateColumns: 'minmax(0, 8fr) minmax(0, 4fr)', alignItems: 'start' }}>

        {/* LEFT — the nomination itself */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', minWidth: 0 }}>

          {/* Award strip — identity colour */}
          <div
            className="flex items-center gap-2.5"
            style={{ padding: '14px 20px', background: theme.bg, borderBottom: `1px solid ${theme.border}` }}
          >
            <div
              className="flex items-center justify-center flex-shrink-0"
              style={{ width: 32, height: 32, borderRadius: 9, background: '#fff', border: `1px solid ${theme.border}` }}
            >
              <theme.Icon size={16} strokeWidth={1.9} style={{ color: theme.color }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{theme.label}</span>
          </div>

          <div style={{ padding: 20 }}>

            {/* Nominee — picture, name, role, email (nominator-side convention) */}
            <SectionLabel>Your nominee</SectionLabel>
            <div className="flex items-center gap-3.5" style={{ marginTop: 10 }}>
              <img
                src={sub.nominee.avatar}
                alt={sub.nominee.name}
                style={{ width: 52, height: 52, borderRadius: 14, objectFit: 'cover', border: `1px solid ${C.border}`, flexShrink: 0 }}
              />
              <div className="min-w-0">
                <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, lineHeight: 1.3 }}>{sub.nominee.name}</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{sub.nominee.role}</div>
              </div>
            </div>

            <div style={{ marginTop: 14 }}>
              <MetaCell label="Email" value={sub.nominee.email} />
            </div>

            {/* Reason — full, never truncated */}
            <div style={{ height: 1, background: C.border, margin: '20px 0' }} />
            <SectionLabel>Why you nominated them</SectionLabel>
            <div
              style={{
                marginTop: 10, background: C.surface, border: `1px solid ${C.border}`,
                borderLeft: `3px solid ${theme.color}`, borderRadius: 10, padding: '14px 16px',
                fontSize: 13, color: '#3A3F5C', lineHeight: 1.75, whiteSpace: 'pre-wrap',
              }}
            >
              {sub.reason}
            </div>

            {/* Anything else the template asked for */}
            {sub.answers.length > 0 && (
              <>
                <div style={{ height: 1, background: C.border, margin: '20px 0' }} />
                {sub.answers.map((a, i) => (
                  <div key={a.label} style={{ marginTop: i === 0 ? 0 : 16 }}>
                    <SectionLabel>{a.label}</SectionLabel>
                    <div style={{ fontSize: 13, color: '#3A3F5C', lineHeight: 1.7, marginTop: 6 }}>{a.value}</div>
                  </div>
                ))}
              </>
            )}

            <div style={{ height: 1, background: C.border, margin: '20px 0 14px' }} />
            <div className="flex items-center gap-1.5" style={{ fontSize: 11.5, color: C.muted }}>
              <Clock size={13} strokeWidth={2} />
              Submitted {formatDate(sub.submittedOn)} at {sub.submittedAt}
            </div>
          </div>
        </div>

        {/* RIGHT — sticky rail */}
        <div className="flex flex-col gap-5" style={{ position: 'sticky', top: 0, minWidth: 0 }}>

          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 14 }}>
              <Trophy size={15} strokeWidth={2} style={{ color: '#7C3AED' }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Nomination details</span>
            </div>

            <DetailRow label="Award" value={theme.label} />
            <DetailRow label="Month" value={record.monthLabel} />
            <DetailRow label="Nominations closed" value={formatDate(record.campaign.deadline)} />
            <DetailRow
              label="Round"
              value={record.isOpen ? 'Open — judging not started' : 'Closed'}
              last
            />
          </div>

          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
              <Lock size={14} strokeWidth={2} style={{ color: C.muted }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>This is a record</span>
            </div>
            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.65, margin: 0 }}>
              Nominations can&apos;t be edited once submitted — one per award, per month. Reach out to
              HR if something needs correcting on an open round.
            </p>
          </div>

          <div
            className="flex items-start gap-2.5"
            style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 16, padding: 16 }}
          >
            <Calendar size={14} strokeWidth={2} style={{ color: '#7C3AED', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 12, color: '#5A6080', lineHeight: 1.65, margin: 0 }}>
              Winners are picked by the judging panel after nominations close, and announced on the
              Spotlight board.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Bits ──────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 10.5, fontWeight: 700, color: C.muted,
        textTransform: 'uppercase', letterSpacing: '0.06em',
      }}
    >
      {children}
    </div>
  )
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 13px', minWidth: 0 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </div>
    </div>
  )
}

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div
      className="flex items-baseline justify-between gap-3"
      style={{
        padding: '9px 0',
        borderBottom: last ? 'none' : `1px solid ${C.border}`,
      }}
    >
      <span style={{ fontSize: 12, color: C.muted, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, textAlign: 'right' }}>{value}</span>
    </div>
  )
}
