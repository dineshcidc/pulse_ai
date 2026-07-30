/**
 * Mock data for the ADMIN "Portfolio Dashboard → Projects Dashboard".
 *
 * Grounded in what the Project Reporting flow collects:
 *   • risk level + risk notes   (Risks & Issues card)
 *   • utilization / billable %   (Project Efforts tab, aggregated)
 *   • team count                 (Project Efforts / project profile)
 *   • health                     (derived from risk + utilization variance)
 *
 * PLACEHOLDERS (not yet captured by the report — kept so the layout is ready):
 *   • UPCOMING_MILESTONES        (needs a Milestones input in the report)
 *   • GENAI_ADOPTION_AVG         (needs a GenAI-adoption metric in the report)
 *
 * NOTE: dummy/mock data for the design mockup only.
 */

export type Health = 'Healthy' | 'At Risk' | 'Delayed'
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'
export type ProjectStatus = 'Active' | 'On Hold' | 'Completed'

export interface PortfolioProject {
  id: string
  name: string
  client: string
  pm: string
  status: ProjectStatus
  teamCount: number
  /** Utilization % = logged ÷ expected hours. */
  utilization: number
  /** Billable utilization % = billable ÷ total logged hours. */
  billable: number
  health: Health
  risk: RiskLevel
  /** Number of open risks logged for the project this period. */
  riskCount: number
  /** The manager's Risks & Issues note from the latest report. */
  riskNote: string
}

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  { id: 'prj-apollo',  name: 'Apollo CRM Revamp',        client: 'Nordstrom Retail',       pm: 'John Doe',      status: 'Active',    teamCount: 8,  utilization: 92, billable: 88, health: 'At Risk', risk: 'High',     riskCount: 2, riskNote: 'Third-party payment API latency spikes under peak load, occasionally breaching the 2s checkout SLA. A vendor escalation is open and we have added retry logic plus response caching as interim mitigation.' },
  { id: 'prj-helios',  name: 'Helios Analytics',         client: 'Meridian Bank',          pm: 'John Doe',      status: 'Active',    teamCount: 6,  utilization: 78, billable: 82, health: 'Healthy', risk: 'Low',      riskCount: 0, riskNote: 'No major risks this period. The regulatory reporting module is tracking to plan and passed the last compliance dry-run, and team capacity is stable with no open blockers.' },
  { id: 'prj-nova',    name: 'Nova E-commerce',          client: 'UrbanCart',              pm: 'John Doe',      status: 'On Hold',   teamCount: 5,  utilization: 64, billable: 70, health: 'Healthy', risk: 'Medium',   riskCount: 1, riskNote: 'Checkout redesign is blocked on the client content freeze, and there is a minor schedule risk if the freeze slips past next week. Daily follow-ups with the client POC are in place.' },
  { id: 'prj-orion',   name: 'Orion Mobile Banking',     client: 'Meridian Bank',          pm: 'Meera Nair',    status: 'Active',    teamCount: 7,  utilization: 85, billable: 90, health: 'Healthy', risk: 'Low',      riskCount: 0, riskNote: 'Biometric authentication certification is pending vendor sign-off, which is a low risk and currently on track. All other modules are progressing as planned with no resourcing gaps this cycle.' },
  { id: 'prj-atlas',   name: 'Atlas ERP Migration',      client: 'GreenField Logistics',   pm: 'Meera Nair',    status: 'Active',    teamCount: 10, utilization: 128, billable: 84, health: 'Delayed', risk: 'Critical', riskCount: 3, riskNote: 'The data-migration cutover slipped one cycle and the zero-downtime window is now at risk. Mitigation is a staged migration with a tested rollback plan, currently in dry-run.' },
  { id: 'prj-zephyr',  name: 'Zephyr IoT Dashboard',     client: 'AeroSys Industries',     pm: 'Meera Nair',    status: 'Active',    teamCount: 6,  utilization: 73, billable: 68, health: 'At Risk', risk: 'Medium',   riskCount: 1, riskNote: 'Live sensor-data volume is running higher than the original sizing, causing occasional ingestion lag. A scaling spike is planned for next sprint to add partitioning and autoscaling.' },
  { id: 'prj-titan',   name: 'Titan Payments Gateway',   client: 'FinCore Systems',        pm: 'Ravi Teja',     status: 'Active',    teamCount: 9,  utilization: 88, billable: 92, health: 'Healthy', risk: 'Low',      riskCount: 0, riskNote: 'The project is stable with no blockers. A PCI review is scheduled with all prerequisites complete, and performance and security tests are passing.' },
  { id: 'prj-lyra',    name: 'Lyra Health Portal',       client: 'MediTrust Care',         pm: 'Ravi Teja',     status: 'Active',    teamCount: 5,  utilization: 69, billable: 75, health: 'At Risk', risk: 'High',     riskCount: 2, riskNote: 'HIPAA audit findings are pending remediation and pose a compliance risk to the go-live date. Three of five findings are resolved; the remaining two require a vendor configuration change.' },
  { id: 'prj-vega',    name: 'Vega Supply Chain',        client: 'GreenField Logistics',   pm: 'Anita Desai',   status: 'Completed', teamCount: 8,  utilization: 81, billable: 80, health: 'Healthy', risk: 'Low',      riskCount: 0, riskNote: 'On track with no significant risks. The demand-forecasting model accuracy is above target and integration testing is progressing well.' },
  { id: 'prj-draco',   name: 'Draco Insurance Suite',    client: 'Assurex Global',         pm: 'Anita Desai',   status: 'Active',    teamCount: 7,  utilization: 112, billable: 86, health: 'At Risk', risk: 'Medium',   riskCount: 1, riskNote: 'The underwriting rules-engine complexity is growing and we are watching for scope creep on Phase 2. Requirements are being re-baselined with the client to keep the backlog controlled.' },
  { id: 'prj-phoenix', name: 'Phoenix HRMS',             client: 'Concert IDC (Internal)', pm: 'Sophie Turner', status: 'Completed', teamCount: 4,  utilization: 58, billable: 40, health: 'Healthy', risk: 'Low',      riskCount: 0, riskNote: 'Internal project with low billability by design; progress is steady. The onboarding and leave modules are complete and in UAT, with no external dependencies or blockers.' },
  { id: 'prj-comet',   name: 'Comet Data Lake',          client: 'AeroSys Industries',     pm: 'Sophie Turner', status: 'Active',    teamCount: 6,  utilization: 62, billable: 66, health: 'Delayed', risk: 'Critical', riskCount: 3, riskNote: 'Ingestion-pipeline instability is blocking downstream analytics, and reporting has historically been overdue. A recovery plan is in progress, including a rewrite of the ingestion connectors.' },
]

/**
 * Milestones & Critical Updates — the free-text the manager writes in that report
 * section (paragraphs or simple bullet lines). Rendered as text cards on the dashboard.
 * PLACEHOLDER — not yet collected by the reporting flow.
 */
/**
 * Inline markup used inside `content` (parsed on the dashboard):
 *   **bold**      → bold emphasis
 *   {{date}}      → highlighted date (colored)
 *   !!critical!!  → red critical text
 */
export interface ProjectUpdate { id: string; project: string; content: string }
export const MILESTONE_UPDATES: ProjectUpdate[] = [
  {
    id: 'u-atlas', project: 'Atlas ERP Migration',
    content: 'Data-migration cutover pushed to {{Aug 5}} after the staging dry-run surfaced **two schema-mapping defects**. The rollback plan has been tested and signed off by the DBA team. !!The zero-downtime go-live window is now at risk!! and awaits business approval.',
  },
  {
    id: 'u-comet', project: 'Comet Data Lake',
    content: '!!Ingestion-pipeline instability is blocking downstream analytics.!! Connectors are being rewritten with retry/backoff handling and all analytics milestones stay **blocked** until throughput holds steady for {{3 consecutive days}}. A daily war-room continues.',
  },
  {
    id: 'u-apollo', project: 'Apollo CRM Revamp',
    content: 'UAT sign-off is targeted for {{Aug 8}}. The payment-gateway retry logic **shipped to staging** and passed the first load test. Next up: a client walkthrough of the new checkout flow, followed by the final content freeze before release.',
  },
  {
    id: 'u-titan', project: 'Titan Payments Gateway',
    content: '• PCI review scheduled for {{next week}}\n• Production go-live milestone confirmed for {{Aug 20}}\n• Performance and security suites are **all passing**\n• No open blockers this cycle',
  },
  {
    id: 'u-orion', project: 'Orion Mobile Banking',
    content: 'Biometric-auth certification has been **submitted**; a vendor response is expected {{this week}}. The App Store release milestone remains on track for {{Aug 12}} pending that certification. No blockers on the current build.',
  },
]

export interface MonthPoint { label: string; active: number }
/** Active projects, month on month (last 8 months) — consistently high (line sits near the top). */
export const ACTIVE_TREND: MonthPoint[] = [
  { label: 'Dec', active: 11 },
  { label: 'Jan', active: 12 },
  { label: 'Feb', active: 12 },
  { label: 'Mar', active: 11 },
  { label: 'Apr', active: 12 },
  { label: 'May', active: 12 },
  { label: 'Jun', active: 11 },
  { label: 'Jul', active: 12 },
]

/** Placeholder metric — not yet collected by the report. */
export const GENAI_ADOPTION_AVG = 41

/* ────────────────────────── Project Detail View data ──────────────────────────
   Everything below is derived deterministically from a project so the detail
   page works for any row. Grounded in what the report collects:
   narrative notes (4 cards) + Project Efforts (numeric backbone) + report history. */

export interface EffortRow { name: string; role: string; allocation: number; expected: number; logged: number; billable: boolean }
export interface ReportEntry { period: string; status: 'Submitted' | 'Overdue' | 'Draft'; date: string }
export interface TaskItem { title: string; date: string; status: 'Completed' | 'In Progress' | 'Blocked' }
export interface RiskItem { title: string; severity: RiskLevel; note: string }
export interface MilestoneItem { name: string; date: string; kind: 'Milestone' | 'Critical Update'; status: 'On Track' | 'At Risk' | 'Done' }
export interface ProjectDetail {
  tasks: TaskItem[]
  risks: RiskItem[]
  milestones: MilestoneItem[]
  efforts: EffortRow[]
  reports: ReportEntry[]
}

const EFFORT_NAMES = ['Sarah Johnson','Tom Davis','Karthik Nair','Priya Sharma','Emma Wilson','Arjun Patel','Lisa Garcia','Rahul Khanna','Nina Volkov','Meera Pillai','Ravi Kumar','Grace Kim']
const EFFORT_ROLES = ['Tech Lead','Senior Engineer','Backend Engineer','Frontend Engineer','QA Engineer','UI/UX Designer','DevOps Engineer','Business Analyst']
const ALLOC = [100, 80, 100, 60, 75, 90, 50, 100]

const TASK_POOL = ['OAuth login integration','Customer schema migration','Dashboard analytics v1','Checkout flow refinement','Reporting export module','Performance tuning','API retry & caching','UAT test preparation','Security review fixes','CI pipeline hardening']
const TASK_STATUS: TaskItem['status'][] = ['Completed','In Progress','Blocked','In Progress','Completed']
const RISK_POOL = [
  { title: 'Third-party API latency',    note: 'Vendor latency spikes under peak load; retry + caching added and escalated.' },
  { title: 'Delayed client sign-off',    note: 'UAT feedback still pending; daily follow-ups scheduled with the client POC.' },
  { title: 'QA bandwidth gap',           note: 'QA capacity is tight ahead of the release window; contractor being onboarded.' },
  { title: 'Scope creep — Phase 2',      note: 'Requirements expanding; re-baselining the backlog with the client this week.' },
  { title: 'Vendor certification pending', note: 'Certification response expected this week; low risk but on the critical path.' },
]
const MILESTONE_POOL: { name: string; kind: MilestoneItem['kind'] }[] = [
  { name: 'UAT Sign-off',           kind: 'Milestone' },
  { name: 'Production Go-Live',      kind: 'Milestone' },
  { name: 'Data Migration Cutover',  kind: 'Critical Update' },
  { name: 'Security Audit',          kind: 'Milestone' },
  { name: 'Client Demo',             kind: 'Milestone' },
]

function hashStr(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h }

export function getProjectDetail(p: PortfolioProject): ProjectDetail {
  const seed = hashStr(p.id)
  const efforts: EffortRow[] = Array.from({ length: p.teamCount }, (_, i) => {
    const allocation = ALLOC[(seed + i) % ALLOC.length]
    const expected = Math.round((allocation / 100) * 160) // ~monthly capacity
    const factor = (p.utilization / 100) * (0.9 + ((seed + i) % 5) * 0.05)
    const logged = Math.round(expected * factor)
    return {
      name: EFFORT_NAMES[(seed + i * 5) % EFFORT_NAMES.length],
      role: EFFORT_ROLES[(seed + i * 3) % EFFORT_ROLES.length],
      allocation, expected, logged,
      billable: ((seed + i) % 4) !== 0,
    }
  })

  const reports: ReportEntry[] = [
    { period: 'Week 30 · Jul 21–27',     status: p.health === 'Delayed' ? 'Overdue' : 'Submitted', date: '2026-07-25' },
    { period: 'Week 29 · Jul 14–20',     status: 'Submitted', date: '2026-07-18' },
    { period: 'Week 28 · Jul 07–13',     status: 'Submitted', date: '2026-07-11' },
    { period: 'Week 27 · Jun 30–Jul 06', status: 'Submitted', date: '2026-07-04' },
    { period: 'Week 26 · Jun 23–29',     status: 'Submitted', date: '2026-06-27' },
  ]

  const tasks: TaskItem[] = Array.from({ length: 4 }, (_, i) => {
    const day = Math.max(1, 24 - i * 4) // Jul 24, 20, 16, 12
    return {
      title: TASK_POOL[(seed + i * 3) % TASK_POOL.length],
      status: TASK_STATUS[(seed + i) % TASK_STATUS.length],
      date: `2026-07-${String(day).padStart(2, '0')}`,
    }
  })

  const sevOrder: RiskLevel[] = [p.risk, 'Medium', 'Low']
  const risks: RiskItem[] = Array.from({ length: 3 }, (_, i) => {
    const r = RISK_POOL[(seed + i * 2) % RISK_POOL.length]
    return { title: r.title, note: r.note, severity: sevOrder[i] }
  })

  const msStatus: MilestoneItem['status'][] = ['On Track', 'At Risk', 'On Track']
  const milestones: MilestoneItem[] = Array.from({ length: 5 }, (_, i) => {
    const m = MILESTONE_POOL[(seed + i * 3) % MILESTONE_POOL.length]
    return {
      name: m.name, kind: m.kind,
      status: p.health === 'Delayed' && i === 0 ? 'At Risk' : msStatus[i % msStatus.length],
      date: `2026-08-${String(5 + i * 5).padStart(2, '0')}`, // Aug 5, 10, 15, 20, 25
    }
  })

  return { tasks, risks, milestones, efforts, reports }
}

export function getPortfolioKpis(list: PortfolioProject[] = PORTFOLIO_PROJECTS) {
  const total = list.length
  const active = list.filter(p => p.status === 'Active').length
  const avgBillable = Math.round(list.reduce((s, p) => s + p.billable, 0) / total)
  const atRiskDelayed = list.filter(p => p.health === 'At Risk' || p.health === 'Delayed').length
  return { total, active, avgBillable, atRiskDelayed }
}

export function getRiskCounts(list: PortfolioProject[] = PORTFOLIO_PROJECTS) {
  return {
    Critical: list.filter(p => p.risk === 'Critical').length,
    High:     list.filter(p => p.risk === 'High').length,
    Medium:   list.filter(p => p.risk === 'Medium').length,
    Low:      list.filter(p => p.risk === 'Low').length,
  }
}
