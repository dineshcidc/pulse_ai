import { useState } from 'react'
import {
  CalendarDays, Users, Shield, ChevronDown, ChevronUp,
  Save, RotateCcw, Check, Info, AlertCircle, TrendingUp,
  Layers, Settings2, Plus, X,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
type LeaveTypeName = string

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

const EMPTY_NEW_TYPE = {
  name: '', code: '', paid: true, color: '#6366F1',
  annualDays: 0, requiresApproval: true, carryForward: false,
  yearEndRule: 'lapse' as YearEndRule,
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', surface: '#F7F8FC' }

// ── Toggle component ───────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled = false }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      style={{ width: 40, height: 22, borderRadius: 11, border: `1px solid ${checked ? '#818CF8' : '#D1D5DB'}`, cursor: disabled ? 'not-allowed' : 'pointer', background: checked ? '#A5B4FC' : '#F3F4F6', position: 'relative', transition: 'background 0.2s, border-color 0.2s', flexShrink: 0, opacity: disabled ? 0.4 : 1 }}
    >
      <span style={{ position: 'absolute', top: 2, left: checked ? 20 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.18s', display: 'block', boxShadow: checked ? '0 1px 4px rgba(99,102,241,0.30)' : '0 1px 3px rgba(0,0,0,0.12)' }} />
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
  const [showAddType,   setShowAddType]   = useState(false)
  const [newType,       setNewType]       = useState(EMPTY_NEW_TYPE)
  const [addTypeErrors, setAddTypeErrors] = useState<{ name?: string; code?: string }>({})
  const [addTypeSaving, setAddTypeSaving] = useState(false)

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

  function closeAddType() {
    setShowAddType(false)
    setNewType(EMPTY_NEW_TYPE)
    setAddTypeErrors({})
  }

  async function handleAddType() {
    const errs: { name?: string; code?: string } = {}
    if (!newType.name.trim())
      errs.name = 'Leave type name is required'
    else if (configs.some(c => c.name.toLowerCase() === newType.name.trim().toLowerCase()))
      errs.name = 'A leave type with this name already exists'
    if (!newType.code.trim())
      errs.code = 'Short code is required'
    else if (configs.some(c => c.code.toUpperCase() === newType.code.trim().toUpperCase()))
      errs.code = 'This code is already in use'
    if (Object.keys(errs).length > 0) { setAddTypeErrors(errs); return }

    setAddTypeSaving(true)
    await new Promise(r => setTimeout(r, 700))
    const col = newType.color
    setConfigs(prev => [...prev, {
      name:               newType.name.trim(),
      code:               newType.code.trim().toUpperCase(),
      color:              col,
      bg:                 `${col}14`,
      border:             `${col}28`,
      paid:               newType.paid,
      active:             true,
      annualDays:         newType.annualDays,
      requiresApproval:   newType.requiresApproval,
      requiresDocument:   false,
      carryForward:       newType.carryForward,
      maxCFDays:          0,
      cfExpiryMonths:     3,
      yearEndRule:        newType.yearEndRule,
      encashmentRate:     0,
    }])
    setAddTypeSaving(false)
    closeAddType()
    mark()
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
            style={{ height: 40, padding: '0 20px', borderRadius: 10, border: 'none', fontSize: 13.5, fontWeight: 700, cursor: (!hasChanges || saveLoading) ? 'not-allowed' : 'pointer', background: saveSuccess ? '#0EA86A' : (!hasChanges || saveLoading) ? '#E8EAF2' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: (!hasChanges || saveLoading) ? '#B0B4C8' : '#fff', display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit', transition: 'background 0.2s, opacity 0.15s' }}
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
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: `1px solid ${C.border}`, background: C.surface, padding: '0 8px' }}>
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
          {tab === 'types' && (
            <button onClick={() => setShowAddType(true)}
              style={{ marginLeft: 'auto', marginRight: 12, display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.color = '#6366F1'; e.currentTarget.style.background = 'rgba(99,102,241,0.05)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; e.currentTarget.style.background = '#fff' }}>
              <Plus size={12} strokeWidth={2.5} /> New Leave Type
            </button>
          )}
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
                                  style={{ width: 60, height: 36, borderRadius: 8, border: `1px solid ${isOverride ? t.border : '#E8EAF2'}`, background: isOverride ? t.bg : '#F7F8FC', textAlign: 'center', fontSize: 13.5, fontWeight: 700, color: isOverride ? t.color : C.muted, outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s' }}
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
                  <div style={{ width: 28, height: 20, borderRadius: 5, background: 'rgba(5,150,105,0.08)', border: '1px solid rgba(5,150,105,0.18)' }} />
                  <span style={{ fontSize: 12, color: C.muted }}>Role-specific override</span>
                </div>
              </div>

              {/* Info banner */}
              <div style={{ padding: '13px 24px', borderTop: `1px solid ${C.border}`, background: 'rgba(99,102,241,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Info size={14} strokeWidth={2} style={{ color: '#5B5FDE', flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#5B5FDE', fontWeight: 500 }}>
                  Set role-specific annual entitlements. <span style={{ color: C.muted, fontWeight: 400 }}>Highlighted cells override the global default. Grey cells match the global default from the Leave Types tab.</span>
                </span>
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
                      style={{ flex: 1, padding: '11px 12px', borderRadius: 10, border: `1px solid ${general.leaveYearStart === opt.value ? '#6366F1' : C.border}`, background: general.leaveYearStart === opt.value ? 'rgba(99,102,241,0.07)' : '#fff', color: general.leaveYearStart === opt.value ? '#4F46E5' : C.muted, fontSize: 12.5, fontWeight: general.leaveYearStart === opt.value ? 700 : 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'center' }}>
                      <div>{opt.label}</div>
                      <div style={{ fontSize: 11, marginTop: 2, color: general.leaveYearStart === opt.value ? '#6366F1' : C.muted, opacity: 0.8 }}>{opt.sub}</div>
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

      {/* ── Add New Leave Type Modal ── */}
      {showAddType && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          onClick={e => { if (e.target === e.currentTarget && !addTypeSaving) closeAddType() }}>
          <div style={{ background: '#fff', borderRadius: 22, width: 540, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 28px 72px rgba(10,12,28,0.22)', animation: 'lpFade 0.22s ease-out' }}>

            {/* Header */}
            <div style={{ padding: '22px 28px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: `${newType.color}14`, border: `1px solid ${newType.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
                <Layers size={17} strokeWidth={1.8} style={{ color: newType.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, letterSpacing: '-0.2px' }}>Add New Leave Type</div>
                <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>Define a custom leave type for your organisation</div>
              </div>
              <button onClick={closeAddType}
                style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
                <X size={13} strokeWidth={2} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 22, flex: 1, overflowY: 'auto' }}>

              {/* Name + Code */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>
                    Leave Type Name <span style={{ color: '#E84855' }}>*</span>
                  </label>
                  <input value={newType.name}
                    onChange={e => { setNewType(p => ({ ...p, name: e.target.value })); setAddTypeErrors(p => ({ ...p, name: undefined })) }}
                    placeholder="e.g. Maternity Leave"
                    style={{ width: '100%', height: 42, borderRadius: 10, padding: '0 14px', fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none', border: `1px solid ${addTypeErrors.name ? '#E84855' : C.border}`, background: newType.name ? C.surface : '#fff', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                    onFocus={e => { if (!addTypeErrors.name) e.target.style.borderColor = '#6366F1' }}
                    onBlur={e => { e.target.style.borderColor = addTypeErrors.name ? '#E84855' : C.border }} />
                  {addTypeErrors.name && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#E84855', fontWeight: 500 }}>{addTypeErrors.name}</p>}
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 7 }}>
                    Short Code <span style={{ color: '#E84855' }}>*</span>
                  </label>
                  <input value={newType.code}
                    onChange={e => { setNewType(p => ({ ...p, code: e.target.value.toUpperCase().slice(0, 5) })); setAddTypeErrors(p => ({ ...p, code: undefined })) }}
                    placeholder="e.g. ML"
                    style={{ width: '100%', height: 42, borderRadius: 10, padding: '0 14px', fontSize: 13.5, fontWeight: 700, color: C.navy, outline: 'none', border: `1px solid ${addTypeErrors.code ? '#E84855' : C.border}`, background: newType.code ? C.surface : '#fff', fontFamily: 'monospace', boxSizing: 'border-box', transition: 'border-color 0.15s', letterSpacing: '0.06em' }}
                    onFocus={e => { if (!addTypeErrors.code) e.target.style.borderColor = '#6366F1' }}
                    onBlur={e => { e.target.style.borderColor = addTypeErrors.code ? '#E84855' : C.border }} />
                  {addTypeErrors.code && <p style={{ margin: '5px 0 0', fontSize: 12, color: '#E84855', fontWeight: 500 }}>{addTypeErrors.code}</p>}
                </div>
              </div>

              {/* Category */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 10 }}>Category</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  {([
                    { value: true,  label: 'Paid',   sub: 'No salary deduction' },
                    { value: false, label: 'Unpaid', sub: 'Salary deducted'      },
                  ] as const).map(opt => (
                    <button key={String(opt.value)} onClick={() => setNewType(p => ({ ...p, paid: opt.value }))}
                      style={{ flex: 1, padding: '11px 14px', borderRadius: 11, border: `1px solid ${newType.paid === opt.value ? '#6366F1' : C.border}`, background: newType.paid === opt.value ? 'rgba(99,102,241,0.06)' : '#fff', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'left' as const }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: newType.paid === opt.value ? '#4F46E5' : C.navy }}>{opt.label}</div>
                      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Annual Days + Toggles */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 10 }}>Annual Days</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="number" min={0} max={365} value={newType.annualDays}
                      onChange={e => setNewType(p => ({ ...p, annualDays: Math.max(0, parseInt(e.target.value) || 0) }))}
                      style={{ width: 68, height: 40, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', textAlign: 'center', fontSize: 15, fontWeight: 700, color: C.navy, outline: 'none', fontFamily: 'inherit' }} />
                    <span style={{ fontSize: 12.5, color: C.muted }}>days</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 12 }}>Requires Approval</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Toggle checked={newType.requiresApproval} onChange={v => setNewType(p => ({ ...p, requiresApproval: v }))} />
                    <span style={{ fontSize: 12.5, color: C.muted }}>{newType.requiresApproval ? 'Yes' : 'No'}</span>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 12 }}>Carry Forward</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Toggle checked={newType.carryForward} onChange={v => setNewType(p => ({ ...p, carryForward: v }))} />
                    <span style={{ fontSize: 12.5, color: C.muted }}>{newType.carryForward ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              {/* Year-End Rule */}
              <div>
                <label style={{ fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase' as const, letterSpacing: '0.06em', display: 'block', marginBottom: 10 }}>Year-End Rule</label>
                <div style={{ display: 'flex', background: '#F0F2F8', borderRadius: 10, padding: 3, gap: 2, width: 'fit-content' }}>
                  {(['lapse', 'encashment'] as const).map(rule => (
                    <button key={rule} onClick={() => setNewType(p => ({ ...p, yearEndRule: rule }))}
                      style={{ padding: '8px 20px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: newType.yearEndRule === rule ? 700 : 500, background: newType.yearEndRule === rule ? '#fff' : 'transparent', color: newType.yearEndRule === rule ? C.navy : C.muted, boxShadow: newType.yearEndRule === rule ? '0 1px 3px rgba(28,32,53,0.10)' : 'none', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                      {rule === 'encashment' ? 'Encashment' : 'Lapse'}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>
                  {newType.yearEndRule === 'lapse'
                    ? 'Unused days will lapse at the end of the leave year.'
                    : 'Unused days will be paid out as encashment at year end.'}
                </p>
              </div>

            </div>

            {/* Footer */}
            <div style={{ padding: '16px 28px 24px', display: 'flex', gap: 10, borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
              <button onClick={closeAddType} disabled={addTypeSaving}
                style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: addTypeSaving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (!addTypeSaving) { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                Cancel
              </button>
              <button onClick={handleAddType}
                disabled={addTypeSaving || !newType.name.trim() || !newType.code.trim()}
                style={{ flex: 2, height: 44, borderRadius: 12, border: 'none', background: (addTypeSaving || !newType.name.trim() || !newType.code.trim()) ? '#E8EAF2' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: (addTypeSaving || !newType.name.trim() || !newType.code.trim()) ? '#B0B4C8' : '#fff', fontSize: 14, fontWeight: 700, cursor: (addTypeSaving || !newType.name.trim() || !newType.code.trim()) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.15s' }}
                onMouseEnter={e => { if (!addTypeSaving && newType.name.trim() && newType.code.trim()) e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                {addTypeSaving
                  ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'lpSpin 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Adding…</>
                  : <><Plus size={14} strokeWidth={2.2} />Add Leave Type</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
