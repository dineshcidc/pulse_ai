import { useState } from 'react'
import {
  CalendarDays, Clock, TrendingUp, Shield, AlertCircle,
  FolderOpen, Save, RotateCcw, Check, Info,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
interface TimesheetPolicy {
  // Submission (daily cycle)
  eodDeadlineTime:         string   // same-day deadline e.g. '18:00'
  nextDayGraceTime:        string   // next-morning max  e.g. '10:00'
  backdatedDays:           number

  // Hour limits
  stdHoursPerDay:          number
  minHoursPerDay:          number
  maxHoursPerDay:          number
  maxHoursPerWeek:         number

  // Overtime
  overtimeThresholdDay:    number
  overtimeThresholdWeek:   number
  autoFlagOvertime:        boolean
  weekendLogging:          boolean
  holidayLogging:          boolean

  // Approval
  managerApproval:         boolean
  pmApproval:              boolean
  autoApproveDays:         number   // 0 = disabled
  reminderDays:            number

  // Late submission
  autoRejectAfterGrace:    boolean
  allowLateWithReason:     boolean
  lockAfterDays:           number

  // Project allocation
  requireProjectCode:      boolean
  allowGeneralHours:       boolean
  minProjectAllocationPct: number
}

const DEFAULT: TimesheetPolicy = {
  eodDeadlineTime:         '23:00',
  nextDayGraceTime:        '10:00',
  backdatedDays:           2,
  stdHoursPerDay:          8,
  minHoursPerDay:          1,
  maxHoursPerDay:          12,
  maxHoursPerWeek:         50,
  overtimeThresholdDay:    9,
  overtimeThresholdWeek:   45,
  autoFlagOvertime:        true,
  weekendLogging:          false,
  holidayLogging:          false,
  managerApproval:         true,
  pmApproval:              false,
  autoApproveDays:         3,
  reminderDays:            1,
  autoRejectAfterGrace:    false,
  allowLateWithReason:     true,
  lockAfterDays:           14,
  requireProjectCode:      true,
  allowGeneralHours:       true,
  minProjectAllocationPct: 80,
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

// ── Shared sub-components ──────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled = false }: {
  checked: boolean; onChange: (v: boolean) => void; disabled?: boolean
}) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      style={{ width: 40, height: 22, borderRadius: 11, border: `1px solid ${checked ? '#818CF8' : '#D1D5DB'}`, cursor: disabled ? 'not-allowed' : 'pointer', background: checked ? '#A5B4FC' : '#F3F4F6', position: 'relative', transition: 'background 0.2s, border-color 0.2s', flexShrink: 0, opacity: disabled ? 0.4 : 1 }}>
      <span style={{ position: 'absolute', top: 2, left: checked ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.18s', display: 'block', boxShadow: checked ? '0 1px 4px rgba(99,102,241,0.30)' : '0 1px 3px rgba(0,0,0,0.12)' }} />
    </button>
  )
}

function NumInput({ value, onChange, min, max, unit }: {
  value: number; onChange: (v: number) => void; min: number; max: number; unit?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <input
        type="number" min={min} max={max} value={value}
        onChange={e => onChange(Math.min(max, Math.max(min, parseInt(e.target.value) || min)))}
        style={{ width: 64, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', textAlign: 'center', fontSize: 14, fontWeight: 700, color: C.navy, outline: 'none', fontFamily: 'inherit' }}
      />
      {unit && <span style={{ fontSize: 12.5, color: C.muted, whiteSpace: 'nowrap' }}>{unit}</span>}
    </div>
  )
}

function PolicyCard({ icon: Icon, title, sub, accent, accentBg, children }: {
  icon: React.ElementType; title: string; sub: string
  accent: string; accentBg: string; children: React.ReactNode
}) {
  return (
    <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 22px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={16} strokeWidth={1.9} style={{ color: accent }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{title}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{sub}</div>
        </div>
      </div>
      <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 26 }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{label}</div>
        {hint && <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>{hint}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function TimesheetPoliciesPage() {
  const [policy,      setPolicy]      = useState<TimesheetPolicy>(DEFAULT)
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [hasChanges,  setHasChanges]  = useState(false)

  function set<K extends keyof TimesheetPolicy>(key: K, value: TimesheetPolicy[K]) {
    setPolicy(p => ({ ...p, [key]: value }))
    setSaveSuccess(false)
    setHasChanges(true)
  }

  async function handleSave() {
    setSaveLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaveLoading(false)
    setSaveSuccess(true)
    setHasChanges(false)
  }

  function handleReset() {
    setPolicy(DEFAULT)
    setHasChanges(false)
    setSaveSuccess(false)
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes tpSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px', margin: '0 0 4px' }}>
            Timesheet Policies
          </h1>
          <p style={{ fontSize: 13.5, color: C.muted, margin: 0 }}>
            Configure daily submission rules, hour limits and approval workflows for the organisation
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button onClick={handleReset}
            style={{ height: 40, padding: '0 16px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
            <RotateCcw size={13} strokeWidth={2} /> Reset
          </button>
          <button onClick={handleSave} disabled={saveLoading || !hasChanges}
            style={{ height: 40, padding: '0 20px', borderRadius: 10, border: 'none', fontSize: 13.5, fontWeight: 700, cursor: (!hasChanges || saveLoading) ? 'not-allowed' : 'pointer', background: saveSuccess ? '#0EA86A' : (!hasChanges || saveLoading) ? '#E8EAF2' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: (!hasChanges || saveLoading) ? '#B0B4C8' : '#fff', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit', transition: 'background 0.2s' }}
            onMouseEnter={e => { if (hasChanges && !saveLoading) e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
            {saveLoading
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'tpSpin 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              : saveSuccess ? <Check size={14} strokeWidth={2.5} /> : <Save size={14} strokeWidth={2} />
            }
            {saveLoading ? 'Saving…' : saveSuccess ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Policy cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* 1. Submission Schedule */}
        <PolicyCard icon={CalendarDays} title="Submission Schedule" sub="Daily EOD submission with next-morning grace window" accent="#6366F1" accentBg="rgba(99,102,241,0.09)">

          {/* Daily cycle info strip */}
          <div style={{ padding: '11px 14px', borderRadius: 10, background: 'rgba(99,102,241,0.05)', border: `1px solid rgba(99,102,241,0.14)`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Info size={13} strokeWidth={2} style={{ color: '#6366F1', flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: '#4F46E5', fontWeight: 500, lineHeight: 1.5 }}>
              Timesheets are submitted <strong>daily</strong> — employees log hours each day before EOD, with a grace window until the next morning.
            </span>
          </div>

          <Row label="Same-day EOD Deadline" hint="Employees should submit by this time each day">
            <select value={policy.eodDeadlineTime} onChange={e => set('eodDeadlineTime', e.target.value)}
              style={{ height: 36, padding: '0 10px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 13, color: C.navy, outline: 'none', fontFamily: 'inherit', cursor: 'pointer', minWidth: 110 }}>
              {EOD_TIMES.map(t => <option key={t} value={t}>{EOD_LBL[t]}</option>)}
            </select>
          </Row>

          <Row label="Next-day Grace Deadline" hint="Maximum late submission — after this the timesheet is overdue">
            <select value={policy.nextDayGraceTime} onChange={e => set('nextDayGraceTime', e.target.value)}
              style={{ height: 36, padding: '0 10px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 13, color: C.navy, outline: 'none', fontFamily: 'inherit', cursor: 'pointer', minWidth: 110 }}>
              {GRACE_TIMES.map(t => <option key={t} value={t}>{GRACE_LBL[t]}</option>)}
            </select>
          </Row>

          <Row label="Backdated Submission" hint="Days in the past an employee can log time">
            <NumInput value={policy.backdatedDays} onChange={v => set('backdatedDays', v)} min={0} max={14} unit="days" />
          </Row>
        </PolicyCard>

        {/* 2. Working Hour Limits */}
        <PolicyCard icon={Clock} title="Working Hour Limits" sub="Daily and weekly hour boundaries for time logging" accent="#0EA86A" accentBg="rgba(14,168,106,0.09)">
          <Row label="Standard Hours / Day" hint="Expected hours for a full working day">
            <NumInput value={policy.stdHoursPerDay} onChange={v => set('stdHoursPerDay', v)} min={1} max={24} unit="hrs" />
          </Row>
          <div style={{ height: 1, background: C.border }} />
          <Row label="Minimum Hours to Log" hint="Least hours that must be logged per active day">
            <NumInput value={policy.minHoursPerDay} onChange={v => set('minHoursPerDay', v)} min={0} max={policy.stdHoursPerDay} unit="hrs" />
          </Row>
          <div style={{ height: 1, background: C.border }} />
          <Row label="Maximum Hours / Day" hint="Hard cap — entries above this are blocked">
            <NumInput value={policy.maxHoursPerDay} onChange={v => set('maxHoursPerDay', v)} min={policy.stdHoursPerDay} max={24} unit="hrs" />
          </Row>
          <div style={{ height: 1, background: C.border }} />
          <Row label="Maximum Hours / Week" hint="Hard cap across the full work week">
            <NumInput value={policy.maxHoursPerWeek} onChange={v => set('maxHoursPerWeek', v)} min={20} max={84} unit="hrs" />
          </Row>
        </PolicyCard>

        {/* 3. Overtime Rules */}
        <PolicyCard icon={TrendingUp} title="Overtime Rules" sub="Thresholds and controls for overtime hours" accent="#D97706" accentBg="rgba(217,119,6,0.09)">
          <Row label="Daily Overtime After" hint="Hours beyond this in one day are marked overtime">
            <NumInput value={policy.overtimeThresholdDay} onChange={v => set('overtimeThresholdDay', v)} min={policy.stdHoursPerDay} max={24} unit="hrs" />
          </Row>
          <Row label="Weekly Overtime After" hint="Hours beyond this across the week are flagged">
            <NumInput value={policy.overtimeThresholdWeek} onChange={v => set('overtimeThresholdWeek', v)} min={30} max={84} unit="hrs" />
          </Row>
          <Row label="Auto-flag Overtime Entries" hint="Mark overtime hours for manager review automatically">
            <Toggle checked={policy.autoFlagOvertime} onChange={v => set('autoFlagOvertime', v)} />
          </Row>
          <Row label="Allow Weekend Logging" hint="Employees can log hours on Saturday and Sunday">
            <Toggle checked={policy.weekendLogging} onChange={v => set('weekendLogging', v)} />
          </Row>
          <Row label="Allow Holiday Logging" hint="Employees can log hours on public holidays">
            <Toggle checked={policy.holidayLogging} onChange={v => set('holidayLogging', v)} />
          </Row>
        </PolicyCard>

        {/* 4. Approval Workflow */}
        <PolicyCard icon={Shield} title="Approval Workflow" sub="Who approves timesheets and when" accent="#6366F1" accentBg="rgba(99,102,241,0.09)">
          <Row label="Requires Manager Approval" hint="Direct manager must approve each daily submission">
            <Toggle checked={policy.managerApproval} onChange={v => set('managerApproval', v)} />
          </Row>
          <div style={{ height: 1, background: C.border }} />
          <Row label="Requires PM Approval" hint="Project manager must also approve project-linked hours">
            <Toggle checked={policy.pmApproval} onChange={v => set('pmApproval', v)} />
          </Row>
          <div style={{ height: 1, background: C.border }} />
          <Row label="Auto-approve After" hint="Automatically approve if no action taken (0 = off)">
            <NumInput value={policy.autoApproveDays} onChange={v => set('autoApproveDays', v)} min={0} max={14} unit="days" />
          </Row>
          <div style={{ height: 1, background: C.border }} />
          <Row label="Submission Reminder" hint="Notify employee before the EOD deadline">
            <NumInput value={policy.reminderDays} onChange={v => set('reminderDays', v)} min={0} max={7} unit="hr(s) before" />
          </Row>
        </PolicyCard>

        {/* 5. Late Submission Policy */}
        <div style={{ alignSelf: 'start' }}>
        <PolicyCard icon={AlertCircle} title="Late Submission Policy" sub="Rules for timesheets submitted after the next-day grace" accent="#E84855" accentBg="rgba(232,72,85,0.09)">
          <Row label="Auto-reject After Grace Deadline" hint="Automatically reject if next-day grace time has passed">
            <Toggle checked={policy.autoRejectAfterGrace} onChange={v => set('autoRejectAfterGrace', v)} />
          </Row>
          <Row label="Allow Late with Justification" hint="Employee can still submit with a mandatory reason">
            <Toggle checked={policy.allowLateWithReason} onChange={v => set('allowLateWithReason', v)} />
          </Row>
          <Row label="Lock Timesheet After" hint="Timesheets become read-only after this many days">
            <NumInput value={policy.lockAfterDays} onChange={v => set('lockAfterDays', v)} min={3} max={90} unit="days" />
          </Row>
        </PolicyCard>
        </div>

        {/* 6. Project & Allocation Rules */}
        <PolicyCard icon={FolderOpen} title="Project & Allocation Rules" sub="How time must be allocated across projects" accent="#7C3AED" accentBg="rgba(124,58,237,0.09)">
          <Row label="Require Project Code" hint="Every time entry must be linked to a project">
            <Toggle checked={policy.requireProjectCode} onChange={v => set('requireProjectCode', v)} />
          </Row>
          <Row label="Allow Non-billable / General Hours" hint="Employees can log time not tied to any project">
            <Toggle checked={policy.allowGeneralHours} onChange={v => set('allowGeneralHours', v)} />
          </Row>
          <Row label="Minimum Project Allocation" hint="% of total daily hours that must be on projects">
            <NumInput value={policy.minProjectAllocationPct} onChange={v => set('minProjectAllocationPct', v)} min={0} max={100} unit="%" />
          </Row>
          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.12)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Info size={13} strokeWidth={2} style={{ color: '#7C3AED', flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 12, color: '#7C3AED', lineHeight: 1.55 }}>
              Non-billable hours (internal meetings, training, etc.) are counted separately and do not affect the project allocation threshold.
            </span>
          </div>
        </PolicyCard>

      </div>
    </div>
  )
}
