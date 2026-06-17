# Admin Module — Flow & Menu Reference
**Purpose:** Canonical reference for the Admin sidebar structure, menu order, and design status.  
**Last Updated:** June 12, 2026 — updated after permissions drag-and-drop, UI cleanup changes, and Leave Policy sidebar activation.

---

## Current Sidebar Order (Exactly as it Appears in the UI)

```
┌─────────────────────────────────────┐
│  [Logo] Concert IDC                 │
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
│    · All Leave Requests             │
│    · Leave Balance Overview         │
│    · Leave Policy Setup             │
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
| OPERATIONS | Leave Management | All Leave Requests | `all-leave-requests` | `AllLeaveRequestsPage` | ✅ Done |
| OPERATIONS | Leave Management | Leave Balance Overview | `leave-balance` | `LeaveBalancePage` | ✅ Done |
| OPERATIONS | Leave Management | Leave Policy Setup | `leave-policy` | `LeavePolicyPage` | ✅ Done |
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

## Page-Level Feature Notes

### Role & Access Control (`RoleAccessPage`)

Two tabs:

| Tab | Description |
|-----|-------------|
| User Assignments | Full user table with role badges (Employee / Manager / Admin). Change Role modal per row. Search + department filter. |
| Permissions Overview | Three role cards in a 3-column grid. Each card shows "Can do" and "Restricted" sections. Permission types are fully admin-editable: **add** (inline input), **edit** (inline rename), **delete** (instant), **drag-and-drop** between any card or section. Drop zones highlight on drag. Toast confirms every move. |

Permission Matrix table was removed from this page (not needed).

---

### Leave Policy Setup (`LeavePolicyPage`)

Manages org-wide leave type rules — quota, carry-forward, encashment, accrual settings per leave type. Now live in sidebar under Leave Management.

---

## Pending Menus — Not Yet Designed or Built

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

## Payroll — BA Questions (EazeWork Reference)

> **Context:** The company currently uses EazeWork for payroll. The goal is to replicate the same workflow and UI in Concert IDC. Ask the BA each question below and note the answer alongside it before design begins.

---

### A. Salary Structure

1. What salary components are currently configured in EazeWork? *(e.g., Basic, HRA, DA, Special Allowance, Conveyance, Medical, LTA — list all)*
2. Are components defined as **fixed amounts** or **percentages of CTC / Basic**? Which ones are percentage-based and what is the base they derive from?
3. Is there more than one salary structure template? *(e.g., different structures for different grades, departments, or employment types — full-time vs contract)*
4. Are there any **employer-side contributions** shown on the salary structure? *(e.g., Employer PF, Employer ESI, Gratuity)*
5. What deductions appear in the salary structure? *(e.g., Employee PF, Employee ESI, Professional Tax, Income Tax / TDS, Advance recovery)*
6. Who has permission to create or edit a salary structure — only Admin, or also HR Manager?
7. When a new employee is added, is a salary structure assigned to them immediately during onboarding, or separately afterwards?
8. Can an individual employee's salary be overridden from the standard structure, or does everyone follow the template?

---

### B. Payroll Run (Monthly Processing)

9. What is the **payroll cycle**? *(Monthly? What is the pay period — e.g., 1st to last day of month, or 26th to 25th?)*
10. What is the **payroll cutoff date** — by what date must attendance, leave, and timesheet data be locked before payroll is processed?
11. Who triggers the payroll run — only the Admin, or a Payroll Manager role?
12. Does EazeWork show a **pre-run checklist or summary** before the admin finalises payroll? *(e.g., "5 employees have pending leaves not approved — proceed?")*
13. Is there a **draft / review step** before payroll is finalised, where the admin can see computed payslips and make corrections?
14. What happens to an employee who **joined mid-month**? Is pay prorated? How is it calculated — calendar days or working days?
15. What happens when an employee **resigns or is terminated mid-month**? Full month pay, or prorated? Any final settlement shown separately?
16. How is **Loss of Pay (LOP)** calculated — is it automatic from unapproved leave, or does the admin enter it manually?
17. Can the admin **add one-time payments** in a payroll run? *(e.g., bonus, incentive, arrears, reimbursements)* If yes, are these taxable?
18. Can the admin **add one-time deductions** in a payroll run? *(e.g., salary advance recovery, loan EMI)*
19. Once payroll is **finalised / locked**, can it be revised or unlocked? If yes, who can do it and what is the process?
20. Does the system support **payroll for multiple pay groups** in the same month? *(e.g., running payroll for one department first, then another)*

---

### C. Attendance & Leave Integration

21. How does **unapproved or absent attendance** feed into payroll? Is it automatic or does the admin review it manually before the run?
22. Does **LOP from leave** automatically reduce pay, or does the admin confirm each LOP entry before processing?
23. Are **timesheet hours** used for payroll calculation (e.g., for hourly/contract employees), or is payroll only salary-based for all employees?
24. Is there a **lock date for leave and attendance** — after which no further changes are allowed for that pay period?
25. What happens if an employee's leave status changes **after** payroll is already run for that month — is there a reversal or adjustment in the next cycle?

---

### D. Tax & Statutory Deductions

26. Which **statutory deductions** are currently active? *(PF, ESI, Professional Tax, Income Tax / TDS — confirm which apply)*
27. For **PF**: Is it calculated on Basic only, or on a different base? Is the 12% employee + 12% employer split standard, or customised?
28. For **ESI**: What is the gross salary eligibility threshold? Is this calculated monthly?
29. For **Professional Tax**: Is it configured slab-wise per state, or a fixed amount? Which state(s) apply?
30. For **TDS / Income Tax**: Does EazeWork compute TDS automatically based on declared investments, or does the admin enter a monthly TDS amount manually per employee?
31. Does the system support both **Old Tax Regime** and **New Tax Regime** for employees who have a choice?
32. Are employees required to submit **investment declarations (Form 12BB)** via the system? If yes, does the admin review and approve them?
33. Are there any **perquisites or reimbursements** that are partially taxable? *(e.g., company car, rent reimbursement)* If yes, how are these handled?

---

### E. Payslip

34. What **information appears on a payslip**? *(Please share a sample or screenshot from EazeWork — this is the most important reference for design)*
35. Does the payslip show **employer contributions** (PF, ESI) separately, or only employee-side deductions?
36. Is the payslip **password-protected** when downloaded as PDF? If yes, what is the password format?
37. How are payslips **distributed** — emailed automatically, or employees download from the portal, or both?
38. Are payslips generated in any **language other than English**?
39. Can an admin **re-generate or re-send** a payslip after it has been issued? *(e.g., if an error was found)*
40. How many **months of payslip history** should be accessible — last 12 months, or all-time?

---

### F. Approvals & Roles

41. Is there a **payroll approval workflow** in EazeWork — e.g., Admin prepares, Finance Head approves, then it is released?
42. Who can **view payroll data** — only Admin, or can a Finance role or HR Manager also access it?
43. Can a Manager see **salary details of their team members**, or is pay data restricted to Admin only?

---

### G. Payroll Report

44. What **payroll reports** does the admin currently use in EazeWork? *(e.g., monthly payroll summary, department-wise cost, deduction summary, PF/ESI challan report, TDS report — list all)*
45. Are any reports **submitted to government portals**? *(e.g., EPF ECR, ESIC, TDS return)* If yes, should the system generate the file in the required format?
46. Does the admin need a **bank transfer file / disbursement file** exported from the system to upload to the bank for salary credit?
47. What **file formats** are needed for exports — Excel, CSV, PDF, or a specific bank format?

---

### H. Edge Cases & Settings

48. How are **salary revisions** handled mid-year — is there an arrears calculation, and how is it shown on the payslip?
49. Are there **loans or salary advances** tracked in the system? If yes, how is the recovery EMI configured and deducted?
50. Does the system need to handle **multiple pay frequencies**? *(monthly only, or also weekly/fortnightly for certain employee types)*
51. Is **full and final settlement (F&F)** processed inside the payroll module, or is it a separate flow?
52. Are **contractor / freelancer payments** handled through the same payroll module, or separately?

---

### I. Migration & Go-Live

53. How many **months of historical payroll data** from EazeWork need to be imported or visible in Concert IDC?
54. Will EazeWork and Concert IDC **run in parallel** for a period, or is it a hard cutover on a specific date?
55. Are there any **EazeWork-specific features** the admin or HR team relies on heavily that must not be missing at go-live?

---

> **Action:** Share this list with BA. For question 34 in particular, request a sample payslip — that single reference will drive the entire payslip layout design. Screenshot or PDF of the EazeWork payroll run screen and the salary structure screen are also very helpful.

---

### 2. Payroll Report
**Belongs to:** Reports & Analytics  
**Route ID (planned):** `payroll-report`  
**Priority:** Medium — dependent on Payroll Management being built first

**Purpose:**  
Monthly payroll summary showing total disbursed amount, department-wise cost breakdown, deductions summary, and cost-per-headcount trends over time.

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
| Jun 12, 2026 | Role & Access Control — Permissions Overview tab: add / edit / delete / drag-and-drop permission types between role cards |
| Jun 12, 2026 | Permission Matrix table removed from Permissions Overview tab |
| Jun 12, 2026 | Leave Policy Setup activated in sidebar under Leave Management |
| Jun 12, 2026 | LeavePolicyPage: removed unused ChevronDown / ChevronUp imports (TS6133 build fix) |
| Jun 12, 2026 | Employee Leave Approval Status: removed status filter dropdown from filter bar |
| Jun 12, 2026 | Employee Leave Approval Status: removed "Showing X of Y + status badges" footer bar |
| Jun 12, 2026 | Manager Team Timesheets: removed Approved / Pending / Returned count stats from bottom bar |
| Jun 12, 2026 | Manager Team Leave Requests: removed Approved / Pending / Rejected count stats from bottom bar |
| Jun 5, 2026 | Timesheet Policies designed and added as 3rd child under Timesheet Management |
| Jun 5, 2026 | Audit Trail designed as timeline UI, added under Reports & Analytics |
| Jun 5, 2026 | Leave Calendar removed from plan — not required |
| Jun 5, 2026 | Role & Access Control promoted to sidebar (was internal-only) |
| Jun 5, 2026 | Pending Approvals added under Timesheet Management |
| Jun 5, 2026 | Tickets added as standalone menu in OPERATIONS |
| Jun 5, 2026 | All Timesheets moved to Reports & Analytics, relabelled Timesheet Report |
| Jun 5, 2026 | Department Management renamed to Department (BA scope decision) |
| Jun 5, 2026 | Designation added as separate module under Projects & Departments |
| Jun 1, 2026 | Initial documentation of implemented Admin menus |

---

> **Removed from original plan (intentional):**  
> - `Leave Calendar` — not required per product decision.  
> - `Email Notifications` — removed from System Settings; notification config will be handled differently. (`EmailNotificationsPage.tsx` exists in `/settings/` but is not routed or shown in sidebar.)  
> - `System Announcements` — replaced and redesigned as `Announcements` under System Settings.
