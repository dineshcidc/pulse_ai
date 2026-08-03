import { useState } from 'react'
import {
  CalendarDays, Clock, TrendingUp,
  Save, Check, Info, ChevronDown,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
interface TimesheetPolicy {
  eodDeadlineTime:         string
  nextDayGraceTime:        string
  stdHoursPerDay:          number
  minHoursPerDay:          number
  maxHoursPerDay:          number
  overtimeThresholdDay:    number
  overtimeThresholdWeek:   number
  autoFlagOvertime:        boolean
  weekendLogging:          boolean
  holidayLogging:          boolean
  allowLateWithReason:     boolean
  requireProjectCode:      boolean
  allowGeneralHours:       boolean
}

const DEFAULT: TimesheetPolicy = {
  eodDeadlineTime:         '23:00',
  nextDayGraceTime:        '10:00',
  stdHoursPerDay:          8,
  minHoursPerDay:          8,
  maxHoursPerDay:          14,
  overtimeThresholdDay:    9,
  overtimeThresholdWeek:   45,
  autoFlagOvertime:        true,
  weekendLogging:          false,
  holidayLogging:          false,
  allowLateWithReason:     true,
  requireProjectCode:      true,
  allowGeneralHours:       true,
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', surface: '#F7F8FC' }

const EOD_TIMES = ['15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '23:00']
const EOD_LBL: Record<string, string> = {
  '15:00': '3:00 PM', '16:00': '4:00 PM', '17:00': '5:00 PM',
  '18:00': '6:00 PM', '19:00': '7:00 PM', '20:00': '8:00 PM', '23:00': '11:00 PM',
}
const GRACE_TIMES = ['08:00', '09:00', '10:00', '11:00', '12:00']
const GRACE_LBL: Record<string, string> = {
  '08:00': '8:00 AM', '09:00': '9:00 AM', '10:00': '10:00 AM',
  '11:00': '11:00 AM', '12:00': '12:00 PM',
}

// ── Shared components ──────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{ width: 40, height: 22, borderRadius: 11, border: `1px solid ${checked ? '#818CF8' : '#D1D5DB'}`, cursor: 'pointer', background: checked ? '#A5B4FC' : '#F3F4F6', position: 'relative', transition: 'background 0.2s, border-color 0.2s', flexShrink: 0 }}>
      <span style={{ position: 'absolute', top: 2, left: checked ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.18s', display: 'block', boxShadow: checked ? '0 1px 4px rgba(99,102,241,0.30)' : '0 1px 3px rgba(0,0,0,0.12)' }} />
    </button>
  )
}

function NumInput({ value, onChange, min, max, unit, placeholder }: {
  value: number; onChange: (v: number) => void; min: number; max: number; unit?: string; placeholder?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <input
        type="number" min={min} max={max} value={value}
        placeholder={placeholder}
        onChange={e => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))}
        style={{ width: 64, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', textAlign: 'center', fontSize: 14, fontWeight: 700, color: C.navy, outline: 'none', fontFamily: 'inherit' }}
      />
      {unit && <span style={{ fontSize: 12.5, color: C.muted, whiteSpace: 'nowrap' }}>{unit}</span>}
    </div>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <span style={{ padding: '4px 10px', borderRadius: 99, background: '#EEF0F8', color: C.muted, fontSize: 11.5, fontWeight: 600, whiteSpace: 'nowrap' }}>
      {label}
    </span>
  )
}

function PolicyRow({ label, hint, last = false, children }: {
  label: string; hint?: string; last?: boolean; children: React.ReactNode
}) {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, padding: '18px 28px' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{label}</div>
          {hint && <div style={{ fontSize: 12, color: C.muted, marginTop: 3, lineHeight: 1.5 }}>{hint}</div>}
        </div>
        <div style={{ flexShrink: 0 }}>{children}</div>
      </div>
      {!last && <div style={{ height: 1, background: '#F2F3F8', marginLeft: 28, marginRight: 28 }} />}
    </>
  )
}

interface AccordionSectionProps {
  icon: React.ElementType
  title: string
  sub: string
  accent: string
  accentBg: string
  isOpen: boolean
  onToggle: () => void
  chips?: React.ReactNode
  children: React.ReactNode
}

function AccordionSection({ icon: Icon, title, sub, accent, accentBg, isOpen, onToggle, chips, children }: AccordionSectionProps) {
  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      overflow: 'hidden',
      transition: 'border-color 0.22s ease',
    }}>

      {/* Header */}
      <button
        onClick={onToggle}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', background: isOpen ? accentBg : '#fff', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.18s', fontFamily: 'inherit' }}
        onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = C.surface }}
        onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = '#fff' }}
      >
        {/* Icon */}
        <div style={{ width: 42, height: 42, borderRadius: 12, background: isOpen ? `${accent}18` : '#F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.18s' }}>
          <Icon size={18} strokeWidth={1.9} style={{ color: isOpen ? accent : C.muted }} />
        </div>

        {/* Title + sub */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: C.navy, letterSpacing: '-0.1px' }}>{title}</div>
          <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{sub}</div>
        </div>

        {/* Chips — visible only when collapsed */}
        {!isOpen && chips && (
          <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginRight: 14 }}>
            {chips}
          </div>
        )}

        {/* Chevron */}
        <div style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.22s ease', flexShrink: 0 }}>
          <ChevronDown size={18} strokeWidth={2} style={{ color: isOpen ? accent : C.muted, display: 'block' }} />
        </div>
      </button>

      {/* Expandable body */}
      <div style={{ maxHeight: isOpen ? 1200 : 0, overflow: 'hidden', transition: 'max-height 0.32s ease' }}>
        <div style={{ height: 1, background: `${accent}20` }} />
        {children}
        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function TimesheetPoliciesPage() {
  const [policy,      setPolicy]      = useState<TimesheetPolicy>(DEFAULT)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [hasChanges,  setHasChanges]  = useState(false)
  const [open, setOpen] = useState<Set<string>>(new Set(['submission']))

  function set<K extends keyof TimesheetPolicy>(key: K, value: TimesheetPolicy[K]) {
    setPolicy(p => ({ ...p, [key]: value }))
    setSaveSuccess(false)
    setHasChanges(true)
  }

  function toggle(id: string) {
    setOpen(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleSave() {
    setSaveLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaveLoading(false)
    setSaveSuccess(true)
    setHasChanges(false)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes tpSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px', margin: '0 0 4px' }}>
            Timesheet Policies
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500, margin: 0 }}>
            Configure submission rules, hour limits and overtime tracking for the organisation
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button onClick={handleSave} disabled={saveLoading || !hasChanges}
            style={{ height: 40, padding: '0 20px', borderRadius: 10, border: 'none', fontSize: 13.5, fontWeight: 700, cursor: (!hasChanges || saveLoading) ? 'not-allowed' : 'pointer', background: saveSuccess ? '#0EA86A' : (!hasChanges || saveLoading) ? '#E8EAF2' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: (!hasChanges || saveLoading) ? '#B0B4C8' : '#fff', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit', transition: 'background 0.2s' }}
            onMouseEnter={e => { if (hasChanges && !saveLoading) e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
            {saveLoading
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'tpSpin 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              : saveSuccess ? <Check size={14} strokeWidth={2.5} /> : <Save size={14} strokeWidth={2} />}
            {saveLoading ? 'Saving…' : saveSuccess ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Accordion sections ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* 1. Submission Schedule */}
        <AccordionSection
          icon={CalendarDays}
          title="Submission Schedule"
          sub="Daily EOD deadline with a next-morning grace window"
          accent="#6366F1"
          accentBg="rgba(99,102,241,0.05)"
          isOpen={open.has('submission')}
          onToggle={() => toggle('submission')}
          chips={
            <>
              <Chip label={`EOD ${EOD_LBL[policy.eodDeadlineTime]}`} />
              <Chip label={`Grace ${GRACE_LBL[policy.nextDayGraceTime]}`} />
            </>
          }
        >
          <div style={{ margin: '16px 28px 4px', padding: '12px 16px', borderRadius: 10, background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.14)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Info size={13} strokeWidth={2} style={{ color: '#6366F1', flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12.5, color: '#4F46E5', fontWeight: 500, lineHeight: 1.55 }}>
              Timesheets are submitted <strong>daily</strong> — employees log hours each day before EOD, with a grace window until the next morning.
            </span>
          </div>

          <PolicyRow label="Same-day EOD Deadline" hint="Employees should submit by this time each working day">
            <select value={policy.eodDeadlineTime} onChange={e => set('eodDeadlineTime', e.target.value)}
              style={{ height: 36, padding: '0 10px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 13, color: C.navy, outline: 'none', fontFamily: 'inherit', cursor: 'pointer', minWidth: 120 }}>
              {EOD_TIMES.map(t => <option key={t} value={t}>{EOD_LBL[t]}</option>)}
            </select>
          </PolicyRow>

          <PolicyRow label="Next-day Grace Deadline" hint="Maximum late submission — timesheets become overdue after this" last>
            <select value={policy.nextDayGraceTime} onChange={e => set('nextDayGraceTime', e.target.value)}
              style={{ height: 36, padding: '0 10px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 13, color: C.navy, outline: 'none', fontFamily: 'inherit', cursor: 'pointer', minWidth: 120 }}>
              {GRACE_TIMES.map(t => <option key={t} value={t}>{GRACE_LBL[t]}</option>)}
            </select>
          </PolicyRow>
        </AccordionSection>

        {/* 2. Working Hour Limits */}
        <AccordionSection
          icon={Clock}
          title="Working Hour Limits"
          sub="Standard, minimum and maximum hours per active working day"
          accent="#0EA86A"
          accentBg="rgba(14,168,106,0.05)"
          isOpen={open.has('hours')}
          onToggle={() => toggle('hours')}
          chips={
            <>
              <Chip label={`${policy.stdHoursPerDay} hrs / day`} />
              <Chip label={`Min ${policy.minHoursPerDay} hrs`} />
              <Chip label={`Max ${policy.maxHoursPerDay} hrs`} />
            </>
          }
        >
          <PolicyRow label="Standard Hours / Day" hint="Expected hours for a full working day">
            <NumInput value={policy.stdHoursPerDay} onChange={v => set('stdHoursPerDay', v)} min={1} max={24} unit="hrs" />
          </PolicyRow>

          <PolicyRow label="Minimum Hours to Log" hint="Least hours that must be logged per active day">
            <NumInput value={policy.minHoursPerDay} onChange={v => set('minHoursPerDay', v)} min={0} max={policy.maxHoursPerDay} unit="hrs" placeholder="8" />
          </PolicyRow>

          <PolicyRow label="Maximum Hours to Log" hint="Maximum hours allowed per active working day" last>
            <NumInput value={policy.maxHoursPerDay} onChange={v => set('maxHoursPerDay', v)} min={policy.stdHoursPerDay} max={24} unit="hrs" placeholder="14" />
          </PolicyRow>
        </AccordionSection>

        {/* 3. Overtime Rules */}
        <AccordionSection
          icon={TrendingUp}
          title="Overtime Rules"
          sub="Weekend and holiday logging controls"
          accent="#D97706"
          accentBg="rgba(217,119,6,0.05)"
          isOpen={open.has('overtime')}
          onToggle={() => toggle('overtime')}
          chips={
            <Chip label={policy.weekendLogging ? 'Weekend logging on' : 'Weekend logging off'} />
          }
        >
          <PolicyRow label="Allow Weekend Logging" hint="Employees can log hours on Saturday and Sunday">
            <Toggle checked={policy.weekendLogging} onChange={v => set('weekendLogging', v)} />
          </PolicyRow>

          <PolicyRow label="Allow Holiday Logging" hint="Employees can log hours on public holidays" last>
            <Toggle checked={policy.holidayLogging} onChange={v => set('holidayLogging', v)} />
          </PolicyRow>
        </AccordionSection>

      </div>
    </div>
  )
}
