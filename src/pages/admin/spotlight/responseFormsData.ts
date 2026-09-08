import type { AwardKey, Audience } from './nominationTemplatesData'

/* ══════════════════════════════════════════
   Response Forms — shared data layer
   (Spotlight → monthly nomination campaigns)
══════════════════════════════════════════ */

export type CampaignStatus = 'Active' | 'Closed'

/** One award round inside a monthly campaign (= one template that was sent). */
export interface CampaignRound {
  id: string
  templateId: string
  name: string
  award: AwardKey
  /** Who this round went to. Copied from the template at send time. */
  audiences: Audience[]
  invited: number
  responded: number
}

/** A monthly campaign — one Month + Year holding one or more rounds. */
export interface Campaign {
  id: string
  month: number          // 0–11
  year: number
  status: CampaignStatus
  sentOn: string         // ISO
  deadline: string       // ISO
  rounds: CampaignRound[]
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

/** How many people each audience contains (drives the "x of y responded" maths). */
export const AUDIENCE_SIZE: Record<Audience, number> = {
  Managers: 15,
  Employees: 40,
}

export const CAMPAIGN_STATUS_META: Record<CampaignStatus, { color: string; bg: string; border: string }> = {
  Active: { color: '#0A7040', bg: 'rgba(14,168,106,0.10)',  border: 'rgba(14,168,106,0.22)' },
  Closed: { color: '#8B90A7', bg: 'rgba(139,144,167,0.12)', border: 'rgba(139,144,167,0.24)' },
}

/* ── Helpers ── */
export const campaignLabel = (c: Campaign) => `${MONTHS[c.month]} ${c.year}`

export const totalResponded = (c: Campaign) => c.rounds.reduce((s, r) => s + r.responded, 0)
export const totalInvited   = (c: Campaign) => c.rounds.reduce((s, r) => s + r.invited, 0)

export function pct(responded: number, invited: number) {
  return invited === 0 ? 0 : Math.round((responded / invited) * 100)
}

export function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return `${MONTHS_SHORT[d.getMonth()].charAt(0)}${MONTHS_SHORT[d.getMonth()].slice(1).toLowerCase()} ${d.getDate()}, ${d.getFullYear()}`
}

/** Same as formatDate but without the year — the month tile already carries it. */
export function formatDateShort(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  const m = MONTHS_SHORT[d.getMonth()]
  return `${m.charAt(0)}${m.slice(1).toLowerCase()} ${d.getDate()}`
}

/** Whole days between today and an ISO date. Negative = in the past. */
export function daysLeft(iso: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(`${iso}T00:00:00`)
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

/** Last day of a month, as ISO — the default deadline for a campaign. */
export function lastDayISO(month: number, year: number) {
  const d = new Date(year, month + 1, 0)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

export function firstDayISO(month: number, year: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-01`
}

/* ══════════════════════════════════════════
   People + responses (mock, for Campaign detail)
══════════════════════════════════════════ */

export interface Person {
  name: string
  role: string
  department: string
  code: string
  email: string
  avatar: string
}

export interface NominationResponse {
  id: string
  roundId: string
  nominator: Person
  nominee: Person
  reason: string
  submittedOn: string   // ISO
  submittedAt: string   // display time
}

const av = (g: 'men' | 'women', n: number) => `https://randomuser.me/api/portraits/${g}/${n}.jpg`
const mail = (name: string) => `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@concertidc.com`

const person = (name: string, role: string, department: string, code: string, g: 'men' | 'women', n: number): Person =>
  ({ name, role, department, code, email: mail(name), avatar: av(g, n) })

/** ~15 managers — the audience for Rising Star & Outstanding Performer. */
export const MANAGERS: Person[] = [
  person('Arun Prakash',     'Engineering Manager',   'Engineering',   'CIDC-1042', 'men',   32),
  person('Deepa Nair',       'QA Manager',            'Quality',       'CIDC-1078', 'women', 44),
  person('Vikram Sethi',     'Delivery Manager',      'Delivery',      'CIDC-1103', 'men',   51),
  person('Priya Raghavan',   'Product Manager',       'Product',       'CIDC-1119', 'women', 68),
  person('Karthik Menon',    'Engineering Manager',   'Engineering',   'CIDC-1126', 'men',   19),
  person('Sneha Kulkarni',   'Design Lead',           'Design',        'CIDC-1147', 'women', 12),
  person('Rahul Iyer',       'Data Manager',          'Data',          'CIDC-1158', 'men',   76),
  person('Meera Balan',      'HR Manager',            'People Ops',    'CIDC-1163', 'women', 29),
  person('Sanjay Rao',       'Infrastructure Lead',   'Platform',      'CIDC-1171', 'men',   64),
  person('Anita Desai',      'Support Manager',       'Support',       'CIDC-1184', 'women', 55),
  person('Naveen Kumar',     'Engineering Manager',   'Engineering',   'CIDC-1195', 'men',   85),
  person('Lakshmi Suresh',   'Finance Manager',       'Finance',       'CIDC-1207', 'women', 33),
  person('Gopal Krishnan',   'Security Lead',         'Security',      'CIDC-1214', 'men',   41),
  person('Divya Ramesh',     'Marketing Manager',     'Marketing',     'CIDC-1228', 'women', 21),
  person('Suresh Pillai',    'Operations Manager',    'Operations',    'CIDC-1236', 'men',   57),
]

/** Employee pool — nominees for every award, and nominators for Peer Appreciation. */
export const EMPLOYEES: Person[] = [
  person('Ananya Sharma',    'Senior Engineer',       'Engineering',   'CIDC-2011', 'women', 90),
  person('Rohit Verma',      'Backend Engineer',      'Engineering',   'CIDC-2024', 'men',   22),
  person('Nithya Krishnan',  'QA Engineer',           'Quality',       'CIDC-2036', 'women', 15),
  person('Aditya Joshi',     'Frontend Engineer',     'Engineering',   'CIDC-2047', 'men',   45),
  person('Kavya Reddy',      'Data Analyst',          'Data',          'CIDC-2053', 'women', 7),
  person('Manoj Pillai',     'DevOps Engineer',       'Platform',      'CIDC-2068', 'men',   93),
  person('Shalini Gupta',    'UX Designer',           'Design',        'CIDC-2074', 'women', 61),
  person('Vishal Khanna',    'Solutions Architect',   'Engineering',   'CIDC-2089', 'men',   11),
  person('Pooja Nambiar',    'Business Analyst',      'Product',       'CIDC-2095', 'women', 38),
  person('Harish Chandran',  'Support Engineer',      'Support',       'CIDC-2102', 'men',   70),
  person('Rekha Menon',      'Content Strategist',    'Marketing',     'CIDC-2118', 'women', 26),
  person('Siddharth Bose',   'Mobile Engineer',       'Engineering',   'CIDC-2127', 'men',   83),
  person('Aishwarya Rao',    'Product Designer',      'Design',        'CIDC-2134', 'women', 49),
  person('Nikhil Agarwal',   'Data Engineer',         'Data',          'CIDC-2141', 'men',   36),
  person('Swathi Prasad',    'Scrum Master',          'Delivery',      'CIDC-2156', 'women', 72),
  person('Rajesh Thomas',    'Security Analyst',      'Security',      'CIDC-2163', 'men',   28),
  person('Bhavana Shetty',   'HR Executive',          'People Ops',    'CIDC-2179', 'women', 81),
  person('Imran Sheikh',     'Cloud Engineer',        'Platform',      'CIDC-2185', 'men',   60),
  person('Tanvi Deshmukh',   'QA Lead',               'Quality',       'CIDC-2192', 'women', 3),
  person('Praveen Nair',     'Integration Engineer',  'Engineering',   'CIDC-2204', 'men',   14),
]

const REASONS: Record<AwardKey, string[]> = {
  'rising-star': [
    'Joined only eight months ago and is already leading the payments integration end to end. Picks up unfamiliar areas fast and never needs the same explanation twice.',
    'Took ownership of the reporting module when the original owner rolled off, and shipped it two weeks early with zero defects in UAT.',
    'Has grown from writing small fixes to designing whole features this quarter. Consistently asks the right questions before writing code.',
    'Volunteered to rebuild our regression suite and cut the nightly run from four hours to fifty minutes. Huge impact for someone this early in their career.',
    'Handled a production incident alone over a weekend, documented the root cause clearly, and turned it into a runbook the whole team now uses.',
    'Went from needing daily guidance to running the sprint demo on their own inside two quarters. The client now asks for them by name.',
    'Spotted a data inconsistency nobody else had noticed and traced it back through three services before anyone raised a ticket.',
    'Picked up the on-call rotation months earlier than expected and has handled every page calmly and correctly so far.',
    'Rewrote our onboarding guide after going through it themselves, which has cut new-joiner ramp-up time noticeably.',
    'Asked to shadow the architecture reviews, then started contributing genuinely useful design feedback within a month.',
    'Turned a vague product request into a clear technical proposal without being asked to. Saved the team a week of churn.',
    'Consistently the first to test other people’s changes and give thoughtful feedback, despite being the newest on the team.',
    'Took our flakiest test suite personally and made it reliable. Nobody assigned that work — they simply saw the problem.',
    'Handles feedback better than most people twice their experience. Every review comment shows up as a real improvement next time.',
    'Delivered their first client-facing feature this month with almost no supervision and it went live without a single rollback.',
  ],
  'outstanding': [
    'Carried the migration for three clients simultaneously without a single missed deadline. Quality stayed high and the client feedback was outstanding.',
    'Rewrote the settlement engine that had been failing intermittently for a year. Error rate went from 3% to effectively zero.',
    'Consistently the person others go to when something is genuinely hard. Raised the standard of code review across the whole team this quarter.',
    'Delivered the compliance changes ahead of the audit while still mentoring two juniors. Exceptional throughput without cutting corners.',
    'Stepped in as acting lead during my leave and the team did not miss a beat. Handled escalations and planning with real maturity.',
    'Redesigned the batch pipeline and brought the overnight window down from six hours to under ninety minutes.',
    'Handled the most difficult client relationship we have and turned it into a renewal. That was not a technical win alone.',
    'Found and fixed a security gap in our token handling before it ever reached production, then hardened the pattern everywhere else.',
    'Owned the release process for the entire quarter without a single failed deployment. That reliability is easy to overlook.',
    'Absorbed two extra workstreams when the team shrank and still delivered everything on the original timeline.',
    'Their design document for the new billing flow is now the reference other teams copy. Genuinely raised the bar.',
    'Debugged a memory leak that three of us had given up on, and wrote it up so clearly that everyone learned from it.',
    'Balanced a heavy delivery load with mentoring and never once let the mentoring slip. Both sets of work were excellent.',
    'Consistently pushes back on scope in the right way — protects the team without ever damaging the client relationship.',
    'Led the incident response in November calmly and had us back up in under an hour with a full post-mortem the next day.',
  ],
  'peer-appreciation': [
    'Stayed back with me two evenings to debug an issue that was not even in their area. Never once made me feel like I was wasting their time.',
    'Walked me through the deployment process patiently when I joined, and still checks in on how I am doing months later.',
    'Quietly picked up my tickets while I was on sick leave and did not mention it to anyone. Found out only from the commit history.',
    'Always the first to volunteer for the boring work nobody wants. Made the documentation clean-up look easy.',
    'Turned a tense client call around with a lot of patience and calm. Genuinely made the rest of us better in that meeting.',
    'Reviews every pull request I raise within the hour, with comments that actually teach me something rather than just approving.',
    'Noticed I was struggling with the new codebase and set up a weekly half hour to walk through it. Never made it feel like charity.',
    'Covered my on-call shift at short notice when my family emergency came up, and told me not to worry about paying it back.',
    'Explains complicated things without ever making you feel stupid for asking. That is rarer than it should be.',
    'Rebuilt the local dev setup script so the rest of us stopped losing a day every time we changed machines.',
    'Sat with our new joiner for most of their first week. That was time out of their own delivery and they never mentioned it.',
    'Kept the whole team calm during the release weekend and made sure everyone actually took breaks and ate something.',
    'Shares everything they learn in the team channel instead of keeping it to themselves. I have learned a lot just reading along.',
    'Pushed back for me in a meeting when I was not in the room, and made sure I got credit for work that was mine.',
    'Answers questions from every team, not just ours, and somehow still gets their own work done.',
  ],
  'custom': [
    'Consistently goes above and beyond what the role asks for, and lifts everyone around them in the process.',
  ],
}

/** Deterministic pick so the mock data is stable across renders. */
const pick = <T,>(arr: T[], i: number) => arr[i % arr.length]

/** Managers/employees who received a round, in order — the first N responded. */
export function poolFor(round: CampaignRound): Person[] {
  /* A round can carry both audiences, so the pool is the union. */
  return [
    ...(round.audiences.includes('Managers')  ? MANAGERS  : []),
    ...(round.audiences.includes('Employees') ? EMPLOYEES : []),
  ]
}

/** Head-count invited for a set of audiences. */
export function audienceSize(audiences: Audience[]): number {
  return audiences.reduce((sum, a) => sum + AUDIENCE_SIZE[a], 0)
}

export function respondedPeople(round: CampaignRound): Person[] {
  const pool = poolFor(round)
  return Array.from({ length: Math.min(round.responded, pool.length) }, (_, i) => pool[i])
}

export function pendingPeople(round: CampaignRound): Person[] {
  const pool = poolFor(round)
  const start = Math.min(round.responded, pool.length)
  const count = round.invited - round.responded
  return Array.from({ length: Math.min(count, pool.length - start) }, (_, i) => pool[start + i])
}

/** Builds the response rows for one round of a campaign. */
export function responsesForRound(campaign: Campaign, round: CampaignRound): NominationResponse[] {
  const nominators = respondedPeople(round)
  const reasons = REASONS[round.award] ?? REASONS.custom
  const offset = round.award === 'outstanding' ? 7 : round.award === 'peer-appreciation' ? 13 : 0

  return nominators.map((nominator, i) => {
    let nominee = pick(EMPLOYEES, i * 3 + offset)
    if (nominee.code === nominator.code) nominee = pick(EMPLOYEES, i * 3 + offset + 1)
    /* Spread the responses across the collection window — and never date one in the
       future: for the campaign that is still live, today is the latest a response
       can have arrived. Closed months use their whole deadline. */
    const deadlineDay = new Date(`${campaign.deadline}T00:00:00`).getDate()
    const now = new Date()
    const latestDay = campaign.year === now.getFullYear() && campaign.month === now.getMonth()
      ? Math.min(deadlineDay, now.getDate())
      : deadlineDay
    const firstDay = Math.min(2, latestDay)
    const day = nominators.length > 1
      ? Math.round(firstDay + (i * (latestDay - firstDay)) / (nominators.length - 1))
      : firstDay
    const hour = 9 + (i % 8)
    return {
      id: `${campaign.id}-${round.id}-${i}`,
      roundId: round.id,
      nominator,
      nominee,
      reason: pick(reasons, i),
      submittedOn: `${campaign.year}-${String(campaign.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      submittedAt: `${String(hour).padStart(2, '0')}:${String((i * 7) % 60).padStart(2, '0')}`,
    }
  })
}

/* ── Seeded campaigns (mock) ── */
export const SEED_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-2026-08',
    month: 8, year: 2026,
    status: 'Active',
    sentOn: '2026-09-01',
    deadline: '2026-09-30',
    rounds: [
      { id: 'r1', templateId: 'tpl-rising-star',       name: 'Rising Star Nomination', award: 'rising-star',       audiences: ['Managers'],  invited: 15, responded: 12 },
      { id: 'r2', templateId: 'tpl-outstanding',       name: 'Outstanding Performer',  award: 'outstanding',       audiences: ['Managers'],  invited: 15, responded: 9 },
      { id: 'r3', templateId: 'tpl-peer-appreciation', name: 'Peer Appreciation',      award: 'peer-appreciation', audiences: ['Employees'], invited: 40, responded: 14 },
    ],
  },
  {
    id: 'cmp-2026-07',
    month: 7, year: 2026,
    status: 'Closed',
    sentOn: '2026-08-01',
    deadline: '2026-08-31',
    rounds: [
      { id: 'r1', templateId: 'tpl-rising-star',       name: 'Rising Star Nomination', award: 'rising-star',       audiences: ['Managers'],  invited: 15, responded: 15 },
      { id: 'r2', templateId: 'tpl-outstanding',       name: 'Outstanding Performer',  award: 'outstanding',       audiences: ['Managers'],  invited: 15, responded: 14 },
      { id: 'r3', templateId: 'tpl-peer-appreciation', name: 'Peer Appreciation',      award: 'peer-appreciation', audiences: ['Employees'], invited: 40, responded: 32 },
    ],
  },
  {
    id: 'cmp-2026-06',
    month: 6, year: 2026,
    status: 'Closed',
    sentOn: '2026-07-01',
    deadline: '2026-07-31',
    rounds: [
      { id: 'r1', templateId: 'tpl-rising-star', name: 'Rising Star Nomination', award: 'rising-star', audiences: ['Managers'], invited: 15, responded: 13 },
    ],
  },
  {
    id: 'cmp-2026-05',
    month: 5, year: 2026,
    status: 'Closed',
    sentOn: '2026-06-01',
    deadline: '2026-06-30',
    rounds: [
      { id: 'r2', templateId: 'tpl-outstanding', name: 'Outstanding Performer', award: 'outstanding', audiences: ['Managers'], invited: 15, responded: 12 },
    ],
  },
  {
    id: 'cmp-2026-04',
    month: 4, year: 2026,
    status: 'Closed',
    sentOn: '2026-05-01',
    deadline: '2026-05-31',
    rounds: [
      { id: 'r3', templateId: 'tpl-peer-appreciation', name: 'Peer Appreciation', award: 'peer-appreciation', audiences: ['Employees'], invited: 40, responded: 21 },
    ],
  },
]
