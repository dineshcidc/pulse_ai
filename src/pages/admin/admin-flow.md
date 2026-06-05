# Admin Module — Flow & Menu Reference
**Purpose:** Canonical reference for the Admin sidebar structure, menu order, and design status.  
**Last Updated:** June 5, 2026 — updated after Timesheet Policies and Audit Trail completion.

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
│    · Role & Access Control          │
│                                     │
│  ── OPERATIONS ──                   │
│                                     │
│  Leave Management          ▾        │
│    · Leave Policy Setup             │
│    · All Leave Requests             │
│    · Leave Balance Overview         │
│                                     │
│  Timesheet Management      ▾        │
│    · Pending Timesheets             │
│    · Pending Approvals              │
│    · Timesheet Policies             │
│                                     │
│  Tickets                            │
│                                     │
│  ── ORGANIZATION ──                 │
│                                     │
│  Projects & Departments    ▾        │
│    · Projects                       │
│    · Department                     │
│    · Designation                    │
│                                     │
│  Org Structure                      │
│                                     │
│  ── INSIGHTS ──                     │
│                                     │
│  Reports & Analytics       ▾        │
│    · Attendance Report              │
│    · Leave Report                   │
│    · Timesheet Report               │
│    · Audit Trail                    │
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

| Section | Menu | Sub-menu | Route ID | Page File | Status |
|---------|------|----------|----------|-----------|--------|
| — | Dashboard | — | `admin-dashboard` | `AdminDashboardPage` | ✅ Done |
| — | User Management | All Users | `all-users` | `AllUsersPage` | ✅ Done |
| — | User Management | Add Employee | `add-employee` | `AddEmployeePage` | ✅ Done |
| — | User Management | Role & Access Control | `role-access` | `RoleAccessPage` | ✅ Done |
| OPERATIONS | Leave Management | Leave Policy Setup | `leave-policy` | `LeavePolicyPage` | ✅ Done |
| OPERATIONS | Leave Management | All Leave Requests | `all-leave-requests` | `AllLeaveRequestsPage` | ✅ Done |
| OPERATIONS | Leave Management | Leave Balance Overview | `leave-balance` | `LeaveBalancePage` | ✅ Done |
| OPERATIONS | Timesheet Management | Pending Timesheets | `pending-timesheets` | `PendingTimesheetsPage` | ✅ Done |
| OPERATIONS | Timesheet Management | Pending Approvals | `pending-approvals` | `PendingApprovalsPage` | ✅ Done |
| OPERATIONS | Timesheet Management | Timesheet Policies | `timesheet-policies` | `TimesheetPoliciesPage` | ✅ Done |
| OPERATIONS | Tickets | — | `admin-tickets` | `AdminTicketsPage` | ✅ Done |
| ORGANIZATION | Projects & Departments | Projects | `project-setup` | `AdminProjectsPage` | ✅ Done |
| ORGANIZATION | Projects & Departments | Department | `department-management` | `DepartmentManagementPage` | ✅ Done |
| ORGANIZATION | Projects & Departments | Designation | `designation` | `DesignationPage` | ✅ Done |
| ORGANIZATION | Org Structure | — | `admin-org` | `AdminOrgStructurePage` | ✅ Done |
| INSIGHTS | Reports & Analytics | Attendance Report | `attendance-report` | `AttendanceReportPage` | ✅ Done |
| INSIGHTS | Reports & Analytics | Leave Report | `leave-report` | `LeaveReportPage` | ✅ Done |
| INSIGHTS | Reports & Analytics | Timesheet Report | `all-timesheets` | `AllTimesheetsPage` | ✅ Done |
| INSIGHTS | Reports & Analytics | Audit Trail | `audit-trail` | `AuditTrailPage` | ✅ Done |
| SYSTEM | System Settings | Organization Profile | `org-profile` | `OrgProfileWrapperPage` | ✅ Done |
| SYSTEM | System Settings | Working Hours & Holidays | `working-hours` | `WorkingHoursPage` | ✅ Done |
| SYSTEM | System Settings | Announcements | `announcements` | `AdminAnnouncementsPage` | ✅ Done |

---

## Pending Menus — Not Yet Designed or Built

The following menus are required for a complete Admin module.

---

### 1. Payroll Management *(Entire section — not started)*
**Section (planned):** New section, label `PAYROLL` — insert between ORGANIZATION and INSIGHTS  
**Parent Route ID (planned):** `payroll-management`  
**Priority:** High

**Purpose:**  
Configure salary structures and oversee the full monthly payroll processing cycle from computation to payslip distribution.

**Why it is needed:**  
Payroll is a core HR function. Without it the Admin module is incomplete as a standalone HRMS product. It connects directly to leave deductions, timesheet hours, and employee records already managed in the system.

**Sub-menus to design:**

| Sub-menu | Route ID | Purpose |
|----------|----------|---------|
| Salary Structure | `salary-structure` | Define base pay bands, allowances, and deduction templates per role or grade |
| Payroll Run | `payroll-run` | Trigger monthly payroll, review computed payslips before release |
| Payslip Management | `payslip-management` | View, download, or reissue payslips for any employee |
| Tax & Deductions | `tax-deductions` | Set tax slabs, PF, ESI, and insurance deduction rules at org level |

**Recommended sidebar position (new section):**
```
── PAYROLL ──
Payroll Management       ▾
  · Salary Structure
  · Payroll Run
  · Payslip Management
  · Tax & Deductions
```

---

### 2. Payroll Report
**Belongs to:** Reports & Analytics  
**Route ID (planned):** `payroll-report`  
**Priority:** Medium — dependent on Payroll Management being built first

**Purpose:**  
Monthly payroll summary showing total disbursed amount, department-wise cost breakdown, deductions summary, and cost-per-headcount trends over time.

**Why it is needed:**  
Finance and leadership require payroll visibility for budget planning and compliance audits. It pairs directly with the Payroll Management section once that is built.

**Recommended sidebar position:**
```
Reports & Analytics      ▾
  · Attendance Report
  · Leave Report
  · Timesheet Report
  · Audit Trail
  · Payroll Report          ← here
```

---

## Pending Menus — Summary

| # | Menu | Belongs To | Route ID (planned) | Priority | Note |
|---|------|-----------|-------------------|----------|------|
| 1 | Payroll Management (full section) | New — PAYROLL | `payroll-management` | High | Entire section not started |
| 2 | Payroll Report | Reports & Analytics | `payroll-report` | Medium | Depends on Payroll Management |

---

## Change Log

| Date | Change |
|------|--------|
| Jun 5, 2026 | Timesheet Policies designed and added as 3rd child under Timesheet Management |
| Jun 5, 2026 | Audit Trail designed as timeline UI, added under Reports & Analytics |
| Jun 5, 2026 | Leave Calendar removed from plan — not required |
| Jun 5, 2026 | Role & Access Control promoted to sidebar (was internal-only) |
| Jun 5, 2026 | Pending Approvals added under Timesheet Management |
| Jun 5, 2026 | Tickets added as standalone menu in OPERATIONS |
| Jun 5, 2026 | All Timesheets moved to Reports & Analytics, relabelled Timesheet Report |
| Jun 5, 2026 | Department Management renamed to Department (BA scope decision) |
| Jun 5, 2026 | Designation added as separate module under Projects & Departments |
| Jun 5, 2026 | Leave Policy Setup enabled in sidebar under Leave Management |
| Jun 1, 2026 | Initial documentation of implemented Admin menus |

---

> **Removed from original plan (intentional):**  
> - `Leave Calendar` — not required per product decision.  
> - `Email Notifications` — removed from System Settings; notification config will be handled differently.  
> - `System Announcements` — replaced and redesigned as `Announcements` under System Settings.
