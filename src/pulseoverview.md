# Pulse.AI — Project Overview

Quick-start context for AI/dev sessions. Read this first.

## Goal
Pulse.AI is an enterprise **workforce & asset management** SaaS UI — timesheets, leave, payroll, projects, HR, and asset workflows across three role-based portals. This repo is **frontend-only, mock data** (no backend/API); everything is in-memory React state.

## Tech Stack
- **React 19 + TypeScript + Vite**
- **lucide-react** (icons), **Tailwind CSS v4** (some utility classes) + heavy **inline `style={{}}`** styling
- Font: `DM Sans`. No react-router, no state library.
- Scripts: `npm run dev`, `npm run build` (`tsc -b && vite build`), `npm run lint`.

## App Flow
`src/App.tsx` holds a `page` state → renders `LoginPage` → on login role picks one of three dashboards:
- `LoginPage` (`onLoginSuccess(role)`) → `admin` / `manager` / `employee` dashboard.
- Each dashboard (`AdminDashboard`, `ManagerDashboard`, `EmployeeDashboard`) keeps an **`activeItem`** string state and renders the matching page (`if (activeItem === 'x') return <XPage/>`). **Navigation = `onNavigate(id)` updating `activeItem`** (not routes). The `Sidebar` sets `activeItem`.

## Roles & Main Modules
- **Admin** — org-wide control: Dashboard, Users (All Users, Roles & Access, Designations), Projects, **Asset Management (Assets List, Asset Allocation, Assets Request incl. Return approval)**, Leave, Timesheet, Reports, Settings.
- **Manager** — team-level: Dashboard, Projects (My Projects), Team timesheets/leave, **Assets (My Current Assets, My Requests, Return Request)**.
- **Employee** — self-service: Dashboard, Timesheet, Leave, Payroll, **Assets (My Current Assets, Asset Requests, Return Request)**, HR/Tickets, Reports.

## Folder Structure
```
src/
  App.tsx                 # role → dashboard switch
  main.tsx
  components/layout/      # Sidebar, Header (shared nav)
  pages/
    auth/                 # LoginPage
    admin/    AdminDashboard.tsx + admin/{users,projects,assets,leave,...}
    manager/  ManagerDashboard.tsx + manager/{projects,assets}
    employee/ EmployeeDashboard.tsx + employee/{assets,leave,timesheet,...}
```
Each `*Dashboard.tsx` is the router; feature pages live in role subfolders. Some components are shared across roles (e.g. `EmployeeReturnRequestDetailsPage` reused by manager).

## Key Workflows
- **Asset Allocation → Request**: Admin allocates in *Asset Allocation* → creates entries in *Assets Request*; employee/manager Accept moves asset to their *Current Assets*.
- **Asset Return**: Employee/Manager submit a Return Request → Admin reviews in *Assets Request → Asset Return Request* tab → Approve/Reject (with note) → status `Pending → Accepted/Rejected`; history timeline kept.

## Conventions
- Shared color palette per file: `const C = { navy:'#1C2035', border:'#E8EAF2', muted:'#8B90A7', ... }`. Accent indigo `#6366F1`; primary button = navy `#1C2035`.
- Status colors: green (active/approved), amber (pending/on-hold), red (rejected), blue (completed).
- Detail/sub pages take `onBack`/`onNavigate` props and are shown via early `return` in the parent page (not routes).
- Data lives as `const`/`useState` mock arrays at the top of each page.
- Keep grid tables aligned with `minmax(0, Nfr)` columns; long text truncates with a char-slice + `...`.
- After changes, verify with `npx tsc --noEmit`.
