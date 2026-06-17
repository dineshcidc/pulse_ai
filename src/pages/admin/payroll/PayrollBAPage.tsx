import { useState } from 'react'
import {
  ChevronDown, ChevronUp, CheckCircle2, Circle,
  ChevronsDownUp, ChevronsUpDown, RotateCcw, IndianRupee,
  Pencil, X,
} from 'lucide-react'

/* ── section definitions ── */
interface BASection {
  id: string
  title: string
  color: string
  light: string
  border: string
  questions: string[]
}

const SECTIONS: BASection[] = [
  {
    id: 'A', title: 'Salary Structure',
    color: '#4F46E5', light: '#EEF2FF', border: 'rgba(79,70,229,0.18)',
    questions: [
      'What salary components are currently configured in EazeWork? (e.g. Basic, HRA, DA, Special Allowance, Conveyance, Medical, LTA — list all)',
      'Are components defined as fixed amounts or percentages of CTC / Basic? Which ones are percentage-based and what is the base they derive from?',
      'Is there more than one salary structure template? (e.g. different structures for different grades, departments, or employment types — full-time vs contract)',
      'Are there any employer-side contributions shown on the salary structure? (e.g. Employer PF, Employer ESI, Gratuity)',
      'What deductions appear in the salary structure? (e.g. Employee PF, Employee ESI, Professional Tax, Income Tax / TDS, Advance recovery)',
      'Who has permission to create or edit a salary structure — only Admin, or also HR Manager?',
      'When a new employee is added, is a salary structure assigned to them immediately during onboarding, or separately afterwards?',
      'Can an individual employee\'s salary be overridden from the standard structure, or does everyone follow the template?',
    ],
  },
  {
    id: 'B', title: 'Payroll Run',
    color: '#0F766E', light: '#F0FDFA', border: 'rgba(15,118,110,0.18)',
    questions: [
      'What is the payroll cycle? (Monthly? What is the pay period — e.g. 1st to last day of month, or 26th to 25th?)',
      'What is the payroll cutoff date — by what date must attendance, leave, and timesheet data be locked before payroll is processed?',
      'Who triggers the payroll run — only the Admin, or a Payroll Manager role?',
      'Does EazeWork show a pre-run checklist or summary before the admin finalises payroll? (e.g. "5 employees have pending leaves not approved — proceed?")',
      'Is there a draft / review step before payroll is finalised, where the admin can see computed payslips and make corrections?',
      'What happens to an employee who joined mid-month? Is pay prorated? How is it calculated — calendar days or working days?',
      'What happens when an employee resigns or is terminated mid-month? Full month pay, or prorated? Any final settlement shown separately?',
      'How is Loss of Pay (LOP) calculated — is it automatic from unapproved leave, or does the admin enter it manually?',
      'Can the admin add one-time payments in a payroll run? (e.g. bonus, incentive, arrears, reimbursements) If yes, are these taxable?',
      'Can the admin add one-time deductions in a payroll run? (e.g. salary advance recovery, loan EMI)',
      'Once payroll is finalised / locked, can it be revised or unlocked? If yes, who can do it and what is the process?',
      'Does the system support payroll for multiple pay groups in the same month? (e.g. running payroll for one department first, then another)',
    ],
  },
  {
    id: 'C', title: 'Attendance & Leave Integration',
    color: '#1D4ED8', light: '#EFF6FF', border: 'rgba(29,78,216,0.18)',
    questions: [
      'How does unapproved or absent attendance feed into payroll? Is it automatic or does the admin review it manually before the run?',
      'Does LOP from leave automatically reduce pay, or does the admin confirm each LOP entry before processing?',
      'Are timesheet hours used for payroll calculation (e.g. for hourly / contract employees), or is payroll only salary-based for all employees?',
      'Is there a lock date for leave and attendance — after which no further changes are allowed for that pay period?',
      'What happens if an employee\'s leave status changes after payroll is already run for that month — is there a reversal or adjustment in the next cycle?',
    ],
  },
  {
    id: 'D', title: 'Tax & Statutory Deductions',
    color: '#B45309', light: '#FFFBEB', border: 'rgba(180,83,9,0.18)',
    questions: [
      'Which statutory deductions are currently active? (PF, ESI, Professional Tax, Income Tax / TDS — confirm which apply)',
      'For PF: Is it calculated on Basic only, or on a different base? Is the 12% employee + 12% employer split standard, or customised?',
      'For ESI: What is the gross salary eligibility threshold? Is this calculated monthly?',
      'For Professional Tax: Is it configured slab-wise per state, or a fixed amount? Which state(s) apply?',
      'For TDS / Income Tax: Does EazeWork compute TDS automatically based on declared investments, or does the admin enter a monthly TDS amount manually per employee?',
      'Does the system support both Old Tax Regime and New Tax Regime for employees who have a choice?',
      'Are employees required to submit investment declarations (Form 12BB) via the system? If yes, does the admin review and approve them?',
      'Are there any perquisites or reimbursements that are partially taxable? (e.g. company car, rent reimbursement) If yes, how are these handled?',
    ],
  },
  {
    id: 'E', title: 'Payslip',
    color: '#6D28D9', light: '#F5F3FF', border: 'rgba(109,40,217,0.18)',
    questions: [
      'What information appears on a payslip? (Please share a sample or screenshot from EazeWork — most important reference for design)',
      'Does the payslip show employer contributions (PF, ESI) separately, or only employee-side deductions?',
      'Is the payslip password-protected when downloaded as PDF? If yes, what is the password format?',
      'How are payslips distributed — emailed automatically, or employees download from the portal, or both?',
      'Are payslips generated in any language other than English?',
      'Can an admin re-generate or re-send a payslip after it has been issued? (e.g. if an error was found)',
      'How many months of payslip history should be accessible — last 12 months, or all-time?',
    ],
  },
  {
    id: 'F', title: 'Approvals & Roles',
    color: '#BE185D', light: '#FDF2F8', border: 'rgba(190,24,93,0.18)',
    questions: [
      'Is there a payroll approval workflow in EazeWork — e.g. Admin prepares, Finance Head approves, then it is released?',
      'Who can view payroll data — only Admin, or can a Finance role or HR Manager also access it?',
      'Can a Manager see salary details of their team members, or is pay data restricted to Admin only?',
    ],
  },
  {
    id: 'G', title: 'Payroll Reports',
    color: '#047857', light: '#ECFDF5', border: 'rgba(4,120,87,0.18)',
    questions: [
      'What payroll reports does the admin currently use in EazeWork? (e.g. monthly payroll summary, department-wise cost, deduction summary, PF/ESI challan report, TDS report — list all)',
      'Are any reports submitted to government portals? (e.g. EPF ECR, ESIC, TDS return) If yes, should the system generate the file in the required format?',
      'Does the admin need a bank transfer / disbursement file exported from the system to upload to the bank for salary credit?',
      'What file formats are needed for exports — Excel, CSV, PDF, or a specific bank format?',
    ],
  },
  {
    id: 'H', title: 'Edge Cases & Settings',
    color: '#C2410C', light: '#FFF7ED', border: 'rgba(194,65,12,0.18)',
    questions: [
      'How are salary revisions handled mid-year — is there an arrears calculation, and how is it shown on the payslip?',
      'Are there loans or salary advances tracked in the system? If yes, how is the recovery EMI configured and deducted?',
      'Does the system need to handle multiple pay frequencies? (monthly only, or also weekly / fortnightly for certain employee types)',
      'Is full and final settlement (F&F) processed inside the payroll module, or is it a separate flow?',
      'Are contractor / freelancer payments handled through the same payroll module, or separately?',
    ],
  },
  {
    id: 'I', title: 'Migration & Go-Live',
    color: '#0369A1', light: '#F0F9FF', border: 'rgba(3,105,161,0.18)',
    questions: [
      'How many months of historical payroll data from EazeWork need to be imported or visible in Concert IDC?',
      'Will EazeWork and Concert IDC run in parallel for a period, or is it a hard cutover on a specific date?',
      'Are there any EazeWork-specific features the admin or HR team relies on heavily that must not be missing at go-live?',
    ],
  },
]

/* precompute global question start index per section */
const SECTION_START: Record<string, number> = {}
let _n = 1
for (const s of SECTIONS) { SECTION_START[s.id] = _n; _n += s.questions.length }
const TOTAL = _n - 1  // 55

const C = {
  navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7',
  surface: '#F7F8FC', hover: '#F0F2F8',
}

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
export default function PayrollBAPage() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['A']))
  const [answered,     setAnswered]     = useState<Set<number>>(new Set())
  const [notes,        setNotes]        = useState<Record<number, string>>({})
  const [noteOpen,     setNoteOpen]     = useState<Set<number>>(new Set())

  const pct = Math.round((answered.size / TOTAL) * 100)

  function toggleSection(id: string) {
    setOpenSections(prev => {
      const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n
    })
  }
  function toggleAnswered(gn: number) {
    setAnswered(prev => {
      const n = new Set(prev); n.has(gn) ? n.delete(gn) : n.add(gn); return n
    })
  }
  function toggleNote(gn: number) {
    setNoteOpen(prev => {
      const n = new Set(prev); n.has(gn) ? n.delete(gn) : n.add(gn); return n
    })
  }
  function expandAll()  { setOpenSections(new Set(SECTIONS.map(s => s.id))) }
  function collapseAll(){ setOpenSections(new Set()) }
  function resetAll()   { setAnswered(new Set()); setNotes({}); setNoteOpen(new Set()) }

  const allOpen = openSections.size === SECTIONS.length

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif" }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FEF9C3', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <IndianRupee size={18} color="#B45309" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.navy }}>Payroll — BA Requirements</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#787878', fontWeight: 500 }}>Discovery checklist based on EazeWork platform · {TOTAL} questions across {SECTIONS.length} areas</p>
          </div>
        </div>
      </div>

      {/* ── Progress card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 800, color: C.navy }}>{answered.size}</span>
            <span style={{ fontSize: 13, color: C.muted }}>of {TOTAL} questions answered</span>
            {pct === 100 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: '#059669', background: '#ECFDF5', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 6, padding: '1px 8px' }}>
                Complete ✓
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {answered.size > 0 && (
              <button onClick={resetAll} style={{ height: 32, padding: '0 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${C.border}`, background: C.hover, color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <RotateCcw size={11} /> Reset
              </button>
            )}
            <button onClick={allOpen ? collapseAll : expandAll} style={{ height: 32, padding: '0 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${C.border}`, background: C.hover, color: C.navy, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              {allOpen ? <><ChevronsDownUp size={12} /> Collapse All</> : <><ChevronsUpDown size={12} /> Expand All</>}
            </button>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 7, borderRadius: 4, background: C.border, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 4, background: pct === 100 ? '#059669' : '#6366F1', width: `${pct}%`, transition: 'width 0.4s ease' }} />
        </div>
        {/* Section dots */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
          {SECTIONS.map(s => {
            const start  = SECTION_START[s.id]
            const done   = s.questions.filter((_, i) => answered.has(start + i)).length
            const allDone = done === s.questions.length
            return (
              <button key={s.id} onClick={() => { toggleSection(s.id); if (!openSections.has(s.id)) {} }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, cursor: 'pointer', fontSize: 11.5, fontWeight: 600, border: `1px solid ${allDone ? 'rgba(5,150,105,0.25)' : s.border}`, background: allDone ? '#ECFDF5' : s.light, color: allDone ? '#047857' : s.color }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: allDone ? '#059669' : s.color, flexShrink: 0 }} />
                {s.id}. {s.title} <span style={{ opacity: 0.65 }}>({done}/{s.questions.length})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Accordion sections ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SECTIONS.map(s => {
          const isOpen  = openSections.has(s.id)
          const start   = SECTION_START[s.id]
          const done    = s.questions.filter((_, i) => answered.has(start + i)).length
          const allDone = done === s.questions.length

          return (
            <div key={s.id} style={{ borderRadius: 14, border: `1.5px solid ${isOpen ? s.border : C.border}`, overflow: 'hidden', transition: 'border-color 0.15s' }}>

              {/* Section header */}
              <button
                onClick={() => toggleSection(s.id)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: isOpen ? s.light : '#fff', cursor: 'pointer', border: 'none', textAlign: 'left', transition: 'background 0.15s' }}
              >
                {/* Letter badge */}
                <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: C.muted }}>{s.id}</span>
                </div>

                {/* Title */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: allDone ? '#047857' : C.navy }}>{s.title}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11.5, color: C.muted }}>{s.questions.length} questions</p>
                </div>

                {/* Progress mini */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{ width: 56, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.08)' }}>
                    <div style={{ height: '100%', borderRadius: 2, background: allDone ? '#059669' : s.color, width: `${(done / s.questions.length) * 100}%`, transition: 'width 0.3s' }} />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: allDone ? '#047857' : s.color, minWidth: 32, textAlign: 'right' }}>{done}/{s.questions.length}</span>
                </div>

                {/* Chevron */}
                {isOpen
                  ? <ChevronUp   size={15} color={C.muted} style={{ flexShrink: 0 }} />
                  : <ChevronDown size={15} color={C.muted} style={{ flexShrink: 0 }} />
                }
              </button>

              {/* Questions list */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${C.border}` }}>
                  {s.questions.map((q, qi) => {
                    const gn      = start + qi
                    const isDone  = answered.has(gn)
                    const hasNote = !!notes[gn]
                    const noteExp = noteOpen.has(gn)

                    return (
                      <div key={gn} style={{ borderBottom: qi < s.questions.length - 1 ? `1px solid ${C.border}` : 'none', background: isDone ? 'rgba(5,150,105,0.03)' : '#fff', transition: 'background 0.12s' }}>

                        {/* Question row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 18px' }}>
                          {/* Checkbox */}
                          <button onClick={() => toggleAnswered(gn)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: 2, display: 'flex' }}>
                            {isDone
                              ? <CheckCircle2 size={18} color="#059669" />
                              : <Circle       size={18} color={C.muted} />
                            }
                          </button>

                          {/* Q badge */}
                          <span style={{ flexShrink: 0, fontSize: 10.5, fontWeight: 700, color: isDone ? '#059669' : s.color, background: isDone ? 'rgba(5,150,105,0.1)' : s.light, border: `1px solid ${isDone ? 'rgba(5,150,105,0.2)' : s.border}`, borderRadius: 5, padding: '1px 6px', marginTop: 2 }}>
                            Q{gn}
                          </span>

                          {/* Text */}
                          <p style={{ flex: 1, margin: 0, fontSize: 13.5, lineHeight: 1.6, color: isDone ? C.muted : C.navy, textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.65 : 1 }}>
                            {q}
                          </p>

                          {/* Note toggle */}
                          <button onClick={() => toggleNote(gn)} title={noteExp ? 'Close note' : 'Add note'} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', borderRadius: 5, flexShrink: 0, color: hasNote ? s.color : C.muted, opacity: hasNote ? 1 : 0.4, transition: 'opacity 0.12s' }}>
                            {noteExp ? <X size={13} /> : <Pencil size={13} />}
                          </button>
                        </div>

                        {/* Note area */}
                        {noteExp && (
                          <div style={{ padding: '0 18px 12px 52px' }}>
                            <textarea
                              autoFocus
                              value={notes[gn] ?? ''}
                              onChange={e => setNotes(prev => ({ ...prev, [gn]: e.target.value }))}
                              placeholder="Type BA answer or note here…"
                              rows={2}
                              style={{ width: '100%', resize: 'vertical', border: `1.5px solid ${s.border}`, borderRadius: 8, padding: '8px 10px', fontSize: 12.5, color: C.navy, background: s.light, outline: 'none', fontFamily: "'DM Sans',system-ui,sans-serif", lineHeight: 1.5, boxSizing: 'border-box' }}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Footer note ── */}
      <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 10, background: C.surface, border: `1px solid ${C.border}` }}>
        <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.6 }}>
          <strong style={{ color: C.navy }}>Tip:</strong> Question E1 (Payslip sample from EazeWork) is the single most critical reference — it will drive the entire payslip layout design. Collect a screenshot or PDF before starting the Payslip module.
        </p>
      </div>
    </div>
  )
}
