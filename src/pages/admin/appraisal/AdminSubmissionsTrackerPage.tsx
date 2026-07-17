import { useState } from 'react'
import { Search, ChevronDown, Tag, Briefcase, Calendar, Eye, Target } from 'lucide-react'
import KPIReviewDetailsPage from '../../employee/appraisal/KPIReviewDetailsPage'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC', indigo: '#6366F1' }

const CURRENT_YEAR = 2026
const YEARS = [2026, 2025, 2024]
const DESIGNATIONS = ['All Designations', 'UI/UX Designer', 'Developer', 'QA Tester', 'HR Executive']
const PROJECTS = ['All Projects', 'Pulse HRMS', 'Atlas CRM', 'Nova Commerce', 'Orbit Analytics']

type QueueStatus = 'Pending' | 'Approved'

type Row = {
  id: string
  name: string
  code: string
  role: string
  face: string
  stage: string
  submittedOn: string
  status: QueueStatus
  manager: string
  project: string
}

const ROWS: Row[] = [
  { id: 't1', name: 'Sarah Johnson', code: 'CC002', role: 'UI/UX Designer', face: 'https://i.pravatar.cc/64?img=47', stage: 'Q1', submittedOn: 'Jul 10, 2026', status: 'Approved', manager: 'Priya Sharma', project: 'Pulse HRMS' },
  { id: 't2', name: 'Rajesh Kumar',  code: 'CC003', role: 'Developer',      face: 'https://i.pravatar.cc/64?img=15', stage: 'Q1', submittedOn: 'Jul 09, 2026', status: 'Pending',  manager: 'Rahul Verma',  project: 'Atlas CRM' },
  { id: 't3', name: 'Priya Menon',   code: 'CC004', role: 'QA Tester',      face: 'https://i.pravatar.cc/64?img=31', stage: 'Q1', submittedOn: 'Jul 08, 2026', status: 'Pending',  manager: 'Anita Desai',  project: 'Nova Commerce' },
  { id: 't4', name: 'Arjun Menon',   code: 'CC005', role: 'Developer',      face: 'https://i.pravatar.cc/64?img=12', stage: 'Q1', submittedOn: 'Jul 07, 2026', status: 'Approved', manager: 'Rahul Verma',  project: 'Orbit Analytics' },
  { id: 't5', name: 'Neha Patel',    code: 'CC006', role: 'HR Executive',   face: 'https://i.pravatar.cc/64?img=44', stage: 'Q1', submittedOn: 'Jul 07, 2026', status: 'Approved', manager: 'Karthik Nair', project: 'Pulse HRMS' },
  { id: 't6', name: 'Vikram Singh',  code: 'CC007', role: 'Developer',      face: 'https://i.pravatar.cc/64?img=33', stage: 'Q1', submittedOn: 'Jul 06, 2026', status: 'Pending',  manager: 'Rahul Verma',  project: 'Atlas CRM' },
]

const STATUS_STYLE: Record<QueueStatus, { color: string; bg: string; border: string; dot: string }> = {
  'Pending':  { color: '#B45309', bg: 'rgba(245,158,11,0.13)', border: 'rgba(245,158,11,0.28)', dot: '#F59E0B' },
  'Approved': { color: '#0A7040', bg: 'rgba(14,168,106,0.12)', border: 'rgba(14,168,106,0.28)', dot: '#0EA86A' },
}

const FILTERS: ('All' | QueueStatus)[] = ['All', 'Pending', 'Approved']

export default function AdminSubmissionsTrackerPage() {
  const [search, setSearch]           = useState('')
  const [designation, setDesignation] = useState('All Designations')
  const [project, setProject]         = useState('All Projects')
  const [year, setYear]       = useState(CURRENT_YEAR)
  const [filter, setFilter]   = useState<'All' | QueueStatus>('All')
  const [detail, setDetail]   = useState<Row | null>(null)

  const selectStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box', height: 40, paddingLeft: 34, paddingRight: 32,
    borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13, color: C.navy,
    background: C.surface, fontFamily: 'inherit', cursor: 'pointer',
    appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
    outline: 'none', transition: 'border-color 0.15s, background 0.15s',
  }

  /* ── Admin view-only: open the shared Performance Sheet in reviewed (read-only) mode ── */
  if (detail) {
    return (
      <KPIReviewDetailsPage
        onBack={() => setDetail(null)}
        year={year}
        initialStage={detail.stage}
        mode="reviewed"
        assessorDone={detail.status === 'Approved'}
        assessorName={detail.manager}
        employeeName={detail.name}
        backLabel="Submissions Tracker"
        showRecommendedRating
        onSubmit={() => setDetail(null)}
      />
    )
  }

  const rows = ROWS.filter(r =>
    (filter === 'All' || r.status === filter) &&
    (designation === 'All Designations' || r.role === designation) &&
    (project === 'All Projects' || r.project === project) &&
    (search.trim() === '' || (r.name + ' ' + r.code).toLowerCase().includes(search.toLowerCase()))
  )

  const grid = '2.2fr 1.3fr 0.8fr 1.1fr 1.2fr 0.7fr'
  const headers = ['Employee', 'Role', 'Stage', 'Submitted On', 'Status', 'Action']

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: 18 }}>
        <h1 className="text-2xl font-bold" style={{ color: C.navy }}>Submissions Tracker</h1>
        <p className="text-sm mt-1" style={{ color: '#787878', fontWeight: 500 }}>
          Monitor where every employee and manager stands across the appraisal cycle
        </p>
      </div>

      {/* ── Search + filters card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 16 }}>
        <div className="flex items-center gap-3 flex-wrap" style={{ padding: '16px 22px' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees…"
              style={{ width: '100%', boxSizing: 'border-box', height: 40, paddingLeft: 38, paddingRight: 14, borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13.5, color: C.navy, background: '#fff', fontFamily: 'inherit', outline: 'none', transition: 'border-color 0.15s' }}
              onFocus={e => { e.currentTarget.style.borderColor = C.indigo }} onBlur={e => { e.currentTarget.style.borderColor = C.border }} />
          </div>

          {/* By Designation */}
          <div style={{ position: 'relative', flex: '0 0 auto', minWidth: 190 }}>
            <Tag size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
            <select value={designation} onChange={e => setDesignation(e.target.value)} style={selectStyle}
              onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}>
              {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
          </div>

          {/* By Project */}
          <div style={{ position: 'relative', flex: '0 0 auto', minWidth: 190 }}>
            <Briefcase size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
            <select value={project} onChange={e => setProject(e.target.value)} style={selectStyle}
              onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}>
              {PROJECTS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
          </div>

          {/* Year */}
          <div style={{ position: 'relative', flex: '0 0 auto', minWidth: 150 }}>
            <Calendar size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
            <select value={year} onChange={e => setYear(parseInt(e.target.value, 10))} style={selectStyle}
              onFocus={e => { e.currentTarget.style.borderColor = C.indigo; e.currentTarget.style.background = '#fff' }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface }}>
              {YEARS.map(y => <option key={y} value={y}>{y === CURRENT_YEAR ? `${y} (Current)` : y}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {/* ── Table card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        {/* Card header: title + status chips */}
        <div className="flex items-center justify-between gap-4 flex-wrap" style={{ padding: '14px 22px', borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Submission Status</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTERS.map(f => {
              const active = filter === f
              const count  = f === 'All' ? ROWS.length : ROWS.filter(r => r.status === f).length
              const dot    = f === 'Pending' ? STATUS_STYLE['Pending'].dot : f === 'Approved' ? STATUS_STYLE['Approved'].dot : null
              return (
                <button key={f} onClick={() => setFilter(f)}
                  className="flex items-center gap-1.5 cursor-pointer transition-all duration-150"
                  style={{ height: 26, padding: '0 7px 0 9px', borderRadius: 999, fontSize: 11.5, fontWeight: 600,
                    background: active ? '#EEF0F6' : 'transparent', color: active ? C.navy : '#8B90A7', border: '1px solid transparent' }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.hover }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
                  {dot && <span className="rounded-full" style={{ width: 6, height: 6, background: dot }} />}
                  {f}
                  <span className="flex items-center justify-center" style={{ minWidth: 17, height: 17, padding: '0 5px', borderRadius: 999, fontSize: 10.5, fontWeight: 700, background: active ? '#E2E5EE' : '#EDEFF5', color: active ? '#5A6080' : '#8B90A7' }}>{count}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Column header */}
        <div className="grid items-center" style={{ gridTemplateColumns: grid, padding: '13px 22px', background: 'linear-gradient(90deg, rgba(99,102,241,0.06), rgba(99,102,241,0.015))', borderBottom: `1px solid ${C.border}` }}>
          {headers.map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#9498B0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ padding: '54px 20px', gap: 8 }}>
            <div className="flex items-center justify-center" style={{ width: 46, height: 46, borderRadius: 12, background: C.hover }}>
              <Target size={22} strokeWidth={1.8} style={{ color: C.muted }} />
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>No submissions found</span>
            <span style={{ fontSize: 12.5, color: C.muted }}>Try a different filter or search term.</span>
          </div>
        ) : rows.map((r, idx) => {
          const ss = STATUS_STYLE[r.status]
          return (
            <div key={r.id} className="grid items-center" style={{ gridTemplateColumns: grid, padding: '14px 22px', borderTop: idx === 0 ? 'none' : `1px solid ${C.border}`, transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFE' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
              {/* Employee */}
              <div className="flex items-center gap-3 min-w-0" style={{ paddingRight: 12 }}>
                <img src={r.face} alt={r.name} className="flex-shrink-0" style={{ width: 34, height: 34, borderRadius: 999, objectFit: 'cover', border: `1px solid ${C.border}` }} />
                <div className="min-w-0">
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                  <div style={{ fontSize: 11.5, color: C.muted }}>{r.code}</div>
                </div>
              </div>

              {/* Role */}
              <span style={{ fontSize: 13, color: '#5A6080', fontWeight: 500 }}>{r.role}</span>

              {/* Stage */}
              <div>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: C.indigo, background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.24)', borderRadius: 7, padding: '4px 11px', whiteSpace: 'nowrap' }}>{r.stage}</span>
              </div>

              {/* Submitted On */}
              <span style={{ fontSize: 13, color: '#5A6080', fontWeight: 500 }}>{r.submittedOn}</span>

              {/* Status */}
              <div>
                <span className="inline-flex items-center gap-1.5" style={{ fontSize: 11.5, fontWeight: 700, color: ss.color, background: ss.bg, border: `1px solid ${ss.border}`, borderRadius: 7, padding: '4px 10px', whiteSpace: 'nowrap' }}>
                  <span className="rounded-full" style={{ width: 6, height: 6, background: ss.dot }} />
                  {r.status}
                </span>
              </div>

              {/* Action — view-only */}
              <div>
                <button title="View" onClick={() => setDetail(r)}
                  className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-all duration-150"
                  style={{ width: 34, height: 34, background: 'rgba(99,102,241,0.10)', color: C.indigo }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.10)' }}>
                  <Eye size={16} strokeWidth={2} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
