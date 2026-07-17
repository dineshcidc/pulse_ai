import { useMemo, useState } from 'react'
import {
  ArrowLeft, ChevronDown, Search, Check, Users, Briefcase, UserCog, User,
  FileText, Send, Loader2, AlertCircle,
} from 'lucide-react'
import type { AppraisalCycle, Period } from './AdminAppraisalCyclesPage'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC', indigo: '#6366F1' }

const PERIOD_META: Record<Period, { color: string; bg: string; border: string }> = {
  Q1:     { color: '#2563EB', bg: 'rgba(37,99,235,0.10)',  border: 'rgba(37,99,235,0.24)' },
  Q2:     { color: '#6366F1', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.24)' },
  Q3:     { color: '#F59E0B', bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.30)' },
  Annual: { color: '#0EA86A', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.26)' },
}

const PERIODS: Period[] = ['Q1', 'Q2', 'Q3', 'Annual']
const YEARS = [2026, 2027]

type AudienceMode = 'designation' | 'project' | 'manager' | 'individual'
const MODES: { key: AudienceMode; label: string; Icon: typeof Users }[] = [
  { key: 'designation', label: 'By Designation', Icon: Users },
  { key: 'project',     label: 'By Project',     Icon: Briefcase },
  { key: 'manager',     label: 'By Manager',     Icon: UserCog },
  { key: 'individual',  label: 'Individual',     Icon: User },
]

interface Opt { id: string; primary: string; secondary: string; count: number; face?: string }

const DESIGNATIONS: Opt[] = [
  { id: 'd1', primary: 'UI/UX Designer',   secondary: 'Design',           count: 6 },
  { id: 'd2', primary: 'Developer',        secondary: 'Engineering',      count: 18 },
  { id: 'd3', primary: 'Senior Developer', secondary: 'Engineering',      count: 7 },
  { id: 'd4', primary: 'QA Tester',        secondary: 'Quality',          count: 5 },
  { id: 'd5', primary: 'Project Manager',  secondary: 'Delivery',         count: 4 },
  { id: 'd6', primary: 'Business Analyst', secondary: 'Delivery',         count: 5 },
  { id: 'd7', primary: 'DevOps Engineer',  secondary: 'Engineering',      count: 3 },
]
const PROJECTS: Opt[] = [
  { id: 'p1', primary: 'Pulse HRMS',      secondary: 'Active project', count: 14 },
  { id: 'p2', primary: 'Atlas CRM',       secondary: 'Active project', count: 9 },
  { id: 'p3', primary: 'Nova Commerce',   secondary: 'Active project', count: 11 },
  { id: 'p4', primary: 'Orbit Analytics', secondary: 'Active project', count: 7 },
]
const MANAGERS: Opt[] = [
  { id: 'm1', primary: 'Priya Sharma',  secondary: 'Design team',      count: 6,  face: 'https://i.pravatar.cc/64?img=31' },
  { id: 'm2', primary: 'Rahul Verma',   secondary: 'Engineering team', count: 12, face: 'https://i.pravatar.cc/64?img=15' },
  { id: 'm3', primary: 'Anita Desai',   secondary: 'Quality team',     count: 5,  face: 'https://i.pravatar.cc/64?img=45' },
  { id: 'm4', primary: 'Karthik Nair',  secondary: 'Delivery team',    count: 8,  face: 'https://i.pravatar.cc/64?img=13' },
]
const EMPLOYEES: Opt[] = [
  { id: 'e1',  primary: 'Arjun Menon',    secondary: 'EMP-1042 · UI/UX Designer',  count: 1, face: 'https://i.pravatar.cc/64?img=12' },
  { id: 'e2',  primary: 'Sneha Iyer',     secondary: 'EMP-1088 · Developer',       count: 1, face: 'https://i.pravatar.cc/64?img=47' },
  { id: 'e3',  primary: 'Rajesh Kumar',   secondary: 'EMP-1015 · Senior Developer',count: 1, face: 'https://i.pravatar.cc/64?img=8'  },
  { id: 'e4',  primary: 'Meera Nair',     secondary: 'EMP-1103 · QA Tester',       count: 1, face: 'https://i.pravatar.cc/64?img=5'  },
  { id: 'e5',  primary: 'Vikram Singh',   secondary: 'EMP-1050 · Developer',       count: 1, face: 'https://i.pravatar.cc/64?img=33' },
  { id: 'e6',  primary: 'Divya Rao',      secondary: 'EMP-1121 · Business Analyst',count: 1, face: 'https://i.pravatar.cc/64?img=20' },
  { id: 'e7',  primary: 'Aditya Sharma',  secondary: 'EMP-1077 · DevOps Engineer', count: 1, face: 'https://i.pravatar.cc/64?img=52' },
  { id: 'e8',  primary: 'Kavya Reddy',    secondary: 'EMP-1094 · UI/UX Designer',  count: 1, face: 'https://i.pravatar.cc/64?img=36' },
  { id: 'e9',  primary: 'Rohan Gupta',    secondary: 'EMP-1033 · Developer',       count: 1, face: 'https://i.pravatar.cc/64?img=60' },
  { id: 'e10', primary: 'Ananya Das',     secondary: 'EMP-1109 · Project Manager', count: 1, face: 'https://i.pravatar.cc/64?img=25' },
]

const OPTIONS: Record<AudienceMode, Opt[]> = {
  designation: DESIGNATIONS, project: PROJECTS, manager: MANAGERS, individual: EMPLOYEES,
}

interface Props {
  onBack: () => void
  onPublished: (cycle: AppraisalCycle, asDraft: boolean) => void
}

export default function AdminPublishAppraisalPage({ onBack, onPublished }: Props) {
  const [title, setTitle]         = useState('')
  const [description, setDesc]    = useState('')
  const [period, setPeriod]       = useState<Period>('Q1')
  const [year, setYear]           = useState(2026)
  const [dueDate, setDueDate]     = useState('')
  const [mode, setMode]           = useState<AudienceMode>('designation')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState<Record<AudienceMode, Set<string>>>({
    designation: new Set(), project: new Set(), manager: new Set(), individual: new Set(),
  })
  const [confirm, setConfirm]     = useState(false)
  const [publishing, setPublishing] = useState(false)

  const sel = selected[mode]
  const opts = OPTIONS[mode]
  const filtered = useMemo(
    () => opts.filter(o => (o.primary + ' ' + o.secondary).toLowerCase().includes(search.toLowerCase())),
    [opts, search],
  )

  const people = opts.filter(o => sel.has(o.id)).reduce((a, o) => a + o.count, 0)
  const allFilteredSelected = filtered.length > 0 && filtered.every(o => sel.has(o.id))

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev[mode])
      next.has(id) ? next.delete(id) : next.add(id)
      return { ...prev, [mode]: next }
    })
  }
  function toggleAll() {
    setSelected(prev => {
      const next = new Set(prev[mode])
      if (allFilteredSelected) filtered.forEach(o => next.delete(o.id))
      else filtered.forEach(o => next.add(o.id))
      return { ...prev, [mode]: next }
    })
  }

  function audienceLabel(): string {
    const n = sel.size
    if (n === 0) return 'No audience selected'
    const modeWord = mode === 'designation' ? 'designation' : mode === 'project' ? 'project' : mode === 'manager' ? 'manager' : 'employee'
    if (mode === 'designation' && n === DESIGNATIONS.length) return 'All Designations'
    return `${n} ${modeWord}${n > 1 ? 's' : ''}`
  }

  const valid = title.trim() !== '' && dueDate !== '' && sel.size > 0

  function doPublish(asDraft: boolean) {
    setConfirm(false)
    setPublishing(true)
    setTimeout(() => {
      const cycle: AppraisalCycle = {
        id: `c${Date.now()}`,
        title: title.trim(),
        description: description.trim() || undefined,
        period, year,
        audienceMode: mode,
        audienceLabel: audienceLabel(),
        people,
        dueDate: dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—',
        publishedOn: asDraft ? '—' : new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        status: asDraft ? 'Draft' : 'Published',
      }
      setPublishing(false)
      onPublished(cycle, asDraft)
    }, 1300)
  }

  const LABEL: React.CSSProperties = { display: 'block', fontSize: 11.5, color: C.muted, fontWeight: 600, marginBottom: 7 }
  const INPUT: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', height: 42, padding: '0 13px',
    border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 13.5, color: C.navy,
    background: '#fff', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s',
  }
  const pm = PERIOD_META[period]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes apSpin { to { transform: rotate(360deg) } }
        @keyframes apFade { from { opacity:0 } to { opacity:1 } }
        @keyframes apModal { from { opacity:0; transform:translateY(10px) scale(0.98) } to { opacity:1; transform:translateY(0) scale(1) } }
        @media (max-width: 1000px){ .ap-grid{ grid-template-columns: 1fr !important } }
      `}</style>

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
        <button
          onClick={onBack} title="Back"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s' }}
          onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = '#C8CCE0' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
        >
          <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <button onClick={onBack} style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
          onMouseEnter={e => { e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
          Appraisal Cycles
        </button>
        <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Publish Appraisal</span>
      </div>

      {/* ── Title ── */}
      <div style={{ marginBottom: 18 }}>
        <h1 className="text-2xl font-bold" style={{ color: C.navy }}>Publish Appraisal</h1>
        <p className="text-sm mt-1" style={{ color: '#787878', fontWeight: 500 }}>
          Open a new performance review and send it to the right people
        </p>
      </div>

      {/* ── 8 : 4 layout ── */}
      <div className="ap-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: 20, alignItems: 'start' }}>
        {/* ============ LEFT — form ============ */}
        <div className="flex flex-col" style={{ gap: 20 }}>
          {/* Section 1 — Appraisal Details */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div className="flex items-center gap-2" style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
              <FileText size={16} strokeWidth={2.2} style={{ color: C.indigo }} />
              <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Appraisal Details</span>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ marginBottom: 18 }}>
                <label style={LABEL}>Appraisal Title <span style={{ color: '#E84855' }}>*</span></label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Q1 2026 Performance Appraisal" style={INPUT}
                  onFocus={e => { e.currentTarget.style.borderColor = C.indigo }} onBlur={e => { e.currentTarget.style.borderColor = C.border }} />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={LABEL}>Description</label>
                <textarea value={description} onChange={e => setDesc(e.target.value)} placeholder="Add a short note about the goal of this appraisal cycle…"
                  style={{ ...INPUT, height: 'auto', minHeight: 78, padding: '11px 13px', lineHeight: 1.55, resize: 'vertical' }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.indigo }} onBlur={e => { e.currentTarget.style.borderColor = C.border }} />
              </div>

              {/* Period segmented */}
              <div style={{ marginBottom: 18 }}>
                <label style={LABEL}>Stage <span style={{ color: '#E84855' }}>*</span></label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PERIODS.map(p => {
                    const active = period === p
                    const meta = PERIOD_META[p]
                    return (
                      <button key={p} onClick={() => setPeriod(p)}
                        className="cursor-pointer transition-all duration-150"
                        style={{
                          height: 38, padding: '0 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
                          background: active ? meta.bg : '#fff',
                          color: active ? meta.color : C.muted,
                          border: `1.5px solid ${active ? meta.border : C.border}`,
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.borderColor = '#C8CCE0' }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.borderColor = C.border }}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Year + Due date */}
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={LABEL}>Year <span style={{ color: '#E84855' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <select value={year} onChange={e => setYear(parseInt(e.target.value, 10))}
                      style={{ ...INPUT, paddingRight: 34, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none' }}
                      onFocus={e => { e.currentTarget.style.borderColor = C.indigo }} onBlur={e => { e.currentTarget.style.borderColor = C.border }}>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={LABEL}>Due Date <span style={{ color: '#E84855' }}>*</span></label>
                  <div style={{ position: 'relative' }}>
                    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                      style={{ ...INPUT, paddingRight: 12, colorScheme: 'light' }}
                      onFocus={e => { e.currentTarget.style.borderColor = C.indigo }} onBlur={e => { e.currentTarget.style.borderColor = C.border }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 — Select Audience */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div className="flex items-center justify-between gap-3 flex-wrap" style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2">
                <Users size={16} strokeWidth={2.2} style={{ color: C.indigo }} />
                <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Select Audience</span>
              </div>
              {sel.size > 0 && (
                <span style={{ fontSize: 12, fontWeight: 700, color: C.indigo, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.22)', borderRadius: 999, padding: '3px 11px' }}>
                  {people} {people === 1 ? 'person' : 'people'} selected
                </span>
              )}
            </div>

            <div style={{ padding: 20 }}>
              {/* Mode tabs */}
              <div className="flex items-center gap-1 flex-wrap" style={{ background: C.hover, borderRadius: 11, padding: 4, marginBottom: 16, width: 'fit-content' }}>
                {MODES.map(m => {
                  const active = mode === m.key
                  return (
                    <button key={m.key} onClick={() => { setMode(m.key); setSearch('') }}
                      className="inline-flex items-center gap-2 rounded-lg border-none cursor-pointer font-semibold transition-all duration-150"
                      style={{ height: 34, padding: '0 14px', fontSize: 12.5, background: active ? '#fff' : 'transparent', color: active ? C.indigo : C.muted, boxShadow: active ? '0 1px 3px rgba(10,12,28,0.08)' : 'none' }}
                    >
                      <m.Icon size={14} strokeWidth={2.2} /> {m.label}
                    </button>
                  )
                })}
              </div>

              {/* Search */}
              <div style={{ position: 'relative', marginBottom: 12 }}>
                <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${mode === 'individual' ? 'employees' : mode + 's'}…`}
                  style={{ ...INPUT, paddingLeft: 38 }}
                  onFocus={e => { e.currentTarget.style.borderColor = C.indigo }} onBlur={e => { e.currentTarget.style.borderColor = C.border }} />
              </div>

              {/* Select all */}
              <button onClick={toggleAll}
                className="flex items-center gap-2.5 w-full cursor-pointer transition-colors duration-150"
                style={{ padding: '10px 12px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, marginBottom: 8, fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.hover }} onMouseLeave={e => { e.currentTarget.style.background = C.surface }}>
                <Box checked={allFilteredSelected} />
                <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>Select all</span>
                <span style={{ fontSize: 11.5, color: C.muted, marginLeft: 'auto' }}>{filtered.length} {mode === 'individual' ? 'employees' : 'groups'}</span>
              </button>

              {/* List */}
              <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center" style={{ padding: '36px 20px', gap: 6 }}>
                    <Search size={20} strokeWidth={1.6} style={{ color: C.muted }} />
                    <span style={{ fontSize: 12.5, color: C.muted }}>No matches found</span>
                  </div>
                ) : filtered.map(o => {
                  const on = sel.has(o.id)
                  return (
                    <button key={o.id} onClick={() => toggle(o.id)}
                      className="flex items-center gap-3 w-full cursor-pointer transition-all duration-150"
                      style={{ padding: '9px 12px', borderRadius: 10, border: `1px solid ${on ? 'rgba(99,102,241,0.35)' : C.border}`, background: on ? 'rgba(99,102,241,0.05)' : '#fff', fontFamily: 'inherit', textAlign: 'left' }}
                      onMouseEnter={e => { if (!on) e.currentTarget.style.background = C.surface }}
                      onMouseLeave={e => { if (!on) e.currentTarget.style.background = '#fff' }}>
                      <Box checked={on} />
                      {o.face && (
                        <img src={o.face} alt={o.primary} className="flex-shrink-0"
                          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: `1px solid ${C.border}` }} />
                      )}
                      <span className="min-w-0" style={{ flex: 1 }}>
                        <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.primary}</span>
                        <span style={{ display: 'block', fontSize: 11.5, color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.secondary}</span>
                      </span>
                      {mode !== 'individual' && (
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: '#5A6080', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 999, padding: '3px 10px', whiteSpace: 'nowrap' }}>
                          {o.count} people
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ============ RIGHT — sticky summary ============ */}
        <div style={{ position: 'sticky', top: 0 }}>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Summary</span>
            </div>
            <div style={{ padding: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: title ? C.navy : '#C0C4D6', lineHeight: 1.4, marginBottom: 14 }}>
                {title || 'Untitled appraisal'}
              </div>

              <Row label="Stage">
                <span style={{ fontSize: 12, fontWeight: 700, color: pm.color, background: pm.bg, border: `1px solid ${pm.border}`, borderRadius: 999, padding: '2px 10px' }}>{period}</span>
              </Row>
              <Row label="Year"><Val>{year}</Val></Row>
              <Row label="Due Date">
                <Val>{dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}</Val>
              </Row>
              <Row label="Audience"><Val>{audienceLabel()}</Val></Row>

              <div style={{ borderTop: `1px dashed ${C.border}`, margin: '14px 0', paddingTop: 14 }}>
                <div className="flex items-center gap-2.5" style={{ background: C.surface, borderRadius: 12, padding: '12px 14px' }}>
                  <div className="flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(99,102,241,0.12)' }}>
                    <Users size={17} strokeWidth={2.2} style={{ color: C.indigo }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{people}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{people === 1 ? 'person' : 'people'} will be notified</div>
                  </div>
                </div>
              </div>

              <button onClick={() => setConfirm(true)} disabled={!valid}
                className="inline-flex items-center justify-center gap-2 w-full border-none transition-all duration-150"
                style={{ height: 44, borderRadius: 12, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', marginBottom: 10,
                  background: valid ? C.indigo : '#E4E6EF', color: valid ? '#fff' : '#B0B4C8', cursor: valid ? 'pointer' : 'not-allowed' }}
                onMouseEnter={e => { if (valid) e.currentTarget.style.background = '#4F46E5' }}
                onMouseLeave={e => { if (valid) e.currentTarget.style.background = C.indigo }}>
                <Send size={16} strokeWidth={2.2} /> Publish Appraisal
              </button>
              <button onClick={() => doPublish(true)} disabled={title.trim() === ''}
                className="inline-flex items-center justify-center gap-2 w-full cursor-pointer transition-all duration-150"
                style={{ height: 42, borderRadius: 12, fontSize: 13.5, fontWeight: 600, fontFamily: 'inherit',
                  border: `1px solid ${C.border}`, background: '#fff', color: title.trim() === '' ? '#C0C4D6' : C.muted, cursor: title.trim() === '' ? 'not-allowed' : 'pointer' }}
                onMouseEnter={e => { if (title.trim() !== '') { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = title.trim() === '' ? '#C0C4D6' : C.muted }}>
                Save as Draft
              </button>

              {!valid && (
                <div className="flex items-start gap-2" style={{ marginTop: 12 }}>
                  <AlertCircle size={13} strokeWidth={2} style={{ color: '#B0B4C8', flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 11, color: C.muted, lineHeight: 1.5 }}>Add a title, due date, and at least one audience to publish.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirmation modal ── */}
      {confirm && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'rgba(10,12,28,0.50)', backdropFilter: 'blur(4px)', zIndex: 9999, padding: 20, animation: 'apFade 0.16s ease' }}
          onClick={e => { if (e.target === e.currentTarget) setConfirm(false) }}>
          <div style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 440, boxShadow: '0 24px 64px rgba(10,12,28,0.22)', animation: 'apModal 0.2s cubic-bezier(0.4,0,0.2,1)', overflow: 'hidden' }}>
            <div style={{ padding: '26px 24px 0', textAlign: 'center' }}>
              <div className="flex items-center justify-center" style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99,102,241,0.10)', margin: '0 auto 16px' }}>
                <Send size={24} strokeWidth={2} style={{ color: C.indigo }} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 8 }}>Publish this appraisal?</div>
              <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 18 }}>
                <strong style={{ color: C.navy }}>{people} {people === 1 ? 'person' : 'people'}</strong> and their managers will be notified and will see this appraisal in their portal.
              </p>
            </div>
            <div style={{ padding: '0 24px 8px' }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 16px' }}>
                <CRow label="Title">{title}</CRow>
                <CRow label="Stage"><span style={{ color: pm.color, fontWeight: 700 }}>{period} · {year}</span></CRow>
                <CRow label="Due Date">{dueDate ? new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : '—'}</CRow>
                <CRow label="Audience" last>{audienceLabel()}</CRow>
              </div>
            </div>
            <div className="flex gap-3" style={{ padding: '18px 24px 22px' }}>
              <button onClick={() => setConfirm(false)} className="cursor-pointer"
                style={{ flex: 1, height: 44, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}>
                Cancel
              </button>
              <button onClick={() => doPublish(false)}
                className="inline-flex items-center justify-center gap-2 cursor-pointer"
                style={{ flex: 1.4, height: 44, borderRadius: 12, border: 'none', background: C.indigo, color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#4F46E5' }} onMouseLeave={e => { e.currentTarget.style.background = C.indigo }}>
                <Check size={16} strokeWidth={2.4} /> Confirm & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Publishing overlay ── */}
      {publishing && (
        <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(10,12,28,0.55)', backdropFilter: 'blur(4px)', zIndex: 10000, animation: 'apFade 0.16s ease' }}>
          <div className="flex flex-col items-center" style={{ background: '#fff', borderRadius: 20, padding: '34px 40px', boxShadow: '0 24px 64px rgba(10,12,28,0.24)' }}>
            <Loader2 size={34} strokeWidth={2.2} style={{ color: C.indigo, animation: 'apSpin 0.8s linear infinite' }} />
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginTop: 16 }}>Publishing appraisal…</div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>Notifying employees & managers</div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── small helpers ── */
function Box({ checked }: { checked: boolean }) {
  return (
    <span className="flex items-center justify-center flex-shrink-0" style={{
      width: 19, height: 19, borderRadius: 6,
      border: `1.5px solid ${checked ? '#6366F1' : '#C8CCE0'}`,
      background: checked ? '#6366F1' : '#fff', transition: 'all 0.14s',
    }}>
      {checked && <Check size={12} strokeWidth={3} style={{ color: '#fff' }} />}
    </span>
  )
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '7px 0' }}>
      <span style={{ fontSize: 12, color: '#8B90A7', fontWeight: 500 }}>{label}</span>
      {children}
    </div>
  )
}
function Val({ children }: { children: React.ReactNode }) {
  return <span style={{ fontSize: 12.5, fontWeight: 700, color: '#1C2035' }}>{children}</span>
}
function CRow({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3" style={{ padding: '6px 0', borderBottom: last ? 'none' : '1px solid #EEF0F6' }}>
      <span style={{ fontSize: 12, color: '#8B90A7', fontWeight: 500, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12.5, fontWeight: 600, color: '#1C2035', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{children}</span>
    </div>
  )
}
