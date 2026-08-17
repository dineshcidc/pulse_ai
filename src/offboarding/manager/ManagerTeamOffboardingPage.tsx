import { useMemo, useState } from 'react'
import {
  Users, Search, ChevronDown, ChevronRight, Clock3, CheckCircle2,
  PauseCircle, ShieldAlert, Lock, Inbox,
} from 'lucide-react'
import { SHOW_ON_HOLD_FLOW, effStatus } from '../offboardingFlags'

/*
 * Manager (Project Manager) › Team Offboarding — Screen M1 (Queue).
 *
 * The manager's team members who are offboarding. The manager gives the
 * PROJECT HANDOVER clearance — but only AFTER the CTO has approved:
 *   • awaiting-cto — CTO hasn't approved yet → view-only ("Awaiting CTO Approval").
 *   • pending      — CTO approved → needs the manager's clearance ("Clear").
 *   • cleared      — manager submitted the handover clearance.
 *   • on-hold      — manager put it on hold (blocker) with a reason.
 *
 * Row → opens Screen M2 (detail + project clearance) via onOpen.
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

export const MANAGER = 'Priya Sharma'

// Fixed "today" for the demo so relative dates stay stable.
export const TODAY = new Date('2026-08-05')

export type ClearanceStatus = 'awaiting-cto' | 'pending' | 'cleared' | 'on-hold'

export type TeamOffboardCase = {
  id: string
  name: string
  code: string
  designation: string
  department: string
  avatar: string
  reason: string
  intendedLwd: string       // employee's requested last day
  lwd?: string              // confirmed last day (after CTO approval)
  noticeDays?: number       // set by CTO
  status: ClearanceStatus
  submittedOn: string
  // ── detail-page fields (M2) ──
  manager: string
  doj: string
  email: string
  phone: string
  notes: string
  holdReason?: string
  clearedOn?: string
}

export const MOCK_TEAM: TeamOffboardCase[] = [
  { id: 'OFB-2442', name: 'John Doe',      code: 'CC001', designation: 'Senior Software Engineer', department: 'Engineering', avatar: 'https://randomuser.me/api/portraits/men/32.jpg',   reason: 'Better Career Opportunity', intendedLwd: '2026-10-02', lwd: '2026-10-02', noticeDays: 60, status: 'pending',      submittedOn: '2026-08-04', manager: MANAGER, doj: '2021-03-12', email: 'john.doe@concertidc.com',    phone: '+91 98840 12345', notes: 'I have accepted an offer for a senior role that offers stronger long-term growth and ownership. It was a difficult decision — I have valued my time here and the mentorship on the platform team. I will ensure a clean handover of my modules and complete knowledge transfer before my last day.' },
  { id: 'OFB-2445', name: 'Aisha Khan',    code: 'CC024', designation: 'Software Engineer',        department: 'Engineering', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', reason: 'Relocation',                intendedLwd: '2026-08-20', lwd: '2026-08-20', noticeDays: 30, status: 'pending',      submittedOn: '2026-07-21', manager: MANAGER, doj: '2022-09-01', email: 'aisha.khan@concertidc.com',   phone: '+91 90035 22118', notes: 'Relocating with family. Happy to hand over ongoing work during the notice period.' },
  { id: 'OFB-2440', name: 'Rajesh Kumar',  code: 'CC021', designation: 'QA Lead',                  department: 'Quality',     avatar: 'https://randomuser.me/api/portraits/men/45.jpg',   reason: 'Higher Studies',            intendedLwd: '2026-11-01',                             status: 'awaiting-cto', submittedOn: '2026-08-01', manager: MANAGER, doj: '2020-01-20', email: 'rajesh.kumar@concertidc.com', phone: '+91 99620 77889', notes: 'Admitted to a full-time master’s program. Would like to plan the QA handover carefully.' },
  { id: 'OFB-2436', name: 'Meera Nair',    code: 'CC009', designation: 'Business Analyst',         department: 'Delivery',    avatar: 'https://randomuser.me/api/portraits/women/68.jpg', reason: 'Career Growth / Role Change', intendedLwd: '2026-09-18', lwd: '2026-09-18', noticeDays: 60, status: 'cleared',   submittedOn: '2026-07-20', clearedOn: '2026-07-28', manager: MANAGER, doj: '2019-08-05', email: 'meera.nair@concertidc.com', phone: '+91 98410 33221', notes: 'Moving into a product management track. Committed to a smooth transition.' },
  { id: 'OFB-2431', name: 'Arjun Menon',   code: 'CC017', designation: 'DevOps Engineer',          department: 'Platform',    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',   reason: 'Compensation & Benefits',   intendedLwd: '2026-08-25', lwd: '2026-08-25', noticeDays: 30, status: 'on-hold',      submittedOn: '2026-07-10', holdReason: 'Production deployment runbooks and on-call handover still pending. Cleared once KT sessions are completed.', manager: MANAGER, doj: '2021-11-15', email: 'arjun.menon@concertidc.com', phone: '+91 90477 66554', notes: 'Received an offer with a better package. Current project has wrapped up.' },
]

const STATUS_META: Record<ClearanceStatus, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  'awaiting-cto': { label: 'Awaiting CTO Approval', color: C.slate,  bg: 'rgba(91,95,130,0.14)', Icon: ShieldAlert },
  pending:        { label: 'Pending Clearance',     color: '#B26905', bg: 'rgba(217,119,6,0.12)', Icon: Clock3 },
  cleared:        { label: 'Cleared',               color: '#0A8A58', bg: 'rgba(14,168,106,0.12)', Icon: CheckCircle2 },
  'on-hold':      { label: 'On Hold',               color: '#C0334A', bg: 'rgba(232,72,85,0.12)', Icon: PauseCircle },
}

const SORT_RANK: Record<ClearanceStatus, number> = { pending: 0, 'on-hold': 1, 'awaiting-cto': 2, cleared: 3 }

const GRID = '1.7fr 1.4fr 1.4fr 1.3fr 1.4fr 1fr'
const TABLE_MIN = 1120

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
function daysUntil(d: string) {
  return Math.round((new Date(d).getTime() - TODAY.getTime()) / 86400000)
}

type Filter = 'all' | ClearanceStatus

export default function ManagerTeamOffboardingPage({ onOpen }: { onOpen?: (id: string) => void }) {
  const [query, setQuery]   = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  // On-hold hidden for now (BA): normalise every case's status up-front so the
  // "On Hold" pill / filter never appears (on-hold → pending).
  const DATA = useMemo(() => MOCK_TEAM.map(r => ({ ...r, status: effStatus(r.status) })), [])

  const counts = useMemo(() => ({
    all:            DATA.length,
    pending:        DATA.filter(r => r.status === 'pending').length,
    'awaiting-cto': DATA.filter(r => r.status === 'awaiting-cto').length,
    'on-hold':      DATA.filter(r => r.status === 'on-hold').length,
    cleared:        DATA.filter(r => r.status === 'cleared').length,
  }), [DATA])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return DATA
      .filter(r => filter === 'all' ? true : r.status === filter)
      .filter(r => !q || r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q))
      .sort((a, b) => SORT_RANK[a.status] - SORT_RANK[b.status] || new Date(b.submittedOn).getTime() - new Date(a.submittedOn).getTime())
  }, [query, filter, DATA])

  const FILTERS: { id: Filter; label: string; n: number }[] = [
    { id: 'all',          label: 'All',               n: counts.all },
    { id: 'pending',      label: 'Pending Clearance', n: counts.pending },
    { id: 'awaiting-cto', label: 'Awaiting CTO',      n: counts['awaiting-cto'] },
    // On Hold filter hidden for now (BA).
    ...(SHOW_ON_HOLD_FLOW ? [{ id: 'on-hold' as Filter, label: 'On Hold', n: counts['on-hold'] }] : []),
    { id: 'cleared',      label: 'Cleared',           n: counts.cleared },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes obFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}`}</style>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>Team Offboarding</h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>Complete the project handover clearance for your exiting team members</p>
        </div>
        <div className="flex items-center justify-center rounded-2xl flex-shrink-0" style={{ width: 60, height: 60, backgroundColor: 'rgba(99,102,241,0.07)', backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.22) 1px, transparent 1px)', backgroundSize: '8px 8px', border: '1px solid rgba(99,102,241,0.14)' }}>
          <div style={{ animation: 'obFloat 4s ease-in-out infinite' }}>
            <Users size={26} strokeWidth={1.5} style={{ color: C.indigoDeep }} />
          </div>
        </div>
      </div>

      {/* ── Toolbar: search + status filter ── */}
      <div className="flex items-center gap-3 flex-wrap mb-4" style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: 10 }}>
        <div className="relative" style={{ flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: C.muted }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, code or reason…"
            style={{ width: '100%', height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: '#FAFBFE', padding: '0 14px 0 36px', fontSize: 13, color: C.navy, outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          />
        </div>
        <div className="relative" style={{ minWidth: 200 }}>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as Filter)}
            style={{ width: '100%', height: 40, borderRadius: 10, border: `1px solid ${C.border}`, background: '#FAFBFE', padding: '0 36px 0 14px', fontSize: 13, fontWeight: 600, color: C.navy, outline: 'none', appearance: 'none', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          >
            {FILTERS.map(f => <option key={f.id} value={f.id}>{f.label} ({f.n})</option>)}
          </select>
          <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
        </div>
      </div>

      {/* ── Queue table (x-scroll) ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }} className="scrollbar-hide">
          <div style={{ minWidth: TABLE_MIN }}>
            {/* header row */}
            <div style={{ display: 'grid', gridTemplateColumns: GRID, gap: 12, alignItems: 'center', padding: '13px 22px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
              {['Employee', 'Designation', 'Reason', 'Last Working Day', 'Clearance Status', 'Action'].map((h, i) => (
                <span key={i} style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: i === 5 ? 'right' : 'left' }}>{h}</span>
              ))}
            </div>

            {rows.length === 0 ? (
              <EmptyState />
            ) : rows.map((r, i) => {
              const m = STATUS_META[r.status]
              const locked = r.status === 'awaiting-cto'
              const actionable = r.status === 'pending'
              const dateShown = r.lwd ?? r.intendedLwd
              const dleft = daysUntil(dateShown)
              return (
                <div key={r.id}
                  onClick={() => onOpen?.(r.id)}
                  style={{ display: 'grid', gridTemplateColumns: GRID, gap: 12, alignItems: 'center', padding: '14px 22px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}`, background: actionable ? 'rgba(217,119,6,0.035)' : '#fff', cursor: 'pointer', transition: 'background 0.12s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = actionable ? 'rgba(217,119,6,0.07)' : '#FAFBFE' }}
                  onMouseLeave={e => { e.currentTarget.style.background = actionable ? 'rgba(217,119,6,0.035)' : '#fff' }}
                >
                  {/* Employee */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={r.avatar} alt={r.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 1px 4px rgba(28,32,53,0.12)', flexShrink: 0 }} />
                    <div className="min-w-0">
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy, whiteSpace: 'nowrap' }}>{r.name}</div>
                      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{r.code}</div>
                    </div>
                  </div>

                  {/* Designation */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#3D4266', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.designation}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{r.department}</div>
                  </div>

                  {/* Reason */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#3D4266', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.reason}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>Ref {r.id}</div>
                  </div>

                  {/* Last Working Day + countdown */}
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap' }}>{fmtDate(dateShown)}</div>
                    <div style={{ fontSize: 11, marginTop: 1 }}>
                      {locked
                        ? <span style={{ color: C.muted }}>Intended · awaiting approval</span>
                        : r.status === 'cleared'
                          ? <span style={{ color: C.muted }}>Confirmed</span>
                          : <span style={{ color: dleft <= 10 ? C.red : C.muted, fontWeight: dleft <= 10 ? 700 : 400 }}>{dleft} days left</span>}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full" style={{ padding: '5px 11px', background: m.bg, color: m.color, fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap' }}>
                      <m.Icon size={12} strokeWidth={2.2} />
                      {m.label}
                    </span>
                  </div>

                  {/* Action */}
                  <div className="flex justify-end">
                    {actionable ? (
                      <button
                        onClick={e => { e.stopPropagation(); onOpen?.(r.id) }}
                        className="flex items-center gap-1.5"
                        style={{ height: 36, padding: '0 15px', borderRadius: 9, fontSize: 12.5, fontWeight: 700, border: `1px dashed ${C.indigo}`, background: 'rgba(99,102,241,0.08)', color: C.indigoDeep, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.12s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.16)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)' }}
                      >
                        Clear <ChevronRight size={14} strokeWidth={2.5} />
                      </button>
                    ) : (
                      <button
                        onClick={e => { e.stopPropagation(); onOpen?.(r.id) }}
                        className="flex items-center gap-1.5"
                        style={{ height: 36, padding: '0 15px', borderRadius: 9, fontSize: 12.5, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: locked ? C.muted : C.indigoDeep, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#FAFBFE'; e.currentTarget.style.borderColor = '#C0C4D6' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
                      >
                        {locked ? <><Lock size={12} strokeWidth={2.2} /> View</> : <>View <ChevronRight size={14} strokeWidth={2.5} /></>}
                      </button>
                    )}
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
      <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 6 }}>No team members found</div>
      <p style={{ fontSize: 13, color: C.muted, maxWidth: 340, margin: '0 auto' }}>Try a different search term or switch the status filter.</p>
    </div>
  )
}
