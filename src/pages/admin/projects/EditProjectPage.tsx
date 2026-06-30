import { useState } from 'react'
import {
  ArrowLeft, ChevronRight, Check, Trash2,
  FileText, Users, DollarSign,
  Plus, X, Calendar, Building2,
  Briefcase, ChevronDown, Search,
} from 'lucide-react'

type ProjectStatus = 'active' | 'on-hold' | 'planning' | 'completed' | 'yet-to-start' | 'draft'
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

interface ProjectData {
  id: string
  projectName: string
  description: string
  clientName: string
  startDate: string
  endDate: string
  plannedStart: string
  plannedEnd: string
  actualStart: string
  actualEnd: string
  sowSigned: string
  status: ProjectStatus
  manager: string
  roleGroups: RoleGroup[]
  billingType: BillingType
  poNumber: string
  paymentTerms: string
  rates: RateRow[]
}

interface FormData {
  projectName: string
  description: string
  clientName: string
  startDate: string
  endDate: string
  plannedStart: string
  plannedEnd: string
  actualStart: string
  actualEnd: string
  sowSigned: string
  status: ProjectStatus
  manager: string
  roleGroups: RoleGroup[]
  billingType: BillingType
  poNumber: string
  paymentTerms: string
  rates: RateRow[]
}

const STEPS = [
  { id: 1, label: 'Project Details', sub: 'Name, client & full timeline',   Icon: FileText   },
  { id: 2, label: 'Team Details',    sub: 'Manager & members',              Icon: Users      },
  { id: 3, label: 'Rate Card',       sub: 'Billing & rates',                Icon: DollarSign },
]

const STATUSES: { id: ProjectStatus; label: string; color: string; bg: string; border: string }[] = [
  { id: 'planning',      label: 'Planning',      color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)'  },
  { id: 'active',        label: 'Active',        color: '#0A8A58', bg: 'rgba(14,168,106,0.08)',  border: 'rgba(14,168,106,0.25)'  },
  { id: 'on-hold',       label: 'On Hold',       color: '#B45309', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)'  },
  { id: 'completed',     label: 'Completed',     color: '#1D4ED8', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)'  },
  { id: 'yet-to-start',  label: 'Yet to start',  color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)'  },
  { id: 'draft',         label: 'Draft',         color: '#6B7280', bg: 'rgba(107,114,128,0.08)',  border: 'rgba(107,114,128,0.25)'  },
]

const BILLING_TYPES: { id: BillingType; label: string; desc: string }[] = [
  { id: 'hourly',   label: 'Hourly',   desc: 'Billed per hour logged'      },
  { id: 'fixed',    label: 'Fixed',    desc: 'One-time fixed project fee'  },
  { id: 'retainer', label: 'Retainer', desc: 'Monthly recurring engagement'},
]

const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'AED']
const PAYMENT_TERMS_OPTIONS = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Immediate']
const MANAGER_LIST = ['Priya Mehta', 'Arjun Menon', 'Raj Kumar', 'Sunita Rao', 'Dev Team Lead']
const ROLE_LIST    = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'UI/UX Designer', 'QA Engineer', 'DevOps Engineer', 'Business Analyst', 'Scrum Master']

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', surface: '#F7F8FC' }

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

function Select({ value, options, onChange, placeholder }: { value: string; options: string[]; onChange: (v: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)}
        style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 12, color: value ? C.navy : C.muted, fontSize: 13.5 }}>
        {value || placeholder || 'Select...'}
        <ChevronDown size={14} style={{ color: C.muted, flexShrink: 0 }} strokeWidth={2} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4, zIndex: 10, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', maxHeight: 240, overflowY: 'auto' }}>
          {options.map((opt, i) => (
            <button key={i} onClick={() => { onChange(opt); setOpen(false) }}
              style={{ width: '100%', padding: '12px 14px', textAlign: 'left', border: 'none', background: value === opt ? '#F0F2F8' : '#fff', color: C.navy, cursor: 'pointer', fontSize: 13.5, fontFamily: 'inherit', borderBottom: i < options.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.12s' }}
              onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = '#F7F8FC' }}
              onMouseLeave={e => { e.currentTarget.style.background = value === opt ? '#F0F2F8' : '#fff' }}>
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Step1({ data, set }: { data: FormData; set: (p: Partial<FormData>) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={LABEL}>Project Name *</label>
        <input type="text" value={data.projectName} onChange={e => set({ projectName: e.target.value })}
          placeholder="e.g., Mobile App Redesign"
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
          onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
      </div>

      <div>
        <label style={LABEL}>Description</label>
        <textarea value={data.description} onChange={e => set({ description: e.target.value })}
          placeholder="Project overview and key objectives..."
          style={{ ...inputStyle, height: 100, padding: '12px 14px', resize: 'none', fontFamily: 'inherit' }}
          onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
          onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
      </div>

      <div>
        <label style={LABEL}>Client Name *</label>
        <input type="text" value={data.clientName} onChange={e => set({ clientName: e.target.value })}
          placeholder="Client or company name"
          style={inputStyle}
          onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
          onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
      </div>

      <div>
        <label style={LABEL}>Status *</label>
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

      <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 20 }}>Timeline Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {['Start Date', 'End Date', 'Planned Start', 'Planned End', 'Actual Start', 'Actual End'].map((label, idx) => {
            const fieldMap: Record<string, keyof FormData> = {
              'Start Date': 'startDate', 'End Date': 'endDate',
              'Planned Start': 'plannedStart', 'Planned End': 'plannedEnd',
              'Actual Start': 'actualStart', 'Actual End': 'actualEnd',
            }
            const field = fieldMap[label]
            return (
              <div key={label}>
                <label style={LABEL}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#999999', pointerEvents: 'none', zIndex: 1 }} />
                  <input type="date" value={data[field]} onChange={e => set({ [field]: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: 38, cursor: 'pointer', color: data[field] ? C.navy : C.muted }}
                    onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
                </div>
              </div>
            )
          })}
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

function Step2({ data, set }: { data: FormData; set: (p: Partial<FormData>) => void }) {
  return (
    <div>
      <label style={LABEL}>Project Manager *</label>
      <Select value={data.manager} options={MANAGER_LIST} onChange={m => set({ manager: m })} placeholder="Select a manager" />
      <div style={{ marginTop: 20, padding: '16px', background: '#F7F8FC', borderRadius: 12, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
        <strong>Team Members:</strong> Configure team allocations in Step 2 when adding a new project. Edit team members through the project details page after creation.
      </div>
    </div>
  )
}

function Step3({ data, set }: { data: FormData; set: (p: Partial<FormData>) => void }) {
  const handleAddRate = () => set({ rates: [...data.rates, { id: uid(), role: '', rate: '', currency: 'USD' }] })
  const handleRemoveRate = (id: number) => set({ rates: data.rates.filter(r => r.id !== id) })
  const handleUpdateRate = (id: number, field: string, value: string) => {
    set({ rates: data.rates.map(r => r.id === id ? { ...r, [field]: value } : r) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <label style={LABEL}>Billing Type *</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {BILLING_TYPES.map(bt => (
            <button key={bt.id} onClick={() => set({ billingType: bt.id })}
              style={{ padding: '14px 16px', border: `1.5px solid ${data.billingType === bt.id ? '#6366F1' : C.border}`, borderRadius: 12, background: data.billingType === bt.id ? 'rgba(99,102,241,0.06)' : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.13s', fontFamily: 'inherit' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: data.billingType === bt.id ? '#6366F1' : C.navy, marginBottom: 2 }}>{bt.label}</div>
              <div style={{ fontSize: 12, color: C.muted }}>{bt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={LABEL}>PO Number</label>
        <input type="text" value={data.poNumber} onChange={e => set({ poNumber: e.target.value })}
          placeholder="Purchase Order number" style={inputStyle}
          onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
          onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
      </div>

      <div>
        <label style={LABEL}>Payment Terms</label>
        <Select value={data.paymentTerms} options={PAYMENT_TERMS_OPTIONS} onChange={pt => set({ paymentTerms: pt })} placeholder="Select payment terms" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label style={{ ...LABEL, margin: 0 }}>Rate Card</label>
          <button onClick={handleAddRate}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 32, padding: '0 12px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.30)', background: 'rgba(99,102,241,0.06)', color: '#5B5FDE', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s', outline: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)' }}>
            <Plus size={12} strokeWidth={2.5} /> Add Rate
          </button>
        </div>

        {data.rates.length === 0 ? (
          <div style={{ padding: '28px 20px', textAlign: 'center', borderRadius: 12, border: `1.5px dashed ${C.border}`, background: C.surface }}>
            <DollarSign size={22} strokeWidth={1.4} style={{ color: '#C8CCE0', margin: '0 auto 8px' }} />
            <p style={{ fontSize: 13, color: C.muted, margin: 0, fontWeight: 500 }}>No rates added yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.rates.map((rate, idx) => (
              <div key={rate.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 100px 36px', gap: 8, alignItems: 'center' }}>
                <Select value={rate.role} options={ROLE_LIST} onChange={v => handleUpdateRate(rate.id, 'role', v)} placeholder="Select role" />
                <input type="text" value={rate.rate} onChange={e => handleUpdateRate(rate.id, 'rate', e.target.value)} placeholder="Rate" style={inputStyle} />
                <Select value={rate.currency} options={CURRENCIES} onChange={v => handleUpdateRate(rate.id, 'currency', v)} placeholder="Currency" />
                <button onClick={() => handleRemoveRate(rate.id)} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', color: '#E84855', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.13s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.09)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}>
                  <X size={14} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function EditProjectPage({
  project,
  onBack,
  onSave,
}: {
  project: any
  onBack: () => void
  onSave: (updatedProject: any) => void
}) {
  const [step, setStep] = useState(1)
  const [form, setFormRaw] = useState<FormData>({
    projectName: project.name,
    description: project.description,
    clientName: project.client,
    startDate: project.startDate || '',
    endDate: project.endDate || '',
    plannedStart: project.plannedStart || '',
    plannedEnd: project.plannedEnd || '',
    actualStart: project.actualStart || '',
    actualEnd: project.actualEnd || '',
    sowSigned: project.sowSigned || '',
    status: project.status,
    manager: '',
    roleGroups: [],
    billingType: 'hourly',
    poNumber: '',
    paymentTerms: '',
    rates: [],
  })
  const [submitting, setSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  function set(patch: Partial<FormData>) {
    setFormRaw(f => ({ ...f, ...patch }))
    setHasChanges(true)
  }

  async function handleSave() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    onSave({ ...project, ...form })
    setSubmitting(false)
    setHasChanges(false)
  }

  const EDIT_STEPS = [
    { id: 1, label: 'Project Details', sub: 'Name, client & timeline', Icon: FileText },
    { id: 2, label: 'Team Details', sub: 'Manager & members', Icon: Users },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes apFadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes apSpin    { from { transform:rotate(0deg) } to { transform:rotate(360deg) } }
        input[type="date"]::-webkit-calendar-picker-indicator { display: none; }
        input[type="date"]::-webkit-outer-spin-button,
        input[type="date"]::-webkit-inner-spin-button { display: none; }
      `}</style>

      {/* Header with Breadcrumb + Save Button */}
      <div className="flex items-center justify-between" style={{ marginBottom: 24 }}>
        <div className="flex items-center gap-2">
          <button onClick={onBack}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s', outline: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}>
            <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
          </button>
          <span style={{ fontSize: 13, color: '#C8CCDC' }}>/</span>
          <button onClick={onBack} style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
            All Projects
          </button>
          <span style={{ fontSize: 13, color: '#C8CCDC' }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Edit Project</span>
        </div>
        <button onClick={handleSave} disabled={submitting || !hasChanges}
          style={{ height: 40, paddingLeft: 20, paddingRight: 20, borderRadius: 10, border: 'none', background: submitting || !hasChanges ? '#D0D3E4' : 'linear-gradient(135deg, #0EA86A 0%, #0A8A58 100%)', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: submitting || !hasChanges ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s', flexShrink: 0, opacity: submitting || !hasChanges ? 0.6 : 1 }}
          onMouseEnter={e => { if (!submitting && hasChanges) e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
          {submitting ? (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'apSpin 0.8s linear infinite', flexShrink: 0 }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Saving…</>
          ) : (
            <><Check size={15} strokeWidth={2.5} />Save Changes</>
          )}
        </button>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '260px 1fr', alignItems: 'start' }}>
        {/* ── Left: Step navigator ── */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', position: 'sticky', top: 24 }}>
          <div style={{ padding: '20px 20px 16px', borderBottom: `1px solid ${C.border}`, background: 'linear-gradient(135deg, #F5F6FF 0%, #ECEEF8 100%)' }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, marginBottom: 3 }}>Edit Project</div>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>Update project details</div>
          </div>
          <div style={{ padding: '12px 10px' }}>
            {EDIT_STEPS.map((s, idx) => {
              const current = step === s.id
              const Icon = s.Icon
              return (
                <button key={s.id}
                  onClick={() => setStep(s.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '11px 10px', borderRadius: 11, border: 'none', background: current ? 'rgba(99,102,241,0.08)' : 'transparent', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.13s', textAlign: 'left', outline: 'none' }}
                  onMouseEnter={e => { if (!current) e.currentTarget.style.background = C.surface }}
                  onMouseLeave={e => { if (!current) e.currentTarget.style.background = 'transparent' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: current ? 'rgba(99,102,241,0.12)' : '#F0F2F8', border: `1px solid ${current ? 'rgba(99,102,241,0.25)' : C.border}`, transition: 'all 0.2s' }}>
                    <Icon size={15} strokeWidth={1.8} style={{ color: current ? '#6366F1' : C.muted }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: current ? 700 : 500, color: current ? '#5B5FDE' : '#5A6080', lineHeight: 1.3, transition: 'color 0.15s' }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: '#B0B4C8', fontWeight: 400, marginTop: 1 }}>{s.sub}</div>
                  </div>
                  {idx < EDIT_STEPS.length - 1 && (
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', flexShrink: 0 }}>
                      <ChevronRight size={9} strokeWidth={2.5} style={{ color: '#C8CCE0' }} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Right: Form content ── */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '32px 36px' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={LABEL}>Project Name *</label>
                <input type="text" value={form.projectName} onChange={e => set({ projectName: e.target.value })}
                  placeholder="e.g., Mobile App Redesign"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
              </div>

              <div>
                <label style={LABEL}>Description</label>
                <textarea value={form.description} onChange={e => set({ description: e.target.value })}
                  placeholder="Project overview and key objectives..."
                  style={{ ...inputStyle, height: 100, padding: '12px 14px', resize: 'none', fontFamily: 'inherit' }}
                  onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
              </div>

              <div>
                <label style={LABEL}>Client Name *</label>
                <input type="text" value={form.clientName} onChange={e => set({ clientName: e.target.value })}
                  placeholder="Client or company name"
                  style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
              </div>

              <div>
                <label style={LABEL}>Status *</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {STATUSES.map(s => (
                    <button key={s.id} onClick={() => set({ status: s.id })}
                      style={{ height: 40, borderRadius: 9, border: `1px solid ${form.status === s.id ? s.border : C.border}`, background: form.status === s.id ? s.bg : '#fff', color: form.status === s.id ? s.color : C.muted, fontSize: 12.5, fontWeight: form.status === s.id ? 700 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', transition: 'all 0.13s', outline: 'none', padding: '0 14px' }}
                      onMouseEnter={e => { if (form.status !== s.id) e.currentTarget.style.background = C.surface }}
                      onMouseLeave={e => { if (form.status !== s.id) e.currentTarget.style.background = '#fff' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: form.status === s.id ? s.color : '#D0D4E4', display: 'inline-block', flexShrink: 0, transition: 'background 0.13s' }} />
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: C.navy, marginBottom: 20 }}>Timeline Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                  {['Start Date', 'End Date', 'Planned Start', 'Planned End', 'Actual Start', 'Actual End'].map((label) => {
                    const fieldMap: Record<string, keyof FormData> = {
                      'Start Date': 'startDate', 'End Date': 'endDate',
                      'Planned Start': 'plannedStart', 'Planned End': 'plannedEnd',
                      'Actual Start': 'actualStart', 'Actual End': 'actualEnd',
                    }
                    const field = fieldMap[label]
                    return (
                      <div key={label}>
                        <label style={LABEL}>{label}</label>
                        <div style={{ position: 'relative' }}>
                          <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#999999', pointerEvents: 'none', zIndex: 1 }} />
                          <input type="date" value={form[field]} onChange={e => set({ [field]: e.target.value })}
                            style={{ ...inputStyle, paddingLeft: 38, cursor: 'pointer', color: form[field] ? C.navy : C.muted }}
                            onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                            onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div>
                  <label style={LABEL}>SoW Signed</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#999999', pointerEvents: 'none', zIndex: 1 }} />
                    <input type="date" value={form.sowSigned} onChange={e => set({ sowSigned: e.target.value })}
                      style={{ ...inputStyle, paddingLeft: 38, cursor: 'pointer', color: form.sowSigned ? C.navy : C.muted }}
                      onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.10)' }}
                      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <label style={LABEL}>Project Manager *</label>
              <Select value={form.manager} options={MANAGER_LIST} onChange={m => set({ manager: m })} placeholder="Select a manager" />
              <div style={{ marginTop: 20, padding: '16px', background: '#F7F8FC', borderRadius: 12, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                <strong>Team Members:</strong> Configure team allocations through the project details page.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
