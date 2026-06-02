import { useState, useRef } from 'react'
import {
  Ticket, ClipboardList, PlusCircle, ChevronRight, ChevronDown, ArrowLeft,
  // ChevronDown kept for the category dropdown in create form
  Search, Monitor, FolderOpen, User, Users, Laptop, DollarSign, LayoutGrid, X,
  Paperclip, Mail, Phone, MessageSquare, MapPin, Tag, AlertTriangle, Eye,
  Download, FileText,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
type Priority   = 'Critical' | 'High' | 'Medium' | 'Low'
type TStatus    = 'Open' | 'In Progress' | 'Resolved' | 'Closed' | 'Pending'
type ActiveCard = 'ticket-status' | 'ticket-create' | null

interface TicketRecord {
  id: string; category: string; subject: string; description: string
  createdDate: string; priority: Priority; status: TStatus
  assignedTo: string; lastUpdated: string
}

// ── Static data ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'All',             label: 'All Tickets',    Icon: LayoutGrid, color: '#5B5FDE', bg: 'rgba(99,102,241,0.10)',  desc: ''                                              },
  { id: 'System Support',  label: 'System Support', Icon: Monitor,    color: '#3B82F6', bg: 'rgba(59,130,246,0.10)',  desc: 'Login issues, portal errors, system outages'   },
  { id: 'Project Request', label: 'Project Request',Icon: FolderOpen, color: '#7C3AED', bg: 'rgba(124,58,237,0.10)', desc: 'Access requests, project resources & tools'    },
  { id: 'Personal',        label: 'Personal',       Icon: User,       color: '#0D9488', bg: 'rgba(13,148,136,0.10)',  desc: 'WFH requests, personal admin matters'          },
  { id: 'HR Request',      label: 'HR Request',     Icon: Users,      color: '#0EA86A', bg: 'rgba(14,168,106,0.10)',  desc: 'Payslips, documents, leave & policy queries'   },
  { id: 'IT Support',      label: 'IT Support',     Icon: Laptop,     color: '#6366F1', bg: 'rgba(99,102,241,0.10)',  desc: 'Hardware, software, VPN & device requests'     },
  { id: 'Finance',         label: 'Finance',        Icon: DollarSign, color: '#D97706', bg: 'rgba(245,158,11,0.10)',  desc: 'Reimbursements, claims & invoice queries'      },
] as const

const TICKETS: TicketRecord[] = [
  { id: 'TKT-2401', category: 'IT Support',      subject: 'Laptop not connecting to corporate VPN',                 description: 'My laptop has been unable to connect to the corporate VPN for the past 3 days. I have tried reinstalling the Cisco AnyConnect client and resetting credentials, but the issue persists. Error code: VPN_AUTH_FAILED. This is blocking access to all internal tools and repositories.',                                                                                                    createdDate: '2026-05-20', priority: 'High',     status: 'Open',        assignedTo: 'Arjun Menon', lastUpdated: '2026-05-21' },
  { id: 'TKT-2398', category: 'HR Request',      subject: 'Update emergency contact details in HRMS system',        description: 'I need to update my emergency contact details in the HRMS portal. My previous contact has changed her phone number and I would also like to add my spouse as a secondary emergency contact. Please assist with updating both entries at the earliest.',                                                                                                                              createdDate: '2026-05-18', priority: 'Medium',   status: 'Resolved',    assignedTo: 'Priya Mehta', lastUpdated: '2026-05-20' },
  { id: 'TKT-2395', category: 'System Support',  subject: 'Unable to access HRMS portal — persistent login error',  description: 'I have been unable to log into the HRMS portal since 16 May 2026. After entering credentials the system shows a loading spinner for approximately 30 seconds and then displays a blank white screen. I have reproduced the issue on Chrome, Firefox and Edge browsers across both my laptop and mobile. Clearing cache and cookies has not resolved it.',                         createdDate: '2026-05-16', priority: 'Critical', status: 'In Progress', assignedTo: 'Dev Team',    lastUpdated: '2026-05-21' },
  { id: 'TKT-2389', category: 'Finance',         subject: 'Reimbursement claim for April 2026 not processed',       description: 'My expense reimbursement claim for April 2026 totalling ₹4,850 (travel and accommodation for the Pune client visit on Apr 12–13) has not been processed. The claim was submitted via the expense portal on April 18 with all receipts attached. Request you to check the status and process the payment at the earliest.',                                                    createdDate: '2026-05-12', priority: 'High',     status: 'Pending',     assignedTo: 'Sunita Rao',  lastUpdated: '2026-05-15' },
  { id: 'TKT-2382', category: 'Project Request', subject: 'Access request to new project repository — AMS-v3',      description: 'I have been assigned to the AMS-v3 project starting May 12 but I do not yet have access to the project repository on Bitbucket. The project manager Raj Kumar is aware and has approved the request. Please provision the required read/write access to the AMS-v3 codebase at the earliest so I can begin onboarding tasks.',                                                   createdDate: '2026-05-09', priority: 'Medium',   status: 'Open',        assignedTo: 'Raj Kumar',   lastUpdated: '2026-05-09' },
  { id: 'TKT-2375', category: 'Personal',        subject: 'Work-from-home extension request for June 2026',         description: 'I would like to request a work-from-home extension for June 2026 due to a family medical situation at home. My current WFH approval is valid until May 31. I will maintain full availability during standard working hours, attend all meetings online, and ensure there is no impact on deliverables.',                                                                        createdDate: '2026-05-05', priority: 'Low',      status: 'Resolved',    assignedTo: 'Priya Mehta', lastUpdated: '2026-05-07' },
  { id: 'TKT-2368', category: 'IT Support',      subject: 'Request for additional 27-inch monitor for workstation', description: 'My current workstation has a single 24-inch display which significantly limits productivity when working across multiple applications simultaneously. I would like to request an additional 27-inch monitor to improve my workflow efficiency. I am happy to collect the unit from the IT store room at a convenient time.',                                                      createdDate: '2026-04-28', priority: 'Low',      status: 'Closed',      assignedTo: 'Arjun Menon', lastUpdated: '2026-05-02' },
  { id: 'TKT-2361', category: 'HR Request',      subject: 'April 2026 salary slip not received via email',          description: 'I have not received my April 2026 salary slip via email. The slip is typically dispatched on the 5th of the following month but as of April 22 it has not arrived. I have checked my spam and junk folders thoroughly with no result. Please resend the April 2026 salary slip to my registered email address: sarah.johnson@concertidc.com.',                                  createdDate: '2026-04-22', priority: 'Medium',   status: 'Resolved',    assignedTo: 'Sunita Rao',  lastUpdated: '2026-04-24' },
]

const CONTACT_METHODS = [
  { id: 'email',     label: 'Email',     Icon: Mail           },
  { id: 'phone',     label: 'Phone',     Icon: Phone          },
  { id: 'chat',      label: 'Chat',      Icon: MessageSquare  },
  { id: 'in-person', label: 'In-Person', Icon: MapPin         },
] as const

// ── Style maps ───────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<TStatus, { bg: string; color: string; dot: string }> = {
  'Open':        { bg: 'rgba(59,130,246,0.10)',  color: '#1D4ED8', dot: '#3B82F6' },
  'In Progress': { bg: 'rgba(245,158,11,0.10)',  color: '#B45309', dot: '#F59E0B' },
  'Resolved':    { bg: 'rgba(14,168,106,0.12)',  color: '#0A7040', dot: '#0EA86A' },
  'Closed':      { bg: 'rgba(139,144,167,0.14)', color: '#6B7280', dot: '#9CA3AF' },
  'Pending':     { bg: 'rgba(139,92,246,0.10)',  color: '#7C3AED', dot: '#8B5CF6' },
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

const C      = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7' }
const COL    = '1fr 1.4fr 1fr 0.9fr 1.1fr 1.3fr 1fr 0.5fr'

const inputBase: React.CSSProperties = {
  width: '100%', height: 44, borderRadius: 10, padding: '0 14px',
  fontSize: 13.5, fontWeight: 500, color: '#1C2035', outline: 'none',
  fontFamily: "'DM Sans', system-ui, sans-serif",
  transition: 'border-color 0.15s, background 0.15s',
  boxSizing: 'border-box',
}

const LABEL: React.CSSProperties = {
  fontSize: 11.5, fontWeight: 700, color: '#8B90A7',
  display: 'block', marginBottom: 7,
  letterSpacing: '0.06em', textTransform: 'uppercase',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TicketsPage() {
  // ── Ticket Status state ──
  const [activeCard,     setActiveCard]     = useState<ActiveCard>(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery,    setSearchQuery]    = useState('')
  const [statusFilter,   setStatusFilter]   = useState<TStatus | 'All'>('All')
  const [viewTicket,     setViewTicket]     = useState<TicketRecord | null>(null)

  // ── Create Ticket form state ──
  const [tkCategory,    setTkCategory]    = useState('')
  const [tkSubject,     setTkSubject]     = useState('')
  const [tkPriority,    setTkPriority]    = useState<Priority | ''>('')
  const [tkDescription, setTkDescription] = useState('')
  const [tkAttachment,  setTkAttachment]  = useState<File | null>(null)
  const [tkContact,     setTkContact]     = useState('email')
  const [tkDragOver,    setTkDragOver]    = useState(false)
  const [tkConfirm,     setTkConfirm]     = useState(false)
  const [tkSuccess,     setTkSuccess]     = useState(false)
  const [tkLoading,     setTkLoading]     = useState(false)
  const tkFileRef = useRef<HTMLInputElement>(null)

  // ── Derived ──
  const catCount  = (id: string) => id === 'All' ? TICKETS.length : TICKETS.filter(t => t.category === id).length
  const openCount = TICKETS.filter(t => t.status === 'Open').length
  const tkCanSubmit = tkCategory && tkSubject.trim() && tkPriority && tkDescription.trim()

  const basFiltered = TICKETS.filter(t => {
    const matchCat    = activeCategory === 'All' || t.category === activeCategory
    const q           = searchQuery.toLowerCase()
    const matchSearch = !q || t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
                           || t.category.toLowerCase().includes(q) || t.assignedTo.toLowerCase().includes(q)
    return matchCat && matchSearch
  })
  const filtered = basFiltered.filter(t => statusFilter === 'All' || t.status === statusFilter)

  // ── Handlers ──
  function handleTkFile(file: File | null) {
    if (!file) return
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '')
    if (!['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.txt'].includes(ext)) return
    if (file.size > 5 * 1024 * 1024) return
    setTkAttachment(file)
  }

  async function handleTkFinalSubmit() {
    setTkLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setTkLoading(false)
    setTkConfirm(false)
    setTkSuccess(true)
  }

  function resetTkForm() {
    setTkCategory(''); setTkSubject(''); setTkPriority('')
    setTkDescription(''); setTkAttachment(null); setTkContact('email')
    setTkSuccess(false)
    if (tkFileRef.current) tkFileRef.current.value = ''
  }

  // ── Action card config ──
  const ACTIONS = [
    {
      id:          'ticket-status' as const,
      Icon:        ClipboardList,
      label:       'Ticket Status',
      description: 'Track and manage all your submitted support tickets',
      activeBorder:'rgba(245,158,11,0.50)',
      activeBg:    'rgba(245,158,11,0.06)',
      iconBg:      'rgba(245,158,11,0.10)',
      dotBg:       'rgba(245,158,11,0.20)',
      iconColor:   '#D97706',
      arrowColor:  '#D97706',
      badge:       `${openCount} Open` as string,
      badgeBg:     'rgba(245,158,11,0.10)',
      badgeColor:  '#B45309',
      badgeDot:    '#F59E0B',
    },
    {
      id:          'ticket-create' as const,
      Icon:        PlusCircle,
      label:       'Create Ticket',
      description: 'Raise a new HR or IT support request quickly',
      activeBorder:'rgba(99,102,241,0.50)',
      activeBg:    'rgba(99,102,241,0.06)',
      iconBg:      'rgba(99,102,241,0.10)',
      dotBg:       'rgba(99,102,241,0.20)',
      iconColor:   '#5B5FDE',
      arrowColor:  '#5B5FDE',
      badge:       'New',
      badgeBg:     'rgba(99,102,241,0.10)',
      badgeColor:  '#5B5FDE',
      badgeDot:    '#6366F1',
    },
  ]

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes iconFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes tktSpin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .tkt-action-card      { transition: box-shadow 0.18s, background 0.18s, border-color 0.18s; }
        .tkt-action-card:hover{ box-shadow: 0 6px 28px rgba(28,32,53,0.09); }
        .tkt-row:hover        { background: #FAFBFE !important; }
        .tkt-cat-row:hover    { background: #F5F6FF !important; }
        .tkt-priority-btn:hover { box-shadow: 0 2px 8px rgba(28,32,53,0.08); }
        .tkt-contact-btn:hover  { border-color: #C8CCE0 !important; }
      `}</style>

      {/* ── Page header + action cards — only when no sub-page is open ─────── */}
      {activeCard === null && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>
                Tickets
              </h1>
              <p style={{ fontSize: 13.5, color: C.muted }}>
                Raise and track your HR &amp; IT support requests
              </p>
            </div>
            <div
              className="flex items-center justify-center rounded-2xl flex-shrink-0"
              style={{
                width: 84, height: 84,
                backgroundColor: 'rgba(99,102,241,0.07)',
                backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.22) 1px, transparent 1px)',
                backgroundSize: '8px 8px',
                border: '1px solid rgba(99,102,241,0.14)',
              }}
            >
              <div style={{ animation: 'iconFloat 4s ease-in-out infinite' }}>
                <Ticket size={34} strokeWidth={1.5} style={{ color: '#5B5FDE' }} />
              </div>
            </div>
          </div>

          <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {ACTIONS.map(a => {
              const Icon = a.Icon
              return (
                <button
                  key={a.id}
                  className="tkt-action-card text-left"
                  onClick={() => {
                    setActiveCard(a.id)
                    setActiveCategory('All')
                    setSearchQuery('')
                    setStatusFilter('All')
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 18,
                    padding: '22px 24px',
                    background: '#fff',
                    border: `1px solid ${C.border}`,
                    borderRadius: 18,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = a.activeBorder
                    e.currentTarget.style.background  = a.activeBg
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = C.border
                    e.currentTarget.style.background  = '#fff'
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-2xl flex-shrink-0"
                    style={{
                      width: 56, height: 56,
                      background: a.iconBg,
                      backgroundImage: `radial-gradient(circle, ${a.dotBg} 1px, transparent 1px)`,
                      backgroundSize: '7px 7px',
                    }}
                  >
                    <Icon size={24} strokeWidth={1.6} style={{ color: a.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{a.label}</span>
                      <span
                        className="inline-flex items-center gap-1 rounded-full"
                        style={{ padding: '2px 9px', background: a.badgeBg, fontSize: 11, fontWeight: 700, color: a.badgeColor }}
                      >
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: a.badgeDot, display: 'inline-block', flexShrink: 0 }} />
                        {a.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.55, margin: 0 }}>
                      {a.description}
                    </p>
                  </div>
                  <div
                    className="flex items-center justify-center rounded-xl flex-shrink-0"
                    style={{ width: 34, height: 34, background: a.iconBg }}
                  >
                    <ChevronRight size={16} strokeWidth={2.2} style={{ color: a.arrowColor }} />
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* ── Breadcrumb — shown when a sub-page is open ───────────────────────── */}
      {activeCard !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
          <button
            onClick={() => setActiveCard(null)}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff';    e.currentTarget.style.borderColor = C.border }}
          >
            <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
          </button>
          <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
          <button
            onClick={() => setActiveCard(null)}
            style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
          >
            Tickets
          </button>
          <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>
            {activeCard === 'ticket-status' ? 'Ticket Status' : 'Create Ticket'}
          </span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TICKET STATUS panel ───────────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeCard === 'ticket-status' && (
        <div className="grid gap-5" style={{ gridTemplateColumns: '2fr 10fr', alignItems: 'start' }}>

          {/* LEFT — Category sidebar */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '14px 14px 10px' }}>
              <div className="relative">
                <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#B0B4C8', pointerEvents: 'none' }} />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search tickets…"
                  style={{
                    ...inputBase, height: 38,
                    border: `1px solid ${searchQuery ? '#6366F1' : C.border}`,
                    background: searchQuery ? '#F5F6FF' : '#F7F8FC',
                    padding: '0 32px 0 32px',
                    fontSize: 13,
                  }}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, lineHeight: 0 }}>
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            <div style={{ padding: '4px 18px 8px' }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Categories
              </span>
            </div>

            <div style={{ padding: '0 8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {CATEGORIES.map(cat => {
                const CatIcon     = cat.Icon
                const isActiveCat = activeCategory === cat.id
                const count       = catCount(cat.id)
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 10px', borderRadius: 10, border: 'none',
                      background: isActiveCat ? cat.bg : 'transparent',
                      cursor: 'pointer', textAlign: 'left', width: '100%',
                      transition: 'background 0.13s',
                    }}
                    onMouseEnter={e => { if (!isActiveCat) e.currentTarget.style.background = '#F0F2F8' }}
                    onMouseLeave={e => { if (!isActiveCat) e.currentTarget.style.background = 'transparent' }}
                  >
                    <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{ width: 30, height: 30, background: isActiveCat ? cat.bg : '#F0F2F8', transition: 'background 0.13s' }}>
                      <CatIcon size={14} strokeWidth={isActiveCat ? 2.3 : 1.8}
                        style={{ color: isActiveCat ? cat.color : '#8B90A7', transition: 'color 0.13s' }} />
                    </div>
                    <span style={{ flex: 1, fontSize: 13, fontWeight: isActiveCat ? 700 : 500, color: isActiveCat ? cat.color : '#5A6080', transition: 'color 0.13s' }}>
                      {cat.label}
                    </span>
                    {count > 0 && (
                      <span style={{
                        minWidth: 20, height: 20, padding: '0 6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 99, background: isActiveCat ? cat.bg : '#F0F2F8',
                        fontSize: 10.5, fontWeight: 700, color: isActiveCat ? cat.color : '#8B90A7', flexShrink: 0,
                        transition: 'background 0.13s, color 0.13s',
                      }}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* RIGHT — Tickets table */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            {/* Title bar with status filter */}
            <div className="flex items-center justify-between"
              style={{ padding: '13px 20px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
              <div className="flex items-center gap-2.5">
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>
                  {activeCategory === 'All' ? 'All Tickets' : activeCategory}
                </span>
                <span style={{ padding: '2px 9px', borderRadius: 99, background: '#F0F2F8', fontSize: 11.5, fontWeight: 700, color: C.muted }}>
                  {filtered.length}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {(['All', 'Open', 'Pending', 'Resolved', 'Closed'] as const).map(s => {
                  const isAllBtn = s === 'All'
                  const isActive = statusFilter === s
                  const ss       = isAllBtn ? null : STATUS_STYLE[s as TStatus]
                  const cnt      = isAllBtn ? basFiltered.length : basFiltered.filter(t => t.status === s).length
                  if (!isAllBtn && cnt === 0) return null
                  return (
                    <button key={s} onClick={() => setStatusFilter(s as TStatus | 'All')}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '4px 9px', borderRadius: 99, border: 'none', cursor: 'pointer',
                        background: isActive ? (ss ? ss.bg : 'rgba(28,32,53,0.08)') : '#F0F2F8',
                        color: isActive ? (ss ? ss.color : C.navy) : C.muted,
                        fontSize: 11, fontWeight: isActive ? 700 : 600, outline: 'none',
                        transition: 'all 0.13s',
                      }}
                    >
                      {ss && <span style={{ width: 5, height: 5, borderRadius: '50%', background: isActive ? ss.dot : '#B0B4C8', display: 'inline-block', flexShrink: 0 }} />}
                      {s}
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: '0px 4px', borderRadius: 99, marginLeft: 1,
                        background: isActive ? (ss ? `${ss.dot}28` : 'rgba(28,32,53,0.1)') : 'rgba(0,0,0,0.06)',
                        color: isActive ? (ss ? ss.color : C.navy) : '#9CA3AF',
                      }}>{cnt}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Column headers */}
            <div className="grid" style={{ gridTemplateColumns: COL, padding: '13px 20px', background: '#F7F8FC', borderBottom: `1px solid ${C.border}` }}>
              {['Ticket ID', 'Category', 'Created', 'Priority', 'Status', 'Assigned To', 'Updated', 'Action'].map(h => (
                <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center" style={{ padding: '60px 20px' }}>
                <div className="flex items-center justify-center rounded-2xl mb-4" style={{ width: 54, height: 54, background: '#F0F2F8' }}>
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
                  <div key={t.id} className="tkt-row grid items-center"
                    style={{ gridTemplateColumns: COL, padding: '18px 20px', borderBottom: isLast ? 'none' : `1px solid #F0F2F8`, background: '#fff', transition: 'background 0.12s' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, fontVariantNumeric: 'tabular-nums' }}>{t.id}</span>
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
                      onClick={() => setViewTicket(t)}
                      title="View ticket details"
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
                  Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of <strong style={{ color: C.navy }}>{TICKETS.length}</strong> tickets
                </span>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── CREATE TICKET form ────────────────────────────────────────────── */}
      {/* ══════════════════════════════════════════════════════════════════════ */}
      {activeCard === 'ticket-create' && (
        <div className="grid gap-5" style={{ gridTemplateColumns: '8fr 4fr', alignItems: 'start' }}>

          {/* ════ LEFT — Form card ════ */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

            {/* Card header */}
            <div className="flex items-center gap-2.5" style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: '#5B5FDE' }}>
                <Tag size={15} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>New Support Ticket</span>
            </div>

            <div style={{ padding: '26px 24px' }}>

              {/* ── Row 1: Category + Subject ── */}
              <div className="grid grid-cols-2 gap-5 mb-6">

                {/* Category */}
                <div>
                  <label style={LABEL}>
                    Ticket Category <span style={{ color: '#E84855' }}>*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={tkCategory}
                      onChange={e => setTkCategory(e.target.value)}
                      style={{
                        ...inputBase,
                        paddingRight: 36, paddingLeft: 14,
                        border: `1px solid ${C.border}`,
                        background: tkCategory ? '#F5F6FF' : '#fff',
                        appearance: 'none', cursor: 'pointer',
                        color: tkCategory ? C.navy : C.muted,
                      }}
                    >
                      <option value="">— Select Category —</option>
                      {CATEGORIES.slice(1).map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label style={LABEL}>
                    Subject <span style={{ color: '#E84855' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={tkSubject}
                    onChange={e => setTkSubject(e.target.value)}
                    placeholder="Brief one-line summary of the issue"
                    style={{
                      ...inputBase,
                      border: `1px solid ${C.border}`,
                      background: tkSubject ? '#F5F6FF' : '#fff',
                    }}
                  />
                </div>
              </div>

              {/* ── Row 2: Priority selector ── */}
              <div className="mb-6">
                <label style={LABEL}>
                  Priority <span style={{ color: '#E84855' }}>*</span>
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map(p => {
                    const ps         = PRIORITY_STYLE[p]
                    const isSelected = tkPriority === p
                    return (
                      <button
                        key={p}
                        className="tkt-priority-btn"
                        onClick={() => setTkPriority(p)}
                        style={{
                          height: 44, borderRadius: 10,
                          border: `1px solid ${isSelected ? ps.border : C.border}`,
                          background: isSelected ? ps.bg : '#fff',
                          color: isSelected ? ps.color : C.muted,
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: 13.5, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                          transition: 'all 0.15s', outline: 'none',
                          fontFamily: "'DM Sans', system-ui, sans-serif",
                        }}
                      >
                        <span style={{
                          width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                          background: isSelected ? ps.dot : '#D0D4E4',
                          transition: 'background 0.15s',
                          display: 'inline-block',
                        }} />
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── Row 3: Description ── */}
              <div className="mb-6">
                <label style={LABEL}>
                  Description / Issue Details <span style={{ color: '#E84855' }}>*</span>
                </label>
                <textarea
                  value={tkDescription}
                  onChange={e => setTkDescription(e.target.value)}
                  placeholder="Describe your issue in detail — include any error messages, steps to reproduce, or relevant context…"
                  rows={5}
                  style={{
                    width: '100%', borderRadius: 10,
                    border: `1px solid ${C.border}`,
                    background: tkDescription ? '#F5F6FF' : '#fff',
                    padding: '12px 14px',
                    fontSize: 13.5, fontWeight: 400, color: C.navy,
                    resize: 'vertical', outline: 'none', lineHeight: 1.65,
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                    boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s',
                  }}
                />
                <div style={{ marginTop: 5, textAlign: 'right', fontSize: 11.5, color: tkDescription.length > 500 ? '#E84855' : C.muted }}>
                  {tkDescription.length} / 1000 characters
                </div>
              </div>

              {/* ── Row 4: Attachment ── */}
              <div className="mb-6">
                <label style={LABEL}>
                  Attachment{' '}
                  <span style={{ fontSize: 11, color: '#B0B4C8', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>(optional · max 5 MB)</span>
                </label>
                <input
                  ref={tkFileRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt"
                  style={{ display: 'none' }}
                  onChange={e => handleTkFile(e.target.files?.[0] ?? null)}
                />
                {tkAttachment ? (
                  <div className="flex items-center gap-3"
                    style={{ padding: '12px 16px', borderRadius: 10, border: '1px solid rgba(14,168,106,0.3)', background: 'rgba(14,168,106,0.05)' }}>
                    <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                      style={{ width: 36, height: 36, background: 'rgba(14,168,106,0.12)', color: '#0EA86A' }}>
                      <Paperclip size={16} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate" style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{tkAttachment.name}</div>
                      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{(tkAttachment.size / 1024).toFixed(1)} KB · Ready to submit</div>
                    </div>
                    <button
                      onClick={() => { setTkAttachment(null); if (tkFileRef.current) tkFileRef.current.value = '' }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 4, lineHeight: 0 }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#E84855' }}
                      onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => tkFileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setTkDragOver(true) }}
                    onDragLeave={() => setTkDragOver(false)}
                    onDrop={e => { e.preventDefault(); setTkDragOver(false); handleTkFile(e.dataTransfer.files[0] ?? null) }}
                    style={{
                      padding: '22px 20px', borderRadius: 10, textAlign: 'center',
                      border: `2px dashed ${tkDragOver ? '#6366F1' : '#D8DCF0'}`,
                      background: tkDragOver ? 'rgba(99,102,241,0.04)' : '#FAFBFE',
                      cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#B0B4D0' }}
                    onMouseLeave={e => { if (!tkDragOver) e.currentTarget.style.borderColor = '#D8DCF0' }}
                  >
                    <div className="flex items-center justify-center mx-auto mb-3 rounded-xl"
                      style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.09)', color: '#5B5FDE' }}>
                      <Paperclip size={17} strokeWidth={1.8} />
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, marginBottom: 4 }}>
                      Click to upload or drag &amp; drop
                    </div>
                    <div style={{ fontSize: 12, color: C.muted }}>
                      .jpg, .png, .pdf, .doc, .docx, .txt &nbsp;·&nbsp; Max 5 MB
                    </div>
                  </div>
                )}
              </div>

              {/* ── Row 5: Preferred Contact Method ── */}
              <div className="mb-7">
                <label style={LABEL}>
                  Preferred Contact Method{' '}
                  <span style={{ fontSize: 11, color: '#B0B4C8', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                </label>
                <div className="flex gap-3">
                  {CONTACT_METHODS.map(cm => {
                    const CmIcon     = cm.Icon
                    const isSelected = tkContact === cm.id
                    return (
                      <button
                        key={cm.id}
                        className="tkt-contact-btn"
                        onClick={() => setTkContact(cm.id)}
                        style={{
                          flex: 1, height: 44, borderRadius: 10, border: `1px solid ${isSelected ? 'rgba(99,102,241,0.45)' : C.border}`,
                          background: isSelected ? 'rgba(99,102,241,0.06)' : '#fff',
                          color: isSelected ? '#5B5FDE' : '#5A6080',
                          fontWeight: isSelected ? 700 : 500, fontSize: 13,
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                          transition: 'all 0.15s', outline: 'none',
                          fontFamily: "'DM Sans', system-ui, sans-serif",
                        }}
                      >
                        <CmIcon size={15} strokeWidth={isSelected ? 2.2 : 1.8} />
                        {cm.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── Action buttons ── */}
              <div className="flex items-center gap-3" style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22 }}>
                <button
                  onClick={resetTkForm}
                  style={{
                    height: 44, padding: '0 22px', borderRadius: 10, fontSize: 13.5, fontWeight: 600,
                    border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0C4D6'; e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.muted }}
                >
                  Clear Form
                </button>

                <button
                  onClick={() => tkCanSubmit && setTkConfirm(true)}
                  style={{
                    height: 44, padding: '0 32px', borderRadius: 10, fontSize: 13.5, fontWeight: 700,
                    border: 'none', marginLeft: 'auto',
                    background: tkCanSubmit
                      ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)'
                      : '#E8EAF2',
                    color: tkCanSubmit ? '#fff' : '#B0B4C8',
                    cursor: tkCanSubmit ? 'pointer' : 'not-allowed',
                    transition: 'opacity 0.15s',
                    display: 'flex', alignItems: 'center', gap: 7,
                  }}
                  onMouseEnter={e => { if (tkCanSubmit) e.currentTarget.style.opacity = '0.88' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  Submit Ticket
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>

            </div>
          </div>

          {/* ════ RIGHT — Category guide sidebar ════ */}
          <div className="flex flex-col gap-4">

            {/* Validation hint */}
            {!tkCanSubmit && (
              <div className="flex items-start gap-3"
                style={{ padding: '14px 16px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 14 }}>
                <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ width: 30, height: 30, background: 'rgba(99,102,241,0.10)', color: '#5B5FDE', marginTop: 1 }}>
                  <AlertTriangle size={14} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: '#5B5FDE', marginBottom: 4 }}>Required fields</div>
                  <div style={{ fontSize: 12, color: '#6366F1', lineHeight: 1.6 }}>
                    {[
                      { label: 'Category',    filled: !!tkCategory           },
                      { label: 'Subject',     filled: !!tkSubject.trim()     },
                      { label: 'Priority',    filled: !!tkPriority           },
                      { label: 'Description', filled: !!tkDescription.trim() },
                    ].filter(f => !f.filled).map(f => (
                      <span key={f.label} className="inline-flex items-center gap-1 mr-2"
                        style={{ color: '#8B90A7', fontWeight: 500 }}>
                        · {f.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Category guide */}
            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
              <div className="flex items-center gap-2.5" style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}` }}>
                <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ width: 30, height: 30, background: 'rgba(99,102,241,0.10)', color: '#5B5FDE' }}>
                  <LayoutGrid size={13} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Category Guide</span>
              </div>

              <div style={{ padding: '10px 12px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {CATEGORIES.slice(1).map(cat => {
                  const CatIcon    = cat.Icon
                  const isSelected = tkCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setTkCategory(cat.id)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '10px 12px', borderRadius: 10, border: `1px solid ${isSelected ? cat.bg : 'transparent'}`,
                        background: isSelected ? cat.bg : 'transparent',
                        cursor: 'pointer', textAlign: 'left', width: '100%',
                        transition: 'all 0.13s',
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#F7F8FC' }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                    >
                      <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ width: 28, height: 28, background: isSelected ? `${cat.bg}` : '#F0F2F8', marginTop: 1 }}>
                        <CatIcon size={13} strokeWidth={isSelected ? 2.2 : 1.8}
                          style={{ color: isSelected ? cat.color : '#8B90A7' }} />
                      </div>
                      <div className="min-w-0">
                        <div style={{ fontSize: 12.5, fontWeight: isSelected ? 700 : 600, color: isSelected ? cat.color : C.navy, marginBottom: 2 }}>
                          {cat.label}
                        </div>
                        <div style={{ fontSize: 11.5, color: isSelected ? cat.color : C.muted, lineHeight: 1.5, opacity: isSelected ? 0.8 : 1 }}>
                          {cat.desc}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── CONFIRM modal ────────────────────────────────────────────────── */}
      {tkConfirm && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
          onClick={e => { if (e.target === e.currentTarget) setTkConfirm(false) }}
        >
          <div style={{ background: '#fff', borderRadius: 22, width: 460, boxShadow: '0 24px 64px rgba(10,12,28,0.18)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '26px 28px 20px', borderBottom: '1px solid #F0F2F8' }}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-xl flex-shrink-0"
                  style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.10)', color: '#5B5FDE' }}>
                  <Tag size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>Confirm Ticket Submission</div>
                  <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>Please review before submitting</div>
                </div>
                <button onClick={() => setTkConfirm(false)}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, lineHeight: 0, padding: 4 }}
                  onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Details */}
            <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Category', value: tkCategory },
                { label: 'Subject',  value: tkSubject  },
                { label: 'Contact',  value: CONTACT_METHODS.find(c => c.id === tkContact)?.label ?? tkContact },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between"
                  style={{ padding: '10px 14px', background: '#F7F8FC', borderRadius: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{value}</span>
                </div>
              ))}

              {/* Priority row */}
              {tkPriority && (() => {
                const ps = PRIORITY_STYLE[tkPriority as Priority]
                return (
                  <div className="flex items-center justify-between"
                    style={{ padding: '10px 14px', background: '#F7F8FC', borderRadius: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full"
                      style={{ padding: '4px 11px', background: ps.bg, color: ps.color, fontSize: 12, fontWeight: 600 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: ps.dot, display: 'inline-block' }} />
                      {tkPriority}
                    </span>
                  </div>
                )
              })()}

              {/* Description preview */}
              <div style={{ padding: '12px 14px', background: '#F7F8FC', borderRadius: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Description</div>
                <div style={{ fontSize: 13, color: C.navy, lineHeight: 1.6, maxHeight: 60, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {tkDescription}
                </div>
              </div>

              {tkAttachment && (
                <div className="flex items-center gap-2"
                  style={{ padding: '10px 14px', background: '#F7F8FC', borderRadius: 10 }}>
                  <Paperclip size={13} style={{ color: C.muted, flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>{tkAttachment.name}</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-3" style={{ padding: '0 28px 26px' }}>
              <button onClick={() => setTkConfirm(false)}
                style={{
                  flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 600,
                  border: '1px solid #E8EAF2', background: '#fff', color: C.muted, cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EAF2'; e.currentTarget.style.color = C.muted }}
              >
                Go Back
              </button>
              <button onClick={handleTkFinalSubmit} disabled={tkLoading}
                style={{
                  flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700, border: 'none',
                  background: tkLoading ? '#818CF8' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  color: '#fff', cursor: tkLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => { if (!tkLoading) e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                {tkLoading ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                      style={{ animation: 'tktSpin 0.8s linear infinite', flexShrink: 0 }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Submitting…
                  </>
                ) : 'Submit Ticket'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TICKET DETAIL modal ───────────────────────────────────────────── */}
      {viewTicket && (() => {
        const t   = viewTicket
        const ss  = STATUS_STYLE[t.status]
        const ps  = PRIORITY_STYLE[t.priority]
        const cb  = CAT_BADGE[t.category] ?? { bg: '#F0F2F8', color: C.muted }
        const CatIcon = CATEGORIES.find(c => c.id === t.category)?.Icon ?? Ticket
        const catColor = CATEGORIES.find(c => c.id === t.category)?.color ?? C.muted
        const catBg    = CATEGORIES.find(c => c.id === t.category)?.bg    ?? '#F0F2F8'
        const DUMMY_ATTACHMENT = { name: `${t.id}_Support_Document.pdf`, size: '284 KB', pages: '3 pages' }

        return (
          <div
            style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(10,12,28,0.35)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans', system-ui, sans-serif", padding:24 }}
            onClick={e => { if (e.target === e.currentTarget) setViewTicket(null) }}
          >
            <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:580, maxHeight:'88vh', display:'flex', flexDirection:'column', boxShadow:'0 8px 40px rgba(10,12,28,0.12)', overflow:'hidden' }}>

              {/* ── Header ── */}
              <div style={{ padding:'24px 28px 20px', borderBottom:'1px solid #F0F2F8', flexShrink:0 }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:16 }}>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:12, color:C.muted, fontWeight:500, marginBottom:6 }}>{t.id} · {t.category}</div>
                    <div style={{ fontSize:18, fontWeight:700, color:C.navy, lineHeight:1.35 }}>{t.subject}</div>
                  </div>
                  <button onClick={() => setViewTicket(null)}
                    style={{ width:32, height:32, borderRadius:8, border:'none', background:'#F7F8FC', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, transition:'background 0.13s' }}
                    onMouseEnter={e=>{e.currentTarget.style.background='#ECEEF5'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='#F7F8FC'}}>
                    <X size={14} style={{color:C.muted}} />
                  </button>
                </div>
                {/* Status + priority badges with light bg */}
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, fontWeight:600, color:ss.color, background:ss.bg, border:`1px solid ${ss.dot}40`, padding:'4px 10px', borderRadius:99 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:ss.dot, flexShrink:0 }} />
                    {t.status}
                  </span>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, fontWeight:600, color:ps.color, background:ps.bg, border:`1px solid ${ps.border}`, padding:'4px 10px', borderRadius:99 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:ps.dot, flexShrink:0 }} />
                    {t.priority} Priority
                  </span>
                </div>
              </div>

              {/* ── Scrollable body ── */}
              <div style={{ overflowY:'auto', flex:1, padding:'24px 28px' }}>

                {/* Meta row */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:0, marginBottom:24, borderRadius:12, border:'1px solid #F0F2F8', overflow:'hidden' }}>
                  {[
                    { label:'Assigned To',  value:t.assignedTo           },
                    { label:'Created',      value:fmtDate(t.createdDate)  },
                    { label:'Last Updated', value:fmtDate(t.lastUpdated)  },
                  ].map((m, i) => (
                    <div key={m.label} style={{ padding:'14px 16px', borderRight: i < 2 ? '1px solid #F0F2F8' : 'none', background:'#FAFBFE' }}>
                      <div style={{ fontSize:10.5, fontWeight:600, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.05em', marginBottom:5 }}>{m.label}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:C.navy }}>{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Description */}
                <div style={{ marginBottom:24 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.07em', marginBottom:10 }}>Description / Issue Details</div>
                  <div style={{ fontSize:13.5, color:'#3D4266', lineHeight:1.9, whiteSpace:'pre-wrap' }}>
                    {t.description}
                  </div>
                </div>

                {/* Attachment */}
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase' as const, letterSpacing:'0.07em', marginBottom:10 }}>Attached Document</div>
                  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'13px 16px', borderRadius:12, background:'#F7F8FC', border:'1px solid #ECEEF5' }}>
                    <div style={{ width:38, height:38, borderRadius:9, background:'rgba(232,72,85,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <FileText size={17} strokeWidth={1.6} style={{ color:'#E84855' }} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:C.navy, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{DUMMY_ATTACHMENT.name}</div>
                      <div style={{ fontSize:11.5, color:C.muted, marginTop:3 }}>{DUMMY_ATTACHMENT.size} · {DUMMY_ATTACHMENT.pages} · PDF</div>
                    </div>
                    <button
                      style={{ display:'flex', alignItems:'center', gap:5, height:32, padding:'0 12px', borderRadius:8, border:'1px solid #E8EAF2', background:'#fff', fontSize:12, fontWeight:600, color:C.muted, cursor:'pointer', fontFamily:'inherit', transition:'all 0.13s', flexShrink:0 }}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor='#C8CCE0';e.currentTarget.style.color=C.navy}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor='#E8EAF2';e.currentTarget.style.color=C.muted}}
                    >
                      <Download size={12} strokeWidth={2} /> Download
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Footer ── */}
              <div style={{ padding:'16px 28px 22px', borderTop:'1px solid #F0F2F8', flexShrink:0 }}>
                <button onClick={() => setViewTicket(null)}
                  style={{ width:'100%', height:42, borderRadius:11, border:'1px solid #E8EAF2', background:'#fff', color:C.muted, fontSize:13.5, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}
                  onMouseEnter={e=>{e.currentTarget.style.background='#F7F8FC';e.currentTarget.style.color=C.navy;e.currentTarget.style.borderColor='#D0D4E0'}}
                  onMouseLeave={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color=C.muted;e.currentTarget.style.borderColor='#E8EAF2'}}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* ── SUCCESS modal ─────────────────────────────────────────────────── */}
      {tkSuccess && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Sans', system-ui, sans-serif",
          }}
        >
          <div style={{ background: '#fff', borderRadius: 22, width: 420, padding: '40px 36px 32px', boxShadow: '0 24px 64px rgba(10,12,28,0.18)', textAlign: 'center' }}>
            <div className="flex items-center justify-center mx-auto mb-5 rounded-2xl"
              style={{ width: 68, height: 68, background: 'rgba(99,102,241,0.10)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>

            <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 8, letterSpacing: '-0.3px' }}>
              Ticket Submitted!
            </div>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, marginBottom: 6 }}>
              Your support ticket has been successfully submitted.
            </p>
            <p style={{ fontSize: 13, color: '#5A6080', lineHeight: 1.65, marginBottom: 24 }}>
              <strong style={{ color: C.navy }}>{tkCategory}</strong> · {tkSubject}
              {tkPriority && (
                <>
                  {' · '}
                  <span style={{ color: PRIORITY_STYLE[tkPriority as Priority].color, fontWeight: 600 }}>
                    {tkPriority} priority
                  </span>
                </>
              )}
              . Our team will respond via{' '}
              <strong style={{ color: C.navy }}>
                {CONTACT_METHODS.find(c => c.id === tkContact)?.label ?? tkContact}
              </strong>.
            </p>

            {/* Reference badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-7"
              style={{ background: 'rgba(99,102,241,0.08)', fontSize: 12.5, fontWeight: 700, color: '#5B5FDE', border: '1px solid rgba(99,102,241,0.18)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', display: 'inline-block' }} />
              Ref: TKT-{String(2401 + Math.floor(Math.random() * 99) + 1)}
            </div>

            <button
              onClick={() => { resetTkForm(); setActiveCard(null) }}
              style={{
                width: '100%', height: 46, borderRadius: 12, fontSize: 14, fontWeight: 700,
                border: 'none', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                color: '#fff', cursor: 'pointer', transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
