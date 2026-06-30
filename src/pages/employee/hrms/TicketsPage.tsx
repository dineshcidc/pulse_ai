import { useState, useRef } from 'react'
import {
  Ticket, ClipboardList, PlusCircle, ChevronRight, ChevronDown, ArrowLeft,
  Search, FolderOpen, User, Users, Laptop, DollarSign, LayoutGrid, X,
  Paperclip, Mail, Phone, MessageSquare, MapPin, Tag, AlertTriangle, Eye,
  Download, FileText, Send, Clock, Calendar,
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────
type Priority   = 'Critical' | 'High' | 'Medium' | 'Low'
type TStatus    = 'Open' | 'Pending' | 'Resolved' | 'Closed'
type ActiveCard = 'ticket-status' | 'ticket-create' | 'ticket-view' | null

interface TicketComment {
  id: string
  author: string
  role: 'Admin' | 'Employee'
  text: string
  timestamp: string
}

interface TicketRecord {
  id: string; type: string; category: string; subject: string; description: string
  createdDate: string; priority: Priority; status: TStatus
  assignedTo: string; lastUpdated: string
  hasAttachment: boolean
  comments: TicketComment[]
}

// ── Static data ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'All',             label: 'All Tickets',    Icon: LayoutGrid, color: '#5B5FDE', bg: 'rgba(99,102,241,0.10)',  desc: ''                                              },
  { id: 'Fin - Income Tax',         label: 'Fin - Income Tax related queries',           Icon: DollarSign, color: '#D97706', bg: 'rgba(245,158,11,0.10)',  desc: 'Income tax queries'      },
  { id: 'Fin - LWF',                label: 'Fin - LWF related queries',                  Icon: DollarSign, color: '#D97706', bg: 'rgba(245,158,11,0.10)',  desc: 'LWF queries'             },
  { id: 'Fin - Others',             label: 'Fin - Others',                              Icon: DollarSign, color: '#D97706', bg: 'rgba(245,158,11,0.10)',  desc: 'Other finance queries'    },
  { id: 'Fin - Payslip',            label: 'Fin - Payslip related queries',             Icon: DollarSign, color: '#D97706', bg: 'rgba(245,158,11,0.10)',  desc: 'Payslip queries'         },
  { id: 'Fin - PF/ESI/PT',          label: 'Fin - PF/ESI/PT related queries',           Icon: DollarSign, color: '#D97706', bg: 'rgba(245,158,11,0.10)',  desc: 'PF/ESI/PT queries'       },
  { id: 'Fin - Salary Account',     label: 'Fin - Salary A/c opening/conversion',       Icon: DollarSign, color: '#D97706', bg: 'rgba(245,158,11,0.10)',  desc: 'Salary account queries'   },
  { id: 'HR - Attendance',          label: 'HR - Attendance related queries',           Icon: Users,      color: '#0EA86A', bg: 'rgba(14,168,106,0.10)',  desc: 'Attendance queries'      },
  { id: 'HR - Leave',               label: 'HR - Leave related queries',                Icon: Users,      color: '#0EA86A', bg: 'rgba(14,168,106,0.10)',  desc: 'Leave queries'           },
  { id: 'HR - Others',              label: 'HR - Others',                               Icon: Users,      color: '#0EA86A', bg: 'rgba(14,168,106,0.10)',  desc: 'Other HR queries'        },
  { id: 'HR - Policy',              label: 'HR - Policy related queries',               Icon: Users,      color: '#0EA86A', bg: 'rgba(14,168,106,0.10)',  desc: 'Policy queries'          },
  { id: 'HR - Profile',             label: 'HR - Profile updation',                     Icon: Users,      color: '#0EA86A', bg: 'rgba(14,168,106,0.10)',  desc: 'Profile updates'         },
  { id: 'IT - Hardware',            label: 'IT - Hardware related queries',             Icon: Laptop,     color: '#6366F1', bg: 'rgba(99,102,241,0.10)',  desc: 'Hardware queries'        },
  { id: 'IT - Office365',           label: 'IT - Office 365 related queries',           Icon: Laptop,     color: '#6366F1', bg: 'rgba(99,102,241,0.10)',  desc: 'Office 365 queries'      },
  { id: 'IT - Others',              label: 'IT - Others',                               Icon: Laptop,     color: '#6366F1', bg: 'rgba(99,102,241,0.10)',  desc: 'Other IT queries'        },
  { id: 'IT - Software',            label: 'IT - Software related queries',             Icon: Laptop,     color: '#6366F1', bg: 'rgba(99,102,241,0.10)',  desc: 'Software queries'        },
  { id: 'IT - VPN',                 label: 'IT - VPN',                                  Icon: Laptop,     color: '#6366F1', bg: 'rgba(99,102,241,0.10)',  desc: 'VPN queries'             },
  { id: 'PA - Addition/Deletion',   label: 'PA-Addition/Deletion of Resource',          Icon: FolderOpen, color: '#7C3AED', bg: 'rgba(124,58,237,0.10)', desc: 'Resource allocation'      },
  { id: 'PA - Allocation',          label: 'PA-Change in Allocation %',                 Icon: FolderOpen, color: '#7C3AED', bg: 'rgba(124,58,237,0.10)', desc: 'Allocation changes'       },
  { id: 'PA - New Project',         label: 'PA-Creation of New Project',                Icon: FolderOpen, color: '#7C3AED', bg: 'rgba(124,58,237,0.10)', desc: 'New project setup'        },
  { id: 'PA - Closure',             label: 'PA-Project Closure',                        Icon: FolderOpen, color: '#7C3AED', bg: 'rgba(124,58,237,0.10)', desc: 'Project closure'          },
] as const

const TICKETS: TicketRecord[] = [
  {
    id: 'TKT-2401', type: 'IT & Admin', category: 'IT - Hardware related queries', subject: 'Laptop not connecting to corporate VPN',
    description: 'My laptop has been unable to connect to the corporate VPN for the past 3 days. I have tried reinstalling the Cisco AnyConnect client and resetting credentials, but the issue persists. Error code: VPN_AUTH_FAILED. This is blocking access to all internal tools and repositories.',
    createdDate: '2026-05-20', priority: 'High', status: 'Pending',
    assignedTo: 'Arjun Menon', lastUpdated: '2026-05-21', hasAttachment: true,
    comments: [],
  },
  {
    id: 'TKT-2398', type: 'HR', category: 'HR - Profile updation', subject: 'Update emergency contact details in HRMS system',
    description: 'I need to update my emergency contact details in the HRMS portal. My previous contact has changed her phone number and I would also like to add my spouse as a secondary emergency contact. Please assist with updating both entries at the earliest.',
    createdDate: '2026-05-18', priority: 'Medium', status: 'Resolved',
    assignedTo: 'Priya Mehta', lastUpdated: '2026-05-20', hasAttachment: false,
    comments: [
      { id: 'c1', author: 'Priya Mehta', role: 'Admin', text: 'Hi, I have updated your emergency contacts in the HRMS system. Primary and secondary contacts have both been added. Please log in and verify the changes at your earliest convenience.', timestamp: '2026-05-19T10:30:00' },
      { id: 'c2', author: 'You', role: 'Employee', text: 'Thank you Priya! I verified the changes and everything looks correct.', timestamp: '2026-05-20T09:15:00' },
    ],
  },
  {
    id: 'TKT-2395', type: 'IT & Admin', category: 'IT - Software related queries', subject: 'Unable to access HRMS portal — persistent login error',
    description: 'I have been unable to log into the HRMS portal since 16 May 2026. After entering credentials the system shows a loading spinner for approximately 30 seconds and then displays a blank white screen. I have reproduced the issue on Chrome, Firefox and Edge browsers across both my laptop and mobile. Clearing cache and cookies has not resolved it.',
    createdDate: '2026-05-16', priority: 'Critical', status: 'Pending',
    assignedTo: 'Dev Team', lastUpdated: '2026-05-21', hasAttachment: true,
    comments: [
      { id: 'c3', author: 'Admin Support', role: 'Admin', text: 'Hi, we have escalated this to the Dev Team. A session token issue affecting a subset of users has been identified. The team is actively working on a fix — estimated resolution by 22 May EOD. We will keep you updated.', timestamp: '2026-05-17T14:00:00' },
    ],
  },
  {
    id: 'TKT-2389', type: 'Finance Manager', category: 'Fin - Salary A/c opening/conversion', subject: 'Reimbursement claim for April 2026 not processed',
    description: 'My expense reimbursement claim for April 2026 totalling ₹4,850 (travel and accommodation for the Pune client visit on Apr 12–13) has not been processed. The claim was submitted via the expense portal on April 18 with all receipts attached. Request you to check the status and process the payment at the earliest.',
    createdDate: '2026-05-12', priority: 'High', status: 'Pending',
    assignedTo: 'Sunita Rao', lastUpdated: '2026-05-15', hasAttachment: true,
    comments: [
      { id: 'c4', author: 'Sunita Rao', role: 'Admin', text: 'Hi, your claim is under review with the Finance team. We require the original physical receipts to be submitted. Please drop them at the Finance desk by 18 May with this ticket reference.', timestamp: '2026-05-14T11:20:00' },
      { id: 'c5', author: 'You', role: 'Employee', text: 'I have submitted the original receipts to the Finance desk this afternoon. Reference number noted: FIN-2026-0489.', timestamp: '2026-05-16T15:30:00' },
    ],
  },
  {
    id: 'TKT-2382', type: 'Project Allocation', category: 'PA-Addition/Deletion of Resource', subject: 'Access request to new project repository — AMS-v3',
    description: 'I have been assigned to the AMS-v3 project starting May 12 but I do not yet have access to the project repository on Bitbucket. The project manager Raj Kumar is aware and has approved the request. Please provision the required read/write access to the AMS-v3 codebase at the earliest so I can begin onboarding tasks.',
    createdDate: '2026-05-09', priority: 'Medium', status: 'Pending',
    assignedTo: 'Raj Kumar', lastUpdated: '2026-05-09', hasAttachment: false,
    comments: [],
  },
  {
    id: 'TKT-2375', type: 'HR', category: 'HR - Leave related queries', subject: 'Work-from-home extension request for June 2026',
    description: 'I would like to request a work-from-home extension for June 2026 due to a family medical situation at home. My current WFH approval is valid until May 31. I will maintain full availability during standard working hours, attend all meetings online, and ensure there is no impact on deliverables.',
    createdDate: '2026-05-05', priority: 'Low', status: 'Resolved',
    assignedTo: 'Priya Mehta', lastUpdated: '2026-05-07', hasAttachment: false,
    comments: [
      { id: 'c6', author: 'Priya Mehta', role: 'Admin', text: 'Hi, your WFH extension for June 2026 has been approved. Please update your availability status in the portal. Wishing your family a speedy recovery.', timestamp: '2026-05-06T16:00:00' },
      { id: 'c7', author: 'You', role: 'Employee', text: 'Thank you so much for the quick response and the kind wishes!', timestamp: '2026-05-07T09:00:00' },
    ],
  },
  {
    id: 'TKT-2368', type: 'IT & Admin', category: 'IT - Hardware related queries', subject: 'Request for additional 27-inch monitor for workstation',
    description: 'My current workstation has a single 24-inch display which significantly limits productivity when working across multiple applications simultaneously. I would like to request an additional 27-inch monitor to improve my workflow efficiency. I am happy to collect the unit from the IT store room at a convenient time.',
    createdDate: '2026-04-28', priority: 'Low', status: 'Closed',
    assignedTo: 'Arjun Menon', lastUpdated: '2026-05-02', hasAttachment: false,
    comments: [
      { id: 'c8', author: 'Arjun Menon', role: 'Admin', text: 'Hi, a 27-inch Dell monitor has been allocated for your workstation. Please collect it from the IT store room (Room 204) during business hours with this ticket reference.', timestamp: '2026-04-30T13:00:00' },
      { id: 'c9', author: 'You', role: 'Employee', text: 'Collected this morning — all set up and working great. Thank you for the quick turnaround!', timestamp: '2026-05-01T10:30:00' },
      { id: 'c10', author: 'Arjun Menon', role: 'Admin', text: 'Great to hear! Closing this ticket. Feel free to raise a new one if you need anything else.', timestamp: '2026-05-02T09:00:00' },
    ],
  },
  {
    id: 'TKT-2361', type: 'HR', category: 'HR - Leave related queries', subject: 'April 2026 salary slip not received via email',
    description: 'I have not received my April 2026 salary slip via email. The slip is typically dispatched on the 5th of the following month but as of April 22 it has not arrived. I have checked my spam and junk folders thoroughly with no result. Please resend the April 2026 salary slip to my registered email address: sarah.johnson@concertidc.com.',
    createdDate: '2026-04-22', priority: 'Medium', status: 'Resolved',
    assignedTo: 'Sunita Rao', lastUpdated: '2026-04-24', hasAttachment: false,
    comments: [
      { id: 'c11', author: 'Sunita Rao', role: 'Admin', text: 'Hi, we have resent your April 2026 salary slip to your registered email address. Please check within 30 minutes, and let us know if you don\'t receive it.', timestamp: '2026-04-23T09:30:00' },
      { id: 'c12', author: 'You', role: 'Employee', text: 'Received it now — thank you for the quick response!', timestamp: '2026-04-23T10:00:00' },
    ],
  },
]

const CONTACT_METHODS = [
  { id: 'email',     label: 'Email',     Icon: Mail           },
  { id: 'phone',     label: 'Phone',     Icon: Phone          },
  { id: 'chat',      label: 'Chat',      Icon: MessageSquare  },
  { id: 'in-person', label: 'In-Person', Icon: MapPin         },
] as const

// ── Style maps ───────────────────────────────────────────────────────────────
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
  'Fin - Income Tax related queries':           { bg: 'rgba(245,158,11,0.10)',  color: '#B45309' },
  'Fin - LWF related queries':                  { bg: 'rgba(245,158,11,0.10)',  color: '#B45309' },
  'Fin - Others':                               { bg: 'rgba(245,158,11,0.10)',  color: '#B45309' },
  'Fin - Payslip related queries':              { bg: 'rgba(245,158,11,0.10)',  color: '#B45309' },
  'Fin - PF/ESI/PT related queries':            { bg: 'rgba(245,158,11,0.10)',  color: '#B45309' },
  'Fin - Salary A/c opening/conversion':        { bg: 'rgba(245,158,11,0.10)',  color: '#B45309' },
  'HR - Attendance related queries':            { bg: 'rgba(14,168,106,0.10)',  color: '#0A7040' },
  'HR - Leave related queries':                 { bg: 'rgba(14,168,106,0.10)',  color: '#0A7040' },
  'HR - Others':                                { bg: 'rgba(14,168,106,0.10)',  color: '#0A7040' },
  'HR - Policy related queries':                { bg: 'rgba(14,168,106,0.10)',  color: '#0A7040' },
  'HR - Profile updation':                      { bg: 'rgba(14,168,106,0.10)',  color: '#0A7040' },
  'IT - Hardware related queries':              { bg: 'rgba(99,102,241,0.10)',  color: '#5B5FDE' },
  'IT - Office 365 related queries':            { bg: 'rgba(99,102,241,0.10)',  color: '#5B5FDE' },
  'IT - Others':                                { bg: 'rgba(99,102,241,0.10)',  color: '#5B5FDE' },
  'IT - Software related queries':              { bg: 'rgba(99,102,241,0.10)',  color: '#5B5FDE' },
  'IT - VPN':                                   { bg: 'rgba(99,102,241,0.10)',  color: '#5B5FDE' },
  'PA-Addition/Deletion of Resource':           { bg: 'rgba(124,58,237,0.10)',  color: '#7C3AED' },
  'PA-Change in Allocation %':                  { bg: 'rgba(124,58,237,0.10)',  color: '#7C3AED' },
  'PA-Creation of New Project':                 { bg: 'rgba(124,58,237,0.10)',  color: '#7C3AED' },
  'PA-Project Closure':                         { bg: 'rgba(124,58,237,0.10)',  color: '#7C3AED' },
}

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7' }

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

function fmtDateTime(ts: string) {
  const d = new Date(ts)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) +
    ' · ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TicketsPage() {
  // ── List state ──
  const [activeCard,     setActiveCard]     = useState<ActiveCard>(null)
  const [activeType,     setActiveType]     = useState('All')
  const [searchQuery,    setSearchQuery]    = useState('')
  const [statusFilter,   setStatusFilter]   = useState<TStatus | 'All'>('All')
  const [viewTicket,     setViewTicket]     = useState<TicketRecord | null>(null)
  const [typeDropOpen,   setTypeDropOpen]   = useState(false)

  // ── Ticket-view state ──
  const [localComments,  setLocalComments]  = useState<TicketComment[]>([])
  const [newComment,     setNewComment]     = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  // ── Create Ticket form state ──
  const [tkType,        setTkType]        = useState('')
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
  const tkCanSubmit = tkType && tkCategory && tkSubject.trim() && tkPriority && tkDescription.trim()

  const basFiltered = TICKETS.filter(t => {
    const matchType   = activeType === 'All' || t.type === activeType
    const q           = searchQuery.toLowerCase()
    const matchSearch = !q || t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
                           || t.type.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.assignedTo.toLowerCase().includes(q)
    return matchType && matchSearch
  })
  const filtered = basFiltered.filter(t => statusFilter === 'All' || t.status === statusFilter)

  // ── Handlers ──
  function openTicketView(t: TicketRecord) {
    setViewTicket(t)
    setLocalComments(t.comments)
    setNewComment('')
    setActiveCard('ticket-view')
  }

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
    setTkType(''); setTkCategory(''); setTkSubject(''); setTkPriority('')
    setTkDescription(''); setTkAttachment(null); setTkContact('email')
    setTkSuccess(false)
    if (tkFileRef.current) tkFileRef.current.value = ''
  }

  async function handleAddComment() {
    if (!newComment.trim() || commentLoading) return
    setCommentLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const comment: TicketComment = {
      id: `c${Date.now()}`,
      author: 'You',
      role: 'Employee',
      text: newComment.trim(),
      timestamp: new Date().toISOString(),
    }
    setLocalComments(prev => [...prev, comment])
    setNewComment('')
    setCommentLoading(false)
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
        @keyframes iconFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes tktSpin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes tktFadeIn   { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .tkt-action-card       { transition: box-shadow 0.18s, background 0.18s, border-color 0.18s; }
        .tkt-action-card:hover { box-shadow: 0 6px 28px rgba(28,32,53,0.09); }
        .tkt-row:hover         { background: #FAFBFE !important; }
        .tkt-priority-btn:hover{ box-shadow: 0 2px 8px rgba(28,32,53,0.08); }
        .tkt-contact-btn:hover { border-color: #C8CCE0 !important; }
      `}</style>

      {/* ── Page header + action cards ─────────────────────────────────── */}
      {activeCard === null && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>
                Tickets
              </h1>
              <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500 }}>
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
                    setSearchQuery('')
                    setStatusFilter('All')
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 24px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = a.activeBorder; e.currentTarget.style.background = a.activeBg }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = '#fff' }}
                >
                  <div className="flex items-center justify-center rounded-2xl flex-shrink-0"
                    style={{ width: 56, height: 56, background: a.iconBg, backgroundImage: `radial-gradient(circle, ${a.dotBg} 1px, transparent 1px)`, backgroundSize: '7px 7px' }}>
                    <Icon size={24} strokeWidth={1.6} style={{ color: a.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>{a.label}</span>
                      <span className="inline-flex items-center gap-1 rounded-full"
                        style={{ padding: '2px 9px', background: a.badgeBg, fontSize: 11, fontWeight: 700, color: a.badgeColor }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: a.badgeDot, display: 'inline-block', flexShrink: 0 }} />
                        {a.badge}
                      </span>
                    </div>
                    <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.55, margin: 0 }}>{a.description}</p>
                  </div>
                  <div className="flex items-center justify-center rounded-xl flex-shrink-0" style={{ width: 34, height: 34, background: a.iconBg }}>
                    <ChevronRight size={16} strokeWidth={2.2} style={{ color: a.arrowColor }} />
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      {activeCard !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
          <button
            onClick={() => {
              if (activeCard === 'ticket-view') { setActiveCard('ticket-status'); setViewTicket(null) }
              else setActiveCard(null)
            }}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'all 0.14s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F7F8FC'; e.currentTarget.style.borderColor = '#C8CCE0' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff';    e.currentTarget.style.borderColor = C.border }}
          >
            <ArrowLeft size={14} strokeWidth={2} style={{ color: C.muted }} />
          </button>
          <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
          <button
            onClick={() => { setActiveCard(null); setViewTicket(null) }}
            style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
            onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
            onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
          >
            Tickets
          </button>
          {activeCard === 'ticket-view' ? (
            <>
              <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
              <button
                onClick={() => { setActiveCard('ticket-status'); setViewTicket(null) }}
                style={{ fontSize: 13, fontWeight: 500, color: C.muted, background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'inherit', transition: 'color 0.14s' }}
                onMouseEnter={e => { e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted }}
              >
                Ticket Status
              </button>
              <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontVariantNumeric: 'tabular-nums' }}>{viewTicket?.id}</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: 13, color: '#C8CCE0' }}>/</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>
                {activeCard === 'ticket-status' ? 'Ticket Status' : 'Create Ticket'}
              </span>
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── TICKET STATUS panel ───────────────────────────────────────────── */}
      {activeCard === 'ticket-status' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* TOP — Search + Category selector bar in white card */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>

            {/* Search — with border */}
            <div className="relative flex-1">
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#A0A5BC', pointerEvents: 'none' }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by ticket ID, subject, category…"
                style={{ ...inputBase, height: 40, border: `1px solid ${C.border}`, background: 'transparent', padding: '0 12px 0 36px', fontSize: 13.5, borderRadius: 9, boxShadow: 'none' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#6366F1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)' }}
                onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none' }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, lineHeight: 0 }}>
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 24, background: C.border, flexShrink: 0 }} />

            {/* Ticket Type — with light background */}
            {typeDropOpen && (
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setTypeDropOpen(false)} />
            )}
            <div style={{ position: 'relative', zIndex: 100 }}>
              <div className="relative">
                <select value={activeType} onChange={e => setActiveType(e.target.value)}
                  style={{ ...inputBase, height: 40, paddingRight: 36, paddingLeft: 12, border: `1px solid ${C.border}`, background: '#F7F8FC', appearance: 'none', cursor: 'pointer', color: activeType ? C.navy : C.muted, fontSize: 13.5 }}>
                  <option value="All">All Types</option>
                  <option value="HR">HR</option>
                  <option value="IT & Admin">IT & Admin</option>
                  <option value="System Admin">System Admin</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="Project Allocation">Project Allocation</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
              </div>
            </div>

          </div>

          {/* FULL-WIDTH — Tickets table */}
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div className="flex items-center justify-between"
              style={{ padding: '13px 20px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
              <div className="flex items-center gap-2.5">
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>
                  {activeType === 'All' ? 'Ticket Status' : activeType}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {(['All', 'Pending', 'Resolved', 'Closed'] as const).map(s => {
                  const isAllBtn = s === 'All'
                  const isActive = statusFilter === s
                  const ss       = isAllBtn ? null : STATUS_STYLE[s as TStatus]
                  const cnt      = isAllBtn ? basFiltered.length : basFiltered.filter(t => t.status === s).length
                  if (!isAllBtn && cnt === 0) return null
                  return (
                    <button key={s} onClick={() => setStatusFilter(s as TStatus | 'All')}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 99, border: 'none', cursor: 'pointer', background: isActive ? (ss ? ss.bg : 'rgba(28,32,53,0.08)') : '#F0F2F8', color: isActive ? (ss ? ss.color : C.navy) : C.muted, fontSize: 11, fontWeight: isActive ? 700 : 600, outline: 'none', transition: 'all 0.13s' }}>
                      {ss && <span style={{ width: 5, height: 5, borderRadius: '50%', background: isActive ? ss.dot : '#B0B4C8', display: 'inline-block', flexShrink: 0 }} />}
                      {s}
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '0px 4px', borderRadius: 99, marginLeft: 1, background: isActive ? (ss ? `${ss.dot}28` : 'rgba(28,32,53,0.1)') : 'rgba(0,0,0,0.06)', color: isActive ? (ss ? ss.color : C.navy) : '#9CA3AF' }}>{cnt}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '0.8fr 1fr 1.2fr 0.8fr 0.8fr 1.1fr 0.5fr', padding: '13px 20px', background: '#F7F8FC', borderBottom: `1px solid ${C.border}` }}>
              {['Ticket ID', 'Type', 'Category', 'Priority', 'Date', 'Status', 'Action'].map(h => (
                <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>

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
                    style={{ gridTemplateColumns: '0.8fr 1fr 1.2fr 0.8fr 0.8fr 1.1fr 0.5fr', padding: '18px 20px', borderBottom: isLast ? 'none' : `1px solid #F0F2F8`, background: '#fff', transition: 'background 0.12s' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, fontVariantNumeric: 'tabular-nums' }}>{t.id}</span>
                    <span style={{ fontSize: 12, color: '#5A6080', fontWeight: 500 }}>{t.type}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 9px', borderRadius: 8, background: cb.bg, color: cb.color, fontSize: 11.5, fontWeight: 600, width: 'fit-content', whiteSpace: 'nowrap' }}>{t.category}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full"
                      style={{ padding: '4px 10px', background: ps.bg, color: ps.color, fontSize: 11.5, fontWeight: 600, width: 'fit-content', whiteSpace: 'nowrap', border: `1px solid ${ps.border}` }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: ps.dot, display: 'inline-block', flexShrink: 0 }} />
                      {t.priority}
                    </span>
                    <span style={{ fontSize: 12, color: '#5A6080', fontWeight: 500 }}>{fmtDate(t.createdDate)}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full"
                      style={{ padding: '4px 10px', background: ss.bg, color: ss.color, fontSize: 11.5, fontWeight: 600, width: 'fit-content', whiteSpace: 'nowrap', border: `1px solid ${ss.dot}40` }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: ss.dot, display: 'inline-block', flexShrink: 0 }} />
                      {t.status}
                    </span>
                    <button
                      onClick={() => openTicketView(t)}
                      title="View ticket details"
                      style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.14s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.30)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border }}
                    >
                      <Eye size={14} strokeWidth={1.8} style={{ color: C.muted }} />
                    </button>
                  </div>
                )
              })
            )}

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
      {activeCard === 'ticket-create' && (
        <div className="grid gap-5" style={{ gridTemplateColumns: '8fr 4fr', alignItems: 'start' }}>

          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
            <div className="flex items-center gap-2.5" style={{ padding: '16px 24px', borderBottom: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.10)', color: '#5B5FDE' }}>
                <Tag size={15} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>New Support Ticket</span>
            </div>

            <div style={{ padding: '26px 24px' }}>
              <div className="grid grid-cols-2 gap-5 mb-6">
                <div>
                  <label style={LABEL}>Ticket Type <span style={{ color: '#E84855' }}>*</span></label>
                  <div className="relative">
                    <select value={tkType} onChange={e => setTkType(e.target.value)}
                      style={{ ...inputBase, paddingRight: 36, paddingLeft: 14, border: `1px solid ${C.border}`, background: tkType ? '#F5F6FF' : '#fff', appearance: 'none', cursor: 'pointer', color: tkType ? C.navy : C.muted }}>
                      <option value="">— Select Type —</option>
                      <option value="HR">HR</option>
                      <option value="IT & Admin">IT & Admin</option>
                      <option value="System Admin">System Admin</option>
                      <option value="Finance Manager">Finance Manager</option>
                      <option value="Project Allocation">Project Allocation</option>
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={LABEL}>Ticket Category <span style={{ color: '#E84855' }}>*</span></label>
                  <div className="relative">
                    <select value={tkCategory} onChange={e => setTkCategory(e.target.value)}
                      style={{ ...inputBase, paddingRight: 36, paddingLeft: 14, border: `1px solid ${C.border}`, background: tkCategory ? '#F5F6FF' : '#fff', appearance: 'none', cursor: 'pointer', color: tkCategory ? C.navy : C.muted }}>
                      <option value="">— Select Category —</option>
                      {CATEGORIES.slice(1).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                    <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label style={LABEL}>Priority <span style={{ color: '#E84855' }}>*</span></label>
                <div className="grid grid-cols-4 gap-3">
                  {(['Low', 'Medium', 'High', 'Critical'] as Priority[]).map(p => {
                    const ps         = PRIORITY_STYLE[p]
                    const isSelected = tkPriority === p
                    return (
                      <button key={p} className="tkt-priority-btn" onClick={() => setTkPriority(p)}
                        style={{ height: 44, borderRadius: 10, border: `1px solid ${isSelected ? ps.border : C.border}`, background: isSelected ? ps.bg : '#fff', color: isSelected ? ps.color : C.muted, fontWeight: isSelected ? 700 : 500, fontSize: 13.5, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.15s', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: isSelected ? ps.dot : '#D0D4E4', transition: 'background 0.15s', display: 'inline-block' }} />
                        {p}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mb-6">
                <label style={LABEL}>Subject <span style={{ color: '#E84855' }}>*</span></label>
                <input type="text" value={tkSubject} onChange={e => setTkSubject(e.target.value)}
                  placeholder="Brief one-line summary of the issue"
                  style={{ ...inputBase, border: `1px solid ${C.border}`, background: tkSubject ? '#F5F6FF' : '#fff' }} />
              </div>

              <div className="mb-6">
                <label style={LABEL}>Description / Issue Details <span style={{ color: '#E84855' }}>*</span></label>
                <textarea value={tkDescription} onChange={e => setTkDescription(e.target.value)}
                  placeholder="Describe your issue in detail — include any error messages, steps to reproduce, or relevant context…"
                  rows={5}
                  style={{ width: '100%', borderRadius: 10, border: `1px solid ${C.border}`, background: tkDescription ? '#F5F6FF' : '#fff', padding: '12px 14px', fontSize: 13.5, fontWeight: 400, color: C.navy, resize: 'vertical', outline: 'none', lineHeight: 1.65, fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s' }} />
                <div style={{ marginTop: 5, textAlign: 'right', fontSize: 11.5, color: tkDescription.length > 500 ? '#E84855' : C.muted }}>
                  {tkDescription.length} / 1000 characters
                </div>
              </div>

              <div className="mb-6">
                <label style={LABEL}>
                  Attachment <span style={{ fontSize: 11, color: '#B0B4C8', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>(optional · max 5 MB)</span>
                </label>
                <input ref={tkFileRef} type="file" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt" style={{ display: 'none' }}
                  onChange={e => handleTkFile(e.target.files?.[0] ?? null)} />
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
                    <button onClick={() => { setTkAttachment(null); if (tkFileRef.current) tkFileRef.current.value = '' }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 4, lineHeight: 0 }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#E84855' }}
                      onMouseLeave={e => { e.currentTarget.style.color = C.muted }}>
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => tkFileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setTkDragOver(true) }}
                    onDragLeave={() => setTkDragOver(false)}
                    onDrop={e => { e.preventDefault(); setTkDragOver(false); handleTkFile(e.dataTransfer.files[0] ?? null) }}
                    style={{ padding: '22px 20px', borderRadius: 10, textAlign: 'center', border: `2px dashed ${tkDragOver ? '#6366F1' : '#D8DCF0'}`, background: tkDragOver ? 'rgba(99,102,241,0.04)' : '#FAFBFE', cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#B0B4D0' }}
                    onMouseLeave={e => { if (!tkDragOver) e.currentTarget.style.borderColor = '#D8DCF0' }}
                  >
                    <div className="flex items-center justify-center mx-auto mb-3 rounded-xl"
                      style={{ width: 40, height: 40, background: 'rgba(99,102,241,0.09)', color: '#5B5FDE' }}>
                      <Paperclip size={17} strokeWidth={1.8} />
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, marginBottom: 4 }}>Click to upload or drag &amp; drop</div>
                    <div style={{ fontSize: 12, color: C.muted }}>.jpg, .png, .pdf, .doc, .docx, .txt &nbsp;·&nbsp; Max 5 MB</div>
                  </div>
                )}
              </div>

              <div className="mb-7" style={{ display: 'none' }}>
                <label style={LABEL}>
                  Preferred Contact Method <span style={{ fontSize: 11, color: '#B0B4C8', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
                </label>
                <div className="flex gap-3">
                  {CONTACT_METHODS.map(cm => {
                    const CmIcon     = cm.Icon
                    const isSelected = tkContact === cm.id
                    return (
                      <button key={cm.id} className="tkt-contact-btn" onClick={() => setTkContact(cm.id)}
                        style={{ flex: 1, height: 44, borderRadius: 10, border: `1px solid ${isSelected ? 'rgba(99,102,241,0.45)' : C.border}`, background: isSelected ? 'rgba(99,102,241,0.06)' : '#fff', color: isSelected ? '#5B5FDE' : '#5A6080', fontWeight: isSelected ? 700 : 500, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all 0.15s', outline: 'none', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                        <CmIcon size={15} strokeWidth={isSelected ? 2.2 : 1.8} />
                        {cm.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3" style={{ borderTop: `1px solid ${C.border}`, paddingTop: 22 }}>
                <button onClick={resetTkForm}
                  style={{ height: 44, padding: '0 22px', borderRadius: 10, fontSize: 13.5, fontWeight: 600, border: `1px solid ${C.border}`, background: '#fff', color: C.muted, cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0C4D6'; e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border;  e.currentTarget.style.color = C.muted }}>
                  Clear Form
                </button>
                <button onClick={() => tkCanSubmit && setTkConfirm(true)}
                  style={{ height: 44, padding: '0 32px', borderRadius: 10, fontSize: 13.5, fontWeight: 700, border: 'none', marginLeft: 'auto', background: tkCanSubmit ? 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' : '#E8EAF2', color: tkCanSubmit ? '#fff' : '#B0B4C8', cursor: tkCanSubmit ? 'pointer' : 'not-allowed', transition: 'opacity 0.15s', display: 'flex', alignItems: 'center', gap: 7 }}
                  onMouseEnter={e => { if (tkCanSubmit) e.currentTarget.style.opacity = '0.88' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                  Submit Ticket
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
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
                      { label: 'Type',        filled: !!tkType               },
                      { label: 'Category',    filled: !!tkCategory           },
                      { label: 'Priority',    filled: !!tkPriority           },
                      { label: 'Subject',     filled: !!tkSubject.trim()     },
                      { label: 'Description', filled: !!tkDescription.trim() },
                    ].filter(f => !f.filled).map(f => (
                      <span key={f.label} className="inline-flex items-center gap-1 mr-2" style={{ color: '#8B90A7', fontWeight: 500 }}>· {f.label}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 520 }}>
              <div className="flex items-center gap-2.5" style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ width: 30, height: 30, background: 'rgba(99,102,241,0.10)', color: '#5B5FDE' }}>
                  <LayoutGrid size={13} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>Category Guide</span>
              </div>
              <div style={{ padding: '10px 12px 14px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto', flex: 1 }}>
                {CATEGORIES.slice(1).map(cat => {
                  const CatIcon    = cat.Icon
                  const isSelected = tkCategory === cat.id
                  return (
                    <button key={cat.id} onClick={() => setTkCategory(cat.id)}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', borderRadius: 10, border: `1px solid ${isSelected ? cat.bg : 'transparent'}`, background: isSelected ? cat.bg : 'transparent', cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.13s' }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#F7F8FC' }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
                    >
                      <div className="flex items-center justify-center rounded-lg flex-shrink-0"
                        style={{ width: 28, height: 28, background: isSelected ? cat.bg : '#F0F2F8', marginTop: 1 }}>
                        <CatIcon size={13} strokeWidth={isSelected ? 2.2 : 1.8} style={{ color: isSelected ? cat.color : '#8B90A7' }} />
                      </div>
                      <div className="min-w-0">
                        <div style={{ fontSize: 12.5, fontWeight: isSelected ? 700 : 600, color: isSelected ? cat.color : C.navy, marginBottom: 2 }}>{cat.label}</div>
                        <div style={{ fontSize: 11.5, color: isSelected ? cat.color : C.muted, lineHeight: 1.5, opacity: isSelected ? 0.8 : 1 }}>{cat.desc}</div>
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
      {/* ── TICKET VIEW page ──────────────────────────────────────────────── */}
      {activeCard === 'ticket-view' && viewTicket && (() => {
        const t         = viewTicket
        const ss        = STATUS_STYLE[t.status]
        const ps        = PRIORITY_STYLE[t.priority]
        const cb        = CAT_BADGE[t.category] ?? { bg: '#F0F2F8', color: C.muted }
        const ticketAge = Math.ceil((Date.now() - new Date(t.createdDate).getTime()) / 86400000)
        const isClosed  = t.status === 'Closed'

        return (
          <div style={{ animation: 'tktFadeIn 0.22s ease-out' }}>

            {/* ── Ticket header card ── */}
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: ss.color, background: ss.bg, border: `1px solid ${ss.dot}40`, padding: '5px 12px', borderRadius: 99 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: ss.dot, flexShrink: 0 }} />
                      {t.status}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: ps.color, background: ps.bg, border: `1px solid ${ps.border}`, padding: '5px 12px', borderRadius: 99 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: ps.dot, flexShrink: 0 }} />
                      {t.priority} Priority
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 600, color: C.muted, marginBottom: 4 }}>Assigned To</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{t.assignedTo}</div>
                </div>
              </div>
            </div>

            {/* ── Two-column body ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, alignItems: 'start' }}>

              {/* ══ LEFT ══ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Meta grid */}
                <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '13px 20px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Ticket Details</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '18px 20px', gap: 16 }}>
                    {[
                      { label: 'Assigned To',  value: t.assignedTo,          Icon: Users    },
                      { label: 'Submitted',     value: fmtDate(t.createdDate), Icon: Calendar },
                      { label: 'Last Updated',  value: fmtDate(t.lastUpdated), Icon: Clock    },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <m.Icon size={11} style={{ color: C.muted }} />
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{m.label}</span>
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{m.value}</div>
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
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.id}_Support_Document.pdf</div>
                        <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>284 KB · 3 pages · PDF</div>
                      </div>
                      <button
                        style={{ display: 'flex', alignItems: 'center', gap: 5, height: 34, padding: '0 14px', borderRadius: 9, border: '1px solid #E8EAF2', background: '#fff', fontSize: 12, fontWeight: 600, color: C.muted, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.13s', flexShrink: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EAF2'; e.currentTarget.style.color = C.muted }}>
                        <Download size={13} strokeWidth={2} /> Download
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Comment thread (chat style) ── */}
                <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
                  <div className="flex items-center justify-between" style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Conversation</span>
                      {localComments.length > 0 && (
                        <span style={{ padding: '2px 8px', borderRadius: 99, background: '#F0F2F8', fontSize: 11, fontWeight: 700, color: C.muted }}>{localComments.length}</span>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {/* Ticket opened marker */}
                    <div className="flex items-center gap-3">
                      <div style={{ flex: 1, height: 1, background: '#F0F2F8' }} />
                      <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap', padding: '0 4px' }}>
                        Ticket opened · {fmtDate(t.createdDate)}
                      </span>
                      <div style={{ flex: 1, height: 1, background: '#F0F2F8' }} />
                    </div>

                    {localComments.length === 0 && (
                      <div className="flex flex-col items-center justify-center" style={{ padding: '24px 0 8px' }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                          <MessageSquare size={18} strokeWidth={1.5} style={{ color: '#B0B4C8' }} />
                        </div>
                        <p style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, margin: 0 }}>No replies yet</p>
                        <p style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>Our support team will respond shortly</p>
                      </div>
                    )}

                    {/* Chat bubbles */}
                    {localComments.map(comment => {
                      const isMe = comment.role === 'Employee'
                      return (
                        <div key={comment.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: 12, alignItems: 'flex-end' }}>
                          {/* Avatar icon */}
                          <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isMe ? 'rgba(99,102,241,0.10)' : '#1C2035', border: isMe ? '1.5px solid rgba(99,102,241,0.20)' : '1.5px solid rgba(255,255,255,0.08)' }}>
                            {isMe
                              ? <User size={15} strokeWidth={2} style={{ color: '#5B5FDE' }} />
                              : <MessageSquare size={14} strokeWidth={2} style={{ color: '#F2D000' }} />
                            }
                          </div>
                          {/* Bubble */}
                          <div style={{ maxWidth: '72%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                              <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy }}>
                                {isMe ? 'You' : comment.author}
                              </span>
                              <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 99, background: isMe ? 'rgba(99,102,241,0.10)' : 'rgba(28,32,53,0.08)', color: isMe ? '#5B5FDE' : C.navy }}>
                                {isMe ? 'You' : 'Support'}
                              </span>
                              <span style={{ fontSize: 11, color: C.muted }}>{fmtDateTime(comment.timestamp)}</span>
                            </div>
                            <div style={{
                              padding: '13px 16px',
                              borderRadius: isMe ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                              background: isMe ? 'rgba(99,102,241,0.07)' : '#F4F5F9',
                              border: `1px solid ${isMe ? 'rgba(99,102,241,0.16)' : '#ECEEF5'}`,
                              fontSize: 13.5, color: '#3D4266', lineHeight: 1.75,
                            }}>
                              {comment.text}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* ══ RIGHT ══ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Ticket Summary - Hidden for now */}
                <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', display: 'none' }}>
                  <div style={{ padding: '13px 18px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Ticket Summary</span>
                  </div>
                  <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: C.muted }}>Status</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: ss.color, background: ss.bg, padding: '3px 10px', borderRadius: 99, border: `1px solid ${ss.dot}30` }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: ss.dot }} />
                        {t.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: 12.5, fontWeight: 500, color: C.muted }}>Priority</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: ps.color, background: ps.bg, padding: '3px 10px', borderRadius: 99, border: `1px solid ${ps.border}` }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: ps.dot }} />
                        {t.priority}
                      </span>
                    </div>
                    {[
                      { label: 'Ticket ID',   value: t.id,                                                                          mono: true  },
                      { label: 'Category',    value: t.category,                                                                    mono: false },
                      { label: 'Assigned To', value: t.assignedTo,                                                                  mono: false },
                      { label: 'Opened',      value: fmtDate(t.createdDate),                                                        mono: false },
                      { label: 'Ticket Age',  value: `${ticketAge} day${ticketAge !== 1 ? 's' : ''}`,                              mono: false },
                      { label: 'Replies',     value: `${localComments.length} message${localComments.length !== 1 ? 's' : ''}`,    mono: false },
                    ].map(m => (
                      <div key={m.label} className="flex items-center justify-between" style={{ paddingTop: 10, borderTop: '1px solid #F5F6FC' }}>
                        <span style={{ fontSize: 12.5, fontWeight: 500, color: C.muted }}>{m.label}</span>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: C.navy, fontVariantNumeric: m.mono ? 'tabular-nums' : undefined }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Comment */}
                <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ padding: '13px 18px', borderBottom: `1px solid ${C.border}`, background: '#FAFBFE' }}>
                    <div className="flex items-center gap-2">
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: 'rgba(99,102,241,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Send size={12} strokeWidth={2.2} style={{ color: '#5B5FDE' }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>Add Comment</span>
                    </div>
                  </div>
                  <div style={{ padding: '16px 18px' }}>
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      disabled={isClosed}
                      placeholder={isClosed ? 'This ticket is closed.' : 'Write a reply or follow-up…'}
                      rows={4}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleAddComment() }}
                      style={{ width: '100%', borderRadius: 10, padding: '12px 14px', border: `1px solid ${newComment ? 'rgba(99,102,241,0.35)' : C.border}`, background: isClosed ? '#F7F8FC' : newComment ? 'rgba(99,102,241,0.04)' : '#fff', fontSize: 13.5, fontWeight: 400, color: C.navy, resize: 'vertical', outline: 'none', lineHeight: 1.65, fontFamily: "'DM Sans', system-ui, sans-serif", boxSizing: 'border-box', transition: 'border-color 0.15s, background 0.15s', cursor: isClosed ? 'not-allowed' : 'text' }}
                    />
                    <div className="flex items-center justify-between mt-3">
                      <span style={{ fontSize: 11, color: C.muted }}>⌘ + Enter to send</span>
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isClosed || commentLoading}
                        style={{ height: 38, padding: '0 18px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 700, cursor: (!newComment.trim() || isClosed) ? 'not-allowed' : 'pointer', background: (!newComment.trim() || isClosed) ? '#E8EAF2' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: (!newComment.trim() || isClosed) ? '#B0B4C8' : '#fff', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', transition: 'opacity 0.15s' }}
                        onMouseEnter={e => { if (newComment.trim() && !isClosed) e.currentTarget.style.opacity = '0.88' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                      >
                        {commentLoading
                          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'tktSpin 0.8s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                          : <Send size={13} strokeWidth={2.2} />
                        }
                        {commentLoading ? 'Sending…' : 'Send'}
                      </button>
                    </div>
                  </div>
                </div>

                {isClosed && (
                  <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(139,144,167,0.07)', border: '1px solid rgba(139,144,167,0.18)', textAlign: 'center' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', marginBottom: 4 }}>Ticket Closed</div>
                    <div style={{ fontSize: 12.5, color: C.muted }}>This ticket has been resolved and closed.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* ══════════════════════════════════════════════════════════════════════ */}
      {/* ── CONFIRM modal ────────────────────────────────────────────────── */}
      {tkConfirm && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}
          onClick={e => { if (e.target === e.currentTarget) setTkConfirm(false) }}
        >
          <div style={{ background: '#fff', borderRadius: 22, width: 460, boxShadow: '0 24px 64px rgba(10,12,28,0.18)', overflow: 'hidden' }}>
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
                  style={{ marginLeft: 'auto', background: '#F0F2F8', border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', color: C.muted, lineHeight: 0, padding: 6, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#E8EAF2'; e.currentTarget.style.color = C.navy }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#F0F2F8'; e.currentTarget.style.color = C.muted }}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Type',     value: tkType },
                { label: 'Category', value: tkCategory },
                { label: 'Subject',  value: tkSubject  },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between"
                  style={{ padding: '10px 14px', background: '#F7F8FC', borderRadius: 10 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.navy }}>{value}</span>
                </div>
              ))}

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

              <div style={{ padding: '12px 14px', background: '#F7F8FC', borderRadius: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Description</div>
                <div style={{ fontSize: 13, color: C.navy, lineHeight: 1.6, maxHeight: 60, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {tkDescription}
                </div>
              </div>

              {tkAttachment && (
                <div className="flex items-center gap-2" style={{ padding: '10px 14px', background: '#F7F8FC', borderRadius: 10 }}>
                  <Paperclip size={13} style={{ color: C.muted, flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: C.muted, fontWeight: 500 }}>{tkAttachment.name}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3" style={{ padding: '0 28px 26px' }}>
              <button onClick={() => setTkConfirm(false)}
                style={{ flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 600, border: '1px solid #E8EAF2', background: '#fff', color: C.muted, cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EAF2'; e.currentTarget.style.color = C.muted }}>
                Go Back
              </button>
              <button onClick={handleTkFinalSubmit} disabled={tkLoading}
                style={{ flex: 1, height: 44, borderRadius: 11, fontSize: 13.5, fontWeight: 700, border: 'none', background: tkLoading ? '#818CF8' : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', cursor: tkLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.15s' }}
                onMouseEnter={e => { if (!tkLoading) e.currentTarget.style.opacity = '0.88' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
                {tkLoading ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'tktSpin 0.8s linear infinite', flexShrink: 0 }}>
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

      {/* ── SUCCESS modal ─────────────────────────────────────────────────── */}
      {tkSuccess && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.5)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          <div style={{ background: '#fff', borderRadius: 22, width: 420, padding: '40px 36px 32px', boxShadow: '0 24px 64px rgba(10,12,28,0.18)', textAlign: 'center' }}>
            <div className="flex items-center justify-center mx-auto mb-5 rounded-2xl"
              style={{ width: 68, height: 68, background: 'rgba(99,102,241,0.10)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.navy, marginBottom: 8, letterSpacing: '-0.3px' }}>Ticket Submitted!</div>
            <p style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, marginBottom: 6 }}>Your support ticket has been successfully submitted.</p>
            <p style={{ fontSize: 13, color: '#5A6080', lineHeight: 1.65, marginBottom: 24 }}>
              <strong style={{ color: C.navy }}>{tkCategory}</strong> · {tkSubject}
              {tkPriority && (
                <> · <span style={{ color: PRIORITY_STYLE[tkPriority as Priority].color, fontWeight: 600 }}>{tkPriority} priority</span></>
              )}. Our team will respond shortly.
            </p>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-7"
              style={{ background: 'rgba(99,102,241,0.08)', fontSize: 12.5, fontWeight: 700, color: '#5B5FDE', border: '1px solid rgba(99,102,241,0.18)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366F1', display: 'inline-block' }} />
              Ref: TKT-{String(2401 + Math.floor(Math.random() * 99) + 1)}
            </div>
            <button onClick={() => { resetTkForm(); setActiveCard(null) }}
              style={{ width: '100%', height: 46, borderRadius: 12, fontSize: 14, fontWeight: 700, border: 'none', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', cursor: 'pointer', transition: 'opacity 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
