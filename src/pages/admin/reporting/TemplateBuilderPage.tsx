import { useState } from 'react'
import {
  ArrowLeft, ChevronDown, GripVertical, Plus, Trash2, Copy, MoreVertical,
  Settings2, Eye, Save, Send, X, CheckCircle2, AlertTriangle, ChevronUp,
  Type, AlignLeft, Hash, Percent, List, CircleDot, Calendar, ListChecks,
  Upload, Users, Rows3, Layers, FileText, LayoutTemplate,
} from 'lucide-react'
import { TEMPLATE_SECTIONS, type FieldKind } from '../../manager/reporting/reportTemplate'
import type { ReportTemplate, Frequency } from './reportingTemplatesData'
import TemplatePreviewPage, { type PreviewData } from './TemplatePreviewPage'

const C = {
  navy:   '#1C2035',
  ink:    '#2A2F45',
  muted:  '#8B90A7',
  faint:  '#AEB2C4',
  border: '#E8EAF2',
  line:   '#EEF0F6',
  panel:  '#FFFFFF',
  wash:   '#F6F7FB',
  indigo: '#6366F1',
  green:  '#16A34A',
  amber:  '#D97706',
  red:    '#E11D48',
  slate:  '#64748B',
}

/* ── Field-type catalogue ── */
const FIELD_TYPES = [
  { key: 'short_text',    label: 'Short Text',       Icon: Type },
  { key: 'paragraph',     label: 'Paragraph',        Icon: AlignLeft },
  { key: 'number',        label: 'Number',           Icon: Hash,       numeric: true },
  { key: 'percent',       label: 'Percentage',       Icon: Percent,    numeric: true },
  { key: 'dropdown',      label: 'Dropdown',         Icon: List,       options: true },
  { key: 'single_select', label: 'Single Select',    Icon: CircleDot,  options: true },
  { key: 'date',          label: 'Date',             Icon: Calendar },
  { key: 'checklist',     label: 'Checklist',        Icon: ListChecks },
  { key: 'file',          label: 'File Upload',      Icon: Upload },
  { key: 'team_count',    label: 'Team Count',       Icon: Users },
  { key: 'group',         label: 'Repeatable Group', Icon: Rows3 },
] as const

type FieldTypeKey = typeof FIELD_TYPES[number]['key']
const typeDef = (k: FieldTypeKey) => FIELD_TYPES.find(t => t.key === k)!

const KIND_TO_TYPE: Record<FieldKind, FieldTypeKey> = {
  text: 'short_text', textarea: 'paragraph', number: 'number', percent: 'percent',
  segmented: 'single_select', select: 'dropdown', list: 'group', bullets: 'checklist', teamcount: 'team_count',
}
const SUBKIND_TO_TYPE: Record<string, FieldTypeKey> = {
  text: 'short_text', textarea: 'paragraph', segmented: 'single_select', date: 'date', number: 'number',
}

/* ── Builder model ── */
interface BOption { id: string; value: string }
interface BSubField { id: string; label: string; type: FieldTypeKey }
interface BQuestion {
  id: string
  label: string
  type: FieldTypeKey
  required: boolean
  placeholder?: string
  help?: string
  min?: string
  max?: string
  fileTypes?: string
  options?: BOption[]
  subFields?: BSubField[]
  expanded?: boolean
}
interface BSection {
  id: string
  name: string
  sourceId?: string
  enabled: boolean
  questions: BQuestion[]
}

let _c = 0
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${_c++}`

function fieldToQuestion(f: (typeof TEMPLATE_SECTIONS)[number]['fields'][number]): BQuestion {
  return {
    id: uid('q'),
    label: f.label,
    type: KIND_TO_TYPE[f.kind],
    required: !!f.required,
    placeholder: f.placeholder,
    help: f.help,
    options: f.options?.map(o => ({ id: uid('o'), value: o.value })),
    subFields: f.subFields?.map(sf => ({ id: uid('sf'), label: sf.label, type: SUBKIND_TO_TYPE[sf.kind] ?? 'short_text' })),
  }
}
function sectionDefToBuilder(id: string): BSection | null {
  const def = TEMPLATE_SECTIONS.find(s => s.id === id)
  if (!def) return null
  const questions = def.fields.map(fieldToQuestion)
  if (questions[0]) questions[0].expanded = true // open the first field's settings by default
  return { id: uid('s'), name: def.name, sourceId: def.id, enabled: true, questions }
}
function buildInitial(ids: string[]): BSection[] {
  return ids.map(sectionDefToBuilder).filter(Boolean) as BSection[]
}

const FREQS: Frequency[] = ['Weekly', 'Biweekly', 'Monthly']
const freqLabel = (f: Frequency) => (f === 'Biweekly' ? 'Bi-weekly' : f)

/* ── small components ── */
function Switch({ checked, onChange, onClick }: { checked: boolean; onChange: (v: boolean) => void; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={e => { onClick?.(e); onChange(!checked) }}
      className="rounded-full cursor-pointer flex-shrink-0"
      style={{ width: 34, height: 19, background: checked ? C.indigo : '#D7DAE8', border: 'none', position: 'relative', transition: 'background .15s' }}
    >
      <span style={{ position: 'absolute', top: 2, left: checked ? 17 : 2, width: 15, height: 15, borderRadius: '50%', background: '#fff', transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
    </button>
  )
}

interface Props {
  mode: 'create' | 'edit'
  template?: ReportTemplate
  onBack: () => void
}

export default function TemplateBuilderPage({ mode, template, onBack }: Props) {
  const [name, setName]         = useState(template?.name ?? '')
  const [description, setDesc]  = useState(template?.description ?? '')
  const [frequency, setFreq]    = useState<Frequency>(template?.frequency ?? 'Weekly')
  const initial = template ? buildInitial(template.sections) : buildInitial(['overview', 'tasks', 'risks', 'milestones', 'leave', 'notes'])
  const [sections, setSections] = useState<BSection[]>(initial)
  const [activeId, setActiveId] = useState<string | null>(initial[0]?.id ?? null)

  const [dragSec, setDragSec] = useState<string | null>(null)
  const [dragQ, setDragQ]     = useState<{ sid: string; qid: string } | null>(null)
  const [secMenu, setSecMenu] = useState(false)
  const [qMenu, setQMenu]     = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [preview, setPreview] = useState<PreviewData | null>(null)

  function flash(msg: string) { setToast(msg); window.setTimeout(() => setToast(null), 2400) }

  function openPreview() {
    setPreview({
      name, description, frequency,
      sections: sections.filter(s => s.enabled).map(s => ({
        id: s.id, name: s.name,
        fields: s.questions.map(q => ({
          id: q.id, label: q.label, type: q.type, required: q.required,
          help: q.help, placeholder: q.placeholder,
          options: q.options?.map(o => o.value),
          subFields: q.subFields?.map(sf => ({ label: sf.label, type: sf.type })),
        })),
      })),
    })
  }

  const active = sections.find(s => s.id === activeId) ?? sections[0] ?? null
  const activeIndex = active ? sections.findIndex(s => s.id === active.id) : -1

  const enabledSecs = sections.filter(s => s.enabled)
  const totalQ = enabledSecs.reduce((n, s) => n + s.questions.length, 0)
  const totalReq = enabledSecs.reduce((n, s) => n + s.questions.filter(q => q.required).length, 0)

  /* ── section ops ── */
  // Select a section and open its first field's settings (collapse the rest).
  function selectSection(sid: string) {
    setActiveId(sid)
    setSections(prev => prev.map(s => s.id !== sid ? s : { ...s, questions: s.questions.map((q, i) => ({ ...q, expanded: i === 0 })) }))
  }
  const patchSection = (sid: string, patch: Partial<BSection>) =>
    setSections(prev => prev.map(s => s.id === sid ? { ...s, ...patch } : s))
  const moveSection = (sid: string, dir: -1 | 1) =>
    setSections(prev => {
      const i = prev.findIndex(s => s.id === sid); const j = i + dir
      if (i < 0 || j < 0 || j >= prev.length) return prev
      const next = [...prev];[next[i], next[j]] = [next[j], next[i]]; return next
    })
  const deleteSection = (sid: string) => {
    setSections(prev => {
      const next = prev.filter(s => s.id !== sid)
      if (activeId === sid) setActiveId(next[0]?.id ?? null)
      return next
    })
  }
  const duplicateSection = (sid: string) =>
    setSections(prev => {
      const i = prev.findIndex(s => s.id === sid); if (i < 0) return prev
      const src = prev[i]
      const copy: BSection = {
        ...src, id: uid('s'), sourceId: undefined, name: `${src.name} (Copy)`,
        questions: src.questions.map(q => ({ ...q, id: uid('q'), options: q.options?.map(o => ({ ...o, id: uid('o') })), subFields: q.subFields?.map(sf => ({ ...sf, id: uid('sf') })) })),
      }
      const next = [...prev]; next.splice(i + 1, 0, copy); setActiveId(copy.id); return next
    })
  function addSection(sourceId?: string) {
    setAddOpen(false)
    const sec = sourceId ? sectionDefToBuilder(sourceId) : { id: uid('s'), name: 'New Section', enabled: true, questions: [] as BQuestion[] }
    if (sec) { setSections(prev => [...prev, sec]); setActiveId(sec.id) }
  }
  const onSecDragEnter = (target: string) => {
    if (!dragSec || dragSec === target) return
    setSections(prev => {
      const from = prev.findIndex(s => s.id === dragSec); const to = prev.findIndex(s => s.id === target)
      if (from < 0 || to < 0) return prev
      const next = [...prev]; const [m] = next.splice(from, 1); next.splice(to, 0, m); return next
    })
  }

  /* ── question ops ── */
  const patchQuestion = (sid: string, qid: string, patch: Partial<BQuestion>) =>
    setSections(prev => prev.map(s => s.id !== sid ? s : { ...s, questions: s.questions.map(q => q.id === qid ? { ...q, ...patch } : q) }))
  const addQuestion = (sid: string) =>
    setSections(prev => prev.map(s => s.id !== sid ? s : { ...s, questions: [...s.questions, { id: uid('q'), label: '', type: 'short_text', required: false, expanded: true }] }))
  const deleteQuestion = (sid: string, qid: string) =>
    setSections(prev => prev.map(s => s.id !== sid ? s : { ...s, questions: s.questions.filter(q => q.id !== qid) }))
  const duplicateQuestion = (sid: string, qid: string) =>
    setSections(prev => prev.map(s => {
      if (s.id !== sid) return s
      const i = s.questions.findIndex(q => q.id === qid); if (i < 0) return s
      const src = s.questions[i]
      const copy: BQuestion = { ...src, id: uid('q'), options: src.options?.map(o => ({ ...o, id: uid('o') })), subFields: src.subFields?.map(sf => ({ ...sf, id: uid('sf') })) }
      const qs = [...s.questions]; qs.splice(i + 1, 0, copy); return { ...s, questions: qs }
    }))
  const moveQuestion = (sid: string, qid: string, dir: -1 | 1) =>
    setSections(prev => prev.map(s => {
      if (s.id !== sid) return s
      const i = s.questions.findIndex(q => q.id === qid); const j = i + dir
      if (i < 0 || j < 0 || j >= s.questions.length) return s
      const qs = [...s.questions];[qs[i], qs[j]] = [qs[j], qs[i]]; return { ...s, questions: qs }
    }))
  const onQDragEnter = (sid: string, target: string) => {
    if (!dragQ || dragQ.sid !== sid || dragQ.qid === target) return
    setSections(prev => prev.map(s => {
      if (s.id !== sid) return s
      const from = s.questions.findIndex(q => q.id === dragQ.qid); const to = s.questions.findIndex(q => q.id === target)
      if (from < 0 || to < 0) return s
      const qs = [...s.questions]; const [m] = qs.splice(from, 1); qs.splice(to, 0, m); return { ...s, questions: qs }
    }))
  }
  function changeType(sid: string, qid: string, type: FieldTypeKey) {
    const d = typeDef(type)
    const patch: Partial<BQuestion> = { type }
    if ('options' in d && d.options) patch.options = [{ id: uid('o'), value: 'Option 1' }, { id: uid('o'), value: 'Option 2' }]
    if (type === 'group') patch.subFields = [{ id: uid('sf'), label: 'Field 1', type: 'short_text' }]
    patchQuestion(sid, qid, patch)
  }

  /* option / subfield ops */
  const addOption = (sid: string, qid: string) => setSections(prev => prev.map(s => s.id !== sid ? s : { ...s, questions: s.questions.map(q => q.id !== qid ? q : { ...q, options: [...(q.options ?? []), { id: uid('o'), value: `Option ${(q.options?.length ?? 0) + 1}` }] }) }))
  const patchOption = (sid: string, qid: string, oid: string, value: string) => setSections(prev => prev.map(s => s.id !== sid ? s : { ...s, questions: s.questions.map(q => q.id !== qid ? q : { ...q, options: q.options?.map(o => o.id === oid ? { ...o, value } : o) }) }))
  const delOption = (sid: string, qid: string, oid: string) => setSections(prev => prev.map(s => s.id !== sid ? s : { ...s, questions: s.questions.map(q => q.id !== qid ? q : { ...q, options: q.options?.filter(o => o.id !== oid) }) }))
  const addSub = (sid: string, qid: string) => setSections(prev => prev.map(s => s.id !== sid ? s : { ...s, questions: s.questions.map(q => q.id !== qid ? q : { ...q, subFields: [...(q.subFields ?? []), { id: uid('sf'), label: `Field ${(q.subFields?.length ?? 0) + 1}`, type: 'short_text' }] }) }))
  const patchSub = (sid: string, qid: string, sfid: string, patch: Partial<BSubField>) => setSections(prev => prev.map(s => s.id !== sid ? s : { ...s, questions: s.questions.map(q => q.id !== qid ? q : { ...q, subFields: q.subFields?.map(sf => sf.id === sfid ? { ...sf, ...patch } : sf) }) }))
  const delSub = (sid: string, qid: string, sfid: string) => setSections(prev => prev.map(s => s.id !== sid ? s : { ...s, questions: s.questions.map(q => q.id !== qid ? q : { ...q, subFields: q.subFields?.filter(sf => sf.id !== sfid) }) }))

  const availableToAdd = TEMPLATE_SECTIONS.filter(s => !sections.some(x => x.sourceId === s.id))
  const canPublish = name.trim().length > 0 && enabledSecs.length > 0 && totalQ > 0
  // Editing an already-published template → only Preview + Update (no draft/publish).
  const isActiveEdit = mode === 'edit' && template?.status === 'Active'

  /* shared styles */
  const inp: React.CSSProperties = { width: '100%', height: 38, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 9, padding: '0 11px', fontSize: 13, color: C.ink, outline: 'none', fontFamily: 'inherit' }
  const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6, display: 'block' }
  const headerBtn = (primary?: boolean): React.CSSProperties => ({ height: 38, padding: primary ? '0 16px' : '0 14px', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, border: primary ? 'none' : `1px solid ${C.border}`, background: primary ? C.navy : C.panel, color: primary ? '#fff' : C.ink })

  return (
    <div className="flex flex-col" style={{ height: '100vh', background: C.wash, fontFamily: "'DM Sans', system-ui, sans-serif", overflow: 'hidden' }}>
      {/* ── Workspace header ── */}
      <header className="flex items-center gap-4 flex-shrink-0" style={{ minHeight: 76, padding: '0 20px', background: C.panel, borderBottom: `1px solid ${C.border}` }}>
        {/* Left — back + template name & description */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onBack}
            className="rounded-lg flex items-center justify-center cursor-pointer flex-shrink-0"
            style={{ width: 40, height: 40, background: C.panel, border: `1px solid ${C.border}`, color: C.muted }}
            onMouseEnter={e => { e.currentTarget.style.color = C.navy; e.currentTarget.style.borderColor = '#D5D9EA' }}
            onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}
          >
            <ArrowLeft size={18} />
          </button>
          <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.10)' }}>
            <LayoutTemplate size={20} style={{ color: C.indigo }} />
          </div>
          <div className="min-w-0" style={{ flex: 1, maxWidth: 460 }}>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Untitled template"
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: 17, fontWeight: 700, color: C.navy, fontFamily: 'inherit', lineHeight: 1.25 }}
            />
            <input
              value={description}
              onChange={e => setDesc(e.target.value)}
              placeholder="Add a short description…"
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: 12.5, fontWeight: 500, color: C.muted, fontFamily: 'inherit', marginTop: 1 }}
            />
          </div>
        </div>

        {/* Center — reporting frequency */}
        <div className="flex items-center gap-1 rounded-lg flex-shrink-0" style={{ background: C.wash, border: `1px solid ${C.border}`, padding: 4, height: 40 }}>
          {FREQS.map(f => {
            const on = frequency === f
            return (
              <button key={f} onClick={() => setFreq(f)} className="rounded-md cursor-pointer" style={{ height: '100%', padding: '0 16px', border: 'none', fontSize: 12.5, fontWeight: 700, background: on ? C.panel : 'transparent', color: on ? C.indigo : C.muted, boxShadow: on ? '0 1px 3px rgba(28,32,53,0.10)' : 'none' }}>
                {freqLabel(f)}
              </button>
            )
          })}
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2.5 flex-1 justify-end">
          {!isActiveEdit && (
            <button onClick={() => flash('Draft saved.')} style={headerBtn()} onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = C.panel }}>
              <Save size={15} /> Save as Draft
            </button>
          )}
          <button onClick={openPreview} style={headerBtn()} onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = C.panel }}>
            <Eye size={15} /> Preview
          </button>
          {isActiveEdit ? (
            <button onClick={() => { flash('Template updated successfully.'); window.setTimeout(onBack, 1000) }} style={headerBtn(true)} onMouseEnter={e => { e.currentTarget.style.background = '#2A2F45' }} onMouseLeave={e => { e.currentTarget.style.background = C.navy }}>
              <CheckCircle2 size={15} /> Update
            </button>
          ) : (
            <button onClick={() => setPublishOpen(true)} style={headerBtn(true)} onMouseEnter={e => { e.currentTarget.style.background = '#2A2F45' }} onMouseLeave={e => { e.currentTarget.style.background = C.navy }}>
              <Send size={15} /> Publish
            </button>
          )}
        </div>
      </header>

      {/* ── Split workspace ── */}
      <div className="flex-1 flex min-h-0">
        {/* Column 1 — Sections outline */}
        <aside className="flex flex-col flex-shrink-0" style={{ width: 300, background: C.panel, borderRight: `1px solid ${C.border}` }}>
            <div className="flex-1 overflow-y-auto" style={{ padding: '16px 14px 8px' }}>
              <div className="flex items-center justify-between" style={{ padding: '0 4px', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.faint, textTransform: 'uppercase', letterSpacing: 0.5 }}>Sections</span>
                <span className="rounded-full" style={{ background: C.wash, color: C.muted, fontSize: 11, fontWeight: 700, padding: '1px 8px', border: `1px solid ${C.border}` }}>{sections.length}</span>
              </div>

              <div className="flex flex-col gap-1.5">
                {sections.map((s, i) => {
                  const on = active?.id === s.id
                  const reqN = s.questions.filter(q => q.required).length
                  return (
                    <div
                      key={s.id}
                      onClick={() => selectSection(s.id)}
                      onDragOver={e => e.preventDefault()}
                      onDragEnter={() => onSecDragEnter(s.id)}
                      className="flex items-center gap-2 rounded-xl cursor-pointer"
                      style={{
                        padding: '9px 10px',
                        background: on ? 'rgba(99,102,241,0.09)' : 'transparent',
                        border: `1px solid ${on ? 'rgba(99,102,241,0.28)' : 'transparent'}`,
                        opacity: dragSec === s.id ? 0.5 : (s.enabled ? 1 : 0.6),
                      }}
                      onMouseEnter={e => { if (!on) e.currentTarget.style.background = C.wash }}
                      onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent' }}
                    >
                      <span draggable onDragStart={e => { e.stopPropagation(); setDragSec(s.id) }} onDragEnd={() => setDragSec(null)} onClick={e => e.stopPropagation()} title="Drag to reorder" style={{ cursor: 'grab', display: 'flex', color: C.faint, flexShrink: 0 }}>
                        <GripVertical size={15} />
                      </span>
                      <span className="rounded-md flex items-center justify-center flex-shrink-0" style={{ width: 22, height: 22, background: on ? C.indigo : C.wash, color: on ? '#fff' : C.muted, fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate" style={{ fontSize: 13, fontWeight: 700, color: s.enabled ? C.navy : C.muted }}>{s.name || 'Untitled section'}</div>
                        <div className="truncate" style={{ fontSize: 11, color: C.faint, fontWeight: 500 }}>{s.questions.length} questions{reqN > 0 && ` · ${reqN} required`}</div>
                      </div>
                      {!s.enabled && (
                        <span className="rounded-md flex-shrink-0" style={{ fontSize: 10, fontWeight: 700, color: C.muted, background: C.wash, border: `1px solid ${C.border}`, padding: '1px 6px' }}>Off</span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Add section */}
              <div className="relative" style={{ marginTop: 10, marginBottom: 8 }}>
                <button
                  onClick={() => setAddOpen(!addOpen)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl cursor-pointer"
                  style={{ height: 40, background: C.wash, color: C.indigo, border: `1px dashed ${C.border}`, fontSize: 13, fontWeight: 700 }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border }}
                >
                  <Plus size={16} /> Add Section
                </button>
                {addOpen && (
                  <div className="rounded-xl" style={{ position: 'absolute', left: 0, right: 0, top: 46, zIndex: 40, maxHeight: 320, overflowY: 'auto', background: C.panel, border: `1px solid ${C.border}`, boxShadow: '0 16px 40px rgba(28,32,53,0.18)', padding: 8 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: 0.4, padding: '4px 8px 8px' }}>Add from library</div>
                    {availableToAdd.length === 0 && <div style={{ fontSize: 12, color: C.faint, padding: '2px 8px 8px' }}>All standard sections added.</div>}
                    {availableToAdd.map(s => (
                      <button key={s.id} onClick={() => addSection(s.id)} className="w-full flex items-center gap-2.5 rounded-lg cursor-pointer text-left" style={{ padding: '8px 10px', background: 'transparent', border: 'none', fontSize: 12.5, fontWeight: 600, color: C.ink }} onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                        <s.Icon size={15} style={{ color: C.indigo, flexShrink: 0 }} /> {s.name}
                      </button>
                    ))}
                    <div style={{ height: 1, background: C.line, margin: '6px 8px' }} />
                    <button onClick={() => addSection()} className="w-full flex items-center gap-2.5 rounded-lg cursor-pointer text-left" style={{ padding: '8px 10px', background: 'transparent', border: 'none', fontSize: 12.5, fontWeight: 700, color: C.indigo }} onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                      <Plus size={15} /> Blank custom section
                    </button>
                  </div>
                )}
              </div>
            </div>

          {/* summary footer */}
          <div className="flex items-center justify-around flex-shrink-0" style={{ padding: '12px 10px', borderTop: `1px solid ${C.line}`, background: C.wash }}>
            {[{ Icon: Layers, v: enabledSecs.length, l: 'Sections' }, { Icon: FileText, v: totalQ, l: 'Questions' }, { Icon: CheckCircle2, v: totalReq, l: 'Required' }].map(x => (
              <div key={x.l} className="flex flex-col items-center gap-0.5">
                <span style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>{x.v}</span>
                <span style={{ fontSize: 10.5, fontWeight: 600, color: C.muted }}>{x.l}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Right — active section editor */}
        <main className="flex-1 flex flex-col min-w-0" style={{ background: C.wash }}>
          {!active ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ padding: 40 }}>
              <div className="rounded-2xl flex items-center justify-center" style={{ width: 60, height: 60, background: C.panel, border: `1px solid ${C.border}`, marginBottom: 16 }}>
                <Layers size={26} style={{ color: C.faint }} />
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>No sections yet</div>
              <div style={{ fontSize: 13, color: C.muted, marginTop: 4, maxWidth: 320 }}>Add a section from the left panel to start building your reporting template.</div>
            </div>
          ) : (
            <>
              {/* Active section header */}
              <div className="flex items-center gap-3 flex-shrink-0" style={{ padding: '16px 24px', background: C.panel, borderBottom: `1px solid ${C.border}` }}>
                <span className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, background: 'rgba(99,102,241,0.10)', color: C.indigo, fontSize: 13, fontWeight: 700 }}>{activeIndex + 1}</span>
                <input
                  value={active.name}
                  onChange={e => patchSection(active.id, { name: e.target.value })}
                  placeholder="Section name"
                  style={{ flex: 1, minWidth: 0, border: 'none', background: 'transparent', outline: 'none', fontSize: 17, fontWeight: 700, color: C.navy, fontFamily: 'inherit' }}
                />
                <span className="hidden md:inline" style={{ fontSize: 12.5, color: C.faint, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {active.questions.length} questions · {active.questions.filter(q => q.required).length} required
                </span>
                <div className="flex items-center gap-1.5" style={{ paddingLeft: 6 }}>
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{active.enabled ? 'Enabled' : 'Disabled'}</span>
                  <Switch checked={active.enabled} onChange={v => patchSection(active.id, { enabled: v })} />
                </div>
                <div className="relative">
                  <button onClick={() => setSecMenu(!secMenu)} className="rounded-lg flex items-center justify-center cursor-pointer" style={{ width: 34, height: 34, background: C.panel, border: `1px solid ${C.border}`, color: C.muted }} onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = C.panel }}>
                    <MoreVertical size={16} />
                  </button>
                  {secMenu && (
                    <div className="rounded-xl" style={{ position: 'absolute', right: 0, top: 40, zIndex: 30, minWidth: 172, background: C.panel, border: `1px solid ${C.border}`, boxShadow: '0 12px 32px rgba(28,32,53,0.16)', padding: 6 }}>
                      {[
                        { icon: ChevronUp, label: 'Move Up', fn: () => { moveSection(active.id, -1); setSecMenu(false) }, disabled: activeIndex === 0 },
                        { icon: ChevronDown, label: 'Move Down', fn: () => { moveSection(active.id, 1); setSecMenu(false) }, disabled: activeIndex === sections.length - 1 },
                        { icon: Copy, label: 'Duplicate', fn: () => { duplicateSection(active.id); setSecMenu(false) } },
                      ].map(m => (
                        <button key={m.label} disabled={m.disabled} onClick={m.fn} className="w-full flex items-center gap-2.5 rounded-lg" style={{ padding: '8px 10px', background: 'transparent', border: 'none', fontSize: 13, fontWeight: 600, color: m.disabled ? C.faint : C.ink, cursor: m.disabled ? 'not-allowed' : 'pointer' }} onMouseEnter={e => { if (!m.disabled) e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                          <m.icon size={15} style={{ color: C.muted }} /> {m.label}
                        </button>
                      ))}
                      <div style={{ height: 1, background: C.line, margin: '4px 6px' }} />
                      <button onClick={() => { deleteSection(active.id); setSecMenu(false) }} className="w-full flex items-center gap-2.5 rounded-lg" style={{ padding: '8px 10px', background: 'transparent', border: 'none', fontSize: 13, fontWeight: 600, color: C.muted, cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(225,29,72,0.08)'; e.currentTarget.style.color = C.red }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted }}>
                        <Trash2 size={15} /> Delete Section
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Questions */}
              <div className="flex-1 overflow-y-auto" style={{ padding: '22px 24px 40px' }}>
                <div style={{ maxWidth: 940, margin: '0 auto' }}>
                  {active.questions.length === 0 && (
                    <div style={{ padding: '28px', textAlign: 'center', fontSize: 13, color: C.faint, border: `1px dashed ${C.border}`, borderRadius: 12, marginBottom: 12, background: C.panel }}>
                      No questions in this section yet — add your first one below.
                    </div>
                  )}

                  {active.questions.map((q, qi) => {
                    const d = typeDef(q.type)
                    const showOptions = 'options' in d && d.options
                    const isNumeric = 'numeric' in d && d.numeric
                    const isText = q.type === 'short_text' || q.type === 'paragraph'
                    return (
                      <div
                        key={q.id}
                        onDragOver={e => e.preventDefault()}
                        onDragEnter={() => onQDragEnter(active.id, q.id)}
                        className="rounded-xl"
                        style={{ border: `1px solid ${C.border}`, background: dragQ?.qid === q.id ? C.wash : C.panel, marginBottom: 10, opacity: dragQ?.qid === q.id ? 0.55 : 1 }}
                      >
                        <div className="flex items-center gap-2.5" style={{ padding: '11px 12px' }}>
                          <span draggable onDragStart={() => setDragQ({ sid: active.id, qid: q.id })} onDragEnd={() => setDragQ(null)} title="Drag to reorder" style={{ cursor: 'grab', display: 'flex', color: C.faint }}>
                            <GripVertical size={16} />
                          </span>
                          <span className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, background: C.wash }}>
                            <d.Icon size={15} style={{ color: C.indigo }} />
                          </span>
                          <input value={q.label} onChange={e => patchQuestion(active.id, q.id, { label: e.target.value })} placeholder="Question / field label" style={{ flex: 1, minWidth: 0, height: 34, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, fontWeight: 600, color: C.navy, fontFamily: 'inherit' }} />
                          <div className="relative flex-shrink-0">
                            <select value={q.type} onChange={e => changeType(active.id, q.id, e.target.value as FieldTypeKey)} className="cursor-pointer appearance-none" style={{ height: 34, background: C.wash, color: C.ink, border: `1px solid ${C.border}`, borderRadius: 8, padding: '0 28px 0 11px', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit', outline: 'none' }}>
                              {FIELD_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                            </select>
                            <ChevronDown size={13} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0" style={{ paddingLeft: 2 }}>
                            <span className="hidden lg:inline" style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>Required</span>
                            <Switch checked={q.required} onChange={v => patchQuestion(active.id, q.id, { required: v })} />
                          </div>
                          <button onClick={() => patchQuestion(active.id, q.id, { expanded: !q.expanded })} className="rounded-lg flex items-center justify-center cursor-pointer flex-shrink-0" style={{ width: 32, height: 32, background: q.expanded ? 'rgba(99,102,241,0.10)' : 'transparent', border: 'none', color: q.expanded ? C.indigo : C.muted }} title="Field settings">
                            <Settings2 size={16} />
                          </button>
                          <div className="relative flex-shrink-0">
                            <button onClick={() => setQMenu(qMenu === q.id ? null : q.id)} className="rounded-lg flex items-center justify-center cursor-pointer" style={{ width: 32, height: 32, background: 'transparent', border: 'none', color: C.muted }} onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                              <MoreVertical size={16} />
                            </button>
                            {qMenu === q.id && (
                              <div className="rounded-xl" style={{ position: 'absolute', right: 0, top: 36, zIndex: 30, minWidth: 160, background: C.panel, border: `1px solid ${C.border}`, boxShadow: '0 12px 32px rgba(28,32,53,0.16)', padding: 6 }}>
                                {[
                                  { icon: ChevronUp, label: 'Move Up', fn: () => { moveQuestion(active.id, q.id, -1); setQMenu(null) }, disabled: qi === 0 },
                                  { icon: ChevronDown, label: 'Move Down', fn: () => { moveQuestion(active.id, q.id, 1); setQMenu(null) }, disabled: qi === active.questions.length - 1 },
                                  { icon: Copy, label: 'Duplicate', fn: () => { duplicateQuestion(active.id, q.id); setQMenu(null) } },
                                ].map(m => (
                                  <button key={m.label} disabled={m.disabled} onClick={m.fn} className="w-full flex items-center gap-2.5 rounded-lg" style={{ padding: '8px 10px', background: 'transparent', border: 'none', fontSize: 13, fontWeight: 600, color: m.disabled ? C.faint : C.ink, cursor: m.disabled ? 'not-allowed' : 'pointer' }} onMouseEnter={e => { if (!m.disabled) e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                                    <m.icon size={15} style={{ color: C.muted }} /> {m.label}
                                  </button>
                                ))}
                                <div style={{ height: 1, background: C.line, margin: '4px 6px' }} />
                                <button onClick={() => { deleteQuestion(active.id, q.id); setQMenu(null) }} className="w-full flex items-center gap-2.5 rounded-lg" style={{ padding: '8px 10px', background: 'transparent', border: 'none', fontSize: 13, fontWeight: 600, color: C.muted, cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(225,29,72,0.08)'; e.currentTarget.style.color = C.red }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.muted }}>
                                  <Trash2 size={15} /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {q.expanded && (
                          <div style={{ padding: '14px 16px 16px 52px', borderTop: `1px dashed ${C.line}` }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                              {isText && (
                                <div>
                                  <label style={lbl}>Placeholder</label>
                                  <input value={q.placeholder ?? ''} onChange={e => patchQuestion(active.id, q.id, { placeholder: e.target.value })} placeholder="Hint text shown in the field" style={inp} />
                                </div>
                              )}
                              <div>
                                <label style={lbl}>Help Text</label>
                                <input value={q.help ?? ''} onChange={e => patchQuestion(active.id, q.id, { help: e.target.value })} placeholder="Guidance for the manager (optional)" style={inp} />
                              </div>
                              {isNumeric && (
                                <>
                                  <div>
                                    <label style={lbl}>Minimum</label>
                                    <input value={q.min ?? ''} onChange={e => patchQuestion(active.id, q.id, { min: e.target.value })} placeholder={q.type === 'percent' ? '0' : 'No min'} style={inp} />
                                  </div>
                                  <div>
                                    <label style={lbl}>Maximum</label>
                                    <input value={q.max ?? ''} onChange={e => patchQuestion(active.id, q.id, { max: e.target.value })} placeholder={q.type === 'percent' ? '100' : 'No max'} style={inp} />
                                  </div>
                                </>
                              )}
                              {q.type === 'file' && (
                                <div>
                                  <label style={lbl}>Allowed File Types</label>
                                  <input value={q.fileTypes ?? ''} onChange={e => patchQuestion(active.id, q.id, { fileTypes: e.target.value })} placeholder="e.g. PDF, XLSX, PNG" style={inp} />
                                </div>
                              )}
                            </div>

                            {showOptions && (
                              <div style={{ marginTop: 14 }}>
                                <label style={lbl}>Options</label>
                                <div className="flex flex-col gap-2">
                                  {q.options?.map((o, oi) => (
                                    <div key={o.id} className="flex items-center gap-2">
                                      <CircleDot size={14} style={{ color: C.faint, flexShrink: 0 }} />
                                      <input value={o.value} onChange={e => patchOption(active.id, q.id, o.id, e.target.value)} placeholder={`Option ${oi + 1}`} style={{ ...inp, height: 34, maxWidth: 420 }} />
                                      <button onClick={() => delOption(active.id, q.id, o.id)} className="rounded-md flex items-center justify-center cursor-pointer flex-shrink-0" style={{ width: 32, height: 32, background: 'transparent', border: `1px solid ${C.border}`, color: C.muted }} onMouseEnter={e => { e.currentTarget.style.color = C.red; e.currentTarget.style.borderColor = 'rgba(225,29,72,0.3)' }} onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}>
                                        <X size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                <button onClick={() => addOption(active.id, q.id)} className="inline-flex items-center gap-1.5 rounded-lg cursor-pointer" style={{ marginTop: 8, height: 32, background: C.wash, color: C.indigo, border: `1px solid ${C.border}`, padding: '0 12px', fontSize: 12.5, fontWeight: 600 }}>
                                  <Plus size={14} /> Add Option
                                </button>
                              </div>
                            )}

                            {q.type === 'group' && (
                              <div style={{ marginTop: 14 }}>
                                <label style={lbl}>Fields in each entry <span style={{ textTransform: 'none', fontWeight: 500, color: C.faint }}>· managers can add multiple entries</span></label>
                                <div className="flex flex-col gap-2">
                                  {q.subFields?.map(sf => (
                                    <div key={sf.id} className="flex items-center gap-2">
                                      <Rows3 size={14} style={{ color: C.faint, flexShrink: 0 }} />
                                      <input value={sf.label} onChange={e => patchSub(active.id, q.id, sf.id, { label: e.target.value })} placeholder="Field label" style={{ ...inp, height: 34, maxWidth: 360 }} />
                                      <div className="relative flex-shrink-0">
                                        <select value={sf.type} onChange={e => patchSub(active.id, q.id, sf.id, { type: e.target.value as FieldTypeKey })} className="cursor-pointer appearance-none" style={{ height: 34, background: C.wash, color: C.ink, border: `1px solid ${C.border}`, borderRadius: 8, padding: '0 26px 0 10px', fontSize: 12.5, fontWeight: 600, fontFamily: 'inherit', outline: 'none' }}>
                                          {FIELD_TYPES.filter(t => !['group', 'file', 'team_count'].includes(t.key)).map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                                        </select>
                                        <ChevronDown size={13} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                                      </div>
                                      <button onClick={() => delSub(active.id, q.id, sf.id)} className="rounded-md flex items-center justify-center cursor-pointer flex-shrink-0" style={{ width: 32, height: 32, background: 'transparent', border: `1px solid ${C.border}`, color: C.muted }} onMouseEnter={e => { e.currentTarget.style.color = C.red; e.currentTarget.style.borderColor = 'rgba(225,29,72,0.3)' }} onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}>
                                        <X size={14} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                <button onClick={() => addSub(active.id, q.id)} className="inline-flex items-center gap-1.5 rounded-lg cursor-pointer" style={{ marginTop: 8, height: 32, background: C.wash, color: C.indigo, border: `1px solid ${C.border}`, padding: '0 12px', fontSize: 12.5, fontWeight: 600 }}>
                                  <Plus size={14} /> Add Field
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  <button
                    onClick={() => addQuestion(active.id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl cursor-pointer"
                    style={{ height: 44, background: C.panel, color: C.indigo, border: `1px dashed ${C.border}`, fontSize: 13.5, fontWeight: 700, marginTop: 2 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)'; e.currentTarget.style.background = 'rgba(99,102,241,0.04)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.panel }}
                  >
                    <Plus size={16} /> Add Question
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* click-away for menus */}
      {(secMenu || qMenu || addOpen) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20 }} onClick={() => { setSecMenu(false); setQMenu(null); setAddOpen(false) }} />
      )}

      {/* Publish modal */}
      {publishOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          onClick={e => { if (e.target === e.currentTarget) setPublishOpen(false) }}
        >
          <div style={{ background: '#fff', borderRadius: 22, width: 420, boxShadow: '0 24px 64px rgba(10,12,28,0.22)', overflow: 'hidden' }}>
            <div style={{ padding: '26px 28px 0', textAlign: 'center' }}>
              <div className="rounded-2xl flex items-center justify-center" style={{ width: 56, height: 56, background: canPublish ? 'rgba(99,102,241,0.10)' : 'rgba(217,119,6,0.10)', margin: '0 auto 16px' }}>
                {canPublish ? <Send size={24} style={{ color: C.indigo }} /> : <AlertTriangle size={24} style={{ color: C.amber }} />}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, marginBottom: 6 }}>{canPublish ? 'Publish this template?' : 'Almost there'}</div>
              {canPublish ? (
                <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.6 }}>
                  <strong style={{ color: C.ink }}>“{name || 'Untitled'}”</strong> will become available to assign to projects on the <strong style={{ color: C.ink }}>{freqLabel(frequency)}</strong> cadence.
                </p>
              ) : (
                <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.6 }}>Add a template name and at least one enabled section with a question before publishing.</p>
              )}
            </div>
            {canPublish && (
              <div className="flex items-center justify-center gap-2 flex-wrap" style={{ margin: '16px 28px 0', padding: '12px 14px', background: C.wash, borderRadius: 12 }}>
                <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 600 }}>{freqLabel(frequency)}</span>
                <span style={{ width: 1, height: 14, background: C.border }} />
                <span style={{ fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{enabledSecs.length} sections</span>
                <span style={{ width: 1, height: 14, background: C.border }} />
                <span style={{ fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{totalQ} questions</span>
                <span style={{ width: 1, height: 14, background: C.border }} />
                <span style={{ fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{totalReq} required</span>
              </div>
            )}
            <div style={{ padding: '20px 28px 24px', display: 'flex', gap: 10 }}>
              <button onClick={() => setPublishOpen(false)} style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.color = C.navy; e.currentTarget.style.borderColor = '#C8CCE0' }} onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}>
                {canPublish ? 'Cancel' : 'Go back'}
              </button>
              {canPublish && (
                <button onClick={() => { setPublishOpen(false); flash('Template published successfully.'); window.setTimeout(onBack, 1000) }} className="inline-flex items-center justify-center gap-2" style={{ flex: 1, height: 44, borderRadius: 12, border: 'none', background: C.indigo, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5' }} onMouseLeave={e => { e.currentTarget.style.background = C.indigo }}>
                  <Send size={15} /> Publish
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="flex items-center gap-2.5" style={{ position: 'fixed', right: 26, bottom: 26, zIndex: 9999, background: C.navy, color: '#fff', borderRadius: 12, padding: '12px 16px', fontSize: 13, fontWeight: 600, boxShadow: '0 14px 40px rgba(10,12,28,0.30)', fontFamily: "'DM Sans', system-ui, sans-serif", maxWidth: 380 }}>
          <CheckCircle2 size={17} style={{ color: '#8CE0B0', flexShrink: 0 }} />
          <span>{toast}</span>
        </div>
      )}

      {/* Template Preview overlay */}
      {preview && <TemplatePreviewPage data={preview} onBack={() => setPreview(null)} />}
    </div>
  )
}
