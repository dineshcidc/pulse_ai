/* ─────────────────────────────────────────────────────────────────────────────
 * Probation module — shared foundation
 *
 * The single source of truth for the Probation feature across all three roles
 * (Employee → Manager → Admin). Everything on every probation screen is driven by
 * the case STATUS, whose lifecycle lives here:
 *
 *   Ongoing → Pending Manager Review → Pending Admin Decision
 *           → ( Confirmed | Terminated | Ongoing (Extended) ⟳ )
 *
 * Design note: this is a prototype. Probation and Offboarding are SEPARATE modules;
 * we only borrow Offboarding's house style, not its flow.
 * ──────────────────────────────────────────────────────────────────────────── */

import { useState } from 'react'
import type React from 'react'
import { CheckCircle2, Clock3, UserCheck, ShieldCheck, XCircle, RefreshCw, Star } from 'lucide-react'

// ─── Palette (matches the rest of the app) ──────────────────────────────────────

export const PC = {
  navy:    '#1C2035',
  label:   '#3D4266',
  muted:   '#8B90A7',
  border:  '#E4E6EF',
  surface: '#F7F8FC',
  hover:   '#F0F2F8',
  indigo:  '#6366F1',
  green:   '#10B981',
  amber:   '#F59E0B',
  red:     '#E84855',
  blue:    '#2563EB',
}

// ─── Status lifecycle ───────────────────────────────────────────────────────────

export type ProbationStatus =
  | 'Ongoing'
  | 'Pending Manager Review'
  | 'Pending Admin Decision'
  | 'Confirmed'
  | 'Terminated'
  | 'Ongoing (Extended)'

export interface StatusMeta {
  label: string
  color: string        // text / accent
  bg: string           // pill background
  border: string       // pill border
  Icon: React.ElementType
  /** Short one-liner describing what this status means, for headers/tooltips. */
  hint: string
}

export const STATUS_META: Record<ProbationStatus, StatusMeta> = {
  'Ongoing': {
    label: 'Ongoing',
    color: PC.blue, bg: 'rgba(37,99,235,0.08)', border: 'rgba(37,99,235,0.20)',
    Icon: Clock3,
    hint: 'Probation in progress — the clock is running.',
  },
  'Pending Manager Review': {
    label: 'Pending Manager Review',
    color: PC.amber, bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.22)',
    Icon: UserCheck,
    hint: 'Employee submitted self-assessment — awaiting the reporting manager.',
  },
  'Pending Admin Decision': {
    label: 'Pending Admin Decision',
    color: PC.indigo, bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.22)',
    Icon: ShieldCheck,
    hint: 'Manager submitted assessment — awaiting the final admin decision.',
  },
  'Confirmed': {
    label: 'Confirmed',
    color: PC.green, bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.22)',
    Icon: CheckCircle2,
    hint: 'Employee confirmed as permanent. ',
  },
  'Terminated': {
    label: 'Terminated',
    color: PC.red, bg: 'rgba(232,72,85,0.10)', border: 'rgba(232,72,85,0.22)',
    Icon: XCircle,
    hint: 'Employment ended at the close of probation.',
  },
  'Ongoing (Extended)': {
    label: 'Ongoing (Extended)',
    color: '#7C3AED', bg: 'rgba(124,58,237,0.10)', border: 'rgba(124,58,237,0.22)',
    Icon: RefreshCw,
    hint: 'Probation extended with a new end date — the cycle repeats.',
  },
}

// ─── Case model ─────────────────────────────────────────────────────────────────

/** Employee's self-assessment (Stage 2). */
export interface SelfAssessment {
  performance: string      // How they rate their own performance so far
  learnings: string        // Key learnings / skills gained
  challenges: string       // Challenges faced
  goalsMet: string         // Goals achieved during probation
  submittedOn?: string     // ISO date
}

/** Manager's assessment + recommendation (Stage 3). */
export type Recommendation = 'Confirm' | 'Extend' | 'Terminate'
export interface ManagerAssessment {
  rating: number           // 1–5
  competencies?: Record<string, number>  // per-competency 1–5 (keys = COMPETENCIES)
  strengths: string
  areasToImprove: string
  feedback: string
  recommendation: Recommendation
  submittedOn?: string
}

/** Admin's final decision (Stage 4). */
export type Decision = 'Confirm' | 'Extend' | 'Terminate'
export interface AdminDecision {
  decision: Decision
  reason?: string          // required for Extend / Terminate
  newEndDate?: string      // required for Extend
  decidedOn?: string
}

/** One Probation Case — the record that travels Employee → Manager → Admin. */
export interface ProbationCase {
  id: string
  // ── Seed from Stage 1 (Add Employee) ──
  empId: string
  name: string
  avatarInitials: string
  designation: string
  department: string
  reportingManager: string
  durationMonths: number
  startDate: string        // ISO
  endDate: string          // ISO
  remarks?: string
  avatarUrl?: string
  // ── Lifecycle ──
  status: ProbationStatus
  self?: SelfAssessment
  managerAssessment?: ManagerAssessment
  adminDecision?: AdminDecision
  extensionCount?: number
}

// ─── Date helpers ───────────────────────────────────────────────────────────────

export function fmtDate(iso: string): string {
  if (!iso) return '—'
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

/** Whole days from `from` (default today) until `iso`. Negative once past. */
export function daysUntil(iso: string, from: Date = new Date()): number {
  if (!iso) return 0
  const end = new Date(iso + 'T00:00:00').getTime()
  const start = new Date(from.toISOString().slice(0, 10) + 'T00:00:00').getTime()
  return Math.round((end - start) / 86_400_000)
}

/** The window (in days before end date) when the self-assessment unlocks. */
export const SELF_ASSESSMENT_WINDOW_DAYS = 15

// ─── Shared UI atoms ────────────────────────────────────────────────────────────

const fontStack = "'DM Sans', system-ui, sans-serif"

/** Status pill — the same everywhere the case status is shown. */
export function StatusPill({ status, size = 'md' }: { status: ProbationStatus; size?: 'sm' | 'md' }) {
  const m = STATUS_META[status]
  const Icon = m.Icon
  const pad = size === 'sm' ? '3px 9px' : '5px 12px'
  const fs = size === 'sm' ? 11 : 12.5
  const is = size === 'sm' ? 12 : 14
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
      padding: pad, borderRadius: 999, fontFamily: fontStack, fontSize: fs, fontWeight: 700,
      color: m.color, background: m.bg, border: `1px solid ${m.border}`,
    }}>
      <Icon size={is} strokeWidth={2.2} />
      {m.label}
    </span>
  )
}

/** Days-remaining chip — turns amber inside the self-assessment window, red once overdue. */
export function DaysRemainingChip({ endDate, from }: { endDate: string; from?: Date }) {
  const days = daysUntil(endDate, from)
  const past = days < 0
  const near = !past && days <= SELF_ASSESSMENT_WINDOW_DAYS
  const color = past ? PC.red : near ? PC.amber : PC.blue
  const bg = past ? 'rgba(232,72,85,0.08)' : near ? 'rgba(245,158,11,0.10)' : 'rgba(37,99,235,0.07)'
  const border = past ? 'rgba(232,72,85,0.20)' : near ? 'rgba(245,158,11,0.22)' : 'rgba(37,99,235,0.16)'
  const text = past
    ? `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`
    : `${days} day${days === 1 ? '' : 's'} remaining`
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px',
      borderRadius: 999, fontFamily: fontStack, fontSize: 12.5, fontWeight: 700,
      color, background: bg, border: `1px solid ${border}`,
    }}>
      <Clock3 size={14} strokeWidth={2.2} />
      {text}
    </span>
  )
}

/** Avatar — face image when available, falling back to initials on missing/broken URL. */
export function Avatar({ url, initials, size = 52 }: { url?: string; initials: string; size?: number }) {
  const [broken, setBroken] = useState(false)
  const radius = Math.round(size * 0.27)
  if (url && !broken) {
    return (
      <img
        src={url} alt={initials} onError={() => setBroken(true)}
        style={{ width: size, height: size, borderRadius: radius, objectFit: 'cover', flexShrink: 0, border: `1px solid ${PC.border}` }}
      />
    )
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: radius, flexShrink: 0,
      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: size * 0.34, fontWeight: 800, letterSpacing: '0.5px',
    }}>
      {initials}
    </div>
  )
}

/** Employee detail header — avatar, name, code, designation, department, reporting manager. */
export function EmployeeDetailHeader({
  c, right,
}: { c: ProbationCase; right?: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      background: '#fff', border: `1px solid ${PC.border}`, borderRadius: 16, padding: '18px 22px',
      fontFamily: fontStack,
    }}>
      <Avatar url={c.avatarUrl} initials={c.avatarInitials} size={52} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: PC.navy, letterSpacing: '-0.3px' }}>{c.name}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: PC.muted, background: PC.surface, border: `1px solid ${PC.border}`, padding: '2px 9px', borderRadius: 7 }}>{c.empId}</span>
        </div>
        <p style={{ margin: '5px 0 0', fontSize: 13, color: PC.muted, fontWeight: 500 }}>
          {[c.designation, c.department].filter(Boolean).join('  ·  ')}
          <span style={{ margin: '0 8px', color: '#D0D3E6' }}>|</span>
          Reporting Manager: <span style={{ color: PC.label, fontWeight: 600 }}>{c.reportingManager}</span>
        </p>
      </div>
      {right && <div style={{ flexShrink: 0 }}>{right}</div>}
    </div>
  )
}

/** A labelled read-only field block (used to render submitted assessments). */
export function ReadField({ label, value, accent = PC.muted }: { label: string; value?: string; accent?: string }) {
  return (
    <div>
      <p style={{ margin: '0 0 5px', fontSize: 11, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ margin: 0, fontSize: 13.5, color: value ? PC.navy : PC.muted, fontWeight: 500, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
        {value || '—'}
      </p>
    </div>
  )
}

/**
 * Demo phase switcher — a dummy segmented control used ONLY in the prototype so
 * BA + dev can walk every phase/status of a screen live. Not production UI.
 */
export function DemoPhaseSwitcher<T extends string>({
  options, value, onChange,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%', boxSizing: 'border-box',
      background: 'repeating-linear-gradient(45deg, rgba(99,102,241,0.035), rgba(99,102,241,0.035) 10px, rgba(99,102,241,0.06) 10px, rgba(99,102,241,0.06) 20px)',
      border: '1px dashed rgba(99,102,241,0.40)', borderRadius: 12, padding: '7px 12px',
      fontFamily: fontStack,
    }}>
      {/* Equal-width segmented buttons filling the bar */}
      <div style={{ display: 'flex', gap: 4, flex: 1, minWidth: 0, background: '#fff', border: `1px solid ${PC.border}`, borderRadius: 9, padding: 3 }}>
        {options.map(o => {
          const on = value === o.id
          return (
            <button key={o.id} onClick={() => onChange(o.id)}
              style={{
                flex: 1, minWidth: 0, padding: '8px 6px', borderRadius: 7, border: 'none', cursor: 'pointer',
                fontFamily: fontStack, fontSize: 12, fontWeight: on ? 700 : 600, whiteSpace: 'nowrap',
                background: on ? PC.indigo : 'transparent', color: on ? '#fff' : PC.muted,
                boxShadow: on ? '0 1px 4px rgba(99,102,241,0.35)' : 'none', transition: 'all 0.12s',
              }}>
              {o.label}
            </button>
          )
        })}
      </div>
      {/* Right-side prototype / demo label */}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, fontSize: 10.5, fontWeight: 800, color: PC.indigo, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: PC.indigo }} />
        Demo · Prototype
      </span>
    </div>
  )
}

// ─── Section card + stat box (shared layout atoms) ─────────────────────────────

export function SectionCard({
  icon, title, subtitle, accent = PC.indigo, right, children,
}: {
  icon: React.ReactNode; title: string; subtitle?: string; accent?: string
  right?: React.ReactNode; children: React.ReactNode
}) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${PC.border}`, borderRadius: 16, overflow: 'hidden', fontFamily: fontStack }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '15px 22px', borderBottom: `1px solid ${PC.border}`, background: PC.surface }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: `${accent}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: PC.navy }}>{title}</p>
          {subtitle && <p style={{ margin: 0, fontSize: 11.5, color: PC.muted }}>{subtitle}</p>}
        </div>
        {right}
      </div>
      <div style={{ padding: 22 }}>{children}</div>
    </div>
  )
}

export function StatBox({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div style={{ background: PC.surface, border: `1px solid ${PC.border}`, borderRadius: 12, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: `${accent}16`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <span style={{ fontSize: 11, fontWeight: 700, color: PC.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
      </div>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: PC.navy, letterSpacing: '-0.3px' }}>{value}</p>
    </div>
  )
}

// ─── Self-assessment questions + one-card-per-question renderer ─────────────────

/** The four employee self-assessment questions — the single source every screen renders from. */
export const SELF_ASSESSMENT_QUESTIONS: { key: keyof SelfAssessment; label: string; placeholder: string }[] = [
  { key: 'performance', label: 'How would you rate your overall performance during probation?', placeholder: 'Summarise your performance, ownership, and impact so far…' },
  { key: 'learnings',   label: 'Key learnings & skills gained', placeholder: 'What did you learn or improve at during this period?' },
  { key: 'challenges',  label: 'Challenges faced', placeholder: 'What was difficult, and how did you handle it?' },
  { key: 'goalsMet',    label: 'Goals achieved', placeholder: 'Which goals or deliverables did you complete?' },
]

/**
 * One question = one card. Editable when `onChange` is provided, read-only (filled)
 * otherwise — same card either way, so every screen shares one UI.
 */
export function QuestionCard({
  index, label, placeholder, value, onChange, readOnly,
}: {
  index: number; label: string; placeholder: string
  value: string; onChange?: (v: string) => void; readOnly?: boolean
}) {
  const [focus, setFocus] = useState(false)
  const badgeBg = readOnly ? PC.hover : `${PC.indigo}16`
  const badgeColor = readOnly ? PC.muted : PC.indigo
  return (
    <div style={{ background: '#fff', border: `1px solid ${PC.border}`, borderRadius: 14, padding: '16px 20px', fontFamily: fontStack }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 12 }}>
        <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, background: badgeBg, color: badgeColor, fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{index}</div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: PC.navy }}>
          {label}{!readOnly && <span style={{ color: PC.red, marginLeft: 3 }}>*</span>}
        </p>
      </div>
      {readOnly ? (
        <p style={{ margin: 0, paddingLeft: 35, fontSize: 13.5, color: value ? PC.navy : PC.muted, fontWeight: 500, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
          {value || '—'}
        </p>
      ) : (
        <textarea
          value={value} rows={3} placeholder={placeholder}
          onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10,
            fontFamily: fontStack, fontSize: 13.5, fontWeight: 500, color: PC.navy, lineHeight: 1.6,
            border: `1px solid ${focus ? PC.indigo : PC.border}`, background: value ? PC.surface : '#fff',
            resize: 'vertical', outline: 'none',
            boxShadow: focus ? '0 0 0 3px rgba(99,102,241,0.10)' : 'none', transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        />
      )}
    </div>
  )
}

// ─── Manager's assessment form (shared: Manager edits · Admin views filled) ─────

/** The four competencies the manager star-rates. Shared vocabulary. */
export const COMPETENCIES = ['Technical Skills', 'Communication', 'Ownership & Reliability', 'Team Collaboration'] as const

/** The three recommendation / decision options + their look. */
export const RECOMMENDATIONS: { id: Recommendation; label: string; hint: string; color: string; Icon: React.ElementType }[] = [
  { id: 'Confirm',   label: 'Confirm',   hint: 'Make permanent',   color: PC.green,  Icon: CheckCircle2 },
  { id: 'Extend',    label: 'Extend',    hint: 'More time needed',  color: '#7C3AED', Icon: RefreshCw },
  { id: 'Terminate', label: 'Terminate', hint: 'End employment',    color: PC.red,    Icon: XCircle },
]

/** The full value the manager form edits / the admin views. */
export interface ManagerAssessmentFormValue {
  rating: number
  competencies: Record<string, number>
  strengths: string
  areasToImprove: string
  feedback: string
  recommendation: Recommendation | null
}

/** Star rating — interactive when `onChange` is given, static when `readOnly`. */
export function StarRating({ value, onChange, size = 26, readOnly }: { value: number; onChange?: (v: number) => void; size?: number; readOnly?: boolean }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(n => {
        const on = (hover || value) >= n
        return (
          <button
            key={n} type="button" disabled={readOnly}
            onClick={() => onChange?.(n)}
            onMouseEnter={() => !readOnly && setHover(n)} onMouseLeave={() => !readOnly && setHover(0)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: readOnly ? 'default' : 'pointer', lineHeight: 0 }}
          >
            <Star size={size} strokeWidth={1.8} color={on ? PC.amber : '#CDD0DC'} fill={on ? PC.amber : 'none'} style={{ transition: 'all 0.1s' }} />
          </button>
        )
      })}
    </div>
  )
}

/** Labelled textarea used inside the manager form. */
function AssessmentTextArea({ label, placeholder, value, onChange, readOnly }: { label: string; placeholder: string; value: string; onChange?: (v: string) => void; readOnly?: boolean }) {
  const [focus, setFocus] = useState(false)
  return (
    <div>
      <p style={{ margin: '0 0 7px', fontSize: 12.5, fontWeight: 600, color: PC.label }}>{label}{!readOnly && <span style={{ color: PC.red, marginLeft: 3 }}>*</span>}</p>
      <textarea
        value={value} rows={3} placeholder={placeholder} readOnly={readOnly}
        onChange={e => onChange?.(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 10,
          fontFamily: fontStack, fontSize: 13.5, fontWeight: 500, color: PC.navy, lineHeight: 1.6,
          border: `1px solid ${focus ? PC.indigo : PC.border}`, background: value ? PC.surface : '#fff',
          resize: 'vertical', outline: 'none',
          boxShadow: focus ? '0 0 0 3px rgba(99,102,241,0.10)' : 'none', transition: 'all 0.15s',
        }}
      />
    </div>
  )
}

/**
 * The manager's assessment form body — overall rating, competency ratings, the
 * three text fields, and the recommendation picker. The SAME layout is used by the
 * manager (editable) and the admin (read-only / filled), so they never drift.
 */
export function ManagerAssessmentForm({
  value, onChange, readOnly,
}: {
  value: ManagerAssessmentFormValue
  onChange?: (patch: Partial<ManagerAssessmentFormValue>) => void
  readOnly?: boolean
}) {
  return (
    <fieldset disabled={readOnly} style={{ border: 'none', margin: 0, padding: 0 }}>
      {/* Overall rating */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', padding: '4px 0 18px', borderBottom: `1px solid ${PC.border}`, marginBottom: 18 }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: PC.navy }}>Overall Rating {!readOnly && <span style={{ color: PC.red }}>*</span>}</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: PC.muted }}>Overall impression of the employee's probation</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StarRating value={value.rating} onChange={v => onChange?.({ rating: v })} readOnly={readOnly} />
          <span style={{ fontSize: 13, fontWeight: 700, color: PC.amber, minWidth: 34 }}>{value.rating || '—'}/5</span>
        </div>
      </div>

      {/* Competency ratings */}
      <p style={{ margin: '0 0 12px', fontSize: 11.5, fontWeight: 700, color: PC.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Competency Ratings</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 20px', marginBottom: 20 }}>
        {COMPETENCIES.map(name => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '11px 14px', background: PC.surface, border: `1px solid ${PC.border}`, borderRadius: 10 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: PC.label }}>{name}</span>
            <StarRating size={18} value={value.competencies[name] ?? 0} onChange={v => onChange?.({ competencies: { ...value.competencies, [name]: v } })} readOnly={readOnly} />
          </div>
        ))}
      </div>

      {/* Text fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
        <AssessmentTextArea label="Strengths" placeholder="What has this employee done well?" value={value.strengths} onChange={v => onChange?.({ strengths: v })} readOnly={readOnly} />
        <AssessmentTextArea label="Areas to Improve" placeholder="Where should they focus going forward?" value={value.areasToImprove} onChange={v => onChange?.({ areasToImprove: v })} readOnly={readOnly} />
        <AssessmentTextArea label="Overall Feedback" placeholder="Summary comments to support your recommendation…" value={value.feedback} onChange={v => onChange?.({ feedback: v })} readOnly={readOnly} />
      </div>

      {/* Recommendation */}
      <p style={{ margin: '0 0 10px', fontSize: 12.5, fontWeight: 600, color: PC.label }}>Recommendation {!readOnly && <span style={{ color: PC.red }}>*</span>}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {RECOMMENDATIONS.map(r => {
          const active = value.recommendation === r.id
          const Icon = r.Icon
          return (
            <button
              key={r.id} type="button" onClick={() => onChange?.({ recommendation: r.id })}
              style={{
                display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', borderRadius: 12, cursor: readOnly ? 'default' : 'pointer',
                background: active ? `${r.color}12` : '#fff', border: `1.5px solid ${active ? r.color : PC.border}`,
                textAlign: 'left', fontFamily: fontStack, transition: 'all 0.14s',
              }}
            >
              <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: active ? r.color : `${r.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={17} color={active ? '#fff' : r.color} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: active ? r.color : PC.navy }}>{r.label}</p>
                <p style={{ margin: '1px 0 0', fontSize: 11.5, color: PC.muted }}>{r.hint}</p>
              </div>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

// ─── Mock cases (prototype data) ────────────────────────────────────────────────

/**
 * Employee-side mock — a single case belonging to "the logged-in employee".
 * `endDate` is intentionally set so the self-assessment window is relevant for the demo.
 */
export const MOCK_MY_CASE: ProbationCase = {
  id: 'PRB-1042',
  empId: 'EMP-4821',
  name: 'John Doe',
  avatarInitials: 'JD',
  avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
  designation: 'Software Engineer',
  department: 'Engineering',
  reportingManager: 'Rahul Verma',
  durationMonths: 6,
  startDate: '2026-02-10',
  endDate: '2026-08-10',
  remarks: 'Standard 6-month probation for new engineering hires.',
  status: 'Ongoing',
}

/** Manager-side mock — several reportees at different stages. */
export const MOCK_TEAM_CASES: ProbationCase[] = [
  {
    id: 'PRB-1042', empId: 'EMP-4821', name: 'John Doe', avatarInitials: 'JD',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    designation: 'Software Engineer', department: 'Engineering', reportingManager: 'Rahul Verma',
    durationMonths: 6, startDate: '2026-02-10', endDate: '2026-08-10', status: 'Pending Manager Review',
    self: {
      performance: 'I have consistently delivered my sprint commitments and improved my code-review turnaround.',
      learnings: 'Deepened my React and TypeScript skills; learned our CI/CD pipeline end to end.',
      challenges: 'Ramping up on the legacy billing service took longer than expected.',
      goalsMet: 'Shipped the notifications module and cut its p95 latency by 30%.',
      submittedOn: '2026-07-28',
    },
  },
  {
    id: 'PRB-1050', empId: 'EMP-4834', name: 'Karan Mehta', avatarInitials: 'KM',
    avatarUrl: 'https://randomuser.me/api/portraits/men/45.jpg',
    designation: 'QA Engineer', department: 'Engineering', reportingManager: 'Rahul Verma',
    durationMonths: 3, startDate: '2026-05-15', endDate: '2026-08-15', status: 'Ongoing',
  },
  {
    id: 'PRB-1061', empId: 'EMP-4850', name: 'Priya Nair', avatarInitials: 'PN',
    avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    designation: 'Product Designer', department: 'Design', reportingManager: 'Rahul Verma',
    durationMonths: 6, startDate: '2026-01-20', endDate: '2026-07-20', status: 'Pending Admin Decision',
    self: {
      performance: 'Owned the design system refresh and contributed across three product areas.',
      learnings: 'Grew in cross-functional facilitation and design-ops tooling.',
      challenges: 'Balancing BAU design requests with the system refresh.',
      goalsMet: 'Delivered the refreshed component library adopted by all squads.',
      submittedOn: '2026-07-05',
    },
    managerAssessment: {
      rating: 5,
      competencies: { 'Technical Skills': 5, 'Communication': 5, 'Ownership & Reliability': 5, 'Team Collaboration': 4 },
      strengths: 'Exceptional ownership and craft; strong collaborator.',
      areasToImprove: 'Could delegate more of the smaller requests.',
      feedback: 'A clear asset to the team — ready for confirmation.',
      recommendation: 'Confirm', submittedOn: '2026-07-10',
    },
  },
  {
    id: 'PRB-1073', empId: 'EMP-4862', name: 'Aisha Khan', avatarInitials: 'AK',
    avatarUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    designation: 'Backend Engineer', department: 'Engineering', reportingManager: 'Rahul Verma',
    durationMonths: 6, startDate: '2026-02-18', endDate: '2026-08-18', status: 'Pending Manager Review',
    self: {
      performance: 'Took ownership of the payments service and kept our on-call incidents low.',
      learnings: 'Grew a lot in distributed systems and database performance tuning.',
      challenges: 'Coordinating releases across three dependent teams.',
      goalsMet: 'Migrated the payments DB with zero downtime and added full test coverage.',
      submittedOn: '2026-08-01',
    },
  },
  {
    id: 'PRB-1084', empId: 'EMP-4877', name: 'Rohan Das', avatarInitials: 'RD',
    avatarUrl: 'https://randomuser.me/api/portraits/men/51.jpg',
    designation: 'Data Analyst', department: 'Analytics', reportingManager: 'Rahul Verma',
    durationMonths: 3, startDate: '2026-06-05', endDate: '2026-09-05', status: 'Ongoing',
  },
  {
    id: 'PRB-1090', empId: 'EMP-4888', name: 'Daniel Lee', avatarInitials: 'DL',
    avatarUrl: 'https://randomuser.me/api/portraits/men/76.jpg',
    designation: 'Frontend Engineer', department: 'Engineering', reportingManager: 'Rahul Verma',
    durationMonths: 6, startDate: '2025-12-15', endDate: '2026-06-15', status: 'Confirmed',
    self: {
      performance: 'Delivered the customer dashboard revamp and mentored two interns.',
      learnings: 'Levelled up on accessibility and design-system contribution.',
      challenges: 'Balancing feature work with tech-debt cleanup.',
      goalsMet: 'Shipped the revamp on time and improved Lighthouse scores across the board.',
      submittedOn: '2026-06-02',
    },
    managerAssessment: {
      rating: 4,
      competencies: { 'Technical Skills': 4, 'Communication': 4, 'Ownership & Reliability': 5, 'Team Collaboration': 4 },
      strengths: 'Reliable, high-quality delivery and a great mentor.',
      areasToImprove: 'Could be more vocal in planning discussions.',
      feedback: 'Strong performer — recommend confirmation.',
      recommendation: 'Confirm', submittedOn: '2026-06-06',
    },
    adminDecision: { decision: 'Confirm', decidedOn: '2026-06-11' },
  },
]

/** Admin-side mock — ALL cases across the org, spanning every status. */
export const MOCK_ALL_CASES: ProbationCase[] = [
  ...MOCK_TEAM_CASES,
  {
    id: 'PRB-1102', empId: 'EMP-4901', name: 'Sofia Martinez', avatarInitials: 'SM',
    avatarUrl: 'https://randomuser.me/api/portraits/women/23.jpg',
    designation: 'Marketing Executive', department: 'Marketing', reportingManager: 'Anjali Desai',
    durationMonths: 6, startDate: '2026-01-25', endDate: '2026-07-25', status: 'Pending Admin Decision',
    self: {
      performance: 'Led two campaign launches and grew our webinar pipeline steadily.',
      learnings: 'Marketing automation, funnel analytics, and content ops.',
      challenges: 'Attribution across paid and organic channels.',
      goalsMet: 'Delivered the Q2 campaign calendar and a 20% lift in MQLs.',
      submittedOn: '2026-07-12',
    },
    managerAssessment: {
      rating: 4,
      competencies: { 'Technical Skills': 4, 'Communication': 5, 'Ownership & Reliability': 4, 'Team Collaboration': 4 },
      strengths: 'Creative, data-aware, and a dependable owner of deliverables.',
      areasToImprove: 'Tighten reporting cadence to stakeholders.',
      feedback: 'Strong first six months — recommend confirmation.',
      recommendation: 'Confirm', submittedOn: '2026-07-16',
    },
  },
  {
    id: 'PRB-1115', empId: 'EMP-4918', name: 'Tariq Hassan', avatarInitials: 'TH',
    avatarUrl: 'https://randomuser.me/api/portraits/men/64.jpg',
    designation: 'Support Engineer', department: 'Customer Success', reportingManager: 'Anjali Desai',
    durationMonths: 3, startDate: '2026-04-20', endDate: '2026-07-20', status: 'Pending Admin Decision',
    self: {
      performance: 'Resolved tickets within SLA and picked up product knowledge quickly.',
      learnings: 'Our support stack, escalation paths, and troubleshooting playbooks.',
      challenges: 'Handling peak-volume days without a full runbook.',
      goalsMet: 'Maintained a 92% CSAT across my queue.',
      submittedOn: '2026-07-08',
    },
    managerAssessment: {
      rating: 3,
      competencies: { 'Technical Skills': 3, 'Communication': 4, 'Ownership & Reliability': 3, 'Team Collaboration': 3 },
      strengths: 'Patient with customers and eager to learn.',
      areasToImprove: 'Needs more consistency on complex, multi-team escalations.',
      feedback: 'Promising but would benefit from a short extension to prove independence.',
      recommendation: 'Extend', submittedOn: '2026-07-14',
    },
  },
  {
    id: 'PRB-0991', empId: 'EMP-4712', name: 'Vikram Rao', avatarInitials: 'VR',
    designation: 'Sales Executive', department: 'Sales', reportingManager: 'Meera Iyer',
    durationMonths: 6, startDate: '2025-12-01', endDate: '2026-06-01', status: 'Confirmed',
    self: {
      performance: 'Exceeded quota in two of my first three quarters.',
      learnings: 'Mastered the CRM and our enterprise sales motion.',
      challenges: 'Long enterprise sales cycles.', goalsMet: 'Closed 4 enterprise logos.',
      submittedOn: '2026-05-18',
    },
    managerAssessment: {
      rating: 4,
      competencies: { 'Technical Skills': 4, 'Communication': 5, 'Ownership & Reliability': 4, 'Team Collaboration': 4 },
      strengths: 'Strong closer, great rapport with clients.',
      areasToImprove: 'Pipeline hygiene in the CRM.', feedback: 'Recommend confirmation.',
      recommendation: 'Confirm', submittedOn: '2026-05-22',
    },
    adminDecision: { decision: 'Confirm', decidedOn: '2026-05-28' },
  },
  {
    id: 'PRB-0975', empId: 'EMP-4699', name: 'Neha Kapoor', avatarInitials: 'NK',
    designation: 'HR Associate', department: 'Human Resources', reportingManager: 'Sanjay Gupta',
    durationMonths: 6, startDate: '2025-11-10', endDate: '2026-05-10', status: 'Ongoing (Extended)',
    extensionCount: 1,
    self: {
      performance: 'Steady contributor; still building confidence on policy work.',
      learnings: 'HRMS tooling and onboarding operations.', challenges: 'Handling escalations independently.',
      goalsMet: 'Ran two onboarding cohorts.', submittedOn: '2026-04-25',
    },
    managerAssessment: {
      rating: 3,
      competencies: { 'Technical Skills': 3, 'Communication': 3, 'Ownership & Reliability': 3, 'Team Collaboration': 4 },
      strengths: 'Reliable and empathetic.', areasToImprove: 'Needs more autonomy on escalations.',
      feedback: 'Promising but would benefit from more runway.', recommendation: 'Extend', submittedOn: '2026-04-30',
    },
    adminDecision: { decision: 'Extend', reason: 'Needs additional time to demonstrate independent handling of escalations.', newEndDate: '2026-08-10', decidedOn: '2026-05-05' },
  },
]
