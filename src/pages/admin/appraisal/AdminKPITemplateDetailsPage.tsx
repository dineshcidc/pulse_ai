import { useState } from 'react'
import { ArrowLeft, Plus, Upload, Edit2, Trash2, ListChecks, Check, X, ChevronDown } from 'lucide-react'
import type { KpiTemplate, KpiCriterion, KpiStage } from './AdminKPITemplatesPage'
import { KPI_STAGES } from './AdminKPITemplatesPage'
import KpiExcelUpload from './KpiExcelUpload'

interface Props {
  template: KpiTemplate
  initialCriteria: KpiCriterion[]
  onBack: () => void
  onNavigate?: (id: string) => void
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC', indigo: '#6366F1' }

/* Per-stage chip palette (status-style "state type") */
const STAGE_META: Record<KpiStage, { color: string; bg: string; border: string }> = {
  Q1:     { color: '#2563EB', bg: 'rgba(37,99,235,0.10)',  border: 'rgba(37,99,235,0.22)' },
  Q2:     { color: '#6366F1', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.22)' },
  Q3:     { color: '#F59E0B', bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.28)' },
  Annual: { color: '#0EA86A', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.24)' },
}

export default function AdminKPITemplateDetailsPage({ template, initialCriteria, onBack }: Props) {
  const [criteria, setCriteria] = useState<KpiCriterion[]>(initialCriteria)
  const [tab, setTab]           = useState<KpiStage>('Q1')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId]     = useState<string | null>(null)
  const [draft, setDraft]       = useState<{ name: string; weightage: string; description: string; stage: KpiStage }>({ name: '', weightage: '', description: '', stage: 'Q1' })
  const [addOpen, setAddOpen]   = useState(false)
  const [addDraft, setAddDraft] = useState<{ name: string; weightage: string; description: string; stage: KpiStage }>({ name: '', weightage: '', description: '', stage: 'Q1' })
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<string | null>(null)

  const GRID = '1.7fr 0.9fr 0.8fr 2.2fr 0.8fr'
  const HEADERS = ['Criteria Name', 'Stage', 'Weightage', 'Description', 'Actions']

  /* criteria shown for the active stage tab */
  const shown = criteria.filter(c => c.stage === tab)

  function startEdit(c: KpiCriterion) {
    setEditId(c.id)
    setDraft({ name: c.name, weightage: String(c.weightage), description: c.description, stage: c.stage })
  }
  function cancelEdit() {
    setEditId(null)
  }
  function saveEdit(id: string) {
    setCriteria(prev => prev.map(c =>
      c.id === id
        ? { ...c, name: draft.name.trim() || c.name, weightage: parseInt(draft.weightage, 10) || 0, description: draft.description.trim(), stage: draft.stage }
        : c
    ))
    setEditId(null)
  }
  const draftValid = draft.name.trim() !== '' && draft.weightage.trim() !== ''

  function openAdd() {
    setAddDraft({ name: '', weightage: '', description: '', stage: tab })
    setAddOpen(true)
  }
  function saveAdd() {
    if (!addValid) return
    setCriteria(prev => [...prev, {
      id: `${template.id}-c${Date.now()}`,
      name: addDraft.name.trim(),
      weightage: parseInt(addDraft.weightage, 10) || 0,
      description: addDraft.description.trim(),
      stage: addDraft.stage,
    }])
    setTab(addDraft.stage)
    setAddOpen(false)
  }
  const addValid = addDraft.name.trim() !== '' && addDraft.weightage.trim() !== ''

  function handleDelete(id: string) {
    setCriteria(prev => prev.filter(c => c.id !== id))
    setDeleteId(null)
  }

  const LABEL: React.CSSProperties = { display: 'block', fontSize: 11, color: '#8B90A7', fontWeight: 600, marginBottom: 6 }
  const INPUT: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', height: 40, padding: '0 12px',
    border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy,
    background: '#fff', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s',
  }
  const SELECT: React.CSSProperties = {
    ...INPUT, paddingRight: 32, cursor: 'pointer',
    appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes ktdFade  { from { opacity:0 } to { opacity:1 } }
        @keyframes ktdModal { from { opacity:0; transform:translateY(10px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes ktdRow   { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
        <button
          onClick={onBack}
          title="Back"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
        >
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <button
          onClick={onBack}
          style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
        >
          KPI Templates
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{template.role}</span>
      </div>

      {/* ── Header: role + Add Criteria ── */}
      <div className="flex items-start justify-between gap-4" style={{ marginBottom: 18 }}>
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.navy }}>{template.role}</h1>
          <p className="text-sm mt-0.5" style={{ color: C.muted }}>
            {template.department} · {template.employees} employees
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => { setUploadFile(null); setUploadOpen(true) }}
            className="flex items-center gap-2 cursor-pointer transition-all duration-150"
            style={{ height: 40, padding: '0 16px', borderRadius: 11, border: `1px solid ${C.border}`, background: '#fff', color: C.navy, fontSize: 13.5, fontWeight: 700 }}
            onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
          >
            <Upload size={16} strokeWidth={2} /> Upload Excel
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 cursor-pointer transition-all duration-150"
            style={{
              height: 40, padding: '0 16px', borderRadius: 11, fontSize: 13.5, fontWeight: 700,
              background: 'rgba(99,102,241,0.08)', color: C.indigo, border: '1.5px dashed rgba(99,102,241,0.55)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.16)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
          >
            <Plus size={16} strokeWidth={2.5} /> Add Criteria
          </button>
        </div>
      </div>

      {/* ── Criteria table ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        {/* Card header — stage tabs (Q1/Q2/Q3/Annual) + count */}
        <div className="flex items-center justify-between gap-4 flex-wrap" style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, background: '#FCFCFE' }}>
          {/* light segmented tabs */}
          <div className="flex items-center gap-1" style={{ background: C.hover, borderRadius: 10, padding: 4 }}>
            {KPI_STAGES.map(s => {
              const active = tab === s
              const count = criteria.filter(c => c.stage === s).length
              return (
                <button
                  key={s}
                  onClick={() => { setTab(s); setEditId(null) }}
                  className="rounded-lg border-none cursor-pointer font-semibold transition-all duration-150 flex-shrink-0 inline-flex items-center gap-1.5"
                  style={{
                    height: 30, padding: '0 14px', fontSize: 12.5,
                    background: active ? 'rgba(99,102,241,0.14)' : 'transparent',
                    color: active ? C.indigo : C.muted,
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = C.muted }}
                >
                  {s}
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: active ? C.indigo : '#B0B4C8', background: active ? 'rgba(99,102,241,0.16)' : C.surface, borderRadius: 999, padding: '1px 6px', minWidth: 18, textAlign: 'center' }}>{count}</span>
                </button>
              )
            })}
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 999, padding: '3px 11px' }}>
            {shown.length} {shown.length === 1 ? 'criterion' : 'criteria'} in {tab}
          </span>
        </div>

        {/* Column header */}
        <div className="grid" style={{ gridTemplateColumns: GRID, padding: '12px 22px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          {HEADERS.map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#9498B0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ padding: '56px 20px', gap: 8 }}>
            <div className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 13, background: C.hover }}>
              <ListChecks size={22} strokeWidth={1.6} style={{ color: C.muted }} />
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>No criteria in {tab}</span>
            <span style={{ fontSize: 12.5, color: C.muted }}>Add KPI criteria for {tab} to define how this role is measured.</span>
          </div>
        ) : (
          <>
            {shown.map((c, idx) => {
              const isEditing = editId === c.id
              return (
                <div key={c.id} style={{ borderTop: idx === 0 ? 'none' : `1px solid ${C.border}` }}>
                  <div
                    className="grid items-center"
                    style={{ gridTemplateColumns: GRID, padding: '15px 22px', background: isEditing ? '#F9FAFE' : 'transparent', transition: 'background 0.15s' }}
                    onMouseEnter={e => { if (!isEditing) e.currentTarget.style.background = '#F9FAFE' }}
                    onMouseLeave={e => { if (!isEditing) e.currentTarget.style.background = 'transparent' }}
                  >
                    {/* Criteria Name */}
                    <div className="min-w-0" style={{ paddingRight: 14 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, lineHeight: 1.4 }}>{c.name}</span>
                    </div>

                    {/* Stage (state-type chip) */}
                    <div>
                      <span
                        className="inline-flex items-center"
                        style={{ fontSize: 12, fontWeight: 700, color: STAGE_META[c.stage].color, background: STAGE_META[c.stage].bg, border: `1px solid ${STAGE_META[c.stage].border}`, borderRadius: 999, padding: '3px 12px', whiteSpace: 'nowrap' }}
                      >
                        {c.stage}
                      </span>
                    </div>

                    {/* Weightage */}
                    <div>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: '#5A6080', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: '4px 11px', whiteSpace: 'nowrap' }}>
                        {c.weightage}%
                      </span>
                    </div>

                    {/* Description (truncated with …) */}
                    <div className="min-w-0" style={{ paddingRight: 18 }} title={c.description}>
                      <span style={{ display: 'block', fontSize: 12.5, color: '#5A6080', lineHeight: 1.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.description}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        title={isEditing ? 'Close edit' : 'Edit'}
                        onClick={() => isEditing ? cancelEdit() : startEdit(c)}
                        className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-all duration-150"
                        style={{ width: 32, height: 32, background: isEditing ? 'rgba(99,102,241,0.14)' : C.hover, color: isEditing ? C.indigo : C.muted }}
                        onMouseEnter={e => { if (!isEditing) { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy } }}
                        onMouseLeave={e => { if (!isEditing) { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted } }}
                      >
                        <Edit2 size={14} strokeWidth={1.9} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => setDeleteId(c.id)}
                        className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-all duration-150"
                        style={{ width: 32, height: 32, background: C.hover, color: C.muted }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.12)'; e.currentTarget.style.color = '#E84855' }}
                        onMouseLeave={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted }}
                      >
                        <Trash2 size={14} strokeWidth={1.9} />
                      </button>
                    </div>
                  </div>

                  {/* Inline edit form (accordion) */}
                  {isEditing && (
                    <div style={{ padding: '2px 22px 18px', animation: 'ktdRow 0.18s ease' }}>
                      <div style={{ background: '#fff', border: `1px solid rgba(99,102,241,0.30)`, borderRadius: 12, padding: '16px 18px', boxShadow: '0 4px 14px rgba(99,102,241,0.06)' }}>
                        <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Edit Criteria</span>
                          <div className="flex items-center gap-2">
                            <button
                              title="Save"
                              onClick={() => saveEdit(c.id)}
                              disabled={!draftValid}
                              className="flex items-center justify-center rounded-lg border-none transition-all duration-150"
                              style={{
                                width: 32, height: 32,
                                background: draftValid ? 'rgba(14,168,106,0.12)' : '#F0F1F5',
                                color: draftValid ? '#0A7040' : '#C0C4D6',
                                cursor: draftValid ? 'pointer' : 'not-allowed',
                              }}
                              onMouseEnter={e => { if (draftValid) e.currentTarget.style.background = 'rgba(14,168,106,0.20)' }}
                              onMouseLeave={e => { if (draftValid) e.currentTarget.style.background = 'rgba(14,168,106,0.12)' }}
                            >
                              <Check size={16} strokeWidth={2.6} />
                            </button>
                            <button
                              title="Cancel"
                              onClick={cancelEdit}
                              className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-all duration-150"
                              style={{ width: 32, height: 32, background: 'rgba(232,72,85,0.10)', color: '#E84855' }}
                              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.10)' }}
                            >
                              <X size={16} strokeWidth={2.6} />
                            </button>
                          </div>
                        </div>

                        {/* Name + Stage + Weightage */}
                        <div className="grid" style={{ gridTemplateColumns: '1fr 140px 130px', gap: 16, marginBottom: 14 }}>
                          <div>
                            <label style={LABEL}>Criteria Name</label>
                            <input
                              value={draft.name}
                              onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                              placeholder="e.g. Quality & Consistency"
                              style={INPUT}
                              onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                              onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                            />
                          </div>
                          <div>
                            <label style={LABEL}>Stage</label>
                            <div style={{ position: 'relative' }}>
                              <select
                                value={draft.stage}
                                onChange={e => setDraft(d => ({ ...d, stage: e.target.value as KpiStage }))}
                                style={SELECT}
                                onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                                onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                              >
                                {KPI_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <ChevronDown size={14} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
                            </div>
                          </div>
                          <div>
                            <label style={LABEL}>Weightage (%)</label>
                            <input
                              value={draft.weightage}
                              onChange={e => setDraft(d => ({ ...d, weightage: e.target.value.replace(/[^0-9]/g, '').slice(0, 3) }))}
                              placeholder="0"
                              inputMode="numeric"
                              style={{ ...INPUT, textAlign: 'right', fontWeight: 700 }}
                              onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                              onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                            />
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label style={LABEL}>Description</label>
                          <textarea
                            value={draft.description}
                            onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
                            placeholder="Describe how this KPI is measured…"
                            style={{ ...INPUT, height: 'auto', minHeight: 76, padding: '10px 12px', lineHeight: 1.55, resize: 'vertical' }}
                            onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                            onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* ── Upload Excel popup ── */}
      {uploadOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', zIndex: 9999, padding: 20, animation: 'ktdFade 0.16s ease' }}
          onClick={e => { if (e.target === e.currentTarget) setUploadOpen(false) }}
        >
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 660, overflow: 'hidden', boxShadow: '0 24px 64px rgba(10,12,28,0.22)', animation: 'ktdModal 0.2s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Header */}
            <div className="flex items-center justify-between" style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Upload Excel</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>Import KPI criteria for {template.role}</div>
              </div>
              <button
                onClick={() => setUploadOpen(false)}
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
              <KpiExcelUpload file={uploadFile} onFile={setUploadFile} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end" style={{ padding: '14px 22px', borderTop: `1px solid ${C.border}` }}>
              <button
                onClick={() => setUploadOpen(false)}
                disabled={!uploadFile}
                className="inline-flex items-center gap-2 border-none transition-all duration-150"
                style={{
                  height: 40, padding: '0 20px', borderRadius: 11, fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit',
                  background: uploadFile ? C.indigo : '#E4E6EF',
                  color: uploadFile ? '#fff' : '#B0B4C8',
                  cursor: uploadFile ? 'pointer' : 'not-allowed',
                }}
                onMouseEnter={e => { if (uploadFile) e.currentTarget.style.background = '#4F46E5' }}
                onMouseLeave={e => { if (uploadFile) e.currentTarget.style.background = C.indigo }}
              >
                <Check size={16} strokeWidth={2.4} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Criteria popup ── */}
      {addOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', zIndex: 9999, padding: 20, animation: 'ktdFade 0.16s ease' }}
          onClick={e => { if (e.target === e.currentTarget) setAddOpen(false) }}
        >
          <div style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 520, overflow: 'hidden', boxShadow: '0 24px 64px rgba(10,12,28,0.22)', animation: 'ktdModal 0.2s cubic-bezier(0.4,0,0.2,1)' }}>
            {/* Header */}
            <div className="flex items-center justify-between" style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Add Criteria</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>New KPI criterion for {template.role}</div>
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
              {/* Criteria Name — full row */}
              <div style={{ marginBottom: 16 }}>
                <label style={LABEL}>Criteria Name</label>
                <input
                  autoFocus
                  value={addDraft.name}
                  onChange={e => setAddDraft(d => ({ ...d, name: e.target.value }))}
                  placeholder="e.g. Quality & Consistency"
                  style={INPUT}
                  onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                />
              </div>
              {/* Stage + Weightage */}
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={LABEL}>Stage</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      value={addDraft.stage}
                      onChange={e => setAddDraft(d => ({ ...d, stage: e.target.value as KpiStage }))}
                      style={SELECT}
                      onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                      onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                    >
                      {KPI_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={LABEL}>Weightage (%)</label>
                  <input
                    value={addDraft.weightage}
                    onChange={e => setAddDraft(d => ({ ...d, weightage: e.target.value.replace(/[^0-9]/g, '').slice(0, 3) }))}
                    placeholder="0"
                    inputMode="numeric"
                    style={INPUT}
                    onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                    onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                  />
                </div>
              </div>
              {/* Description */}
              <div>
                <label style={LABEL}>Description</label>
                <textarea
                  value={addDraft.description}
                  onChange={e => setAddDraft(d => ({ ...d, description: e.target.value }))}
                  placeholder="Describe how this KPI is measured…"
                  style={{ ...INPUT, height: 'auto', minHeight: 84, padding: '10px 12px', lineHeight: 1.55, resize: 'vertical' }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                  onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end" style={{ padding: '14px 22px', borderTop: `1px solid ${C.border}` }}>
              <button
                onClick={saveAdd}
                disabled={!addValid}
                className="inline-flex items-center gap-2 border-none transition-all duration-150"
                style={{
                  height: 40, padding: '0 20px', borderRadius: 11, fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit',
                  background: addValid ? C.indigo : '#E4E6EF',
                  color: addValid ? '#fff' : '#B0B4C8',
                  cursor: addValid ? 'pointer' : 'not-allowed',
                }}
                onMouseEnter={e => { if (addValid) e.currentTarget.style.background = '#4F46E5' }}
                onMouseLeave={e => { if (addValid) e.currentTarget.style.background = C.indigo }}
              >
                <Check size={16} strokeWidth={2.5} /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteId !== null && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', zIndex: 9999, padding: 20, animation: 'ktdFade 0.16s ease' }}
          onClick={e => { if (e.target === e.currentTarget) setDeleteId(null) }}
        >
          <div style={{ background: '#fff', borderRadius: 20, padding: '30px 26px 22px', width: 390, boxShadow: '0 24px 64px rgba(10,12,28,0.20)', textAlign: 'center', animation: 'ktdModal 0.2s cubic-bezier(0.4,0,0.2,1)' }}>
            <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(232,72,85,0.10)', margin: '0 auto 18px' }}>
              <Trash2 size={24} strokeWidth={1.8} style={{ color: '#E84855' }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>Delete Criterion</div>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.65, marginBottom: 24 }}>
              This will remove this KPI criterion from the role.<br />This action cannot be undone.
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
                <Trash2 size={15} strokeWidth={2.2} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
