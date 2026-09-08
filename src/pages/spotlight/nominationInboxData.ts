import type { Audience, AwardKey, NominationTemplate } from '../admin/spotlight/nominationTemplatesData'
import { SEED_TEMPLATES } from '../admin/spotlight/nominationTemplatesData'
import type { Campaign, CampaignRound, Person } from '../admin/spotlight/responseFormsData'
import { SEED_CAMPAIGNS, EMPLOYEES, MANAGERS, MONTHS, daysLeft } from '../admin/spotlight/responseFormsData'

/* ══════════════════════════════════════════
   Nominator side — shared data layer
   (what the signed-in Manager / Employee sees
    of the Admin's monthly Spotlight campaign)
══════════════════════════════════════════ */

export type NominatorRole = 'manager' | 'employee'

/** Which audience a role belongs to — Rising Star + Outstanding go to Managers,
    Peer Appreciation goes to Employees. */
export const AUDIENCE_FOR_ROLE: Record<NominatorRole, Audience> = {
  manager:  'Managers',
  employee: 'Employees',
}

/** The signed-in nominator (prototype — the dashboards greet "John"). */
export const CURRENT_USER: Record<NominatorRole, Person> = {
  employee: {
    name: 'John Doe', role: 'Software Engineer', department: 'Engineering',
    code: 'CIDC-2008', email: 'john.doe@concertidc.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  manager: {
    name: 'John Doe', role: 'Engineering Manager', department: 'Engineering',
    code: 'CIDC-1004', email: 'john.doe@concertidc.com',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
}

/** The manager's own team — the only people they may nominate for Rising Star / Outstanding. */
export const MY_TEAM: Person[] = EMPLOYEES.slice(0, 6)

/**
 * Who this role is allowed to nominate.
 * - **Employees** (Peer Appreciation) may pick **anyone in CIDC** — confirmed 2026-09-03.
 * - **Managers** (Rising Star / Outstanding) may pick only their own team.
 * Self-nomination is not allowed for either, so the current user is always filtered out.
 */
export function nomineeCandidatesFor(role: NominatorRole): Person[] {
  const me   = CURRENT_USER[role]
  const pool = role === 'employee' ? [...MANAGERS, ...EMPLOYEES] : MY_TEAM
  return pool.filter(p => p.code !== me.code)
}

/** One answer to a non-nominee, non-reason template field (short text, rating, dropdown…). */
export interface SubmissionAnswer {
  label: string
  value: string
}

/** A nomination this user has already sent in, for one award round. */
export interface MySubmission {
  roundId: string
  nominee: Person
  reason: string
  answers: SubmissionAnswer[]
  submittedOn: string   // ISO
  submittedAt: string   // display time, e.g. "10:42 AM"
}

/* ── Mock submission store ──────────────────────────────
   Module-level on purpose: the dashboard unmounts when the
   user navigates to the form page and back, so React state
   would be lost. Step 10 writes here after submitting. */
const SUBMISSIONS = new Map<string, MySubmission>()

const subKey = (campaignId: string, roundId: string) => `${campaignId}:${roundId}`

export function getSubmission(campaignId: string, roundId: string): MySubmission | null {
  return SUBMISSIONS.get(subKey(campaignId, roundId)) ?? null
}

export function saveSubmission(campaignId: string, submission: MySubmission) {
  SUBMISSIONS.set(subKey(campaignId, submission.roundId), submission)
}

export function clearSubmissions() {
  SUBMISSIONS.clear()
}

/* ── The nominator's view of a campaign ── */

/** One award the user is being asked to nominate for. */
export interface NominationTask {
  round: CampaignRound
  award: AwardKey
  template: NominationTemplate | null
  submission: MySubmission | null
}

export interface NominationInbox {
  campaign: Campaign
  audience: Audience
  tasks: NominationTask[]
  total: number
  submittedCount: number
  allSubmitted: boolean
  daysRemaining: number
  /** 7 days or fewer to the deadline — the UI turns the date red. */
  closingSoon: boolean
}

/**
 * The open campaign for this role, or `null` when there is nothing to nominate
 * for — no active campaign, the deadline has passed, or the campaign carries no
 * award round aimed at this user's audience. `null` means: render no card.
 */
export function nominationInboxFor(role: NominatorRole): NominationInbox | null {
  const audience = AUDIENCE_FOR_ROLE[role]

  const campaign = SEED_CAMPAIGNS.find(c =>
    c.status === 'Active' &&
    daysLeft(c.deadline) >= 0 &&
    c.rounds.some(r => r.audiences.includes(audience)),
  )
  if (!campaign) return null

  const tasks: NominationTask[] = campaign.rounds
    .filter(r => r.audiences.includes(audience))
    .map(round => ({
      round,
      award: round.award,
      template: SEED_TEMPLATES.find(t => t.id === round.templateId) ?? null,
      submission: getSubmission(campaign.id, round.id),
    }))

  const submittedCount = tasks.filter(t => t.submission).length
  const daysRemaining  = daysLeft(campaign.deadline)

  return {
    campaign,
    audience,
    tasks,
    total: tasks.length,
    submittedCount,
    allSubmitted: submittedCount === tasks.length,
    daysRemaining,
    closingSoon: daysRemaining <= 7,
  }
}

/* ── History across every campaign (list + view pages) ──
   `nominationInboxFor` above only ever looks at the *open* campaign, because the
   dashboard card and the form only care about what is owed right now. The Reward
   Nominations list needs the opposite: every month, open or long closed. */

/** One row of the Reward Nominations list — one award round in one month. */
export interface NominationRecord {
  /** `campaignId:roundId` — stable, and what the view page is addressed by. */
  key: string
  campaign: Campaign
  /** "August 2026" */
  monthLabel: string
  round: CampaignRound
  award: AwardKey
  template: NominationTemplate | null
  submission: MySubmission | null
  /** The live campaign, deadline not yet passed — this row is still actionable. */
  isOpen: boolean
}

/** Submitted · still open · closed without a submission. */
export type RecordStatus = 'submitted' | 'open' | 'missed'

export function recordStatus(r: NominationRecord): RecordStatus {
  if (r.submission) return 'submitted'
  return r.isOpen ? 'open' : 'missed'
}

/**
 * Every award round this role was ever asked to nominate for, newest month first.
 * Rows without a submission are kept on purpose: an open one is still actionable,
 * and a closed one is a month that was missed. Both belong in the record.
 */
export function myNominationRecords(role: NominatorRole): NominationRecord[] {
  const audience = AUDIENCE_FOR_ROLE[role]
  const rows: NominationRecord[] = []

  for (const campaign of SEED_CAMPAIGNS) {
    const isOpen = campaign.status === 'Active' && daysLeft(campaign.deadline) >= 0
    for (const round of campaign.rounds) {
      if (!round.audiences.includes(audience)) continue
      rows.push({
        key: `${campaign.id}:${round.id}`,
        campaign,
        monthLabel: `${MONTHS[campaign.month]} ${campaign.year}`,
        round,
        award: round.award,
        template: SEED_TEMPLATES.find(t => t.id === round.templateId) ?? null,
        submission: getSubmission(campaign.id, round.id),
        isOpen,
      })
    }
  }

  return rows.sort((a, b) =>
    b.campaign.year - a.campaign.year ||
    b.campaign.month - a.campaign.month ||
    a.round.id.localeCompare(b.round.id))
}

/** One record by its `campaignId:roundId` key, for the view page. */
export function myNominationRecord(role: NominatorRole, key: string): NominationRecord | null {
  return myNominationRecords(role).find(r => r.key === key) ?? null
}

/* ── Past-month history seed (ON) ───────────────────────
   The *current* month must always start un-submitted (confirmed rule), so nothing
   here touches the active campaign — these are closed months only, which is what
   gives the list page something to show. Replace with real data when a backend
   exists. Rounds: r1 = Rising Star, r2 = Outstanding (both Managers),
   r3 = Peer Appreciation (Employees). */
const SEED_HISTORY = true

if (SEED_HISTORY) {
  /* ---- Employee history (Peer Appreciation, r3) ---- */

  // August 2026 — closed 31 Aug
  saveSubmission('cmp-2026-07', {
    roundId: 'r3',
    nominee: EMPLOYEES[6],   // Shalini Gupta — UX Designer, Design
    reason:
      'Shalini rebuilt the entire onboarding flow in under three weeks, and she did it while ' +
      'still picking up every design review the rest of us threw at her. When the client pushed ' +
      'the deadline forward she reworked the whole prototype over a weekend without being asked, ' +
      'then sat with the engineering team for two days to make sure it shipped exactly as designed.',
    answers: [],
    submittedOn: '2026-08-14',
    submittedAt: '10:42 AM',
  })

  // May 2026 — closed 31 May
  saveSubmission('cmp-2026-04', {
    roundId: 'r3',
    nominee: EMPLOYEES[5],   // Manoj Pillai — DevOps Engineer, Platform
    reason:
      'Our build pipeline broke the morning of a release and Manoj dropped everything to sit with ' +
      'me until it was green again. He did not just fix it either — he wrote up what had gone wrong ' +
      'so the rest of the team could handle it themselves next time.',
    answers: [],
    submittedOn: '2026-05-09',
    submittedAt: '04:15 PM',
  })

  /* ---- Manager history (Rising Star r1, Outstanding r2) ---- */

  // August 2026 — both awards submitted
  saveSubmission('cmp-2026-07', {
    roundId: 'r1',
    nominee: EMPLOYEES[3],   // Aditya Joshi — Frontend Engineer
    reason:
      'Aditya joined us six months ago and is already the person the team turns to on anything ' +
      'front-end. He picked up the component library nobody wanted to own, documented it, and has ' +
      'quietly cut our UI defect count by more than half since.',
    answers: [{ label: 'Key achievement', value: 'Owned and documented the shared component library.' }],
    submittedOn: '2026-08-11',
    submittedAt: '09:20 AM',
  })

  saveSubmission('cmp-2026-07', {
    roundId: 'r2',
    nominee: EMPLOYEES[0],   // Ananya Sharma — Senior Engineer
    reason:
      'Ananya carried the platform migration from design through to cut-over. She kept every ' +
      'stakeholder informed without being chased once, and when the rollback plan was needed at ' +
      '2am she ran it calmly and had us back up inside the hour.',
    answers: [{ label: 'Overall impact', value: '5 of 5' }],
    submittedOn: '2026-08-19',
    submittedAt: '02:05 PM',
  })

  /* July 2026 (cmp-2026-06, Rising Star) is deliberately left un-submitted — the list
     page needs a closed month with nothing sent, so the "Not submitted" state is real. */

  // June 2026 — Outstanding Performer
  saveSubmission('cmp-2026-05', {
    roundId: 'r2',
    nominee: EMPLOYEES[14],  // Swathi Prasad — Scrum Master, Delivery
    reason:
      'Swathi took over a delivery that was three weeks behind and turned it around without ' +
      'once burning the team out. She rebuilt the plan, renegotiated scope with the client ' +
      'herself, and we shipped on the revised date with nothing dropped.',
    answers: [{ label: 'Overall impact', value: '4 of 5' }],
    submittedOn: '2026-06-23',
    submittedAt: '11:36 AM',
  })
}

/* ── Prototype seed (OFF) ───────────────────────────────
   Everyone starts un-submitted: the dashboard card shows "Open" and
   the CTA is `Submit Nomination`, which is the real first-run state.
   Step 10's form is what will fill the store for real.
   Flip to `true` only to preview the submitted recap page before then.
   Delete this block once Step 10 lands. */
const SEED_A_SUBMITTED_NOMINATION = false

if (SEED_A_SUBMITTED_NOMINATION) {
  saveSubmission('cmp-2026-08', {
    roundId:  'r3',
    nominee:  EMPLOYEES[6],   // Shalini Gupta — UX Designer, Design
    reason:
      'Shalini rebuilt the entire onboarding flow in under three weeks, and she did it while ' +
      'still picking up every design review the rest of us threw at her. When the client pushed ' +
      'the deadline forward she reworked the whole prototype over a weekend without being asked, ' +
      'then sat with the engineering team for two days straight to make sure it was built exactly ' +
      'as designed. She never once made it feel like a favour.',
    answers: [
      { label: 'Key achievement', value: 'Redesigned and shipped the onboarding flow ahead of the revised client deadline.' },
      { label: 'How often do they go above and beyond?', value: 'Consistently' },
    ],
    submittedOn: '2026-09-03',
    submittedAt: '10:42 AM',
  })
}
