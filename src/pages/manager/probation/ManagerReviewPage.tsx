/* ─────────────────────────────────────────────────────────────────────────────
 * Stage 3 — Manager: Probation Review (detail)
 *
 * Opened from the Team Probation list. The manager reads the employee's submitted
 * self-assessment (same read-only cards as the employee screen), fills their own
 * assessment, and makes the FINAL, binding decision:
 *
 *   Confirm   → status "Confirmed"
 *   Extend    → needs reason + new end date → status "Ongoing (Extended)"
 *   Terminate → needs reason → status "Terminated"
 *
 * Admin no longer decides — it only monitors.
 * ──────────────────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import {
  ArrowLeft, FileText, ClipboardCheck, Send, ArrowRight, Info,
} from 'lucide-react'
import {
  PC, StatusPill, DaysRemainingChip, EmployeeDetailHeader,
  QuestionCard, SELF_ASSESSMENT_QUESTIONS, fmtDate,
  ManagerAssessmentForm, DECISIONS, STATUS_META,
  type ManagerAssessmentFormValue, type ProbationCase,
} from '../../employee/probation/probationShared'

const font = "'DM Sans', system-ui, sans-serif"

// ─── Main ────────────────────────────────────────────────────────────────────────

export default function ManagerReviewPage({ c, onBack }: { c: ProbationCase; onBack: () => void }) {
  const editable = c.status === 'Pending Manager Review'
  const hasSelf = !!c.self

  // Manager assessment form state
  const [form, setForm] = useState<ManagerAssessmentFormValue>({
    rating: 0, competencies: {}, feedback: '', decision: null, reason: '', newEndDate: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [tab, setTab] = useState<'self' | 'manager'>('self')

  const patch = (p: Partial<ManagerAssessmentFormValue>) => setForm(f => ({ ...f, ...p }))
  const needsReason = form.decision === 'Extend' || form.decision === 'Terminate'
  const needsDate = form.decision === 'Extend'
  const complete = form.rating > 0 && !!form.feedback && !!form.decision
    && (!needsReason || form.reason.trim().length > 0)
    && (!needsDate || !!form.newEndDate)

  const chosen = form.decision ? DECISIONS.find(d => d.id === form.decision)! : null

  // Editable → the manager's live input; read-only → the already-submitted assessment.
  const formValue: ManagerAssessmentFormValue = editable ? form : {
    rating: c.managerAssessment?.rating ?? 0,
    competencies: c.managerAssessment?.competencies ?? {},
    feedback: c.managerAssessment?.feedback ?? '',
    decision: c.managerAssessment?.decision ?? null,
    reason: c.managerAssessment?.reason ?? '',
    newEndDate: c.managerAssessment?.newEndDate ?? '',
  }

  const TABS = [
    { id: 'self' as const,    label: "Employee's Self-Assessment", Icon: FileText },
    { id: 'manager' as const, label: "Manager's Assessment",       Icon: ClipboardCheck },
  ]

  async function handleSubmit() {
    if (!complete) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div style={{ fontFamily: font, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9, border: `1px solid ${PC.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0 }}
          onMouseEnter={e => { e.currentTarget.style.background = PC.surface }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
          <ArrowLeft size={15} color={PC.muted} />
        </button>
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: font, fontSize: 13, fontWeight: 500, color: PC.muted }}>Team Probation</button>
        <span style={{ color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: PC.navy }}>{c.name}</span>
      </div>

      {/* Employee header */}
      <EmployeeDetailHeader
        c={c}
        right={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <StatusPill status={c.status} />
            {(c.status !== 'Confirmed' && c.status !== 'Terminated') && <DaysRemainingChip endDate={c.endDate} />}
          </div>
        }
      />

      {/* Tabs — fit-width white card, active tab = light-blue badge with dark-blue text */}
      <div style={{ alignSelf: 'flex-start', background: '#fff', border: `1px solid ${PC.border}`, borderRadius: 12, padding: 6 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TABS.map(t => {
            const on = tab === t.id
            const Icon = t.Icon
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 9,
                  border: 'none', cursor: 'pointer', fontFamily: font, fontSize: 13, whiteSpace: 'nowrap',
                  fontWeight: on ? 700 : 600, color: on ? '#4F46E5' : PC.muted,
                  background: on ? '#EEF2FF' : 'transparent', transition: 'all 0.12s',
                }}
                onMouseEnter={e => { if (!on) e.currentTarget.style.background = PC.surface }}
                onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent' }}>
                <Icon size={15} /> {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab 1: Employee's self-assessment (read-only, same cards as employee screen) ── */}
      {tab === 'self' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ margin: 0, fontSize: 12, color: PC.muted, fontWeight: 500 }}>
            {hasSelf ? `Submitted on ${fmtDate(c.self!.submittedOn!)} · read-only` : 'Not yet submitted by the employee'}
          </p>
          {hasSelf ? (
            SELF_ASSESSMENT_QUESTIONS.map((q, i) => (
              <QuestionCard key={q.key} index={i + 1} label={q.label} placeholder="" value={(c.self as any)[q.key]} readOnly />
            ))
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', background: PC.surface, border: `1px dashed ${PC.border}`, borderRadius: 14 }}>
              <Info size={17} color={PC.muted} />
              <p style={{ margin: 0, fontSize: 13, color: PC.muted, fontWeight: 500 }}>
                This employee hasn't submitted their self-assessment yet. You'll be able to add your assessment once they do.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 2: Manager's assessment ── */}
      {tab === 'manager' && (submitted && chosen ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: `${chosen.color}0F`, border: `1px solid ${chosen.color}33`, borderRadius: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: `${chosen.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <chosen.Icon size={20} color={chosen.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: PC.navy }}>Decision recorded — {chosen.label}</p>
              <p style={{ margin: '3px 0 0', fontSize: 12.5, color: PC.label, fontWeight: 500 }}>
                {c.name}'s probation is now <strong style={{ color: chosen.color }}>{STATUS_META[chosen.result].label}</strong>. The employee and Admin have been notified.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, fontSize: 12, fontWeight: 600, color: PC.muted }}>
              Employee <ArrowRight size={14} /> <span style={{ color: PC.green, fontWeight: 700 }}>You ✓</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: '#fff', border: `1px solid ${PC.border}`, borderRadius: 16, padding: 22 }}>
          {!editable && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', marginBottom: 18, background: PC.surface, border: `1px solid ${PC.border}`, borderRadius: 10 }}>
              <Info size={15} color={PC.muted} />
              <p style={{ margin: 0, fontSize: 12.5, color: PC.muted, fontWeight: 500 }}>
                {hasSelf ? 'You have already submitted your assessment for this employee.' : 'Waiting on the employee\'s self-assessment before you can assess.'}
              </p>
            </div>
          )}

          <ManagerAssessmentForm value={formValue} onChange={patch} readOnly={!editable} endDate={c.endDate} />

          {/* Submit footer */}
          {editable && (
            <div style={{ marginTop: 22, paddingTop: 18, borderTop: `1px solid ${PC.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12.5, color: PC.muted, display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 500 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: complete ? PC.green : '#CDD0DC' }} />
                {complete
                  ? `Ready — this marks the probation as ${chosen ? STATUS_META[chosen.result].label : ''}`
                  : form.decision
                    ? (needsDate && !form.newEndDate ? 'A new end date is required' : needsReason && !form.reason.trim() ? 'A reason is required' : 'A rating and feedback are required')
                    : 'Rating, feedback & a final decision are required'}
              </span>
              <button
                onClick={handleSubmit} disabled={!complete || submitting}
                style={{
                  height: 42, padding: '0 22px', borderRadius: 10, border: 'none',
                  fontFamily: font, fontSize: 13.5, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
                  cursor: complete && !submitting ? 'pointer' : 'not-allowed',
                  background: complete && chosen ? chosen.color : '#CDD0DC', color: '#fff',
                  boxShadow: complete && chosen ? `0 2px 8px ${chosen.color}55` : 'none', transition: 'all 0.15s',
                }}
              >
                {submitting ? 'Submitting…' : <>Submit Decision <Send size={15} /></>}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
