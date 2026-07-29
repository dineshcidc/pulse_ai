# Pulse AI — Project Reporting Module
## Single Source of Truth (Finalized UI/UX Flow — 2026-07-29)

> This document **supersedes** all earlier planning notes for this module.
> The BA revised the reporting flow; over the last two days both the **Manager-side Project
> Reporting** flow and the **Admin-side Template Creation** flow were redesigned and approved.
> This file describes the **current, approved UI/UX** — page by page — and what data will feed
> the next phase (Portfolio Dashboard + Project Detail View).

---

## 0. The One-Line Idea

> **Admin decides *which cadences* each project reports on → the Project Manager *fills* a
> simple, standard report (+ effort data) → the Executive Dashboard *reads* it.**

The dashboard never takes manual input. Every metric is born from a report a Manager submits,
on a schedule an Admin assigns.

```
   ADMIN                         PROJECT MANAGER                 EXECUTIVE (next phase)
   ─────                         ───────────────                 ──────────────────────
   Assign reporting cadences  →  Open assigned project        →  Portfolio Dashboard
   (Weekly/Bi-weekly/Monthly)    Fill 4-card report template      (all projects, live data)
   + start date + reminders      + risk level + effort tab
   (single project or bulk)      Save draft / Submit          →  Project Detail View
   Monitor status                View / download history          + Generate report
```

### What changed from the original plan (important)

The first plan assumed the Admin would build **custom templates** with many structured sections
(Milestones, Client Updates, Billing & Utilization, etc.), and the Manager would fill long
multi-field forms via a stepper. **That is no longer the flow.** The approved design is
deliberately simpler:

| Old plan | Final (approved) |
|---|---|
| Admin builds custom templates (Template Builder, section toggles, field config) | **No custom template builder.** One standard report structure for everyone. Admin only assigns **cadences + start date + reminders**. |
| "Reporting Templates" library + "Report Monitoring" menus | **Both hidden.** Admin menu = Reporting Dashboard + Project Assignment only. |
| Manager fills 6–9 sections via a stepper | Manager fills **4 fixed notepad cards** on one page (no stepper) + a **risk level** + a **Project Efforts** tab. |
| Manager report = mostly free-text sections | Report now also has a **structured effort/utilization tab** (the real numeric backbone) alongside the 4 narrative cards. |

The word "Template" in the Admin menu now effectively means **"the standard report + its cadence
assignment,"** not a per-project custom form.

---

## 1. Modules & Purpose

| Module | Role | Purpose |
|---|---|---|
| **Manager — Project Reporting** | Project Manager | The **data-entry** side. Each PM submits a standard status report for every project/cadence they own. This is the single source of truth the dashboards read. |
| **Admin — Template Creation** | Admin | The **configuration** side. Admin decides which projects report, on which cadences, from when, with reminders — and monitors submission status org-wide. |
| **Portfolio Dashboard + Project Detail** | Executive (Admin acts as one) | *(Next phase)* Read-only analytics fed entirely by submitted reports. No manual entry. |

---

# PART A — MANAGER-SIDE: PROJECT REPORTING

## A1. Sidebar

Manager sidebar → **Project Reporting** with two menus:

1. **Reporting Dashboard**
2. **My Report Projects**

The **Fill Report** and **View Report** screens are **not** menus — they open as full-page detail
views from *My Report Projects*.

## A2. Reporting Dashboard

The PM's home for reporting — status at a glance.

- **Header:** title + "Welcome back, John Doe…" + a **Current period** chip (`Week 30 · Jul 21–27, 2026`).
- **4 KPI cards:** My Projects · Pending Reports · Submitted · Overdue.
- **Overdue alert strip** (only when overdue > 0) — names the project + a "Fill now" shortcut.
- **Upcoming Reporting Deadlines** — full-width table with **two filters: All Projects + All
  Frequencies.** Columns: Project · Frequency · Next Due (date + due-chip) · Status · Action
  (Fill Report / Continue).
- **Recent Notifications — removed** (dropped per BA; the deadlines table carries the actionable view).

## A3. My Report Projects

The working list. **3 : 9 layout**, left card sticky.

- **Left (3):** "My Projects" — the projects awaiting reports. First one selected by default.
- **Right (9):** project title → description → tech-stack chips → divider → **cadence tabs**
  (Weekly / Bi-weekly / Monthly; only the cadences the Admin configured are enabled, others
  locked 🔒) + duration chip → **timeline**: *Current reporting period* card (Fill Report /
  Continue Draft) → *Upcoming* rows → *Previous Reports* rows.
- **Previous Reports:** Submitted → **View** + **Download**; a missed past period → red **Fill now**.
- Fill / Continue → opens the **Fill Report** page; View → opens the **View Report** page.

## A4. Fill Report page — the heart of the redesign

Opened when the PM clicks **Fill Report / Continue Draft**. It opens as a **dedicated full-screen
workspace** that **hides the app sidebar and top header** for a focused reporting experience.
The layout fits the viewport — the page itself does not scroll.

**Custom top bar** (three zones):
- **Left:** back arrow · **project name** · **frequency badge** (just "Weekly" / "Bi-weekly" /
  "Monthly") · project **description** below.
- **Center:** two tabs — **Report Template** · **Project Efforts**.
- **Right:** a "Draft saved" indicator (after saving) · **Save as Draft** · **Submit**.

### Tab 1 — Report Template (the 4-card template)

One **dashed-frame panel** filling the space; inside is a **2×2 grid of four cards divided by
dashed "join" lines** — it reads as a single connected template, not four standalone cards.

| Card | Content |
|---|---|
| **Resource Allocation** | icon · title · description · notepad text area |
| **Current Tasks** | icon · title · description · notepad text area |
| **Risks & Issues** | icon · title · description · **Risk-level selector** + notepad text area |
| **Weekly Status** | icon · title (adapts: *Weekly / Bi-weekly / Monthly Status*) · description · notepad text area |

Behavior:
- **Drag & drop reorder** — each card header is a drag handle (grip icon); drag one card onto
  another to swap placement. Typing in the text area is unaffected.
- Each **notepad text area** fills its card and **scrolls internally** (the page never scrolls).
- Each card shows a live word count and a green "filled" check.
- **Risks & Issues card only:** above the text area, a label *"Select your project risk level
  based on the current project status,"* then four single-select pills — **Low** (green),
  **Medium** (amber), **High** (orange), **Critical** (red). The PM picks the level, then writes
  the details below.

> The old "Project Overview" section was **dropped** — the report is now exactly these four cards.

### Tab 2 — Project Efforts

A **manager-scoped effort/utilization report**, showing only what's relevant to a PM. **3 : 9 split:**

- **Left (3) — Report Filters:** **Date Range only.** The cadence tabs (Monthly / Weekly /
  Bi-weekly) are **locked to the report's own frequency** — only the matching one is enabled,
  the others are disabled. Below it are Month / Week / Fortnight pickers and a Generate Report
  button. *(No Project / Employee / Status / Billing filters — those stay Admin-only.)*
- **Right (9) — Employee Allocation Variance table:** per-employee rows — Billing, Skill,
  Experience, Allocation %, Allocation Period, Planned Effort, Peak Week / Weekly Capacity,
  Expected Hours, Logged, Variance, Utilization bar, and Status (Above allocation / On track /
  Under target). Paginated (10 per page). This is where the **structured, numeric** effort data lives.

### Submit

Submit → a brief "Submitting…" state → a **confirmation dialog** ("Report Submitted") → **Back to
My Report Projects**.

## A5. View Report page

Mirrors the Fill page **read-only**, so a submitted report reads exactly like the form.

- **Top bar:** back · project name · description. **No frequency / submitted badges.** Right side
  = an **Excel download** icon (icon only, green tile).
- **Tab 1 (Report Template):** the same dashed 2×2 template, cards **read-only** with the submitted
  content + a "completed" check. The **Risks & Issues** card shows the **selected risk level**
  (read-only).
- **Tab 2 (Project Efforts):** the same effort/utilization report.

## A6. Manager flow (end to end)

```
Login (Manager)
  → Project Reporting → Reporting Dashboard   (see Pending / Overdue at a glance)
  → My Report Projects → pick project → pick cadence
  → Fill Report  (full-screen workspace)
        Tab 1 Report Template: fill 4 cards + pick risk level
        Tab 2 Project Efforts: review/adjust effort & utilization
     → Save as Draft (optional) → Submit
  → later: Previous Reports → View (read-only) / Download
```

**Status lifecycle:** `Not Started → Draft → Submitted` (+ `Overdue` if the due date passes).
Colors: green = submitted, amber = draft/pending, red = overdue.

---

# PART B — ADMIN-SIDE: TEMPLATE CREATION

## B1. Sidebar

Admin sidebar → **Template Creation** with two menus:

1. **Reporting Dashboard**
2. **Project Assignment**

> **"Reporting Templates" and "Report Monitoring" menus are hidden** — the new flow has no custom
> template library, and monitoring is folded into the Reporting Dashboard.

## B2. Admin Reporting Dashboard

Org-wide reporting monitor.

- **Header:** title + description only. *(The old "Report Monitoring" button and "Current period"
  chip were removed.)*
- **4 KPI cards:** Total Projects (· N PMs) · Reports Submitted (/ total) · Pending · Overdue.
- **Overdue alert strip:** "N reports overdue …" with a **Send Reminder** button.
- **Single "Reporting Status" table** (shows **all** reports):
  - **Three filters:** All Projects · All Frequencies · All Status.
  - **Status collapsed to 3 buckets:** **Overdue** (red) · **Pending** (amber) · **Submitted** (green).
  - **Action column (center-aligned):** Submitted → **eye icon** (View); Overdue / Pending →
    **reminder icon** (Send reminder).
- **Removed:** Weekly Submission Trend chart, Reporting Status donut, Manager Compliance
  leaderboard, Recent Notifications.

## B3. Project Assignment

The list of all projects and their reporting assignment state.

- **Header** + a **Bulk Assignment** button (top-right).
- **Toolbar:** search · Status filter · Manager filter.
- **Table:** Project · Project Manager · **Reporting Frequencies** (light-grey badges listing the
  assigned cadences, e.g. `Weekly` `Bi-weekly`; or **"Not Assigned"**) · Status (Assigned /
  Not Assigned) · **Action** (**Assign** if unassigned, **Manage** if assigned).
- Assign / Manage → opens the **Assign / Manage editor**.

## B4. Assign / Manage editor

- **Breadcrumb:** back → Project Assignment → *Assign Templates* / *Manage Assignment*.
- **One white card, 3 : 9 split:**
  - **Left (3) — Project detail (sticky):** icon · **project name** · **description** ·
    **Project Manager**. Stays pinned while the right side scrolls.
  - **Right (9) — Reporting Cadences + actions:** heading + three cadence cards
    (Weekly / Bi-weekly / Monthly), each with an **enable toggle**. When enabled, a card shows:
    - **Reporting Starts On** — shown as **plain text**.
    - an auto-scheduled note ("first report due …").
    - a **Send reminders** toggle.
    - *(The old "Reporting Template" dropdown was removed — the standard template is applied
      implicitly; there is no per-project template selection anymore.)*
  - **Actions row:** cadence count + **Cancel** + primary button.
- **Assign mode:** primary button = **Publish** (enabled once at least one cadence is on).
- **Manage mode:** opens as a **read-only view** — primary button = **Update** and stays **disabled**.

## B5. Bulk Assignment — first-time onboarding

**Purpose:** on first use of the portal every project is "Not Assigned." Bulk Assignment lets the
Admin get reporting live across the whole org in one step. It's a **separate flow** (the Project
Assignment table itself is untouched).

- **Breadcrumb** + intro banner.
- **5 : 7 split:**
  - **Left (5) — Select Projects:** checkbox list with **Select all** + a live `selected / total`
    count. Each row: checkbox · project · client · PM. *(No status badge — first-time everything
    is unassigned.)*
  - **Right (7) — Reporting Frequencies (sticky):** multi-select cadence cards (Weekly /
    Bi-weekly / Monthly) + a **Reporting Starts On** date + a live **summary**
    (projects × cadences = total assignments) + **Assign Reporting** (disabled until at least one
    project **and** one frequency) + Cancel.
- **Submit** → a success dialog ("Bulk Assignment Complete") → back.

## B6. Admin flow (end to end)

```
Login (Admin)
  → Template Creation → Project Assignment
        First time (all unassigned):  Bulk Assignment → pick projects + cadences + start → Assign
        Per project:                  Assign (unassigned) or Manage (assigned) → set cadences → Publish
  → Reporting Dashboard → monitor Submitted / Pending / Overdue; Send reminders
```

---

# PART C — WHAT EACH SUBMISSION CAPTURES

Every submitted report yields this shape (the data the dashboards will read):

**Report meta**
- Project · Project Manager · **frequency** (Weekly / Bi-weekly / Monthly) · reporting **period** ·
  **due date** · **submitted date** · **status** (Not Started / Draft / Submitted / Overdue).

**Report Template tab (qualitative)**
- **Risk level** — one of Low / Medium / High / Critical.
- **Resource Allocation** notes · **Current Tasks** notes · **Risks & Issues** notes ·
  **Weekly/Bi-weekly/Monthly Status** notes.

**Project Efforts tab (quantitative — the numeric backbone)**
- Per team member: billable flag · skill · experience · **allocation %** · allocation period ·
  planned effort · **peak week vs weekly capacity** · **expected hours** · **logged hours** ·
  **variance** · **utilization %** · derived **status** (Above allocation / On track / Under target).

**Assignment config (from Admin)**
- Which cadences a project reports on · start date · reminders on/off.

---

# PART D — WHAT FEEDS THE NEXT PHASE (Portfolio Dashboard + Project Detail)

The next phase is **read-only analytics** — no manual entry. Everything below is derivable from
Part C. This is the map the dashboard design should follow.

## D1. Portfolio Dashboard (all projects — bird's-eye)

| Dashboard element | Source |
|---|---|
| KPI: Total / Active projects | project roster (assignment config) |
| KPI: Reports Submitted / Pending / Overdue, on-time rate | report **status** + **due vs submitted dates** |
| Risk distribution (Low → Critical) | **risk level** of each project's latest report |
| Utilization / billing analytics | **Project Efforts** (allocation %, logged vs expected, billable) aggregated |
| Portfolio health signal | derived: risk level + report status + utilization variance |
| Manager compliance (per-PM submitted ratio) | reports grouped by PM |
| Project portfolio table (health, risk count, utilization, next due, status) | per-project latest report + assignment config |

## D2. Project Detail View (one project — deep dive)

| Detail section | Source |
|---|---|
| Status & health over time | report **status** + **risk level** across periods |
| Current work / tasks | **Current Tasks** notes |
| Resources allocated | **Resource Allocation** notes + **Project Efforts** table |
| Risks | **risk level** + **Risks & Issues** notes |
| Effort & utilization charts | **Project Efforts** (expected vs logged, variance, peak vs capacity) |
| Report history | list of submitted reports → View / Download |
| Notifications / follow-ups | overdue flags + reminder events |

> **Design principle carried forward:** whatever the Manager fills becomes exactly what the
> dashboards display. The **4 narrative cards** give qualitative context per project; the
> **Project Efforts tab** gives the numeric backbone for utilization / billing / health charts;
> **risk level** drives risk analytics; **report status + dates** drive compliance metrics.

---

# PART E — ASSUMPTIONS & NOTES

- This is a **design mockup with realistic dummy data** — the flows and screens are final; live
  data is wired later.
- **Fixed "today" = Fri 2026-07-24** so due-date chips render deterministically.
- **Logged-in PM = John Doe.** Admin view spans **12 projects across 5 PMs**.
- **Auto due-date rules:** Weekly → every Friday · Bi-weekly → every other Friday · Monthly →
  2 days before month-end.
- **Visual-only for now (not functional):** PDF / **Excel** downloads; **Publish** and **Bulk
  "Assign Reporting"** show a confirmation but don't yet change the table; **Send Reminder** actions;
  card drag-order and risk-level are not yet persisted.
- **Manage mode is read-only** by design (Update disabled).
- **Do not re-add without a BA request:** the Admin Reporting Templates menu, Report Monitoring
  menu, the removed dashboard charts (trend / donut / compliance / notifications), the per-project
  template dropdown, the old "Project Overview" report section, or Manager Recent Notifications.

---

## One-line resume

> Manager fills a **4-card standard report + risk level + a Project Efforts (allocation) tab** in a
> **full-screen workspace**; Admin no longer builds custom templates — it just **assigns cadences**
> (per-project or bulk) and monitors status. The **Project Efforts** numbers + **risk level** +
> **report status/dates** are what will feed the Portfolio Dashboard and Project Detail View next.
