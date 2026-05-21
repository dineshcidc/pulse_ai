# Employee Role

## Overview

The **Employee** role is the base-level role in the Concert IDC workforce management platform. Employees can manage their own work records, track time, apply for leave, and view personal HR information — all within a self-service interface.

This role is part of a three-tier role-based system:
> **Employee → Manager → Admin**

---

## Module Structure

```
employee/
├── dashboard/        → Personal dashboard with quick stats and activity
├── timesheet/        → Log daily work entries and view submission history
├── leave/            → Apply for leave, track approval status and history
├── hrms/             → Profile, org structure, and support tickets
├── payroll/          → View payslips and salary details
└── reports/          → Personal work and activity reports
```

---

## Features

| Module     | Pages                                          |
|------------|------------------------------------------------|
| Dashboard  | Overview — hours, leave balance, recent activity |
| Timesheet  | Add Timesheet · Timesheet History              |
| Leave      | Create Request · Approval Status · History     |
| HRMS       | My Profile · Org Structure · Tickets           |
| Payroll    | Payslip viewer                                 |
| Reports    | Personal reports                               |

---

## Key Rules

- Employees can only view and manage **their own data**
- Timesheets submitted go to the **Manager** for approval
- Leave requests follow the **Manager → Admin** approval chain
- No access to other employees' records or admin controls
