import { useState } from 'react'
import {
  ArrowLeft, ChevronRight, Check,
  FileText, Users, DollarSign,
  Plus, X, Calendar, Building2,
  Briefcase, ChevronDown, Search,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
type ProjectStatus = 'yet-to-start' | 'started' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled'
type BillingType   = 'hourly' | 'fixed' | 'retainer'

interface RoleMember {
  name: string
  allocation: number
}

interface RoleGroup {
  id: number
  role: string
  members: RoleMember[]
}

interface RateRow {
  id: number
  role: string
  rate: string
  currency: string
}

interface FormData {
  // Step 1
  projectName:    string
  description:    string
  clientName:     string
  startDate:      string
  endDate:        string
  plannedStart:   string
  plannedEnd:     string
  actualStart:    string
  actualEnd:      string
  sowSigned:      string
  status:         ProjectStatus
  // Step 2
  manager:    string
  roleGroups: RoleGroup[]
  // Step 3
  billingType:  BillingType
  poNumber:     string
  paymentTerms: string
  rates:        RateRow[]
}

// ── Constants ─────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Project Details', sub: 'Name, client & full timeline',   Icon: FileText   },
  { id: 2, label: 'Team Details',    sub: 'Manager & members',              Icon: Users      },
  // Rate Card hidden for now — keep for later re-enable
  // { id: 3, label: 'Rate Card',       sub: 'Billing & rates',                Icon: DollarSign },
]

const STATUSES: { id: ProjectStatus; label: string; color: string; bg: string; border: string }[] = [
  { id: 'yet-to-start', label: 'Yet to Start', color: '#6B7280', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.25)' },
  { id: 'started',      label: 'Started',      color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)'  },
  { id: 'in-progress',  label: 'In Progress',  color: '#0891B2', bg: 'rgba(8,145,178,0.08)',   border: 'rgba(8,145,178,0.25)'   },
  { id: 'on-hold',      label: 'On Hold',      color: '#B45309', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)'  },
  { id: 'completed',    label: 'Completed',    color: '#0A8A58', bg: 'rgba(14,168,106,0.08)',  border: 'rgba(14,168,106,0.25)'  },
  { id: 'cancelled',    label: 'Cancelled',    color: '#E84855', bg: 'rgba(232,72,85,0.08)',   border: 'rgba(232,72,85,0.25)'   },
]

// Map any legacy/card status coming in from the project list onto the new 6-status set
const VALID_STATUSES: ProjectStatus[] = ['yet-to-start', 'started', 'in-progress', 'on-hold', 'completed', 'cancelled']
function normalizeStatus(s: string): ProjectStatus {
  if (VALID_STATUSES.includes(s as ProjectStatus)) return s as ProjectStatus
  const legacy: Record<string, ProjectStatus> = {
    planning: 'yet-to-start', draft: 'yet-to-start', active: 'in-progress',
  }
  return legacy[s] ?? 'yet-to-start'
}

const BILLING_TYPES: { id: BillingType; label: string; desc: string }[] = [
  { id: 'hourly',   label: 'Hourly',   desc: 'Billed per hour logged'      },
  { id: 'fixed',    label: 'Fixed',    desc: 'One-time fixed project fee'  },
  { id: 'retainer', label: 'Retainer', desc: 'Monthly recurring engagement'},
]

const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'AED']
const PAYMENT_TERMS_OPTIONS = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Immediate']

const MANAGER_LIST = ['Priya Mehta', 'Arjun Menon', 'Raj Kumar', 'Sunita Rao', 'Dev Team Lead']
const MEMBER_LIST  = ['Sarah Johnson', 'Ravi Kumar', 'Meera Pillai', 'Deepak Nair', 'Ananya Singh', 'Vikram Sharma', 'Kiran Babu', 'Pooja Iyer']
const ROLE_LIST    = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer', 'QA Engineer', 'DevOps Engineer', 'Business Analyst', 'Scrum Master']

// Default team pre-fill for Edit Project (used when the project has no saved team yet)
const DEFAULT_MANAGER = 'Priya Mehta'
const DEFAULT_ROLE_GROUPS: RoleGroup[] = [
  { id: 1, role: 'Frontend Developer', members: [
    { name: 'Sarah Johnson', allocation: 100 },
    { name: 'Ravi Kumar',    allocation: 80  },
  ]},
  { id: 2, role: 'Backend Developer', members: [
    { name: 'Deepak Nair',    allocation: 100 },
    { name: 'Vikram Sharma',  allocation: 60  },
  ]},
  { id: 3, role: 'QA Engineer', members: [
    { name: 'Pooja Iyer', allocation: 50 },
  ]},
]


const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', surface: '#F7F8FC' }

// ── Helpers ───────────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
  fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none',
  border: `1px solid ${C.border}`, background: '#fff',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s',
}

const LABEL: React.CSSProperties = {
  fontSize: 11.5, fontWeight: 700, color: '#8B90A7',
  letterSpacing: '0.06em', textTransform: 'uppercase',
  display: 'block', marginBottom: 7,
}

let _id = 100
const uid = () => ++_id


// ── Simple select ─────────────────────────────────────────────────────────────
function Select({ value, options, onChange, placeholder }: { value: string; options: string[]; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{ ...inputStyle, appearance: 'none', paddingRight: 36, cursor: 'pointer', color: value ? C.navy : C.muted }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
    </div>
  )
}

// ── Step 1: Project Details ───────────────────────────────────────────────────
function Step1({ data, set }: { data: FormData; set: (p: Partial<FormData>) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label style={LABEL}>Project Name <Req /></label>
          <div style={{ position: 'relative' }}>
            <Briefcase size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input value={data.projectName} onChange={e => set({ projectName: e.target.value })}
              placeholder="e.g. Pulse.AI Platform v3"
              style={{ ...inputStyle, paddingLeft: 38 }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
          </div>
        </div>

        <div>
          <label style={LABEL}>Client Name <Req /></label>
          <div style={{ position: 'relative' }}>
            <Building2 size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input value={data.clientName} onChange={e => set({ clientName: e.target.value })}
              placeholder="e.g. HDFC Bank"
              style={{ ...inputStyle, paddingLeft: 38 }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
          </div>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={LABEL}>Description</label>
          <textarea value={data.description} onChange={e => set({ description: e.target.value })}
            placeholder="Brief overview of the project scope, objectives, and deliverables…"
            rows={4}
            style={{ width: '100%', borderRadius: 10, padding: '12px 14px', fontSize: 13.5, fontWeight: 400, color: C.navy, outline: 'none', border: `1px solid ${C.border}`, background: '#fff', resize: 'vertical', lineHeight: 1.7, fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s' }}
            onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <label style={LABEL}>Project Status</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {STATUSES.map(s => (
              <button key={s.id} onClick={() => set({ status: s.id })}
                style={{ height: 40, borderRadius: 9, border: `1px solid ${data.status === s.id ? s.border : C.border}`, background: data.status === s.id ? s.bg : '#fff', color: data.status === s.id ? s.color : C.muted, fontSize: 12.5, fontWeight: data.status === s.id ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', transition: 'all 0.13s', outline: 'none', padding: '0 14px' }}
                onMouseEnter={e => { if (data.status !== s.id) e.currentTarget.style.background = C.surface }}
                onMouseLeave={e => { if (data.status !== s.id) e.currentTarget.style.background = '#fff' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: data.status === s.id ? s.color : '#D0D4E4', display: 'inline-block', flexShrink: 0, transition: 'background 0.13s' }} />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Details Section */}
      <div style={{ marginTop: 28 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 20 }}>Timeline Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          <div>
            <label style={LABEL}>Start Date</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#999999', pointerEvents: 'none', zIndex: 1 }} />
              <input type="date" value={data.startDate} onChange={e => set({ startDate: e.target.value })}
                style={{ ...inputStyle, paddingLeft: 38, cursor: 'pointer', color: data.startDate ? C.navy : C.muted }}
                onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
            </div>
          </div>
          <div>
            <label style={LABEL}>End Date</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#999999', pointerEvents: 'none', zIndex: 1 }} />
              <input type="date" value={data.endDate} onChange={e => set({ endDate: e.target.value })}
                style={{ ...inputStyle, paddingLeft: 38, cursor: 'pointer', color: data.endDate ? C.navy : C.muted }}
                onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
            </div>
          </div>
          <div>
            <label style={LABEL}>Planned Start</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#999999', pointerEvents: 'none', zIndex: 1 }} />
              <input type="date" value={data.plannedStart} onChange={e => set({ plannedStart: e.target.value })}
                style={{ ...inputStyle, paddingLeft: 38, cursor: 'pointer', color: data.plannedStart ? C.navy : C.muted }}
                onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
            </div>
          </div>
          <div>
            <label style={LABEL}>Planned End</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#999999', pointerEvents: 'none', zIndex: 1 }} />
              <input type="date" value={data.plannedEnd} onChange={e => set({ plannedEnd: e.target.value })}
                style={{ ...inputStyle, paddingLeft: 38, cursor: 'pointer', color: data.plannedEnd ? C.navy : C.muted }}
                onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
            </div>
          </div>
          <div>
            <label style={LABEL}>Actual Start</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#999999', pointerEvents: 'none', zIndex: 1 }} />
              <input type="date" value={data.actualStart} onChange={e => set({ actualStart: e.target.value })}
                style={{ ...inputStyle, paddingLeft: 38, cursor: 'pointer', color: data.actualStart ? C.navy : C.muted }}
                onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
            </div>
          </div>
          <div>
            <label style={LABEL}>Actual End</label>
            <div style={{ position: 'relative' }}>
              <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#999999', pointerEvents: 'none', zIndex: 1 }} />
              <input type="date" value={data.actualEnd} onChange={e => set({ actualEnd: e.target.value })}
                style={{ ...inputStyle, paddingLeft: 38, cursor: 'pointer', color: data.actualEnd ? C.navy : C.muted }}
                onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
            </div>
          </div>
        </div>

        <div>
          <label style={LABEL}>SoW Signed</label>
          <div style={{ position: 'relative' }}>
            <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#999999', pointerEvents: 'none', zIndex: 1 }} />
            <input type="date" value={data.sowSigned} onChange={e => set({ sowSigned: e.target.value })}
              style={{ ...inputStyle, paddingLeft: 38, cursor: 'pointer', color: data.sowSigned ? C.navy : C.muted }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Step 2: Team Details ──────────────────────────────────────────────────────
function Step2({ data, set }: { data: FormData; set: (p: Partial<FormData>) => void }) {
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(data.roleGroups[0]?.id ?? null)
  const [memberSearch,   setMemberSearch]   = useState('')
  const [managerSearch,  setManagerSearch]  = useState('')
  const [managerOpen,    setManagerOpen]    = useState(false)
  const [addingRole,     setAddingRole]     = useState(false)
  const [roleSearch,     setRoleSearch]     = useState('')

  const currentGroup = data.roleGroups.find(rg => rg.id === selectedRoleId) ?? null

  // Employees available to add to current role (not yet in it, matches search)
  const available = MEMBER_LIST.filter(m =>
    !currentGroup?.members.some(rm => rm.name === m) &&
    m.toLowerCase().includes(memberSearch.toLowerCase())
  )

  // Roles not yet added
  const unusedRoles = ROLE_LIST.filter(r =>
    !data.roleGroups.some(rg => rg.role === r) &&
    r.toLowerCase().includes(roleSearch.toLowerCase())
  )

  function addRoleGroup(role: string) {
    const newGroup: RoleGroup = { id: uid(), role, members: [] }
    set({ roleGroups: [...data.roleGroups, newGroup] })
    setSelectedRoleId(newGroup.id)
    setAddingRole(false)
    setRoleSearch('')
  }

  function removeRoleGroup(id: number) {
    set({ roleGroups: data.roleGroups.filter(rg => rg.id !== id) })
    if (selectedRoleId === id) setSelectedRoleId(null)
  }

  function addMemberToRole(name: string) {
    if (!currentGroup) return
    set({ roleGroups: data.roleGroups.map(rg =>
      rg.id === selectedRoleId ? { ...rg, members: [...rg.members, { name, allocation: 100 }] } : rg
    )})
    setMemberSearch('')
  }

  function removeMemberFromRole(roleId: number, name: string) {
    set({ roleGroups: data.roleGroups.map(rg =>
      rg.id === roleId ? { ...rg, members: rg.members.filter(m => m.name !== name) } : rg
    )})
  }

  function updateAllocation(roleId: number, name: string, allocation: number) {
    set({ roleGroups: data.roleGroups.map(rg =>
      rg.id === roleId ? { ...rg, members: rg.members.map(m => m.name === name ? { ...m, allocation } : m) } : rg
    )})
  }

  const filteredManagers = MANAGER_LIST.filter(m =>
    m.toLowerCase().includes(managerSearch.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Project Manager — searchable ── */}
      <div>
        <label style={LABEL}>Project Manager</label>
        {managerOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 49 }} onClick={() => setManagerOpen(false)} />
        )}
        <div style={{ position: 'relative', zIndex: 50 }}>
          {data.manager ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 44, padding: '0 14px', borderRadius: 10, border: `1px solid rgba(99,102,241,0.35)`, background: 'rgba(99,102,241,0.05)' }}>
              <img src={`https://i.pravatar.cc/40?u=${data.manager}`} alt={data.manager} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '1.5px solid rgba(99,102,241,0.20)' }} />
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: C.navy }}>{data.manager}</span>
              <button onClick={() => { set({ manager: '' }); setManagerSearch('') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: C.muted, lineHeight: 0 }}
                onMouseEnter={e => { e.currentTarget.style.color = '#E84855' }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
                <X size={13} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
              <input
                value={managerSearch}
                onChange={e => { setManagerSearch(e.target.value); setManagerOpen(true) }}
                onFocus={() => setManagerOpen(true)}
                placeholder="Search and select project manager…"
                style={{ ...inputStyle, paddingLeft: 38 }}
              />
              {managerOpen && filteredManagers.length > 0 && (
                <div style={{ position: 'absolute', top: 'calc(100% + 5px)', left: 0, right: 0, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: '0 8px 28px rgba(28,32,53,0.12)', zIndex: 100, overflow: 'hidden' }}>
                  {filteredManagers.map(m => (
                    <button key={m}
                      onMouseDown={() => { set({ manager: m }); setManagerOpen(false); setManagerSearch('') }}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 14px', border: 'none', background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                      <img src={`https://i.pravatar.cc/40?u=${m}`} alt={m} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1.5px solid ${C.border}` }} />
                      <span style={{ fontSize: 13.5, fontWeight: 500, color: C.navy }}>{m}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div style={{ height: 1, background: C.border }} />

      {/* ── Role-based Team Assignment ── */}
      <div>
        <label style={LABEL}>Team Assignment by Role</label>
        <div style={{ display: 'grid', gridTemplateColumns: '270px 1fr', gap: 0, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', minHeight: 380 }}>

          {/* Left: Roles panel */}
          <div style={{ borderRight: `1px solid ${C.border}`, background: C.surface, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '12px 12px 8px', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Roles</span>
            </div>

            <div style={{ flex: 1, padding: '8px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {data.roleGroups.length === 0 && !addingRole && (
                <div style={{ padding: '20px 10px', textAlign: 'center' }}>
                  <Briefcase size={18} strokeWidth={1.4} style={{ color: '#C8CCE0', margin: '0 auto 6px' }} />
                  <p style={{ fontSize: 11.5, color: '#B0B4C8', margin: 0 }}>No roles added yet</p>
                </div>
              )}

              {data.roleGroups.map(rg => {
                const isActive = selectedRoleId === rg.id
                return (
                  <div key={rg.id}
                    onClick={() => { setSelectedRoleId(rg.id); setMemberSearch('') }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 9, background: isActive ? '#fff' : 'transparent', border: `1px solid ${isActive ? 'rgba(99,102,241,0.25)' : 'transparent'}`, cursor: 'pointer', transition: 'all 0.12s', position: 'relative' }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#ECEEF5' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: isActive ? 700 : 500, color: isActive ? '#5B5FDE' : '#3D4266', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rg.role}</div>
                      <div style={{ fontSize: 10.5, color: C.muted, marginTop: 1 }}>{rg.members.length} member{rg.members.length !== 1 ? 's' : ''} assigned</div>
                    </div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'rgba(99,102,241,0.12)' : '#E8EAF2', color: isActive ? '#5B5FDE' : C.muted, flexShrink: 0, padding: '0 5px' }}>
                      {rg.members.length}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); removeRoleGroup(rg.id) }}
                      style={{ width: 20, height: 20, borderRadius: 5, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C8CCE0', padding: 0, flexShrink: 0, transition: 'all 0.12s' }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#E84855'; e.currentTarget.style.background = 'rgba(232,72,85,0.08)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#C8CCE0'; e.currentTarget.style.background = 'transparent' }}>
                      <X size={10} strokeWidth={2.5} />
                    </button>
                  </div>
                )
              })}

              {/* Add role inline */}
              {addingRole && (
                <div style={{ padding: '8px', background: '#fff', borderRadius: 9, border: `1px solid rgba(99,102,241,0.25)` }}>
                  <div style={{ position: 'relative', marginBottom: 6 }}>
                    <Search size={11} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                    <input autoFocus value={roleSearch} onChange={e => setRoleSearch(e.target.value)}
                      placeholder="Search role…"
                      style={{ width: '100%', height: 32, paddingLeft: 26, paddingRight: 8, fontSize: 12, border: `1px solid ${C.border}`, borderRadius: 7, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', color: C.navy }}
                      onFocus={e => { e.target.style.borderColor = '#6366F1' }}
                      onBlur={e => { e.target.style.borderColor = C.border }}
                      onKeyDown={e => { if (e.key === 'Escape') { setAddingRole(false); setRoleSearch('') } if (e.key === 'Enter' && roleSearch.trim()) addRoleGroup(roleSearch.trim()) }} />
                  </div>
                  <div style={{ maxHeight: 130, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {unusedRoles.slice(0, 6).map(r => (
                      <button key={r} onMouseDown={() => addRoleGroup(r)}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: 'none', background: 'transparent', textAlign: 'left', fontSize: 11.5, color: C.navy, cursor: 'pointer', fontFamily: 'inherit' }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.surface }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                        {r}
                      </button>
                    ))}
                    {roleSearch.trim() && !ROLE_LIST.includes(roleSearch.trim()) && (
                      <button onMouseDown={() => addRoleGroup(roleSearch.trim())}
                        style={{ width: '100%', padding: '6px 8px', borderRadius: 6, border: 'none', background: 'rgba(99,102,241,0.07)', textAlign: 'left', fontSize: 11.5, color: '#5B5FDE', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                        + Add "{roleSearch.trim()}"
                      </button>
                    )}
                  </div>
                  <button onClick={() => { setAddingRole(false); setRoleSearch('') }}
                    style={{ width: '100%', marginTop: 4, fontSize: 11, color: C.muted, border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: '4px 0' }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Add role button */}
            {!addingRole && (
              <div style={{ padding: '10px 12px', borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => setAddingRole(true)}
                  style={{ width: '100%', height: 34, borderRadius: 9, border: `1.5px dashed rgba(99,102,241,0.35)`, background: 'rgba(99,102,241,0.04)', color: '#6366F1', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontFamily: 'inherit', transition: 'all 0.13s', outline: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.04)' }}>
                  <Plus size={12} strokeWidth={2.5} /> Add Role
                </button>
              </div>
            )}
          </div>

          {/* Right: Member assignment panel */}
          {!currentGroup ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#fff' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Users size={22} strokeWidth={1.3} style={{ color: '#C8CCE0' }} />
              </div>
              <p style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, margin: '0 0 5px' }}>Select a role</p>
              <p style={{ fontSize: 12.5, color: C.muted, margin: 0, textAlign: 'center', lineHeight: 1.55 }}>Choose a role from the left panel<br />to assign team members</p>
            </div>
          ) : (
            <div style={{ background: '#fff', display: 'flex', flexDirection: 'column' }}>
              {/* Role header */}
              <div style={{ padding: '14px 18px 12px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{currentGroup.role}</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                  {currentGroup.members.length === 0 ? 'No members assigned yet' : `${currentGroup.members.length} member${currentGroup.members.length !== 1 ? 's' : ''} assigned`}
                </div>
              </div>

              <div style={{ padding: '14px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Search employees */}
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                  <input
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    placeholder="Search employees to assign…"
                    style={{ ...inputStyle, height: 40, paddingLeft: 36, fontSize: 13 }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)' }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                  />
                </div>

                {/* Search results dropdown — hidden once search is empty */}
                {memberSearch && (
                  available.length > 0 ? (
                    <div style={{ border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', maxHeight: 180, overflowY: 'auto' }}>
                      {available.map((emp, idx) => (
                        <button key={emp}
                          onMouseDown={() => addMemberToRole(emp)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 14px', border: 'none', borderBottom: idx < available.length - 1 ? `1px solid #F0F2F8` : 'none', background: '#fff', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.04)' }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
                          <img src={`https://i.pravatar.cc/32?u=${emp}`} alt="" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1px solid ${C.border}` }} />
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: C.navy }}>{emp}</span>
                          <span style={{ fontSize: 11.5, fontWeight: 600, color: '#5B5FDE', display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Plus size={11} strokeWidth={2.5} /> Add
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '12px 14px', borderRadius: 10, background: C.surface, border: `1px solid ${C.border}`, textAlign: 'center' }}>
                      <p style={{ fontSize: 12.5, color: C.muted, margin: 0 }}>No employees match "{memberSearch}"</p>
                    </div>
                  )
                )}

                {/* Assigned members — rows with allocation + delete */}
                {currentGroup.members.length > 0 && (
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>Assigned</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {currentGroup.members.map(m => (
                        <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 10, background: '#FAFBFE', border: `1px solid ${C.border}` }}>
                          <img src={`https://i.pravatar.cc/32?u=${m.name}`} alt="" style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1px solid ${C.border}` }} />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                            <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{currentGroup.role}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                            <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Allocation</span>
                            <div style={{ position: 'relative', width: 62 }}>
                              <input
                                type="number" min={10} max={100} step={5}
                                value={m.allocation}
                                onChange={e => updateAllocation(currentGroup.id, m.name, Math.min(100, Math.max(10, Number(e.target.value))))}
                                style={{ width: '100%', height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', fontSize: 12.5, fontWeight: 700, color: C.navy, textAlign: 'center', outline: 'none', fontFamily: 'inherit', paddingRight: 14, boxSizing: 'border-box' }}
                                onFocus={e => { e.target.style.borderColor = '#6366F1' }}
                                onBlur={e => { e.target.style.borderColor = C.border }}
                              />
                              <span style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: C.muted, fontWeight: 700, pointerEvents: 'none' }}>%</span>
                            </div>
                          </div>
                          <button onClick={() => removeMemberFromRole(currentGroup.id, m.name)}
                            style={{ width: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, flexShrink: 0, transition: 'all 0.13s', outline: 'none' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.30)'; e.currentTarget.style.color = '#E84855' }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                            <X size={11} strokeWidth={2.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Step 3: Rate Card ─────────────────────────────────────────────────────────
function Step3({ data, set }: { data: FormData; set: (p: Partial<FormData>) => void }) {
  function addRate() {
    set({ rates: [...data.rates, { id: uid(), role: '', rate: '', currency: 'USD' }] })
  }
  function updateRate(id: number, patch: Partial<RateRow>) {
    set({ rates: data.rates.map(r => r.id === id ? { ...r, ...patch } : r) })
  }
  function removeRate(id: number) {
    set({ rates: data.rates.filter(r => r.id !== id) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Billing Type */}
      <div>
        <label style={LABEL}>Billing Type</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {BILLING_TYPES.map(b => (
            <button key={b.id} onClick={() => set({ billingType: b.id })}
              style={{ padding: '14px 16px', borderRadius: 11, border: `1px solid ${data.billingType === b.id ? 'rgba(99,102,241,0.45)' : C.border}`, background: data.billingType === b.id ? 'rgba(99,102,241,0.06)' : '#fff', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.13s', outline: 'none' }}
              onMouseEnter={e => { if (data.billingType !== b.id) e.currentTarget.style.background = C.surface }}
              onMouseLeave={e => { if (data.billingType !== b.id) e.currentTarget.style.background = '#fff' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: data.billingType === b.id ? '#5B5FDE' : C.navy, marginBottom: 3 }}>{b.label}</div>
              <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>{b.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Billing Info */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label style={LABEL}>PO / Contract Number</label>
          <input value={data.poNumber} onChange={e => set({ poNumber: e.target.value })}
            placeholder="e.g. PO-2026-0089"
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
        </div>
        <div>
          <label style={LABEL}>Payment Terms</label>
          <Select value={data.paymentTerms} options={PAYMENT_TERMS_OPTIONS} onChange={v => set({ paymentTerms: v })} placeholder="Select payment terms" />
        </div>
      </div>

      {/* Rate rows */}
      <div>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <label style={{ ...LABEL, margin: 0 }}>Resource-wise Rate Details</label>
          <button onClick={addRate}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 32, padding: '0 12px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.30)', background: 'rgba(99,102,241,0.06)', color: '#5B5FDE', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s', outline: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)' }}>
            <Plus size={12} strokeWidth={2.5} /> Add Row
          </button>
        </div>

        {data.rates.length === 0 ? (
          <div style={{ padding: '28px 20px', textAlign: 'center', borderRadius: 12, border: `1.5px dashed ${C.border}`, background: C.surface }}>
            <DollarSign size={22} strokeWidth={1.4} style={{ color: '#C8CCE0', margin: '0 auto 8px' }} />
            <p style={{ fontSize: 13, color: C.muted, margin: 0, fontWeight: 500 }}>No rate rows yet</p>
            <p style={{ fontSize: 12, color: '#B0B4C8', margin: '4px 0 0' }}>Add resource roles with their billing rates</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 100px 36px', gap: 8, padding: '0 4px', marginBottom: 2 }}>
              {['Role / Resource', 'Rate', 'Currency', ''].map(h => (
                <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>
            {data.rates.map(r => (
              <div key={r.id} className="grid items-center" style={{ gridTemplateColumns: '2fr 1fr 100px 36px', gap: 8, padding: '12px 14px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 11 }}>
                <select value={r.role} onChange={e => updateRate(r.id, { role: e.target.value })}
                  style={{ ...inputStyle, height: 38, fontSize: 13, paddingRight: 28, appearance: 'none', cursor: 'pointer', color: r.role ? C.navy : C.muted }}>
                  <option value="">Select role</option>
                  {ROLE_LIST.map(rl => <option key={rl} value={rl}>{rl}</option>)}
                </select>
                <input value={r.rate} onChange={e => updateRate(r.id, { rate: e.target.value })}
                  placeholder="0.00" type="number" min={0}
                  style={{ ...inputStyle, height: 38, fontSize: 13 }}
                  onFocus={e => { e.target.style.borderColor = '#6366F1' }}
                  onBlur={e => { e.target.style.borderColor = C.border }} />
                <select value={r.currency} onChange={e => updateRate(r.id, { currency: e.target.value })}
                  style={{ ...inputStyle, height: 38, fontSize: 13, paddingRight: 28, appearance: 'none', cursor: 'pointer' }}>
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={() => removeRate(r.id)}
                  style={{ width: 36, height: 36, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, transition: 'all 0.13s', outline: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.08)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.30)'; e.currentTarget.style.color = '#E84855' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                  <X size={13} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}



// ── Required asterisk ─────────────────────────────────────────────────────────
function Req() {
  return <span style={{ color: '#E84855', marginLeft: 2 }}>*</span>
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function EditProjectPage({
  project,
  onBack,
  onSave,
}: {
  project: any
  onBack: () => void
  onSave: () => void
}) {
  const [step, setStep] = useState(1)
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [form, setFormRaw] = useState<FormData>({
    projectName:  project.name || '',
    description:  project.description || '',
    clientName:   project.client || '',
    startDate:    project.startDate || '',
    endDate:      project.endDate || '',
    plannedStart: project.plannedStart || '',
    plannedEnd:   project.plannedEnd || '',
    actualStart:  project.actualStart || '',
    actualEnd:    project.actualEnd || '',
    sowSigned:    project.sowSigned || '',
    status:       normalizeStatus(project.status || ''),
    manager:      project.manager || DEFAULT_MANAGER,
    roleGroups:   project.roleGroups?.length ? project.roleGroups : DEFAULT_ROLE_GROUPS,
    billingType:  project.billingType || 'hourly',
    poNumber:     project.poNumber || '',
    paymentTerms: project.paymentTerms || '',
    rates:        project.rates || [],
  })

  function set(patch: Partial<FormData>) { setFormRaw(f => ({ ...f, ...patch })) }

  async function handleSubmit() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitting(false)
    setSaved(true)
    setTimeout(onSave, 1400)
  }

  const pct = Math.round(((step - 1) / (STEPS.length - 1)) * 100)

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes apFadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes apSpin    { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        @keyframes apPop     { 0%{transform:scale(0.7);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        input[type="date"]::-webkit-calendar-picker-indicator { display: none; }
        input[type="date"]::-webkit-outer-spin-button,
        input[type="date"]::-webkit-inner-spin-button { display: none; }
      `}</style>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2" style={{ marginBottom: 22 }}>
        <button onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s', outline: 'none' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}>
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <button onClick={onBack} style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
          All Projects
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Edit Project</span>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '260px 1fr', alignItems: 'start' }}>

        {/* ── Left: Step navigator ── */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', position: 'sticky', top: 24 }}>
          <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}`, background: 'linear-gradient(135deg, #F5F6FF 0%, #ECEEF8 100%)' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 3 }}>Edit Project</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Step {step} of {STEPS.length}</div>
            <div style={{ marginTop: 14, height: 4, borderRadius: 99, background: '#DDE0F0', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: 'linear-gradient(90deg, #818CF8, #6366F1)', transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
            </div>
          </div>
          <div style={{ padding: '12px 10px' }}>
            {STEPS.map((s, idx) => {
              const done    = step > s.id
              const current = step === s.id
              const Icon    = s.Icon
              return (
                <button key={s.id}
                  onClick={() => setStep(s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 10px', borderRadius: 11, border: 'none', background: current ? 'rgba(99,102,241,0.08)' : 'transparent', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.13s', textAlign: 'left', outline: 'none' }}
                  onMouseEnter={e => { if (!current) e.currentTarget.style.background = C.surface }}
                  onMouseLeave={e => { if (!current) e.currentTarget.style.background = 'transparent' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? 'rgba(14,168,106,0.10)' : current ? 'rgba(99,102,241,0.12)' : '#F0F2F8', border: `1px solid ${done ? 'rgba(14,168,106,0.25)' : current ? 'rgba(99,102,241,0.25)' : C.border}`, transition: 'all 0.2s' }}>
                    {done
                      ? <Check size={15} strokeWidth={2.5} style={{ color: '#0EA86A' }} />
                      : <Icon size={15} strokeWidth={1.8} style={{ color: current ? '#6366F1' : C.muted }} />
                    }
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: done || current ? 700 : 500, color: current ? '#5B5FDE' : done ? '#0A8A58' : '#5A6080', lineHeight: 1.3, transition: 'color 0.15s' }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#B0B4C8', fontWeight: 400, marginTop: 1 }}>{s.sub}</div>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: done ? 'rgba(14,168,106,0.10)' : '#F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', flexShrink: 0 }}>
                      <ChevronRight size={9} strokeWidth={2.5} style={{ color: done ? '#0EA86A' : '#C8CCE0' }} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Optional fields note */}
          <div style={{ margin: '0 12px 12px', padding: '12px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: '#B45309', marginBottom: 3 }}>Flexible editing</div>
            <div style={{ fontSize: 11, color: '#92400E', lineHeight: 1.55 }}>Update any section independently. Only Project Name &amp; Client are required.</div>
          </div>
        </div>

        {/* ── Right: Form card ── */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>

          {/* Step header */}
          <div style={{ padding: '22px 28px 18px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
            <div className="flex items-center gap-3">
              {(() => {
                const s = STEPS[step - 1]
                const Icon = s.Icon
                return (
                  <>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={18} strokeWidth={1.8} style={{ color: '#5B5FDE' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: C.navy, letterSpacing: '-0.2px' }}>{s.label}</div>
                      <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>{s.sub}</div>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>

          {/* Form body */}
          <div style={{ padding: '28px 28px', minHeight: 400, animation: 'apFadeIn 0.22s ease-out' }} key={step}>
            {step === 1 && <Step1 data={form} set={set} />}
            {step === 2 && <Step2 data={form} set={set} />}
            {step === 3 && <Step3 data={form} set={set} />}
          </div>

          {/* Footer navigation */}
          <div className="flex items-center justify-between" style={{ padding: '18px 28px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE' }}>
            <button
              onClick={() => step > 1 ? setStep(s => s - 1) : onBack()}
              style={{ height: 42, padding: '0 20px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', outline: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
              {step === 1 ? 'Cancel' : '← Previous'}
            </button>

            <div className="flex items-center gap-3">
              {step < STEPS.length ? (
                <button onClick={() => setStep(s => s + 1)}
                  style={{ height: 42, padding: '0 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, transition: 'opacity 0.15s', outline: 'none' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                  Next <ChevronRight size={15} strokeWidth={2.3} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={submitting}
                  style={{ height: 42, padding: '0 24px', borderRadius: 10, border: 'none', background: submitting ? '#818CF8' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, transition: 'opacity 0.15s', outline: 'none' }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = '0.88' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                  {submitting ? (
                    <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'apSpin 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Saving…</>
                  ) : (
                    <><Check size={15} strokeWidth={2.5} />Save Changes</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success overlay */}
      {saved && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          <div style={{ background: '#fff', borderRadius: 24, width: 400, padding: '44px 36px 36px', boxShadow: '0 24px 64px rgba(10,12,28,0.18)', textAlign: 'center', animation: 'apFadeIn 0.25s ease-out' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(14,168,106,0.10)', border: '2px solid rgba(14,168,106,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', animation: 'apPop 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}>
              <Check size={32} strokeWidth={2.5} style={{ color: '#0EA86A' }} />
            </div>
            <div style={{ fontSize: 21, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px', marginBottom: 8 }}>Project Updated!</div>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, margin: '0 0 6px' }}>
              <strong style={{ color: C.navy }}>{form.projectName || 'Project'}</strong> has been updated successfully.
            </p>
            <p style={{ fontSize: 12.5, color: '#B0B4C8', margin: 0 }}>Redirecting you back…</p>
          </div>
        </div>
      )}
    </div>
  )
}
