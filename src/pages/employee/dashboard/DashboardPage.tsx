import { useState, useEffect } from 'react'
import {
  Briefcase, Clock, CalendarDays, Ticket, Megaphone,
  ChevronDown, X, Shield, FileText, FolderOpen, ExternalLink,
} from 'lucide-react'

interface DashboardPageProps {
  managerMode?: boolean
  onNavigateTeam?: (id: string) => void
}

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

const STATS = [
  { label: 'Pending Timesheets', count: 3,  sub: 'submissions due',    Icon: Clock,         color: '#6366F1', bg: 'rgba(99,102,241,0.09)',  border: 'rgba(99,102,241,0.15)'  },
  { label: 'Leave Balance',      count: 12, sub: 'days remaining',     Icon: CalendarDays,  color: '#0EA86A', bg: 'rgba(14,168,106,0.09)',  border: 'rgba(14,168,106,0.15)'  },
  { label: 'Open Tickets',       count: 2,  sub: 'awaiting response',  Icon: Ticket,        color: '#E84855', bg: 'rgba(232,72,85,0.09)',   border: 'rgba(232,72,85,0.15)'   },
  { label: 'New Announcements',  count: 3,  sub: 'unread today',       Icon: Megaphone,     color: '#7C3AED', bg: 'rgba(124,58,237,0.09)',  border: 'rgba(124,58,237,0.15)'  },
]

const BIRTHDAYS = [
  { id: 1, name: 'Sarah Johnson', date: 'May 20', img: 47 },
  { id: 2, name: 'Mike Chen',     date: 'May 21', img: 33 },
  { id: 3, name: 'Emma Wilson',   date: 'May 22', img: 44 },
  { id: 4, name: 'David Brown',   date: 'May 23', img: 38 },
  { id: 5, name: 'Lisa Garcia',   date: 'May 24', img: 25 },
  { id: 6, name: 'Tom Davis',     date: 'May 25', img: 20 },
]
const BD_PER_PAGE  = 3
const BD_PAGES     = Math.ceil(BIRTHDAYS.length / BD_PER_PAGE)

const UPCOMING_BIRTHDAYS = [
  { name: 'Alex Turner',  code: 'EMP-042', date: 'May 26', color: '#6366F1' },
  { name: 'Priya Sharma', code: 'EMP-017', date: 'May 28', color: '#0EA86A' },
  { name: 'James Wilson', code: 'EMP-063', date: 'Jun 02', color: '#E84855' },
  { name: 'Nina Patel',   code: 'EMP-091', date: 'Jun 05', color: '#C49A00' },
]

const INITIAL_ALERTS = [
  { id: 1, message: 'Your timesheet for this week has been approved.',         dot: '#10B981' },
  { id: 2, message: 'Salary slip for April 2026 has been generated.',          dot: '#6366F1' },
  { id: 3, message: 'You have been assigned to a new project: Pulse.AI v2.',   dot: '#8B5CF6' },
  { id: 4, message: 'Your leave request from May 22–24 has been approved.',    dot: '#0EA86A' },
  { id: 5, message: 'A new company remote work policy has been published.',     dot: '#C49A00' },
]

const PAGE_SIZES = [5, 10, 25]

const ATT_RADIUS = 46
const ATT_CIRC   = 2 * Math.PI * ATT_RADIUS

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_ABBR    = ['Su','Mo','Tu','We','Th','Fr','Sa']

/* Dummy already-marked times for a Present day */
const MARKED_IN  = '09:15'
const MARKED_OUT = '18:30'

/* Yesterday — highlighted red (Absent) to demonstrate the Attendance Submission flow */
const _yest = new Date(); _yest.setDate(_yest.getDate() - 1)
const YESTERDAY_KEY = `${_yest.getFullYear()}-${_yest.getMonth() + 1}-${_yest.getDate()}`

const SPECIAL_STATUS: Record<string, 'absent' | 'submitted'> = {
  '2026-5-8':  'absent',
  '2026-5-15': 'absent',
  '2026-5-11': 'submitted',
  '2026-5-12': 'submitted',
  [YESTERDAY_KEY]: 'absent',
}

function getDayStatus(year: number, month: number, day: number): 'present' | 'absent' | 'holiday' | 'submitted' | 'today' | 'future' {
  const key          = `${year}-${month + 1}-${day}`
  const dow          = new Date(year, month, day).getDay()
  const todayMid     = new Date(); todayMid.setHours(0,0,0,0)
  const dateMid      = new Date(year, month, day)
  if (SPECIAL_STATUS[key])                               return SPECIAL_STATUS[key]
  if (dow === 0 || dow === 6)                            return 'holiday'
  if (dateMid.getTime() === todayMid.getTime())          return 'today'
  if (dateMid < todayMid)                                return 'present'
  return 'future'
}

const CAL_COLORS = {
  present:   { bg: 'rgba(14,168,106,0.12)',  color: '#0A8A58', fw: 600 },
  absent:    { bg: 'rgba(232,72,85,0.12)',   color: '#E84855', fw: 600 },
  holiday:   { bg: 'rgba(99,102,241,0.12)',  color: '#5B5FDE', fw: 600 },
  submitted: { bg: 'rgba(160,160,180,0.16)', color: '#8B90A7', fw: 600 },
  today:     { bg: 'rgba(14,168,106,0.22)',   color: '#076644', fw: 700 },
  future:    { bg: 'transparent',            color: '#C0C4D6', fw: 400 },
}

const CAL_LEGEND = [
  { label: 'WO / CH',            color: '#5B5FDE', bg: 'rgba(99,102,241,0.12)'  },
  { label: 'Leave',              color: '#D97706', bg: 'rgba(245,158,11,0.12)'  },
  { label: 'Multiple Status',    color: '#7C3AED', bg: 'rgba(139,92,246,0.12)'  },
  { label: 'Absent',             color: '#E84855', bg: 'rgba(232,72,85,0.12)'   },
  { label: 'Present',            color: '#0A8A58', bg: 'rgba(14,168,106,0.12)'  },
  { label: 'Submitted Requests', color: '#8B90A7', bg: 'rgba(160,160,180,0.16)' },
]

const TEAM_STATUS = [
  { id: 1, message: 'John Doe is on planned leave today.',                         badge: 'Planned Leave',   dot: '#6366F1', badgeBg: 'rgba(99,102,241,0.09)',  badgeColor: '#6366F1' },
  { id: 2, message: 'David Brown is on unplanned leave.',                          badge: 'Unplanned Leave', dot: '#E84855', badgeBg: 'rgba(232,72,85,0.09)',   badgeColor: '#E84855' },
  { id: 3, message: 'Sarah Johnson is on leave from May 22 – May 24.',            badge: 'Planned Leave',   dot: '#6366F1', badgeBg: 'rgba(99,102,241,0.09)',  badgeColor: '#6366F1' },
  { id: 4, message: 'Mike Chen is working from home today.',                       badge: 'Work From Home',  dot: '#0EA86A', badgeBg: 'rgba(14,168,106,0.09)', badgeColor: '#0EA86A' },
  { id: 5, message: 'Emma Wilson is unavailable — in client meetings all day.',    badge: 'Busy',            dot: '#C49A00', badgeBg: 'rgba(212,168,0,0.10)',   badgeColor: '#C49A00' },
]

const HOL_UPCOMING = [
  { name: 'Ganesh Chaturthi / Vinayagar Chaturthi', date: '27/08/2026', day: 'Thursday', type: 'C' },
  { name: 'Gandhi Jayanti',                          date: '02/10/2026', day: 'Friday',   type: 'C' },
  { name: 'Dussehra',                                date: '20/10/2026', day: 'Tuesday',  type: 'C' },
  { name: 'Diwali',                                  date: '09/11/2026', day: 'Monday',   type: 'C' },
  { name: 'Christmas',                               date: '25/12/2026', day: 'Friday',   type: 'C' },
]
const HOL_PAST = [
  { name: 'New Year',      date: '01/01/2026', day: 'Thursday', type: 'C' },
  { name: 'Republic Day',  date: '26/01/2026', day: 'Monday',   type: 'C' },
  { name: 'Holi',          date: '06/03/2026', day: 'Friday',   type: 'R' },
  { name: 'Ram Navami',    date: '29/03/2026', day: 'Sunday',   type: 'C' },
  { name: 'Eid Al-Fitr',   date: '31/03/2026', day: 'Tuesday',  type: 'C' },
]

const COMPANY_POLICIES = [
  { id: 'cc_nda',        label: 'CC_NDA',               type: 'file' as const },
  { id: 'emp_agreement', label: 'Employee Agreement',    type: 'file' as const },
  {
    id: 'cidc_policies', label: 'CIDC Policy Documents', type: 'folder' as const,
    children: [
      { id: 'emp_handbook',    label: 'CIDC Employee Handbook'            },
      { id: 'it_policy',       label: 'CIDC IT Policy'                    },
      { id: 'leave_policy',    label: 'CIDC Leave Policy'                 },
      { id: 'posh_policy',     label: 'CIDC POSH Policy'                  },
      { id: 'general_policy',  label: 'CIDC General Policies & Guidelines'},
    ],
  },
]

const C = {
  navy:   '#1C2035',
  border: '#E8EAF2',
  muted:  '#8B90A7',
  hover:  '#F0F2F8',
}

export default function DashboardPage({ managerMode = false }: DashboardPageProps = {}) {
  const [alertsOpen, setAlertsOpen]     = useState(true)
  const [alerts, setAlerts]             = useState(INITIAL_ALERTS)
  const [pageSize, setPageSize]         = useState(5)
  const [birthdayOpen, setBirthdayOpen]   = useState(true)
  const [bdPage, setBdPage]               = useState(0)
  const [teamStatusOpen, setTeamStatusOpen] = useState(true)
  const [now, setNow]                       = useState(new Date())
  const [calYear,  setCalYear]              = useState(new Date().getFullYear())
  const [calMonth, setCalMonth]             = useState(new Date().getMonth())
  const [holTab,   setHolTab]               = useState<'upcoming' | 'past'>('upcoming')
  const [holRows,  setHolRows]              = useState(5)
  const [policyExpanded, setPolicyExpanded] = useState<string[]>(['cidc_policies'])
  const [selectedPolicy, setSelectedPolicy] = useState<string>('cidc_policies')

  /* ── Attendance Submission popup ── */
  const [attDate,       setAttDate]       = useState<{ year: number; month: number; day: number } | null>(null)
  const [attMode,       setAttMode]       = useState<'absent' | 'present'>('absent')
  const [attEdit,       setAttEdit]       = useState(false)
  const [reqIn,         setReqIn]         = useState('')
  const [reqOut,        setReqOut]        = useState('')
  const [remarks,       setRemarks]       = useState('')
  const [attSubmitting, setAttSubmitting] = useState(false)
  const [attToast,      setAttToast]      = useState<string | null>(null)
  const [submittedDates, setSubmittedDates] = useState<Set<string>>(new Set())

  function openAtt(year: number, month: number, day: number, mode: 'absent' | 'present') {
    setAttDate({ year, month, day }); setAttMode(mode); setAttEdit(false)
    if (mode === 'present') { setReqIn(MARKED_IN); setReqOut(MARKED_OUT) }
    else                    { setReqIn(''); setReqOut('') }
    setRemarks('')
  }
  function closeAtt() {
    if (attSubmitting) return
    setAttDate(null)
  }
  async function submitAtt() {
    if (!reqIn || !attDate || attSubmitting) return
    const key      = `${attDate.year}-${attDate.month + 1}-${attDate.day}`
    const isUpdate = attMode === 'present'
    setAttSubmitting(true)
    await new Promise(r => setTimeout(r, 900))
    if (!isUpdate) setSubmittedDates(prev => new Set(prev).add(key))
    setAttSubmitting(false); setAttDate(null); setAttEdit(false)
    setAttToast(isUpdate ? 'Attendance update request submitted successfully' : 'Attendance correction request submitted successfully')
    setTimeout(() => setAttToast(null), 3800)
  }

  const attDateLabel = attDate
    ? new Date(attDate.year, attDate.month, attDate.day).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : ''

  function calPrev() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
  }
  function calNext() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
  }
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  function dismiss(id: number) {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-7px); }
        }
        .icon-float { animation: iconFloat 4s ease-in-out infinite; }
        .stat-card  { transition: box-shadow 0.18s ease, transform 0.18s ease; }
        .stat-card:hover { box-shadow: 0 4px 20px rgba(28,32,53,0.08); transform: translateY(-1px); }
        .alert-dismiss { opacity: 0; transition: opacity 0.15s; }
        .alert-row:hover .alert-dismiss { opacity: 1; }
        .att-absent { transition: filter 0.14s; }
        .att-absent:hover { filter: brightness(0.95); }
        .att-present { transition: filter 0.14s; }
        .att-present:hover { filter: brightness(0.96); }
        @keyframes asModal { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }
        @keyframes asToast { 0%{opacity:0;transform:translateY(8px)} 10%{opacity:1;transform:translateY(0)} 88%{opacity:1} 100%{opacity:0} }
        @keyframes asSpin  { to { transform: rotate(360deg) } }
      `}</style>

      {/* ── Welcome banner ── */}
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 pr-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-3 text-xs font-semibold"
            style={{ background: 'rgba(212,168,0,0.13)', border: '1px solid rgba(212,168,0,0.2)', color: '#A07800' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#D4A800' }} />
            {getDate()}
          </div>
          <h2 className="font-bold leading-tight mb-2" style={{ fontSize: 26, color: C.navy }}>
            {getGreeting()},{' '}
            <span style={{ color: '#C49A00' }}>John!</span>{'  '}
            <span style={{ fontSize: 24 }}>👋</span>
          </h2>
          <p className="leading-relaxed w-full" style={{ fontSize: 14, color: '#787878', lineHeight: 1.65 }}>
            Welcome back to your workspace. Stay on top of your tasks, timesheets,
            and upcoming leave requests — everything you need, all in one place.
          </p>
        </div>
        <div className="flex-shrink-0">
          <div
            className="flex items-center justify-center rounded-2xl"
            style={{
              width: 84, height: 84,
              backgroundColor: 'rgba(242,208,0,0.08)',
              backgroundImage: 'radial-gradient(circle, rgba(212,168,0,0.28) 1px, transparent 1px)',
              backgroundSize: '8px 8px',
              border: '1px solid rgba(212,168,0,0.18)',
            }}
          >
            <div className="icon-float">
              <Briefcase size={34} strokeWidth={1.5} style={{ color: '#A07800' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 7 / 5 grid ── */}
      <div className="grid gap-5 mt-7" style={{ gridTemplateColumns: '7fr 5fr', alignItems: 'start' }}>

        {/* ── Left column ── */}
        <div className="flex flex-col gap-5">

          {/* Stats */}
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {(managerMode ? STATS.filter(s => s.label !== 'New Announcements' && s.label !== 'Open Tickets') : STATS).map(({ label, count, sub, Icon, color, bg, border }) => (
              <div
                key={label}
                className="stat-card"
                style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 22px 20px', cursor: 'default' }}
              >
                <div className="flex items-start justify-between mb-5">
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#5A6080', lineHeight: 1.4, maxWidth: 110 }}>
                    {label}
                  </span>
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{ width: 40, height: 40, borderRadius: 11, background: bg, border: `1px solid ${border}` }}
                  >
                    <Icon size={18} style={{ color }} strokeWidth={1.8} />
                  </div>
                </div>
                <div style={{ fontSize: 34, fontWeight: 700, color: C.navy, lineHeight: 1, letterSpacing: '-0.5px' }}>
                  {count}
                </div>
                <div style={{ fontSize: 12, color: '#B0B4C8', marginTop: 6, fontWeight: 500 }}>{sub}</div>
                <div style={{ height: 3, borderRadius: 99, background: bg, marginTop: 16, border: `1px solid ${border}` }} />
              </div>
            ))}
          </div>

          {/* ── Team Stats (manager only) ── */}
          {managerMode && (
            <div>
              {/* Section header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Team Stats</span>
                {/* View All hidden for now
                <button
                  onClick={() => onNavigateTeam?.('team-dashboard')}
                  style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: '#6366F1', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  View All <ChevronRight size={13} strokeWidth={2.5} />
                </button>
                */}
              </div>

              {/* 2 stat cards */}
              <div className="grid grid-cols-2 gap-4">
                {/* Team Pending Timesheets */}
                <div
                  className="stat-card"
                  style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 22px 20px', cursor: 'default' }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#5A6080', lineHeight: 1.4, maxWidth: 110 }}>
                      Team Pending Timesheets
                    </span>
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(99,102,241,0.09)', border: '1px solid rgba(99,102,241,0.15)' }}
                    >
                      <Clock size={18} style={{ color: '#6366F1' }} strokeWidth={1.8} />
                    </div>
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 700, color: C.navy, lineHeight: 1, letterSpacing: '-0.5px' }}>6</div>
                  <div style={{ fontSize: 12, color: '#B0B4C8', marginTop: 6, fontWeight: 500 }}>awaiting review</div>
                  <div style={{ height: 3, borderRadius: 99, background: 'rgba(99,102,241,0.09)', marginTop: 16, border: '1px solid rgba(99,102,241,0.15)' }} />
                </div>

                {/* Pending Team Leave Approvals */}
                <div
                  className="stat-card"
                  style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 22px 20px', cursor: 'default' }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#5A6080', lineHeight: 1.4, maxWidth: 110 }}>
                      Pending Team Leave Approvals
                    </span>
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(217,119,6,0.09)', border: '1px solid rgba(217,119,6,0.15)' }}
                    >
                      <CalendarDays size={18} style={{ color: '#D97706' }} strokeWidth={1.8} />
                    </div>
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 700, color: C.navy, lineHeight: 1, letterSpacing: '-0.5px' }}>3</div>
                  <div style={{ fontSize: 12, color: '#B0B4C8', marginTop: 6, fontWeight: 500 }}>pending approval</div>
                  <div style={{ height: 3, borderRadius: 99, background: 'rgba(217,119,6,0.09)', marginTop: 16, border: '1px solid rgba(217,119,6,0.15)' }} />
                </div>

                {/* Open Team Request Tickets — hidden for now
                <div
                  className="stat-card"
                  style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 22px 20px', cursor: 'default' }}
                >
                  <div className="flex items-start justify-between mb-5">
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#5A6080', lineHeight: 1.4, maxWidth: 120 }}>
                      Open Team Request Tickets
                    </span>
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(232,72,85,0.09)', border: '1px solid rgba(232,72,85,0.15)' }}
                    >
                      <Ticket size={18} style={{ color: '#E84855' }} strokeWidth={1.8} />
                    </div>
                  </div>
                  <div style={{ fontSize: 34, fontWeight: 700, color: C.navy, lineHeight: 1, letterSpacing: '-0.5px' }}>4</div>
                  <div style={{ fontSize: 12, color: '#B0B4C8', marginTop: 6, fontWeight: 500 }}>awaiting response</div>
                  <div style={{ height: 3, borderRadius: 99, background: 'rgba(232,72,85,0.09)', marginTop: 16, border: '1px solid rgba(232,72,85,0.15)' }} />
                </div>
                */}
              </div>
            </div>
          )}

          {/* ── Alerts section ── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{ padding: '14px 20px', borderBottom: alertsOpen ? `1px solid ${C.border}` : 'none' }}
            >
              <div className="flex items-center gap-2.5">
                <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Alerts</span>
                {alerts.length > 0 && (
                  <span
                    className="flex items-center justify-center rounded-full text-xs font-bold"
                    style={{ width: 20, height: 20, background: 'rgba(232,72,85,0.10)', color: '#E84855', fontSize: 11 }}
                  >
                    {alerts.length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {/* Accordion toggle */}
                <button
                  title={alertsOpen ? 'Collapse' : 'Expand'}
                  onClick={() => setAlertsOpen(p => !p)}
                  className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-colors duration-150"
                  style={{ width: 30, height: 30, background: C.hover, color: C.muted }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.hover;   e.currentTarget.style.color = C.muted }}
                >
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    style={{ transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)', transform: alertsOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                  />
                </button>
              </div>
            </div>

            {/* Collapsible body */}
            <div
              style={{
                overflow: 'hidden',
                maxHeight: alertsOpen ? 600 : 0,
                transition: 'max-height 0.26s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              {/* Alert list */}
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {alerts.slice(0, pageSize).map(alert => (
                  <div
                    key={alert.id}
                    className="alert-row flex items-center justify-between"
                    style={{
                      background: '#F7F8FC',
                      border: '1px solid #ECEEF5',
                      borderRadius: 10,
                      padding: '11px 14px',
                      gap: 12,
                    }}
                  >
                    {/* Left: dot + message */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="flex-shrink-0 rounded-full"
                        style={{ width: 7, height: 7, background: alert.dot }}
                      />
                      <span
                        className="truncate"
                        style={{ fontSize: 13, color: '#3D4266', fontWeight: 450, lineHeight: 1.45 }}
                      >
                        {alert.message}
                      </span>
                    </div>

                    {/* Right: dismiss */}
                    <button
                      className="flex items-center justify-center flex-shrink-0 rounded-lg border-none cursor-pointer"
                      onClick={() => dismiss(alert.id)}
                      style={{ width: 28, height: 28, background: 'transparent', color: '#E84855' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.10)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <X size={15} strokeWidth={2.2} />
                    </button>
                  </div>
                ))}

                {alerts.length === 0 && (
                  <div className="flex items-center justify-center py-4">
                    <span style={{ fontSize: 13, color: '#B0B4C8' }}>No alerts</span>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div
                className="flex items-center gap-1.5"
                style={{ padding: '0 16px 14px' }}
              >
                <span style={{ fontSize: 12, color: C.muted, marginRight: 4 }}>Show:</span>
                {PAGE_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => setPageSize(size)}
                    className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-colors duration-150"
                    style={{
                      width: 34, height: 28,
                      fontSize: 12,
                      fontWeight: 600,
                      background: pageSize === size ? '#E4E6EF' : C.hover,
                      color:      pageSize === size ? C.navy    : C.muted,
                    }}
                    onMouseEnter={e => { if (pageSize !== size) { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy } }}
                    onMouseLeave={e => { if (pageSize !== size) { e.currentTarget.style.background = C.hover;   e.currentTarget.style.color = C.muted } }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Birthday Wishes ── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{ padding: '14px 20px', borderBottom: birthdayOpen ? `1px solid ${C.border}` : 'none' }}
            >
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 16, lineHeight: 1 }}>🎂</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Birthday Wishes</span>
              </div>
              <button
                title={birthdayOpen ? 'Collapse' : 'Expand'}
                onClick={() => setBirthdayOpen(p => !p)}
                className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-colors duration-150"
                style={{ width: 30, height: 30, background: C.hover, color: C.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.background = C.hover;   e.currentTarget.style.color = C.muted }}
              >
                <ChevronDown
                  size={14} strokeWidth={2}
                  style={{ transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)', transform: birthdayOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                />
              </button>
            </div>

            {/* Collapsible body */}
            <div style={{ overflow: 'hidden', maxHeight: birthdayOpen ? 800 : 0, transition: 'max-height 0.26s cubic-bezier(0.4,0,0.2,1)' }}>

              {/* Centered wish quote */}
              <div
                className="text-center"
                style={{
                  margin: '14px 16px 4px',
                  padding: '12px 20px',
                  background: 'rgba(212,168,0,0.07)',
                  border: '1px solid rgba(212,168,0,0.15)',
                  borderRadius: 10,
                }}
              >
                <p style={{ fontSize: 14, color: '#8B90A7', lineHeight: 1.65, fontStyle: 'italic', margin: 0 }}>
                  Wishing our teammates a wonderful birthday filled with joy and happiness.
                  <br />
                  May this special day bring you all the love and success you deserve! 🎉
                </p>
              </div>

              {/* 3-column grid */}
              <div
                className="grid grid-cols-3 gap-4"
                style={{ padding: '14px 16px 12px' }}
              >
                {BIRTHDAYS.slice(bdPage * BD_PER_PAGE, (bdPage + 1) * BD_PER_PAGE).map(user => (
                  <div
                    key={user.id}
                    className="flex flex-col items-center text-center"
                    style={{ padding: '10px 8px' }}
                  >
                    <img
                      src={`https://i.pravatar.cc/150?img=${user.img}`}
                      alt={user.name}
                      className="rounded-full object-cover flex-shrink-0"
                      style={{ width: 54, height: 54, border: '2.5px solid #E8EAF2' }}
                    />
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginTop: 10, lineHeight: 1.3 }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 4, fontWeight: 500 }}>
                      {user.date}
                    </div>
                  </div>
                ))}
              </div>

              {/* Dot indicators */}
              <div className="flex items-center justify-center gap-1.5" style={{ padding: '4px 16px 12px' }}>
                {Array.from({ length: BD_PAGES }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setBdPage(i)}
                    style={{
                      width:      i === bdPage ? 20 : 6,
                      height:     6,
                      borderRadius: 99,
                      background: i === bdPage ? C.navy : '#D0D3E4',
                      border:     'none',
                      cursor:     'pointer',
                      padding:    0,
                      transition: 'width 0.22s cubic-bezier(0.4,0,0.2,1), background 0.2s',
                    }}
                  />
                ))}
              </div>

              {/* ── Upcoming Birthday table ── */}
              <div style={{ margin: '4px 16px 16px' }}>
                {/* Sub-header */}
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>Upcoming Birthday</span>
                  <span
                    className="flex items-center justify-center rounded-full"
                    style={{ width: 18, height: 18, background: 'rgba(99,102,241,0.10)', color: '#6366F1', fontSize: 10, fontWeight: 700 }}
                  >
                    {UPCOMING_BIRTHDAYS.length}
                  </span>
                </div>

                {/* Table card */}
                <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                  {/* Table header */}
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: '2fr 1fr 1fr',
                      background: '#F7F8FC',
                      borderBottom: `1px solid ${C.border}`,
                      padding: '8px 14px',
                    }}
                  >
                    {['Employee', 'Code', 'Date'].map(h => (
                      <span key={h} style={{ fontSize: 11, fontWeight: 600, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Rows */}
                  {UPCOMING_BIRTHDAYS.map((u, idx) => (
                    <div
                      key={u.code}
                      className="grid items-center"
                      style={{
                        gridTemplateColumns: '2fr 1fr 1fr',
                        padding: '13px 14px',
                        borderBottom: idx < UPCOMING_BIRTHDAYS.length - 1 ? `1px solid #F0F2F8` : 'none',
                        background: '#fff',
                        transition: 'background 0.15s',
                        cursor: 'default',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                    >
                      {/* Name */}
                      <span className="truncate" style={{ fontSize: 13, fontWeight: 500, color: '#3D4266' }}>
                        {u.name}
                      </span>

                      {/* Code */}
                      <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{u.code}</span>

                      {/* Date pill */}
                      <div>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: '#8B90A7',
                            background: '#F0F2F8',
                            border: '1px solid #E4E6EF',
                            borderRadius: 6,
                            padding: '3px 8px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {u.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ── Team Member Status ── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            {/* Header */}
            <div
              className="flex items-center justify-between"
              style={{ padding: '14px 20px', borderBottom: teamStatusOpen ? `1px solid ${C.border}` : 'none' }}
            >
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Team Member Status</span>
                <span
                  className="flex items-center justify-center rounded-full"
                  style={{ width: 20, height: 20, background: 'rgba(99,102,241,0.10)', color: '#6366F1', fontSize: 11, fontWeight: 700 }}
                >
                  {TEAM_STATUS.length}
                </span>
              </div>
              <button
                title={teamStatusOpen ? 'Collapse' : 'Expand'}
                onClick={() => setTeamStatusOpen(p => !p)}
                className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-colors duration-150"
                style={{ width: 30, height: 30, background: C.hover, color: C.muted }}
                onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.background = C.hover;   e.currentTarget.style.color = C.muted }}
              >
                <ChevronDown
                  size={14} strokeWidth={2}
                  style={{ transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1)', transform: teamStatusOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}
                />
              </button>
            </div>

            {/* Collapsible body */}
            <div style={{ overflow: 'hidden', maxHeight: teamStatusOpen ? 500 : 0, transition: 'max-height 0.26s cubic-bezier(0.4,0,0.2,1)' }}>
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {TEAM_STATUS.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                    style={{
                      background: '#F7F8FC',
                      border: '1px solid #ECEEF5',
                      borderRadius: 10,
                      padding: '11px 14px',
                      gap: 12,
                    }}
                  >
                    {/* Left: dot + message */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="flex-shrink-0 rounded-full"
                        style={{ width: 7, height: 7, background: item.dot }}
                      />
                      <span
                        className="truncate"
                        style={{ fontSize: 13, color: '#3D4266', fontWeight: 450, lineHeight: 1.45 }}
                      >
                        {item.message}
                      </span>
                    </div>

                    {/* Right: status badge */}
                    <span
                      className="flex-shrink-0"
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: item.badgeColor,
                        background: item.badgeBg,
                        border: `1px solid ${item.badgeColor}25`,
                        borderRadius: 6,
                        padding: '3px 8px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ── Right column ── */}
        <div className="flex flex-col gap-5">
        {(() => {
          const inTime      = '9:00 AM'
          const totalHrs    = '05:00'
          const percent     = 50
          const dashOffset  = ATT_CIRC * (1 - percent / 100)
          const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })

          return (
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

              {/* Header */}
              <div
                className="flex items-center justify-between"
                style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}
              >
                <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Attendance</span>
                <span
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: 'rgba(14,168,106,0.09)', color: '#0EA86A', border: '1px solid rgba(14,168,106,0.18)' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#0EA86A' }} />
                  Today
                </span>
              </div>

              {/* Stats 2×2 */}
              <div className="grid grid-cols-2 gap-3" style={{ padding: '16px 16px 0' }}>
                {[
                  { label: 'Current Time', value: currentTime,    valueColor: C.navy    },
                  { label: 'In Time',      value: inTime,         valueColor: '#0EA86A' },
                  { label: 'Out Time',     value: '—',            valueColor: '#B0B4C8' },
                  { label: 'Total Time',   value: totalHrs + ' hrs', valueColor: C.navy },
                ].map(({ label, value, valueColor }) => (
                  <div
                    key={label}
                    style={{ background: '#F7F8FC', border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 14px' }}
                  >
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {label}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: valueColor, letterSpacing: '-0.3px' }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Progress row */}
              <div className="flex items-center gap-5" style={{ padding: '20px 20px 16px' }}>

                {/* SVG circle */}
                <div className="relative flex-shrink-0" style={{ width: 110, height: 110 }}>
                  <svg width="110" height="110" viewBox="0 0 110 110">
                    <defs>
                      <linearGradient id="attGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%"   stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#1C2035" />
                      </linearGradient>
                    </defs>
                    {/* Track */}
                    <circle cx="55" cy="55" r={ATT_RADIUS} fill="none" stroke="#F0F2F8" strokeWidth="8" />
                    {/* Progress */}
                    <circle
                      cx="55" cy="55" r={ATT_RADIUS}
                      fill="none"
                      stroke="url(#attGrad)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={ATT_CIRC}
                      strokeDashoffset={dashOffset}
                      transform="rotate(-90 55 55)"
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                  </svg>
                  {/* Center label */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center"
                    style={{ pointerEvents: 'none' }}
                  >
                    <span style={{ fontSize: 15, fontWeight: 700, color: C.navy, letterSpacing: '-0.3px' }}>
                      {totalHrs}
                    </span>
                    <span style={{ fontSize: 10, color: C.muted, fontWeight: 500, marginTop: 1 }}>hrs</span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-3 flex-1">
                  <div>
                    <span style={{ fontSize: 28, fontWeight: 800, color: C.navy, letterSpacing: '-1px' }}>
                      {percent}%
                    </span>
                    <span style={{ fontSize: 12, color: C.muted, marginLeft: 6, fontWeight: 500 }}>completed</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 12, color: C.muted, fontWeight: 500, minWidth: 68 }}>Check In:</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#0EA86A' }}>{inTime.toLowerCase()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 12, color: C.muted, fontWeight: 500, minWidth: 68 }}>Check Out:</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#B0B4C8' }}>—</span>
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div style={{ height: 5, borderRadius: 99, background: '#F0F2F8', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${percent}%`, borderRadius: 99, background: 'linear-gradient(90deg, #6366F1, #1C2035)', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              </div>

              {/* Button */}
              <div style={{ padding: '0 16px 16px', marginTop: 12 }}>
                <button
                  className="w-full flex items-center justify-center rounded-xl border-none cursor-pointer font-semibold transition-all duration-150"
                  style={{ height: 44, fontSize: 14, background: 'rgba(14,168,106,0.10)', color: '#0A8A58', letterSpacing: '0.01em' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.18)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(14,168,106,0.12)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(14,168,106,0.10)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  Record Out Time
                </button>
              </div>

            </div>
          )
        })()}

          {/* ── Attendance Calendar ── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            {/* Card header */}
            <div className="flex items-center justify-between" style={{ padding: '15px 20px', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Attendance Calendar</span>
            </div>

            {/* Month nav */}
            <div className="flex items-center justify-between" style={{ padding: '14px 20px 10px' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>
                {MONTH_NAMES[calMonth]} {calYear}
              </span>
              <div className="flex items-center gap-1">
                {[{ fn: calPrev, icon: '‹' }, { fn: calNext, icon: '›' }].map(({ fn, icon }) => (
                  <button
                    key={icon}
                    onClick={fn}
                    className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-colors duration-150"
                    style={{ width: 28, height: 28, background: C.hover, color: C.muted, fontSize: 16, fontWeight: 700 }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy }}
                    onMouseLeave={e => { e.currentTarget.style.background = C.hover;   e.currentTarget.style.color = C.muted }}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div style={{ padding: '0 14px 12px' }}>
              {/* Day headers */}
              <div className="grid grid-cols-7" style={{ marginBottom: 4 }}>
                {DAY_ABBR.map(d => (
                  <div key={d} className="flex items-center justify-center" style={{ height: 26, fontSize: 10, fontWeight: 700, color: '#B0B4C8', letterSpacing: '0.05em' }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Cells */}
              {(() => {
                const firstDay    = new Date(calYear, calMonth, 1).getDay()
                const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
                const cells: (number | null)[] = []
                for (let i = 0; i < firstDay; i++)  cells.push(null)
                for (let d = 1; d <= daysInMonth; d++) cells.push(d)
                while (cells.length % 7 !== 0)       cells.push(null)

                return (
                  <div className="grid grid-cols-7 gap-x-1.5 gap-y-2.5">
                    {cells.map((day, idx) => {
                      if (!day) return <div key={`e-${idx}`} />
                      const key       = `${calYear}-${calMonth + 1}-${day}`
                      const status    = submittedDates.has(key) ? 'submitted' : getDayStatus(calYear, calMonth, day)
                      const s         = CAL_COLORS[status]
                      const isAbsent  = status === 'absent'
                      const isPresent = status === 'present' || status === 'today'
                      const clickable = isAbsent || isPresent
                      return (
                        <div
                          key={day}
                          onClick={isAbsent ? () => openAtt(calYear, calMonth, day, 'absent') : isPresent ? () => openAtt(calYear, calMonth, day, 'present') : undefined}
                          title={isAbsent ? 'Absent — click to submit attendance correction' : isPresent ? 'Present — click to view / update attendance' : undefined}
                          className={`flex items-center justify-center rounded-lg${isAbsent ? ' att-absent' : isPresent ? ' att-present' : ''}`}
                          style={{ height: 36, background: s.bg, color: s.color, fontSize: 12, fontWeight: s.fw, cursor: clickable ? 'pointer' : 'default' }}
                        >
                          {day}
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>

            {/* Legend */}
            <div style={{ padding: '10px 14px 14px', borderTop: `1px solid ${C.border}` }}>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {CAL_LEGEND.map(({ label, color, bg }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="flex-shrink-0 rounded" style={{ width: 13, height: 13, background: bg, border: `1px solid ${color}30` }} />
                    <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Holidays, Weekly Offs & Shift ── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            {/* Header */}
            <div className="flex items-center gap-2.5" style={{ padding: '15px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: '#5B5FDE' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Holidays, Weekly Offs &amp; Shift</span>
            </div>

            {/* Next Holiday banner */}
            <div
              style={{
                margin: '16px 16px 0',
                padding: '16px 18px',
                background: 'rgba(99,102,241,0.06)',
                border: '1px solid rgba(99,102,241,0.15)',
                borderRadius: 12,
                borderLeft: '3px solid #6366F1',
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#8B90A7', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>
                    Next Holiday
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, lineHeight: 1.4 }}>
                    Ganesh Chaturthi / Vinayagar Chaturthi
                  </div>
                  <div style={{ fontSize: 12, color: '#5B5FDE', fontWeight: 600, marginTop: 4 }}>
                    27th August (Thursday)
                  </div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#5B5FDE', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, padding: '4px 8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  Compulsory
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2" style={{ padding: '16px 16px 0' }}>
              {(['upcoming', 'past'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setHolTab(tab)}
                  className="flex items-center gap-1.5 rounded-lg border-none cursor-pointer transition-all duration-150"
                  style={{
                    padding: '7px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    background: holTab === tab ? C.navy : C.hover,
                    color:      holTab === tab ? '#fff'  : C.muted,
                  }}
                >
                  {tab === 'upcoming' ? 'Upcoming Holidays' : 'Past Holidays'}
                </button>
              ))}
            </div>

            {/* Table */}
            <div style={{ padding: '12px 16px 0' }}>
              {/* Table header */}
              <div className="grid items-center" style={{ gridTemplateColumns: '1fr 90px 80px', background: '#F7F8FC', borderRadius: 8, padding: '9px 14px', marginBottom: 6 }}>
                {['Holiday', 'Date', 'Day'].map(h => (
                  <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
                ))}
              </div>

              {/* Rows */}
              {(holTab === 'upcoming' ? HOL_UPCOMING : HOL_PAST).slice(0, holRows).map((hol, idx, arr) => (
                <div
                  key={hol.name}
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: '1fr 90px 80px',
                    padding: '12px 14px',
                    borderBottom: idx < arr.length - 1 ? `1px solid #F0F2F8` : 'none',
                    transition: 'background 0.15s',
                    cursor: 'default',
                    borderRadius: 8,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="flex items-center justify-center rounded-full flex-shrink-0 text-xs font-bold"
                      style={{
                        width: 24, height: 24,
                        background: hol.type === 'C' ? 'rgba(99,102,241,0.12)'  : 'rgba(245,158,11,0.12)',
                        color:      hol.type === 'C' ? '#5B5FDE' : '#D97706',
                        fontSize: 10,
                      }}
                    >
                      {hol.type}
                    </span>
                    <span className="truncate" style={{ fontSize: 12, fontWeight: 500, color: '#3D4266' }}>{hol.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{hol.date}</span>
                  <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{hol.day}</span>
                </div>
              ))}
            </div>

            {/* Rows control */}
            <div className="flex items-center justify-between" style={{ padding: '14px 16px', borderTop: `1px solid ${C.border}`, marginTop: 8 }}>
              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>Rows:</span>
                {[5, 10, 25].map(n => (
                  <button
                    key={n}
                    onClick={() => setHolRows(n)}
                    className="flex items-center justify-center rounded-lg border-none cursor-pointer transition-colors duration-150"
                    style={{ width: 30, height: 26, fontSize: 11, fontWeight: 600, background: holRows === n ? '#E4E6EF' : C.hover, color: holRows === n ? C.navy : C.muted }}
                    onMouseEnter={e => { if (holRows !== n) { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy } }}
                    onMouseLeave={e => { if (holRows !== n) { e.currentTarget.style.background = C.hover;   e.currentTarget.style.color = C.muted } }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <span
                className="flex items-center justify-center rounded-full text-xs font-bold"
                style={{ width: 26, height: 26, background: 'rgba(99,102,241,0.12)', color: '#5B5FDE' }}
              >
                1
              </span>
            </div>

            {/* Footer: legend + weekly offs + shift */}
            <div style={{ padding: '14px 16px 18px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Type legend */}
              <div className="flex items-center gap-4">
                {[{ type: 'C', label: 'Compulsory Holiday', color: '#5B5FDE', bg: 'rgba(99,102,241,0.12)' },
                  { type: 'R', label: 'Restricted Holiday',  color: '#D97706', bg: 'rgba(245,158,11,0.12)'  }].map(({ type, label, color, bg }) => (
                  <div key={type} className="flex items-center gap-2">
                    <span className="flex items-center justify-center rounded-full text-xs font-bold flex-shrink-0"
                      style={{ width: 20, height: 20, background: bg, color, fontSize: 10 }}>{type}</span>
                    <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Weekly off + shift row */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8B90A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>Weekly Offs: <span style={{ color: '#3D4266', fontWeight: 600 }}>Saturday, Sunday</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8B90A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>
                  </svg>
                  <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>Shift: <span style={{ color: '#3D4266', fontWeight: 600 }}>10:00 AM – 07:00 PM</span></span>
                </div>
              </div>

              {/* Timesheet Entry Time Limit */}
              <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <div style={{ fontSize: 11, color: '#4F46E5', fontWeight: 500, lineHeight: 1.4 }}>
                    <div style={{ fontWeight: 600, color: '#6366F1', marginBottom: 2 }}>Timesheet Entry Time Limit</div>
                    <div>Submit by <strong>11:00 PM</strong> same day • Late until <strong>11:00 AM</strong> next day</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Company Policy ── */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            {/* Header */}
            <div className="flex items-center gap-2.5" style={{ padding: '15px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div
                className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ width: 32, height: 32, background: 'rgba(212,168,0,0.12)', color: '#A07800' }}
              >
                <Shield size={15} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Company Policy</span>
            </div>

            {/* Tree */}
            <div style={{ padding: '12px 14px 16px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              {COMPANY_POLICIES.map(item => {
                const isSelTop  = selectedPolicy === item.id
                const isExpanded = item.type === 'folder' && policyExpanded.includes(item.id)

                return (
                  <div key={item.id}>
                    {/* Top-level row */}
                    <button
                      onClick={() => {
                        if (item.type === 'folder') {
                          setPolicyExpanded(p =>
                            p.includes(item.id) ? p.filter(x => x !== item.id) : [...p, item.id]
                          )
                        }
                        setSelectedPolicy(item.id)
                      }}
                      className="w-full flex items-center gap-2.5 rounded-xl border-none cursor-pointer transition-all duration-150 text-left"
                      style={{
                        padding: '10px 12px',
                        background: isSelTop ? 'rgba(212,168,0,0.13)' : 'transparent',
                        color:      isSelTop ? '#8C6900'              : C.navy,
                      }}
                      onMouseEnter={e => { if (!isSelTop) { e.currentTarget.style.background = C.hover } }}
                      onMouseLeave={e => { if (!isSelTop) { e.currentTarget.style.background = 'transparent' } }}
                    >
                      {item.type === 'folder' ? (
                        <FolderOpen size={15} strokeWidth={1.8} style={{ flexShrink: 0, color: isSelTop ? '#A07800' : '#C49A00' }} />
                      ) : (
                        <FileText size={15} strokeWidth={1.8} style={{ flexShrink: 0, color: isSelTop ? '#A07800' : '#B0B4C8' }} />
                      )}
                      <span style={{ fontSize: 13, fontWeight: item.type === 'folder' ? 700 : 500, flex: 1, lineHeight: 1.3 }}>
                        {item.label}
                      </span>
                      {item.type === 'folder' ? (
                        <ChevronDown
                          size={13}
                          strokeWidth={2.2}
                          style={{
                            flexShrink: 0,
                            opacity: 0.45,
                            transition: 'transform 0.2s',
                            transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                          }}
                        />
                      ) : (
                        <ExternalLink size={12} strokeWidth={1.8} style={{ flexShrink: 0, opacity: 0.3 }} />
                      )}
                    </button>

                    {/* Children */}
                    {item.type === 'folder' && item.children && (
                      <div
                        style={{
                          overflow: 'hidden',
                          maxHeight: isExpanded ? item.children.length * 44 + 6 : 0,
                          transition: 'max-height 0.22s cubic-bezier(0.4,0,0.2,1)',
                        }}
                      >
                        <div
                          style={{
                            marginLeft: 22,
                            paddingLeft: 14,
                            borderLeft: '1px solid #E8EAF2',
                            marginTop: 2,
                            marginBottom: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                          }}
                        >
                          {item.children.map(child => {
                            const isSelChild = selectedPolicy === child.id
                            return (
                              <button
                                key={child.id}
                                onClick={() => setSelectedPolicy(child.id)}
                                className="w-full flex items-center gap-2.5 rounded-lg border-none cursor-pointer transition-all duration-150 text-left"
                                style={{
                                  padding: '8px 10px',
                                  background: isSelChild ? 'rgba(99,102,241,0.09)' : 'transparent',
                                  color:      isSelChild ? '#5B5FDE'               : '#5A6080',
                                }}
                                onMouseEnter={e => {
                                  if (!isSelChild) {
                                    e.currentTarget.style.background = C.hover
                                    e.currentTarget.style.color = C.navy
                                  }
                                }}
                                onMouseLeave={e => {
                                  if (!isSelChild) {
                                    e.currentTarget.style.background = 'transparent'
                                    e.currentTarget.style.color = '#5A6080'
                                  }
                                }}
                              >
                                <FileText
                                  size={13}
                                  strokeWidth={1.8}
                                  style={{ flexShrink: 0, color: isSelChild ? '#5B5FDE' : '#C0C4D6' }}
                                />
                                <span style={{ fontSize: 12.5, fontWeight: 500, flex: 1, lineHeight: 1.3 }}>
                                  {child.label}
                                </span>
                                <ExternalLink
                                  size={11}
                                  strokeWidth={1.8}
                                  style={{ flexShrink: 0, opacity: 0.3 }}
                                />
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div
              className="flex items-center gap-2"
              style={{ padding: '11px 16px 13px', borderTop: `1px solid ${C.border}` }}
            >
              <span
                className="flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: 18, height: 18, background: 'rgba(212,168,0,0.14)' }}
              >
                <Shield size={10} style={{ color: '#A07800' }} strokeWidth={2.2} />
              </span>
              <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>
                Click any document to view or download the policy file.
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* ══ Attendance Submission / Details Modal ══ */}
      {attDate && (() => {
        const isPresent    = attMode === 'present'
        const accent       = isPresent ? '#0A8A58' : '#E84855'
        const accentBg     = isPresent ? 'rgba(14,168,106,0.1)' : 'rgba(232,72,85,0.1)'
        const accentBorder = isPresent ? 'rgba(14,168,106,0.22)' : 'rgba(232,72,85,0.2)'
        const fmt12 = (t: string) => {
          if (!t) return '--'
          const [h, m] = t.split(':').map(Number)
          const ap = h >= 12 ? 'PM' : 'AM'
          const h12 = h % 12 === 0 ? 12 : h % 12
          return `${h12}:${String(m).padStart(2, '0')} ${ap}`
        }
        const timeInput = (val: string, set: (v: string) => void) => (
          <input type="time" value={val} onChange={e => set(e.target.value)}
            style={{ width: '100%', height: 40, padding: '0 12px', borderRadius: 9, border: `1px solid ${C.border}`, fontSize: 13, color: C.navy, background: '#fff', outline: 'none', fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box' }}
            onFocus={e => { e.currentTarget.style.borderColor = '#6366F1' }}
            onBlur={e => { e.currentTarget.style.borderColor = C.border }}
          />
        )
        const infoRows = [
          { label: 'Date',     value: <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{attDateLabel}</span> },
          { label: 'Employee', value: (
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>John Doe</span>
                <span style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace' }}>EMP-0042</span>
              </span>
            ) },
          { label: 'Attendance Status', value: (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>{isPresent ? 'Present' : 'Absent'}</span>
              </span>
            ) },
          { label: 'Marked Time', value: (
              <span style={{ fontSize: 12.5, color: C.muted }}>
                In: <strong style={{ color: C.navy }}>{isPresent ? fmt12(MARKED_IN) : '--'}</strong>&nbsp;&nbsp;·&nbsp;&nbsp;Out: <strong style={{ color: C.navy }}>{isPresent ? fmt12(MARKED_OUT) : '--'}</strong>
              </span>
            ) },
        ]
        return (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
          onClick={e => { if (e.target === e.currentTarget) closeAtt() }}
        >
          <div style={{
            background: '#fff', borderRadius: 22, width: 520, maxWidth: '100%',
            maxHeight: '92vh', display: 'flex', flexDirection: 'column',
            boxShadow: '0 32px 80px rgba(10,12,28,0.2)', overflow: 'hidden',
            animation: 'asModal 0.18s ease',
          }}>
            {/* Header */}
            <div style={{ padding: '18px 22px', borderBottom: `1px solid ${C.border}`, background: '#F7F8FC', display: 'flex', alignItems: 'center', gap: 13 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: accentBg, border: `1px solid ${accentBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CalendarDays size={20} style={{ color: accent }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: C.navy }}>{isPresent ? (attEdit ? 'Update Attendance' : 'Attendance Details') : 'Attendance Submission'}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12.5, color: C.muted }}>{isPresent ? (attEdit ? 'Edit the attendance times and add a remark.' : 'Review and update your attendance for this day.') : 'Request a correction for a day you missed marking attendance.'}</p>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '18px 22px', overflowY: 'auto' }}>
              {/* Read-only info card */}
              <div style={{ borderRadius: 12, background: '#F7F8FC', border: `1px solid ${C.border}`, padding: '4px 14px', marginBottom: 18 }}>
                {infoRows.map((row, i) => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '11px 0', borderTop: i === 0 ? 'none' : `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>{row.label}</span>
                    {row.value}
                  </div>
                ))}
              </div>

              {/* Editable times + Remarks — absent (correction) mode, or present edit mode */}
              {(!isPresent || attEdit) && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: C.muted }}>{isPresent ? 'In Time' : 'Requested In Time'} <span style={{ color: '#E84855' }}>*</span></p>
                      {timeInput(reqIn, setReqIn)}
                    </div>
                    <div>
                      <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: C.muted }}>{isPresent ? 'Out Time' : 'Requested Out Time'}</p>
                      {timeInput(reqOut, setReqOut)}
                    </div>
                  </div>

                  <div>
                    <p style={{ margin: '0 0 6px', fontSize: 11, fontWeight: 600, color: C.muted }}>{isPresent ? 'Remarks' : 'Remarks / Reason'}</p>
                    <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3}
                      placeholder={isPresent ? 'Reason for updating attendance…' : 'Explain why the attendance was missed…'}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 9, border: `1px solid ${C.border}`, fontSize: 13, color: C.navy, background: '#fff', outline: 'none', resize: 'vertical', fontFamily: "'DM Sans',system-ui,sans-serif", boxSizing: 'border-box', lineHeight: 1.5 }}
                      onFocus={e => { e.currentTarget.style.borderColor = '#6366F1' }}
                      onBlur={e => { e.currentTarget.style.borderColor = C.border }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '14px 22px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10 }}>
              <button onClick={closeAtt} disabled={attSubmitting}
                style={{ flex: 1, height: 42, borderRadius: 10, fontSize: 13.5, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: attSubmitting ? 'not-allowed' : 'pointer' }}>
                Cancel
              </button>
              <button
                onClick={() => { if (isPresent && !attEdit) { setAttEdit(true); return } submitAtt() }}
                disabled={!reqIn || attSubmitting}
                style={{
                  flex: 2, height: 42, borderRadius: 10, fontSize: 13.5, fontWeight: 700, border: 'none',
                  background: !reqIn ? C.hover : attSubmitting ? '#818CF8' : '#6366F1',
                  color: !reqIn ? C.muted : '#fff',
                  cursor: !reqIn || attSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                {attSubmitting ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'asSpin 0.75s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Submitting…
                  </>
                ) : (isPresent
                    ? (attEdit ? 'Submit' : 'Update Attendance')
                    : 'Submit Request')}
              </button>
            </div>
          </div>
        </div>
        )
      })()}

      {/* ══ Success Toast ══ */}
      {attToast && (
        <div style={{
          position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)',
          zIndex: 10000, animation: 'asToast 3.8s ease forwards',
          background: C.navy, color: '#fff', borderRadius: 12,
          padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10,
          boxShadow: '0 8px 32px rgba(10,12,28,0.22)', fontFamily: "'DM Sans', system-ui, sans-serif", whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(74,222,128,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
          <span style={{ fontSize: 13.5, fontWeight: 500 }}>{attToast}</span>
        </div>
      )}
    </div>
  )
}
