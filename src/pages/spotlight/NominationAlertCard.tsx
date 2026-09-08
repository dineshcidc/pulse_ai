import { Trophy, ArrowRight, Check, Clock3 } from 'lucide-react'
import { AWARD_THEME } from '../admin/spotlight/nominationTemplatesData'
import { MONTHS, formatDateShort } from '../admin/spotlight/responseFormsData'
import { nominationInboxFor, type NominatorRole } from './nominationInboxData'

/* ══════════════════════════════════════════
   Spotlight — dashboard alert card (Step 9)
   Shown on the Manager + Employee dashboards
   while a nomination campaign is open for them.
══════════════════════════════════════════ */

const C = {
  navy:    '#1C2035',
  border:  '#E8EAF2',
  muted:   '#8B90A7',
  surface: '#F7F8FC',
  body:    '#5A6080',
}

/* Spotlight owns violet — appraisal is indigo, offboarding is amber. */
const VIOLET = '#7C3AED'
const GREEN  = '#0A7040'
const DUE    = '#C0202E'

interface Props {
  role: NominatorRole
  onNavigate?: (id: string) => void
}

export default function NominationAlertCard({ role, onNavigate }: Props) {
  const inbox = nominationInboxFor(role)
  if (!inbox) return null

  const { campaign, tasks, total, submittedCount, allSubmitted, daysRemaining, closingSoon } = inbox

  const monthLabel = `${MONTHS[campaign.month]} ${campaign.year}`
  const accent     = allSubmitted ? GREEN : VIOLET
  const accentRGB  = allSubmitted ? '14,168,106' : '124,58,237'

  /* Pill mirrors the sibling alert cards' gold "New" chip, and turns green once done. */
  const pill = allSubmitted
    ? { text: 'Submitted', color: GREEN, bg: 'rgba(14,168,106,0.12)', border: 'rgba(14,168,106,0.26)' }
    : submittedCount > 0
      ? { text: `${submittedCount} of ${total} submitted`, color: '#A07800', bg: 'rgba(212,168,0,0.14)', border: 'rgba(212,168,0,0.28)' }
      : { text: 'Open', color: '#A07800', bg: 'rgba(212,168,0,0.14)', border: 'rgba(212,168,0,0.28)' }

  const message = allSubmitted
    ? 'Thanks — your nomination is in. You can review it any time before the form closes.'
    : role === 'manager'
      ? 'Nominate one member of your team for each award and tell us why they stand out this month.'
      : 'Nominate one colleague who has gone above and beyond, and tell us why they deserve it.'

  /* `Submit Nomination` means submit, and nothing else — it stays put while any award is
     still outstanding. Once everything is in, the card only offers the read-only recap. */
  const ctaLabel = allSubmitted ? 'View Nomination' : 'Submit Nomination'

  const daysText = daysRemaining === 0
    ? 'closes today'
    : daysRemaining === 1
      ? '1 day left'
      : `${daysRemaining} days left`

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 14 }}>

      {/* ── Banner ── */}
      <div
        className="flex items-center justify-between gap-4"
        style={{
          padding: '14px 18px',
          background: `linear-gradient(90deg, rgba(${accentRGB},0.10), rgba(${accentRGB},0.02))`,
          border: `1px solid rgba(${accentRGB},0.24)`,
          borderLeft: `3px solid ${accent}`,
          borderRadius: 12,
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 34, height: 34, borderRadius: 9,
              background: `rgba(${accentRGB},0.14)`, border: `1px solid rgba(${accentRGB},0.26)`,
            }}
          >
            <Trophy size={17} strokeWidth={1.8} style={{ color: accent }} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>
                Rewards &amp; Recognition — {monthLabel}
              </span>
              <span
                style={{
                  fontSize: 9, fontWeight: 700, color: pill.color,
                  background: pill.bg, border: `1px solid ${pill.border}`,
                  borderRadius: 5, padding: '1px 6px', textTransform: 'uppercase', letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
              >
                {pill.text}
              </span>
            </div>
            <p style={{ fontSize: 11.5, color: C.body, lineHeight: 1.45, margin: '3px 0 0', minWidth: 170, maxWidth: 460, whiteSpace: 'normal', overflowWrap: 'anywhere' }}>
              {message}
              <span style={{ color: closingSoon ? DUE : C.body, fontWeight: 600 }}>
                {' '}Closes {formatDateShort(campaign.deadline)} · {daysText}.
              </span>
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate?.('spotlight-nominate')}
          className="flex items-center gap-1.5 rounded-lg border-none cursor-pointer font-semibold transition-all duration-150 flex-shrink-0"
          style={{ height: 36, padding: '0 14px', fontSize: 12.5, background: `rgba(${accentRGB},0.12)`, color: accent, whiteSpace: 'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.background = `rgba(${accentRGB},0.20)` }}
          onMouseLeave={e => { e.currentTarget.style.background = `rgba(${accentRGB},0.12)` }}
        >
          {ctaLabel}
          <ArrowRight size={14} strokeWidth={2.2} />
        </button>
      </div>

      {/* ── One tile per award this user has to nominate for ── */}
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${Math.min(total, 2)}, minmax(0, 1fr))`, gap: 10, marginTop: 10 }}
      >
        {tasks.map(({ round, award, submission }) => {
          const theme = AWARD_THEME[award]
          const done  = submission !== null
          return (
            <div
              key={round.id}
              className="flex items-center gap-2.5 min-w-0"
              style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '11px 13px' }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: 30, height: 30, borderRadius: 9, background: theme.bg, border: `1px solid ${theme.border}` }}
              >
                <theme.Icon size={15} strokeWidth={1.8} style={{ color: theme.color }} />
              </div>

              <div className="min-w-0 flex-1">
                <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {theme.label}
                </div>
                <div style={{ fontSize: 11, fontWeight: 500, color: done ? GREEN : C.muted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {done ? `You nominated ${submission.nominee.name}` : 'Awaiting your nomination'}
                </div>
              </div>

              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 22, height: 22, borderRadius: 99,
                  background: done ? 'rgba(14,168,106,0.12)' : 'rgba(139,144,167,0.12)',
                  border: `1px solid ${done ? 'rgba(14,168,106,0.26)' : 'rgba(139,144,167,0.24)'}`,
                }}
                title={done ? 'Submitted' : 'Not submitted yet'}
              >
                {done
                  ? <Check size={12} strokeWidth={2.6} style={{ color: GREEN }} />
                  : <Clock3 size={12} strokeWidth={2.2} style={{ color: C.muted }} />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
