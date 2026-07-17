import { useState } from 'react'
import {
  Plus, ChevronDown, Eye, Trash2,
  ListChecks, CheckCircle2, FileText, X, Loader2, Info, UploadCloud, Download, Calendar,
} from 'lucide-react'
import AdminKPITemplateDetailsPage from './AdminKPITemplateDetailsPage'
import AdminKPIBulkUploadPage from './AdminKPIBulkUploadPage'
import KpiExcelUpload from './KpiExcelUpload'

interface AdminKPITemplatesPageProps {
  onNavigate?: (id: string) => void
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC', indigo: '#6366F1' }

type TemplateStatus = 'Active' | 'Draft'

export interface KpiTemplate {
  id: string
  role: string
  department: string
  employees: number
  criteria: number
  weightage: number      // total %
  maxScore: number       // rating scale, e.g. 5
  status: TemplateStatus
  updated: string
}

export type KpiStage = 'Q1' | 'Q2' | 'Q3' | 'Annual'
export const KPI_STAGES: KpiStage[] = ['Q1', 'Q2', 'Q3', 'Annual']

export interface KpiCriterion {
  id: string
  name: string
  weightage: number      // %
  description: string
  stage: KpiStage
}

/* Pool of criteria used to seed a role's KPI sheet (mock) */
const CRITERIA_POOL: { name: string; description: string }[] = [
  { name: 'AI Enabled Productivity',        description: 'Use of AI tools to improve day-to-day productivity, quality and exploration.' },
  { name: 'Quality & Consistency',          description: 'Overall accuracy, quality and consistency of the work delivered across the cycle.' },
  { name: 'Timely Delivery',                description: 'Meeting committed deadlines and delivering work within the planned timeline.' },
  { name: 'Cross Functional Collaboration', description: 'Effectiveness of collaboration with product, engineering, QA and other teams.' },
  { name: 'Ownership & Accountability',     description: 'Taking ownership of assigned tasks and following through to completion.' },
  { name: 'Mandatory Training Completion',  description: 'Completion of all required compliance and skill-development training modules.' },
  { name: 'Process & Documentation',        description: 'Adherence to defined processes and maintaining clear, up-to-date documentation.' },
  { name: 'Innovation & Improvement',       description: 'Proactively suggesting and driving improvements to ways of working.' },
  { name: 'Communication Skills',           description: 'Clarity and effectiveness of written and verbal communication with the team.' },
  { name: 'Problem Solving',                description: 'Ability to analyse issues and arrive at practical, well-reasoned solutions.' },
  { name: 'Technical Expertise',            description: 'Depth of role-specific technical knowledge and its application to the work.' },
  { name: 'Team Leadership',                description: 'Guiding, mentoring and supporting peers and juniors within the team.' },
  { name: 'Customer Focus',                 description: 'Understanding customer needs and keeping them central to decisions.' },
  { name: 'Adaptability',                   description: 'Responding positively to changing priorities, tools and requirements.' },
  { name: 'Goal Achievement',               description: 'Consistently meeting the individual and team goals set for the cycle.' },
]

/* Fixed dummy distribution per stage */
const STAGE_COUNTS: Record<KpiStage, number> = { Q1: 5, Q2: 5, Q3: 5, Annual: 10 }

export function buildCriteria(t: KpiTemplate): KpiCriterion[] {
  const out: KpiCriterion[] = []
  KPI_STAGES.forEach(stage => {
    const n = STAGE_COUNTS[stage]
    const base = Math.floor(100 / n)
    const remainder = 100 - base * n
    for (let i = 0; i < n; i++) {
      const c = CRITERIA_POOL[i % CRITERIA_POOL.length]
      out.push({
        id: `${t.id}-${stage}-c${i + 1}`,
        name: c.name,
        description: c.description,
        weightage: base + (i === 0 ? remainder : 0),
        stage,
      })
    }
  })
  return out
}

const TEMPLATES: KpiTemplate[] = [
  { id: 'r1', role: 'UI/UX Designer',   department: 'Design',      employees: 6,  criteria: 6, weightage: 100, maxScore: 5, status: 'Active', updated: 'Jul 10, 2026' },
  { id: 'r2', role: 'Developer',        department: 'Engineering', employees: 18, criteria: 8, weightage: 100, maxScore: 5, status: 'Active', updated: 'Jul 09, 2026' },
  { id: 'r3', role: 'Senior Developer', department: 'Engineering', employees: 7,  criteria: 8, weightage: 100, maxScore: 5, status: 'Active', updated: 'Jul 08, 2026' },
  { id: 'r4', role: 'QA Tester',        department: 'Quality',     employees: 5,  criteria: 5, weightage: 100, maxScore: 5, status: 'Active', updated: 'Jul 06, 2026' },
  { id: 'r5', role: 'Project Manager',  department: 'Delivery',    employees: 4,  criteria: 7, weightage: 100, maxScore: 5, status: 'Active', updated: 'Jul 05, 2026' },
  { id: 'r6', role: 'HR Executive',     department: 'Human Resources', employees: 3, criteria: 4, weightage: 80, maxScore: 5, status: 'Draft', updated: 'Jul 03, 2026' },
  { id: 'r7', role: 'Business Analyst', department: 'Delivery',    employees: 5,  criteria: 5, weightage: 100, maxScore: 5, status: 'Active', updated: 'Jul 01, 2026' },
  { id: 'r8', role: 'DevOps Engineer',  department: 'Engineering', employees: 3,  criteria: 6, weightage: 90,  maxScore: 5, status: 'Draft', updated: 'Jun 28, 2026' },
]

export default function AdminKPITemplatesPage({ onNavigate }: AdminKPITemplatesPageProps) {
  const CURRENT_YEAR = 2026
  const YEARS = [2026, 2025, 2024, 2023, 2022]

  const [templates, setTemplates] = useState(TEMPLATES)
  const [year, setYear]               = useState(CURRENT_YEAR)
  const [roleFilter, setRoleFilter]   = useState('All')
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [detail, setDetail]           = useState<KpiTemplate | null>(null)
  const [bulk, setBulk]               = useState(false)
  const [addOpen, setAddOpen]         = useState(false)
  const [addRole, setAddRole]         = useState('')
  const [addFile, setAddFile]         = useState<string | null>(null)
  const [saving, setSaving]           = useState(false)
  const [toast, setToast]             = useState<string | null>(null)

  const roles = ['All', ...templates.map(t => t.role)]

  // roles available to add a fresh template for (not already templated)
  const existingRoles = templates.map(t => t.role)
  const ADD_ROLE_OPTIONS = [
    'UI/UX Designer', 'Developer', 'Senior Developer', 'QA Tester', 'Project Manager',
    'HR Executive', 'Business Analyst', 'DevOps Engineer', 'Content Writer',
    'Marketing Executive', 'Sales Executive', 'Support Engineer', 'Data Analyst',
  ].filter(r => !existingRoles.includes(r))

  function openAdd() {
    setAddRole('')
    setAddFile(null)
    setAddOpen(true)
  }
  function importAdd() {
    if (!addRole || !addFile || saving) return
    setSaving(true)
    const role = addRole
    setTimeout(() => {
      setTemplates(prev => [
        { id: `r${Date.now()}`, role, department: 'General', employees: 0, criteria: 6, weightage: 100, maxScore: 5, status: 'Active', updated: 'Jul 15, 2026' },
        ...prev,
      ])
      setSaving(false)
      setAddOpen(false)
      setToast(`KPI template added for ${role}`)
      setTimeout(() => setToast(null), 3200)
    }, 900)
  }

  if (bulk) {
    return (
      <AdminKPIBulkUploadPage
        onBack={() => setBulk(false)}
        onSaved={msg => { setToast(msg); setTimeout(() => setToast(null), 3200) }}
      />
    )
  }

  if (detail) {
    return (
      <AdminKPITemplateDetailsPage
        template={detail}
        initialCriteria={buildCriteria(detail)}
        onBack={() => setDetail(null)}
        onNavigate={onNavigate}
      />
    )
  }

  const filtered = templates.filter(t => roleFilter === 'All' || t.role === roleFilter)

  const GRID = '1fr 1fr 1fr 1fr'
  const HEADERS = ['Designation', 'KPI Criteria', 'Last Updated', 'Actions']

  function handleDelete(id: string) {
    setTemplates(p => p.filter(t => t.id !== id))
    setDeleteId(null)
  }

  const isPast = year < CURRENT_YEAR

  function handleDownload(t: KpiTemplate) {
    setToast(`Downloading ${t.role} KPI report for ${year}…`)
    setTimeout(() => setToast(null), 3200)
  }

  const selectStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    height: 38, paddingLeft: 12, paddingRight: 34, borderRadius: 9, border: `1px solid ${C.border}`,
    fontSize: 13, color: C.navy, background: C.surface, fontFamily: 'inherit', cursor: 'pointer',
    appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
    outline: 'none', transition: 'border-color 0.15s, background 0.15s',
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes ktFade  { from { opacity:0 } to { opacity:1 } }
        @keyframes ktModal { from { opacity:0; transform:translateY(10px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes ktMenu  { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }
        @keyframes ktSpin  { to { transform: rotate(360deg) } }
        @keyframes ktToast { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4" style={{ marginBottom: 18 }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: C.navy }}>KPI Templates</h1>
          <p className="text-sm mt-1" style={{ color: '#787878', fontWeight: 500 }}>
            Create and manage KPI criteria for each designation — build manually or upload via Excel
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => setBulk(true)}
            className="flex items-center gap-2 cursor-pointer transition-all duration-150"
            style={{ height: 40, padding: '0 16px', borderRadius: 11, border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 13.5, fontWeight: 700 }}
            onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
          >
            <UploadCloud size={16} strokeWidth={2} /> Bulk Upload
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 cursor-pointer transition-all duration-150"
            style={{ height: 40, padding: '0 18px', borderRadius: 11, border: 'none', background: C.navy, color: '#fff', fontSize: 13.5, fontWeight: 700 }}
            onMouseEnter={e => { e.currentTarget.style.background = '#2A3050' }}
            onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
          >
            <Plus size={16} strokeWidth={2.5} /> Add KPI
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        {/* Header row with title + role filter */}
        <div className="flex items-center justify-between gap-4 flex-wrap" style={{ padding: '13px 22px', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Designation-based KPI Templates</span>
          <div className="flex items-center gap-2.5 flex-wrap" style={{ flexShrink: 0 }}>
            {/* Designation filter */}
            <div style={{ position: 'relative', minWidth: 200 }}>
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{ ...selectStyle, height: 36 }}
                onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
              >
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
            </div>
            {/* Year selector */}
            <div style={{ position: 'relative', minWidth: 150 }}>
              <Calendar size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
              <select value={year} onChange={e => setYear(parseInt(e.target.value, 10))} style={{ ...selectStyle, height: 36, paddingLeft: 32 }}
                onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
              >
                {YEARS.map(y => <option key={y} value={y}>{y === CURRENT_YEAR ? `${y} (Current)` : y}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* Column header */}
        <div className="grid items-center" style={{ gridTemplateColumns: GRID, padding: '12px 22px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          {HEADERS.map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#9498B0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ padding: '56px 20px', gap: 8 }}>
            <div className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 13, background: C.hover }}>
              <FileText size={22} strokeWidth={1.6} style={{ color: C.muted }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>No KPI templates found</span>
            <span style={{ fontSize: 12.5, color: C.muted }}>Try a different search or filter, or add a new template.</span>
          </div>
        ) : filtered.map((t, idx) => {
          return (
            <div
              key={t.id}
              className="grid items-center"
              style={{ gridTemplateColumns: GRID, padding: '14px 22px', borderTop: idx === 0 ? 'none' : `1px solid ${C.border}`, transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFE' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              {/* Role */}
              <div className="min-w-0" style={{ paddingRight: 12 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.role}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{t.department} · {t.employees} employees</div>
              </div>

              {/* KPI Criteria */}
              <div>
                <span className="inline-flex items-center gap-1.5" style={{ fontSize: 12.5, fontWeight: 700, color: C.indigo, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 8, padding: '4px 10px' }}>
                  <ListChecks size={13} strokeWidth={2.2} /> {t.criteria}
                </span>
              </div>

              {/* Last Updated */}
              <span style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{t.updated}</span>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  title="View"
                  onClick={() => setDetail(t)}
                  className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-all duration-150"
                  style={{ width: 32, height: 32, background: C.hover, color: C.muted }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}
                >
                  <Eye size={15} strokeWidth={2} />
                </button>
                {isPast ? (
                  <button
                    title={`Download ${year} KPI`}
                    onClick={() => handleDownload(t)}
                    className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-all duration-150"
                    style={{ width: 32, height: 32, background: C.hover, color: C.muted }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.color = C.indigo }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}
                  >
                    <Download size={15} strokeWidth={2} />
                  </button>
                ) : (
                  <button
                    title="Delete"
                    onClick={() => setDeleteId(t.id)}
                    className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-all duration-150"
                    style={{ width: 32, height: 32, background: C.hover, color: C.muted }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.12)'; e.currentTarget.style.color = '#E84855' }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}
                  >
                    <Trash2 size={14} strokeWidth={1.9} />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Success toast ── */}
      {toast && (
        <div
          className="fixed flex items-center gap-2.5"
          style={{
            right: 28, bottom: 28, zIndex: 10000,
            background: '#fff', border: '1px solid rgba(14,168,106,0.28)', borderRadius: 12,
            padding: '12px 16px', boxShadow: '0 12px 32px rgba(10,12,28,0.16)', animation: 'ktToast 0.22s ease',
          }}
        >
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(14,168,106,0.12)' }}>
            <CheckCircle2 size={16} strokeWidth={2.4} style={{ color: '#0A7040' }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{toast}</span>
        </div>
      )}

      {/* ── Add KPI popup (select role → upload excel) ── */}
      {addOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', zIndex: 9999, padding: 20, animation: 'ktFade 0.16s ease' }}
          onClick={e => { if (e.target === e.currentTarget) setAddOpen(false) }}
        >
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 660, maxHeight: '88vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(10,12,28,0.22)', animation: 'ktModal 0.2s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0" style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}`, background: '#fff' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Add KPI</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>Select a role, then upload its KPI criteria via Excel</div>
              </div>
              <button
                onClick={() => setAddOpen(false)}
                className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-colors duration-150"
                style={{ width: 30, height: 30, background: C.hover, color: C.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}
              >
                <X size={16} strokeWidth={2.2} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '20px 22px' }}>
              {/* Step 1: Select designation */}
              <div style={{ marginBottom: addRole ? 20 : 0 }}>
                <label style={{ display: 'block', fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 6 }}>Designation</label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={addRole}
                    onChange={e => { setAddRole(e.target.value); setAddFile(null) }}
                    style={{ ...selectStyle, height: 42, background: '#fff', color: addRole ? C.navy : C.muted }}
                    onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                    onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                  >
                    <option value="" disabled>Choose a designation…</option>
                    {ADD_ROLE_OPTIONS.map(r => <option key={r} value={r} style={{ color: C.navy }}>{r}</option>)}
                  </select>
                  <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
                </div>

                {/* Info: how to add a missing designation — hidden once one is selected */}
                {!addRole && (
                  <div style={{ display: 'flex', gap: 9, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.20)', borderRadius: 10, padding: '10px 12px', marginTop: 10 }}>
                    <Info size={15} strokeWidth={2} style={{ color: C.indigo, flexShrink: 0, marginTop: 1 }} />
                    <p style={{ fontSize: 11.5, color: '#5A6080', lineHeight: 1.55, margin: 0 }}>
                      To add a new designation, please create it first in the <strong style={{ color: C.navy, fontWeight: 700 }}>Designation Management</strong> module. Once the designation is created, it will automatically appear here for selection.
                    </p>
                  </div>
                )}
              </div>

              {/* Step 2: Excel upload (only after role chosen) */}
              {addRole && <KpiExcelUpload file={addFile} onFile={setAddFile} />}
            </div>

            {/* Footer */}
            {addRole && (
              <div className="flex items-center justify-end sticky bottom-0" style={{ padding: '14px 22px', borderTop: `1px solid ${C.border}`, background: '#fff' }}>
                <button
                  onClick={importAdd}
                  disabled={!addFile || saving}
                  className="inline-flex items-center gap-2 border-none transition-all duration-150"
                  style={{
                    height: 40, padding: '0 22px', borderRadius: 11, fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit',
                    background: addFile ? C.indigo : '#E4E6EF',
                    color: addFile ? '#fff' : '#B0B4C8',
                    cursor: addFile && !saving ? 'pointer' : 'not-allowed',
                  }}
                  onMouseEnter={e => { if (addFile && !saving) e.currentTarget.style.background = '#4F46E5' }}
                  onMouseLeave={e => { if (addFile && !saving) e.currentTarget.style.background = C.indigo }}
                >
                  {saving
                    ? <><Loader2 size={16} strokeWidth={2.4} style={{ animation: 'ktSpin 0.8s linear infinite' }} /> Saving…</>
                    : <><CheckCircle2 size={16} strokeWidth={2.2} /> Save</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteId !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', zIndex: 9999, padding: 20, animation: 'ktFade 0.16s ease' }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteId(null) }}
        >
          <div style={{ background: '#fff', borderRadius: 20, padding: '30px 26px 22px', width: 390, boxShadow: '0 24px 64px rgba(10,12,28,0.20)', textAlign: 'center', animation: 'ktModal 0.2s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(232,72,85,0.10)', margin: '0 auto 18px' }}>
              <Trash2 size={24} strokeWidth={1.8} style={{ color: '#E84855' }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>Delete KPI Template</div>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65, marginBottom: 24 }}>
              This will remove the KPI template for this role.<br />This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="cursor-pointer"
                style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="inline-flex items-center justify-center gap-2 cursor-pointer"
                style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: '#E84855', color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#D43F4B' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#E84855' }}
              >
                <CheckCircle2 size={16} strokeWidth={2.2} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
