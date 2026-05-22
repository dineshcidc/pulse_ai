# Project Manager Role — Workflow Definition

## Overview

The **Project Manager** role is the mid-tier role in the Concert IDC workforce management platform.
A Manager inherits all Employee self-service capabilities and gains additional authority to
monitor, approve, and coordinate activities across one or more assigned projects.

Role hierarchy:
> **Employee → Manager → Admin**

A Manager is simultaneously an employee of the organization (they log their own time, apply
for leave, etc.) AND a supervisor responsible for the work and approvals of their project teams.

---

## Sidebar Structure

```
Manager Sidebar
├── Dashboard          ← Enhanced personal + team view
├── Timesheet          ← Own timesheet (same as Employee)
├── Leave              ← Own leave management (same as Employee)
├── HRMS               ← Profile, org chart, tickets (same as Employee)
├── Reports            ← Personal + team reports (extended)
└── My Projects        ← Manager-exclusive control panel
```

All Employee menus are present. "My Projects" is the only net-new menu entry.
Reports is shared but receives additional team-level data for the Manager role.

---

## Module Structure

```
manager/
├── dashboard/         → Enhanced dashboard — personal stats + team activity snapshot
├── timesheet/         → Re-uses employee timesheet pages (own entries only)
├── leave/             → Re-uses employee leave pages (own requests only)
├── hrms/              → Re-uses employee HRMS pages (profile, org, tickets)
├── reports/           → Extended reports — own + team/project level
└── projects/          → My Projects — full project control panel
    ├── ProjectListPage.tsx        → All assigned projects with status cards
    ├── ProjectDetailPage.tsx      → Single project deep-dive
    ├── TeamMembersPage.tsx        → Members list per project + roles
    ├── TimesheetTrackingPage.tsx  → Project-wise timesheet entries by member
    └── ApprovalsPage.tsx          → Pending timesheet & leave approvals
```

---

## Feature Matrix

| Module        | Pages / Sections                                              | Who Sees It       |
|---------------|---------------------------------------------------------------|-------------------|
| Dashboard     | Personal stats + Team activity feed + Pending approvals count | Manager only      |
| Timesheet     | Add Timesheet · History (own)                                 | Inherited         |
| Leave         | Create · Status · History (own)                               | Inherited         |
| HRMS          | My Profile · Org Structure · Tickets                          | Inherited         |
| Reports       | Personal reports + Project/Team reports                       | Extended          |
| My Projects   | Project List · Project Detail · Team Members                  | Manager only      |
|               | Timesheet Tracking · Approvals                                | Manager only      |

---

## My Projects — Module Deep Dive

This is the core of the Manager role. It acts as the central command panel for all
projects the Manager is responsible for.

### 1. Project List Page (`ProjectListPage.tsx`)

Purpose: Entry point — shows all projects assigned to this manager.

Cards display:
- Project name + client / department
- Project status badge: Active · On Hold · Completed
- Date range (start → end)
- Team size (member count)
- Overall completion % (progress bar)
- Pending approval count (badge alert)

Actions:
- Click card → navigate to Project Detail
- Filter by status (Active / On Hold / Completed)
- Search by project name

---

### 2. Project Detail Page (`ProjectDetailPage.tsx`)

Purpose: Single project overview. Acts as the hub for all project sub-sections.

Sections:
- Project header (name, client, dates, status, description)
- Stat row: Total Hours Logged · Team Members · Pending Approvals · Completion %
- Tab navigation:
  - Team Members
  - Timesheet Tracking
  - Approvals
  - Activity Log

---

### 3. Team Members Page (`TeamMembersPage.tsx`)

Purpose: View all members assigned to a project with their current status.

Table columns:
- Employee name + avatar
- Designation / Role
- Joining date on project
- Total hours logged this month
- Leave status (active leave flag)
- Status badge: Active · On Leave · Inactive

Actions:
- View individual member timesheet history
- No add/remove — team assignment is Admin responsibility

---

### 4. Timesheet Tracking Page (`TimesheetTrackingPage.tsx`)

Purpose: Monitor time logged by every team member across the project.

Filters:
- Date range picker
- Member selector (dropdown — all members or specific)
- Status filter: All · Pending · Approved · Rejected

Table columns:
- Employee name
- Date
- Hours logged
- Work description / task
- Submission status
- Action: Approve · Reject (inline, for Pending rows)

Summary row:
- Total hours logged for selected period
- Approved vs Pending breakdown

---

### 5. Approvals Page (`ApprovalsPage.tsx`)

Purpose: Centralized queue for all pending actions requiring manager sign-off.

Two tabs:

**Timesheet Approvals tab**
- Lists all submitted timesheets from team members across all projects
- Columns: Employee · Project · Date · Hours · Description · Status · Action
- Bulk approve option for multiple rows

**Leave Approvals tab**
- Lists all pending leave requests from team members
- Columns: Employee · Leave type · From · To · Days · Reason · Action
- Approve / Reject with optional remarks field
- Approved leaves are forwarded to Admin for final record-keeping

---

## Dashboard Enhancements (Manager vs Employee)

The Manager Dashboard inherits the Employee dashboard layout and adds:

| Widget                    | Source          |
|---------------------------|-----------------|
| My Hours This Week        | Own timesheet   |
| My Leave Balance          | Own leave       |
| Pending Approvals (count) | Approval queue  |
| Team Activity Feed        | Team timesheets |
| Project Status Overview   | My Projects     |
| Members on Leave Today    | Team leave data |

Pending approvals count is always visible in the sidebar badge and dashboard widget
to ensure the Manager never misses an action item.

---

## Reports Enhancements (Manager vs Employee)

Employee reports: personal work data only.
Manager reports add:

- **Team Timesheet Summary** — hours by member, by project, by date range
- **Project Hours Report** — total hours vs estimated per project
- **Leave Usage Report** — team leave patterns and frequency
- **Approval Turnaround Report** — how quickly approvals are being processed

Export format: CSV download (same as Employee pattern).

---

## Key Business Rules

1. A Manager may be assigned to 2–3 projects simultaneously.
2. Manager approves timesheets first; Admin has final visibility.
3. Manager approves/rejects leave; record is finalized by Admin.
4. Manager can only see data for projects explicitly assigned to them — not org-wide.
5. Manager cannot modify team assignments — that is Admin territory.
6. Manager's own timesheet and leave go through the Admin approval path (no self-approval).
7. All approval actions are timestamped and audit-logged.

---

## Build Sequence (Recommended)

Build in this order to keep dependencies clean:

1. `ProjectListPage` — no data dependencies, pure display
2. `ProjectDetailPage` — wraps the three sub-pages via tabs
3. `TeamMembersPage` — read-only, no approval logic
4. `TimesheetTrackingPage` — approval actions start here
5. `ApprovalsPage` — unified queue pulling from timesheets + leave
6. `ManagerDashboard` — assembles widgets from all of the above
7. Reports extension — add team/project sections to existing reports shell

---

## Design Language

Follows the same Concert IDC design system as the Employee flow:

- Sidebar: `#1C2035` navy background, `#F2D000` gold active indicator
- Surface: `#F0F2F8` page background, `#FFFFFF` cards
- Accent gradient: `#E84855` → `#F5A623` (coral to amber) for highlights
- Card border: `#E4E6EF`
- Status badges:
  - Active: green (`#22C55E`)
  - Pending: amber (`#F5A623`)
  - On Hold: slate (`#94A3B8`)
  - Rejected: red (`#E84855`)
  - Completed: blue (`#3B82F6`)
