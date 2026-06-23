# Employee Role Workflow Report

**Generated:** 2026-06-20  
**Role:** Employee (Base-Level)  
**System:** Concert IDC Workforce Management Platform

---

## Executive Summary

The **Employee** role is the foundational tier in Concert IDC's three-tier role-based system (Employee → Manager → Admin). Employees operate within a self-service, self-contained interface where they manage personal work records, track time, apply for leave, request assets, file expenses, and view financial information. All employee data is scoped to their own records only—no cross-employee visibility or administrative privileges.

**Core Principle:** Employees self-manage their own work and HR activities; all approvals flow upward through Manager → Admin hierarchy.

---

## Role Structure & Access Scope

### Hierarchy Level
- **Position:** Tier 1 (Base-level)
- **Part of:** Employee → Manager → Admin (three-tier system)
- **Data Access:** Self-only (own records only)
- **Approval Rights:** None (can only submit requests)
- **Management Rights:** None

### Permission Model
- ✓ View own personal dashboard
- ✓ Create and submit timesheets
- ✓ Apply for leave (all types)
- ✓ File expense claims
- ✓ Request company assets
- ✓ View own payroll & compensation
- ✓ View organizational structure (read-only)
- ✓ Submit support tickets
- ✗ Approve other employees' timesheets
- ✗ Approve other employees' leave
- ✗ Approve asset requests
- ✗ View other employees' records

---

## Main Modules & Pages

| Module | Pages | Purpose |
|--------|-------|---------|
| **Dashboard** | Overview page | Personal metrics, alerts, team insights, attendance tracking |
| **Timesheet** | Add, History | Log work hours daily; view submission history and approval status |
| **Leave** | Create, Status, History | Apply for leave; check approval status; view request history |
| **HRMS** | My Profile, Org Structure, Tickets | View/edit profile; explore company structure; submit support tickets |
| **Assets** | My Current Assets, Request Asset | View assigned assets; submit new asset requests with justification |
| **Expense** | Claims List, Add Claim | View expense history; submit new expense claims |
| **Payroll** | Salary Slip, Compensation, Tax, Increments | View salary slips; review compensation breakdown; tax planning |
| **Reports** | Attendance, Leave, Timesheet | Generate personal work and leave reports |

---

## Core User Workflows

### Workflow 1: Daily Timesheet Submission

**Goal:** Log work hours and submit for approval  
**Trigger:** Daily or weekly (employee-driven)  
**Duration:** 2–5 minutes

#### Steps:
1. Navigate to Timesheet → **Add Timesheet**
2. Select date (today or past dates; pending dates flagged)
3. Add entry:
   - Choose project (CID-001, CID-002, etc.) from searchable list
   - Select task type (Development, Code Review, Design, Testing, etc.)
   - Enter duration (e.g., "2h 30mins")
   - Add optional comment describing work done
4. Save entry → Displays in "Saved Entries" section above form
5. Repeat: Add multiple entries for same or different dates
6. Review total hours logged (color-coded: 0–4h, 4–8h, 8h+)
7. Click **Submit Timesheet** → Confirmation modal appears
8. Confirm submission → Success modal with reference ID
9. Timesheet sent to Manager for approval

**Key Features:**
- Drag-and-drop or click-to-upload supporting docs
- Quick templates for common task types (optional)
- Draft-save functionality for in-progress timesheets
- Pending dates badge shows overdue submissions
- Edit/delete individual entries before submission

#### Approval Flow:
- Employee submits → Manager reviews/approves → Status visible in "Timesheet History"

---

### Workflow 2: Leave Request Application

**Goal:** Request leave and track approval status  
**Trigger:** Before planned leave  
**Duration:** 5–10 minutes

#### Steps:
1. Navigate to Leave → **Create Leave Request**
2. Fill form:
   - **Leave Type:** Select from dropdown (Planned Leave, Unplanned Leave, Birthday Leave, Bereavement Holiday, etc.)
   - **Start Date & End Date:** Date picker; system calculates working days automatically
   - **Remarks:** Write reason for leave (required; min 50 chars)
   - **Supporting Doc:** Optional upload (.doc, .docx, .pdf, .txt; max 2MB)
3. View instant feedback:
   - Consumed days (already used)
   - Available days (remaining balance)
   - Working days (auto-calculated from date range)
4. Use quick templates if needed (Copy reason snippets to remarks field)
5. Click **Submit Request** → Confirmation modal
6. Review all details → Click **Yes, Submit**
7. Success modal shows:
   - Reference ID (e.g., LVR-2024)
   - Approval chain info (Manager → Admin)
   - Next steps

#### Approval Flow:
- Employee submits → Manager approves (or rejects) → Admin final approval (if required) → Status visible in "Leave Status" page

#### Leave Types Available:
- Planned Leave (PL)
- Unplanned Leave (UPL)
- Birthday Leave (BL)
- Bereavement Holiday (BH)
- Paternity Leave (PAT)
- Floating Holiday (FH)
- Election Day Leave (EDL)
- LWP (Leave Without Pay)

---

### Workflow 3: Asset Request Submission

**Goal:** Request company-issued assets  
**Trigger:** When employee needs a new/replacement asset  
**Duration:** 3–8 minutes

#### Steps:
1. Navigate to Assets → **My Current Assets** (default tab shows assigned assets)
2. Review existing assets (code, category, description, assignment date)
3. Click **Request Asset** button → Switch to "Request Asset" tab
4. Fill request form:
   - **Asset Category:** Laptop, Monitor, Phone, Chair, Keys, etc.
   - **Asset Description:** Specific details (e.g., "14-inch MacBook Pro with 16GB RAM")
   - **Request Type:** New Request / Replacement / Additional
   - **Business Justification:** Explain why needed (min 100 chars, max 300)
   - **Urgency:** Not Urgent / Needed Soon (2 weeks) / Urgent (1 week)
5. Form validation: All required fields must be filled
6. Click **Submit Request** → Success message with:
   - Request ID (e.g., REQ-2024-0158)
   - Status: "Pending Admin Review"
   - Timeline: "Admin will review within 2–3 business days"

#### Approval Flow:
- Employee submits → Admin reviews & approves/rejects → Admin allocates asset → Employee notified

---

### Workflow 4: Expense Claim Filing

**Goal:** Submit expense claims for reimbursement  
**Trigger:** After incurring business expenses  
**Duration:** 3–5 minutes

#### Steps:
1. Navigate to Expense → View expense claims list
2. Click **Add New Expense**
3. Fill claim form:
   - **Expense Date:** Date when expense was incurred
   - **Category:** Outstation Travel, Local Conveyance, Miscellaneous, Periodic Official
   - **Claim Head:** Specific type (Air Travel, Bus Travel, Hotel Stay, Visa Charges, Lunch/Dinner, etc.)
   - **Amount:** Expense amount in rupees
   - **Description:** Details about the expense
   - **Receipt/Invoice:** Upload supporting document (required)
4. Click **Submit Claim** → System validates receipt
5. Success notification with claim ID
6. Expense appears in list with "Pending" status

#### Approval Flow:
- Employee submits → Manager verifies → Finance/Admin processes → Status updated (Completed/Rejected)

#### Expense Categories:
- Outstation Travel (flights, trains, accommodations)
- Local Conveyance (taxi, bus, metro)
- Miscellaneous (meals, entertainment, misc)
- Periodic Official (regular business expenses)

---

### Workflow 5: Daily Dashboard Monitoring

**Goal:** Stay informed about pending tasks, leave balance, alerts  
**Trigger:** Daily login  
**Duration:** 2–3 minutes (review)

#### Dashboard Sections:

**1. Welcome Banner & Stats (Top)**
- Personalized greeting with date
- 4 key stat cards:
  - Pending Timesheets (count of submissions due)
  - Leave Balance (days remaining)
  - Open Tickets (support requests awaiting response)
  - New Announcements (unread company-wide updates)

**2. Alerts Section (Collapsible)**
- Recent activity notifications:
  - "Your timesheet for this week has been approved"
  - "Salary slip for April 2026 has been generated"
  - "You have been assigned to new project: Pulse.AI v2"
  - "Your leave request May 22–24 has been approved"
  - "New company remote work policy published"
- Dismiss alerts individually
- Pagination (Show 5, 10, or 25 alerts)

**3. Birthday Wishes (Collapsible)**
- Team member birthdays this month (3-column grid)
- Upcoming birthdays table (next week)
- Celebration message template

**4. Team Member Status (Collapsible)**
- Visibility into team availability:
  - "John Doe is on planned leave today"
  - "David Brown is on unplanned leave"
  - "Mike Chen is working from home"
  - Badges: Planned Leave, Unplanned Leave, Work From Home, Busy

**5. Attendance Section (Right Column)**
- Current time, check-in time, out time
- Total hours worked (today)
- Attendance circle progress (% completed)
- Button to record out time
- Mini progress bar

**6. Attendance Calendar (Right Column)**
- Month/year selector
- Day-by-day status:
  - **Present:** Green (past working days)
  - **Absent:** Red (marked absent)
  - **Holiday/Weekly Off:** Blue
  - **Submitted:** Gray (pending approval)
  - **Today:** Highlighted
  - **Future:** Grayed out
- Legend: WO/CH, Leave, Multiple Status, Absent, Present, Submitted

**7. Holidays & Shift Info (Right Column)**
- Next holiday banner (e.g., "Ganesh Chaturthi — Aug 27, 2026")
- Tabs: Upcoming Holidays / Past Holidays
- Holiday table: Name, Date, Day, Type (Compulsory/Restricted)
- Footer: Weekly Offs (Sat–Sun) and Shift Time (10 AM–7 PM)

**8. Company Policy (Right Column)**
- Expandable policy tree:
  - CC_NDA
  - Employee Agreement
  - CIDC Policy Documents (folder with children):
    - CIDC Employee Handbook
    - CIDC IT Policy
    - CIDC Leave Policy
    - CIDC POSH Policy
    - CIDC General Policies & Guidelines
- Click to view/download policies

---

### Workflow 6: View Personal Reports

**Goal:** Generate and review personal work/attendance reports  
**Trigger:** Periodic review (weekly, monthly)  
**Duration:** 2–5 minutes (generate & download)

#### Available Reports:

1. **Employee Attendance Report**
   - Monthly attendance summary
   - Present/Absent/Leave/Holiday breakdown
   - Attendance percentage
   - Export as PDF/Excel

2. **Employee Leave Report**
   - Leave utilization by type
   - Approved/Pending/Rejected breakdown
   - Year-to-date leave taken
   - Remaining balance
   - Comparative view (current year vs. previous year)

3. **Employee Timesheet Report**
   - Project-wise hours logged
   - Task type breakdown
   - Weekly/monthly summary
   - Export with timestamps

#### Report Actions:
- Filter by date range
- Download as PDF/Excel
- Print-friendly view

---

### Workflow 7: Profile & Org Structure Management

**Goal:** View/update personal information and explore organizational hierarchy  
**Trigger:** Self-initiated or onboarding  
**Duration:** 2–3 minutes

#### My Profile Page:
- **Personal Info:** Name, DOB, gender, phone, email, emergency contact
- **Employment Details:** Employee ID, role, department, designation, joining date, manager
- **Address:** Current address, permanent address
- **Education:** Qualifications, certifications
- **Emergency Contacts:** Add/edit emergency contact details
- **Bank & Payment:** Bank account, salary mode (edit restricted)
- **Documents:** Verify status of submitted documents (Aadhar, PAN, etc.)
- Edit button on most sections (inline editing)

#### Org Structure Page:
- Interactive organizational chart
- Search/filter by department or name
- View peer teams
- See direct manager info
- Org-wide team visibility (read-only)

#### Tickets Page:
- Submit support tickets (IT, HR, Admin issues)
- View ticket history
- Track ticket status (Open, In Progress, Resolved, Closed)

---

### Workflow 8: Payroll Review

**Goal:** Review salary information, compensation breakdown, tax details  
**Trigger:** Monthly (post-salary credit) or as needed  
**Duration:** 2–5 minutes

#### Tabs:

1. **Salary Slip**
   - List of salary slips (past months)
   - Each slip shows:
     - Month, year, credited date
     - Gross salary, net salary
     - Earnings breakdown (Basic, HRA, Special Allowance, Transport Allowance, etc.)
     - Deductions breakdown (PF, Professional Tax, TDS, Health Insurance, etc.)
   - Download slip as PDF
   - Print option

2. **Compensation Summary**
   - Total annual compensation breakdown
   - Component-wise analysis (fixed, variable)
   - Comparative charts (YoY)

3. **Tax Planning**
   - Tax slabs & deduction summary
   - TDS calculation details
   - Investment-linked deductions
   - Tax filing status

4. **Increments**
   - Historical increment records
   - Effective date, percentage, new salary
   - Increment notifications (if any pending)

---

## Data & Approval Flows

### Timesheet Flow
```
Employee Submits
    ↓
Manager Reviews & Approves
    ↓
Status Updates: "Approved" (employee sees in History)
```

### Leave Request Flow
```
Employee Submits
    ↓
Manager Reviews (Approves/Rejects)
    ↓
Admin Final Approval (if required)
    ↓
Status Updates: "Approved" / "Rejected" (employee sees in Status page)
```

### Asset Request Flow
```
Employee Submits with Justification
    ↓
Admin Reviews & Approves/Rejects
    ↓
If Approved: Admin Allocates Asset
    ↓
Employee Notified & Asset Appears in "My Current Assets"
```

### Expense Claim Flow
```
Employee Files Claim with Receipt
    ↓
Manager Verifies
    ↓
Finance/Admin Processes
    ↓
Status: "Completed" (reimbursed) or "Rejected"
```

---

## Key Business Rules & Constraints

### Timesheet Rules
- Employees can log timesheets for current day or past dates only
- Cannot log future dates
- Pending dates are flagged on dashboard
- Multiple entries per day supported
- Duration must be in valid format (e.g., "2h", "1.5h", "30mins")
- Comment is optional but recommended for clarity
- Submission sends to Manager for approval

### Leave Rules
- Leave balance is pre-calculated by leave type
- Only applicable leave types can be selected
- Start date must be ≤ End date
- Leave cannot be applied retroactively beyond a certain threshold
- Working days automatically calculated (excludes weekends)
- Remarks are mandatory (≥50 characters)
- Leave goes through Manager → Admin approval chain
- Employee can view approval status in real-time

### Asset Request Rules
- Asset category is mandatory
- Business justification required (100–300 characters)
- Request type: New / Replacement / Additional
- Urgency can be marked but doesn't override approval process
- Supporting documents (optional) can be attached
- Admin has full authority to approve/reject
- Employee is notified of approval; asset appears in "My Current Assets"

### Expense Claim Rules
- Receipt/invoice is mandatory
- Expense date cannot be in the future
- Category and claim head must match predefined lists
- Amount must be > 0
- Manager verifies, Finance processes
- Reimbursement flows through Finance → Employee bank account

### Leave Balance Rules
- Balance calculated by leave type (PL, UPL, BL, PAT, etc.)
- Consumed and available days shown in real-time
- Balances reset annually (configurable by Admin)
- Partial day leaves may be supported (depends on policy)

---

## UI/UX Patterns & Design System

### Typography
- **Page Title (H1):** 22px, fontWeight 800, navy (#1C2035), letter-spacing -0.3px
- **Section Header:** 14px, fontWeight 700, navy
- **Label:** 11.5–12px, fontWeight 600–700, muted (#8B90A7), uppercase, letter-spacing 0.06em
- **Body Text:** 13–13.5px, fontWeight 400–500, navy/muted
- **Helper Text:** 11–12px, color muted, fontWeight 500

### Color Palette
- **Navy:** #1C2035 (primary text, headers)
- **Gold:** #F2D000 (brand accent)
- **Muted:** #8B90A7 (secondary text)
- **Border:** #E8EAF2 (light gray)
- **Surface:** #F0F2F8 (light background)
- **Success:** #10B981 / #0EA86A (green, approvals)
- **Error:** #E84855 (red, errors/warnings)
- **Indigo:** #6366F1 (primary action button)
- **Amber:** #F5A623 (warnings)

### Component Sizing
- Button height: 44px
- Input height: 44–50px
- Border radius: 10–18px (cards), 10–12px (inputs)
- Spacing: 16–24px (padding), 12–20px (gaps)

### Common Patterns
- **Collapsible sections:** Chevron toggle, smooth height animation
- **Modal dialogs:** Centered, semi-transparent backdrop, rounded corners
- **Status badges:** Rounded pill, color-coded (green, red, amber, blue)
- **Icons:** Lucide React icons, 13–18px, contextual colors
- **Form validation:** Real-time error display, required field asterisks

---

## Recent Additions & Current Implementation Status

### Fully Implemented ✅
- Dashboard with stats, alerts, birthday wishes, team status, attendance calendar
- Timesheet: Add entries, save, submit, history
- Leave: Create request, view status, history
- HRMS: My Profile (read/edit), Org Structure, Tickets
- Assets: View current, submit request (2-tab layout)
- Payroll: Salary slip, compensation tabs
- Expense: Claim list, add claim (with file upload)
- Reports: Attendance, Leave, Timesheet (generation framework)

### In Development / Coming Soon 🚧
- Asset request history / tracking (Phase 2)
- Expense claim editing & cancellation
- Advanced report filters (date range, department)
- Mobile-responsive versions
- Offline support for timesheet submission

### Not Yet Started ❌
- Employee performance feedback integration
- Training/course enrollment
- Benefits enrollment portal
- Career development planning

---

## Performance Metrics & Monitoring

### Key Metrics Tracked on Dashboard
1. **Pending Timesheets:** Count of unsubmitted timesheets (flagged in red)
2. **Leave Balance:** Remaining leave days (color-coded by urgency)
3. **Open Tickets:** HR/IT support tickets awaiting resolution
4. **Announcements:** Unread company-wide updates
5. **Attendance:** Monthly attendance percentage, day-by-day status
6. **Salary Status:** Most recent slip, net/gross breakdown

### Notifications
- Timesheet approval status updates
- Leave request decisions
- Asset allocation updates
- Expense reimbursement status
- Company announcements
- Team member status changes

---

## Access & Permissions Matrix

| Action | Employee | Manager | Admin |
|--------|----------|---------|-------|
| View own dashboard | ✓ | ✓* | ✓* |
| Submit timesheet | ✓ | ✓ | ✓ |
| Approve timesheet | ✗ | ✓ | ✓ |
| Apply for leave | ✓ | ✓ | ✓ |
| Approve leave | ✗ | ✓ | ✓ |
| Request asset | ✓ | ✓ | ✓ |
| Approve asset request | ✗ | ✗ | ✓ |
| File expense claim | ✓ | ✓ | ✓ |
| Process expense claim | ✗ | ✓ | ✓ |
| View own payroll | ✓ | ✓ | ✓ |
| View team payroll | ✗ | ✓ | ✓ |
| View own profile | ✓ | ✓* | ✓ |
| Edit own profile | ✓ | ✓* | ✓ |
| View org structure | ✓ | ✓ | ✓ |
| Generate reports | ✓ | ✓ | ✓ |

*Manager sees own data only unless given team management role; Admin sees all data.

---

## Next Steps & Recommendations

1. **Phase 2 Features:**
   - Asset request history tracking
   - Expense claim draft-save functionality
   - Advanced filtering in all list views
   - Bulk actions (submit multiple timesheets at once)

2. **Improvements:**
   - Mobile-responsive design for on-the-go submissions
   - Offline mode for timesheet entry
   - Integration with calendar apps (show leave on employee calendars)
   - Email reminders for pending timesheets

3. **Enhancement Opportunities:**
   - AI-powered timesheet templates based on project history
   - Smart leave recommendations (when to take remaining balance)
   - Payroll insights dashboard (tax optimization tips)
   - Manager insights: team workload distribution from timesheet data

---

## Conclusion

The Employee role is a comprehensive self-service module within Concert IDC that enables employees to manage their work records, leave requests, expense claims, and asset needs independently. The interface prioritizes clarity, ease of use, and real-time feedback. All requests flow upward through a Manager → Admin approval hierarchy, ensuring organizational control while giving employees agency over their own work and HR activities. The dashboard serves as the central hub, providing daily insights into pending tasks, approvals, and team dynamics.

**Last Updated:** 2026-06-20  
**Status:** Current (reflects production code state)
