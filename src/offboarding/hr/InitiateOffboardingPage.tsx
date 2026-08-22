import { useMemo, useState } from 'react'
import {
  UserPlus, ChevronDown, Search, X, ShieldCheck, Users, FileCheck2,
  Info, ArrowRight, ArrowLeft, Lock, Layers, User, Trash2,
} from 'lucide-react'
import {
  ROSTER, isOffboarding, INVOLUNTARY_REASONS,
  type RosterEmployee,
} from './roster'

/*
 * HR › Initiate Offboarding — HI-1 (Individual).
 *
 * A SECOND way into the existing offboarding pipeline: HR raises the case (for
 * involuntary reasons) instead of the employee. HR only STARTS it — on submit the
 * case enters the existing flow at "Pending CTO Approval" (the CTO sets the notice
 * period + last working day; HR never enters a date). Every created case carries an
 * "Initiated by: HR" marker.
 *
 * One screen, two modes (Individual · Bulk) via a top toggle. This file ships the
 * Individual mode; Bulk (HI-2) is designed next and shown as a placeholder here.
 *
 * Demo switcher (Form · Success) walks the states without a backend.
 */

const C = {
  navy:   '#1C2035',
  border: '#E8EAF2',
  muted:  '#8B90A7',
  indigo: '#6366F1',
  indigoDeep: '#5B5FDE',
}

const labelStyle: React.CSSProperties = {
  fontSize: 11.5, fontWeight: 700, color: C.muted, display: 'block',
  marginBottom: 7, letterSpacing: '0.06em', textTransform: 'uppercase',
}
const inputBase: React.CSSProperties = {
  width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
  fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  transition: 'border-color 0.15s', boxSizing: 'border-box',
}

const NEXT_STEPS = [
  { Icon: ShieldCheck, title: 'CTO Approval', desc: 'The Delivery Head reviews the case and sets the notice period & last working day.' },
  { Icon: Users,       title: 'Department Clearances', desc: 'Manager, IT & Finance complete their clearances in parallel.' },
  { Icon: FileCheck2,  title: 'HR Closure', desc: 'Exit formalities, relieving & experience letters, then case closed.' },
]

type Mode = 'individual' | 'bulk'

export default function InitiateOffboardingPage({ onGoToCases }: { onGoToCases?: () => void }) {
  const [mode, setMode] = useState<Mode>('individual')

  // form fields
  const [selected, setSelected] = useState<RosterEmployee | null>(null)
  const [reason,   setReason]   = useState('')
  const [details,  setDetails]  = useState('')

  // modals
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting,  setSubmitting]  = useState(false)

  const canSubmit = !!selected && !!reason && details.trim().length > 0

  function resetForm() {
    setSelected(null); setReason(''); setDetails('')
  }

  // On confirm: show loading, then land on the Offboarding Cases table (the case
  // now lives in the existing pipeline at "Pending CTO Approval").
  async function handleFinalSubmit() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1400))
    setSubmitting(false)
    setShowConfirm(false)
    resetForm()
    onGoToCases?.()
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes obFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}@keyframes obSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>
            Initiate Offboarding
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
            Raise an offboarding case on behalf of the organisation
          </p>
        </div>
        <div
          className="flex items-center justify-center rounded-2xl flex-shrink-0"
          style={{
            width: 60, height: 60,
            backgroundColor: 'rgba(99,102,241,0.07)',
            backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.22) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
            border: '1px solid rgba(99,102,241,0.14)',
          }}
        >
          <div style={{ animation: 'obFloat 4s ease-in-out infinite' }}>
            <UserPlus size={26} strokeWidth={1.5} style={{ color: C.indigoDeep }} />
          </div>
        </div>
      </div>

      {/* ── Toolbar: mode toggle ── */}
      <div className="flex items-center flex-wrap gap-3 mb-5">
        {/* Mode toggle */}
        <div style={{ display: 'inline-flex', gap: 4, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 11, padding: 4 }}>
          {(([['individual', 'Individual', User], ['bulk', 'Bulk', Layers]] as [Mode, string, React.ElementType][]).map(([m, label, Icon]) => {
            const on = mode === m
            return (
              <button key={m} onClick={() => setMode(m)}
                className="flex items-center gap-2"
                style={{
                  padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: 13, fontWeight: on ? 700 : 600, whiteSpace: 'nowrap',
                  background: on ? C.indigo : 'transparent', color: on ? '#fff' : C.muted,
                  boxShadow: on ? '0 1px 5px rgba(99,102,241,0.35)' : 'none', transition: 'all 0.12s',
                }}>
                <Icon size={15} strokeWidth={2.2} />
                {label}
              </button>
            )
          }))}
        </div>
      </div>

      {/* ── Body ── */}
      {mode === 'bulk' ? (
        <BulkView onGoToCases={onGoToCases} />
      ) : (
        <FormView
          {...{ selected, setSelected, reason, setReason, details, setDetails, canSubmit }}
          onSubmit={() => setShowConfirm(true)}
        />
      )}

      {/* ── Confirm modal ── */}
      {showConfirm && selected && (
        <Modal onClose={() => setShowConfirm(false)} width={460}>
          <div style={{ padding: '26px 28px 20px', borderBottom: '1px solid #F0F2F8' }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
                <UserPlus size={19} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>Confirm Offboarding Initiation</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>This starts an offboarding case for the employee</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SummaryRow label="Employee" value={`${selected.name} (${selected.code})`} />
            <SummaryRow label="Reason" value={reason} />
            <div style={{ padding: '11px 14px', background: '#F7F8FC', borderRadius: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 7 }}>Justification</div>
              <div style={{ fontSize: 13, color: details ? C.navy : '#C0C4D6', lineHeight: 1.6, fontStyle: details ? 'normal' : 'italic' }}>
                {details || 'No justification provided'}
              </div>
            </div>
            <div className="flex items-start gap-2.5" style={{ padding: '11px 14px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 10 }}>
              <Info size={15} style={{ color: C.indigoDeep, flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: '#4A4F86', lineHeight: 1.55 }}>
                No last working day is set here — the <strong>Delivery Head (CTO)</strong> decides the notice period and last day on approval. The case will be tagged <strong>Initiated by HR</strong>.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3" style={{ padding: '0 28px 24px' }}>
            <button onClick={() => setShowConfirm(false)} style={ghostBtn}>Go Back</button>
            <button onClick={handleFinalSubmit} disabled={submitting} style={{ ...primaryBtn, flex: 1, opacity: submitting ? 0.85 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? <><Spinner /> Initiating…</> : 'Yes, Initiate'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

/* ════════════════════════ FORM VIEW ════════════════════════ */
function FormView({
  selected, setSelected, reason, setReason, details, setDetails, canSubmit, onSubmit,
}: {
  selected: RosterEmployee | null; setSelected: (v: RosterEmployee | null) => void
  reason: string; setReason: (v: string) => void
  details: string; setDetails: (v: string) => void
  canSubmit: boolean; onSubmit: () => void
}) {
  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: '8fr 4fr', alignItems: 'start' }}>
      {/* LEFT — form */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div className="flex items-center gap-2.5" style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
            <UserPlus size={15} strokeWidth={2} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Offboarding Details</span>
        </div>

        <div style={{ padding: '26px 24px' }}>
          {/* Employee picker */}
          <div className="mb-6">
            <label style={labelStyle}>Employee <span style={{ color: '#E84855' }}>*</span></label>
            <EmployeePicker selected={selected} onSelect={setSelected} />
          </div>

          {/* Reason */}
          <div className="mb-6" style={{ maxWidth: 360 }}>
            <label style={labelStyle}>Reason for Offboarding <span style={{ color: '#E84855' }}>*</span></label>
            <div className="relative">
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                style={{ ...inputBase, paddingRight: 36, border: `1px solid ${C.border}`, background: reason ? '#F5F6FF' : '#fff', appearance: 'none', cursor: 'pointer', color: reason ? C.navy : C.muted }}
              >
                <option value="">— Select a reason —</option>
                {INVOLUNTARY_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Justification */}
          <div className="mb-2">
            <label style={labelStyle}>Detailed Reason / Justification <span style={{ color: '#E84855' }}>*</span></label>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Explain the reason for initiating this offboarding — visible to the CTO and stored on the case…"
              rows={4}
              style={{ width: '100%', borderRadius: 10, border: `1px solid ${C.border}`, background: details ? '#F5F6FF' : '#fff', padding: '12px 14px', fontSize: 13.5, fontWeight: 400, color: C.navy, resize: 'vertical', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.65, boxSizing: 'border-box' }}
            />
          </div>

          {/* No-LWD note */}
          <div className="flex items-start gap-2.5 mb-6" style={{ padding: '11px 14px', background: '#FAFBFE', border: `1px solid ${C.border}`, borderRadius: 10 }}>
            <Lock size={14} style={{ color: C.muted, flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: '#5C6080', lineHeight: 1.55 }}>
              You don't set a last working day — the <strong style={{ color: C.navy }}>CTO</strong> confirms the notice period and last day on approval.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3" style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22 }}>
            <button
              onClick={() => { setSelected(null); setReason(''); setDetails('') }}
              style={{ height: 44, padding: '0 22px', borderRadius: 10, fontSize: 13.5, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0C4D6'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
            >
              Clear
            </button>
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              style={{
                height: 44, padding: '0 30px', borderRadius: 10, fontSize: 13.5, fontWeight: 700, border: 'none', marginLeft: 'auto',
                background: canSubmit ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : '#D8DCF0',
                color: '#fff', cursor: canSubmit ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', gap: 7, transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { if (canSubmit) e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              Initiate Offboarding
              <ArrowRight size={15} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT — helper */}
      <div className="flex flex-col gap-4">
        {/* Initiated by HR badge card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.09), rgba(99,102,241,0.02))', border: '1px solid rgba(99,102,241,0.20)', borderRadius: 16, padding: '16px 18px' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 rounded-full" style={{ padding: '4px 10px', background: C.indigo, color: '#fff', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <UserPlus size={12} strokeWidth={2.4} /> Initiated by HR
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#4A4F86', lineHeight: 1.6, margin: 0 }}>
            You're raising this case on the organisation's behalf (involuntary exit). The employee can't withdraw it — from here it follows the exact same approval → clearance → closure path.
          </p>
        </div>

        {/* What happens next */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div className="flex items-center gap-2.5" style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 30, height: 30, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
              <ShieldCheck size={14} strokeWidth={2.2} />
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>What happens next</span>
          </div>
          <div style={{ padding: '16px 18px' }}>
            {NEXT_STEPS.map((s, i) => {
              const Icon = s.Icon
              const last = i === NEXT_STEPS.length - 1
              return (
                <div key={i} className="flex gap-3" style={{ position: 'relative' }}>
                  <div className="flex flex-col items-center" style={{ width: 30 }}>
                    <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 30, height: 30, background: 'rgba(99,102,241,0.09)', color: C.indigoDeep }}>
                      <Icon size={14} strokeWidth={2} />
                    </div>
                    {!last && <div style={{ width: 1.5, flex: 1, background: 'rgba(99,102,241,0.16)', margin: '6px 0' }} />}
                  </div>
                  <div style={{ paddingBottom: last ? 0 : 22 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>{s.title}</div>
                    <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5, marginTop: 2 }}>{s.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Good to know */}
        <div style={{ background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.18)', borderRadius: 16, padding: '14px 16px' }}>
          <div className="flex items-center gap-2 mb-2.5">
            <Info size={14} style={{ color: '#D97706' }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#9A6207' }}>Good to know</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              'The last working day is decided by the CTO — not entered here.',
              'The reason & justification are visible to the CTO and stored on the case.',
              'Employees already in an active case can\'t be re-initiated.',
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2" style={{ fontSize: 11.5, color: '#8A6516', lineHeight: 1.5 }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#D97706', marginTop: 6, flexShrink: 0 }} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════ EMPLOYEE PICKER ════════════════════════ */
function EmployeePicker({ selected, onSelect }: { selected: RosterEmployee | null; onSelect: (e: RosterEmployee | null) => void }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? ROSTER.filter(e =>
          e.name.toLowerCase().includes(q) ||
          e.code.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.designation.toLowerCase().includes(q))
      : ROSTER
    // active first, disabled (already offboarding) last
    return [...list].sort((a, b) => Number(isOffboarding(a.code)) - Number(isOffboarding(b.code)))
  }, [query])

  // Selected → identity chip
  if (selected) {
    return (
      <div className="flex items-center gap-3" style={{ borderRadius: 12, border: `1px solid ${C.border}`, background: '#F7F8FC', padding: '12px 14px' }}>
        <img src={selected.avatar} alt={selected.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 1px 4px rgba(28,32,53,0.12)' }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{selected.name}</span>
            <span style={{ fontSize: 12, color: C.muted }}>({selected.code})</span>
          </div>
          <div style={{ fontSize: 12.5, color: '#5C6080', marginTop: 2 }}>
            {selected.designation} · {selected.department}
          </div>
        </div>
        <div className="text-right" style={{ paddingLeft: 12, borderLeft: `1px solid ${C.border}`, marginRight: 4 }}>
          <div style={{ fontSize: 11, color: C.muted }}>Reporting Manager</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, marginTop: 2 }}>{selected.manager}</div>
        </div>
        <button
          onClick={() => { onSelect(null); setQuery(''); setOpen(false) }}
          className="flex items-center gap-1.5 flex-shrink-0"
          style={{ height: 34, padding: '0 12px', borderRadius: 9, fontSize: 12, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0C4D6'; e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
        >
          Change
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Search input */}
      <div className="relative">
        <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search employee by name, code or department…"
          style={{ ...inputBase, paddingLeft: 38, paddingRight: query ? 36 : 14, border: `1px solid ${open ? C.indigo : C.border}`, background: '#fff' }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: C.muted, display: 'flex' }}>
            <X size={15} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <>
          {/* click-away backdrop */}
          <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setOpen(false)} />
          <div
            className="scrollbar-hide"
            style={{
              position: 'absolute', top: 50, left: 0, right: 0, zIndex: 41,
              background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12,
              boxShadow: '0 16px 44px rgba(10,12,28,0.16)', maxHeight: 320, overflowY: 'auto', padding: 6,
            }}
          >
            {results.length === 0 && (
              <div style={{ padding: '22px 14px', textAlign: 'center', fontSize: 13, color: C.muted }}>
                No employees match “{query}”.
              </div>
            )}
            {results.map(e => {
              const disabled = isOffboarding(e.code)
              return (
                <button
                  key={e.code}
                  disabled={disabled}
                  onClick={() => { if (!disabled) { onSelect(e); setOpen(false); setQuery('') } }}
                  className="w-full flex items-center gap-3 text-left"
                  style={{
                    padding: '9px 10px', borderRadius: 9, border: 'none', marginBottom: 2,
                    background: 'transparent', cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.55 : 1, transition: 'background 0.12s',
                  }}
                  onMouseEnter={ev => { if (!disabled) ev.currentTarget.style.background = '#F5F6FF' }}
                  onMouseLeave={ev => { ev.currentTarget.style.background = 'transparent' }}
                >
                  <img src={e.avatar} alt={e.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, filter: disabled ? 'grayscale(0.7)' : 'none' }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{e.name}</span>
                      <span style={{ fontSize: 11.5, color: C.muted }}>{e.code}</span>
                    </div>
                    <div style={{ fontSize: 11.5, color: '#5C6080', marginTop: 1 }}>{e.designation} · {e.department}</div>
                  </div>
                  {disabled && (
                    <span className="flex-shrink-0 rounded-full" style={{ padding: '3px 9px', background: 'rgba(217,119,6,0.12)', color: '#B26905', fontSize: 10, fontWeight: 700 }}>
                      Already in offboarding
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

/* ════════════════════════ BULK VIEW (HI-2) ════════════════════════ */
function BulkView({ onGoToCases }: { onGoToCases?: () => void }) {
  const [step, setStep]           = useState<1 | 2>(1)
  const [query, setQuery]         = useState('')
  const [selected, setSelected]   = useState<string[]>([])          // employee codes
  const [sharedReason, setShared] = useState('')
  const [sharedNotes, setNotes]   = useState('')
  const [overrides, setOverrides] = useState<Record<string, string>>({}) // code → reason override
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting]   = useState(false)

  const selectedEmployees = useMemo(
    () => ROSTER.filter(e => selected.includes(e.code)),
    [selected]
  )
  const overrideCount = selectedEmployees.filter(e => overrides[e.code] && overrides[e.code] !== sharedReason).length

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? ROSTER.filter(e =>
          e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) || e.designation.toLowerCase().includes(q))
      : ROSTER
    return [...list].sort((a, b) => Number(isOffboarding(a.code)) - Number(isOffboarding(b.code)))
  }, [query])

  function toggle(code: string) {
    setSelected(p => p.includes(code) ? p.filter(x => x !== code) : [...p, code])
  }
  function removeOne(code: string) {
    setSelected(p => p.filter(x => x !== code))
    setOverrides(o => { const n = { ...o }; delete n[code]; return n })
  }
  function resetAll() {
    setSelected([]); setShared(''); setNotes(''); setOverrides({}); setStep(1); setQuery('')
  }

  const canNext   = selected.length > 0
  const canSubmit = selected.length > 0 && !!sharedReason && sharedNotes.trim().length > 0

  async function handleSubmit() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1500))
    setSubmitting(false)
    setShowConfirm(false)
    resetAll()
    onGoToCases?.()
  }

  return (
    <div>
      {step === 1 ? (
        /* ─────────── STEP 1 — pick employees ─────────── */
        <div className="grid gap-5" style={{ gridTemplateColumns: '8fr 4fr', alignItems: 'start' }}>
          {/* roster */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div className="flex items-center gap-2.5" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
                <Users size={15} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Select Employees</span>
            </div>
            <div style={{ padding: 16 }}>
              <div className="relative mb-3">
                <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, code or department…"
                  style={{ ...inputBase, height: 42, paddingLeft: 38, paddingRight: query ? 34 : 14, border: `1px solid ${C.border}`, background: '#FAFBFE' }} />
                {query && <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent', cursor: 'pointer', color: C.muted, display: 'flex' }}><X size={15} /></button>}
              </div>
              <div className="scrollbar-hide" style={{ maxHeight: 440, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, padding: '2px 2px 4px' }}>
                {results.length === 0 && (
                  <div style={{ padding: '28px 14px', textAlign: 'center', fontSize: 13, color: C.muted }}>No employees match “{query}”.</div>
                )}
                {results.map(e => {
                  const disabled = isOffboarding(e.code)
                  const on = selected.includes(e.code)
                  return (
                    <button key={e.code} disabled={disabled} onClick={() => toggle(e.code)}
                      className="w-full flex items-center gap-3 text-left"
                      style={{
                        padding: '10px 12px', borderRadius: 11, cursor: disabled ? 'not-allowed' : 'pointer',
                        border: `1px solid ${on ? 'rgba(99,102,241,0.35)' : C.border}`,
                        background: on ? 'rgba(99,102,241,0.05)' : '#fff', opacity: disabled ? 0.55 : 1, transition: 'all 0.12s',
                      }}
                      onMouseEnter={ev => { if (!disabled && !on) ev.currentTarget.style.borderColor = '#C8CCE0' }}
                      onMouseLeave={ev => { if (!on) ev.currentTarget.style.borderColor = C.border }}
                    >
                      <span className="flex items-center justify-center flex-shrink-0" style={{ width: 20, height: 20, borderRadius: 6, border: `1.5px solid ${on ? C.indigo : '#C8CCE0'}`, background: on ? C.indigo : '#fff', transition: 'all 0.12s' }}>
                        {on && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                      </span>
                      <img src={e.avatar} alt={e.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, filter: disabled ? 'grayscale(0.7)' : 'none' }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{e.name}</span>
                          <span style={{ fontSize: 11.5, color: C.muted }}>{e.code}</span>
                        </div>
                        <div style={{ fontSize: 11.5, color: '#5C6080', marginTop: 1 }}>{e.designation} · {e.department}</div>
                      </div>
                      {disabled && (
                        <span className="flex-shrink-0 rounded-full" style={{ padding: '3px 9px', background: 'rgba(217,119,6,0.12)', color: '#B26905', fontSize: 10, fontWeight: 700 }}>Already in offboarding</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* selected panel */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 8 }}>
            <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Selected <span style={{ color: C.indigoDeep }}>({selected.length})</span></span>
              {selected.length > 0 && (
                <button onClick={() => { setSelected([]); setOverrides({}) }} style={{ border: 'none', background: 'transparent', color: C.muted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Clear all</button>
              )}
            </div>
            <div style={{ padding: 16 }}>
              {selected.length === 0 ? (
                <div className="text-center" style={{ padding: '26px 12px' }}>
                  <div className="flex items-center justify-center rounded-2xl mx-auto mb-3" style={{ width: 48, height: 48, background: '#F0F2F8' }}>
                    <Users size={22} strokeWidth={1.7} style={{ color: '#B0B4C8' }} />
                  </div>
                  <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>Tick employees on the left to add them to this batch.</p>
                </div>
              ) : (
                <div className="scrollbar-hide" style={{ maxHeight: 360, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {selectedEmployees.map(e => (
                    <div key={e.code} className="flex items-center gap-2.5" style={{ padding: '8px 10px', borderRadius: 10, background: '#F7F8FC', border: `1px solid ${C.border}` }}>
                      <img src={e.avatar} alt={e.name} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{e.code} · {e.department}</div>
                      </div>
                      <button onClick={() => removeOne(e.code)} className="flex items-center justify-center flex-shrink-0" style={{ width: 26, height: 26, borderRadius: 7, border: 'none', background: 'transparent', color: C.muted, cursor: 'pointer' }}
                        onMouseEnter={ev => { ev.currentTarget.style.background = 'rgba(232,72,85,0.10)'; ev.currentTarget.style.color = '#E84855' }}
                        onMouseLeave={ev => { ev.currentTarget.style.background = 'transparent'; ev.currentTarget.style.color = C.muted }}
                      ><X size={15} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE' }}>
              <button onClick={() => setStep(2)} disabled={!canNext}
                className="flex items-center justify-center gap-2 w-full"
                style={{ height: 46, borderRadius: 11, fontSize: 14, fontWeight: 700, border: 'none', color: '#fff', cursor: canNext ? 'pointer' : 'not-allowed',
                  background: canNext ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : '#D8DCF0' }}>
                Continue <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ─────────── STEP 2 — shared details + per-person override + review ─────────── */
        <div className="grid gap-5" style={{ gridTemplateColumns: '8fr 4fr', alignItems: 'start' }}>
          <div className="flex flex-col gap-5">
            {/* shared details */}
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
              <div className="flex items-center gap-2.5" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
                  <Layers size={15} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Shared Details</span>
                <span className="ml-auto" style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>Applied to all {selected.length}</span>
              </div>
              <div style={{ padding: '22px 20px' }}>
                <div className="mb-5" style={{ maxWidth: 360 }}>
                  <label style={labelStyle}>Reason for Offboarding <span style={{ color: '#E84855' }}>*</span></label>
                  <div className="relative">
                    <select value={sharedReason} onChange={e => setShared(e.target.value)}
                      style={{ ...inputBase, paddingRight: 36, border: `1px solid ${C.border}`, background: sharedReason ? '#F5F6FF' : '#fff', appearance: 'none', cursor: 'pointer', color: sharedReason ? C.navy : C.muted }}>
                      <option value="">— Select a reason —</option>
                      {INVOLUNTARY_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Detailed Reason / Justification <span style={{ color: '#E84855' }}>*</span></label>
                  <textarea value={sharedNotes} onChange={e => setNotes(e.target.value)} rows={3}
                    placeholder="Shared justification for this batch — visible to the CTO and stored on every case…"
                    style={{ width: '100%', borderRadius: 10, border: `1px solid ${C.border}`, background: sharedNotes ? '#F5F6FF' : '#fff', padding: '12px 14px', fontSize: 13.5, color: C.navy, resize: 'vertical', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif", lineHeight: 1.65, boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            {/* per-employee override */}
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
              <div className="flex items-center gap-2.5" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
                <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
                  <Users size={15} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Employees ({selected.length})</span>
                <span className="ml-auto" style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>Reason defaults to shared — override anyone</span>
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedEmployees.map(e => {
                  const ov = overrides[e.code] && overrides[e.code] !== sharedReason
                  return (
                    <div key={e.code} className="flex items-center gap-3" style={{ padding: '10px 12px', borderRadius: 11, background: '#F7F8FC', border: `1px solid ${ov ? 'rgba(99,102,241,0.30)' : C.border}` }}>
                      <img src={e.avatar} alt={e.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      <div className="min-w-0" style={{ width: 150 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{e.code} · {e.department}</div>
                      </div>
                      <div className="relative flex-1" style={{ minWidth: 0 }}>
                        <select value={overrides[e.code] ?? ''} onChange={ev => setOverrides(o => ({ ...o, [e.code]: ev.target.value }))}
                          style={{ width: '100%', height: 38, borderRadius: 9, padding: '0 32px 0 12px', fontSize: 12.5, fontWeight: 600, color: ov ? C.indigoDeep : C.navy, outline: 'none', appearance: 'none', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif", border: `1px solid ${ov ? 'rgba(99,102,241,0.35)' : C.border}`, background: ov ? 'rgba(99,102,241,0.05)' : '#fff' }}>
                          <option value="">Same as shared{sharedReason ? ` · ${sharedReason}` : ''}</option>
                          {INVOLUNTARY_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown size={13} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                      </div>
                      <button onClick={() => removeOne(e.code)} className="flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'transparent', color: C.muted, cursor: 'pointer' }}
                        onMouseEnter={ev => { ev.currentTarget.style.background = 'rgba(232,72,85,0.10)'; ev.currentTarget.style.color = '#E84855' }}
                        onMouseLeave={ev => { ev.currentTarget.style.background = 'transparent'; ev.currentTarget.style.color = C.muted }}
                      ><Trash2 size={15} /></button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* review & submit */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 8 }}>
            <div className="flex items-center gap-2.5" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-center rounded-lg flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
                <FileCheck2 size={15} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Review &amp; Submit</span>
            </div>
            <div style={{ padding: 20 }}>
              <div className="text-center mb-4" style={{ padding: '16px 12px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 12 }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: C.indigoDeep, lineHeight: 1 }}>{selected.length}</div>
                <div style={{ fontSize: 12, color: '#4A4F86', fontWeight: 600, marginTop: 4 }}>employee{selected.length === 1 ? '' : 's'} to offboard</div>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <MiniLine label="Shared reason" value={sharedReason || 'Not set'} warn={!sharedReason} />
                <MiniLine label="Individual overrides" value={overrideCount ? `${overrideCount}` : 'None'} />
                <MiniLine label="Justification" value={sharedNotes.trim() ? 'Added' : 'Not set'} warn={!sharedNotes.trim()} />
              </div>
              <div className="flex items-start gap-2.5 mb-4" style={{ padding: '11px 13px', background: '#FAFBFE', border: `1px solid ${C.border}`, borderRadius: 10 }}>
                <Lock size={14} style={{ color: C.muted, flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontSize: 11.5, color: '#5C6080', lineHeight: 1.5 }}>One case is created per employee at <strong style={{ color: C.navy }}>Pending CTO Approval</strong>. The CTO sets each notice period & last day.</span>
              </div>
              <button onClick={() => setShowConfirm(true)} disabled={!canSubmit}
                className="flex items-center justify-center gap-2 w-full"
                style={{ height: 46, borderRadius: 11, fontSize: 14, fontWeight: 700, border: 'none', color: '#fff', cursor: canSubmit ? 'pointer' : 'not-allowed', marginBottom: 10,
                  background: canSubmit ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : '#D8DCF0' }}>
                Initiate {selected.length} Offboarding{selected.length === 1 ? '' : 's'} <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <button onClick={() => setStep(1)} className="flex items-center justify-center gap-2 w-full"
                style={{ height: 42, borderRadius: 11, fontSize: 13, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer' }}>
                <ArrowLeft size={15} /> Back to selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirm modal ── */}
      {showConfirm && (
        <Modal onClose={() => !submitting && setShowConfirm(false)} width={460}>
          <div style={{ padding: '26px 28px 20px', borderBottom: '1px solid #F0F2F8' }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.10)', color: C.indigoDeep }}>
                <Layers size={19} strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>Initiate {selected.length} Offboarding{selected.length === 1 ? '' : 's'}?</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>One case will be created per employee</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <SummaryRow label="Employees" value={`${selected.length}`} />
            <SummaryRow label="Shared Reason" value={sharedReason} />
            {overrideCount > 0 && <SummaryRow label="Individual Overrides" value={`${overrideCount}`} />}
            <div className="flex items-start gap-2.5" style={{ padding: '11px 14px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 10 }}>
              <Info size={15} style={{ color: C.indigoDeep, flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, color: '#4A4F86', lineHeight: 1.55 }}>
                Each case enters at <strong>Pending CTO Approval</strong>, tagged <strong>Initiated by HR</strong>. The CTO sets each notice period & last working day.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3" style={{ padding: '0 28px 24px' }}>
            <button onClick={() => setShowConfirm(false)} disabled={submitting} style={ghostBtn}>Go Back</button>
            <button onClick={handleSubmit} disabled={submitting} style={{ ...primaryBtn, flex: 1, opacity: submitting ? 0.85 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? <><Spinner /> Initiating…</> : `Yes, Initiate ${selected.length}`}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function MiniLine({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '9px 12px', background: '#F7F8FC', borderRadius: 9 }}>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: C.muted }}>{label}</span>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: warn ? '#B26905' : C.navy, textAlign: 'right', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  )
}

/* ════════════════════════ small shared bits ════════════════════════ */
function SummaryRow({ label, value, node }: { label: string; value?: string; node?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '11px 14px', background: '#F7F8FC', borderRadius: 10 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      {node ?? <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, textAlign: 'right' }}>{value}</span>}
    </div>
  )
}

function Modal({ children, onClose, width }: { children: React.ReactNode; onClose: () => void; width: number }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: 22, width, boxShadow: '0 24px 64px rgba(10,12,28,0.18)', overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'obSpin 0.8s linear infinite', flexShrink: 0 }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

const primaryBtn: React.CSSProperties = {
  height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700, border: 'none',
  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
}
const ghostBtn: React.CSSProperties = {
  flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 600,
  border: '1px solid #E8EAF2', background: '#fff', color: C.muted, cursor: 'pointer',
}
