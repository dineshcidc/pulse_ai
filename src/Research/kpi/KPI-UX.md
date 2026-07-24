# Performance Appraisal (KPI) — UI/UX Page Structure

> A **designer-facing** companion to the technical `KPIWorkflow.md`.
> This file describes only **what screens exist, how they're grouped, and the purpose of each** — no code or implementation detail.
>
> **Status:** Employee ✅ built · Manager ✅ built · Admin ✅ built.
> **All three logins' menus and screens are now complete** — every screen in this spec has a real, wired, reachable implementation (no stubs). Remaining polish + spec deviations are tracked in **"Next — what's left per login"** at the bottom.

---

## The one idea that ties all three logins together

**The "Performance Sheet" is a single screen reused in three modes.**
The same criteria-table layout appears for every role, in a different state:

- **Employee →** *fills* self scores & remarks (editable) — `self` mode
- **Manager →** *adds* assessor scores/comments next to the employee's (employee side read-only) — `assessor` mode
- **Admin →** *views* it locked / read-only, then approves — `readonly` mode

Designing this sheet once, with three states, keeps the whole module consistent.
(Implemented as one component, `KPIReviewDetailsPage`, switched by a `mode` prop.)

### Shared status language (same wording & colors everywhere)
```
Employee side :  Pending → Submitted
Manager side  :  Pending → Approved            (manager submits final evaluation)
Admin side    :  Pending Approval → Approved   (+ Reopened, Closed, Archived)
Cycle level   :  Draft → Published → Closed → Archived
```
Colors: Pending → amber `#F59E0B` · In-flight/blue `#2563EB` · Approved/Closed → green `#0EA86A` · Reopened → red `#EF4444` · Archived → grey `#8B90A7`.

### The overall relay
```
Admin publishes  →  Employee self-assesses  →  Manager reviews  →  Admin finalizes
```

### Shared building blocks (reused on every screen)
- **Page header** — left: title + subtext · right: **"How Appraisal Works"** pill badge (opens the cycle-timeline + 3-stage explainer modal).
- **Review Year card** — calendar icon + "Review Year" + year dropdown ("Current" badge, loading spinner on switch).
- **List card** — white card whose header row holds a **left title** + **right filter chips** (small, light bg, colored dot + count). Table below: gradient column header, avatar faces, status chips, row action (Review button / eye view).
- **Performance Sheet** — the shared `KPIReviewDetailsPage` (Q1/Q2/Q3/Annual tabs, criteria rows expandable into Self Assessment + Assessor Feedback + Final Comments, Total footer).

---

## 👤 Employee Login — "My Performance"  ✅ BUILT

- **Placement:** a single menu item, **My Performance** (under HRMS).
- **Role:** self-service only. The employee never configures anything — they self-assess and view history. **One menu, two screens.**

| Screen | Purpose |
|--------|---------|
| **My Performance** (landing) | Header (title + subtext + *How Appraisal Works* badge) → **Review Year** card (current + past years) → a **cycle table**: `Cycle · Period · Stage · Status · Due Date/Score · Action(view)`. Current year shows Due Date + Pending/Submitted; past years show final Score + Approved, read-only. |
| **Performance Sheet** (opens from the view icon) | The employee's own KPI sheet — `self` mode. Quarter **tabs (Q1/Q2/Q3/Annual)**; criteria table `Criteria · Self Score · Assessor Score · Status · Action`. Expanding a criterion reveals **Weightage + Description**, an **editable Self Assessment (remarks + score, Save per row)**, and a read-only **Assessor Feedback**. **Save as Draft / Submit** → confirmation popup flips status **Pending → Submitted**, then the sheet is read-only. Future quarters show a *"not open yet"* state; past years are fully read-only. |

**In short:** one menu → a *landing list* and a *detail sheet*, plus the info & confirmation popups.

---

## 👥 Manager Login — "Performance Appraisal"  ✅ BUILT

Managers are **both appraised and appraisers**, so they get exactly **two menu items** — no separate history menu.

**Main menu: Performance Appraisal → two submenus**

| Submenu | Purpose |
|---------|---------|
| **My Performance** | Identical to the employee experience — the manager completes *their own* self-assessment and views their own cycle history. (Reuses the same landing + Performance Sheet in `self` mode.) |
| **Team Appraisals** | The manager's review **queue**. Same header pattern (title + *How Appraisal Works* badge) → **Review Year** card → a **list card** titled *"Appraisal Cycle January 2026 to December 2026"* with right-aligned filter chips **All / Pending / Approved**. Table: `Employee (avatar + code) · Role · Stage · Submitted On · Status · Action`. |
| → **Team Member's Performance Sheet** (opens from the queue) | The **`assessor` mode** of the shared sheet. The employee's self scores/remarks are **read-only**; the manager fills **Assessor Feedback (Remarks + Score) per criterion** (Save per row) plus overall **Final Comments**. **Save as Draft / Submit Final Evaluation** → confirmation → forwards to Admin and locks it. Breadcrumb: *Team Appraisals / {Employee} / Appraisal Cycle …*. **Pending** rows open editable; **Approved** rows open the same sheet read-only (`reviewed` mode). |

**In short:** two menus only — *My Performance* (own) and *Team Appraisals* (queue → review sheet). Past team reviews are reachable via the **Approved** filter on the same queue, so no dedicated history page is needed.

---

## 🛠️ Admin Login — "Performance Management"  ✅ BUILT

The control center — **create criteria → publish cycles → monitor (view-only)**.
Admin **builds** the KPI criteria and **publishes** cycles, and can **view** every
employee's and manager's KPI status. 

> **Scope (v1 — important):** Admin is **VIEW-ONLY** on the sheets. For now the
> admin **cannot reopen, cannot approve, and cannot add comments** on a KPI sheet
> — they only open it read-only to see where it stands. (Final approval /
> reopen / comment is out of scope for this version.)

**Main menu: Performance Management → three submenus only**
```
Performance Management
  ├─ KPI Templates          (admin CREATES criteria per role — manual + Excel upload)
  ├─ Appraisal Cycles       (admin PUBLISHES Q1/Q2/Q3/Annual — title + select people)
  └─ Submissions Tracker    (admin VIEWS everyone — project / role / manager wise)
```

### 1 · KPI Templates  *(admin is the creator)*
> *"What is each role measured on?"* — admin builds the criteria set **per role**.

Three screens: **List → View → Create/Upload**.

- **List page** — header (title + subtext) + list card **"KPI Templates"** with
  filter chips **All / Active / Draft**. Table:
  `Role · Template Name · #Criteria · Total Weightage · Status · Last Updated · Action(view / edit)`.
  Top-right two buttons: **"+ Create Template"** and **"Upload Excel"**.
- **View page** — read-only sheet for one role's template: the role it applies to,
  and the criteria table `# · Criteria Title · Description · Weightage · Max Score`,
  with a **Total Weightage** footer. (Opened from the view action.)
- **Create / Upload page** —
  - **Manual create:** select the **Role**, then add **criteria rows** — each with
    **Title · Description · Weightage (points/%) · Max Score** (rating scale, e.g.
    5-Strong / 3-Basic / 1-None). Live **Total Weightage** indicator. Save as
    **Draft** or **Active**.
  - **Excel upload (role-based):** choose the **Role**, download the **template
    format**, upload the filled **.xlsx**; show a **preview table** of parsed
    criteria before **Confirm & Save**. One upload = one role's criteria set.

### 2 · Appraisal Cycles  *(admin publishes)*
> *"Open a review for the right people."*

- **List page** — header + list card **"Appraisal Cycles"** with chips
  **All / Published / Draft**. Table:
  `Cycle Title · Period (Q1/Q2/Q3/Annual) · Year · Assigned People/Roles · Published On · Status · Action(view)`.
  Top-right **"+ Publish Appraisal"** button.
- **Create / Publish page** —
  - Enter the **Title** (e.g. *"Q1 2026 Appraisal"*), pick the **Period**
    (Q1/Q2/Q3/Annual) and **Year**, set the **Due Date**.
  - **Select people** — by **Role**, by **Project**, by **Manager**, or individual
    employees (multi-select list with search + checkboxes; "select all in role").
  - **Publish** → confirmation modal → the selected people receive the KPI form
    (their appraisal appears in Employee → My Performance and, once submitted, in
    Manager → Team Appraisals).

### 3 · Submissions Tracker  *(admin views only)*
> *"Where is everyone right now?"* — the org-wide monitoring dashboard.

- **List page** — header + list card **"Submission Status"** with a **cycle
  selector** and **grouping / filter controls**:
  **Project-wise · Role-wise · Manager-wise**, plus status filter chips
  (e.g. **All / Pending / Submitted / Approved**).
- Table: `Employee (avatar + code) · Role · Project · Manager · Stage/Status · Last Update · Action(view)`.
  Manager rows expand to show their **team members' submitted status** underneath
  (manager-wise grouping).
- **View** opens the shared Performance Sheet in **read-only** (`reviewed` mode) —
  admin sees the self + assessor columns but **cannot edit, comment, or act**.

---

## Quick mental model

- **Employee** = *fill & view* → **1 menu** (My Performance): landing + sheet.
- **Manager** = *fill own + review team* → **2 menus** (My Performance, Team Appraisals): own sheet + team queue → review sheet. History = the *Approved* filter.
- **Admin** = *create criteria → publish cycle → view everyone* → **3 menus** under Performance Management. **View-only** on sheets (no reopen / approve / comment in v1).

---

## Screen inventory at a glance

| Role | Menu | Screens | State |
|------|------|---------|-------|
| Employee | **My Performance** (in HRMS) | Landing · Performance Sheet (`self`) | ✅ Built |
| Manager | **Performance Appraisal** | My Performance (own) · Team Appraisals (queue) → Team Performance Sheet (`assessor` / `reviewed`) | ✅ Built |
| Admin | **Performance Management** | KPI Templates (List · View · Create/Upload) · Appraisal Cycles (List · Publish) · Submissions Tracker (List → read-only view) | ✅ Built |

---

## Admin build order (suggested)  ✅ DONE

1. **KPI Templates** — List → Create/Upload → View (foundation everything depends on). ✅
2. **Appraisal Cycles** — List → Publish (title + select people by role/project/manager). ✅
3. **Submissions Tracker** — grouped read-only monitoring (reuses Performance Sheet in `reviewed`). ✅

---

## Next — what's left per login

> **UI status: the Performance module is fully built for all three logins.** Every screen
> in this spec exists as a real, wired, reachable page — nothing is a stub or "coming soon".
> The items below are **polish + small spec deviations to close next**, not missing screens.
> (Grouped per login so we can pick up cleanly next session.)

### 👤 Employee — Next
- [ ] **Lock the sheet after Submit.** Once a current-year cycle flips **Pending → Submitted**,
      re-opening it should open **read-only**, not editable. Today it still re-opens in `self`
      (editable) mode — the row status changes but the sheet doesn't lock.
      *(Same fix flows to the Manager's own "My Performance", which reuses this page.)*
- [ ] **Persist Save as Draft / Submit** (currently returns to the list without retaining
      entered scores/remarks — fine for the UI demo, needed once wired to data).

### 👥 Manager — Next
- [ ] **No screen gaps** — both menus (My Performance, Team Appraisals), the `assessor`
      review flow, Final Comments, and the Approved-filter read-only view are all complete.
- [ ] Inherits the **Employee "lock after Submit"** fix on the shared *My Performance* sheet.
- [ ] Persist assessor scores / Final Comments (same data-wiring note as Employee).

### 🛠️ Admin — Next  *(all screens built; these are spec deviations to reconcile)*
- [ ] **Manual "Create Template" flow.** Today a *new* template (new role) is **Excel-only** —
      "Add KPI" just picks a role then uploads. The spec's manual builder (select Role → add
      criteria rows with **Title · Description · Weightage · Max Score**, live **Total Weightage**,
      Save as Draft/Active) doesn't exist as its own flow. *(Manual add/edit/delete of a single
      criterion already exists, but only inside an existing template's detail page.)*
- [ ] **Add the Max Score / rating-scale field** (e.g. 5-Strong / 3-Basic / 1-None) to the
      manual criterion editor — currently absent.
- [ ] **Align the Templates list to spec:** it uses a *Designation + Year* selector today;
      spec wants **All / Active / Draft** status chips and the columns
      *Template Name · #Criteria · Total Weightage · Status · Last Updated*.
- [ ] **Remove dead menu labels.** `PAGE_LABELS` still lists
      `admin-kpi-template-create / upload / view` with no matching route (sub-pages render
      inline via state, so these fall through to `ComingSoon` if ever hit). Clean them up.

### 🔜 Cross-login — future scope (deliberately out of v1)
- [ ] **Admin approve / reopen / comment on sheets.** Per the v1 scope note above, Admin is
      **view-only** on the Performance Sheet for now. Final approval, reopen, and admin comments
      are the next milestone once view-only is signed off.
