/*
 * HR-Initiated Offboarding — shared roster + taxonomies.
 *
 * The "Initiate Offboarding" screen (HI-1 Individual, HI-2 Bulk) needs a list of
 * ACTIVE employees for HR to choose from — a new data need, distinct from the
 * already-offboarding cases in hrData.ts.
 *
 * Dedupe guard: employees whose code is in OFFBOARDING_CODES are already inside an
 * active offboarding case (they came from hrData.HR_CASES), so the picker shows them
 * disabled with an "Already in offboarding" note and they can't be re-initiated.
 */

export type RosterEmployee = {
  code: string
  name: string
  designation: string
  department: string
  manager: string
  avatar: string
  doj: string        // YYYY-MM-DD
  email: string
}

// Codes that already sit in an active offboarding case (mirrors hrData.HR_CASES).
// Kept as a plain list so the picker can flag them without importing case data.
export const OFFBOARDING_CODES = ['CC001', 'CC024', 'CC021', 'CC009', 'CC017', 'CC003', 'CC047']

export const ROSTER: RosterEmployee[] = [
  // ── Fresh, fully-active employees (the real candidates) ──
  { code: 'CC034', name: 'Vikram Iyer',      designation: 'Senior Backend Engineer', department: 'Engineering', manager: 'Priya Sharma', avatar: 'https://randomuser.me/api/portraits/men/76.jpg', doj: '2022-02-14', email: 'vikram.iyer@concertidc.com' },
  { code: 'CC041', name: 'Sneha Kapoor',     designation: 'Frontend Engineer',       department: 'Engineering', manager: 'Priya Sharma', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', doj: '2023-05-08', email: 'sneha.kapoor@concertidc.com' },
  { code: 'CC028', name: 'Rohan Desai',      designation: 'QA Engineer',             department: 'Quality',     manager: 'Priya Sharma', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', doj: '2021-07-19', email: 'rohan.desai@concertidc.com' },
  { code: 'CC052', name: 'Ananya Rao',       designation: 'Product Designer',        department: 'Design',      manager: 'Karthik Rao', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', doj: '2023-11-02', email: 'ananya.rao@concertidc.com' },
  { code: 'CC037', name: 'Faisal Ahmed',     designation: 'DevOps Engineer',         department: 'Platform',    manager: 'Karthik Rao', avatar: 'https://randomuser.me/api/portraits/men/60.jpg', doj: '2022-08-25', email: 'faisal.ahmed@concertidc.com' },
  { code: 'CC045', name: 'Divya Menon',      designation: 'Business Analyst',        department: 'Delivery',    manager: 'Anil Verma',  avatar: 'https://randomuser.me/api/portraits/women/33.jpg', doj: '2023-01-16', email: 'divya.menon@concertidc.com' },
  { code: 'CC019', name: 'Sandeep Nair',     designation: 'Solutions Architect',     department: 'Delivery',    manager: 'Anil Verma',  avatar: 'https://randomuser.me/api/portraits/men/41.jpg', doj: '2020-04-06', email: 'sandeep.nair@concertidc.com' },
  { code: 'CC056', name: 'Priyanka Joshi',   designation: 'Associate Engineer',      department: 'Engineering', manager: 'Priya Sharma', avatar: 'https://randomuser.me/api/portraits/women/58.jpg', doj: '2024-06-10', email: 'priyanka.joshi@concertidc.com' },
  { code: 'CC030', name: 'Manoj Pillai',     designation: 'Support Engineer',        department: 'Platform',    manager: 'Karthik Rao', avatar: 'https://randomuser.me/api/portraits/men/85.jpg', doj: '2021-09-30', email: 'manoj.pillai@concertidc.com' },
  { code: 'CC048', name: 'Kavya Krishnan',   designation: 'UX Researcher',           department: 'Design',      manager: 'Karthik Rao', avatar: 'https://randomuser.me/api/portraits/women/90.jpg', doj: '2023-03-21', email: 'kavya.krishnan@concertidc.com' },
  { code: 'CC025', name: 'Aditya Verma',     designation: 'Data Engineer',           department: 'Engineering', manager: 'Priya Sharma', avatar: 'https://randomuser.me/api/portraits/men/15.jpg', doj: '2021-05-11', email: 'aditya.verma@concertidc.com' },
  { code: 'CC061', name: 'Ritika Sharma',    designation: 'HR Executive',            department: 'People',      manager: 'Anil Verma',  avatar: 'https://randomuser.me/api/portraits/women/21.jpg', doj: '2024-02-05', email: 'ritika.sharma@concertidc.com' },

  // ── Already offboarding (shown disabled by the dedupe guard) ──
  { code: 'CC001', name: 'John Doe',     designation: 'Senior Software Engineer', department: 'Engineering', manager: 'Priya Sharma', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', doj: '2021-03-12', email: 'john.doe@concertidc.com' },
  { code: 'CC017', name: 'Arjun Menon',  designation: 'DevOps Engineer',          department: 'Platform',    manager: 'Karthik Rao', avatar: 'https://randomuser.me/api/portraits/men/52.jpg', doj: '2021-11-15', email: 'arjun.menon@concertidc.com' },
  { code: 'CC009', name: 'Meera Nair',   designation: 'Business Analyst',         department: 'Delivery',    manager: 'Anil Verma',  avatar: 'https://randomuser.me/api/portraits/women/68.jpg', doj: '2019-08-05', email: 'meera.nair@concertidc.com' },
]

export function isOffboarding(code: string): boolean {
  return OFFBOARDING_CODES.includes(code)
}

// Involuntary reason taxonomy (HR-side) — distinct from the employee's voluntary reasons.
export const INVOLUNTARY_REASONS = [
  'Performance',
  'Business / Restructuring',
  'Redundancy',
  'Policy Violation / Misconduct',
  'Attendance / Availability',
  'Contract End',
  'Other',
]

export type PriorityKey = 'normal' | 'high' | 'urgent'

export const PRIORITIES: { key: PriorityKey; label: string; hint: string; color: string; bg: string; border: string }[] = [
  { key: 'normal', label: 'Normal', hint: 'Standard exit timeline',       color: '#5A5F82', bg: 'rgba(91,95,130,0.10)',  border: 'rgba(91,95,130,0.30)' },
  { key: 'high',   label: 'High',   hint: 'Expedite — remove soon',       color: '#B26905', bg: 'rgba(217,119,6,0.10)',  border: 'rgba(217,119,6,0.35)' },
  { key: 'urgent', label: 'Urgent', hint: 'Serious case — remove ASAP',   color: '#C0334A', bg: 'rgba(232,72,85,0.10)',  border: 'rgba(232,72,85,0.38)' },
]

export function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
