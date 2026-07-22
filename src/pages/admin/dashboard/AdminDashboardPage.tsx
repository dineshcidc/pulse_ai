import { useState, useEffect } from 'react'
import {
  Users, ClipboardCheck, CalendarDays,
  UserPlus, Megaphone, Activity,
  Zap, Shield, ArrowUpRight, ChevronRight,
  TrendingUp, AlertCircle, Clock,
} from 'lucide-react'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

function getDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

const C = {
  navy:    '#1C2035',
  border:  '#E8EAF2',
  muted:   '#8B90A7',
  hover:   '#F0F2F8',
  surface: '#F7F8FC',
}

const KPI_STATS = [
  {
    label: 'Total Employees', value: 248, isText: false,
    sub: 'Across all roles', trend: null,
    Icon: Users, color: '#6366F1', bg: 'rgba(99,102,241,0.09)', border: 'rgba(99,102,241,0.15)',
  },
  {
    label: 'On Leave Today', value: 12, isText: false,
    sub: '4.8% of workforce', trend: null,
    Icon: CalendarDays, color: '#D97706', bg: 'rgba(217,119,6,0.09)', border: 'rgba(217,119,6,0.15)',
  },
  {
    label: 'Pending Approvals', value: 7, isText: false,
    sub: 'Leave & Timesheets', trend: null,
    Icon: ClipboardCheck, color: '#E84855', bg: 'rgba(232,72,85,0.09)', border: 'rgba(232,72,85,0.15)',
  },
  {
    label: 'New Hires (May)', value: 3, isText: false,
    sub: 'Added this month', trend: 'up',
    Icon: UserPlus, color: '#0EA86A', bg: 'rgba(14,168,106,0.09)', border: 'rgba(14,168,106,0.15)',
  },
]

const WORKFORCE = {
  total: 248,
  roles: [
    { label: 'Employees', count: 221, color: '#6366F1', pct: Math.round((221 / 248) * 100) },
    { label: 'Managers',  count: 24,  color: '#D97706', pct: Math.round((24  / 248) * 100) },
    { label: 'Admins',    count: 3,   color: '#7C3AED', pct: Math.round((3   / 248) * 100) },
  ],
}

const DEPARTMENTS = [
  { name: 'Engineering', count: 94, capacity: 120, manager: 'Arjun Mehta'    },
  { name: 'Sales',       count: 42, capacity: 65,  manager: 'Sneha Reddy'    },
  { name: 'Design',      count: 28, capacity: 62,  manager: 'Vikram Nair'    },
  { name: 'Operations',  count: 34, capacity: 62,  manager: 'Pooja Iyer'     },
  { name: 'Finance',     count: 22, capacity: 55,  manager: 'Rahul Sharma'   },
  { name: 'HR',          count: 18, capacity: 60,  manager: 'Divya Krishnan' },
]

const PENDING_ACTIONS = [
  { id: 'leave',    label: 'Leave Requests',    count: 5,  overdue: 2, Icon: CalendarDays, navId: 'all-leave-requests' },
  { id: 'ts',       label: 'Timesheet Reviews', count: 12, overdue: 0, Icon: Clock,        navId: 'pending-approvals'  },
  // { id: 'newusers', label: 'New Registrations', count: 2,  overdue: 0, Icon: UserPlus,     navId: 'all-users'          },
]

const RECENT_ACTIVITY = [
  { id: 1, Icon: UserPlus,  color: '#0EA86A', bg: 'rgba(14,168,106,0.10)',  title: 'New employee added', desc: 'Kavya Sharma · EMP-249',         time: '2m ago' },
  { id: 2, Icon: CalendarDays, color: '#6366F1', bg: 'rgba(99,102,241,0.10)', title: 'Leave approved',  desc: 'John Doe · 2 days Planned Leave', time: '1h ago' },
  { id: 3, Icon: Users,     color: '#7C3AED', bg: 'rgba(124,58,237,0.10)',  title: 'Role updated',      desc: 'Priya Patel → Project Manager',  time: '1d ago' },
  { id: 4, Icon: Shield,    color: '#D97706', bg: 'rgba(217,119,6,0.10)',   title: 'Policy updated',    desc: 'IT Security Policy v2.4',         time: '2d ago' },
  { id: 5, Icon: Clock,     color: '#E84855', bg: 'rgba(232,72,85,0.10)',   title: 'Timesheet flagged', desc: 'Rohan Das · Week 20 — 62 hrs',   time: '2d ago' },
]

const LEAVE_OVERVIEW = { pending: 5, approved: 47, rejected: 8, total: 60 }

const QUICK_ACTIONS = [
  { id: 'add-employee',       label: 'Add Employee',      Icon: UserPlus    },
  { id: 'all-leave-requests', label: 'Review Leaves',     Icon: CalendarDays },
  { id: 'announcements',      label: 'Post Announcement', Icon: Megaphone   },
]

export default function AdminDashboardPage({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [_now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        .stat-card { transition: box-shadow 0.18s ease, transform 0.18s ease; }
        .stat-card:hover { box-shadow: 0 4px 20px rgba(28,32,53,0.08); transform: translateY(-1px); }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-6px); }
        }
        .icon-float { animation: iconFloat 4s ease-in-out infinite; }
        .activity-row {
          border-radius: 10px;
          transition: background 0.15s ease;
          padding: 10px 10px;
          margin: 0 -10px;
          cursor: default;
        }
        .activity-row:hover { background: #F7F8FC; }
        .dept-row { transition: background 0.15s ease; cursor: default; }
        .dept-row:hover { background: #F7F8FC; }
        .qa-row { transition: background 0.15s ease, box-shadow 0.15s ease; cursor: pointer; }
        .qa-row:hover { background: #F0F2F8; }
        .review-btn { transition: background 0.14s ease, color 0.14s ease; }
        .review-btn:hover { background: #E4E6EF !important; color: #1C2035 !important; }
      `}</style>

      {/* ──────────────────── Welcome Banner ──────────────────── */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex-1 min-w-0 pr-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 text-xs font-semibold"
            style={{ background: 'rgba(124,58,237,0.10)', border: '1px solid rgba(124,58,237,0.18)', color: '#6D28D9' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#7C3AED' }} />
            {getDate()}
          </div>
          <h2 className="font-bold leading-tight mb-2" style={{ fontSize: 26, color: C.navy }}>
            {getGreeting()},{' '}
            <span style={{ color: '#7C3AED' }}>Admin!</span>
          </h2>
          <p style={{ fontSize: 14, color: '#787878', lineHeight: 1.65 }}>
            Organization overview at a glance. You have{' '}
            <span style={{ color: '#E84855', fontWeight: 700 }}>7 pending actions</span>{' '}
            requiring your attention today.
          </p>
        </div>
        <div className="flex-shrink-0">
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{
              width: 84, height: 84,
              backgroundColor: 'rgba(124,58,237,0.08)',
              backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.22) 1px, transparent 1px)',
              backgroundSize: '8px 8px',
              border: '1px solid rgba(124,58,237,0.15)',
            }}
          >
            <div className="icon-float">
              <Shield size={34} strokeWidth={1.5} style={{ color: '#7C3AED' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────── KPI Stats Row (4 cards) ──────────────────── */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        {KPI_STATS.map(({ label, value, sub, trend, Icon, color, bg, border }) => (
          <div
            key={label}
            className="stat-card"
            style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px 20px 18px' }}
          >
            <div className="flex items-start justify-between mb-4">
              <span style={{ fontSize: 12.5, fontWeight: 500, color: '#5A6080', lineHeight: 1.4, maxWidth: 90 }}>
                {label}
              </span>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: bg, border: `1px solid ${border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={17} strokeWidth={1.8} style={{ color }} />
              </div>
            </div>

            <div style={{ fontSize: 32, fontWeight: 700, color: C.navy, letterSpacing: '-0.5px', lineHeight: 1 }}>
              {value}
            </div>

            <div className="flex items-center gap-1 mt-1.5">
              {trend === 'up' && <TrendingUp size={11} strokeWidth={2.2} style={{ color: '#0EA86A', flexShrink: 0 }} />}
              <span style={{ fontSize: 11.5, color: trend === 'up' ? '#0EA86A' : '#B0B4C8', fontWeight: 500 }}>{sub}</span>
            </div>

            <div style={{ height: 3, borderRadius: 99, background: bg, marginTop: 14, border: `1px solid ${border}` }} />
          </div>
        ))}
      </div>

      {/* ──────────────────── Main 7 / 5 Grid ──────────────────── */}
      <div className="grid gap-5" style={{ gridTemplateColumns: '7fr 5fr', alignItems: 'start' }}>

        {/* ════════════ LEFT COLUMN ════════════ */}
        <div className="flex flex-col gap-5">

          {/* ── Workforce Snapshot ── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2.5">
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={14} strokeWidth={2} style={{ color: '#6366F1' }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Workforce Snapshot</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp size={13} strokeWidth={2.2} style={{ color: '#0EA86A' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#0EA86A' }}>+3 this month</span>
              </div>
            </div>

            <div style={{ padding: '20px' }}>

              {/* Total count + role breakdown bars */}
              <div className="flex items-end gap-10 mb-6">
                <div>
                  <div style={{ fontSize: 48, fontWeight: 800, color: C.navy, letterSpacing: '-2px', lineHeight: 1 }}>
                    {WORKFORCE.total}
                  </div>
                  <div style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginTop: 5 }}>
                    Total employees across all roles
                  </div>
                </div>
                <div className="flex flex-col gap-2.5 flex-1">
                  {WORKFORCE.roles.map(r => (
                    <div key={r.label} className="flex items-center gap-3">
                      <span style={{ fontSize: 12, color: C.muted, fontWeight: 500, minWidth: 68 }}>{r.label}</span>
                      <div style={{ flex: 1, height: 7, borderRadius: 99, background: '#F0F2F8', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${r.pct}%`, borderRadius: 99, background: r.color, transition: 'width 0.5s ease' }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.navy, minWidth: 28, textAlign: 'right' }}>{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department table */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
                  By Department
                </div>

                {/* Table */}
                <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>

                  {/* Header */}
                  <div
                    className="grid"
                    style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr', background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '9px 16px' }}
                  >
                    {['Department', 'Head Count', 'Capacity', 'Open Seats'].map(h => (
                      <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Rows */}
                  {DEPARTMENTS.map((d, idx) => {
                    const open = d.capacity - d.count
                    const isLast = idx === DEPARTMENTS.length - 1
                    return (
                      <div
                        key={d.name}
                        className="dept-row grid items-center"
                        style={{
                          gridTemplateColumns: '2fr 1fr 1fr 1fr',
                          padding: '13px 16px',
                          borderBottom: isLast ? 'none' : `1px solid #F0F2F8`,
                          background: '#fff',
                        }}
                      >
                        {/* Department + manager */}
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{d.name}</div>
                          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{d.manager}</div>
                        </div>

                        {/* Head count */}
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{d.count}</span>

                        {/* Capacity */}
                        <span style={{ fontSize: 13, fontWeight: 500, color: '#5A6080' }}>{d.capacity}</span>

                        {/* Open seats */}
                        <span
                          style={{
                            fontSize: 12, fontWeight: 600,
                            color: open > 10 ? '#0EA86A' : open > 0 ? '#D97706' : '#E84855',
                            display: 'inline-block',
                          }}
                        >
                          {open > 0 ? `+${open}` : 'Full'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── Pending Actions ── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2.5">
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(232,72,85,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={14} strokeWidth={2} style={{ color: '#E84855' }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Pending Actions</span>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 20, height: 20, borderRadius: 99,
                  background: 'rgba(232,72,85,0.10)', color: '#E84855', fontSize: 11, fontWeight: 700,
                }}>
                  {PENDING_ACTIONS.reduce((s, a) => s + a.count, 0)}
                </span>
              </div>
              <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>Requires your attention</span>
            </div>

            <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {PENDING_ACTIONS.map(action => {
                const AIcon = action.Icon
                return (
                  <div
                    key={action.id}
                    className="flex items-center justify-between"
                    style={{ padding: '14px 16px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12 }}
                  >
                    <div className="flex items-center gap-3">
                      <div style={{
                        width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                        background: C.hover, border: `1px solid ${C.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <AIcon size={16} strokeWidth={1.8} style={{ color: C.muted }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{action.label}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span style={{ fontSize: 12, color: C.muted }}>
                            <span style={{ fontWeight: 700, color: C.navy }}>{action.count}</span> pending
                          </span>
                          {action.overdue > 0 && (
                            <span style={{ fontSize: 11, fontWeight: 600, color: '#E84855', background: 'rgba(232,72,85,0.10)', borderRadius: 5, padding: '1px 6px' }}>
                              {action.overdue} overdue
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate(action.navId)}
                      className="review-btn flex items-center gap-1.5 rounded-lg border-none cursor-pointer font-semibold"
                      style={{
                        padding: '7px 13px', fontSize: 12,
                        background: C.hover, color: '#3D4266',
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      Review <ChevronRight size={13} strokeWidth={2.2} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* ════════════ RIGHT COLUMN ════════════ */}
        <div className="flex flex-col gap-5">

          {/* ── Quick Actions ── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            <div className="flex items-center gap-2.5" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(242,208,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={14} strokeWidth={2} style={{ color: '#D4A800' }} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Quick Actions</span>
            </div>

            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {QUICK_ACTIONS.map(qa => {
                const QIcon = qa.Icon
                return (
                  <button
                    key={qa.id}
                    onClick={() => onNavigate(qa.id)}
                    className="qa-row w-full flex items-center gap-3 rounded-xl border-none"
                    style={{
                      padding: '12px 14px', textAlign: 'left',
                      background: 'transparent', border: 'none',
                    }}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: C.hover, border: `1px solid ${C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <QIcon size={16} strokeWidth={1.8} style={{ color: C.muted }} />
                    </div>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: C.navy }}>{qa.label}</span>
                    <ChevronRight size={14} strokeWidth={2} style={{ color: C.muted, flexShrink: 0 }} />
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Leave Overview ── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2.5">
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(217,119,6,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarDays size={14} strokeWidth={2} style={{ color: '#D97706' }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Leave Overview</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#D97706', background: 'rgba(217,119,6,0.09)', borderRadius: 99, padding: '3px 10px', border: '1px solid rgba(217,119,6,0.18)' }}>
                This Month
              </span>
            </div>

            <div style={{ padding: '18px 20px' }}>

              {/* On leave number */}
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: '#D97706', letterSpacing: '-1.5px', lineHeight: 1 }}>12</span>
                <div style={{ fontSize: 12, color: C.muted, fontWeight: 500, marginTop: 5 }}>employees on leave today</div>
              </div>

              {/* Status breakdown */}
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Pending',  count: LEAVE_OVERVIEW.pending,  color: '#E84855' },
                  { label: 'Approved', count: LEAVE_OVERVIEW.approved, color: '#0EA86A' },
                  { label: 'Rejected', count: LEAVE_OVERVIEW.rejected, color: '#8B90A7' },
                ].map(({ label, count, color }) => {
                  const pct = Math.round((count / LEAVE_OVERVIEW.total) * 100)
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                          <span style={{ fontSize: 12, fontWeight: 500, color: '#5A6080' }}>{label}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color }}>{count}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, background: '#F0F2F8', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: color, transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                onClick={() => onNavigate('all-leave-requests')}
                className="review-btn w-full flex items-center justify-center gap-2 rounded-xl border-none cursor-pointer font-semibold"
                style={{
                  marginTop: 18, height: 40, fontSize: 13,
                  background: C.hover, color: '#3D4266',
                  border: `1px solid ${C.border}`,
                }}
              >
                View All Requests <ChevronRight size={14} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* ── Recent Activity ── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            <div className="flex items-center justify-between" style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2.5">
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(99,102,241,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={14} strokeWidth={2} style={{ color: '#6366F1' }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Recent Activity</span>
              </div>
              <button
                style={{ fontSize: 12, fontWeight: 600, color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'underline' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.textDecoration = 'none' }}
              >
                View all <ArrowUpRight size={13} strokeWidth={2.2} />
              </button>
            </div>

            <div style={{ padding: '10px 10px' }}>
              {RECENT_ACTIVITY.map((item, idx) => {
                const AIcon = item.Icon
                const isLast = idx === RECENT_ACTIVITY.length - 1
                return (
                  <div key={item.id} className="activity-row flex items-start gap-3">
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: item.bg, flexShrink: 0, marginTop: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <AIcon size={15} strokeWidth={1.8} style={{ color: item.color }} />
                    </div>
                    <div
                      className="flex-1 min-w-0"
                      style={{
                        paddingBottom: isLast ? 0 : 12,
                        marginBottom:  isLast ? 0 : 12,
                        borderBottom:  isLast ? 'none' : `1px solid ${C.border}`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, lineHeight: 1.35 }}>{item.title}</div>
                          <div style={{ fontSize: 12, color: '#5A6080', marginTop: 2, fontWeight: 450 }}>{item.desc}</div>
                        </div>
                        <span style={{ fontSize: 11, color: C.muted, fontWeight: 500, flexShrink: 0, marginTop: 2 }}>{item.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
