import { useState } from 'react'
import {
  FolderKanban, CheckCircle2, Clock3, AlertTriangle,
  CalendarClock, ChevronDown, BellRing, Eye,
} from 'lucide-react'
import {
  ADMIN_REPORT_PROJECTS, PM_AVATARS,
  getAdminReportingKpis, getManagerCount,
  daysFromToday, formatDate,
  type AdminReportProject, type Frequency, type ReportStatus,
} from './adminReportingData'

const C = {
  navy:   '#1C2035',
  ink:    '#2A2F45',
  muted:  '#8B90A7',
  faint:  '#AEB2C4',
  border: '#E8EAF2',
  line:   '#EEF0F6',
  panel:  '#FFFFFF',
  wash:   '#F6F7FB',
  indigo: '#6366F1',
  green:  '#16A34A',
  amber:  '#D97706',
  red:    '#E11D48',
  blue:   '#2563EB',
  slate:  '#64748B',
}

/* The dashboard collapses the raw report statuses into three display buckets. */
type StatusBucket = 'Overdue' | 'Pending' | 'Submitted'

const BUCKET_STYLE: Record<StatusBucket, { fg: string; bg: string; label: string }> = {
  'Overdue':   { fg: C.red,   bg: 'rgba(225,29,72,0.10)',  label: 'Overdue'   },
  'Pending':   { fg: C.amber, bg: 'rgba(217,119,6,0.10)',  label: 'Pending'   },
  'Submitted': { fg: C.green, bg: 'rgba(22,163,74,0.10)',  label: 'Submitted' },
}

/** Map a raw report status onto one of the three display buckets. */
function bucketOf(status: ReportStatus): StatusBucket {
  if (status === 'Overdue')   return 'Overdue'
  if (status === 'Submitted') return 'Submitted'
  return 'Pending' // Draft & Not Started both read as "Pending"
}

/* ── small building blocks (shared visual language) ── */

function initials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function StatusPill({ status }: { status: ReportStatus }) {
  const s = BUCKET_STYLE[bucketOf(status)]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full"
      style={{ background: s.bg, color: s.fg, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}
    >
      <span className="rounded-full" style={{ width: 6, height: 6, background: s.fg }} />
      {s.label}
    </span>
  )
}

function FreqBadge({ freq }: { freq: string }) {
  return (
    <span
      className="inline-flex items-center rounded-md"
      style={{ background: C.wash, color: C.muted, padding: '3px 9px', fontSize: 11.5, fontWeight: 600, border: `1px solid ${C.border}` }}
    >
      {freq}
    </span>
  )
}

function DueChip({ iso }: { iso: string }) {
  const d = daysFromToday(iso)
  let fg = C.muted, bg = C.wash, text = `in ${d} days`
  if (d < 0)        { fg = C.red;   bg = 'rgba(225,29,72,0.10)'; text = `${Math.abs(d)}d overdue` }
  else if (d === 0) { fg = C.amber; bg = 'rgba(217,119,6,0.10)'; text = 'Due today' }
  else if (d === 1) { fg = C.amber; bg = 'rgba(217,119,6,0.10)'; text = 'Due tomorrow' }
  else if (d <= 3)  { fg = C.amber; bg = 'rgba(217,119,6,0.10)'; text = `in ${d} days` }
  return (
    <span className="inline-flex items-center rounded-md" style={{ background: bg, color: fg, padding: '3px 8px', fontSize: 11, fontWeight: 700 }}>
      {text}
    </span>
  )
}

function Avatar({ name, size = 30 }: { name: string; size?: number }) {
  const img = PM_AVATARS[name]
  if (img) {
    return (
      <img
        src={`https://i.pravatar.cc/150?img=${img}`}
        alt={name}
        className="rounded-full flex-shrink-0 object-cover"
        style={{ width: size, height: size, border: `1px solid ${C.border}` }}
      />
    )
  }
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: 'rgba(99,102,241,0.10)', color: C.indigo, fontSize: size * 0.36, fontWeight: 700 }}
    >
      {initials(name)}
    </div>
  )
}

/* Compact KPI — small height, value-forward. `hint` adds a light sub-metric. */
function Kpi({
  Icon, label, value, hint, fg, bg,
}: { Icon: React.ElementType; label: string; value: number | string; hint?: string; fg: string; bg: string }) {
  return (
    <div className="rounded-2xl flex items-center gap-3" style={{ background: C.panel, border: `1px solid ${C.border}`, padding: '14px 16px' }}>
      <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: 38, height: 38, background: bg }}>
        <Icon size={19} strokeWidth={2} style={{ color: fg }} />
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span style={{ fontSize: 24, fontWeight: 800, color: C.navy, lineHeight: 1.05 }}>{value}</span>
          {hint && <span style={{ fontSize: 11.5, fontWeight: 600, color: C.faint }}>{hint}</span>}
        </div>
        <div className="truncate" style={{ fontSize: 12.5, fontWeight: 600, color: C.muted }}>{label}</div>
      </div>
    </div>
  )
}

/* ── main page ── */

export default function ReportingDashboardPage({ onNavigate }: { onNavigate?: (id: string) => void }) {
  const kpi = getAdminReportingKpis()
  const managerCount = getManagerCount()
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [freqFilter, setFreqFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const freqOptions: Frequency[] = ['Weekly', 'Biweekly', 'Monthly']
  const statusOptions: StatusBucket[] = ['Overdue', 'Pending', 'Submitted']

  // Full org-wide roster, soonest due first — filterable by project, frequency & status.
  const rows: AdminReportProject[] = ADMIN_REPORT_PROJECTS
    .filter(p => projectFilter === 'all' || p.id === projectFilter)
    .filter(p => freqFilter === 'all' || p.frequency === freqFilter)
    .filter(p => statusFilter === 'all' || bucketOf(p.status) === statusFilter)
    .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())

  const overdueProjects = ADMIN_REPORT_PROJECTS.filter(p => p.status === 'Overdue')

  const COLS = '2fr 1.4fr 1fr 1.4fr 1fr 116px'

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Heading */}
      <div className="mb-5">
        <h1 className="text-xl font-bold" style={{ color: C.navy }}>Reporting Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: C.muted }}>
          Monitor reporting activity across all projects and managers in the organization.
        </p>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 14 }}>
        <Kpi Icon={FolderKanban}  label="Total Projects"    value={kpi.total}     hint={`· ${managerCount} PMs`} fg={C.indigo} bg="rgba(99,102,241,0.10)" />
        <Kpi Icon={CheckCircle2}  label="Reports Submitted" value={kpi.submitted} hint={`/ ${kpi.total}`}        fg={C.green}  bg="rgba(22,163,74,0.10)" />
        <Kpi Icon={Clock3}        label="Pending Reports"   value={kpi.pending}                                   fg={C.amber}  bg="rgba(217,119,6,0.10)" />
        <Kpi Icon={AlertTriangle} label="Overdue Reports"   value={kpi.overdue}                                   fg={C.red}    bg="rgba(225,29,72,0.10)" />
      </div>

      {/* Overdue alert strip */}
      {overdueProjects.length > 0 && (
        <div
          className="rounded-xl mt-4 flex items-center gap-3 flex-wrap"
          style={{ background: 'rgba(225,29,72,0.07)', border: '1px solid rgba(225,29,72,0.22)', padding: '12px 16px' }}
        >
          <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 32, height: 32, background: 'rgba(225,29,72,0.12)' }}>
            <AlertTriangle size={17} style={{ color: C.red }} />
          </div>
          <div className="flex-1 min-w-0">
            <span style={{ fontSize: 13.5, fontWeight: 700, color: C.red }}>
              {overdueProjects.length} report{overdueProjects.length > 1 ? 's' : ''} overdue
            </span>
            <span style={{ fontSize: 13, color: C.ink }}>
              {' '}— {overdueProjects.map(p => `${p.name} (${p.pm})`).join(', ')} need{overdueProjects.length > 1 ? '' : 's'} follow-up.
            </span>
          </div>
          <button
            onClick={() => onNavigate?.('report-monitoring')}
            className="inline-flex items-center gap-1.5 rounded-lg cursor-pointer flex-shrink-0"
            style={{ background: C.red, color: '#fff', border: 'none', padding: '8px 13px', fontSize: 12.5, fontWeight: 600 }}
          >
            <BellRing size={14} /> Send Reminder
          </button>
        </div>
      )}

      {/* Reporting status — full-width table */}
      <div className="rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}`, marginTop: 20 }}>
        <div className="flex items-center justify-between flex-wrap gap-3" style={{ padding: '16px 18px', borderBottom: `1px solid ${C.line}` }}>
          <div className="flex items-center gap-2">
            <CalendarClock size={18} style={{ color: C.indigo }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Reporting Status</span>
            <span
              className="rounded-full"
              style={{ background: C.wash, color: C.muted, fontSize: 12, fontWeight: 700, padding: '2px 9px', border: `1px solid ${C.border}` }}
            >
              {rows.length}
            </span>
          </div>

          {/* Filters — by project, frequency & status */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <select
                value={projectFilter}
                onChange={e => setProjectFilter(e.target.value)}
                className="cursor-pointer appearance-none"
                style={{
                  background: C.wash, color: C.ink, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '8px 34px 8px 12px', fontSize: 13, fontWeight: 600,
                  fontFamily: 'inherit', outline: 'none', minWidth: 190,
                }}
              >
                <option value="all">All Projects</option>
                {ADMIN_REPORT_PROJECTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <ChevronDown size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            </div>
            <div className="relative">
              <select
                value={freqFilter}
                onChange={e => setFreqFilter(e.target.value)}
                className="cursor-pointer appearance-none"
                style={{
                  background: C.wash, color: C.ink, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '8px 34px 8px 12px', fontSize: 13, fontWeight: 600,
                  fontFamily: 'inherit', outline: 'none', minWidth: 150,
                }}
              >
                <option value="all">All Frequencies</option>
                {freqOptions.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <ChevronDown size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="cursor-pointer appearance-none"
                style={{
                  background: C.wash, color: C.ink, border: `1px solid ${C.border}`,
                  borderRadius: 10, padding: '8px 34px 8px 12px', fontSize: 13, fontWeight: 600,
                  fontFamily: 'inherit', outline: 'none', minWidth: 150,
                }}
              >
                <option value="all">All Status</option>
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={15} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', color: C.muted, pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* Column header */}
        <div style={{
          display: 'grid', gridTemplateColumns: COLS, gap: 12, alignItems: 'center',
          padding: '10px 18px', borderBottom: `1px solid ${C.line}`, background: C.wash,
        }}>
          {[
            { h: 'Project',         align: 'left'  as const, padLeft: 44 },
            { h: 'Project Manager', align: 'left'  as const, padLeft: 0  },
            { h: 'Frequency',       align: 'left'  as const, padLeft: 0  },
            { h: 'Next Due',        align: 'left'  as const, padLeft: 0  },
            { h: 'Status',          align: 'left'   as const, padLeft: 0  },
            { h: 'Action',          align: 'center' as const, padLeft: 0  },
          ].map(c => (
            <div key={c.h} style={{ fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: 0.4, textTransform: 'uppercase', textAlign: c.align, paddingLeft: c.padLeft, whiteSpace: 'nowrap' }}>
              {c.h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {rows.length === 0 ? (
          <div style={{ padding: '40px 18px', textAlign: 'center', color: C.muted, fontSize: 13 }}>
            No reports match this filter. 🎉
          </div>
        ) : (
          rows.map((p, i) => {
            const bucket = bucketOf(p.status)
            return (
              <div
                key={p.id}
                style={{
                  display: 'grid', gridTemplateColumns: COLS, gap: 12, alignItems: 'center',
                  padding: '13px 18px', borderBottom: i < rows.length - 1 ? `1px solid ${C.line}` : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.wash }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                {/* Project */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 34, height: 34, background: C.wash }}>
                    <FolderKanban size={16} style={{ color: C.muted }} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate" style={{ fontSize: 13.5, fontWeight: 700, color: C.navy }}>{p.name}</div>
                    <div className="truncate" style={{ fontSize: 11.5, color: C.faint }}>{p.client}</div>
                  </div>
                </div>

                {/* Project Manager */}
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar name={p.pm} size={28} />
                  <span className="truncate" style={{ fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{p.pm}</span>
                </div>

                {/* Frequency */}
                <div><FreqBadge freq={p.frequency} /></div>

                {/* Next Due */}
                <div className="min-w-0">
                  <div style={{ fontSize: 12.5, color: C.ink, fontWeight: 600 }}>{formatDate(p.nextDue)}</div>
                  <div style={{ marginTop: 5 }}><DueChip iso={p.nextDue} /></div>
                </div>

                {/* Status */}
                <div><StatusPill status={p.status} /></div>

                {/* Action — Submitted rows can be viewed; Overdue/Pending get a reminder */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  {bucket === 'Submitted' ? (
                    <button
                      onClick={() => onNavigate?.('report-monitoring')}
                      title="View report"
                      aria-label={`View ${p.name} report`}
                      className="inline-flex items-center justify-center rounded-lg cursor-pointer"
                      style={{
                        background: C.wash, color: C.navy, border: `1px solid ${C.border}`,
                        padding: '7px 10px', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#EEF0F6'; e.currentTarget.style.borderColor = '#D5D9EA' }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.wash; e.currentTarget.style.borderColor = C.border }}
                    >
                      <Eye size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigate?.('report-monitoring')}
                      title="Send reminder"
                      aria-label={`Send reminder for ${p.name}`}
                      className="inline-flex items-center justify-center rounded-lg cursor-pointer"
                      style={{
                        background: 'rgba(99,102,241,0.10)', color: C.indigo, border: '1px solid rgba(99,102,241,0.25)',
                        padding: '7px 10px', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.18)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.10)' }}
                    >
                      <BellRing size={15} />
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
