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

/** Placeholder — milestones & critical updates are NOT yet collected by the reporting flow. */
export type FeedKind = 'Milestone' | 'Critical Update'
export interface Milestone { id: string; kind: FeedKind; name: string; project: string; target: string /* ISO */ }
export const UPCOMING_MILESTONES: Milestone[] = [
  { id: 'cu1', kind: 'Critical Update', name: 'Atlas cutover escalated to a war-room',       project: 'Atlas ERP Migration',  target: '2026-07-29' },
  { id: 'cu2', kind: 'Critical Update', name: 'Comet ingestion outage — recovery underway',  project: 'Comet Data Lake',      target: '2026-07-28' },
  { id: 'ms1', kind: 'Milestone',       name: 'Data Migration Cutover',                       project: 'Atlas ERP Migration',  target: '2026-08-05' },
  { id: 'ms2', kind: 'Milestone',       name: 'UAT Sign-off',                                 project: 'Apollo CRM Revamp',    target: '2026-08-08' },
  { id: 'ms3', kind: 'Milestone',       name: 'App Store Release',                            project: 'Orion Mobile Banking', target: '2026-08-12' },
  { id: 'ms4', kind: 'Milestone',       name: 'HIPAA Compliance Audit',                       project: 'Lyra Health Portal',   target: '2026-08-15' },
  { id: 'ms5', kind: 'Milestone',       name: 'Production Go-Live',                           project: 'Titan Payments Gateway', target: '2026-08-20' },
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
