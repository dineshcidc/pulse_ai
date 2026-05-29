import { useState, Fragment } from 'react'
import {
  CheckCircle, XCircle, Clock, ChevronDown, Check,
  Search, Calendar, Eye, X, ArrowLeft,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type TSStatus = 'pending' | 'approved' | 'rejected'

interface TSEntry {
  id: string
  projectName: string
  projectColor: string
  taskLabel: string
  duration: string
  comment: string
  timeAdded: string
}

interface TimesheetRow {
  id: number
  employee: string
  avatar: number
  designation: string
  project: string
  projectColor: string
  projectManager: string
  date: string
  dateLabel: string
  hours: number
  status: TSStatus
  entries: TSEntry[]
  returnReason?: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ROWS: TimesheetRow[] = [
  {
    id: 1, employee: 'Sarah Johnson', avatar: 47, designation: 'Frontend Dev',
    project: 'Pulse.AI v2', projectColor: '#6366F1', projectManager: 'Raj Kumar',
    date: '2026-05-21', dateLabel: 'May 21, 2026', hours: 8, status: 'pending',
    entries: [
      { id:'e1a', projectName:'Pulse.AI v2', projectColor:'#6366F1', taskLabel:'Development',  duration:'4h', timeAdded:'09:00 AM', comment:'Implemented dashboard stat cards and responsive sidebar layout.' },
      { id:'e1b', projectName:'Pulse.AI v2', projectColor:'#6366F1', taskLabel:'Code Review',  duration:'2h', timeAdded:'01:30 PM', comment:'Reviewed 3 PRs for the authentication module.' },
      { id:'e1c', projectName:'Pulse.AI v2', projectColor:'#6366F1', taskLabel:'Testing / QA', duration:'2h', timeAdded:'03:30 PM', comment:'Mobile breakpoint testing and cross-browser fixes.' },
    ],
  },
  {
    id: 2, employee: 'Mike Chen', avatar: 33, designation: 'QA Engineer',
    project: 'HDFC Portal', projectColor: '#0EA5E9', projectManager: 'Priya Mehta',
    date: '2026-05-21', dateLabel: 'May 21, 2026', hours: 7, status: 'pending',
    entries: [
      { id:'e2a', projectName:'HDFC Portal', projectColor:'#0EA5E9', taskLabel:'Testing / QA', duration:'4h', timeAdded:'09:30 AM', comment:'End-to-end test coverage for the payment flow module.' },
      { id:'e2b', projectName:'HDFC Portal', projectColor:'#0EA5E9', taskLabel:'Documentation', duration:'3h', timeAdded:'02:00 PM', comment:'Updated test case registry and edge-case documentation.' },
    ],
  },
  {
    id: 3, employee: 'Emma Wilson', avatar: 44, designation: 'UI/UX Designer',
    project: 'Pulse.AI v2', projectColor: '#6366F1', projectManager: 'Raj Kumar',
    date: '2026-05-20', dateLabel: 'May 20, 2026', hours: 9, status: 'pending',
    entries: [
      { id:'e3a', projectName:'Pulse.AI v2', projectColor:'#6366F1', taskLabel:'Design',       duration:'5h', timeAdded:'09:00 AM', comment:'Figma component revisions for the manager dashboard.' },
      { id:'e3b', projectName:'Pulse.AI v2', projectColor:'#6366F1', taskLabel:'Documentation', duration:'2h', timeAdded:'02:30 PM', comment:'Design token updates and developer handoff documentation.' },
      { id:'e3c', projectName:'Pulse.AI v2', projectColor:'#6366F1', taskLabel:'Meeting',       duration:'2h', timeAdded:'04:30 PM', comment:'Design review sync with engineering lead.' },
    ],
  },
  {
    id: 4, employee: 'David Brown', avatar: 38, designation: 'Backend Dev',
    project: 'TechCorp ERP', projectColor: '#10B981', projectManager: 'Priya Mehta',
    date: '2026-05-20', dateLabel: 'May 20, 2026', hours: 8, status: 'approved',
    entries: [
      { id:'e4a', projectName:'TechCorp ERP', projectColor:'#10B981', taskLabel:'Development',  duration:'5h', timeAdded:'09:00 AM', comment:'Database schema migration scripts and index optimisation.' },
      { id:'e4b', projectName:'TechCorp ERP', projectColor:'#10B981', taskLabel:'Testing / QA', duration:'3h', timeAdded:'02:00 PM', comment:'Validation tests for the new employee records table.' },
    ],
  },
  {
    id: 5, employee: 'Lisa Garcia', avatar: 25, designation: 'DevOps Eng',
    project: 'Pulse.AI v2', projectColor: '#6366F1', projectManager: 'Raj Kumar',
    date: '2026-05-20', dateLabel: 'May 20, 2026', hours: 6, status: 'approved',
    entries: [
      { id:'e5a', projectName:'Pulse.AI v2', projectColor:'#6366F1', taskLabel:'Code Review',  duration:'3h', timeAdded:'09:30 AM', comment:'Reviewed 3 open PRs for deployment scripts and infra changes.' },
      { id:'e5b', projectName:'Pulse.AI v2', projectColor:'#6366F1', taskLabel:'Development',  duration:'3h', timeAdded:'01:00 PM', comment:'CI/CD pipeline configuration updates and environment variables cleanup.' },
    ],
  },
  {
    id: 6, employee: 'Tom Davis', avatar: 20, designation: 'Full Stack Dev',
    project: 'HDFC Portal', projectColor: '#0EA5E9', projectManager: 'Priya Mehta',
    date: '2026-05-19', dateLabel: 'May 19, 2026', hours: 8, status: 'approved',
    entries: [
      { id:'e6a', projectName:'HDFC Portal', projectColor:'#0EA5E9', taskLabel:'Development', duration:'5h', timeAdded:'09:00 AM', comment:'REST API integration for the account summary endpoint.' },
      { id:'e6b', projectName:'HDFC Portal', projectColor:'#0EA5E9', taskLabel:'Development', duration:'3h', timeAdded:'02:30 PM', comment:'Error handling improvements and request retry logic.' },
    ],
  },
  {
    id: 7, employee: 'Priya Sharma', avatar: 10, designation: 'BA Analyst',
    project: 'TechCorp ERP', projectColor: '#10B981', projectManager: 'Raj Kumar',
    date: '2026-05-19', dateLabel: 'May 19, 2026', hours: 7, status: 'rejected',
    returnReason: 'The hours logged for the documentation task appear inconsistent with the scope described. The BRD update alone should not require 4 hours — please review and resubmit with accurate time entries.',
    entries: [
      { id:'e7a', projectName:'TechCorp ERP', projectColor:'#10B981', taskLabel:'Documentation', duration:'4h', timeAdded:'09:00 AM', comment:'Requirements gathering session and meeting notes with client stakeholders.' },
      { id:'e7b', projectName:'TechCorp ERP', projectColor:'#10B981', taskLabel:'Meeting',       duration:'3h', timeAdded:'01:30 PM', comment:'Updated BRD document for module 3 based on stakeholder feedback.' },
    ],
  },
  {
    id: 8, employee: 'James Wilson', avatar: 12, designation: 'Backend Dev',
    project: 'Pulse.AI v2', projectColor: '#6366F1', projectManager: 'Raj Kumar',
    date: '2026-05-18', dateLabel: 'May 18, 2026', hours: 4, status: 'rejected',
    returnReason: 'Only a partial code review was completed. Please log only the hours actually worked and resubmit. Incomplete entries should not be submitted until the task is fully done.',
    entries: [
      { id:'e8a', projectName:'Pulse.AI v2', projectColor:'#6366F1', taskLabel:'Code Review', duration:'4h', timeAdded:'10:00 AM', comment:'Partial review of authentication service PR — interrupted by unplanned client call.' },
    ],
  },
  {
    id: 9, employee: 'Anjali Singh', avatar: 36, designation: 'Product Analyst',
    project: 'HDFC Portal', projectColor: '#0EA5E9', projectManager: 'Priya Mehta',
    date: '2026-05-18', dateLabel: 'May 18, 2026', hours: 8, status: 'pending',
    entries: [
      { id:'e9a', projectName:'HDFC Portal', projectColor:'#0EA5E9', taskLabel:'Documentation', duration:'3h', timeAdded:'09:30 AM', comment:'Sprint 3 retrospective documentation and acceptance criteria updates.' },
      { id:'e9b', projectName:'HDFC Portal', projectColor:'#0EA5E9', taskLabel:'Meeting',       duration:'2h', timeAdded:'12:30 PM', comment:'Product backlog grooming session for the upcoming sprint.' },
      { id:'e9c', projectName:'HDFC Portal', projectColor:'#0EA5E9', taskLabel:'Research',      duration:'3h', timeAdded:'03:00 PM', comment:'Competitive analysis on notification UX patterns.' },
    ],
  },
  {
    id: 10, employee: 'Karthik Nair', avatar: 15, designation: 'Frontend Dev',
    project: 'TechCorp ERP', projectColor: '#10B981', projectManager: 'Priya Mehta',
    date: '2026-05-17', dateLabel: 'May 17, 2026', hours: 8, status: 'approved',
    entries: [
      { id:'e10a', projectName:'TechCorp ERP', projectColor:'#10B981', taskLabel:'Testing / QA', duration:'5h', timeAdded:'09:00 AM', comment:'User acceptance testing for the ERP dashboard module and bug reporting.' },
      { id:'e10b', projectName:'TechCorp ERP', projectColor:'#10B981', taskLabel:'Development',  duration:'3h', timeAdded:'02:30 PM', comment:'Regression suite updates post-fix for reported issues.' },
    ],
  },
]

// ─── Config ───────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<TSStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:  { label: 'Pending',  color: '#D97706', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.20)'  },
  approved: { label: 'Approved', color: '#0A8A58', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.20)'  },
  rejected: { label: 'Returned', color: '#E84855', bg: 'rgba(232,72,85,0.09)',  border: 'rgba(232,72,85,0.18)'   },
}

const PROJECT_OPTIONS = ['All Projects', 'Pulse.AI v2', 'HDFC Portal', 'TechCorp ERP']
const MEMBER_OPTIONS  = ['All Members', ...ROWS.map(r => r.employee)]
const STATUS_TABS: { id: TSStatus; label: string }[] = [
  { id: 'pending',  label: 'Pending'  },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Returned' },
]

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7', hover: '#F0F2F8', surface: '#F7F8FC' }

// ─── Dropdown ─────────────────────────────────────────────────────────────────

function Dropdown({ value, options, onChange, width }: { value: string; options: string[]; onChange: (v: string) => void; width?: number }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          height: 38, padding: '0 30px 0 12px',
          border: `1px solid ${C.border}`, borderRadius: 9,
          fontSize: 13, fontWeight: 500, color: value.startsWith('All') ? C.muted : C.navy,
          background: '#fff', outline: 'none',
          cursor: 'pointer', appearance: 'none',
          fontFamily: "'DM Sans', system-ui, sans-serif",
          width: width ?? 'auto', minWidth: 130,
        }}
        onFocus={e => { e.target.style.borderColor = '#6366F1' }}
        onBlur={e => { e.target.style.borderColor = C.border }}
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={12} style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
    </div>
  )
}

// ─── Detail View ──────────────────────────────────────────────────────────────

function TimesheetDetailView({
  row, onBack, onApprove, onReturn,
}: {
  row: TimesheetRow
  onBack: () => void
  onApprove: (id: number) => void
  onReturn: (id: number) => void
}) {
  const [showReturn, setShowReturn] = useState(false)
  const st = STATUS_CFG[row.status]
  const isPending = row.status === 'pending'

  const totalHours = row.entries.reduce((sum, e) => {
    const v = parseFloat(e.duration.replace('h', '').trim())
    return sum + (isNaN(v) ? 0 : v)
  }, 0)

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", animation: 'tsSlideIn 0.22s ease' }}>
      <style>{`@keyframes tsSlideIn { from { opacity:0; transform:translateX(12px) } to { opacity:1; transform:translateX(0) } }`}</style>

      {/* ── Top bar ── */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            height: 34, padding: '0 14px 0 10px',
            borderRadius: 20, border: `1px solid ${C.border}`,
            background: '#fff', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, color: C.muted,
            transition: 'all 0.14s', fontFamily: 'inherit',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = C.navy; e.currentTarget.style.borderColor = C.navy; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Back to List
        </button>
      </div>

      {/* ── Info Card ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden', marginBottom: 20 }}>

        {/* Card header gradient */}
        <div style={{ background: 'linear-gradient(135deg, #FAFBFF 0%, #F4F5FF 100%)', padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 18 }}>
          {/* Avatar */}
          <img
            src={`https://i.pravatar.cc/150?img=${row.avatar}`}
            alt={row.employee}
            style={{ width: 62, height: 62, borderRadius: '50%', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 2px 10px rgba(28,32,53,0.12)', flexShrink: 0 }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, marginBottom: 3 }}>{row.employee}</div>
            <div style={{ fontSize: 13, color: C.muted }}>{row.designation}</div>
          </div>
          {/* Status badge */}
          <span style={{ fontSize: 12.5, fontWeight: 700, padding: '6px 14px', borderRadius: 20, background: st.bg, color: st.color, border: `1px solid ${st.border}`, flexShrink: 0 }}>
            {st.label}
          </span>
        </div>

        {/* Metadata grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', padding: '0', borderTop: 'none' }}>
          {[
            { label: 'Project',         value: row.project          },
            { label: 'Project Manager', value: row.projectManager   },
            { label: 'Date',            value: row.dateLabel        },
            { label: 'Hours',           value: `${row.hours}h`      },
            { label: 'Status',          value: st.label             },
          ].map((item, i) => (
            <div
              key={item.label}
              style={{
                padding: '16px 20px',
                borderRight: i < 4 ? `1px solid ${C.border}` : 'none',
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tree Entries ── */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: `1px solid ${C.border}`, background: 'linear-gradient(135deg, #FAFBFF 0%, #F6F7FF 100%)' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>Timesheet Entries</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{row.entries.length} {row.entries.length === 1 ? 'entry' : 'entries'} for {row.dateLabel}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(28,32,53,0.06)', padding: '6px 13px', borderRadius: 20, border: `1px solid ${C.border}` }}>
            <Clock size={12} style={{ color: C.muted }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.navy }}>{totalHours}h</span>
            <span style={{ fontSize: 12, color: C.muted }}>· {row.entries.length === 1 ? '1 entry' : `${row.entries.length} entries`}</span>
          </div>
        </div>

        {/* Tree */}
        <div style={{ padding: '24px 28px' }}>
          <div style={{ position: 'relative' }}>
            {/* Vertical connector */}
            <div style={{
              position: 'absolute', left: 19, top: 14,
              width: 2, height: `calc(100% - 28px)`,
              background: `linear-gradient(to bottom, ${row.projectColor}50, ${row.projectColor}08)`,
              borderRadius: 2,
            }} />

            {row.entries.map((entry, i) => {
              const isLast = i === row.entries.length - 1
              return (
                <div key={entry.id} style={{ display: 'flex', gap: 20, marginBottom: isLast ? 0 : 18, position: 'relative' }}>
                  {/* Node dot */}
                  <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%',
                      background: '#fff', border: `2.5px solid ${row.projectColor}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      zIndex: 1, position: 'relative',
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: row.projectColor }} />
                    </div>
                  </div>

                  {/* Entry card */}
                  <div style={{ flex: 1, background: C.surface, borderRadius: 12, padding: '14px 16px', border: `1px solid ${C.border}` }}>
                    {/* Badges row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' as const, marginBottom: 9 }}>
                      {/* Project */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        background: `${entry.projectColor}14`, padding: '3px 10px',
                        borderRadius: 16, border: `1px solid ${entry.projectColor}28`,
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: entry.projectColor }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: entry.projectColor }}>{entry.projectName}</span>
                      </div>

                      {/* Task label */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        background: '#fff', padding: '3px 10px',
                        borderRadius: 16, border: `1px solid ${C.border}`,
                      }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{entry.taskLabel}</span>
                      </div>

                      {/* Duration */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: 'rgba(28,32,53,0.07)', padding: '3px 10px', borderRadius: 8,
                      }}>
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
                      <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65 }}>{entry.comment}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Return Reason (returned rows only) ── */}
        {row.status === 'rejected' && row.returnReason && (
          <div style={{ margin: '0 24px 20px', padding: '16px', background: 'rgba(232,72,85,0.04)', border: '1px solid rgba(232,72,85,0.15)', borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <XCircle size={13} strokeWidth={1.8} style={{ color: '#E84855' }} />
              <span style={{ fontSize: 11.5, fontWeight: 700, color: '#E84855', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Return Reason</span>
              <span style={{ fontSize: 12, color: C.muted, marginLeft: 'auto' }}>by {row.projectManager}</span>
            </div>
            <p style={{ fontSize: 13, color: '#7A2020', lineHeight: 1.7, margin: 0, fontStyle: 'italic' }}>"{row.returnReason}"</p>
          </div>
        )}

        {/* ── Bottom Actions (pending only) ── */}
        {isPending && (
          <div style={{ display: 'flex', gap: 10, padding: '16px 24px 20px', borderTop: `1px solid ${C.border}`, justifyContent: 'flex-end' }}>
            <button
              onClick={() => setShowReturn(true)}
              style={{ height: 44, padding: '0 24px', borderRadius: 12, border: 'none', background: 'rgba(232,72,85,0.09)', color: '#E84855', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.09)' }}
            >
              <XCircle size={15} strokeWidth={1.8} /> Return
            </button>
            <button
              onClick={() => { onApprove(row.id); onBack() }}
              style={{ height: 44, padding: '0 32px', borderRadius: 12, border: 'none', background: '#0EA86A', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 7, transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0A8A58' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0EA86A' }}
            >
              <CheckCircle size={15} strokeWidth={1.8} /> Approve
            </button>
          </div>
        )}
      </div>

      {/* ── Return Modal ── */}
      {showReturn && (
        <ReturnModal
          row={row}
          onClose={() => setShowReturn(false)}
          onConfirm={id => { onReturn(id); setShowReturn(false); onBack() }}
        />
      )}
    </div>
  )
}

// ─── Return Modal ─────────────────────────────────────────────────────────────

function ReturnModal({ row, onClose, onConfirm }: {
  row: TimesheetRow; onClose: () => void; onConfirm: (id: number) => void
}) {
  const [reason, setReason] = useState('')

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(10,12,28,0.52)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif", padding: 20 }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{ background: '#fff', borderRadius: 22, width: '100%', maxWidth: 520, boxShadow: '0 32px 80px rgba(10,12,28,0.22)', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '88vh' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(232,72,85,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <XCircle size={18} strokeWidth={1.8} style={{ color: '#E84855' }} />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: C.navy }}>Return Timesheet</div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>Provide a reason before returning to the employee</div>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: '#F0F2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.background = '#E4E6EF' }} onMouseLeave={e => { e.currentTarget.style.background = '#F0F2F8' }}>
            <X size={14} style={{ color: C.muted }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Employee row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '0 0 16px', borderBottom: '1px solid #F0F2F8', marginBottom: 16 }}>
            <img src={`https://i.pravatar.cc/150?img=${row.avatar}`} alt="" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #F0F2F8', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.navy }}>{row.employee}</div>
              <div style={{ fontSize: 12.5, color: C.muted, marginTop: 2 }}>{row.designation} &nbsp;·&nbsp; {row.project} &nbsp;·&nbsp; {row.dateLabel}</div>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' as const, flexShrink: 0 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: C.navy, lineHeight: 1 }}>{row.hours}<span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>h</span></div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>Hours</div>
            </div>
          </div>

          {/* Reason */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <XCircle size={13} strokeWidth={1.8} style={{ color: '#E84855' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#E84855', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Return Reason</span>
          </div>
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Enter the reason for returning this timesheet to the employee…"
            rows={4}
            autoFocus
            style={{
              width: '100%', borderRadius: 12, resize: 'none',
              border: '1.5px solid rgba(232,72,85,0.28)',
              padding: '12px 14px', fontSize: 13.5, color: '#3D4266',
              lineHeight: 1.7, fontFamily: "'DM Sans', system-ui, sans-serif",
              background: 'rgba(232,72,85,0.025)', outline: 'none',
              boxSizing: 'border-box' as const, transition: 'border-color 0.15s',
            }}
            onFocus={e => { e.target.style.borderColor = '#E84855' }}
            onBlur={e => { e.target.style.borderColor = 'rgba(232,72,85,0.28)' }}
          />
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px 20px', borderTop: '1px solid #F0F2F8', display: 'flex', gap: 10, flexShrink: 0 }}>
          <button onClick={onClose} style={{ flex: 1, height: 44, borderRadius: 12, border: '1px solid #E8EAF2', background: '#fff', color: C.muted, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#E8EAF2'; e.currentTarget.style.color = C.muted }}>Cancel</button>
          <button
            onClick={() => onConfirm(row.id)}
            disabled={!reason.trim()}
            style={{ flex: 2, height: 44, borderRadius: 12, border: 'none', background: reason.trim() ? '#E84855' : 'rgba(232,72,85,0.25)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: reason.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'background 0.15s' }}
            onMouseEnter={e => { if (reason.trim()) e.currentTarget.style.background = '#D43F4B' }}
            onMouseLeave={e => { if (reason.trim()) e.currentTarget.style.background = '#E84855' }}
          >
            <XCircle size={15} strokeWidth={1.8} /> Return Timesheet
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TeamTimesheetsPage() {
  const [statusFilter,  setStatusFilter]  = useState<TSStatus>('pending')
  const [projectFilter, setProjectFilter] = useState('All Projects')
  const [memberFilter,  setMemberFilter]  = useState('All Members')
  const [search,        setSearch]        = useState('')
  const [dateFilter,    setDateFilter]    = useState('')
  const [rows,          setRows]          = useState(ROWS)
  const [selected,      setSelected]      = useState<number[]>([])
  const [viewRow,       setViewRow]       = useState<TimesheetRow | null>(null)
  const [expandedRow,   setExpandedRow]   = useState<number | null>(null)
  const [returnRow,     setReturnRow]     = useState<TimesheetRow | null>(null)
  const [toastMsg,      setToastMsg]      = useState<string | null>(null)

  function showToast() {
    setToastMsg('Timesheet Approved')
    setTimeout(() => setToastMsg(null), 3200)
  }

  function updateStatus(id: number, status: TSStatus) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  function bulkApprove() {
    const pendingSelected = selected.filter(id => rows.find(r => r.id === id)?.status === 'pending')
    setRows(prev => prev.map(r => pendingSelected.includes(r.id) ? { ...r, status: 'approved' } : r))
    setSelected([])
  }

  const filtered = rows.filter(r => {
    const q = search.toLowerCase()
    const matchSearch  = !q || r.employee.toLowerCase().includes(q) || r.project.toLowerCase().includes(q)
    const matchStatus  = r.status === statusFilter
    const matchProject = projectFilter === 'All Projects' || r.project === projectFilter
    const matchMember  = memberFilter  === 'All Members'  || r.employee === memberFilter
    const matchDate    = !dateFilter   || r.date === dateFilter
    return matchSearch && matchStatus && matchProject && matchMember && matchDate
  })

  const pendingCount    = rows.filter(r => r.status === 'pending').length
  const approvedCount   = rows.filter(r => r.status === 'approved').length
  const rejectedCount   = rows.filter(r => r.status === 'rejected').length
  const selectedPending = selected.filter(id => rows.find(r => r.id === id)?.status === 'pending')
  const hasActiveFilter = search || dateFilter || projectFilter !== 'All Projects' || memberFilter !== 'All Members'

  // Grid columns: checkbox | employee | project | date | hours | status | action
  const COLS = '36px 1.8fr 1.7fr 1fr 0.65fr 1fr 1fr'

  const liveViewRow = viewRow ? (rows.find(r => r.id === viewRow.id) ?? viewRow) : null

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes tsAccIn { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }
        @keyframes toastIn  { from { opacity:0; transform:translateX(24px) } to { opacity:1; transform:translateX(0) } }
      `}</style>

      {/* Toast */}
      {toastMsg && (
        <div style={{ position: 'fixed', top: 24, right: 28, zIndex: 99999, display: 'flex', alignItems: 'center', gap: 12, background: '#0EA86A', color: '#fff', padding: '13px 20px 13px 14px', borderRadius: 14, boxShadow: '0 8px 32px rgba(14,168,106,0.30)', fontFamily: "'DM Sans', system-ui, sans-serif", animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CheckCircle size={17} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, lineHeight: 1.3 }}>Timesheet Approved</div>
            <div style={{ fontSize: 11.5, fontWeight: 500, opacity: 0.85, marginTop: 1 }}>Status updated successfully</div>
          </div>
        </div>
      )}

      {liveViewRow ? (
        <TimesheetDetailView
          row={liveViewRow}
          onBack={() => setViewRow(null)}
          onApprove={id => { updateStatus(id, 'approved'); showToast() }}
          onReturn={id => updateStatus(id, 'rejected')}
        />
      ) : (<>

      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-bold" style={{ color: C.navy }}>Team Timesheets</h1>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#D97706', border: '1px solid rgba(245,158,11,0.22)' }}>
                <Clock size={11} />
                {pendingCount} awaiting approval
              </span>
            )}
          </div>
          <p className="text-sm" style={{ color: C.muted }}>
            Review and approve timesheet submissions from your project team members
          </p>
        </div>

        {selectedPending.length > 0 && (
          <button
            onClick={bulkApprove}
            className="flex items-center gap-2 rounded-xl border-none cursor-pointer font-semibold"
            style={{ height: 38, padding: '0 18px', fontSize: 13, background: '#0EA86A', color: '#fff', fontFamily: 'inherit', transition: 'background 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0A8A58' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#0EA86A' }}
          >
            <Check size={14} />
            Approve Selected ({selectedPending.length})
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px', marginBottom: 16 }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div style={{ position: 'relative', flexShrink: 0, width: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search project or member..."
              style={{ width: '100%', height: 38, paddingLeft: 34, paddingRight: 12, border: `1px solid ${C.border}`, borderRadius: 9, fontSize: 13, color: C.navy, background: C.surface, fontFamily: "'DM Sans', system-ui, sans-serif", outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 0.15s, background 0.15s' }}
              onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.background = '#fff' }}
              onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface }}
            />
          </div>

          <Dropdown value={projectFilter} options={PROJECT_OPTIONS} onChange={setProjectFilter} />
          <Dropdown value={memberFilter}  options={MEMBER_OPTIONS}  onChange={setMemberFilter} width={160} />

          <div style={{ position: 'relative', flexShrink: 0 }}>
            <Calendar size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none', zIndex: 1 }} />
            <input
              type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
              style={{ height: 38, paddingLeft: 30, paddingRight: 10, border: `1px solid ${dateFilter ? '#6366F1' : C.border}`, borderRadius: 9, fontSize: 13, color: dateFilter ? C.navy : C.muted, background: dateFilter ? 'rgba(99,102,241,0.05)' : C.surface, fontFamily: "'DM Sans', system-ui, sans-serif", outline: 'none', cursor: 'pointer' }}
              onFocus={e => { e.target.style.borderColor = '#6366F1' }}
              onBlur={e => { if (!dateFilter) e.target.style.borderColor = C.border }}
            />
          </div>

          {hasActiveFilter && (
            <button
              onClick={() => { setSearch(''); setProjectFilter('All Projects'); setMemberFilter('All Members'); setDateFilter('') }}
              style={{ height: 38, padding: '0 12px', borderRadius: 9, border: `1px solid ${C.border}`, background: '#fff', fontSize: 12.5, color: C.muted, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', flexShrink: 0 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C8CCE0'; e.currentTarget.style.color = C.navy }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted }}
            >
              Clear
            </button>
          )}

          <div className="flex items-center gap-1.5 ml-auto">
            {STATUS_TABS.map(s => (
              <button
                key={s.id}
                onClick={() => setStatusFilter(s.id)}
                style={{ height: 34, padding: '0 14px', borderRadius: 8, border: 'none', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', background: statusFilter === s.id ? C.navy : C.hover, color: statusFilter === s.id ? '#fff' : C.muted, transition: 'all 0.15s', fontFamily: 'inherit' }}
                onMouseEnter={e => { if (statusFilter !== s.id) { e.currentTarget.style.background = '#E4E6EF'; e.currentTarget.style.color = C.navy } }}
                onMouseLeave={e => { if (statusFilter !== s.id) { e.currentTarget.style.background = C.hover; e.currentTarget.style.color = C.muted } }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>

        {/* Column headers */}
        <div className="grid items-center" style={{ gridTemplateColumns: COLS, padding: '12px 20px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
          <div
            onClick={() => {
              const pendingIds = filtered.filter(r => r.status === 'pending').map(r => r.id)
              const allSel = pendingIds.every(id => selected.includes(id))
              if (allSel) setSelected(prev => prev.filter(id => !pendingIds.includes(id)))
              else setSelected(prev => [...new Set([...prev, ...pendingIds])])
            }}
            style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />
          {['Employee', 'Project', 'Date', 'Hours', 'Status', 'Action'].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#B0B4C8', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center" style={{ minHeight: 200 }}>
            <Search size={28} strokeWidth={1.3} style={{ color: '#D0D3E4', marginBottom: 10 }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>No timesheets found</p>
            <p style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Try adjusting your filters or search query</p>
          </div>
        ) : (
          filtered.map((row, idx) => {
            const st         = STATUS_CFG[row.status]
            const isPending  = row.status === 'pending'
            const isSelected = selected.includes(row.id)
            const isExpanded = isPending && expandedRow === row.id
            const showBorder = idx < filtered.length - 1

            return (
              <Fragment key={row.id}>
                <div
                  className="grid items-center"
                  style={{
                    gridTemplateColumns: COLS,
                    padding: '16px 20px',
                    borderBottom: showBorder && !isExpanded ? `1px solid #F0F2F8` : 'none',
                    background: isSelected ? 'rgba(99,102,241,0.03)' : '#fff',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = C.surface }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = '#fff' }}
                >
                  {/* Checkbox */}
                  <div
                    onClick={() => isPending && setSelected(prev => prev.includes(row.id) ? prev.filter(x => x !== row.id) : [...prev, row.id])}
                    style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${isSelected ? '#6366F1' : C.border}`, background: isSelected ? '#6366F1' : '#fff', cursor: isPending ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isPending ? 1 : 0.35, flexShrink: 0 }}
                  >
                    {isSelected && <Check size={11} style={{ color: '#fff' }} strokeWidth={2.5} />}
                  </div>

                  {/* Employee */}
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={`https://i.pravatar.cc/150?img=${row.avatar}`} alt={row.employee} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${C.border}` }} />
                    <div className="min-w-0">
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: C.navy, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.employee}</div>
                      <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{row.designation}</div>
                    </div>
                  </div>

                  {/* Project */}
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#3D4266', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.project}
                  </div>

                  {/* Date */}
                  <div>
                    <div style={{ fontSize: 12.5, color: '#3D4266', fontWeight: 500 }}>{row.dateLabel.split(',')[0]}</div>
                    <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{row.dateLabel.split(', ')[1]}</div>
                  </div>

                  {/* Hours */}
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.navy, display: 'inline-flex', alignItems: 'baseline', gap: 2 }}>
                    {row.hours}<span style={{ fontSize: 11, fontWeight: 600, color: C.muted }}>h</span>
                  </div>

                  {/* Status */}
                  <span style={{ fontSize: 11.5, fontWeight: 700, padding: '5px 10px', borderRadius: 7, background: st.bg, color: st.color, border: `1px solid ${st.border}`, whiteSpace: 'nowrap' as const, width: 'fit-content' }}>
                    {st.label}
                  </span>

                  {/* Action */}
                  <div className="flex items-center gap-1.5">
                    {/* Eye: pending → accordion toggle; others → detail page */}
                    <button
                      onClick={() => isPending
                        ? setExpandedRow(prev => prev === row.id ? null : row.id)
                        : setViewRow(row)}
                      title={isPending ? 'Quick Preview' : 'View Details'}
                      style={{ width: 32, height: 32, borderRadius: 9, border: 'none', background: isExpanded ? 'rgba(99,102,241,0.20)' : 'rgba(99,102,241,0.09)', color: '#4B4ECC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.14s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.20)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = isExpanded ? 'rgba(99,102,241,0.20)' : 'rgba(99,102,241,0.09)' }}
                    >
                      <Eye size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>

                {/* ── Accordion (pending Eye click only) ── */}
                {isExpanded && (
                  <div style={{
                    borderTop: `1px solid #EEF0FA`,
                    borderBottom: showBorder ? `1px solid #F0F2F8` : 'none',
                    background: 'rgba(99,102,241,0.015)',
                    padding: '20px 28px 24px',
                    animation: 'tsAccIn 0.18s ease',
                  }}>
                    {/* Tree entries */}
                    <div style={{ position: 'relative', marginBottom: 18 }}>
                      <div style={{
                        position: 'absolute', left: 19, top: 14,
                        width: 2, height: `calc(100% - 28px)`,
                        background: `linear-gradient(to bottom, ${row.projectColor}50, ${row.projectColor}08)`,
                        borderRadius: 2,
                      }} />
                      {row.entries.map((entry, ei) => {
                        const isLastEntry = ei === row.entries.length - 1
                        return (
                          <div key={entry.id} style={{ display: 'flex', gap: 20, marginBottom: isLastEntry ? 0 : 16, position: 'relative' }}>
                            {/* Node dot */}
                            <div style={{ width: 40, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 3 }}>
                              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', border: `2.5px solid ${row.projectColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, position: 'relative' }}>
                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: row.projectColor }} />
                              </div>
                            </div>
                            {/* Entry card */}
                            <div style={{ flex: 1, background: C.surface, borderRadius: 12, padding: '14px 16px', border: `1px solid ${C.border}` }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' as const, marginBottom: 9 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: `${entry.projectColor}14`, padding: '3px 10px', borderRadius: 16, border: `1px solid ${entry.projectColor}28` }}>
                                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: entry.projectColor }} />
                                  <span style={{ fontSize: 12, fontWeight: 700, color: entry.projectColor }}>{entry.projectName}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#fff', padding: '3px 10px', borderRadius: 16, border: `1px solid ${C.border}` }}>
                                  <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>{entry.taskLabel}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(28,32,53,0.07)', padding: '3px 10px', borderRadius: 8 }}>
                                  <Clock size={10} style={{ color: C.muted }} />
                                  <span style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>{entry.duration}</span>
                                </div>
                                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Clock size={10} style={{ color: C.muted }} />
                                  <span style={{ fontSize: 11.5, color: C.muted, fontWeight: 500 }}>Added {entry.timeAdded}</span>
                                </div>
                              </div>
                              {entry.comment && (
                                <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65 }}>{entry.comment}</div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Approve / Return text buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                      <button
                        onClick={() => setReturnRow(row)}
                        style={{ height: 36, padding: '0 18px', borderRadius: 10, border: 'none', background: 'rgba(232,72,85,0.09)', color: '#E84855', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.18)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(232,72,85,0.09)' }}
                      >
                        <XCircle size={14} strokeWidth={1.8} /> Return
                      </button>
                      <button
                        onClick={() => { updateStatus(row.id, 'approved'); showToast(); setExpandedRow(null) }}
                        style={{ height: 36, padding: '0 22px', borderRadius: 10, border: 'none', background: '#0EA86A', color: '#fff', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#0A8A58' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#0EA86A' }}
                      >
                        <CheckCircle size={14} strokeWidth={1.8} /> Approve
                      </button>
                    </div>
                  </div>
                )}
              </Fragment>
            )
          })
        )}

        {/* Footer */}
        <div className="flex items-center justify-between" style={{ padding: '13px 20px', borderTop: `1px solid ${C.border}`, background: C.surface }}>
          <span style={{ fontSize: 12, color: C.muted }}>
            Showing <strong style={{ color: C.navy }}>{filtered.length}</strong> of {rows.length} entries
          </span>
          <div className="flex items-center gap-4">
            {[
              { label: 'Approved', value: approvedCount, color: '#0A8A58' },
              { label: 'Pending',  value: pendingCount,  color: '#D97706' },
              { label: 'Returned', value: rejectedCount, color: '#E84855' },
            ].map(s => (
              <span key={s.label} style={{ fontSize: 12, color: C.muted }}>
                <span style={{ fontWeight: 700, color: s.color }}>{s.value}</span> {s.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Return modal triggered from accordion */}
      {returnRow && (
        <ReturnModal
          row={returnRow}
          onClose={() => setReturnRow(null)}
          onConfirm={id => {
            updateStatus(id, 'rejected')
            setReturnRow(null)
            setExpandedRow(null)
          }}
        />
      )}
      </>)}
    </div>
  )
}
