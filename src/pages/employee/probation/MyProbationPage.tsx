/* ─────────────────────────────────────────────────────────────────────────────
 * Stage 2 — Employee Probation screen (My Probation)
 *
 * One status-driven screen. A dummy "Demo phase" switcher (prototype aid) lets BA
 * + dev walk all three phases live:
 *
 *   A · Ongoing        → time-table view, self-assessment LOCKED
 *   B · Unlocked       → ~15 days before end date, self-assessment form OPEN
 *   C · Submitted      → read-only, status handed off → Pending Manager Review
 * ──────────────────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import {
  CalendarClock, CalendarCheck, CalendarDays, Hourglass, Lock, FileText,
  ClipboardEdit, CheckCircle2, ArrowRight, Info, Send,
  Award, RefreshCw, XCircle, CalendarPlus, Mail,
} from 'lucide-react'
import {
  PC, STATUS_META, StatusPill, DaysRemainingChip, EmployeeDetailHeader, ReadField,
  DemoPhaseSwitcher, fmtDate, daysUntil, SELF_ASSESSMENT_WINDOW_DAYS,
  SectionCard, StatBox, QuestionCard, SELF_ASSESSMENT_QUESTIONS as QUESTIONS,
  MOCK_MY_CASE, type ProbationStatus, type SelfAssessment,
} from './probationShared'

const font = "'DM Sans', system-ui, sans-serif"

type Phase = 'ongoing' | 'unlocked' | 'submitted' | 'confirmed' | 'extended' | 'terminated'

const PHASE_OPTIONS: { id: Phase; label: string }[] = [
  { id: 'ongoing',    label: 'A · Ongoing' },
  { id: 'unlocked',   label: 'B · Unlocked' },
  { id: 'submitted',  label: 'C · Submitted' },
  { id: 'confirmed',  label: 'D · Confirmed' },
  { id: 'extended',   label: 'E · Extended' },
  { id: 'terminated', label: 'F · Terminated' },
]

// Phases that happen while the clock is still running (pre-decision).
const PRE_DECISION: Phase[] = ['ongoing', 'unlocked', 'submitted']

// A simulated "today" per phase so the countdown tells the right story in the demo.
function refDateForPhase(endDate: string, phase: Phase): Date {
  const end = new Date(endDate + 'T00:00:00')
  const back = phase === 'ongoing' ? 62 : phase === 'unlocked' ? 9 : 6
  return new Date(end.getTime() - back * 86_400_000)
}

// Mock outcome details as if set by the Admin's final decision (Stage 4).
const OUTCOME = {
  confirmedOn:    '2026-08-12',
  extendedOn:     '2026-08-12',
  newEndDate:     '2026-11-10',
  extendReason:   "We'd like to see more consistent, independent ownership of the billing module before confirming. A short extension gives you the runway to demonstrate this — everything else has been strong.",
  terminatedOn:   '2026-08-12',
  terminateReason:'After careful review of the self-assessment and the reporting manager\'s feedback, performance during the probation period did not meet the expectations required for the role, despite the guidance and support provided.',
  decidedBy:      'HR — Admin',
}

// ─── Main screen ────────────────────────────────────────────────────────────────

export default function MyProbationPage() {
  const c = MOCK_MY_CASE
  const [phase, setPhase] = useState<Phase>('ongoing')

  // Self-assessment form state
  const [form, setForm] = useState<SelfAssessment>({ performance: '', learnings: '', challenges: '', goalsMet: '' })
  const [submitting, setSubmitting] = useState(false)

  const set = (k: keyof SelfAssessment) => (v: string) => setForm(p => ({ ...p, [k]: v }))
  const formComplete = !!form.performance && !!form.learnings && !!form.challenges && !!form.goalsMet

  // Extended pushes the end date out; other outcome phases keep the original.
  const effectiveEndDate = phase === 'extended' ? OUTCOME.newEndDate : c.endDate
  const isPreDecision = PRE_DECISION.includes(phase)
  const ref = isPreDecision ? refDateForPhase(c.endDate, phase) : new Date()
  const daysLeft = daysUntil(effectiveEndDate, ref)
  const showCountdown = phase === 'ongoing' || phase === 'unlocked' || phase === 'extended'

  const status: ProbationStatus =
      phase === 'submitted'  ? 'Pending Manager Review'
    : phase === 'confirmed'  ? 'Confirmed'
    : phase === 'extended'   ? 'Ongoing (Extended)'
    : phase === 'terminated' ? 'Terminated'
    : 'Ongoing'

  // Progress across the probation window (0–100%); a decided case reads as complete.
  const decided = phase === 'confirmed' || phase === 'terminated'
  const totalDays = Math.max(1, daysUntil(effectiveEndDate, new Date(c.startDate + 'T00:00:00')))
  const elapsed = Math.min(totalDays, Math.max(0, totalDays - Math.max(0, daysLeft)))
  const pct = decided ? 100 : Math.round((elapsed / totalDays) * 100)

  // The read-only submitted assessment (either what was just typed, or the demo sample)
  const submitted: SelfAssessment = formComplete
    ? { ...form, submittedOn: '2026-08-04' }
    : {
        performance: 'I have consistently met my sprint commitments and improved my code-review turnaround over the last quarter.',
        learnings: 'Deepened my React + TypeScript skills and learned our CI/CD pipeline end to end.',
        challenges: 'Ramping up on the legacy billing service took longer than I expected.',
        goalsMet: 'Shipped the notifications module and reduced its p95 latency by 30%.',
        submittedOn: '2026-08-04',
      }

  async function handleSubmit() {
    if (!formComplete) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitting(false)
    setPhase('submitted')
  }

  return (
    <div style={{ fontFamily: font, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Page title */}
      <div style={{ minWidth: 0 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: PC.navy, letterSpacing: '-0.4px' }}>My Probation</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
          Track your probation period and submit your self-assessment when it opens.
        </p>
      </div>

      {/* Demo phase switcher — full-width segmented bar */}
      <DemoPhaseSwitcher options={PHASE_OPTIONS} value={phase} onChange={setPhase} />

      {/* Employee header with live status + countdown */}
      <EmployeeDetailHeader
        c={{ ...c, status }}
        right={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <StatusPill status={status} />
            {showCountdown && <DaysRemainingChip endDate={effectiveEndDate} from={ref} />}
          </div>
        }
      />

      {/* ── Time-table: the always-visible probation details ── */}
      <SectionCard
        icon={<CalendarClock size={16} color={PC.indigo} />}
        title="Probation Details"
        subtitle="Set by HR when your account was created"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
          <StatBox icon={<Hourglass size={14} color={PC.indigo} />} accent={PC.indigo} label="Duration" value={`${c.durationMonths} months`} />
          <StatBox icon={<CalendarDays size={14} color={PC.blue} />}   accent={PC.blue}   label="Start Date" value={fmtDate(c.startDate)} />
          <StatBox icon={<CalendarCheck size={14} color={PC.amber} />} accent={PC.amber}  label={phase === 'extended' ? 'New End Date' : 'End Date'} value={fmtDate(effectiveEndDate)} />
          <StatBox icon={<CalendarClock size={14} color={PC.green} />} accent={PC.green}  label="Status" value={STATUS_META[status].label} />
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: PC.label }}>Probation progress</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: PC.indigo }}>{pct}%</span>
        </div>
        <div style={{ height: 9, borderRadius: 999, background: PC.hover, overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #6366F1, #8B5CF6)', transition: 'width 0.4s' }} />
        </div>
        <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 11, color: PC.muted }}>{fmtDate(c.startDate)}</span>
          <span style={{ fontSize: 11, color: PC.muted }}>{fmtDate(effectiveEndDate)}</span>
        </div>
      </SectionCard>

      {/* ── Self-assessment — the piece that unlocks near the end ── */}
      {phase === 'ongoing' && (
        <SectionCard
          icon={<Lock size={16} color={PC.muted} />}
          title="Self-Assessment"
          subtitle="Opens automatically near the end of your probation"
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '20px 22px',
            background: PC.surface, border: `1px dashed ${PC.border}`, borderRadius: 12,
          }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: PC.hover, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Lock size={18} color={PC.muted} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: PC.navy }}>Locked for now</p>
              <p style={{ margin: '3px 0 0', fontSize: 12.5, color: PC.muted, lineHeight: 1.5 }}>
                Your self-assessment form will unlock <strong style={{ color: PC.label }}>{SELF_ASSESSMENT_WINDOW_DAYS} days before</strong> your
                end date ({fmtDate(c.endDate)}). You'll be notified when it opens.
              </p>
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: PC.amber, background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.22)', borderRadius: 999, padding: '6px 12px', whiteSpace: 'nowrap' }}>
              {daysLeft - SELF_ASSESSMENT_WINDOW_DAYS} days to unlock
            </span>
          </div>
        </SectionCard>
      )}

      {phase === 'unlocked' && (
        <>
          {/* Section heading */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `${PC.indigo}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ClipboardEdit size={16} color={PC.indigo} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: PC.navy }}>Self-Assessment</p>
              <p style={{ margin: 0, fontSize: 12, color: PC.muted }}>Answer each question, then submit for your manager's review</p>
            </div>
            <StatusPill status="Ongoing" size="sm" />
          </div>

          {/* Unlock banner */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 11, padding: '12px 16px',
            background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.20)', borderRadius: 11,
          }}>
            <Info size={16} color={PC.amber} style={{ flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: 12.5, color: '#8A6212', fontWeight: 500, lineHeight: 1.5 }}>
              Your probation ends in <strong>{daysLeft} days</strong>. Once submitted, this goes to your
              reporting manager (<strong>{c.reportingManager}</strong>) and can't be edited.
            </p>
          </div>

          {/* One card per question */}
          {QUESTIONS.map((q, i) => (
            <QuestionCard
              key={q.key} index={i + 1} label={q.label} placeholder={q.placeholder}
              value={form[q.key] as string} onChange={set(q.key)}
            />
          ))}

          {/* Submit footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
            background: '#fff', border: `1px solid ${PC.border}`, borderRadius: 14, padding: '16px 20px',
          }}>
            <span style={{ fontSize: 12.5, color: PC.muted, display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 500 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: formComplete ? PC.green : '#CDD0DC' }} />
              {formComplete ? 'All questions answered — ready to submit' : 'Answer all four questions to submit'}
            </span>
            <button
              onClick={handleSubmit} disabled={!formComplete || submitting}
              style={{
                height: 42, padding: '0 22px', borderRadius: 10, border: 'none',
                fontFamily: font, fontSize: 13.5, fontWeight: 700,
                display: 'inline-flex', alignItems: 'center', gap: 8,
                cursor: formComplete && !submitting ? 'pointer' : 'not-allowed',
                background: formComplete ? PC.indigo : '#CDD0DC', color: '#fff',
                boxShadow: formComplete ? '0 2px 8px rgba(99,102,241,0.30)' : 'none', transition: 'all 0.15s',
              }}
            >
              {submitting ? 'Submitting…' : <>Submit Self-Assessment <Send size={15} /></>}
            </button>
          </div>
        </>
      )}

      {phase === 'submitted' && (
        <>
          {/* Handoff banner — makes the transition to the manager obvious */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
            background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)', borderRadius: 14,
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(245,158,11,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CheckCircle2 size={20} color={PC.amber} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: PC.navy }}>Self-assessment submitted</p>
              <p style={{ margin: '3px 0 0', fontSize: 12.5, color: '#8A6212', fontWeight: 500 }}>
                Submitted on {fmtDate(submitted.submittedOn!)}. It's now with your reporting manager for review.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, fontSize: 12, fontWeight: 600, color: PC.muted }}>
              You <ArrowRight size={14} /> <span style={{ color: PC.amber, fontWeight: 700 }}>Manager</span> <ArrowRight size={14} /> Admin
            </div>
          </div>

          {/* Section heading (read-only) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `${PC.amber}16`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <FileText size={16} color={PC.amber} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: PC.navy }}>Your Submitted Self-Assessment</p>
              <p style={{ margin: 0, fontSize: 12, color: PC.muted }}>Read-only — locked while your manager reviews</p>
            </div>
            <StatusPill status="Pending Manager Review" size="sm" />
          </div>

          {/* Same one-card-per-question layout, filled and read-only */}
          {QUESTIONS.map((q, i) => (
            <QuestionCard
              key={q.key} index={i + 1} label={q.label} placeholder=""
              value={submitted[q.key] as string} readOnly
            />
          ))}
        </>
      )}

      {/* ═══ D · CONFIRMED — the happy outcome ═══ */}
      {phase === 'confirmed' && (
        <>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '20px 22px',
            background: 'linear-gradient(120deg, rgba(16,185,129,0.12), rgba(16,185,129,0.04))',
            border: '1px solid rgba(16,185,129,0.28)', borderRadius: 16,
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 13, background: 'rgba(16,185,129,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={24} color={PC.green} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: PC.navy }}>Congratulations — you're confirmed! 🎉</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#0A7B54', fontWeight: 500, lineHeight: 1.5 }}>
                You've successfully completed your probation and are now a <strong>permanent employee</strong>, effective {fmtDate(OUTCOME.confirmedOn)}.
              </p>
            </div>
            <StatusPill status="Confirmed" />
          </div>

          <SectionCard icon={<CheckCircle2 size={16} color={PC.green} />} title="Decision Summary" subtitle="Final decision recorded by HR" accent={PC.green}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px 28px' }}>
              <ReadField label="Final Decision" value="Confirmed — Permanent" accent={PC.green} />
              <ReadField label="Effective Date" value={fmtDate(OUTCOME.confirmedOn)} accent={PC.green} />
              <ReadField label="Decided By" value={OUTCOME.decidedBy} accent={PC.green} />
            </div>
            <div style={{ marginTop: 18, padding: '13px 16px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.18)', borderRadius: 11 }}>
              <p style={{ margin: 0, fontSize: 12.5, color: '#0A7B54', fontWeight: 500, lineHeight: 1.55 }}>
                Welcome aboard for the long run! No further action is needed from you — your employment status has been updated to permanent.
              </p>
            </div>
          </SectionCard>
        </>
      )}

      {/* ═══ E · EXTENDED — probation extended with a new end date ═══ */}
      {phase === 'extended' && (
        <>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '20px 22px',
            background: 'linear-gradient(120deg, rgba(124,58,237,0.12), rgba(124,58,237,0.04))',
            border: '1px solid rgba(124,58,237,0.28)', borderRadius: 16,
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 13, background: 'rgba(124,58,237,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <RefreshCw size={22} color="#7C3AED" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: PC.navy }}>Your probation has been extended</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6D28D9', fontWeight: 500, lineHeight: 1.5 }}>
                HR has extended your probation period. Your new end date is <strong>{fmtDate(OUTCOME.newEndDate)}</strong> — a fresh self-assessment will open again as it approaches.
              </p>
            </div>
            <StatusPill status="Ongoing (Extended)" />
          </div>

          <SectionCard icon={<CalendarPlus size={16} color="#7C3AED" />} title="Extension Details" subtitle="Recorded by HR's final decision" accent="#7C3AED">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px 28px', marginBottom: 20 }}>
              <ReadField label="Previous End Date" value={fmtDate(c.endDate)} accent="#7C3AED" />
              <ReadField label="New End Date" value={fmtDate(OUTCOME.newEndDate)} accent="#7C3AED" />
              <ReadField label="Extended On" value={fmtDate(OUTCOME.extendedOn)} accent="#7C3AED" />
            </div>
            <div>
              <p style={{ margin: '0 0 7px', fontSize: 11, fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reason from Admin</p>
              <div style={{ padding: '14px 16px', background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.18)', borderRadius: 11 }}>
                <p style={{ margin: 0, fontSize: 13.5, color: PC.navy, fontWeight: 500, lineHeight: 1.65 }}>{OUTCOME.extendReason}</p>
              </div>
            </div>
          </SectionCard>
        </>
      )}

      {/* ═══ F · TERMINATED — employment not confirmed ═══ */}
      {phase === 'terminated' && (
        <>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16, padding: '20px 22px',
            background: 'linear-gradient(120deg, rgba(232,72,85,0.10), rgba(232,72,85,0.03))',
            border: '1px solid rgba(232,72,85,0.26)', borderRadius: 16,
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 13, background: 'rgba(232,72,85,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <XCircle size={23} color={PC.red} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: PC.navy }}>Probation not confirmed</p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#B23140', fontWeight: 500, lineHeight: 1.5 }}>
                Following the probation review, your employment has been discontinued, effective {fmtDate(OUTCOME.terminatedOn)}.
              </p>
            </div>
            <StatusPill status="Terminated" />
          </div>

          <SectionCard icon={<FileText size={16} color={PC.red} />} title="Decision Details" subtitle="Recorded by HR's final decision" accent={PC.red}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px 28px', marginBottom: 20 }}>
              <ReadField label="Final Decision" value="Terminated" accent={PC.red} />
              <ReadField label="Effective Date" value={fmtDate(OUTCOME.terminatedOn)} accent={PC.red} />
              <ReadField label="Decided By" value={OUTCOME.decidedBy} accent={PC.red} />
            </div>
            <div>
              <p style={{ margin: '0 0 7px', fontSize: 11, fontWeight: 700, color: PC.red, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reason from Admin</p>
              <div style={{ padding: '14px 16px', background: 'rgba(232,72,85,0.05)', border: '1px solid rgba(232,72,85,0.18)', borderRadius: 11 }}>
                <p style={{ margin: 0, fontSize: 13.5, color: PC.navy, fontWeight: 500, lineHeight: 1.65 }}>{OUTCOME.terminateReason}</p>
              </div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10, padding: '13px 16px', background: PC.surface, border: `1px solid ${PC.border}`, borderRadius: 11 }}>
              <Mail size={15} color={PC.muted} style={{ flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 12.5, color: PC.label, fontWeight: 500, lineHeight: 1.5 }}>
                For any questions about this decision or your final formalities, please contact the HR team.
              </p>
            </div>
          </SectionCard>
        </>
      )}
    </div>
  )
}
