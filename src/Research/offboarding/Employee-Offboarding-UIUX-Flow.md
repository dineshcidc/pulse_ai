# Employee Offboarding — UI/UX Flow

> An employee raises an exit request → the **CTO** approves it and sets the notice period → three departments (**Manager, IT, Finance**) each complete a clearance → **HR** watches everything and closes the case.

Six people, six views, **one shared request**. What each person sees on screen is driven by **which stage the request is in**.

---

## The 6 Roles & Their One Screen-Set

| Role | Their menu | What their screens are for |
|---|---|---|
| **Employee** | `Offboarding` | Raise the request, track progress, do the exit interview, download documents. |
| **CTO (Delivery Head)** | `Offboarding Approvals` | Approve / reject the request and set the notice period. |
| **Manager (PM)** | `Team Offboarding` | Give the project handover clearance. |
| **System Admin (IT)** | `Offboarding Clearance` | Give the asset & access clearance. |
| **Finance** | `Offboarding Clearance` | Give the settlement clearance. |
| **HR** | `Offboarding` | Monitor all departments in one cockpit, then close the case. |

---

# PHASE 1 — EMPLOYEE

**Menu:** `Offboarding` (one menu — the page changes with the stage)

The employee's screen is a **single destination that transforms** as the request moves forward. They never navigate a maze — the one page shows the right thing for the moment.

### 🟦 Screen E1 — Offboarding Request Form
*What they see:* a simple form — **reason for leaving**, **intended last day**, and a **notes** box, with a **Submit** button (asks for confirmation).
*This is the only screen visible before submitting.*
➡️ After **Submit**, the form is replaced by the Pending page.

### 🟨 Screen E2 — Request Status / Pending
*What they see:* a calm status page — *"Your request has been submitted and is awaiting approval."*
It has three possible looks:
- **Pending** — waiting on the CTO. A **Withdraw** button is available here.
- **Rejected** — shows the CTO's reason, with an option to raise a fresh request.
- **Withdrawn** — confirms they cancelled it.

*This is all the employee sees until the CTO decides.* No notice period, no checklist, no departments yet.

### 🟩 Screen E3 — My Offboarding (Tracker)
*Unlocks the moment the CTO approves.* This becomes the employee's home base.
*What they see:*
- **Notice period** + a big **Last Working Day countdown**.
- A **live department status list** — CTO ✔ · Manager · IT · Finance · HR — each showing Pending / Done.
They mostly **watch** here; they act only when asked (the exit interview).

### 🟧 Screen E4 — Exit Interview
*Opens when HR requests it, near the end.*
*What they see:* a feedback form — reason for leaving, overall experience, suggestions → **Submit**. Afterwards it shows *"Submitted — awaiting HR review."*

### 🟪 Screen E5 — Exit Documents
*Enabled once HR issues the documents.*
*What they see:* a **download list** — Relieving Letter, Experience Letter, and any Finance / final-settlement documents.

**Employee flow:** `E1 Form → E2 Pending → (approved) → E3 Tracker → E4 Exit Interview → E5 Documents`

---

# PHASE 2 — CTO (DELIVERY HEAD)

**Menu:** `Offboarding Approvals`

The CTO is the **gate**. Two screens: a list, and a decision page.

### Screen C1 — Approval Queue
*What they see:* a table of requests — **pending ones** needing a decision, plus a **history** of decided ones. Searchable / filterable by status. Clicking a row opens the detail.

### Screen C2 — Request Detail + Decision
*What they see:* the employee's details, their reason, and intended last day. Two clear actions:
- **Accept** → choose a **Notice Period (30 / 60 / 90 days)** or an early-release date.
- **Reject** → give a reason.
After acting, the screen shows a confirmation state.

**CTO flow:** `C1 Queue → C2 Detail → Accept (set notice) / Reject`

---

# PHASE 3 — MANAGER (PROJECT MANAGER)

**Menu:** `Team Offboarding`

The manager gives the **project handover clearance**. Same two-screen shape as the CTO.

### Screen M1 — Team Offboarding Queue
*What they see:* a list of their team members who are offboarding — with **status** and **LWD countdown**. Before the CTO approves, a row shows an **"Awaiting CTO Approval"** badge and can only be viewed, not acted on.

### Screen M2 — Request Detail + Project Clearance
*What they see:* the member's info + a **handover checklist** (projects, responsibilities, documents, knowledge transfer) and a remarks box. Two actions:
- **Submit Project Clearance** — when handover is complete.
- **Put On Hold** — with a reason, if something's pending.

**Manager flow:** `M1 Queue → M2 Detail → Submit Clearance / Put On Hold`

---

# PHASE 4 — SYSTEM ADMIN (IT)

**Menu:** `Offboarding Clearance`

IT gives the **asset & access clearance**. Same two-screen pattern.

### Screen S1 — IT Clearance Queue
*What they see:* a list of employees needing IT clearance — status + LWD countdown, locked before CTO approval.

### Screen S2 — IT Clearance Detail
*What they see:* an **asset & access checklist** — laptop, ID card, email, VPN, tools / accounts. Access-revocation items are flagged as **"last-working-day"** actions. Plus a remarks box. Two actions: **Submit IT Clearance** / **Put On Hold**.

**IT flow:** `S1 Queue → S2 Detail → Submit Clearance / Put On Hold`

---

# PHASE 5 — FINANCE

**Menu:** `Offboarding Clearance`

Finance gives the **settlement clearance**. Same pattern, with money items.

### Screen F1 — Finance Clearance Queue
*What they see:* a list of employees needing settlement — status + LWD countdown, locked before CTO approval.

### Screen F2 — Finance Clearance Detail
*What they see:* a **settlement checklist** — dues cleared, recoveries, notice-shortfall buy-out / waiver (if any), final payment, documents prepared — plus remarks. Two actions: **Submit Finance Clearance** / **Put On Hold**.

**Finance flow:** `F1 Queue → F2 Detail → Submit Clearance / Put On Hold`

---

# PHASE 6 — HR (COCKPIT + CLOSURE)

**Menu:** `Offboarding` → submenus **`Dashboard`** · **`Cases`**

HR is the **conductor** — watching every department from one place, then finishing the case. Three screens.

### Screen H1 — Offboarding Dashboard
*What they see:* a command center — **KPI cards** (Active · Pending CTO Approval · Clearances In Progress · Pending HR Closure · Completed) and a **list of all cases**, filterable / searchable. A row opens the case detail.

### Screen H2 — Case Detail (5-Tab Cockpit)
*What they see:* one case with **five tabs — CTO · Manager · System Admin · Finance · HR.** Each tab shows that department's status, what was submitted, remarks, and when. A summary at the top reads *"X of 4 clearances complete."*

### Screen H3 — HR Closure (the HR tab)
*Unlocks only after Manager + IT + Finance are all done.*
*What they see:* HR's own checklist —
**Review Exit Interview → Issue Relieving Letter → Issue Experience Letter → Final Formalities → Close Case.**
Submitting the final clearance **closes the offboarding**.

**HR flow:** `H1 Dashboard → H2 Cockpit (5 tabs) → (all clear) → H3 Closure → Close Case`

---

*This document is the UI/UX walkthrough for BA review. Once confirmed, it guides the screen design — built in role order, Employee first, HR last.*
