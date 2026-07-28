/**
 * Mock data for the ADMIN "Project Assignment" module.
 *
 * A project can have MULTIPLE reporting assignments — one per frequency
 * (Weekly / Bi-weekly / Monthly), each pointing at a template + its own
 * schedule. Reuses the template library and PM face-avatars.
 *
 * NOTE: dummy/mock data for the design mockup only.
 */
import { PM_AVATARS, formatDate } from './adminReportingData'
import { REPORTING_TEMPLATES, type Frequency } from './reportingTemplatesData'

export { PM_AVATARS, REPORTING_TEMPLATES, formatDate }
export type { Frequency }

export type AssignStatus = 'Assigned' | 'Not Assigned'

export interface Assignment {
  frequency: Frequency
  templateId: string
  startDate: string
  nextDue: string
  remind: boolean
}

export interface AssignmentProject {
  id: string
  name: string
  client: string
  pm: string
  description: string
  assignments: Assignment[]
}

export const ASSIGNMENT_PROJECTS: AssignmentProject[] = [
  {
    id: 'prj-apollo', name: 'Apollo CRM Revamp', client: 'Nordstrom Retail', pm: 'John Doe',
    description: 'Rebuilding the legacy CRM into a modern, modular customer platform with automation and analytics.',
    assignments: [
      { frequency: 'Weekly',   templateId: 'tpl-weekly-std',   startDate: '2026-01-15', nextDue: '2026-07-31', remind: true },
      { frequency: 'Biweekly', templateId: 'tpl-biweekly-std', startDate: '2026-01-15', nextDue: '2026-08-07', remind: true },
      { frequency: 'Monthly',  templateId: 'tpl-monthly-std',  startDate: '2026-01-15', nextDue: '2026-07-29', remind: false },
    ],
  },
  {
    id: 'prj-helios', name: 'Helios Analytics Platform', client: 'Meridian Bank', pm: 'John Doe',
    description: 'Real-time analytics and regulatory reporting platform for the retail banking division.',
    assignments: [
      { frequency: 'Weekly',  templateId: 'tpl-weekly-std',  startDate: '2026-03-01', nextDue: '2026-07-31', remind: true },
      { frequency: 'Monthly', templateId: 'tpl-monthly-std', startDate: '2026-03-01', nextDue: '2026-07-29', remind: true },
    ],
  },
  {
    id: 'prj-orion', name: 'Orion Mobile Banking', client: 'Meridian Bank', pm: 'John Doe',
    description: 'Cross-platform mobile banking app with biometric authentication and instant payments.',
    assignments: [
      { frequency: 'Monthly', templateId: 'tpl-monthly-std', startDate: '2026-01-05', nextDue: '2026-07-29', remind: true },
    ],
  },
  {
    id: 'prj-nova', name: 'Nova E-commerce Portal', client: 'UrbanCart', pm: 'John Doe',
    description: 'Headless commerce storefront with personalized recommendations and a new checkout flow.',
    assignments: [],
  },
  {
    id: 'prj-atlas', name: 'Atlas ERP Migration', client: 'GreenField Logistics', pm: 'Meera Nair',
    description: 'Migrating the on-prem ERP to a cloud-native microservices architecture with zero downtime.',
    assignments: [],
  },
  {
    id: 'prj-zephyr', name: 'Zephyr IoT Dashboard', client: 'AeroSys Industries', pm: 'Meera Nair',
    description: 'IoT telemetry dashboard aggregating sensor data across industrial equipment fleets in real time.',
    assignments: [
      { frequency: 'Biweekly', templateId: 'tpl-biweekly-std', startDate: '2026-02-02', nextDue: '2026-08-05', remind: true },
    ],
  },
  {
    id: 'prj-titan', name: 'Titan Payments Gateway', client: 'FinCore Systems', pm: 'Ravi Teja',
    description: 'PCI-compliant payments gateway handling card, wallet and bank-transfer settlement at scale.',
    assignments: [
      { frequency: 'Weekly', templateId: 'tpl-weekly-std', startDate: '2026-02-10', nextDue: '2026-07-31', remind: true },
    ],
  },
  {
    id: 'prj-lyra', name: 'Lyra Health Portal', client: 'MediTrust Care', pm: 'Ravi Teja',
    description: 'Patient-facing health portal with appointment booking, records access and secure messaging.',
    assignments: [
      { frequency: 'Weekly', templateId: 'tpl-weekly-std', startDate: '2026-03-05', nextDue: '2026-07-24', remind: true },
    ],
  },
  {
    id: 'prj-vega', name: 'Vega Supply Chain', client: 'GreenField Logistics', pm: 'Anita Desai',
    description: 'End-to-end supply chain visibility platform with demand forecasting and route optimization.',
    assignments: [
      { frequency: 'Monthly', templateId: 'tpl-monthly-std', startDate: '2026-01-20', nextDue: '2026-08-29', remind: false },
    ],
  },
  {
    id: 'prj-draco', name: 'Draco Insurance Suite', client: 'Assurex Global', pm: 'Anita Desai',
    description: 'Policy administration and claims suite modernizing core underwriting and settlement workflows.',
    assignments: [
      { frequency: 'Biweekly', templateId: 'tpl-biweekly-std', startDate: '2026-01-12', nextDue: '2026-08-07', remind: true },
    ],
  },
  {
    id: 'prj-phoenix', name: 'Phoenix HRMS', client: 'Concert IDC (Internal)', pm: 'Sophie Turner',
    description: 'Internal HRMS covering onboarding, leave, payroll and performance for the whole organization.',
    assignments: [
      { frequency: 'Weekly', templateId: 'tpl-weekly-std', startDate: '2026-02-01', nextDue: '2026-07-31', remind: true },
    ],
  },
  {
    id: 'prj-comet', name: 'Comet Data Lake', client: 'AeroSys Industries', pm: 'Sophie Turner',
    description: 'Petabyte-scale data lake unifying analytics pipelines across the connected-devices business.',
    assignments: [
      { frequency: 'Monthly', templateId: 'tpl-monthly-std', startDate: '2025-12-15', nextDue: '2026-06-28', remind: true },
    ],
  },
]

export function statusOf(p: AssignmentProject): AssignStatus {
  return p.assignments.length > 0 ? 'Assigned' : 'Not Assigned'
}

export function getAssignmentKpis(list: AssignmentProject[] = ASSIGNMENT_PROJECTS) {
  const total = list.length
  const assigned = list.filter(p => p.assignments.length > 0).length
  const unassigned = total - assigned
  const managers = new Set(list.map(p => p.pm)).size
  return { total, assigned, unassigned, managers }
}

export function templateName(id: string | null): string | null {
  return REPORTING_TEMPLATES.find(t => t.id === id)?.name ?? null
}
