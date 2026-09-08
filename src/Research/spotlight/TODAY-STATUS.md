# Spotlight R&R — TODAY STATUS (recap sheet)

> Quick recap for resuming work. Last updated: **2026-09-07 (morning)**.
> Full detail: `Spotlight-RR-Nomination-UIUX-Flow.md` · Step list: `Spotlight-RR-Build-Steps.md`

---

## 👋 If you're reading this after a "Hi" — start here

We are building the **Spotlight → Rewards & Recognition Nomination** feature (new Admin menu).
The plan has **5 phases / 12 steps**.

**Done: Steps 1–12. The original 5 phases are COMPLETE** — Admin side and nominator side, for
both Managers and Employees. `npx tsc -b` and `npm run build` both clean.

**Also done: a follow-on ask — Reward Nominations history for employees and managers.**
Step 1 of 3 (the menu) is done: the header's grid icon opens a `Quick Access` drawer holding a
`Reward Nominations` item. Steps 2 and 3 (the **list page** and the **view page**) are built and wired for **both the Employee
and Manager logins**. This ask is complete — nothing is outstanding.

Also done 2026-09-07: the template builder's Audience field is now multi-select (Managers, Employees
or both) with new option-card UI for Audience and Status — see that log entry.

Still deliberately out of scope: the winner→poster handoff.

---

## 📅 What we did TODAY (2026-09-07) — Step 12, Phase 5 wrap ✅

**Step 12 is done. The feature is complete.**

### Build ✅
- `npx tsc -b` — clean.
- `npm run build` — **passes** (✓ 5.24s, 1914 modules). This was the run that had never been
  exercised since the nominator side landed. Two warnings, both accepted as prototype-only:
  the JS bundle is 3.3 MB / 619 kB gzipped (no code-splitting), and the five reward PNGs total
  ~51 MB (`Rewardimage-3.png` alone is 21.8 MB). **Decision: leave both** — no deployment
  target yet. Compress the images before this ever ships for real.

### Visual pass ✅ — every screen, driven with Playwright
Admin: templates gallery · template builder + live preview · Response Forms list · Send wizard
(duplicate-month guard fires and Continue stays disabled) · campaign detail (award tabs, stat
tiles, response table). Employee: open card → form → validation summary → picker → confirm
modal → dashboard → recap. Manager: two-award form → submit one → dashboard **1 OF 2
SUBMITTED** → amber partial recap with the dashed outstanding row.
**Zero console errors on every run.** Yesterday's amber-strip fix and the `Submit Nomination` /
`View Nomination` CTA switch both verified. Manager picker correctly offers exactly the 6 team
members with self filtered out.

### 🐞 Three defects found and fixed
1. **Future-dated responses** (`responseFormsData.ts`) — the generated day was clamped to the
   campaign *deadline* (Sep 30) instead of to today, so the live campaign listed responses
   submitted Sep 8/10/12/14 while today was Sep 7. Now spread evenly across the real collection
   window and capped at today for the live month; closed months still use their whole deadline.
2. **Recap nominee block didn't match the form** (`MyNominationPage.tsx`) — correction #6 was
   applied to the form but never propagated to the recap, which still rendered
   `role · department` plus an **Employee Code** cell. **Your call: match the form everywhere.**
   Department and the code cell are gone; the email cell now runs full width.
3. **Stale picker copy in 3 places** — all promised the picker "auto-fills name, email, role
   **& employee code**", which the UI no longer shows. Now "auto-fills name, role & email" in
   `NominationFormPage.tsx`, `NominationTemplateBuilderPage.tsx` and `nominationTemplatesData.ts`.

Re-verified after the fixes: `tsc -b` clean, `npm run build` clean, both screens re-screenshotted.

### 🎨 Layout change — the Submit Nomination form is a 3 / 9 sticky TAB layout
Your call, arrived at over three rounds. Two rejected attempts are recorded so nobody rebuilds them:

1. **Stacked award cards** (the original) — the manager's two-award page was needlessly long.
2. **4 / 8, award identity in a full-height award-tinted left panel** — *rejected*: two big
   saturated colour blocks down the page looked bad.
3. **4 / 8 tab rail with award 2 locked until award 1 was submitted** — *rejected*: the lock was
   wrong, a manager may submit the awards in whatever order they like.

**The shipped design:**
- **3 / 9 grid with a real gap** (`gap-5`, `alignItems: 'start'`) — two separate cards, not one
  card split by a divider.
- **Left 3 — its own white card, sticky** (`position: sticky, top: 0`, matching the recap page's
  rail). Header row: `YOUR AWARDS` + a `n/n` submitted counter that turns green at completion.
  One tab per award: award icon in its own tint, award name, status line. **Selected** = indigo
  tinted row, indigo left bar, `Filling in now`. **Submitted** = green check + `Submitted`
  (not clickable — nominations can't be edited). Otherwise `Not started`, clickable, hover tint.
- **No locking, any order.** Every unsubmitted award is selectable from the start. Submitting one
  marks it done and drops selection to the next open award; only when **all** are in does the
  page return to the dashboard (rule 5 still holds at the end of the flow).
- **Right 9 — only the selected award's form**: a compact heading (3px award-colour accent bar +
  award name + description), the fields, the validation summary, and the footer. The `n of n`
  chip was removed from this heading — with free ordering it read as a step counter, and the
  rail's `n/n` already carries progress.
- Because `inbox` is derived once by `NominationModule`, a submission made without leaving the
  page is tracked in local `justSubmitted` state; `isSubmitted()` ORs it with `task.submission`.

Verified: only one form is on screen, so the manager's page does not scroll at a normal window
height (873px of content in 873px), down from 1349px with 417px of overflow when stacked. Sticky
proven under a short viewport — scrolling 300px moved the form the full 300px while the rail moved
130px and then pinned. Out-of-order submit checked (award 2 first → award 1 stays open). `tsc -b`
and `npm run build` clean, zero console errors, both roles re-screenshotted.

### 🧭 New nominator menu — Quick Access drawer behind the header's grid icon (step 1 of 3)
Employees and managers need to reach their Rewards & Recognition nominations for the **current
month and every past month**. That needed a menu entry, and you chose the header's grid icon
(`LayoutGrid`, sitting left of the help icon) opening an off-canvas drawer like Notifications.

**Done — placement only, as agreed:**
- The grid icon was **inert** before; it now toggles a `Quick Access` drawer. Same off-canvas
  shell as the notification panel: 400px, right side, `zIndex` 8000/8001, dim overlay that closes
  on click, `22px 24px 18px` header with title, subtitle and an `X`.
- Inside: a `REWARDS & RECOGNITION` section label, then one menu row — violet Trophy icon,
  **`Reward Nominations`** (your suggested name, pluralised because it lists many months),
  the line "Your nominations for this month and every month before", and a chevron.
- Clicking it closes the drawer and calls `onNavigate('reward-nominations')`.
- **Role-gated in `Header.tsx` via `QUICK_LINKS`:** only `Employee` and `Project Manager` get it.
  Admin and System Admin have no links, so for them the grid icon **stays inert exactly as
  before** rather than opening an empty drawer.
- `PAGE_LABELS` in both `EmployeeDashboard.tsx` and `ManagerDashboard.tsx` gained
  `'reward-nominations': 'Reward Nominations'`, so the route already renders the app's existing
  `ComingSoon` placeholder with the right title. **No placeholder page was invented** — that slot
  is where the list page goes next.

Verified: drawer opens for Manager and Employee, item navigates and the drawer closes, Admin's
icon does nothing. `tsc -b` and `npm run build` clean, zero console errors.

### 📋 Reward Nominations list + view pages (steps 2 and 3 of 3)
Built on the menu from the entry above. You asked for employee first, manager after, so **the
manager route is deliberately NOT wired yet** — see NEXT SESSION. Everything is role-parameterised,
so wiring the manager is one route line plus a screenshot pass.

**Data layer — `nominationInboxData.ts`**
- `nominationInboxFor()` only ever looked at the *open* campaign. Added the opposite view:
  **`myNominationRecords(role)`** walks every `SEED_CAMPAIGNS` entry, keeps the rounds aimed at
  that role's audience, and returns them newest month first as `NominationRecord`
  (`key` = `campaignId:roundId`, campaign, monthLabel, round, award, template, submission, isOpen).
  **`myNominationRecord(role, key)`** fetches one for the view page.
- **`recordStatus()`** → `submitted` · `open` (live round, still owed) · `missed` (closed, nothing
  sent). Rows with no submission are kept on purpose — an open one is actionable, a closed one is
  a month that was missed, and both belong in the record.
- **`SEED_HISTORY = true`** seeds *closed months only*, so the confirmed rule that the current
  month starts un-submitted is untouched. Employee: Aug 2026 + May 2026 Peer Appreciation.
  Manager: Aug 2026 Rising Star + Outstanding, Jun 2026 Outstanding — **July 2026 Rising Star is
  left un-submitted on purpose** so the `missed` state is real when the manager side is wired.

**`MyNominationsListPage.tsx`** — h1 + subtitle (top-level page, no breadcrumb), an indigo
`Submit Nomination` CTA that only appears while something is open, three stat tiles (submitted /
awaiting you / months on record), then one table card with the search + award + status filters
**inside** it. Columns: Month (+ open-now or closed-on), Award (tinted icon + name), Who you
nominated (name + role — **no employee code**, per correction #6), Submitted (date + time), Status
pill, and a row action — eye into the view page, or a trophy into the form for an open row. Award
filter options are derived from the user's own records. Empty state distinguishes "no records at
all" from "nothing matches those filters".

**`NominationRecordViewPage.tsx`** — read-only, works for any month. Employee/Manager breadcrumb
(`Reward Nominations / August 2026 · Peer Appreciation`), h1 + `Submitted` pill, then the detail-page
8/4 grid with a sticky right rail. Left: award strip, nominee (picture, name, role + email cell),
the full untruncated reason in an award-tinted quote block, any extra template answers, submitted
footer. Right: `Nomination details` (award, month, closed-on, round state), a `This is a record`
note, and the judging-panel note. Kept separate from `MyNominationPage.tsx`, which remains the
current-month recap behind `View Nomination`.

**`MyNominationsModule.tsx`** owns the `reward-nominations` route — list, or one record by key.

Verified on the employee login, entering through the Quick Access drawer: 3 rows (Sep open, Aug +
May submitted), search, both filters, the empty-filter state, eye → view → back, trophy → form.
**Full round trip:** submitted the open September round from the list's trophy action and came back
to find September reading `Arun Prakash / Submitted` with an eye action, the tiles moved to 3 of 3
and "Nothing outstanding", and the header CTA gone. `tsc -b` and `npm run build` clean, zero
console errors.

### ✂️ Trimmed on your review, then MANAGER wired — Reward Nominations complete
1. **The three stat cards are gone** (`Nominations submitted` / `Awaiting you` / `Months on
   record`) and so is the **`Submit Nomination` CTA that sat at the top right** of the list.
   The page is now heading + subtitle, then straight into the table card. `StatTile` was deleted
   rather than left dead. The **row-level trophy action is kept** — that is still how you get from
   an open row into the form.
2. **Manager route wired** — `ManagerDashboard.tsx` now has the same `reward-nominations` line as
   `EmployeeDashboard.tsx`, pointing at `MyNominationsModule role="manager"`.

**Manager verified** — 6 rows and all three statuses real:
| Month | Award | Status |
|---|---|---|
| September 2026 | Rising Star | Awaiting you (trophy → form) |
| September 2026 | Outstanding Performer | Awaiting you (trophy → form) |
| August 2026 | Rising Star | Submitted — Aditya Joshi |
| August 2026 | Outstanding Performer | Submitted — Ananya Sharma |
| July 2026 | Rising Star | **Not submitted** |
| June 2026 | Outstanding Performer | Submitted — Swathi Prasad |

Award filter picks up both manager awards and narrows to 3 rows on Outstanding; the status filter
isolates the single missed row. Both extra-answer types render on the view page — Rising Star's
`Key achievement` (short text) and Outstanding's `Overall impact` as `5 of 5`. `tsc -b` and
`npm run build` clean, zero console errors on both logins.
---

## 📅 What we did TODAY (2026-09-03)

Built the **entire nominator side** — Steps 9, 11 and 10, in that order — then did a round of
design corrections from your review.

### Step 9 — Dashboard alert card ✅
New shared folder **`src/pages/spotlight/`** for the nominator side (mirrors how `src/offboarding/` is cross-role — the admin half stays in `src/pages/admin/spotlight/`).

**`nominationInboxData.ts`** — the nominator's data layer:
- `NominatorRole` (`manager` | `employee`) + `AUDIENCE_FOR_ROLE` → Managers / Employees.
- `CURRENT_USER` (the signed-in "John Doe", per role) and `MY_TEAM` (the manager's 6 reports).
- `nomineeCandidatesFor(role)` — **who you're allowed to nominate**, self always filtered out.
- `nominationInboxFor(role)` finds the **Active** campaign whose deadline hasn't passed and that has at least one round for that role's audience, and returns `{ campaign, tasks, total, submittedCount, allSubmitted, daysRemaining, closingSoon }`. Returns **`null`** when there's nothing to nominate for — the card then renders nothing.
- Mock submission store with `getSubmission` / `saveSubmission` / `clearSubmissions`. **Module-level on purpose** — the dashboard unmounts when you navigate to the form and back, so React state would be lost.

**`NominationAlertCard.tsx`** — white shell + tinted banner (Trophy, `Rewards & Recognition — September 2026`, state pill, role-specific copy, `Closes Sep 30 · 27 days left` turning red at ≤7 days) + **one tile per award owed** (themed icon, `Awaiting your nomination` → `You nominated <Name>`, clock/check chip). **2-up grid for managers**, 1-up for employees. Rendered once in `DashboardPage.tsx` (both roles share it) between the Appraisal and Offboarding alerts.

### Step 11 — "My Nomination" recap page ✅
**`MyNominationPage.tsx`** — the read-only record of what you submitted:
- **State-aware confirmation strip** — green *"Your nomination is in…"* only when everything is in; **amber** *"1 of 2 nominations submitted. You still have Outstanding Performer to go…"* when a manager still owes one. *(The green-always version was a real bug, caught while testing the manager path, and fixed.)*
- **8/4 grid.** LEFT: one card per submitted award — themed award strip + `Submitted` chip, nominee block, the **full untruncated reason** in an award-tinted quote block, any extra template answers, submitted-timestamp footer. Plus a dashed row for any award still owed, with its own Submit CTA.
- RIGHT (sticky): **What happens next** 4-step timeline (Nomination submitted → Nominations close → HR compiles every entry → Judging panel picks the winners) + a **Need to change something?** note stating nominations can't be edited once submitted.

### Step 10 — The Nomination Form ✅
**`NominationFormPage.tsx`** — **rendered straight off each award's template `fields`**, so whatever the Admin builder produced is what the nominator fills in. Nothing about the questions is hardcoded.
- All 5 field types live: **employee-picker** (search by name / code / role / department → pick one → auto-fills the person, with a `× Change` button), **long-text**, **short-text**, **dropdown**, **rating** (clickable 5-star in the award's accent, "N of 5" readout).
- One themed card per award still pending. Managers see both stacked with `1 of 2` / `2 of 2` chips; employees see just Peer Appreciation. **Each award has its own Submit** — submitting is one-way per award. Superseded 2026-09-07: the awards are no longer stacked, they are tabs in a 3 / 9 sticky rail and may be submitted in any order (see the tab layout convention).
- Validation: red borders + a `Please complete: …` summary above the action bar.
- Submit → **centred confirm modal** naming the nominee and warning it can't be edited → spinner → `saveSubmission()` → **straight back to the dashboard**.

**`NominationModule.tsx`** owns the `spotlight-nominate` route: form while nothing is submitted, recap once anything is, `forceForm` when a partially-done manager clicks the recap's outstanding Submit, and a no-campaign empty state.

### 🔧 Design corrections from your review (all applied)
1. **Everyone starts un-submitted.** The preview seed is now `SEED_A_SUBMITTED_NOMINATION = false`.
2. **`Submit Nomination` means submit, full stop.** Dropped the "Continue Nominating" label variant; the CTA is `Submit Nomination` while anything is outstanding and `View Nomination` once everything is in.
3. **Breadcrumb** — I'd wrongly used the *admin* pattern. Both nominator pages now use the Employee/Manager one, extracted to **`SpotlightBreadcrumb.tsx`** so they can't drift apart.
4. **Form runs full width** — removed the 860px cap.
5. **All action buttons are theme indigo `#6366F1`** — the solid violet was off-theme.
6. **Selected nominee shows picture, name, role, email only** — the Employee Code / Email cells are gone (department dropped too; one word to add back).
7. **Confirm modal is fully centre-aligned**, and no longer prints the employee code.
8. **Submit navigates straight to the dashboard** — no stop at the recap, which is now reached deliberately via `View Nomination`. The module's toast was deleted along with it (it lived on a screen you no longer pass through).

---

## ✅ RULES CONFIRMED BY YOU — settled, don't re-ask
1. **Self-nomination: NOT allowed** for either role. Enforced in `nomineeCandidatesFor()`.
2. **Peer Appreciation scope = anyone in CIDC.** Employees may pick any person in the company (`MANAGERS + EMPLOYEES`) minus themselves. Managers stay restricted to `MY_TEAM` for Rising Star / Outstanding.
3. **Submit is submit-only.** One nomination per award per month, **no editing after submit**. No "edit" or "continue" affordance anywhere.
4. **Everyone starts un-submitted** — `OPEN` is the correct first-run state; don't ship a seeded submission.
5. **After the LAST submit → dashboard**, not the recap. Superseded in part 2026-09-07: submitting a non-final award keeps you on the form page and drops selection to the next open award. Only the final submission leaves for the dashboard.

---

## ✅ FULL DONE LIST

### Phase 1 — Menu & relocation
- **Step 1** — Admin sidebar menu **`Spotlight`** (Sparkles icon) with 3 children: Create Announcement · Response Forms · Nomination Templates. (`Sidebar.tsx`)
- **Step 2** — Moved Announcements under Spotlight as **Create Announcement**; removed from System Settings. (`AdminDashboard.tsx`)

### Phase 2 — Nomination Templates
- **Step 3** — Templates list = themed card gallery, search + audience filter, Edit/View/Duplicate/Delete, create-new tile.
- **Step 4** — Template Builder = two-panel workspace (details + questions editor, 5 field types, reorder/required/dropdown options) + live preview. Save upserts + toast.
- Files: `nominationTemplatesData.ts`, `NominationTemplatesPage.tsx`, `NominationTemplatesModule.tsx`, `NominationTemplateBuilderPage.tsx`.

### Phase 3 — Response Forms
- **Step 5** — Campaigns list · **Step 6** — Send wizard · **Step 7** — Campaign detail · **Step 8** — response accordion (no separate page).
- Files: `responseFormsData.ts`, `ResponseFormsPage.tsx`, `SendNominationFormPage.tsx`, `CampaignDetailPage.tsx`, `ResponseFormsModule.tsx`.

### Phase 4 — Nominator side
- **Step 9** — Dashboard alert card · **Step 10** — Nomination form · **Step 11** — My Nomination recap.
- Files: `src/pages/spotlight/` → `nominationInboxData.ts`, `NominationAlertCard.tsx`, `NominationFormPage.tsx`, `MyNominationPage.tsx`, `NominationModule.tsx`, `SpotlightBreadcrumb.tsx`.
- Touched: `DashboardPage.tsx`, `EmployeeDashboard.tsx`, `ManagerDashboard.tsx`.

### Phase 5 — Wrap
- **Step 12** — Production build (`npm run build`) exercised and clean · full visual pass across
  every Admin, Employee and Manager screen · three defects found and fixed (future-dated
  responses, recap nominee block, stale picker copy). See the 2026-09-07 log above.

**Prototype note:** mock data only, no backend (consistent with the rest of the app).

---


### 🎛️ Template builder — Audience is now MULTI-SELECT, and both fields got new UI
HR needs to be able to widen a template to a second group (a manager getting Peer Appreciation
access, for instance), so the two segmented tab controls on Create/Edit Template are gone.

**This was a data-model change, not just UI** — a multi-select that could only hold one value
would have been fake:
- `NominationTemplate.audience: Audience` → **`audiences: Audience[]`**
- `CampaignRound.audience: Audience` → **`audiences: Audience[]`** (copied from the template when
  the round is sent, so an existing round keeps whatever it was sent with)
- New helpers: `AUDIENCE_ORDER`, `audienceLabel(audiences)` → "Managers & Employees",
  `STATUS_ORDER` (`nominationTemplatesData.ts`), and `audienceSize(audiences)` summing
  `AUDIENCE_SIZE` (`responseFormsData.ts`). `poolFor(round)` now returns the **union** of pools.
- Matching switched from `=== audience` to `audiences.includes(audience)` in all three places in
  `nominationInboxData.ts`, plus the templates-list filter.
- **New `AudienceChips.tsx`** renders one tinted chip per audience and is now shared by the
  templates gallery, Response Forms, Campaign Detail and both spots in the Send wizard — the same
  chip logic had been copy-pasted in five places.
**The two fields (`NominationTemplateBuilderPage.tsx`)** — first built as full option cards with
icons, head-counts and descriptions; **you rejected that as far too heavy for two simple fields**,
so the shipped version is deliberately minimal:
- **Both fields sit on ONE row** (`1fr 1fr` grid). The whole block is **57px tall** — the option-card
  version was around 230px.
- Each is a set of **small rounded badge toggles** (`height 32, borderRadius 999`) via one shared
  `Pill`: white with a grey border when off, indigo-tinted with an indigo border and a small tick
  when on. No icons, no head-counts, no descriptions.
- **Audience takes any number, status exactly one** — same control for both, because the field
  label already says which is which and a tick reads correctly either way.
- Validation stays: a small red `pick one` appears beside the Audience label while empty, and
  **Save is disabled**.
- `Segmented` and the interim `OptionCard` were both deleted.
- The live preview updates to `Nominated by Managers & Employees`.
- The live preview updates to `Nominated by Managers & Employees`.

Verified: ticking both gives `2 selected · 55 people` and the preview label; unticking both
disables Save; saving shows **two chips** on the template card. Send wizard maths confirmed on a
temporarily-seeded both-audience template — "Goes to 55 managers & employees" and "55 recipients"
(seed reverted afterwards). Regression swept: employee and manager dashboards, forms, and both
history lists still resolve their rounds; Response Forms, Campaign Detail and the pending strip
("3 managers haven't responded yet") all render. `tsc -b` and `npm run build` clean, zero console
errors.

**Known prototype gap (pre-existing, not introduced here):** `NominationTemplatesModule` keeps its
own `useState` copy of `SEED_TEMPLATES` while `ResponseFormsModule` reads `SEED_TEMPLATES`
directly, so a template edited in the builder is **not** seen by the Send wizard until reload.
Worth unifying if templates ever need to round-trip.

---

## ⏭️ NEXT SESSION — nothing outstanding

Both the original 12-step feature and the follow-on Reward Nominations ask are complete:
menu (Quick Access drawer) → list page → view page, wired and verified for **both** the
Employee and Manager logins. `tsc -b` and `npm run build` clean as of 2026-09-07.

If you want to keep going, the open candidates are:
- The **winner→poster handoff** below — the one thing consciously deferred from v1.
- **Past-month history is mock and in-memory.** `SEED_HISTORY` in `nominationInboxData.ts` writes
  closed-month submissions into a module-level `Map`, so everything resets on page reload and the
  seed block will need deleting once a backend exists.
- **Admin has no equivalent history view.** Admins see per-campaign responses in Campaign Detail,
  not a per-person record. Nobody has asked for it, but it is the obvious gap.
- Build weight, if this ever gets a deployment target: compress the reward PNGs (~51 MB) first,
  then consider code-splitting the 3.3 MB bundle.

**Deliberately out of scope for v1:** the winner→poster handoff (prefilling Create Announcement
from a winning response). Nice-to-have later.

## 🎨 UI conventions locked in
- **Every action button is the app theme indigo `#6366F1`** (hover `#5B5FDE`; tinted `rgba(99,102,241,0.12)` → `0.20`) — not navy, and **not the feature accent**. Spotlight violet `#7C3AED` is an *identity* colour only: award strips, the alert-card banner, the "What happens next" trophy. Nothing clickable is violet. (Deliberate exception: the dashboard alert cards tint their CTA to their own accent, because all three stacked alerts do that — appraisal indigo, R&R violet, offboarding amber.)
- **A template's audience is a LIST (`audiences: Audience[]`), not a single value** — Managers,
  Employees, or both. Never reintroduce a single-audience field or a segmented tab for it. Render
  it with the shared **`AudienceChips`** (one tinted chip per audience) rather than hand-rolling
  the chip again; use `audienceLabel()` for prose and `audienceSize()` for head-counts. In the
  builder, **Audience and Status are small rounded badge toggles (`Pill`) sharing one row** — 32px,
  fully rounded, indigo-tinted with a tick when on. Keep them minimal: no icons, no head-counts, no
  descriptions, no option cards, no segmented tabs. Audience blocks Save while empty. Set
  2026-09-07 at HR's request; a heavier option-card version was built first and explicitly rejected.
- **Two different breadcrumbs exist — use the right one.** Admin pages: 36px boxed arrow, 12.5px crumbs, no leading `/`. **Employee / Manager pages: 30px boxed arrow, a `/` immediately after it, 13px crumbs, current page bold** — that's `SpotlightBreadcrumb.tsx`, matching `KPIReviewDetailsPage` and the asset detail pages.
- Form pages run **full width** of the content area — no `maxWidth` cap.
- **The Submit Nomination form is a 3 / 9 sticky TAB layout — do not go back to stacked cards,
  to a full-height award-tinted panel, or to locking the second award.** Two separate cards with
  `gap-5` and `alignItems: 'start'`. Left 3 is its own **white, sticky** card (`top: 0`): a
  `YOUR AWARDS` + `n/n` header, then one tab per award (tinted award icon, name, status) —
  selected is an indigo-tinted row with an indigo left bar and `Filling in now`, submitted is a
  green check + `Submitted` and is not clickable, everything else is `Not started` and freely
  clickable in **any order**. Right 9 renders only the selected award's form: compact heading
  (3px award-colour accent bar + name + description), fields, validation summary, footer. No
  step chip in the heading — the rail's counter is the only progress indicator. Set 2026-09-07.
- **No drop shadows on cards** — border `#E8EAF2` only. (The picker dropdown and the confirm modal are the two deliberate exceptions — they float above the page.)
- Toolbars/filters belong **inside** their table card, not floating as a separate card above it.
- No user avatars in the Campaign detail table — **name + employee code only**. On the nominator side a selected person shows **picture, name, role, email**.
- **Dashboard alert accents are one-per-feature and must not collide:** Appraisal = indigo `#6366F1` · **Spotlight R&R = violet `#7C3AED`** · Offboarding = amber `#F59E0B`.
- Detail pages = breadcrumb + **8/4 grid with a sticky right rail**.
- One-way actions get a **confirm modal + spinner**, never a bare button.

---

## 🔑 Key rules to remember (don't lose these)
- **Rising Star + Outstanding → Managers only** (each manager nominates ONE team member, from their own team).
- **Peer Appreciation → Employees only**, nominee can be anyone in CIDC.
- **Single nominee per submission. NO leaderboard / highest-nomination** — Admin just collects; HR exports; a judging crew picks winners manually.
- Response Forms = **monthly campaign** model (one Month/Year holds multiple award "rounds"; audience fixed by the template, never chosen at send time).
- Nominator side = **dashboard alert card → form page → dashboard** (recap sits behind `View Nomination`; no permanent sidebar item).

---

## 🛠 How to run & verify
- `npm run dev` — note the port it prints; 5173–5178 and 5190 have all been used, so **close old server tabs** or you'll be looking at stale UI. *(A dev server was left running on 5190 today — kill it before starting a fresh one.)*
- Login: **Admin** tab → any email/password → *Sign in as Admin* → sidebar **Spotlight**. For the nominator side, sign in as **Employee** or **Manager** and use the dashboard card.
- Playwright is a devDependency for screenshots (`npx playwright install chromium` if needed).
- **Submissions live in memory only** — they reset on page reload. Expected prototype behaviour.
- To jump straight to a submitted state without filling the form, set `SEED_A_SUBMITTED_NOMINATION = true` at the bottom of `nominationInboxData.ts` (seeds the Employee's Peer Appreciation; add a `saveSubmission` for `r1`/`r2` for the Manager). **Set it back to `false` afterwards** — un-submitted is the correct default. Delete the block when the prototype no longer needs it.

---

*Route ids: `announcements` (Create Announcement) · `response-forms` · `nomination-templates` · `spotlight-nominate` (nominator — form + recap, both live).*
