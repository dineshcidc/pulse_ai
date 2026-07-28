import { useState } from 'react'
import {
  ArrowLeft, FolderKanban, CalendarClock, ChevronDown, Bell, Send, Layers,
} from 'lucide-react'
import {
  REPORTING_TEMPLATES, PM_AVATARS,
  formatDate, type AssignmentProject, type Assignment, type Frequency,
} from './projectAssignmentData'

const C = {
  navy: '#1C2035', ink: '#2A2F45', muted: '#8B90A7', faint: '#AEB2C4',
  border: '#E8EAF2', line: '#EEF0F6', panel: '#FFFFFF', wash: '#F6F7FB',
  indigo: '#6366F1', green: '#16A34A', amber: '#D97706', red: '#E11D48', blue: '#2563EB',
}

const FREQ_ORDER: Frequency[] = ['Weekly', 'Biweekly', 'Monthly']
const freqLabel = (f: Frequency) => (f === 'Biweekly' ? 'Bi-weekly' : f)
const FREQ_ACCENT: Record<Frequency, string> = { Weekly: C.indigo, Biweekly: C.blue, Monthly: C.green }
const cadenceText = (f: Frequency) => f === 'Weekly' ? 'Reports are due every Friday' : f === 'Biweekly' ? 'Reports are due every other Friday' : 'Reports are due 2 days before month-end'

function isoOf(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
function fridayOnOrAfter(d: Date) { const x = new Date(d); const diff = (5 - x.getDay() + 7) % 7; x.setDate(x.getDate() + diff); return x }
function firstDueDate(freq: Frequency, startISO: string): string {
  const start = new Date(startISO + 'T00:00:00')
  if (Number.isNaN(start.getTime())) return startISO
  if (freq === 'Monthly') {
    let due = new Date(start.getFullYear(), start.getMonth() + 1, 0); due.setDate(due.getDate() - 2)
    if (due < start) { due = new Date(start.getFullYear(), start.getMonth() + 2, 0); due.setDate(due.getDate() - 2) }
    return isoOf(due)
  }
  return isoOf(fridayOnOrAfter(start))
}

function initials(n: string) { return n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() }
function Avatar({ name, size = 30 }: { name: string; size?: number }) {
  const img = PM_AVATARS[name]
  if (img) return <img src={`https://i.pravatar.cc/150?img=${img}`} alt={name} className="rounded-full flex-shrink-0 object-cover" style={{ width: size, height: size, border: `1px solid ${C.border}` }} />
  return <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, background: 'rgba(99,102,241,0.10)', color: C.indigo, fontSize: size * 0.36, fontWeight: 700 }}>{initials(name)}</div>
}
function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return <button type="button" onClick={() => onChange(!checked)} className="rounded-full cursor-pointer flex-shrink-0" style={{ width: 40, height: 23, background: checked ? C.indigo : '#D7DAE8', border: 'none', position: 'relative', transition: 'background .15s' }}><span style={{ position: 'absolute', top: 2, left: checked ? 19 : 2, width: 19, height: 19, borderRadius: '50%', background: '#fff', transition: 'left .15s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} /></button>
}

interface CadConf { enabled: boolean; templateId: string; startDate: string; remind: boolean }
function initConf(f: Frequency, project: AssignmentProject): CadConf {
  const a = project.assignments.find(x => x.frequency === f)
  return a ? { enabled: true, templateId: a.templateId, startDate: a.startDate, remind: a.remind }
    : { enabled: false, templateId: REPORTING_TEMPLATES.find(t => t.frequency === f)?.id ?? '', startDate: '2026-07-27', remind: true }
}

interface Props {
  project: AssignmentProject
  mode: 'assign' | 'manage'
  onBack: () => void
  onPublish: (projectId: string, assignments: Assignment[]) => void
}

export default function AssignmentEditorPage({ project, mode, onBack, onPublish }: Props) {
  const [conf, setConf] = useState<Record<Frequency, CadConf>>({ Weekly: initConf('Weekly', project), Biweekly: initConf('Biweekly', project), Monthly: initConf('Monthly', project) })
  const setCad = (f: Frequency, patch: Partial<CadConf>) => setConf(prev => ({ ...prev, [f]: { ...prev[f], ...patch } }))

  const enabledCount = FREQ_ORDER.filter(f => conf[f].enabled).length
  const canPublish = enabledCount > 0 && FREQ_ORDER.every(f => !conf[f].enabled || conf[f].templateId)

  function publish() {
    const assignments: Assignment[] = FREQ_ORDER.filter(f => conf[f].enabled && conf[f].templateId).map(f => ({
      frequency: f, templateId: conf[f].templateId, startDate: conf[f].startDate, nextDue: firstDueDate(f, conf[f].startDate), remind: conf[f].remind,
    }))
    onPublish(project.id, assignments)
  }

  const inp: React.CSSProperties = { width: '100%', height: 42, background: C.wash, border: `1px solid ${C.border}`, borderRadius: 10, padding: '0 12px', fontSize: 13.5, color: C.ink, outline: 'none', fontFamily: 'inherit' }
  const lbl: React.CSSProperties = { fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8, display: 'block' }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", paddingBottom: 20 }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s' }} onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}>
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <button onClick={onBack} style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }} onMouseEnter={e => { e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>Project Assignment</button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{mode === 'manage' ? 'Manage Assignment' : 'Assign Templates'}</span>
      </div>

      {/* One white card — project detail (3) + cadences & actions (9) */}
      <div className="rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 9fr', alignItems: 'stretch' }}>

          {/* ── Left (3): Project detail — sticky ── */}
          <div style={{ padding: 22, position: 'sticky', top: 0, alignSelf: 'start' }}>
            <div className="rounded-xl flex items-center justify-center" style={{ width: 46, height: 46, background: 'rgba(99,102,241,0.10)' }}>
              <FolderKanban size={22} style={{ color: C.indigo }} />
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginTop: 14 }}>{project.name}</h1>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginTop: 10 }}>{project.description}</p>

            <div style={{ height: 1, background: C.line, margin: '18px 0' }} />

            <span style={lbl}>Project Manager</span>
            <div className="flex items-center gap-2.5 rounded-xl" style={{ background: C.wash, border: `1px solid ${C.border}`, padding: '10px 12px' }}>
              <Avatar name={project.pm} size={38} />
              <div className="min-w-0">
                <div className="truncate" style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{project.pm}</div>
                <div style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>Project Manager</div>
              </div>
            </div>
          </div>

          {/* ── Right (9): Reporting Cadences + actions ── */}
          <div style={{ padding: 22, display: 'flex', flexDirection: 'column', borderLeft: `1px solid ${C.line}` }}>
            {/* Section heading */}
            <div style={{ marginBottom: 14 }}>
              <div className="flex items-center gap-2"><Layers size={17} style={{ color: C.indigo }} /><span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Reporting Cadences</span></div>
              <p style={{ fontSize: 13, color: C.muted, marginTop: 3 }}>Enable and configure any combination of Weekly, Bi-weekly and Monthly reporting for this project.</p>
            </div>

            {/* Cadence cards */}
            <div className="flex flex-col gap-3">
              {FREQ_ORDER.map(f => {
                const c = conf[f]
                const accent = FREQ_ACCENT[f]
                const templates = REPORTING_TEMPLATES.filter(t => t.frequency === f)
                return (
                  <div key={f} className="rounded-2xl" style={{ background: C.panel, border: `1px solid ${c.enabled ? 'rgba(99,102,241,0.28)' : C.border}` }}>
                    <div className="flex items-center justify-between" style={{ padding: '16px 18px', borderBottom: c.enabled ? `1px solid ${C.line}` : 'none' }}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 42, height: 42, background: `${accent}14` }}><CalendarClock size={21} style={{ color: accent }} /></div>
                        <div className="min-w-0"><div style={{ fontSize: 15, fontWeight: 700, color: c.enabled ? C.navy : C.muted }}>{freqLabel(f)} Reporting</div><div style={{ fontSize: 12, color: C.faint, fontWeight: 500 }}>{cadenceText(f)}</div></div>
                      </div>
                      <div className="flex items-center gap-2.5"><span style={{ fontSize: 12, color: C.muted, fontWeight: 600 }}>{c.enabled ? 'Enabled' : 'Off'}</span><Switch checked={c.enabled} onChange={v => setCad(f, { enabled: v })} /></div>
                    </div>
                    {c.enabled && (
                      <div style={{ padding: '18px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
                          <div>
                            <label style={lbl}>Reporting Template</label>
                            <div className="relative">
                              <select value={c.templateId} onChange={e => setCad(f, { templateId: e.target.value })} style={{ ...inp, appearance: 'none', paddingRight: 36, cursor: 'pointer', color: c.templateId ? C.ink : C.faint }}>
                                <option value="">Select a {freqLabel(f)} template…</option>
                                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                              </select>
                              <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                            </div>
                          </div>
                          <div>
                            <label style={lbl}>Reporting Starts On</label>
                            <input type="date" value={c.startDate} onChange={e => setCad(f, { startDate: e.target.value })} style={{ ...inp, cursor: 'pointer' }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl" style={{ background: `${accent}0F`, border: `1px solid ${accent}30`, padding: '12px 14px', marginTop: 14 }}>
                          <CalendarClock size={17} style={{ color: accent, flexShrink: 0 }} />
                          <div style={{ fontSize: 12.5, color: C.muted }}>{freqLabel(f)} · auto-scheduled — first report due <strong style={{ color: C.ink }}>{formatDate(firstDueDate(f, c.startDate))}</strong>.</div>
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-xl" style={{ border: `1px solid ${C.border}`, padding: '12px 14px', marginTop: 12 }}>
                          <div className="flex items-center gap-2.5 min-w-0"><div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32, background: C.wash }}><Bell size={15} style={{ color: C.muted }} /></div><div><div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Send reminders</div><div style={{ fontSize: 11.5, color: C.muted }}>Notify {project.pm} before each report is due</div></div></div>
                          <Switch checked={c.remind} onChange={v => setCad(f, { remind: v })} />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between flex-wrap gap-3" style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
              <div style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>
                {enabledCount === 0 ? 'Enable at least one cadence to publish.' : <><strong style={{ color: C.navy }}>{enabledCount}</strong> cadence{enabledCount > 1 ? 's' : ''} will be assigned to this project.</>}
              </div>
              <div className="flex items-center gap-2.5">
                <button onClick={onBack} className="rounded-lg cursor-pointer" style={{ height: 42, padding: '0 16px', background: C.panel, border: `1px solid ${C.border}`, color: C.ink, fontSize: 13, fontWeight: 600 }} onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = C.panel }}>Cancel</button>
                <button onClick={publish} disabled={!canPublish} className="inline-flex items-center gap-1.5 rounded-lg" style={{ height: 42, padding: '0 18px', background: canPublish ? C.navy : '#C4C7DA', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: canPublish ? 'pointer' : 'not-allowed' }} onMouseEnter={e => { if (canPublish) e.currentTarget.style.background = '#2A2F45' }} onMouseLeave={e => { if (canPublish) e.currentTarget.style.background = C.navy }}>
                  <Send size={15} /> Publish
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
