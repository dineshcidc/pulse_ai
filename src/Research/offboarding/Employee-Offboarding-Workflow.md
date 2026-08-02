# Employee Offboarding — End-to-End Workflow (FINAL)

**Document type:** UI/UX workflow (business flow only — no code, no database, no design)
**Status:** ✅ Finalized — all decisions locked. Ready to be confirmed with BA, then used as the source of truth for design.
**Scope of this document:** **Flow 1 only — employee-initiated offboarding.** (Flow 2, company-initiated, is noted at the end but not detailed yet.)

> **Purpose:** Describe the complete journey of an employee's exit — from the moment they raise the request until HR closes the case — in plain language. For every stage we answer four questions: **What happens · Who acts · What each person sees · How it moves to the next stage.**

---

## 1. The one-line summary

> An employee raises an exit request → the **Delivery Head (CTO) approves it first and sets the notice period** → only then do **Project Manager, System Admin, and Finance** each complete their clearances during the notice period → **HR watches over everything, then finishes the HR formalities and closes the case.**

Nothing moves until the CTO approves. HR is the conductor who closes at the end.

---

## 2. The people involved (6 roles)

| Role | Their one job in offboarding |
|------|------------------------------|
| **Employee** | Raises the exit request, serves the notice period, hands things over, completes the exit interview, and downloads final documents. |
| **Delivery Head (CTO)** | The **first and only approver**. Reviews the request, accepts or rejects it, and **sets the notice period** (30 / 60 / 90 days). Nothing else can start until this happens. |
| **Project Manager (PM)** | A **clearance provider**. Collects project handover, responsibilities, documents, and knowledge transfer, then submits **Project Clearance**. |
| **System Admin (IT)** | A **clearance provider**. Collects laptop, systems, ID card, software access, and accounts, then submits **IT Clearance** (asset/access on/around the last working day). |
| **Finance Manager** | A **clearance provider**. Verifies dues and settlements, processes the final payment, handles any notice-shortfall recovery or waiver, prepares finance documents, then submits **Finance Clearance**. |
| **HR** | The **monitor and closer**. Watches every department's progress from one tabbed screen, then — once all clearances are done — runs the exit interview, issues the relieving & experience letters, completes the final formalities, and **closes the offboarding**. |

> **Key change from the earlier version:** The Project Manager is **no longer the approver**. The **CTO is the approver.** The PM is now just one of three department clearances (PM, IT, Finance). The old single "Admin" login is split into **CTO, PM, System Admin, Finance, and HR** — each a distinct person with their own view.

---

## 3. One shared request, seen from six angles

There is **one offboarding request**. Every role opens the **same** request but sees it from their own angle and can only do their own part:

- The **employee** sees their progress and what they must do.
- The **CTO** sees an approval decision.
- The **PM / IT / Finance** each see *their* clearance task.
- **HR** sees *everything* — all departments in one place.

A single **status** on the request drives what everyone sees. When the status changes, every screen updates.

---

## 4. The status lifecycle (single source of truth)

```
   SUBMITTED                 (waiting for the CTO — everyone else is locked)
      │
      ├──►  REJECTED         (CTO declined → case ends)
      │
      ▼
   APPROVED / NOTICE PERIOD STARTED
      │                      (CTO set the notice period; clearances now open)
      ▼
   CLEARANCE IN PROGRESS
      │                      (PM, IT, Finance work in parallel toward LWD)
      ▼
   PENDING HR CLOSURE
      │                      (all 3 department clearances done → HR's turn)
      ▼
   COMPLETED / OFFBOARDED    (HR finished exit interview + letters → case closed)
```

**Side branches (can happen along the way):**
- **Withdrawn** — the employee cancels their own request *before the CTO has approved it*. (After approval it can no longer be self-withdrawn.)
- **On Hold** — any department can pause *its own* clearance with a reason (e.g. a pending handover), then resume once resolved. Progress is never lost.

---

## 5. The workflow, stage by stage

### STAGE 0 — Before anything: the employee raises the request

| | |
|---|---|
| **What happens** | The employee decides to leave and fills in the offboarding request form (reason for leaving, intended last day, any notes). They submit it. |
| **Who acts** | **Employee.** |
| **Employee sees** | An **Offboarding Request Form**. After submitting, the form is replaced by a **Pending page** — "Your request has been submitted and is awaiting approval." **This is all the employee can see at this stage** — no notice period, no checklist, no departments. |
| **Everyone else sees** | The request now appears in the lists of **PM, IT, Finance, and HR** — but marked **"Awaiting CTO Approval"** and **read-only / locked**. They can view it to plan ahead but **cannot act**. It also appears in the **CTO's queue** as **"Pending your approval."** *(Decision: the request is visible-but-locked to departments, not hidden — for transparency, with no risk since actions are disabled.)* |
| **Available actions** | Employee: **Submit**, or **Withdraw** while still pending. Everyone except CTO: **view only**. |
| **Moves to next stage when** | The employee submits → status becomes **Submitted** → the ball is entirely in the CTO's court. |

---

### STAGE 1 — The CTO decision (the master gate)

| | |
|---|---|
| **What happens** | The CTO reviews the request and makes the first and only approval decision. If accepting, the CTO **sets the notice period** (30 / 60 / 90 days), which fixes the **Last Working Day (LWD)**. The CTO may also approve an **early release** (a shorter notice) — any resulting shortfall is settled later by Finance. If rejecting, the case ends with a reason. |
| **Who acts** | **Delivery Head (CTO).** |
| **CTO sees** | A queue of pending requests. Opening one shows the employee's details, reason, and intended last day, with three controls: **Accept**, **Reject**, and a **Notice Period selector** (30 / 60 / 90, or a custom early-release date). |
| **Available actions** | **Accept + set notice period**, or **Reject + give a reason**. |
| **On REJECT** | Status → **Rejected**. The **employee** sees "Your request was not approved" with the CTO's reason on their pending page. All other roles see the case closed. **End of flow.** |
| **On ACCEPT** | Status → **Approved / Notice Period Started**. The notice-period clock starts. **Now — and only now — the employee's full offboarding view unlocks**, and PM / IT / Finance clearance tasks become actionable. |
| **Moves to next stage when** | The CTO accepts → the case opens up to the departments. |

> **This is the pivot of the whole process.** Before this: employee sees only a pending page, departments are locked. After this: everything opens.

---

### STAGE 2 — Notice period & department clearances (the main work)

Once the CTO approves, the notice period runs. The three department clearances become **actionable immediately**, but most real activity naturally clusters in the **final days** before the LWD. To guide this without blocking anyone:

> **Decision — timing:** Clearances are **not hard-locked** to a date window. Each department can act any time after CTO approval. The system **highlights the recommended final window** (PM: last ~10 days · IT: last ~5–10 days) and shows an **LWD countdown**, nudging each department when its window opens. This keeps early finishers and early-release cases from getting stuck.

The three departments work **independently and in parallel — there is no required order between them.**

#### 2a. Project Manager — Project Clearance

| | |
|---|---|
| **What happens** | The PM ensures the employee has handed over projects, responsibilities, documents, and knowledge transfer. When satisfied, the PM submits Project Clearance. |
| **Who acts** | **Project Manager.** |
| **PM sees** | The employee's card with notice period and LWD countdown, a **checklist of handover items** to confirm, and a remarks box. |
| **Available actions** | **Mark items complete → Submit Project Clearance**, or **Put On Hold** (with a reason) if something is still pending. |
| **Result** | PM clearance status → **Completed** (or **On Hold**). |

#### 2b. System Admin (IT) — IT Clearance

| | |
|---|---|
| **What happens** | IT collects and verifies company assets — laptop, systems, ID card — and revokes software access and accounts. |
| **Who acts** | **System Admin.** |
| **Decision — assets & access at the end** | The employee **keeps their laptop and system access throughout the notice period** (they need it to work and hand over). **Asset collection and access revocation are therefore done on/around the Last Working Day** (final 1–2 days). IT can prepare the checklist earlier but completes the physical/access items at the end. |
| **IT sees** | The employee's card, plus an **asset & access checklist** (laptop, ID card, email, VPN, tools/accounts). Access-revocation items are flagged as **last-working-day actions**. |
| **Available actions** | **Verify items → Submit IT Clearance**, or **Put On Hold**. |
| **Result** | IT clearance status → **Completed** (or **On Hold**). |

#### 2c. Finance Manager — Finance Clearance

| | |
|---|---|
| **What happens** | Finance verifies dues and settlements, processes the final payment, prepares finance documents, and sends the necessary letters to the employee. If the CTO approved an early release, Finance handles the **notice-shortfall recovery (buy-out) or waiver** here. |
| **Who acts** | **Finance Manager.** |
| **Finance sees** | The employee's card, plus a **settlement checklist** (dues cleared, recoveries, notice-shortfall buy-out/waiver if any, final payment, documents prepared), with a remarks box. |
| **Available actions** | **Complete items → Submit Finance Clearance**, or **Put On Hold**. |
| **Result** | Finance clearance status → **Completed** (or **On Hold**). |

**During this whole stage, the employee sees:** their **My Offboarding** tracker — notice period, LWD countdown, and a **live status of each department** (CTO: Approved · PM: Pending/Done · IT: Pending/Done · Finance: Pending/Done · HR: Not started). They watch progress; they act only when asked (e.g. the exit interview later).

**Moves to next stage when:** **all three** department clearances (PM + IT + Finance) are **Completed**. The status becomes **Pending HR Closure**.

---

### STAGE 3 — HR monitors throughout (the cockpit)

HR is **not** waiting idle — HR watches the entire process from the start. HR's screen is a **cockpit with one tab per department**, so HR can see at a glance who is done and who is pending.

> **Decision — HR tabs:** HR has **five tabs — CTO · Project Manager · System Admin · Finance · HR.** (System Admin is included so no clearance is off HR's radar.)

| | |
|---|---|
| **What happens** | HR tracks every department's clearance status in real time, follows up on anything On Hold, and prepares to close once all clearances are in. |
| **Who acts** | **HR** (monitoring; the actual closing actions come in Stage 4). |
| **HR sees** | The employee's offboarding request with the **five tabs** above. Each tab shows that department's status, what was submitted, remarks, and when. A summary at the top shows overall progress (e.g. "3 of 4 clearances complete"). |
| **Available actions** | View every tab; follow up on holds; HR's own closing actions stay **locked until all department clearances are Completed**. |
| **Moves to next stage when** | PM + IT + Finance are all Completed → HR's own tab unlocks for final closure. |

---

### STAGE 4 — HR final activities & closure (the finish line)

| | |
|---|---|
| **What happens** | With every department cleared, HR completes the human-side formalities: the **exit interview**, then issues the **relieving letter** and **experience letter**, finishes any remaining HR formalities, and submits the **final clearance** — which **closes the offboarding**. |
| **Who acts** | **HR**, with the **employee** participating in the exit interview. |
| **Decision — exit interview** | **The employee fills in the exit-interview form** (structured feedback: reason for leaving, experience, suggestions). **HR reviews the submitted responses and marks the exit-interview step complete.** (Employee submits → HR validates.) |
| **HR sees** | Their **HR tab**, now unlocked, with a checklist: **Exit Interview (review employee's responses) → Relieving Letter → Experience Letter → Final Formalities → Close Case.** |
| **Employee sees** | An **Exit Interview** form to complete (opened by HR), and — once HR issues them — an **Exit Documents** area to **download** the relieving letter, experience letter, and any finance documents. |
| **Available actions** | HR: review exit interview, issue letters, **Submit Final Clearance / Close Case**. Employee: **submit exit interview**, **download documents**. |
| **Moves to next stage when** | HR submits the final clearance → status becomes **Completed / Offboarded**. |

---

### STAGE 5 — Case closed (Ex-Employee)

| | |
|---|---|
| **What happens** | The offboarding is complete. The employee's record becomes read-only and moves to the "past exits" list. |
| **Everyone sees** | A closed, read-only case. The **employee** retains access only to **download their exit documents**; everything else is finished. |

---

## 6. The whole flow on one page

```
EMPLOYEE                CTO                 PM / IT / FINANCE            HR
   │                     │                        │                     │
   ▼                     │                        │                     │
[Raise request]          │                        │                     │
   │                     │                        │                     │
   ▼                     ▼                        │                     │
[Pending page] ─────► [Review request]            │                     │
                      Accept + set notice         │                     │
                      OR Reject                    │                     │
                         │  (reject → END)          │                     │
                         │ accept                   │                     │
                         ▼                          ▼                     ▼
              [Notice period starts] ───► [Each dept does its     [Monitors all
              Employee now sees the        clearance in parallel,  departments via
              full offboarding view        near the LWD → submits] 5 tabs, throughout]
                                                   │                     │
                                          all 3 clearances done          │
                                                   └─────────────────────►│
                                                                          ▼
                                                          [Exit interview + relieving
                                                           & experience letters +
                                                           final formalities → CLOSE]
                                                                          │
                                                                          ▼
                                                                  [OFFBOARDED ✓]
```

---

## 7. What each role sees across the whole journey (quick reference)

| Stage → | **Employee** | **CTO** | **PM** | **System Admin** | **Finance** | **HR** |
|---|---|---|---|---|---|---|
| **Submitted** | Pending page only | ⏳ Approve/Reject | 🔒 Locked (view) | 🔒 Locked (view) | 🔒 Locked (view) | 🔒 Locked (view) |
| **Approved** | Full view unlocks: notice, LWD, tracker | ✔ Approved | ▶ Clearance opens | ▶ Clearance opens | ▶ Clearance opens | Monitoring (5 tabs) |
| **Clearance in progress** | Watches dept statuses | ✔ Done | Submits clearance | Submits clearance | Submits clearance | Watches all tabs |
| **Pending HR closure** | Waiting on HR | ✔ | ✔ | ✔ | ✔ | ▶ HR tab unlocks |
| **HR closure** | Exit interview + downloads | ✔ | ✔ | ✔ | ✔ | Letters + close |
| **Completed** | Download documents only | ✔ | ✔ | ✔ | ✔ | ✔ Closed |

---

## 8. The rules that make the flow unambiguous

1. **The CTO is the single gate.** No department can act until the CTO approves and sets the notice period.
2. **Before approval, the employee sees only two screens:** the request form, then the pending page.
3. **Before approval, departments see the request read-only** ("Awaiting CTO Approval") — visible for planning, but no actions.
4. **After approval, everything unlocks at once** for the employee and the three departments.
5. **PM, IT, and Finance work in parallel** — no fixed order; each is independent.
6. **Clearances are not date-locked** — actionable after approval, with the recommended final window and LWD countdown highlighted.
7. **IT collects assets and revokes access on/around the Last Working Day** — the employee keeps the laptop and access through the notice period.
8. **HR monitors from the beginning** via five tabs (CTO · PM · System Admin · Finance · HR), even while its own closing actions are locked.
9. **HR can only close after all three department clearances are complete.**
10. **The exit interview is filled by the employee and reviewed/closed by HR.**
11. **A department blocker becomes an On Hold** (with a reason), not a send-back; it resumes when resolved.
12. **Early release** (short notice) is approved by the CTO; the **shortfall is recovered or waived by Finance** in the settlement.
13. **One shared status drives every screen** — change it once, and all six views update.
14. **A rejected request ends the flow;** a withdrawn request (employee, pre-approval) ends it too; an on-hold clearance pauses without losing progress.

---

## 9. Finalized decisions (previously open — now locked)

Every earlier open point is resolved. Recorded here so there is a clear rationale on file:

| Topic | Decision | Rationale |
|-------|----------|-----------|
| **System Admin tab in HR view** | **Yes** — HR has 5 tabs (CTO · PM · System Admin · Finance · HR). | No clearance should be off HR's radar. |
| **Clearance timing** | **Not hard-locked.** Actionable after CTO approval; recommended window + LWD countdown highlighted. | Early finishers and early-release cases must not get stuck. |
| **Exit interview owner** | **Employee fills the form; HR reviews and closes it.** | Standard practice — employee feedback validated by HR. |
| **Order between departments** | **Fully parallel**, no required sequence; HR closure gated on all three. | Independent domains; ordering only slows things down. |
| **Department blocker** | **On Hold with a reason**, resume when resolved (no send-back routing). | Simpler and traceable; avoids routing confusion. |
| **Assets / laptop** | **Employee keeps laptop & access through notice; IT collects/revokes on/around LWD.** | Employee needs the machine to work and hand over; security revocation belongs at the end. |
| **Notice-period shortfall** | **CTO approves early release; Finance recovers (buy-out) or waives the shortfall in settlement.** | Release authority with the approver; money logic in one place. |
| **Visibility before approval** | **Visible but read-only** to departments ("Awaiting CTO Approval"), not hidden. | Transparency and planning, with zero risk since actions are locked. |

---

## 10. Note on Flow 2 (company-initiated) — parked for now

Flow 2 is identical to Flow 1 **after the request exists**. The only difference is the start: instead of the employee filling the form, **the company (HR or CTO) raises the request** and the **employee receives a notification**. Everything from the CTO approval onward is the same. We will detail this once Flow 1 is confirmed.

---

*Finalized workflow. This is the source of truth for the Employee Offboarding UI/UX design.*
