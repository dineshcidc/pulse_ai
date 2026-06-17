# Admin Workflow — Current Implementation
**Role:** IT Organization System Administrator  
**Purpose:** Operational control over users, policies, and system configuration.  
**Note:** Admin UI is strictly operational — no employee-style sections (no personal timesheets, no personal leave, no personal payroll).  
**Last Updated:** June 12, 2026 — reflects all menus and UI changes live in the UI.

---

## What Changed Since June 5, 2026

| Change | Detail |
|--------|--------|
| Role & Access Control — Permissions Overview | Added second tab "Permissions Overview" with 3 role cards (Employee / Manager / Admin). Permission types are fully admin-editable: add, inline-edit, delete, and drag-and-drop between cards and sections (Can do ↔ Restricted). Permission Matrix table removed. |
| Leave Policy Setup | Now live in the sidebar under Leave Management (was previously built but unexposed). "Pending" note removed. |
| Leave Approval Status (Employee) | Status filter dropdown removed from filter bar. "Showing X of Y + status badges" footer removed. |
| Team Timesheets (Manager) | Status count stats (Approved / Pending / Returned) removed from bottom bar. |
| Team Leave Requests (Manager) | Status count stats (Approved / Pending / Rejected) removed from bottom bar. |
| LeavePolicyPage build fix | Removed unused `ChevronDown` / `ChevronUp` imports that caused TS6133 build failure. |

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
| Leave Policy Setup | Page + route built and added to sidebar under Leave Management |

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

**Role & Access Control — current tab structure:**

| Tab | Content |
|-----|---------|
| User Assignments | Table of all users with role badges; Change Role modal per user |
| Permissions Overview | 3 role cards (Employee / Manager / Admin). Each card has "Can do" and "Restricted" sections with fully editable permission types — add, edit, delete, drag-and-drop between cards and sections |

---

### 3. Leave Management
**Section:** OPERATIONS  
**Route ID:** `admin-leave`  
**Status:** ✅ Done

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| All Leave Requests | `all-leave-requests` | `AllLeaveRequestsPage` | ✅ Done |
| Leave Balance Overview | `leave-balance` | `LeaveBalancePage` | ✅ Done |
| Leave Policy Setup | `leave-policy` | `LeavePolicyPage` | ✅ Done |

---

### 4. Timesheet Management
**Section:** OPERATIONS  
**Route ID:** `admin-timesheet`  
**Status:** ✅ Done

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| Pending Timesheets | `pending-timesheets` | `PendingTimesheetsPage` | ✅ Done |
| Pending Approvals | `pending-approvals` | `PendingApprovalsPage` | ✅ Done |
| Timesheet Policies | `timesheet-policies` | `TimesheetPoliciesPage` | ✅ Done |

> **Note:** "All Timesheets" was moved to Reports & Analytics and relabelled "Timesheet Report".

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

> **BA decision:** Department module manages departments only (name, description, head, headcount). Designation is a separate module managing employee job titles and badges.

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
| Audit Trail | `audit-trail` | `AuditTrailPage` | ✅ Done |

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
| 3 | Leave Management | OPERATIONS | All Leave Requests, Leave Balance Overview, Leave Policy Setup | ✅ Done |
| 4 | Timesheet Management | OPERATIONS | Pending Timesheets, Pending Approvals, Timesheet Policies | ✅ Done |
| 5 | Tickets | OPERATIONS | — | ✅ Done |
| 6 | Projects & Departments | ORGANIZATION | Projects, Department, Designation | ✅ Done |
| 7 | Org Structure | ORGANIZATION | — | ✅ Done |
| 8 | Reports & Analytics | INSIGHTS | Attendance Report, Leave Report, Timesheet Report, Audit Trail | ✅ Done |
| 9 | System Settings | SYSTEM | Organization Profile, Working Hours & Holidays, Announcements | ✅ Done |

---

## Files Present but Not in Sidebar

| File | Notes |
|------|-------|
| `EmailNotificationsPage.tsx` | Exists in `/settings/` but intentionally removed from sidebar. Notification config will be handled differently. |
| `AddProjectPage.tsx` | Sub-page of `AdminProjectsPage` (project creation flow), not a direct sidebar entry. |
| `AddHolidayPage.tsx` | Sub-page of `WorkingHoursPage`, not a direct sidebar entry. |

---

> See `admin-flow.md` for the exact sidebar ASCII diagram and pending Payroll section details.
