import type { ElementType } from 'react'
import {
  LayoutDashboard, ListChecks, Users, AlertTriangle, ClipboardList,
} from 'lucide-react'
import type { Frequency } from './reportingData'

/**
 * The Project Report Template — kept deliberately simple.
 *
 * Every reporting frequency (Weekly / Bi-weekly / Monthly) uses the SAME
 * five sections. Each section is just a free-form, notepad-style text area —
 * the manager types or pastes the content. No multi-field forms, no wizards.
 *
 *   1. Overview
 *   2. Current Tasks
 *   3. Resource Allocation
 *   4. Risks & Issues
 *   5. {Weekly | Bi-weekly | Monthly} Status   ← label adapts to the frequency
 *
 * The only thing that changes between frequencies is the label of the last
 * section, so the report always reads naturally for its cadence.
 */

// Kept as a full union so the Admin builder/preview (which map FieldKind →
// their own field types) keep type-checking. The simplified template only
// ever uses `textarea`.
export type FieldKind =
  | 'text' | 'textarea' | 'number' | 'percent' | 'segmented' | 'select' | 'list' | 'bullets' | 'teamcount'

export interface FieldOption {
  value: string
  color?: string
}

export interface SubField {
  id: string
  label: string
  kind: 'text' | 'textarea' | 'segmented' | 'date' | 'number'
  options?: FieldOption[]
  placeholder?: string
  span?: 'half' | 'full'
}

export interface FieldDef {
  id: string
  label: string
  kind: FieldKind
  placeholder?: string
  help?: string
  required?: boolean
  options?: FieldOption[]
  unit?: string
  half?: boolean
  addLabel?: string
  subFields?: SubField[]
}

export interface SectionDef {
  id: string
  name: string
  description: string
  Icon: ElementType
  frequencies: Frequency[]
  fields: FieldDef[]
}

const ALL: Frequency[] = ['Weekly', 'Biweekly', 'Monthly']

/** One notepad text area per section. */
function notepad(id: string, label: string, placeholder: string): FieldDef {
  return { id: 'notes', label, kind: 'textarea', placeholder, required: id === 'overview' || id === 'status' }
}

export const TEMPLATE_SECTIONS: SectionDef[] = [
  {
    id: 'overview',
    name: 'Overview',
    description: 'A quick summary of where the project stands this period.',
    Icon: LayoutDashboard,
    frequencies: ALL,
    fields: [notepad('overview', 'Overview', 'Summarize where the project stands this period — overall status, health and the most important highlights…')],
  },
  {
    id: 'tasks',
    name: 'Current Tasks',
    description: 'What the team worked on, completed, and has in progress.',
    Icon: ListChecks,
    frequencies: ALL,
    fields: [notepad('tasks', 'Current Tasks', 'List what the team worked on and completed this period, and what is currently in progress…')],
  },
  {
    id: 'resources',
    name: 'Resource Allocation',
    description: 'Team allocation, utilization, and any resourcing changes.',
    Icon: Users,
    frequencies: ALL,
    fields: [notepad('resources', 'Resource Allocation', 'Note team size, who is allocated to what, utilization, and any resourcing changes or gaps…')],
  },
  {
    id: 'risks',
    name: 'Risks & Issues',
    description: 'Key risks, issues, and how they are being handled.',
    Icon: AlertTriangle,
    frequencies: ALL,
    fields: [notepad('risks', 'Risks & Issues', 'Capture the key risks and issues affecting delivery, their impact, and how you plan to handle them…')],
  },
  {
    id: 'status',
    name: 'Weekly Status',
    description: 'Overall status for the period and the plan ahead.',
    Icon: ClipboardList,
    frequencies: ALL,
    fields: [notepad('status', 'Status', 'Add the overall status for this period, the plan for next period, and any notes for leadership…')],
  },
]

const FREQ_WORD: Record<Frequency, string> = { Weekly: 'Weekly', Biweekly: 'Bi-weekly', Monthly: 'Monthly' }

/** The status section's title adapts to the reporting frequency. */
export function sectionTitle(section: SectionDef, freq: Frequency): string {
  return section.id === 'status' ? `${FREQ_WORD[freq]} Status` : section.name
}

export function sectionsForFrequency(_freq: Frequency): SectionDef[] {
  // Every frequency uses the same five sections; only the Status label differs.
  return TEMPLATE_SECTIONS
}
