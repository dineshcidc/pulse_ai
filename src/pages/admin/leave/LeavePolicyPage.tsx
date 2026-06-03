import { useState } from 'react'
import {
  CalendarDays, Users, Shield, ChevronDown, ChevronUp,
  Save, RotateCcw, Check, Info, AlertCircle, TrendingUp,
  Layers, Settings2,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
type LeaveTypeName =
  | 'Planned Leave' | 'Unplanned Leave' | 'Bereavement Holiday'
  | 'Birthday Leave' | 'Floating Holiday' | 'Election Day Leave'
  | 'Paternity Leave' | 'LWP'

type YearEndRule = 'lapse' | 'encashment'
type PolicyTab   = 'types' | 'entitlements' | 'general'

interface LeaveTypeConfig {
  name: LeaveTypeName
  code: string; color: string; bg: string; border: string
  paid: boolean; active: boolean
  annualDays: number
  requiresApproval: boolean
  requiresDocument: boolean
  carryForward: boolean
  maxCFDays: number
  cfExpiryMonths: number
  yearEndRule: YearEndRule
  encashmentRate: number
}

interface GeneralPolicy {
  leaveYearStart: 'january' | 'april'
  probationRestriction: boolean
  probationMonths: number
  sandwichRule: boolean
  noticePeriodRestriction: boolean
  minAdvanceDays: number
  maxConsecutiveDays: number
  halfDayEnabled: boolean
  backdatedDays: number
}

// ── Static defaults ────────────────────────────────────────────────────────────
const DEFAULT_CONFIGS: LeaveTypeConfig[] = [
  { name: 'Planned Leave',       code: 'PL',  color: '#059669', bg: 'rgba(5,150,105,0.08)',   border: 'rgba(5,150,105,0.18)',   paid: true,  active: true,  annualDays: 15, requiresApproval: true,  requiresDocument: false, carryForward: true,  maxCFDays: 5, cfExpiryMonths: 3, yearEndRule: 'encashment', encashmentRate: 800 },
  { name: 'Unplanned Leave',     code: 'UPL', color: '#D97706', bg: 'rgba(217,119,6,0.08)',   border: 'rgba(217,119,6,0.18)',   paid: true,  active: true,  annualDays: 8,  requiresApproval: true,  requiresDocument: false, carryForward: false, maxCFDays: 0, cfExpiryMonths: 0, yearEndRule: 'lapse',      encashmentRate: 0   },
  { name: 'Bereavement Holiday', code: 'BH',  color: '#6D28D9', bg: 'rgba(109,40,217,0.08)',  border: 'rgba(109,40,217,0.18)',  paid: true,  active: true,  annualDays: 3,  requiresApproval: false, requiresDocument: true,  carryForward: false, maxCFDays: 0, cfExpiryMonths: 0, yearEndRule: 'lapse',      encashmentRate: 0   },
  { name: 'Birthday Leave',      code: 'BL',  color: '#DB2777', bg: 'rgba(219,39,119,0.08)',  border: 'rgba(219,39,119,0.18)',  paid: true,  active: true,  annualDays: 1,  requiresApproval: false, requiresDocument: false, carryForward: false, maxCFDays: 0, cfExpiryMonths: 0, yearEndRule: 'lapse',      encashmentRate: 0   },
  { name: 'Floating Holiday',    code: 'FH',  color: '#EA580C', bg: 'rgba(234,88,12,0.08)',   border: 'rgba(234,88,12,0.18)',   paid: true,  active: true,  annualDays: 3,  requiresApproval: true,  requiresDocument: false, carryForward: false, maxCFDays: 0, cfExpiryMonths: 0, yearEndRule: 'lapse',      encashmentRate: 0   },
  { name: 'Election Day Leave',  code: 'EDL', color: '#0891B2', bg: 'rgba(8,145,178,0.08)',   border: 'rgba(8,145,178,0.18)',   paid: true,  active: true,  annualDays: 1,  requiresApproval: false, requiresDocument: false, carryForward: false, maxCFDays: 0, cfExpiryMonths: 0, yearEndRule: 'lapse',      encashmentRate: 0   },
  { name: 'Paternity Leave',     code: 'PAT', color: '#2563EB', bg: 'rgba(37,99,235,0.08)',   border: 'rgba(37,99,235,0.18)',   paid: true,  active: true,  annualDays: 15, requiresApproval: true,  requiresDocument: true,  carryForward: false, maxCFDays: 0, cfExpiryMonths: 0, yearEndRule: 'lapse',      encashmentRate: 0   },
  { name: 'LWP',                 code: 'LWP', color: '#DC2626', bg: 'rgba(220,38,38,0.08)',   border: 'rgba(220,38,38,0.18)',   paid: false, active: true,  annualDays: 0,  requiresApproval: true,  requiresDocument: false, carryForward: false, maxCFDays: 0, cfExpiryMonths: 0, yearEndRule: 'lapse',      encashmentRate: 0   },
]

const ROLES = [
  { role: 'Employee',        level: 'Standard'  },
  { role: 'Senior Employee', level: 'Senior'    },
  { role: 'Team Lead',       level: 'Lead'      },
  { role: 'Manager',         level: 'Manager'   },
  { role: 'HR Staff',        level: 'HR'        },
]

type EntMatrix = Record<string, Partial<Record<LeaveTypeName, number>>>

const DEFAULT_ENTITLEMENTS: EntMatrix = {
  'Employee':        { 'Planned Leave': 15, 'Unplanned Leave': 8,  'Bereavement Holiday': 3, 'Birthday Leave': 1, 'Floating Holiday': 3, 'Election Day Leave': 1, 'Paternity Leave': 15 },
  'Senior Employee': { 'Planned Leave': 18, 'Unplanned Leave': 8,  'Bereavement Holiday': 3, 'Birthday Leave': 1, 'Floating Holiday': 3, 'Election Day Leave': 1, 'Paternity Leave': 15 },
  'Team Lead':       { 'Planned Leave': 18, 'Unplanned Leave': 10, 'Bereavement Holiday': 3, 'Birthday Leave': 1, 'Floating Holiday': 3, 'Election Day Leave': 1, 'Paternity Leave': 15 },
  'Manager':         { 'Planned Leave': 21, 'Unplanned Leave': 10, 'Bereavement Holiday': 3, 'Birthday Leave': 1, 'Floating Holiday': 5, 'Election Day Leave': 1, 'Paternity Leave': 15 },
  'HR Staff':        { 'Planned Leave': 15, 'Unplanned Leave': 8,  'Bereavement Holiday': 3, 'Birthday Leave': 1, 'Floating Holiday': 3, 'Election Day Leave': 1, 'Paternity Leave': 15 },
}

const DEFAULT_GENERAL: GeneralPolicy = {
  leaveYearStart: 'april', probationRestriction: true, probationMonths: 3,
  sandwichRule: true, noticePeriodRestriction: true,
  minAdvanceDays: 1, maxConsecutiveDays: 10, halfDayEnabled: true, backdatedDays: 2,
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', surface: '#F7F8FC' }

// ── Toggle component ───────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled = false }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      style={{ width: 40, height: 22, borderRadius: 11, border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', background: checked ? '#1C2035' : '#D1D5DB', position: 'relative', transition: 'background 0.2s', flexShrink: 0, opacity: disabled ? 0.4 : 1 }}
    >
      <span style={{ position: 'absolute', top: 3, left: checked ? 21 : 3, width: 16, height: 16, borderRadius: '50%', background: checked ? '#F2D000' : '#fff', transition: 'left 0.18s', display: 'block', boxShadow: '0 1px 3px rgba(0,0,0,0.18)' }} />
    </button>
  )
}

// ── Page component ─────────────────────────────────────────────────────────────
export default function LeavePolicyPage() {
  const [tab,          setTab]          = useState<PolicyTab>('types')
  const [configs,      setConfigs]      = useState<LeaveTypeConfig[]>(DEFAULT_CONFIGS)
  const [entitlements, setEntitlements] = useState<EntMatrix>(DEFAULT_ENTITLEMENTS)
  const [general,      setGeneral]      = useState<GeneralPolicy>(DEFAULT_GENERAL)
  const [expandedType, setExpandedType] = useState<LeaveTypeName | null>(null)
  const [fy,           setFy]           = useState<'2025-26' | '2026-27'>('2026-27')
  const [saveLoading,  setSaveLoading]  = useState(false)
  const [saveSuccess,  setSaveSuccess]  = useState(false)
  const [hasChanges,   setHasChanges]   = useState(false)

  // ── Derived stats ──
  const activeCnt = configs.filter(c => c.active).length
  const cfCnt     = configs.filter(c => c.carryForward).length
  const totalDays = configs.filter(c => c.active && c.name !== 'LWP').reduce((s, c) => s + c.annualDays, 0)

  // ── Helpers ──
  function updateConfig<K extends keyof LeaveTypeConfig>(name: LeaveTypeName, key: K, value: LeaveTypeConfig[K]) {
    setConfigs(prev => prev.map(c => c.name === name ? { ...c, [key]: value } : c))
    mark()
  }

  function updateEnt(role: string, type: LeaveTypeName, days: number) {
    setEntitlements(prev => ({ ...prev, [role]: { ...prev[role], [type]: days } }))
    mark()
  }

  function updateGeneral<K extends keyof GeneralPolicy>(key: K, value: GeneralPolicy[K]) {
    setGeneral(prev => ({ ...prev, [key]: value }))
    mark()
  }

  function mark() { setHasChanges(true); setSaveSuccess(false) }

  async function handleSave() {
    setSaveLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSaveLoading(false)
    setSaveSuccess(true)
    setHasChanges(false)
  }

  function handleReset() {
    setConfigs(DEFAULT_CONFIGS)
    setEntitlements(DEFAULT_ENTITLEMENTS)
    setGeneral(DEFAULT_GENERAL)
    setHasChanges(false)
    setSaveSuccess(false)
    setExpandedType(null)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes lpFade { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
        @keyframes lpSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .lp-row:hover  { background: #FAFBFE !important; }
        .lp-tab:hover  { color: #1C2035 !important; }
        .lp-rule:hover { border-color: #C8CCE0 !important; }
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px', marginBottom: 4 }}>Leave Policy Setup</h1>
          <p style={{ fontSize: 13.5, color: C.muted }}>Define leave types, entitlements, and organisation-wide rules</p>
        </div>
        <div className="flex items-center gap-3">
          {/* FY selector */}
          <div style={{ background: '#F0F2F8', borderRadius: 10, padding: 3, display: 'flex', gap: 2 }}>
            {(['2025-26', '2026-27'] as const).map(y => (
              <button key={y} onClick={() => setFy(y)}
                style={{ padding: '6px 14px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: fy === y ? 700 : 500, background: fy === y ? '#fff' : 'transparent', color: fy === y ? C.navy : C.muted, boxShadow: fy === y ? '0 1px 4px rgba(28,32,53,0.10)' : 'none', transition: 'all 0.15s', fontFamily: 'inherit' }}>
                FY {y}
              </button>
            ))}
          </div>
          {/* Reset */}
          <button onClick={handleReset}
            style={{ height: 40, padding: '0 16px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.muted }}>
            <RotateCcw size={13} strokeWidth={2} /> Reset to Defaults
          </button>
          {/* Save */}
          <button onClick={handleSave} disabled={saveLoading || !hasChanges}
            style={{ height: 40, padding: '0 20px', borderRadius: 10, border: 'none', fontSize: 13.5, fontWeight: 700, cursor: (!hasChanges || saveLoading) ? 'not-allowed' : 'pointer', background: saveSuccess ? '#0EA86A' : (!hasChanges || saveLoading) ? '#E8EAF2' : 'linear-gradient(135deg, #1C2035 0%, #2D3555 100%)', color: (!hasChanges || saveLoading) ? '#B0B4C8' : '#fff', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit', transition: 'background 0.2s, opacity 0.15s' }}
            onMouseEnter={e => { if (hasChanges && !saveLoading) e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
            {saveLoading
              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'lpSpin 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              : saveSuccess ? <Check size={14} strokeWidth={2.5} /> : <Save size={14} strokeWidth={2} />
            }
            {saveLoading ? 'Saving…' : saveSuccess ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active Leave Types',    value: activeCnt, sub: `of ${configs.length} configured types`, Icon: Layers,      color: '#5B5FDE', bg: 'rgba(99,102,241,0.08)'  },
          { label: 'Total Days / Year',     value: totalDays, sub: 'across all active paid leave types',   Icon: CalendarDays, color: '#0EA86A', bg: 'rgba(14,168,106,0.08)' },
          { label: 'Carry Forward Enabled', value: cfCnt,     sub: `leave type${cfCnt !== 1 ? 's' : ''} with CF rules active`, Icon: TrendingUp,  color: '#D97706', bg: 'rgba(217,119,6,0.08)'   },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.Icon size={22} strokeWidth={1.6} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.navy, lineHeight: 1, letterSpacing: '-0.5px', marginBottom: 5 }}>{s.value}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11.5, color: C.muted }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main card with tabs ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, background: C.surface, padding: '0 8px' }}>
          {([
            { id: 'types',        label: 'Leave Types',       Icon: Layers       },
            { id: 'entitlements', label: 'Role Entitlements', Icon: Users        },
            { id: 'general',      label: 'General Rules',     Icon: Shield       },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="lp-tab"
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '14px 20px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13.5, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? C.navy : C.muted, borderBottom: tab === t.id ? `2.5px solid ${C.navy}` : '2.5px solid transparent', marginBottom: -1, fontFamily: 'inherit', transition: 'color 0.15s' }}>
              <t.Icon size={15} strokeWidth={tab === t.id ? 2.3 : 1.8} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════ TAB: Leave Types ═══════════════════════ */}
        {tab === 'types' && (
          <>
            {/* Column header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.55fr 0.65fr 1fr 0.9fr 0.9fr 1.1fr 0.65fr 0.45fr', padding: '11px 24px', background: '#F7F8FC', borderBottom: `1px solid ${C.border}` }}>
              {['Leave Type', 'Code', 'Category', 'Annual Days', 'Approval', 'Carry Fwd', 'Year-End Rule', 'Active', ''].map(h => (
                <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>

            {configs.map(cfg => {
              const isExp = expandedType === cfg.name
              return (
                <div key={cfg.name} style={{ borderBottom: `1px solid #F0F2F8` }}>

                  {/* Main row */}
                  <div
                    className="lp-row"
                    style={{ display: 'grid', gridTemplateColumns: '2fr 0.55fr 0.65fr 1fr 0.9fr 0.9fr 1.1fr 0.65fr 0.45fr', padding: '15px 24px', alignItems: 'center', background: '#fff', transition: 'background 0.12s', opacity: cfg.active ? 1 : 0.5 }}
                  >
                    {/* Name */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{cfg.name}</div>
                        {!cfg.paid && <div style={{ fontSize: 11, color: '#DC2626', fontWeight: 600, marginTop: 1 }}>Salary deduction applies</div>}
                      </div>
                    </div>

                    {/* Code */}
                    <span style={{ display: 'inline-flex', padding: '3px 8px', borderRadius: 6, background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700, width: 'fit-content', border: `1px solid ${cfg.border}` }}>
                      {cfg.code}
                    </span>

                    {/* Category */}
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 99, fontSize: 11.5, fontWeight: 600, width: 'fit-content', background: cfg.paid ? 'rgba(14,168,106,0.10)' : 'rgba(220,38,38,0.08)', color: cfg.paid ? '#0A7040' : '#DC2626', border: `1px solid ${cfg.paid ? 'rgba(14,168,106,0.20)' : 'rgba(220,38,38,0.20)'}` }}>
                      {cfg.paid ? 'Paid' : 'Unpaid'}
                    </span>

                    {/* Annual Days */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="number" min={0} max={365} value={cfg.annualDays}
                        disabled={cfg.name === 'LWP'}
                        onChange={e => updateConfig(cfg.name, 'annualDays', Math.max(0, parseInt(e.target.value) || 0))}
                        style={{ width: 58, height: 34, borderRadius: 8, border: `1px solid ${C.border}`, background: cfg.name === 'LWP' ? '#F7F8FC' : '#fff', textAlign: 'center', fontSize: 14, fontWeight: 700, color: C.navy, outline: 'none', fontFamily: 'inherit', cursor: cfg.name === 'LWP' ? 'not-allowed' : 'text' }}
                      />
                      <span style={{ fontSize: 12, color: C.muted }}>{cfg.name === 'LWP' ? '—' : 'days'}</span>
                    </div>

                    {/* Requires Approval */}
                    <Toggle checked={cfg.requiresApproval} onChange={v => updateConfig(cfg.name, 'requiresApproval', v)} />

                    {/* Carry Forward */}
                    <Toggle checked={cfg.carryForward} onChange={v => updateConfig(cfg.name, 'carryForward', v)} disabled={cfg.name === 'LWP' || !cfg.paid} />

                    {/* Year-End Rule */}
                    <div style={{ display: 'flex', background: '#F0F2F8', borderRadius: 8, padding: 2, gap: 1, width: 'fit-content' }}>
                      {(['lapse', 'encashment'] as const).map(rule => (
                        <button key={rule} onClick={() => updateConfig(cfg.name, 'yearEndRule', rule)}
                          style={{ padding: '5px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11.5, fontWeight: cfg.yearEndRule === rule ? 700 : 500, background: cfg.yearEndRule === rule ? '#fff' : 'transparent', color: cfg.yearEndRule === rule ? C.navy : C.muted, boxShadow: cfg.yearEndRule === rule ? '0 1px 3px rgba(28,32,53,0.10)' : 'none', fontFamily: 'inherit', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                          {rule === 'encashment' ? 'Encash' : 'Lapse'}
                        </button>
                      ))}
                    </div>

                    {/* Active */}
                    <Toggle checked={cfg.active} onChange={v => updateConfig(cfg.name, 'active', v)} />

                    {/* Expand */}
                    <button
                      onClick={() => setExpandedType(isExp ? null : cfg.name)}
                      style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: isExp ? C.navy : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0 }}
                      onMouseEnter={e => { if (!isExp) e.currentTarget.style.background = '#F0F2F8' }}
                      onMouseLeave={e => { if (!isExp) e.currentTarget.style.background = '#fff' }}
                    >
                      {isExp
                        ? <ChevronUp   size={13} strokeWidth={2.2} style={{ color: '#F2D000' }} />
                        : <ChevronDown size={13} strokeWidth={2.2} style={{ color: C.muted  }} />
                      }
                    </button>
                  </div>

                  {/* Expanded advanced settings */}
                  {isExp && (
                    <div style={{ background: '#FAFBFE', borderTop: `1px solid #F0F2F8`, padding: '22px 28px 26px', animation: 'lpFade 0.18s ease-out' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 18 }}>
                        Advanced Configuration — {cfg.name}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 22 }}>

                        {/* Requires Document */}
                        <div style={{ padding: '16px', borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Requires Document</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <Toggle checked={cfg.requiresDocument} onChange={v => updateConfig(cfg.name, 'requiresDocument', v)} />
                            <span style={{ fontSize: 12.5, color: cfg.requiresDocument ? C.navy : C.muted, fontWeight: cfg.requiresDocument ? 600 : 400 }}>
                              {cfg.requiresDocument ? 'Required on return' : 'Not required'}
                            </span>
                          </div>
                          <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5 }}>
                            Employee must upload a supporting document when applying.
                          </div>
                        </div>

                        {/* Max Carry Forward */}
                        <div style={{ padding: '16px', borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', opacity: cfg.carryForward ? 1 : 0.45 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Max Carry Forward</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <input type="number" min={0} max={cfg.annualDays} value={cfg.maxCFDays}
                              disabled={!cfg.carryForward}
                              onChange={e => updateConfig(cfg.name, 'maxCFDays', Math.max(0, parseInt(e.target.value) || 0))}
                              style={{ width: 64, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: '#F7F8FC', textAlign: 'center', fontSize: 14, fontWeight: 700, color: C.navy, outline: 'none', fontFamily: 'inherit', cursor: !cfg.carryForward ? 'not-allowed' : 'text' }} />
                            <span style={{ fontSize: 12.5, color: C.muted }}>days</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5 }}>
                            Unused days above this limit will lapse at year end.
                          </div>
                        </div>

                        {/* CF Expiry */}
                        <div style={{ padding: '16px', borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', opacity: cfg.carryForward ? 1 : 0.45 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>CF Expiry Period</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <input type="number" min={1} max={12} value={cfg.cfExpiryMonths}
                              disabled={!cfg.carryForward}
                              onChange={e => updateConfig(cfg.name, 'cfExpiryMonths', Math.max(1, parseInt(e.target.value) || 1))}
                              style={{ width: 64, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: '#F7F8FC', textAlign: 'center', fontSize: 14, fontWeight: 700, color: C.navy, outline: 'none', fontFamily: 'inherit', cursor: !cfg.carryForward ? 'not-allowed' : 'text' }} />
                            <span style={{ fontSize: 12.5, color: C.muted }}>months</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5 }}>
                            Carried-forward days expire this many months after the new FY starts.
                          </div>
                        </div>

                        {/* Encashment Rate */}
                        <div style={{ padding: '16px', borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', opacity: cfg.yearEndRule === 'encashment' ? 1 : 0.45 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Encashment Rate</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <span style={{ fontSize: 15, color: C.muted, fontWeight: 500, flexShrink: 0 }}>₹</span>
                            <input type="number" min={0} value={cfg.encashmentRate}
                              disabled={cfg.yearEndRule !== 'encashment'}
                              onChange={e => updateConfig(cfg.name, 'encashmentRate', Math.max(0, parseInt(e.target.value) || 0))}
                              style={{ width: 80, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: '#F7F8FC', textAlign: 'center', fontSize: 14, fontWeight: 700, color: C.navy, outline: 'none', fontFamily: 'inherit', cursor: cfg.yearEndRule !== 'encashment' ? 'not-allowed' : 'text' }} />
                            <span style={{ fontSize: 12.5, color: C.muted }}>/ day</span>
                          </div>
                          <div style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5 }}>
                            Payout rate for encashed unused leave days at year end.
                          </div>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Footer note */}
            <div style={{ padding: '13px 24px', background: C.surface, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Info size={13} strokeWidth={2} style={{ color: '#5B5FDE', flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: '#5B5FDE' }}>
                Annual days here are the global defaults. Role-specific overrides can be set in the <strong>Role Entitlements</strong> tab.
              </span>
            </div>
          </>
        )}

        {/* ═══════════════════════════ TAB: Role Entitlements ═════════════════ */}
        {tab === 'entitlements' && (() => {
          const activeTypes = configs.filter(c => c.active && c.name !== 'LWP')
          return (
            <>
              {/* Info banner */}
              <div style={{ padding: '13px 24px', borderBottom: `1px solid ${C.border}`, background: 'rgba(99,102,241,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Info size={14} strokeWidth={2} style={{ color: '#5B5FDE', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#5B5FDE', fontWeight: 500 }}>
                  Set role-specific annual entitlements. <span style={{ color: C.muted, fontWeight: 400 }}>Highlighted cells override the global default. Grey cells match the global default from the Leave Types tab.</span>
                </span>
              </div>

              {/* Matrix */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F7F8FC' }}>
                      <th style={{ padding: '13px 24px', textAlign: 'left', fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' }}>
                        Role / Leave Type
                      </th>
                      {activeTypes.map(t => (
                        <th key={t.name} style={{ padding: '10px 12px', textAlign: 'center', borderBottom: `1px solid ${C.border}`, minWidth: 96 }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                            <span style={{ padding: '3px 8px', borderRadius: 6, background: t.bg, color: t.color, fontSize: 10.5, fontWeight: 700, border: `1px solid ${t.border}`, letterSpacing: '0.03em' }}>{t.code}</span>
                            <span style={{ fontSize: 9.5, color: '#B0B4C8', fontWeight: 600, maxWidth: 72, textAlign: 'center', lineHeight: 1.35 }}>{t.name}</span>
                          </div>
                        </th>
                      ))}
                      <th style={{ padding: '13px 20px', textAlign: 'center', borderBottom: `1px solid ${C.border}`, fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                        Total Days
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROLES.map((r, ri) => {
                      const rowTotal = activeTypes.reduce((sum, t) => {
                        return sum + (entitlements[r.role]?.[t.name] ?? t.annualDays)
                      }, 0)
                      return (
                        <tr key={r.role}
                          style={{ borderBottom: ri < ROLES.length - 1 ? `1px solid #F0F2F8` : 'none', background: '#fff', transition: 'background 0.12s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#FAFBFE' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#fff' }}>
                          <td style={{ padding: '14px 24px', whiteSpace: 'nowrap' }}>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{r.role}</div>
                            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{r.level}</div>
                          </td>
                          {activeTypes.map(t => {
                            const cellVal  = entitlements[r.role]?.[t.name] ?? t.annualDays
                            const isOverride = cellVal !== t.annualDays
                            return (
                              <td key={t.name} style={{ padding: '12px', textAlign: 'center' }}>
                                <input
                                  type="number" min={0} max={365} value={cellVal}
                                  onChange={e => updateEnt(r.role, t.name, Math.max(0, parseInt(e.target.value) || 0))}
                                  style={{ width: 60, height: 36, borderRadius: 8, border: `1.5px solid ${isOverride ? t.border : '#E8EAF2'}`, background: isOverride ? t.bg : '#F7F8FC', textAlign: 'center', fontSize: 13.5, fontWeight: 700, color: isOverride ? t.color : C.muted, outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s' }}
                                />
                              </td>
                            )
                          })}
                          <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                            <span style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>{rowTotal}</span>
                            <div style={{ fontSize: 10.5, color: C.muted, marginTop: 2 }}>days/yr</div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div style={{ padding: '12px 24px', borderTop: `1px solid ${C.border}`, background: C.surface, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 20, borderRadius: 5, background: '#F7F8FC', border: `1px solid ${C.border}` }} />
                  <span style={{ fontSize: 12, color: C.muted }}>Using global default</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 20, borderRadius: 5, background: 'rgba(5,150,105,0.08)', border: '1.5px solid rgba(5,150,105,0.18)' }} />
                  <span style={{ fontSize: 12, color: C.muted }}>Role-specific override</span>
                </div>
              </div>
            </>
          )
        })()}

        {/* ══════════════════════════ TAB: General Rules ══════════════════════ */}
        {tab === 'general' && (
          <div style={{ padding: '28px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

              {/* Leave Year Period */}
              <div className="lp-rule" style={{ padding: '20px', borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, transition: 'border-color 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CalendarDays size={14} strokeWidth={2.2} style={{ color: '#5B5FDE' }} />
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Leave Year Period</span>
                </div>
                <p style={{ fontSize: 12.5, color: C.muted, marginBottom: 14, lineHeight: 1.6 }}>
                  Defines when the leave year starts. Employee balances reset on this date annually.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {([
                    { value: 'january', label: 'Jan 1 – Dec 31', sub: 'Calendar Year' },
                    { value: 'april',   label: 'Apr 1 – Mar 31', sub: 'Financial Year' },
                  ] as const).map(opt => (
                    <button key={opt.value} onClick={() => updateGeneral('leaveYearStart', opt.value)}
                      style={{ flex: 1, padding: '11px 12px', borderRadius: 10, border: `1.5px solid ${general.leaveYearStart === opt.value ? C.navy : C.border}`, background: general.leaveYearStart === opt.value ? C.navy : '#fff', color: general.leaveYearStart === opt.value ? '#fff' : C.muted, fontSize: 12.5, fontWeight: general.leaveYearStart === opt.value ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'center' }}>
                      <div>{opt.label}</div>
                      <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Probation Restriction */}
              <div className="lp-rule" style={{ padding: '20px', borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, transition: 'border-color 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(232,72,85,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Shield size={14} strokeWidth={2.2} style={{ color: '#E84855' }} />
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Probation Restriction</span>
                  </div>
                  <Toggle checked={general.probationRestriction} onChange={v => updateGeneral('probationRestriction', v)} />
                </div>
                <p style={{ fontSize: 12.5, color: C.muted, marginBottom: 14, lineHeight: 1.6 }}>
                  Block paid leave requests during the employee's probation period.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, opacity: general.probationRestriction ? 1 : 0.4 }}>
                  <span style={{ fontSize: 12.5, color: C.muted }}>Probation period:</span>
                  <input type="number" min={1} max={24} value={general.probationMonths}
                    disabled={!general.probationRestriction}
                    onChange={e => updateGeneral('probationMonths', Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ width: 58, height: 34, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', textAlign: 'center', fontSize: 14, fontWeight: 700, color: C.navy, outline: 'none', fontFamily: 'inherit', cursor: !general.probationRestriction ? 'not-allowed' : 'text' }} />
                  <span style={{ fontSize: 12.5, color: C.muted }}>months</span>
                </div>
              </div>

              {/* Sandwich Rule */}
              <div className="lp-rule" style={{ padding: '20px', borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, transition: 'border-color 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(245,158,11,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <AlertCircle size={14} strokeWidth={2.2} style={{ color: '#D97706' }} />
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Sandwich Rule</span>
                  </div>
                  <Toggle checked={general.sandwichRule} onChange={v => updateGeneral('sandwichRule', v)} />
                </div>
                <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
                  When enabled, weekends and public holidays that fall <em>between</em> leave days are counted as part of the leave, not as work days. Helps prevent employees from extending leave periods.
                </p>
              </div>

              {/* Notice Period Restriction */}
              <div className="lp-rule" style={{ padding: '20px', borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, transition: 'border-color 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(139,92,246,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Info size={14} strokeWidth={2.2} style={{ color: '#7C3AED' }} />
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Notice Period Restriction</span>
                  </div>
                  <Toggle checked={general.noticePeriodRestriction} onChange={v => updateGeneral('noticePeriodRestriction', v)} />
                </div>
                <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
                  Block paid leave applications once an employee has submitted their resignation. LWP is still permitted and will be processed as a salary deduction.
                </p>
              </div>

              {/* Minimum Advance Notice */}
              <div className="lp-rule" style={{ padding: '20px', borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, transition: 'border-color 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(14,168,106,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Settings2 size={14} strokeWidth={2.2} style={{ color: '#0EA86A' }} />
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Minimum Advance Notice</span>
                </div>
                <p style={{ fontSize: 12.5, color: C.muted, marginBottom: 14, lineHeight: 1.6 }}>
                  Minimum number of days before the leave start date that a Planned Leave request must be submitted.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="number" min={0} max={30} value={general.minAdvanceDays}
                    onChange={e => updateGeneral('minAdvanceDays', Math.max(0, parseInt(e.target.value) || 0))}
                    style={{ width: 64, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', textAlign: 'center', fontSize: 14, fontWeight: 700, color: C.navy, outline: 'none', fontFamily: 'inherit' }} />
                  <span style={{ fontSize: 12.5, color: C.muted }}>working day(s) in advance</span>
                </div>
              </div>

              {/* Max Consecutive Days */}
              <div className="lp-rule" style={{ padding: '20px', borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, transition: 'border-color 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(59,130,246,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CalendarDays size={14} strokeWidth={2.2} style={{ color: '#3B82F6' }} />
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Max Consecutive Days</span>
                </div>
                <p style={{ fontSize: 12.5, color: C.muted, marginBottom: 14, lineHeight: 1.6 }}>
                  Maximum consecutive days allowed in a single leave request. Requests exceeding this limit require HR approval.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="number" min={1} max={90} value={general.maxConsecutiveDays}
                    onChange={e => updateGeneral('maxConsecutiveDays', Math.max(1, parseInt(e.target.value) || 1))}
                    style={{ width: 64, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', textAlign: 'center', fontSize: 14, fontWeight: 700, color: C.navy, outline: 'none', fontFamily: 'inherit' }} />
                  <span style={{ fontSize: 12.5, color: C.muted }}>consecutive days per request</span>
                </div>
              </div>

              {/* Half-Day Leave */}
              <div className="lp-rule" style={{ padding: '20px', borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, transition: 'border-color 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(28,32,53,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CalendarDays size={14} strokeWidth={2.2} style={{ color: C.navy }} />
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Half-Day Leave</span>
                  </div>
                  <Toggle checked={general.halfDayEnabled} onChange={v => updateGeneral('halfDayEnabled', v)} />
                </div>
                <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.6 }}>
                  Allow employees to apply for half-day leave (0.5 days deducted per session). Applicable for Planned and Unplanned leave types.
                </p>
              </div>

              {/* Backdated Application */}
              <div className="lp-rule" style={{ padding: '20px', borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface, transition: 'border-color 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(109,40,217,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <RotateCcw size={14} strokeWidth={2.2} style={{ color: '#6D28D9' }} />
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Backdated Application</span>
                </div>
                <p style={{ fontSize: 12.5, color: C.muted, marginBottom: 14, lineHeight: 1.6 }}>
                  Maximum days in the past an employee can apply for Unplanned Leave. Set to 0 to require same-day application only.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input type="number" min={0} max={7} value={general.backdatedDays}
                    onChange={e => updateGeneral('backdatedDays', Math.max(0, parseInt(e.target.value) || 0))}
                    style={{ width: 64, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', textAlign: 'center', fontSize: 14, fontWeight: 700, color: C.navy, outline: 'none', fontFamily: 'inherit' }} />
                  <span style={{ fontSize: 12.5, color: C.muted }}>day(s) backdated allowed</span>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* ── Unsaved changes floating banner ── */}
      {hasChanges && !saveLoading && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: C.navy, borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 8px 32px rgba(10,12,28,0.22)', animation: 'lpFade 0.22s ease-out', fontFamily: "'DM Sans', system-ui, sans-serif", whiteSpace: 'nowrap' }}>
          <AlertCircle size={15} strokeWidth={2} style={{ color: '#F2D000', flexShrink: 0 }} />
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'rgba(255,255,255,0.88)' }}>You have unsaved changes</span>
          <button onClick={handleSave}
            style={{ height: 34, padding: '0 16px', borderRadius: 8, border: 'none', background: '#F2D000', color: C.navy, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Save Now
          </button>
          <button onClick={handleReset}
            style={{ height: 34, padding: '0 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.55)', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Discard
          </button>
        </div>
      )}
    </div>
  )
}
