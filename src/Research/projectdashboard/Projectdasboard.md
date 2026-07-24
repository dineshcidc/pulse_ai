# Pulse AI – Project Dashboard Module (Design Requirements)

## Module Name

**Project Dashboard**

---

# 1. Module Purpose

The Project Dashboard is an executive-level monitoring dashboard designed for Project Managers (PM), Technical Delivery Managers (TDM), Delivery Heads, and senior management.

Its purpose is **not** to create or manage projects. Instead, it provides a centralized view of all active projects, allowing managers to monitor project health, resource utilization, risks, milestones, and overall portfolio performance from a single screen.

The dashboard should help decision-makers quickly answer questions such as:

* Which projects are healthy?
* Which projects are at risk?
* Which projects are delayed?
* Which projects need immediate attention?
* How effectively are resources being utilized?
* What important milestones are coming up?
* Which projects have the highest risks?

The entire experience should feel like an **Executive Portfolio Dashboard**, focusing on insights rather than CRUD operations.

---

# 2. Design Goal

The UI should feel modern, premium, and enterprise-grade.

The dashboard should provide:

* Quick insights
* High-level KPIs
* Easy navigation
* Clean information hierarchy
* Minimal clicks
* Interactive analytics
* Fast decision-making experience

This is a **read-only analytics dashboard**.

No project creation or editing happens here.

---

# 3. User Flow

```
Open Dashboard

↓

View Portfolio Summary

↓

View Overall KPIs

↓

View Project List

↓

Click Any Project

↓

Navigate to Project Detail Dashboard

↓

Review Tasks, Resources, Risks,
Client Details and Notifications

↓

Generate Project Report (PDF)
```

---

# 4. Module Structure

The module contains **two main pages**.

---

# Page 1

## Portfolio Dashboard

Purpose

Provide a complete overview of all active projects across the organization.

This page should answer:

* How many projects are active?
* How many projects are delayed?
* Which projects require attention?
* Which projects are performing well?
* Which project has the highest utilization?
* Which milestones are approaching?

---

## Page 1 Layout

### Header

* Dashboard Title
* Current Date & Time
* Search Projects
* Profile Section

---

### KPI Cards

Show high-level business metrics.

Examples:

* Total Projects
* Active Projects
* Delayed Projects
* Completed Projects
* Average Billing Utilization
* Average Resource Utilization
* Portfolio Health
* GenAI Adoption Score

---

### Portfolio Trend

Display charts such as:

* Active Projects Trend
* Monthly Project Growth
* Portfolio Utilization
* Project Status Distribution

---

### Project Portfolio Table

Each project should display:

* Project Name
* Client Name
* Project Manager
* Duration
* Team Size
* Resource Allocation
* Billing Utilization %
* Project Health
* Risk Count
* Upcoming Milestone
* Current Status

Each row should be clickable.

Clicking a row opens the Project Detail page.

---

### Upcoming Milestones

Display upcoming milestone deadlines across all projects.

Example:

* UAT
* Production Release
* Sprint Review
* Client Demo
* Go Live

---

### Recent Notifications

Examples:

* Client requested meeting
* License renewal
* Pending approvals
* Resource allocation updates

---

# Page 2

## Project Detail Dashboard

Purpose

Provide complete information about one selected project.

This page should help managers monitor one project without opening multiple pages.

---

## Page Header

Display:

* Project Name
* Project Manager
* Client Name
* Project Duration
* Project Status
* Generate Report Button
* Back Button

---

## Section 1

### Tasks & Current Work

Display active project tasks.

Each task should include:

* Task Name
* Owner
* Due Date
* Priority
* Status

Allow filtering by status.

Examples:

* To Do
* In Progress
* Completed
* Blocked

---

## Section 2

### Resources Allocated

Display current project resources.

Each member should include:

* Employee Name
* Role
* Allocation %
* Current Availability

---

## Section 3

### Risks Identified

Display all project risks.

Each risk should include:

* Risk Title
* Severity
* Description
* Current Status

Severity Levels:

* Low
* Medium
* High
* Critical

---

## Section 4

### Client Information

Display:

* Client Name
* Primary Contact
* Engagement Type
* Renewal Date
* Account Status

---

## Section 5

### Notifications

Display project-specific updates.

Examples:

* Upcoming Demo
* Client Feedback
* License Expiry
* Release Reminder
* Pending Approval

---

## Generate Report

Provide a single button to generate a downloadable PDF report containing:

* Project Summary
* Tasks
* Resources
* Risks
* Milestones
* Client Information

---

# 5. Design Principles

The UI should:

* Feel like an enterprise management dashboard.
* Be highly visual and data-driven.
* Use charts, KPIs, badges, progress indicators, and status colors.
* Minimize scrolling where possible.
* Prioritize readability and quick decision-making.
* Follow a consistent card-based layout.
* Be responsive and scalable for future enhancements.

---

# 6. Navigation Flow

```
Portfolio Dashboard

↓

Select Project

↓

Project Detail Dashboard

↓

Generate Report
```

---


# Final Goal

Design a world-class enterprise Project Dashboard that enables managers and leadership teams to monitor the entire project portfolio from a single interface and drill down into individual project details with minimal effort.

The experience should emphasize clarity, speed, actionable insights, and professional enterprise UI standards similar to Jira Portfolio, Azure DevOps Dashboards, Monday.com, ClickUp, and Microsoft Project dashboards.


<!-- Above is Secondary Task -->


<!-- Primary Task  -->


# Pulse AI – Project Reporting Management Module

## Purpose

Before designing the **Portfolio Dashboard** and **Project Detail Dashboard**, we must first design the modules responsible for collecting project data.

The dashboard is a **read-only analytics interface**. It does not allow users to create, edit, or update project information. Every metric, KPI, chart, project status, risk indicator, milestone, and utilization value displayed on the dashboard must come from structured reports submitted by Project Managers.

Therefore, the first step is to build a complete **Project Reporting Management Module** consisting of two user roles:

* **Admin**
* **Project Manager**

This module will act as the data source for the Executive Dashboard.

---

# Overall Workflow

```
Admin

↓

Create Reporting Templates

↓

Assign Templates to Projects

↓

Project Manager

↓

Open Assigned Project

↓

Fill Weekly / Biweekly / Monthly Report

↓

Submit Report

↓

Data Stored in System

↓

Portfolio Dashboard

↓

Project Detail Dashboard
```

The Portfolio Dashboard and Project Detail Dashboard should never require manual data entry. They should automatically display the latest information submitted through the Project Reporting Module.

---

# Module 1 – Admin Portal

## Purpose

The Admin Portal is responsible for configuring the project reporting process across the organization.

Instead of entering project updates, the Admin defines **what information every Project Manager must submit** during weekly, biweekly, or monthly reporting cycles.

The Admin controls the reporting structure, ensuring that every project follows the same reporting standard.

---

## Admin Responsibilities

The Admin should be able to:

* Create reporting templates.
* Configure Weekly, Biweekly, and Monthly reporting formats.
* Define the sections included in each report.
* Decide which fields are mandatory.
* Configure validation rules.
* Assign templates to one or multiple projects.
* Enable or disable reporting sections.
* Manage reporting schedules.
* Monitor report submission status.
* Track overdue or missing reports.
* View reporting history.

---

## Admin UI Structure

The Admin interface should include the following pages:

### Dashboard

* Reporting summary
* Total projects
* Reports submitted
* Pending reports
* Overdue reports
* Reporting analytics

### Reporting Templates

* Create Template
* Edit Template
* Delete Template
* Duplicate Template
* Preview Template

### Template Builder

Allow the Admin to configure reporting sections such as:

* Project Health
* Current Status
* Task Progress
* Resource Allocation
* Billing Utilization
* Risks
* Issues
* Upcoming Milestones
* Client Updates
* Achievements
* Next Sprint Plan
* Additional Notes

Each section should support configurable fields.

---

### Project Assignment

Allow Admin to:

* Select Project
* Select Reporting Template
* Select Reporting Frequency
* Assign Project Manager
* Activate Reporting Schedule

---

### Report Monitoring

Display:

* Submitted Reports
* Pending Reports
* Late Reports
* Last Submission Date
* Submission History

---

# Module 2 – Project Manager Portal

## Purpose

The Project Manager Portal is the primary data entry module.

Every Project Manager should be able to submit structured reports for their assigned projects.

The information entered here becomes the single source of truth for executive dashboards, analytics, and reports.

Managers should never manually update the dashboard. Instead, they update their project reports, and the dashboard automatically reflects the latest information.

---

## Project Manager Responsibilities

The Project Manager should be able to:

* View assigned projects.
* Open reporting forms.
* Submit Weekly, Biweekly, or Monthly reports.
* Save draft reports.
* Edit reports before submission.
* View submission history.
* Review previous reports.
* Track reporting deadlines.

---

## Project Manager UI Structure

### Dashboard

Display:

* My Projects
* Pending Reports
* Submitted Reports
* Upcoming Reporting Deadlines
* Recent Notifications

---

### My Projects

Display a project list including:

* Project Name
* Client Name
* Project Status
* Reporting Frequency
* Next Submission Date
* Report Status

Each project card or row should open its reporting page.

---

### Project Report Page

Each report should contain structured sections such as:

#### Project Overview

* Project Status
* Overall Health
* Progress Percentage
* Reporting Period

#### Task Progress

* Completed Tasks
* In Progress Tasks
* Blocked Tasks
* Delayed Tasks

#### Resource Information

* Team Size
* Resource Allocation
* Resource Utilization
* Availability

#### Risks

* Risk Title
* Severity
* Description
* Mitigation Plan

#### Issues

* Current Issues
* Impact
* Resolution Plan

#### Milestones

* Completed Milestones
* Upcoming Milestones
* Delayed Milestones

#### Client Updates

* Client Feedback
* Meetings
* Approvals
* Escalations

#### Billing & Utilization

* Billing Utilization
* Resource Utilization
* Budget Notes

#### Additional Notes

* Achievements
* Challenges
* Next Week Plan
* Remarks

---

### Report Actions

The Project Manager should be able to:

* Save as Draft
* Submit Report
* Edit Draft
* View Previous Reports
* Download Submitted Report

---

# Relationship with the Executive Dashboard

The Project Reporting Management Module is the foundation of the entire Pulse AI analytics platform.

Every project update submitted by Project Managers becomes the data source for:

* Portfolio Dashboard
* Project Detail Dashboard
* Executive KPIs
* Portfolio Health Indicators
* Resource Utilization Charts
* Billing Analytics
* Risk Analytics
* Milestone Tracking
* Notifications
* Executive PDF Reports

Without this reporting module, the dashboards would have no reliable or standardized data to display.

---

# Final Design Goal

Design a modern, enterprise-grade Project Reporting Management System that allows Administrators to define standardized reporting templates and enables Project Managers to submit structured project updates with minimal effort.

The entire experience should be intuitive, professional, and scalable, ensuring that all executive dashboards display accurate, consistent, and real-time project information across the organization.
