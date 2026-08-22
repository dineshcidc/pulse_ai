/*
 * Shared HR offboarding dataset.
 *
 * HR is the monitor + closer: each case carries the state of all four department
 * clearances (CTO · Manager · IT · Finance) plus the employee's exit interview and
 * HR closure. Both the HR Dashboard (H1) and the Case Cockpit (H2/H3) read from here.
 */

export const TODAY = new Date('2026-08-05')

export type DeptKey = 'cto' | 'manager' | 'it' | 'finance'
export type DeptStatus = 'approved' | 'cleared' | 'pending' | 'on-hold' | 'rejected' | 'awaiting'
export type OverallStage = 'pending-cto' | 'in-progress' | 'pending-closure' | 'completed'

export type Clearance = {
  status: DeptStatus
  by?: string
  on?: string              // decided / cleared date (YYYY-MM-DD)
  summary?: string         // one-line of what was submitted
  remarks?: string
  holdReason?: string
  noticeDays?: number      // CTO
  net?: number             // Finance — net F&F payable
  checklist?: { label: string; done: boolean }[]
}

export type ExitInterview = {
  submitted: boolean
  rating?: number
  recommend?: string
  enjoyed?: string
  improve?: string
  suggest?: string
}

export type HRCase = {
  id: string
  name: string
  code: string
  designation: string
  department: string
  avatar: string
  reason: string
  notes: string
  manager: string
  doj: string
  email: string
  phone: string
  noticeDays?: number
  lwd?: string
  intendedLwd: string
  submittedOn: string
  clearances: Record<DeptKey, Clearance>
  exitInterview: ExitInterview
  hrClosed: boolean
  closedOn?: string
  initiatedBy?: 'HR'         // HR-raised (involuntary) instead of employee-raised
}

const JOHN_NOTE = 'I have accepted an offer for a senior role that offers stronger long-term growth and ownership. It was a difficult decision — I have valued my time here and the mentorship on the platform team. I will ensure a clean handover of my modules and complete knowledge transfer before my last day.'

export const HR_CASES: HRCase[] = [
  {
    id: 'OFB-2442', name: 'John Doe', code: 'CC001', designation: 'Senior Software Engineer', department: 'Engineering',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg', reason: 'Better Career Opportunity', notes: JOHN_NOTE,
    manager: 'Priya Sharma', doj: '2021-03-12', email: 'john.doe@concertidc.com', phone: '+91 98840 12345',
    noticeDays: 60, lwd: '2026-10-02', intendedLwd: '2026-10-02', submittedOn: '2026-08-04',
    clearances: {
      cto:     { status: 'approved', by: 'Delivery Head', on: '2026-08-05', summary: 'Approved · 60-day notice', noticeDays: 60 },
      manager: { status: 'cleared', by: 'Priya Sharma', on: '2026-08-05', summary: 'Project handover cleared',
                 checklist: [{ label: 'Projects reassigned', done: true }, { label: 'Responsibilities transferred', done: true }, { label: 'Documents & access handed over', done: true }, { label: 'Knowledge transfer completed', done: true }],
                 remarks: 'Handover to Rahul; KT sessions scheduled through September.' },
      it:      { status: 'pending', summary: 'Awaiting IT clearance' },
      finance: { status: 'pending', summary: 'Awaiting settlement' },
    },
    exitInterview: { submitted: false },
    hrClosed: false,
  },
  {
    id: 'OFB-2451', name: 'Kabir Anand', code: 'CC047', designation: 'Software Engineer', department: 'Engineering',
    avatar: 'https://randomuser.me/api/portraits/men/29.jpg', reason: 'Performance', initiatedBy: 'HR',
    notes: 'Offboarding initiated by HR due to sustained performance concerns. The employee has remained below role expectations across two consecutive review cycles despite a documented performance-improvement plan (PIP). Awaiting the Delivery Head’s approval to confirm the notice period and last working day.',
    manager: 'Priya Sharma', doj: '2022-04-18', email: 'kabir.anand@concertidc.com', phone: '+91 90256 33447',
    intendedLwd: '', submittedOn: '2026-08-05',
    clearances: {
      cto:     { status: 'pending', summary: 'Awaiting CTO decision' },
      manager: { status: 'awaiting', summary: 'Locked until CTO approves' },
      it:      { status: 'awaiting', summary: 'Locked until CTO approves' },
      finance: { status: 'awaiting', summary: 'Locked until CTO approves' },
    },
    exitInterview: { submitted: false },
    hrClosed: false,
  },
  {
    id: 'OFB-2445', name: 'Aisha Khan', code: 'CC024', designation: 'Software Engineer', department: 'Engineering',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg', reason: 'Relocation', notes: 'Relocating with family to another city permanently. Happy to hand over ongoing work during my notice period.',
    manager: 'Priya Sharma', doj: '2022-09-01', email: 'aisha.khan@concertidc.com', phone: '+91 90035 22118',
    noticeDays: 30, lwd: '2026-08-20', intendedLwd: '2026-08-20', submittedOn: '2026-07-21',
    clearances: {
      cto:     { status: 'approved', by: 'Delivery Head', on: '2026-07-22', summary: 'Approved · 30-day notice', noticeDays: 30 },
      manager: { status: 'cleared', by: 'Priya Sharma', on: '2026-07-30', summary: 'Project handover cleared',
                 checklist: [{ label: 'Projects reassigned', done: true }, { label: 'Responsibilities transferred', done: true }, { label: 'Documents & access handed over', done: true }, { label: 'Knowledge transfer completed', done: true }] },
      it:      { status: 'cleared', by: 'System Admin', on: '2026-08-03', summary: 'Assets recovered & access revoked',
                 checklist: [{ label: 'MacBook Air 13"', done: true }, { label: 'Access Card #4520', done: true }, { label: 'Company SIM', done: true }, { label: 'Email & SSO disabled', done: true }, { label: 'VPN & network access', done: true }] },
      finance: { status: 'pending', summary: 'Awaiting settlement (early-release shortfall)' },
    },
    exitInterview: { submitted: false },
    hrClosed: false,
  },
  {
    id: 'OFB-2440', name: 'Rajesh Kumar', code: 'CC021', designation: 'QA Lead', department: 'Quality',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg', reason: 'Higher Studies', notes: 'Admitted to a full-time master’s program starting this fall. Would like to plan the QA handover carefully given the release schedule.',
    manager: 'Priya Sharma', doj: '2020-01-20', email: 'rajesh.kumar@concertidc.com', phone: '+91 99620 77889',
    intendedLwd: '2026-11-01', submittedOn: '2026-08-01',
    clearances: {
      cto:     { status: 'pending', summary: 'Awaiting CTO decision' },
      manager: { status: 'awaiting', summary: 'Locked until CTO approves' },
      it:      { status: 'awaiting', summary: 'Locked until CTO approves' },
      finance: { status: 'awaiting', summary: 'Locked until CTO approves' },
    },
    exitInterview: { submitted: false },
    hrClosed: false,
  },
  {
    id: 'OFB-2436', name: 'Meera Nair', code: 'CC009', designation: 'Business Analyst', department: 'Delivery',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg', reason: 'Career Growth / Role Change', notes: 'Moving into a product management track elsewhere that aligns with my long-term goals. Committed to a smooth transition.',
    manager: 'Anil Verma', doj: '2019-08-05', email: 'meera.nair@concertidc.com', phone: '+91 98410 33221',
    noticeDays: 60, lwd: '2026-09-18', intendedLwd: '2026-09-18', submittedOn: '2026-07-20',
    clearances: {
      cto:     { status: 'approved', by: 'Delivery Head', on: '2026-07-22', summary: 'Approved · 60-day notice', noticeDays: 60 },
      manager: { status: 'cleared', by: 'Anil Verma', on: '2026-07-28', summary: 'Project handover cleared',
                 checklist: [{ label: 'Projects reassigned', done: true }, { label: 'Responsibilities transferred', done: true }, { label: 'Documents & access handed over', done: true }, { label: 'Knowledge transfer completed', done: true }] },
      it:      { status: 'cleared', by: 'System Admin', on: '2026-08-02', summary: 'Assets recovered & access revoked',
                 checklist: [{ label: 'MacBook Pro 14"', done: true }, { label: 'Access Card #3980', done: true }, { label: 'Email & SSO disabled', done: true }, { label: 'VPN & network access', done: true }] },
      finance: { status: 'cleared', by: 'Finance', on: '2026-08-01', summary: 'F&F settled · ₹3,51,000 net', net: 351000,
                 checklist: [{ label: 'Final pay & leave encashment computed', done: true }, { label: 'Reimbursements settled', done: true }, { label: 'Dues & advances recovered', done: true }, { label: 'F&F statement generated', done: true }] },
    },
    exitInterview: { submitted: true, rating: 4, recommend: 'Yes', enjoyed: 'The collaborative delivery team and the exposure to client-facing work.', improve: 'Clearer growth paths for analysts.', suggest: 'Keep investing in structured mentoring.' },
    hrClosed: false,
  },
  {
    id: 'OFB-2431', name: 'Arjun Menon', code: 'CC017', designation: 'DevOps Engineer', department: 'Platform',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg', reason: 'Compensation & Benefits', notes: 'Received an offer with a significantly better compensation package. My current project has wrapped up.',
    manager: 'Karthik Rao', doj: '2021-11-15', email: 'arjun.menon@concertidc.com', phone: '+91 90477 66554',
    noticeDays: 30, lwd: '2026-08-25', intendedLwd: '2026-08-25', submittedOn: '2026-07-10',
    clearances: {
      cto:     { status: 'approved', by: 'Delivery Head', on: '2026-07-12', summary: 'Approved · 30-day notice', noticeDays: 30 },
      manager: { status: 'cleared', by: 'Karthik Rao', on: '2026-07-25', summary: 'Project handover cleared',
                 checklist: [{ label: 'Projects reassigned', done: true }, { label: 'Responsibilities transferred', done: true }, { label: 'Documents & access handed over', done: true }, { label: 'Knowledge transfer completed', done: true }] },
      it:      { status: 'on-hold', summary: 'On hold — laptop & YubiKey not returned', holdReason: 'Company laptop and YubiKey not yet returned. Production server access remains active pending on-call handover.' },
      finance: { status: 'on-hold', summary: 'On hold — dues pending recovery', holdReason: 'Outstanding travel advance and a company loan balance are pending recovery. Final settlement on hold until adjusted against F&F.' },
    },
    exitInterview: { submitted: false },
    hrClosed: false,
  },
  {
    id: 'OFB-2410', name: 'Nisha Reddy', code: 'CC003', designation: 'UX Researcher', department: 'Design',
    avatar: 'https://randomuser.me/api/portraits/women/24.jpg', reason: 'Health / Personal Reasons', notes: 'Taking an extended break for personal reasons. Grateful for the support from the team during my time here.',
    manager: 'Karthik Rao', doj: '2020-06-10', email: 'nisha.reddy@concertidc.com', phone: '+91 98450 11223',
    noticeDays: 60, lwd: '2026-07-31', intendedLwd: '2026-07-31', submittedOn: '2026-05-25',
    clearances: {
      cto:     { status: 'approved', by: 'Delivery Head', on: '2026-05-27', summary: 'Approved · 60-day notice', noticeDays: 60 },
      manager: { status: 'cleared', by: 'Karthik Rao', on: '2026-07-18', summary: 'Project handover cleared',
                 checklist: [{ label: 'Projects reassigned', done: true }, { label: 'Responsibilities transferred', done: true }, { label: 'Documents & access handed over', done: true }, { label: 'Knowledge transfer completed', done: true }] },
      it:      { status: 'cleared', by: 'System Admin', on: '2026-07-29', summary: 'Assets recovered & access revoked',
                 checklist: [{ label: 'MacBook Air 13"', done: true }, { label: 'Access Card #3771', done: true }, { label: 'Email & SSO disabled', done: true }, { label: 'VPN & network access', done: true }] },
      finance: { status: 'cleared', by: 'Finance', on: '2026-07-30', summary: 'F&F settled · ₹2,88,000 net', net: 288000,
                 checklist: [{ label: 'Final pay & leave encashment computed', done: true }, { label: 'Reimbursements settled', done: true }, { label: 'Dues & advances recovered', done: true }, { label: 'F&F statement generated', done: true }] },
    },
    exitInterview: { submitted: true, rating: 5, recommend: 'Yes', enjoyed: 'Supportive teammates and a healthy design culture.', improve: 'More cross-team research collaboration.', suggest: 'Continue the flexible work policies.' },
    hrClosed: true, closedOn: '2026-07-31',
  },
]

/* ── derived helpers ── */

// The 4 department clearances that must complete before HR can close.
const DEPT_ORDER: DeptKey[] = ['cto', 'manager', 'it', 'finance']

export function isClearanceDone(cl: Clearance): boolean {
  return cl.status === 'approved' || cl.status === 'cleared'
}

export function clearedCount(c: HRCase): number {
  return DEPT_ORDER.filter(k => isClearanceDone(c.clearances[k])).length
}

export function hasHold(c: HRCase): boolean {
  return DEPT_ORDER.some(k => c.clearances[k].status === 'on-hold')
}

export function overallStage(c: HRCase): OverallStage {
  if (c.hrClosed) return 'completed'
  if (c.clearances.cto.status !== 'approved') return 'pending-cto'
  if (clearedCount(c) < 4) return 'in-progress'
  return 'pending-closure'
}

export const STAGE_META: Record<OverallStage, { label: string; color: string; bg: string }> = {
  'pending-cto':     { label: 'Pending CTO Approval', color: '#5A5F82', bg: 'rgba(91,95,130,0.14)' },
  'in-progress':     { label: 'Clearances In Progress', color: '#B26905', bg: 'rgba(217,119,6,0.12)' },
  'pending-closure': { label: 'Pending HR Closure', color: '#5B5FDE', bg: 'rgba(99,102,241,0.12)' },
  'completed':       { label: 'Completed', color: '#0A8A58', bg: 'rgba(14,168,106,0.12)' },
}

export function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
export function daysUntil(d: string) {
  return Math.round((new Date(d).getTime() - TODAY.getTime()) / 86400000)
}
