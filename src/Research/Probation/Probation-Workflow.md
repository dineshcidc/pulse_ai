# Probation Workflow — End-to-End Flow

> **Status:** Draft for BA confirmation
> **Scope:** Full probation lifecycle across Admin, Employee, and Manager roles.
> **Note:** Stage 1 (Setup) is already implemented as part of the Add Employee flow. Stages 2–4 are pending.

---

## Core Idea

Probation is a **trial period** at the start of employment. The company decides whether the new
employee is a good fit and should be **confirmed** permanently.

The whole workflow is a single **Probation Case** that travels through stages, being handed off
between roles (Employee → Manager → Admin), changing **status** as it moves.

At the end, a **decision** is made: **Confirm**, **Extend**, or **Terminate**.

---

## The 4 Stages

### 🟦 Stage 1 — Setup (Admin) — *already implemented*

While adding a new employee, the Admin sets:

- Probation **duration** (e.g. 3 / 6 months)
- **Start & end dates** (auto-calculated)
- The **Reporting Manager**

➡️ A **Probation Case** is created with status **`Ongoing`**. The employee works normally while
the clock runs.

---

### 🟩 Stage 2 — Self-Assessment (Employee)

The employee has a dedicated **Probation** menu.

- For most of the period it simply **shows their details** — duration, dates, days remaining, status.
- When the end date is **near** (e.g. 15 days before), a **self-assessment / feedback form unlocks**.
- The employee fills it in (performance, learnings, challenges, goals met) and **submits**.

➡️ Status becomes **`Pending Manager Review`**. The employee can no longer edit — it's the
manager's turn.

*Why the employee goes first:* it gives the manager context and lets the employee self-reflect
before being assessed.

---

### 🟧 Stage 3 — Manager Assessment (Reporting Manager)

The manager has a **Probation** menu showing **only the employees who report to them** and are on
probation.

From an employee's detail page the manager sees:

- The employee's **submitted self-assessment** (read-only)
- Their **own assessment form**: rating, strengths, areas to improve, feedback, and a
  **recommendation** → *Confirm / Extend / Terminate*

The manager **submits**.

➡️ Status becomes **`Pending Admin Decision`**.

---

### 🟥 Stage 4 — Final Decision (Admin)

The Admin has the **Probation module** — a list of **all** employees on probation, filterable by
status (Ongoing / Awaiting review / Awaiting decision / Completed).

For a case that's ready, the Admin opens it and sees **everything together**:

- Employee's self-assessment
- Manager's assessment + recommendation

The Admin makes the **final decision**:

| Decision | What happens |
|---|---|
| ✅ **Confirm** | Employee becomes permanent → status **`Confirmed`** |
| ⏳ **Extend** | Must give a **reason** + new end date → status back to **`Ongoing (Extended)`**, cycle can repeat |
| ❌ **Terminate** | Employment ends → status **`Terminated`** |

---

## Status Lifecycle (backbone of the design)

Everything on screen is driven by **which status the case is in**.

```
Ongoing
   │  (end date nears → employee form unlocks, employee submits)
   ▼
Pending Manager Review
   │  (manager submits assessment)
   ▼
Pending Admin Decision
   │  (admin decides)
   ├──► Confirmed          (done ✅)
   ├──► Terminated         (done ❌)
   └──► Ongoing (Extended) ──► loops back to the top ⟳
```

---

## Role Summary

| Role | Their Probation screen | What they can DO |
|---|---|---|
| **Admin** | List of **all** probation employees + statuses | Set it up (done), review both feedbacks, **final decision**, extend with reason |
| **Employee** | **Their own** probation details | View progress; near end → fill & submit **self-assessment** |
| **Manager** | **Their team's** probation employees | Read employee's self-feedback, add **own assessment + recommendation**, submit |

---

## Key Design Insight

The **same probation record shows differently** depending on **who is looking** and **what stage**
the case is in:

- The **form is locked or unlocked** based on status + role.
- Each role only **acts during their stage**, and only **views** the rest of the time.
- It is a **sequential handoff**: Employee → Manager → Admin, with the status acting as the baton.

---

## Build Status

- ✅ **Stage 1 — Setup** (Add Employee → Probation section) — *done*
- ⬜ **Stage 2 — Employee Probation screen** (view + self-assessment)
- ⬜ **Stage 3 — Manager Probation screen** (team list + assessment)
- ⬜ **Stage 4 — Admin Probation module** (all cases + final decision / extend)

---

## Build Plan (finalized 2026-08-01)

> Approved build plan for the prototype. We build **in workflow order**, matching the existing
> app's *house style* (borrowed from the Offboarding module — styling & component patterns only,
> **not** its flow). Probation and Offboarding are **separate, independent modules**.

### Seed data from Stage 1 (the baton)

The already-built Add Employee page (`src/pages/admin/users/AddEmployeePage.tsx`) creates the case
carrying: **duration**, **start/end dates**, **reporting manager**, **remarks** → status
**`Ongoing`**. Every downstream screen reads this seed.

### Menu naming & placement (per role login)

| Role | Sidebar menu item | Screen |
|---|---|---|
| **Employee** | `Probation` (single item, MANAGE section) | `src/pages/employee/probation/MyProbationPage.tsx` |
| **Manager** | `Team Probation` (single item) | `src/pages/manager/probation/…` |
| **Admin** | new `PROBATION` section → `Probation Cases` | `src/pages/admin/probation/…` |

### Prototype clarity approach — **dummy Preview / phase tabs**

Because the three roles are separate logins with no shared backend, each screen owns its **status
locally** and exposes a small **dummy tab / Preview switcher** so BA + dev can walk **every phase
live** in one screen. This is a demo aid, not production UI.

### Foundation first — `src/pages/employee/probation/probationShared.tsx`

Shared vocabulary reused by all three roles: `ProbationStatus` type + lifecycle, `ProbationCase`
type (seed fields + employee self-assessment + manager assessment), **status pill**, **employee
detail header**, **days-remaining chip**, **DemoPhase switcher**, and mock cases.

### Stage 2 — Employee Probation screen (built first)

One screen, driven by status, with a **dummy phase tab** to demo all three states clearly:

1. **Phase A — Ongoing (time-table view):** duration, start/end dates, **days-remaining countdown**,
   status. Self-assessment **locked** (shows *"unlocks ~15 days before end date"*).
2. **Phase B — Self-Assessment unlocked (~15 days before end):** the form activates —
   performance, learnings, challenges, goals met (one card per question) → **Submit**.
3. **Phase C — Submitted (locked):** same cards, read-only + filled; status →
   **`Pending Manager Review`** (handoff to the manager is visually obvious).

**Post-decision states (what the employee sees AFTER the Admin's Stage 4 decision):**

4. **Phase D — Confirmed:** green congratulations banner + decision summary (effective date,
   decided by) → status **`Confirmed`**. Employee is now permanent.
5. **Phase E — Extended:** violet banner making it clear probation was extended; shows the
   **Admin's reason**, the **previous → new end date**, and an updated countdown → status
   **`Ongoing (Extended)`**.
6. **Phase F — Terminated:** red professional banner; shows termination status, effective date,
   the **Admin's reason**, and a "contact HR" note → status **`Terminated`**.

All six phases are walkable via the dummy phase switcher, so the BA can review the **entire**
employee journey end-to-end before development.

### Build sequence

Foundation → **Stage 2 (Employee)** → Stage 3 (Manager) → Stage 4 (Admin). Each screen is wired
into its role's `Sidebar.tsx` menu + dashboard route as it's completed.

---

## ✅ FINAL STATUS — End of build (2026-08-02)

> **The full Probation Period module is BUILT across all three roles.** Prototype is
> complete and the whole app typechecks clean (`npx tsc -p tsconfig.app.json` → EXIT 0).
> Use this section on Monday to reconfirm quickly.

### What's done, by stage

| Stage | Role | Screen(s) | Status |
|---|---|---|---|
| 1 — Setup | Admin | `src/pages/admin/users/AddEmployeePage.tsx` (Probation section) | ✅ Done |
| 2 — Self-Assessment | Employee | `src/pages/employee/probation/MyProbationPage.tsx` | ✅ Done |
| 3 — Manager Assessment | Manager | `TeamProbationPage.tsx` + `ManagerReviewPage.tsx` + `ManagerProbationModule.tsx` | ✅ Done |
| 4 — Final Decision | Admin | `AdminProbationPage.tsx` + `AdminDecisionPage.tsx` + `AdminProbationModule.tsx` | ✅ Done |
| 5 — Settings (config) | Admin | `src/pages/admin/probation/ProbationSettingsPage.tsx` | ✅ Done |

### File map (all under `src/pages/`)

- **Shared foundation:** `employee/probation/probationShared.tsx` — status lifecycle + `STATUS_META`,
  `ProbationCase` model, `StatusPill`, `Avatar`, `EmployeeDetailHeader`, `DaysRemainingChip`,
  `QuestionCard` + `SELF_ASSESSMENT_QUESTIONS`, `SectionCard`, `StatBox`, `ReadField`,
  `DemoPhaseSwitcher`, and the shared **`ManagerAssessmentForm`** (+ `StarRating`, `COMPETENCIES`,
  `RECOMMENDATIONS`, `ManagerAssessmentFormValue`). Mock data: `MOCK_MY_CASE`, `MOCK_TEAM_CASES`,
  `MOCK_ALL_CASES` (spans every status).
- **Employee:** `employee/probation/MyProbationPage.tsx` — 6 demo phases via `DemoPhaseSwitcher`.
- **Manager:** `manager/probation/` — list, review detail, module switcher.
- **Admin:** `admin/probation/` — list (`AdminProbationPage`), decision detail (`AdminDecisionPage`,
  3 tabs), module switcher (`AdminProbationModule`), settings (`ProbationSettingsPage`).

### Menus (wired)

- **Employee** → `Probation` (MANAGE section).
- **Manager** → `Team Probation` (TEAM section).
- **Admin** → `PROBATION` section → **Probation** group → children **Probation Cases** +
  **Probation Settings**.

### Key decisions locked in

1. **Manager's Assessment is ONE shared form** — `ManagerAssessmentForm` is used by the Manager
   (editable) and by the Admin's Tab 2 (read-only / filled), so the two never drift. Added optional
   `competencies` to the `ManagerAssessment` model and filled all mock assessments.
2. **Admin decision detail** mirrors the Manager's tabbed white-card design, with a 3rd
   **Final Decision** tab: Confirm → `Confirmed`, Extend → reason + new end date → `Ongoing (Extended)`,
   Terminate → reason → `Terminated`.
3. **Probation Settings** = **org-level, GLOBAL-ONLY** (no per-employee override), placed under the
   PROBATION section. **Trimmed to only the Unlock Timing card** (days-before-end stepper that
   replaces the hardcoded `SELF_ASSESSMENT_WINDOW_DAYS = 15`). No master toggle, no questions editor,
   no Save button (applies directly) — per the user, the rest is handled directly for now.

### Known prototype limitations (by design — no shared backend)

- The three roles are **separate logins with no shared state**, so each screen owns its status
  locally and uses a **dummy `DemoPhaseSwitcher`** to walk every phase live.
- **Probation Settings does not yet feed the live employee screen** — it's a working config UI in
  local state. When wired to a real backend, the employee page should read the unlock window from
  here instead of the constant.

### ▶ Monday reconfirm checklist

1. Log in as **Employee** → Probation → walk all 6 demo phases.
2. Log in as **Manager** → Team Probation → open a *Pending Manager Review* case → submit an
   assessment.
3. Log in as **Admin** → Probation → Probation Cases → **Decide** on Priya / Sofia / Tariq
   (Confirm / Extend / Terminate) → check Tab 2 shows the manager's form filled & read-only.
4. Admin → Probation → **Probation Settings** → adjust the unlock-window stepper.
