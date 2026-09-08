import { useState } from 'react'
import {
  ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown, GripVertical,
  CheckCircle2, Eye, Star, UserSearch, Info, X, Check,
} from 'lucide-react'
import {
  C, AWARD_THEME, FIELD_TYPE_META, AUDIENCE_ORDER, STATUS_ORDER, audienceLabel,
  type NominationTemplate, type TemplateField, type FieldType, type Audience, type TemplateStatus,
} from './nominationTemplatesData'

interface Props {
  mode: 'create' | 'edit'
  template: NominationTemplate
  onBack: () => void
  onSave: (t: NominationTemplate) => void
}

const FIELD_ORDER: FieldType[] = ['employee-picker', 'long-text', 'short-text', 'dropdown', 'rating']

let seq = 0
const uid = () => `f-${Date.now()}-${seq++}`

export default function NominationTemplateBuilderPage({ mode, template, onBack, onSave }: Props) {
  const [name, setName]           = useState(template.name)
  const [description, setDesc]    = useState(template.description)
  const [audiences, setAudiences] = useState<Audience[]>(template.audiences)
  const [status, setStatus]       = useState<TemplateStatus>(template.status)
  const [fields, setFields]       = useState<TemplateField[]>(template.fields)
  const [editingId, setEditingId] = useState<string | null>(null)

  const award = template.award
  const theme = AWARD_THEME[award]
  const canSave = name.trim().length > 0 && fields.length > 0 && audiences.length > 0

  /* Audience is multi-select: HR may widen a template to a second group later
     (a manager getting Peer Appreciation access, say), so this is a set. */
  function toggleAudience(a: Audience) {
    setAudiences(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])
  }

  /* ── Field mutators ── */
  function patchField(id: string, patch: Partial<TemplateField>) {
    setFields(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f))
  }
  function addField() {
    const nf: TemplateField = { id: uid(), label: '', type: 'short-text', required: false }
    setFields(prev => [...prev, nf])
    setEditingId(nf.id)
  }
  function removeField(id: string) {
    setFields(prev => prev.filter(f => f.id !== id))
    if (editingId === id) setEditingId(null)
  }
  function move(id: string, dir: -1 | 1) {
    setFields(prev => {
      const i = prev.findIndex(f => f.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  function handleSave() {
    if (!canSave) return
    onSave({ ...template, name: name.trim(), description: description.trim(), award, audiences, status, fields, updated: 'Just now' })
  }

  const label = (text: string) => (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{text}</div>
  )
  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', height: 42, padding: '0 12px', border: `1px solid ${C.border}`,
    borderRadius: 10, fontSize: 13.5, color: C.navy, background: C.surface, outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s',
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes tbFade { from { opacity:0 } to { opacity:1 } }
        @keyframes tbExp  { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:translateY(0) } }
      `}</style>

      {/* ── Top bar: back + title + actions ── */}
      <div className="flex items-center justify-between gap-4" style={{ marginBottom: 22 }}>
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = C.hover; e.currentTarget.style.borderColor = '#C8CCE0' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
          >
            <ArrowLeft size={17} strokeWidth={2} style={{ color: C.navy }} />
          </button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold" style={{ color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {mode === 'create' ? 'Create Template' : 'Edit Template'}
            </h1>
            <p className="text-sm" style={{ color: C.muted, marginTop: 1 }}>Design the nomination form fields and preview it live</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={onBack}
            style={{ height: 40, padding: '0 18px', borderRadius: 11, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="inline-flex items-center gap-2"
            style={{
              height: 40, padding: '0 20px', borderRadius: 11, border: 'none', fontSize: 13.5, fontWeight: 700, fontFamily: 'inherit',
              background: canSave ? C.indigo : '#E4E6EF', color: canSave ? '#fff' : '#B0B4C8', cursor: canSave ? 'pointer' : 'not-allowed', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { if (canSave) e.currentTarget.style.background = '#5B5FDE' }}
            onMouseLeave={e => { if (canSave) e.currentTarget.style.background = C.indigo }}
          >
            <CheckCircle2 size={16} strokeWidth={2.2} /> Save Template
          </button>
        </div>
      </div>

      {/* ── Two-panel workspace ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.55fr) minmax(340px, 1fr)', gap: 20, alignItems: 'start' }}>

        {/* ══ LEFT — Builder ══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Template details */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 22px' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.navy, marginBottom: 18 }}>Template Details</div>

            <div style={{ marginBottom: 16 }}>
              {label('Template Name')}
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rising Star Nomination" style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              {label('Description')}
              <textarea value={description} onChange={e => setDesc(e.target.value)} placeholder="Short summary shown on the template card and to nominators…" rows={3}
                style={{ ...inputStyle, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: 1.6 }}
                onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}
              />
            </div>

            {/* Audience + status — small pill toggles, both on one row.
                Audience takes any number, status exactly one. */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div className="flex items-baseline gap-2" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Audience (who nominates)
                  </span>
                  {audiences.length === 0 && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.red }}>pick one</span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {AUDIENCE_ORDER.map(a => (
                    <Pill key={a} selected={audiences.includes(a)} onClick={() => toggleAudience(a)}>
                      {a}
                    </Pill>
                  ))}
                </div>
              </div>

              <div>
                {label('Status')}
                <div className="flex items-center gap-2 flex-wrap">
                  {STATUS_ORDER.map(s => (
                    <Pill key={s} selected={status === s} onClick={() => setStatus(s)}>
                      {s}
                    </Pill>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 22px' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>Questions</div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{fields.length} field{fields.length === 1 ? '' : 's'} — drag order with the arrows</div>
              </div>
              <button
                onClick={addField}
                className="inline-flex items-center gap-2 cursor-pointer"
                style={{ height: 36, padding: '0 14px', borderRadius: 10, border: `1px solid ${C.indigo}`, background: 'rgba(99,102,241,0.08)', color: C.indigo, fontSize: 12.5, fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
              >
                <Plus size={15} strokeWidth={2.4} /> Add Question
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center" style={{ border: `2px dashed #D8DCEC`, borderRadius: 12, background: C.surface, padding: '40px 20px', gap: 8 }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>No questions yet</span>
                <span style={{ fontSize: 12.5, color: C.muted }}>Add your first field to start building the form.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {fields.map((f, i) => (
                  <QuestionRow
                    key={f.id}
                    field={f}
                    index={i}
                    total={fields.length}
                    expanded={editingId === f.id}
                    onToggle={() => setEditingId(editingId === f.id ? null : f.id)}
                    onPatch={patch => patchField(f.id, patch)}
                    onRemove={() => removeField(f.id)}
                    onMove={dir => move(f.id, dir)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══ RIGHT — Live preview ══ */}
        <div style={{ position: 'sticky', top: 8 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
            <Eye size={15} strokeWidth={2} style={{ color: C.muted }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Live Preview</span>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 24px rgba(10,12,28,0.06)' }}>
            {/* Preview header */}
            <div style={{ padding: '20px 22px', background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', border: `1px solid ${theme.border}` }}>
                  <theme.Icon size={22} strokeWidth={1.9} style={{ color: theme.color }} />
                </div>
                <div className="min-w-0">
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, lineHeight: 1.25 }}>{name || 'Untitled Template'}</div>
                  <div style={{ fontSize: 11.5, color: theme.color, fontWeight: 700, marginTop: 2 }}>
                    Nominated by {audienceLabel(audiences)}
                  </div>
                </div>
              </div>
              {description && (
                <p style={{ fontSize: 12.5, color: '#5A6080', lineHeight: 1.6, margin: '12px 0 0' }}>{description}</p>
              )}
            </div>

            {/* Preview fields */}
            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>
              {fields.length === 0 ? (
                <div style={{ fontSize: 12.5, color: C.muted, textAlign: 'center', padding: '20px 0' }}>Fields will appear here as you add them.</div>
              ) : fields.map(f => <PreviewField key={f.id} field={f} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Segmented control
══════════════════════════════════════════ */
/* Small rounded toggle badge. Used for both audience (any number) and
   status (exactly one) — a tick appears on the selected ones. */
function Pill({
  selected, onClick, children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className="inline-flex items-center gap-1.5"
      style={{
        height: 32, padding: selected ? '0 12px 0 10px' : '0 14px', borderRadius: 999,
        cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 600,
        transition: 'all 0.15s', whiteSpace: 'nowrap',
        background: selected ? 'rgba(99,102,241,0.10)' : '#fff',
        border: `1px solid ${selected ? C.indigo : C.border}`,
        color: selected ? C.indigo : C.muted,
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.muted } }}
    >
      {selected && <Check size={13} strokeWidth={2.6} />}
      {children}
    </button>
  )
}

/* ══════════════════════════════════════════
   Question row (collapsed summary + expanded editor)
══════════════════════════════════════════ */
function QuestionRow({
  field, index, total, expanded, onToggle, onPatch, onRemove, onMove,
}: {
  field: TemplateField
  index: number
  total: number
  expanded: boolean
  onToggle: () => void
  onPatch: (patch: Partial<TemplateField>) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
}) {
  const meta = FIELD_TYPE_META[field.type]
  const MetaIcon = meta.Icon

  const iconBtn = (disabled: boolean): React.CSSProperties => ({
    width: 28, height: 28, borderRadius: 7, border: `1px solid ${C.border}`, background: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? '#C8CCE0' : C.muted, transition: 'all 0.14s',
  })

  return (
    <div style={{ border: `1px solid ${expanded ? C.indigo : C.border}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.15s', background: expanded ? 'rgba(99,102,241,0.02)' : '#fff' }}>
      {/* Summary */}
      <div className="flex items-center gap-3" style={{ padding: '11px 12px' }}>
        <GripVertical size={16} style={{ color: '#C8CCE0', flexShrink: 0 }} />
        <div className="flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32, borderRadius: 8, background: C.hover }}>
          <MetaIcon size={15} strokeWidth={2} style={{ color: C.indigo }} />
        </div>
        <div className="min-w-0" style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {field.label || <span style={{ color: '#B0B4C8', fontStyle: 'italic' }}>Untitled question</span>}
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
            {meta.label}{field.required ? ' · Required' : ''}
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button title="Move up" disabled={index === 0} onClick={() => onMove(-1)} style={iconBtn(index === 0)}
            onMouseEnter={e => { if (index !== 0) { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.navy } }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = index === 0 ? '#C8CCE0' : C.muted }}
          ><ChevronUp size={15} /></button>
          <button title="Move down" disabled={index === total - 1} onClick={() => onMove(1)} style={iconBtn(index === total - 1)}
            onMouseEnter={e => { if (index !== total - 1) { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.navy } }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = index === total - 1 ? '#C8CCE0' : C.muted }}
          ><ChevronDown size={15} /></button>
          <button title={expanded ? 'Collapse' : 'Edit'} onClick={onToggle}
            style={{ height: 28, padding: '0 10px', borderRadius: 7, border: `1px solid ${expanded ? C.indigo : C.border}`, background: expanded ? C.indigo : '#fff', color: expanded ? '#fff' : C.navy, fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.14s' }}
          >{expanded ? 'Done' : 'Edit'}</button>
          <button title="Delete" onClick={onRemove} style={iconBtn(false)}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.10)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.3)'; e.currentTarget.style.color = C.red }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
          ><Trash2 size={13} strokeWidth={2} /></button>
        </div>
      </div>

      {/* Editor */}
      {expanded && (
        <div style={{ padding: '4px 14px 16px', borderTop: `1px solid ${C.border}`, animation: 'tbExp 0.16s ease' }}>
          {/* Question label */}
          <div style={{ margin: '14px 0' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>Question Label</div>
            <input
              value={field.label}
              onChange={e => onPatch({ label: e.target.value })}
              placeholder="e.g. Reason for nomination"
              autoFocus
              style={{ width: '100%', boxSizing: 'border-box', height: 40, padding: '0 12px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13.5, color: C.navy, background: '#fff', outline: 'none', fontFamily: 'inherit' }}
              onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border }}
            />
          </div>

          {/* Field type chooser */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>Field Type</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
              {FIELD_ORDER.map(ft => {
                const fm = FIELD_TYPE_META[ft]
                const FIco = fm.Icon
                const active = field.type === ft
                return (
                  <button key={ft} onClick={() => onPatch({ type: ft, ...(ft === 'dropdown' && !field.options ? { options: ['Option 1', 'Option 2'] } : {}) })}
                    className="flex items-center gap-2 cursor-pointer"
                    style={{
                      padding: '9px 10px', borderRadius: 10, textAlign: 'left', fontFamily: 'inherit',
                      border: `1px solid ${active ? C.indigo : C.border}`, background: active ? 'rgba(99,102,241,0.07)' : '#fff', transition: 'all 0.14s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = '#C8CCE0' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = C.border }}
                  >
                    <div className="flex items-center justify-center flex-shrink-0" style={{ width: 28, height: 28, borderRadius: 7, background: active ? 'rgba(99,102,241,0.12)' : C.hover }}>
                      <FIco size={14} strokeWidth={2} style={{ color: active ? C.indigo : C.muted }} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: active ? C.indigo : C.navy }}>{fm.label}</span>
                  </button>
                )
              })}
            </div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 8, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <Info size={13} strokeWidth={2} style={{ color: C.indigo, flexShrink: 0, marginTop: 1 }} /> {meta.hint}
            </div>
          </div>

          {/* Dropdown options */}
          {field.type === 'dropdown' && (
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>Options</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(field.options ?? []).map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <span style={{ fontSize: 12, color: C.muted, width: 16, flexShrink: 0 }}>{oi + 1}.</span>
                    <input
                      value={opt}
                      onChange={e => { const next = [...(field.options ?? [])]; next[oi] = e.target.value; onPatch({ options: next }) }}
                      style={{ flex: 1, height: 36, padding: '0 10px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.navy, background: '#fff', outline: 'none', fontFamily: 'inherit' }}
                      onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                      onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                    />
                    <button onClick={() => { const next = (field.options ?? []).filter((_, k) => k !== oi); onPatch({ options: next }) }}
                      style={{ width: 32, height: 32, borderRadius: 7, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onMouseEnter={e => { e.currentTarget.style.color = C.red; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.3)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}
                    ><X size={14} /></button>
                  </div>
                ))}
                <button onClick={() => onPatch({ options: [...(field.options ?? []), `Option ${(field.options?.length ?? 0) + 1}`] })}
                  className="inline-flex items-center gap-1.5"
                  style={{ alignSelf: 'flex-start', height: 32, padding: '0 12px', borderRadius: 8, border: `1px dashed #C8CCE0`, background: '#fff', color: C.indigo, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  <Plus size={13} strokeWidth={2.4} /> Add Option
                </button>
              </div>
            </div>
          )}

          {/* Help text + required */}
          <div className="flex items-end gap-3" style={{ flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>Help Text <span style={{ textTransform: 'none', fontWeight: 500 }}>(optional)</span></div>
              <input
                value={field.helpText ?? ''}
                onChange={e => onPatch({ helpText: e.target.value })}
                placeholder="Guidance shown under the field"
                style={{ width: '100%', boxSizing: 'border-box', height: 40, padding: '0 12px', border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: '#fff', outline: 'none', fontFamily: 'inherit' }}
                onFocus={e => { e.currentTarget.style.borderColor = C.indigo }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border }}
              />
            </div>
            <button
              onClick={() => onPatch({ required: !field.required })}
              className="inline-flex items-center gap-2"
              style={{ height: 40, padding: '0 14px', borderRadius: 9, border: `1px solid ${field.required ? C.indigo : C.border}`, background: field.required ? 'rgba(99,102,241,0.08)' : '#fff', color: field.required ? C.indigo : C.muted, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.14s' }}
            >
              <span style={{ width: 16, height: 16, borderRadius: 5, border: `1.5px solid ${field.required ? C.indigo : '#C8CCE0'}`, background: field.required ? C.indigo : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {field.required && <CheckCircle2 size={12} strokeWidth={3} style={{ color: '#fff' }} />}
              </span>
              Required
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════
   Preview field renderer (as nominator sees)
══════════════════════════════════════════ */
function PreviewField({ field }: { field: TemplateField }) {
  const disabledInput: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', border: `1px solid ${C.border}`, borderRadius: 9,
    fontSize: 12.5, color: '#9AA0B8', background: C.surface, fontFamily: 'inherit',
  }
  return (
    <div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, marginBottom: 7 }}>
        {field.label || <span style={{ color: '#B0B4C8', fontStyle: 'italic', fontWeight: 500 }}>Untitled question</span>}
        {field.required && <span style={{ color: C.red, marginLeft: 4 }}>*</span>}
      </div>

      {field.type === 'employee-picker' && (
        <div>
          <div className="flex items-center gap-2" style={{ ...disabledInput, height: 40, padding: '0 12px' }}>
            <UserSearch size={15} style={{ color: '#B0B4C8' }} />
            <span style={{ fontSize: 12.5 }}>Search employee…</span>
          </div>
          <div className="flex items-center gap-2" style={{ marginTop: 8, padding: '10px 12px', border: `1px dashed ${C.border}`, borderRadius: 9, background: '#fff' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: C.hover, flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ width: 96, height: 7, borderRadius: 4, background: '#E4E6EF' }} />
              <div style={{ width: 140, height: 6, borderRadius: 4, background: '#EEF0F6' }} />
            </div>
          </div>
          <div style={{ fontSize: 10.5, color: C.muted, marginTop: 6 }}>Auto-fills name, role &amp; email</div>
        </div>
      )}

      {field.type === 'long-text' && (
        <div style={{ ...disabledInput, minHeight: 74, padding: '10px 12px' }}>Type your answer…</div>
      )}

      {field.type === 'short-text' && (
        <div style={{ ...disabledInput, height: 40, padding: '0 12px', display: 'flex', alignItems: 'center' }}>Short answer…</div>
      )}

      {field.type === 'dropdown' && (
        <div className="flex items-center justify-between" style={{ ...disabledInput, height: 40, padding: '0 12px' }}>
          <span>{field.options?.[0] ?? 'Select an option'}</span>
          <ChevronDown size={14} style={{ color: '#B0B4C8' }} />
        </div>
      )}

      {field.type === 'rating' && (
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map(n => <Star key={n} size={22} strokeWidth={1.8} style={{ color: '#D8DCEC' }} />)}
        </div>
      )}

      {field.helpText && field.type !== 'employee-picker' && (
        <div style={{ fontSize: 10.5, color: C.muted, marginTop: 6 }}>{field.helpText}</div>
      )}
    </div>
  )
}
