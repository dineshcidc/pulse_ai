import { useMemo, useState } from 'react'
import {
  ArrowLeft, FolderKanban, Check, CalendarClock, Layers, Send, CheckCircle2, Sparkles, X,
} from 'lucide-react'
import {
  PM_AVATARS,
  type AssignmentProject, type Frequency,
} from './projectAssignmentData'

const C = {
  navy: '#1C2035', ink: '#2A2F45', muted: '#8B90A7', faint: '#AEB2C4',
  border: '#E8EAF2', line: '#EEF0F6', panel: '#FFFFFF', wash: '#F6F7FB',
  indigo: '#6366F1', green: '#16A34A', amber: '#D97706', red: '#E11D48', blue: '#2563EB',
}

const FREQ_ORDER: Frequency[] = ['Weekly', 'Biweekly', 'Monthly']
const freqLabel = (f: Frequency) => (f === 'Biweekly' ? 'Bi-weekly' : f)
const FREQ_ACCENT: Record<Frequency, string> = { Weekly: C.indigo, Biweekly: C.blue, Monthly: C.green }
const cadenceText = (f: Frequency) => f === 'Weekly' ? 'Due every Friday' : f === 'Biweekly' ? 'Due every other Friday' : 'Due 2 days before month-end'

function initials(n: string) { return n.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() }
function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const img = PM_AVATARS[name]
  if (img) return <img src={`https://i.pravatar.cc/150?img=${img}`} alt={name} className="rounded-full flex-shrink-0 object-cover" style={{ width: size, height: size, border: `1px solid ${C.border}` }} />
  return <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, background: 'rgba(99,102,241,0.10)', color: C.indigo, fontSize: size * 0.36, fontWeight: 700 }}>{initials(name)}</div>
}

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span
      className="inline-flex items-center justify-center flex-shrink-0 rounded-md"
      style={{
        width: 20, height: 20,
        background: checked ? C.indigo : '#fff',
        border: `1.5px solid ${checked ? C.indigo : '#CBD0E0'}`,
        transition: 'all 0.12s',
      }}
    >
      {checked && <Check size={13} strokeWidth={3} style={{ color: '#fff' }} />}
    </span>
  )
}

export default function BulkAssignmentPage({
  projects, onBack,
}: { projects: AssignmentProject[]; onBack: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [freqs, setFreqs] = useState<Set<Frequency>>(new Set())
  const [startDate, setStartDate] = useState('2026-07-27')
  const [done, setDone] = useState(false)

  const allSelected = selected.size === projects.length && projects.length > 0
  const canSubmit = selected.size > 0 && freqs.size > 0

  function toggleProject(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }
  function toggleAll() {
    setSelected(prev => (prev.size === projects.length ? new Set() : new Set(projects.map(p => p.id))))
  }
  function toggleFreq(f: Frequency) {
    setFreqs(prev => {
      const next = new Set(prev)
      next.has(f) ? next.delete(f) : next.add(f)
      return next
    })
  }

  const totalAssignments = selected.size * freqs.size
  const chosenFreqLabels = useMemo(() => FREQ_ORDER.filter(f => freqs.has(f)).map(freqLabel), [freqs])

  const lbl: React.CSSProperties = { fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 10, display: 'block' }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", paddingBottom: 20 }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2" style={{ marginBottom: 18 }}>
        <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s' }} onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }} onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}>
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <button onClick={onBack} style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }} onMouseEnter={e => { e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>Project Assignment</button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Bulk Assignment</span>
      </div>

      {/* Intro banner */}
      <div className="rounded-2xl flex items-start gap-3" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.10), rgba(99,102,241,0.02))', border: '1px solid rgba(99,102,241,0.20)', padding: '16px 18px', marginBottom: 18 }}>
        <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 40, height: 40, background: '#fff', border: `1px solid ${C.border}` }}>
          <Sparkles size={19} style={{ color: C.indigo }} />
        </div>
        <div className="min-w-0">
          <h1 style={{ fontSize: 17, fontWeight: 800, color: C.navy }}>Bulk Assignment</h1>
          <p style={{ fontSize: 13, color: C.muted, marginTop: 3, lineHeight: 1.55 }}>
            Get reporting live across the organization in one step — pick the projects, choose the reporting frequencies, and assign them all at once.
          </p>
        </div>
      </div>

      {/* 5 / 7 split */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 18, alignItems: 'start' }}>

        {/* ── LEFT: select projects ── */}
        <div className="rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          {/* header + select all */}
          <div className="flex items-center justify-between gap-3" style={{ padding: '14px 18px', borderBottom: `1px solid ${C.line}` }}>
            <div className="flex items-center gap-2">
              <FolderKanban size={17} style={{ color: C.indigo }} />
              <span style={{ fontSize: 14.5, fontWeight: 700, color: C.navy }}>Select Projects</span>
              <span className="rounded-full" style={{ background: C.wash, color: C.muted, fontSize: 12, fontWeight: 700, padding: '2px 9px', border: `1px solid ${C.border}` }}>{selected.size}/{projects.length}</span>
            </div>
            <button onClick={toggleAll} className="inline-flex items-center gap-2 cursor-pointer" style={{ background: 'transparent', border: 'none', fontSize: 12.5, fontWeight: 700, color: C.indigo, fontFamily: 'inherit' }}>
              <CheckBox checked={allSelected} /> Select all
            </button>
          </div>

          {/* list */}
          <div style={{ maxHeight: 520, overflowY: 'auto' }}>
            {projects.map((p, i) => {
              const on = selected.has(p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => toggleProject(p.id)}
                  className="w-full flex items-center gap-3 cursor-pointer text-left"
                  style={{
                    padding: '13px 18px', border: 'none',
                    borderBottom: i < projects.length - 1 ? `1px solid ${C.line}` : 'none',
                    background: on ? 'rgba(99,102,241,0.05)' : 'transparent',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => { if (!on) e.currentTarget.style.background = C.wash }}
                  onMouseLeave={e => { e.currentTarget.style.background = on ? 'rgba(99,102,241,0.05)' : 'transparent' }}
                >
                  <CheckBox checked={on} />
                  <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, background: C.wash }}>
                    <FolderKanban size={16} style={{ color: C.muted }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate" style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{p.name}</div>
                    <div className="truncate" style={{ fontSize: 11.5, color: C.faint }}>{p.client}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Avatar name={p.pm} size={26} />
                    <span className="truncate" style={{ fontSize: 12, color: C.ink, fontWeight: 600, maxWidth: 120 }}>{p.pm}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── RIGHT: configure & submit (sticky) ── */}
        <div className="rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}`, position: 'sticky', top: 0, alignSelf: 'start', overflow: 'hidden' }}>
          <div className="flex items-center gap-2" style={{ padding: '14px 18px', borderBottom: `1px solid ${C.line}` }}>
            <Layers size={17} style={{ color: C.indigo }} />
            <span style={{ fontSize: 14.5, fontWeight: 700, color: C.navy }}>Reporting Frequencies</span>
          </div>

          <div style={{ padding: 18 }}>
            {/* frequency cards */}
            <div className="flex flex-col gap-2.5">
              {FREQ_ORDER.map(f => {
                const on = freqs.has(f)
                const accent = FREQ_ACCENT[f]
                return (
                  <button
                    key={f}
                    onClick={() => toggleFreq(f)}
                    className="w-full flex items-center gap-3 rounded-xl cursor-pointer text-left"
                    style={{
                      padding: '12px 14px',
                      border: `1px solid ${on ? accent : C.border}`,
                      background: on ? `${accent}0F` : '#fff',
                      transition: 'all 0.14s',
                    }}
                  >
                    <CheckBox checked={on} />
                    <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, background: `${accent}14` }}>
                      <CalendarClock size={17} style={{ color: accent }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{freqLabel(f)}</div>
                      <div style={{ fontSize: 11.5, color: C.faint }}>{cadenceText(f)}</div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* start date */}
            <div style={{ marginTop: 18 }}>
              <label style={lbl}>Reporting Starts On</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                style={{ width: '100%', height: 42, background: C.wash, border: `1px solid ${C.border}`, borderRadius: 10, padding: '0 12px', fontSize: 13.5, color: C.ink, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}
              />
            </div>

            {/* summary */}
            <div className="rounded-xl" style={{ background: C.wash, border: `1px solid ${C.border}`, padding: '12px 14px', marginTop: 16 }}>
              <div className="flex items-center justify-between" style={{ fontSize: 12.5 }}>
                <span style={{ color: C.muted, fontWeight: 600 }}>Projects selected</span>
                <span style={{ color: C.navy, fontWeight: 800 }}>{selected.size}</span>
              </div>
              <div className="flex items-center justify-between" style={{ fontSize: 12.5, marginTop: 7 }}>
                <span style={{ color: C.muted, fontWeight: 600 }}>Cadences</span>
                <span style={{ color: C.navy, fontWeight: 800 }}>{freqs.size}</span>
              </div>
              <div style={{ height: 1, background: C.border, margin: '10px 0' }} />
              <div className="flex items-center justify-between" style={{ fontSize: 12.5 }}>
                <span style={{ color: C.muted, fontWeight: 600 }}>Total assignments</span>
                <span style={{ color: C.indigo, fontWeight: 800 }}>{totalAssignments}</span>
              </div>
            </div>

            {/* actions */}
            <button
              onClick={() => canSubmit && setDone(true)}
              disabled={!canSubmit}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl"
              style={{ height: 46, marginTop: 14, background: canSubmit ? C.navy : '#C4C7DA', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: canSubmit ? 'pointer' : 'not-allowed', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = '#2A2F45' }}
              onMouseLeave={e => { if (canSubmit) e.currentTarget.style.background = C.navy }}
            >
              <Send size={16} /> Assign Reporting
            </button>
            <button onClick={onBack} className="w-full rounded-xl cursor-pointer" style={{ height: 42, marginTop: 10, background: C.panel, border: `1px solid ${C.border}`, color: C.ink, fontSize: 13, fontWeight: 600 }} onMouseEnter={e => { e.currentTarget.style.background = C.wash }} onMouseLeave={e => { e.currentTarget.style.background = C.panel }}>
              Cancel
            </button>
            {!canSubmit && (
              <p style={{ fontSize: 11.5, color: C.faint, textAlign: 'center', marginTop: 10 }}>
                Select at least one project and one frequency.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* success confirmation */}
      {done && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 22, padding: '32px 30px 26px', width: 430, textAlign: 'center', boxShadow: '0 24px 64px rgba(10,12,28,0.22)', position: 'relative' }}>
            <button onClick={() => setDone(false)} style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted }}>
              <X size={15} />
            </button>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(22,163,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} style={{ color: C.green }} />
            </div>
            <div style={{ fontSize: 19, fontWeight: 800, color: C.navy }}>Bulk Assignment Complete</div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.55, marginTop: 8 }}>
              <b style={{ color: C.ink }}>{selected.size}</b> project{selected.size > 1 ? 's' : ''} assigned to <b style={{ color: C.ink }}>{chosenFreqLabels.join(', ')}</b> reporting, starting {startDate}.
            </p>
            <button onClick={onBack} className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl cursor-pointer" style={{ marginTop: 20, height: 44, background: C.indigo, color: '#fff', border: 'none', fontSize: 13.5, fontWeight: 700 }}>
              Back to Project Assignment
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
