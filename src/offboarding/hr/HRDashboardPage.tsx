import { useMemo, useState } from 'react'
import {
  LayoutDashboard, Search, ChevronDown, ChevronRight,
  CheckCircle2, Inbox,
} from 'lucide-react'
import {
  HR_CASES, overallStage, clearedCount, STAGE_META, fmtDate, daysUntil,
  type OverallStage, type DeptKey, type DeptStatus,
} from './hrData'

/*
 * HR › Offboarding Dashboard — Screen H1.
 *
 * The command center: KPI cards across the pipeline + a list of every case with a
 * compact 4-department clearance indicator (CTO · Manager · IT · Finance). A row
 * opens the Case Cockpit (H2) via onOpen.
 */

const C = {
  navy:   '#1C2035',
  border: '#E8EAF2',
  muted:  '#8B90A7',
  hover:  '#F0F2F8',
  indigo: '#6366F1',
  indigoDeep: '#5B5FDE',
  green:  '#0EA86A',
  amber:  '#D97706',
  red:    '#E84855',
  slate:  '#5A5F82',
}

const DEPTS: { key: DeptKey; short: string; label: string }[] = [
  { key: 'cto',     short: 'C', label: 'CTO' },
  { key: 'manager', short: 'M', label: 'Manager' },
  { key: 'it',      short: 'I', label: 'System Admin' },
  { key: 'finance', short: 'F', label: 'Finance' },
]

const DOT: Record<DeptStatus, { color: string; bg: string }> = {
  approved: { color: C.green, bg: 'rgba(14,168,106,0.14)' },
  cleared:  { color: C.green, bg: 'rgba(14,168,106,0.14)' },
  pending:  { color: C.amber, bg: 'rgba(217,119,6,0.14)' },
  'on-hold':{ color: C.red,   bg: 'rgba(232,72,85,0.14)' },
  rejected: { color: C.red,   bg: 'rgba(232,72,85,0.14)' },
  awaiting: { color: C.slate, bg: 'rgba(91,95,130,0.12)' },
}

const GRID = '1.8fr 1.3fr 1.7fr 1.4fr 1.2fr 0.9fr'
const TABLE_MIN = 1120

type Filter = 'all' | OverallStage

export default function HRDashboardPage({ onOpen }: { onOpen?: (id: string) => void }) {
  const [query, setQuery]   = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const stageOf = useMemo(() => new Map(HR_CASES.map(c => [c.id, overallStage(c)])), [])

  const counts = useMemo(() => {
    const s = { active: 0, 'pending-cto': 0, 'in-progress': 0, 'pending-closure': 0, completed: 0 }
    HR_CASES.forEach(c => {
      const st = stageOf.get(c.id)!
      if (st !== 'completed') s.active++
      s[st]++
    })
    return s
  }, [stageOf])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return HR_CASES
      .filter(c => filter === 'all' ? true : stageOf.get(c.id) === filter)
      .filter(c => !q || c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.department.toLowerCase().includes(q))
      .slice()
      .sort((a, b) => new Date(a.lwd ?? a.intendedLwd).getTime() - new Date(b.lwd ?? b.intendedLwd).getTime())
  }, [query, filter, stageOf])

  const FILTERS: { id: Filter; label: string; n: number }[] = [
    { id: 'all',             label: 'All Cases',          n: HR_CASES.length },
    { id: 'pending-cto',     label: 'Pending CTO',        n: counts['pending-cto'] },
    { id: 'in-progress',     label: 'In Progress',        n: counts['in-progress'] },
    { id: 'pending-closure', label: 'Pending HR Closure', n: counts['pending-closure'] },
    { id: 'completed',       label: 'Completed',          n: counts.completed },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes obFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}`}</style>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>Offboarding Cases</h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>Monitor every offboarding across the organisation and close completed cases</p>
        </div>
        <div className="flex items-center justify-center rounded-2xl flex-shrink-0" style={{ width: 60, height: 60, backgroundColor: 'rgba(99,102,241,0.07)', backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.22) 1px, transparent 1px)', backgroundSize: '8px 8px', border: '1px solid rgba(99,102,241,0.14)' }}>
          <div style={{ animation: 'obFloat 4s ease-in-out infinite' }}>
            <LayoutDashboard size={26} strokeWidth={1.5} style={{ color: C.indigoDeep }} />
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 flex-wrap mb-4" style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 10 }}>
        <div className="relative" style={{ flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, code or department…"
            style={{ width: '100%', height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: '#FAFBFE', padding: '0 14px 0 36px', fontSize: 13, color: C.navy, outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }} />
        </div>
        <div className="relative" style={{ minWidth: 210 }}>
          <select value={filter} onChange={e => setFilter(e.target.value as Filter)}
            style={{ width: '100%', height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: '#FAFBFE', padding: '0 36px 0 14px', fontSize: 13, fontWeight: 600, color: C.navy, outline: 'none', appearance: 'none', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            {FILTERS.map(f => <option key={f.id} value={f.id}>{f.label} ({f.n})</option>)}
          </select>
          <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
        </div>
      </div>

      {/* ── Cases table (x-scroll) ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }} className="scrollbar-hide">
          <div style={{ minWidth: TABLE_MIN }}>
            <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 12, alignItems: 'center', padding: '13px 22px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
              {['Employee', 'Designation', 'Clearances', 'Stage', 'Last Working Day', 'Action'].map((h, i) => (
                <span key={i} style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: i === 5 ? 'right' : 'left' }}>{h}</span>
              ))}
            </div>

            {rows.length === 0 ? <EmptyState /> : rows.map((c, i) => {
              const stage = overallStage(c)
              const sm = STAGE_META[stage]
              const done = clearedCount(c)
              const dateShown = c.lwd ?? c.intendedLwd
              const dleft = daysUntil(dateShown)
              return (
                <div key={c.id} onClick={() => onOpen?.(c.id)}
                  style={{ display: 'grid', gridTemplateColumns: GRID, gap: 12, alignItems: 'center', padding: '14px 22px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', transition: 'background 0.12s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FAFBFE' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                >
                  {/* Employee */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={c.avatar} alt={c.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 1px 4px rgba(28,32,53,0.12)', flexShrink: 0 }} />
                    <div className="min-w-0">
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap' }}>{c.name}</div>
                      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{c.code}</div>
                    </div>
                  </div>

                  {/* Designation */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#3D4266', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.designation}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{c.department}</div>
                  </div>

                  {/* Clearances indicator */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      {DEPTS.map(d => {
                        const st = c.clearances[d.key].status
                        const dm = DOT[st]
                        const isDone = st === 'approved' || st === 'cleared'
                        return (
                          <span key={d.key} title={`${d.label}: ${st}`}
                            className="flex items-center justify-center"
                            style={{ width: 22, height: 22, borderRadius: 7, background: dm.bg, color: dm.color, fontSize: 10, fontWeight: 800, position: 'relative' }}>
                            {isDone ? <CheckCircle2 size={13} strokeWidth={2.6} /> : d.short}
                            {st === 'on-hold' && <span style={{ position: 'absolute', top: -3, right: -3, width: 7, height: 7, borderRadius: '50%', background: C.red, border: '1.5px solid #fff' }} />}
                          </span>
                        )
                      })}
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: done === 4 ? C.green : C.muted, whiteSpace: 'nowrap' }}>{done}/4</span>
                  </div>

                  {/* Stage */}
                  <div>
                    <span className="rounded-full" style={{ padding: '5px 11px', background: sm.bg, color: sm.color, fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}>{sm.label}</span>
                  </div>

                  {/* Last Working Day */}
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap' }}>{fmtDate(dateShown)}</div>
                    <div style={{ fontSize: 11, marginTop: 1 }}>
                      {stage === 'completed'
                        ? <span style={{ color: C.green, fontWeight: 600 }}>Offboarded</span>
                        : stage === 'pending-cto'
                          ? <span style={{ color: C.muted }}>Intended</span>
                          : <span style={{ color: dleft <= 10 ? C.red : C.muted, fontWeight: dleft <= 10 ? 700 : 400 }}>{dleft > 0 ? `${dleft} days left` : 'Due'}</span>}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    <button onClick={e => { e.stopPropagation(); onOpen?.(c.id) }}
                      className="flex items-center gap-1.5"
                      style={{ height: 36, padding: '0 15px', borderRadius: 9, fontSize: 12.5, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: C.indigoDeep, cursor: 'pointer', whiteSpace: 'nowrap' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
                    >
                      Open <ChevronRight size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ padding: '56px 24px', textAlign: 'center' }}>
      <div className="flex items-center justify-center mx-auto mb-4 rounded-2xl" style={{ width: 58, height: 58, background: C.hover }}>
        <Inbox size={26} strokeWidth={1.7} style={{ color: '#B0B4C8' }} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 6 }}>No cases found</div>
      <p style={{ fontSize: 13, color: C.muted, maxWidth: 340, margin: '0 auto' }}>Try a different search term or switch the stage filter.</p>
    </div>
  )
}
