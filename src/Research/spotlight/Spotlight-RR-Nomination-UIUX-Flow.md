# Spotlight — Rewards & Recognition Nomination Flow (UI/UX Spec)

> **Status:** Design spec — approved requirement, not yet built.
> **Scope of THIS document:** UI/UX only (screens, menus, steps, layout). Not functional/data wiring.
> **Prototype reality:** Mock data, no shared backend, state-based SPA (consistent with the rest of pulse_ai_design). The nominator side and the Admin side simulate the shared state.
> **Date:** 2026-09-01

---

## 1. Why this exists (the gap we're closing)

We already built the **publishing** side of Rewards & Recognition (Admin creates a winner poster → it shows in the header **"Explore the Spotlight"** carousel). What was never designed is the **winner-selection process that happens BEFORE the poster**:

> Every month the Admin must send a **nomination form** to Managers/Employees, collect their nominations, and hand the collected list to HR / the final judging crew — who pick the actual winners. Only then is the winner poster created and published.

This spec adds that missing front half and reorganizes the menu.

### The real-world rule (from HR, confirmed)
- **Rising Star** and **Outstanding Performer** → nominated by **Managers only**. Each of the ~15 managers picks **one** person from their team.
- **Peer Appreciation** → nominated by **Employees only**.
- There is **NO "highest nomination" auto-winner** logic. Admin just collects all responses; HR exports the nomination list and the final judging crew selects the winners manually. → *So no leaderboard / vote-counting UI is needed for now.*

---

## 2. Menu restructure

### Before (today)
```
System Settings
  └─ Announcements   ← compose page: Announcement · Rewards & Recognition · Poster tabs
```

### After (new)
Promote to a **new top-level Admin menu** called **`Spotlight`** with 3 submenus:

```
Spotlight                         ← NEW parent menu
  ├─ Create Announcement          ← the EXISTING compose page, relocated (UI unchanged)
  ├─ Response Forms               ← NEW: send nomination forms + view responses
  └─ Nomination Templates         ← NEW: create/manage the form templates
```

- The old **System Settings → Announcements** entry is **removed** (its screen becomes "Create Announcement" under Spotlight, same UI).
- Parent menu name **"Spotlight"** chosen to match the employee-facing *"Explore the Spotlight"* viewer.

---

## 3. The monthly campaign model (mental model for the UI)

Everything on the Response Forms side is organized **by month**:

- A **Monthly Campaign** = one Month + Year (e.g., "August 2026").
- Inside a campaign, Admin adds one or more **Nomination Rounds**, each = one **template (award type)**.
- The **audience is fixed by the template**, not chosen at send-time:
  - Rising Star → Managers · Outstanding Performer → Managers · Peer Appreciation → Employees.
- So a typical August campaign = **3 rounds** (Rising Star + Outstanding to Managers, Peer Appreciation to Employees), sent together for one month.

---

## 4. ADMIN — Submenu 1: `Create Announcement`

**No new design.** This is the current `AdminAnnouncementsPage` compose experience, moved under Spotlight unchanged:
- 3 tabs: **Announcement · Rewards & Recognition · Poster**.
- Same title/subject/message/audience/priority/schedule/attachments, and the reward/poster image upload + visibility-days behavior.
- This is still where the Admin publishes the final **winner poster** to Spotlight after HR selects winners.

*(Only change: its route/menu location moves from System Settings to Spotlight.)*

---

## 5. ADMIN — Submenu 2: `Response Forms`

This submenu does two jobs: **send** nomination forms, and **view** the responses that come back. Three screens.

### 5A. Campaigns list (landing)
- **Header:** title "Response Forms" + subtitle "Send monthly nomination forms and review submissions."
- **Primary button (top-right):** **`+ Send Nomination Form`** → opens the Send flow (5B).
- **Toolbar:** search + a **Year / Month filter** (to separate "previous months" from "current month").
- **List (one row/card per Monthly Campaign):**
  | Month | Award rounds (chips: Rising Star · Outstanding · Peer Appreciation) | Audience summary (Managers / Employees) | Responses (e.g. "26 total") | Status (Active / Closed) | Open |
  - **Current month** campaign highlighted / sorted to top.
  - Each round chip can show a mini progress like `12/15` (managers responded).
- Row → opens Campaign detail (5C).

### 5B. Send Nomination Form (flow — modal or slide-over wizard)
Short guided flow, 2 steps:
1. **Select period** — Month dropdown + Year dropdown (e.g., August / 2026). Guard against duplicate month if one already exists (offer to add rounds to it instead).
2. **Add award rounds** — Admin adds one or more templates:
   - "Add Award" → pick from existing **Nomination Templates** (Rising Star / Outstanding / Peer Appreciation).
   - When a template is picked, its **audience auto-shows** as a read-only chip (Managers or Employees) — Admin does not choose audience.
   - Optional **deadline** date per campaign.
   - Rows listed with a remove (×).
   - **Review strip:** "Sending 3 forms → Rising Star (Managers), Outstanding (Managers), Peer Appreciation (Employees)."
3. **Send** → confirm modal → success flash → lands back on Campaigns list with the new campaign at top.
   - *(Mock effect: this is what "drops" the alert card onto Manager/Employee dashboards — see §7.)*

### 5C. Campaign detail
- **Breadcrumb:** Response Forms / August 2026.
- **Header:** month + status pill + deadline + **`Export`** button (mock — represents the Excel HR shares with the judging crew).
- **Round sections / tabs** — one per award type in this campaign. Each shows:
  - Award name + audience + response progress (e.g., "Rising Star · Managers · 12 of 15 responded").
  - **Responses table:** Nominator (name + role) · Nominee (name + code) · Reason (truncated) · Submitted date · **View**.
- **No leaderboard / vote tally** (per HR — not needed).
- Row **View** → Response detail (5D).

### 5D. Response detail
Single submission, read-only:
- Award type + month (context header).
- **Nominated by:** nominator name, role, department.
- **Nominee card:** auto-filled **name, email, role, employee code** (+ avatar).
- **Reason for nomination** (full text).
- Any extra template questions + their answers.
- Submitted date/time.

---

## 6. ADMIN — Submenu 3: `Nomination Templates`

Where the award forms are authored. Two screens.

### 6A. Templates list
- **Header** + **`+ Create Template`** button.
- **Cards / rows** for each template:
  | Template name | Audience (Managers / Employees) | # of questions | Last edited | Edit · Duplicate · Delete |
  - Seed 3: **Rising Star Nomination** (Managers), **Outstanding Performer** (Managers), **Peer Appreciation** (Employees).

### 6B. Template builder (create/edit)
- **Top fields:** Template name · Short description · **Audience** selector (Managers / Employees) — this is what drives who receives it in the Send flow.
- **Questions/Fields list** — add / edit / delete / reorder. Each field has: **label**, **type**, **required** toggle.
- **Supported field types (keep it lean but real):**
  - **Employee Picker** (the key one) — nominator searches & selects one person; auto-fills **name, email, role, employee code**. Single-select only.
  - **Long text** (e.g., "Reason for nomination").
  - **Short text**.
  - **Dropdown / single choice**.
  - **Rating** (stars) — optional.
- A **default/starter template** = Employee Picker + Reason (Long text), so a new template is usable immediately.
- **Live preview** panel (right side) showing how the form will look to the nominator.
- Save → back to Templates list.

---

## 7. NOMINATOR SIDE — Manager & Employee (dashboard)

Per decision: **no permanent sidebar item.** Instead a **dashboard alert card** → opens a dedicated form page.

### 7A. Dashboard alert / notification card
- Appears on the Employee/Manager **dashboard** when a campaign is active for them.
- Copy example: *"🏆 August Rewards & Recognition — the nomination form is now open. Submit your nomination before Aug 31."*
- **CTA:** `Submit Nomination` → opens the Nomination Form page (7B).
- Card reflects state: **Open** → **Submitted ✓** (after they finish).
- **Manager** sees the awards meant for managers (Rising Star + Outstanding); **Employee** sees Peer Appreciation. Only the relevant award(s) appear.

### 7B. Nomination Form page (new full page)
- **Header:** month + "Rewards & Recognition Nomination".
- If the user has **multiple awards** to submit (managers = Rising Star + Outstanding), show them as **stacked sections or a stepper** — one nominee + reason per award.
- **Per award block:**
  - Award name + short description (read-only, from template).
  - **Employee Picker** — search a colleague (managers: their own team for Rising Star/Outstanding) → select **one** → the **nominee card auto-fills name, email, role, employee code**.
  - **Reason** textarea (+ any extra configured questions).
- **Rules baked into UI:** single nominee per award; (assume) no self-nomination; one submission per award per month.
- **Submit** → confirmation → success screen → return to dashboard with the card now showing **Submitted ✓** (read-only recap of what they nominated).

---

## 8. Design system / conventions (reuse existing)

- DM Sans; navy `#1C2035`; indigo `#6366F1`/`#5B5FDE`; green `#0EA86A`; amber `#D97706`; red `#E84855`; slate `#8B90A7`; borders `#E8EAF2`; surface `#F7F8FC`.
- Reuse house patterns already in the app: white cards, breadcrumb with boxed back-arrow, list = search + dropdown filter + x-scroll table, detail = 8/4 grid + sticky right panel, confirm modal + spinner + success flash, `randomuser.me` avatars.
- Reuse existing components where possible: `ImageUploadCard`, `ImageCarouselModal`, the Announcements compose card styling, the Employee Picker pattern from the Announcements "Individual" audience search.

---

## 9. Screen inventory (build checklist)

**Admin — Spotlight menu:**
1. Sidebar: add `Spotlight` parent + 3 children; remove `Announcements` from System Settings.
2. `Create Announcement` — relocate existing page (no UI change).
3. `Response Forms` — Campaigns list (5A).
4. Send Nomination Form flow (5B).
5. Campaign detail with per-award response tables + Export (5C).
6. Response detail (5D).
7. `Nomination Templates` — list (6A).
8. Template builder with field types + live preview (6B).

**Nominator — Manager & Employee:**
9. Dashboard alert card (7A).
10. Nomination Form page — multi-award for managers, single for employees (7B).
11. Submitted / read-only recap state.

---

## 10. Assumptions & things to confirm during build

- **Self-nomination:** assumed **not allowed** (confirm).
- **One submission per award per month** per nominator (confirm).
- **Export** on Campaign detail is a **mock** button (represents HR's Excel).
- Managers nominate **only their own team** for Rising Star / Outstanding; Peer Appreciation nominee scope for employees = **anyone in org** (confirm).
- Winner→poster handoff (prefilling Create Announcement from a chosen response) is **out of scope for v1** — nice-to-have later.
```
