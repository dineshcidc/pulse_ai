import { useState } from 'react'
import {
  Clock, CalendarDays, Users, AlertTriangle,
  Eye, Check, X, ChevronRight, Activity, User,
} from 'lucide-react'

type TSStatus = 'pending' | 'approved' | 'rejected'
type LVStatus = 'pending' | 'approved' | 'rejected'

interface TSRow {
  id: number; employee: string; face: string; project: string
  submitted: string; hours: number; status: TSStatus
}
interface LeaveReq {
  id: number; employee: string; avatar: string; type: string
  from: string; to: string; days: number; status: LVStatus
}

const INIT_TS: TSRow[] = [
  { id: 1, employee: 'Sarah Johnson', face: 'https://i.pravatar.cc/40?img=47', project: 'Pulse.AI v2',  submitted: 'May 22, 2026', hours: 8.5, status: 'pending' },
  { id: 2, employee: 'Mike Chen',     face: 'https://i.pravatar.cc/40?img=12', project: 'HDFC Portal',  submitted: 'May 21, 2026', hours: 7,   status: 'pending' },
  { id: 3, employee: 'Emma Wilson',   face: 'https://i.pravatar.cc/40?img=44', project: 'TechCorp ERP', submitted: 'May 20, 2026', hours: 9,   status: 'pending' },
  { id: 4, employee: 'David Brown',   face: 'https://i.pravatar.cc/40?img=8',  project: 'Pulse.AI v2',  submitted: 'May 20, 2026', hours: 6.5, status: 'pending' },
  { id: 5, employee: 'Priya Sharma',  face: 'https://i.pravatar.cc/40?img=31', project: 'HDFC Portal',  submitted: 'May 19, 2026', hours: 8,   status: 'pending' },
  { id: 6, employee: 'Karthik Nair',  face: 'https://i.pravatar.cc/40?img=15', project: 'TechCorp ERP', submitted: 'May 18, 2026', hours: 7.5, status: 'pending' },
]
const INIT_LEAVES: LeaveReq[] = [
  { id: 1, employee: 'James Wilson', avatar: 'JW', type: 'Annual Leave', from: 'May 26', to: 'May 28', days: 3, status: 'pending'  },
  { id: 2, employee: 'Lisa Garcia',  avatar: 'LG', type: 'Sick Leave',   from: 'May 23', to: 'May 23', days: 1, status: 'pending'  },
  { id: 3, employee: 'Tom Davis',    avatar: 'TD', type: 'Casual Leave', from: 'Jun 2',  to: 'Jun 3',  days: 2, status: 'approved' },
  { id: 4, employee: 'Anjali Singh', avatar: 'AS', type: 'Annual Leave', from: 'Jun 5',  to: 'Jun 7',  days: 3, status: 'pending'  },
]
const RECENT_UPDATES = [
  { id: 1, text: 'Sarah Johnson submitted weekly timesheet',       time: '2h ago', face: 'https://i.pravatar.cc/40?img=47' },
  { id: 2, text: 'James Wilson applied for 3-day annual leave',    time: '4h ago', face: 'https://i.pravatar.cc/40?img=12' },
  { id: 3, text: 'Karthik Nair joined Pulse.AI v2 project',        time: '1d ago', face: 'https://i.pravatar.cc/40?img=15' },
  { id: 4, text: 'New support ticket opened by Emma Wilson',       time: '1d ago', face: 'https://i.pravatar.cc/40?img=44' },
  { id: 5, text: 'HDFC Portal Milestone 3 marked complete',        time: '2d ago', face: 'https://i.pravatar.cc/40?img=8'  },
  { id: 6, text: 'Priya Sharma updated TechCorp ERP task status',  time: '2d ago', face: 'https://i.pravatar.cc/40?img=31' },
]
const UPCOMING_LEAVES = [
  { name: 'James Wilson', type: 'Annual', from: 'May 26', to: 'May 28', days: 3 },
  { name: 'Anjali Singh', type: 'Annual', from: 'Jun 5',  to: 'Jun 7',  days: 3 },
  { name: 'Tom Davis',    type: 'Casual', from: 'Jun 2',  to: 'Jun 3',  days: 2 },
  { name: 'Karthik Nair', type: 'Sick',   from: 'May 24', to: 'May 24', days: 1 },
  { name: 'Priya Sharma', type: 'Casual', from: 'Jun 10', to: 'Jun 11', days: 2 },
  { name: 'David Brown',  type: 'Annual', from: 'Jun 16', to: 'Jun 18', days: 3 },
]

const AVATAR_COLORS = [
  { bg: 'rgba(99,102,241,0.12)',  color: '#6366F1' },
  { bg: 'rgba(14,168,106,0.12)', color: '#0A8A58' },
  { bg: 'rgba(217,119,6,0.12)',  color: '#D97706' },
  { bg: 'rgba(8,145,178,0.12)',  color: '#0891B2' },
  { bg: 'rgba(232,72,85,0.10)',  color: '#E84855' },
]
const TS_CFG: Record<TSStatus, { label: string; color: string; bg: string }> = {
  pending:  { label: 'Pending',  color: '#D97706', bg: 'rgba(217,119,6,0.09)'   },
  approved: { label: 'Approved', color: '#0A8A58', bg: 'rgba(14,168,106,0.10)'  },
  rejected: { label: 'Rejected', color: '#E84855', bg: 'rgba(232,72,85,0.09)'   },
}
const LV_CFG: Record<LVStatus, { label: string; color: string; bg: string }> = {
  pending:  { label: 'Pending',  color: '#D97706', bg: 'rgba(217,119,6,0.10)'   },
  approved: { label: 'Approved', color: '#0A8A58', bg: 'rgba(14,168,106,0.10)'  },
  rejected: { label: 'Rejected', color: '#E84855', bg: 'rgba(232,72,85,0.09)'   },
}
const LV_TYPE_CFG: Record<string, { color: string; bg: string }> = {
  Annual:  { color: '#6366F1', bg: 'rgba(99,102,241,0.09)'  },
  Sick:    { color: '#E84855', bg: 'rgba(232,72,85,0.09)'   },
  Casual:  { color: '#0891B2', bg: 'rgba(8,145,178,0.09)'   },
}
const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

function Avatar({ idx }: { idx: number }) {
  const ac = AVATAR_COLORS[idx % AVATAR_COLORS.length]
  return (
    <div style={{ width: 34, height: 34, borderRadius: 10, background: ac.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <User size={16} strokeWidth={1.8} style={{ color: ac.color }} />
    </div>
  )
}

export default function TeamDashboardPage({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const [tsRows,    setTsRows]    = useState<TSRow[]>(INIT_TS)
  const [leaveRows, setLeaveRows] = useState<LeaveReq[]>(INIT_LEAVES)

  const approveTS    = (id: number) => setTsRows(r => r.map(x => x.id === id ? { ...x, status: 'approved' } : x))
  const rejectTS     = (id: number) => setTsRows(r => r.map(x => x.id === id ? { ...x, status: 'rejected' } : x))
  const approveLeave = (id: number) => setLeaveRows(r => r.map(x => x.id === id ? { ...x, status: 'approved' } : x))
  const rejectLeave  = (id: number) => setLeaveRows(r => r.map(x => x.id === id ? { ...x, status: 'rejected' } : x))

  const pendingTS     = tsRows.filter(r => r.status === 'pending').length
  const pendingLeaves = leaveRows.filter(r => r.status === 'pending').length

  const STATS = [
    { label: 'Pending Timesheets', value: pendingTS,     color: '#6366F1', bg: 'rgba(99,102,241,0.09)',  hBg: 'rgba(99,102,241,0.16)', Icon: Clock         },
    { label: 'Pending Leaves',     value: pendingLeaves, color: '#D97706', bg: 'rgba(217,119,6,0.09)',   hBg: 'rgba(217,119,6,0.16)',  Icon: CalendarDays  },
    { label: 'Active Members',     value: 10,            color: '#0A8A58', bg: 'rgba(14,168,106,0.09)',  hBg: 'rgba(14,168,106,0.16)', Icon: Users         },
    { label: 'Late Submissions',   value: 2,             color: '#E84855', bg: 'rgba(232,72,85,0.09)',   hBg: 'rgba(232,72,85,0.16)',  Icon: AlertTriangle },
  ]

  const COLS = '1.8fr 1.4fr 1.2fr 0.7fr 1fr 100px'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: C.navy, margin: 0 }}>Team Dashboard</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: '3px 0 0' }}>Quick overview of team activity, approvals and performance</p>
        </div>
        <div style={{ fontSize: 12, color: C.muted, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, padding: '6px 14px', fontWeight: 600 }}>
          May 2026
        </div>
      </div>

      {/* ── Stats: 4 cards in one row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {STATS.map(({ label, value, color, bg, hBg, Icon }) => (
          <div key={label}
            style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'default', transition: 'box-shadow 0.15s, border-color 0.15s' }}
            onMouseEnter={e => { const el = e.currentTarget; el.style.boxShadow = '0 4px 16px rgba(28,32,53,0.08)'; el.style.borderColor = '#D4D6E8'; const ico = el.querySelector('.s-ico') as HTMLElement; if (ico) ico.style.background = hBg }}
            onMouseLeave={e => { const el = e.currentTarget; el.style.boxShadow = 'none'; el.style.borderColor = C.border; const ico = el.querySelector('.s-ico') as HTMLElement; if (ico) ico.style.background = bg }}
          >
            <div className="s-ico" style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
              <Icon size={19} strokeWidth={1.8} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.navy, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 4 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main 2-column row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 16, marginBottom: 16 }}>

        {/* Pending Timesheets */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${C.border}` }}>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: C.navy }}>Pending Timesheets</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>Awaiting your review</div>
            </div>
            <button
              onClick={() => onNavigate?.('team-timesheets')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#6366F1', background: 'rgba(99,102,241,0.09)', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.16)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}
            >
              View All <ChevronRight size={13} strokeWidth={2.5} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: COLS, padding: '9px 20px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
            {['Employee', 'Project', 'Submitted', 'Hours', 'Status', 'Actions'].map((h, i) => (
              <div key={i} style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</div>
            ))}
          </div>

          {tsRows.map((row, i) => {
            const sc = TS_CFG[row.status]
            return (
              <div key={row.id}
                style={{ display: 'grid', gridTemplateColumns: COLS, padding: '14px 20px', alignItems: 'center', borderBottom: i < tsRows.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.12s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = C.surface }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <img src={row.face} alt={row.employee} style={{ width: 34, height: 34, borderRadius: 10, objectFit: 'cover', flexShrink: 0, border: `1px solid ${C.border}` }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.employee}</span>
                </div>
                <div style={{ fontSize: 12.5, color: '#5A6080', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>{row.project}</div>
                <div style={{ fontSize: 12, color: C.muted }}>{row.submitted}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{row.hours}h</div>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: sc.bg, color: sc.color }}>{sc.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <button
                    title="View"
                    style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: 'rgba(99,102,241,0.09)', color: '#6366F1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.09)' }}
                  >
                    <Eye size={12} strokeWidth={1.8} />
                  </button>
                  <button
                    title="Approve"
                    onClick={() => approveTS(row.id)}
                    disabled={row.status !== 'pending'}
                    style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: row.status !== 'pending' ? C.hover : 'rgba(14,168,106,0.10)', color: row.status !== 'pending' ? '#C8CCE0' : '#0A8A58', cursor: row.status !== 'pending' ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }}
                    onMouseEnter={e => { if (row.status === 'pending') e.currentTarget.style.background = 'rgba(14,168,106,0.20)' }}
                    onMouseLeave={e => { if (row.status === 'pending') e.currentTarget.style.background = 'rgba(14,168,106,0.10)' }}
                  >
                    <Check size={12} strokeWidth={2.5} />
                  </button>
                  <button
                    title="Reject"
                    onClick={() => rejectTS(row.id)}
                    disabled={row.status !== 'pending'}
                    style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: row.status !== 'pending' ? C.hover : 'rgba(232,72,85,0.09)', color: row.status !== 'pending' ? '#C8CCE0' : '#E84855', cursor: row.status !== 'pending' ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }}
                    onMouseEnter={e => { if (row.status === 'pending') e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }}
                    onMouseLeave={e => { if (row.status === 'pending') e.currentTarget.style.background = 'rgba(232,72,85,0.09)' }}
                  >
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Leave Requests */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: C.navy }}>Leave Requests</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>{pendingLeaves} pending approval</div>
            </div>
            <button
              onClick={() => onNavigate?.('team-leave')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: '#D97706', background: 'rgba(217,119,6,0.09)', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(217,119,6,0.16)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(217,119,6,0.09)' }}
            >
              View All <ChevronRight size={13} strokeWidth={2.5} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {leaveRows.map((row, i) => {
              const sc = LV_CFG[row.status]
              return (
                <div key={row.id}
                  style={{ padding: '13px 20px', borderBottom: i < leaveRows.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.12s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = C.surface }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <Avatar idx={i + 2} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 2 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.employee}</div>
                        <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: sc.bg, color: sc.color, flexShrink: 0 }}>{sc.label}</span>
                      </div>
                      <div style={{ fontSize: 11.5, color: C.muted }}>{row.type} · {row.from} – {row.to} · {row.days}d</div>
                      {row.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          <button
                            onClick={() => approveLeave(row.id)}
                            style={{ flex: 1, height: 28, borderRadius: 7, border: 'none', background: 'rgba(14,168,106,0.10)', color: '#0A8A58', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'background 0.14s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.18)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.10)' }}
                          >
                            <Check size={12} strokeWidth={2.5} /> Approve
                          </button>
                          <button
                            onClick={() => rejectLeave(row.id)}
                            style={{ flex: 1, height: 28, borderRadius: 7, border: 'none', background: 'rgba(232,72,85,0.09)', color: '#E84855', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'background 0.14s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.09)' }}
                          >
                            <X size={12} strokeWidth={2.5} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom row: Recent Updates + Upcoming Leaves — equal halves ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Recent Team Updates */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Activity size={15} strokeWidth={1.8} style={{ color: '#6366F1' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>Recent Team Updates</div>
              <div style={{ fontSize: 11.5, color: C.muted }}>Latest activity across your team</div>
            </div>
          </div>
          {RECENT_UPDATES.map((u, i) => (
            <div key={u.id}
              style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < RECENT_UPDATES.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.12s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = C.surface }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
            >
              <img src={u.face} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `1px solid ${C.border}` }} />
              <div style={{ flex: 1, fontSize: 12.5, color: '#3D4266', lineHeight: 1.5 }}>{u.text}</div>
              <div style={{ fontSize: 11, color: C.muted, flexShrink: 0, fontWeight: 600 }}>{u.time}</div>
            </div>
          ))}
        </div>

        {/* Upcoming Leaves & Holidays */}
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(8,145,178,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <CalendarDays size={15} strokeWidth={1.8} style={{ color: '#0891B2' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.navy }}>Upcoming Team Leaves</div>
              <div style={{ fontSize: 11.5, color: C.muted }}>Next 60 days · {UPCOMING_LEAVES.length} scheduled</div>
            </div>
          </div>
          {UPCOMING_LEAVES.map((l, i) => {
            const tc = LV_TYPE_CFG[l.type] ?? { color: C.muted, bg: C.hover }
            return (
              <div key={i}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 20px', borderBottom: i < UPCOMING_LEAVES.length - 1 ? `1px solid ${C.border}` : 'none', transition: 'background 0.12s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = C.surface }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, marginBottom: 2 }}>{l.name}</div>
                  <div style={{ fontSize: 11.5, color: C.muted }}>{l.from} – {l.to}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: tc.bg, color: tc.color }}>{l.type}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: C.navy, minWidth: 22, textAlign: 'right' }}>{l.days}d</span>
                </div>
              </div>
            )
          })}
        </div>

      </div>

    </div>
  )
}
