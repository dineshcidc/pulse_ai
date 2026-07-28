/**
 * Shared mock data for the Manager "Project Reporting" module.
 * All four menus (Overview, My Report Projects, Pending Reports, History)
 * read from this single source so the demo data stays consistent everywhere.
 *
 * NOTE: This is dummy/mock data for the design mockup only.
 * The dev team will wire this to the real backend later.
 */

export type Frequency = 'Weekly' | 'Biweekly' | 'Monthly'

export type ReportStatus = 'Not Started' | 'Draft' | 'Submitted' | 'Overdue'

export type Health = 'Healthy' | 'At Risk' | 'Delayed'

export interface TeamMember {
  name: string
  role: string
}

export interface ReportProject {
  id: string
  name: string
  client: string
  frequency: Frequency
  /** ISO date (yyyy-mm-dd) of the next report due for the current cycle */
  nextDue: string
  /** ISO date of the last submitted report, or null if never */
  lastSubmitted: string | null
  status: ReportStatus
  health: Health
  /** Overall project progress %, 0–100 */
  progress: number
  /** Reporting period label for the current cycle */
  period: string

  /* ── project profile (shown in My Report Projects detail) ── */
  description: string
  /** ISO project start / end */
  durationStart: string
  durationEnd: string
  techStack: string[]
  /** Which reporting cadences the Admin configured for this project */
  frequencies: Frequency[]
  /** Seeds to vary the generated timeline for the mockup */
  reportSeed?: { missedLast?: boolean; draftCurrent?: boolean }
  /** Team members assigned to the project (default rows for Leave Status) */
  team: TeamMember[]
}

/** Fixed "today" for the mockup so day-diff chips render deterministically. */
export const TODAY = new Date('2026-07-24')

/** The logged-in Project Manager (dummy). */
export const CURRENT_PM = {
  name: 'John Doe',
  role: 'Project Manager',
}

/** The active reporting cycle the dashboard's due-dates are relative to. */
export const CURRENT_PERIOD = {
  label: 'Week 30',
  range: 'Jul 21 – 27, 2026',
}

export const REPORT_PROJECTS: ReportProject[] = [
  {
    id: 'prj-apollo',
    name: 'Apollo CRM Revamp',
    client: 'Nordstrom Retail',
    frequency: 'Weekly',
    nextDue: '2026-07-22',
    lastSubmitted: '2026-07-15',
    status: 'Overdue',
    health: 'At Risk',
    progress: 62,
    period: 'Week 30 · Jul 21–27',
    description: 'Rebuilding the legacy CRM into a modern, modular customer platform with automation and analytics.',
    durationStart: '2026-01-15',
    durationEnd: '2026-12-31',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    frequencies: ['Weekly', 'Biweekly', 'Monthly'],
    reportSeed: { missedLast: true },
    team: [
      { name: 'Sarah Johnson', role: 'Frontend Lead' },
      { name: 'Rajesh Kumar', role: 'Backend Engineer' },
      { name: 'Priya Sharma', role: 'QA Engineer' },
      { name: 'Arjun Menon', role: 'UI/UX Designer' },
      { name: 'Neha Patel', role: 'Backend Engineer' },
    ],
  },
  {
    id: 'prj-helios',
    name: 'Helios Analytics Platform',
    client: 'Meridian Bank',
    frequency: 'Weekly',
    nextDue: '2026-07-25',
    lastSubmitted: '2026-07-18',
    status: 'Draft',
    health: 'Healthy',
    progress: 78,
    period: 'Week 30 · Jul 21–27',
    description: 'Real-time analytics and regulatory reporting platform for the retail banking division.',
    durationStart: '2026-03-01',
    durationEnd: '2026-11-30',
    techStack: ['Next.js', 'Python', 'Snowflake', 'Kafka'],
    frequencies: ['Weekly', 'Biweekly'],
    reportSeed: { draftCurrent: true },
    team: [
      { name: 'David Chen', role: 'Data Engineer' },
      { name: 'Ananya Rao', role: 'Full-Stack Engineer' },
      { name: 'Mohammed Ali', role: 'Data Analyst' },
      { name: 'Emily Clark', role: 'QA Engineer' },
    ],
  },
  {
    id: 'prj-nova',
    name: 'Nova E-commerce Portal',
    client: 'UrbanCart',
    frequency: 'Weekly',
    nextDue: '2026-07-25',
    lastSubmitted: '2026-07-18',
    status: 'Not Started',
    health: 'Healthy',
    progress: 45,
    period: 'Week 30 · Jul 21–27',
    description: 'Headless commerce storefront with personalized product recommendations and a new checkout flow.',
    durationStart: '2026-02-10',
    durationEnd: '2026-10-15',
    techStack: ['React', 'GraphQL', 'MongoDB', 'Redis'],
    frequencies: ['Weekly'],
    team: [
      { name: 'Lisa Wong', role: 'Frontend Engineer' },
      { name: 'Karthik Iyer', role: 'Backend Engineer' },
      { name: 'Sofia Garcia', role: 'UI/UX Designer' },
      { name: 'Tom Baker', role: 'QA Engineer' },
    ],
  },
  {
    id: 'prj-orion',
    name: 'Orion Mobile Banking',
    client: 'Meridian Bank',
    frequency: 'Biweekly',
    nextDue: '2026-08-01',
    lastSubmitted: '2026-07-18',
    status: 'Submitted',
    health: 'Healthy',
    progress: 88,
    period: 'Jul 14–25 (Biweekly)',
    description: 'Cross-platform mobile banking app with biometric authentication and instant payments.',
    durationStart: '2026-01-05',
    durationEnd: '2026-09-30',
    techStack: ['React Native', 'Kotlin', 'Swift', 'Node.js'],
    frequencies: ['Biweekly', 'Monthly'],
    team: [
      { name: 'James Wilson', role: 'Mobile Lead' },
      { name: 'Meera Nair', role: 'iOS Engineer' },
      { name: 'Daniel Kim', role: 'Android Engineer' },
      { name: 'Fatima Sheikh', role: 'QA Engineer' },
    ],
  },
  {
    id: 'prj-atlas',
    name: 'Atlas ERP Migration',
    client: 'GreenField Logistics',
    frequency: 'Monthly',
    nextDue: '2026-07-31',
    lastSubmitted: '2026-06-30',
    status: 'Not Started',
    health: 'Delayed',
    progress: 34,
    period: 'July 2026 (Monthly)',
    description: 'Migrating the on-prem ERP to a cloud-native microservices architecture with zero downtime.',
    durationStart: '2025-11-20',
    durationEnd: '2026-08-30',
    techStack: ['Java', 'Spring Boot', 'Kubernetes', 'Azure'],
    frequencies: ['Monthly'],
    reportSeed: { missedLast: true },
    team: [
      { name: 'Robert Fox', role: 'Solutions Architect' },
      { name: 'Divya Menon', role: 'Backend Engineer' },
      { name: 'Chris Evans', role: 'DevOps Engineer' },
      { name: 'Sneha Reddy', role: 'Data Migration Lead' },
      { name: 'Paul Adams', role: 'QA Engineer' },
    ],
  },
  {
    id: 'prj-zephyr',
    name: 'Zephyr IoT Dashboard',
    client: 'AeroSys Industries',
    frequency: 'Biweekly',
    nextDue: '2026-08-05',
    lastSubmitted: '2026-07-22',
    status: 'Submitted',
    health: 'Healthy',
    progress: 71,
    period: 'Jul 21–Aug 1 (Biweekly)',
    description: 'Real-time IoT telemetry dashboard for monitoring aerospace equipment across facilities.',
    durationStart: '2026-04-01',
    durationEnd: '2027-02-28',
    techStack: ['Vue', 'Go', 'TimescaleDB', 'MQTT'],
    frequencies: ['Biweekly'],
    team: [
      { name: 'Olivia Brown', role: 'Frontend Engineer' },
      { name: 'Vikram Singh', role: 'IoT Engineer' },
      { name: 'Grace Lee', role: 'Backend Engineer' },
      { name: 'Hassan Malik', role: 'QA Engineer' },
    ],
  },
]

/** Derived KPI counts for the Reporting Overview page. */
export function getReportingKpis(projects: ReportProject[] = REPORT_PROJECTS) {
  const total = projects.length
  const submitted = projects.filter(p => p.status === 'Submitted').length
  const overdue = projects.filter(p => p.status === 'Overdue').length
  // "Pending" = anything still needing action but not yet overdue
  const pending = projects.filter(p => p.status === 'Not Started' || p.status === 'Draft').length
  const onTime = total > 0 ? Math.round((submitted / total) * 100) : 0
  return { total, submitted, overdue, pending, onTime }
}

/** Whole-day difference from TODAY to an ISO date (negative = overdue). */
export function daysFromToday(iso: string): number {
  const d = new Date(iso)
  const ms = d.getTime() - TODAY.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

/** Short human date like "22 Jul 2026". */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export type NotificationKind = 'overdue' | 'due' | 'submitted' | 'info' | 'assigned'

export interface ReportNotification {
  id: string
  kind: NotificationKind
  text: string
  time: string
}

export const REPORT_NOTIFICATIONS: ReportNotification[] = [
  { id: 'n1', kind: 'overdue',   text: 'Apollo CRM Revamp weekly report is overdue by 2 days.',            time: '2 days ago' },
  { id: 'n2', kind: 'due',       text: 'Helios Analytics and Nova E-commerce reports are due tomorrow.',   time: '5 hours ago' },
  { id: 'n3', kind: 'assigned',  text: 'Admin assigned the "Standard Monthly" template to Atlas ERP.',     time: 'Yesterday' },
  { id: 'n4', kind: 'submitted', text: 'Zephyr IoT Dashboard biweekly report submitted successfully.',     time: 'Yesterday' },
  { id: 'n5', kind: 'info',      text: 'Reporting frequency for Nova E-commerce changed to Weekly.',       time: '3 days ago' },
  { id: 'n6', kind: 'due',       text: 'Weekly reporting window for Week 30 is now open.',                time: 'Today' },
]

/**
 * Report submission history — how many project reports this PM submitted each
 * week over the last 8 weeks. Powers the "Submission Trend" chart, which shows
 * reporting consistency over time (the KPI cards only show the current snapshot).
 */
export interface WeekPoint {
  label: string
  submitted: number
}

export const SUBMISSION_TREND: WeekPoint[] = [
  { label: 'W23', submitted: 4 },
  { label: 'W24', submitted: 3 },
  { label: 'W25', submitted: 5 },
  { label: 'W26', submitted: 4 },
  { label: 'W27', submitted: 5 },
  { label: 'W28', submitted: 4 },
  { label: 'W29', submitted: 5 },
  { label: 'W30', submitted: 2 },
]

/* ────────────────────────────────────────────────────────────
 * Automatic due-date engine
 *
 * The system generates report periods & due dates from frequency —
 * the Admin never sets them manually:
 *   • Weekly    → every Friday
 *   • Biweekly  → every other Friday
 *   • Monthly   → 2 days before the end of the month
 * ──────────────────────────────────────────────────────────── */

export type TimelineStatus = 'Submitted' | 'Draft' | 'Overdue' | 'Due' | 'Upcoming'

export interface ReportPeriod {
  id: string
  /** Period title, e.g. "Week 30" or "July 2026" */
  label: string
  /** Date-range subtitle, e.g. "20 Jul – 24 Jul" */
  sub: string
  /** ISO due date */
  dueDate: string
  status: TimelineStatus
  /** ISO submission date, when status is Submitted */
  submittedOn?: string
}

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setUTCDate(x.getUTCDate() + n)
  return x
}

/** The Friday on or after the given date. */
function fridayOnOrAfter(base: Date): Date {
  const d = new Date(base)
  const diff = (5 - d.getUTCDay() + 7) % 7
  return addDays(d, diff)
}

/** Due date for a month = 2 days before the last day of that month. */
function monthlyDue(year: number, monthIndex: number): Date {
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0))
  return addDays(lastDay, -2)
}

/** ISO week number. */
function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const dayNum = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4))
  return 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000))
}

function shortDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

function labelFor(freq: Frequency, due: Date): { label: string; sub: string } {
  if (freq === 'Monthly') {
    return {
      label: due.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }),
      sub: `Due ${shortDate(due)}`,
    }
  }
  if (freq === 'Biweekly') {
    const start = addDays(due, -11) // Monday of first week
    const end = addDays(due, 2)     // Sunday of second week
    return {
      label: `Weeks ${isoWeek(addDays(due, -7))}–${isoWeek(due)}`,
      sub: `${shortDate(start)} – ${shortDate(end)}`,
    }
  }
  // Weekly
  const mon = addDays(due, -4)
  const sun = addDays(due, 2)
  return { label: `Week ${isoWeek(due)}`, sub: `${shortDate(mon)} – ${shortDate(sun)}` }
}

/**
 * Generate a report timeline for a frequency, centered on TODAY.
 * Returns periods ascending by due date with an auto-assigned status.
 */
export function generateTimeline(
  freq: Frequency,
  seed: { missedLast?: boolean; draftCurrent?: boolean } = {},
): ReportPeriod[] {
  const dues: Date[] = []
  if (freq === 'Weekly') {
    const cur = fridayOnOrAfter(TODAY)
    for (let i = -3; i <= 2; i++) dues.push(addDays(cur, i * 7))
  } else if (freq === 'Biweekly') {
    const cur = fridayOnOrAfter(TODAY)
    for (let i = -3; i <= 2; i++) dues.push(addDays(cur, i * 14))
  } else {
    const y = TODAY.getUTCFullYear(), m = TODAY.getUTCMonth()
    for (let i = -3; i <= 2; i++) dues.push(monthlyDue(y, m + i))
  }

  const todayMs = TODAY.getTime()
  const sorted = [...dues].sort((a, b) => a.getTime() - b.getTime())
  const currentDue = sorted.find(d => d.getTime() >= todayMs)
  const past = sorted.filter(d => d.getTime() < todayMs)
  const lastPast = past[past.length - 1]

  return sorted.map(d => {
    const iso = toISO(d)
    const { label, sub } = labelFor(freq, d)
    let status: TimelineStatus
    let submittedOn: string | undefined
    if (d.getTime() < todayMs) {
      if (seed.missedLast && lastPast && d.getTime() === lastPast.getTime()) {
        status = 'Overdue'
      } else {
        status = 'Submitted'
        submittedOn = iso
      }
    } else if (currentDue && d.getTime() === currentDue.getTime()) {
      status = seed.draftCurrent ? 'Draft' : 'Due'
    } else {
      status = 'Upcoming'
    }
    return { id: `${freq}-${iso}`, label, sub, dueDate: iso, status, submittedOn }
  })
}
