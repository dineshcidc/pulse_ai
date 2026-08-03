/* ─────────────────────────────────────────────────────────────────────────────
 * Admin: Probation Case (detail) — VIEW ONLY
 *
 * Opened from the Probation Cases list. The Admin reviews BOTH feedbacks —
 * the employee's self-assessment and the manager's assessment + final decision —
 * entirely read-only. The reporting MANAGER makes the decision; the Admin only
 * monitors, so there are no Confirm / Extend / Terminate actions here.
 * ──────────────────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import { ArrowLeft, FileText, ClipboardCheck, Info } from 'lucide-react'
import {
  PC, StatusPill, DaysRemainingChip, EmployeeDetailHeader,
  QuestionCard, SELF_ASSESSMENT_QUESTIONS, fmtDate, ManagerAssessmentForm,
  type ProbationCase,
} from '../../employee/probation/probationShared'

const font = "'DM Sans', system-ui, sans-serif"

// ─── Main ────────────────────────────────────────────────────────────────────────

export default function AdminDecisionPage({ c, onBack }: { c: ProbationCase; onBack: () => void }) {
  const hasSelf = !!c.self
  const hasManager = !!c.managerAssessment

  const [tab, setTab] = useState<'self' | 'manager'>('self')

  const TABS = [
    { id: 'self' as const,    label: "Employee's Self-Assessment", Icon: FileText },
    { id: 'manager' as const, label: "Manager's Assessment",       Icon: ClipboardCheck },
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

      {/* Monitor-only note */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', background: PC.surface, border: `1px solid ${PC.border}`, borderRadius: 10 }}>
        <Info size={15} color={PC.muted} />
        <p style={{ margin: 0, fontSize: 12.5, color: PC.muted, fontWeight: 500 }}>
          View only — the reporting manager owns the final decision for probation cases.
        </p>
      </div>

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

      {/* ── Tab 2: Manager's assessment + final decision — the same form, shown filled & read-only ── */}
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
                    feedback: c.managerAssessment!.feedback,
                    decision: c.managerAssessment!.decision,
                    reason: c.managerAssessment!.reason ?? '',
                    newEndDate: c.managerAssessment!.newEndDate ?? '',
                  }}
                  readOnly
                  endDate={c.endDate}
                />
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', background: PC.surface, border: `1px dashed ${PC.border}`, borderRadius: 14 }}>
              <Info size={17} color={PC.muted} />
              <p style={{ margin: 0, fontSize: 13, color: PC.muted, fontWeight: 500 }}>
                The reporting manager hasn't submitted their assessment and decision yet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
