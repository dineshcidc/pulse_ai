# Employee Offboarding — UI/UX Workflow

**Purpose:** Define how the Employee Offboarding process works across the three roles (Employee → Manager → Admin) *before* UI design begins.
**Scope:** Workflow + required menus only. No screen design yet.
**Audience note:** Written to be understood with zero prior HR knowledge. Every term is explained where it first appears.

---

## 1. What is Employee Offboarding?

The structured process a company follows when an employee **leaves** — by resignation, termination, retirement, or end of contract.

**Goal:** exit the person *cleanly* — recover company assets, transfer their work, clear dues, collect feedback, revoke access, and hand over exit documents — so the company keeps its data, money, and knowledge, and the employee leaves on good terms.

**Two ways it can start:**
- **Resignation** → Employee initiates (most common). The employee *chooses* to leave.
- **Termination / Contract end** → Admin (HR) initiates. The company ends the employment.

### The one concept that drives everything: the Notice Period
When a resignation is accepted, the employee does **not** leave immediately. They serve a **notice period** — a fixed number of days (in IT, usually **30, 60, or 90 days**) during which they keep working while their replacement is arranged and their work is handed over.

- **Last Working Day (LWD)** = the final day the employee actually works. It is calculated as *resignation date + notice period* (and can be negotiated).
- Most offboarding activity (handover, asset return, clearances) happens in the **last 1–2 weeks before LWD**, not on day one.
- If the employee leaves *before* serving the full notice period, the shortfall is either **bought out** (employee pays for the un-served days) or **waived** by the manager/HR. This directly affects the final money calculation.

Once started, offboarding moves through a fixed set of **clearance steps**, each owned by a role, and ends only when **all clearances are done + final settlement is paid + documents are issued + account is deactivated**.

---

## 2. Roles at a Glance

| Role | Their job in offboarding |
|------|--------------------------|
| **Employee** | Raise resignation, serve notice period, complete exit tasks (asset return, handover, exit interview), download final documents. |
| **Manager** | Accept/acknowledge resignation, set & confirm Last Working Day (LWD), ensure knowledge transfer & handover, give team-level clearance. |
| **Admin (HR)** | Own the whole process — track all exits, run and verify clearances across departments, compute Full & Final (F&F), issue documents, deactivate the account. |

**Clearance owners (act *inside* the process, coordinated by Admin/HR):**

| Owner | What they clear |
|-------|-----------------|
| **Manager** | Knowledge Transfer / Handover of work. |
| **IT** | Return of laptop/devices + revocation of all system access (email, VPN, code repos, cloud, tools). |
| **Finance** | Pending dues, salary advances, reimbursements, notice-period recovery, F&F. |
| **HR (Admin)** | Exit interview, ID card, documents, final closure. |

> **✅ Confirmed decision (v1):** The app has **three login roles — Employee, Manager, Admin (HR)**. A **single Admin login** handles **all** HR, **System Administration (IT)**, and **Finance** clearances via the **Clearance Management** screen. There are no separate IT/Finance logins yet.
>
> **🔜 Future phase:** Finance and System Support will become their own roles with dedicated logins, menus, and permissions. To make that split painless later, we design v1 so that:
> - Each clearance item already carries an **`owner` tag** (`HR` / `IT` / `Finance` / `Manager`) even though Admin acts on all of them now — so filtering/splitting by owner later is just a permission change, not a redesign.
> - **Clearance Management is grouped into owner sections** (HR, IT, Finance) rather than one flat list, so each section can later be handed to its own role untouched.
> - F&F and Account Deactivation are **separate menus** (not buried inside one Admin screen), so Finance / IT can inherit them cleanly later.
> - The workflow, statuses, and checklist object **do not change** when roles are split — only *who can see/act on which section* changes.

**Principle (same as the rest of the app):** Employee submits → Manager approves → Admin finalises.

---

## 3. The Offboarding Timeline (three phases)

Real offboarding is not a single burst of activity — it plays out over the notice period. Understanding these three phases is essential before designing screens, because each role's view changes depending on the phase.

```
   RESIGNATION                     LAST WORKING                 FINAL
   ACCEPTED                        DAY (LWD)                    CLOSURE
      │                                │                           │
      ├──────── PHASE A ───────────────┤──── PHASE B ────┤── PHASE C ─┤
      │      (Notice Period)           │   (On LWD)       │ (Post-LWD) │
      │                                │                  │            │
  Notice clock   Handover +       Return assets,     F&F computed &   Docs
  starts;        clearances       revoke ALL         paid (within     issued,
  replacement    done in last     access, exit       ~30–45 days),    case
  planned        1–2 weeks        interview          dues recovered   closed
```

- **Phase A — Notice Period (days to weeks):** Employee keeps working. Handover happens progressively. Clearance checklist is generated early but most items are completed near the end.
- **Phase B — Last Working Day:** Assets physically returned, **all system access revoked at end of day**, exit interview done, manager gives final sign-off.
- **Phase C — Post-LWD:** Finance computes **Full & Final** settlement (final attendance and leave balance are only known after LWD) and pays it within ~30–45 days. Relieving/Experience letters are issued once clearance is complete (often on/around LWD). Case is closed → **Ex-Employee**.

---

## 4. Step-by-Step Workflow

```
START
  │
  ▼
1. RESIGNATION RAISED                                    [Employee | Admin]
   • Employee submits resignation (reason, intended LWD), OR
   • Admin initiates offboarding for termination / contract end.
   • Status → "Submitted"
  │
  ▼
2. MANAGER REVIEW                                        [Manager]
   • Manager acknowledges/accepts the resignation.
   • Confirms or negotiates the Last Working Day (LWD)
     based on notice period.
   • (Can Reject / send back before acceptance.)
   • Status → "Accepted"
  │
  ▼
3. NOTICE PERIOD STARTED                                 [System]
   • The notice-period clock starts running toward the LWD.
   • Employee keeps working; replacement is arranged.
   • Status → "Notice Period Started"
  │
  ▼
4. OFFBOARDING INITIATED (HR)                            [Admin]
   • Admin opens the offboarding case.
   • Auto-generates the CLEARANCE CHECKLIST (see below).
   • Status → "Clearance In Progress"
  │
  ▼
5. CLEARANCE IN PROGRESS  (Phase A → B)
   Runs in real-world ORDER. The employee KEEPS their laptop &
   system access for the WHOLE notice period — they need it to
   work and to hand over — so asset return and access revocation
   are the FINAL steps, performed on the Last Working Day.

     1) Knowledge Transfer     Employee documents & transfers  [Employee]
              ↓
     2) Manager Clearance      Manager confirms KT complete    [Manager]
              ↓
     3) Exit Interview         Employee submits feedback       [Employee/HR]
              ↓
     4) Finance & HR Clearance Dues checked, HR sign-off       [Finance/HR]
              ↓
     5) Asset Return           Laptop, ID, accessories         [Employee/IT]
        (on Last Working Day)
              ↓
     6) IT Access Revoked      Email, VPN, tools — end of day  [IT]
        (end of Last Working Day)

   • Admin verifies each clearance item.
  │
  ▼
6. FINAL SETTLEMENT — F&F  (Phase C, after LWD)          [Admin]
   • Admin/Finance computes Full & Final:
       + Pending salary (up to LWD)
       + Leave encashment (unused paid leave paid out)
       + Bonus / incentives due
       - Deductions, unreturned-asset recovery
       - Notice-period shortfall recovery (if any)
   • Marks F&F as settled / paid.
   • Status → "F&F Pending" (until settled)
  │
  ▼
7. DOCUMENTS & CLOSURE                                   [Admin]
   • Admin issues Relieving Letter + Experience Letter
     (+ F&F statement, Payslips; Form 16 / PF exit date updated).
   • Admin deactivates employee access (see "Deactivate
     Employee Access" — email, portal, VPN, Git, Jira, etc.).
   • Sets rehire eligibility (Yes/No) for future reference.
   • Status → "Documents Issued" → "Offboarded"
  │
  ▼
END  (Employee record becomes Ex-Employee, read-only)
```

*IT/Finance actions marked as **Admin** are performed by Admin (HR) on their behalf in v1 — see §2.

### The Clearance Checklist (canonical — the core tracking object)
Every role reads/acts on this same checklist. Each item carries an `owner` tag.

| # | Clearance item | Owner | Phase |
|---|----------------|-------|-------|
| 1 | Knowledge Transfer | Employee | A |
| 2 | Manager Clearance (KT confirmed) | Manager | A |
| 3 | Exit Interview | Employee / HR | B |
| 4 | Finance Clearance | Finance | B → C |
| 5 | HR Clearance | HR | B → C |
| 6 | Asset Return | Employee / IT | B (on LWD) |
| 7 | IT Access Revoked | IT | B (end of LWD) |

**Key rules:**
- Step 7 cannot complete until **every** clearance item is done **and** F&F in Step 6 is settled.
- **The employee keeps their laptop and system access for the ENTIRE notice period** — they need it to work and to complete knowledge transfer. **Asset Return and IT Access Revoked are therefore the FINAL steps, done on the Last Working Day** (they cannot be completed earlier).
- **Knowledge Transfer + Manager Clearance complete first**, since manager sign-off confirms the handover before the exit is finalised.
- **Access revocation must happen at the end of the LWD** regardless of where F&F stands — the person must not retain system access after their last day, even if money is still being settled.
- F&F (Step 6) and document issue (Step 7) run on **different clocks**: the relieving letter can be issued on/around LWD once clearances pass, while F&F payment may follow weeks later.

---

## 5. Required Menus by Role

### Employee
| Menu / Screen | Purpose | Which phase |
|---------------|---------|-------------|
| **Resignation / Exit Request** | Submit resignation (reason, intended LWD); view status; **withdraw** while still pending. | Start |
| **My Offboarding** | Personal tracker with an **Overall Progress %** bar at the top (e.g. `65% ████████░░░`), followed by the **clearance checklist** and an LWD countdown. The employee's home base for the whole exit. | A → C |
| **Handover / Knowledge Transfer** | Record what work is being transferred and to whom (notes, docs, pending items). | A |
| **Exit Interview** | Fill the exit feedback form (why leaving, experience, suggestions). | A/B |
| **Asset Return** | *(reuse existing flow)* return assigned assets (laptop, ID card, accessories). | B |
| **Exit Documents** | Download **Relieving Letter, Experience Letter, F&F Settlement Statement, Payslips, Form 16 (optional)** once issued. | C |

> **Employee Dashboard alert:** once offboarding is initiated, show an alert card on the Employee Dashboard — *"Your offboarding process has started"* with a **View Progress** button that opens **My Offboarding**.

### Manager
| Menu / Screen | Purpose | Which phase |
|---------------|---------|-------------|
| **Team Offboarding** | Queue of team members who resigned (formerly "Team Exits"); **accept/reject**, confirm/negotiate LWD. | Start / A |
| **Knowledge Transfer / Handover** | Track the person's handover tasks; confirm work is fully transferred to the team. | A |
| **Manager Clearance** | Final team-side sign-off that the member is cleared from the manager's side. | B |

### Admin (HR)
| Menu / Screen | Purpose | Which phase |
|---------------|---------|-------------|
| **Offboarding Dashboard** | All active + past exits, status, LWD dates, pending clearances at a glance. Shows **KPI summary cards** (see below). The command center. | All |
| **Initiate Offboarding** | Start offboarding for a termination / contract end (Admin-initiated path). | Start |
| **Clearance Management** | Track & verify all department clearances (Manager, IT, Finance, HR); mark IT/Finance items done on their behalf. | A → B |
| **Exit Interview Review** | Read submitted exit feedback; spot attrition patterns. | B |
| **Full & Final (F&F)** | Compute and settle final dues (salary, leave encashment, deductions, recovery). | C |
| **Exit Documents** | Generate & issue Relieving / Experience letters, F&F statement, Payslips, Form 16. | C |
| **Deactivate Employee Access** | Revoke **all** access — email, employee portal, VPN, Git repository, Jira, Figma, other company systems; close the case → mark Ex-Employee; set rehire eligibility. | B / C |

> **Offboarding Dashboard — KPI summary cards:** **Active Offboarding · Pending Manager Approval · Pending Asset Return · Pending Full & Final · Completed This Month.**

---

## 6. How It Starts & Ends

**Starts when:**
- An **Employee** submits a resignation, **or**
- An **Admin** initiates offboarding for a termination / end of contract.

**Ends when ALL of the below are true:**
- All clearance items are marked done (Manager, IT, Finance, HR).
- Assets returned & all system access revoked.
- Full & Final settlement is paid.
- Relieving + Experience letters issued.
- Employee access deactivated → employee status = **Offboarded** (record becomes read-only).

---

## 7. Status Flow (single source of truth)

```
Draft
  → Submitted
  → Accepted
  → Notice Period Started
  → Clearance In Progress
  → F&F Pending
  → Documents Issued
  → Offboarded
```

**Branches / exceptions:**
- Any stage **before "Accepted"** can be **Withdrawn** by the employee or **Rejected** by the manager.
- **Termination path** skips the employee "Submitted" step — Admin creates the case directly at "Accepted / Clearance In Progress."
- **On Hold** — a case can be paused (e.g., legal/dispute) at any point without losing progress.
- **Different clocks:** "Documents Issued" can occur while F&F is still pending — the relieving letter may go out on/around LWD before the F&F payment completes.

> One shared `status` field drives every role's view: the employee tracker, the manager queue, and the admin dashboard all read the **same** case status.

---

## 8. Real-World End-to-End Process (IT company walkthrough)

*A concrete example so the whole workflow is unambiguous. Meet **Ravi**, a Software Engineer with a **60-day notice period**, resigning to join another company.*

**Day 0 — Resignation raised (Employee)**
Ravi opens **Resignation / Exit Request**, selects reason "Better opportunity," and proposes an intended LWD 60 days out. He submits → status becomes **Submitted**. His **My Offboarding** page now shows an empty checklist and an LWD countdown.

**Day 1–2 — Manager review (Manager)**
His manager, Priya, sees Ravi in **Team Offboarding**. She accepts the resignation and confirms the LWD (60 days from today; she could negotiate an earlier/later date). Status → **Accepted**, then **Notice Period Started** as the clock begins. Ravi is now formally serving notice.

**Day 2 — Offboarding initiated (Admin/HR)**
HR (Admin) sees the accepted resignation and opens the case in **Initiate/Clearance Management**. The system auto-generates the **clearance checklist**: Handover (Manager), Asset Return + Access Revocation (IT), Dues + F&F (Finance), Exit Interview + Documents (HR). Status → **Clearance In Progress**.

**Day 3 – Day 45 — Serving notice (Phase A)**
Ravi keeps working normally. Over these weeks he gradually documents his projects in **Handover / Knowledge Transfer**, assigns pending tasks, and trains a colleague. Priya watches progress in **Knowledge Transfer / Handover**. Little else happens on the checklist yet — this is normal.

**Day 50–58 — Final-week clearances (Phase A → B)**
- Ravi completes his handover notes; Priya reviews and confirms the work is fully transferred.
- Ravi fills the **Exit Interview** form.
- HR verifies items in **Clearance Management**; Finance confirms no outstanding advances.

**Day 60 — Last Working Day (Phase B)**
- Ravi returns his laptop, ID card, and accessories via **Asset Return**; HR/IT verify condition.
- **IT revokes all access at end of day** — email, VPN, GitHub, Jira, AWS, Slack. Ravi can no longer log into company systems after today.
- Priya submits **Manager Clearance** (team side fully cleared).
- HR marks the remaining clearance items done. Every checklist item is now green.

**Day 61–90 — Full & Final settlement (Phase C)**
Now that final attendance and leave balance are known, HR/Finance opens **Full & Final (F&F)** and computes:
`pending salary (up to Day 60) + leave encashment (unused paid leave) + any incentives − deductions − unrecovered advances`.
(Ravi served his full notice, so there's **no notice-shortfall recovery**.) While this is in progress the case sits at **F&F Pending**; once approved and paid into his account it is settled.

**Day 90 — Documents & closure (Phase C)**
HR issues the **Relieving Letter**, **Experience Letter**, **F&F statement**, and **Payslips** via **Exit Documents** — Ravi downloads them from his **Exit Documents** screen. His employee tax doc (Form 16) and PF exit date are updated. HR revokes everything in **Deactivate Employee Access** (email, portal, VPN, Git, Jira, Figma) and sets **rehire eligibility = Yes**. Status → **Documents Issued → Offboarded**.

**After Day 90 — Ex-Employee**
Ravi's record is now **read-only**. He appears in the Admin dashboard's "Past Exits." He retains access only to download his exit documents; everything else is closed.

---

### Two important real-world variations (so the design handles them)

1. **Termination (company-initiated):** HR uses **Initiate Offboarding** directly. There's no employee "submit" or notice period served — LWD may be immediate. Access is often revoked **the same day** for security. The rest (clearance → F&F → documents) is identical.

2. **Notice-period shortfall / early exit:** If an employee leaves before serving full notice, either the employee **buys out** the remaining days (amount is *deducted* in F&F) or the manager/HR **waives** it. The F&F screen must support both an **add-recovery** and a **waive** option.

---

## 9. Notes for the Design Phase (later)

- **Reuse what exists:** the Asset Return flow and the Employee→Manager→Admin approval pattern are already built — offboarding should plug into them, not duplicate.
- **One shared status** drives every role's view (employee tracker, manager queue, admin dashboard all read the same case status).
- Keep the **clearance checklist as the core object** — every role interacts with the same checklist from its own angle.
- **Design for the timeline (§3), not just the steps** — the employee's "My Offboarding" and the admin dashboard should show *where in the notice period* the case is (LWD countdown), because most activity clusters near LWD.
- **Access revocation is a hard gate at LWD** — surface it prominently; it must not depend on F&F being finished.
- **Clearance ordering:** the employee keeps their laptop & access through the whole notice period, so show **Asset Return + IT Access Revoked as last-day steps, locked until the Last Working Day** (never completable mid-notice); Knowledge Transfer + Manager Clearance come first.
- **Employee visibility:** an alert card on the Employee Dashboard ("Your offboarding process has started" → *View Progress*), and an **Overall Progress % bar** at the top of My Offboarding above the checklist.
- **Admin visibility:** KPI summary cards on the Offboarding Dashboard (Active · Pending Manager Approval · Pending Asset Return · Pending F&F · Completed This Month).
- **Design for role-split extensibility (see §2 confirmed decision):** v1 is single-Admin, but tag every clearance item with an `owner` and group Clearance Management into HR / IT / Finance sections, so Finance & System Support can become separate roles later with only a permission change — no workflow or UI rework.
- Follow the existing design system (navy `#1C2035`, gold `#F2D000`, indigo `#6366F1`, `const C = {}` inline styles, `onBack`/`onNavigate` detail pages).

---

*✅ Workflow approved. Build order confirmed: **1) Employee UI → 2) Manager UI → 3) Admin UI**, following the Employee submits → Manager approves → Admin finalises spine.*
