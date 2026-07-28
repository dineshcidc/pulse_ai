# Pulse AI — Project Reporting & Dashboard
## UI / UX Flow Document (Design Blueprint)

> This is the **design-planning** document. No code yet.
> It defines *what we build, in what order, and how each screen behaves* — so the UI work later is fast and consistent.

---

## 0. The One-Line Idea

> **Admin defines *what* to report → Project Manager *fills* the report → the Dashboard *shows* it.**

The Dashboard never takes manual input. Every number on it is born from a report a Manager submitted, using a template an Admin designed. That is the whole system.

```
   ADMIN                     PROJECT MANAGER              EXECUTIVE (Admin for now)
   ─────                     ───────────────              ─────────────────────────
   Build template       →    Open assigned project   →    Portfolio Dashboard
   (sections + fields)       Fill the report              (all projects, live data)
   Assign to project         Save draft / Submit             ↓ click a project
   + frequency + PM     →    View history            →    Project Detail Dashboard
   Monitor submissions                                       ↓  Generate PDF
```

---

## 1. Build Order (agreed scope)

| Priority | Work | Role | Status |
|:---:|---|---|:---:|
| **1** | Project Report experience (fill + submit + history) | **Manager** (Project Manager) | 🔴 Design now |
| **2** | Template Creation (build + assign + monitor) | **Admin** | 🔴 Design now |
| 3 | Portfolio Dashboard + Project Detail (dummy data) | Admin (Executive view) | ⚪ Later |

> **Note on the dependency:** logically Admin builds the template *first*. But for design we start with the **Manager** screen, because the Manager's report form is the clearest picture of *what data the system holds*. Once we know the fields the Manager fills, the Admin builder and the Dashboard both become obvious. So: **design Manager → then Admin → then Dashboard.**

---

# WORK 1 — MANAGER LOGIN (Project Manager)

## 1.1 Overview

The Manager logs in as the **Project Manager (PM)** of one or more projects. Their job in this module is simple and repeating:

> "For each project I own, submit a structured status report on schedule (weekly / biweekly / monthly)."

They **never** touch the dashboard directly. They fill their report; the dashboard updates itself.

## 1.2 Purpose

- Give the PM a single place to see **which reports are due, drafted, submitted, or overdue.**
- Let them fill a **guided, structured form** (not free text) so every project reports the same way.
- Keep a **history** they can revisit and download.

## 1.3 New Sidebar — Manager

Add **one new main menu** to the Manager sidebar (styling follows existing pattern: navy bg, gold active, expandable children).

> **Main menu name:** `Project Reporting`  (icon: clipboard / file-bar-chart)

| # | Sub-menu | Purpose | What's inside |
|:--:|---|---|---|
| 1 | **Reporting Dashboard** | The PM's home for reporting — status at a glance. | Compact KPI tiles: My Projects · Pending · Submitted · Overdue. Full-width **Upcoming Reporting Deadlines** table (filter by project) — this also covers the "pending" view. Recent notifications. |
| 2 | **My Report Projects** | The working list — every project assigned to me for reporting. | Table/cards of projects with: Project · Client · Frequency · Next Due ·  Report Status. **Row click → opens the Report Form.** |
| 3 | **Report History** | Archive of everything submitted. | Filterable list of past reports (by project / period). View (read-only) + Download PDF. |

> **Note:** A separate "Pending Reports" menu was dropped — pending items are surfaced in the Reporting Dashboard's *Upcoming Reporting Deadlines* table (filterable by project), so a dedicated menu is redundant.

> The **Report Form itself is not a menu** — it opens as a detail page (early `return`, `onBack`) when a project row is clicked, matching the existing app convention.

## 1.4 The Report Form (the heart of Manager work)

This is a **detail page**, opened from *My Report Projects* or *Pending Reports*.

**Top of form (context bar):** Project Name · Client · Reporting Period (e.g. "Week 30, Jul 21–27") · Frequency badge · Save Draft / Submit buttons.

**Body = sections rendered from the assigned template.** The PM only sees sections the Admin turned on. Full possible section set:

| Section | Fields the PM fills |
|---|---|
| **Project Overview** | Status · Overall Health · Progress % · Reporting Period |
| **Task Progress** | Completed · In Progress · Blocked · Delayed (counts / short notes) |
| **Resource Information** | Team Size · Allocation · Utilization · Availability |
| **Risks** | Risk Title · Severity (Low/Med/High/Critical) · Description · Mitigation |
| **Issues** | Current Issues · Impact · Resolution Plan |
| **Milestones** | Completed · Upcoming · Delayed |
| **Client Updates** | Feedback · Meetings · Approvals · Escalations |
| **Billing & Utilization** | Billing Util % · Resource Util % · Budget Notes |
| **Additional Notes** | Achievements · Challenges · Next Period Plan · Remarks |

**Rules (driven by the template):** 
- Mandatory fields are marked and block submit until filled.
- Validation (e.g. % must be 0–100) comes from the template config.
- Sections the Admin disabled simply don't appear.

## 1.5 Report Actions

`Save as Draft` · `Submit Report` · `Edit Draft` · `View Previous Reports` · `Download Submitted Report`

## 1.6 Manager Flow (end to end)

```
Login (Manager)
  → Sidebar: Project Reporting → Reporting Overview
  → See "3 Pending" → go to My Report Projects (or Pending Reports)
  → Click a project row
  → Report Form opens (sections from template)
  → Fill fields  →  Save Draft  (optional)
  → Submit  →  status becomes "Submitted"
  → (later) Report History → View / Download PDF
```

**Report status lifecycle:** `Not Started → Draft → Submitted` — plus `Overdue` if the due date passes before submit. (Colors: amber = due/draft, green = submitted, red = overdue — matches app convention.)

---

# WORK 2 — ADMIN LOGIN (Template Creation)

## 2.1 Overview

The Admin is the **rule-maker**. They don't report on projects; they decide **what every PM must report and how often**. They also (for now) act as the **Executive** who reads the dashboard.

## 2.2 Purpose

- Create standardized **reporting templates** (which sections, which fields, what's mandatory).
- **Assign** a template to a project + set frequency + name the PM + activate the schedule.
- **Monitor** who has submitted, who's pending, who's late.

## 2.3 New Sidebar — Admin

Add **two new menus** to the Admin sidebar:

> **Menu A:** `Template Creation`  (Work 2 — now)
> **Menu B:** `Portfolio Dashboard`  (Work 3 — later; the Executive view)

### Menu A — `Template Creation` (with sub-menus)

| # | Sub-menu | Purpose | What's inside |
|:--:|---|---|---|
| 1 | **Reporting Dashboard** | Admin's control view of the whole reporting process. | KPIs: Total Projects · Reports Submitted · Pending · Overdue. Reporting analytics. |
| 2 | **Reporting Templates** | Manage the library of templates. | List of templates with Create · Edit · Duplicate · Delete · Preview. |
| 3 | **Project Assignment** | Connect a template to real projects. | Select Project · Select Template · Frequency (Weekly/Biweekly/Monthly) · Assign PM · Activate schedule. |
| 4 | **Report Monitoring** | Track submission compliance. | Submitted · Pending · Late · Last Submission Date · Submission History. |

> **Template Builder** is a **detail page** (opened from *Reporting Templates → Create / Edit*), not a separate menu — same convention as the Manager report form.

## 2.4 The Template Builder (the heart of Admin work)

Opened from *Reporting Templates → Create Template* (or Edit).

**Top:** Template Name · Description · Frequency preset (optional default).

**Body — section toggles.** Admin turns sections ON/OFF and configures each:

```
[✓] Project Health          → fields configurable, set mandatory
[✓] Current Status
[✓] Task Progress
[ ] Resource Allocation     ← turned off = hidden from PM
[✓] Billing Utilization
[✓] Risks
[✓] Issues
[✓] Upcoming Milestones
[✓] Client Updates
[✓] Achievements
[✓] Next Sprint Plan
[✓] Additional Notes
```

For each enabled section the Admin can: choose which **fields** appear, mark fields **mandatory**, and set **validation rules**.

**Actions:** Save · Preview (see it as the PM will) · Duplicate · Delete.

## 2.5 Project Assignment Flow

```
Template Creation → Project Assignment
  → Select Project (e.g. "Apollo CRM")
  → Select Template (e.g. "Standard Weekly")
  → Set Frequency: Weekly
  → Assign PM: (Manager name)
  → Activate  →  PM now sees this project in "My Report Projects"
```

## 2.6 Admin Flow (end to end)

```
Login (Admin)
  → Sidebar: Template Creation → Reporting Templates
  → Create Template → Template Builder (toggle sections, mark mandatory) → Save
  → Project Assignment → pick project + template + frequency + PM → Activate
  → Report Monitoring → watch Submitted / Pending / Overdue
  → (later) Portfolio Dashboard → Executive view of all live data
```

---

# WORK 3 — PORTFOLIO DASHBOARD & PROJECT DETAIL  *(Later)*

> **Design later.** Listed here only so the shape is known. Read-only, dummy data for now.

- **Portfolio Dashboard** (Admin → `Portfolio Dashboard`): KPI cards, portfolio trends, a clickable project table, upcoming milestones, notifications — a bird's-eye view of *all* projects, fed by submitted reports.
- **Project Detail Dashboard** (click a project row): Tasks · Resources · Risks · Client Info · Notifications + **Generate PDF Report** — one project, everything on one screen.

The key principle carried forward: **whatever sections the Manager fills in Work 1 become exactly the data blocks the Dashboard displays in Work 3.** Design them to mirror each other.

---

## Appendix — Naming & Convention Notes

- New menus follow the existing `Sidebar.tsx` model: a `NavItem` with `children[]`, gold active state (`#F2D000`) on navy (`#1C2035`).
- Detail pages (Report Form, Template Builder) use the app's early-`return` + `onBack` / `onNavigate` pattern — **not** routes.
- Mock data as `const` / `useState` arrays at top of each page.
- Status colors reused: green = submitted/healthy, amber = pending/draft/at-risk, red = overdue/critical, blue = completed.
- Manager already has a "My Projects" (team ops) menu — this module's list is named **"My Report Projects"** to avoid confusion.
```
