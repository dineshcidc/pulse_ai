import { useMemo, useState } from 'react'
import {
  ShieldCheck, Search, Clock3, CheckCircle2, XCircle, RotateCcw,
  Inbox, ChevronRight, ChevronDown,
} from 'lucide-react'

/*
 * CTO (Delivery Head) › Offboarding Approvals — Screen C1 (Approval Queue).
 *
 * The CTO is the FIRST and ONLY approver. This queue lists every exit request:
 *   • Pending  — needs a decision (sorted to top, highlighted).
 *   • Approved — notice period was set.
 *   • Rejected — declined with a reason.
 *   • Withdrawn — employee pulled it before a decision.
 *
 * Row → "Review" (pending) / "View" (decided) opens Screen C2 (detail + decision).
 * onOpen is handed down by the module so C1 → C2 drill-down works.
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
}

export type ReqStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn'

export type OffboardRequest = {
  id: string
  name: string
  code: string
  designation: string
  department: string
  avatar: string
  reason: string
  requestedLwd: string      // YYYY-MM-DD
  submittedOn: string       // YYYY-MM-DD
  status: ReqStatus
  noticeDays?: number       // set when approved
  decidedOn?: string        // approved / rejected date
  // ── detail-page fields ──
  manager: string
  doj: string               // date of joining (YYYY-MM-DD)
  email: string
  phone: string
  notes: string             // the employee's written reason
  decidedBy?: string
  rejectReason?: string
}

// Fixed "today" for the demo so relative dates stay stable.
export const TODAY = new Date('2026-08-05')

export const MOCK_REQUESTS: OffboardRequest[] = [
  { id: 'OFB-2442', name: 'John Doe',       code: 'CC001', designation: 'Senior Software Engineer', department: 'Engineering', avatar: 'https://randomuser.me/api/portraits/men/32.jpg',   reason: 'Better Career Opportunity',   requestedLwd: '2026-10-02', submittedOn: '2026-08-04', status: 'pending',
    manager: 'Priya Sharma', doj: '2021-03-12', email: 'john.doe@concertidc.com', phone: '+91 98840 12345',
    notes: 'I have accepted an offer for a senior role that offers stronger long-term growth and ownership. It was a difficult decision — I have valued my time here and the mentorship on the platform team. I will ensure a clean handover of my modules and complete knowledge transfer before my last day.' },
  { id: 'OFB-2441', name: 'Sarah Johnson',  code: 'CC014', designation: 'Product Designer',         department: 'Design',      avatar: 'https://randomuser.me/api/portraits/women/44.jpg', reason: 'Relocation',                  requestedLwd: '2026-09-30', submittedOn: '2026-08-03', status: 'pending',
    manager: 'Karthik Rao', doj: '2022-06-01', email: 'sarah.johnson@concertidc.com', phone: '+91 90031 44556',
    notes: 'My family is relocating to another city permanently, so I am unable to continue in this role. I am happy to help transition my design files and ongoing work to the team during my notice period.' },
  { id: 'OFB-2440', name: 'Rajesh Kumar',   code: 'CC021', designation: 'QA Lead',                  department: 'Quality',     avatar: 'https://randomuser.me/api/portraits/men/45.jpg',   reason: 'Higher Studies',              requestedLwd: '2026-11-01', submittedOn: '2026-08-01', status: 'pending',
    manager: 'Priya Sharma', doj: '2020-01-20', email: 'rajesh.kumar@concertidc.com', phone: '+91 99620 77889',
    notes: 'I have been admitted to a full-time master’s program starting this fall and need to step away to pursue it. I would like to plan the QA handover carefully given the release schedule.' },
  { id: 'OFB-2436', name: 'Meera Nair',     code: 'CC009', designation: 'Business Analyst',         department: 'Delivery',    avatar: 'https://randomuser.me/api/portraits/women/68.jpg', reason: 'Career Growth / Role Change', requestedLwd: '2026-09-18', submittedOn: '2026-07-20', status: 'approved', noticeDays: 60, decidedOn: '2026-07-22', decidedBy: 'Delivery Head',
    manager: 'Anil Verma', doj: '2019-08-05', email: 'meera.nair@concertidc.com', phone: '+91 98410 33221',
    notes: 'I am moving into a product management track elsewhere that aligns with my long-term goals. Grateful for the opportunities here and committed to a smooth transition.' },
  { id: 'OFB-2431', name: 'Arjun Menon',    code: 'CC017', designation: 'DevOps Engineer',          department: 'Platform',    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',   reason: 'Compensation & Benefits',     requestedLwd: '2026-08-25', submittedOn: '2026-07-10', status: 'approved', noticeDays: 30, decidedOn: '2026-07-12', decidedBy: 'Delivery Head',
    manager: 'Karthik Rao', doj: '2021-11-15', email: 'arjun.menon@concertidc.com', phone: '+91 90477 66554',
    notes: 'I have received an offer with a significantly better compensation package. Requesting a 30-day notice given my current project has wrapped up.' },
  { id: 'OFB-2428', name: 'Vikram Singh',   code: 'CC005', designation: 'Engineering Manager',      department: 'Engineering', avatar: 'https://randomuser.me/api/portraits/men/60.jpg',   reason: 'Work–Life Balance',           requestedLwd: '2026-09-05', submittedOn: '2026-07-15', status: 'rejected', decidedOn: '2026-07-17', decidedBy: 'Delivery Head',
    manager: 'Priya Sharma', doj: '2018-04-02', email: 'vikram.singh@concertidc.com', phone: '+91 98180 22110',
    notes: 'I have been feeling stretched and would like to explore roles with better work–life balance.',
    rejectReason: 'Let’s reconnect on your workload and team structure before proceeding. I’ve scheduled time with you and HR this week to explore a revised role and a sabbatical option — I’d really like to retain you on the team.' },
  { id: 'OFB-2422', name: 'Ananya Rao',     code: 'CC030', designation: 'HR Executive',             department: 'HR',          avatar: 'https://randomuser.me/api/portraits/women/33.jpg', reason: 'Personal Reasons',            requestedLwd: '2026-08-30', submittedOn: '2026-07-28', status: 'withdrawn',
    manager: 'Deepa Iyer', doj: '2022-02-10', email: 'ananya.rao@concertidc.com', phone: '+91 96770 88990',
    notes: 'Raising this due to some personal circumstances I need to attend to.' },
]

const STATUS_META: Record<ReqStatus, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  pending:   { label: 'Pending Review', color: '#B26905', bg: 'rgba(217,119,6,0.12)',  Icon: Clock3 },
  approved:  { label: 'Approved',       color: '#0A8A58', bg: 'rgba(14,168,106,0.12)', Icon: CheckCircle2 },
  rejected:  { label: 'Rejected',       color: '#C0334A', bg: 'rgba(232,72,85,0.12)',  Icon: XCircle },
  withdrawn: { label: 'Withdrawn',      color: '#6B7091', bg: '#EEF0F6',               Icon: RotateCcw },
}

const GRID = '1.7fr 1.5fr 1.5fr 1.15fr 1fr 1.25fr 0.9fr'
const TABLE_MIN = 1060

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
function daysAgo(d: string) {
  const diff = Math.round((TODAY.getTime() - new Date(d).getTime()) / 86400000)
  if (diff <= 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return `${diff} days ago`
}
function daysUntil(d: string) {
  return Math.max(0, Math.round((new Date(d).getTime() - TODAY.getTime()) / 86400000))
}

type Filter = 'all' | ReqStatus

export default function CTOApprovalsPage({ onOpen }: { onOpen?: (id: string) => void }) {
  const [query, setQuery]   = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const counts = useMemo(() => ({
    pending:  MOCK_REQUESTS.filter(r => r.status === 'pending').length,
    approved: MOCK_REQUESTS.filter(r => r.status === 'approved').length,
    rejected: MOCK_REQUESTS.filter(r => r.status === 'rejected').length,
    total:    MOCK_REQUESTS.length,
  }), [])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MOCK_REQUESTS
      .filter(r => filter === 'all' ? true : r.status === filter)
      .filter(r => !q || r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q) || r.reason.toLowerCase().includes(q))
      // pending first, then most recently submitted
      .sort((a, b) => {
        if (a.status === 'pending' && b.status !== 'pending') return -1
        if (b.status === 'pending' && a.status !== 'pending') return 1
        return new Date(b.submittedOn).getTime() - new Date(a.submittedOn).getTime()
      })
  }, [query, filter])

  const FILTERS: { id: Filter; label: string; n: number }[] = [
    { id: 'all',       label: 'All',       n: counts.total },
    { id: 'pending',   label: 'Pending',   n: counts.pending },
    { id: 'approved',  label: 'Approved',  n: counts.approved },
    { id: 'rejected',  label: 'Rejected',  n: counts.rejected },
  ]

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`@keyframes obFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}`}</style>

      {/* ── Page header ── */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>Offboarding Approvals</h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>Review exit requests, set the notice period, or decline</p>
        </div>
        <div className="flex items-center justify-center rounded-2xl flex-shrink-0" style={{ width: 60, height: 60, backgroundColor: 'rgba(99,102,241,0.07)', backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.22) 1px, transparent 1px)', backgroundSize: '8px 8px', border: '1px solid rgba(99,102,241,0.14)' }}>
          <div style={{ animation: 'obFloat 4s ease-in-out infinite' }}>
            <ShieldCheck size={26} strokeWidth={1.5} style={{ color: C.indigoDeep }} />
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
        <div className="relative" style={{ minWidth: 190 }}>
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
              {['Employee', 'Designation', 'Reason', 'Requested Last Day', 'Submitted', 'Status', 'Action'].map((h, i) => (
                <span key={i} style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: i === 6 ? 'right' : 'left' }}>{h}</span>
              ))}
            </div>

            {rows.length === 0 ? (
              <EmptyState />
            ) : rows.map((r, i) => {
              const m = STATUS_META[r.status]
              const pending = r.status === 'pending'
              return (
                <div key={r.id}
                  onClick={() => onOpen?.(r.id)}
                  style={{ display: 'grid', gridTemplateColumns: GRID, gap: 12, alignItems: 'center', padding: '14px 22px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}`, background: pending ? 'rgba(217,119,6,0.035)' : '#fff', cursor: 'pointer', transition: 'background 0.12s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = pending ? 'rgba(217,119,6,0.07)' : '#FAFBFE' }}
                  onMouseLeave={e => { e.currentTarget.style.background = pending ? 'rgba(217,119,6,0.035)' : '#fff' }}
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

                  {/* Requested Last Day */}
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap' }}>{fmtDate(r.requestedLwd)}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                      {r.status === 'approved' && r.noticeDays ? `${r.noticeDays}-day notice` : `in ${daysUntil(r.requestedLwd)} days`}
                    </div>
                  </div>

                  {/* Submitted */}
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap' }}>{daysAgo(r.submittedOn)}</div>
                    <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{fmtDate(r.submittedOn)}</div>
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
                    {pending ? (
                      <button
                        onClick={e => { e.stopPropagation(); onOpen?.(r.id) }}
                        className="flex items-center gap-1.5"
                        style={{ height: 36, padding: '0 15px', borderRadius: 9, fontSize: 12.5, fontWeight: 700, border: `1px dashed ${C.amber}`, background: 'rgba(217,119,6,0.08)', color: '#B26905', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 0.12s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(217,119,6,0.15)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(217,119,6,0.08)' }}
                      >
                        Review <ChevronRight size={14} strokeWidth={2.5} />
                      </button>
                    ) : (
                      <button
                        onClick={e => { e.stopPropagation(); onOpen?.(r.id) }}
                        className="flex items-center gap-1.5"
                        style={{ height: 36, padding: '0 15px', borderRadius: 9, fontSize: 12.5, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: C.indigoDeep, cursor: 'pointer', whiteSpace: 'nowrap' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.06)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
                      >
                        View <ChevronRight size={14} strokeWidth={2.5} />
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
      <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, marginBottom: 6 }}>No requests found</div>
      <p style={{ fontSize: 13, color: C.muted, maxWidth: 340, margin: '0 auto' }}>Try a different search term or switch the status filter.</p>
    </div>
  )
}
