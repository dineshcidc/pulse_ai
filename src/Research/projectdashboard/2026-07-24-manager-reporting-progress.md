# Project Reporting — Progress & Context (as of 2026-07-24)

> **READ THIS FIRST when resuming.** This is the working memory for the Pulse.AI *Project Reporting* module.
> It captures the purpose, every decision, what's built, what's pending, and the UI conventions so we can continue instantly.

---

## 0. The big picture (why this exists)

Today PMs keep project updates in **scattered Excel files**; someone manually collects them to build portfolio reports. This module kills that:

> **PM enters structured project data once → on submit it becomes the single source of truth → the Portfolio Dashboard, KPIs & PDF reports read from it automatically.** No re-keying, no Excel collection.

Three-part system (from `Projectdasboard.md`, the BA brief):
```
ADMIN (config once)        PROJECT MANAGER (data entry)     EXECUTIVE (read-only)
Build reporting templates  Open assigned project            Portfolio Dashboard
Assign template+frequency  Fill Weekly/Bi-weekly/Monthly    → Project Detail
to projects, pick PM       Save draft / Submit              → Generate PDF
```

**Scope split the user set (only 3 works, Manager first):**
1. **Manager (Project Manager) side** — fill & submit reports ← *DONE (this doc)*
2. **Admin side** — Template Creation (define sections/fields, assign) ← *NOT STARTED*
3. **Portfolio Dashboard + Project Detail** (dummy data, Admin acts as Executive) ← *LATER*

**Today's focus was Manager side ONLY.** It is essentially a **Figma-stage visual mockup** with realistic **dummy data** — frontend only, no backend. The dev team wires real data later.

---

## 1. Current status

| Area | Status |
|---|---|
| Manager – Reporting Dashboard | ✅ Done |
| Manager – My Report Projects (list + detail + timeline) | ✅ Done |
| Manager – Report Form (Weekly / Bi-weekly / Monthly) | ✅ Done |
| Manager – Report View (read-only) | ✅ Done |
| **User is sending Manager side to the BA for review** | 🔎 In review |
| Admin – Template Creation | ⬜ Not started (next big piece) |
| Portfolio Dashboard + Project Detail | ⬜ Later |

---

## 2. Where the code lives

All new work is under **`src/pages/manager/reporting/`**:

| File | Role |
|---|---|
| `reportingData.ts` | **Shared mock data + logic.** Projects (6), each project's team, notifications, submission-trend, and the **auto due-date engine** (`generateTimeline`). Single source of truth for all pages. |
| `reportTemplate.ts` | **The report template schema.** All sections + fields defined once, each section tagged with the frequencies it belongs to. Rendering is 100% schema-driven. |
| `ReportingOverviewPage.tsx` | Menu 1 — **Reporting Dashboard**. |
| `MyReportProjectsPage.tsx` | Menu 2 — **My Report Projects** (list + detail + timeline; opens Form or View). |
| `ReportFormPage.tsx` | The **fill form** (stepper). Handles all 3 frequencies via the schema. |
| `ReportViewPage.tsx` | The **read-only view** (same stepper, all steps completed). |
| `ReportingPlaceholder.tsx` | ⚠️ **ORPHAN / dead code** — no longer imported anywhere. Safe to delete. |

Wiring:
- **Sidebar** (`src/components/layout/Sidebar.tsx`): manager-only `Project Reporting` menu (icon `ClipboardList`) with children **Reporting Dashboard** (`reporting-overview`) and **My Report Projects** (`my-report-projects`).
- **`src/pages/manager/ManagerDashboard.tsx`** routes those two ids to the pages.
- The Report Form & View are **not** sidebar routes — they open as detail views inside `MyReportProjectsPage` via internal state (`openReport = { period, mode: 'edit' | 'view' }`), per the app's early-`return`/`onBack` convention.

---

## 3. Completed pages — detail

### 3.1 Reporting Dashboard (`ReportingOverviewPage.tsx`)
- Header: title + "Welcome back, **John Doe**" + right side has a light-blue **Current period** chip (`Week 30 · Jul 21–27, 2026`) and a navy **Go to My Projects** button (both 38px tall).
- **4 compact KPI cards:** My Projects (6) · Pending (3) · Submitted (2) · Overdue (1).
- **Overdue alert strip** (only renders when overdue > 0) — names the overdue project + "Fill now" that filters the table.
- **Upcoming Reporting Deadlines** — full-width table, **filter-by-project** dropdown (lists only the pending projects shown), columns: Project · Frequency · Next Due (date + due-chip **stacked**) · Status · Action. Row hover; light "Fill Report"/"Continue" buttons. **No client column.**
- Bottom **6/6 split:** left = **Recent Notifications** (4 items, list); right = **Report Submission Trend** bar chart (last 8 weeks, single indigo series, hover tooltip).
- Removed earlier: On-time Compliance card; the separate "Pending Reports" menu (folded into the deadlines table).

### 3.2 My Report Projects (`MyReportProjectsPage.tsx`)
- **Two-card 3:9 layout with a gap** (not one connected card). **Left card is sticky + fit-content height.**
- **Left (3):** heading "My Projects" + the **same 4 projects** as the dashboard (Apollo, Helios, Nova, Atlas — the non-submitted ones). First selected by default.
- **Right (9):** Title → Description → Tech-stack chips (**light-gray** bg, not blue) → **horizontal divider** → row of **cadence tabs (left)** + **duration chip + calendar-range icon button (right)**, all 38px.
  - Cadence tabs = **Weekly / Bi-weekly / Monthly**; only the frequencies the "Admin configured" for that project are enabled, others are **locked (🔒, greyed)**. Selected tab = **light-indigo** bg. Switching project auto-selects its first enabled cadence.
  - **Timeline** for the active tab: **Current reporting period** card (prominent, Fill Report / Continue Draft) → **Upcoming** rows → **Previous Reports** rows.
  - **Previous Reports rows:** Submitted → **View** + **Download** (icon) buttons; a **missed** past period → red **Fill now**.
- **View → opens `ReportViewPage` (read-only)**; Fill/Continue/Fill-now → `ReportFormPage` (edit).

### 3.3 Report Form (`ReportFormPage.tsx`) — the heart
- Header: **grey** back arrow · project name · cadence+period badge · description · **Save as Draft** + **Submit Report** (theme **indigo/blue**, both 42px, same size).
- **4:8 layout:** left **stepper** (progress bar, per-section completion checks, sticky, gaps between steps; **first step always shows Completed**), right = active section's fields + **Prev / Next Section** footer.
- **Field kinds** (all in the schema): `segmented` (colored pills), `percent` (slider + %), `number` (with unit), `text`, `textarea`, `bullets` (add-one-by-one list), `list` (**accordion** rows with add/delete — used by Risks & Milestones & Change Requests), `teamcount` (read-only full-width badge, count on the right).
- **Submit flow:** button shows **spinner "Submitting…"** → after ~1.6s a **confirmation popup** ("Report Submitted") → **"Back to My Report Projects"** navigates to the list.

### 3.4 Report View (`ReportViewPage.tsx`)
- **Same 4:8 stepper** as the form, but **all steps are Completed** (green checks, green rail, full green progress bar). Read-only field rendering (pills, bars, bullets, item cards).
- Header has green **"Submitted …"** chip + **Download PDF** button. Prev/Next nav, no Save/Submit.
- Fields populated with **dummy data** via `buildDummyReport(project)` (adapts to the project — e.g. progress, team size).

---

## 4. The report template schema (`reportTemplate.ts`)

Each section is tagged with `frequencies`. Rendering filters by the open cadence, so extending a cadence = editing one array.

**Section → frequency matrix (FINAL):**

| Section | Weekly | Bi-weekly | Monthly |
|---|:--:|:--:|:--:|
| Project Overview (status, health, progress %, summary) | ✅ | ✅ | ✅ |
| Task Progress (counts + highlights *bullets*) | ✅ | ✅ | ✅ |
| Resource Information (team size, utilization %, team changes *bullets*) | — | ✅ | ✅ |
| Risks & Issues (*accordion*: title, severity, desc, mitigation) | ✅ | ✅ | ✅ |
| Milestones (*accordion*: name, target date, status) | ✅ | ✅ | ✅ |
| Scope & Change Requests (*accordion* CRs + scope notes) | — | — | ✅ |
| Leave Status (team-count badge + Planned/Unplanned/Comp-Off counts + remarks) | ✅ | ✅ | ✅ |
| Client Updates (feedback, key meetings *bullets*, escalations) | — | ✅ | ✅ |
| Additional Notes (achievements, challenges, next-period plan*, remarks) | ✅ | ✅ | ✅ |
| **Total sections** | **6** | **8** | **9** |

- **Billing & Financials was designed then REMOVED** at user's request — do **not** re-add it.
- **Leave Status was redesigned twice.** FINAL = simple: full-width **Overall Team Members** badge + 3 number inputs (Planned / Unplanned / Comp-Off, in days) + Remarks textarea. **No per-employee roster, no "No Leave" option** (both earlier versions were rejected).
- `*` = required fields: Overview (status, health, progress, summary) and Notes (next-period plan).

---

## 5. Mock data facts (`reportingData.ts`) — keep consistent

- **Logged-in PM: `John Doe`.** (Changed from an earlier "Vikram Rao".)
- **Fixed "today" = `2026-07-24` (a Friday).** All due-dates computed from this.
- **6 projects**, each with client, description, duration, tech stack, `frequencies[]`, and a **team** array. The 4 shown to the PM (non-submitted): **Apollo CRM Revamp** (all 3 cadences), **Helios Analytics** (Weekly+Bi-weekly), **Nova E-commerce** (Weekly only), **Atlas ERP Migration** (Monthly only). Orion & Zephyr are Submitted (not in the PM's working list).
- **Auto due-date rules** (`generateTimeline`, verified correct):
  - **Weekly** → every **Friday**.
  - **Bi-weekly** → every **other Friday** (14-day).
  - **Monthly** → **2 days before month-end** (e.g. July → Jul 29).
  - Statuses auto-assigned: past = Submitted (or Overdue if `reportSeed.missedLast`), nearest ≥ today = Due (or Draft if `reportSeed.draftCurrent`), future = Upcoming.

---

## 6. UI conventions (match these exactly)

- Font `DM Sans`; heavy inline `style={{}}`. Per-file palette const `C`.
- Colors: navy `#1C2035`, ink `#2A2F45`, muted `#8B90A7`, faint `#AEB2C4`, border `#E8EAF2`, line `#EEF0F6`, wash `#F6F7FB`, **accent indigo `#6366F1`**.
- Status colors: green `#16A34A` (submitted/healthy/on-track), amber `#D97706` (pending/draft/at-risk), red `#E11D48` (overdue/critical), blue `#2563EB`.
- **Primary CTA = indigo** (submit/download). Light buttons = wash bg + border. Standard control height **38–42px**, radius 10–12, cards radius 16 (`rounded-2xl`).
- Sidebar itself is navy with **gold** (`#F2D000`) active — that's the existing app chrome, don't change it.
- Segmented pills: selected = `${color}18` bg + colored border/text; unselected = wash + muted.

---

## 7. How to verify (my workflow)

- Typecheck: `npx tsc --noEmit` (must be clean).
- Visual check via Playwright (chromium already installed):
  1. `npx vite build && npx vite preview --port 4173 --strictPort` (background).
  2. Login: click role **"Project Manager"**, fill email + password (inputs are `required`, any value), click `button[type=submit]` (1.8s delay).
  3. Navigate: click sidebar text **"Project Reporting"** → **"My Report Projects"**.
  4. Screenshot to the scratchpad; clean up temp `_shot.cjs` + kill preview after.
- Scratchpad dir for temp files: `C:\Users\CIDC176\AppData\Local\Temp\claude\...\scratchpad`.

---

## 8. Pending / next steps

1. **(Optional cleanup)** delete orphan `ReportingPlaceholder.tsx`.
2. **Admin side — Template Creation** (Work 2). Two new **Admin** sidebar menus: `Template Creation` (sub-menus: Reporting Dashboard, Reporting Templates, Project Assignment, Report Monitoring) and `Portfolio Dashboard` (later). The **Template Builder** should configure exactly the sections/fields that already exist in `reportTemplate.ts` — reuse that schema as the contract.
3. **Portfolio Dashboard + Project Detail** (Work 3) — read-only executive analytics fed by submitted reports (dummy data for now).
4. `Download PDF` buttons are **visual stubs** (commented) — dev team wires real export.

---

## 9. One-line resume

> Manager-side Project Reporting is **fully built and in BA review**. The template is **schema-driven** (`reportTemplate.ts`) across Weekly(6)/Bi-weekly(8)/Monthly(9) sections; all mock data is in `reportingData.ts` (PM = John Doe, today = Fri 2026-07-24, auto due-dates). **Next up: Admin – Template Creation.**
