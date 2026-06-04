import { useState, useRef } from 'react'
import {
  Ticket, Search, X, Eye, ArrowLeft,
  Monitor, FolderOpen, User, Users, Laptop, DollarSign, LayoutGrid,
  CheckCircle, ChevronDown, Send,
  Download, FileText, Paperclip, RefreshCw,
  UserCircle, Calendar, MessageSquare, AlertCircle, Clock,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────────
type Priority = 'Critical' | 'High' | 'Medium' | 'Low'
type TStatus  = 'Open' | 'Pending' | 'Resolved' | 'Closed'
type View     = 'list' | 'detail'

interface TicketComment {
  id: string
  author: string
  role: 'Admin' | 'Employee'
  text: string
  timestamp: string
}

interface AdminTicketRecord {
  id: string
  employee: string
  employeeAvatar: string
  department: string
  category: string
  subject: string
  description: string
  createdDate: string
  priority: Priority
  status: TStatus
  assignedTo: string
  lastUpdated: string
  hasAttachment: boolean
  comments: TicketComment[]
}

// ── Static data ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'All',             label: 'All Tickets',    Icon: LayoutGrid, color: '#5B5FDE', bg: 'rgba(99,102,241,0.10)'  },
  { id: 'System Support',  label: 'System Support', Icon: Monitor,    color: '#3B82F6', bg: 'rgba(59,130,246,0.10)'  },
  { id: 'Project Request', label: 'Project Request',Icon: FolderOpen, color: '#7C3AED', bg: 'rgba(124,58,237,0.10)' },
  { id: 'Personal',        label: 'Personal',       Icon: User,       color: '#0D9488', bg: 'rgba(13,148,136,0.10)'  },
  { id: 'HR Request',      label: 'HR Request',     Icon: Users,      color: '#0EA86A', bg: 'rgba(14,168,106,0.10)'  },
  { id: 'IT Support',      label: 'IT Support',     Icon: Laptop,     color: '#6366F1', bg: 'rgba(99,102,241,0.10)'  },
  { id: 'Finance',         label: 'Finance',        Icon: DollarSign, color: '#D97706', bg: 'rgba(245,158,11,0.10)'  },
] as const

const TICKETS: AdminTicketRecord[] = [
  {
    id: 'TKT-2401', employee: 'Sarah Johnson', employeeAvatar: 'SJ', department: 'Engineering',
    category: 'IT Support', subject: 'Laptop not connecting to corporate VPN',
    description: 'My laptop has been unable to connect to the corporate VPN for the past 3 days. I have tried reinstalling the Cisco AnyConnect client and resetting credentials, but the issue persists. Error code: VPN_AUTH_FAILED. This is blocking access to all internal tools and repositories.',
    createdDate: '2026-05-20', priority: 'High', status: 'Open',
    assignedTo: 'Arjun Menon', lastUpdated: '2026-05-21', hasAttachment: true,
    comments: [],
  },
  {
    id: 'TKT-2398', employee: 'Ravi Kumar', employeeAvatar: 'RK', department: 'HR',
    category: 'HR Request', subject: 'Update emergency contact details in HRMS system',
    description: 'I need to update my emergency contact details in the HRMS portal. My previous contact has changed her phone number and I would also like to add my spouse as a secondary emergency contact. Please assist with updating both entries at the earliest.',
    createdDate: '2026-05-18', priority: 'Medium', status: 'Resolved',
    assignedTo: 'Priya Mehta', lastUpdated: '2026-05-20', hasAttachment: false,
    comments: [
      { id: 'c1', author: 'Priya Mehta', role: 'Admin', text: 'Hi Ravi, I have updated your emergency contacts in the HRMS system. Primary: Anitha Kumar (+91 98765 43210), Secondary: Spouse details added. Please log in and verify the changes.', timestamp: '2026-05-19T10:30:00' },
      { id: 'c2', author: 'Ravi Kumar', role: 'Employee', text: 'Thank you Priya! I verified the changes and everything looks correct.', timestamp: '2026-05-20T09:15:00' },
    ],
  },
  {
    id: 'TKT-2395', employee: 'Meera Pillai', employeeAvatar: 'MP', department: 'Finance',
    category: 'System Support', subject: 'Unable to access HRMS portal — persistent login error',
    description: 'I have been unable to log into the HRMS portal since 16 May 2026. After entering credentials the system shows a loading spinner for approximately 30 seconds and then displays a blank white screen. I have reproduced the issue on Chrome, Firefox and Edge browsers across both my laptop and mobile. Clearing cache and cookies has not resolved it.',
    createdDate: '2026-05-16', priority: 'Critical', status: 'Pending',
    assignedTo: 'Dev Team', lastUpdated: '2026-05-21', hasAttachment: true,
    comments: [
      { id: 'c3', author: 'Admin Support', role: 'Admin', text: 'Hi Meera, we have escalated this to the Dev Team. We identified a session token issue affecting a subset of users. The team is working on a fix — ETA is 22 May EOD.', timestamp: '2026-05-17T14:00:00' },
    ],
  },
  {
    id: 'TKT-2389', employee: 'Deepak Nair', employeeAvatar: 'DN', department: 'Operations',
    category: 'Finance', subject: 'Reimbursement claim for April 2026 not processed',
    description: 'My expense reimbursement claim for April 2026 totalling ₹4,850 (travel and accommodation for the Pune client visit on Apr 12–13) has not been processed. The claim was submitted via the expense portal on April 18 with all receipts attached. Request you to check the status and process the payment at the earliest.',
    createdDate: '2026-05-12', priority: 'High', status: 'Pending',
    assignedTo: 'Sunita Rao', lastUpdated: '2026-05-15', hasAttachment: true,
    comments: [
      { id: 'c4', author: 'Sunita Rao', role: 'Admin', text: 'Hi Deepak, your claim is under review with the Finance team. We require the original receipts to be submitted physically. Please drop them at the Finance desk by 18 May.', timestamp: '2026-05-14T11:20:00' },
    ],
  },
  {
    id: 'TKT-2382', employee: 'Ananya Singh', employeeAvatar: 'AS', department: 'Engineering',
    category: 'Project Request', subject: 'Access request to new project repository — AMS-v3',
    description: 'I have been assigned to the AMS-v3 project starting May 12 but I do not yet have access to the project repository on Bitbucket. The project manager Raj Kumar is aware and has approved the request. Please provision the required read/write access to the AMS-v3 codebase at the earliest so I can begin onboarding tasks.',
    createdDate: '2026-05-09', priority: 'Medium', status: 'Open',
    assignedTo: 'Raj Kumar', lastUpdated: '2026-05-09', hasAttachment: false,
    comments: [],
  },
  {
    id: 'TKT-2375', employee: 'Vikram Sharma', employeeAvatar: 'VS', department: 'Marketing',
    category: 'Personal', subject: 'Work-from-home extension request for June 2026',
    description: 'I would like to request a work-from-home extension for June 2026 due to a family medical situation at home. My current WFH approval is valid until May 31. I will maintain full availability during standard working hours, attend all meetings online, and ensure there is no impact on deliverables.',
    createdDate: '2026-05-05', priority: 'Low', status: 'Resolved',
    assignedTo: 'Priya Mehta', lastUpdated: '2026-05-07', hasAttachment: false,
    comments: [
      { id: 'c5', author: 'Priya Mehta', role: 'Admin', text: 'Hi Vikram, your WFH extension for June 2026 has been approved. Please ensure you update your availability status in the system. Wishing your family a speedy recovery.', timestamp: '2026-05-06T16:00:00' },
      { id: 'c6', author: 'Vikram Sharma', role: 'Employee', text: 'Thank you so much for the quick response and the kind wishes!', timestamp: '2026-05-07T09:00:00' },
    ],
  },
  {
    id: 'TKT-2368', employee: 'Sarah Johnson', employeeAvatar: 'SJ', department: 'Engineering',
    category: 'IT Support', subject: 'Request for additional 27-inch monitor for workstation',
    description: 'My current workstation has a single 24-inch display which significantly limits productivity when working across multiple applications simultaneously. I would like to request an additional 27-inch monitor to improve my workflow efficiency.',
    createdDate: '2026-04-28', priority: 'Low', status: 'Closed',
    assignedTo: 'Arjun Menon', lastUpdated: '2026-05-02', hasAttachment: false,
    comments: [
      { id: 'c7', author: 'Arjun Menon', role: 'Admin', text: 'Hi Sarah, a 27-inch Dell monitor has been allocated for your workstation. Please collect it from the IT store room (Room 204) with this ticket reference.', timestamp: '2026-04-30T13:00:00' },
      { id: 'c8', author: 'Admin Support', role: 'Admin', text: 'Ticket closed as monitor has been collected and set up. Closing this ticket.', timestamp: '2026-05-02T10:00:00' },
    ],
  },
  {
    id: 'TKT-2361', employee: 'Kiran Babu', employeeAvatar: 'KB', department: 'Finance',
    category: 'HR Request', subject: 'April 2026 salary slip not received via email',
    description: 'I have not received my April 2026 salary slip via email. The slip is typically dispatched on the 5th of the following month but as of April 22 it has not arrived. I have checked my spam and junk folders thoroughly with no result. Please resend the April 2026 salary slip to my registered email address.',
    createdDate: '2026-04-22', priority: 'Medium', status: 'Resolved',
    assignedTo: 'Sunita Rao', lastUpdated: '2026-04-24', hasAttachment: false,
    comments: [
      { id: 'c9', author: 'Sunita Rao', role: 'Admin', text: 'Hi Kiran, we have resent your April 2026 salary slip to your registered email address. If you still don\'t receive it within 30 minutes, please let us know.', timestamp: '2026-04-23T09:30:00' },
    ],
  },
  {
    id: 'TKT-2354', employee: 'Pooja Iyer', employeeAvatar: 'PI', department: 'Operations',
    category: 'System Support', subject: 'Attendance not syncing — biometric data missing for 3 days',
    description: 'My attendance for May 14, 15, and 16 has not been recorded in the HRMS portal despite using the biometric scanner each day. I have the physical tokens as proof. This may affect my leave balance and payroll calculations.',
    createdDate: '2026-05-17', priority: 'High', status: 'Pending',
    assignedTo: 'Dev Team', lastUpdated: '2026-05-20', hasAttachment: true,
    comments: [
      { id: 'c10', author: 'Admin Support', role: 'Admin', text: 'Hi Pooja, we have raised this with the biometric sync team. Manual entries for May 14–16 have been added as a temporary fix. The root cause is being investigated.', timestamp: '2026-05-18T11:00:00' },
    ],
  },
]

const STATUS_STYLE: Record<TStatus, { bg: string; color: string; dot: string }> = {
  'Open':     { bg: 'rgba(59,130,246,0.10)',  color: '#1D4ED8', dot: '#3B82F6' },
  'Pending':  { bg: 'rgba(139,92,246,0.10)',  color: '#7C3AED', dot: '#8B5CF6' },
  'Resolved': { bg: 'rgba(14,168,106,0.12)',  color: '#0A7040', dot: '#0EA86A' },
  'Closed':   { bg: 'rgba(139,144,167,0.14)', color: '#6B7280', dot: '#9CA3AF' },
}

const PRIORITY_STYLE: Record<Priority, { bg: string; color: string; dot: string; border: string }> = {
  Critical: { bg: 'rgba(232,72,85,0.10)',  color: '#C0202E', dot: '#E84855', border: 'rgba(232,72,85,0.35)'  },
  High:     { bg: 'rgba(249,115,22,0.10)', color: '#C2410C', dot: '#F97316', border: 'rgba(249,115,22,0.35)' },
  Medium:   { bg: 'rgba(245,158,11,0.10)', color: '#B45309', dot: '#F59E0B', border: 'rgba(245,158,11,0.35)' },
  Low:      { bg: 'rgba(14,168,106,0.10)', color: '#0A7040', dot: '#0EA86A', border: 'rgba(14,168,106,0.35)' },
}

const CAT_BADGE: Record<string, { bg: string; color: string }> = {
  'IT Support':      { bg: 'rgba(99,102,241,0.10)',  color: '#5B5FDE' },
  'HR Request':      { bg: 'rgba(14,168,106,0.10)',  color: '#0A7040' },
  'System Support':  { bg: 'rgba(59,130,246,0.10)',  color: '#1D4ED8' },
  'Finance':         { bg: 'rgba(245,158,11,0.10)',  color: '#B45309' },
  'Project Request': { bg: 'rgba(124,58,237,0.10)',  color: '#7C3AED' },
  'Personal':        { bg: 'rgba(13,148,136,0.10)',  color: '#0D9488' },
}

const DEPT_COLOR: Record<string, { bg: string; color: string }> = {
  Engineering: { bg: 'rgba(99,102,241,0.10)',  color: '#5B5FDE' },
  HR:          { bg: 'rgba(14,168,106,0.10)',  color: '#0A7040' },
  Finance:     { bg: 'rgba(245,158,11,0.10)',  color: '#B45309' },
  Operations:  { bg: 'rgba(59,130,246,0.10)',  color: '#1D4ED8' },
  Marketing:   { bg: 'rgba(236,72,153,0.10)',  color: '#BE185D' },
}

const AVATAR_URL: Record<string, string> = {
  'Sarah Johnson': 'https://i.pravatar.cc/40?img=1',
  'Ravi Kumar':    'https://i.pravatar.cc/40?img=3',
  'Meera Pillai':  'https://i.pravatar.cc/40?img=5',
  'Deepak Nair':   'https://i.pravatar.cc/40?img=7',
  'Ananya Singh':  'https://i.pravatar.cc/40?img=9',
  'Vikram Sharma': 'https://i.pravatar.cc/40?img=11',
  'Kiran Babu':    'https://i.pravatar.cc/40?img=13',
  'Pooja Iyer':    'https://i.pravatar.cc/40?img=15',
}

const ALL_STATUSES: TStatus[] = ['Open', 'Pending', 'Resolved', 'Closed']

const C   = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7' }
const COL = '1fr 1.3fr 1fr 1fr 0.9fr 1.1fr 1.2fr 1fr 0.5fr'

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtDateTime(ts: string) {
  const d = new Date(ts)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' · ' +
    d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function EmployeeAvatar({ name, size = 32 }: { name: string; size?: number }) {
  const src = AVATAR_URL[name]
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, display: 'block' }}
      />
    )
  }
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: '#1C2035',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, fontWeight: 700, color: '#F2D000', flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminTicketsPage() {
  // ── List state ──
  const [view,           setView]           = useState<View>('list')
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery,    setSearchQuery]    = useState('')
  const [statusFilter,   setStatusFilter]   = useState<TStatus | 'All'>('All')
  const [selectedTicket, setSelectedTicket] = useState<AdminTicketRecord | null>(null)
  const [catDropOpen,    setCatDropOpen]    = useState(false)

  // ── Detail state ──
  const [tickets,          setTickets]          = useState<AdminTicketRecord[]>(TICKETS)
  const [newStatus,        setNewStatus]         = useState<TStatus>('Open')
  const [responseText,     setResponseText]      = useState('')
  const [responseLoading,  setResponseLoading]   = useState(false)
  const [statusLoading,    setStatusLoading]     = useState(false)
  const [showClosePanel,   setShowClosePanel]    = useState(false)
  const [closeComment,     setCloseComment]      = useState('')
  const [closeLoading,     setCloseLoading]      = useState(false)
  const [closedSuccess,    setClosedSuccess]     = useState(false)
  const [showStatusDrop,   setShowStatusDrop]    = useState(false)
  const responseRef = useRef<HTMLTextAreaElement>(null)

  // ── Derived ──
  const catCount = (id: string) =>
    id === 'All' ? tickets.length : tickets.filter(t => t.category === id).length

  const baseFiltered = tickets.filter(t => {
    const matchCat    = activeCategory === 'All' || t.category === activeCategory
    const q           = searchQuery.toLowerCase()
    const matchSearch = !q || t.subject.toLowerCase().includes(q)
                           || t.id.toLowerCase().includes(q)
                           || t.category.toLowerCase().includes(q)
                           || t.employee.toLowerCase().includes(q)
                           || t.assignedTo.toLowerCase().includes(q)
    return matchCat && matchSearch
  })
  const filtered = baseFiltered.filter(t => statusFilter === 'All' || t.status === statusFilter)

  // ── Handlers ──
  function openDetail(t: AdminTicketRecord) {
    setSelectedTicket(t)
    setNewStatus(t.status)
    setResponseText('')
    setShowClosePanel(false)
    setCloseComment('')
    setClosedSuccess(false)
    setShowStatusDrop(false)
    setView('detail')
  }

  function backToList() {
    setView('list')
    setSelectedTicket(null)
    setClosedSuccess(false)
    setShowClosePanel(false)
  }

  async function handleStatusUpdate() {
    if (!selectedTicket || newStatus === selectedTicket.status) return
    setStatusLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setTickets(prev => prev.map(t =>
      t.id === selectedTicket.id
        ? { ...t, status: newStatus, lastUpdated: new Date().toISOString().slice(0, 10) }
        : t
    ))
    setSelectedTicket(prev => prev ? { ...prev, status: newStatus, lastUpdated: new Date().toISOString().slice(0, 10) } : prev)
    setStatusLoading(false)
    setShowStatusDrop(false)
  }

  async function handleAddResponse() {
    if (!selectedTicket || !responseText.trim()) return
    setResponseLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const newComment: TicketComment = {
      id: `c${Date.now()}`,
      author: 'Admin Support',
      role: 'Admin',
      text: responseText.trim(),
      timestamp: new Date().toISOString(),
    }
    const updatedTicket = {
      ...selectedTicket,
      comments: [...selectedTicket.comments, newComment],
      lastUpdated: new Date().toISOString().slice(0, 10),
    }
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t))
    setSelectedTicket(updatedTicket)
    setResponseText('')
    setResponseLoading(false)
  }

  async function handleCloseTicket() {
    if (!selectedTicket || !closeComment.trim()) return
    setCloseLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    const closeMsg: TicketComment = {
      id: `c${Date.now()}`,
      author: 'Admin Support',
      role: 'Admin',
      text: `[Ticket Closed] ${closeComment.trim()}`,
      timestamp: new Date().toISOString(),
    }
    const updatedTicket: AdminTicketRecord = {
      ...selectedTicket,
      status: 'Closed',
      comments: [...selectedTicket.comments, closeMsg],
      lastUpdated: new Date().toISOString().slice(0, 10),
    }
    setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t))
    setSelectedTicket(updatedTicket)
    setNewStatus('Closed')
    setCloseLoading(false)
    setShowClosePanel(false)
    setCloseComment('')
    setClosedSuccess(true)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes adminTktSpin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes adminTktFade { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .atkt-row:hover        { background: #FAFBFE !important; }
        .atkt-cat-btn:hover    { background: #F0F2F8 !important; }
        .atkt-action-btn:hover { opacity: 0.88; }
        .atkt-drop-opt:hover   { background: #F5F6FF !important; }
      `}</style>

      {/* ────────────────────────────────────────────────────────── LIST VIEW */}
      {view === 'list' && (
        <>
          {/* Page header */}
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px', marginBottom: 4 }}>
              Support Tickets
            </h1>
            <p style={{ fontSize: 13.5, color: C.muted }}>
              Manage and respond to all employee &amp; HR support tickets
            </p>
          </div>

          {/* Filter bar — above table */}
          <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>

            {/* Search */}
            <div style={{ position: 'relative', width: 320, flexShrink: 0 }}>
              <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#A0A5BC', pointerEvents: 'none' }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search tickets…"
                style={{ width: '100%', height: 46, borderRadius: 11, padding: '0 36px 0 40px', fontSize: 13.5, fontWeight: 500, color: C.navy, outline: 'none', border: 'none', background: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, lineHeight: 0 }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Category dropdown */}
            {catDropOpen && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setCatDropOpen(false)} />
            )}
            <div style={{ position: 'relative', zIndex: 100 }}>
              {(() => {
                const ac = CATEGORIES.find(c => c.id === activeCategory) ?? CATEGORIES[0]
                const AcIcon = ac.Icon
                return (
                  <button
                    onClick={() => setCatDropOpen(v => !v)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 9, height: 46, padding: '0 14px 0 12px', borderRadius: 11, border: 'none', background: catDropOpen ? '#F4F5F8' : '#fff', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif", transition: 'background 0.14s', outline: 'none', minWidth: 210 }}
                    onMouseEnter={e => { if (!catDropOpen) e.currentTarget.style.background = '#F7F8FC' }}
                    onMouseLeave={e => { if (!catDropOpen) e.currentTarget.style.background = '#fff' }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: ac.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <AcIcon size={13} strokeWidth={2.2} style={{ color: ac.color }} />
                    </div>
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: C.navy, textAlign: 'left', whiteSpace: 'nowrap' }}>{ac.label}</span>
                    <span style={{ padding: '2px 8px', borderRadius: 99, background: '#F0F2F8', fontSize: 11, fontWeight: 700, color: C.muted, flexShrink: 0 }}>{catCount(ac.id)}</span>
                    <ChevronDown size={13} strokeWidth={2.3} style={{ color: C.muted, flexShrink: 0, transition: 'transform 0.18s', transform: catDropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                  </button>
                )
              })()}
              {catDropOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 7px)', left: 0, minWidth: 238, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 15, boxShadow: '0 10px 36px rgba(28,32,53,0.13)', zIndex: 200, padding: '7px' }}>
                  {CATEGORIES.map(cat => {
                    const CatIcon  = cat.Icon
                    const isActive = activeCategory === cat.id
                    const count    = catCount(cat.id)
                    return (
                      <button key={cat.id}
                        onClick={() => { setActiveCategory(cat.id); setCatDropOpen(false) }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 10px', borderRadius: 9, border: 'none', background: isActive ? cat.bg : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = '#F5F6FA' }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                      >
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: isActive ? cat.bg : '#F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <CatIcon size={13} strokeWidth={isActive ? 2.3 : 1.8} style={{ color: isActive ? cat.color : '#8B90A7' }} />
                        </div>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? cat.color : '#5A6080' }}>{cat.label}</span>
                        {count > 0 && (
                          <span style={{ padding: '2px 8px', borderRadius: 99, background: isActive ? cat.color + '22' : '#F0F2F8', fontSize: 11, fontWeight: 700, color: isActive ? cat.color : '#8B90A7', flexShrink: 0 }}>{count}</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Full-width tickets table */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            {/* Table header: title left, status pills right */}
            <div className="flex items-center justify-between"
              style={{ padding: '13px 20px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
              <div className="flex items-center gap-2.5">
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>
                  {activeCategory === 'All' ? 'All Tickets' : activeCategory}
                </span>
                <span style={{ padding: '2px 9px', borderRadius: 99, background: '#F0F2F8', fontSize: 11.5, fontWeight: 700, color: C.muted }}>{filtered.length}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {(['All', 'Open', 'Pending', 'Resolved', 'Closed'] as const).map(s => {
                  const isAllBtn = s === 'All'
                  const isActive = statusFilter === s
                  const ss       = isAllBtn ? null : STATUS_STYLE[s as TStatus]
                  const cnt      = isAllBtn ? baseFiltered.length : baseFiltered.filter(t => t.status === s).length
                  if (!isAllBtn && cnt === 0) return null
                  return (
                    <button key={s} onClick={() => setStatusFilter(s as TStatus | 'All')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 99, border: 'none', cursor: 'pointer', background: isActive ? (ss ? ss.bg : 'rgba(28,32,53,0.08)') : '#F0F2F8', color: isActive ? (ss ? ss.color : C.navy) : C.muted, fontSize: 11, fontWeight: isActive ? 700 : 600, outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                      {ss && <span style={{ width: 5, height: 5, borderRadius: '50%', background: isActive ? ss.dot : '#B0B4C8', display: 'inline-block', flexShrink: 0 }} />}
                      {s}
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '0 4px', borderRadius: 99, marginLeft: 1, background: isActive ? (ss ? `${ss.dot}28` : 'rgba(28,32,53,0.1)') : 'rgba(0,0,0,0.06)', color: isActive ? (ss ? ss.color : C.navy) : '#9CA3AF' }}>{cnt}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Column headers */}
            <div className="grid" style={{ gridTemplateColumns: COL, padding: '12px 20px', background: '#F7F8FC', borderBottom: `1px solid ${C.border}` }}>
              {['Ticket ID', 'Employee', 'Category', 'Created', 'Priority', 'Status', 'Assigned To', 'Updated', 'View'].map(h => (
                <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center" style={{ padding: '60px 20px' }}>
                <div style={{ width: 54, height: 54, borderRadius: 16, background: '#F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <Ticket size={22} strokeWidth={1.5} style={{ color: '#B0B4C8' }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.navy, marginBottom: 5 }}>No tickets found</p>
                <p style={{ fontSize: 13, color: C.muted }}>Try adjusting your search or category filter</p>
              </div>
            ) : (
              filtered.map((t, idx) => {
                const ss     = STATUS_STYLE[t.status]
                const ps     = PRIORITY_STYLE[t.priority]
                const cb     = CAT_BADGE[t.category] ?? { bg: '#F0F2F8', color: C.muted }
                const isLast = idx === filtered.length - 1
                return (
                  <div key={t.id} className="atkt-row grid items-center"
                    style={{ gridTemplateColumns: COL, padding: '14px 20px', borderBottom: isLast ? 'none' : `1px solid #F0F2F8`, background: '#fff', transition: 'background 0.12s' }}>
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, fontVariantNumeric: 'tabular-nums' }}>{t.id}</div>
                      {t.comments.length > 0 && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <MessageSquare size={10} style={{ color: '#B0B4C8' }} />
                          <span style={{ fontSize: 10.5, color: C.muted }}>{t.comments.length}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <EmployeeAvatar name={t.employee} size={28} />
                      <div className="min-w-0">
                        <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{t.employee}</div>
                        <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>
                          {(() => { const dc = DEPT_COLOR[t.department] ?? { bg: '#F0F2F8', color: C.muted }; return <span style={{ fontSize: 10.5, fontWeight: 600, color: dc.color, background: dc.bg, padding: '1px 6px', borderRadius: 4 }}>{t.department}</span> })()}
                        </div>
                      </div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 9px', borderRadius: 8, background: cb.bg, color: cb.color, fontSize: 11.5, fontWeight: 600, width: 'fit-content', whiteSpace: 'nowrap' }}>
                      {t.category}
                    </span>
                    <span style={{ fontSize: 12, color: '#5A6080', fontWeight: 500 }}>{fmtDate(t.createdDate)}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full"
                      style={{ padding: '4px 10px', background: ps.bg, color: ps.color, fontSize: 11.5, fontWeight: 600, width: 'fit-content', whiteSpace: 'nowrap', border: `1px solid ${ps.border}` }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: ps.dot, display: 'inline-block', flexShrink: 0 }} />
                      {t.priority}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full"
                      style={{ padding: '4px 10px', background: ss.bg, color: ss.color, fontSize: 11.5, fontWeight: 600, width: 'fit-content', whiteSpace: 'nowrap', border: `1px solid ${ss.dot}40` }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: ss.dot, display: 'inline-block', flexShrink: 0 }} />
                      {t.status}
                    </span>
                    <span className="truncate" style={{ fontSize: 12.5, color: '#5A6080', fontWeight: 500 }}>{t.assignedTo}</span>
                    <span style={{ fontSize: 12, color: '#5A6080', fontWeight: 500 }}>{fmtDate(t.lastUpdated)}</span>
                    <button
                      onClick={() => openDetail(t)}
                      title="Manage ticket"
                      style={{ width: 32, height: 32, borderRadius: 8, border: '1px solid #E8EAF2', background: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.14s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E8EAF2' }}
                    >
                      <Eye size={14} strokeWidth={1.8} style={{ color: '#5B5FDE' }} />
                    </button>
                  </div>
                )
              })
            )}

            {/* Footer */}
            {filtered.length > 0 && (
              <div style={{ padding: '11px 20px', borderTop: `1px solid ${C.border}`, background: '#FAFBFE' }}>
                <span style={{ fontSize: 12, color: C.muted, fontWeight: 500 }}>
                  Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of <strong style={{ color: C.navy }}>{tickets.length}</strong> tickets
                </span>
              </div>
            )}
          </div>
        </>
      )}

      {/* ─────────────────────────────────────────────────────── DETAIL VIEW */}
      {view === 'detail' && selectedTicket && (() => {
        const t  = selectedTicket
        const ss = STATUS_STYLE[t.status]
        const ps = PRIORITY_STYLE[t.priority]
        const cb = CAT_BADGE[t.category] ?? { bg: '#F0F2F8', color: C.muted }
        const isClosed = t.status === 'Closed'

        return (
          <div style={{ animation: 'adminTktFade 0.22s ease-out' }}>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-5">
              <button
                onClick={backToList}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff';    e.currentTarget.style.borderColor = C.border }}
              >
                <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
              </button>
              <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
              <button onClick={backToList}
                style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
              >
                Support Tickets
              </button>
              <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontVariantNumeric: 'tabular-nums' }}>{t.id}</span>
            </div>

            {/* Ticket title bar */}
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, padding: '22px 28px', marginBottom: 20 }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, fontVariantNumeric: 'tabular-nums' }}>{t.id}</span>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#D0D4E4', display: 'inline-block' }} />
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: 6, background: cb.bg, color: cb.color, fontSize: 11.5, fontWeight: 600 }}>
                      {t.category}
                    </span>
                  </div>
                  <h2 style={{ fontSize: 19, fontWeight: 800, color: C.navy, lineHeight: 1.35, letterSpacing: '-0.2px', marginBottom: 14 }}>
                    {t.subject}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: ss.color, background: ss.bg, border: `1px solid ${ss.dot}40`, padding: '4px 10px', borderRadius: 99 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: ss.dot, flexShrink: 0 }} />
                      {t.status}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: ps.color, background: ps.bg, border: `1px solid ${ps.border}`, padding: '4px 10px', borderRadius: 99 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: ps.dot, flexShrink: 0 }} />
                      {t.priority} Priority
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <EmployeeAvatar name={t.employee} size={44} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{t.employee}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{t.department}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Two-column body */}
            <div className="grid gap-5" style={{ gridTemplateColumns: '1fr 380px', alignItems: 'start' }}>

              {/* ══ LEFT COLUMN ══ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Ticket meta grid */}
                <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Ticket Information</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '18px 20px', gap: 16 }}>
                    {[
                      { label: 'Submitted By', value: t.employee, Icon: UserCircle },
                      { label: 'Assigned To',  value: t.assignedTo, Icon: Users },
                      { label: 'Created',      value: fmtDate(t.createdDate), Icon: Calendar },
                      { label: 'Last Updated', value: fmtDate(t.lastUpdated), Icon: RefreshCw },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <m.Icon size={11} style={{ color: C.muted }} />
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Issue Description</div>
                  <div style={{ fontSize: 14, color: '#3D4266', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{t.description}</div>
                </div>

                {/* Attachment */}
                {t.hasAttachment && (
                  <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Attached File</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 12, background: '#F7F8FC', border: '1px solid #ECEEF5' }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(232,72,85,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText size={18} strokeWidth={1.6} style={{ color: '#E84855' }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {t.id}_Support_Document.pdf
                        </div>
                        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>284 KB · 3 pages · PDF</div>
                      </div>
                      <button
                        style={{ display: 'flex', alignItems: 'center', gap: 5, height: 34, padding: '0 14px', borderRadius: 9, border: '1px solid #E8EAF2', background: '#fff', fontSize: 12, fontWeight: 600, color: C.muted, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s', flexShrink: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EAF2'; e.currentTarget.style.color = C.muted }}
                      >
                        <Download size={13} strokeWidth={2} /> Download
                      </button>
                    </div>
                  </div>
                )}

                {/* Comments — chat-bubble style (same as employee view) */}
                <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
                  <div className="flex items-center justify-between" style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Conversation</span>
                      {t.comments.length > 0 && (
                        <span style={{ padding: '2px 8px', borderRadius: 99, background: '#F0F2F8', fontSize: 11, fontWeight: 700, color: C.muted }}>{t.comments.length}</span>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Ticket opened marker */}
                    <div className="flex items-center gap-3">
                      <div style={{ flex: 1, height: 1, background: '#F0F2F8' }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap', padding: '0 4px' }}>
                        Ticket opened by {t.employee} · {fmtDate(t.createdDate)}
                      </span>
                      <div style={{ flex: 1, height: 1, background: '#F0F2F8' }} />
                    </div>

                    {t.comments.length === 0 && (
                      <div className="flex flex-col items-center justify-center" style={{ padding: '20px 0 8px' }}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: '#F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                          <MessageSquare size={18} strokeWidth={1.5} style={{ color: '#B0B4C8' }} />
                        </div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, margin: 0 }}>No replies yet</p>
                        <p style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>Add a response using the panel on the right</p>
                      </div>
                    )}

                    {/* Chat bubbles — Employee = left, Admin (you) = right */}
                    {t.comments.map(c => {
                      const isAdmin   = c.role === 'Admin'
                      const isClosing = c.text.startsWith('[Ticket Closed]')
                      const displayText = isClosing ? c.text.replace('[Ticket Closed] ', '') : c.text
                      return (
                        <div key={c.id} style={{ display: 'flex', flexDirection: isAdmin ? 'row-reverse' : 'row', gap: 12, alignItems: 'flex-end' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isAdmin ? '#1C2035' : 'rgba(99,102,241,0.10)', border: isAdmin ? '1.5px solid rgba(255,255,255,0.08)' : '1.5px solid rgba(99,102,241,0.20)' }}>
                            {isAdmin
                              ? <MessageSquare size={14} strokeWidth={2} style={{ color: '#F2D000' }} />
                              : <UserCircle size={15} strokeWidth={1.8} style={{ color: '#5B5FDE' }} />
                            }
                          </div>
                          <div style={{ maxWidth: '72%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexDirection: isAdmin ? 'row-reverse' : 'row' }}>
                              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>
                                {isAdmin ? (isClosing ? 'Admin · Closed' : c.author) : t.employee}
                              </span>
                              <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: isAdmin ? 'rgba(28,32,53,0.08)' : 'rgba(99,102,241,0.10)', color: isAdmin ? C.navy : '#5B5FDE' }}>
                                {isAdmin ? 'Admin' : 'Employee'}
                              </span>
                              <span style={{ fontSize: 11, color: C.muted }}>{fmtDateTime(c.timestamp)}</span>
                            </div>
                            <div style={{
                              padding: '13px 16px',
                              borderRadius: isAdmin ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                              background: isClosing ? 'rgba(139,144,167,0.07)' : isAdmin ? 'rgba(28,32,53,0.05)' : '#F4F5F9',
                              border: `1px solid ${isClosing ? 'rgba(139,144,167,0.20)' : isAdmin ? 'rgba(28,32,53,0.10)' : '#ECEEF5'}`,
                              fontSize: 13.5, color: isClosing ? C.muted : '#3D4266', lineHeight: 1.75,
                              fontStyle: isClosing ? 'italic' : 'normal',
                            }}>
                              {displayText}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>

              {/* ══ RIGHT COLUMN ══ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Status Management */}
                <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16 }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE', borderRadius: '16px 16px 0 0' }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <RefreshCw size={13} strokeWidth={2.2} style={{ color: '#5B5FDE' }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Update Status</span>
                    </div>
                  </div>
                  <div style={{ padding: '18px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                      Current Status
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: ss.color, background: ss.bg, border: `1px solid ${ss.dot}40`, padding: '6px 12px', borderRadius: 99, marginBottom: 16 }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: ss.dot, flexShrink: 0 }} />
                      {t.status}
                    </span>

                    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                      Change To
                    </div>

                    {/* Status dropdown */}
                    <div className="relative" style={{ marginBottom: 14 }}>
                      <button
                        onClick={() => !isClosed && setShowStatusDrop(p => !p)}
                        disabled={isClosed}
                        style={{
                          width: '100%', height: 42, borderRadius: 10,
                          border: `1px solid ${showStatusDrop ? '#6366F1' : C.border}`,
                          background: isClosed ? '#F7F8FC' : showStatusDrop ? '#F5F6FF' : '#fff',
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px',
                          cursor: isClosed ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: STATUS_STYLE[newStatus].dot, flexShrink: 0 }} />
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: isClosed ? C.muted : C.navy }}>{newStatus}</span>
                        </div>
                        <ChevronDown size={14} style={{ color: C.muted, transform: showStatusDrop ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
                      </button>

                      {showStatusDrop && (
                        <div style={{
                          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 300,
                          background: '#fff', borderRadius: 12, border: `1px solid ${C.border}`,
                          boxShadow: '0 12px 32px rgba(28,32,53,0.16)', overflow: 'hidden',
                        }}>
                          {ALL_STATUSES.map(s => {
                            const st = STATUS_STYLE[s]
                            const isSelected = newStatus === s
                            return (
                              <button key={s}
                                className="atkt-drop-opt"
                                onClick={() => { setNewStatus(s); setShowStatusDrop(false) }}
                                style={{
                                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                                  padding: '11px 14px', border: 'none', cursor: 'pointer', textAlign: 'left',
                                  background: isSelected ? st.bg : 'transparent',
                                  fontFamily: 'inherit',
                                }}
                              >
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                                <span style={{ fontSize: 13.5, fontWeight: isSelected ? 700 : 500, color: isSelected ? st.color : C.navy }}>
                                  {s}
                                </span>
                                {isSelected && <CheckCircle size={14} strokeWidth={2.5} style={{ color: st.color, marginLeft: 'auto' }} />}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleStatusUpdate}
                      disabled={isClosed || newStatus === t.status || statusLoading}
                      style={{
                        width: '100%', height: 42, borderRadius: 10, border: 'none',
                        fontSize: 13.5, fontWeight: 700, cursor: (isClosed || newStatus === t.status) ? 'not-allowed' : 'pointer',
                        background: (isClosed || newStatus === t.status) ? '#E8EAF2' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                        color: (isClosed || newStatus === t.status) ? '#B0B4C8' : '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        fontFamily: 'inherit', transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => { if (!(isClosed || newStatus === t.status)) e.currentTarget.style.opacity = '0.88' }}
                      onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                    >
                      {statusLoading ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'adminTktSpin 0.8s linear infinite' }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          Updating…
                        </>
                      ) : 'Update Status'}
                    </button>
                  </div>
                </div>

                {/* Add Response */}
                <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(14,168,106,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MessageSquare size={13} strokeWidth={2.2} style={{ color: '#0EA86A' }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Add Response</span>
                    </div>
                  </div>
                  <div style={{ padding: '16px 18px' }}>
                    <textarea
                      ref={responseRef}
                      value={responseText}
                      onChange={e => setResponseText(e.target.value)}
                      disabled={isClosed}
                      placeholder={isClosed ? 'Ticket is closed — no further responses.' : 'Write a response to the employee…'}
                      rows={4}
                      style={{
                        width: '100%', borderRadius: 10, padding: '12px 14px',
                        border: `1px solid ${responseText ? 'rgba(14,168,106,0.4)' : C.border}`,
                        background: isClosed ? '#F7F8FC' : responseText ? 'rgba(14,168,106,0.04)' : '#fff',
                        fontSize: 13.5, fontWeight: 400, color: C.navy,
                        resize: 'vertical', outline: 'none', lineHeight: 1.65,
                        fontFamily: "'DM Sans', system-ui, sans-serif",
                        boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s',
                        cursor: isClosed ? 'not-allowed' : 'text',
                      }}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <span style={{ fontSize: 11.5, color: C.muted }}>{responseText.length} chars</span>
                      <button
                        onClick={handleAddResponse}
                        disabled={!responseText.trim() || isClosed || responseLoading}
                        style={{
                          height: 38, padding: '0 18px', borderRadius: 9, border: 'none',
                          fontSize: 13, fontWeight: 700, cursor: (!responseText.trim() || isClosed) ? 'not-allowed' : 'pointer',
                          background: (!responseText.trim() || isClosed) ? '#E8EAF2' : 'linear-gradient(135deg, #0EA86A 0%, #0D9488 100%)',
                          color: (!responseText.trim() || isClosed) ? '#B0B4C8' : '#fff',
                          display: 'flex', alignItems: 'center', gap: 6,
                          fontFamily: 'inherit', transition: 'opacity 0.15s',
                        }}
                        onMouseEnter={e => { if (responseText.trim() && !isClosed) e.currentTarget.style.opacity = '0.88' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                      >
                        {responseLoading ? (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'adminTktSpin 0.8s linear infinite' }}>
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                        ) : <Send size={13} strokeWidth={2.2} />}
                        {responseLoading ? 'Sending…' : 'Send Response'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Close Ticket */}
                {!isClosed && (
                  <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
                    <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
                      <div className="flex items-center gap-2">
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(232,72,85,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <CheckCircle size={13} strokeWidth={2.2} style={{ color: '#E84855' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Close Ticket</span>
                      </div>
                    </div>
                    <div style={{ padding: '16px 18px' }}>
                      {!showClosePanel ? (
                        <>
                          <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.6, marginBottom: 14 }}>
                            Mark this ticket as resolved and closed. Add a closing note to inform the employee.
                          </p>
                          <button
                            onClick={() => setShowClosePanel(true)}
                            style={{
                              width: '100%', height: 42, borderRadius: 10, border: '1.5px solid rgba(232,72,85,0.35)',
                              background: 'rgba(232,72,85,0.05)', color: '#E84855',
                              fontSize: 13.5, fontWeight: 700, cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                              fontFamily: 'inherit', transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.10)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.55)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.05)'; e.currentTarget.style.borderColor = 'rgba(232,72,85,0.35)' }}
                          >
                            <CheckCircle size={15} strokeWidth={2.2} />
                            Close This Ticket
                          </button>
                        </>
                      ) : (
                        <div style={{ animation: 'adminTktFade 0.18s ease-out' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                            Closing Note <span style={{ color: '#E84855' }}>*</span>
                          </div>
                          <textarea
                            value={closeComment}
                            onChange={e => setCloseComment(e.target.value)}
                            placeholder="Explain how the issue was resolved or why the ticket is being closed…"
                            rows={3}
                            style={{
                              width: '100%', borderRadius: 10, padding: '11px 13px', marginBottom: 12,
                              border: `1px solid ${closeComment ? 'rgba(232,72,85,0.35)' : C.border}`,
                              background: closeComment ? 'rgba(232,72,85,0.04)' : '#fff',
                              fontSize: 13.5, fontWeight: 400, color: C.navy, resize: 'vertical',
                              outline: 'none', lineHeight: 1.65, fontFamily: "'DM Sans', system-ui, sans-serif",
                              boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s',
                            }}
                          />
                          <div className="flex gap-2.5">
                            <button
                              onClick={() => { setShowClosePanel(false); setCloseComment('') }}
                              style={{
                                flex: 1, height: 40, borderRadius: 9, fontSize: 13, fontWeight: 600,
                                border: `1px solid ${C.border}`, background: '#fff', color: C.muted,
                                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.muted }}
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleCloseTicket}
                              disabled={!closeComment.trim() || closeLoading}
                              style={{
                                flex: 1, height: 40, borderRadius: 9, border: 'none',
                                fontSize: 13, fontWeight: 700, cursor: !closeComment.trim() ? 'not-allowed' : 'pointer',
                                background: !closeComment.trim() ? '#E8EAF2' : '#E84855',
                                color: !closeComment.trim() ? '#B0B4C8' : '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                fontFamily: 'inherit', transition: 'opacity 0.15s',
                              }}
                              onMouseEnter={e => { if (closeComment.trim()) e.currentTarget.style.opacity = '0.88' }}
                              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                            >
                              {closeLoading ? (
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'adminTktSpin 0.8s linear infinite' }}>
                                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                </svg>
                              ) : <CheckCircle size={13} strokeWidth={2.5} />}
                              {closeLoading ? 'Closing…' : 'Confirm Close'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Closed badge */}
                {isClosed && (
                  <div style={{ padding: '18px', borderRadius: 16, background: 'rgba(139,144,167,0.07)', border: '1px solid rgba(139,144,167,0.20)', textAlign: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(139,144,167,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <CheckCircle size={20} strokeWidth={2} style={{ color: '#9CA3AF' }} />
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: '#6B7280', marginBottom: 4 }}>Ticket Closed</div>
                    <div style={{ fontSize: 12.5, color: C.muted }}>This ticket has been resolved and closed.</div>
                  </div>
                )}

                {/* Ticket closed success toast */}
                {closedSuccess && (
                  <div style={{ animation: 'adminTktFade 0.22s ease-out', padding: '14px 16px', borderRadius: 12, background: 'rgba(14,168,106,0.08)', border: '1px solid rgba(14,168,106,0.25)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle size={18} strokeWidth={2.2} style={{ color: '#0EA86A', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#0A7040' }}>Ticket closed successfully</div>
                      <div style={{ fontSize: 12, color: '#0D9488', marginTop: 2 }}>Status updated and employee notified.</div>
                    </div>
                  </div>
                )}

                {/* Quick info sidebar */}
                <div style={{ background: '#FAFBFE', border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Ticket Summary</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Ticket ID',   value: t.id,         Icon: Ticket      },
                      { label: 'Department',  value: t.department, Icon: Users       },
                      { label: 'Comments',    value: `${t.comments.length} comment${t.comments.length !== 1 ? 's' : ''}`, Icon: MessageSquare },
                      { label: 'Attachment',  value: t.hasAttachment ? 'Yes — 1 file' : 'None', Icon: Paperclip },
                      { label: 'Age',         value: `${Math.ceil((Date.now() - new Date(t.createdDate).getTime()) / 86400000)} days`, Icon: Clock },
                    ].map(m => (
                      <div key={m.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <m.Icon size={12} style={{ color: C.muted }} />
                          <span style={{ fontSize: 12, fontWeight: 500, color: C.muted }}>{m.label}</span>
                        </div>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority callout for critical */}
                {(t.priority === 'Critical' || t.priority === 'High') && !isClosed && (
                  <div style={{ padding: '13px 16px', borderRadius: 12, background: t.priority === 'Critical' ? 'rgba(232,72,85,0.07)' : 'rgba(249,115,22,0.07)', border: `1px solid ${t.priority === 'Critical' ? 'rgba(232,72,85,0.20)' : 'rgba(249,115,22,0.20)'}`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <AlertCircle size={16} strokeWidth={2} style={{ color: t.priority === 'Critical' ? '#E84855' : '#F97316', flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: t.priority === 'Critical' ? '#C0202E' : '#C2410C', marginBottom: 3 }}>
                        {t.priority} Priority
                      </div>
                      <div style={{ fontSize: 12, color: t.priority === 'Critical' ? '#C0202E' : '#C2410C', opacity: 0.8 }}>
                        This ticket requires prompt attention and resolution.
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
