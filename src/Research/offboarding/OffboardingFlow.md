# Employee Offboarding — Functional Overview

**Document type:** High-level business flow (for BA review)
**Status:** For review before design begins

---

## 1. Module Overview & Purpose

Employee Offboarding is the structured process a company follows when an employee **leaves** — through resignation, termination, retirement, or end of contract.

**Purpose:** exit the employee cleanly by ensuring the company recovers its assets, transfers knowledge, clears dues, collects feedback, revokes system access, and issues the required exit documents — so nothing is lost and the employee leaves on good terms.

The module works across three roles following the standard approval chain:

> **Employee submits → Manager approves → Admin (HR) finalises**

**How it starts:**
- **Resignation** — the employee raises an exit request (most common), **or**
- **Termination / Contract end** — Admin (HR) initiates the process.

**How it ends:** when all clearances are complete, the Full & Final settlement is paid, exit documents are issued, and employee access is deactivated — the record then becomes a read-only **Ex-Employee**.

---

## 2. End-to-End Offboarding Workflow

| Step | Stage | Owner | What happens |
|------|-------|-------|--------------|
| 1 | **Resignation Raised** | Employee / Admin | Employee submits resignation (reason + intended last working day), or Admin initiates for a termination. |
| 2 | **Manager Review** | Manager | Manager accepts the resignation and confirms the **Last Working Day (LWD)**. |
| 3 | **Notice Period Started** | System | The notice period begins; the employee continues working toward the LWD. |
| 4 | **Offboarding Initiated** | Admin (HR) | HR opens the case and generates the **clearance checklist**. |
| 5 | **Clearance In Progress** | All roles | Knowledge transfer → manager clearance → exit interview → finance & HR clearance are completed; asset return and access revocation follow on the last working day. |
| 6 | **Full & Final (F&F)** | Admin (HR) | Final dues are calculated and settled (salary, leave encashment, deductions, recoveries). |
| 7 | **Documents & Closure** | Admin (HR) | Exit documents are issued, access is deactivated, and the case is closed. |

**Status flow:**

```
Draft → Submitted → Accepted → Notice Period Started → Clearance In Progress
      → F&F Pending → Documents Issued → Offboarded
```

*A request can be **Withdrawn** by the employee or **Rejected** by the manager before it is accepted.*

---

## 3. Clearance Checklist

The clearance checklist is the central tracking point of the whole process. Every role views and updates the same checklist.

| Order | Clearance Item | Responsible | When |
|-------|----------------|-------------|------|
| 1 | Knowledge Transfer | Employee | During notice period |
| 2 | Manager Clearance | Manager | After knowledge transfer |
| 3 | Exit Interview | Employee / HR | Final days |
| 4 | Finance Clearance | Finance | Final week |
| 5 | HR Clearance | HR | Final week |
| 6 | Asset Return | Employee / IT | On the last working day |
| 7 | IT Access Revoked | IT | End of the last working day |

> **Important:** The employee **keeps their laptop and system access for the entire notice period** to continue working and to complete the handover. **Asset Return and IT Access Revocation are therefore the final steps, performed on the Last Working Day** — they cannot be completed earlier.

---

## 4. Role Responsibilities

### Employee
- Raise the resignation / exit request.
- Serve the notice period and complete assigned exit tasks.
- Document and hand over ongoing work (knowledge transfer).
- Return company assets.
- Complete the exit interview.
- Download exit documents once issued.

### Manager
- Review and accept (or reject) the resignation.
- Confirm the Last Working Day.
- Ensure knowledge transfer and handover are complete.
- Provide team-level clearance.

### Admin (HR)
- Track all active and past offboarding cases.
- Initiate offboarding for terminations / contract ends.
- Manage and verify all clearances (HR, IT, Finance, Manager).
- Review exit feedback.
- Calculate and settle the Full & Final payment.
- Issue exit documents.
- Deactivate all employee access and close the case.

> **Note (current phase):** A single **Admin** login manages all HR, IT, and Finance clearances. Dedicated Finance and System Support roles can be introduced in a later phase.

---

## 5. Menu Structure by Role

### Employee
| Menu | Purpose |
|------|---------|
| Resignation / Exit Request | Submit resignation and track its status. |
| My Offboarding | View overall progress, clearance checklist, and last working day. |
| Handover / Knowledge Transfer | Record work being handed over. |
| Exit Interview | Submit exit feedback. |
| Asset Return | Return assigned company assets. |
| Exit Documents | Download exit documents once issued. |

### Manager
| Menu | Purpose |
|------|---------|
| Team Offboarding | View and act on team members' resignations; confirm LWD. |
| Knowledge Transfer / Handover | Track and confirm work handover. |
| Manager Clearance | Provide final team-side clearance. |

### Admin (HR)
| Menu | Purpose |
|------|---------|
| Offboarding Dashboard | Overview of all cases with summary KPIs. |
| Initiate Offboarding | Start offboarding for a termination / contract end. |
| Clearance Management | Track and verify all department clearances. |
| Exit Interview Review | Review submitted exit feedback. |
| Full & Final (F&F) | Calculate and settle final dues. |
| Exit Documents | Generate and issue exit documents. |
| Deactivate Employee Access | Revoke all system access and close the case. |

---

## 6. Exit Documents

The following documents are issued to the employee at closure:

- Relieving Letter
- Experience Letter
- Full & Final Settlement Statement
- Payslips
- Form 16 *(optional)*

---

*This is a high-level functional overview intended for BA review prior to design.*
