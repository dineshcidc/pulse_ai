# HR-Initiated Offboarding — UI/UX Flow

> A **second way in** to the same offboarding machinery. Instead of the employee raising the request, **HR raises it** — for performance, business, or other involuntary reasons.
>
> **The golden rule:** HR only *starts* the case. Everything after is the **existing flow, unchanged** — the request still goes to the **CTO (Delivery Head)** for approval and notice period, then **Manager / IT / Finance** clear in parallel, then **HR closes** via the 5-tab Case Cockpit.

So this is **not a new pipeline** — it is **one new HR-side entry screen** that feeds cases into the pipeline we already built.

---

## What actually changes

| | Employee-Initiated (existing) | HR-Initiated (new) |
|---|---|---|
| **Who raises it** | The employee | **HR** |
| **Where** | Employee `Offboarding Request` | New HR menu `Initiate Offboarding` |
| **Reason** | Employee's own reason to leave | **HR's reason** (performance / business / etc.) |
| **Last Working Day** | Employee proposes an intended date | **HR does NOT set a date** — CTO decides it |
| **Count** | Always one (self) | **One employee OR many (bulk)** |
| **Employee can Withdraw?** | Yes (before approval) | **No** — the employee did not raise it |
| **Downstream (CTO → clearances → HR closure)** | — | **Identical, reused as-is** |

Every created case carries an **`Initiated by: HR`** marker so the CTO and HR cockpit can tell the two origins apart. Otherwise the case behaves exactly like an employee-raised one.

---

## New HR menu

The HR sidebar section gains a **second menu** (alongside the existing `Offboarding Cases`):

```
HR
 ├─ Initiate Offboarding   ← NEW  (raise individual / bulk requests)
 └─ Offboarding Cases             (existing table → Case Cockpit)
```

Both the individual and bulk paths live inside the **one** `Initiate Offboarding` screen, switched by a mode toggle at the top.

---

# PHASE — HR INITIATES

**Menu:** `Initiate Offboarding`

One screen, two modes — **Individual** and **Bulk** — chosen by a toggle at the very top. The form below the toggle adapts to the mode.

---

## 🟦 Screen HI-1 — Initiate Offboarding (Individual)

The default mode. HR raises an offboarding for **one** employee.

**What HR sees, top to bottom:**
1. **Mode toggle** — `Individual` · `Bulk` (Individual selected).
2. **Employee picker** — a searchable select (by name / code / department). Picking one shows a small **identity chip** (avatar, name, code, designation, department, reporting manager) so HR confirms it's the right person.
3. **Offboarding details form:**
   - **Reason for Offboarding** (required) — dropdown of *involuntary* reasons (see field list below).
   - **Priority / Urgency** (required) — `Normal` · `High` · `Urgent`. This is how HR signals *"serious case — remove soon"*; the CTO sees it when setting the date.
   - **Detailed Reason / Justification** (required) — free-text notes for the CTO and the record.
   - *(No Last Working Day field — the CTO sets that on approval.)*
4. **Submit** → confirmation modal → success.

➡️ On submit, **one offboarding case** is created at stage **Pending CTO Approval** and appears in `Offboarding Cases` + the CTO's `Offboarding Approvals` queue.

---

## 🟩 Screen HI-2 — Initiate Offboarding (Bulk)

Same screen, **Bulk** mode. HR raises offboarding for **several** employees at once.

**What HR sees, top to bottom:**
1. **Mode toggle** — `Bulk` selected.
2. **Multi-select employee list** — a searchable roster with **checkboxes**; HR ticks everyone to include. A running count shows *"5 employees selected."* Already-offboarding employees are shown **disabled** with an *"Already in offboarding"* note so they can't be double-added.
3. **Shared details (applies to all)** — one common **Reason**, **Priority**, and **Notes** entered once for the whole batch.
4. **Per-employee override list** — the selected employees appear as **editable rows**. Each row inherits the shared details but can be **individually adjusted** (e.g., a different reason or priority for one person) or **removed** from the batch. Rows default to the shared values, so HR only touches the exceptions.
5. **Review summary** — *"You are about to offboard 5 employees"* with the per-person reason/priority visible for a final check.
6. **Submit** → confirmation modal (states the count) → success.

➡️ On submit, **one case per employee** is created — all at **Pending CTO Approval**, all tagged `Initiated by: HR`, each independent from then on (the CTO approves each on its own).

---

## Required fields & information

**Per request (individual, or shared across a bulk batch):**

| Field | Required | Notes |
|---|---|---|
| **Employee(s)** | ✅ | One (individual) or many (bulk), chosen from the employee roster. |
| **Reason for Offboarding** | ✅ | Involuntary taxonomy — e.g. *Performance*, *Business / Restructuring*, *Redundancy*, *Policy Violation / Misconduct*, *Attendance / Availability*, *Contract End*, *Other*. |
| **Priority / Urgency** | ✅ | `Normal` · `High` · `Urgent` — flags how quickly HR needs the exit. |
| **Detailed Reason / Justification** | ✅ | Free-text; visible to the CTO and stored on the case. |
| **Last Working Day** | ❌ | **Not entered by HR** — decided by the CTO on approval. |

**Bulk only:**
- **Per-employee override** of Reason / Priority / Notes (each row defaults to the shared values).
- **Remove-from-batch** control per row.
- **Batch count** and review summary before submit.

---

## Request creation & submission steps

```
Open  →  Initiate Offboarding
  │
  ├─ INDIVIDUAL
  │    pick 1 employee → fill reason + priority + notes
  │        → Submit → Confirm modal → creates 1 case
  │
  └─ BULK
       select N employees → set shared reason/priority/notes
         → adjust per-employee rows (optional) → Review
           → Submit → Confirm modal (shows count) → creates N cases
                                        │
                                        ▼
     All created cases enter the EXISTING pipeline at:
     Submitted → Pending CTO Approval → (CTO approves + sets notice/LWD)
        → Clearance In Progress (Manager · IT · Finance) → Pending HR Closure → Completed
```

The moment a case is created it is **out of HR's "initiate" hands** and lives as a normal offboarding case — the CTO acts next, exactly as in the employee flow.

---

## Request status / state handling

**Screen-level states (the create screen itself):**
- **Empty** — no employee selected yet; Submit disabled.
- **Ready** — selection + required fields complete; Submit enabled.
- **Validation** — missing reason / priority / employees is flagged inline.
- **Submitting** — spinner on the confirm action (house pattern).
- **Success** — confirmation flash: *"Offboarding initiated for John Doe"* / *"Offboarding initiated for 5 employees"*, with a link to view them in `Offboarding Cases`.

**Case-level lifecycle (unchanged, reused):**
> `Submitted → Pending CTO Approval → Approved / Notice Started → Clearance In Progress → Pending HR Closure → Completed / Offboarded`

- HR-initiated cases start at **Pending CTO Approval**, same as employee-initiated after submit.
- The only origin difference is the **`Initiated by: HR`** tag surfaced on the case (CTO queue row + Case Cockpit header).
- **No Withdraw** state for the employee (they didn't raise it). If a case must be stopped it's handled through the normal case controls, not an employee action.

---

## Additional UI/UX to consider

- **New sidebar menu** under HR: `Initiate Offboarding` (icon: user-plus / user-x style).
- **Mode toggle** component — `Individual` · `Bulk` (same pill-toggle language used elsewhere).
- **Employee roster / picker** — a *new data need*: a list of **active employees** to choose from (search by name, code, department), distinct from the existing "already offboarding" lists. Individual = single-select chip; Bulk = multi-select checkbox list with a selected-count.
- **Dedupe guard** — employees already in an active offboarding case are shown disabled ("Already in offboarding") so they can't be re-initiated.
- **Priority chips** — `Normal / High / Urgent` with clear colour weighting (Urgent = red accent) so severity reads at a glance and carries into the CTO view.
- **Per-employee override table** (bulk) — editable rows defaulting to shared values, with remove control.
- **Confirmation modal + success flash** — reuse the house confirm-modal (summary + spinner) and success-flash patterns; bulk modal states the count.
- **`Initiated by: HR` badge** — a small origin tag to add on the CTO approval row and the HR Case Cockpit header (so both origins are distinguishable). *(Minor touch-point in existing screens.)*
- **Prototype/demo aid** — a `Demo · Prototype` switcher (as on other module screens) to walk **Individual · Bulk · Success** states without a backend.
- **Design system** — same as the module: navy `#1C2035`, indigo `#6366F1` accent, DM Sans, floating header icon card, white cards, sticky action panel, confirm modal → spinner → success flash. Fixed demo date `TODAY = 2026-08-05`, existing mock employees as the roster.

---

*This document is the UI/UX reference for the HR-Initiated Offboarding addition. It layers a single new HR entry point (individual + bulk) on top of the existing, unchanged CTO → clearances → HR-closure pipeline. Confirm, then design: **HI-1 Individual first, HI-2 Bulk second.***
