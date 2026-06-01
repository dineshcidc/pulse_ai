# Admin Workflow — Current Implementation
**Role:** IT Organization System Administrator  
**Purpose:** Operational control over users, policies, and system configuration.  
**Note:** Admin UI is strictly operational — no employee-style sections (no personal timesheets, no personal leave, no personal payroll).  
**Last Updated:** June 1, 2026 — reflects menus fully designed and live in the UI.

---

## Sidebar Menu Structure (Implemented)

### 1. Dashboard
**Section:** (top-level, no section header)  
**Route ID:** `admin-dashboard`  
**Page:** `AdminDashboardPage`  
**Purpose:** High-level operational snapshot of the entire organization.

| Widget | Content |
|--------|---------|
| Total Employees | Count of all active users in the system |
| Role Breakdown | Employee / Manager / Admin counts |
| Pending Actions | Leave requests awaiting approval, timesheets pending review |
| Recent Activity | Latest user additions, policy changes, system events |
| Quick Stats | Active projects count, departments count |

---

### 2. User Management
**Section:** (top-level, no section header)  
**Route ID:** `user-management`  
**Purpose:** Full lifecycle management of all system users across all roles.

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| All Users | `all-users` | `AllUsersPage` | ✅ Implemented |
| Add Employee | `add-employee` | `AddEmployeePage` | ✅ Implemented |

> **Note:** Role & Access Control (`RoleAccessPage`) is built and routed at `role-access` but is not yet exposed as a sidebar menu item. It is accessible via internal navigation from the All Users page.

---

### 3. Leave Management
**Section:** OPERATIONS  
**Route ID:** `admin-leave`  
**Purpose:** Org-wide visibility and control over all leave requests.

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| All Leave Requests | `all-leave-requests` | `AllLeaveRequestsPage` | ✅ Implemented |
| Leave Balance Overview | `leave-balance` | `LeaveBalancePage` | ✅ Implemented |

---

### 4. Timesheet Management
**Section:** OPERATIONS  
**Route ID:** `admin-timesheet`  
**Purpose:** Org-wide visibility and audit control over all timesheet submissions.

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| All Timesheets | `all-timesheets` | `AllTimesheetsPage` | ✅ Implemented |
| Pending Timesheets | `pending-timesheets` | `PendingTimesheetsPage` | ✅ Implemented |

---

### 5. Projects & Departments
**Section:** ORGANIZATION  
**Route ID:** `dept-projects`  
**Purpose:** Manage organizational structure and project assignments.

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| Projects | `project-setup` | `AdminProjectsPage` | ✅ Implemented |
| Department Management | `department-management` | `DepartmentManagementPage` | ✅ Implemented |

---

### 6. Org Structure
**Section:** ORGANIZATION  
**Route ID:** `admin-org`  
**Page:** `AdminOrgStructurePage`  
**Purpose:** Visual org chart showing company hierarchy across departments and roles.

---

### 7. Reports & Analytics
**Section:** INSIGHTS  
**Route ID:** `admin-reports`  
**Purpose:** System-wide reporting for compliance and business insight.

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| Attendance Report | `attendance-report` | `AttendanceReportPage` | ✅ Implemented |
| Leave Report | `leave-report` | `LeaveReportPage` | ✅ Implemented |

---

### 8. System Settings
**Section:** SYSTEM  
**Route ID:** `system-settings`  
**Purpose:** Platform-wide configuration managed only by the Admin.

| Sub-menu | Route ID | Page | Status |
|----------|----------|------|--------|
| Organization Profile | `org-profile` | `OrgProfilePage` | ✅ Implemented |
| Working Hours & Holidays | `working-hours` | `WorkingHoursPage` | ✅ Implemented |
| Announcements | `announcements` | `AdminAnnouncementsPage` | ✅ Implemented |

---

## Implemented Summary

| # | Sidebar Menu | Section | Sub-menus | Status |
|---|-------------|---------|-----------|--------|
| 1 | Dashboard | — | — | ✅ Done |
| 2 | User Management | — | All Users, Add Employee | ✅ Done |
| 3 | Leave Management | OPERATIONS | All Leave Requests, Leave Balance Overview | ✅ Done |
| 4 | Timesheet Management | OPERATIONS | All Timesheets, Pending Timesheets | ✅ Done |
| 5 | Projects & Departments | ORGANIZATION | Projects, Department Management | ✅ Done |
| 6 | Org Structure | ORGANIZATION | — | ✅ Done |
| 7 | Reports & Analytics | INSIGHTS | Attendance Report, Leave Report | ✅ Done |
| 8 | System Settings | SYSTEM | Organization Profile, Working Hours & Holidays, Announcements | ✅ Done |

---

> See `admin-flow.md` for the exact sidebar order and the full list of menus still to be designed.
