import {
  Star, Award, HeartHandshake, Sparkles,
  UserSearch, AlignLeft, Type, ListFilter, Star as StarIcon,
} from 'lucide-react'

/* ══════════════════════════════════════════
   Nomination Templates — shared data layer
   (Spotlight → Rewards & Recognition)
══════════════════════════════════════════ */

export type Audience = 'Managers' | 'Employees'
export type TemplateStatus = 'Active' | 'Draft'

/** Field types supported by the template builder (Step 4). */
export type FieldType =
  | 'employee-picker'   // the key one — auto-fills nominee name/role/email
  | 'long-text'
  | 'short-text'
  | 'dropdown'
  | 'rating'

export interface TemplateField {
  id: string
  label: string
  type: FieldType
  required: boolean
  helpText?: string
  options?: string[]    // for dropdown
}

/** The award identity drives the card icon + accent colour. */
export type AwardKey = 'rising-star' | 'outstanding' | 'peer-appreciation' | 'custom'

export interface NominationTemplate {
  id: string
  name: string
  award: AwardKey
  description: string
  /** Who may nominate with this template. One or both — HR can widen a template later. */
  audiences: Audience[]
  fields: TemplateField[]
  status: TemplateStatus
  updated: string
}

/* ── Shared palette (matches the rest of the admin app) ── */
export const C = {
  navy:   '#1C2035',
  border: '#E8EAF2',
  muted:  '#8B90A7',
  hover:  '#F0F2F8',
  surface:'#F7F8FC',
  indigo: '#6366F1',
  green:  '#0EA86A',
  amber:  '#D97706',
  teal:   '#0D9488',
  red:    '#E84855',
}

/* ── Award themes: icon + accent colour per award type ── */
export const AWARD_THEME: Record<AwardKey, {
  label: string
  Icon: React.ElementType
  color: string
  bg: string
  border: string
}> = {
  'rising-star':       { label: 'Rising Star',          Icon: Star,          color: '#D97706', bg: 'rgba(217,119,6,0.10)',  border: 'rgba(217,119,6,0.22)' },
  'outstanding':       { label: 'Outstanding Performer', Icon: Award,         color: '#6366F1', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.22)' },
  'peer-appreciation': { label: 'Peer Appreciation',    Icon: HeartHandshake, color: '#0D9488', bg: 'rgba(13,148,136,0.10)', border: 'rgba(13,148,136,0.22)' },
  'custom':            { label: 'Custom Award',          Icon: Sparkles,      color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.22)' },
}

/* ── Audience chip styling ── */
export const AUDIENCE_META: Record<Audience, { color: string; bg: string; border: string }> = {
  Managers:  { color: '#6366F1', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.22)' },
  Employees: { color: '#0D9488', bg: 'rgba(13,148,136,0.10)', border: 'rgba(13,148,136,0.22)' },
}

/** Every audience, in the order they should be offered and displayed. */
export const AUDIENCE_ORDER: Audience[] = ['Managers', 'Employees']

/** "Managers", "Employees" or "Managers & Employees" — for chips and body copy. */
export function audienceLabel(audiences: Audience[]): string {
  if (audiences.length === 0) return 'No one selected'
  return AUDIENCE_ORDER.filter(a => audiences.includes(a)).join(' & ')
}

/* ── Field-type registry (used by the builder + preview) ── */
export const FIELD_TYPE_META: Record<FieldType, {
  label: string
  Icon: React.ElementType
  hint: string
}> = {
  'employee-picker': { label: 'Employee Picker', Icon: UserSearch, hint: 'Nominee selector — auto-fills name, role & email' },
  'long-text':       { label: 'Paragraph',       Icon: AlignLeft,  hint: 'Multi-line free text (e.g. reason for nomination)' },
  'short-text':      { label: 'Short Answer',    Icon: Type,       hint: 'Single-line free text' },
  'dropdown':        { label: 'Dropdown',        Icon: ListFilter, hint: 'Choose one from a list of options' },
  'rating':          { label: 'Star Rating',     Icon: StarIcon,   hint: '1–5 star rating' },
}

export const STATUS_META: Record<TemplateStatus, { color: string; bg: string; border: string }> = {
  Active: { color: '#0A7040', bg: 'rgba(14,168,106,0.10)', border: 'rgba(14,168,106,0.22)' },
  Draft:  { color: '#8B90A7', bg: 'rgba(139,144,167,0.12)', border: 'rgba(139,144,167,0.24)' },
}

/** Status options, in the order they should be offered. */
export const STATUS_ORDER: TemplateStatus[] = ['Active', 'Draft']

/* ── Seeded templates (mock) ── */
export const SEED_TEMPLATES: NominationTemplate[] = [
  {
    id: 'tpl-rising-star',
    name: 'Rising Star Nomination',
    award: 'rising-star',
    description: 'For managers to nominate one high-potential team member who has shown remarkable growth and promise this month.',
    audiences: ['Managers'],
    status: 'Active',
    updated: 'Aug 28, 2026',
    fields: [
      { id: 'f1', label: 'Nominee',                 type: 'employee-picker', required: true,  helpText: 'Select one member from your team.' },
      { id: 'f2', label: 'Reason for nomination',   type: 'long-text',       required: true,  helpText: 'What makes them a rising star this month?' },
      { id: 'f3', label: 'Key achievement',         type: 'short-text',      required: false },
    ],
  },
  {
    id: 'tpl-outstanding',
    name: 'Outstanding Performer',
    award: 'outstanding',
    description: 'For managers to recognise one team member whose performance and impact clearly exceeded expectations.',
    audiences: ['Managers'],
    status: 'Active',
    updated: 'Aug 28, 2026',
    fields: [
      { id: 'f1', label: 'Nominee',                 type: 'employee-picker', required: true,  helpText: 'Select one member from your team.' },
      { id: 'f2', label: 'Reason for nomination',   type: 'long-text',       required: true },
      { id: 'f3', label: 'Overall impact',          type: 'rating',          required: false, helpText: 'Rate the overall impact.' },
    ],
  },
  {
    id: 'tpl-peer-appreciation',
    name: 'Peer Appreciation',
    award: 'peer-appreciation',
    description: 'For employees to appreciate a colleague who supported, collaborated with, or positively impacted them this month.',
    audiences: ['Employees'],
    status: 'Active',
    updated: 'Aug 26, 2026',
    fields: [
      { id: 'f1', label: 'Colleague',               type: 'employee-picker', required: true,  helpText: 'Select the colleague you want to appreciate.' },
      { id: 'f2', label: 'What did they do?',        type: 'long-text',       required: true },
    ],
  },
]

/* ── Helpers ── */
export function fieldSummary(t: NominationTemplate): string {
  const n = t.fields.length
  return `${n} question${n === 1 ? '' : 's'}`
}

export function newBlankTemplate(): NominationTemplate {
  return {
    id: `tpl-${Date.now()}`,
    name: '',
    award: 'custom',
    description: '',
    audiences: ['Managers'],
    status: 'Draft',
    updated: 'Just now',
    fields: [
      { id: `f-${Date.now()}`,   label: 'Nominee', type: 'employee-picker', required: true, helpText: 'Select one person to nominate.' },
      { id: `f-${Date.now()+1}`, label: 'Reason for nomination', type: 'long-text', required: true },
    ],
  }
}
