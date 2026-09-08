import { Check, Lock, Trophy, ArrowRight, Clock3 } from 'lucide-react'
import { C, AWARD_THEME } from '../admin/spotlight/nominationTemplatesData'
import { MONTHS, formatDate } from '../admin/spotlight/responseFormsData'
import type { NominationInbox, NominationTask } from './nominationInboxData'
import SpotlightBreadcrumb from './SpotlightBreadcrumb'

/* ══════════════════════════════════════════
   Spotlight — "My Nomination" (read-only recap)
   Where the nominator lands once their nomination
   is in. Submitting is one-way: this page can be
   read, never edited.
══════════════════════════════════════════ */

const VIOLET = '#7C3AED'   // Spotlight identity — used for the section accent only
const INDIGO = '#6366F1'   // app theme — every action button
const GREEN  = '#0A7040'

interface Props {
  inbox: NominationInbox
  onBack: () => void
  onSubmitOutstanding: () => void
}

export default function MyNominationPage({ inbox, onBack, onSubmitOutstanding }: Props) {
  const { campaign, tasks, total, submittedCount, allSubmitted } = inbox

  const monthLabel  = `${MONTHS[campaign.month]} ${campaign.year}`
  const submitted   = tasks.filter(t => t.submission)
  const outstanding = tasks.filter(t => !t.submission)
  const firstSub    = submitted[0]?.submission

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      <SpotlightBreadcrumb backLabel="Dashboard" current="My Nomination" onBack={onBack} />

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap" style={{ marginBottom: 20 }}>
        <div>
          <div className="flex items-center gap-2.5" style={{ flexWrap: 'wrap' }}>
            <h1 className="text-2xl font-bold" style={{ color: C.navy }}>My Nomination</h1>
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20,
                fontSize: 11, fontWeight: 700,
                color: allSubmitted ? GREEN : '#A07800',
                background: allSubmitted ? 'rgba(14,168,106,0.10)' : 'rgba(212,168,0,0.14)',
                border: `1px solid ${allSubmitted ? 'rgba(14,168,106,0.22)' : 'rgba(212,168,0,0.28)'}`,
              }}
            >
              {allSubmitted ? <Check size={12} strokeWidth={2.8} /> : null}
              {allSubmitted ? 'Submitted' : `${submittedCount} of ${total} submitted`}
            </span>
          </div>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>
            Rewards &amp; Recognition · {monthLabel}
            {firstSub && <> · Submitted {formatDate(firstSub.submittedOn)} at {firstSub.submittedAt}</>}
          </p>
        </div>
      </div>

      {/* ── Confirmation strip — green only once everything really is in ── */}
      <div
        className="flex items-center gap-3"
        style={{
          background: allSubmitted
            ? 'linear-gradient(90deg, rgba(14,168,106,0.09), rgba(14,168,106,0.02))'
            : 'linear-gradient(90deg, rgba(245,158,11,0.10), rgba(245,158,11,0.02))',
          border: `1px solid ${allSubmitted ? 'rgba(14,168,106,0.22)' : 'rgba(245,158,11,0.28)'}`,
          borderLeft: `3px solid ${allSubmitted ? C.green : '#F59E0B'}`,
          borderRadius: 12, padding: '13px 16px', marginBottom: 20,
        }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 30, height: 30, borderRadius: 99,
            background: allSubmitted ? 'rgba(14,168,106,0.14)' : 'rgba(245,158,11,0.16)',
            border: `1px solid ${allSubmitted ? 'rgba(14,168,106,0.26)' : 'rgba(245,158,11,0.30)'}`,
          }}
        >
          {allSubmitted
            ? <Check size={15} strokeWidth={2.8} style={{ color: GREEN }} />
            : <Clock3 size={15} strokeWidth={2.3} style={{ color: '#B45309' }} />}
        </div>
        <p style={{ fontSize: 12.5, color: '#5A6080', lineHeight: 1.5, margin: 0 }}>
          {allSubmitted ? (
            <>
              <span style={{ fontWeight: 700, color: C.navy }}>Your nomination is in. </span>
              Nothing more is needed from you — the judging panel reviews every entry after nominations
              close on <span style={{ fontWeight: 600, color: C.navy }}>{formatDate(campaign.deadline)}</span>.
            </>
          ) : (
            <>
              <span style={{ fontWeight: 700, color: C.navy }}>
                {submittedCount} of {total} nominations submitted.{' '}
              </span>
              You still have{' '}
              <span style={{ fontWeight: 600, color: C.navy }}>
                {outstanding.map(t => AWARD_THEME[t.award].label).join(' and ')}
              </span>{' '}
              to go before nominations close on{' '}
              <span style={{ fontWeight: 600, color: C.navy }}>{formatDate(campaign.deadline)}</span>.
            </>
          )}
        </p>
      </div>

      {/* ── 8 / 4 grid ── */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '8fr 4fr', alignItems: 'start' }}>

        {/* ── Left: the submitted nomination(s) ── */}
        <div className="flex flex-col gap-5" style={{ minWidth: 0 }}>
          {submitted.map(task => <SubmittedAward key={task.round.id} task={task} />)}

          {outstanding.map(task => (
            <OutstandingAward key={task.round.id} task={task} onSubmit={onSubmitOutstanding} />
          ))}
        </div>

        {/* ── Right: what happens next ── */}
        <div className="flex flex-col gap-5" style={{ position: 'sticky', top: 0, minWidth: 0 }}>
          <WhatHappensNext inbox={inbox} />

          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
              <Lock size={14} strokeWidth={2} style={{ color: C.muted }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Need to change something?</span>
            </div>
            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, margin: 0 }}>
              Nominations can&apos;t be edited once submitted — one nomination per award, per month.
              Reach out to HR if you need yours withdrawn or corrected before the form closes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── One submitted award ─────────────────────────────── */
function SubmittedAward({ task }: { task: NominationTask }) {
  const theme = AWARD_THEME[task.award]
  const sub   = task.submission!
  const { nominee } = sub

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

      {/* Themed award strip */}
      <div
        className="flex items-center justify-between gap-3"
        style={{ padding: '13px 20px', background: theme.bg, borderBottom: `1px solid ${theme.border}` }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 30, height: 30, borderRadius: 9, background: '#fff', border: `1px solid ${theme.border}` }}
          >
            <theme.Icon size={15} strokeWidth={1.9} style={{ color: theme.color }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{theme.label}</span>
        </div>
        <span
          className="flex items-center gap-1.5 flex-shrink-0"
          style={{
            fontSize: 10.5, fontWeight: 700, color: GREEN, background: 'rgba(14,168,106,0.10)',
            border: '1px solid rgba(14,168,106,0.22)', borderRadius: 20, padding: '3px 9px',
          }}
        >
          <Check size={11} strokeWidth={2.8} />
          Submitted
        </span>
      </div>

      <div style={{ padding: 20 }}>

        {/* Nominee */}
        <SectionLabel>Your nominee</SectionLabel>
        <div className="flex items-center gap-3.5" style={{ marginTop: 10 }}>
          <img
            src={nominee.avatar}
            alt={nominee.name}
            style={{ width: 52, height: 52, borderRadius: 14, objectFit: 'cover', border: `1px solid ${C.border}`, flexShrink: 0 }}
          />
          <div className="min-w-0">
            <div style={{ fontSize: 16, fontWeight: 700, color: C.navy, lineHeight: 1.3 }}>{nominee.name}</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{nominee.role}</div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <MetaCell label="Email" value={nominee.email} />
        </div>

        {/* Reason */}
        <div style={{ height: 1, background: C.border, margin: '20px 0' }} />
        <SectionLabel>Why you nominated them</SectionLabel>
        <div
          style={{
            marginTop: 10, background: C.surface, border: `1px solid ${C.border}`,
            borderLeft: `3px solid ${theme.color}`, borderRadius: 10, padding: '14px 16px',
          }}
        >
          <p style={{ fontSize: 13, color: '#4A5070', lineHeight: 1.75, margin: 0, whiteSpace: 'pre-wrap' }}>
            {sub.reason}
          </p>
        </div>

        {/* Any extra answers the template asked for */}
        {sub.answers.length > 0 && (
          <div className="flex flex-col gap-3" style={{ marginTop: 18 }}>
            {sub.answers.map(a => (
              <div key={a.label}>
                <SectionLabel>{a.label}</SectionLabel>
                <p style={{ fontSize: 13, color: '#4A5070', lineHeight: 1.6, margin: '6px 0 0' }}>{a.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center gap-1.5"
          style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${C.border}`, fontSize: 11.5, color: C.muted, fontWeight: 500 }}
        >
          <Clock3 size={13} strokeWidth={2} />
          Submitted {formatDate(sub.submittedOn)} at {sub.submittedAt}
        </div>
      </div>
    </div>
  )
}

/* ── An award still awaiting this user (managers can owe two) ── */
function OutstandingAward({ task, onSubmit }: { task: NominationTask; onSubmit: () => void }) {
  const theme = AWARD_THEME[task.award]
  return (
    <div
      className="flex items-center justify-between gap-4"
      style={{ background: '#fff', border: `1px dashed #CFD4E6`, borderRadius: 16, padding: '18px 20px' }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{ width: 34, height: 34, borderRadius: 10, background: theme.bg, border: `1px solid ${theme.border}` }}
        >
          <theme.Icon size={16} strokeWidth={1.9} style={{ color: theme.color }} />
        </div>
        <div className="min-w-0">
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{theme.label}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>You haven&apos;t nominated anyone for this award yet.</div>
        </div>
      </div>
      <button
        onClick={onSubmit}
        className="flex items-center gap-1.5 rounded-lg border-none cursor-pointer font-semibold transition-all duration-150 flex-shrink-0"
        style={{ height: 36, padding: '0 14px', fontSize: 12.5, background: 'rgba(99,102,241,0.12)', color: INDIGO, whiteSpace: 'nowrap' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.20)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)' }}
      >
        Submit Nomination
        <ArrowRight size={14} strokeWidth={2.2} />
      </button>
    </div>
  )
}

/* ── Right rail: the journey after submitting ── */
function WhatHappensNext({ inbox }: { inbox: NominationInbox }) {
  const { campaign, tasks, submittedCount, total, allSubmitted } = inbox
  const firstSub = tasks.find(t => t.submission)?.submission

  const steps = [
    {
      title: allSubmitted ? 'Nomination submitted' : `Nomination submitted (${submittedCount} of ${total})`,
      meta: firstSub ? formatDate(firstSub.submittedOn) : '—',
      done: submittedCount > 0,
    },
    { title: 'Nominations close',    meta: formatDate(campaign.deadline),                     done: false },
    { title: 'HR compiles every entry', meta: 'All awards, all nominators',                   done: false },
    { title: 'Judging panel picks the winners', meta: 'Announced on the Spotlight board',     done: false },
  ]

  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 18 }}>
      <div className="flex items-center gap-2" style={{ marginBottom: 16 }}>
        <Trophy size={15} strokeWidth={2} style={{ color: VIOLET }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>What happens next</span>
      </div>

      {steps.map((s, i) => {
        const last = i === steps.length - 1
        return (
          <div key={s.title} className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className="flex items-center justify-center"
                style={{
                  width: 20, height: 20, borderRadius: 99,
                  background: s.done ? 'rgba(14,168,106,0.14)' : C.surface,
                  border: `1px solid ${s.done ? 'rgba(14,168,106,0.30)' : C.border}`,
                }}
              >
                {s.done
                  ? <Check size={11} strokeWidth={3} style={{ color: GREEN }} />
                  : <div style={{ width: 5, height: 5, borderRadius: 99, background: '#C8CCE0' }} />}
              </div>
              {!last && <div style={{ width: 2, flex: 1, minHeight: 22, background: C.border, marginTop: 3, marginBottom: 3 }} />}
            </div>

            <div style={{ paddingBottom: last ? 0 : 14, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: s.done ? C.navy : '#5A6080', lineHeight: 1.35 }}>
                {s.title}
              </div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{s.meta}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Small shared bits ── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {children}
    </span>
  )
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 13px', minWidth: 0 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value}
      </div>
    </div>
  )
}
