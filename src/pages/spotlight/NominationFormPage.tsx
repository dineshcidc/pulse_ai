import { useMemo, useState } from 'react'
import { UserSearch, ChevronDown, Star, Check, X, CircleAlert, Search } from 'lucide-react'
import { C, AWARD_THEME } from '../admin/spotlight/nominationTemplatesData'
import type { TemplateField } from '../admin/spotlight/nominationTemplatesData'
import { MONTHS, formatDate } from '../admin/spotlight/responseFormsData'
import type { Person } from '../admin/spotlight/responseFormsData'
import {
  nomineeCandidatesFor, saveSubmission,
  type NominationInbox, type NominationTask, type NominatorRole, type SubmissionAnswer,
} from './nominationInboxData'
import SpotlightBreadcrumb from './SpotlightBreadcrumb'

/* ══════════════════════════════════════════
   Spotlight — Nomination Form (Step 10)
   Rendered straight off each award's template
   `fields`, so whatever the Admin builder
   produced is what the nominator fills in.
   One submission per award; submitting is
   one-way, so each award has its own Submit.
══════════════════════════════════════════ */

const INDIGO = '#6366F1'
const INDIGO_HOVER = '#5B5FDE'

/** What the user has typed for one award, before it is submitted. */
interface Draft {
  nominee: Person | null
  values: Record<string, string>
}

const emptyDraft = (): Draft => ({ nominee: null, values: {} })

interface Props {
  inbox: NominationInbox
  role: NominatorRole
  onBack: () => void
  onSubmitted: (awardLabel: string) => void
}

export default function NominationFormPage({ inbox, role, onBack, onSubmitted }: Props) {
  const { campaign, tasks } = inbox

  /* Awards submitted during this visit. `inbox` is derived once by the module, so it
     will not reflect a submission made without leaving the page — track those here. */
  const [justSubmitted, setJustSubmitted] = useState<string[]>([])
  const isSubmitted = (task: NominationTask) =>
    !!task.submission || justSubmitted.includes(task.round.id)

  /* Any award still open can be filled in, in whatever order the nominator likes —
     there is no forced sequence. Selection falls back to the first open award, which
     is also what happens the moment the selected one gets submitted. */
  const firstOpenId = tasks.find(t => !isSubmitted(t))?.round.id ?? null
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected    = tasks.find(t => t.round.id === selectedId)
  const activeId    = selected && !isSubmitted(selected) ? selected.round.id : firstOpenId
  const activeIndex = tasks.findIndex(t => t.round.id === activeId)
  const activeTask  = activeIndex >= 0 ? tasks[activeIndex] : null

  const candidates = useMemo(() => nomineeCandidatesFor(role), [role])

  const [drafts, setDrafts]   = useState<Record<string, Draft>>({})
  const [showErrors, setShowErrors] = useState<Record<string, boolean>>({})
  const [confirming, setConfirming] = useState<NominationTask | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const monthLabel = `${MONTHS[campaign.month]} ${campaign.year}`

  const draftFor = (roundId: string) => drafts[roundId] ?? emptyDraft()

  function patchDraft(roundId: string, patch: Partial<Draft>) {
    setDrafts(prev => ({ ...prev, [roundId]: { ...(prev[roundId] ?? emptyDraft()), ...patch } }))
  }

  function setValue(roundId: string, fieldId: string, value: string) {
    setDrafts(prev => {
      const d = prev[roundId] ?? emptyDraft()
      return { ...prev, [roundId]: { ...d, values: { ...d.values, [fieldId]: value } } }
    })
  }

  /** Which required fields of this award are still empty. */
  function missingFields(task: NominationTask): TemplateField[] {
    const d = draftFor(task.round.id)
    return (task.template?.fields ?? []).filter(f => {
      if (!f.required) return false
      if (f.type === 'employee-picker') return !d.nominee
      return !(d.values[f.id] ?? '').trim()
    })
  }

  function requestSubmit(task: NominationTask) {
    if (missingFields(task).length > 0) {
      setShowErrors(prev => ({ ...prev, [task.round.id]: true }))
      return
    }
    setConfirming(task)
  }

  async function confirmSubmit() {
    const task = confirming
    if (!task || submitting) return
    const d = draftFor(task.round.id)
    if (!d.nominee) return

    setSubmitting(true)
    await new Promise(r => setTimeout(r, 900))

    const fields = task.template?.fields ?? []
    /* The first paragraph field is the reason; everything else becomes a listed answer. */
    const reasonField = fields.find(f => f.type === 'long-text')
    const answers: SubmissionAnswer[] = fields
      .filter(f => f.type !== 'employee-picker' && f.id !== reasonField?.id)
      .map(f => {
        const raw = (d.values[f.id] ?? '').trim()
        return { label: f.label, value: f.type === 'rating' && raw ? `${raw} of 5` : raw }
      })
      .filter(a => a.value !== '')

    const now = new Date()
    saveSubmission(campaign.id, {
      roundId:  task.round.id,
      nominee:  d.nominee,
      reason:   reasonField ? (d.values[reasonField.id] ?? '').trim() : '',
      answers,
      submittedOn: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
      submittedAt: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    })

    setSubmitting(false)
    setConfirming(null)

    /* Still awards owed? Stay put and let the next tab open, so a manager can do
       both in one sitting. Only the final submission returns to the dashboard. */
    const remaining = tasks.filter(t => t.round.id !== task.round.id && !isSubmitted(t))
    if (remaining.length > 0) {
      setJustSubmitted(prev => [...prev, task.round.id])
      setShowErrors(prev => ({ ...prev, [task.round.id]: false }))
    } else {
      onSubmitted(AWARD_THEME[task.award].label)
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes nfModal { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }
        @keyframes nfSpin  { to { transform: rotate(360deg) } }
        .nf-input:focus { outline: none; border-color: ${INDIGO}; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
      `}</style>

      <SpotlightBreadcrumb backLabel="Dashboard" current="Submit Nomination" onBack={onBack} />

      {/* ── Header ── */}
      <div style={{ marginBottom: 20 }}>
        <h1 className="text-2xl font-bold" style={{ color: C.navy }}>Submit Nomination</h1>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>
          Rewards &amp; Recognition · {monthLabel} · Nominations close{' '}
          <span style={{ fontWeight: 600, color: inbox.closingSoon ? '#C0202E' : C.navy }}>
            {formatDate(campaign.deadline)}
          </span>
        </p>
      </div>

      {/* ── 3 / 9 — sticky award rail, then the open award's form ── */}
      {activeTask && (
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 9fr)', alignItems: 'start' }}
        >
          <AwardTabs
            tasks={tasks}
            activeId={activeId}
            isSubmitted={isSubmitted}
            onSelect={setSelectedId}
          />

          <div
            style={{
              background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16,
              overflow: 'hidden', minWidth: 0,
            }}
          >
            <AwardForm
              key={activeTask.round.id}
              task={activeTask}
              draft={draftFor(activeTask.round.id)}
              candidates={candidates}
              missing={showErrors[activeTask.round.id] ? missingFields(activeTask) : []}
              onNominee={p => patchDraft(activeTask.round.id, { nominee: p })}
              onValue={(fieldId, v) => setValue(activeTask.round.id, fieldId, v)}
              onSubmit={() => requestSubmit(activeTask)}
              onCancel={onBack}
            />
          </div>
        </div>
      )}

      {/* ── Confirm modal ── */}
      {confirming && (
        <ConfirmModal
          task={confirming}
          nominee={draftFor(confirming.round.id).nominee!}
          submitting={submitting}
          onCancel={() => { if (!submitting) setConfirming(null) }}
          onConfirm={confirmSubmit}
        />
      )}
    </div>
  )
}

/* ── One award's form ─────────────────────────────────── */
function AwardTabs({
  tasks, activeId, isSubmitted, onSelect,
}: {
  tasks: NominationTask[]
  activeId: string | null
  isSubmitted: (t: NominationTask) => boolean
  onSelect: (roundId: string) => void
}) {
  const doneCount = tasks.filter(isSubmitted).length

  return (
    <div
      style={{
        position: 'sticky', top: 0, minWidth: 0,
        background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: 14,
      }}
    >
      <div
        className="flex items-baseline justify-between gap-2"
        style={{ padding: '2px 6px 10px' }}
      >
        <span
          style={{
            fontSize: 10.5, fontWeight: 700, color: C.muted,
            textTransform: 'uppercase', letterSpacing: '0.06em',
          }}
        >
          {tasks.length > 1 ? 'Your awards' : 'Your award'}
        </span>
        {tasks.length > 1 && (
          <span style={{ fontSize: 10.5, fontWeight: 700, color: doneCount === tasks.length ? C.green : C.muted }}>
            {doneCount}/{tasks.length}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {tasks.map(task => {
          const theme  = AWARD_THEME[task.award]
          const done   = isSubmitted(task)
          const active = task.round.id === activeId

          return (
            <button
              key={task.round.id}
              onClick={() => { if (!done) onSelect(task.round.id) }}
              disabled={done}
              className="flex items-center gap-2.5 w-full text-left"
              style={{
                position: 'relative', padding: '10px 12px', borderRadius: 11, overflow: 'hidden',
                background: active ? 'rgba(99,102,241,0.10)' : 'transparent',
                border: `1px solid ${active ? 'rgba(99,102,241,0.32)' : 'transparent'}`,
                cursor: done ? 'default' : 'pointer', fontFamily: 'inherit',
                transition: 'background 150ms',
              }}
              onMouseEnter={e => { if (!active && !done) e.currentTarget.style.background = C.hover }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              {/* Selected marker — indigo, because this is the interactive state */}
              {active && (
                <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: INDIGO }} />
              )}

              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 30, height: 30, borderRadius: 9,
                  background: theme.bg, border: `1px solid ${theme.border}`,
                }}
              >
                <theme.Icon size={15} strokeWidth={1.9} style={{ color: theme.color }} />
              </div>

              <div className="min-w-0 flex-1">
                <div
                  style={{
                    fontSize: 12.5, fontWeight: 700, color: C.navy,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}
                >
                  {theme.label}
                </div>
                <div
                  style={{
                    fontSize: 10.5, fontWeight: 600, marginTop: 2,
                    color: done ? C.green : active ? INDIGO : C.muted,
                  }}
                >
                  {done ? 'Submitted' : active ? 'Filling in now' : 'Not started'}
                </div>
              </div>

              {done && (
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 19, height: 19, borderRadius: 999, background: 'rgba(14,168,106,0.13)' }}
                >
                  <Check size={12} strokeWidth={2.7} style={{ color: C.green }} />
                </div>
              )}
            </button>
          )
        })}
      </div>

      {tasks.length > 1 && (
        <p style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.55, margin: '12px 6px 2px' }}>
          Submit them in whichever order you like — each one is sent on its own.
        </p>
      )}
    </div>
  )
}

/* ── The open award's form ─────────────────────────────── */
function AwardForm({
  task, draft, candidates, missing, onNominee, onValue, onSubmit, onCancel,
}: {
  task: NominationTask
  draft: Draft
  candidates: Person[]
  missing: TemplateField[]
  onNominee: (p: Person | null) => void
  onValue: (fieldId: string, value: string) => void
  onSubmit: () => void
  onCancel: () => void
}) {
  const theme  = AWARD_THEME[task.award]
  const tpl    = task.template
  const fields = tpl?.fields ?? []
  const missingIds = new Set(missing.map(f => f.id))

  return (
    <div className="flex flex-col" style={{ minWidth: 0 }}>

      {/* Which award you are filling in — the accent bar is the only award colour here */}
      <div style={{ padding: '15px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2.5">
          <span style={{ width: 3, height: 15, borderRadius: 2, background: theme.color, flexShrink: 0 }} />
          <span style={{ fontSize: 14.5, fontWeight: 700, color: C.navy }}>{theme.label}</span>
        </div>
        {tpl?.description && (
          <p style={{ fontSize: 11.5, color: '#5A6080', lineHeight: 1.5, margin: '5px 0 0 13px' }}>
            {tpl.description}
          </p>
        )}
      </div>

      <div style={{ paddingBottom: 18 }}>
        {/* Fields, straight off the template */}
        <div className="flex flex-col gap-5" style={{ padding: 20 }}>
          {fields.map(field => (
            <FormField
              key={field.id}
              field={field}
              accent={theme.color}
              invalid={missingIds.has(field.id)}
              nominee={draft.nominee}
              value={draft.values[field.id] ?? ''}
              candidates={candidates}
              onNominee={onNominee}
              onValue={v => onValue(field.id, v)}
            />
          ))}
        </div>

        {/* Validation summary */}
        {missing.length > 0 && (
          <div
            className="flex items-center gap-2"
            style={{ margin: '0 20px', padding: '10px 13px', background: 'rgba(232,72,85,0.07)', border: '1px solid rgba(232,72,85,0.22)', borderRadius: 10 }}
          >
            <CircleAlert size={14} strokeWidth={2} style={{ color: C.red, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: '#A8323C', fontWeight: 500 }}>
              Please complete: {missing.map(f => f.label).join(', ')}.
            </span>
          </div>
        )}
      </div>

      {/* Actions — pinned to the bottom so they line up with the tab rail's edge */}
      <div
        className="flex items-center justify-between gap-3"
        style={{ marginTop: 'auto', padding: '14px 20px', borderTop: `1px solid ${C.border}`, background: C.surface }}
      >
        <span style={{ fontSize: 11.5, color: C.muted }}>
          One nomination per award — you can&apos;t edit this after submitting.
        </span>
        <div className="flex items-center gap-2.5">
          <button
            onClick={onCancel}
            className="rounded-lg cursor-pointer font-semibold transition-all duration-150"
            style={{ height: 38, padding: '0 16px', fontSize: 12.5, background: '#fff', color: '#5A6080', border: `1px solid ${C.border}`, fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.hover }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="rounded-lg border-none cursor-pointer font-semibold transition-all duration-150"
            style={{ height: 38, padding: '0 18px', fontSize: 12.5, background: INDIGO, color: '#fff', fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.background = INDIGO_HOVER }}
            onMouseLeave={e => { e.currentTarget.style.background = INDIGO }}
          >
            Submit Nomination
          </button>
        </div>
      </div>
    </div>
  )

}

/* ── One template field, rendered live ────────────────── */
function FormField({
  field, accent, invalid, nominee, value, candidates, onNominee, onValue,
}: {
  field: TemplateField
  accent: string
  invalid: boolean
  nominee: Person | null
  value: string
  candidates: Person[]
  onNominee: (p: Person | null) => void
  onValue: (v: string) => void
}) {
  const border = invalid ? 'rgba(232,72,85,0.55)' : C.border

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', border: `1px solid ${border}`, borderRadius: 9,
    fontSize: 13, color: C.navy, background: '#fff', fontFamily: 'inherit', transition: 'all 0.15s',
  }

  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, marginBottom: 7 }}>
        {field.label}
        {field.required && <span style={{ color: C.red, marginLeft: 4 }}>*</span>}
      </div>

      {field.type === 'employee-picker' && (
        <EmployeePicker
          nominee={nominee}
          candidates={candidates}
          invalid={invalid}
          helpText={field.helpText}
          onSelect={onNominee}
        />
      )}

      {field.type === 'long-text' && (
        <textarea
          className="nf-input"
          value={value}
          onChange={e => onValue(e.target.value)}
          placeholder="Type your answer…"
          rows={5}
          style={{ ...inputStyle, padding: '11px 13px', minHeight: 110, resize: 'vertical', lineHeight: 1.6 }}
        />
      )}

      {field.type === 'short-text' && (
        <input
          className="nf-input"
          value={value}
          onChange={e => onValue(e.target.value)}
          placeholder="Short answer…"
          style={{ ...inputStyle, height: 42, padding: '0 13px' }}
        />
      )}

      {field.type === 'dropdown' && (
        <div style={{ position: 'relative' }}>
          <select
            className="nf-input"
            value={value}
            onChange={e => onValue(e.target.value)}
            style={{ ...inputStyle, height: 42, padding: '0 34px 0 13px', appearance: 'none', cursor: 'pointer', color: value ? C.navy : '#9AA0B8' }}
          >
            <option value="">Select an option</option>
            {(field.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <ChevronDown size={15} style={{ color: '#B0B4C8', position: 'absolute', right: 12, top: 13, pointerEvents: 'none' }} />
        </div>
      )}

      {field.type === 'rating' && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(n => {
              const on = Number(value) >= n
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => onValue(String(n))}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', lineHeight: 0 }}
                  aria-label={`${n} star${n === 1 ? '' : 's'}`}
                >
                  <Star
                    size={24}
                    strokeWidth={1.8}
                    style={{ color: on ? accent : '#D8DCEC', fill: on ? accent : 'transparent', transition: 'all 0.12s' }}
                  />
                </button>
              )
            })}
          </div>
          {value && <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{value} of 5</span>}
        </div>
      )}

      {field.helpText && field.type !== 'employee-picker' && (
        <div style={{ fontSize: 10.5, color: C.muted, marginTop: 6 }}>{field.helpText}</div>
      )}
    </div>
  )
}

/* ── Employee picker — search, pick one, auto-fill ────── */
function EmployeePicker({
  nominee, candidates, invalid, helpText, onSelect,
}: {
  nominee: Person | null
  candidates: Person[]
  invalid: boolean
  helpText?: string
  onSelect: (p: Person | null) => void
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen]   = useState(false)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    const pool = q
      ? candidates.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q))
      : candidates
    return pool.slice(0, 60)
  }, [candidates, query])

  /* Chosen — show the auto-filled nominee: picture, name, role, email. Nothing else. */
  if (nominee) {
    return (
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, background: C.surface }}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={nominee.avatar}
              alt={nominee.name}
              style={{ width: 46, height: 46, borderRadius: 12, objectFit: 'cover', border: `1px solid ${C.border}`, flexShrink: 0 }}
            />
            <div className="min-w-0">
              <div style={{ fontSize: 14.5, fontWeight: 700, color: C.navy }}>{nominee.name}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{nominee.role}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{nominee.email}</div>
            </div>
          </div>
          <button
            onClick={() => { onSelect(null); setQuery(''); setOpen(false) }}
            className="flex items-center gap-1.5 rounded-lg cursor-pointer font-semibold transition-all duration-150 flex-shrink-0"
            style={{ height: 32, padding: '0 12px', fontSize: 12, background: '#fff', color: '#5A6080', border: `1px solid ${C.border}`, fontFamily: 'inherit' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.hover }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
          >
            <X size={13} strokeWidth={2.2} />
            Change
          </button>
        </div>
      </div>
    )
  }

  /* Not chosen yet — search. */
  return (
    <div style={{ position: 'relative' }}>
      <div
        className="flex items-center gap-2"
        style={{
          height: 42, padding: '0 13px', borderRadius: 9, background: '#fff',
          border: `1px solid ${invalid ? 'rgba(232,72,85,0.55)' : C.border}`,
        }}
      >
        <UserSearch size={16} style={{ color: '#B0B4C8', flexShrink: 0 }} />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search by name, employee code, role or department…"
          style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: C.navy, fontFamily: 'inherit', background: 'transparent' }}
        />
      </div>

      <div style={{ fontSize: 10.5, color: C.muted, marginTop: 6 }}>
        {helpText ?? 'Select one person.'} Picking them auto-fills their name, role &amp; email.
      </div>

      {open && (
        <>
          {/* click-away */}
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 20 }} />
          <div
            style={{
              position: 'absolute', top: 46, left: 0, right: 0, zIndex: 21,
              background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12,
              boxShadow: '0 12px 32px rgba(28,32,53,0.12)', maxHeight: 296, overflowY: 'auto',
            }}
          >
            {matches.length === 0 ? (
              <div className="flex items-center gap-2" style={{ padding: '14px 14px', color: C.muted, fontSize: 12.5 }}>
                <Search size={14} /> No one matches “{query}”.
              </div>
            ) : (
              matches.map(p => (
                <button
                  key={p.code}
                  onClick={() => { onSelect(p); setOpen(false); setQuery('') }}
                  className="flex items-center gap-3 w-full text-left"
                  style={{ padding: '9px 13px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.background = C.hover }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <img src={p.avatar} alt="" style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'cover', flexShrink: 0 }} />
                  <div className="min-w-0 flex-1">
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 11, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.role} · {p.department}
                    </div>
                  </div>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, flexShrink: 0 }}>{p.code}</span>
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}


/* ── Confirm before the one-way submit ────────────────── */
function ConfirmModal({
  task, nominee, submitting, onCancel, onConfirm,
}: {
  task: NominationTask
  nominee: Person
  submitting: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  const theme = AWARD_THEME[task.award]
  return (
    <div
      onClick={onCancel}
      className="flex items-center justify-center"
      style={{ position: 'fixed', inset: 0, background: 'rgba(19,22,39,0.42)', zIndex: 60, padding: 20 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="text-center"
        style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 440, padding: 28, animation: 'nfModal 0.16s ease-out' }}
      >
        <div
          className="flex items-center justify-center mx-auto"
          style={{ width: 44, height: 44, borderRadius: 12, background: theme.bg, border: `1px solid ${theme.border}`, marginBottom: 14 }}
        >
          <theme.Icon size={21} strokeWidth={1.8} style={{ color: theme.color }} />
        </div>

        <h3 style={{ fontSize: 16.5, fontWeight: 700, color: C.navy, margin: 0 }}>
          Submit your {theme.label} nomination?
        </h3>
        <p style={{ fontSize: 13, color: '#5A6080', lineHeight: 1.6, margin: '8px auto 0', maxWidth: 340 }}>
          You&apos;re nominating <span style={{ fontWeight: 700, color: C.navy }}>{nominee.name}</span>.
          Nominations can&apos;t be edited or withdrawn once submitted.
        </p>

        <div className="flex items-center justify-center gap-2.5" style={{ marginTop: 22 }}>
          <button
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg cursor-pointer font-semibold transition-all duration-150"
            style={{ height: 38, padding: '0 16px', fontSize: 12.5, background: '#fff', color: '#5A6080', border: `1px solid ${C.border}`, fontFamily: 'inherit', opacity: submitting ? 0.5 : 1 }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex items-center gap-2 rounded-lg border-none cursor-pointer font-semibold transition-all duration-150"
            style={{ height: 38, padding: '0 18px', fontSize: 12.5, background: INDIGO, color: '#fff', fontFamily: 'inherit', opacity: submitting ? 0.75 : 1 }}
          >
            {submitting ? (
              <>
                <span
                  style={{ width: 13, height: 13, borderRadius: 99, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', display: 'inline-block', animation: 'nfSpin 0.7s linear infinite' }}
                />
                Submitting…
              </>
            ) : (
              <>
                <Check size={14} strokeWidth={2.4} />
                Yes, submit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
