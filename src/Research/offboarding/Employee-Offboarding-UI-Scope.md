# Employee Offboarding — UI/UX Scope & Design Tracker

**Document type:** Navigation + design scope (NO business workflow — that lives in `Employee-Offboarding-Workflow.md`).
**Purpose:** Freeze the **menu structure, page list, and design order** for every role, so we know exactly which screens to build and can tick them off as we go.
**Scope:** Flow 1 (employee-initiated). Six roles: **Employee · CTO · Manager (PM) · System Admin · Finance · HR.**

> **How to read each role block:** Sidebar menu → submenus → a table of pages (Purpose · UI flow · design order). Page IDs (E1, C1…) are stable references for tracking.

---

## 0. Global design order (why this sequence)

We design **in the direction the workflow flows**, so every screen we build already has its "upstream" state defined:

| Phase | Role | Why this position |
|-------|------|-------------------|
| **1** | **Employee** | The entry point — the request that starts everything. Design first. |
| **2** | **CTO (Delivery Head)** | The master gate — approval + notice period. Nothing downstream exists until this is designed. |
| **3** | **Manager (PM)** | First department clearance. |
| **4** | **System Admin (IT)** | Second department clearance (same pattern as PM). |
| **5** | **Finance** | Third department clearance (same pattern, plus settlement). |
| **6** | **HR** | **Last** — the cockpit that monitors all 5 tabs and closes the case. It depends on every other role's output existing. |

> **Role logins:** Employee, Manager, and Admin already exist. **CTO, System Admin, Finance, and HR become their own role logins** (the old single "Admin" splits into these). Menu structure below is defined per target login.

---

## PHASE 1 — EMPLOYEE

**Sidebar menu:** `Offboarding` (single menu, no submenus — the page content changes with the case status)
**Submenus:** none

**UI flow (state-driven, one destination):**
`Request Form` → (submit) → `Pending / Status` → (CTO approves) → `My Offboarding` tracker + `Exit Interview` + `Exit Documents`.

| ID | Page / Screen | Purpose | UI flow to cover | Order |
|----|---------------|---------|------------------|-------|
| **E1** | **Offboarding Request Form** | Where the employee raises the exit request. | Reason, intended last day, notes → **Submit** (with confirm). Only screen visible pre-submission. | 1 |
| **E2** | **Request Status / Pending** | What the employee sees after submitting, until the CTO decides. | States: **Pending CTO approval** · **Rejected** (shows CTO reason + option to raise again) · **Withdrawn**. **Withdraw** action while pending. | 2 |
| **E3** | **My Offboarding (Tracker)** | The employee's home base after approval. | Notice period + **LWD countdown**, and live **department status list** (CTO ✔ · PM · IT · Finance · HR). Unlocks only after CTO approval. | 3 |
| **E4** | **Exit Interview** | Employee submits exit feedback. | Feedback form (reason, experience, suggestions) → **Submit**; then shows "submitted, awaiting HR review". Opens when HR requests it. | 4 |
| **E5** | **Exit Documents** | Download final documents. | Download list — Relieving Letter, Experience Letter, Finance/F&F docs. Enabled once HR issues them. | 5 |

---

## PHASE 2 — CTO (DELIVERY HEAD)

**Sidebar menu:** `Offboarding Approvals`
**Submenus:** none

**UI flow:** `Approval Queue` → open a request → `Request Detail` → **Accept + set notice period** or **Reject + reason**.

| ID | Page / Screen | Purpose | UI flow to cover | Order |
|----|---------------|---------|------------------|-------|
| **C1** | **Approval Queue** | List of requests awaiting the CTO's decision (plus a history of decided ones). | Table of pending/decided requests · search/filter by status · row → open detail. | 1 |
| **C2** | **Request Detail + Decision** | Review one request and make the master approval. | Employee details + reason + intended last day → **Accept** (with **Notice Period 30/60/90 or early-release date**) or **Reject** (with reason). Confirmation state after action. | 2 |

---

## PHASE 3 — MANAGER (PROJECT MANAGER)

**Sidebar menu:** `Team Offboarding`
**Submenus:** none

**UI flow:** `Offboarding Queue` → open a member → `Request Detail` → **Submit Project Clearance** or **Put On Hold**. (Rows are read-only / "Awaiting CTO Approval" until the CTO approves.)

| ID | Page / Screen | Purpose | UI flow to cover | Order |
|----|---------------|---------|------------------|-------|
| **M1** | **Team Offboarding Queue** | List of the manager's team members who are offboarding. | Table with status + **LWD countdown** · locked "Awaiting CTO Approval" badge pre-approval · row → detail. | 1 |
| **M2** | **Request Detail + Project Clearance** | Give the team-side clearance. | Member info + handover **checklist** (projects, responsibilities, docs, KT) + remarks → **Submit Project Clearance** / **Put On Hold** (reason). Read-only when not yet approved or already cleared. | 2 |

---

## PHASE 4 — SYSTEM ADMIN (IT)

**Sidebar menu:** `Offboarding Clearance` (IT)
**Submenus:** none

**UI flow:** `IT Clearance Queue` → open an employee → `IT Clearance Detail` → **Submit IT Clearance** or **Put On Hold**.

| ID | Page / Screen | Purpose | UI flow to cover | Order |
|----|---------------|---------|------------------|-------|
| **S1** | **IT Clearance Queue** | List of employees needing IT clearance. | Table with status + LWD countdown · locked pre-approval · row → detail. | 1 |
| **S2** | **IT Clearance Detail** | Verify assets + revoke access. | **Asset & access checklist** (laptop, ID card, email, VPN, tools/accounts) with **last-working-day** flags on revocation items + remarks → **Submit IT Clearance** / **Put On Hold**. | 2 |

---

## PHASE 5 — FINANCE

**Sidebar menu:** `Offboarding Clearance` (Finance)
**Submenus:** none

**UI flow:** `Finance Clearance Queue` → open an employee → `Finance Clearance Detail` → **Submit Finance Clearance** or **Put On Hold**.

| ID | Page / Screen | Purpose | UI flow to cover | Order |
|----|---------------|---------|------------------|-------|
| **F1** | **Finance Clearance Queue** | List of employees needing finance settlement. | Table with status + LWD countdown · locked pre-approval · row → detail. | 1 |
| **F2** | **Finance Clearance Detail** | Settle dues and prepare documents. | **Settlement checklist** (dues cleared, recoveries, **notice-shortfall buy-out/waiver**, final payment, documents prepared) + remarks → **Submit Finance Clearance** / **Put On Hold**. | 2 |

---

## PHASE 6 — HR (COCKPIT + CLOSURE) — build last

**Sidebar menu:** `Offboarding`
**Submenus:** `Offboarding Dashboard` · `Offboarding Cases`

**UI flow:** `Dashboard` (KPIs + all cases) → open a case → `Case Detail` **5-tab cockpit** (CTO · PM · System Admin · Finance · HR) → once all department tabs are complete, the **HR tab** unlocks → run closure → **Close Case**.

| ID | Page / Screen | Purpose | UI flow to cover | Order |
|----|---------------|---------|------------------|-------|
| **H1** | **Offboarding Dashboard** | HR command center — all active + past exits at a glance. | **KPI cards** (Active · Pending CTO Approval · Clearances In Progress · Pending HR Closure · Completed) + cases list · filter/search · row → case detail. | 1 |
| **H2** | **Case Detail — 5-Tab Cockpit** | Monitor every department's clearance in one place. | Tabs **CTO · PM · System Admin · Finance · HR**; each shows that dept's status, what was submitted, remarks, timestamp. Top summary "X of 4 clearances complete". | 2 |
| **H3** | **HR Closure (HR tab)** | HR's own final activities — unlocks after all 3 dept clearances. | Checklist: **Review Exit Interview → Issue Relieving Letter → Issue Experience Letter → Final Formalities → Close Case**. Locked until PM+IT+Finance complete. | 3 |

---

## 7. Master build checklist (in exact design order)

Tick each as it's designed. **14 screens total.**

**Phase 1 — Employee**
- [ ] E1 · Offboarding Request Form
- [ ] E2 · Request Status / Pending (pending · rejected · withdrawn)
- [ ] E3 · My Offboarding (tracker + LWD countdown + dept statuses)
- [ ] E4 · Exit Interview form
- [ ] E5 · Exit Documents (download)

**Phase 2 — CTO**
- [ ] C1 · Approval Queue
- [ ] C2 · Request Detail + Accept(set notice)/Reject

**Phase 3 — Manager (PM)**
- [ ] M1 · Team Offboarding Queue
- [ ] M2 · Request Detail + Project Clearance (submit/hold)

**Phase 4 — System Admin (IT)**
- [ ] S1 · IT Clearance Queue
- [ ] S2 · IT Clearance Detail (asset & access checklist, submit/hold)

**Phase 5 — Finance**
- [ ] F1 · Finance Clearance Queue
- [ ] F2 · Finance Clearance Detail (settlement checklist, submit/hold)

**Phase 6 — HR**
- [ ] H1 · Offboarding Dashboard (KPIs + cases)
- [ ] H2 · Case Detail — 5-tab cockpit
- [ ] H3 · HR Closure (exit interview review + letters + close)

---

## 8. Shared building blocks (design once, reuse everywhere)

To keep the six roles consistent and save time, these repeat across screens:

| Block | Used by | Notes |
|-------|---------|-------|
| **Offboarding queue table** | CTO, Manager, IT, Finance, HR | Same layout: employee cell · status pill · LWD countdown · action. |
| **Employee detail header** | every detail screen | Avatar, name, code, designation, department, notice/LWD. |
| **Clearance checklist + remarks + submit/hold** | Manager, IT, Finance | One reusable action pattern (three checklists differ only in items). |
| **Status pill** | all | Pending · Awaiting CTO · In Progress · Completed · On Hold · Rejected. |
| **LWD countdown chip** | Employee, all clearance roles, HR | Same component everywhere. |

---

*This is the design scope. Once approved, we build in the checklist order above, ticking off each screen. No screen outside this list is in scope for Flow 1.*
