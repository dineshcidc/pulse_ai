/* ─────────────────────────────────────────────────────────────────────────────
 * Stage 4 — Admin: Probation Decision (detail)
 *
 * Opened from the Probation Cases list. The Admin reviews BOTH feedbacks — the
 * employee's self-assessment and the manager's assessment + recommendation (both
 * read-only) — then makes the FINAL decision on the third tab:
 *
 *   Confirm   → status "Confirmed"
 *   Extend    → needs reason + new end date → status "Ongoing (Extended)"
 *   Terminate → needs reason → status "Terminated"
 *
 * Same tabbed white-card design as the Manager review page, with a third
 * "Final Decision" tab that only the Admin owns.
 * ──────────────────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import {
  ArrowLeft, FileText, ClipboardCheck, Gavel, Send, CheckCircle2,
  RefreshCw, XCircle, ArrowRight, Info, CalendarClock,
} from 'lucide-react'
import {
  PC, StatusPill, DaysRemainingChip, EmployeeDetailHeader, ReadField,
  QuestionCard, SELF_ASSESSMENT_QUESTIONS, fmtDate,
  STATUS_META, ManagerAssessmentForm,
  type ProbationCase, type Decision, type ProbationStatus,
} from '../../employee/probation/probationShared'

const font = "'DM Sans', system-ui, sans-serif"

const DECISIONS: { id: Decision; label: string; hint: string; color: string; Icon: React.ElementType; result: ProbationStatus }[] = [
  { id: 'Confirm',   label: 'Confirm',   hint: 'Make permanent',   color: PC.green,  Icon: CheckCircle2, result: 'Confirmed' },
  { id: 'Extend',    label: 'Extend',    hint: 'Give more time',    color: '#7C3AED', Icon: RefreshCw,    result: 'Ongoing (Extended)' },
  { id: 'Terminate', label: 'Terminate', hint: 'End employment',    color: PC.red,    Icon: XCircle,      result: 'Terminated' },
]

// ─── A recommendation / decision chip ───────────────────────────────────────────

function OutcomeChip({ id }: { id: Decision }) {
  const d = DECISIONS.find(x => x.id === id)!
  const Icon = d.Icon
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 13px', borderRadius: 999,
      fontSize: 12.5, fontWeight: 700, color: d.color, background: `${d.color}12`, border: `1px solid ${d.color}33`,
    }}>
      <Icon size={14} strokeWidth={2.2} /> {d.label}
    </span>
  )
}

// ─── Text area ──────────────────────────────────────────────────────────────────

function FormArea({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  const [focus, setFocus] = useState(false)
  return (
    <div>
      <p style={{ margin: '0 0 7px', fontSize: 12.5, fontWeight: 600, color: PC.label }}>{label}<span style={{ color: PC.red, marginLeft: 3 }}>*</span></p>
      <textarea
        value={value} rows={3} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10,
          fontFamily: font, fontSize: 13.5, fontWeight: 500, color: PC.navy, lineHeight: 1.6,
          border: `1px solid ${focus ? PC.indigo : PC.border}`, background: value ? PC.surface : '#fff',
          resize: 'vertical', outline: 'none',
          boxShadow: focus ? '0 0 0 3px rgba(99,102,241,0.10)' : 'none', transition: 'all 0.15s',
        }}
      />
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────────

export default function AdminDecisionPage({ c, onBack }: { c: ProbationCase; onBack: () => void }) {
  const decidable = c.status === 'Pending Admin Decision'
  const hasSelf = !!c.self
  const hasManager = !!c.managerAssessment

  const [tab, setTab] = useState<'self' | 'manager' | 'decision'>('self')

  // Decision form state
  const [decision, setDecision] = useState<Decision | null>(null)
  const [reason, setReason] = useState('')
  const [newEndDate, setNewEndDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const needsReason = decision === 'Extend' || decision === 'Terminate'
  const needsDate = decision === 'Extend'
  const complete = !!decision
    && (!needsReason || reason.trim().length > 0)
    && (!needsDate || !!newEndDate)

  const chosen = decision ? DECISIONS.find(d => d.id === decision)! : null

  async function handleSubmit() {
    if (!complete) return
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitting(false)
    setSubmitted(true)
  }

  const TABS = [
    { id: 'self' as const,     label: "Employee's Self-Assessment", Icon: FileText },
    { id: 'manager' as const,  label: "Manager's Assessment",       Icon: ClipboardCheck },
    { id: 'decision' as const, label: 'Final Decision',             Icon: Gavel },
  ]

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
        <button onClick={onBack} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: font, fontSize: 13, fontWeight: 500, color: PC.muted }}>Probation Cases</button>
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
            // Highlight the Final Decision tab when it's actionable.
            const flag = t.id === 'decision' && decidable && !submitted
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
                {flag && <span style={{ width: 7, height: 7, borderRadius: '50%', background: PC.indigo, marginLeft: 2 }} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tab 1: Employee's self-assessment (read-only) ── */}
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
                The employee hasn't submitted their self-assessment yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 2: Manager's assessment — same form the manager fills, shown filled & read-only ── */}
      {tab === 'manager' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {hasManager ? (
            <>
              <p style={{ margin: 0, fontSize: 12, color: PC.muted, fontWeight: 500 }}>
                Submitted by {c.reportingManager} on {fmtDate(c.managerAssessment!.submittedOn!)} · read-only
              </p>
              <div style={{ background: '#fff', border: `1px solid ${PC.border}`, borderRadius: 16, padding: 22 }}>
                <ManagerAssessmentForm
                  value={{
                    rating: c.managerAssessment!.rating,
                    competencies: c.managerAssessment!.competencies ?? {},
                    strengths: c.managerAssessment!.strengths,
                    areasToImprove: c.managerAssessment!.areasToImprove,
                    feedback: c.managerAssessment!.feedback,
                    recommendation: c.managerAssessment!.recommendation,
                  }}
                  readOnly
                />
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', background: PC.surface, border: `1px dashed ${PC.border}`, borderRadius: 14 }}>
              <Info size={17} color={PC.muted} />
              <p style={{ margin: 0, fontSize: 13, color: PC.muted, fontWeight: 500 }}>
                The reporting manager hasn't submitted their assessment yet.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Tab 3: Final decision ── */}
      {tab === 'decision' && (submitted && chosen ? (
        /* Success banner after the Admin submits */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: `${chosen.color}0F`, border: `1px solid ${chosen.color}33`, borderRadius: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: `${chosen.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <chosen.Icon size={20} color={chosen.color} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: PC.navy }}>Decision recorded — {chosen.label}</p>
              <p style={{ margin: '3px 0 0', fontSize: 12.5, color: PC.label, fontWeight: 500 }}>
                {c.name}'s probation is now <strong style={{ color: chosen.color }}>{STATUS_META[chosen.result].label}</strong>. The employee and manager have been notified.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, fontSize: 12, fontWeight: 600, color: PC.muted }}>
              Employee <ArrowRight size={14} /> Manager <ArrowRight size={14} /> <span style={{ color: PC.green, fontWeight: 700 }}>You ✓</span>
            </div>
          </div>
          {(decision === 'Extend' || decision === 'Terminate') && (
            <div style={{ background: '#fff', border: `1px solid ${PC.border}`, borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {decision === 'Extend' && <ReadField label="New End Date" value={fmtDate(newEndDate)} accent={chosen.color} />}
              <ReadField label="Reason" value={reason} accent={chosen.color} />
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: '#fff', border: `1px solid ${PC.border}`, borderRadius: 16, padding: 22 }}>

          {/* Already-decided (read-only) ­— show the recorded decision */}
          {!decidable && c.adminDecision ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: PC.navy }}>Final decision recorded</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: PC.muted }}>Decided on {fmtDate(c.adminDecision.decidedOn!)}</p>
                </div>
                <OutcomeChip id={c.adminDecision.decision} />
              </div>
              {(c.adminDecision.newEndDate || c.adminDecision.reason) && (
                <div style={{ borderTop: `1px solid ${PC.border}`, paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {c.adminDecision.newEndDate && <ReadField label="New End Date" value={fmtDate(c.adminDecision.newEndDate)} />}
                  {c.adminDecision.reason && <ReadField label="Reason" value={c.adminDecision.reason} />}
                </div>
              )}
            </div>

          /* Not yet the Admin's turn */
          ) : !decidable ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 2px' }}>
              <Info size={17} color={PC.muted} />
              <p style={{ margin: 0, fontSize: 13, color: PC.muted, fontWeight: 500 }}>
                This case isn't ready for a decision yet — it's still with the {c.status === 'Pending Manager Review' ? 'reporting manager' : 'employee/manager'}. You can review it once the manager submits their assessment.
              </p>
            </div>

          /* Actionable — the decision form */
          ) : (
            <>
              {/* Manager's recommendation reminder */}
              {hasManager && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', marginBottom: 20, background: PC.surface, border: `1px solid ${PC.border}`, borderRadius: 10 }}>
                  <ClipboardCheck size={15} color={PC.muted} />
                  <span style={{ fontSize: 12.5, color: PC.label, fontWeight: 500 }}>The reporting manager recommended</span>
                  <OutcomeChip id={c.managerAssessment!.recommendation} />
                </div>
              )}

              <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 700, color: PC.navy }}>
                Your Decision <span style={{ color: PC.red }}>*</span>
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
                {DECISIONS.map(d => {
                  const active = decision === d.id
                  const Icon = d.Icon
                  return (
                    <button
                      key={d.id} type="button"
                      onClick={() => { setDecision(d.id); if (d.id === 'Confirm') { setReason(''); setNewEndDate('') } }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                        background: active ? `${d.color}12` : '#fff', border: `1.5px solid ${active ? d.color : PC.border}`,
                        textAlign: 'left', fontFamily: font, transition: 'all 0.14s',
                      }}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: active ? d.color : `${d.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={17} color={active ? '#fff' : d.color} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: active ? d.color : PC.navy }}>{d.label}</p>
                        <p style={{ margin: '1px 0 0', fontSize: 11.5, color: PC.muted }}>{d.hint}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Conditional fields, framed in the decision's colour */}
              {chosen && decision !== 'Confirm' && (
                <div style={{ background: `${chosen.color}08`, border: `1px solid ${chosen.color}2E`, borderRadius: 12, padding: '18px 20px', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {decision === 'Extend' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                      <div style={{ fontSize: 12.5, color: PC.muted, fontWeight: 500 }}>
                        Current end date: <span style={{ color: PC.label, fontWeight: 700 }}>{fmtDate(c.endDate)}</span>
                      </div>
                      <ArrowRight size={15} color={PC.muted} />
                      <div>
                        <p style={{ margin: '0 0 6px', fontSize: 12.5, fontWeight: 600, color: PC.label }}>New End Date <span style={{ color: PC.red }}>*</span></p>
                        <div style={{ position: 'relative' }}>
                          <CalendarClock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: PC.muted, pointerEvents: 'none' }} />
                          <input
                            type="date" value={newEndDate} min={c.endDate}
                            onChange={e => setNewEndDate(e.target.value)}
                            style={{
                              height: 40, padding: '0 14px 0 36px', borderRadius: 10, minWidth: 190,
                              fontFamily: font, fontSize: 13.5, fontWeight: 600, color: PC.navy,
                              border: `1px solid ${PC.border}`, background: '#fff', outline: 'none',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <FormArea
                    label={decision === 'Extend' ? 'Reason for extension' : 'Reason for termination'}
                    placeholder={decision === 'Extend'
                      ? 'Explain why more time is needed and what the employee must demonstrate…'
                      : 'Explain the basis for ending employment at the close of probation…'}
                    value={reason} onChange={setReason}
                  />
                </div>
              )}

              {chosen && decision === 'Confirm' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', marginBottom: 20, background: `${PC.green}0D`, border: `1px solid ${PC.green}2E`, borderRadius: 12 }}>
                  <CheckCircle2 size={18} color={PC.green} />
                  <p style={{ margin: 0, fontSize: 12.5, color: PC.label, fontWeight: 500 }}>
                    <strong style={{ color: PC.navy }}>{c.name}</strong> will be confirmed as a permanent employee, effective today.
                  </p>
                </div>
              )}

              {/* Submit footer */}
              <div style={{ paddingTop: 18, borderTop: `1px solid ${PC.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12.5, color: PC.muted, display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 500 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: complete ? PC.green : '#CDD0DC' }} />
                  {complete
                    ? `Ready — this marks the probation as ${chosen ? STATUS_META[chosen.result].label : ''}`
                    : decision
                      ? (needsDate && !newEndDate ? 'A new end date is required' : 'A reason is required')
                      : 'Select a decision to continue'}
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
                  {submitting ? 'Recording…' : <>Submit Decision <Send size={15} /></>}
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
