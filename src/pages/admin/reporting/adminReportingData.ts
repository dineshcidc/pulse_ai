/**
 * Shared mock data for the ADMIN "Project Reporting" module.
 *
 * Where the Manager side (reportingData.ts) is scoped to one PM's own projects,
 * the Admin monitors reporting ORG-WIDE — every project, across every Project
 * Manager. This file is that wider, organisation-level dataset.
 *
 * NOTE: dummy/mock data for the design mockup only. The dev team wires this to
 * the real backend later. Date helpers + shared types are reused from the
 * Manager module so "today" and the current period stay identical everywhere.
 */
import {
  daysFromToday, formatDate, CURRENT_PERIOD,
  type Frequency, type ReportStatus, type NotificationKind,
} from '../../manager/reporting/reportingData'

export { daysFromToday, formatDate, CURRENT_PERIOD }
export type { Frequency, ReportStatus, NotificationKind }

/** Calendar month of the current reporting cycle (shown next to "This cycle"). */
export const CURRENT_CYCLE_MONTH = 'July 2026'

/**
 * Face-photo id per Project Manager (i.pravatar.cc/150?img=N) — matches the
 * avatar convention already used across the app (Org Structure, Timesheets).
 */
export const PM_AVATARS: Record<string, number> = {
  'John Doe':      68,
  'Meera Nair':    45,
  'Ravi Teja':     13,
  'Anita Desai':   31,
  'Sophie Turner': 47,
}

export interface AdminReportProject {
  id: string
  name: string
  client: string
  /** The Project Manager responsible for submitting this project's reports. */
  pm: string
  /** The reporting template the Admin assigned to this project. */
  template: string
  frequency: Frequency
  /** ISO date of the next report due for the current cycle. */
  nextDue: string
  /** ISO date of the last submitted report, or null if never. */
  lastSubmitted: string | null
  status: ReportStatus
}

/**
 * Org-wide reporting roster — 12 projects across 5 Project Managers.
 * Statuses reflect the current reporting cycle (week of Jul 21–27, 2026).
 */
export const ADMIN_REPORT_PROJECTS: AdminReportProject[] = [
  { id: 'prj-apollo',  name: 'Apollo CRM Revamp',        client: 'Nordstrom Retail',      pm: 'John Doe',      template: 'Standard Weekly',   frequency: 'Weekly',   nextDue: '2026-07-22', lastSubmitted: '2026-07-15', status: 'Overdue'     },
  { id: 'prj-helios',  name: 'Helios Analytics Platform', client: 'Meridian Bank',         pm: 'John Doe',      template: 'Standard Weekly',   frequency: 'Weekly',   nextDue: '2026-07-24', lastSubmitted: '2026-07-18', status: 'Draft'       },
  { id: 'prj-nova',    name: 'Nova E-commerce Portal',    client: 'UrbanCart',             pm: 'John Doe',      template: 'Standard Weekly',   frequency: 'Weekly',   nextDue: '2026-07-24', lastSubmitted: '2026-07-18', status: 'Not Started' },
  { id: 'prj-orion',   name: 'Orion Mobile Banking',      client: 'Meridian Bank',         pm: 'John Doe',      template: 'Standard Biweekly', frequency: 'Biweekly', nextDue: '2026-08-07', lastSubmitted: '2026-07-24', status: 'Submitted'   },
  { id: 'prj-atlas',   name: 'Atlas ERP Migration',       client: 'GreenField Logistics',  pm: 'Meera Nair',    template: 'Standard Monthly',  frequency: 'Monthly',  nextDue: '2026-08-29', lastSubmitted: '2026-07-23', status: 'Submitted'   },
  { id: 'prj-zephyr',  name: 'Zephyr IoT Dashboard',      client: 'AeroSys Industries',    pm: 'Meera Nair',    template: 'Standard Biweekly', frequency: 'Biweekly', nextDue: '2026-08-05', lastSubmitted: '2026-07-22', status: 'Submitted'   },
  { id: 'prj-titan',   name: 'Titan Payments Gateway',    client: 'FinCore Systems',       pm: 'Ravi Teja',     template: 'Standard Weekly',   frequency: 'Weekly',   nextDue: '2026-07-31', lastSubmitted: '2026-07-24', status: 'Submitted'   },
  { id: 'prj-lyra',    name: 'Lyra Health Portal',        client: 'MediTrust Care',        pm: 'Ravi Teja',     template: 'Standard Weekly',   frequency: 'Weekly',   nextDue: '2026-07-24', lastSubmitted: '2026-07-17', status: 'Draft'       },
  { id: 'prj-vega',    name: 'Vega Supply Chain',         client: 'GreenField Logistics',  pm: 'Anita Desai',   template: 'Standard Monthly',  frequency: 'Monthly',  nextDue: '2026-08-29', lastSubmitted: '2026-07-20', status: 'Submitted'   },
  { id: 'prj-draco',   name: 'Draco Insurance Suite',     client: 'Assurex Global',        pm: 'Anita Desai',   template: 'Standard Biweekly', frequency: 'Biweekly', nextDue: '2026-08-07', lastSubmitted: '2026-07-24', status: 'Submitted'   },
  { id: 'prj-phoenix', name: 'Phoenix HRMS',              client: 'Concert IDC (Internal)', pm: 'Sophie Turner', template: 'Standard Weekly',   frequency: 'Weekly',   nextDue: '2026-07-31', lastSubmitted: '2026-07-24', status: 'Submitted'   },
  { id: 'prj-comet',   name: 'Comet Data Lake',           client: 'AeroSys Industries',    pm: 'Sophie Turner', template: 'Standard Monthly',  frequency: 'Monthly',  nextDue: '2026-06-28', lastSubmitted: '2026-05-29', status: 'Overdue'     },
]

/** Derived org-wide KPI counts for the Admin Reporting Dashboard. */
export function getAdminReportingKpis(list: AdminReportProject[] = ADMIN_REPORT_PROJECTS) {
  const total      = list.length
  const submitted  = list.filter(p => p.status === 'Submitted').length
  const overdue    = list.filter(p => p.status === 'Overdue').length
  const draft      = list.filter(p => p.status === 'Draft').length
  const notStarted = list.filter(p => p.status === 'Not Started').length
  const pending    = draft + notStarted
  return { total, submitted, overdue, draft, notStarted, pending }
}

/** Distinct managers under reporting (for the "managers" context stat). */
export function getManagerCount(list: AdminReportProject[] = ADMIN_REPORT_PROJECTS): number {
  return new Set(list.map(p => p.pm)).size
}

export interface ManagerCompliance {
  pm: string
  submitted: number
  total: number
  overdue: number
  /** % of this manager's projects submitted for the current cycle. */
  rate: number
}

/** Per-manager reporting compliance for the current cycle, best first. */
export function getManagerCompliance(list: AdminReportProject[] = ADMIN_REPORT_PROJECTS): ManagerCompliance[] {
  const map = new Map<string, ManagerCompliance>()
  for (const p of list) {
    const m = map.get(p.pm) ?? { pm: p.pm, submitted: 0, total: 0, overdue: 0, rate: 0 }
    m.total++
    if (p.status === 'Submitted') m.submitted++
    if (p.status === 'Overdue')   m.overdue++
    map.set(p.pm, m)
  }
  return [...map.values()]
    .map(m => ({ ...m, rate: m.total ? Math.round((m.submitted / m.total) * 100) : 0 }))
    .sort((a, b) => b.rate - a.rate || b.submitted - a.submitted || a.pm.localeCompare(b.pm))
}

/** Historical on-time submission rate across the org (trailing, %). */
export const ON_TIME_RATE = 89

export interface AdminNotification {
  id: string
  kind: NotificationKind
  text: string
  time: string
}

export const ADMIN_NOTIFICATIONS: AdminNotification[] = [
  { id: 'an1', kind: 'overdue',   text: 'Comet Data Lake (Sophie Turner) monthly report is 26 days overdue.',      time: 'Today' },
  { id: 'an2', kind: 'overdue',   text: 'Apollo CRM Revamp (John Doe) weekly report is overdue by 2 days.',          time: '2 days ago' },
  { id: 'an3', kind: 'due',       text: '3 reports are due today across 2 project managers.',                        time: '3 hours ago' },
  { id: 'an4', kind: 'submitted', text: 'Orion Mobile Banking report submitted by John Doe.',                        time: 'Yesterday' },
  { id: 'an5', kind: 'assigned',  text: '“Standard Monthly” template assigned to Vega Supply Chain.',                time: 'Yesterday' },
  { id: 'an6', kind: 'info',      text: 'Reporting frequency for Nova E-commerce changed to Weekly.',                time: '3 days ago' },
]

/**
 * Org-wide report submission history — reports submitted each week across ALL
 * projects over the last 8 weeks. Powers the "Weekly Submission Trend" chart.
 */
export interface WeekPoint {
  label: string
  submitted: number
}

export const ADMIN_SUBMISSION_TREND: WeekPoint[] = [
  { label: 'W23', submitted: 9  },
  { label: 'W24', submitted: 11 },
  { label: 'W25', submitted: 10 },
  { label: 'W26', submitted: 12 },
  { label: 'W27', submitted: 11 },
  { label: 'W28', submitted: 10 },
  { label: 'W29', submitted: 12 },
  { label: 'W30', submitted: 7  },
]
