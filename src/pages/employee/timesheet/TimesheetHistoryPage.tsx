import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Clock, CheckCircle2, FileEdit, X, User, MessageSquare } from 'lucide-react'

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  navy:   '#1C2035',
  gold:   '#F2D000',
  border: '#E8EAF2',
  muted:  '#8B90A7',
  surface:'#F0F2F8',
  coral:  '#E84855',
  amber:  '#F5A623',
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_ABBR = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

// ─── Mock data ────────────────────────────────────────────────────────────────

interface HistoryEntry {
  id: string
  projectName: string
  projectCode: string
  projectColor: string
  taskIcon: string
  taskLabel: string
  duration: string
  comment: string
  timeAdded: string
}

interface ApprovalMeta {
  approvedBy: string
  role: string
  approvedOn: string
  remarks: string
}

interface ReturnMeta {
  returnedBy: string
  role: string
  returnedOn: string
  reason: string
}

type Status = 'approved' | 'submitted' | 'pending' | 'returned' | 'draft'

interface DayRecord {
  status: Status
  entries: HistoryEntry[]
  approvalMeta?: ApprovalMeta
  returnMeta?: ReturnMeta
}

// ─── Status colour map ────────────────────────────────────────────────────────

const STATUS_CFG: Record<Status, { bg: string; dot: string; label: string }> = {
  approved:  { bg: 'rgba(16,185,129,0.10)',  dot: '#10B981', label: 'Approved'  },
  submitted: { bg: 'rgba(234,179,8,0.10)',   dot: '#D97706', label: 'Submitted' },
  pending:   { bg: 'rgba(59,130,246,0.10)',  dot: '#3B82F6', label: 'Pending'   },
  returned:  { bg: 'rgba(249,115,22,0.10)',  dot: '#F97316', label: 'Returned'  },
  draft:     { bg: 'rgba(168,85,247,0.10)',  dot: '#A855F7', label: 'Draft'     },
}

const DATA: Record<string, DayRecord> = {
  '2026-05-01': {
    status: 'approved',
    approvalMeta: {
      approvedBy: 'Priya Mehta',
      role: 'Engineering Manager',
      approvedOn: '02 May 2026',
      remarks: 'All entries verified and aligned with sprint deliverables. Good work on the dashboard module.',
    },
    entries: [
      { id:'e1', projectName:'Concert IDC Platform',   projectCode:'CID-001', projectColor:'#6366F1', taskIcon:'⚙️', taskLabel:'Development',  duration:'4h',   timeAdded:'09:00 AM', comment:'Built the employee dashboard layout and sidebar navigation components with responsive behavior.' },
      { id:'e2', projectName:'HR Analytics Dashboard', projectCode:'CID-002', projectColor:'#0EA5E9', taskIcon:'🤝', taskLabel:'Meeting',       duration:'2h',   timeAdded:'01:00 PM', comment:'Sprint planning and backlog refinement with the PM team. Estimated 14 story points for the sprint.' },
      { id:'e3', projectName:'Concert IDC Platform',   projectCode:'CID-001', projectColor:'#6366F1', taskIcon:'🔍', taskLabel:'Code Review',   duration:'2h',   timeAdded:'03:00 PM', comment:'Reviewed 3 PRs for the authentication module — approved 2, requested changes on 1.' },
    ],
  },
  '2026-05-04': { status: 'approved',
    approvalMeta: { approvedBy: 'Raj Kumar', role: 'Project Manager', approvedOn: '05 May 2026', remarks: 'Payroll API work completed on schedule. Test coverage looks solid.' },
    entries: [
      { id:'e4', projectName:'Payroll Automation Suite', projectCode:'CID-003', projectColor:'#10B981', taskIcon:'⚙️', taskLabel:'Development',  duration:'5h',   timeAdded:'09:30 AM', comment:'Implemented payslip generation API and PDF export flow.' },
      { id:'e5', projectName:'Payroll Automation Suite', projectCode:'CID-003', projectColor:'#10B981', taskIcon:'🧪', taskLabel:'Testing / QA', duration:'2.5h', timeAdded:'02:30 PM', comment:'Wrote unit tests for the salary calculation service.' },
  ]},
  '2026-05-05': { status: 'approved',
    approvalMeta: { approvedBy: 'Priya Mehta', role: 'Engineering Manager', approvedOn: '06 May 2026', remarks: 'Good progress on the timesheet module. Documentation is thorough.' },
    entries: [
      { id:'e6', projectName:'Concert IDC Platform', projectCode:'CID-001', projectColor:'#6366F1', taskIcon:'⚙️', taskLabel:'Development',   duration:'6h', timeAdded:'09:00 AM', comment:'Timesheet module frontend — Add Timesheet and History pages.' },
      { id:'e7', projectName:'Concert IDC Platform', projectCode:'CID-001', projectColor:'#6366F1', taskIcon:'📄', taskLabel:'Documentation', duration:'2h', timeAdded:'03:00 PM', comment:'Updated the component library wiki with new design tokens.' },
  ]},
  '2026-05-06': { status: 'approved',
    approvalMeta: { approvedBy: 'Raj Kumar', role: 'Project Manager', approvedOn: '07 May 2026', remarks: 'UX feedback incorporated well. Design and dev hours balanced.' },
    entries: [
      { id:'e8', projectName:'Employee Self-Service Portal', projectCode:'CID-004', projectColor:'#F59E0B', taskIcon:'🎨', taskLabel:'Design',      duration:'3h', timeAdded:'10:00 AM', comment:'Redesigned the leave application flow based on UX feedback.' },
      { id:'e9', projectName:'Employee Self-Service Portal', projectCode:'CID-004', projectColor:'#F59E0B', taskIcon:'⚙️', taskLabel:'Development', duration:'3h', timeAdded:'01:00 PM', comment:'Integrated leave balance API with frontend components.' },
  ]},
  '2026-05-07': { status: 'approved',
    approvalMeta: { approvedBy: 'Priya Mehta', role: 'Engineering Manager', approvedOn: '08 May 2026', remarks: 'Mobile push notification work is solid. PRs reviewed promptly.' },
    entries: [
      { id:'e10',projectName:'Mobile Workforce App', projectCode:'CID-005', projectColor:'#EC4899', taskIcon:'⚙️', taskLabel:'Development',  duration:'5h', timeAdded:'09:15 AM', comment:'Push notification service integration and deep link handling.' },
      { id:'e11',projectName:'Mobile Workforce App', projectCode:'CID-005', projectColor:'#EC4899', taskIcon:'🤝', taskLabel:'Meeting',       duration:'1h', timeAdded:'02:00 PM', comment:'Daily standup and sprint review with mobile team.' },
      { id:'e12',projectName:'Mobile Workforce App', projectCode:'CID-005', projectColor:'#EC4899', taskIcon:'🔍', taskLabel:'Code Review',   duration:'2h', timeAdded:'03:00 PM', comment:'Reviewed PRs for biometric login and offline mode.' },
  ]},
  '2026-05-08': {
    status: 'returned',
    returnMeta: {
      returnedBy: 'Raj Kumar',
      role: 'Project Manager',
      returnedOn: '09 May 2026',
      reason: 'Deployment duration seems underreported — staging smoke tests typically take longer. Please review the time logged for the deployment entry and resubmit with accurate hours.',
    },
    entries: [
      { id:'e13',projectName:'Concert IDC Platform',      projectCode:'CID-001', projectColor:'#6366F1', taskIcon:'🚀', taskLabel:'Deployment', duration:'3h',   timeAdded:'10:00 AM', comment:'Deployed v1.4.2 to staging and ran smoke tests.' },
      { id:'e14',projectName:'Concert IDC Platform',      projectCode:'CID-001', projectColor:'#6366F1', taskIcon:'💬', taskLabel:'Support',    duration:'2h',   timeAdded:'01:00 PM', comment:'Resolved 4 client-reported bugs from the staging environment.' },
      { id:'e15',projectName:'Compliance Reporting Tool', projectCode:'CID-007', projectColor:'#14B8A6', taskIcon:'🔬', taskLabel:'Research',   duration:'2h',   timeAdded:'03:00 PM', comment:'Researched GDPR compliance requirements for data export module.' },
  ]},
  '2026-05-11': { status: 'approved',
    approvalMeta: { approvedBy: 'Raj Kumar', role: 'Project Manager', approvedOn: '12 May 2026', remarks: 'Leave module test coverage is excellent. Calendar sync working well.' },
    entries: [
      { id:'e16',projectName:'Leave Management System', projectCode:'CID-006', projectColor:'#8B5CF6', taskIcon:'⚙️', taskLabel:'Development',  duration:'4h', timeAdded:'09:00 AM', comment:'Holiday calendar sync and leave policy rule engine.' },
      { id:'e17',projectName:'Leave Management System', projectCode:'CID-006', projectColor:'#8B5CF6', taskIcon:'🧪', taskLabel:'Testing / QA', duration:'4h', timeAdded:'01:00 PM', comment:'End-to-end testing of the leave approval workflow.' },
  ]},
  '2026-05-12': { status: 'approved',
    approvalMeta: { approvedBy: 'Priya Mehta', role: 'Engineering Manager', approvedOn: '13 May 2026', remarks: 'Profile and org chart modules delivered ahead of schedule.' },
    entries: [
      { id:'e18',projectName:'Concert IDC Platform', projectCode:'CID-001', projectColor:'#6366F1', taskIcon:'⚙️', taskLabel:'Development', duration:'6h', timeAdded:'09:00 AM', comment:'Profile page, org structure, and tickets module implementation.' },
      { id:'e19',projectName:'Concert IDC Platform', projectCode:'CID-001', projectColor:'#6366F1', taskIcon:'🤝', taskLabel:'Meeting',     duration:'2h', timeAdded:'03:30 PM', comment:'Design review with stakeholders for v2 roadmap.' },
  ]},
  '2026-05-13': { status: 'submitted', entries: [
    { id:'e20',projectName:'HR Analytics Dashboard', projectCode:'CID-002', projectColor:'#0EA5E9', taskIcon:'⚙️', taskLabel:'Development', duration:'5h',   timeAdded:'09:00 AM', comment:'Built headcount and attrition trend charts using Recharts.' },
    { id:'e21',projectName:'HR Analytics Dashboard', projectCode:'CID-002', projectColor:'#0EA5E9', taskIcon:'🎨', taskLabel:'Design',     duration:'3h',   timeAdded:'02:00 PM', comment:'Dashboard layout polish — chart spacing and colour palette refinement.' },
  ]},
  '2026-05-14': { status: 'submitted', entries: [
    { id:'e22',projectName:'Onboarding Experience', projectCode:'CID-008', projectColor:'#F97316', taskIcon:'⚙️', taskLabel:'Development',   duration:'4h', timeAdded:'09:00 AM', comment:'Onboarding checklist component and first-login tour flow.' },
    { id:'e23',projectName:'Onboarding Experience', projectCode:'CID-008', projectColor:'#F97316', taskIcon:'📄', taskLabel:'Documentation', duration:'2h', timeAdded:'01:00 PM', comment:'Updated onboarding guide with new feature screenshots.' },
    { id:'e24',projectName:'Onboarding Experience', projectCode:'CID-008', projectColor:'#F97316', taskIcon:'🤝', taskLabel:'Meeting',       duration:'2h', timeAdded:'03:00 PM', comment:'Kickoff meeting for Phase 2 onboarding features.' },
  ]},
  '2026-05-15': { status: 'pending', entries: [
    { id:'e25',projectName:'Concert IDC Platform', projectCode:'CID-001', projectColor:'#6366F1', taskIcon:'⚙️', taskLabel:'Development',  duration:'5h', timeAdded:'09:00 AM', comment:'Reports and payroll pages with chart integration.' },
    { id:'e26',projectName:'Concert IDC Platform', projectCode:'CID-001', projectColor:'#6366F1', taskIcon:'🔍', taskLabel:'Code Review',  duration:'3h', timeAdded:'02:00 PM', comment:'Reviewed all open PRs before Friday cut-off.' },
  ]},
  '2026-05-18': { status: 'pending', entries: [
    { id:'e27',projectName:'Compliance Reporting Tool', projectCode:'CID-007', projectColor:'#14B8A6', taskIcon:'⚙️', taskLabel:'Development',  duration:'4.5h', timeAdded:'09:30 AM', comment:'Export module — CSV and Excel generation with column mapping.' },
    { id:'e28',projectName:'Compliance Reporting Tool', projectCode:'CID-007', projectColor:'#14B8A6', taskIcon:'🧪', taskLabel:'Testing / QA', duration:'3h',   timeAdded:'02:00 PM', comment:'Regression suite for the reporting module.' },
  ]},
  '2026-05-19': { status: 'pending', entries: [
    { id:'e29',projectName:'Concert IDC Platform', projectCode:'CID-001', projectColor:'#6366F1', taskIcon:'⚙️', taskLabel:'Development', duration:'6h', timeAdded:'09:00 AM', comment:'Sidebar navigation, header, and layout shell components.' },
    { id:'e30',projectName:'Concert IDC Platform', projectCode:'CID-001', projectColor:'#6366F1', taskIcon:'🚀', taskLabel:'Deployment',  duration:'2h', timeAdded:'03:00 PM', comment:'CI pipeline setup and Docker build configuration.' },
  ]},
  '2026-05-20': { status: 'submitted', entries: [
    { id:'e31',projectName:'HR Analytics Dashboard', projectCode:'CID-002', projectColor:'#0EA5E9', taskIcon:'⚙️', taskLabel:'Development', duration:'4h',   timeAdded:'09:00 AM', comment:'Filter controls and date-range picker for the analytics dashboard.' },
    { id:'e32',projectName:'HR Analytics Dashboard', projectCode:'CID-002', projectColor:'#0EA5E9', taskIcon:'🔬', taskLabel:'Research',    duration:'2.5h', timeAdded:'01:30 PM', comment:'Evaluated charting libraries — Recharts vs Victory vs Nivo.' },
  ]},
  '2026-05-21': { status: 'draft', entries: [
    { id:'e33',projectName:'Concert IDC Platform', projectCode:'CID-001', projectColor:'#6366F1', taskIcon:'⚙️', taskLabel:'Development', duration:'3.5h', timeAdded:'09:00 AM', comment:'Timesheet History page — date timeline and entry detail view.' },
  ]},
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
}

function totalHoursForDay(record: DayRecord | undefined) {
  if (!record) return 0
  return record.entries.reduce((s, e) => s + parseFloat(e.duration.replace('h', '')), 0)
}

function fmtHours(h: number) {
  return Number.isInteger(h) ? `${h}h` : `${h}h`
}

// ─── Pending Panel ───────────────────────────────────────────────────────────

function PendingPanel({ iso, onNavigate }: { iso: string; onNavigate: (id: string) => void }) {
  const dateObj = new Date(iso + 'T00:00:00')
  const displayDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div style={{
      background: '#fff', borderRadius: 18, marginTop: 16,
      padding: '52px 24px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      animation: 'tsSlideDown 0.22s ease',
    }}>
      <style>{`@keyframes tsSlideDown { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }`}</style>

      {/* Icon */}
      <div style={{
        width: 64, height: 64, borderRadius: 20, marginBottom: 20,
        background: 'rgba(59,130,246,0.10)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <line x1="12" y1="14" x2="12" y2="18"/>
          <line x1="10" y1="16" x2="14" y2="16"/>
        </svg>
      </div>

      {/* Title */}
      <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, marginBottom: 8, textAlign: 'center' }}>
        No Timesheet Submitted
      </div>

      {/* Subtext */}
      <div style={{ fontSize: 13.5, color: C.muted, lineHeight: 1.7, textAlign: 'center', maxWidth: 380, marginBottom: 28 }}>
        You haven't logged any time for <span style={{ fontWeight: 600, color: C.navy }}>{displayDate}</span>.<br />
        Add your entries now to keep your timesheet up to date.
      </div>

      {/* Add Timesheet button */}
      <button
        onClick={() => onNavigate('timesheet-add')}
        style={{
          height: 44, paddingLeft: 24, paddingRight: 24, borderRadius: 12,
          border: 'none', background: C.navy, color: '#fff',
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#252B45' }}
        onMouseLeave={e => { e.currentTarget.style.background = C.navy }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Timesheet
      </button>
    </div>
  )
}

// ─── Submitted Panel ─────────────────────────────────────────────────────────

function SubmittedPanel({ iso }: { iso: string }) {
  const record = DATA[iso]
  if (!record || record.status !== 'submitted') return null

  const hours = totalHoursForDay(record)
  const dateObj = new Date(iso + 'T00:00:00')
  const displayDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div style={{
      background: '#fff', borderRadius: 18, marginTop: 16, overflow: 'hidden',
      animation: 'tsSlideDown 0.22s ease',
    }}>

      {/* ── Status banner ── */}
      <div style={{
        background: 'rgba(217,119,6,0.05)',
        borderBottom: '1px solid rgba(217,119,6,0.14)',
        padding: '20px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Icon */}
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: 'rgba(217,119,6,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle2 size={22} style={{ color: '#D97706' }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#B45309' }}>Timesheet Submitted</span>
              <div style={{
                background: 'rgba(217,119,6,0.12)', padding: '2px 10px',
                borderRadius: 20, border: '1px solid rgba(217,119,6,0.22)',
              }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', color: '#D97706' }}>SUBMITTED</span>
              </div>
            </div>
            <div style={{ fontSize: 13, color: C.muted }}>{displayDate}</div>
          </div>
        </div>

        {/* Hours + entry count */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          background: 'rgba(28,32,53,0.06)', padding: '8px 14px',
          borderRadius: 10, border: `1px solid ${C.border}`, flexShrink: 0,
        }}>
          <Clock size={13} style={{ color: C.muted }} />
          <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{fmtHours(hours)}</span>
          <span style={{ fontSize: 12, color: C.muted }}>· {record.entries.length} {record.entries.length === 1 ? 'entry' : 'entries'}</span>
        </div>
      </div>

      {/* ── Entries list ── */}
      <div style={{ padding: '20px 28px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
          Work Entries
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>
          This timesheet is awaiting approval. No changes can be made at this time.
        </div>

        <div style={{ position: 'relative' }}>
          {/* Vertical connector line */}
          <div style={{
            position: 'absolute', left: 19, top: 14,
            width: 2,
            height: `calc(100% - 28px)`,
            background: 'linear-gradient(to bottom, rgba(217,119,6,0.35), rgba(217,119,6,0.04))',
            borderRadius: 2,
          }} />

          {record.entries.map((entry, i) => {
            const isLast = i === record.entries.length - 1
            return (
              <div key={entry.id} style={{
                display: 'flex', gap: 20,
                marginBottom: isLast ? 0 : 20,
                position: 'relative',
              }}>
                {/* Node dot */}
                <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: '#fff', border: '2.5px solid #D97706',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1, position: 'relative',
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D97706' }} />
                  </div>
                </div>

                {/* Entry card */}
                <div key={entry.id} style={{
                  background: C.surface, borderRadius: 12,
                  padding: '14px 16px', border: `1px solid ${C.border}`,
                  flex: 1,
                }}>
                  {/* Top row: project | activity | time + time added */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                    {/* Project - text only */}
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{entry.projectName}</span>

                    {/* Separator */}
                    <div style={{ width: 1, height: 16, background: C.border }} />

                    {/* Activity - text only, no emoji */}
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{entry.taskLabel}</span>

                    {/* Separator */}
                    <div style={{ width: 1, height: 16, background: C.border }} />

                    {/* Time - text only */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} style={{ color: C.muted }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{entry.duration}</span>
                    </div>

                    {/* Time added — pushed right */}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} style={{ color: C.muted }} />
                      <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>Added {entry.timeAdded}</span>
                    </div>
                  </div>

                  {/* Comment */}
                  {entry.comment && (
                    <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65 }}>
                      {entry.comment}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Returned Panel ──────────────────────────────────────────────────────────

function ReturnedPanel({ iso, onNavigate }: { iso: string; onNavigate: (id: string) => void }) {
  const record = DATA[iso]
  if (!record || record.status !== 'returned') return null

  const { returnMeta } = record
  const hours = totalHoursForDay(record)
  const dateObj = new Date(iso + 'T00:00:00')
  const displayDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div style={{
      background: '#fff', borderRadius: 18, marginTop: 16, overflow: 'hidden',
      animation: 'tsSlideDown 0.22s ease',
    }}>

      {/* ── Return banner ── */}
      <div style={{
        background: 'rgba(249,115,22,0.05)',
        borderBottom: '1px solid rgba(249,115,22,0.14)',
        padding: '20px 28px',
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1, minWidth: 0 }}>
          {/* Icon */}
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: 'rgba(249,115,22,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={22} style={{ color: '#F97316' }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#C2410C' }}>Timesheet Returned</span>
              <div style={{
                background: 'rgba(249,115,22,0.12)', padding: '2px 10px',
                borderRadius: 20, border: '1px solid rgba(249,115,22,0.22)',
              }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', color: '#F97316' }}>RETURNED</span>
              </div>
            </div>

            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>{displayDate}</div>

            {/* Meta row — full width, space-between */}
            {returnMeta && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%',
                background: 'rgba(249,115,22,0.04)',
                border: '1px solid rgba(249,115,22,0.14)',
                borderRadius: 12, padding: '14px 20px',
              }}>
                {/* Returned by */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                    background: 'rgba(249,115,22,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <User size={14} style={{ color: '#F97316' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Returned by</div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{returnMeta.returnedBy}</div>
                  </div>
                </div>

                <div style={{ width: 1, height: 36, background: 'rgba(249,115,22,0.2)', flexShrink: 0 }} />

                {/* Role */}
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Role</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{returnMeta.role}</div>
                </div>

                <div style={{ width: 1, height: 36, background: 'rgba(249,115,22,0.2)', flexShrink: 0 }} />

                {/* Returned on */}
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Returned on</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{returnMeta.returnedOn}</div>
                </div>

                <div style={{ width: 1, height: 36, background: 'rgba(249,115,22,0.2)', flexShrink: 0 }} />

                {/* Hours */}
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Hours Logged</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Clock size={13} style={{ color: '#F97316' }} />
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{fmtHours(hours)}</span>
                    <span style={{ fontSize: 12, color: C.muted }}>· {record.entries.length} {record.entries.length === 1 ? 'entry' : 'entries'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Reason */}
            {returnMeta?.reason && (
              <div style={{
                marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 8,
                background: 'rgba(249,115,22,0.06)', padding: '10px 14px',
                borderRadius: 10, border: '1px solid rgba(249,115,22,0.16)',
              }}>
                <MessageSquare size={13} style={{ color: '#F97316', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: '#9A3412', lineHeight: 1.65, fontStyle: 'italic' }}>
                  "{returnMeta.reason}"
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Edit icon — top right */}
        <button
          onClick={() => onNavigate('timesheet-add')}
          title="Edit & Resubmit"
          style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            border: '1px solid rgba(249,115,22,0.28)',
            background: 'rgba(249,115,22,0.08)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#F97316', transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#F97316'
            e.currentTarget.style.borderColor = '#F97316'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(249,115,22,0.08)'
            e.currentTarget.style.borderColor = 'rgba(249,115,22,0.28)'
            e.currentTarget.style.color = '#F97316'
          }}
        >
          <FileEdit size={16} />
        </button>
      </div>

      {/* ── Entries list ── */}
      <div style={{ padding: '20px 28px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 4 }}>
          Work Entries
        </div>
        <div style={{ fontSize: 12, color: C.muted, marginBottom: 20 }}>
          Review the entries below, make corrections, and resubmit your timesheet.
        </div>

        <div style={{ position: 'relative' }}>
          {/* Vertical connector line */}
          <div style={{
            position: 'absolute', left: 19, top: 14,
            width: 2,
            height: `calc(100% - 28px)`,
            background: 'linear-gradient(to bottom, rgba(249,115,22,0.35), rgba(249,115,22,0.04))',
            borderRadius: 2,
          }} />

          {record.entries.map((entry, i) => {
            const isLast = i === record.entries.length - 1
            return (
              <div key={entry.id} style={{
                display: 'flex', gap: 20,
                marginBottom: isLast ? 0 : 20,
                position: 'relative',
              }}>
                {/* Node dot */}
                <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: '#fff', border: '2.5px solid #F97316',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1, position: 'relative',
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F97316' }} />
                  </div>
                </div>

                {/* Entry card */}
                <div key={entry.id} style={{
                  background: C.surface, borderRadius: 12,
                  padding: '14px 16px', border: `1px solid ${C.border}`,
                  flex: 1,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                    {/* Project - text only */}
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{entry.projectName}</span>

                    {/* Separator */}
                    <div style={{ width: 1, height: 16, background: C.border }} />

                    {/* Activity - text only, no emoji */}
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{entry.taskLabel}</span>

                    {/* Separator */}
                    <div style={{ width: 1, height: 16, background: C.border }} />

                    {/* Time - text only */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} style={{ color: C.muted }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{entry.duration}</span>
                    </div>

                    {/* Time added — pushed right */}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} style={{ color: C.muted }} />
                      <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>Added {entry.timeAdded}</span>
                    </div>
                  </div>

                  {/* Comment */}
                  {entry.comment && (
                    <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65 }}>
                      {entry.comment}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Approved Detail Panel ────────────────────────────────────────────────────

function ApprovedDetail({ iso, onClose }: { iso: string; onClose: () => void }) {
  const record = DATA[iso]
  if (!record || record.status !== 'approved' || !record.approvalMeta) return null

  const { approvalMeta } = record
  const hours = totalHoursForDay(record)
  const dateObj = new Date(iso + 'T00:00:00')
  const displayDate = dateObj.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div style={{
      background: '#fff', borderRadius: 18, marginTop: 16, overflow: 'hidden',
      animation: 'tsSlideDown 0.22s ease',
    }}>
      <style>{`@keyframes tsSlideDown { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }`}</style>

      {/* ── Approval banner ── */}
      <div style={{
        background: 'rgba(16,185,129,0.05)',
        borderBottom: '1px solid rgba(16,185,129,0.14)',
        padding: '20px 28px',
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: 1, minWidth: 0 }}>
          {/* Icon */}
          <div style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: 'rgba(16,185,129,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle2 size={22} style={{ color: '#10B981' }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: '#059669' }}>Timesheet Approved</span>
              <div style={{
                background: 'rgba(16,185,129,0.12)', padding: '2px 10px',
                borderRadius: 20, border: '1px solid rgba(16,185,129,0.22)',
              }}>
                <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em', color: '#10B981' }}>APPROVED</span>
              </div>
            </div>

            <div style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>{displayDate}</div>

            {/* Meta row — full width, space-between */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              width: '100%',
              background: 'rgba(16,185,129,0.04)',
              border: '1px solid rgba(16,185,129,0.12)',
              borderRadius: 12, padding: '14px 20px',
            }}>
              {/* Approved by */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                  background: 'rgba(16,185,129,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <User size={14} style={{ color: '#10B981' }} />
                </div>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Approved by</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{approvalMeta.approvedBy}</div>
                </div>
              </div>

              <div style={{ width: 1, height: 36, background: 'rgba(16,185,129,0.2)', flexShrink: 0 }} />

              {/* Role */}
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Role</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{approvalMeta.role}</div>
              </div>

              <div style={{ width: 1, height: 36, background: 'rgba(16,185,129,0.2)', flexShrink: 0 }} />

              {/* Approved on */}
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Approved on</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy }}>{approvalMeta.approvedOn}</div>
              </div>

              <div style={{ width: 1, height: 36, background: 'rgba(16,185,129,0.2)', flexShrink: 0 }} />

              {/* Total hours */}
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Hours Logged</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={13} style={{ color: '#10B981' }} />
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{fmtHours(hours)}</span>
                  <span style={{ fontSize: 12, color: C.muted }}>· {record.entries.length} {record.entries.length === 1 ? 'entry' : 'entries'}</span>
                </div>
              </div>
            </div>

            {/* Remarks */}
            {approvalMeta.remarks && (
              <div style={{
                marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 8,
                background: 'rgba(16,185,129,0.06)', padding: '10px 14px',
                borderRadius: 10, border: '1px solid rgba(16,185,129,0.14)',
              }}>
                <MessageSquare size={13} style={{ color: '#10B981', marginTop: 2, flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: '#047857', lineHeight: 1.65, fontStyle: 'italic' }}>
                  "{approvalMeta.remarks}"
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            width: 32, height: 32, borderRadius: 10, flexShrink: 0,
            border: `1px solid ${C.border}`, background: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: C.muted,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.navy }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = C.muted }}
        >
          <X size={14} />
        </button>
      </div>

      {/* ── Timeline entries ── */}
      <div style={{ padding: '24px 28px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 22 }}>
          Work Entries &mdash; {record.entries.length} {record.entries.length === 1 ? 'entry' : 'entries'}
        </div>

        <div style={{ position: 'relative' }}>
          {/* Vertical connector line */}
          <div style={{
            position: 'absolute', left: 19, top: 14,
            width: 2,
            height: `calc(100% - 28px)`,
            background: 'linear-gradient(to bottom, rgba(16,185,129,0.35), rgba(16,185,129,0.04))',
            borderRadius: 2,
          }} />

          {record.entries.map((entry, i) => {
            const isLast = i === record.entries.length - 1
            return (
              <div key={entry.id} style={{
                display: 'flex', gap: 20,
                marginBottom: isLast ? 0 : 20,
                position: 'relative',
              }}>
                {/* Node dot */}
                <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: '#fff', border: '2.5px solid #10B981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1, position: 'relative',
                  }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                  </div>
                </div>

                {/* Entry card */}
                <div style={{
                  flex: 1, background: C.surface, borderRadius: 12,
                  padding: '14px 16px', border: `1px solid ${C.border}`,
                }}>
                  {/* Project | Activity | Time row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 9 }}>
                    {/* Project - text only */}
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{entry.projectName}</span>

                    {/* Separator */}
                    <div style={{ width: 1, height: 16, background: C.border }} />

                    {/* Activity - text only, no emoji */}
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{entry.taskLabel}</span>

                    {/* Separator */}
                    <div style={{ width: 1, height: 16, background: C.border }} />

                    {/* Time - text only */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} style={{ color: C.muted }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{entry.duration}</span>
                    </div>

                    {/* Time added — pushed to right */}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={10} style={{ color: C.muted }} />
                      <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>Added {entry.timeAdded}</span>
                    </div>
                  </div>

                  {/* Comment */}
                  {entry.comment && (
                    <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65 }}>
                      {entry.comment}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TimesheetHistoryPage({ onNavigate }: { onNavigate: (id: string) => void }) {
  const todayISO  = new Date().toISOString().slice(0, 10)
  const todayYear = new Date().getFullYear()
  const todayMonth= new Date().getMonth()

  const [year,         setYear]         = useState(todayYear)
  const [month,        setMonth]        = useState(todayMonth)
  const [selectedISO,  setSelectedISO]  = useState(todayISO)
  const [detailISO,    setDetailISO]    = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const dateRefs  = useRef<Record<string, HTMLButtonElement | null>>({})

  const totalDays  = daysInMonth(year, month)
  const days       = Array.from({ length: totalDays }, (_, i) => i + 1)

  // Month‑level summary
  const monthEntries = Object.entries(DATA).filter(([k]) =>
    k.startsWith(`${year}-${String(month + 1).padStart(2,'0')}`)
  )
  const approvedDays  = monthEntries.filter(([, v]) => v.status === 'approved').length
  const pendingDays   = monthEntries.filter(([, v]) => v.status === 'pending').length
  const draftDays     = monthEntries.filter(([, v]) => v.status === 'draft').length
  const returnedDays  = monthEntries.filter(([, v]) => v.status === 'returned').length
  const submittedDays = monthEntries.filter(([, v]) => v.status === 'submitted').length
  const totalMonthH   = monthEntries.reduce((s, [, v]) => s + totalHoursForDay(v), 0)

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  // Scroll selected date into view
  useEffect(() => {
    const el = dateRefs.current[selectedISO]
    if (el && scrollRef.current) {
      const container = scrollRef.current
      const elLeft    = el.offsetLeft
      const elWidth   = el.offsetWidth
      const cWidth    = container.offsetWidth
      container.scrollTo({ left: elLeft - cWidth / 2 + elWidth / 2, behavior: 'smooth' })
    }
  }, [selectedISO])

  // When month changes, select first day and clear detail panel
  useEffect(() => {
    const first = isoDate(year, month, 1)
    const isCurrentMonth = year === todayYear && month === todayMonth
    setSelectedISO(isCurrentMonth ? todayISO : first)
    setDetailISO(null)
  }, [year, month])

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        .ts-scroll::-webkit-scrollbar { display: none }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.navy, letterSpacing: '-0.4px', margin: 0, marginBottom: 4 }}>
            Timesheet History
          </h1>
          <p style={{ fontSize: 13.5, color: '#787878', fontWeight: 500, margin: 0 }}>
            Browse and review your submitted and drafted timesheets
          </p>
        </div>

        {/* Month stats chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(59,130,246,0.08)', padding: '7px 14px',
            borderRadius: 10, border: '1px solid rgba(59,130,246,0.2)',
          }}>
            <FileEdit size={13} style={{ color: '#3B82F6' }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#3B82F6' }}>{pendingDays} Pending</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(217,119,6,0.08)', padding: '7px 14px',
            borderRadius: 10, border: '1px solid rgba(217,119,6,0.2)',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#D97706' }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#D97706' }}>{submittedDays} Submitted</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(249,115,22,0.08)', padding: '7px 14px',
            borderRadius: 10, border: '1px solid rgba(249,115,22,0.2)',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#F97316' }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#F97316' }}>{returnedDays} Returned</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(168,85,247,0.08)', padding: '7px 14px',
            borderRadius: 10, border: '1px solid rgba(168,85,247,0.2)',
          }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#A855F7' }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#A855F7' }}>{draftDays} Draft</span>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(16,185,129,0.08)', padding: '7px 14px',
            borderRadius: 10, border: '1px solid rgba(16,185,129,0.18)',
          }}>
            <CheckCircle2 size={13} style={{ color: '#10B981' }} />
            <span style={{ fontSize: 12.5, fontWeight: 700, color: '#10B981' }}>{approvedDays} Approved</span>
          </div>
        </div>
      </div>

      {/* ── Main Card ── */}
      <div style={{
        background: '#fff',
        borderRadius: 18, overflow: 'hidden',
      }}>

        {/* Month nav row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px',           background: 'linear-gradient(135deg, #FAFBFF 0%, #F6F7FF 100%)',
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, letterSpacing: '-0.3px' }}>
              {MONTHS[month]} {year}
            </div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 1 }}>
              {totalDays} days &nbsp;·&nbsp; {monthEntries.length} days with entries
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { icon: ChevronLeft,  label: 'Previous month', action: prevMonth },
              { icon: ChevronRight, label: 'Next month',     action: nextMonth },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                title={label}
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  border: `1px solid ${C.border}`,
                  background: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.muted, transition: 'all 0.12s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = C.navy
                  e.currentTarget.style.borderColor = C.navy
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.borderColor = C.border
                  e.currentTarget.style.color = C.muted
                }}
              >
                <Icon size={16} strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Date Timeline ── */}
        <div style={{ padding: '16px 24px 0' }}>
          <div
            ref={scrollRef}
            className="ts-scroll"
            style={{
              display: 'flex', gap: 6,
              overflowX: 'auto', paddingBottom: 16,
              scrollbarWidth: 'none',
            }}
          >
            {days.map(day => {
              const iso     = isoDate(year, month, day)
              const date    = new Date(iso + 'T00:00:00')
              const dow     = date.getDay()
              const isToday = iso === todayISO
              const record  = DATA[iso]
              const isWeekend = dow === 0 || dow === 6

              const cfg        = record ? STATUS_CFG[record.status] : null
              const cardBg     = isToday
                ? C.navy
                : isWeekend
                ? 'rgba(228,230,239,0.45)'
                : cfg
                ? cfg.bg
                : '#fff'
              const cardBorder = isToday
                ? C.navy
                : cfg
                ? cfg.dot + '40'
                : C.border

              return (
                <button
                  key={iso}
                  ref={el => { dateRefs.current[iso] = el }}
                  className="ts-date-btn"
                  onClick={() => {
                    setSelectedISO(iso)
                    if (record?.status === 'approved') {
                      setDetailISO(prev => prev === iso ? null : iso)
                    } else {
                      setDetailISO(null)
                    }
                  }}
                  style={{
                    flexShrink: 0,
                    width: 56, minWidth: 56, height: 64,
                    borderRadius: 12,
                    boxSizing: 'border-box',
                    border: `1px solid ${cardBorder}`,
                    background: cardBg,
                    cursor: 'pointer',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 4,
                    position: 'relative',
                    fontFamily: "'DM Sans', system-ui, sans-serif",
                  }}
                >
                  {/* Day abbrev */}
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
                    color: isToday ? 'rgba(255,255,255,0.6)' : isWeekend ? '#B8BCCC' : C.muted,
                    textTransform: 'uppercase',
                  }}>
                    {DAY_ABBR[dow]}
                  </span>

                  {/* Date number */}
                  <span style={{
                    fontSize: 16, fontWeight: 800, lineHeight: 1,
                    color: isToday ? '#fff' : isWeekend ? '#C5C8D8' : C.navy,
                  }}>
                    {day}
                  </span>

                </button>
              )
            })}
          </div>

          {/* ── Legend ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 16 }}>
            {(Object.entries(STATUS_CFG) as [Status, typeof STATUS_CFG[Status]][]).map(([, cfg]) => (
              <div key={cfg.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 11.5, fontWeight: 500, color: C.muted }}>{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Approved Detail Panel ── */}
      {detailISO && DATA[detailISO]?.status === 'approved' && (
        <ApprovedDetail iso={detailISO} onClose={() => setDetailISO(null)} />
      )}

      {/* ── Pending Panel ── */}
      {DATA[selectedISO]?.status === 'pending' && (
        <PendingPanel iso={selectedISO} onNavigate={onNavigate} />
      )}

      {/* ── Submitted Panel ── */}
      {DATA[selectedISO]?.status === 'submitted' && (
        <SubmittedPanel iso={selectedISO} />
      )}

      {/* ── Returned Panel ── */}
      {DATA[selectedISO]?.status === 'returned' && (
        <ReturnedPanel iso={selectedISO} onNavigate={onNavigate} />
      )}

    </div>
  )
}
