/**
 * Mock data for the ADMIN "Reporting Templates" library.
 *
 * A template = a named, reusable report structure the Admin builds by turning
 * sections ON/OFF (and later configuring fields). The section ids below map 1:1
 * to the shared report schema in `reportTemplate.ts`, so the library, the
 * Template Builder, the Preview, and the Manager's report form all stay in sync.
 *
 * NOTE: dummy/mock data for the design mockup only.
 */
import { formatDate, type Frequency } from './adminReportingData'

export { formatDate }
export type { Frequency }

export type TemplateStatus = 'Active' | 'Draft'

export interface ReportTemplate {
  id: string
  name: string
  description: string
  /** The reporting cadence this template targets. */
  frequency: Frequency
  /** Section ids included (from reportTemplate.ts TEMPLATE_SECTIONS). */
  sections: string[]
  /** How many projects currently use this template. */
  projectsUsing: number
  status: TemplateStatus
  /** ISO date of the last edit. */
  updatedAt: string
  /** Accent color for the card's icon tile. */
  accent: string
}

export const REPORTING_TEMPLATES: ReportTemplate[] = [
  {
    id: 'tpl-weekly-std',
    name: 'Standard Weekly',
    description: 'Simple weekly status report — a short notepad entry for each of the five core sections.',
    frequency: 'Weekly',
    sections: ['overview', 'tasks', 'resources', 'risks', 'status'],
    projectsUsing: 4,
    status: 'Active',
    updatedAt: '2026-07-24',
    accent: '#6366F1',
  },
  {
    id: 'tpl-biweekly-std',
    name: 'Standard Bi-weekly',
    description: 'Simple bi-weekly status report — a short notepad entry for each of the five core sections.',
    frequency: 'Biweekly',
    sections: ['overview', 'tasks', 'resources', 'risks', 'status'],
    projectsUsing: 3,
    status: 'Active',
    updatedAt: '2026-07-22',
    accent: '#2563EB',
  },
  {
    id: 'tpl-monthly-std',
    name: 'Standard Monthly',
    description: 'Simple monthly status report — a short notepad entry for each of the five core sections.',
    frequency: 'Monthly',
    sections: ['overview', 'tasks', 'resources', 'risks', 'status'],
    projectsUsing: 2,
    status: 'Draft',
    updatedAt: '2026-07-19',
    accent: '#16A34A',
  },
]

/** Summary counts for the library header KPIs. */
export function getTemplateKpis(list: ReportTemplate[] = REPORTING_TEMPLATES) {
  const total    = list.length
  const active   = list.filter(t => t.status === 'Active').length
  const draft    = list.filter(t => t.status === 'Draft').length
  const projects = list.reduce((sum, t) => sum + t.projectsUsing, 0)
  return { total, active, draft, projects }
}
