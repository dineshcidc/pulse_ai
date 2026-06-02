import { useState } from 'react'
import {
  BarChart3, CalendarDays, UserCheck, Clock, Ticket, Users, Wallet,
  ChevronRight,
} from 'lucide-react'
import EmployeeLeaveReportPage from './EmployeeLeaveReportPage'
import EmployeeAttendanceReportPage from './EmployeeAttendanceReportPage'
import EmployeeTimesheetReportPage from './EmployeeTimesheetReportPage'

type ReportId = 'leave' | 'attendance' | 'timesheet' | 'ticket' | 'employee' | 'payroll'

const C = { navy: '#1C2035', border: '#E8EAF2', muted: '#8B90A7' }

const REPORTS = [
  {
    id:           'leave'      as ReportId,
    label:        'Leave Reports',
    description:  'View leave usage, balances & approval trends',
    Icon:         CalendarDays,
    iconColor:    '#0EA86A',
    iconBg:       'rgba(14,168,106,0.10)',
    dotBg:        'rgba(14,168,106,0.22)',
    activeBorder: 'rgba(14,168,106,0.45)',
    activeBg:     'rgba(14,168,106,0.05)',
    arrowColor:   '#0EA86A',
  },
  {
    id:           'attendance' as ReportId,
    label:        'Attendance Reports',
    description:  'Track daily attendance, late arrivals & absences',
    Icon:         UserCheck,
    iconColor:    '#3B82F6',
    iconBg:       'rgba(59,130,246,0.10)',
    dotBg:        'rgba(59,130,246,0.22)',
    activeBorder: 'rgba(59,130,246,0.45)',
    activeBg:     'rgba(59,130,246,0.05)',
    arrowColor:   '#3B82F6',
  },
  {
    id:           'timesheet'  as ReportId,
    label:        'Timesheet Reports',
    description:  'Analyse hours logged, productivity & billing data',
    Icon:         Clock,
    iconColor:    '#7C3AED',
    iconBg:       'rgba(124,58,237,0.10)',
    dotBg:        'rgba(124,58,237,0.22)',
    activeBorder: 'rgba(124,58,237,0.45)',
    activeBg:     'rgba(124,58,237,0.05)',
    arrowColor:   '#7C3AED',
  },
  {
    id:           'ticket'     as ReportId,
    label:        'Ticket Reports',
    description:  'Monitor resolution rates & support ticket trends',
    Icon:         Ticket,
    iconColor:    '#D97706',
    iconBg:       'rgba(245,158,11,0.10)',
    dotBg:        'rgba(245,158,11,0.22)',
    activeBorder: 'rgba(245,158,11,0.45)',
    activeBg:     'rgba(245,158,11,0.05)',
    arrowColor:   '#D97706',
  },
  {
    id:           'employee'   as ReportId,
    label:        'Employee Reports',
    description:  'Overview of workforce, roles & department data',
    Icon:         Users,
    iconColor:    '#5B5FDE',
    iconBg:       'rgba(99,102,241,0.10)',
    dotBg:        'rgba(99,102,241,0.22)',
    activeBorder: 'rgba(99,102,241,0.45)',
    activeBg:     'rgba(99,102,241,0.05)',
    arrowColor:   '#5B5FDE',
  },
  {
    id:           'payroll'    as ReportId,
    label:        'Payroll Reports',
    description:  'Review salary disbursements, deductions & payouts',
    Icon:         Wallet,
    iconColor:    '#0D9488',
    iconBg:       'rgba(13,148,136,0.10)',
    dotBg:        'rgba(13,148,136,0.22)',
    activeBorder: 'rgba(13,148,136,0.45)',
    activeBg:     'rgba(13,148,136,0.05)',
    arrowColor:   '#0D9488',
  },
] as const

export default function ReportsPage() {
  const [activePage, setActivePage] = useState<ReportId | null>(null)

  /* ── Sub-pages ── */
  if (activePage === 'leave')       return <EmployeeLeaveReportPage       onBack={() => setActivePage(null)} />
  if (activePage === 'attendance')  return <EmployeeAttendanceReportPage  onBack={() => setActivePage(null)} />
  if (activePage === 'timesheet')   return <EmployeeTimesheetReportPage   onBack={() => setActivePage(null)} />

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        @keyframes iconFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .rpt-card              { transition: box-shadow 0.18s, background 0.18s, border-color 0.18s; }
        .rpt-card:hover        { box-shadow: 0 6px 28px rgba(28,32,53,0.09); }
      `}</style>

      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: 22, color: C.navy, letterSpacing: '-0.3px' }}>
            Reports
          </h1>
          <p style={{ fontSize: 13.5, color: C.muted }}>
            Generate and export workforce analytics &amp; insights
          </p>
        </div>

        {/* Animated icon badge */}
        <div
          className="flex items-center justify-center rounded-2xl flex-shrink-0"
          style={{
            width: 84, height: 84,
            backgroundColor: 'rgba(13,148,136,0.07)',
            backgroundImage: 'radial-gradient(circle, rgba(13,148,136,0.22) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
            border: '1px solid rgba(13,148,136,0.14)',
          }}
        >
          <div style={{ animation: 'iconFloat 4s ease-in-out infinite' }}>
            <BarChart3 size={34} strokeWidth={1.5} style={{ color: '#0D9488' }} />
          </div>
        </div>
      </div>

      {/* ── Report type cards (3-column grid) ── */}
      <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        {REPORTS.slice(0, 3).map(r => {
          const Icon = r.Icon
          return (
            <button
              key={r.id}
              className="rpt-card text-left"
              onClick={() => setActivePage(r.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '20px 22px',
                background: '#fff',
                border: `1px solid ${C.border}`,
                borderRadius: 18,
                cursor: 'pointer',
                boxShadow: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = r.dotBg
                e.currentTarget.style.background  = r.activeBg
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = C.border
                e.currentTarget.style.background  = '#fff'
              }}
            >
              {/* Dot-grid icon badge */}
              <div
                className="flex items-center justify-center rounded-2xl flex-shrink-0"
                style={{
                  width: 52, height: 52,
                  background: r.iconBg,
                  backgroundImage: `radial-gradient(circle, ${r.dotBg} 1px, transparent 1px)`,
                  backgroundSize: '7px 7px',
                }}
              >
                <Icon size={22} strokeWidth={1.6} style={{ color: r.iconColor }} />
              </div>

              {/* Label + description */}
              <div className="flex-1 min-w-0">
                <div className="mb-1.5">
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.navy }}>{r.label}</span>
                </div>
                <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.55, margin: 0 }}>
                  {r.description}
                </p>
              </div>

              {/* Arrow */}
              <div
                className="flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ width: 30, height: 30, background: r.iconBg }}
              >
                <ChevronRight size={15} strokeWidth={2.2} style={{ color: r.arrowColor }} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
