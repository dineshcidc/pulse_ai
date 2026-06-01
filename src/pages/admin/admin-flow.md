# Admin Module — Flow & Menu Reference
**Purpose:** Canonical reference for the Admin sidebar structure, menu order, and design status.  
**Last Updated:** June 1, 2026

---

## Current Sidebar Order (Exactly as it Appears in the UI)

```
┌─────────────────────────────────────┐
│  [Logo] Pulse.AI                    │
├─────────────────────────────────────┤
│  Dashboard                          │
│                                     │
│  User Management           ▾        │
│    · All Users                      │
│    · Add Employee                   │
│                                     │
│  ── OPERATIONS ──                   │
│                                     │
│  Leave Management          ▾        │
│    · All Leave Requests             │
│    · Leave Balance Overview         │
│                                     │
│  Timesheet Management      ▾        │
│    · All Timesheets                 │
│    · Pending Timesheets             │
│                                     │
│  ── ORGANIZATION ──                 │
│                                     │
│  Projects & Departments    ▾        │
│    · Projects                       │
│    · Department Management         │
│                                     │
│  Org Structure                      │
│                                     │
│  ── INSIGHTS ──                     │
│                                     │
│  Reports & Analytics       ▾        │
│    · Attendance Report              │
│    · Leave Report                   │
│                                     │
│  ── SYSTEM ──                       │
│                                     │
│  System Settings           ▾        │
│    · Organization Profile           │
│    · Working Hours & Holidays       │
│    · Announcements                  │
├─────────────────────────────────────┤
│  Logout                             │
└─────────────────────────────────────┘
```

---

## Implemented Menus — Detail

| Section | Menu | Sub-menu | Route ID | Design Status |
|---------|------|----------|----------|---------------|
| — | Dashboard | — | `admin-dashboard` | ✅ Done |
| — | User Management | All Users | `all-users` | ✅ Done |
| — | User Management | Add Employee | `add-employee` | ✅ Done |
| OPERATIONS | Leave Management | All Leave Requests | `all-leave-requests` | ✅ Done |
| OPERATIONS | Leave Management | Leave Balance Overview | `leave-balance` | ✅ Done |
| OPERATIONS | Timesheet Management | All Timesheets | `all-timesheets` | ✅ Done |
| OPERATIONS | Timesheet Management | Pending Timesheets | `pending-timesheets` | ✅ Done |
| ORGANIZATION | Projects & Departments | Projects | `project-setup` | ✅ Done |
| ORGANIZATION | Projects & Departments | Department Management | `department-management` | ✅ Done |
| ORGANIZATION | Org Structure | — | `admin-org` | ✅ Done |
| INSIGHTS | Reports & Analytics | Attendance Report | `attendance-report` | ✅ Done |
| INSIGHTS | Reports & Analytics | Leave Report | `leave-report` | ✅ Done |
| SYSTEM | System Settings | Organization Profile | `org-profile` | ✅ Done |
| SYSTEM | System Settings | Working Hours & Holidays | `working-hours` | ✅ Done |
| SYSTEM | System Settings | Announcements | `announcements` | ✅ Done |

---

## Missing Menus — Not Yet Designed

The following menus were defined in the original `workflow.md` plan but have not yet been implemented in the UI. Each entry includes the menu name, its suggested sidebar placement, purpose, and why it is required.

---

### 1. Role & Access Control
**Belongs to:** User Management  
**Suggested Route ID:** `role-access`  
**Page file exists:** Yes — `src/pages/admin/users/RoleAccessPage.tsx`  

**Purpose:** Allows the admin to assign, change, or revoke role permissions for any user (Employee → Manager → Admin). Displays a role matrix showing what each role can access.

**Why it is required:**  
The page is already built but not exposed in the sidebar. Admins currently cannot reach it from the sidebar navigation — it is only accessible via internal navigation from All Users. It must be added as a third child under User Management to be discoverable.

**Recommended sidebar position:**
```
User Management          ▾
  · All Users
  · Add Employee
  · Role & Access Control   ← add here
```

---

### 2. Leave Policy Setup
**Belongs to:** Leave Management  
**Suggested Route ID:** `leave-policy`  

**Purpose:** Lets the admin define and configure leave types (Annual, Sick, Casual, etc.), set per-role entitlement limits, and configure carry-forward and lapse rules for the organization.

**Why it is required:**  
Without this, the leave system runs on hard-coded defaults. Admins need a UI to customize leave entitlements per role and adjust policies each financial year. This is a foundational configuration that affects every employee's leave balance.

**Recommended sidebar position:**
```
Leave Management         ▾
  · Leave Policy Setup      ← add here (first child)
  · All Leave Requests
  · Leave Balance Overview
```

---

### 3. Leave Calendar
**Belongs to:** Leave Management  
**Suggested Route ID:** `leave-calendar`  

**Purpose:** An org-wide calendar view that shows all approved leaves grouped by team or department. Helps admins spot overlaps, coverage gaps, and high-absence periods at a glance.

**Why it is required:**  
The All Leave Requests table is list-based and hard to scan for capacity planning. A calendar view gives a spatial overview ideal for resource and scheduling decisions. Managers already have partial visibility; the admin version spans the full organization.

**Recommended sidebar position:**
```
Leave Management         ▾
  · Leave Policy Setup
  · All Leave Requests
  · Leave Calendar          ← add here
  · Leave Balance Overview
```

---

### 4. Timesheet Policies
**Belongs to:** Timesheet Management  
**Suggested Route ID:** `timesheet-policies`  

**Purpose:** Admin-level configuration for timesheet rules — submission deadlines, maximum daily/weekly hours, overtime thresholds, and auto-rejection rules for overdue submissions.

**Why it is required:**  
Without policy configuration, the timesheet system cannot enforce org-specific rules. Admins need to set guardrails so managers and employees operate within compliant boundaries. This is a compliance and audit requirement for IT organizations.

**Recommended sidebar position:**
```
Timesheet Management     ▾
  · All Timesheets
  · Pending Timesheets
  · Timesheet Policies      ← add here
```

---

### 5. Payroll Management *(Entire section missing)*
**Section:** New section — suggest label `PAYROLL`  
**Suggested Route ID parent:** `payroll-management`  

**Purpose:** Configure salary structures and oversee the full monthly payroll processing cycle from computation to payslip distribution.

**Why it is required:**  
Payroll is a core HR function. Without it, the Admin module is incomplete as a standalone HRMS product. It connects directly to leave deductions, timesheet hours, and employee records already managed in the system.

**Sub-menus to design:**

| Sub-menu | Route ID | Purpose |
|----------|----------|---------|
| Salary Structure | `salary-structure` | Define base pay bands, allowances, and deduction templates per role/grade |
| Payroll Run | `payroll-run` | Trigger monthly payroll processing, review computed payslips before release |
| Payslip Management | `payslip-management` | View, download, or reissue payslips for any employee |
| Tax & Deductions | `tax-deductions` | Set tax slabs, PF, and insurance deduction rules at org level |

**Recommended sidebar position (new section before INSIGHTS):**
```
── PAYROLL ──
Payroll Management       ▾
  · Salary Structure
  · Payroll Run
  · Payslip Management
  · Tax & Deductions
```

---

### 6. Payroll Report
**Belongs to:** Reports & Analytics  
**Suggested Route ID:** `payroll-report`  

**Purpose:** Monthly payroll summary showing total disbursed amount, department-wise breakdown, deductions summary, and cost-per-headcount trends.

**Why it is required:**  
Finance and leadership stakeholders require payroll visibility for budget planning and compliance audits. It is a standard report in any HRMS product and pairs directly with the Payroll Management section once that is implemented.

**Recommended sidebar position:**
```
Reports & Analytics      ▾
  · Attendance Report
  · Leave Report
  · Payroll Report          ← add here
  · Timesheet Report        ← add here
  · Audit Trail             ← add here
```

---

### 7. Timesheet Report
**Belongs to:** Reports & Analytics  
**Suggested Route ID:** `timesheet-report`  

**Purpose:** Hours logged per project, per employee, and per period. Useful for billing, capacity analysis, and project cost tracking.

**Why it is required:**  
Project-based IT organizations bill clients based on hours. Managers track team hours, but only the Admin has the cross-project, cross-team view needed for org-level resource utilization and profitability reporting.

---

### 8. Audit Trail
**Belongs to:** Reports & Analytics  
**Suggested Route ID:** `audit-trail`  

**Purpose:** A tamper-evident log of all admin-level actions — user role changes, policy updates, payroll runs, leave policy edits, and system configuration changes. Each entry shows the action, who performed it, and a timestamp.

**Why it is required:**  
Audit trails are mandatory for compliance in IT and financial organizations. Without it, there is no accountability or forensic record for sensitive admin operations. It also satisfies ISO 27001 and SOC 2 audit requirements common in enterprise HRMS products.

---

## Missing Menus Summary

| # | Menu | Belongs To | Route ID | Priority |
|---|------|-----------|----------|----------|
| 1 | Role & Access Control | User Management | `role-access` | High — page already built, just needs sidebar entry |
| 2 | Leave Policy Setup | Leave Management | `leave-policy` | High — required before go-live |
| 3 | Leave Calendar | Leave Management | `leave-calendar` | Medium |
| 4 | Timesheet Policies | Timesheet Management | `timesheet-policies` | Medium |
| 5 | Payroll Management (full section) | New — PAYROLL | `payroll-management` | High |
| 6 | Payroll Report | Reports & Analytics | `payroll-report` | Medium |
| 7 | Timesheet Report | Reports & Analytics | `timesheet-report` | Medium |
| 8 | Audit Trail | Reports & Analytics | `audit-trail` | High — compliance requirement |

---

> **Removed from original plan (intentional):**  
> - `Email Notifications` — removed from System Settings; notification config will be handled differently.  
> - `System Announcements` — replaced and redesigned as `Announcements` under System Settings with a full compose, schedule, and audience-targeting UI.
