import { useState } from 'react'
import {
  ArrowLeft, Eye, ChevronDown, ChevronLeft, ChevronRight, Calendar, Upload,
  Plus, CircleDot, Users, CheckCircle2,
} from 'lucide-react'
import { TEMPLATE_SECTIONS, type FieldKind } from '../../manager/reporting/reportTemplate'
import type { ReportTemplate, Frequency } from './reportingTemplatesData'

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
  red:    '#E11D48',
}

/* ── Normalized preview model (shared by both entry points) ── */
export type PreviewFieldType =
  | 'short_text' | 'paragraph' | 'number' | 'percent' | 'dropdown'
  | 'single_select' | 'date' | 'checklist' | 'file' | 'team_count' | 'group'

export interface PreviewField {
  id: string
  label: string
  type: PreviewFieldType
  required: boolean
  help?: string
  placeholder?: string
  options?: string[]
  subFields?: { label: string; type: PreviewFieldType }[]
}
export interface PreviewSection { id: string; name: string; fields: PreviewField[] }
export interface PreviewData { name: string; description?: string; frequency: Frequency; sections: PreviewSection[] }

const KIND_TO_TYPE: Record<FieldKind, PreviewFieldType> = {
  text: 'short_text', textarea: 'paragraph', number: 'number', percent: 'percent',
  segmented: 'single_select', select: 'dropdown', list: 'group', bullets: 'checklist', teamcount: 'team_count',
}
const SUBKIND_TO_TYPE: Record<string, PreviewFieldType> = {
  text: 'short_text', textarea: 'paragraph', segmented: 'single_select', date: 'date', number: 'number',
}

/** Build preview data from a saved template (Library card → Preview). */
export function templateToPreview(t: ReportTemplate): PreviewData {
  const sections: PreviewSection[] = t.sections.map(id => {
    const def = TEMPLATE_SECTIONS.find(s => s.id === id)
    if (!def) return { id, name: id, fields: [] }
    return {
      id: def.id,
      name: def.name,
      fields: def.fields.map(f => ({
        id: f.id,
        label: f.label,
        type: KIND_TO_TYPE[f.kind],
        required: !!f.required,
        help: f.help,
        placeholder: f.placeholder,
        options: f.options?.map(o => o.value),
        subFields: f.subFields?.map(sf => ({ label: sf.label, type: SUBKIND_TO_TYPE[sf.kind] ?? 'short_text' })),
      })),
    }
  })
  return { name: t.name, description: t.description, frequency: t.frequency, sections }
}

const freqLabel = (f: Frequency) => (f === 'Biweekly' ? 'Bi-weekly' : f)

/* ── read-only field control renderer ── */
const ctrl: React.CSSProperties = {
  border: `1px solid ${C.border}`, background: C.wash, borderRadius: 10, minHeight: 44,
  padding: '0 13px', display: 'flex', alignItems: 'center', fontSize: 13.5, color: C.faint, fontWeight: 500,
}

function Control({ f }: { f: PreviewField }) {
  switch (f.type) {
    case 'paragraph':
      return <div style={{ ...ctrl, minHeight: 84, alignItems: 'flex-start', paddingTop: 12 }}>{f.placeholder || 'Longer text answer…'}</div>
    case 'number':
      return <div style={{ ...ctrl, justifyContent: 'space-between' }}><span>0</span><span style={{ fontSize: 12, color: C.faint }}>number</span></div>
    case 'percent':
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}><span style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>0%</span></div>
          <div style={{ height: 6, borderRadius: 999, background: C.line, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translate(-2px,-50%)', width: 16, height: 16, borderRadius: '50%', background: C.panel, border: `2px solid ${C.indigo}`, boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }} />
          </div>
        </div>
      )
    case 'dropdown':
      return <div style={{ ...ctrl, justifyContent: 'space-between' }}>Select an option <ChevronDown size={15} style={{ color: C.muted }} /></div>
    case 'single_select':
      return (
        <div className="flex flex-wrap" style={{ gap: 8 }}>
          {(f.options?.length ? f.options : ['Option 1', 'Option 2']).map((o, i) => (
            <span key={i} style={{ padding: '8px 15px', borderRadius: 999, background: C.wash, border: `1px solid ${C.border}`, color: C.muted, fontSize: 12.5, fontWeight: 600 }}>{o}</span>
          ))}
        </div>
      )
    case 'date':
      return <div style={{ ...ctrl, justifyContent: 'space-between' }}>dd / mm / yyyy <Calendar size={15} style={{ color: C.muted }} /></div>
    case 'checklist':
      return (
        <div className="flex items-center" style={{ ...ctrl, justifyContent: 'space-between' }}>
          Add an item and press Enter…
          <span className="rounded-md flex items-center justify-center" style={{ width: 26, height: 26, background: C.panel, border: `1px solid ${C.border}`, color: C.muted }}><Plus size={14} /></span>
        </div>
      )
    case 'file':
      return (
        <div style={{ border: `1.5px dashed ${C.border}`, borderRadius: 12, padding: '22px 16px', textAlign: 'center', background: C.wash }}>
          <div className="rounded-xl flex items-center justify-center" style={{ width: 40, height: 40, background: C.panel, border: `1px solid ${C.border}`, margin: '0 auto 10px' }}><Upload size={18} style={{ color: C.muted }} /></div>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>Click to upload or drag &amp; drop</div>
          {f.subFields ? null : <div style={{ fontSize: 11.5, color: C.faint, marginTop: 3 }}>Allowed file types</div>}
        </div>
      )
    case 'team_count':
      return <div style={{ ...ctrl, justifyContent: 'space-between', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.20)', color: C.ink }}><span className="flex items-center" style={{ gap: 8 }}><Users size={15} style={{ color: C.indigo }} /> Overall Team Members</span><span style={{ fontWeight: 800, color: C.navy }}>—</span></div>
    case 'group':
      return (
        <div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px', background: C.panel }}>
            <div style={{ fontSize: 10.5, fontWeight: 800, color: C.faint, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 12 }}>Entry 1</div>
            {(f.subFields ?? []).map((sf, i) => (
              <div key={i} style={{ marginBottom: i < (f.subFields!.length - 1) ? 12 : 0 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: C.ink, marginBottom: 6 }}>{sf.label}</label>
                <Control f={{ id: `${f.id}-${i}`, label: sf.label, type: sf.type, required: false }} />
              </div>
            ))}
          </div>
          <div className="inline-flex items-center" style={{ gap: 6, marginTop: 10, height: 36, padding: '0 14px', borderRadius: 9, background: C.wash, border: `1px dashed ${C.border}`, color: C.muted, fontSize: 12.5, fontWeight: 600 }}>
            <Plus size={14} /> Add {f.label || 'entry'}
          </div>
        </div>
      )
    default: // short_text
      return <div style={ctrl}>{f.placeholder || 'Short text answer'}</div>
  }
}

function Field({ f }: { f: PreviewField }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <label style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: C.navy, marginBottom: f.help ? 4 : 9 }}>
        {f.label || 'Untitled field'} {f.required && <span style={{ color: C.red }}>*</span>}
      </label>
      {f.help && <div style={{ fontSize: 12, color: C.muted, marginBottom: 9, lineHeight: 1.5 }}>{f.help}</div>}
      <Control f={f} />
    </div>
  )
}

/* ── main preview overlay ── */
export default function TemplatePreviewPage({ data, onBack }: { data: PreviewData; onBack: () => void }) {
  const sections = data.sections
  const [step, setStep] = useState(0)
  const active = sections[step]
  const totalReq = sections.reduce((n, s) => n + s.fields.filter(f => f.required).length, 0)

  return (
    <div className="flex flex-col" style={{ position: 'fixed', inset: 0, zIndex: 200, background: C.wash, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Top bar */}
      <header className="flex items-center justify-between gap-4 flex-shrink-0" style={{ minHeight: 68, padding: '0 20px', background: C.panel, borderBottom: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onBack} className="rounded-lg flex items-center justify-center cursor-pointer flex-shrink-0" style={{ width: 40, height: 40, background: C.panel, border: `1px solid ${C.border}`, color: C.muted }} onMouseEnter={e => { e.currentTarget.style.color = C.navy; e.currentTarget.style.borderColor = '#D5D9EA' }} onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}>
            <ArrowLeft size={18} />
          </button>
          <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.10)' }}>
            <Eye size={19} style={{ color: C.indigo }} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-bold truncate" style={{ color: C.navy, fontSize: 16.5, lineHeight: 1.2 }}>{data.name || 'Untitled template'}</h1>
              <span className="rounded-md flex-shrink-0" style={{ fontSize: 11, fontWeight: 700, color: C.indigo, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.20)', padding: '2px 8px' }}>{freqLabel(data.frequency)}</span>
            </div>
            <p className="truncate" style={{ color: C.muted, fontSize: 12.5, marginTop: 1 }}>Manager's view · exactly how this report will look when filled in</p>
          </div>
        </div>
        <button onClick={onBack} className="inline-flex items-center gap-1.5 rounded-lg cursor-pointer flex-shrink-0" style={{ height: 38, background: C.navy, color: '#fff', border: 'none', padding: '0 16px', fontSize: 13, fontWeight: 600 }} onMouseEnter={e => { e.currentTarget.style.background = '#2A2F45' }} onMouseLeave={e => { e.currentTarget.style.background = C.navy }}>
          Close Preview
        </button>
      </header>

      {/* Body */}
      {sections.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ padding: 40 }}>
          <div className="rounded-2xl flex items-center justify-center" style={{ width: 60, height: 60, background: C.panel, border: `1px solid ${C.border}`, marginBottom: 16 }}><Eye size={26} style={{ color: C.faint }} /></div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Nothing to preview yet</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Add at least one enabled section with fields.</div>
        </div>
      ) : (
        <div className="flex-1 flex min-h-0">
          {/* Left stepper */}
          <aside className="flex flex-col flex-shrink-0 overflow-y-auto" style={{ width: 284, background: C.panel, borderRight: `1px solid ${C.border}`, padding: '18px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.faint, textTransform: 'uppercase', letterSpacing: 0.5, padding: '0 6px', marginBottom: 12 }}>Report Sections</div>
            <div className="flex flex-col gap-1">
              {sections.map((s, i) => {
                const on = i === step
                const reqN = s.fields.filter(f => f.required).length
                return (
                  <button key={s.id} onClick={() => setStep(i)} className="flex items-center gap-3 rounded-xl cursor-pointer text-left" style={{ padding: '10px 10px', border: `1px solid ${on ? 'rgba(99,102,241,0.28)' : 'transparent'}`, background: on ? 'rgba(99,102,241,0.09)' : 'transparent' }} onMouseEnter={e => { if (!on) e.currentTarget.style.background = C.wash }} onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent' }}>
                    <span className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 26, height: 26, background: on ? C.indigo : C.wash, color: on ? '#fff' : C.muted, fontSize: 12, fontWeight: 700 }}>{i + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate" style={{ fontSize: 13, fontWeight: 700, color: on ? C.navy : C.ink }}>{s.name || 'Untitled section'}</span>
                      <span className="block truncate" style={{ fontSize: 11, color: C.faint, fontWeight: 500 }}>{s.fields.length} fields{reqN > 0 && ` · ${reqN} required`}</span>
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="flex items-center justify-around" style={{ marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
              {[{ v: sections.length, l: 'Sections' }, { v: sections.reduce((n, s) => n + s.fields.length, 0), l: 'Fields' }, { v: totalReq, l: 'Required' }].map(x => (
                <div key={x.l} className="flex flex-col items-center gap-0.5"><span style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>{x.v}</span><span style={{ fontSize: 10.5, fontWeight: 600, color: C.muted }}>{x.l}</span></div>
              ))}
            </div>
          </aside>

          {/* Right form */}
          <main className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto" style={{ padding: '26px 24px 40px' }}>
              <div style={{ maxWidth: 720, margin: '0 auto' }}>
                <div className="rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
                  {/* section header */}
                  <div className="flex items-center gap-3" style={{ padding: '18px 26px', borderBottom: `1px solid ${C.line}`, background: C.wash }}>
                    <span className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 30, height: 30, background: 'rgba(99,102,241,0.10)', color: C.indigo, fontSize: 13, fontWeight: 700 }}>{step + 1}</span>
                    <div className="min-w-0">
                      <div className="truncate" style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{active.name || 'Untitled section'}</div>
                      <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>Step {step + 1} of {sections.length}</div>
                    </div>
                  </div>
                  {/* fields */}
                  <div style={{ padding: '24px 26px 10px' }}>
                    {active.fields.length === 0 ? (
                      <div style={{ padding: '30px', textAlign: 'center', fontSize: 13, color: C.faint }}>This section has no fields.</div>
                    ) : active.fields.map(f => <Field key={f.id} f={f} />)}
                  </div>
                </div>

                {/* footer nav */}
                <div className="flex items-center justify-between" style={{ marginTop: 18 }}>
                  <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} className="inline-flex items-center gap-1.5 rounded-lg" style={{ height: 42, padding: '0 16px', background: C.panel, border: `1px solid ${C.border}`, color: step === 0 ? C.faint : C.ink, fontSize: 13, fontWeight: 600, cursor: step === 0 ? 'not-allowed' : 'pointer' }}>
                    <ChevronLeft size={16} /> Previous
                  </button>
                  {step < sections.length - 1 ? (
                    <button onClick={() => setStep(s => Math.min(sections.length - 1, s + 1))} className="inline-flex items-center gap-1.5 rounded-lg cursor-pointer" style={{ height: 42, padding: '0 18px', background: C.indigo, border: 'none', color: '#fff', fontSize: 13, fontWeight: 600 }} onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5' }} onMouseLeave={e => { e.currentTarget.style.background = C.indigo }}>
                      Next Section <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button disabled className="inline-flex items-center gap-1.5 rounded-lg" style={{ height: 42, padding: '0 18px', background: 'rgba(22,163,74,0.10)', border: '1px solid rgba(22,163,74,0.25)', color: C.green, fontSize: 13, fontWeight: 700, cursor: 'default' }}>
                      <CheckCircle2 size={16} /> Submit Report
                    </button>
                  )}
                </div>
                <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: C.faint }}>
                  <CircleDot size={12} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle', color: C.faint }} />
                  Preview only — fields are not editable here
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  )
}
