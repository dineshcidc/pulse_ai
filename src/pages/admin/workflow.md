# Admin Workflow — Phase 1
**Role:** IT Organization System Administrator  
**Purpose:** Operational control over users, policies, payroll, and system configuration.  
**Note:** Admin UI is strictly operational — no employee-style sections (no personal timesheets, no personal leave, no personal payroll).

---

## Sidebar Menu Structure

### 1. Dashboard
**Purpose:** High-level operational snapshot of the entire organization.

| Widget | Content |
|--------|---------|
| Total Employees | Count of all active users in the system |
| Role Breakdown | Employee / Manager / Admin counts |
| Pending Actions | Leave requests awaiting approval, timesheets pending review |
| Recent Activity | Latest user additions, policy changes, system events |
| Quick Stats | Active projects count, departments count, monthly payroll status |

---

### 2. User Management
**Purpose:** Full lifecycle management of all system users across all roles.

| Sub-section | Content |
|-------------|---------|
| All Users | Table: Name, Email, Role, Department, Status (Active/Inactive), Joined Date |
| Add New Employee | Form: Personal info, role assignment, department, reporting manager |
| Edit / Deactivate User | Update profile details, change role, deactivate/reactivate account |
| Role & Access Control | Assign or change roles (Employee → Manager → Admin) |

---

### 3. Leave Management
**Purpose:** Configure leave policies and oversee all leave requests org-wide.

| Sub-section | Content |
|-------------|---------|
| Leave Policy Setup | Define leave types (Annual, Sick, Casual), set per-role limits, carryover rules |
| All Leave Requests | Table of all submissions across org: Employee, Type, Dates, Status, Approver |
| Leave Calendar | Org-wide calendar view showing approved leaves by team/department |
| Leave Balance Overview | Per-employee balance summary: allocated vs. consumed vs. remaining |

---

### 4. Timesheet Management
**Purpose:** Org-wide visibility and audit control over all timesheet submissions.

| Sub-section | Content |
|-------------|---------|
| All Timesheets | Table: Employee, Date Range, Project, Hours, Status (Submitted/Approved/Rejected) |
| Pending Approvals | Escalated view — timesheets awaiting manager approval beyond SLA |
| Timesheet Policies | Set submission deadlines, max daily hours, overtime rules |
| Audit Log | Change history on any timesheet edit or approval action |

--

### 5. Payroll Management
**Purpose:** Configure salary structures and oversee payroll processing.

| Sub-section | Content |
|-------------|---------|
| Salary Structure | Define base pay bands, allowances, and deduction templates per role/grade |
| Payroll Run | Trigger monthly payroll processing, review computed payslips before release |
| Payslip Management | View, download, or reissue payslips for any employee |
| Tax & Deductions Config | Set tax slabs, PF, insurance deductions at org level |

---

### 6. Departments & Projects
**Purpose:** Manage organizational structure and project assignments.

| Sub-section | Content |
|-------------|---------|
| Department Management | Create/edit departments, assign department heads |
| Project Setup | Create new projects, set timelines, assign to departments |
| Team Allocation | Assign/remove employees from projects, view project headcount |
| Project Archive | View and archive completed projects |

---

### 7. Reports & Analytics
**Purpose:** System-wide reporting for compliance, audits, and business insight.

| Report | Content |
|--------|---------|
| Attendance Report | Daily/monthly attendance status across the org |
| Leave Report | Leave consumption trends by department, role, or date range |
| Payroll Report | Monthly payroll summary: total disbursed, breakdowns by department |
| Timesheet Report | Hours logged per project, per employee, per period |
| Audit Trail | Full log of admin-level actions: user changes, policy updates, payroll runs |

---

### 8. System Settings
**Purpose:** Platform-wide configuration managed only by the Admin.

| Sub-section | Content |
|-------------|---------|
| Organization Profile | Company name, logo, address, contact details |
| Working Hours & Holidays | Define work week (Mon–Fri), public holiday calendar |
| Email Notifications | Configure which events trigger system emails and to whom |
| System Announcements | Broadcast org-wide notices visible to all roles on login |

---

## Phase 1 Summary

| # | Sidebar Menu | Priority |
|---|-------------|----------|
| 1 | Dashboard | High |
| 2 | User Management | High |
| 3 | Leave Management | High |
| 4 | Timesheet Management | Medium |
| 5 | Payroll Management | Medium |
| 6 | Departments & Projects | Medium |
| 7 | Reports & Analytics | Low |
| 8 | System Settings | Low |

---

> Phase 1 covers all core operational surfaces an IT org Admin needs day-to-day.  
> Phase 2 can extend into integrations, SSO, advanced role permissions, and analytics dashboards.
