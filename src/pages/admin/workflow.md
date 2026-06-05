# Admin Workflow — Current Implementation
**Role:** IT Organization System Administrator  
**Purpose:** Operational control over users, policies, and system configuration.  
**Note:** Admin UI is strictly operational — no employee-style sections (no personal timesheets, no personal leave, no personal payroll).  
**Last Updated:** June 5, 2026 — reflects all menus live in the UI after the latest round of changes.

---

## What Changed Since June 1, 2026

| Change | Detail |
|--------|--------|
| Role & Access Control | Promoted from hidden/internal to full sidebar entry under User Management |
| Pending Approvals | New sub-menu added under Timesheet Management (approval workflow from Project Managers) |
| Tickets | New standalone menu added to OPERATIONS section |
| All Timesheets | Moved out of Timesheet Management → now "Timesheet Report" under Reports & Analytics |
| Department Management | Renamed to **Department** (scope limited to departments only per BA feedback) |
| Designation | New standalone sub-menu added under Projects & Departments; manages employee designations separately from departments |
| Leave Policy | Page + route built (`LeavePolicyPage`) but **not yet added to the sidebar** |

---

## Sidebar Menu Structure (Current — as implemented)

### 1. Dashboard
**Section:** (top-level, no section header)  
**Route ID:** `admin-dashboard`  
**Page:** `AdminDashboardPage`  
**Status:** ✅ Done

| Widget | Content |
|--------|---------|
| Total Employees | Count of all active users |
| Role Breakdown | Employee / Manager / Admin counts |
| Pending Actions | Leave requests awaiting approval, timesheets pending review |
| Recent Activity | Latest user additions, policy changes, system events |
| Quick Stats | Active projects count, departments count |

---

### 2. User Management
**Section:** (top-level, no section header)  
**Route ID:** `user-management`  
**Status:** ✅ Done

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| All Users | `all-users` | `AllUsersPage` | ✅ Done |
| Add Employee | `add-employee` | `AddEmployeePage` | ✅ Done |
| Role & Access Control | `role-access` | `RoleAccessPage` | ✅ Done |

---

### 3. Leave Management
**Section:** OPERATIONS  
**Route ID:** `admin-leave`  
**Status:** ✅ Done (sidebar). ⚠️ Leave Policy page is built but not yet exposed in sidebar.

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| All Leave Requests | `all-leave-requests` | `AllLeaveRequestsPage` | ✅ Done |
| Leave Balance Overview | `leave-balance` | `LeaveBalancePage` | ✅ Done |

> **Note:** `LeavePolicyPage` is built and routed at `leave-policy` but is not yet added as a sidebar child. Needs to be added under Leave Management.

---

### 4. Timesheet Management
**Section:** OPERATIONS  
**Route ID:** `admin-timesheet`  
**Status:** ✅ Done

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| Pending Timesheets | `pending-timesheets` | `PendingTimesheetsPage` | ✅ Done |
| Pending Approvals | `pending-approvals` | `PendingApprovalsPage` | ✅ Done |

> **Note:** "All Timesheets" has been moved to Reports & Analytics and relabelled "Timesheet Report".

---

### 5. Tickets
**Section:** OPERATIONS  
**Route ID:** `admin-tickets`  
**Page:** `AdminTicketsPage`  
**Status:** ✅ Done

---

### 6. Projects & Departments
**Section:** ORGANIZATION  
**Route ID:** `dept-projects`  
**Status:** ✅ Done

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| Projects | `project-setup` | `AdminProjectsPage` | ✅ Done |
| Department | `department-management` | `DepartmentManagementPage` | ✅ Done |
| Designation | `designation` | `DesignationPage` | ✅ Done |

> **BA decision:** Department module manages departments only (name, description, head, headcount). Designation is a separate module managing employee job titles and badges. The two are no longer mixed.

---

### 7. Org Structure
**Section:** ORGANIZATION  
**Route ID:** `admin-org`  
**Page:** `AdminOrgStructurePage`  
**Status:** ✅ Done

---

### 8. Reports & Analytics
**Section:** INSIGHTS  
**Route ID:** `admin-reports`  
**Status:** ✅ Done

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| Attendance Report | `attendance-report` | `AttendanceReportPage` | ✅ Done |
| Leave Report | `leave-report` | `LeaveReportPage` | ✅ Done |
| Timesheet Report | `all-timesheets` | `AllTimesheetsPage` | ✅ Done |

---

### 9. System Settings
**Section:** SYSTEM  
**Route ID:** `system-settings`  
**Status:** ✅ Done

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| Organization Profile | `org-profile` | `OrgProfileWrapperPage` | ✅ Done |
| Working Hours & Holidays | `working-hours` | `WorkingHoursPage` | ✅ Done |
| Announcements | `announcements` | `AdminAnnouncementsPage` | ✅ Done |

---

## Implemented Summary

| # | Sidebar Menu | Section | Sub-menus | Status |
|---|-------------|---------|-----------|--------|
| 1 | Dashboard | — | — | ✅ Done |
| 2 | User Management | — | All Users, Add Employee, Role & Access Control | ✅ Done |
| 3 | Leave Management | OPERATIONS | All Leave Requests, Leave Balance Overview | ✅ Done |
| 4 | Timesheet Management | OPERATIONS | Pending Timesheets, Pending Approvals | ✅ Done |
| 5 | Tickets | OPERATIONS | — | ✅ Done |
| 6 | Projects & Departments | ORGANIZATION | Projects, Department, Designation | ✅ Done |
| 7 | Org Structure | ORGANIZATION | — | ✅ Done |
| 8 | Reports & Analytics | INSIGHTS | Attendance Report, Leave Report, Timesheet Report | ✅ Done |
| 9 | System Settings | SYSTEM | Organization Profile, Working Hours & Holidays, Announcements | ✅ Done |

---

## Pending — Built but Not Exposed in Sidebar

| Menu | Route ID | Page | Note |
|------|----------|------|------|
| Leave Policy Setup | `leave-policy` | `LeavePolicyPage` | Page + route complete; needs sidebar entry under Leave Management |

---

> See `admin-flow.md` for the exact sidebar ASCII diagram and the full list of menus still to be designed and built.
