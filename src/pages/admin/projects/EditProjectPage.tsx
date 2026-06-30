import { useState } from 'react'
import {
  ArrowLeft, Check,
  Calendar,
  ChevronDown,
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

const STATUSES: { id: ProjectStatus; label: string; color: string; bg: string; border: string }[] = [
  { id: 'planning',      label: 'Planning',      color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)'  },
  { id: 'active',        label: 'Active',        color: '#0A8A58', bg: 'rgba(14,168,106,0.08)',  border: 'rgba(14,168,106,0.25)'  },
  { id: 'on-hold',       label: 'On Hold',       color: '#B45309', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)'  },
  { id: 'completed',     label: 'Completed',     color: '#1D4ED8', bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.25)'  },
  { id: 'yet-to-start',  label: 'Yet to start',  color: '#6366F1', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)'  },
  { id: 'draft',         label: 'Draft',         color: '#6B7280', bg: 'rgba(107,114,128,0.08)',  border: 'rgba(107,114,128,0.25)'  },
]

const MANAGER_LIST = ['Priya Mehta', 'Arjun Menon', 'Raj Kumar', 'Sunita Rao', 'Dev Team Lead']

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
          {options.map((opt) => (
            <button key={opt} onClick={() => { onChange(opt); setOpen(false) }}
              style={{ width: '100%', padding: '12px 14px', textAlign: 'left', border: 'none', background: value === opt ? '#F0F2F8' : '#fff', color: C.navy, cursor: 'pointer', fontSize: 13.5, fontFamily: 'inherit', transition: 'background 0.12s' }}
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

export default function EditProjectPage({
  project,
  onBack,
  onSave,
}: {
  project: any
  onBack: () => void
  onSave: () => void
}) {
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

  function set(patch: Partial<FormData>) { setFormRaw(f => ({ ...f, ...patch })) }

  async function handleSave() {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    onSave()
    setSubmitting(false)
  }

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
          <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
          <button onClick={onBack} style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
            All Projects
          </button>
          <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Edit Project</span>
        </div>
        <button onClick={handleSave} disabled={submitting}
          style={{ height: 40, paddingLeft: 20, paddingRight: 20, borderRadius: 10, border: 'none', background: submitting ? '#D0D3E4' : 'linear-gradient(135deg, #6366F1 0%, #5B5FDE 100%)', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.15s', flexShrink: 0, opacity: submitting ? 0.6 : 1 }}
          onMouseEnter={e => { if (!submitting) e.currentTarget.style.opacity = '0.88' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
          {submitting ? (
            <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'apSpin 0.8s linear infinite', flexShrink: 0 }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Saving…</>
          ) : (
            <><Check size={15} strokeWidth={2.5} />Save Changes</>
          )}
        </button>
      </div>

      {/* Form content */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '32px 36px' }}>
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
                const field = fieldMap[label] as keyof FormData
                const value = form[field] as string
                return (
                  <div key={label}>
                    <label style={LABEL}>{label}</label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={14} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#999999', pointerEvents: 'none', zIndex: 1 }} />
                      <input type="date" value={value} onChange={e => set({ [field]: e.target.value })}
                        style={{ ...inputStyle, paddingLeft: 38, cursor: 'pointer', color: value ? C.navy : C.muted }}
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

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            <label style={LABEL}>Project Manager *</label>
            <Select value={form.manager} options={MANAGER_LIST} onChange={m => set({ manager: m })} placeholder="Select a manager" />
            <div style={{ marginTop: 20, padding: '16px', background: '#F7F8FC', borderRadius: 12, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
              <strong>Team Members:</strong> Configure team allocations through the project details page.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
