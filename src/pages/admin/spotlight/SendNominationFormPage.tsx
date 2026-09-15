import { useState } from 'react'
import {
  ArrowLeft, ArrowRight, Check, Send, AlertTriangle, CalendarDays,
  ListChecks, Loader2,
} from 'lucide-react'
import { C, AWARD_THEME, audienceLabel, type NominationTemplate } from './nominationTemplatesData'
import AudienceChips from './AudienceChips'
import {
  MONTHS, audienceSize, lastDayISO, firstDayISO, formatDate,
  type Campaign, type CampaignRound,
} from './responseFormsData'

interface Props {
  templates: NominationTemplate[]
  campaigns: Campaign[]
  onBack: () => void
  onSend: (c: Campaign) => void
}

const YEARS = [2026, 2027]

export default function SendNominationFormPage({ templates, campaigns, onBack, onSend }: Props) {
  const now = new Date()
  const [step, setStep]         = useState<1 | 2>(1)
  const [month, setMonth]       = useState(now.getMonth())
  const [year, setYear]         = useState(now.getFullYear())
  const [deadline, setDeadline] = useState(lastDayISO(now.getMonth(), now.getFullYear()))
  const [picked, setPicked]     = useState<string[]>([])
  const [confirm, setConfirm]   = useState(false)
  const [sending, setSending]   = useState(false)

  const available = templates.filter(t => t.status === 'Active')
  const duplicate = campaigns.find(c => c.month === month && c.year === year) ?? null

  const chosen = picked
    .map(id => available.find(t => t.id === id))
    .filter((t): t is NominationTemplate => Boolean(t))

  const recipients = chosen.reduce((s, t) => s + audienceSize(t.audiences), 0)
  const canContinue = !duplicate
  const canSend = chosen.length > 0

  function changePeriod(m: number, y: number) {
    setMonth(m); setYear(y)
    setDeadline(lastDayISO(m, y))
  }

  function toggle(id: string) {
    setPicked(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function doSend() {
    setSending(true)
    setTimeout(() => {
      const rounds: CampaignRound[] = chosen.map((t, i) => ({
        id: `r-${Date.now()}-${i}`,
        templateId: t.id,
        name: t.name,
        award: t.award,
        audiences: t.audiences,
        invited: audienceSize(t.audiences),
        responded: 0,
      }))
      onSend({
        id: `cmp-${year}-${month}`,
        month, year,
        status: 'Active',
        sentOn: firstDayISO(now.getMonth(), now.getFullYear()),
        deadline,
        rounds,
      })
    }, 900)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes snFade  { from { opacity:0 } to { opacity:1 } }
        @keyframes snModal { from { opacity:0; transform:translateY(10px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes snStep  { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
        @keyframes snSpin  { to { transform:rotate(360deg) } }
      `}</style>

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between gap-4" style={{ marginBottom: 22 }}>
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => step === 2 ? setStep(1) : onBack()}
            style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.borderColor = '#C8CCE0' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
          >
            <ArrowLeft size={17} strokeWidth={2} style={{ color: C.navy }} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold" style={{ color: C.navy }}>Send Nomination Form</h1>
            <p className="text-sm" style={{ color: C.muted, marginTop: 1 }}>
              Choose the month, then pick which awards to collect nominations for
            </p>
          </div>
        </div>
      </div>

      {/* ── Stepper ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, marginBottom: 18 }}>
        <StepCard
          n={1}
          title="Select Period"
          sub={`${MONTHS[month]} ${year}`}
          state={step === 1 ? 'active' : 'done'}
          onClick={() => setStep(1)}
        />
        <StepCard
          n={2}
          title="Add Award Rounds"
          sub={chosen.length > 0 ? `${chosen.length} template${chosen.length === 1 ? '' : 's'} selected` : 'Choose which awards to send'}
          state={step === 2 ? 'active' : 'todo'}
          onClick={() => { if (canContinue) setStep(2) }}
        />
      </div>

      {/* ══ STEP 1 ══ */}
      {step === 1 && (
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px', animation: 'snStep 0.22s ease' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Select Period</div>
          <div style={{ fontSize: 12.5, color: C.muted, marginBottom: 18 }}>
            Nominations are collected one month at a time. Pick the month this campaign is for.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, maxWidth: 720 }}>
            <Field label="Month">
              <NativeSelect value={String(month)} onChange={v => changePeriod(Number(v), year)}>
                {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </NativeSelect>
            </Field>
            <Field label="Year">
              <NativeSelect value={String(year)} onChange={v => changePeriod(month, Number(v))}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </NativeSelect>
            </Field>
            <Field label="Deadline">
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box', height: 42, padding: '0 12px', border: `1px solid ${C.border}`,
                  borderRadius: 10, fontSize: 13.5, color: C.navy, background: C.surface, outline: 'none', fontFamily: 'inherit',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
              />
            </Field>
          </div>

          {/* Duplicate guard */}
          {duplicate ? (
            <div
              className="flex items-start gap-3"
              style={{ marginTop: 20, padding: '14px 16px', borderRadius: 12, background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.25)' }}
            >
              <AlertTriangle size={18} strokeWidth={2} style={{ color: C.amber, flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#9A5B08' }}>
                  A campaign already exists for {MONTHS[month]} {year}
                </div>
                <div style={{ fontSize: 12.5, color: '#9A5B08', opacity: 0.85, marginTop: 3, lineHeight: 1.6 }}>
                  It already has {duplicate.rounds.length} award round{duplicate.rounds.length === 1 ? '' : 's'} running.
                  Pick a different month to continue.
                </div>
              </div>
            </div>
          ) : (
            <div
              className="flex items-center gap-2.5"
              style={{ marginTop: 20, padding: '12px 16px', borderRadius: 12, background: C.surface, border: `1px solid ${C.border}` }}
            >
              <CalendarDays size={16} strokeWidth={2} style={{ color: C.indigo, flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: C.navy, fontWeight: 600 }}>
                Campaign for <strong>{MONTHS[month]} {year}</strong> — nominations close {formatDate(deadline)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* ══ STEP 2 ══ */}
      {step === 2 && (
        <div style={{ animation: 'snStep 0.22s ease' }}>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px', marginBottom: 16 }}>
            <div className="flex items-start justify-between gap-4 flex-wrap" style={{ marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.navy, marginBottom: 4 }}>Add Award Rounds</div>
                <div style={{ fontSize: 12.5, color: C.muted }}>
                  Select the nomination templates to send. Each template's audience is fixed — you don't choose it.
                </div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.indigo, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 20, padding: '5px 12px', flexShrink: 0 }}>
                {chosen.length} selected
              </span>
            </div>

            {available.length === 0 ? (
              <div className="flex flex-col items-center justify-center" style={{ border: `2px dashed #D8DCEC`, borderRadius: 12, background: C.surface, padding: '40px 20px', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>No active templates</span>
                <span style={{ fontSize: 12.5, color: C.muted }}>Create one under Nomination Templates first.</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
                {available.map(t => (
                  <TemplatePickCard key={t.id} template={t} selected={picked.includes(t.id)} onToggle={() => toggle(t.id)} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Bottom action bar ── */}
      <div
        className="flex items-center justify-between gap-3 flex-wrap"
        style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 20px', marginTop: 16 }}
      >
        <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>
          {step === 1
            ? 'Step 1 of 2 — pick the month this campaign collects nominations for.'
            : chosen.length === 0
              ? 'Step 2 of 2 — select at least one award template to send.'
              : `Step 2 of 2 — ready to send ${chosen.length} form${chosen.length === 1 ? '' : 's'} to ${recipients} people.`}
        </span>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 cursor-pointer"
              style={{ height: 40, padding: '0 16px', borderRadius: 11, border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.background = C.hover }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' }}
            >
              <ArrowLeft size={15} strokeWidth={2.2} /> Back
            </button>
          )}
          <button
            onClick={onBack}
            style={{ height: 40, padding: '0 18px', borderRadius: 11, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            Cancel
          </button>
          {step === 1 ? (
            <PrimaryBtn disabled={!canContinue} onClick={() => setStep(2)}>
              Continue <ArrowRight size={16} strokeWidth={2.3} />
            </PrimaryBtn>
          ) : (
            <PrimaryBtn disabled={!canSend} onClick={() => setConfirm(true)}>
              <Send size={15} strokeWidth={2.2} /> Send Forms
            </PrimaryBtn>
          )}
        </div>
      </div>

      {/* ── Confirm modal ── */}
      {confirm && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', zIndex: 9999, padding: 20, animation: 'snFade 0.16s ease' }}
          onClick={e => { if (e.target === e.currentTarget && !sending) setConfirm(false) }}
        >
          <div style={{ background: '#fff', borderRadius: 20, padding: '30px 26px 22px', width: 420, boxShadow: '0 24px 64px rgba(10,12,28,0.20)', textAlign: 'center', animation: 'snModal 0.2s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99,102,241,0.10)', margin: '0 auto 18px' }}>
              <Send size={24} strokeWidth={1.9} style={{ color: C.indigo }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>
              Send {chosen.length} nomination form{chosen.length === 1 ? '' : 's'}?
            </div>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65, marginBottom: 24 }}>
              <strong style={{ color: C.navy }}>{recipients} people</strong> will get the {MONTHS[month]} {year} nomination
              form on their dashboard. Nominations close {formatDate(deadline)}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirm(false)}
                disabled={sending}
                className="cursor-pointer"
                style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}
              >
                Cancel
              </button>
              <button
                onClick={doSend}
                disabled={sending}
                className="inline-flex items-center justify-center gap-2"
                style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: C.indigo, color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: sending ? 'wait' : 'pointer', opacity: sending ? 0.8 : 1 }}
              >
                {sending
                  ? <><Loader2 size={16} strokeWidth={2.4} style={{ animation: 'snSpin 0.9s linear infinite' }} /> Sending…</>
                  : <><Send size={15} strokeWidth={2.2} /> Send Forms</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════
   Template pick card
══════════════════════════════════════════ */
function TemplatePickCard({ template, selected, onToggle }: { template: NominationTemplate; selected: boolean; onToggle: () => void }) {
  const th  = AWARD_THEME[template.award]
  const RIcon = th.Icon

  return (
    <button
      onClick={onToggle}
      className="flex flex-col text-left cursor-pointer"
      style={{
        padding: '16px 16px 14px', borderRadius: 14, fontFamily: 'inherit',
        border: `1px solid ${selected ? 'rgba(99,102,241,0.40)' : C.border}`,
        background: selected ? 'rgba(99,102,241,0.03)' : '#fff',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.borderColor = '#C8CCE0' }}
      onMouseLeave={e => { if (!selected) e.currentTarget.style.borderColor = C.border }}

    >
      <div className="flex items-start justify-between" style={{ marginBottom: 12, width: '100%' }}>
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, borderRadius: 11, background: th.bg, border: `1px solid ${th.border}` }}>
          <RIcon size={19} strokeWidth={1.9} style={{ color: th.color }} />
        </div>
        <span
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 22, height: 22, borderRadius: 7,
            border: `1.5px solid ${selected ? C.indigo : '#C8CCE0'}`,
            background: selected ? C.indigo : '#fff', transition: 'all 0.15s',
          }}
        >
          {selected && <Check size={14} strokeWidth={3} style={{ color: '#fff' }} />}
        </span>
      </div>

      <div style={{ fontSize: 14, fontWeight: 800, color: C.navy, lineHeight: 1.3, marginBottom: 8 }}>{template.name}</div>

      <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 10 }}>
        <AudienceChips audiences={template.audiences} compact />
        <span className="inline-flex items-center gap-1.5" style={{ fontSize: 11.5, color: C.muted, fontWeight: 600 }}>
          <ListChecks size={13} strokeWidth={2} /> {template.fields.length} questions
        </span>
      </div>

      <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, marginTop: 'auto' }}>
        Goes to {audienceSize(template.audiences)} {audienceLabel(template.audiences).toLowerCase()}
      </div>
    </button>
  )
}

/* ══════════════════════════════════════════
   Bits
══════════════════════════════════════════ */
function PrimaryBtn({ disabled, onClick, children }: { disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2"
      style={{
        height: 40, padding: '0 20px', borderRadius: 11, border: 'none', fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit',
        background: disabled ? '#E4E6EF' : C.indigo, color: disabled ? '#B0B4C8' : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = '#5B5FDE' }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = C.indigo }}
    >
      {children}
    </button>
  )
}

function StepCard({ n, title, sub, state, onClick }: {
  n: number
  title: string
  sub: string
  state: 'active' | 'done' | 'todo'
  onClick: () => void
}) {
  const active = state === 'active'
  const done   = state === 'done'
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 text-left cursor-pointer"
      style={{
        padding: '14px 16px', borderRadius: 14, fontFamily: 'inherit', width: '100%',
        border: `1px solid ${active ? 'rgba(99,102,241,0.45)' : C.border}`,
        background: active ? 'rgba(99,102,241,0.04)' : '#fff',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = '#C8CCE0' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = C.border }}
    >
      <span
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 32, height: 32, borderRadius: '50%', fontSize: 13, fontWeight: 800,
          background: active || done ? C.indigo : C.hover,
          color: active || done ? '#fff' : C.muted,
          transition: 'all 0.15s',
        }}
      >
        {done ? <Check size={16} strokeWidth={3} /> : n}
      </span>
      <div className="min-w-0">
        <div style={{ fontSize: 13.5, fontWeight: 700, color: active || done ? C.navy : C.muted }}>{title}</div>
        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>
      </div>
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  )
}

function NativeSelect({ value, onChange, children }: { value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', boxSizing: 'border-box', height: 42, paddingLeft: 12, paddingRight: 34,
          border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13.5, fontWeight: 500, color: C.navy,
          background: C.surface, outline: 'none', fontFamily: 'inherit', cursor: 'pointer',
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none', transition: 'all 0.15s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
        onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
      >
        {children}
      </select>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B0B4C8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
        style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  )
}
